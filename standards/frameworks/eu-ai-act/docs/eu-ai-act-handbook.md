---
type: reference
name: eu-ai-act-handbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-25
framework: "EU AI Act"
framework_version: "2024/1689"
---

# EU AI Act Handbook

**Version:** 2024/1689 | **Provider:** European Union (European Parliament and Council)
**Controls:** 33 articles | **Chapters:** 7 (operative chapters I-VIII)
**Last Updated:** 2026-02-25

---

## How to Use This Handbook

This handbook is the practitioner's guide to Regulation (EU) 2024/1689 — the EU AI Act. Read it
cover-to-cover to understand what the regulation requires, how the IA assessment workflow evaluates
it, and what you need to prepare. It bridges the gap between structured assessment data
(controls.yaml, questions.yaml) and the narrative understanding needed to manage compliance
effectively.

**This handbook IS:** A narrative walkthrough of the EU AI Act, its risk tiers, article-level
requirements, and how to work through compliance as either a provider or deployer of AI systems.

**This handbook is NOT:**
- The implementation guide (per-article remediation steps for gap closure)
- The certification guide (conformity assessment logistics)
- The controls definition (structured machine-readable data in controls.yaml)
- The assessment questions (interview/evaluation questions in questions.yaml)

**Related artifacts:**
- `controls.yaml` -- Structured article definitions for all 33 controls
- `questions.yaml` -- Assessment questions with scoring criteria
- `docs/eu-ai-act-implementation-guide.md` -- Per-article gap closure steps (when created)
- `docs/eu-ai-act-certification-guide.md` -- Conformity assessment preparation (when created)

---

## 1. Framework Overview

### What the EU AI Act Is

Regulation (EU) 2024/1689 of the European Parliament and of the Council on Artificial Intelligence
is the world's first comprehensive legal framework governing artificial intelligence systems. It is
a binding EU regulation -- not a guideline, code of practice, or voluntary standard -- which means
it carries the full force of law in all 27 EU member states and applies extraterritorially to
organizations outside the EU whose AI systems affect people within it.

The Act's central organizing principle is **risk-based regulation**: the obligations imposed on an
AI system scale with the level of risk that system poses to health, safety, and fundamental rights.
An AI-powered spam filter faces minimal requirements; an AI system that scores creditworthiness or
assists with asylum decisions faces extensive mandatory controls. This tiered structure means the
first task for every organization is determining where their AI systems sit in the risk hierarchy.

The regulation distinguishes sharply between two types of actors in the AI value chain:

- **Providers** are organizations that develop, train, or place AI systems on the market under their
  own name. Providers carry the heaviest obligations: technical documentation, conformity
  assessment, quality management systems, and ongoing post-market monitoring.

- **Deployers** are organizations that use a provider's AI system in a professional context.
  Deployers are not off the hook -- they have distinct obligations including following provider
  instructions, ensuring human oversight, and in some contexts performing fundamental rights impact
  assessments before deployment.

This provider/deployer distinction matters enormously in practice. An enterprise that buys a
third-party AI hiring tool is a deployer; the vendor who built that tool is a provider. Both have
obligations. The regulation then introduces a third role category -- **importers** and
**distributors** -- who are responsible for verifying that products entering the EU market carry
proper conformity documentation.

### Current Version

- **Full name:** Regulation (EU) 2024/1689 of the European Parliament and of the Council on
  Artificial Intelligence
- **Official reference:** OJ L 2024/1689
- **Signed:** June 13, 2024
- **Published in Official Journal:** July 12, 2024
- **Published by:** European Union (European Parliament and Council)
- **Official URL:** https://artificialintelligenceact.eu/
- **Enforcement:** Phased, beginning February 2, 2025

### Why It Matters

Three realities make EU AI Act compliance non-optional for most technology organizations:

**1. Extraterritorial reach.** The Act applies to providers placing AI on the EU market, deployers
operating within the EU, and -- critically -- providers and deployers established outside the EU
when the output of their AI systems is used in the EU. A US-based company whose AI hiring tool
screens European applicants, or a Singapore-based fintech whose credit scoring model evaluates EU
customers, falls within scope. Geographic distance from Brussels provides no exemption.

**2. Penalty severity.** Violations carry financial penalties calibrated to deter even large
organizations: up to EUR 35,000,000 or 7% of total worldwide annual turnover for violations of the
Article 5 prohibited practices -- whichever is higher. That penalty tier rivals GDPR. Other
violations reach EUR 15,000,000 or 3% of worldwide turnover. Providing incorrect information to
authorities carries a separate tier of up to EUR 7,500,000 or 1.5% of turnover. These figures
apply to natural and legal persons alike.

**3. Phased enforcement is already active.** Article 5 (prohibited AI practices) has applied since
February 2, 2025. Organizations that have not audited their AI systems against the Article 5
prohibited categories are already exposed to enforcement risk. The broader Chapter III requirements
for high-risk AI systems apply from August 2, 2026 -- leaving an implementation window that is
now under 18 months.

### Target Audience

The EU AI Act applies broadly, but its operational demands fall differently depending on role:

- **AI system providers (developers, vendors):** The most burdensome obligations. Responsible for
  risk management systems, technical documentation, data governance, conformity assessment, EU
  database registration, and post-market monitoring.
- **Enterprise deployers:** Organizations deploying third-party AI in high-risk use cases. Must
  follow provider instructions, ensure human oversight, maintain logs, and conduct fundamental
  rights impact assessments in certain contexts.
- **GPAI model providers:** Foundation model companies (regardless of geography) with obligations
  that applied from August 2, 2025. Companies training models above the 10^25 FLOPs systemic risk
  threshold face additional adversarial testing and incident reporting obligations.
- **Importers and distributors:** Organizations placing EU-market AI products must verify
  provider conformity documentation before market entry.

---

## 2. Who Needs This Framework

### Industry Applicability

The EU AI Act does not target a single industry -- it applies wherever AI systems are used in
professional contexts within or affecting the EU. However, the high-risk use-case categories
defined in Annex III concentrate compliance obligations in specific sectors:

| Sector | Relevance |
|--------|-----------|
| Technology and AI development | Applies to all AI system providers regardless of end market |
| Healthcare | AI for medical diagnostics, treatment recommendations, patient triage |
| Financial services | Credit scoring, fraud detection, insurance risk assessment |
| Public sector | Benefits decisions, tax enforcement, regulatory oversight AI |
| Education | Student admission, assessment, and performance evaluation AI |
| Employment and HR | Recruitment, CV screening, promotion, work monitoring AI |
| Critical infrastructure | AI in energy, transport, water, digital infrastructure |
| Law enforcement and justice | Biometric identification, risk assessment, predictive policing tools |
| Migration and asylum | Border control, document verification, asylum status assessment |

All industries that procure third-party AI tools should assess those tools against the Annex III
list. The obligations fall on both the vendor (provider) and the enterprise customer (deployer).

### Company Size and Type Guidance

- **Large enterprises and multinationals:** The regulation assumes organizations have resources for
  quality management systems, conformity assessments, and dedicated AI governance. Large
  organizations are also more likely to operate AI systems that fall into high-risk categories
  by virtue of their breadth of deployment.
- **Mid-market organizations:** The primary deployment risk is in deployer obligations. A mid-size
  organization using AI in HR, credit decisions, or customer onboarding must comply with Article 26
  deployer requirements even if they did not build the AI system.
- **Startups and SMEs:** The regulation includes provisions acknowledging SME concerns, but there
  is no general SME exemption for high-risk AI. However, minimal-risk and limited-risk AI systems
  -- which is the category most startup products fall into -- carry little to no mandatory
  requirements beyond voluntary codes of conduct.
- **Non-EU companies:** No exemption. Any organization whose AI system output reaches EU persons
  is in scope. Non-EU providers of high-risk AI must designate an authorized EU representative
  before market entry (Article 22).

### Regulatory vs. Voluntary

The EU AI Act is **mandatory law** across all EU member states. It is not a voluntary standard,
certification scheme, or code of conduct. Non-compliance carries legal liability and financial
penalties enforced by national market surveillance authorities and the EU AI Office.

Codes of practice under Article 56 provide a compliance pathway for GPAI model providers, but
adherence to a code of practice is a means of demonstrating compliance with mandatory obligations
-- not an alternative to them.

### Common Compliance Portfolios

Organizations operating under the EU AI Act typically maintain:

- **EU AI Act + GDPR:** The Act explicitly builds on GDPR. High-risk AI systems that process
  personal data require GDPR data protection impact assessments in addition to Article 27 FRIA.
  Legal and privacy teams handling GDPR compliance are a natural first point of contact for EU AI
  Act scoping.
- **EU AI Act + ISO 42001:** ISO 42001 (AI management system standard) provides an auditable
  management framework whose controls substantially overlap with Articles 9, 17, and documentation
  requirements. ISO 42001 certification does not constitute EU AI Act conformity, but the
  documentation it generates is directly relevant to demonstrating compliance.
- **EU AI Act + NIST AI RMF:** US-headquartered organizations with EU exposure commonly align
  to NIST AI RMF internally while using the Act as their external compliance benchmark. The NIST
  MAP function maps closely to Article 9 risk management requirements.
- **EU AI Act + AIUC-1:** AIUC-1 was explicitly designed to operationalize EU AI Act articles into
  testable controls. AIUC-1 controls C001-C003 map to Article 9 risk management; D005, E001-E002
  map to Article 14 human oversight; C005-C006 map to Article 15 accuracy and robustness.

---

## 3. Framework Architecture

### Regulatory Structure

The EU AI Act is organized into eight chapters with 113 articles and multiple annexes. For
compliance purposes, five chapters carry operative requirements:

| Chapter | Subject | Key Articles | Enforcement Date |
|---------|---------|:------------:|:----------------:|
| II | Prohibited AI Practices | Art-5 | 2025-02-02 |
| III | High-Risk AI Systems | Art-6 through Art-27 | 2026-08-02 (most); 2027-08-02 (Annex I) |
| IV | Transparency Obligations | Art-50 | 2026-08-02 |
| V | General-Purpose AI Models | Art-51 through Art-56 | 2025-08-02 |
| VIII | Post-Market Monitoring and Enforcement | Art-72, Art-83, Art-99 | 2025-08-02 (Art-99); 2026-08-02 (Art-72, Art-83) |

### The Risk Tier Model

The regulation's architecture flows from a four-tier risk classification. Where a system sits in
this hierarchy determines every obligation that follows.

**Tier 1: Unacceptable Risk (Prohibited)**

Article 5 lists eight categories of AI practices that are banned outright. No conformity assessment,
no exemption process, no proportionality argument saves a system in this category. The eight
prohibited practices are:

1. Subliminal manipulation techniques that distort behavior in ways that harm a person
2. Exploitation of vulnerabilities of specific groups (age, disability) to distort behavior
3. Social scoring by public authorities for general purposes
4. Real-time remote biometric identification in publicly accessible spaces (narrow law enforcement
   exceptions apply under Article 5(1)(h))
5. Emotion recognition in workplace or educational settings
6. Biometric categorization inferring sensitive characteristics (race, political opinion, sexual
   orientation)
7. Untargeted facial recognition database scraping from the internet or CCTV
8. AI that evaluates or predicts criminal recidivism based solely on profiling

**Tier 2: High-Risk AI**

Article 6 defines high-risk AI through two pathways:

- **Article 6(1) / Annex I (applies 2027-08-02):** AI systems that are safety components of
  products already subject to EU harmonisation legislation (medical devices, machinery, aviation,
  vehicles, toys, etc.) and which must undergo third-party conformity assessment for that underlying
  product regulation.

- **Article 6(2) / Annex III (applies 2026-08-02):** AI systems in eight listed use-case areas
  regardless of product category:
  1. Biometric identification and categorisation
  2. Critical infrastructure management (energy, transport, water, digital)
  3. Education and vocational training (access, evaluation, assessment)
  4. Employment and workers management (recruitment, evaluation, monitoring)
  5. Essential private and public services (credit, insurance, public benefits)
  6. Law enforcement (individual risk assessment, evidence analysis, criminal analytics)
  7. Migration, asylum, and border control management
  8. Administration of justice and democratic processes

High-risk AI systems face the full Chapter III requirement set: risk management systems, data
governance, technical documentation, logging, transparency to deployers, human oversight, and
accuracy/robustness/cybersecurity requirements. They also require conformity assessment before
market entry and registration in the EU database.

**Tier 3: Limited Risk (Transparency Obligations)**

Article 50 creates a separate, lighter category for AI systems that interact directly with people
(chatbots), generate synthetic content (deepfakes, AI-generated text/images/audio), or deploy
emotion recognition or biometric categorization. These systems are not "high-risk" but must:

- Inform persons they are interacting with an AI system (unless obviously apparent)
- Apply machine-readable labeling to AI-generated synthetic content (C2PA or equivalent)
- Inform persons subject to emotion recognition or biometric categorization systems

**Tier 4: General-Purpose AI (GPAI) Models**

Chapter V creates a separate obligation track for foundation model providers. Any organization
providing a GPAI model for integration into downstream products must comply with Article 53
baseline obligations (applicable since August 2, 2025). Models above the 10^25 FLOPs systemic
risk threshold face additional obligations under Article 55: adversarial testing, systemic risk
assessment and mitigation, serious incident reporting to the AI Office within two weeks, and
cybersecurity protection requirements.

**Tier 5: Minimal Risk**

Everything not captured by the above tiers -- including most AI features in consumer products,
spam filters, AI-enabled video games, and basic recommendation systems -- carries no mandatory
requirements. Organizations may voluntarily adhere to codes of conduct, but there is no legal
obligation.

### Control Families by Chapter

| Chapter | Coverage | Key Articles |
|---------|----------|:------------:|
| Chapter II | Prohibited practices | Art-5 |
| Chapter III, Section 1 | High-risk classification | Art-6, Art-7 |
| Chapter III, Section 2 | Technical requirements for high-risk AI | Art-8 through Art-15 |
| Chapter III, Section 3 | Provider and deployer obligations | Art-16 through Art-27 |
| Chapter IV | Transparency obligations | Art-50 |
| Chapter V | GPAI model obligations | Art-51 through Art-56 |
| Chapter VIII | Post-market monitoring and enforcement | Art-72, Art-83, Art-99 |

### Conformity Assessment Pathways

High-risk AI systems require conformity assessment before market placement. The pathway depends
on the classification tier:

- **Annex III systems (most high-risk AI):** Self-assessment by the provider against the
  Article 9-15 requirements, followed by an EU declaration of conformity and CE marking.
  No third-party notified body is required for most Annex III systems.
- **Annex I systems (AI in regulated products):** Conformity assessment follows the rules of the
  underlying sector regulation (medical devices, machinery, etc.), which typically requires a
  notified body. The AI Act layers on top of existing CE marking requirements.
- **Substantial modification:** If a deployed system undergoes substantial modification, the
  conformity assessment must be repeated. Deployers who make substantial modifications become
  providers for the modified system under Article 25.

---

## 4. Assessment Workflow Mapping

### How IA Assessment Maps to the Act

The IA assessment for the EU AI Act follows the chapter sequence of the regulation itself, moving
from prohibited practices through high-risk requirements to transparency and GPAI obligations.

| Assessment Phase | Articles Covered | Primary Focus |
|-----------------|:----------------:|---------------|
| Scoping and Classification | Art-6, Art-7 | Determine which risk tier each AI system occupies |
| Prohibited Practices Audit | Art-5 | Confirm no deployed systems fall into banned categories |
| High-Risk Requirements | Art-8 through Art-15 | Evaluate technical and documentation compliance |
| Provider Obligations | Art-16 through Art-25 | QMS, conformity assessment, registration, corrective action |
| Deployer Obligations | Art-26, Art-27 | Oversight procedures, FRIA requirement |
| Transparency Review | Art-50 | Chatbot disclosure, synthetic content labeling |
| GPAI Assessment | Art-51 through Art-56 | Model documentation, copyright, systemic risk threshold |
| Post-Market Monitoring | Art-72, Art-83 | Ongoing monitoring plan, authority cooperation |

### Multi-Agent Routing

The IA Framework assigns EU AI Act assessment responsibilities across specialized agents:

| Agent | EU AI Act Responsibilities |
|-------|--------------------------|
| **Advisor** | Governance and classification phases: prohibited practices audit (Art-5), classification decisions (Art-6), deployer obligation review (Art-26, Art-27), compliance programme ownership (Art-16, Art-99). Conducts stakeholder interviews, reviews governance documentation, evaluates organizational readiness. |
| **Security** | Technical control evaluation: accuracy and robustness testing (Art-15), adversarial evaluation for GPAI systemic risk models (Art-55), logging and monitoring capability assessment (Art-12, Art-19, Art-72). |
| **Legal** | Extraterritorial scope analysis, authorized representative obligations (Art-22, Art-54), FRIA review (Art-27), penalty exposure mapping (Art-99), regulatory monitoring process (Art-7). |
| **Engineer** | Remediation: implements technical documentation pipelines, logging infrastructure, human oversight mechanisms, post-market monitoring systems. Engaged after gaps are identified. |

### Phase Dependencies

1. **Classification before requirements assessment:** Organizations cannot assess Article 9-15
   compliance until they know which systems are high-risk. Classification must precede all
   high-risk requirement evaluation.
2. **Art-5 before all other work:** The prohibited practices audit is the highest-priority task
   because Article 5 has been in force since February 2, 2025. Any gap here is an active legal
   exposure, not a future one.
3. **Provider before deployer assessment:** The provider/deployer determination shapes the entire
   obligation set. Organizations that both build and deploy AI (common in enterprises with internal
   AI systems) must assess each role separately.
4. **GPAI assessment runs in parallel:** Article 51-56 obligations apply to a different actor
   category (model providers) and can be assessed independently of high-risk AI requirements.

---

## 5. Control Family Walkthroughs

### Chapter II: Prohibited AI Practices (Article 5)

**Purpose:** Eliminate AI practices that pose unacceptable risk to fundamental rights and human
dignity, effective from February 2, 2025.

**Controls covered:** Art-5 (single article, eight prohibited practice categories)

Article 5 is the regulation's hard line. The eight prohibited practices are banned without
exception or proportionality balancing (with one narrow law enforcement exception for real-time
biometric ID). No business justification, no technical limitation, no phased compliance timeline
applies. If an organization is operating a system that falls into one of these categories, it must
be discontinued immediately.

The audit process for Article 5 requires more than a quick legal review. Several prohibited
categories are defined in ways that can catch practitioners off guard:

**Emotion recognition in workplace and educational settings** is a complete prohibition in those
specific contexts. A facial expression analysis tool used in a retail customer service environment
is probably not covered; the same tool deployed in an office to monitor employee engagement is
prohibited. The context -- not the technology -- determines compliance status.

**Social scoring** is prohibited when conducted by public authorities, but the definition
encompasses "general purpose" scoring: a government agency running an AI system that aggregates
citizen behavior data across domains to affect access to services falls squarely within this
prohibition. Private-sector credit scoring is not covered by this specific prohibition (though it
may be high-risk AI under Annex III).

**Biometric categorization inferring sensitive characteristics** prohibits AI systems that sort
people into groups based on inferred race, political opinions, trade union membership, religious
beliefs, sexual orientation, or health status. This does not prohibit biometric authentication (the
user presents a credential), but it does prohibit systems that analyze biometric data to make
inferences about sensitive personal characteristics.

**Real-time remote biometric ID in public spaces** has the most complex carve-out. Law
enforcement agencies may use it in three circumstances: searching for missing persons, preventing
specific imminent terrorist threats, and identifying persons suspected of serious crimes. Each use
requires prior authorization from a judicial or independent administrative authority. Private
organizations have no access to this exception.

**Key controls explained:**

- **Art-5 (complete prohibition):** The control is binary -- either the practice is in use (non-
  compliant) or it is not. The assessment task is to inventory all AI systems and document a
  reasoned legal assessment of each system against all eight categories.

**What good looks like:** A complete AI system inventory with documented Article 5 assessment for
each system, written legal or compliance sign-off confirming non-prohibited status, and a
monitoring process that evaluates new AI procurements against Article 5 before deployment. For
organizations near borderline cases (e.g., emotion-adjacent behavioral analysis tools), external
legal review is appropriate.

**Common gaps:** Treating Article 5 as already-read when key use cases have not been
systematically assessed. Assuming that because a system was not built with prohibited intent, it
cannot fall into a prohibited category. Failing to assess emotion recognition tools deployed in
employee productivity monitoring contexts.

---

### Chapter III, Section 1: Classification of High-Risk AI Systems (Articles 6-7)

**Purpose:** Provide a deterministic process for classifying AI systems into the high-risk
category, triggering the full Chapter III requirement set.

**Controls covered:** Art-6 (classification rules), Art-7 (delegated act amendment process)

Classification under Article 6 is a threshold decision that determines everything that follows.
Organizations should treat this as a formal, documented process rather than an informal judgment.
Article 6 works through two independent pathways:

**Article 6(1) pathway (Annex I products):** Does the AI system function as a safety component of
a product already subject to Union harmonisation legislation listed in Annex I? Annex I covers
machinery, toys, watercraft, lifts, explosive environments equipment, radio equipment, pressure
equipment, cableways, personal protective equipment, gas appliances, medical devices, in vitro
diagnostic medical devices, and civil aviation equipment. If the AI system is a safety component
of one of these product categories AND that product already requires third-party conformity
assessment under the sector regulation, then the AI system is high-risk under Article 6(1).
This pathway does not apply until August 2, 2027.

**Article 6(2) pathway (Annex III use cases):** Does the AI system fall within one of the eight
use-case areas listed in Annex III? This is the more common pathway for most organizations.
The key is intended purpose: a general-purpose chatbot is minimal risk; the same underlying
model deployed specifically for evaluating job candidates is high-risk employment AI under Annex
III point 4.

Article 7 gives the Commission power to update Annex III by delegated act as AI technology
evolves. Organizations with borderline classification decisions should monitor official Journal
publications for delegated act updates, as a system classified as minimal risk today could become
high-risk through an Annex III amendment.

**What good looks like:** A classification register listing all AI systems in use (and planned),
the Article 6 assessment for each, the Annex I product category assessment, the Annex III use-case
area assessment, documented rationale for the classification decision, and a named owner
responsible for monitoring Article 7 delegated act updates. Classification decisions for borderline
cases should carry external legal review sign-off.

**Common gaps:** Assessing the AI model rather than the AI system's intended purpose. An LLM is
not high-risk; an LLM deployed to screen employee performance reviews for termination decisions is.
The classification must account for intended deployment context, not underlying technology.

---

### Chapter III, Section 2: Requirements for High-Risk AI Systems (Articles 8-15)

**Purpose:** Define the technical and operational requirements that high-risk AI systems must meet
before placement on the market and throughout their operational lifetime.

**Controls covered:** Art-8 (general compliance obligation), Art-9 (risk management system),
Art-10 (data governance), Art-11 (technical documentation), Art-12 (record-keeping), Art-13
(transparency to deployers), Art-14 (human oversight), Art-15 (accuracy, robustness,
cybersecurity)

This section contains the most substantive compliance requirements in the regulation. Each article
addresses a specific aspect of responsible AI system design and operation. Article 8 establishes
the general obligation -- all high-risk AI systems must comply with Articles 9-15 -- and the
remaining articles specify what compliance means in practice.

**Article 9 -- Risk Management System**

Article 9(1) requires providers to establish and document a risk management system that runs as
a continuous iterative process throughout the entire lifecycle of the high-risk AI system. This is
not a one-time pre-deployment risk assessment; it must continue through operational deployment,
updates, and end-of-life.

The risk management system must:
- Identify and analyze known and reasonably foreseeable risks for the intended purpose
- Estimate and evaluate risks from intended use and reasonably foreseeable misuse
- Evaluate risks emerging from post-market monitoring data
- Take proportionate risk management measures addressing identified risks

Risk management measures must be documented and must consider the generally acknowledged state of
the art. For organizations familiar with ISO 42001, the Article 9 risk management system aligns
closely with ISO 42001 Clause 6.1 (risk management) and ISO 42005 impact assessment processes.
For NIST AI RMF users, the MAP and MANAGE functions provide the closest analog.

The residual risk after applying risk management measures must be judged acceptable. Article 9
does not specify what "acceptable" means -- organizations must document their own risk acceptance
rationale.

**Article 10 -- Data and Data Governance**

Article 10(1) requires that training, validation, and testing datasets be subject to appropriate
data governance and management practices. The specific requirements are:

- Data must be relevant and sufficiently representative for the intended purpose
- Data must be free of errors and complete to the greatest extent possible
- Datasets must have appropriate statistical properties for the intended use
- Biases must be identified, assessed, and mitigated where possible

Article 10(3) adds a specific provision: providers may process special categories of personal data
(health, racial, political) to the extent strictly necessary for bias detection and correction,
provided robust security measures are applied. This is an important carve-out for organizations
building fairness-aware AI systems.

Data governance documentation under Article 10 becomes one of the most operationally challenging
requirements. Organizations must be able to demonstrate that their training data was reviewed
for representativeness and bias -- not just that it was collected and used.

**Article 11 -- Technical Documentation**

Article 11 requires providers to prepare technical documentation before placing a high-risk AI
system on the market or putting it into service. The documentation must be drawn up in accordance
with Annex IV, which specifies a detailed structure covering:

- General description of the AI system and its intended purpose
- Description of the development process (design, development, testing methods used)
- Information on monitoring, functioning, and control of the system
- Description of the risk management system under Article 9
- Details of post-market monitoring under Article 72
- Technical specifications and human oversight measures

Technical documentation must be kept up to date throughout the system's lifetime. A document
prepared at launch that reflects the system as it existed at launch -- and is never updated to
reflect subsequent model updates, retraining, or configuration changes -- does not satisfy
Article 11.

The 10-year retention requirement (Article 18) applies to technical documentation and the EU
declaration of conformity. Organizations must implement document retention systems capable of
preserving this documentation reliably over a decade.

**Article 12 -- Record-Keeping (Logging)**

Article 12 requires high-risk AI systems to technically allow for automatic logging of events over
their operational lifetime. The logging capability must enable traceability appropriate to the
system's intended purpose and, at minimum, must enable identification of:

- Situations that may present a risk
- Substantial modifications to the system
- The period of each use of the system

Article 19 further specifies that providers must retain automatically generated logs for a minimum
of six months, unless other law requires longer retention. Deployers must also retain logs under
their control (Article 26(1)(f)).

Logging is not optional infrastructure -- it is a mandatory technical feature that must be designed
into the system. Systems that cannot generate structured logs of their operation do not comply with
Article 12.

**Article 13 -- Transparency and Information to Deployers**

Article 13 requires high-risk AI systems to be designed with sufficient transparency that deployers
can interpret outputs and use the system appropriately. The provider must supply instructions for
use that cover:

- Identity and contact details of the provider
- System characteristics, capabilities, and limitations
- Performance metrics for the intended purpose
- Known or foreseeable circumstances that may affect accuracy
- Input data specifications and required computational resources
- Human oversight measures and technical means to enable them
- Expected operational lifetime and necessary maintenance

This creates a practical obligation: providers must produce and maintain documentation that
genuinely enables deployers to comply with their own Article 26 obligations. Generic terms-of-
service language that describes the AI as a "helpful assistant" does not constitute instructions
for use under Article 13.

**Article 14 -- Human Oversight**

Article 14(1) requires high-risk AI systems to be designed so that natural persons can effectively
oversee them during operation. The oversight design must enable persons assigned to oversee the
system to:

- Fully understand the system's capabilities and limitations
- Monitor system operation and detect anomalies and dysfunctions
- Disregard, override, or reverse the system's output
- Intervene or interrupt system operation through a halt function

Article 14(4) addresses automation bias -- the tendency for humans to over-rely on automated
recommendations. The system design must ensure that persons carrying out human oversight are
aware of this risk and have practical means to exercise meaningful (not merely nominal) oversight.

Human oversight that exists on paper but is not operationally feasible -- for example, an
"override" button on a system that generates hundreds of decisions per hour without providing
human reviewers adequate time or information to evaluate them -- does not satisfy Article 14.

**Article 15 -- Accuracy, Robustness, and Cybersecurity**

Article 15 requires high-risk AI systems to achieve appropriate levels of accuracy, robustness,
and cybersecurity throughout their operational lifecycle. Specifically:

- **Accuracy:** Systems must achieve benchmarked accuracy metrics for their intended purpose.
  Metrics and benchmarks must be declared in the technical documentation.
- **Robustness:** Systems must be robust against errors, faults, inconsistencies, and adversarial
  inputs. Technical redundancy solutions and fallback plans must be implemented.
- **Cybersecurity:** Systems must be resilient to attempts to exploit vulnerabilities, alter
  outputs, or manipulate data. Systems processing personal data must be resilient to attempts to
  alter the use of that data.

Article 15(3) notes that where AI systems process personal data, the cybersecurity requirements
take into account the specific risks posed by adversarial attacks aimed at manipulating personal
data used in AI operations.

**What good looks like across Section 2:**

- A written risk management plan per system, with lifecycle scheduling and documented risk
  acceptance criteria
- Data governance records covering all training/validation/testing datasets with bias assessment
  results
- Annex IV technical documentation completed and version-controlled before market entry
- Logging infrastructure built into the system with six-month retention minimum
- Instructions for use delivered to deployers at system delivery covering all Article 13 elements
- Human oversight design documented, trained overseer personnel designated, override mechanisms
  tested
- Accuracy benchmarks declared and tested; adversarial robustness assessment completed

**Common gaps:**

- Risk management as a point-in-time exercise rather than a continuous lifecycle process
- Technical documentation completed post-deployment rather than pre-market
- Logging implemented at the application level but not capturing AI-specific events (prompts,
  model decisions, confidence scores)
- Instructions for use that describe product features without meeting Article 13's specific
  informational requirements
- Human oversight that is nominal rather than operationally effective
- Accuracy benchmarks defined but adversarial robustness never tested

---

### Chapter III, Section 3: Obligations of Providers and Deployers (Articles 16-27)

**Purpose:** Establish the full set of organizational and procedural obligations for providers,
deployers, importers, and distributors of high-risk AI systems.

**Controls covered:** Art-16 (provider obligations overview), Art-17 (quality management system),
Art-18 (documentation retention), Art-19 (log retention), Art-20 (corrective actions and
notification), Art-21 (cooperation with authorities), Art-22 (authorized representatives for
non-EU providers), Art-23 (importer obligations), Art-24 (distributor obligations), Art-25
(value chain responsibility), Art-26 (deployer obligations), Art-27 (fundamental rights impact
assessment)

**Provider Obligations (Articles 16-22)**

Article 16 is a consolidated checklist of all provider obligations, referencing the specific
articles where each requirement is detailed. Providers must:

1. Ensure compliance with the Article 9-15 technical requirements
2. Establish a quality management system (Article 17)
3. Keep technical documentation (Article 18, 10-year retention)
4. Retain automatically generated logs (Article 19, minimum 6 months)
5. Complete the conformity assessment before market placement (Article 43)
6. Draw up the EU declaration of conformity (Article 47)
7. Affix CE marking (Article 48)
8. Register the system in the EU database (Article 49)
9. Take corrective actions and notify authorities when the system is found non-conforming (Article 20)
10. Cooperate with national competent authorities and the AI Office (Article 21)

Article 17 requires a formal **quality management system** documented in written policies,
procedures, and instructions. The QMS must cover: regulatory compliance strategy, design and
design control techniques, examination and testing procedures, and defined roles and
responsibilities. For organizations already maintaining ISO 9001 or ISO 42001 quality management
systems, Article 17 compliance is substantially achievable through gap analysis against the Act's
specific AI requirements.

Non-EU providers placing high-risk AI systems on the EU market must designate an **authorized
representative** established in the Union (Article 22) before market entry. The representative
must be designated by written mandate, must have authority to cooperate with competent authorities
on behalf of the provider, and must be named in the technical documentation. This is not a passive
legal registration -- the representative must be able to perform the functions specified in the
mandate, including responding to authority requests for technical documentation.

**Deployer Obligations (Articles 26-27)**

Article 26 establishes that deployers -- organizations using high-risk AI systems in a professional
context -- carry their own direct obligations. These cannot be transferred to the provider:

1. Use systems in accordance with provider instructions for use
2. Ensure competent persons are assigned to human oversight
3. Monitor AI system operation and inform providers of serious incidents
4. Ensure input data is relevant and sufficiently representative for the intended purpose
5. Keep logs under their control for the periods required by applicable law
6. Perform data protection impact assessments under GDPR where required
7. Perform fundamental rights impact assessments (Article 27) before deployment in covered contexts

The **Fundamental Rights Impact Assessment (FRIA)** under Article 27 is required before deploying
high-risk AI systems in public authority, critical infrastructure, education, employment, essential
services, or law enforcement contexts. The FRIA must assess the impact on fundamental rights
(dignity, privacy, non-discrimination, freedom of expression) and must be notified to the market
surveillance authority before deployment commences. The AI Office is developing a standard FRIA
template questionnaire.

**Value Chain Responsibility (Article 25)**

Article 25 contains a provision that catches many organizations off guard: any distributor,
importer, deployer, or other third party becomes a **provider** with all provider obligations when
they:

1. Place a high-risk AI system on the market under their own name or trademark
2. Make a substantial modification to a high-risk AI system
3. Change the intended purpose of a non-high-risk AI system such that it becomes high-risk

This means an enterprise that takes a third-party AI tool, rebrands it as their own product, and
sells it to customers has become a provider with the full Art-16 obligation set -- even if they
did not build the underlying model. Legal and procurement teams reviewing AI product licensing
agreements need to understand this provision.

**What good looks like:**

- Written QMS documentation covering all Article 17 elements, reviewed annually
- Document retention system configured for 10-year retention of technical documentation and
  declarations of conformity
- Log retention policy specifying at least 6-month retention for AI system logs
- Corrective action procedure with notification templates for competent authorities and deployers
- Named contact for authority cooperation requests with documented escalation path
- For non-EU providers: written authorized representative mandate before market entry
- For deployers: deployment procedures incorporating provider instructions, trained oversight
  personnel, and an incident reporting process to the provider
- FRIA completed and notified to market surveillance authority for all applicable deployments

**Common gaps:**

- QMS exists on paper but does not cover AI-specific requirements (no AI design control process,
  no AI-specific testing procedures)
- Non-EU companies unaware of the authorized representative requirement operating in EU markets
- Deployers treating provider instructions as optional guidance rather than mandatory operating
  procedures
- FRIA not performed prior to deployment in covered contexts (or performed but not notified to
  authority)
- No distinction between provider and deployer obligations when both roles apply to the same
  organization's different activities

---

### Chapter IV: Transparency Obligations (Article 50)

**Purpose:** Require disclosure of AI interaction and AI-generated content to protect persons from
undisclosed AI manipulation.

**Controls covered:** Art-50 (transparency obligations)

Article 50 operates independently from the high-risk AI requirement set. A system does not need to
be high-risk to trigger Article 50 -- the transparency obligations apply to any provider or
deployer operating in the covered categories:

**Category 1: AI systems interacting with persons directly (e.g., chatbots)**
Providers must ensure the AI system informs persons they are interacting with an AI unless the
context makes this "obvious." The disclosure must be clear and timely -- before the interaction
begins or at its start. What qualifies as "obvious" is a judgment call, but any conversational AI
deployed in a customer service context should default to explicit disclosure.

**Category 2: AI generating synthetic content (deepfakes, AI-generated images/audio/video/text)**
AI systems that generate or manipulate audio, image, video, or text content must mark outputs as
AI-generated in machine-readable format. Technical standards like C2PA (Coalition for Content
Provenance and Authenticity) provide one implementation pathway. The exception covers legitimate
uses where the AI nature is obvious (satire, clearly artistic contexts) or for law enforcement.

**Category 3: Emotion recognition and biometric categorization**
Deployers using emotion recognition systems or biometric categorization systems must inform
natural persons that they are subject to these systems. Note that emotion recognition in workplace
and educational settings is prohibited under Article 5 -- so for covered deployers, this
disclosure obligation applies in other contexts (retail, customer service, public events).

Article 50 compliance is primarily a design and UX concern for providers, and an operational
policy concern for deployers. The disclosure mechanism must be technically implemented in the
product, not just described in a terms of service document that users do not see before interacting
with the AI.

**What good looks like:** A disclosure notice presented to users at the start of any AI chatbot
interaction; machine-readable watermarking or C2PA metadata applied to all AI-generated synthetic
content; documented inventory of emotion recognition and biometric categorization deployments with
notification mechanism in place for each.

**Common gaps:** Disclosure buried in terms of service rather than presented in-context; synthetic
content labeling implemented as human-readable text only (not machine-readable); no inventory of
emotion recognition or biometric categorization deployments to assess disclosure coverage.

---

### Chapter V: General-Purpose AI Models (Articles 51-56)

**Purpose:** Establish a distinct obligation track for providers of foundation models, scaled by
systemic risk level, applicable since August 2, 2025.

**Controls covered:** Art-51 (systemic risk classification), Art-52 (notification procedure),
Art-53 (baseline GPAI obligations), Art-54 (authorized representatives for non-EU GPAI providers),
Art-55 (systemic risk model obligations), Art-56 (codes of practice)

The GPAI chapter applies a different logic than the rest of the regulation. Rather than classifying
by intended use (high-risk use case), it classifies by model capability and training scale.

**Article 53: Baseline obligations for all GPAI providers**

All GPAI model providers -- regardless of model size -- must:

1. Draw up and maintain technical documentation per Annex XI
2. Provide information and documentation to downstream providers integrating the model
3. Maintain a copyright compliance policy (including an Article 4(3) text and data mining
   opt-out mechanism)
4. Publish a publicly available summary of the content used for training

Providers making GPAI models available as open source are exempt from the Annex XI documentation
and downstream information-sharing requirements -- but only if the model does not have systemic
risk. Open-source systemic risk models face the full Article 55 obligation set.

**Article 51: Systemic Risk Classification**

A GPAI model has systemic risk when it has high-impact capabilities as measured by benchmarks and
technical tools, or when the Commission determines equivalent impact by other means. The threshold
presumption in Article 51 is training compute exceeding **10^25 floating point operations (FLOPs)**.

Providers whose models meet or may meet this threshold must notify the AI Office within two weeks
of that determination under Article 52. The Commission may also designate models as having
systemic risk on criteria other than compute thresholds.

**Article 55: Additional obligations for systemic risk GPAI models**

Providers of systemic risk models face requirements that parallel the adversarial testing
obligations for high-risk AI systems, scaled to model-level systemic risks:

1. Perform model evaluations using standardized protocols including adversarial testing
2. Assess and mitigate systemic risks -- including risks of accidents, large-scale misuse, and
   negative societal impacts
3. Report serious incidents to the AI Office within two weeks of becoming aware of them
4. Ensure adequate cybersecurity protection for the model, infrastructure, and physical environment

Compliance with an approved code of practice (Article 56) creates a presumption of conformity
with Article 55 obligations. The AI Office is facilitating the development of these codes.

**What good looks like for GPAI providers:**

- Training compute calculation documented with methodology and FLOPs estimate
- Annex XI technical documentation completed and maintained
- Copyright compliance policy published and opt-out mechanism implemented
- Training data content summary published (even if not disclosing proprietary details)
- For systemic risk models: adversarial evaluation reports, systemic risk assessment, serious
  incident reporting process with AI Office notification capability, cybersecurity assessment

**Common gaps:**

- GPAI providers unaware that Article 53 obligations applied since August 2, 2025 (not August 2026)
- Training data content summaries not published (or too vague to meet the meaningful summary
  standard the AI Office is developing)
- Copyright compliance policy treats the opt-out mechanism as optional rather than required
- Non-EU GPAI providers operating in the EU without designated authorized representatives
- Systemic risk determination not formally documented (relying on informal judgments that the
  model is "not that large")

---

### Chapter VIII: Post-Market Monitoring and Enforcement (Articles 72, 83, 99)

**Purpose:** Require ongoing monitoring of deployed high-risk AI systems and establish the
enforcement and penalty framework.

**Controls covered:** Art-72 (post-market monitoring), Art-83 (formal non-compliance), Art-99
(penalties)

**Article 72 -- Post-Market Monitoring**

Article 72 requires providers of high-risk AI systems to establish and document a post-market
monitoring system that actively collects, documents, and analyzes relevant data throughout the
system's operational lifetime. This is distinct from the pre-deployment risk management system
under Article 9 -- it is the operational feedback loop that informs ongoing compliance.

The post-market monitoring system must:
- Actively collect data on system performance in deployment
- Systematically identify issues and apply corrective actions when needed
- Feed into the Article 9 risk management system
- Include a monitoring plan as part of the technical documentation (Article 11)

Serious incidents discovered through post-market monitoring must be reported under Article 73 to
market surveillance authorities. Providers must have an incident reporting capability and a defined
serious incident threshold.

**Article 83 -- Formal Non-Compliance**

Even where a system technically complies with all Articles 9-15 requirements, market surveillance
authorities can require operators to take corrective action if the system presents a risk to
health, safety, or fundamental rights. This "formal non-compliance" provision gives authorities
flexible enforcement power beyond strict technical conformity.

Organizations must have a response procedure for formal non-compliance findings that covers:
- Risk elimination measures
- System withdrawal from the market
- Product recall procedures
- Defined response timeframes
- Authority notification and cooperation protocols

**Article 99 -- Penalties**

The penalty structure creates a direct compliance priority hierarchy:

| Violation Category | Maximum Penalty |
|-------------------|:---------------:|
| Article 5 prohibited practices | EUR 35,000,000 or 7% of worldwide annual turnover (whichever higher) |
| Other violations (including Art-50 transparency) | EUR 15,000,000 or 3% of worldwide annual turnover |
| Supplying incorrect or misleading information | EUR 7,500,000 or 1.5% of worldwide annual turnover |

Note that Article 99 itself applies from August 2, 2025 -- the penalties for violations of Article
5 (which has applied since February 2025) are already enforceable.

**What good looks like:**

- Post-market monitoring plan documented as part of technical documentation before market entry
- Data collection procedures covering operational performance metrics relevant to intended purpose
- Serious incident reporting threshold defined and notification workflow documented
- Formal non-compliance response procedure with timeframes and authority contact paths
- Penalty exposure awareness documented in compliance programme with prioritized remediation plan

---

## 6. Evidence Requirements

### Evidence Matrix

| Article Area | Evidence Types |
|-------------|----------------|
| **Art-5 Prohibited Practices** | AI system inventory with Article 5 assessment for each system; written legal or compliance sign-off on non-prohibited status; monitoring process documentation for new AI procurements |
| **Art-6 Classification** | Classification register for all AI systems; Annex I product category assessment; Annex III use-case area assessment with documented rationale; legal review sign-off for borderline cases; delegated act monitoring process documentation |
| **Art-9 Risk Management** | Risk management system documentation (iterative process, lifecycle coverage); risk register identifying known and foreseeable risks; residual risk acceptance decisions; evidence of system updates based on operational experience |
| **Art-10 Data Governance** | Data governance procedures for training/validation/testing datasets; dataset representativeness and completeness assessment records; bias identification and mitigation records; data quality metrics |
| **Art-11 Technical Documentation** | Annex IV technical documentation per high-risk AI system, version-controlled with update process; documentation showing system as-built (not as-planned) |
| **Art-12 and Art-19 Logging** | Technical specification of logging capability; log retention policy (minimum 6 months for providers); evidence that logs capture Art-12 traceability events |
| **Art-13 Transparency to Deployers** | Instructions for use covering all Article 13 required elements; evidence instructions are provided to deployers at system delivery |
| **Art-14 Human Oversight** | Human oversight design documentation; trained oversight personnel records; override and intervention capability testing evidence; automation bias awareness measures |
| **Art-15 Accuracy/Robustness/Cybersecurity** | Accuracy benchmarks and test results; robustness testing records including edge cases; adversarial testing results; fallback plan documentation |
| **Art-16/Art-17 QMS** | Quality management system documentation covering all Article 17 elements; written policies, procedures, and roles |
| **Art-18 Documentation Retention** | Document retention policy specifying 10-year retention; evidence of retention controls |
| **Art-20 Corrective Action** | Corrective action procedure; notification templates for authorities and deployers; incident response capability covering withdrawal and recall |
| **Art-22/Art-54 Authorized Representatives** | Written mandate naming EU authorized representative; contact details and responsibilities documented |
| **Art-26 Deployer Obligations** | Deployment procedures referencing provider instructions; human oversight assignment and training records; monitoring logs; incident reporting process to providers |
| **Art-27 FRIA** | FRIA documentation for each applicable deployment; notification to market surveillance authority; fundamental rights impact analysis |
| **Art-50 Transparency** | Disclosure mechanism documentation (text, UX design); evidence disclosure is presented before or at start of interaction; machine-readable synthetic content labeling implementation |
| **Art-51-56 GPAI** | Training compute calculation methodology; Annex XI technical documentation; copyright compliance policy; training data content summary; for systemic risk: adversarial evaluation reports, systemic risk assessment, incident reporting procedure |
| **Art-72 Post-Market Monitoring** | Post-market monitoring system documentation; data collection and analysis procedures; serious incident reporting procedure; monitoring plan in technical documentation |

### Common Evidence Artifacts

**Governance and Policy Documents:**
- AI system inventory and classification register
- Risk management system documentation (Art-9)
- Quality management system documentation (Art-17)
- Post-market monitoring plan (Art-72)
- Corrective action and notification procedures (Art-20)
- AI acceptable use policy covering prohibited practices (Art-5)

**Technical Documentation:**
- Annex IV technical documentation per high-risk AI system (Art-11)
- Annex XI technical documentation for GPAI models (Art-53)
- Instructions for use for deployers (Art-13)
- Human oversight design documentation (Art-14)
- Accuracy benchmarks and test results (Art-15)

**Assessment and Audit Records:**
- Article 5 prohibited practices assessment (per system)
- Article 6 classification assessment (per system)
- Data governance and bias assessment records (Art-10)
- Adversarial testing results for high-risk systems (Art-15) and systemic risk GPAI models (Art-55)
- Fundamental Rights Impact Assessment documentation (Art-27)

**Compliance Infrastructure:**
- EU authorized representative mandate (Art-22, Art-54)
- EU database registration records (Art-49)
- EU declaration of conformity (Art-47)
- CE marking evidence (Art-48)
- Log retention configuration showing minimum 6-month retention (Art-19)

**Legal and Regulatory Records:**
- Legal sign-off on Article 5 prohibited practice assessments
- External legal review records for borderline classification decisions
- Penalty exposure analysis and compliance programme documentation (Art-99)
- Regulatory monitoring process for Article 7 delegated act updates

### Evidence Organization

Organize evidence by article and system. Recommended naming convention:
`[System-ID]-[Article]-[Evidence-Type]-[Version or Date]`

Example: `HiringAI-Art9-RiskManagementPlan-v2.pdf`

Key retention requirements:
- Technical documentation and declarations of conformity: 10 years (Article 18)
- Automatically generated logs: minimum 6 months (Article 19)
- FRIA documentation: retain for audit access at all times (no minimum specified, practical
  minimum aligns with deployment period plus regulatory inquiry window)

---

## 7. Common Findings and Pitfalls

### Most Frequently Identified Gaps

**1. Treating Article 5 as already satisfied without formal assessment.**
The most common pre-assessment assumption is that prohibited practices are obviously not occurring
and no formal review is needed. In practice, several Article 5 categories -- emotion recognition
in workplace settings, biometric categorization inferring sensitive characteristics, and social
scoring edge cases -- require genuine legal analysis. The assumption of compliance without
documented evidence is itself a gap if regulators ask for the assessment record.

**2. Misclassifying AI systems by technology rather than intended purpose.**
Article 6 classification is based on the Annex III use case the system is deployed in, not the
underlying model or technology. A large language model is not inherently high-risk. That same
model configured as an employee performance evaluation tool for consequential employment decisions
is Annex III high-risk AI. Organizations that assess their AI portfolio by model type rather than
deployment context systematically misclassify systems.

**3. Confusing provider and deployer obligations.**
Enterprises that procure third-party AI systems often assume the vendor (provider) handles
compliance. This is only partially true. Deployers under Article 26 carry direct obligations that
cannot be contracted away: following provider instructions, assigning trained human oversight
personnel, keeping logs, monitoring operation, and reporting incidents. Article 27 FRIA obligations
are deployer obligations -- the provider cannot perform them on the deployer's behalf. Every
organization using a third-party AI system in a high-risk use case must assess its own deployer
compliance posture.

**4. Technical documentation completed after deployment.**
Article 11 requires technical documentation before placing the system on the market or putting it
into service. Post-deployment documentation that reconstructs system characteristics from existing
implementation does not satisfy the pre-market requirement. Organizations that build first and
document later face a fundamental compliance gap that requires either retroactive remediation or
formal recognition that prior market entry was non-compliant.

**5. Human oversight that is nominal rather than operational.**
Article 14 requires human oversight that is designed to be effective. A system that generates
several hundred decisions per hour with oversight persons reviewing samples of outcomes, without
the ability to understand individual decisions or halt the system, does not satisfy Article 14.
The regulation requires oversight mechanisms that enable genuine understanding, monitoring,
override, and interruption -- not audit trails that confirm outputs occurred.

**6. Risk management as a point-in-time event.**
Article 9 explicitly requires a continuous, iterative process running throughout the entire
lifecycle. Organizations that complete a risk assessment before deployment and treat it as final
-- without updating it based on operational experience, post-market monitoring data, or changes
to the system -- do not maintain a compliant risk management system. The lifecycle requirement
means the risk register must be reviewed and updated as the system operates.

**7. GPAI providers unaware of their August 2025 obligations.**
The Article 53 baseline obligations for GPAI model providers (technical documentation, copyright
policy, training data summary, downstream information sharing) applied from August 2, 2025 --
not August 2026. Organizations building products on top of third-party GPAI models and providers
offering GPAI models through APIs need to assess their Article 53 position now.

**8. Missing authorized EU representative for non-EU providers.**
Non-EU companies placing high-risk AI or GPAI models on the EU market without a written authorized
representative designation are non-compliant with Article 22 and Article 54 respectively.
Appointing a representative is a legal and contractual process that takes time to establish
properly.

**9. Post-market monitoring designed separately from technical documentation.**
Article 72 requires that the post-market monitoring plan be part of the technical documentation
under Article 11. Organizations that establish monitoring systems after deployment, disconnected
from the Annex IV documentation package, produce evidence that does not form a coherent
compliance record. Monitoring plans should be drafted as part of the pre-market documentation
process.

**10. Phased enforcement dates creating false urgency prioritization.**
Because Chapter III applies from August 2026, some organizations deprioritize all high-risk AI
work in favor of other compliance tasks. This creates the risk of scrambling to achieve compliance
with extensive documentation, QMS, and conformity assessment requirements in compressed timeframes.
Given the lead time for building risk management systems, training oversight personnel, and
completing conformity assessments, organizations with high-risk AI should begin Chapter III work
now.

### Difficulty Areas

- **Article 27 FRIA:** No AI Office template questionnaire has been published as of the handbook's
  last update. Organizations must develop their own FRIA methodology pending official guidance,
  drawing from GDPR DPIA practice as a starting framework.
- **Annex IV technical documentation completeness:** The Annex IV structure requires detailed
  disclosure of development processes, performance metrics, and risk management decisions that
  organizations rarely document in one place before market entry.
- **Systemic risk GPAI threshold determination:** The 10^25 FLOPs threshold sounds precise but
  computing training FLOPs requires methodology decisions (which operations count, how to account
  for fine-tuning vs. pre-training) that lack standardized guidance.
- **Ongoing lifecycle compliance:** Both Article 9 risk management and Article 72 post-market
  monitoring require sustained operational processes, not one-time activities. Organizations built
  for point-in-time audit cycles (annual compliance reviews) must restructure for continuous
  compliance.

### Maturity Spectrum

| Level | Description |
|:-----:|-------------|
| 0 - None | No EU AI Act assessment performed. No AI inventory. No awareness of prohibited practices. No phased enforcement date tracking. |
| 1 - Initial | Article 5 prohibited practices review underway. AI inventory being built. Basic understanding of risk tiers. No formal classification process or documentation programme. |
| 2 - Developing | AI inventory complete with initial risk classifications. Article 5 assessment documented. Chapter III work planned with enforcement date milestones. Technical documentation process started for high-risk systems. |
| 3 - Defined | Classification register complete with legal sign-off. All Article 9-15 requirements implemented for identified high-risk systems. Technical documentation complete before market entry. Conformity assessment completed. EU database registration in place. Deployer obligations documented. |
| 4 - Managed | Continuous lifecycle compliance maintained. Post-market monitoring operational and feeding back into risk management. Authorized representatives established. FRIA process embedded in deployment workflows. GPAI obligations current. Regulatory monitoring process tracking Article 7 updates. |

---

## 8. Cross-Framework Relationships

### ISO 42001 Alignment

ISO 42001 (AI Management System standard, published December 2023) is the closest voluntary
standard to the EU AI Act's governance requirements. ISO 42001 certification does not constitute
EU AI Act conformity -- the Act requires specific conformity assessment procedures under Article
43 -- but the two frameworks address substantially overlapping concerns.

Key alignment points:

- **ISO 42001 Clause 6.1 (Risk Management) → Article 9:** ISO 42001 requires risk identification
  and assessment processes for AI systems throughout their lifecycle. The output of an ISO 42001-
  compliant risk management process is directly relevant evidence for Article 9 compliance.
- **ISO 42001 Clause 7.5 (Documented Information) → Article 11:** ISO 42001's documented
  information requirements produce system documentation that maps to Annex IV technical
  documentation elements.
- **ISO 42001 Clauses 9-10 (Performance Evaluation and Improvement) → Article 17 QMS and Article
  72 Post-Market Monitoring:** An ISO 42001-certified organization has quality management and
  performance evaluation processes in place that directly support Article 17 QMS and Article 72
  monitoring requirements.
- **ISO 42001 A.6.1.4 (Human Oversight) → Article 14:** ISO 42001's annex addresses AI system
  human oversight requirements in terms directly consistent with Article 14.

Organizations pursuing ISO 42001 certification should map their ISO 42001 scope explicitly to EU
AI Act articles, identifying which certification activities produce Article-level compliance
evidence and which gaps remain.

### NIST AI RMF Alignment

The NIST AI Risk Management Framework (AI RMF 1.0, published January 2023) is widely used by
US-headquartered organizations. It does not create a formal equivalence with EU AI Act requirements,
but the conceptual alignment is strong:

- **NIST MAP function → Article 9 (Risk Management) and Article 6 (Classification):** MAP 1.x
  activities cover AI system classification, context identification, and risk characterization.
  MAP 2.x covers risk analysis and evaluation. These outputs provide supporting evidence for
  Article 9 risk management documentation.
- **NIST MEASURE function → Article 15 (Accuracy, Robustness) and Article 12 (Logging):**
  MEASURE 2.x covers AI system measurement, evaluation, and monitoring. MEASURE 2.6 and 2.7
  address logging and robustness assessment directly relevant to Articles 12 and 15.
- **NIST GOVERN function → Article 17 (QMS) and Article 14 (Human Oversight):** GOVERN 1.x
  covers organizational accountability and governance for AI. GOVERN 4.x covers transparency and
  communication, mapping to Article 13 transparency to deployers.

Organizations using NIST AI RMF as their internal framework can use it as the risk management
backbone for EU AI Act compliance, but must supplement it with the Act's specific documentation
requirements, conformity assessment procedures, and registration obligations that have no NIST
analog.

### AIUC-1 Alignment

AIUC-1 was explicitly designed to operationalize EU AI Act requirements into auditable controls.
The alignment is the most direct of any framework in the IA catalog:

- **AIUC-1 C001 (Risk Taxonomy) and C002-C003 (Testing and Output Prevention) → Article 9:**
  AIUC-1's risk taxonomy requirement and pre-deployment testing controls address the risk
  identification and mitigation elements of Article 9.
- **AIUC-1 D005, E001-E002 (Oversight and Failure Plans) → Article 14:** AIUC-1's human oversight
  controls and failure planning requirements operationalize Article 14 into specific, testable
  controls.
- **AIUC-1 C005-C006 (Accuracy and Output Vulnerabilities) → Article 15:** AIUC-1's output
  accuracy and vulnerability controls provide testable implementation for Article 15's accuracy
  and robustness requirements.
- **AIUC-1 E015-E016 (Activity Logging and Disclosure) → Article 12 and Article 50:** AIUC-1's
  model activity logging controls map to Article 12 record-keeping; disclosure controls map to
  Article 50 transparency.

An AIUC-1-compliant organization has addressed many of the technical control requirements of the
EU AI Act at the system level. The primary gaps are regulatory-specific: conformity assessment,
EU database registration, authorized representatives, and the formal governance documentation
structure required under Chapter III, Section 3.

### GDPR Relationship

The EU AI Act builds explicitly on GDPR and should be read alongside it, not as an independent
obligation set:

- High-risk AI systems that process personal data require GDPR data protection impact assessments
  (DPIAs) under Article 35 GDPR. The Article 27 FRIA requirement under the AI Act is additional,
  not a substitute for the GDPR DPIA.
- Article 10 data governance requirements for training data align with GDPR principles of data
  minimization, purpose limitation, and accuracy for personal data used in AI training.
- GDPR supervisory authorities may have concurrent enforcement jurisdiction with AI Act market
  surveillance authorities for AI systems that process personal data.
- Organizations with mature GDPR compliance programmes -- particularly those with DPIA processes
  and Records of Processing Activities -- have a head start on EU AI Act compliance. The DPIA
  process provides a template for the Article 27 FRIA, and GDPR data inventory work underpins
  Article 10 data governance documentation.

### Evidence Reuse Opportunities

| Evidence Type | EU AI Act Article | Also Satisfies |
|--------------|:-----------------:|----------------|
| GDPR DPIA records | Art-27 (partial) | GDPR Art-35 |
| ISO 42001 risk register | Art-9 | ISO 42001 Clause 6.1 |
| ISO 42001 documented information | Art-11 (partial) | ISO 42001 Clause 7.5 |
| NIST AI RMF MAP outputs | Art-9, Art-6 | NIST AI RMF MAP profile |
| AIUC-1 adversarial testing reports | Art-15 | AIUC-1 B001 |
| AIUC-1 risk taxonomy | Art-9 | AIUC-1 C001 |
| AIUC-1 activity logs | Art-12, Art-19 | AIUC-1 E015 |

---

## 9. Path to Compliance

### High-Level Roadmap

**Stage 0: Immediate (Now -- Article 5 applies since February 2, 2025)**
- Inventory all AI systems in use across the organization
- Assess each system against the Article 5 prohibited practice categories
- Document the assessment with legal sign-off
- Halt any systems that fall into prohibited categories immediately
- This stage is not optional -- it addresses active legal exposure

**Stage 1: Foundation (Months 1-3)**
- Complete the Article 6 classification assessment for all AI systems
- Identify which systems are high-risk under Annex III (or Annex I for product companies)
- Determine provider vs. deployer role for each AI system
- Assess GPAI model exposure (Article 53 obligations apply since August 2025)
- Assign a named compliance owner and budget for the compliance programme
- Begin technical documentation drafting for all identified high-risk systems

**Stage 2: High-Risk Requirements Implementation (Months 3-9)**
- Implement Article 9 risk management systems for each high-risk AI system
- Establish data governance procedures for training/validation/testing datasets (Article 10)
- Complete Annex IV technical documentation (Article 11)
- Implement logging infrastructure meeting Article 12 requirements
- Draft instructions for use for deployers (Article 13)
- Design and test human oversight mechanisms (Article 14)
- Complete accuracy benchmarks and adversarial robustness testing (Article 15)
- Draft and implement quality management system (Article 17)

**Stage 3: Conformity and Registration (Months 6-12)**
- Complete self-assessment conformity assessment against Articles 9-15
- Draft EU declaration of conformity
- Affix CE marking
- Register high-risk AI systems in the EU database (Article 49)
- For non-EU providers: designate and document authorized EU representative (Article 22)

**Stage 4: Deployer and Transparency Compliance**
- Implement Article 26 deployer procedures including human oversight assignment and monitoring
- Complete Article 27 FRIA for applicable deployments before those deployments commence
- Implement Article 50 transparency disclosures (chatbot notices, synthetic content labeling)
- Establish post-market monitoring system (Article 72)

**Stage 5: Ongoing Lifecycle Compliance**
- Operate risk management system continuously (Article 9 lifecycle requirement)
- Execute post-market monitoring plan, collecting and analyzing operational data (Article 72)
- Update technical documentation when systems change (Article 11)
- Monitor Article 7 delegated act updates that may reclassify systems
- Conduct corrective action procedures when non-conformities are identified (Article 20)
- Report serious incidents to competent authorities per applicable timelines

### Conformity Assessment Overview

The conformity assessment pathway for most high-risk AI systems under Annex III is **provider
self-assessment**. There is no notified body requirement for Annex III systems (unlike, for
example, medical devices or ISO certification). This means the discipline of the conformity
assessment is entirely internal -- organizations must design a self-assessment process rigorous
enough to produce defensible evidence if market surveillance authorities request it.

For Annex I products (safety components in regulated products), the sector regulation's conformity
assessment pathway applies. If that pathway requires a notified body, the AI Act does not remove
that requirement.

Key conformity assessment documentation:
- Completed Annex IV technical documentation
- EU declaration of conformity (Article 47) certifying compliance with the regulation
- CE marking affixed to the system or its documentation
- Registration record in the EU AI Act database (Article 49)

---

## 10. Quick Reference Tables

### Risk Tier Summary

| Tier | Scope | Key Obligations | Maximum Penalty |
|:----:|-------|-----------------|:---------------:|
| Unacceptable (Prohibited) | 8 categories in Art-5 | Complete prohibition -- discontinue immediately | EUR 35M or 7% of turnover |
| High-Risk | Annex I products and Annex III use cases | Art-9 through Art-27 full requirement set, conformity assessment, EU database registration | EUR 15M or 3% of turnover |
| Limited Risk (Transparency) | Chatbots, deepfakes, emotion recognition, biometric categorization | Art-50 disclosure and labeling obligations | EUR 15M or 3% of turnover |
| GPAI | All GPAI models (Art-53); systemic risk models above 10^25 FLOPs (Art-55) | Technical documentation, copyright policy, training data summary; systemic risk: adversarial testing, incident reporting | EUR 15M or 3% of turnover |
| Minimal Risk | All other AI | No mandatory requirements | N/A |

### Enforcement Timeline

| Date | What Applies |
|------|-------------|
| **February 2, 2025** | Chapter II (Art-5 prohibited practices) -- ALREADY IN FORCE |
| **August 2, 2025** | Chapter V (Art-51-56 GPAI model obligations); Art-99 penalties -- ALREADY IN FORCE |
| **August 2, 2026** | Chapter III (Art-6-27 high-risk AI requirements including Annex III systems); Chapter IV (Art-50 transparency); Chapter VIII monitoring and enforcement (Art-72, Art-83) |
| **August 2, 2027** | Chapter III Section 1 applies to Annex I products (AI in regulated product safety components) |

### Chapter III Requirements for High-Risk AI

| Article | Requirement | Key Evidence |
|:-------:|-------------|:------------:|
| Art-9 | Risk management system (continuous lifecycle) | Risk register, risk assessment records, lifecycle update evidence |
| Art-10 | Data governance (training, validation, testing datasets) | Dataset documentation, bias assessment records |
| Art-11 | Technical documentation (Annex IV, pre-market) | Annex IV documentation, version control records |
| Art-12 | Automatic logging capability | Logging specification, event coverage documentation |
| Art-13 | Transparency to deployers (instructions for use) | Instructions for use document covering Art-13 elements |
| Art-14 | Human oversight (understand, monitor, override, interrupt) | Oversight design documentation, override testing results |
| Art-15 | Accuracy, robustness, cybersecurity | Accuracy benchmarks, robustness test results, adversarial test results |
| Art-17 | Quality management system | QMS policy and procedure documentation |
| Art-18 | 10-year documentation retention | Retention policy and enforcement evidence |
| Art-19 | 6-month log retention (minimum) | Log retention policy and configuration |
| Art-20 | Corrective actions and authority notification | Corrective action procedure, notification templates |
| Art-26 | Deployer: follow instructions, human oversight, monitor | Deployment procedures, oversight assignment records |
| Art-27 | FRIA (for covered deployment contexts) | FRIA documentation, market surveillance authority notification |

### Provider vs. Deployer Obligations Comparison

| Obligation | Provider | Deployer |
|-----------|:--------:|:--------:|
| Risk management system (Art-9) | Required | Not directly required (must follow provider system) |
| Data governance (Art-10) | Required for training data | Required: ensure input data is appropriate (Art-26) |
| Technical documentation (Art-11) | Required (Annex IV) | Not required (receive provider's documentation) |
| Automatic logging capability (Art-12) | Design into system | Retain logs under their control (Art-26) |
| Instructions for use (Art-13) | Provide to deployers | Receive from provider; must follow |
| Human oversight design (Art-14) | Design into system | Implement operational oversight (Art-26) |
| Accuracy/robustness/cybersecurity (Art-15) | Required | Not directly (benefit from provider's compliance) |
| Quality management system (Art-17) | Required | Not required as such |
| Conformity assessment (Art-43) | Required | Not required (verify provider's assessment) |
| EU declaration of conformity (Art-47) | Required | Not required |
| CE marking (Art-48) | Required | Not required |
| EU database registration (Art-49) | Required | In some cases for public authority deployers |
| Corrective actions (Art-20) | Required (notify authorities and deployers) | Required (notify provider of serious incidents) |
| FRIA (Art-27) | Not required | Required before deployment in covered contexts |
| Authorized representative (Art-22) | Required (if non-EU) | Not required |

### Annex III High-Risk Use Case Areas

| Area | Examples |
|------|---------|
| 1. Biometrics | Remote biometric identification, biometric categorization, emotion recognition (limited exceptions) |
| 2. Critical Infrastructure | AI managing or predicting disruptions to electricity grids, water systems, transport networks |
| 3. Education | Admission decisions, performance evaluation, student assessment, dropout risk scoring |
| 4. Employment | CV screening, recruitment, promotion decisions, work allocation, performance monitoring |
| 5. Essential Services | Credit scoring, insurance risk assessment, public benefit eligibility determination |
| 6. Law Enforcement | Individual criminal risk scoring, evidence reliability assessment, predictive policing, crime analytics |
| 7. Migration and Asylum | Document verification, asylum case assessment, irregular migration risk scoring, lie detection |
| 8. Justice and Democracy | AI assisting judicial fact-finding, influencing electoral processes, targeting political advertising |

### Glossary

| Term | Definition |
|------|-----------|
| **Annex III** | Regulation annex listing eight high-risk AI use-case areas that trigger Chapter III requirements |
| **Annex IV** | Regulation annex specifying the required structure of technical documentation for high-risk AI |
| **CE marking** | Conformity marking indicating a product meets EU regulatory requirements; required for high-risk AI |
| **Conformity assessment** | Process by which a provider verifies a high-risk AI system complies with Chapter III requirements |
| **Deployer** | Organization or person using an AI system under their authority in a professional context |
| **EU declaration of conformity** | Formal declaration by the provider that the high-risk AI system complies with the regulation |
| **FRIA** | Fundamental Rights Impact Assessment -- required by deployers before high-risk AI deployment in covered contexts |
| **GPAI model** | General-Purpose AI model -- a model trained on broad data with general applicability, often integrated into downstream products |
| **High-risk AI system** | AI system falling under Annex I or Annex III classification, subject to full Chapter III obligations |
| **Provider** | Developer, manufacturer, or entity placing an AI system on the market under their own name |
| **Systemic risk** | Classification for GPAI models above 10^25 FLOPs training compute or designated by Commission; triggers Art-55 obligations |
| **Technical documentation** | Annex IV documentation package demonstrating how a high-risk AI system meets the regulation's requirements |

---

## Sources

- [Regulation (EU) 2024/1689 -- Official Journal](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689) -- Official text of the EU AI Act, OJ L 2024/1689, 12.7.2024
- [EU AI Act Explorer](https://artificialintelligenceact.eu/ai-act-explorer/) -- Interactive article-by-article guide with recitals and commentary
- [EU AI Office](https://digital-strategy.ec.europa.eu/en/policies/ai-office) -- AI Office publications, codes of practice development, GPAI guidance
- [European Parliament Briefing: EU AI Act](https://www.europarl.europa.eu/RegData/etudes/BRIE/2021/698792/EPRS_BRI(2021)698792_EN.pdf) -- Legislative background and impact analysis
- controls.yaml -- Internal structured article definitions (33 controls)
- questions.yaml -- Internal assessment questions (36 questions)
- crosswalk: eu-ai-act.yaml -- Internal cross-framework mappings
- AIUC-1 Handbook (internal reference) -- `standards/frameworks/aiuc-1/docs/aiuc1-handbook.md`

---
