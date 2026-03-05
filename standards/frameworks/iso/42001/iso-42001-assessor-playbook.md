---
type: reference
name: iso-42001-assessor-playbook
category: compliance
classification: public
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42001:2023"
---

# ISO/IEC 42001:2023 Assessor Playbook

Assessment methodology, interview guides, scoring rubrics, and document request lists for ISO 42001 HLS clause and Annex A control assessment. Use this playbook to structure formal gap assessments, readiness reviews, and internal audits.

**Related:** `iso-42001-handbook.md` (framework overview), `iso-42001-test-playbook.md` (executable test cases)

---

## 1. Assessment Overview

### Assessment Types

| Type | Purpose | Duration | Output |
|------|---------|---------|--------|
| Gap Assessment | Identify conformance gaps before implementation | 2-4 days | Gap report with prioritized findings |
| Readiness Review | Confirm readiness before Stage 1 CB audit | 1-2 days | Readiness report and pre-certification checklist |
| Internal Audit | Verify ongoing conformance per Clause 9.2 | 2-3 days | Internal audit report |
| Surveillance Readiness | Pre-surveillance audit preparation | 1 day | Surveillance preparation checklist |

### Assessment Approach

ISO 42001 assessment follows a two-layer structure:

**Layer 1: HLS Clause Assessment (Clauses 4-10)**
Evaluates the management system infrastructure: scope definition, leadership commitment, planning, support systems, operational planning and control, performance evaluation, and improvement processes. HLS gaps often cascade — a weak Clause 5 (Leadership) makes every Annex A control harder to evidence.

**Layer 2: Annex A Control Assessment (38 controls across 9 families)**
Evaluates AI-specific operational controls. Each control requires: existence of required processes and documentation, evidence of execution (not just policy), and effectiveness (achieving the control's intended purpose).

### Assessment Sequencing

Assess in HLS clause order, then Annex A family order:

1. Clause 4 (Context) — defines what is in scope
2. Clause 5 (Leadership) — confirms governance commitment
3. Clause 6 (Planning) — establishes risk and objective framework
4. Annex A.2 (AI Policies) — confirms AI-specific governance foundation
5. Annex A.3 (Internal Organization) — confirms roles and accountability
6. Clause 7 (Support) — confirms resources, competence, documented information
7. Clause 8 + Annex A.4-A.9 (Operation) — evaluates operational controls
8. Clause 9 (Performance Evaluation) — assesses monitoring and audit
9. Clause 10 + Annex A.10 (Improvement) — assesses corrective action and third-party governance

---

## 2. Stage 1 Assessment: Documentation Review

### Pre-Assessment Document Request List

Request the following documents at assessment opening. Use non-receipt as an initial gap indicator.

**AIMS Infrastructure Documents (HLS Clauses 4-10)**

| Document | Required By | Red Flag If Missing |
|----------|-------------|---------------------|
| AIMS scope statement | Clause 4.3 | Cannot determine assessment boundaries |
| AI system inventory | Clause 4.1, A.4.2 | Cannot identify what is in scope |
| AI stakeholder register | Clause 4.2 | Interested parties not managed |
| AI policy (signed, current) | Clause 5.2, A.2.2 | Fundamental governance gap |
| AI roles and responsibilities / RACI | Clause 5.3, A.3.2 | No accountability structure |
| AI risk assessment methodology | Clause 6.1 | No systematic AI risk identification |
| AI objectives documentation | Clause 6.2 | No measurable AI governance targets |
| AIMS competency requirements | Clause 7.2 | Cannot assess personnel adequacy |
| Training records for AI roles | Clause 7.2 | Competency not demonstrated |
| AIMS documented information procedure | Clause 7.5 | Document control not established |
| Internal audit program | Clause 9.2 | Ongoing assurance not structured |
| Most recent internal audit report | Clause 9.2 | Cannot verify audit execution |
| Most recent management review record | Clause 9.3 | Leadership oversight not evidenced |
| Corrective action register | Clause 10.1 | Improvement not tracked |

**Annex A Control Documents**

| Document | Control | Red Flag If Missing |
|----------|---------|---------------------|
| AI policy content (with principles and deviation process) | A.2.2 | Core governance document gap |
| Policy alignment analysis | A.2.3 | No cross-policy governance |
| Policy review records | A.2.4 | Policy currency not maintained |
| Topic-specific AI policies | A.2.5 | Operational gaps in policy framework |
| AI impact assessment process and methodology | A.5.2 | Impact assessment not systematic |
| Completed AI impact assessment records | A.5.4 | Assessment not executed |
| AI development lifecycle documentation | A.6.1.3 | Development not controlled |
| Procurement due diligence records | A.6.2.2 | Supplier AI risk not assessed |
| Deployment readiness criteria and records | A.6.2.3 | Deployment not controlled |
| AI operational monitoring documentation | A.6.2.4 | Operational AI not monitored |
| Data acquisition register | A.7.2 | Data legal basis not documented |
| Data quality standards and assessments | A.7.3 | Data quality not managed |
| Data lineage documentation | A.7.4 | Data provenance not tracked |
| User-facing AI documentation | A.8.2 | User information inadequate |
| AI disclosure notifications (screenshots/mockups) | A.8.3 | AI nature not disclosed |
| Explainability process documentation | A.8.4 | Explanation capability not established |
| Model cards or system cards | A.8.5 | Context and assumptions not disclosed |
| Responsible use policy | A.9.2 | Responsible use not governed |
| AI supplier assessment records | A.10.2 | Supplier AI risk not assessed |
| Customer AI disclosure documentation | A.10.3 | Customer obligations not managed |

### Stage 1 HLS Clause Checklist

**Clause 4: Context of the Organization**

- [ ] AIMS scope statement exists and defines which AI systems are included
- [ ] Scope identifies organizational boundaries, locations, and excluded AI systems with justification
- [ ] External and internal issues relevant to AI are identified and documented (Clause 4.1)
- [ ] Interested parties for AI systems are identified with their requirements (Clause 4.2)
- [ ] Interested party requirements are monitored for changes

**Clause 5: Leadership**

- [ ] Top management commitment to the AIMS is evidenced beyond the AI policy (resource allocation, active review participation)
- [ ] AI policy is signed by top management, current, version-controlled
- [ ] AI policy is available to all personnel and relevant interested parties
- [ ] AI governance roles are formally assigned (not just titled — specific responsibilities documented)
- [ ] Reporting lines to top management for AI risk and performance are defined

**Clause 6: Planning**

- [ ] AI risks and opportunities are identified through a documented methodology
- [ ] Risk assessment addresses AI-specific risks (bias, model failure, data governance failures, third-party AI risk)
- [ ] Risk treatment plans are documented with owners and timelines
- [ ] AI objectives are measurable and documented
- [ ] Plans to achieve AI objectives identify resources, owners, timelines, and measurement approach
- [ ] Change planning process addresses AI system changes (Clause 6.3)

**Clause 7: Support**

- [ ] Resources for the AIMS are determined and provided (human, financial, technology)
- [ ] Competence requirements for AI roles are defined
- [ ] Personnel competence is assessed and training records maintained
- [ ] Awareness program exists for AI policy and individual responsibilities
- [ ] Communication processes for AI-related information are established
- [ ] Documented information control procedure exists
- [ ] AI documents are identified, versioned, approved, and accessible

**Clause 8: Operation**

- [ ] Operational planning and control processes exist for AI activities
- [ ] AI impact assessment process is documented and executed
- [ ] Change control covers AI system changes with impact assessment triggers

**Clause 9: Performance Evaluation**

- [ ] AI monitoring and measurement process defines what, how, and when to measure
- [ ] Monitoring results are analyzed and reported
- [ ] Internal audit program is documented with scope, frequency, and competency requirements
- [ ] Internal audits are conducted at planned intervals with documented results
- [ ] Management reviews include AI-specific inputs and are documented
- [ ] Management review outputs include decisions and actions

**Clause 10: Improvement**

- [ ] Nonconformity management process covers AI-specific nonconformities
- [ ] Root cause analysis is performed for significant nonconformities
- [ ] Corrective actions are implemented and verified
- [ ] Continual improvement is evidenced through demonstrable AIMS enhancements

---

## 3. Stage 2 Assessment: On-Site Interview Guides

### Interview Methodology

Stage 2 assessment combines document review with interviews to verify that controls are operational, not merely documented. Use these interview guides for each Annex A family.

**Interview principles:**
- Open with open-ended questions, follow with specific evidence requests
- Cross-reference interviewee statements with documentary evidence
- Interview multiple personnel for the same control area — inconsistency is a finding indicator
- Do not accept "we have a process for that" without evidence of execution

---

### Interview Guide: Family A.2 — AI Policies

**Target interviewees:** AI Governance Lead, Chief AI Officer, Legal Counsel

**Opening question:** "Walk me through how your AI policy was developed and who is involved in maintaining it."

**Follow-up questions:**
- "Show me the evidence of the six inputs that informed the AI policy per Annex B.2.2."
- "What happens when someone needs to deviate from the AI policy? Walk me through the last exception request."
- "When was the AI policy last reviewed? What inputs were used? Can I see the review report?"
- "Which other organizational policies did you review for alignment with the AI policy? What intersections did you find and how were they resolved?"
- "Who is responsible for AI policy review and how was that role approved by management?"

**Evidence requests:**
- AI policy with most recent version date and approval signature
- Policy informing inputs documentation
- Exception register (even if empty — process should exist)
- Policy review report referencing Clause 9.3 inputs
- Policy alignment analysis documentation

**Red flags:**
- Interviewee describes the AI policy but cannot produce it
- Policy review never occurred or occurred without management review inputs
- Deviation process described verbally but no register or documented process exists
- AI policy developed in isolation from privacy, security, or quality teams

---

### Interview Guide: Family A.3 — Internal Organization

**Target interviewees:** AI Governance Lead, CISO, HR/People Operations, AI Team Lead

**Opening question:** "How is accountability for AI governance structured in your organization? Who is responsible for what?"

**Follow-up questions:**
- "Show me the RACI or role definition document. Walk me through each of the twelve Annex B.3.2 areas — who owns each?"
- "Who is responsible for human oversight of AI decisions? How do they exercise that oversight operationally?"
- "Who is accountable for data quality management throughout the AI system lifecycle? How do they measure and report on data quality?"
- "If there's a significant AI incident at 2am, what does the reporting chain look like?"
- "What processes exist for AI governance activities — how is an impact assessment actually conducted? Who approves it?"

**Evidence requests:**
- AI governance RACI or responsibility matrix
- Role descriptions with specific AI responsibilities
- AI incident escalation procedure
- AI governance process documentation

**Red flags:**
- Multiple interviewees claim the same responsibility (overlapping, undefined accountability)
- Human oversight role identified but no operational mechanism for oversight exists
- "AI team is responsible for everything AI" — no cross-functional accountability
- Data quality management responsibility unclear ("the data team handles that")

---

### Interview Guide: Family A.4 — Resources for AI Systems

**Target interviewees:** AI Product Owner, CTO, IT/Infrastructure Lead, Sustainability/ESG Lead

**Opening question:** "Walk me through your AI system inventory. How do you know what AI systems you have?"

**Follow-up questions:**
- "How are new AI systems added to the inventory? What happens if a business team deploys an AI tool without going through your process?"
- "Beyond the AI systems themselves, what assets do you track? Models, datasets, third-party APIs?"
- "What AI features are embedded in the SaaS tools your organization uses? Are those in scope?"
- "How do you track the environmental impact of your AI workloads?"

**Evidence requests:**
- AI system inventory with review date
- Asset register showing AI models, datasets, third-party AI components
- Compute resource documentation
- Evidence of periodic inventory review

**Red flags:**
- Inventory exists but interviewee acknowledges undocumented AI tools in use
- SaaS AI features categorically excluded from inventory without documented rationale
- No environmental impact consideration for significant AI training workloads

---

### Interview Guide: Family A.5 — Assessing Impacts of AI Systems

**Target interviewees:** AI Ethics Lead, AI Product Owner, Legal/Compliance, affected business unit representatives

**Opening question:** "Walk me through how you conduct AI impact assessments. What's the process from trigger to decision?"

**Follow-up questions:**
- "Show me the methodology for conducting impact assessments. How is impact rated? What categories of impact are assessed?"
- "Who is involved in an impact assessment? Do you include anyone outside the AI team?"
- "What triggers a reassessment of an existing AI system? Give me an example of a trigger being applied."
- "Show me the completed impact assessment for your highest-risk AI system."
- "When an assessment identifies a significant impact, what happens? Who decides whether to accept, mitigate, or discontinue?"

**Evidence requests:**
- Impact assessment methodology and template
- Completed impact assessment records (at minimum for high-risk AI systems)
- Impact response decision records
- Reassessment records for existing AI systems
- Evidence of stakeholder involvement in assessments

**Red flags:**
- Impact assessment methodology described but no completed assessments can be produced
- All assessments conclude "low impact" without differentiated analysis
- Only internal stakeholders involved — no affected individuals, external experts, or user representatives
- No impact response process — assessment is an end in itself

---

### Interview Guide: Family A.6 — AI System Life Cycle

**Target interviewees:** AI Engineering Lead, ML Operations Lead, AI Product Owner, Procurement Lead

**Opening question:** "Walk me through how an AI system goes from idea to production in your organization. What does the lifecycle look like?"

**Follow-up questions:**
- "What are the development lifecycle stages? What responsible AI checkpoints exist at each stage?"
- "Show me the deployment readiness criteria. What must be complete before an AI system is deployed to production?"
- "What testing is required before deployment? Does it include bias testing and adversarial testing?"
- "When you procure a third-party AI system or model, what AI-specific due diligence do you conduct?"
- "What happens when an AI system is decommissioned? Walk me through the last decommissioning."
- "How do you monitor AI systems in production? What metrics do you track? What happens when performance degrades?"

**Evidence requests:**
- AI development lifecycle documentation with stage-gate criteria
- Deployment readiness checklist and completed examples
- Pre-deployment testing records including bias testing
- Procurement due diligence template and completed assessments
- Operational monitoring dashboard or reports
- Decommissioning records for any retired AI systems

**Red flags:**
- AI systems deployed to production based on developer judgment without formal gate
- Bias testing described but no test records, methodology, or acceptance criteria exist
- Third-party AI APIs treated as outside governance scope
- Decommissioning process does not include data deletion verification

---

### Interview Guide: Family A.7 — Data for AI Systems

**Target interviewees:** Data Engineer, ML Engineer, Data Governance Lead, Privacy Lead

**Opening question:** "Walk me through the data lifecycle for your primary AI system — from where the data comes from to how it's used in training."

**Follow-up questions:**
- "What is the legal basis for the training data? Where is that documented?"
- "What data quality standards apply to AI training data? How is quality measured?"
- "Can you show me the data lineage documentation — from raw source to training set? What transformation steps are documented?"
- "How do you govern third-party datasets? What license review occurs before use?"
- "If someone asks you where a particular AI behavior comes from in the training data, can you trace it?"
- "How is training data prepared? What are the annotation guidelines and how is labeling quality controlled?"

**Evidence requests:**
- Data acquisition register with legal basis documentation
- Data quality standards and measurement records
- Data lineage documentation for primary AI systems
- Third-party dataset license documentation
- Data preparation procedures and annotation guidelines
- Inter-annotator agreement records where labeled data is used

**Red flags:**
- Training data acquired years ago; no documentation of source, legal basis, or quality assessment
- "It's all publicly available data" — public availability does not establish legal basis for all uses
- Data lineage exists in code notebooks but nowhere accessible to non-engineers
- Third-party datasets used without license review

---

### Interview Guide: Family A.8 — Information for Interested Parties

**Target interviewees:** AI Product Manager, UX Lead, Customer Success Lead, Legal/Compliance

**Opening question:** "How do you ensure that users and affected individuals know they're interacting with AI and understand what the AI does?"

**Follow-up questions:**
- "Show me where users learn about the capabilities and limitations of your AI systems."
- "If a user asks 'what is this based on?' or 'why did the AI recommend this?' — what happens? Is there an explanation process?"
- "When someone interacts with your AI chatbot or AI feature, is it clear they're interacting with AI? Show me the disclosure."
- "Do you have model cards or system cards? Where can customers or regulators access them?"
- "What known limitations of your AI system are disclosed to users? Are the accuracy variations across different groups documented?"

**Evidence requests:**
- User-facing AI documentation (screenshots, help center content, in-product documentation)
- AI disclosure notifications in user interface (screenshots or recording)
- Explanation request process documentation and sample responses
- Model cards or system cards
- Customer-facing context and assumptions documentation

**Red flags:**
- User documentation emphasizes capabilities; limitations section vague or absent
- AI chatbot or conversational AI with no visible AI disclosure
- Explanation process documented but never tested; no response process for real requests
- Model cards exist internally but not shared with customers or externally accessible

---

### Interview Guide: Family A.9 — Use of AI Systems

**Target interviewees:** AI users across business functions, HR/Training Lead, AI Product Owner

**Opening question:** "When employees use AI systems in their work, what policies govern how they use them?"

**Follow-up questions:**
- "Show me the responsible use policy. Has every relevant employee received it?"
- "What training do employees receive on AI limitations? How do you build AI literacy?"
- "For AI systems that influence important decisions, is there a human review requirement? How is that enforced in practice?"
- "How do you know if AI is being used outside its intended scope? What happens if you find out-of-scope use?"
- "Give me an example of an out-of-scope use that was detected and how it was handled."

**Evidence requests:**
- Responsible use policy and communication records
- AI literacy training curriculum and completion records
- Human oversight workflow documentation for consequential AI decisions
- Out-of-scope use monitoring records
- Sample out-of-scope use response records

**Red flags:**
- Responsible use policy exists but users interviewed are unaware of it
- Human oversight required by policy but no workflow enforces it before consequential action is taken
- No monitoring for out-of-scope use — assumes it won't happen

---

### Interview Guide: Family A.10 — Third-Party and Customer Relationships

**Target interviewees:** Procurement Lead, Legal Counsel, Customer Success Lead, CTO

**Opening question:** "How do you manage the AI governance responsibilities you have toward your suppliers, customers, and end users?"

**Follow-up questions:**
- "When you select a new AI supplier, what AI-specific due diligence do you conduct? Can you show me the assessment for your primary AI supplier?"
- "What AI-specific provisions are in your AI supplier contracts? Can you show me an example?"
- "How do customers know what AI is doing in your product? Where is that disclosed?"
- "When a customer wants to understand or challenge an AI-driven decision, what process do they follow?"
- "Who are the end users of your AI systems — individuals who don't have a direct relationship with you but are affected by AI decisions? How do you manage obligations to them?"

**Evidence requests:**
- AI supplier register with assessment records
- AI supplier contracts with AI-specific provisions highlighted
- Customer-facing AI disclosure documentation
- Customer rights process documentation
- End-user rights assessment and implementation documentation

**Red flags:**
- Major AI model providers excluded from supplier assessment because "they're too large to govern"
- Customer contracts have general data processing terms but no AI-specific provisions
- End users of AI not identified — only customers considered
- No process for individuals to contest AI-driven decisions affecting them

---

## 4. Control Scoring Rubric

Score each control and HLS clause using the five-level scale:

| Level | Score | Name | Definition |
|-------|-------|------|-----------|
| 0 | None | Not implemented | No evidence the control exists in any form |
| 1 | Initial | Ad hoc | Some activity occurs but without documented process, consistent application, or management awareness |
| 2 | Developing | Documented | Process or policy documented but inconsistently applied, missing key elements, or not fully implemented |
| 3 | Defined | Implemented | Control fully documented, applied consistently, and evidence demonstrates execution |
| 4 | Managed | Measured | Control implemented and effectiveness measured; metrics tracked; management reviews results |
| 5 | Optimizing | Continuously improved | Control effectiveness demonstrably improving; lessons learned feed back into process; proactive identification of gaps |

**For certification purposes, all controls must reach Level 3 (Implemented) at minimum.** Level 2 (Developing) findings are typically classified as minor nonconformities (if the gap does not affect conformance with a specific requirement) or major nonconformities (if the gap means a requirement is not met). Level 0 or Level 1 findings are typically major nonconformities.

### Scoring Decision Rules

**Score 0 (None):** Cannot produce any evidence that the control has been considered, let alone implemented. No documentation, no awareness among interviewees.

**Score 1 (Initial):** Activity occurs — someone is doing something related to the control — but it is undocumented, inconsistent, and not known to management. "We kind of do that informally."

**Score 2 (Developing):** Documentation exists but is incomplete (missing B.x.x required elements), not fully applied (some AI systems assessed but not others), or recently created without evidence of execution (policy written last week, never used).

**Score 3 (Defined):** Documentation complete, consistently applied, and execution is evidenced. Can produce records of the control being executed for all in-scope AI systems. Interviewee descriptions match documentation.

**Score 4 (Managed):** Level 3 plus: effectiveness is measured (not just tracked), trends are analyzed, and management reviews the results as part of the governance cycle.

**Score 5 (Optimizing):** Level 4 plus: the control is proactively improved based on performance data, lessons learned from incidents or audits feed back into the process, and the organization can demonstrate year-over-year improvement.

---

## 5. Common Audit Findings by Family

### A.2 — AI Policies — Common Findings

**Major nonconformities:**
- No AI policy exists (A.2.2 — fundamental)
- AI policy not approved by top management (Clause 5.2)
- AI policy has no principles — only aspirational statements (A.2.2, Annex B.2.2)
- AI policy has no deviation/exception process (A.2.2, Annex B.2.2 explicit requirement)

**Minor nonconformities:**
- Policy alignment analysis not documented (A.2.3) — intersections noted informally but no record
- Management review results not used as input to policy review (A.2.4, direct Annex B.2.4 requirement)
- Topic-specific AI policies not communicated to all relevant personnel (A.2.5)

**Observations (no conformance impact but worth noting):**
- Policy review intervals defined but could be more frequent given rapidly changing AI landscape
- Deviation register maintained but exceptions not reviewed for trends

---

### A.3 — Internal Organization — Common Findings

**Major nonconformities:**
- No AI governance roles defined beyond "the AI team" (A.3.2 — covers only some of the B.3.2 areas)
- Human oversight role undefined (A.3.2 — human oversight is an explicit B.3.2 area)
- No reporting process for AI risks to executive leadership (A.3.3)

**Minor nonconformities:**
- Roles defined but not allocated to named individuals (A.3.2 — requires "allocated")
- AI governance processes described in policy but no procedure documents how to execute them (A.3.4)

---

### A.4 — Resources — Common Findings

**Major nonconformities:**
- No AI system inventory (A.4.2 — fundamental; cannot assess any other control without it)
- AI system inventory materially incomplete (A.4.2 — known gaps with no plan to close)

**Minor nonconformities:**
- Inventory not reviewed at planned intervals; outdated entries (A.4.2)
- AI assets (models, datasets, APIs) not captured in asset register (A.4.3)
- Environmental impact not assessed for significant AI workloads (A.4.6)

---

### A.5 — Impact Assessment — Common Findings

**Major nonconformities:**
- No impact assessment process documented (A.5.2 — fundamental to the family)
- Impact assessments not conducted for deployed AI systems (A.5.4)
- Impact assessment process exists but not triggered by material AI system changes (A.5.3)
- Identified impacts have no response decisions — assessment is an end in itself (A.5.5)

**Minor nonconformities:**
- Assessment methodology too generic — all AI systems produce identical findings (A.5.4)
- No external stakeholders involved in assessments for customer-facing AI (A.5.4)
- Trigger criteria not defined for "material change" (A.5.3)

---

### A.6 — AI System Life Cycle — Common Findings

**Major nonconformities:**
- AI systems deployed without deployment readiness criteria or approval (A.6.2.3)
- No development process documents responsible AI checkpoints (A.6.1.3)
- Third-party AI systems procured without AI-specific due diligence (A.6.2.2)

**Minor nonconformities:**
- Bias testing described in process but no test methodology, dataset, or acceptance criteria defined (A.6.1.3)
- Decommissioning process does not include data deletion verification (A.6.2.5)
- Production monitoring configured for system health but not model performance (A.6.2.4)

---

### A.7 — Data for AI Systems — Common Findings

**Major nonconformities:**
- Training data acquired without documented legal basis — personal data involved (A.7.2 — potential GDPR violation)
- No data quality standards or measurement for training data (A.7.3)
- No data lineage documentation — cannot trace from training data to model behavior (A.7.4)

**Minor nonconformities:**
- Data lineage in code rather than accessible documentation (A.7.4)
- Third-party datasets used without license review (A.7.6)
- Annotation guidelines not documented; inter-annotator agreement not measured (A.7.5)

---

### A.8 — Information for Interested Parties — Common Findings

**Major nonconformities:**
- AI chatbot or conversational AI with no user notification of AI nature (A.8.3)
- No user documentation for AI systems (A.8.2)
- No process for individuals to request explanations of AI-driven decisions (A.8.4)

**Minor nonconformities:**
- User documentation covers capabilities only; limitations section absent (A.8.2)
- Model cards created but not accessible to customers or public (A.8.5)
- Explanation process documented but not operationally implemented (A.8.4)

---

### A.9 — Use of AI Systems — Common Findings

**Major nonconformities:**
- No responsible use policy for AI (A.9.2)
- Human oversight required by policy but no workflow enforces it before action (A.9.2)

**Minor nonconformities:**
- AI literacy training conducted once at onboarding, not updated when AI systems evolve (A.9.3)
- No monitoring for out-of-scope use (A.9.4)
- Responsible use policy exists but not communicated to relevant personnel (A.9.2)

---

### A.10 — Third-Party and Customer Relationships — Common Findings

**Major nonconformities:**
- No AI-specific supplier assessment — AI suppliers assessed through generic vendor due diligence only (A.10.2)
- AI supplier contracts contain no AI-specific provisions (A.10.2)
- No process for end users to seek information about AI-driven decisions affecting them (A.10.4)

**Minor nonconformities:**
- Customer documentation does not disclose AI use (A.10.3)
- Customer data processing agreements lack AI-specific terms (A.10.3)
- End users not identified as a distinct stakeholder group from customers (A.10.4)

---

## 6. Assessment Report Template

### Finding Classification

| Classification | Definition | Certification Impact |
|---------------|-----------|---------------------|
| Major Nonconformity | Absence or total breakdown of a system element causing significant doubt about conformity | Certificate cannot be issued until resolved |
| Minor Nonconformity | A single observed lapse in fulfilling a requirement | Certificate can be issued with time-bound corrective action plan |
| Observation | A situation which does not yet constitute a nonconformity but warrants attention | No certification impact; note for surveillance |

### Finding Documentation Format

For each finding:

```
Finding ID: ISO42001-[YEAR]-[SEQUENCE]
Classification: [Major Nonconformity / Minor Nonconformity / Observation]
Control Reference: [Clause or Annex A control number]
Control Title: [Control name]
Score: [0-5]

Description:
[Factual description of what was observed — what exists vs. what is required]

Evidence Reviewed:
[List of documents and interviews that led to this finding]

Requirement Reference:
[Exact requirement text from ISO/IEC 42001:2023]

Risk if Unresolved:
[Business and compliance risk of the gap]

Recommended Corrective Action:
[Specific actions to address the gap, with implementation reference to iso-42001-implementation-guide.md]
```

### Assessment Summary Dashboard

| Control Family | Controls Assessed | Score 0-1 | Score 2 | Score 3-4 | Score 5 | Major NCs | Minor NCs |
|---------------|:-----------------:|:---------:|:-------:|:---------:|:-------:|:---------:|:---------:|
| A.2 — AI Policies | 5 | | | | | | |
| A.3 — Internal Org | 3 | | | | | | |
| A.4 — Resources | 5 | | | | | | |
| A.5 — Impact Assessment | 4 | | | | | | |
| A.6 — Lifecycle | 6 | | | | | | |
| A.7 — Data | 5 | | | | | | |
| A.8 — Information | 4 | | | | | | |
| A.9 — Use of AI | 3 | | | | | | |
| A.10 — Third Party | 3 | | | | | | |
| HLS Clauses 4-10 | — | | | | | | |
| **Total** | **38** | | | | | | |
