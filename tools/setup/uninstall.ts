#!/usr/bin/env bun

/**
 * IA Framework Uninstaller
 *
 * Cleanly removes the IA Framework while preserving Claude Code's files.
 * Uses symlink architecture - only removes symlinks from ~/.claude/
 *
 * Usage:
 *   bun run tools/setup/uninstall.ts           # Remove symlinks only
 *   bun run tools/setup/uninstall.ts --full    # Remove symlinks AND framework directory
 *
 * @module uninstall
 */

import { existsSync, lstatSync, unlinkSync, rmSync, realpathSync } from 'fs';
import { homedir } from 'os';
import { join, dirname } from 'path';
import * as readline from 'readline';

interface UninstallResult {
  success: boolean;
  removedSymlinks: string[];
  removedFramework: boolean;
  errors: string[];
}

/**
 * Prompt user for confirmation
 */
async function confirm(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(`${message} (y/N): `, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Check if path is a symlink
 */
function isSymlink(path: string): boolean {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

/**
 * Detect framework path from symlink or environment
 */
function detectFrameworkPath(): string | null {
  // Check environment variable
  if (process.env.IA_FRAMEWORK_ROOT && existsSync(process.env.IA_FRAMEWORK_ROOT)) {
    return process.env.IA_FRAMEWORK_ROOT;
  }

  // Try to resolve from symlink
  const claudeDir = join(homedir(), '.claude');
  const claudeMdPath = join(claudeDir, 'CLAUDE.md');

  try {
    if (isSymlink(claudeMdPath)) {
      const realPath = realpathSync(claudeMdPath);
      return dirname(realPath);
    }
  } catch {
    // Fall through
  }

  return null;
}

/**
 * Remove symlinks from ~/.claude/
 */
function removeSymlinks(): { removed: string[]; errors: string[] } {
  const claudeDir = join(homedir(), '.claude');
  const removed: string[] = [];
  const errors: string[] = [];

  const symlinks = [
    join(claudeDir, 'CLAUDE.md'),
    join(claudeDir, 'settings.json'),
    join(claudeDir, 'commands')
  ];

  for (const symlink of symlinks) {
    try {
      if (isSymlink(symlink)) {
        unlinkSync(symlink);
        removed.push(symlink);
        console.log(`  Removed: ${symlink}`);
      } else if (existsSync(symlink)) {
        console.log(`  Skipped: ${symlink} (not a symlink)`);
      } else {
        console.log(`  Skipped: ${symlink} (does not exist)`);
      }
    } catch (error) {
      const msg = `Failed to remove ${symlink}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(msg);
      console.log(`  Error: ${msg}`);
    }
  }

  return { removed, errors };
}

/**
 * Remove framework directory
 */
function removeFrameworkDirectory(frameworkPath: string): { success: boolean; error?: string } {
  try {
    if (!existsSync(frameworkPath)) {
      return { success: true };
    }

    rmSync(frameworkPath, { recursive: true, force: true });
    console.log(`  Removed: ${frameworkPath}`);
    return { success: true };
  } catch (error) {
    const msg = `Failed to remove ${frameworkPath}: ${error instanceof Error ? error.message : String(error)}`;
    return { success: false, error: msg };
  }
}

/**
 * Main uninstall function
 */
async function uninstall(fullRemoval: boolean): Promise<UninstallResult> {
  const result: UninstallResult = {
    success: true,
    removedSymlinks: [],
    removedFramework: false,
    errors: []
  };

  console.log('');
  console.log('=== IA Framework Uninstaller ===');
  console.log('');

  // Detect framework location
  const frameworkPath = detectFrameworkPath();

  if (frameworkPath) {
    console.log(`Framework detected at: ${frameworkPath}`);
  } else {
    console.log('Framework location could not be detected.');
    console.log('Symlinks may already be removed or framework was installed differently.');
  }
  console.log('');

  // Confirm uninstall
  console.log('This will:');
  console.log('  1. Remove symlinks from ~/.claude/ (CLAUDE.md, settings.json, commands)');
  if (fullRemoval && frameworkPath) {
    console.log(`  2. Delete the framework directory: ${frameworkPath}`);
    console.log('');
    console.log('WARNING: --full removal will DELETE ALL FRAMEWORK FILES including:');
    console.log('  - Custom skills and configurations');
    console.log('  - .env file with API keys');
    console.log('  - Any uncommitted changes');
  }
  console.log('');
  console.log('Claude Code files will be PRESERVED (projects/, todos/, etc.)');
  console.log('');

  const confirmed = await confirm('Continue with uninstall?');

  if (!confirmed) {
    console.log('');
    console.log('Uninstall cancelled.');
    return { ...result, success: false };
  }

  console.log('');

  // Step 1: Remove symlinks
  console.log('Step 1: Removing symlinks from ~/.claude/...');
  const symlinkResult = removeSymlinks();
  result.removedSymlinks = symlinkResult.removed;
  result.errors.push(...symlinkResult.errors);

  // Step 2: Remove framework directory (if --full)
  if (fullRemoval && frameworkPath) {
    console.log('');
    console.log('Step 2: Removing framework directory...');

    const secondConfirm = await confirm(`Permanently delete ${frameworkPath}?`);

    if (secondConfirm) {
      const dirResult = removeFrameworkDirectory(frameworkPath);
      result.removedFramework = dirResult.success;
      if (dirResult.error) {
        result.errors.push(dirResult.error);
      }
    } else {
      console.log('  Skipped framework directory removal.');
    }
  }

  // Summary
  console.log('');
  console.log('=== Uninstall Summary ===');
  console.log('');

  if (result.removedSymlinks.length > 0) {
    console.log(`Symlinks removed: ${result.removedSymlinks.length}`);
  }

  if (result.removedFramework) {
    console.log('Framework directory removed');
  }

  if (result.errors.length > 0) {
    console.log('');
    console.log('Errors:');
    result.errors.forEach(err => console.log(`  - ${err}`));
    result.success = false;
  }

  console.log('');
  if (result.success) {
    console.log('IA Framework uninstalled successfully.');
    console.log('Claude Code files have been preserved.');
  } else {
    console.log('Uninstall completed with errors.');
  }

  return result;
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  const args = process.argv.slice(2);
  const fullRemoval = args.includes('--full');

  uninstall(fullRemoval)
    .then((result) => {
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('Uninstall failed:', error);
      process.exit(1);
    });
}
