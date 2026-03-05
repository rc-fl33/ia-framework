#!/usr/bin/env bun

/**
 * IA Framework Installer - Main Orchestrator
 *
 * Coordinates framework installation across all platforms:
 * - Platform detection
 * - Prerequisite installation (git, bun)
 * - WSL optimization (Windows only)
 * - Framework structure validation
 * - Environment configuration
 * - Dependency installation
 * - Health check validation
 *
 * @module install-framework
 */

import { existsSync, writeFileSync, readFileSync, copyFileSync, lstatSync, unlinkSync, renameSync, symlinkSync, mkdirSync, readdirSync } from 'fs';
import { execSync, execFileSync } from 'child_process';
import { join, dirname } from 'path';
import { homedir } from 'os';
import { detectPlatform, formatPlatformInfo } from './platform-detector';
import { configureWSL } from './wsl-configurator';
import { checkGit, installGit, configureGit } from './git-installer';
import { checkBun, installBun } from './bun-installer';
import { checkSystemDependencies, installSystemDependencies } from './system-deps-checker';

export type InstallMode = 'fresh' | 'verify' | 'repair';

export interface InstallResult {
  success: boolean;
  platform: Awaited<ReturnType<typeof detectPlatform>>;
  steps: {
    name: string;
    success: boolean;
    message: string;
    skipped?: boolean;
  }[];
  issues: string[];
  warnings: string[];
}

/**
 * Validate framework structure
 */
async function validateStructure(frameworkPath: string): Promise<{ valid: boolean; issues: string[] }> {
  const issues: string[] = [];

  // Required directories
  const requiredDirs = [
    'agents',
    'skills',
    'commands',
    'hooks',
    'tools',
    'docs'
  ];

  for (const dir of requiredDirs) {
    if (!existsSync(join(frameworkPath, dir))) {
      issues.push(`Missing required directory: ${dir}`);
    }
  }

  // Required files
  const requiredFiles = [
    'CLAUDE.md',
    'settings.json',
    'README.md',
    'LICENSE'
  ];

  for (const file of requiredFiles) {
    if (!existsSync(join(frameworkPath, file))) {
      issues.push(`Missing required file: ${file}`);
    }
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

/**
 * Setup .env file if it doesn't exist
 */
async function setupEnv(frameworkPath: string): Promise<{ success: boolean; message: string }> {
  const envPath = join(frameworkPath, '.env');
  const envExamplePath = join(frameworkPath, '.env.example');

  // If .env exists, don't overwrite
  if (existsSync(envPath)) {
    return {
      success: true,
      message: '.env already exists (not overwritten)'
    };
  }

  // If .env.example exists, copy it
  if (existsSync(envExamplePath)) {
    try {
      copyFileSync(envExamplePath, envPath);
      return {
        success: true,
        message: '.env created from .env.example'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create .env: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  // Create minimal .env
  const minimalEnv = `# IA Framework Environment Configuration
# Copy this template and add your API keys

# Core APIs (optional)
ANTHROPIC_API_KEY=[insert key]
OPENROUTER_API_KEY=[insert key]

# Additional features (optional)
GITHUB_TOKEN=[insert key]
GHOST_ADMIN_API_KEY=[insert key]
GHOST_API_URL=[insert url]

# Note: Framework works without these - they enable specific features
`;

  try {
    writeFileSync(envPath, minimalEnv, 'utf-8');
    return {
      success: true,
      message: '.env created from minimal template'
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create .env: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Setup privacy configuration in settings.json
 */
async function setupPrivacy(frameworkPath: string): Promise<{ success: boolean; message: string }> {
  const settingsPath = join(frameworkPath, 'settings.json');
  const settingsExamplePath = join(frameworkPath, 'settings.json.example');

  // If settings.json exists, merge privacy settings
  if (existsSync(settingsPath)) {
    try {
      const currentSettings = JSON.parse(readFileSync(settingsPath, 'utf-8'));

      // Ensure env section exists with privacy vars
      currentSettings.env = currentSettings.env || {};
      currentSettings.env.DISABLE_TELEMETRY = "1";
      currentSettings.env.DISABLE_ERROR_REPORTING = "1";
      currentSettings.env.DISABLE_BUG_COMMAND = "1";
      currentSettings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1";

      writeFileSync(settingsPath, JSON.stringify(currentSettings, null, 2), 'utf-8');
      return {
        success: true,
        message: 'Privacy settings merged into existing settings.json'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to update settings.json: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  // If settings.json doesn't exist, copy from example
  if (existsSync(settingsExamplePath)) {
    try {
      copyFileSync(settingsExamplePath, settingsPath);
      return {
        success: true,
        message: 'Created settings.json from template with privacy defaults'
      };
    } catch (error) {
      return {
        success: false,
        message: `Failed to create settings.json: ${error instanceof Error ? error.message : String(error)}`
      };
    }
  }

  // Create minimal settings.json with privacy defaults
  const minimalSettings = {
    "$schema": "https://json.schemastore.org/claude-code-settings.json",
    "env": {
      "DISABLE_TELEMETRY": "1",
      "DISABLE_ERROR_REPORTING": "1",
      "DISABLE_BUG_COMMAND": "1",
      "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC": "1"
    },
    "description": "Intelligence Adjacent Framework - Privacy-first configuration"
  };

  try {
    writeFileSync(settingsPath, JSON.stringify(minimalSettings, null, 2), 'utf-8');
    return {
      success: true,
      message: 'Created settings.json with privacy defaults'
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create settings.json: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}

/**
 * Create symlinks from ~/.claude to framework files
 * Creates real directories and symlinks individual files within them
 */
async function createSymlinks(frameworkPath: string): Promise<{ success: boolean; message: string; warnings: string[] }> {
  const warnings: string[] = [];
  const claudeDir = join(homedir(), '.claude');

  // Ensure ~/.claude directory exists
  if (!existsSync(claudeDir)) {
    try {
      mkdirSync(claudeDir, { recursive: true });
    } catch (error) {
      return {
        success: false,
        message: `Failed to create ~/.claude directory: ${error instanceof Error ? error.message : String(error)}`,
        warnings
      };
    }
  }

  let successCount = 0;
  let totalFiles = 0;

  // 1. Symlink individual files (CLAUDE.md, settings.json)
  const rootFiles = [
    { source: join(frameworkPath, 'CLAUDE.md'), target: join(claudeDir, 'CLAUDE.md') },
    { source: join(frameworkPath, 'settings.json'), target: join(claudeDir, 'settings.json') }
  ];

  for (const { source, target } of rootFiles) {
    totalFiles++;
    if (!existsSync(source)) {
      warnings.push(`Source ${source} does not exist - skipping`);
      continue;
    }

    try {
      // Remove existing target
      if (existsSync(target)) {
        const stats = lstatSync(target);
        if (stats.isSymbolicLink()) {
          unlinkSync(target);
        } else {
          const backup = `${target}.bak`;
          renameSync(target, backup);
          warnings.push(`Backed up existing ${filename(target)} to ${filename(backup)}`);
        }
      }

      // Create symlink
      symlinkSync(source, target);
      successCount++;
    } catch (error) {
      warnings.push(`Failed to symlink ${filename(target)}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  // 2. Create directory structures and symlink files inside them
  const directories = ['agents', 'commands', 'hooks'];

  for (const dir of directories) {
    const sourceDir = join(frameworkPath, dir);
    const targetDir = join(claudeDir, dir);

    // CRITICAL FIX: Detect and remove directory symlinks before proceeding
    // If target is a directory symlink, remove it so we can create a real directory
    if (existsSync(targetDir)) {
      const stats = lstatSync(targetDir);
      if (stats.isSymbolicLink()) {
        try {
          unlinkSync(targetDir);
          warnings.push(`Removed directory symlink at ${dir}/ (will recreate as real directory with file symlinks)`);
        } catch (error) {
          warnings.push(`Failed to remove directory symlink ${dir}/: ${error instanceof Error ? error.message : String(error)}`);
          continue;
        }
      }
    }

    // Create directory if missing in framework (for public installs)
    if (!existsSync(sourceDir)) {
      if (dir === 'agents') {
        try {
          mkdirSync(sourceDir, { recursive: true });
          const readme = join(sourceDir, 'README.md');
          writeFileSync(readme, `# Agents Directory

This directory contains specialized agents for the IA Framework.

## What are agents?

Agents are specialized sub-processes that handle specific domains.

## Public Framework

The public framework starts with an empty agents directory. Agents can be:
1. Created manually using agent templates from \`docs/templates/\`
2. Added from the private framework (if you have access)
3. Built using the \`/create\` wizard

See \`docs/templates/agent-template.md\` for creating new agents.
`, 'utf-8');
          warnings.push(`Created missing ${dir} directory in framework`);
        } catch (error) {
          warnings.push(`Failed to create ${dir} directory: ${error instanceof Error ? error.message : String(error)}`);
          continue;
        }
      } else {
        warnings.push(`Source directory ${sourceDir} does not exist - skipping`);
        continue;
      }
    }

    // Create target directory structure
    try {
      mkdirSync(targetDir, { recursive: true });
    } catch (error) {
      warnings.push(`Failed to create ${targetDir}: ${error instanceof Error ? error.message : String(error)}`);
      continue;
    }

    // Symlink all files in source directory
    try {
      const files = readdirSync(sourceDir, { withFileTypes: true });

      for (const file of files) {
        const sourcePath = join(sourceDir, file.name);
        const targetPath = join(targetDir, file.name);
        totalFiles++;

        try {
          // Remove existing symlink
          if (existsSync(targetPath)) {
            const stats = lstatSync(targetPath);
            if (stats.isSymbolicLink()) {
              unlinkSync(targetPath);
            }
          }

          // Create symlink
          symlinkSync(sourcePath, targetPath);
          successCount++;
        } catch (error) {
          warnings.push(`Failed to symlink ${dir}/${file.name}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    } catch (error) {
      warnings.push(`Failed to read directory ${sourceDir}: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  const success = successCount === totalFiles;

  return {
    success,
    message: success
      ? `Created ${successCount} symlinks to ~/.claude (${directories.join(', ')})`
      : `Created ${successCount}/${totalFiles} symlinks (some failed)`,
    warnings
  };
}

// Helper function to get filename from path
function filename(path: string): string {
  return path.split('/').pop() || path;
}

/**
 * Create symlinks from commands/ to skills/[skill]/commands/[command].md
 */
async function createSkillCommandSymlinks(frameworkPath: string): Promise<{ success: boolean; message: string; warnings: string[] }> {
  const warnings: string[] = [];
  const commandsDir = join(frameworkPath, 'commands');
  const skillsDir = join(frameworkPath, 'skills');

  if (!existsSync(skillsDir)) {
    return {
      success: false,
      message: 'Skills directory not found',
      warnings
    };
  }

  let created = 0;
  let skipped = 0;

  try {
    // Find all skill command files
    const skills = readdirSync(skillsDir);

    for (const skill of skills) {
      const skillCommandsDir = join(skillsDir, skill, 'commands');

      if (!existsSync(skillCommandsDir)) {
        continue; // Skill has no commands directory
      }

      // Read command files in this skill
      const commandFiles = readdirSync(skillCommandsDir).filter(f => f.endsWith('.md'));

      for (const cmdFile of commandFiles) {
        const source = join(skillCommandsDir, cmdFile);
        const target = join(commandsDir, cmdFile);

        try {
          // Check if target already exists
          if (existsSync(target)) {
            const stats = lstatSync(target);
            if (stats.isSymbolicLink()) {
              // Remove existing symlink
              unlinkSync(target);
            } else {
              // Real file exists - don't overwrite
              warnings.push(`Skipping ${cmdFile} - real file exists in commands/`);
              skipped++;
              continue;
            }
          }

          // Create symlink (relative path)
          const relativePath = join('..', 'skills', skill, 'commands', cmdFile);
          symlinkSync(relativePath, target);
          created++;
        } catch (error) {
          warnings.push(`Failed to create symlink for ${cmdFile}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return {
      success: true,
      message: created > 0
        ? `Created ${created} skill command symlinks${skipped > 0 ? ` (${skipped} skipped)` : ''}`
        : 'No skill commands found to link',
      warnings
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create skill command symlinks: ${error instanceof Error ? error.message : String(error)}`,
      warnings
    };
  }
}

/**
 * Create symlinks from commands/ to tools/[tool]/commands/[command].md
 */
async function createToolCommandSymlinks(frameworkPath: string): Promise<{ success: boolean; message: string; warnings: string[] }> {
  const warnings: string[] = [];
  const commandsDir = join(frameworkPath, 'commands');
  const toolsDir = join(frameworkPath, 'tools');

  if (!existsSync(toolsDir)) {
    return {
      success: false,
      message: 'Tools directory not found',
      warnings
    };
  }

  let created = 0;
  let skipped = 0;

  try {
    const tools = readdirSync(toolsDir);

    for (const tool of tools) {
      const toolCommandsDir = join(toolsDir, tool, 'commands');

      if (!existsSync(toolCommandsDir)) {
        continue;
      }

      const commandFiles = readdirSync(toolCommandsDir).filter(f => f.endsWith('.md'));

      for (const cmdFile of commandFiles) {
        const source = join(toolCommandsDir, cmdFile);
        const target = join(commandsDir, cmdFile);

        try {
          if (existsSync(target)) {
            const stats = lstatSync(target);
            if (stats.isSymbolicLink()) {
              unlinkSync(target);
            } else {
              warnings.push(`Skipping ${cmdFile} - real file exists in commands/`);
              skipped++;
              continue;
            }
          }

          const relativePath = join('..', 'tools', tool, 'commands', cmdFile);
          symlinkSync(relativePath, target);
          created++;
        } catch (error) {
          warnings.push(`Failed to create symlink for ${cmdFile}: ${error instanceof Error ? error.message : String(error)}`);
        }
      }
    }

    return {
      success: true,
      message: created > 0
        ? `Created ${created} tool command symlinks${skipped > 0 ? ` (${skipped} skipped)` : ''}`
        : 'No tool commands found to link',
      warnings
    };
  } catch (error) {
    return {
      success: false,
      message: `Failed to create tool command symlinks: ${error instanceof Error ? error.message : String(error)}`,
      warnings
    };
  }
}

/**
 * Scan a top-level directory for package.json files in subdirs (root and scripts/),
 * then run `bun install` in parallel for any that lack node_modules.
 * Mutates the provided installed/failed arrays with results.
 */
async function installDepsInSubdirs(
  parentPath: string,
  frameworkPath: string,
  label: string,
  installed: string[],
  failed: string[]
): Promise<void> {
  if (!existsSync(parentPath)) return;

  const entries = readdirSync(parentPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const tasks: { name: string; pkgDir: string; relPath: string }[] = [];

  for (const entry of entries) {
    const locations = [
      join(parentPath, entry, 'package.json'),
      join(parentPath, entry, 'scripts', 'package.json')
    ];

    for (const pkgPath of locations) {
      if (existsSync(pkgPath)) {
        const pkgDir = dirname(pkgPath);
        if (!existsSync(join(pkgDir, 'node_modules'))) {
          tasks.push({ name: entry, pkgDir, relPath: pkgDir.replace(frameworkPath + '/', '') });
        }
      }
    }
  }

  if (tasks.length === 0) return;

  console.log(`Installing dependencies in ${tasks.length} ${label}(s) (parallelized)...`);

  await Promise.all(tasks.map(async task => {
    try {
      execSync('bun install', { cwd: task.pkgDir, stdio: 'pipe' });
      installed.push(task.relPath);
    } catch {
      failed.push(task.name);
    }
  }));
}

/**
 * Install dependencies using bun (root, skills/, and tools/ — parallelized)
 */
async function installDependencies(frameworkPath: string): Promise<{ success: boolean; message: string }> {
  const installed: string[] = [];
  const failed: string[] = [];

  // Install at framework root if package.json exists
  const rootPackageJson = join(frameworkPath, 'package.json');
  if (existsSync(rootPackageJson)) {
    const nodeModulesPath = join(frameworkPath, 'node_modules');
    if (!existsSync(nodeModulesPath)) {
      try {
        console.log('Installing root dependencies...');
        execSync('bun install', { cwd: frameworkPath, stdio: 'inherit' });
        installed.push('root');
      } catch {
        failed.push('root');
      }
    } else {
      installed.push('root (cached)');
    }
  }

  // Install dependencies in skills/ and tools/ subdirectories
  await installDepsInSubdirs(join(frameworkPath, 'skills'), frameworkPath, 'skill', installed, failed);
  await installDepsInSubdirs(join(frameworkPath, 'tools'), frameworkPath, 'tool', installed, failed);

  if (failed.length > 0) {
    return {
      success: false,
      message: `Installed: ${installed.join(', ')}. Failed: ${failed.join(', ')}`
    };
  }

  if (installed.length === 0) {
    return {
      success: true,
      message: 'No dependencies to install'
    };
  }

  return {
    success: true,
    message: `Dependencies installed: ${installed.join(', ')}`
  };
}

/**
 * Run framework health check
 */
async function runHealthCheck(frameworkPath: string): Promise<{ passed: boolean; issues: string[] }> {
  const healthCheckPath = join(frameworkPath, 'tools', 'validation', 'full-framework-audit.ts');

  if (!existsSync(healthCheckPath)) {
    return {
      passed: false,
      issues: ['Health check script not found']
    };
  }

  try {
    console.log('Running framework health check...');
    execFileSync('bun', ['run', healthCheckPath], {
      cwd: frameworkPath,
      stdio: 'inherit'
    });

    return {
      passed: true,
      issues: []
    };
  } catch (error) {
    return {
      passed: false,
      issues: [`Health check failed: ${error instanceof Error ? error.message : String(error)}`]
    };
  }
}

/**
 * Mark installation as complete
 */
async function markComplete(frameworkPath: string): Promise<void> {
  const markerPath = join(frameworkPath, '.setup-complete');
  const timestamp = new Date().toISOString();

  writeFileSync(
    markerPath,
    `Framework setup completed at: ${timestamp}\n`,
    'utf-8'
  );
}

/**
 * Main installation orchestrator with parallelized non-blocking steps
 */
export async function installFramework(mode: InstallMode = 'fresh'): Promise<InstallResult> {
  const steps: InstallResult['steps'] = [];
  const issues: string[] = [];
  const warnings: string[] = [];

  console.log('=== IA Framework Installer ===');
  console.log('');

  // ============================================================================
  // CRITICAL PATH: Step 1 (Platform Detection)
  // ============================================================================
  console.log('Step 1: Detecting platform...');
  const platform = await detectPlatform();
  console.log(formatPlatformInfo(platform));
  console.log('');

  steps.push({
    name: 'Platform Detection',
    success: true,
    message: `Detected: ${platform.os}${platform.inWSL ? ` (WSL${platform.wslVersion})` : ''}`
  });

  // ============================================================================
  // CRITICAL PATH: Steps 3-4 (Git and Bun installation)
  // These must complete before npm install can start
  // ============================================================================

  // Step 3: Check/Install Git
  console.log('Step 3: Checking Git installation...');
  const gitStatus = await checkGit();

  if (!gitStatus.installed) {
    console.log('Git not found - installing...');
    const gitInstallResult = await installGit(platform.packageManager);

    steps.push({
      name: 'Git Installation',
      success: gitInstallResult.success,
      message: gitInstallResult.message
    });

    if (!gitInstallResult.success) {
      issues.push('Git installation failed - required for framework');
      return { success: false, platform, steps, issues, warnings };
    }
  } else {
    console.log(`✓ Git ${gitStatus.version} already installed`);
    steps.push({
      name: 'Git Installation',
      success: true,
      message: `Already installed: ${gitStatus.version}`
    });
  }

  // Configure Git
  const gitConfigResult = await configureGit(platform.inWSL);
  steps.push({
    name: 'Git Configuration',
    success: gitConfigResult.success,
    message: gitConfigResult.message
  });

  console.log('');

  // Step 4: Check/Install Bun
  console.log('Step 4: Checking Bun installation...');
  const bunStatus = await checkBun();

  if (!bunStatus.installed) {
    console.log('Bun not found - installing...');
    const bunInstallResult = await installBun();

    steps.push({
      name: 'Bun Installation',
      success: bunInstallResult.success,
      message: bunInstallResult.message
    });

    if (!bunInstallResult.success) {
      issues.push('Bun installation failed - required for framework');
      return { success: false, platform, steps, issues, warnings };
    }
  } else {
    console.log(`✓ Bun ${bunStatus.version} already installed`);
    steps.push({
      name: 'Bun Installation',
      success: true,
      message: `Already installed: ${bunStatus.version}`
    });
  }

  console.log('');

  // ============================================================================
  // START LONG-RUNNING TASK: npm install (runs while other steps execute)
  // This is the key optimization - npm install starts immediately after Bun is ready
  // ============================================================================
  console.log('Starting dependency installation (running in background)...');
  const npmInstallPromise = installDependencies(platform.frameworkPath);

  // ============================================================================
  // PARALLEL EXECUTION: Steps 2, 4.5, 5, 6, 7 (non-blocking, independent)
  // These execute while npm install runs
  // ============================================================================
  const parallelTasks: Promise<{ stepName: string; result: any }>[] = [];

  // Step 2: WSL Configuration (Windows only)
  if (platform.inWSL) {
    parallelTasks.push(
      (async () => {
        console.log('Step 2: Optimizing WSL2 configuration...');
        try {
          const wslResult = await configureWSL();
          const wslSuccess = wslResult.fixes.every(f => f.success);

          return {
            stepName: 'WSL Configuration',
            result: {
              success: wslSuccess,
              message: `Applied ${wslResult.fixes.filter(f => f.success).length}/${wslResult.fixes.length} optimizations`,
              warning: !wslSuccess ? 'Some WSL optimizations failed - framework may still work' : null
            }
          };
        } catch (error) {
          return {
            stepName: 'WSL Configuration',
            result: {
              success: false,
              message: `Failed: ${error instanceof Error ? error.message : String(error)}`,
              warning: 'WSL configuration failed - framework may still work'
            }
          };
        }
      })()
    );
  } else {
    steps.push({
      name: 'WSL Configuration',
      success: true,
      skipped: true,
      message: 'Not in WSL - skipped'
    });
  }

  // Step 4.5: Check System Dependencies (Linux/WSL only)
  if (platform.os === 'linux' || platform.inWSL) {
    parallelTasks.push(
      (async () => {
        console.log('Step 4.5: Checking system dependencies (Chrome/Puppeteer)...');
        const depsCheck = await checkSystemDependencies();

        if (!depsCheck.allPresent) {
          console.log(`⚠ Missing ${depsCheck.missing.length} system dependencies for PDF export`);
          console.log(`Attempting to install missing dependencies...`);
          const installResult = await installSystemDependencies(depsCheck.missing);

          if (!installResult.success) {
            console.log(`⚠ Could not install system dependencies automatically.`);
            console.log(`To install manually, run:`);
            console.log(`  sudo apt-get update && sudo apt-get install -y ${depsCheck.missing.join(' ')}`);
          }

          return {
            stepName: 'System Dependencies',
            result: {
              success: installResult.success,
              message: installResult.message,
              warning: !installResult.success
                ? 'System dependencies missing - PDF export may not work. Run the apt-get command above to fix.'
                : null
            }
          };
        } else {
          console.log('✓ All system dependencies present');
          return {
            stepName: 'System Dependencies',
            result: {
              success: true,
              message: 'All Chrome/Puppeteer dependencies present',
              warning: null
            }
          };
        }
      })()
    );
  } else {
    steps.push({
      name: 'System Dependencies',
      success: true,
      skipped: true,
      message: 'Not on Linux - skipped'
    });
  }

  // Step 5: Validate Framework Structure
  parallelTasks.push(
    (async () => {
      console.log('Step 5: Validating framework structure...');
      const structureValidation = await validateStructure(platform.frameworkPath);

      if (!structureValidation.valid) {
        console.log('✗ Framework structure validation failed');
        structureValidation.issues.forEach(issue => console.log(`  • ${issue}`));
      } else {
        console.log('✓ Framework structure is valid');
      }

      return {
        stepName: 'Framework Structure',
        result: {
          success: structureValidation.valid,
          message: structureValidation.valid
            ? 'All required files and directories present'
            : `${structureValidation.issues.length} issues found`,
          issues: structureValidation.issues,
          validation: structureValidation
        }
      };
    })()
  );

  // Step 6: Setup .env
  parallelTasks.push(
    (async () => {
      console.log('Step 6: Setting up environment configuration...');
      const envResult = await setupEnv(platform.frameworkPath);
      console.log(`✓ ${envResult.message}`);

      return {
        stepName: 'Environment Setup',
        result: {
          success: envResult.success,
          message: envResult.message
        }
      };
    })()
  );

  // Step 7: Privacy Configuration
  parallelTasks.push(
    (async () => {
      console.log('Step 7: Configuring privacy settings...');
      const privacyResult = await setupPrivacy(platform.frameworkPath);

      if (privacyResult.success) {
        console.log('✓ Privacy environment variables configured:');
        console.log('  - DISABLE_TELEMETRY=1');
        console.log('  - DISABLE_ERROR_REPORTING=1');
        console.log('  - DISABLE_BUG_COMMAND=1');
        console.log('  - CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC=1');
        console.log('');
        console.log('⚠️  ACTION REQUIRED: Complete privacy setup at https://claude.ai/settings');
      } else {
        console.log(`⚠️  ${privacyResult.message}`);
      }

      return {
        stepName: 'Privacy Configuration',
        result: {
          success: privacyResult.success,
          message: privacyResult.message,
          warning: privacyResult.success
            ? 'Complete privacy setup at claude.ai/settings'
            : 'Privacy configuration failed - configure manually in settings.json'
        }
      };
    })()
  );

  // Execute all parallel tasks and collect results
  console.log('');
  const parallelResults = await Promise.all(parallelTasks);

  // Extract structure validation for use in Steps 8/8.5
  let structureValid = true;
  for (const result of parallelResults) {
    steps.push({
      name: result.stepName,
      success: result.result.success,
      message: result.result.message,
      skipped: result.result.skipped
    });

    if (result.result.warning) {
      warnings.push(result.result.warning);
    }

    if (result.result.issues) {
      issues.push(...result.result.issues);
    }

    if (result.stepName === 'Framework Structure' && !result.result.success) {
      structureValid = false;
    }
  }

  // Check if structure validation failed - this blocks everything else
  if (!structureValid) {
    console.log('');
    console.log('✗ Framework structure validation failed - aborting installation');
    return { success: false, platform, steps, issues, warnings };
  }

  // ============================================================================
  // SEQUENTIAL STEPS: 8 and 8.5 (depend on structure validation)
  // Executed after structure is validated
  // ============================================================================

  // Step 8: Create Symlinks
  console.log('Step 8: Creating symlinks to ~/.claude...');
  const symlinksResult = await createSymlinks(platform.frameworkPath);

  steps.push({
    name: 'Symlink Creation',
    success: symlinksResult.success,
    message: symlinksResult.message
  });

  if (symlinksResult.success) {
    console.log('✓ Symlinks created:');
    console.log('  - ~/.claude/CLAUDE.md → framework/CLAUDE.md');
    console.log('  - ~/.claude/settings.json → framework/settings.json');
    console.log('  - ~/.claude/agents/ (directory with individual file symlinks)');
    console.log('  - ~/.claude/commands/ (directory with individual file symlinks)');
    console.log('  - ~/.claude/hooks/ (directory with individual file symlinks)');
  } else {
    console.log(`⚠️  ${symlinksResult.message}`);
  }

  if (symlinksResult.warnings.length > 0) {
    symlinksResult.warnings.forEach(warning => warnings.push(warning));
    symlinksResult.warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  }

  console.log('');

  // Step 8.5: Create Skill Command Symlinks
  console.log('Step 8.5: Creating skill command symlinks...');
  const skillCmdResult = await createSkillCommandSymlinks(platform.frameworkPath);

  steps.push({
    name: 'Skill Command Symlinks',
    success: skillCmdResult.success,
    message: skillCmdResult.message
  });

  if (skillCmdResult.success) {
    console.log(`✓ ${skillCmdResult.message}`);
  } else {
    console.log(`⚠️  ${skillCmdResult.message}`);
  }

  if (skillCmdResult.warnings.length > 0) {
    skillCmdResult.warnings.forEach(warning => warnings.push(warning));
    skillCmdResult.warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  }

  // Step 8.6: Create Tool Command Symlinks
  console.log('Step 8.6: Creating tool command symlinks...');
  const toolCmdResult = await createToolCommandSymlinks(platform.frameworkPath);

  steps.push({
    name: 'Tool Command Symlinks',
    success: toolCmdResult.success,
    message: toolCmdResult.message
  });

  if (toolCmdResult.success) {
    console.log(`✓ ${toolCmdResult.message}`);
  } else {
    console.log(`⚠️  ${toolCmdResult.message}`);
  }

  if (toolCmdResult.warnings.length > 0) {
    toolCmdResult.warnings.forEach(warning => warnings.push(warning));
    toolCmdResult.warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
  }

  console.log('');

  // Step 9: Sync hooks symlinks (must run after deps install starts, before health check)
  console.log('Step 9: Syncing hook symlinks...');
  try {
    execSync('bun run tools/git/scripts/push/sync-symlinks.ts', { cwd: platform.frameworkPath, stdio: 'inherit' });
    steps.push({ name: 'Hook Sync', success: true, message: 'Hook symlinks synced to ~/.claude/hooks/' });
  } catch (error) {
    const msg = `Hook sync failed: ${error instanceof Error ? error.message : String(error)}`;
    steps.push({ name: 'Hook Sync', success: false, message: msg });
    warnings.push(msg);
  }

  console.log('');

  // ============================================================================
  // WAIT FOR LONG-RUNNING TASK: npm install completion
  // ============================================================================
  console.log('Waiting for dependency installation to complete...');
  const depsResult = await npmInstallPromise;

  steps.push({
    name: 'Dependency Installation',
    success: depsResult.success,
    message: depsResult.message
  });

  if (!depsResult.success) {
    warnings.push('Dependency installation failed - some features may not work');
  }

  console.log(`✓ ${depsResult.message}`);
  console.log('');

  // ============================================================================
  // FINAL SEQUENTIAL STEPS: Health check and completion
  // ============================================================================

  // Step 10: Run Health Check
  console.log('Step 10: Running health check...');
  const healthResult = await runHealthCheck(platform.frameworkPath);

  steps.push({
    name: 'Health Check',
    success: healthResult.passed,
    message: healthResult.passed
      ? 'All checks passed'
      : `${healthResult.issues.length} issues found`
  });

  if (!healthResult.passed) {
    issues.push(...healthResult.issues);
    warnings.push('Health check failed - framework may not be fully operational');
  }

  console.log('');

  // Step 11: Mark Complete
  if (healthResult.passed) {
    console.log('Step 11: Marking installation complete...');
    await markComplete(platform.frameworkPath);
    console.log('✓ Installation marked as complete');
    console.log('');

    steps.push({
      name: 'Mark Complete',
      success: true,
      message: '.setup-complete marker created'
    });
  }

  // Summary
  console.log('=== Installation Summary ===');
  console.log('');

  const successSteps = steps.filter(s => s.success && !s.skipped).length;
  const totalSteps = steps.filter(s => !s.skipped).length;

  console.log(`Completed: ${successSteps}/${totalSteps} steps`);
  console.log('');

  if (warnings.length > 0) {
    console.log('Warnings:');
    warnings.forEach(warning => console.log(`  ⚠ ${warning}`));
    console.log('');
  }

  if (issues.length > 0) {
    console.log('Issues:');
    issues.forEach(issue => console.log(`  ✗ ${issue}`));
    console.log('');
  }

  const overallSuccess = healthResult.passed && issues.length === 0;

  if (overallSuccess) {
    console.log('✅ IA Framework installation complete!');
    console.log('');
    console.log('Next steps:');
    console.log('  1. Review .env and add any API keys you need');
    console.log('  2. Try a command: /help to see available commands');
    console.log('  3. Test a skill: "Help me analyze a job posting"');
    console.log('');
    console.log('Welcome to the IA Framework!');
  } else {
    console.log('⚠ Installation completed with issues');
    console.log('Please review the warnings and issues above.');
  }

  return {
    success: overallSuccess,
    platform,
    steps,
    issues,
    warnings
  };
}

/**
 * CLI entry point
 */
if (import.meta.main) {
  (async () => {
    try {
      const mode: InstallMode = (process.argv[2] as InstallMode) || 'fresh';
      const result = await installFramework(mode);

      process.exit(result.success ? 0 : 1);
    } catch (error) {
      console.error('Framework installation failed:', error);
      process.exit(1);
    }
  })();
}
