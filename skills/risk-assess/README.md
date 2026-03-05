# /risk-assess

Structured risk assessment for organizations and systems. Produces an asset inventory,
threat landscape, likelihood/impact risk analysis, prioritized risk register, treatment
plan, and executive summary — all within a single 5-phase workflow.

---

## When to Use

Use `/risk-assess` when you need to:

- Identify and prioritize organizational or system risks
- Build a risk register with scored asset/threat pairs
- Select treatment strategies (mitigate, accept, transfer, avoid) with owners and timelines
- Satisfy a regulatory requirement for formal risk analysis (HIPAA §164.308, FedRAMP RA-3)
- Prepare for a board-level risk briefing or audit

---

## Quick Start

```bash
# Minimal — advisor agent gathers context during Phase 01
/risk-assess

# With org and framework specified
/risk-assess Org: Acme Corp, Framework: NIST CSF 2.0

# Regulation-driven
/risk-assess Healthcare org, HIPAA required
```

---

## Supported Frameworks

| # | Framework | Use Case |
|---|-----------|----------|
| 1 | NIST CSF 2.0 | Govern/Identify/Protect/Detect/Respond/Recover risk lens |
| 2 | ISO 27001 | Annex A control-based (ISO 27005 methodology) |
| 3 | PCI DSS | Cardholder data environment, SAQ-aligned |
| 4 | HIPAA | PHI/ePHI risk analysis per §164.308(a)(1) |
| 5 | FedRAMP | FIPS 199/800-30, ATO-aligned risk categorization |
| 6 | AIUC-1 | AI system risk: model risk, data lineage, adversarial threats |
| 7 | General | Framework-agnostic likelihood × impact matrix |

---

## Output

All deliverables land in `private/output/risk-assess/{org}-{YYYY-MM}/`:

```
{org}-{YYYY-MM}/
├── scope.md                    Phase 01 — engagement setup
├── ASSET-INVENTORY.md          Phase 02 — assets by type/criticality
├── THREAT-LANDSCAPE.md         Phase 02 — threat actors, vectors, events
├── RISK-ANALYSIS.md            Phase 03 — scored risk matrix
├── RISK-REGISTER.md            Phase 04 — prioritized risk list
├── RISK-TREATMENT-PLAN.md      Phase 04 — treatment per risk, owners, timelines
├── EXECUTIVE-SUMMARY.md        Phase 05 — top risks, next steps
├── FULL-REPORT.md              Phase 05 — assembled full report
└── metadata.json               Phase 05 — org, framework, date, risk counts
```

---

## Related Commands

- `/harden` — System hardening and remediation implementation
- `/incident` — Incident response workflow
- `/gap-analysis` — Compliance gap assessment against frameworks
- `/sec-review` — Architecture and security practices review

---

**Framework:** Intelligence Adjacent (IA)
**Version:** 1.0 | **Last Updated:** 2026-02-24
