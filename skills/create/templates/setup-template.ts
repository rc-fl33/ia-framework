#!/usr/bin/env bun
/**
 * [SKILL_NAME] Skill Setup & Configuration
 *
 * Standardized setup script using env-sync utilities.
 * Validates environment, configures credentials, and tests connectivity.
 *
 * Usage:
 *   bun skills/[skill-folder]/scripts/setup.ts           # Interactive setup
 *   bun skills/[skill-folder]/scripts/setup.ts validate  # Quick validation
 *   bun skills/[skill-folder]/scripts/setup.ts test      # Test connectivity
 *
 * Template: skills/create/templates/setup-template.ts
 */

import { existsSync } from 'fs';
import { join } from 'path';

// Import env-sync utilities
import { parseEnvFile, keyExists, getKeyValue } from '@/tools/framework/env-sync/parser-env';
import { applyMergedEnvFile } from '@/tools/framework/env-sync/merge-env-sections';
import { backupEnvFile } from '@/tools/framework/env-sync/backup-env';
import { resolveEnvPath } from '@/tools/framework/utils/path-resolution';

// =============================================================================
// SKILL CONFIGURATION - Customize these values for your skill
// =============================================================================

/** Skill display name */
const SKILL_NAME = '[SKILL_NAME]';

/** Skill folder name (used for paths) */
const SKILL_FOLDER = '[skill-folder]';

/** Environment section header in .env file */
const ENV_SECTION = '[SKILL_NAME] Skill';

/** Required environment keys - setup will fail if these are missing */
const REQUIRED_KEYS: string[] = [
  // 'API_KEY',
  // 'API_URL',
];

/** Optional environment keys - setup will warn if missing */
const OPTIONAL_KEYS: string[] = [
  // 'OPTIONAL_SETTING',
];

/** Default values for new installations */
const DEFAULT_VALUES: Record<string, string> = {
  // 'API_URL': 'https://api.example.com',
};

/** External dependencies to check (CLIs, tools) */
const DEPENDENCIES: Array<{ name: string; command: string; installUrl?: string }> = [
  // { name: 'curl', command: 'curl --version', installUrl: 'https://curl.se/' },
];

// =============================================================================
// SETUP IMPLEMENTATION - Typically no changes needed below
// =============================================================================

interface SetupStatus {
  step: string;
  status: 'pass' | 'fail' | 'warn' | 'skip';
  message: string;
  details?: string;
}

interface ValidationResult {
  success: boolean;
  missing: string[];
  message: string;
}

interface ConnectivityResult {
  [key: string]: boolean;
}

const setupLog: SetupStatus[] = [];

/**
 * Get environment file path (uses framework path resolution)
 */
function getEnvPath(): string {
  return resolveEnvPath();
}

/**
 * Log setup progress
 */
function logStep(step: string, status: 'pass' | 'fail' | 'warn' | 'skip', message: string, details?: string): void {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : status === 'warn' ? '⚠️ ' : '⏭️ ';
  console.log(`${icon} ${step}: ${message}`);
  if (details) console.log(`   ${details}`);
  setupLog.push({ step, status, message, details });
}

/**
 * Step 1: Check external dependencies
 */
async function checkDependencies(): Promise<void> {
  if (DEPENDENCIES.length === 0) {
    logStep('Dependencies', 'skip', 'No external dependencies required');
    return;
  }

  console.log('\n📦 STEP 1: Check Dependencies');
  console.log('─'.repeat(50));

  const { execFileSync } = await import('child_process');
  for (const dep of DEPENDENCIES) {
    try {
      // PERF-001: intentional - each dependency is a different command; cannot batch
      execFileSync(dep.command.split(' ')[0], dep.command.split(' ').slice(1), { stdio: 'pipe' });
      logStep(dep.name, 'pass', 'Installed');
    } catch {
      const installMsg = dep.installUrl ? `Install from: ${dep.installUrl}` : 'Please install manually';
      logStep(dep.name, 'warn', 'Not installed', installMsg);
    }
  }
}

/**
 * Step 2: Validate environment file exists
 */
async function checkEnvFile(): Promise<boolean> {
  console.log('\n📄 STEP 2: Environment File');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();

  if (!existsSync(envPath)) {
    logStep('.env File', 'fail', 'Not found', `Expected at: ${envPath}`);
    console.log('\n   To create: Run /setup or create manually');
    return false;
  }

  logStep('.env File', 'pass', 'Found', envPath);
  return true;
}

/**
 * Step 3: Validate required keys
 */
async function checkRequiredKeys(): Promise<{ allPresent: boolean; missing: string[] }> {
  console.log('\n🔑 STEP 3: Required Environment Keys');
  console.log('─'.repeat(50));

  if (REQUIRED_KEYS.length === 0) {
    logStep('Required Keys', 'skip', 'No required keys for this skill');
    return { allPresent: true, missing: [] };
  }

  const envPath = getEnvPath();
  const parsed = parseEnvFile(envPath);
  const missing: string[] = [];

  if (!parsed) {
    logStep('Parse', 'fail', 'Could not parse .env file');
    return { allPresent: false, missing: REQUIRED_KEYS };
  }

  for (const key of REQUIRED_KEYS) {
    if (keyExists(parsed, key)) {
      const value = getKeyValue(parsed, key) || '';
      const masked = value.length > 10 ? value.substring(0, 10) + '...' : '(set)';
      logStep(key, 'pass', masked);
    } else {
      logStep(key, 'fail', 'Missing');
      missing.push(key);
    }
  }

  return { allPresent: missing.length === 0, missing };
}

/**
 * Step 4: Check optional keys
 */
async function checkOptionalKeys(): Promise<void> {
  if (OPTIONAL_KEYS.length === 0) {
    return;
  }

  console.log('\n📝 STEP 4: Optional Environment Keys');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();
  const parsed = parseEnvFile(envPath);

  if (!parsed) {
    logStep('Optional Keys', 'skip', 'Could not parse .env file');
    return;
  }

  for (const key of OPTIONAL_KEYS) {
    if (keyExists(parsed, key)) {
      logStep(key, 'pass', '(configured)');
    } else {
      logStep(key, 'warn', 'Not set (optional)');
    }
  }
}

/**
 * Step 5: Configure missing keys interactively
 */
async function configureMissingKeys(missing: string[]): Promise<void> {
  if (missing.length === 0) {
    return;
  }

  console.log('\n⚙️  STEP 5: Configure Missing Keys');
  console.log('─'.repeat(50));
  console.log('\nThe following keys need to be configured:');

  for (const key of missing) {
    const defaultVal = DEFAULT_VALUES[key];
    if (defaultVal) {
      console.log(`   ${key} (default: ${defaultVal})`);
    } else {
      console.log(`   ${key}`);
    }
  }

  console.log('\n📋 Add these to your .env file under the section:');
  console.log(`   # ${ENV_SECTION}`);
  console.log('');

  // Generate template for user
  for (const key of missing) {
    const defaultVal = DEFAULT_VALUES[key] || '';
    console.log(`   ${key}=${defaultVal}`);
  }

  console.log('\n   Or run: bun skills/' + SKILL_FOLDER + '/scripts/setup.ts configure');
}

/**
 * Apply default configuration to .env file
 */
async function applyConfiguration(): Promise<void> {
  console.log('\n⚙️  Applying Configuration');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();

  // Create backup first
  console.log('   Creating backup...');
  const backup = await backupEnvFile(envPath);
  if (backup.success) {
    console.log(`   ✅ Backup: ${backup.backupPath}`);
  }

  // Build keys map with defaults
  const keysMap = new Map<string, string>();
  for (const key of [...REQUIRED_KEYS, ...OPTIONAL_KEYS]) {
    if (DEFAULT_VALUES[key]) {
      keysMap.set(key, DEFAULT_VALUES[key]);
    } else {
      keysMap.set(key, `your_${key.toLowerCase()}_here`);
    }
  }

  if (keysMap.size === 0) {
    logStep('Configuration', 'skip', 'No keys to configure');
    return;
  }

  // Apply merged configuration
  const result = await applyMergedEnvFile(envPath, ENV_SECTION, keysMap, false);

  if (result.success) {
    logStep('Configuration', 'pass', result.message);
    if (result.addedKeys && result.addedKeys.length > 0) {
      console.log(`   Added: ${result.addedKeys.join(', ')}`);
    }
  } else {
    logStep('Configuration', 'fail', result.message);
  }
}

/**
 * Print setup summary
 */
function printSummary(): void {
  console.log('\n' + '='.repeat(50));
  console.log(`${SKILL_NAME} SETUP SUMMARY`);
  console.log('='.repeat(50));

  const passed = setupLog.filter((s) => s.status === 'pass').length;
  const failed = setupLog.filter((s) => s.status === 'fail').length;
  const warned = setupLog.filter((s) => s.status === 'warn').length;
  const skipped = setupLog.filter((s) => s.status === 'skip').length;

  console.log(`\nResults: ${passed} pass, ${failed} fail, ${warned} warn, ${skipped} skip`);

  if (failed > 0) {
    console.log('\n⚠️  Some setup steps failed. Please review above for details.');
    console.log(`   Run: bun skills/${SKILL_FOLDER}/scripts/setup.ts configure`);
  } else if (warned > 0) {
    console.log('\n✅ Setup mostly complete. Some optional features may need configuration.');
  } else {
    console.log(`\n✅ Setup complete! ${SKILL_NAME} skill is ready to use.`);
  }

  console.log('\n📝 Next Steps:');
  console.log(`   1. Review configuration in ${getEnvPath()}`);
  console.log(`   2. See skills/${SKILL_FOLDER}/SKILL.md for usage`);
  console.log(`   3. Run: bun skills/${SKILL_FOLDER}/scripts/setup.ts test\n`);

  console.log('='.repeat(50) + '\n');
}

/**
 * Main interactive setup flow
 */
async function runSetup(): Promise<void> {
  console.log('\n' + '='.repeat(50));
  console.log(`${SKILL_NAME} SETUP WIZARD`);
  console.log('='.repeat(50));
  console.log(`\nThis wizard will configure the ${SKILL_NAME} skill.`);

  try {
    await checkDependencies();

    const envExists = await checkEnvFile();
    if (!envExists) {
      console.log('\n❌ Cannot proceed without .env file');
      process.exit(1);
    }

    const { allPresent, missing } = await checkRequiredKeys();
    await checkOptionalKeys();

    if (!allPresent) {
      await configureMissingKeys(missing);
    }

    printSummary();
  } catch (error) {
    console.error('\n❌ Setup failed:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

// =============================================================================
// EXPORTED FUNCTIONS - Used by other scripts and health checks
// =============================================================================

/**
 * Validate that skill is properly configured
 * Used by health checks and other scripts
 */
export async function validateSetup(): Promise<ValidationResult> {
  const missing: string[] = [];
  const envPath = getEnvPath();

  // Check .env exists
  if (!existsSync(envPath)) {
    return {
      success: false,
      missing: ['(no .env file)'],
      message: `❌ .env file not found at ${envPath}\nRun: bun skills/${SKILL_FOLDER}/scripts/setup.ts`
    };
  }

  // Check for required keys
  const parsed = parseEnvFile(envPath);
  if (!parsed) {
    return {
      success: false,
      missing: ['(could not parse .env)'],
      message: `❌ Could not parse .env file\nRun: bun skills/${SKILL_FOLDER}/scripts/setup.ts`
    };
  }

  for (const key of REQUIRED_KEYS) {
    if (!keyExists(parsed, key)) {
      missing.push(key);
    }
  }

  // Check dependencies
  const { execFileSync } = await import('child_process');
  for (const dep of DEPENDENCIES) {
    try {
      // PERF-001: intentional - each dependency is a different command; cannot batch
      execFileSync(dep.command.split(' ')[0], dep.command.split(' ').slice(1), { stdio: 'ignore' });
    } catch {
      missing.push(`${dep.name} CLI`);
    }
  }

  if (missing.length === 0) {
    return {
      success: true,
      missing: [],
      message: `✅ ${SKILL_NAME} skill is properly configured`
    };
  }

  return {
    success: false,
    missing,
    message: `❌ Missing: ${missing.join(', ')}\nRun: bun skills/${SKILL_FOLDER}/scripts/setup.ts`
  };
}

/**
 * Test connectivity to external services
 * Override this function for skill-specific connectivity tests
 */
export async function testConnections(): Promise<ConnectivityResult> {
  const results: ConnectivityResult = {};

  // Example: Add skill-specific connectivity tests
  // results['API'] = await testApiConnection();

  // If no tests defined, return empty (skill doesn't need connectivity)
  if (Object.keys(results).length === 0) {
    console.log('   No connectivity tests defined for this skill');
  }

  return results;
}

// =============================================================================
// CLI EXECUTION
// =============================================================================

if (import.meta.main) {
  const command = process.argv[2];

  switch (command) {
    case 'validate':
      validateSetup().then((result) => {
        console.log(result.message);
        if (result.missing.length > 0) {
          console.log(`Missing: ${result.missing.join(', ')}`);
          process.exit(1);
        }
      });
      break;

    case 'test':
      console.log(`\n🧪 Testing ${SKILL_NAME} Connectivity\n`);
      testConnections().then((results) => {
        for (const [service, status] of Object.entries(results)) {
          console.log(`${status ? '✅' : '❌'} ${service}`);
        }
        const allPassed = Object.values(results).every((v) => v);
        process.exit(allPassed ? 0 : 1);
      });
      break;

    case 'configure':
      applyConfiguration().then(() => {
        console.log('\n✅ Configuration template applied to .env');
        console.log('   Please update the placeholder values with your actual credentials.\n');
      });
      break;

    default:
      runSetup();
  }
}
