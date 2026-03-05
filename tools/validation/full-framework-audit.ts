#!/usr/bin/env bun
/**
 * Full Framework Audit
 *
 * Comprehensive validation of entire framework (not just staged files).
 * Run periodically or in CI/CD pipeline.
 *
 * Unlike pre-commit hooks (fast, staged files only), this is:
 * - Slower (10-30 seconds for full framework scan)
 * - Thorough (all files)
 * - Comprehensive (all checks)
 *
 * Usage:
 *   bun run tools/validation/full-framework-audit.ts
 *   bun run tools/validation/full-framework-audit.ts --json
 *   bun run tools/validation/full-framework-audit.ts --markdown
 *   bun run tools/validation/full-framework-audit.ts --json --markdown
 */

import { readdirSync, readFileSync, existsSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename, dirname } from 'path';
import matter from 'gray-matter';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';

interface AuditResult {
  timestamp: string;
  summary: {
    totalIssues: number;
    criticalIssues: number;
    warnings: number;
    filesScanned: number;
    duration: number;
  };
  catalogDrift: {
    skillsInFilesystem: string[];
    skillsInCatalog: string[];
    commandsInCatalog: string[];
    missingFromCatalog: string[];
    orphanedInCatalog: string[];
    classificationMismatches: Array<{
      skill: string;
      filesystem: string;
      catalog: string;
    }>;
    skillVsToolConfusion: string[];
  };
  brokenReferences: Array<{
    file: string;
    line: number;
    reference: string;
    type: 'file' | 'directory';
  }>;
  documentationHealth: {
    readme: { hardcodedCounts: number; violations: string[] };
    claudeMd: { staleReferences: string[] };
    catalogCountMismatches: Array<{
      catalog: string;
      claimed: number;
      actual: number;
    }>;
  };
  validationResults: {
    frontmatter: { passed: boolean; issues: string[] };
    crossRefs: { passed: boolean; issues: string[] };
    paths: { passed: boolean; issues: string[] };
  };
}

const startTime = Date.now();
const frameworkRoot = resolveFrameworkRoot();

/**
 * Get all skills from filesystem
 */
function getSkillsFromFilesystem(): string[] {
  const skillsDir = join(frameworkRoot, 'skills');
  if (!existsSync(skillsDir)) return [];

  return readdirSync(skillsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .sort();
}

/**
 * Get skill classification from SKILL.md frontmatter
 */
function getSkillClassification(skillName: string): string {
  const skillMdPath = join(frameworkRoot, 'skills', skillName, 'SKILL.md');
  if (!existsSync(skillMdPath)) return 'unknown';

  try {
    const content = readFileSync(skillMdPath, 'utf-8');
    const { data } = matter(content);
    return data.classification || 'unknown';
  } catch {
    return 'unknown';
  }
}

/**
 * Parse skills from commands.md catalog
 */
function parseSkillsFromCatalog(): Map<string, string> {
  const catalogPath = join(frameworkRoot, 'docs', 'catalogs', 'commands.md');
  if (!existsSync(catalogPath)) return new Map();

  const content = readFileSync(catalogPath, 'utf-8');
  const skillMap = new Map<string, string>();

  // Parse table rows: | /command | desc | agent | skill | classification | ...
  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('| Command |')) {
      inTable = true;
      continue;
    }
    if (!inTable || !line.startsWith('|')) continue;
    if (line.startsWith('|---')) continue;

    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 5) continue;

    const skill = cols[3]; // 4th column is skill
    const classification = cols[4]; // 5th column is classification

    if (skill && skill !== '-' && classification) {
      skillMap.set(skill, classification);
    }
  }

  return skillMap;
}

/**
 * Parse commands from commands.md catalog
 */
function parseCommandsFromCatalog(): string[] {
  const catalogPath = join(frameworkRoot, 'docs', 'catalogs', 'commands.md');
  if (!existsSync(catalogPath)) return [];

  const content = readFileSync(catalogPath, 'utf-8');
  const commands: string[] = [];

  const lines = content.split('\n');
  let inTable = false;

  for (const line of lines) {
    if (line.startsWith('| Command |')) {
      inTable = true;
      continue;
    }
    if (!inTable || !line.startsWith('|')) continue;
    if (line.startsWith('|---')) continue;

    const cols = line.split('|').map(c => c.trim()).filter(Boolean);
    if (cols.length < 1) continue;

    const command = cols[0]; // 1st column is command
    if (command && command.startsWith('`/')) {
      commands.push(command.replace(/`/g, '').replace('/', ''));
    }
  }

  return commands;
}

/**
 * Get count claimed in catalog file
 */
function getClaimedCount(catalogFile: string, pattern: RegExp): number {
  const catalogPath = join(frameworkRoot, 'docs', 'catalogs', catalogFile);
  if (!existsSync(catalogPath)) return 0;

  const content = readFileSync(catalogPath, 'utf-8');
  const match = content.match(pattern);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Validate catalog completeness
 */
function validateCatalogCompleteness(): {
  missingFromCatalog: string[];
  orphanedInCatalog: string[];
  classificationMismatches: Array<{ skill: string; filesystem: string; catalog: string }>;
  skillVsToolConfusion: string[];
} {
  const filesystemSkills = getSkillsFromFilesystem();
  const catalogSkillMap = parseSkillsFromCatalog();
  const catalogSkills = Array.from(new Set(catalogSkillMap.keys())).sort();

  // Skills missing from catalog
  const missingFromCatalog = filesystemSkills.filter(s => !catalogSkills.includes(s));

  // Catalog entries with no corresponding skill directory
  const orphanedInCatalog = catalogSkills.filter(s => !filesystemSkills.includes(s));

  // Classification mismatches
  const classificationMismatches: Array<{ skill: string; filesystem: string; catalog: string }> = [];
  for (const skill of filesystemSkills) {
    if (!catalogSkillMap.has(skill)) continue;

    const fsClassification = getSkillClassification(skill);
    const catalogClassification = catalogSkillMap.get(skill) || 'unknown';

    if (fsClassification !== catalogClassification && fsClassification !== 'unknown') {
      classificationMismatches.push({
        skill,
        filesystem: fsClassification,
        catalog: catalogClassification,
      });
    }
  }

  // Skill vs tool confusion (tools listed as skills in commands.md)
  const skillVsToolConfusion: string[] = [];
  const toolDirs = ['framework-update', 'monitor', 'flux', 'notmint'];
  for (const tool of toolDirs) {
    if (catalogSkills.includes(tool)) {
      skillVsToolConfusion.push(tool);
    }
  }

  return {
    missingFromCatalog,
    orphanedInCatalog,
    classificationMismatches,
    skillVsToolConfusion,
  };
}

/**
 * Strip fenced code blocks from markdown (they contain example paths)
 */
function stripFencedCodeBlocks(content: string): string {
  return content.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

/**
 * Extract path references from markdown content
 */
function extractPathReferences(content: string): string[] {
  const paths: string[] = [];
  const strippedContent = stripFencedCodeBlocks(content);

  // Match backtick-quoted paths: `path/to/file.ext`
  const backtickPattern = /`([a-zA-Z0-9_/-]+\.[a-z]{1,5})`/g;
  let match;
  while ((match = backtickPattern.exec(strippedContent)) !== null) {
    const path = match[1];
    // Skip common false positives
    if (path.includes('example') || path.includes('placeholder') || path.includes('*')) {
      continue;
    }
    paths.push(path);
  }

  // Match markdown links: [text](path)
  const linkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
  while ((match = linkPattern.exec(strippedContent)) !== null) {
    const path = match[2];
    // Skip URLs and anchors
    if (path.startsWith('http') || path.startsWith('#')) continue;
    paths.push(path);
  }

  return paths;
}

/**
 * Validate documentation references
 */
function validateDocumentationReferences(): Array<{
  file: string;
  line: number;
  reference: string;
  type: 'file' | 'directory';
}> {
  const issues: Array<{ file: string; line: number; reference: string; type: 'file' | 'directory' }> = [];

  // Get all markdown files (excluding sessions, audits, node_modules, archive, logs)
  // Session files and audit reports contain historical references and examples that may not exist
  const excludeHistoricalFiles = /\/(sessions|audits)\//;
  const markdownFiles = findMarkdownFiles(frameworkRoot, excludeHistoricalFiles);

  for (const file of markdownFiles) {
    try {
      const content = readFileSync(file, 'utf-8');
      const refs = extractPathReferences(content);

      for (const ref of refs) {
        // Resolve relative to file location or framework root
        const absoluteRef = ref.startsWith('/')
          ? join(frameworkRoot, ref)
          : join(dirname(file), ref);

        if (!existsSync(absoluteRef)) {
          // Find line number where reference appears
          const lines = content.split('\n');
          let lineNum = 0;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(ref)) {
              lineNum = i + 1;
              break;
            }
          }

          issues.push({
            file: file.replace(frameworkRoot + '/', ''),
            line: lineNum,
            reference: ref,
            type: 'file',
          });
        }
      }
    } catch (err) {
      // Skip files that can't be read
      continue;
    }
  }

  return issues;
}

/**
 * Find all markdown files (recursive)
 */
function findMarkdownFiles(dir: string, excludePattern?: RegExp): string[] {
  const files: string[] = [];
  const excludeDirs = ['node_modules', 'archive', 'logs', '.git', '.framework-staging', '.framework-backup'];

  try {
    const entries = readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      if (entry.isDirectory()) {
        if (!excludeDirs.includes(entry.name)) {
          files.push(...findMarkdownFiles(fullPath, excludePattern));
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        // Apply exclude pattern if provided
        if (excludePattern && excludePattern.test(fullPath)) {
          continue;
        }
        files.push(fullPath);
      }
    }
  } catch {
    // Skip directories we can't read
  }

  return files;
}

/**
 * Check README for hardcoded counts
 */
function checkReadmeHardcodedCounts(): { count: number; violations: string[] } {
  const readmePath = join(frameworkRoot, 'README.md');
  if (!existsSync(readmePath)) return { count: 0, violations: [] };

  const content = readFileSync(readmePath, 'utf-8');
  const violations: string[] = [];

  // Pattern: "N skills", "N commands", etc. (where N is a number)
  const countPattern = /\b(\d+)\s+(skills?|commands?|agents?|tools?)\b/gi;
  let match;

  while ((match = countPattern.exec(content)) !== null) {
    violations.push(`Line mentions "${match[0]}" (should use dynamic count or generic language)`);
  }

  return { count: violations.length, violations };
}

/**
 * Check CLAUDE.md for stale references
 */
function checkClaudeMdStaleReferences(): string[] {
  const claudeMdPath = join(frameworkRoot, 'CLAUDE.md');
  if (!existsSync(claudeMdPath)) return [];

  const content = readFileSync(claudeMdPath, 'utf-8');
  const staleRefs: string[] = [];

  // Check for references to deprecated paths or patterns
  const deprecatedPatterns = [
    { pattern: /library\/catalogs/g, replacement: 'docs/catalogs' },
    { pattern: /tools\/security\/schemas/g, note: 'check if path still valid' },
  ];

  for (const { pattern, replacement, note } of deprecatedPatterns) {
    if (pattern.test(content)) {
      staleRefs.push(`Contains deprecated pattern: ${pattern.source} ${note ? `(${note})` : replacement ? `(use ${replacement})` : ''}`);
    }
  }

  return staleRefs;
}

/**
 * Check catalog count mismatches
 */
function checkCatalogCountMismatches(): Array<{
  catalog: string;
  claimed: number;
  actual: number;
}> {
  const mismatches: Array<{ catalog: string; claimed: number; actual: number }> = [];

  // Skills count
  const skillsClaimed = getClaimedCount('commands.md', /\*\*Total Commands:\*\*\s+(\d+)/);
  const commandsActual = parseCommandsFromCatalog().length;
  if (skillsClaimed > 0 && skillsClaimed !== commandsActual) {
    mismatches.push({
      catalog: 'commands.md (Total Commands)',
      claimed: skillsClaimed,
      actual: commandsActual,
    });
  }

  // Actual skills count
  const skillsActual = getSkillsFromFilesystem().length;
  const catalogSkills = Array.from(new Set(parseSkillsFromCatalog().keys()));
  if (catalogSkills.length !== skillsActual) {
    mismatches.push({
      catalog: 'commands.md (unique skills referenced)',
      claimed: catalogSkills.length,
      actual: skillsActual,
    });
  }

  return mismatches;
}

/**
 * Run basic frontmatter validation on all SKILL.md files
 */
function validateAllFrontmatter(): { passed: boolean; issues: string[] } {
  const issues: string[] = [];
  const skills = getSkillsFromFilesystem();

  for (const skill of skills) {
    const skillMdPath = join(frameworkRoot, 'skills', skill, 'SKILL.md');
    if (!existsSync(skillMdPath)) {
      issues.push(`${skill}: Missing SKILL.md`);
      continue;
    }

    try {
      const content = readFileSync(skillMdPath, 'utf-8');
      const { data } = matter(content);

      // Check required fields
      const requiredFields = ['name', 'description', 'agent', 'classification'];
      for (const field of requiredFields) {
        if (!data[field]) {
          issues.push(`${skill}: Missing frontmatter field: ${field}`);
        }
      }

      // Check classification is valid
      if (data.classification && !['public', 'private'].includes(data.classification)) {
        issues.push(`${skill}: Invalid classification: ${data.classification}`);
      }
    } catch (err) {
      issues.push(`${skill}: Failed to parse frontmatter: ${(err as Error).message}`);
    }
  }

  return { passed: issues.length === 0, issues };
}

/**
 * Run the full audit
 */
async function runFullAudit(): Promise<AuditResult> {
  console.log('Starting full framework audit...');
  console.log(`Framework root: ${frameworkRoot}\n`);

  // Catalog drift
  console.log('[1/6] Validating catalog completeness...');
  const catalogDrift = validateCatalogCompleteness();
  const filesystemSkills = getSkillsFromFilesystem();
  const catalogSkills = Array.from(new Set(parseSkillsFromCatalog().keys()));
  const catalogCommands = parseCommandsFromCatalog();

  // Documentation references
  console.log('[2/6] Validating documentation references...');
  const brokenReferences = validateDocumentationReferences();

  // Documentation health
  console.log('[3/6] Checking README.md...');
  const readmeCheck = checkReadmeHardcodedCounts();

  console.log('[4/6] Checking CLAUDE.md...');
  const claudeMdCheck = checkClaudeMdStaleReferences();

  console.log('[5/6] Checking catalog counts...');
  const catalogCountMismatches = checkCatalogCountMismatches();

  // Frontmatter validation
  console.log('[6/6] Validating frontmatter...');
  const frontmatterValidation = validateAllFrontmatter();

  const duration = (Date.now() - startTime) / 1000;
  // Count files actually validated (excluding sessions and audits)
  const excludeHistoricalFiles = /\/(sessions|audits)\//;
  const markdownFiles = findMarkdownFiles(frameworkRoot, excludeHistoricalFiles);

  // Calculate summary
  const totalIssues =
    catalogDrift.missingFromCatalog.length +
    catalogDrift.orphanedInCatalog.length +
    catalogDrift.classificationMismatches.length +
    catalogDrift.skillVsToolConfusion.length +
    brokenReferences.length +
    readmeCheck.count +
    claudeMdCheck.length +
    catalogCountMismatches.length +
    frontmatterValidation.issues.length;

  const criticalIssues =
    catalogDrift.missingFromCatalog.length +
    catalogDrift.classificationMismatches.length +
    frontmatterValidation.issues.length;

  const warnings =
    catalogDrift.orphanedInCatalog.length +
    catalogDrift.skillVsToolConfusion.length +
    brokenReferences.length +
    readmeCheck.count +
    claudeMdCheck.length +
    catalogCountMismatches.length;

  return {
    timestamp: new Date().toISOString(),
    summary: {
      totalIssues,
      criticalIssues,
      warnings,
      filesScanned: markdownFiles.length,
      duration,
    },
    catalogDrift: {
      skillsInFilesystem: filesystemSkills,
      skillsInCatalog: catalogSkills,
      commandsInCatalog: catalogCommands,
      ...catalogDrift,
    },
    brokenReferences,
    documentationHealth: {
      readme: { hardcodedCounts: readmeCheck.count, violations: readmeCheck.violations },
      claudeMd: { staleReferences: claudeMdCheck },
      catalogCountMismatches,
    },
    validationResults: {
      frontmatter: frontmatterValidation,
      crossRefs: { passed: catalogDrift.missingFromCatalog.length === 0, issues: [] },
      paths: { passed: brokenReferences.length === 0, issues: [] },
    },
  };
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(result: AuditResult): string {
  const lines: string[] = [];

  lines.push('# Framework Audit Report');
  lines.push('');
  lines.push(`**Date:** ${result.timestamp}`);
  lines.push(`**Duration:** ${result.summary.duration.toFixed(2)}s`);
  lines.push(`**Files Scanned:** ${result.summary.filesScanned}`);
  lines.push('');

  lines.push('## Executive Summary');
  lines.push('');
  lines.push(`- **Critical Issues:** ${result.summary.criticalIssues}`);
  lines.push(`- **Warnings:** ${result.summary.warnings}`);
  lines.push(`- **Total Issues:** ${result.summary.totalIssues}`);
  lines.push('');

  if (result.summary.totalIssues === 0) {
    lines.push('✅ **All checks passed!**');
    lines.push('');
    return lines.join('\n');
  }

  lines.push('## Catalog Drift');
  lines.push('');
  lines.push(`**Skills in filesystem:** ${result.catalogDrift.skillsInFilesystem.length}`);
  lines.push(`**Skills referenced in catalog:** ${result.catalogDrift.skillsInCatalog.length}`);
  lines.push(`**Commands in catalog:** ${result.catalogDrift.commandsInCatalog.length}`);
  lines.push('');

  if (result.catalogDrift.missingFromCatalog.length > 0) {
    lines.push('### Skills Missing from Catalog');
    for (const skill of result.catalogDrift.missingFromCatalog) {
      const classification = getSkillClassification(skill);
      lines.push(`- \`${skill}\` (classification: ${classification})`);
    }
    lines.push('');
  }

  if (result.catalogDrift.orphanedInCatalog.length > 0) {
    lines.push('### Orphaned Catalog Entries');
    lines.push('Skills referenced in catalog but not found in filesystem:');
    for (const skill of result.catalogDrift.orphanedInCatalog) {
      lines.push(`- \`${skill}\``);
    }
    lines.push('');
  }

  if (result.catalogDrift.classificationMismatches.length > 0) {
    lines.push('### Classification Mismatches');
    for (const mismatch of result.catalogDrift.classificationMismatches) {
      lines.push(`- \`${mismatch.skill}\`: filesystem says "${mismatch.filesystem}", catalog says "${mismatch.catalog}"`);
    }
    lines.push('');
  }

  if (result.catalogDrift.skillVsToolConfusion.length > 0) {
    lines.push('### Skill vs Tool Confusion');
    lines.push('Tools listed as skills in commands.md (should be skill: "-" or skill: "framework"):');
    for (const item of result.catalogDrift.skillVsToolConfusion) {
      lines.push(`- \`${item}\``);
    }
    lines.push('');
  }

  if (result.brokenReferences.length > 0) {
    lines.push('## Broken References');
    lines.push('');
    const grouped = result.brokenReferences.reduce((acc, ref) => {
      if (!acc[ref.file]) acc[ref.file] = [];
      acc[ref.file].push(ref);
      return acc;
    }, {} as Record<string, typeof result.brokenReferences>);

    for (const [file, refs] of Object.entries(grouped)) {
      lines.push(`### ${file}`);
      for (const ref of refs) {
        lines.push(`- Line ${ref.line}: \`${ref.reference}\` (${ref.type} not found)`);
      }
      lines.push('');
    }
  }

  lines.push('## Documentation Health');
  lines.push('');

  if (result.documentationHealth.readme.hardcodedCounts > 0) {
    lines.push('### README.md');
    lines.push(`**Hardcoded counts found:** ${result.documentationHealth.readme.hardcodedCounts}`);
    for (const violation of result.documentationHealth.readme.violations) {
      lines.push(`- ${violation}`);
    }
    lines.push('');
  }

  if (result.documentationHealth.claudeMd.staleReferences.length > 0) {
    lines.push('### CLAUDE.md');
    for (const ref of result.documentationHealth.claudeMd.staleReferences) {
      lines.push(`- ${ref}`);
    }
    lines.push('');
  }

  if (result.documentationHealth.catalogCountMismatches.length > 0) {
    lines.push('### Catalog Count Mismatches');
    for (const mismatch of result.documentationHealth.catalogCountMismatches) {
      lines.push(`- ${mismatch.catalog}: claims ${mismatch.claimed}, actual: ${mismatch.actual}`);
    }
    lines.push('');
  }

  if (result.validationResults.frontmatter.issues.length > 0) {
    lines.push('## Frontmatter Validation');
    lines.push('');
    for (const issue of result.validationResults.frontmatter.issues) {
      lines.push(`- ${issue}`);
    }
    lines.push('');
  }

  lines.push('## Recommendations');
  lines.push('');

  if (result.catalogDrift.missingFromCatalog.length > 0) {
    lines.push('1. Run `bun run tools/docs/generate-catalogs.ts` to sync catalog with filesystem');
  }

  if (result.documentationHealth.readme.hardcodedCounts > 0) {
    lines.push('2. Remove hardcoded counts from README.md (use dynamic generation or generic language)');
  }

  if (result.validationResults.frontmatter.issues.length > 0) {
    lines.push('3. Fix frontmatter issues in SKILL.md files');
  }

  if (result.brokenReferences.length > 0) {
    lines.push('4. Fix broken path references in documentation');
  }

  lines.push('');

  return lines.join('\n');
}

/**
 * Main execution
 */
async function main() {
  const result = await runFullAudit();

  console.log('\n' + '='.repeat(60));
  console.log('AUDIT COMPLETE');
  console.log('='.repeat(60));
  console.log(`Duration: ${result.summary.duration.toFixed(2)}s`);
  console.log(`Files scanned: ${result.summary.filesScanned}`);
  console.log(`Critical issues: ${result.summary.criticalIssues}`);
  console.log(`Warnings: ${result.summary.warnings}`);
  console.log(`Total issues: ${result.summary.totalIssues}`);
  console.log('='.repeat(60) + '\n');

  // Generate outputs based on flags
  const shouldOutputJson = process.argv.includes('--json');
  const shouldOutputMarkdown = process.argv.includes('--markdown');

  if (shouldOutputJson || shouldOutputMarkdown) {
    const logsDir = join(frameworkRoot, 'logs', 'validation');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split('T')[0];

    if (shouldOutputJson) {
      const jsonPath = join(logsDir, `framework-audit-${timestamp}.json`);
      writeFileSync(jsonPath, JSON.stringify(result, null, 2));
      console.log(`JSON report written to: ${jsonPath.replace(frameworkRoot + '/', '')}`);
    }

    if (shouldOutputMarkdown) {
      const docsDir = join(frameworkRoot, 'docs', 'audits');
      if (!existsSync(docsDir)) {
        mkdirSync(docsDir, { recursive: true });
      }

      const mdPath = join(docsDir, `framework-audit-${timestamp}.md`);
      const markdown = generateMarkdownReport(result);
      writeFileSync(mdPath, markdown);
      console.log(`Markdown report written to: ${mdPath.replace(frameworkRoot + '/', '')}`);
    }
  } else {
    // Default: output markdown to console
    console.log(generateMarkdownReport(result));
  }

  // Exit with appropriate code
  process.exit(result.summary.totalIssues > 0 ? 1 : 0);
}

main();
