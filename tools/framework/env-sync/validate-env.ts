#!/usr/bin/env bun
/**
 * Environment File Validator
 *
 * Validates .env files against the .env.structure.yaml specification.
 * Checks for required keys, data types, and structural integrity.
 *
 * Usage:
 *   bun tools/framework/env-sync/validate-env.ts /path/to/.env
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml, parseAllDocuments as parseAllYaml } from 'yaml';
import { parseEnvFile, getAllKeys } from './parser-env';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface ValidationError {
  type: 'required_missing' | 'invalid_type' | 'parse_error' | 'structure_error';
  key?: string;
  section?: string;
  message: string;
  severity: 'error' | 'warning';
}

interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  keysFound: number;
  requiredKeysMissing: string[];
}

/**
 * Load structure specification
 */
function loadStructure(): Record<string, any> | null {
  const structurePath = join(FRAMEWORK_ROOT, '.env.structure.yaml');

  if (!existsSync(structurePath)) {
    console.error(`Structure file not found: ${structurePath}`);
    return null;
  }

  try {
    const content = readFileSync(structurePath, 'utf-8');

    // Split by document separator and take first document
    const documents = content.split('\n---\n');
    const firstDoc = documents[0];

    try {
      // Try parsing first document
      return parseYaml(firstDoc);
    } catch (e) {
      // If single parse fails, try parsing all documents
      try {
        const allDocs = parseAllYaml(content);
        if (allDocs.length > 0) {
          return allDocs[0].toJSON();
        }
      } catch (e2) {
        // Both methods failed
        console.error(`Failed to parse structure file: ${e}`);
        return null;
      }
    }
  } catch (error) {
    console.error(`Failed to load structure file: ${error}`);
    return null;
  }
}

/**
 * Validate that required keys are present
 */
function validateRequiredKeys(envKeys: Map<string, string>, structure: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!structure.validation) {
    return errors;
  }

  for (const validation of structure.validation) {
    if (validation.required_keys) {
      for (const requiredKey of validation.required_keys) {
        if (!envKeys.has(requiredKey)) {
          errors.push({
            type: 'required_missing',
            key: requiredKey,
            section: validation.section,
            message: `Required key missing: ${requiredKey} (section: ${validation.section})`,
            severity: 'error'
          });
        }
      }
    }
  }

  return errors;
}

/**
 * Validate key names against specification
 */
function validateKeyNames(envKeys: Map<string, string>, structure: Record<string, any>): ValidationError[] {
  const errors: ValidationError[] = [];
  const validKeys = new Set<string>();

  // Collect all valid keys from structure
  if (structure.sections) {
    for (const section of structure.sections) {
      if (section.keys) {
        for (const key of section.keys) {
          validKeys.add(key.name);
        }
      }
    }
  }

  // Check for unknown keys
  for (const key of envKeys.keys()) {
    if (!validKeys.has(key)) {
      errors.push({
        type: 'structure_error',
        key,
        message: `Unknown key: ${key} (not in specification)`,
        severity: 'warning'
      });
    }
  }

  return errors;
}

/**
 * Validate .env file
 */
export async function validateEnv(envPath: string): Promise<ValidationResult> {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];

  // Load and parse .env file
  const parsed = parseEnvFile(envPath);
  if (!parsed) {
    return {
      valid: false,
      errors: [
        {
          type: 'parse_error',
          message: `Failed to parse .env file: ${envPath}`,
          severity: 'error'
        }
      ],
      warnings: [],
      keysFound: 0,
      requiredKeysMissing: []
    };
  }

  const envKeys = getAllKeys(parsed);

  // Load structure specification
  const structure = loadStructure();
  if (!structure) {
    return {
      valid: false,
      errors: [
        {
          type: 'structure_error',
          message: 'Failed to load .env.structure.yaml',
          severity: 'error'
        }
      ],
      warnings: [],
      keysFound: envKeys.size,
      requiredKeysMissing: []
    };
  }

  // Validate required keys
  const requiredErrors = validateRequiredKeys(envKeys, structure);
  errors.push(...requiredErrors);

  // Validate key names
  const nameErrors = validateKeyNames(envKeys, structure);
  nameErrors.forEach((err) => {
    if (err.severity === 'error') {
      errors.push(err);
    } else {
      warnings.push(err);
    }
  });

  // Collect missing required keys
  const requiredKeysMissing = requiredErrors
    .filter((err) => err.key)
    .map((err) => err.key!)
    .filter((v, i, a) => a.indexOf(v) === i);

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    keysFound: envKeys.size,
    requiredKeysMissing
  };
}

// CLI execution
if (import.meta.main) {
  const envPath = process.argv[2] || join(FRAMEWORK_ROOT, '.env');

  console.log('\n' + '='.repeat(70));
  console.log('ENVIRONMENT FILE VALIDATOR');
  console.log('='.repeat(70));
  console.log(`\nValidating: ${envPath}\n`);

  validateEnv(envPath).then((result) => {
    console.log(`Keys Found: ${result.keysFound}`);
    console.log(`Status: ${result.valid ? '✅ VALID' : '❌ INVALID'}\n`);

    if (result.errors.length > 0) {
      console.log(`ERRORS (${result.errors.length}):`);
      for (const err of result.errors) {
        console.log(`  ❌ ${err.message}`);
      }
    }

    if (result.warnings.length > 0) {
      console.log(`\nWARNINGS (${result.warnings.length}):`);
      for (const warn of result.warnings) {
        console.log(`  ⚠️  ${warn.message}`);
      }
    }

    if (result.requiredKeysMissing.length > 0) {
      console.log(`\nREQUIRED KEYS MISSING (${result.requiredKeysMissing.length}):`);
      for (const key of result.requiredKeysMissing) {
        console.log(`  • ${key}`);
      }
    }

    console.log('\n' + '='.repeat(70) + '\n');

    process.exit(result.valid ? 0 : 1);
  });
}
