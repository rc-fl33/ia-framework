/**
 * ZDR Model Ranker - Data Source Fetchers
 *
 * Parallel fetchers for 5 data sources:
 * 1. OpenRouter ZDR endpoints
 * 2. OpenRouter model catalog
 * 3. Artificial Analysis benchmarks
 * 4. LMArena ELO ratings
 * 5. Grok2API local Docker models
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import type {
  OpenRouterModelData,
  OpenRouterModelsResponse,
  OpenRouterZDREndpoint,
  OpenRouterZDRResponse,
  ArtificialAnalysisModelData,
  ArtificialAnalysisResponse,
  LMArenaModelData,
  LMArenaHistoryEntry,
  Grok2ApiLocalData,
  SourceMetadata,
} from './types';
import { GROK2API_BASE_URL } from '@/tools/grok2api/types';

// Load .env from framework root
config({ path: resolve(import.meta.dir, '../../../.env') });

const OPENROUTER_BASE = 'https://openrouter.ai/api/v1';
const AA_BASE = 'https://api.artificialanalysis.ai/v1';
const LMARENA_REPO = 'nakasyou/lmarena-history';
const LMARENA_RAW_URL =
  `https://raw.githubusercontent.com/${LMARENA_REPO}/main/output/scores.json`;

const FETCH_TIMEOUT = 30_000;

// ─── OpenRouter ZDR Endpoints ────────────────────────────────────────────────

export async function fetchZDREndpoints(): Promise<{
  data: OpenRouterZDREndpoint[];
  metadata: SourceMetadata;
}> {
  const fetchedAt = new Date().toISOString();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      data: [],
      metadata: {
        source: 'openrouter-zdr',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: 'OPENROUTER_API_KEY not set',
      },
    };
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE}/endpoints/zdr`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        metadata: {
          source: 'openrouter-zdr',
          fetchedAt,
          modelCount: 0,
          status: 'error',
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
        },
      };
    }

    const json: OpenRouterZDRResponse = await response.json();
    const data = json.data || [];

    return {
      data,
      metadata: {
        source: 'openrouter-zdr',
        fetchedAt,
        modelCount: data.length,
        status: 'success',
      },
    };
  } catch (error) {
    return {
      data: [],
      metadata: {
        source: 'openrouter-zdr',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// ─── OpenRouter Models ───────────────────────────────────────────────────────

export async function fetchOpenRouterModels(): Promise<{
  data: OpenRouterModelData[];
  metadata: SourceMetadata;
}> {
  const fetchedAt = new Date().toISOString();
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return {
      data: [],
      metadata: {
        source: 'openrouter-models',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: 'OPENROUTER_API_KEY not set',
      },
    };
  }

  try {
    const response = await fetch(`${OPENROUTER_BASE}/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        metadata: {
          source: 'openrouter-models',
          fetchedAt,
          modelCount: 0,
          status: 'error',
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
        },
      };
    }

    const json: OpenRouterModelsResponse = await response.json();
    const data = json.data || [];

    return {
      data,
      metadata: {
        source: 'openrouter-models',
        fetchedAt,
        modelCount: data.length,
        status: 'success',
      },
    };
  } catch (error) {
    return {
      data: [],
      metadata: {
        source: 'openrouter-models',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// ─── Artificial Analysis ─────────────────────────────────────────────────────

export async function fetchArtificialAnalysis(): Promise<{
  data: ArtificialAnalysisModelData[];
  metadata: SourceMetadata;
}> {
  const fetchedAt = new Date().toISOString();
  const apiKey = process.env.ARTIFICIAL_ANALYSIS_API_KEY;

  if (!apiKey) {
    return {
      data: [],
      metadata: {
        source: 'artificial-analysis',
        fetchedAt,
        modelCount: 0,
        status: 'skipped',
        error: 'ARTIFICIAL_ANALYSIS_API_KEY not set (optional)',
      },
    };
  }

  try {
    const response = await fetch(`${AA_BASE}/data/llms/models`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        metadata: {
          source: 'artificial-analysis',
          fetchedAt,
          modelCount: 0,
          status: 'error',
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
        },
      };
    }

    const json: ArtificialAnalysisResponse = await response.json();
    const data = json.data || [];

    return {
      data,
      metadata: {
        source: 'artificial-analysis',
        fetchedAt,
        modelCount: data.length,
        status: 'success',
      },
    };
  } catch (error) {
    return {
      data: [],
      metadata: {
        source: 'artificial-analysis',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// ─── LMArena ─────────────────────────────────────────────────────────────────

export async function fetchLMArena(): Promise<{
  data: LMArenaModelData[];
  metadata: SourceMetadata;
}> {
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(LMARENA_RAW_URL, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        metadata: {
          source: 'lmarena',
          fetchedAt,
          modelCount: 0,
          status: 'error',
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
        },
      };
    }

    const raw = await response.json();

    // Format: { "YYYYMMDD": { "text": { "full_old": { "model": elo } } } }
    // Get the latest date entry
    const data: LMArenaModelData[] = [];

    if (typeof raw === 'object' && !Array.isArray(raw)) {
      const dateKeys = Object.keys(raw).sort();
      const latestDate = dateKeys[dateKeys.length - 1];
      const latestEntry = raw[latestDate];

      if (latestEntry && typeof latestEntry === 'object') {
        // Extract from text.overall (overall ELO) and text.coding (coding ELO)
        // Fallback keys: full_old, full for older data formats
        const overallScores: Record<string, number> =
          latestEntry?.text?.overall ||
          latestEntry?.text?.full_old ||
          latestEntry?.text?.full ||
          {};
        const codingScores: Record<string, number> = latestEntry?.text?.coding || {};

        for (const [model, elo] of Object.entries(overallScores)) {
          if (typeof elo === 'number') {
            data.push({
              model,
              elo,
              coding_elo: typeof codingScores[model] === 'number' ? codingScores[model] : undefined,
            });
          }
        }
      }
    } else if (Array.isArray(raw)) {
      // Fallback: array of { model, rating } entries
      for (const entry of raw) {
        if (entry.model && typeof entry.rating === 'number') {
          data.push({ model: entry.model, elo: entry.rating });
        }
      }
    }

    return {
      data,
      metadata: {
        source: 'lmarena',
        fetchedAt,
        modelCount: data.length,
        status: 'success',
      },
    };
  } catch (error) {
    return {
      data: [],
      metadata: {
        source: 'lmarena',
        fetchedAt,
        modelCount: 0,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}

// ─── Grok2API Local Models ───────────────────────────────────────────────────

const GROK2API_FETCH_TIMEOUT = 5_000;

export async function fetchGrok2ApiModels(): Promise<{
  data: Grok2ApiLocalData[];
  metadata: SourceMetadata;
}> {
  const fetchedAt = new Date().toISOString();

  try {
    const response = await fetch(`${GROK2API_BASE_URL}/v1/models`, {
      signal: AbortSignal.timeout(GROK2API_FETCH_TIMEOUT),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        data: [],
        metadata: {
          source: 'grok2api-local',
          fetchedAt,
          modelCount: 0,
          status: 'error',
          error: `HTTP ${response.status}: ${errorText.substring(0, 200)}`,
        },
      };
    }

    const json = await response.json();
    const rawModels: Array<{ id: string }> = json.data || [];
    const data: Grok2ApiLocalData[] = rawModels.map(m => ({
      id: m.id,
      available: true,
    }));

    return {
      data,
      metadata: {
        source: 'grok2api-local',
        fetchedAt,
        modelCount: data.length,
        status: 'success',
      },
    };
  } catch {
    // Docker not running or network error — graceful skip
    return {
      data: [],
      metadata: {
        source: 'grok2api-local',
        fetchedAt,
        modelCount: 0,
        status: 'skipped',
        error: 'grok2api Docker not running',
      },
    };
  }
}

// ─── Parallel Fetch All ──────────────────────────────────────────────────────

export interface AllSourceData {
  zdr: Awaited<ReturnType<typeof fetchZDREndpoints>>;
  models: Awaited<ReturnType<typeof fetchOpenRouterModels>>;
  aa: Awaited<ReturnType<typeof fetchArtificialAnalysis>>;
  lmarena: Awaited<ReturnType<typeof fetchLMArena>>;
  grok2api: Awaited<ReturnType<typeof fetchGrok2ApiModels>>;
}

/**
 * Fetch all 5 sources in parallel. Each source handles its own errors —
 * failures in one source don't block others.
 */
export async function fetchAllSources(): Promise<AllSourceData> {
  const [zdr, models, aa, lmarena, grok2api] = await Promise.all([
    fetchZDREndpoints(),
    fetchOpenRouterModels(),
    fetchArtificialAnalysis(),
    fetchLMArena(),
    fetchGrok2ApiModels(),
  ]);

  return { zdr, models, aa, lmarena, grok2api };
}
