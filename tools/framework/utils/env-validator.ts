/**
 * Environment Variable Validation
 *
 * Validates environment variables at API client initialization to prevent
 * runtime failures from missing or malformed configuration.
 *
 * SECURITY PRINCIPLES:
 * - Fail fast on misconfiguration
 * - Clear error messages for missing/invalid vars
 * - Format validation (URL patterns, key lengths, token formats)
 * - Group by API client for easy testing
 *
 * Usage:
 *   import { validateEnv, EnvValidationSchemas } from '@/tools/framework/utils/env-validator';
 *
 *   // Validate specific API client
 *   const result = validateEnv(EnvValidationSchemas.openrouter);
 *   if (!result.success) {
 *     console.error('OpenRouter configuration invalid:', result.errors);
 *     process.exit(1);
 *   }
 */

import { z } from 'zod';

/**
 * Validation result structure
 */
export interface EnvValidationResult {
  success: boolean;
  errors?: string[];
  data?: Record<string, string>;
}

/**
 * Common validation patterns
 */
const Patterns = {
  /** API key (20-200 characters, alphanumeric + symbols) */
  apiKey: z.string().min(20).max(200),

  /** Short API key (10-200 characters) */
  apiKeyShort: z.string().min(10).max(200),

  /** URL (http or https) */
  url: z.string().url(),

  /** URL with optional path */
  urlWithPath: z.string().regex(/^https?:\/\/.+/),

  /** SSH key path */
  sshKeyPath: z.string().min(1),

  /** Port number (1-65535) */
  port: z.string().regex(/^\d+$/).refine(
    (val) => {
      const port = parseInt(val, 10);
      return port >= 1 && port <= 65535;
    },
    { message: 'Port must be between 1 and 65535' }
  ),

  /** Hostname or IP */
  host: z.string().min(1),

  /** Username */
  username: z.string().min(1).max(100),

  /** Email */
  email: z.string().email(),

  /** Timezone (IANA format) */
  timezone: z.string().regex(/^[A-Z][a-zA-Z]*\/[A-Z][a-zA-Z_]*$/),

  /** Git branch name */
  gitBranch: z.string().min(1).max(100),

  /** File path */
  filePath: z.string().min(1),

  /** Optional string */
  optional: z.string().optional(),

  /** Boolean as string */
  boolean: z.enum(['true', 'false', '1', '0', 'yes', 'no'])
};

/**
 * Environment variable validation schemas organized by API client
 */
export const EnvValidationSchemas = {
  /**
   * OpenRouter - Multi-model AI access
   * Required for: QA, chat, completion requests
   */
  openrouter: z.object({
    OPENROUTER_API_KEY: Patterns.apiKey
      .describe('OpenRouter API key - Get from https://openrouter.ai/keys')
  }),

  /**
   * Context7 - Library/framework documentation
   * Required for: Documentation lookup, preventing hallucinated code
   */
  context7: z.object({
    CONTEXT7_API_KEY: Patterns.apiKey.optional()
      .describe('Context7 API key - Get from https://context7.com')
  }),

  /**
   * GitHub - Repository operations
   * Required for: git-push, git-public, git-pull skills
   */
  github: z.object({
    GITHUB_TOKEN: Patterns.apiKey
      .describe('GitHub Personal Access Token - scope: repo, workflow')
  }).optional(),

  /**
   * Twingate - Zero-trust network access
   * Required for: Remote VPS access via Twingate
   */
  twingate: z.object({
    TWINGATE_NETWORK_NAME: Patterns.username
      .describe('Twingate network name'),
    TWINGATE_API_KEY: Patterns.apiKey
      .describe('Twingate API key')
  }).optional(),

  /**
   * NVD - National Vulnerability Database
   * Required for: CVE lookups, vulnerability research
   */
  nvd: z.object({
    NVD_API_KEY: Patterns.apiKeyShort.optional()
      .describe('NVD API key - Optional, increases rate limit')
  }).optional(),

  /**
   * Ghost - Blog platform
   * Required for: /write, /newsletter skills
   */
  ghost: z.object({
    GHOST_ADMIN_API_KEY: Patterns.apiKey
      .describe('Ghost Admin API key'),
    GHOST_CONTENT_API_KEY: Patterns.apiKey
      .describe('Ghost Content API key'),
    GHOST_API_URL: Patterns.url
      .describe('Ghost API URL (e.g., https://yourblog.ghost.io)')
  }).optional(),

  /**
   * Twitter/X - Social media integration
   * Required for: Automated blog post sharing
   */
  twitter: z.object({
    TWITTER_API_KEY: Patterns.apiKey
      .describe('Twitter API key'),
    TWITTER_API_SECRET: Patterns.apiKey
      .describe('Twitter API secret'),
    TWITTER_ACCESS_TOKEN: Patterns.apiKey
      .describe('Twitter access token'),
    TWITTER_ACCESS_TOKEN_SECRET: Patterns.apiKey
      .describe('Twitter access token secret'),
    TWITTER_BEARER_TOKEN: Patterns.apiKey
      .describe('Twitter bearer token')
  }).optional(),

  /**
   * VPS Configuration (OVHCloud example)
   * Required for: Remote command execution, security testing
   */
  vpsOvhcloud: z.object({
    OVHCLOUD_VPS_HOST: Patterns.host
      .describe('OVHCloud VPS hostname or IP'),
    OVHCLOUD_VPS_USER: Patterns.username
      .describe('SSH username'),
    OVHCLOUD_VPS_PORT: Patterns.port
      .describe('SSH port (default: 2222)'),
    OVHCLOUD_VPS_SSH_KEY: Patterns.sshKeyPath
      .describe('Path to SSH private key')
  }).optional(),

  /**
   * VPS Configuration (Hostinger example)
   * Required for: Bug bounty scrapers, n8n workflows
   */
  vpsHostinger: z.object({
    HOSTINGER_VPS_HOST: Patterns.host
      .describe('Hostinger VPS hostname or IP'),
    HOSTINGER_VPS_USER: Patterns.username
      .describe('SSH username'),
    HOSTINGER_VPS_PORT: Patterns.port
      .describe('SSH port'),
    HOSTINGER_VPS_SSH_KEY: Patterns.sshKeyPath
      .describe('Path to SSH private key')
  }).optional(),

  /**
   * HackerOne - Bug bounty platform
   * Required for: Bug bounty research, target enumeration
   */
  hackerone: z.object({
    HACKERONE_USERNAME: Patterns.username
      .describe('HackerOne username'),
    HACKERONE_API_TOKEN: Patterns.apiKey
      .describe('HackerOne API token'),
    HACKERONE_EMAIL: Patterns.email
      .describe('HackerOne account email')
  }).optional(),

  /**
   * n8n - Workflow automation
   * Required for: Automated workflow execution
   */
  n8n: z.object({
    N8N_API: Patterns.apiKey
      .describe('n8n API key'),
    N8N_INSTANCE_URL: Patterns.url
      .describe('n8n instance URL')
  }).optional(),

  /**
   * Framework Configuration
   * Optional: Framework behavior customization
   */
  framework: z.object({
    IA_FRAMEWORK_ROOT: Patterns.filePath.optional()
      .describe('Framework root directory (auto-detected if not set)'),
    USER_TIMEZONE: Patterns.timezone.optional()
      .describe('IANA timezone (e.g., America/Chicago)')
  })
};

/**
 * Validate environment variables against a schema
 *
 * @param schema - Zod schema to validate against
 * @returns Validation result with errors if any
 *
 * @example
 * const result = validateEnv(EnvValidationSchemas.openrouter);
 * if (!result.success) {
 *   console.error('Missing OpenRouter API key');
 *   process.exit(1);
 * }
 */
export function validateEnv(
  schema: z.ZodType<unknown>
): EnvValidationResult {
  try {
    const data = schema.parse(process.env);
    return {
      success: true,
      data: data as Record<string, string>
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map(issue => {
        const field = issue.path.join('.');
        return `${field}: ${issue.message}`;
      });

      return {
        success: false,
        errors
      };
    }

    return {
      success: false,
      errors: [`Unexpected validation error: ${String(error)}`]
    };
  }
}

/**
 * Validate required environment variables and exit on failure
 *
 * Use this in API client constructors to fail fast.
 *
 * @param schema - Zod schema to validate
 * @param clientName - Name of API client for error messages
 *
 * @example
 * export class OpenRouterClient {
 *   constructor() {
 *     requireEnv(EnvValidationSchemas.openrouter, 'OpenRouter');
 *     // ... rest of constructor
 *   }
 * }
 */
export function requireEnv(
  schema: z.ZodType<unknown>,
  clientName: string
): void {
  const result = validateEnv(schema);

  if (!result.success) {
    console.error(`\n❌ ${clientName} Configuration Error\n`);
    console.error('Missing or invalid environment variables:\n');

    result.errors?.forEach(error => {
      console.error(`  • ${error}`);
    });

    console.error('\nPlease update your .env file and try again.');
    console.error('See .env.example for required configuration.\n');

    process.exit(1);
  }
}

/**
 * Check if environment variables are configured (without exiting)
 *
 * Use this for optional API clients.
 *
 * @param schema - Zod schema to validate
 * @returns True if configured correctly
 */
export function hasEnvConfigured(schema: z.ZodType<unknown>): boolean {
  const result = validateEnv(schema);
  return result.success;
}

/**
 * Get validated environment variables
 *
 * Returns validated and typed env vars, or undefined if invalid.
 *
 * @param schema - Zod schema to validate
 * @returns Validated data or undefined
 */
export function getValidatedEnv<T>(
  schema: z.ZodType<T>
): T | undefined {
  const result = validateEnv(schema);
  return result.success ? (result.data as T) : undefined;
}
