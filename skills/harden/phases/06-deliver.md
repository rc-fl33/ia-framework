---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: last
---

# Phase 6: DELIVER (Executive Summary, Full Report, Metadata)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Assemble the final deliverables for the hardening engagement.
Produce an executive summary suitable for leadership, assemble the full report from all
phase outputs, and finalize metadata.json. When RE-FINDINGS.md exists (Phase 5 re-assessment
was conducted), include the before/after improvement comparison in all deliverables.

**Additional constraints:** This phase synthesizes — it does not discover new findings.
All findings come from FINDINGS.md (initial) and optionally RE-FINDINGS.md (post-remediation).
Do not add findings or modify assessments in this phase.

---

## INPUT CONTRACT

**Receives:**
- scope.md (target, framework, mode, engagement dates)
- BASELINE.md (system inventory)
- FINDINGS.md (initial control assessments)
- REMEDIATION.md (guidance or scripts from Phase 04)
- RE-FINDINGS.md (post-remediation assessment — optional, from Phase 05)
- IMPROVEMENT-SUMMARY.md (before/after comparison — optional, from Phase 05)
- CHANGE-LOG.md (if remediate mode — tracks which scripts were applied)
- Mode (validate | remediate)
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- REMEDIATION.md exists in output directory
- All Phase 01–04 files readable
- Phase 05 (RE-ASSESS) complete if re-assessment was conducted

**Source:** `skills/harden/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce professional-quality final deliverables that communicate hardening
posture clearly to both technical and non-technical audiences. When re-assessment data is
available, show the full remediation cycle: initial state → scripts applied → verified state.

**Success criteria:**
- EXECUTIVE-SUMMARY.md written (non-technical, suitable for leadership)
- FULL-REPORT.md written (complete assembled report for technical audience)
- Before/after comparison included when RE-FINDINGS.md is available
- metadata.json finalized with completion timestamps and all findings counts
- User receives clear final summary with deliverable locations

**Failure criteria:**
- Required phase files missing → Loop back to missing phase
- Cannot read prior phase outputs → STOP with file path guidance

---

## METHODOLOGY

**Audience split.** EXECUTIVE-SUMMARY.md is for leadership — avoid technical jargon,
emphasize risk posture, business impact, and prioritized action items. FULL-REPORT.md is
for the technical team — include all evidence, commands, and configuration details.

**Re-assessment data enriches the report.** When Phase 05 was conducted:
- The executive summary leads with the improvement delta ("We resolved X of Y critical findings")
- The full report includes a before/after comparison table
- IMPROVEMENT-SUMMARY.md is embedded in the final report

**If no re-assessment was conducted:** Report operates in assessment-only mode (same as the
original Phase 5 behavior). Note that remediation scripts are ready to apply and a re-assessment
can be conducted after application.

---

## EXECUTION

### Step 1: Verify Phase Outputs

**Tool:** Glob or Read

Verify that all required phase output files exist:

```
private/output/harden/{target}-{YYYY-MM}/scope.md         ← Phase 01
private/output/harden/{target}-{YYYY-MM}/BASELINE.md      ← Phase 02
private/output/harden/{target}-{YYYY-MM}/FINDINGS.md      ← Phase 03
private/output/harden/{target}-{YYYY-MM}/REMEDIATION.md   ← Phase 04
```

Optional (from Phase 05 re-assessment):
```
private/output/harden/{target}-{YYYY-MM}/RE-FINDINGS.md       (if re-assessed)
private/output/harden/{target}-{YYYY-MM}/IMPROVEMENT-SUMMARY.md (if re-assessed)
```

If mode = remediate, also check:
```
private/output/harden/{target}-{YYYY-MM}/CHANGE-LOG.md    ← Phase 04 (remediate only)
```

Note whether RE-FINDINGS.md exists — this determines whether to include before/after comparison.

**Expected output:** All required files confirmed present; re-assessment availability noted

### Step 2: Load Findings Data

**Tool:** Read

Read FINDINGS.md and extract initial findings summary (total, pass, fail, na, by severity).

If RE-FINDINGS.md exists, also read it and extract post-remediation findings summary.

**Expected output:** Findings data loaded (initial and post-remediation if available)

### Step 3: Write EXECUTIVE-SUMMARY.md

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/EXECUTIVE-SUMMARY.md`:

```markdown
# Hardening Executive Summary: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** {validate|remediate}
**Assessment Conducted By:** Engineer Agent (IA Framework)

---

## Engagement Overview

{1–2 paragraph plain-language description of what was assessed, the framework used,
and the mode of engagement. No jargon. Suitable for a non-technical reader.}

---

{[IF RE-FINDINGS.md exists — include this section]}
## Remediation Campaign Results

This engagement completed a full remediation cycle:
initial assessment → scripts applied → verification re-assessment.

| Metric | Before Remediation | After Remediation | Improvement |
|--------|-------------------|------------------|-------------|
| FAIL controls | {initial_fail} | {post_fail} | **-{resolved} resolved** |
| Critical failures | {initial_critical} | {post_critical} | **-{n}** |
| High failures | {initial_high} | {post_high} | **-{n}** |
| PASS controls | {initial_pass} | {post_pass} | **+{n}** |

**{n} of {total_initial_fail} identified issues were resolved.**

---
{[END RE-FINDINGS section]}

## Hardening Posture {[if re-assessed: "— Final State"]}

| Metric | Value |
|--------|-------|
| Controls Assessed | {N} |
| Passed | {N} ({%}%) |
| Failed | {N} ({%}%) |
| Not Applicable | {N} |

| Severity | Failures |
|----------|----------|
| Critical | {N} |
| High | {N} |
| Medium | {N} |
| Low | {N} |

**Overall Posture:** {Excellent (>90% pass, 0 critical) | Good (>75% pass, 0 critical) |
Needs Attention (>50% pass or critical present) | At Risk (<50% pass or multiple critical)}

---

## Top Priority Items {[if no re-assess: "Remaining After Remediation"]}

{List top 5 P0/P1 findings (from RE-FINDINGS if available, else FINDINGS) in plain language.}

1. **{Control Name}** (Critical/High) — {1 sentence plain-language description of risk}
2. **{Control Name}** (Critical/High) — {1 sentence plain-language description of risk}

---

## Recommended Action

{[validate mode, no re-assess]}
Review REMEDIATION.md for step-by-step guidance on addressing all {N} findings.
Address Critical and High items immediately through your change management process.
After applying changes, run Phase 5 re-assessment to verify effectiveness.

{[remediate mode, no re-assess]}
Executable remediation scripts are ready in REMEDIATION.md. Apply P0 scripts immediately
following rollback prerequisites in scope.md. Update CHANGE-LOG.md as scripts are applied.
After applying scripts, run Phase 5 re-assessment to verify effectiveness.

{[re-assessment conducted]}
{N} of {N} findings were resolved. {N} items remain. See remaining failures in RE-FINDINGS.md
for continued remediation guidance.

---

## Full Technical Details

See `FULL-REPORT.md` in this directory for the complete technical assessment.
```

**Expected output:** EXECUTIVE-SUMMARY.md written to output directory

### Step 4: Write FULL-REPORT.md

**Tool:** Write

Assemble FULL-REPORT.md by combining all phase outputs.
Write `private/output/harden/{target}-{YYYY-MM}/FULL-REPORT.md`:

```markdown
# Hardening Full Report: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** {validate|remediate}
**Re-assessment conducted:** {Yes / No}
**Report Generated:** {YYYY-MM-DDTHH:MM:SSZ}

---

## Table of Contents

1. [Engagement Scope](#engagement-scope)
2. [Baseline Configuration](#baseline-configuration)
3. [Initial Findings](#initial-findings)
4. [Remediation](#remediation)
{[if re-assessed]}
5. [Re-Assessment Results](#re-assessment-results)
6. [Improvement Summary](#improvement-summary)
{[end if]}
7. [Appendix: Metadata](#appendix-metadata)

---

## 1. Engagement Scope

{Full contents of scope.md}

---

## 2. Baseline Configuration

{Full contents of BASELINE.md}

---

## 3. Initial Findings

{Full contents of FINDINGS.md}

---

## 4. Remediation

{Full contents of REMEDIATION.md}

{[remediate mode only]}
### Change Log

{Full contents of CHANGE-LOG.md}

---

{[if RE-FINDINGS.md exists]}
## 5. Re-Assessment Results

{Full contents of RE-FINDINGS.md}

---

## 6. Improvement Summary

{Full contents of IMPROVEMENT-SUMMARY.md}

---
{[end if]}

## Appendix: Metadata

{Full contents of metadata.json as formatted JSON block}
```

**Expected output:** FULL-REPORT.md written to output directory

### Step 5: Finalize metadata.json

**Tool:** Read, Write

Update metadata.json with final completion data:

```json
{
  "target": "{hostname/IP}",
  "os": "{OS and version}",
  "framework": "{selected framework}",
  "mode": "{validate|remediate}",
  "engagement_start": "{YYYY-MM-DD}",
  "engagement_complete": "{YYYY-MM-DD}",
  "phases_completed": ["scope", "baseline", "assess", "remediate", "re-assess", "deliver"],
  "re_assessment_conducted": true,
  "findings_summary": {
    "initial": {
      "total": "{N}", "pass": "{N}", "fail": "{N}", "na": "{N}",
      "critical": "{N}", "high": "{N}", "medium": "{N}", "low": "{N}"
    },
    "post_remediation": {
      "total": "{N}", "pass": "{N}", "fail": "{N}", "na": "{N}",
      "critical": "{N}", "high": "{N}", "medium": "{N}", "low": "{N}"
    },
    "resolved": "{N}",
    "remaining": "{N}"
  },
  "deliverables": [
    "scope.md", "BASELINE.md", "FINDINGS.md", "REMEDIATION.md",
    "RE-FINDINGS.md", "IMPROVEMENT-SUMMARY.md",
    "EXECUTIVE-SUMMARY.md", "FULL-REPORT.md", "metadata.json"
  ]
}
```

If re-assessment was not conducted, omit re-assessment fields and use single findings_summary.

**Expected output:** metadata.json finalized

### Step 6: Display Final Summary to User

**Tool:** Direct output

```
HARDEN ENGAGEMENT COMPLETE
==========================
Target:    {target}
Framework: {framework}
Mode:      {validate|remediate}
Date:      {YYYY-MM-DD}

{[if re-assessed]}
REMEDIATION RESULTS
  Initial failures:  {n}
  Resolved:          {n} ({%}%)
  Remaining:         {n}

{[end if]}
FINAL POSTURE
  Total assessed:  {N}
  Pass:            {N} ({%}%)
  Fail:            {N} ({%}%)
  N/A:             {N}

  Critical:        {N}
  High:            {N}
  Medium:          {N}
  Low:             {N}

DELIVERABLES
  private/output/harden/{target}-{YYYY-MM}/
  ├── scope.md
  ├── BASELINE.md
  ├── FINDINGS.md
  ├── REMEDIATION.md
  {[remediate mode]}
  ├── CHANGE-LOG.md
  {[if re-assessed]}
  ├── RE-FINDINGS.md
  ├── IMPROVEMENT-SUMMARY.md
  {[end if]}
  ├── EXECUTIVE-SUMMARY.md
  ├── FULL-REPORT.md
  └── metadata.json

NEXT STEPS
  {[validate mode, no re-assess]} Apply guidance from REMEDIATION.md through your change
    management process. Run /harden in remediate mode to generate executable scripts.
  {[remediate mode, no re-assess]} Apply scripts from REMEDIATION.md. Track in CHANGE-LOG.md.
    Then resume this engagement to run Phase 5 re-assessment and verify effectiveness.
  {[re-assessed, items remain]} Review remaining failures in RE-FINDINGS.md.
    {N} items still require remediation.
  {[re-assessed, all resolved]} All identified items resolved. Consider scheduling
    next assessment in 90 days.
```

---

## OUTPUT CONTRACT

**Produces:**
- `EXECUTIVE-SUMMARY.md` → `private/output/harden/{target}-{YYYY-MM}/EXECUTIVE-SUMMARY.md`
- `FULL-REPORT.md` → `private/output/harden/{target}-{YYYY-MM}/FULL-REPORT.md`
- `metadata.json` → updated with completion timestamps and final findings counts

---

## NEXT

**On success:** → Workflow complete. Display final summary to user.

**On missing phase output:** → Identify which file is missing, loop back to that phase.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All required phase output files verified present
- [ ] Findings summary loaded from FINDINGS.md (and RE-FINDINGS.md if available)
- [ ] EXECUTIVE-SUMMARY.md written with posture rating and top priority items
- [ ] FULL-REPORT.md assembled from all phase outputs (with before/after if re-assessed)
- [ ] metadata.json finalized with completion timestamps
- [ ] Final summary displayed to user with deliverable locations and next steps
- [ ] Workflow complete

**Error recovery:**
- If phase output file missing: Do not proceed — identify missing phase and loop back
- If RE-FINDINGS.md missing but expected: Proceed without it, note in report that re-assessment was skipped
- If findings data inconsistent: Re-read FINDINGS.md, recalculate counts

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
