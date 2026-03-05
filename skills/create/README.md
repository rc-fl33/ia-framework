# Skill & Tool Creation Wizard

**Interactive wizard to create properly structured skills and tools with requirements gathering.**

---

## Problem

**Creating skills and tools manually is error-prone and inconsistent.**

New skills often miss required components (routing gates, phase files, verification checklists), use inconsistent naming, or skip critical setup steps like agent routing and public sync configuration. New tools lack standardized structure. This leads to components that don't integrate properly with the framework.

---

## Solution

**Guided requirements gathering with template-based generation.**

This skill walks you through collecting all necessary information (type, name, description, workflows, agent routing, visibility) then generates a complete skill or tool structure from standardized templates. Every component created follows the same patterns and includes all required files.

---

## Quick Start

```bash
# Start the wizard
/create

# With a name already in mind
/create my-new-skill

# Create a tool directly
/create --tool my-new-tool
```

---

## What You'll Be Asked

The wizard collects:

1. **Component Type** - Skill (multi-phase workflow) or Tool (infrastructure utility)
2. **Identity** - Name and description
3. **Problem & Solution** - What pain point it solves
4. **Workflows/Modes** - What the skill does, mapped to phases (skill only)
5. **Agent Routing** - Which agent executes it (skill only)
6. **Command** - User-facing slash command (recommended)
7. **Visibility** - Public or private

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
│   ├── 02-[Phase].md
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
├── commands/             # Slash commands (if user-facing)
├── scripts/              # Implementation scripts
├── docs/                 # Documentation
├── workflows/            # Operational workflows
├── input/                # Input data
└── output/               # Generated output
```

---

## Naming Rules

**Command name MUST differ from skill folder name:**

| Command | Skill Folder | Status |
|---------|--------------|--------|
| `/pentest` | `security-testing` | Valid |
| `/code-review` | `code-security` | Valid |
| `/network-scan` | `network-scan` | Invalid |

**Convention:**
- **Commands:** Short, user-friendly (`/pentest`, `/vuln-scan`)
- **Skill folders:** Descriptive (`security-testing`, `vulnerability-scanning`)

---

## Agent Options (Skills Only)

| Agent | Use For |
|-------|---------|
| `security` | Pentesting, code review, vulnerability assessment |
| `engineer` | Infrastructure, remediation, hardening |
| `writer` | Blog posts, documentation, reports |
| `advisor` | Research, career, QA review |
| `legal` | Compliance, legal analysis |
| `none` | Base Claude executes directly |

---

## After Creation

**For skills:**
1. **Customize SKILL.md** - Add domain-specific logic
2. **Fill Phase files** - Add actual workflow steps
3. **Add Reference materials** - Import domain knowledge
4. **Update agent** - Add skill to agent's skill list (if agent-routed)
5. **Test** - Invoke with `/command` and verify it works

**For tools:**
1. **Add scripts** - Implement core functionality in `scripts/`
2. **Add documentation** - Fill in `docs/`
3. **Update manifest** - Add to `.framework-manifest.yaml` under tools
4. **Test** - Invoke with `/command` or run scripts directly

---

## Related

- `skills/create/templates/` - All templates used
- `/framework-update` - Update framework components

---

**Version:** 2.0
**Last Updated:** 2026-02-09
