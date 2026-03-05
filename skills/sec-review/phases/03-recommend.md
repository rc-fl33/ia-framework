---
domain: sec-review
skill: sec-review
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 3: RECOMMEND (Prioritized Recommendations)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Transform analysis findings across all selected domains into prioritized,
actionable recommendations. Map each recommendation to security frameworks (NIST CSF 2.0, CIS
Controls, OWASP SAMM, NIST SSDF). Provide implementation steps for each recommendation.

**Additional constraints:** Every finding from Phase 2 must have a corresponding recommendation.
Recommendations must be specific and actionable — not vague guidance. Include implementation
steps, framework references, and relative effort for each. Use P0-P3 priority levels consistently.

---

## INPUT CONTRACT

**Receives:**
- Analysis files from Phase 2 (ARCHITECTURE-ANALYSIS.md, THREAT-MODEL.md, FINDINGS.md,
  PRACTICES-REVIEW.md if B, PATCH-ASSESSMENT.md if C, SUPPLY-CHAIN-REVIEW.md if E)
- Domain selection (A always; B, C, and/or E if selected)
- Scope from Phase 1
- Output directory: `private/output/sec-review/{project}-{date}/`

**Prerequisites:**
- Phase 2 (ANALYZE) completed
- Analysis files exist in output directory
- Findings, threats, or gaps identified

**Source:** `skills/sec-review/phases/02-analyze.md`

---

## OBJECTIVE

**Goal:** Generate prioritized, actionable recommendations for every finding identified across
all selected domains in Phase 2, mapped to security frameworks.

**Success criteria:**
- Every finding/threat has a corresponding recommendation
- All recommendations prioritized P0-P3 based on risk
- Each recommendation has specific implementation steps
- Framework references included (NIST CSF 2.0, CIS Controls, OWASP SAMM, NIST SSDF)
- Relative effort estimates provided for each recommendation

**Failure criteria:**
- Findings from Phase 2 are incomplete → Return to Phase 2
- Recommendations are vague ("improve security") → Rewrite with specifics
- No framework references → Add appropriate framework mappings

---

## METHODOLOGY

**Recommendations bridge the gap between "what is wrong" and "how to fix it."** A finding without
a recommendation is noise. A recommendation without implementation steps is hand-waving.

**Prioritization applies across all domains.** Threat model findings, security practice gaps, and
patch management deficiencies all feed into the same P0-P3 priority queue. A critical patch gap
can be P0 just as much as an architectural flaw.

**Framework mapping adds credibility.** Map to NIST CSF 2.0, CIS Controls, OWASP SAMM, or
NIST SSDF as appropriate. This helps organizations track remediation against compliance obligations.

**For complex recommendations, provide alternatives.** Present options so stakeholders can make
informed decisions.

---

## EXECUTION

### Step 1: Load Analysis Findings

**Tool:** Read
**Reference:** Phase 2 output files in `private/output/sec-review/{project}-{date}/`

Load and review all analysis output from Phase 2.

**Expected output:** Findings catalog ready for recommendation generation
**On failure:** If analysis files missing, return to Phase 2

### Step 2: Prioritize Findings

**Tool:** Direct analysis

Assign priority to each finding based on risk — applies to all domains:

| Priority | Criteria | Timeline |
|----------|----------|----------|
| **P0 - Critical** | Immediate risk, exploitable now, high impact | Fix immediately |
| **P1 - High** | Significant risk, likely exploitable, medium-high impact | Fix within sprint |
| **P2 - Medium** | Moderate risk, harder to exploit, medium impact | Plan remediation |
| **P3 - Low** | Minor risk, defense-in-depth, low impact | Backlog |

**Expected output:** All findings assigned P0-P3 priority
**On failure:** If risk cannot be assessed, default to P2 and note uncertainty

### Step 3: Generate Recommendations

**Tool:** Direct analysis, WebSearch (for remediation best practices)

For each finding, create an actionable recommendation:

```markdown
### Recommendation [N]: [Title]

**Priority:** P0 | P1 | P2 | P3
**Domain:** A | B | C | E
**Addresses:** [Finding/Threat reference]

**Recommendation:**
[Clear, specific, actionable guidance]

**Implementation:**
1. [Step 1 — specific action]
2. [Step 2 — specific action]
3. [Step 3 — specific action]

**Framework Reference:**
- [NIST CSF 2.0 / CIS Controls / OWASP SAMM / NIST SSDF control reference]

**Effort:** [Quick | Standard | Extended]
```

**Expected output:** Complete recommendation for every finding
**On failure:** If remediation unclear, research with WebSearch for best practices

### Step 4: Provide Alternatives (Complex Items)

**Tool:** Direct analysis

For complex P0/P1 recommendations, present options:

| Option | Pros | Cons | Effort |
|--------|------|------|--------|
| Option A | [benefits] | [drawbacks] | [effort] |
| Option B | [benefits] | [drawbacks] | [effort] |

**Recommendation:** [Which option and why]

**Expected output:** Alternatives documented for complex items
**On failure:** If only one viable option exists, document that

### Step 5: Map to Frameworks

**Tool:** Direct analysis

Ensure every recommendation maps to at least one security framework:

| Domain | Finding Type | Framework Reference |
|--------|-------------|---------------------|
| A | Authentication | NIST PR.AA-*, OWASP A07, CIS Control 5 |
| A | Encryption | NIST PR.DS-*, PCI-DSS 3.x, CIS Control 3 |
| A | Network segmentation | NIST PR.AC-*, CIS Control 12 |
| A | Logging/monitoring | NIST DE.CM-*, CIS Control 8 |
| B | SDLC security | NIST SSDF PW.*, OWASP SAMM Design |
| B | Vulnerability management | NIST SSDF RV.*, OWASP SAMM Operations |
| B | Security testing | NIST SSDF VT.*, OWASP SAMM Verification |
| C | Patch process | CIS Control 7, NIST PR.IP-12 |
| C | Emergency patching | NIST RS.MI-*, CIS Control 7.4 |
| B | API broken object auth | OWASP API1, NIST PR.AA-5, CIS Control 6 |
| B | API authentication | OWASP API2, NIST PR.AA-*, CIS Control 5 |
| B | API rate limiting / abuse | OWASP API4, NIST PR.PT-4, CIS Control 9 |
| B | API misconfiguration | OWASP API8, NIST PR.PS-*, CIS Control 4 |
| B | API inventory | OWASP API9, NIST ID.AM-*, CIS Control 1 |
| E | SBOM / dependency risk | NIST SSDF PS.3, CIS Control 16, SLSA L2+ |
| E | Build integrity | NIST SSDF PS.4, SLSA L3+, CIS Control 16 |
| E | Vendor/third-party risk | NIST CSF ID.SC-*, CIS Control 15 |

**Expected output:** All recommendations have framework references
**On failure:** Research correct framework mappings

### Step 6: Write Recommendations

**Tool:** Write
**Reference:** Output directory

Write `RECOMMENDATIONS.md`:

```markdown
# Security Review Recommendations

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | [n] | Critical — fix immediately |
| P1 | [n] | High — fix within sprint |
| P2 | [n] | Medium — plan remediation |
| P3 | [n] | Low — backlog |

**Domains Covered:** [A, B, C, E as applicable]

## Prioritized Recommendations

### P0 — Critical

[Recommendation details...]

### P1 — High

[Recommendation details...]

### P2 — Medium

[Recommendation details...]

### P3 — Low

[Recommendation details...]
```

**Expected output:** RECOMMENDATIONS.md written to output directory
**On failure:** If write fails, report error and retry

### Step 6a: Generate Gap Analysis

**Tool:** Write, Read (analysis files from Phase 2)
**Reference:** All domain analysis files in the output directory

Create `GAP-ANALYSIS.md` — a structured comparison of current state vs target state for
each security domain assessed. This document provides a compliance-style gap matrix
that stakeholders can use for roadmap planning.

Format each domain as a table:

```markdown
# Gap Analysis

## Summary

| Domain | Areas Assessed | Gaps Identified | Critical Gaps |
|--------|---------------|-----------------|---------------|
| A: Architecture | [n] | [n] | [n] |
| B: Security Practices | [n] | [n] | [n] |  (if selected)
| C: Patch Management | [n] | [n] | [n] |  (if selected)
| E: Supply Chain | [n] | [n] | [n] |       (if selected)

## Domain A: Architecture & Environment

| Control Area | Current State | Target State | Gap | Priority | Effort |
|-------------|---------------|--------------|-----|----------|--------|
| Trust boundaries | [current] | [target] | [gap description] | P0-P3 | Quick/Standard/Extended |
| Data encryption in transit | [current] | [target] | [gap] | P0-P3 | ... |
| Authentication at perimeter | [current] | [target] | [gap] | P0-P3 | ... |
| Attack surface management | [current] | [target] | [gap] | P0-P3 | ... |
| Logging & monitoring | [current] | [target] | [gap] | P0-P3 | ... |

## Domain B: Security Practices  (include section only if Domain B selected)

| OWASP SAMM Area | Current Maturity | Target Maturity | Gap | Priority | Effort |
|-----------------|-----------------|-----------------|-----|----------|--------|
| SDLC Security | [0-3] | [0-3] | [gap] | P0-P3 | ... |
...

## Domain C: Patch Management  (include section only if Domain C selected)

| Category | Current Score | Target Score | Gap | Priority | Effort |
|----------|--------------|--------------|-----|----------|--------|
| Process | [1-5] | [1-5] | [gap] | P0-P3 | ... |
...

## Domain E: Supply Chain  (include section only if Domain E selected)

| Area | Current Maturity | Target Maturity | Gap | Priority | Effort |
|------|-----------------|-----------------|-----|----------|--------|
| SBOM | [1-5] | [1-5] | [gap] | P0-P3 | ... |
...
```

Pull current state from Phase 2 analysis files. Derive target state from industry best
practices and framework requirements. Every gap in RECOMMENDATIONS.md should correspond
to a row in this table.

**Expected output:** GAP-ANALYSIS.md written to output directory
**On failure:** If analysis data insufficient, note gaps and complete what is possible

---

## OUTPUT CONTRACT

**Produces:**
- `RECOMMENDATIONS.md` → `private/output/sec-review/{project}-{date}/RECOMMENDATIONS.md`
- `GAP-ANALYSIS.md` → `private/output/sec-review/{project}-{date}/GAP-ANALYSIS.md`

**Format:** Prioritized recommendations with implementation steps, framework references, and effort
estimates — organized by P0-P3 and domain. Gap analysis with current vs target state comparison
matrix per domain.

---

## NEXT

**On success:** → Proceed to Phase 4 (Document):

Load `skills/sec-review/phases/04-document.md` with:
- Recommendations file from this phase
- GAP-ANALYSIS.md from this phase
- All analysis files from Phase 2
- Domain selection
- Scope from Phase 1
- Output directory path

**On incomplete recommendations:** → Loop back to Step 3 for missing items

**On analysis gaps discovered:** → Return to Phase 2 to complete analysis

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Every finding has a corresponding recommendation
- [ ] All recommendations prioritized P0-P3
- [ ] Each recommendation has specific implementation steps
- [ ] Framework references included for all recommendations
- [ ] Effort estimates provided for each recommendation
- [ ] RECOMMENDATIONS.md written to output directory
- [ ] GAP-ANALYSIS.md written with current vs target state for all selected domains
- [ ] Ready to proceed to Phase 4 (DOCUMENT)

**Error recovery:**
- If findings incomplete: Return to Phase 2 for additional analysis
- If remediation best practices unclear: Research with WebSearch
- If priority uncertain: Default to P2 and note uncertainty for stakeholder review
- If too many findings: Focus on P0/P1 first, batch P2/P3 as grouped recommendations

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
