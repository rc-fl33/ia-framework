---
audience: intermediate
category: architecture
related_docs:
---


# Skill-Tier Integration

**Purpose:** Maps skills to model tiers based on complexity, cost optimization, and task requirements


---

## Skill Routing by Tier

The IA Framework uses a **three-tier model architecture** where skills are mapped to appropriate model tiers based on task complexity:

### Tier 1: Routing & Simple Operations (Haiku 4.5)
**Cost:** $ (cheapest)
**Skills:**
- File operations and template application
- Simple checklist execution
- Format validation
- Quick status checks

### Tier 2: Main Work & Execution (Sonnet 4.5 default)
**Cost:** $$ (moderate)
**Skills:**
- `/career`, `/clifton`, `/mentorship` - Career analysis
- `/compliance` - Compliance assessments
- `/ghost`, `/write` - Content creation
- `/pentest`, `/vuln-scan`, `/code-review` - Security testing
- `/training`, `/wellness` - Personal development
- Most standard workflows and agent tasks

### Tier 2b: Complex Work (Opus 4.5 for novel problems)
**Cost:** $$$$ (premium)
**Skills:**
- Novel architecture design
- Complex multi-framework compliance
- Advanced threat modeling
- Large-scale infrastructure planning

### Tier 3: Research & Content Generation (OpenRouter Auto - Free)
**Cost:** FREE
**Skills:**
- Initial research phase (before synthesis)
- Content ideation and brainstorming
- Draft generation (before QA)
- Background research for reports

---

## Dual-Path Routing

Many skills implement **dual-path routing** to optimize costs:

### PATH 1: Simple Requests (Base Claude, Tier 1)
- Documentation requests
- Best practice explanations
- Template sharing
- Configuration guidance
- **No Task delegation** - handle directly

### PATH 2: Complex Requests (Specialized Agent, Tier 2)
- Full workflow execution
- Multi-phase assessments
- Deliverable generation
- Infrastructure changes
- **Delegates via Task tool** to specialized agent

---

## Skill Examples by Tier Strategy

### Tier 1 Only (No delegation needed)
```
/framework-update  - System maintenance
/git-pull          - Version control
/monitor-start         - Service management
```

### Tier 2 with Dual-Path
```
/compliance        - Simple: explain framework | Complex: full assessment
/infrastructure    - Simple: architecture docs | Complex: deployment
/n8n               - Simple: workflow templates | Complex: API integration
```

### Tier 2 Direct (Always delegate to agent)
```
/pentest           - Always security agent (Tier 2)
/ghost             - Always writer agent (Tier 2)
```

---

## Cost Optimization Strategy

**For skills with dual-path routing:**

1. **Check request complexity** in routing gate
2. **Simple requests** → Handle in Tier 1 (Base Claude)
3. **Complex requests** → Delegate to Tier 2 agent
4. **Novel problems** → Agent can escalate to Opus if needed

**Cost savings example:**
- Simple request handled in Tier 1: **~$0.01** (Haiku)
- Same request delegated to Tier 2: **~$0.15** (Sonnet)
- **15x cost difference** for identical outcomes

---

## Agent Model Selection

Agents specify their default model tier via the `model` parameter in Task tool:

```typescript
// Base Claude routing decision
if (simple_request) {
  // Handle directly in Tier 1 (Haiku)
  return provide_documentation()
} else {
  // Delegate to Tier 2 agent (Sonnet default)
  Task(subagent_type="engineer", model="sonnet", prompt="...")
}
```

**Agent defaults:**
- advisor → Sonnet (balanced reasoning)
- security → Sonnet (analysis + tool execution)
- engineer → Sonnet (implementation + validation)
- legal → Opus (citation accuracy critical)
- writer → Sonnet (quality + speed balance)

---

## When to Use Each Tier

| Tier | Use When | Don't Use When |
|------|----------|----------------|
| **Tier 1 (Haiku)** | Routing, templates, simple tasks | Novel problems, complex reasoning |
| **Tier 2 (Sonnet)** | Standard workflows, most skills | Ultra-simple tasks, research only |
| **Tier 2b (Opus)** | Novel architecture, critical work | Standard patterns, routine tasks |
| **Tier 3 (Free)** | Research, ideation, drafts | Final deliverables, citations |

---

## Validation

Skills should specify their tier requirements in `SKILL.md` frontmatter:

```yaml
---
name: example-skill
agent: engineer
effort_default: STANDARD
model_tier: 2  # Optional: specify if non-standard
---
```

**Pre-commit validation:**
- All skills must have routing gate
- Dual-path skills must document Tier 1 vs Tier 2 criteria
- Model selection must match task complexity

---

## Related Documentation

- `agent-routing-architecture.md` - Agent delegation patterns
- `hierarchical-context-loading.md` - Context optimization

---

**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-03
