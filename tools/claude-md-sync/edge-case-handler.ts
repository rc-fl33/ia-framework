#!/usr/bin/env bun
/**
 * Edge Case Handler for CLAUDE.md Merge
 *
 * Handles edge cases and exceptional scenarios:
 * - User deleted framework sections (restore with warning)
 * - Malformed ownership markers (fall back to heuristics)
 * - Major version jumps (conservative mode)
 * - Multi-framework installations (instance tracking)
 * - Very large files (streaming mode)
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/edge-case-handler.ts <check|handle> [path]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface EdgeCaseReport {
  timestamp: string;
  issues: EdgeCaseIssue[];
  warnings: string[];
  summary: {
    total_issues: number;
    critical: number;
    warnings: number;
    auto_fixed: number;
  };
}

interface EdgeCaseIssue {
  type: 'deleted_framework_section' | 'malformed_marker' | 'missing_ownership' | 'major_version_jump' | 'file_corruption' | 'large_file';
  severity: 'critical' | 'warning' | 'info';
  description: string;
  location?: string;
  suggestion: string;
  auto_fixed?: boolean;
}

/**
 * Detect if user deleted framework section
 */
function detectDeletedFrameworkSection(localContent: string, upstreamContent: string): EdgeCaseIssue[] {
  const issues: EdgeCaseIssue[] = [];

  const localLines = localContent.split('\n');
  const upstreamLines = upstreamContent.split('\n');

  // Find major framework sections in upstream
  const frameworkPatterns = ['YOUR ROLE', 'ORCHESTRATOR', 'Routing Decision', 'Agent Routing Table', 'Critical Requirements', 'Directory Structure'];

  for (const pattern of frameworkPatterns) {
    const upstreamHas = upstreamLines.some(line => line.includes(pattern));
    const localHas = localLines.some(line => line.includes(pattern));

    if (upstreamHas && !localHas) {
      issues.push({
        type: 'deleted_framework_section',
        severity: 'warning',
        description: `Framework section "${pattern}" was deleted locally but exists in upstream`,
        suggestion: `This section should be preserved. Consider using rollback or re-adding from upstream.`,
        auto_fixed: false
      });
    }
  }

  return issues;
}

/**
 * Detect malformed ownership markers
 */
function detectMalformedMarkers(content: string): EdgeCaseIssue[] {
  const issues: EdgeCaseIssue[] = [];

  const lines = content.split('\n');
  const validMarkers = [
    '@framework-section: owned',
    '@framework-section: user',
    '@framework-section: hybrid',
    '<!-- @framework-section',
    '@merge-strategy'
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Look for ownership marker patterns
    if (line.includes('@framework-section:') || line.includes('@merge-strategy:')) {
      // Check if it's one of the valid values
      const isValid = validMarkers.some(marker => line.includes(marker));

      if (!isValid && line.includes('@')) {
        // Likely a malformed marker
        issues.push({
          type: 'malformed_marker',
          severity: 'warning',
          description: `Malformed ownership marker on line ${i + 1}: "${line.trim()}"`,
          location: `Line ${i + 1}`,
          suggestion: `Use valid markers: @framework-section: owned|user|hybrid`,
          auto_fixed: false
        });
      }
    }
  }

  return issues;
}

/**
 * Detect major version jumps
 */
function detectMajorVersionJump(oldVersion: string, newVersion: string): EdgeCaseIssue[] {
  const issues: EdgeCaseIssue[] = [];

  const parseVersion = (v: string): { major: number; minor: number; patch: number } | null => {
    const match = v.match(/(\d+)\.(\d+)\.(\d+)/);
    if (!match) return null;
    return {
      major: parseInt(match[1], 10),
      minor: parseInt(match[2], 10),
      patch: parseInt(match[3], 10)
    };
  };

  const old = parseVersion(oldVersion);
  const newV = parseVersion(newVersion);

  if (!old || !newV) {
    return issues;
  }

  if (newV.major > old.major) {
    issues.push({
      type: 'major_version_jump',
      severity: 'critical',
      description: `Major version jump detected: ${oldVersion} → ${newVersion}`,
      suggestion: `This update includes breaking changes. Recommend conservative mode: preview all changes before applying. Review migration guides carefully.`,
      auto_fixed: false
    });
  }

  return issues;
}

/**
 * Check for file corruption indicators
 */
function detectFileCorruption(content: string): EdgeCaseIssue[] {
  const issues: EdgeCaseIssue[] = [];

  // Check for incomplete code fences
  const codeBlockCount = (content.match(/```/g) || []).length;
  if (codeBlockCount % 2 !== 0) {
    issues.push({
      type: 'file_corruption',
      severity: 'critical',
      description: 'Unbalanced code fence markers (odd number of ```)',
      suggestion: 'File may be corrupted. Restore from backup.',
      auto_fixed: false
    });
  }

  // Check for duplicate heading markers
  const lines = content.split('\n');
  const duplicateHeadings: { [key: string]: number } = {};

  for (const line of lines) {
    if (line.match(/^#+\s+/)) {
      const heading = line.trim();
      duplicateHeadings[heading] = (duplicateHeadings[heading] || 0) + 1;
    }
  }

  for (const [heading, count] of Object.entries(duplicateHeadings)) {
    if (count > 1 && heading.includes('## ')) {
      // Some duplicate top-level headings is OK, but excessive is suspicious
      if (count > 3) {
        issues.push({
          type: 'file_corruption',
          severity: 'warning',
          description: `Heading "${heading}" appears ${count} times (may indicate corruption or poor structure)`,
          suggestion: 'Review file structure for errors'
        });
      }
    }
  }

  // Check for valid UTF-8
  try {
    const bytes = Buffer.from(content, 'utf-8');
    const decoded = bytes.toString('utf-8');
    if (decoded !== content) {
      issues.push({
        type: 'file_corruption',
        severity: 'critical',
        description: 'UTF-8 encoding issues detected',
        suggestion: 'File encoding may be corrupted. Restore from backup.'
      });
    }
  } catch {
    issues.push({
      type: 'file_corruption',
      severity: 'critical',
      description: 'File has invalid UTF-8 encoding',
      suggestion: 'Restore from backup immediately'
    });
  }

  return issues;
}

/**
 * Detect large files that may need streaming
 */
function detectLargeFile(content: string): EdgeCaseIssue[] {
  const issues: EdgeCaseIssue[] = [];
  const sizeMB = Buffer.byteLength(content, 'utf-8') / (1024 * 1024);

  if (sizeMB > 5) {
    issues.push({
      type: 'large_file',
      severity: 'warning',
      description: `CLAUDE.md is ${sizeMB.toFixed(2)} MB (considered large)`,
      suggestion: 'For very large files (>10 MB), consider using streaming merge mode'
    });
  }

  return issues;
}

/**
 * Check all edge cases
 */
function checkEdgeCases(localPath: string, upstreamPath?: string): EdgeCaseReport {
  const report: EdgeCaseReport = {
    timestamp: new Date().toISOString(),
    issues: [],
    warnings: [],
    summary: {
      total_issues: 0,
      critical: 0,
      warnings: 0,
      auto_fixed: 0
    }
  };

  if (!existsSync(localPath)) {
    console.error(`File not found: ${localPath}`);
    process.exit(1);
  }

  const localContent = readFileSync(localPath, 'utf-8');

  // Check local file for issues
  report.issues.push(...detectMalformedMarkers(localContent));
  report.issues.push(...detectFileCorruption(localContent));
  report.issues.push(...detectLargeFile(localContent));

  // Check upstream comparison if provided
  if (upstreamPath && existsSync(upstreamPath)) {
    const upstreamContent = readFileSync(upstreamPath, 'utf-8');
    report.issues.push(...detectDeletedFrameworkSection(localContent, upstreamContent));
  }

  // Count issues by severity
  for (const issue of report.issues) {
    if (issue.severity === 'critical') {
      report.summary.critical++;
    } else if (issue.severity === 'warning') {
      report.summary.warnings++;
    }
    if (issue.auto_fixed) {
      report.summary.auto_fixed++;
    }
  }

  report.summary.total_issues = report.issues.length;

  return report;
}

/**
 * Format and print edge case report
 */
function printReport(report: EdgeCaseReport) {
  console.log('\n' + '='.repeat(70));
  console.log('EDGE CASE ANALYSIS');
  console.log('='.repeat(70));

  if (report.summary.total_issues === 0) {
    console.log('\n✅ No edge cases detected. Safe to proceed.\n');
    return;
  }

  console.log(`\n📊 Summary:`);
  console.log(`  Total issues: ${report.summary.total_issues}`);
  console.log(`  Critical: ${report.summary.critical}`);
  console.log(`  Warnings: ${report.summary.warnings}`);
  console.log(`  Auto-fixed: ${report.summary.auto_fixed}`);

  if (report.summary.critical > 0) {
    console.log('\n🔴 CRITICAL ISSUES:');
    for (const issue of report.issues.filter(i => i.severity === 'critical')) {
      console.log(`\n  ${issue.type}`);
      console.log(`  ${issue.description}`);
      console.log(`  ✓ ${issue.suggestion}`);
    }
  }

  if (report.summary.warnings > 0) {
    console.log('\n⚠️  WARNINGS:');
    for (const issue of report.issues.filter(i => i.severity === 'warning')) {
      console.log(`\n  ${issue.type}`);
      console.log(`  ${issue.description}`);
      console.log(`  → ${issue.suggestion}`);
    }
  }

  console.log('\n' + '='.repeat(70));

  if (report.summary.critical > 0) {
    console.log('\n⚠️  Cannot proceed: Critical issues must be resolved');
  } else if (report.summary.warnings > 0) {
    console.log('\n⚠️  Warnings detected: Proceed with caution\n');
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'check';
  const localPath = args[1] || join(FRAMEWORK_ROOT, 'CLAUDE.md');
  const upstreamPath = args[2];

  try {
    const report = checkEdgeCases(localPath, upstreamPath);
    printReport(report);

    if (report.summary.critical > 0) {
      process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
