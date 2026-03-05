---
type: template
name: data-privacy-findings
principle: A - Data & Privacy
requirements: A001-A007
---

# Principle A: Data & Privacy Findings

**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR]
**Respondent(s):** [NAMES AND ROLES]

---

## Principle Summary

| Metric | Value |
|--------|-------|
| **Principle** | A - Data & Privacy |
| **Total Requirements** | 7 (all mandatory) |
| **Frequency** | Every 12 months |
| **Focus** | Safeguarding customer information against leakage, IP exposure, and unauthorized training use |

| Requirement | Status | Score |
|-------------|--------|-------|
| A001 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A002 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A003 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A004 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A005 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A006 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| A007 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |

---

## A001 -- AI Input Data Policy

**Requirement:** Establish input data policy
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 11
- ISO 42001: A.7.2, A.7.3
- NIST AI RMF: MEASURE 2.10
- CSA AICM: DSP-11 to DSP-23

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Has the organization established and communicated AI input data policies covering customer data usage for model training, inference processing, data retention periods, and customer rights?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are opt-in/opt-out mechanisms and disclosure requirements defined for input data usage?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are retention periods documented and justified for each data category?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are processes in place for customer data subject rights (access, portability, deletion)?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Input data usage policy with opt-in/opt-out mechanisms
- Data retention and deletion procedures for training data and inference logs
- Documentation justifying retention periods for different data categories

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Documented input data policy with opt-out mechanisms | [ ] Yes / [ ] No |
| Defined retention periods | [ ] Yes / [ ] No |
| Customer rights procedures | [ ] Yes / [ ] No |

**Full (100%):** Documented input data policy with opt-out mechanisms, defined retention periods, and customer rights procedures
**Partial (50%):** Input data policy exists but lacks opt-out mechanisms or retention periods are undefined
**Non-Compliant (0%):** No formal AI input data policy

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A002 -- AI Output Data Policy

**Requirement:** Establish output data policy
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- CSA AICM: DSP-16, DSP-08, STA-10

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Has the organization established AI output ownership, usage, opt-out and deletion policies and communicated these to customers?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are output ownership rights clearly defined with distinctions between customer inputs and AI outputs?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are consent and opt-out procedures disclosed for AI outputs?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are output usage policies communicated through accessible terms of service?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Output ownership rights documentation with distinctions between customer inputs and AI outputs
- Consent and opt-out procedures for outputs
- Output usage policies communicated through terms of service

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Clear output ownership policy with opt-out procedures | [ ] Yes / [ ] No |
| Ownership distinctions documented | [ ] Yes / [ ] No |
| Policies communicated through accessible terms of service | [ ] Yes / [ ] No |

**Full (100%):** Clear output ownership policy with opt-out procedures communicated through accessible terms of service
**Partial (50%):** Output policies exist but ownership distinctions or opt-out procedures are unclear
**Non-Compliant (0%):** No formal AI output data policy

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A003 -- AI Agent Data Collection Limits

**Requirement:** Limit AI agent data collection
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- ISO 42001: A.7.2, A.7.3
- NIST AI RMF: MAP 2.1
- OWASP LLM Top 10: LLM06, LLM08, LLM10
- MITRE ATLAS: Data protection principles
- CSA AICM: DSP-07, DSP-08, DSP-22, AIS-11, IAM-17, IAM-19, MDS-04

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards implemented to restrict AI agent data access to task-relevant information based on user roles and context?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are data collection limits configured to reduce privacy exposure through time-bounded, task-specific data?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are scoping actions implemented based on agent objectives, session type, or workflow stage?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are dynamic context-based restrictions in place that adjust when user roles or environments change?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Data collection limits configured for time-bounded, task-specific, purpose-limited contextual data
- Scoping actions based on agent objectives, session type, or workflow stage
- Agent permission matrix aligned with organizational access policies

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Data collection limits enforced with task-specific scoping | [ ] Yes / [ ] No |
| Scoping actions based on agent objectives | [ ] Yes / [ ] No |
| IAM integration for dynamic restrictions | [ ] Yes / [ ] No |

**Full (100%):** Data collection limits enforced with task-specific scoping and IAM integration
**Partial (50%):** Some data access restrictions exist but not consistently scoped by role or context
**Non-Compliant (0%):** No safeguards limiting AI agent data collection

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A004 -- IP and Trade Secret Protection

**Requirement:** Protect IP & trade secrets
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- OWASP LLM Top 10: LLM03, LLM05, LLM08
- MITRE ATLAS: AML-M0020
- CSA AICM: DSP-01, DSP-10, DSP-02, DSP-07, DSP-08, DSP-16, UEM-08, DSP-12

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent AI systems from leaking company intellectual property or confidential information?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are foundation model provider safeguards documented as primary IP protection?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are supplementary data access controls established where provider protections are insufficient?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are output monitoring procedures implemented with automated review for high-risk scenarios?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Documentation of foundation model provider safeguards as primary IP protection
- Supplementary data access controls where provider protections are insufficient
- Output monitoring procedures for high-risk scenarios

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Provider safeguards documented | [ ] Yes / [ ] No |
| Supplementary controls established | [ ] Yes / [ ] No |
| Output monitoring for IP protection | [ ] Yes / [ ] No |

**Full (100%):** Provider safeguards documented with supplementary controls and output monitoring for IP protection
**Partial (50%):** Provider safeguards relied upon but supplementary controls incomplete
**Non-Compliant (0%):** No safeguards against AI IP leakage

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A005 -- Cross-Customer Data Isolation

**Requirement:** Prevent cross-customer data exposure
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- NIST AI RMF: MEASURE 2.10
- OWASP LLM Top 10: LLM02, LLM05, LLM08
- CSA AICM: I&S-06, DSP-22, UEM-08

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards implemented to prevent cross-customer data exposure when combining customer data from multiple sources?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is explicit consent obtained and disclosed when customer data combines with competitor data?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are customer data isolation controls implemented with logical or physical separation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are privacy-enhancing technologies or inference-time isolation mechanisms in place?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Explicit consent and disclosure when data combines with competitor data
- Customer data isolation controls with logical or physical separation
- Privacy-enhancing technologies or tenant-aware routing documentation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Consent mechanisms for data combination | [ ] Yes / [ ] No |
| Logical or physical data separation | [ ] Yes / [ ] No |
| Privacy-enhancing technologies deployed | [ ] Yes / [ ] No |

**Full (100%):** Customer data isolation with consent mechanisms and logical/physical separation verified
**Partial (50%):** Some isolation controls exist but not verified across all data combination points
**Non-Compliant (0%):** No controls preventing cross-customer data exposure

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A006 -- PII Leakage Prevention

**Requirement:** Prevent PII leakage
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- NIST AI RMF: MEASURE 2.10
- OWASP LLM Top 10: LLM02, LLM05, LLM08
- MITRE ATLAS: AML-M0020
- CSA AICM: DSP-10, DSP-17, HRS-12, DSP-13, UEM-08

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards established to prevent personal data leakage through AI outputs?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are data segregation controls implemented to isolate user sessions?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are user-specific output boundaries enforced between users?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are automated detection and redaction mechanisms in place for PII in outputs?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Data segregation controls isolating user sessions
- Safeguards between users with user-specific output boundaries
- Documentation identifying PII and defining output handling policies

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Data segregation controls for session isolation | [ ] Yes / [ ] No |
| User-specific output boundaries enforced | [ ] Yes / [ ] No |
| Automated PII detection and redaction | [ ] Yes / [ ] No |

**Full (100%):** Data segregation with PII identification, output boundaries, and automated detection/redaction
**Partial (50%):** Some PII safeguards exist but detection or redaction is incomplete
**Non-Compliant (0%):** No safeguards against PII leakage through AI outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## A007 -- IP Violation Prevention

**Requirement:** Prevent IP violations
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- ISO 42001: A.7.5
- NIST AI RMF: GOVERN 6.1, MAP 4.1
- OWASP LLM Top 10: LLM03, LLM05
- MITRE ATLAS: AML-M0020
- CSA AICM: AIS-09

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards and technical controls implemented to prevent AI outputs from violating copyrights, trademarks, or other third-party intellectual property rights?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are provider protections for copyright and trademark handling documented?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is supplementary filtering established for copyright and trademark violations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are incident response procedures maintained for potential infringement?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Documentation of provider protections for copyright and trademark handling
- Supplementary filtering for copyright and trademark violations
- Incident response procedures for potential infringement

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Provider protections documented | [ ] Yes / [ ] No |
| Supplementary filtering for IP violations | [ ] Yes / [ ] No |
| Incident response for infringement | [ ] Yes / [ ] No |

**Full (100%):** Provider protections documented with supplementary filtering and incident response for IP violations
**Partial (50%):** Provider protections relied upon but supplementary filtering incomplete
**Non-Compliant (0%):** No safeguards against IP violations in AI outputs

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
| A001 | | | | |
| A002 | | | | |
| A003 | | | | |
| A004 | | | | |
| A005 | | | | |
| A006 | | | | |
| A007 | | | | |

---

## Principle A Recommendations

### Immediate Actions
1. [Action and affected requirements]

### Short-Term Actions
1. [Action and affected requirements]

### Long-Term Actions
1. [Action and affected requirements]

---

**Generated:** [TIMESTAMP]
**Questions Bank:** `frameworks/aiuc-1/questions.yaml`
