#!/usr/bin/env bun

/**
 * Pre-push Hook: Bash Tool Full Audit
 *
 * Runs comprehensive audit on all TypeScript files before push.
 * Target: <30 seconds execution (with caching, typically 5-10s)
 *
 * Exit codes:
 * 0 = Clean - proceed with push
 * 1 = Warnings - user can override with --force-with-lease
 * 2 = Critical violations - blocks push
 */

import { execSync } from 'child_process';
import { join } from 'path';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const AUDITOR_SCRIPT = join(FRAMEWORK_ROOT, 'tools/validation/bash-tool-auditor.ts');

// Validate paths before using in shell (defense in depth)
if (!/^[a-zA-Z0-9_\-./]+$/.test(AUDITOR_SCRIPT)) {
  console.error('Invalid auditor script path');
  process.exit(2);
}

console.error('\n🔍 Running full bash tool audit before push...\n');

try {
  // Run full audit with caching
  execSync(`bun run ${AUDITOR_SCRIPT} --full`, {
    stdio: 'inherit',
    cwd: FRAMEWORK_ROOT,
    timeout: 30000
  });

  console.error('\n✅ Audit passed - safe to push\n');
  process.exit(0);
} catch (error: unknown) {
  const exitCode = (error && typeof error === 'object' && 'status' in error)
    ? (error as { status?: number }).status
    : undefined;
  const code = exitCode || 2;

  if (code === 1) {
    console.error(
      '\n⚠️  Warnings detected. Review above and push with --force-with-lease if intentional.\n'
    );
    process.exit(0);
  } else {
    console.error('\n❌ Push blocked - critical violations found in audit.\n');
    console.error('Review the violations above and fix before pushing.\n');
    process.exit(2);
  }
}
