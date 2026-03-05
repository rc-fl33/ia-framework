import { join } from 'path';
import { copyFile, writeFile, readFile, mkdir, copyDir, fileExists, isDirectory } from './utils/file-operations.ts';
import { ComparisonResult, FileChange } from './compare-files.ts';

export interface UpdateSummary {
  applied: number;
  skipped: number;
  errors: number;
  preserved: number;
}

/**
 * Apply approved updates to the local framework directory.
 *
 * Applies in this order:
 * 1. Safe updates (no conflicts)
 * 2. New upstream files
 * 3. Conflicts (only if force=true)
 *
 * Special handling for settings.json: calls merge function to preserve user hooks.
 */
export async function applyUpdates(
  comparison: ComparisonResult,
  stagingDir: string,
  localDir: string,
  options: { force: boolean } = { force: false }
): Promise<UpdateSummary> {
  const summary: UpdateSummary = {
    applied: 0,
    skipped: 0,
    errors: 0,
    preserved: comparison.preserved.length
  };

  console.log('\nApplying updates...\n');

  // Special handling for settings.json
  const settingsIndex = comparison.safeUpdates.findIndex(f => f.path === 'settings.json');
  if (settingsIndex >= 0) {
    try {
      const mergeSuccess = await mergeSettingsJson(
        join(localDir, 'settings.json'),
        join(stagingDir, 'settings.json')
      );

      if (mergeSuccess) {
        console.log(`  [OK] settings.json (merged)`);
        summary.applied++;
        comparison.safeUpdates.splice(settingsIndex, 1);
      } else {
        console.error(`  [ERROR] settings.json (merge failed)`);
        summary.errors++;
      }
    } catch (error) {
      console.error(`  [ERROR] settings.json: ${error}`);
      summary.errors++;
    }
  }

  // Apply safe updates
  for (const item of comparison.safeUpdates) {
    try {
      const src = join(stagingDir, item.path);
      const dst = join(localDir, item.path);

      // Create parent directories
      const parentDir = dst.substring(0, dst.lastIndexOf('/'));
      if (parentDir) {
        await mkdir(parentDir);
      }

      await copyFile(src, dst);

      console.log(`  [OK] ${item.path}`);
      summary.applied++;
    } catch (error) {
      console.error(`  [ERROR] ${item.path}: ${error}`);
      summary.errors++;
    }
  }

  // Apply new upstream files
  for (const item of comparison.newUpstream) {
    try {
      const src = join(stagingDir, item.path);
      const dst = join(localDir, item.path);

      // Create parent directories
      const parentDir = dst.substring(0, dst.lastIndexOf('/'));
      if (parentDir) {
        await mkdir(parentDir);
      }

      await copyFile(src, dst);

      console.log(`  [NEW] ${item.path}`);
      summary.applied++;
    } catch (error) {
      console.error(`  [ERROR] ${item.path}: ${error}`);
      summary.errors++;
    }
  }

  // Handle conflicts
  for (const item of comparison.conflicts) {
    if (options.force) {
      try {
        const src = join(stagingDir, item.path);
        const dst = join(localDir, item.path);

        // Create parent directories
        const parentDir = dst.substring(0, dst.lastIndexOf('/'));
        if (parentDir) {
          await mkdir(parentDir);
        }

        await copyFile(src, dst);

        console.log(`  [FORCE] ${item.path}`);
        summary.applied++;
      } catch (error) {
        console.error(`  [ERROR] ${item.path}: ${error}`);
        summary.errors++;
      }
    } else {
      console.log(`  [SKIP] ${item.path} (conflict - keeping yours)`);
      summary.skipped++;
    }
  }

  return summary;
}

/**
 * Intelligently merge settings.json files.
 * Preserves user hooks and settings while adding new framework options.
 *
 * This delegates to the existing TypeScript merge tool if available.
 * Falls back to simple copy if merge tool not found.
 */
async function mergeSettingsJson(
  localPath: string,
  upstreamPath: string
): Promise<boolean> {
  try {
    // Try to use the existing merge tool
    const mergeToolPath = join(
      // Go up 3 levels (scripts/framework-update.ts) to framework root
      import.meta.dir,
      '../../../tools/framework-update/merge-settings-json.ts'
    );

    const mergeToolExists = await fileExists(mergeToolPath);

    if (mergeToolExists) {
      const proc = Bun.spawn([
        'bun',
        mergeToolPath,
        'apply',
        localPath,
        upstreamPath
      ]);

      const exitCode = await proc.exited;
      return exitCode === 0;
    }
  } catch (error) {
    console.error(`Merge tool error: ${error}`);
  }

  // Fallback: simple settings merge using JSON
  try {
    const upstreamContent = await readFile(upstreamPath);
    const localContent = await readFile(localPath);

    const upstreamJson = JSON.parse(upstreamContent);
    const localJson = JSON.parse(localContent);

    // Merge: new keys from upstream, preserve user settings
    const merged = { ...upstreamJson, ...localJson };

    // Merge hooks specially: combine arrays
    if (upstreamJson.hooks && localJson.hooks) {
      const upstreamHooks = Array.isArray(upstreamJson.hooks)
        ? upstreamJson.hooks
        : [];
      const localHooks = Array.isArray(localJson.hooks) ? localJson.hooks : [];

      // Combine, removing duplicates by name
      const hooksByName = new Map();

      for (const hook of upstreamJson.hooks || []) {
        if (hook.name) {
          hooksByName.set(hook.name, hook);
        }
      }

      for (const hook of localJson.hooks || []) {
        if (hook.name) {
          hooksByName.set(hook.name, hook);
        }
      }

      merged.hooks = Array.from(hooksByName.values());
    }

    await writeFile(localPath, JSON.stringify(merged, null, 2) + '\n');
    return true;
  } catch (error) {
    console.error(`Settings merge failed: ${error}`);
    return false;
  }
}

/**
 * Create backup of framework before updates.
 */
export async function createBackup(
  backupDir: string,
  filesToBackup: string[],
  frameworkDir: string
): Promise<boolean> {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] +
      '_' +
      new Date().toISOString().split('T')[1].split('.')[0].replace(/:/g, '');

    const backupPath = join(backupDir, timestamp);
    await mkdir(backupPath);

    for (const file of filesToBackup) {
      const src = join(frameworkDir, file);
      const dst = join(backupPath, file);

      if (await fileExists(src)) {
        const parentDir = dst.substring(0, dst.lastIndexOf('/'));
        if (parentDir) {
          await mkdir(parentDir);
        }

        if (await isDirectory(src)) {
          await copyDir(src, dst);
        } else {
          await copyFile(src, dst);
        }
      }
    }

    console.log(`Backup created: ${backupPath}`);
    return true;
  } catch (error) {
    console.error(`Backup failed: ${error}`);
    return false;
  }
}
