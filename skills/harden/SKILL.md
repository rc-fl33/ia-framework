---
name: harden
description: Infrastructure hardening skill — validate or remediate system configuration against
  CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General hardening benchmarks.
agent: engineer
classification: public
version: 1.0
last_updated: 2026-02-24
---

> **SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> This skill uses the `engineer` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 0 - Workflow | `engineer` | State detection, mode awareness, phase routing |
> | 1 - Scope | `engineer` | Framework selection, mode, target ID, rollback prereqs |
> | 2 - Baseline | `engineer` | Current-state collection, applicable control enumeration |
> | 3 - Assess | `engineer` | Control-by-control gap analysis, Pass/Fail/NA, severity |
> | 4 - Remediate | `engineer` | Guidance (validate) or executable scripts + change log (remediate) |
> | 5 - Deliver | `engineer` | Executive summary, full report, metadata |
>
> This is a STANDALONE skill. It does NOT use compliance phases or advisory phases.
>
> **Modes:** `validate` (non-destructive audit) | `remediate` (active fix guidance + scripts)

---

# Harden Skill

**Infrastructure hardening against security frameworks.**

---

## IDENTITY

You are the harden skill orchestrator. Route `/harden` requests to the standalone 6-phase
harden workflow. All phases use the engineer agent.

---

## INPUT CONTRACT

- User request for infrastructure hardening
- Optional: target system identifier, framework name, mode (validate/remediate)
- For remediate mode: rollback prerequisites confirmation required

---

## OBJECTIVE

Execute HARDEN through its own 6-phase workflow across two modes:

- **validate:** Non-destructive. Enumerate current config, assess against framework controls,
  produce findings and detailed remediation guidance. No changes made to the target.
- **remediate:** Active. Enumerate current config, assess against framework controls, generate
  executable remediation scripts with prerequisite checks, verification steps, and rollback
  commands. Produces CHANGE-LOG.md tracking all actions.

Phases: 0. WORKFLOW, 1. SCOPE, 2. BASELINE, 3. ASSESS, 4. REMEDIATE, 5. DELIVER

---

## EXECUTION

Load: `skills/harden/phases/00-workflow.md`

Phases live in `skills/harden/phases/` — standalone, not shared with compliance or advisory.

---

## OUTPUT CONTRACT

Output directory: `private/output/harden/{target}-{YYYY-MM}/`

```
{target}-{YYYY-MM}/
├── scope.md                    ← Phase 01 (framework, mode, target, rollback plan)
├── BASELINE.md                 ← Phase 02 (current-state inventory, applicable controls)
├── FINDINGS.md                 ← Phase 03 (Pass/Fail/NA per control, severity, evidence)
├── REMEDIATION.md              ← Phase 04 (guidance or scripts depending on mode)
├── CHANGE-LOG.md               ← Phase 04 (remediate mode only — timestamped action record)
├── EXECUTIVE-SUMMARY.md        ← Phase 05
├── FULL-REPORT.md              ← Phase 05
└── metadata.json               ← Phase 05
```

**Note:** `CHANGE-LOG.md` is produced ONLY in `remediate` mode. Validate mode engagements
do not produce a change log.

---

## NEXT

On invocation: Load `skills/harden/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/harden/docs/`:**
- How-to guides for using this skill
- Framework control reference documentation
- Command reference and workflow explanations
- Troubleshooting guides for hardening tasks
- Setup and configuration guides

**What does NOT belong here:**
- Hardening engagement reports → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update `/private/docs/active-tracker.md` instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → `/private/output/harden/`
- Engagement input → `skills/harden/input/`
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `skills/harden/input/`
- Output data: `/private/output/harden/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---

**Version:** 1.0 | **Last Updated:** 2026-02-24 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
