#!/usr/bin/env bun

/**
 * Automated Cleanup Script
 *
 * Removes backup files, stray cache directories, and temporary editor files.
 * Provides report of what was cleaned. Called by pre-commit hook (warning, non-blocking).
 *
 * Usage: bun tools/framework/cleanup/auto-cleanup.ts [--dry-run] [--verbose]
 */

import fs from 'fs';
import path from 'path';
import { Glob } from 'bun';

interface CleanupConfig {
  dryRun: boolean;
  verbose: boolean;
}

interface CleanupStats {
  filesRemoved: string[];
  directoriesRemoved: string[];
  failed: string[];
  skipped: string[];
}

// Patterns to clean (relative to repo root)
const CLEANUP_PATTERNS = [
  // Backup files
  '**/*.backup',
  '**/*.backup-*',
  '**/*~',
  '**/*.bak',
  '**/*.tmp',

  // OS files
  '**/.DS_Store',
  '**/Thumbs.db',

  // Editor temporaries
  '**/*.swp',
  '**/*.swo',

  // Stray cache directories
  '**/.__pycache__',
  '**/.eslintcache',
];

// Directories that should be cleaned if empty after file removal
const CLEANUP_DIRS = [
  '**/.cache',
  '**/cache',
  '**/tmp',
  '**/.tmp',
];

// Files that should NOT be removed even if they match patterns
const PROTECT_LIST = [
  '.env.backup',      // May be intentionally tracked as template
  '.gitkeep',         // Framework-required empty marker
];

function parseArguments(): CleanupConfig {
  return {
    dryRun: process.argv.includes('--dry-run'),
    verbose: process.argv.includes('--verbose'),
  };
}

async function findMatchingFiles(pattern: string): Promise<string[]> {
  try {
    const glob = new Glob(pattern);
    const files: string[] = [];

    for await (const file of glob.scan({
      cwd: process.cwd(),
      onlyFiles: true
    })) {
      // Skip .git directory
      if (!file.startsWith('.git/')) {
        files.push(`./${file}`);
      }
    }

    return files;
  } catch {
    return [];
  }
}

async function findMatchingDirectories(pattern: string): Promise<string[]> {
  try {
    const glob = new Glob(pattern);
    const dirs: string[] = [];

    for await (const dir of glob.scan({
      cwd: process.cwd(),
      onlyDirectories: true
    })) {
      // Skip .git directory and root
      if (!dir.startsWith('.git/') && dir !== '.') {
        dirs.push(`./${dir}`);
      }
    }

    return dirs;
  } catch {
    return [];
  }
}

function isProtected(filePath: string): boolean {
  return PROTECT_LIST.some(pattern => filePath.includes(pattern));
}

async function cleanupFiles(config: CleanupConfig): Promise<CleanupStats> {
  const stats: CleanupStats = {
    filesRemoved: [],
    directoriesRemoved: [],
    failed: [],
    skipped: [],
  };

  // Clean backup and temporary files
  for (const pattern of CLEANUP_PATTERNS) {
    const files = await findMatchingFiles(pattern);

    for (const file of files) {
      if (file.startsWith('./')) {
        const cleanPath = file.slice(2);

        if (isProtected(cleanPath)) {
          stats.skipped.push(cleanPath);
          if (config.verbose) {
            console.log(`  ⊘ ${cleanPath} (protected)`);
          }
          continue;
        }

        if (config.dryRun) {
          stats.filesRemoved.push(cleanPath);
          console.log(`  → [DRY RUN] Would remove: ${cleanPath}`);
        } else {
          try {
            fs.unlinkSync(cleanPath);
            stats.filesRemoved.push(cleanPath);
            if (config.verbose) {
              console.log(`  ✓ Removed: ${cleanPath}`);
            }
          } catch (error) {
            stats.failed.push(cleanPath);
            if (config.verbose) {
              console.error(`  ✗ Failed to remove: ${cleanPath}`);
            }
          }
        }
      }
    }
  }

  // Clean empty cache directories
  for (const pattern of CLEANUP_DIRS) {
    const dirs = await findMatchingDirectories(pattern);

    for (const dir of dirs) {
      if (dir.startsWith('./')) {
        const cleanPath = dir.slice(2);

        if (isProtected(cleanPath)) {
          stats.skipped.push(cleanPath);
          if (config.verbose) {
            console.log(`  ⊘ ${cleanPath}/ (protected)`);
          }
          continue;
        }

        // Only remove if empty
        try {
          if (fs.existsSync(cleanPath)) {
            const contents = fs.readdirSync(cleanPath);
            if (contents.length === 0) {
              if (config.dryRun) {
                stats.directoriesRemoved.push(cleanPath);
                console.log(`  → [DRY RUN] Would remove: ${cleanPath}/`);
              } else {
                fs.rmdirSync(cleanPath);
                stats.directoriesRemoved.push(cleanPath);
                if (config.verbose) {
                  console.log(`  ✓ Removed: ${cleanPath}/`);
                }
              }
            }
          }
        } catch (error) {
          stats.failed.push(cleanPath);
          if (config.verbose) {
            console.error(`  ✗ Failed to remove: ${cleanPath}/`);
          }
        }
      }
    }
  }

  return stats;
}

async function main(): Promise<void> {
  const config = parseArguments();

  console.log('🧹 Auto-cleanup started...\n');

  if (config.dryRun) {
    console.log('[DRY RUN MODE] No files will be deleted\n');
  }

  const stats = await cleanupFiles(config);

  // Report results
  console.log('\n📊 Cleanup Report:');
  console.log(`  Files removed: ${stats.filesRemoved.length}`);
  console.log(`  Directories removed: ${stats.directoriesRemoved.length}`);
  console.log(`  Failed: ${stats.failed.length}`);
  console.log(`  Protected/Skipped: ${stats.skipped.length}`);

  if (stats.filesRemoved.length > 0 && config.verbose) {
    console.log('\n  Removed files:');
    stats.filesRemoved.forEach(f => console.log(`    - ${f}`));
  }

  if (stats.directoriesRemoved.length > 0 && config.verbose) {
    console.log('\n  Removed directories:');
    stats.directoriesRemoved.forEach(d => console.log(`    - ${d}/`));
  }

  if (stats.failed.length > 0) {
    console.error('\n  Failed to remove:');
    stats.failed.forEach(f => console.error(`    - ${f}`));
  }

  if (stats.skipped.length > 0 && config.verbose) {
    console.log('\n  Protected/skipped:');
    stats.skipped.forEach(s => console.log(`    - ${s}`));
  }

  const totalCleaned = stats.filesRemoved.length + stats.directoriesRemoved.length;
  if (totalCleaned > 0) {
    console.log(`\n✅ Cleaned ${totalCleaned} item(s)`);
  } else if (stats.failed.length === 0) {
    console.log('\n✨ No cleanup needed');
  }

  process.exit(stats.failed.length > 0 ? 1 : 0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
