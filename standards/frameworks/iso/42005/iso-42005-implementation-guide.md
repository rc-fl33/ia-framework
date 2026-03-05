---
type: guide
name: iso-42005-implementation-guide
category: compliance
classification: private
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42005:2025 — AI System Impact Assessment"
---

# ISO/IEC 42005:2025 — Implementation Guide: How to Conduct an AI System Impact Assessment

**Purpose:** Step-by-step guide for practitioners conducting AI system impact assessments
per ISO/IEC 42005:2025 methodology.

---

## Prerequisites

Before conducting an individual AI system impact assessment, the organization should have:

1. A documented impact assessment process (ISO 42005 Clause 5) — this guide assumes the process
   is established. See the handbook for process setup guidance.
2. Defined sensitive use and restricted use thresholds (Clause 5.7)
3. An assigned assessment team (Clause 5.6)
4. Completed system documentation (required as inputs to the assessment)

---

## Phase 1: Scope and Planning

### Step 1.1 — Define Assessment Scope

**Objective:** Establish what is being assessed and the boundaries of the assessment.

**Activities:**
1. Identify the AI system (or component) subject to assessment
2. Determine assessment life cycle stage (design / pre-deployment / change-triggered / periodic review)
3. Define geographic scope (which jurisdictions' users/affected parties are covered)
4. Define interested party scope (which groups are included in the assessment)
5. Document scope rationale — why these boundaries are appropriate

**Output:** Scope statement (feeds into Section 6.2 of the assessment document)

**Common scope decisions:**
- Whole AI system vs. a specific component or module
- Specific deployment region vs. all regions
- All intended uses vs. specific use cases being launched
- Current capabilities vs. planned future capabilities

### Step 1.2 — Assemble Assessment Team

**Objective:** Confirm the right expertise is on the team.

**Recommended team composition:**
- **Assessment lead:** Responsible for methodology and overall assessment quality
- **Technical lead:** Deep knowledge of the AI system (engineering/data science)
- **Legal/compliance advisor:** Applicable law, regulatory requirements
- **Privacy lead:** Privacy-specific impact analysis
- **Domain expert:** Subject matter knowledge for the deployment context (e.g., healthcare domain expert for medical AI)
- **Ethics advisor:** Fairness, accountability, and societal impact analysis

For deployers of third-party AI systems: the technical lead role may need to rely on vendor-provided
documentation rather than direct system knowledge. Document what information is available and what
is unavailable from the third party.

### Step 1.3 — Gather Input Documentation

**Objective:** Collect source documents needed to conduct the assessment.

**Required inputs:**
- [ ] AI system architecture documentation
- [ ] Model card or system card (if available)
- [ ] Intended use documentation
- [ ] Data governance documentation (datasets used, lineage, quality)
- [ ] Deployment environment specification (geography, platform, infrastructure)
- [ ] Prior risk assessments for this AI system
- [ ] Prior impact assessments (if reassessment)
- [ ] Applicable legal requirements (jurisdiction-specific)
- [ ] Organizational AI policy and ethics framework

**For third-party AI systems:** Request from vendor their model card, system card, data cards,
and any available impact assessments. Document what was provided and what was not available.

---

## Phase 2: AI System Information Documentation

Complete Section 6.3-6.6 of the assessment document.

### Step 2.1 — Document AI System Description (6.3.1)

Write a basic description of what the AI system does and at a high level, how it works.
Include: architecture overview, what inputs the system takes, what outputs it produces,
what decisions or actions the outputs drive.

**Practitioners tip:** Write this for a non-technical reviewer who needs to understand the system
to evaluate its impacts. Avoid jargon. Include diagrams if helpful.

### Step 2.2 — Document Functionalities and Capabilities (6.3.2)

List specific features and capabilities — current and planned. Include:
- Prediction types (classification, regression, generation, recommendation)
- Interaction modality (user-facing UI, API, batch processing, automated decision)
- Hardware and infrastructure dependencies
- Alert and threshold behavior

### Step 2.3 — Document System Purpose (6.3.3)

Describe WHY the organization is building or using this AI system:
- Who is the intended end user or customer
- What user need or organizational objective it serves
- What the value proposition is
- Any trade-offs made in system design in relation to this purpose

### Step 2.4 — Document Intended Uses (6.3.4)

List all specific use cases for which the AI system is designed:
- What the system is designed to do for specific user groups
- Where and when users can use the system
- Any temporal or contextual limitations on intended use

**Format tip:** Create a table: Use case name | Description | User group | Constraints

### Step 2.5 — Document Unintended Uses (6.3.5)

Identify reasonably foreseeable misuses:
- Deliberate misuse by malicious actors (e.g., using a hiring AI to discriminate)
- Accidental misuse (e.g., applying a clinical decision support tool outside its validated scope)
- Use in contexts the system was not designed for

For each identified misuse: describe the misuse scenario and why it is reasonably foreseeable.

### Step 2.6 — Document Data Information and Quality (6.4)

Complete for each dataset (training, validation, testing, production):

| Field | Document |
|-------|----------|
| Dataset name and version | Identifier for reference |
| Owner | Who controls this dataset |
| Contents | What data is in this dataset |
| Temporal scope | What time period does the data cover |
| Geographic scope | What regions/populations does it represent |
| Access rights | How is access controlled |
| Demographic representation | Do training populations reflect deployment populations? |
| Known quality issues | Missing data, measurement errors, historical biases |
| Quality criteria met | Which ISO/IEC 5259 or similar quality criteria apply and are met |
| Plans for unmet criteria | How will unmet criteria be addressed |

### Step 2.7 — Document Algorithm and Model Information (6.5)

For algorithms developed by the organization:
- Source and validity of the algorithm (scientific papers, established methods)
- Real-world performance evidence
- Known limitations and failure modes
- Development documentation (applicable requirements, approval records)

For models developed by or for the organization:
- Training, validation, and testing data used
- Training methodology
- Criteria for model selection among alternatives
- Performance metrics (accuracy, precision, recall, fairness metrics)
- Model limitations and out-of-distribution behavior

**For third-party models:** Document what information was available from the vendor and note gaps.

### Step 2.8 — Document Deployment Environment (6.6)

Geographic scope:
- Countries/regions of current and planned deployment
- Language requirements
- Jurisdiction-specific legal requirements

Technical environment:
- Cloud vs. on-premise vs. edge deployment
- Platform (web, mobile, API, embedded)
- Hardware dependencies
- Open source components and their governance
- Third-party service dependencies

---

## Phase 3: Interested Party Identification

Complete Section 6.7 of the assessment document.

### Step 3.1 — Identify Directly Affected Parties

**Definition:** Individuals or groups who can be affected by the AI system — whether or not
they interact with it directly.

**Identification methodology:**
1. Start with direct users (who interacts with the AI system?)
2. Identify those subject to AI decisions (who is affected by the AI's outputs?)
3. Identify vulnerable populations (children, elderly, persons with disabilities, marginalized groups)
4. Identify workers whose work is affected by the AI system
5. Identify data subjects whose data is used in the AI system

For each interested party:
- Define the group (who they are)
- Describe their relationship to the AI system
- Identify any vulnerability characteristics that heighten impact risk

### Step 3.2 — Identify Other Relevant Interested Parties

**Definition:** Parties who have a relationship to the AI system but are not necessarily
directly impacted by it.

Examples:
- AI producers (if deploying third-party AI)
- Regulatory authorities with oversight of the AI's domain
- Professional associations setting standards for the domain
- Civil society organizations advocating for affected groups

These parties are relevant to understanding the context and obligations but may not need
individual impact analysis.

---

## Phase 4: Impact Analysis

The core of the assessment — complete Section 6.8.

### Step 4.1 — For Each Interested Party, Analyze Benefits and Harms

Create an impact matrix: rows = interested party groups, columns = impact dimensions.

**Impact dimensions to analyze:**

| Dimension | Key questions to ask |
|-----------|---------------------|
| Accountability | Does the AI system affect who is accountable for decisions? Does it create accountability gaps? |
| Transparency | Do affected parties know the AI system exists and how it works? |
| Fairness/Discrimination | Does the AI system produce different outcomes for different demographic groups? |
| Privacy | Does the AI system use, infer, or expose personal information? |
| Reliability | What happens to affected parties when the AI system produces incorrect outputs? |
| Safety | Could AI system failures cause physical harm to health, safety, or property? |
| Explainability | Can affected parties understand why the AI system produced a particular output? |
| Environmental impact | What are the environmental resource consumption and benefit implications? |

**For each cell in the matrix:**
1. Identify specific benefits for this party on this dimension
2. Identify specific harms for this party on this dimension
3. Rate significance using the organization's defined impact scale
4. Note whether the impact is current (known) or reasonably foreseeable (anticipated)

**Practitioners tip:** Use the Harms and Benefits taxonomy in ISO 42005 Annex C as a starting
checklist. The taxonomy provides example harms and benefits for each impact dimension.

### Step 4.2 — Analyze AI System Failure Impacts (6.8.3.2)

For each identified interested party: what are the impacts if the AI system fails?

Types of failures to consider:
- Incorrect predictions or classifications
- System unavailability
- Unexpected behavior outside training distribution
- Component failures (model, data pipeline, infrastructure)
- Human errors in operation

For each failure type: identify consequences for interested parties and rate significance.

### Step 4.3 — Analyze Reasonably Foreseeable Misuse Impacts (6.8.3.3)

For each identified misuse scenario (from Step 2.5):
- Which interested parties would be harmed?
- What is the nature and severity of harm?
- Could the harm benefit malicious actors — and how likely is this?

---

## Phase 5: Results Analysis and Treatment

### Step 5.1 — Analyze Results Against Thresholds (Clause 5.9)

Review the completed impact matrix:
1. Identify all harms rated at or above the organization's significance threshold
2. Flag any sensitive use indicators triggered
3. Flag any restricted use findings
4. Determine whether the aggregate impact profile triggers escalation

### Step 5.2 — Develop Treatment Measures (6.9)

For each significant harm identified, develop treatment proposals:

**Technical measures:**
- Fairness interventions (data rebalancing, fairness constraints, post-processing)
- Privacy enhancements (differential privacy, output filtering, data minimization)
- Safety controls (human oversight mechanisms, kill switches, uncertainty quantification)
- Explainability improvements (explanation APIs, model simplification, documentation)
- Performance improvements (more representative training data, better evaluation)

**Management measures:**
- Policy changes (prohibited use policies, expanded acceptable use criteria)
- Governance enhancements (AI ethics review board, stakeholder advisory panel)
- Transparency measures (public model cards, impact assessment summaries)
- Monitoring programs (production bias monitoring, fairness metric tracking)
- Remediation commitments (affected party notification, redress mechanisms)

For each measure: specify what it is, who implements it, and by when.

### Step 5.3 — Approval

Route the completed assessment through the organization's defined approval process:
1. Internal review by legal, privacy, and ethics advisors
2. Escalation if thresholds exceeded
3. Final approval by defined approver with authority for this risk level
4. Document approval with approver name, date, and any conditions

---

## Phase 6: Recording and Reporting

### Step 6.1 — Finalize Assessment Document

Ensure the assessment document contains all required sections (Clauses 6.2 through 6.9).
Apply the organization's document control procedures (version number, date, review date).

### Step 6.2 — Internal Reporting

Distribute findings to:
- AI development team (for technical measure implementation)
- Risk management team (to incorporate into risk register)
- Legal/compliance team (for regulatory filing if required)
- Governance bodies (ethics board, risk committee) as required by escalation policy

### Step 6.3 — External Reporting (where required)

Consider whether:
- Regulatory reporting is required (EU AI Act, national AI regulations)
- Contractual disclosure to customers is required
- Public summary is appropriate for voluntary transparency

---

## Phase 7: Monitoring and Review

### Step 7.1 — Establish Monitoring

After deployment, implement monitoring to detect whether:
- Identified impacts are materializing as expected (or worse)
- Treatment measures are effective
- New impacts are emerging that were not anticipated

Monitoring mechanisms (proportionate to AI system risk level):
- Production performance metrics (accuracy, fairness metrics, error rates)
- User feedback collection and analysis
- Complaint and incident tracking
- Periodic review of news/research on similar AI systems
- Regulatory guidance monitoring

### Step 7.2 — Trigger Reassessment When Required

Reassess when:
- Significant technical changes to the AI system
- New intended uses added
- New deployment geographies
- Discovery of material harms in production
- Relevant regulatory changes
- Scheduled periodic review date reached

When reassessing: determine whether to update the existing assessment or conduct a new assessment.
Document the decision and rationale.

---

## Coordination with Other Assessments

Per ISO 42005 Annex D, coordinate with:

| Assessment | Coordination approach |
|------------|----------------------|
| Privacy Impact Assessment | Share interested party identification; coordinate on privacy findings; avoid duplicate interviews |
| Human Rights Impact Assessment | Align stakeholder consultation; reference HRIA methodology for rights impacts |
| Risk Assessment (ISO 23894) | Feed impact findings directly into risk register as threats to individuals |
| Business Impact Assessment | Align organizational risk treatment decisions with impact assessment findings |
| Security Impact Assessment | Share technical threat analysis; coordinate on security/safety overlap |

Use Annex D's "mapping guide" approach: create a coordination matrix showing which existing
assessments contain inputs relevant to the AI system impact assessment.

---

## Document Template

Use ISO 42005 Annex E as the template for your completed assessment documents. The template
provides structured tables for each Clause 6 element. Customize as needed for organizational
context but retain coverage of all substantive elements.

---

## Common Mistakes

1. **Skipping unintended use analysis** — The most important harms often come from misuse, not intended use.

2. **Analyzing only users** — Interested parties include those who are subject to AI decisions
   without choosing to interact with the system.

3. **One-time assessment, no monitoring** — A pre-deployment assessment that is never revisited
   provides false assurance as the deployment context evolves.

4. **Treatment measures not implemented** — Document treatment measures AND track whether they
   were actually implemented.

5. **Scope too narrow** — An assessment scoped to avoid the hard questions (e.g., excluding
   vulnerable populations from interested party analysis) does not fulfill the assessment's purpose.

6. **Not integrating with design** — Impact assessment findings should arrive early enough in the
   development process to actually influence design decisions.
