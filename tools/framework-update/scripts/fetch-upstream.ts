import { join } from 'path';
import { remove, mkdir } from './utils/file-operations.ts';
import {
  isGitRepository,
  addUpstreamRemote,
  fetchUpstream,
  getUpstreamCommit
} from './utils/git-operations.ts';

export interface FetchResult {
  success: boolean;
  error?: string;
  upstreamCommit?: string;
  stagingPath?: string;
}

/**
 * Fetch upstream and clone to staging directory.
 *
 * Steps:
 * 1. Verify this is a git repository
 * 2. Add upstream remote if needed
 * 3. Fetch from upstream
 * 4. Clone to staging directory with depth=1
 *
 * Returns success/error status.
 */
export async function fetchUpstreamRepo(
  frameworkDir: string,
  upstreamRepo: string
): Promise<FetchResult> {
  const stagingPath = join(frameworkDir, '.framework-staging');

  try {
    // Step 1: Verify git repo
    const isRepo = await isGitRepository(frameworkDir);
    if (!isRepo) {
      return {
        success: false,
        error: 'Not a git repository. Initialize with: git init'
      };
    }

    // Step 2: Add upstream remote
    const remoteAdded = await addUpstreamRemote(frameworkDir, upstreamRepo);
    if (!remoteAdded) {
      return {
        success: false,
        error: 'Failed to add upstream remote'
      };
    }

    // Step 3: Fetch from upstream
    const fetchOk = await fetchUpstream(frameworkDir);
    if (!fetchOk) {
      return {
        success: false,
        error: 'Failed to fetch from upstream. Check internet connection.'
      };
    }

    // Step 4: Get upstream commit
    const upstreamCommit = await getUpstreamCommit(frameworkDir);
    if (!upstreamCommit) {
      return {
        success: false,
        error: 'Failed to get upstream commit hash'
      };
    }

    // Step 5: Clean staging directory
    await remove(stagingPath);
    await mkdir(stagingPath);

    // Step 6: Clone upstream to staging with depth=1
    // Files will be at root level of staging directory (not under .claude/)
    const cloneProc = Bun.spawn([
      'git', 'clone',
      '--depth', '1',
      '--single-branch',
      '--branch', 'main',
      upstreamRepo,
      stagingPath
    ]);

    const exitCode = await cloneProc.exited;
    if (exitCode !== 0) {
      return {
        success: false,
        error: 'Failed to clone upstream repository'
      };
    }

    return {
      success: true,
      upstreamCommit,
      stagingPath
    };
  } catch (error) {
    // Cleanup on error
    try {
      await remove(stagingPath);
    } catch {
      // Ignore cleanup errors
    }

    return {
      success: false,
      error: `Fetch failed: ${error}`
    };
  }
}

/**
 * Get version info from staging repo.
 */
export async function getStagingVersion(stagingPath: string): Promise<{
  commit: string;
  date: string;
} | null> {
  try {
    const commitProc = Bun.spawn(
      ['git', 'rev-parse', '--short', 'HEAD'],
      { cwd: stagingPath, stdout: 'pipe' }
    );
    const commit = (await new Response(commitProc.stdout).text()).trim();

    const dateProc = Bun.spawn(
      ['git', 'log', '-1', '--format=%ci'],
      { cwd: stagingPath, stdout: 'pipe' }
    );
    const date = (await new Response(dateProc.stdout).text()).trim();

    return { commit, date };
  } catch {
    return null;
  }
}
