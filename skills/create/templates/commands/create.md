---
name: create
description: Interactive creation wizard for skills and tools - guides through requirements gathering to create properly structured components
skill: create-skill
---

# /create - Create New Skill or Tool

**Interactive wizard to create properly structured skills and tools with full requirements gathering.**

---

## Quick Start

```
/create
/create [name]
/create --tool [name]
```

---

## What Happens

1. **DISCOVER** - Collects requirements (type, name, description, workflows, agent, command, visibility)
2. **DESIGN** - Validates naming and plans structure
3. **GENERATE** - Creates all files from templates
4. **VALIDATE** - Verifies everything is correct
5. **HANDOFF** - Provides next steps for customization

---

## What Gets Created

**For Skills:**
```
skills/[skill-name]/
├── SKILL.md              # Main skill with routing gate
├── README.md             # User-facing overview
├── VERIFY.md             # Definition of Done checklist
├── phases/               # Domain-specific phase files
│   ├── 01-[Phase].md
│   └── ...
├── docs/                 # For domain knowledge
└── templates/            # For output templates

commands/[command].md     # User-facing slash command
```

**For Tools:**
```
tools/[tool-name]/
├── README.md             # Tool overview with Quick Start
├── STATUS.md             # Development status
├── VERIFY.md             # Validation checklist
├── commands/             # Slash commands (optional)
├── scripts/              # Implementation scripts
├── docs/                 # Documentation (optional)
└── data/                 # Runtime data (optional, gitignored)
```

---

## When to Use

**Use /create when:**
- Adding new specialized capability to the framework
- Building a workflow-driven skill
- Creating a skill that will be loaded by an agent
- Creating an infrastructure tool

**Don't use if:**
- Creating just a command → use `docs/templates/command-template.md`
- Creating an agent → use `docs/templates/agent-template.md`

---

## Naming Rules

**Command name MUST differ from skill folder name:**

| Command | Skill Folder | Status |
|---------|--------------|--------|
| `/pentest` | `security-testing` | Valid |
| `/code-review` | `code-security` | Valid |
| `/network-scan` | `network-scan` | Invalid |

---

## Skill Reference

**Full workflow:** `skills/create/SKILL.md`

**Phases:**
- `skills/create/phases/01-discover.md` - Requirements gathering
- `skills/create/phases/02-design.md` - Structure planning
- `skills/create/phases/03-generate.md` - File creation
- `skills/create/phases/04-validate.md` - Quality checks
- `skills/create/phases/05-handoff.md` - User ready

---

**Version:** 2.0
**Last Updated:** 2026-02-09
