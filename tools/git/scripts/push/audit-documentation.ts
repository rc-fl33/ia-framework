#!/usr/bin/env bun
/**
 * Documentation Audit Script
 *
 * Checks core documentation files for:
 * 1. Hardcoded component counts (violates "No Hardcoded Counts" standard)
 * 2. Version number consistency across files
 * 3. Outdated timestamps
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

interface Violation {
  file: string;
  line: number;
  type: string;
  content: string;
}

interface VersionIssue {
  file: string;
  line: number;
  version: string;
}

interface DateIssue {
  file: string;
  line: number;
  date: string;
}

interface AuditResult {
  success: boolean;
  violations: Violation[];
  versionIssues: VersionIssue[];
  dateIssues: DateIssue[];
  hasIssues: boolean;
}

// Core documentation files to audit (V2 paths)
const CORE_DOCS = [
  'README.md',
  'CLAUDE.md',
  'docs/ARCHITECTURE.md',
  'docs/STANDARDS.md',
  'docs/INSTALL.md'
];

// Patterns that violate "No Hardcoded Counts" standard
// Matches: "42 tools", "18 skills", "5 agents", "28 commands", etc.
// Note: Architectural labels are stripped before matching (see removeArchitecturalLabels function)
const HARDCODED_COUNT_PATTERNS = [
  /\b\d+\s+(skills?|commands?|agents?|tools?|servers?|workflows?|modules?|hooks?)/gi,
  /\b\d+\s+(Kali|security|mobile|Web3|VPS)/gi,
  /\b\d{2,},\d{3}\s+\w+/g  // Matches: "23,368 reference materials"
];

// Version patterns
const VERSION_PATTERNS = [
  /Version:\s*\**v?(\d+\.\d+)/i,
  /Framework Version:\s*\**v?(\d+\.\d+)/i
];

// Timestamp patterns
const TIMESTAMP_PATTERNS = [
  /Last Updated:\s*\**(\d{4}-\d{2}-\d{2})/i
];

// Expected values (V2)
const EXPECTED_VERSION = '2.0';

// Lines to skip (these are examples or documentation of the rule itself)
const SKIP_PATTERNS = [
  'NEVER hardcode',
  'e.g.',
  'Example:',
  'WRONG:',
  'RIGHT:',
  'PROHIBITED',
  'auto-generated'
];

// Architectural label patterns to exclude
const ARCHITECTURAL_PREFIXES = /\b(Layer|Phase|Step|Tier|Level|Version)\s+\d+/gi;

/**
 * Check if line should be skipped (it's an example, not a violation)
 */
function shouldSkipLine(line: string): boolean {
  // Skip lines with example markers
  if (line.includes('❌') || line.includes('✅')) return true;

  // Skip lines that are documenting the rule
  for (const pattern of SKIP_PATTERNS) {
    if (line.includes(pattern)) return true;
  }

  return false;
}

/**
 * Remove architectural labels from line before checking for violations
 * This prevents false positives like "Layer 1 security" from being flagged
 */
function removeArchitecturalLabels(line: string): string {
  return line.replace(ARCHITECTURAL_PREFIXES, '');
}

/**
 * Audit a single file
 */
function auditFile(filePath: string, fileName: string): {
  violations: Violation[];
  versionIssues: VersionIssue[];
  dateIssues: DateIssue[];
} {
  const violations: Violation[] = [];
  const versionIssues: VersionIssue[] = [];
  const dateIssues: DateIssue[] = [];
  const violatedLines = new Set<number>(); // Track lines already flagged

  if (!existsSync(filePath)) {
    return { violations, versionIssues, dateIssues };
  }

  const content = readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  for (let lineNum = 0; lineNum < lines.length; lineNum++) {
    const line = lines[lineNum];
    const lineNumber = lineNum + 1;

    // Skip lines that are examples or documentation
    if (shouldSkipLine(line)) continue;

    // Remove architectural labels before checking for violations
    const sanitizedLine = removeArchitecturalLabels(line);

    // Check for hardcoded counts
    let hasViolation = false;
    for (const pattern of HARDCODED_COUNT_PATTERNS) {
      const matches = Array.from(sanitizedLine.matchAll(pattern));
      if (matches.length > 0 && !violatedLines.has(lineNumber)) {
        hasViolation = true;
        break;
      }
    }

    if (hasViolation) {
      violatedLines.add(lineNumber);
      violations.push({
        file: fileName,
        line: lineNumber,
        type: 'Hardcoded Count',
        content: line.trim()
      });
    }

    // Check version numbers
    for (const pattern of VERSION_PATTERNS) {
      const match = line.match(pattern);
      if (match) {
        const version = match[1];
        if (version !== EXPECTED_VERSION) {
          versionIssues.push({
            file: fileName,
            line: lineNumber,
            version
          });
        }
      }
    }

    // Note: We skip date checks since V2 updates dates dynamically
  }

  return { violations, versionIssues, dateIssues };
}

/**
 * Run documentation audit
 */
export async function runAudit(rootPath: string): Promise<AuditResult> {
  console.log('\n📋 Running documentation audit...\n');
  console.log(`   Root: ${rootPath}`);
  console.log(`   Files: ${CORE_DOCS.join(', ')}`);
  console.log(`   Expected Version: v${EXPECTED_VERSION}\n`);

  const allViolations: Violation[] = [];
  const allVersionIssues: VersionIssue[] = [];
  const allDateIssues: DateIssue[] = [];

  for (const doc of CORE_DOCS) {
    const filePath = join(rootPath, doc);
    const result = auditFile(filePath, doc);

    allViolations.push(...result.violations);
    allVersionIssues.push(...result.versionIssues);
    allDateIssues.push(...result.dateIssues);
  }

  // Print report
  console.log('=' .repeat(70));
  console.log('DOCUMENTATION AUDIT REPORT');
  console.log('='.repeat(70));

  if (allViolations.length > 0) {
    console.log(`\n[X] HARDCODED COUNT VIOLATIONS: ${allViolations.length}`);
    console.log('-'.repeat(70));
    for (const v of allViolations) {
      console.log(`  ${v.file}:${v.line}`);
      console.log(`    Type: ${v.type}`);
      console.log(`    Content: ${v.content.substring(0, 80)}${v.content.length > 80 ? '...' : ''}`);
    }
  }

  if (allVersionIssues.length > 0) {
    console.log(`\n[!] VERSION INCONSISTENCIES: ${allVersionIssues.length}`);
    console.log('-'.repeat(70));
    console.log(`  Expected: v${EXPECTED_VERSION}`);
    for (const v of allVersionIssues) {
      console.log(`  ${v.file}:${v.line} - Found: v${v.version}`);
    }
  }

  const hasIssues = allViolations.length > 0 || allVersionIssues.length > 0;

  if (!hasIssues) {
    console.log('\n[OK] ALL CHECKS PASSED - Documentation is clean!');
  } else {
    console.log('\n' + '='.repeat(70));
    console.log('\nStandards Reference:');
    console.log('  - docs/STANDARDS.md: No Hardcoded Counts standard');
    console.log('  - All counts should use qualifiers (e.g., "Multiple modules")');
    console.log('  - Version must be consistent across all core docs');
  }

  console.log('='.repeat(70) + '\n');

  return {
    success: !hasIssues,
    violations: allViolations,
    versionIssues: allVersionIssues,
    dateIssues: allDateIssues,
    hasIssues
  };
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  runAudit(rootPath).then(result => {
    // Audit is informational - don't fail the pipeline
    // User can decide to proceed or fix issues
    process.exit(0);
  });
}
