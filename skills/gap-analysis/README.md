# /gap-analysis

Framework gap analysis — evaluate compliance posture against regulatory and control frameworks. Produces framework-native findings, a cross-framework compliance matrix, prioritized gap analysis, and a 30/60/90-day remediation roadmap.

---

## When to Use

Use `/gap-analysis` when you need to:
- Assess compliance against HIPAA, PCI-DSS, SOC2, ISO 27001, NIST CSF, or other frameworks
- Prepare for a compliance audit or certification
- Identify control gaps across multiple frameworks simultaneously
- Produce a remediation roadmap with prioritized findings
- Satisfy a board or regulator request for a compliance posture report

## When NOT to Use

- Need risk scoring (likelihood x impact) → use `/risk-assess`
- Need live infrastructure hardening → use `/harden`
- Need incident response → use `/incident`

---

## Quick Start

```bash
# Bare invocation — advisor agent will prompt for org details and framework selection
/gap-analysis

# Single framework assessment
/gap-analysis We need a HIPAA gap assessment for Acme Health.

# Multi-framework assessment
/gap-analysis Assess Acme Health against HIPAA and NIST CSF simultaneously.

# With org name and scope specified
/gap-analysis Run a PCI-DSS and SOC2 gap analysis for RetailCo. Scope: cardholder data
environment and supporting cloud infrastructure. We have an audit in 90 days.
```

---

## Supported Frameworks

| Industry | Required | Recommended |
|----------|----------|-------------|
| Healthcare | HIPAA | NIST CSF, SOC2, ISO 27001 |
| Financial | PCI-DSS, FFIEC | NIST CSF, SOC2 |
| Retail | PCI-DSS | NIST CSF, CIS Controls |
| Government | NIST CSF, FedRAMP | NIST 800-53, CIS Controls |
| Technology | SOC2 | NIST CSF, ISO 27001 |
| EU Operations | GDPR | DSA, ISO 27001 |
| Manufacturing | ISO 9001 | NIST CSF, CIS Controls |

See the skill's SKILL.md for framework selection logic, domain deduplication, and worked examples.

---

## 3-Phase Workflow

| Phase | Name | Output |
|-------|------|--------|
| 1 | INTAKE | Engagement folder, merged questionnaire, OSINT summary |
| 2 | ASSESS | Framework-native findings file per selected framework |
| 3 | DELIVERABLES | Compliance matrix, gap analysis, remediation roadmap, QA report |

Each phase has a gate check before proceeding. Phase 03 includes a mandatory legal QA gate for citation and regulatory accuracy.

---

## Output

All deliverables land in `private/output/gap-analysis/{client}-{YYYY-MM}/`:

```
private/output/gap-analysis/{client}-{YYYY-MM}/
├── metadata.yaml
├── intake/
│   ├── engagement-details.yaml
│   ├── merged-questionnaire.yaml
│   └── osint-summary.md
├── assessment/
│   ├── {framework-id}-findings.md   (one per selected framework)
│   └── ...
├── deliverables/
│   ├── compliance-matrix.md
│   ├── gap-analysis.md
│   ├── remediation-roadmap.md
│   └── qa-report.md
└── evidence/
```

---

## Related Skills

| Skill | When to Use |
|-------|-------------|
| `/risk-assess` | Risk scoring with likelihood x impact, risk register output |
| `/harden` | Live infrastructure hardening against CIS/STIG benchmarks |
| `/incident` | Incident response workflow and communications |
| `/pentest` | Penetration testing and technical vulnerability assessment |

---

**Framework:** Intelligence Adjacent (IA)
**Version:** 1.0 | **Last Updated:** 2026-02-25
