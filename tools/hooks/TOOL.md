---
name: hooks
type: utility
classification: public
description: Hook scaffold generator - creates new validation or enforcement hook file templates
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - hooks/pre-commit
  - tools/validation
---

> **FOR AI AGENTS:** Hook scaffold generation utility for creating new hooks.
> Load when: Creating a new pre-commit, pre-push, or session hook file.

---

# Hooks Tool

**Scaffold generator for framework hook files**

Generates boilerplate hook files for new validation or enforcement hooks, following framework hook conventions.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none

**Note:** This tool (`tools/hooks/`) generates hook scaffolds. The actual active hooks live in `hooks/` (project root).

---

## Purpose

Provides a Python-based scaffold generator for creating new hook files:

- **generate-hook-scaffolds.py** - Generates numbered hook files with proper structure
- Follows hook naming conventions (`NN-hook-name.ts`)
- Includes standard hook boilerplate (imports, error handling, exit codes)

---

## Usage

```bash
python tools/hooks/generate-hook-scaffolds.py --name validate-tool-classification --type pre-commit

# Creates: hooks/pre-commit/NN-validate-tool-classification.ts
# With standard hook structure and boilerplate
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct importers — this tool generates scaffold files for use by framework contributors. Invoked directly via CLI when creating new hooks.

---

## File Structure

```
tools/hooks/
├── generate-hook-scaffolds.py    # Hook scaffold generator
├── README.md                     # Brief overview
└── TOOL.md                       # This file
```

---

## Related Tools

- **hooks/pre-commit/** - Active pre-commit hooks (what gets generated)
- **tools/validation** - Validation logic used in hooks

---

**Framework:** Intelligence Adjacent (IA)
