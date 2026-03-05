#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Hardcoded Count Prevention
 *
 * Blocks commits with hardcoded component counts (e.g., "18 skills", "151 tests").
 * Enforces V2 documentation standards.
 *
 * Exit codes:
 * - 0: No violations found (pass)
 * - 1: Violations found (block commit)
 */

import { spawnSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');
const VALIDATOR_SCRIPT = join(FRAMEWORK_ROOT, 'tools', 'validation', 'detect-hardcoded-counts.ts');

function getStagedDocumentationFiles(): string[] {
  /**
   * Get staged documentation files.
   *
   * Excludes:
   * - archive/ - Frozen V1 reference
   * - plans/ - Design documents
   * - sessions/ - Historical reports
   * - output/ - Module outputs
   */
  try {
    const result = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
      encoding: 'utf-8',
      timeout: 5000,
    });

    if (!result.stdout || result.stdout.trim().length === 0) {
      return [];
    }

    const allStaged = result.stdout.trim().split('\n');

    // Filter for documentation files
    const documentationFiles: string[] = [];
    const excludePatterns = new Set(['archive', 'plans', 'sessions', 'output']);

    for (const filePath of allStaged) {
      if (!filePath) {
        continue;
      }

      // Check extension
      if (!['.md', '.yml', '.yaml'].some(ext => filePath.endsWith(ext))) {
        continue;
      }

      // Check if in excluded directory
      const parts = filePath.split(/[/\\]/);
      if (parts.some(part => excludePatterns.has(part))) {
        continue;
      }

      documentationFiles.push(filePath);
    }

    return documentationFiles;
  } catch (err) {
    return [];
  }
}

function main() {
  console.error('🔍 Checking for hardcoded counts...');

  // Get staged documentation files
  const stagedFiles = getStagedDocumentationFiles();

  if (stagedFiles.length === 0) {
    console.error('✅ No documentation files modified, skipping count validation');
    process.exit(0);
  }

  // Run count detection
  if (!existsSync(VALIDATOR_SCRIPT)) {
    console.error(`⚠️  Validator script not found: ${VALIDATOR_SCRIPT} - skipping`);
    process.exit(0);
  }

  try {
    const result = spawnSync('bun', ['run', VALIDATOR_SCRIPT, ...stagedFiles], {
      stdio: 'inherit',
      timeout: 30000,
    });

    if (result.status === 0) {
      console.error('✅ No hardcoded counts detected!');
      process.exit(0);
    } else {
      console.error('');
      console.error('❌ HARDCODED COUNTS DETECTED!');
      console.error('');
      console.error('⚠️  Commit BLOCKED due to documentation standard violation');
      console.error('');
      console.error('Why this matters:');
      console.error('  Hardcoded counts create maintenance debt');
      console.error('  Counts become stale when components are added/removed');
      console.error('');
      console.error('Fix violations by replacing with:');
      console.error("  ❌ '151 tests' → ✅ 'Comprehensive test coverage'");
      console.error("  ❌ '4 modules' → ✅ 'Multiple foundation modules'");
      console.error("  ❌ '18 skills' → ✅ 'Specialized skills'");
      console.error('');
      process.exit(1);
    }
  } catch (err) {
    console.error(`⚠️  Validation error: ${(err as Error).message} - allowing commit`);
    process.exit(0);
  }
}

main();
