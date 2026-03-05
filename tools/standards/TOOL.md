---
name: standards
type: utility
classification: public
description: Standards automation utilities — framework manifest generation and multi-framework question deduplication
version: 1.0
last_updated: 2026-02-25
env_required: false
commands: []
---

# Standards Tools

Automation tools for GRC standards data. These utilities are framework-agnostic — they
operate on whichever frameworks are selected.

## Key Scripts

| Script | Purpose |
|--------|---------|
| `generate-manifest.ts` | Generates `manifest.yaml` for framework discovery (framework-agnostic) |
| `question-merger.ts` | Deduplicates questions within selected frameworks across their sections |
| `clean-questions.ts` | Cleans and normalizes question formatting within a framework |
| `extract-crosswalks.ts` | Extracts control crosswalk data from framework documents |
| `ingest-frameworks.ts` | Ingests new framework documents into the frameworks directory |
| `setup.ts` | Initial setup for framework data structures |
| `update-reference.ts` | Updates framework reference documents |

## Usage

```bash
# List framework manifest status
bun tools/standards/generate-manifest.ts --list

# Generate missing manifests
bun tools/standards/generate-manifest.ts --all

# Merge questions across frameworks (deduplicates within selected frameworks)
bun tools/standards/question-merger.ts \
  --frameworks nist-csf,hipaa,pci-dss \
  --output assessment-questions.yaml
```

## IMPORTANT: Deduplication Scope

`question-merger.ts` deduplicates questions **within** the selected frameworks — it does NOT
normalize everything into NIST CSF or any other single framework. Each framework's controls
are preserved intact. The merger only removes redundant questions that appear multiple times
within the same framework's sections.

## Related Resources

- Framework data: `standards/frameworks/`
- Framework schema: `standards/frameworks/schema.yaml`
- Cross-framework mappings: `standards/mappings/`
