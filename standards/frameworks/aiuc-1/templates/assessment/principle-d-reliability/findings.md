---
type: template
name: reliability-findings
principle: D - Reliability
requirements: D001, D003
---

# Principle D: Reliability Findings

**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR]
**Respondent(s):** [NAMES AND ROLES]

---

## Principle Summary

| Metric | Value |
|--------|-------|
| **Principle** | D - Reliability |
| **Total Requirements** | 4 (D001, D002, D003, D004) |
| **Focus** | Preventing hallucinations and unauthorized tool calls that cause customer harm |

| Requirement | Status | Score |
|-------------|--------|-------|
| D001 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| D003 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |

---

## D001 -- Hallucination Prevention

**Requirement:** Prevent hallucinated outputs
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- NIST AI RMF: MEASURE 2.5
- OWASP LLM Top 10: LLM05, LLM09
- CSA AICM: AIS-09, MDS-10, MDS-11

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent hallucinated outputs?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are factual accuracy controls implemented with fact-checking mechanisms?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is information source validation in place requiring citations for claims?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is uncertainty communicated to users through confidence levels?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Factual accuracy controls with fact-checking mechanisms
- Information source validation requiring citations
- Uncertainty communication displaying confidence levels

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Factual accuracy controls with fact-checking | [ ] Yes / [ ] No |
| Information source validation with citations | [ ] Yes / [ ] No |
| Uncertainty communicated via confidence levels | [ ] Yes / [ ] No |

**Full (100%):** Factual accuracy controls with citation requirements and confidence level display
**Partial (50%):** Some hallucination prevention exists but citation requirements or confidence display incomplete
**Non-Compliant (0%):** No controls preventing hallucinated outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## D003 -- Unsafe Tool Call Restrictions

**Requirement:** Restrict unsafe tool calls
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- NIST AI RMF: GOVERN 6.1
- OWASP LLM Top 10: LLM06, LLM08, LLM10
- MITRE ATLAS: AML-M0004, AML-M0024
- CSA AICM: AIS-06, AIS-10, AIS-11, AIS-13, MDS-10, MDS-11, TVM-11, TVM-12

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent AI tool calls from executing unauthorized actions, accessing restricted information, or making decisions beyond their intended scope?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is function call validation and authorization implemented?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are rate limits and transaction caps enforced on tool calls?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is execution monitoring and logging in place with pattern review and remediation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Function call validation and authorization
- Rate limits and transaction caps
- Execution monitoring and logging
- Decision boundary enforcement

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Function call validation and authorization | [ ] Yes / [ ] No |
| Rate limits and transaction caps | [ ] Yes / [ ] No |
| Execution monitoring with pattern review | [ ] Yes / [ ] No |

**Full (100%):** Function call validation with rate limits, execution monitoring, and decision boundary enforcement
**Partial (50%):** Some tool call restrictions exist but validation or monitoring is incomplete
**Non-Compliant (0%):** No controls restricting unsafe tool calls

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
| D001 | | | | |
| D003 | | | | |

---

## Principle D: Reliability Recommendations

### Immediate Actions
1. [Action and affected requirements]

### Short-Term Actions
1. [Action and affected requirements]

### Long-Term Actions
1. [Action and affected requirements]


## D002 -- Third-Party Hallucination Testing

**Requirement:** Third-party testing for hallucinations
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- ISO 42001: A.6.2.4
- NIST AI RMF: GOVERN 4.3, MANAGE 2.2, MEASURE 1.3, MEASURE 2.1, MEASURE 2.5, MEASURE 4.1, MEASURE 4.2
- OWASP LLM Top 10: LLM09
- CSA AICM: AIS-05, AIS-09, MDS-06, MDS-07

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are qualified external assessors appointed to evaluate hallucinated outputs at minimum quarterly intervals?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are qualified assessors selected with documented expertise in hallucination evaluation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are assessments executed at least quarterly?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are findings and remediation actions documented and tracked?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Qualified assessor selection with documented expertise
- Quarterly assessment execution
- Documentation of findings and remediation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Qualified assessors for hallucination evaluation | [ ] Yes / [ ] No |
| Assessments executed quarterly | [ ] Yes / [ ] No |
| Findings and remediation documented | [ ] Yes / [ ] No |

**Full (100%):** Qualified third-party quarterly hallucination assessments with documented remediation
**Partial (50%):** Hallucination testing performed but not quarterly or assessor qualifications undocumented
**Non-Compliant (0%):** No third-party hallucination testing

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## D004 -- Third-Party Tool Call Testing

**Requirement:** Third-party testing of tool calls
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- ISO 42001: A.6.2.4
- NIST AI RMF: GOVERN 4.3, GOVERN 6.1, MANAGE 2.2, MEASURE 1.3, MEASURE 2.1, MEASURE 2.6, MEASURE 4.1, MEASURE 4.2
- OWASP LLM Top 10: LLM06
- CSA AICM: AIS-05

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are expert third parties appointed to evaluate tool calls within AI systems at least quarterly, assessing risks including unauthorized action execution and scope violations?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are qualified assessors selected for tool call security evaluation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is a regular quarterly testing protocol followed?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are findings and documentation requirements maintained?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Qualified assessor selection
- Quarterly testing protocol for tool call security
- Documentation of findings and requirements

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Qualified assessors for tool call security | [ ] Yes / [ ] No |
| Regular quarterly testing protocol | [ ] Yes / [ ] No |
| Findings and documentation maintained | [ ] Yes / [ ] No |

**Full (100%):** Qualified third-party quarterly tool call assessments with documented findings
**Partial (50%):** Tool call testing performed but not quarterly or documentation incomplete
**Non-Compliant (0%):** No third-party testing of tool calls

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

---

**Generated:** [TIMESTAMP]
**Questions Bank:** `frameworks/aiuc-1/questions.yaml`
