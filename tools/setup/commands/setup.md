---
name: setup
description: Framework initialization - install and configure the IA Framework
tool: setup
agent: base
classification: public
---

# /setup - Framework Setup & Installation

**Initialize and configure the Intelligence Adjacent Framework.**

> **Type:** Setup command

## Default Action

**Run the full framework installer:**

```bash
# Option 1: Using npm script (recommended)
bun run setup

# Option 2: Direct path
bun tools/setup/install-framework.ts
```

This installer performs:
- Platform detection (Linux, macOS, WSL)
- Git/Bun installation if missing
- Framework structure validation
- Symlink creation (CLAUDE.md, settings.json, agents/, commands/, hooks/)
- Environment configuration (.env from template)
- Privacy defaults in settings.json
- Dependency installation (root + skills)
- Health check verification

## Quick Usage

```bash
# First-time install
/setup

# Re-run to sync hooks after framework updates
/setup
```

The installer is idempotent — safe to re-run.

## What Gets Checked

**Optional dependencies (installed on demand):**
- `pdfjs-dist`, `pdf-lib` — PDF text extraction and manipulation
- `puppeteer` — Markdown to PDF conversion
- `docx-templates` — Word document export
- Chrome/Puppeteer system libraries (13 libs)

## Related Commands

- `/framework-update` — Check for framework updates
- `/framework-update-apply` — Apply framework updates
- `/monitor-start` — Monitor dashboard configuration (separate)

---

**Reference:** `tools/setup/TOOL.md`
