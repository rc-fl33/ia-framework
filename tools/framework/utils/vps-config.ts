/**
 * VPS Configuration Resolver - Canonical credential loading for all VPS access
 *
 * Single source of truth for VPS credential resolution across the framework.
 * Supports multiple VPS providers with automatic alias resolution.
 *
 * Provider priority (highest first):
 *   OVHCLOUD_VPS_*  → Security testing infrastructure (kali-pentest, reaper, etc.)
 *   HOSTINGER_VPS_* → Bounty target scrapers (cron jobs, data collection)
 *   VPS_*           → Generic fallback (legacy)
 *
 * Usage:
 *   import { resolveVPSConfig, resolveVPSConfigByProvider } from '@/tools/framework/utils/vps-config';
 *
 *   // Auto-resolve (tries all providers)
 *   const config = resolveVPSConfig();
 *
 *   // Provider-specific
 *   const security = resolveVPSConfigByProvider('ovhcloud');
 *   const scrapers = resolveVPSConfigByProvider('hostinger');
 */

import { existsSync, readFileSync, accessSync, constants as fsConstants } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { resolveEnvPath } from './path-resolution';

// =============================================================================
// TYPES
// =============================================================================

export interface VPSConfig {
  host: string;
  user: string;
  port: string;
  sshKeyPath: string;
  /** Which provider prefix resolved this config */
  resolvedFrom: string;
}

/** Provider name is any string — auto-discovered from .env keys matching {PREFIX}_VPS_HOST */
export type VPSProvider = string;

// =============================================================================
// PROVIDER AUTO-DISCOVERY
// =============================================================================

/**
 * Standard VPS key suffixes. A provider is any .env key prefix matching:
 *   {PREFIX}_VPS_HOST, {PREFIX}_VPS_USER, {PREFIX}_VPS_PORT, {PREFIX}_VPS_SSH_KEY
 *
 * Examples:
 *   OVHCLOUD_VPS_HOST      → provider "ovhcloud"
 *   HOSTINGER_VPS_HOST     → provider "hostinger"
 *   LINODE_VPS_HOST        → provider "linode"
 *   AWS_LIGHTSAIL_VPS_HOST → provider "aws_lightsail"
 *
 * Legacy suffixes (_VPS_SSH_PORT, _VPS_SSH_KEY_PATH) are accepted as fallbacks.
 * No code changes needed to add providers — just add keys to .env.
 */
const VPS_SUFFIXES = {
  host: '_VPS_HOST',
  user: '_VPS_USER',
  port: '_VPS_PORT',
  sshKey: '_VPS_SSH_KEY',
} as const;

/** Legacy/generic key names (no prefix) */
const GENERIC_KEYS = {
  host: ['VPS_HOST', 'IPv4_address'],
  user: ['VPS_USER', 'Username'],
  port: ['VPS_PORT', 'VPS_SSH_PORT'],
  sshKey: ['VPS_SSH_KEY', 'VPS_SSH_KEY_PATH', 'SSH_PRIV'],
};

/**
 * Discover all VPS providers configured in .env by scanning for *_VPS_HOST keys.
 * Returns provider names in lowercase (e.g., ['ovhcloud', 'hostinger']).
 */
function discoverProviders(vars: Record<string, string>): string[] {
  const providers: string[] = [];
  for (const key of Object.keys(vars)) {
    if (key.endsWith(VPS_SUFFIXES.host) && !key.startsWith('VPS_')) {
      const prefix = key.slice(0, -VPS_SUFFIXES.host.length).toLowerCase();
      if (prefix) providers.push(prefix);
    }
  }
  return providers;
}

/**
 * Build key lookup list for a credential type across all discovered providers + generic.
 */
function buildKeyLookup(vars: Record<string, string>, suffix: string, genericKeys: string[]): string[] {
  const keys: string[] = [];
  // Provider-specific keys first (in order of discovery)
  for (const key of Object.keys(vars)) {
    if (key.endsWith(suffix) && !key.startsWith('VPS_')) {
      keys.push(key);
    }
  }
  // Then generic/legacy
  keys.push(...genericKeys);
  return keys;
}

const DEFAULTS: Partial<Record<'host' | 'user' | 'port' | 'sshKey', string>> = {
  port: '22',
};

// =============================================================================
// ENV PARSING
// =============================================================================

let cachedEnvVars: Record<string, string> | null = null;

/**
 * Parse .env file into key-value map (cached after first call).
 */
function loadEnvVars(): Record<string, string> {
  if (cachedEnvVars) return cachedEnvVars;

  const envPath = resolveEnvPath();
  if (!existsSync(envPath)) {
    throw new Error(`.env file not found at ${envPath}\nRun: bun run tools/setup/install-framework.ts`);
  }

  const content = readFileSync(envPath, 'utf-8');
  const vars: Record<string, string> = {};

  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    // Strip surrounding quotes
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    // Expand ${HOME}
    value = value.replace(/\$\{HOME\}/g, homedir());
    value = value.replace(/\$HOME/g, homedir());
    if (key) vars[key] = value;
  }

  cachedEnvVars = vars;
  return vars;
}

/**
 * Find first matching value from a list of key names.
 */
function resolveKey(vars: Record<string, string>, keys: string[], fallback?: string): string | undefined {
  for (const key of keys) {
    if (vars[key] !== undefined && vars[key] !== '') return vars[key];
  }
  return fallback;
}

/**
 * Determine which provider a resolved key came from (dynamic, not hardcoded).
 */
function detectProvider(vars: Record<string, string>, keys: string[]): string {
  for (const key of keys) {
    if (vars[key] !== undefined && vars[key] !== '') {
      if (key.endsWith(VPS_SUFFIXES.host)) {
        const prefix = key.slice(0, -VPS_SUFFIXES.host.length).toLowerCase();
        return prefix || 'generic';
      }
      if (key.startsWith('VPS_')) return 'generic';
      return 'legacy';
    }
  }
  return 'generic';
}

// =============================================================================
// VALIDATION
// =============================================================================

/**
 * Expand ~ to home directory in file paths.
 */
export function expandHomePath(filePath: string): string {
  return filePath.startsWith('~') ? join(homedir(), filePath.slice(1)) : filePath;
}

/**
 * Validate that an SSH key file exists and is readable.
 */
export function validateSSHKey(sshKeyPath: string): { valid: boolean; expandedPath: string; error?: string } {
  const expandedPath = expandHomePath(sshKeyPath);
  if (!existsSync(expandedPath)) {
    return { valid: false, expandedPath, error: `SSH key not found: ${expandedPath}` };
  }
  try {
    accessSync(expandedPath, fsConstants.R_OK);
    return { valid: true, expandedPath };
  } catch {
    return { valid: false, expandedPath, error: `SSH key not readable: ${expandedPath}` };
  }
}

// =============================================================================
// PUBLIC API
// =============================================================================

/**
 * Resolve VPS configuration using all naming schemes (auto-detect provider).
 *
 * Auto-discovers providers from .env keys matching {PREFIX}_VPS_HOST.
 * Tries discovered providers first, then generic VPS_* keys, then legacy.
 *
 * @throws Error if host, user, or sshKey cannot be resolved
 */
export function resolveVPSConfig(): VPSConfig {
  const vars = loadEnvVars();

  const hostKeys = buildKeyLookup(vars, VPS_SUFFIXES.host, GENERIC_KEYS.host);
  const userKeys = buildKeyLookup(vars, VPS_SUFFIXES.user, GENERIC_KEYS.user);
  const portKeys = buildKeyLookup(vars, VPS_SUFFIXES.port, GENERIC_KEYS.port);
  const sshKeyKeys = buildKeyLookup(vars, VPS_SUFFIXES.sshKey, GENERIC_KEYS.sshKey);

  const host = resolveKey(vars, hostKeys);
  const user = resolveKey(vars, userKeys);
  const port = resolveKey(vars, portKeys, DEFAULTS.port)!;
  const sshKeyPath = resolveKey(vars, sshKeyKeys);
  const resolvedFrom = detectProvider(vars, hostKeys);

  if (!host || !user || !sshKeyPath) {
    const missing: string[] = [];
    if (!host) missing.push(`host (checked: ${hostKeys.join(', ')})`);
    if (!user) missing.push(`user (checked: ${userKeys.join(', ')})`);
    if (!sshKeyPath) missing.push(`sshKey (checked: ${sshKeyKeys.join(', ')})`);
    throw new Error(`Missing VPS credentials in .env:\n  ${missing.join('\n  ')}\nRun: bun tools/pentest/setup.ts`);
  }

  return { host, user, port, sshKeyPath, resolvedFrom };
}

/**
 * Resolve VPS configuration for a specific provider.
 *
 * Provider name maps to .env key prefix: "ovhcloud" → OVHCLOUD_VPS_*
 * Falls back to generic VPS_* keys if provider-specific keys not found.
 * Any provider name works — no hardcoded list.
 *
 * @param provider - Provider name (e.g., 'ovhcloud', 'hostinger', 'linode', 'digitalocean')
 * @throws Error if required credentials not found for provider
 */
export function resolveVPSConfigByProvider(provider: VPSProvider): VPSConfig {
  const vars = loadEnvVars();
  const PREFIX = provider.toUpperCase();

  // Provider-specific keys first, then legacy provider variants, then generic fallback
  const hostKeys = [`${PREFIX}${VPS_SUFFIXES.host}`, ...GENERIC_KEYS.host];
  const userKeys = [`${PREFIX}${VPS_SUFFIXES.user}`, ...GENERIC_KEYS.user];
  const portKeys = [`${PREFIX}${VPS_SUFFIXES.port}`, `${PREFIX}_VPS_SSH_PORT`, ...GENERIC_KEYS.port];
  const sshKeyKeys = [`${PREFIX}${VPS_SUFFIXES.sshKey}`, `${PREFIX}_VPS_SSH_KEY_PATH`, ...GENERIC_KEYS.sshKey];

  const host = resolveKey(vars, hostKeys);
  const user = resolveKey(vars, userKeys);
  const port = resolveKey(vars, portKeys, DEFAULTS.port)!;
  const sshKeyPath = resolveKey(vars, sshKeyKeys);

  if (!host || !user || !sshKeyPath) {
    const missing: string[] = [];
    if (!host) missing.push(`host (checked: ${hostKeys.join(', ')})`);
    if (!user) missing.push(`user (checked: ${userKeys.join(', ')})`);
    if (!sshKeyPath) missing.push(`sshKey (checked: ${sshKeyKeys.join(', ')})`);
    throw new Error(`Missing ${PREFIX} VPS credentials in .env:\n  ${missing.join('\n  ')}\nRun: bun tools/pentest/setup.ts`);
  }

  return { host, user, port, sshKeyPath, resolvedFrom: provider };
}

/**
 * List all discovered VPS providers from .env.
 *
 * Scans for keys matching {PREFIX}_VPS_HOST pattern.
 * Returns provider names in lowercase.
 *
 * @example
 *   listProviders() // ['ovhcloud', 'hostinger']
 */
export function listProviders(): string[] {
  const vars = loadEnvVars();
  return discoverProviders(vars);
}

/**
 * Get a specific .env value by key name (for non-VPS credentials like HACKERONE_USERNAME).
 *
 * @param key - Exact .env key name
 * @returns Value or undefined if not set
 */
export function getEnvValue(key: string): string | undefined {
  const vars = loadEnvVars();
  return vars[key];
}

/**
 * Check if a specific .env key exists and has a non-empty value.
 */
export function hasEnvKey(key: string): boolean {
  const vars = loadEnvVars();
  return vars[key] !== undefined && vars[key] !== '';
}

/**
 * Get all accepted key names for a given credential type (dynamically built).
 * Useful for error messages and documentation generation.
 */
export function getAcceptedKeyNames(): Record<'host' | 'user' | 'port' | 'sshKey', string[]> {
  const vars = loadEnvVars();
  return {
    host: buildKeyLookup(vars, VPS_SUFFIXES.host, GENERIC_KEYS.host),
    user: buildKeyLookup(vars, VPS_SUFFIXES.user, GENERIC_KEYS.user),
    port: buildKeyLookup(vars, VPS_SUFFIXES.port, GENERIC_KEYS.port),
    sshKey: buildKeyLookup(vars, VPS_SUFFIXES.sshKey, GENERIC_KEYS.sshKey),
  };
}

/**
 * Clear cached env vars (useful for testing or after .env changes).
 */
export function clearCache(): void {
  cachedEnvVars = null;
}

// =============================================================================
// CLI
// =============================================================================

if (typeof Bun !== 'undefined' && import.meta.main) {
  try {
    console.log('VPS Configuration Resolver\n');

    // Auto-discover all providers
    const providers = listProviders();
    console.log(`Discovered providers: ${providers.length > 0 ? providers.join(', ') : '(none — using generic VPS_* keys)'}\n`);

    // Show each discovered provider
    for (const provider of providers) {
      try {
        const config = resolveVPSConfigByProvider(provider);
        console.log(`${provider.toUpperCase()} VPS:`);
        console.log(`  Host: ${config.user}@${config.host}:${config.port}`);
        console.log(`  SSH Key: ${config.sshKeyPath}`);
        const keyCheck = validateSSHKey(config.sshKeyPath);
        console.log(`  Key Valid: ${keyCheck.valid ? 'YES' : 'NO — ' + keyCheck.error}`);
        console.log('');
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : String(e);
        console.log(`${provider.toUpperCase()} VPS: Error — ${msg}\n`);
      }
    }

    // Auto-resolve (show which provider wins priority)
    try {
      const auto = resolveVPSConfig();
      console.log(`Auto-Resolve: ${auto.resolvedFrom} (${auto.user}@${auto.host}:${auto.port})`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.log(`Auto-Resolve: FAILED — ${msg}`);
    }

    // HackerOne
    const h1User = getEnvValue('HACKERONE_USERNAME');
    console.log(`\nHackerOne: ${h1User ? h1User : 'Not configured'}`);

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`Error: ${msg}`);
    process.exit(1);
  }
}
