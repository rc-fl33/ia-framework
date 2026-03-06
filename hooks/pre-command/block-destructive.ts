#!/usr/bin/env bun
/**
 * Pre-Command Hook: Block Destructive Commands
 *
 * Triggered before Bash command execution via Claude Code's pre-tool-use hook.
 * Blocks dangerous commands when allowDestructive is false.
 *
 * Works alongside bash-command-validator.ts - provides configurable toggle
 * for commands that are blocked by default.
 *
 * Exit codes:
 *   0 = Allow command execution
 *   1 = Block command execution
 *   2 = Hard block (reserved for validator errors)
 */

import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
// import.meta.dir for hooks/pre-command/ is: /path/to/ia-framework/hooks/pre-command
// We need to go up 3 levels to get to framework root
const CLAUDE_DIR = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..', '..');
const SETTINGS_FILE = join(CLAUDE_DIR, '.claude', 'settings.json');

interface Settings {
  allowDestructive?: boolean;
  verboseMode?: boolean;
  plansDirectory?: string;
}

/**
 * Load settings from .claude/settings.json
 */
function loadSettings(): Settings {
  if (!existsSync(SETTINGS_FILE)) {
    return {};
  }
  try {
    const content = readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return {};
  }
}

// Commands to block when allowDestructive is false
// These are different from bash-command-validator.ts - this provides
// a configurable layer for commands that might be needed occasionally
const TOGGLE_BLOCKED_PATTERNS = [
  { pattern: /rm\s+-rf\s+/, reason: 'Recursive forced deletion (rm -rf)' },
  { pattern: /git\s+reset\s+--hard/, reason: 'Git hard reset - discards local changes' },
  { pattern: /git\s+clean\s+-[fd]+/, reason: 'Git clean - removes untracked files' },
  { pattern: /git\s+checkout\s+--\.\s*$/, reason: 'Git checkout to discard all changes' },
  { pattern: /git\s+stash\s+drop/, reason: 'Git stash drop - permanently deletes stashed changes' },
  { pattern: /docker\s+system\s+prune\s+-a/, reason: 'Docker prune all - removes all unused data' },
  { pattern: /docker\s+rm\s+-f/, reason: 'Docker force remove containers' },
  { pattern: /docker\s+rmi\s+-f/, reason: 'Docker force remove images' },
  { pattern: /docker\s+volume\s+rm/, reason: 'Docker remove volumes' },
  { pattern: /kubectl\s+delete\s+.*--all/, reason: 'Kubernetes delete all resources' },
  { pattern: /kill\s+-9\s+-1/, reason: 'Kill all processes' },
  { pattern: /pkill\s+-9/, reason: 'Force kill processes' },
];

/**
 * Check if command contains patterns that can be toggled
 */
function checkToggleBlockedCommand(command: string): { blocked: boolean; reason?: string } {
  for (const { pattern, reason } of TOGGLE_BLOCKED_PATTERNS) {
    if (pattern.test(command)) {
      return { blocked: true, reason };
    }
  }
  return { blocked: false };
}

/**
 * Format output similar to bash-command-validator
 */
function formatBlockMessage(reason: string, command: string): void {
  console.log('<system-reminder>');
  console.log('BLOCK DESTRUCTIVE: COMMAND BLOCKED');
  console.log('');
  console.log(`Reason: ${reason}`);
  console.log('');
  console.log(`Command: ${command}`);
  console.log('');
  console.log('To enable this command, run:');
  console.log('  bun tools/toggle/toggle.ts destructive on');
  console.log('');
  console.log('WARNING: Enabling destructive commands allows potentially irreversible operations.');
  console.log('Only enable when you understand the risks.');
  console.log('</system-reminder>');
}

/**
 * Main execution - reads JSON from stdin (Claude Code hook format)
 */
async function main(): Promise<void> {
  const input = await Bun.stdin.text();

  // If no input, allow execution
  if (!input.trim()) {
    process.exit(0);
  }

  // Parse JSON input
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(input);
  } catch {
    // Invalid JSON - let other validators handle it
    process.exit(0);
  }

  // Only process Bash tool calls
  const toolName = data.tool_name;
  if (toolName !== 'Bash') {
    process.exit(0);
  }

  // Get command from tool input
  const toolInput = data.tool_input as Record<string, unknown> | undefined;
  const command = (toolInput?.command as string) || '';

  if (!command) {
    process.exit(0);
  }

  // Load settings
  const settings = loadSettings();
  const allowDestructive = settings.allowDestructive ?? false;

  // If destructive commands are allowed, let it pass
  if (allowDestructive) {
    process.exit(0);
  }

  // Check for toggle-blocked patterns
  const result = checkToggleBlockedCommand(command);

  if (result.blocked) {
    formatBlockMessage(result.reason || 'Dangerous command', command);
    process.exit(1); // Block command execution
  }

  // No dangerous patterns found, allow execution
  process.exit(0);
}

main().catch(() => {
  // On error, allow execution (fail open for this hook)
  process.exit(0);
});
