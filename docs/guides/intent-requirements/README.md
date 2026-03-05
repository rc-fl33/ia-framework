# Intent Requirements Database

**Purpose:** Explicit requirements for common user intents
**Used by:** Intent enrichment layer (`tools/orchestration/intent-enricher.ts`)

---

## What This Is

When users make vague requests like "write a blog post" or "test the API", the intent enrichment layer:

1. **Detects intent** from user request
2. **Loads requirements** from this database
3. **Sends to Haiku** for enrichment with explicit context
4. **Returns complete prompt** with all requirements specified

**Result:** Agents receive crystal-clear instructions, zero ambiguous delegations.

---

## Intent Files

| Intent | Agent | Skill | Cost | Duration |
|--------|-------|-------|------|----------|
| blog-writing | writer | write | Haiku | Standard |
| security-testing | security | security | Sonnet | Extended |
| career-analysis | advisor | career | Haiku | Standard |
| compliance-assessment | advisor | compliance | Haiku | Extended |

---

## Intent File Structure

Each `.json` file contains:

```json
{
  "intent": "intent-name",
  "agent": "which agent handles this",
  "skill": "which skill to use",
  "triggers": ["keywords", "that", "match", "this", "intent"],
  "required_context": ["must", "have", "these"],
  "optional_context": ["nice", "to", "have"],
  "workflow_phases": ["phase1", "phase2", "..."],
  "quality_gates": {
    "metric": "threshold"
  },
  "default_output": "path/to/output/",
  "cost_estimate": "haiku|sonnet",
  "typical_duration": "quick|standard|extended",
  "enrichment_template": "Template text with {{variables}}"
}
```

---

## How Enrichment Works

### Before Enrichment
```
User: "Write a blog post"
    ↓
Base Claude: "Okay..."
    ↓
Task(subagent_type="writer", prompt="Write a blog post")  ← VAGUE
    ↓
Writer agent: "About what? Research needed? QA threshold?"
```

### After Enrichment
```
User: "Write a blog post"
    ↓
Intent enricher detects: blog-writing
    ↓
Loads: docs/guides/intent-requirements/blog-writing.json
    ↓
Sends to Haiku with enrichment_template
    ↓
Haiku returns: "Execute blog writing workflow:
  - Topic: [needs clarification]
  - Research: 10+ sources minimum
  - QA threshold: 4.0/5.0
  - Workflow: research → outline → draft → QA → publish
  - Output: skills/ghost/output/posts/"
    ↓
Task(subagent_type="writer", prompt=enriched)  ← EXPLICIT
    ↓
Writer agent: "Clear instructions, executing phases..."
```

---

## Adding New Intents

1. Create `docs/guides/intent-requirements/your-intent.json`
2. Follow structure above
3. Include enrichment_template with {{variables}}
4. Run validation: `bun run tools/validate-intent-requirements.ts`

---

## Validation Schema

See: Intent requirements are validated inline by the validation tooling.

**Required fields:**
- intent, agent, skill, triggers (min 3)
- required_context, workflow_phases
- enrichment_template

**Optional fields:**
- optional_context, quality_gates
- default_output, cost_estimate, typical_duration
- safety_requirements (for engineer agent)

---

## Cost Analysis

**Per enrichment:**
- Input: ~150 tokens (user request + template)
- Output: ~300 tokens (explicit prompt)
- Model: Haiku ($0.25/1M input, $1.25/1M output)
- **Cost: ~$0.0003 per request**

**Annual cost (1000 requests/month):**
- 12,000 × $0.0003 = **$3.60/year**

**ROI:** Eliminates clarification loops, prevents incomplete work, enforces quality standards automatically.

---

## Related Documentation

- `docs/GENERATIVE-ROUTING-GATES-STANDARD.md` - Overall standard
- `tools/orchestration/intent-enricher.ts` - Implementation
- `CLAUDE.md` - Intent enrichment in orchestrator role

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
