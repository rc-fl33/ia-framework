---
type: template
name: ai_societal_safety
category: AI Agent Controls (AIUC-1)
classification: public
version: 1.1
last_updated: 2026-02-13
aiuc1_controls:
  primary: [F001, F002]
  supporting: [E010, B001]
  description: "Completing this policy provides evidence for AIUC-1 Principle F (Society) controls including cyber misuse prevention guardrails and CBRN catastrophic misuse prevention guardrails."
---

# AI Societal Safety Policy
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
This policy establishes requirements to prevent AI systems operated by {{ORGANIZATION_NAME}} from being misused for activities that pose catastrophic risks to society, including cyber exploitation and chemical, biological, radiological, or nuclear (CBRN) weapons development. It addresses the organization's responsibility to verify that foundation model safeguards remain intact, implement supplementary controls for harmful use prevention, and maintain ongoing monitoring for misuse patterns. This policy implements the societal safety controls defined by AIUC-1 Principle F (controls F001 and F002) and aligns with the NIST AI Risk Management Framework societal risk provisions, ISO 42001 societal impact requirements, and responsible AI deployment principles.

## Scope
This policy applies to all AI systems operated by or on behalf of {{ORGANIZATION_NAME}} that have the technical capability to generate content, code, instructions, or analyses that could be exploited for cyber attacks, CBRN weapons development, or other forms of catastrophic societal harm. Coverage includes foundation models, fine-tuned models, AI agents with research or coding capabilities, and AI-enabled systems that process or generate technical content in security, chemistry, biology, nuclear science, or related domains. The policy applies regardless of the intended use case of the AI system, recognizing that general-purpose AI capabilities may be repurposed for harmful ends.

## Definitions

**Cyber Exploitation**: The use of AI systems to develop, enhance, or automate cyber attacks including malware creation, vulnerability exploitation, social engineering campaigns, and network intrusion techniques.

**CBRN**: Chemical, biological, radiological, and nuclear materials and weapons, the development or deployment of which poses catastrophic risks to human life and safety.

**Foundation Model**: A large-scale AI model trained on broad data that serves as the base for downstream applications, whose safety properties are established by the model developer.

**Foundation Model Provider Attestation**: A formal statement from a foundation model developer confirming that specific safety mitigations are in place and have not been removed or degraded.

**Dual-Use Content**: Information, instructions, or capabilities that have legitimate purposes but could also be misused for harmful applications.

**Uplift Prevention**: Controls designed to prevent AI systems from providing meaningful assistance that would enhance an actor's ability to cause catastrophic harm beyond what is freely available through public sources.

**Misuse Detection**: Monitoring capabilities that identify patterns of AI system usage consistent with harmful intent, including attempts to extract dangerous information or circumvent safety controls.

## Policy Requirements

### 1. Cyber Exploitation Prevention (AIUC-1: F001)

**1.1 Foundation Model Provider Attestation**
- Results of testing from foundation model developers on offensive cyber capabilities shall be documented and retained
- Documentation shall include the scope of cyber capability testing, identified risks, mitigations implemented, and residual risk assessment
- Attestation shall be obtained from foundation model providers confirming that cyber safety mitigations have not been removed or degraded in the model version deployed by {{ORGANIZATION_NAME}}
- Attestation currency shall be verified upon each model version update and at minimum annually

**1.2 Content Filtering for Cyber Exploitation**
- Malicious use detection and blocking mechanisms shall be implemented via content filtering for AI system inputs and outputs
- Filtering shall address requests for malware development, vulnerability exploitation code, social engineering templates, network intrusion instructions, and other offensive cyber content
- Filtering shall distinguish between legitimate security research and education versus actual exploitation assistance
- Filter effectiveness shall be tested quarterly through adversarial testing scenarios

**1.3 Supplementary Cyber Safety Controls**
- Where foundation model provider mitigations are assessed as insufficient, supplementary controls shall be implemented including enhanced input filtering, output restrictions, and domain-specific safety layers
- Supplementary controls shall be proportionate to the assessed risk of cyber exploitation through the specific AI system
- Controls shall be documented in the system risk assessment and reviewed as part of the quarterly risk taxonomy review

**1.4 Cyber Misuse Monitoring**
- Ongoing monitoring shall detect patterns of AI system usage consistent with cyber exploitation intent
- Monitoring shall identify repeated attempts to extract offensive cyber capabilities, systematic probing of safety boundaries, and usage patterns indicative of attack preparation
- Detected misuse patterns shall trigger investigation, account review, and potential access suspension
- Monitoring findings shall be reported to the AI Governance Committee and, where appropriate, to law enforcement

### 2. CBRN Risk Prevention (AIUC-1: F002)

**2.1 Foundation Model Provider CBRN Testing**
- Results of testing from foundation model developers specifically addressing CBRN capabilities shall be documented and retained
- Documentation shall cover the scope of CBRN-related testing including chemical synthesis pathways, biological agent information, radiological material handling, and nuclear weapon design information
- Testing results shall be assessed to determine whether the AI system provides meaningful uplift for CBRN development beyond freely available public information

**2.2 CBRN Mitigation Attestation**
- Attestation shall be obtained from foundation model providers confirming that CBRN mitigations remain intact in the deployed model version
- Attestation shall address specific CBRN risk categories relevant to the AI system's capabilities
- Attestation validity shall be verified upon model updates and at minimum annually
- Discrepancies between attested mitigations and observed behavior shall trigger immediate investigation

**2.3 CBRN Evaluation Benchmarks**
- Relevant CBRN evaluations or proxy benchmarks shall be considered when assessing AI system risk, including established evaluation frameworks from government agencies and academic institutions
- Benchmark results shall be incorporated into the risk assessment for AI systems with potential CBRN relevance
- Where standardized CBRN benchmarks are not available, proxy assessments shall be developed using domain expertise

**2.4 CBRN Content Filtering**
- Content filtering shall be implemented to detect and block AI system interactions that seek CBRN-related harmful information
- Filtering shall address both explicit requests for weapons development information and obfuscated attempts to extract harmful knowledge through indirect or multi-step queries
- Filtering shall preserve legitimate scientific, medical, and educational uses of AI in chemistry, biology, and related fields
- Filter rules shall be developed in consultation with domain experts in chemistry, biology, radiological science, and nuclear security

### 3. Foundation Model Provider Governance

**3.1 Provider Safety Assessment**
- Foundation model providers shall be assessed for their safety programs, red-teaming practices, and responsible disclosure policies as part of vendor due diligence
- Assessment shall evaluate the maturity and comprehensiveness of the provider's approach to preventing catastrophic misuse
- Assessment results shall inform model selection decisions and supplementary control requirements

**3.2 Contractual Requirements**
- Contracts with foundation model providers shall require notification of material changes to safety mitigations
- Contractual provisions shall address the organization's right to safety attestation documentation and testing results
- Liability allocation for societal safety failures shall be addressed in vendor agreements

**3.3 Ongoing Provider Monitoring**
- Foundation model provider safety posture shall be monitored through public disclosures, safety reports, regulatory actions, and industry assessments
- Material changes in provider safety posture shall trigger reassessment of supplementary control adequacy
- Provider safety incidents reported publicly shall be assessed for impact on {{ORGANIZATION_NAME}} deployments

### 4. Ongoing Monitoring for Misuse

**4.1 Usage Pattern Analysis**
- AI system usage patterns shall be analyzed for indicators of harmful intent including systematic attempts to extract dangerous information, unusual topic clustering, and escalating specificity in harmful domains
- Analysis shall employ both automated detection and periodic human review of flagged interactions
- Detection thresholds shall balance sensitivity with false positive rates to maintain operational effectiveness

**4.2 Incident Response for Misuse**
- Detected misuse incidents shall be investigated using defined procedures with designated responders
- Response actions shall include immediate access suspension for high-severity misuse, user notification, and law enforcement referral where warranted
- Incident records shall be maintained for pattern analysis and regulatory compliance

**4.3 Threat Intelligence Integration**
- AI misuse monitoring shall incorporate threat intelligence on emerging exploitation techniques and actor methodologies
- Threat intelligence shall inform detection rule updates, monitoring focus areas, and risk assessment refinements
- Intelligence sharing with relevant industry groups and government agencies shall be conducted where appropriate and legally permitted

### 5. Responsible Development Practices

**5.1 Dual-Use Risk Assessment**
- AI system development and deployment decisions shall include assessment of dual-use risks for catastrophic harm potential
- Risk assessments shall consider the system's capability to provide uplift for harmful activities beyond publicly available information
- High dual-use risk systems shall require enhanced safety controls and governance oversight

**5.2 Safety Culture**
- {{ORGANIZATION_NAME}} shall foster a safety culture where personnel are encouraged to raise concerns about AI misuse potential
- Reporting channels shall be available for personnel to flag potential societal safety risks without fear of retaliation
- Safety concerns shall be investigated and addressed through defined governance procedures

**5.3 Industry Engagement**
- {{ORGANIZATION_NAME}} shall engage with industry initiatives, standards bodies, and government agencies on AI societal safety
- Participation in responsible AI deployment forums shall inform organizational practices and contribute to collective safety
- Best practices from industry engagement shall be incorporated into policy updates

## Roles and Responsibilities

**AI Governance Committee:**
- Strategic oversight of societal safety program
- Foundation model provider safety assessment review
- Misuse incident escalation and response authorization
- Policy review and update approval

**Chief AI Officer / Chief Technology Officer:**
- Societal safety program leadership and resource allocation
- Foundation model provider relationship management for safety matters
- Regulatory and government engagement on AI safety
- Board-level reporting on societal safety risks

**AI Security Team:**
- Content filtering implementation and maintenance for cyber and CBRN prevention
- Adversarial testing of societal safety controls
- Misuse detection monitoring and alert response
- Threat intelligence integration for AI exploitation patterns

**Legal and Compliance Team:**
- Foundation model provider attestation management
- Contractual requirements for safety mitigations
- Law enforcement referral coordination for misuse incidents
- Regulatory compliance for AI safety reporting requirements

**AI Engineering Team:**
- Supplementary safety control implementation
- Content filtering integration into AI system pipelines
- Monitoring system development and deployment
- Safety control testing and effectiveness measurement

**Ethics and Safety Advisors (if applicable):**
- Dual-use risk assessment consultation
- CBRN domain expertise for filter development
- Safety evaluation methodology guidance
- Industry engagement and best practice research

## Compliance and Monitoring

**Societal Safety Metrics:**
- Foundation model provider attestation currency and coverage
- Content filtering effectiveness rates for cyber and CBRN categories
- Misuse detection rates and investigation outcomes
- Adversarial testing results for societal safety controls

**Continuous Monitoring:**
- Real-time content filtering for cyber exploitation and CBRN content
- Usage pattern analysis for misuse indicators
- Provider safety posture monitoring through public disclosures
- Threat intelligence feed integration for emerging risks

**Audit and Assessment:**
- Annual foundation model provider safety assessment
- Quarterly adversarial testing of societal safety controls
- Annual review of content filtering effectiveness
- Periodic review of misuse detection capabilities

## Sanctions and Enforcement

**Policy Violations:**
AI societal safety violations will result in appropriate corrective action:

- **Disabling Safety Controls**: Immediate investigation with system suspension
- **Failure to Maintain Attestation**: Compliance escalation with deployment review
- **Misuse Response Delays**: Investigation with process improvement requirements
- **Unauthorized Dual-Use Deployment**: System suspension and governance review

**Corrective Actions:**
- Mandatory safety awareness training
- Enhanced safety review requirements for future deployments
- Progressive disciplinary action for repeated violations
- Legal action and regulatory reporting for facilitated misuse

## Related Policies and Standards

- **AI Governance Standard** (`ai_governance.md`)
- **AI Security Policy** (`ai_security.md`)
- **AI Safety Policy** (`ai_safety.md`)
- **AI Accountability Policy** (`ai_accountability.md`)
- **Incident Response Policy** (`incident_response.md`)
- **Third-Party Risk Management Policy** (`third_party_risk_management.md`)
- **Acceptable Use Policy** (`acceptable_use.md`)

## Framework Compliance Mapping

**AIUC-1 AI Unified Controls v1.0 (Principle F - Society):**
- F001: Cyber exploitation prevention with provider attestation, content filtering, and ongoing monitoring
- F002: CBRN risk prevention with provider testing documentation, mitigation attestation, and evaluation benchmarks

**NIST AI Risk Management Framework:**
- MEASURE 2.7: Measurement of AI system misuse risks and societal impact
- GOVERN 1.3, 1.4: Risk categorization including societal risks

**ISO 42001 (AI Management System):**
- A.5.5: Societal and environmental impact considerations

**CSA AI Controls Matrix (AICM):**
- GRC-02: Governance for societal risk management
- GRC-09: Acceptable use governance including societal safety
- GRC-10: Risk management program including catastrophic risks
- GRC-12: Regulatory compliance for AI safety
- TVM-11: Threat management for societal risks

**EU AI Act (Reference):**
- Prohibited practices including manipulation and exploitation
- High-risk system requirements for systems affecting safety
- General-purpose AI model obligations for systemic risk management

**Responsible AI Frameworks:**
- OECD AI Principles: Robustness, security, and safety
- G7 Hiroshima AI Process: International AI governance
- Bletchley Declaration: AI safety commitments

---
*This policy supports compliance with: {{COMPLIANCE_FRAMEWORKS}}*
*Policy Owner: {{POLICY_OWNER}} | Next Review: {{NEXT_REVIEW_DATE}}*
*For questions or clarifications, contact: {{CONTACT_EMAIL}}*
