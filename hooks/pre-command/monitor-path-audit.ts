#!/usr/bin/env bun
/**
 * Pre-Command Hook: Monitor Path Audit
 *
 * Triggered when /mon command is invoked.
 * Validates that monitor server configuration includes all active skill output directories.
 */

import { readdirSync, existsSync, statSync } from 'fs';
import { join } from 'path';

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const CLAUDE_DIR = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const SKILLS_DIR = join(CLAUDE_DIR, 'skills');

interface PathAuditResult {
  valid: boolean;
  missing_paths: string[];
  skill_outputs: string[];
  warnings: string[];
}

/**
 * Scan all skills for output directories
 */
function scanSkillOutputs(): string[] {
  const outputs: string[] = [];

  if (!existsSync(SKILLS_DIR)) {
    return outputs;
  }

  const skills = readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory() && !d.name.startsWith('.'));

  for (const skill of skills) {
    const outputDir = join(SKILLS_DIR, skill.name, 'output');
    if (existsSync(outputDir)) {
      const stat = statSync(outputDir);
      if (stat.isDirectory()) {
        const relativePath = `skills/${skill.name}/output`;
        outputs.push(relativePath);
      }
    }
  }

  return outputs;
}

/**
 * Audit monitor server paths
 */
async function auditMonitorPaths(): Promise<PathAuditResult> {
  const result: PathAuditResult = {
    valid: true,
    missing_paths: [],
    skill_outputs: [],
    warnings: []
  };

  // Scan for skill output directories
  result.skill_outputs = scanSkillOutputs();

  // Check if monitor server.ts excludes output directories
  const serverFile = join(CLAUDE_DIR, 'tools/monitor/scripts/server.ts');
  if (existsSync(serverFile)) {
    const text = await Bun.file(serverFile).text();

    // Check for the old exclusion pattern
    if (text.includes(`entry.name === 'output'`)) {
      result.valid = false;
      result.warnings.push('WARNING: Monitor server.ts still excludes "output" directories');
      result.warnings.push('Fix: Remove || entry.name === \'output\' from buildFileTree function');
    }
  }

  // Add info message about discovered paths
  if (result.skill_outputs.length > 0) {
    result.warnings.push(`✓ Found ${result.skill_outputs.length} skill output directories:`);
    result.skill_outputs.forEach(path => {
      result.warnings.push(`  - ${path}`);
    });
  } else {
    result.warnings.push('No skill output directories found (this is OK if no skills have generated outputs yet)');
  }

  return result;
}

/**
 * Main execution
 */
async function main() {
  const audit = await auditMonitorPaths();

  // Print audit results
  console.error('\n=== Monitor Path Audit ===');

  if (audit.warnings.length > 0) {
    audit.warnings.forEach(w => console.error(w));
  }

  if (!audit.valid) {
    console.error('\n❌ AUDIT FAILED: Monitor configuration needs updates');
    console.error('The monitor server will not display skill output directories correctly.\n');
    process.exit(1); // Block command execution
  } else {
    console.error('\n✅ AUDIT PASSED: Monitor configuration is current\n');
    process.exit(0); // Allow command execution
  }
}

main().catch(err => {
  console.error('Path audit failed:', err);
  process.exit(1);
});
