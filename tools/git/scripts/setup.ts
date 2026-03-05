#!/usr/bin/env bun
/**
 * Git Skill Setup & Configuration
 *
 * Interactive setup wizard that guides users through:
 * 1. Verify git is installed
 * 2. Install gh CLI (GitHub CLI) if needed
 * 3. Authenticate with GitHub
 * 4. Configure environment variables using env-sync
 * 5. Validate repository paths
 * 6. Test connectivity
 *
 * Usage:
 *   bun tools/git/scripts/setup.ts           # Interactive setup
 *   bun tools/git/scripts/setup.ts validate  # Quick validation
 *   bun tools/git/scripts/setup.ts test      # Test connectivity
 */

import { execSync, execFileSync } from 'child_process';
import { existsSync, writeFileSync, readFileSync, copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';

// Inline minimal env-sync utilities to avoid @/ alias dependency
// These are simplified versions that work without the full framework

interface ParsedEnv {
  sections: Map<string, { name: string; keys: Map<string, string> }>;
  allLines: Array<{ type: string; key?: string; value?: string }>;
}

function parseEnvFile(envPath: string): ParsedEnv | null {
  if (!existsSync(envPath)) return null;
  const content = readFileSync(envPath, 'utf-8');
  const lines = content.split('\n');
  const sections = new Map<string, { name: string; keys: Map<string, string> }>();
  const allLines: Array<{ type: string; key?: string; value?: string }> = [];

  let currentSection = { name: 'Unsorted', keys: new Map<string, string>() };

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('#') && trimmed.includes('[')) {
      const match = trimmed.match(/\[(.+)\]/);
      if (match) {
        currentSection = { name: match[1], keys: new Map<string, string>() };
        sections.set(currentSection.name, currentSection);
      }
      allLines.push({ type: 'section', key: match?.[1] });
    } else if (trimmed.includes('=') && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      const value = valueParts.join('=').trim();
      currentSection.keys.set(key.trim(), value);
      allLines.push({ type: 'key-value', key: key.trim(), value });
    } else {
      allLines.push({ type: 'other' });
    }
  }

  return { sections, allLines };
}

function keyExists(parsed: ParsedEnv | null, key: string): boolean {
  if (!parsed) return false;
  for (const section of parsed.sections.values()) {
    if (section.keys.has(key)) return true;
  }
  return false;
}

function getKeyValue(parsed: ParsedEnv | null, key: string): string | null {
  if (!parsed) return null;
  for (const section of parsed.sections.values()) {
    if (section.keys.has(key)) return section.keys.get(key) || null;
  }
  return null;
}

async function applyMergedEnvFile(
  envPath: string,
  sectionName: string,
  keys: Record<string, string>,
  _dryRun: boolean
): Promise<boolean> {
  // Simplified version - just appends to .env
  const content = existsSync(envPath) ? readFileSync(envPath, 'utf-8') : '';
  let newContent = content;

  if (!newContent.endsWith('\n')) newContent += '\n';
  newContent += `\n# ${sectionName}\n`;
  for (const [key, value] of Object.entries(keys)) {
    newContent += `${key}=${value}\n`;
  }

  writeFileSync(envPath, newContent);
  return true;
}

function backupEnvFile(envPath: string): string {
  const backupPath = envPath + '.backup';
  if (existsSync(envPath)) {
    copyFileSync(envPath, backupPath);
  }
  return backupPath;
}

function resolveEnvPath(): string {
  const home = process.env.HOME || process.env.USERPROFILE || '~';
  return join(home, '.env');
}

function resolveFrameworkRoot(): string {
  const scriptDir = join(__dirname, '..', '..', '..', '..');
  let current = scriptDir;
  for (let i = 0; i < 10; i++) {
    if (existsSync(join(current, '.git'))) {
      return current;
    }
    const parent = join(current, '..');
    if (parent === current) break;
    current = parent;
  }
  return process.cwd();
}

// =============================================================================
// SKILL CONFIGURATION
// =============================================================================

const SKILL_NAME = 'Git';
const SKILL_FOLDER = 'git';
const ENV_SECTION = 'Git Skill';

const REQUIRED_KEYS: string[] = [
  'GITHUB_TOKEN',
];

const OPTIONAL_KEYS: string[] = [
  'GIT_PUSH_REPO_PATH',
  'GIT_PUSH_REMOTE',
  'GIT_PUSH_BRANCH',
  'GIT_PUBLIC_REPO_PATH',
];

const DEFAULT_VALUES: Record<string, string> = {
  GIT_PUSH_REMOTE: 'origin',
  GIT_PUSH_BRANCH: 'main',
};

const DEPENDENCIES: Array<{ name: string; command: string; installUrl?: string }> = [
  { name: 'git', command: 'git --version', installUrl: 'https://git-scm.com/download' },
  { name: 'gh', command: 'gh --version', installUrl: 'https://cli.github.com/' },
];

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

/**
 * Step 1: Check if git is installed
 */
function setupGit(): void {
  console.log('\n📦 STEP 1: Verify Git Installation');
  console.log('─'.repeat(50));

  try {
    const gitVersion = execSync('git --version', { encoding: 'utf-8' }).trim();
    logStep('Git CLI', 'pass', gitVersion);
  } catch {
    logStep('Git CLI', 'fail', 'Git not installed', 'Install from: https://git-scm.com/download');
    throw new Error('Git is required but not installed');
  }
}

/**
 * Step 2: Check if gh CLI is installed
 */
function setupGhCLI(): void {
  console.log('\n🔐 STEP 2: GitHub CLI (gh)');
  console.log('─'.repeat(50));

  try {
    const ghVersion = execSync('gh --version', { encoding: 'utf-8' }).trim().split('\n')[0];
    logStep('GitHub CLI', 'pass', ghVersion);
  } catch {
    logStep('GitHub CLI', 'warn', 'Not installed');

    try {
      const platform = process.platform;
      let installCmd = '';

      if (platform === 'darwin') {
        installCmd = 'brew install gh';
      } else if (platform === 'linux') {
        try {
          execSync('which apt', { stdio: 'ignore' });
          installCmd = 'sudo apt update && sudo apt install -y gh';
        } catch {
          logStep('GitHub CLI', 'warn', 'Could not auto-install', 'Manual install: https://cli.github.com/');
          return;
        }
      } else if (platform === 'win32') {
        installCmd = 'choco install gh';
      }

      if (installCmd) {
        console.log(`   Running: ${installCmd}`);
        execSync(installCmd, { stdio: 'inherit' });
        logStep('GitHub CLI', 'pass', 'Installation completed');
      }
    } catch {
      logStep('GitHub CLI', 'warn', 'Could not auto-install', 'Manual: https://cli.github.com/');
    }
  }
}

/**
 * Step 3: Check GitHub authentication
 */
function setupGithubAuth(): void {
  console.log('\n🔑 STEP 3: GitHub Authentication');
  console.log('─'.repeat(50));

  try {
    execSync('gh auth status', { stdio: 'pipe' });
    logStep('GitHub Auth', 'pass', 'Already authenticated');
  } catch {
    logStep('GitHub Auth', 'warn', 'Not authenticated', 'Starting authentication...');

    try {
      console.log('\n   Opening GitHub authentication...');
      execSync('gh auth login -p https -w', { stdio: 'inherit' });
      logStep('GitHub Auth', 'pass', 'Authentication successful');
    } catch {
      logStep('GitHub Auth', 'fail', 'Authentication failed', 'Manually run: gh auth login');
    }
  }
}

/**
 * Step 4: Configure environment variables using env-sync
 */
async function setupGithubToken(): Promise<void> {
  console.log('\n🎫 STEP 4: GitHub Token Configuration');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();

  // Check if token already configured in environment
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.startsWith('gh')) {
    logStep('GitHub Token', 'pass', 'Already configured', 'Token length: ' + process.env.GITHUB_TOKEN.length);
    return;
  }

  // Check if token exists in .env
  if (existsSync(envPath)) {
    const parsed = parseEnvFile(envPath);
    if (parsed && keyExists(parsed, 'GITHUB_TOKEN')) {
      logStep('GitHub Token', 'pass', 'Found in .env');
      return;
    }
  }

  logStep('GitHub Token', 'warn', 'Not configured in .env');

  // Try to get token from gh CLI
  let token = '';
  try {
    token = execSync('gh auth token', { encoding: 'utf-8' }).trim();
  } catch {
    logStep('GitHub Token', 'fail', 'Could not retrieve token from gh CLI');
    console.log('   Run: gh auth login first');
    return;
  }

  if (!token) {
    logStep('GitHub Token', 'fail', 'Empty token returned');
    return;
  }

  // Create .env if it doesn't exist
  if (!existsSync(envPath)) {
    logStep('.env File', 'warn', 'Creating new .env file', envPath);
    writeFileSync(envPath, '# Intelligence Adjacent Framework - Environment Variables\n\n');
  }

  // Create backup before modifying
  console.log('   Creating backup...');
  const backup = await backupEnvFile(envPath);
  if (backup.success) {
    console.log(`   ✅ Backup: ${backup.backupPath}`);
  }

  // Build keys map using env-sync
  const keysMap = new Map<string, string>();
  keysMap.set('GITHUB_TOKEN', token);
  keysMap.set('GIT_PUSH_REPO_PATH', resolveFrameworkRoot());
  keysMap.set('GIT_PUSH_REMOTE', DEFAULT_VALUES.GIT_PUSH_REMOTE);
  keysMap.set('GIT_PUSH_BRANCH', DEFAULT_VALUES.GIT_PUSH_BRANCH);

  // Apply using env-sync
  const result = await applyMergedEnvFile(envPath, ENV_SECTION, keysMap, false);

  if (result.success) {
    logStep('GitHub Token', 'pass', 'Added to .env using env-sync', `Path: ${envPath}`);
    if (result.addedKeys && result.addedKeys.length > 0) {
      console.log(`   Added: ${result.addedKeys.join(', ')}`);
    }
  } else {
    logStep('GitHub Token', 'fail', 'Could not save to .env', result.message);
  }
}

/**
 * Step 5: Validate repository configuration
 */
function setupRepositories(): void {
  console.log('\n📂 STEP 5: Repository Configuration');
  console.log('─'.repeat(50));

  const envPath = getEnvPath();
  const parsed = existsSync(envPath) ? parseEnvFile(envPath) : null;

  const gitPushRepo = parsed ? getKeyValue(parsed, 'GIT_PUSH_REPO_PATH') : null;
  const gitPublicRepo = parsed ? getKeyValue(parsed, 'GIT_PUBLIC_REPO_PATH') : null;
  const repoPath = gitPushRepo || resolveFrameworkRoot();

  // Check private repo
  if (existsSync(repoPath)) {
    try {
      const remotes = execFileSync('git', ['remote', '-v'], { encoding: 'utf-8', cwd: repoPath });
      if (remotes.length > 0) {
        logStep('Private Repo', 'pass', repoPath, 'Configured and valid');
      } else {
        logStep('Private Repo', 'warn', repoPath, 'Path exists but not a git repository');
      }
    } catch {
      logStep('Private Repo', 'warn', repoPath, 'Not a git repository');
    }
  } else {
    logStep('Private Repo', 'warn', repoPath, 'Path does not exist yet');
  }

  // Check public repo (optional)
  if (gitPublicRepo) {
    if (existsSync(gitPublicRepo)) {
      try {
        const remotes = execFileSync('git', ['remote', '-v'], { encoding: 'utf-8', cwd: gitPublicRepo });
        if (remotes.length > 0) {
          logStep('Public Repo', 'pass', gitPublicRepo, 'Configured and valid');
        } else {
          logStep('Public Repo', 'warn', gitPublicRepo, 'Not a git repository');
        }
      } catch {
        logStep('Public Repo', 'warn', gitPublicRepo, 'Not a git repository');
      }
    } else {
      logStep('Public Repo', 'warn', gitPublicRepo, 'Path does not exist - will be created when needed');
    }
  } else {
    logStep('Public Repo', 'skip', 'No GIT_PUBLIC_REPO_PATH configured', 'Optional - only needed for /git-public');
  }
}

/**
 * Step 6: Test connectivity
 */
function testConnectivity(): void {
  console.log('\n🌐 STEP 6: Test Connectivity');
  console.log('─'.repeat(50));

  try {
    execSync('gh repo list --limit 1', { stdio: 'pipe' });
    logStep('GitHub API', 'pass', 'Connected to GitHub successfully');
  } catch {
    logStep('GitHub API', 'fail', 'Could not reach GitHub API', 'Check internet connection or token validity');
  }

  try {
    execSync('git status', { stdio: 'pipe' });
    logStep('Git', 'pass', 'Git working correctly');
  } catch {
    logStep('Git', 'warn', 'Not in a git repository', 'This is normal if not running from a repo');
  }
}

function printSummary(): void {
  console.log('\n' + '='.repeat(50));
  console.log('GIT SKILL SETUP SUMMARY');
  console.log('='.repeat(50));

  const passed = setupLog.filter((s) => s.status === 'pass').length;
  const failed = setupLog.filter((s) => s.status === 'fail').length;
  const warned = setupLog.filter((s) => s.status === 'warn').length;
  const skipped = setupLog.filter((s) => s.status === 'skip').length;

  console.log(`\nResults: ${passed} pass, ${failed} fail, ${warned} warn, ${skipped} skip`);

  if (failed > 0) {
    console.log('\n⚠️  Some setup steps failed. Please review above for details.');
  } else if (warned > 0) {
    console.log('\n✅ Setup mostly complete. Some optional features may need manual configuration.');
  } else {
    console.log('\n✅ Setup complete! Your git skill is ready to use.');
  }

  console.log('\n📝 Next Steps:');
  console.log(`   1. Review configuration in ${getEnvPath()}`);
  console.log('   2. Configure GIT_PUBLIC_REPO_PATH if you want to sync to a public repo');
  console.log('   3. Try: /git-push to test pushing to your repo');
  console.log('   4. See tools/git/SKILL.md for complete command documentation\n');

  console.log('='.repeat(50) + '\n');
}

async function runSetup(): Promise<void> {
  console.log('\n' + '='.repeat(50));
  console.log('GIT SKILL SETUP WIZARD');
  console.log('='.repeat(50));
  console.log('\nThis wizard will help you configure the Git Skill for your system.');
  console.log('It will check for required tools and set up your GitHub credentials.\n');

  try {
    setupGit();
    setupGhCLI();
    setupGithubAuth();
    await setupGithubToken();
    setupRepositories();
    testConnectivity();
    printSummary();
  } catch (error) {
    console.error('\n❌ Setup failed:', error instanceof Error ? error.message : String(error));
    console.error('\nPlease review the errors above and fix them manually.');
    console.error('Documentation: tools/git/SKILL.md');
    process.exit(1);
  }
}

// =============================================================================
// EXPORTED FUNCTIONS
// =============================================================================

export async function validateSetup(): Promise<ValidationResult> {
  const missing: string[] = [];
  const envPath = getEnvPath();

  // Check for .env and GitHub token
  if (existsSync(envPath)) {
    const parsed = parseEnvFile(envPath);
    if (!parsed || !keyExists(parsed, 'GITHUB_TOKEN')) {
      if (!process.env.GITHUB_TOKEN) {
        missing.push('GITHUB_TOKEN');
      }
    }
  } else if (!process.env.GITHUB_TOKEN) {
    missing.push('GITHUB_TOKEN');
  }

  // Check for git
  try {
    execSync('git --version', { stdio: 'ignore' });
  } catch {
    missing.push('git CLI');
  }

  // Check for gh CLI (optional but recommended)
  try {
    execSync('gh --version', { stdio: 'ignore' });
  } catch {
    missing.push('gh CLI (optional)');
  }

  if (missing.length === 0 || (missing.length === 1 && missing[0].includes('optional'))) {
    return {
      success: true,
      missing: [],
      message: '✅ Git skill is properly configured'
    };
  }

  return {
    success: false,
    missing,
    message: `❌ Missing: ${missing.join(', ')}\nRun: bun tools/git/scripts/setup.ts`
  };
}

export async function testConnections(): Promise<ConnectivityResult> {
  const results: ConnectivityResult = {};

  // Test GitHub API via gh CLI
  try {
    execSync('gh repo list --limit 1', { stdio: 'pipe' });
    results['GitHub API'] = true;
  } catch {
    results['GitHub API'] = false;
  }

  // Test git
  try {
    execSync('git --version', { stdio: 'ignore' });
    results['Git'] = true;
  } catch {
    results['Git'] = false;
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
      console.log('\n🧪 Testing Git Skill Connectivity\n');
      testConnections().then((results) => {
        for (const [service, status] of Object.entries(results)) {
          console.log(`${status ? '✅' : '❌'} ${service}`);
        }
        const allPassed = Object.values(results).every((v) => v);
        if (allPassed) {
          console.log('\n✅ All connectivity tests passed\n');
        } else {
          console.log('\n⚠️  Some tests failed. Check authentication.\n');
        }
        process.exit(allPassed ? 0 : 1);
      });
      break;

    case 'configure':
      console.log('\n⚙️  Applying default configuration template...\n');
      const envPath = getEnvPath();
      if (existsSync(envPath)) {
        backupEnvFile(envPath).then(() => {
          const keysMap = new Map<string, string>();
          keysMap.set('GITHUB_TOKEN', '[insert github token]');
          keysMap.set('GIT_PUSH_REPO_PATH', resolveFrameworkRoot());
          keysMap.set('GIT_PUSH_REMOTE', DEFAULT_VALUES.GIT_PUSH_REMOTE);
          keysMap.set('GIT_PUSH_BRANCH', DEFAULT_VALUES.GIT_PUSH_BRANCH);
          return applyMergedEnvFile(envPath, ENV_SECTION, keysMap, false);
        }).then((result) => {
          if (result.success) {
            console.log('✅ Configuration template applied');
            console.log('   Please update GITHUB_TOKEN with your token.\n');
          } else {
            console.log('❌ Configuration failed:', result.message);
          }
        });
      } else {
        console.log('⚠️  No .env file found. Run the full setup wizard instead.\n');
        runSetup();
      }
      break;

    default:
      runSetup();
  }
}
