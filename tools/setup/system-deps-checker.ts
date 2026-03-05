#!/usr/bin/env bun

/**
 * System Dependencies Checker
 *
 * Checks for system-level dependencies required by framework features:
 * - Chrome/Puppeteer dependencies for PDF export
 * - Quarto CLI for document rendering
 * - Other native libraries
 *
 * Only runs on Linux/WSL where these are typically missing.
 */

import { execSync } from 'child_process';
import { platform } from 'os';
import { existsSync } from 'fs';

export interface DependencyCheckResult {
  allPresent: boolean;
  missing: string[];
  installed: string[];
}

export interface InstallResult {
  success: boolean;
  message: string;
  installed: string[];
  failed: string[];
}

// Chrome/Puppeteer dependencies for Linux
// Note: Ubuntu 24.04+ uses t64 suffixes for many libraries
const CHROME_DEPENDENCIES = [
  'libssl3',
  'libnss3',
  'libnspr4',
  'libatk1.0-0',
  'libatk-bridge2.0-0',
  'libcups2',
  'libdrm2',
  'libxkbcommon0',
  'libxcomposite1',
  'libxdamage1',
  'libxfixes3',
  'libxrandr2',
  'libgbm1',
  'libasound2'
];

// Package mappings for Ubuntu 24.04+ (t64 transition)
const PACKAGE_MAPPINGS: Record<string, string[]> = {
  'libssl3': ['libssl3t64', 'libssl3'],
  'libatk1.0-0': ['libatk1.0-0t64', 'libatk1.0-0'],
  'libatk-bridge2.0-0': ['libatk-bridge2.0-0t64', 'libatk-bridge2.0-0'],
  'libcups2': ['libcups2t64', 'libcups2'],
  'libasound2': ['libasound2t64', 'libasound2']
};

/**
 * Check if running on Linux (including WSL)
 */
function isLinux(): boolean {
  return platform() === 'linux';
}

/**
 * Check if a package is installed using dpkg
 *
 * Note: Validates package name format before interpolation to prevent
 * command injection attacks. Package names must be alphanumeric with
 * hyphens, dots, and plus signs only.
 */
function isPackageInstalled(packageName: string): boolean {
  try {
    // Validate package name format (alphanumeric, hyphens, dots, plus only)
    if (!/^[a-zA-Z0-9.\-+]+$/.test(packageName)) {
      return false;
    }

    const result = execSync(`dpkg -s ${packageName}`, {
      stdio: 'pipe',
      encoding: 'utf-8'
    });

    return result.includes('Status: install ok installed');
  } catch {
    return false;
  }
}

/**
 * Check if apt-get is available
 */
function hasApt(): boolean {
  try {
    execSync('which apt-get', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Find the correct package name (handles Ubuntu 24.04 t64 transition)
 */
function resolvePackageName(packageName: string): string | null {
  const variants = PACKAGE_MAPPINGS[packageName] || [packageName];

  for (const variant of variants) {
    if (isPackageInstalled(variant)) {
      return variant;
    }
  }

  // None installed, return first available variant (prefer t64 for Ubuntu 24.04)
  return variants[0];
}

/**
 * Check if any variant of a package is installed
 */
function isAnyVariantInstalled(packageName: string): boolean {
  const variants = PACKAGE_MAPPINGS[packageName] || [packageName];
  return variants.some(variant => isPackageInstalled(variant));
}

/**
 * Check for system dependencies
 */
export async function checkSystemDependencies(): Promise<DependencyCheckResult> {
  // Only check on Linux
  if (!isLinux()) {
    return {
      allPresent: true,
      missing: [],
      installed: []
    };
  }

  // Only check if apt is available (Debian/Ubuntu)
  if (!hasApt()) {
    return {
      allPresent: true,
      missing: [],
      installed: []
    };
  }

  const missing: string[] = [];
  const installed: string[] = [];

  for (const dep of CHROME_DEPENDENCIES) {
    if (isAnyVariantInstalled(dep)) {
      const resolvedName = resolvePackageName(dep);
      if (resolvedName) {
        installed.push(resolvedName);
      }
    } else {
      const resolvedName = resolvePackageName(dep);
      if (resolvedName) {
        missing.push(resolvedName);
      }
    }
  }

  return {
    allPresent: missing.length === 0,
    missing,
    installed
  };
}

/**
 * Install missing system dependencies
 */
export async function installSystemDependencies(missing: string[]): Promise<InstallResult> {
  if (missing.length === 0) {
    return {
      success: true,
      message: 'No dependencies to install',
      installed: [],
      failed: []
    };
  }

  // Check if we have sudo access
  let hasSudo = false;
  try {
    execSync('sudo -n true 2>/dev/null', { stdio: 'pipe' });
    hasSudo = true;
  } catch {
    // No passwordless sudo, will need to prompt
    hasSudo = false;
  }

  const installed: string[] = [];
  const failed: string[] = [];

  try {
    console.log('');
    console.log('Installing Chrome/Puppeteer dependencies...');
    console.log('(This may require your password)');
    console.log('');

    // Update package list first
    execSync('sudo apt-get update -qq', { stdio: 'inherit' });

    // Install all missing packages at once
    const packages = missing.join(' ');
    execSync(`sudo apt-get install -y ${packages}`, { stdio: 'inherit' });

    // Verify installation
    for (const pkg of missing) {
      if (isPackageInstalled(pkg)) {
        installed.push(pkg);
      } else {
        failed.push(pkg);
      }
    }

    if (failed.length === 0) {
      return {
        success: true,
        message: `Installed ${installed.length} system dependencies`,
        installed,
        failed
      };
    } else {
      return {
        success: false,
        message: `Installed ${installed.length}, failed ${failed.length}`,
        installed,
        failed
      };
    }

  } catch (error) {
    return {
      success: false,
      message: `Installation failed: ${error instanceof Error ? error.message : String(error)}`,
      installed,
      failed: missing
    };
  }
}

/**
 * Get the apt-get command to install missing dependencies
 */
export function getInstallCommand(missing: string[]): string {
  if (missing.length === 0) {
    return '';
  }
  return `sudo apt-get update && sudo apt-get install -y ${missing.join(' ')}`;
}

// =============================================================================
// Quarto CLI Check & Install
// =============================================================================

const QUARTO_BIN = "/opt/quarto/bin/quarto";

/**
 * Check if Quarto is installed
 */
export function isQuartoInstalled(): boolean {
  return existsSync(QUARTO_BIN);
}

/**
 * Get installed Quarto version
 */
export function getQuartoVersion(): string | null {
  if (!isQuartoInstalled()) return null;
  
  try {
    const result = execSync(`${QUARTO_BIN} --version`, { 
      shell: true,
      stdio: "pipe", 
      encoding: "utf-8",
    });
    if (result && result.trim()) {
      return result.trim();
    }
  } catch {
    // Ignore
  }
  return null;
}

/**
 * Check Quarto installation status
 */
export async function checkQuarto(): Promise<{ installed: boolean; version: string | null }> {
  const installed = isQuartoInstalled();
  return {
    installed,
    version: installed ? getQuartoVersion() : null,
  };
}
