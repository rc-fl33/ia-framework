#!/usr/bin/env bun

/**
 * Platform Detection for IA Framework Installation
 *
 * Detects OS, WSL version, package manager, shell, and environment details
 * Used by framework installer to make platform-specific decisions
 *
 * @module platform-detector
 */

import { existsSync, readFileSync, readlinkSync, realpathSync } from 'fs';
import { execSync, execFileSync } from 'child_process';
import { homedir, platform, arch } from 'os';
import { join, dirname } from 'path';

export interface PlatformInfo {
  os: 'windows' | 'linux' | 'macos';
  inWSL: boolean;
  wslVersion?: '1' | '2';
  wslDistro?: string;
  packageManager: 'apt' | 'brew' | 'yum' | 'pacman' | 'dnf' | 'unknown';
  shell: 'bash' | 'zsh' | 'fish' | 'powershell' | 'unknown';
  homeDir: string;
  frameworkPath: string;
  inWindowsPath: boolean;
  architecture: string;
  kernelVersion?: string;
}

/**
 * Detect if running in WSL
 */
function detectWSL(): { inWSL: boolean; version?: '1' | '2'; distro?: string } {
  try {
    // Method 1: Check /proc/version for "microsoft"
    if (existsSync('/proc/version')) {
      const procVersion = readFileSync('/proc/version', 'utf-8').toLowerCase();
      const isWSL = procVersion.includes('microsoft');

      if (isWSL) {
        // Determine WSL version
        const isWSL2 = procVersion.includes('wsl2') || procVersion.includes('microsoft-standard');

        // Get distro name from environment or /etc/os-release
        let distro = process.env.WSL_DISTRO_NAME;

        if (!distro && existsSync('/etc/os-release')) {
          const osRelease = readFileSync('/etc/os-release', 'utf-8');
          const nameMatch = osRelease.match(/^NAME="?([^"\n]+)"?/m);
          distro = nameMatch ? nameMatch[1] : undefined;
        }

        return {
          inWSL: true,
          version: isWSL2 ? '2' : '1',
          distro
        };
      }
    }

    // Method 2: Check environment variable
    if (process.env.WSL_DISTRO_NAME) {
      return {
        inWSL: true,
        version: '2', // Assume WSL2 if env var exists
        distro: process.env.WSL_DISTRO_NAME
      };
    }

    return { inWSL: false };
  } catch (error) {
    return { inWSL: false };
  }
}

/**
 * Detect package manager
 */
function detectPackageManager(): PlatformInfo['packageManager'] {
  const managers = [
    { name: 'apt', command: 'apt --version' },
    { name: 'brew', command: 'brew --version' },
    { name: 'yum', command: 'yum --version' },
    { name: 'dnf', command: 'dnf --version' },
    { name: 'pacman', command: 'pacman --version' }
  ] as const;

  for (const manager of managers) {
    try {
      execFileSync(manager.name, ['--version'], { stdio: 'pipe' });
      return manager.name as PlatformInfo['packageManager'];
    } catch {
      continue;
    }
  }

  return 'unknown';
}

/**
 * Detect current shell
 */
function detectShell(): PlatformInfo['shell'] {
  try {
    // Method 1: Check SHELL environment variable
    const shellEnv = process.env.SHELL;
    if (shellEnv) {
      if (shellEnv.includes('bash')) return 'bash';
      if (shellEnv.includes('zsh')) return 'zsh';
      if (shellEnv.includes('fish')) return 'fish';
      if (shellEnv.includes('powershell') || shellEnv.includes('pwsh')) return 'powershell';
    }

    // Method 2: Check process
    const shell = execSync('ps -p $$ -o comm=', { encoding: 'utf-8' }).trim();
    if (shell.includes('bash')) return 'bash';
    if (shell.includes('zsh')) return 'zsh';
    if (shell.includes('fish')) return 'fish';
    if (shell.includes('powershell') || shell.includes('pwsh')) return 'powershell';

    return 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Check if current working directory is in Windows filesystem (for WSL)
 */
function isInWindowsPath(): boolean {
  try {
    const cwd = process.cwd();

    // Check if in /mnt/c/ or similar Windows mount
    if (cwd.startsWith('/mnt/')) {
      return true;
    }

    // Check if in /c/ or /d/ (some WSL configurations)
    if (/^\/[a-z]\//i.test(cwd)) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Get kernel version (useful for diagnosing WSL issues)
 */
function getKernelVersion(): string | undefined {
  try {
    const version = execSync('uname -r', { encoding: 'utf-8' }).trim();
    return version;
  } catch {
    return undefined;
  }
}

/**
 * Detect framework path using multiple strategies
 * Priority: 1. Current directory (if CLAUDE.md exists) 2. IA_FRAMEWORK_ROOT env var 3. Resolve symlink 4. ~/.claude fallback
 */
function detectFrameworkPath(): string {
  const home = homedir();
  const cwd = process.cwd();

  // Strategy 1: Current working directory (user ran claude from framework dir)
  if (existsSync(join(cwd, 'CLAUDE.md')) && existsSync(join(cwd, 'commands'))) {
    return cwd;
  }

  // Strategy 2: Environment variable (explicit configuration)
  if (process.env.IA_FRAMEWORK_ROOT) {
    const envPath = process.env.IA_FRAMEWORK_ROOT;
    if (existsSync(envPath)) {
      return envPath;
    }
  }

  // Strategy 3: Resolve symlink at ~/.claude/CLAUDE.md
  const claudeDir = join(home, '.claude');
  const claudeMdPath = join(claudeDir, 'CLAUDE.md');

  try {
    if (existsSync(claudeMdPath)) {
      const realPath = realpathSync(claudeMdPath);
      // If it's a symlink, get the directory containing the real CLAUDE.md
      if (realPath !== claudeMdPath) {
        return dirname(realPath);
      }
    }
  } catch {
    // Fall through to default
  }

  // Strategy 4: Default ~/.claude (backward compatibility)
  return claudeDir;
}

/**
 * Main platform detection function
 */
export async function detectPlatform(): Promise<PlatformInfo> {
  const nodePlatform = platform();
  const wslInfo = detectWSL();

  // Determine OS
  let os: PlatformInfo['os'];
  if (wslInfo.inWSL) {
    os = 'windows'; // Running in WSL = Windows user
  } else if (nodePlatform === 'darwin') {
    os = 'macos';
  } else if (nodePlatform === 'linux') {
    os = 'linux';
  } else if (nodePlatform === 'win32') {
    os = 'windows';
  } else {
    os = 'linux'; // Default fallback
  }

  // Get framework path using detection strategies
  const home = homedir();
  const frameworkPath = detectFrameworkPath();

  return {
    os,
    inWSL: wslInfo.inWSL,
    wslVersion: wslInfo.version,
    wslDistro: wslInfo.distro,
    packageManager: detectPackageManager(),
    shell: detectShell(),
    homeDir: home,
    frameworkPath,
    inWindowsPath: wslInfo.inWSL ? isInWindowsPath() : false,
    architecture: arch(),
    kernelVersion: wslInfo.inWSL ? getKernelVersion() : undefined
  };
}

/**
 * Format platform info for display
 */
export function formatPlatformInfo(info: PlatformInfo): string {
  const lines: string[] = [];

  lines.push('Platform Detection Results:');
  lines.push('');

  // OS and Environment
  lines.push(`OS: ${info.os}`);
  if (info.inWSL) {
    lines.push(`WSL: Version ${info.wslVersion} (${info.wslDistro || 'Unknown distro'})`);
    if (info.kernelVersion) {
      lines.push(`Kernel: ${info.kernelVersion}`);
    }
  }
  lines.push(`Architecture: ${info.architecture}`);

  // Shell and Package Manager
  lines.push('');
  lines.push(`Shell: ${info.shell}`);
  lines.push(`Package Manager: ${info.packageManager}`);

  // Paths
  lines.push('');
  lines.push(`Home Directory: ${info.homeDir}`);
  lines.push(`Framework Path: ${info.frameworkPath}`);
  lines.push(`Current Directory: ${process.cwd()}`);

  // Warnings
  if (info.inWindowsPath) {
    lines.push('');
    lines.push('⚠️  WARNING: You are in Windows filesystem (/mnt/c/)');
    lines.push('   This is SLOW and not recommended for development.');
    lines.push('   Move to Linux home directory: cd ~');
  }

  if (info.inWSL && info.wslVersion === '1') {
    lines.push('');
    lines.push('⚠️  WARNING: WSL version 1 detected');
    lines.push('   WSL2 is recommended for better performance.');
    lines.push('   Upgrade with: wsl --set-version <distro> 2');
  }

  return lines.join('\n');
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  (async () => {
    try {
      const platform = await detectPlatform();
      console.log(formatPlatformInfo(platform));

      // Exit with appropriate code
      if (platform.inWindowsPath || (platform.inWSL && platform.wslVersion === '1')) {
        process.exit(1); // Warning conditions present
      }
      process.exit(0);
    } catch (error) {
      console.error('Platform detection failed:', error);
      process.exit(1);
    }
  })();
}
