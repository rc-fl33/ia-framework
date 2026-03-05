---
name: migration
type: utility
classification: public
description: One-time project migration scripts for file/directory renaming and restructuring
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools: []
---

> **FOR AI AGENTS:** One-time migration scripts for project restructuring.
> Load when: Executing a planned file/directory rename or migration task.

---

# Migration Tool

**One-time scripts for project structure migrations**

Contains scripts written for specific migration tasks (file renames, directory restructuring). Scripts are project-specific and not intended for reuse.

---

## Classification

**Type:** utility
**Visibility:** private

**Why Private:**
- Project-specific migrations (references specific paths/names)
- One-time use scripts, not general-purpose utilities
- Contains project history and naming conventions

---

## Purpose

Holds migration scripts executed during project restructuring:

- **rename-deep-dive-to-overview.ts** - Renamed `deep-dive` phase files to `overview` convention

Scripts are kept after execution for audit trail and rollback reference.

---

## Usage

```bash
# Scripts are typically run once during planned migrations
bun tools/migration/rename-deep-dive-to-overview.ts

# Use --dry-run to preview before executing
bun tools/migration/rename-deep-dive-to-overview.ts --dry-run
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct importers — scripts are run once manually for specific migration tasks. Scripts are retained for audit trail only.

---

## File Structure

```
tools/migration/
├── rename-deep-dive-to-overview.ts    # Phase file rename migration
├── README.md                           # Migration history
└── TOOL.md                             # This file
```

---

**Framework:** Intelligence Adjacent (IA)
