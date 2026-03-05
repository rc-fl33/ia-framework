# sec-review

Comprehensive security review skill. Use `/sec-review` to begin STRIDE/PASTA threat
modeling with optional security practices, patch management, and supply chain assessment.

## Quick Start

```
/sec-review
/sec-review Project: customer-portal, Company: Acme Corp, URL: https://acme.com
/sec-review React frontend, Django REST backend, PostgreSQL, Redis cache, AWS ECS with ALB
/sec-review Fintech payment platform, PCI-DSS required, AWS multi-region
```

## What it does

- STRIDE/PASTA/ZTA threat modeling (Domain A: Architecture — always included)
- Security practices gap analysis against OWASP SAMM / NIST SSDF, including API security
  when applicable (Domain B: optional)
- Patch management maturity assessment, 1-5 scoring per category (Domain C: optional)
- Supply chain security assessment — SBOM, build integrity, vendor risk, SLSA (Domain E: optional)
- Mermaid diagram generation (architecture overview, trust boundaries, data flow, attack
  surface, threat model, network topology) — .mmd always, .svg/.png best effort
- P0-P3 prioritized security recommendations mapped to NIST CSF 2.0, CIS Controls,
  OWASP SAMM, NIST SSDF
- Professional deliverables: FULL-REPORT.md plus individual domain files

## Workflow

Standalone 5-phase pipeline in `skills/sec-review/phases/`. All phases use the security
agent. Not shared with advisory.

## Output

`private/output/sec-review/{project}-{YYYY-MM-DD}/`

```
{project}-{date}/
├── research-brief.md
├── scope.md
├── EXECUTIVE-SUMMARY.md
├── ARCHITECTURE-ANALYSIS.md
├── THREAT-MODEL.md
├── FINDINGS.md
├── PRACTICES-REVIEW.md          (Domain B, if selected)
├── PATCH-ASSESSMENT.md          (Domain C, if selected)
├── SUPPLY-CHAIN-REVIEW.md       (Domain E, if selected)
├── GAP-ANALYSIS.md
├── RECOMMENDATIONS.md
├── diagrams/
│   ├── arch-overview.mmd/.svg/.png
│   ├── trust-boundaries.mmd/.svg/.png
│   ├── data-flow.mmd/.svg/.png
│   ├── attack-surface.mmd/.svg/.png
│   ├── threat-model.mmd/.svg/.png
│   └── network-topology.mmd/.svg/.png
├── FULL-REPORT.md
└── metadata.json
```

## Templates

- `templates/sec-review-intake-checklist.md` — Pre-engagement intake form
- `templates/security-practices-questionnaire.md` — Domain B questionnaire
- `templates/patch-assessment-questionnaire.md` — Domain C questionnaire
- `templates/supply-chain-questionnaire.md` — Domain E questionnaire
- `templates/evidence-collection-checklist.md` — Evidence document checklist
- `tools/quarto/templates/reports/sec_review/sec_review-report.qmd` — Report assembly manifest

## Related

- `/code-review` — Code-level security review
- `/advisory` — Quick security guidance
- `/pentest` — Runtime security testing
- `/gap-analysis` — Compliance framework gap analysis
