# ZDR Model Ranker

Aggregates external benchmarks (Artificial Analysis, LMArena) with OpenRouter's ZDR endpoint to produce a ranked, privacy-safe model list.

## Quick Start

```bash
# Full refresh — fetches all sources, scores, writes cache
bun tools/model-ranker/scripts/refresh.ts

# Show top 10
bun tools/model-ranker/scripts/refresh.ts --top 10

# Check cache freshness
bun tools/model-ranker/scripts/refresh.ts --status

# Cron-friendly (errors only)
bun tools/model-ranker/scripts/refresh.ts --quiet

# Use specific weight profile
bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning
```

## Data Sources

| Source | What It Provides | Auth Required | Docs |
|--------|-----------------|---------------|------|
| OpenRouter ZDR | ZDR-eligible endpoints with live latency/throughput | `OPENROUTER_API_KEY` | [API ref](https://openrouter.ai/docs/api/api-reference/endpoints/list-endpoints-zdr) |
| OpenRouter Models | Pricing, context window, architecture | `OPENROUTER_API_KEY` | [API ref](https://openrouter.ai/docs/api/api-reference/models/get-models) |
| Artificial Analysis | Quality scores (coding, reasoning, speed) | `ARTIFICIAL_ANALYSIS_API_KEY` (optional) | [artificialanalysis.ai](https://artificialanalysis.ai) |
| LMArena | Human preference ELO ratings (overall + coding) | None | [GitHub](https://github.com/nakasyou/lmarena-history) |

The ZDR endpoint returns live performance data (p50/p75/p90/p99 latency and throughput) per provider endpoint, updated every 30 minutes. This is used as the primary speed signal in scoring. See [ZDR feature docs](https://openrouter.ai/docs/guides/features/zdr) for background.

## Filters

All models must pass these filters before scoring:

1. **ZDR compliance** — model must be available on OpenRouter's Zero Data Retention endpoints
2. **US-only policy** — blocks `deepseek/`, `qwen/`, `mistralai/`, `01-ai/`, `alibaba/`
3. **Exclude Claude** — Claude models use Anthropic native SDK, never OpenRouter

## Weight Profiles

| Profile | Coding | Reasoning | Cost | Speed | Context |
|---------|--------|-----------|------|-------|---------|
| `security-interactive` (default) | 0.35 | 0.25 | 0.20 | 0.10 | 0.10 |
| `batch-scanning` | 0.20 | 0.15 | 0.40 | 0.15 | 0.10 |
| `deep-analysis` | 0.25 | 0.40 | 0.10 | 0.05 | 0.20 |

## Programmatic Usage

```typescript
import { getTopModels, getRankedModels, refreshRankings, getCacheStatus } from './client';

// Get top 5 models (reads from cache, throws if stale)
const top5 = await getTopModels({ count: 5 });

// Get all ranked models for a specific profile
const batchModels = await getRankedModels({ profile: 'batch-scanning' });

// Refresh cache (fetches all sources)
const cache = await refreshRankings();

// Check cache status
const status = await getCacheStatus();
// { exists: true, fresh: true, generatedAt: '...', expiresAt: '...', modelCount: 42 }
```

## Cache

- Location: `tools/api/model-ranker/cache/zdr-rankings.json` (gitignored)
- TTL: 7 days
- `getTopModels()` and `getRankedModels()` read from cache only — no network calls
- `refreshRankings()` fetches all sources and rebuilds cache
- Weekly local cron refresh is sufficient

## Architecture

```
refresh.ts  ──→  sources.ts (4 parallel fetches)
                     ↓
                 mapper.ts (cross-reference model IDs)
                     ↓
                 scorer.ts (normalize, weight, rank)
                     ↓
                 client.ts (cache read/write, public API)
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | Yes | OpenRouter API access |
| `ARTIFICIAL_ANALYSIS_API_KEY` | No | Artificial Analysis benchmarks (degrades gracefully without it) |
