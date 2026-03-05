#!/usr/bin/env bun

/**
 * Pre-Commit Hook Orchestrator
 *
 * Runs all validation scripts in sequence with consistent output formatting.
 * Can be called from git hooks or manually.
 *
 * Usage: bun tools/validation/pre-commit-orchestrator.ts [--strict]
 *
 * Exit codes:
 * - 0: All checks passed
 * - 1: Blocking errors found
 * - 2: Warnings only (non-blocking)
 */

import { execFileSync } from 'child_process';
import fs from 'fs';

interface ValidatorConfig {
  name: string;
  script: string;
  severity: 'error' | 'warning';
  description: string;
}

interface ValidatorResult {
  name: string;
  passed: boolean;
  severity: 'error' | 'warning';
  output: string;
}

const VALIDATORS: ValidatorConfig[] = [
  {
    name: 'Orphaned Files',
    script: 'tools/validation/orphaned-files-validator.ts',
    severity: 'error',
    description: 'Check for backup and temporary files',
  },
  {
    name: 'Skill Structure',
    script: 'tools/validation/skill-structure-validator.ts',
    severity: 'error',
    description: 'Verify skill directory structure',
  },
  {
    name: 'Document References',
    script: 'tools/validation/validate-doc-references.ts',
    severity: 'warning',
    description: 'Check for broken file/directory references in documentation',
  },
  {
    name: 'Hidden Directories',
    script: 'tools/validation/hidden-directory-validator.ts',
    severity: 'warning',
    description: 'Check for suspicious hidden directories',
  },
  {
    name: '.gitignore Patterns',
    script: 'tools/validation/gitignore-patterns-validator.ts',
    severity: 'warning',
    description: 'Verify .gitignore completeness',
  },
];

interface OrchestrationResult {
  totalRun: number;
  passed: number;
  failed: number;
  warnings: number;
  results: ValidatorResult[];
}

async function runValidator(config: ValidatorConfig): Promise<ValidatorResult> {
  try {
    const output = execFileSync('bun', [config.script], {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    return {
      name: config.name,
      passed: true,
      severity: config.severity,
      output,
    };
  } catch (error: any) {
    const output = error.stdout || error.stderr || error.message;
    return {
      name: config.name,
      passed: false,
      severity: config.severity,
      output,
    };
  }
}

async function orchestrate(): Promise<OrchestrationResult> {
  const result: OrchestrationResult = {
    totalRun: VALIDATORS.length,
    passed: 0,
    failed: 0,
    warnings: 0,
    results: [],
  };

  console.log('\n🔍 Running Extended Framework Validations\n');
  console.log(`   Running ${VALIDATORS.length} validators...\n`);

  for (const config of VALIDATORS) {
    process.stdout.write(`   ⧗ ${config.name}...`);

    const validatorResult = await runValidator(config);
    result.results.push(validatorResult);

    if (validatorResult.passed) {
      result.passed++;
      console.log(' ✅');
    } else {
      if (validatorResult.severity === 'error') {
        result.failed++;
        console.log(' ❌');
      } else {
        result.warnings++;
        console.log(' ⚠️ ');
      }
    }
  }

  return result;
}

function printResults(result: OrchestrationResult, strictMode: boolean): void {
  console.log('\n📊 Validation Summary\n');
  console.log(`   Total validators: ${result.totalRun}`);
  console.log(`   Passed: ${result.passed}`);
  console.log(`   Warnings: ${result.warnings}`);
  console.log(`   Failed: ${result.failed}\n`);

  // Print detailed results for failures and warnings
  const failedResults = result.results.filter(r => !r.passed);
  if (failedResults.length > 0) {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    for (const res of failedResults) {
      const icon = res.severity === 'error' ? '❌' : '⚠️ ';
      console.log(`${icon} ${res.name}\n`);

      // Print first few lines of output
      const lines = res.output.split('\n').slice(0, 10);
      lines.forEach(line => console.log(`   ${line}`));

      if (res.output.split('\n').length > 10) {
        console.log('   ...(output truncated)\n');
      } else {
        console.log('');
      }
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  }
}

async function main(): Promise<void> {
  const strictMode = process.argv.includes('--strict');
  const result = await orchestrate();

  printResults(result, strictMode);

  const hasErrors = result.failed > 0;
  const hasWarnings = result.warnings > 0;

  if (hasErrors) {
    console.log('❌ Validation failed - blocking errors detected\n');
    process.exit(1);
  }

  if (hasWarnings && strictMode) {
    console.log('❌ Validation failed in strict mode - warnings present\n');
    process.exit(1);
  }

  if (hasWarnings) {
    console.log('⚠️  Validation passed with warnings\n');
    process.exit(0);
  }

  console.log('✅ All validations passed\n');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
