#!/usr/bin/env bun
/**
 * Pre-Sync Cleanup Script
 *
 * Cleans regenerable session data and stale files before git operations.
 * This prevents committing temporary/debug data to the repository.
 */

import { existsSync, readdirSync, statSync, rmSync } from 'fs';
import { join } from 'path';

interface CleanupResult {
  success: boolean;
  cleaned: string[];
  errors: string[];
}

// Directories that contain regenerable data (safe to delete)
const REGENERABLE_DIRS = [
  'debug',
  'file-history',
  'shell-snapshots',
  'statsig',
  'telemetry',
  '.cache'
];

// Files that are temporary/regenerable
const REGENERABLE_FILES = [
  'stats-cache.json'
];

// Session directories older than this many days will be cleaned
const SESSION_ENV_MAX_AGE_DAYS = 7;

/**
 * Clean regenerable directories
 */
function cleanRegenerableDirs(rootPath: string): string[] {
  const cleaned: string[] = [];

  for (const dir of REGENERABLE_DIRS) {
    const dirPath = join(rootPath, dir);
    if (existsSync(dirPath)) {
      try {
        rmSync(dirPath, { recursive: true, force: true });
        cleaned.push(dir);
      } catch (error) {
        // Silently continue - these are just cleanup
      }
    }
  }

  return cleaned;
}

/**
 * Clean regenerable files
 */
function cleanRegenerableFiles(rootPath: string): string[] {
  const cleaned: string[] = [];

  for (const file of REGENERABLE_FILES) {
    const filePath = join(rootPath, file);
    if (existsSync(filePath)) {
      try {
        rmSync(filePath);
        cleaned.push(file);
      } catch (error) {
        // Silently continue
      }
    }
  }

  return cleaned;
}

/**
 * Clean old session-env directories (older than 7 days)
 */
function cleanOldSessionEnv(rootPath: string): string[] {
  const cleaned: string[] = [];
  const sessionEnvPath = join(rootPath, 'session-env');

  if (!existsSync(sessionEnvPath)) {
    return cleaned;
  }

  const cutoffMs = Date.now() - (SESSION_ENV_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  try {
    const entries = readdirSync(sessionEnvPath);

    for (const entry of entries) {
      const entryPath = join(sessionEnvPath, entry);
      try {
        const stats = statSync(entryPath);
        if (stats.isDirectory() && stats.mtimeMs < cutoffMs) {
          rmSync(entryPath, { recursive: true, force: true });
          cleaned.push(`session-env/${entry}`);
        }
      } catch (error) {
        // Silently continue
      }
    }
  } catch (error) {
    // Silently continue
  }

  return cleaned;
}

/**
 * Run pre-sync cleanup
 */
export async function runCleanup(rootPath: string): Promise<CleanupResult> {
  console.log('\n🧹 Running pre-sync cleanup...\n');

  const cleaned: string[] = [];
  const errors: string[] = [];

  try {
    // Clean regenerable directories
    const cleanedDirs = cleanRegenerableDirs(rootPath);
    cleaned.push(...cleanedDirs);

    // Clean regenerable files
    const cleanedFiles = cleanRegenerableFiles(rootPath);
    cleaned.push(...cleanedFiles);

    // Clean old session-env
    const cleanedSessionEnv = cleanOldSessionEnv(rootPath);
    cleaned.push(...cleanedSessionEnv);

    if (cleaned.length > 0) {
      console.log('   Cleaned:');
      for (const item of cleaned) {
        console.log(`     - ${item}`);
      }
    } else {
      console.log('   Nothing to clean');
    }

    console.log('\n✅ Pre-sync cleanup complete\n');

    return {
      success: true,
      cleaned,
      errors
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    errors.push(errorMsg);

    return {
      success: false,
      cleaned,
      errors
    };
  }
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  runCleanup(rootPath).then(result => {
    if (!result.success) {
      console.error('Cleanup errors:', result.errors);
      process.exit(1);
    }
  });
}
