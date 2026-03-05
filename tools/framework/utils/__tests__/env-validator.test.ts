#!/usr/bin/env bun
/**
 * Test Suite: Environment Variable Validation
 *
 * Tests M-5 Environment Variable Validation implementation
 */

import { describe, test, expect, beforeEach, afterEach } from 'bun:test';
import {
  validateEnv,
  EnvValidationSchemas,
  hasEnvConfigured,
  getValidatedEnv
} from '../env-validator';

// Store original env
let originalEnv: NodeJS.ProcessEnv;

beforeEach(() => {
  originalEnv = { ...process.env };
});

afterEach(() => {
  process.env = originalEnv;
});

describe('Environment Variable Validation - OpenRouter (Required)', () => {
  test('should pass with valid OpenRouter API key', () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-1234567890abcdef1234567890';

    const result = validateEnv(EnvValidationSchemas.openrouter);

    expect(result.success).toBe(true);
    expect(result.errors).toBeUndefined();
  });

  test('should fail with missing OpenRouter API key', () => {
    delete process.env.OPENROUTER_API_KEY;

    const result = validateEnv(EnvValidationSchemas.openrouter);

    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
    expect(result.errors?.some(e => e.includes('OPENROUTER_API_KEY'))).toBe(true);
  });

  test('should fail with too short API key', () => {
    process.env.OPENROUTER_API_KEY = 'short';

    const result = validateEnv(EnvValidationSchemas.openrouter);

    expect(result.success).toBe(false);
    expect(result.errors?.some(e => e.includes('OPENROUTER_API_KEY'))).toBe(true);
    // Check for length validation (various Zod message formats)
    expect(result.errors?.some(e => e.toLowerCase().includes('20') || e.toLowerCase().includes('length'))).toBe(true);
  });
});

describe('Environment Variable Validation - Context7 (Optional)', () => {
  test('should pass with valid Context7 API key', () => {
    process.env.CONTEXT7_API_KEY = 'ctx7_1234567890abcdef1234567890';

    const result = validateEnv(EnvValidationSchemas.context7);

    expect(result.success).toBe(true);
  });

  test('should pass when Context7 not configured (optional)', () => {
    delete process.env.CONTEXT7_API_KEY;

    const result = validateEnv(EnvValidationSchemas.context7);

    // Optional schema should pass even without values
    expect(result.success).toBe(true);
  });
});

describe('Environment Variable Validation - Ghost Blog', () => {
  test('should pass with valid Ghost configuration', () => {
    process.env.GHOST_ADMIN_API_KEY = '1234567890abcdef1234567890:1234567890abcdef1234567890abcdef';
    process.env.GHOST_CONTENT_API_KEY = 'abcdef1234567890abcdef1234567890';
    process.env.GHOST_API_URL = 'https://myblog.ghost.io';

    const result = validateEnv(EnvValidationSchemas.ghost);

    expect(result.success).toBe(true);
  });

  test('should fail with invalid Ghost URL', () => {
    process.env.GHOST_ADMIN_API_KEY = '1234567890abcdef1234567890:1234567890abcdef1234567890abcdef';
    process.env.GHOST_CONTENT_API_KEY = 'abcdef1234567890abcdef1234567890';
    process.env.GHOST_API_URL = 'not-a-url';

    const result = validateEnv(EnvValidationSchemas.ghost);

    expect(result.success).toBe(false);
    expect(result.errors?.some(e => e.includes('GHOST_API_URL'))).toBe(true);
  });
});

describe('Environment Variable Validation - VPS Configuration', () => {
  test('should pass with valid VPS configuration', () => {
    process.env.OVHCLOUD_VPS_HOST = '192.168.1.100';
    process.env.OVHCLOUD_VPS_USER = 'ubuntu';
    process.env.OVHCLOUD_VPS_PORT = '2222';
    process.env.OVHCLOUD_VPS_SSH_KEY = '~/.ssh/id_rsa';

    const result = validateEnv(EnvValidationSchemas.vpsOvhcloud);

    expect(result.success).toBe(true);
  });

  test('should fail with invalid port', () => {
    process.env.OVHCLOUD_VPS_HOST = '192.168.1.100';
    process.env.OVHCLOUD_VPS_USER = 'ubuntu';
    process.env.OVHCLOUD_VPS_PORT = '70000'; // Invalid port
    process.env.OVHCLOUD_VPS_SSH_KEY = '~/.ssh/id_rsa';

    const result = validateEnv(EnvValidationSchemas.vpsOvhcloud);

    expect(result.success).toBe(false);
    expect(result.errors?.some(e => e.includes('PORT'))).toBe(true);
  });

  test('should fail with non-numeric port', () => {
    process.env.OVHCLOUD_VPS_HOST = '192.168.1.100';
    process.env.OVHCLOUD_VPS_USER = 'ubuntu';
    process.env.OVHCLOUD_VPS_PORT = 'not-a-number';
    process.env.OVHCLOUD_VPS_SSH_KEY = '~/.ssh/id_rsa';

    const result = validateEnv(EnvValidationSchemas.vpsOvhcloud);

    expect(result.success).toBe(false);
  });
});

describe('Environment Variable Validation - HackerOne', () => {
  test('should pass with valid HackerOne configuration', () => {
    process.env.HACKERONE_USERNAME = 'testuser';
    process.env.HACKERONE_API_TOKEN = 'h1_api_token_1234567890abcdef';
    process.env.HACKERONE_EMAIL = 'user@example.com';

    const result = validateEnv(EnvValidationSchemas.hackerone);

    expect(result.success).toBe(true);
  });

  test('should fail with invalid email', () => {
    process.env.HACKERONE_USERNAME = 'testuser';
    process.env.HACKERONE_API_TOKEN = 'h1_api_token_1234567890abcdef';
    process.env.HACKERONE_EMAIL = 'not-an-email';

    const result = validateEnv(EnvValidationSchemas.hackerone);

    expect(result.success).toBe(false);
    expect(result.errors?.some(e => e.includes('EMAIL'))).toBe(true);
  });
});

describe('Helper Functions', () => {
  test('hasEnvConfigured should return true when configured', () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-1234567890abcdef1234567890';

    const configured = hasEnvConfigured(EnvValidationSchemas.openrouter);

    expect(configured).toBe(true);
  });

  test('hasEnvConfigured should return false when not configured', () => {
    delete process.env.OPENROUTER_API_KEY;

    const configured = hasEnvConfigured(EnvValidationSchemas.openrouter);

    expect(configured).toBe(false);
  });

  test('getValidatedEnv should return data when valid', () => {
    process.env.OPENROUTER_API_KEY = 'sk-or-v1-1234567890abcdef1234567890';

    const data = getValidatedEnv(EnvValidationSchemas.openrouter);

    expect(data).toBeDefined();
    expect(data).toHaveProperty('OPENROUTER_API_KEY');
  });

  test('getValidatedEnv should return undefined when invalid', () => {
    delete process.env.OPENROUTER_API_KEY;

    const data = getValidatedEnv(EnvValidationSchemas.openrouter);

    expect(data).toBeUndefined();
  });
});

describe('Framework Configuration', () => {
  test('should pass with valid timezone', () => {
    process.env.USER_TIMEZONE = 'America/Chicago';

    const result = validateEnv(EnvValidationSchemas.framework);

    expect(result.success).toBe(true);
  });

  test('should fail with invalid timezone format', () => {
    process.env.USER_TIMEZONE = 'invalid-timezone';

    const result = validateEnv(EnvValidationSchemas.framework);

    expect(result.success).toBe(false);
    expect(result.errors?.some(e => e.includes('USER_TIMEZONE'))).toBe(true);
  });

  test('should pass when timezone not set (optional)', () => {
    delete process.env.USER_TIMEZONE;
    delete process.env.IA_FRAMEWORK_ROOT;

    const result = validateEnv(EnvValidationSchemas.framework);

    expect(result.success).toBe(true);
  });
});

console.log('\n✅ All environment validation tests defined');
console.log('Run with: bun test tools/framework/utils/__tests__/env-validator.test.ts\n');
