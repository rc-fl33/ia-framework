#!/usr/bin/env bun
/**
 * Toggle Tool - Enable/disable runtime settings for Claude Code sessions
 *
 * Usage:
 *   bun tools/toggle/toggle.ts              # Show status
 *   bun tools/toggle/toggle.ts destructive  # Toggle destructive
 *   bun tools/toggle/toggle.ts destructive on
 *   bun tools/toggle/toggle.ts destructive off
 *   bun tools/toggle/toggle.ts verbose on
 *   bun tools/toggle/toggle.ts verbose off
 */

import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface Settings {
  plansDirectory?: string;
  allowDestructive?: boolean;
  verboseMode?: boolean;
}

// Use IA_FRAMEWORK_ROOT env var if set, otherwise self-discover from script location
const CLAUDE_DIR = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');
const SETTINGS_FILE = join(CLAUDE_DIR, '.claude', 'settings.json');

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

/**
 * Save settings to .claude/settings.json
 */
function saveSettings(settings: Settings): void {
  const dir = join(SETTINGS_FILE, '..');
  writeFileSync(SETTINGS_FILE, JSON.stringify(settings, null, 2) + '\n');
}

/**
 * Show current status
 */
function showStatus(settings: Settings): void {
  const destructive = settings.allowDestructive ?? false;
  const verbose = settings.verboseMode ?? false;

  console.log('=== Claude Code Session Settings ===\n');
  console.log(`Destructive Commands: ${destructive ? 'ON' : 'OFF'}`);
  console.log(`Verbose Mode:         ${verbose ? 'ON' : 'OFF'}`);
  console.log(`\nSettings file: ${SETTINGS_FILE}`);
}

/**
 * Set a boolean setting
 */
function setSetting(key: 'allowDestructive' | 'verboseMode', value: boolean): void {
  const settings = loadSettings();

  if (key === 'allowDestructive') {
    settings.allowDestructive = value;
  } else if (key === 'verboseMode') {
    settings.verboseMode = value;
  }

  saveSettings(settings);

  const displayKey = key === 'allowDestructive' ? 'Destructive Commands' : 'Verbose Mode';
  console.log(`${displayKey} set to: ${value ? 'ON' : 'OFF'}`);
}

/**
 * Toggle a boolean setting
 */
function toggleSetting(key: 'allowDestructive' | 'verboseMode'): void {
  const settings = loadSettings();
  const currentValue = settings[key] ?? false;
  setSetting(key, !currentValue);
}

/**
 * Main execution
 */
function main(): void {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    // Show status
    showStatus(loadSettings());
    return;
  }

  const command = args[0];
  const subcommand = args[1];

  if (command === 'destructive' || command === 'dest') {
    if (subcommand === 'on') {
      setSetting('allowDestructive', true);
    } else if (subcommand === 'off') {
      setSetting('allowDestructive', false);
    } else if (!subcommand) {
      // Toggle
      toggleSetting('allowDestructive');
    } else {
      console.error(`Unknown subcommand: ${subcommand}`);
      console.error('Usage: bun tools/toggle/toggle.ts destructive [on|off]');
      process.exit(1);
    }
  } else if (command === 'verbose') {
    if (subcommand === 'on') {
      setSetting('verboseMode', true);
    } else if (subcommand === 'off') {
      setSetting('verboseMode', false);
    } else if (!subcommand) {
      toggleSetting('verboseMode');
    } else {
      console.error(`Unknown subcommand: ${subcommand}`);
      console.error('Usage: bun tools/toggle/toggle.ts verbose [on|off]');
      process.exit(1);
    }
  } else if (command === 'status') {
    showStatus(loadSettings());
  } else {
    console.error(`Unknown command: ${command}`);
    console.error('Usage:');
    console.error('  bun tools/toggle/toggle.ts');
    console.error('  bun tools/toggle/toggle.ts destructive [on|off]');
    console.error('  bun tools/toggle/toggle.ts verbose [on|off]');
    process.exit(1);
  }
}

main();
