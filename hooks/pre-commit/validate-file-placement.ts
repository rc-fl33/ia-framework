#!/usr/bin/env npx ts-node
/**
 * Pre-commit hook: File Placement Validation
 *
 * Ensures files are created in appropriate locations per framework standards:
 * - Framework-wide docs → /docs/{standards|guides|templates|catalogs}/
 * - Skill-specific docs → skills/{skill}/docs/
 * - Active plans → /private/plans/
 * - Engagement data → /private/input|output/{skill}/
 * - Reference materials → /private/books/{topic}/
 *
 * Error codes:
 * - DOCS-001: Root files in /docs/ (must be in subdirs)
 * - PRIV-001: Root files in /private/docs/ (only active-tracker.md allowed)
 * - BOOKS-001: PDFs outside /private/books/
 * - SKILL-001: input/output dirs inside skills/ (must be /private/)
 * - SYMLINK-001: Regular dir where symlink expected
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

interface ValidationError {
  code: string;
  file: string;
  problem: string;
  fix: string;
}

const errors: ValidationError[] = [];

// Get staged files from git
function getStagedFiles(): string[] {
  try {
    const output = execSync('git diff --cached --name-only', {
      encoding: 'utf-8',
    });
    return output.trim().split('\n').filter((f) => f.length > 0);
  } catch {
    return [];
  }
}

// DOCS-001: Root markdown files in /docs/
function checkDocsRoot(files: string[]): void {
  const docsRootPattern = /^docs\/[^/]+\.md$/;
  const allowedInRoot = ['README.md', 'index.md'];

  files.forEach((file) => {
    if (docsRootPattern.test(file)) {
      const fileName = path.basename(file);
      if (!allowedInRoot.includes(fileName)) {
        errors.push({
          code: 'DOCS-001',
          file,
          problem:
            'Markdown files in /docs/ root must go in subdirectories (standards, guides, templates, catalogs)',
          fix: `git mv ${file} docs/standards/${fileName}  # or docs/guides/, etc.`,
        });
      }
    }
  });
}

// PRIV-001: Root files in /private/docs/
function checkPrivateDocs(files: string[]): void {
  const privateDocRoot = /^private\/docs\/[^/]+\.(md|yaml|json)$/;
  const allowedInRoot = [
    'active-tracker.md',
    'infrastructure-inventory.md',
  ];

  files.forEach((file) => {
    if (privateDocRoot.test(file)) {
      const fileName = path.basename(file);
      if (!allowedInRoot.includes(fileName)) {
        errors.push({
          code: 'PRIV-001',
          file,
          problem:
            'New files in /private/docs/ root are not allowed. Use /private/plans/, /private/sessions/, or /private/input|output/',
          fix: `Consider: Is this an active plan? Move to /private/plans/. Working notes? Delete and use commit messages instead.`,
        });
      }
    }
  });
}

// BOOKS-001: PDFs outside /private/books/
function checkBooksPlacement(files: string[]): void {
  const pdfFiles = files.filter((f) => f.endsWith('.pdf'));

  pdfFiles.forEach((file) => {
    if (!file.startsWith('private/books/')) {
      errors.push({
        code: 'BOOKS-001',
        file,
        problem: 'PDF files must be in /private/books/{topic}/',
        fix: `git mv ${file} private/books/{topic}/${path.basename(file)}  # Choose appropriate topic subdirectory`,
      });
    }
  });
}

// SKILL-001: input/ or output/ directories inside skills/
function checkSkillDataDirs(files: string[]): void {
  const skillDataPattern = /^skills\/[^/]+\/(input|output)\//;

  files.forEach((file) => {
    if (skillDataPattern.test(file)) {
      const match = file.match(/^skills\/([^/]+)\/(input|output)\/(.+)$/);
      if (match) {
        const [, skill, dirType] = match;
        errors.push({
          code: 'SKILL-001',
          file,
          problem: `${dirType}/ directories must not be in skills/${skill}/`,
          fix: `git mv ${file} private/${dirType}/${skill}/${path.basename(file)}`,
        });
      }
    }
  });
}

// SYMLINK-001: Regular dir where symlink expected
function checkSymlinks(files: string[]): void {
  // Check if skills/bug-bounty/prompts exists as regular dir (should be symlink)
  const bugBountyPromptsPath = path.join(
    process.cwd(),
    'skills',
    'bug-bounty',
    'prompts'
  );

  if (
    fs.existsSync(bugBountyPromptsPath) &&
    !fs.lstatSync(bugBountyPromptsPath).isSymbolicLink()
  ) {
    errors.push({
      code: 'SYMLINK-001',
      file: 'skills/bug-bounty/prompts',
      problem:
        'This should be a symlink to shared prompts, not a regular directory',
      fix: 'Review skill symlink structure in docs/skill-structure-standards.md',
    });
  }
}

// Report errors
function reportErrors(): void {
  if (errors.length === 0) {
    console.log('✅ File placement validation passed');
    process.exit(0);
  }

  console.error(
    '\n❌ FILE PLACEMENT VIOLATIONS\n\nFramework enforces strict file organization:'
  );
  console.error(
    'See CLAUDE.md "File Placement Decision Tree" for complete rules.\n'
  );

  errors.forEach((error) => {
    console.error(`\n❌ ${error.code}`);
    console.error(`   File: ${error.file}`);
    console.error(`   Problem: ${error.problem}`);
    console.error(`   Fix: ${error.fix}`);
  });

  console.error(
    '\n\nReference: docs/standards/file-location-standards.md'
  );

  // Write violations to temp file for session-end to capture
  try {
    const violationsPath = path.join(process.cwd(), '.file-placement-violations.json');
    fs.writeFileSync(violationsPath, JSON.stringify(errors));
  } catch {
    // Silent fail - never block commit on learning signal write
  }

  process.exit(1);
}

// Main
const stagedFiles = getStagedFiles();

if (stagedFiles.length === 0) {
  process.exit(0);
}

checkDocsRoot(stagedFiles);
checkPrivateDocs(stagedFiles);
checkBooksPlacement(stagedFiles);
checkSkillDataDirs(stagedFiles);
checkSymlinks(stagedFiles);

reportErrors();
