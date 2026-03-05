#!/usr/bin/env bun
/**
 * Document Reference Validator
 *
 * Scans critical documentation files for broken references and version inconsistencies.
 *
 * Checks:
 * 1. File references - Verifies backtick-quoted paths exist
 * 2. Directory references - Verifies directory paths exist
 * 3. Version consistency - Ensures version strings match across all files
 *
 * Usage:
 *   bun tools/validation/validate-doc-references.ts
 *   bun tools/validation/validate-doc-references.ts --json
 *
 * Exit codes:
 *   0: All references valid
 *   1: Broken references found
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';

// --- Configuration ---

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');

const DOC_LOCATIONS = [
  '*.md',
  'agents/*.md',
  'skills/*/README.md',
  'skills/*/SKILL.md',
  'skills/README.md',
  'docs/README.md',
  'hooks/README.md',
  'tools/README.md',
];

// Historical documents that describe past state -- don't validate references
const EXCLUDED_FILES = [
  'CHANGELOG.md',
];

// --- Types ---

interface BrokenReference {
  file: string;
  line: number;
  reference: string;
  type: 'file' | 'directory';
  message: string;
}

interface VersionReference {
  file: string;
  version: string;
  line: number;
}

interface ValidationReport {
  brokenReferences: BrokenReference[];
  versionMismatches: VersionReference[];
  filesScanned: number;
}

// --- File Discovery ---

function expandGlob(pattern: string): string[] {
  const parts = pattern.split('/');
  let currentPath = FRAMEWORK_ROOT;
  let matches: string[] = [currentPath];

  for (const part of parts) {
    const newMatches: string[] = [];
    for (const base of matches) {
      if (part === '*') {
        // Match all items
        if (existsSync(base)) {
          const items = readdirSync(base);
          for (const item of items) {
            const fullPath = join(base, item);
            newMatches.push(fullPath);
          }
        }
      } else if (part === '*.md') {
        // Match all .md files
        if (existsSync(base)) {
          const items = readdirSync(base);
          for (const item of items) {
            if (item.endsWith('.md')) {
              const fullPath = join(base, item);
              if (statSync(fullPath).isFile()) {
                newMatches.push(fullPath);
              }
            }
          }
        }
      } else {
        // Literal path part
        const fullPath = join(base, part);
        if (existsSync(fullPath)) {
          newMatches.push(fullPath);
        }
      }
    }
    matches = newMatches;
  }

  return matches.filter(p => statSync(p).isFile());
}

function discoverDocFiles(): string[] {
  const files = new Set<string>();
  for (const pattern of DOC_LOCATIONS) {
    const expanded = expandGlob(pattern);
    for (const file of expanded) {
      // Skip historical documents
      const relPath = file.replace(FRAMEWORK_ROOT + '/', '');
      if (EXCLUDED_FILES.includes(relPath)) continue;
      files.add(file);
    }
  }
  return Array.from(files).sort();
}

// --- Reference Extraction ---

function extractReferences(content: string): {
  filePaths: Array<{ path: string; line: number }>;
  dirPaths: Array<{ path: string; line: number }>;
} {
  const lines = content.split('\n');
  const filePaths: Array<{ path: string; line: number }> = [];
  const dirPaths: Array<{ path: string; line: number }> = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    // Skip content inside code blocks
    if (inCodeBlock) continue;

    // Skip URLs
    if (line.includes('http://') || line.includes('https://')) continue;

    // Skip lines that document planned/future files (not yet created)
    if (line.match(/planned|not yet created|future|TODO/i)) continue;

    // Extract backtick-quoted paths with extensions (file references)
    const fileMatches = line.matchAll(/`([^`]+\.[a-z]+)`/g);
    for (const match of fileMatches) {
      const path = match[1];

      // Skip template patterns
      if (path.includes('{') || path.includes('[')) continue;
      // Skip paths with wildcards
      if (path.includes('*')) continue;
      // Skip relative paths with ../
      if (path.includes('../')) continue;
      // Skip obvious code examples and template patterns
      if (path.includes('example') || path.includes('YYYY-MM-DD')) continue;
      // Skip generated output file references (these describe what skills produce)
      if (path.startsWith('output/') || path.match(/^skills\/[^/]+\/output\//)) continue;
      // Skip user-provided input file references
      if (path.match(/^skills\/[^/]+\/input\//)) continue;
      // Skip shell commands (contain spaces before path)
      if (path.includes(' ')) continue;
      // Skip system paths
      if (path.startsWith('/etc/') || path.startsWith('/usr/') ||
          path.startsWith('/var/') || path.startsWith('/home/')) continue;
      // Skip Windows paths
      if (path.match(/^[A-Z]:\\/)) continue;
      // Skip all user home paths (system-dependent)
      if (path.startsWith('~/')) continue;
      // Skip generic directory names (input/, output/, scripts/, templates/, etc.)
      if (path === 'input/' || path === 'output/' || path === 'scripts/' ||
          path === 'templates/' || path === 'phases/' || path === 'api/') continue;
      // Only validate paths that look like framework paths
      if (!path.includes('/') && !path.startsWith('tools/') &&
          !path.startsWith('skills/') && !path.startsWith('docs/') &&
          !path.startsWith('agents/') && !path.startsWith('hooks/')) continue;

      filePaths.push({ path, line: i + 1 });
    }

    // Extract directory paths (ending in /)
    const dirMatches = line.matchAll(/`([^`]+\/)`/g);
    for (const match of dirMatches) {
      const path = match[1];

      // Skip template patterns
      if (path.includes('{') || path.includes('[')) continue;
      // Skip paths with wildcards
      if (path.includes('*')) continue;
      // Skip template date patterns in directory paths
      if (path.includes('YYYY-MM-DD')) continue;
      // Skip generated output directories
      if (path.match(/^skills\/[^/]+\/output\//)) continue;
      // Skip system paths
      if (path.startsWith('/etc/') || path.startsWith('/usr/') ||
          path.startsWith('/var/') || path.startsWith('/home/')) continue;
      // Skip all user home paths (system-dependent)
      if (path.startsWith('~/')) continue;
      // Skip Windows paths
      if (path.match(/^[A-Z]:\\/)) continue;
      // Skip generic directory names
      const genericDirs = ['input/', 'output/', 'scripts/', 'templates/', 'phases/',
                          'api/', 'automation/', 'export/', 'security/', 'services/',
                          'framework/', 'bounty-targets/', 'flux/', 'git/', 'ingestion/',
                          'markdown/', 'migration/', 'monitor/', 'n8n/', 'notmint/',
                          'pdf/', 'prompt-generators/', 'validation/', 'video-analysis/',
                          'app-downloader/', 'deployment/', 'setup/', 'manifest/',
                          'framework-update/', '@/', 'output/research/', 'output/images/'];
      if (genericDirs.includes(path)) continue;
      // Only validate paths that look like specific framework paths
      if (!path.startsWith('tools/') && !path.startsWith('skills/') &&
          !path.startsWith('docs/') && !path.startsWith('agents/') &&
          !path.startsWith('hooks/') && !path.startsWith('~/ia-framework') &&
          !path.startsWith('~/.claude/')) continue;

      dirPaths.push({ path, line: i + 1 });
    }
  }

  return { filePaths, dirPaths };
}

// --- Version Extraction ---

function extractVersions(content: string, filePath: string): VersionReference[] {
  const lines = content.split('\n');
  const versions: VersionReference[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Track code blocks
    if (line.trim().startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) continue;

    // Only match IA framework version strings (version on same line as framework name)
    if (!line.match(/Framework.*v?\d|Intelligence Adjacent.*v?\d/i)) continue;

    const versionMatch = line.match(/\b[vV]?(\d+\.\d+\.\d+)\b/);
    if (versionMatch) {
      versions.push({
        file: filePath,
        version: versionMatch[1],
        line: i + 1,
      });
    }
  }

  return versions;
}

// --- Validation ---

function validateFile(filePath: string): {
  broken: BrokenReference[];
  versions: VersionReference[];
} {
  const content = readFileSync(filePath, 'utf-8');
  const { filePaths, dirPaths } = extractReferences(content);
  const versions = extractVersions(content, filePath);
  const broken: BrokenReference[] = [];
  const fileDir = dirname(filePath);

  // Check file references - always try both relative-to-file AND repo-root
  for (const { path, line } of filePaths) {
    const fromRoot = join(FRAMEWORK_ROOT, path);
    const fromFile = join(fileDir, path);

    const existsFromFile = existsSync(fromFile) && statSync(fromFile).isFile();
    const existsFromRoot = existsSync(fromRoot) && statSync(fromRoot).isFile();

    if (!existsFromFile && !existsFromRoot) {
      broken.push({
        file: filePath,
        line,
        reference: path,
        type: 'file',
        message: 'File not found',
      });
    }
  }

  // Check directory references - always try both
  for (const { path, line } of dirPaths) {
    const fromRoot = join(FRAMEWORK_ROOT, path);
    const fromFile = join(fileDir, path);

    const existsFromFile = existsSync(fromFile) && statSync(fromFile).isDirectory();
    const existsFromRoot = existsSync(fromRoot) && statSync(fromRoot).isDirectory();

    if (!existsFromFile && !existsFromRoot) {
      broken.push({
        file: filePath,
        line,
        reference: path,
        type: 'directory',
        message: 'Directory not found',
      });
    }
  }

  return { broken, versions };
}

// --- Version Consistency Check ---

function checkVersionConsistency(allVersions: VersionReference[]): VersionReference[] {
  if (allVersions.length === 0) return [];

  // Count version occurrences
  const versionCounts = new Map<string, number>();
  for (const v of allVersions) {
    versionCounts.set(v.version, (versionCounts.get(v.version) || 0) + 1);
  }

  // Find the most common version
  let maxCount = 0;
  let primaryVersion = '';
  for (const [version, count] of versionCounts) {
    if (count > maxCount) {
      maxCount = count;
      primaryVersion = version;
    }
  }

  // Return versions that don't match the primary version
  return allVersions.filter(v => v.version !== primaryVersion);
}

// --- Reporting ---

function printReport(report: ValidationReport): void {
  console.log('\n🔍 Document Reference Validator\n');
  console.log(`Scanning ${report.filesScanned} files...\n`);

  if (report.brokenReferences.length === 0 && report.versionMismatches.length === 0) {
    console.log('✅ All references valid and versions consistent\n');
    return;
  }

  // Group broken references by file
  const byFile = new Map<string, BrokenReference[]>();
  for (const ref of report.brokenReferences) {
    const relPath = ref.file.replace(FRAMEWORK_ROOT + '/', '');
    if (!byFile.has(relPath)) {
      byFile.set(relPath, []);
    }
    byFile.get(relPath)!.push(ref);
  }

  // Print broken references
  if (report.brokenReferences.length > 0) {
    for (const [file, refs] of byFile) {
      console.log(`❌ ${file}:`);
      for (const ref of refs) {
        const refType = ref.type === 'file' ? 'file' : 'directory';
        console.log(`   Line ${ref.line}: Reference to \`${ref.reference}\` - ${refType} not found`);
      }
      console.log();
    }
  }

  // Print version mismatches
  if (report.versionMismatches.length > 0) {
    console.log('⚠️  Version inconsistency:');

    // Group by file
    const versionsByFile = new Map<string, VersionReference[]>();
    for (const v of report.versionMismatches) {
      const relPath = v.file.replace(FRAMEWORK_ROOT + '/', '');
      if (!versionsByFile.has(relPath)) {
        versionsByFile.set(relPath, []);
      }
      versionsByFile.get(relPath)!.push(v);
    }

    for (const [file, versions] of versionsByFile) {
      for (const v of versions) {
        console.log(`   ${file}: ${v.version} (line ${v.line})`);
      }
    }
    console.log();
  }

  // Summary
  console.log(`Summary: ${report.brokenReferences.length} broken references in ${byFile.size} files, ${report.versionMismatches.length} version mismatches\n`);
}

// --- Main ---

function main(): void {
  const files = discoverDocFiles();
  const allBroken: BrokenReference[] = [];
  const allVersions: VersionReference[] = [];

  for (const file of files) {
    const { broken, versions } = validateFile(file);
    allBroken.push(...broken);
    allVersions.push(...versions);
  }

  const versionMismatches = checkVersionConsistency(allVersions);

  const report: ValidationReport = {
    brokenReferences: allBroken,
    versionMismatches,
    filesScanned: files.length,
  };

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(report, null, 2));
  } else {
    printReport(report);
  }

  const hasErrors = allBroken.length > 0;
  process.exit(hasErrors ? 1 : 0);
}

main();
