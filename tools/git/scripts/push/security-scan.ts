#!/usr/bin/env bun
/**
 * Security File Scan Script
 *
 * Scans for sensitive files by name pattern before staging.
 * This catches files that might contain credentials based on their names,
 * beyond just scanning content for credential patterns.
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import { join, basename } from 'path';

interface SecurityScanResult {
  success: boolean;
  alerts: SecurityAlert[];
  hasAlerts: boolean;
}

interface SecurityAlert {
  file: string;
  reason: string;
  severity: 'high' | 'medium' | 'low';
}

// Sensitive file name patterns
const SENSITIVE_NAME_PATTERNS = [
  'twingate',
  'token',
  'secret',
  'credential',
  'password',
  'private',
  'apikey',
  'api_key',
  'api-key',
  'auth',
  '.pem',
  '.key',
  '.p12',
  '.pfx'
];

// Files that are allowed even if they match patterns
const ALLOWED_FILES = [
  '.credentials.json',  // Template file
  '.env.example',
  'CREDENTIAL-HANDLING-ENFORCEMENT.md',
  'credential-scan.ts'  // This script
];

// Directories to skip
const SKIP_DIRS = [
  'node_modules',
  '.git',
  'archive',
  'docs',  // Documentation about credentials is OK
  'private/output'  // Ghost output contains example credentials in docs
];

// Binary file extensions to skip (content scanning irrelevant for binaries)
const SKIP_EXTENSIONS = [
  '.dll', '.so', '.dylib', '.exe', '.bin', '.obj', '.o',
  '.a', '.lib', '.pdb', '.wasm', '.node'
];

// Content patterns that indicate actual secrets (high severity)
const SECRET_CONTENT_PATTERNS = [
  /sk-ant-[a-zA-Z0-9-_]+/,           // Anthropic API key
  /sk-or-v1-[a-zA-Z0-9]+/,           // OpenRouter API key
  /ghp_[a-zA-Z0-9]+/,                // GitHub personal access token
  /gho_[a-zA-Z0-9]+/,                // GitHub OAuth token
  /github_pat_[a-zA-Z0-9]+/,         // GitHub PAT
  /xoxb-[a-zA-Z0-9-]+/,              // Slack bot token
  /xoxp-[a-zA-Z0-9-]+/,              // Slack user token
  /-----BEGIN (RSA |EC |DSA )?PRIVATE KEY-----/,  // Private keys
  /AKIA[0-9A-Z]{16}/,                // AWS access key
  /AIza[0-9A-Za-z\-_]{35}/           // Google API key
];

// Non-standard placeholder patterns (low severity - suggestions for standardization)
const NON_STANDARD_PLACEHOLDERS = [
  { pattern: /\[your-key-here\]/gi, suggested: '[insert key]' },
  { pattern: /\[your-token-here\]/gi, suggested: '[insert key]' },
  { pattern: /\[paste-your-key-here\]/gi, suggested: '[insert key]' },
  { pattern: /\[your-repo-url\]/gi, suggested: '[insert repo url]' },
  { pattern: /\[your-\w+-here\]/gi, suggested: '[insert key]' },
  { pattern: /\[value\]/gi, suggested: '[insert key]' },
];

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filePath: string): boolean {
  const fileName = basename(filePath);

  // Check allowed files
  if (ALLOWED_FILES.includes(fileName)) {
    return true;
  }

  // Check skip directories
  for (const skipDir of SKIP_DIRS) {
    if (filePath.includes(`/${skipDir}/`) || filePath.startsWith(`${skipDir}/`)) {
      return true;
    }
  }

  // Check binary extensions
  const ext = fileName.includes('.') ? `.${fileName.split('.').pop()!.toLowerCase()}` : '';
  if (SKIP_EXTENSIONS.includes(ext)) {
    return true;
  }

  return false;
}

/**
 * Check if filename matches sensitive patterns
 */
function matchesSensitivePattern(fileName: string): string | null {
  const lowerName = fileName.toLowerCase();

  for (const pattern of SENSITIVE_NAME_PATTERNS) {
    if (lowerName.includes(pattern)) {
      return pattern;
    }
  }

  return null;
}

/**
 * Check file content for actual secrets and non-standard placeholders
 */
function checkFileContent(filePath: string): { reason: string; severity: 'high' | 'low' } | null {
  try {
    const content = readFileSync(filePath, 'utf-8');

    // Check for actual secrets (high severity)
    for (const pattern of SECRET_CONTENT_PATTERNS) {
      if (pattern.test(content)) {
        return { reason: 'Contains credential pattern', severity: 'high' };
      }
    }

    // Check for non-standard placeholders (low severity)
    for (const { pattern, suggested } of NON_STANDARD_PLACEHOLDERS) {
      const match = content.match(pattern);
      if (match) {
        return {
          reason: `Non-standard placeholder: ${match[0]} → Use "${suggested}" instead`,
          severity: 'low'
        };
      }
    }
  } catch (error) {
    // Can't read file - skip content check
  }

  return null;
}

/**
 * Get list of staged and unstaged files
 */
function getChangedFiles(rootPath: string): string[] {
  try {
    process.chdir(rootPath);
    const output = execSync('git status --short', { encoding: 'utf-8' });
    const lines = output.trim().split('\n').filter(line => line.trim());

    const files: string[] = [];
    for (const line of lines) {
      // Git status format: "XY filename" or "XY filename -> newname"
      const match = line.match(/^.{2}\s+(.+?)(?:\s+->\s+.+)?$/);
      if (match) {
        files.push(match[1].trim());
      }
    }

    return files;
  } catch (error) {
    return [];
  }
}

/**
 * Run security scan
 */
export async function runSecurityScan(rootPath: string): Promise<SecurityScanResult> {
  console.log('\n🔒 Running security file scan...\n');

  const alerts: SecurityAlert[] = [];
  const changedFiles = getChangedFiles(rootPath);

  if (changedFiles.length === 0) {
    console.log('   No changed files to scan\n');
    return { success: true, alerts: [], hasAlerts: false };
  }

  console.log(`   Scanning ${changedFiles.length} changed files...\n`);

  for (const file of changedFiles) {
    // Skip allowed files/dirs
    if (shouldSkipFile(file)) {
      continue;
    }

    const fileName = basename(file);
    const filePath = join(rootPath, file);

    // Check filename patterns
    const sensitivePattern = matchesSensitivePattern(fileName);
    if (sensitivePattern) {
      alerts.push({
        file,
        reason: `Filename contains sensitive pattern: "${sensitivePattern}"`,
        severity: 'medium'
      });
    }

    // Check file content for actual secrets and non-standard placeholders
    if (existsSync(filePath)) {
      const contentIssue = checkFileContent(filePath);
      if (contentIssue) {
        alerts.push({
          file,
          reason: contentIssue.reason,
          severity: contentIssue.severity
        });
      }
    }
  }

  // Print results
  if (alerts.length > 0) {
    console.log('   ⚠️  SECURITY ALERTS:');
    console.log('   ' + '-'.repeat(60));

    const highAlerts = alerts.filter(a => a.severity === 'high');
    const mediumAlerts = alerts.filter(a => a.severity === 'medium');

    if (highAlerts.length > 0) {
      console.log('\n   🔴 HIGH SEVERITY (credentials detected):');
      for (const alert of highAlerts) {
        console.log(`      ${alert.file}`);
        console.log(`        → ${alert.reason}`);
      }
    }

    if (mediumAlerts.length > 0) {
      console.log('\n   🟡 MEDIUM SEVERITY (suspicious filenames):');
      for (const alert of mediumAlerts) {
        console.log(`      ${alert.file}`);
        console.log(`        → ${alert.reason}`);
      }
    }

    console.log('\n   ' + '-'.repeat(60));
    console.log('   Review these files before committing.');
    console.log('   Move secrets to .env or delete sensitive files.\n');
  } else {
    console.log('   ✅ No security issues detected\n');
  }

  // High severity alerts block by default
  const hasBlockingAlerts = alerts.some(a => a.severity === 'high');

  return {
    success: !hasBlockingAlerts,
    alerts,
    hasAlerts: alerts.length > 0
  };
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  runSecurityScan(rootPath).then(result => {
    if (!result.success) {
      console.error('❌ Security scan found blocking issues');
      process.exit(1);
    }
  });
}
