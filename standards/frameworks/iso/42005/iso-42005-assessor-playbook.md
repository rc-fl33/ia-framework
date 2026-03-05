---
type: reference
name: iso-42005-assessor-playbook
category: compliance
classification: private
version: 2.0
last_updated: "2026-02-23"
framework: "ISO/IEC 42005:2025"
---

# ISO/IEC 42005:2025 Assessor Playbook

Assessment methodology, interview guides, scoring rubrics, and document request lists for
evaluating an organization's AI system impact assessment (AI SIAS) program against
ISO/IEC 42005:2025. Use this playbook when evaluating ISO 42001 A.5 conformance,
conducting standalone impact assessment maturity reviews, or assessing AI impact assessment
programs for regulatory due diligence purposes.

**Related:** `iso-42005-handbook.md` (framework overview), `iso-42005-test-playbook.md` (executable test cases)

---

## 1. Assessment Overview

### Assessment Context

ISO/IEC 42005:2025 is a guidance standard — it uses "should" throughout, not "shall." No
organization is formally certified against ISO 42005. However, assessment against this standard
is directly relevant in three situations:

1. **ISO 42001 A.5 Conformance:** ISO 42001 Annex A.5 requires AI impact assessment processes.
   ISO 42005 provides the methodology that A.5 references. Gaps in ISO 42005 alignment are
   grounds for A.5 nonconformity findings in an ISO 42001 audit.

2. **Regulatory Due Diligence:** The EU AI Act, national AI regulations, and sector-specific
   requirements increasingly mandate impact assessments for high-risk AI. ISO 42005 provides
   a recognized methodology baseline against which regulatory compliance can be evaluated.

3. **Standalone Maturity Assessment:** Organizations deploying AI systems may request maturity
   reviews of their impact assessment practices against an independent standard — ISO 42005
   provides that benchmark.

**Assessment Language:** Throughout this playbook, "should" represents ISO 42005 guidance.
Where ISO 42001 A.5 is in scope, deviation from ISO 42005 guidance may be elevated to a
conformance finding.

### Assessment Scope

ISO/IEC 42005:2025 covers the complete AI SIAS process in thirteen clauses (Clause 5.1–5.13)
and nine documentation requirements (Clause 6.1–6.9). Assessment evaluates:

- Whether the organization has an AI SIAS process aligned with Clauses 5.2–5.13
- Whether completed SIASes contain the documentation elements required by Clauses 6.1–6.9
- Whether the process is executed, not merely documented — completed SIAS records are
  the primary evidence

### Assessment Sequencing

Assess in clause order to build understanding before evaluating execution quality:

1. Clause 5.2 (Context) — establishes the foundation for the assessment
2. Clauses 5.3–5.5 (System, Stakeholders, Scope) — scoping and setup
3. Clauses 5.6–5.9 (Dimension selection, Identification, Analysis, Evaluation) — the core
   impact assessment work
4. Clauses 5.10–5.13 (Treatment, Documentation, Communication, Review) — completion phase
5. Clause 6.1–6.9 (Documentation requirements) — verify all elements present in completed SIASes

---

## 2. Pre-Assessment Document Request List

Request the following documents at assessment opening. Non-receipt within 24 hours of
request is itself an indicator of program maturity.

**AI SIAS Process Documents**

| Document | Required By | Red Flag If Missing |
|----------|-------------|---------------------|
| AI SIAS methodology or process documentation | Clause 5.1 | No repeatable process established |
| Impact dimension selection criteria | Clause 5.6 | Dimensions chosen without documented rationale |
| Impact evaluation criteria (acceptable vs. unacceptable thresholds) | Clause 5.9 | Evaluation conducted without pre-defined criteria |
| SIAS review trigger policy | Clause 5.13 | Reviews only occur ad hoc |
| SIAS communication policy or procedure | Clause 5.12 | Results distribution not governed |

**Completed AI SIAS Records (request for 2-3 AI systems)**

| Document | Required By | Red Flag If Missing |
|----------|-------------|---------------------|
| Completed AI SIAS document(s) with version history | Clauses 5.11, 6.1–6.9 | Process documented but not executed |
| Stakeholder and affected party identification records | Clause 5.4, 6.4 | Identification process not documented |
| Impact identification process records (workshop notes, elicitation records) | Clause 5.7 | Identification method undocumented |
| Impact analysis records with likelihood/severity ratings | Clause 5.8, 6.6 | Analysis not substantiated |
| Impact treatment plans with owners and timelines | Clause 5.10, 6.7 | Treatments unassigned or untracked |
| SIAS communication records | Clause 5.12, 6.8 | Results distribution unverifiable |
| SIAS review and update records | Clause 5.13, 6.9 | Reviews not maintained |

**Contextual Documents**

| Document | Purpose |
|----------|---------|
| AI system inventory | Identify which AI systems have SIASes |
| AI policy or AI governance framework | Context for SIAS program governance |
| ISO 42001 Statement of Applicability (if applicable) | Identify A.5 scope |

---

## 3. Assessment Area 1: SIAS Process Foundation (Clauses 5.1–5.5)

### What This Area Assesses

Whether the organization has established a repeatable, documented process for AI SIAS before
any individual assessment is conducted. The process must address: how context is established
(5.2), how the AI system is described (5.3), how stakeholders and affected parties are
identified (5.4), and how the scope of each assessment is determined (5.5).

### Interview Guide

**Target interviewees:** AI Ethics Lead, AI Governance Lead, AI Program Manager, Legal/Compliance

**Opening question:** "Walk me through how your organization conducts an AI system impact
assessment — from the decision to conduct one through to the completed document."

**Follow-up questions:**
- "What triggers an AI SIAS? Is there a defined trigger, or is it discretionary?"
- "How do you establish the context for an assessment? What inputs do you gather before
  starting impact identification?"
- "How do you decide who the affected parties are? Show me how you identified affected
  parties for [specific AI system]."
- "When you scope an assessment, what do you include and exclude? How do you justify
  exclusions?"
- "Does your SIAS process apply to all AI systems, or only certain types? What determines
  which systems are in scope?"

**Evidence requests:**
- AI SIAS methodology documentation showing the end-to-end process
- Completed SIAS for the highest-risk AI system
- Stakeholder identification records for one completed SIAS
- Scope section of one completed SIAS with documented exclusion justifications

**Red flags:**
- No documented methodology — assessments conducted differently each time
- Context section of completed SIAS is identical across different AI systems (template
  not customized)
- Affected party identification limited to direct users — third-party affected individuals
  not considered
- Scope exclusions undocumented — dimensions simply absent with no explanation
- SIAS trigger is informal ("when someone thinks we need one")

### Scoring Rubric

| Level | Score | Description |
|-------|-------|-------------|
| Not implemented | 0 | No AI SIAS process exists; no completed SIASes can be produced |
| Ad hoc | 1 | Some impact assessment activity occurs but without documented process, consistent scope, or management oversight |
| Developing | 2 | Process documented but incomplete (missing Clause 5.2 context step, or 5.4 affected party identification, or 5.5 scope definition); completed SIASes exist but are inconsistently structured |
| Defined | 3 | Full process documented covering all Clauses 5.2–5.5; completed SIASes follow the process with context, system description, stakeholder identification, and explicit scope |
| Managed | 4 | Level 3 plus: process effectiveness reviewed; stakeholder identification covers vulnerable groups; scope proportionality reviewed for each AI system; metrics tracked |
| Optimizing | 5 | Level 4 plus: process continuously improved based on completed assessment outcomes; external affected party input systematically incorporated; process adapted based on emerging AI governance requirements |

---

## 4. Assessment Area 2: Impact Identification and Analysis (Clauses 5.6–5.8)

### What This Area Assesses

The substantive core of the ISO 42005 process: whether the organization selects appropriate
impact dimensions (5.6), identifies potential impacts systematically and with external
perspective (5.7), and analyzes each impact for likelihood and severity using a documented,
repeatable methodology (5.8). This area is where rubber-stamp assessments most commonly fail.

### Interview Guide

**Target interviewees:** Impact Assessment Lead, AI Ethics Lead, Domain Experts involved in
assessments, affected community representatives (if involved)

**Opening question:** "Walk me through how you identified and analyzed the impacts for [specific AI system]."

**Follow-up questions:**
- "Which impact dimensions did you assess? How did you select them? Did you consider any
  dimensions and then exclude them — if so, why?"
- "Who was involved in identifying potential impacts? Were people outside the AI team included?"
- "Did you identify both positive impacts and negative impacts? Show me examples of each in
  the completed SIAS."
- "How did you determine the likelihood rating for [specific impact]? What evidence or
  reasoning supports that rating?"
- "How did you determine the severity rating? Does your severity scale consider
  population-scale harm or only individual harm?"
- "Did you consider indirect or second-order impacts — effects that happen downstream
  from the AI system's direct outputs?"
- "Did the analysis consider differential impact on vulnerable groups?"

**Evidence requests:**
- Impact dimension selection section of completed SIAS with rationale for each selection
  and documented justification for any Annex A dimension not selected
- Impact identification records (workshop notes, expert elicitation records,
  literature/analogous system review)
- Impact analysis methodology documentation (likelihood scale, severity scale,
  rating combination method)
- Impact analysis section of completed SIAS with differentiated ratings and justifications

**Red flags:**
- Same impact dimensions selected for every AI system — no customization per system
- Impact identification conducted entirely by the AI development team — no external perspective
- Only negative impacts identified — beneficial impacts ignored
- All impacts rated "low likelihood / low severity" without supporting analysis
- Analysis methodology undefined — ratings appear but no methodology documents how they
  were determined
- Severity analysis considers only individual harm — no population-scale harm consideration
  for widely deployed systems
- No consideration of indirect or second-order impacts

### Scoring Rubric

| Level | Score | Description |
|-------|-------|-------------|
| Not implemented | 0 | No impact identification or analysis performed; completed SIASes cannot be produced |
| Ad hoc | 1 | Impacts identified informally without dimension selection, methodology, or documented process |
| Developing | 2 | Dimension selection performed and documented but without justification for exclusions; analysis performed but methodology undefined or ratings unjustified |
| Defined | 3 | Dimensions selected per Clause 5.6 with exclusion rationale; identification involves perspectives beyond AI team; analysis uses documented methodology with differentiated, justified ratings for both likelihood and severity |
| Managed | 4 | Level 3 plus: differential impact on vulnerable groups analyzed; cumulative and systemic impacts addressed; analysis methodology validated against analogous assessments; identification includes structured external consultation |
| Optimizing | 5 | Level 4 plus: identification and analysis methodology continuously refined based on assessment experience; emerging impact categories proactively incorporated; analysis draws on empirical data and post-deployment monitoring |

---

## 5. Assessment Area 3: Impact Evaluation and Treatment (Clauses 5.9–5.10)

### What This Area Assesses

Whether the organization applies pre-defined evaluation criteria to determine which impacts
are acceptable and which require treatment (5.9), and whether identified treatment needs
result in specific, assigned, trackable treatment plans with residual impact assessment (5.10).
This area distinguishes assessments that drive action from those that are documentation exercises.

### Interview Guide

**Target interviewees:** AI Governance Lead, Risk Lead, AI Product Owner, executive with
AI system deployment authority

**Opening question:** "After you analyze an impact, how do you decide what to do about it?
What makes an impact acceptable versus unacceptable?"

**Follow-up questions:**
- "Show me your impact evaluation criteria. How were they defined and by whom?"
- "Were these criteria in place before you analyzed the impacts, or defined after?"
- "For an impact rated as requiring treatment, what treatment options did you consider?
  How did you select the specific treatment approach?"
- "Show me the treatment plan for [specific impact requiring treatment]. Who owns it?
  What is the deadline? What is the expected residual impact?"
- "Have you ever determined that an impact made an AI system unacceptable to deploy or
  continue operating? What happened?"
- "Who approves treatment decisions? Can you show me the approval record for [specific
  treatment decision]?"
- "How do you track whether treatment measures have been implemented?"

**Evidence requests:**
- Impact evaluation criteria documentation (must be pre-defined, not created post-hoc)
- Evaluation section of completed SIAS with documented evaluation decisions per impact
- Treatment plans for impacts requiring treatment — with measure, owner, timeline, residual
  impact assessment
- Treatment implementation status records
- Approval records for treatment decisions and risk acceptances

**Red flags:**
- Evaluation criteria cannot be produced — assessors applied personal judgment without
  defined thresholds
- All impacts in completed SIASes evaluated as "acceptable" — criteria may be set too low
  or assessment is under-reporting risk
- Reversibility not considered in evaluation — irreversible impacts treated the same as
  reversible ones
- Treatment plans name measures but have no owner or deadline
- Residual impact not assessed — treatment assumed to resolve impact without analysis
- No approval record for risk acceptance decisions, particularly for high-severity impacts

### Scoring Rubric

| Level | Score | Description |
|-------|-------|-------------|
| Not implemented | 0 | No evaluation criteria defined; identified impacts have no evaluation decisions or treatment plans |
| Ad hoc | 1 | Treatment decisions made informally; no pre-defined criteria; no documented approvals or owners |
| Developing | 2 | Evaluation criteria exist but incomplete (e.g., no reversibility consideration); treatment plans exist but lack owners, timelines, or residual impact assessment |
| Defined | 3 | Pre-defined evaluation criteria documented covering acceptable/unacceptable thresholds and reversibility; each impact evaluated against criteria; treatment plans include measure, owner, timeline, and residual impact assessment; approvals documented |
| Managed | 4 | Level 3 plus: treatment implementation tracked with status reporting; residual impacts monitored post-implementation; evaluation criteria periodically reviewed for appropriateness; treatment effectiveness measured |
| Optimizing | 5 | Level 4 plus: evaluation criteria and treatment options continuously refined based on treatment effectiveness data; post-deployment monitoring informs residual impact reassessment; treatment library developed from experience |

---

## 6. Assessment Area 4: Documentation, Communication, and Review (Clauses 5.11–5.13 and 6.1–6.9)

### What This Area Assesses

Whether completed SIASes are fully documented per Clause 5.11 and contain all nine Clause 6
documentation elements; whether results are communicated to decision-makers and relevant
parties (5.12); and whether the SIAS is kept current through a defined review and update
process with specific triggers (5.13). This area determines whether the SIAS program is
sustainable and auditable.

### Interview Guide

**Target interviewees:** AI Governance Lead, Document Control Lead, AI Product Owner,
executive with AI deployment authority

**Opening question:** "After a SIAS is complete, what happens to it? Who sees the results,
where is it stored, and how is it kept up to date?"

**Follow-up questions:**
- "Show me where the completed SIAS is stored. Who has access? Is it version-controlled?"
- "Who received the results of the most recent SIAS? How were the results communicated —
  what format, to what audience?"
- "For external stakeholders affected by this AI system, were the SIAS results or a
  summary communicated to them?"
- "What triggers a review of an existing SIAS? Walk me through the last time a SIAS was
  reviewed and what prompted it."
- "If your organization deployed a significant update to this AI system tomorrow, would
  that trigger a SIAS review? What is the threshold?"
- "Show me the version history of this SIAS — what changed between versions and why?"

**Evidence requests:**
- Completed SIAS document with version control information (identifier, version, dates)
- Clause 6.1–6.9 coverage check — each documentation element present and substantive
- Communication records for SIAS results (meeting records, email distribution, briefing notes)
- Any external communication of SIAS results or summaries
- SIAS review trigger policy or procedure
- SIAS version history with update rationale records
- Review records for any SIAS updated since initial completion

**Clause 6 Documentation Checklist (apply to each completed SIAS):**

| Clause | Required Documentation Element | Present? | Substantive? |
|--------|-------------------------------|----------|--------------|
| 6.1 | Scope of the AI SIAS | | |
| 6.2 | Description of the AI system | | |
| 6.3 | Organizational context | | |
| 6.4 | Stakeholders and affected parties | | |
| 6.5 | Impact dimensions selected (with rationale) | | |
| 6.6 | Impact assessment results (analysis + evaluation + treatment) | | |
| 6.7 | Impact treatment plan (with owners and timelines) | | |
| 6.8 | Communication records | | |
| 6.9 | Review records | | |

**Red flags:**
- Completed SIAS has no version information — cannot determine currency
- Assessment team not identified in SIAS — competence cannot be verified
- SIAS stored in uncontrolled location (personal drive, unmanaged shared folder)
- Results communicated only within the assessment team — decision-makers not informed
- No external communication for AI systems with significant external affected parties
- No defined review triggers — SIAS never updated unless explicitly requested
- SIAS "updated" by date change only — no substantive re-analysis performed when
  material changes occurred

### Scoring Rubric

| Level | Score | Description |
|-------|-------|-------------|
| Not implemented | 0 | No completed SIAS documentation; results not communicated; no review process |
| Ad hoc | 1 | SIAS documents exist but are unversioned, stored in uncontrolled locations, and results communicated informally if at all |
| Developing | 2 | SIAS documents are structured but missing Clause 6 elements (most commonly 6.8 communication records or 6.9 review records); review triggers defined but not consistently applied |
| Defined | 3 | Completed SIASes contain all nine Clause 6.1–6.9 elements substantively; results communicated to decision-makers and treatment owners with records; review triggers documented and applied when triggered |
| Managed | 4 | Level 3 plus: communication tailored to audience (executive summary vs. technical detail); external communication established for AI systems with significant external affected parties; review effectiveness tracked; documentation stored in governed system with access controls and retention policy |
| Optimizing | 5 | Level 4 plus: SIAS documentation feeds back into AI system governance decisions; communication effectiveness assessed with audience feedback; review process proactively identifies change events rather than reacting to them |

---

## 7. Program-Level Scoring Summary

Score each assessment area and combine for an overall program maturity rating:

| Assessment Area | Clauses | Score (0–5) | Notes |
|----------------|---------|-------------|-------|
| Area 1: Process Foundation | 5.1–5.5 | | |
| Area 2: Impact Identification and Analysis | 5.6–5.8 | | |
| Area 3: Impact Evaluation and Treatment | 5.9–5.10 | | |
| Area 4: Documentation, Communication, and Review | 5.11–5.13, 6.1–6.9 | | |
| **Overall Program Maturity** | | | Average of above |

**For ISO 42001 A.5 conformance purposes:**
- All areas must reach Score 3 (Defined) for A.5 conformance
- Score 0 or 1 in any area is a major nonconformity against ISO 42001 A.5
- Score 2 in any area is a minor nonconformity against ISO 42001 A.5

---

## 8. Common Findings by Assessment Area

### Area 1 — Process Foundation — Common Findings

**Major nonconformities (ISO 42001 A.5 context):**
- No documented AI SIAS process — impact assessments conducted ad hoc or not at all
- SIAS process does not include Clause 5.4 affected party identification step — assessments
  consider users only, not third-party affected individuals
- No SIAS trigger defined — AI systems deployed without any determination of whether an
  assessment is required

**Minor nonconformities:**
- Context section (Clause 5.2) is a generic organizational description rather than AI
  system-specific context
- Scope exclusions undocumented — impact dimensions absent from assessments without
  documented justification

---

### Area 2 — Impact Identification and Analysis — Common Findings

**Major nonconformities:**
- Impact identification conducted entirely by the AI development team — no independence
  or external perspective per Clause 5.7
- Analysis methodology undefined — ratings appear in completed SIASes but no methodology
  documents how they were determined, making assessments unrepeatable
- No differentiation in impact ratings — all impacts rated identically regardless of
  actual likelihood or severity differences

**Minor nonconformities:**
- Positive impacts not identified — Clause 5.7 requires considering beneficial impacts,
  not only harmful ones
- Indirect or second-order impacts not addressed — direct outputs analyzed but downstream
  effects ignored
- Annex A dimensions excluded without documentation of exclusion rationale

---

### Area 3 — Impact Evaluation and Treatment — Common Findings

**Major nonconformities:**
- Impact evaluation criteria not defined — Clause 5.9 requires criteria for determining
  acceptable versus unacceptable impacts; without criteria, evaluation cannot be substantiated
- Impacts requiring treatment have no treatment plans — assessment identifies issues but
  does not drive action
- No approval documented for risk acceptance decisions on high-severity impacts

**Minor nonconformities:**
- Reversibility not addressed in evaluation criteria despite Clause 5.9 requiring it
- Treatment plans lack owners or timelines — implementation cannot be tracked or verified
- Residual impact not assessed — treatment assumed to resolve all impact without analysis

---

### Area 4 — Documentation, Communication, and Review — Common Findings

**Major nonconformities:**
- Completed SIASes missing multiple Clause 6 elements — particularly 6.7 (treatment plans),
  6.8 (communication records), and 6.9 (review records)
- SIAS results not communicated to decision-makers with deployment authority — assessment
  completes but does not inform the deployment decision
- No SIAS review process — SIASes created once and never updated despite material AI
  system changes

**Minor nonconformities:**
- SIAS stored without version control — cannot determine which version is current or
  what changed between versions
- Communication records absent — results were communicated but not documented, making
  verification impossible
- SIAS review triggers defined but not applied — material changes occurred without
  triggering review

---

## 9. Assessment Report Format

### Finding Documentation Format

For each finding identified during the assessment:

```
Finding ID: ISO42005-[YEAR]-[SEQUENCE]
Classification: [Major Gap / Minor Gap / Observation]
Assessment Area: [Area 1–4]
Clause Reference: ISO/IEC 42005:2025 Clause [X.X]
Score: [0–5]

Description:
[Factual description of what was observed — what exists vs. what the standard recommends]

Evidence Reviewed:
[Documents reviewed and interviews conducted that led to this finding]

Clause Guidance:
[The specific ISO 42005 guidance text that is not being followed]

ISO 42001 Implication (if applicable):
[Whether this finding constitutes a nonconformity against ISO 42001 A.5]

Recommended Improvement:
[Specific actions to align with ISO 42005 guidance]
```

### Assessment Summary Dashboard

| Assessment Area | Clauses | Score | Major Gaps | Minor Gaps | Observations |
|----------------|---------|-------|:----------:|:----------:|:------------:|
| Area 1: Process Foundation | 5.1–5.5 | | | | |
| Area 2: Impact Identification and Analysis | 5.6–5.8 | | | | |
| Area 3: Impact Evaluation and Treatment | 5.9–5.10 | | | | |
| Area 4: Documentation, Communication, Review | 5.11–5.13, 6.1–6.9 | | | | |
| **Overall** | | | | | |
