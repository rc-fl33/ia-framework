#!/usr/bin/env bun
/**
 * Sync Framework Hooks to ~/.claude/hooks/
 *
 * Creates symlinks for all hook files in hooks/ directory.
 * Run this after creating new hooks or to repair missing symlinks.
 *
 * Usage:
 *   bun run tools/framework/utils/sync-hooks.ts
 *   bun run tools/framework/utils/sync-hooks.ts --check  # Dry run
 */

import { readdirSync, existsSync, lstatSync, symlinkSync, unlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

const FRAMEWORK_ROOT = join(__dirname, '../../..');
const HOOKS_SOURCE = join(FRAMEWORK_ROOT, 'hooks');
const HOOKS_TARGET = join(homedir(), '.claude', 'hooks');

interface SyncResult {
  created: string[];
  skipped: string[];
  errors: string[];
  missing: string[];
}

function syncHooks(dryRun: boolean = false): SyncResult {
  const result: SyncResult = {
    created: [],
    skipped: [],
    errors: [],
    missing: []
  };

  // Ensure target directory exists
  if (!existsSync(HOOKS_TARGET)) {
    if (!dryRun) {
      mkdirSync(HOOKS_TARGET, { recursive: true });
    }
    console.log(`📁 Created directory: ${HOOKS_TARGET}`);
  }

  // Get all .ts files in hooks/ (excluding subdirectories like pre-commit/)
  const hookFiles = readdirSync(HOOKS_SOURCE, { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith('.ts'))
    .map(entry => entry.name);

  console.log(`\n🔍 Found ${hookFiles.length} hook files in ${HOOKS_SOURCE}\n`);

  for (const hookFile of hookFiles) {
    const sourcePath = join(HOOKS_SOURCE, hookFile);
    const targetPath = join(HOOKS_TARGET, hookFile);

    // Check if symlink already exists and is correct
    if (existsSync(targetPath)) {
      const stats = lstatSync(targetPath);
      if (stats.isSymbolicLink()) {
        result.skipped.push(hookFile);
        console.log(`✓ ${hookFile} (already linked)`);
        continue;
      } else {
        // File exists but is not a symlink - this is an error
        result.errors.push(`${hookFile}: Target exists but is not a symlink`);
        console.log(`❌ ${hookFile} (target exists but is not a symlink)`);
        continue;
      }
    }

    // Create symlink
    if (dryRun) {
      result.created.push(hookFile);
      console.log(`📋 Would create: ${hookFile} -> ${sourcePath}`);
    } else {
      try {
        symlinkSync(sourcePath, targetPath);
        result.created.push(hookFile);
        console.log(`✨ Created: ${hookFile}`);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        result.errors.push(`${hookFile}: ${message}`);
        console.log(`❌ Failed: ${hookFile} - ${message}`);
      }
    }
  }

  // Check for orphaned symlinks (hooks that were deleted from source)
  if (existsSync(HOOKS_TARGET)) {
    const targetFiles = readdirSync(HOOKS_TARGET, { withFileTypes: true })
      .filter(entry => entry.isSymbolicLink() && entry.name.endsWith('.ts'))
      .map(entry => entry.name);

    for (const targetFile of targetFiles) {
      if (!hookFiles.includes(targetFile)) {
        const targetPath = join(HOOKS_TARGET, targetFile);
        result.missing.push(targetFile);

        if (dryRun) {
          console.log(`⚠️  Would remove orphaned symlink: ${targetFile}`);
        } else {
          try {
            unlinkSync(targetPath);
            console.log(`🗑️  Removed orphaned symlink: ${targetFile}`);
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            console.log(`❌ Failed to remove ${targetFile}: ${message}`);
          }
        }
      }
    }
  }

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--check') || args.includes('--dry-run');

  console.log('🔗 Framework Hook Sync Utility');
  console.log('━'.repeat(50));

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No changes will be made\n');
  }

  const result = syncHooks(dryRun);

  console.log('\n━'.repeat(50));
  console.log('📊 Summary:');
  console.log(`   Created: ${result.created.length}`);
  console.log(`   Skipped: ${result.skipped.length} (already linked)`);
  console.log(`   Removed: ${result.missing.length} (orphaned symlinks)`);
  console.log(`   Errors:  ${result.errors.length}`);

  if (result.errors.length > 0) {
    console.log('\n❌ Errors:');
    result.errors.forEach(error => console.log(`   - ${error}`));
    process.exit(1);
  }

  if (dryRun && result.created.length > 0) {
    console.log('\n💡 Run without --check flag to create symlinks');
  }

  if (!dryRun && result.created.length > 0) {
    console.log('\n✅ Hook symlinks synchronized successfully');
  } else if (result.created.length === 0 && result.missing.length === 0) {
    console.log('\n✅ All hooks already synchronized');
  }

  process.exit(0);
}

main();
