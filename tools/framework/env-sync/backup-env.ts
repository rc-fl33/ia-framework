#!/usr/bin/env bun
/**
 * Environment File Backup Utility
 *
 * Creates timestamped backups of .env files before modifications.
 * Ensures backups are .gitignored to prevent accidental commits.
 *
 * Usage:
 *   bun tools/framework/env-sync/backup-env.ts /path/to/.env
 */

import { copyFileSync, readFileSync, existsSync, appendFileSync } from 'fs';
import { join, dirname } from 'path';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface BackupResult {
  success: boolean;
  backupPath?: string;
  originalPath?: string;
  size?: number;
  timestamp?: string;
  error?: string;
}

/**
 * Generate timestamped backup filename
 * SECURITY: Backups go to sessions/ directory to prevent accidental git commits
 */
function generateBackupName(envPath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const basename = envPath.split('/').pop() || '.env';

  // Determine framework root (where sessions/ lives)
  const frameworkRoot = process.env.IA_FRAMEWORK_ROOT || process.cwd();

  // Write to sessions/ directory which is gitignored
  const sessionsDir = join(frameworkRoot, 'sessions');

  return join(sessionsDir, `${basename}.backup.${timestamp}`);
}

/**
 * Check if .gitignore has backup pattern
 */
function hasBackupPattern(gitignorePath: string): boolean {
  if (!existsSync(gitignorePath)) {
    return false;
  }

  const content = readFileSync(gitignorePath, 'utf-8');
  return content.includes('.env.backup') || content.includes('.env.*');
}

/**
 * Add backup pattern to .gitignore
 */
function addBackupPatternToGitignore(gitignorePath: string): boolean {
  try {
    const content = readFileSync(gitignorePath, 'utf-8');

    // Check if pattern already exists
    if (content.includes('.env.backup*')) {
      return true;
    }

    // Add pattern
    const newPattern = '\n# Backup files (auto-created before .env edits)\n.env.backup*\n';
    appendFileSync(gitignorePath, newPattern);

    console.log('   ✓ Added .env.backup* pattern to .gitignore');
    return true;
  } catch (error) {
    console.warn(`   ⚠️  Could not update .gitignore: ${error}`);
    return false;
  }
}

/**
 * Create backup of .env file
 */
export async function backupEnvFile(envPath: string): Promise<BackupResult> {
  // Validate input
  if (!envPath) {
    return {
      success: false,
      error: 'No .env path provided'
    };
  }

  // Check if file exists
  if (!existsSync(envPath)) {
    return {
      success: false,
      error: `File not found: ${envPath}`
    };
  }

  try {
    // Generate backup path
    const backupPath = generateBackupName(envPath);

    // Get file info
    const content = readFileSync(envPath, 'utf-8');
    const size = content.length;
    const timestamp = new Date().toISOString();

    // Create backup
    copyFileSync(envPath, backupPath);

    // Ensure .gitignore has backup pattern
    const gitignoreDir = dirname(envPath);
    const gitignorePath = join(gitignoreDir, '.gitignore');

    if (!hasBackupPattern(gitignorePath)) {
      addBackupPatternToGitignore(gitignorePath);
    }

    return {
      success: true,
      backupPath,
      originalPath: envPath,
      size,
      timestamp
    };
  } catch (error) {
    return {
      success: false,
      error: `Backup failed: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Verify backup was created correctly
 */
export async function verifyBackup(
  originalPath: string,
  backupPath: string
): Promise<{ valid: boolean; message: string }> {
  try {
    if (!existsSync(backupPath)) {
      return {
        valid: false,
        message: 'Backup file not found'
      };
    }

    const originalContent = readFileSync(originalPath, 'utf-8');
    const backupContent = readFileSync(backupPath, 'utf-8');

    if (originalContent === backupContent) {
      return {
        valid: true,
        message: 'Backup verified successfully'
      };
    } else {
      return {
        valid: false,
        message: 'Backup content does not match original'
      };
    }
  } catch (error) {
    return {
      valid: false,
      message: `Verification failed: ${error}`
    };
  }
}

/**
 * Restore from backup
 */
export async function restoreFromBackup(backupPath: string, targetPath: string): Promise<BackupResult> {
  try {
    if (!existsSync(backupPath)) {
      return {
        success: false,
        error: `Backup file not found: ${backupPath}`
      };
    }

    copyFileSync(backupPath, targetPath);

    return {
      success: true,
      backupPath,
      originalPath: targetPath,
      message: `Restored from ${backupPath}`
    };
  } catch (error) {
    return {
      success: false,
      error: `Restore failed: ${error}`
    };
  }
}

// CLI execution
if (import.meta.main) {
  const envPath = process.argv[2] || join(FRAMEWORK_ROOT, '.env');

  console.log('\n' + '='.repeat(70));
  console.log('ENVIRONMENT FILE BACKUP UTILITY');
  console.log('='.repeat(70));
  console.log(`\nBacking up: ${envPath}\n`);

  backupEnvFile(envPath).then(async (result) => {
    if (!result.success) {
      console.error(`❌ ${result.error}`);
      process.exit(1);
    }

    console.log(`✅ Backup created successfully`);
    console.log(`   Original: ${result.originalPath}`);
    console.log(`   Backup:   ${result.backupPath}`);
    console.log(`   Size:     ${result.size} bytes`);
    console.log(`   Time:     ${result.timestamp}`);

    // Verify backup
    const verification = await verifyBackup(result.originalPath!, result.backupPath!);
    console.log(`   Status:   ${verification.valid ? '✓ Verified' : '✗ Not verified'}`);

    console.log('\n' + '='.repeat(70) + '\n');
  });
}
