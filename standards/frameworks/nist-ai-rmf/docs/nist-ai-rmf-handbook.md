---
type: reference
name: nist-ai-rmf-handbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-25
framework: "NIST AI Risk Management Framework"
framework_version: "1.0"
---

# NIST AI Risk Management Framework (AI RMF) 1.0 Handbook

**Version:** 1.0 | **Provider:** National Institute of Standards and Technology (NIST)
**Controls:** 72 subcategories | **Functions:** 4 (GOVERN, MAP, MEASURE, MANAGE)
**Last Updated:** 2026-02-25

---

## How to Use This Handbook

This handbook is the practitioner's guide to the NIST AI Risk Management Framework (AI RMF) 1.0.
Read it cover-to-cover to understand what the framework requires, how the IA assessment workflow
evaluates it, and what you need to prepare. It bridges the gap between structured assessment data
(controls.yaml, questions.yaml) and the narrative understanding needed to work through the framework
effectively.

**This handbook IS:** A narrative walkthrough of the NIST AI RMF, its four functions, and how to
build a profile and manage compliance over time.

**This handbook is NOT:**
- The implementation guide (per-subcategory gap closure steps)
- The controls definition (structured machine-readable data in controls.yaml)
- The assessment questions (interview/evaluation questions in questions.yaml)

**Related artifacts:**
- `controls.yaml` -- Structured subcategory definitions for all 72 controls
- `questions.yaml` -- Assessment questions with evidence requirements and scoring criteria
- `docs/nist-ai-rmf-implementation-guide.md` -- Per-subcategory gap closure steps (if available)

---

## 1. Framework Overview

### What the NIST AI RMF Is

The NIST AI Risk Management Framework (AI RMF) 1.0 is a voluntary framework for managing risks
throughout the AI system lifecycle. Published as NIST AI 100-1 in January 2023, it provides
organizations with a structured, flexible approach to identifying, assessing, and managing the
risks of AI systems they develop, deploy, or use.

The framework is organized into two parts. Part 1 is a narrative section that defines AI risk
concepts, articulates trustworthy AI characteristics (accuracy, reliability, explainability,
privacy, fairness, safety, security, accountability, and transparency), and describes how
organizations should think about AI risk. Part 2 is the operative section -- the Core -- which
defines four functions (GOVERN, MAP, MEASURE, MANAGE) and 72 subcategories that together
constitute a comprehensive AI risk management program.

The AI RMF is explicitly not a compliance checklist. NIST designed it to be used through
**profiles**: an organization creates a current profile (where it is now) and a target profile
(where it wants to be), then uses the gap between them to drive an action plan. This
profile-based approach distinguishes the AI RMF from check-the-box frameworks and makes it
equally applicable to a startup standing up its first AI program and an enterprise refining a
mature one.

### Current Version

- **Version:** 1.0 (NIST AI 100-1)
- **Release date:** January 2023
- **Published by:** National Institute of Standards and Technology (NIST)
- **Official URL:** https://airc.nist.gov/
- **Update cadence:** Living document with ongoing sector-specific profiles, playbooks, and
  companion resources (e.g., Generative AI Profile, AI RMF Playbook)

### Why It Matters

Three factors make the NIST AI RMF important in 2026:

1. **Federal procurement and policy.** OMB memoranda on responsible AI use in federal agencies
   reference or require alignment with the AI RMF. Organizations selling AI systems to the US
   government increasingly face AI RMF expectations in procurement. Federal agencies developing
   or deploying AI are expected to demonstrate alignment with its functions.

2. **Regulatory cross-reference.** The EU AI Act (Art-9) risk management requirements are
   structurally parallel to the NIST AI RMF's MEASURE and MANAGE functions. State-level AI
   legislation in Colorado (SB 205), California (SB 1047 successor), and other jurisdictions
   references the framework. Courts and regulators have begun citing AI RMF alignment as
   evidence of reasonable care.

3. **Operational clarity.** The framework's four-function structure -- govern the program,
   map the risks, measure them, manage them -- gives organizations a vocabulary and workflow
   for AI risk that maps cleanly to existing enterprise risk management structures. Teams
   that have used NIST CSF for cybersecurity find the AI RMF immediately navigable.

### Target Audience

The AI RMF was designed for any organization involved in the AI lifecycle:

- **AI developers:** Organizations building foundation models, AI products, or AI-enabled
  services. GOVERN and MAP functions apply at design time; MEASURE and MANAGE apply through
  deployment and post-market monitoring.
- **AI deployers:** Organizations integrating third-party AI models or services into their
  products and operations. MAP 4.x and MANAGE 3.x cover third-party risk management.
- **AI users:** Organizations using AI systems built by others. GOVERN functions apply to
  internal AI governance policies; MAP and MEASURE functions apply to vendor evaluation.

---

## 2. Who Needs This Framework

### Industry Applicability

| Industry | Priority | Rationale |
|----------|----------|-----------|
| Technology & AI | Recommended | Federal customers require it; foundational for responsible AI product development |
| Healthcare | Recommended | High-stakes AI decisions; FDA aligns AI/ML guidance with AI RMF concepts |
| Financial Services | Recommended | OCC, FDIC, and SEC AI guidance references AI RMF; vendor risk expectations |
| Defense | Recommended | DoD AI Adoption Strategy aligns with AI RMF; CDAO guidance |
| Critical Infrastructure | Recommended | CISA AI guidance references AI RMF for critical sector operators |
| Education | Optional | Increasing use of AI in admissions, content, and assessment decisions |
| All sectors | Optional | Applicable whenever AI systems create material risk to people or operations |

### Company Size and Type Guidance

- **Enterprise (1,000+ employees):** The AI RMF's tiered maturity model (Tiers 1-4, described
  in Section 3) handles enterprise scale well. Large organizations benefit from its
  cross-functional structure, which assigns governance, risk, engineering, and legal
  responsibilities across distinct functions. The framework accommodates portfolio-level AI
  risk management across many systems.

- **Mid-market (100-1,000 employees):** The profile approach is well-suited to organizations
  building AI practices from a lower base. Start with a current-state profile that honestly
  assesses gaps, then build a target profile focused on the highest-risk AI systems.

- **Startups (<100 employees):** Apply selectively to high-risk AI systems. GOVERN 1 and MAP 1
  provide essential governance foundations. MEASURE 2.6 (safety risk evaluation) and MANAGE 2.4
  (kill-switch mechanisms) are critical even at early stage. The full 72-subcategory scope is
  not required from day one -- the framework is explicitly tiered.

### Regulatory vs. Voluntary

The NIST AI RMF is **voluntary in the United States**. There is no mandatory compliance
requirement for US private sector organizations. However, voluntary status is increasingly
nominal:

- OMB M-24-10 (Advancing Governance, Innovation, and Risk Management for Agency Use of
  Artificial Intelligence) requires federal agencies to align AI risk management with the
  AI RMF. Federal contractors and AI vendors face downstream expectations.
- State AI legislation in Colorado, Illinois, and elsewhere explicitly references AI RMF
  alignment as evidence of responsible AI practices.
- The EU AI Act's Article 9 risk management system requirements are structurally compatible
  with the AI RMF; organizations building to one effectively make progress on the other.
- Insurance underwriters and enterprise procurement teams are beginning to require AI RMF
  alignment documentation.

### Common Compliance Portfolios

Organizations pursuing NIST AI RMF alignment typically also maintain:

- **NIST AI RMF + ISO 42001:** The most common pairing. ISO 42001 is a certifiable AI
  management system standard; the AI RMF provides the risk vocabulary and subcategory depth.
  Evidence produced for ISO 42001 Clause 6 (planning) and Clause 9 (monitoring) overlaps
  substantially with MAP and MEASURE functions. The two frameworks are complementary, not
  competing.
- **NIST AI RMF + NIST CSF 2.0:** Natural progression for organizations already using NIST
  CSF for cybersecurity. The AI RMF's GOVERN function structure mirrors CSF's GV domain. CSF
  DETECT and RESPOND map to AI RMF MEASURE 2.4 and MANAGE 4.x. Shared language reduces
  training burden.
- **NIST AI RMF + EU AI Act:** For organizations subject to the EU AI Act, AI RMF provides
  the operational detail that the Act's high-level requirements leave to implementers.
  MEASURE and MANAGE functions give practitioners the specific assessment activities that
  Art-9 risk management requires.
- **NIST AI RMF + AIUC-1:** AIUC-1 provides specific quarterly testing requirements for AI
  agents; the AI RMF provides the broader governance and context framework within which
  AIUC-1's technical controls sit.

---

## 3. Framework Architecture

### Control Organization

The AI RMF Core is organized into four functions, nineteen categories, and 72 subcategories.
Functions represent broad areas of activity. Categories are outcomes within each function.
Subcategories are the specific practices that produce those outcomes.

Subcategories are notated as `FUNCTION X.Y` where X is the category number and Y is the
subcategory number within that category. For example, GOVERN 2.1 is the first subcategory
of the second category within the GOVERN function.

GOVERN is architecturally distinct from the other three functions. Per Section 2.2 of NIST
AI 100-1, GOVERN is **cross-cutting**: it provides the policies, accountability, culture, and
resources that underpin MAP, MEASURE, and MANAGE. MAP, MEASURE, and MANAGE operate
sequentially and iteratively -- you map risks, measure them, and manage them -- but GOVERN
must be present across all of those activities.

### Function Summary

| Function | Purpose | Categories | Subcategories |
|----------|---------|:----------:|:-------------:|
| GOVERN (GV) | Cultivate a culture of risk management; establish policies, accountability, and resources | 6 | ~30 |
| MAP (MP) | Establish and understand context; categorize AI risks | 5 | ~19 |
| MEASURE (MR) | Analyze, assess, and track AI risks using quantitative and qualitative methods | 4 | ~14 |
| MANAGE (MG) | Prioritize, respond to, and monitor AI risks | 4 | ~9 |

### The Four Functions Explained

**GOVERN** is the organizational foundation. It covers: policies and procedures for AI risk
management (Govern 1), accountability structures and role definitions (Govern 2), workforce
diversity and human-AI oversight configurations (Govern 3), organizational culture and safety
mindset (Govern 4), engagement with external stakeholders (Govern 5), and third-party supply
chain risk policies (Govern 6). GOVERN subcategories are assessed at the organizational level,
not the individual AI system level.

**MAP** is where you characterize each AI system and its risk environment. It covers:
establishing context -- deployment setting, applicable laws, organizational mission (Map 1),
categorizing the AI system by task type and method (Map 2), documenting expected benefits,
costs, and scope (Map 3), mapping risks across system components including third parties
(Map 4), and characterizing impacts across affected populations (Map 5). MAP work is done
early -- ideally before deployment -- and revisited when systems change.

**MEASURE** is where you evaluate what you mapped. It covers: selecting and applying risk
metrics (Measure 1), evaluating AI systems for trustworthy characteristics including safety,
security, privacy, fairness, reliability, and explainability (Measure 2), tracking risks over
time including emergent risks (Measure 3), and incorporating feedback from domain experts and
affected communities into measurement interpretation (Measure 4). MEASURE produces the
quantitative and qualitative evidence that MANAGE acts on.

**MANAGE** is where you respond. It covers: prioritizing documented risks and deciding whether
to proceed with deployment (Manage 1), implementing risk response strategies and kill-switch
mechanisms (Manage 2), managing third-party AI risks including pre-trained models (Manage 3),
and executing post-deployment monitoring, continual improvement, and incident communication
(Manage 4).

### Profiles

A profile is a snapshot of an organization's AI risk management posture. The AI RMF defines
two profile types:

- **Current Profile:** Documents the organization's present-state implementation of AI RMF
  subcategories. Honest self-assessment against all 72 subcategories, noting which are fully
  implemented, partially implemented, or absent.
- **Target Profile:** Documents the desired future state, selected based on risk priorities,
  regulatory requirements, and organizational capacity.

The gap between current and target profiles drives the action plan. Organizations pursuing
federal contracts or EU AI Act compliance typically set target profiles that fully implement
high-risk-weighted subcategories.

### Tiers

Tiers describe the sophistication of an organization's AI risk management practices overall.
They are not per-subcategory ratings -- they characterize the program as a whole:

| Tier | Name | Description |
|:----:|------|-------------|
| 1 | Partial | Risk management is ad hoc or reactive. Little to no organizational integration. |
| 2 | Risk Informed | Risk management practices exist but are not consistently applied across the organization. Not formally adopted. |
| 3 | Repeatable | AI risk management practices are formally adopted as policy, applied consistently, and regularly reviewed. |
| 4 | Adaptive | Organization continually improves AI risk management based on lessons learned. Proactive engagement with the AI risk landscape. |

Most organizations beginning AI RMF alignment start at Tier 1 or 2. Federal procurement
expectations typically require Tier 3 or higher for high-stakes AI systems.

---

## 4. Assessment Workflow Mapping

### How IA Assesses NIST AI RMF

The IA Framework maps NIST AI RMF subcategories to the IA assessment workflow using the
questions.yaml domain assignments: governance domain (GOVERN and MANAGE), asset_management
domain (MAP), and monitoring domain (MEASURE). Assessment activities are grouped accordingly.

| IA Assessment Phase | AI RMF Functions | Focus |
|--------------------|-----------------|-------|
| Governance review | GOVERN 1-2 | Policies, risk management process, accountability structures, training |
| Workforce and culture | GOVERN 3-4 | Human-AI oversight configurations, safety culture, risk documentation practices |
| Stakeholder and supply chain | GOVERN 5-6 | External feedback mechanisms, third-party risk policies |
| Context and categorization | MAP 1-2 | Deployment context, applicable laws, AI system technical characterization |
| Impact and risk identification | MAP 3-5 | Benefits/costs analysis, scope, component risks, impact assessment |
| Metrics and TEVV | MEASURE 1-2 | Risk measurement methodology, testing/evaluation, production monitoring |
| Risk tracking | MEASURE 3-4 | Ongoing risk tracking, feedback integration, performance trends |
| Prioritization and response | MANAGE 1-2 | Go/no-go decisions, risk response plans, kill-switch mechanisms |
| Third-party and post-deployment | MANAGE 3-4 | Pre-trained model monitoring, post-deployment plans, incident communication |

### Multi-Agent Routing

| Agent | AI RMF Responsibilities |
|-------|------------------------|
| **Advisor** | GOVERN 1-6: Governance policy review, accountability structures, training records, culture assessment, stakeholder engagement mechanisms, supply chain policies. Conducts stakeholder interviews, reviews policy documentation, evaluates governance maturity. |
| **Security** | MEASURE 2.6-2.7 (safety and security evaluation), MAP 4.1-4.2 (component risk mapping). Evaluates adversarial testing evidence, security assessment reports, and residual risk documentation. |
| **Developer** | MAP 2.1-2.3 (AI system technical characterization, TEVV documentation), MEASURE 2.1-2.5 (performance evaluation, validity/reliability). Reviews technical documentation and evaluation methodologies. |

### Phase Dependencies

GOVERN is assessed before MAP, MEASURE, and MANAGE. Without governance foundations in place,
the practices in the other three functions are typically absent or informal. The practical
assessment sequence is:

1. GOVERN (policies and accountability as prerequisites)
2. MAP (context and risk identification for each AI system in scope)
3. MEASURE (evaluation evidence for identified risks)
4. MANAGE (response, monitoring, and incident records)

---

## 5. Control Family Walkthroughs

### Function: GOVERN

**Purpose:** Establish the organizational policies, accountability structures, culture, and
engagement practices that make AI risk management possible across the entire lifecycle.

**Subcategories covered:** GOVERN 1.1 through GOVERN 6.2 (approximately 30 subcategories
across 6 categories)

GOVERN is the function assessors spend the most time on because it determines whether the
other three functions are operational or aspirational. An organization can have detailed MAP
artifacts and sophisticated MEASURE tooling, but if GOVERN is absent -- no policies, no
assigned accountability, no training, no culture of safety -- those artifacts will be
inconsistent, incomplete, and ultimately unconvincing.

---

**Category: Govern 1 -- Policies, processes, procedures, and practices**

Govern 1 requires that the organization's policies for AI risk management are transparent,
implemented, and actively maintained.

- **GOVERN 1.1** requires legal and regulatory requirements involving AI to be tracked,
  documented, and managed. In practice, this means maintaining an AI regulatory register
  that identifies applicable laws (EU AI Act, state regulations, sector-specific rules),
  assigns ownership to track changes, and shows evidence of compliance actions. Many
  organizations have legal team involvement in privacy compliance but lack AI-specific
  regulatory tracking. The assessor looks for a living document, not a one-time legal memo.

- **GOVERN 1.2** requires trustworthy AI characteristics -- accuracy, reliability,
  explainability, safety, security, privacy, fairness, and accountability -- to be formally
  integrated into organizational policy. Integration means more than mentioning these terms
  in a policy document. Assessors look for measurable criteria, development checklists, and
  training materials that operationalize these properties. Per Section 2.1 of NIST AI 100-1,
  these characteristics apply across the full AI lifecycle, not just at deployment.

- **GOVERN 1.3** requires processes to determine the appropriate level of AI risk management
  activity based on the organization's risk tolerance. This is the AI risk tiering mechanism:
  a system classified as low-risk should receive proportionate risk management effort, while
  a high-risk system should receive more intensive attention. Without tiering criteria,
  organizations either under-resource risk management for high-risk systems or waste effort
  on low-risk ones.

- **GOVERN 1.4** requires the risk management process itself to be transparent and based on
  documented risk priorities. The process should be publicly accessible to relevant
  stakeholders and demonstrably applied.

- **GOVERN 1.5** requires ongoing monitoring and periodic review of the risk management
  process with clearly defined roles. This is the governance cadence requirement: scheduled
  reviews, assigned reviewers, and records of what was reviewed and what changed.

- **GOVERN 1.6** requires an AI system inventory resourced according to risk priorities.
  Organizations need to know what AI systems they have, what risk level each carries, and
  whether risk management resources are allocated accordingly. An inventory is also a
  prerequisite for EU AI Act compliance (Art-51 registration) and ISO 42001 context
  establishment.

- **GOVERN 1.7** requires decommissioning procedures for AI systems that ensure safe
  retirement without creating new risks. This includes data deletion, model artifact
  handling, and notification to downstream users. Many organizations have never decommissioned
  an AI system formally and lack any documented process for it.

**What good looks like for Govern 1:** Published AI Governance Policy document (with version
history, board or executive approval signature, and effective date) that explicitly references
trustworthy AI characteristics and maps them to internal development standards. An AI
regulatory register maintained by legal or compliance, updated quarterly, showing applicable
laws by jurisdiction with assigned owners and compliance actions. An AI inventory spreadsheet
listing all production AI systems with risk tier (Low/Medium/High/Critical), system owner,
deployment date, and last risk review date. An AI system retirement runbook documenting data
deletion schedules, model artifact handling, and downstream notification procedures.

---

**Category: Govern 2 -- Accountability structures**

Govern 2 requires that the right people are empowered, responsible, and trained.

- **GOVERN 2.1** requires documented roles and responsibilities and clear lines of
  communication for AI risk management. A RACI matrix specific to AI risk management is the
  most common implementation. It should distinguish between roles for mapping risks, measuring
  them, managing them, and governing the overall program.

- **GOVERN 2.2** requires AI risk management training for all personnel and partners whose
  duties involve AI systems. Training should be role-differentiated: a data scientist needs
  different content than a product manager or a legal reviewer. Completion records are
  required evidence.

- **GOVERN 2.3** requires executive leadership to take active responsibility for AI risk
  decisions. Board or executive committee oversight of high-risk AI deployments, with approval
  records, demonstrates this. An AI governance charter signed by the CISO or CTO is
  necessary but not sufficient -- assessors look for evidence of active exercise, not just
  paper authority.

**What good looks like for Govern 2:** RACI matrix for AI risk management with named roles
(not job titles -- actual role categories) and escalation paths. AI risk management training
materials segmented by role (technical, governance, operations) with completion records for
all relevant staff. Board or executive committee meeting minutes showing AI risk oversight as
a standing agenda item. Sign-off records for high-risk AI deployments showing executive
approval.

---

**Category: Govern 3 -- Workforce diversity, equity, inclusion, and accessibility**

Govern 3 addresses the composition of teams making AI risk decisions.

- **GOVERN 3.1** requires AI risk decision-making to be informed by diverse,
  interdisciplinary teams. Per Section 2.5 of NIST AI 100-1, homogeneous teams with narrow
  domain expertise systematically miss risk categories they have no experience with. Diversity
  here means demographic diversity, domain diversity (technical, ethical, legal, operational,
  domain-specific), and user perspective inclusion.

- **GOVERN 3.2** requires policies defining roles in human-AI configurations -- specifically
  distinguishing human-in-the-loop, human-on-the-loop, and fully automated configurations.
  Each configuration carries different oversight requirements. A system where humans review
  every AI decision before action requires different policies than one where humans only
  intervene on flagged outputs.

**What good looks like for Govern 3:** Team composition documentation showing diverse
representation across technical, ethical, legal, and domain roles. Policy document defining
the three human-AI configuration types with examples of when each is required. Operating
procedures for AI systems requiring human intervention, including what triggers review and
who performs it.

---

**Category: Govern 4 -- Organizational culture**

Govern 4 addresses whether the organization's culture actively supports AI risk management.

- **GOVERN 4.1** requires policies and practices fostering a critical thinking and
  safety-first mindset. This goes beyond policy documents -- it means that raising safety
  concerns is encouraged, red team exercises are conducted, and AI systems are questioned
  rather than trusted uncritically. Assessors look for psychological safety mechanisms,
  not just policy language.

- **GOVERN 4.2** requires teams to document risks and potential impacts of AI technology
  they work with at every lifecycle stage -- design, development, deployment, evaluation, and
  use. This produces the model cards, risk registers, and impact assessments that feed the
  MAP and MEASURE functions. Without this practice, MAP artifacts are ad hoc.

- **GOVERN 4.3** requires practices enabling AI testing, incident identification, and
  information sharing. This includes red teaming procedures, AI-specific incident reporting
  channels (distinct from general IT incident management), and participation in external
  information-sharing programs (CISA advisories, sector-specific ISACs).

**What good looks like for Govern 4:** AI ethics or safety policy with defined safety concern
escalation procedures (not just "raise with your manager" -- a specific channel and
accountability structure). Red team exercise records showing participation and findings.
AI-specific incident reporting procedures with examples of AI incidents reported (adversarial
inputs, unexpected outputs, fairness issues) distinct from infrastructure incidents.

---

**Category: Govern 5 -- Engagement with relevant AI actors**

Govern 5 requires mechanisms for collecting and integrating external feedback about AI impacts.

- **GOVERN 5.1** requires policies and practices to collect, consider, prioritize, and
  integrate feedback from external stakeholders about individual and societal impacts. This
  includes user feedback, community input, advocacy group engagement, and public comment
  mechanisms. For consumer-facing AI systems, this often means dedicated feedback channels
  and a documented process for escalating societal impact concerns.

- **GOVERN 5.2** requires mechanisms for AI development and deployment teams to regularly
  incorporate adjudicated feedback into system design and implementation. Adjudicated means
  there is a deliberate process for deciding which feedback to act on -- not just
  accumulating input but doing something with it.

**What good looks like for Govern 5:** External feedback collection mechanisms with documented
review process (who reads it, how often, what triggers escalation). Change log or release
notes showing feedback-driven system changes with the originating feedback cited.

---

**Category: Govern 6 -- Third-party and supply chain policies**

Govern 6 addresses risks from AI components and services sourced externally.

- **GOVERN 6.1** requires policies addressing AI risks from third-party entities, including
  IP infringement risks. As organizations increasingly build on foundation models and
  third-party AI APIs, this means vendor contracts with AI-specific risk clauses, IP rights
  review procedures, and data handling assessments for each AI vendor.

- **GOVERN 6.2** requires contingency processes for failures or incidents in third-party AI
  systems classified as high-risk. If an organization's core AI capability depends on a
  third-party model provider, what happens when that provider has an outage, changes model
  behavior, or has a security incident? The contingency plan should be tested, not just
  documented.

**What good looks like for Govern 6:** Third-party AI vendor risk policy with IP review
procedures and vendor contract templates containing AI-specific clauses. Business continuity
plan for high-risk third-party AI dependencies with tested fallback procedures (tabletop
exercise records showing the plan works).

---

### Function: MAP

**Purpose:** Establish context for each AI system, identify applicable risks, and categorize
them before deployment and throughout the lifecycle.

**Subcategories covered:** MAP 1.1 through MAP 5.2 (19 subcategories across 5 categories)

MAP is the discovery and documentation function. Its outputs feed MEASURE (what to measure)
and MANAGE (what to respond to). MAP work done well at design time prevents costly remediation
after deployment. A common failure mode is organizations treating MAP as a post-deployment
exercise -- documenting risks after a system has already been in production for months.

---

**Category: Map 1 -- Context is established and understood**

Map 1 produces the contextual foundation for every risk assessment.

- **MAP 1.1** requires the intended purposes, applicable laws, norms, expectations, and
  prospective deployment settings to be understood and documented before deployment. This is
  the use case document: what is the system supposed to do, where will it be deployed, what
  legal obligations apply in those settings, and what do users and operators expect?

- **MAP 1.2** requires the team doing this context work to reflect demographic diversity and
  broad domain expertise. A team of ML engineers documenting deployment context for a
  healthcare AI system without clinical or patient representation will produce incomplete
  context.

- **MAP 1.3** and **MAP 1.4** require the organization's mission and the business value of
  the AI system to be documented and connected. This is both a project management requirement
  (is this AI system actually serving organizational goals?) and a risk management one (a
  system whose business value is poorly defined is harder to risk-manage because success
  criteria are unclear).

- **MAP 1.5** requires organizational risk tolerances to be documented for AI specifically.
  A general enterprise risk tolerance statement is not sufficient -- AI systems present
  failure modes (hallucinations, discriminatory outputs, adversarial vulnerabilities) that
  traditional risk tolerance frameworks do not address.

- **MAP 1.6** requires system requirements to be elicited from diverse AI actors with explicit
  attention to socio-technical implications. Socio-technical analysis asks: how will this
  system change workflows, power relationships, and decision-making authority? Who benefits?
  Who bears risk? These are not purely technical questions.

---

**Category: Map 2 -- Categorization of the AI system**

Map 2 produces technical characterization of the AI system.

- **MAP 2.1** requires the specific AI tasks and methods to be defined and documented (e.g.,
  "a generative language model fine-tuned for document summarization" is more useful for
  risk assessment than "an AI-powered assistant"). The categorization shapes which MEASURE
  subcategories apply -- a generative model needs different safety evaluation than a
  classifier.

- **MAP 2.2** requires documentation of the system's knowledge limits and how human oversight
  applies to outputs. Model cards are the standard vehicle for this. Knowledge limits include
  training data cutoffs, known out-of-distribution failure modes, confidence calibration
  issues, and the conditions under which the system should not be used autonomously.

- **MAP 2.3** requires TEVV (testing, evaluation, verification, and validation)
  considerations to be identified, including scientific integrity requirements for
  experimental design and data selection. This is particularly important for organizations
  developing or fine-tuning models -- data collection methodology and selection bias
  significantly affect downstream performance on underrepresented populations.

---

**Category: Map 3 -- Capabilities, targeted usage, goals, and expected benefits and costs**

Map 3 defines what the system is supposed to accomplish and what failure costs.

- **MAP 3.1** and **MAP 3.2** require both benefits and costs (including non-monetary costs)
  to be examined and documented. Non-monetary costs include harm to individuals from incorrect
  AI decisions (a loan denial, a medical misdiagnosis, a false fraud flag), erosion of
  autonomy, and community impacts. Many organizations document benefits thoroughly and costs
  superficially.

- **MAP 3.3** requires the application scope to be specified -- explicit in-scope and
  out-of-scope use cases. This directly enables safety controls: a system scoped for customer
  service should not be answering medical questions, and that scope boundary should be
  technically enforced and documented.

- **MAP 3.4** and **MAP 3.5** require operator proficiency and human oversight processes to
  be defined and assessed. Who operates this system? What do they need to know to do it
  safely? When does a human need to intervene? These questions should have documented answers
  before deployment.

---

**Category: Map 4 -- Risks and benefits of AI components**

Map 4 extends risk identification to system components and third-party dependencies.

- **MAP 4.1** requires a methodology for mapping technology and legal risks across all
  components, including third-party data and software. A fine-tuned model built on a
  foundation model from a third party inherits risks from that foundation model -- data
  contamination, training artifacts, capability limitations. Those inherited risks must be
  documented.

- **MAP 4.2** requires internal risk controls for each system component to be identified and
  documented. This is the component-level risk register: each piece of the system carries
  specific risks, and each needs specific controls.

---

**Category: Map 5 -- Impacts are characterized**

Map 5 produces the impact characterization that ties risks to real-world consequences.

- **MAP 5.1** requires likelihood and magnitude of each identified impact to be documented
  for both beneficial and harmful outcomes. This is the formal risk assessment step: not just
  listing risks but rating them. Per ISO 42005 Clause 6.8 alignment in the crosswalk, this
  activity directly produces the input that MANAGE 1.2 (prioritization) requires.

- **MAP 5.2** requires practices and personnel for regular engagement with affected
  communities to be documented. Impact characterization is most accurate when people who
  will actually experience the system's outputs are consulted. This is where AI RMF moves
  beyond purely technical risk assessment.

**What good looks like across MAP:** A completed AI system use case document for each in-scope
system, covering intended purposes, deployment settings, applicable law, risk tolerance, and
scope boundaries. A model card or equivalent technical characterization including method type,
knowledge limits, training data summary, and known failure modes. An impact assessment with
likelihood/magnitude ratings for both beneficial and harmful impacts, reviewed by domain
experts and at least one representative of affected populations. A component risk register
covering all third-party AI dependencies.

---

### Function: MEASURE

**Purpose:** Analyze, assess, benchmark, and monitor AI risks using quantitative, qualitative,
or mixed-method evaluation.

**Subcategories covered:** MEASURE 1.1 through MEASURE 4.3 (approximately 14 subcategories
across 4 categories)

MEASURE is where abstract risk identification becomes empirical. MAP asks "what could go
wrong?" MEASURE asks "what is actually happening, and how bad is it?" The common failure mode
is organizations that perform functional testing (does the system do what it's supposed to do?)
but skip safety, fairness, privacy, and security evaluation. Functional accuracy is one metric.
NIST AI RMF requires several more.

---

**Category: Measure 1 -- Appropriate methods and metrics are identified and applied**

- **MEASURE 1.1** requires risk measurement approaches and metrics to be selected based on
  the risks identified in MAP, prioritizing the most significant. The output of MAP 5.1
  (likelihood and magnitude ratings) directly determines which MEASURE activities warrant
  most investment. An organization that identified bias as a high-priority risk needs
  comprehensive fairness metrics, not just accuracy metrics.

- **MEASURE 1.2** requires these metrics and the controls they evaluate to be regularly
  reviewed and updated, including following error reports or incident findings. Metrics that
  were appropriate at launch may become inadequate as system behavior or deployment context
  changes.

- **MEASURE 1.3** requires independent review -- either internal experts not involved in
  front-line development, or external assessors. Self-assessment by the team that built the
  system is insufficient for high-risk AI. This does not require a formal audit; internal
  separation of duties satisfies the requirement at lower risk levels.

---

**Category: Measure 2 -- AI systems evaluated for trustworthy characteristics**

Measure 2 is the longest category (13 subcategories) and covers the full range of
trustworthy AI evaluation.

- **MEASURE 2.1** requires TEVV test sets, metrics, and tools to be documented. For a
  generative model this means: what prompts or scenarios were tested, what metrics were
  used (BLEU, ROUGE, human evaluation, adversarial probe pass rate), and what tools ran
  the evaluation. This documentation makes evaluation reproducible and auditable.

- **MEASURE 2.2** requires evaluations involving human subjects to meet applicable
  requirements and represent the relevant population. For consumer AI systems, this means
  usability studies and fairness evaluations use demographically representative test panels.
  IRB or ethics board review may apply depending on jurisdiction and population.

- **MEASURE 2.3** requires performance criteria to be measured under conditions similar to
  the actual deployment setting. A customer service AI tested only with clean, well-formed
  queries may perform poorly in production with real-world inputs. Pre-deployment testing
  should use realistic test conditions.

- **MEASURE 2.4** requires production monitoring of AI system functionality and behavior.
  This is continuous monitoring in deployment: drift detection, anomaly alerting, output
  quality sampling, and user feedback integration. Per EU AI Act Art-9 and ISO 42001 Clause
  9.1 alignment, post-market monitoring is a requirement across multiple frameworks. The
  evidence needed is monitoring dashboards, alert configurations, and review records
  showing someone actually reviews what the monitoring captures.

- **MEASURE 2.5** requires validity and reliability to be demonstrated with documented
  generalizability limitations. A model valid for US English healthcare records may not
  generalize to other languages, regions, or care settings. Those limitations must be
  documented to prevent unsafe out-of-scope use.

- **MEASURE 2.6** requires regular safety risk evaluation with residual negative risk
  demonstrated to be within the organization's risk tolerance (from GOVERN 1.3 and MAP 1.5).
  Safety evaluation for AI specifically includes evaluation for harmful outputs, model
  misuse potential, and failure modes that create direct harm to users or third parties.

- **MEASURE 2.7** requires AI system security and resilience to be evaluated and documented.
  Per the OWASP LLM Top 10 alignment in the crosswalk (LLM05, LLM07), this includes
  adversarial input testing, prompt injection resilience, and denial-of-service resilience.
  Security evaluation is distinct from safety evaluation -- security addresses intentional
  attacks; safety addresses unintended harmful behavior.

- **MEASURE 2.8** through **MEASURE 2.11** address transparency/accountability risks,
  model explainability, privacy risks, and fairness/bias. These four subcategories correspond
  to trustworthy AI characteristics in NIST AI 100-1 Part 1. Assessors look for:
  explainability techniques used (SHAP, LIME, attention attribution), a privacy impact
  assessment (PIA), and bias evaluation results across relevant demographic groups with
  documented remediation for identified bias.

- **MEASURE 2.12** requires environmental impact and sustainability of AI training to be
  assessed. This is a lower-weight subcategory for most organizations but is required by EU
  AI Act Art-51/56 provisions for general-purpose AI and is increasingly part of ESG
  reporting.

- **MEASURE 2.13** requires the TEVV process itself to be evaluated for effectiveness.
  Are the metrics sensitive enough to detect the risks they're measuring? Are test sets
  still representative of current deployment conditions? This is the quality assurance layer
  on top of evaluation.

---

**Category: Measure 3 -- Risk tracking mechanisms**

- **MEASURE 3.1** requires approaches, personnel, and documentation to regularly identify and
  track existing, unanticipated, and emergent AI risks. This means the risk register is a
  living document, not a launch artifact. New attack techniques, regulatory changes, and
  discovered failure modes all generate new risks that need to enter the tracking process.

- **MEASURE 3.2** requires consideration of risk tracking approaches for risks that are
  difficult to measure with currently available techniques. This is honest about measurement
  limitations: some AI risks (long-term societal impact, emergent capabilities in large
  models) cannot be fully quantified. Qualitative tracking, expert monitoring, and research
  participation are valid responses to measurement gaps.

- **MEASURE 3.3** requires user and community feedback mechanisms for reporting problems
  and appealing AI decisions. Per EU AI Act Art-27 alignment, this is a transparency
  obligation. The mechanism must be documented and integrated -- not just a contact email
  that goes unanswered.

---

**Category: Measure 4 -- Feedback about efficacy of measurement**

Measure 4 closes the loop by connecting measurement results to real-world expertise.

- **MEASURE 4.1** through **MEASURE 4.3** require measurement approaches and results to be
  connected to deployment context through consultation with domain experts and end users,
  with performance improvements or declines documented based on those consultations. This
  prevents the common failure of measurement teams operating in isolation from the people
  who actually use and are affected by the AI system.

**What good looks like across MEASURE:** An evaluation plan document specifying metrics for
each risk category identified in MAP, with rationale for metric selection. TEVV test set
documentation including data provenance, demographic representation analysis, and tool
inventory. A fairness and bias evaluation report with results across relevant groups and
remediation records for identified issues. A privacy impact assessment. Production monitoring
dashboards with alert configurations and documented review cadence. An independent review
report (internal or external) covering at least MEASURE 1.3 independence requirements.

---

### Function: MANAGE

**Purpose:** Prioritize, respond to, and monitor AI risks based on MAP and MEASURE outputs.

**Subcategories covered:** MANAGE 1.1 through MANAGE 4.3 (approximately 9 subcategories
across 4 categories)

MANAGE converts risk analysis into action. It is the operational function: deployment
decisions, risk response plans, kill-switch mechanisms, vendor monitoring, and incident
communication. MANAGE is where the AI RMF most directly connects to existing incident
response, vendor management, and change management processes -- but requires AI-specific
adaptations to each.

---

**Category: Manage 1 -- AI risks prioritized, responded to, and managed**

- **MANAGE 1.1** requires a formal determination of whether the AI system achieves its
  intended purposes and whether development or deployment should proceed. This is the go/no-go
  gate: defined criteria for proceeding, named decision authority, and records of the
  decision. Many organizations deploy AI without a formal proceed decision and face
  significant difficulty reconstructing the accountability chain later.

- **MANAGE 1.2** requires risk treatment to be prioritized based on impact, likelihood, and
  available resources. The MAP 5.1 likelihood/magnitude ratings are the input. Prioritization
  methodology should be documented so it's reproducible across different AI systems.

- **MANAGE 1.3** requires responses to high-priority risks to be developed and documented.
  Risk response options include mitigating (adding controls), transferring (insurance, vendor
  contracts), avoiding (not deploying), or accepting (documenting the accepted residual risk).
  Per Section 2.6 of NIST AI 100-1, acceptance of residual risk should be a documented,
  deliberate decision by an appropriate authority.

- **MANAGE 1.4** requires negative residual risks to downstream acquirers and end users to
  be documented and disclosed. If an organization deploys an AI system with known limitations,
  those limitations must be communicated to the people who will use it or be affected by it.
  This is both an ethical obligation and an EU AI Act Art-13 transparency requirement.

---

**Category: Manage 2 -- Strategies to maximize benefits and minimize harms**

- **MANAGE 2.1** requires resources for AI risk management to be assessed along with viable
  non-AI alternatives. This is the make-or-buy-or-do-nothing analysis: is AI actually the
  right approach? Are the resources available to manage it responsibly?

- **MANAGE 2.2** requires mechanisms to sustain the value of deployed AI systems over time.
  Models drift. Training data becomes stale. User needs evolve. Sustaining value requires
  scheduled retraining or fine-tuning cycles, performance monitoring, and update procedures.

- **MANAGE 2.3** requires procedures to respond to previously unknown risks. No risk
  assessment captures every failure mode. When a novel risk surfaces in production -- a new
  attack technique, an unexpected failure mode, an emerging regulatory requirement -- there
  must be a documented procedure for responding. This is the unknown-unknowns response plan.

- **MANAGE 2.4** requires mechanisms to supersede, disengage, or deactivate AI systems that
  demonstrate performance or outcomes inconsistent with intended use, with assigned
  responsibility for making that call. This is the kill-switch requirement. The mechanism
  must be tested, not just documented. Who has authority to shut down a production AI system?
  Under what conditions? How is it done technically? EU AI Act Art-20 makes this explicit
  for high-risk AI systems.

---

**Category: Manage 3 -- Third-party AI risks and benefits**

- **MANAGE 3.1** requires third-party AI risks and benefits to be regularly monitored with
  controls applied. This is ongoing vendor management: periodic reassessment of third-party
  AI providers, tracking of model updates that may change behavior, and documented controls
  for identified third-party risks.

- **MANAGE 3.2** requires pre-trained models used in development to be monitored as part of
  regular AI system monitoring. Per OWASP LLM Top 10 alignment (LLM02, LLM03), foundation
  model updates can introduce capability changes, safety regression, or new vulnerabilities.
  Organizations should track model versions, maintain update logs, and evaluate each update
  before deploying it to production.

---

**Category: Manage 4 -- Risk treatments and communication plans**

- **MANAGE 4.1** requires post-deployment monitoring plans with user input capture mechanisms.
  This formalizes what MEASURE 2.4 begins: a documented plan for monitoring in production,
  with specific channels for users and operators to report issues.

- **MANAGE 4.2** requires measurable continual improvement activities integrated into AI
  system updates with regular stakeholder engagement. Improvement should be tracked: before/
  after metrics, change logs that tie specific improvements to identified issues, and
  stakeholder engagement records showing the improvement process is informed by real users.

- **MANAGE 4.3** requires incidents and errors to be communicated to relevant AI actors,
  including affected communities, with documented tracking, response, and recovery. This is
  the AI incident communication requirement. Per EU AI Act Art-72 and Art-83 alignment,
  serious AI incidents require specific notification procedures. The AI RMF requires this
  broadly -- not just for regulatory thresholds.

**What good looks like across MANAGE:** A documented go/no-go decision process with named
authority and historical decision records. Risk response plans for all high-priority risks
(from MANAGE 1.3) with selected strategy, implementation evidence, and residual risk
acceptance documentation. A tested kill-switch or deactivation procedure (test records
showing it actually works). Vendor monitoring records showing regular third-party AI risk
reviews. A post-deployment monitoring plan with user feedback channels and review records.
AI incident register with communication records for each incident.

---

## 6. Evidence Requirements

### Evidence Matrix

| Function | Evidence Types |
|----------|----------------|
| GOVERN | **Policy documents:** AI governance policy, AI acceptable use policy, AI risk management procedure, AI data handling policy. **Accountability records:** RACI matrix or role descriptions for AI risk management, AI governance committee charter, executive approval records for high-risk AI deployments. **Training records:** Role-based AI risk management training curriculum, completion records, refresh schedule. **Inventory:** AI system register with risk classification, resource allocation records by tier. **Operational records:** Governance committee meeting minutes, risk tolerance statement, decommissioning procedures, third-party AI vendor contracts with AI-specific clauses. |
| MAP | **Context documentation:** Use case documents per AI system covering intended purpose, deployment settings, applicable law, stakeholder norms. AI system scope definitions with explicit boundaries. **Technical characterization:** Model cards or equivalent documentation covering method type, knowledge limits, failure modes. TEVV plan or protocol. **Risk identification:** Component risk register covering third-party dependencies. Impact assessments with likelihood and magnitude ratings. Non-monetary cost analysis. **Process records:** Diverse team composition records, domain expert consultation records, stakeholder review and sign-off. |
| MEASURE | **Evaluation documentation:** TEVV test sets with data provenance, metric definitions, tool inventory. Pre-deployment test results against deployment-similar conditions. **Safety and security reports:** Safety risk evaluation reports with residual risk assessment against risk tolerance. Security and resilience assessment reports (adversarial testing, red team). **Trustworthy AI evaluation:** Fairness and bias evaluation with results by demographic group and remediation records. Privacy impact assessment. Model explainability documentation. Environmental impact assessment. **Monitoring evidence:** Production monitoring dashboards, alert configurations, monitoring review records. Independent review records. User feedback and appeal mechanism records. |
| MANAGE | **Governance records:** Go/no-go decision records with criteria and named authority. Risk prioritization methodology documentation. Risk response plans for high-priority risks with strategy rationale. Residual risk documentation and downstream disclosure records. **Operational records:** Kill-switch or deactivation procedure documentation with test evidence. Vendor monitoring records and third-party AI risk review schedule. Pre-trained model update tracking and version records. **Post-deployment records:** Post-deployment monitoring plans. AI incident register with communication records, response documentation, and recovery evidence. Continual improvement plans with before/after performance comparisons. |

### Common Evidence Artifacts

**Policies and Governance:**
- AI Governance Policy (with executive sign-off, version history, review schedule)
- AI Risk Management Procedure (process documentation, not just policy)
- AI Acceptable Use Policy
- AI-specific third-party vendor contract clauses
- AI Decommissioning Runbook

**Technical Documentation:**
- Model cards or system documentation for each AI system in scope
- AI system use case documents (one per system)
- TEVV plans with test set documentation
- Component risk registers

**Assessment and Evaluation Records:**
- Fairness and bias evaluation reports
- Privacy impact assessments (AI-specific, not generic DPIA)
- Safety risk evaluation reports
- Security and adversarial testing reports
- Environmental impact assessments (for organizations with GPAI models)

**Operational Records:**
- AI system inventory with risk classifications
- AI incident register
- Go/no-go decision records
- Risk response plans
- Kill-switch test records

### Evidence Organization

Organize evidence by AI system first, then by function. For portfolio-level AI programs with
many systems, maintain a central inventory that references system-specific evidence packages.
Key practices:

- File by AI system name and subcategory ID (e.g., `CustomerServiceBot-MAP-5.1-impact-assessment-2026-Q1.pdf`)
- Keep model cards version-controlled with dates
- Maintain incident records with communication timestamps to demonstrate external notification
  compliance
- Retain evaluation reports for at least the lifetime of the AI system plus one review cycle

---

## 7. Common Findings and Pitfalls

### Most Frequently Identified Gaps

**1. GOVERN exists on paper but not in practice (GOVERN 2.1, 2.3).**
The most common governance gap: policies are published but accountability structures are
informal or absent. Symptoms: AI risk management is treated as the security team's problem
(or nobody's problem), governance committee meetings happen but minutes are not kept, and
executive approval for high-risk AI deployments is a formality without genuine risk review.
The assessor asks: "Show me the last AI deployment that was paused or rejected due to risk
concerns." An organization with functioning governance can answer that question.

**2. MAP is done at deployment, not at design (MAP 1.1, MAP 5.1).**
Use case documents, risk assessments, and impact characterizations are produced after
deployment -- as documentation exercises, not as inputs to deployment decisions. Non-monetary
harm costs are underdocumented or absent. Diverse team composition for context-setting is
asserted but not recorded. The tell is that MAP artifacts have the same date as the
deployment date, or are dated weeks after go-live.

**3. MEASURE is limited to accuracy metrics, missing safety, fairness, privacy, and security
(MEASURE 2.6, 2.7, 2.10, 2.11).**
Most organizations evaluate whether their AI system produces correct outputs. Far fewer
evaluate whether those outputs are safe (could cause harm?), fair (differentially affecting
demographic groups?), private (exposing personal data?), or secure (resistant to adversarial
inputs?). Safety evaluations that exist are often manual and undocumented. Fairness
evaluations are absent or use proxy metrics without demographic representation. Security
testing for AI-specific attack vectors (prompt injection, adversarial inputs) is
inconsistently applied.

**4. MANAGE has incident response but no AI-specific playbooks (MANAGE 4.3, MANAGE 2.4).**
General IT incident response plans are mapped as evidence for AI incident management.
The problem: IT incident response addresses system outages, not AI-specific failure modes
like systematic hallucination causing financial harm, discriminatory output affecting a
protected class, or adversarial manipulation producing policy-violating content. AI incidents
have distinct notification requirements, distinct remediation steps, and distinct affected
communities. Separate or AI-specific playbooks are required.

**5. Kill-switch mechanisms are documented but not tested (MANAGE 2.4).**
Organizations with deactivation procedures often cannot demonstrate that those procedures
work. The deactivation mechanism may depend on infrastructure access that the named
responsible person does not have, or may require coordination between teams that have never
actually rehearsed it. Test records -- tabletop exercises at minimum, live testing where
feasible -- are required evidence.

**6. Third-party AI risks are assumed away (GOVERN 6.1, MAP 4.1, MANAGE 3.1).**
Organizations using foundation models or third-party AI APIs often have no vendor-specific
risk documentation. They assume the provider's safety measures are adequate without
assessment. Model update notifications are not tracked. IP rights for AI-generated content
are undefined. This is particularly acute for organizations using AI APIs without enterprise
agreements that include AI-specific data handling and safety clauses.

**7. Risk tolerance is generic, not AI-specific (GOVERN 1.3, MAP 1.5).**
Enterprise risk tolerance statements cover financial, operational, and reputational risk but
do not address AI-specific failure modes: acceptable hallucination rates, acceptable false
positive rates in high-stakes decisions, acceptable levels of demographic performance
disparity. Without AI-specific risk tolerance criteria, MANAGE 1.2 (risk prioritization) and
MEASURE 2.6 (safety evaluation against risk tolerance) cannot be completed meaningfully.

**8. Treating the AI RMF as a one-time exercise (MEASURE 1.2, MANAGE 4.2).**
Organizations complete an initial profile, close the major gaps, and then treat the program
as done. The AI RMF explicitly requires ongoing operations: regular review of metrics and
controls (MEASURE 1.2), regular engagement with stakeholders (MANAGE 4.2), incident tracking
and communication (MANAGE 4.3), and continual improvement. The profile is a living document,
not a one-time deliverable.

### Difficulty Areas

- **Fairness and bias evaluation** requires demographic data about users or affected
  populations that many organizations do not collect, plus statistical methodology expertise
  that most engineering teams lack. Remediation of identified bias is also technically and
  legally complex.

- **Non-monetary harm costing** (MAP 3.2) requires domain expertise in how AI errors affect
  people -- a financial services firm evaluating the cost of a wrongful loan denial needs
  input from consumer advocates and affected community representatives, not just internal
  actuaries.

- **Independent assessment** (MEASURE 1.3) means something different in different
  organizational contexts. An enterprise with a large GRC function can staff independent
  internal reviewers. A smaller organization may need external assessors.

- **Kill-switch testing** (MANAGE 2.4) requires coordination across technical, product, and
  governance teams at a level of specificity that many organizations have not achieved.

### Maturity Spectrum

| Level | Description |
|:-----:|-------------|
| 0 - None | No AI-specific governance or controls. General IT policies exist but do not address AI risks. AI systems deployed without risk assessment. |
| 1 - Initial (Tier 1) | Some AI policies drafted, inconsistently applied. MAP work done for some systems post-deployment. Evaluation limited to functional accuracy. Incident response is general IT process. |
| 2 - Developing (Tier 2) | Policies published and executed for priority systems. MAP done before deployment for new systems. Evaluation covers safety and fairness for high-risk systems. AI-specific incident playbooks in development. |
| 3 - Defined (Tier 3) | All four functions operational for all AI systems in scope. Profiles documented. MAP work is standard in the development process. MEASURE covers all trustworthy AI characteristics. Kill-switch tested. |
| 4 - Managed/Adaptive (Tier 4) | Profiles regularly reviewed and updated. Performance trends tracked across evaluation cycles. Emergent risks identified proactively. Community feedback integrated into system design. Sector-specific profiles completed. |

---

## 8. Cross-Framework Relationships

### ISO 42001 Mapping

ISO 42001 and NIST AI RMF are the two most closely aligned frameworks in the AI governance
landscape. ISO 42001 is a certifiable management system standard; the AI RMF provides the
risk management subcategories that give ISO 42001's management system clauses their
operational content.

| AI RMF Function | ISO 42001 Alignment | Integration Approach |
|----------------|--------------------|--------------------|
| GOVERN | Clauses 4-6, 9-10 | GOVERN policies satisfy ISO 42001 context, leadership, and planning clauses |
| MAP | Clauses 6.1.4, Annex A.4-5 | MAP documentation satisfies ISO 42001 risk assessment and AI system documentation |
| MEASURE | Clause 9.1, Annex A.6-7 | MEASURE evaluation satisfies ISO 42001 performance evaluation |
| MANAGE | Clauses 8, 10 | MANAGE response plans satisfy ISO 42001 operational planning and improvement |

Organizations pursuing ISO 42001 certification can use their AI RMF profiles as the primary
vehicle for evidence collection. Most ISO 42001 audit evidence also satisfies corresponding
AI RMF subcategory requirements. The practical advantage: organizations doing both frameworks
collect evidence once and satisfy two frameworks.

### EU AI Act Mapping

The EU AI Act's Article 9 risk management system for high-risk AI is structurally aligned with
NIST AI RMF MEASURE and MANAGE. The correspondences are direct enough that AI RMF-aligned
organizations have a meaningful head start on EU AI Act Article 9 compliance:

- Art-9 risk management system maps to MANAGE 1.2-1.3 (risk prioritization and response)
- Art-9 evaluation requirements map to MEASURE 2.3-2.6 (performance, safety evaluation)
- Art-13 transparency requirements map to MEASURE 2.8-2.9 (transparency risks, explainability)
- Art-14 human oversight requirements map to GOVERN 3.2 and MAP 3.5
- Art-72 post-market monitoring maps to MEASURE 2.4 and MANAGE 4.1-4.3

The key difference: the EU AI Act is mandatory and has specific conformity assessment
procedures for high-risk AI. The AI RMF is voluntary. For organizations subject to both,
use AI RMF as the operational framework and map EU AI Act articles onto it.

### MITRE ATLAS Mapping

MITRE ATLAS documents adversarial machine learning tactics, techniques, and procedures (TTPs)
targeting AI systems. The AI RMF MEASURE and MAP functions provide the governance and
assessment framework within which ATLAS knowledge applies:

- MAP 4.1-4.2 (component risk mapping) should incorporate ATLAS TTP taxonomy for the
  threat landscape analysis
- MEASURE 2.7 (security and resilience evaluation) is where ATLAS-informed adversarial
  testing occurs
- MEASURE 3.1 (risk tracking) should track emerging ATLAS TTPs as they are published

ATLAS is a threat intelligence resource, not a governance framework. Use it to populate
the "adversarial risk" category in MAP 5.1 impact assessments and to design test cases
for MEASURE 2.7 security evaluations.

### OWASP LLM Top 10 Mapping

The OWASP LLM Top 10 documents the most significant security and safety risks for large
language model applications. Per the crosswalk data, specific AI RMF subcategories align:

- MEASURE 2.7 (security and resilience) aligns with OWASP LLM05 (Insecure Output Handling)
  and LLM07 (Insecure Plugin Design)
- MEASURE 2.9 (model explanation and output interpretation) aligns with LLM04 (Model Denial
  of Service through prompt-based attacks)
- MANAGE 3.2 (pre-trained model monitoring) aligns with LLM02 (Insecure Output Handling)
  and LLM03 (Training Data Poisoning)

For organizations deploying LLM-based systems, OWASP LLM Top 10 provides the specific
threat vocabulary for MEASURE 2.7 test cases. Use the LLM Top 10 as a test case source;
use the AI RMF as the governance structure within which testing is conducted.

### Evidence Reuse Opportunities

| AI RMF Evidence | Also Satisfies |
|----------------|----------------|
| AI system use case document (MAP 1.1) | ISO 42001 Annex A.4.1, EU AI Act Art-11 technical documentation |
| Impact assessment (MAP 5.1) | ISO 42001 Clause 6.1.4, ISO 42005 Clause 6.8, EU AI Act Art-27 |
| Fairness evaluation report (MEASURE 2.11) | ISO 42001 Annex A.7.2, EU AI Act Art-10 |
| Privacy impact assessment (MEASURE 2.10) | ISO 42001 Annex A.7.4, EU AI Act Art-10, GDPR Art-35 |
| Production monitoring documentation (MEASURE 2.4) | ISO 42001 Clause 9.1, EU AI Act Art-72 |
| Kill-switch documentation (MANAGE 2.4) | EU AI Act Art-20, ISO 42001 Clause 10.1 |
| Incident communication records (MANAGE 4.3) | EU AI Act Art-72/83, ISO 42001 Clause 10.2 |

---

## 9. Path to Compliance

### High-Level Roadmap

There is no formal certification for the NIST AI RMF. Organizations self-assess, engage
third-party assessors, or complete sector-specific profiles. NIST provides the AI RMF
Playbook (https://airc.nist.gov/Docs/2) with specific suggested actions for each
subcategory, and sector-specific profiles for financial services, healthcare, and other
domains.

The standard path to an initial operational profile takes 4-8 weeks for organizations with
existing AI governance programs, and 3-6 months for organizations building from the ground up.

---

**Stage 1: Scoping and Current-State Profile (Weeks 1-3)**

Identify the AI systems in scope. Not every AI system requires the same depth of AI RMF
treatment -- start with the highest-risk systems (those making or informing decisions with
material impact on people, those handling sensitive data, or those with broad societal
reach). For each in-scope system:

- Document current state against all 72 subcategories using the assessment questions in
  questions.yaml
- Assign full/partial/none ratings for each subcategory
- Identify evidence that already exists vs. gaps
- Produce the current-state profile document

---

**Stage 2: Target Profile and Gap Analysis (Weeks 3-4)**

Define the target profile based on:
- Organizational risk tolerance (which gaps are acceptable?)
- Regulatory requirements (federal procurement, state AI law, EU AI Act applicability)
- Resource constraints (which gaps can be closed in what timeframe?)

Document the delta between current and target profile as a gap list. Prioritize gaps by:
- Impact of the gap (does it expose users to harm?)
- Ease of closure (quick wins vs. multi-month projects)
- Regulatory urgency

---

**Stage 3: Gap Closure (Months 1-4)**

Close the identified gaps in priority order. Common first-phase priorities:
- GOVERN 1.1 (regulatory register) -- typically a 2-week project
- GOVERN 2.1 (RACI matrix) -- 1-2 weeks
- MAP use case documents for all in-scope systems -- 2-4 weeks per system
- MEASURE 2.6 safety evaluation for high-risk systems -- varies by system
- MANAGE 2.4 kill-switch documentation and testing -- 2-4 weeks per system

Longer-lead items requiring early start:
- MEASURE 2.11 fairness evaluation (requires demographic data collection and methodology
  design)
- MEASURE 1.3 independent review engagement (if external, requires procurement)
- MANAGE 4.3 incident communication procedures (requires legal review and stakeholder
  mapping)

---

**Stage 4: Operational Cadence (Ongoing)**

Once the target profile is achieved:

- **Monthly:** Review production monitoring dashboards (MEASURE 2.4), review AI incident
  register (MANAGE 4.3)
- **Quarterly:** Update risk register with new or changed risks (MEASURE 3.1), review
  governance committee (GOVERN 1.5), refresh TEVV metrics assessment (MEASURE 1.2)
- **Annually:** Full profile review and update, complete MEASURE 2.7 security evaluation,
  retrain or validate AI systems with updated data, conduct vendor risk reviews (MANAGE 3.1),
  review and update all policies (GOVERN 1-6)
- **Event-triggered:** Conduct MAP work for any new AI system before deployment; update
  profiles when significant AI system changes occur; activate MANAGE 4.3 and 2.3 when
  incidents occur

---

**Sector-Specific Profiles**

NIST has released sector-specific profiles for financial services and is developing profiles
for healthcare, law enforcement, and other domains. Organizations in covered sectors should
review the sector profile as an extension of the core framework. Sector profiles typically
add subcategory-level guidance specific to the sector's regulatory environment and risk profile.

For federal agencies, the NIST AI 100-1 companion document AI 600-1 (Generative AI Profile)
provides guidance specifically for GenAI systems. This is directly applicable to organizations
deploying LLM-based systems.

---

## 10. Quick Reference Tables

### Function Summary Table

| Function | Purpose | Subcategory Count | Key Evidence |
|----------|---------|:-----------------:|-------------|
| GOVERN (GV) | Policies, accountability, culture, supply chain governance | ~30 | AI governance policy, RACI matrix, training records, AI inventory, vendor contracts |
| MAP (MP) | Context, categorization, risk identification, impact characterization | ~19 | Use case documents, model cards, impact assessments, component risk registers |
| MEASURE (MR) | Metrics, evaluation, production monitoring, risk tracking | ~14 | TEVV documentation, evaluation reports, monitoring dashboards, fairness/bias results |
| MANAGE (MG) | Response plans, kill-switch, vendor monitoring, incident communication | ~9 | Risk response plans, kill-switch test records, incident register, monitoring plans |

### High-Frequency Assessment Subcategories

The following subcategories appear most frequently in assessments and in cross-framework
mappings. They warrant priority attention in gap analysis:

| Subcategory | Function | Why It Matters |
|------------|----------|---------------|
| GOVERN 1.1 | GOVERN | Legal regulatory tracking is a prerequisite for all compliance work |
| GOVERN 2.1 | GOVERN | Without accountability, all other controls are aspirational |
| MAP 1.1 | MAP | Context documentation is the foundation for all risk identification |
| MAP 5.1 | MAP | Likelihood/magnitude assessment directly enables MANAGE 1.2 prioritization |
| MEASURE 2.4 | MEASURE | Production monitoring is required by EU AI Act and ISO 42001; commonly absent |
| MEASURE 2.6 | MEASURE | Safety evaluation against risk tolerance is the core safety assurance mechanism |
| MEASURE 2.11 | MEASURE | Fairness and bias evaluation is both a regulatory focus and a material risk |
| MANAGE 2.4 | MANAGE | Kill-switch mechanisms are required and commonly untested |
| MANAGE 4.3 | MANAGE | Incident communication records are audit trail evidence across multiple frameworks |

### Cross-Framework Mapping Summary

| Framework | Alignment Strength | Primary Touchpoints |
|-----------|:-----------------:|---------------------|
| ISO 42001 | Very High | GOVERN --> Clauses 4-6; MAP --> Clause 6.1.4/Annex A.4-5; MEASURE --> Clause 9.1/Annex A.6-7; MANAGE --> Clauses 8/10 |
| EU AI Act | High | MAP/MEASURE --> Art-9 (risk management); GOVERN 3.2/MAP 3.5 --> Art-14 (human oversight); MANAGE 2.4 --> Art-20; MANAGE 4.3 --> Art-72 |
| MITRE ATLAS | Moderate | MAP 4.1 (threat taxonomy); MEASURE 2.7 (adversarial testing); MEASURE 3.1 (emerging threat tracking) |
| OWASP LLM Top 10 | Moderate | MEASURE 2.7 --> LLM05/07; MEASURE 2.9 --> LLM04; MANAGE 3.2 --> LLM02/03 |
| NIST CSF 2.0 | High | GOVERN --> GV function; MAP --> ID function; MEASURE --> DE function; MANAGE --> RS/RC functions |
| AIUC-1 | High | GOVERN policies --> AIUC-1 E-series; MAP context --> AIUC-1 E012; MEASURE evaluation --> AIUC-1 B/C/D series |

### Glossary

| Term | Definition |
|------|-----------|
| **AI actor** | Any person or organization involved in the AI lifecycle as developer, deployer, user, or affected party |
| **AI RMF Core** | The operative part of NIST AI 100-1 (Part 2) containing GOVERN, MAP, MEASURE, and MANAGE functions |
| **Current Profile** | A snapshot of an organization's present AI risk management posture against AI RMF subcategories |
| **GOVERN** | Cross-cutting function establishing policies, accountability, culture, and resources for AI risk management |
| **MAP** | Function for establishing context and identifying AI risks before and during the AI lifecycle |
| **MANAGE** | Function for responding to, monitoring, and recovering from AI risks |
| **MEASURE** | Function for evaluating and tracking AI risks using quantitative and qualitative methods |
| **Profile** | Documentation of an organization's AI RMF implementation state (current or target) |
| **Residual risk** | Risk that remains after controls are applied; must be within organizational risk tolerance or explicitly accepted |
| **Subcategory** | A specific practice within an AI RMF category, identified by function and number (e.g., GOVERN 1.1) |
| **Target Profile** | Documentation of an organization's desired future AI RMF implementation state |
| **TEVV** | Testing, Evaluation, Verification, and Validation -- the structured evaluation process for AI systems |
| **Tier** | A level (1-4) describing the overall sophistication of an organization's AI risk management practices |
| **Trustworthy AI** | AI that demonstrates the characteristics defined in NIST AI 100-1 Part 1: accuracy, reliability, explainability, privacy, fairness, safety, security, accountability, and transparency |

---

## Sources

- [NIST AI 100-1: Artificial Intelligence Risk Management Framework](https://doi.org/10.6028/NIST.AI.100-1) -- Primary source; January 2023
- [NIST AI Resource Center (AIRC)](https://airc.nist.gov/) -- Official portal for AI RMF resources, profiles, and playbooks
- [NIST AI RMF Playbook](https://airc.nist.gov/Docs/2) -- Suggested actions and implementation guidance per subcategory
- [NIST AI 600-1: Generative AI Profile](https://doi.org/10.6028/NIST.AI.600-1) -- Companion profile for generative AI systems
- [NIST AI 100-2e2023: Adversarial Machine Learning](https://doi.org/10.6028/NIST.AI.100-2e2023) -- Reference taxonomy for security and adversarial risk assessment (MEASURE 2.7 context)
- [OMB M-24-10: Advancing Governance, Innovation, and Risk Management for Agency Use of AI](https://www.whitehouse.gov/wp-content/uploads/2024/03/M-24-10-Advancing-Governance-Innovation-and-Risk-Management-for-Agency-Use-of-Artificial-Intelligence.pdf) -- Federal AI governance requirements referencing AI RMF
- [EU AI Act (Regulation 2024/1689)](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=OJ:L_202401689) -- Mandatory EU regulation with Art-9 risk management aligned to AI RMF
- [ISO/IEC 42001:2023](https://www.iso.org/standard/81230.html) -- AI management system standard complementary to AI RMF
- [MITRE ATLAS](https://atlas.mitre.org/) -- Adversarial ML TTP taxonomy for MEASURE 2.7 threat assessment
- [OWASP Top 10 for LLM Applications](https://owasp.org/www-project-top-10-for-large-language-model-applications/) -- LLM-specific risk taxonomy for MEASURE 2.7 scope
- NIST AI RMF controls.yaml -- Internal framework control definitions (72 subcategories)
- NIST AI RMF questions.yaml -- Internal assessment questions and scoring criteria
- NIST AI RMF crosswalk nist-ai-rmf.yaml -- Internal cross-framework mapping data
