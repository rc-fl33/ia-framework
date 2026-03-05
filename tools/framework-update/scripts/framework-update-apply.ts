#!/usr/bin/env bun

/**
 * APPLY MODE: Actually apply framework updates
 *
 * This script:
 * 1. Fetches upstream (fresh copy)
 * 2. Compares with your local files
 * 3. Shows the report again (so you confirm what you're applying)
 * 4. Asks: "Proceed? (yes/no)"
 * 5. If yes: Creates backup → Applies changes → Validates
 * 6. If no: Exits (no changes made)
 */

import { join, resolve } from 'path';
import { remove, fileExists, mkdir, readFile, writeFile } from './utils/file-operations.ts';
import { getFrameworkVersionInfo } from './utils/file-detection.ts';
import { fetchUpstreamRepo } from './fetch-upstream.ts';
import { compareFiles, generateComparisonReport, hasChanges } from './compare-files.ts';
import { applyUpdates, createBackup } from './apply-updates.ts';

const UPSTREAM_REPO = 'https://github.com/notchrisgroves/ia-framework.git';

function getFrameworkDir(): string {
  return process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
}

async function getUserConfirmation(prompt: string): Promise<boolean> {
  if (!process.stdin.isTTY && !process.env.FORCE_APPLY) {
    // Non-interactive mode: abort (unless FORCE_APPLY is set)
    console.log('Non-interactive mode: aborting');
    console.log('Set FORCE_APPLY=1 to run in automated environments');
    return false;
  }

  if (process.env.FORCE_APPLY) {
    console.log('FORCE_APPLY=1 detected - proceeding without confirmation');
    return true;
  }

  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    rl.question(prompt, answer => {
      rl.close();
      resolve(['yes', 'y'].includes(answer.toLowerCase()));
    });
  });
}

async function main() {
  const frameworkDir = getFrameworkDir();
  const stagingDir = join(frameworkDir, '.framework-staging');
  const backupDir = join(frameworkDir, '.framework-backup');

  try {
    console.log('\n⚙️  Preparing to apply framework updates...\n');

    // =======================================================================
    // STEP 1: Fetch upstream (fresh)
    // =======================================================================

    console.log('Step 1: Fetching latest framework...');

    const fetchResult = await fetchUpstreamRepo(frameworkDir, UPSTREAM_REPO);

    if (!fetchResult.success) {
      console.error(`\n❌ Error: ${fetchResult.error}\n`);
      process.exit(1);
    }

    console.log('✓ Latest framework fetched\n');

    // =======================================================================
    // STEP 2: Compare files
    // =======================================================================

    console.log('Step 2: Comparing your files with upstream...\n');

    const comparison = await compareFiles(stagingDir, frameworkDir);

    // =======================================================================
    // STEP 3: Show report (again, for confirmation)
    // =======================================================================

    const versionInfo = getFrameworkVersionInfo(frameworkDir);
    const upstreamVersion = fetchResult.upstreamCommit?.slice(0, 7) || 'unknown';
    const localVersion = versionInfo?.version || 'unknown';

    const report = generateComparisonReport(comparison, localVersion, upstreamVersion);
    console.log(report);

    // =======================================================================
    // STEP 4: Check if there are changes
    // =======================================================================

    if (!hasChanges(comparison)) {
      console.log('\n✓ Your framework is already up to date!\n');
      process.exit(0);
    }

    // =======================================================================
    // STEP 5: Ask for confirmation
    // =======================================================================

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('READY TO APPLY UPDATES');
    console.log('───────────────────────────────────────────────────────────────────');
    console.log('');
    console.log('What will happen:');
    console.log('  1. A backup will be created at: .framework-backup/[timestamp]/');
    console.log('  2. Safe updates will be applied automatically');
    if (comparison.conflicts.length > 0) {
      console.log(`  3. You'll be asked about ${comparison.conflicts.length} conflicting file(s)`);
    }
    console.log('  4. Your .env and custom skills will NOT be changed');
    console.log('  5. You can rollback anytime if needed');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    const proceed = await getUserConfirmation('Proceed with update? (yes/no) ');

    if (!proceed) {
      console.log('\n✓ Update cancelled. Staging preserved for later review.');
      console.log('Run /framework-update-apply again when ready.\n');
      process.exit(0);
    }

    // =======================================================================
    // STEP 6: Create backup
    // =======================================================================

    console.log('\nStep 3: Creating backup...');

    const backupOk = await createBackup(backupDir, ['settings.json', 'CLAUDE.md', 'skills', 'agents', 'commands', 'hooks'], frameworkDir);

    if (!backupOk) {
      console.error('❌ Backup creation failed. Aborting update.');
      process.exit(1);
    }

    console.log('✓ Backup created\n');

    // =======================================================================
    // STEP 7: Apply updates
    // =======================================================================

    console.log('Step 4: Applying updates...\n');

    const summary = await applyUpdates(comparison, stagingDir, frameworkDir, { force: false });

    // =======================================================================
    // STEP 8: Validate
    // =======================================================================

    console.log('\nStep 5: Validating...\n');

    const settingsPath = join(frameworkDir, 'settings.json');
    if (fileExists(settingsPath)) {
      try {
        const content = await readFile(settingsPath);
        JSON.parse(content);
        console.log('✓ settings.json is valid');
      } catch {
        console.error('❌ settings.json validation failed!');
        console.error('Restore from backup: cp -r .framework-backup/[latest]/* .');
        process.exit(1);
      }
    }

    // =======================================================================
    // STEP 9: Report results
    // =======================================================================

    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('UPDATE COMPLETE');
    console.log('───────────────────────────────────────────────────────────────────');
    console.log('');
    console.log(`✓ Applied: ${summary.applied} files`);
    console.log(`✓ Added: ${summary.newFiles} new files`);
    if (summary.errors > 0) {
      console.log(`❌ Errors: ${summary.errors} files`);
    }
    console.log(`✓ Protected: ${summary.preserved} files (unchanged)`);
    console.log('');
    console.log('Backup location: .framework-backup/[timestamp]/');
    console.log('');
    if (summary.errors > 0) {
      console.log('⚠️  Some errors occurred. Review above.');
    } else {
      console.log('✓ Everything worked! Your framework is updated.');
    }
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    // =======================================================================
    // STEP 10: Cleanup staging
    // =======================================================================

    await remove(stagingDir);

    process.exit(summary.errors > 0 ? 1 : 0);
  } catch (error) {
    console.error(`\n❌ Error: ${error}\n`);

    // Cleanup staging on error
    try {
      await remove(join(frameworkDir, '.framework-staging'));
    } catch {
      // Ignore
    }

    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}

export { main };
