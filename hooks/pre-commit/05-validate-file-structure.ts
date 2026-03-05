#!/usr/bin/env bun
/**
 * Framework File Structure Validator
 *
 * Pre-commit hook that validates file structure across the entire framework.
 * Reads canonical structure from .framework-structure.yaml (SINGLE SOURCE OF TRUTH)
 *
 * Checks:
 * 1. Skills follow skill structure (SKILL.md, STATUS.md, README.md, VERIFY.md only in root)
 * 2. Framework root doesn't have stray files
 * 3. Files are in correct locations per standards
 * 4. Proper subdirectory usage
 *
 * Exit codes:
 * 0 = All checks passed
 * 1 = Warnings (allow commit)
 * 2 = Errors (block commit)
 */

import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, basename, extname } from 'path';
import { parse as parseYaml } from 'yaml';

// Framework paths - self-discover from script location
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const STRUCTURE_FILE = join(FRAMEWORK_ROOT, '.framework-structure.yaml');

// Type definition for framework structure
interface FrameworkStructure {
  version?: string;
  root?: {
    files?: string[];
    directories?: string[];
    violations?: string[];
  };
  skills?: {
    root_files?: string[];
    subdirectories?: string[];
    violations?: string[];
  };
  [key: string]: unknown;
}

// Load canonical structure
let STRUCTURE: FrameworkStructure | null = null;
try {
  const structureContent = readFileSync(STRUCTURE_FILE, 'utf-8');
  STRUCTURE = parseYaml(structureContent);
} catch (err) {
  console.error(`   ❌ Cannot load .framework-structure.yaml: ${err}`);
  process.exit(2);
}

// Get structure from loaded YAML
const ALLOWED_FRAMEWORK_ROOT = STRUCTURE?.root?.files || [];
const ALLOWED_FRAMEWORK_DIRS = STRUCTURE?.root?.directories || [];
const ROOT_VIOLATION_PATTERNS = STRUCTURE?.root?.violations || [];

const ALLOWED_SKILL_ROOT_FILES = STRUCTURE?.skills?.root_files || [];
const VALID_SKILL_SUBDIRS = STRUCTURE?.skills?.subdirectories || [];
const SKILL_VIOLATION_PATTERNS = STRUCTURE?.skills?.violations || [];

interface Issue {
  path: string;
  issue: string;
  suggestion: string;
  severity: 'error' | 'warning';
}

const issues: Issue[] = [];

/**
 * Check if filename matches any violation pattern
 */
function matchesViolationPattern(filename: string, patterns: string[]): boolean {
  for (const pattern of patterns) {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    const regex = new RegExp(`^${regexPattern}$`);
    if (regex.test(filename)) {
      return true;
    }
  }
  return false;
}

/**
 * Check framework root for stray files
 */
function validateFrameworkRoot(): void {
  if (!existsSync(FRAMEWORK_ROOT)) return;

  try {
    const entries = readdirSync(FRAMEWORK_ROOT, { withFileTypes: true });

    for (const entry of entries) {
      // Skip hidden files/directories not in allowed list
      if (entry.name.startsWith('.') && !ALLOWED_FRAMEWORK_ROOT.includes(entry.name) && !ALLOWED_FRAMEWORK_DIRS.includes(entry.name)) {
        continue;
      }

      if (entry.isFile() && !ALLOWED_FRAMEWORK_ROOT.includes(entry.name)) {
        // Check if it matches a violation pattern
        if (matchesViolationPattern(entry.name, ROOT_VIOLATION_PATTERNS)) {
          issues.push({
            path: entry.name,
            issue: 'File violates framework structure rules',
            suggestion: 'Move to plans/, docs/, or appropriate subdirectory per .framework-structure.yaml',
            severity: 'error'
          });
        } else {
          issues.push({
            path: entry.name,
            issue: 'File in framework root should be in subdirectory',
            suggestion: 'Move to docs/, plans/, sessions/, or appropriate subdirectory',
            severity: 'error'
          });
        }
      }

      if (entry.isDirectory() && !ALLOWED_FRAMEWORK_DIRS.includes(entry.name)) {
        issues.push({
          path: entry.name + '/',
          issue: 'Invalid directory in framework root',
          suggestion: `Valid directories: ${ALLOWED_FRAMEWORK_DIRS.join(', ')}`,
          severity: 'error'
        });
      }
    }
  } catch (err) {
    // Can't read framework root
  }
}

/**
 * Check skill directory structure
 */
function validateSkillStructure(skillPath: string): void {
  const skillName = basename(skillPath);

  try {
    const entries = readdirSync(skillPath, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        if (!ALLOWED_SKILL_ROOT_FILES.includes(entry.name)) {
          // Check if it matches a skill violation pattern
          if (matchesViolationPattern(entry.name, SKILL_VIOLATION_PATTERNS)) {
            issues.push({
              path: `skills/${skillName}/${entry.name}`,
              issue: 'File violates skill structure rules',
              suggestion: 'Move to docs/, templates/, or scripts/ per .framework-structure.yaml',
              severity: 'error'
            });
          } else {
            issues.push({
              path: `skills/${skillName}/${entry.name}`,
              issue: 'File in skill root should be in subdirectory',
              suggestion: 'Move to docs/, templates/, scripts/, or appropriate subdirectory',
              severity: 'error'
            });
          }
        }
      }

      if (entry.isDirectory() && !entry.name.startsWith('.')) {
        if (!VALID_SKILL_SUBDIRS.includes(entry.name)) {
          // Allow nested skills (e.g., compliance/nist/assessment)
          const nestedSkillMd = join(skillPath, entry.name, 'SKILL.md');
          if (!existsSync(nestedSkillMd)) {
            issues.push({
              path: `skills/${skillName}/${entry.name}/`,
              issue: 'Invalid subdirectory in skill',
              suggestion: `Valid subdirectories: ${VALID_SKILL_SUBDIRS.join(', ')}`,
              severity: 'error'
            });
          }
        }
      }
    }
  } catch (err) {
    // Can't read skill directory
  }
}

/**
 * Validate all skills
 */
function validateAllSkills(): void {
  const skillsDir = join(FRAMEWORK_ROOT, 'skills');
  if (!existsSync(skillsDir)) return;

  try {
    const entries = readdirSync(skillsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (entry.name === 'README.md') continue;

      const skillPath = join(skillsDir, entry.name);
      validateSkillStructure(skillPath);

      // Check for nested skills
      try {
        const nestedEntries = readdirSync(skillPath, { withFileTypes: true });
        for (const nested of nestedEntries) {
          if (!nested.isDirectory()) continue;
          if (VALID_SKILL_SUBDIRS.includes(nested.name)) continue;

          const nestedPath = join(skillPath, nested.name);
          const nestedSkillMd = join(nestedPath, 'SKILL.md');

          if (existsSync(nestedSkillMd)) {
            validateSkillStructure(nestedPath);
          }
        }
      } catch {
        // Can't read nested directory
      }
    }
  } catch (err) {
    // Can't read skills directory
  }
}

/**
 * Check docs directory structure
 */
function validateDocsStructure(): void {
  const docsDir = join(FRAMEWORK_ROOT, 'docs');
  if (!existsSync(docsDir)) return;

  try {
    const entries = readdirSync(docsDir, { withFileTypes: true });

    for (const entry of entries) {
      // Docs can have subdirectories and .md files
      // Just check for obviously misplaced files
      if (entry.isFile()) {
        const ext = extname(entry.name);
        if (ext && ext !== '.md' && ext !== '.pdf') {
          issues.push({
            path: `docs/${entry.name}`,
            issue: 'Non-documentation file in docs/',
            suggestion: 'Move scripts to tools/, images to appropriate skill, etc.',
            severity: 'warning'
          });
        }
      }
    }
  } catch (err) {
    // Can't read docs directory
  }
}

/**
 * Check plans directory structure
 */
function validatePlansStructure(): void {
  const plansDir = join(FRAMEWORK_ROOT, 'plans');
  if (!existsSync(plansDir)) return;

  try {
    const entries = readdirSync(plansDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        // Plans should follow YYYY-MM-DD-name.md pattern
        if (!entry.name.match(/^\d{4}-\d{2}-\d{2}-.+\.md$/)) {
          issues.push({
            path: `plans/${entry.name}`,
            issue: 'Plan file does not follow naming convention',
            suggestion: 'Plans should use format: YYYY-MM-DD-description.md',
            severity: 'warning'
          });
        }
      }

      if (entry.isDirectory()) {
        issues.push({
          path: `plans/${entry.name}/`,
          issue: 'Subdirectories not allowed in plans/',
          suggestion: 'Plans should be flat .md files, move subdirectories elsewhere',
          severity: 'error'
        });
      }
    }
  } catch (err) {
    // Can't read plans directory
  }
}

/**
 * Check sessions directory structure
 */
function validateSessionsStructure(): void {
  const sessionsDir = join(FRAMEWORK_ROOT, 'sessions');
  if (!existsSync(sessionsDir)) return;

  try {
    const entries = readdirSync(sessionsDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isFile()) {
        const ext = extname(entry.name);
        if (ext !== '.md' && ext !== '.yaml' && ext !== '.yml') {
          issues.push({
            path: `sessions/${entry.name}`,
            issue: 'Non-session file in sessions/',
            suggestion: 'Sessions should be .md or .yaml files only',
            severity: 'warning'
          });
        }
      }

      if (entry.isDirectory()) {
        issues.push({
          path: `sessions/${entry.name}/`,
          issue: 'Subdirectories not allowed in sessions/',
          suggestion: 'Sessions should be flat files, move subdirectories elsewhere',
          severity: 'error'
        });
      }
    }
  } catch (err) {
    // Can't read sessions directory
  }
}

/**
 * Main validation
 */
function main(): void {
  console.log('   Checking framework file structure...');

  // Run all validations
  validateFrameworkRoot();
  validateAllSkills();
  validateDocsStructure();
  validatePlansStructure();
  validateSessionsStructure();

  // Report results
  const errors = issues.filter(i => i.severity === 'error');
  const warnings = issues.filter(i => i.severity === 'warning');

  if (errors.length > 0) {
    console.log(`   ❌ ${errors.length} file structure error(s):`);
    for (const error of errors.slice(0, 5)) {
      console.log(`      ${error.path}`);
      console.log(`         ${error.issue}`);
      console.log(`         ${error.suggestion}`);
    }
    if (errors.length > 5) {
      console.log(`      ... and ${errors.length - 5} more`);
    }
    process.exit(2); // Block commit
  }

  if (warnings.length > 0) {
    console.log(`   ⚠️  ${warnings.length} file structure warning(s):`);
    for (const warning of warnings.slice(0, 3)) {
      console.log(`      ${warning.path}: ${warning.issue}`);
    }
    if (warnings.length > 3) {
      console.log(`      ... and ${warnings.length - 3} more`);
    }
    console.log('   ✅ Warnings only, allowing commit');
    process.exit(0); // Allow commit with warnings
  }

  console.log('   ✅ File structure valid');
  process.exit(0);
}

main();
