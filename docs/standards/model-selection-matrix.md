---
audience: intermediate
category: architecture
---


# Model Selection Matrix

**Purpose:** Task-to-model mapping for optimal cost, speed, and quality trade-offs

**Dynamic Selection:** All model references use `tools/api/openrouter/client.ts` for latest versions

---

## Cost Optimization Philosophy

The IA Framework prioritizes cost efficiency without sacrificing quality:

**Core Principle:** Use the cheapest model capable of producing quality output for each specific task.

**Why This Matters:**
- Straight API calls (using Opus/Sonnet for all tasks) = expensive and inefficient
- Framework approach (right-sized models per task) = high quality output at a fraction of typical API costs
- Cost-efficient task-based execution, not "always on" autonomous AI

**Cost Comparison Example (Blog Post Generation):**
- Pure Sonnet workflow: ~$0.50-1.00 per post
- Tiered framework approach: ~$0.01-0.02 per post (95% savings)
- Result: Same quality, massive cost reduction

---

## Quick Reference

| Task Type | Model | Provider | Why |
|-----------|-------|----------|-----|
| **Tier 1: Routing** | Haiku 4.5 | Anthropic | Fastest, cheapest, sufficient |
| **Tier 2a: Main Work** | Sonnet 4.5 | Anthropic | Balanced performance/cost |
| **Tier 2b: Budget Alternative** | Grok 4.1 Fast | xAI | 71% cost savings vs Sonnet, 2M context |
| **Tier 2c: Premium** | Opus 4.5 | Anthropic | Frontier reasoning |
| **Tier 3: Generation** | openrouter/auto (*:free) | OpenRouter | Free, auto-rotation, failover |
| Agentic coding workflows | Grok Code | xAI | Reasoning traces visible |
| Adversarial review | Grok 3 | xAI | Challenge assumptions |
| OSINT, real-time research | Perplexity Sonar | Perplexity | Current events, citations |

---

## Three-Tier Architecture

The IA Framework uses a three-tier model selection strategy for optimal cost/quality balance:

### Tier 1: Routing & Simple Operations
**Model:** Haiku 4.5 (Anthropic)
**Cost:** $ (cheapest paid model)
**Use Cases:**
- File operations and folder creation
- Template application
- Format validation and linting
- Routing decisions
- Checklist execution
- Simple transformations

### Tier 2: Main Work & Execution

**Tier 2a: Default (Sonnet 4.5)**
**Cost:** $$ (moderate)
- Day-to-day coding
- Standard workflows and agents
- Documentation writing
- Code reviews
- Analysis tasks
- Research synthesis

**Tier 2b: Budget Alternative (Grok 4.1 Fast)**
**Cost:** $ (budget - 71% cheaper than Sonnet)
- Deep research tasks
- Tool calling and agentic workflows
- Large context requirements (2M tokens)
- Cost-sensitive projects
- Research synthesis

**Tier 2c: Premium (Opus 4.5)**
**Cost:** $$$$ (premium)
- Novel architecture decisions
- Complex problem solving
- Deep security analysis
- Multi-file refactoring
- Strategic planning

### Tier 3: Generation & Drafts
**Model:** Free model rotation (Google Gemma, NVIDIA Nemotron, Mistral Small)
**Cost:** FREE ($0.00)
**Use Cases:**
- Draft generation (content, code, docs)
- Boilerplate code
- Template-based content
- Simple queries
- Multiple variations
- High-volume low-complexity tasks

**Implementation:**
```typescript
// Tier 3 configuration with privacy enforcement
const tier3Models = [
  "google/gemma-3-27b-it:free",           // Primary (100% win rate, 1544ms)
  "nvidia/nemotron-3-nano-30b-a3b:free",  // Fallback 1 (5/5 QA, 1711ms)
  "mistralai/mistral-small-3.1-24b-instruct:free"  // Fallback 2 (5/5 QA, 2265ms)
];

{
  model: tier3Models[0],  // Or implement rotation/fallback logic
  provider: {
    zdr: true,                      // Zero Data Retention (no storage, no training)
    require_parameters: true,
    data_collection: "deny",        // No data collection
    allow_fallbacks: true           // Failover to other ZDR providers
  }
}
```

**Security:** All requests must enforce Zero Data Retention (ZDR) to prevent model training on framework data. See `./openrouter-security-config.md` for complete privacy configuration.

**Workflow Example:**
```
User Request → Sonnet (Tier 2)
               ↓
    Generates 3 draft variations → openrouter/auto (Tier 3)
               ↓
    Reviews drafts for quality → Haiku (Tier 1)
               ↓
    Selects best draft → Sonnet (Tier 2)
```

**Why This Works:**
- Tier 3 does bulk generation work (free, fast)
- Tier 1 validates structure/format (cheap, reliable)
- Tier 2 makes final decisions (quality, reasoning)
- **Total Cost:** Minimal (only Tier 1 & 2 have costs)

---

## Model Profiles

### Anthropic: Claude Haiku 4.5

**Strengths:**
- Fastest response time
- Most cost-efficient
- Near-frontier intelligence (matches Sonnet 4 on many tasks)
- Extended thinking capability
- Excellent for sub-agents and parallel execution

**Best For:**
- File organization and folder creation
- Template application
- Format validation and linting
- Routing decisions
- Checklist execution
- Simple transformations
- High-volume operations
- Sub-agents in multi-agent workflows

**Not For:**
- Novel problem solving
- Complex architecture decisions
- Deep reasoning chains

**Cost:** $ (cheapest)
**Speed:** ⚡⚡⚡ (fastest)
**Context:** 200K tokens

---

### Anthropic: Claude Sonnet 4.5

**Strengths:**
- State-of-the-art coding (72.7% SWE-bench)
- Autonomous codebase navigation
- Strong tool orchestration
- Extended context (1M tokens)
- Balanced capability/efficiency

**Best For:**
- Day-to-day code writing
- Standard workflows and agents
- Documentation writing
- Code reviews (medium complexity)
- Analysis tasks
- Research synthesis
- Multi-context workflows
- Most skill/agent work

**Not For:**
- Extremely complex novel problems
- When speed is critical (use Haiku)
- When deep reasoning needed (use Opus)

**Cost:** $$ (moderate)
**Speed:** ⚡⚡ (fast)
**Context:** 1M tokens

---

### Anthropic: Claude Opus 4.5

**Strengths:**
- Frontier reasoning model
- Long-horizon tasks (hours of continuous operation)
- Complex software engineering
- Multimodal capabilities
- Improved robustness to prompt injection

**Best For:**
- Novel problem solving
- Complex architecture decisions
- Deep security analysis
- Multi-file refactoring
- Strategic planning
- Autonomous research
- Extended thinking tasks
- Multi-step planning

**Not For:**
- Simple operations (wasteful)
- High-volume tasks (expensive)
- When speed matters

**Cost:** $$$$ (most expensive)
**Speed:** ⚡ (slower)
**Context:** 200K tokens

**Usage Pattern:** Use sparingly for tasks that genuinely need frontier reasoning

---

### xAI: Grok Code Fast 1

**Strengths:**
- Speedy agentic coding
- Reasoning traces visible in response
- Economical for coding tasks
- Developer can steer workflows

**Best For:**
- Code generation with reasoning
- Security code review (explains WHY code is vulnerable)
- Debugging with explanation
- Technical problem solving
- When reasoning trace visibility needed
- Agentic coding workflows
- Educational code reviews

**Not For:**
- Non-coding tasks
- When reasoning traces not needed
- Simple format checks (use Haiku)

**Cost:** $$ (moderate)
**Speed:** ⚡⚡ (fast)
**Context:** 256K tokens

---

### xAI: Grok 4.1 Fast

**Strengths:**
- Best agentic tool calling
- 2M context window (largest)
- Excels at customer support simulation
- Deep research capabilities
- Can enable/disable reasoning

**Best For:**
- Deep research tasks
- Agentic workflows with many tool calls
- Customer support scenarios
- Large context requirements
- Real-world use cases

**Not For:**
- Simple tasks (overkill)
- When cost matters

**Cost:** $$ (moderate)
**Speed:** ⚡⚡ (fast)
**Context:** 2M tokens

---

### xAI: Grok 3 / Grok 3 Mini

**Strengths:**
- Thinking before responding
- Raw thinking traces accessible
- Logic-based reasoning
- Contrarian perspectives

**Best For:**
- Adversarial review (QA)
- Challenge assumptions
- Logic validation
- Detect hallucinations
- Contrarian perspectives

**Not For:**
- Coding (use Grok Code)
- Research (use Grok 4.1 or Perplexity)

**Cost:** $ (cheap)
**Speed:** ⚡⚡⚡ (fast)
**Context:** 131K tokens

---

### Perplexity: Sonar-Pro

**Strengths:**
- Real-time web search
- Automatic citations
- Current events knowledge
- Up-to-date information

**Best For:**
- OSINT research
- Current events analysis
- Citation-heavy work
- Real-time data needs
- Market research

**Not For:**
- Coding tasks
- Tasks not requiring real-time data
- Deep reasoning without web access

**Cost:** $$ (moderate)
**Speed:** ⚡⚡ (fast, depends on search)
**Context:** Varies

---

### Tier 3: Free Models via OpenRouter Auto-Router

**Strategy:** Use OpenRouter's auto-router with all free models for zero-cost generation work

**Model ID:** `openrouter/auto` with `allowed_models: ["*:free"]`

**Strengths:**
- Completely free (zero cost for Tier 3 workloads)
- Production-grade quality for structured tasks
- Automatic rotation across all free models
- Built-in failover if one model is rate-limited
- No maintenance when new free models appear
- Smart selection based on prompt characteristics

**Known Free Models:**
- **Google Gemma 3 27B** (`google/gemma-3-27b-it:free`) - Strong general-purpose performance
- **NVIDIA Nemotron 3 Nano 30B** (`nvidia/nemotron-3-nano-30b-a3b:free`)
- **Mistral Small 3.1 24B** (`mistralai/mistral-small-3.1-24b-instruct:free`)

**Additional Free Models Available:**
- Meta Llama variants (3.2 3B Instruct, etc.)
- Qwen 2.5 variants (7B Instruct, etc.)
- Microsoft Phi models
- Other free models as they become available via OpenRouter

**Best For:**
- Simple queries and explanations
- Boilerplate code generation
- Standard documentation
- Template-based content
- Draft generation (QA'd by Haiku/Grok)
- High-volume low-complexity tasks
- Budget-conscious applications

**Not For:**
- Complex reasoning (use Sonnet/Opus)
- Novel problem solving (use Opus)
- When frontier capabilities needed
- Critical production code (use Sonnet)

**Cost:** FREE ($0.00)
**Speed:** ⚡⚡⚡ (very fast)
**Context:** Varies by selected model

**Usage Pattern:** Default for Tier 3 in multi-tier routing. Free models are suitable for structured tasks but lack rigorous quality differentiation vs frontier models (heuristic QA cannot measure reasoning depth).

**Configuration:**
```json
{
  "model": "google/gemma-3-27b-it:free",
  "messages": [...],
  "provider": {
    "zdr": true,                      // Zero Data Retention (CRITICAL)
    "require_parameters": true,
    "data_collection": "deny",        // No data collection
    "allow_fallbacks": true           // Failover to other ZDR providers
  }
}
```

**Why Manual Selection Instead of Auto-Router:**
- OpenRouter auto-router only includes paid models (no `:free` variants)
- Manual rotation gives us explicit control over privacy settings
- We tested and validated these specific free models
- Simpler implementation with known behavior
- Zero cost guarantee (auto-router could route to paid models)

**Privacy Enforcement (CRITICAL):**
- ✅ Enable ZDR in OpenRouter account settings (one-time)
- ✅ Include `zdr: true` in every API request
- ❌ NEVER enable prompt logging (1% discount not worth privacy loss)
- ✅ Verify free models are ZDR-compatible before use
- See `./openrouter-security-config.md` for complete setup

---

## Information Retrieval Tools

Tools for documentation lookup and web research. Choose based on content type.

### Context7

**Purpose:** Programming library/framework documentation
**Wrapper:** `tools/api/context7/` (TypeScript SDK)
**Functions:** `searchLibrary()`, `getContext()`, `searchAndGetContext()`

**Best For:**
- Library API references (requests, fastapi, react, next.js)
- Code examples from official documentation
- Version-specific docs (e.g., `/vercel/next.js/v15.0.0`)
- Fast-moving frameworks (Next.js, React, Tailwind, Zod)

**Key Value:** Prevents LLM hallucination of outdated APIs

**Not For:**
- Security frameworks (NIST, CIS, OWASP)
- Real-time news/events
- General web research

**Cost:** $ (cheapest - API call only)
**Token Efficiency:** 85-97% reduction with minimal mode

---

### Information Retrieval Decision Tree

```
Need external information?
  ↓
Is it library/framework documentation?
  ├─ YES → Context7 (cheapest, prevents hallucination)
  └─ NO → Continue
      ↓
Do you have a specific URL?
  ├─ YES → WebFetch
  └─ NO → Continue
      ↓
Need real-time data or news?
  ├─ YES → WebSearch (current events)
  └─ NO → Continue
      ↓
Need citations or deep OSINT?
  ├─ YES → Perplexity Sonar-Pro
  └─ NO → Continue
      ↓
Need 2M+ context or agentic tools?
  ├─ YES → Grok 4.1 Fast
  └─ NO → WebSearch (general)
```

### Tool Comparison

| Tool | Use Case | Cost | Best For |
|------|----------|------|----------|
| Context7 | Library docs | $ | Code examples, API references |
| WebFetch | Specific URL | $ | Known webpage analysis |
| WebSearch | Web queries | $$ | Current events, general info |
| Perplexity | Deep OSINT | $$ | Citations, research |
| Grok 4.1 | Large context | $$ | Tool calling, 2M+ docs |

---

## Task-Based Selection Guide

### File Operations
**Model:** Haiku 4.5
**Why:** Fast, cheap, more than sufficient

**Examples:**
- Create folder structure
- Organize files
- Apply templates
- Format code

---

### Coding - Standard
**Model:** Sonnet 4.5
**Why:** Best coding performance, balanced cost

**Examples:**
- Write new functions
- Refactor code
- Fix bugs
- Code reviews

**Upgrade to Opus when:**
- Novel architecture needed
- Multi-file complex refactoring
- Strategic design decisions

**Downgrade to Haiku when:**
- Template code
- Simple transformations
- Format fixes

---

### Coding - With Reasoning Traces
**Model:** Grok Code Fast 1
**Why:** Visible reasoning, helps understand decisions

**Examples:**
- Security code review (shows WHY vulnerable)
- Complex debugging
- Learning-focused coding
- When explanation needed
- Agentic coding workflows
- Vulnerability analysis with reasoning

---

### Analysis - Security
**Model:** Sonnet 4.5 (standard) → Opus 4.5 (novel)
**Why:** Sonnet for known patterns, Opus for novel threats

**Examples:**
- Standard vuln assessment → Sonnet
- Novel attack research → Opus
- Threat modeling (complex) → Opus
- Code security review → Sonnet

---

### Research - OSINT
**Model:** Perplexity Sonar-Pro (primary) + Grok 4.1 Fast (secondary)
**Why:** Perplexity for citations, Grok for depth

**Examples:**
- Company research
- Threat intelligence
- Market analysis
- Competitor analysis

**Pattern:** Dual-source (Perplexity + Grok) for cross-validation

---

### QA Review
**Methodology:** Verification-first, then dual-model review
**Why:** Models have knowledge cutoffs - verify facts BEFORE asking models to review

**Phase 0 - Verification (BEFORE models):**
- WebSearch/Context7/OSINT for factual claims
- NVD/MITRE APIs for CVE/CWE validation
- Perplexity for citation research

**Phases 1-2 - Model Review (AFTER verification):**
- **Haiku 4.5** (structured) - Checklists, standards, completeness
- **Grok 3** (adversarial) - Logic gaps, reasoning errors (NOT facts - already verified)

**Examples:**
- Report validation → Verify claims → Haiku (completeness) + Grok (logic)
- Code review → Verify CVEs/APIs → Haiku (standards) + Grok (reasoning)
- Blog posts → Verify URLs/APIs → Haiku (structure) + Grok (clarity)

---

### Writing - Content
**Model:** Sonnet 4.5 (drafting) + Perplexity (research)
**Why:** Sonnet for quality writing, Perplexity for research

**Examples:**
- Blog posts: Perplexity (research) → Sonnet (write)
- Documentation: Sonnet (write)
- Reports: Sonnet (write) + Haiku (QA)

---

### Architecture & Planning
**Model:** Opus 4.5
**Why:** Needs frontier reasoning, strategic thinking

**Examples:**
- System architecture design
- Technology stack decisions
- Security architecture
- Long-term planning

**Cost Justification:** One-time decisions with long-term impact

---

## Cost Optimization Strategies

### 1. Right-Size by Default
- **Default to Sonnet** for uncertain tasks
- **Upgrade to Opus** only when needed
- **Downgrade to Haiku** for simple operations

### 2. Multi-Model Workflows
- Use Haiku for routing/triage
- Use Sonnet for main work
- Use Opus for complex decisions
- Example: Haiku routes task → Sonnet executes → Opus for novel issues

### 3. Parallel Sub-Agents
- Spawn multiple Haiku instances for parallel work
- Cheaper than one Sonnet doing sequential work
- Use for embarrassingly parallel tasks

### 4. Research Dual-Source
- Perplexity for breadth (citations)
- Grok for depth (analysis)
- Cross-validate findings

---

## Model Selection Decision Tree

```
START
  ↓
Is task novel/complex?
  ├─ YES → Opus 4.5
  └─ NO → Continue
      ↓
Does task need real-time web data?
  ├─ YES → Perplexity Sonar-Pro
  └─ NO → Continue
      ↓
Is this adversarial/challenging task?
  ├─ YES → Grok 3
  └─ NO → Continue
      ↓
Does task need coding with reasoning traces?
  ├─ YES → Grok Code Fast 1
  └─ NO → Continue
      ↓
Is task simple/template/formatting?
  ├─ YES → Haiku 4.5
  └─ NO → Sonnet 4.5 (default)
```

---

## Skill-Specific Recommendations

### security-testing
- **Recon:** Perplexity (OSINT)
- **Testing:** Sonnet (standard) / Opus (novel)
- **Reporting:** Sonnet (write) + Haiku (QA)

### writer
- **Research:** Perplexity (depth research)
- **Drafting:** Sonnet (write)
- **QA:** Verification-first (WebSearch URLs, Context7 APIs) → Haiku (structured) + Grok (logic)

### code-review
- **Format Checks:** Haiku (fast validation)
- **Security Review:** Grok Code Fast 1 (reasoning traces explain WHY vulnerable)
- **Logic Review:** Sonnet (complexity analysis)
- **Architecture:** Opus (design patterns)

**Why Grok Code for security:** Visible reasoning traces show step-by-step vulnerability explanation - helps understand attack vectors and remediation logic

### architecture-review
- **Threat Modeling:** Opus (complex reasoning)
- **Standards Validation:** Haiku (checklist)
- **Report Writing:** Sonnet (documentation)

### osint-research
- **Fast Mode:** Perplexity only
- **Deep Mode:** Perplexity + Grok 4.1 Fast (cross-validation)

### qa-review
- **Structured Review:** Haiku (checklists, standards)
- **Adversarial Review:** Grok 3 (challenge assumptions)
- **Cross-Validation:** Human (conflicts)

---

## Implementation

**Dynamic Selection:**
```python
from skills.security.scripts.openrouter import get_latest_model

# Get latest model by provider
haiku = get_latest_model("anthropic", prefer_keywords=["haiku"])
sonnet = get_latest_model("anthropic", prefer_keywords=["sonnet"])
opus = get_latest_model("anthropic", prefer_keywords=["opus"])
grok_code = get_latest_model("x-ai", prefer_keywords=["code"])
grok = get_latest_model("x-ai")
perplexity = get_latest_model("perplexity", prefer_keywords=["sonar"])
```

**In Skills/Agents:**
```markdown
## Model Selection

**Default:** Latest Sonnet
**Upgrade to Opus when:** Novel problem, complex architecture, strategic planning
**Downgrade to Haiku when:** Templates, formatting, routing, checklists
```

---

## OpenRouter Automatic Routing

OpenRouter provides intelligent routing features to automatically select optimal models and providers.

### Auto Router (`openrouter/auto`)

**Purpose:** Let OpenRouter's AI-powered router (NotDiamond) select the best model for your prompt

**Model ID:** `openrouter/auto`

**How it works:**
- Analyzes prompt complexity, task type, and requirements
- Routes to curated high-quality models (Claude, GPT, Gemini, DeepSeek, etc.)
- No additional fees - you pay the standard rate of the selected model
- Response includes metadata showing which model was chosen

**Example API Call:**
```json
{
  "model": "openrouter/auto",
  "messages": [
    {"role": "user", "content": "Explain quantum entanglement"}
  ]
}
```

**Response includes selected model:**
```json
{
  "model": "x-ai/grok-4.1-fast",
  "choices": [...]
}
```

---

### Restricting Auto-Router Models

Use the `plugins` parameter to limit which models the auto-router can select:

**Restrict to Anthropic only:**
```json
{
  "model": "openrouter/auto",
  "messages": [...],
  "plugins": [
    {
      "id": "auto-router",
      "allowed_models": ["anthropic/*"]
    }
  ]
}
```

**Restrict to specific model families:**
```json
{
  "model": "openrouter/auto",
  "plugins": [
    {
      "id": "auto-router",
      "allowed_models": [
        "anthropic/*",           // All Anthropic models
        "openai/gpt-5*",         // GPT-5 variants
        "google/gemini-3*"       // Gemini 3 models
      ]
    }
  ]
}
```

**Exact model restrictions:**
```json
{
  "model": "openrouter/auto",
  "plugins": [
    {
      "id": "auto-router",
      "allowed_models": [
        "x-ai/grok-4.1-fast",
        "x-ai/grok-code-fast-1",
        "google/gemini-2.0-flash-001"
      ]
    }
  ]
}
```

---

### Provider Routing & Preferences

**Default Behavior:** Price-based load balancing (inverse square weighting)
- Provider at $1/M tokens is 9x more likely than $3/M tokens provider
- Automatically routes across multiple providers for the same model

**Provider Preference Configuration:**
```json
{
  "model": "x-ai/grok-4.1-fast",
  "messages": [...],
  "provider": {
    "order": ["xai", "aws"],        // Prioritize official provider first
    "sort": "price",                       // Options: "price", "throughput", "latency"
    "allow_fallbacks": true,               // Enable backup providers (default)
    "require_parameters": true,            // Only route to providers supporting all params
    "data_collection": "deny"              // Restrict to providers with no data collection
  }
}
```

**Common Provider Preferences:**

| Preference | Value | Use Case |
|------------|-------|----------|
| `sort: "price"` | Sort by cheapest | Cost optimization |
| `sort: "throughput"` | Sort by tokens/sec | High-volume tasks |
| `sort: "latency"` | Sort by response time | Real-time applications |
| `order: ["anthropic"]` | Prioritize official | Best reliability |
| `data_collection: "deny"` | No data collection | Privacy compliance |
| `zdr: true` | Zero Data Retention only | Maximum privacy |

**Shortcuts:**
- `:nitro` suffix = high throughput (e.g., `x-ai/grok-4.1-fast:nitro`)
- `:floor` suffix = lowest price (e.g., `google/gemini-2.0-flash-001:floor`)

---

### Framework Recommendations

**For IA Framework, we recommend:**

1. **Tier 1 & 2: Use specific model IDs** (not auto-router)
   - We've already mapped tasks to optimal models in this matrix
   - Explicit selection provides predictable costs and behavior
   - Tier 1: Haiku 4.5 (routing, simple ops)
   - Tier 2: Sonnet 4.5 (main work) or Opus 4.5 (novel problems)

2. **Tier 3: Use `openrouter/auto` with `*:free`**
   - Automatic rotation across all free models
   - Zero cost with production-grade quality (validated)
   - Built-in failover and smart selection
   - Configuration:
   ```json
   {
     "model": "openrouter/auto",
     "plugins": [{
       "id": "auto-router",
       "allowed_models": ["*:free"]  // All free models only
     }],
     "provider": {
       "sort": "throughput",
       "allow_fallbacks": true
     }
   }
   ```

3. **Provider preferences for Tier 1 & 2 (Anthropic models):**
   ```json
   {
     "provider": {
       "order": ["anthropic"],           // Prefer official Anthropic
       "sort": "latency",                // Fast response for CLI
       "data_collection": "deny",        // Privacy-first
       "require_parameters": true        // Ensure compatibility
     }
   }
   ```

4. **When to use broader auto-router config** (`anthropic/*, openai/gpt-4o, google/*`):
   - User-facing applications where prompt variety is high
   - Prototyping/testing when unsure which model fits best
   - Applications needing cross-model validation
   - **Not recommended for framework internal tooling** (use Tier 1/2/3 strategy)

---

## Automated ZDR Model Ranking

The framework includes an automated ranking tool that aggregates external benchmarks with OpenRouter's ZDR endpoint to produce a ranked, privacy-safe model list.

**Tool:** `tools/model-ranker/scripts/`

**What it does:**
- Fetches ZDR-eligible models from OpenRouter (live endpoint data with latency/throughput)
- Cross-references with LMArena ELO ratings and Artificial Analysis benchmarks
- Applies US-only policy filter (blocks non-US model providers)
- Excludes Claude models (use Anthropic native SDK)
- Scores and ranks by configurable weight profiles

**Usage:**
```bash
# Full refresh — fetch all sources, rank, cache results
bun tools/model-ranker/scripts/refresh.ts

# Show top 10 for security work
bun tools/model-ranker/scripts/refresh.ts --top 10 --profile security-interactive

# Cost-optimized ranking for batch scanning
bun tools/model-ranker/scripts/refresh.ts --profile batch-scanning

# Check if cached rankings are still fresh
bun tools/model-ranker/scripts/refresh.ts --status
```

**Weight Profiles:**

| Profile | Best For | Emphasis |
|---------|----------|----------|
| `security-interactive` | Real-time security testing | Coding quality (35%), reasoning (25%) |
| `batch-scanning` | High-volume automated scans | Cost efficiency (40%) |
| `deep-analysis` | Complex threat analysis | Reasoning quality (40%), context (20%) |

**Programmatic access:**
```typescript
import { getTopModels, refreshRankings } from '@/tools/model-ranker/scripts/client';

const top5 = await getTopModels({ count: 5, profile: 'security-interactive' });
```

Cache is file-based (7-day TTL). `getTopModels()` reads from cache only — no surprise network calls.

See `tools/model-ranker/scripts/README.md` for full documentation.

---

**Version:** 1.3
**Last Updated:** 2026-02-11
**Dynamic Selection:** OpenRouter API via `tools/api/openrouter/client.ts`
**Automated Ranking:** `tools/model-ranker/scripts/` (ZDR-filtered, benchmark-aggregated)
**Information Retrieval:** Context7 (library docs) + WebSearch/Perplexity (research)
