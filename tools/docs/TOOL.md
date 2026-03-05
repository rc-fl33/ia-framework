---
name: docs
type: utility
classification: public
description: Documentation generation utilities - catalogs, frontmatter enhancement, link suggestions, reference publishing
version: 1.1
last_updated: 2026-02-17
env_required: false
env_keys: []
commands:
  - /update-reference
related_tools:
  - tools/validation
  - tools/manifest
---

> **FOR AI AGENTS:** Framework documentation generation and maintenance utilities.
> Load when: Regenerating catalogs, updating frontmatter, publishing reference docs, or suggesting doc links.

---

# Documentation Tools

**Utilities for generating and maintaining framework documentation**

Scripts that generate catalog files, enhance frontmatter metadata, suggest cross-links between documents, and publish reference documentation.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** /update-reference

---

## Purpose

Four documentation generation utilities:

1. **generate-catalogs.ts** - Generates `docs/catalogs/commands.md` and `tool-catalog.md` from frontmatter
2. **enhance-frontmatter.ts** - Adds or updates frontmatter fields across skill/tool files
3. **suggest-links.ts** - Analyzes content and suggests cross-document links
4. **update-reference.py** - Publishes reference documentation to Ghost CMS (`/update-reference`)

---

## Usage

### Generate Catalogs

```bash
bun tools/docs/generate-catalogs.ts

# Regenerates:
# - docs/catalogs/commands.md (all slash commands)
# - docs/catalogs/tool-catalog.md (all tools)
```

### Enhance Frontmatter

```bash
bun tools/docs/enhance-frontmatter.ts

# Adds missing frontmatter fields to skill/tool files
# Non-destructive - only adds missing fields
```

### Suggest Links

```bash
bun tools/docs/suggest-links.ts --file skills/pentest/SKILL.md

# Suggests related documents to link from the given file
```

### Publish Reference (/update-reference)

```bash
/update-reference
# Publishes framework reference docs to Ghost CMS
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Hooks:**
- `hooks/pre-commit/` — catalog generation runs as part of commit validation

**Tools:**
- `tools/validation/` — documentation validation runs alongside catalog generation

No direct TypeScript importers — invoked via CLI commands or pre-commit hooks.

---

## File Structure

```
tools/docs/
├── generate-catalogs.ts    # Catalog auto-generation
├── enhance-frontmatter.ts  # Frontmatter enrichment
├── suggest-links.ts        # Cross-link suggestions
├── update-reference.py     # Ghost CMS publishing
├── README.md               # Brief overview
└── TOOL.md                 # This file
```

---

## Dependencies

**Runtime:**
- Bun (TypeScript scripts)
- Python 3 (update-reference.py)

**For /update-reference:**
- Ghost Admin API key (GHOST_ADMIN_API_KEY in .env)

---

## Related Tools

- **tools/validation** - Validates documentation after changes
- **tools/manifest** - Manifest generation (related catalog work)
- **tools/markdown** - Section parsing used by these utilities

---

**Framework:** Intelligence Adjacent (IA)
