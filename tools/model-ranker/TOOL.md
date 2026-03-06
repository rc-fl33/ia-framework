---
type: tool
name: model-ranker
domain: infrastructure
capability: model-ranking
version: 1.0
classification: public
status: active
last_updated: 2026-02-16
dependencies:
  - "@types/bun": "^1"
env_required:
  - OPENROUTER_API_KEY
env_optional:
  - ARTIFICIAL_ANALYSIS_API_KEY
---

# Model Ranker Tool

**Privacy-safe AI model rankings using OpenRouter ZDR + external benchmarks**

> **Type:** Infrastructure tool
> **Agent:** none (base Claude handles commands)
> **Commands:** `/model-ranker` (discovered via `tools/model-ranker/commands/`)

Aggregates data from OpenRouter's Zero Data Retention endpoints, Artificial Analysis, and LMArena
to produce a ranked, privacy-safe model list optimized for security workflows.

---

## Quick Start

```bash
/model-ranker                    # Full refresh + show top 15 models
/model-ranker --top 10           # Refresh + show top 10
/model-ranker --status           # Check cache status only (no refresh)
/model-ranker --profile batch-scanning  # Use specific weight profile
```

**Output:** Rankings cached to `tools/model-ranker/cache/zdr-rankings.json` (gitignored)

---

## Features

### Core Capabilities
- **Privacy-safe ranking** using OpenRouter Zero Data Retention (ZDR) endpoints
- **Multi-source aggregation** combining Artificial Analysis, LMArena, and OpenRouter data
- **Flexible profiles** with configurable weight distributions (security-interactive, batch-scanning, deep-analysis)
- **Cache management** with automatic 7-day TTL and programmatic access
- **US-only policy** filtering out models from geopolitically sensitive providers

### Weight Profiles

Rankings are calculated using weighted scoring across multiple dimensions:

| Profile | Coding | Reasoning | Cost | Speed | Context | Best For |
|---------|--------|-----------|------|-------|---------|----------|
| `security-interactive` (default) | 0.35 | 0.25 | 0.20 | 0.10 | 0.10 | Security code review, real-time analysis |
| `batch-scanning` | 0.20 | 0.15 | 0.40 | 0.15 | 0.10 | Large-scale vulnerability scanning |
| `deep-analysis` | 0.25 | 0.40 | 0.10 | 0.05 | 0.20 | Complex architecture review, threat modeling |

**Selection guide:**
- **Interactive security work** → `security-interactive` (balances quality + cost)
- **Batch processing** → `batch-scanning` (prioritizes cost efficiency)
- **Deep research** → `deep-analysis` (maximizes reasoning + context)

---

## Data Sources

| Source | Provides | Auth Required | Refresh Frequency |
|--------|----------|---------------|-------------------|
| OpenRouter ZDR | ZDR-eligible endpoints with live latency/throughput | `OPENROUTER_API_KEY` | Every 30 min (OpenRouter updates) |
| OpenRouter Models | Pricing, context window, architecture | `OPENROUTER_API_KEY` | Real-time |
| Artificial Analysis | Quality scores (coding, reasoning, speed) | `ARTIFICIAL_ANALYSIS_API_KEY` (optional) | Weekly |
| LMArena | Human preference ELO ratings | None | Daily |

The **OpenRouter ZDR endpoint** provides live performance data (p50/p75/p90/p99 latency and
throughput) per provider endpoint, updated every 30 minutes.

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

## Environment Setup

### Required Credentials

- `OPENROUTER_API_KEY` - **Required** - OpenRouter API access for ZDR endpoints and model data
- `ARTIFICIAL_ANALYSIS_API_KEY` - **Optional** - Artificial Analysis benchmarks (degrades gracefully without it)

### Setup Instructions

1. Obtain OpenRouter API key from [openrouter.ai](https://openrouter.ai)
2. (Optional) Obtain Artificial Analysis API key
3. Add credentials to `.env`:
   ```bash
   OPENROUTER_API_KEY=[insert your key here]
   ARTIFICIAL_ANALYSIS_API_KEY=aa-...  # Optional
   ```
4. Verify: `source .env && echo $OPENROUTER_API_KEY`

---

## CLI Usage

```bash
# Full refresh with default profile (security-interactive)
bun tools/model-ranker/scripts/refresh.ts

# Show top 10 models after refresh
bun tools/model-ranker/scripts/refresh.ts --top 10

# Check cache freshness only (no refresh)
bun tools/model-ranker/scripts/refresh.ts --status

# Refresh with batch scanning profile
bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning

# Cron-friendly (errors only)
bun tools/model-ranker/scripts/refresh.ts --quiet
```

---

## Programmatic Usage

The model-ranker tool can also be used programmatically from other skills:

```typescript
import { getTopModels, getRankedModels, refreshRankings, getCacheStatus } from '@/tools/model-ranker/scripts/client';

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

---

## Filters

All models must pass these filters before scoring:

1. **ZDR compliance** - Model must be available on OpenRouter's Zero Data Retention endpoints (privacy requirement)
2. **US-only policy** - Blocks models with data residency concerns:
   - `deepseek/` (China)
   - `qwen/` (China)
   - `mistralai/` (France, but flagged for review)
   - `01-ai/` (China)
   - `alibaba/` (China)
3. **Exclude Claude** - Claude models use Anthropic native SDK, never routed through OpenRouter

**Rationale:** ZDR + US-only filtering ensures all ranked models meet the framework's privacy and data sovereignty requirements for security work.

---

## Cache Management

**Cache location:** `tools/model-ranker/cache/zdr-rankings.json` (gitignored)

**Cache TTL:** 7 days

**Cache behavior:**
- `getTopModels()` and `getRankedModels()` read from cache only - no network calls
- `refreshRankings()` fetches all sources and rebuilds cache
- Stale cache (>7 days) throws error on read operations
- Manual refresh recommended: weekly via cron or `/model-ranker --quiet`

**Cron setup (recommended):**

```bash
# Weekly refresh on Sunday at 2 AM
0 2 * * 0 cd ~/ia-framework && bun tools/model-ranker/scripts/refresh.ts --quiet
```

---

## Troubleshooting

### Cache is stale

```bash
# Check cache status
/model-ranker --status

# If stale, refresh
/model-ranker
```

### Missing OPENROUTER_API_KEY

```
Error: Missing required environment variable: OPENROUTER_API_KEY
```

**Fix:** Add `OPENROUTER_API_KEY=[insert your key here]` to `.env` and source it.

### No models returned

Check filters - all models must be:
1. ZDR-compliant
2. Not in blocked prefix list (deepseek, qwen, etc.)
3. Not Claude (uses native SDK)

If all providers are blocked, review filter configuration in `tools/model-ranker/scripts/sources.ts`.

### Artificial Analysis API fails

The tool degrades gracefully without Artificial Analysis data. Models will still be ranked but with lower `dataCompleteness` scores (typically 60-70% vs 100%).

**Optional fix:** Add `ARTIFICIAL_ANALYSIS_API_KEY` to `.env` for complete benchmark data.

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/pentest/` — `/model-ranker` command invoked to select optimal LLM for research phases
- `skills/advisory/` — uses rankings to recommend models for specific task types

No direct TypeScript importers — invoked via `/model-ranker` slash command from base Claude.

---

## Reference Documentation

**Related Tools:**
- OpenRouter API client: `tools/api/openrouter/client.ts`
- Model selection reference: `skills/pentest/reference/model-selection.yaml`

**External Resources:**
- [OpenRouter ZDR Documentation](https://openrouter.ai/docs/guides/features/zdr)
- [Artificial Analysis](https://artificialanalysis.ai)
- [LMArena Leaderboard](https://github.com/nakasyou/lmarena-history)

**Framework Standards:**
- Credential handling: `docs/standards/credential-handling-enforcement.md`
- Tool creation: `docs/catalogs/tool-catalog.md`

---

**Version:** 1.0
**Last Updated:** 2026-02-16
**Maintainer:** Framework Team
**Classification:** Public
