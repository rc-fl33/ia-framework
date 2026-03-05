#!/usr/bin/env bun
/**
 * Framework Validation Orchestrator
 *
 * Coordinates all framework validators and provides unified reporting:
 * - 01-validate-frontmatter.ts: YAML schema validation
 * - 03-validate-paths.ts: Path reference validation
 *
 * Usage:
 *   bun run hooks/pre-commit/00-validate-framework.ts
 *   Called from: .git/hooks/pre-commit
 *   Future: Week 3 orchestration engine
 *
 * Exit codes:
 *   - 0: All validators passed (allow commit)
 *   - 2: One or more validators failed (BLOCK commit)
 */

import { spawn } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

const FRAMEWORK_ROOT = join(import.meta.dir, '..', '..');
const VALIDATORS_DIR = join(FRAMEWORK_ROOT, 'hooks', 'pre-commit');

interface ValidatorConfig {
  name: string;
  script: string;
  description: string;
}

interface ValidatorResult {
  name: string;
  passed: boolean;
  exitCode: number;
  duration: number;
  stdout: string;
  stderr: string;
}

const VALIDATORS: ValidatorConfig[] = [
  {
    name: 'Frontmatter Schemas',
    script: '01-validate-frontmatter.ts',
    description: 'YAML frontmatter validation against JSON schemas',
  },
  {
    name: 'Path Validation',
    script: '03-validate-paths.ts',
    description: 'File references and symlink integrity',
  },
];

/**
 * Run a single validator and capture results
 */
async function runValidator(config: ValidatorConfig): Promise<ValidatorResult> {
  const scriptPath = join(VALIDATORS_DIR, config.script);

  if (!existsSync(scriptPath)) {
    return {
      name: config.name,
      passed: false,
      exitCode: 127,
      duration: 0,
      stdout: '',
      stderr: `Validator script not found: ${config.script}`,
    };
  }

  const startTime = Date.now();

  return new Promise((resolve) => {
    const child = spawn('bun', ['run', scriptPath], {
      cwd: FRAMEWORK_ROOT,
      env: process.env,
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      const duration = Date.now() - startTime;

      resolve({
        name: config.name,
        passed: code === 0,
        exitCode: code ?? 1,
        duration,
        stdout,
        stderr,
      });
    });

    child.on('error', (error) => {
      const duration = Date.now() - startTime;

      resolve({
        name: config.name,
        passed: false,
        exitCode: 1,
        duration,
        stdout,
        stderr: stderr + `\n${error.message}`,
      });
    });
  });
}

/**
 * Extract error/warning counts from validator stderr output
 */
function extractIssueCounts(stderr: string): { errors: number; warnings: number } {
  let errors = 0;
  let warnings = 0;

  // Match patterns like "22 errors, 17 warnings" or "5 warning(s)"
  const errorMatch = stderr.match(/(\d+)\s+error/i);
  const warningMatch = stderr.match(/(\d+)\s+warning/i);

  if (errorMatch) {
    errors = parseInt(errorMatch[1], 10);
  }

  if (warningMatch) {
    warnings = parseInt(warningMatch[1], 10);
  }

  // Count individual error/warning markers if counts not found
  if (errors === 0 && stderr.includes('❌')) {
    const matches = stderr.match(/❌/g);
    errors = matches ? matches.length : 0;
  }

  if (warnings === 0 && stderr.includes('⚠️')) {
    const matches = stderr.match(/⚠️/g);
    warnings = matches ? matches.length : 0;
  }

  return { errors, warnings };
}

/**
 * Extract log file path from validator output
 */
function extractLogPath(stderr: string): string | null {
  const logMatch = stderr.match(/(?:Detailed log|📝):\s*(.+\.log)/);
  return logMatch ? logMatch[1] : null;
}

/**
 * Format validation result for display
 */
function formatResult(result: ValidatorResult, index: number, total: number): string {
  const prefix = `[${index}/${total}]`;
  const name = result.name.padEnd(25, '.');
  const status = result.passed ? '✅ PASS' : '❌ FAIL';

  // Extract issue counts if failed
  if (!result.passed && result.exitCode === 2) {
    const { errors, warnings } = extractIssueCounts(result.stderr);
    if (errors > 0 || warnings > 0) {
      const details = `(${errors} errors, ${warnings} warnings)`;
      return `${prefix} ${name} ${status} ${details}`;
    }
  }

  return `${prefix} ${name} ${status}`;
}

/**
 * Main orchestration logic
 */
async function main() {
  console.error('🔍 Running Framework Validation Suite...\n');

  // Run all validators in sequence
  const results: ValidatorResult[] = [];

  for (const config of VALIDATORS) {
    const result = await runValidator(config);
    results.push(result);

    // Show progress
    console.error(formatResult(result, results.length, VALIDATORS.length));
  }

  console.error('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Aggregate results
  const passed = results.filter((r) => r.passed);
  const failed = results.filter((r) => !r.passed);
  const totalErrors = failed.reduce((sum, r) => {
    const { errors } = extractIssueCounts(r.stderr);
    return sum + errors;
  }, 0);
  const totalWarnings = results.reduce((sum, r) => {
    const { warnings } = extractIssueCounts(r.stderr);
    return sum + warnings;
  }, 0);

  // Summary
  console.error(`Summary: ${failed.length} failed, ${passed.length} passed`);

  if (totalErrors > 0 || totalWarnings > 0) {
    const parts: string[] = [];
    if (totalErrors > 0) parts.push(`${totalErrors} errors`);
    if (totalWarnings > 0) parts.push(`${totalWarnings} warnings`);
    console.error(`Total issues: ${parts.join(', ')}`);
  }

  console.error('');

  // If any validator failed, show details
  if (failed.length > 0) {
    console.error('❌ FRAMEWORK VALIDATION FAILED!\n');

    // Show which validators failed
    for (const result of failed) {
      const { errors, warnings } = extractIssueCounts(result.stderr);
      console.error(`   ${result.name}:`);

      if (errors > 0) {
        console.error(`      ${errors} error(s)`);
      }

      if (warnings > 0) {
        console.error(`      ${warnings} warning(s)`);
      }

      // Extract and show log path
      const logPath = extractLogPath(result.stderr);
      if (logPath) {
        console.error(`      Log: ${logPath}`);
      }
    }

    console.error('\nReview logs:');

    // Collect all unique log paths
    const logPaths = new Set<string>();
    for (const result of results) {
      const logPath = extractLogPath(result.stderr);
      if (logPath) {
        logPaths.add(logPath);
      }
    }

    for (const logPath of logPaths) {
      console.error(`   - ${logPath}`);
    }

    console.error('');

    process.exit(2); // Exit code 2 = BLOCK commit
  }

  // All validators passed
  console.error('✅ FRAMEWORK VALIDATION PASSED!\n');
  process.exit(0);
}

main();
