/**
 * Credential Guardian Hook
 *
 * PreToolUse hook that blocks Read tool access to credential files.
 * Prevents accidental or intentional exposure of sensitive credentials.
 *
 * Trigger: PreToolUse on Read tool
 * Action: Block access to credential files with clear error message
 *
 * Security Layers:
 * - Layer 1: AI instructions prohibit credential access
 * - Layer 2: This hook blocks Read tool on production credentials
 * - Layer 3: Pre-commit hooks prevent credential commits
 *
 * Template files (.env.example, .env.template) are allowed:
 * - Safe to commit (in git)
 * - Never contain real credentials by design
 * - Content validation ensures no leaked secrets
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CredentialGuardianInputSchema, safeValidate, formatValidationErrors } from './schemas';
import { validatePath } from '@/tools/framework/utils/path-resolution';
import { logSecurityEvent, extractFilePattern } from '@/tools/framework/utils/audit-trail';
import {
  sanitizeFilePath,
  sanitizeErrorMessage,
  logInternalError,
  formatSecurityError,
  formatValidationError
} from '@/tools/framework/utils/error-sanitizer';

// Max input size to prevent memory exhaustion attacks
const MAX_INPUT_SIZE = 1048576; // 1MB

// Template file patterns (always allowed - safe to commit, never contain real credentials)
const TEMPLATE_PATTERNS = [
  /\.env\.example$/i,
  /\.env\.template$/i,
  /env\.example$/i,
  /env\.template$/i,
];

// Patterns for suspicious credentials in files (used for content validation)
// All patterns have bounded quantifiers to prevent ReDoS attacks
const SUSPICIOUS_CREDENTIAL_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,256}/,      // OpenAI-style keys (bounded: max 256 chars)
  /pk-[a-zA-Z0-9]{32,256}/,      // Anthropic-style keys (bounded: max 256 chars)
  /[a-f0-9]{40}/,                 // Generic 40-char hex (GitHub, AWS access keys)
  /xoxb-[0-9]{1,20}-[0-9]{1,20}-[a-zA-Z0-9]{1,256}/, // Slack bot tokens (bounded)
  /ghp_[a-zA-Z0-9]{36}/,         // GitHub personal access tokens
  /gho_[a-zA-Z0-9]{36}/,         // GitHub OAuth tokens
  /ghu_[a-zA-Z0-9]{36}/,         // GitHub user-to-server tokens
  /-----BEGIN[\s\S]{1,100}?RSA[\s\S]{1,100}?KEY-----/i, // RSA private keys (bounded, max 100 chars each)
  /-----BEGIN[\s\S]{1,200}?KEY-----/i,     // Generic private keys (bounded, max 200 chars)
];

// Credential file patterns (case-insensitive matching)
const CREDENTIAL_PATTERNS = [
  // Environment files
  /\.env$/i,
  /\.env-/i,

  // API keys and tokens
  /credentials?\.json$/i,
  /.*-credentials?\.json$/i,
  /api-?key\./i,          // Matches: api-key.txt, apikey.json, myapp-api-key.env
  /\/api-?key$/i,         // Matches: /path/to/api-key, /path/to/apikey
  /access-?token\./i,     // Matches: access-token.txt, access_token.json
  /auth-?token\./i,       // Matches: auth-token.txt, authtoken.json
  /\.token$/i,            // Matches: myapp.token
  /\/\.?token$/i,         // Matches: /path/to/token, /path/to/.token

  // Authentication cookies
  /.*-cookies?\.json$/i,

  // SSH and certificate files
  /\.pem$/i,
  /\.key$/i,
  /id_rsa/i,
  /id_ed25519/i,
  /\.p12$/i,
  /\.pfx$/i,

  // Cloud provider credentials
  /\.aws\/credentials$/i,
  /\.gcp\/credentials$/i,
  /\.azure\/credentials$/i,

  // Database connection strings
  /database\.yml$/i,
  /database\.json$/i,

  // Service account keys
  /service-?account.*\.json$/i,

  // OAuth and API configs
  /oauth.*\.json$/i,
  /api-?config.*\.json$/i,
];

// Max size for template content scanning to prevent ReDoS
const MAX_SCAN_SIZE = 1048576; // 1MB

function validateTemplateContent(filePath: string): boolean {
  /**
   * Validate that template files don't contain real credentials
   * Returns true if content is safe (only placeholders), false if suspicious
   *
   * Prevents ReDoS attacks by limiting scan size and using bounded regex patterns
   */
  if (!existsSync(filePath)) {
    return true; // File doesn't exist, allow the read (error will happen elsewhere)
  }

  try {
    let content = readFileSync(filePath, 'utf-8');

    // SECURITY: Limit scan size to prevent ReDoS attacks
    // Large files are scanned only up to MAX_SCAN_SIZE
    if (content.length > MAX_SCAN_SIZE) {
      content = content.slice(0, MAX_SCAN_SIZE);
    }

    // Check for suspicious patterns that indicate leaked credentials
    const hasSuspiciousContent = SUSPICIOUS_CREDENTIAL_PATTERNS.some(pattern =>
      pattern.test(content)
    );

    return !hasSuspiciousContent; // True if no suspicious content found
  } catch {
    return true; // If we can't read, allow (error will happen elsewhere)
  }
}

async function main() {
  const input = await Bun.stdin.text();

  try {
    // Validate input size to prevent memory exhaustion
    if (input.length > MAX_INPUT_SIZE) {
      console.error('❌ SECURITY VIOLATION: Input exceeds maximum size');
      console.error(`Size: ${input.length} bytes (max: ${MAX_INPUT_SIZE})`);
      console.error('');
      console.error('This prevents memory exhaustion attacks.');
      process.exit(2);
    }

    // Parse JSON with safety checks
    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch (parseErr) {
      console.error('❌ VALIDATION ERROR: Malformed JSON input');
      console.error(`Error: ${sanitizeErrorMessage(parseErr)}`);
      console.error('');
      console.error('Hook received invalid JSON. Operations cannot proceed.');
      process.exit(2);
    }

    // Check if this is a Read tool call early, before strict schema validation
    // This allows the hook to pass through non-Read tools quickly
    const toolName = (data as Record<string, unknown>)?.tool_name;
    if (toolName !== 'Read') {
      process.exit(0);
    }

    // Validate input schema for Read tool calls
    const validation = safeValidate(CredentialGuardianInputSchema, data);
    if (!validation.success) {
      console.error(formatValidationError(validation.errors.map(e => ({
        path: e.path,
        message: e.message
      }))));
      console.error('');
      console.error('Expected schema: { tool_name: "Read", tool_input: { file_path: string } }');
      process.exit(2);
    }

    const filePath = validation.data.tool_input.file_path;

    // SECURITY: Validate path to prevent symlink attacks and path traversal
    // This must be done before credential checks to block attacks like:
    // - Symlinks to /etc/passwd
    // - Path traversal with ../ sequences
    // - Windows device name attacks (CON, PRN, etc.)
    const pathValidation = validatePath(filePath);
    if (!pathValidation.valid) {
      // Determine attack type for logging
      const attackType = pathValidation.error?.includes('symlink')
        ? 'symlink_attack_blocked'
        : pathValidation.error?.includes('device')
        ? 'device_access_blocked'
        : 'path_traversal_blocked';

      logSecurityEvent({
        event_type: attackType as 'symlink_attack_blocked' | 'device_access_blocked' | 'path_traversal_blocked',
        tool_name: 'Read',
        severity: 'critical',
        reason: pathValidation.error || 'Path validation failed',
        context: {
          file_pattern: extractFilePattern(filePath),
          original_path: filePath
        }
      });

      console.log(formatSecurityError({
        title: '🛡️  CREDENTIAL GUARDIAN: PATH SECURITY VIOLATION',
        filePath: filePath,
        reason: pathValidation.error || 'Path validation failed',
        policy: [
          'This prevents attacks via:',
          '- Symlinks pointing to sensitive files',
          '- Path traversal (../) sequences',
          '- Windows device names (CON, PRN, AUX, etc.)'
        ]
      }));

      process.exit(2); // Hard block
    }

    // Check if it's a template file (always allowed if content is safe)
    const isTemplate = TEMPLATE_PATTERNS.some(pattern => pattern.test(filePath));

    if (isTemplate) {
      const contentIsSafe = validateTemplateContent(filePath);

      if (!contentIsSafe) {
        logSecurityEvent({
          event_type: 'credential_template_violation',
          tool_name: 'Read',
          severity: 'critical',
          reason: 'Template file contains real credential patterns',
          context: {
            file_pattern: extractFilePattern(filePath)
          }
        });

        console.log(formatSecurityError({
          title: '🛡️  CREDENTIAL GUARDIAN: TEMPLATE CONTENT VALIDATION FAILED',
          filePath: filePath,
          reason: 'Template file contains real credentials (not placeholders)',
          policy: [
            'SECURITY POLICY:',
            '- Template files should only contain placeholders and examples',
            '- Real credentials must never be in version control (even template files)',
            '- This indicates a file that was incorrectly committed with sensitive data'
          ],
          suggestion: [
            'ACTION REQUIRED:',
            '1. Review the file - it may contain leaked credentials',
            '2. If committed: Immediately revoke those credentials',
            '3. Remove file from git history (git filter-branch or BFG)',
            '4. Replace placeholders with examples before re-committing'
          ].join('\n')
        }));

        process.exit(2); // Hard block
      }

      // Template file content is safe, allow the read
      logSecurityEvent({
        event_type: 'credential_access_allowed',
        tool_name: 'Read',
        severity: 'low',
        reason: 'Template file validation passed',
        context: {
          file_pattern: extractFilePattern(filePath),
          is_template: true
        }
      });

      process.exit(0);
    }

    // Check if file path matches any production credential pattern
    const isCredentialFile = CREDENTIAL_PATTERNS.some(pattern =>
      pattern.test(filePath)
    );

    if (isCredentialFile) {
      logSecurityEvent({
        event_type: 'credential_access_blocked',
        tool_name: 'Read',
        severity: 'high',
        reason: 'Attempted access to production credential file',
        context: {
          file_pattern: extractFilePattern(filePath)
        }
      });

      console.log(formatSecurityError({
        title: '🛡️  CREDENTIAL GUARDIAN: ACCESS BLOCKED',
        filePath: filePath,
        reason: 'This file contains credentials and cannot be read for security',
        policy: [
          'Credential files must never be exposed to AI systems',
          'This is a hard security boundary enforced by the framework',
          'Layer 1: AI instructions prohibit credential access',
          'Layer 2: This hook (credential-guardian.ts) blocks Read tool',
          'Layer 3: Pre-commit hooks prevent credential commits'
        ],
        suggestion: [
          'ALTERNATIVES:',
          '- Review code that USES the credential file instead',
          '- Verify script loads .env correctly by reading the loader code',
          '- Check environment variable usage patterns in application code',
          '- Validate credential configuration without exposing values',
          '',
          'If you believe this is a false positive, update credential-guardian.ts'
        ].join('\n')
      }));

      // Exit code 2 = hard block (cannot proceed)
      process.exit(2);
    }

    // Allow the operation
    logSecurityEvent({
      event_type: 'credential_access_allowed',
      tool_name: 'Read',
      severity: 'low',
      reason: 'Non-credential file read allowed',
      context: {
        file_pattern: extractFilePattern(filePath)
      }
    });

    process.exit(0);

  } catch (error) {
    // FAIL CLOSED: Block operation on any security hook error
    const err = error as Error;

    // Log full details internally (with stack trace)
    logInternalError(err, { hook: 'credential-guardian', phase: 'validation' });

    // Log to audit trail
    logSecurityEvent({
      event_type: 'fail_closed_error',
      tool_name: 'Read',
      reason: `Unexpected error: ${sanitizeErrorMessage(err)}`,
      severity: 'critical'
    });

    // Show sanitized message to user
    console.log('<system-reminder>');
    console.log('🛡️  CREDENTIAL GUARDIAN: CRITICAL ERROR');
    console.log('');
    console.log(`Error: ${sanitizeErrorMessage(err)}`);
    console.log('');
    console.log('SECURITY POLICY: Fail-closed on unexpected errors to prevent bypass');
    console.log('');
    console.log('COMMON CAUSES:');
    console.log('- Malformed JSON input');
    console.log('- File I/O errors');
    console.log('- Regex timeout/backtracking');
    console.log('');
    console.log('For debugging: Check hook input and file permissions.');
    console.log('</system-reminder>');

    // Exit code 2 = hard block (cannot proceed)
    process.exit(2);
  }
}

main();
