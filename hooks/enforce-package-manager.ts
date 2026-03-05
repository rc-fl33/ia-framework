/**
 * Package Manager Enforcement Hook
 *
 * PreToolUse hook that blocks npm/yarn/pnpm commands when Bun is the
 * project's package manager (detected via bun.lock or bun.lockb).
 *
 * Trigger: PreToolUse on Bash tool
 * Action: Block non-Bun package manager commands, suggest Bun equivalents
 */

import { existsSync } from 'fs';
import { join } from 'path';

interface PreToolUseInput {
  tool_name: string;
  tool_input: {
    command?: string;
    [key: string]: unknown;
  };
}

const BLOCKED_PREFIXES = ['npm ', 'yarn ', 'pnpm '];

const EQUIVALENTS: Record<string, string> = {
  'npm install': 'bun install',
  'npm ci': 'bun install --frozen-lockfile',
  'npm run': 'bun run',
  'npm test': 'bun test',
  'npm init': 'bun init',
  'npm add': 'bun add',
  'npm uninstall': 'bun remove',
  'npm exec': 'bunx',
  'npx': 'bunx',
  'yarn install': 'bun install',
  'yarn add': 'bun add',
  'yarn remove': 'bun remove',
  'yarn run': 'bun run',
  'pnpm install': 'bun install',
  'pnpm add': 'bun add',
  'pnpm remove': 'bun remove',
  'pnpm run': 'bun run',
};

function getSuggestion(command: string): string {
  for (const [from, to] of Object.entries(EQUIVALENTS)) {
    if (command.startsWith(from)) {
      return command.replace(from, to);
    }
  }
  return command.replace(/^(npm|yarn|pnpm)\b/, 'bun');
}

async function main() {
  const input = await Bun.stdin.text();

  try {
    const data: PreToolUseInput = JSON.parse(input);

    if (data.tool_name !== 'Bash') {
      process.exit(0);
    }

    const command = data.tool_input?.command?.trim();
    if (!command) {
      process.exit(0);
    }

    // Allow npx — used for one-off tool execution where bunx may not work
    if (command.startsWith('npx ')) {
      process.exit(0);
    }

    const isBlocked = BLOCKED_PREFIXES.some(prefix => command.startsWith(prefix));
    if (!isBlocked) {
      process.exit(0);
    }

    // Only enforce when a Bun lock file exists in the project
    const projectDir = process.env.CLAUDE_PROJECT_DIR || process.cwd();
    const hasBunLock = existsSync(join(projectDir, 'bun.lockb'))
      || existsSync(join(projectDir, 'bun.lock'));
    if (!hasBunLock) {
      process.exit(0);
    }

    const suggestion = getSuggestion(command);

    console.log('<system-reminder>');
    console.log('PACKAGE MANAGER ENFORCEMENT: COMMAND BLOCKED');
    console.log('');
    console.log(`Blocked: ${command}`);
    console.log(`Suggested: ${suggestion}`);
    console.log('');
    console.log('This project uses Bun as its package manager (bun lock file detected).');
    console.log('Using npm/yarn/pnpm would create conflicting lock files and dependencies.');
    console.log('Please re-run using the Bun equivalent shown above.');
    console.log('</system-reminder>');

    process.exit(2);

  } catch (error) {
    // FAIL CLOSED: Log error and block operation with soft fail
    const err = error as Error;
    console.error('❌ HOOK ERROR - enforce-package-manager.ts');
    console.error(`Error: ${err.message}`);
    console.error(`Stack: ${err.stack}`);

    // Exit code 1 = soft block with warning (allows override)
    process.exit(1);
  }
}

main();
