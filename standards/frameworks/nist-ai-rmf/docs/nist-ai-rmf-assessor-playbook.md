---
type: reference
name: nist-ai-rmf-assessor-playbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-25
---

# NIST AI Risk Management Framework 1.0 Assessor Playbook

**Purpose:** Operational guide for assessors conducting NIST AI RMF 1.0 evaluations. Consolidates
assessment methodology, document requests, per-function guidance, and reporting into a single
assessor-focused reference.

**Audience:** Internal assessors, third-party consultants, and governance teams conducting AI RMF
current-state profiles or gap assessments.

**Related:** NIST AI 100-1 (January 2023), NIST AI Resource Center (airc.nist.gov), `controls.yaml`
(72 subcategories), `questions.yaml` (72 assessment questions)

---

## 1. Assessment Overview

### What NIST AI RMF Assessment Produces

A NIST AI RMF assessment produces a **current-state profile**: a scored record of the organization's
AI risk management practices mapped against the 72 subcategories across four functions. The profile
shows where the organization stands today (current-state profile) and can be compared to a defined
desired state (target profile) to produce a gap analysis.

Unlike ISO 42001, there is no certification against NIST AI RMF. Assessment is self-assessment or
third-party assessment, producing a profile report rather than a conformance certificate. The value
is in the structured gap identification and the Tier determination, which locates the organization
on the RMF's maturity spectrum.

### Assessment Types

| Type | Scope | Typical Use |
|------|-------|-------------|
| Full profile | All 72 subcategories | Baseline assessment, annual review |
| Targeted | Single function (GOVERN, MAP, MEASURE, or MANAGE) | Function-specific remediation validation |
| Gap-only | Subcategories with no or partial implementation | Prioritization before a full assessment |
| Delta assessment | Subcategories changed since last cycle | Reassessment after remediation work |

### Assessment Duration

- **Small organization, single AI system:** 1–2 weeks
- **Mid-size organization, multiple AI systems:** 2–4 weeks
- **Large organization, enterprise AI portfolio:** 4–8 weeks

Duration is driven primarily by the number of AI systems in scope, document availability, and
stakeholder scheduling. Allow additional time if the organization has not previously conducted an
AI risk assessment — document gathering alone can take a full week.

### Quick Reference

| Function | Subcategories | Primary Domain | Assessment Focus |
|----------|:------------:|----------------|-----------------|
| GOVERN | 30 | Governance, policy, culture | Policies, accountability, workforce, culture, engagement, supply chain |
| MAP | 19 | Context and risk identification | Context, categorization, benefits/costs, component risks, impacts |
| MEASURE | 14 | Evaluation and monitoring | Methods, evaluation (TEVV), risk tracking, feedback loops |
| MANAGE | 9 | Risk treatment and response | Risk response, strategies, third-party, post-deployment |
| **Total** | **72** | | |

**Evidence types across all functions:**
- Policy and governance documents (AI policies, RACI matrices, governance charters)
- Risk registers and impact assessments
- Technical documentation (model cards, TEVV records, architecture docs)
- Testing results (adversarial, bias/fairness, safety, performance)
- Incident records and response documentation
- Third-party and supply chain management records
- Training and awareness records
- Monitoring logs and review records

**Important:** NIST AI RMF produces no certification. The output is a profile, not a pass/fail.

### Scoring Approach

Score each subcategory against one of three states, using the `scoring` fields in `questions.yaml`:

| Score | Label | Meaning |
|-------|-------|---------|
| Full | Full Implementation | The subcategory's requirements are documented, operationalized, and consistently practiced. Evidence can be produced for all criteria in the `full` scoring field. |
| Partial | Partial Implementation | Some elements are in place but the subcategory is not fully implemented. Evidence exists for some criteria. |
| Not Implemented | Not Implemented | No evidence of implementation. The subcategory's requirements are absent. |

### Tier Mapping

After scoring all subcategories in a function, determine the organization's Tier for that function.
The RMF defines four Tiers:

| Tier | Label | Profile Characteristics |
|------|-------|------------------------|
| Tier 1 | Partial | AI risk practices are ad hoc, reactive, and not formally documented. Risk management is informal. |
| Tier 2 | Risk-Informed | Risk management practices are approved but may not be organization-wide. Awareness exists but is not consistent. |
| Tier 3 | Repeatable | Formally approved practices implemented consistently across the organization. Regularly updated. |
| Tier 4 | Adaptive | Practices based on lessons learned, continuous improvement, and adaptation to emerging AI threats and opportunities. |

Assessors determine tier per function by evaluating the distribution of Full/Partial/Not Implemented
scores and the quality of evidence. A function where most subcategories score Partial with limited
evidence of consistent execution maps to Tier 1–2. Functions where practices are documented,
consistently applied, and subject to review map to Tier 3–4.

---

## 2. Pre-Assessment Document Request List

Send this request to the client at least one week before fieldwork begins. Non-receipt or
significant delays in document production are themselves indicators of program maturity.

### GOVERN — Document Requests

| Document | Subcategory Reference | Red Flag If Missing |
|----------|-----------------------|---------------------|
| AI legal and regulatory inventory or register | GOVERN 1.1 (Q-NIST-AI-RMF-GV-001) | No process for tracking applicable AI regulations |
| AI policy documents referencing trustworthiness characteristics | GOVERN 1.2 (Q-NIST-AI-RMF-GV-002) | Trustworthy AI principles not operationalized |
| Risk tolerance statement or policy with AI risk tiering criteria | GOVERN 1.3 (Q-NIST-AI-RMF-GV-003) | No basis for proportionate risk management |
| AI risk management policy and procedures | GOVERN 1.4 (Q-NIST-AI-RMF-GV-004) | Risk management process undocumented |
| Monitoring and review schedule; RACI for AI risk management | GOVERN 1.5 (Q-NIST-AI-RMF-GV-005) | Reviews not planned or roles unclear |
| AI system inventory or register with risk classification | GOVERN 1.6 (Q-NIST-AI-RMF-GV-006) | Unknown AI system footprint |
| AI decommissioning policy or runbook | GOVERN 1.7 (Q-NIST-AI-RMF-GV-007) | No safe retirement process |
| RACI matrix or role descriptions for AI risk management | GOVERN 2.1 (Q-NIST-AI-RMF-GV-008) | Accountability unclear |
| AI risk management training curriculum and completion records | GOVERN 2.2 (Q-NIST-AI-RMF-GV-009) | Staff not equipped for AI risk duties |
| Board or executive AI governance charter; approval records for high-risk AI | GOVERN 2.3 (Q-NIST-AI-RMF-GV-010) | No executive ownership of AI risk |
| Team composition records showing diverse representation | GOVERN 3.1 (Q-NIST-AI-RMF-GV-011) | Risk decisions made without diverse input |
| Policy defining human-AI configurations and oversight roles | GOVERN 3.2 (Q-NIST-AI-RMF-GV-012) | Human oversight responsibilities undefined |
| AI ethics or safety policy; red teaming or safety reporting evidence | GOVERN 4.1 (Q-NIST-AI-RMF-GV-013) | Safety-first culture not institutionalized |
| AI risk documentation or model cards; risk registers | GOVERN 4.2 (Q-NIST-AI-RMF-GV-014) | Risks not documented at the team level |
| AI testing and incident identification procedures | GOVERN 4.3 (Q-NIST-AI-RMF-GV-015) | No structured practice for testing or incident sharing |
| External feedback collection mechanisms and integration records | GOVERN 5.1 (Q-NIST-AI-RMF-GV-016) | No external input on AI impacts |
| Feedback adjudication process; change log showing feedback-driven changes | GOVERN 5.2 (Q-NIST-AI-RMF-GV-017) | Feedback collected but not acted on |
| Third-party AI vendor risk management policy; vendor contracts with AI clauses | GOVERN 6.1 (Q-NIST-AI-RMF-GV-018) | Third-party AI risks unmanaged |
| Contingency plans for third-party AI failures; tabletop exercise records | GOVERN 6.2 (Q-NIST-AI-RMF-GV-019) | No fallback for high-risk third-party AI outages |

### MAP — Document Requests

| Document | Subcategory Reference | Red Flag If Missing |
|----------|-----------------------|---------------------|
| Use case documentation with intended purposes and deployment context | MAP 1.1 (Q-NIST-AI-RMF-MP-001) | Context undocumented at system level |
| Team composition records showing diverse representation; domain expert consultation | MAP 1.2 (Q-NIST-AI-RMF-MP-002) | Context established without diverse input |
| Strategic AI plan or roadmap aligned to organizational mission | MAP 1.3 (Q-NIST-AI-RMF-MP-003) | AI goals not aligned to mission |
| Business case documentation; re-evaluation records for existing AI systems | MAP 1.4 (Q-NIST-AI-RMF-MP-004) | Business value not defined or re-examined |
| Formal risk tolerance statement for AI systems | MAP 1.5 (Q-NIST-AI-RMF-MP-005) | Risk tolerance not applied to AI deployment |
| Requirements documentation from diverse stakeholders; socio-technical analysis | MAP 1.6 (Q-NIST-AI-RMF-MP-006) | Requirements gathered without socio-technical consideration |
| Technical design documents specifying AI methods and categorization records | MAP 2.1 (Q-NIST-AI-RMF-MP-007) | AI methods not documented |
| Model card or system documentation describing limitations; human oversight guidance | MAP 2.2 (Q-NIST-AI-RMF-MP-008) | Knowledge limits and oversight not documented |
| TEVV plan; data collection methodology; scientific integrity documentation | MAP 2.3 (Q-NIST-AI-RMF-MP-009) | No TEVV framework or scientific integrity consideration |
| Benefits analysis with performance benchmarks | MAP 3.1 (Q-NIST-AI-RMF-MP-010) | Benefits not examined or measured |
| Cost-benefit analysis including non-monetary harms; error impact assessment | MAP 3.2 (Q-NIST-AI-RMF-MP-011) | Error costs or non-monetary harms not analyzed |
| Scope definition with in-scope and out-of-scope use cases | MAP 3.3 (Q-NIST-AI-RMF-MP-012) | Application boundaries unclear |
| Operator proficiency requirements; competency assessment records | MAP 3.4 (Q-NIST-AI-RMF-MP-013) | Operator readiness not assessed |
| Human oversight procedures; oversight activity records | MAP 3.5 (Q-NIST-AI-RMF-MP-014) | Human oversight not defined or executed |
| Component risk mapping records; legal risk review records | MAP 4.1 (Q-NIST-AI-RMF-MP-015) | Third-party component risks unmapped |
| Risk control register for AI components including third-party | MAP 4.2 (Q-NIST-AI-RMF-MP-016) | Controls for AI components not documented |
| Impact assessment with likelihood and magnitude ratings | MAP 5.1 (Q-NIST-AI-RMF-MP-017) | Impacts not assessed or only harms considered |
| AI actor engagement plan; feedback integration records | MAP 5.2 (Q-NIST-AI-RMF-MP-018) | No structured engagement for impact feedback |

### MEASURE — Document Requests

| Document | Subcategory Reference | Red Flag If Missing |
|----------|-----------------------|---------------------|
| AI risk measurement methodology; selected metrics list with prioritization rationale | MEASURE 1.1 (Q-NIST-AI-RMF-MR-001) | Metrics not risk-prioritized |
| Metric review records; control effectiveness assessments linked to error reports | MEASURE 1.2 (Q-NIST-AI-RMF-MR-002) | Metrics not updated from operational data |
| Independent review records; assessor role definitions showing separation from development | MEASURE 1.3 (Q-NIST-AI-RMF-MR-003) | Developers self-assessing without independent review |
| TEVV test set documentation; metrics definitions; tool inventory | MEASURE 2.1 (Q-NIST-AI-RMF-MR-004) | TEVV not documented |
| IRB/ethics approval records; population representativeness analysis | MEASURE 2.2 (Q-NIST-AI-RMF-MR-005) | Human subject evaluation requirements not met |
| Performance evaluation reports; deployment condition simulation records | MEASURE 2.3 (Q-NIST-AI-RMF-MR-006) | Performance not tested against deployment conditions |
| Production monitoring dashboards; monitoring coverage documentation | MEASURE 2.4 (Q-NIST-AI-RMF-MR-007) | No production monitoring |
| Validation and reliability testing records; generalizability limitations documentation | MEASURE 2.5 (Q-NIST-AI-RMF-MR-008) | Validity not demonstrated or limitations not documented |
| Safety evaluation reports; residual risk assessment against tolerance | MEASURE 2.6 (Q-NIST-AI-RMF-MR-009) | Safety not evaluated or residual risk undocumented |
| Security assessment reports; resilience testing records | MEASURE 2.7 (Q-NIST-AI-RMF-MR-010) | Security and resilience not evaluated |
| Transparency risk assessment; model cards; audit trails | MEASURE 2.8 (Q-NIST-AI-RMF-MR-011) | Transparency and accountability risks unexamined |
| Model explainability documentation; output interpretation guidance | MEASURE 2.9 (Q-NIST-AI-RMF-MR-012) | Model not explained or output not interpreted |
| Privacy impact assessment; data minimization review records | MEASURE 2.10 (Q-NIST-AI-RMF-MR-013) | No privacy risk examination |
| Fairness and bias evaluation methodology; bias testing results across groups | MEASURE 2.11 (Q-NIST-AI-RMF-MR-014) | Bias testing not conducted or methodology undefined |
| Environmental impact assessment for AI training | MEASURE 2.12 (Q-NIST-AI-RMF-MR-015) | Environmental impact not assessed |
| TEVV effectiveness review records; process improvement records | MEASURE 2.13 (Q-NIST-AI-RMF-MR-016) | TEVV effectiveness not evaluated |
| AI risk tracking methodology; risk register with tracking history | MEASURE 3.1 (Q-NIST-AI-RMF-MR-017) | No systematic risk tracking over time |
| Documentation of hard-to-measure risks and alternative tracking approaches | MEASURE 3.2 (Q-NIST-AI-RMF-MR-018) | Difficult-to-measure risks not considered |
| User feedback and appeal mechanism documentation; community reporting channels | MEASURE 3.3 (Q-NIST-AI-RMF-MR-019) | No feedback or appeal mechanism for affected parties |
| Deployment context descriptions linked to measurement approaches | MEASURE 4.1 (Q-NIST-AI-RMF-MR-020) | Measurements not contextualized to deployment |
| Expert review records for trustworthiness measurements; AI actor input | MEASURE 4.2 (Q-NIST-AI-RMF-MR-021) | Trustworthiness results not externally reviewed |
| Performance trend documentation from consultation-driven reviews | MEASURE 4.3 (Q-NIST-AI-RMF-MR-022) | No measurement linkage to AI actor consultations |

### MANAGE — Document Requests

| Document | Subcategory Reference | Red Flag If Missing |
|----------|-----------------------|---------------------|
| Go/no-go decision records for AI deployment; decision criteria and authority | MANAGE 1.1 (Q-NIST-AI-RMF-MG-001) | Deployment decisions not formally authorized |
| Risk prioritization methodology; risk register with priority ratings | MANAGE 1.2 (Q-NIST-AI-RMF-MG-002) | All risks treated equally regardless of impact |
| Risk response plans for high-priority risks with mitigate/transfer/avoid/accept rationale | MANAGE 1.3 (Q-NIST-AI-RMF-MG-003) | High-priority risks without response plans |
| Residual risk documentation; disclosure records to downstream acquirers | MANAGE 1.4 (Q-NIST-AI-RMF-MG-004) | Residual risks not disclosed downstream |
| Resource assessment for AI risk management; non-AI alternative analysis | MANAGE 2.1 (Q-NIST-AI-RMF-MG-005) | Resources not assessed; AI used without evaluating alternatives |
| AI system maintenance and update procedures; value monitoring records | MANAGE 2.2 (Q-NIST-AI-RMF-MG-006) | No mechanism to sustain deployed AI value |
| Unknown risk response playbook; lessons learned from novel risk events | MANAGE 2.3 (Q-NIST-AI-RMF-MG-007) | No procedure for novel/unknown risks |
| AI system kill-switch or deactivation procedure; trigger criteria; assigned authority | MANAGE 2.4 (Q-NIST-AI-RMF-MG-008) | No ability to disengage underperforming AI |
| Third-party AI risk monitoring records; vendor risk review records | MANAGE 3.1 (Q-NIST-AI-RMF-MG-009) | Third-party AI risks monitored but controls not applied |
| Pre-trained model monitoring procedures; drift detection documentation | MANAGE 3.2 (Q-NIST-AI-RMF-MG-010) | Pre-trained models not specifically monitored |
| Post-deployment monitoring plan; user input capture mechanisms | MANAGE 4.1 (Q-NIST-AI-RMF-MG-011) | No post-deployment monitoring plan |
| Continual improvement plan; update records; stakeholder engagement records | MANAGE 4.2 (Q-NIST-AI-RMF-MG-012) | Improvements not measured or stakeholders not engaged |
| AI incident communication procedures; incident tracking register; recovery records | MANAGE 4.3 (Q-NIST-AI-RMF-MG-013) | Incidents not communicated to affected parties |

---

## 3. Assessment Area 1: GOVERN Function

The GOVERN function is the cross-cutting foundation of the AI RMF. It covers 30 subcategories across
six category groups (GOVERN 1–6). Assessors should treat GOVERN findings as systemic: weakness here
undermines the organization's ability to execute MAP, MEASURE, and MANAGE consistently. Begin with
GOVERN to establish the governance baseline before assessing operational functions.

**Target interviewees:** Chief AI Officer, Chief Risk Officer, General Counsel or Legal Counsel,
AI Ethics Lead, CISO, AI Program Manager, HR / Workforce Development Lead, Procurement Lead

---

### GOVERN 1 — Policies, Processes, and Practices (GOVERN 1.1–1.7)

**What these subcategories require:**
The organization has documented, transparent, and effectively implemented policies covering legal and
regulatory requirements for AI (1.1), trustworthy AI characteristics integrated into practices (1.2),
risk management activities proportionate to risk tolerance (1.3), a transparent risk management process
based on risk priorities (1.4), ongoing monitoring with defined roles (1.5), an AI system inventory (1.6),
and safe decommissioning procedures (1.7).

**Key interview questions:**
- "Show me your AI regulatory inventory. How do you identify new AI regulations that apply to your
  business? Who owns the tracking process?"
- "Walk me through how trustworthy AI principles — fairness, transparency, accountability,
  safety — are reflected in your day-to-day development and deployment processes. Can you point
  to a specific policy or checklist?"
- "How do you determine how much risk management rigor to apply to a given AI system? Show me
  how risk tolerance is applied to a current AI project."
- "Where is your AI risk management policy published? Who can access it?"
- "Show me your AI system inventory. How do you ensure it stays current when new AI systems are
  built or acquired?"
- "What happens when an AI system is retired? Walk me through the last decommissioning."

**Evidence to examine:**
- Legal and regulatory AI inventory or register (Q-NIST-AI-RMF-GV-001)
- AI policy documents referencing trustworthiness characteristics; development checklists (Q-NIST-AI-RMF-GV-002)
- Risk tolerance statement with AI risk tiering criteria and records of differentiated application (Q-NIST-AI-RMF-GV-003)
- AI risk management policy and procedures with evidence of publication and access (Q-NIST-AI-RMF-GV-004)
- Monitoring and review schedule; RACI matrix; review meeting records (Q-NIST-AI-RMF-GV-005)
- AI system inventory with risk classifications and process for adding new systems (Q-NIST-AI-RMF-GV-006)
- AI decommissioning policy with evidence of at least one completed retirement (Q-NIST-AI-RMF-GV-007)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Regulatory inventory is current with owners and review dates. Trustworthy AI criteria are measurable and in checklists. Risk tolerance has defined tiers applied consistently. Policy is published and accessible. Inventory is complete and risk-classified. Decommissioning procedures are documented and tested. |
| Partial | Requirements exist in policy but operationalization is incomplete — e.g., trustworthy AI in policy but absent from development checklists; inventory exists but is not risk-classified; decommissioning procedure referenced but untested. |
| Not Implemented | No regulatory tracking process; no AI policy; no inventory; no decommissioning procedures. |

**Common gaps:**
- Regulatory inventory is a one-time list, not maintained — no review dates, no owner
- Trustworthy AI principles exist in an ethics statement but are not translated into process controls
- Risk tolerance stated as a general principle without tiering criteria that change what activities are required
- AI inventory managed as a spreadsheet with no update process — frequently out of date
- No decommissioning procedure — retired AI systems leave data and dependencies unmanaged

---

### GOVERN 2 — Accountability Structures (GOVERN 2.1–2.3)

**What these subcategories require:**
Roles and responsibilities for AI risk management are documented and understood (2.1), personnel and
partners receive AI risk management training (2.2), and executive leadership takes active responsibility
for AI risk decisions (2.3).

**Key interview questions:**
- "Who is responsible for AI risk management in your organization? Show me the RACI or role
  description that defines that responsibility."
- "What training does a new engineer receive on AI risk management before working on an AI system?
  What about a product manager? Show me completion records."
- "When a high-risk AI deployment is approved, who approves it? Can you show me the approval
  record for a recent high-risk AI deployment?"
- "Has the board or a senior executive committee ever reviewed AI risk? Show me the record."

**Evidence to examine:**
- RACI matrix or role descriptions for AI risk management; organizational chart showing AI governance (Q-NIST-AI-RMF-GV-008)
- AI risk management training curriculum; completion records for relevant staff (Q-NIST-AI-RMF-GV-009)
- Board or executive AI governance charter; executive sign-off on high-risk AI deployments; board meeting minutes (Q-NIST-AI-RMF-GV-010)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented roles with evidence of staff awareness. Role-based training with completion records and regular refreshes. Board or executive committee with documented AI oversight activity — meeting minutes, approval records. |
| Partial | Roles documented but awareness not verified. Training exists but coverage is incomplete or refresh cycle undefined. Executive responsibility stated in policy but no evidence of exercise. |
| Not Implemented | No documented roles; no training; no executive accountability record. |

**Common gaps:**
- RACI exists but staff interviewed cannot describe their AI risk responsibilities — roles on paper, not in practice
- Training is a one-time onboarding module with no refresh — staff working on AI may have two-year-old training
- Executive accountability confined to a governance policy statement — no board minutes reference AI risk, no executive has approved a high-risk deployment

---

### GOVERN 3 — Workforce Diversity and Human-AI Oversight (GOVERN 3.1–3.2)

**What these subcategories require:**
AI risk decisions are informed by a diverse, interdisciplinary team throughout the lifecycle (3.1), and
policies define roles and responsibilities for human-AI configurations and oversight (3.2).

**Key interview questions:**
- "Who is involved in AI risk decisions? Can you show me the team composition for a recent risk
  review — who was in the room, what backgrounds were represented?"
- "When you deploy an AI system, what level of human oversight is required? How do you define
  human-in-the-loop versus human-on-the-loop versus automated? Show me where that's documented."
- "For a fully automated AI decision, what is the review and appeal process?"

**Evidence to examine:**
- Team composition records showing diverse representation; interdisciplinary review documentation (Q-NIST-AI-RMF-GV-011)
- Policy defining human-AI configurations; role definitions for oversight positions; operating procedures requiring human intervention (Q-NIST-AI-RMF-GV-012)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Diverse team composition documented with interdisciplinary input records. Human-AI configuration policies with defined roles and evidence of operationalization. |
| Partial | Diversity goal referenced but not verified. Oversight referenced but configurations not formally defined or oversight activities not recorded. |
| Not Implemented | Homogeneous risk team with no diversity consideration. No human oversight policy. |

**Common gaps:**
- "Diverse team" means technical diversity (engineers, data scientists) but lacks domain expertise,
  legal, ethics, or affected community perspectives
- Human oversight policy exists for customer-facing AI but not for internal AI decision systems
  (HR tools, procurement scoring, fraud detection)

---

### GOVERN 4 — Organizational Culture (GOVERN 4.1–4.3)

**What these subcategories require:**
The organization fosters a critical thinking and safety-first mindset in AI work (4.1), teams document
risks and impacts of the AI they build and deploy (4.2), and practices exist for AI testing, incident
identification, and information sharing (4.3).

**Key interview questions:**
- "How does your organization encourage engineers to raise AI safety concerns? If someone sees a
  potential harm, what do they do? Is there a channel, a process, protection from retaliation?"
- "Show me the risk documentation for your last AI deployment. What was documented before launch?"
- "Walk me through how you test an AI system before deployment. Who conducts red team exercises?
  How are results shared?"
- "When an AI incident occurs, how is it identified, classified, and reported? Show me a recent
  incident record."

**Evidence to examine:**
- AI ethics or safety policy; psychological safety mechanisms; red team exercise records (Q-NIST-AI-RMF-GV-013)
- Model cards or risk registers for deployed AI systems; impact assessments for new deployments (Q-NIST-AI-RMF-GV-014)
- AI testing and red teaming procedures; incident identification and reporting procedures; information sharing records (Q-NIST-AI-RMF-GV-015)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented safety-first culture policy with operational mechanisms (safety reporting channel, red team program). Consistent risk documentation across AI systems with model cards and impact assessments. Testing, incident identification, and information sharing practiced and evidenced. |
| Partial | Safety mindset in policy but no operational mechanisms. Risk documentation exists for some systems but not systematically. Testing exists but incident identification or information sharing not formalized. |
| Not Implemented | No safety culture policy or mechanism. No risk documentation practice. No AI testing or incident process. |

**Common gaps:**
- Safety reporting mechanisms exist on paper but staff are unaware of them or perceive raising concerns as risky
- Model cards created at launch but never updated — documentation for deployed systems is stale
- AI incidents classified as software bugs and tracked in general IT systems — no AI-specific identification or pattern analysis

---

### GOVERN 5 — External Engagement (GOVERN 5.1–5.2)

**What these subcategories require:**
The organization collects, considers, prioritizes, and integrates feedback from external parties on
AI impacts (5.1), and mechanisms are established for AI teams to regularly incorporate adjudicated
feedback from relevant AI actors (5.2).

**Key interview questions:**
- "How do you collect feedback from people outside your team — users, affected communities,
  regulators — on the impacts of your AI systems? Show me a recent example."
- "When external feedback is received, how do you decide what to act on? Is there an adjudication
  process? Show me where feedback led to a system change."
- "For an AI system affecting a specific community (e.g., a hiring tool, a credit scoring model),
  have you engaged with members of that community? What did you do with what you learned?"

**Evidence to examine:**
- External feedback collection mechanisms; prioritization decisions; evidence of feedback integration (Q-NIST-AI-RMF-GV-016)
- Feedback adjudication process; change log showing feedback-driven changes (Q-NIST-AI-RMF-GV-017)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Formal external feedback process with documented collection, review, prioritization, and integration records. Feedback loop with adjudication and evidence of system updates. |
| Partial | Feedback collected informally (support tickets, NPS surveys) but no systematic prioritization or integration. Feedback received but adjudication not systematic. |
| Not Implemented | No external feedback mechanism. No AI actor feedback loop. |

**Common gaps:**
- General product feedback mechanisms (surveys, support) are claimed as AI feedback mechanisms — they do not target AI-specific impacts
- Feedback adjudication left to engineering discretion — no governance around which feedback gets acted on and why
- Affected community engagement limited to post-launch incident response rather than proactive involvement

---

### GOVERN 6 — Third-Party and Supply Chain (GOVERN 6.1–6.2)

**What these subcategories require:**
Policies address AI risks from third-party entities including infringement risks (6.1), and contingency
processes handle failures in high-risk third-party AI systems (6.2).

**Key interview questions:**
- "Do you use any AI from third parties — models, APIs, data pipelines? What risk review did you
  conduct before adopting them? Show me the vendor contract with AI-specific provisions."
- "What IP and data rights review do you conduct on third-party AI? Who reviews for training data
  infringement risk?"
- "If [third-party AI provider] went down for 48 hours, what happens to your operations? Is there
  a fallback? Has it been tested?"
- "Show me your contingency plan for your highest-risk third-party AI dependency."

**Evidence to examine:**
- Third-party AI vendor risk management policy; IP infringement review procedures; vendor contracts with AI clauses (Q-NIST-AI-RMF-GV-018)
- Business continuity plans for third-party AI failures; tested fallback procedures (Q-NIST-AI-RMF-GV-019)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Third-party AI risk policy with vendor contracts, IP review procedures, and evidence of enforcement. Contingency plans for high-risk third-party AI with tested fallback procedures. |
| Partial | Third-party risk addressed in general vendor policy without AI-specific provisions. General BCP exists but not adapted for AI-specific failure modes. |
| Not Implemented | No third-party AI risk policy. No contingency process for third-party AI failures. |

**Common gaps:**
- Foundation model providers governed by general IT vendor management — no AI-specific risk provisions (training data rights, bias risk, output indemnification)
- Contingency plans exist for cloud infrastructure failures but not specifically for AI API failures or model deprecation events
- IP infringement risk for training data used by third-party models not reviewed — legal exposure unassessed

---

## 4. Assessment Area 2: MAP Function

The MAP function covers 19 subcategories across five category groups (MAP 1–5). It focuses on establishing
context, categorizing AI systems, examining benefits and costs, mapping component risks, and characterizing
impacts before measurement and management activities begin. A weak MAP function means the organization
is measuring and managing risks it has not properly identified or scoped.

**Target interviewees:** AI Product Manager, AI/ML Engineering Lead, Data Scientist, Legal Counsel,
Domain Expert, UX Researcher, Risk Lead

---

### MAP 1 — Context Establishment (MAP 1.1–1.6)

**What these subcategories require:**
Intended purposes, laws, norms, and deployment settings are understood (1.1); the context-establishing
team reflects diversity (1.2); organizational AI goals are documented (1.3); business value is defined
or re-evaluated (1.4); risk tolerances are documented (1.5); and requirements are elicited from diverse
actors with socio-technical implications considered (1.6).

**Key interview questions:**
- "For [specific AI system], show me where the intended use and deployment context is documented.
  What regulations apply? What norms and expectations shape how users interact with it?"
- "Who was involved in defining the context for this AI system? Can you walk me through the team
  composition — not just roles, but backgrounds and perspectives represented?"
- "Show me where this AI system's purpose connects to the organization's broader AI strategy and
  mission."
- "How did you determine your risk tolerance for this AI system? Walk me through a risk tolerance
  decision that shaped how the system was designed."
- "When you gathered requirements, who did you talk to? Were users or affected communities
  included? Was there any socio-technical analysis — thinking through how the technology
  interacts with people, institutions, and social dynamics?"

**Evidence to examine:**
- Use case documentation with intended purposes and deployment context; regulatory landscape analysis (Q-NIST-AI-RMF-MP-001)
- Team composition records; domain expert consultation records; user experience research (Q-NIST-AI-RMF-MP-002)
- Strategic AI plan or roadmap with leadership approval (Q-NIST-AI-RMF-MP-003)
- Business case documentation; value metrics; re-evaluation records for existing systems (Q-NIST-AI-RMF-MP-004)
- Formal risk tolerance statement with leadership approval; evidence of application in deployment decisions (Q-NIST-AI-RMF-MP-005)
- Requirements documentation from diverse stakeholders; socio-technical analysis; sign-off records (Q-NIST-AI-RMF-MP-006)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Comprehensive context documentation with applicable laws, deployment norms, and domain expert sign-off. Diverse interdisciplinary team documented with input records. AI strategy linked to mission with leadership approval. Business case with measurable value metrics and re-evaluation schedule. Documented risk tolerance applied in deployment decisions. Requirements from diverse actors with socio-technical analysis. |
| Partial | Some context documented but legal landscape or norms incomplete. Diversity goal referenced but not verified. Business value described qualitatively. Risk tolerance mentioned but not consistently applied. Requirements documented without socio-technical analysis. |
| Not Implemented | No context documentation. No AI strategy or mission alignment. No risk tolerance. No requirements elicitation process. |

**Common gaps:**
- Context documents are one-time pre-deployment artifacts — not re-evaluated when the system is extended to new use cases
- Socio-technical implications analysis is absent — requirements gather functional needs but not implications for affected communities, equity, or social systems
- Risk tolerance exists at the organizational level but is not applied to individual AI systems — no per-system determination

---

### MAP 2 — AI System Categorization (MAP 2.1–2.3)

**What these subcategories require:**
The AI tasks and methods are defined and documented (2.1); the system's knowledge limits and human
oversight guidance are documented (2.2); and TEVV and scientific integrity considerations are
identified and documented (2.3).

**Key interview questions:**
- "Show me the technical documentation for [AI system]. What type of AI is it — classifier,
  generative model, recommender? What specific task does it perform?"
- "What does this system not know? Where does its knowledge end, and what happens when it
  encounters inputs outside that boundary? Show me where this is documented for operators."
- "How do users know when to trust the output versus when to question it? Is there oversight
  guidance? What does it say?"
- "Show me your TEVV plan. What scientific integrity considerations did you document — how was
  data collected, what experimental design choices were made, and how were those choices documented?"

**Evidence to examine:**
- Technical design documents specifying AI methods and task definitions; categorization records (Q-NIST-AI-RMF-MP-007)
- Model card or system documentation with known limitations; human oversight guidance; failure mode analysis (Q-NIST-AI-RMF-MP-008)
- TEVV plan; experimental design documentation; scientific integrity policy or checklist (Q-NIST-AI-RMF-MP-009)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Complete, current technical documentation with categorization. Documented knowledge limits with failure mode analysis and human oversight guidance for operators. TEVV plan with scientific integrity documentation for data collection and experimental design. |
| Partial | AI methods partially documented but not current. Limitations noted but human oversight guidance absent. TEVV exists but scientific integrity or data selection considerations missing. |
| Not Implemented | No documentation of AI tasks, methods, or categorization. No knowledge limit or oversight documentation. No TEVV framework. |

**Common gaps:**
- Model cards created but not updated after model version changes — limitations documented for v1 but not re-examined for v2
- Human oversight guidance tells operators the system "may make errors" without specifying what those errors look like or what the operator should do about them
- Scientific integrity documentation covers model training but not data collection methodology — selection bias undocumented

---

### MAP 3 — Benefits, Costs, and Scope (MAP 3.1–3.5)

**What these subcategories require:**
Benefits are examined and documented (3.1); costs including non-monetary costs from errors are examined (3.2);
targeted application scope is specified (3.3); operator proficiency processes are defined (3.4); and human
oversight processes are defined (3.5).

**Key interview questions:**
- "Show me the benefits analysis for this AI system. What are the expected benefits, and how are you
  measuring whether you're realizing them?"
- "What happens when this system makes an error? Not just technically — what is the cost to the person
  or organization affected? Show me where that analysis is documented."
- "What is this system supposed to do, and what is it explicitly not supposed to do? Show me the scope
  definition. Are there documented use cases that are out of scope?"
- "What training or certification is required before someone operates this AI system? How do you verify
  they're capable?"
- "Show me the human oversight process. Who reviews AI outputs, how often, and what can they do when
  they disagree with the system?"

**Evidence to examine:**
- Benefits analysis with quantified metrics and benchmarks (Q-NIST-AI-RMF-MP-010)
- Cost-benefit analysis including non-monetary harms; error impact assessment (Q-NIST-AI-RMF-MP-011)
- Scope definition with explicit in-scope and out-of-scope boundaries (Q-NIST-AI-RMF-MP-012)
- Operator proficiency requirements; competency assessment records; trustworthiness criteria for operators (Q-NIST-AI-RMF-MP-013)
- Human oversight policy and procedures; oversight activity records (Q-NIST-AI-RMF-MP-014)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented benefits analysis with metrics tracked against benchmarks. Cost analysis covering non-monetary harms and error costs with historical incident data. Explicit scope with boundaries linked to capability and context. Proficiency requirements assessed and recorded. Oversight procedures implemented and evidenced. |
| Partial | Benefits qualitatively described. Monetary costs only without non-monetary harm analysis. Scope described informally. Proficiency requirements defined but not assessed. Oversight referenced but not recorded. |
| Not Implemented | No benefits analysis. No cost or harm analysis. No scope definition. No operator proficiency or oversight process. |

**Common gaps:**
- Error cost analysis covers system downtime and business loss but not the cost to individuals affected by incorrect AI decisions
- Application scope defined as "any request the model can handle" — no explicit boundaries or prohibited use cases
- Human oversight documented but evidence of execution (oversight logs, review records) cannot be produced

---

### MAP 4 — Component Risk Mapping (MAP 4.1–4.2)

**What these subcategories require:**
Approaches for mapping AI technology and legal risks of components — including third-party data and
software — are in place and documented (4.1); and internal risk controls for all components including
third-party AI are identified and documented (4.2).

**Key interview questions:**
- "Walk me through how you assess the risks of the individual components of this AI system — the
  training data, the model itself, any APIs or third-party services. Show me the component risk map."
- "What legal risks did you identify in the components? Data licensing, model IP, copyright in training
  data — how was this reviewed?"
- "For each component risk you identified, what control exists? Show me the control register for this
  system's components."

**Evidence to examine:**
- Component risk mapping methodology; third-party component risk assessment records; legal risk review records (Q-NIST-AI-RMF-MP-015)
- Risk control register for AI system components including third-party; control testing evidence (Q-NIST-AI-RMF-MP-016)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented component risk mapping with legal review records and consistent application across deployments. Complete control register covering all components with testing evidence. |
| Partial | Risk mapping partially applied or legal risks not included. Controls identified for some components but coverage incomplete. |
| Not Implemented | No component risk mapping. No control documentation for AI system components. |

**Common gaps:**
- Third-party model APIs assessed for uptime SLAs but not for AI-specific risks (model drift, training data provenance, output bias)
- Legal risk review covers software licensing but does not extend to training data rights or potential copyright claims in model outputs

---

### MAP 5 — Impact Characterization (MAP 5.1–5.2)

**What these subcategories require:**
Likelihood and magnitude of each identified impact — both beneficial and harmful — are identified and
documented (5.1); and practices and personnel for regular stakeholder engagement and impact feedback
integration are in place (5.2).

**Key interview questions:**
- "Show me the impact assessment for this AI system. Both beneficial impacts and harmful impacts —
  what did you identify, and what are the likelihood and magnitude ratings for each?"
- "How did you arrive at the likelihood and magnitude ratings? What methodology underpins those
  numbers?"
- "Who reviews impact assessments beyond the AI team? Are affected communities or domain experts
  involved in validating the impact characterization?"
- "How often do you engage with users or affected communities specifically about AI impacts? Who
  runs that engagement, and what happens with what you learn?"

**Evidence to examine:**
- Impact assessment with likelihood and magnitude ratings for both beneficial and harmful impacts; stakeholder review records (Q-NIST-AI-RMF-MP-017)
- AI actor engagement plan; designated personnel for impact feedback; feedback integration records (Q-NIST-AI-RMF-MP-018)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented impact assessment with both beneficial and harmful impacts rated for likelihood and magnitude, reviewed by stakeholders. Documented engagement plan with assigned personnel, executed activities, and integration records. |
| Partial | Impacts identified but likelihood/magnitude not assessed, or only harmful impacts documented. Engagement occurs informally without planning or documentation. |
| Not Implemented | No impact identification or assessment. No stakeholder engagement for AI impacts. |

**Common gaps:**
- Impact assessments document harmful impacts only — beneficial impacts not examined, which also means benefits are not systematically realized or measured
- Likelihood and magnitude ratings assigned by the development team without a documented methodology — ratings are opinions, not analysis
- Stakeholder engagement for AI impacts relies on generic user research rather than targeted AI impact feedback

---

## 5. Assessment Area 3: MEASURE Function

The MEASURE function covers 14 subcategories across four category groups (MEASURE 1–4). It focuses on
selecting and applying metrics, evaluating AI systems for trustworthy characteristics (TEVV), tracking
identified risks over time, and closing feedback loops from domain experts and AI actors.

**Target interviewees:** AI/ML Engineering Lead, Data Scientist, QA Lead, CISO, Privacy Officer,
AI Ethics Lead, Domain Expert

---

### MEASURE 1 — Measurement Methods (MEASURE 1.1–1.3)

**What these subcategories require:**
Approaches and metrics for AI risk measurement are selected starting with the most significant risks (1.1);
metrics and control effectiveness are regularly assessed and updated based on errors and impacts (1.2);
and independent internal experts or third-party assessors are involved in assessments (1.3).

**Key interview questions:**
- "Show me your AI risk measurement methodology. Which risks are you measuring, and why did you
  prioritize those over others?"
- "When was the last time you reviewed your AI risk metrics? What changed, and why? Show me the
  update record."
- "Who conducts AI risk assessments — are they the same people who built the system? How do you
  ensure independence?"
- "Show me the most recent independent assessment. What was the scope, who conducted it, and
  what was found?"

**Evidence to examine:**
- AI risk measurement methodology; selected metrics list with prioritization rationale (Q-NIST-AI-RMF-MR-001)
- Metric review records with update history; control effectiveness assessments; error and incident reports linked to metric updates (Q-NIST-AI-RMF-MR-002)
- Independent review records; assessor role definitions showing separation from development; assessment frequency and scope (Q-NIST-AI-RMF-MR-003)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented risk measurement methodology with prioritized metrics and evidence of application to significant risks. Regular metric and control reviews with documented updates driven by error and incident data. Regular independent assessments with documented separation of duties and review records. |
| Partial | Metrics exist but not risk-prioritized or application is inconsistent. Metrics reviewed occasionally without defined schedule or incident linkage. Some independent review but not systematic. |
| Not Implemented | No measurement methodology. No metric review process. No independent assessment. |

**Common gaps:**
- Metrics focus on model accuracy and performance without risk-specific metrics (error rate by demographic group, failure rate under adversarial inputs, privacy leakage rate)
- Metrics reviewed annually as part of general model performance review — not triggered by incidents or control failures
- Internal reviews conducted by the same team that built the system — no separation of duties, no independent perspective

---

### MEASURE 2 — AI System Evaluation (MEASURE 2.1–2.13)

**What these subcategories require:**
TEVV documentation is complete (2.1); human subject evaluations meet requirements (2.2); performance
criteria are measured under deployment conditions (2.3); the system is monitored in production (2.4);
validity and reliability are demonstrated with documented limitations (2.5); safety risks are regularly
evaluated and residual risk demonstrated within tolerance (2.6); security and resilience are evaluated (2.7);
transparency and accountability risks are examined (2.8); the model is explained and output interpreted (2.9);
privacy risk is examined (2.10); fairness and bias are evaluated (2.11); environmental impact is assessed (2.12);
and TEVV effectiveness is evaluated (2.13).

**Key interview questions:**
- "Show me your TEVV documentation — test sets, metrics definitions, tools used. Is this current?"
- "Walk me through your pre-deployment testing. What conditions did you test under? How similar were
  those conditions to where the system is actually deployed?"
- "How do you monitor this system in production? Show me the dashboard. What triggers an alert?"
- "What safety risks did you identify for this system? Show me the residual risk assessment — does
  the residual risk fall within your tolerance?"
- "Have you conducted adversarial testing — attempting to attack, deceive, or abuse the system?
  Who conducted it? Show me the report."
- "Show me your bias and fairness evaluation. Which demographic groups did you test? What methodology
  did you use? What did you find and what did you do about it?"
- "What is this model's explainability approach? Can an operator or affected individual understand
  why the system produced a particular output?"
- "Show me the privacy impact assessment for this AI system."
- "Has the TEVV process itself been evaluated for effectiveness? Show me that review."

**Evidence to examine:**
- TEVV test set documentation; metrics definitions; tool inventory with versions (Q-NIST-AI-RMF-MR-004)
- IRB/ethics approval records; representativeness analysis; consent procedures (Q-NIST-AI-RMF-MR-005)
- Performance evaluation reports; deployment condition simulation records; assurance criteria (Q-NIST-AI-RMF-MR-006)
- Production monitoring dashboards; coverage documentation; alert response records (Q-NIST-AI-RMF-MR-007)
- Validation and reliability testing records; generalizability limitations documentation; model card (Q-NIST-AI-RMF-MR-008)
- Safety evaluation reports; residual risk assessment against tolerance (Q-NIST-AI-RMF-MR-009)
- Security assessment and adversarial testing reports; resilience testing records (Q-NIST-AI-RMF-MR-010)
- Transparency risk assessment; model cards; audit trails; accountability gap analysis (Q-NIST-AI-RMF-MR-011)
- Model explainability documentation; validation records; output interpretation guidance (Q-NIST-AI-RMF-MR-012)
- Privacy impact assessment; data minimization review; privacy risk register (Q-NIST-AI-RMF-MR-013)
- Fairness and bias methodology; testing results across demographic groups; remediation records (Q-NIST-AI-RMF-MR-014)
- Environmental impact assessment for AI training; sustainability criteria (Q-NIST-AI-RMF-MR-015)
- TEVV effectiveness review records; process improvement records (Q-NIST-AI-RMF-MR-016)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Comprehensive TEVV documentation with version history. Performance tested under deployment-similar conditions. Production monitoring with active alerting and review. Safety residual risk demonstrated within tolerance. Adversarial and resilience testing with remediation tracking. Bias testing with documented methodology across relevant groups and remediation. Privacy impact assessment with ongoing monitoring. Explainability documentation and user-facing output interpretation guidance. TEVV effectiveness reviewed. |
| Partial | TEVV partially documented. Performance tested under controlled but not deployment-similar conditions. Monitoring exists but alerting not operationalized. Safety evaluated without residual risk tolerance comparison. Bias testing conducted but methodology undocumented or group coverage incomplete. Privacy risks partially assessed. Model validated but explainability absent. |
| Not Implemented | No TEVV documentation. No production monitoring. No safety evaluation. No bias testing. No privacy impact assessment. No explainability. |

**Common gaps (MEASURE 2):**
- Metrics limited to accuracy and F1 scores — no risk-specific metrics (false negative rates for high-stakes decisions, performance degradation under distribution shift)
- Performance testing conducted in a lab environment, not under conditions representative of the actual deployment context
- No adversarial testing — security assessment covers infrastructure but not the AI model itself
- Bias testing conducted once at launch, not repeated after model updates or when the user population changes
- Privacy impact assessment is a general data privacy review, not AI-specific — does not address inference attacks, model inversion, or training data memorization
- TEVV effectiveness never reviewed — metrics from the first deployment cycle are still in use years later

---

### MEASURE 3 — Risk Tracking (MEASURE 3.1–3.3)

**What these subcategories require:**
Approaches, personnel, and documentation exist for regularly tracking existing, unanticipated, and
emergent risks (3.1); risk tracking considers settings where measurement is difficult (3.2); and
feedback processes for users and impacted communities to report problems and appeal outcomes are
established (3.3).

**Key interview questions:**
- "How do you track AI risks over time — not just at deployment, but on an ongoing basis? Show me
  your risk register with update history. Who is responsible for keeping it current?"
- "Have you ever identified an AI risk you didn't anticipate at deployment? What happened? Show me
  the record of how it was identified and responded to."
- "Are there risks associated with this AI system that you know are difficult to measure with current
  tools? How are you tracking those?"
- "How can a user who is negatively affected by this AI system report a problem or appeal an
  outcome? Walk me through the process end-to-end."

**Evidence to examine:**
- AI risk tracking methodology; risk register with ongoing update history; emergent risk identification records (Q-NIST-AI-RMF-MR-017)
- Documentation of difficult-to-measure risks; alternative tracking approaches; expert consultation records (Q-NIST-AI-RMF-MR-018)
- User feedback and appeal mechanism documentation; community reporting channels; feedback integration records (Q-NIST-AI-RMF-MR-019)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Systematic risk tracking with assigned personnel, regular cadence, and documented emergent risk identification. Documented consideration of difficult-to-measure risks with alternative approaches and expert consultation. Documented feedback and appeal mechanisms with records of receipt, review, and integration. |
| Partial | Risk tracking occurs but is not systematic or emergent risks not specifically tracked. Hard-to-measure risks acknowledged but no alternative tracking. Feedback mechanism exists but no appeal process or community channels. |
| Not Implemented | No risk tracking over time. No consideration of difficult-to-measure risks. No feedback or appeal mechanism. |

**Common gaps:**
- Risk register updated at deployment and annually during audit prep — not maintained as a living document between cycles
- No process for identifying novel or emergent AI risks (e.g., new attack techniques, regulatory changes, unexpected social effects)
- User feedback mechanisms (support tickets, NPS) are not designed to capture AI-specific harm — reports are miscategorized as product bugs
- No appeal process for individuals affected by automated AI decisions — particularly critical for consequential AI (lending, hiring, medical)

---

### MEASURE 4 — Measurement Feedback Loops (MEASURE 4.1–4.3)

**What these subcategories require:**
Measurement approaches are connected to deployment contexts and informed by expert and user consultation
(4.1); trustworthiness measurement results are informed by domain expert and AI actor input (4.2);
and measurable performance improvements or declines from consultations are identified and documented (4.3).

**Key interview questions:**
- "How do your measurement approaches reflect the specific context where this AI system is deployed?
  Did domain experts or end users help design what you measure and how?"
- "When you assess the trustworthiness of this system, who validates those results beyond the AI team?
  Show me a record of domain expert input into a trustworthiness assessment."
- "Has a consultation with an AI actor — user, operator, affected community member — led to a
  measurable change in system performance? Show me that record."

**Evidence to examine:**
- Deployment context descriptions linked to measurement approaches; domain expert consultation records (Q-NIST-AI-RMF-MR-020)
- Expert review records for trustworthiness measurements; AI actor input documentation (Q-NIST-AI-RMF-MR-021)
- Performance trend documentation from consultation-driven reviews; before/after comparison reports (Q-NIST-AI-RMF-MR-022)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Measurement approaches explicitly linked to deployment contexts with documented expert and user consultation. Trustworthiness measurements reviewed by domain experts and AI actors with documented interpretation. Documented performance trends from AI actor consultations with before/after comparison records. |
| Partial | Measurements taken but not contextualized or lacking expert input. Expert input sought but AI actor perspectives not incorporated. Consultations occur but performance changes not systematically measured. |
| Not Implemented | No context-linked measurement approaches. No external input into trustworthiness results. No performance measurement linked to consultations. |

**Common gaps:**
- Measurements designed by the AI engineering team reflect technical performance metrics — domain experts (clinicians, lawyers, social workers, domain practitioners) have not reviewed whether those metrics capture what actually matters in the deployment context
- Trustworthiness assessments reviewed internally — no external domain expert validation of whether the organization's self-assessment is credible

---

## 6. Assessment Area 4: MANAGE Function

The MANAGE function covers 9 subcategories across four category groups (MANAGE 1–4). It covers risk
response, sustaining value, handling novel risks, deactivation, third-party risk management, and
post-deployment monitoring and incident response.

**Target interviewees:** Chief Risk Officer, AI Program Manager, CISO, AI/ML Engineering Lead,
Incident Response Lead, Third-Party Risk Lead, Executive with AI deployment authority

---

### MANAGE 1 — Risk Response and Prioritization (MANAGE 1.1–1.4)

**What these subcategories require:**
A go/no-go determination is made for AI system deployment (1.1); risk treatment is prioritized by impact,
likelihood, and available resources (1.2); high-priority risk responses are developed and documented
covering mitigate/transfer/avoid/accept options (1.3); and negative residual risks to downstream acquirers
and end users are documented (1.4).

**Key interview questions:**
- "Show me the deployment decision record for [specific AI system]. What criteria were applied?
  Who had the authority to approve or halt deployment? What would have caused you to halt?"
- "How do you prioritize which AI risks to treat first? Show me the prioritization methodology and
  the current state of the risk register."
- "For the highest-priority AI risk right now, what is the response plan? Was mitigation, transfer,
  avoidance, or acceptance chosen? Show me the rationale."
- "What risks remain after treatment — the residual risks? Are downstream acquirers or users aware
  of those residual risks? How were they informed?"

**Evidence to examine:**
- Go/no-go decision records; defined criteria; decision authority documentation (Q-NIST-AI-RMF-MG-001)
- Risk prioritization methodology; risk register with priority ratings; resource allocation aligned to priorities (Q-NIST-AI-RMF-MG-002)
- Risk response plans for high-priority risks; strategy rationale; implementation records (Q-NIST-AI-RMF-MG-003)
- Residual risk documentation; disclosure records to downstream acquirers; end user communication of residual risk (Q-NIST-AI-RMF-MG-004)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented go/no-go process with defined criteria, decision authority, and records of deployment decisions. Documented prioritization methodology consistently applied with resource allocation aligned to priorities. Risk response plans for all high-priority risks with strategy rationale and implementation evidence. Residual risks documented with disclosure to downstream parties. |
| Partial | Go/no-go decisions made but criteria informal. Risks prioritized without documented methodology. Response plans exist for some high-priority risks. Residual risks documented but not disclosed. |
| Not Implemented | No formal deployment determination process. No risk prioritization. No risk response plans. No residual risk documentation. |

**Common gaps:**
- Go/no-go decisions made in engineering reviews without formal criteria — deployment proceeds unless someone raises a specific concern
- Risk acceptance is the de facto response when treatment costs are high — "accept" decisions are informal, undocumented, and not reviewed by leadership
- Residual risks documented in internal risk registers but not communicated to downstream integrators or end users — third parties build on AI outputs without knowing the limitations

---

### MANAGE 2 — Strategies to Maximize Benefits and Minimize Harms (MANAGE 2.1–2.4)

**What these subcategories require:**
Resources for AI risk management are assessed along with non-AI alternatives (2.1); mechanisms are in
place to sustain the value of deployed AI systems (2.2); procedures exist for responding to newly
identified unknown risks (2.3); and mechanisms exist to supersede, disengage, or deactivate AI systems
that demonstrate inconsistent performance (2.4).

**Key interview questions:**
- "When you decided to use AI for this application, did you consider whether a non-AI approach would
  be sufficient? Show me that analysis."
- "What mechanisms keep the value of this AI system from degrading over time — model drift, data
  changes, changing user needs? Who is responsible for that?"
- "If you discovered a risk in this AI system today that you hadn't anticipated — something genuinely
  new — what would you do? Walk me through the process. Show me the procedure."
- "If this AI system started producing outputs inconsistent with its intended purpose, what would you
  do to stop it? Who has the authority to turn it off? How quickly could that happen? Has that
  mechanism been tested?"

**Evidence to examine:**
- Resource assessment for AI risk management; non-AI alternative analysis; budget and staffing for AI risk management (Q-NIST-AI-RMF-MG-005)
- AI system maintenance and update procedures; value monitoring metrics and review records; retraining schedule (Q-NIST-AI-RMF-MG-006)
- Unknown risk response playbook; records of response to novel post-deployment risks; lessons learned documentation (Q-NIST-AI-RMF-MG-007)
- Kill-switch or deactivation procedure documentation; trigger criteria; assigned authority; testing records (Q-NIST-AI-RMF-MG-008)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Documented resource assessment with non-AI alternative analysis and verified allocation. Documented maintenance with value monitoring and evidence of performance-sustaining updates. Documented response procedures with evidence of execution for novel risks. Deactivation mechanism with defined trigger criteria, assigned authority, and testing records. |
| Partial | Resources allocated but alternatives not analyzed. Maintenance performed without systematic value monitoring. Response capability but procedures not formalized. Deactivation capability without defined trigger criteria or authority. |
| Not Implemented | No resource assessment. No maintenance mechanism. No procedure for novel risks. No deactivation mechanism. |

**Common gaps:**
- AI adoption decisions lack non-AI alternative analysis — AI is assumed to be the right approach without evaluating whether simpler, more interpretable methods would suffice and carry lower risk
- Model drift monitoring exists for performance metrics but not for risk-relevant indicators — a model may degrade in ways that increase harm without triggering a performance alert
- Deactivation is theoretically possible (engineers can stop the system) but no formal trigger criteria exist, no authority is assigned, and the mechanism has never been tested under realistic conditions

---

### MANAGE 3 — Third-Party Risk Management (MANAGE 3.1–3.2)

**What these subcategories require:**
AI risks and benefits from third-party resources are regularly monitored with risk controls applied
and documented (3.1); and pre-trained models are monitored as part of regular AI system monitoring (3.2).

**Key interview questions:**
- "Show me your third-party AI risk monitoring records. Which vendors are you monitoring, at what
  cadence, and using what controls?"
- "When a third-party AI vendor updates their model or service, how does that trigger a risk review
  on your side? Show me a record of a vendor change that triggered a re-assessment."
- "You use [foundation model / pre-trained model API]. How do you monitor that model for changes
  that could affect your system — drift, version changes, capability changes? Show me the monitoring
  records."

**Evidence to examine:**
- Third-party AI risk monitoring records; control assessment records; vendor risk review schedule (Q-NIST-AI-RMF-MG-009)
- Pre-trained model monitoring procedures; drift detection documentation; third-party model change management records (Q-NIST-AI-RMF-MG-010)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Regular third-party risk monitoring with documented controls and evidence of applied risk management. Pre-trained models included in monitoring program with drift detection and update management records. |
| Partial | Third-party risks monitored but controls not systematically applied or documented. Pre-trained models used but not specifically monitored beyond general system monitoring. |
| Not Implemented | No third-party AI risk monitoring. No monitoring of pre-trained models. |

**Common gaps:**
- Third-party AI risk reviews are annual vendor security reviews — they assess IT controls but not AI-specific risks (model changes, training data updates, bias drift)
- Pre-trained model updates from API providers are treated as automatic upgrades — no assessment of whether the updated model introduces new risks or changes behavior in ways that affect the organization's AI system

---

### MANAGE 4 — Post-Deployment Monitoring and Incident Response (MANAGE 4.1–4.3)

**What these subcategories require:**
Post-deployment monitoring plans are implemented with mechanisms to capture user and AI actor input
(4.1); measurable continual improvement activities are integrated into system updates with stakeholder
engagement (4.2); and incidents and errors are communicated to relevant AI actors including affected
communities, with tracking, response, and recovery documented (4.3).

**Key interview questions:**
- "Show me your post-deployment monitoring plan for [AI system]. What is being monitored, by whom,
  at what frequency? How is user input captured and evaluated?"
- "Walk me through the last AI system update cycle. What measurable improvements were included?
  How were stakeholders — users, operators, affected parties — engaged in defining those improvements?"
- "Show me your AI incident log. Walk me through a recent incident — how was it detected, who was
  notified, how was it resolved, and who was informed, including any communities affected?"
- "For an incident that affected a specific group of users, were they notified? How? Show me the
  communication record."

**Evidence to examine:**
- Post-deployment monitoring plan; user input capture mechanisms; feedback evaluation records (Q-NIST-AI-RMF-MG-011)
- Continual improvement plan; update records with improvement activities; stakeholder engagement records (Q-NIST-AI-RMF-MG-012)
- AI incident communication procedures; incident tracking register; recovery records (Q-NIST-AI-RMF-MG-013)

**Scoring indicators:**

| Score | Indicator |
|-------|-----------|
| Full | Implemented monitoring plan with user input mechanisms and records of feedback evaluation and action. Documented continual improvement activities integrated into update cycle with stakeholder engagement evidence. Documented incident communication with records of affected party notification, tracking, response, and recovery. |
| Partial | Monitoring in place but user input capture or feedback evaluation not systematic. AI updated but improvements not measurable or stakeholder engagement not documented. Incidents tracked internally but external communication or recovery documentation incomplete. |
| Not Implemented | No post-deployment monitoring plan. No continual improvement process. No AI incident communication or tracking. |

**Common gaps:**
- Post-deployment monitoring tracks uptime and API response times but does not capture user-facing harm signals (complaints, anomalous output patterns, demographic performance degradation)
- System updates driven by engineering priorities — no structured process for incorporating stakeholder input into what gets improved
- AI incidents documented in IT ticketing systems without AI-specific classification — no mechanism to identify patterns across incidents, notify affected communities, or report externally

---

## 7. Program-Level Scoring Summary

### Function-Level Scoring Table

Complete this table at the conclusion of fieldwork. Count subcategory scores per function and calculate
the function score percentage (Full implementations / total subcategories scored).

| Function | Subcategories | Full | Partial | Not Implemented | Function Score (%) |
|----------|:------------:|:----:|:-------:|:---------------:|:-----------------:|
| GOVERN | 30 | | | | |
| MAP | 19 | | | | |
| MEASURE | 14 | | | | |
| MANAGE | 9 | | | | |
| **Total** | **72** | | | | |

### Tier Determination Per Function

Using the subcategory score distribution, assign a Tier (1–4) per function:

| Function | Tier | Rationale |
|----------|------|-----------|
| GOVERN | | |
| MAP | | |
| MEASURE | | |
| MANAGE | | |
| **Overall Organization Tier** | | Lowest function tier or weighted judgment |

**Tier determination guidance:**
- Tier 1 (Partial): Most subcategories Not Implemented or Partial with limited evidence; practices are reactive and informal
- Tier 2 (Risk-Informed): Roughly half the subcategories at Full or strong Partial; practices approved but inconsistently applied
- Tier 3 (Repeatable): Most subcategories at Full; practices formally documented and consistently executed
- Tier 4 (Adaptive): All subcategories at Full with evidence of continuous improvement, lessons learned integration, and adaptation to emerging AI risks

The overall organization tier is generally determined by the lowest function tier. An organization
with Tier 3 GOVERN but Tier 1 MANAGE is operating at Tier 1 in practice.

### Gap Priority Matrix

Identify the highest-impact gaps for prioritization. HIGH risk_weight subcategories that score Not
Implemented are the starting point.

| Priority | Subcategory ID | Function | Current Score | Risk Weight | Recommended Action |
|----------|----------------|----------|:-------------:|:-----------:|--------------------|
| Critical | | | Not Implemented | HIGH | |
| Critical | | | Not Implemented | HIGH | |
| High | | | Partial | HIGH | |
| High | | | Partial | HIGH | |
| Medium | | | Partial | MEDIUM | |

### Mapping Findings to a Target Profile

After completing the current-state profile, work with the organization to define a target profile:
the desired state for the next assessment cycle (typically 12–18 months forward). For each gap,
define the target state (Full or Partial), the actions required to reach it, the owner, and the
timeline. The gap between current-state and target-state profiles is the remediation plan.

---

## 8. Common Findings by Function

### GOVERN — Common Findings

**GOVERN 1 — Policy exists but enforcement is absent.** The organization has an AI risk management
policy but development teams follow their own practices. The policy is a document, not a governance
mechanism. Assessor indicator: policy states practices that contradict what interviewees describe.

**GOVERN 2 — Accountability assigned on paper, not in practice.** RACI matrices name roles but
staff cannot describe their AI risk responsibilities. Executive accountability is confined to a
governance charter with no evidence of active exercise — no board AI risk discussion, no executive
approval of high-risk deployments. Assessor indicator: ask three different staff members who is
responsible for [specific AI risk activity] and get three different answers.

**GOVERN 3 — Third-party AI ungoverned.** The organization has mature governance for internally
built AI but no third-party AI risk policy. Foundation model providers, AI SaaS vendors, and
embedded AI in purchased software are outside the governance perimeter. Assessor indicator: vendor
contracts reviewed do not contain AI-specific provisions.

**GOVERN 4 — Safety culture policy without safety culture practices.** An AI ethics statement
exists. No safety reporting channel is known to staff. Red team exercises have never occurred. Model
cards are created at deployment and never updated. Assessor indicator: interview engineers — none can
name the safety reporting mechanism.

**GOVERN 5 — No formal decommissioning process.** AI systems are added to the inventory but never
removed. Retired AI systems leave behind data dependencies, API integrations, and user expectations.
Assessor indicator: the AI inventory contains systems that interviewees describe as "deprecated" or
"turned off" — no retirement records exist.

---

### MAP — Common Findings

**MAP 1 — No formal AI system inventory as MAP input.** The GOVERN inventory nominally exists but is
not actually used as input to MAP activities — context establishment happens per-project without
reference to the organization's overall AI portfolio and risk landscape.

**MAP 2 — Risk assessment done post-deployment.** Context, categorization, and impact analysis are
conducted during incident response rather than before deployment. The MAP function is retroactive.
Assessor indicator: impact assessment dates postdate system launch dates by months or years.

**MAP 3 — No categorization methodology.** AI systems are described technically but not categorized
by risk level. High-stakes AI (consequential decisions about people) receives the same pre-deployment
review as low-stakes AI (internal productivity tools). Assessor indicator: no risk classification
criteria, no differentiated pre-deployment processes by AI system risk tier.

**MAP 4 — Error costs analyzed only monetarily.** Cost analysis covers business losses from AI
failures — downtime, customer churn, rework — but not non-monetary costs: harm to individuals from
incorrect AI decisions, erosion of user trust, regulatory penalties. Assessor indicator: cost-benefit
analysis sections focus exclusively on financial metrics.

**MAP 5 — Beneficial impacts not examined.** Impact characterization covers only potential harms.
Beneficial impacts are not identified, which means they are also not measured — the organization
cannot demonstrate that its AI systems are delivering the expected benefits.

---

### MEASURE — Common Findings

**MEASURE 2 — Metrics limited to accuracy and performance.** The measurement program tracks model
accuracy, precision, recall, and API latency. Risk-specific metrics — fairness across demographic
groups, safety evaluation scores, privacy leakage rates, adversarial robustness — are absent.
Assessor indicator: the AI risk measurement methodology document is identical to the ML performance
tracking methodology.

**MEASURE 2.11 — Bias testing ad hoc or absent.** Fairness and bias evaluation was conducted once
during initial model development and has not been repeated since. Model updates, training data
changes, and shifts in the user population have not triggered reassessment. Assessor indicator: bias
testing dates predate the most recent model update.

**MEASURE 2.7 — No adversarial testing.** Security assessment covers the AI application's
infrastructure (authentication, authorization, logging) but the AI model itself has never been
subjected to adversarial inputs — prompt injection, model inversion, membership inference, or
evasion attacks. Assessor indicator: security team unfamiliar with OWASP LLM Top 10 or MITRE ATLAS.

**MEASURE 3 — No AI-specific incident feedback loop.** User reports and system errors feed into a
general IT incident management process. AI-specific harm is not classified separately, AI incident
patterns are not analyzed across events, and affected communities do not have a dedicated channel
for reporting AI harm.

**MEASURE 4 — Measurement not connected to deployment context.** Performance metrics are the same
across all deployment contexts — a model deployed to assess medical risk and one deployed to recommend
products are measured by the same methodology, even though the consequences of errors differ by orders
of magnitude.

---

### MANAGE — Common Findings

**MANAGE 1 — No AI-specific incident response.** AI incidents are handled as general IT or software
incidents. There is no AI-specific incident classification, no AI incident response procedure, no
designated AI incident response lead, and no mechanism for communicating AI incidents to affected
communities. Assessor indicator: ask the incident response lead to walk through the last AI incident —
they describe a technical outage, not an AI harm event.

**MANAGE 1 — Residual risk accepted without documentation.** High-priority risks are not fully
mitigated, and the gap between residual risk and risk tolerance is not documented or approved by
leadership. Risk acceptance is informal. Assessor indicator: risk register shows treatment plans for
most risks but critical HIGH risk_weight subcategories have no accepted residual risk documentation.

**MANAGE 2 — No kill-switch for underperforming AI.** There is no defined mechanism, criterion, or
authority for deactivating an AI system that produces outcomes inconsistent with its intended use.
Shutting down the system would require a senior engineering decision that has never been formalized.
Assessor indicator: engineers describe the shutdown process as "we would just stop calling the API"
with no formal procedure, trigger criteria, or authority structure.

**MANAGE 3 — Third-party model changes unmanaged.** Pre-trained model APIs are integrated into
production systems. When the provider silently updates the model, the organization does not conduct
a risk re-assessment. Model behavior changes are detected only when users report problems.
Assessor indicator: no model versioning records for third-party API dependencies; engineering team
unaware of the current model version in production.

**MANAGE 4 — No feedback loop from incidents to improvements.** Incidents are resolved and closed
without systematic lessons learned integration. The same classes of AI incidents recur because
findings from prior incidents are not fed back into the risk management or development processes.
Assessor indicator: incident log contains multiple entries of the same incident type with no
corresponding changes to controls or development practices.

---

## 9. Assessment Report Format

### Executive Summary Structure

The executive summary should communicate four things to a non-technical audience:

1. **Overall profile tier** — what tier the organization is operating at overall (Tier 1–4) and
   what that means in practical terms
2. **Function scores** — how GOVERN, MAP, MEASURE, and MANAGE each performed with the key
   strength and the key weakness per function
3. **Top five findings** — the five highest-priority gaps, stated in business terms (not subcategory IDs)
4. **Recommended next steps** — the three to five actions with the highest impact on moving from
   the current profile to the target profile

### Finding Documentation Format

For each finding identified during the assessment:

```
Finding ID: NIST-AIRMF-[YEAR]-[SEQUENCE]
Classification: [Critical Gap / High Gap / Medium Gap / Observation]
Function: [GOVERN / MAP / MEASURE / MANAGE]
Subcategory: [e.g., GOVERN 1.6 / MANAGE 2.4]
Question ID: [e.g., Q-NIST-AI-RMF-GV-006]
Current Score: [Full / Partial / Not Implemented]
Risk Weight: [HIGH / MEDIUM / LOW]

Description:
[Factual description of what was observed — what exists versus what the subcategory requires.
Avoid editorial language. State the specific gap.]

Evidence Reviewed:
[Documents reviewed and interviews conducted that supported this finding. List specific documents
by name and interviewee roles, not names.]

Subcategory Requirement:
[The specific NIST AI RMF subcategory text from controls.yaml that is not being met.]

Recommended Action:
[Specific, actionable steps to achieve Full implementation of this subcategory. Reference the
evidence_required items from questions.yaml that are missing.]

Estimated Effort: [Quick (days) / Standard (weeks) / Extended (months)]
```

**Classification guidance:**
- **Critical Gap:** HIGH risk_weight subcategory scored Not Implemented — no evidence of any practice in this area
- **High Gap:** HIGH risk_weight subcategory scored Partial — practice exists but is incomplete or inconsistently applied
- **Medium Gap:** MEDIUM risk_weight subcategory scored Not Implemented or Partial
- **Observation:** LOW risk_weight gap or practice that is implemented but could be strengthened

### Function-by-Function Findings Table

| Subcategory ID | Question ID | Score | Risk Weight | Finding Classification | Key Finding | Recommendation |
|----------------|------------|:-----:|:-----------:|:---------------------:|-------------|----------------|
| GOVERN 1.1 | Q-NIST-AI-RMF-GV-001 | | | | | |
| GOVERN 1.2 | Q-NIST-AI-RMF-GV-002 | | | | | |
| ... | | | | | | |

Repeat this table for each function. The completed tables form the detailed findings section and
serve as the subcategory scoring appendix.

### Gap Prioritization Matrix

Present prioritized gaps in a sequenced matrix that enables the organization to plan remediation
in order of impact:

| Priority | Subcategory | Function | Finding Classification | Recommended Sequencing |
|----------|-------------|----------|:---------------------:|------------------------|
| 1 (Address first) | | | Critical Gap | Foundation — other work depends on this |
| 2 | | | Critical Gap | Blocking downstream functions |
| 3 | | | High Gap | High risk, near-term fixable |
| 4 | | | High Gap | High risk, longer implementation |
| 5+ | | | Medium Gap | Address after critical and high gaps |

**Sequencing guidance:**
1. Resolve all GOVERN gaps before expecting MAP/MEASURE/MANAGE improvements to be sustainable —
   governance is the foundation
2. Within GOVERN, prioritize accountability structures (GOVERN 2) and the AI inventory
   (GOVERN 1.6) — these enable everything else
3. Within MAP, prioritize context documentation (MAP 1) and impact characterization (MAP 5) —
   without these, measurement has no basis
4. Within MEASURE, prioritize production monitoring (MEASURE 2.4) and risk tracking (MEASURE 3.1)
   — these provide the signals for MANAGE actions
5. Within MANAGE, prioritize incident response (MANAGE 4.3) and deactivation mechanisms
   (MANAGE 2.4) — these are the last line of defense

### Target Profile Section

For each function, define the target state:

| Function | Current Tier | Target Tier | Key Changes Required | Timeline |
|----------|:------------:|:-----------:|----------------------|----------|
| GOVERN | | | | |
| MAP | | | | |
| MEASURE | | | | |
| MANAGE | | | | |
| **Overall** | | | | |

### Appendix: Subcategory Scoring Detail

List all 72 subcategories with:
- Subcategory ID and title (from controls.yaml)
- Question ID (from questions.yaml)
- Score (Full / Partial / Not Implemented)
- Evidence reviewed (document names and interviewee roles)
- Finding ID (if a finding was raised)

### Appendix: Evidence Index

List all documents reviewed during the assessment with:
- Document name
- Version or date
- Subcategory references (which subcategories the document was used to assess)
- Adequacy assessment (Sufficient / Insufficient / Not Provided)

---

**Version:** 1.0
**Last Updated:** 2026-02-25
**Framework:** NIST AI Risk Management Framework 1.0 (NIST AI 100-1, January 2023)
**Source:** airc.nist.gov — NIST AI Resource Center
