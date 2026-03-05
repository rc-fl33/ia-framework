#!/usr/bin/env bun
/**
 * Environment File Parser
 *
 * Parses .env files into structured sections by skill.
 * Preserves comments, empty lines, and formatting.
 *
 * Usage:
 *   bun tools/framework/env-sync/parser-env.ts /path/to/.env
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Framework root resolution
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface EnvLine {
  type: 'comment' | 'section' | 'key-value' | 'empty';
  raw: string;
  key?: string;
  value?: string;
  comment?: string;
}

interface EnvSection {
  name: string;
  header?: string;
  lines: EnvLine[];
  keys: Map<string, string>;
}

interface ParsedEnv {
  sections: Map<string, EnvSection>;
  allLines: EnvLine[];
  rawContent: string;
}

/**
 * Identify section from header comment
 */
function extractSectionName(comment: string): string | null {
  // Match patterns like "# 👻 GHOST SKILL" or "# GIT SKILL"
  const match = comment.match(/#\s+(?:[A-Za-z0-9🧠👻🔧🔐]*\s)*([A-Z][A-Z0-9\s\-]+)/);
  if (match) {
    return match[1].trim();
  }
  return null;
}

/**
 * Parse a single line from .env
 */
function parseLine(line: string): EnvLine {
  // Empty line
  if (!line.trim()) {
    return { type: 'empty', raw: line };
  }

  // Comment line
  if (line.trim().startsWith('#')) {
    const sectionName = extractSectionName(line);
    if (sectionName) {
      return {
        type: 'section',
        raw: line,
        comment: line.trim(),
        key: sectionName.toLowerCase().replace(/\s+/g, '-')
      };
    }
    return { type: 'comment', raw: line, comment: line.trim() };
  }

  // Key-value line
  const eqIndex = line.indexOf('=');
  if (eqIndex > 0) {
    const key = line.substring(0, eqIndex).trim();
    const value = line.substring(eqIndex + 1);
    return {
      type: 'key-value',
      raw: line,
      key,
      value
    };
  }

  // Default: treat as comment
  return { type: 'comment', raw: line, comment: line };
}

/**
 * Parse entire .env file into sections
 */
export function parseEnvFile(envPath: string): ParsedEnv | null {
  if (!existsSync(envPath)) {
    console.error(`File not found: ${envPath}`);
    return null;
  }

  const rawContent = readFileSync(envPath, 'utf-8');
  const lines = rawContent.split('\n');

  const sections = new Map<string, EnvSection>();
  const allLines: EnvLine[] = [];
  let currentSection: EnvSection | null = null;
  let defaultSection: EnvSection = {
    name: 'Unsorted',
    lines: [],
    keys: new Map()
  };

  for (const rawLine of lines) {
    const line = parseLine(rawLine);
    allLines.push(line);

    if (line.type === 'section') {
      // Start new section
      const sectionName = line.key || line.comment;
      currentSection = {
        name: sectionName || 'Unknown',
        header: line.raw,
        lines: [line],
        keys: new Map()
      };
      sections.set(sectionName || 'unknown', currentSection);
    } else if (line.type === 'key-value') {
      // Add to current section
      const section = currentSection || defaultSection;
      section.lines.push(line);
      if (line.key && line.value) {
        section.keys.set(line.key, line.value);
      }
    } else {
      // Comment or empty - add to current section
      const section = currentSection || defaultSection;
      section.lines.push(line);
    }
  }

  // Add default section if it has content
  if (defaultSection.lines.length > 0) {
    sections.set('unsorted', defaultSection);
  }

  return {
    sections,
    allLines,
    rawContent
  };
}

/**
 * Reconstruct .env content from parsed structure
 */
export function reconstructEnv(parsed: ParsedEnv): string {
  return parsed.allLines.map((line) => line.raw).join('\n');
}

/**
 * Get all keys from parsed env
 */
export function getAllKeys(parsed: ParsedEnv): Map<string, string> {
  const allKeys = new Map<string, string>();

  for (const section of parsed.sections.values()) {
    for (const [key, value] of section.keys) {
      allKeys.set(key, value);
    }
  }

  return allKeys;
}

/**
 * Check if key exists in parsed env
 */
export function keyExists(parsed: ParsedEnv, key: string): boolean {
  for (const section of parsed.sections.values()) {
    if (section.keys.has(key)) {
      return true;
    }
  }
  return false;
}

/**
 * Get value of key from parsed env
 */
export function getKeyValue(parsed: ParsedEnv, key: string): string | null {
  for (const section of parsed.sections.values()) {
    if (section.keys.has(key)) {
      return section.keys.get(key) || null;
    }
  }
  return null;
}

// CLI execution
if (import.meta.main) {
  const envPath = process.argv[2] || join(FRAMEWORK_ROOT, '.env');

  console.log('\n' + '='.repeat(70));
  console.log('ENVIRONMENT FILE PARSER');
  console.log('='.repeat(70));
  console.log(`\nParsing: ${envPath}\n`);

  const parsed = parseEnvFile(envPath);

  if (!parsed) {
    console.error('Failed to parse .env file');
    process.exit(1);
  }

  console.log(`✅ Parsed successfully\n`);

  console.log('SECTIONS:');
  console.log(`  Total: ${parsed.sections.size}`);
  for (const [key, section] of parsed.sections) {
    console.log(`\n  ${key}:`);
    console.log(`    Name: ${section.name}`);
    console.log(`    Keys: ${section.keys.size}`);
    for (const [k, v] of section.keys) {
      const masked = v.length > 20 ? v.substring(0, 20) + '...' : v;
      console.log(`      ${k}=${masked}`);
    }
  }

  console.log(`\nTOTAL KEYS: ${getAllKeys(parsed).size}`);

  console.log('\n' + '='.repeat(70) + '\n');
}
