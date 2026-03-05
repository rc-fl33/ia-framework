---
domain: advisory
skill: advisory
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 3: RECOMMEND (Prioritized Recommendations)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Transform analysis findings into prioritized, actionable recommendations. Map each recommendation to security frameworks (NIST, OWASP, CIS). Provide implementation steps and effort estimates for each recommendation.

**Additional constraints:** Every finding from Phase 2 must have a corresponding recommendation. Recommendations must be specific and actionable — not vague guidance. Include implementation steps, framework references, and relative effort for each. Use P0-P3 priority levels consistently.

---

## INPUT CONTRACT

**Receives:**
- Analysis output from Phase 2 (research.md, ARCHITECTURE-ANALYSIS.md + THREAT-MODEL.md, or FINDINGS.md)
- Mode (ad-hoc, code-review) from Phase 1
- Scope from Phase 1
- Output directory: `private/output/advisory/{type}/{project}-{date}/`

**Prerequisites:**
- Phase 2 (ANALYZE) completed
- Analysis files exist in output directory
- Findings or threats identified

**Source:** `skills/advisory/phases/02-analyze.md`

---

## OBJECTIVE

**Goal:** Generate prioritized, actionable recommendations for every finding identified in Phase 2, mapped to security frameworks.

**Success criteria:**
- Every finding/threat has a corresponding recommendation
- All recommendations prioritized P0-P3 based on risk
- Each recommendation has specific implementation steps
- Framework references included (NIST, OWASP, CIS, CWE)
- Effort estimates provided for each recommendation

**Failure criteria:**
- Findings from Phase 2 are incomplete → Return to Phase 2
- Recommendations are vague ("improve security") → Rewrite with specifics
- No framework references → Add appropriate framework mappings

---

## METHODOLOGY

**Recommendations bridge the gap between "what is wrong" and "how to fix it."** A finding without a recommendation is noise. A recommendation without implementation steps is hand-waving.

**Prioritization approach:**
P0 items are immediate risks — things that could be exploited today. P1 items are significant risks that should be addressed in the current sprint. P2 items are moderate risks to plan for. P3 items are defense-in-depth improvements for the backlog. Priority is determined by combining likelihood of exploitation with impact of successful exploitation.

**Framework mapping adds credibility.** When a recommendation maps to NIST CSF 2.0 or OWASP controls, it carries more weight with stakeholders. It also helps organizations track remediation against their compliance obligations.

**For complex recommendations, provide alternatives.** Some fixes have multiple approaches with different trade-offs (cost, complexity, timeline). Present options so stakeholders can make informed decisions.

---

## EXECUTION

### Step 1: Load Analysis Findings

**Tool:** Read
**Reference:** Phase 2 output files in `private/output/advisory/{type}/{project}-{date}/`

Load and review all analysis output from Phase 2.

**Expected output:** Findings catalog ready for recommendation generation
**On failure:** If analysis files missing, return to Phase 2

### Step 2: Prioritize Findings

**Tool:** Direct analysis

Assign priority to each finding based on risk:

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
**Addresses:** [Finding/Threat reference]

**Recommendation:**
[Clear, specific, actionable guidance]

**Implementation:**
1. [Step 1 — specific action]
2. [Step 2 — specific action]
3. [Step 3 — specific action]

**Framework Reference:**
- [NIST CSF 2.0 / OWASP / CIS / CWE control reference]

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

| Finding Type | Framework Reference |
|--------------|---------------------|
| Authentication | NIST PR.AA-*, OWASP A07 |
| Input validation | CWE-20, OWASP A03 |
| Encryption | NIST PR.DS-*, PCI-DSS 3.x |
| Access control | NIST PR.AC-*, OWASP A01 |
| Logging | NIST DE.CM-*, CIS Control 8 |
| Configuration | CIS Controls, NIST PR.IP-* |

**Detailed control data:** When specific control guidance is needed beyond inline references,
load from the standards library:
- `standards/frameworks/{id}/controls.yaml` — structured control definitions
- `standards/frameworks/{id}/questions.yaml` — assessment questions and scoring criteria
- `standards/mappings/crosswalks/{id}.yaml` — cross-framework mappings

Priority frameworks for advisory: NIST CSF (`nist-csf`), ISO 27001 (`iso/27001`),
CIS Controls (`cis-controls`), MITRE ATLAS (`mitre-atlas`), OWASP LLM (`owasp-llm`)

**Expected output:** All recommendations have framework references
**On failure:** Research correct framework mappings

### Step 6: Write Recommendations & Display Checklist

**Tool:** Write
**Reference:** Output directory

Write `RECOMMENDATIONS.md` (arch/code-review) or `recommendations.md` (ad-hoc):

```markdown
# Recommendations

## Summary

| Priority | Count | Description |
|----------|-------|-------------|
| P0 | [n] | Critical — fix immediately |
| P1 | [n] | High — fix within sprint |
| P2 | [n] | Medium — plan remediation |
| P3 | [n] | Low — backlog |

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

**Expected output:** Recommendations file written to output directory
**On failure:** If write fails, report error and retry

---

## OUTPUT CONTRACT

**Produces:**
- `RECOMMENDATIONS.md` → written to `private/output/advisory/{type}/{project}-{date}/RECOMMENDATIONS.md` (arch/code-review)
- `recommendations.md` → written to `private/output/advisory/ad-hoc/{topic}-{date}/recommendations.md` (ad-hoc)

**Format:** Prioritized recommendations with implementation steps, framework references, and effort estimates

---

## NEXT

**On success:** → Proceed to Phase 4 (Document):

Load `skills/advisory/phases/04-document.md` with:
- Recommendations file from this phase
- All analysis files from Phase 2
- Mode and scope from Phase 1
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
- [ ] Recommendations file written to output directory
- [ ] Ready to proceed to Phase 4 (DOCUMENT)

**Error recovery:**
- If findings incomplete: Return to Phase 2 for additional analysis
- If remediation best practices unclear: Research with WebSearch
- If priority uncertain: Default to P2 and note uncertainty for stakeholder review
- If too many findings: Focus on P0/P1 first, batch P2/P3 as grouped recommendations

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
