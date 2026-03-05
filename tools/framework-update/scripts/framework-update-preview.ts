#!/usr/bin/env bun

/**
 * PREVIEW MODE: Show what updates are available
 *
 * This script:
 * 1. Fetches upstream to staging directory
 * 2. Compares with your local files
 * 3. Shows a simple report
 * 4. Tells you how to apply changes
 * 5. Exits (no modifications made)
 */

import { join } from 'path';
import { remove, fileExists } from './utils/file-operations.ts';
import { getFrameworkVersionInfo } from './utils/file-detection.ts';
import { fetchUpstreamRepo } from './fetch-upstream.ts';
import { compareFiles, generateComparisonReport, hasChanges } from './compare-files.ts';

const UPSTREAM_REPO = 'https://github.com/notchrisgroves/ia-framework.git';

function getFrameworkDir(): string {
  return process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
}

async function main() {
  const frameworkDir = getFrameworkDir();
  const stagingDir = join(frameworkDir, '.framework-staging');

  try {
    console.log('\n📋 Checking for framework updates...\n');

    // =======================================================================
    // STEP 1: Fetch upstream
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
    // STEP 3: Show report
    // =======================================================================

    const versionInfo = getFrameworkVersionInfo(frameworkDir);
    const upstreamVersion = fetchResult.upstreamCommit?.slice(0, 7) || 'unknown';
    const localVersion = versionInfo?.version || 'unknown';

    const report = generateComparisonReport(comparison, localVersion, upstreamVersion);
    console.log(report);

    // =======================================================================
    // STEP 4: Show next steps
    // =======================================================================

    if (!hasChanges(comparison)) {
      console.log('\n✓ Your framework is up to date!\n');
      process.exit(0);
    }

    console.log('═══════════════════════════════════════════════════════════════════');
    console.log('NEXT STEP:');
    console.log('───────────────────────────────────────────────────────────────────');
    console.log('');
    console.log('To apply these updates, run:');
    console.log('');
    console.log('  /framework-update-apply');
    console.log('');
    console.log('This will:');
    console.log('  • Show you the changes one more time');
    console.log('  • Ask for your confirmation');
    console.log('  • Create a backup');
    console.log('  • Apply the updates');
    console.log('  • You can rollback anytime from .framework-backup/');
    console.log('');
    console.log('═══════════════════════════════════════════════════════════════════\n');

    process.exit(0);
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
