---
type: tool
name: model-ranker
domain: api
capability: model-ranking
version: 1.0
classification: public
status: active
last_updated: 2026-02-14
dependencies:
  - "@types/bun": "^1"
env_required:
  - OPENROUTER_API_KEY
env_optional:
  - ARTIFICIAL_ANALYSIS_API_KEY
---

# Model Ranker Tool

**Aggregates external benchmarks (Artificial Analysis, LMArena) with OpenRouter's ZDR endpoint to produce a ranked, privacy-safe model list optimized for security workflows.**

---

## Overview

This tool provides:
- **Privacy-safe ranking** using OpenRouter Zero Data Retention (ZDR) endpoints
- **Multi-source aggregation** combining Artificial Analysis, LMArena, and OpenRouter data
- **Flexible profiles** with configurable weight distributions (security-interactive, batch-scanning, deep-analysis)
- **Cache management** with automatic 7-day TTL and programmatic access
- **US-only policy** filtering out models from geopolitically sensitive providers

---

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

**File responsibilities:**
- **refresh.ts** - CLI entry point, argument parsing, formatted output
- **sources.ts** - Parallel API fetches from 4 providers
- **mapper.ts** - Model ID cross-referencing with fuzzy matching
- **scorer.ts** - Normalization, weighting, composite scoring
- **client.ts** - Cache I/O, public API functions
- **types.ts** - Shared TypeScript interfaces

---

## Data Sources

| Source | Provides | Auth Required | Refresh Frequency |
|--------|----------|---------------|-------------------|
| OpenRouter ZDR | ZDR-eligible endpoints with live latency/throughput | `OPENROUTER_API_KEY` | Every 30 min (OpenRouter updates) |
| OpenRouter Models | Pricing, context window, architecture | `OPENROUTER_API_KEY` | Real-time |
| Artificial Analysis | Quality scores (coding, reasoning, speed) | `ARTIFICIAL_ANALYSIS_API_KEY` (optional) | Weekly |
| LMArena | Human preference ELO ratings | None | Daily |

The **OpenRouter ZDR endpoint** provides live performance data (p50/p75/p90/p99 latency and throughput) per provider endpoint, updated every 30 minutes.

---

## CLI Usage

```bash
# Full refresh + show top 15 models
bun tools/model-ranker/scripts/refresh.ts

# Show top 10 after refresh
bun tools/model-ranker/scripts/refresh.ts --top 10

# Check cache freshness only (no refresh)
bun tools/model-ranker/scripts/refresh.ts --status

# Use specific weight profile
bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning

# Cron-friendly (errors only)
bun tools/model-ranker/scripts/refresh.ts --quiet
```

---

## Programmatic API

```typescript
import {
  getTopModels,
  getRankedModels,
  refreshRankings,
  getCacheStatus,
  getModelDetails,
} from '@/tools/model-ranker/scripts/client';

// Get top 5 models (reads from cache, throws if stale)
const top5 = await getTopModels({ count: 5 });

// Get all ranked models for specific profile
const batch = await getRankedModels({ profile: 'batch-scanning' });

// Refresh cache from all sources
const cache = await refreshRankings();

// Check cache status without loading full rankings
const status = await getCacheStatus();
// { exists, fresh, generatedAt, expiresAt, modelCount }

// Get details for specific model
const model = await getModelDetails('openai/gpt-4-turbo');
```

---

## Weight Profiles

Rankings are calculated using weighted scoring across multiple dimensions:

| Profile | Coding | Reasoning | Cost | Speed | Context | Best For |
|---------|--------|-----------|------|-------|---------|----------|
| `security-interactive` (default) | 0.35 | 0.25 | 0.20 | 0.10 | 0.10 | Security code review, real-time analysis |
| `batch-scanning` | 0.20 | 0.15 | 0.40 | 0.15 | 0.10 | Large-scale vulnerability scanning |
| `deep-analysis` | 0.25 | 0.40 | 0.10 | 0.05 | 0.20 | Complex architecture review, threat modeling |

---

## Filtering

All models must pass these filters before scoring:

1. **ZDR compliance** - Model must be available on OpenRouter's Zero Data Retention endpoints
2. **US-only policy** - Blocks:
   - `deepseek/` (China)
   - `qwen/` (China)
   - `mistralai/` (France, flagged for review)
   - `01-ai/` (China)
   - `alibaba/` (China)
3. **Exclude Claude** - Claude models use Anthropic native SDK, never routed through OpenRouter

---

## Cache Management

**Location:** `tools/model-ranker/cache/zdr-rankings.json` (gitignored)

**Cache structure:**
```typescript
{
  version: string;
  generatedAt: ISO8601;
  expiresAt: ISO8601;
  sources: SourceMetadata[];
  rankings: RankedModel[]; // default profile
  profileRankings: Record<string, RankedModel[]>;
  filters: FilterInfo;
}
```

**TTL:** 7 days

**Cache behavior:**
- `getTopModels()` and `getRankedModels()` read from cache only — no network calls
- `refreshRankings()` fetches all sources and rebuilds cache
- Stale cache (>7 days) throws error on read operations
- Manual refresh recommended: weekly via cron or CLI

**Recommended cron setup:**

```bash
# Weekly refresh on Sunday at 2 AM
0 2 * * 0 cd /path/to/framework && bun tools/model-ranker/scripts/refresh.ts --quiet
```

---

## Environment Setup

### Required Credentials

- `OPENROUTER_API_KEY` - **Required** - OpenRouter API access for ZDR endpoints and model data

### Optional Credentials

- `ARTIFICIAL_ANALYSIS_API_KEY` - **Optional** - Artificial Analysis benchmarks (degrades gracefully without it)

### Setup Instructions

```bash
# 1. Add credentials to .env
echo "OPENROUTER_API_KEY=[insert key]" >> .env
# echo "ARTIFICIAL_ANALYSIS_API_KEY=aa-..." >> .env  # Optional

# 2. Source .env
source .env

# 3. Verify
echo $OPENROUTER_API_KEY

# 4. Test refresh
bun tools/model-ranker/scripts/refresh.ts
```

---

## Code Standards Compliance

This tool follows the framework's code quality standards:

✅ **Functions** - All ≤100 lines
✅ **Complexity** - Cyclomatic complexity ≤8 per function
✅ **Line width** - ≤100 characters (enforced)
✅ **Parameters** - ≤5 positional params (options objects for complex calls)
✅ **Imports** - Absolute paths only via tsconfig aliases
✅ **Types** - Complete TypeScript coverage
✅ **Zero warnings** - No lint, type, or compiler warnings

---

## Types

See `types.ts` for complete TypeScript definitions:

```typescript
interface RankedModel {
  id: string;
  name: string;
  compositeScore: number;
  dataCompleteness: number;
  scores: ModelScores;
  raw: RawModelData;
  sources: SourceMatch[];
}

interface ModelScores {
  coding: number;
  reasoning: number;
  costEfficiency: number;
  speed: number;
  contextLength: number;
}

interface CacheStatus {
  exists: boolean;
  fresh: boolean;
  generatedAt?: string;
  expiresAt?: string;
  modelCount?: number;
}

type WeightProfile = 'security-interactive' | 'batch-scanning' | 'deep-analysis';
```

---

## Integration with Skills

This tool is used by the **model-ranker skill** for user-facing ranking operations.

See: `tools/model-ranker/TOOL.md` for command documentation and user-facing workflows.

---

## Troubleshooting

### Missing OPENROUTER_API_KEY

```
Error: Missing required environment variable: OPENROUTER_API_KEY
```

**Fix:** Add `OPENROUTER_API_KEY=[insert key]` to `.env` and source it.

### Cache is stale

```bash
# Check status
bun tools/model-ranker/scripts/refresh.ts --status

# Refresh if needed
bun tools/model-ranker/scripts/refresh.ts
```

### No models returned after filtering

All models must be:
1. ZDR-compliant
2. Not in blocked prefix list
3. Not Claude models

Check filter configuration in `sources.ts` if all providers are blocked.

### Artificial Analysis API fails gracefully

Without `ARTIFICIAL_ANALYSIS_API_KEY`, models are ranked with lower data completeness (60-70% vs 100%), but the tool continues to function.

To fix: Add `ARTIFICIAL_ANALYSIS_API_KEY` to `.env` for complete benchmark data.

---

## External Resources

- [OpenRouter ZDR Documentation](https://openrouter.ai/docs/guides/features/zdr)
- [OpenRouter API Reference](https://openrouter.ai/docs/api/api-reference)
- [Artificial Analysis](https://artificialanalysis.ai)
- [LMArena Leaderboard](https://github.com/nakasyou/lmarena-history)

---

## Related Documentation

- **Skill documentation:** `tools/model-ranker/TOOL.md`
- **Framework credential handling:** `docs/standards/credential-handling-enforcement.md`
- **Tool catalog:** `docs/catalogs/tool-catalog.md`

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Classification:** Public
**Maintainer:** Framework Team
