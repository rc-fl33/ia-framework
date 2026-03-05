#!/usr/bin/env bun
/**
 * Write Skill Setup & Configuration
 *
 * Validates environment for content writing with research validation,
 * QA gates, and optional AI image generation.
 *
 * Usage:
 *   bun skills/write/scripts/setup.ts           # Interactive setup
 *   bun skills/write/scripts/setup.ts validate  # Quick validation
 */

import { existsSync, copyFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Import env-sync utilities
import { parseEnvFile, keyExists, getKeyValue } from '@/tools/framework/env-sync/parser-env';
import { applyMergedEnvFile } from '@/tools/framework/env-sync/merge-env-sections';
import { backupEnvFile } from '@/tools/framework/env-sync/backup-env';

// =============================================================================
// SKILL CONFIGURATION
// =============================================================================

const SKILL_NAME = 'Write';
const SKILL_FOLDER = 'write';
const ENV_SECTION = 'Write Skill';

/** Required for AI image generation capability */
const REQUIRED_KEYS: string[] = [
  'OPENROUTER' + '_API_KEY',  // Loaded from .env
];

const DEFAULT_VALUES: Record<string, string> = {
  // No defaults - user must provide actual values
};

// =============================================================================
// FRAMEWORK PATHS
// =============================================================================

function getFrameworkRoot(): string {
  // Try IA_FRAMEWORK_ROOT env var first
  if (process.env.IA_FRAMEWORK_ROOT && existsSync(process.env.IA_FRAMEWORK_ROOT)) {
    return process.env.IA_FRAMEWORK_ROOT;
  }

  // Try relative to this file (skills/write/scripts/setup.ts -> ../../../)
  const scriptDir = import.meta.dir;
  const frameworkRoot = join(scriptDir, '../../../');

  if (existsSync(join(frameworkRoot, 'CLAUDE.md'))) {
    return frameworkRoot;
  }

  console.error('❌ Could not find framework root');
  process.exit(1);
}

const FRAMEWORK_ROOT = getFrameworkRoot();
const ENV_FILE = join(FRAMEWORK_ROOT, '.env');
const ENV_STRUCTURE = join(FRAMEWORK_ROOT, '.env.structure.yaml');

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Validates required environment variables
 */
function validateEnvironment(): { valid: boolean; missing: string[] } {
  if (!existsSync(ENV_FILE)) {
    return { valid: false, missing: REQUIRED_KEYS };
  }

  const envData = parseEnvFile(ENV_FILE);
  const missing: string[] = [];

  for (const key of REQUIRED_KEYS) {
    if (!keyExists(envData, key)) {
      missing.push(key);
    } else {
      const value = getKeyValue(envData, key);
      // Check if value is placeholder
      if (!value || value === 'REPLACE_WITH_YOUR_KEY' || value === '[insert api key here]') {
        missing.push(key);
      }
    }
  }

  return { valid: missing.length === 0, missing };
}

/**
 * Displays environment status
 */
function displayStatus(validation: { valid: boolean; missing: string[] }): void {
  console.log(`\n${SKILL_NAME} Skill - Environment Status\n${'='.repeat(50)}\n`);

  if (validation.valid) {
    console.log('✅ All required environment variables configured');
    console.log('\nRequired:');
    REQUIRED_KEYS.forEach(key => {
      console.log(`  ✓ ${key}`);
    });
  } else {
    console.log('❌ Missing or incomplete configuration');
    console.log('\nMissing/Incomplete:');
    validation.missing.forEach(key => {
      console.log(`  ✗ ${key}`);
    });
  }

  console.log(`\n${'='.repeat(50)}\n`);
}

// =============================================================================
// SETUP INSTRUCTIONS
// =============================================================================

function displaySetupInstructions(): void {
  console.log('Setup Instructions:');
  console.log('='.repeat(50));
  console.log('\n1. Obtain OpenRouter API Key:');
  console.log('   - Visit https://openrouter.ai');
  console.log('   - Create account or sign in');
  console.log('   - Generate API key');
  console.log('\n2. Add to .env file:');
  console.log('   ' + 'OPENROUTER' + '_API_KEY=your-actual-key-here');
  console.log('\n3. Verify setup:');
  console.log('   bun skills/write/scripts/setup.ts validate');
  console.log('\n4. See full documentation:');
  console.log('   skills/write/../../private/docs/env-setup.md');
  console.log('   skills/write/docs/adding-credentials.md');
  console.log('\n' + '='.repeat(50) + '\n');
}

// =============================================================================
// TEMPLATE CUSTOMIZATION
// =============================================================================

const TEMPLATES_DIR = join(FRAMEWORK_ROOT, 'skills', SKILL_FOLDER, 'templates');

const TEMPLATE_FILES = [
  'brand-voice-template.md',
  'content-standards-template.md',
  'image-style-template.md',
  'qa-criteria-template.md'
];

/**
 * Check which custom templates exist
 */
function checkCustomTemplates(): { exists: string[]; missing: string[] } {
  const exists: string[] = [];
  const missing: string[] = [];

  for (const templateFile of TEMPLATE_FILES) {
    const customFile = templateFile.replace('-template.md', '-custom.md');
    const customPath = join(TEMPLATES_DIR, customFile);

    if (existsSync(customPath)) {
      exists.push(customFile);
    } else {
      missing.push(customFile);
    }
  }

  return { exists, missing };
}

/**
 * Copy template files to custom versions
 */
function initializeCustomTemplates(): { success: boolean; created: string[]; errors: string[] } {
  const created: string[] = [];
  const errors: string[] = [];

  console.log('\n📝 Initializing custom templates...\n');

  for (const templateFile of TEMPLATE_FILES) {
    const customFile = templateFile.replace('-template.md', '-custom.md');
    const templatePath = join(TEMPLATES_DIR, templateFile);
    const customPath = join(TEMPLATES_DIR, customFile);

    // Skip if custom version already exists
    if (existsSync(customPath)) {
      console.log(`  ⏭️  ${customFile} already exists - skipping`);
      continue;
    }

    // Copy template to custom version
    try {
      copyFileSync(templatePath, customPath);
      created.push(customFile);
      console.log(`  ✅ Created ${customFile}`);
    } catch (error) {
      const errorMsg = `Failed to create ${customFile}: ${error instanceof Error ? error.message : String(error)}`;
      errors.push(errorMsg);
      console.log(`  ❌ ${errorMsg}`);
    }
  }

  console.log('');
  return { success: errors.length === 0, created, errors };
}

/**
 * Display template status
 */
function displayTemplateStatus(): void {
  const { exists, missing } = checkCustomTemplates();

  console.log('\n📋 Template Status\n' + '='.repeat(50) + '\n');

  if (missing.length === 0) {
    console.log('✅ All custom templates configured');
    exists.forEach(file => {
      console.log(`  ✓ ${file}`);
    });
  } else {
    if (exists.length > 0) {
      console.log('Custom templates found:');
      exists.forEach(file => {
        console.log(`  ✓ ${file}`);
      });
      console.log('');
    }

    console.log('Missing custom templates:');
    missing.forEach(file => {
      console.log(`  ✗ ${file}`);
    });
    console.log('\nRun this setup script to initialize custom templates from defaults.');
  }

  console.log('\n' + '='.repeat(50) + '\n');
}

// =============================================================================
// MAIN
// =============================================================================

function main(): void {
  const args = process.argv.slice(2);
  const mode = args[0] || 'interactive';

  console.log(`\n${SKILL_NAME} Skill Setup - ${mode} mode\n`);

  const validation = validateEnvironment();
  const { exists, missing } = checkCustomTemplates();

  if (mode === 'validate') {
    displayStatus(validation);
    displayTemplateStatus();
    process.exit(validation.valid && missing.length === 0 ? 0 : 1);
  }

  // Interactive mode
  displayStatus(validation);

  if (!validation.valid) {
    displaySetupInstructions();
    process.exit(1);
  }

  console.log('✅ Environment configured correctly\n');

  // Check templates
  displayTemplateStatus();

  if (missing.length > 0) {
    console.log('🔧 Custom templates need initialization.');
    console.log('   This creates your own editable versions from the generic templates.\n');

    const templateResult = initializeCustomTemplates();

    if (templateResult.success) {
      console.log('✅ Custom templates initialized successfully!');
      console.log('\nNext steps:');
      console.log('1. Edit custom templates to match your brand voice:');
      console.log('   - skills/write/templates/brand-voice-custom.md');
      console.log('   - skills/write/templates/content-standards-custom.md');
      console.log('   - skills/write/templates/image-style-custom.md');
      console.log('   - skills/write/templates/qa-criteria-custom.md');
      console.log('\n2. See customization guide:');
      console.log('   skills/write/docs/template-customization.md');
      console.log('\n3. Use the skill:');
      console.log('   /write');
    } else {
      console.log('❌ Some templates failed to initialize');
      console.log('   See errors above');
      process.exit(1);
    }
  } else {
    console.log('✅ All custom templates configured');
    console.log('\nYou can now use the /write skill:');
    console.log('  /write');
    console.log('\nTo customize templates further:');
    console.log('  See skills/write/docs/template-customization.md');
  }

  console.log('');
}

main();
