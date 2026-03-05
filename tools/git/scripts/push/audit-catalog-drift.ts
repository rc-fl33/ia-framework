#!/usr/bin/env bun
/**
 * Catalog Drift Audit Script
 *
 * Checks for drift between:
 * - Skills on disk vs skills catalog
 * - Agents on disk vs agents catalog
 * - Tools on disk vs tool catalog
 *
 * Run as part of git-push to prevent drift from accumulating.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, basename } from 'path';

interface DriftReport {
  category: string;
  onDisk: string[];
  inCatalog: string[];
  missingFromCatalog: string[];
  missingFromDisk: string[];
}

interface AuditResult {
  success: boolean;
  skills: DriftReport;
  agents: DriftReport;
  tools: DriftReport;
  hasDrift: boolean;
}

/**
 * Get all subdirectories in a path
 */
function getDirectories(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter(name => {
      const fullPath = join(path, name);
      return statSync(fullPath).isDirectory();
    });
}

/**
 * Get all tool directories including common nested paths
 */
function getAllToolDirectories(rootPath: string): string[] {
  const topLevel = getDirectories(rootPath);

  // Also check nested paths that are commonly used
  // Map: catalog name -> actual path
  const nestedPathMap: Record<string, string> = {
    'env-sync': 'framework/env-sync',
    'markdown': 'framework/markdown',
    'security': 'framework/security',
    'compliance': 'standards'  // catalog uses 'compliance' but dir is 'standards'
  };

  for (const [dirName, nestedPath] of Object.entries(nestedPathMap)) {
    const nestedFullPath = join(rootPath, nestedPath);
    if (existsSync(nestedFullPath) && !topLevel.includes(dirName)) {
      topLevel.push(dirName);
    }
  }

  return topLevel;
}

/**
 * Get all files (without extension) in a path
 */
function getFilesWithoutExtension(path: string): string[] {
  if (!existsSync(path)) return [];
  return readdirSync(path)
    .filter(name => {
      const fullPath = join(path, name);
      return statSync(fullPath).isFile();
    })
    .map(name => name.replace(/\.\w+$/, '')); // Remove extension
}

/**
 * Extract names from catalog content using regex with capture groups
 */
function extractFromCatalog(catalogPath: string, pattern: RegExp): string[] {
  if (!existsSync(catalogPath)) return [];
  const content = readFileSync(catalogPath, 'utf-8');
  const matches: string[] = [];
  let match;

  // Reset lastIndex since we're reusing the pattern
  pattern.lastIndex = 0;

  while ((match = pattern.exec(content)) !== null) {
    // Use capture group $1 if present, otherwise use full match
    const name = match[1] || match[0];
    matches.push(name.trim());
  }

  return matches;
}

/**
 * Analyze drift between disk and catalog
 */
function analyzeDrift(
  category: string,
  diskPath: string,
  catalogPath: string,
  pattern: RegExp,
  useFiles: boolean = false
): DriftReport {
  const onDisk = useFiles
    ? getFilesWithoutExtension(diskPath).filter(d => !d.startsWith('.') && d !== 'README')
    : getDirectories(diskPath).filter(d => !d.startsWith('.'));
  const inCatalog = extractFromCatalog(catalogPath, pattern).filter(n => n !== 'Skill'); // Exclude table headers

  const onDiskSet = new Set(onDisk);
  const catalogSet = new Set(inCatalog);

  const missingFromCatalog = onDisk.filter(d => !catalogSet.has(d));
  const missingFromDisk = inCatalog.filter(c => !onDiskSet.has(c));

  return {
    category,
    onDisk,
    inCatalog,
    missingFromCatalog,
    missingFromDisk
  };
}

/**
 * Run catalog drift audit
 */
export async function runAudit(rootPath: string): Promise<AuditResult> {
  console.log('\n🔍 Running catalog drift audit...\n');

  const skillsDisk = join(rootPath, 'skills');
  const skillsCatalog = join(rootPath, 'docs/catalogs/skills.md');
  // Skills: match skill names in the table (| skill-name | description | ...)
  // Note: skills can have hyphens (e.g., bug-bounty, code-review)
  const skillsPattern = /^\| ([\w-]+)\s*\|/gm;

  const agentsDisk = join(rootPath, 'agents');
  const agentsCatalog = join(rootPath, 'docs/catalogs/agents.md');
  // Agents: match agent names in the Agent Reference Matrix table
  const agentsPattern = /^\| (\w+)\s*\|\s*(?:\d+|—)/gm;

  const toolsDisk = join(rootPath, 'tools');
  const toolsCatalog = join(rootPath, 'docs/catalogs/tool-catalog.md');
  // Tools: match tool names in the capability index table (second column)
  const toolsPattern = /^\| `[^`]+` \| ([\w-]+) \|/gm;

  const skills = analyzeDrift('Skills', skillsDisk, skillsCatalog, skillsPattern);
  const agents = analyzeDrift('Agents', agentsDisk, agentsCatalog, agentsPattern, true);
  // For tools, use special handler that checks nested paths
  const onDiskTools = getAllToolDirectories(toolsDisk);
  const inCatalogTools = extractFromCatalog(toolsCatalog, toolsPattern);
  const toolsMissingFromCatalog = onDiskTools.filter(d => !inCatalogTools.includes(d));
  // Agent-browser is external npm, not a directory - filter it out
  const toolsMissingFromDisk = inCatalogTools.filter(c => !onDiskTools.includes(c) && c !== 'agent-browser');

  const tools: DriftReport = {
    category: 'Tools',
    onDisk: onDiskTools,
    inCatalog: inCatalogTools,
    missingFromCatalog: toolsMissingFromCatalog,
    missingFromDisk: toolsMissingFromDisk
  };

  // Print report
  console.log('='.repeat(70));
  console.log('CATALOG DRIFT AUDIT REPORT');
  console.log('='.repeat(70));

  const reports = [skills, agents, tools];
  let totalDrift = 0;

  for (const report of reports) {
    console.log(`\n### ${report.category}`);
    console.log(`  On disk: ${report.onDisk.length}`);
    console.log(`  In catalog: ${report.inCatalog.length}`);

    if (report.missingFromCatalog.length > 0) {
      console.log(`  ⚠️  Missing from catalog: ${report.missingFromCatalog.join(', ')}`);
      totalDrift += report.missingFromCatalog.length;
    }

    if (report.missingFromDisk.length > 0) {
      console.log(`  ⚠️  Missing from disk: ${report.missingFromDisk.join(', ')}`);
      totalDrift += report.missingFromDisk.length;
    }

    if (report.missingFromCatalog.length === 0 && report.missingFromDisk.length === 0) {
      console.log(`  ✅ In sync`);
    }
  }

  const hasDrift = totalDrift > 0;

  console.log('\n' + '='.repeat(70));

  if (hasDrift) {
    console.log(`\n⚠️  DRIFT DETECTED: ${totalDrift} issue(s)`);
    console.log('\nTo fix:');
    console.log('  - Add missing entries to catalog docs');
    console.log('  - Or remove unused directories from disk');
  } else {
    console.log('\n✅ ALL CATALOGS IN SYNC - No drift detected!');
  }

  console.log('='.repeat(70) + '\n');

  return {
    success: !hasDrift,
    skills,
    agents,
    tools,
    hasDrift
  };
}

// CLI execution
if (import.meta.main) {
  const rootPath = process.env.GIT_PUSH_REPO_PATH || join(import.meta.dir, '..', '..', '..', '..');
  runAudit(rootPath).then(result => {
    // Catalog drift is informational - don't fail the pipeline
    // User can decide to proceed or fix issues
    process.exit(0);
  });
}
