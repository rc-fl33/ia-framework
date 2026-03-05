/**
 * ZDR Model Ranker - Public API
 *
 * Cache-first ranked model access. No surprise network calls —
 * getTopModels() reads from cache and throws if stale/missing.
 * refreshRankings() fetches all sources and rebuilds the cache.
 */

import { readFile, writeFile, mkdir, stat } from 'fs/promises';
import { resolve } from 'path';
import { fetchAllSources } from './sources';
import { ModelMapper, toCanonicalKey } from './mapper';
import { scoreModels, scoreAllProfiles } from './scorer';
import type {
  RankedModel,
  RankingsCache,
  MergedModel,
  WeightProfile,
  GetTopModelsOptions,
  GetRankedModelsOptions,
  CacheStatus,
  SourceMetadata,
} from './types';
import { WEIGHT_PROFILES } from './types';

const CACHE_DIR = resolve(import.meta.dir, 'cache');
const CACHE_FILE = resolve(CACHE_DIR, 'zdr-rankings.json');
const ALL_CACHE_FILE = resolve(CACHE_DIR, 'all-rankings.json');
const CACHE_VERSION = '1.0.0';
const CACHE_TTL_DAYS = 7;

// Blocked prefixes from model-selection.yaml (US-only policy)
const BLOCKED_PREFIXES = ['deepseek/', 'qwen/', 'mistralai/', 'mistral/', '01-ai/', 'alibaba/'];

// ─── Cache Management ────────────────────────────────────────────────────────

async function readCache(file = CACHE_FILE): Promise<RankingsCache | null> {
  try {
    const raw = await readFile(file, 'utf-8');
    return JSON.parse(raw) as RankingsCache;
  } catch {
    return null;
  }
}

async function writeCache(cache: RankingsCache, file = CACHE_FILE): Promise<void> {
  await mkdir(CACHE_DIR, { recursive: true });
  await writeFile(file, JSON.stringify(cache, null, 2), 'utf-8');
}

function isCacheFresh(cache: RankingsCache): boolean {
  const expiresAt = new Date(cache.expiresAt);
  return expiresAt > new Date();
}

// ─── Filters ─────────────────────────────────────────────────────────────────

function isBlocked(modelId: string): boolean {
  const lower = modelId.toLowerCase();
  return BLOCKED_PREFIXES.some(prefix => lower.startsWith(prefix));
}

function isClaude(modelId: string): boolean {
  return modelId.toLowerCase().includes('claude');
}

// ─── Pipeline ────────────────────────────────────────────────────────────────

/**
 * Run the full ranking pipeline: fetch → merge → filter → score → cache.
 * Pass { noZdr: true } to skip ZDR/Claude filters (comparison mode).
 */
export async function refreshRankings(options: { noZdr?: boolean } = {}): Promise<RankingsCache> {
  const { noZdr = false } = options;
  const cacheFile = noZdr ? ALL_CACHE_FILE : CACHE_FILE;
  const sources = await fetchAllSources();
  const allMetadata: SourceMetadata[] = [
    sources.zdr.metadata,
    sources.models.metadata,
    sources.aa.metadata,
    sources.lmarena.metadata,
    sources.grok2api.metadata,
  ];

  // Build ZDR set for mandatory filtering (uses model_id from ZDR endpoint)
  // Also build a map of best ZDR endpoint per model (lowest p50 latency, operational)
  const zdrSet = new Set(sources.zdr.data.map(e => e.model_id));
  const zdrBestEndpoint = new Map<string, (typeof sources.zdr.data)[0]>();
  for (const endpoint of sources.zdr.data) {
    const existing = zdrBestEndpoint.get(endpoint.model_id);
    // Prefer operational endpoints (status 0) with lowest latency
    const endpointOk = endpoint.status === undefined || endpoint.status === 0;
    const existingOk = existing?.status === undefined || existing?.status === 0;
    const endpointLatency = endpoint.latency_last_30m?.p50 ?? Infinity;
    const existingLatency = existing?.latency_last_30m?.p50 ?? Infinity;

    const isBetter =
      !existing ||
      (endpointOk && !existingOk) ||
      (endpointOk === existingOk && endpointLatency < existingLatency);

    if (isBetter) {
      zdrBestEndpoint.set(endpoint.model_id, endpoint);
    }
  }

  // Build mapper index from OpenRouter model IDs
  const mapper = new ModelMapper();
  const orModelIds = sources.models.data.map(m => m.id);
  mapper.buildIndex(orModelIds);

  // Build AA lookup by resolved OpenRouter ID
  const aaByOrId = new Map<string, (typeof sources.aa.data)[0]>();
  for (const aaModel of sources.aa.data) {
    const orId = mapper.resolve(aaModel.model_id || aaModel.model_name, 'artificial-analysis');
    if (orId) aaByOrId.set(orId, aaModel);
  }

  // Build LMArena lookup by resolved OpenRouter ID
  const lmByOrId = new Map<string, (typeof sources.lmarena.data)[0]>();
  for (const lmModel of sources.lmarena.data) {
    const orId = mapper.resolve(lmModel.model, 'lmarena');
    if (orId) lmByOrId.set(orId, lmModel);
  }

  // Build grok2api lookup by resolved OpenRouter ID
  const grokByOrId = new Map<string, (typeof sources.grok2api.data)[0]>();
  for (const grokModel of sources.grok2api.data) {
    const orId = mapper.resolve(grokModel.id, 'grok2api-local');
    if (orId) grokByOrId.set(orId, grokModel);
  }

  // Log mapper warnings
  const warnings = mapper.getWarnings();
  if (warnings.length > 0) {
    console.log(`\nMapper fuzzy matches (review for alias table):`);
    for (const w of warnings) {
      console.log(`  ${w.source}: "${w.sourceKey}" -> "${w.matchedKey}" (distance: ${w.distance})`);
    }
  }

  // Merge all data into MergedModel[]
  const totalModelsBeforeFilter = sources.models.data.length;
  const mergedModels: MergedModel[] = [];

  for (const orModel of sources.models.data) {
    const isZdr = zdrSet.has(orModel.id);
    const blocked = isBlocked(orModel.id);
    const claude = isClaude(orModel.id);

    const merged: MergedModel = {
      id: orModel.id,
      name: orModel.name,
      canonicalKey: toCanonicalKey(orModel.id),
      openrouter: orModel,
      artificialAnalysis: aaByOrId.get(orModel.id),
      lmarena: lmByOrId.get(orModel.id),
      grok2apiLocal: grokByOrId.get(orModel.id),
      zdrEndpoint: zdrBestEndpoint.get(orModel.id),
      zdrEligible: isZdr && !blocked && !claude,
    };


    mergedModels.push(merged);
  }

  // Filter to eligible models only for scoring
  const eligibleModels = noZdr
    ? mergedModels.filter(m => !isBlocked(m.id))
    : mergedModels.filter(m => m.zdrEligible);

  // Score across all profiles
  const profileRankings = scoreAllProfiles(eligibleModels);

  // Default profile ranking
  const rankings = profileRankings['security-interactive'] || scoreModels(eligibleModels);

  const now = new Date();
  const expiresAt = new Date(now.getTime() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000);

  const cache: RankingsCache = {
    version: CACHE_VERSION,
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    sources: allMetadata,
    rankings,
    profileRankings,
    filters: {
      zdrRequired: !noZdr,
      blockedPrefixes: BLOCKED_PREFIXES,
      excludeClaude: !noZdr,
      totalModelsBeforeFilter: totalModelsBeforeFilter,
      totalModelsAfterFilter: eligibleModels.length,
    },
  };

  await writeCache(cache, cacheFile);
  return cache;
}

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Get top N ranked models from cache.
 * Throws if cache is missing or stale — call refreshRankings() first.
 */
export async function getTopModels(options: GetTopModelsOptions = {}): Promise<RankedModel[]> {
  const {
    count = 10,
    profile = 'security-interactive',
    weights,
  } = options;

  const cache = await readCache();

  if (!cache) {
    throw new Error(
      'Rankings cache not found. Run `bun tools/model-ranker/scripts/refresh.ts` to generate it.',
    );
  }

  if (!isCacheFresh(cache)) {
    throw new Error(
      `Rankings cache expired (generated: ${cache.generatedAt}, expired: ${cache.expiresAt}). ` +
      'Run `bun tools/model-ranker/scripts/refresh.ts` to refresh.',
    );
  }

  // If custom weights provided, re-score from cached data? No — return pre-computed.
  // Custom weights would need the merged models which we don't cache (to keep cache small).
  // For custom weights, user should call refreshRankings() or accept profile rankings.
  if (weights) {
    // Can't re-score without raw merged models. Return default profile with a warning.
    console.warn('Custom weights require refreshRankings(). Using profile rankings instead.');
  }

  const rankings = cache.profileRankings[profile] || cache.rankings;
  return rankings.slice(0, count);
}

/**
 * Get all ranked models from cache.
 */
export async function getRankedModels(
  options: GetRankedModelsOptions = {},
): Promise<RankedModel[]> {
  const { profile = 'security-interactive' } = options;

  const cache = await readCache();

  if (!cache) {
    throw new Error(
      'Rankings cache not found. Run `bun tools/model-ranker/scripts/refresh.ts` to generate it.',
    );
  }

  if (!isCacheFresh(cache)) {
    throw new Error(
      `Rankings cache expired (generated: ${cache.generatedAt}, expired: ${cache.expiresAt}). ` +
      'Run `bun tools/model-ranker/scripts/refresh.ts` to refresh.',
    );
  }

  return cache.profileRankings[profile] || cache.rankings;
}

/**
 * Get cache freshness status without loading full rankings.
 */
export async function getCacheStatus(): Promise<CacheStatus> {
  const cache = await readCache();

  if (!cache) {
    return { exists: false, fresh: false };
  }

  return {
    exists: true,
    fresh: isCacheFresh(cache),
    generatedAt: cache.generatedAt,
    expiresAt: cache.expiresAt,
    modelCount: cache.rankings.length,
  };
}

/**
 * Get details for a specific model by ID.
 */
export async function getModelDetails(modelId: string): Promise<RankedModel | null> {
  const cache = await readCache();
  if (!cache) return null;

  const lower = modelId.toLowerCase();
  return cache.rankings.find(m => m.id.toLowerCase() === lower) || null;
}
