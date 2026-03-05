---
type: reference
name: iso-42001-implementation-guide
category: compliance
classification: public
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42001:2023"
---

# ISO/IEC 42001:2023 Implementation Guide

Per-control gap closure steps for all 38 Annex A controls. Use this guide after completing a gap assessment to close identified deficiencies. Each control entry provides: the requirement, gap indicators, implementation steps, evidence to collect, and common pitfalls.

**Related:** `iso-42001-handbook.md` (narrative overview), `iso-42001-assessor-playbook.md` (assessment methodology)

---

## Family A.2: Policies Related to AI

---

## A.2.2: AI Policy

**Requirement:** The organization shall document a policy for the development or use of AI systems. Per Annex B.2.2, the policy must be informed by six specific inputs and must contain operational AI principles and a deviation/exception process.

**Gap indicators:**
- No formal AI policy document exists
- AI policy not approved by top management
- Policy exists but contains only aspirational statements, no operational principles
- No deviation or exception process documented in the policy
- Policy scope covers only development, not purchase or use of AI
- Policy not communicated to relevant personnel

**Implementation steps:**
1. Gather the six Annex B.2.2 informing inputs: (a) business strategy, (b) organizational values and risk appetite for AI, (c) level of AI risk in scope, (d) legal requirements including contracts, (e) risk environment, and (f) interested party impact assessments (per Clause 6.1.4)
2. Draft AI policy content including: stated purpose and scope covering development, purchase, operation, and use; operational principles guiding AI decisions (specific enough to constrain actual choices); accountability structure; and a documented deviation/exception process specifying who approves exceptions, how they are documented, and time limits
3. Obtain top management approval with dated signature or board minute
4. Communicate the policy to all personnel involved in AI activities; make it available to interested parties as appropriate
5. Assign a document identifier, version number, review date, and owner per Clause 7.5 document control
6. Integrate policy requirements into AI-related operational processes (procurement, development initiation, deployment approval)

**Evidence to collect:**
- Signed AI policy document with version history
- Documentation of the six B.2.2 informing inputs reviewed before drafting
- Distribution records (email, intranet posting, training acknowledgments)
- Deviation/exception register demonstrating the process is operational
- Policy review schedule and completed review records

**Common pitfalls:**
- Policy developed without reference to the six B.2.2 inputs (template copy-paste)
- Deviation process specified in policy but no mechanism to actually log exceptions
- Policy scope limited to internal AI development, excludes third-party AI systems in use
- Principles too generic to apply to real decisions ("we respect human dignity")

---

## A.2.3: Alignment with Other Organizational Policies

**Requirement:** The organization shall determine where other policies can be affected by or apply to the organization's objectives with respect to AI systems. Annex B.2.3 requires a thorough analysis covering at minimum quality, security, safety, and privacy domains.

**Gap indicators:**
- No documented alignment analysis performed
- Analysis covers only some domains (e.g., security but not quality or privacy)
- Intersections identified but no resolution actions taken
- AI policy conflicts with existing organizational policies (e.g., privacy policy)
- Governing body policies not included in the analysis scope

**Implementation steps:**
1. Create an inventory of all existing organizational policies
2. Conduct a bidirectional analysis for each policy: (a) how AI objectives affect the other policy's requirements, and (b) how the other policy's requirements apply to AI activities
3. Pay specific attention to the four Annex B.2.3 domains: quality, security, safety, and privacy
4. For each identified intersection, choose a resolution path: update the existing policy, add provisions to the AI policy, or both; document the rationale
5. Include governing body policies (board-level AI governance directives, ISO/IEC 38507 considerations) in the analysis scope
6. Resolve any conflicts between the AI policy and other policies with documented precedence rules
7. Establish a trigger to re-run the alignment analysis when the AI policy or any intersecting policy is significantly updated

**Evidence to collect:**
- Policy alignment analysis documentation (matrix or equivalent)
- Updated policy versions or AI policy provisions addressing identified intersections
- Governing body policy review record
- Resolution decisions for each identified intersection

**Common pitfalls:**
- Analysis performed once without ongoing review trigger
- Analysis limited to obvious domains; quality management policies commonly missed
- Governing body policies (board-level AI ethics directives) excluded
- Conflict identified but resolved by silence (no documented precedence)

---

## A.2.4: Review of the AI Policy

**Requirement:** The AI policy shall be reviewed at planned intervals or additionally as needed to ensure its continuing suitability, adequacy, and effectiveness. A management-approved role must be responsible for the review.

**Gap indicators:**
- No management-approved role assigned for AI policy review
- No scheduled review intervals documented
- Reviews conducted without referencing management review (Clause 9.3) results
- Reviews do not assess the four B.2.4 change categories
- No ad-hoc review triggered when major changes occurred (new regulation, business acquisition, technology shift)

**Implementation steps:**
1. Obtain management approval for the role responsible for AI policy review; document the assignment formally
2. Establish a review schedule (minimum annual) and document it; define ad-hoc triggers covering: organizational environment changes, business circumstance changes, legal condition changes (new AI regulation), and technical environment changes
3. Establish a review process that explicitly: inputs the most recent Clause 9.3 management review results; assesses suitability, adequacy, and effectiveness against the four change categories; and produces a review report
4. Update the policy where reviews identify suitability, adequacy, or effectiveness gaps; follow document control per Clause 7.5
5. Retain review reports as records demonstrating review execution and substance

**Evidence to collect:**
- Documentation of management-approved review role assignment
- Review schedule (calendar or governance framework)
- Completed review reports referencing management review inputs
- Policy version history showing updates from reviews
- Ad-hoc review records for triggered reviews

**Common pitfalls:**
- Review role assigned but management approval not documented
- Reviews conducted but management review (9.3) results not referenced — direct B.2.4 gap
- Review report concludes "no changes needed" year after year without documented assessment
- No trigger mechanism for ad-hoc reviews between scheduled cycles

---

## A.2.5: Topic-Specific AI Policies

**Requirement:** The organization shall establish topic-specific policies that provide more detailed requirements within specific areas of AI governance, and communicate these to relevant personnel.

**Gap indicators:**
- AI policy covers all areas at high level with no supporting topic-specific policies
- Specific AI domains (AI procurement, AI incident response, model lifecycle) have no dedicated policy
- Topic-specific policies exist but are not communicated to the personnel who need them
- Topic-specific policies inconsistent with the overarching AI policy

**Implementation steps:**
1. Identify AI governance domains that require topic-specific policy depth beyond the overarching AI policy; common candidates: AI procurement and vendor management, AI model lifecycle (development, validation, deprecation), AI incident response, AI ethics review, AI data governance
2. Draft topic-specific policies for each identified domain, ensuring consistency with the overarching AI policy (A.2.2)
3. Obtain appropriate approvals for each topic-specific policy (may be delegated below top management for subsidiary policies)
4. Communicate topic-specific policies to the personnel whose activities they govern
5. Maintain topic-specific policies under document control with review cycles aligned to the overarching AI policy review

**Evidence to collect:**
- Inventory of topic-specific AI policies with domain coverage
- Policy documents for each identified domain
- Communication records (distribution to relevant personnel)
- Review schedule for each topic-specific policy

**Common pitfalls:**
- Topic-specific policies drafted but never communicated
- Policy content contradicts overarching AI policy (different ethical principles, conflicting definitions)
- Too many or too few topic-specific policies — calibrate to actual governance needs

---

## A.2.6: Approach to AI Within Other Policies

**Requirement:** The organization shall consider how AI objectives and approaches should be incorporated within other organizational policies and ensure AI-related provisions are included where necessary.

**Gap indicators:**
- Existing policies (information security, privacy, quality) do not address AI-specific aspects
- Information security policy silent on AI model security, training data security, or AI API access
- Privacy policy does not address automated decision-making or training data minimization
- Quality policy does not address AI system validation or performance requirements

**Implementation steps:**
1. Review each major organizational policy for areas where AI-specific content is needed
2. Prioritize: information security policy (AI model security, adversarial attack risks, AI data access), privacy policy (automated decision-making, consent for AI training data use, DPIA requirements for AI), quality policy (AI system validation criteria, AI performance standards)
3. Draft AI-specific provisions for each identified policy; coordinate with policy owners
4. Obtain appropriate approvals for policy amendments
5. Communicate updated policies to affected personnel

**Evidence to collect:**
- Updated policy documents with AI-specific provisions
- Policy change records documenting the amendments
- Evidence of coordination between AI governance lead and policy domain owners

**Common pitfalls:**
- AI provisions added as a single paragraph at end of existing policy rather than integrated into relevant sections
- Information security policy updated for AI but privacy policy not addressed (or vice versa)

---

## Family A.3: Internal Organization

---

## A.3.2: AI Roles and Responsibilities

**Requirement:** Roles and responsibilities for AI shall be defined and allocated according to the needs of the organization. Annex B.3.2 requires coverage of twelve specific areas including risk management, impact assessment, security, safety, privacy, human oversight, and data quality management.

**Gap indicators:**
- No formal AI governance roles defined
- Roles defined by title only, no specific responsibilities documented
- Human oversight responsibility unassigned
- Data quality management for AI not assigned to any role
- Roles defined but not allocated to named individuals
- Roles allocated without sufficient authority to fulfill responsibilities

**Implementation steps:**
1. Review the twelve Annex B.3.2 areas requiring defined roles: risk management, AI system impact assessments, asset and resource management, security, safety, privacy, development, performance, human oversight, supplier relationships, demonstrating legal compliance, and data quality management
2. Map each B.3.2 area to a defined role or confirm it is not applicable to the organization's AI activities (document rationale for exclusions)
3. Define responsibilities for each role to the level that the role holder can actually perform them — specific duties, decision rights, escalation authority, and accountability scope
4. Formally allocate each role to a named individual or position; document the allocation
5. Ensure each role holder has sufficient organizational authority to discharge their responsibilities
6. Communicate roles and responsibilities to role holders and to personnel who interact with them
7. Connect role definition to the competence requirements of Clause 7.2

**Evidence to collect:**
- AI governance RACI matrix covering all B.3.2 areas
- Role descriptions with specific responsibilities
- Organizational chart showing AI accountability structure
- Documentation of role allocations to individuals or positions
- Evidence of communication to role holders

**Common pitfalls:**
- RACI exists but human oversight column left blank ("everyone is responsible" = no one is)
- Data quality management for AI assigned to IT; AI team assumes IT understands AI-specific quality requirements
- Roles defined but authority not granted — AI Governance Lead cannot actually stop an AI deployment
- Role allocation document not updated when people change jobs

---

## A.3.3: Reporting

**Requirement:** The organization shall establish reporting processes that ensure relevant AI-related information reaches appropriate levels of the organization and appropriate external parties.

**Gap indicators:**
- No defined reporting lines for AI risks and incidents to executive leadership
- AI performance data not reaching management review
- Regulatory reporting obligations for AI not identified or operationalized
- AI incidents reported to IT but not escalated to AI governance or executive level

**Implementation steps:**
1. Map required information flows: (a) upward reporting — AI risks, incidents, and performance metrics to executive leadership and governing body; (b) lateral reporting — AI performance and risk information to affected business functions; (c) outward reporting — regulatory disclosures, incident notifications to affected parties
2. Define reporting frequency, format, and accountable owner for each information flow
3. Integrate AI reporting into existing management reporting cycles where appropriate (quarterly business review, board risk reporting)
4. Establish an escalation path for AI incidents that ensures timely upward notification
5. Document regulatory reporting obligations relevant to AI (e.g., EU AI Act incident reporting obligations, GDPR breach notification where AI systems process personal data)

**Evidence to collect:**
- Reporting framework documentation
- Sample AI risk and performance reports at executive level
- Escalation procedures for AI incidents
- Records of regulatory reporting where applicable

**Common pitfalls:**
- Reporting framework documented but never actually executed (no reports exist)
- Regulatory reporting obligations not identified; discovered during incident

---

## A.3.4: AI System-Related Processes

**Requirement:** The organization shall establish processes for AI-related activities that implement the requirements of the AIMS and operationalize AI policy commitments.

**Gap indicators:**
- AI policy commitments exist but no documented processes for how to execute them
- AI risk assessment process not documented
- AI impact assessment described in policy but no procedure defines how to conduct one
- No process for AI system approval before deployment

**Implementation steps:**
1. Identify all AI governance activities requiring documented processes: AI risk assessment, AI impact assessment, AI system approval, AI change management, AI incident response, AI model validation
2. For each activity, document the process: purpose, scope, inputs, steps, roles, outputs, and records to be retained
3. Align process documentation with corresponding Annex A controls (e.g., impact assessment process under A.5.2-A.5.4)
4. Review process documentation for consistency with the AI policy
5. Train personnel on documented processes and ensure accessibility

**Evidence to collect:**
- Process documentation for core AI governance activities
- Evidence of process usage (completed checklists, records from process execution)
- Training records for personnel executing processes

**Common pitfalls:**
- Processes documented at policy level; procedures never written
- Processes created but not communicated to the people who execute them

---

## Family A.4: Resources for AI Systems

---

## A.4.2: AI System Inventory

**Requirement:** The organization shall maintain an inventory of AI systems within scope of the AIMS.

**Gap indicators:**
- No AI system inventory exists
- Inventory exists but is known to be incomplete (shadow AI systems not captured)
- Inventory not maintained — systems added without updating it
- Inventory lacks risk classification or status fields

**Implementation steps:**
1. Conduct an AI system discovery exercise across all business functions; include department surveys, IT procurement records, software license reviews, and cloud spend analysis to identify AI tools in use
2. For each identified AI system, document: system name, business purpose, risk classification, data categories processed, owner, vendor (if third-party), deployment date, lifecycle status, and associated AIMS impact assessment reference
3. Establish an intake process requiring new AI systems to be registered before production deployment
4. Assign an owner responsible for maintaining the inventory and reviewing it at defined intervals
5. Include AI features embedded in non-AI software products (CRM AI features, productivity AI, HR AI) — these are frequently overlooked

**Evidence to collect:**
- AI system inventory (current, complete, and with review history)
- Intake process documentation
- Review records showing the inventory is actively maintained

**Common pitfalls:**
- Inventory captures "AI projects" but misses AI features in SaaS tools
- Inventory maintained by IT; business teams procure AI tools outside IT without notification
- No intake gate — AI systems deployed to production without inventory registration

---

## A.4.3: AI-Related Resources and Assets

**Requirement:** The organization shall identify and manage the resources and assets associated with AI systems, including data assets, AI models, and infrastructure.

**Gap indicators:**
- Asset register covers infrastructure but omits AI models, datasets, and third-party AI APIs
- Training datasets not treated as organizational assets with lifecycle management
- Pre-trained models and foundation models not inventoried

**Implementation steps:**
1. Extend the AI system inventory (A.4.2) to capture associated assets: training datasets (name, location, last updated), AI models (name, version, training date, architecture), third-party AI services and APIs, AI development tools and frameworks, compute infrastructure
2. For each asset, document ownership, location, access controls, and retention period
3. Establish a process for tracking asset changes (model version updates, dataset refreshes)

**Evidence to collect:**
- Asset register covering models, datasets, and third-party AI components
- Asset lifecycle records (version history, retirement records)

**Common pitfalls:**
- Third-party AI APIs and pre-trained foundation models (GPT-4, Claude) not inventoried — significant assets with risk implications

---

## A.4.4: Computational Resources

**Requirement:** The organization shall identify and manage computational resources required for AI systems.

**Gap indicators:**
- No documentation of compute requirements or dependencies for AI systems
- Shared compute resources creating data isolation risks not identified
- Compute availability not assessed as an AI reliability risk

**Implementation steps:**
1. Document compute requirements for each AI system: training compute, inference compute, storage, and networking
2. Identify compute dependencies and single points of failure
3. Assess shared compute risks where multiple AI systems or multiple tenants share infrastructure
4. Include compute constraints and dependencies in AI system risk assessments

**Evidence to collect:**
- Compute resource documentation per AI system
- Compute capacity planning records
- Assessment of shared compute risks

**Common pitfalls:**
- Compute requirements documented for AI development but inference compute planning omitted

---

## A.4.5: Resources for AI System Development and Operation

**Requirement:** The organization shall identify and provide the human, technological, and organizational resources needed to develop and operate AI systems responsibly.

**Gap indicators:**
- Insufficient AI expertise on teams making AI governance decisions
- No budget allocated for AI governance activities
- AI tools and technology infrastructure inadequate for responsible AI practices

**Implementation steps:**
1. Assess current resource adequacy: human expertise (AI engineering, AI ethics, data science), technology (monitoring tools, testing infrastructure, data governance tooling), and budget (for training, tooling, assessments)
2. Identify and document resource gaps
3. Develop a resource plan to address gaps; prioritize based on risk
4. Connect resource requirements to the competence requirements of Clause 7.2

**Evidence to collect:**
- Resource assessment documentation
- Budget allocation records for AI governance
- Staffing records for AI governance roles

---

## A.4.6: Environmental Impact

**Requirement:** The organization shall consider and manage the environmental impacts of AI systems, particularly energy consumption and carbon footprint associated with training and inference workloads.

**Gap indicators:**
- No assessment of energy consumption from AI training or inference
- Environmental impact not considered in AI system design or procurement decisions
- No reporting on AI-related environmental impact

**Implementation steps:**
1. Estimate energy consumption for significant AI workloads (training runs, inference at scale)
2. Identify opportunities to reduce environmental impact: efficient model architectures, renewable energy for compute, optimized inference serving, model compression
3. Include environmental impact in AI system impact assessments (A.5.4)
4. Document environmental impact management approach and integrate with organizational sustainability reporting where applicable

**Evidence to collect:**
- Environmental impact assessment records for significant AI workloads
- Energy consumption estimates
- Documentation of impact reduction measures

**Common pitfalls:**
- Environmental impact assessment omitted entirely; added as afterthought when auditor requests it

---

## Family A.5: Assessing Impacts of AI Systems

---

## A.5.2: AI Impact Assessment Process

**Requirement:** The organization shall establish a documented process for assessing the impacts of AI systems on individuals, groups, and society. The process must exist before AI systems are deployed.

**Gap indicators:**
- No documented impact assessment process
- Process documented but no methodology or template defined
- Impact assessment conducted only reactively after problems emerge
- Assessment scope limited to internal business impacts; individual and societal impacts not addressed

**Implementation steps:**
1. Design an impact assessment methodology covering: impacts on individual rights (privacy, non-discrimination, due process), safety impacts, economic and access impacts, societal and environmental impacts
2. Document the assessment process: triggers (per A.5.3), roles and responsibilities, assessment steps, stakeholder consultation requirements, documentation standards, review and approval requirements
3. Create assessment templates and guidance to enable consistent execution
4. Establish pre-deployment requirements: AI systems must complete impact assessment before receiving deployment approval
5. Integrate the assessment process with the AI system approval gate in A.6.2.3

**Evidence to collect:**
- Documented impact assessment process and methodology
- Assessment templates
- Integration with deployment approval process (A.6.2.3)
- Pre-deployment requirement documentation

**Common pitfalls:**
- Process describes what an impact assessment is but not how to conduct one
- Template so generic that any AI system produces identical "low impact" results
- Process not integrated with deployment gate — impact assessments can be skipped

---

## A.5.3: Triggers for AI System Impact Assessments

**Requirement:** The organization shall define and apply triggers that determine when AI impact assessments must be conducted, including for new systems and material changes to existing systems.

**Gap indicators:**
- Assessments conducted only at initial deployment, never revisited
- No defined criteria for what constitutes a "material change" requiring reassessment
- Context changes (new deployment market, new user population) not recognized as triggers

**Implementation steps:**
1. Define trigger categories: (a) new AI system deployment, (b) material changes to AI system architecture or model, (c) significant changes to training data, (d) new deployment contexts or user populations, (e) changes in legal or regulatory requirements, (f) significant incidents or harm discoveries from monitoring
2. Document what constitutes a material change (threshold criteria, not just a list of change types)
3. Integrate trigger assessment into change management processes so that AI system changes automatically invoke trigger evaluation
4. Establish a periodic review trigger (e.g., annual reassessment for high-risk AI systems regardless of changes)

**Evidence to collect:**
- Documented trigger criteria
- Integration with change management process
- Records showing triggers were evaluated for AI system changes
- Periodic review schedule for existing AI systems

**Common pitfalls:**
- Triggers defined but not monitored — changes occur without anyone evaluating whether a trigger applies
- "Material change" undefined; applied inconsistently or never applied

---

## A.5.4: Conducting and Documenting AI Impact Assessments

**Requirement:** The organization shall conduct AI impact assessments according to the established process, involve appropriate stakeholders, and document results.

**Gap indicators:**
- Assessments conducted without stakeholder involvement beyond the AI team
- Assessment documentation superficial (one-page checkbox exercise)
- Impacts identified but not analyzed for magnitude or probability
- Assessments completed but not reviewed or approved before deployment

**Implementation steps:**
1. Execute impact assessments using the methodology established in A.5.2
2. Include appropriate stakeholders: internal (legal, privacy, security, affected business functions) and external where feasible (affected user groups, external ethics reviewers for high-risk systems)
3. Document assessment findings including: AI system scope and context, identified impacts (positive and negative), impact probability and magnitude, affected populations, and initial risk rating
4. Obtain review and approval from the appropriate role (per A.3.2 role definitions)
5. Archive assessment records as required documented information

**Evidence to collect:**
- Completed impact assessment records for all in-scope AI systems
- Evidence of stakeholder participation in assessments
- Review and approval records
- Assessment version history for reassessments

**Common pitfalls:**
- Assessment identifies impacts but assigns them all "low" risk without methodology or data to support the rating
- Affected populations identified only as "users" — specific demographic or vulnerable groups not considered
- Assessment completed by AI developer who has conflict of interest in finding low impact

---

## A.5.5: Responding to AI System Impacts

**Requirement:** The organization shall have a process for responding to identified AI system impacts, including decisions to mitigate, monitor, accept, or discontinue AI systems based on their impact profile.

**Gap indicators:**
- Assessment identifies impacts but no response process determines what to do with them
- All impacts accepted with no mitigation for any identified risk
- Mitigation measures implemented but effectiveness not verified
- No process for escalating unacceptable impacts to decision authority

**Implementation steps:**
1. Define a response decision framework: for each identified impact, the organization must decide to: (a) eliminate or reduce the impact through design change, (b) implement mitigating controls, (c) monitor and accept with documented rationale, or (d) discontinue the AI system where impacts are unacceptable
2. Establish a decision authority for impact acceptance — not all impacts can be accepted by the AI team alone; significant impacts require approval at appropriate organizational level
3. Document all impact response decisions with rationale, assigned owners, and implementation timelines
4. Establish verification processes for implemented mitigations
5. Connect impact response to monitoring (A.6.2.4) so that accepted impacts are tracked over time

**Evidence to collect:**
- Impact response decisions for all identified impacts
- Mitigation implementation records
- Mitigation effectiveness verification records
- Escalation records for impacts requiring senior approval

**Common pitfalls:**
- Mitigation measures planned but implementation not tracked or verified
- Accepted impacts never revisited even when monitoring reveals higher-than-expected harm rates

---

## Family A.6: AI System Life Cycle

---

## A.6.1.2: Responsible Design and Development Objectives

**Requirement:** The organization shall document specific, measurable objectives for responsible AI design and development that operationalize the AI policy principles.

**Gap indicators:**
- AI policy has principles but no measurable development objectives
- Objectives exist but are too vague to be auditable ("build fair AI")
- Objectives not linked to the development process as quality criteria

**Implementation steps:**
1. Translate each AI policy principle into one or more measurable development objectives; examples: "model performance parity across demographic groups within 5%," "all training datasets must have documented provenance," "explainability output must be generated for all high-confidence predictions"
2. Assign metrics, measurement methods, and thresholds for each objective
3. Integrate objectives into development lifecycle as criteria that must be met before deployment gate approval
4. Review objectives at defined intervals for continued relevance as AI capabilities evolve

**Evidence to collect:**
- Documented development objectives with measurable criteria
- Integration with development lifecycle criteria
- Review records for objectives currency

**Common pitfalls:**
- Objectives set by AI governance team without input from AI development team — unachievable or unverifiable
- Metrics defined but no measurement process established

---

## A.6.1.3: AI System Development Processes

**Requirement:** The organization shall implement documented processes for AI system development that incorporate responsible AI considerations at each development stage.

**Gap indicators:**
- General software development process used for AI with no AI-specific controls
- No bias testing in the development process
- Model validation conducted informally without documented criteria
- Development process stages not defined for AI (training, validation, testing, deployment)

**Implementation steps:**
1. Define AI development lifecycle stages: (a) problem framing and requirements, (b) data collection and preparation, (c) model design and selection, (d) model training, (e) model evaluation and validation, (f) testing (functional, bias, adversarial), (g) deployment readiness review, (h) production deployment
2. For each stage, document: responsible AI checkpoints, required inputs and outputs, roles and approval requirements
3. Embed the responsible design objectives (A.6.1.2) as criteria in the validation and testing stages
4. Require documentation at each stage; establish model cards or equivalent artifacts capturing model purpose, limitations, performance characteristics, and bias assessment results

**Evidence to collect:**
- AI development lifecycle documentation
- Stage-gate checklists with responsible AI criteria
- Sample model validation records
- Model cards or equivalent documentation

**Common pitfalls:**
- Development process documented but bias testing stage contains no actual test methodology or acceptance criteria
- Model cards created for some AI systems but not maintained for existing systems

---

## A.6.2.2: Procurement

**Requirement:** The organization shall conduct appropriate AI-specific due diligence when procuring AI systems or AI components from third parties, and establish appropriate contractual requirements.

**Gap indicators:**
- AI systems procured through standard vendor process with no AI-specific assessment
- No AI-specific contract provisions (data governance, model documentation, incident notification)
- Pre-trained models used without review of associated documentation, bias assessments, or terms
- No AI-specific questions in vendor evaluation questionnaire

**Implementation steps:**
1. Develop an AI supplier assessment questionnaire covering: model documentation, training data practices, bias assessment results, security practices, incident response capabilities, and EU AI Act conformance (where applicable)
2. Establish minimum contractual requirements for AI suppliers: model documentation provision, data processing terms, incident notification (timelines and scope), audit rights, and alignment with the organization's AI policy
3. Update procurement process to require AI-specific assessment for AI system acquisitions before approval
4. Establish a register of approved AI suppliers with assessment dates and outcomes

**Evidence to collect:**
- AI supplier assessment questionnaire
- Completed supplier assessment records
- AI-specific contract provisions (addenda or dedicated AI supplier agreements)
- Approved AI supplier register

**Common pitfalls:**
- Standard vendor security questionnaire used for AI suppliers with no model governance questions
- Third-party foundation model providers (major AI labs) treated as beyond due diligence because "everyone uses them"

---

## A.6.2.3: Deployment

**Requirement:** The organization shall implement controlled AI system deployment with documented readiness criteria that must be met before production deployment.

**Gap indicators:**
- No deployment gate — AI systems move to production based on developer judgment
- Deployment gate exists but impact assessment completion not required
- Testing completion required but bias testing not included in scope

**Implementation steps:**
1. Define deployment readiness criteria: completed testing (functional, bias, adversarial), completed impact assessment with response decisions, risk acceptance by appropriate authority, documentation completeness (model card, operational runbook), monitoring configuration in place
2. Implement a deployment approval process requiring review and sign-off from: AI system owner, risk owner (for risk acceptance), and operational team (confirming monitoring is configured)
3. Document each deployment decision with approval records and the readiness evidence reviewed
4. Establish a process for emergency or expedited deployments with compensating controls

**Evidence to collect:**
- Deployment readiness checklist and criteria documentation
- Completed deployment approval records for each AI system
- Evidence that readiness criteria were evaluated before approval

**Common pitfalls:**
- Deployment approval required from single person who is both developer and approver — no independence
- Expedited deployment process used routinely, bypassing standard controls

---

## A.6.2.4: Operation

**Requirement:** The organization shall monitor and manage deployed AI systems to maintain their intended performance and detect operational anomalies.

**Gap indicators:**
- No production monitoring for AI system performance
- Model drift not detected — performance degrades without organizational awareness
- Operational incidents logged in general IT ticketing without AI-specific categorization
- No process for responding to operational anomalies in AI systems

**Implementation steps:**
1. Define operational monitoring metrics for each AI system: performance metrics (accuracy, precision, recall where applicable), fairness metrics (demographic parity, equalized odds), business metrics (user satisfaction, decision outcomes), and system health metrics
2. Implement monitoring tooling and configure alerting thresholds
3. Define model drift detection approach and retraining trigger criteria
4. Establish AI-specific operational procedures: incident response, model rollback, emergency shutdown for serious harm
5. Create an AI operational runbook for each production AI system

**Evidence to collect:**
- Operational monitoring configuration and dashboard
- Alert configuration records
- Sample performance reports and trend analysis
- AI operational runbooks

**Common pitfalls:**
- Monitoring configured for system health (uptime, latency) but not model performance or fairness
- Drift detection implemented but no defined threshold for triggering retraining or review

---

## A.6.2.5: Decommissioning

**Requirement:** The organization shall manage AI system end-of-life systematically, including data retention/deletion, documentation archival, and assessment of impacts from discontinuing the AI system.

**Gap indicators:**
- AI systems simply stopped without formal decommissioning process
- Training data retained indefinitely after AI system retirement
- No assessment of impacts on users or affected parties who relied on the discontinued system
- Model artifacts (weights, training code) not archived or deleted per data governance requirements

**Implementation steps:**
1. Establish a decommissioning checklist: notification to users and affected parties, data disposition (deletion or archival per retention policy), model artifact disposition, documentation archival, infrastructure decommissioning
2. Assess impacts of discontinuing the AI system, particularly for users or processes that depend on it, and develop a transition plan where needed
3. Complete data deletion records to demonstrate compliance with data retention policies
4. Archive sufficient documentation to support future investigations or regulatory inquiries
5. Document the decommissioning decision and completion with approval records

**Evidence to collect:**
- Decommissioning checklist and procedure
- Completed decommissioning records for retired AI systems
- Data deletion confirmation records
- User notification records

**Common pitfalls:**
- No decommissioning process — AI systems "sunset" informally with no documentation
- Training data containing personal data not deleted per privacy requirements

---

## Family A.7: Data for AI Systems

---

## A.7.2: Data Acquisition and Collection

**Requirement:** The organization shall document and control the processes by which data is acquired and collected for AI systems, including legal basis, source documentation, and fitness for intended use.

**Gap indicators:**
- Training data acquired without documented legal basis (particularly for personal data)
- Data sources not documented — cannot determine what data trained the model
- Data acquired for one purpose and repurposed for AI training without appropriate authorization
- Web-scraped training data with no license or terms-of-use review

**Implementation steps:**
1. Document the legal basis for each data acquisition (contractual, consent, legitimate interest, publicly available, licensed)
2. Establish a data acquisition register capturing: dataset name, source, acquisition date, legal basis, intended use, and license terms
3. Establish a process for evaluating data fitness before use: does it match the intended AI use case, what are the known quality and representativeness limitations?
4. For repurposing existing data for AI training, confirm the original legal basis is compatible and document the compatibility assessment
5. Conduct legal review of web-scraped or third-party curated datasets for license compliance and GDPR implications

**Evidence to collect:**
- Data acquisition register with legal basis documentation
- License agreements or terms of use for licensed datasets
- Legal basis assessments for personal data in training sets
- Fitness-for-purpose assessments

**Common pitfalls:**
- Training datasets acquired years ago with no documentation; organization cannot demonstrate legal basis
- "Publicly available" assumed to mean "freely usable" — public data can still have copyright, license, or legal basis requirements

---

## A.7.3: Data Quality

**Requirement:** The organization shall establish and apply data quality standards for AI systems, measure data quality, and address identified quality issues before and during AI system development.

**Gap indicators:**
- No defined data quality criteria for training data
- Data quality assessed subjectively without measurement
- Quality assessment performed once at dataset creation; not re-evaluated when data is reused
- Known data quality issues accepted without documentation or mitigation

**Implementation steps:**
1. Define data quality dimensions relevant to AI: accuracy, completeness, representativeness, timeliness, consistency, and labeling quality
2. Establish measurable quality criteria for each dimension for each AI system
3. Implement data quality measurement processes: automated checks, sampling-based review, statistical analysis of distribution and representation
4. Document quality assessment results and decisions made based on findings
5. Establish a threshold below which data quality is insufficient for training or inference use

**Evidence to collect:**
- Data quality standards documentation
- Quality measurement methodology and tools
- Quality assessment records for each training dataset
- Quality issue log and resolution records

**Common pitfalls:**
- Quality standards defined but measurement methodology not established (standards exist on paper only)
- Representativeness not assessed — dataset may be technically accurate but systematically under-represent key populations

---

## A.7.4: Data Provenance and Attributes

**Requirement:** The organization shall document data provenance (origin, transformations, lineage) and relevant attributes of data used in AI systems.

**Gap indicators:**
- Cannot trace training data from source to final training set
- Transformation steps (cleaning, labeling, augmentation) not documented
- No documentation of known biases or limitations in training data

**Implementation steps:**
1. Establish data lineage documentation requirements: original source, acquisition date and method, each transformation step with inputs, outputs, and methodology, final dataset characteristics
2. Implement data lineage tooling or documentation templates for datasets used in AI systems
3. Document known data attributes relevant to AI quality and fairness: demographic representation, temporal scope, geographic scope, known biases or gaps
4. Maintain lineage documentation as datasets are updated or new versions created

**Evidence to collect:**
- Data lineage documentation for each training and evaluation dataset
- Transformation records (preprocessing scripts, annotation guidelines, augmentation methods)
- Dataset attribute documentation (representation analysis, known limitations)

**Common pitfalls:**
- Provenance documented for raw data but transformation steps (especially labeling) not recorded
- Data lineage in code comments and notebook metadata but not in formal documentation accessible to auditors

---

## A.7.5: Data Preparation

**Requirement:** The organization shall document and control data preparation processes, including labeling, annotation, cleaning, splitting, and augmentation.

**Gap indicators:**
- Data preparation undocumented — preparation performed ad hoc with no records
- Annotation guidelines not documented; labeler inconsistency not measured
- Annotation performed by external contractors without quality control
- Train/test data splitting methodology not documented (risk of data leakage)

**Implementation steps:**
1. Document data preparation procedures for each AI system: cleaning rules and criteria, labeling/annotation guidelines, augmentation methods, splitting methodology (rationale for split ratios, stratification approach, prevention of data leakage)
2. For human-labeled data, establish inter-annotator agreement measurement and minimum acceptable thresholds
3. Where labeling is outsourced, establish quality control sampling and audit processes
4. Maintain documentation connecting preparation procedures to resulting dataset versions

**Evidence to collect:**
- Data preparation procedure documentation
- Annotation guidelines and labeler training records
- Inter-annotator agreement measurement results
- Contractor quality control records
- Dataset version records connected to preparation procedures

**Common pitfalls:**
- Data splitting not documented — train/test contamination discovered late in development
- Outsourced annotation accepted without quality verification

---

## A.7.6: Data Management for Third-Party Data

**Requirement:** The organization shall evaluate, govern, and manage data acquired from third-party sources, ensuring appropriate use rights, quality assessment, and lifecycle management.

**Gap indicators:**
- Third-party datasets used without reviewing license terms
- Public benchmark datasets used for production AI without assessing their suitability
- Third-party data sources not inventoried separately from internally generated data

**Implementation steps:**
1. Inventory all third-party data sources used in AI systems
2. For each source, review and document: license terms and permitted uses, data quality and representativeness assessment, attribution requirements, and expiration or re-licensing requirements
3. Establish third-party data lifecycle management: re-licensing reviews at license expiration, version management, deletion obligations when licenses expire or are terminated
4. Include third-party data governance in supplier assessment (A.10.2)

**Evidence to collect:**
- Third-party data inventory with license terms documentation
- License compliance assessments
- Third-party data lifecycle management records

---

## Family A.8: Information for Interested Parties

---

## A.8.2: Information for Users

**Requirement:** The organization shall provide users of AI systems with adequate information about the system's purpose, capabilities, limitations, and appropriate use.

**Gap indicators:**
- No user documentation for AI systems
- User documentation emphasizes capabilities; limitations absent or vague
- Documentation exists but not provided at point of use
- Technical documentation exists but not accessible to non-technical users

**Implementation steps:**
1. For each AI system, develop user-facing documentation covering: intended purpose and use cases, capabilities and what the system can reasonably be expected to achieve, known limitations and what the system does not do or does poorly, appropriate use guidance including when human judgment should override AI output, and how to seek assistance when AI output is unexpected
2. Review documentation for accessibility to the intended user population — avoid technical jargon where users are non-technical
3. Make documentation available at the point of AI interaction (in-app, linked from UI) rather than only in external documentation repositories
4. Update documentation when AI system capabilities or limitations change materially

**Evidence to collect:**
- User documentation for each AI system
- Documentation accessibility review records
- Documentation update records linked to AI system changes

**Common pitfalls:**
- Limitations section written by AI team who believe the system performs better than users experience
- Documentation exists in help center but not accessible from within the AI product interface

---

## A.8.3: User Notification of AI Interaction

**Requirement:** The organization shall ensure that individuals interacting with AI systems are notified that they are interacting with AI, where this is not otherwise obvious.

**Gap indicators:**
- AI chatbot or conversational AI system with no disclosure of AI nature
- AI-generated content not labeled as AI-generated
- Disclosure buried in terms of service rather than presented at point of interaction
- Emotion recognition or behavioral AI operating without user awareness

**Implementation steps:**
1. Audit AI systems for AI nature disclosure: is it obvious to users they are interacting with AI? If not, implement disclosure
2. Design disclosure to be clear, prominent, and presented at or before the point of AI interaction
3. For AI-generated content, implement labeling or watermarking where technically feasible
4. Review EU AI Act Article 50 requirements for specific disclosure obligations applying to chatbots, emotion recognition systems, and deep fakes
5. Document the disclosure approach for each AI system

**Evidence to collect:**
- Screenshots or recordings showing AI disclosure notifications
- Documentation of disclosure approach per AI system
- EU AI Act Article 50 compliance assessment where applicable

---

## A.8.4: Explanation of AI Decisions

**Requirement:** The organization shall ensure that AI systems capable of explaining decisions provide explanations, and that processes exist for individuals to request explanations for AI-driven decisions affecting them.

**Gap indicators:**
- No explainability capability in AI systems making consequential decisions
- Explainability technically possible but no user-facing process to request explanations
- Explanations generated but not understandable to the affected individuals
- No defined scope for which decisions require explainability

**Implementation steps:**
1. Define the scope of AI-driven decisions for which explanations must be available — prioritize decisions with significant impact on individuals (credit decisions, employment screening, healthcare recommendations, access to services)
2. For in-scope AI systems, implement or document the explainability approach: inherently interpretable model architecture, post-hoc explanation methods (SHAP, LIME, attention weights), or natural language explanations
3. Establish a process for individuals to request explanations: intake mechanism, response timeline, explanation format, and escalation for complex cases
4. Test explanations for intelligibility to non-technical affected individuals

**Evidence to collect:**
- Scope definition for explainability requirements
- Technical implementation of explainability per AI system
- Explanation request process documentation
- Sample explanations with intelligibility review records

**Common pitfalls:**
- SHAP values provided as explanation — meaningless to most affected individuals
- Explanation request process documented but never tested — response fails when first real request arrives

---

## A.8.5: Information about AI System Context and Assumptions

**Requirement:** The organization shall disclose relevant context, assumptions, and limitations underlying AI system design and operation to enable informed use and appropriate reliance.

**Gap indicators:**
- Training data scope and temporal range not disclosed
- Known performance variation across demographic groups or contexts not disclosed
- Assumptions about input data quality or distribution not communicated to users
- System context documentation (model cards, system cards) not created

**Implementation steps:**
1. Create a model card or system card for each significant AI system documenting: intended use cases, out-of-scope uses, training data scope (time period, geographic scope, demographic coverage), known performance characteristics (accuracy across groups and contexts), known limitations, and evaluation methodology
2. Make model/system cards accessible to relevant interested parties: users, customers, regulators, researchers
3. Update cards when significant changes to the AI system are made
4. For high-risk AI systems subject to EU AI Act, ensure technical documentation (Article 11) requirements are met alongside model card

**Evidence to collect:**
- Model cards or system cards for in-scope AI systems
- Publication or distribution records for model cards
- Version history for model cards showing updates with AI system changes

---

## Family A.9: Use of AI Systems

---

## A.9.2: Responsible Use of AI Systems

**Requirement:** The organization shall establish and enforce policies governing responsible use of AI systems by employees, contractors, and (where applicable) customers.

**Gap indicators:**
- No responsible use policy for AI
- Policy exists but not communicated to employees using AI
- No human oversight requirements specified for consequential AI decisions
- Responsible use requirements specified but no operational enforcement

**Implementation steps:**
1. Draft a responsible use policy (or AI-specific addendum to existing acceptable use policy) covering: permitted uses, prohibited uses, human oversight requirements for consequential decisions, handling of AI outputs (verification requirements, escalation), data input restrictions (no confidential data in public AI tools), and reporting requirements for AI-related incidents
2. Communicate the policy to all relevant employees and contractors
3. Integrate responsible use requirements into operational workflows where AI is used in consequential decisions
4. Establish a mechanism for reporting violations and a process for addressing non-compliance

**Evidence to collect:**
- Responsible use policy document
- Communication records
- Human oversight workflow documentation for consequential AI decisions
- Policy compliance monitoring records

---

## A.9.3: AI Information Literacy of Users

**Requirement:** The organization shall develop the capability of users to use AI systems appropriately, including critical evaluation of AI outputs.

**Gap indicators:**
- Users have no training on AI system capabilities and limitations
- Users treat all AI outputs as authoritative without critical evaluation
- AI literacy training provided once at onboarding but not updated as AI systems evolve
- Different user populations using AI systems at very different competency levels with no differentiation

**Implementation steps:**
1. Define AI literacy requirements for different user populations (AI developers, business users, end customers)
2. Develop training content covering: what AI systems do and don't do, how to critically evaluate AI outputs, when to seek human review, how to report concerns about AI outputs
3. Deliver training through appropriate channels; for employees, integrate into role-specific onboarding
4. Update training when AI systems change materially or when AI literacy gaps are observed operationally

**Evidence to collect:**
- AI literacy requirements per user population
- Training content and curriculum
- Training completion records
- Training effectiveness assessment records

---

## A.9.4: Out-of-Scope Use

**Requirement:** The organization shall detect and address uses of AI systems that fall outside their intended scope, including uses that create risk not anticipated in the original design.

**Gap indicators:**
- No monitoring for out-of-scope use patterns
- Out-of-scope uses identified anecdotally but no response process
- AI system used for higher-stakes decisions than intended (a customer service chatbot relied on for medical advice)
- No defined scope against which to measure use patterns

**Implementation steps:**
1. Document the intended use scope for each AI system in the AI system inventory (A.4.2) and user documentation (A.8.2)
2. Implement monitoring for use patterns that fall outside intended scope: topic clustering of AI queries, analysis of user feedback, review of AI system interactions for out-of-scope topics
3. Define response options for identified out-of-scope uses: technical guardrails (scope limiting system prompts, topic filtering), user communication and redirection, policy updates if the out-of-scope use is legitimate and should be in-scope, or escalation if out-of-scope use is harmful
4. Document identified out-of-scope use patterns and organizational responses

**Evidence to collect:**
- AI system scope definitions
- Out-of-scope use monitoring configuration
- Out-of-scope use log and response records

---

## Family A.10: Third-Party and Customer Relationships

---

## A.10.2: Suppliers of AI Resources

**Requirement:** The organization shall assess, govern, and manage third parties that supply AI systems, AI models, AI data, or AI services, ensuring supplier practices align with the organization's AI policy.

**Gap indicators:**
- AI suppliers not subject to AI-specific assessment (only standard vendor due diligence)
- No AI-specific contract provisions with AI suppliers
- Foundation model providers not treated as AI suppliers requiring governance
- No periodic reassessment of AI supplier compliance

**Implementation steps:**
1. Identify all AI suppliers: AI model providers, AI API vendors, AI dataset providers, AI development tool vendors, and AI platform providers
2. Conduct AI-specific supplier assessments covering: AI governance maturity, model documentation, data practices, bias assessment evidence, security practices, incident response capability, EU AI Act status (where applicable)
3. Negotiate AI-specific contract provisions: model documentation provision, data processing terms, incident notification obligations (what, to whom, within what timeframe), audit rights, and alignment certification requirements
4. Establish periodic reassessment schedule for AI suppliers based on risk tier
5. Maintain a supplier register with assessment dates, risk tier, and key contractual provisions

**Evidence to collect:**
- AI supplier register
- Completed supplier assessment records
- AI-specific contract provisions or addenda
- Periodic reassessment records

**Common pitfalls:**
- Assessment questionnaire sent to AI suppliers but responses not reviewed before procurement decision
- Major AI model providers excluded from assessment because "they're too big to govern"

---

## A.10.3: Customers and AI Systems

**Requirement:** When the organization provides AI systems to customers, it shall govern the customer relationship appropriately, including disclosure of AI capabilities, data processing terms, and support for customers' AI governance requirements.

**Gap indicators:**
- Customer documentation does not disclose AI system use
- Customer contracts lack AI-specific data processing terms
- No process for customers to exercise AI-related rights (data deletion, explanation requests)
- Customer AI governance requirements not considered in AI system design

**Implementation steps:**
1. Update customer documentation and marketing materials to disclose AI system use and key capabilities/limitations
2. Review and update customer contracts to include AI-specific data processing terms: what data is processed, retention periods, use for training (opt-in/opt-out), incident notification, and customer data deletion rights
3. Establish processes for customers to exercise rights related to AI: data deletion, access to explanation of AI-driven decisions, and opt-out from AI processing where required
4. For enterprise customers, support their AI governance and due diligence requirements by providing model documentation, security assessments, and compliance evidence

**Evidence to collect:**
- Customer-facing AI disclosure documentation
- Customer contract review records showing AI-specific provisions
- Customer rights process documentation and exercise records
- Enterprise customer due diligence response packs

---

## A.10.4: End Users of AI

**Requirement:** When AI systems make decisions about or significantly affect end users who are not direct customers, the organization shall consider and manage its obligations to those individuals.

**Gap indicators:**
- End users of AI systems not identified as a distinct stakeholder group
- No process for end users to seek information about AI-driven decisions affecting them
- No consideration of end-user rights in AI system design
- AI systems making consequential individual decisions with no human review capability

**Implementation steps:**
1. Identify all categories of individuals affected by AI-driven decisions, including those with whom the organization has no direct relationship (applicants, subjects of AI-driven assessment, individuals affected by AI decisions in downstream processes)
2. For each category, assess what rights and obligations apply: right to explanation (A.8.4), right to human review of automated decisions (EU AI Act Article 86, GDPR Article 22), non-discrimination obligations
3. Implement processes for end users to exercise rights: inquiry mechanism, response process, escalation path
4. Where AI systems make automated decisions with significant legal or similarly significant effects, ensure human review capability is in place per applicable law
5. Document end-user rights assessment and implementation

**Evidence to collect:**
- End-user stakeholder identification and rights assessment
- End-user rights request process documentation
- Human review process documentation for automated decisions
- Sample records of end-user rights requests handled

**Common pitfalls:**
- End users confused with customers — individuals affected by AI decisions are not always the organization's direct customers
- GDPR Article 22 automated decision-making obligations not considered in AI system design; retrofit required post-deployment
