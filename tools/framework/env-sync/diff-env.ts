#!/usr/bin/env bun
/**
 * Environment File Diff Display
 *
 * Compares two .env files and displays changes in a user-friendly format.
 * Shows what was added, modified, and removed.
 *
 * Usage:
 *   bun tools/framework/env-sync/diff-env.ts [originalPath] [modifiedPath]
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface DiffLine {
  type: 'added' | 'removed' | 'modified' | 'unchanged' | 'context';
  original?: string;
  modified?: string;
  key?: string;
  section?: string;
}

interface DiffResult {
  added: DiffLine[];
  removed: DiffLine[];
  modified: DiffLine[];
  unchanged: DiffLine[];
  sections: Map<string, 'added' | 'modified' | 'unchanged'>;
  totalAdded: number;
  totalRemoved: number;
  totalModified: number;
  summary: string;
}

/**
 * Parse env file into key-value map (by section)
 */
function parseEnvSimple(content: string): Map<string, Map<string, string>> {
  const sections = new Map<string, Map<string, string>>();
  const lines = content.split('\n');

  let currentSection = '_root_';
  sections.set(currentSection, new Map());

  for (const line of lines) {
    // Check for section header
    const sectionMatch = line.match(/^#\s+(?:[A-Za-z0-9🧠👻🔧🔐]*\s)*([A-Z][A-Z0-9\s\-]+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      if (!sections.has(currentSection)) {
        sections.set(currentSection, new Map());
      }
      continue;
    }

    // Parse key-value
    const eqIndex = line.indexOf('=');
    if (eqIndex > 0 && !line.trim().startsWith('#')) {
      const key = line.substring(0, eqIndex).trim();
      const value = line.substring(eqIndex + 1);

      if (key && !key.includes(' ')) {
        sections.get(currentSection)!.set(key, value);
      }
    }
  }

  return sections;
}

/**
 * Compare two env file versions
 */
export function diffEnvFiles(originalContent: string, modifiedContent: string): DiffResult {
  const originalSections = parseEnvSimple(originalContent);
  const modifiedSections = parseEnvSimple(modifiedContent);

  const added: DiffLine[] = [];
  const removed: DiffLine[] = [];
  const modified: DiffLine[] = [];
  const unchanged: DiffLine[] = [];
  const sections = new Map<string, 'added' | 'modified' | 'unchanged'>();

  // Get all section names
  const allSections = new Set([...originalSections.keys(), ...modifiedSections.keys()]);

  for (const section of allSections) {
    const originalKeys = originalSections.get(section) || new Map();
    const modifiedKeys = modifiedSections.get(section) || new Map();

    // Check section status
    let sectionStatus: 'added' | 'modified' | 'unchanged' = 'unchanged';

    // Check for modified and added keys
    for (const [key, newValue] of modifiedKeys) {
      if (!originalKeys.has(key)) {
        added.push({
          type: 'added',
          modified: `${key}=${newValue}`,
          key,
          section
        });
        sectionStatus = 'modified';
      } else {
        const oldValue = originalKeys.get(key);
        if (oldValue !== newValue) {
          modified.push({
            type: 'modified',
            original: `${key}=${oldValue}`,
            modified: `${key}=${newValue}`,
            key,
            section
          });
          sectionStatus = 'modified';
        } else {
          unchanged.push({
            type: 'unchanged',
            original: `${key}=${oldValue}`,
            key,
            section
          });
        }
      }
    }

    // Check for removed keys
    for (const [key, value] of originalKeys) {
      if (!modifiedKeys.has(key)) {
        removed.push({
          type: 'removed',
          original: `${key}=${value}`,
          key,
          section
        });
        sectionStatus = 'modified';
      }
    }

    if (sectionStatus !== 'unchanged') {
      sections.set(section, sectionStatus);
    }
  }

  // Build summary
  const summaryParts = [];
  if (added.length > 0) summaryParts.push(`+${added.length} added`);
  if (modified.length > 0) summaryParts.push(`~${modified.length} modified`);
  if (removed.length > 0) summaryParts.push(`-${removed.length} removed`);

  const summary = summaryParts.length > 0 ? summaryParts.join(', ') : 'No changes';

  return {
    added,
    removed,
    modified,
    unchanged,
    sections,
    totalAdded: added.length,
    totalRemoved: removed.length,
    totalModified: modified.length,
    summary
  };
}

/**
 * Display diff in human-readable format
 */
export function displayDiff(diff: DiffResult): string {
  const lines: string[] = [];

  lines.push('\n' + '='.repeat(70));
  lines.push('ENVIRONMENT FILE CHANGES');
  lines.push('='.repeat(70));
  lines.push(`\n📊 Summary: ${diff.summary}\n`);

  // Removed
  if (diff.removed.length > 0) {
    lines.push('❌ REMOVED:');
    for (const line of diff.removed) {
      lines.push(`  - [${line.section}] ${line.original}`);
    }
    lines.push('');
  }

  // Modified
  if (diff.modified.length > 0) {
    lines.push('✏️  MODIFIED:');
    for (const line of diff.modified) {
      // Mask values for security
      const originalMasked = maskValue(line.original!);
      const modifiedMasked = maskValue(line.modified!);
      lines.push(`  - [${line.section}] ${originalMasked}`);
      lines.push(`    → ${modifiedMasked}`);
    }
    lines.push('');
  }

  // Added
  if (diff.added.length > 0) {
    lines.push('✅ ADDED:');
    for (const line of diff.added) {
      // Mask values for security
      const masked = maskValue(line.modified!);
      lines.push(`  + [${line.section}] ${masked}`);
    }
    lines.push('');
  }

  // Section summary
  if (diff.sections.size > 0) {
    lines.push('📁 AFFECTED SECTIONS:');
    for (const [section, status] of diff.sections) {
      const icon = status === 'added' ? '✨' : '🔄';
      lines.push(`  ${icon} ${section}`);
    }
    lines.push('');
  }

  lines.push('='.repeat(70) + '\n');

  return lines.join('\n');
}

/**
 * Mask credential values for security
 */
function maskValue(keyValuePair: string): string {
  const eqIndex = keyValuePair.indexOf('=');
  if (eqIndex < 0) return keyValuePair;

  const key = keyValuePair.substring(0, eqIndex + 1);
  const value = keyValuePair.substring(eqIndex + 1);

  // Don't mask if it's a placeholder
  if (value.startsWith('[insert')) {
    return keyValuePair;
  }

  // Mask actual values
  if (value.length <= 4) {
    return key + '****';
  }

  return key + value.substring(0, 4) + '*'.repeat(Math.min(20, value.length - 4));
}

/**
 * Compare two .env files
 */
export function compareEnvFiles(originalPath: string, modifiedPath: string): DiffResult | null {
  if (!existsSync(originalPath)) {
    console.error(`File not found: ${originalPath}`);
    return null;
  }

  if (!existsSync(modifiedPath)) {
    console.error(`File not found: ${modifiedPath}`);
    return null;
  }

  const originalContent = readFileSync(originalPath, 'utf-8');
  const modifiedContent = readFileSync(modifiedPath, 'utf-8');

  return diffEnvFiles(originalContent, modifiedContent);
}

// CLI execution
if (import.meta.main) {
  const originalPath = process.argv[2] || join(FRAMEWORK_ROOT, '.env.backup');
  const modifiedPath = process.argv[3] || join(FRAMEWORK_ROOT, '.env');

  console.log('ENVIRONMENT FILE DIFF');
  console.log(`Original: ${originalPath}`);
  console.log(`Modified: ${modifiedPath}\n`);

  const diff = compareEnvFiles(originalPath, modifiedPath);

  if (!diff) {
    console.error('Failed to compare files');
    process.exit(1);
  }

  console.log(displayDiff(diff));

  // Exit with 0 if no changes, 1 if changes exist
  process.exit(diff.totalAdded + diff.totalRemoved + diff.totalModified > 0 ? 0 : 0);
}
