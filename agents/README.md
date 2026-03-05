---
name: Agents System Documentation
description: Reference documentation for the agents subsystem
type: documentation
category: reference
---

# Agents - Specialized Context Routers

## Identity

System documentation providing reference guide for agent architecture, routing logic, and format standards.

## Startup

This file is reference documentation only. For actual agent definitions, see individual agent files.

> Reference documentation for the agents/ subsystem.

**Purpose:** Agent prompts that route work to appropriate skills based on task type

---

## Agent Architecture

**Available agents:**

| Agent | Domain | Skills Routed |
|-------|--------|---------------|
| `advisor.md` | Personal development, research, QA | career, clifton, mentorship, training, wellness |
| `developer.md` | Code review, architecture review, secure coding | code-review |
| `engineer.md` | Implementation, infrastructure, remediation | create, hardening |
| `legal.md` | Legal compliance, regulatory analysis | compliance |
| `researcher.md` | Information gathering and synthesis | research tasks |
| `security.md` | Security testing, vulnerability analysis | security, advisory |
| `writer.md` | Content creation, technical writing | ghost, write |

**Core principles:**
- Agents are concise context routers (enforced by pre-commit hook)
- Routes to skills based on task keywords/context
- Loads skill context via PostToolUse hook
- References SKILL.md files (no inline workflows)

---

## How Agents Work

1. **User invokes:** `Task(subagent_type="security")` from base Claude
2. **Hook loads:** `agents/security.md` + appropriate `skills/*/SKILL.md`
3. **Agent routes:** Reads task, selects correct skill workflow
4. **Returns:** Results to base Claude

See `../docs/architecture/agent-routing-architecture.md` for complete routing logic.

---

## Format & Editing

**Format Standards:** See `../docs/standards/agent-format-standards.md` for:
- Structure requirements and line limits
- Required sections
- Validation commands and enforcement

**Routing Rules:** See `../docs/architecture/agent-routing-architecture.md` for:
- Complete routing patterns per agent
- Skill mapping and decision trees
- Keyword detection and task routing

---

## Files in This Directory

```
agents/
├── README.md           (This file - agent system overview)
├── advisor.md          (Advisory/research router)
├── developer.md        (Code review/architecture router)
├── engineer.md         (Implementation router)
├── legal.md            (Legal compliance router)
├── researcher.md       (Information gathering router)
├── security.md         (Security operations router)
└── writer.md           (Content creation router)
```

---

## References

**Templates:**
- `docs/templates/agent-template.md` - Agent structure template

**Documentation:**
- `docs/architecture/agent-routing-architecture.md` - Complete routing logic
- `docs/standards/agent-format-standards.md` - Format requirements
- `docs/guides/hierarchical-context-loading.md` - Context loading system

**Validation:**
- `hooks/pre-commit/` - Pre-commit validation (line count enforcement)

---

**Framework:** Intelligence Adjacent (IA) v2.4.0
