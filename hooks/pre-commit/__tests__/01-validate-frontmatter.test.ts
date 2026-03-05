#!/usr/bin/env bun
/**
 * Unit tests for frontmatter validation
 *
 * Tests:
 * - Valid skill frontmatter
 * - Invalid skill frontmatter (missing fields)
 * - Invalid skill frontmatter (wrong types)
 * - Valid blog post frontmatter
 * - No frontmatter handling
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import matter from 'gray-matter';

const TEST_ROOT = join(import.meta.dir, 'fixtures', 'frontmatter');
const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..', '..');
const SKILL_SCHEMA_PATH = join(FRAMEWORK_ROOT, 'tools', 'framework', 'security', 'schemas', 'skill-frontmatter.schema.json');
const BLOG_SCHEMA_PATH = join(FRAMEWORK_ROOT, 'tools', 'framework', 'security', 'schemas', 'blog-post-frontmatter.schema.json');

interface TestResult {
  name: string;
  passed: boolean;
  error?: string;
}

const results: TestResult[] = [];

function test(name: string, fn: () => void) {
  try {
    fn();
    results.push({ name, passed: true });
    console.log(`✓ ${name}`);
  } catch (error) {
    results.push({
      name,
      passed: false,
      error: error instanceof Error ? error.message : String(error)
    });
    console.log(`✗ ${name}: ${error instanceof Error ? error.message : error}`);
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateFrontmatter(filePath: string, schemaPath: string): { valid: boolean; errors: string[] } {
  const ajv = new Ajv({ allErrors: true });
  addFormats(ajv);
  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));
  const content = readFileSync(filePath, 'utf-8');
  const parsed = matter(content);

  if (!parsed.data || Object.keys(parsed.data).length === 0) {
    return { valid: false, errors: ['No frontmatter found'] };
  }

  const validate = ajv.compile(schema);
  const valid = validate(parsed.data);

  if (!valid && validate.errors) {
    const errors = validate.errors.map(err =>
      `${err.instancePath || 'root'}: ${err.message}`
    );
    return { valid: false, errors };
  }

  return { valid: true, errors: [] };
}

// Test 1: Valid skill frontmatter
test('Valid skill frontmatter should pass', () => {
  const result = validateFrontmatter(
    join(TEST_ROOT, 'valid-skill.md'),
    SKILL_SCHEMA_PATH
  );
  assert(result.valid, `Expected valid, got errors: ${result.errors.join(', ')}`);
});

// Test 2: Invalid skill - missing required field
test('Invalid skill (missing name) should fail', () => {
  const result = validateFrontmatter(
    join(TEST_ROOT, 'invalid-skill-missing-name.md'),
    SKILL_SCHEMA_PATH
  );
  assert(!result.valid, 'Expected validation to fail for missing name');
  assert(result.errors.length > 0, 'Expected errors for missing name');
});

// Test 3: Invalid skill - wrong type
test('Invalid skill (wrong tag type) should fail', () => {
  const result = validateFrontmatter(
    join(TEST_ROOT, 'invalid-skill-wrong-type.md'),
    SKILL_SCHEMA_PATH
  );
  assert(!result.valid, 'Expected validation to fail for wrong type');
  assert(result.errors.length > 0, 'Expected errors for wrong type');
});

// Test 4: No frontmatter
test('File without frontmatter should fail', () => {
  const result = validateFrontmatter(
    join(TEST_ROOT, 'no-frontmatter.md'),
    SKILL_SCHEMA_PATH
  );
  assert(!result.valid, 'Expected validation to fail for missing frontmatter');
  assert(result.errors.includes('No frontmatter found'), 'Expected "No frontmatter found" error');
});

// Test 5: Valid blog post frontmatter
test('Valid blog post frontmatter should pass', () => {
  const result = validateFrontmatter(
    join(TEST_ROOT, 'valid-blog-post.md'),
    BLOG_SCHEMA_PATH
  );
  assert(result.valid, `Expected valid, got errors: ${result.errors.join(', ')}`);
});

// Print summary
console.log('\n--- Test Summary ---');
const passed = results.filter(r => r.passed).length;
const failed = results.filter(r => !r.passed).length;
console.log(`Passed: ${passed}`);
console.log(`Failed: ${failed}`);
console.log(`Total: ${results.length}`);

if (failed > 0) {
  console.log('\nFailed tests:');
  results.filter(r => !r.passed).forEach(r => {
    console.log(`  - ${r.name}: ${r.error}`);
  });
  process.exit(1);
} else {
  console.log('\n✓ All tests passed!');
  process.exit(0);
}
