---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: medium
chain_position: last
---

# Phase 05: DELIVER

## IDENTITY

**Agent:** `security` (active/tabletop) or `advisor` (review) — set at command layer.

**Phase-specific role:** Assemble the final incident report, produce the prioritized action
items list, update metadata.json with completion data, and present the deliverables to the
user with a summary of key findings.

**Additional constraints:** Read mode and framework from metadata.json. The report format
varies by mode — active produces a formal IR report suitable for regulatory submission,
tabletop produces an exercise debrief, and review produces a post-incident review report.

---

## INPUT CONTRACT

**Receives:**
- Mode from metadata.json (active/tabletop/review)
- Framework from metadata.json
- All prior phase deliverables in output directory:
  - intake.md (Phase 01)
  - TIMELINE.md or SCENARIO.md (Phase 02)
  - RESPONSE-LOG.md (Phase 02)
  - COMMUNICATIONS.md (Phase 03)
  - LESSONS-LEARNED.md (Phase 04)
  - RECOVERY-PLAN.md (Phase 04, active/review)

**Prerequisites:**
- LESSONS-LEARNED.md exists in output directory
- All prior phase deliverables present

**Source:** `skills/incident/phases/00-workflow.md` (via 04-recover.md completion)

---

## OBJECTIVE

**Goal:** Produce the final INCIDENT-REPORT.md, ACTION-ITEMS.md, and updated metadata.json
that closes out the incident response workflow.

**Success criteria:**
- INCIDENT-REPORT.md written (format appropriate for mode)
- ACTION-ITEMS.md written with prioritized, owned improvements
- metadata.json updated with completion data, phase timestamps, final severity, lessons count
- User receives final summary with file list and key findings

**Failure criteria:**
- Required prior deliverables are missing → Flag which files are missing, offer to generate
  stubs so the report can be completed

---

## METHODOLOGY

**The report is the permanent record.** Active IR reports may be submitted to regulators,
reviewed by auditors, and used in legal proceedings. They must be factual, precise, and
clearly distinguish confirmed findings from inferences or estimates.

**Action items must be ownable.** Vague recommendations like "improve security" have no
accountability. Each action item must have a named owner, a deadline, and measurable
success criteria. If an owner cannot be named, flag it for assignment.

**Tabletop debrief tone is forward-looking.** Focus on what the exercise revealed and what
the team should change — not on grading performance. The debrief is a coaching document,
not an assessment report.

---

## EXECUTION

### Step 1: Assemble Report Content

**Tool:** Read

Read all prior phase deliverables to assemble report content:
- intake.md → incident summary, severity, scope, stakeholders
- TIMELINE.md / SCENARIO.md → chronological record
- RESPONSE-LOG.md → actions taken
- COMMUNICATIONS.md → regulatory notifications, communication record
- LESSONS-LEARNED.md → systemic findings and recommendations
- RECOVERY-PLAN.md → recovery sequence and RTO/RPO performance (active/review)

Note any gaps or missing information that must be flagged in the report.

**Expected output:** All source content available for report assembly

---

### Step 2: Write INCIDENT-REPORT.md

**Tool:** Write
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/INCIDENT-REPORT.md`

---

**[active] FORMAT: Formal Incident Response Report**

```markdown
# Incident Response Report

**Incident ID:** {incident-id}
**Classification:** CONFIDENTIAL — ATTORNEY-CLIENT PRIVILEGED (if applicable)
**Date of Report:** {YYYY-MM-DD}
**Prepared By:** {IR team / organization}
**Framework:** {selected framework}

---

## Executive Summary

{3-5 sentences: what happened, when, what was affected, how it was resolved, key outcomes}

**Severity:** {P1|P2|P3|P4} — {Critical|High|Medium|Low}
**Status:** {Resolved | Ongoing | Monitoring}
**Regulatory Notifications Required:** {Yes — see Section 5 | No}

---

## Incident Timeline

{Condensed version of TIMELINE.md — key events only, with timestamps}

---

## Scope and Impact

### Systems Affected
{From intake.md — in-scope systems}

### Data Affected
{What data was accessed, modified, or exfiltrated — confirmed vs. inferred}

### Business Impact
{Service downtime, revenue impact, customer impact, regulatory exposure}

---

## Response Summary

### Containment
{What was done to stop the spread — from RESPONSE-LOG.md}

### Investigation
{What was found — IOCs, attack vector, scope confirmation}

### Eradication
{How the threat was removed — from RESPONSE-LOG.md}

### Recovery
{How services were restored — from RECOVERY-PLAN.md, RTO/RPO performance}

---

## Regulatory Notifications

{From COMMUNICATIONS.md — which notifications were required, sent, and deadlines}

| Regulation | Notification Sent | Date Sent | Status |
|------------|-----------------|-----------|--------|

---

## Root Cause

{Root cause statement — what enabled this incident to occur}

---

## Lessons Learned Summary

{Top 3-5 lessons from LESSONS-LEARNED.md}

---

## Appendices

- Appendix A: Full Timeline → TIMELINE.md
- Appendix B: Response Log → RESPONSE-LOG.md
- Appendix C: Communications Record → COMMUNICATIONS.md
- Appendix D: Full Lessons Learned → LESSONS-LEARNED.md
- Appendix E: Recovery Plan → RECOVERY-PLAN.md
```

---

**[tabletop] FORMAT: Exercise Debrief Report**

```markdown
# Tabletop Exercise Debrief

**Exercise ID:** {incident-id}
**Date:** {YYYY-MM-DD}
**Facilitator:** {name}
**Participants:** {list}
**Scenario:** {brief description}
**Framework:** {selected framework}

---

## Executive Summary

{3-5 sentences: what the exercise tested, key findings, overall program maturity signal}

---

## Exercise Overview

### Scenario Summary
{From SCENARIO.md — what scenario was presented}

### Objectives
{What the exercise was designed to test}

### Inject Summary
{Key injects used and participant responses}

---

## Key Findings

### Strengths — What Worked Well
{Areas where the team demonstrated strong IR capability}

### Gaps — What Needs Improvement
{Gaps identified during decision points — process, tool, authority, communication gaps}

---

## Decision Point Analysis

{From SCENARIO.md — for each major decision point, what was decided and what gaps emerged}

---

## Regulatory and Communication Readiness

{Did participants know the notification timelines? Who approves external communications?
Were templates available?}

---

## RTO/RPO Gap Assessment

{From Phase 04 — gaps between published targets and actual recovery capability}

---

## Recommendations Summary

{Top 5-7 recommendations from LESSONS-LEARNED.md}

---

## Appendices

- Appendix A: Exercise Scenario and Inject Log → SCENARIO.md
- Appendix B: Decision Log → RESPONSE-LOG.md
- Appendix C: Full Lessons Learned → LESSONS-LEARNED.md
```

---

**[review] FORMAT: Post-Incident Review Report**

```markdown
# Post-Incident Review

**Incident ID:** {incident-id}
**Review Date:** {YYYY-MM-DD}
**Incident Date Range:** {start} to {resolution}
**Prepared By:** {reviewer / team}
**Framework:** {selected framework}

---

## Executive Summary

{3-5 sentences: what the incident was, root cause, program gaps revealed, key improvements}

---

## Incident Reconstruction

### Timeline
{Condensed chronological summary — from TIMELINE.md}

### Root Cause
{Root cause from Phase 02 RCA}

### Contributing Factors
{Control failures and systemic issues that enabled the incident}

---

## Impact Assessment

### Systems and Data
{Confirmed scope from intake.md and investigation in RESPONSE-LOG.md}

### Business Impact
{Downtime, financial, reputational, regulatory}

### Regulatory Impact
{Notifications sent, regulatory proceedings if any — from COMMUNICATIONS.md}

---

## Response Performance

### What Worked
{Controls and processes that performed as intended}

### What Failed
{Controls that failed — from Phase 02 control failure analysis}

### Timeline Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Time to Detect | | |
| Time to Contain | | |
| Time to Eradicate | | |
| Time to Restore | | |
| RTO — {service} | | |
| RPO — {service} | | |

---

## Systemic Findings

{From LESSONS-LEARNED.md — program-level findings, not just tactical fixes}

---

## Recommendations Summary

{Top recommendations from ACTION-ITEMS.md}

---

## Appendices

- Appendix A: Full Timeline → TIMELINE.md
- Appendix B: Response Log → RESPONSE-LOG.md
- Appendix C: Communications Record → COMMUNICATIONS.md
- Appendix D: Full Lessons Learned → LESSONS-LEARNED.md
- Appendix E: Recovery Plan → RECOVERY-PLAN.md
```

---

### Step 3: Write ACTION-ITEMS.md

**Tool:** Write
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/ACTION-ITEMS.md`

Compile prioritized action items from LESSONS-LEARNED.md and the report findings.

```markdown
# Action Items

**Incident ID:** {incident-id}
**Mode:** {active|tabletop|review}
**Generated:** {YYYY-MM-DD}

## Priority Definitions

- **Critical:** Addresses a control gap that directly enabled this incident. Implement immediately.
- **High:** Significantly reduces risk of recurrence or improves response capability.
- **Medium:** Program improvement with meaningful risk reduction.
- **Low:** Best practice improvement or minor gap.

## Action Items

| # | Priority | Action | Owner | Deadline | Success Criteria | Status |
|---|----------|--------|-------|---------|-----------------|--------|
| 1 | Critical | {specific action} | {name/role} | {YYYY-MM-DD} | {measurable outcome} | Open |
| 2 | High | | | | | Open |
| 3 | High | | | | | Open |
| 4 | Medium | | | | | Open |

## Unassigned Items (Require Owner Assignment)

| # | Priority | Action | Proposed Owner | Notes |
|---|----------|--------|---------------|-------|
```

---

### Step 4: Update metadata.json

**Tool:** Write (update)
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/metadata.json`

Update metadata.json with completion data:

```json
{
  "incident_id": "{incident-id}",
  "mode": "{active|tabletop|review}",
  "framework": "{selected framework}",
  "severity": "{P1|P2|P3|P4}",
  "status": "complete",
  "created": "{original timestamp}",
  "completed": "{YYYY-MM-DDThh:mm:ssZ}",
  "output_directory": "private/output/incident/{incident-id}-{YYYY-MM}/",
  "phases": {
    "01_intake": { "status": "complete", "timestamp": "{timestamp}" },
    "02_respond": { "status": "complete", "timestamp": "{timestamp}" },
    "03_communicate": { "status": "complete", "timestamp": "{timestamp}" },
    "04_recover": { "status": "complete", "timestamp": "{timestamp}" },
    "05_deliver": { "status": "complete", "timestamp": "{YYYY-MM-DDThh:mm:ssZ}" }
  },
  "lessons_count": {count of lessons from LESSONS-LEARNED.md},
  "action_items_count": {count from ACTION-ITEMS.md},
  "regulatory_notifications_required": {true|false},
  "files": [
    "intake.md",
    "TIMELINE.md or SCENARIO.md",
    "RESPONSE-LOG.md",
    "COMMUNICATIONS.md",
    "LESSONS-LEARNED.md",
    "RECOVERY-PLAN.md (active/review only)",
    "INCIDENT-REPORT.md",
    "ACTION-ITEMS.md",
    "metadata.json"
  ]
}
```

---

### Step 5: Present Final Summary

**Tool:** Direct output

Display final summary to user:

```
INCIDENT WORKFLOW COMPLETE
==========================
Incident ID: {incident-id}
Mode: {active|tabletop|review}
Framework: {framework}
Severity: {P1|P2|P3|P4}

Deliverables:
  private/output/incident/{incident-id}-{YYYY-MM}/
  ├── intake.md
  ├── {TIMELINE.md | SCENARIO.md}
  ├── RESPONSE-LOG.md
  ├── COMMUNICATIONS.md
  ├── LESSONS-LEARNED.md
  {├── RECOVERY-PLAN.md   (active/review)}
  ├── INCIDENT-REPORT.md
  ├── ACTION-ITEMS.md
  └── metadata.json

Key Numbers:
  Lessons Learned: {count}
  Action Items: {count} ({critical count} Critical, {high count} High)
  Regulatory Notifications Required: {Yes / No}
  {If Yes: List notifications and deadlines}

Critical Action Items:
  {List Critical priority action items with owners}

Next Steps:
  1. Review INCIDENT-REPORT.md and have Legal review before any regulatory submission
  2. Assign owners to unassigned action items in ACTION-ITEMS.md
  {3. Send regulatory notifications by deadlines shown in COMMUNICATIONS.md (if required)}
```

---

## OUTPUT CONTRACT

**Produces:**
- `INCIDENT-REPORT.md` → `private/output/incident/{incident-id}-{YYYY-MM}/INCIDENT-REPORT.md`
- `ACTION-ITEMS.md` → `private/output/incident/{incident-id}-{YYYY-MM}/ACTION-ITEMS.md`
- `metadata.json` updated with completion data

**Format:** Structured markdown reports; JSON metadata

---

## NEXT

**On workflow complete:** → Display final summary. Workflow finished.

**On missing prior deliverables:** → Identify missing files, offer to generate stubs so report
can proceed. Flag in report which sections are incomplete.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All prior deliverables read and assembled
- [ ] INCIDENT-REPORT.md written (format appropriate for mode)
- [ ] ACTION-ITEMS.md written with prioritized, owned action items
- [ ] metadata.json updated with completion data and final counts
- [ ] Final summary presented to user with file list and next steps

**Error recovery:**
- Missing prior deliverable → Generate stub with available data; flag as incomplete in report
- Cannot write file → Check path permissions; create directory if missing
- Action items have no owner → Document in "Unassigned Items" section

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
