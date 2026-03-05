/**
 * Security Audit Trail
 *
 * Structured audit logging for security events across the framework.
 * Logs to JSON Lines format with daily rotation.
 *
 * SECURITY REQUIREMENTS:
 * - Never log sensitive data (passwords, keys, PII, full file paths with user info)
 * - Sanitize all inputs before logging
 * - Fail gracefully - logging errors should never block operations
 * - Log directory auto-created if missing
 *
 * Log Format (JSON Lines):
 * {
 *   "timestamp": "2026-02-14T12:00:00.000Z",
 *   "event_type": "credential_access_blocked",
 *   "tool_name": "Read",
 *   "severity": "high",
 *   "reason": "Attempted access to credential file",
 *   "file_pattern": "*.env",
 *   "context": {...}
 * }
 */

import { existsSync, mkdirSync, appendFileSync } from 'fs';
import { join, basename, dirname } from 'path';
import { resolveFrameworkRoot } from './path-resolution';

// Event severity levels
export type Severity = 'low' | 'medium' | 'high' | 'critical';

// Event types for classification
export type EventType =
  | 'credential_access_blocked'
  | 'credential_template_violation'
  | 'dangerous_command_blocked'
  | 'file_creation_blocked'
  | 'file_creation_warning'
  | 'validation_error'
  | 'fail_closed_error'
  | 'path_traversal_blocked'
  | 'symlink_attack_blocked'
  | 'device_access_blocked';

// Security event structure
export interface SecurityEvent {
  event_type: EventType;
  tool_name: string;
  reason: string;
  severity: Severity;
  context?: Record<string, unknown>;
}

// Log entry structure (internal)
interface LogEntry {
  timestamp: string;
  event_type: EventType;
  tool_name: string;
  severity: Severity;
  reason: string;
  context?: Record<string, unknown>;
}

// Get framework root via centralized path resolution
const FRAMEWORK_PATH = resolveFrameworkRoot();

// Logs directory
const LOGS_DIR = join(FRAMEWORK_PATH, 'logs', 'security-audit');

// Sensitive patterns to redact from logs
const SENSITIVE_PATTERNS = [
  /sk-[a-zA-Z0-9]{32,}/g,           // OpenAI keys
  /pk-[a-zA-Z0-9]{32,}/g,           // Anthropic keys
  /ghp_[a-zA-Z0-9]{36}/g,           // GitHub tokens
  /xoxb-[0-9]+-[0-9]+-[a-zA-Z0-9]+/g, // Slack tokens
  /[a-f0-9]{40}/g,                  // Generic 40-char hex
  /-----BEGIN.*KEY-----[\s\S]*?-----END.*KEY-----/gi, // Private keys
  /Bearer\s+[a-zA-Z0-9\-._~+/]+=*/gi, // Bearer tokens
  /password["\s:=]+[^\s"]+/gi,      // Password assignments
];

/**
 * Sanitizes a string by removing sensitive information
 */
function sanitize(value: unknown): unknown {
  if (typeof value === 'string') {
    let sanitized = value;

    // Redact sensitive patterns
    SENSITIVE_PATTERNS.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[REDACTED]');
    });

    // Redact full user paths - keep only filename and parent dir
    sanitized = sanitized.replace(
      /\/(?:home|Users)\/[^/]+\//g,
      '/[USER]/'
    );

    return sanitized;
  }

  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) {
      sanitized[k] = sanitize(v);
    }
    return sanitized;
  }

  return value;
}

/**
 * Gets the log file path for today
 */
function getLogFilePath(): string {
  const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  return join(LOGS_DIR, `${today}.log`);
}

/**
 * Ensures the log directory exists
 */
function ensureLogDirectory(): void {
  try {
    if (!existsSync(LOGS_DIR)) {
      mkdirSync(LOGS_DIR, { recursive: true });
    }
  } catch (err) {
    // Fail gracefully - log to stderr but don't throw
    console.error(`[AUDIT] Failed to create log directory: ${(err as Error).message}`);
  }
}

/**
 * Writes a log entry to the audit trail
 * Fails gracefully - errors are logged to stderr but never throw
 */
function writeLogEntry(entry: LogEntry): void {
  try {
    ensureLogDirectory();

    const logPath = getLogFilePath();
    const line = JSON.stringify(entry) + '\n';

    appendFileSync(logPath, line, 'utf-8');
  } catch (err) {
    // Fail gracefully - log to stderr but don't block operation
    console.error(`[AUDIT] Failed to write log entry: ${(err as Error).message}`);
  }
}

/**
 * Main API: Log a security event to the audit trail
 *
 * @param event Security event to log
 *
 * @example
 * logSecurityEvent({
 *   event_type: 'credential_access_blocked',
 *   tool_name: 'Read',
 *   reason: 'Attempted read of .env file',
 *   severity: 'high',
 *   context: { file_name: '.env' }
 * });
 */
export function logSecurityEvent(event: SecurityEvent): void {
  try {
    // Sanitize the entire event
    const sanitized = sanitize(event) as SecurityEvent;

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      event_type: sanitized.event_type,
      tool_name: sanitized.tool_name,
      severity: sanitized.severity,
      reason: sanitized.reason,
      context: sanitized.context
    };

    writeLogEntry(entry);
  } catch (err) {
    // Fail gracefully - never throw
    console.error(`[AUDIT] Failed to log security event: ${(err as Error).message}`);
  }
}

/**
 * Helper: Extract file pattern from path for logging (no sensitive info)
 */
export function extractFilePattern(filePath: string): string {
  const fileName = basename(filePath);
  const dirName = basename(dirname(filePath));

  // Return pattern like "hooks/*.ts" or "root/.env"
  if (dirName && dirName !== '.') {
    return `${dirName}/${fileName}`;
  }

  return fileName;
}

/**
 * Helper: Sanitize command for logging (removes sensitive args)
 */
export function sanitizeCommand(command: string): string {
  return sanitize(command) as string;
}

/**
 * Shell Escape - Properly escape shell arguments to prevent injection
 *
 * Escapes shell metacharacters for safe command execution.
 * Use this when constructing shell commands programmatically.
 *
 * SECURITY: This prevents command injection via metacharacters like:
 * - Command separators: ; | & && ||
 * - Redirection: > < >> 2>&1
 * - Subshells: $() `` ${}
 * - Wildcards: * ? [ ]
 * - Quotes: " ' `
 *
 * @param arg - Shell argument to escape
 * @returns Safely escaped argument for shell execution
 *
 * @example
 * const filename = shellEscape(userInput);
 * const command = `cat ${filename}`; // Safe from injection
 */
export function shellEscape(arg: string): string {
  // Handle empty string
  if (arg === '') {
    return "''";
  }

  // Shell metacharacters that need escaping
  const shellMetaRe = /[|&;<>()$`\\"'*?[\]#~=%\s\t\n]/;

  // If arg contains no metacharacters, return as-is
  if (!shellMetaRe.test(arg)) {
    return arg;
  }

  // Use single quotes for simplest escaping, handle embedded single quotes
  // Replace ' with '\'' (end quote, literal quote, start quote)
  return "'" + arg.replace(/'/g, "'\\''") + "'";
}

/**
 * Shell Escape Array - Escape multiple arguments
 *
 * @param args - Array of shell arguments to escape
 * @returns Array of escaped arguments
 *
 * @example
 * const escaped = shellEscapeArray(['file.txt', 'path with spaces']);
 * // ["file.txt", "'path with spaces'"]
 */
export function shellEscapeArray(args: string[]): string[] {
  return args.map(shellEscape);
}

/**
 * Validate Command Safety - Check for dangerous patterns
 *
 * Returns true if command appears safe, false if dangerous patterns detected.
 * This is a defense-in-depth check - shellEscape should handle escaping,
 * but this catches obvious injection attempts.
 *
 * @param command - Command to validate
 * @returns Object with validation result and reason if unsafe
 *
 * @example
 * const result = validateCommandSafety("rm -rf /");
 * if (!result.safe) {
 *   console.error(result.reason);
 * }
 */
export function validateCommandSafety(command: string): {
  safe: boolean;
  reason?: string;
} {
  // Check for command injection patterns
  const dangerousPatterns = [
    { pattern: /;\s*rm\s+-rf/, reason: 'Command chaining with dangerous rm -rf' },
    { pattern: /\|\s*bash/, reason: 'Pipe to bash interpreter' },
    { pattern: /\|\s*sh/, reason: 'Pipe to shell interpreter' },
    { pattern: /&&\s*rm/, reason: 'Command chaining with rm' },
    { pattern: /\$\(.*\)/, reason: 'Command substitution detected' },
    { pattern: /`.*`/, reason: 'Backtick command substitution' },
    { pattern: /;\s*curl.*\|/, reason: 'Curl piped to interpreter' },
    { pattern: /;\s*wget.*\|/, reason: 'Wget piped to interpreter' },
  ];

  for (const { pattern, reason } of dangerousPatterns) {
    if (pattern.test(command)) {
      return { safe: false, reason };
    }
  }

  return { safe: true };
}
