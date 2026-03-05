---
domain: gap-analysis
skill: gap-analysis
agent: advisor
model: sonnet
mode: multi-agent
agents: [advisor, legal]
complexity: medium
chain_position: last
---

# Phase 3: DELIVERABLES (Compliance Matrix, Gap Analysis, Remediation Roadmap)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Deliverable compiler. Reads all per-framework findings files and generates a unified compliance matrix, gap analysis, and remediation roadmap. Delegates final QA to legal agent for regulatory citation accuracy review.

**Additional constraints:** All deliverables must use framework-native category structures — section headers in the compliance matrix must match the selected frameworks' own category names (CC1, A.5, 164.308, etc.), never NIST CSF phase names unless NIST CSF was selected. Legal QA is mandatory before the engagement is considered complete.

---

## INPUT CONTRACT

**Receives:**
- Per-framework findings files from `assessment/{framework-id}-findings.md`
- Engagement metadata from `intake/metadata.yaml`

**Prerequisites:**
- Phase 2 (Assess) complete — at least one `{framework-id}-findings.md` exists
- `intake/metadata.yaml` exists with framework list

**Source:** `skills/gap-analysis/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Compile assessment findings into final deliverables (compliance matrix, gap analysis, remediation roadmap) and complete the legal QA gate.

**Success criteria:**
- `deliverables/compliance-matrix.md` generated with one section per selected framework
- `deliverables/gap-analysis.md` generated with gaps sorted by severity
- `deliverables/remediation-roadmap.md` generated with prioritized 30/60/90-day actions
- `deliverables/qa-report.md` generated from legal review
- All framework citations verified accurate by legal agent

**Failure criteria:**
- No findings files exist to compile
- Legal QA identifies critical citation errors that cannot be resolved

---

## METHODOLOGY

**One section per framework in the compliance matrix.** Each section uses that framework's native category structure.

**Gap analysis is organized by severity, not framework.** Critical gaps are listed first regardless of which framework they were identified in. Each gap entry includes which framework controls are not met.

**Remediation roadmap is action-oriented.** Each action is tagged with the framework controls it closes when completed. Priority is driven by gap severity and business risk. Timeline follows 30/60/90-day format.

**Legal QA is a mandatory gate.** The legal agent verifies regulatory citation accuracy — correct SOC 2 TSC numbers, correct ISO 27001:2022 Annex A control numbering, correct HIPAA section references, etc.

---

## EXECUTION

### Step 1: Load All Findings Files

**Tool:** Read
**Files:** `assessment/{framework-id}-findings.md` for each framework in `intake/metadata.yaml`

Load all per-framework findings files. Note which frameworks are fully scored vs. partially scored.

**Expected output:** All findings files loaded

### Step 2: Generate Compliance Matrix

**Tool:** Write
**File:** `deliverables/compliance-matrix.md`

```markdown
# {Organization} — Compliance Matrix

**Assessment Date:** {date}
**Assessor:** {assessor}
**Frameworks Assessed:** {framework list}

## Executive Summary

| Framework | Controls Assessed | Compliant | Partial | Non-Compliant | Score |
|-----------|-------------------|-----------|---------|---------------|-------|
| {name}    | {total}           | {count}   | {count} | {count}       | {%}   |

---

## {Framework 1 Name} ({version})

### {CC1 / A.5 / 164.308 / GV}: {Category Title}

| Control | Title | Status | Notes |
|---------|-------|--------|-------|
| {id}    | {title} | Full / Partial / Gap | {key note} |

{...repeat for each native category...}

---

## {Framework 2 Name} ({version})

{...same structure using Framework 2's native categories...}

---

## Cross-Framework Gap Summary

| Gap Area | {Framework 1} | {Framework 2} | Status |
|----------|--------------|--------------|--------|
| Access Control | CC6.1-CC6.3 | A.5.15-A.5.18 | Partial |
```

**Expected output:** `deliverables/compliance-matrix.md`

### Step 3: Generate Gap Analysis

**Tool:** Write
**File:** `deliverables/gap-analysis.md`

```markdown
# {Organization} — Gap Analysis

**Assessment Date:** {date}
**Total Gaps Identified:** {count}
**Critical:** {n} | **High:** {n} | **Medium:** {n} | **Low:** {n}

---

## Critical Gaps — Immediate Action Required

| Gap ID | Description | Frameworks Affected | Risk |
|--------|-------------|---------------------|------|
| GAP-001 | {description} | {framework: control_id} | {business risk} |

### GAP-001: {Gap Title}

**Severity:** Critical
**Frameworks affected:**
  - {Framework 1}: {control_id} — {control_title}
  - {Framework 2}: {control_id} — {control_title}

**Finding:** {description of what is missing or inadequate}
**Risk:** {business or compliance risk if gap is unaddressed}
**Recommendation:** {specific action to close this gap}
**Evidence needed:** {what evidence would demonstrate closure}

---

## High Gaps — Address Within 30 Days

{...same structure...}

---

## Medium Gaps — Address Within 90 Days

{...same structure...}

---

## Low Gaps — Roadmap Items

{...same structure...}
```

**Expected output:** `deliverables/gap-analysis.md`

### Step 4: Generate Remediation Roadmap

**Tool:** Write
**File:** `deliverables/remediation-roadmap.md`

```markdown
# {Organization} — Remediation Roadmap

**Assessment Date:** {date}
**Total Actions:** {count}
**Frameworks:** {list}

---

## 0–30 Days: Critical Actions

### ACTION-001: {Action Title}

**Priority:** Critical
**Effort:** Low / Medium / High
**Owner:** {suggested team or role}
**Controls closed:**
  - {Framework 1}: {control_id} — {control_title}
  - {Framework 2}: {control_id} — {control_title}
**Gaps closed:** GAP-{n}, GAP-{n}

**What to do:**
{Specific, actionable steps — numbered list}

**Acceptance criteria:**
{Measurable outcome that confirms completion}

**Evidence to collect:**
- {Document, screenshot, or artifact demonstrating closure}

---

## 31–90 Days: High Priority Actions

{...same structure...}

---

## 91–180 Days: Medium Priority Actions

{...same structure...}

---

## 180+ Days: Program Actions

{...same structure...}

---

## Roadmap Summary

| Action | Priority | Effort | Controls Closed | Timeline |
|--------|----------|--------|----------------|----------|
| {title} | Critical | Medium | CC6.1, A.8.5 | 0–30 days |
```

**Expected output:** `deliverables/remediation-roadmap.md`

### Step 5: Delegate QA to Legal

**Tool:** Task delegation

```
Task(subagent_type="legal",
  prompt="Review gap analysis deliverables for regulatory citation accuracy.

  Check:
  1. SOC 2 TSC references — verify control numbers match 2017 Trust Services Criteria
  2. ISO 27001:2022 Annex A control numbering — A.5.1-A.5.37, A.6.1-A.6.8, A.7.1-A.7.14, A.8.1-A.8.34
  3. HIPAA section references — verify CFR citations are accurate (164.308, 164.310, 164.312, 164.314, 164.316)
  4. PCI-DSS requirement numbers — verify against PCI-DSS v4.0.1
  5. Any other framework citations — verify against the framework version in intake/metadata.yaml

  Files to review:
  - deliverables/compliance-matrix.md
  - deliverables/gap-analysis.md
  - deliverables/remediation-roadmap.md

  Output: deliverables/qa-report.md

  Report format:
  - PASS items: citations verified accurate
  - FLAG items: citations that appear incorrect with correction
  - CRITICAL items: citations that could create legal/compliance risk

  Overall verdict: APPROVED (no critical items) or REQUIRES REVISION (critical items found)")
```

**Expected output:** Legal QA report initiated

### Step 6: Write QA Report

**Tool:** Write
**File:** `deliverables/qa-report.md`

Compile the legal agent's review output. If critical items are flagged, apply corrections and re-run QA.

**Expected output:** `deliverables/qa-report.md` with APPROVED or REQUIRES REVISION status

### Step 7: Generate Branded HTML Report

**Tool:** Bash

Run the bridge script to produce the branded HTML deliverable:

```bash
bun skills/gap-analysis/scripts/markdown-bridge.ts \
  --output-dir private/output/gap-analysis/{client}-{YYYY-MM}/
```

**On success:** `gap-analysis-report.html` appears in the output directory.
**On failure:** Log the error and continue — markdown deliverables are complete. HTML is additive; do not block completion.

---

## OUTPUT CONTRACT

**Produces:**
- `deliverables/compliance-matrix.md` — one section per selected framework, organized by native categories
- `deliverables/gap-analysis.md` — gaps organized by severity, each gap lists affected framework controls
- `deliverables/remediation-roadmap.md` — 30/60/90-day prioritized actions tagged with framework controls
- `deliverables/qa-report.md` — legal review of citation accuracy
- `gap-analysis-report.html` → `private/output/gap-analysis/{client}-{YYYY-MM}/gap-analysis-report.html` (branded HTML, auto-generated)

---

## NEXT

**On APPROVED:** Engagement complete. Display final summary:
```
ASSESSMENT COMPLETE: {Organization}

Frameworks assessed: {list}
Controls evaluated: {total}
Gaps identified: {count} ({critical} Critical, {high} High, {medium} Medium, {low} Low)
Compliance score: {average}% average

Deliverables:
  deliverables/compliance-matrix.md
  deliverables/gap-analysis.md
  deliverables/remediation-roadmap.md
  deliverables/qa-report.md (APPROVED)
```

**On REQUIRES REVISION:** Fix flagged citations, re-run legal QA, update qa-report.md.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Compliance matrix generated with one section per selected framework
- [ ] All section headers use framework-native category names
- [ ] Gap analysis generated with gaps sorted by severity and tagged to framework controls
- [ ] Remediation roadmap generated with 30/60/90-day timeline structure
- [ ] Legal QA complete — qa-report.md exists with APPROVED or REQUIRES REVISION status
- [ ] Critical QA flags resolved before marking engagement complete

**Error recovery:**
- If findings file missing for a framework: Note in compliance matrix, proceed with available data
- If legal delegation fails: Mark deliverables as draft pending QA, notify user
- If citations flagged by legal: Apply corrections, re-delegate specific sections

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
