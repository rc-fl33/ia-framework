#!/usr/bin/env bun
/**
 * Advisory Skill Setup & Configuration
 *
 * Research and advisory skill - no credentials required.
 * Uses WebSearch and WebFetch for information gathering.
 *
 * Usage:
 *   bun skills/advisory/scripts/setup.ts           # Interactive setup
 *   bun skills/advisory/scripts/setup.ts validate  # Quick validation
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { resolveEnvPath } from '@/tools/framework/utils/path-resolution';

const SKILL_NAME = 'Advisory';
const SKILL_FOLDER = 'advisory';

function getEnvPath(): string {
  return resolveEnvPath();
}

interface ValidationResult {
  success: boolean;
  missing: string[];
  message: string;
}

export async function validateSetup(): Promise<ValidationResult> {
  return {
    success: true,
    missing: [],
    message: `✅ ${SKILL_NAME} skill is properly configured (no credentials required)`
  };
}

export async function testConnections(): Promise<Record<string, boolean>> {
  return {};
}

function runSetup(): void {
  console.log('\n' + '='.repeat(50));
  console.log(`${SKILL_NAME.toUpperCase()} SKILL SETUP`);
  console.log('='.repeat(50));
  console.log(`\n✅ ${SKILL_NAME} skill requires no configuration.`);
  console.log('   This skill uses WebSearch and WebFetch for research.\n');
  console.log('📝 Usage:');
  console.log(`   See skills/${SKILL_FOLDER}/SKILL.md for documentation\n`);
  console.log('='.repeat(50) + '\n');
}

if (import.meta.main) {
  const command = process.argv[2];
  switch (command) {
    case 'validate':
      validateSetup().then((r) => console.log(r.message));
      break;
    case 'test':
      console.log('✅ No connectivity tests required');
      break;
    default:
      runSetup();
  }
}
