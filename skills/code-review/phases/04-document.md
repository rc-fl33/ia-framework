---
domain: code-review
skill: code-review
agent: developer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 4: DOCUMENT (Professional Report)

## IDENTITY

**Agent:** `agents/developer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Compile all analysis and recommendations into professional, stakeholder-ready deliverables. Create executive summary, assemble complete report, generate metadata.json, and verify output quality before delivery.

**Additional constraints:** No placeholder text (TODO, TBD). All findings must have severity and CWE. All recommendations must have priority. Framework references must be accurate. Professional formatting throughout. No hardcoded counts or time estimates.

---

## INPUT CONTRACT

**Receives:**
- Recommendations file from Phase 3
- Analysis files from Phase 2
- Scope from Phase 1
- Output directory: `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Prerequisites:**
- Phase 3 (RECOMMEND) completed
- Recommendations documented with P0-P3 priorities
- All analysis files created in Phase 2

**Source:** `skills/code-review/phases/03-recommend.md`

---

## OBJECTIVE

**Goal:** Create complete, professional deliverables that can be shared with stakeholders, including executive summary, complete report set, and metadata.

**Success criteria:**
- Executive summary created (concise, actionable)
- All deliverable files complete
- FULL-REPORT.md consolidates all files without duplication
- metadata.json created
- No placeholder content in any file
- Professional formatting verified
- Output in correct directory

**Failure criteria:**
- Report contains TODO/TBD markers → Fix before completing
- Missing deliverable files → Create all required files
- Findings without severity/CWE → Return to Phase 2

---

## METHODOLOGY

**Phase 4 is about assembly and polish.** The analytical work is done. This phase compiles existing outputs into a cohesive, professional package. Think of it as assembling a report that a CISO would present to their board.

**Executive summary is the most-read section.** Keep it concise — overall security posture, finding count and severity breakdown, top recommendations, and immediate next steps. A busy executive should get the full picture from this one page.

**Quality gate before delivery.** Run through the quality checklist before marking this phase complete. A professional report with typos, placeholders, or missing sections damages credibility.

---

## EXECUTION

### Step 1: Create Executive Summary

**Tool:** Write

Create executive summary as the first deliverable:

```markdown
# Executive Summary

## Engagement Overview
- **Type:** Code Review
- **Date:** YYYY-MM-DD
- **Scope:** [Brief scope description]

## Key Findings
- [Number] total findings identified
- [Number] critical/high severity
- [Top concern summary]

## Risk Assessment
[Overall security posture assessment — 2-3 sentences]

## Top Recommendations
1. [Most critical recommendation — P0]
2. [Second priority — P0/P1]
3. [Third priority — P1]

## Next Steps
- [Immediate action 1]
- [Immediate action 2]
```

**Expected output:** EXECUTIVE-SUMMARY.md written
**On failure:** If findings incomplete, return to Phase 3

### Step 2: Compile Full Report

**Tool:** Write, Read (to verify existing files)

Create remaining files:
```
{project}-{YYYY-MM-DD}/
├── findings/                # Per-finding directories (from Phase 2)
│   ├── F001-sql-injection/
│   │   ├── finding.md       # Complete finding — triage-ready standalone
│   │   └── screenshots/     # Evidence scoped to this finding
│   └── F002-missing-auth/
│       ├── finding.md
│       └── screenshots/
├── EXECUTIVE-SUMMARY.md     # (Step 1)
├── REVIEW-SUMMARY.md        # Scope, methodology, statistics
├── FINDINGS.md              # (from Phase 2 — consolidated from per-finding files)
├── DATA-FLOW.md             # (from Phase 2 Pass 3a)
├── REMEDIATION-GUIDE.md     # Prioritized fixes with code examples
├── FULL-REPORT.md           # (Step 3 - consolidated report)
└── metadata.json            # (Step 4)
```

Create `REVIEW-SUMMARY.md` (scope, methodology, and statistics) and `REMEDIATION-GUIDE.md` (prioritized fixes derived from recommendations with code examples).

**Expected output:** All deliverable files created
**On failure:** If source files missing, return to the appropriate phase

### Step 3: Consolidate Full Report

**Tool:** Read (source files), Write

**Assembly process:**

1. Verify all source files exist in output directory
2. Read each source file
3. Extract content per assembly instructions
4. Apply deduplication rules:
   - Severity tables appear ONLY in Executive Summary
   - Sprint estimates appear ONLY in Remediation Roadmap
   - Compliance mappings consolidated in one section
   - Statistics appear ONLY in Executive Summary
5. Assembly order:
   - Executive Summary
   - Review Summary (scope, methodology, statistics)
   - Findings
   - Data Flow Analysis (from DATA-FLOW.md — between Findings and Remediation)
   - Remediation Guide
6. Generate Table of Contents from section headings
7. Apply formatting rules (100-char width, h2 sections)
8. Write FULL-REPORT.md to output directory

**Expected output:** FULL-REPORT.md written to output directory
**On failure:** If source files incomplete, return to Step 2

### Step 4: Create Metadata

**Tool:** Write

Create `metadata.json`:

```json
{
  "engagement_type": "code-review",
  "project": "[project name]",
  "date": "YYYY-MM-DD",
  "scope": "[scope description]",
  "findings": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "analysis": {
    "passes": ["structural", "pattern", "semantic", "verification"],
    "confidence": { "high": 0, "medium": 0, "low": 0 },
    "false_positives_discarded": 0,
    "data_flow_entries": 0
  },
  "status": "complete",
  "deliverables": {
    "findings_dir": "findings/",
    "files": [
      "EXECUTIVE-SUMMARY.md",
      "REVIEW-SUMMARY.md",
      "FINDINGS.md",
      "DATA-FLOW.md",
      "REMEDIATION-GUIDE.md",
      "FULL-REPORT.md"
    ]
  }
}
```

**Expected output:** metadata.json written to output directory
**On failure:** If finding counts unknown, count from FINDINGS.md

### Step 5: Quality Check & Display Checklist

**Tool:** Read (to verify each file)

Before finalizing, verify all deliverables:

- [ ] No placeholder text (TODO, TBD, etc.)
- [ ] All findings have severity and CWE
- [ ] All findings have confidence rating and source tag
- [ ] All recommendations have priority (P0-P3)
- [ ] Framework references accurate
- [ ] No hardcoded counts or time estimates
- [ ] Professional formatting throughout
- [ ] All files present (including DATA-FLOW.md)
- [ ] FULL-REPORT.md consolidates all files without duplication
- [ ] FULL-REPORT.md includes Data Flow Analysis section between Findings and Remediation
- [ ] metadata.json accurate and includes FULL-REPORT.md and DATA-FLOW.md
- [ ] metadata.json analysis block populated with correct counts

**Expected output:** Quality check passed
**On failure:** Fix identified issues before proceeding

### Step 6: Generate Styled HTML Report

**Tool:** Bash

Run the bridge script to produce the branded HTML deliverable:

```bash
bun skills/code-review/scripts/markdown-bridge.ts \
  --output-dir private/output/code-review/{project}-{YYYY-MM-DD}/
```

Replace `{project}-{YYYY-MM-DD}` with the actual output directory name.

**On success:** `code-review-report.html` appears in the output directory. Include its path in the deliverables summary presented in Phase 5.
**On failure:** Log the error and continue — markdown deliverables are complete. HTML is additive; do not block Phase 5.

**One-off finding report:** To generate a standalone HTML for a single finding (e.g. for
immediate triage handoff), run:
```bash
bun skills/code-review/scripts/markdown-bridge.ts \
  --finding private/output/code-review/{project}-{YYYY-MM-DD}/findings/F001-{slug}/
```
This produces `F001-{slug}/finding-report.html` — a complete, self-contained branded document
for that finding only. Re-run after customer adds remediation evidence to regenerate.

---

## OUTPUT CONTRACT

**Produces:**
- `EXECUTIVE-SUMMARY.md` → `private/output/code-review/{project}-{YYYY-MM-DD}/EXECUTIVE-SUMMARY.md`
- `REVIEW-SUMMARY.md` → `private/output/code-review/{project}-{YYYY-MM-DD}/REVIEW-SUMMARY.md`
- `REMEDIATION-GUIDE.md` → `private/output/code-review/{project}-{YYYY-MM-DD}/REMEDIATION-GUIDE.md`
- `FULL-REPORT.md` → `private/output/code-review/{project}-{YYYY-MM-DD}/FULL-REPORT.md`
- `metadata.json` → `private/output/code-review/{project}-{YYYY-MM-DD}/metadata.json`
- `code-review-report.html` → `private/output/code-review/{project}-{YYYY-MM-DD}/code-review-report.html` (branded HTML, auto-generated)
- (FINDINGS.md and DATA-FLOW.md already exist from Phase 2)

**Format:** Professional markdown reports, JSON metadata, and branded HTML

---

## NEXT

**On success:** → Proceed to Phase 5 (Deliver):

Load `skills/code-review/phases/05-deliver.md` with:
- All deliverable files in output directory
- Project information
- metadata.json content

**On quality check failure:** → Fix issues within this phase, do not advance

**On missing source files:** → Return to the appropriate earlier phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Executive summary created
- [ ] All deliverable files complete
- [ ] FULL-REPORT.md consolidates all files without duplication
- [ ] metadata.json created and includes FULL-REPORT.md
- [ ] No placeholder content in any file
- [ ] Quality check passed (Step 5)
- [ ] HTML report generation attempted (Step 6) — success or graceful failure
- [ ] All files in correct output directory
- [ ] Ready to proceed to Phase 5 (DELIVER)

**Error recovery:**
- If placeholder text found: Replace with actual content from analysis/recommendations
- If finding counts incorrect in metadata: Recount from FINDINGS.md
- If deliverable file missing: Create from source material in earlier phase outputs
- If formatting issues: Fix and re-verify

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
