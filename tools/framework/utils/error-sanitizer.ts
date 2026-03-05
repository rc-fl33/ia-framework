/**
 * Error Message Sanitizer
 *
 * Sanitizes error messages to prevent information disclosure while maintaining
 * actionable feedback for legitimate users.
 *
 * SECURITY PRINCIPLES:
 * - No sensitive information in user-facing errors
 * - No stack traces in user output (logged internally only)
 * - Sanitize file paths (remove user home directories)
 * - Remove validation details that could aid attacks
 * - Keep errors clear but minimal
 *
 * Usage:
 *   import { sanitizeFilePath, sanitizeErrorMessage } from '@/tools/framework/utils/error-sanitizer';
 */

import { basename, dirname } from 'path';

/**
 * Sanitize a file path for user-facing error messages
 *
 * Removes sensitive information while keeping enough context for debugging:
 * - Removes user home directory paths
 * - Shows only filename and immediate parent directory
 * - Preserves relative context within framework
 *
 * Examples:
 * - [framework-root]/.env → .env
 * - [framework-root]/hooks/credential-guardian.ts → hooks/credential-guardian.ts
 * - [project-path]/.env → .env
 *
 * @param filePath - Full file path to sanitize
 * @returns Sanitized path with sensitive info removed
 */
export function sanitizeFilePath(filePath: string): string {
  // Get filename and parent directory
  const fileName = basename(filePath);
  const parentDir = basename(dirname(filePath));

  // Remove user home directory from path
  let sanitized = filePath.replace(/\/home\/[^/]+\//g, '~/');
  sanitized = sanitized.replace(/\/Users\/[^/]+\//g, '~/');
  sanitized = sanitized.replace(/C:\\Users\\[^\\]+\\/g, '~/');

  // If path is still very long, show just parent/filename
  if (sanitized.length > 80) {
    return parentDir ? `${parentDir}/${fileName}` : fileName;
  }

  return sanitized;
}

/**
 * Sanitize validation error messages
 *
 * Removes technical details that could aid attacks while keeping
 * enough information for legitimate debugging.
 *
 * @param error - Validation error object
 * @returns Sanitized error message
 */
export function sanitizeValidationError(error: { path: string[]; message: string }): string {
  const path = error.path.length > 0 ? error.path.join('.') : 'input';

  // Remove technical validation details
  let message = error.message;

  // Simplify common Zod error messages
  message = message.replace(/Expected .*, received .*/, 'Invalid format');
  message = message.replace(/Invalid type.*/, 'Invalid type');
  message = message.replace(/Required.*/, 'Missing required field');

  return `${path}: ${message}`;
}

/**
 * Sanitize error for user output (removes stack trace, internal details)
 *
 * @param error - Error object or string
 * @returns Sanitized error message
 */
export function sanitizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    // Return just the message, not the stack trace
    let message = error.message;

    // Remove file paths from error messages
    message = message.replace(/\/home\/[^/]+\/[^\s]+/g, (match) => sanitizeFilePath(match));
    message = message.replace(/\/Users\/[^/]+\/[^\s]+/g, (match) => sanitizeFilePath(match));
    message = message.replace(/C:\\Users\\[^\\]+\\[^\s]+/g, (match) => sanitizeFilePath(match));

    // Remove error codes that might leak internal structure
    message = message.replace(/\[Error: [^\]]+\]/g, 'Error occurred');

    return message;
  }

  return String(error);
}

/**
 * Format security error for user display
 *
 * Creates a consistent, sanitized error format for security violations.
 *
 * @param options - Error details
 * @returns Formatted error message block
 */
export function formatSecurityError(options: {
  title: string;
  filePath?: string;
  reason: string;
  suggestion?: string;
  policy?: string[];
}): string {
  const lines: string[] = [];

  lines.push('<system-reminder>');
  lines.push(options.title);
  lines.push('');

  if (options.filePath) {
    lines.push(`File: ${sanitizeFilePath(options.filePath)}`);
    lines.push('');
  }

  lines.push(`REASON: ${options.reason}`);
  lines.push('');

  if (options.policy) {
    lines.push('SECURITY POLICY:');
    options.policy.forEach(item => lines.push(`- ${item}`));
    lines.push('');
  }

  if (options.suggestion) {
    lines.push('SUGGESTION:');
    lines.push(options.suggestion);
    lines.push('');
  }

  lines.push('</system-reminder>');

  return lines.join('\n');
}

/**
 * Format validation error for user display
 *
 * Creates a consistent, sanitized error format for validation failures.
 *
 * @param errors - Array of validation errors
 * @returns Formatted error message block
 */
export function formatValidationError(errors: Array<{ path: string[]; message: string }>): string {
  const lines: string[] = [];

  lines.push('<system-reminder>');
  lines.push('VALIDATION ERROR');
  lines.push('');
  lines.push('Invalid input format detected');
  lines.push('');
  lines.push('ERRORS:');

  errors.forEach(err => {
    lines.push(`  - ${sanitizeValidationError(err)}`);
  });

  lines.push('');
  lines.push('SECURITY POLICY: Fail-closed on validation errors to prevent bypass');
  lines.push('</system-reminder>');

  return lines.join('\n');
}

/**
 * Log full error details internally (not shown to user)
 *
 * This should be used in conjunction with audit-trail logging.
 * Logs complete error information including stack traces.
 *
 * @param error - Error object
 * @param context - Additional context
 */
export function logInternalError(error: unknown, context?: Record<string, unknown>): void {
  if (error instanceof Error) {
    console.error('[INTERNAL] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      context
    });
  } else {
    console.error('[INTERNAL] Error:', error, context);
  }
}

/**
 * Sanitize command for display (remove sensitive arguments)
 *
 * @param command - Shell command to sanitize
 * @returns Sanitized command
 */
export function sanitizeCommand(command: string): string {
  let sanitized = command;

  // Remove potential API keys and tokens
  sanitized = sanitized.replace(/--api-key[=\s]+[^\s]+/gi, '--api-key=[REDACTED]');
  sanitized = sanitized.replace(/--token[=\s]+[^\s]+/gi, '--token=[REDACTED]');
  sanitized = sanitized.replace(/--password[=\s]+[^\s]+/gi, '--password=[REDACTED]');
  sanitized = sanitized.replace(/-p[=\s]+[^\s]+/g, '-p=[REDACTED]');

  // Remove environment variable assignments with sensitive values
  sanitized = sanitized.replace(/API_KEY=[^\s]+/gi, 'API_KEY=[REDACTED]');
  sanitized = sanitized.replace(/TOKEN=[^\s]+/gi, 'TOKEN=[REDACTED]');
  sanitized = sanitized.replace(/PASSWORD=[^\s]+/gi, 'PASSWORD=[REDACTED]');

  return sanitized;
}
