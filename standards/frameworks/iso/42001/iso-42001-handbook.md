---
type: reference
name: iso-42001-handbook
category: compliance
classification: public
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42001:2023"
framework_version: "2023"
---

# ISO/IEC 42001:2023 AI Management System Handbook

**Version:** 2023 | **Provider:** ISO/IEC JTC 1/SC 42
**Controls:** 38 (Annex A normative controls) | **Families:** 9
**Last Updated:** 2026-02-22

---

## How to Use This Handbook

This handbook is the practitioner's guide to ISO/IEC 42001:2023. Read it cover-to-cover to understand what the standard requires, how the IA assessment workflow evaluates it, and what you need to prepare. It bridges the gap between structured assessment data (controls.yaml, questions.yaml) and the narrative understanding needed to manage compliance effectively.

**This handbook IS:** A narrative walkthrough of ISO 42001, its HLS clauses, Annex A controls, and how to work through compliance.

**This handbook is NOT:**
- The implementation guide (per-control gap closure steps — see `iso-42001-implementation-guide.md`)
- The certification guide (audit logistics and CB preparation — see `iso-42001-certification-guide.md`)
- The controls definition (structured machine-readable data in `controls.yaml`)
- The assessment questions (interview/evaluation questions in `questions.yaml`)

**Related artifacts:**
- `controls.yaml` — Structured control definitions for all 38 Annex A requirements
- `questions.yaml` — Assessment questions with scoring criteria
- `docs/iso-42001-implementation-guide.md` — Per-control gap closure steps
- `docs/iso-42001-assessor-playbook.md` — Assessment methodology and interview guides
- `docs/iso-42001-test-playbook.md` — Executable test cases per control family
- `docs/iso-42001-certification-guide.md` — IAF-accredited CB audit preparation
- `../../../mappings/crosswalks/iso-42001.yaml` — Cross-framework control mappings

---

## 1. Framework Overview

### What ISO/IEC 42001:2023 Is

ISO/IEC 42001:2023 is the international standard for Artificial Intelligence Management Systems (AIMS). Published in December 2023 by the International Organization for Standardization and the International Electrotechnical Commission under their Joint Technical Committee 1, Subcommittee 42 (AI), it is the world's first certifiable AI management system standard.

ISO 42001 follows the High-Level Structure (HLS) used by all modern ISO management system standards — the same architecture as ISO 27001 (information security), ISO 9001 (quality), and ISO 14001 (environment). This means organizations already certified to those standards will recognize the Clauses 4-10 structure immediately, and can pursue integration with their existing management systems.

The standard addresses the full lifecycle of AI system development, deployment, and operation. It covers both organizations that develop AI systems and organizations that deploy or use AI systems developed by others. Unlike frameworks that are exclusively governance-oriented (NIST AI RMF) or exclusively technical (OWASP LLM Top 10), ISO 42001 integrates governance, operational controls, and third-party relationships into a single certifiable management system.

### Standard Architecture

ISO/IEC 42001:2023 has two structural layers:

**HLS Normative Body (Clauses 4-10):** The management system requirements applicable to any ISO management standard. These clauses define how the AIMS must be structured, governed, resourced, and improved.

| Clause | Title | Purpose |
|--------|-------|---------|
| 4 | Context of the Organization | Define scope, stakeholders, external/internal issues |
| 5 | Leadership | Top management commitment, AI policy, roles |
| 6 | Planning | Risk/opportunity assessment, AI objectives, change planning |
| 7 | Support | Resources, competence, awareness, communication, documented information |
| 8 | Operation | Operational planning and control, AI impact assessment, data governance |
| 9 | Performance Evaluation | Monitoring, internal audit, management review |
| 10 | Improvement | Nonconformity, corrective action, continual improvement |

**Annex A — Normative AI Controls:** 38 AI-specific controls organized across 9 control families (A.2 through A.10). These are the implementation controls that give ISO 42001 its AI-specific substance. Unlike ISO 27001's Annex A controls, ISO 42001 Annex A controls are normative — organizations must apply them or document justified exclusions. Annex B provides non-normative implementation guidance corresponding to each Annex A control.

### Publication Details

- **Standard:** ISO/IEC 42001:2023 — Artificial intelligence — Management system
- **Published:** December 15, 2023
- **Published by:** ISO/IEC JTC 1/SC 42 (Artificial Intelligence)
- **Official URL:** https://www.iso.org/standard/81230.html
- **Predecessor:** No direct predecessor — first AI management system standard
- **Related standards:** ISO/IEC 22989 (AI concepts), ISO/IEC 23053 (ML framework), ISO/IEC 42005 (AI impact assessment), ISO/IEC 38507 (governing body AI guidance)

### Why It Matters

Three forces drive ISO 42001 adoption:

**1. Regulatory convergence.** The EU AI Act (effective August 2024, enforcement from August 2026 for most provisions) requires AI systems in high-risk categories to implement risk management systems, data governance practices, technical documentation, and human oversight. ISO 42001 provides the management system structure that demonstrates conformance with these requirements. Organizations subject to the EU AI Act can use ISO 42001 certification as evidence of systematic AI risk management.

**2. Supply chain pressure.** Enterprise buyers, regulators, and insurers increasingly require evidence of AI governance. An ISO 42001 certificate from an IAF-accredited certification body is an independently verified signal that an organization manages AI responsibly — analogous to how ISO 27001 operates in information security procurement.

**3. Integration with existing systems.** Organizations already operating ISO 27001, ISO 9001, or ISO 14001 management systems can integrate ISO 42001 without building parallel governance infrastructure. The HLS alignment means policies, internal audits, management reviews, and document control processes can be shared across standards.

### Target Audience

ISO 42001 applies to any organization that develops or uses AI systems and wants to demonstrate responsible AI management. This includes:

- AI system developers building models, training pipelines, and AI-enabled products
- Enterprises deploying third-party AI systems (LLMs, automated decision systems, predictive analytics)
- Organizations in regulated industries (healthcare, financial services, critical infrastructure) using AI
- Government agencies and public sector organizations deploying AI for citizen services
- AI service providers and platform vendors supplying AI capabilities to other organizations

The standard is designed to be scalable. A startup with a single AI product and a global enterprise with hundreds of AI systems can both implement ISO 42001 — scope definition (Clause 4.3) governs what falls within the AIMS boundary.

---

## 2. Who Needs This Framework

### Industry Applicability

| Industry | Priority | Rationale |
|----------|----------|-----------|
| AI & Machine Learning | Recommended | Core standard for organizations building AI systems |
| Technology & SaaS | Recommended | Expected by enterprise buyers; EU AI Act alignment |
| Healthcare | High Priority | AI in clinical decision support requires rigorous impact assessment |
| Financial Services | High Priority | Algorithmic decision-making in lending, trading, compliance |
| Automotive & Autonomous Systems | High Priority | Safety-critical AI with product liability implications |
| Government & Public Sector | High Priority | AI in citizen-facing services requires accountability |
| All other industries | Optional | Applicable whenever AI systems influence significant decisions |

### Company Size and Type Guidance

**Enterprise (1000+ employees):** ISO 42001 is well-suited to large organizations with multiple AI systems, multiple business units involved in AI, and existing management system infrastructure (ISO 27001 or ISO 9001). The standard's integration with HLS allows large organizations to fold AI governance into existing audit and review cycles rather than building standalone processes.

**Mid-market (100-1000 employees):** The primary target for certification. ISO 42001 provides structure without requiring a dedicated AI governance team. Many Annex A controls can be satisfied with existing tooling and process documentation. Combined audits with ISO 27001 reduce cost significantly.

**Startups (<100 employees):** Pursue ISO 42001 when EU AI Act obligations apply, when enterprise customers request it, or when the organization's AI systems pose significant risk. Focus first on establishing the AIMS scope, AI policy, and impact assessment processes — the governance foundation that scales.

### Regulatory vs. Voluntary

ISO 42001 is a **voluntary international standard**. No jurisdiction currently mandates ISO 42001 certification as a legal requirement. However:

- The **EU AI Act** (Regulation 2024/1689) creates substantive obligations for high-risk AI systems that align with ISO 42001 requirements. Conformance with the standard provides a documented evidence base for demonstrating compliance with Act requirements under Articles 9 (risk management), 10 (data governance), 11 (technical documentation), 13 (transparency), 14 (human oversight), and 17 (quality management system).
- **Financial services regulators** in multiple jurisdictions have issued guidance on AI governance that ISO 42001 directly addresses.
- **Government procurement** requirements for AI vendors increasingly reference AI management system standards.

### Common Compliance Portfolios

Organizations pursuing ISO 42001 typically also maintain:

- **ISO 27001 + ISO 42001:** The most common combination. ISO 27001 covers information security; ISO 42001 adds AI-specific governance. Combined audits with an IAF-accredited CB reduce time and cost. Many controls overlap (documented information, risk assessment, supplier management).
- **ISO 42001 + AIUC-1:** ISO 42001 provides AI management system governance at the organizational level; AIUC-1 adds agent-level technical controls and quarterly adversarial testing. Together they address both governance maturity and technical assurance.
- **ISO 42001 + NIST AI RMF:** ISO 42001 provides a certifiable management system; NIST AI RMF provides a flexible risk framework. Organizations operating in both US and EU markets often implement both.
- **ISO 42001 + EU AI Act compliance:** ISO 42001 provides the systematic management structure that demonstrates EU AI Act Article 9 (risk management system) and Article 17 (quality management system) conformance.

---

## 3. Framework Architecture

### Control Organization

ISO 42001 organizes its AI-specific requirements into 9 Annex A control families, prefixed A.2 through A.10 (A.1 is reserved for introductory material). Each family addresses a distinct domain of AI management. Within families, individual controls are numbered sequentially (A.2.2, A.2.3, etc. — the .1 suffix is similarly reserved).

Every Annex A control is normative, meaning it represents a requirement the organization must address. Unlike ISO 27001 Annex A where controls can be excluded with a Statement of Applicability (SoA) justification, ISO 42001 Annex A controls apply to all organizations within scope. Exclusions must be documented and justified based on the nature of the organization's AI activities.

Annex B provides non-normative implementation guidance corresponding to each Annex A control. Annex B is not audited directly but provides the authoritative interpretation of what each Annex A control requires in practice.

### Control Families

| Family | Name | Controls | Purpose |
|--------|------|:--------:|---------|
| A.2 | Policies related to AI | 5 | Establish and maintain AI governance policies |
| A.3 | Internal organization | 3 | Define AI accountability structures and roles |
| A.4 | Resources for AI systems | 5 | Govern AI system assets, compute, and environmental resources |
| A.5 | Assessing impacts of AI systems | 4 | Assess and address AI impacts on individuals and society |
| A.6 | AI system life cycle | 6 | Control AI system development through all lifecycle stages |
| A.7 | Data for AI systems | 5 | Govern data quality, acquisition, and protection |
| A.8 | Information for interested parties | 4 | Provide transparency to stakeholders about AI systems |
| A.9 | Use of AI systems | 3 | Ensure responsible use of AI per organizational policies |
| A.10 | Third-party and customer relationships | 3 | Govern risks from suppliers and customers |

**Total: 38 Annex A controls** across 9 families.

### HLS vs. Annex A Controls

Clauses 4-10 and Annex A serve different but complementary roles:

- **HLS Clauses 4-10** define the management system infrastructure: how AI governance is structured, resourced, monitored, and improved. These map to NIST AI RMF GOVERN function activities.
- **Annex A controls** define what must be done operationally for AI systems: what policies exist, how impacts are assessed, how data is managed, what information users receive, how third parties are governed. These map to NIST AI RMF MAP, MEASURE, and MANAGE functions.

An auditor assessing ISO 42001 conformance evaluates both layers. Clause 5 (Leadership) establishes that an AI policy exists and is approved; Annex A.2.2 governs the content of that policy. Together they ensure that governance exists and that it addresses AI-specific requirements.

---

## 4. Assessment Workflow Mapping

### HLS Clauses Mapped to NIST CSF 2.0

The IA Framework maps ISO 42001 HLS clauses to NIST CSF 2.0 functions for assessment phasing:

| NIST CSF Phase | ISO 42001 Clauses | Annex A Families | Focus |
|----------------|-------------------|------------------|-------|
| GOVERN | 4, 5, 6.1, 6.2 | A.2, A.3 | Policies, roles, AI objectives, risk appetite |
| IDENTIFY | 6.1, 6.3 | A.4, A.5 | AI system inventory, impact assessment, change planning |
| PROTECT | 7, 8 | A.6, A.7, A.9 | Lifecycle controls, data governance, operational controls |
| DETECT | 9.1, 9.2 | A.8 | Monitoring, measurement, internal audit |
| RESPOND | 10.1 | A.10 | Nonconformity, corrective action, third-party incidents |
| RECOVER | 10.2 | — | Continual improvement, AIMS enhancement |

### Multi-Agent Routing

| Agent | ISO 42001 Responsibilities |
|-------|---------------------------|
| **Advisor** | HLS Clauses 4-6, 9-10; Annex A.2 (AI policies), A.3 (internal org), A.5 (impact assessment), A.8 (stakeholder information). Conducts stakeholder interviews, reviews governance documentation, evaluates policy maturity. |
| **Security** | Annex A.6 (AI lifecycle technical controls), A.7 (data governance), A.9 (use of AI systems), A.10 (third-party risk). Evaluates technical implementation of AI controls, data protection measures, supplier risk. |
| **Engineer** | Remediation: Implements AI lifecycle controls, data governance tooling, monitoring configurations. Engaged after gaps are identified by Advisor or Security agents. |

### Phase Dependencies

Assessment sequencing mirrors the HLS structure:

1. **GOVERN phase first** — Establish that the AI policy (A.2.2), roles (A.3.2), and AIMS scope (Clause 4.3) exist before evaluating operational controls. Governance gaps cascade across all families.
2. **IDENTIFY phase second** — AI system inventory (A.4.x), impact assessments (A.5.x), and change planning (Clause 6.3) must be completed before lifecycle and data controls can be evaluated.
3. **PROTECT and DETECT in parallel** — Lifecycle controls (A.6.x), data controls (A.7.x), and information/transparency controls (A.8.x) can be assessed concurrently.
4. **RESPOND and RECOVER** — Third-party controls (A.10.x) and improvement processes (Clause 10) are assessed last.

---

## 5. Control Family Walkthroughs

### Family A.2: Policies Related to AI

**Purpose:** Establish documented AI policies that provide management direction for all AI activities, aligned with organizational values and the external environment.

**Controls:** A.2.2 (AI policy), A.2.3 (Alignment with other policies), A.2.4 (Review of AI policy), A.2.5 (Topic-specific AI policies), A.2.6 (Approach to AI within other policies)

The A.2 family is the governance foundation of the entire AIMS. Without a documented AI policy (A.2.2), none of the operational controls can be anchored to management intent. Assessors typically start here.

**A.2.2 — AI Policy** is the cornerstone control. The organization must document a policy for the development or use of AI systems. Annex B.2.2 specifies that the policy must be informed by six inputs: business strategy, organizational values and risk appetite, the level of AI risk, legal requirements, the risk environment, and interested party impact assessments (per Clause 6.1.4). The policy must contain: principles guiding all AI activities, and a process for handling deviations and exceptions. These two content elements are explicitly required by the standard — generic statements of intent without operational principles or an exception process fail the control.

**A.2.3 — Alignment with Other Policies** requires a thorough analysis of where the AI policy intersects with other organizational policies. ISO 42001 Annex B.2.3 names quality, security, safety, and privacy as domains that necessarily intersect with AI. Where intersections exist, the organization must either update the affected policy or add provisions to the AI policy. This is a bidirectional analysis: how AI affects other domains, and how other domain requirements apply to AI systems.

**A.2.4 — Review of the AI Policy** establishes a mandatory review cadence. A management-approved role must be responsible for the review. Reviews must assess suitability, adequacy, and effectiveness against four types of change: organizational environment, business circumstances, legal conditions, and technical environment. Management review results (Clause 9.3) must be used as review inputs.

**A.2.5 — Topic-Specific AI Policies** addresses the need for subsidiary policies covering specific AI domains. The AI policy establishes principles; topic-specific policies operationalize them in domains like AI procurement, AI incident response, AI model lifecycle management, and AI ethics review. Organizations with diverse AI portfolios typically need multiple subsidiary policies to address the practical differences between, for example, internal decision-support AI and customer-facing AI services.

**A.2.6 — Approach to AI Within Other Policies** is the reverse of A.2.3: it requires the organization to consider AI within existing policies — not just aligning the AI policy, but embedding AI considerations in policies that were written before AI became relevant. Information security policies should address AI model security. Privacy policies should address automated decision-making and data minimization for training data. Quality policies should address AI system validation requirements.

**What good looks like:** A signed AI policy document with version history; documented six-input evidence pack; a deviation and exceptions process with an active exceptions register; a policy alignment matrix covering at minimum quality, security, safety, and privacy domains; scheduled annual policy review with review reports on file; topic-specific policies for major AI domains; and AI sections integrated into information security and privacy policies.

**Common gaps:** Policy is a template with organizational name substituted (no actual principles). Exception process missing entirely. Policy covers only AI development but organization also deploys third-party AI systems. Review conducted but management review results not referenced. Alignment analysis limited to security; quality, safety, and privacy not reviewed.

---

### Family A.3: Internal Organization

**Purpose:** Establish clear accountability structures for AI governance within the organization, ensuring all AI lifecycle stages have defined ownership.

**Controls:** A.3.2 (AI roles and responsibilities), A.3.3 (Reporting), A.3.4 (AI system-related processes)

**A.3.2 — AI Roles and Responsibilities** requires that roles and responsibilities for AI be defined and allocated according to organizational needs. Annex B.3.2 provides an explicit list of areas requiring defined roles: risk management, impact assessments, asset and resource management, security, safety, privacy, development, performance, human oversight, supplier relationships, legal compliance, and data quality management. This list is comprehensive — organizations cannot limit accountability definitions to only obvious roles like "AI developer" and satisfy the control.

**A.3.3 — Reporting** requires that reporting processes exist for AI-relevant information to flow to the appropriate levels of the organization. This includes upward reporting (AI risks and incidents to executive leadership and governing body), lateral reporting (AI performance information to affected business functions), and outward reporting (required disclosures to regulators or affected parties). The control ensures that the governance structure created by A.3.2 is actually connected by information flows that enable decision-making.

**A.3.4 — AI System-Related Processes** requires that processes exist for executing AI activities systematically. This is the control that bridges policy (A.2 family) with operation (A.6 family): organizations need not just policies about what to do, but documented processes defining how AI activities are actually carried out. This includes processes for AI system approval, AI risk assessment, AI impact assessment, and AI change management.

**What good looks like:** An AI governance RACI matrix covering all twelve B.3.2 areas; documented roles with authority and responsibility defined (not just titles); reporting framework with defined escalation paths; process documentation for core AI governance activities; and organizational chart showing AI accountability structure.

**Common gaps:** Roles defined by title without specific responsibilities. Human oversight role undefined — everyone assumes someone else is responsible. No process for escalating AI risks to executive level. Impact assessment process exists in policy but no documented procedure for how to conduct one.

---

### Family A.4: Resources for AI Systems

**Purpose:** Account for the assets, compute resources, environmental impacts, and other resources associated with AI systems to fully understand and address AI risks.

**Controls:** A.4.2 (AI system inventory), A.4.3 (AI-related resources and assets), A.4.4 (Computational resources), A.4.5 (Resources for AI system development and operation), A.4.6 (Environmental impact)

**A.4.2 — AI System Inventory** requires the organization to maintain an inventory of all AI systems within its AIMS scope. This is the asset register for AI — the foundation on which all other controls operate. Without a comprehensive AI system inventory, impact assessments (A.5 family) cannot be complete, lifecycle controls (A.6 family) cannot be applied consistently, and data governance (A.7 family) cannot cover all training and inference data flows. The inventory must be maintained — new AI systems must be added before deployment, and decommissioned systems removed.

**A.4.3 — AI-Related Resources and Assets** extends the inventory to the components and assets associated with AI systems: training datasets, AI models, APIs, third-party AI services, and the infrastructure on which AI systems run. This control enables the organization to understand its full AI footprint including dependencies that introduce risk.

**A.4.4 — Computational Resources** addresses the compute infrastructure used for AI system development and operation. Organizaitons must understand their computational resource requirements, dependencies, and constraints. This has risk dimensions: compute availability affects AI system reliability; shared compute introduces security and data isolation risks.

**A.4.5 — Resources for AI System Development and Operation** requires that the organization identify and provide the human, technological, and organizational resources needed to develop and operate AI systems responsibly. This control connects to Clauses 7.1 and 7.2 on resources and competence — the management system must be resourced adequately.

**A.4.6 — Environmental Impact** is ISO 42001's sustainability control. AI systems, particularly large-scale training operations and inference workloads, have significant energy consumption and associated environmental impact. The standard requires organizations to consider environmental impacts of their AI systems and document how they are managing them. This aligns with sustainability reporting obligations under frameworks like CSRD and climate disclosure standards.

**What good looks like:** A maintained AI system register with system name, purpose, risk classification, data categories processed, and lifecycle status; an asset register covering models, datasets, and third-party AI dependencies; compute capacity documentation with allocation and utilization tracking; environmental impact assessment or carbon footprint tracking for significant AI workloads.

**Common gaps:** AI system inventory exists but not maintained (shadow AI systems deployed without registration). Asset inventory covers infrastructure but omits third-party AI APIs and pre-trained models. Environmental impact not considered at all. Computational resource constraints not documented as risks.

---

### Family A.5: Assessing Impacts of AI Systems

**Purpose:** Systematically assess the impacts of AI systems on individuals, groups, and society throughout the AI system lifecycle, and establish processes for identifying and mitigating those impacts.

**Controls:** A.5.2 (AI impact assessment process), A.5.3 (Triggers for AI system impact assessments), A.5.4 (Conducting and documenting AI impact assessments), A.5.5 (Responding to AI system impacts)

The A.5 family is the ethical heart of ISO 42001. Impact assessment is the mechanism through which organizations operationalize responsible AI principles — moving from policy statements (A.2 family) to concrete analysis of how specific AI systems affect specific people and groups.

**A.5.2 — AI Impact Assessment Process** requires the organization to establish a documented process for conducting AI impact assessments. The process must define methodology, roles, scope, and documentation requirements. It must be established before AI systems are deployed — reactive impact assessment conducted only after problems emerge does not satisfy the control. Annex B.5.2 provides guidance on what impact assessments should cover: impacts on rights, safety, security, access to goods and services, privacy, and societal and ethical impacts.

**A.5.3 — Triggers for AI Impact Assessments** specifies when impact assessments must be conducted. The standard requires assessments to be triggered by: new AI system deployment, significant changes to existing AI systems, changes in the context in which AI systems operate, or changes in the impact profile identified through monitoring. This control prevents organizations from conducting a single impact assessment at initial deployment and never revisiting it as the system evolves.

**A.5.4 — Conducting and Documenting AI Impact Assessments** governs the execution quality of impact assessments. Assessments must be documented, must consider the specific AI system and its context, and must involve appropriate stakeholders — including those who might be affected by the AI system's outputs. Documentation requirements ensure assessments are substantive rather than perfunctory.

**A.5.5 — Responding to AI System Impacts** requires that identified impacts are actually addressed. An impact assessment that identifies risks but generates no mitigations or acceptance decisions does not satisfy the standard. The organization must have a process for deciding how to respond to identified impacts: mitigate, reduce, monitor, accept with documented rationale, or discontinue the AI system.

**What good looks like:** A documented AI impact assessment methodology with templates; trigger criteria defined in process documentation; completed impact assessment records for all AI systems in scope; evidence of stakeholder involvement in assessments; documented impact response decisions with rationale; and periodic reassessment records for existing systems.

**Common gaps:** Impact assessment process exists as policy text but no methodology or template defined. Assessments conducted only for new systems, never revisited. Stakeholders consulted internally only — affected individuals or external groups not considered. Assessment identifies impacts but no response decisions documented. Impacts accepted without risk-owner approval.

---

### Family A.6: AI System Life Cycle

**Purpose:** Define the criteria and requirements for each stage of the AI system lifecycle, ensuring that development and operation activities are conducted responsibly.

**Controls:** A.6.1.2 (Responsible design and development objectives), A.6.1.3 (AI system development processes), A.6.2.2 (Procurement), A.6.2.3 (Deployment), A.6.2.4 (Operation), A.6.2.5 (Decommissioning)

The A.6 family bridges governance (what the organization intends) with operational execution (how AI systems are actually built and run). It is organized into two sub-families: A.6.1 (Management guidance for AI system development) and A.6.2 (AI system lifecycle stages).

**A.6.1.2 — Responsible Design and Development Objectives** requires the organization to document objectives for responsible AI design and development. These objectives operationalize the AI policy principles — they translate "we are committed to fair AI" into "our AI systems must achieve demographic parity within 5% across protected characteristics." Objectives must be measurable to be auditable.

**A.6.1.3 — AI System Development Processes** requires documented processes for AI system development that incorporate the responsible objectives defined in A.6.1.2. This is the software development lifecycle equivalent for AI — model selection, training, validation, testing, and deployment must all follow documented processes that embed responsible AI considerations at each stage.

**A.6.2.2 — Procurement** governs the acquisition of AI systems or AI components from third parties. When an organization procures an AI model, AI service, or AI-enabled product, it must conduct appropriate due diligence and establish contractual requirements that reflect its AI policy commitments. Third-party AI systems are not outside the AIMS scope simply because they are externally developed — the organization deploying them remains responsible for their impacts.

**A.6.2.3 — Deployment** requires controlled AI system deployment with documented criteria for determining readiness for production. This includes testing completion, impact assessment sign-off, risk acceptance, and approval gates before production deployment. Ad-hoc AI deployments without documented readiness criteria fail this control.

**A.6.2.4 — Operation** governs the ongoing operation of deployed AI systems. The organization must monitor AI system performance, maintain the operational environment, and respond to operational anomalies. This control underpins the monitoring and measurement requirements of Clause 9.1.

**A.6.2.5 — Decommissioning** requires that AI system end-of-life is managed as systematically as initial deployment. This includes data retention and deletion, documentation archival, model removal from production environments, and assessment of impacts associated with discontinuing the AI system (e.g., users who relied on the system).

**What good looks like:** Documented responsible AI objectives with measurable targets; development lifecycle documentation incorporating responsible AI checkpoints; procurement due diligence templates and contract provisions for AI suppliers; deployment readiness checklists with approval gates; operational monitoring dashboards; and decommissioning procedures with data deletion records.

**Common gaps:** Responsible objectives exist in policy but not translated to measurable development criteria. Development lifecycle documented for software but AI-specific controls (bias testing, model validation) not embedded. Third-party AI services procured through standard vendor process with no AI-specific due diligence. Deployment gate process exists but impact assessment sign-off not required. No decommissioning procedure — models simply stopped without data cleanup.

---

### Family A.7: Data for AI Systems

**Purpose:** Ensure that data used in AI systems is of appropriate quality, acquired appropriately, and managed throughout its lifecycle in ways that protect individuals and enable AI system integrity.

**Controls:** A.7.2 (Data acquisition and collection), A.7.3 (Data quality), A.7.4 (Data provenance and attributes), A.7.5 (Data preparation), A.7.6 (Data management for third-party data)

Data is the fundamental input to AI system behavior. The A.7 family addresses the full data lifecycle for AI: how data is acquired, what quality standards apply, how provenance is documented, how data is prepared for training and inference, and how third-party data is governed.

**A.7.2 — Data Acquisition and Collection** requires that data acquired for AI systems is acquired through legitimate, documented processes. This includes legal basis for data collection (particularly for personal data governed by privacy laws), agreements with data sources, and documentation of acquisition methods. The standard requires that acquisition processes consider the intended use of the data — data acquired for one purpose cannot simply be repurposed for AI training without appropriate authorization.

**A.7.3 — Data Quality** requires the organization to establish and apply data quality standards for AI systems. AI systems are only as good as their training data — poor quality data (incomplete, inaccurate, biased, outdated) produces poor quality AI outputs. The organization must define what "quality" means for each AI system's data, measure it, and address identified quality issues before and during training.

**A.7.4 — Data Provenance and Attributes** requires documentation of where data comes from, what transformations it has undergone, and what relevant attributes it carries. This is the data lineage control — without provenance documentation, organizations cannot investigate AI system failures, assess bias in training data, or demonstrate regulatory compliance with data-related requirements.

**A.7.5 — Data Preparation** governs the process of transforming raw data into AI-ready training data. This includes labeling, annotation, cleaning, transformation, splitting, and augmentation. Each step in data preparation introduces potential for error or bias; the standard requires these processes to be documented and controlled.

**A.7.6 — Data Management for Third-Party Data** addresses data acquired from external sources (data brokers, public datasets, partner data, licensed data). Third-party data carries provenance uncertainty, licensing constraints, and quality variability. The organization must evaluate third-party data sources, understand their terms of use, and apply appropriate controls to data that ultimately trains or influences AI systems.

**What good looks like:** Data acquisition procedures with legal basis documentation; data quality standards per AI system with measurement results; data lineage documentation from source to training set; data preparation documentation including annotation guidelines; third-party data inventory with source assessment and license records; and data retention and deletion procedures covering training data.

**Common gaps:** Training data acquired years ago with no documentation of source or legal basis. Data quality assessed subjectively ("it looks okay") without measurement. No data lineage documentation — cannot trace model behavior to specific training data. Annotation done by external contractors with no quality control on labeling. Third-party datasets used without reviewing license terms. Training data retained indefinitely with no deletion schedule.

---

### Family A.8: Information for Interested Parties

**Purpose:** Ensure that relevant stakeholders — users, affected individuals, regulators, customers — have the information they need to understand AI systems and their impacts, enabling informed engagement and oversight.

**Controls:** A.8.2 (Information for users), A.8.3 (User notification of AI interaction), A.8.4 (Explanation of AI decisions), A.8.5 (Information about AI system context and assumptions)

The A.8 family operationalizes transparency — one of the core responsible AI principles. Without adequate information, users cannot exercise meaningful oversight, affected individuals cannot challenge AI decisions, and regulators cannot assess compliance. This family connects directly to EU AI Act transparency obligations (Articles 13, 50).

**A.8.2 — Information for Users** requires that users of AI systems receive information about the system's capabilities, limitations, intended purpose, and appropriate use. This is the "product information" control for AI — users must understand what the AI system does and does not do. Generic marketing descriptions that overstate capabilities fail this control.

**A.8.3 — User Notification of AI Interaction** requires that individuals interacting with AI systems are notified that they are interacting with AI, where this is not obvious. This reflects the fundamental right to know when one's experience is being shaped by automated systems. The EU AI Act Article 50 makes similar requirements mandatory for certain AI applications (chatbots, emotion recognition systems). ISO 42001 applies this broadly.

**A.8.4 — Explanation of AI Decisions** requires that AI systems capable of generating explanations provide them upon request, and that processes exist for individuals to seek explanations for AI-driven decisions that affect them. This is the explainability control — it does not require all AI systems to be interpretable by default, but it requires that explanations are available for decisions that matter to affected individuals.

**A.8.5 — Information about AI System Context and Assumptions** requires disclosure of the context and assumptions underlying AI system design and operation. AI systems trained on historical data inherit the biases and limitations of that data. AI systems designed for one deployment context may behave differently in another. Users and affected parties need this context to appropriately rely on or challenge AI outputs.

**What good looks like:** User documentation covering capabilities, limitations, and appropriate use; AI disclosure notifications in user interfaces for AI-generated content; a process for individuals to request explanations of AI decisions affecting them; published information about training data scope, known limitations, and performance characteristics; and a public or customer-facing AI system card or model card for significant AI systems.

**Common gaps:** User documentation emphasizes capabilities; limitations section absent or vague. No AI disclosure in chatbot interfaces — users assume human interaction. Explanation request process exists on paper but not actually implemented. Model limitations documented internally but not communicated to users. Context and assumptions described in technical terms inaccessible to affected individuals.

---

### Family A.9: Use of AI Systems

**Purpose:** Ensure that AI systems are used responsibly, within their intended scope and in accordance with organizational policies, particularly where use by non-specialist users introduces specific risks.

**Controls:** A.9.2 (Responsible use of AI systems), A.9.3 (AI information literacy of users), A.9.4 (Out-of-scope use)

**A.9.2 — Responsible Use of AI Systems** establishes organizational requirements for how AI systems may be used. This control applies to internal use of AI by employees and to external use by customers or end users. Responsible use policies must specify permitted and prohibited uses, human oversight requirements, and handling of AI outputs that will be used in consequential decisions.

**A.9.3 — AI Information Literacy of Users** requires that users of AI systems have sufficient understanding to use those systems appropriately. This goes beyond product documentation (A.8.2) to active capability development — training, education, or guidance that develops users' ability to critically evaluate AI outputs, recognize AI limitations, and exercise appropriate judgment. An organization cannot simply hand users a capable AI system and consider its responsibility discharged; it must invest in user competence.

**A.9.4 — Out-of-Scope Use** requires processes to detect and address uses of AI systems that fall outside their intended scope. AI systems are routinely used by end users in ways the developer did not anticipate. Some out-of-scope uses are benign; others introduce significant risk (using a customer service chatbot for medical advice; using a coding assistant to generate security research tools). The organization must have processes to identify out-of-scope use patterns and respond appropriately.

**What good looks like:** A responsible use policy with permitted/prohibited uses, human oversight requirements, and escalation procedures; AI literacy training for employees using AI systems; guidelines for users on critically evaluating AI outputs; monitoring for out-of-scope use patterns; and documented response procedures for identified out-of-scope use.

**Common gaps:** AI deployed with no responsible use policy. Users not trained on AI limitations — treat all outputs as authoritative. No monitoring for out-of-scope use. Out-of-scope use identified but no response process — each incident handled ad hoc. Responsible use policy exists but not communicated to users who need it.

---

### Family A.10: Third-Party and Customer Relationships

**Purpose:** Ensure that organizations understand and manage their responsibilities and risks when third parties are involved in any stage of the AI system lifecycle.

**Controls:** A.10.2 (Suppliers of AI resources), A.10.3 (Customers and AI systems), A.10.4 (End users of AI)

**A.10.2 — Suppliers of AI Resources** requires that the organization assess and govern third parties that supply AI resources — including AI models, datasets, AI-enabled services, cloud AI platforms, and AI development tools. The organization cannot outsource its AI responsibility to suppliers; it must actively manage supplier risk and ensure that suppliers' AI practices align with the organization's AI policy.

**A.10.3 — Customers and AI Systems** governs the relationship when the organization is a supplier of AI systems to customers. Obligations include disclosure of AI capabilities and limitations, data processing terms, customer data governance, and support for customers exercising their rights (including rights related to AI-driven decisions). This control applies when the organization deploys AI for customers or when AI features are embedded in products or services provided to customers.

**A.10.4 — End Users of AI** addresses the organization's obligations to individuals who are the end subjects of AI-driven processes, even when those individuals are not direct customers. When an AI system makes decisions about individuals — credit decisions, healthcare recommendations, employment screenings — those individuals have rights and interests that the organization must consider, regardless of whether those individuals have a direct relationship with the organization.

**What good looks like:** AI supplier assessment templates and due diligence records; AI-specific contract provisions for suppliers (data protection, model governance, incident notification); customer disclosure documentation; data processing agreements covering AI-specific aspects; and procedures for addressing end-user rights requests related to AI-driven decisions.

**Common gaps:** AI suppliers subject to standard vendor due diligence with no AI-specific assessment. No AI-specific provisions in supplier contracts — general data processing terms only. Customer documentation does not disclose AI use. No process for customers to request information about AI-driven decisions. End users of AI not identified — only direct customers considered.

---

## 6. Evidence Requirements

### Documented Information Requirements

Clause 7.5 requires documented information for all AIMS requirements. The standard explicitly requires retained documented information (records) for:

- Scope of the AIMS (Clause 4.3)
- AI policy (Clause 5.2)
- AI objectives (Clause 6.2)
- Operational planning and control criteria (Clause 8.1)
- Results of monitoring, measurement, analysis, and evaluation (Clause 9.1)
- Internal audit results (Clause 9.2)
- Management review results (Clause 9.3)
- Nature of nonconformities and corrective actions taken (Clause 10.1)

Beyond mandatory documented information, ISO 42001 Annex A and B require substantial evidence across all nine control families.

### Evidence Matrix

| Control Family | Required Evidence Types |
|----------------|------------------------|
| A.2 — AI Policies | AI policy document; policy review records; deviation/exception register; alignment analysis; topic-specific policies |
| A.3 — Internal Organization | AI RACI matrix; role descriptions; reporting framework documentation; process documentation |
| A.4 — Resources | AI system inventory; asset register; compute capacity documentation; environmental impact records |
| A.5 — Impact Assessment | Impact assessment methodology; completed assessment records; impact response decisions; reassessment records |
| A.6 — AI Lifecycle | Development lifecycle documentation; procurement due diligence records; deployment checklists; operational monitoring records; decommissioning records |
| A.7 — Data | Data acquisition records; data quality assessments; data lineage documentation; data preparation procedures; third-party data agreements |
| A.8 — Stakeholder Information | User documentation; disclosure notifications; explanation request process; model/system cards |
| A.9 — Use of AI | Responsible use policy; AI literacy training records; out-of-scope use monitoring records |
| A.10 — Third-Party | Supplier assessment records; AI contract provisions; customer disclosure documentation; end-user rights procedures |

### Evidence Quality Standards

Evidence submitted during ISO 42001 assessment is evaluated against three dimensions:

1. **Existence:** The document or record exists and can be produced.
2. **Currency:** The evidence is current — not a document created three years ago with no review since.
3. **Effectiveness:** The evidence demonstrates the control is working, not just documented.

An AI policy that has never been reviewed fails currency. An impact assessment process that has never been applied to an actual AI system fails effectiveness. Auditors look for evidence that controls are operational, not merely written.

---

## 7. Common Findings

### Top Implementation Gaps by Frequency

Based on ISO 42001 implementation patterns across organizations, the following gaps appear most frequently:

**1. AI Policy Content Deficiencies (A.2.2)**
The most common finding. Policies exist but fail to include the specific elements required by Annex B.2.2: operational AI principles (not aspirational statements), and a documented exception/deviation process. Policies also frequently fail to cover the full scope — addressing development but not purchase or use of third-party AI systems.

**2. Impact Assessment Gaps (A.5)**
Organizations establish impact assessment processes but fail to trigger them appropriately. Common failure modes: impact assessments completed only at initial deployment, never revisited when AI systems are updated or operational context changes; assessments conducted by AI team without broader stakeholder involvement; impacts identified but response decisions not documented.

**3. AI System Inventory Incompleteness (A.4.2)**
Shadow AI systems — AI tools adopted by individual teams without formal IT or governance approval — routinely miss inventory registers. Particularly common with AI features embedded in SaaS tools (CRM AI, productivity AI, HR AI) that are not recognized as "AI systems" by the teams using them.

**4. Data Governance Deficiencies (A.7)**
Training data provenance documentation is consistently weak. Organizations can produce the final training dataset but cannot demonstrate legal basis for data acquisition, document transformation steps, or trace specific model behaviors to specific training data. Data quality measurement is often subjective rather than systematic.

**5. Supplier AI Governance (A.10.2)**
Organizations govern software suppliers well but fail to apply AI-specific governance to AI suppliers. Third-party AI models, pre-trained foundation models, and AI APIs are frequently acquired through standard procurement without AI-specific due diligence covering model documentation, bias assessment, or incident notification obligations.

**6. Human Oversight Implementation (A.9.2)**
Responsible use policies specify human oversight requirements but operational processes don't enforce them. An AI system might require "human review before action" in policy, but no workflow control actually ensures that review occurs before consequential outputs are acted upon.

**7. Transparency to Users (A.8)**
User documentation coverage of AI limitations is consistently weak. Organizations document capabilities thoroughly but understate or omit limitations. AI disclosure notifications in user interfaces are often absent or buried in terms of service rather than presented at point of AI interaction.

### Red Flags for Auditors

These indicators suggest systemic AIMS deficiencies rather than isolated control gaps:

- AI system in production with no impact assessment record
- AI policy never reviewed since initial approval
- No AI system inventory, or inventory known to be incomplete
- Training data acquired without documented legal basis
- AI supplier contracts with no AI-specific provisions
- No process for individuals to request explanations of AI-driven decisions

---

## 8. Cross-Framework Mapping

### ISO 42001 and NIST AI RMF

The NIST AI RMF (GOVERN/MAP/MEASURE/MANAGE) and ISO 42001 are highly complementary. NIST AI RMF is a voluntary framework without a certification mechanism; ISO 42001 is a certifiable standard. Organizations using NIST AI RMF to structure their AI risk management can use ISO 42001 as the certifiable implementation layer.

Key alignment points:
- **GOVERN function** → ISO 42001 Clauses 4-6, A.2 (AI policies), A.3 (internal organization)
- **MAP function** → ISO 42001 A.4 (resources), A.5 (impact assessment), A.6.2.2 (procurement)
- **MEASURE function** → ISO 42001 Clause 9, A.7.3 (data quality), A.8.4 (explanation)
- **MANAGE function** → ISO 42001 A.6.2.3-6.2.5 (deployment/operation/decommissioning), A.9 (use), A.10 (third parties)

### ISO 42001 and EU AI Act

The EU AI Act and ISO 42001 were developed contemporaneously with awareness of each other. Key conformance points:

| EU AI Act Article | ISO 42001 Corresponding Controls |
|-------------------|----------------------------------|
| Article 9 — Risk management system | Clauses 6.1, 8.1, 8.2; A.5.2-A.5.5 |
| Article 10 — Data governance | A.7.2-A.7.6 |
| Article 11 — Technical documentation | Clause 7.5; A.4.2-A.4.3 |
| Article 13 — Transparency | A.8.2, A.8.4, A.8.5 |
| Article 14 — Human oversight | A.9.2, A.3.2 (oversight roles) |
| Article 17 — Quality management | HLS Clauses 4-10 (AIMS structure) |
| Article 29 — Deployer obligations | A.9.2-A.9.4, A.10.3-A.10.4 |
| Article 72 — Post-market monitoring | A.6.2.4, Clause 9.1 |

### ISO 42001 and ISO 27001

ISO 42001 and ISO 27001 share the HLS structure, enabling combined management system implementation. AI systems are information assets — ISO 27001 information security controls apply to AI system infrastructure, data, and access controls. ISO 42001 adds AI-specific governance that ISO 27001 does not address.

Key integration opportunities:
- Shared risk assessment process (ISO 27001 Clause 6.1 / ISO 42001 Clause 6.1)
- Shared supplier management (ISO 27001 A.5.19-A.5.22 / ISO 42001 A.10.2)
- Shared documented information control (ISO 27001 Clause 7.5 / ISO 42001 Clause 7.5)
- Shared internal audit program (ISO 27001 Clause 9.2 / ISO 42001 Clause 9.2)
- Combined CB audit (many IAF-accredited CBs offer combined ISO 27001/ISO 42001 audits)

### ISO 42001 and AIUC-1

AIUC-1 was explicitly designed to operationalize ISO 42001 Annex A controls with agent-specific technical testing. Where ISO 42001 establishes management system requirements, AIUC-1 adds technical verification:

- ISO 42001 A.5 (impact assessment) + AIUC-1 E-family (accountability controls)
- ISO 42001 A.7 (data governance) + AIUC-1 A-family (data and privacy controls)
- ISO 42001 A.6 (AI lifecycle) + AIUC-1 B/C/D-family (security, safety, reliability controls)
- ISO 42001 A.10 (third-party relationships) + AIUC-1 A010/A011 (third-party AI governance)

---

## 9. Path to Compliance

### Implementation Roadmap

ISO 42001 implementation typically takes 6-18 months from gap assessment to certification, depending on organizational size, existing management system maturity, and AI system complexity.

**Months 1-2: Foundation**
- Conduct gap assessment against HLS Clauses 4-10 and all Annex A controls
- Define AIMS scope (which AI systems, which organizational boundaries)
- Assign AIMS project ownership and governance roles
- Initiate AI system inventory (A.4.2)

**Months 3-4: Governance Layer**
- Draft and approve AI policy (A.2.2) with all B.2.2 required elements
- Conduct policy alignment analysis (A.2.3)
- Define AI roles and responsibilities (A.3.2)
- Establish AI impact assessment process (A.5.2) and methodology

**Months 5-8: Operational Controls**
- Complete AI impact assessments for all in-scope AI systems (A.5.4)
- Document AI lifecycle processes (A.6.x)
- Establish data governance controls (A.7.x)
- Develop user information and transparency materials (A.8.x)
- Define responsible use policies and AI literacy programs (A.9.x)
- Establish supplier AI governance (A.10.2)

**Months 9-10: AIMS Infrastructure**
- Implement monitoring and measurement program (Clause 9.1)
- Establish internal audit program with AI-specific competencies (Clause 9.2)
- Conduct first management review (Clause 9.3)
- Document corrective action process (Clause 10.1)

**Months 11-12: Pre-Certification Readiness**
- Complete full internal audit against all requirements
- Close identified nonconformities
- Conduct Stage 1 readiness check (documentation review)
- Select IAF-accredited CB and schedule Stage 1 audit

**Months 13-18: Certification**
- Stage 1 audit (documentation review, typically off-site, 1-2 days)
- Close Stage 1 findings, confirm Stage 2 readiness
- Stage 2 audit (effectiveness assessment, typically on-site/remote, 2-4 days)
- Certification decision and certificate issuance

### Certification Steps

See `iso-42001-certification-guide.md` for detailed audit preparation, CB selection, and post-certification surveillance obligations.

---

## 10. Quick Reference

### Control-to-Phase Mapping

| Annex A Control | Title | NIST Phase | Complexity |
|----------------|-------|-----------|-----------|
| A.2.2 | AI policy | GOVERN | Moderate |
| A.2.3 | Alignment with other policies | GOVERN | Moderate |
| A.2.4 | Review of AI policy | GOVERN | Low |
| A.2.5 | Topic-specific AI policies | GOVERN | Moderate |
| A.2.6 | Approach to AI within other policies | GOVERN | Moderate |
| A.3.2 | AI roles and responsibilities | GOVERN | Moderate |
| A.3.3 | Reporting | GOVERN | Low |
| A.3.4 | AI system-related processes | GOVERN | Moderate |
| A.4.2 | AI system inventory | IDENTIFY | Low |
| A.4.3 | AI-related resources and assets | IDENTIFY | Low |
| A.4.4 | Computational resources | IDENTIFY | Low |
| A.4.5 | Resources for AI development/operation | IDENTIFY | Low |
| A.4.6 | Environmental impact | IDENTIFY | Moderate |
| A.5.2 | AI impact assessment process | IDENTIFY | High |
| A.5.3 | Triggers for AI impact assessments | IDENTIFY | Low |
| A.5.4 | Conducting AI impact assessments | PROTECT | High |
| A.5.5 | Responding to AI system impacts | PROTECT | Moderate |
| A.6.1.2 | Responsible design objectives | PROTECT | Moderate |
| A.6.1.3 | AI system development processes | PROTECT | High |
| A.6.2.2 | Procurement | PROTECT | Moderate |
| A.6.2.3 | Deployment | PROTECT | Moderate |
| A.6.2.4 | Operation | DETECT | Moderate |
| A.6.2.5 | Decommissioning | PROTECT | Low |
| A.7.2 | Data acquisition and collection | PROTECT | Moderate |
| A.7.3 | Data quality | PROTECT | High |
| A.7.4 | Data provenance and attributes | PROTECT | Moderate |
| A.7.5 | Data preparation | PROTECT | Moderate |
| A.7.6 | Data management for third-party data | PROTECT | Moderate |
| A.8.2 | Information for users | DETECT | Moderate |
| A.8.3 | User notification of AI interaction | DETECT | Low |
| A.8.4 | Explanation of AI decisions | DETECT | High |
| A.8.5 | Context and assumptions | DETECT | Moderate |
| A.9.2 | Responsible use of AI systems | PROTECT | Moderate |
| A.9.3 | AI information literacy of users | PROTECT | Low |
| A.9.4 | Out-of-scope use | DETECT | Moderate |
| A.10.2 | Suppliers of AI resources | PROTECT | Moderate |
| A.10.3 | Customers and AI systems | PROTECT | Moderate |
| A.10.4 | End users of AI | PROTECT | Moderate |

### Glossary of ISO 42001 Terms

**AI system:** A machine-based system that, for a given set of objectives, makes predictions, recommendations, or decisions influencing real or virtual environments.

**AIMS:** Artificial Intelligence Management System — the organizational system for governing AI activities established under ISO 42001.

**HLS:** High-Level Structure — the common clause structure used by all modern ISO management system standards (Clauses 1-10).

**Impact assessment:** A systematic process to identify and assess actual or potential impacts of an AI system on individuals, groups, or society.

**Interested parties:** Individuals or groups that have an interest in or are affected by the organization's AI activities (also: stakeholders).

**Top management:** Person or group of people who direct and control an organization at the highest level.

**Annex A:** The normative AI-specific controls of ISO 42001. All 38 controls are binding requirements.

**Annex B:** Non-normative implementation guidance corresponding to each Annex A control. Not audited directly but authoritative for interpretation.

**IAF:** International Accreditation Forum — the international body that accredits national accreditation bodies, which in turn accredit certification bodies.

**CB:** Certification Body — a third-party organization accredited by an IAF member to assess and certify organizations against management system standards including ISO 42001.

**Conformity Body:** ISO 42001 uses "Certification Body" (CB) terminology consistent with other ISO management standards. See `iso-42001-certification-guide.md` for accredited CBs.
