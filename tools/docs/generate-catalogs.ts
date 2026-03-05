#!/usr/bin/env bun
/**
 * Auto-Generate Catalogs from Source Files (Parallelized)
 *
 * Automatically syncs skills.md, agents.md, and commands.md catalogs from
 * actual skill/tool definitions. Parses SKILL.md and command file frontmatter
 * as source of truth.
 *
 * PHILOSOPHY: Skills declare their own metadata. Catalogs reflect reality.
 *
 * Usage:
 *   bun tools/docs/generate-catalogs.ts
 *   bun tools/docs/generate-catalogs.ts --check  (drift detection, exit 1 if stale)
 *   bun tools/docs/generate-catalogs.ts --no-cache  (skip cache optimization)
 */

import { readdirSync, readFileSync, writeFileSync, existsSync, statSync } from 'fs';
import { join, basename, dirname } from 'path';
import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import matter from 'gray-matter';
import { createHash } from 'crypto';

interface SkillMetadata {
  name: string;
  description: string;
  agent: string;
  version: string;
  classification: 'public' | 'private';
  effort_default: string;
  last_updated?: string;
  env_required?: boolean;
  env_keys?: string[];
}

interface AgentMetadata {
  name: string;
  description: string;
  skills: string[];
}

interface CommandMetadata {
  name: string;
  description: string;
  agent: string;
  skill: string;
  classification: 'public' | 'private';
  source: string; // file path relative to framework root
}

const isDryRun = process.argv.includes('--check');
const useCache = !process.argv.includes('--no-cache');
const frameworkPath = process.cwd();
const skillsPath = join(frameworkPath, 'skills');
const toolsPath = join(frameworkPath, 'tools');
const agentsPath = join(frameworkPath, 'agents');
const catalogsPath = join(frameworkPath, 'docs', 'catalogs');
const cacheFile = join(catalogsPath, '.catalog-cache.json');

interface CacheData {
  timestamp: number;
  skillsHash: string;
  agentsHash: string;
  skillCount: number;
  agentCount: number;
  commandCount: number;
}

/**
 * Extract frontmatter from SKILL.md files
 */
function parseSkillFrontmatter(skillPath: string): SkillMetadata | null {
  const skillMdPath = join(skillPath, 'SKILL.md');

  if (!existsSync(skillMdPath)) {
    return null;
  }

  try {
    const content = readFileSync(skillMdPath, 'utf-8');
    const { data } = matter(content);

    return {
      name: data.name || skillPath.split('/').pop() || 'unknown',
      description: data.description || '',
      agent: data.agent || 'unknown',
      version: data.version || '1.0',
      classification: data.classification || 'private',
      effort_default: data.effort_default || 'STANDARD',
      last_updated: data.last_updated,
      env_required: data.env_required || false,
      env_keys: data.env_keys || []
    };
  } catch (err) {
    console.error(`Error parsing ${skillPath}/SKILL.md:`, (err as Error).message);
    return null;
  }
}

/**
 * Extract agent metadata from agent files
 */
function parseAgentFrontmatter(agentPath: string): AgentMetadata | null {
  if (!existsSync(agentPath)) {
    return null;
  }

  try {
    const content = readFileSync(agentPath, 'utf-8');
    const { data } = matter(content);

    return {
      name: data.name || agentPath.split('/').pop()?.replace('.md', '') || 'unknown',
      description: data.description || '',
      skills: [] // Will be populated by linking to skills
    };
  } catch (err) {
    console.error(`Error parsing ${agentPath}:`, (err as Error).message);
    return null;
  }
}

/**
 * Parse command file frontmatter with fallback patterns
 *
 * Handles 4 patterns:
 *   A: Full frontmatter (name, description, skill, agent) - most skills commands
 *   B: Minimal frontmatter (domain/skill/agent but no name/description) - ghost commands
 *   C: Tool-style frontmatter (tool: instead of skill:) - framework-update, monitor, etc.
 *   D: No frontmatter - derive from filename and first heading
 */
function parseCommandFrontmatter(
  filePath: string,
  skillClassifications: Map<string, 'public' | 'private'>,
  manifestPrivateSkills: Set<string>
): CommandMetadata | null {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const { data, content: body } = matter(content);
    const fileName = basename(filePath, '.md');
    const relativePath = filePath.replace(frameworkPath + '/', '');

    // Derive name: frontmatter > filename
    const name = data.name || fileName;

    // Derive description from frontmatter or first meaningful line after heading
    let description = data.description || '';
    if (!description) {
      // Try first heading text
      const headingMatch = body.match(/^#\s+(.+)/m);
      if (headingMatch) {
        // Use heading but strip leading /name prefix patterns
        let heading = headingMatch[1].trim();
        // Remove patterns like "/name --" or "/name -" prefixes
        heading = heading.replace(/^\/[\w-]+\s*[-—]+\s*/, '');
        description = heading;
      }
    }

    // Determine agent (normalize base-claude -> base)
    let agent = data.agent || 'base';
    if (agent === 'base-claude') agent = 'base';

    // Determine skill/tool (the parent capability)
    const skill = data.skill || data.tool || data.domain || '';

    // Determine classification:
    // 1. Explicit in command frontmatter
    // 2. From parent SKILL.md classification
    // 3. From manifest private_skills list
    // 4. Default to private
    let classification: 'public' | 'private' = 'private';
    if (data.classification) {
      classification = data.classification;
    } else if (skill && skillClassifications.has(skill)) {
      classification = skillClassifications.get(skill)!;
    } else {
      // Check if parent directory name matches a known skill
      const parentDir = getParentSkillName(filePath);
      if (parentDir && skillClassifications.has(parentDir)) {
        classification = skillClassifications.get(parentDir)!;
      } else if (parentDir && manifestPrivateSkills.has(parentDir)) {
        classification = 'private';
      }
    }

    return {
      name,
      description,
      agent,
      skill: skill || getParentSkillName(filePath) || 'unknown',
      classification,
      source: relativePath
    };
  } catch (err) {
    console.error(`Error parsing command ${filePath}:`, (err as Error).message);
    return null;
  }
}

/**
 * Get the parent skill/tool name from a command file path
 * e.g., skills/pentest/commands/pentest.md -> security
 *       tools/notmint/commands/notmint-start.md -> notmint
 */
function getParentSkillName(filePath: string): string | null {
  const parts = filePath.split('/');
  const commandsIdx = parts.indexOf('commands');
  if (commandsIdx > 0) {
    return parts[commandsIdx - 1];
  }
  return null;
}

/**
 * Scan skills/ directory and extract all metadata (async)
 */
async function scanSkills(): Promise<SkillMetadata[]> {
  if (!existsSync(skillsPath)) {
    console.error('skills/ directory not found');
    return [];
  }

  const skillDirs = readdirSync(skillsPath, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  const skillPromises = skillDirs.map(skillName => {
    const skillPath = join(skillsPath, skillName);
    return Promise.resolve(parseSkillFrontmatter(skillPath)).then(info => {
      if (!info) {
        console.warn(`\u26a0\ufe0f  ${skillName}: No SKILL.md or missing frontmatter`);
      }
      return info;
    });
  });

  const results = await Promise.all(skillPromises);
  const skills = results.filter((s): s is SkillMetadata => s !== null);

  return skills.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Scan agents/ directory and extract metadata (async)
 */
async function scanAgents(): Promise<AgentMetadata[]> {
  if (!existsSync(agentsPath)) {
    console.error('agents/ directory not found');
    return [];
  }

  const agentFiles = readdirSync(agentsPath)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));

  const agentPromises = agentFiles.map(agentName => {
    const agentPath = join(agentsPath, `${agentName}.md`);
    return Promise.resolve(parseAgentFrontmatter(agentPath));
  });

  const results = await Promise.all(agentPromises);
  const agents = results.filter((a): a is AgentMetadata => a !== null);

  return agents.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Scan both skills/ and tools/ for command files
 */
async function scanCommands(skills: SkillMetadata[]): Promise<CommandMetadata[]> {
  // Build classification lookup from skills
  const skillClassifications = new Map<string, 'public' | 'private'>();
  for (const skill of skills) {
    skillClassifications.set(skill.name, skill.classification);
  }

  // Also load SKILL.md from tools/ directories for classification
  if (existsSync(toolsPath)) {
    const toolDirs = readdirSync(toolsPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const toolName of toolDirs) {
      const toolSkillMd = join(toolsPath, toolName, 'SKILL.md');
      if (existsSync(toolSkillMd)) {
        try {
          const content = readFileSync(toolSkillMd, 'utf-8');
          const { data } = matter(content);
          if (data.classification) {
            skillClassifications.set(toolName, data.classification);
          }
        } catch { /* skip */ }
      }
    }
  }

  // Build manifest private skills set
  const manifestPrivateSkills = new Set<string>();
  const manifestPath = join(frameworkPath, '.framework-manifest.yaml');
  if (existsSync(manifestPath)) {
    try {
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      const manifest = parseYaml(manifestContent);
      if (manifest?.instance?.private_skills) {
        for (const pattern of manifest.instance.private_skills) {
          // Extract skill name from patterns like "skills/pentest/**/*"
          const match = pattern.match(/skills\/([^/]+)\//);
          if (match) manifestPrivateSkills.add(match[1]);
        }
      }
    } catch { /* skip */ }
  }

  const commands: CommandMetadata[] = [];

  // Scan skills/*/commands/*.md
  if (existsSync(skillsPath)) {
    const skillDirs = readdirSync(skillsPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const skillName of skillDirs) {
      const commandsDir = join(skillsPath, skillName, 'commands');
      if (!existsSync(commandsDir)) continue;

      const cmdFiles = readdirSync(commandsDir)
        .filter(f => f.endsWith('.md'));

      for (const cmdFile of cmdFiles) {
        const cmdPath = join(commandsDir, cmdFile);
        const cmd = parseCommandFrontmatter(cmdPath, skillClassifications, manifestPrivateSkills);
        if (cmd) commands.push(cmd);
      }
    }
  }

  // Scan tools/*/commands/*.md
  if (existsSync(toolsPath)) {
    const toolDirs = readdirSync(toolsPath, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => d.name);

    for (const toolName of toolDirs) {
      const commandsDir = join(toolsPath, toolName, 'commands');
      if (!existsSync(commandsDir)) continue;

      const cmdFiles = readdirSync(commandsDir)
        .filter(f => f.endsWith('.md'));

      for (const cmdFile of cmdFiles) {
        const cmdPath = join(commandsDir, cmdFile);
        const cmd = parseCommandFrontmatter(cmdPath, skillClassifications, manifestPrivateSkills);
        if (cmd) commands.push(cmd);
      }
    }
  }

  // Exclude template files (e.g., skills/create/templates/commands/create.md)
  const filtered = commands.filter(c => !c.source.includes('/templates/'));

  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Generate skills.md content
 */
function generateSkillsCatalog(skills: SkillMetadata[]): string {
  const now = new Date().toISOString().split('T')[0];

  // Frontmatter
  let content = `---
type: reference
title: Skills Catalog
classification: public
version: 1.0
last_updated: ${now}
audience: all
category: reference
related_docs:
  - docs/catalogs/commands.md
  - docs/catalogs/agents.md
  - docs/catalogs/tool-catalog.md
---

# Skills Catalog

Comprehensive reference for all available skills in the Intelligence Adjacent Framework. Each skill is a modular capability self-contained in its own directory with documentation, scripts, and related resources.

**Last Updated:** ${now}
**Total Skills:** ${skills.length}
**Source of Truth:** \`skills/*/SKILL.md\` frontmatter

---

## Skills Reference Matrix

| Skill | Description | Agent | Classification | Effort | Version |
|-------|-------------|-------|-----------------|--------|---------|
`;

  // Skills matrix
  for (const skill of skills) {
    content += `| ${skill.name} | ${skill.description} | ${skill.agent} | ${skill.classification} | ${skill.effort_default} | ${skill.version} |
`;
  }

  // Classification summary
  const publicSkills = skills.filter(s => s.classification === 'public');
  const privateSkills = skills.filter(s => s.classification === 'private');

  content += `
---

## Classification Summary

**Public Skills (${publicSkills.length})** - Available in public ia-framework repository:
`;

  for (const skill of publicSkills) {
    content += `- \`${skill.name}\`
`;
  }

  content += `
**Private Skills (${privateSkills.length})** - Available only in private instances:
`;

  for (const skill of privateSkills) {
    content += `- \`${skill.name}\`
`;
  }

  // Group by agent
  content += `
---

## Skills by Agent

`;

  const agentGroups = new Map<string, SkillMetadata[]>();
  for (const skill of skills) {
    if (!agentGroups.has(skill.agent)) {
      agentGroups.set(skill.agent, []);
    }
    agentGroups.get(skill.agent)!.push(skill);
  }

  for (const [agent, agentSkills] of Array.from(agentGroups.entries()).sort()) {
    content += `### ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent (${agentSkills.length} skill${agentSkills.length !== 1 ? 's' : ''})
`;
    for (const skill of agentSkills) {
      content += `- **${skill.name}** - ${skill.description}
`;
    }
    content += `
`;
  }

  // Group by effort
  content += `---

## Skills by Effort Level

`;

  const effortGroups = new Map<string, SkillMetadata[]>();
  for (const skill of skills) {
    if (!effortGroups.has(skill.effort_default)) {
      effortGroups.set(skill.effort_default, []);
    }
    effortGroups.get(skill.effort_default)!.push(skill);
  }

  const effortOrder = ['QUICK', 'STANDARD', 'EXTENDED', 'LONG-TERM'];
  for (const effort of effortOrder) {
    const effortSkills = effortGroups.get(effort);
    if (!effortSkills || effortSkills.length === 0) continue;

    content += `### ${effort} Skills
- ${effortSkills.map(s => `\`${s.name}\``).join(', ')}

`;
  }

  // Skills with integrations
  const withIntegrations = skills.filter(s => s.env_required);
  if (withIntegrations.length > 0) {
    content += `---

## Skills by Integration Status

### Skills with External Integrations

| Skill | Env Required |
|-------|--------------|
`;
    for (const skill of withIntegrations) {
      content += `| ${skill.name} | Yes |
`;
    }

    content += `
### Skills with No External Dependencies
- ${skills
      .filter(s => !s.env_required)
      .map(s => `\`${s.name}\``)
      .join(', ')}
`;
  }

  return content;
}

/**
 * Generate agents.md content
 */
function generateAgentsCatalog(skills: SkillMetadata[]): string {
  const now = new Date().toISOString().split('T')[0];

  // Build agent groups
  const agentMap = new Map<string, SkillMetadata[]>();
  for (const skill of skills) {
    if (!agentMap.has(skill.agent)) {
      agentMap.set(skill.agent, []);
    }
    agentMap.get(skill.agent)!.push(skill);
  }

  const agentCount = agentMap.size;

  // Frontmatter
  let content = `---
type: reference
title: Agents Catalog
classification: public
version: 1.0
last_updated: ${now}
audience: all
category: reference
related_docs:
  - docs/catalogs/skills.md
  - docs/catalogs/commands.md
  - docs/architecture/agent-routing-architecture.md
---

# Agents Catalog

Comprehensive reference for all available agents in the Intelligence Adjacent Framework. Agents are specialized processors that handle complex, domain-specific tasks with appropriate models and workflows.

**Last Updated:** ${now}
**Total Agents:** ${agentCount}
**Source of Truth:** \`agents/*.md\` files

---

## Agent Reference Matrix

| Agent | Skills Count | Classification |
|-------|--------------|-----------------|
`;

  // Agent matrix
  for (const [agent, agentSkills] of Array.from(agentMap.entries()).sort()) {
    const publicCount = agentSkills.filter(s => s.classification === 'public').length;
    content += `| ${agent} | ${agentSkills.length} (${publicCount} public) | mixed |
`;
  }

  content += `
---

## Skills by Agent

`;

  // Detailed agent sections
  for (const [agent, agentSkills] of Array.from(agentMap.entries()).sort()) {
    content += `### ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent

**Skills This Agent Handles (${agentSkills.length}):**
`;
    for (let i = 0; i < agentSkills.length; i++) {
      const skill = agentSkills[i];
      content += `${i + 1}. \`${skill.name}\` - ${skill.description}
`;
    }
    content += `
`;
  }

  content += `---

## Classification Summary

`;

  // Classification by agent
  for (const [agent, agentSkills] of Array.from(agentMap.entries()).sort()) {
    const publicSkills = agentSkills.filter(s => s.classification === 'public');
    const privateSkills = agentSkills.filter(s => s.classification === 'private');

    const publicList = publicSkills.map(s => `\`${s.name}\``).join(', ') || 'none';
    const privateList = privateSkills.map(s => `\`${s.name}\``).join(', ') || 'none';

    content += `### ${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent

**Public:** ${publicSkills.length} skills - ${publicList}
**Private:** ${privateSkills.length} skills - ${privateList}

`;
  }

  return content;
}

/**
 * Generate commands.md content
 *
 * Produces the table format that filter-commands-catalog.ts expects:
 * | Command | Description | Agent | Skill | Classification | Structure | Output Location |
 */
function generateCommandsCatalog(commands: CommandMetadata[]): string {
  const now = new Date().toISOString().split('T')[0];
  const publicCommands = commands.filter(c => c.classification === 'public');
  const privateCommands = commands.filter(c => c.classification === 'private');

  let content = `# Command Catalog

Comprehensive reference mapping slash commands to agents, skills, classifications, and outputs.

**Last Updated:** ${now}
**Total Commands:** ${commands.length} (${publicCommands.length} public, ${privateCommands.length} private)
**Source of Truth:** \`skills/*/commands/*.md\` and \`tools/*/commands/*.md\` frontmatter

---

## Command Reference Matrix

| Command | Description | Agent | Skill | Classification | Structure | Output Location |
|---------|-------------|-------|-------|----------------|-----------|-----------------|
`;

  for (const cmd of commands) {
    content += `| \`/${cmd.name}\` | ${cmd.description} | ${cmd.agent} | ${cmd.skill} | ${cmd.classification} | - | - |
`;
  }

  // Classification Summary
  content += `
---

## Classification Summary

**Public Commands (${publicCommands.length})** - Available in public ia-framework repository:
`;

  for (const cmd of publicCommands) {
    content += `- \`/${cmd.name}\`
`;
  }

  content += `
**Private Commands (${privateCommands.length})** - Available only in private instances:
`;

  for (const cmd of privateCommands) {
    content += `- \`/${cmd.name}\`
`;
  }

  content += `
**Classification determines:**
- Which commands are synced to public repository via \`/git-public\`
- Which command symlinks are created in \`commands/\` directory
- Documentation filtering during public release

**Note:** Skill classification in \`SKILL.md\` frontmatter is the source of truth. This catalog reflects those classifications for easy reference.

---

## Commands by Agent

`;

  // Group by agent
  const agentGroups = new Map<string, CommandMetadata[]>();
  for (const cmd of commands) {
    const agentKey = cmd.agent;
    if (!agentGroups.has(agentKey)) {
      agentGroups.set(agentKey, []);
    }
    agentGroups.get(agentKey)!.push(cmd);
  }

  for (const [agent, agentCmds] of Array.from(agentGroups.entries()).sort()) {
    const label = agent === 'base' ? 'Base Claude' : `${agent.charAt(0).toUpperCase() + agent.slice(1)} Agent`;
    const publicInGroup = agentCmds.filter(c => c.classification === 'public');
    const privateInGroup = agentCmds.filter(c => c.classification === 'private');

    content += `### ${label}
`;

    if (publicInGroup.length > 0) {
      content += `- **Public:** ${publicInGroup.map(c => `\`/${c.name}\``).join(', ')}
`;
    }
    if (privateInGroup.length > 0) {
      content += `- **Private:** ${privateInGroup.map(c => `\`/${c.name}\``).join(', ')}
`;
    }
    content += `
`;
  }

  content += `---

**Framework:** Intelligence Adjacent (IA)
`;

  return content;
}

/**
 * Compute hash of metadata for cache validation
 */
function computeMetadataHash(skills: SkillMetadata[], agents: AgentMetadata[], commands: CommandMetadata[]): string {
  const metadata = {
    skillCount: skills.length,
    agentCount: agents.length,
    commandCount: commands.length,
    commandNames: commands.map(c => c.name).sort()
  };
  return createHash('md5').update(JSON.stringify(metadata)).digest('hex');
}

/**
 * Load cache if it exists and is valid
 */
function loadCache(): CacheData | null {
  if (!useCache || !existsSync(cacheFile)) {
    return null;
  }

  try {
    const data = readFileSync(cacheFile, 'utf-8');
    return JSON.parse(data) as CacheData;
  } catch {
    return null;
  }
}

/**
 * Save cache data
 */
function saveCache(data: CacheData): void {
  try {
    writeFileSync(cacheFile, JSON.stringify(data, null, 2));
  } catch (err) {
    console.warn('\u26a0\ufe0f  Could not save cache:', (err as Error).message);
  }
}

/**
 * Check if catalogs need regeneration
 */
function needsRegeneration(skills: SkillMetadata[], agents: AgentMetadata[], commands: CommandMetadata[]): boolean {
  const cache = loadCache();
  if (!cache) {
    return true;
  }

  const currentHash = computeMetadataHash(skills, agents, commands);
  return cache.skillsHash !== currentHash ||
    cache.skillCount !== skills.length ||
    cache.agentCount !== agents.length ||
    cache.commandCount !== commands.length;
}

/**
 * Normalize content for drift comparison (strip date strings that change daily)
 */
function normalizeForComparison(content: string): string {
  return content.replace(/\d{4}-\d{2}-\d{2}/g, 'DATE');
}

/**
 * Check for drift between generated and existing catalog files
 * Returns true if drift is detected (files are stale)
 */
function checkDrift(generated: string, existingPath: string): boolean {
  if (!existsSync(existingPath)) {
    return true; // File doesn't exist = drift
  }

  const existing = readFileSync(existingPath, 'utf-8');
  return normalizeForComparison(generated) !== normalizeForComparison(existing);
}

/**
 * Main execution
 */
async function main() {
  console.log('Scanning skills, agents, and commands in parallel...\n');

  const startTime = Date.now();

  // Parallel scanning (skills + agents first, then commands which needs skills data)
  const [skills, agents] = await Promise.all([scanSkills(), scanAgents()]);
  const commands = await scanCommands(skills);
  const scanTime = Date.now() - startTime;

  console.log(`Found ${skills.length} skills, ${agents.length} agents, ${commands.length} commands (${scanTime}ms)\n`);

  if (skills.length === 0) {
    console.error('No skills found. Aborting.');
    process.exit(1);
  }

  // Check if regeneration is needed (cache-based quick check)
  if (useCache && !isDryRun && !needsRegeneration(skills, agents, commands)) {
    console.log('Catalogs up-to-date (no changes detected, skipping regeneration)');
    process.exit(0);
  }

  // Generate catalogs in parallel
  const genStart = Date.now();
  const [skillsCatalog, agentsCatalog, commandsCatalog] = await Promise.all([
    Promise.resolve(generateSkillsCatalog(skills)),
    Promise.resolve(generateAgentsCatalog(skills)),
    Promise.resolve(generateCommandsCatalog(commands))
  ]);
  const genTime = Date.now() - genStart;

  console.log(`Generated catalogs (${genTime}ms)\n`);

  if (isDryRun) {
    // --check mode: detect drift and return appropriate exit code
    const skillsDrift = checkDrift(skillsCatalog, join(catalogsPath, 'skills.md'));
    const agentsDrift = checkDrift(agentsCatalog, join(catalogsPath, 'agents.md'));
    const commandsDrift = checkDrift(commandsCatalog, join(catalogsPath, 'commands.md'));

    const hasDrift = skillsDrift || agentsDrift || commandsDrift;

    if (hasDrift) {
      console.log('DRIFT DETECTED - catalogs are stale:');
      if (skillsDrift) console.log('  - skills.md needs regeneration');
      if (agentsDrift) console.log('  - agents.md needs regeneration');
      if (commandsDrift) console.log('  - commands.md needs regeneration');
      process.exit(1);
    } else {
      console.log('Catalogs in sync - no drift detected');
      process.exit(0);
    }
  } else {
    // Write catalogs
    const skillsCatalogPath = join(catalogsPath, 'skills.md');
    const agentsCatalogPath = join(catalogsPath, 'agents.md');
    const commandsCatalogPath = join(catalogsPath, 'commands.md');

    writeFileSync(skillsCatalogPath, skillsCatalog);
    writeFileSync(agentsCatalogPath, agentsCatalog);
    writeFileSync(commandsCatalogPath, commandsCatalog);

    // Update cache
    const cacheData: CacheData = {
      timestamp: Date.now(),
      skillsHash: computeMetadataHash(skills, agents, commands),
      agentsHash: computeMetadataHash(skills, agents, commands),
      skillCount: skills.length,
      agentCount: agents.length,
      commandCount: commands.length
    };
    saveCache(cacheData);

    const totalTime = Date.now() - startTime;
    console.log('Updated catalog files:');
    console.log(`  - ${skillsCatalogPath}`);
    console.log(`  - ${agentsCatalogPath}`);
    console.log(`  - ${commandsCatalogPath}`);
    console.log(`\nCatalogs regenerated successfully! (${totalTime}ms total)`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
