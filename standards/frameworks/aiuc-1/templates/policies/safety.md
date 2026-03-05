---
type: template
name: ai_safety
category: AI Agent Controls (AIUC-1)
classification: public
version: 1.1
last_updated: 2026-02-13
aiuc1_controls:
  primary: [C001, C002, C003, C004, C005, C006, C007, C009]
  supporting: [C008, C010, C011, C012]
  description: "Completing this policy provides evidence for AIUC-1 Principle C (Safety) controls including risk taxonomy, pre-deployment testing, harmful/out-of-scope output prevention, output vulnerability prevention, and user feedback mechanisms."
---

# AI Safety Policy
*(Effective: {{EFFECTIVE_DATE}} | Version: {{VERSION}})*

## Document Control

| Version | Date | Author | Changes | Approved By | Next Review |
|---------|------|--------|---------|-------------|-------------|
| {{VERSION}} | {{EFFECTIVE_DATE}} | {{AUTHOR_NAME}} | {{CHANGE_SUMMARY}} | {{APPROVER_NAME}} | {{NEXT_REVIEW_DATE}} |

**Document History:**
- Track all policy revisions in the table above
- Include version number, date, author, summary of changes, approver, and next review date
- Maintain historical versions for audit purposes
- Archive superseded versions per document retention policy

---

## Purpose
This policy establishes comprehensive safety requirements for all artificial intelligence systems operated by {{ORGANIZATION_NAME}}, ensuring that AI outputs do not cause harm to users, customers, or the public. It addresses risk classification, content filtering, safety evaluation, bias detection, human oversight, and incident escalation procedures specific to AI-generated content and behavior. This policy implements the safety controls defined by AIUC-1 Principle C (controls C001 through C012) and aligns with the NIST AI Risk Management Framework, EU AI Act safety provisions, and ISO 42001 safety management requirements.

## Scope
This policy applies to all AI systems that generate outputs consumed by humans or that drive automated actions on behalf of {{ORGANIZATION_NAME}}. Coverage includes conversational AI, content generation systems, recommendation engines, AI agents with tool-calling capabilities, decision support systems, and any AI-enabled feature that produces outputs visible to users or affecting business operations. The policy governs safety throughout the AI system lifecycle from pre-deployment testing through operational monitoring and incident response.

## Definitions

**Harmful Output**: AI-generated content that causes or could cause physical, psychological, financial, or reputational harm to individuals or organizations, including distressed outputs, angry responses, high-risk advice, offensive content, bias, and deception.

**Out-of-Scope Output**: AI responses that fall outside the system's intended use cases, such as medical advice from a customer service bot or political commentary from a technical assistant.

**Hallucinated Output**: AI-generated content that presents fabricated information as factual, including invented citations, false claims, nonexistent data, and confident assertions about topics the model has no valid basis for addressing.

**Risk Taxonomy**: A structured classification of AI-related risks organized by category, severity, likelihood, and impact, used to prioritize safety controls and testing activities.

**Kill Switch**: An emergency mechanism to immediately disable or suspend an AI system when it poses imminent risk of harm.

**Content Attribution**: Mechanisms that identify content as AI-generated or AI-assisted, enabling users to assess the provenance and reliability of information.

**Safety Guardrail**: A technical control designed to prevent AI systems from generating harmful, inappropriate, or dangerous outputs.

## Policy Requirements

### 1. Risk Classification and Taxonomy (AIUC-1: C001)

**1.1 Risk Category Definitions**
- A risk taxonomy shall be established categorizing risks within harmful outputs, out-of-scope outputs, hallucinated outputs, unsafe tool calls, and application-specific risks
- Risk categories shall include but not be limited to: physical harm advice, mental health harm, financial harm, discriminatory content, deceptive content, privacy violations, and security vulnerabilities
- Each risk category shall be defined with clear examples, boundary conditions, and severity levels

**1.2 Framework Alignment**
- The risk taxonomy shall be aligned with NIST AI RMF risk categories, EU AI Act risk classification requirements, and ISO 42001 risk management provisions
- Cross-references shall be maintained between organizational risk categories and regulatory framework risk levels
- Industry-specific risk categories shall be incorporated based on {{ORGANIZATION_NAME}} operational domains

**1.3 Severity Grading**
- A consistent severity grading methodology shall be applied across all risk categories: critical, high, medium, and low
- Severity definitions shall consider likelihood of occurrence, potential impact magnitude, reversibility of harm, and affected population size
- Severity grading shall determine testing priority, monitoring intensity, and incident response urgency

**1.4 Quarterly Review**
- The risk taxonomy shall be reviewed and updated quarterly by the AI Governance Committee
- Reviews shall incorporate findings from adversarial testing, safety evaluations, incident reports, and emerging threat intelligence
- Taxonomy updates shall be communicated to all stakeholders and reflected in testing programs within 30 days

### 2. Pre-Deployment Safety Testing (AIUC-1: C002)

**2.1 Testing Coverage**
- Internal testing shall be conducted before deployment across all risk categories including high-risk, harmful, hallucinated, and out-of-scope outputs and tool calls
- Test documentation shall include test case descriptions, input data, expected outcomes, actual results, and pass/fail determinations
- Testing shall include hallucination testing with factual accuracy benchmarks, adversarial prompting across all risk categories, and boundary testing for scope enforcement

**2.2 Risk Assessment**
- Risk assessments shall be performed before each deployment with impact analysis documenting potential failure modes and their consequences
- Deployment decisions shall be risk-informed, with higher-risk deployments requiring additional testing and review
- Risk acceptance decisions shall be documented with justification and approval from accountable leads

**2.3 Deployment Approval**
- Formal approval sign-offs shall be obtained from accountable leads before production deployment
- Approval authority shall be commensurate with assessed risk level: standard deployments by engineering leads, high-risk by AI Governance Committee
- Conditional approvals may specify enhanced monitoring requirements or limited rollout parameters

### 3. Harmful Output Prevention (AIUC-1: C003)

**3.1 Content Filtering**
- Content filtering shall be implemented for harmful content types including distressed outputs, angry responses, offensive content, deceptive content, and discriminatory content
- Filtering shall operate on both inputs (to prevent elicitation of harmful content) and outputs (to catch harmful content before delivery)
- Filter categories and sensitivity levels shall be configurable based on use case requirements and risk tolerance

**3.2 Safety Guardrails for Sensitive Domains**
- Enhanced safety guardrails shall be enforced for AI advice generation in sensitive domains including medical, legal, financial, and mental health topics
- Guardrails shall include appropriate disclaimers, professional referral suggestions, and scope limitations for sensitive topics
- Domain-specific safety requirements shall be defined in consultation with subject matter experts and legal counsel

**3.3 Bias Detection and Mitigation**
- Bias detection controls shall be operational to identify discriminatory patterns in AI outputs across protected characteristics
- Regular bias assessments shall be conducted using standardized metrics and diverse test datasets
- Identified bias patterns shall be documented, remediated, and verified through retesting

### 4. Out-of-Scope Output Prevention (AIUC-1: C004)

**4.1 Topic Boundary Enforcement**
- Topic boundary enforcement shall be implemented to detect and redirect conversations that fall outside the AI system's intended use cases
- Boundary definitions shall be maintained for each AI system specifying permitted topics, prohibited topics, and topics requiring escalation
- Boundary enforcement shall provide helpful redirect responses that guide users toward appropriate resources

**4.2 Scope Violation Response**
- Scope violation response procedures shall be established with automated redirection to appropriate channels or human support
- Responses to out-of-scope queries shall be informative without being dismissive, explaining system limitations and suggesting alternatives
- Repeated scope violation patterns shall trigger enhanced monitoring and potential system adjustment

**4.3 Scope Monitoring**
- Ongoing scope monitoring shall track boundary violation frequency, patterns, and user satisfaction with redirect responses
- Monitoring data shall inform scope definition refinements and identify emerging use case demands
- Scope violation trends shall be reported to the AI Governance Committee quarterly

### 5. High-Risk Output Controls (AIUC-1: C005)

**5.1 Risk-Aligned Detection**
- Detection and blocking mechanisms shall be aligned with the organization's risk taxonomy for content categories beyond standard harmful and out-of-scope outputs
- Detection rules shall be customizable to address industry-specific and organization-specific high-risk categories
- Detection confidence levels shall be calibrated to minimize both false positives and false negatives

**5.2 Risk-Based Response Controls**
- Flagged high-risk content shall be subject to graduated response actions including logging, warning, blocking, and human escalation based on risk severity
- Response controls shall preserve user experience while maintaining safety boundaries
- Response action configurations shall be documented and subject to periodic review

**5.3 Escalation Procedures**
- Escalation procedures shall be defined for flagged high-risk content requiring human review
- Escalation paths shall specify designated reviewers, response timeframes, and authority levels for disposition decisions
- Escalation outcomes shall be tracked and analyzed for patterns informing control improvements

### 6. Output Security Vulnerability Prevention (AIUC-1: C006)

**6.1 Output Sanitization**
- Output sanitization and validation shall be performed before content presentation to users to prevent injection attacks, cross-site scripting, and other security vulnerabilities in AI outputs
- Sanitization shall address code outputs, HTML content, structured data, and any AI-generated content that could be executed or interpreted by downstream systems
- Sanitization rules shall be updated to address emerging output-based attack vectors

**6.2 Safety-Specific Labeling**
- Safety-specific labeling and handling protocols shall be implemented for AI outputs that reference security-sensitive topics
- Labels shall indicate content risk level, required handling procedures, and applicable restrictions
- Labeling shall be machine-readable for automated downstream processing

**6.3 Advanced Attack Detection**
- Detection capabilities shall be maintained for advanced attack patterns including prompt injection chains, multi-turn manipulation, and indirect prompt injection through retrieved content
- Detection shall cover both individual interaction safety and aggregate session behavior patterns
- Detection capabilities shall be updated quarterly based on emerging attack research

### 7. Human Review Alerting (AIUC-1: C007)

**7.1 Risk Criteria Definition**
- Risk criteria for human review flagging shall be defined based on the organizational risk taxonomy
- Criteria shall include confidence thresholds, content category triggers, and contextual risk factors
- Criteria shall be reviewed quarterly and updated based on false positive/negative analysis

**7.2 Detection Mechanisms**
- Detection shall employ keyword filtering, confidence scoring, semantic analysis, or combination approaches to identify outputs requiring human review
- Detection mechanisms shall operate with minimal latency impact on the user experience
- Detection accuracy shall be measured and reported as part of safety monitoring metrics

**7.3 Review Workflows**
- Review workflows shall be established with designated reviewers, defined response timeframes, and clear escalation procedures
- Reviewers shall receive training on the risk taxonomy and disposition decision criteria
- Review outcomes shall be documented and used to improve detection accuracy

### 8. Risk Category Monitoring (AIUC-1: C008)

**8.1 Proactive Detection**
- Proactive detection shall be implemented across all risk categories defined in the taxonomy to identify emerging issues before they impact users
- Detection shall include both automated monitoring and periodic manual review of AI system outputs
- Detection systems shall be integrated with existing security monitoring tools using standard logging formats

**8.2 Ongoing Evaluations**
- Regular evaluations shall assess the effectiveness of safety controls across all risk categories
- Evaluations shall use representative test datasets, adversarial scenarios, and real-world interaction samples
- Evaluation results shall drive control refinements and risk taxonomy updates

**8.3 Documentation and Tracking**
- Monitoring findings shall be documented with clear examples, frequency data, and trend analysis
- Findings shall be tracked through remediation with defined owners and timelines
- Historical monitoring data shall be retained for trend analysis and audit purposes

### 9. User Feedback and Intervention (AIUC-1: C009)

**9.1 Real-Time Communication**
- On-screen communication systems shall provide users with status indicators and alerts during AI system interactions
- Users shall be informed of system processing states, uncertainty levels, and any applicable limitations
- Communication shall be clear, concise, and designed for the target user audience

**9.2 Intervention Capabilities**
- User intervention capabilities shall be available including pause, stop, undo, and report functions during AI interactions
- Intervention controls shall be prominently accessible and responsive to user actions
- System state shall be safely recoverable after user intervention actions

**9.3 Accessibility Compliance**
- Feedback and intervention mechanisms shall comply with WCAG 2.1 accessibility standards
- Accessibility shall be verified through automated testing and manual review
- Alternative interaction methods shall be available for users with different accessibility needs

### 10. Third-Party Safety Evaluation (AIUC-1: C010, C011, C012)

**10.1 Qualified Assessor Selection**
- Qualified external assessors shall be appointed with documented expertise in AI safety evaluation
- Assessor qualifications shall include demonstrated experience with relevant testing methodologies, industry benchmarks, and applicable regulatory frameworks
- Assessor independence shall be verified to prevent conflicts of interest

**10.2 Quarterly Testing Execution**
- Third-party testing shall be conducted at minimum quarterly covering harmful outputs (C010), out-of-scope outputs (C011), and organization-defined high-risk outputs (C012)
- Testing shall use industry benchmarks and standardized evaluation frameworks
- Test scope shall cover all production AI systems with risk-based prioritization

**10.3 Findings and Remediation**
- Third-party testing results shall be documented with findings, severity ratings, and remediation recommendations
- Remediation actions shall be tracked with designated owners and completion timelines
- Remediation effectiveness shall be verified through follow-up testing in subsequent quarters

## Roles and Responsibilities

**AI Safety Lead:**
- Risk taxonomy development and maintenance
- Safety testing program coordination
- Safety incident investigation and root cause analysis
- Regulatory compliance monitoring for AI safety requirements

**AI Governance Committee:**
- Risk taxonomy review and approval
- Deployment approval for high-risk AI systems
- Third-party assessor selection and oversight
- Strategic safety program direction

**AI Engineering Team:**
- Content filtering and safety guardrail implementation
- Output sanitization and security vulnerability prevention
- User feedback and intervention mechanism development
- Pre-deployment safety testing execution

**Third-Party Assessors:**
- Quarterly safety evaluations across risk categories
- Independent assessment of safety control effectiveness
- Findings documentation and remediation recommendations
- Industry benchmark comparisons and best practice guidance

**Information Security Team:**
- Output security vulnerability monitoring
- Integration of safety monitoring with security operations
- Incident response for safety-related security events
- Advanced attack detection and response

**Business Unit Leaders:**
- Risk category identification for their operational domains
- Participation in scope definition for AI system boundaries
- User training on AI safety features and limitations
- Feedback escalation for safety concerns

## Compliance and Monitoring

**Safety Metrics:**
- Harmful output detection and prevention rates by category
- Out-of-scope output frequency and redirect effectiveness
- Third-party assessment scores and trend analysis
- Human review escalation volumes and disposition outcomes

**Continuous Monitoring:**
- Real-time content filtering and safety guardrail effectiveness
- Bias detection scan results and trend analysis
- User feedback and intervention usage patterns
- Output security vulnerability detection rates

**Audit and Assessment:**
- Quarterly third-party safety evaluations (C010, C011, C012)
- Quarterly risk taxonomy reviews and updates
- Annual comprehensive safety program effectiveness assessment
- Pre-deployment safety testing for all system changes

## Sanctions and Enforcement

**Policy Violations:**
AI safety violations will result in appropriate corrective action:

- **Deployment Without Testing**: System rollback and mandatory testing completion
- **Safety Control Bypass**: Investigation, access restriction, and corrective action
- **Failure to Escalate**: Mandatory retraining on escalation procedures
- **Ignoring Assessment Findings**: Remediation enforcement with governance escalation

**Corrective Actions:**
- Mandatory safety awareness training for involved personnel
- Enhanced pre-deployment review requirements for future releases
- Progressive disciplinary action for repeated safety violations
- System suspension for unresolved critical safety findings

## Related Policies and Standards

- **AI Governance Standard** (`ai_governance.md`)
- **AI Security Policy** (`ai_security.md`)
- **AI Reliability Policy** (`ai_reliability.md`)
- **AI Accountability Policy** (`ai_accountability.md`)
- **Incident Response Policy** (`incident_response.md`)
- **Risk Management Policy** (`risk_management.md`)
- **Acceptable Use Policy** (`acceptable_use.md`)

## Framework Compliance Mapping

**AIUC-1 AI Unified Controls v1.0 (Principle C - Safety):**
- C001: Risk taxonomy with severity grading, framework alignment, and quarterly reviews
- C002: Pre-deployment testing across risk categories with formal approval
- C003: Harmful output prevention with content filtering and bias detection
- C004: Out-of-scope output prevention with topic boundary enforcement
- C005: High-risk output controls aligned with organizational risk taxonomy
- C006: Output security vulnerability prevention with sanitization and labeling
- C007: Human review alerting system with risk-based flagging
- C008: Risk category monitoring with proactive detection and regular evaluations
- C009: User feedback collection and intervention capabilities with accessibility compliance
- C010: Third-party evaluation of harmful output robustness (quarterly)
- C011: Third-party evaluation of out-of-scope output robustness (quarterly)
- C012: Third-party evaluation of high-risk output robustness (quarterly)

**NIST AI Risk Management Framework:**
- GOVERN 1.3, 1.4, 1.5, 3.2, 4.2, 4.3: AI governance, testing, and oversight
- MAP 1.5, 2.2, 3.4, 3.5, 4.2, 5.1: Risk identification and use case mapping
- MANAGE 1.1, 1.2, 1.3, 1.4, 2.2, 3.1, 4.1: Risk management and mitigation
- MEASURE 1.1, 1.3, 2.1, 2.3, 2.4, 2.5, 2.6, 2.10, 2.11, 3.1, 3.3, 4.1, 4.2, 4.3: Measurement and evaluation

**EU AI Act:**
- Article 9: Risk management system requirements
- Article 14: Human oversight provisions
- Article 27: Fundamental rights impact assessment
- Article 72: Provider obligations for safety

**ISO 42001 (AI Management System):**
- A.5.2, A.5.3, A.5.4, A.5.5: Risk identification, analysis, evaluation, and treatment
- A.6.1.2: Safety considerations in AI system design
- A.6.2.4, A.6.2.5, A.6.2.6: AI system testing and evaluation
- A.8.3: Stakeholder feedback mechanisms
- A.9.2, A.9.3, A.9.4: Performance evaluation and monitoring

**CSA AI Controls Matrix (AICM):**
- AIS-04, AIS-05, AIS-06, AIS-07, AIS-09, AIS-12: AI system safety controls
- GRC-02, GRC-09, GRC-11, GRC-15: Governance, risk, and compliance
- TVM-01 through TVM-13: Threat and vulnerability management
- LOG-14, LOG-15: Logging and monitoring

---
*This policy supports compliance with: {{COMPLIANCE_FRAMEWORKS}}*
*Policy Owner: {{POLICY_OWNER}} | Next Review: {{NEXT_REVIEW_DATE}}*
*For questions or clarifications, contact: {{CONTACT_EMAIL}}*
