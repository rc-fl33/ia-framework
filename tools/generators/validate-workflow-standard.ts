/**
 * Validate Workflow Standard Compliance
 *
 * Checks that MODULE.md and agent files follow the AI-WORKFLOW-STANDARD.
 *
 * Usage: bun run scripts/validate-workflow-standard.ts
 *
 * Exit codes:
 *   0 = All files compliant
 *   1 = Violations found
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'fs';
import { join, relative } from 'path';

interface ValidationResult {
  file: string;
  compliant: boolean;
  missing: string[];
  warnings: string[];
}

const FRAMEWORK_PATH = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..');

// Required sections for MODULE.md files
const MODULE_REQUIRED = [
  'Pre-flight Checklist',
  'USE WHEN',
  'INVOCATION',
  'ERROR RECOVERY',
  'Verification Checklist'
];

// Required sections for agent files
const AGENT_REQUIRED = [
  'Pre-flight Checklist',
  'Quick Start',
  'Core Identity',
  'Mandatory Startup Sequence',
  'Verification Checklist',
  'Common Mistakes',
  'Completion Tag'
];

// Required patterns in pre-flight checklists
const PREFLIGHT_PATTERNS = [
  'STOP!',
  '- [ ]',
  'VIOLATION'
];

// Required patterns in verification checklists
const VERIFICATION_PATTERNS = [
  '- [ ]',
  'If ANY checkbox fails'
];

function findFiles(dir: string, pattern: RegExp): string[] {
  const results: string[] = [];

  if (!existsSync(dir)) return results;

  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip node_modules, archive, output, sessions
      if (['node_modules', 'archive', 'output', 'sessions', '.git'].includes(item)) {
        continue;
      }
      results.push(...findFiles(fullPath, pattern));
    } else if (pattern.test(item)) {
      results.push(fullPath);
    }
  }

  return results;
}

function validateModule(filePath: string): ValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(FRAMEWORK_PATH, filePath);
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required sections
  for (const section of MODULE_REQUIRED) {
    if (!content.includes(`## ${section}`)) {
      missing.push(section);
    }
  }

  // Check pre-flight patterns
  if (content.includes('Pre-flight Checklist')) {
    for (const pattern of PREFLIGHT_PATTERNS) {
      if (!content.includes(pattern)) {
        warnings.push(`Pre-flight missing pattern: "${pattern}"`);
      }
    }
  }

  // Check verification patterns
  if (content.includes('Verification Checklist')) {
    for (const pattern of VERIFICATION_PATTERNS) {
      if (!content.includes(pattern)) {
        warnings.push(`Verification missing pattern: "${pattern}"`);
      }
    }
  }

  return {
    file: relativePath,
    compliant: missing.length === 0 && warnings.length === 0,
    missing,
    warnings
  };
}

function validateAgent(filePath: string): ValidationResult {
  const content = readFileSync(filePath, 'utf-8');
  const relativePath = relative(FRAMEWORK_PATH, filePath);
  const missing: string[] = [];
  const warnings: string[] = [];

  // Check required sections
  for (const section of AGENT_REQUIRED) {
    // Agents may use "##" or have inline mentions
    if (!content.includes(section)) {
      missing.push(section);
    }
  }

  // Check pre-flight patterns
  if (content.includes('Pre-flight Checklist')) {
    for (const pattern of PREFLIGHT_PATTERNS) {
      if (!content.includes(pattern)) {
        warnings.push(`Pre-flight missing pattern: "${pattern}"`);
      }
    }
  }

  // Check verification patterns
  if (content.includes('Verification Checklist')) {
    for (const pattern of VERIFICATION_PATTERNS) {
      if (!content.includes(pattern)) {
        warnings.push(`Verification missing pattern: "${pattern}"`);
      }
    }
  }

  return {
    file: relativePath,
    compliant: missing.length === 0 && warnings.length === 0,
    missing,
    warnings
  };
}

function main() {
  console.log('='.repeat(60));
  console.log('AI Workflow Standard Validation');
  console.log('='.repeat(60));
  console.log('');

  let hasErrors = false;

  // Validate MODULE.md files
  console.log('Checking MODULE.md files...');
  console.log('-'.repeat(40));

  const modulePaths = [
    join(FRAMEWORK_PATH, 'foundation'),
    join(FRAMEWORK_PATH, 'modules')
  ];

  for (const basePath of modulePaths) {
    const moduleFiles = findFiles(basePath, /^MODULE\.md$/);

    for (const file of moduleFiles) {
      const result = validateModule(file);

      if (result.compliant) {
        console.log(`✅ ${result.file}`);
      } else {
        hasErrors = true;
        console.log(`❌ ${result.file}`);
        if (result.missing.length > 0) {
          console.log(`   Missing sections: ${result.missing.join(', ')}`);
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
        }
      }
    }
  }

  console.log('');

  // Validate agent files
  console.log('Checking agent files...');
  console.log('-'.repeat(40));

  const agentsPath = join(FRAMEWORK_PATH, 'agents');
  if (existsSync(agentsPath)) {
    const agentFiles = findFiles(agentsPath, /\.md$/);

    for (const file of agentFiles) {
      const result = validateAgent(file);

      if (result.compliant) {
        console.log(`✅ ${result.file}`);
      } else {
        hasErrors = true;
        console.log(`❌ ${result.file}`);
        if (result.missing.length > 0) {
          console.log(`   Missing sections: ${result.missing.join(', ')}`);
        }
        if (result.warnings.length > 0) {
          result.warnings.forEach(w => console.log(`   ⚠️  ${w}`));
        }
      }
    }
  } else {
    console.log('No agents directory found.');
  }

  console.log('');
  console.log('='.repeat(60));

  if (hasErrors) {
    console.log('❌ VALIDATION FAILED - See issues above');
    console.log('');
    console.log('Reference: docs/STANDARDS.md');
    process.exit(1);
  } else {
    console.log('✅ ALL FILES COMPLIANT');
    process.exit(0);
  }
}

main();
