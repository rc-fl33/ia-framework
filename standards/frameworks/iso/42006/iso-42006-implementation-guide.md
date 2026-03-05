---
type: guide
name: iso-42006-implementation-guide
category: compliance
classification: private
version: 1.0
last_updated: "2026-02-23"
framework: "ISO/IEC 42006:2025 — Requirements for Bodies Providing Audit and Certification of AIMS"
---

# ISO/IEC 42006:2025 — Implementation Guide: Building an AIMS Certification Program

**Purpose:** Step-by-step implementation guide for Conformity Assessment Bodies (CABs) building or
expanding an AI Management System (AIMS) certification program against ISO/IEC 42006:2025.

**Audience:** Certification bodies (CBs) establishing AIMS certification capability. Organizations
seeking ISO 42001 certification should use this guide to evaluate prospective CBs.

**Related:** `iso-42006-handbook.md` (narrative overview), `controls.yaml` (structured requirements)

---

## Prerequisites

Before implementing an ISO 42006 conformant certification program, the CB should have:

1. An existing ISO/IEC 17021-1 conformant management system certification program — ISO 42006
   builds on 17021-1 rather than replacing it. Organizations without existing 17021-1 infrastructure
   must establish that base first.
2. Access to ISO/IEC 42006:2025 and ISO/IEC 17021-1:2015 as primary source documents.
3. ISO/IEC 42001:2023 — CBs certifying AIMS must understand the standard they are certifying against.
4. Executive commitment to the resource investment — auditor recruitment and competence development
   are the most significant implementation costs.
5. An accreditation body relationship — identify the national accreditation body (IAF member) that
   will evaluate and accredit the AIMS certification program.

---

## Phase 1: Gap Assessment and Program Design

### Step 1.1 — Map Current 17021-1 Infrastructure

**Objective:** Identify what ISO 42006 requirements are already met through existing 17021-1
infrastructure and what requires new development.

**Activities:**
1. Document the CB's current management system certification domains (ISO 9001, 27001, etc.)
2. For each ISO 42006 clause, determine whether existing 17021-1 process satisfies the requirement
   or whether an AI-specific addition is required
3. Focus gap analysis on the three highest-impact areas:
   - Clause 7 (auditor competence) — near-certain gaps for CBs new to AI
   - Clause 5.2.2 (AI-specific conflict of interest provisions) — likely requires policy updates
   - Annex A (AI-specific audit time calculation) — replaces 17021-1 audit time methodology

**Output:** Gap matrix documenting inherited requirements vs. AI-specific additions required.

**Common gap findings:**
- Auditor experience requirements (4 years IT + 1 year AI) not currently tracked in personnel records
- Competence framework does not address any of the six ISO 42006 Clause 7.1.3 domains
- Conflict of interest policy lacks explicit provisions for AI consulting services
- Audit time calculation uses 17021-1 factors without AI adjustment factors

### Step 1.2 — Define Program Scope

**Objective:** Determine what AIMS certification activities the program will offer.

**Scope decisions to document:**
- Industry sectors to be served (affects auditor competence depth requirements per Clause 7.1.3.5)
- AI system types to be certified (ML, LLM, computer vision, autonomous systems — affects technical
  competence requirements per Clause 7.1.3.4)
- Geographic markets (affects legal obligations competence per Clause 7.1.3.3)
- AI value chain roles to be audited (AI producer, AI provider, AI customer — per Clause 9.1.2)
- Remote vs. on-site audit capability

Document scope rationale — accreditation bodies will assess whether the program scope is
appropriately supported by available auditor competence.

### Step 1.3 — Develop Implementation Roadmap

**Objective:** Sequence implementation work against accreditation target date.

**Recommended sequencing:**
1. Auditor competence program (longest lead time — hiring and training)
2. Conflict of interest policy updates (low effort, high risk if delayed)
3. Audit methodology documentation (audit planning, scope definition, time calculation)
4. Certification document templates (straightforward, but SoA version requirement is distinctive)
5. Accreditation body engagement (should begin early; engage NAB before program is complete)

---

## Phase 2: Impartiality Framework

Implement before onboarding any AIMS certification clients. Impartiality failures discovered after
certification decisions are extremely damaging — remediation retrospectively is not possible.

### Step 2.1 — Update Conflict of Interest Policy

**Objective:** Explicitly address ISO 42006 Clause 5.2.2.3 prohibited activities in CB policy.

**Implementation steps:**
1. Add AI-specific prohibited activities to the existing 17021-1 conflict of interest policy.
   The additions required by Clause 5.2.2.3 are:
   - Providing company-specific AI management consulting services to certification clients
   - Implementing AIMS for certification clients
   - Recommending specific AI system solutions, AIMS implementation approaches, or AI tools
   - Providing AI management consulting, information security consulting, data protection officer
     services, or risk management consulting to certification clients
2. Define the mechanism for screening proposed audit team members — each team member must
   declare whether they have provided any of the prohibited services to the client being audited
3. Establish a look-back period for conflict declarations (minimum: 2 years prior to proposed audit)
4. Document permitted activities that do NOT create conflict per Clause 5.2.2.2:
   - Public training courses open to all attendees
   - Generic publicly available guidance documents
   - Participation in standards development activities
5. Obtain review and approval from the impartiality committee (required by 17021-1 and carried
   forward into 42006)

**Evidence to retain:**
- Updated conflict of interest policy with version history
- Impartiality committee meeting minutes approving the updated policy
- Blank conflict of interest declaration form for audit team members
- Process document for conflict screening before audit team assignment

### Step 2.2 — Implement Conflict Screening Process

**Objective:** Ensure conflict of interest checks are operationalized, not just documented.

**Implementation steps:**
1. Add AI-specific conflict questions to the audit team member declaration form:
   - "Have you provided AI management consulting services to this organization in the past 2 years?"
   - "Have you provided recommendations on AIMS implementation approaches to this organization?"
   - "Do you have any financial interest in AI systems or tools used by this organization?"
2. Build conflict screening into the audit assignment workflow — declarations must be collected
   before audit team confirmation, not after
3. Establish an escalation process: when a potential conflict is declared, who reviews and decides
   whether it disqualifies the auditor from the assignment?
4. Retain completed declarations as documented information per Clause 7.5 equivalent

---

## Phase 3: Auditor Competence Program

This is the most resource-intensive phase and the one most likely to require external hiring.
Allow significant lead time before accepting initial AIMS certification engagements.

### Step 3.1 — Build the Competence Framework

**Objective:** Document the competence requirements that AIMS auditors must meet, covering all
six Clause 7.1.3 domains.

**The six domains and what each requires:**

| Domain | Key Content Areas | Assessment Method |
|--------|------------------|------------------|
| 7.1.3.1 — General AIMS requirements | AI concepts; ML fundamentals; AIMS monitoring and measurement; management system auditing | Written exam + portfolio review |
| 7.1.3.2 — AI management system standards | ISO 42001 clause-by-clause knowledge; related normative documents; certification scheme requirements | ISO 42001 examination |
| 7.1.3.3 — AI and AIMS legal obligations | EU AI Act; national AI regulations in served jurisdictions; GDPR AI implications; sector-specific AI law | Legal knowledge assessment per served jurisdictions |
| 7.1.3.4 — AI terminology, methods, techniques | AI governance structures; risk management for AI; data science; ML processes and lifecycle | Technical interview or examination |
| 7.1.3.5 — Client business sector | Sector terminology; AI use in the sector; sector-specific regulatory environment | Demonstrated sector experience + CPD |
| 7.1.3.6 — Client products, processes, organization | Client's specific AI systems and technologies; client's organizational structure | On-the-job learning during audit |

**Implementation notes:**
- Domain 7.1.3.6 is necessarily achieved during each specific engagement — build pre-audit
  preparation time into audit schedules to allow the team to review client documentation
- Domain 7.1.3.5 (sector competence) is the most likely to require different auditors for
  different industry sectors — healthcare AI audits require healthcare domain auditors
- Domains 7.1.3.1 through 7.1.3.4 can be developed through training programs; document what
  training satisfies each domain

### Step 3.2 — Define Auditor Experience Criteria

**Objective:** Operationalize the Clause 7.2.2.2 minimum experience requirements for individual
auditor records.

**Minimum criteria (per 7.2.2.2):**
- University-level professional education (or equivalent documented experience)
- At least 4 years of full-time practical workplace experience in IT or data protection
- At least 1 year of that experience specifically involving AI systems
- Completion of AIMS-specific auditor training

**For audit team leaders, additionally:**
- Active participation as auditor in all stages of at least 3 management system audits
- Those 3 audits must collectively cover: initial scope determination, document review, risk
  assessment review, and formal reporting

**Implementation steps:**
1. Create a standard auditor CV template requiring explicit documentation of:
   - Total years of IT/data protection experience with dates and roles
   - Specifically identified AI experience with dates, roles, and nature of AI work
   - AI-related training completed with dates and certificates
   - Management system audits completed in team leader role (for team leaders)
2. Review all current auditors against these criteria — identify gaps immediately
3. Establish a hiring profile for AIMS auditor recruitment that specifies all criteria
4. Create an auditor record file for each auditor maintaining current competence evidence

### Step 3.3 — Develop Training and CPD Program

**Objective:** Build internal pathways to develop and maintain AIMS auditor competence.

**Implementation steps:**
1. Identify accredited AIMS auditor training programs aligned to ISO 42001/42006
   (CQI/IRCA accredited AIMS auditor courses, national CB training programs)
2. Assess whether the CB will deliver internal training or rely on external programs — both
   are acceptable; document the decision and training curriculum
3. For Domains 7.1.3.3 (legal) and 7.1.3.5 (sector), establish CPD requirements to maintain
   currency as AI law evolves and sectors adopt new AI systems
4. Establish a competence review cycle — AI governance knowledge has a shorter shelf life than
   traditional management system topics; annual competence reviews are appropriate
5. Document CPD completion in auditor records

**Evidence to retain:**
- Competence framework document covering all six 7.1.3 domains
- Individual auditor records with experience documentation and training completion
- Training curriculum and course materials (internal) or enrollment records (external)
- Annual competence review records for each auditor

---

## Phase 4: Audit Methodology Documentation

### Step 4.1 — AI Stakeholder Role Identification Procedure

**Objective:** Implement the Clause 9.1.2 requirement to identify client AI value chain roles
as a formal step in audit programme planning.

**Implementation steps:**
1. Create a pre-engagement questionnaire that asks clients to identify their AI value chain role(s):
   - AI producer: Develops and builds AI systems
   - AI provider: Makes AI systems available to others (may develop or resell)
   - AI customer: Deploys and uses AI systems built by others
   - Note: Many organizations occupy multiple roles simultaneously
2. Document how the role identification affects audit scope construction:
   - AI producers: Audit must address development lifecycle controls (A.6.1.x), data controls (A.7.x)
   - AI providers: Must address both development (if building) and supply chain (A.10.2)
   - AI customers: Audit emphasizes procurement (A.6.2.2), third-party management (A.10.x), use (A.9.x)
3. Include role identification in the audit planning record for every engagement

### Step 4.2 — Statement of Applicability Review Procedure

**Objective:** Implement the Clause 9.1.3 requirement that CBs verify SoA completeness rather
than accepting client scope definitions at face value.

**The SoA challenge obligation:** The CB must verify that all significant AI system processes
and risks are covered by the SoA. Exclusions of significant risks require documented challenge.

**Implementation steps:**
1. Create a structured SoA review checklist for auditors to use during Stage 1:
   - Does the SoA cover all AI systems identified in the AI system inventory?
   - Are significant risk areas addressed (not merely listed as "not applicable")?
   - Are exclusions justified with documented rationale — and does the rationale withstand scrutiny?
   - Does the SoA scope align with the AI value chain roles identified in 9.1.2?
2. Document the CB's challenge process: when an auditor believes an SoA exclusion is unjustified,
   what happens? Define escalation path within the CB
3. Record the SoA review findings in the Stage 1 audit report with explicit notation of any
   challenged exclusions and the resolution

### Step 4.3 — Audit Time Calculation Procedure

**Objective:** Implement the normative Annex A audit time methodology for every AIMS engagement.

**Base time determination:**
Base audit time is calculated from the number of persons involved in the AI lifecycle at the
client organization. Use the same base table as ISO 17021-1 (employees in scope), treating all
persons involved in AI development, deployment, operation, and governance as the relevant count.

**Mandatory adjustment factors (Annex A):**

| Adjustment Factor | Time Addition |
|------------------|---------------|
| Each AI system in scope beyond the first 5 | 1.0 to 2.0 auditor-days per system (based on system complexity) |
| Each high-risk or sensitive AI system in scope | 0.5 to 2.0 additional auditor-days per system |
| Each regulatory framework applicable to AI systems in scope | 1.0 auditor-day per framework |
| Third-party AI system agreements beyond the first 5 | 0.1 to 2.0 auditor-days (based on complexity) |
| Each additional SoA control beyond core controls | 0.1 auditor-days per control (maximum 2.0 total) |

**Implementation steps:**
1. Create an audit time calculation worksheet that requires auditors to complete all Annex A
   factors before finalizing the audit plan
2. Document the audit time calculation as part of the formal audit plan — this is an evidenced
   decision, not an informal estimate
3. Establish a minimum audit time threshold below which AIMS certifications will not be accepted
   (prevents commercial pressure to under-time audits)
4. Train audit team leaders on completing the calculation worksheet and justifying time allocations

**Common calculation errors:**
- Counting only development staff; excluding AI operations, governance, and business users of AI
- Applying the "AI systems in scope" factor only for systems classified as "high-risk" — the
  factor applies to all systems beyond 5, with additional time for high-risk systems
- Not applying the regulatory framework factor for organizations under EU AI Act obligations

### Step 4.4 — Two-Stage Audit Procedure

**Objective:** Document the CB's specific procedures for Stage 1 and Stage 2 AIMS audits.

**Stage 1 AIMS-specific requirements to document:**
1. Scope: Stage 1 reviews AIMS documentation and assesses readiness for Stage 2. For AIMS
   specifically, document review must cover:
   - AI policy and topic-specific AI policies
   - AI system inventory and risk classifications
   - SoA with applicability justifications
   - AI-specific impact assessment records
   - AI governance role definitions (A.3.2)
   - Data governance documentation (A.7.x controls)
2. Output: Stage 1 audit report must explicitly address SoA completeness (9.1.3) and identify
   any areas that represent significant Stage 2 audit risk
3. Minimum time between Stage 1 and Stage 2: allow time for client to address Stage 1 findings
   before Stage 2 proceeds (typically 4-12 weeks)

**Stage 2 AIMS-specific requirements to document:**
1. Sample selection approach: AI system inventory drives sampling — higher-risk AI systems and
   those with complex data governance require deeper sampling
2. Testing areas specific to AIMS:
   - Operational evidence of impact assessments (not just policy documents)
   - Data governance records for training data
   - Model validation and testing records
   - Monitoring configuration for production AI systems
   - Human oversight mechanisms in operation
3. Nonconformity management: additional audit time must be allocated for each nonconformity
   found, to evaluate corrective action evidence

### Step 4.5 — Surveillance and Re-certification Procedures

**Objective:** Document surveillance and re-certification programmes that adapt to AI-specific risks.

**Surveillance programme design (Clause 9.6.2):**
1. Annual surveillance at approximately one-third of initial audit time
2. Surveillance scope must adapt to AI system-specific risks — document the process for
   determining which AI systems and controls receive surveillance focus each cycle
3. Define surveillance triggers that require expanded or special auditing:
   - Significant AI system changes (new AI systems added, major model updates)
   - AI-related incidents reported
   - New regulatory requirements applicable to client's AI systems
   - Material organizational changes affecting AI governance
4. Establish process for clients to notify the CB of surveillance trigger events between cycles

**Re-certification programme (Clause 9.6.3):**
1. Every 3 years
2. At least two-thirds of initial certification audit time
3. Re-certification reviews: changes to the client's AIMS over the certification cycle, changes
   in legal and regulatory environment, changes in AI system scope, effectiveness of corrective
   actions from surveillance nonconformities

---

## Phase 5: Certification Documents

### Step 5.1 — Certificate Template

**Objective:** Create an AIMS certificate template meeting Clause 8.2.2 requirements.

**Required elements (8.2.2) — all must appear on the certificate:**
- Name and address of the certified organization
- Scope of certification describing what is covered by the AIMS
- SoA version reference — this is unique to AIMS certification and most important addition
  over generic management system certificates; the SoA version links the certificate to
  the specific set of controls included in the certified AIMS
- Explicit statement that the certificate does NOT authorize labeling of individual AI products,
  processes, or services
- CB name, address, and accreditation body reference
- Initial certification date, issue date, and expiry date
- ISO 42001:2023 as the standard certified against

**Guidance on SoA version reference:**
The SoA version captures which Annex A controls are in scope at certification time. When the
client updates their SoA (adding or excluding controls), the CB must determine whether a new
assessment is required. Document this trigger in the surveillance programme.

### Step 5.2 — Certification Decision Process

**Objective:** Ensure certification decisions are made independently from the audit team.

**Implementation steps:**
1. Define who in the CB organization is authorized to make certification decisions
2. Document that certification decision-makers must NOT have been part of the audit team
   for the specific engagement — this is a hard requirement, not a best practice
3. Create a certification decision record: the reviewer must document what evidence they
   reviewed, how they resolved any audit team recommendations or nonconformities, and the
   basis for the certification decision
4. Establish an appeals process for clients who dispute certification decisions

---

## Phase 6: Accreditation Preparation

### Step 6.1 — Select Accreditation Body

**Objective:** Identify and engage the appropriate national accreditation body (NAB).

**Selection criteria:**
- IAF member accreditation body in the primary jurisdiction of operation
- Accreditation scope includes management system certification bodies
- NAB is preparing or has prepared assessment criteria for ISO 42006 AIMS certification
- Examples: ANAB (US), UKAS (UK), DAkkS (Germany), COFRAC (France), JAS-ANZ (Australia/NZ)

**Engagement recommendation:** Contact the NAB before the program is fully built. Most NABs
offer pre-assessment consultations that identify gaps before the formal assessment. This prevents
wasted implementation effort on requirements the NAB will challenge.

### Step 6.2 — Internal Readiness Assessment

**Objective:** Verify program is ready for accreditation assessment before submitting application.

**Readiness checklist:**

| Area | Readiness Indicator |
|------|---------------------|
| Impartiality | Conflict of interest policy updated for AI; screening process documented and tested |
| Auditor competence | All six 7.1.3 domains covered; at least 2-3 qualified AIMS auditors with documented credentials |
| Audit methodology | Stakeholder role ID, SoA review, audit time calculation, two-stage procedure all documented |
| Certification documents | Certificate template with all 8.2.2 elements; decision independence procedure |
| Management system | CB's own management system (Option A or B per Clause 10) up to date |
| Witness audits | Completed at least one internal AIMS audit or pre-accreditation witness audit |

**Pilot engagement recommendation:** Before applying for accreditation, conduct at least one
AIMS audit under the new program using a willing client organization. Document the engagement
thoroughly — it serves as evidence for accreditation assessment and reveals procedural gaps.

---

## Ongoing Program Management

### Common Nonconformities During Accreditation Assessment

Based on ISO 42006 Section 8 common findings documentation:

| Nonconformity | Root Cause | Prevention |
|---------------|-----------|------------|
| Auditors lack documented AI-specific experience | CVs don't explicitly show AI work periods | Revamp auditor CV template to require explicit AI experience sections |
| Competence framework misses domains | Built from 17021-1 template without AI additions | Use six-domain matrix explicitly |
| Audit time under-calculated | Annex A factors not applied | Make calculation worksheet mandatory, not optional |
| SoA review superficial | Auditors accept client's exclusion rationale without challenge | Add SoA challenge checklist with explicit pass/fail criteria |
| Certification decisions not independent | Decision made by audit team leader | Enforce separation in workflow tool with role-based access |
| Surveillance not AI-risk-adapted | Using generic surveillance programme | Add AI trigger events to surveillance planning template |
| Conflict screening misses AI consulting | Conflict form doesn't ask about AI consulting specifically | Add explicit AI consulting questions to declaration form |

### Managing AI Regulatory Change

ISO 42006 Clause 7.1.3.3 requires auditors to know applicable AI law — a domain that changes
rapidly. Establish a process to:

1. Monitor AI regulatory developments in served jurisdictions (EU AI Act implementation dates,
   national AI laws, sector-specific AI regulations)
2. Update auditor competence requirements and training when material regulatory changes occur
3. Update audit checklists and programme plans to reflect new legal requirements
4. Notify existing certified clients of regulatory changes affecting their AIMS scope

---

## Evidence and Documentation Summary

For each phase, retain the following as documented information:

**Phase 2 (Impartiality):**
- Conflict of interest policy (current version with change history)
- Impartiality committee records
- Auditor conflict declarations per engagement

**Phase 3 (Competence):**
- Competence framework covering all six 7.1.3 domains
- Individual auditor records (CV, training certificates, CPD log)
- Audit team leader qualification records (3 prior MS audits)

**Phase 4 (Audit Methodology):**
- Audit programme plans with stakeholder role identification (per client)
- SoA review records with challenge documentation (per engagement)
- Audit time calculation worksheets (per engagement)
- Stage 1 and Stage 2 audit reports (per engagement)
- Nonconformity records and corrective action evidence (per engagement)

**Phase 5 (Certification):**
- Issued certificates (SoA version referenced)
- Certification decision records (independent reviewer)
- Certificate register with current status

---

## Integration with ISO 42001 Knowledge

CBs certifying AIMS must understand ISO 42001 as a prerequisite (Clause 7.1.3.2). The areas
most frequently misunderstood during AIMS audits:

**AI value chain role determination (ISO 42001 Clause 4.1 / Annex C):** Clients frequently
understate their AI provider role when they license or resell AI capabilities embedded in their
products. Auditors must probe whether the client provides AI capabilities to other organizations.

**SoA completeness for data controls (ISO 42001 A.7.x):** Data governance controls are
frequently partially excluded with rationale that "our AI systems use only public data." This
rarely withstands scrutiny — most AI systems process operational data from users, even if not
personal training data.

**Impact assessment as documented evidence (ISO 42001 A.5.x):** The most commonly substantive
gap. Clients often have an impact assessment process documented but no completed assessments for
actual AI systems in scope. Audit sampling must include evidence of completed assessments for
specific systems, not just review of the process documentation.

**Human oversight mechanisms (ISO 42001 A.9.2):** Responsible use policies are common; operational
evidence of human oversight in consequential AI decisions is less common. Auditors should request
evidence of human review processes in operation, not just policy documentation.
