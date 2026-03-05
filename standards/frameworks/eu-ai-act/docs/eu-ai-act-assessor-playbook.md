---
type: reference
name: eu-ai-act-assessor-playbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-25
---

# EU AI Act Assessor Playbook

**Regulation:** EU 2024/1689 (Regulation of the European Parliament and of the Council laying down
harmonised rules on artificial intelligence)

**Purpose:** Operational guide for assessors conducting EU AI Act compliance evaluations. Covers
classification determination, per-chapter assessment methodology, evidence collection, and findings
reporting.

**Audience:** Internal compliance teams, DPOs, external auditors, and legal/GRC advisors conducting
EU AI Act gap assessments or ongoing compliance monitoring.

**Related Documents:**
- `eu-ai-act-handbook.md` — Framework overview and article summaries
- `controls.yaml` — Control definitions (33 articles)
- `questions.yaml` — Assessment questions with evidence requirements and scoring

---

## Critical Context: Phased Enforcement

The EU AI Act is a **legal regulation with criminal and administrative penalty exposure**, not a
voluntary framework. Enforcement dates determine which articles are currently mandatory:

| Date | Articles | Status |
|------|----------|--------|
| Feb 2, 2025 | Art-5 (prohibited practices) | **Already mandatory** |
| Aug 2, 2025 | Art-51–56 (GPAI models), Art-99 (penalties) | **Already mandatory** |
| Aug 2, 2026 | Art-6–27 (high-risk AI classification and requirements), Art-50 (transparency) | Mandatory from this date |
| Aug 2, 2027 | Art-6(1) / Annex I product safety components | Mandatory from this date |

Assessors must align findings and remediation timelines to enforcement dates. A gap that becomes
enforceable Feb 2025 carries different urgency than one enforceable Aug 2026. The compliance posture
section in the report must group findings by enforcement date.

**Assessment scope depends entirely on AI risk tier.** Establish classification for every AI system
before assessing any requirements (see Section 2). Assessing Art-9 requirements for a limited-risk
chatbot wastes time and misrepresents compliance scope.

---

## 1. Assessment Overview

### What EU AI Act Assessment Produces

An EU AI Act compliance assessment produces:

1. **Classification register:** Every AI system the organization develops or deploys, with its
   assigned risk tier (prohibited, high-risk, limited risk, minimal risk) and applicable articles,
   documented with classification rationale.

2. **Gap register:** For each applicable article and obligation, a finding with severity rating,
   enforcement date, remediation owner, and target date.

3. **Enforcement timeline gap prioritization:** Gaps grouped by enforcement date, so the organization
   can sequence remediation against legal deadlines.

4. **Penalty exposure assessment:** Identification of which violations carry the highest penalty
   thresholds under Art-99, so risk-based prioritization is defensible.

This is not a certification assessment — there is no single EU AI Act certification mark for most
high-risk AI systems. Conformity assessment (Chapter VI, Section 5) is either self-declaration or
notified body evaluation depending on AI system category. The assessor's role is compliance gap
identification and remediation planning, not certification preparation.

### Assessment Scope by Risk Tier

| Risk Tier | Applicable Articles | Chapter(s) | Primary Evidence Obligation |
|-----------|--------------------|-----------|-----------------------------|
| Prohibited | Art-5 | II | No prohibited systems deployed; documented review |
| High-risk (Annex III) | Art-6–27, Art-72 | III | Art-8–15 requirements + provider/deployer obligations |
| High-risk (Annex I products) | Art-6(1), Art-8–27 | III | As above, effective Aug 2027 |
| Limited risk (chatbots, deepfakes) | Art-50 | IV | Transparency disclosures |
| GPAI models | Art-51–56 | V | Technical docs, copyright policy, training data summary |
| GPAI with systemic risk | Art-51–56, Art-55 | V | Above + adversarial testing, incident reporting |

### Provider vs. Deployer: Different Obligations, Different Evidence

Many organizations are both a provider (they built or customized an AI system) and a deployer (they
use AI systems built by others). The obligations differ materially:

**Provider obligations (Art-16–22):** Risk management system, technical documentation, QMS, conformity
assessment, CE marking, EU registration, corrective action process, authority cooperation.

**Deployer obligations (Art-26–27):** Use within intended purpose, assign and train oversight persons,
monitor operation, report serious incidents to providers, log retention, FRIA for covered contexts.

At assessment opening, establish the organization's role for each AI system. Avoid conflating provider
and deployer obligations — a deployer is not required to conduct the Art-9 risk management system
(that is the provider's obligation), but is required to assign competent human oversight and monitor
operation under Art-26.

### Quick Reference: Chapters, Articles, and Evidence

| Chapter | Subject | Articles | Enforcement Date | Evidence Types |
|---------|---------|----------|-----------------|----------------|
| II | Prohibited practices | Art-5 | 2025-02-02 | AI inventory, prohibited practice review, legal sign-off |
| III, Sec 1 | High-risk classification | Art-6–7 | 2026-08-02 (Annex III) / 2027-08-02 (Annex I) | Classification decisions, Annex III review |
| III, Sec 2 | High-risk AI requirements | Art-8–15 | 2026-08-02 | Risk mgmt, data governance, technical docs, logs, IFU, oversight, testing |
| III, Sec 3 | Provider/deployer obligations | Art-16–27 | 2026-08-02 | QMS, retention policy, corrective action process, FRIA |
| IV | Transparency | Art-50 | 2026-08-02 | Disclosure notices, labelling, UX screenshots |
| V | GPAI models | Art-51–56 | 2025-08-02 | Model cards, training data summary, copyright policy, red team reports |
| VIII | Post-market monitoring | Art-72 | 2026-08-02 | Monitoring plan, incident reporting procedure |
| Penalties | — | Art-99 | 2025-08-02 | Compliance programme documentation |

---

## 2. Step Zero: AI System Classification Worksheet

**This is the most critical pre-assessment step.** No requirements assessment is valid without a
completed classification determination. Conduct this worksheet for every AI system in scope before
opening any requirements interview.

Classification errors propagate throughout the assessment: under-classifying a high-risk system
creates false confidence; over-classifying creates unnecessary compliance burden.

### 2.1 Prohibited Practices Check (Art-5) — All Organizations

Art-5 applies from Feb 2, 2025 and carries the highest penalty exposure (Art-99: up to EUR 35M or
7% of worldwide annual turnover). This check must be completed for every AI system regardless of
other classification.

**Prohibited Practice Categories (Art-5) — Assessor Checklist:**

| # | Prohibited Category | Specific Question | Red Flag Indicators |
|---|---------------------|-------------------|---------------------|
| 1 | Subliminal manipulation | Does this AI use techniques that operate below conscious awareness to influence behavior, bypassing rational agency? | Systems exploiting cognitive biases in dark pattern designs; persuasion engines without transparency |
| 2 | Exploitation of vulnerabilities | Does this AI exploit the age, disability, or social/economic situation of a person to influence behavior causing harm? | AI systems targeting children, elderly, or economically distressed users with manipulative outcomes |
| 3 | Social scoring by public authorities | Does a public authority use this AI to evaluate or classify persons based on social behavior across contexts? | Government-operated citizen scoring systems; cross-context reputation systems operated by public bodies |
| 4 | Real-time remote biometric identification in public spaces | Does this AI identify natural persons in real time from biometric data in publicly accessible spaces? | CCTV + facial recognition; real-time crowd identification. Check: is there a law enforcement exception with prior judicial authorization? |
| 5 | Emotion recognition (workplace/education) | Does this AI infer emotions from workers' or students' facial expressions, voice, or physiological signals? | HR systems inferring engagement, attention, or mood; proctoring systems with emotion detection |
| 6 | Biometric categorization inferring sensitive characteristics | Does this AI infer race, political opinion, religion, sexual orientation, or trade union membership from biometric data? | Systems using facial analysis to infer ethnicity or political affiliation |
| 7 | Untargeted facial recognition database scraping | Does this AI create or expand a facial recognition database by indiscriminate scraping from the internet or CCTV? | Bulk data collection to build biometric databases without individual consent |
| 8 | AI that manipulates persons to circumvent free will | Does this AI use manipulation techniques causing persons to engage in behaviors against their interests? | Systems designed to override informed decision-making; deceptive influence at scale |

**Documentation required:**
- Written review against each of the 8 categories for every AI system
- Attestation by legal or compliance function confirming non-prohibited status
- If any system presents a borderline case: escalation documentation with legal opinion

**Escalation procedure:** If during assessment a system appears to meet a prohibited category, STOP.
Do not continue the requirements assessment for that system. Notify the engagement lead immediately.
Document the finding as Critical severity with immediate escalation required. The organization must
take immediate corrective action — continue operation of a prohibited AI system creates ongoing
penalty exposure.

### 2.2 High-Risk Classification Check (Art-6)

Art-6 establishes two separate high-risk classification routes. Evaluate both independently.

**Route A: Art-6(1) — Safety Component in Annex I Product (effective Aug 2, 2027)**

Step 1: Is the AI system a safety component of a product (or is the AI system itself a product)?
Step 2: Is that product covered by Union harmonisation legislation listed in Annex I?
  - Annex I includes: machinery, toys, recreational craft, lifts, pressure equipment, personal
    protective equipment, gas appliances, radio equipment, medical devices, in vitro diagnostic
    medical devices, aviation, motor vehicles, agriculture tractors, marine equipment, rail, civil
    aviation
Step 3: Is that product subject to third-party conformity assessment under that harmonisation legislation?

If yes to all three: the AI system is high-risk under Art-6(1) from Aug 2, 2027.

**Route B: Art-6(2) — Listed Use-Case in Annex III (effective Aug 2, 2026)**

Check whether the AI system's primary use case falls within one of the eight Annex III areas:

| Annex III Area | Examples | Assessor Notes |
|---------------|---------|----------------|
| 1. Biometric identification and categorization | Remote biometric ID, biometric categorization (not real-time in public, which is Art-5) | Distinguish from Art-5 real-time public space prohibition |
| 2. Critical infrastructure | AI managing water, gas, electricity, road, rail, air, maritime, banking, financial market, healthcare infrastructure | Broad — assess operational context carefully |
| 3. Education and vocational training | AI determining access, placement, evaluation of students; detecting prohibited behavior in exams | Proctoring AI, admission screening AI |
| 4. Employment, workers management | Recruitment and selection AI, promotion/demotion/contract termination AI, task allocation systems, monitoring work performance | HR AI broadly — significant compliance exposure |
| 5. Essential private and public services | Credit scoring, social benefits eligibility, emergency services dispatch, health and life insurance risk assessment | High-risk for financial services and public sector AI |
| 6. Law enforcement | Individual risk assessment, lie detection, crime prediction, evidence evaluation in criminal proceedings | Primarily law enforcement context; note restricted use |
| 7. Migration, asylum, border management | Risk assessment of persons crossing borders, asylum application processing, visa application evaluation | Government context primarily |
| 8. Administration of justice and democratic processes | AI in court proceedings, election influence AI | High sensitivity; note Art-99 penalty exposure |

**Art-6(2) Self-Exclusion Provision:** Under Art-6(3), a provider may determine that a system listed
in Annex III is not high-risk where it does not pose a significant risk of harm. This self-exclusion
must be documented and registered. Assessors should request the self-exclusion documentation and
evaluate whether the rationale is substantiated.

### 2.3 GPAI Model Classification Check (Art-51)

A model is a GPAI model if it is trained on large amounts of data using self-supervision at scale and
can perform a wide range of distinct tasks. This includes large language models, large multimodal
models, and similar foundation models.

| Classification Step | Question | If Yes |
|--------------------|----------|--------|
| Is this a GPAI model? | Was the model trained with large-scale self-supervised learning for general task capability? | Proceed to GPAI obligations (Art-53) |
| Does it have systemic risk? | Was training compute above 10^25 FLOPs, OR has the European Commission designated it? | GPAI with systemic risk obligations (Art-55) additionally apply |
| Is it open-source? | Is the model released under open-source license? | Exemption from Art-53 documentation/info-sharing requirements UNLESS systemic risk |
| Is the provider outside the EU? | Is the GPAI model provider not established in the EU? | EU authorized representative required (Art-54) |

**Note on GPAI and high-risk intersection:** A GPAI model that is integrated into a high-risk AI
system application is subject to both Chapter V GPAI obligations (at the model level) and Chapter III
high-risk requirements (at the application level). The two obligation sets do not substitute for each
other.

### 2.4 Classification Output Document

For each AI system, complete the following classification record:

```
AI System Name:
System Description (one sentence):
Intended Purpose / Primary Use Case:

Prohibited Practices Review (Art-5):
  Review completed: Y/N
  Reviewer and date:
  Finding: [No prohibited practice identified / Borderline — escalated / PROHIBITED]

High-Risk Classification:
  Art-6(1) Route (Annex I product): [Applies / Does not apply]
  Art-6(2) Route (Annex III use case): [Applies — Area: [X] / Does not apply]
  Art-6(3) Self-exclusion asserted: [Y/N — if Y, rationale summary:]
  Classification decision: [High-risk / Not high-risk]
  Effective date (if high-risk): [2026-08-02 or 2027-08-02]

GPAI Assessment:
  Is this a GPAI model: [Y/N]
  Systemic risk threshold met or designated: [Y/N]
  Open-source model: [Y/N]

Final Classification: [Prohibited | High-risk (Annex III) | High-risk (Annex I) | GPAI | GPAI-systemic-risk | Limited-risk | Minimal-risk]
Applicable Articles: [List]
Signed off by (compliance or legal):
Date:
```

---

## 3. Pre-Assessment Document Request List

Send to the organization at least five business days before fieldwork begins. Non-receipt of critical
documents is itself an indicator of compliance maturity.

### All Organizations (Regardless of Tier)

| Document | Applicable To | Red Flag If Missing |
|----------|--------------|---------------------|
| AI system inventory — all deployed and procured AI systems | All | No baseline for classification or scope |
| Completed Art-5 prohibited practices review for each AI system | All | Art-5 already mandatory since Feb 2025 |
| Legal/compliance sign-off on prohibited practice non-use | All | Obligation with no ownership |
| Named compliance owner for EU AI Act programme | All | No accountability structure |
| Compliance roadmap with enforcement date milestones | All | No planning against legal deadlines |

### High-Risk AI Providers (Art-8–22)

| Document | Article | Red Flag If Missing |
|----------|---------|---------------------|
| Risk management system documentation | Art-9 | Core lifecycle obligation |
| Risk register for each high-risk AI system | Art-9 | Risk management in name only |
| Training, validation, and testing data governance documentation | Art-10 | Data quality controls undocumented |
| Bias identification and mitigation records | Art-10 | Bias assessment not performed |
| Technical documentation per Annex IV for each high-risk system | Art-11 | Core documentation obligation |
| Automatic logging configuration and specification | Art-12 | Traceability not implemented |
| Log retention policy (minimum 6 months for provider logs) | Art-19 | Retention not managed |
| Instructions for use (IFU) documentation for each system | Art-13 | Deployers cannot meet their obligations |
| Human oversight design documentation | Art-14 | Oversight may be nominal only |
| Accuracy, robustness, and cybersecurity testing records | Art-15 | Performance not substantiated |
| Quality management system documentation | Art-17 | Compliance not systematically managed |
| Document retention policy (10-year for Art-18 documentation) | Art-18 | Regulatory access not possible |
| Post-market monitoring system documentation | Art-72 | Lifecycle compliance not maintained |
| Conformity assessment records (self-declaration or notified body) | Art-43, Art-47 | Conformity basis undocumented |
| EU database registration confirmation (if applicable) | Art-49 | Registration obligation unmet |
| Corrective action and authority notification procedure | Art-20, Art-21 | Incident response not defined |

### High-Risk AI Deployers (Art-26–27)

| Document | Article | Red Flag If Missing |
|----------|---------|---------------------|
| Deployment procedures referencing provider IFU | Art-26 | Deployer obligations not operationalized |
| Human oversight assignment and training records | Art-26 | Oversight persons not assigned or trained |
| Serious incident reporting procedure (to providers) | Art-26 | Monitoring loop not closed |
| Fundamental Rights Impact Assessment (FRIA) | Art-27 | Required for public authority, education, employment, critical infrastructure, law enforcement contexts |
| FRIA market surveillance authority notification records | Art-27 | Notification obligation unmet |

### GPAI Providers (Art-51–56)

| Document | Article | Red Flag If Missing |
|----------|---------|---------------------|
| GPAI model training compute assessment (FLOPs calculation) | Art-51 | Systemic risk determination undocumented |
| Technical documentation per Annex XI | Art-53 | Core documentation obligation |
| Copyright compliance policy | Art-53 | Legal exposure for training data |
| Training data content summary | Art-53 | Transparency obligation |
| AI Office notification records (if systemic risk threshold met) | Art-52 | 2-week notification obligation unmet |
| Adversarial testing / model evaluation records | Art-55 | Systemic risk assessment not performed |
| Systemic risk assessment (accidents, misuse, societal impacts) | Art-55 | Systemic risk obligations not implemented |
| Serious incident reporting procedure (AI Office) | Art-55 | 2-week AI Office notification capability |

---

## 4. Assessment Area 1: Prohibited Practices (Art-5)

**Enforcement date:** Feb 2, 2025. **Penalty tier (Art-99):** Up to EUR 35M or 7% of worldwide annual
turnover — the highest penalty tier.

### Interview Guide

**Target interviewees:** Chief Compliance Officer, General Counsel, AI Governance Lead, DPO

**Opening question:** "Walk me through how your organization determined that no AI systems you deploy
fall within the Art-5 prohibited categories. Who performed this review, when, and what was the output?"

**Follow-up questions:**
- "Show me the Art-5 review documentation for [specific AI system from inventory]."
- "For any AI systems that use biometric data, what analysis was done to distinguish between
  Art-5-prohibited real-time remote biometric identification versus permitted non-real-time use?"
- "Does your organization use AI in HR, employee monitoring, or recruitment? How was that assessed
  against Art-5(1)(b) exploitation of vulnerabilities and Art-5(1)(ea) emotion recognition in the
  workplace?"
- "How are new AI systems that are procured or built assessed against Art-5 before going live?"
- "Who has sign-off authority to confirm an AI system does not breach Art-5?"

### Evidence Review

Pull from Q-EU-AI-ACT-CH2-001, Q-EU-AI-ACT-CH2-002, Q-EU-AI-ACT-CH2-003:

| Evidence Item | What to Verify | Gap Indicator |
|--------------|---------------|---------------|
| AI system inventory | Complete, current, covers all deployed and procured AI | Gaps in inventory = unknown prohibited practice exposure |
| Art-5 assessment per system | Each of 8 categories addressed per system | Absent or generic assessment not tailored to system |
| Legal/compliance sign-off | Named signatory, dated, covers all systems | Undated, unsigned, or covers a subset only |
| Biometric system documentation | Art-5(1)(h) exception documented with judicial authorization if used | Real-time biometric in public without authorization |
| Emotion recognition documentation | Assessment confirms not used in workplace/education, or confirms Art-5 exception applies | Systems in use with no assessment |

### Scoring Indicators

| Status | Description |
|--------|-------------|
| Full | Complete AI inventory with documented Art-5 assessment covering all 8 categories per system; legal or compliance sign-off; no prohibited systems in use |
| Partial | Inventory exists; assessment performed but incomplete — some systems not reviewed, some categories not addressed, or sign-off absent |
| Not Implemented | No inventory, no Art-5 assessment, or systems confirmed to violate Art-5 |

---

## 5. Assessment Area 2: High-Risk AI Requirements (Art-8 Through Art-15)

**Enforcement date:** Aug 2, 2026. These requirements apply only to systems classified as high-risk
under Art-6. If no systems are high-risk, this section does not apply — document that finding.

### Art-9 — Risk Management System

**Requirement:** Providers shall establish, implement, document, and maintain a risk management system
as a continuous iterative process throughout the high-risk AI system lifecycle. The system must
identify and analyze known and reasonably foreseeable risks; estimate and evaluate risks from intended
use and reasonably foreseeable misuse; evaluate risks from post-market monitoring data.

**Interview questions:**
- "Show me your Art-9 risk management system documentation. What makes this a continuous, iterative
  process versus a one-time assessment?"
- "How does the risk management system connect to the AI development lifecycle? At what stages does
  it trigger?"
- "Show me the risk register for [specific high-risk AI system]. How were the risk entries identified?"
- "When was this risk register last updated, and what triggered that update?"
- "How do post-market monitoring findings feed back into the Art-9 risk management system?"

**Evidence required (from Q-EU-AI-ACT-CH3-003):**
- Risk management system documentation demonstrating iterative process and lifecycle coverage
- Risk register with identified known and reasonably foreseeable risks for each high-risk system
- Residual risk assessment and documented accepted risk levels
- Evidence of updates triggered by operational experience or post-market data

**Common gaps:** Risk management document exists but has not been updated since initial drafting;
risk register not connected to the deployment or modification lifecycle; residual risk acceptance not
documented; post-market data does not feed back into Art-9 process.

### Art-10 — Data and Data Governance

**Requirement:** Training, validation, and testing data sets must be subject to appropriate data
governance practices. Data sets must be relevant, sufficiently representative, and to the best extent
possible free from errors and complete. Relevant biases must be identified, assessed, and where
possible mitigated.

**Interview questions:**
- "Describe your data governance practices for training data for [specific system]. Who is responsible?"
- "How did you assess the representativeness of training data? What population was the model intended
  to serve, and how does your training data reflect that population?"
- "Show me your bias identification and mitigation records. Which biases were identified, and how
  were they addressed?"
- "How is data quality monitored after initial training? What happens if data quality degrades?"

**Evidence required (from Q-EU-AI-ACT-CH3-004):**
- Data governance procedures for training, validation, and testing datasets
- Dataset representativeness and completeness assessment records
- Bias identification and mitigation records per dataset
- Data quality metrics and ongoing monitoring records

**Common gaps:** Training data not documented to Annex IV standard; bias assessment conducted as a
checkbox exercise without substantive analysis; no procedure for ongoing data quality monitoring;
data provenance undocumented.

### Art-11 — Technical Documentation

**Requirement:** Before placing a high-risk AI system on the market or putting it into service,
providers must draw up and maintain technical documentation per Annex IV. Documentation must
demonstrate compliance with this Regulation.

**Interview questions:**
- "Show me the Annex IV technical documentation for [specific high-risk system]. Walk me through
  how it was prepared."
- "When was this documentation last updated? What triggered the update?"
- "How is the technical documentation kept current when the system is modified?"
- "Who in your organization owns the obligation to maintain this documentation?"

**Annex IV Completeness Checklist (use during fieldwork):**

| Annex IV Element | Present? | Substantive? |
|-----------------|----------|--------------|
| General description of the system | | |
| Description of system components, algorithms, models | | |
| Description of relevant changes made throughout lifecycle | | |
| Human oversight measures and specifications | | |
| Intended purpose and foreseeable misuse | | |
| Performance metrics including accuracy | | |
| Known and foreseeable risks and risk management measures | | |
| Training, validation, and testing data specifications | | |
| Instructions for use | | |
| Declaration of conformity | | |

**Common gaps:** Technical documentation prepared post-hoc rather than pre-deployment; Annex IV
elements partially covered; no version control; documentation does not reference the intended purpose
as the baseline for compliance assessment.

### Art-12 — Record-Keeping (Automatic Logging)

**Requirement:** High-risk AI systems must technically allow for the automatic recording of events
(logs) throughout their lifetime. Logging must enable traceability of functioning appropriate to the
intended purpose, at minimum enabling identification of situations that present a risk or lead to
substantial modification.

**Interview questions:**
- "Describe the automatic logging capability built into [specific high-risk system]. What events are
  logged automatically without human intervention?"
- "Show me a sample of logs. How would you use these logs to identify a situation where the system
  presented a risk?"
- "What is your log retention period for this system? How does that meet the Art-19 minimum of 6 months?"
- "Who has access to the logs? Under what circumstances would you provide log access to a competent
  authority?"

**Evidence required (from Q-EU-AI-ACT-CH3-006):**
- Technical specification documenting logging capability
- Log retention policy specifying minimum 6-month retention (Art-19 for providers)
- Evidence logs capture events sufficient to identify risks and substantial modifications
- Sample log output demonstrating actual capture

**Common gaps:** Logging implemented at application layer only, not at AI model decision layer;
log retention period below 6-month minimum; logs insufficient to identify the AI system's specific
decision logic; no defined log access procedure for authority cooperation (Art-21).

### Art-13 — Transparency and Instructions for Use

**Requirement:** High-risk AI systems must be designed for sufficient transparency to enable deployers
to interpret outputs and use the system appropriately. Providers must supply instructions for use
including: provider identity, system characteristics, performance metrics, known limitations, human
oversight measures, and computational/hardware requirements.

**Interview questions:**
- "Show me the instructions for use for [specific high-risk system]. Walk me through how a deployer
  would use this document to understand the system's limitations."
- "How does the IFU explain what the system's output means and how a human decision-maker should
  interpret it?"
- "What are the documented performance metrics? Are limitations clearly disclosed, including for
  subpopulations or edge cases?"
- "How are the IFU provided to deployers? When — at procurement, at deployment, on update?"

**Evidence required (from Q-EU-AI-ACT-CH3-007):**
- Instructions for use documentation covering all Art-13 required elements
- Evidence IFU provided to deployers at time of system delivery
- Performance metrics including known limitations and conditions for degraded performance
- Disclosure of human oversight measures required per Art-14

**Common gaps:** IFU provided but at generic level — does not disclose specific performance
limitations for the intended use context; limitations not disclosed for specific subpopulations
where accuracy degrades; IFU not updated when system is modified; deployers confirm they received
no IFU.

### Art-14 — Human Oversight

**Requirement:** High-risk AI systems must be designed to enable natural persons to effectively
oversee operation during the period of use. Oversight measures must be proportionate to risks and
enable oversight persons to: understand capabilities and limitations; monitor operation; detect and
address failures; disregard or override outputs; intervene or interrupt; be aware of automation bias.

**Interview questions:**
- "Describe the human oversight mechanism built into [specific system]. What can a human do that
  the system cannot prevent?"
- "How does the system ensure the oversight person understands the AI's capabilities and limitations
  in real time — not just at training time?"
- "Show me the override functionality. How quickly can a human intervene to stop or reverse an AI
  output in production?"
- "How do you address automation bias? Are oversight persons trained to critically evaluate AI
  outputs rather than routinely confirm them?"
- "What training do oversight persons receive? Show me training records."

**Evidence required (from Q-EU-AI-ACT-CH3-008):**
- Design documentation showing each Art-14 oversight mechanism
- Override and intervention capability with documented response time
- Automation bias awareness measures (training curriculum, UI design)
- Training completion records for oversight persons
- Monitoring evidence that oversight is operationally effective, not nominal

**Common gaps:** Human oversight documented in policy but not operationally implemented — there is
no actual override mechanism; oversight persons assigned but not trained on AI limitations; automation
bias not addressed — oversight persons routinely approve AI outputs without independent evaluation;
IFU describes oversight requirements but deployer has not implemented them.

### Art-15 — Accuracy, Robustness, and Cybersecurity

**Requirement:** High-risk AI systems must achieve appropriate accuracy, robustness, and cybersecurity
throughout their lifecycle. Technical redundancy, fallback plans, and protection against adversarial
attacks must be implemented. Systems processing personal data must be resilient to attempts to alter
personal data use.

**Interview questions:**
- "What accuracy metrics have you defined for [specific system] relative to its intended purpose?
  Show me baseline and current performance measurements."
- "Describe your robustness testing. What edge cases or out-of-distribution inputs were tested?"
- "Have you conducted adversarial testing — deliberate attempts to degrade or manipulate the system's
  outputs? Show me the results."
- "What is the fallback plan if this system fails? How is continuity maintained?"
- "How is cybersecurity of the AI system itself assessed, separately from infrastructure security?"

**Evidence required (from Q-EU-AI-ACT-CH3-009):**
- Accuracy metrics and benchmark results for the intended purpose
- Robustness testing records including edge cases and distributional shift
- Adversarial testing records (deliberate manipulation attempts)
- Cybersecurity assessment specific to the AI model and its attack surface
- Fallback plan documentation with tested recovery procedures

**Common gaps:** Accuracy defined at aggregate level but not for subpopulations where the system
makes high-stakes decisions; robustness testing limited to standard test sets — no adversarial or
edge-case testing; fallback plan documented but never tested; cybersecurity assessment covers
infrastructure but not the AI model's specific attack surface (e.g., prompt injection, model
inversion, membership inference).

---

## 6. Assessment Area 3: Provider and Deployer Obligations (Art-16 Through Art-27)

### Provider Obligations (Art-16–22)

**Art-17 — Quality Management System**

A QMS for high-risk AI providers must be documented as written policies, procedures, and instructions
covering: strategy for regulatory compliance; AI design and design control techniques; examination
and testing procedures; data management procedures; roles and responsibilities; post-market monitoring.

**Interview questions:**
- "Show me your QMS documentation for AI systems. How does this QMS differ from or complement an
  existing ISO 9001 or ISO 42001 QMS?"
- "Who owns the QMS? How is it reviewed and updated when regulatory requirements or AI system
  characteristics change?"
- "Walk me through how the QMS connects Art-9 risk management, Art-10 data governance, and Art-11
  technical documentation as an integrated system."

**Evidence required (from Q-EU-AI-ACT-CH3-010):**
- QMS documentation covering all Art-17 required elements
- Named QMS owner with defined responsibilities
- QMS review and update records
- Evidence QMS is operationalized — not a documentation exercise

**Art-18 / Art-19 — Retention Obligations**

Art-18: Technical documentation and EU declaration of conformity retained 10 years after market
placement. Art-19: Automatically generated logs retained minimum 6 months (providers).

**Evidence required (from Q-EU-AI-ACT-CH3-011):**
- Document retention policy specifying 10-year retention for Art-18 documentation
- Log retention policy specifying minimum 6-month retention
- Evidence retention controls are implemented and enforced (not policy-only)

**Art-20 / Art-21 — Corrective Actions and Authority Cooperation**

Art-20: Providers must immediately take corrective action, withdraw, or recall when a system is
non-conforming, and notify authorities and deployers. Art-21: Providers must cooperate with national
competent authorities and the AI Office, including providing access to technical documentation and
source code upon reasoned request.

**Evidence required (from Q-EU-AI-ACT-CH3-012, Q-EU-AI-ACT-CH3-012B):**
- Corrective action procedure covering investigation, corrective measures, authority notification,
  and deployer notification (Art-20)
- Documented process for responding to authority requests for documentation or source code (Art-21)
- Contact and escalation procedures for AI Office and national competent authority inquiries
- Withdrawal and recall procedures with defined timeframes

### Deployer Obligations (Art-26–27)

**Art-26 — Deployer Operating Obligations**

Deployers must: use systems according to provider IFU; assign and maintain human oversight; monitor
operation and report serious incidents to providers; ensure input data is relevant and representative;
retain automatically generated logs under their control; perform DPIAs where required.

**Interview questions:**
- "Show me how your deployment procedures reference and incorporate the provider's instructions for
  use. What happens if a user wants to use the system outside the intended purpose?"
- "Who are the assigned oversight persons for [specific high-risk system]? Show me their training
  records and assignment documentation."
- "What is your process when this AI system produces an unexpected output or incident? How is that
  reported to the provider?"
- "How long do you retain logs from this AI system's operation?"

**Evidence required (from Q-EU-AI-ACT-CH3-014):**
- Deployment procedures that reference provider IFU by name and version
- Human oversight assignment documentation with training completion records
- Monitoring records demonstrating operational oversight
- Serious incident reporting procedure with documented escalation to provider

**Art-27 — Fundamental Rights Impact Assessment (FRIA)**

Art-27 requires deployers to conduct a FRIA before deploying high-risk AI systems in: public
authority contexts, critical infrastructure, education, employment, essential services, or law
enforcement. The FRIA must be notified to the market surveillance authority.

**Interview questions:**
- "Has your organization conducted a Fundamental Rights Impact Assessment for [specific deployment]?
  Show me the completed document."
- "Which fundamental rights did the FRIA assess? How were vulnerable groups addressed?"
- "Has the FRIA been notified to the market surveillance authority? Show me the notification record."
- "How often is the FRIA reviewed? What triggers a new FRIA?"

**Evidence required (from Q-EU-AI-ACT-CH3-015):**
- Completed FRIA documentation for each applicable deployment
- FRIA coverage of fundamental rights impacts including data protection and vulnerable groups
- Market surveillance authority notification records
- FRIA review trigger policy

**Common gap:** Deployers assume the provider's conformity assessment covers their Art-27 obligation.
It does not. The FRIA is the deployer's obligation regardless of what the provider has completed.

---

## 7. Assessment Area 4: Transparency Obligations (Art-50)

**Enforcement date:** Aug 2, 2026. Applies to providers and deployers of specific AI system types.
Penalty tier (Art-99): up to EUR 15M or 3% of worldwide annual turnover.

**Chatbot and AI Interaction Disclosure (Art-50(1)):**
AI systems intended to interact directly with natural persons must inform those persons they are
interacting with an AI, unless obvious from context. The disclosure must occur before or at the
start of interaction.

**Evidence required (from Q-EU-AI-ACT-CH4-001):**
- Disclosure mechanism documentation: UI screenshots, disclosure notice text
- Evidence disclosure is presented before interaction begins
- Exception documentation where AI nature is obvious from context (with documented rationale)

**Deepfake and Synthetic Content Labelling (Art-50(3)–(4)):**
AI systems generating synthetic audio, image, video, or text must label outputs as AI-generated in
machine-readable format. Deepfake content involving real persons must be disclosed.

**Evidence required (from Q-EU-AI-ACT-CH4-002):**
- Technical implementation of machine-readable labelling (C2PA metadata, watermarking, metadata tags)
- Labelling mechanism documentation demonstrating coverage of all synthetic content types
- Exceptions documentation for legitimate purposes (law enforcement, satire, artistic expression)
  with scope and proportionality rationale

**Emotion Recognition and Biometric Categorization Disclosure (Art-50(5)):**
Deployers of emotion recognition systems or biometric categorization systems must inform natural
persons exposed to these systems.

**Evidence required (from Q-EU-AI-ACT-CH4-003):**
- Inventory of all emotion recognition and biometric categorization deployments
- Disclosure notice and delivery mechanism for each deployment
- Evidence disclosure reaches affected persons before or during exposure

**Scoring indicators for Art-50:**

| Status | Description |
|--------|-------------|
| Full | All applicable disclosures implemented; machine-readable labelling in place; disclosure timing documented; exceptions justified |
| Partial | Disclosures present for some deployments but not all; human-readable only (not machine-readable); disclosure timing unclear |
| Not Implemented | No disclosures; no labelling; persons subject to emotion recognition or biometric categorization not informed |

---

## 8. Assessment Area 5: General-Purpose AI Model Obligations (Art-51 Through Art-56)

**Enforcement date:** Aug 2, 2025. Already mandatory for GPAI model providers.

### General Obligations — All GPAI Providers (Art-53)

All GPAI providers (regardless of systemic risk status) must:
- Draw up and maintain technical documentation per Annex XI
- Provide information and documentation to downstream providers integrating the model
- Maintain a policy to comply with copyright and related rights law
- Publish a summary of training data content (sufficiently detailed)

**Interview questions:**
- "Show me the Annex XI technical documentation for [GPAI model]. What does it cover beyond what a
  standard model card would contain?"
- "How is training data copyright compliance ensured? Show me your copyright compliance policy."
- "Where is the training data summary published? What level of detail does it provide?"
- "If a downstream provider is integrating your model, what documentation and information do you
  provide to them to fulfill their own compliance obligations?"

**Evidence required (from Q-EU-AI-ACT-CH5-002):**
- Technical documentation per Annex XI (model architecture, capabilities, limitations, performance
  benchmarks, training data characteristics, compute used)
- Copyright compliance policy document — must be an actual policy, not a statement of intent
- Training data content summary — publicly available or provided to AI Office
- Downstream provider information-sharing records or contractual provisions

### Systemic Risk Obligations — GPAI with Systemic Risk (Art-55)

Providers of GPAI models with systemic risk (>10^25 FLOPs training compute or EC designation) must:
- Perform model evaluations using standardized protocols including adversarial testing
- Assess and mitigate systemic risks including accidents, misuse, and societal-scale impacts
- Report serious incidents to the AI Office within 2 weeks of awareness
- Implement adequate cybersecurity protection

**Interview questions:**
- "Describe your adversarial testing programme for [model]. What standardized protocols do you use?
  What attack categories did you test?"
- "Show me your systemic risk assessment. How did you assess risks beyond individual-user harm — at
  societal or systemic scale?"
- "What is your serious incident reporting procedure for the AI Office? What constitutes a serious
  incident triggering notification?"
- "What cybersecurity measures are specific to protecting this GPAI model, as distinct from general
  infrastructure security?"

**Evidence required (from Q-EU-AI-ACT-CH5-003):**
- Model evaluation records using standardized protocols (reference to specific evaluation suites)
- Adversarial testing records with red team methodology and results
- Systemic risk assessment document covering accidents, misuse scenarios, and societal impacts
- Serious incident reporting procedure with AI Office notification capability and timeframe
- Cybersecurity measures documentation specific to the model

**Art-52 — AI Office Notification:**
If the systemic risk threshold is met or the Commission designates the model, the provider must
notify the AI Office within 2 weeks. Request AI Office notification records. Non-notification is a
compliance gap with penalty exposure under Art-99.

**Art-56 — Codes of Practice:**
The AI Office has facilitated codes of practice. Compliance with an approved code creates a
presumption of conformity. Request code of practice subscription or adherence records (from
Q-EU-AI-ACT-CH5-004). Note: this is a compliance pathway, not a mandatory obligation.

**Common gaps for GPAI assessments:**
- GPAI providers underestimating coverage — assuming only frontier models above the FLOPs threshold
  require documentation. All GPAI models require Art-53 compliance regardless of size.
- Training data summary published at a level of generality that does not satisfy the "sufficiently
  detailed" standard (e.g., "publicly available internet data" with no further description)
- Adversarial testing conducted once at launch and not maintained as an ongoing programme
- Systemic risk assessment focused narrowly on individual misuse scenarios, without addressing
  societal-scale or cumulative impacts

---

## 9. Program-Level Scoring Summary

### AI System Classification Register

| AI System | Role (Provider/Deployer/Both) | Risk Classification | Applicable Articles | In-Scope for This Assessment | Classification Date |
|-----------|------------------------------|--------------------|--------------------|-----------------------------|--------------------|
| | | | | | |
| | | | | | |

### Gap Register

| Finding ID | Article | Article Title | Requirement | Finding | Severity | Enforcement Date | Remediation Owner | Target Date | Status |
|-----------|---------|--------------|------------|---------|----------|-----------------|-------------------|-------------|--------|
| EU-[YEAR]-001 | Art-5 | | | | | 2025-02-02 | | | |
| EU-[YEAR]-002 | Art-9 | | | | | 2026-08-02 | | | |

**Severity Definitions:**

| Severity | Description | Remediation Requirement |
|----------|-------------|------------------------|
| Critical | Mandatory obligation already enforceable; ongoing violation or prohibited practice in use | Immediate — before assessment close or within 30 days |
| High | Mandatory obligation not implemented or substantially incomplete; enforceable within next enforcement period | Before applicable enforcement date |
| Medium | Obligation partially implemented with documented gaps; processes exist but not operationalized | 30–90 days |
| Low | Documentation gaps, minor inconsistencies, or recommended improvements beyond minimum requirements | 90–180 days |

### Enforcement Timeline Gap Prioritization

Group all gaps by enforcement date to produce a legally-sequenced remediation plan:

**Already Enforceable (Feb 2, 2025) — Art-5 Gaps:**
List all Art-5 gaps here. These require immediate attention — penalties are already possible.

**Already Enforceable (Aug 2, 2025) — Art-51–56 and Art-99 Gaps:**
List all GPAI and penalty awareness gaps here.

**Enforceable Aug 2, 2026 — Art-6–27, Art-50, Art-72 Gaps:**
List all high-risk AI requirements, transparency, and post-market monitoring gaps. Remediation must
complete before Aug 2026.

**Enforceable Aug 2, 2027 — Art-6(1) / Annex I Product Gaps:**
List gaps specific to AI in regulated product safety components.

### Penalty Exposure Summary

Under Art-99, maximum penalties by violation type:

| Violation Type | Maximum Penalty |
|---------------|-----------------|
| Art-5 prohibited practices | EUR 35,000,000 or 7% worldwide annual turnover (whichever higher) |
| Art-10 (data governance), Art-13 (transparency to deployers), Art-15 (accuracy/robustness), Art-50 (transparency to users) | EUR 15,000,000 or 3% worldwide annual turnover |
| Supplying incorrect/misleading information to authorities | EUR 7,500,000 or 1% worldwide annual turnover |

Include an assessment-specific penalty exposure note in the report identifying which findings, if
unresolved, create the highest fine exposure. This is not a legal opinion — it is a compliance
prioritization tool.

---

## 10. Common Findings by Chapter

### Art-5 — Prohibited Practices
- AI system inventory does not exist or is incomplete; no determination of prohibited practice
  status can be made for undocumented systems
- Art-5 review was performed at framework launch and has not been applied to new AI systems
  procured or built since
- Emotion recognition systems deployed in HR or educational contexts with no Art-5 assessment
- Real-time biometric identification in semi-public spaces (building entrances, events) not
  assessed against Art-5(1)(h) exception requirements

### Art-6 — Classification
- No formal classification assessment performed; systems classified informally or not at all
- Art-6(3) self-exclusion asserted without documented rationale — organizations asserting
  non-high-risk status for Annex III systems without substantiating that position
- Classification performed once at initial deployment; not reassessed when system use case
  expanded or modified

### Art-9 — Risk Management
- Risk management documentation exists as a standalone document not connected to the AI
  development or deployment lifecycle — risks are not assessed at design, modification, or
  operational events
- Risk register created once and not updated; does not reflect operational experience or
  post-market monitoring data
- Residual risk acceptance undocumented; no authority has formally accepted residual risks

### Art-10 — Data Governance
- Training data described generically without specific representativeness assessment for the
  intended deployment population
- Bias assessment performed as a single event at training time with no ongoing monitoring
- Data provenance undocumented; inability to demonstrate data governance to a competent authority

### Art-11 — Technical Documentation
- Technical documentation prepared after deployment rather than before — documentation cannot
  demonstrate pre-deployment compliance
- Documentation not updated following substantial modifications; version control absent
- Documentation exists but does not cover all Annex IV elements — most commonly missing:
  performance metrics, known limitations, and human oversight specifications

### Art-14 — Human Oversight
- Oversight documented in policy only; no operational mechanism for oversight persons to
  understand real-time system behavior or override outputs
- Oversight persons assigned but not trained on the specific AI system's capabilities,
  limitations, and failure modes
- Automation bias not addressed; oversight persons routinely approve AI recommendations without
  independent evaluation — effectively no functional oversight despite formal assignment

### Art-26 — Deployer Obligations
- Deployers assume the provider's conformity assessment covers their own obligations under Art-26
  and Art-27 — it does not
- No monitoring of AI system operation; incidents reported to providers only when operationally
  disruptive, not systematically
- FRIA not conducted for high-risk AI deployments in covered contexts (public authority, education,
  employment, law enforcement)

### Art-50 — Transparency
- Chatbot disclosure present on product page or in terms of service, but not displayed at the
  point of user interaction
- AI-generated content labelled for human readers but not in machine-readable format — C2PA or
  equivalent metadata absent

### Art-51–56 — GPAI
- GPAI providers not applying Art-53 to models below the systemic risk threshold, incorrectly
  assuming only frontier models are covered
- Training data summaries published at a level of generality insufficient to satisfy Art-53
- Systemic risk assessment conducted at model launch; not maintained as adversarial testing
  produces new findings or model capabilities expand

---

## 11. Assessment Report Format

### Finding Documentation Format

```
Finding ID: EU-[YEAR]-[SEQUENCE]
Severity: [Critical | High | Medium | Low]
Article: [e.g., Art-9(1)]
Enforcement Date: [Date applicable obligation became or becomes mandatory]
Role: [Provider obligation | Deployer obligation | Both]

Description:
[Factual statement of what was observed — what exists vs. what Art-X requires]

Evidence Reviewed:
[Documents reviewed, interviews conducted, and system demonstrations observed
that support this finding]

Compliance Standard:
[The specific article text or requirement that is not being met, cited precisely]

Penalty Exposure (if Critical or High):
[Reference to Art-99 penalty tier applicable to this violation]

Recommended Remediation:
[Specific actions to bring into compliance, with suggested sequencing]

Remediation Effort: [Quick (days) | Standard (weeks) | Extended (months)]
Remediation Owner: [Role]
Target Date: [Date by which remediation should complete, relative to enforcement date]
```

### Executive Summary Structure

The executive summary must address five elements:

1. **Classification results:** Summary of the AI system classification register — how many systems,
   what tiers, and whether any prohibited practices were identified.

2. **Overall compliance posture:** A concise characterization of where the organization stands
   against each enforcement date. Use the enforcement date grouping rather than an aggregate score —
   a single score obscures the legally meaningful structure of phased enforcement.

3. **Top gaps by enforcement date:** The most material gaps in each enforcement window, not more
   than three to five per window. Frame against the specific enforcement date and penalty tier.

4. **Provider vs. deployer clarity:** Whether the organization understands and has separately
   addressed its obligations in each role for each AI system.

5. **Immediate actions required:** Any Critical findings that require action before or shortly
   after assessment close.

### Report Section Outline

1. **Executive Summary** (1–2 pages): Classification results, compliance posture by enforcement date,
   top gaps, immediate actions

2. **Scope and Methodology:** AI systems assessed, assessment dates, stakeholders interviewed,
   roles evaluated, exclusions and limitations

3. **Classification Register:** All AI systems with tier determination, rationale, applicable
   articles, and whether Art-6(3) self-exclusion was invoked

4. **Per-Article Findings:** Article, requirement, finding, evidence reviewed, severity,
   enforcement date, recommendation — organized by chapter

5. **Gap Register:** Table format — all findings with severity, enforcement date, owner, target date

6. **Enforcement Timeline Gap Prioritization:** Findings grouped by enforcement date for
   legally-sequenced remediation

7. **Penalty Exposure Assessment:** Findings cross-referenced to Art-99 penalty tiers

8. **Appendices:**
   - Appendix A: Evidence index
   - Appendix B: Classification worksheets (one per AI system)
   - Appendix C: Art-5 prohibited practices review records
   - Appendix D: Stakeholders interviewed and documents reviewed

---

**Version:** 1.0
**Last Updated:** 2026-02-25
**Regulation:** EU 2024/1689 (EU AI Act)
**Source References:** Regulation (EU) 2024/1689, OJ L 2024/1689, 12.7.2024
