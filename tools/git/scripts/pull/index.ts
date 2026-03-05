#!/usr/bin/env bun
/**
 * git-pull Module - Main Execution
 *
 * Pulls latest changes from remote using non-destructive rebase strategy.
 * Full workflow with pre-flight checks, fetch, rebase, and conflict detection.
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

// Inline validation functions to avoid @/ alias dependency
interface ValidationResult {
  valid: boolean;
  error?: string;
}

const DANGEROUS_PATTERNS = [
  /[;&|`$]/,           // Shell metacharacters
  /\n/,                 // Newlines
  /&&|\|\|/,           // Command chaining
  />\s*\//,            // Redirect to absolute path
  /\$\(/,              // Command substitution
  /`/,                 // Backticks
];

function validateCommand(input: string): ValidationResult {
  for (const pattern of DANGEROUS_PATTERNS) {
    if (pattern.test(input)) {
      return { valid: false, error: 'Potential command injection detected' };
    }
  }
  if (input.includes('\0')) {
    return { valid: false, error: 'Null byte detected' };
  }
  return { valid: true };
}

function validateUrl(url: string): ValidationResult {
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { valid: false, error: 'Only http/https URLs allowed' };
    }
    return { valid: true };
  } catch {
    return { valid: false, error: 'Invalid URL format' };
  }
}

interface GitPullParams {
  dryRun?: boolean;           // Preview only, don't pull
  noVerify?: boolean;         // Skip pre-commit hooks on rebase
}

interface GitPullResult {
  success: boolean;
  commitsPulled?: number;
  filesChanged?: number;
  hasConflicts?: boolean;
  conflictingFiles?: string[];
  message?: string;
  error?: string;
}

const REPO_PATH = process.env.GIT_PUSH_REPO_PATH || process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..', '..');
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

  // Validate REMOTE name against command injection
  const remoteValidation = validateCommand(REMOTE);
  if (!remoteValidation.valid) {
    return {
      success: false,
      error: `Invalid remote name: ${remoteValidation.error}\n\nRemote names should contain only alphanumeric characters, hyphens, and underscores`
    };
  }

  // Validate BRANCH name against command injection
  const branchValidation = validateCommand(BRANCH);
  if (!branchValidation.valid) {
    return {
      success: false,
      error: `Invalid branch name: ${branchValidation.error}\n\nBranch names should contain only alphanumeric characters, hyphens, underscores, and forward slashes`
    };
  }

  // Check GITHUB_TOKEN
  if (!process.env.GITHUB_TOKEN) {
    return {
      success: false,
      error: 'Missing GITHUB_TOKEN in .env\n\nRun: npm run env:add git-pull'
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

  // Verify it's a git repo
  try {
    execSync('git rev-parse --git-dir', { encoding: 'utf-8' });
  } catch (error) {
    return {
      success: false,
      error: `Not a git repository: ${REPO_PATH}\n\nInitialize with: git init`
    };
  }

  // Verify remote exists
  try {
    const remoteUrl = execFileSync('git', ['remote', 'get-url', REMOTE], { encoding: 'utf-8' }).trim();
    console.log(`\n   Remote: ${REMOTE}`);
    console.log(`   URL: ${remoteUrl}`);

    // Verify it's a valid git remote URL format
    if (!remoteUrl.startsWith('http') && !remoteUrl.startsWith('git@')) {
      return {
        success: false,
        error: `Invalid remote URL: ${remoteUrl}\n\nVerify GIT_PUSH_REMOTE is correctly configured in .env`
      };
    }

    // Validate HTTP/HTTPS URLs against SSRF (git@ URLs are SSH and don't apply)
    if (remoteUrl.startsWith('http')) {
      const urlValidation = validateUrl(remoteUrl);
      if (!urlValidation.valid) {
        return {
          success: false,
          error: `Invalid remote URL: ${urlValidation.error}\n\nVerify GIT_PUSH_REMOTE in .env points to a valid, public git repository`
        };
      }

      if (urlValidation.warnings) {
        console.warn('   ⚠️  Remote URL warnings:', urlValidation.warnings.join(', '));
      }
    }

    console.log('   ✅ Remote verified');
  } catch (error) {
    return {
      success: false,
      error: `Remote '${REMOTE}' not found\n\nConfigure remotes with: git remote add ${REMOTE} <url>`
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
 * Step 2: Fetch from Remote
 * Download latest commits without modifying working directory
 */
async function fetchFromRemote(): Promise<{ success: boolean; error?: string }> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 2: Fetch from Remote');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  console.log(`\n   Fetching from ${REMOTE}/${BRANCH}...\n`);

  try {
    execFileSync('git', ['fetch', REMOTE, BRANCH], { stdio: 'inherit' });
    console.log('\n   ✅ Fetch completed');
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: 'Fetch failed - check network and credentials'
    };
  }
}

/**
 * Step 3: Check if pull is needed
 */
function checkIfPullNeeded(): boolean {
  process.chdir(REPO_PATH);

  try {
    const status = execFileSync('git', ['rev-list', '--left-right', '--count', `${REMOTE}/${BRANCH}...HEAD`], {
      encoding: 'utf-8'
    }).trim();

    const [behind] = status.split('\t').map(Number);
    return behind > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Step 4: Rebase on Remote
 */
async function rebaseOnRemote(dryRun: boolean): Promise<{ success: boolean; conflicts: boolean; error?: string }> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 4: Rebase on Remote');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  const needsPull = checkIfPullNeeded();

  if (!needsPull) {
    console.log('\n   ℹ️  No changes to pull - working tree is up to date\n');
    return { success: true, conflicts: false };
  }

  console.log(`\n   Rebasing on ${REMOTE}/${BRANCH}...\n`);

  if (dryRun) {
    console.log('   DRY RUN - Not actually rebasing\n');
    return { success: true, conflicts: false };
  }

  try {
    execFileSync('git', ['pull', '--rebase', REMOTE, BRANCH], { stdio: 'inherit' });
    console.log('\n   ✅ Rebase completed successfully');
    return { success: true, conflicts: false };
  } catch (error) {
    // Check if this was a merge conflict
    const conflictStatus = execSync('git status --short', { encoding: 'utf-8' });
    const hasConflicts = conflictStatus.includes('UU') || conflictStatus.includes('AA') || conflictStatus.includes('DD');

    if (hasConflicts) {
      console.log('\n   ⚠️  Merge conflict detected');
      return { success: true, conflicts: true };
    }

    return {
      success: false,
      conflicts: false,
      error: 'Rebase failed - check output above'
    };
  }
}

/**
 * Step 5: Get Pull Statistics
 */
function getPullStats(): { commitsPulled: number; filesChanged: number } {
  process.chdir(REPO_PATH);

  let commitsPulled = 0;
  let filesChanged = 0;

  try {
    const status = execFileSync('git', ['rev-list', '--left-right', '--count', `${REMOTE}/${BRANCH}...HEAD`], {
      encoding: 'utf-8'
    }).trim();
    const [behind] = status.split('\t').map(Number);
    commitsPulled = behind;
  } catch (error) {
    // Couldn't calculate
  }

  try {
    const diffStat = execFileSync('git', ['diff', '--stat', `${REMOTE}/${BRANCH}...HEAD`], { encoding: 'utf-8' });
    const lines = diffStat.split('\n').filter(l => l.includes('|'));
    filesChanged = lines.length;
  } catch (error) {
    // Couldn't calculate
  }

  return { commitsPulled, filesChanged };
}

/**
 * Step 6: Verify Result
 */
function verifyResult(conflicts: boolean): void {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 5: Verify Result');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  const status = execSync('git status --short', { encoding: 'utf-8' });

  if (conflicts && status) {
    console.log('\n   ⚠️  Merge conflict detected in:');
    const lines = status.split('\n').filter(l => l.trim());
    for (const line of lines) {
      console.log(`   ${line}`);
    }
    console.log('\n   Next steps:');
    console.log('   1. Review and resolve conflicts');
    console.log('   2. Run: git add <resolved-files>');
    console.log('   3. Run: git rebase --continue\n');
  } else if (!status.trim()) {
    const lastCommit = execSync('git log --oneline -1', { encoding: 'utf-8' }).trim();
    console.log(`\n   ✅ Pull completed successfully\n`);
    console.log(`   Latest: ${lastCommit}\n`);
  } else {
    console.log('\n   ✅ Pull completed with changes\n');
    console.log(status);
  }
}

/**
 * Step 6: Confirm Success
 */
async function confirmSuccess(commitsPulled: number, filesChanged: number): Promise<void> {
  console.log('\n' + '='.repeat(70));
  console.log('STEP 6: Confirm Success');
  console.log('='.repeat(70));

  process.chdir(REPO_PATH);

  const status = execSync('git status', { encoding: 'utf-8' });
  const lastCommit = execSync('git log --oneline -1', { encoding: 'utf-8' }).trim();

  console.log('\n   Final Status:');
  console.log('   ' + '-'.repeat(60));
  console.log(`   ✅ Pre-flight checks completed`);
  console.log(`   ✅ Fetched from remote`);
  console.log(`   ✅ Rebased on ${REMOTE}/${BRANCH}`);
  console.log('   ' + '-'.repeat(60));
  console.log(`   📊 Commits pulled: ${commitsPulled}`);
  console.log(`   📊 Files changed: ${filesChanged}`);
  console.log(`   🔗 ${lastCommit}`);
  console.log('\n' + '='.repeat(70) + '\n');
}

/**
 * Main execution function - orchestrates all steps
 */
export async function execute(params: GitPullParams = {}): Promise<GitPullResult> {
  console.log('\n' + '='.repeat(70));
  console.log('GIT-PULL: Starting pull workflow');
  console.log('='.repeat(70));

  try {
    // Step 1: Pre-Flight Safety Checks
    const envCheck = await verifyEnvironment();
    if (!envCheck.success) {
      return { success: false, error: envCheck.error };
    }

    // Step 2: Fetch from Remote
    const fetchResult = await fetchFromRemote();
    if (!fetchResult.success) {
      return { success: false, error: fetchResult.error };
    }

    // Step 3 & 4: Rebase on Remote
    const rebaseResult = await rebaseOnRemote(params.dryRun || false);
    if (!rebaseResult.success) {
      return {
        success: false,
        hasConflicts: rebaseResult.conflicts,
        error: rebaseResult.error
      };
    }

    // Get statistics
    const stats = getPullStats();

    // Step 5: Verify Result
    verifyResult(rebaseResult.conflicts);

    // Step 6: Confirm Success
    if (!params.dryRun && !rebaseResult.conflicts) {
      await confirmSuccess(stats.commitsPulled, stats.filesChanged);
    }

    return {
      success: true,
      commitsPulled: stats.commitsPulled,
      filesChanged: stats.filesChanged,
      hasConflicts: rebaseResult.conflicts,
      message: rebaseResult.conflicts ? 'Pull completed with conflicts' : 'Pull completed successfully'
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
  const params: GitPullParams = {
    dryRun: args.includes('--dry-run') || args.includes('-n'),
    noVerify: args.includes('--no-verify')
  };

  execute(params).then(result => {
    if (!result.success) {
      console.error(`❌ ${result.error}`);
      process.exit(1);
    }
    if (result.hasConflicts) {
      process.exit(1);
    }
  });
}
