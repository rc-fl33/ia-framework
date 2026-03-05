import { resolve } from 'path';

/**
 * Run a git command and return output.
 * Throws on error.
 */
async function runGit(args: string[], cwd: string): Promise<string> {
  const proc = Bun.spawn(['git', ...args], {
    cwd,
    stdout: 'pipe',
    stderr: 'pipe'
  });

  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    const stderr = await new Response(proc.stderr).text();
    throw new Error(`git ${args[0]} failed: ${stderr}`);
  }

  return new Response(proc.stdout).text();
}

/**
 * Check if directory is a git repository.
 */
export async function isGitRepository(dir: string): Promise<boolean> {
  try {
    await runGit(['rev-parse', '--git-dir'], dir);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get current version and commit hash.
 */
export async function getCurrentVersion(
  dir: string
): Promise<{ version: string; commit: string }> {
  try {
    const commit = (await runGit(['rev-parse', '--short', 'HEAD'], dir)).trim();
    const version = (
      await runGit(['describe', '--tags', '--always'], dir)
    ).trim();

    return { version, commit };
  } catch (error) {
    return { version: 'unknown', commit: 'unknown' };
  }
}

/**
 * Get locally modified files using git status.
 * Returns mapping of filepath -> status code (M, A, D, ?, etc.)
 */
export async function getLocalChanges(
  dir: string
): Promise<Record<string, string>> {
  try {
    const output = await runGit(['status', '--porcelain'], dir);
    const changes: Record<string, string> = {};

    for (const line of output.trim().split('\n')) {
      if (!line) continue;

      const status = line.substring(0, 2).trim();
      const filepath = line.substring(3).trim();

      if (status && filepath) {
        // Store first character of status (M, A, D, ?, etc.)
        changes[filepath] = status[0] || '?';
      }
    }

    return changes;
  } catch {
    // If git fails, return empty (assume no local changes)
    return {};
  }
}

/**
 * Get list of files staged for commit.
 */
export async function getStagedFiles(dir: string): Promise<string[]> {
  try {
    const output = await runGit(['diff', '--cached', '--name-only'], dir);
    return output.trim().split('\n').filter(f => f.length > 0);
  } catch {
    return [];
  }
}

/**
 * Get upstream remote URL.
 * Returns false if remote doesn't exist or git fails.
 */
export async function getUpstreamUrl(
  dir: string
): Promise<string | false> {
  try {
    const url = (
      await runGit(['remote', 'get-url', 'upstream'], dir)
    ).trim();
    return url ? url : false;
  } catch {
    return false;
  }
}

/**
 * Add or update upstream remote.
 */
export async function addUpstreamRemote(
  dir: string,
  url: string
): Promise<boolean> {
  try {
    // Try to remove existing first
    try {
      await runGit(['remote', 'remove', 'upstream'], dir);
    } catch {
      // Doesn't exist yet, that's fine
    }

    // Add new upstream
    await runGit(['remote', 'add', 'upstream', url], dir);
    return true;
  } catch (error) {
    console.error(`Failed to add upstream remote: ${error}`);
    return false;
  }
}

/**
 * Fetch from upstream remote.
 */
export async function fetchUpstream(dir: string): Promise<boolean> {
  try {
    await runGit(['fetch', 'upstream', 'main'], dir);
    return true;
  } catch (error) {
    console.error(`Failed to fetch upstream: ${error}`);
    return false;
  }
}

/**
 * Get commit hash for a ref (branch, tag, etc.)
 */
export async function getCommitHash(
  dir: string,
  ref: string = 'HEAD'
): Promise<string | null> {
  try {
    return (await runGit(['rev-parse', ref], dir)).trim();
  } catch {
    return null;
  }
}

/**
 * Get upstream commit hash (requires upstream to be fetched).
 */
export async function getUpstreamCommit(dir: string): Promise<string | null> {
  return getCommitHash(dir, 'upstream/main');
}
