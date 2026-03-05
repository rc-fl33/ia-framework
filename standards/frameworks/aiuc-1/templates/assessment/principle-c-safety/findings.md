---
type: template
name: safety-findings
principle: C - Safety
requirements: C001-C006, C009-C012
---

# Principle C: Safety Findings

**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR]
**Respondent(s):** [NAMES AND ROLES]

---

## Principle Summary

| Metric | Value |
|--------|-------|
| **Principle** | C - Safety |
| **Total Requirements** | 12 (C001-C012) |
| **Focus** | Mitigating harmful outputs and protecting brand reputation through testing and monitoring |

| Requirement | Status | Score |
|-------------|--------|-------|
| C001 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C002 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C003 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C004 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C005 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C006 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C009 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C010 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C011 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |
| C012 | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A | |

---

## C001 -- AI Risk Taxonomy

**Requirement:** Define AI risk taxonomy
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- EU AI Act: Article 9
- ISO 42001: A.5.2 to A.5.5, 4.1, 6.1.1 to 6.1.4, 8.2 to 8.4
- NIST AI RMF: GOVERN 1.3, GOVERN 1.4, GOVERN 4.2, MANAGE 1.2 to 1.4, MAP 1.5, MAP 5.1, MEASURE 1.1, MEASURE 2.10, MEASURE 2.11, MEASURE 3.1
- CSA AICM: A&A-05, A&A-06, BCR-02, CEK-07, DSP-09, GRC-02, MDS-11, MDS-12, CCC-03

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Has a risk taxonomy been established that categorizes risks within harmful, out-of-scope, and hallucinated outputs, tool calls, and other risks based on application-specific usage?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are risk categories defined for harmful outputs, out-of-scope responses, and hallucinations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is the taxonomy aligned with NIST AI RMF, EU AI Act, and ISO 42001?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is the taxonomy reviewed and updated quarterly?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Risk category definitions for harmful outputs
- Framework alignment documentation with NIST AI RMF, EU AI Act, ISO 42001
- Severity grading with consistent scoring methodology
- Quarterly taxonomy review records

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Risk categories for harmful/out-of-scope/hallucinations | [ ] Yes / [ ] No |
| Aligned with NIST AI RMF, EU AI Act, ISO 42001 | [ ] Yes / [ ] No |
| Reviewed quarterly | [ ] Yes / [ ] No |

**Full (100%):** Documented risk taxonomy with severity grading, framework alignment, and quarterly reviews
**Partial (50%):** Risk taxonomy exists but lacks severity grading or is not reviewed quarterly
**Non-Compliant (0%):** No AI risk taxonomy

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C002 -- Pre-Deployment Testing

**Requirement:** Conduct pre-deployment testing
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 9, Article 27
- ISO 42001: A.6.2.4, A.6.2.5
- NIST AI RMF: GOVERN 4.3, MANAGE 1.1, MAP 4.2, MEASURE 2.1, MEASURE 2.3, MEASURE 2.5, MEASURE 4.3
- MITRE ATLAS: AML-M0016
- CSA AICM: AIS-04 to AIS-07, AIS-12, CCC-02

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Is internal testing conducted before deployment across risk categories including high-risk, harmful, hallucinated, and out-of-scope outputs and tool calls?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are tests documented with results including hallucination testing and adversarial prompting?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are risk assessments performed before deployment with impact analysis?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are approval sign-offs obtained from accountable leads?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Testing documentation with results including hallucination testing and adversarial prompting
- Risk assessments before deployment with impact analysis
- Approval sign-offs from accountable leads

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Tests documented including hallucination and adversarial | [ ] Yes / [ ] No |
| Risk assessments before deployment | [ ] Yes / [ ] No |
| Approval sign-offs | [ ] Yes / [ ] No |

**Full (100%):** Comprehensive pre-deployment testing with documented results, risk assessment, and formal sign-off
**Partial (50%):** Some pre-deployment testing but coverage of risk categories is incomplete
**Non-Compliant (0%):** No pre-deployment testing

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C003 -- Harmful Output Prevention

**Requirement:** Prevent harmful outputs
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 9
- NIST AI RMF: MEASURE 2.11
- OWASP LLM Top 10: LLM05, LLM09
- CSA AICM: AIS-09, GRC-09, GRC-11, LOG-15, TVM-11

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent harmful outputs including distressed outputs, angry responses, high-risk advice, offensive content, bias, and deception?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is content filtering implemented for harmful content types (distress, anger, offensive, bias)?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are safety guardrails enforced for advice generation in sensitive domains?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are bias detection and mitigation controls operational?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Content filtering implementation for harmful content types
- Safety guardrails for advice generation in sensitive domains
- Bias detection and mitigation controls

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Content filtering for harmful content types | [ ] Yes / [ ] No |
| Safety guardrails for sensitive domains | [ ] Yes / [ ] No |
| Bias detection operational | [ ] Yes / [ ] No |

**Full (100%):** Content filtering with safety guardrails and bias detection across all harmful content types
**Partial (50%):** Some content filtering exists but coverage of harmful content types is incomplete
**Non-Compliant (0%):** No controls preventing harmful AI outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C004 -- Out-of-Scope Output Prevention

**Requirement:** Prevent out-of-scope outputs
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- NIST AI RMF: MAP 2.2, MAP 3.4
- OWASP LLM Top 10: LLM05
- CSA AICM: AIS-09, GRC-09, LOG-15, TVM-11

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent out-of-scope outputs such as political discussion or healthcare advice that fall outside the AI system's intended use cases?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is topic boundary enforcement implemented to detect and redirect off-topic conversations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are scope violation response procedures established with automated redirection?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is scope monitoring in place to track boundary violations and adjust controls?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Topic boundary enforcement detecting and redirecting off-topic conversations
- Scope violation response procedures with automated redirection
- Scope monitoring and adjustment tracking boundary violations

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Topic boundary enforcement | [ ] Yes / [ ] No |
| Scope violation response with redirection | [ ] Yes / [ ] No |
| Scope monitoring tracking violations | [ ] Yes / [ ] No |

**Full (100%):** Topic boundary enforcement with automated redirection and scope violation monitoring
**Partial (50%):** Some scope controls exist but boundary enforcement is inconsistent
**Non-Compliant (0%):** No controls preventing out-of-scope outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C005 -- Customer-Defined High Risk Output Prevention

**Requirement:** Prevent customer-defined high risk outputs
**Status:** Mandatory | Every 12 months | Preventative | Risk Weight: MEDIUM

**Cross-Framework Mapping:**
- EU AI Act: Article 9
- NIST AI RMF: MANAGE 1.4
- OWASP LLM Top 10: LLM05
- CSA AICM: GRC-09, LOG-15, TVM-11, STA-10

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards or technical controls implemented to prevent additional high-risk outputs as defined in the organization's risk taxonomy?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are detection and blocking mechanisms aligned with the organization's risk taxonomy?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are risk-based response controls implemented with flagging and logging?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are escalation procedures defined for flagged high-risk content?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Detection and blocking mechanisms aligned with risk taxonomy
- Risk-based response controls with flagging and logging
- Escalation procedures for flagged high-risk content

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Detection/blocking aligned with risk taxonomy | [ ] Yes / [ ] No |
| Risk-based response with flagging/logging | [ ] Yes / [ ] No |
| Escalation procedures | [ ] Yes / [ ] No |

**Full (100%):** Detection and blocking aligned with risk taxonomy with escalation procedures
**Partial (50%):** Some high-risk controls exist but not fully aligned with risk taxonomy
**Non-Compliant (0%):** No controls for customer-defined high-risk outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C006 -- Output Vulnerability Prevention

**Requirement:** Prevent output vulnerabilities
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- OWASP LLM Top 10: LLM05
- MITRE ATLAS: AML-M0020
- CSA AICM: AIS-09, TVM-02, AIS-07

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are safeguards implemented to prevent security vulnerabilities in AI outputs from impacting users?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is output sanitization and validation performed before content presentation to users?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are safety-specific labeling and handling protocols implemented?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are detection capabilities in place for advanced attack patterns like prompt injection chains?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Output sanitization and validation before content presentation
- Safety-specific labeling and handling protocols
- Detection and monitoring capabilities for suspicious content

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Output sanitization before presentation | [ ] Yes / [ ] No |
| Safety-specific labeling | [ ] Yes / [ ] No |
| Detection for advanced attack patterns | [ ] Yes / [ ] No |

**Full (100%):** Output sanitization with safety labeling and monitoring for suspicious content patterns
**Partial (50%):** Some output sanitization exists but monitoring for suspicious patterns is incomplete
**Non-Compliant (0%):** No output vulnerability prevention

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C009 -- Real-Time Feedback and Intervention

**Requirement:** Enable real-time feedback and intervention
**Status:** Optional | Every 3 months | Preventative | Risk Weight: LOW

**Cross-Framework Mapping:**
- EU AI Act: Article 14
- ISO 42001: A.8.3
- NIST AI RMF: GOVERN 3.2, MAP 3.5, MEASURE 3.3
- CSA AICM: GRC-15

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are mechanisms implemented to enable real-time user feedback collection and intervention during AI system interactions?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are on-screen communication systems implemented with status indicators and alerts?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Are user intervention capabilities available such as pause and stop functions?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Does the feedback system comply with WCAG 2.1 accessibility standards?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- On-screen communication systems with status and alerts
- User intervention capabilities like pause and stop functions
- Accessibility compliance with WCAG 2.1

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| On-screen communication with status/alerts | [ ] Yes / [ ] No |
| User intervention (pause/stop) | [ ] Yes / [ ] No |
| WCAG 2.1 compliance | [ ] Yes / [ ] No |

**Full (100%):** Real-time feedback collection with intervention capabilities and WCAG 2.1 compliance
**Partial (50%):** Some feedback mechanisms exist but intervention capabilities or accessibility is limited
**Non-Compliant (0%):** No real-time feedback or intervention mechanisms

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C010 -- Third-Party Testing for Harmful Outputs

**Requirement:** Third-party testing for harmful outputs
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- EU AI Act: Article 9
- ISO 42001: A.6.2.4
- NIST AI RMF: GOVERN 4.3, MANAGE 2.2, MEASURE 1.3, MEASURE 2.1, MEASURE 2.6, MEASURE 2.11, MEASURE 4.1, MEASURE 4.2
- CSA AICM: GRC-11, A&A-02, TVM-06

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are expert third parties appointed to evaluate system robustness to harmful outputs at least every 3 months?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are qualified assessors selected with documented expertise?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is testing executed quarterly using industry benchmarks?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are results and remediation documented and tracked?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Qualified assessor selection with documented expertise
- Quarterly testing execution using industry benchmarks
- Documentation of results and remediation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Qualified assessors selected | [ ] Yes / [ ] No |
| Testing executed quarterly with benchmarks | [ ] Yes / [ ] No |
| Results and remediation documented | [ ] Yes / [ ] No |

**Full (100%):** Qualified third-party assessors conducting quarterly testing with documented remediation
**Partial (50%):** Third-party testing performed but not quarterly or assessor qualifications undocumented
**Non-Compliant (0%):** No third-party testing for harmful outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C011 -- Third-Party Testing for Out-of-Scope Outputs

**Requirement:** Third-party testing for out-of-scope outputs
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- ISO 42001: A.6.2.4
- NIST AI RMF: GOVERN 4.3, MANAGE 2.2, MAP 2.2, MEASURE 1.3, MEASURE 2.1, MEASURE 2.6, MEASURE 4.1, MEASURE 4.2

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are qualified external assessors appointed to evaluate system robustness against out-of-scope outputs at minimum quarterly intervals?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are qualified third-party assessors selected for scope violation testing?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is a regular quarterly testing protocol documented and followed?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are findings and remediation actions documented and tracked?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Qualified third-party assessor selection
- Quarterly testing protocol documentation
- Findings and remediation documentation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Qualified third-party for scope testing | [ ] Yes / [ ] No |
| Quarterly protocol documented | [ ] Yes / [ ] No |
| Findings tracked | [ ] Yes / [ ] No |

**Full (100%):** Qualified third-party quarterly testing with documented findings and remediation
**Partial (50%):** Third-party testing performed but not quarterly or documentation incomplete
**Non-Compliant (0%):** No third-party testing for out-of-scope outputs

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C012 -- Third-Party Testing for Customer-Defined Risk

**Requirement:** Third-party testing for customer-defined risk
**Status:** Mandatory | Every 3 months | Preventative | Risk Weight: HIGH

**Cross-Framework Mapping:**
- ISO 42001: A.6.2.4
- NIST AI RMF: GOVERN 4.3, MANAGE 2.2, MEASURE 1.3, MEASURE 2.1, MEASURE 2.6, MEASURE 4.1, MEASURE 4.2
- CSA AICM: A&A-02, TVM-06

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Are expert third parties appointed to evaluate system robustness to additional high-risk outputs as defined in the risk taxonomy at least every 3 months?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are qualified third-party assessors appointed for customer-defined risk testing?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is regular quarterly testing conducted against the risk taxonomy?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are results and remediation maintained with documentation?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Qualified third-party assessor appointment
- Quarterly testing execution against risk taxonomy
- Documentation of results and remediation

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Qualified third-party for risk taxonomy testing | [ ] Yes / [ ] No |
| Quarterly testing against taxonomy | [ ] Yes / [ ] No |
| Results maintained | [ ] Yes / [ ] No |

**Full (100%):** Qualified third-party quarterly testing against risk taxonomy with documented remediation
**Partial (50%):** Third-party testing performed but not quarterly or not aligned with risk taxonomy
**Non-Compliant (0%):** No third-party testing for customer-defined risks

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
| C001 | | | | |
| C002 | | | | |
| C003 | | | | |
| C004 | | | | |
| C005 | | | | |
| C006 | | | | |
| C009 | | | | |
| C010 | | | | |
| C011 | | | | |
| C012 | | | | |

---

## Principle C: Safety Recommendations

### Immediate Actions
1. [Action and affected requirements]

### Short-Term Actions
1. [Action and affected requirements]

### Long-Term Actions
1. [Action and affected requirements]


## C007 -- High Risk Recommendation Flagging

**Requirement:** Flag high risk recommendations
**Status:** Optional | Every 12 months | Preventative | Risk Weight: LOW

**Cross-Framework Mapping:**
- ISO 42001: A.6.1.2, A.9.2, A.9.3
- NIST AI RMF: GOVERN 3.2, MAP 3.5
- MITRE ATLAS: AML-M0020
- CSA AICM: GRC-15

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Is an alerting system implemented that flags high-risk recommendations for human review?

**Response:** [Free-text response]

**Sub-Questions:**

1. Are risk criteria defined based on the organizational risk taxonomy for flagging?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is detection implemented using keyword filtering or confidence scoring?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Are review workflows established with designated reviewers and escalation procedures?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Risk criteria defined based on organizational risk taxonomy
- Detection using keyword filtering or confidence scoring
- Review workflows with designated reviewers and escalation procedures

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Risk criteria defined for flagging | [ ] Yes / [ ] No |
| Detection with keyword filtering or confidence scoring | [ ] Yes / [ ] No |
| Review workflows with designated reviewers | [ ] Yes / [ ] No |

**Full (100%):** Risk-based alerting with detection mechanisms and designated review workflows
**Partial (50%):** Some flagging exists but review workflows or escalation procedures are informal
**Non-Compliant (0%):** No alerting system for high-risk recommendations

### Findings

**Strengths:**
- [List strengths]

**Gaps:**
- [List gaps]

**Recommendations:**
- [List recommendations]

---

## C008 -- AI Risk Category Monitoring

**Requirement:** Monitor AI risk categories
**Status:** Optional | Every 12 months | Detective | Risk Weight: LOW

**Cross-Framework Mapping:**
- EU AI Act: Article 72
- ISO 42001: A.5.4, A.6.2.6, A.9.4, 6.1.1 to 6.1.3, 8.2, 8.3, 9.1
- NIST AI RMF: GOVERN 1.5, MANAGE 3.1, MANAGE 4.1, MEASURE 2.4, MEASURE 4.3
- CSA AICM: GRC-02, MDS-11, TVM-03, MDS-12, TVM-07

| Attribute | Response |
|-----------|----------|
| **Compliance Status** | [ ] Full / [ ] Partial / [ ] Non-Compliant / [ ] N/A |
| **Score** | [100% / 50% / 0% / Excluded] |
| **Evidence Reference** | [Document name, path, or artifact ID] |
| **Assessor Notes** | [Observations and commentary] |

### Assessment Questions

**Primary:** Is monitoring implemented across AI risk categories to detect emerging issues?

**Response:** [Free-text response]

**Sub-Questions:**

1. Is proactive detection implemented based on the risk taxonomy?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

2. Is ongoing monitoring conducted with regular evaluations?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

3. Is monitoring integrated with existing security tools using standard logging formats?
   - **Response:** [Response]
   - **Evidence:** [Evidence reference]

### Evidence Required

- Proactive detection implementation based on risk taxonomy
- Ongoing monitoring with regular evaluations
- Documentation maintenance with clear examples

### Scoring Assessment

| Criteria | Met? |
|----------|------|
| Proactive detection based on risk taxonomy | [ ] Yes / [ ] No |
| Ongoing monitoring with regular evaluations | [ ] Yes / [ ] No |
| Integration with security tools using standard logging | [ ] Yes / [ ] No |

**Full (100%):** Proactive risk detection with ongoing monitoring, regular evaluations, and documented examples
**Partial (50%):** Some monitoring exists but not aligned with risk taxonomy or evaluations are irregular
**Non-Compliant (0%):** No monitoring of AI risk categories

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
