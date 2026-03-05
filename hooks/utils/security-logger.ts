/**
 * Security Event Logger
 *
 * Provides structured logging for security-critical events.
 * Used by security hooks to record errors, violations, and security decisions.
 */

interface SecurityLogEntry {
  timestamp: string;
  level: 'ERROR' | 'WARN' | 'INFO';
  hook: string;
  event: string;
  message?: string;
  context?: Record<string, unknown>;
  stack?: string;
}

/**
 * Log a security error with structured format
 * @param hook Hook name that generated the error
 * @param event Event type (e.g., 'parse_error', 'validation_failed')
 * @param message Human-readable error message
 * @param context Additional context data
 * @param stack Stack trace if available
 */
export function logSecurityError(
  hook: string,
  event: string,
  message: string,
  context?: Record<string, unknown>,
  stack?: string
): void {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    level: 'ERROR',
    hook,
    event,
    message,
    context,
    stack
  };

  console.error(JSON.stringify(logEntry));
}

/**
 * Log a security warning (e.g., suspicious pattern detected)
 * @param hook Hook name
 * @param event Event type
 * @param message Human-readable warning message
 * @param context Additional context data
 */
export function logSecurityWarn(
  hook: string,
  event: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    level: 'WARN',
    hook,
    event,
    message,
    context
  };

  console.warn(JSON.stringify(logEntry));
}

/**
 * Log a security action (e.g., operation allowed/blocked)
 * @param hook Hook name
 * @param event Event type
 * @param message Human-readable message
 * @param context Additional context data
 */
export function logSecurityInfo(
  hook: string,
  event: string,
  message: string,
  context?: Record<string, unknown>
): void {
  const logEntry: SecurityLogEntry = {
    timestamp: new Date().toISOString(),
    level: 'INFO',
    hook,
    event,
    message,
    context
  };

  console.log(JSON.stringify(logEntry));
}
