---
audience: intermediate
category: standards
---


# QA Model Standards

**Last Updated:** 2026-01-23
**Current Standard:** `google/gemma-3-27b-it:free`
**Next Review:** 2026-04-23 (Quarterly)

---

## Standard QA Model

All skills performing quality assurance, verification, or content review should use the standard QA model unless there's a specific reason to deviate.

**Current Standard:**
```
google/gemma-3-27b-it:free
```

**Performance Metrics (2026-01-23):**
- Speed: 10.9s (3.5x faster than Grok)
- Cost: $0.00 (free)
- Quality: 0 FAIL rate, conservative citation checking
- Context: 131,072 tokens
- Tokens Used: ~5,400 per QA run

**Comparison Data:** See `skills/ghost/output/posts/2026-01-23-mint-release/qa-compare-2026-01-23T16-48-10.json`

---

## Environment Variable

Use the `QA_MODEL` environment variable to override the default:

```bash
# Use default (Gemma 3 27B)
bun qa-script.ts

# Override to Grok for comparison
QA_MODEL=x-ai/grok-4.1-fast bun qa-script.ts

# Override to another free model
QA_MODEL=meta-llama/llama-3.3-70b-instruct:free bun qa-script.ts
```

---

## Implementation Pattern

### TypeScript Implementation

```typescript
import { config } from 'dotenv';
config();

// Use standard QA model with environment override
const QA_MODEL = process.env.QA_MODEL || 'google/gemma-3-27b-it:free';

async function callQAModel(prompt: string) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  const payload: any = {
    model: QA_MODEL,
    messages: [
      { role: 'system', content: 'You are a quality reviewer.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 4096,
  };

  // Model-specific configuration
  if (QA_MODEL.includes('grok')) {
    payload.reasoning = { effort: 'high' };
  }

  // ZDR only for paid models (not :free suffix)
  if (!QA_MODEL.includes('grok') && !QA_MODEL.includes(':free')) {
    payload.zdr = true;
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  return await response.json();
}
```

**Note:** Python skills should use their existing OpenRouter clients. For new Python scripts, adapt the TypeScript pattern above.

---

## Skills Using QA Models

### Currently Implemented

| Skill | Script | Model | Status |
|-------|--------|-------|--------|
| **ghost** | `scripts/qa-review.ts` | ✅ Gemma 3 27B | Updated 2026-01-23 |
| **ghost** | `scripts/legal-review.ts` | ⏳ Needs update | Uses Grok directly |

### Needs Implementation

| Skill | Use Case | Priority |
|-------|----------|----------|
| **write** | Content QA verification | High |
| **security** | Vulnerability assessment review | Medium |
| **advisory** | Recommendation validation | Medium |
| **compliance** | Compliance statement verification | Medium |

---

## When to Deviate from Standard

You may use a different model if:

1. **Specialized reasoning required:** Use Grok for complex logical reasoning
   - Example: Legal citation verification, complex compliance analysis
   - Set `QA_MODEL=x-ai/grok-4.1-fast` for these cases

2. **Speed critical:** Use faster model for real-time validation
   - Example: Live user input validation
   - Consider `mistralai/mistral-large` (8.1s, free)

3. **Token limits:** Standard model has 131K context
   - If you need more, use a model with larger context window
   - Document the reason in code comments

4. **Cost sensitivity:** Standard is already free
   - No reason to switch for cost
   - Only switch if quality/speed requirements demand it

**Always document the reason for deviation in code comments.**

---

## Quarterly Review Process

**When:** Every 3 months (Jan, Apr, Jul, Oct)
**Owner:** Framework maintainer
**Tool:** `bun skills/ghost/scripts/qa-compare-models.ts <test-post>`

### Review Checklist

1. **Fetch latest models:**
   ```bash
   bun skills/ghost/scripts/list-openrouter-models.ts > /tmp/models.txt
   ```

2. **Identify new free models:**
   - Look for new `:free` models with >20B parameters
   - Check context window (prefer >100K tokens)
   - Note any new Google, Meta, Mistral, Qwen releases

3. **Run comparison test:**
   ```bash
   # Update qa-compare-models.ts with new models
   bun skills/ghost/scripts/qa-compare-models.ts skills/ghost/output/posts/<recent-post>/draft.md
   ```

4. **Evaluate results:**
   - Compare FAIL rates (prefer 0 FAIL)
   - Compare speed (prefer <15s)
   - Compare NEEDS_CITATION rate (more conservative = better)
   - Check blocking issues

5. **Update if better model found:**
   - Update this file (`docs/standards/qa-model-standards.md`)
   - Update default in all QA scripts
   - Update `active.md` with new stats
   - Announce change in session notes

6. **If no change needed:**
   - Update "Next Review" date (+3 months)
   - Note "No change - current model still optimal" in active.md

---

## Migration Guide

When changing the standard QA model:

### 1. Update Documentation
- [ ] Update this file with new model ID
- [ ] Update performance metrics
- [ ] Update comparison data reference
- [ ] Update "Last Updated" date

### 2. Update Scripts
- [ ] Update `skills/ghost/scripts/qa-review.ts`
- [ ] Update `skills/ghost/scripts/legal-review.ts`
- [ ] Update any skill-specific QA scripts
- [ ] Test each updated script

### 3. Update Environment
- [ ] Update `.env.example` with new QA_MODEL
- [ ] Document breaking changes in CHANGELOG
- [ ] Notify team/users of change

### 4. Verify Quality
- [ ] Run QA on 3 existing posts
- [ ] Compare results to previous runs
- [ ] Ensure no quality regression
- [ ] Document any differences

---

## Model Selection Rationale (2026-01-23)

**Why Gemma 3 27B over alternatives:**

| Model | PASS | FAIL | Speed | Cost | Reasoning |
|-------|------|------|-------|------|-----------|
| **Gemma 3 27B** ⭐ | 21-24 | 0 | 10.9s | Free | Best balance: fast, free, conservative |
| Grok 4.1 Fast | 23-24 | 0-1 | 38.3s | $0.013 | Slower, costs money, sometimes catches edge cases |
| Llama 3.3 70B | 23 | 0 | 11.3s | Free | JSON parsing issues, unreliable |
| Qwen 2.5 72B | 23-24 | 0-1 | 13.0s | Free | False positives on slugs/metadata |
| Mistral Large | 18-21 | 0-1 | 8.1s | Free | Too aggressive, lower PASS rate |

**Decision:** Gemma 3 27B provides the best combination of speed, cost (free), and quality for routine QA tasks.

**Special cases:** Use Grok for legal citation verification or complex compliance analysis where reasoning depth matters more than speed/cost.

---

## Testing Commands

### Quick Model Comparison
```bash
# Test current post against all free models
bun skills/ghost/scripts/qa-compare-models.ts skills/ghost/output/posts/<slug>/draft.md
```

### List Available Models
```bash
# Fetch latest OpenRouter model list
bun skills/ghost/scripts/list-openrouter-models.ts
```

### Single Model Test
```bash
# Test with standard model
bun skills/ghost/scripts/qa-review.ts <draft-path> <sonnet-rating>

# Test with override
QA_MODEL=x-ai/grok-4.1-fast bun skills/ghost/scripts/qa-review.ts <draft-path> <sonnet-rating>
```

---

## References

- **Model Comparison Data:** `skills/ghost/output/posts/2026-01-23-mint-release/qa-compare-*.json`
- **OpenRouter Models API:** https://openrouter.ai/api/v1/models
- **Gemma 3 Documentation:** https://huggingface.co/google/gemma-3-27b-it
- **Framework Active Work:** `docs/active.md` (quarterly review reminder)
