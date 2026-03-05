---
name: incident
description: Incident response — active IR documentation, tabletop exercise facilitation, and post-incident review across NIST SP 800-61r3, ISO 27001, PCI DSS, HIPAA, FedRAMP, and General frameworks.
agent: security
classification: public
effort_default: STANDARD
version: 1.0
last_updated: 2026-02-24
---

> **DUAL-AGENT ROUTING — READ THIS FIRST**
>
> Mode determines agent selection at the COMMAND LAYER. Phases execute inside the already-selected agent — no mid-workflow switching.
>
> | Mode | Agent | Phases |
> |------|-------|--------|
> | active | `security` | 00 → 01 → 02 → 03 → 04 → 05 |
> | tabletop | `security` | 00 → 01 → 02 → 03 → 04 → 05 |
> | review | `advisor` | 00 → 01 → 02 → 03 → 04 → 05 |
>
> All three modes share the same phase files. Phases branch internally by mode using
> `[active]`, `[tabletop]`, and `[review]` execution blocks.
>
> Mode is recorded in `metadata.json` at Phase 01. All subsequent phases read mode from there.

---

# Incident Skill

**Incident response — active IR, tabletop facilitation, and post-incident review.**

---

## IDENTITY

You are the incident response orchestrator. Route `/incident` requests to the 5-phase incident
workflow, selecting the correct agent based on the mode flag provided by the user.

---

## INPUT CONTRACT

- User invocation of `/incident [mode]` with optional incident context
- Mode: `active` (live incident), `tabletop` (exercise), or `review` (post-incident)
- Optional: incident ID, severity, framework selection, scenario description

---

## OBJECTIVE

Execute INCIDENT through a 5-phase workflow across three modes:

- **active**: Live incident — containment, investigation, eradication, communications, recovery, final report
- **tabletop**: Facilitated exercise — scenario injection, decision points, after-action capture
- **review**: Post-incident — reconstruction, root cause analysis, lessons learned, program improvements

Phases: 1. INTAKE, 2. RESPOND, 3. COMMUNICATE, 4. RECOVER, 5. DELIVER

---

## EXECUTION

Load: `skills/incident/phases/00-workflow.md`

Phases live in `skills/incident/phases/` — standalone, zero references to compliance skill.

---

## OUTPUT CONTRACT

Output directory: `private/output/incident/{incident-id}-{YYYY-MM}/`

```
{incident-id}-{YYYY-MM}/
├── intake.md                   ← Phase 01 (all modes)
├── TIMELINE.md                 ← Phase 02 (active/review) | not produced in tabletop
├── SCENARIO.md                 ← Phase 02 (tabletop) | not produced in active/review
├── RESPONSE-LOG.md             ← Phase 02 (all modes)
├── COMMUNICATIONS.md           ← Phase 03 (all modes)
├── LESSONS-LEARNED.md          ← Phase 04 (all modes)
├── RECOVERY-PLAN.md            ← Phase 04 (active/review) | not produced in tabletop
├── INCIDENT-REPORT.md          ← Phase 05 (all modes)
├── ACTION-ITEMS.md             ← Phase 05 (all modes)
└── metadata.json               ← Phase 01 (mode + framework recorded here)
```

---

## NEXT

On invocation: Load `skills/incident/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/incident/docs/`:**
- How-to guides for running tabletop exercises with this skill
- Framework-specific guidance for IR notification timelines
- Scenario library or inject templates
- Troubleshooting guides

**What does NOT belong here:**
- Active incident records → `private/output/incident/`
- Input briefs or scenario files → `private/input/incident/`
- Working notes → delete (git history captures work)
- Progress tracking → update `private/docs/active-tracker.md` instead

**Skill data locations:**
- Input data: `private/input/incident/`
- Output data: `private/output/incident/`

---

## Standards Alignment

This skill's phase structure is a **custom operational model** informed by — but not a strict
implementation of — NIST SP 800-61r3.

| Skill Phase | NIST SP 800-61r3 Stage | Notes |
|------------|------------------------|-------|
| 01 INTAKE | Detection & Analysis (initiation) | Incident discovery and classification |
| 02 RESPOND | Containment → Eradication → Recovery | Three NIST stages consolidated into one operational phase |
| 03 COMMUNICATE | Post-Incident Activity (notifications) | Communications extracted as a distinct phase for regulatory compliance emphasis |
| 04 RECOVER | Recovery + Post-Incident (lessons learned) | Combines NIST Recovery with lessons learned activities |
| 05 DELIVER | Post-Incident Activity (reporting) | Final report and action items |

**NIST SP 800-61r3 Preparation stage (Stage 1)** is intentionally excluded — this skill assumes
IR capability is already established. Use this skill to execute IR, not to build IR programs.

**ISO 27035** (Information Security Incident Management) is also supported. The skill's
containment → eradication → recovery sequencing aligns with ISO 27035's five-stage model
(Plan → Detect → Assess → Respond → Learn). ISO 27001:2022 Annex A.5.24–A.5.28 controls
are addressed inline in Phase 03 (Communicate).

---

**Version:** 1.0 | **Last Updated:** 2026-02-24 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
