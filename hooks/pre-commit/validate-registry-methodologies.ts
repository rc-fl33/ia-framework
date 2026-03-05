#!/usr/bin/env bun
/**
 * PreToolUse Hook: Auto-add methodologies field to REGISTRY.json
 *
 * Ensures all tools in REGISTRY.json have a methodologies field.
 * Automatically adds missing methodologies based on tool domains.
 *
 * Runs on: PreToolUse on Write tool when target is REGISTRY.json
 */

import { addMethodologiesToRegistry } from '../../tools/pentest/add-methodologies-to-registry';
import { join } from 'path';

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const REGISTRY_PATH = join(FRAMEWORK_ROOT, 'skills/pentest/tools/REGISTRY.json');

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    file_path?: string;
    content?: string;
    [key: string]: unknown;
  };
}

async function main() {
  try {
    // Read input from stdin
    const input = await Bun.stdin.text();

    // PreToolUse hooks receive JSON input; pre-commit runs without input
    // Exit gracefully when no input (pre-commit context)
    if (!input || input.trim() === '') {
      process.exit(0);
    }

    const data: PreToolUseInput = JSON.parse(input);

    // Check if we're writing to REGISTRY.json
    const filePath = data.tool_input.file_path;

    if (!filePath || !filePath.includes('REGISTRY.json')) {
      // Not REGISTRY.json, skip validation
      process.exit(0);
      return;
    }

    console.log('🔍 Validating REGISTRY.json methodologies...\n');

    // Auto-add missing methodologies (writes file if needed)
    const updated = addMethodologiesToRegistry(REGISTRY_PATH, false);

    if (updated) {
      console.log('✅ Added missing methodologies field to tools in REGISTRY.json');
      console.log('   File has been automatically updated\n');
    } else {
      console.log('✅ All tools have methodologies field\n');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Registry validation failed:');
    console.error(error);
    process.exit(1);
  }
}

main();
