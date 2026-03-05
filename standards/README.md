# GRC Standards Data Store

Framework-wide reference data for all GRC skills.

## Contents

- `frameworks/` — Framework definitions: controls, questions, crosswalks, source docs (ISO, NIST, PCI, HIPAA, etc.)
- `mappings/` — Cross-framework mappings and industry routing
- `templates/` — Output templates: compliance matrix, findings, policy templates

## Used By

- `/gap-analysis` — compliance gap assessment
- `/risk-assess` — risk register and threat analysis
- `/harden` — infrastructure hardening validation
- `/incident` — incident response and notification requirements

## Tooling

Enrichment pipeline and validation: `tools/standards/`

```bash
bun tools/standards/enrich-pipeline.ts status
bun tools/standards/enrich-pipeline.ts validate iso/27001
bun tools/standards/enrich-pipeline.ts report
```

## IA Platform

When the IA Platform (Supabase) has framework tables in production,
this directory becomes the seed/migration source. CLI skills will
query the platform API instead of reading local YAML files.

**Framework:** Intelligence Adjacent (IA)
