---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: last
---

# Phase 5: DELIVER (Executive Summary, Full Report Assembly)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Assemble all prior phase outputs into a cohesive executive summary
and full report. Produce the metadata file. Present the final deliverables to the user with
a clear summary of top risks, treatment priorities, and recommended next steps.

**Additional constraints:** Do not reopen scoring or treatment decisions in this phase —
that requires returning to Phase 3 or 4. If the user identifies an error in the prior phases,
return to the appropriate phase, fix it, then re-run Phase 5.

---

## INPUT CONTRACT

**Receives:**
- All prior phase outputs from the output directory
- scope.md, ASSET-INVENTORY.md, THREAT-LANDSCAPE.md, RISK-ANALYSIS.md,
  RISK-REGISTER.md, RISK-TREATMENT-PLAN.md
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- RISK-REGISTER.md exists (Phase 4 complete)
- All prior phase outputs exist in the output directory

**Source:** `skills/risk-assess/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce the final deliverable package: executive summary, assembled full report,
and metadata file.

**Success criteria:**
- EXECUTIVE-SUMMARY.md written (1-2 pages, non-technical, board-ready)
- FULL-REPORT.md assembled from all phase outputs
- metadata.json written with counts and completion timestamps
- Final deliverables presented to user with action highlights

**Failure criteria:**
- Required prior phase outputs are missing → Return to appropriate phase
- Output directory not accessible → STOP with path guidance

---

## METHODOLOGY

**The executive summary is the primary deliverable for most stakeholders.** Write it
for a non-technical audience — no jargon, no scoring methodology explanation. Lead with
the business impact, not the technical vulnerability. Three sections: Top Risks, Treatment
Priorities, Recommended Next Steps.

**The full report is the technical record.** Assemble the prior phase outputs in order,
add a table of contents, and ensure internal references are consistent. Do not recreate
content that already exists in prior outputs — assemble, don't rewrite.

**Metadata.json is for programmatic use.** It enables the organization to track assessment
history, filter by framework, and count risks by severity over time.

---

## EXECUTION

### Step 1: Load All Prior Phase Outputs

**Tool:** Read

Load all outputs from the output directory:
- `private/output/risk-assess/{org}-{YYYY-MM}/scope.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/ASSET-INVENTORY.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/THREAT-LANDSCAPE.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/RISK-ANALYSIS.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/RISK-REGISTER.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/RISK-TREATMENT-PLAN.md`

Extract: org name, framework, risk distribution (Critical/High/Medium/Low counts), top risks
by score, treatment roadmap highlights, budget summary.

**Expected output:** All prior outputs loaded
**On failure:** Note which files are missing; return to the appropriate phase to complete them

### Step 2: Identify Top Risks and Key Themes

**Tool:** Direct analysis

From the risk register, identify:

1. **Top 5 risks by score** — The highest-scoring risk pairs (Critical and High)
2. **Most exposed assets** — Assets with multiple High or Critical risks
3. **Most significant control gaps** — Gaps affecting the highest-criticality assets
4. **Quick wins** — High-impact mitigations that are low cost or fast to implement
5. **Systemic themes** — Patterns across the risk register (e.g., "Identity and access
   management gaps account for 40% of Critical risks")

**Expected output:** Key themes and highlights extracted for executive summary
**On failure:** Use top 5 by risk score with no theme analysis

### Step 3: Write EXECUTIVE-SUMMARY.md

**Tool:** Write

Write the executive summary to:
`private/output/risk-assess/{org}-{YYYY-MM}/EXECUTIVE-SUMMARY.md`

Format (non-technical, board-ready, 1-2 pages):

```markdown
# Risk Assessment Executive Summary

**Organization:** {org}
**Assessment Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Prepared by:** Intelligence Adjacent Risk Assessment

---

## Overview

{2-3 sentences: What was assessed, why, and the overall risk posture finding.
Example: "This risk assessment evaluated [org]'s information assets across [scope].
The assessment identified [N] risks, including [N] Critical and [N] High risks requiring
immediate attention."}

---

## Risk Posture

| Risk Level | Count |
|-----------|-------|
| Critical | {n} |
| High | {n} |
| Medium | {n} |
| Low | {n} |
| **Total** | **{n}** |

**Overall Risk Posture:** {High / Elevated / Moderate / Low}
{1-2 sentences explaining the overall posture in business terms.}

---

## Top 5 Risks

### 1. {Risk Name} — Critical
**What it means:** {Business impact in non-technical language}
**Root cause:** {1 sentence}
**Treatment:** {Mitigate / Transfer / Accept / Avoid} — {brief description}
**Timeline:** {timeframe}

### 2. {Risk Name} — Critical/High
...

---

## Treatment Priorities

### Immediate Actions (Next 30 Days)
1. {Action} — {Owner} — {estimated cost}
2. ...

### Near-Term (30-90 Days)
1. {Action} — {Owner} — {estimated cost}
2. ...

### Strategic Investments (90+ Days)
1. {Action} — {Owner} — {estimated cost}
2. ...

**Total Estimated Investment:** {budget summary}

---

## Recommended Next Steps

1. {Specific, actionable next step with owner and timeline}
2. {Specific, actionable next step}
3. {Specific, actionable next step}

---

## About This Assessment

This assessment used the {framework} methodology. Likelihood and impact were scored
on a 1-5 scale. Risk levels: Critical (20-25), High (10-19), Medium (5-9), Low (1-4).
Full methodology and risk register details are in the accompanying full report.
```

**Expected output:** EXECUTIVE-SUMMARY.md written
**On failure:** Write with available data; flag any sections requiring additional information

### Step 4: Assemble FULL-REPORT.md

**Tool:** Read (prior phase outputs), Write

Assemble the complete report by combining all prior phase outputs in order. Add a table of
contents and a consistent header. Do not rewrite content — reference or paste the prior
phase output content directly.

Write the full report to:
`private/output/risk-assess/{org}-{YYYY-MM}/FULL-REPORT.md`

Structure:

```markdown
# Risk Assessment — Full Report

**Organization:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Classification:** Confidential

---

## Table of Contents

1. Executive Summary
2. Scope and Methodology
3. Asset Inventory
4. Threat Landscape
5. Risk Analysis
6. Risk Register
7. Risk Treatment Plan
8. Appendix

---

## 1. Executive Summary

{Paste EXECUTIVE-SUMMARY.md content}

---

## 2. Scope and Methodology

{Paste scope.md content}

---

## 3. Asset Inventory

{Paste ASSET-INVENTORY.md content}

---

## 4. Threat Landscape

{Paste THREAT-LANDSCAPE.md content}

---

## 5. Risk Analysis

{Paste RISK-ANALYSIS.md content}

---

## 6. Risk Register

{Paste RISK-REGISTER.md content}

---

## 7. Risk Treatment Plan

{Paste RISK-TREATMENT-PLAN.md content}

---

## 8. Appendix

### A. Scoring Methodology Reference

**Likelihood Scale:** 1 (Rare) to 5 (Almost Certain)
**Impact Scale:** 1 (Negligible) to 5 (Catastrophic)
**Risk Level = Likelihood × Impact**
Critical: 20-25 | High: 10-19 | Medium: 5-9 | Low: 1-4

### B. Framework Reference

{Brief description of the selected framework and key references}
```

**Expected output:** FULL-REPORT.md assembled
**On failure:** Build from whatever phase outputs are available; note missing sections

### Step 5: Write metadata.json

**Tool:** Write

Write the metadata file to:
`private/output/risk-assess/{org}-{YYYY-MM}/metadata.json`

```json
{
  "org": "{org}",
  "framework": "{framework}",
  "assessment_date": "{YYYY-MM-DD}",
  "output_directory": "private/output/risk-assess/{org}-{YYYY-MM}",
  "phases_completed": {
    "01_scope": "{YYYY-MM-DD or null}",
    "02_identify": "{YYYY-MM-DD or null}",
    "03_analyze": "{YYYY-MM-DD or null}",
    "04_prioritize": "{YYYY-MM-DD or null}",
    "05_deliver": "{YYYY-MM-DD}"
  },
  "risk_counts": {
    "critical": {n},
    "high": {n},
    "medium": {n},
    "low": {n},
    "total": {n}
  },
  "treatment_counts": {
    "mitigate": {n},
    "accept": {n},
    "transfer": {n},
    "avoid": {n}
  },
  "assets_assessed": {n},
  "estimated_total_investment": "{budget range}",
  "skill_version": "1.0",
  "framework_tool": "Intelligence Adjacent (IA)"
}
```

**Expected output:** metadata.json written
**On failure:** Write with available data; use null for unknown counts

### Step 6: Present Final Deliverables

**Tool:** Direct conversation

Present the completed deliverables to the user:

```
RISK ASSESSMENT COMPLETE

Organization: {org}
Framework: {framework}
Date: {YYYY-MM-DD}

Risk Summary:
  Critical: {n}  High: {n}  Medium: {n}  Low: {n}

Output Files:
  private/output/risk-assess/{org}-{YYYY-MM}/EXECUTIVE-SUMMARY.md
  private/output/risk-assess/{org}-{YYYY-MM}/FULL-REPORT.md
  private/output/risk-assess/{org}-{YYYY-MM}/RISK-REGISTER.md
  private/output/risk-assess/{org}-{YYYY-MM}/RISK-TREATMENT-PLAN.md
  private/output/risk-assess/{org}-{YYYY-MM}/metadata.json
  (+ 4 supporting files from Phases 01-03)

Top Priority Actions:
  1. {Critical risk 1} — {Owner} — Due: {date}
  2. {Critical risk 2} — {Owner} — Due: {date}
  3. {High risk 1} — {Owner} — Due: {date}

Next Steps:
  - Schedule risk owner review meetings
  - Begin Immediate (0-30 day) treatment actions
  - Set 90-day review date for register updates
```

**Expected output:** Final deliverables presented to user
**On failure:** Display whatever is available; list any missing files

### Step 7: Verify Final Deliverables

**Tool:** Glob
**Pattern:** `private/output/risk-assess/{org}-{YYYY-MM}/*`

Confirm all 9 required files exist in the output directory.

**Expected output:** All files confirmed present
**On failure:** List missing files and the phase responsible for creating them

### Step 8: Generate Branded HTML Report

**Tool:** Bash

Run the bridge script to produce the branded HTML deliverable:

```bash
bun skills/risk-assess/scripts/markdown-bridge.ts \
  --output-dir private/output/risk-assess/{org}-{YYYY-MM}/
```

**On success:** `risk-assessment-report.html` appears in the output directory.
**On failure:** Log the error and continue — markdown deliverables are complete. HTML is additive; do not block completion.

---

## OUTPUT CONTRACT

**Produces:**
- `EXECUTIVE-SUMMARY.md` → `private/output/risk-assess/{org}-{YYYY-MM}/EXECUTIVE-SUMMARY.md`
- `FULL-REPORT.md` → `private/output/risk-assess/{org}-{YYYY-MM}/FULL-REPORT.md`
- `metadata.json` → `private/output/risk-assess/{org}-{YYYY-MM}/metadata.json`
- `risk-assessment-report.html` → `private/output/risk-assess/{org}-{YYYY-MM}/risk-assessment-report.html` (branded HTML, auto-generated)

**Format:**
- EXECUTIVE-SUMMARY.md: Non-technical markdown, 1-2 pages, board-ready
- FULL-REPORT.md: Technical markdown, all phase outputs assembled
- metadata.json: Structured JSON for programmatic access

---

## NEXT

**On success:** → Workflow complete. All deliverables in output directory.

**On missing prior outputs:** → Return to the phase that should have produced the missing file.

**On user corrections:** → Return to the appropriate phase (03-analyze.md or 04-prioritize.md)
to make corrections, then re-run Phase 5.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] EXECUTIVE-SUMMARY.md written with top risks and recommended next steps
- [ ] FULL-REPORT.md assembled from all phase outputs with table of contents
- [ ] metadata.json written with org, framework, date, and risk counts
- [ ] Final deliverables presented to user with action highlights
- [ ] All 9 output files confirmed present via Glob
- [ ] Workflow complete

**Error recovery:**
- If prior phase outputs are missing: Return to the appropriate phase; do not fabricate content
- If risk counts differ from register: Recount from RISK-REGISTER.md; use actual counts
- If budget summary unavailable: Use "See RISK-TREATMENT-PLAN.md" as placeholder
- If write fails: Check output directory path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
