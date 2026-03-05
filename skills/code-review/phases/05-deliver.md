---
domain: code-review
skill: code-review
agent: developer
model: sonnet
mode: single-agent
complexity: low
chain_position: last
---

# Phase 5: DELIVER (Presentation and Follow-up)

## IDENTITY

**Agent:** `agents/developer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Present deliverables to the user, highlight critical findings, offer follow-up commands, and capture feedback. Ensure the user leaves with clear understanding of findings and actionable next steps.

**Additional constraints:** This is the final phase. No new analysis or recommendations. Focus on presentation, clarity, and follow-up guidance. Every critical finding (P0) must be explicitly highlighted. Always offer relevant follow-up commands.

---

## INPUT CONTRACT

**Receives:**
- All deliverable files from Phase 4 in `private/output/code-review/{project}-{YYYY-MM-DD}/`
- Metadata from metadata.json
- Finding counts and severity breakdown

**Prerequisites:**
- Phase 4 (DOCUMENT) completed
- All deliverables created and quality-checked
- Output directory contains complete deliverable set

**Source:** `skills/code-review/phases/04-document.md`

---

## OBJECTIVE

**Goal:** Present the complete code-review engagement results to the user with clear summary, critical item emphasis, and actionable follow-up guidance.

**Success criteria:**
- Deliverables summary presented with file locations
- Critical findings (P0) explicitly highlighted
- Follow-up commands suggested based on findings
- User can access and understand all output files
- Engagement marked complete

**Failure criteria:**
- User identifies issues with deliverables → Return to Phase 4 to fix
- Critical findings not highlighted → Correct presentation before completing

---

## METHODOLOGY

**Phase 5 is the handoff.** The user should walk away knowing exactly what was found, where the reports are, what to fix first, and what tools to use next.

**Critical items get special attention.** P0 findings represent immediate risks. They must be presented prominently and not buried in a summary table.

**Follow-up suggestions convert findings to action.** A code review finding vulnerabilities should suggest `/pentest` for validation. Compliance gaps should suggest `/compliance`. Infrastructure issues suggest `/harden`.

---

## EXECUTION

### Step 1: Present Deliverables Summary

**Tool:** Read (verify output directory), direct output to user

Present a clear summary of what was created:

```
Code Review Engagement Complete

Project: [Name]
Date: YYYY-MM-DD

Primary Deliverable
code-review-report.html — Branded HTML report (open in browser)
FULL-REPORT.md          — Consolidated markdown report

All Deliverables

| File | Description |
|------|-------------|
| code-review-report.html | Branded HTML report — open in browser (if generated) |
| FULL-REPORT.md | Consolidated markdown report (complete reference) |
| [file1] | [description] |
| [file2] | [description] |
| ... | ... |

Location: private/output/code-review/{project}-{YYYY-MM-DD}/
```

**Expected output:** Summary table with FULL-REPORT.md highlighted as primary deliverable
**On failure:** If any file missing, return to Phase 4

### Step 2: Highlight Critical Items

**Tool:** Direct analysis (from Phase 3/4 output)

If P0 (Critical) findings exist, present them prominently:

```
Critical Findings Requiring Immediate Attention

| # | Finding | Priority | Recommendation |
|---|---------|----------|----------------|
| 1 | [Critical finding] | P0 | [Immediate action] |
| 2 | [Critical finding] | P0 | [Immediate action] |
```

If no P0 findings exist, summarize the highest-priority items.

**Expected output:** Critical items highlighted for user attention
**On failure:** If no findings at all, present clean assessment summary

### Step 3: Provide Key Statistics

**Tool:** Direct analysis (from metadata.json or findings)

```
Key Statistics

- Total Findings: [n]
- Critical (P0): [n]
- High (P1): [n]
- Medium (P2): [n]
- Low (P3): [n]
- Recommendations: [n]
```

**Expected output:** Finding statistics presented
**On failure:** Count manually from deliverable files

### Step 4: Offer Follow-up Commands

**Tool:** Direct analysis (based on findings)

Based on the engagement results, suggest relevant next steps:

| Scenario | Suggested Follow-up |
|----------|---------------------|
| Critical vulnerabilities found | `/pentest` for validation testing |
| Compliance gaps identified | `/compliance` for full framework assessment |
| Infrastructure issues | `/harden` for remediation implementation |
| Code issues found | Schedule fix sprint; `/code-review` after fixes |

**Expected output:** Relevant follow-up commands suggested
**On failure:** Offer general next-step guidance

### Step 5: Capture Feedback

**Tool:** Direct conversation with user

Ask for feedback:
- Was the scope appropriate?
- Were findings accurate?
- Were recommendations actionable?
- Any additional questions?

**Expected output:** Feedback captured (if user provides)
**On failure:** Not a blocker — user feedback is optional

### Step 6: Display Completion Message & Final Checklist

```
[SKILL:code-review] completed for {project}

Deliverables: private/output/code-review/{project}-{YYYY-MM-DD}/
```

**AFTER THIS STEP:** Display the grand summary using the workflow-level format.

---

## OUTPUT CONTRACT

**Produces:**
- Verbal delivery to user (no additional files created by this phase)
- All deliverables from Phase 4 remain in `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Format:** Structured summary displayed to user with deliverable locations, critical items, statistics, and follow-up guidance

---

## NEXT

**On success:** → Workflow complete. No further phases.

**On user requesting changes:** → Return to Phase 4 to edit specific deliverables.

**On user requesting additional analysis:** → Start new workflow for different scope.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Deliverables summary presented to user
- [ ] Critical findings (P0) highlighted (if any exist)
- [ ] Key statistics presented
- [ ] Follow-up commands suggested based on findings
- [ ] User can access all output files
- [ ] Completion message displayed
- [ ] Engagement complete

**Error recovery:**
- If user wants changes to deliverables: Return to Phase 4, edit specific file
- If deliverable files missing: Return to Phase 4 to recreate
- If user identifies inaccurate findings: Return to Phase 2 to re-analyze
- If no findings to present: Present clean assessment with positive posture summary

---

## Post-Workflow

After Phase 5, the user may:
- Request adjustments to any deliverable
- Ask for deeper analysis on specific findings
- Provide feedback on the engagement
- Use follow-up commands suggested in Step 4

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
