---
name: manifest
type: utility
classification: public
description: Framework manifest auto-sync - reads SKILL.md frontmatter to keep .framework-manifest.yaml accurate
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/docs
  - tools/git
---

> **FOR AI AGENTS:** Manifest synchronization utility that keeps .framework-manifest.yaml current.
> Load when: Skills were added/removed/reclassified and manifest needs updating.

---

# Manifest Tool

**Auto-sync .framework-manifest.yaml from SKILL.md frontmatter**

Scans all `SKILL.md` files, reads their `classification` frontmatter field, and updates `.framework-manifest.yaml` to reflect reality. Skills declare their own classification — the manifest reflects it.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (run directly)

---

## Purpose

Keeps `.framework-manifest.yaml` synchronized with actual skills on disk:

- Discovers all skills by scanning `skills/*/SKILL.md`
- Reads `classification: public|private` from frontmatter
- Updates the manifest's `public_skills` and `private_skills` lists
- Prevents manual manifest drift (manifest and reality diverging)

**Philosophy:** Skills are the source of truth. Manifest is derived, not maintained manually.

---

## Usage

```bash
# Sync manifest from current skill frontmatter
bun tools/manifest/sync-manifest.ts

# Dry run - show what would change
bun tools/manifest/sync-manifest.ts --dry-run

# Verbose output
bun tools/manifest/sync-manifest.ts --verbose
```

---

## File Structure

```
tools/manifest/
├── sync-manifest.ts    # Manifest auto-sync script
└── TOOL.md             # This file
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Hooks:**
- `hooks/pre-commit/` — may run manifest sync as part of commit validation

**Tools:**
- `tools/git/` — `/git-public` reads .framework-manifest.yaml to determine sync scope

No direct TypeScript importers — invoked via CLI before publish operations.

---

## When to Run

- After adding a new skill
- After changing a skill's `classification` in `SKILL.md`
- After removing a skill
- Before running `/git-public` to ensure manifest is current

---

## Related Tools

- **tools/docs/generate-catalogs.ts** - Regenerates command/tool catalogs (related)
- **tools/git** - `/git-public` uses manifest to determine what to sync

---

**Framework:** Intelligence Adjacent (IA)
