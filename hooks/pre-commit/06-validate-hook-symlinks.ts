#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Validate Hook Symlinks
 *
 * Ensures all .ts hook files in hooks/ have corresponding symlinks
 * in ~/.claude/hooks/. Prevents "Module not found" errors.
 *
 * Exit codes:
 *   0 = All hooks have symlinks
 *   1 = Missing symlinks detected (blocks commit)
 */

import { readdirSync, existsSync, lstatSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

// Find framework root (where .git directory exists)
function findFrameworkRoot(): string {
  // Try environment variable first (set by git hooks)
  if (process.env.IA_FRAMEWORK_ROOT) {
    return process.env.IA_FRAMEWORK_ROOT;
  }

  // Try cwd (works when running from framework root)
  let current = process.cwd();
  while (current !== '/') {
    if (existsSync(join(current, '.git'))) {
      return current;
    }
    current = dirname(current);
  }

  // Fallback: assume script is in hooks/pre-commit/
  return join(import.meta.dir, '../..');
}

const FRAMEWORK_ROOT = findFrameworkRoot();
const HOOKS_SOURCE = join(FRAMEWORK_ROOT, 'hooks');
const HOOKS_TARGET = join(homedir(), '.claude', 'hooks');

function validateHookSymlinks(): { valid: boolean; missing: string[]; orphaned: string[] } {
  const missing: string[] = [];
  const orphaned: string[] = [];

  // Get all .ts files in hooks/ (excluding subdirectories)
  if (!existsSync(HOOKS_SOURCE)) {
    return { valid: true, missing, orphaned };
  }

  const hookFiles = readdirSync(HOOKS_SOURCE, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.ts'))
    .map(entry => entry.name);

  // Check each hook has a symlink
  for (const hookFile of hookFiles) {
    const targetPath = join(HOOKS_TARGET, hookFile);

    if (!existsSync(targetPath)) {
      missing.push(hookFile);
    } else {
      const stats = lstatSync(targetPath);
      if (!stats.isSymbolicLink()) {
        missing.push(`${hookFile} (exists but not a symlink)`);
      }
    }
  }

  // Check for orphaned symlinks
  if (existsSync(HOOKS_TARGET)) {
    const allTargetFiles = readdirSync(HOOKS_TARGET)
      .filter(name => name.endsWith('.ts'));

    const targetFiles = allTargetFiles.filter(name => {
      const path = join(HOOKS_TARGET, name);
      return existsSync(path) && lstatSync(path).isSymbolicLink();
    });

    for (const targetFile of targetFiles) {
      if (!hookFiles.includes(targetFile)) {
        orphaned.push(targetFile);
      }
    }
  }

  const valid = missing.length === 0 && orphaned.length === 0;
  return { valid, missing, orphaned };
}

function main() {
  const result = validateHookSymlinks();

  if (result.valid) {
    // Silent success
    process.exit(0);
  }

  // Report issues
  console.error('❌ Hook Symlink Validation Failed\n');

  if (result.missing.length > 0) {
    console.error('Missing symlinks in ~/.claude/hooks/:');
    result.missing.forEach(hook => console.error(`  - ${hook}`));
    console.error('');
  }

  if (result.orphaned.length > 0) {
    console.error('Orphaned symlinks (source deleted):');
    result.orphaned.forEach(hook => console.error(`  - ${hook}`));
    console.error('');
  }

  console.error('Fix this by running:');
  console.error('  bun run tools/framework/utils/sync-hooks.ts\n');

  process.exit(1);
}

main();
