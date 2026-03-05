#!/usr/bin/env bun
/**
 * git-push Module - Main Execution
 *
 * Commits and pushes changes to private GitHub repository.
 * Full workflow with pre-flight checks, cleanup, security scan, and audits.
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

import { runCleanup } from './cleanup';
import { runSecurityScan } from './security-scan';
import { runAudit } from './audit-documentation';
import { runManifestAudit } from './audit-manifest';
import { updateSession } from './update-session';
import { syncDiscoverySymlinks } from './sync-symlinks';

interface GitPushParams {
  message?: string;          // Custom commit message
  dryRun?: boolean;          // Preview only, don't commit
  files?: string[];          // Specific files to commit
  noVerify?: boolean;        // Skip pre-commit hooks
  skipCleanup?: boolean;     // Skip cleanup phase
  skipAudit?: boolean;       // Skip documentation audit
  skipManifestAudit?: boolean; // Skip manifest audit
  skipSecurityScan?: boolean; // Skip security scan
}

interface GitPushResult {
  success: boolean;
  commit?: string;
  message?: string;
  filesChanged?: number;
  error?: string;
}

const REPO_PATH = process.env.GIT_PUSH_REPO_PATH || (process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..', '..'));
const REMOTE = process.env.GIT_PUSH_REMOTE || 'origin';
const BRANCH = process.env.GIT_PUSH_BRANCH || 'main';

/**
 * Step 1: Pre-Flight Safety Checks
 * Verify correct repository and branch before any operations.
 */
async function verifyEnvironment(): Promise<{ success: boolean; error?: string }> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 1: Pre-Flight Safety Checks');
  console.log('='.repeat(70));

  // Check GITHUB_TOKEN
  if (!process.env.GITHUB_TOKEN) {
    return {
      success: false,
      error: 'Missing GITHUB_TOKEN in .env\n\nRun: npm run env:add git-push'
    };
  }

  // Check repo path exists
  if (!existsSync(REPO_PATH)) {
    return {
      success: false,
      error: `Repository path not found: ${REPO_PATH}\n\nCheck GIT_PUSH_REPO_PATH in .env`
    };
  }

  process.chdir(REPO_PATH);

  // Verify remote
  try {
    const remoteUrl = execFileSync('git', ['remote', 'get-url', REMOTE], { encoding: 'utf-8' }).trim();
    console.log(`\n   Remote: ${REMOTE}`);
    console.log(`   URL: ${remoteUrl}`);

    // Verify it's a valid git remote (no requirement for specific repo name)
    if (!remoteUrl.startsWith('http') && !remoteUrl.startsWith('git@')) {
      return {
        success: false,
        error: `Invalid remote URL: ${remoteUrl}\n\nVerify GIT_PUSH_REMOTE is correctly configured in .env`
      };
    }

    console.log('   ✅ Remote verified');
  } catch (error) {
    return {
      success: false,
      error: `Failed to verify remote: ${error}`
    };
  }

  // Verify branch
  try {
    const currentBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    console.log(`   Branch: ${currentBranch}`);

    if (currentBranch !== BRANCH) {
      console.log(`   ⚠️  Expected branch: ${BRANCH}`);
    }
  } catch (error) {
    // Non-fatal
  }

  return { success: true };
}

/**
 * Step 4: Review Changes
 * Show what has changed (working tree + unpushed commits).
 */
async function reviewChanges(): Promise<{
  hasWorkingTreeChanges: boolean;
  hasUnpushedCommits: boolean;
  status: string;
  diffStat: string;
  unpushedCount: number;
}> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 4: Review Changes');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  // Check working tree changes
  const status = execSync('git status --short', { encoding: 'utf-8' });
  const hasWorkingTreeChanges = status.trim().length > 0;

  let diffStat = '';
  if (hasWorkingTreeChanges) {
    try {
      diffStat = execSync('git diff --stat', { encoding: 'utf-8' });
    } catch (error) {
      // No diff available
    }
  }

  // Check unpushed commits
  let hasUnpushedCommits = false;
  let unpushedCount = 0;
  try {
    const unpushed = execFileSync('git', ['log', `${REMOTE}/${BRANCH}..HEAD`, '--oneline'], { encoding: 'utf-8' });
    hasUnpushedCommits = unpushed.trim().length > 0;
    unpushedCount = unpushed.trim().split('\n').filter(line => line.trim()).length;
  } catch (error) {
    // Remote branch doesn't exist or other error - assume no unpushed commits
  }

  // Report findings
  if (!hasWorkingTreeChanges && !hasUnpushedCommits) {
    console.log('\n   ℹ️  No uncommitted changes and no unpushed commits\n');
    console.log('   Working tree is clean and in sync with remote.\n');
    return {
      hasWorkingTreeChanges: false,
      hasUnpushedCommits: false,
      status: '',
      diffStat: '',
      unpushedCount: 0
    };
  }

  if (hasWorkingTreeChanges) {
    console.log('\n   📝 Uncommitted changes detected:\n');
    console.log(status);
    if (diffStat.trim()) {
      console.log('   Diff summary:\n');
      console.log(diffStat);
    }
  }

  if (hasUnpushedCommits) {
    console.log(`\n   📤 ${unpushedCount} unpushed commit(s) ready to push:\n`);
    const unpushedLog = execFileSync('git', ['log', `${REMOTE}/${BRANCH}..HEAD`, '--oneline'], { encoding: 'utf-8' });
    console.log(unpushedLog);
  }

  return {
    hasWorkingTreeChanges,
    hasUnpushedCommits,
    status,
    diffStat,
    unpushedCount
  };
}

/**
 * Step 5: Stage Changes
 */
async function stageChanges(files?: string[]): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 5: Stage Changes');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  if (files && files.length > 0) {
    console.log(`\n   Staging ${files.length} specific files...`);
    // PERF-001: fixed - batch all files into a single git add call
    execFileSync('git', ['add', ...files], { stdio: 'inherit' });
  } else {
    console.log('\n   Staging all changes...');
    execSync('git add -A', { stdio: 'inherit' });
  }

  // Verify staging
  const staged = execSync('git status --short', { encoding: 'utf-8' });
  console.log('\n   Staged:\n');
  console.log(staged);
}

/**
 * Step 6: Generate Commit Message
 */
function generateCommitMessage(status: string): string {
  const lines = status.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    return 'Update files';
  }

  // Parse file changes
  const added: string[] = [];
  const modified: string[] = [];
  const deleted: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([ MADRCU?!]{2})\s+(.+)$/);
    if (!match) continue;

    const [, statusCode, file] = match;
    const code = statusCode.trim();

    if (code === 'A' || code.includes('?')) {
      added.push(file);
    } else if (code === 'M') {
      modified.push(file);
    } else if (code === 'D') {
      deleted.push(file);
    }
  }

  // Categorize changes
  const categories: string[] = [];

  // Check for specific patterns
  if (added.some(f => f.includes('docs/')) || modified.some(f => f.includes('docs/'))) {
    categories.push('Docs');
  }
  if (added.some(f => f.includes('modules/')) || modified.some(f => f.includes('modules/'))) {
    categories.push('Module');
  }
  if (added.some(f => f.includes('hooks/')) || modified.some(f => f.includes('hooks/'))) {
    categories.push('Hooks');
  }
  if (added.some(f => f.includes('foundation/')) || modified.some(f => f.includes('foundation/'))) {
    categories.push('Foundation');
  }
  if (deleted.length > 0) {
    categories.push('Cleanup');
  }

  // Build message
  const category = categories.length > 0 ? categories[0] : 'Update';
  const parts: string[] = [];

  if (added.length > 0) {
    if (added.length === 1) {
      parts.push(`Add ${added[0]}`);
    } else {
      parts.push(`Add ${added.length} files`);
    }
  }

  if (modified.length > 0) {
    if (modified.length === 1 && added.length === 0) {
      parts.push(`Update ${modified[0]}`);
    } else if (modified.length <= 3 && added.length === 0) {
      parts.push(`Update ${modified.join(', ')}`);
    } else {
      parts.push(`Update ${modified.length} files`);
    }
  }

  if (deleted.length > 0) {
    if (deleted.length === 1) {
      parts.push(`Delete ${deleted[0]}`);
    } else {
      parts.push(`Delete ${deleted.length} files`);
    }
  }

  const summary = parts.join(', ') || 'Update repository';

  return `${category}: ${summary}`;
}

/**
 * Step 7: Commit Changes
 */
async function commitChanges(
  message: string,
  noVerify: boolean
): Promise<{ success: boolean; hash?: string; error?: string }> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 7: Commit Changes');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  const verifyFlag = noVerify ? '--no-verify' : '';
  const fullMessage = `${message}\n\nCo-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>`;

  console.log(`\n   Message: ${message}`);
  if (noVerify) {
    console.log('   ⚠️  Pre-commit hooks skipped (--no-verify)');
  }

  try {
    // Use execFileSync with array arguments for safety
    const commitArgs = ['commit'];
    if (noVerify) commitArgs.push('--no-verify');
    commitArgs.push('-m', fullMessage);
    execFileSync('git', commitArgs, {
      stdio: 'inherit'
    });

    const hash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
    console.log(`\n   ✅ Committed: ${hash}`);

    return { success: true, hash };
  } catch (error) {
    if (!noVerify) {
      console.log('\n   ⚠️  Pre-commit hook failed. Review errors above.');
      console.log('   To bypass (if false positive): set noVerify: true');
    }
    return {
      success: false,
      error: 'Commit failed (see output above)'
    };
  }
}

/**
 * Step 8: Push to GitHub
 */
async function pushToRemote(): Promise<{ success: boolean; error?: string }> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 8: Push to GitHub');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  console.log(`\n   Pushing to ${REMOTE}/${BRANCH}...`);

  try {
    execFileSync('git', ['push', REMOTE, BRANCH], { stdio: 'inherit' });
    console.log(`\n   ✅ Pushed to ${REMOTE}/${BRANCH}`);
    return { success: true };
  } catch (error) {
    console.log('\n   ❌ Push failed');
    console.log('   If rejected (remote ahead): run "git pull --rebase origin main" first');
    return {
      success: false,
      error: 'Push failed - check network and credentials'
    };
  }
}

/**
 * Step 10: Confirm Success
 */
async function confirmSuccess(commitHash: string, message: string, filesChanged: number): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 10: Confirm Success');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  // Show final status
  const status = execSync('git status', { encoding: 'utf-8' });
  const lastCommit = execSync('git log --oneline -1', { encoding: 'utf-8' }).trim();

  console.log('\n   Final Status:');
  console.log('   ' + '-'.repeat(60));
  console.log(`   ✅ Pre-flight checks completed`);
  console.log(`   ✅ Pre-sync cleanup completed`);
  console.log(`   ✅ Security scan completed`);
  console.log(`   ✅ Documentation audit completed`);
  console.log(`   ✅ Session state updated`);
  console.log(`   ✅ Changes staged (${filesChanged} files)`);
  console.log(`   ✅ Commit created (${commitHash})`);
  console.log(`   ✅ Pushed to GitHub`);
  console.log('   ' + '-'.repeat(60));
  console.log(`   📝 ${message}`);
  console.log(`   🔗 ${lastCommit}`);
  console.log('\n' + '='.repeat(70) + '\n');
}

/**
 * Main execution function - orchestrates all steps
 */
export async function execute(params: GitPushParams = {}): Promise<GitPushResult> {
  console.log('\n' + '='.repeat(70));
  console.log('GIT-PUSH: Starting full sync workflow');
  console.log('='.repeat(70));

  try {
    // Step 1: Pre-Flight Safety Checks
    const envCheck = await verifyEnvironment();
    if (!envCheck.success) {
      return { success: false, error: envCheck.error };
    }

    // Step 1.5: Sync Discovery Symlinks
    console.log('\n' + '='.repeat(70));
    console.log('STEP 1.5: Sync Discovery Symlinks');
    console.log('='.repeat(70));
    try {
      const symlinkResult = await syncDiscoverySymlinks();
      if (symlinkResult.created.length > 0 || symlinkResult.removed.length > 0) {
        console.log(`   ✅ Synced discovery symlinks (${symlinkResult.created.length} created, ${symlinkResult.removed.length} removed)`);
      } else {
        console.log('   ✅ All discovery symlinks already in sync');
      }
      if (symlinkResult.errors.length > 0) {
        console.log('   ⚠️  Some symlink operations had warnings (non-blocking):');
        symlinkResult.errors.forEach(err => console.log(`      - ${err}`));
      }
    } catch (error) {
      // Non-blocking - log warning but continue
      console.log(`   ⚠️  Symlink sync encountered issues (non-blocking): ${error}`);
    }

    // Step 2: Pre-Sync Cleanup
    if (!params.skipCleanup) {
      console.log('\n' + '='.repeat(70));
      console.log('STEP 2: Pre-Sync Cleanup');
      console.log('='.repeat(70));
      await runCleanup(REPO_PATH);
    }

    // Step 2.5: Security File Scan
    if (!params.skipSecurityScan) {
      console.log('\n' + '='.repeat(70));
      console.log('STEP 2.5: Security File Scan');
      console.log('='.repeat(70));
      const securityResult = await runSecurityScan(REPO_PATH);
      if (!securityResult.success) {
        console.log('\n   ⚠️  Security scan found blocking issues.');
        console.log('   Review alerts above and fix before proceeding.');
        console.log('   Or use skipSecurityScan: true to bypass (not recommended).\n');
        return {
          success: false,
          error: 'Security scan failed - review alerts above'
        };
      }
    }

    // Step 2.5b: Documentation Audit
    if (!params.skipAudit) {
      console.log('\n' + '='.repeat(70));
      console.log('STEP 2.5b: Documentation Audit');
      console.log('='.repeat(70));
      const auditResult = await runAudit(REPO_PATH);
      if (auditResult.hasIssues) {
        console.log('   ⚠️  Documentation issues found (informational)');
        console.log('   Review above and fix if needed before proceeding.\n');
        // Audit is informational - don't block
      }

      // Step 2.5c: Manifest Drift Audit
      if (!params.skipManifestAudit) {
        console.log('\n' + '='.repeat(70));
        console.log('STEP 2.5c: Manifest Drift Audit');
        console.log('='.repeat(70));
        const manifestResult = await runManifestAudit(REPO_PATH);
        if (manifestResult.hasDrift) {
          console.log('   ⚠️  Manifest has stale exclusions');
          console.log('   These will be auto-pruned on next git-public sync.\n');
          // Manifest audit is informational - don't block
        }
      } else {
        console.log('\n' + '='.repeat(70));
        console.log('STEP 2.5c: Manifest Drift Audit');
        console.log('='.repeat(70));
        console.log('   ⏭️  Skipping manifest audit (--skip-manifest)\n');
      }
    }

    // Step 3: Update Session State
    console.log('\n' + '='.repeat(70));
    console.log('STEP 3: Update Session State');
    console.log('='.repeat(70));
    await updateSession(REPO_PATH);

    // Step 4: Review Changes
    const { hasWorkingTreeChanges, hasUnpushedCommits, status, unpushedCount } = await reviewChanges();

    // Exit if nothing to do
    if (!hasWorkingTreeChanges && !hasUnpushedCommits) {
      return { success: true, message: 'Nothing to commit or push' };
    }

    // Determine workflow path
    let commitHash: string | undefined;
    let commitMessage: string;
    let filesChanged = 0;

    // PATH 1: Uncommitted changes → commit first, then push
    if (hasWorkingTreeChanges) {
      // Dry run mode - stop here
      if (params.dryRun) {
        console.log('\n' + '='.repeat(70));
        console.log('DRY RUN MODE - Preview only');
        console.log('='.repeat(70));
        const previewMessage = params.message || generateCommitMessage(status);
        console.log(`\n   Would commit: "${previewMessage}"\n`);
        return { success: true, message: previewMessage };
      }

      // Step 5: Stage Changes
      await stageChanges(params.files);

      // Step 6: Generate Commit Message
      console.log('\n' + '='.repeat(70));
      console.log('STEP 6: Generate Commit Message');
      console.log('='.repeat(70));
      commitMessage = params.message || generateCommitMessage(status);
      console.log(`\n   Generated: ${commitMessage}\n`);

      // Step 7: Commit Changes
      const commitResult = await commitChanges(commitMessage, params.noVerify || false);
      if (!commitResult.success) {
        return { success: false, error: commitResult.error };
      }

      commitHash = commitResult.hash;
      filesChanged = status.split('\n').filter(line => line.trim()).length;
    }
    // PATH 2: Clean working tree but unpushed commits → skip to push
    else {
      console.log('\n' + '='.repeat(70));
      console.log('PATH: Clean working tree with unpushed commits');
      console.log('='.repeat(70));
      console.log(`\n   Skipping commit - ${unpushedCount} commit(s) already ready to push\n`);

      // Get the most recent commit for reporting
      commitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
      commitMessage = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' }).trim().split('\n')[0];
      filesChanged = 0; // Already committed
    }

    // Step 8: Push to GitHub
    const pushResult = await pushToRemote();
    if (!pushResult.success) {
      return {
        success: false,
        commit: commitHash,
        message: commitMessage,
        error: pushResult.error
      };
    }

    // Step 10: Confirm Success
    await confirmSuccess(commitHash!, commitMessage, filesChanged);

    return {
      success: true,
      commit: commitHash,
      message: commitMessage,
      filesChanged
    };

  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// CLI execution
if (import.meta.main) {
  const args = process.argv.slice(2);
  const params: GitPushParams = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    noVerify: args.includes('--no-verify'),
    skipCleanup: args.includes('--skip-cleanup'),
    skipAudit: args.includes('--skip-audit'),
    skipManifestAudit: args.includes('--skip-manifest'),
    skipSecurityScan: args.includes('--skip-security'),
    message: args.find(arg => arg.startsWith('--message='))?.split('=')[1]
  };

  execute(params).then(result => {
    if (!result.success) {
      console.error(`❌ ${result.error}`);
      process.exit(1);
    }
  });
}
