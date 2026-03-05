/**
 * Grok2API Admin Client
 *
 * Token management, NSFW control, cache management, and config
 * for the grok2api Docker service admin API.
 */

import type { TokenInfo, AdminCacheStats, NSFWConfig } from './types';
import { GROK2API_BASE_URL, GROK2API_ADMIN_KEY } from './types';

const ADMIN_BASE = `${GROK2API_BASE_URL}/v1/admin`;

async function adminFetch(
  path: string,
  options: RequestInit = {},
): Promise<Response> {
  const url = `${ADMIN_BASE}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${GROK2API_ADMIN_KEY}`,
    ...(options.headers as Record<string, string> || {}),
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Admin API error: ${response.status} ${error}`);
  }
  return response;
}

// ─── Token Management ────────────────────────────────────────────────────

/** List all tokens with status/quota/pool */
export async function listTokens(): Promise<TokenInfo[]> {
  const response = await adminFetch('/tokens');
  const data = await response.json();
  return data.tokens || data.data || [];
}

/** Add token to ssoBasic or ssoSuper pool */
export async function addToken(
  pool: 'ssoBasic' | 'ssoSuper',
  ssoToken: string,
  quota: number = 80,
): Promise<void> {
  await adminFetch('/tokens', {
    method: 'POST',
    body: JSON.stringify({ pool, token: ssoToken, quota }),
  });
}

/** Sync: check all token status/quota against X.com */
export async function refreshTokens(): Promise<TokenInfo[]> {
  const response = await adminFetch('/tokens/refresh', { method: 'POST' });
  const data = await response.json();
  return data.tokens || data.data || [];
}

/** Async refresh with SSE progress (returns task_id) */
export async function refreshTokensAsync(): Promise<string> {
  const response = await adminFetch('/tokens/refresh/async', {
    method: 'POST',
  });
  const data = await response.json();
  return data.task_id || data.taskId || '';
}

// ─── NSFW Control ────────────────────────────────────────────────────────

/** Batch enable unhinged mode on all tokens (sync) */
export async function enableNSFW(): Promise<void> {
  await adminFetch('/nsfw/enable', { method: 'POST' });
}

/** Async enable with SSE progress */
export async function enableNSFWAsync(): Promise<string> {
  const response = await adminFetch('/nsfw/enable/async', { method: 'POST' });
  const data = await response.json();
  return data.task_id || data.taskId || '';
}

/** Check current NSFW configuration */
export async function isNSFWEnabled(): Promise<boolean> {
  try {
    const response = await adminFetch('/config');
    const data = await response.json();
    return data?.image?.nsfw === true;
  } catch {
    return false;
  }
}

// ─── Cache Management ────────────────────────────────────────────────────

/** Get local image/video cache sizes and online asset counts */
export async function getCacheStats(): Promise<AdminCacheStats> {
  const response = await adminFetch('/cache/stats');
  return response.json();
}

/** Clear local cache */
export async function clearCache(
  type?: 'images' | 'videos' | 'all',
): Promise<void> {
  const body = type ? JSON.stringify({ type }) : undefined;
  await adminFetch('/cache/clear', { method: 'POST', body });
}

/** Clear cloud-stored assets per token */
export async function clearOnlineAssets(): Promise<void> {
  await adminFetch('/cache/online/clear', { method: 'POST' });
}

// ─── Config ──────────────────────────────────────────────────────────────

/** Get full config.toml as object */
export async function getConfig(): Promise<Record<string, unknown>> {
  const response = await adminFetch('/config');
  return response.json();
}

/** Update specific config value at runtime */
export async function updateConfig(
  section: string,
  key: string,
  value: unknown,
): Promise<void> {
  await adminFetch('/config', {
    method: 'PATCH',
    body: JSON.stringify({ section, key, value }),
  });
}
