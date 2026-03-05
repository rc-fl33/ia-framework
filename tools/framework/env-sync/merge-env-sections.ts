#!/usr/bin/env bun
/**
 * Environment File Section Merger
 *
 * Intelligently merges new sections into existing .env files without data loss.
 * Preserves all existing sections and comments, updates only specified keys.
 *
 * Usage:
 *   bun tools/framework/env-sync/merge-env-sections.ts [action] [envPath] [sectionKey] [keysJson]
 *
 * Actions:
 *   update-section  - Update or add section with new keys
 *   add-section     - Add new section (error if exists)
 *   replace-section - Replace entire section content
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parseEnvFile, reconstructEnv } from './parser-env';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface EnvLine {
  type: 'comment' | 'section' | 'key-value' | 'empty';
  raw: string;
  key?: string;
  value?: string;
  comment?: string;
}

interface MergeOptions {
  preserveComments: boolean;
  preserveOrder: boolean;
  appendIfNotExists: boolean;
}

interface MergeResult {
  success: boolean;
  message: string;
  originalLineCount?: number;
  newLineCount?: number;
  addedKeys?: string[];
  modifiedKeys?: string[];
  sectionFound?: boolean;
  newSectionAdded?: boolean;
  error?: string;
}

/**
 * Merge keys into a section
 */
export function mergeSectionKeys(
  lines: EnvLine[],
  sectionKey: string,
  newKeys: Map<string, string>,
  options: MergeOptions = {
    preserveComments: true,
    preserveOrder: true,
    appendIfNotExists: true
  }
): { lines: EnvLine[]; sectionFound: boolean; addedKeys: string[]; modifiedKeys: string[] } {
  const addedKeys: string[] = [];
  const modifiedKeys: string[] = [];
  let sectionFound = false;
  let sectionStartIndex = -1;
  let sectionEndIndex = -1;
  let currentSectionKey: string | null = null;

  // Find section by matching the key (case-insensitive)
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.type === 'section' && line.key === sectionKey.toLowerCase().replace(/\s+/g, '-')) {
      sectionFound = true;
      sectionStartIndex = i;
      currentSectionKey = sectionKey;

      // Find where this section ends (next section or end of file)
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].type === 'section') {
          sectionEndIndex = j - 1;
          break;
        }
      }

      // If no next section found, section extends to end
      if (sectionEndIndex === -1) {
        sectionEndIndex = lines.length - 1;
      }

      break;
    }
  }

  // If section not found and appendIfNotExists is true, append new section
  if (!sectionFound && options.appendIfNotExists) {
    // Add blank line before new section
    lines.push({ type: 'empty', raw: '' });

    // Add section header
    const headerText = `# ${currentSectionKey || sectionKey}`;
    lines.push({
      type: 'section',
      raw: headerText,
      key: sectionKey.toLowerCase().replace(/\s+/g, '-'),
      comment: headerText
    });

    // Add new keys
    for (const [key, value] of newKeys) {
      lines.push({
        type: 'key-value',
        raw: `${key}=${value}`,
        key,
        value
      });
      addedKeys.push(key);
    }

    return { lines, sectionFound: false, addedKeys, modifiedKeys };
  }

  // If section found, merge keys into it
  if (sectionFound && sectionStartIndex !== -1) {
    const sectionLines = lines.slice(sectionStartIndex, sectionEndIndex + 1);
    const existingKeys = new Map<string, number>();

    // Map existing keys to their line indices within the section
    for (let i = 1; i < sectionLines.length; i++) {
      if (sectionLines[i].type === 'key-value' && sectionLines[i].key) {
        existingKeys.set(sectionLines[i].key, i);
      }
    }

    // Update or add keys
    for (const [key, value] of newKeys) {
      if (existingKeys.has(key)) {
        // Update existing key
        const lineIndex = sectionStartIndex + existingKeys.get(key)!;
        lines[lineIndex] = {
          type: 'key-value',
          raw: `${key}=${value}`,
          key,
          value
        };
        modifiedKeys.push(key);
      } else {
        // Add new key to end of section
        sectionEndIndex++;
        lines.splice(sectionEndIndex, 0, {
          type: 'key-value',
          raw: `${key}=${value}`,
          key,
          value
        });
        addedKeys.push(key);
      }
    }
  }

  return { lines, sectionFound, addedKeys, modifiedKeys };
}

/**
 * Merge environment files
 */
export async function mergeEnvFile(
  envPath: string,
  sectionKey: string,
  newKeys: Map<string, string>,
  options: MergeOptions = {
    preserveComments: true,
    preserveOrder: true,
    appendIfNotExists: true
  }
): Promise<MergeResult> {
  try {
    // Parse existing .env
    const parsed = parseEnvFile(envPath);
    if (!parsed) {
      return {
        success: false,
        message: `Failed to parse .env file: ${envPath}`,
        error: 'Parse error'
      };
    }

    const originalLineCount = parsed.allLines.length;

    // Merge keys into section
    const { lines, sectionFound, addedKeys, modifiedKeys } = mergeSectionKeys(
      [...parsed.allLines],
      sectionKey,
      newKeys,
      options
    );

    const newLineCount = lines.length;

    // Reconstruct file content
    const newContent = lines.map((line) => line.raw).join('\n');

    return {
      success: true,
      message: `Successfully merged ${addedKeys.length} new keys and updated ${modifiedKeys.length} existing keys`,
      originalLineCount,
      newLineCount,
      addedKeys,
      modifiedKeys,
      sectionFound,
      newSectionAdded: !sectionFound
    };
  } catch (error) {
    return {
      success: false,
      message: `Merge failed: ${error instanceof Error ? error.message : String(error)}`,
      error: String(error)
    };
  }
}

/**
 * Apply merged content to file (with backup)
 */
export async function applyMergedEnvFile(
  envPath: string,
  sectionKey: string,
  newKeys: Map<string, string>,
  createBackup: boolean = true
): Promise<MergeResult> {
  try {
    // Create backup if requested
    if (createBackup) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
      const backupPath = `${envPath}.backup.${timestamp}`;
      const originalContent = readFileSync(envPath, 'utf-8');
      writeFileSync(backupPath, originalContent);
    }

    // Parse and merge
    const parsed = parseEnvFile(envPath);
    if (!parsed) {
      return {
        success: false,
        message: `Failed to parse .env file: ${envPath}`,
        error: 'Parse error'
      };
    }

    const originalLineCount = parsed.allLines.length;

    // Merge keys
    const { lines, addedKeys, modifiedKeys, sectionFound } = mergeSectionKeys(
      [...parsed.allLines],
      sectionKey,
      newKeys
    );

    const newLineCount = lines.length;
    const newContent = lines.map((line) => line.raw).join('\n');

    // Write back to file
    writeFileSync(envPath, newContent);

    return {
      success: true,
      message: `Successfully applied merge: ${addedKeys.length} new + ${modifiedKeys.length} updated`,
      originalLineCount,
      newLineCount,
      addedKeys,
      modifiedKeys,
      sectionFound,
      newSectionAdded: !sectionFound
    };
  } catch (error) {
    return {
      success: false,
      message: `Apply merge failed: ${error instanceof Error ? error.message : String(error)}`,
      error: String(error)
    };
  }
}

/**
 * Get section content before merge
 */
export function getSectionContent(
  envPath: string,
  sectionKey: string
): Map<string, string> | null {
  const parsed = parseEnvFile(envPath);
  if (!parsed) {
    return null;
  }

  for (const section of parsed.sections.values()) {
    if (section.name.toLowerCase() === sectionKey.toLowerCase()) {
      return section.keys;
    }
  }

  return null;
}

// CLI execution
if (import.meta.main) {
  const action = process.argv[2] || 'update-section';
  const envPath = process.argv[3] || join(FRAMEWORK_ROOT, '.env');
  const sectionKey = process.argv[4] || 'test-section';
  const keysJson = process.argv[5] || '{"TEST_KEY":"test_value"}';

  console.log('\n' + '='.repeat(70));
  console.log('ENVIRONMENT FILE SECTION MERGER');
  console.log('='.repeat(70));
  console.log(`\nAction: ${action}`);
  console.log(`File: ${envPath}`);
  console.log(`Section: ${sectionKey}\n`);

  try {
    const newKeys = new Map(Object.entries(JSON.parse(keysJson)));

    if (action === 'preview') {
      const result = mergeEnvFile(envPath, sectionKey, newKeys);
      result.then((res) => {
        console.log(`Preview: ${res.message}`);
        if (res.addedKeys) {
          console.log(`\nWould add: ${res.addedKeys.join(', ')}`);
        }
        if (res.modifiedKeys) {
          console.log(`Would update: ${res.modifiedKeys.join(', ')}`);
        }
        console.log('\n' + '='.repeat(70) + '\n');
      });
    } else if (action === 'apply') {
      applyMergedEnvFile(envPath, sectionKey, newKeys, true).then((res) => {
        console.log(res.success ? '✅ ' : '❌ ');
        console.log(res.message);
        if (res.addedKeys?.length) {
          console.log(`Added: ${res.addedKeys.join(', ')}`);
        }
        if (res.modifiedKeys?.length) {
          console.log(`Updated: ${res.modifiedKeys.join(', ')}`);
        }
        console.log('\n' + '='.repeat(70) + '\n');
        process.exit(res.success ? 0 : 1);
      });
    } else {
      console.error(`Unknown action: ${action}`);
      console.log('Available actions: preview, apply');
      process.exit(1);
    }
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}
