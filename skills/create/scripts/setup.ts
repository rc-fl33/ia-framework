#!/usr/bin/env bun
/**
 * Skill Creation Skill Setup & Configuration
 *
 * Interactive skill creation wizard - no credentials required.
 * Uses local templates and documentation.
 *
 * Usage:
 *   bun skills/create/scripts/setup.ts           # Interactive setup
 *   bun skills/create/scripts/setup.ts validate  # Quick validation
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { resolveEnvPath } from '@/tools/framework/utils/path-resolution';

const SKILL_NAME = 'Skill Creation';
const SKILL_FOLDER = 'create-skill';

function getEnvPath(): string {
  return resolveEnvPath();
}

interface ValidationResult {
  success: boolean;
  missing: string[];
  message: string;
}

export async function validateSetup(): Promise<ValidationResult> {
  // Check that templates exist
  const frameworkRoot = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
  const templatesDir = join(frameworkRoot, 'skills', 'create-skill', 'templates');

  if (!existsSync(templatesDir)) {
    return {
      success: false,
      missing: ['templates directory'],
      message: '❌ Templates directory not found'
    };
  }

  return {
    success: true,
    missing: [],
    message: `✅ ${SKILL_NAME} skill is properly configured`
  };
}

export async function testConnections(): Promise<Record<string, boolean>> {
  return {};
}

function runSetup(): void {
  console.log('\n' + '='.repeat(50));
  console.log('SKILL CREATION SKILL SETUP');
  console.log('='.repeat(50));
  console.log(`\n✅ ${SKILL_NAME} skill requires no configuration.`);
  console.log('   This skill guides you through creating new skills.\n');
  console.log('📝 Usage:');
  console.log('   /create-skill - Start the interactive skill creation wizard\n');
  console.log('📝 Templates available at:');
  console.log(`   skills/${SKILL_FOLDER}/templates/\n`);
  console.log('='.repeat(50) + '\n');
}

if (import.meta.main) {
  const command = process.argv[2];
  switch (command) {
    case 'validate':
      validateSetup().then((r) => {
        console.log(r.message);
        if (r.missing.length > 0) process.exit(1);
      });
      break;
    case 'test':
      console.log('✅ No connectivity tests required');
      break;
    default:
      runSetup();
  }
}
