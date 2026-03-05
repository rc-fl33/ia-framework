#!/usr/bin/env bun
/**
 * settings.json Intelligent Merge
 *
 * Merges upstream settings.json with local version while:
 * - Preserving user-added hooks (detect by path pattern)
 * - Adding new framework hooks
 * - Merging environment variables as object merge
 * - Deduplicating hooks by command path
 *
 * Usage:
 *   bun tools/framework-update/merge-settings-json.ts preview <local> <upstream>
 *   bun tools/framework-update/merge-settings-json.ts apply <local> <upstream>
 */

import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, '..', '..');

interface HookConfig {
  type: string;
  command: string;
  [key: string]: any;
}

interface HookEvent {
  matcher: string;
  hooks: HookConfig[];
}

interface SettingsJson {
  env?: Record<string, string>;
  framework?: Record<string, any>;
  hooks?: Record<string, HookEvent[]>;
  [key: string]: any;
}

interface MergeStats {
  framework_hooks_added: number;
  user_hooks_preserved: number;
  duplicates_removed: number;
  env_vars_merged: number;
}

/**
 * Detect if a hook is user-added (not a standard framework hook)
 */
function isUserHook(command: string): boolean {
  // Framework hooks pattern: bun run hooks/
  if (command.includes('bun run hooks/')) {
    return false;
  }

  // User hook patterns: skills/*/scripts/hooks/* or custom paths
  if (command.includes('skills/') && command.includes('/scripts/hooks/')) {
    return true;
  }

  // Any other path is considered user-added
  return !command.includes('bun run hooks/');
}

/**
 * Extract hook identifier for deduplication
 */
function getHookId(hook: HookConfig): string {
  // Use command as unique identifier
  return hook.command;
}

/**
 * Merge hook arrays, removing duplicates and preserving user hooks
 */
function mergeHooks(localHooks: HookConfig[], upstreamHooks: HookConfig[]): { merged: HookConfig[]; stats: { user: number; framework: number; duplicates: number } } {
  const seen = new Set<string>();
  const result: HookConfig[] = [];
  let userCount = 0;
  let frameworkCount = 0;
  let duplicateCount = 0;

  // Add local hooks first (prioritize preserving user customizations)
  for (const hook of localHooks) {
    const id = getHookId(hook);
    if (!seen.has(id)) {
      seen.add(id);
      result.push(hook);
      if (isUserHook(hook.command)) {
        userCount++;
      }
    } else {
      duplicateCount++;
    }
  }

  // Add upstream hooks (only if not already present)
  for (const hook of upstreamHooks) {
    const id = getHookId(hook);
    if (!seen.has(id)) {
      seen.add(id);
      result.push(hook);
      frameworkCount++;
    } else {
      duplicateCount++;
    }
  }

  return {
    merged: result,
    stats: { user: userCount, framework: frameworkCount, duplicates: duplicateCount }
  };
}

/**
 * Merge object values recursively (for env variables)
 */
function mergeObjects(local: Record<string, any>, upstream: Record<string, any>): Record<string, any> {
  const result = { ...upstream }; // Start with upstream as base

  for (const [key, value] of Object.entries(local)) {
    if (typeof value === 'object' && value !== null && typeof result[key] === 'object' && result[key] !== null) {
      // Recursive merge for nested objects
      result[key] = mergeObjects(value, result[key]);
    } else {
      // For primitives, prefer local (user value)
      result[key] = value;
    }
  }

  return result;
}

/**
 * Perform merge operation
 */
export function mergeSettingsJson(localPath: string, upstreamPath: string, mode: 'preview' | 'apply'): MergeStats {
  if (!existsSync(localPath) || !existsSync(upstreamPath)) {
    throw new Error('Settings files not found');
  }

  const localContent = JSON.parse(readFileSync(localPath, 'utf-8')) as SettingsJson;
  const upstreamContent = JSON.parse(readFileSync(upstreamPath, 'utf-8')) as SettingsJson;

  const stats: MergeStats = {
    framework_hooks_added: 0,
    user_hooks_preserved: 0,
    duplicates_removed: 0,
    env_vars_merged: 0
  };

  const merged: SettingsJson = { ...localContent };

  // Merge framework section (always use upstream)
  if (upstreamContent.framework) {
    merged.framework = upstreamContent.framework;
  }

  // Merge env variables (object merge - upstream base + local overrides)
  if (localContent.env || upstreamContent.env) {
    const localEnv = localContent.env || {};
    const upstreamEnv = upstreamContent.env || {};

    merged.env = mergeObjects(localEnv, upstreamEnv);

    // Count merged variables
    const allKeys = new Set([...Object.keys(localEnv), ...Object.keys(upstreamEnv)]);
    stats.env_vars_merged = allKeys.size;
  }

  // Merge hooks (preserve user, add framework)
  if (merged.hooks && upstreamContent.hooks) {
    for (const [eventName, upstreamEventHooks] of Object.entries(upstreamContent.hooks)) {
      const localEventHooks = merged.hooks[eventName] || [];

      // For each hook event (PreToolUse, PostToolUse, etc.)
      const mergedEventHooks: HookEvent[] = [];

      for (const upstreamEvent of upstreamEventHooks) {
        const localEvent = localEventHooks.find(e => e.matcher === upstreamEvent.matcher);

        if (localEvent && localEvent.hooks) {
          // Event exists locally - merge hook arrays
          const { merged: mergedHooks, stats: hookStats } = mergeHooks(localEvent.hooks, upstreamEvent.hooks);

          mergedEventHooks.push({
            matcher: upstreamEvent.matcher,
            hooks: mergedHooks
          });

          stats.framework_hooks_added += hookStats.framework;
          stats.user_hooks_preserved += hookStats.user;
          stats.duplicates_removed += hookStats.duplicates;
        } else {
          // New event type from upstream
          mergedEventHooks.push(upstreamEvent);
          stats.framework_hooks_added += upstreamEvent.hooks.length;
        }
      }

      // Add local events that don't exist upstream
      for (const localEvent of localEventHooks) {
        if (!upstreamEventHooks.find(e => e.matcher === localEvent.matcher)) {
          mergedEventHooks.push(localEvent);
          stats.user_hooks_preserved += localEvent.hooks.length;
        }
      }

      merged.hooks![eventName] = mergedEventHooks;
    }
  } else if (upstreamContent.hooks) {
    // No local hooks, use upstream
    merged.hooks = upstreamContent.hooks;
  }

  // Apply if requested
  if (mode === 'apply') {
    writeFileSync(localPath, JSON.stringify(merged, null, 2), 'utf-8');
    console.log(`✅ Merge applied to: ${localPath}`);
  }

  return stats;
}

/**
 * Print merge report
 */
function printReport(stats: MergeStats, mode: 'preview' | 'apply') {
  console.log('\n' + '='.repeat(70));
  console.log('SETTINGS.JSON MERGE REPORT');
  console.log('='.repeat(70));

  console.log(`\n📊 Summary:`);
  console.log(`  ✓ Framework hooks added: ${stats.framework_hooks_added}`);
  console.log(`  ⊚ User hooks preserved: ${stats.user_hooks_preserved}`);
  console.log(`  🗑️  Duplicates removed: ${stats.duplicates_removed}`);
  console.log(`  🔄 Environment variables merged: ${stats.env_vars_merged}`);

  console.log(`\n📝 Details:`);
  console.log(`  • Framework section updated from upstream`);
  console.log(`  • Hook arrays merged (user hooks preserved)`);
  console.log(`  • Duplicate hooks removed`);
  console.log(`  • Environment variables merged (local overrides)`);

  if (mode === 'preview') {
    console.log(`\n⏳ Preview mode - no changes applied`);
  } else {
    console.log(`\n✅ Merge applied successfully`);
  }

  console.log('\n' + '='.repeat(70));
}

/**
 * Main execution
 */
async function main() {
  const args = process.argv.slice(2);
  const mode = (args[0] || 'preview') as 'preview' | 'apply';
  const localPath = args[1] || join(FRAMEWORK_ROOT, 'settings.json');
  const upstreamPath = args[2];

  if (mode !== 'preview' && mode !== 'apply') {
    console.error('Usage: merge-settings-json.ts <preview|apply> [local-path] [upstream-path]');
    process.exit(1);
  }

  if (!existsSync(localPath)) {
    console.error(`Local file not found: ${localPath}`);
    process.exit(1);
  }

  if (!upstreamPath || !existsSync(upstreamPath)) {
    console.error('Upstream file path required and must exist');
    process.exit(1);
  }

  try {
    console.log(`\n🔍 Analyzing settings.json merge...`);
    const stats = mergeSettingsJson(localPath, upstreamPath, mode);
    printReport(stats, mode);
  } catch (error) {
    console.error('Merge failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

main();
