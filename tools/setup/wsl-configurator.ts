#!/usr/bin/env bun

/**
 * WSL Configurator for IA Framework Installation
 *
 * Optimizes WSL2 configuration for framework usage:
 * - Fixes DNS resolution issues
 * - Configures memory and CPU allocation
 * - Warns about Windows filesystem usage
 * - Generates .wslconfig for optimal performance
 *
 * NOTE: This does NOT install WSL2 - user must complete Phase 0 first
 *
 * @module wsl-configurator
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { execSync, execFileSync } from 'child_process';
import { homedir, totalmem, cpus } from 'os';
import { join } from 'path';

export interface DiagnosticReport {
  dnsWorking: boolean;
  dnsMethod: 'resolv.conf' | 'systemd-resolved' | 'unknown';
  resolvConfIsSymlink: boolean;
  memoryAllocated?: string;
  cpuCores?: number;
  wslConfigExists: boolean;
  currentPath: string;
  inWindowsFilesystem: boolean;
  issues: string[];
  warnings: string[];
}

export interface FixResult {
  success: boolean;
  action: string;
  message: string;
  error?: string;
}

/**
 * Diagnose WSL2 configuration
 */
export async function diagnose(): Promise<DiagnosticReport> {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Check DNS resolution
  let dnsWorking = false;
  try {
    execSync('ping -c 1 -W 2 8.8.8.8', { stdio: 'pipe' });
    dnsWorking = true;
  } catch {
    issues.push('DNS resolution not working (cannot ping 8.8.8.8)');
  }

  // Check resolv.conf
  let resolvConfIsSymlink = false;
  let dnsMethod: DiagnosticReport['dnsMethod'] = 'unknown';

  try {
    const stats = execSync('stat -L /etc/resolv.conf', { encoding: 'utf-8' });
    resolvConfIsSymlink = stats.includes('symbolic link');

    if (existsSync('/etc/resolv.conf')) {
      const content = readFileSync('/etc/resolv.conf', 'utf-8');
      if (content.includes('systemd-resolved')) {
        dnsMethod = 'systemd-resolved';
      } else if (content.includes('nameserver')) {
        dnsMethod = 'resolv.conf';
      }
    }

    // If it's a symlink and DNS isn't working, that's the common issue
    if (resolvConfIsSymlink && !dnsWorking) {
      issues.push('/etc/resolv.conf is a symlink (common WSL DNS issue)');
    }
  } catch {
    warnings.push('Could not check /etc/resolv.conf status');
  }

  // Check current path
  const currentPath = process.cwd();
  const inWindowsFilesystem = currentPath.startsWith('/mnt/');

  if (inWindowsFilesystem) {
    warnings.push('Currently in Windows filesystem (/mnt/c/) - slow performance');
  }

  // Check .wslconfig
  let wslConfigExists = false;
  try {
    // .wslconfig lives in Windows user directory
    const windowsUsername = process.env.USER || process.env.USERNAME || 'unknown';
    const wslConfigPath = `/mnt/c/Users/${windowsUsername}/.wslconfig`;
    wslConfigExists = existsSync(wslConfigPath);

    if (!wslConfigExists) {
      warnings.push('.wslconfig not found - WSL2 using default resource limits');
    }
  } catch {
    // Ignore errors checking .wslconfig
  }

  return {
    dnsWorking,
    dnsMethod,
    resolvConfIsSymlink,
    wslConfigExists,
    currentPath,
    inWindowsFilesystem,
    issues,
    warnings
  };
}

/**
 * Fix DNS resolution (the most common WSL2 issue)
 */
export async function fixDNS(): Promise<FixResult> {
  try {
    console.log('Fixing DNS resolution...');

    // Step 1: Remove symlink
    try {
      execSync('sudo rm -f /etc/resolv.conf', { stdio: 'pipe' });
      console.log('✓ Removed /etc/resolv.conf symlink');
    } catch (error) {
      return {
        success: false,
        action: 'remove-symlink',
        message: 'Failed to remove /etc/resolv.conf',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Step 2: Create proper resolv.conf
    const resolvConf = `nameserver 8.8.8.8\nnameserver 8.8.4.4\n`;
    try {
      // Write to temp file and sudo move (avoids shell interpolation)
      const { writeFileSync } = require('fs');
      const tmpFile = '/tmp/resolv.conf.tmp';
      writeFileSync(tmpFile, resolvConf);
      execFileSync('sudo', ['cp', tmpFile, '/etc/resolv.conf'], { stdio: 'pipe' });
      execFileSync('rm', [tmpFile], { stdio: 'pipe' });
      console.log('✓ Created proper /etc/resolv.conf');
    } catch (error) {
      return {
        success: false,
        action: 'create-resolv-conf',
        message: 'Failed to create /etc/resolv.conf',
        error: error instanceof Error ? error.message : String(error)
      };
    }

    // Step 3: Make immutable
    try {
      execSync('sudo chattr +i /etc/resolv.conf', { stdio: 'pipe' });
      console.log('✓ Made /etc/resolv.conf immutable');
    } catch (error) {
      // chattr might not be available - warn but don't fail
      console.log('⚠ Could not make /etc/resolv.conf immutable (chattr not available)');
    }

    // Step 4: Test DNS
    try {
      execSync('ping -c 1 -W 2 google.com', { stdio: 'pipe' });
      console.log('✓ DNS is working (can reach google.com)');
    } catch {
      return {
        success: false,
        action: 'test-dns',
        message: 'DNS fix applied but still cannot resolve names',
        error: 'ping google.com failed'
      };
    }

    return {
      success: true,
      action: 'fix-dns',
      message: 'DNS resolution fixed successfully'
    };
  } catch (error) {
    return {
      success: false,
      action: 'fix-dns',
      message: 'Unexpected error during DNS fix',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Generate .wslconfig file for optimal performance
 * This file goes in C:\Users\USERNAME\.wslconfig (Windows side)
 */
export async function generateWSLConfig(): Promise<FixResult> {
  try {
    // Get system resources
    const totalMemory = totalmem();
    const totalCores = cpus().length;

    // Allocate 50% of resources (conservative)
    const memoryGB = Math.floor((totalMemory / 1024 / 1024 / 1024) * 0.5);
    const processors = Math.floor(totalCores * 0.5);

    // Generate .wslconfig content
    const wslConfig = `[wsl2]
memory=${memoryGB}GB
processors=${processors}
localhostForwarding=true

# Optimize performance
nestedVirtualization=true
swap=0

# Network settings
networkingMode=nat
`;

    // Determine Windows username and path
    const windowsUsername = process.env.USER || process.env.USERNAME || 'unknown';
    const wslConfigPath = `/mnt/c/Users/${windowsUsername}/.wslconfig`;

    // Check if .wslconfig already exists
    if (existsSync(wslConfigPath)) {
      console.log('⚠ .wslconfig already exists at:');
      console.log(`  ${wslConfigPath}`);
      console.log('');
      console.log('Recommended configuration:');
      console.log(wslConfig);
      console.log('');
      console.log('You can manually merge these settings if desired.');

      return {
        success: true,
        action: 'generate-wslconfig',
        message: '.wslconfig already exists - showing recommended config'
      };
    }

    // Write .wslconfig
    try {
      writeFileSync(wslConfigPath, wslConfig, 'utf-8');
      console.log('✓ Created .wslconfig at:');
      console.log(`  ${wslConfigPath}`);
      console.log('');
      console.log('Configuration:');
      console.log(`  Memory: ${memoryGB}GB (50% of ${Math.floor(totalMemory / 1024 / 1024 / 1024)}GB total)`);
      console.log(`  Processors: ${processors} cores (50% of ${totalCores} total)`);
      console.log('');
      console.log('⚠ WSL restart required for changes to take effect:');
      console.log('  Run in PowerShell: wsl --shutdown');
      console.log('  Then reopen Ubuntu');

      return {
        success: true,
        action: 'generate-wslconfig',
        message: `.wslconfig created successfully (${memoryGB}GB RAM, ${processors} cores)`
      };
    } catch (error) {
      return {
        success: false,
        action: 'generate-wslconfig',
        message: 'Failed to write .wslconfig',
        error: error instanceof Error ? error.message : String(error)
      };
    }
  } catch (error) {
    return {
      success: false,
      action: 'generate-wslconfig',
      message: 'Failed to generate .wslconfig',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Check terminal path and warn if in Windows filesystem
 */
export async function checkTerminalPath(): Promise<FixResult> {
  const cwd = process.cwd();

  if (cwd.startsWith('/mnt/')) {
    console.log('⚠ WARNING: You are in Windows filesystem');
    console.log(`  Current path: ${cwd}`);
    console.log('');
    console.log('This is SLOW and not recommended for development.');
    console.log('');
    console.log('Move to Linux home directory:');
    console.log('  cd ~');
    console.log('  pwd  # Should show /home/username');
    console.log('');
    console.log('Configure Windows Terminal to start in Linux home:');
    console.log('  Settings → Ubuntu profile → Starting directory');
    console.log('  Set to: //wsl.localhost/Ubuntu/home/%USERNAME%');

    return {
      success: false,
      action: 'check-terminal-path',
      message: 'Currently in Windows filesystem - move to Linux home'
    };
  }

  console.log('✓ Terminal path is optimal (Linux filesystem)');
  console.log(`  Current path: ${cwd}`);

  return {
    success: true,
    action: 'check-terminal-path',
    message: 'Terminal path is optimal'
  };
}

/**
 * Run full WSL configuration optimization
 */
export async function configureWSL(): Promise<{
  diagnostics: DiagnosticReport;
  fixes: FixResult[];
}> {
  console.log('=== WSL2 Configuration Optimizer ===');
  console.log('');

  // Step 1: Diagnose
  console.log('Step 1: Diagnosing current configuration...');
  const diagnostics = await diagnose();

  console.log('');
  console.log('Diagnostic Results:');
  console.log(`  DNS: ${diagnostics.dnsWorking ? '✓ Working' : '✗ Not working'}`);
  console.log(`  .wslconfig: ${diagnostics.wslConfigExists ? '✓ Exists' : '✗ Not found'}`);
  console.log(`  Current path: ${diagnostics.currentPath}`);
  console.log(`  In Windows filesystem: ${diagnostics.inWindowsFilesystem ? 'Yes (⚠ slow)' : 'No (✓ optimal)'}`);

  if (diagnostics.issues.length > 0) {
    console.log('');
    console.log('Issues found:');
    diagnostics.issues.forEach(issue => console.log(`  • ${issue}`));
  }

  if (diagnostics.warnings.length > 0) {
    console.log('');
    console.log('Warnings:');
    diagnostics.warnings.forEach(warning => console.log(`  • ${warning}`));
  }

  console.log('');

  // Step 2: Apply fixes
  const fixes: FixResult[] = [];

  // Fix DNS if needed
  if (!diagnostics.dnsWorking) {
    console.log('Step 2: Fixing DNS resolution...');
    const dnsFixResult = await fixDNS();
    fixes.push(dnsFixResult);
    console.log('');
  }

  // Generate .wslconfig if needed
  if (!diagnostics.wslConfigExists) {
    console.log('Step 3: Generating .wslconfig for optimal performance...');
    const wslConfigResult = await generateWSLConfig();
    fixes.push(wslConfigResult);
    console.log('');
  }

  // Check terminal path
  console.log('Step 4: Checking terminal path...');
  const pathCheckResult = await checkTerminalPath();
  fixes.push(pathCheckResult);
  console.log('');

  // Summary
  console.log('=== Configuration Complete ===');
  const successCount = fixes.filter(f => f.success).length;
  console.log(`Applied ${successCount}/${fixes.length} optimizations`);

  return { diagnostics, fixes };
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  (async () => {
    try {
      const result = await configureWSL();

      // Exit with error if any critical fixes failed
      const criticalFailed = result.fixes.some(
        f => !f.success && (f.action === 'fix-dns' || f.action === 'check-terminal-path')
      );

      process.exit(criticalFailed ? 1 : 0);
    } catch (error) {
      console.error('WSL configuration failed:', error);
      process.exit(1);
    }
  })();
}
