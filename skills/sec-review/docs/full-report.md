# FULL-REPORT.md Assembly Manifest

## Purpose

This template defines how to assemble a consolidated FULL-REPORT.md from individual deliverable
files. This is NOT a fill-in-the-blank template — it is an assembly manifest that specifies which
source files to read, what sections to extract, and how to combine them without duplication.

---

## Source Files

**Always required:**
- `EXECUTIVE-SUMMARY.md`
- `ARCHITECTURE-ANALYSIS.md`
- `THREAT-MODEL.md`
- `FINDINGS.md`
- `RECOMMENDATIONS.md`
- `metadata.json`

**Domain B (if assessed):**
- `PRACTICES-REVIEW.md`

**Domain C (if assessed):**
- `PATCH-ASSESSMENT.md`

**Diagrams (best effort — include if present):**
- `diagrams/arch-overview.mmd` (or .svg/.png)
- `diagrams/trust-boundaries.mmd` (or .svg/.png)
- `diagrams/data-flow.mmd` (or .svg/.png)
- `diagrams/attack-surface.mmd` (or .svg/.png)
- `diagrams/threat-model.mmd` (or .svg/.png)

---

## Assembly Order

1. **Report Header** (generated from metadata.json)
   - Title: "Security Review: {project_name}"
   - Date: {completion_date}
   - Domains Assessed: {domains}
   - Engagement Type: Security Review

2. **Table of Contents** (auto-generated from section headings)

3. **Executive Summary** (from EXECUTIVE-SUMMARY.md)
   - Include full content
   - Keep severity distribution table (appears ONLY here, remove from other sections)
   - Keep statistics (appears ONLY here)

4. **Architecture Analysis** (from ARCHITECTURE-ANALYSIS.md)
   - Include architectural overview
   - Include component analysis
   - Include trust boundaries
   - Include data flow mapping
   - **Embed diagram reference:** `![Architecture Overview](diagrams/arch-overview.svg)`
     (or .mmd if .svg not available)

5. **Trust Boundaries and Data Flows**
   - Extract trust boundary section from ARCHITECTURE-ANALYSIS.md
   - **Embed diagram reference:** `![Trust Boundaries](diagrams/trust-boundaries.svg)`
   - **Embed diagram reference:** `![Data Flow](diagrams/data-flow.svg)`

6. **Threat Model** (from THREAT-MODEL.md)
   - Include STRIDE/PASTA analysis
   - Include attack surface mapping
   - Include threat scenarios
   - **Embed diagram reference:** `![Threat Model](diagrams/threat-model.svg)`
   - **Embed diagram reference:** `![Attack Surface](diagrams/attack-surface.svg)`

7. **Findings** (from FINDINGS.md)
   - Include all findings with architectural context
   - Remove severity summary tables (already in Executive Summary)

8. **Security Practices Review** (from PRACTICES-REVIEW.md — Domain B only)
   - Include full content if Domain B was assessed
   - Omit this section entirely if Domain B was not selected

9. **Patch Management Assessment** (from PATCH-ASSESSMENT.md — Domain C only)
   - Include full content if Domain C was assessed
   - Omit this section entirely if Domain C was not selected

10. **Recommendations** (from RECOMMENDATIONS.md)
    - Include all recommendations
    - Include prioritization tables
    - Remove effort estimates here (keep in individual recommendation entries only)

11. **Compliance Mapping** (consolidated from all deliverables)
    - Extract compliance references from all source files
    - De-duplicate and present once
    - Format as table: Standard | Control | Finding IDs | Status

12. **Appendices**
    - Methodology (STRIDE/PASTA/Attack Trees description)
    - Diagram Index (list all diagrams with paths)
    - Glossary of terms used
    - Evidence collection checklist reference

---

## Deduplication Rules

| Content Type | Appears In | Keep Where | Remove From |
|--------------|-----------|------------|-------------|
| Severity distribution table | Executive Summary, Findings | Executive Summary | Findings |
| Statistics/metrics summary | Executive Summary, scope | Executive Summary | Scope sections |
| Compliance mappings | Multiple sections | Consolidated section | Individual sections |
| Maturity scores | PRACTICES-REVIEW, PATCH-ASSESSMENT | Domain sections | Do not duplicate |
| Diagram images | Multiple sections | Each designated section | Do not repeat |

---

## Formatting Rules

**Document structure:**
- Use h2 (##) for major sections
- Use h3 (###) for subsections
- Use h4 (####) for finding details
- Maximum line width: 100 characters
- No emoji in section headings
- Use consistent bullet style (- not * or +)

**Diagram references:**
- Reference SVG if available: `![Alt text](diagrams/name.svg)`
- Reference PNG as fallback: `![Alt text](diagrams/name.png)`
- Reference MMD as last resort with note: `[Diagram available as Mermaid source: diagrams/name.mmd]`
- Always include Alt text describing the diagram

**Tables:**
- Use markdown tables
- Align columns consistently
- Include headers

**Cross-references:**
- Reference findings by ID: F-001, F-002, etc.
- Reference recommendations by number: R-001, R-002, etc.

**Page breaks (for PDF generation):**
- Insert before major sections: `---`

---

## Assembly Process (Phase 04, Step 3)

1. Read this template to identify section map and domain-conditional sections
2. Verify all required source files exist
3. Read each source file
4. Extract content per section map
5. Apply deduplication rules
6. Include diagram references in correct sections (best effort based on available formats)
7. Apply conditional sections (Domain B, Domain C)
8. Format per formatting rules
9. Generate ToC from section headings
10. Write consolidated FULL-REPORT.md
11. Verify:
    - No duplicated severity tables
    - All diagram references point to existing files
    - No placeholder text
    - Cohesive document flow

---

## Output Characteristics

- SECURITY-REVIEW: 600-900 lines (vs source files combined)
- With Domain B and C: Additional 200-400 lines
- Diagrams referenced inline in appropriate sections

**Benefits:**
- Single-file sharing
- Complete context in one document
- Individual files still available for detailed reference
