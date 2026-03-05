#!/usr/bin/env bun

/**
 * Bun Installer for IA Framework Installation
 *
 * Checks if Bun runtime is installed and installs it if missing
 * Uses the official Bun installation script
 *
 * @module bun-installer
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync } from 'fs';
import { join, dirname } from 'path';
import { homedir } from 'os';

export interface BunStatus {
  installed: boolean;
  version?: string;
  path?: string;
}

export interface InstallResult {
  success: boolean;
  action: 'already-installed' | 'installed' | 'failed';
  message: string;
  version?: string;
  error?: string;
}

/**
 * Check if Bun is installed
 * IMPROVED: Checks common install locations first, then updates PATH if needed
 */
export async function checkBun(): Promise<BunStatus> {
  // First, check common install locations (bun may be installed but not in PATH yet)
  const commonPaths = [
    join(homedir(), '.bun', 'bin', 'bun'),
    join('/usr', 'local', 'bin', 'bun'),
    join('/usr', 'bin', 'bun'),
    join('/opt', 'homebrew', 'bin', 'bun'),           // macOS Apple Silicon
    join('/home', 'linuxbrew', '.linuxbrew', 'bin', 'bun')  // Linux Homebrew
  ];

  let bunPath: string | undefined;

  // Check if bun exists in any common location
  for (const commonPath of commonPaths) {
    if (existsSync(commonPath)) {
      bunPath = commonPath;

      // Add to current process PATH if not already there
      const bunDir = dirname(commonPath);
      if (!process.env.PATH?.includes(bunDir)) {
        process.env.PATH = `${bunDir}:${process.env.PATH}`;
      }
      break;
    }
  }

  // Now try to run bun --version
  try {
    const version = execSync('bun --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();

    // Try to get canonical path
    let path: string | undefined = bunPath;
    try {
      path = execSync('which bun', { encoding: 'utf-8', stdio: 'pipe' }).trim();
    } catch {
      // Use the path we found earlier
      path = bunPath;
    }

    return {
      installed: true,
      version,
      path
    };
  } catch {
    // bun command didn't work, but if we found it in a common location, it's still installed
    // (just needs shell reload)
    if (bunPath) {
      try {
        // Try running directly with full path (execFileSync avoids shell injection)
        const version = execFileSync(bunPath, ['--version'], { encoding: 'utf-8', stdio: 'pipe' }).trim();
        return {
          installed: true,
          version,
          path: bunPath
        };
      } catch {
        // Binary exists but won't execute - corrupted installation?
        return {
          installed: false
        };
      }
    }

    return {
      installed: false
    };
  }
}

/**
 * Install Bun using official installation script
 */
export async function installBun(): Promise<InstallResult> {
  try {
    console.log('Installing Bun runtime...');
    console.log('');

    // Check if already installed
    let status = await checkBun();
    if (status.installed) {
      console.log('✓ Bun is already installed');
      console.log(`  Version: ${status.version}`);
      console.log(`  Path: ${status.path}`);

      return {
        success: true,
        action: 'already-installed',
        message: `Bun ${status.version} is already installed`,
        version: status.version
      };
    }

    // Install using official script
    console.log('Downloading and installing Bun...');
    console.log('This may take a few minutes...');
    console.log('');

    try {
      // Official Bun install command
      execSync('curl -fsSL https://bun.com/install | bash', {
        stdio: 'inherit',
        env: {
          ...process.env,
          BUN_INSTALL: join(homedir(), '.bun')
        }
      });

      console.log('');
      console.log('✓ Bun installation completed');
    } catch (error) {
      return {
        success: false,
        action: 'failed',
        message: 'Failed to download or install Bun',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Verify installation (checkBun now automatically updates PATH if needed)
    status = await checkBun();
    if (!status.installed) {
      // Installation succeeded but binary not accessible - something went wrong
      console.log('');
      console.log('⚠️  Bun installation completed, but binary is not accessible');
      console.log('');
      console.log('This usually means the shell configuration needs to be reloaded.');
      console.log('');
      console.log('Try one of these options:');
      console.log('');
      console.log('Option 1 (Recommended): Close and reopen your terminal');
      console.log('');
      console.log('Option 2: Reload shell configuration:');
      console.log('  # For bash:');
      console.log('  source ~/.bashrc');
      console.log('');
      console.log('  # For zsh:');
      console.log('  source ~/.zshrc');
      console.log('');
      console.log('  # For fish:');
      console.log('  source ~/.config/fish/config.fish');
      console.log('');
      console.log('Then run the framework setup again.');

      return {
        success: false,
        action: 'installed',
        message: 'Bun installed successfully - shell reload required before continuing',
        version: 'installed (reload shell required)'
      };
    }

    console.log('✓ Bun is now available');
    console.log(`  Version: ${status.version}`);
    console.log(`  Path: ${status.path}`);

    return {
      success: true,
      action: 'installed',
      message: `Bun ${status.version} installed successfully`,
      version: status.version
    };
  } catch (error) {
    return {
      success: false,
      action: 'failed',
      message: 'Unexpected error during Bun installation',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Format Bun status for display
 */
export function formatBunStatus(status: BunStatus): string {
  if (status.installed) {
    return `✓ Bun ${status.version} installed at ${status.path}`;
  } else {
    return `✗ Bun is not installed`;
  }
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  (async () => {
    try {
      console.log('=== Bun Runtime Installer ===');
      console.log('');

      // Check current status
      console.log('Checking Bun installation...');
      const status = await checkBun();
      console.log(formatBunStatus(status));
      console.log('');

      // Install if needed
      if (!status.installed) {
        const result = await installBun();

        if (!result.success) {
          console.error('');
          console.error('Installation failed:', result.message);
          if (result.error) {
            console.error('Error:', result.error);
          }
          process.exit(1);
        }

        console.log('');
        console.log('=== Installation Complete ===');
      } else {
        console.log('No installation needed.');
      }

      process.exit(0);
    } catch (error) {
      console.error('Bun installer failed:', error);
      process.exit(1);
    }
  })();
}
