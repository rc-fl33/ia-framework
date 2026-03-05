#!/usr/bin/env bun
// Pre-Commit Hook: Validate Catalog Sync
//
// Ensures docs/catalogs/ files are in sync with actual command/skill definitions.
// Auto-regenerates and stages if drift detected.
// Only runs when catalog-affecting files are staged.

import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';

function getStagedFiles(): string[] {
  const result = Bun.spawnSync(['git', 'diff', '--cached', '--name-only', '--diff-filter=ACM'], {
    cwd: resolveFrameworkRoot(),
    stdout: 'pipe',
    stderr: 'pipe'
  });

  if (result.exitCode !== 0) return [];
  return result.stdout.toString().trim().split('\n').filter(Boolean);
}

function affectsCatalogs(stagedFiles: string[]): boolean {
  return stagedFiles.some(f =>
    f.includes('/commands/') && f.endsWith('.md') ||
    f.endsWith('/SKILL.md') ||
    f === 'tools/docs/generate-catalogs.ts'
  );
}

async function main() {
  console.log('[14/14] Validating catalog sync...');

  const stagedFiles = getStagedFiles();

  if (!affectsCatalogs(stagedFiles)) {
    console.log('   No catalog-affecting files staged, skipping');
    process.exit(0);
  }

  const frameworkPath = resolveFrameworkRoot();

  // Run drift check
  const checkResult = Bun.spawnSync(
    ['bun', 'tools/docs/generate-catalogs.ts', '--check', '--no-cache'],
    {
      cwd: frameworkPath,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  );

  if (checkResult.exitCode === 0) {
    console.log('   Catalogs in sync');
    process.exit(0);
  }

  // Drift detected - auto-regenerate
  console.log('   Catalog drift detected, auto-regenerating...');

  const regenResult = Bun.spawnSync(
    ['bun', 'tools/docs/generate-catalogs.ts', '--no-cache'],
    {
      cwd: frameworkPath,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  );

  if (regenResult.exitCode !== 0) {
    console.error('   Failed to regenerate catalogs');
    console.error(regenResult.stderr.toString());
    process.exit(1);
  }

  // Stage updated catalog files
  const stageResult = Bun.spawnSync(
    ['git', 'add',
      'docs/catalogs/skills.md',
      'docs/catalogs/agents.md',
      'docs/catalogs/commands.md'
    ],
    {
      cwd: frameworkPath,
      stdout: 'pipe',
      stderr: 'pipe'
    }
  );

  if (stageResult.exitCode !== 0) {
    console.error('   Failed to stage updated catalogs');
    process.exit(1);
  }

  console.log('   Catalogs regenerated and staged');
  process.exit(0);
}

main();
