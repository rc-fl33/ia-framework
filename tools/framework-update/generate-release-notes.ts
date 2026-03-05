#!/usr/bin/env bun
/**
 * Release Notes Generator
 *
 * Read .framework-manifest.yaml and generate user-facing release notes with:
 * - Severity grouping (CRITICAL, STANDARD, OPTIONAL)
 * - Action required descriptions
 * - Migration guide links
 * - Breaking change warnings
 *
 * Usage:
 *   bun tools/framework-update/generate-release-notes.ts [--json] [--severity critical|standard|optional]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const MANIFEST_PATH = join(FRAMEWORK_ROOT, '.framework-manifest.yaml');

interface ChangelogEntry {
  version: string;
  severity: 'critical' | 'standard' | 'optional';
  type: 'security_fix' | 'breaking_change' | 'feature' | 'improvement' | 'bug_fix' | 'enhancement';
  summary: string;
  action_required: string;
  migration_guide?: string;
  applied: boolean;
}

interface ReleaseNotes {
  critical: ChangelogEntry[];
  standard: ChangelogEntry[];
  optional: ChangelogEntry[];
  summary: {
    criticalCount: number;
    standardCount: number;
    optionalCount: number;
    breakingChanges: number;
  };
  generatedAt: string;
}

/**
 * Load changelog entries from manifest
 */
function loadChangelogEntries(): ChangelogEntry[] {
  if (!existsSync(MANIFEST_PATH)) {
    throw new Error(`.framework-manifest.yaml not found: ${MANIFEST_PATH}`);
  }

  try {
    const content = readFileSync(MANIFEST_PATH, 'utf-8');
    const manifest = yaml.load(content) as any;

    if (!manifest.updates?.changelog_entries) {
      return [];
    }

    return manifest.updates.changelog_entries as ChangelogEntry[];
  } catch (error) {
    throw new Error(`Failed to load changelog entries: ${error instanceof Error ? error.message : error}`);
  }
}

/**
 * Generate release notes
 */
function generateReleaseNotes(): ReleaseNotes {
  const entries = loadChangelogEntries();

  // Organize by severity
  const critical = entries.filter(e => e.severity === 'critical');
  const standard = entries.filter(e => e.severity === 'standard');
  const optional = entries.filter(e => e.severity === 'optional');

  const breakingChanges = entries.filter(
    e => e.type === 'breaking_change' || e.type === 'security_fix'
  ).length;

  return {
    critical,
    standard,
    optional,
    summary: {
      criticalCount: critical.length,
      standardCount: standard.length,
      optionalCount: optional.length,
      breakingChanges
    },
    generatedAt: new Date().toISOString()
  };
}

/**
 * Format release notes for display
 */
function formatReleaseNotes(notes: ReleaseNotes, severity?: string): string {
  const lines: string[] = [];

  lines.push('\n' + '='.repeat(70));
  lines.push('IA FRAMEWORK - RELEASE NOTES');
  lines.push('='.repeat(70));

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  lines.push(`\nGenerated: ${dateStr}`);
  lines.push(`Unreleased updates: ${notes.summary.criticalCount + notes.summary.standardCount + notes.summary.optionalCount}`);

  // Critical updates
  if (notes.critical.length > 0 && (!severity || severity === 'critical')) {
    lines.push('\n' + '─'.repeat(70));
    lines.push('🔴 CRITICAL UPDATES - ACTION REQUIRED');
    lines.push('─'.repeat(70));

    for (const entry of notes.critical) {
      lines.push(`\n${entry.summary}`);
      lines.push(`  Type: ${entry.type}`);
      lines.push(`  Action: ${entry.action_required}`);

      if (entry.migration_guide) {
        lines.push(`  📖 Migration Guide: ${entry.migration_guide}`);
      }

      if (entry.type === 'security_fix' || entry.type === 'breaking_change') {
        lines.push('  ⚠️  IMPORTANT: This update contains breaking changes or security fixes');
      }
    }

    if (notes.critical.length > 0) {
      lines.push('\n⚠️  These updates require immediate attention before other updates can be applied.');
    }
  }

  // Standard updates
  if (notes.standard.length > 0 && (!severity || severity === 'standard')) {
    lines.push('\n' + '─'.repeat(70));
    lines.push('🟡 STANDARD UPDATES - RECOMMENDED');
    lines.push('─'.repeat(70));

    for (const entry of notes.standard) {
      lines.push(`\n${entry.summary}`);
      lines.push(`  Type: ${entry.type}`);
      lines.push(`  Action: ${entry.action_required}`);

      if (entry.migration_guide) {
        lines.push(`  📖 Migration Guide: ${entry.migration_guide}`);
      }
    }
  }

  // Optional updates
  if (notes.optional.length > 0 && (!severity || severity === 'optional')) {
    lines.push('\n' + '─'.repeat(70));
    lines.push('🟢 OPTIONAL UPDATES');
    lines.push('─'.repeat(70));

    const optionalList = notes.optional.slice(0, 5).map(e => `  • ${e.summary}`).join('\n');
    lines.push(optionalList);

    if (notes.optional.length > 5) {
      lines.push(`  ... and ${notes.optional.length - 5} more`);
    }
  }

  // Summary
  lines.push('\n' + '─'.repeat(70));
  lines.push('📊 SUMMARY');
  lines.push('─'.repeat(70));
  lines.push(`  Critical: ${notes.summary.criticalCount}`);
  lines.push(`  Standard: ${notes.summary.standardCount}`);
  lines.push(`  Optional: ${notes.summary.optionalCount}`);
  if (notes.summary.breakingChanges > 0) {
    lines.push(`  ⚠️  Breaking changes: ${notes.summary.breakingChanges}`);
  }

  lines.push('\n' + '='.repeat(70));
  lines.push('\nNext steps:');
  lines.push('  • Review all critical updates above');
  lines.push('  • Run: claude /framework-update --check');
  lines.push('  • Run: claude /framework-update to install updates\n');

  return lines.join('\n');
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const jsonOutput = args.includes('--json');
  const severityFilter = args.find(a => a.startsWith('--severity='))?.split('=')[1];

  try {
    const notes = generateReleaseNotes();

    if (jsonOutput) {
      console.log(JSON.stringify(notes, null, 2));
    } else {
      console.log(formatReleaseNotes(notes, severityFilter));
    }
  } catch (error) {
    console.error('Error generating release notes:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
