#!/usr/bin/env bun
/**
 * Manifest Auto-Sync Tool
 *
 * Automatically syncs .framework-manifest.yaml with actual skills on disk.
 * Uses skill's SKILL.md classification as source of truth.
 *
 * PHILOSOPHY: Skills declare their own classification. Manifest reflects reality.
 *
 * Usage:
 *   bun tools/framework/manifest/sync-manifest.ts
 *   bun tools/framework/manifest/sync-manifest.ts --check  (dry run)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';

interface SkillInfo {
  name: string;
  classification: 'public' | 'private';
  agent?: string;
  size?: string;
  reason?: string;
}

/**
 * Extract classification from SKILL.md frontmatter
 */
function getSkillClassification(skillPath: string): SkillInfo | null {
  const skillMdPath = join(skillPath, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    return null;
  }

  try {
    const content = readFileSync(skillMdPath, 'utf-8');

    // Extract frontmatter (YAML between --- markers)
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (!frontmatterMatch) {
      return null;
    }

    const frontmatter = parseYaml(frontmatterMatch[1]) as any;

    return {
      name: frontmatter.name || skillPath.split('/').pop() || 'unknown',
      classification: frontmatter.classification || 'private', // Default to private for safety
      agent: frontmatter.agent,
      size: frontmatter.size,
      reason: frontmatter.reason
    };
  } catch (err) {
    console.error(`Error reading ${skillPath}/SKILL.md:`, (err as Error).message);
    return null;
  }
}

/**
 * Scan skills/ directory and get all skill classifications
 */
function scanSkills(frameworkPath: string): SkillInfo[] {
  const skillsPath = join(frameworkPath, 'skills');

  if (!existsSync(skillsPath)) {
    console.error('skills/ directory not found');
    return [];
  }

  const skillDirs = readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const skills: SkillInfo[] = [];

  for (const skillName of skillDirs) {
    const skillPath = join(skillsPath, skillName);
    const info = getSkillClassification(skillPath);

    if (info) {
      skills.push(info);
    } else {
      console.warn(`⚠️  ${skillName}: No SKILL.md or missing frontmatter (defaulting to private)`);
      skills.push({
        name: skillName,
        classification: 'private',
        reason: 'Missing SKILL.md frontmatter'
      });
    }
  }

  return skills;
}

/**
 * Update manifest with current skills
 */
function updateManifest(manifestPath: string, skills: SkillInfo[], dryRun: boolean = false): void {
  const manifest = parseYaml(readFileSync(manifestPath, 'utf-8')) as any;

  const publicSkills = skills.filter(s => s.classification === 'public');
  const privateSkills = skills.filter(s => s.classification === 'private');

  // Update public skills in framework.skills.include
  const publicIncludes = publicSkills.map(s => `skills/${s.name}/**`);
  if (!manifest.framework) manifest.framework = {};
  if (!manifest.framework.skills) manifest.framework.skills = {};
  manifest.framework.skills.include = publicIncludes;

  // Update private skills in instance.private_skills
  const privateIncludes = privateSkills.map(s => `skills/${s.name}/**/*`);
  if (!manifest.instance) manifest.instance = {};
  manifest.instance.private_skills = privateIncludes;

  // Update metadata sections
  if (!manifest.metadata) manifest.metadata = {};

  // Update public_skills metadata
  manifest.metadata.public_skills = publicSkills.map(s => ({
    name: s.name,
    agent: s.agent || 'none',
    classification: 'public',
    size: s.size || 'standard'
  }));

  // Update private_skills metadata
  manifest.metadata.private_skills = privateSkills.map(s => ({
    name: s.name,
    reason: s.reason || 'Private skill - not for public distribution'
  }));

  // Update counts
  manifest.public_skills_count = publicSkills.length;
  manifest.private_skills_count = privateSkills.length;

  if (dryRun) {
    console.log('\n📋 DRY RUN - Would update manifest:');
    console.log(`\nPublic skills (${publicSkills.length}):`);
    publicSkills.forEach(s => console.log(`  ✓ ${s.name}`));
    console.log(`\nPrivate skills (${privateSkills.length}):`);
    privateSkills.forEach(s => console.log(`  ✓ ${s.name}`));
    console.log('\nNo changes written (dry run mode)');
  } else {
    // Write updated manifest
    const yamlContent = stringifyYaml(manifest, {
      lineWidth: 0, // Don't wrap lines
      indent: 2
    });

    writeFileSync(manifestPath, yamlContent, 'utf-8');

    console.log('✅ Manifest synced successfully!');
    console.log(`   Public skills: ${publicSkills.length}`);
    console.log(`   Private skills: ${privateSkills.length}`);
  }
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--check') || args.includes('--dry-run');

  const frameworkPath = resolveFrameworkRoot();
  const manifestPath = join(frameworkPath, '.framework-manifest.yaml');

  if (!existsSync(manifestPath)) {
    console.error('❌ .framework-manifest.yaml not found');
    process.exit(1);
  }

  console.log('🔍 Scanning skills directory...');
  const skills = scanSkills(frameworkPath);

  if (skills.length === 0) {
    console.error('❌ No skills found');
    process.exit(1);
  }

  console.log(`   Found ${skills.length} skills`);

  console.log('\n📝 Updating manifest...');
  updateManifest(manifestPath, skills, dryRun);
}

main();
