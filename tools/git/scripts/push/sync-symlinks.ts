#!/usr/bin/env bun
/**
 * Symlink Sync Script
 *
 * Creates discovery symlinks in ~/.claude/commands/ pointing to skill command files.
 * Source of truth: skills/{skill}/commands/{command}.md
 * Discovery location: ~/.claude/commands/
 *
 * Called automatically by git-push workflow (Step 1.5).
 */

import { existsSync, readdirSync, lstatSync, unlinkSync, symlinkSync, mkdirSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';

// Inline resolveFrameworkRoot to avoid @/ alias dependency
function resolveFrameworkRoot(): string {
  // Try to find framework root by traversing up from this script
  const scriptDir = join(__dirname, '..', '..', '..', '..');
  let current = scriptDir;

  // Walk up looking for .git directory (framework root)
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(current, '.git'))) {
      return current;
    }
    const parent = join(current, '..');
    if (parent === current) break;
    current = parent;
  }

  // Fallback to cwd
  return process.cwd();
}

interface SyncResult {
  success: boolean;
  created: string[];
  removed: string[];
  errors: string[];
}

/**
 * Collect command files from a directory containing subdirectories with commands folders.
 * Scans both skills and tools parent directories.
 */
function collectCommandsFromDir(parentDir: string, commands: Map<string, string>): void {
  if (!existsSync(parentDir)) return;

  const subDirs = readdirSync(parentDir, { withFileTypes: true })
    .filter(d => d.isDirectory());

  for (const subDir of subDirs) {
    const commandsDir = join(parentDir, subDir.name, 'commands');
    if (!existsSync(commandsDir)) continue;

    const cmdFiles = readdirSync(commandsDir)
      .filter(f => f.endsWith('.md') && f !== 'README.md');

    for (const cmdFile of cmdFiles) {
      commands.set(cmdFile, join(commandsDir, cmdFile));
    }
  }
}

/**
 * Collect all command files from skill and tool command directories.
 */
function collectSkillCommands(frameworkRoot: string): Map<string, string> {
  const commands = new Map<string, string>(); // filename -> absolute path

  collectCommandsFromDir(join(frameworkRoot, 'skills'), commands);
  collectCommandsFromDir(join(frameworkRoot, 'tools'), commands);

  return commands;
}

/**
 * Sync discovery symlinks from skill commands to ~/.claude/commands/
 */
export async function syncDiscoverySymlinks(): Promise<SyncResult> {
  const result: SyncResult = {
    success: true,
    created: [],
    removed: [],
    errors: []
  };

  const frameworkRoot = resolveFrameworkRoot();
  const discoveryCommandsDir = join(homedir(), '.claude', 'commands');

  // Ensure ~/.claude/commands/ exists
  if (!existsSync(discoveryCommandsDir)) {
    try {
      mkdirSync(discoveryCommandsDir, { recursive: true });
    } catch (error) {
      result.errors.push(`Failed to create ${discoveryCommandsDir}: ${error instanceof Error ? error.message : String(error)}`);
      result.success = false;
      return result;
    }
  }

  // Collect all commands from skills/*/commands/
  const skillCommands = collectSkillCommands(frameworkRoot);

  if (skillCommands.size === 0) {
    result.errors.push('No skill commands found');
    result.success = false;
    return result;
  }

  // Get existing discovery symlinks
  const discoveryCommands = readdirSync(discoveryCommandsDir)
    .filter(f => f.endsWith('.md'));

  // Create or update discovery symlinks
  for (const [cmdFile, sourcePath] of skillCommands) {
    const discoveryPath = join(discoveryCommandsDir, cmdFile);

    try {
      // Remove existing symlink if present
      if (existsSync(discoveryPath) || lstatSync(discoveryPath).isSymbolicLink()) {
        const stats = lstatSync(discoveryPath);
        if (stats.isSymbolicLink()) {
          unlinkSync(discoveryPath);
        } else {
          // Real file exists - don't overwrite
          result.errors.push(`Real file exists at ${discoveryPath}, skipping`);
          continue;
        }
      }
    } catch {
      // File doesn't exist - that's fine, we'll create the symlink
    }

    try {
      // Create symlink pointing to the skill command file
      symlinkSync(sourcePath, discoveryPath);
      result.created.push(cmdFile);
    } catch (error) {
      result.errors.push(`Failed to sync ${cmdFile}: ${error instanceof Error ? error.message : String(error)}`);
      result.success = false;
    }
  }

  // Remove orphaned discovery symlinks (commands that no longer exist in any skill)
  for (const cmdFile of discoveryCommands) {
    if (!skillCommands.has(cmdFile)) {
      const discoveryPath = join(discoveryCommandsDir, cmdFile);
      try {
        const stats = lstatSync(discoveryPath);
        if (stats.isSymbolicLink()) {
          unlinkSync(discoveryPath);
          result.removed.push(cmdFile);
        }
      } catch (error) {
        result.errors.push(`Failed to remove orphaned ${cmdFile}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  return result;
}

/**
 * Main execution
 */
async function main() {
  console.log('Syncing discovery symlinks...');

  const result = await syncDiscoverySymlinks();

  if (result.created.length > 0) {
    console.log(`Created ${result.created.length} discovery symlink(s)`);
  }

  if (result.removed.length > 0) {
    console.log(`Removed ${result.removed.length} orphaned symlink(s)`);
  }

  if (result.errors.length > 0) {
    console.error('\nErrors during sync:');
    result.errors.forEach(err => console.error(`  - ${err}`));
  }

  if (!result.success) {
    console.error('\nSymlink sync completed with errors');
    process.exit(1);
  }

  if (result.created.length === 0 && result.removed.length === 0) {
    console.log('All discovery symlinks already in sync');
  }

  console.log('');
  process.exit(0);
}

if (import.meta.main) {
  main();
}
