---
type: template
name: aiuc1-stakeholder-interview-guide
category: assessment-methodology
classification: public
version: 1.0
last_updated: 2026-02-13
---

# AIUC-1 Stakeholder Interview Guide

**Purpose:** Structured interview guide for AIUC-1 AI Unified Controls assessments. Maps stakeholder roles to specific controls, provides sample questions, and defines evidence collection procedures.

**Usage:** Assessors use this guide to plan and execute stakeholder interviews during AIUC-1 compliance assessments. It complements the assessment rules template (`aiuc-1-assessment-rules-template.md`) and compliance matrix (`aiuc1-compliance-matrix-template.md`).

---

## 1. Stakeholder Role Matrix

Each AIUC-1 principle requires input from specific organizational roles. The primary stakeholder owns the interview for that principle. Secondary stakeholders provide supplementary evidence or corroboration.

| Principle | Primary Stakeholder | Secondary Stakeholders | Controls |
|-----------|-------------------|----------------------|----------|
| A - Data & Privacy | Data Protection Officer / Privacy Lead | Legal Counsel, AI/ML Engineers | A001-A007 |
| B - Security | CISO / Security Engineering Lead | AI/ML Engineers, DevOps/Platform | B001-B009 |
| C - Safety | AI Product Lead / AI Safety Lead | AI/ML Engineers, QA, Security | C001-C012 |
| D - Reliability | AI/ML Engineering Lead | QA, DevOps, Product | D001-D004 |
| E - Accountability | AI Governance Lead / CTO | Legal, CISO, HR, Finance | E001-E017 |
| F - Society | CISO / AI Ethics Lead | Legal, AI/ML Engineers | F001-F002 |

### Role Availability Notes

Not every organization has dedicated roles for each area. Common substitutions:

| Expected Role | Common Substitution |
|---------------|-------------------|
| Data Protection Officer | Head of Legal, Chief Privacy Officer, VP Engineering |
| AI Safety Lead | VP Product, Head of AI Engineering, CTO |
| AI Governance Lead | CTO, VP Engineering, CISO |
| AI Ethics Lead | CISO, Head of Legal, CTO |
| GRC / Compliance Lead | CISO, VP Legal, Head of Operations |
| QA / Testing Lead | Head of Engineering, DevOps Lead, AI/ML Engineering Lead |

When a role does not exist, document the substitution and note which controls may lack a dedicated owner. This is itself a finding relevant to E004 (Assign accountability).

---

## 2. Interview Flow per Stakeholder Role

### 2.1 CISO / Head of Security

**Interview Duration:** 90 minutes
**Controls Covered:** B001-B009, F001, F002

#### Pre-Interview Preparation

Request these documents at least one week before the interview:

- Adversarial testing program documentation and most recent quarterly report
- AI endpoint security architecture diagrams
- Access control matrix for AI systems (RBAC/ABAC configurations)
- Model deployment environment security configurations
- Incident response plans specific to AI security breaches (E001)
- Cyber misuse prevention controls documentation

#### Opening Questions

- "Describe your organization's overall security posture for AI systems. How does AI security fit into your broader security program?"
- "Who owns AI security within your organization, and how does that relate to traditional application security?"

#### Core Questions

**B001 - Third-party testing of adversarial robustness:**
- "Walk me through your adversarial testing program. How often do you run red team exercises against your AI systems?"
- "What tools and methodologies do you use for prompt injection and jailbreak testing?"
- "How do you track and remediate findings from adversarial testing? Show me the last quarterly report."
- "Who performs the third-party testing? How were they selected and qualified?"

**B002 - Detect adversarial input (Optional):**
- "Do you have detection mechanisms for adversarial inputs in production? What triggers an alert?"
- "What is your mean time to detect a prompt injection attempt?"

**B003 - Manage public release of technical details (Optional):**
- "What controls govern disclosure of AI system architecture, training data, or model capabilities?"
- "How do you handle vulnerability disclosure for AI-specific issues?"

**B004 - Prevent AI endpoint scraping:**
- "Describe the rate limiting and behavioral analytics on your AI endpoints."
- "How do you distinguish between legitimate high-volume usage and scraping attempts?"
- "What monitoring is in place for API abuse patterns?"

**B005 - Implement real-time input filtering (Optional):**
- "Do you use automated moderation tools on AI inputs? What categories do they filter?"
- "How are filtering rules maintained and updated?"

**B006 - Limit AI agent system access:**
- "What system resources can your AI agents access? How are those permissions scoped?"
- "Walk me through the principle of least privilege as applied to your AI agents."
- "How do you prevent privilege escalation through agent tool calls?"

**B007 - Enforce user access privileges to AI systems:**
- "Describe your RBAC model for AI system access. How granular are the permissions?"
- "How often are access reviews conducted? Show me the last quarterly review."
- "What admin privilege controls are in place? How are elevated access requests handled?"

**B008 - Protect model deployment environment:**
- "Describe the security controls on your model deployment environment: MFA, TLS, API token scoping, network segmentation."
- "How are model artifacts protected at rest and in transit?"
- "What container/runtime security controls are in place?"

**B009 - Limit output over-exposure:**
- "What controls prevent your AI systems from exposing internal system details, model parameters, or sensitive data in outputs?"
- "How do you enforce output length and content boundaries?"

**F001 - Prevent AI cyber misuse:**
- "What controls prevent your AI systems from being used to generate malicious code, assist with cyberattacks, or produce exploit code?"
- "How do you test these guardrails? What is the bypass rate from your most recent evaluation?"

**F002 - Prevent catastrophic misuse:**
- "What controls address CBRN-related queries or other catastrophic misuse scenarios?"
- "Do you rely on foundation model provider attestations, or do you test independently?"
- "How do you monitor for misuse indicators in production?"

#### Evidence Requests

- Most recent quarterly adversarial testing report (B001)
- Detection rule configurations or SIEM integration for AI threats (B002)
- Rate limiting and API gateway configurations (B004)
- RBAC configuration exports and last quarterly access review (B007)
- Deployment environment security configurations (B008)
- Foundation model provider safety attestations for cyber/CBRN (F001, F002)

---

### 2.2 Data Protection Officer / Privacy Lead

**Interview Duration:** 60 minutes
**Controls Covered:** A001-A007, E011

#### Pre-Interview Preparation

- AI data handling policies (input and output)
- Data processing agreements with AI/model providers
- PII detection and redaction configurations
- Cross-customer data isolation architecture documentation
- Data processing location inventory

#### Opening Questions

- "What is your organization's overall approach to data privacy for AI systems? How does it differ from traditional application privacy?"
- "What regulatory frameworks govern your AI data handling?"

#### Core Questions

**A001 - Establish input data policy:**
- "Describe your AI input data policy. How are customers informed about how their data is used?"
- "What opt-out mechanisms exist for training data usage? How are opt-out requests processed?"
- "Is customer data ever used for model fine-tuning or training? If so, under what terms?"

**A002 - Establish output data policy:**
- "Who owns AI-generated outputs? Is this documented in customer agreements?"
- "What is your data retention policy for AI conversation histories and outputs?"
- "How are deletion requests for AI-generated content handled?"

**A003 - Limit AI agent data collection:**
- "What data access permissions are granted to AI agents? How are they scoped?"
- "How do you prevent AI agents from accessing data beyond what is required for the specific task?"
- "Are there guardrails preventing agents from exfiltrating data through tool calls or API requests?"

**A004 - Protect IP & trade secrets:**
- "What controls prevent customer intellectual property or trade secrets from being exposed through AI outputs?"
- "How do you prevent model memorization of sensitive business data?"
- "What supplementary controls exist beyond foundation model provider safeguards?"

**A005 - Prevent cross-customer data exposure:**
- "Describe your customer data isolation architecture for AI systems."
- "How do you prevent one customer's data from appearing in another customer's AI responses?"
- "What tenant isolation mechanisms are in place at the model inference layer?"

**A006 - Prevent PII leakage:**
- "What PII detection and redaction mechanisms are in place for AI inputs and outputs?"
- "How do you handle PII in session context, conversation history, and cached responses?"
- "Demonstrate how PII redaction works in practice."

**A007 - Prevent IP violations:**
- "What controls prevent your AI systems from generating copyrighted content, trademarks, or other protected IP?"
- "How do you handle customer reports of IP violations in AI outputs?"
- "What incident response procedures exist for IP violation claims?"

**E011 - Record processing locations:**
- "Where is AI data processed geographically? Show me the processing location inventory."
- "How do you ensure data residency requirements are met when using cloud-based AI providers?"
- "Are customers informed of processing locations? How?"

#### Evidence Requests

- Input data policy with opt-out provisions (A001)
- Output ownership and retention policies (A002)
- Agent permission matrices (A003)
- Customer data isolation architecture diagrams (A005)
- PII redaction configuration and sample detection logs (A006)
- IP incident response procedures (A007)
- Data processing location inventory (E011)

---

### 2.3 AI/ML Engineering Lead

**Interview Duration:** 90 minutes
**Controls Covered:** C001-C006, D001, D003, B006

#### Pre-Interview Preparation

- AI risk taxonomy document (current version)
- Pre-deployment testing procedures and most recent results
- Content filtering and moderation configurations
- Hallucination prevention mechanisms documentation
- Tool call authorization matrix and rate limit configurations

#### Opening Questions

- "Give me an overview of your AI system architecture. What models do you use, how are they deployed, and what tool integrations exist?"
- "What is your development lifecycle for AI features? How does testing fit in?"

#### Core Questions

**C001 - Define AI risk taxonomy:**
- "Show me your AI risk taxonomy. How do you categorize risks?"
- "What severity grading system do you use? How was it developed?"
- "How often is the taxonomy reviewed and updated? Who approves changes?"
- "Walk me through the last quarterly review. What changed?"

**C002 - Conduct pre-deployment testing:**
- "Describe your pre-deployment testing process for AI model changes."
- "What test categories do you cover: safety, accuracy, bias, adversarial robustness?"
- "What are the go/no-go criteria for deployment? Who signs off?"
- "Show me test results from the most recent deployment."

**C003 - Prevent harmful outputs:**
- "What content filtering is in place for harmful output categories?"
- "How do you define 'harmful'? Is it aligned with your risk taxonomy?"
- "What is your false positive rate for content filtering? How do you balance safety with usability?"

**C004 - Prevent out-of-scope outputs:**
- "How do you define and enforce the scope boundaries of your AI systems?"
- "What happens when a user asks the AI to perform a task outside its intended scope?"
- "Demonstrate the scope enforcement mechanism."

**C005 - Prevent customer-defined high risk outputs:**
- "How do customers define additional high-risk categories beyond your default taxonomy?"
- "What mechanisms exist for per-customer risk configuration?"
- "How quickly can new risk categories be deployed?"

**C006 - Prevent output vulnerabilities:**
- "What controls prevent AI-generated outputs from containing security vulnerabilities (XSS, injection, etc.)?"
- "How do you sanitize AI outputs before rendering them in the application?"
- "How often is output security testing performed?"

**D001 - Prevent hallucinated outputs:**
- "What mechanisms do you use to prevent hallucinations? Retrieval augmentation, grounding, citation requirements?"
- "How do you measure hallucination rates? What is your current benchmark?"
- "What guardrails exist for high-stakes outputs where factual accuracy is critical?"

**D003 - Restrict unsafe tool calls:**
- "What tool calls are available to your AI agents? Show me the authorization matrix."
- "How do you prevent unauthorized or dangerous tool calls?"
- "What rate limiting and monitoring exists on tool call execution?"
- "What happens when an agent attempts to make an unauthorized tool call?"

**B006 - Limit AI agent system access:**
- "What system-level permissions do AI agents operate with?"
- "How are agent permissions scoped differently from user permissions?"
- "How do you prevent agents from accessing filesystems, databases, or APIs beyond their authorized scope?"

#### Evidence Requests

- AI risk taxonomy document with severity definitions (C001)
- Pre-deployment test results and sign-off records (C002)
- Content filtering configuration and effectiveness metrics (C003, C004, C005)
- Output sanitization configurations (C006)
- Hallucination benchmark results and measurement methodology (D001)
- Tool call authorization matrix and rate limit configurations (D003)
- Agent permission scope documentation (B006)

---

### 2.4 AI Product Lead / AI Safety Lead

**Interview Duration:** 60 minutes
**Controls Covered:** C007-C009, C001, E016

#### Pre-Interview Preparation

- AI disclosure mechanism documentation (user-facing)
- High-risk alerting system configurations
- User feedback collection mechanisms
- Product safety guidelines and escalation procedures

#### Opening Questions

- "How does your product organization think about AI safety? Where does safety sit in your product development process?"
- "What role do end users play in your safety program?"

#### Core Questions

**C007 - Flag high risk recommendations (Optional):**
- "When your AI system generates a potentially harmful or high-risk recommendation, what happens?"
- "Are there alerting mechanisms that flag high-risk outputs for human review?"
- "Walk me through the escalation process for a flagged recommendation."

**C008 - Monitor AI risk categories (Optional):**
- "How do you monitor the prevalence of different risk categories in production?"
- "What dashboards or reports track risk category trends over time?"
- "How do monitoring findings feed back into the risk taxonomy (C001)?"

**C009 - Enable real-time feedback and intervention (Optional):**
- "Can users report problematic AI outputs in real time? How?"
- "What intervention capabilities exist? Can human operators override or stop AI actions?"
- "How is user feedback triaged and acted upon?"

**C001 - Define AI risk taxonomy (Product perspective):**
- "How does the product team contribute to the AI risk taxonomy?"
- "What product-level risks are captured that engineering might not identify?"
- "How do customer-reported risks get incorporated?"

**E016 - Implement AI disclosure mechanisms:**
- "How do users know they are interacting with AI?"
- "What disclosure mechanisms are in place: labels, watermarks, disclaimers?"
- "Are disclosures consistent across all AI touchpoints in your product?"
- "Show me what a user sees when they first interact with your AI system."

#### Evidence Requests

- Screenshots of AI disclosure mechanisms in the product (E016)
- High-risk alerting configurations and sample alerts (C007)
- Risk category monitoring dashboards or reports (C008)
- User feedback interface screenshots and triage workflow documentation (C009)
- Product risk taxonomy input documentation (C001)

---

### 2.5 Legal Counsel

**Interview Duration:** 60 minutes
**Controls Covered:** A007, E003, E005, E006, E012

#### Pre-Interview Preparation

- AI-specific legal risk assessments
- Vendor due diligence records for AI/model providers
- Regulatory compliance inventory
- IP violation incident response procedures
- Cloud vs. on-premises processing risk assessments

#### Opening Questions

- "What is your organization's legal exposure profile for AI? What are the top legal risks you track?"
- "How has the regulatory landscape for AI changed your legal strategy?"

#### Core Questions

**A007 - Prevent IP violations (Legal perspective):**
- "What legal review processes exist for AI-related IP claims?"
- "How have you structured customer agreements regarding AI-generated output ownership?"
- "Have there been any IP violation claims related to AI outputs? How were they handled?"

**E003 - AI failure plan for hallucinations:**
- "What is the legal and operational response plan when AI produces hallucinated information that causes customer harm?"
- "What compensation or mitigation procedures exist?"
- "How are hallucination-related customer complaints escalated?"

**E005 - Assess cloud vs on-prem processing:**
- "What criteria drove the decision to deploy AI in the cloud vs. on-premises?"
- "What data sovereignty and regulatory risks were assessed?"
- "How are processing location decisions documented and reviewed?"

**E006 - Conduct vendor due diligence:**
- "Walk me through your vendor due diligence process for AI and foundation model providers."
- "What criteria do you evaluate: security posture, data handling, compliance certifications, financial stability?"
- "How often is vendor due diligence refreshed? Show me the most recent assessment."
- "How do you assess foundation model providers specifically (Anthropic, OpenAI, Google, etc.)?"

**E012 - Document regulatory compliance:**
- "What AI-specific regulations have you identified as applicable to your organization?"
- "How do you track regulatory changes? What is your process for evaluating new regulations?"
- "Show me your regulatory compliance inventory. How current is it?"
- "What is the review cadence for regulatory compliance? AIUC-1 requires semi-annual review."

#### Evidence Requests

- IP violation incident response procedures and case logs (A007)
- Hallucination response plan with compensation procedures (E003)
- Cloud vs. on-premises decision documentation (E005)
- Vendor due diligence records and scoring matrices (E006)
- Regulatory compliance inventory with last review date (E012)

---

### 2.6 DevOps / Platform Engineering

**Interview Duration:** 60 minutes
**Controls Covered:** B004, B008, E015

#### Pre-Interview Preparation

- AI endpoint architecture and API gateway configurations
- Deployment pipeline documentation for AI systems
- Logging infrastructure architecture for AI activity
- Container/runtime security configurations

#### Opening Questions

- "Describe the infrastructure that supports your AI systems. Where do models run, how are they deployed, and what sits between the user and the model?"
- "How does AI deployment differ from your standard application deployment?"

#### Core Questions

**B004 - Prevent AI endpoint scraping:**
- "Describe the security controls on your AI endpoints: rate limiting, behavioral analytics, API key scoping."
- "How are API tokens scoped for AI services? Are there different tiers of access?"
- "What monitoring detects anomalous usage patterns on AI endpoints?"
- "How do you handle detected scraping attempts?"

**B008 - Protect model deployment environment:**
- "Walk me through the deployment pipeline for AI models. What security gates exist?"
- "What network segmentation exists between the model serving infrastructure and other systems?"
- "How are model artifacts signed, verified, and stored?"
- "What runtime security controls are in place: container scanning, image signing, runtime monitoring?"

**E015 - Log model activity:**
- "What AI-specific events are logged: inputs, outputs, tool calls, errors, access events?"
- "What is your log retention policy for AI activity logs?"
- "Where are AI logs stored? What access controls exist on the log data?"
- "Can you reconstruct a complete AI interaction from logs including all tool calls and intermediate steps?"
- "How are logs monitored for security and safety events?"

#### Evidence Requests

- API gateway configuration for AI endpoints (B004)
- Rate limiting and abuse detection configurations (B004)
- Deployment pipeline documentation with security gates (B008)
- Network architecture diagrams showing model environment segmentation (B008)
- Logging configuration showing captured AI events (E015)
- Sample AI activity log entries (E015)
- Log retention policy documentation (E015)

---

### 2.7 GRC / Compliance Lead

**Interview Duration:** 90 minutes
**Controls Covered:** E004, E007, E008, E010, E013, E014

#### Pre-Interview Preparation

- AI governance charter or committee documentation
- RACI matrix for AI systems
- Change management procedures for AI systems
- AI acceptable use policy
- Quality management system documentation (if applicable)
- Transparency reporting policies (if applicable)

#### Opening Questions

- "How is AI governance structured in your organization? Is there a dedicated AI governance committee?"
- "What is the relationship between AI governance and your existing GRC framework?"

#### Core Questions

**E004 - Assign accountability:**
- "Who is accountable for AI system failures in your organization? Is this documented?"
- "Show me the RACI matrix for your AI systems. Who is Responsible, Accountable, Consulted, and Informed for each major AI function?"
- "How are accountability assignments reviewed when AI systems change?"

**E007 - Document system change approvals (Optional):**
- "Walk me through your AI change management process."
- "Who approves material changes to AI systems: model changes, prompt changes, tool integrations?"
- "How are changes documented and tracked? Show me the change log."
- "What constitutes a 'material change' that requires approval?"

**E008 - Review internal processes:**
- "How often do you conduct governance reviews of AI systems and processes?"
- "What is the review scope: policies, procedures, configurations, vendor relationships?"
- "Show me the most recent governance review report. What findings were identified?"
- "How are review findings tracked to remediation?"

**E010 - Establish AI acceptable use policy:**
- "Does your organization have an AI acceptable use policy? Who does it apply to?"
- "What prohibited uses are defined? How are violations detected?"
- "How is the AUP communicated to employees and enforced?"
- "What detection mechanisms identify AUP violations in practice?"

**E013 - Implement quality management system (Optional):**
- "Do you have a quality management system for AI development and operations?"
- "What quality metrics are tracked for AI systems?"
- "How does QMS integrate with your development lifecycle?"

**E014 - Share transparency reports (Optional):**
- "Does your organization publish transparency reports related to AI systems?"
- "What information is included: usage statistics, safety incidents, content moderation actions?"
- "What is the publication cadence and audience?"

#### Evidence Requests

- RACI matrix for AI systems (E004)
- Change management logs and approval records (E007)
- Most recent governance review report (E008)
- AI acceptable use policy with violation detection documentation (E010)
- QMS documentation for AI (E013)
- Published or draft transparency reports (E014)

---

### 2.8 QA / Testing Lead

**Interview Duration:** 60 minutes
**Controls Covered:** C002, C010-C012, D002, D004

#### Pre-Interview Preparation

- Pre-deployment testing procedures and checklists
- Third-party evaluation contracts and reports
- Quarterly assessment schedules and results
- Testing tool inventory for AI-specific testing

#### Opening Questions

- "How does AI testing differ from traditional software testing in your organization?"
- "What specialized AI testing capabilities have you built or procured?"

#### Core Questions

**C002 - Conduct pre-deployment testing:**
- "Describe your pre-deployment testing process for AI changes."
- "What test categories are covered: functional, safety, adversarial, bias, accuracy, performance?"
- "What are the pass/fail criteria? Who makes the go/no-go decision?"
- "How do you test prompt changes vs. model changes vs. tool integration changes?"

**C010 - Third-party testing for harmful outputs:**
- "Who performs third-party testing for harmful output generation?"
- "What test scenarios are covered in harmful output evaluations?"
- "How often are these assessments conducted? Show me the quarterly schedule."
- "How are findings triaged and remediated?"

**C011 - Third-party testing for out-of-scope outputs:**
- "How do third-party evaluators test for out-of-scope output generation?"
- "What defines 'in scope' for testing purposes? Is it aligned with C004?"
- "Show me the most recent third-party evaluation report for scope violations."

**C012 - Third-party testing for customer-defined risk:**
- "How are customer-specific risk categories incorporated into third-party testing?"
- "Do different customers get different test profiles?"
- "How do you scale third-party testing across customer-defined risk categories?"

**D002 - Third-party testing for hallucinations:**
- "Who performs third-party hallucination assessments?"
- "What benchmarks and methodologies are used to measure hallucination rates?"
- "How do quarterly assessment results trend over time?"
- "What is the current hallucination rate against your benchmark?"

**D004 - Third-party testing of tool calls:**
- "How do third-party evaluators test tool call safety and authorization?"
- "What scenarios are tested: unauthorized access, data exfiltration, privilege escalation through tools?"
- "Show me the most recent tool call security assessment."

#### Evidence Requests

- Pre-deployment test plan and most recent results (C002)
- Third-party evaluator contracts identifying scope and frequency (C010-C012, D002, D004)
- Quarterly testing schedule with completion records (C010-C012, D002, D004)
- Most recent third-party evaluation reports (C010-C012, D002, D004)
- Hallucination benchmark results and trend data (D002)
- Tool call security assessment results (D004)

---

### 2.9 Executive Sponsor / CTO

**Interview Duration:** 45 minutes
**Controls Covered:** E001, E002, E004 (accountability overview)

#### Pre-Interview Preparation

- AI strategy and governance documentation
- AI failure response plans (security, safety, reliability)
- Organizational accountability structure for AI

#### Opening Questions

- "What is the strategic role of AI in your organization? How do you balance innovation velocity with risk management?"
- "How do you stay informed about AI system performance and safety incidents?"

#### Core Questions

**E001 - AI failure plan for security breaches:**
- "Walk me through what happens when your AI system is compromised. Who is notified, what actions are taken, and what is the communication plan?"
- "Has this plan been tested? When was the last tabletop exercise?"
- "What are the escalation triggers that bring AI security incidents to your attention?"

**E002 - AI failure plan for harmful outputs:**
- "If your AI system produces output that causes customer harm, what is the response process?"
- "What authority do you have to shut down an AI system in production?"
- "How do you communicate AI safety incidents to affected customers?"

**E004 - Assign accountability:**
- "Who is accountable for AI system performance and safety in your organization?"
- "Is AI accountability documented in job descriptions and performance objectives?"
- "How are you personally held accountable for AI governance?"

#### Evidence Requests

- AI security incident response plan (E001)
- AI safety incident response plan (E002)
- Organizational chart showing AI accountability structure (E004)
- Records of tabletop exercises or incident response tests

---

## 3. Evidence Collection Checklist

### Before Interview (Request One Week in Advance)

**Policy Documents:**
- [ ] AI input data handling policy (A001)
- [ ] AI output data ownership and retention policy (A002)
- [ ] AI acceptable use policy (E010)
- [ ] AI incident response plans - security, safety, reliability (E001-E003)
- [ ] AI change management procedures (E007)
- [ ] AI vendor management policy (E006)
- [ ] Data processing location inventory (E011)
- [ ] Regulatory compliance inventory (E012)

**Architecture and Configuration:**
- [ ] AI system architecture diagrams
- [ ] Endpoint security and API gateway configurations (B004, B008)
- [ ] Access control matrices for AI systems (B006, B007)
- [ ] Data isolation architecture diagrams (A005)
- [ ] Logging infrastructure architecture (E015)

**Testing and Assessment:**
- [ ] Most recent adversarial testing report (B001)
- [ ] Most recent pre-deployment test results (C002)
- [ ] Most recent third-party evaluation reports (C010-C012, D002, D004)
- [ ] Quarterly assessment schedule with completion records
- [ ] AI risk taxonomy (C001)

**Governance:**
- [ ] RACI matrix for AI systems (E004)
- [ ] AI governance committee charter and meeting minutes (E008)
- [ ] Vendor due diligence records (E006)
- [ ] Cloud vs. on-premises risk assessments (E005)

### During Interview (Collect Live)

- [ ] Screen shares of monitoring dashboards (C008)
- [ ] Demonstrations of alerting systems and escalation workflows (C007)
- [ ] Walkthrough of approval workflows for AI changes (E007)
- [ ] Demonstrations of AI disclosure mechanisms in the product (E016)
- [ ] Live demonstrations of content filtering (C003, C004, C005)
- [ ] PII redaction demonstration (A006)
- [ ] User feedback interface walkthrough (C009)
- [ ] Sample AI activity log entries (E015)

### After Interview (Follow-up Items)

- [ ] Follow-up evidence items identified during discussion
- [ ] Clarification on partial or uncertain responses
- [ ] Additional stakeholder referrals for controls not fully addressed
- [ ] Updated evidence where provided documents were outdated
- [ ] Written confirmation of oral statements about controls not yet documented

---

## 4. Interview Best Practices

### Preparation

- Review the organization's AI system inventory before interviews begin. Understanding the architecture informs better follow-up questions.
- Sequence interviews strategically: start with the CISO and AI/ML Engineering Lead to build technical context before governance-focused interviews.
- Send interview agendas and evidence requests in advance so stakeholders can prepare demonstrations and pull documentation.

### During the Interview

- **Start open, then drill down.** Begin with open-ended questions about how they approach the topic, then ask specific control-level questions. Open-ended responses reveal maturity level before you probe for specifics.
- **Request demonstrations over descriptions.** "Show me" is stronger evidence than "Tell me." When a stakeholder describes a control, ask them to demonstrate it on screen.
- **Distinguish evidence quality.** Track whether each control was described (verbal only), demonstrated (shown on screen), or documented (written policy/procedure provided). This directly affects compliance scoring confidence.
- **Cross-reference between stakeholders.** If the CISO describes access controls one way, ask the engineering lead to walk through the same controls from their perspective. Misalignment is a finding.
- **Note confidence levels.** When a stakeholder responds confidently vs. hesitantly, record it. Uncertainty often indicates the control is informal or inconsistently applied.
- **Watch for "aspirational compliance."** Distinguish between "we do this" and "we plan to do this." Only implemented, operational controls count toward compliance.

### Documentation Standards

- Record the date, time, attendees, and duration of each interview.
- Attribute specific responses to specific individuals.
- Mark each control as: **Not Discussed** | **Discussed (verbal)** | **Demonstrated (shown)** | **Documented (artifact provided)** | **Verified (independently confirmed)**
- Note any contradictions between stakeholder responses immediately.
- Flag controls where the stakeholder deferred to another role.

### Common Pitfalls

- **Single-stakeholder reliance.** Never assess a control based on only one stakeholder's response. Corroborate with at least one secondary source (documentation, demonstration, or another stakeholder).
- **Policy-only compliance.** A policy document alone does not demonstrate compliance. Look for evidence of implementation and operational effectiveness.
- **Confusing model provider controls with organizational controls.** If the organization says "our model provider handles that," probe for supplementary controls, monitoring of provider controls, and contractual enforcement.
- **Overlooking quarterly controls.** Requirements with quarterly frequency (B001, B007, C001, C006, C010-C012, D002, D004) require evidence of recurring execution, not just one-time implementation.

---

## 5. Multi-Respondent Tracking

Use this table to track which stakeholders have been interviewed for which controls, the evidence quality, and the confidence level of their responses.

### Interview Completion Tracker

| Stakeholder Role | Stakeholder Name | Interview Date | Duration | Controls Discussed | Status |
|-----------------|-----------------|----------------|----------|-------------------|--------|
| CISO / Head of Security | [NAME] | [DATE] | [DURATION] | B001-B009, F001-F002 | [Scheduled / Complete / Partial] |
| DPO / Privacy Lead | [NAME] | [DATE] | [DURATION] | A001-A007, E011 | [Scheduled / Complete / Partial] |
| AI/ML Engineering Lead | [NAME] | [DATE] | [DURATION] | C001-C006, D001, D003, B006 | [Scheduled / Complete / Partial] |
| AI Product / Safety Lead | [NAME] | [DATE] | [DURATION] | C007-C009, C001, E016 | [Scheduled / Complete / Partial] |
| Legal Counsel | [NAME] | [DATE] | [DURATION] | A007, E003, E005, E006, E012 | [Scheduled / Complete / Partial] |
| DevOps / Platform Eng | [NAME] | [DATE] | [DURATION] | B004, B008, E015 | [Scheduled / Complete / Partial] |
| GRC / Compliance Lead | [NAME] | [DATE] | [DURATION] | E004, E007, E008, E010, E013, E014 | [Scheduled / Complete / Partial] |
| QA / Testing Lead | [NAME] | [DATE] | [DURATION] | C002, C010-C012, D002, D004 | [Scheduled / Complete / Partial] |
| Executive Sponsor / CTO | [NAME] | [DATE] | [DURATION] | E001, E002, E004 | [Scheduled / Complete / Partial] |

### Per-Control Response Tracker

| Control ID | Control Title | Primary Respondent | Evidence Quality | Confidence | Corroborated By | Notes |
|------------|--------------|-------------------|-----------------|------------|-----------------|-------|
| A001 | Establish input data policy | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A002 | Establish output data policy | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A003 | Limit AI agent data collection | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A004 | Protect IP & trade secrets | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A005 | Prevent cross-customer data exposure | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A006 | Prevent PII leakage | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| A007 | Prevent IP violations | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B001 | Third-party testing of adversarial robustness | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B002 | Detect adversarial input | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B003 | Manage public release of technical details | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B004 | Prevent AI endpoint scraping | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B005 | Implement real-time input filtering | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B006 | Limit AI agent system access | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B007 | Enforce user access privileges to AI systems | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B008 | Protect model deployment environment | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| B009 | Limit output over-exposure | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C001 | Define AI risk taxonomy | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C002 | Conduct pre-deployment testing | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C003 | Prevent harmful outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C004 | Prevent out-of-scope outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C005 | Prevent customer-defined high risk outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C006 | Prevent output vulnerabilities | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C007 | Flag high risk recommendations | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C008 | Monitor AI risk categories | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C009 | Enable real-time feedback and intervention | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C010 | Third-party testing for harmful outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C011 | Third-party testing for out-of-scope outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| C012 | Third-party testing for customer-defined risk | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| D001 | Prevent hallucinated outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| D002 | Third-party testing for hallucinations | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| D003 | Restrict unsafe tool calls | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| D004 | Third-party testing of tool calls | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E001 | AI failure plan for security breaches | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E002 | AI failure plan for harmful outputs | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E003 | AI failure plan for hallucinations | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E004 | Assign accountability | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E005 | Assess cloud vs on-prem processing | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E006 | Conduct vendor due diligence | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E007 | Document system change approvals | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E008 | Review internal processes | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E009 | Monitor third-party access | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E010 | Establish AI acceptable use policy | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E011 | Record processing locations | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E012 | Document regulatory compliance | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E013 | Implement quality management system | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E014 | Share transparency reports | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E015 | Log model activity | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E016 | Implement AI disclosure mechanisms | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| E017 | Document system transparency policy | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| F001 | Prevent AI cyber misuse | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |
| F002 | Prevent catastrophic misuse | [NAME] | [Not Discussed / Verbal / Demonstrated / Documented / Verified] | [High / Medium / Low] | [NAME or N/A] | [NOTES] |

### Contradiction and Gap Log

Use this table to record contradictions between stakeholder responses and controls where no stakeholder could provide adequate evidence.

| Control ID | Issue Type | Description | Stakeholder A | Stakeholder B | Resolution Required | Status |
|------------|-----------|-------------|---------------|---------------|-------------------|--------|
| [ID] | [Contradiction / Gap / Deferral] | [Description of the issue] | [NAME - their claim] | [NAME - conflicting claim] | [Yes / No] | [Open / Resolved] |

---

## Related Templates

- **Assessment Rules:** `standards/frameworks/aiuc-1/templates/engagement-rules/assessment-rules.md`
- **Compliance Matrix:** `standards/frameworks/aiuc-1/templates/deliverables/compliance-matrix.md`
- **Remediation Plan:** `standards/frameworks/aiuc-1/templates/deliverables/remediation-plan.md`
- **Assessment Template:** `standards/frameworks/aiuc-1/templates/assessment/README.md`
- **AIUC-1 Reference:** `standards/frameworks/aiuc-1/docs/AIUC-1-REFERENCE.md`

---

**Generated by:** Compliance Skill v2.0
**Framework Source:** `standards/frameworks/aiuc-1/`
**Questions Bank:** `standards/frameworks/aiuc-1/questions.yaml`
