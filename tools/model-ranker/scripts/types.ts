/**
 * ZDR Model Ranker - Type Definitions
 *
 * Interfaces for model ranking, scoring, caching, and external API responses.
 */

// ─── Weight Profiles ──────────────────────────────────────────────────────────

export interface WeightProfile {
  coding_quality: number;
  reasoning_quality: number;
  cost_efficiency: number;
  speed: number;
  context_window: number;
}

export const WEIGHT_PROFILES: Record<string, WeightProfile> = {
  'security-interactive': {
    coding_quality: 0.35,
    reasoning_quality: 0.25,
    cost_efficiency: 0.20,
    speed: 0.10,
    context_window: 0.10,
  },
  'batch-scanning': {
    coding_quality: 0.20,
    reasoning_quality: 0.15,
    cost_efficiency: 0.40,
    speed: 0.15,
    context_window: 0.10,
  },
  'deep-analysis': {
    coding_quality: 0.25,
    reasoning_quality: 0.40,
    cost_efficiency: 0.10,
    speed: 0.05,
    context_window: 0.20,
  },
};

// ─── Ranked Model (output) ───────────────────────────────────────────────────

export interface RankedModel {
  /** OpenRouter model ID (e.g., "x-ai/grok-4-fast") */
  id: string;
  /** Human-readable name */
  name: string;
  /** Composite score (0-1) using active weight profile */
  compositeScore: number;
  /** Individual normalized scores (0-1) */
  scores: {
    coding_quality: number;
    reasoning_quality: number;
    cost_efficiency: number;
    speed: number;
    context_window: number;
  };
  /** Raw data from sources */
  raw: {
    promptPricePerMillion?: number;
    completionPricePerMillion?: number;
    contextWindow?: number;
    /** ZDR endpoint median latency (ms) — live from OpenRouter */
    zdrLatencyP50?: number;
    /** ZDR endpoint median throughput (tokens/sec) — live from OpenRouter */
    zdrThroughputP50?: number;
    aaCodingIndex?: number;
    aaIntelligenceIndex?: number;
    aaSpeedIndex?: number;
    lmarenaElo?: number;
    lmarenaCodingElo?: number;
    /** Whether this model is available locally via grok2api (free, zero cost) */
    grok2apiLocal?: boolean;
  };
  /** 0-1 — fraction of scoring dimensions with real data */
  dataCompleteness: number;
  /** Whether this model passed all filters */
  eligible: boolean;
  /** Why it was filtered out (if not eligible) */
  filterReason?: string;
}

// ─── Grok2API Local Source Types ──────────────────────────────────────────────

export interface Grok2ApiLocalData {
  /** Model ID as reported by the local grok2api Docker service */
  id: string;
  /** Whether the model is currently available via Docker */
  available: boolean;
}

// ─── Merged Model (internal pipeline) ────────────────────────────────────────

export interface MergedModel {
  /** OpenRouter model ID */
  id: string;
  /** Display name */
  name: string;
  /** Canonical key for cross-referencing */
  canonicalKey: string;
  /** Data from each source */
  openrouter?: OpenRouterModelData;
  artificialAnalysis?: ArtificialAnalysisModelData;
  lmarena?: LMArenaModelData;
  /** Local grok2api availability data */
  grok2apiLocal?: Grok2ApiLocalData;
  /** Best ZDR endpoint for this model (lowest p50 latency among operational endpoints) */
  zdrEndpoint?: OpenRouterZDREndpoint;
  /** ZDR eligible */
  zdrEligible: boolean;
}

// ─── OpenRouter Source Types ─────────────────────────────────────────────────
// Ref: https://openrouter.ai/docs/api/api-reference/models/get-models

export interface OpenRouterModelData {
  id: string;
  canonical_slug?: string;
  hugging_face_id?: string | null;
  name: string;
  created?: number;
  description?: string;
  pricing: {
    prompt: string;
    completion: string;
    request?: string;
    image?: string;
    input_cache_read?: string;
    input_cache_write?: string;
    discount?: number;
  };
  context_length: number;
  architecture?: {
    tokenizer?: string;
    instruct_type?: string | null;
    modality?: string | null;
    input_modalities?: string[];
    output_modalities?: string[];
  };
  top_provider?: {
    context_length?: number | null;
    max_completion_tokens?: number | null;
    is_moderated?: boolean;
  };
  per_request_limits?: Record<string, string>;
  supported_parameters?: string[];
  expiration_date?: string | null;
}

export interface OpenRouterModelsResponse {
  data: OpenRouterModelData[];
}

// Ref: https://openrouter.ai/docs/api/api-reference/endpoints/list-endpoints-zdr

export interface PercentileStats {
  p50: number;
  p75: number;
  p90: number;
  p99: number;
}

export interface OpenRouterZDREndpoint {
  name: string;
  model_id: string;
  model_name: string;
  context_length?: number;
  pricing?: {
    prompt: string;
    completion: string;
    input_cache_read?: string;
    discount?: number;
  };
  provider_name?: string;
  tag?: string;
  quantization?: string;
  max_completion_tokens?: number | null;
  max_prompt_tokens?: number | null;
  supported_parameters?: string[];
  /** 0 = operational, negative = degraded/down */
  status?: number;
  uptime_last_30m?: number | null;
  supports_implicit_caching?: boolean;
  /** Live latency percentiles (ms) — last 30 minutes */
  latency_last_30m?: PercentileStats;
  /** Live throughput percentiles (tokens/sec) — last 30 minutes */
  throughput_last_30m?: PercentileStats;
}

export interface OpenRouterZDRResponse {
  data: OpenRouterZDREndpoint[];
}

// ─── Artificial Analysis Source Types ────────────────────────────────────────

export interface ArtificialAnalysisModelData {
  model_id: string;
  model_name: string;
  /** Coding quality index (0-100) */
  coding_index?: number;
  /** General intelligence index (0-100) */
  intelligence_index?: number;
  /** Speed index — tokens per second */
  speed_index?: number;
  /** Agent capability index */
  agent_index?: number;
}

export interface ArtificialAnalysisResponse {
  data: ArtificialAnalysisModelData[];
}

// ─── LMArena Source Types ───────────────────────────────────────────────────

export interface LMArenaModelData {
  model: string;
  elo: number;
  coding_elo?: number;
  num_battles?: number;
}

// LMArena raw format from nakasyou/lmarena-history
export interface LMArenaHistoryEntry {
  model: string;
  rating: number;
  num_battles?: number;
}

// ─── Cache Types ─────────────────────────────────────────────────────────────

export interface SourceMetadata {
  source: string;
  fetchedAt: string;
  modelCount: number;
  status: 'success' | 'error' | 'skipped';
  error?: string;
}

export interface RankingsCache {
  version: string;
  generatedAt: string;
  expiresAt: string;
  sources: SourceMetadata[];
  rankings: RankedModel[];
  profileRankings: Record<string, RankedModel[]>;
  filters: {
    zdrRequired: boolean;
    blockedPrefixes: string[];
    excludeClaude: boolean;
    totalModelsBeforeFilter: number;
    totalModelsAfterFilter: number;
  };
}

// ─── Client Options ──────────────────────────────────────────────────────────

export interface GetTopModelsOptions {
  count?: number;
  profile?: string;
  weights?: WeightProfile;
}

export interface GetRankedModelsOptions {
  profile?: string;
  includeBlocked?: boolean;
}

export interface CacheStatus {
  exists: boolean;
  fresh: boolean;
  generatedAt?: string;
  expiresAt?: string;
  modelCount?: number;
}
