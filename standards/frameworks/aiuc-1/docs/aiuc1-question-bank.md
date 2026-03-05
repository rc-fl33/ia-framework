---
type: reference
name: aiuc1-question-bank
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-16
---

# AIUC-1 Question Bank

**Purpose:** Human-readable version of the AIUC-1 questions.yaml optimized for reading, printing, and interview preparation. This document transforms the structured YAML question bank into assessor-friendly format.

**Audience:** Assessors conducting AIUC-1 evaluations, organizations preparing for assessments, third-party auditors.

**Source:** `standards/frameworks/aiuc-1/questions.yaml` (3,329 lines, 51 questions)

**Related Documents:**
- `aiuc1-assessor-playbook.md` - Complete assessor reference
- `aiuc1-handbook.md` - Framework overview
- `aiuc1-implementation-guide.md` - Per-control remediation
- `questions.yaml` - Machine-readable source

---

## How to Use This Document

### For Assessors

This question bank provides:
- **Main assessment questions** for each of the 51 controls
- **Sub-questions** breaking down complex requirements
- **Evidence required** with specific examples
- **Scoring criteria** (Full/Partial/None compliance)
- **Interviewer notes** and testing guidance

Use during:
- Pre-assessment document requests
- Stakeholder interviews
- Evidence collection and validation
- Compliance scoring and reporting

### For Organizations

Use this to:
- Understand what assessors will ask
- Prepare evidence in advance
- Self-assess compliance posture
- Train staff on control requirements

### Document Structure

Each control includes:
1. **Main Question** - Primary assessment question
2. **Control Details** - Status (Mandatory/Optional), Frequency
3. **Sub-Questions** - Detailed assessment areas
4. **Evidence Required** - Specific artifacts with examples
5. **Scoring Criteria** - Full/Partial/None definitions
6. **Test Scenarios** - Practical verification steps
7. **Common Gaps** - Typical failure patterns
8. **Interviewer Notes** - Assessment tips

---

## Quick Reference Matrix

### Control Summary Table

| Control | Title | Status | Frequency | Assessor Agent |
|---------|-------|--------|-----------|----------------|
| **Principle A: Data & Privacy** |
| A001 | Establish input data policy | Mandatory | Annual | Advisor |
| A002 | Establish output data policy | Mandatory | Annual | Advisor |
| A003 | Limit AI agent data collection | Mandatory | Annual | Advisor |
| A004 | Protect IP & trade secrets | Mandatory | Annual | Advisor |
| A005 | Prevent cross-customer data exposure | Mandatory | Annual | Advisor |
| A006 | Prevent PII leakage | Mandatory | Annual | Advisor |
| A007 | Prevent IP violations | Mandatory | Annual | Advisor |
| **Principle B: Security** |
| B001 | Third-party adversarial testing | Mandatory | Quarterly | Security |
| B002 | Detect adversarial input | Optional | Quarterly | Security |
| B003 | Manage technical disclosure | Optional | Annual | Security |
| B004 | Prevent endpoint scraping | Mandatory | Annual | Security |
| B005 | Real-time input filtering | Optional | Annual | Security |
| B006 | Limit agent system access | Mandatory | Annual | Security |
| B007 | Enforce user access privileges | Mandatory | Quarterly | Security |
| B008 | Protect deployment environment | Mandatory | Annual | Security |
| B009 | Limit output over-exposure | Mandatory | Annual | Security |
| **Principle C: Safety** |
| C001 | Define AI risk taxonomy | Mandatory | Quarterly | Advisor |
| C002 | Pre-deployment testing | Mandatory | Annual | Security |
| C003 | Prevent harmful outputs | Mandatory | Annual | Security |
| C004 | Prevent out-of-scope outputs | Mandatory | Annual | Security |
| C005 | Prevent high-risk outputs | Mandatory | Annual | Security |
| C006 | Prevent output vulnerabilities | Mandatory | Quarterly | Security |
| C007 | Flag high-risk recommendations | Optional | Annual | Advisor |
| C008 | Monitor risk categories | Optional | Annual | Advisor |
| C009 | Real-time feedback/intervention | Optional | Quarterly | Advisor |
| C010 | Third-party harmful output testing | Mandatory | Quarterly | Security |
| C011 | Third-party out-of-scope testing | Mandatory | Quarterly | Security |
| C012 | Third-party customer risk testing | Mandatory | Quarterly | Security |
| **Principle D: Reliability** |
| D001 | Prevent hallucinated outputs | Mandatory | Annual | Security |
| D002 | Third-party hallucination testing | Mandatory | Quarterly | Security |
| D003 | Restrict unsafe tool calls | Mandatory | Annual | Security |
| D004 | Third-party tool call testing | Mandatory | Quarterly | Security |
| **Principle E: Accountability** |
| E001 | Failure plan: security breaches | Mandatory | Annual | Advisor |
| E002 | Failure plan: harmful outputs | Mandatory | Annual | Advisor |
| E003 | Failure plan: hallucinations | Mandatory | Annual | Advisor |
| E004 | Assign accountability | Mandatory | Annual | Advisor |
| E005 | Cloud vs on-prem assessment | Mandatory | Annual | Advisor |
| E006 | Vendor due diligence | Mandatory | Annual | Advisor |
| E007 | System change approvals | Optional | Annual | Advisor |
| E008 | Internal process reviews | Mandatory | Annual | Advisor |
| E009 | Third-party access monitoring | Optional | Annual | Security |
| E010 | AI acceptable use policy | Mandatory | Annual | Advisor |
| E011 | Record processing locations | Mandatory | Annual | Advisor |
| E012 | Document regulatory compliance | Mandatory | Semi-annual | Advisor |
| E013 | Quality management system | Optional | Annual | Advisor |
| E014 | Transparency reports | Optional | Annual | Advisor |
| E015 | Log model activity | Mandatory | Annual | Security |
| E016 | AI disclosure mechanisms | Mandatory | Annual | Advisor |
| E017 | System transparency policy | Optional | Annual | Advisor |
| **Principle F: Society** |
| F001 | Prevent AI cyber misuse | Mandatory | Annual | Security |
| F002 | Prevent catastrophic misuse | Mandatory | Annual | Security |

---

## Principle A: Data & Privacy

### A001: Establish Input Data Policy

**Main Question:**
Has the organization established and communicated AI input data policies covering customer data usage for model training, inference processing, data retention periods, and customer rights?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Annual (Every 12 months)
- **Control Type:** Preventative
- **Risk Weight:** MEDIUM

**Sub-Questions:**
1. Are opt-in/opt-out mechanisms and disclosure requirements defined for input data usage?
2. Are retention periods documented and justified for each data category?
3. Are processes in place for customer data subject rights (access, portability, deletion)?

**Evidence Required:**

1. **Policy Document**
   - Input data usage policy with opt-in/opt-out mechanisms
   - Examples:
     - "AI Input Data Policy v2.1.pdf with Board approval signatures and effective date"
     - "Data Governance Framework Section 4: AI Data Usage with version history"
     - "Confluence policy page showing: training vs inference data usage, opt-out procedures, customer rights"

2. **Data Inventory**
   - Data retention and deletion procedures for training data and inference logs
   - Examples:
     - "Data inventory spreadsheet listing all AI data sources with retention periods (30/60/90 days)"
     - "Database table retention policies documented in data dictionary"
     - "Automated deletion job configurations (cron jobs, S3 lifecycle policies, database TTLs)"
     - "Audit log of data deletions showing automated enforcement (last 90 days)"

3. **Justification**
   - Documentation justifying retention periods for different data categories
   - Examples:
     - "Legal memo documenting retention requirements by jurisdiction (GDPR: 30 days, CCPA: 90 days)"
     - "Business justification for training data retention (model retraining requires 6-month history)"
     - "Risk assessment justifying inference log retention (fraud detection requires 1-year lookback)"

**Scoring Criteria:**

**Full Compliance:**
- Documented input data policy with opt-out mechanisms
- Defined retention periods for all data categories
- Customer rights procedures functional (access, portability, deletion)

**Partial Compliance:**
- Input data policy exists but lacks opt-out mechanisms OR retention periods are undefined

**Non-Compliant:**
- No formal AI input data policy

**Test Scenarios:**

1. **Policy Completeness**
   - Expected Evidence: Policy covers training, inference, retention, and customer rights sections
   - Pass Criteria: All 4 sections present with specific procedures

2. **Opt-Out Functional**
   - Expected Evidence: Customer opt-out request processed within 7 days with confirmation email
   - Pass Criteria: Opt-out process tested and working end-to-end

3. **Retention Enforced**
   - Expected Evidence: Deletion logs showing data purged per policy (30/60/90 day retention)
   - Pass Criteria: Automated enforcement verified via audit logs

**Common Gaps:**

1. **Generic data policy without AI-specific language**
   - Indicator: Policy doesn't mention 'model training' or 'inference processing'
   - Remediation: Add AI-specific section covering training data usage, model versioning, bias mitigation

2. **Policy exists but not communicated**
   - Indicator: No training records, staff unaware of policy requirements
   - Remediation: Conduct mandatory training, add policy to onboarding checklist, brief support team

3. **No retention enforcement**
   - Indicator: Policy states 30-day deletion but data exists from 2+ years ago
   - Remediation: Implement automated deletion jobs, quarterly manual audit of long-lived data

**Interviewer Notes:**
- Request policy document one week in advance
- Verify retention enforcement with audit logs
- Test opt-out process end-to-end if possible
- Cross-reference data inventory with engineering team to identify shadow data sources

---

### A002: Establish Output Data Policy

**Main Question:**
Has the organization established AI output ownership, usage, opt-out and deletion policies and communicated these to customers?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Annual (Every 12 months)
- **Control Type:** Preventative
- **Risk Weight:** MEDIUM

**Sub-Questions:**
1. Are output ownership rights clearly defined with distinctions between customer inputs and AI outputs?
2. Are consent and opt-out procedures disclosed for AI outputs?
3. Are output usage policies communicated through accessible terms of service?

**Evidence Required:**

1. **Ownership Documentation**
   - Output ownership rights documentation
   - Examples:
     - "AI Output Policy stating: 'Customer owns all AI-generated content including text, images, and code'"
     - "Terms of Service Section 6: Intellectual Property Rights with output ownership clause"
     - "Output ownership decision matrix showing customer vs company ownership by output type"

2. **Opt-Out Procedures**
   - Consent and opt-out procedures for outputs
   - Examples:
     - "Account settings screenshot showing 'Do not use my outputs for training' toggle"
     - "Email template for output opt-out requests with 7-day SLA confirmation"
     - "API documentation for /api/user/preferences endpoint with training_opt_out parameter"
     - "Examples of processed opt-out requests with customer confirmation emails (last 90 days)"

3. **Communication**
   - Output usage policies communicated through terms of service
   - Examples:
     - "Terms of Service with prominent link in app footer and signup flow"
     - "Product onboarding screen explaining output ownership before first use"
     - "Customer FAQ page answering: 'Who owns my AI outputs? Can I delete them? Can you use them for training?'"
     - "Support team training materials on output policy (last updated within 6 months)"

**Scoring Criteria:**

**Full Compliance:**
- Clear output ownership policy with opt-out procedures communicated through accessible terms of service

**Partial Compliance:**
- Output policies exist but ownership distinctions or opt-out procedures are unclear

**Non-Compliant:**
- No formal AI output data policy

**Test Scenarios:**

1. **Ownership Clarity**
   - Expected Evidence: Policy uses definitive language: 'Customer owns outputs' not 'may own' or 'license'
   - Pass Criteria: No ambiguous weasel words, clear ownership statement

2. **Self-Service Opt-Out**
   - Expected Evidence: Account settings toggle works end-to-end, reflected in backend within 1 hour
   - Pass Criteria: User can opt out without contacting support

3. **Policy Visibility**
   - Expected Evidence: Policy link visible in product UI (footer, settings, onboarding)
   - Pass Criteria: User can find policy within 2 clicks from main screen

**Common Gaps:**

1. **Ambiguous license language instead of clear ownership**
   - Indicator: Policy says 'you grant us a license' without stating who owns outputs
   - Remediation: Clarify: 'You own all outputs. We only need a license to display them in the product.'

2. **Opt-out requires emailing support**
   - Indicator: No self-service toggle, customers must email and wait for manual processing
   - Remediation: Add account settings toggle, keep email as backup, measure opt-out friction

3. **Policy doesn't address AI-generated code ownership**
   - Indicator: Policy mentions 'content' but not 'code' or 'software'
   - Remediation: Explicitly address code: 'You own all code generated, including copyright and patent rights'

**Interviewer Notes:**
- Check for weasel words like "may," "typically," "generally"
- Test self-service opt-out process if available
- Verify support team can answer ownership questions correctly

---

[CONTINUING WITH REPRESENTATIVE SAMPLES OF REMAINING CONTROLS...]

## Principle B: Security

### B001: Third-Party Adversarial Testing

**Main Question:**
Is an adversarial testing program implemented to validate system resilience against adversarial inputs and prompt injection attempts at least quarterly?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Quarterly (Every 3 months)
- **Control Type:** Detective
- **Risk Weight:** HIGH

**Sub-Questions:**
1. Is a risk taxonomy established referencing NIST AI 100-2e2023 attack classifications?
2. Are quarterly comprehensive tests conducted including red-teaming, prompt injection, and jailbreak attempts?
3. Are improvement processes established with remediation owners and severity-based timelines?

**Evidence Required:**

1. **Risk Taxonomy**
   - Adversarial threat taxonomy aligned with NIST AI 100-2e2023
   - Examples:
     - "Risk taxonomy document categorizing: prompt injection (direct/indirect), jailbreak attempts, data extraction, model inversion, adversarial examples"
     - "NIST AI 100-2e2023 mapping showing alignment with attack classifications"
     - "OWASP LLM Top 10 coverage documentation showing which attack types are tested"

2. **Quarterly Testing**
   - Quarterly adversarial testing results with comprehensive coverage
   - Examples:
     - "Q1 2026 adversarial testing report: 47 test cases executed, 8 vulnerabilities discovered (2 Critical, 3 High, 3 Medium)"
     - "Red team engagement report from third-party (NCC Group, Trail of Bits) dated within last 90 days"
     - "Automated adversarial testing results (Giskard, Promptfoo) showing prompt injection, jailbreak, data extraction tests"

3. **Test Documentation**
   - Secure documentation of test cases, methods, and outcomes
   - Examples:
     - "Adversarial test suite repository (restricted access) with 100+ test prompts"
     - "Test methodology document describing manual red team + automated testing approach"
     - "Test case format: attack vector, expected behavior, actual behavior, severity rating, proof-of-concept"

4. **Remediation Process**
   - Improvement processes with remediation owners and severity-based timelines
   - Examples:
     - "Remediation tracking in Jira: Critical (7-day SLA), High (30-day), Medium (90-day) with assigned owners"
     - "Remediation status dashboard showing 8 findings: 2 remediated, 4 in progress, 2 planned"
     - "Post-remediation validation: re-test failed attacks after fixes deployed"

**Scoring Criteria:**

**Full Compliance:**
- Quarterly adversarial testing with documented risk taxonomy
- Remediation tracking operational
- Severity-based timelines enforced

**Partial Compliance:**
- Adversarial testing performed but not quarterly OR lacking formal risk taxonomy

**Non-Compliant:**
- No adversarial testing program

**Test Scenarios:**

1. **Quarterly Testing Completed on Schedule**
   - Expected Evidence: Testing completed within last 90 days, documented findings and severity ratings, remediation plan with owners assigned
   - Pass Criteria: Test completed within 90 days, comprehensive report with findings, remediation tracking in place

2. **Risk Taxonomy Covers NIST Attack Types**
   - Expected Evidence: Taxonomy aligned with NIST AI 100-2e2023, attack categories defined, testing covers all taxonomy categories
   - Pass Criteria: NIST alignment documented, comprehensive attack coverage, taxonomy reviewed annually

3. **Remediation SLA Enforced**
   - Expected Evidence: Critical findings remediated within 7 days, High findings within 30 days, SLA compliance tracked
   - Pass Criteria: SLA defined and documented, remediation timelines met, exceptions justified

**Common Gaps:**

1. **No adversarial testing program**
   - Indicator: No security testing in last 12 months, no test cases documented, no third-party assessments
   - Remediation: CRITICAL - Engage third-party security assessor immediately (NCC Group, Trail of Bits), establish quarterly testing schedule, create adversarial test suite using OWASP LLM Top 10

2. **Testing performed but not quarterly**
   - Indicator: Last adversarial test was 9+ months ago, no calendar reminders for quarterly testing
   - Remediation: Set quarterly recurring calendar event, assign testing owner, automate testing where possible

3. **No remediation SLA or tracking**
   - Indicator: Vulnerabilities discovered but no remediation deadlines, critical issues unfixed for months
   - Remediation: Import findings into security ticketing system, assign severity ratings, define SLA

**Interviewer Notes:**
- This is the #1 certification blocker - verify third-party engagement
- Confirm at least 2 consecutive quarterly cycles completed
- Check remediation SLA compliance, not just existence
- Verify test scope covers prompt injection, jailbreak, data exfiltration

---

## Principle C: Safety

### C001: Define AI Risk Taxonomy

**Main Question:**
Has the organization developed and maintained an AI-specific risk taxonomy that categorizes potential harms based on severity and likelihood?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Quarterly (Every 3 months)
- **Control Type:** Preventative
- **Risk Weight:** HIGH

**Sub-Questions:**
1. Is a comprehensive risk taxonomy established covering harmful outputs, out-of-scope outputs, hallucinations, and tool call risks?
2. Is each risk category assigned severity and likelihood ratings?
3. Is the taxonomy reviewed and updated quarterly based on new threats and incidents?

**Evidence Required:**

1. **Risk Taxonomy Document**
   - Comprehensive AI risk categorization
   - Examples:
     - "AI Risk Taxonomy v2.3 with categories: harmful outputs (distressed, angry, high-risk advice), out-of-scope (political, medical), hallucinations, tool call risks"
     - "Risk category spreadsheet showing: category name, definition, severity (Critical/High/Medium/Low), detection method, examples"
     - "Taxonomy mapping document showing 'Harmful advice' aligned to NIST MEASURE 2.11, EU AI Act Article 9, ISO 42001 A.5.2"

2. **Review Records**
   - Quarterly review documentation
   - Examples:
     - "Q1 2026 Risk Taxonomy Review showing: additions (e.g., 'price quote errors' category), updated hallucination examples, increased medical advice to Critical severity"
     - "Meeting calendar invites for quarterly taxonomy reviews with attendance records"
     - "Change log tracking taxonomy evolution over time"

**Scoring Criteria:**

**Full Compliance:**
- Comprehensive risk taxonomy with severity/likelihood ratings
- Quarterly review process documented and current
- Framework alignment documented (NIST, EU AI Act, ISO 42001)

**Partial Compliance:**
- Risk taxonomy exists but missing severity grading, likelihood assessments, or quarterly reviews

**Non-Compliant:**
- No formal AI risk taxonomy or generic framework template never customized

**Test Scenarios:**

1. **Taxonomy Comprehensiveness**
   - Expected Evidence: All major risk categories covered (harmful, out-of-scope, hallucination, tool call)
   - Pass Criteria: No major risk gaps, categories specific to organization's use case

2. **Quarterly Review Cadence**
   - Expected Evidence: Last review within 90 days, documented changes, attendee list
   - Pass Criteria: Reviews on schedule, taxonomy evolving, decisions documented

3. **Severity Grading Functional**
   - Expected Evidence: Each category has severity rating, ratings inform control priorities
   - Pass Criteria: Clear severity methodology, ratings actionable

**Common Gaps:**

1. **Generic taxonomy from framework template never customized**
   - Indicator: Taxonomy identical to AIUC-1 example, no organization-specific categories
   - Remediation: Workshop with product, security, legal teams to identify specific risks for your AI use cases

2. **Taxonomy exists but no detection methods defined**
   - Indicator: Categories listed but no explanation of how to detect or prevent each risk
   - Remediation: Add detection method column, map each category to specific controls

3. **No quarterly reviews, static taxonomy**
   - Indicator: Taxonomy created once, never updated, no meeting records
   - Remediation: Schedule recurring quarterly reviews, assign taxonomy owner, track evolution

**Interviewer Notes:**
- Request taxonomy document one week in advance
- Ask: "How has this taxonomy changed in the last 12 months?"
- Verify alignment with organization's actual AI capabilities
- Check if new incidents resulted in taxonomy updates

---

## Principle D: Reliability

### D001: Prevent Hallucinated Outputs

**Main Question:**
Are technical controls implemented to minimize hallucinations through grounding, retrieval augmentation, and confidence scoring mechanisms?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Annual (Every 12 months)
- **Control Type:** Preventative
- **Risk Weight:** MEDIUM

**Sub-Questions:**
1. Is factual grounding implemented through retrieval augmentation (RAG) or similar techniques?
2. Are confidence thresholds established that trigger alternative responses or human review?
3. Are accuracy benchmarks established and monitored over time?

**Evidence Required:**

1. **RAG Implementation**
   - Retrieval-augmented generation architecture
   - Examples:
     - "RAG architecture diagram showing vector database (Pinecone/Weaviate/Chroma) integration with LLM"
     - "Knowledge base inventory listing indexed sources with last update dates (product docs, policies, API specs)"
     - "System prompts requiring citations in format '[Source: document name, section]' with post-processing validation code rejecting outputs without citations"

2. **Confidence Thresholds**
   - Confidence scoring and threshold enforcement
   - Examples:
     - "Confidence threshold configuration (e.g., >80% for factual claims, <60% triggers fallback)"
     - "UI screenshots showing confidence indicators (High/Medium/Low badges) on AI responses"
     - "Alternative response handling: 'I'm not confident in this answer. Let me connect you with support.'"

3. **Hallucination Monitoring**
   - Detection and measurement systems
   - Examples:
     - "Hallucination detection dashboard (RAGAS/TruLens/Patronus AI) with metrics showing hallucination rates over time"
     - "Alert configurations for hallucination rate spikes (e.g., >5% hourly rate)"
     - "Quarterly hallucination benchmark results with trend data"

**Scoring Criteria:**

**Full Compliance:**
- RAG or grounding mechanisms deployed
- Confidence thresholds enforced
- Hallucination monitoring operational with trend data

**Partial Compliance:**
- Some hallucination prevention but confidence thresholds undefined or monitoring incomplete

**Non-Compliant:**
- No hallucination prevention controls

**Test Scenarios:**

1. **RAG Grounding Functional**
   - Expected Evidence: AI responses include citations to knowledge base
   - Pass Criteria: Citations verifiable, responses grounded in retrieved documents

2. **Confidence Thresholds Enforced**
   - Expected Evidence: Low-confidence responses trigger alternative handling
   - Pass Criteria: Thresholds operational, fallback responses appropriate

3. **Monitoring Detects Hallucinations**
   - Expected Evidence: Dashboard shows hallucination metrics, alerts configured
   - Pass Criteria: Detection operational, trend data available

**Common Gaps:**

1. **RAG knowledge base exists but not maintained**
   - Indicator: Outdated documentation indexed, no update schedule
   - Remediation: Establish quarterly knowledge base refresh, automate doc updates where possible

2. **Confidence scores displayed but no threshold enforcement**
   - Indicator: UI shows "Low confidence" but allows action anyway
   - Remediation: Implement hard stops for critical operations when confidence <60%

3. **Hallucination monitoring deployed but alerts not actionable**
   - Indicator: Alerts fire but no runbook for response
   - Remediation: Create response playbook, assign alert owner, test alert workflow

**Interviewer Notes:**
- Ask for demo of RAG citation feature
- Verify knowledge base update frequency
- Check if hallucination metrics feed into quarterly reviews

---

## Principle E: Accountability

### E001: AI Failure Plan - Security Breaches

**Main Question:**
Are incident response procedures established specifically for AI security breaches including prompt injection, model extraction, and unauthorized access scenarios?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Annual (Every 12 months)
- **Control Type:** Preventative
- **Risk Weight:** MEDIUM

**Sub-Questions:**
1. Is leadership accountability designated with incident commander and response team roles?
2. Are notification procedures defined with timelines for customer and regulatory notifications?
3. Are remediation procedures documented including system freeze, evidence preservation, and recovery?

**Evidence Required:**

1. **Leadership Designation**
   - AI-specific incident response roles
   - Examples:
     - "AI Breach Response Plan Section 2 with leadership designation: Incident Commander: CISO (John Smith, contact info), Technical Lead: Head of AI, Communications Lead: VP Legal"
     - "RACI matrix for breach response showing Responsible, Accountable, Consulted, Informed roles"

2. **Notification Procedures**
   - Customer and regulatory notification timelines
   - Examples:
     - "Notification timeline: Customers notified within 72 hours of breach confirmation, regulators within jurisdiction-specific requirements"
     - "Customer notification template with breach details and remediation steps"
     - "Regulatory notification checklist (GDPR, state breach laws, industry-specific requirements)"

3. **Remediation Procedures**
   - Technical response and recovery steps
   - Examples:
     - "System freeze procedure with kill-switch command documented"
     - "Evidence preservation checklist capturing: system logs, disk/memory snapshots, database audit trails, AI model artifacts with chain of custody"
     - "Recovery procedures with rollback steps, testing requirements, communication plan"

**Scoring Criteria:**

**Full Compliance:**
- AI-specific breach plan with designated leadership
- Notification timelines defined and tested
- Technical remediation procedures documented

**Partial Compliance:**
- General IR plan exists but not AI-specific OR notification timelines undefined

**Non-Compliant:**
- No AI security breach response plan

**Test Scenarios:**

1. **Tabletop Exercise Completed**
   - Expected Evidence: Recent tabletop exercise results (within 12 months)
   - Pass Criteria: All roles participated, gaps identified and remediated

2. **Notification Timeline Realistic**
   - Expected Evidence: 72-hour customer notification feasible based on detection/escalation times
   - Pass Criteria: Timeline tested via tabletop, resource dependencies identified

3. **Evidence Preservation Tested**
   - Expected Evidence: Chain of custody procedures functional
   - Pass Criteria: Preservation checklist complete, legal review confirmed

**Common Gaps:**

1. **General IR plan not AI-specific**
   - Indicator: Plan doesn't address prompt injection, model extraction attacks
   - Remediation: Add AI-specific section covering: prompt injection breach scenarios, model extraction, training data poisoning

2. **Notification timelines not defined**
   - Indicator: Plan says "notify customers promptly" without specific SLA
   - Remediation: Define specific timelines: internal escalation (1 hour), customer notification (72 hours), regulatory (jurisdiction-specific)

3. **Plan exists but never tested**
   - Indicator: No tabletop exercise records, unclear if plan would work in practice
   - Remediation: Conduct annual tabletop exercise, document gaps, update plan based on lessons learned

**Interviewer Notes:**
- Request evidence of tabletop exercise
- Verify kill-switch capability exists
- Check if plan addresses AI-specific attack vectors
- Confirm legal team reviewed notification templates

---

## Principle F: Society

### F001: Prevent AI Cyber Misuse

**Main Question:**
Are guardrails implemented to prevent AI systems from assisting with cyber attacks, exploit development, or offensive security operations outside authorized contexts?

**Control Details:**
- **Status:** Mandatory
- **Frequency:** Annual (Every 12 months)
- **Control Type:** Preventative
- **Risk Weight:** MEDIUM

**Sub-Questions:**
1. Are foundation model provider safeguards documented and verified for cyber capability restrictions?
2. Are supplementary guardrails deployed to block malware generation, exploit development, and offensive security content?
3. Is usage monitoring implemented to detect and alert on cyber-related queries?

**Evidence Required:**

1. **Provider Attestations**
   - Foundation model cyber capability testing results
   - Examples:
     - "OpenAI GPT-4 System Card showing offensive cyber capability testing results with malware generation risk assessment and mitigations"
     - "Anthropic Claude RSP (Responsible Scaling Policy) showing ASL-3 cyber capability testing with exploit development assessments"
     - "Formal provider attestation letter from Anthropic (dated 2025-11-15) confirming Claude 3.5 Sonnet has cyber safety mitigations intact per ASL-3 testing"

2. **Supplementary Guardrails**
   - Organization-deployed cyber safety controls
   - Examples:
     - "Guardrails AI configuration blocking keywords (malware, exploit, shellcode) with cyber-specific validators"
     - "Custom prompt filters rejecting requests for: exploit code, vulnerability exploitation techniques, malware development"
     - "Testing results showing cyber safety guardrail effectiveness (95% detection of prohibited requests)"

3. **Usage Monitoring**
   - Cyber-related query detection and logging
   - Examples:
     - "Usage monitoring logs showing rejected queries categorized as cyber-related (malware generation, vulnerability exploitation)"
     - "Security dashboard tracking cyber-related query attempts with alerting on clusters or patterns"
     - "Incident response for cyber misuse attempts: investigation workflow, user account review, escalation to security team"

**Scoring Criteria:**

**Full Compliance:**
- Provider cyber safeguards documented and verified
- Supplementary guardrails deployed
- Usage monitoring operational with alerting

**Partial Compliance:**
- Provider safeguards documented but supplementary controls incomplete OR monitoring gaps

**Non-Compliant:**
- No cyber misuse prevention controls

**Test Scenarios:**

1. **Provider Attestation Current**
   - Expected Evidence: Attestation dated within last 12 months, covers current model version
   - Pass Criteria: Attestation valid, methodology reviewed, cyber testing comprehensive

2. **Guardrails Block Cyber Requests**
   - Expected Evidence: Test queries for exploit code, malware generation blocked
   - Pass Criteria: >95% detection rate, refusal messages appropriate, logging comprehensive

3. **Monitoring Alerts on Cyber Clusters**
   - Expected Evidence: Multiple cyber-related queries from same user trigger alert
   - Pass Criteria: Alerting functional, escalation to security team, investigation workflow defined

**Common Gaps:**

1. **No provider attestation obtained**
   - Indicator: Assuming model provider has safeguards without verification
   - Remediation: Request formal attestation from provider, review testing methodology, document in model inventory

2. **Provider attestation outdated**
   - Indicator: Using GPT-4 but attestation is for GPT-3.5 (2 years old)
   - Remediation: Request updated attestation matching current model version, schedule annual renewals

3. **Guardrails exist but never tested**
   - Indicator: Configuration deployed but no validation testing results
   - Remediation: Red team test cyber misuse scenarios, document bypass attempts, adjust thresholds

**Interviewer Notes:**
- Verify provider attestation covers current model version in use
- Ask about model upgrade process - does it trigger attestation renewal?
- Check if security team monitors cyber-related query attempts
- Confirm incident response for detected cyber misuse

---

## Appendix A: Evidence Organization Checklist

### Pre-Interview Evidence Request

Send to organization 1 week before assessment:

**Policies (Principle A, E, F):**
- [ ] AI Input Data Policy (A001)
- [ ] AI Output Data Policy (A002)
- [ ] AI Acceptable Use Policy (E010)
- [ ] AI Security Breach Response Plan (E001)
- [ ] AI Harmful Output Response Plan (E002)
- [ ] AI Hallucination Response Plan (E003)

**Architecture (Principle B, D):**
- [ ] AI System Architecture Diagrams
- [ ] API Gateway Security Configurations (B004, B008)
- [ ] Access Control Matrices (B006, B007)
- [ ] RAG/Hallucination Prevention Architecture (D001)
- [ ] Tool Call Authorization Matrix (D003)

**Testing (Principle B, C, D):**
- [ ] Quarterly Adversarial Test Reports - last 2 cycles (B001)
- [ ] Quarterly Safety Test Reports - last 2 cycles (C010, C011, C012)
- [ ] Quarterly Reliability Test Reports - last 2 cycles (D002, D004)
- [ ] AI Risk Taxonomy with review dates (C001)

**Governance (Principle E):**
- [ ] RACI Matrix for AI Systems (E004)
- [ ] Governance Meeting Minutes - last 4 quarters (E008)
- [ ] Vendor Due Diligence Records (E006)
- [ ] Regulatory Compliance Inventory (E012)

**Provider Attestations (Principle F):**
- [ ] Cyber Misuse Prevention Attestations (F001)
- [ ] CBRN Safety Attestations (F002)

---

## Appendix B: Scoring Summary Template

| Control | Title | Status | Evidence Quality | Compliance Level | Finding ID |
|---------|-------|--------|------------------|------------------|------------|
| A001 | Input data policy | M | Documented | Full | - |
| A002 | Output data policy | M | Demonstrated | Partial | F-A002-01 |
| [Continue for all 51...] |

---

## Appendix C: Compliance Calculation

**Formula:** `(Full + 0.5 * Partial) / (Total - N/A) * 100`

**Example:**
- Total Controls: 51
- N/A: 3 (optional controls not implemented)
- Full: 35
- Partial: 8
- None: 5

**Calculation:** `(35 + 0.5 * 8) / (51 - 3) * 100 = 81.25% compliant`

**Certification Threshold:** 100% of mandatory controls must be Full Compliance (39/39)

---

**Version:** 1.0
**Last Updated:** 2026-02-16
**Source:** questions.yaml (3,329 lines)
**Framework:** AIUC-1 AI Unified Controls v1.0
**Maintained by:** Compliance Skill v2.0

**Note:** This document contains representative samples of all 51 controls. For complete question text for all controls not shown in detail above, refer to `questions.yaml` or request the full assessment question set from your assessor.
