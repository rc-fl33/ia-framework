#!/usr/bin/env bun
/**
 * CLAUDE.md Rollback Tool
 *
 * Restore CLAUDE.md from a previous backup.
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/rollback.ts 0              # Restore most recent
 *   bun tools/framework/claude-md-sync/rollback.ts 1              # Restore second most recent
 *   bun tools/framework/claude-md-sync/rollback.ts list           # List backups
 *   bun tools/framework/claude-md-sync/rollback.ts preview 0      # Preview before restoring
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { listBackups, getBackupByIndex, getBackupFilePath, createBackup } from './backup-claude-md.ts';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const CLAUDE_MD_PATH = join(FRAMEWORK_ROOT, 'CLAUDE.md');

/**
 * Print backup list with details
 */
function listBackupsCommand() {
  console.log('\n📋 Available CLAUDE.md Backups:\n');

  const backups = listBackups();

  if (backups.length === 0) {
    console.log('  ✅ No backups found (file is pristine)\n');
    return;
  }

  backups.forEach((backup, index) => {
    const size = (backup.file_size / 1024).toFixed(1);
    const date = new Date(backup.iso_timestamp).toLocaleString();
    const commit = backup.git_commit ? ` [${backup.git_commit}]` : '';

    console.log(`  [${index}] ${date} (${size} KB)${commit}`);
    if (backup.description) {
      console.log(`       ${backup.description}`);
    }
  });

  console.log('\nTo restore: bun tools/framework/claude-md-sync/rollback.ts <index>');
  console.log('Example: bun tools/framework/claude-md-sync/rollback.ts 0\n');
}

/**
 * Preview backup content
 */
function previewBackup(index: number) {
  const backup = getBackupByIndex(index);

  if (!backup) {
    console.error(`❌ Backup #${index} not found`);
    process.exit(1);
  }

  const backupPath = getBackupFilePath(backup.timestamp);

  if (!existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupPath}`);
    process.exit(1);
  }

  const content = readFileSync(backupPath, 'utf-8');
  const lines = content.split('\n');
  const date = new Date(backup.iso_timestamp).toLocaleString();

  console.log(`\n📄 Preview of Backup #${index}`);
  console.log(`   Date: ${date}`);
  console.log(`   Size: ${(backup.file_size / 1024).toFixed(1)} KB`);
  console.log(`   File: ${backupPath}\n`);
  console.log('   First 30 lines:');
  console.log('   ' + '-'.repeat(70));

  lines.slice(0, 30).forEach((line, i) => {
    console.log(`   ${String(i + 1).padStart(3)}: ${line.substring(0, 67)}`);
  });

  if (lines.length > 30) {
    console.log(`   ... and ${lines.length - 30} more lines`);
  }

  console.log('   ' + '-'.repeat(70));
  console.log('\nTo restore this backup: bun tools/framework/claude-md-sync/rollback.ts ' + index + '\n');
}

/**
 * Perform rollback
 */
function performRollback(index: number) {
  const backup = getBackupByIndex(index);

  if (!backup) {
    console.error(`❌ Backup #${index} not found`);
    process.exit(1);
  }

  const backupPath = getBackupFilePath(backup.timestamp);

  if (!existsSync(backupPath)) {
    console.error(`❌ Backup file not found: ${backupPath}`);
    process.exit(1);
  }

  if (!existsSync(CLAUDE_MD_PATH)) {
    console.error(`❌ Current CLAUDE.md not found: ${CLAUDE_MD_PATH}`);
    process.exit(1);
  }

  // Create current backup before restoring
  console.log('\n🔄 Creating pre-rollback backup...');
  const preRollbackBackup = createBackup(CLAUDE_MD_PATH, `Pre-rollback from backup #${index}`);
  console.log(`   Saved as backup #0`);

  // Restore from backup
  console.log('\n♻️  Restoring from backup...');
  const backupContent = readFileSync(backupPath, 'utf-8');
  writeFileSync(CLAUDE_MD_PATH, backupContent, 'utf-8');

  const date = new Date(backup.iso_timestamp).toLocaleString();
  console.log(`   ✅ Restored from ${date}`);

  // Try to stage in git
  try {
    execSync('git add CLAUDE.md', { cwd: FRAMEWORK_ROOT, timeout: 5000 });
    console.log('   ✅ Staged in git');
  } catch {
    // Not in git repo or git add failed
  }

  console.log('\n✅ Rollback complete!\n');
  console.log('Next steps:');
  console.log('  1. Review CLAUDE.md changes');
  console.log('  2. Commit if satisfied: git commit -m "rollback: restore CLAUDE.md"');
  console.log('  3. Or undo: git restore CLAUDE.md\n');
}

/**
 * Show help
 */
function showHelp() {
  console.log(`
🔄 CLAUDE.md Rollback Tool

Usage:
  bun tools/framework/claude-md-sync/rollback.ts <command> [index]

Commands:
  list                 List all available backups
  preview <index>      Preview backup before restoring
  <index>              Restore from backup (0 = most recent)

Examples:
  bun tools/framework/claude-md-sync/rollback.ts list        # See all backups
  bun tools/framework/claude-md-sync/rollback.ts preview 0   # Preview most recent backup
  bun tools/framework/claude-md-sync/rollback.ts 0           # Restore most recent backup
  bun tools/framework/claude-md-sync/rollback.ts 2           # Restore third most recent backup

Backups are stored in: .framework-backup/CLAUDE.md-backups/
  `);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    process.exit(0);
  }

  const command = args[0];

  try {
    if (command === 'list') {
      listBackupsCommand();
    } else if (command === 'preview') {
      const index = parseInt(args[1] || '0', 10);
      if (isNaN(index)) {
        console.error('❌ Invalid index');
        process.exit(1);
      }
      previewBackup(index);
    } else {
      // Assume it's a number - perform rollback
      const index = parseInt(command, 10);
      if (isNaN(index)) {
        console.error(`❌ Unknown command: ${command}\n`);
        showHelp();
        process.exit(1);
      }
      performRollback(index);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
