---
domain: sec-review
skill: sec-review
agent: security
model: sonnet
mode: single-agent
complexity: low
chain_position: last
---

# Phase 5: DELIVER (Present Findings)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Present deliverables to the user, highlight critical findings, provide
key statistics, and capture feedback. Ensure the user leaves with clear understanding of
findings and where all output files are located.

**Additional constraints:** This is the final phase. No new analysis or recommendations. Focus
on presentation, clarity, and deliverable inventory. Every critical finding (P0) must be
explicitly highlighted. Do NOT suggest follow-up skills — this is a standalone skill.

---

## INPUT CONTRACT

**Receives:**
- All deliverable files from Phase 4 in `private/output/sec-review/{project}-{date}/`
- Domain selection (A always; B/C/D/E if selected)
- Metadata from metadata.json
- Finding counts and severity breakdown

**Prerequisites:**
- Phase 4 (DOCUMENT) completed
- All deliverables created and quality-checked
- Output directory contains complete deliverable set

**Source:** `skills/sec-review/phases/04-document.md`

---

## OBJECTIVE

**Goal:** Present the complete security review results to the user with clear summary, critical
item emphasis, and complete deliverable inventory.

**Success criteria:**
- Deliverables summary presented with file locations
- Critical findings (P0) explicitly highlighted
- Key statistics presented
- Diagram inventory presented
- User can access and understand all output files
- Engagement marked complete

**Failure criteria:**
- User identifies issues with deliverables → Return to Phase 4 to fix
- Critical findings not highlighted → Correct presentation before completing

---

## METHODOLOGY

**Phase 5 is the handoff.** The user should walk away knowing exactly what was found, where
the reports are, what to fix first, and the diagram assets available.

**Critical items get special attention.** P0 findings represent immediate risks. They must be
presented prominently and not buried in a summary table.

---

## EXECUTION

### Step 1: Present Deliverables Summary

**Tool:** Read (verify output directory), direct output to user

Present a clear summary of what was created:

```
Security Review Complete

Project: [Name]
Date: YYYY-MM-DD
Domains Assessed: [A, B, C as applicable]

Primary Deliverable
sec-review-report.html — Branded HTML report (open in browser)
FULL-REPORT.md         — Consolidated markdown report

All Deliverables

| File | Description |
|------|-------------|
| sec-review-report.html | Branded HTML report — open in browser (if generated) |
| FULL-REPORT.md | Consolidated markdown report (complete reference) |
| EXECUTIVE-SUMMARY.md | High-level findings for leadership |
| ARCHITECTURE-ANALYSIS.md | Architecture decomposition and trust boundaries |
| THREAT-MODEL.md | STRIDE/PASTA analysis |
| FINDINGS.md | Consolidated findings from threat model |
| GAP-ANALYSIS.md | Current vs target state comparison matrix (all domains) |
| PRACTICES-REVIEW.md | Security practices gap analysis (Domain B) |
| PATCH-ASSESSMENT.md | Patch management maturity assessment (Domain C) |
| SUPPLY-CHAIN-REVIEW.md | Supply chain analysis (if Domain E) |
| RECOMMENDATIONS.md | Prioritized recommendations (P0-P3) |
| diagrams/ | Mermaid diagrams (.mmd, .svg, .png) |
| metadata.json | Engagement metadata |

Location: private/output/sec-review/{project}-{date}/

Diagrams
| Diagram | Formats Available |
|---------|------------------|
| arch-overview | .mmd [.svg] [.png] |
| trust-boundaries | .mmd [.svg] [.png] |
| data-flow | .mmd [.svg] [.png] |
| attack-surface | .mmd [.svg] [.png] |
| threat-model | .mmd [.svg] [.png] |
| network-topology | .mmd [.svg] [.png] |
```

**Expected output:** Summary table with FULL-REPORT.md highlighted as primary deliverable
**On failure:** If any file missing, return to Phase 4

### Step 2: Highlight Critical Items

**Tool:** Direct analysis (from Phase 3/4 output)

If P0 (Critical) findings exist, present them prominently:

```
Critical Findings Requiring Immediate Attention

| # | Finding | Domain | Priority | Recommendation |
|---|---------|--------|----------|----------------|
| 1 | [Critical finding] | [A/B/C] | P0 | [Immediate action] |
| 2 | [Critical finding] | [A/B/C] | P0 | [Immediate action] |
```

If no P0 findings exist, summarize the highest-priority items.

**Expected output:** Critical items highlighted for user attention
**On failure:** If no findings at all, present clean assessment summary

### Step 3: Provide Key Statistics

**Tool:** Direct analysis (from metadata.json or findings)

```
Key Statistics

Total Findings: [n]
Critical (P0): [n]
High (P1): [n]
Medium (P2): [n]
Low (P3): [n]
Domains Assessed: [A, B, C as applicable]
Diagrams Generated: [n] (.mmd), [n] (.svg), [n] (.png)
```

If Domain B was assessed: Include top OWASP SAMM / NIST SSDF gap.
If Domain C was assessed: Include patch management maturity summary scores.
If Domain E was assessed: Include supply chain maturity scores.

**Expected output:** Finding statistics presented
**On failure:** Count manually from deliverable files

### Step 4: Capture Feedback

**Tool:** Direct conversation with user

Ask for feedback:
- Was the scope appropriate?
- Were findings accurate?
- Were recommendations actionable?
- Any additional questions?

**Expected output:** Feedback captured (if user provides)
**On failure:** Not a blocker — user feedback is optional

### Step 5: Display Completion Message

```
[SKILL:sec-review] completed for {project}

Deliverables: private/output/sec-review/{project}-{date}/
```

**AFTER THIS STEP:** Display the grand summary using the workflow-level format. Build
dynamically from actual phase outputs — domains, metrics, file lists, and deliverable counts.
See `/docs/guides/running-checklist-standard.md` for the exact grand summary format.

---

## OUTPUT CONTRACT

**Produces:**
- Verbal delivery to user (no additional files created by this phase)
- All deliverables from Phase 4 remain in
  `private/output/sec-review/{project}-{date}/`

**Format:** Structured summary displayed to user with deliverable locations, critical items,
statistics, diagram inventory, and feedback capture

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
- [ ] Diagram inventory presented
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

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
