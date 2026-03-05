#!/usr/bin/env bun
/**
 * Pre-Commit Hook: Validate Manifest Sync
 *
 * Ensures .framework-manifest.yaml is in sync with actual skills before commit.
 * Auto-syncs if drift detected.
 */

import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';

function checkManifestSync(): { inSync: boolean; missing: string[] } {
  const frameworkPath = resolveFrameworkRoot();
  const skillsPath = join(frameworkPath, 'skills');
  const manifestPath = join(frameworkPath, '.framework-manifest.yaml');

  if (!existsSync(manifestPath)) {
    return { inSync: true, missing: [] };
  }

  // Get actual skills from filesystem
  const actualSkills = readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();

  // Read manifest to get listed skills
  const manifestContent = readFileSync(manifestPath, 'utf-8');
  const listedSkills = new Set<string>();

  // Parse public skills
  const publicMatch = manifestContent.match(/skills:\s*\n\s*include:\s*\n((?:\s*-\s*skills\/[^/]+\/\*\*[^\n]*\n)+)/);
  if (publicMatch) {
    const publicLines = publicMatch[1].match(/skills\/([^/]+)\/\*\*/g) || [];
    publicLines.forEach(line => {
      const skill = line.match(/skills\/([^/]+)\//)?.[1];
      if (skill) listedSkills.add(skill);
    });
  }

  // Parse private skills
  const privateMatch = manifestContent.match(/private_skills:\s*\n((?:\s*-\s*skills\/[^/]+\/\*\*[^\n]*\n)+)/);
  if (privateMatch) {
    const privateLines = privateMatch[1].match(/skills\/([^/]+)\/\*\*/g) || [];
    privateLines.forEach(line => {
      const skill = line.match(/skills\/([^/]+)\//)?.[1];
      if (skill) listedSkills.add(skill);
    });
  }

  // Check for drift
  const missingFromManifest = actualSkills.filter(s => !listedSkills.has(s));

  return {
    inSync: missingFromManifest.length === 0,
    missing: missingFromManifest
  };
}

async function main() {
  console.log('[7/14] Validating manifest sync...');

  const { inSync, missing } = checkManifestSync();

  if (!inSync) {
    console.log(`   ⚠️  Manifest drift detected: ${missing.join(', ')}`);
    console.log('   🔧 Auto-syncing manifest...');

    const frameworkPath = resolveFrameworkRoot();
    const result = Bun.spawnSync(['bun', 'tools/framework/manifest/sync-manifest.ts'], {
      cwd: frameworkPath,
      stdout: 'pipe',
      stderr: 'pipe'
    });

    if (result.exitCode === 0) {
      console.log('   ✅ Manifest synced automatically');
      process.exit(0);
    } else {
      console.error('   ❌ Manifest sync failed');
      console.error(result.stderr.toString());
      process.exit(1);
    }
  } else {
    console.log('   ✅ Manifest in sync');
    process.exit(0);
  }
}

main();
