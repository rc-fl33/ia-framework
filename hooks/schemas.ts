/**
 * Hook Input Schemas
 *
 * Zod schemas for validating all hook inputs.
 * Provides type-safe validation and clear error messages for malformed input.
 *
 * All schemas reject invalid input and fail-closed on validation errors.
 */

import { z } from 'zod';

// ============================================================================
// SECURITY HOOKS
// ============================================================================

/**
 * Credential Guardian Input Schema
 * Validates Read tool calls for credential file access control
 */
export const CredentialGuardianInputSchema = z.object({
  tool_name: z.literal('Read'),
  tool_input: z.object({
    file_path: z.string()
      .min(1, 'file_path cannot be empty')
      .max(4096, 'file_path exceeds maximum length'),
    offset: z.number().int().min(0, 'offset must be non-negative').optional(),
    limit: z.number().int().min(1, 'limit must be positive').optional(),
    pages: z.string().optional()
  })
});

export type CredentialGuardianInput = z.infer<typeof CredentialGuardianInputSchema>;

/**
 * Bash Command Validator Input Schema
 * Validates Bash tool calls for dangerous command detection
 */
export const BashValidatorInputSchema = z.object({
  tool_name: z.literal('Bash'),
  tool_input: z.object({
    command: z.string()
      .min(1, 'command cannot be empty')
      .max(65536, 'command exceeds maximum length'),
    timeout: z.number()
      .int()
      .min(0, 'timeout must be non-negative')
      .max(600000, 'timeout exceeds maximum (10 minutes)')
      .optional(),
    description: z.string().max(1000).optional(),
    run_in_background: z.boolean().optional()
  })
});

export type BashValidatorInput = z.infer<typeof BashValidatorInputSchema>;

/**
 * File Guardian Input Schema
 * Validates Write tool calls for file creation rules
 */
export const FileGuardianInputSchema = z.object({
  tool_name: z.literal('Write'),
  tool_input: z.object({
    file_path: z.string()
      .min(1, 'file_path cannot be empty')
      .max(4096, 'file_path exceeds maximum length'),
    content: z.string()
      .max(10485760, 'content exceeds maximum size (10MB)')
  })
});

export type FileGuardianInput = z.infer<typeof FileGuardianInputSchema>;

// ============================================================================
// WORKFLOW HOOKS
// ============================================================================

/**
 * Anti-Rationalization Hook Input Schema
 * Validates assistant message content for rationalization phrases
 */
export const AntiRationalizationInputSchema = z.object({
  assistant_message: z.string().optional(),
  response: z.string().optional()
}).refine(
  obj => obj.assistant_message || obj.response,
  'Either assistant_message or response must be provided'
);

export type AntiRationalizationInput = z.infer<typeof AntiRationalizationInputSchema>;

/**
 * Checklist Enforcer Input Schema
 * Validates tool calls against workflow verification requirements
 */
export const ChecklistEnforcerInputSchema = z.object({
  tool_name: z.string().min(1),
  tool_input: z.record(z.unknown()),
  session_id: z.string().optional()
});

export type ChecklistEnforcerInput = z.infer<typeof ChecklistEnforcerInputSchema>;

/**
 * Enforce Workflow Input Schema
 * Validates tool calls against active workflow phase rules
 */
export const EnforceWorkflowInputSchema = z.object({
  tool_name: z.string().min(1),
  tool_input: z.record(z.unknown()),
  session_id: z.string(),
  cwd: z.string()
});

export type EnforceWorkflowInput = z.infer<typeof EnforceWorkflowInputSchema>;

/**
 * Package Manager Enforcement Input Schema
 * Validates Bash commands against package manager policies
 */
export const PackageManagerInputSchema = z.object({
  tool_name: z.literal('Bash'),
  tool_input: z.object({
    command: z.string().optional(),
    timeout: z.number().optional(),
    description: z.string().optional(),
    run_in_background: z.boolean().optional()
  })
});

export type PackageManagerInput = z.infer<typeof PackageManagerInputSchema>;

/**
 * Active Work Limiter Input Schema
 * Validates Write/Edit tool calls on active-tracker.md
 */
export const ActiveWorkLimiterInputSchema = z.object({
  tool_name: z.enum(['Write', 'Edit']),
  tool_input: z.object({
    file_path: z.string().optional(),
    content: z.string().optional(),
    new_string: z.string().optional(),
    old_string: z.string().optional()
  })
});

export type ActiveWorkLimiterInput = z.infer<typeof ActiveWorkLimiterInputSchema>;

// ============================================================================
// VALIDATION UTILITIES
// ============================================================================

/**
 * Safe schema validation with error handling
 * Returns validation result with detailed error information
 *
 * @param schema Zod schema to validate against
 * @param data Data to validate
 * @returns { success: true, data } on valid input
 * @returns { success: false, errors } on invalid input
 */
export function safeValidate<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors?: z.ZodError['errors'] } {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  return {
    success: false,
    errors: result.error?.errors || []
  };
}

/**
 * Format validation errors for logging
 * @param errors Zod validation errors
 * @returns Formatted error message
 */
export function formatValidationErrors(errors: z.ZodError['errors'] | undefined): string {
  if (!errors || !Array.isArray(errors)) {
    return '  - Unable to format validation errors';
  }

  return errors
    .map(err => {
      const path = err.path.length > 0 ? `${err.path.join('.')}` : 'root';
      return `  - ${path}: ${err.message}`;
    })
    .join('\n');
}
