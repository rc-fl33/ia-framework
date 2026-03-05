---
type: reference
name: iso-42001-test-playbook
category: compliance
classification: public
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42001:2023"
---

# ISO/IEC 42001:2023 Test Playbook

Executable test cases for all 9 Annex A control families. Use these test cases during gap assessments, internal audits, and pre-certification readiness reviews. Each test case specifies objective, prerequisites, steps, pass criteria, and expected evidence.

**Related:** `iso-42001-assessor-playbook.md` (scoring rubric and interview guides), `iso-42001-implementation-guide.md` (gap closure steps)

---

## How to Use This Playbook

Execute test cases in family order. Each test case is self-contained. Mark each as:
- **PASS:** All pass criteria met, evidence collected
- **PARTIAL:** Some criteria met; specify which criteria failed
- **FAIL:** Pass criteria not met; document gap indicators observed

Total test cases: **34** across 9 Annex A families plus HLS clause coverage.

---

## Family A.2: Policies Related to AI

---

### A.2.2-TC-01: AI Policy Existence and Approval

**Control Reference:** A.2.2 — AI Policy
**Frequency:** Annual
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that a documented AI policy exists, is approved by top management, and is version-controlled.

**Prerequisites:**
- Access to organizational document management system

**Test Steps:**
1. Request the current AI policy document
2. Verify it is a standalone document (not embedded in a generic IT or data policy without AI-specific content)
3. Confirm top management approval: signed approval page, board minute, or equivalent dated record
4. Check version control: document has identifier, version number, and review date
5. Verify the policy scope covers development, purchase, operation, and use of AI systems (not only development)

**Pass Criteria:**
- Standalone AI policy document exists
- Top management approval with dated evidence
- Version-controlled with current version date within 24 months
- Scope explicitly covers development, purchase, operation, and use

**Expected Evidence:**
- AI policy document (PDF/Word with version history or audit trail)
- Approval record (signed page, email from top management, or board minute)

**Common Failures:**
- Generic "Technology Policy" or "Data Policy" claimed as AI policy without AI-specific governance content
- Policy exists but approval was delegated below top management (Clause 5.2 requires top management approval)
- Version date is 3+ years old with no evidence of review

---

### A.2.2-TC-02: AI Policy Content Completeness (B.2.2 Requirements)

**Control Reference:** A.2.2 — AI Policy (Annex B.2.2)
**Frequency:** Annual
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify the AI policy contains all elements required by Annex B.2.2: operational principles and a deviation/exception process.

**Prerequisites:**
- Approved AI policy document (from A.2.2-TC-01)
- Documentation of six B.2.2 informing inputs

**Test Steps:**
1. Review the AI policy for operational principles: are they specific enough to guide actual decisions, or aspirational statements only?
2. Test principle operationality: pick one principle and ask "how would this principle constrain or guide a specific AI development decision?" If unanswerable, principle is aspirational, not operational
3. Locate the deviation/exception process: confirm it specifies who can approve exceptions, how exceptions are documented, and time limits or review requirements
4. Request documentation of the six B.2.2 informing inputs: business strategy, risk appetite for AI, AI risk level, legal requirements, risk environment, and interested party impact assessments
5. Verify the policy addresses topic-specific areas where applicable per B.2.2: AI resources and assets, AI system impact assessments, and AI system development

**Pass Criteria:**
- Policy contains at least one operational principle per major AI activity type (development, procurement, deployment, use)
- Deviation/exception process present with: approval authority, documentation requirements, and review mechanism
- Documentation exists for all six B.2.2 informing inputs
- Topic-specific areas addressed or cross-referenced

**Expected Evidence:**
- AI policy (reviewed against B.2.2 element checklist)
- Six-input evidence pack (can be separate document or appendix)
- Exception register demonstrating process is operational

**Common Failures:**
- Principles read as values ("we respect human dignity") without operational constraints
- Exception process described but no register or tracking mechanism exists
- Six informing inputs not documented — policy appears to be a template with organization name substituted

---

### A.2.3-TC-01: Policy Alignment Analysis Coverage

**Control Reference:** A.2.3 — Alignment with Other Policies
**Frequency:** Annual + when AI policy or other major policies change
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that a documented thorough analysis was performed covering at minimum the four Annex B.2.3 domains (quality, security, safety, privacy), with intersections resolved.

**Prerequisites:**
- Policy alignment analysis documentation

**Test Steps:**
1. Request the policy alignment analysis documentation
2. Verify coverage of all four B.2.3 domains: quality management, information security, safety, and privacy
3. Verify bidirectional analysis: both (a) how AI objectives affect other policies and (b) how other policies apply to AI systems
4. For each identified intersection, verify a resolution is documented: either the existing policy was updated, provisions were added to the AI policy, or a documented decision that no action was required
5. Verify that governing body policies were reviewed as part of the analysis (B.2.3 Other information note)
6. Check for a process trigger that causes re-analysis when policies are updated

**Pass Criteria:**
- Documented analysis covering all four B.2.3 domains
- Bidirectional analysis performed
- Each intersection has a documented resolution
- Governing body policies included in analysis scope
- Re-analysis trigger established

**Expected Evidence:**
- Policy alignment analysis document (matrix or written analysis)
- Updated policies or AI policy provisions addressing intersections
- Governing body policy review record

**Common Failures:**
- Analysis covers security domain only (most common gap: quality and safety missed)
- Intersections listed with no resolution column (noting the intersection but taking no action)

---

### A.2.4-TC-01: AI Policy Review Execution

**Control Reference:** A.2.4 — Review of AI Policy
**Frequency:** Annual
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that AI policy reviews are conducted at planned intervals by a management-approved role, using management review results as an input, and assessing the four B.2.4 change categories.

**Prerequisites:**
- Management review records (Clause 9.3)
- AI policy review documentation

**Test Steps:**
1. Request documentation of the management-approved role responsible for AI policy review
2. Request the most recent AI policy review report
3. Verify the review explicitly references the most recent Clause 9.3 management review results
4. Verify the review assesses the four B.2.4 change categories: organizational environment, business circumstances, legal conditions, technical environment
5. Verify conclusions address suitability, adequacy, and effectiveness
6. Check whether significant changes (new AI regulation, major business change, technology shift) triggered ad-hoc reviews between scheduled reviews

**Pass Criteria:**
- Management-approved role documented for AI policy review
- Review report exists covering most recent scheduled review period
- Management review (9.3) results explicitly referenced in review report
- All four B.2.4 change categories assessed
- Suitability, adequacy, and effectiveness evaluated with documented conclusions

**Expected Evidence:**
- Management approval documentation for review role
- AI policy review report
- Cross-reference to management review records cited in the review report

**Common Failures:**
- Review report does not reference Clause 9.3 management review results — direct B.2.4 gap
- Review report templated with "no changes needed" conclusion with no assessment evidence
- EU AI Act enforcement (August 2026) constitutes a significant legal change; if recent AI policy review does not address it, this is a B.2.4 gap

---

## Family A.3: Internal Organization

---

### A.3.2-TC-01: AI Roles and Responsibilities Coverage

**Control Reference:** A.3.2 — AI Roles and Responsibilities
**Frequency:** Annual
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that all twelve Annex B.3.2 areas have defined and allocated roles with responsibilities documented to the level required for individuals to perform their duties.

**Prerequisites:**
- AI governance RACI matrix or role documentation
- Organizational chart

**Test Steps:**
1. Request the AI governance RACI matrix or role responsibility documentation
2. Map each of the twelve B.3.2 areas to a defined role: (1) risk management, (2) impact assessments, (3) asset and resource management, (4) security, (5) safety, (6) privacy, (7) development, (8) performance, (9) human oversight, (10) supplier relationships, (11) demonstrating legal compliance, (12) data quality management
3. For each area, verify the role has specific responsibilities documented (not just a title)
4. Verify each role is allocated to a named individual or position (not left as an unallocated role definition)
5. Interview two role holders: ask them to describe their specific AI governance responsibilities; compare to documentation
6. Verify role holders have organizational authority commensurate with their responsibilities

**Pass Criteria:**
- All twelve B.3.2 areas have defined roles
- Each role has specific responsibilities documented (not just title assignment)
- Each role is allocated to a named individual or position
- Interviewee descriptions match documentation
- Role holders can describe specific decision rights and authority

**Expected Evidence:**
- RACI matrix or role documentation covering all twelve B.3.2 areas
- Role descriptions with specific responsibilities
- Organizational chart with AI governance roles

**Common Failures:**
- Human oversight area unallocated (most common single gap in A.3.2)
- Data quality management assigned to "data team" without AI-specific responsibilities defined
- Role holders interviewed cannot describe their AI governance responsibilities — documentation not communicated

---

### A.3.4-TC-01: AI Governance Process Documentation

**Control Reference:** A.3.4 — AI System-Related Processes
**Frequency:** Annual
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that documented processes exist for core AI governance activities and that execution records demonstrate the processes are operational.

**Prerequisites:**
- Process documentation inventory

**Test Steps:**
1. Request process documentation for: AI risk assessment, AI impact assessment, AI system approval, AI change management, AI incident response
2. For each process, verify: purpose, scope, inputs, steps, roles, outputs, and retention requirements are documented
3. Request two execution records for each process to verify they are operational (not merely documented)
4. Check for consistency between process documentation and actual execution evidence

**Pass Criteria:**
- Process documentation exists for all core AI governance activities
- Each process document includes steps, roles, and required records
- Execution records demonstrate each process has been used

**Expected Evidence:**
- Process documentation for core AI governance activities
- Completed process records (completed checklists, approval records, assessment results)

---

## Family A.4: Resources for AI Systems

---

### A.4.2-TC-01: AI System Inventory Completeness

**Control Reference:** A.4.2 — AI System Inventory
**Frequency:** Annual
**Test Type:** Documentation Review + Technical Verification
**Assessor:** Advisor Agent + Security Agent

**Objective:** Verify that an AI system inventory exists, is maintained, and is reasonably complete, including AI features embedded in SaaS tools.

**Prerequisites:**
- AI system inventory
- IT asset management data
- Cloud spend analysis

**Test Steps:**
1. Request the current AI system inventory
2. Compare the inventory against: IT procurement records for the past 12 months (looking for AI purchases not in inventory), cloud spend (AWS Bedrock, Azure AI, Google Vertex AI, OpenAI API charges), and software license inventory
3. Conduct a survey of 3-5 department heads asking what AI tools their teams use; compare responses to inventory
4. Verify the inventory includes AI features in SaaS tools (CRM AI, productivity AI, HR AI)
5. Check that the inventory shows risk classification and lifecycle status for each system
6. Verify the inventory has a review date and last review was within 12 months

**Pass Criteria:**
- AI system inventory exists with a designated owner
- Inventory reconciles with IT procurement and cloud spend data (no material unexplained gaps)
- AI features in SaaS tools included or documented as excluded with justification
- Each system has risk classification and lifecycle status
- Inventory reviewed within the past 12 months

**Expected Evidence:**
- AI system inventory with review history
- Reconciliation records against IT procurement or cloud spend
- Department survey results (if conducted)

**Common Failures:**
- Cloud spend shows AI API charges for systems not in inventory
- Department survey reveals AI tools used without IT/governance knowledge
- Inventory last reviewed 18+ months ago with no interim updates for new AI deployments

---

## Family A.5: Assessing Impacts of AI Systems

---

### A.5.2-TC-01: Impact Assessment Process Existence and Quality

**Control Reference:** A.5.2 — AI Impact Assessment Process
**Frequency:** Annual
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that a documented AI impact assessment process and methodology exist before any AI systems are deployed.

**Prerequisites:**
- Impact assessment process documentation
- AI system inventory (to identify systems requiring assessment)

**Test Steps:**
1. Request the documented impact assessment process and methodology
2. Verify the methodology covers: individual rights impacts, safety impacts, economic and access impacts, societal impacts, and privacy impacts
3. Confirm the methodology includes: how impacts are identified, how severity is rated, how probability is assessed, what constitutes an "acceptable" vs. "unacceptable" impact
4. Verify the process requires assessment before deployment (not only reactive)
5. Verify the process requires stakeholder involvement beyond the AI development team

**Pass Criteria:**
- Process documentation exists and predates any current production AI system
- Methodology covers at minimum: rights, safety, economic, societal, and privacy impacts
- Impact rating methodology is defined with specific criteria (not generic "high/medium/low" without criteria)
- Pre-deployment trigger is embedded in the process
- Stakeholder requirements (including non-AI team involvement) specified

**Expected Evidence:**
- Process documentation with methodology
- Assessment templates
- Evidence that the process exists prior to any production AI system (documentation creation date)

---

### A.5.4-TC-01: Impact Assessment Execution Quality

**Control Reference:** A.5.4 — Conducting and Documenting AI Impact Assessments
**Frequency:** Annual
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that impact assessments are conducted in accordance with the process, with appropriate stakeholder involvement and substantive documentation.

**Prerequisites:**
- Completed impact assessment records for in-scope AI systems
- Impact assessment process documentation (from A.5.2-TC-01)

**Test Steps:**
1. Request impact assessment records for all AI systems rated high or critical risk in the inventory
2. For each assessment, verify: methodology was followed, all impact categories were assessed, stakeholders beyond the AI team were involved, findings are substantive (not all "low impact" without supporting analysis)
3. Verify assessment received review and approval from an appropriate role
4. Interview the assessment author about one finding: can they describe the analysis that led to the impact rating?
5. Check that assessments are dated and correspond to deployment or last reassessment date

**Pass Criteria:**
- Completed assessment records exist for all high-risk AI systems
- Assessments follow documented methodology
- Multiple stakeholder groups evidenced (internal and, for high-risk systems, external)
- Findings are differentiated and substantive (not uniform "low impact" across all categories)
- Review and approval documented for each assessment

**Expected Evidence:**
- Completed impact assessment records
- Evidence of stakeholder involvement (meeting records, email consultation, external reviewer engagement)
- Approval records

**Common Failures:**
- Assessment for high-risk customer-facing AI system has no external stakeholder involvement
- All risk categories rated "low" or "acceptable" with identical one-sentence justification

---

### A.5.5-TC-01: Impact Response Decision Documentation

**Control Reference:** A.5.5 — Responding to AI System Impacts
**Frequency:** Annual + when new assessments complete
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that all identified AI impacts have documented response decisions (mitigate, monitor, accept with rationale, or discontinue) with assigned owners.

**Prerequisites:**
- Completed impact assessment records
- Impact response decision documentation

**Test Steps:**
1. Review impact assessment records for all significant identified impacts
2. For each significant impact, verify a response decision is documented: mitigate (with specific measures), monitor (with defined thresholds), accept (with explicit risk acceptance rationale), or discontinue
3. Verify acceptance decisions are made by an appropriate authority (not self-approved by the AI team)
4. Verify mitigation measures have assigned owners and implementation timelines
5. Request evidence that mitigation measures have been implemented

**Pass Criteria:**
- Every significant impact has a documented response decision
- Acceptance decisions have explicit rationale and appropriate approval authority
- Mitigation measures have owners, timelines, and implementation evidence
- No impacts left with no decision documented

**Expected Evidence:**
- Impact response decision records (can be part of impact assessment documentation)
- Mitigation implementation records
- Risk acceptance approvals

---

## Family A.6: AI System Life Cycle

---

### A.6.1.3-TC-01: AI Development Process Responsible AI Integration

**Control Reference:** A.6.1.3 — AI System Development Processes
**Frequency:** Annual
**Test Type:** Documentation Review + Technical Interview
**Assessor:** Security Agent

**Objective:** Verify that the AI development lifecycle includes documented responsible AI checkpoints at each stage, including bias testing and model validation criteria.

**Prerequisites:**
- AI development lifecycle documentation
- Sample development records for a recently developed AI system

**Test Steps:**
1. Request the AI development lifecycle documentation
2. Verify defined stages include: problem framing, data preparation, model training, model evaluation, testing, deployment review
3. At each stage, verify responsible AI checkpoints are documented (not generic software quality gates): bias testing criteria, fairness metrics, explainability requirements, safety testing requirements
4. Request development records for one recently developed AI system; trace through each lifecycle stage and verify checkpoints were executed with results documented
5. Verify bias testing includes a defined dataset, methodology, protected characteristics assessed, and acceptance thresholds

**Pass Criteria:**
- Lifecycle documentation includes all development stages
- Responsible AI checkpoints defined at each stage (not generic)
- Bias testing includes: dataset, methodology, protected characteristics, and acceptance thresholds
- Sample development records demonstrate checkpoints were executed with results documented

**Expected Evidence:**
- AI development lifecycle documentation with stage-gate criteria
- Responsible AI checkpoint documentation per stage
- Sample development records with checkpoint results

**Common Failures:**
- Lifecycle documented but bias testing stage contains generic placeholder ("conduct bias assessment" with no methodology)
- Test records show functional testing passed but no bias or fairness test results

---

### A.6.2.3-TC-01: Deployment Gate Effectiveness

**Control Reference:** A.6.2.3 — Deployment
**Frequency:** Annual
**Test Type:** Documentation Review + Process Walk-Through
**Assessor:** Security Agent

**Objective:** Verify that documented deployment readiness criteria exist and are enforced before any AI system reaches production.

**Prerequisites:**
- Deployment readiness checklist and process documentation
- Deployment approval records for recent AI deployments

**Test Steps:**
1. Request the deployment readiness checklist and approval process documentation
2. Verify the checklist includes: completed testing (functional, bias, adversarial), completed impact assessment with response decisions, risk acceptance documentation, monitoring configuration, and documentation completeness
3. Request deployment approval records for the last three AI system deployments
4. Verify each deployment has a completed checklist and documented approver (different from developer)
5. Check whether impact assessment completion is a hard gate (cannot deploy without it) or an advisory item

**Pass Criteria:**
- Deployment readiness checklist exists with all required elements
- Last three AI system deployments have completed checklist and approval records
- Approver is independent of the development team
- Impact assessment completion is a hard gate (not advisory)

**Expected Evidence:**
- Deployment readiness checklist
- Completed deployment approval records

**Common Failures:**
- Checklist exists but approval records show it was partially completed and deployment proceeded anyway
- Developer and approver are the same person (no independence)

---

### A.6.2.4-TC-01: AI Operational Monitoring Coverage

**Control Reference:** A.6.2.4 — Operation
**Frequency:** Annual
**Test Type:** Technical Documentation Review
**Assessor:** Security Agent

**Objective:** Verify that operational monitoring covers AI-specific metrics (model performance, fairness, drift) in addition to system health, with configured alerting.

**Prerequisites:**
- Monitoring configuration documentation
- Sample monitoring reports or dashboard screenshots

**Test Steps:**
1. Request monitoring configuration documentation or dashboard screenshots for production AI systems
2. Verify monitoring covers: system health (uptime, latency), model performance (accuracy, precision, recall), fairness metrics (where applicable), and business outcomes
3. Verify alerting thresholds are configured for model drift and performance degradation
4. Request the most recent monitoring report and verify anomalies are documented and addressed
5. Verify a process exists for responding to monitoring alerts (runbook or escalation procedure)

**Pass Criteria:**
- Monitoring covers system health AND model performance AND business outcomes
- Model drift detection is implemented with defined thresholds
- Alerting configured with documented response procedures
- Recent monitoring report shows active use of monitoring data

**Expected Evidence:**
- Monitoring configuration documentation or screenshots
- Sample monitoring reports
- Alert configuration records
- AI operational runbook

**Common Failures:**
- Monitoring configured for uptime/latency only; model performance not tracked
- Drift detection configured but threshold for action not defined

---

## Family A.7: Data for AI Systems

---

### A.7.2-TC-01: Training Data Legal Basis Verification

**Control Reference:** A.7.2 — Data Acquisition and Collection
**Frequency:** Annual
**Test Type:** Documentation Review + Legal Review
**Assessor:** Advisor Agent

**Objective:** Verify that the legal basis for acquiring and using each training dataset is documented, particularly for datasets containing personal data.

**Prerequisites:**
- Data acquisition register
- List of training datasets for in-scope AI systems

**Test Steps:**
1. Request the data acquisition register covering all training datasets
2. For each dataset, verify documented legal basis: contract/license, consent, legitimate interest, publicly available with documented scope, or statutory basis
3. For datasets containing personal data, verify: GDPR legal basis (Article 6 basis, Article 9 basis if special category), data minimization assessment, and retention period
4. For web-scraped or publicly available datasets, verify license or terms-of-use review was conducted
5. Sample: request documentation for the three largest training datasets and trace legal basis

**Pass Criteria:**
- Data acquisition register exists and covers all training datasets
- Legal basis documented for every dataset (no undocumented datasets)
- Personal data datasets have specific GDPR legal basis documented
- Public/scraped datasets have license/terms review records

**Expected Evidence:**
- Data acquisition register with legal basis entries
- License agreements for licensed datasets
- Legal basis assessment documents for personal data datasets

**Common Failures:**
- "Publicly available" stated as legal basis without analysis of whether public availability establishes the legal basis for AI training use
- Dataset acquired 2+ years ago; no documentation survives; organization cannot establish legal basis

---

### A.7.3-TC-01: Data Quality Standards and Measurement

**Control Reference:** A.7.3 — Data Quality
**Frequency:** Annual + before major model retraining
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that data quality standards are defined and applied with measurable criteria, and that quality assessments are conducted and documented.

**Prerequisites:**
- Data quality standards documentation
- Quality assessment records for training datasets

**Test Steps:**
1. Request data quality standards documentation for AI training data
2. Verify standards define specific quality dimensions: accuracy, completeness, representativeness, timeliness, consistency, labeling quality
3. Verify measurement methodology is defined (not just dimensions named but unmeasured)
4. Request data quality assessment records for the primary training dataset
5. Verify known quality issues are documented with decisions about how they were addressed
6. Verify representativeness is specifically assessed — not just accuracy — including demographic or contextual coverage gaps

**Pass Criteria:**
- Data quality standards defined with measurable criteria per dimension
- Quality measurement methodology established
- Assessment records exist for primary training datasets
- Representativeness explicitly assessed including coverage of relevant subgroups
- Quality issues documented with resolution decisions

**Expected Evidence:**
- Data quality standards documentation
- Quality assessment records with measurement results
- Quality issue log and resolution records

---

### A.7.4-TC-01: Data Lineage Documentation

**Control Reference:** A.7.4 — Data Provenance and Attributes
**Frequency:** Annual
**Test Type:** Documentation Review + Technical Interview
**Assessor:** Security Agent

**Objective:** Verify that data lineage documentation traces from original data source to final training dataset, including all transformation steps.

**Prerequisites:**
- Data lineage documentation for primary AI system training dataset

**Test Steps:**
1. Request data lineage documentation for the primary training dataset
2. Trace from: original source → acquisition → transformation steps (cleaning, labeling, augmentation) → final training set
3. Verify each transformation step is documented with methodology and rationale
4. Verify known data attributes (demographic representation, temporal scope, geographic scope, known biases) are documented
5. Test: ask the engineering team to trace a specific model behavior back to the training data; can they do it with the documentation?
6. Verify lineage is documented in accessible form (not only in code notebooks)

**Pass Criteria:**
- Complete lineage from source to training set documented
- Each transformation step documented with methodology
- Data attributes including representativeness documented
- Documentation accessible to non-engineers (auditors, compliance team)

**Expected Evidence:**
- Data lineage documentation (structured document, not notebook metadata)
- Dataset attribute documentation

**Common Failures:**
- Lineage exists in Git commit history and notebook cells — not accessible as documentation
- Transformation steps partially documented but labeling/annotation process undocumented

---

## Family A.8: Information for Interested Parties

---

### A.8.2-TC-01: User Documentation Coverage and Limitations Disclosure

**Control Reference:** A.8.2 — Information for Users
**Frequency:** Annual
**Test Type:** Documentation Review + User Experience Review
**Assessor:** Advisor Agent

**Objective:** Verify that user-facing documentation covers AI system capabilities, limitations, and appropriate use guidance, and is accessible at the point of AI use.

**Prerequisites:**
- User documentation for each in-scope AI system
- Access to AI system UI

**Test Steps:**
1. Review user documentation for the primary AI system
2. Verify documentation covers: intended purpose, capabilities, known limitations, appropriate use guidance, and escalation guidance (when to not rely on AI output alone)
3. Assess limitations disclosure: is it specific to the AI system's actual limitations, or generic? Does it note performance variation across different inputs or user populations?
4. Verify documentation is accessible from within the product (not only in a separate external help center)
5. Ask a non-technical user to read the limitations section and describe what they learned — intelligibility test

**Pass Criteria:**
- Documentation covers all five required elements
- Limitations disclosure is specific and substantive (not generic "AI can make mistakes")
- Documentation accessible from within the AI product
- Intelligible to non-technical users

**Expected Evidence:**
- User documentation (screenshots and PDF/link)
- Evidence of in-product accessibility (UI screenshot showing documentation link)

**Common Failures:**
- Limitations section is one sentence: "Results may vary; always verify with a qualified professional"
- Documentation linked from FAQ page but not surfaced during AI interaction

---

### A.8.3-TC-01: AI Interaction Disclosure

**Control Reference:** A.8.3 — User Notification of AI Interaction
**Frequency:** Annual
**Test Type:** User Experience Review
**Assessor:** Advisor Agent

**Objective:** Verify that users are notified they are interacting with AI at the point of interaction, where this is not otherwise obvious.

**Prerequisites:**
- Access to AI system interface

**Test Steps:**
1. Access the AI system as a new user with no prior knowledge
2. Assess whether it is immediately obvious the system involves AI: assess the user interface, onboarding, and initial interaction
3. If not immediately obvious, verify disclosure is presented before or at the point of first AI interaction (not buried in terms of service)
4. For AI-generated content (written content, images, recommendations), verify labeling or disclosure of AI origin
5. Review EU AI Act Article 50 applicability: does the system involve a chatbot, emotion recognition, or deep synthesis that requires specific disclosure?

**Pass Criteria:**
- AI nature clearly disclosed at or before point of interaction (not in terms of service alone)
- For AI-generated content, clear labeling present
- Disclosure is prominent (not in 8pt gray text at bottom of screen)

**Expected Evidence:**
- Screenshots of AI disclosure notifications in user interface
- Documentation of disclosure approach

**Common Failures:**
- Chatbot presented as "Virtual Assistant" with human-like avatar and no AI disclosure
- AI-generated content delivered with no indication of AI origin

---

### A.8.4-TC-01: Explanation Process Operationalization

**Control Reference:** A.8.4 — Explanation of AI Decisions
**Frequency:** Annual
**Test Type:** Process Test
**Assessor:** Advisor Agent

**Objective:** Verify that a process exists for individuals to request explanations of AI-driven decisions affecting them, and that the process is operational (not merely documented).

**Prerequisites:**
- Explanation request process documentation
- Access to the intake mechanism

**Test Steps:**
1. Request the explanation request process documentation
2. Verify the process covers: how to submit a request, who handles it, response timeline, explanation format, and escalation for complex cases
3. Test the intake mechanism: submit a test explanation request through the documented channel
4. Verify the explanation format is intelligible to non-technical individuals (not raw SHAP values)
5. Request records of any actual explanation requests received and how they were handled
6. Verify the scope of decisions for which explanations are provided is documented

**Pass Criteria:**
- Process documentation covers all required elements
- Intake mechanism exists and functions when tested
- Response timeline defined and reasonable (GDPR suggests one month for similar requests)
- Explanation format is intelligible to affected individuals
- Records exist of actual requests handled (or documented confirmation the process has been communicated)

**Expected Evidence:**
- Process documentation
- Test request submission record
- Sample explanation format or example explanation
- Records of actual requests handled

**Common Failures:**
- Process documented but intake mechanism is a generic "contact us" form with no specific path
- Explanation consists of raw SHAP values — not intelligible to non-technical individuals
- Process never tested; first real request reveals broken workflow

---

## Family A.9: Use of AI Systems

---

### A.9.2-TC-01: Responsible Use Policy Communication and Enforcement

**Control Reference:** A.9.2 — Responsible Use of AI Systems
**Frequency:** Annual
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that a responsible use policy for AI exists, has been communicated to all relevant personnel, and that human oversight requirements are operationally enforced for consequential AI decisions.

**Prerequisites:**
- Responsible use policy
- Human oversight workflow documentation

**Test Steps:**
1. Request the responsible use policy
2. Verify it covers: permitted uses, prohibited uses, human oversight requirements for consequential decisions, data input restrictions, and incident reporting
3. Request communication records showing the policy was distributed to all relevant personnel
4. Interview 3 employees who use AI systems: can they describe the responsible use policy without prompting? Key test: do they know when human review is required before acting on AI output?
5. For a consequential AI decision workflow, verify that human oversight is enforced by the workflow (cannot proceed without review), not merely required by policy

**Pass Criteria:**
- Policy covers all required elements
- Communication records demonstrate distribution to relevant personnel
- Employees interviewed can describe the policy and human oversight requirements
- Human oversight for consequential decisions is workflow-enforced (not policy-only)

**Expected Evidence:**
- Responsible use policy document
- Communication records (email distribution, training completion, acknowledgment records)
- Workflow documentation showing human review enforcement

**Common Failures:**
- Employees interviewed unaware of the responsible use policy
- Human oversight required by policy but consequential AI decisions can be acted upon without completing the review step

---

### A.9.3-TC-01: AI Literacy Program Effectiveness

**Control Reference:** A.9.3 — AI Information Literacy of Users
**Frequency:** Annual
**Test Type:** Training Review + User Interview
**Assessor:** Advisor Agent

**Objective:** Verify that AI literacy training is provided to users and that training develops practical capability to critically evaluate AI outputs.

**Prerequisites:**
- AI literacy training curriculum
- Training completion records

**Test Steps:**
1. Request AI literacy training curriculum
2. Verify curriculum covers: what AI systems do and don't do, how to critically evaluate AI outputs, when to seek human review, how to report concerns
3. Request training completion records; verify coverage of relevant user population
4. Interview 3 users who have completed AI literacy training: present a plausible but incorrect AI output and ask how they would evaluate it. Assess whether they apply critical evaluation skills.
5. Check training currency: was training updated when AI systems changed materially?

**Pass Criteria:**
- Training curriculum covers critical evaluation, not just feature usage
- Completion records show relevant population trained
- Interviewed users demonstrate practical critical evaluation skills
- Training curriculum updated when AI systems changed materially

**Expected Evidence:**
- Training curriculum documentation
- Training completion records
- Training update records

---

### A.9.4-TC-01: Out-of-Scope Use Detection and Response

**Control Reference:** A.9.4 — Out-of-Scope Use
**Frequency:** Annual
**Test Type:** Documentation Review + Technical Review
**Assessor:** Security Agent

**Objective:** Verify that out-of-scope use is monitored and that a response process exists for identified out-of-scope use patterns.

**Prerequisites:**
- AI system scope definitions
- Out-of-scope use monitoring configuration and records

**Test Steps:**
1. Request AI system scope definitions for primary AI systems
2. Request out-of-scope use monitoring configuration: what is monitored, how is out-of-scope use detected, what thresholds trigger review?
3. Request monitoring records from the past 12 months: were any out-of-scope use patterns identified?
4. For any identified out-of-scope use patterns, verify a documented response (guardrails implemented, user communication, policy update, or escalation)
5. If no out-of-scope use detected, assess monitoring coverage: is it plausible that no out-of-scope use occurred, or is monitoring insufficient?

**Pass Criteria:**
- Scope definitions exist for each AI system
- Monitoring is implemented with defined detection approach
- Any detected out-of-scope use has a documented response
- Monitoring coverage is plausible (not evidently insufficient)

**Expected Evidence:**
- AI system scope definitions
- Out-of-scope use monitoring configuration
- Monitoring records and any identified pattern responses

---

## Family A.10: Third-Party and Customer Relationships

---

### A.10.2-TC-01: AI Supplier Assessment Quality

**Control Reference:** A.10.2 — Suppliers of AI Resources
**Frequency:** Annual
**Test Type:** Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that AI suppliers are assessed using AI-specific due diligence criteria and that assessment results influence procurement decisions.

**Prerequisites:**
- AI supplier register
- Supplier assessment questionnaire and completed assessments

**Test Steps:**
1. Request the AI supplier register; identify all AI suppliers including: AI model providers, AI API vendors, AI dataset providers, AI platform providers
2. Request the AI-specific supplier assessment questionnaire
3. Verify the questionnaire covers AI-specific areas: model documentation, data practices, bias assessment evidence, security practices, incident response capability, EU AI Act status
4. Request completed assessments for the three highest-risk AI suppliers
5. Verify assessment results are documented and dated
6. Verify assessment results were available and considered before contract was signed

**Pass Criteria:**
- AI supplier register includes all AI suppliers (major AI model providers included)
- AI-specific questionnaire used (not only generic IT/security questionnaire)
- Completed assessments for top AI suppliers
- Assessment predates contract execution (not conducted after-the-fact)

**Expected Evidence:**
- AI supplier register
- AI-specific supplier assessment questionnaire
- Completed supplier assessment records with dates

**Common Failures:**
- Major foundation model providers (OpenAI, Anthropic, Google) excluded from assessment because "they're too large to assess"
- Assessment questionnaire is generic IT security questionnaire with no AI-specific questions

---

### A.10.2-TC-02: AI Supplier Contract Provisions

**Control Reference:** A.10.2 — Suppliers of AI Resources
**Frequency:** Annual
**Test Type:** Contract Review
**Assessor:** Advisor Agent

**Objective:** Verify that AI supplier contracts include AI-specific provisions covering model documentation, data processing, incident notification, and audit rights.

**Prerequisites:**
- Contracts with primary AI suppliers

**Test Steps:**
1. Request contracts with the three highest-risk AI suppliers
2. Review for AI-specific provisions: model documentation provision obligation, data processing terms (what data is shared, how it is used, training use restrictions), incident notification (AI-specific incidents, timelines), audit rights, and alignment commitments
3. Verify data processing terms address AI training data use — explicit opt-out or prohibition if the supplier cannot use customer data for model training
4. Verify incident notification timelines are defined (not just "we will notify you")

**Pass Criteria:**
- Contracts with primary AI suppliers include AI-specific provisions (not generic data processing terms only)
- Training data use explicitly addressed (permission or prohibition)
- Incident notification timelines defined
- Audit rights established

**Expected Evidence:**
- AI supplier contracts with AI-specific provisions highlighted

---

### A.10.3-TC-01: Customer AI Disclosure

**Control Reference:** A.10.3 — Customers and AI Systems
**Frequency:** Annual
**Test Type:** Documentation and Contract Review
**Assessor:** Advisor Agent

**Objective:** Verify that customers are informed of AI use in products/services, that AI-specific data processing terms are in place, and that customers can exercise AI-related rights.

**Prerequisites:**
- Customer-facing documentation
- Customer contracts or terms of service

**Test Steps:**
1. Review marketing materials, product documentation, and terms of service for AI disclosure
2. Verify AI use is disclosed with specificity: which features are AI-powered, what data is processed by AI, and what AI outputs influence
3. Request customer contract template; verify AI-specific data processing terms are present
4. Verify customer rights process: can customers opt out of AI processing where required? Can they request AI decision explanations?
5. Request records of customer rights requests received and handled

**Pass Criteria:**
- AI use disclosed in customer-facing materials with substantive specificity
- Customer contracts include AI-specific data processing terms
- Customer rights process documented and operational
- Customer rights requests have documented responses where applicable

**Expected Evidence:**
- Customer-facing AI disclosure documentation
- Customer contract with AI-specific terms highlighted
- Customer rights process documentation
- Sample customer rights request responses

---

### A.10.4-TC-01: End-User Rights Assessment

**Control Reference:** A.10.4 — End Users of AI
**Frequency:** Annual
**Test Type:** Documentation Review + Process Review
**Assessor:** Advisor Agent

**Objective:** Verify that individuals affected by AI decisions who are not direct customers have been identified, their applicable rights assessed, and processes established to honor those rights.

**Prerequisites:**
- End-user stakeholder identification documentation
- End-user rights process documentation

**Test Steps:**
1. Request documentation identifying categories of individuals affected by AI decisions who are not direct customers
2. Verify a rights assessment was conducted for each category: what rights apply (explanation, human review, non-discrimination, GDPR Article 22)?
3. Verify a process exists for end users to submit inquiries or rights requests
4. For AI systems making automated decisions with significant individual effects, verify human review capability exists
5. Request records of any end-user rights requests received

**Pass Criteria:**
- End users identified as a distinct stakeholder group from customers
- Rights assessment conducted and documented for each end-user category
- Inquiry and rights request process accessible to end users (not only customers)
- Human review capability exists for automated decisions with significant individual effects

**Expected Evidence:**
- End-user stakeholder identification and rights assessment documentation
- End-user inquiry process documentation
- Human review process documentation
- Sample end-user rights request records

**Common Failures:**
- End users and customers conflated — only direct customers considered
- GDPR Article 22 automated decision-making rights not assessed despite AI making credit, employment, or access decisions

---

## Additional Test Cases: HLS Clause Coverage

---

### A.3.3-TC-01: AI Reporting Framework Operationalization

**Control Reference:** A.3.3 — Reporting
**Frequency:** Annual
**Test Type:** Documentation Review + Interview
**Assessor:** Advisor Agent

**Objective:** Verify that AI reporting processes are defined and operational, with evidence that AI risk and performance information reaches executive level and regulatory obligations are identified.

**Prerequisites:**
- Reporting framework documentation
- Sample executive-level AI reports

**Test Steps:**
1. Request the AI reporting framework documentation
2. Verify upward reporting: does a defined mechanism exist for AI risks and incidents to reach executive leadership and the governing body?
3. Request the most recent executive-level AI risk or performance report — verify it exists and contains substantive AI-specific content
4. Verify regulatory reporting obligations have been identified: EU AI Act incident reporting (Article 73), GDPR breach notification for AI systems processing personal data, sector-specific AI reporting requirements
5. Request records of any regulatory reporting that has occurred

**Pass Criteria:**
- Reporting framework documented with defined channels, frequencies, and owners
- Executive-level AI report produced within the last 12 months with substantive AI content
- Regulatory reporting obligations identified and documented
- Escalation path for AI incidents defined and tested

**Expected Evidence:**
- Reporting framework documentation
- Sample executive AI report
- Regulatory reporting obligation inventory
- Incident escalation procedure

**Common Failures:**
- Reporting framework documented but no reports have been produced
- AI risks reported to IT team only; never escalated to executive or board level
- EU AI Act Article 73 incident reporting obligations not assessed despite AI systems potentially qualifying as high-risk

---

### A.4.5-TC-01: AI Governance Resource Adequacy Assessment

**Control Reference:** A.4.5 — Resources for AI System Development and Operation
**Frequency:** Annual
**Test Type:** Interview + Documentation Review
**Assessor:** Advisor Agent

**Objective:** Verify that adequate human, technological, and financial resources have been assessed and provided for responsible AI development and governance.

**Prerequisites:**
- Resource allocation documentation
- AI governance budget records

**Test Steps:**
1. Interview the AI Governance Lead: what resources (people, budget, technology) are allocated to AI governance activities?
2. Verify AI governance staffing: are there named individuals with AI governance as a primary or significant responsibility, or is AI governance purely ad hoc?
3. Request budget evidence for AI governance activities: training, external assessments, tooling, consultants
4. Assess adequacy relative to AIMS scope: does the organization have enough AI governance capacity to address the number and risk level of in-scope AI systems?
5. Verify that identified resource gaps are documented and have remediation plans

**Pass Criteria:**
- AI governance staffing identified with named roles and time allocation
- Budget allocated for AI governance activities (not $0)
- Tooling assessment conducted (monitoring, data governance, impact assessment tools)
- Resource gaps documented with remediation plans where gaps exist

**Expected Evidence:**
- AI governance staffing records
- AI governance budget allocation
- Tooling assessment documentation
- Resource gap analysis and remediation plan

**Common Failures:**
- AI governance entirely dependent on one person with no backup
- No budget for AI governance — relying entirely on free tools and internal time
- AI governance team size unchanged as AI portfolio grows materially

---

### A.6.2.2-TC-01: AI Procurement Due Diligence Process

**Control Reference:** A.6.2.2 — Procurement
**Frequency:** Annual
**Test Type:** Documentation Review + Process Walk-Through
**Assessor:** Advisor Agent

**Objective:** Verify that AI-specific due diligence is conducted for AI procurement decisions and that the process is consistently applied before procurement is finalized.

**Prerequisites:**
- AI supplier assessment questionnaire
- Completed procurement records for recent AI acquisitions

**Test Steps:**
1. Request the AI supplier assessment process documentation
2. Verify the process is triggered before procurement completion (not post-hoc)
3. Request procurement records for the last three AI tool or AI system acquisitions
4. For each acquisition, verify: was the AI supplier assessment questionnaire used? Was it completed before the procurement decision? Were results reviewed by someone other than the requester?
5. Verify the assessment covers AI-specific criteria: model documentation, bias assessment evidence, data practices, AI incident response capability
6. Check for any AI acquisitions where the process was bypassed (e.g., "small AI tool" or "trial" exceptions that became permanent without full assessment)

**Pass Criteria:**
- AI supplier assessment process documented and consistently applied
- Last three AI acquisitions have completed assessment records predating procurement decision
- Assessment covers AI-specific criteria (not generic IT security questionnaire only)
- No material AI acquisitions without completed assessment in past 12 months

**Expected Evidence:**
- AI supplier assessment questionnaire
- Completed assessment records for recent acquisitions
- Procurement approval records showing assessment completion before sign-off

**Common Failures:**
- Process applies to "major AI platforms" but not to AI APIs, AI features in SaaS, or AI plugins — resulting in ungoverned AI adoption
- Assessment template is generic; AI-specific criteria added as a single question: "Is this an AI system? Y/N"

---

### A.7.5-TC-01: Data Preparation Controls and Annotation Quality

**Control Reference:** A.7.5 — Data Preparation
**Frequency:** Annual + before major model retraining
**Test Type:** Documentation Review + Technical Interview
**Assessor:** Security Agent

**Objective:** Verify that data preparation processes are documented, annotation quality is controlled, and train/test splitting methodology prevents data leakage.

**Prerequisites:**
- Data preparation procedure documentation
- Annotation guidelines (if applicable)
- Train/test split documentation

**Test Steps:**
1. Request data preparation procedure documentation for the primary AI system
2. Verify documented procedures cover: cleaning rules and criteria, labeling/annotation guidelines, augmentation methods, and splitting methodology
3. For labeled/annotated data: request inter-annotator agreement (IAA) measurement records; verify IAA was measured and met minimum threshold
4. For outsourced annotation: request quality control sampling methodology and results
5. Verify splitting methodology documents: split ratios, stratification approach, and prevention of data leakage between train and test sets
6. Test data leakage prevention: can the team demonstrate that test set samples do not appear in the training set?

**Pass Criteria:**
- Data preparation procedures documented for all primary AI systems
- Annotation guidelines exist and are specific enough to produce consistent labels
- IAA measured for labeled data with threshold defined and met
- Splitting methodology documented with data leakage prevention demonstrated
- Outsourced annotation has documented quality control

**Expected Evidence:**
- Data preparation procedure documentation
- Annotation guidelines
- IAA measurement records
- Train/test split documentation
- Quality control records for outsourced annotation

**Common Failures:**
- Annotation guidelines in team wiki or GitHub README; not controlled documentation
- IAA never measured for labeled data; consistency assumed but not verified
- Train/test split methodology documented but no demonstration that leakage was prevented (especially for time-series data where temporal leakage is common)
