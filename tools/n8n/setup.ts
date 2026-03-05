#!/usr/bin/env bun
/**
 * n8n Skill Setup & Configuration
 *
 * Validates environment for n8n workflow automation:
 * - n8n instance URL
 * - API key for workflow management
 *
 * Usage:
 *   bun tools/n8n/setup.ts           # Interactive setup
 *   bun tools/n8n/setup.ts validate  # Quick validation
 *   bun tools/n8n/setup.ts test      # Test connectivity
 */

import { existsSync } from 'fs';
import { join } from 'path';
import { resolveEnvPath } from '@/tools/framework/utils/path-resolution';

// Import env-sync utilities
import { parseEnvFile, keyExists, getKeyValue } from '@/tools/framework/env-sync/parser-env';
import { applyMergedEnvFile } from '@/tools/framework/env-sync/merge-env-sections';
import { backupEnvFile } from '@/tools/framework/env-sync/backup-env';

// =============================================================================
// SKILL CONFIGURATION
// =============================================================================

const SKILL_NAME = 'n8n';
const SKILL_FOLDER = 'n8n';
const ENV_SECTION = 'n8n Skill';

/** Required for n8n API access */
const REQUIRED_KEYS: string[] = [
  'N8N_API',
  'N8N_INSTANCE_URL',
];

const OPTIONAL_KEYS: string[] = [];

const DEFAULT_VALUES: Record<string, string> = {
  N8N_INSTANCE_URL: 'https://n8n.your-domain.com/',
};

const DEPENDENCIES: Array<{ name: string; command: string; installUrl?: string }> = [];

// =============================================================================
// SETUP IMPLEMENTATION
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

function getEnvPath(): string {
  return resolveEnvPath();
}

function logStep(step: string, status: 'pass' | 'fail' | 'warn' | 'skip', message: string, details?: string): void {
  const icon = status === 'pass' ? '✅' : status === 'fail' ? '❌' : status === 'warn' ? '⚠️ ' : '⏭️ ';
  console.log(`${icon} ${step}: ${message}`);
  if (details) console.log(`   ${details}`);
  setupLog.push({ step, status, message, details });
}

async function checkEnvFile(): Promise<boolean> {
  console.log('\n📄 STEP 1: Environment File');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();

  if (!existsSync(envPath)) {
    logStep('.env File', 'fail', 'Not found', `Expected at: ${envPath}`);
    return false;
  }

  logStep('.env File', 'pass', 'Found', envPath);
  return true;
}

async function checkRequiredKeys(): Promise<{ allPresent: boolean; missing: string[] }> {
  console.log('\n🔑 STEP 2: n8n API Credentials');
  console.log('─'.repeat(50));

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
      let masked = value;
      if (key === 'N8N_API') {
        masked = value.length > 10 ? value.substring(0, 10) + '...' : '(set)';
      } else if (key === 'N8N_INSTANCE_URL') {
        // Show full URL for instance
        masked = value;
      }
      logStep(key, 'pass', masked);
    } else {
      logStep(key, 'fail', 'Missing');
      missing.push(key);
    }
  }

  return { allPresent: missing.length === 0, missing };
}

async function configureMissingKeys(missing: string[]): Promise<void> {
  if (missing.length === 0) {
    return;
  }

  console.log('\n⚙️  Configure Missing Keys');
  console.log('─'.repeat(50));
  console.log('\nAdd these to your .env file under the section:');
  console.log(`   # ${ENV_SECTION}`);
  console.log('');

  for (const key of missing) {
    const defaultVal = DEFAULT_VALUES[key];
    if (key === 'N8N_API') {
      console.log(`   ${key}=your_n8n_api_key_here`);
      console.log('     # Generate from: n8n Settings > API > Create API Key');
    } else if (key === 'N8N_INSTANCE_URL') {
      console.log(`   ${key}=${defaultVal}`);
      console.log('     # Your n8n instance URL (include trailing slash)');
    } else if (defaultVal) {
      console.log(`   ${key}=${defaultVal}`);
    } else {
      console.log(`   ${key}=your_value_here`);
    }
  }

  console.log('\n   Then run: bun tools/n8n/setup.ts validate');
}

function printSummary(): void {
  console.log('\n' + '='.repeat(50));
  console.log('N8N SKILL SETUP SUMMARY');
  console.log('='.repeat(50));

  const passed = setupLog.filter((s) => s.status === 'pass').length;
  const failed = setupLog.filter((s) => s.status === 'fail').length;
  const warned = setupLog.filter((s) => s.status === 'warn').length;
  const skipped = setupLog.filter((s) => s.status === 'skip').length;

  console.log(`\nResults: ${passed} pass, ${failed} fail, ${warned} warn, ${skipped} skip`);

  if (failed > 0) {
    console.log('\n⚠️  n8n API credentials required.');
  } else {
    console.log('\n✅ Setup complete! n8n skill is ready to use.');
  }

  console.log('\n📝 Next Steps:');
  console.log('   1. Run: bun tools/n8n/setup.ts test');
  console.log('   2. Try: /workflow list');
  console.log('   3. See tools/n8n/SKILL.md for documentation\n');

  console.log('='.repeat(50) + '\n');
}

async function runSetup(): Promise<void> {
  console.log('\n' + '='.repeat(50));
  console.log('N8N SKILL SETUP WIZARD');
  console.log('='.repeat(50));
  console.log('\nThis wizard will configure the n8n workflow automation skill.');

  try {
    const envExists = await checkEnvFile();
    if (!envExists) {
      console.log('\n❌ Cannot proceed without .env file');
      process.exit(1);
    }

    const { allPresent, missing } = await checkRequiredKeys();

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
// EXPORTED FUNCTIONS
// =============================================================================

export async function validateSetup(): Promise<ValidationResult> {
  const missing: string[] = [];
  const envPath = getEnvPath();

  if (!existsSync(envPath)) {
    return {
      success: false,
      missing: ['(no .env file)'],
      message: `❌ .env file not found at ${envPath}\nRun: bun tools/n8n/setup.ts`
    };
  }

  const parsed = parseEnvFile(envPath);
  if (!parsed) {
    return {
      success: false,
      missing: ['(could not parse .env)'],
      message: '❌ Could not parse .env file\nRun: bun tools/n8n/setup.ts'
    };
  }

  for (const key of REQUIRED_KEYS) {
    if (!keyExists(parsed, key)) {
      missing.push(key);
    }
  }

  if (missing.length === 0) {
    return {
      success: true,
      missing: [],
      message: '✅ n8n skill is properly configured'
    };
  }

  return {
    success: false,
    missing,
    message: `❌ Missing: ${missing.join(', ')}\nRun: bun tools/n8n/setup.ts`
  };
}

export async function testConnections(): Promise<ConnectivityResult> {
  const results: ConnectivityResult = {};
  const envPath = getEnvPath();
  const parsed = parseEnvFile(envPath);

  if (!parsed) {
    return { 'env-parse': false };
  }

  // Test n8n API connectivity
  const instanceUrl = getKeyValue(parsed, 'N8N_INSTANCE_URL');
  const apiKey = getKeyValue(parsed, 'N8N_API');

  if (instanceUrl && apiKey) {
    try {
      // Test workflows endpoint
      const url = instanceUrl.endsWith('/') ? instanceUrl : instanceUrl + '/';
      const response = await fetch(`${url}api/v1/workflows`, {
        headers: {
          'X-N8N-API-KEY': apiKey,
        },
      });
      results['n8n API'] = response.ok;
    } catch {
      results['n8n API'] = false;
    }
  } else {
    results['n8n API'] = false;
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
      console.log('\n🧪 Testing n8n Skill Connectivity\n');
      testConnections().then((results) => {
        for (const [service, status] of Object.entries(results)) {
          console.log(`${status ? '✅' : '❌'} ${service}`);
        }
        const allPassed = Object.values(results).every((v) => v);
        if (allPassed) {
          console.log('\n✅ All connectivity tests passed\n');
        } else {
          console.log('\n⚠️  Connection failed. Check n8n URL and API key.\n');
        }
        process.exit(allPassed ? 0 : 1);
      });
      break;

    case 'configure':
      console.log('\n⚙️  Applying default configuration template...\n');
      const envPath = getEnvPath();
      backupEnvFile(envPath).then(() => {
        const keysMap = new Map<string, string>();
        for (const key of REQUIRED_KEYS) {
          keysMap.set(key, DEFAULT_VALUES[key] || `your_${key.toLowerCase()}_here`);
        }
        return applyMergedEnvFile(envPath, ENV_SECTION, keysMap, false);
      }).then((result) => {
        if (result.success) {
          console.log('✅ Configuration template applied');
          console.log('   Please update placeholder values with your n8n credentials.\n');
        } else {
          console.log('❌ Configuration failed:', result.message);
        }
      });
      break;

    default:
      runSetup();
  }
}
