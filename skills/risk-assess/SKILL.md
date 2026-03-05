---
name: risk-assess
description: Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring,
  risk register, and treatment prioritization.
agent: advisor
classification: public
effort_default: STANDARD
mode: single-agent
agents: [advisor]
version: 1.0
last_updated: 2026-02-24
---

> **SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> This skill uses the `advisor` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Scope | `advisor` | Framework selection, org context, asset boundary, engagement setup |
> | 2 - Identify | `advisor` | Asset inventory, threat landscape, vulnerability enumeration |
> | 3 - Analyze | `advisor` | Likelihood × impact scoring, risk level calculation |
> | 4 - Prioritize | `advisor` | Risk register assembly, treatment options, roadmap |
> | 5 - Deliver | `advisor` | Executive summary, full report assembly |
>
> This is a STANDALONE skill. It does NOT use compliance phases and has zero dependency on
> `skills/gap-analysis/` or `private/output/compliance/`.

---

# Risk Assessment Skill

**Structured risk assessment — from asset inventory to prioritized risk treatment plan.**

---

## IDENTITY

You are the risk assessment orchestrator. Route /risk-assess requests to the standalone
5-phase risk-assess workflow. All phases run under the advisor agent with no external
skill dependencies.

---

## INPUT CONTRACT

- User request for risk assessment
- Optional: org name, selected framework, asset descriptions, compliance requirements

---

## OBJECTIVE

Execute RISK-ASSESS through its own 5-phase workflow:

Phases: 1. SCOPE, 2. IDENTIFY, 3. ANALYZE, 4. PRIORITIZE, 5. DELIVER

Supported frameworks (selected inline during Phase 01):
- NIST CSF 2.0, ISO 27001, PCI DSS, HIPAA, FedRAMP, AIUC-1, General

---

## EXECUTION

Load: `skills/risk-assess/phases/00-workflow.md`

Phases live in `skills/risk-assess/phases/` — standalone, no compliance dependency.

---

## OUTPUT CONTRACT

Output directory: `private/output/risk-assess/{org}-{YYYY-MM}/`

```
{org}-{YYYY-MM}/
├── scope.md                    ← Phase 01
├── ASSET-INVENTORY.md          ← Phase 02
├── THREAT-LANDSCAPE.md         ← Phase 02
├── RISK-ANALYSIS.md            ← Phase 03
├── RISK-REGISTER.md            ← Phase 04
├── RISK-TREATMENT-PLAN.md      ← Phase 04
├── EXECUTIVE-SUMMARY.md        ← Phase 05
├── FULL-REPORT.md              ← Phase 05
└── metadata.json               ← Phase 05
```

---

## NEXT

On invocation: Load `skills/risk-assess/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/risk-assess/docs/`:**
- How-to guides for using this skill
- Framework-specific methodology notes
- Command reference and workflow explanations
- Troubleshooting guides

**What does NOT belong here:**
- Risk assessment reports → `private/output/risk-assess/`
- Input data, org questionnaires → `private/input/risk-assess/`
- Progress tracking → update `private/docs/active-tracker.md` instead
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `private/input/risk-assess/`
- Output data: `private/output/risk-assess/`

---

**Version:** 1.0 | **Last Updated:** 2026-02-24 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
