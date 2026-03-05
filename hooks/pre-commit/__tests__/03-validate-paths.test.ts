#!/usr/bin/env bun
/**
 * Unit tests for path validation
 *
 * Tests:
 * - Valid relative paths are recognized
 * - Invalid/non-existent paths are detected
 * - Absolute paths are flagged
 * - Path extraction from markdown works correctly
 */

import { readFileSync, existsSync } from 'fs';
import { join, isAbsolute, resolve } from 'path';

const TEST_ROOT = join(import.meta.dir, 'fixtures', 'paths');
const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..', '..');

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

function extractPaths(content: string): string[] {
  const paths: string[] = [];

  // Pattern: `path/to/file.ext` in backticks
  const backtickPattern = /`([^`]+\.[a-z]{2,4})`/g;
  let match;

  while ((match = backtickPattern.exec(content)) !== null) {
    const path = match[1];
    // Skip URLs and common false positives
    if (
      !path.startsWith('http') &&
      !path.startsWith('npm ') &&
      !path.includes('example.') &&
      !path.includes('@')
    ) {
      paths.push(path);
    }
  }

  return paths;
}

function validatePaths(filePath: string, basePath: string): {
  valid: string[];
  invalid: string[];
  absolute: string[];
} {
  const content = readFileSync(filePath, 'utf-8');
  const paths = extractPaths(content);

  const valid: string[] = [];
  const invalid: string[] = [];
  const absolute: string[] = [];

  for (const path of paths) {
    if (isAbsolute(path)) {
      absolute.push(path);
      continue;
    }

    const fullPath = resolve(basePath, path);
    if (existsSync(fullPath)) {
      valid.push(path);
    } else {
      invalid.push(path);
    }
  }

  return { valid, invalid, absolute };
}

// Test 1: Extract paths from markdown
test('Path extraction should find paths in backticks', () => {
  const content = readFileSync(join(TEST_ROOT, 'valid-paths.md'), 'utf-8');
  const paths = extractPaths(content);

  assert(paths.length > 0, 'Expected to find at least one path');
  assert(
    paths.some(p => p.includes('valid-paths.md')),
    'Expected to find reference to valid-paths.md'
  );
});

// Test 2: Valid paths should be recognized
test('Valid paths should be recognized', () => {
  const result = validatePaths(join(TEST_ROOT, 'valid-paths.md'), FRAMEWORK_ROOT);

  assert(result.valid.length > 0, 'Expected to find valid paths');
  assert(result.invalid.length === 0, `Expected no invalid paths, found: ${result.invalid.join(', ')}`);
  assert(result.absolute.length === 0, `Expected no absolute paths, found: ${result.absolute.join(', ')}`);
});

// Test 3: Invalid paths should be detected
test('Invalid paths should be detected', () => {
  const result = validatePaths(join(TEST_ROOT, 'invalid-paths.md'), FRAMEWORK_ROOT);

  assert(result.invalid.length > 0, 'Expected to find invalid paths');
  assert(
    result.invalid.some(p => p.includes('does/not/exist')),
    'Expected to find "does/not/exist" path'
  );
});

// Test 4: Absolute paths should be flagged
test('Absolute paths should be flagged', () => {
  const result = validatePaths(join(TEST_ROOT, 'absolute-path.md'), FRAMEWORK_ROOT);

  assert(result.absolute.length > 0, 'Expected to find absolute paths');
  assert(
    result.absolute.some(p => p.startsWith('/home/')),
    'Expected to find /home/ absolute path'
  );
});

// Test 5: Path validation should handle edge cases
test('Path validation should skip URLs and examples', () => {
  const content = `
See https://example.com/file.ts for details.
Run \`npm install package.json\` to install.
Example: \`example.ts\` shows the pattern.
`;

  const paths = extractPaths(content);

  assert(!paths.includes('https://example.com/file.ts'), 'Should skip URLs');
  assert(!paths.includes('example.ts'), 'Should skip example files');
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
