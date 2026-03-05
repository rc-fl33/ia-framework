#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Path Validation
 *
 * Validates file path references in documentation:
 * - File references in markdown exist
 * - Symlinks in commands/ are valid
 * - Tool catalog references are correct
 * - Script paths in skills are valid
 *
 * Exit codes:
 * - 0: Validation passed (allow commit)
 * - 2: Validation failed (BLOCK commit)
 */

import { spawnSync } from 'child_process';
import { readFileSync, readdirSync, existsSync, lstatSync, readlinkSync, writeFileSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');
const COMMANDS_DIR = join(FRAMEWORK_ROOT, 'commands');
const TOOL_CATALOG_PATH = join(FRAMEWORK_ROOT, 'library', 'catalogs', 'tool-catalog.md');
const LOG_DIR = join(FRAMEWORK_ROOT, 'logs', 'validation');
const LOG_FILE = join(LOG_DIR, 'paths-validation.log');

interface ValidationIssue {
  category: string;
  severity: 'error' | 'warning';
  file: string;
  message: string;
}

/**
 * Strip fenced code blocks from markdown content.
 * Paths inside code blocks are examples/templates (e.g., directory tree diagrams,
 * template naming conventions like FINDING-XXX.md, TC-XXX), not real file references.
 */
function stripFencedCodeBlocks(content: string): string {
  // Match ``` or ~~~ fenced blocks (with optional language identifier)
  return content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

/**
 * Strip URLs from content before path matching.
 * Prevents false positives where external URLs like https://kali.org/tools/dirb/
 * contain path segments that look like local directory references.
 */
function stripUrls(content: string): string {
  return content.replace(/https?:\/\/[^\s)\]'"]+/g, '');
}

/**
 * Get staged files that contain path references
 * Excludes files known to contain examples or audit documentation
 */
function getStagedPathFiles(): string[] {
  try {
    const result = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
      encoding: 'utf-8',
      timeout: 5000,
    });

    if (!result.stdout) {
      return [];
    }

    const allStaged = result.stdout.trim().split('\n');
    const pathFiles: string[] = [];

    // Files to exclude from path validation (contain examples, templates, or audit docs)
    const excludePatterns = [
      /\/templates\/.+\.md$/,                   // Template files contain placeholder paths by design
      /skills\/ghost\/output\/posts\/.+\.md$/,  // Blog posts with examples
      /tools\/flux\/docs\/.+\.md$/,             // Audit documents
      /tools\/flux\/scripts\/setup\.ts$/,       // Tool setup scripts
      /private\/docs\/skill-integration-status\.md$/, // Integration status docs
      /private\/docs\/audits\/.+\.md$/,         // Historical audit snapshots (stale paths by design)
      /private\/plans\/.+\.md$/,                // Planning docs may reference future/old paths
      /tools\/git\/scripts\/public\/transform-claude-md\.ts$/, // Contains regex patterns that look like paths
      /tools\/quarto\/TOOL\.md$/,               // References private infra docs not in repo
      /docs\/generative-routing-gates-standard\.md$/, // References planned/future tool paths
      /private\/output\/.+/,                         // Engagement deliverables reference project-specific paths
    ];

    for (const file of allStaged) {
      if (!file) continue;

      // Skip excluded files
      if (excludePatterns.some(pattern => pattern.test(file))) {
        continue;
      }

      // Files that commonly contain path references
      if (
        file.endsWith('.md') ||
        file.endsWith('.ts') ||
        file.endsWith('.js') ||
        file === 'docs/catalogs/tool-catalog.md'
      ) {
        pathFiles.push(file);
      }
    }

    return pathFiles;
  } catch {
    return [];
  }
}

/**
 * Extract file path references from markdown
 */
function extractPathReferences(content: string, sourceFile: string): string[] {
  const paths: string[] = [];

  // Skip TypeScript/JavaScript files (they contain code, not documentation)
  if (sourceFile.endsWith('.ts') || sourceFile.endsWith('.js')) {
    return paths;
  }

  // Strip fenced code blocks first — paths inside them are examples/templates
  const strippedContent = stripFencedCodeBlocks(content);

  // Split content into lines for context checking
  const lines = strippedContent.split('\n');
  const validLines: string[] = [];

  for (const line of lines) {
    // Skip checklist items (lines starting with - [ ] or - [x])
    if (line.match(/^\s*-\s*\[[x\s]\]/i)) {
      continue;
    }
    validLines.push(line);
  }

  const filteredContent = validLines.join('\n');

  // Match common path patterns in markdown
  const patterns = [
    // Markdown links: [text](path/to/file.md)
    /\[([^\]]+)\]\(([^)]+\.(?:md|ts|js|json|yaml|yml))\)/g,
    // See references: See `path/to/file.md`
    /See `([^`]+\.(?:md|ts|js|json|yaml|yml))`/gi,
    // Direct file references: skills/name/SKILL.md
    /(?:^|\s)([a-z0-9_\/-]+\/[A-Z_-]+\.md)(?:\s|$)/gm,
  ];

  for (const pattern of patterns) {
    const matches = filteredContent.matchAll(pattern);
    for (const match of matches) {
      const path = match[2] || match[1];
      if (path && !path.startsWith('http://') && !path.startsWith('https://')) {
        // Skip placeholder examples and template variables
        if (path.includes('/name/') || path.includes('path/to/')) {
          continue;
        }
        if (path.includes('{') || path.includes('}')) {
          continue;
        }

        // Skip input/ directory references (user-provided files, gitignored by design)
        if (path.includes('/input/')) {
          continue;
        }

        // Skip full path demonstrations (e.g., skills/ghost/../../private/docs/env-setup.md)
        if (path.match(/skills\/[a-z0-9-]+\/\.\./)) {
          continue;
        }

        // Resolve relative paths
        if (path.startsWith('./') || path.startsWith('../')) {
          const sourceDir = dirname(sourceFile);
          paths.push(resolve(FRAMEWORK_ROOT, sourceDir, path));
        } else if (!path.startsWith('/')) {
          // Paths starting with framework-level directories are relative to framework root
          const frameworkDirs = ['skills/', 'commands/', 'tools/', 'agents/', 'hooks/', 'methodologies/', 'private/', 'docs/', 'standards/'];
          const isFrameworkPath = frameworkDirs.some(dir => path.startsWith(dir));

          if (isFrameworkPath) {
            // Assume relative to framework root
            paths.push(join(FRAMEWORK_ROOT, path));
          } else {
            // Assume relative to source file's directory
            const sourceDir = dirname(sourceFile);
            paths.push(resolve(FRAMEWORK_ROOT, sourceDir, path));
          }
        }
      }
    }
  }

  return [...new Set(paths)];
}

/**
 * Validate file references in a document
 */
function validateFileReferences(filePath: string): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const fullPath = join(FRAMEWORK_ROOT, filePath);

  if (!existsSync(fullPath)) {
    return issues;
  }

  const content = readFileSync(fullPath, 'utf-8');
  const referencedPaths = extractPathReferences(content, filePath);

  for (const refPath of referencedPaths) {
    if (!existsSync(refPath)) {
      // Make path relative to framework root for cleaner output
      const relPath = refPath.replace(FRAMEWORK_ROOT + '/', '');

      issues.push({
        category: 'broken-reference',
        severity: 'error',
        file: filePath,
        message: `References non-existent file: ${relPath}`
      });
    }
  }

  return issues;
}

/**
 * Validate symlinks in commands/ directory
 */
function validateCommandSymlinks(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!existsSync(COMMANDS_DIR)) {
    return issues;
  }

  const entries = readdirSync(COMMANDS_DIR);

  for (const entry of entries) {
    const symlinkPath = join(COMMANDS_DIR, entry);

    // Skip non-symlinks
    try {
      const stats = lstatSync(symlinkPath);
      if (!stats.isSymbolicLink()) {
        continue;
      }
    } catch {
      continue;
    }

    // Check if symlink target exists
    try {
      const target = readlinkSync(symlinkPath);
      const targetPath = resolve(dirname(symlinkPath), target);

      if (!existsSync(targetPath)) {
        issues.push({
          category: 'broken-symlink',
          severity: 'error',
          file: `commands/${entry}`,
          message: `Symlink target does not exist: ${target}`
        });
      }
    } catch (error) {
      issues.push({
        category: 'invalid-symlink',
        severity: 'error',
        file: `commands/${entry}`,
        message: `Failed to read symlink: ${error}`
      });
    }
  }

  return issues;
}

/**
 * Validate tool catalog references
 */
function validateToolCatalog(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (!existsSync(TOOL_CATALOG_PATH)) {
    return issues;
  }

  const content = readFileSync(TOOL_CATALOG_PATH, 'utf-8');

  // Extract script paths from tool catalog
  const scriptPathRegex = /Location:\s*`([^`]+)`/g;
  const matches = content.matchAll(scriptPathRegex);

  for (const match of matches) {
    const scriptPath = match[1];
    const fullPath = join(FRAMEWORK_ROOT, scriptPath);

    if (!existsSync(fullPath)) {
      issues.push({
        category: 'catalog-broken-path',
        severity: 'error',
        file: 'docs/catalogs/tool-catalog.md',
        message: `Tool catalog references non-existent script: ${scriptPath}`
      });
    }
  }

  return issues;
}

/**
 * Validate script paths in skills
 */
function validateSkillScripts(): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const skillsDir = join(FRAMEWORK_ROOT, 'skills');

  if (!existsSync(skillsDir)) {
    return issues;
  }

  const skills = readdirSync(skillsDir, { withFileTypes: true })
    .filter(entry => entry.isDirectory())
    .map(entry => entry.name);

  for (const skill of skills) {
    const skillMdPath = join(skillsDir, skill, 'SKILL.md');

    if (!existsSync(skillMdPath)) {
      continue;
    }

    const content = readFileSync(skillMdPath, 'utf-8');

    // Extract script references from SKILL.md
    const scriptRegex = /`(scripts\/[^`]+\.(?:ts|js))`/g;
    const matches = content.matchAll(scriptRegex);

    for (const match of matches) {
      const scriptPath = match[1];
      const fullPath = join(skillsDir, skill, scriptPath);

      if (!existsSync(fullPath)) {
        issues.push({
          category: 'skill-broken-script',
          severity: 'warning',
          file: `skills/${skill}/SKILL.md`,
          message: `References non-existent script: ${scriptPath}`
        });
      }
    }
  }

  return issues;
}

/**
 * Validate that skills/X/ and tools/X/ directory references in staged files
 * point to directories that actually exist. Catches stale references after renames.
 */
function validateDirectoryReferences(stagedFiles: string[]): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  // Build set of existing skill and tool directories
  const existingDirs = new Set<string>();
  for (const parentDir of ['skills', 'tools']) {
    const dirPath = join(FRAMEWORK_ROOT, parentDir);
    if (existsSync(dirPath)) {
      for (const entry of readdirSync(dirPath, { withFileTypes: true })) {
        if (entry.isDirectory()) {
          existingDirs.add(`${parentDir}/${entry.name}`);
        }
      }
    }
  }

  // Pattern to match skills/name/ or tools/name/ references
  // Matches: skills/career/, tools/monitor/scripts/server.ts, etc.
  const dirRefRegex = /(?:skills|tools)\/([a-z0-9_-]+)\//g;

  // Placeholder patterns to skip (templates, examples)
  const placeholderNames = new Set([
    'name', 'skill-name', 'tool-name', 'skill_name', 'tool_name',
    '{name}', '{skill}', '{tool}', '[name]', '[skill]', '[tool]',
  ]);

  for (const file of stagedFiles) {
    const fullPath = join(FRAMEWORK_ROOT, file);
    if (!existsSync(fullPath)) continue;

    const rawContent = readFileSync(fullPath, 'utf-8');
    // Strip fenced code blocks and URLs — paths inside them are examples/templates,
    // and external URLs (e.g., https://kali.org/tools/dirb/) are not local references.
    const content = stripUrls(stripFencedCodeBlocks(rawContent));
    const lines = content.split('\n');

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let match: RegExpExecArray | null;
      dirRefRegex.lastIndex = 0;

      while ((match = dirRefRegex.exec(line)) !== null) {
        const dirName = match[1];
        const parentType = match[0].startsWith('skills/') ? 'skills' : 'tools';
        const dirRef = `${parentType}/${dirName}`;

        // Skip placeholders and template variables
        if (placeholderNames.has(dirName) || dirName.includes('{') || dirName.includes('[')) {
          continue;
        }

        // Skip if directory exists
        if (existingDirs.has(dirRef)) {
          continue;
        }

        issues.push({
          category: 'stale-directory-ref',
          severity: 'error',
          file: file,
          message: `Line ${i + 1}: References non-existent directory: ${dirRef}/`
        });
      }
    }
  }

  // Deduplicate: one error per file+directory combo
  const seen = new Set<string>();
  return issues.filter(issue => {
    const key = `${issue.file}:${issue.message.split(': ').pop()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

/**
 * Write log file with detailed results
 */
function writeLog(issues: ValidationIssue[]) {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }

  const timestamp = new Date().toISOString();
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  const logContent = [
    `Path Validation Log - ${timestamp}`,
    `${'='.repeat(60)}`,
    '',
    `Total issues: ${issues.length} (${errors.length} errors, ${warnings.length} warnings)`,
    '',
    ...(errors.length > 0 ? [
      'ERRORS:',
      ...errors.map(e => `  ❌ [${e.category}] ${e.file}\n      ${e.message}`),
      ''
    ] : []),
    ...(warnings.length > 0 ? [
      'WARNINGS:',
      ...warnings.map(w => `  ⚠️  [${w.category}] ${w.file}\n      ${w.message}`),
      ''
    ] : []),
    '',
    'Resolution:',
    '  1. Fix or remove broken path references',
    '  2. Repair broken symlinks in commands/',
    '  3. Update tool catalog with correct paths',
    '  4. Verify skill script references',
    ''
  ].join('\n');

  writeFileSync(LOG_FILE, logContent, 'utf-8');
}

/**
 * Main execution
 */
function main() {
  console.error('🔍 Validating path references...');

  const stagedFiles = getStagedPathFiles();

  if (stagedFiles.length === 0) {
    console.error('✅ No files with path references modified, skipping validation');
    process.exit(0);
  }

  console.error(`   Found ${stagedFiles.length} file(s) to validate`);

  // Run all validation checks
  const issues: ValidationIssue[] = [];

  // Validate file references in staged files
  for (const file of stagedFiles) {
    issues.push(...validateFileReferences(file));
  }

  // Always validate command symlinks and tool catalog (critical paths)
  issues.push(...validateCommandSymlinks());
  issues.push(...validateToolCatalog());

  // Validate skill scripts (less critical, warnings only)
  issues.push(...validateSkillScripts());

  // Validate directory references (catches stale refs after renames)
  issues.push(...validateDirectoryReferences(stagedFiles));

  // Separate errors and warnings
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  if (errors.length === 0) {
    if (warnings.length > 0) {
      console.error(`⚠️  ${warnings.length} warning(s) found (not blocking):`);
      for (const warning of warnings) {
        console.error(`   - [${warning.category}] ${warning.file}`);
        console.error(`     ${warning.message}`);
      }
      console.error('');

      // Write log for warnings
      writeLog(issues);
      console.error(`📝 Detailed log: ${LOG_FILE}`);
      console.error('');
    }

    console.error('✅ Path validation passed!');
    process.exit(0);
  }

  // Validation failed - write log and block commit
  writeLog(issues);

  console.error('');
  console.error('❌ PATH VALIDATION FAILED!');
  console.error('');
  console.error('⚠️  Commit BLOCKED due to broken path references');
  console.error('');

  if (errors.length > 0) {
    console.error(`Errors (${errors.length}):`);
    for (const error of errors) {
      console.error(`  ❌ [${error.category}] ${error.file}`);
      console.error(`     ${error.message}`);
    }
    console.error('');
  }

  if (warnings.length > 0) {
    console.error(`Warnings (${warnings.length}):`);
    for (const warning of warnings) {
      console.error(`  ⚠️  [${warning.category}] ${warning.file}`);
      console.error(`     ${warning.message}`);
    }
    console.error('');
  }

  console.error('Why this matters:');
  console.error('  - Broken paths cause navigation failures');
  console.error('  - Invalid symlinks break command system');
  console.error('  - Incorrect catalog paths prevent tool discovery');
  console.error('');
  console.error('How to fix:');
  console.error('  1. Fix or remove broken file references');
  console.error('  2. Repair symlinks in commands/');
  console.error('  3. Update tool catalog with valid paths');
  console.error('  4. Verify all referenced files exist');
  console.error('');
  console.error(`📝 Detailed log: ${LOG_FILE}`);
  console.error('');

  process.exit(2); // Exit code 2 = BLOCK commit
}

main();
