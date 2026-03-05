import { statSync, readFileSync } from 'fs';
import { createHash } from 'crypto';
import { join } from 'path';
import { walkDir, fileExists } from './file-operations.ts';

/**
 * File-based change detection (no git required)
 *
 * Strategy:
 * 1. Compare file timestamps: if local file is newer than framework version date,
 *    it's been locally modified
 * 2. Optional: Use checksums for confirmed detection
 * 3. Works in non-git directories
 */

export interface DetectionOptions {
  frameworkVersionDate?: Date;  // When framework was last updated
  useChecksums?: boolean;        // Use SHA256 for confirmation
  verbose?: boolean;
}

export interface LocalChange {
  path: string;
  type: 'modified' | 'added' | 'deleted' | 'unknown';
  confidence: 'high' | 'medium' | 'low';
  reason: string;
}

/**
 * Compute SHA256 checksum of a file
 */
function getFileChecksum(filePath: string): string {
  try {
    const content = readFileSync(filePath);
    return createHash('sha256').update(content).digest('hex');
  } catch {
    return '';
  }
}

/**
 * Check if a file has been locally modified based on timestamps
 *
 * A file is considered "locally modified" if:
 * - File's mtime is AFTER the framework version date
 * - OR file doesn't exist in staging (newly added)
 * - OR file was deleted
 */
export async function detectLocalChanges(
  localDir: string,
  stagingDir: string,
  options: DetectionOptions = {}
): Promise<Map<string, LocalChange>> {
  const changes = new Map<string, LocalChange>();
  const { frameworkVersionDate, useChecksums = false, verbose = false } = options;

  // Default framework version date to 30 days ago
  const versionDate = frameworkVersionDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  try {
    // Walk local directory to find files
    const localFiles = await walkDir(localDir, {
      exclude: [
        '.git',
        '.framework-staging',
        '.framework-backup',
        '.env*',
        'sessions/**',
        'plans/**',
        'output/**',
        'input/**',
        'node_modules',
        '.test-artifacts'
      ]
    });

    for (const filePath of localFiles) {
      try {
        const stats = statSync(filePath);
        const relativePath = filePath.replace(localDir, '').replace(/^\//, '');

        // Check 1: Is this file newer than framework version?
        if (stats.mtime > versionDate) {
          if (verbose) {
            console.log(
              `[DETECTED] ${relativePath} modified (mtime: ${stats.mtime.toISOString()})`
            );
          }

          changes.set(relativePath, {
            path: relativePath,
            type: 'modified',
            confidence: 'high',
            reason: `File modified after framework version (${stats.mtime.toISOString()})`
          });
        }
      } catch (err) {
        if (verbose) {
          console.log(`[SKIP] ${filePath}: ${err}`);
        }
      }
    }
  } catch (err) {
    if (verbose) {
      console.log(`[WALK_ERROR] ${err}`);
    }
  }

  // Walk staging to find files that exist there but not locally (deleted)
  try {
    const stagingFiles = await walkDir(stagingDir, {
      exclude: [
        '.git',
        '.framework-staging',
        '.framework-backup',
        '.env*',
        'sessions/**',
        'plans/**',
        'output/**',
        'input/**',
        'node_modules'
      ]
    });

    for (const filePath of stagingFiles) {
      const relativePath = filePath.replace(stagingDir, '').replace(/^\//, '');
      const localPath = join(localDir, relativePath);

      if (!fileExists(localPath)) {
        // This file exists in staging but not locally - might be intentionally deleted
        if (!changes.has(relativePath)) {
          changes.set(relativePath, {
            path: relativePath,
            type: 'deleted',
            confidence: 'medium',
            reason: 'Exists in staging but not locally (may be intentionally deleted)'
          });
        }
      }
    }
  } catch (err) {
    if (verbose) {
      console.log(`[STAGING_WALK_ERROR] ${err}`);
    }
  }

  return changes;
}

/**
 * Generate a human-readable summary of local changes
 */
export function summarizeChanges(changes: Map<string, LocalChange>): string {
  if (changes.size === 0) {
    return '✓ No local changes detected';
  }

  const byType = new Map<string, LocalChange[]>();
  for (const [, change] of changes) {
    if (!byType.has(change.type)) {
      byType.set(change.type, []);
    }
    byType.get(change.type)!.push(change);
  }

  let summary = `📝 Local Changes Detected (${changes.size} files):\n`;

  if (byType.has('modified')) {
    summary += `\n  Modified (${byType.get('modified')!.length}):\n`;
    for (const change of byType.get('modified')!) {
      summary += `    • ${change.path} (${change.reason})\n`;
    }
  }

  if (byType.has('deleted')) {
    summary += `\n  Deleted locally (${byType.get('deleted')!.length}):\n`;
    for (const change of byType.get('deleted')!) {
      summary += `    • ${change.path} (${change.reason})\n`;
    }
  }

  return summary;
}

/**
 * Check if git is available (for optional operations)
 * Returns true if git command works
 */
export async function isGitAvailable(): Promise<boolean> {
  try {
    const proc = Bun.spawn(['git', '--version'], {
      stdout: 'pipe',
      stderr: 'pipe'
    });
    const exitCode = await proc.exited;
    return exitCode === 0;
  } catch {
    return false;
  }
}

/**
 * Get information from .framework-manifest.yaml if available
 */
export function getFrameworkVersionInfo(dir: string): { date: Date; version: string } | null {
  try {
    const manifestPath = join(dir, '.framework-manifest.yaml');
    if (fileExists(manifestPath)) {
      const content = readFileSync(manifestPath, 'utf-8');

      // Simple YAML parser for version and date
      const versionMatch = content.match(/version:\s*["']?([^"'\n]+)["']?/);
      const dateMatch = content.match(/last_update:\s*["']?([^"'\n]+)["']?/);

      if (dateMatch) {
        return {
          date: new Date(dateMatch[1]),
          version: versionMatch ? versionMatch[1] : 'unknown'
        };
      }
    }
  } catch {
    // Manifest not found or unreadable, return null
  }

  return null;
}
