/**
 * File Guardian Hook
 *
 * PreToolUse hook that validates file creation before Write tool executes.
 * Enforces file locations, naming conventions, and prevents duplicates.
 *
 * Trigger: PreToolUse on Write tool
 * Action: Validate file path, warn or block on violations
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname, basename, extname, resolve } from 'path';
import { parse as parseYaml } from 'yaml';
import { FileGuardianInputSchema } from './schemas';
import {
  logSecurityEvent,
  extractFilePattern
} from '@/tools/framework/utils/audit-trail';
import {
  resolveFrameworkRoot
} from '@/tools/framework/utils/path-resolution';
import {
  sanitizeFilePath,
  sanitizeErrorMessage,
  logInternalError,
  formatSecurityError,
  formatValidationError
} from '@/tools/framework/utils/error-sanitizer';

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    [key: string]: unknown;
  };
}

interface ValidationResult {
  action: 'allow' | 'warn' | 'block';
  message?: string;
  suggestion?: string;
}

interface LocationRule {
  purpose: string;
  naming?: {
    pattern?: string;
    convention?: string;
  };
  allowed_files?: string[];
  blocked_patterns?: string[];
  auto_generated?: boolean;
  manual_creation?: string;
}

interface FileRegistry {
  version: string;
  root: LocationRule;
  docs: LocationRule;
  foundation: LocationRule;
  modules: LocationRule;
  hooks: LocationRule;
  sessions: LocationRule;
  plans: LocationRule;
  [key: string]: unknown;
}

/** Windows device names that must be blocked (case-insensitive) */
const WINDOWS_DEVICE_NAMES = new Set([
  'CON', 'PRN', 'AUX', 'NUL',
  'COM1', 'COM2', 'COM3', 'COM4', 'COM5', 'COM6', 'COM7', 'COM8', 'COM9',
  'LPT1', 'LPT2', 'LPT3', 'LPT4', 'LPT5', 'LPT6', 'LPT7', 'LPT8', 'LPT9'
]);

/**
 * Lightweight path security check.
 * Only blocks path traversal sequences and Windows device names.
 * Does NOT restrict paths to framework root.
 *
 * @param filePath - Path to check
 * @returns Error string if blocked, null if safe
 */
function checkPathSecurity(filePath: string): string | null {
  // Block path traversal sequences
  if (filePath.includes('..')) {
    return 'Path contains traversal sequence (..)';
  }

  // Block Windows device names in any path component
  let absolutePath: string;
  try {
    absolutePath = resolve(filePath);
  } catch (err) {
    return `Invalid path format: ${err instanceof Error ? err.message : String(err)}`;
  }

  const components = absolutePath.split(/[/\\]/);
  for (const component of components) {
    if (!component) continue;
    const nameWithoutExt = component.split('.')[0].toUpperCase();
    if (WINDOWS_DEVICE_NAMES.has(nameWithoutExt)) {
      return `Path contains Windows device name: ${component}`;
    }
  }

  return null;
}

/**
 * Find a file in dirPath whose name matches fileName case-insensitively
 * (exact match ignoring case, excluding the target name itself).
 *
 * @param dirPath - Directory to search
 * @param fileName - Target file name
 * @returns Conflicting file name, or null if none
 */
function findCaseConflict(dirPath: string, fileName: string): string | null {
  try {
    const lower = fileName.toLowerCase();
    const entries = readdirSync(dirPath);
    for (const entry of entries) {
      if (entry !== fileName && entry.toLowerCase() === lower) {
        return entry;
      }
    }
    return null;
  } catch {
    return null;
  }
}

// Get framework root via centralized path resolution
const FRAMEWORK_PATH = resolveFrameworkRoot();

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: PreToolUseInput = JSON.parse(input);

    // Validate input schema with Zod
    const validation = FileGuardianInputSchema.safeParse(data);
    if (!validation.success) {
      // Log validation failure
      logSecurityEvent({
        event_type: 'validation_error',
        tool_name: 'Write',
        reason: 'Input schema validation failed',
        severity: 'medium',
        context: {
          errors: validation.error?.errors?.map(e => ({
            path: e.path.join('.'),
            message: e.message
          })) || []
        }
      });

      console.log('<system-reminder>');
      console.log('FILE GUARDIAN: VALIDATION ERROR');
      console.log('');
      console.log('Invalid input format - malformed tool call detected');
      console.log('');
      if (validation.error?.errors) {
        console.log(formatValidationError(validation.error.errors.map(e => ({
          path: e.path,
          message: e.message
        }))));
      } else {
        console.log('Unable to parse validation errors');
      }
      console.log('');
      console.log('SECURITY POLICY: Fail-open on validation errors to avoid blocking writes');
      console.log('</system-reminder>');
      process.exit(0); // Fail-open on validation error
    }

    // Only process Write tool calls
    if (validation.data.tool_name !== 'Write') {
      process.exit(0);
    }

    const filePath = validation.data.tool_input.file_path;
    if (!filePath) {
      process.exit(0);
    }

    // Validate the file creation
    const content = validation.data.tool_input.content || '';
    const result = validateFileCreation(filePath, content);

    if (result.action === 'block') {
      // Log file creation block
      logSecurityEvent({
        event_type: 'file_creation_blocked',
        tool_name: 'Write',
        reason: result.message || 'File creation blocked',
        severity: 'high',
        context: {
          file_pattern: extractFilePattern(filePath),
          suggestion: result.suggestion
        }
      });

      console.log(formatSecurityError({
        title: 'FILE GUARDIAN: BLOCKED',
        filePath: filePath,
        reason: result.message || 'File creation blocked',
        suggestion: result.suggestion
      }));
      // Exit code 2 = hard block (cannot proceed)
      process.exit(2);
    }

    if (result.action === 'warn') {
      // Log file creation warning
      logSecurityEvent({
        event_type: 'file_creation_warning',
        tool_name: 'Write',
        reason: result.message || 'File creation warning',
        severity: 'low',
        context: {
          file_pattern: extractFilePattern(filePath),
          suggestion: result.suggestion
        }
      });

      console.log('<system-reminder>');
      console.log('FILE GUARDIAN: WARNING');
      console.log('');
      console.log(`File: ${sanitizeFilePath(filePath)}`);
      console.log(`Warning: ${result.message}`);
      if (result.suggestion) {
        console.log(`Suggestion: ${result.suggestion}`);
      }
      console.log('');
      console.log('Proceeding with file creation...');
      console.log('</system-reminder>');
    }

    // Allow the operation
    process.exit(0);

  } catch (err) {
    const error = err as Error;

    // Log full details internally (with stack trace)
    logInternalError(error, { hook: 'file-guardian', phase: 'validation' });

    // Log fail-open error to audit trail
    logSecurityEvent({
      event_type: 'fail_closed_error',
      tool_name: 'Write',
      reason: `Unexpected error: ${sanitizeErrorMessage(error)}`,
      severity: 'critical',
      context: {
        error_name: error.name
      }
    });

    // Fail-open on hook errors to avoid blocking legitimate writes
    console.log('<system-reminder>');
    console.log('FILE GUARDIAN: CRITICAL ERROR');
    console.log('');
    console.log(`Error: ${sanitizeErrorMessage(error)}`);
    console.log('');
    console.log('SECURITY POLICY: Fail-open on unexpected errors to avoid blocking writes');
    console.log('</system-reminder>');
    process.exit(0); // Fail-open on any error
  }
}

function validateFileCreation(filePath: string, content: string = ''): ValidationResult {
  // 0. SECURITY CHECK: Path traversal and device names only
  const securityError = checkPathSecurity(filePath);
  if (securityError) {
    const eventType = securityError.includes('device') ? 'device_access_blocked' : 'path_traversal_blocked';

    logSecurityEvent({
      event_type: eventType,
      tool_name: 'Write',
      reason: securityError,
      severity: 'critical',
      context: {
        file_pattern: extractFilePattern(filePath),
        original_path: filePath
      }
    });

    return {
      action: 'block',
      message: `SECURITY: ${securityError}`,
      suggestion: 'Use only safe paths without traversal sequences or device names'
    };
  }

  // 1. CHECK: Is this within the framework directory?
  if (!filePath.startsWith(FRAMEWORK_PATH)) {
    // Outside framework - allow without further checks
    return { action: 'allow' };
  }

  // 2. Get relative path within framework
  const relativePath = filePath.slice(FRAMEWORK_PATH.length + 1);
  const topDir = relativePath.split('/')[0];
  const fileName = basename(filePath);
  const dirPath = dirname(filePath);

  // 3. CHECK: Sessions directory - allow immediately
  if (topDir === 'sessions') {
    return { action: 'allow' };
  }

  // 4. CHECK: Similar file exists? (exact case-insensitive match only)
  if (existsSync(dirPath)) {
    const conflict = findCaseConflict(dirPath, fileName);
    if (conflict) {
      return {
        action: 'warn',
        message: `Case conflict: file "${conflict}" already exists with different case`,
        suggestion: 'Did you mean to edit that existing file?'
      };
    }
  }

  // 5. CHECK: Location-specific rules
  const registry = loadRegistry();
  // Note: Continue checks even if registry doesn't exist - use fallback defaults

  // Check root directory rules
  if (!relativePath.includes('/') || topDir === '') {
    // File in root
    const ext = extname(fileName);

    // Enforce file-location-standards.md rules for root
    if (ext === '.md') {
      // Markdown files should be in docs/ unless they're GitHub special files or framework entry points
      const allowedRootMd = [
        'README.md',           // GitHub repository description
        'CLAUDE.md',           // Framework entry point
        'CHANGELOG.md',        // GitHub recognizes for releases
        'SECURITY.md',         // GitHub security tab
        'CONTRIBUTING.md',     // GitHub contribution guidelines
        'INSTALL.md',          // Installation instructions
        'CODE_OF_CONDUCT.md',  // GitHub community standards
        'SUPPORT.md'           // GitHub support resources
      ];
      if (!allowedRootMd.includes(fileName)) {
        return {
          action: 'warn',
          message: `Markdown files should not be in root directory`,
          suggestion: `Move to docs/ (public framework) or private/docs/ (private work). Allowed root .md files: README, CLAUDE, CHANGELOG, SECURITY, CONTRIBUTING, INSTALL`
        };
      }
    }

    const allowed = registry?.root?.allowed_files || ['package.json', '.gitignore', 'tsconfig.json', 'bun.lockb'];
    if (!allowed.includes(fileName) && ext !== '.md') {
      return {
        action: 'warn',
        message: `Root directory should only contain entry points and config files`,
        suggestion: `Consider placing this file in docs/ or the appropriate module directory`
      };
    }
  }

  // Check docs/ vs private/docs/ (public vs private content)
  if (topDir === 'docs' && content) {
    // Scan content for private skill references
    const privateSkills = ['ghost', 'security', 'compliance', 'advisory', 'n8n',
                          'write', 'bounty-targets',
                          'consulting', 'ehs-proposals', 'x-engagement'];

    const hasPrivateContent = privateSkills.some(skill =>
      content.toLowerCase().includes(skill) ||
      content.includes(`skills/${skill}`) ||
      fileName.toLowerCase().includes(skill)
    );

    // Check for blog/content planning keywords
    const blogKeywords = ['blog', 'ghost', 'newsletter', 'tweet', 'x algorithm', 'engagement'];
    const hasBlogContent = blogKeywords.some(keyword =>
      content.toLowerCase().includes(keyword) ||
      fileName.toLowerCase().includes(keyword)
    );

    // Check for project tracking patterns
    const trackingPatterns = ['active work', 'in-progress', 'blocker', 'next action', 'status:'];
    const hasTracking = trackingPatterns.some(pattern =>
      content.toLowerCase().includes(pattern)
    );

    if (hasPrivateContent || hasBlogContent || hasTracking) {
      return {
        action: 'warn',
        message: `This content appears to be private work and should not be in /docs (public)`,
        suggestion: `Move to private/docs/ instead. /docs syncs to public repo, private/docs/ does not.`
      };
    }
  }

  // Check scratchpad usage
  if (topDir === 'scratchpad' && content) {
    // Detect permanent content patterns
    const permanentPatterns = [
      'gap analysis', 'audit', 'roadmap', 'architecture',
      'implementation plan', 'design document', 'standards',
      'best practices', 'migration', 'deployment'
    ];

    const isPermanent = permanentPatterns.some(pattern =>
      fileName.toLowerCase().includes(pattern) ||
      content.toLowerCase().includes(`# ${pattern}`)
    );

    if (isPermanent) {
      return {
        action: 'warn',
        message: `This appears to be permanent documentation in scratchpad/ (temporary)`,
        suggestion: `Permanent docs belong in docs/ (public) or private/docs/ (private). Scratchpad is for temporary exploration.`
      };
    }
  }

  // Check hooks/ naming convention
  if (topDir === 'hooks') {
    const ext = extname(fileName);
    if (ext === '.ts' && !isLowerKebab(fileName.replace('.ts', ''))) {
      return {
        action: 'warn',
        message: `hooks/ files should use lowercase-kebab naming`,
        suggestion: `Consider renaming to ${toKebabCase(fileName)}`
      };
    }
    if (ext === '.js') {
      return {
        action: 'warn',
        message: `JavaScript files in hooks/ - use TypeScript instead`,
        suggestion: `Rename to ${fileName.replace('.js', '.ts')}`
      };
    }
  }

  // Check foundation/ and modules/ structure
  if (topDir === 'foundation' || topDir === 'modules') {
    const parts = relativePath.split('/');
    if (parts.length >= 2) {
      const moduleDir = parts[1];
      // Check module directory naming
      if (!isLowerKebab(moduleDir) && moduleDir !== 'lib' && moduleDir !== 'engine') {
        return {
          action: 'warn',
          message: `Module directories should use lowercase-kebab naming`,
          suggestion: `Consider renaming ${moduleDir} to ${toKebabCase(moduleDir)}`
        };
      }
    }
  }

  return { action: 'allow' };
}

function isLowerKebab(name: string): boolean {
  return /^[a-z][a-z0-9-]*$/.test(name);
}

function toKebabCase(name: string): string {
  return name
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .toLowerCase();
}

function loadRegistry(): FileRegistry | null {
  try {
    const registryPath = join(FRAMEWORK_PATH, 'foundation', 'lib', 'file-registry.yaml');
    if (!existsSync(registryPath)) {
      return null;
    }
    const content = readFileSync(registryPath, 'utf-8');
    return parseYaml(content) as FileRegistry;
  } catch {
    return null;
  }
}

main();
