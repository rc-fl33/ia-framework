# FULL-REPORT.md Assembly Manifest

## Purpose

This template defines how to assemble a consolidated FULL-REPORT.md from individual deliverable
files. This is NOT a fill-in-the-blank template - it's an assembly manifest that specifies which
source files to read, what sections to extract, and how to combine them without duplication.

---

## Section Maps by Mode

### CODE-REVIEW Mode

**Source files:**
- `EXECUTIVE-SUMMARY.md`
- `REVIEW-SUMMARY.md`
- `FINDINGS.md`
- `RECOMMENDATIONS.md`
- `REMEDIATION-GUIDE.md`
- `metadata.json`

**Assembly order:**

1. **Report Header** (generated from metadata.json)
   - Title: "Security Code Review: {project_name}"
   - Date: {completion_date}
   - Reviewer: {reviewer}
   - Version: {version}

2. **Table of Contents** (auto-generated from section headings)

3. **Executive Summary** (from EXECUTIVE-SUMMARY.md)
   - Include full content
   - Keep severity distribution table (appears ONLY here, remove from other sections)

4. **Scope & Methodology** (from REVIEW-SUMMARY.md)
   - Extract "Scope" section
   - Extract "Methodology" section
   - Omit statistics/metrics (deduplicated to Executive Summary)

5. **Findings** (from FINDINGS.md)
   - Include all findings with full detail
   - Include code examples and technical analysis
   - Remove any severity summary tables (already in Executive Summary)

6. **Recommendations** (from RECOMMENDATIONS.md)
   - Include all recommendations
   - Keep prioritization guidance

7. **Remediation Roadmap** (from REMEDIATION-GUIDE.md)
   - Include sprint breakdown
   - Keep effort estimates (appears ONLY here, remove from other sections)
   - Include implementation guidance

8. **Compliance Mapping** (consolidated from all deliverables)
   - Extract compliance references from all source files
   - De-duplicate and present once
   - Format as table: Standard | Requirement | Finding IDs | Status

9. **Appendices**
   - Testing methodology details
   - Tool versions
   - Glossary of terms

### AD-HOC Mode

**Source files:**
- `request.md`
- `research.md`
- `recommendations.md`
- `references.md`
- `metadata.json`

**Assembly order:**

1. **Report Header** (generated from metadata.json)
   - Title: "Security Advisory: {request_summary}"
   - Date: {completion_date}
   - Advisor: {advisor}

2. **Table of Contents** (auto-generated)

3. **Request Context** (from request.md)
   - Include original question/request
   - Include scope definition

4. **Research & Analysis** (from research.md)
   - Include findings
   - Include analysis
   - Include supporting evidence

5. **Recommendations** (from recommendations.md)
   - Include guidance
   - Include next steps

6. **References** (from references.md)
   - Include all citations
   - Include additional resources

---

## Deduplication Rules

| Content Type | Appears In | Keep Where | Remove From |
|--------------|-----------|------------|-------------|
| Severity distribution table | Executive Summary, Findings | Executive Summary | Findings, other sections |
| Sprint effort estimates | Remediation Roadmap, Recommendations | Remediation Roadmap | Recommendations |
| Compliance mappings | Multiple sections | Consolidated section | Individual sections |
| Statistics/metrics summary | Executive Summary, scope sections | Executive Summary | Scope sections |
| Code examples | Findings only | Findings | Do not duplicate |
| Detailed technical analysis | Findings only | Findings | Do not summarize elsewhere |

---

## Formatting Rules

**Document structure:**
- Use h2 (##) for major sections
- Use h3 (###) for subsections
- Use h4 (####) for finding details
- Maximum line width: 100 characters
- No emoji in section headings
- Use consistent bullet style (- not * or +)

**Code blocks:**
```language
// Preserve syntax highlighting
// Maintain indentation
```

**Tables:**
- Use markdown tables
- Align columns consistently
- Include headers

**Cross-references:**
- Link between sections using anchors: [Section Name](#section-name)
- Reference findings by ID: F-001, F-002, etc.

**Page breaks (for PDF generation):**
- Insert before major sections: `---`

---

## Assembly Process (Phase 04, Step 3)

1. Read this template to identify mode-specific section map
2. Verify all source files exist
3. Read each source file
4. Extract content per section map
5. Apply deduplication rules
6. Format per formatting rules
7. Generate ToC from section headings
8. Write consolidated FULL-REPORT.md
9. Verify:
   - No duplicated severity tables
   - No duplicated effort estimates
   - Cohesive document flow
   - All cross-references valid

---

## Output Characteristics

**Estimated sizes:**
- CODE-REVIEW: 600-800 lines (vs ~4,600 across individual files)
- ARCH-REVIEW: 500-700 lines
- AD-HOC: 300-500 lines

**Benefits:**
- Single-file printing
- Email distribution ready
- Stakeholder review simplified
- Complete context in one document
- Individual files still available for detailed reference
