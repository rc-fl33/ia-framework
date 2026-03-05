#!/usr/bin/env bun
/**
 * Pre-commit Hook: Validate Hero Image Prompts
 *
 * Ensures all hero-prompt files start with landscape format specification.
 *
 * REQUIREMENT: First line must match one of:
 * - "16:9 landscape format,"
 * - "LANDSCAPE 16:9 aspect ratio"
 * - "wide landscape format, 16:9 aspect ratio"
 *
 * Reference: skills/ghost/docs/hero-images.md (line 12)
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const REQUIRED_PATTERNS = [
  /^16:9 landscape format,/i,
  /^LANDSCAPE 16:9 aspect ratio/i,
  /^wide landscape format, 16:9 aspect ratio/i,
];

function validatePromptFile(filePath: string): { valid: boolean; error?: string } {
  if (!existsSync(filePath)) {
    return { valid: false, error: 'File does not exist' };
  }

  const content = readFileSync(filePath, 'utf-8');
  const firstLine = content.split('\n')[0].trim();

  // Check if first line matches any required pattern
  const isValid = REQUIRED_PATTERNS.some(pattern => pattern.test(firstLine));

  if (!isValid) {
    return {
      valid: false,
      error: `First line must specify landscape format.\n\nRequired patterns:\n  - "16:9 landscape format,"\n  - "LANDSCAPE 16:9 aspect ratio"\n  - "wide landscape format, 16:9 aspect ratio"\n\nYour first line:\n  "${firstLine}"\n\nSee: skills/ghost/docs/hero-images.md (line 12)`
    };
  }

  return { valid: true };
}

async function main() {
  try {
    // Get staged files
    const stagedFiles = execSync('git diff --cached --name-only --diff-filter=ACM', { encoding: 'utf-8' })
      .split('\n')
      .filter(Boolean);

    // Find hero prompt files
    const heroPromptFiles = stagedFiles.filter(file =>
      file.includes('/hero-prompt') && (file.endsWith('.txt') || file.endsWith('.md'))
    );

    if (heroPromptFiles.length === 0) {
      // No hero prompt files staged, pass
      process.exit(0);
    }

    console.log('🔍 Validating hero prompt format...');

    const errors: string[] = [];

    for (const file of heroPromptFiles) {
      const result = validatePromptFile(file);

      if (!result.valid) {
        errors.push(`\n❌ ${file}\n${result.error}`);
      } else {
        console.log(`   ✓ ${file}`);
      }
    }

    if (errors.length > 0) {
      console.log('\n❌ HERO PROMPT VALIDATION FAILED\n');
      console.log('⚠️  Commit BLOCKED due to invalid hero prompt format');
      console.log(errors.join('\n'));
      console.log('\nWhy this matters:');
      console.log('  - Hero images must be 16:9 landscape (1280x720)');
      console.log('  - Portrait/square images break blog layout');
      console.log('  - First line specifies format to image generator');
      console.log('\nHow to fix:');
      console.log('  1. Update first line to specify landscape format');
      console.log('  2. Stage the corrected file');
      console.log('  3. Commit again');
      process.exit(1);
    }

    console.log('✅ All hero prompts valid');
    process.exit(0);

  } catch (err) {
    // Don't block commit on hook errors
    console.error('Hero prompt validation error:', (err as Error).message);
    process.exit(0);
  }
}

main();
