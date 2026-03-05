---
name: sec-review
description: Comprehensive security review with STRIDE/PASTA/ZTA threat modeling, security
  practices (incl. API security when applicable), supply chain assessment, architectural gap
  analysis, and prioritized remediation roadmap.
agent: security
classification: public
version: 1.1
last_updated: 2026-02-25
---

> **SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> This skill uses the `security` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Intake | `security` | Context gathering, domain selection, scope definition |
> | 2 - Analyze | `security` | Threat modeling (STRIDE/PASTA), security practices, patch mgmt |
> | 3 - Recommend | `security` | Prioritized recommendations (P0-P3), framework mapping |
> | 4 - Document | `security` | Professional report creation, Mermaid diagrams, metadata |
> | 5 - Deliver | `security` | Presentation, critical item highlighting |
>
> This is a STANDALONE skill. It does NOT use advisory phases.

---

# Security Review Skill

**Comprehensive security review with STRIDE/PASTA threat modeling.**

---

## IDENTITY

You are the security review orchestrator. Route /sec-review requests to the standalone
5-phase sec-review workflow.

---

## INPUT CONTRACT

- User request for security review
- Optional: architecture docs, system descriptions, company/URL

---

## OBJECTIVE

Execute SECURITY-REVIEW through its own 5-phase workflow with assessment domains:

- Domain A: Architecture & Environment (always included)
- Domain B: Security Practices (optional; includes OWASP API Top 10 when APIs are present)
- Domain C: Patch Management (optional)
- Domain E: Supply Chain Security — SLSA, NIST SSDF (optional)

Phases: 1. INTAKE, 2. ANALYZE, 3. RECOMMEND, 4. DOCUMENT, 5. DELIVER

---

## EXECUTION

Load: `skills/sec-review/phases/00-workflow.md`

Phases live in `skills/sec-review/phases/` — standalone, not shared with advisory.

---

## OUTPUT CONTRACT

Output directory: `private/output/sec-review/{project}-{YYYY-MM-DD}/`

```
{project}-{date}/
├── research-brief.md
├── scope.md
├── EXECUTIVE-SUMMARY.md
├── ARCHITECTURE-ANALYSIS.md
├── THREAT-MODEL.md
├── FINDINGS.md
├── PRACTICES-REVIEW.md          (Domain B, optional)
├── PATCH-ASSESSMENT.md          (Domain C, optional)
├── SUPPLY-CHAIN-REVIEW.md       (Domain E, optional)
├── GAP-ANALYSIS.md
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

---

## NEXT

On invocation: Load `skills/sec-review/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/sec-review/docs/`:**
- How-to guides for using this skill
- API or integration reference documentation
- Command reference and workflow explanations
- Troubleshooting guides
- Setup and configuration guides

**What does NOT belong here:**
- Audit reports or assessment logs → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update /private/docs/active-tracker.md instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → /private/output/sec-review/
- Engagement input → /private/input/sec-review/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/sec-review/`
- Output data: `/private/output/sec-review/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---

**Version:** 1.1 | **Last Updated:** 2026-02-25 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
