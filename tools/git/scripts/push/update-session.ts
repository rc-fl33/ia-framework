#!/usr/bin/env bun
/**
 * Update Session State Script
 *
 * Captures current session work before committing:
 * - Git commit messages from today
 * - Modified files summary
 * - Uncommitted changes summary
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

interface SessionUpdateResult {
  success: boolean;
  sessionFile?: string;
  sessionNumber?: number;
  error?: string;
}

interface SessionData {
  commits: string[];
  modifiedFiles: string[];
  filesByDir: Record<string, number>;
  uncommittedChanges: string[];
}

/**
 * Get today's commits
 */
function getTodaysCommits(rootPath: string): string[] {
  try {
    process.chdir(rootPath);
    const today = new Date().toISOString().split('T')[0];
    const output = execSync(
      `git log --oneline --since="${today} 00:00:00" --format=%s`,
      { encoding: 'utf-8', timeout: 10000 }
    );

    return output
      .trim()
      .split('\n')
      .filter(c => c && !c.startsWith('Merge'));
  } catch (error) {
    return [];
  }
}

/**
 * Get modified files from git status
 */
function getModifiedFiles(rootPath: string): string[] {
  try {
    process.chdir(rootPath);
    const output = execSync('git status --short', { encoding: 'utf-8', timeout: 5000 });
    const lines = output.trim().split('\n').filter(line => line.trim());

    return lines.map(line => line.substring(3).trim());
  } catch (error) {
    return [];
  }
}

/**
 * Get files changed today grouped by directory
 */
function getFilesChangedToday(rootPath: string): Record<string, number> {
  try {
    process.chdir(rootPath);
    const today = new Date().toISOString().split('T')[0];
    const output = execSync(
      `git log --name-only --pretty=format: --since="${today} 00:00:00"`,
      { encoding: 'utf-8', timeout: 10000 }
    );

    const files = output.trim().split('\n').filter(f => f);
    const dirs: Record<string, number> = {};

    for (const file of files) {
      const topDir = file.includes('/') ? file.split('/')[0] : '(root)';
      dirs[topDir] = (dirs[topDir] || 0) + 1;
    }

    return dirs;
  } catch (error) {
    return {};
  }
}

/**
 * Find or create today's session file
 */
function getOrCreateSessionFile(rootPath: string): {
  filePath: string;
  sessionNumber: number;
  isNew: boolean;
} {
  const sessionsDir = join(rootPath, 'sessions');

  // Ensure sessions directory exists
  if (!existsSync(sessionsDir)) {
    mkdirSync(sessionsDir, { recursive: true });
  }

  const today = new Date().toISOString().split('T')[0];
  const pattern = new RegExp(`^${today}-.*\\.md$`);

  // Look for existing session files
  const existingFiles = readdirSync(sessionsDir)
    .filter(f => pattern.test(f))
    .map(f => join(sessionsDir, f));

  if (existingFiles.length > 0) {
    // Use most recently modified file
    const sessionFile = existingFiles.reduce((latest, current) => {
      const latestMtime = statSync(latest).mtimeMs;
      const currentMtime = statSync(current).mtimeMs;
      return currentMtime > latestMtime ? current : latest;
    });

    // Count existing session entries
    const content = readFileSync(sessionFile, 'utf-8');
    const sessionCount = (content.match(/### Session \d+/g) || []).length;

    return {
      filePath: sessionFile,
      sessionNumber: sessionCount + 1,
      isNew: false
    };
  }

  // Create new session file
  const projectName = 'framework-work';
  const sessionFile = join(sessionsDir, `${today}-${projectName}.md`);

  const initialContent = `# Session State: ${projectName}

**Project:** IA Framework Development
**Date:** ${today}
**Status:** Active

---

## Session History

`;

  writeFileSync(sessionFile, initialContent, 'utf-8');

  return {
    filePath: sessionFile,
    sessionNumber: 1,
    isNew: true
  };
}

/**
 * Create session entry markdown
 */
function createSessionEntry(sessionNumber: number, data: SessionData): string {
  const now = new Date();
  const timestamp = now.toTimeString().substring(0, 5);
  const date = now.toISOString().split('T')[0];

  const lines: string[] = [
    `### Session ${sessionNumber} - ${date} ${timestamp}`,
    ''
  ];

  // Add commits as work summary
  if (data.commits.length > 0) {
    lines.push('**Work Completed:**');
    for (const commit of data.commits.slice(0, 8)) {
      // Clean up commit message for display
      const cleanMsg = commit
        .replace(/^(Feature|Fix|Cleanup|Docs|Refactor):\s*/i, '')
        .replace(/\s*Co-Authored-By:.*$/i, '');
      lines.push(`- ${cleanMsg}`);
    }
    if (data.commits.length > 8) {
      lines.push(`- ... and ${data.commits.length - 8} more commits`);
    }
    lines.push('');
  } else {
    lines.push('**Work Completed:**');
    lines.push('- [No commits - fill in manually]');
    lines.push('');
  }

  // Add files changed by directory
  if (Object.keys(data.filesByDir).length > 0) {
    lines.push('**Areas Modified:**');
    const sortedDirs = Object.entries(data.filesByDir)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    for (const [dir, count] of sortedDirs) {
      lines.push(`- ${dir}/ (${count} files)`);
    }
    lines.push('');
  }

  // Add uncommitted changes if any
  if (data.uncommittedChanges.length > 0) {
    lines.push('**Uncommitted Changes:**');
    for (const file of data.uncommittedChanges.slice(0, 5)) {
      lines.push(`- ${file}`);
    }
    if (data.uncommittedChanges.length > 5) {
      lines.push(`- ... and ${data.uncommittedChanges.length - 5} more files`);
    }
    lines.push('');
  }

  lines.push('**Next Actions:**');
  lines.push('- [ ] [To be filled in if needed]');
  lines.push('');
  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

/**
 * Update session state
 */
export async function updateSession(rootPath: string): Promise<SessionUpdateResult> {
  console.log('\n📝 Updating session state...\n');

  try {
    // Gather session data
    const commits = getTodaysCommits(rootPath);
    const modifiedFiles = getModifiedFiles(rootPath);
    const filesByDir = getFilesChangedToday(rootPath);

    const sessionData: SessionData = {
      commits,
      modifiedFiles,
      filesByDir,
      uncommittedChanges: modifiedFiles
    };

    // Get or create session file
    const { filePath, sessionNumber, isNew } = getOrCreateSessionFile(rootPath);

    // Create session entry
    const entry = createSessionEntry(sessionNumber, sessionData);

    // Append to session file
    const existingContent = readFileSync(filePath, 'utf-8');
    writeFileSync(filePath, existingContent + entry, 'utf-8');

    const status = isNew ? 'created' : 'updated';
    const fileName = basename(filePath);

    console.log(`   ✅ Session state ${status}: ${fileName}`);
    console.log(`   Session ${sessionNumber} logged`);
    console.log(`   Commits today: ${commits.length}`);
    console.log(`   Uncommitted: ${modifiedFiles.length} files\n`);

    return {
      success: true,
      sessionFile: fileName,
      sessionNumber
    };

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.log(`   ⚠️  Session update failed: ${errorMsg}\n`);

    return {
      success: false,
      error: errorMsg
    };
  }
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  updateSession(rootPath).then(result => {
    // Session update is informational - don't fail pipeline
    process.exit(0);
  });
}
