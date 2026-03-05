# ISO Standards — Compliance Skill

This directory contains all ISO standards supported by the IA compliance skill. Each standard is maintained in its own numbered subdirectory following a common file structure: `manifest.yaml`, `controls.yaml`, `questions.yaml`, and `crosswalk.yaml` (where enrichment permits).

## Directory Structure

```
iso/
├── 9001/          # Quality Management Systems
├── 13485/         # Medical Device Quality Management
├── 19011/         # Guidelines for Auditing Management Systems
├── 24028/         # Trustworthiness in AI
├── 27001/         # Information Security Management
├── 42001/         # AI Management System (AIMS)
├── 42005/         # AI System Impact Assessment
└── 42006/         # Requirements for AIMS Certification Bodies
```

## Framework Status

Enrichment tiers: T0 = Pending | T1 = Structural | T2 = Assessable | T3 = Cross-mapped | T4 = Production

See `docs/guides/framework-enrichment-guide.md` for tier definitions and advancement criteria.

| ID | Name | Version | Tier | Controls | Questions | Crosswalk | Last Verified |
|----|------|---------|------|----------|-----------|-----------|---------------|
| iso-27001 | Information Security Management | 2022 | T4 | 93 (complete) | 35 (complete) | Complete | 2026-02-25 |
| iso-9001 | Quality Management Systems | 2015 | T3 | Complete | 20 (complete) | Partial | 2026-02-25 |
| iso-13485 | Medical Device Quality Management | 2016 | T3 | Complete | 25 (complete) | Partial | 2026-02-25 |
| iso-42001 | AI Management System (AIMS) | 2023 | T3 | Complete | Complete | Complete | 2026-02-25 |
| iso-42005 | AI System Impact Assessment | 2025 | T2 | Complete | 14 (partial) | Partial | 2026-02-25 |
| iso-42006 | Requirements for AIMS Certification Bodies | 2025 | T2 | Complete | Partial | Partial | 2026-02-25 |
| iso-24028 | Trustworthiness in AI | 2020 | T2 | Complete | Partial | Partial | 2026-02-25 |
| iso-19011 | Guidelines for Auditing Management Systems | 2018 | T2 | Complete | Partial | Partial | 2026-02-25 |

## Standard Relationships

The AI governance standards form an interdependent family:

- **ISO 42001** — Core AI Management System (certifiable). Primary standard for AI governance audits.
- **ISO 42005** — AI impact assessment methodology, referenced by 42001 Annex B
- **ISO 42006** — What certification bodies must verify when auditing against 42001
- **ISO 24028** — Trustworthiness characteristics that 42001 controls address
- **ISO 19011** — Generic audit process applicable across all ISO management systems
- **ISO 27001** — Companion information security standard; crosswalks with 42001 for AI system controls

The quality standards form a separate family:

- **ISO 9001** — Foundation quality management system, broadly applicable
- **ISO 13485** — Medical device variant of 9001 with additional regulatory requirements

## Enrichment Pipeline

Standards advance through enrichment tiers as data files are added and verified. The pipeline CLI manages this process:

```bash
# Check tier status for all ISO frameworks
bun run tools/standards/enrich-pipeline.ts status --provider iso

# Validate a specific framework before tier advancement
bun run tools/standards/enrich-pipeline.ts validate iso-42001

# Generate question scaffold from controls
bun run tools/standards/enrich-pipeline.ts gen-questions iso-42005
```

For a complete walkthrough of adding or advancing a framework, see:
`docs/guides/framework-enrichment-guide.md`

## Adding New ISO Standards

When a new ISO standard needs to be added to the compliance skill:

1. Create a numbered subdirectory under `iso/` matching the standard number
2. Add `manifest.yaml` using the schema in `standards/frameworks/schema.yaml`
3. Obtain the source PDF and follow the 7-step enrichment process in the guide above
4. Target crosswalks against the appropriate domain family (security, QMS, AI governance)

PDF acquisition note: ISO standards require purchase from iso.org. The purchase URL and date should be recorded in `manifest.yaml` under `enrichment_status.verified_by`.
