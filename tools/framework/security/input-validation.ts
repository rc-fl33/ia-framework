/**
 * Security Input Validation Library
 *
 * Provides validation functions for common security concerns:
 * - SSRF (Server-Side Request Forgery) protection
 * - Prompt injection detection
 * - Path traversal protection
 * - Command injection protection
 *
 * Usage:
 *   import { validateUrl, validatePrompt, validatePath, validateCommand } from '@/tools/framework/security/input-validation';
 *
 *   const urlCheck = validateUrl(userInput);
 *   if (!urlCheck.valid) {
 *     throw new Error(urlCheck.error);
 *   }
 */

// SSRF Protection - Private IP ranges and metadata endpoints
const PRIVATE_IP_RANGES = [
  /^127\./,                          // 127.0.0.0/8 - Loopback
  /^10\./,                           // 10.0.0.0/8 - Private
  /^172\.(1[6-9]|2\d|3[01])\./,     // 172.16.0.0/12 - Private
  /^192\.168\./,                     // 192.168.0.0/16 - Private
  /^169\.254\./,                     // 169.254.0.0/16 - Link-local
  /^::1$/,                           // IPv6 loopback
  /^0:0:0:0:0:0:0:1$/,              // IPv6 loopback (expanded)
  /^::$/,                            // IPv6 all zeros
  /^fe80:/i,                         // IPv6 link-local
  /^fc00:/i,                         // IPv6 unique local
  /^fd00:/i,                         // IPv6 unique local
];

const METADATA_ENDPOINTS = [
  '169.254.169.254',                 // AWS/Azure/GCP metadata
  'metadata.google.internal',        // GCP metadata
  'metadata.azure.com',              // Azure metadata
];

const BLOCKED_PROTOCOLS = [
  'file://',
  'gopher://',
  'dict://',
  'ftp://',
  'jar://',
];

// Prompt Injection Patterns
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|prior|all)\s+(instructions|prompts|commands)/i,
  /system\s*:/i,
  /\[INST\]/i,
  /\[\/INST\]/i,
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /assistant\s*:/i,
  /human\s*:/i,
  /you\s+are\s+now/i,
  /forget\s+(everything|all|previous)/i,
  /new\s+(role|instruction|task)\s*:/i,
  /override\s+(previous|prior|all)/i,
  /disregard\s+(previous|prior|all)/i,
];

// Path Traversal Patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,                          // ../
  /\.\.\\/,                          // ..\
  /%2e%2e%2f/i,                     // URL encoded ../
  /%2e%2e%5c/i,                     // URL encoded ..\
  /\.\.%2f/i,                       // Mixed encoding
  /\.\.%5c/i,                       // Mixed encoding
];

// Command Injection Patterns
const COMMAND_INJECTION_PATTERNS = [
  /[;&|`$()]/,                      // Shell metacharacters
  /\$\{/,                           // Variable expansion
  /\$\(/,                           // Command substitution
  />/,                              // Redirection (output)
  /</,                              // Redirection (input)
];

export interface ValidationResult {
  valid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validate URL against SSRF attacks
 *
 * Blocks:
 * - Private IP addresses (127.0.0.0/8, 10.0.0.0/8, 192.168.0.0/16, etc.)
 * - Cloud metadata endpoints
 * - Dangerous protocols (file://, gopher://, etc.)
 * - Non-HTTP/HTTPS protocols
 *
 * @param url - URL to validate
 * @param allowPrivateIPs - Allow private IP addresses (default: false)
 * @returns ValidationResult
 */
export function validateUrl(url: string, allowPrivateIPs = false): ValidationResult {
  const warnings: string[] = [];

  // Check for blocked protocols
  for (const protocol of BLOCKED_PROTOCOLS) {
    if (url.toLowerCase().startsWith(protocol)) {
      return {
        valid: false,
        error: `Blocked protocol detected: ${protocol}`,
      };
    }
  }

  try {
    const parsed = new URL(url);

    // Only allow HTTP/HTTPS
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return {
        valid: false,
        error: `Only HTTP and HTTPS protocols are allowed. Got: ${parsed.protocol}`,
      };
    }

    // Check for metadata endpoints
    let hostname = parsed.hostname.toLowerCase();

    // Strip IPv6 brackets if present
    if (hostname.startsWith('[') && hostname.endsWith(']')) {
      hostname = hostname.slice(1, -1);
    }

    for (const endpoint of METADATA_ENDPOINTS) {
      if (hostname === endpoint || hostname.endsWith(`.${endpoint}`)) {
        return {
          valid: false,
          error: `Access to cloud metadata endpoints is blocked: ${endpoint}`,
        };
      }
    }

    // Check for private IP ranges (unless explicitly allowed)
    if (!allowPrivateIPs) {
      for (const range of PRIVATE_IP_RANGES) {
        if (range.test(hostname)) {
          return {
            valid: false,
            error: `Access to private IP addresses is blocked: ${hostname}`,
          };
        }
      }
    }

    // Warn about non-standard ports
    if (parsed.port && !['80', '443'].includes(parsed.port)) {
      warnings.push(`Non-standard port detected: ${parsed.port}`);
    }

    return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
  } catch (error) {
    return {
      valid: false,
      error: `Invalid URL format: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
}

/**
 * Validate user input against prompt injection attacks
 *
 * Detects patterns commonly used in prompt injection:
 * - "Ignore previous instructions"
 * - "System:"
 * - Model-specific delimiters ([INST], <|im_start|>, etc.)
 * - Role confusion attempts
 *
 * @param input - User input to validate
 * @param strict - Strict mode blocks any matches (default: false, returns warnings)
 * @returns ValidationResult
 */
export function validatePrompt(input: string, strict = false): ValidationResult {
  const warnings: string[] = [];

  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      const message = `Potential prompt injection detected: Pattern match for ${pattern}`;

      if (strict) {
        return {
          valid: false,
          error: message,
        };
      } else {
        warnings.push(message);
      }
    }
  }

  // Check for excessive control characters
  const controlCharCount = (input.match(/[\x00-\x1F\x7F]/g) || []).length;
  if (controlCharCount > 5) {
    const message = `Excessive control characters detected: ${controlCharCount}`;

    if (strict) {
      return {
        valid: false,
        error: message,
      };
    } else {
      warnings.push(message);
    }
  }

  return {
    valid: true,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

/**
 * Validate file path against path traversal attacks
 *
 * Blocks:
 * - Directory traversal (../, ..\)
 * - URL encoded traversal (%2e%2e%2f)
 * - Absolute paths (unless explicitly allowed)
 *
 * @param path - File path to validate
 * @param allowAbsolute - Allow absolute paths (default: false)
 * @returns ValidationResult
 */
export function validatePath(path: string, allowAbsolute = false): ValidationResult {
  const warnings: string[] = [];

  // Check for path traversal patterns
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(path)) {
      return {
        valid: false,
        error: `Path traversal detected: ${path}`,
      };
    }
  }

  // Check for absolute paths (unless allowed)
  if (!allowAbsolute && (path.startsWith('/') || /^[A-Za-z]:/.test(path))) {
    return {
      valid: false,
      error: `Absolute paths are not allowed: ${path}`,
    };
  }

  // Warn about hidden files
  if (path.split('/').some(segment => segment.startsWith('.'))) {
    warnings.push(`Hidden file or directory detected: ${path}`);
  }

  return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Validate command input against command injection attacks
 *
 * Blocks:
 * - Shell metacharacters (; & | ` $ ( ))
 * - Command substitution ($(...), `...`)
 * - Variable expansion (${...})
 * - Redirection operators (>, <, >>&, etc.)
 *
 * Note: This is a basic check. Prefer allowlists over blocklists.
 * Use parameterized commands or safe libraries when possible.
 *
 * @param input - Command input to validate
 * @returns ValidationResult
 */
export function validateCommand(input: string): ValidationResult {
  for (const pattern of COMMAND_INJECTION_PATTERNS) {
    if (pattern.test(input)) {
      return {
        valid: false,
        error: `Potential command injection detected: Shell metacharacter found`,
      };
    }
  }

  // Check for null bytes
  if (input.includes('\0')) {
    return {
      valid: false,
      error: `Null byte detected in command input`,
    };
  }

  return { valid: true };
}

/**
 * Sanitize string for safe logging
 *
 * Removes or escapes sensitive patterns before logging:
 * - API keys (Bearer tokens, API key patterns)
 * - Passwords (password= patterns)
 * - Control characters
 *
 * @param input - String to sanitize
 * @returns Sanitized string safe for logging
 */
export function sanitizeForLogging(input: string): string {
  return input
    // Redact Bearer tokens
    .replace(/Bearer\s+[A-Za-z0-9_-]+/gi, 'Bearer [REDACTED]')
    // Redact API keys
    .replace(/(['\"]?api[_-]?key['\"]?\s*[:=]\s*)['\"]?[A-Za-z0-9_-]+['\"]?/gi, '$1[REDACTED]')
    // Redact passwords
    .replace(/(['\"]?password['\"]?\s*[:=]\s*)['\"]?[^\s'"]+['\"]?/gi, '$1[REDACTED]')
    // Remove control characters (except newlines and tabs)
    .replace(/[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F]/g, '');
}

/**
 * Validate email address format
 *
 * Basic email validation for common use cases.
 * Not RFC 5322 compliant, but catches common errors.
 *
 * @param email - Email address to validate
 * @returns ValidationResult
 */
export function validateEmail(email: string): ValidationResult {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(email)) {
    return {
      valid: false,
      error: `Invalid email format: ${email}`,
    };
  }

  // Check for suspicious patterns
  const warnings: string[] = [];

  if (email.length > 254) {
    return {
      valid: false,
      error: `Email address too long (max 254 characters)`,
    };
  }

  const [localPart, domain] = email.split('@');

  if (localPart.length > 64) {
    return {
      valid: false,
      error: `Email local part too long (max 64 characters)`,
    };
  }

  // Warn about unusual characters
  if (/[<>()[\]\\,;:\s"]/.test(localPart)) {
    warnings.push(`Unusual characters in email local part: ${localPart}`);
  }

  return { valid: true, warnings: warnings.length > 0 ? warnings : undefined };
}

/**
 * Combine multiple validation results
 *
 * Useful when applying multiple validations to the same input.
 *
 * @param results - Array of ValidationResult objects
 * @returns Combined ValidationResult (invalid if any are invalid)
 */
export function combineValidations(...results: ValidationResult[]): ValidationResult {
  const allWarnings: string[] = [];

  for (const result of results) {
    if (!result.valid) {
      return result; // Return first error
    }
    if (result.warnings) {
      allWarnings.push(...result.warnings);
    }
  }

  return {
    valid: true,
    warnings: allWarnings.length > 0 ? allWarnings : undefined,
  };
}
