#!/usr/bin/env bun
/**
 * List CLAUDE.md Backups
 *
 * Display all available CLAUDE.md backups with timestamps and metadata.
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/list-backups.ts
 */

import { listBackups } from './backup-claude-md.ts';

/**
 * Format file size for display
 */
function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Main execution
 */
async function main() {
  const backups = listBackups();

  if (backups.length === 0) {
    console.log('\n✅ No CLAUDE.md backups found\n');
    return;
  }

  console.log('\n📋 CLAUDE.md Backups\n');
  console.log('┌─────┬──────────────────────────────────┬──────────┬──────────┐');
  console.log('│ Idx │ Timestamp                        │   Size   │ Commit   │');
  console.log('├─────┼──────────────────────────────────┼──────────┼──────────┤');

  backups.forEach((backup, index) => {
    const date = new Date(backup.iso_timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });

    const size = formatSize(backup.file_size);
    const commit = backup.git_commit ? backup.git_commit.substring(0, 7) : '-';

    // Pad values for alignment
    const idxStr = String(index).padStart(3);
    const dateStr = date.padEnd(32);
    const sizeStr = size.padStart(8);
    const commitStr = commit.padEnd(8);

    console.log(`│ ${idxStr} │ ${dateStr} │ ${sizeStr} │ ${commitStr} │`);

    if (backup.description) {
      const desc = backup.description.substring(0, 62).padEnd(62);
      console.log(`│     │ Description: ${desc} │          │          │`);
    }
  });

  console.log('└─────┴──────────────────────────────────┴──────────┴──────────┘');

  console.log('\nCommands:');
  console.log('  Preview:  bun tools/framework/claude-md-sync/rollback.ts preview <idx>');
  console.log('  Restore:  bun tools/framework/claude-md-sync/rollback.ts <idx>');
  console.log('  Diff:     bun tools/framework/claude-md-sync/diff-claude-md.ts <idx>\n');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
