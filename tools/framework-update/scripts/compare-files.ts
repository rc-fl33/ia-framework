import { join, relative } from 'path';
import { isProtected } from './utils/protected-patterns.ts';
import { detectLocalChanges, getFrameworkVersionInfo, isGitAvailable } from './utils/file-detection.ts';
import {
  walkDir,
  filesEqual,
  getRelativePath,
  isDirectory,
  fileExists,
  isBinaryFile
} from './utils/file-operations.ts';

export interface FileChange {
  path: string;
  reason: string;
  localStatus?: string;
}

export interface ComparisonResult {
  safeUpdates: FileChange[];
  conflicts: FileChange[];
  preserved: FileChange[];
  unchanged: string[];
  newUpstream: FileChange[];
}

/**
 * Compare staging directory with local framework directory.
 * Categorizes files into:
 * - Safe to update (changed upstream, not locally modified)
 * - Conflicts (changed both upstream and locally)
 * - Protected (matches protected patterns)
 * - Unchanged (identical in both)
 * - New upstream (exists in staging but not locally)
 */
export async function compareFiles(
  stagingDir: string,
  localDir: string,
  protectedPatterns?: string[]
): Promise<ComparisonResult> {
  const result: ComparisonResult = {
    safeUpdates: [],
    conflicts: [],
    preserved: [],
    unchanged: [],
    newUpstream: []
  };

  // Get version info to determine baseline for local changes
  const versionInfo = getFrameworkVersionInfo(localDir);
  const frameworkVersionDate = versionInfo?.date || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  // Detect local modifications using file-based detection (no git required)
  const localChanges = await detectLocalChanges(stagingDir, localDir, {
    frameworkVersionDate
  });

  // Walk through staging directory
  try {
    for await (const stagingPath of walkDir(stagingDir)) {
      // Get relative path from staging root
      const relativePath = getRelativePath(stagingDir, stagingPath);

      // Skip .git directory
      if (relativePath.includes('.git/')) {
        continue;
      }

      // Check if protected
      if (isProtected(relativePath, protectedPatterns)) {
        const localPath = join(localDir, relativePath);
        if (await fileExists(localPath)) {
          result.preserved.push({
            path: relativePath,
            reason: 'Protected by policy'
          });
        }
        continue;
      }

      const localPath = join(localDir, relativePath);
      const localExists = await fileExists(localPath);

      // New file in upstream
      if (!localExists) {
        result.newUpstream.push({
          path: relativePath,
          reason: 'New file in upstream'
        });
        continue;
      }

      // Skip if local path is directory
      if (await isDirectory(localPath)) {
        continue;
      }

      // Compare content
      const filesAreSame = await filesEqual(stagingPath, localPath);
      if (filesAreSame) {
        result.unchanged.push(relativePath);
        continue;
      }

      // Files differ - check if locally modified
      if (localChanges.has(relativePath)) {
        const change = localChanges.get(relativePath);
        // File was changed both upstream and locally
        result.conflicts.push({
          path: relativePath,
          reason: `Modified in both upstream and your copy (${change?.reason})`,
          localStatus: change?.type
        });
      } else {
        // Safe update: changed upstream, not modified locally
        result.safeUpdates.push({
          path: relativePath,
          reason: 'Updated upstream, not modified locally'
        });
      }
    }
  } catch (error) {
    console.error(`Error comparing files: ${error}`);
  }

  return result;
}

/**
 * Generate human-readable report of comparison.
 */
export function generateComparisonReport(
  comparison: ComparisonResult,
  localVersion: string,
  upstreamVersion: string
): string {
  const lines: string[] = [];

  lines.push('');
  lines.push('╔════════════════════════════════════════════════════════════════════╗');
  lines.push('║                    IA FRAMEWORK UPDATE AVAILABLE                   ║');
  lines.push(`║                    Upstream: ${upstreamVersion.padEnd(41)} ║`);
  lines.push(`║                    Your version: ${localVersion.padEnd(36)} ║`);
  lines.push('╠════════════════════════════════════════════════════════════════════╣');
  lines.push('║ SUMMARY                                                            ║');
  lines.push(
    `║ • ${comparison.safeUpdates.length} safe updates available                            ║`.slice(0, 70) + ' ║'
  );
  lines.push(
    `║ • ${comparison.newUpstream.length} new features available                             ║`.slice(0, 70) + ' ║'
  );
  lines.push(
    `║ • ${comparison.conflicts.length} conflicts with your customizations                  ║`.slice(0, 70) + ' ║'
  );
  lines.push(
    `║ • ${comparison.preserved.length} protected files (preserved)                          ║`.slice(0, 70) + ' ║'
  );
  lines.push('╚════════════════════════════════════════════════════════════════════╝');

  // Conflicts section
  if (comparison.conflicts.length > 0) {
    lines.push('');
    lines.push('🔴 REQUIRES ATTENTION - Conflicts with your customizations:');
    lines.push('');
    for (const file of comparison.conflicts) {
      lines.push(`   • ${file.path}`);
      lines.push(`     ${file.reason} (local: ${file.localStatus})`);
    }
  }

  // Safe updates
  if (comparison.safeUpdates.length > 0) {
    lines.push('');
    lines.push('🟢 SAFE TO AUTO-UPDATE - No conflicts:');
    lines.push('');
    for (const file of comparison.safeUpdates) {
      lines.push(`   • ${file.path}`);
    }
  }

  // New features
  if (comparison.newUpstream.length > 0) {
    lines.push('');
    lines.push('🆕 NEW FEATURES - Available to add:');
    lines.push('');
    for (const file of comparison.newUpstream) {
      lines.push(`   • ${file.path}`);
    }
  }

  // Preserved
  if (comparison.preserved.length > 0) {
    lines.push('');
    lines.push('📝 YOUR CUSTOMIZATIONS - Protected from overwrites:');
    lines.push('');
    for (const file of comparison.preserved) {
      lines.push(`   • ${file.path}`);
    }
  }

  lines.push('');
  return lines.join('\n');
}

/**
 * Check if there are any changes.
 */
export function hasChanges(comparison: ComparisonResult): boolean {
  return (
    comparison.safeUpdates.length > 0 ||
    comparison.conflicts.length > 0 ||
    comparison.newUpstream.length > 0
  );
}
