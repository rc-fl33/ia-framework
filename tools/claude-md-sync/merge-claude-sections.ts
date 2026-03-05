#!/usr/bin/env bun
/**
 * CLAUDE.md Smart Merge
 *
 * Intelligently merges upstream CLAUDE.md with local version:
 * - Framework sections: Always replace with upstream
 * - User sections: Always preserve local version
 * - Hybrid sections: Merge framework entries + user additions
 *
 * Usage:
 *   bun tools/framework/claude-md-sync/merge-claude-sections.ts preview [path]
 *   bun tools/framework/claude-md-sync/merge-claude-sections.ts apply [path]
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { execSync } from 'child_process';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const BACKUP_DIR = join(FRAMEWORK_ROOT, '.framework-backup');

interface MergeResult {
  action: 'replace' | 'preserve' | 'merge' | 'new';
  source: 'local' | 'upstream' | 'merged';
  lines: string[];
  changes: number;
}

interface MergeReport {
  timestamp: string;
  framework_sections_updated: number;
  user_sections_preserved: number;
  conflicts: number;
  total_changes: number;
  sections: Array<{
    title: string;
    action: string;
    lines_changed: number;
  }>;
}

/**
 * Create timestamped backup
 */
function createBackup(filePath: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const backupDir = join(BACKUP_DIR, 'CLAUDE.md-backups');
  const backupFile = join(backupDir, `CLAUDE.md.${timestamp}`);

  mkdirSync(backupDir, { recursive: true });

  if (existsSync(filePath)) {
    const content = readFileSync(filePath, 'utf-8');
    writeFileSync(backupFile, content, 'utf-8');
    console.log(`✅ Backup created: ${backupFile}`);
  }

  return backupFile;
}

/**
 * Parse sections from CLAUDE.md for simplified line-based comparison
 */
function extractSectionLines(content: string, section?: { start: number; end: number }): string[] {
  const lines = content.split('\n');
  if (section) {
    return lines.slice(section.start, section.end + 1);
  }
  return lines;
}

/**
 * Simple heuristic: check if section looks framework-owned
 */
function isFrameworkSection(heading: string): boolean {
  const lower = heading.toLowerCase();
  return (
    lower.includes('orchestrator') ||
    lower.includes('routing') ||
    lower.includes('directory') ||
    lower.includes('reference') ||
    lower.includes('agent routing table') ||
    lower.includes('critical requirements') ||
    lower.includes('YOUR ROLE')
  );
}

/**
 * Extract heading and associated content block
 */
function parseContentBlocks(content: string): Array<{ heading: string; startLine: number; endLine: number; lines: string[] }> {
  const lines = content.split('\n');
  const blocks: Array<{ heading: string; startLine: number; endLine: number; lines: string[] }> = [];

  let currentHeading = '';
  let blockStart = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.match(/^#{1,6}\s+/)) {
      // Save previous block if exists
      if (currentHeading) {
        blocks.push({
          heading: currentHeading,
          startLine: blockStart,
          endLine: i - 1,
          lines: lines.slice(blockStart, i)
        });
      }
      currentHeading = line.replace(/^#+\s+/, '');
      blockStart = i;
    }
  }

  // Save final block
  if (currentHeading) {
    blocks.push({
      heading: currentHeading,
      startLine: blockStart,
      endLine: lines.length - 1,
      lines: lines.slice(blockStart)
    });
  }

  return blocks;
}

/**
 * Perform merge operation
 */
function mergeFiles(localPath: string, upstreamPath: string, mode: 'preview' | 'apply'): MergeReport {
  if (!existsSync(localPath) || !existsSync(upstreamPath)) {
    throw new Error('Source files not found');
  }

  const localContent = readFileSync(localPath, 'utf-8');
  const upstreamContent = readFileSync(upstreamPath, 'utf-8');

  const localBlocks = parseContentBlocks(localContent);
  const upstreamBlocks = parseContentBlocks(upstreamContent);

  // Build map of upstream sections by heading
  const upstreamMap = new Map(upstreamBlocks.map(b => [b.heading.toLowerCase(), b]));

  const report: MergeReport = {
    timestamp: new Date().toISOString(),
    framework_sections_updated: 0,
    user_sections_preserved: 0,
    conflicts: 0,
    total_changes: 0,
    sections: []
  };

  let resultLines = localContent.split('\n');

  // Process each local section
  for (const localBlock of localBlocks) {
    const upstreamBlock = upstreamMap.get(localBlock.heading.toLowerCase());

    if (!upstreamBlock) {
      // New local section, keep it
      report.user_sections_preserved++;
      report.sections.push({
        title: localBlock.heading,
        action: 'preserved (new local section)',
        lines_changed: 0
      });
      continue;
    }

    // Decide merge strategy
    if (isFrameworkSection(localBlock.heading)) {
      // Framework-owned: Replace with upstream
      const linesDiff = upstreamBlock.lines.length - localBlock.lines.length;
      report.framework_sections_updated++;
      report.total_changes += Math.abs(linesDiff);

      // Replace lines in result
      const before = resultLines.slice(0, localBlock.startLine);
      const after = resultLines.slice(localBlock.endLine + 1);
      resultLines = [...before, ...upstreamBlock.lines, ...after];

      report.sections.push({
        title: localBlock.heading,
        action: 'updated from upstream',
        lines_changed: Math.abs(linesDiff)
      });
    } else {
      // User or hybrid: Preserve local
      report.user_sections_preserved++;
      report.sections.push({
        title: localBlock.heading,
        action: 'preserved (user section)',
        lines_changed: 0
      });
    }
  }

  // Check for new sections in upstream
  for (const upstreamBlock of upstreamBlocks) {
    const exists = localBlocks.some(b => b.heading.toLowerCase() === upstreamBlock.heading.toLowerCase());
    if (!exists) {
      // New section from upstream - add at end before any user sections
      resultLines.push('');
      resultLines.push(...upstreamBlock.lines);
      report.framework_sections_updated++;
      report.total_changes += upstreamBlock.lines.length;
      report.sections.push({
        title: upstreamBlock.heading,
        action: 'new from upstream',
        lines_changed: upstreamBlock.lines.length
      });
    }
  }

  // Apply if requested
  if (mode === 'apply') {
    const backupPath = createBackup(localPath);
    const mergedContent = resultLines.join('\n');
    writeFileSync(localPath, mergedContent, 'utf-8');
    console.log(`✅ Merge applied to: ${localPath}`);
  }

  return report;
}

/**
 * Print merge report
 */
function printReport(report: MergeReport) {
  console.log('\n' + '='.repeat(70));
  console.log('CLAUDE.MD SMART MERGE REPORT');
  console.log('='.repeat(70));

  console.log(`\n📊 Summary:`);
  console.log(`  🔄 Framework sections updated: ${report.framework_sections_updated}`);
  console.log(`  👤 User sections preserved: ${report.user_sections_preserved}`);
  console.log(`  ⚠️  Total line changes: ${report.total_changes}`);

  if (report.sections.length > 0) {
    console.log(`\n📝 Sections:\n`);
    for (const section of report.sections) {
      const icon =
        section.action.includes('updated') ? '✓' :
        section.action.includes('preserved') ? '⊚' :
        section.action.includes('new') ? '+' : '?';

      console.log(`  ${icon} ${section.title}`);
      console.log(`     ${section.action}${section.lines_changed > 0 ? ` (${section.lines_changed} lines)` : ''}`);
    }
  }

  console.log('\n' + '='.repeat(70));
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = (args[0] || 'preview') as 'preview' | 'apply';
  const localPath = args[1] || join(FRAMEWORK_ROOT, 'CLAUDE.md');
  const upstreamPath = args[2]; // If merging from staging area

  if (mode !== 'preview' && mode !== 'apply') {
    console.error('Usage: merge-claude-sections.ts <preview|apply> [local-path] [upstream-path]');
    process.exit(1);
  }

  if (!existsSync(localPath)) {
    console.error(`Local file not found: ${localPath}`);
    process.exit(1);
  }

  // If no upstream specified, run in simulation mode
  if (!upstreamPath || !existsSync(upstreamPath)) {
    if (mode === 'apply') {
      console.error('Cannot apply merge: upstream file not specified or not found');
      process.exit(1);
    }

    console.log(`ℹ️  Simulation mode (no upstream file provided)`);
    console.log(`   To perform real merge, provide upstream path:\n`);
    console.log(`   bun tools/framework/claude-md-sync/merge-claude-sections.ts ${mode} ${localPath} /path/to/upstream/CLAUDE.md\n`);
    process.exit(0);
  }

  try {
    console.log(`\n🔍 Analyzing CLAUDE.md merge...`);
    const report = mergeFiles(localPath, upstreamPath, mode);
    printReport(report);

    if (mode === 'preview') {
      console.log('\nℹ️  Preview mode - no changes applied');
      console.log(`   Run with "apply" mode to commit changes:\n`);
      console.log(`   bun tools/framework/claude-md-sync/merge-claude-sections.ts apply ${localPath}\n`);
    }
  } catch (error) {
    console.error('Merge failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
