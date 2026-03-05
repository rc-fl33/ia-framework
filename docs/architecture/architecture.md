---
type: hub
title: Architecture Documentation Hub
classification: public
version: 1.0
last_updated: 2026-02-03
audience: intermediate
category: architecture
related_docs:
  - docs/catalogs/skills.md
  - docs/catalogs/agents.md
  - docs/catalogs/commands.md
---

# Architecture Documentation Hub

Central navigation for all architectural documentation about the Intelligence Adjacent Framework. Understand how the system is designed, how components interact, how routing and orchestration work, and how models are selected for optimal cost and performance.

This hub brings together documentation on framework architecture, routing strategies, model selection, validation systems, and API design. Start here if you want to understand **how the framework works internally**.

---

## Core Architecture

Foundational documentation explaining the framework's design and principles.

| Topic | Purpose |
|-------|---------|
| **[Hierarchical Context Loading](../guides/hierarchical-context-loading.md)** | How documentation and prompts are organized in layers to manage context effectively |
| **[Agent Routing Architecture](./agent-routing-architecture.md)** | Complete routing logic showing how requests flow to the right agent |
| **[Parallel Orchestration](../guides/patterns/parallel-orchestration.md)** | How multiple agents execute independently and results are collected |

---

## Routing & Discovery

How the framework discovers and routes requests to the correct handlers.

| Topic | Purpose |
|-------|---------|
| **[Generative Routing Gates Standard](../standards/generative-routing-gates-standard.md)** | Standard implementation for AI-based routing decisions |
| **[Routing Gate Usage](../guides/routing-gate-usage.md)** | Practical examples of routing gates in action |
| **[Skill Tier Integration](../guides/patterns/skill-tier-integration.md)** | How skills integrate with the three-tier model selection system |
| **[Capability-Based Tool Discovery](./capability-based-tool-discovery.md)** | Tool and skill discovery without hardcoded paths |

---

## Model Selection

Cost-optimized model selection and multi-tier orchestration.

| Topic | Purpose |
|-------|---------|
| **[QA Model Standards](../standards/qa-model-standards.md)** | Quality assurance requirements and model evaluation criteria |

---

## Validation Systems

How validation, enforcement, and quality gates work.

| Topic | Purpose |
|-------|---------|
| **[Validation System](./validation-system.md)** | Complete validation workflow from request intake to delivery |
| **[Hook Enforcement Flow](../guides/hook-enforcement-flow.md)** | Pre-commit and runtime hook system for enforcement |

---

## API & Tools

Detailed documentation on API design, capabilities, and integration.

| Topic | Purpose |
|-------|---------|
| **[API Capabilities](../reference/api-capabilities.md)** | Complete API surface area and available functions |
| **[API Error Catalog](../reference/api-error-catalog.md)** | Standardized error codes and handling |
| **[Tool Access Control](../standards/tool-access-control.md)** | How tool access is granted and restricted by context |

---

## Routing Decision Tree

Quick reference for how requests are routed:

```
User Request
    ↓
Is this basic file/git operations?
    ├─ YES → Base Claude (direct handling)
    └─ NO → Continue
        ↓
Is this specialized work?
    ├─ Security testing → security agent
    ├─ Content creation → writer agent
    ├─ Infrastructure → engineer agent
    ├─ Legal/compliance → legal agent
    └─ Career/research → advisor agent
        ↓
Are there 3+ independent tasks?
    ├─ YES → SPAWN PARALLEL AGENTS
    └─ NO → Single agent
```

---

## Key Architectural Principles

### 1. Hierarchical Context
- Level 1: CLAUDE.md (navigation, <200 lines)
- Level 2: Skill/Agent docs (<500 lines)
- Level 3: Phase/Task docs (<200 lines)
- Prevents context overload by organizing by scope

### 2. Skill-Based Modularity
- Each skill is self-contained in its own directory
- Consistent file structure across all skills
- Independent scaling and development
- Pre-commit validation of structure

### 3. Agent Specialization
- 5 domain-specific agents for complex work
- Base Claude handles orchestration and simple tasks
- Clear domain boundaries and routing rules
- Model tier selection by agent and task type

### 4. Cost Optimization
- Tier 1 (free): Quick questions, simple lookups
- Tier 2a ($7.20/1M): Full analysis and reviews
- Tier 2b ($0.70/1M): Multi-phase workflows
- OpenRouter for unified model access

### 5. Validation-First
- Pre-commit hooks prevent invalid states
- Runtime validation before API use
- Quality gates in multi-phase workflows
- Rollback capability for failed deployments

---

## MCP Server Bypass (Architectural Decision)

**Decision:** The IA framework intentionally does NOT use MCP (Model Context Protocol) servers despite Claude Code's native support for them.

**Rationale:**

1. **Process overhead** — MCP servers spawn as separate processes via npx, adding startup latency and JSON-RPC serialization overhead per call. For high-frequency tool use (dozens of API calls per session), this overhead compounds.

2. **Direct API integration is faster** — The framework uses direct TypeScript API clients (`tools/api/`) that are type-safe, debuggable, and run in-process. Example: `tools/api/context7/client.ts` provides Context7 documentation lookup without MCP overhead.

3. **Debuggability** — Direct clients produce stack traces, support breakpoints, and integrate with the framework's existing error handling. MCP servers are opaque processes that communicate via JSON-RPC, making debugging harder.

4. **Dependency control** — Direct clients use the framework's dependency management (Bun). MCP servers pull their own dependencies via npx at runtime, creating an uncontrolled dependency surface.

5. **No `.mcp.json` is intentional** — The absence of MCP configuration files is a deliberate choice, not a gap.

**What we use instead:**

| Capability | MCP Equivalent | IA Framework Approach |
|---|---|---|
| Documentation lookup | Context7 MCP server | `tools/api/context7/client.ts` (direct API) |
| Web search | Exa MCP server | `WebSearch` tool + `tools/api/` clients |
| Code search | Various MCP servers | `Grep`, `Glob` tools (built-in, zero overhead) |

**When to reconsider:** If MCP servers gain in-process execution (no separate process spawn) or if a critical capability becomes MCP-only with no API alternative.

---

## Component Interaction Diagram

```
┌─────────────────────────────────────────────────────┐
│  User Request                                        │
│  "Write a blog post and conduct security review"   │
└────────────────┬────────────────────────────────────┘
                 │
        ┌────────▼────────┐
        │  Base Claude    │
        │  (Orchestrator) │
        └────────┬────────┘
                 │
         ┌───────┴────────┐
         │                │
    ┌────▼────┐    ┌─────▼──────┐
    │  Writer │    │ Security   │
    │  Agent  │    │ Agent      │
    └────┬────┘    └─────┬──────┘
         │                │
    ┌────▼────────────────▼──────┐
    │  Phase Execution (Parallel) │
    │  - Draft phase             │
    │  - Testing phase           │
    │  - QA phase                │
    │  - Publish phase           │
    └─────────────────────────────┘
```

---

## File Organization

```
ia-framework/
├── CLAUDE.md                    # Navigation and routing rules
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   ├── GUIDES.md                # How-to documentation
│   ├── REFERENCE.md             # Reference catalogs
│   ├── INDEX.md                 # Master entry point
│   ├── hierarchical-context-loading.md
│   ├── agent-routing-architecture.md
│   └── [other architectural docs]
├── agents/
│   ├── advisor.md               # Advisor agent definition
│   ├── engineer.md              # Engineer agent definition
│   ├── security.md              # Security agent definition
│   ├── writer.md                # Writer agent definition
│   └── legal.md                 # Legal agent definition
├── skills/
│   └── [Modular skills with SKILL.md, scripts/, docs/]
├── docs/
│   ├── catalogs/
│   │   ├── skills.md            # All skills reference
│   │   ├── agents.md            # All agents reference
│   │   ├── commands.md          # All commands reference
│   │   ├── integrations.md      # External services
│   │   └── tool-catalog.md      # All tools
│   └── templates/
│       ├── doc-template.md      # Documentation template
│       ├── SKILL-TEMPLATE.md    # Skill template
│       └── agent-template.md    # Agent template
├── tools/
│   ├── api/
│   │   ├── openrouter/
│   │   ├── context7/
│   │   ├── grok/
│   │   └── [other API clients]
│   ├── export/                  # PDF/DOCX export utilities
│   └── framework/utils/         # Path resolution, utilities
└── hooks/
    └── [pre-commit and runtime validation hooks]
```

---

## Related Documentation

- **Skills Catalog:** `docs/catalogs/skills.md` - All available skills
- **Agents Catalog:** `docs/catalogs/agents.md` - Specialized agents
- **Commands Catalog:** `docs/catalogs/commands.md` - All slash commands
- **Tool Catalog:** `docs/catalogs/tool-catalog.md` - External integrations

---

**Version:** 1.0
**Last Updated:** 2026-02-03
**Framework:** Intelligence Adjacent (IA)
