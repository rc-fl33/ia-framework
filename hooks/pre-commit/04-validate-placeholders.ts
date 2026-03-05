#!/usr/bin/env bun
/**
 * Placeholder Format Validator
 *
 * Validates that credential placeholders in configuration templates and
 * documentation use the standard [insert ...] format. Catches non-standard
 * formats that trigger false positives in credential scanners.
 *
 * SCOPE: Only scans files where credential placeholders are expected:
 *   - .env.example, .env.template, .env.structure.yaml
 *   - docs/ and private/docs/ markdown files
 *   - SKILL.md files
 *   - Shell scripts in skills/ and tools/ (setup/deploy scripts)
 *
 * DOES NOT scan: Source code (.ts/.js), node_modules, lock files, JSON,
 * or any file outside the allowlisted paths. This prevents false positives
 * from matching legitimate code variables.
 *
 * Standard format: [insert api key], [insert password], [insert token], etc.
 * Non-standard (flagged): your_api_key, <insert-token>, INSERT_PASSWORD, etc.
 *
 * IMPORTANT: This hook is REPORT-ONLY. It never modifies files. When acting
 * on its suggestions, only fix the specific file and line reported — never
 * do broad find-and-replace across the codebase.
 *
 * Exit codes:
 *   0 - All placeholders valid or no violations found
 *   1 - Usage error
 *   2 - Validation failures (blocks commit)
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Only credential-related words trigger violations. General programming
// terms like "value", "name", "key" alone are NOT matched — they must
// appear in a credential-like context (your_api_key, INSERT_PASSWORD, etc.)
const CREDENTIAL_WORDS = [
  'api[_ -]?key', 'password', 'passwd', 'token', 'secret',
  'credential', 'auth', 'username', 'login', 'api[_ -]?secret',
  'client[_ -]?id', 'client[_ -]?secret', 'access[_ -]?key',
  'private[_ -]?key', 'bearer', 'webhook[_ -]?secret',
  'signing[_ -]?key', 'encryption[_ -]?key', 'database[_ -]?url',
  'connection[_ -]?string', 'smtp[_ -]?password', 'ssh[_ -]?key',
];

const CREDENTIAL_SUFFIX = `(?:${CREDENTIAL_WORDS.join('|')})`;

// Non-standard placeholder patterns — only match credential-like strings
const PLACEHOLDER_VIOLATIONS = [
  {
    pattern: new RegExp(`["']your[_-]${CREDENTIAL_SUFFIX}[a-z_-]*["']`, 'gi'),
    replacement: (match: string) => {
      const clean = match.replace(/["']/g, '').replace(/^your[_-]/i, '').replace(/[_-]/g, ' ');
      return `"[insert ${clean}]"`;
    },
    description: 'your_<credential> format',
  },
  {
    pattern: new RegExp(`<insert[- ]${CREDENTIAL_SUFFIX}[a-z_ -]*>`, 'gi'),
    replacement: (match: string) => {
      const clean = match.replace(/[<>]/g, '').replace(/^insert[- ]/i, '').replace(/[- ]/g, ' ');
      return `[insert ${clean}]`;
    },
    description: '<insert-credential> format',
  },
  {
    pattern: new RegExp(`\\{\\{${CREDENTIAL_SUFFIX.toUpperCase().replace(/\[_ -\]\?/g, '[_ ]?')}[A-Z_]*\\}\\}`, 'g'),
    replacement: (match: string) => {
      const clean = match.replace(/[{}]/g, '').toLowerCase().replace(/_/g, ' ');
      return `[insert ${clean}]`;
    },
    description: 'double-brace {{CREDENTIAL}} format',
  },
  {
    pattern: new RegExp(`INSERT_${CREDENTIAL_SUFFIX.toUpperCase().replace(/\[_ -\]\?/g, '[_ ]?')}[A-Z_]*`, 'g'),
    replacement: (match: string) => {
      const clean = match.replace(/^INSERT_/i, '').toLowerCase().replace(/_/g, ' ');
      return `[insert ${clean}]`;
    },
    description: 'INSERT_CREDENTIAL format',
  },
];

// ALLOWLIST: Only these file patterns are scanned for placeholders.
// Everything else is ignored. This is the opposite of the old denylist
// approach — if a file isn't explicitly expected to have credential
// placeholders, we don't touch it.
//
// IMPORTANT: Do NOT add source code paths (tools/, scripts/, etc.) here.
// Shell scripts in tools/ contain legitimate code variables like [insert key],
// [key], etc. that are NOT placeholders. Scanning them causes Claude to
// "fix" valid code into broken [insert ...] format. Only scan files that
// are templates/documentation where credential placeholders actually belong.
const SCAN_ALLOWLIST = [
  /^\.env\.example$/,
  /^\.env\.template$/,
  /^\.env\.structure\.yaml$/,
  /^docs\/.*\.md$/,
  /^private\/docs\/.*\.md$/,
  /\/SKILL\.md$/,
  /^SECURITY\.md$/,
  /^README\.md$/,
];

interface Violation {
  file: string;
  line: number;
  content: string;
  match: string;
  suggestion: string;
  type: string;
}

/**
 * Get staged files from git
 */
function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only --diff-filter=ACM', {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter(Boolean);
  } catch (error) {
    console.error('Failed to get staged files:', error);
    return [];
  }
}

/**
 * Check if file is in the scan allowlist
 */
function isAllowedFile(filePath: string): boolean {
  return SCAN_ALLOWLIST.some(pattern => pattern.test(filePath));
}

/**
 * Strip fenced code blocks from content to avoid false positives
 * in code examples embedded in markdown
 */
function stripCodeBlocks(content: string): string {
  return content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, (match) => {
    // Replace with same number of newlines to preserve line numbers
    return '\n'.repeat((match.match(/\n/g) || []).length);
  });
}

/**
 * Check if a line is inside a comment or non-content context
 */
function isNonContentLine(line: string): boolean {
  const trimmed = line.trim();
  // Line comments
  if (trimmed.startsWith('//')) return true;
  if (trimmed.startsWith('#') && !trimmed.startsWith('#!')) return true;
  if (trimmed.startsWith('*')) return true;
  // HTML comments
  if (trimmed.startsWith('<!--')) return true;
  return false;
}

/**
 * Scan file for placeholder violations
 */
function scanFile(filePath: string): Violation[] {
  const violations: Violation[] = [];

  try {
    let content = readFileSync(filePath, 'utf-8');

    // Strip fenced code blocks in markdown files to avoid matching
    // code examples that legitimately use variable names
    if (filePath.endsWith('.md')) {
      content = stripCodeBlocks(content);
    }

    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const lineNumber = i + 1;

      if (isNonContentLine(line)) continue;

      for (const { pattern, replacement, description } of PLACEHOLDER_VIOLATIONS) {
        const matches = line.matchAll(new RegExp(pattern));

        for (const match of matches) {
          if (match[0]) {
            violations.push({
              file: filePath,
              line: lineNumber,
              content: line.trim(),
              match: match[0],
              suggestion: replacement(match[0]),
              type: description,
            });
          }
        }
      }
    }
  } catch (error) {
    return [];
  }

  return violations;
}

/**
 * Main validation logic
 */
function main(): void {
  console.log('🔍 Validating placeholder formats...');

  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log('✅ No files staged, skipping placeholder validation\n');
    process.exit(0);
  }

  // ALLOWLIST filter: only scan files where credential placeholders belong
  const relevantFiles = stagedFiles.filter(isAllowedFile);

  if (relevantFiles.length === 0) {
    console.log('✅ No placeholder-relevant files staged, skipping\n');
    process.exit(0);
  }

  console.log(`   Scanning ${relevantFiles.length} file(s) (allowlisted only)...`);

  const allViolations: Violation[] = [];

  for (const file of relevantFiles) {
    const violations = scanFile(file);
    allViolations.push(...violations);
  }

  if (allViolations.length === 0) {
    console.log('✅ All placeholders use standard [insert ...] format\n');
    process.exit(0);
  }

  // Report violations
  console.log(`\n❌ Found ${allViolations.length} non-standard placeholder(s):\n`);

  const byFile = new Map<string, Violation[]>();
  for (const violation of allViolations) {
    if (!byFile.has(violation.file)) {
      byFile.set(violation.file, []);
    }
    byFile.get(violation.file)!.push(violation);
  }

  for (const [file, violations] of byFile) {
    console.log(`📄 ${file}`);
    for (const v of violations) {
      console.log(`   Line ${v.line}: ${v.match}`);
      console.log(`   Type: ${v.type}`);
      console.log(`   Fix: ${v.suggestion}`);
      console.log(`   ⚠ Fix ONLY this line in this file — do not use broad find-and-replace\n`);
    }
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Standard format: [insert api key], [insert password], [insert token]');
  console.log('Fix ONLY the specific files and lines listed above.');
  console.log('DO NOT run broad find-and-replace — it will corrupt unrelated code.');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(2);
}

main();
