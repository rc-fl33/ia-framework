#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Frontmatter Schema Validation
 *
 * Validates YAML frontmatter against JSON schemas:
 * - SKILL.md files → skill-frontmatter.schema.json
 * - Blog posts → blog-post-frontmatter.schema.json
 *
 * Exit codes:
 * - 0: Validation passed (allow commit)
 * - 2: Validation failed (BLOCK commit)
 */

import { spawnSync } from 'child_process';
import { readFileSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import Ajv from 'ajv';
import matter from 'gray-matter';

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');
const SKILL_SCHEMA_PATH = join(FRAMEWORK_ROOT, 'tools', 'framework', 'security', 'schemas', 'skill-frontmatter.schema.json');
const BLOG_SCHEMA_PATH = join(FRAMEWORK_ROOT, 'tools', 'framework', 'security', 'schemas', 'blog-post-frontmatter.schema.json');
const LOG_DIR = join(FRAMEWORK_ROOT, 'logs', 'validation');
const LOG_FILE = join(LOG_DIR, 'frontmatter-validation.log');

interface ValidationIssue {
  file: string;
  issues: string[];
}

interface Frontmatter {
  title?: string;
  date?: string;
  tags?: string[];
  classification?: string;
  [key: string]: string | string[] | number | boolean | undefined;
}

/**
 * Get staged markdown files
 */
function getStagedMarkdownFiles(): string[] {
  try {
    const result = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
      encoding: 'utf-8',
      timeout: 5000,
    });

    if (!result.stdout) {
      return [];
    }

    return result.stdout
      .trim()
      .split('\n')
      .filter(file => file && file.endsWith('.md'));
  } catch {
    return [];
  }
}

/**
 * Determine file type and return appropriate schema path
 */
function getSchemaForFile(filePath: string): string | null {
  // Skip test fixtures
  if (filePath.includes('__tests__/') || filePath.includes('/__tests__/')) {
    return null;
  }

  // Skip audit files, summaries, and working documents (not publishable content)
  const filename = basename(filePath);
  if (
    filename.startsWith('AUDIT-') ||
    filename.includes('-AUDIT-') ||
    filename.endsWith('-SUMMARY.md') ||
    filename.includes('SUMMARY.md') ||
    filename.includes('COMPLETION-SUMMARY') ||
    filename.includes('PATTERN.md') ||
    filename.includes('ERROR.md') ||
    filename === 'research-notes.md' ||
    filename.endsWith('-2026-01-24.md') || // Session dated files
    filePath.includes('/research/') // Research subdirectories
  ) {
    return null;
  }

  // SKILL.md files
  if (basename(filePath) === 'SKILL.md') {
    return SKILL_SCHEMA_PATH;
  }

  // Blog posts in Ghost skill (but not pages, inventory, or supporting files)
  if (filePath.includes('skills/ghost/') && (
    filePath.includes('/input/') ||
    filePath.includes('/output/') ||
    filePath.includes('/blog-ideas/') ||
    filePath.includes('/drafts/')
  )) {
    // Skip Ghost pages (they have different frontmatter requirements)
    if (filePath.includes('/output/pages/')) {
      return null;
    }
    // Skip inventory/tracking files (not publishable content)
    if (filename.includes('inventory') || filename.includes('tracker')) {
      return null;
    }
    // Skip supporting/research files (not publishable posts)
    if (
      filename.startsWith('tweet') ||
      filename.startsWith('hero-') ||
      filename.startsWith('brand-context') ||
      filename.startsWith('phase-') ||
      filename.startsWith('longform-') ||
      filename.includes('analysis') ||
      filename.includes('research') ||
      filename.includes('sources') ||
      filename.includes('key-insights') ||
      filename.includes('generation-status') ||
      filename.includes('ENHANCEMENT') ||
      filename.includes('DIAGRAM') ||
      filename.includes('AUDIT') ||
      filename.includes('SUMMARY') ||
      filename === 'metadata.json'
    ) {
      return null;
    }
    // Only validate draft.md — all other output files are supporting artifacts
    if (filename === 'draft.md') {
      return BLOG_SCHEMA_PATH;
    }
    return null;
  }

  // No schema for this file type
  return null;
}

/**
 * Validate frontmatter against schema
 */
function validateFrontmatter(filePath: string, frontmatter: Frontmatter, schemaPath: string): string[] {
  const issues: string[] = [];

  // Load schema
  if (!existsSync(schemaPath)) {
    issues.push(`Schema not found: ${schemaPath}`);
    return issues;
  }

  const schema = JSON.parse(readFileSync(schemaPath, 'utf-8'));

  // Setup Ajv
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(frontmatter);

  if (!valid && validate.errors) {
    for (const error of validate.errors) {
      const path = error.instancePath || '/';
      const message = error.message || 'validation error';

      if (error.keyword === 'required') {
        issues.push(`Missing required field: ${error.params.missingProperty}`);
      } else if (error.keyword === 'enum') {
        issues.push(`${path}: must be one of: ${error.params.allowedValues.join(', ')}`);
      } else if (error.keyword === 'pattern') {
        issues.push(`${path}: ${message} (pattern: ${error.params.pattern})`);
      } else if (error.keyword === 'minLength' || error.keyword === 'maxLength') {
        issues.push(`${path}: ${message}`);
      } else {
        issues.push(`${path}: ${message}`);
      }
    }
  }

  return issues;
}

/**
 * Process a single file
 */
function processFile(filePath: string): ValidationIssue | null {
  const fullPath = join(FRAMEWORK_ROOT, filePath);

  if (!existsSync(fullPath)) {
    return null;
  }

  // Get schema for this file type
  const schemaPath = getSchemaForFile(filePath);
  if (!schemaPath) {
    // No validation needed for this file type
    return null;
  }

  // Read and parse frontmatter
  let content: string;
  try {
    content = readFileSync(fullPath, 'utf-8');
  } catch (error) {
    return {
      file: filePath,
      issues: [`Failed to read file: ${error}`]
    };
  }

  let frontmatter: Frontmatter;
  try {
    const parsed = matter(content);
    frontmatter = parsed.data as Frontmatter;
  } catch (error) {
    return {
      file: filePath,
      issues: [`Failed to parse frontmatter: ${error}`]
    };
  }

  if (!frontmatter || Object.keys(frontmatter).length === 0) {
    return {
      file: filePath,
      issues: ['No frontmatter found (must have --- delimiters)']
    };
  }

  // Validate against schema
  const issues = validateFrontmatter(filePath, frontmatter, schemaPath);

  if (issues.length > 0) {
    return { file: filePath, issues };
  }

  return null;
}

/**
 * Write log file with detailed results
 */
function writeLog(violations: ValidationIssue[]) {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const logContent = [
    `Frontmatter Validation Log - ${timestamp}`,
    `${'='.repeat(60)}`,
    '',
    `Files validated: ${violations.length}`,
    '',
    ...violations.flatMap(v => [
      `FILE: ${v.file}`,
      ...v.issues.map(issue => `  ❌ ${issue}`),
      ''
    ]),
    '',
    'Resolution:',
    '  1. Fix frontmatter to match schema requirements',
    '  2. Check schema files in tools/framework/security/schemas/',
    '  3. Use skill templates as reference',
    ''
  ].join('\n');

  writeFileSync(LOG_FILE, logContent, 'utf-8');
}

/**
 * Main execution
 */
function main() {
  console.error('🔍 Validating frontmatter schemas...');

  const stagedFiles = getStagedMarkdownFiles();

  if (stagedFiles.length === 0) {
    console.error('✅ No markdown files staged, skipping validation');
    process.exit(0);
  }

  // Process each file
  const violations: ValidationIssue[] = [];
  let validatedCount = 0;

  for (const file of stagedFiles) {
    const result = processFile(file);
    if (result) {
      violations.push(result);
      validatedCount++;
    }
  }

  if (validatedCount === 0) {
    console.error('✅ No files require schema validation');
    process.exit(0);
  }

  if (violations.length === 0) {
    console.error(`✅ All ${validatedCount} file(s) validated successfully!`);
    process.exit(0);
  }

  // Validation failed - write log and block commit
  writeLog(violations);

  console.error('');
  console.error('❌ FRONTMATTER SCHEMA VALIDATION FAILED!');
  console.error('');
  console.error('⚠️  Commit BLOCKED due to invalid frontmatter');
  console.error('');
  console.error(`Failed files (${violations.length}):`);

  for (const violation of violations) {
    console.error(`  📄 ${violation.file}`);
    for (const issue of violation.issues) {
      console.error(`     ❌ ${issue}`);
    }
  }

  console.error('');
  console.error('Why this matters:');
  console.error('  - Frontmatter schemas ensure consistent metadata');
  console.error('  - Invalid metadata breaks skill discovery and routing');
  console.error('  - Schemas enforce framework standards');
  console.error('');
  console.error('How to fix:');
  console.error('  1. Review schema requirements:');
  console.error('     - SKILL.md: tools/framework/security/schemas/skill-frontmatter.schema.json');
  console.error('     - Blog posts: tools/framework/security/schemas/blog-post-frontmatter.schema.json');
  console.error('  2. Fix frontmatter to match schema');
  console.error('  3. Check templates for examples:');
  console.error('     - docs/templates/SKILL-TEMPLATE.md');
  console.error('     - skills/ghost/templates/');
  console.error('');
  console.error(`📝 Detailed log: ${LOG_FILE}`);
  console.error('');

  process.exit(2); // Exit code 2 = BLOCK commit
}

main();
