#!/usr/bin/env bun

/**
 * Pre-commit Hook: Bash Tool Quick Scan
 *
 * Runs quick audit on staged TypeScript files only.
 * Target: <2 seconds execution
 *
 * Exit codes:
 * 0 = Clean - proceed with commit
 * 1 = Warnings - user can override (non-blocking in pre-commit)
 * 2 = Critical violations - blocks commit
 */

import { execSync } from 'child_process';
import { join } from 'path';
import { existsSync } from 'fs';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const AUDITOR_SCRIPT = join(FRAMEWORK_ROOT, 'tools/validation/bash-tool-auditor.ts');

if (!existsSync(AUDITOR_SCRIPT)) {
  console.error(`⚠️  Auditor script not found: ${AUDITOR_SCRIPT} - skipping`);
  process.exit(0);
}

// Validate paths before using in shell (defense in depth)
if (!/^[a-zA-Z0-9_\-./]+$/.test(AUDITOR_SCRIPT)) {
  console.error('Invalid auditor script path');
  process.exit(2);
}

try {
  // Run quick scan on staged files
  execSync(`bun run ${AUDITOR_SCRIPT} --quick`, {
    stdio: 'inherit',
    cwd: FRAMEWORK_ROOT,
    timeout: 5000
  });

  process.exit(0);
} catch (error: unknown) {
  const exitCode = (error && typeof error === 'object' && 'status' in error)
    ? (error as { status?: number }).status
    : undefined;
  const code = exitCode || 2;

  if (code === 1) {
    // Warnings only - allow commit to proceed with message
    console.error('\n⚠️  Bash tool warnings detected. Review logs before pushing.\n');
    process.exit(0);
  } else {
    // Critical violations - block commit
    console.error('\n❌ Bash tool audit failed - critical violations detected.\n');
    process.exit(code);
  }
}
