#!/usr/bin/env bun
/**
 * CLAUDE.md Backup Manager
 *
 * Creates timestamped backups of CLAUDE.md before merge operations.
 * Stores backup metadata for rollback tracking.
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/backup-claude-md.ts [path/to/CLAUDE.md]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const BACKUP_DIR = join(FRAMEWORK_ROOT, '.framework-backup', 'CLAUDE.md-backups');

interface BackupMetadata {
  timestamp: string;
  iso_timestamp: string;
  filename: string;
  original_path: string;
  file_size: number;
  git_commit?: string;
  description?: string;
}

/**
 * Get current git commit if in a git repo
 */
function getCurrentGitCommit(): string | undefined {
  try {
    const { execSync } = require('child_process');
    const commit = execSync('git rev-parse --short HEAD', {
      cwd: FRAMEWORK_ROOT,
      encoding: 'utf-8',
      timeout: 5000
    }).trim();
    return commit;
  } catch {
    return undefined;
  }
}

/**
 * Create a backup file
 */
export function createBackup(filePath: string, description?: string): { backupFile: string; metadata: BackupMetadata } {
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  // Create backup directory
  mkdirSync(BACKUP_DIR, { recursive: true });

  // Generate timestamp and filename
  const now = new Date();
  const isoTimestamp = now.toISOString();
  const timestamp = isoTimestamp.replace(/[:.]/g, '-').slice(0, -5); // Format: 2026-02-04T16-30-00
  const backupFile = join(BACKUP_DIR, `CLAUDE.md.${timestamp}.bak`);

  // Read and backup file
  const content = readFileSync(filePath, 'utf-8');
  writeFileSync(backupFile, content, 'utf-8');

  const stats = statSync(backupFile);

  // Create metadata file
  const metadata: BackupMetadata = {
    timestamp,
    iso_timestamp: isoTimestamp,
    filename: `CLAUDE.md.${timestamp}.bak`,
    original_path: filePath,
    file_size: stats.size,
    git_commit: getCurrentGitCommit(),
    description
  };

  const metadataFile = join(BACKUP_DIR, `CLAUDE.md.${timestamp}.meta.json`);
  writeFileSync(metadataFile, JSON.stringify(metadata, null, 2), 'utf-8');

  return { backupFile, metadata };
}

/**
 * List available backups
 */
export function listBackups(): BackupMetadata[] {
  if (!existsSync(BACKUP_DIR)) {
    return [];
  }

  const backups: BackupMetadata[] = [];

  try {
    const files = readdirSync(BACKUP_DIR);

    for (const file of files) {
      if (file.endsWith('.meta.json')) {
        const metaPath = join(BACKUP_DIR, file);
        const content = readFileSync(metaPath, 'utf-8');
        const metadata = JSON.parse(content) as BackupMetadata;
        backups.push(metadata);
      }
    }
  } catch (error) {
    console.error('Error reading backups:', error);
  }

  // Sort by timestamp descending
  return backups.sort((a, b) => new Date(b.iso_timestamp).getTime() - new Date(a.iso_timestamp).getTime());
}

/**
 * Get backup by index (0 = most recent)
 */
export function getBackupByIndex(index: number): BackupMetadata | null {
  const backups = listBackups();
  return index >= 0 && index < backups.length ? backups[index] : null;
}

/**
 * Get backup file path
 */
export function getBackupFilePath(timestamp: string): string {
  return join(BACKUP_DIR, `CLAUDE.md.${timestamp}.bak`);
}

/**
 * Main execution (standalone mode)
 */
async function main() {
  const args = process.argv.slice(2);
  const filePath = args[0] || join(FRAMEWORK_ROOT, 'CLAUDE.md');

  try {
    const result = createBackup(filePath, args[1]);

    console.log('\n✅ Backup created successfully\n');
    console.log(`📁 Backup file: ${result.backupFile}`);
    console.log(`📊 File size: ${(result.metadata.file_size / 1024).toFixed(2)} KB`);
    console.log(`⏰ Timestamp: ${result.metadata.iso_timestamp}`);
    if (result.metadata.git_commit) {
      console.log(`🔗 Git commit: ${result.metadata.git_commit}`);
    }

    console.log('\n📋 Available backups:\n');

    const backups = listBackups();
    if (backups.length === 0) {
      console.log('  No backups found');
    } else {
      backups.forEach((backup, index) => {
        const size = (backup.file_size / 1024).toFixed(1);
        const date = new Date(backup.iso_timestamp).toLocaleString();
        console.log(`  [${index}] ${date} (${size} KB)`);
        if (backup.description) {
          console.log(`      ${backup.description}`);
        }
      });
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
