---
audience: advanced
category: standards
---


# Generative Routing Gates - Framework Standard

**Status:** Active Implementation
**Created:** 2026-01-22
**Purpose:** Systematic, enforceable routing gates at every framework entry point

---

## Vision

**Every interaction with the IA Framework follows this flow:**

```
User Input (vague/casual)
    ↓
Intent Enrichment (Haiku adds explicit requirements)
    ↓
Routing Gate (forceful, visual, at entry point)
    ↓
Agent Execution (receives complete, clear instructions)
```

**Cost:** ~$0.0003 per request
**Value:** Zero ambiguous delegations, complete context, enforced quality standards

---

## The Standard

### 1. Three-Layer Architecture

**Layer 1: Framework (CLAUDE.md)**
- Intercepts all user requests
- Enriches via intent enrichment layer
- Routes to appropriate agent with explicit context

**Layer 2: Agent (agents/*.md)**
- Validates identity match (am I the right agent?)
- Loads appropriate skill
- Enforces agent-level quality standards

**Layer 3: Skill (skills/*/SKILL.md)**
- Final routing gate (am I the right agent for this skill?)
- Loads workflow phases
- Executes with complete context

### 2. Visual Pattern (ALL gates use this)

```markdown
> **⛔ [GATE TYPE] - READ THIS FIRST**
>
> **[Identity statement]**
>
> **[Logic check]**
>
> **[Action code]**
> ```
> [exact delegation syntax]
> ```
>
> **DO NOT:** [prohibited actions]
>
> **STOP HERE. DELEGATE NOW.**
```

**Required elements:**
- Blockquote formatting (>)
- Emoji (⛔) for attention
- Position: Lines 0-15 (before everything)
- Identity check
- Delegation code example
- Prohibition list
- Double command (STOP + DELEGATE)

### 3. Linguistic Force

**Required language patterns:**
- Commands: "STOP", "DELEGATE NOW", "READ THIS FIRST"
- Imperatives: "DO NOT", "MUST", "NEVER"
- Identity checks: "If you are NOT the X agent"
- Explicit code: Exact Task() syntax

**Prohibited language:**
- Suggestions: "should", "could", "might want to"
- Passive voice: "delegation can happen"
- Vague references: "see documentation"

### 4. Generated, Not Handwritten

**ALL routing gates generated using:**
```bash
bun run tools/generators/routing-gate-generator.ts \
  --type [framework|agent|skill] \
  --target [file path] \
  --context [requirements]
```

**Process:**
1. Load template for gate type
2. Send to Haiku with context
3. QA validate against rules
4. Integrate (replace lines 0-15)

**NEVER handwrite routing gates.** They drift over time.

### 5. Validated Against Standards

**Pre-commit validation:**
```bash
hooks/pre-commit/validate-routing-gates.ts
```

**Checks:**
- Visual pattern present (blockquote + emoji)
- Position correct (lines 0-15)
- Required language present (STOP, DELEGATE NOW)
- Identity check present
- Delegation code syntactically correct
- Prohibition list present

**Exit code 2 = BLOCKED** if validation fails.

---

## Intent Enrichment Layer

### Architecture

**File:** `tools/orchestration/intent-enricher.ts` *(planned — not yet implemented)*

**Function:**
```typescript
async function enrichUserIntent(
  userRequest: string,
  context: SessionContext
): Promise<EnrichedPrompt> {
  // 1. Detect intent
  const intent = detectIntent(userRequest);

  // 2. Load requirements
  const requirements = loadIntentRequirements(intent);

  // 3. Check for missing context
  const missing = findMissingContext(userRequest, requirements);

  // 4. Send to Haiku for enrichment
  const enriched = await haikuEnrich({
    userRequest,
    intent,
    requirements,
    missing
  });

  // 5. Return explicit prompt
  return {
    agent: enriched.agent,
    skill: enriched.skill,
    prompt: enriched.explicitPrompt,
    missingContext: enriched.clarificationsNeeded
  };
}
```

### Intent Requirements Database

**Location:** `docs/guides/intent-requirements/*.json`

**Example:** `docs/guides/intent-requirements/blog-writing.json`
```json
{
  "intent": "blog-writing",
  "agent": "writer",
  "skill": "write",
  "triggers": ["write", "blog", "post", "article", "content"],
  "required_context": [
    "topic",
    "target_audience",
    "word_count_range",
    "research_sources_minimum",
    "qa_threshold",
    "output_location"
  ],
  "workflow_phases": [
    "research",
    "outline",
    "draft",
    "review",
    "publish"
  ],
  "quality_gates": {
    "research_sources": 10,
    "qa_rating": 4.0,
    "word_count_min": 1500
  },
  "default_output": "skills/ghost/output/posts/",
  "cost_estimate": "haiku"
}
```

**Core intents to define:**
1. `blog-writing.json` - Content creation
2. `security-testing.json` - Pentests, vuln scans
3. `career-analysis.json` - Job applications
4. `compliance-assessment.json` - Framework audits
5. `infrastructure-implementation.json` - Remediation, hardening

---

## Implementation Plan

### Phase 1: Templates & Architecture (Today)

**1a. Create Routing Gate Templates**
- `docs/templates/framework-routing-gate-template.md`
- `docs/templates/agent-routing-gate-template.md`
- `docs/templates/skill-routing-gate-template.md`

**1b. Create Intent Requirements**
- 5 core intent-requirements JSON files
- Validation schema for intent requirements

**1c. Build Intent Enricher**
- `tools/orchestration/intent-enricher.ts` *(planned)*
- Intent detection logic
- Haiku enrichment integration

### Phase 2: Generation & Validation (Tomorrow)

**2a. Build Routing Gate Generator**
- `tools/generators/routing-gate-generator.ts`
- Uses Haiku with templates
- QA validation integration

**2b. Create Validation Rules**
- `docs/guides/validation-rules/routing-gate-rules.json`
- Visual pattern checks
- Linguistic force checks
- Position checks

**2c. Build Validator**
- `tools/validation/validate-routing-gates.ts`
- Pre-commit hook integration
- Health check integration

### Phase 3: Systematic Application (Day 3)

**3a. Generate All Gates**
```bash
# Framework
bun run tools/generators/routing-gate-generator.ts --type framework --target CLAUDE.md

# Agents (5 files)
for agent in security writer engineer advisor legal; do
  bun run tools/generators/routing-gate-generator.ts --type agent --target agents/$agent.md
done

# Skills (18 files)
for skill in skills/*/SKILL.md; do
  bun run tools/generators/routing-gate-generator.ts --type skill --target $skill
done
```

**3b. Validate All Gates**
```bash
bun run tools/validation/validate-routing-gates.ts --all
```

**3c. Test End-to-End**
- User: "Write a blog post" → enriched → routed
- User: "Run security test" → enriched → routed
- User: "Help with job" → enriched → routed

### Phase 4: Documentation & Enforcement (Day 4)

**4a. Update Documentation**
- Update `docs/architecture/agent-routing-architecture.md`
- Update `docs/templates/SKILL-TEMPLATE.md`
- Update `/create` to generate routing gates

**4b. Add to Health Check**
- Validate all routing gates present
- Validate all gates match standard
- Report drift

**4c. Pre-commit Hook**
- Block commits with invalid routing gates
- Block commits with missing routing gates
- Block manual edits to routing gates

---

## Cost Analysis

### Per-Request Cost

**Intent enrichment:**
- Input: ~150 tokens (user request + requirements)
- Output: ~300 tokens (enriched prompt)
- Model: Haiku
- Cost: **$0.0003 per request**

**Annual cost (1000 requests/month):**
- 12,000 requests × $0.0003 = **$3.60/year**

### Generation Cost

**One-time generation (24 routing gates):**
- 24 gates × 200 tokens each × $0.25/1M = **$0.0012**
- **Less than a penny** to generate all gates

**Regeneration (when standard changes):**
- Same cost: $0.0012
- Can regenerate unlimited times for negligible cost

---

## Success Metrics

### Quantitative

1. **Routing accuracy:** 100% of requests reach correct agent
2. **Clarification loops:** Reduced from ~40% to <5%
3. **Complete context:** 100% of delegations include full requirements
4. **Drift incidents:** 0 (validated pre-commit)
5. **Generation cost:** <$5/year for 1000 requests/month

### Qualitative

1. **User experience:** Can use casual language, system handles precision
2. **Agent efficiency:** Receives clear instructions, executes immediately
3. **Maintainability:** Update standard once, regenerate all gates in minutes
4. **Consistency:** All 24 entry points use identical pattern
5. **Scalability:** Scales to 100+ skills without additional effort

---

## Related Documentation

- `docs/prompt-generation-workflow.md` - Haiku generation pattern
- `docs/templates/routing-gate-template.md` - Gate templates
- `docs/guides/intent-requirements/` - Intent requirements database
- `tools/orchestration/intent-enricher.ts` - Enrichment implementation *(planned)*
- `tools/generators/routing-gate-generator.ts` - Gate generator

---

## Enforcement

**This is now THE STANDARD for the IA Framework.**

1. **All new skills MUST have generated routing gates**
2. **All routing gates MUST be validated pre-commit**
3. **Manual edits to routing gates are BLOCKED**
4. **Routing gates MUST be regenerated when standard updates**
5. **Health check MUST validate all gates match standard**

**Violation = commit blocked, health check fails.**

---

**Version:** 1.0.0
**Status:** Active Implementation
**Last Updated:** 2026-01-22
**Framework:** Intelligence Adjacent (IA)
