---
type: template
name: security-findings
principle: B - Security
requirements: B001-B009
---

# Principle B: Security Findings

**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR]
**Respondent(s):** [NAMES AND ROLES]

---

## Principle Summary

| Metric | Value |
|--------|-------|
| **Principle** | B - Security |
| **Total Requirements** | 9 (6 mandatory, 3 optional) |
| **Frequencies** | Quarterly (B001, B002, B007), Annual (B003-B006, B008-B009) |
| **Focus** | Defending against adversarial testing, prompt injection, and jailbreak attempts |

| Requirement | Status | Score |
|-------------|--------|-------|
| B001 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B002 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B003 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B004 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B005 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B006 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B007 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B008 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| B009 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |

---

## B001 -- Adversarial Robustness Testing

**Requirement:** Third-party testing of adversarial robustness
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- NIST AI RMF: GOVERN 4.3, MEASURE 2.1, MEASURE 2.6, MEASURE 2.7
- OWASP LLM Top 10: LLM01, LLM04, LLM05, LLM08
- MITRE ATLAS: AML-M0003, AML-M0004
- CSA AICM: AIS-07, MDS-06, MDS-07, TVM-01 to TVM-13

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Is an adversarial testing program implemented to validate system resilience against adversarial inputs and prompt injection attempts at least quarterly?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is a risk taxonomy established referencing NIST AI 100-2e2023 attack classifications?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are quarterly comprehensive tests conducted including red-teaming, prompt injection, and jailbreak attempts?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are improvement processes established with remediation owners and severity-based timelines?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Risk taxonomy referencing NIST AI 100-2e2023 attack classifications
- Quarterly testing results including red-teaming, prompt injection, and jailbreak assessments
- Secure documentation of test cases, methods, and outcomes
- Improvement processes with remediation owners and severity-based timelines

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Risk taxonomy referencing NIST AI 100-2e2023 | [ ] Yes / [ ] No |
| Quarterly adversarial testing | [ ] Yes / [ ] No |
| Remediation tracking with severity timelines | [ ] Yes / [ ] No |

**Full (100%):** Quarterly adversarial testing with documented risk taxonomy, remediation tracking, and severity-based timelines
**Partial (50%):** Adversarial testing performed but not quarterly or lacking formal risk taxonomy
**Non-Compliant (0%):** No adversarial testing program

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B002 -- Adversarial Input Detection

**Requirement:** Detect adversarial input
**Status:** Optional | Every 3 months | Detective | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 15, Article 72
- NIST AI RMF: GOVERN 1.5, MEASURE 2.4, MEASURE 2.7, MEASURE 3.1
- OWASP LLM Top 10: LLM01, LLM08, LLM10
- MITRE ATLAS: AML-M0003, AML-M0015, AML-M0024, AML-M0021
- CSA AICM: AIS-08, MDS-07, TVM-01, TVM-04, UEM-09, TVM-02, AIS-10, LOG-14

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are monitoring capabilities implemented to detect and respond to adversarial inputs and prompt injection attempts?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is detection and alerting implemented for prompt injection patterns and jailbreak techniques?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are incidents logged with timestamps and user context for response?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are quarterly effectiveness reviews conducted to update detection rules?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Detection and alerting for prompt injection patterns, jailbreak techniques, and rate limit violations
- Incident logging and response with timestamps and user context
- Quarterly effectiveness reviews updating detection rules

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Detection/alerting for prompt injection | [ ] Yes / [ ] No |
| Incident logging with context | [ ] Yes / [ ] No |
| Quarterly effectiveness reviews | [ ] Yes / [ ] No |

**Full (100%):** Real-time detection with alerting, incident logging, and quarterly effectiveness reviews
**Partial (50%):** Some detection exists but alerting or quarterly reviews are incomplete
**Non-Compliant (0%):** No monitoring for adversarial inputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B003 -- Technical Detail Disclosure Management

**Requirement:** Manage public release of technical details
**Status:** Optional | Every 12 months | Preventative | Risk Weight: LOW

**Cross-Framework Mapping:**
- OWASP LLM Top 10: LLM02, LLM07
- MITRE ATLAS: AML-M0000, AML-M0001
- CSA AICM: AIS-09, AIS-15

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are controls implemented to prevent over-disclosure of technical information about AI systems that could enable adversarial targeting?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are limitations documented on what technical information can be publicly released?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are organizational information disclosure controls in place?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is there an approval process for public content referencing AI capabilities?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Documentation of limitations on technical information release
- Controls on organizational information disclosure
- Approval processes for public content referencing AI capabilities

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Limitations on technical info release | [ ] Yes / [ ] No |
| Organizational info disclosure controls | [ ] Yes / [ ] No |
| Approval process for public AI content | [ ] Yes / [ ] No |

**Full (100%):** Documented disclosure limitations with approval processes for public AI-related content
**Partial (50%):** Some disclosure controls exist but approval processes are informal
**Non-Compliant (0%):** No controls on technical information disclosure

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B004 -- Endpoint Scraping Prevention

**Requirement:** Prevent AI endpoint scraping
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 15
- NIST AI RMF: MEASURE 2.7
- OWASP LLM Top 10: LLM02, LLM05, LLM08, LLM10
- MITRE ATLAS: AML-M0003, AML-M0004
- CSA AICM: AIS-10, UEM-01, UEM-05, UEM-09, UEM-10, UEM-14, TVM-06

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards implemented to prevent probing or scraping of external AI endpoints?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is usage pattern distinction implemented using behavioral analytics?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are rate limits and per-user query quotas enforced?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are simulated attack tests conducted against AI endpoints with remediation tracking?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Usage pattern distinction using behavioral analytics
- Rate limiting and query controls with per-user quotas
- Simulated attack testing against endpoints
- Endpoint security remediation based on test outcomes

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Usage pattern distinction with behavioral analytics | [ ] Yes / [ ] No |
| Rate limits and per-user quotas | [ ] Yes / [ ] No |
| Simulated attack testing | [ ] Yes / [ ] No |

**Full (100%):** Behavioral analytics with rate limiting, simulated attack testing, and remediation tracking
**Partial (50%):** Rate limiting exists but behavioral analytics or attack testing incomplete
**Non-Compliant (0%):** No endpoint scraping prevention

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B005 -- Real-Time Input Filtering

**Requirement:** Implement real-time input filtering
**Status:** Optional | Every 12 months | Detective | Risk Weight: LOW

**Cross-Framework Mapping:**
- NIST AI RMF: MEASURE 2.7
- OWASP LLM Top 10: LLM01, LLM04, LLM10
- MITRE ATLAS: AML-M0015, AML-M0021
- CSA AICM: LOG-14, AIS-08, AIS-15

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are automated moderation tools deployed for real-time input filtering to detect and block policy-violating or adversarial inputs?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are automated moderation tools integrated to scan inputs for policy violations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are flagged inputs blocked, redirected, or modified before model processing?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are confidence thresholds established and documented for block/warn/log/allow actions?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Automated moderation tools scanning for violations
- Block, redirect, or modify flagged inputs before model processing
- Confidence thresholds documented for block/warn/log/allow actions

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Automated moderation tools for violations | [ ] Yes / [ ] No |
| Flagged inputs blocked/redirected | [ ] Yes / [ ] No |
| Confidence thresholds documented | [ ] Yes / [ ] No |

**Full (100%):** Automated moderation with documented confidence thresholds and flagged input handling
**Partial (50%):** Some input filtering exists but confidence thresholds or moderation logic undocumented
**Non-Compliant (0%):** No real-time input filtering

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B006 -- AI Agent System Access Limits

**Requirement:** Limit AI agent system access
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- NIST AI RMF: MAP 2.1
- OWASP LLM Top 10: LLM08, LLM10
- CSA AICM: AIS-11, IAM-19, DSP-07

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards implemented to limit AI agent system access based on context and declared objectives?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are contextual access controls implemented with task-based tool access?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are privilege limits enforced to prevent access escalation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is operational scope monitored and enforced with automatic restriction triggers?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Contextual access controls with task-based tool access
- Privilege limiting to prevent access escalation
- Monitoring and enforcement of operational scope

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Contextual access controls with task-based tool access | [ ] Yes / [ ] No |
| Privilege limits enforced | [ ] Yes / [ ] No |
| Operational scope monitored | [ ] Yes / [ ] No |

**Full (100%):** Contextual access controls with privilege limiting and operational scope enforcement
**Partial (50%):** Some access controls exist but privilege escalation prevention is incomplete
**Non-Compliant (0%):** No limits on AI agent system access

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B007 -- User Access Privileges

**Requirement:** Enforce user access privileges to AI systems
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- OWASP LLM Top 10: LLM02, LLM06, LLM10
- MITRE ATLAS: AML-M0005, AML-M0019
- CSA AICM: IAM controls, DSP controls, LOG controls

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are user access controls and admin privileges established and maintained for AI systems in line with organizational policy?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are system-level access controls implemented based on job function?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are administrative privileges restricted to authorized personnel only?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are access reviews conducted and updated quarterly?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- System-level access controls based on job function
- Administrative privilege restrictions to authorized personnel
- Quarterly access reviews and updates

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| System-level access controls by job function | [ ] Yes / [ ] No |
| Admin privileges restricted | [ ] Yes / [ ] No |
| Access reviews conducted quarterly | [ ] Yes / [ ] No |

**Full (100%):** Role-based access controls with restricted admin privileges and quarterly reviews
**Partial (50%):** Access controls exist but admin privileges are overly broad or reviews are infrequent
**Non-Compliant (0%):** No formal user access controls for AI systems

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B008 -- Model Deployment Environment Protection

**Requirement:** Protect model deployment environment
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 15
- OWASP LLM Top 10: LLM07
- MITRE ATLAS: AML-M0005, AML-M0012, AML-M0019
- CSA AICM: AIS-06, AIS-14, CEK-01 to CEK-21, IAM-04, IAM-14, MDS-01, MDS-02, MDS-08, MDS-09, UEM-08, DSP-07

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are security measures implemented for AI model deployment environments including encryption, access controls, and authorization?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is model access protected with MFA and regular user access reviews?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are deployment security controls implemented with scoped API tokens and TLS?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is model integrity verified using cryptographic checksums?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Model access protection with MFA and user access reviews
- Deployment security controls with scoped API tokens and TLS
- Model hosting environment security documentation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Model access protected with MFA | [ ] Yes / [ ] No |
| Deployment security with scoped API tokens and TLS | [ ] Yes / [ ] No |
| Model integrity verified with checksums | [ ] Yes / [ ] No |

**Full (100%):** MFA-protected model access with TLS, scoped API tokens, and hardened hosting environment
**Partial (50%):** Some deployment security exists but encryption or access controls are incomplete
**Non-Compliant (0%):** No security measures for model deployment environments

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## B009 -- Output Over-Exposure Limits

**Requirement:** Limit output over-exposure
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- NIST AI RMF: MEASURE 2.10
- OWASP LLM Top 10: LLM02, LLM05, LLM08, LLM09
- MITRE ATLAS: AML-M0002
- CSA AICM: AIS-09

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are output limitations and obfuscation techniques implemented to safeguard against information leakage?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are result quantities restricted to balance security with utility?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are sensitive system details filtered from outputs?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are user-facing notices provided on output limitations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Result quantity restrictions balancing security with utility
- Filtering of sensitive system details from outputs
- User-facing notices on output limitations

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Result quantities restricted | [ ] Yes / [ ] No |
| Sensitive system details filtered | [ ] Yes / [ ] No |
| User-facing limitation notices | [ ] Yes / [ ] No |

**Full (100%):** Output restrictions with system detail filtering and user-facing limitation notices
**Partial (50%):** Some output restrictions exist but system details may leak or user notices are missing
**Non-Compliant (0%):** No output limitation controls

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
| B001 | | | | |
| B002 | | | | |
| B003 | | | | |
| B004 | | | | |
| B005 | | | | |
| B006 | | | | |
| B007 | | | | |
| B008 | | | | |
| B009 | | | | |

---

## Principle B Recommendations

### Immediate Actions
1. [Action and affected requirements]

### Short-Term Actions
1. [Action and affected requirements]

### Long-Term Actions
1. [Action and affected requirements]

---

**Generated:** [TIMESTAMP]
**Questions Bank:** `frameworks/aiuc-1/questions.yaml`
