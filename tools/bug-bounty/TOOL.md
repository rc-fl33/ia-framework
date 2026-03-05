---
name: bug-bounty
type: utility
classification: public
description: Bug bounty automation utilities — scope parsing, target sync, HackerOne API integration, framework ingestion
version: 1.0
last_updated: 2026-02-17
env_required: false
commands: []
---

> **FOR AI AGENTS:** Bug bounty execution utilities — scope parsing, HackerOne API integration, and target sync from platform data. Load when executing skills/bug-bounty/ workflows.

---

# Bug Bounty Tool

**Bug bounty automation infrastructure — scope parsing, target synchronization, and platform API integration.**

Provides the runtime utilities required to automate bug bounty program scope loading and target management. These scripts are imported by skills/bug-bounty/; they do not provide user-facing commands directly.

---

## Classification

**Type:** utility
**Visibility:** private
**Commands:** None - programmatic only

---

## Purpose

This tool provides execution infrastructure for bug bounty engagements:

- **Scope parsing** — parses HackerOne, Bugcrowd, Intigriti, YesWeHack, and Federacy JSON program data (from public arkadiyt/bounty-targets-data) into structured SCOPE.md format
- **HTTP header analysis** — inspects target HTTP headers for reconnaissance during bounty testing
- **HackerOne API** — direct API integration for program and scope queries

These utilities separate reusable platform integration logic from the workflow orchestration in skills/bug-bounty/.

**Note:** Target data is now fetched directly from the public arkadiyt/bounty-targets-data repository (hourly updates, no local scraping required). The old VPS-based scraper infrastructure has been deprecated.

---

## Key Scripts

| Script | Purpose | Status |
|--------|---------|--------|
| `bounty-scope-parser-public.ts` | Fetches and parses platform JSON data from public arkadiyt/bounty-targets-data | ✅ Active |
| `bounty-scope-parser.ts` | Legacy parser (requires local data directory) | ⚠️ Deprecated |
| `bounty-targets-sync.ts` | Legacy sync utility | ⚠️ Deprecated (archived 2026-02-17) |
| `http-headers.ts` | HTTP header inspection for target reconnaissance and technology fingerprinting | ✅ Active |
| `ingest-frameworks.ts` | Ingests raw platform data exports into normalized local JSON format | ✅ Active |

**Subdirectories:**

- `hackerone/` — HackerOne API client (api.ts) and debugging/test scripts
- `bounty-targets/` — ⚠️ Archived VPS-based target scraper scripts (no longer used)

---

## Usage

### Command-Line (Current - Public Data Source)

```bash
# Parse program scope from public arkadiyt/bounty-targets-data
bun tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform hackerone \
  --program "Shopify"

# With fuzzy matching
bun tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform bugcrowd \
  --program "Acorns" \
  --fuzzy
```

### Command-Line (Public Data Source)

```bash
# Parse from public arkadiyt/bounty-targets-data repository
bun tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform hackerone \
  --program "security"
```

---

## Architecture

```
skills/bug-bounty/  ──imports──>  tools/bug-bounty/
  workflows/                        bounty-scope-parser-public.ts  (SCOPE.md generation)
  commands/                         http-headers.ts                (recon)
                                      │
                                      └──fetches──> arkadiyt/bounty-targets-data (GitHub)
                                                    (HackerOne, Bugcrowd, Intigriti, etc.)
```

---

## Related Tools

- `arkadiyt/bounty-targets-data` — Public GitHub repository providing hourly platform data updates
- `tools/nvd/` — CVE research for vulnerability identification against bounty targets
- `tools/pentest/` — Execution infrastructure shared with full pentest engagements

---

## Version History

- **1.0** (2026-02-17): Extracted from original monolithic security skill during refactor — moved to tools/bug-bounty/

---

**Framework:** Intelligence Adjacent (IA)
**Maintainer:** Framework Team
