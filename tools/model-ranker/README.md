# Model Ranker Tool

**Privacy-safe AI model rankings for security workflows.**

> **Type:** Infrastructure tool (not a skill - server/utility management)
> **Agent:** none (base Claude handles commands)
> **Commands:** `/model-ranker` (discovered via `tools/model-ranker/commands/`)

## Quick Start

```bash
/model-ranker                    # Full refresh + show top 15 models
/model-ranker --top 10           # Refresh + show top 10
/model-ranker --status           # Check cache status only
```

## What It Does

Aggregates model rankings from multiple sources:
- **OpenRouter ZDR** - Zero Data Retention endpoints (privacy-safe)
- **Artificial Analysis** - Quality benchmarks (coding, reasoning, speed)
- **LMArena** - Human preference ratings

Then filters and ranks models based on:
- ✅ ZDR compliance (privacy requirement)
- ✅ US-only policy (data sovereignty)
- ✅ Configurable weight profiles (security-interactive, batch-scanning, deep-analysis)

## Weight Profiles

| Profile | Best For |
|---------|----------|
| `security-interactive` (default) | Real-time security code review |
| `batch-scanning` | Large-scale vulnerability scanning (cost-optimized) |
| `deep-analysis` | Complex architecture review, threat modeling |

## Setup

1. Get OpenRouter API key from [openrouter.ai](https://openrouter.ai)
2. Add to `.env`:
   ```bash
   OPENROUTER_API_KEY=[insert your key here]
   ```
3. Run: `/model-ranker`

## Cache

Rankings are cached for 7 days at `tools/model-ranker/cache/zdr-rankings.json` (gitignored).

**Recommended:** Set up weekly cron refresh
```bash
0 2 * * 0 cd /home/groves/ia-framework-private && bun tools/model-ranker/scripts/refresh.ts --quiet
```

## Programmatic Usage

```typescript
import { getTopModels, getCacheStatus } from '@/tools/model-ranker/scripts/client';

const top5 = await getTopModels({ count: 5 });
const status = await getCacheStatus();
```

## Documentation

- **Complete docs:** `TOOL.md`
- **Command reference:** `commands/model-ranker.md`
- **Verification:** `VERIFY.md`

---

**Version:** 1.0
**Last Updated:** 2026-02-16
