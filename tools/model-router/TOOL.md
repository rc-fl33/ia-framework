---
name: model-router
type: utility
classification: public
description: Security research query router - selects the optimal LLM (Claude or Grok) via OpenRouter based on query type
version: 1.0
last_updated: 2026-02-17
env_required: true
env_keys:
  - OPENROUTER_API_KEY
commands:
  - /model-router
---

> **FOR AI AGENTS:** Routes security research queries to the best LLM via OpenRouter based on task type.
> Load when: A security research query needs to be routed to Claude or Grok via the RSA prompt methodology.

# Model Router

**Routes security research queries to the optimal LLM based on task characteristics**

Implements intelligent routing logic for six security research query types, selecting between Claude (structured CVE analysis, exploitation, defense) and Grok (social media research, brainstorming, stuck mode). Builds RSA-methodology prompts and executes via OpenRouter.

---

## Purpose

Different security research tasks have different optimal models:

- **CVE/structured research** → Claude (analytical, structured database queries)
- **Novel techniques** → Claude (comprehensive web research synthesis)
- **Social media research** → Grok (native X access, real-time discussions)
- **Exploitation technique** → Claude (technical mechanics, detection)
- **Stuck mode** → Grok (less restrictive, creative brainstorming)
- **Detection/defense** → Claude (structured defensive analysis)

**Why it exists:** A security agent running multiple research queries wastes time and money sending everything to one model. This router selects the right tool for each query type, improving result quality.

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/pentest/workflows/phases/prompts/02-INTELLIGENCE-GATHERING.md` — referenced as research routing tool
- `skills/pentest/workflows/phases/prompts/05-EXPLOITATION.md` — referenced for stuck-mode routing

*(No direct TypeScript imports — invoked via CLI from security workflow prompts)*

---

## Commands

### /model-router

Route a security research query to the optimal LLM.

```bash
bun run tools/model-router/model-router.ts \
  --query-type cve-research \
  --task "Find exploits for CVE-2024-12345" \
  --tech-stack "Next.js 14.0" \
  --engagement-dir ./pentests/target-2026-02
```

**Query Types:**
- `cve-research` — CVE and vulnerability research (Claude)
- `novel-techniques` — Emerging attack techniques (Claude)
- `social-research` — X/Twitter security discussions (Grok)
- `exploitation-technique` — Technical exploitation details (Claude)
- `stuck-mode` — Brainstorm alternatives when test fails (Grok)
- `detection-defense` — Detection rules and defensive techniques (Claude)

---

## Usage

```bash
# Research CVE exploitation
bun run tools/model-router/model-router.ts \
  --query-type cve-research \
  --task "What's the exploitation mechanism for CVE-2024-12345?" \
  --tech-stack "Next.js 14.0"

# Stuck mode - need new ideas
bun run tools/model-router/model-router.ts \
  --query-type stuck-mode \
  --task "SQL injection tests failed, what alternatives?" \
  --tech-stack "MySQL backend with WAF"

# Social media research (routes to Grok)
bun run tools/model-router/model-router.ts \
  --query-type social-research \
  --task "What are researchers discussing about GraphQL vulnerabilities?"
```

```typescript
import { routeQuery, buildSecurityPrompt } from '@/tools/model-router/model-router';

const context = {
  queryType: 'cve-research',
  task: 'Find JWT authentication vulnerabilities',
  technologyStack: 'Node.js + Express'
};

const recommendation = routeQuery(context);
// { model: 'Claude', modelId: 'claude-3-5-sonnet-20241022', ... }

const prompt = buildSecurityPrompt(context, recommendation);
// RSA-methodology prompt ready for OpenRouter
```

---

## File Structure

```
tools/model-router/
├── model-router.ts    # Query router + RSA prompt builder + CLI
└── TOOL.md            # This file
```

---

## Configuration

| Variable | Required | Description |
|---|---|---|
| OPENROUTER_API_KEY | Yes | OpenRouter API key for LLM execution |

---

## Dependencies

**Runtime:** Bun, child_process, fs
**Used by:** Security skill research phases (via CLI)

---

## Related Tools

- **tools/openrouter** - Underlying LLM API client
- **tools/research** - Multi-API orchestrator (uses model-router for LLM synthesis)

---

**Framework:** Intelligence Adjacent (IA)
