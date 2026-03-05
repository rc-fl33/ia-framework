---
domain: advisory
skill: advisory
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 4: DOCUMENT (Professional Report)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Compile all analysis and recommendations into professional, stakeholder-ready deliverables. Create executive summary, assemble complete report, generate metadata.json, and verify output quality before delivery.

**Additional constraints:** No placeholder text (TODO, TBD). All findings must have severity and CWE (if code-review). All recommendations must have priority. Framework references must be accurate. Professional formatting throughout. No hardcoded counts or time estimates.

---

## INPUT CONTRACT

**Receives:**
- Recommendations file from Phase 3
- Analysis files from Phase 2
- Scope from Phase 1
- Mode (ad-hoc, code-review)
- Output directory: `private/output/advisory/{type}/{project}-{date}/`

**Prerequisites:**
- Phase 3 (RECOMMEND) completed
- Recommendations documented with P0-P3 priorities
- All analysis files created in Phase 2

**Source:** `skills/advisory/phases/03-recommend.md`

---

## OBJECTIVE

**Goal:** Create complete, professional deliverables that can be shared with stakeholders, including executive summary, complete report set, and metadata.

**Success criteria:**
- Executive summary created (concise, actionable)
- All mode-specific deliverable files complete
- FULL-REPORT.md consolidates all files without duplication
- metadata.json created (code-review mode)
- No placeholder content in any file
- Professional formatting verified
- Output in correct directory

**Failure criteria:**
- Report contains TODO/TBD markers → Fix before completing
- Missing deliverable files → Create all required files
- Findings without severity/CWE (code-review) → Return to Phase 2

---

## METHODOLOGY

**Phase 4 is about assembly and polish.** The analytical work is done. This phase compiles existing outputs into a cohesive, professional package. Think of it as assembling a report that a CISO would present to their board.

**Executive summary is the most-read section.** Keep it concise — overall security posture, finding count and severity breakdown, top recommendations, and immediate next steps. A busy executive should get the full picture from this one page.

**Mode determines the deliverable set.** Ad-hoc produces lightweight markdown files. Arch-review and code-review produce comprehensive report sets with metadata.json for tracking.

**Quality gate before delivery.** Run through the quality checklist before marking this phase complete. A professional report with typos, placeholders, or missing sections damages credibility.

---

## EXECUTION

### Step 1: Create Executive Summary
**Applies:** CODE-REVIEW only

**Tool:** Write

Create executive summary as the first deliverable:

```markdown
# Executive Summary

## Engagement Overview
- **Type:** [Architecture Review | Code Review | Advisory]
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

**Expected output:** EXECUTIVE-SUMMARY.md written (code-review only)
**On failure:** If findings incomplete, return to Phase 3

### Step 2: Compile Full Report (By Mode)

**Tool:** Write, Read (to verify existing files)

**AD-HOC Mode — create remaining files:**
```
{topic}-{YYYY-MM-DD}/
├── request.md           # Original question with context
├── research.md          # (from Phase 2)
├── recommendations.md   # (from Phase 3)
├── references.md        # All sources cited
└── FULL-REPORT.md       # (Step 3 - consolidated report)
```

Create `request.md` (documents the original question) and `references.md` (compiles all cited sources).

**CODE-REVIEW Mode — create remaining files:**
```
{project}-{YYYY-MM-DD}/
├── EXECUTIVE-SUMMARY.md     # (Step 1)
├── REVIEW-SUMMARY.md        # Scope, methodology, statistics
├── FINDINGS.md              # (from Phase 2)
├── REMEDIATION-GUIDE.md     # Prioritized fixes with code examples
├── FULL-REPORT.md           # (Step 3 - consolidated report)
└── metadata.json            # (Step 4)
```

Create `REVIEW-SUMMARY.md` (scope, methodology, and statistics) and `REMEDIATION-GUIDE.md` (prioritized fixes derived from recommendations with code examples).

**Expected output:** All mode-specific deliverable files created
**On failure:** If source files missing, return to the appropriate phase

### Step 3: Consolidate Full Report
**Applies:** ALL modes (AD-HOC, ARCH-REVIEW, CODE-REVIEW)

**Tool:** Read (template + source files), Write

**Read the template:** `tools/quarto/templates/reports/advisory/advisory-report.qmd`

This template defines the assembly manifest - which files to read, what sections to extract, and
how to combine them without duplication. Follow the mode-specific section map.

**Assembly process:**

1. Identify mode-specific section map from template
2. Verify all source files exist in output directory
3. Read each source file listed in section map
4. Extract content per assembly instructions
5. Apply deduplication rules:
   - Severity tables appear ONLY in Executive Summary
   - Sprint estimates appear ONLY in Remediation Roadmap
   - Compliance mappings consolidated in one section
   - Statistics appear ONLY in Executive Summary
6. Generate Table of Contents from section headings
7. Apply formatting rules (100-char width, h2 sections, no emoji in headings)
8. Write FULL-REPORT.md to output directory

**Deduplication critical:** The full report consolidates ~4,600 lines across multiple files into a
single 600-800 line document. Content must not be duplicated - severity tables, effort estimates,
and compliance mappings appear exactly once in their designated sections.

**Expected output:** FULL-REPORT.md written to output directory
**On failure:** If source files incomplete, return to Step 2

### Step 4: Create Metadata
**Applies:** CODE-REVIEW only

**Tool:** Write

Create `metadata.json`:

```json
{
  "engagement_type": "advisory",
  "mode": "code-review",
  "project": "[project name]",
  "date": "YYYY-MM-DD",
  "scope": "[scope description]",
  "findings": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  },
  "status": "complete",
  "deliverables": {
    "files": [
      "EXECUTIVE-SUMMARY.md",
      "FULL-REPORT.md",
      "..."
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
- [ ] All findings have severity and CWE (if code-review)
- [ ] All recommendations have priority (P0-P3)
- [ ] Framework references accurate
- [ ] No hardcoded counts or time estimates
- [ ] Professional formatting throughout
- [ ] All files present for the selected mode
- [ ] FULL-REPORT.md consolidates all files without duplication
- [ ] metadata.json accurate (arch/code-review) and includes FULL-REPORT.md

**Expected output:** Quality check passed
**On failure:** Fix identified issues before proceeding

### Step 6: Generate Branded HTML Report

**Tool:** Bash

Run the bridge script to produce the branded HTML deliverable:

```bash
bun skills/advisory/scripts/markdown-bridge.ts \
  --output-dir private/output/advisory/{type}/{project}-{YYYY-MM-DD}/
```

Replace `{type}` with `ad-hoc` or `code-reviews` and `{project}-{YYYY-MM-DD}` with the actual output directory name.

**On success:** `advisory-report.html` appears in the output directory. Include its path in the deliverables summary presented in Phase 5.
**On failure:** Log the error and continue — markdown deliverables are complete. HTML is additive; do not block Phase 5.

**One-off finding report:** To generate a standalone HTML for a single finding:
```bash
bun skills/advisory/scripts/markdown-bridge.ts \
  --finding private/output/advisory/{type}/{project}-{date}/findings/F001-{slug}/
```
This produces `F001-{slug}/finding-report.html`. Re-run after customer adds remediation evidence or updates STATUS to "Remediated" to generate an updated clean report.

---

## OUTPUT CONTRACT

**Produces (by mode):**

**AD-HOC:**
- `request.md` → `private/output/advisory/ad-hoc/{topic}-{date}/request.md`
- `references.md` → `private/output/advisory/ad-hoc/{topic}-{date}/references.md`
- `FULL-REPORT.md` → `private/output/advisory/ad-hoc/{topic}-{date}/FULL-REPORT.md`
- `advisory-report.html` → `private/output/advisory/ad-hoc/{topic}-{date}/advisory-report.html` (branded HTML, auto-generated)
- (research.md and recommendations.md already exist from Phases 2 and 3)

**CODE-REVIEW:**
- `EXECUTIVE-SUMMARY.md` → `private/output/advisory/code-reviews/{project}-{date}/EXECUTIVE-SUMMARY.md`
- `REVIEW-SUMMARY.md` → `private/output/advisory/code-reviews/{project}-{date}/REVIEW-SUMMARY.md`
- `REMEDIATION-GUIDE.md` → `private/output/advisory/code-reviews/{project}-{date}/REMEDIATION-GUIDE.md`
- `FULL-REPORT.md` → `private/output/advisory/code-reviews/{project}-{date}/FULL-REPORT.md`
- `metadata.json` → `private/output/advisory/code-reviews/{project}-{date}/metadata.json`
- `advisory-report.html` → `private/output/advisory/{type}/{project}-{date}/advisory-report.html` (branded HTML, auto-generated)
- (FINDINGS.md already exists from Phase 2)

**Format:** Professional markdown reports, JSON metadata, and branded HTML

---

## NEXT

**On success:** → Proceed to Phase 5 (Deliver):

Load `skills/advisory/phases/05-deliver.md` with:
- All deliverable files in output directory
- Mode and project information
- metadata.json content

**On quality check failure:** → Fix issues within this phase, do not advance

**On missing source files:** → Return to the appropriate earlier phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Executive summary created (code-review) or request documented (ad-hoc)
- [ ] All mode-specific deliverable files complete
- [ ] FULL-REPORT.md consolidates all files without duplication
- [ ] metadata.json created (code-review only) and includes FULL-REPORT.md
- [ ] No placeholder content in any file
- [ ] Quality check passed (Step 5)
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
