# Model Ranker Skill Verification Checklist

## File Structure

- [ ] `SKILL.md` exists and follows template structure
- [ ] `commands/model-ranker.md` exists and documents command behavior
- [ ] `docs/` directory created (for future documentation)
- [ ] `output/` directory created (currently unused - rankings go to tool cache)

## Environment Setup

- [ ] `OPENROUTER_API_KEY` documented in SKILL.md env_keys
- [ ] `ARTIFICIAL_ANALYSIS_API_KEY` documented as optional
- [ ] Setup instructions reference `private/docs/env-setup.md`
- [ ] `.env.structure.yaml` includes both keys (check separately)

## Command Functionality

### /model-ranker (default)

Test: `/model-ranker`

Expected:
- [ ] Uses Bash tool (not direct bash execution)
- [ ] Executes `bun tools/model-ranker/scripts/refresh.ts`
- [ ] Displays top 15 models by default
- [ ] Shows data sources status
- [ ] Shows filter information
- [ ] Writes cache to `tools/model-ranker/scripts/cache/zdr-rankings.json`

### /model-ranker --top N

Test: `/model-ranker --top 5`

Expected:
- [ ] Executes `bun tools/model-ranker/scripts/refresh.ts --top 5`
- [ ] Displays exactly 5 models
- [ ] Includes all metadata (score, cost, context, data completeness)

### /model-ranker --status

Test: `/model-ranker --status`

Expected:
- [ ] Executes `bun tools/model-ranker/scripts/refresh.ts --status`
- [ ] No API calls made (reads cache only)
- [ ] Shows cache freshness (fresh/STALE)
- [ ] Shows generated and expiry timestamps
- [ ] Shows model count
- [ ] Exit code 0 if fresh, 1 if stale

### /model-ranker --profile <name>

Test: `/model-ranker --profile batch-scanning`

Expected:
- [ ] Executes `bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning`
- [ ] Uses batch-scanning weight profile (Cost: 0.40)
- [ ] Rankings different from default security-interactive profile

### /model-ranker --quiet

Test: `/model-ranker --quiet`

Expected:
- [ ] Executes `bun tools/model-ranker/scripts/refresh.ts --quiet`
- [ ] No verbose output (errors only)
- [ ] Suitable for cron jobs

## Error Handling

### Missing OPENROUTER_API_KEY

Test: Unset `OPENROUTER_API_KEY` → `/model-ranker`

Expected:
- [ ] Clear error message before tool execution
- [ ] Setup instructions displayed
- [ ] Reference to `private/docs/env-setup.md`
- [ ] Does not attempt API call

### Stale Cache

Test: `/model-ranker --status` with cache >7 days old

Expected:
- [ ] Output shows "Cache: STALE"
- [ ] Exit code 1
- [ ] Suggests running refresh

### Invalid Profile

Test: `/model-ranker --profile invalid-name`

Expected:
- [ ] Tool returns error
- [ ] Lists valid profiles
- [ ] Shows correct usage

## Integration

### Catalog Entry

- [ ] Added to `docs/catalogs/commands.md` under Infrastructure section
- [ ] Classification: `private`
- [ ] Effort: `Quick`
- [ ] Description matches SKILL.md

### Framework Standards

- [ ] Uses Bash tool (not direct shell commands)
- [ ] Credentials loaded from `.env` only
- [ ] No hardcoded API keys
- [ ] Follows Universal Prompt Structure v2.0
- [ ] Agent routing clearly documented (agent: none)

## Documentation Quality

- [ ] SKILL.md has clear USE WHEN section
- [ ] Examples provided for all common operations
- [ ] Troubleshooting section covers common errors
- [ ] Weight profiles explained with use cases
- [ ] Data sources documented with links
- [ ] Filters explained with privacy rationale

## Programmatic Access

Test: Import and use client API

```typescript
import { getTopModels } from '@/tools/model-ranker/scripts/client';
const top5 = await getTopModels({ count: 5 });
```

Expected:
- [ ] Returns top 5 models from cache
- [ ] Throws error if cache stale
- [ ] No network calls (cache-only operation)

## Output Quality

### Refresh Output

- [ ] Sources section shows all 4 data sources
- [ ] Success/failure clearly indicated per source
- [ ] Filter statistics displayed (before/after counts)
- [ ] Model rankings formatted consistently
- [ ] Score, cost, context, and data completeness all shown
- [ ] Cache location displayed at end

### Status Output

- [ ] Fresh/stale clearly indicated
- [ ] Timestamps in ISO 8601 format
- [ ] Model count displayed
- [ ] Exit code matches status (0=fresh, 1=stale)

## Performance

- [ ] Full refresh completes in <30 seconds (network dependent)
- [ ] Status check completes in <1 second (local only)
- [ ] Parallel source fetching working (4 concurrent requests)

## Security

- [ ] All API keys loaded from `.env` (never hardcoded)
- [ ] Cache file in `.gitignore` (contains model metadata, not secrets)
- [ ] ZDR filter enforced (privacy requirement)
- [ ] US-only policy enforced (blocked prefixes)
- [ ] Claude models excluded (use native SDK)

## Maintenance

- [ ] Cache TTL: 7 days (reasonable balance)
- [ ] Cron setup documented (weekly refresh suggested)
- [ ] Version field in SKILL.md metadata
- [ ] Last updated date current

---

## Manual Verification Steps

1. **First-time setup:**
   ```bash
   # Add to .env
   OPENROUTER_API_KEY=[insert your key here]
   ARTIFICIAL_ANALYSIS_API_KEY=aa-...  # Optional

   # Source environment
   source .env

   # Verify
   echo $OPENROUTER_API_KEY
   ```

2. **Test full refresh:**
   ```bash
   /model-ranker
   ```

   Verify:
   - Output shows 4 data sources
   - Rankings displayed
   - Cache file created
   - No errors

3. **Test cache status:**
   ```bash
   /model-ranker --status
   ```

   Verify:
   - Shows "Cache: fresh"
   - Timestamps correct
   - Model count matches refresh output

4. **Test profiles:**
   ```bash
   /model-ranker --profile security-interactive  # Default
   /model-ranker --profile batch-scanning
   /model-ranker --profile deep-analysis
   ```

   Verify:
   - Rankings change between profiles
   - Cost-optimized models rank higher in batch-scanning
   - Reasoning-optimized models rank higher in deep-analysis

5. **Test error handling:**
   ```bash
   # Unset key
   unset OPENROUTER_API_KEY
   /model-ranker
   ```

   Verify:
   - Clear error message
   - Setup instructions shown
   - No API call attempted

---

## Completion Criteria

**ALL items above must be checked before considering the skill production-ready.**

**Blockers:**
- Missing OPENROUTER_API_KEY documentation → Add to private/docs/env-setup.md
- Bash tool not used → Fix command implementation
- Missing catalog entry → Add to docs/catalogs/commands.md

**Nice-to-have (not blocking):**
- Cron job setup script
- Integration examples for other skills
- Comparison tool for weight profiles
