---
type: template
name: societal-findings
principle: F - Society
requirements: F001-F002
---

# Principle F: Society Findings

**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR]
**Respondent(s):** [NAMES AND ROLES]

---

## Principle Summary

| Metric | Value |
|--------|-------|
| **Principle** | F - Society |
| **Total Requirements** | 2 (all mandatory) |
| **Frequency** | Every 12 months |
| **Focus** | Preventing AI-enabled societal harms including cyber exploitation and catastrophic risks |

| Requirement | Status | Score |
|-------------|--------|-------|
| F001 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| F002 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |

---

## F001 -- Prevent AI Cyber Misuse

**Requirement:** Prevent AI cyber misuse
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- ISO 42001: A.5.5
- NIST AI RMF: MEASURE 2.7
- CSA AICM: GRC-02, GRC-09, GRC-10, GRC-12, TVM-11

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are guardrails implemented or documented to prevent AI-enabled misuse for cyber attacks and exploitation?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are testing results from the foundation model developer on offensive cyber capabilities documented?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is there attestation that mitigations have not been removed?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are malicious use detection and blocking mechanisms implemented via content filtering?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Results of testing from foundation model developer on offensive cyber capabilities and mitigations
- Attestation the mitigations have not been removed
- Malicious use detection and blocking via content filtering

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Provider offensive cyber testing results documented | [ ] Yes / [ ] No |
| Attestation mitigations not removed | [ ] Yes / [ ] No |
| Malicious use detection via content filtering | [ ] Yes / [ ] No |

**Full (100%):** Provider attestation documented with offensive cyber testing results and mitigation verification
**Partial (50%):** Provider relied upon but attestation or testing results not formally documented
**Non-Compliant (0%):** No guardrails against AI cyber misuse

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## F002 -- Prevent Catastrophic Misuse

**Requirement:** Prevent catastrophic misuse
**Status:** Mandatory | Every 12 months | Detective | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- ISO 42001: A.5.5
- CSA AICM: GRC-02, GRC-09, GRC-10, GRC-12, TVM-11

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are guardrails implemented or documented to prevent AI-enabled catastrophic misuse involving chemical, biological, radiological, or nuclear (CBRN) weapons development or mass harm scenarios?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are testing results from the foundation model developer on CBRN capabilities documented?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is attestation provided confirming CBRN mitigations remain intact?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are relevant CBRN evaluations or proxy benchmarks considered?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Results of testing from foundation model developer on CBRN capabilities and mitigations
- Attestation confirming mitigations remain intact
- Relevant CBRN evaluations or proxy benchmarks

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Provider CBRN testing results documented | [ ] Yes / [ ] No |
| Attestation CBRN mitigations intact | [ ] Yes / [ ] No |
| CBRN evaluations or proxy benchmarks | [ ] Yes / [ ] No |

**Full (100%):** Provider CBRN testing results documented with attestation and mitigation verification
**Partial (50%):** Provider relied upon but CBRN attestation or testing results not formally documented
**Non-Compliant (0%):** No guardrails against catastrophic AI misuse

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## Evidence Summary

| Req ID | Evidence Type | Description | Reference | Gap? |
|--------|---------------|-------------|-----------|------|
| F001 | | | | |
| F002 | | | | |

---

## Principle F Recommendations

### Immediate Actions
1. [Action and affected requirements]

### Short-Term Actions
1. [Action and affected requirements]

### Long-Term Actions
1. [Action and affected requirements]

---

**Generated:** [TIMESTAMP]
**Questions Bank:** `frameworks/aiuc-1/questions.yaml`
