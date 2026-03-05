#!/usr/bin/env bun
/**
 * Test Suite: Path Validation Security
 *
 * Tests M-2 Path Traversal Prevention enhancements:
 * - Symlink resolution and validation
 * - Windows device name blocking
 * - Path traversal prevention
 */

import { describe, test, expect, beforeAll, afterAll } from 'bun:test';
import { mkdirSync, writeFileSync, symlinkSync, rmSync, existsSync } from 'fs';
import { join } from 'path';
import { validatePath } from '@/tools/framework/utils/path-resolution';

const TEST_DIR = '/tmp/ia-test-path-validation';
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '../..');

beforeAll(() => {
  // Clean up any existing test directory
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
  mkdirSync(TEST_DIR, { recursive: true });
});

afterAll(() => {
  // Clean up test directory
  if (existsSync(TEST_DIR)) {
    rmSync(TEST_DIR, { recursive: true, force: true });
  }
});

describe('Path Validation - Basic Tests', () => {
  test('should allow valid path within framework', () => {
    const testPath = join(FRAMEWORK_ROOT, 'docs', 'test.md');
    const result = validatePath(testPath);

    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  test('should block path outside framework', () => {
    const testPath = '/etc/passwd';
    const result = validatePath(testPath);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('outside framework directory');
  });

  test('should block path with traversal sequence', () => {
    const testPath = join(FRAMEWORK_ROOT, '..', '..', 'etc', 'passwd');
    const result = validatePath(testPath);

    expect(result.valid).toBe(false);
    // Should either block traversal or detect it's outside framework
    expect(result.error).toBeDefined();
  });
});

describe('Path Validation - Windows Device Names', () => {
  const deviceNames = [
    'CON', 'PRN', 'AUX', 'NUL',
    'COM1', 'COM2', 'COM9',
    'LPT1', 'LPT2', 'LPT9'
  ];

  deviceNames.forEach(device => {
    test(`should block Windows device name: ${device}`, () => {
      const testPath = join(FRAMEWORK_ROOT, 'docs', device);
      const result = validatePath(testPath);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('device name');
      expect(result.error?.toUpperCase()).toContain(device);
    });

    test(`should block Windows device name with extension: ${device}.txt`, () => {
      const testPath = join(FRAMEWORK_ROOT, 'docs', `${device}.txt`);
      const result = validatePath(testPath);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('device name');
    });

    test(`should block Windows device name in path component: /docs/${device}/file.txt`, () => {
      const testPath = join(FRAMEWORK_ROOT, 'docs', device, 'file.txt');
      const result = validatePath(testPath);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('device name');
    });
  });

  test('should allow case-insensitive device name variations', () => {
    const variations = ['con', 'Con', 'CON', 'cOn'];

    variations.forEach(variant => {
      const testPath = join(FRAMEWORK_ROOT, 'docs', variant);
      const result = validatePath(testPath);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('device name');
    });
  });

  test('should allow legitimate files with device name substrings', () => {
    const legitimateNames = [
      'console.ts',      // Not CON
      'printer.ts',      // Not PRN
      'auxiliary.ts',    // Not AUX
      'config.json',     // Contains CON but not device name
      'compound.md'      // Contains COM but not device name
    ];

    legitimateNames.forEach(name => {
      const testPath = join(FRAMEWORK_ROOT, 'docs', name);
      const result = validatePath(testPath);

      expect(result.valid).toBe(true);
    });
  });
});

describe('Path Validation - Symlink Security', () => {
  test('should resolve symlinks and validate target', () => {
    // Create a legitimate target inside framework
    const targetDir = join(FRAMEWORK_ROOT, 'docs');
    const targetFile = join(targetDir, 'legitimate-target.md');

    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    writeFileSync(targetFile, '# Test');

    // Create symlink to it
    const symlinkPath = join(FRAMEWORK_ROOT, 'test-symlink.md');
    try {
      if (existsSync(symlinkPath)) {
        rmSync(symlinkPath);
      }
      symlinkSync(targetFile, symlinkPath);

      const result = validatePath(symlinkPath);

      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(targetFile);
    } finally {
      // Clean up
      if (existsSync(symlinkPath)) {
        rmSync(symlinkPath);
      }
      if (existsSync(targetFile)) {
        rmSync(targetFile);
      }
    }
  });

  test('should block symlink pointing outside framework', () => {
    // Create target outside framework
    const outsideTarget = join(TEST_DIR, 'outside-target.txt');
    writeFileSync(outsideTarget, 'malicious');

    // Create symlink inside framework pointing outside
    const symlinkPath = join(FRAMEWORK_ROOT, 'malicious-symlink.txt');
    try {
      if (existsSync(symlinkPath)) {
        rmSync(symlinkPath);
      }
      symlinkSync(outsideTarget, symlinkPath);

      const result = validatePath(symlinkPath);

      expect(result.valid).toBe(false);
      expect(result.error).toContain('outside framework directory');
    } finally {
      // Clean up
      if (existsSync(symlinkPath)) {
        rmSync(symlinkPath);
      }
    }
  });

  test('should handle non-existent paths gracefully', () => {
    const nonExistentPath = join(FRAMEWORK_ROOT, 'does-not-exist', 'file.txt');
    const result = validatePath(nonExistentPath);

    // Should validate parent directory rules
    expect(result).toBeDefined();
  });

  test('should handle symlink chains', () => {
    // Create chain: symlink1 -> symlink2 -> target
    const targetFile = join(FRAMEWORK_ROOT, 'docs', 'chain-target.md');
    const symlink1 = join(FRAMEWORK_ROOT, 'symlink1.md');
    const symlink2 = join(FRAMEWORK_ROOT, 'symlink2.md');

    try {
      const docsDir = join(FRAMEWORK_ROOT, 'docs');
      if (!existsSync(docsDir)) {
        mkdirSync(docsDir, { recursive: true });
      }

      writeFileSync(targetFile, '# Target');
      symlinkSync(targetFile, symlink2);
      symlinkSync(symlink2, symlink1);

      const result = validatePath(symlink1);

      // Should resolve entire chain
      expect(result.valid).toBe(true);
      expect(result.resolvedPath).toBe(targetFile);
    } finally {
      // Clean up
      [symlink1, symlink2, targetFile].forEach(path => {
        if (existsSync(path)) {
          rmSync(path);
        }
      });
    }
  });
});

describe('Path Validation - Edge Cases', () => {
  test('should handle paths with special characters', () => {
    const testPath = join(FRAMEWORK_ROOT, 'docs', 'file-with-special_chars@2024.md');
    const result = validatePath(testPath);

    expect(result.valid).toBe(true);
  });

  test('should handle paths with spaces', () => {
    const testPath = join(FRAMEWORK_ROOT, 'docs', 'file with spaces.md');
    const result = validatePath(testPath);

    expect(result.valid).toBe(true);
  });

  test('should handle very long paths', () => {
    const longName = 'a'.repeat(255); // Max filename length on most systems
    const testPath = join(FRAMEWORK_ROOT, 'docs', longName);
    const result = validatePath(testPath);

    expect(result).toBeDefined();
    // May be valid or invalid depending on filesystem limits
  });

  test('should handle Unicode characters', () => {
    const testPath = join(FRAMEWORK_ROOT, 'docs', '测试文件.md');
    const result = validatePath(testPath);

    expect(result.valid).toBe(true);
  });
});

console.log('\n✅ All path validation tests defined');
console.log('Run with: bun test hooks/__tests__/test-path-validation.ts\n');
