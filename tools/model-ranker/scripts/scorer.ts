/**
 * ZDR Model Ranker - Scoring Engine
 *
 * Min-max normalization, composite scoring, and weight profile application.
 * Missing data is filled with median of the eligible set (not zero).
 */

import type {
  MergedModel,
  RankedModel,
  WeightProfile,
} from './types';
import { WEIGHT_PROFILES } from './types';

// ─── Normalization ───────────────────────────────────────────────────────────

/**
 * Min-max normalize an array of values to [0, 1].
 * Returns normalized values. If all values are equal, returns 0.5 for all.
 */
function minMaxNormalize(values: number[]): number[] {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min;

  if (range === 0) return values.map(() => 0.5);
  return values.map(v => (v - min) / range);
}

/**
 * Compute median of a numeric array.
 */
function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

// ─── Raw Value Extraction ────────────────────────────────────────────────────

interface RawScores {
  codingQuality: number | null;
  reasoningQuality: number | null;
  costPerMillion: number | null;
  latencyMs: number | null;
  contextWindow: number | null;
}

function extractRawScores(model: MergedModel): RawScores {
  const or = model.openrouter;
  const aa = model.artificialAnalysis;
  const lm = model.lmarena;
  const zdr = model.zdrEndpoint;
  const grok2api = model.grok2apiLocal;

  // Coding quality: prefer AA coding index
  const codingQuality = aa?.coding_index ?? null;

  // Reasoning quality: prefer LMArena ELO, fallback to AA intelligence index
  const reasoningQuality = lm?.elo ?? aa?.intelligence_index ?? null;

  // Cost: use OpenRouter prompt pricing (per million tokens)
  // If the model is available locally via grok2api, cost is 0 (free)
  let costPerMillion: number | null;
  if (grok2api?.available) {
    costPerMillion = 0;
  } else {
    const promptPrice = or?.pricing?.prompt ? parseFloat(or.pricing.prompt) : null;
    const completionPrice = or?.pricing?.completion
      ? parseFloat(or.pricing.completion) : null;
    costPerMillion = promptPrice !== null && completionPrice !== null
      ? (promptPrice + completionPrice) / 2
      : promptPrice ?? completionPrice ?? null;
  }

  // Speed: prefer ZDR endpoint live throughput (tokens/sec, p50),
  // fallback to AA speed index. ZDR throughput is real-time from actual endpoints.
  const latencyMs = zdr?.throughput_last_30m?.p50 ?? aa?.speed_index ?? null;

  // Context window from OpenRouter
  const contextWindow = or?.context_length ?? null;

  return { codingQuality, reasoningQuality, costPerMillion, latencyMs, contextWindow };
}

// ─── Scoring Pipeline ────────────────────────────────────────────────────────

/**
 * Score and rank a set of merged models using the given weight profile.
 * Returns RankedModel[] sorted by composite score (descending).
 */
export function scoreModels(
  models: MergedModel[],
  profileName: string = 'security-interactive',
  customWeights?: WeightProfile,
): RankedModel[] {
  const defaultProfile = 'security-interactive';
  const weights =
    customWeights || WEIGHT_PROFILES[profileName] || WEIGHT_PROFILES[defaultProfile];

  // Extract raw scores for all models
  const rawData = models.map(m => ({
    model: m,
    raw: extractRawScores(m),
  }));

  // Collect non-null values per dimension for median imputation
  const codingValues = rawData
    .map(d => d.raw.codingQuality)
    .filter((v): v is number => v !== null);
  const reasoningValues = rawData
    .map(d => d.raw.reasoningQuality)
    .filter((v): v is number => v !== null);
  const costValues = rawData
    .map(d => d.raw.costPerMillion)
    .filter((v): v is number => v !== null);
  const speedValues = rawData
    .map(d => d.raw.latencyMs)
    .filter((v): v is number => v !== null);
  const contextValues = rawData
    .map(d => d.raw.contextWindow)
    .filter((v): v is number => v !== null);

  const codingMedian = median(codingValues);
  const reasoningMedian = median(reasoningValues);
  const costMedian = median(costValues);
  const speedMedian = median(speedValues);
  const contextMedian = median(contextValues);

  // Impute missing values with median
  const imputed = rawData.map(d => {
    const totalDimensions = 5;
    let presentDimensions = 0;

    const coding = d.raw.codingQuality ?? codingMedian;
    if (d.raw.codingQuality !== null) presentDimensions++;

    const reasoning = d.raw.reasoningQuality ?? reasoningMedian;
    if (d.raw.reasoningQuality !== null) presentDimensions++;

    const cost = d.raw.costPerMillion ?? costMedian;
    if (d.raw.costPerMillion !== null) presentDimensions++;

    const speed = d.raw.latencyMs ?? speedMedian;
    if (d.raw.latencyMs !== null) presentDimensions++;

    const context = d.raw.contextWindow ?? contextMedian;
    if (d.raw.contextWindow !== null) presentDimensions++;

    return {
      model: d.model,
      rawOriginal: d.raw,
      coding,
      reasoning,
      cost,
      speed,
      context,
      dataCompleteness: totalDimensions > 0 ? presentDimensions / totalDimensions : 0,
    };
  });

  // Min-max normalize each dimension across all models
  const codingNorm = minMaxNormalize(imputed.map(d => d.coding));
  const reasoningNorm = minMaxNormalize(imputed.map(d => d.reasoning));
  // Cost: lower is better, so invert (1 - normalized)
  const costNorm = minMaxNormalize(imputed.map(d => d.cost)).map(v => 1 - v);
  // Speed: higher AA speed index is better (tokens/sec)
  const speedNorm = minMaxNormalize(imputed.map(d => d.speed));
  const contextNorm = minMaxNormalize(imputed.map(d => d.context));

  // Compute composite scores
  const ranked: RankedModel[] = imputed.map((d, i) => {
    const scores = {
      coding_quality: codingNorm[i],
      reasoning_quality: reasoningNorm[i],
      cost_efficiency: costNorm[i],
      speed: speedNorm[i],
      context_window: contextNorm[i],
    };

    const compositeScore =
      weights.coding_quality * scores.coding_quality +
      weights.reasoning_quality * scores.reasoning_quality +
      weights.cost_efficiency * scores.cost_efficiency +
      weights.speed * scores.speed +
      weights.context_window * scores.context_window;

    const or = d.model.openrouter;
    const aa = d.model.artificialAnalysis;
    const lm = d.model.lmarena;
    const zdr = d.model.zdrEndpoint;
    const grok2api = d.model.grok2apiLocal;

    const promptPrice = or?.pricing?.prompt
      ? parseFloat(or.pricing.prompt)
      : undefined;
    const completionPrice = or?.pricing?.completion
      ? parseFloat(or.pricing.completion)
      : undefined;

    return {
      id: d.model.id,
      name: d.model.name,
      compositeScore: Math.round(compositeScore * 10000) / 10000,
      scores,
      raw: {
        promptPricePerMillion: promptPrice,
        completionPricePerMillion: completionPrice,
        contextWindow: or?.context_length,
        zdrLatencyP50: zdr?.latency_last_30m?.p50,
        zdrThroughputP50: zdr?.throughput_last_30m?.p50,
        aaCodingIndex: aa?.coding_index,
        aaIntelligenceIndex: aa?.intelligence_index,
        aaSpeedIndex: aa?.speed_index,
        lmarenaElo: lm?.elo,
        lmarenaCodingElo: lm?.coding_elo,
        grok2apiLocal: grok2api?.available ?? undefined,
      },
      dataCompleteness: Math.round(d.dataCompleteness * 100) / 100,
      eligible: d.model.zdrEligible,
    };
  });

  // Sort by composite score descending
  ranked.sort((a, b) => b.compositeScore - a.compositeScore);

  return ranked;
}

/**
 * Score models across all predefined profiles.
 * Returns a map of profile name → sorted RankedModel[].
 */
export function scoreAllProfiles(models: MergedModel[]): Record<string, RankedModel[]> {
  const result: Record<string, RankedModel[]> = {};

  for (const profileName of Object.keys(WEIGHT_PROFILES)) {
    result[profileName] = scoreModels(models, profileName);
  }

  return result;
}
