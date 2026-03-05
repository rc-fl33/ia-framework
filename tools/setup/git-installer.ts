#!/usr/bin/env bun

/**
 * Git Installer and Configurator for IA Framework Installation
 *
 * Checks if Git is installed, installs if missing, and configures
 * with proper settings (especially line endings for WSL)
 *
 * @module git-installer
 */

import { execSync } from 'child_process';
import type { PlatformInfo } from '../platform-detector';

export interface GitStatus {
  installed: boolean;
  version?: string;
  path?: string;
  configured: {
    userName?: string;
    userEmail?: string;
    coreAutocrlf?: string;
    coreEol?: string;
  };
}

export interface InstallResult {
  success: boolean;
  action: 'already-installed' | 'installed' | 'configured' | 'failed';
  message: string;
  version?: string;
  error?: string;
}

/**
 * Check if Git is installed and get configuration
 */
export async function checkGit(): Promise<GitStatus> {
  try {
    // Check if git is available
    const version = execSync('git --version', { encoding: 'utf-8', stdio: 'pipe' }).trim();

    // Get git path
    let path: string | undefined;
    try {
      path = execSync('which git', { encoding: 'utf-8', stdio: 'pipe' }).trim();
    } catch {
      path = undefined;
    }

    // Get git configuration
    const configured: GitStatus['configured'] = {};

    try {
      configured.userName = execSync('git config --global user.name', {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).trim();
    } catch {
      // Not configured
    }

    try {
      configured.userEmail = execSync('git config --global user.email', {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).trim();
    } catch {
      // Not configured
    }

    try {
      configured.coreAutocrlf = execSync('git config --global core.autocrlf', {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).trim();
    } catch {
      // Not configured
    }

    try {
      configured.coreEol = execSync('git config --global core.eol', {
        encoding: 'utf-8',
        stdio: 'pipe'
      }).trim();
    } catch {
      // Not configured
    }

    return {
      installed: true,
      version,
      path,
      configured
    };
  } catch {
    return {
      installed: false,
      configured: {}
    };
  }
}

/**
 * Install Git using package manager
 */
export async function installGit(
  packageManager: PlatformInfo['packageManager']
): Promise<InstallResult> {
  try {
    console.log('Installing Git...');
    console.log('');

    // Check if already installed
    const status = await checkGit();
    if (status.installed) {
      console.log('✓ Git is already installed');
      console.log(`  Version: ${status.version}`);
      console.log(`  Path: ${status.path}`);

      return {
        success: true,
        action: 'already-installed',
        message: `Git ${status.version} is already installed`,
        version: status.version
      };
    }

    // Install based on package manager
    console.log(`Installing Git using ${packageManager}...`);

    try {
      switch (packageManager) {
        case 'apt':
          execSync('sudo apt update && sudo apt install -y git', { stdio: 'inherit' });
          break;

        case 'brew':
          execSync('brew install git', { stdio: 'inherit' });
          break;

        case 'yum':
          execSync('sudo yum install -y git', { stdio: 'inherit' });
          break;

        case 'dnf':
          execSync('sudo dnf install -y git', { stdio: 'inherit' });
          break;

        case 'pacman':
          execSync('sudo pacman -S --noconfirm git', { stdio: 'inherit' });
          break;

        default:
          return {
            success: false,
            action: 'failed',
            message: `Unknown package manager: ${packageManager}`,
            error: 'Cannot determine how to install Git'
          };
      }
    } catch (error) {
      return {
        success: false,
        action: 'failed',
        message: 'Failed to install Git',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Verify installation
    const newStatus = await checkGit();
    if (!newStatus.installed) {
      return {
        success: false,
        action: 'failed',
        message: 'Git installation completed but git is not available',
        error: 'git command not found after installation'
      };
    }

    console.log('');
    console.log('✓ Git installed successfully');
    console.log(`  Version: ${newStatus.version}`);
    console.log(`  Path: ${newStatus.path}`);

    return {
      success: true,
      action: 'installed',
      message: `Git ${newStatus.version} installed successfully`,
      version: newStatus.version
    };
  } catch (error) {
    return {
      success: false,
      action: 'failed',
      message: 'Unexpected error during Git installation',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Configure Git with proper settings (especially for WSL)
 */
export async function configureGit(inWSL: boolean): Promise<InstallResult> {
  try {
    console.log('Configuring Git...');
    console.log('');

    const status = await checkGit();
    if (!status.installed) {
      return {
        success: false,
        action: 'failed',
        message: 'Git is not installed - cannot configure'
      };
    }

    const configChanges: string[] = [];

    // Configure line endings (especially important for WSL)
    if (inWSL) {
      // For WSL: Use LF line endings, convert CRLF to LF on commit
      if (status.configured.coreAutocrlf !== 'input') {
        execSync('git config --global core.autocrlf input', { stdio: 'pipe' });
        configChanges.push('core.autocrlf = input (convert CRLF to LF on commit)');
      }

      if (status.configured.coreEol !== 'lf') {
        execSync('git config --global core.eol lf', { stdio: 'pipe' });
        configChanges.push('core.eol = lf (use LF line endings)');
      }
    } else {
      // For native macOS/Linux: Same settings
      if (status.configured.coreAutocrlf !== 'input') {
        execSync('git config --global core.autocrlf input', { stdio: 'pipe' });
        configChanges.push('core.autocrlf = input');
      }

      if (status.configured.coreEol !== 'lf') {
        execSync('git config --global core.eol lf', { stdio: 'pipe' });
        configChanges.push('core.eol = lf');
      }
    }

    // Check user configuration (don't set if already configured)
    const needsUserConfig = !status.configured.userName || !status.configured.userEmail;

    if (configChanges.length === 0 && !needsUserConfig) {
      console.log('✓ Git is already configured correctly');
      return {
        success: true,
        action: 'configured',
        message: 'Git configuration is correct'
      };
    }

    // Show what was configured
    if (configChanges.length > 0) {
      console.log('Applied configuration:');
      configChanges.forEach(change => console.log(`  • ${change}`));
      console.log('');
    }

    // Prompt for user configuration if needed
    if (needsUserConfig) {
      console.log('⚠ Git user configuration not set');
      console.log('');
      console.log('Please configure your Git identity:');
      console.log('  git config --global user.name "Your Name"');
      console.log('  git config --global user.email "your.email@example.com"');
      console.log('');
      console.log('This is required for committing changes.');
    }

    return {
      success: true,
      action: 'configured',
      message: `Git configured successfully (${configChanges.length} settings updated)`
    };
  } catch (error) {
    return {
      success: false,
      action: 'failed',
      message: 'Failed to configure Git',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Format Git status for display
 */
export function formatGitStatus(status: GitStatus): string {
  const lines: string[] = [];

  if (status.installed) {
    lines.push(`✓ Git ${status.version} installed at ${status.path}`);

    lines.push('');
    lines.push('Configuration:');
    lines.push(`  user.name: ${status.configured.userName || 'not set'}`);
    lines.push(`  user.email: ${status.configured.userEmail || 'not set'}`);
    lines.push(`  core.autocrlf: ${status.configured.coreAutocrlf || 'not set'}`);
    lines.push(`  core.eol: ${status.configured.coreEol || 'not set'}`);
  } else {
    lines.push('✗ Git is not installed');
  }

  return lines.join('\n');
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  (async () => {
    try {
      console.log('=== Git Installer and Configurator ===');
      console.log('');

      // Check current status
      console.log('Checking Git installation...');
      const status = await checkGit();
      console.log(formatGitStatus(status));
      console.log('');

      // Install if needed (requires package manager parameter)
      if (!status.installed) {
        console.error('Git is not installed.');
        console.error('Run this script via the framework installer which will auto-detect your package manager.');
        process.exit(1);
      }

      // Configure Git
      console.log('Checking Git configuration...');
      const inWSL = process.env.WSL_DISTRO_NAME !== undefined;
      const configResult = await configureGit(inWSL);

      if (!configResult.success) {
        console.error('');
        console.error('Configuration failed:', configResult.message);
        if (configResult.error) {
          console.error('Error:', configResult.error);
        }
        process.exit(1);
      }

      console.log('');
      console.log('=== Git Setup Complete ===');
      process.exit(0);
    } catch (error) {
      console.error('Git installer failed:', error);
      process.exit(1);
    }
  })();
}
