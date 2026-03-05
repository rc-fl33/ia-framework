---
type: reference
name: iso-42005-test-playbook
category: compliance
classification: private
version: 2.0
last_updated: "2026-02-23"
framework: "ISO/IEC 42005:2025"
---

# ISO/IEC 42005:2025 Test Playbook

Executable test cases for evaluating an organization's AI system impact assessment (AI SIAS)
program against ISO/IEC 42005:2025. The standard provides guidance (uses "should" language)
on how organizations should conduct impact assessments for AI systems. These test cases apply
when evaluating ISO 42001 Clause A.5 conformance, conducting standalone impact assessment
maturity reviews, or preparing for regulatory due diligence where AI impact assessment
methodology must be demonstrated.

**Related:** `iso-42005-assessor-playbook.md` (interview guides and scoring), `iso-42005-handbook.md` (framework overview)

---

## How to Use This Playbook

Execute test cases in clause order. Each test case is self-contained. Mark each as:
- **PASS:** All pass criteria met, evidence collected
- **PARTIAL:** Some criteria met; specify which criteria failed
- **FAIL:** Pass criteria not met; document gap indicators observed

Total test cases: **14** covering Clauses 5 (process) and 6 (documentation requirements).

**Important:** ISO 42005 uses "should" (guidance) not "shall" (requirement). This playbook
evaluates alignment with the guidance. Where ISO 42001 A.5 is in scope, non-alignment
with ISO 42005 guidance may constitute a nonconformity against ISO 42001.

---

## Clause 5: AI System Impact Assessment Process

---

### TC-42005-001: Organizational Context Establishment

**Control Reference:** ISO/IEC 42005:2025 Clause 5.2 — Establishing the context
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that before conducting any AI SIAS, the organization has established and documented
the organizational context in which the AI system operates, including the organization's
objectives, applicable legal requirements, and the policies governing AI use.

**Prerequisites:**
- Access to AI SIAS documentation for at least one completed assessment
- Organizational AI governance documentation

**Test Steps:**
1. Request the AI SIAS documentation package for the organization's highest-risk AI system.
2. Locate the context section of the SIAS. Verify it documents: the organization's overall
   objectives relevant to the AI system, applicable legal and regulatory requirements
   (jurisdiction-specific), and the organization's own policies that apply to the AI system.
3. Verify the context identifies the specific deployment environment of the AI system
   (e.g., internal tool, customer-facing, safety-critical sector).
4. Ask the assessment lead: "What external factors — regulatory, competitive, societal —
   did you consider when scoping this assessment?" Assess whether the answer aligns with
   what is documented.
5. Verify the context section was completed before impact identification began (check
   document revision history or dated sections).

**Pass Criteria:**
- SIAS context section exists and is populated (not left as template placeholder text)
- Legal and regulatory requirements applicable to the AI system are named specifically
- Organizational objectives relevant to the AI system are documented
- Deployment environment is described with sufficient specificity to guide impact identification

**Expected Evidence:**
- AI SIAS document with completed context section (Clause 5.2 content)
- Referenced policy documents named in the context section

**Common Failures:**
- Context section is a generic description of the organization rather than the specific
  AI system's operating context
- Legal requirements listed as "GDPR, local laws" without identifying which specific
  obligations apply to this AI system

---

### TC-42005-002: AI System Identification and Description

**Control Reference:** ISO/IEC 42005:2025 Clause 5.3 — Identifying the AI system
**Test Type:** Document Review | Technical Interview
**Assessor:** Lead Assessor | Technical Assessor

**Objective:**
Verify that the SIAS contains a sufficiently detailed description of the AI system —
including its intended purpose, technical approach, data inputs, and operational parameters —
to support meaningful impact analysis.

**Prerequisites:**
- AI SIAS documentation
- Technical system documentation for the AI system under assessment

**Test Steps:**
1. Locate the AI system description section in the SIAS.
2. Verify the description covers: the AI system's intended purpose and use cases, the type
   of AI/ML approach used (e.g., classification, generative, recommendation), the data
   inputs the system processes, the outputs the system produces, and the decisions or
   actions the outputs are intended to support.
3. Verify the description identifies any foreseeable uses beyond the primary intended
   purpose (Clause 5.3 requires considering reasonably foreseeable uses).
4. Compare the SIAS system description against the technical system documentation — are
   there capabilities in the technical docs that are absent from the SIAS description?
5. Ask the technical assessor: "Are there any capabilities or data types this system uses
   that are not described in the SIAS?"

**Pass Criteria:**
- System description includes intended purpose, AI approach, data inputs, and outputs
- Reasonably foreseeable uses beyond primary purpose are identified
- Description is specific enough that an assessor with no prior knowledge of the system
  could understand what it does and who it affects
- No material capabilities are absent from the description (per technical comparison)

**Expected Evidence:**
- AI SIAS system description section
- Technical system documentation used as input to the description

**Common Failures:**
- System description is a marketing-level summary ("AI-powered recommendation engine")
  without technical specificity sufficient for impact analysis
- Foreseeable misuse or edge-case use not considered — only ideal-case operation described

---

### TC-42005-003: Stakeholder and Affected Party Identification

**Control Reference:** ISO/IEC 42005:2025 Clause 5.4 — Identifying stakeholders and affected parties
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that the SIAS identifies all categories of stakeholders and affected parties —
including those not directly using the system — and that the identification process was
systematic rather than ad hoc.

**Prerequisites:**
- AI SIAS documentation
- Access to assessment team members who conducted the stakeholder identification

**Test Steps:**
1. Locate the stakeholder and affected party identification section in the SIAS.
2. Verify identification includes at minimum: (a) direct users of the AI system,
   (b) individuals whose data is processed by the AI system, (c) individuals whose
   lives or rights are affected by AI system outputs even without direct interaction,
   (d) organizational stakeholders (deploying organization, developers, operators).
3. Check for identification of vulnerable groups: does the assessment explicitly consider
   whether any affected parties are members of groups that may be disproportionately
   impacted (children, elderly, disabled persons, minority groups)?
4. Ask the assessment team: "Who identified the stakeholder list? What process was used?
   Were any groups specifically included because of known or foreseeable risk to them?"
5. Verify that affected parties who have no direct relationship with the deploying
   organization are included — not only registered users or customers.

**Pass Criteria:**
- Stakeholder list includes at minimum direct users, data subjects, and third-party
  affected individuals
- Vulnerable groups are explicitly considered with documented rationale if excluded
- Identification process is documented (not just a list with no supporting rationale)
- Affected parties without direct organizational relationship are included where applicable

**Expected Evidence:**
- Stakeholder and affected party section of the SIAS
- Any workshop records, consultation logs, or structured process documentation used
  to identify affected parties

**Common Failures:**
- Only registered users identified — indirect affected parties (e.g., individuals profiled
  by an AI system they never interact with) omitted
- No consideration of vulnerable or marginalized groups in affected party identification

---

### TC-42005-004: Scope Definition and Boundaries

**Control Reference:** ISO/IEC 42005:2025 Clause 5.5 — Determining the scope of the AI system impact assessment
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that the scope of the SIAS is explicitly defined, that any exclusions are documented
with justification, and that the scope is sufficiently broad to cover the AI system's
foreseeable impacts.

**Prerequisites:**
- AI SIAS documentation

**Test Steps:**
1. Locate the scope section of the SIAS.
2. Verify the scope explicitly states: what AI system components are included, which
   stakeholder groups are within scope, which impact dimensions are assessed (and which
   are explicitly excluded with justification), and the time horizon considered.
3. Check whether any impact dimensions from Clause 5.6 (or Annex A) have been excluded.
   If excluded, verify documented justification exists ("not applicable because...").
4. Verify the scope covers the full deployment lifecycle — not only the initial deployment
   event but ongoing operation.
5. Assess whether the scope is proportionate to the risk level of the AI system:
   a high-risk consumer AI system scoped to only "immediate user experience impacts"
   is a red flag.

**Pass Criteria:**
- Scope section explicitly documents what is and is not included
- Exclusions of impact dimensions are documented with specific justification
- Time horizon for assessment is stated
- Scope is proportionate to the AI system's risk profile

**Expected Evidence:**
- SIAS scope section with explicit inclusions and documented exclusions

**Common Failures:**
- Scope defined so narrowly that obvious impacts are outside assessment boundaries
- No justification for excluded impact dimensions — simply omitted without documentation

---

### TC-42005-005: Impact Dimension Selection

**Control Reference:** ISO/IEC 42005:2025 Clause 5.6 — Selecting impact dimensions
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that the organization selected impact dimensions appropriate to the AI system,
with documented rationale for the selection, and that the selection reflects the actual
potential impacts of the system rather than a default template.

**Prerequisites:**
- AI SIAS documentation
- Annex A of ISO/IEC 42005:2025 (impact dimension examples)

**Test Steps:**
1. Locate the impact dimension selection section of the SIAS.
2. Identify which impact dimensions were selected. Cross-reference against Annex A
   categories: individual rights and freedoms, health and safety, financial and economic,
   social and community, psychological and cognitive, access to services,
   environmental, political and governance impacts.
3. For any Annex A dimension that was not selected, verify the SIAS documents why it
   was not applicable to this specific AI system.
4. Ask the assessment lead: "How did you decide which impact dimensions to assess? Were
   any dimensions discussed and then excluded?" Assess whether the selection reflects
   genuine analysis or a default template.
5. Verify sub-dimensions within selected categories are specified — not just top-level
   category names.

**Pass Criteria:**
- Selected impact dimensions are documented with explicit selection rationale
- Excluded Annex A dimensions have documented justification
- Sub-dimensions within each selected category are identified
- Selection reflects the specific characteristics of the AI system (not identical to
  assessments for different AI systems)

**Expected Evidence:**
- SIAS impact dimension section showing selected dimensions with rationale
- Evidence that Annex A was reviewed as a reference source

**Common Failures:**
- Same impact dimensions selected for all AI systems regardless of their actual risk profile
- Annex A dimensions like "political and governance impacts" omitted without justification
  for systems that may affect democratic participation or public opinion

---

### TC-42005-006: Impact Identification Process

**Control Reference:** ISO/IEC 42005:2025 Clause 5.7 — Identifying potential impacts
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that impact identification was systematic, considered both positive and negative
impacts, and involved appropriate methods to surface non-obvious impacts.

**Prerequisites:**
- AI SIAS documentation
- Records of the impact identification process (workshop notes, structured elicitation records)

**Test Steps:**
1. Locate the impact identification section of the SIAS.
2. Verify both positive and negative potential impacts are identified — the standard
   requires considering both beneficial and harmful impacts.
3. Verify identification covered direct impacts (immediate effects of AI system outputs)
   and indirect impacts (downstream effects mediated by human or organizational responses
   to AI outputs).
4. Request the records of how impact identification was conducted: structured workshops,
   expert elicitation, literature review, analogous system analysis, or other documented
   method.
5. Verify the identification process involved people beyond the AI development team —
   did subject matter experts, affected community representatives, or domain specialists
   participate?
6. Check that cumulative and systemic impacts were considered — not only isolated
   individual impacts.

**Pass Criteria:**
- Both positive and negative impacts are identified
- Direct and indirect impacts are distinguished
- Identification method is documented (not just a list with no supporting process)
- Perspectives beyond the AI development team are represented in the identification process
- Cumulative or systemic impacts addressed for high-risk AI systems

**Expected Evidence:**
- SIAS impact identification section showing identified impacts per dimension
- Workshop records, consultation logs, or other identification process documentation

**Common Failures:**
- Impact identification is entirely internal to the AI team with no external perspective
- Only negative impacts considered — benefits and positive impacts ignored
- Direct impacts well-documented but indirect or second-order impacts absent

---

### TC-42005-007: Impact Analysis — Likelihood and Severity

**Control Reference:** ISO/IEC 42005:2025 Clause 5.8 — Analyzing potential impacts
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor | Technical Assessor

**Objective:**
Verify that each identified impact has been analyzed for likelihood and severity using
a documented, repeatable methodology, and that the analysis is substantive rather than
a uniform low-risk default.

**Prerequisites:**
- AI SIAS documentation with identified impacts
- Impact analysis methodology documentation

**Test Steps:**
1. Locate the impact analysis section or methodology documentation.
2. Verify the analysis methodology defines: how likelihood is determined (qualitative
   levels or quantitative estimate), how severity is determined (scale definition),
   and how these combine into an overall impact rating.
3. Select three identified impacts from the SIAS. For each, verify:
   - A likelihood rating is assigned with documented justification
   - A severity rating is assigned with documented justification
   - The ratings are differentiated (not all the same level)
4. Verify the analysis considers both the probability that the impact will occur and
   the magnitude of harm if it does occur.
5. Ask the assessment team: "For [specific impact], why was the likelihood rated [X]?
   What evidence or reasoning supports that rating?" Assess substantiveness of the answer.
6. Check whether analysis accounts for differential impact across affected party groups —
   does the analysis consider that the same impact may be more severe for vulnerable groups?

**Pass Criteria:**
- Analysis methodology documents likelihood scale, severity scale, and rating combination method
- Each identified impact has differentiated likelihood and severity ratings with documented
  justification
- Ratings are not uniformly "low" across all impacts without supporting analysis
- Differential impact across stakeholder groups is addressed for high-risk AI systems

**Expected Evidence:**
- Impact analysis methodology documentation
- SIAS impact analysis section with rated impacts and justifications

**Common Failures:**
- All impacts rated "low likelihood / low severity" without analysis — rubber-stamp assessment
- Analysis methodology undefined — ratings exist in the SIAS but no methodology explains
  how they were determined
- Severity rating considers only a single affected person's harm — does not consider
  population-scale harms for widely deployed systems

---

### TC-42005-008: Impact Evaluation Against Criteria

**Control Reference:** ISO/IEC 42005:2025 Clause 5.9 — Evaluating potential impacts
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that the organization has established impact evaluation criteria and applied them
to determine which impacts are acceptable, which require treatment, and which may warrant
discontinuation of the AI system.

**Prerequisites:**
- AI SIAS documentation
- Impact evaluation criteria documentation

**Test Steps:**
1. Request the organization's impact evaluation criteria — the thresholds that define
   what constitutes an acceptable versus unacceptable impact.
2. Verify evaluation criteria are pre-defined (not created after impact analysis to
   rationalize conclusions).
3. For each analyzed impact, verify an evaluation decision is documented: acceptable
   (with rationale), requires treatment, or unacceptable.
4. Verify that evaluation criteria account for reversibility — impacts that are irreversible
   or difficult to reverse should be evaluated with greater stringency per Clause 5.9.
5. Verify the evaluation identifies which impacts, if unresolved, would constitute a
   reason not to deploy or continue operating the AI system.
6. Check whether any impacts were evaluated as unacceptable — if all impacts are
   "acceptable" or "requires minor treatment," assess whether the evaluation criteria
   are set appropriately or whether the assessment is under-reporting risk.

**Pass Criteria:**
- Impact evaluation criteria are documented and pre-defined
- Each analyzed impact has a documented evaluation decision with rationale
- Reversibility is explicitly considered in the evaluation
- The evaluation produces a differentiated output (not all impacts "acceptable")

**Expected Evidence:**
- Impact evaluation criteria documentation
- SIAS evaluation section showing evaluation decisions per impact

**Common Failures:**
- Evaluation criteria not documented — assessors applied personal judgment without defined thresholds
- All impacts evaluated as acceptable or requiring only minor treatment — no evidence of
  genuine risk evaluation
- Reversibility not addressed despite some impacts being difficult or impossible to reverse

---

### TC-42005-009: Impact Treatment Planning

**Control Reference:** ISO/IEC 42005:2025 Clause 5.10 — Determining impact treatment
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that all impacts requiring treatment have documented treatment plans with specific
measures, assigned owners, and timelines, and that treatment selection rationale is recorded.

**Prerequisites:**
- AI SIAS documentation with evaluation decisions
- Impact treatment records

**Test Steps:**
1. Identify all impacts in the SIAS that were evaluated as requiring treatment.
2. For each impact requiring treatment, verify a treatment option is documented:
   modify the AI system (technical control), implement procedural safeguards,
   restrict use cases or user groups, increase human oversight, or discontinue use.
3. Verify each treatment plan specifies: the specific measure to be implemented,
   the person or role responsible for implementation, and the timeline for implementation.
4. Verify residual impact is assessed after treatment — does the treatment bring the
   impact within acceptable levels?
5. Request evidence that treatment measures identified in the SIAS have been implemented
   (or a status record if still in progress).
6. Ask: "Who approved the treatment decisions for impacts requiring treatment? Can you
   show me the approval record?"

**Pass Criteria:**
- Every impact evaluated as requiring treatment has a documented treatment plan
- Treatment plans include: specific measure, responsible owner, and implementation timeline
- Residual impact after treatment is assessed and documented
- Treatment implementation status is tracked with evidence
- Approval for treatment decisions is documented (particularly for high-severity impacts)

**Expected Evidence:**
- SIAS treatment section with specific treatment plans per impact
- Treatment implementation status records
- Approval records for treatment decisions

**Common Failures:**
- Treatment plan states "implement mitigations" without specifying what mitigations
- Residual impact not assessed — treatment assumes all impact resolved without analysis
- Treatment plans have no owner or deadline — cannot verify implementation
- No approval record for treatment decisions, particularly acceptance of residual risk

---

### TC-42005-010: SIAS Documentation Completeness

**Control Reference:** ISO/IEC 42005:2025 Clause 5.11 — Documenting the AI SIAS
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that the AI SIAS is documented in a form that enables review, audit, and update,
and that the documentation captures all required elements per Clause 5.11 and Clause 6.

**Prerequisites:**
- Complete AI SIAS document for review
- Clause 6 documentation requirements checklist

**Test Steps:**
1. Review the SIAS document against Clause 6 documentation requirements (see TC-42005-011
   through TC-42005-014 for specific Clause 6 elements).
2. Verify the SIAS document is version-controlled: it has an identifier, version number,
   date of creation, and date of most recent update.
3. Verify the document includes: AI system description, context, stakeholder list, scope,
   impact dimensions, identified impacts with analysis, evaluation decisions, and treatment
   plans.
4. Verify the document includes the methodology used — sufficient for an independent
   reviewer to understand how findings were produced.
5. Verify the document identifies who conducted the assessment and their relevant
   competence (Clause 5.11 requirement).
6. Confirm the document is stored in a controlled location with access controls
   appropriate to its sensitivity.

**Pass Criteria:**
- SIAS document is version-controlled with identifier, version, and dates
- All required content elements are present and substantively completed
- Assessment methodology is documented within or referenced by the SIAS
- Assessment team identity and competence is recorded
- Document is stored in a controlled location

**Expected Evidence:**
- AI SIAS document with version information
- Document storage location and access control confirmation

**Common Failures:**
- SIAS is a completed template with no version information — cannot determine when
  it was created or what version it represents
- Assessment team not identified — cannot verify appropriate competence was applied
- SIAS stored in uncontrolled location (personal drive, shared folder without access control)

---

### TC-42005-011: Results Communication

**Control Reference:** ISO/IEC 42005:2025 Clause 5.12 — Communicating the AI SIAS results
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that SIAS results are communicated to relevant stakeholders, that the communication
is appropriate to the audience, and that records of communication exist.

**Prerequisites:**
- Completed AI SIAS documentation
- Records of SIAS results communication

**Test Steps:**
1. Ask who received the results of the most recent AI SIAS. Request communication records.
2. Verify that results were communicated to decision-makers with authority to approve the
   AI system for deployment or continued operation.
3. Verify results were communicated to relevant operational teams who must implement
   treatment measures.
4. For AI systems affecting external stakeholders: verify whether SIAS results (or a
   summary) were communicated externally — Clause 5.12 addresses communication to
   affected parties where appropriate.
5. Verify communication was in a form appropriate to the audience — technical detail
   for engineers, executive summary for leadership, accessible summary for affected parties.
6. Request any records of stakeholder responses to communicated results.

**Pass Criteria:**
- SIAS results communicated to decision-makers with deployment/continuation authority
- Results communicated to teams responsible for implementing treatment measures
- Communication records exist (meeting notes, email records, distribution confirmation)
- Communication format is appropriate to the audience

**Expected Evidence:**
- Communication records for SIAS results (meeting records, email distribution lists,
  stakeholder briefing documentation)
- Any external communication of SIAS results where applicable

**Common Failures:**
- SIAS completed but only accessible to the assessment team — not communicated to
  decision-makers or operational teams
- No record that results were communicated — communication cannot be verified
- Single technical document shared with all audiences regardless of their needs

---

### TC-42005-012: SIAS Review and Update Process

**Control Reference:** ISO/IEC 42005:2025 Clause 5.13 — Reviewing and updating the AI SIAS
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that the organization has a defined process for triggering SIAS reviews when
the AI system or its context changes, and that completed SIASes have been reviewed
when material changes occurred.

**Prerequisites:**
- SIAS review trigger documentation
- Version history or update records for completed SIASes

**Test Steps:**
1. Request the documented SIAS review and update process or policy.
2. Verify the process identifies specific triggers for SIAS review: examples per Clause
   5.13 include changes to AI system functionality, changes to deployment context,
   new affected populations, changes in applicable law or regulation, and incidents
   involving the AI system.
3. Review the version history of the primary SIAS: has the assessment been updated
   since initial completion? If the AI system has been deployed for 12+ months without
   SIAS update, verify whether any trigger events occurred during that period.
4. Request records of any SIAS update triggered by a change event — was the update
   substantive (re-running impact analysis) or administrative (change of version date only)?
5. Ask: "What would trigger a review of this assessment? When was it last reviewed and
   what prompted that review?"

**Pass Criteria:**
- Review trigger criteria are documented (not left to ad hoc judgment)
- SIAS version history demonstrates updates corresponding to material change events
- Updates are substantive (not administrative-only version bumps)
- Review process includes re-evaluation of impacts and treatment measures, not just
  documentation updates

**Expected Evidence:**
- SIAS review policy or trigger documentation
- SIAS version history with update rationale records

**Common Failures:**
- No defined review triggers — SIAS updated only when someone remembers to review it
- Material changes to AI system deployed without SIAS review
- SIAS "updated" by changing the date only — no substantive re-analysis performed

---

## Clause 6: Documentation Requirements

---

### TC-42005-013: Mandatory Documentation Elements — Clauses 6.1 to 6.6

**Control Reference:** ISO/IEC 42005:2025 Clauses 6.1, 6.2, 6.3, 6.4, 6.5, 6.6
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that the SIAS documentation contains the six foundational documentation elements
required by Clauses 6.1 through 6.6: scope, AI system description, organizational context,
stakeholders and affected parties, impact dimensions, and the impact assessment results.

**Prerequisites:**
- Complete AI SIAS documentation package

**Test Steps:**
1. Review the SIAS for Clause 6.1 content: the scope of the impact assessment — confirm
   it is documented as a distinct, explicit scope statement (not implied from other sections).
2. Review for Clause 6.2 content: description of the AI system — confirm it meets the
   specificity requirements per TC-42005-002.
3. Review for Clause 6.3 content: organizational context relevant to the assessment —
   including objectives, legal requirements, and applicable policies.
4. Review for Clause 6.4 content: identification of stakeholders and affected parties —
   confirm the list is documented with the basis for each category's inclusion.
5. Review for Clause 6.5 content: impact dimensions selected and rationale for selection
   and exclusion — confirm each selected dimension is named.
6. Review for Clause 6.6 content: the impact assessment results — likelihood and severity
   analysis, evaluation decisions, and treatment options selected.
7. For any section that is absent or incomplete, record as a documentation gap.

**Pass Criteria:**
- All six Clause 6.1–6.6 elements are present in the SIAS documentation
- Each element is substantively completed — not left as template placeholder text
- Elements are traceable to each other (e.g., stakeholders in 6.4 link to impacts
  affecting them in 6.6)

**Expected Evidence:**
- AI SIAS document with sections corresponding to each of Clauses 6.1–6.6
- Cross-reference matrix or table of contents showing coverage

**Common Failures:**
- Clause 6.5 (impact dimensions with selection rationale) absent — dimensions used
  but not explicitly selected and justified
- Clause 6.6 assessment results include identified impacts but not evaluation decisions
  or treatment selections — assessment left incomplete

---

### TC-42005-014: Mandatory Documentation Elements — Clauses 6.7, 6.8, and 6.9

**Control Reference:** ISO/IEC 42005:2025 Clauses 6.7, 6.8, 6.9
**Test Type:** Document Review | Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that the SIAS documentation includes the three completion-phase elements required
by Clauses 6.7 through 6.9: the treatment plan, communication records, and review records.

**Prerequisites:**
- Complete AI SIAS documentation package
- Communication and review records

**Test Steps:**
1. Review for Clause 6.7 content: the impact treatment plan — confirm that for each
   impact requiring treatment, a treatment plan with specific measures and responsibilities
   is documented in or referenced by the SIAS.
2. Review for Clause 6.8 content: SIAS communication records — confirm that the SIAS
   documentation includes or references records showing results were communicated to
   relevant parties (per Clause 5.12).
3. Review for Clause 6.9 content: SIAS review records — confirm that the documentation
   includes or references records of any reviews performed (initial and subsequent updates),
   including the trigger for each review.
4. Verify treatment plans in Clause 6.7 documentation include: the specific treatment
   measure, the responsible party, the timeline, and the expected residual impact.
5. Verify communication records in Clause 6.8 documentation identify: who received
   results, when, and in what form.

**Pass Criteria:**
- Clause 6.7 treatment plan documentation is present and includes measure, owner, timeline,
  and expected residual impact for each impact requiring treatment
- Clause 6.8 communication records are present and identify recipients, date, and format
- Clause 6.9 review records are present for all completed reviews with trigger documentation

**Expected Evidence:**
- SIAS treatment plan documentation (Clause 6.7)
- Communication records or log (Clause 6.8)
- Review records with trigger rationale (Clause 6.9)

**Common Failures:**
- Clause 6.7 treatment plan exists but has no owner or timeline — cannot verify
  implementation accountability
- Clause 6.8 communication records absent entirely — SIAS completed but results
  distribution cannot be confirmed
- Clause 6.9 review records not maintained — only current SIAS version exists with no
  history of what changed and why
