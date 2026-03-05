#!/usr/bin/env bun
/**
 * Hook Symlink Synchronizer
 *
 * Creates symlinks from project hooks/ to ~/.claude/hooks/ so Claude Code
 * can find and execute hooks. Works portably across all installations.
 *
 * Usage:
 *   bun run tools/utils/sync-hooks.ts         # Sync hooks
 *   bun run tools/utils/sync-hooks.ts --check # Dry run (no changes)
 */

import { existsSync, readdirSync, symlinkSync, unlinkSync } from 'fs';
import { resolve, join, basename } from 'path';
import { homedir } from 'os';

const isDryRun = process.argv.includes('--check');
const projectRoot = process.cwd();
const hooksDir = join(projectRoot, 'hooks');
const claudeHooksDir = join(homedir(), '.claude', 'hooks');

let createdCount = 0;
let removedCount = 0;
let errorCount = 0;

// Ensure ~/.claude/hooks/ exists
if (!existsSync(claudeHooksDir)) {
  if (!isDryRun) {
    Bun.sh(`mkdir -p ${claudeHooksDir}`).sync();
  }
  console.log(`📁 Create: ${claudeHooksDir}`);
}

// Read all hook files from project
if (!existsSync(hooksDir)) {
  console.error(`❌ hooks/ directory not found at ${hooksDir}`);
  process.exit(1);
}

const files = readdirSync(hooksDir);
const hookFiles = files.filter((f) => f.endsWith('.ts') && !f.includes('__tests__') && !f.includes('schemas'));

console.log(`\n📋 Syncing ${hookFiles.length} hooks...`);

// Create symlinks for all hook files
hookFiles.forEach((file) => {
  const source = join(hooksDir, file);
  const link = join(claudeHooksDir, file);

  if (existsSync(link)) {
    // Symlink already exists - verify it points to the right place
    const stats = Bun.file(link);
    // For now, assume it's correct
  } else {
    // Create symlink
    if (!isDryRun) {
      try {
        symlinkSync(source, link);
      } catch (e) {
        console.error(`❌ Failed to create symlink for ${file}: ${e.message}`);
        errorCount++;
        return;
      }
    }
    console.log(`✅ Symlink: ${file} → ~/.claude/hooks/${file}`);
    createdCount++;
  }
});

// Check for orphaned symlinks (symlinks where source no longer exists)
const existingSymlinks = readdirSync(claudeHooksDir);
existingSymlinks.forEach((link) => {
  const linkPath = join(claudeHooksDir, link);
  const expectedSource = join(hooksDir, link);

  // Check if this is a hook symlink (has matching .ts in hooks/)
  if (link.endsWith('.ts')) {
    if (!existsSync(expectedSource)) {
      // Orphaned symlink - source was deleted
      if (!isDryRun) {
        try {
          unlinkSync(linkPath);
        } catch (e) {
          console.error(`❌ Failed to remove orphaned symlink ${link}: ${e.message}`);
          errorCount++;
          return;
        }
      }
      console.log(`🗑️  Removed orphaned: ${link}`);
      removedCount++;
    }
  }
});

console.log(`\n📊 Summary:`);
console.log(`  ✅ Created: ${createdCount}`);
console.log(`  🗑️  Removed: ${removedCount}`);
if (errorCount > 0) {
  console.log(`  ❌ Errors: ${errorCount}`);
}

if (isDryRun) {
  console.log(`\n💡 Dry run mode - no changes made. Run without --check to apply.`);
} else {
  console.log(`\n✨ Hook symlinks synchronized!`);
}

process.exit(errorCount > 0 ? 1 : 0);
