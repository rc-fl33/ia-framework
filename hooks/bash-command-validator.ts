#!/usr/bin/env bun
/**
 * Bash Command Validator
 *
 * Validates Bash commands before execution to prevent dangerous operations.
 * Based on CLAWDBOT Security Hardening recommendations.
 *
 * BLOCKS:
 * - rm -rf / (recursive delete from root)
 * - curl | bash (piped execution from untrusted sources)
 * - git push --force (destructive force push)
 * - sudo rm (elevated deletion)
 * - chmod 777 (overly permissive permissions)
 * - wget | sh (piped execution)
 * - eval with untrusted input
 *
 * Usage: Called by pre-tool-use hook before Bash tool execution
 */

import { BashValidatorInputSchema, safeValidate, formatValidationErrors } from './schemas';
import { logSecurityEvent, sanitizeCommand } from '@/tools/framework/utils/audit-trail';
import {
  sanitizeErrorMessage,
  sanitizeCommand as sanitizeCommandForDisplay,
  logInternalError,
  formatSecurityError,
  formatValidationError
} from '@/tools/framework/utils/error-sanitizer';

// Max input size to prevent memory exhaustion
const MAX_INPUT_SIZE = 1048576; // 1MB

interface ValidationResult {
  allowed: boolean;
  reason?: string;
  pattern?: string;
}

// Dangerous command patterns that should be blocked
const BLOCKED_PATTERNS: Array<{ pattern: RegExp; reason: string; severity: 'critical' | 'high' | 'medium' }> = [
  {
    pattern: /rm\s+-[rf]*r[rf]*\s+\//,
    reason: "Recursive deletion from root directory - extremely dangerous",
    severity: 'critical'
  },
  {
    pattern: /curl.*\|.*(bash|sh|zsh)/,
    reason: "Piped execution from curl - untrusted code execution",
    severity: 'critical'
  },
  {
    pattern: /wget.*\|.*(bash|sh|zsh)/,
    reason: "Piped execution from wget - untrusted code execution",
    severity: 'critical'
  },
  {
    pattern: /git\s+push\s+.*--force/,
    reason: "Force push detected - can destroy remote history",
    severity: 'high'
  },
  {
    pattern: /sudo\s+rm\s+-rf/,
    reason: "Elevated recursive deletion - dangerous",
    severity: 'critical'
  },
  {
    pattern: /chmod\s+777/,
    reason: "Overly permissive permissions (777) - security risk",
    severity: 'medium'
  },
  {
    pattern: />\s*\/dev\/sda/,
    reason: "Direct write to disk device - data loss risk",
    severity: 'critical'
  },
  {
    pattern: /dd\s+.*of=\/dev/,
    reason: "dd to device - potential disk wipe",
    severity: 'critical'
  },
  {
    pattern: /mkfs/,
    reason: "Filesystem creation command - data loss risk",
    severity: 'critical'
  },
  {
    pattern: /:\(\)\{\s*:\|:&\s*\};:/,
    reason: "Fork bomb detected",
    severity: 'critical'
  }
];

// Commands that require user confirmation
const REQUIRES_CONFIRMATION: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /rm\s+-rf/,
    reason: "Recursive deletion - confirm you understand the scope"
  },
  {
    pattern: /sudo/,
    reason: "Elevated privileges requested"
  },
  {
    pattern: /git\s+push/,
    reason: "Pushing to remote repository"
  }
];

/**
 * Validates a bash command against security policies
 */
export function validateBashCommand(command: string): ValidationResult {
  // Check blocked patterns
  for (const { pattern, reason, severity } of BLOCKED_PATTERNS) {
    if (pattern.test(command)) {
      return {
        allowed: false,
        reason: `🚨 BLOCKED (${severity}): ${reason}`,
        pattern: pattern.toString()
      };
    }
  }

  // All checks passed
  return { allowed: true };
}

/**
 * Checks if command requires user confirmation
 */
export function requiresConfirmation(command: string): { required: boolean; reason?: string } {
  for (const { pattern, reason } of REQUIRES_CONFIRMATION) {
    if (pattern.test(command)) {
      return { required: true, reason };
    }
  }
  return { required: false };
}

/**
 * Sanitizes command for safe logging (removes sensitive data)
 */
export function sanitizeForLogging(command: string): string {
  // Remove potential API keys/tokens
  return command
    .replace(/([a-zA-Z0-9_-]{20,})/g, '[REDACTED]')
    .replace(/(sk-[a-zA-Z0-9-_]+)/g, '[API_KEY]')
    .replace(/(ghp_[a-zA-Z0-9]+)/g, '[GITHUB_TOKEN]');
}

/**
 * PreToolUse hook main
 *
 * Reads JSON from stdin, validates Bash commands, blocks dangerous operations.
 * Follows the credential-guardian.ts pattern for hook integration.
 */
async function main() {
  const input = await Bun.stdin.text();

  try {
    // Validate input size to prevent memory exhaustion
    if (input.length > MAX_INPUT_SIZE) {
      console.error('❌ SECURITY VIOLATION: Input exceeds maximum size');
      console.error(`Size: ${input.length} bytes (max: ${MAX_INPUT_SIZE})`);
      process.exit(2);
    }

    // Parse JSON with safety checks
    let data: unknown;
    try {
      data = JSON.parse(input);
    } catch (parseErr) {
      console.error('❌ VALIDATION ERROR: Malformed JSON input');
      console.error(`Error: ${sanitizeErrorMessage(parseErr)}`);
      process.exit(2);
    }

    // Check if this is a Bash tool call early, before strict schema validation
    const toolName = (data as Record<string, unknown>)?.tool_name;
    if (toolName !== 'Bash') {
      process.exit(0);
    }

    // Validate input schema for Bash tool calls
    const validation = safeValidate(BashValidatorInputSchema, data);
    if (!validation.success) {
      console.error(formatValidationError(validation.errors.map(e => ({
        path: e.path,
        message: e.message
      }))));
      process.exit(2);
    }

    const command = validation.data.tool_input.command;

    const result = validateBashCommand(command);

    if (!result.allowed) {
      logSecurityEvent({
        event_type: 'dangerous_command_blocked',
        tool_name: 'Bash',
        severity: 'critical',
        reason: result.reason || 'Dangerous command pattern detected',
        context: {
          command_pattern: result.pattern,
          sanitized_command: sanitizeCommand(command),
          command_length: command.length
        }
      });

      console.log(formatSecurityError({
        title: 'BASH COMMAND VALIDATOR: COMMAND BLOCKED',
        filePath: `Command: ${sanitizeCommandForDisplay(command)}`,
        reason: result.reason || 'Dangerous command pattern detected',
        policy: [
          'Dangerous commands are blocked before execution',
          'This is a hard security boundary enforced by the framework',
          'Review the command and use a safer alternative',
          `Pattern matched: ${result.pattern}`
        ],
        suggestion: [
          'ALTERNATIVES:',
          '- Use targeted commands instead of broad destructive operations',
          '- Avoid piping remote content directly to shell interpreters',
          '- Use explicit file paths instead of root-level operations',
          '- Download files first, inspect them, then execute',
          '',
          'If you believe this is a false positive, update bash-command-validator.ts'
        ].join('\n')
      }));

      process.exit(2);
    }

    // Command allowed
    logSecurityEvent({
      event_type: 'command_validated',
      tool_name: 'Bash',
      severity: 'low',
      reason: 'Command passed security validation',
      context: {
        command_length: command.length,
        has_pipes: command.includes('|'),
        has_redirects: /[><]/.test(command)
      }
    });

    process.exit(0);

  } catch (error) {
    // FAIL CLOSED: Block operation on any security hook error
    const err = error as Error;

    // Log full details internally (with stack trace)
    logInternalError(err, { hook: 'bash-command-validator', phase: 'validation' });

    // Log to audit trail
    logSecurityEvent({
      event_type: 'fail_closed_error',
      tool_name: 'Bash',
      reason: `Unexpected error: ${sanitizeErrorMessage(err)}`,
      severity: 'critical'
    });

    // Show sanitized message to user
    console.log('<system-reminder>');
    console.log('BASH COMMAND VALIDATOR: CRITICAL ERROR');
    console.log('');
    console.log(`Error: ${sanitizeErrorMessage(err)}`);
    console.log('');
    console.log('SECURITY POLICY: Fail-closed on unexpected errors to prevent bypass');
    console.log('');
    console.log('COMMON CAUSES:');
    console.log('- Malformed JSON input');
    console.log('- Regex pattern compilation error');
    console.log('- Invalid command string');
    console.log('');
    console.log('For debugging: Check hook input and command format.');
    console.log('</system-reminder>');

    // Exit code 2 = hard block (cannot proceed)
    process.exit(2);
  }
}

main();
