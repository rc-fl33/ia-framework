---
name: gap-analysis
description: Framework gap analysis — multi-framework assessment with framework-native findings, gap identification, and remediation roadmap. 3-phase pipeline (intake, assess, deliverables) with manifest-based discovery, control-tagged questions, and domain-based deduplication.
agent: advisor
version: 1.0
classification: public
last_updated: 2026-02-25
effort_default: STANDARD
mode: multi-agent
agents: [advisor, engineer, security, legal]
---

> **MULTI-AGENT ROUTING GATE - READ THIS FIRST**
>
> **STOP.** This skill uses multiple agents across its pipeline:
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Intake | `advisor` | Engagement setup, framework acquisition |
> | 2 - Assess (governance, asset_mgmt, monitoring, bc) | `advisor` | Framework-native interview |
> | 2 - Assess (access_control, data_protection) | `engineer` | Technical controls assessment |
> | 2 - Assess (incident_response) | `security` | IR controls assessment |
> | 3 - Deliverables | `advisor` | Compile matrix, gap analysis, roadmap |
> | 3 - QA Gate | `legal` | Final deliverable QA (citations, regulatory accuracy) |
>
> **STOP.** The `advisor` agent orchestrates the pipeline, delegating by control domain to designated agents, with `legal` providing final QA.
>
> **Identity check:** If you are NOT the correct agent for the current domain, DELEGATE NOW.

---

# Gap Analysis Skill

**Multi-framework gap analysis — framework-native output, 3-phase pipeline (intake, assess, deliverables) with manifest-based discovery, control-tagged questions, and domain-based deduplication.**

---

## Chain Map

```
/gap-analysis → phases/00-workflow.md ─┬→ 01-intake.md (framework acquisition)     [advisor]
                                       ├→ 02-assess.md (framework-native interview) [advisor + engineer + security]
                                       ├→ 03-deliverables.md (matrix, gaps, roadmap) [advisor]
                                       └→ legal QA gate (citation/accuracy check)   [legal]
                                                │
                                                ▼
                                       output/{client}-{YYYY-MM}/
                                       ├── intake/
                                       │   ├── metadata.yaml
                                       │   ├── merged-questionnaire.yaml
                                       │   └── osint-summary.md
                                       ├── assessment/
                                       │   ├── {framework-id}-findings.md  (one per framework)
                                       │   └── ...
                                       └── deliverables/
                                           ├── compliance-matrix.md
                                           ├── gap-analysis.md
                                           ├── remediation-roadmap.md
                                           └── qa-report.md

Agent domain boundaries (within 02-assess.md):
  advisor  ────→ governance, asset_management, monitoring, business_continuity
  engineer ────→ access_control, data_protection
  security ────→ incident_response
  legal    ────→ final QA gate (deliverables citation accuracy)
```

---

## Framework Data

Framework reference data lives at `standards/frameworks/` (shared with other GRC skills).

```bash
# List all frameworks with manifests
ls standards/frameworks/*/manifest.yaml

# Check enrichment status
bun tools/standards/enrich-pipeline.ts status
```

---

## 3-Phase Workflow

| Phase | Name | Gate Criteria | Output |
|-------|------|---------------|--------|
| 1 | **INTAKE** | Framework acquired, engagement created | Engagement folder + questionnaire |
| 2 | **ASSESS** | All selected frameworks have findings files | `{framework-id}-findings.md` per framework |
| 3 | **DELIVERABLES** | Deliverables generated, legal QA approved | compliance-matrix.md, gap-analysis.md, remediation-roadmap.md, qa-report.md |

---

## Framework Selection (Auto-Routing)

| Industry | Required | Recommended |
|----------|----------|-------------|
| Healthcare | HIPAA | NIST CSF, SOC2, ISO 27001 |
| Financial | PCI-DSS, FFIEC | NIST CSF, SOC2 |
| Retail | PCI-DSS | NIST CSF, CIS Controls |
| Government | NIST CSF, FedRAMP | NIST 800-53, CIS Controls |
| Technology | SOC2 | NIST CSF, ISO 27001 |
| EU Operations | GDPR | DSA, ISO 27001 |
| Manufacturing | ISO 9001 | NIST CSF, CIS Controls |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1 through 3
2. **Framework-native** — Output organized by selected framework's own structure, not NIST CSF unless selected
3. **Control-tagged** — Every question maps to framework controls across all selected frameworks
4. **Evidence-based** — Score only with evidence (Full/Partial/Gap/Requires Evidence)
5. **Domain deduplication** — Questions deduplicated by shared control domain, not NIST CSF phase

---

## Commands

| Command | File | Purpose | Agent |
|---------|------|---------|-------|
| `/gap-analysis` | `commands/gap-analysis.md` | Primary entry — full 3-phase framework gap analysis | advisor |

---

## Tools

| Tool | Purpose |
|------|---------|
| `tools/standards/generate-manifest.ts` | Generate manifest.yaml for frameworks |
| `tools/standards/question-merger.ts` | Multi-framework question merger with deduplication |
| `tools/standards/enrich-pipeline.ts` | Framework enrichment status and validation |

---

## Output Structure

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

| Need | Skill |
|------|-------|
| Risk scoring and register | `/risk-assess` |
| Infrastructure hardening | `/harden` |
| Incident response | `/incident` |
| Penetration testing | `/pentest` |

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
