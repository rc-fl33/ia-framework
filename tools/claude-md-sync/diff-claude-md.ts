#!/usr/bin/env bun
/**
 * CLAUDE.md Visual Diff
 *
 * Compare current CLAUDE.md with a backup and show differences.
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/diff-claude-md.ts 0      # Diff with most recent backup
 *   bun tools/framework/claude-md-sync/diff-claude-md.ts 1      # Diff with second most recent backup
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { listBackups, getBackupByIndex, getBackupFilePath } from './backup-claude-md.ts';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const CLAUDE_MD_PATH = join(FRAMEWORK_ROOT, 'CLAUDE.md');

/**
 * Simple diff algorithm - find changed lines
 */
function simpleDiff(original: string[], current: string[]): Array<{ type: 'add' | 'remove' | 'context'; lineNum: number; text: string }> {
  const diff: Array<{ type: 'add' | 'remove' | 'context'; lineNum: number; text: string }> = [];

  // Simple line-by-line comparison
  const maxLen = Math.max(original.length, current.length);

  for (let i = 0; i < maxLen; i++) {
    const origLine = i < original.length ? original[i] : null;
    const currLine = i < current.length ? current[i] : null;

    if (origLine === currLine) {
      // Line unchanged - show as context (every 5th line to keep output manageable)
      if (i % 5 === 0) {
        diff.push({ type: 'context', lineNum: i + 1, text: currLine || '' });
      }
    } else {
      if (origLine !== null) {
        diff.push({ type: 'remove', lineNum: i + 1, text: origLine });
      }
      if (currLine !== null) {
        diff.push({ type: 'add', lineNum: i + 1, text: currLine });
      }
    }
  }

  return diff;
}

/**
 * Print colored diff
 */
function printDiff(original: string[], current: string[]) {
  const diff = simpleDiff(original, current);

  let removed = 0;
  let added = 0;
  let unchanged = original.length;

  for (const item of diff) {
    if (item.type === 'remove') {
      removed++;
      console.log(`- ${item.text}`);
    } else if (item.type === 'add') {
      added++;
      console.log(`+ ${item.text}`);
    } else {
      console.log(`  ${item.text.substring(0, 70)}${item.text.length > 70 ? '...' : ''}`);
    }
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Lines removed: ${removed}`);
  console.log(`  Lines added: ${added}`);
  console.log(`  Net change: ${added - removed} lines`);
}

/**
 * Show statistics about changes
 */
function showStats(original: string[], current: string[], backupDate: string) {
  console.log('\n' + '='.repeat(70));
  console.log('CLAUDE.MD DIFF');
  console.log('='.repeat(70));

  console.log(`\n📅 Comparing with backup from: ${backupDate}`);
  console.log(`   Current file: ${CLAUDE_MD_PATH}`);

  const removed = original.filter((_, i) => i >= current.length || original[i] !== current[i]).length;
  const added = current.filter((_, i) => i >= original.length || current[i] !== original[i]).length;

  console.log(`\n📊 Changes:`);
  console.log(`   Original: ${original.length} lines`);
  console.log(`   Current:  ${current.length} lines`);
  console.log(`   Changed:  ~${Math.max(removed, added)} lines`);

  console.log(`\n🔍 Detailed diff:\n`);
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help' || args[0] === '-h') {
    console.log(`
🔍 CLAUDE.md Visual Diff Tool

Usage:
  bun tools/framework/claude-md-sync/diff-claude-md.ts <index>

Arguments:
  <index>     Backup index to compare with (0 = most recent)

Examples:
  bun tools/framework/claude-md-sync/diff-claude-md.ts 0        # Diff with most recent backup
  bun tools/framework/claude-md-sync/diff-claude-md.ts 1        # Diff with second most recent backup

To see available backups:
  bun tools/framework/claude-md-sync/list-backups.ts
    `);
    process.exit(0);
  }

  try {
    const index = parseInt(args[0], 10);

    if (isNaN(index)) {
      console.error('❌ Invalid index');
      process.exit(1);
    }

    if (!existsSync(CLAUDE_MD_PATH)) {
      console.error(`❌ Current CLAUDE.md not found: ${CLAUDE_MD_PATH}`);
      process.exit(1);
    }

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

    // Read files
    const originalContent = readFileSync(backupPath, 'utf-8');
    const currentContent = readFileSync(CLAUDE_MD_PATH, 'utf-8');

    const original = originalContent.split('\n');
    const current = currentContent.split('\n');

    // Show statistics
    const backupDate = new Date(backup.iso_timestamp).toLocaleString();
    showStats(original, current, backupDate);

    // Show diff
    printDiff(original, current);

    console.log('\n' + '='.repeat(70) + '\n');
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
