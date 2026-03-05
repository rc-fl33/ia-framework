---
type: reference
name: iso-42006-test-playbook
category: compliance
classification: private
version: 2.0
last_updated: "2026-02-23"
framework: "ISO/IEC 42006:2025"
---

# ISO/IEC 42006:2025 Test Playbook

Executable test cases for evaluating a certification body's (CB) conformance with
ISO/IEC 42006:2025 requirements, or for evaluating the CB selection decision of an organization
seeking ISO 42001 certification. Use these test cases during CB capability assessments,
accreditation audits of CBs, or pre-engagement CB evaluation.

**Related:** `iso-42006-assessor-playbook.md` (interview guides and scoring), `iso-42006-handbook.md` (framework overview)

---

## How to Use This Playbook

Two use contexts:

1. **Evaluating a CB you are considering hiring:** Use TC-42006-001 through TC-42006-012 as
   your vendor due diligence framework. Collect evidence on each before signing an engagement.
2. **Accreditation body auditing a CB:** Use all test cases as a structured audit program.

Mark each as:
- **PASS:** All pass criteria met, evidence collected
- **PARTIAL:** Some criteria met; specify which criteria failed
- **FAIL:** Pass criteria not met; document gap indicators observed

Total test cases: **12** covering Clause 5 (impartiality), Clause 7 (competence), Clause 8
(certification documents and confidentiality), and Clause 9 (process requirements including
audit programme, scope, audit time, initial certification stages, surveillance, and remote audit).

---

## Clause 5: Impartiality and Conflict of Interest

---

### TC-42006-001: Conflict of Interest Policy — AI-Specific Provisions

**Control Reference:** ISO/IEC 42006:2025 Clause 5.2.2 — Conflicts of interest
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:** Verify that the CB's impartiality policy includes the AI-specific conflict of
interest provisions required by Clause 5.2.2.3 and that prohibited activities are clearly
distinguished from permitted activities.

**Prerequisites:**
- CB impartiality policy
- CB service catalogue (to cross-check whether prohibited services are offered)

**Test Steps:**
1. Request the CB's impartiality policy and conflict of interest procedure
2. Verify the policy explicitly prohibits the following for certification clients per
   Clause 5.2.2.3: providing company-specific AIMS consulting advice, implementing AIMS
   processes for clients, recommending specific AI system solutions, providing AI management
   consulting, information security consulting, data protection officer services, and risk
   management consulting
3. Verify the policy distinguishes permitted activities: generic public training courses open
   to all, publication of guidance documents, participation in standards development
4. Request the CB's service catalogue; verify no prohibited services are advertised as AIMS
   certification add-ons without documented firewalling provisions
5. If the CB offers both consulting and certification services, verify the firewalling mechanism:
   separate legal entities or separate personnel, with a documented screening procedure applied
   per engagement

**Pass Criteria:**
- Impartiality policy explicitly names the AI-specific prohibited activities from Clause 5.2.2.3
- Permitted activities are clearly distinguished from prohibited ones
- Service catalogue is consistent with policy (no prohibited services marketed alongside
  AIMS certification)
- Firewalling mechanism documented and verifiable if CB offers both consulting and certification

**Expected Evidence:**
- Impartiality policy with AI-specific provisions
- Service catalogue
- Firewalling documentation (if applicable)

**Common Failures:**
- Impartiality policy is a generic ISO/IEC 17021-1 policy not updated for ISO 42006; AI-specific
  consulting prohibitions absent
- CB offers "AIMS readiness consulting" and "AIMS certification" to the same clients without a
  documented firewall — direct conflict of interest
- Policy prohibits consulting but no per-engagement mechanism screens proposed auditors for prior
  consulting relationships with the client

---

### TC-42006-002: Conflict of Interest Screening for Proposed Audit Teams

**Control Reference:** ISO/IEC 42006:2025 Clause 5.2.2 — Conflicts of interest (application to
audit team selection)
**Test Type:** Process Review + Interview
**Assessor:** Lead Assessor

**Objective:** Verify that the CB applies its conflict of interest policy to each proposed audit
team before engagement and that screening is documented and client-facing.

**Prerequisites:**
- CB conflict of interest screening procedure
- Example screening records from recent AIMS engagements

**Test Steps:**
1. Request the CB's conflict of interest screening procedure for audit team members
2. Verify the procedure requires screening each proposed auditor against: prior consulting
   relationships with the client, prior employment at the client, personal financial interests
   in the client, and prior involvement in AIMS implementation at the client
3. Request screening records for the proposed audit team (or sample records from recent
   comparable engagements)
4. Verify screening is documented with a decision record — not a verbal confirmation only
5. Verify clients are informed of the screening outcome and have the right to raise concerns
   about proposed auditors before the audit commences
6. Ask: what is the procedure if a conflict is discovered mid-audit?

**Pass Criteria:**
- Screening procedure covers all required conflict categories including AI-specific consulting
- Screening is documented with individual auditor declarations
- Clients are notified of screening results and can raise concerns before audit begins
- Mid-audit conflict discovery procedure exists and is documented

**Expected Evidence:**
- Conflict of interest screening procedure
- Sample completed screening declarations
- Client notification process documentation

**Common Failures:**
- Screening relies solely on auditor self-declaration with no independent verification step
- Prior AIMS consulting relationships not screened — only financial interests checked
- Client not informed of audit team screening results before audit commences

---

## Clause 7: Auditor Competence Requirements

---

### TC-42006-003: Six-Domain Competence Framework Completeness

**Control Reference:** ISO/IEC 42006:2025 Clause 7.1.3 — Specific technical competence
**Test Type:** Document Review
**Assessor:** Lead Assessor + Technical Assessor

**Objective:** Verify that the CB has a documented auditor competence framework covering all
six AI-specific competence domains required by Clause 7.1.3, with defined criteria for each
domain.

**Prerequisites:**
- CB auditor competence framework documentation
- Proposed audit team CVs and qualifications

**Test Steps:**
1. Request the CB's auditor competence framework for AIMS auditors
2. Verify the framework addresses all six Clause 7.1.3 domains:
   - Domain 1 (7.1.3.1): General AIMS requirements — AI concepts, technical aspects,
     management system principles, auditing methods, and AIMS monitoring
   - Domain 2 (7.1.3.2): AI management system standards — ISO/IEC 42001 structure, normative
     documents, and certification schemes applicable to AIMS
   - Domain 3 (7.1.3.3): AI and AIMS legal obligations — applicable regulations including the
     EU AI Act and national AI legislation in the jurisdictions where clients operate
   - Domain 4 (7.1.3.4): AI terminology, methods, and techniques — AI governance, risk
     management, data science principles, and ML development processes
   - Domain 5 (7.1.3.5): Client business sector — sector terminology, AI use cases specific
     to the sector, and the sector's regulatory environment
   - Domain 6 (7.1.3.6): Client products, processes, and organization — the client's specific
     AI systems, technologies deployed, and organizational structure
3. Verify the framework specifies whether each domain requires individual competence or allows
   collective team competence (Domains 1-4 must be present in the team; Domains 5-6 are
   typically verified per engagement)
4. Verify the framework defines how each domain is evaluated and what evidence is required
5. Map the proposed audit team's documented competence to each domain; verify all six domains
   are collectively covered before the engagement proceeds

**Pass Criteria:**
- Competence framework explicitly addresses all six Clause 7.1.3 domains
- Each domain has defined criteria and evidence requirements
- Individual vs. team competence distinctions are made for each domain
- Proposed audit team collectively covers all six domains with documented evidence

**Expected Evidence:**
- Auditor competence framework document
- Proposed audit team CVs mapped to all six domains
- Domain coverage assessment record completed for this engagement

**Common Failures:**
- Competence framework covers Domains 1-2 (general AIMS and standards) but not Domain 3
  (AI legal obligations) or Domain 4 (AI technical methods)
- Domains 5 and 6 (sector and client specifics) treated as "the auditor will learn on the job"
  without pre-engagement verification
- All six domains nominally listed but no evidence requirements defined for Domains 3-6

---

### TC-42006-004: Individual Auditor Experience Verification

**Control Reference:** ISO/IEC 42006:2025 Clause 7.2.2.2 — Auditor experience requirements
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:** Verify that individual auditors assigned to AIMS audits meet the minimum
experience requirements of Clause 7.2.2.2: university-equivalent education, at least 4 years
of IT or data protection experience, at least 1 year of that experience specifically in AI
systems, and completion of AIMS-specific auditor training.

**Prerequisites:**
- CVs and experience declarations for all proposed audit team members
- Training completion records for AIMS-specific auditor training

**Test Steps:**
1. Request CVs for all proposed audit team members
2. For each auditor, verify: university-equivalent professional education in a relevant field
   — documented with institution and qualification
3. For each auditor, verify: at least 4 years of full-time practical workplace experience in
   IT or data protection — documented with employer names, roles, and dates
4. For each auditor, verify: at least 1 year of that experience specifically related to AI
   systems — this must be explicit AI work, not general IT that incidentally involved AI tools
5. For each auditor, verify: completion of AIMS-specific auditor training — request certificates
   or training completion records with dates and course details
6. For the proposed audit team leader, additionally verify: active participation in all stages
   of at least 3 management system audits per Clause 7.2.2.4, covering scoping, document
   review, risk assessment review, and formal reporting

**Pass Criteria:**
- All proposed auditors have university-equivalent education documented
- All proposed auditors have 4+ years IT or data protection experience documented with dates
- All proposed auditors have 1+ year explicit AI systems experience documented
- All proposed auditors have AIMS-specific training completion documented
- Proposed audit team leader has participated in all stages of at least 3 management system
  audits

**Expected Evidence:**
- CVs with dates, roles, and employers sufficient for experience verification
- Training certificates for AIMS-specific auditor training (with course name, provider, date)
- Audit team leader's audit history records demonstrating the 3-audit requirement

**Common Failures:**
- "AI-related experience" counted from a general IT role that included one AI project —
  the 1-year requirement means dedicated AI work, not peripheral involvement
- AIMS-specific training is a brief online course; substantive AIMS auditor training must cover
  ISO/IEC 42001 requirements and audit methodology in meaningful depth
- Audit team leader's experience is from second-party or internal audits only; third-party
  certification audit experience is a distinct category
- CVs provided only for the lead auditor; supporting team members not documented

---

### TC-42006-005: Competence Maintenance and CPD Program

**Control Reference:** ISO/IEC 42006:2025 Clause 7.2 — Maintaining competence
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:** Verify that the CB has a continuous professional development (CPD) program for
AIMS auditors that keeps competence current as AI standards, regulations, and technology evolve.

**Prerequisites:**
- CB auditor competence maintenance procedure
- CPD records for proposed auditors covering the past 12 months

**Test Steps:**
1. Request the CB's auditor competence maintenance procedure
2. Verify the procedure defines minimum CPD requirements for AIMS auditors, including: minimum
   annual audit activity to maintain practical skills, training on standard updates, and
   regulatory change monitoring
3. Request CPD records for the proposed audit team members for the past 12 months
4. Verify CPD activities are substantive and AI-relevant: standard updates must be specific to
   AIMS (not general ISO management system updates); regulatory content must cover AI Act
   developments and national AI regulations in client jurisdictions
5. Verify the CB has a process for updating auditor competence when significant changes occur
   (e.g., EU AI Act enforcement milestones, ISO/IEC 42001 amendments, new ISO/IEC SC 42
   publications)
6. Ask: how does the CB ensure auditors remain current on AI regulatory developments in
   jurisdictions where their clients operate?

**Pass Criteria:**
- CPD program is defined with minimum activity levels specific to AIMS auditors
- CPD records show substantive AI-relevant training completed in the past 12 months
- Regulatory update process exists and is demonstrated through recent training records
- Minimum annual audit activity maintained (sufficient to keep practical skills current)

**Expected Evidence:**
- Auditor CPD procedure with AIMS-specific requirements
- CPD records for proposed auditors
- Training records for AI regulatory and standard updates

**Common Failures:**
- CPD program exists for general management system auditors but has no AIMS-specific
  requirements or minimum activity levels
- Proposed auditors have not conducted any AIMS audits in the past 12 months despite being
  listed as AIMS-qualified
- No process for regulatory updates; EU AI Act developments not reflected in auditor knowledge
  or CPD records

---

## Clause 8: Certification Documents and Confidentiality

---

### TC-42006-006: AIMS Certificate Document Requirements

**Control Reference:** ISO/IEC 42006:2025 Clause 8.2.2 — AIMS certification documents
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:** Verify that the CB's AIMS certificate template includes all required elements
from Clause 8.2.2, including the SoA version reference that is unique to AIMS certification
and the no-labelling statement.

**Prerequisites:**
- CB's AIMS certificate template
- Sample issued AIMS certificate (if available)

**Test Steps:**
1. Request the CB's AIMS certificate template
2. Verify the template includes the two elements required by Clause 8.2.2 that are additional
   to ISO/IEC 17021-1:2015 Clause 8.2.2:
   a. Version of the Statement of Applicability (SoA) on which the certification is based
   b. The statement that the AIMS certificate does NOT authorize the labelling of products,
      processes, and services
3. Verify the SoA version reference is specific — linking the certificate to a dated, versioned
   SoA document, not a generic reference to "the organization's SoA"
4. Verify the scope statement on the certificate is substantive: identifies which AI management
   activities are covered (not just "AI management per ISO/IEC 42001")
5. If a sample issued certificate is available, verify the same elements are present in the
   issued certificate as in the template

**Pass Criteria:**
- Certificate template includes the SoA version reference (Clause 8.2.2 a)
- Certificate template includes the no-labelling statement (Clause 8.2.2 b)
- SoA version reference is specific and links to a particular SoA version
- Scope statement is substantive

**Expected Evidence:**
- AIMS certificate template
- Sample issued AIMS certificate (if available)

**Common Failures:**
- CB has adapted an ISO/IEC 27001 certificate template for AIMS without adding the SoA version
  reference — this element is unique to AIMS certification
- The no-labelling statement is absent; its presence is required because ISO/IEC 42001
  certification does not attest to the quality of individual AI system outputs
- Scope statement reads "Management of artificial intelligence systems" without identifying
  which AI systems, activities, or organizational units are actually covered

---

### TC-42006-007: Confidentiality and Access to Client Documentation

**Control Reference:** ISO/IEC 42006:2025 Clause 8.4.2 — Access to the documentation of
the organization
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:** Verify that the CB has a procedure for handling situations where AIMS-related
documentation (e.g., records of control effectiveness, source code, raw data) cannot be made
available because it is confidential or sensitive, and that appropriate access arrangements
are established in the certification agreement.

**Prerequisites:**
- CB certification agreement template
- CB confidentiality procedure

**Test Steps:**
1. Request the CB's certification agreement template and confidentiality procedure
2. Verify the certification agreement requires the client to report in advance if any AIMS
   documentation that the audit team needs cannot be made available due to confidentiality
   or sensitivity
3. Verify the CB's procedure requires it to determine whether the AIMS can be adequately
   audited in the absence of restricted documentation before the audit proceeds
4. Verify the procedure states that if the CB concludes adequate auditing is not possible
   without the restricted information, it will advise the client that the audit cannot take
   place until appropriate access arrangements are granted
5. Verify the certification agreement includes provisions for safeguarding confidential
   information, intellectual property, and trade secrets per Clause 8.4.2 and
   ISO/IEC 17021-1:2015 Clause 5.1.2
6. Interview the audit lead: describe a scenario where a client's AI system source code is
   needed for audit but marked trade secret — what is the procedure?

**Pass Criteria:**
- Certification agreement requires advance notification of documentation restrictions
- CB procedure requires adequacy determination before the audit proceeds
- CB will decline to proceed if adequate auditing is not possible without restricted materials
- Safeguard provisions for confidential information are in the certification agreement

**Expected Evidence:**
- Certification agreement template with documentation access provisions
- Confidentiality safeguard provisions
- CB procedure for handling restricted documentation

**Common Failures:**
- Certification agreement contains only a generic confidentiality clause; no provision for
  the client to notify the CB of documentation restrictions in advance
- No procedure for the CB to assess audit adequacy when documentation is withheld; the audit
  proceeds regardless
- Safeguard provisions for trade secrets and intellectual property absent from the agreement

---

## Clause 9: Process Requirements

---

### TC-42006-008: Audit Programme — Stakeholder Role Identification

**Control Reference:** ISO/IEC 42006:2025 Clause 9.1.2 — Audit programme
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:** Verify that the CB's audit programme covers all applicable management system
requirements and identifies the stakeholder role(s) of the client organization (AI producer,
AI provider, AI customer), and that this identification influences the audit scope and focus.

**Prerequisites:**
- CB audit programme procedure
- Sample audit plan from a comparable AIMS engagement

**Test Steps:**
1. Request the CB's AIMS audit programme procedure
2. Verify the procedure includes a step to identify the client's AI value chain role(s): AI
   producer, AI provider, AI customer — and acknowledges that clients may occupy multiple
   roles simultaneously per Clause 9.1.2 Note 1
3. Request a sample audit plan from a recent AIMS engagement; verify the client's AI value
   chain role(s) are documented in the audit plan
4. Verify the audit plan demonstrates that role identification influenced the scope and focus:
   an AI producer should have lifecycle and development controls examined more thoroughly;
   an AI customer should have supplier assessment and due diligence examined more thoroughly
5. Ask the audit lead: "For an organization that both develops AI systems and deploys
   third-party AI, how would you plan the audit differently than for an organization that
   only uses third-party AI?"

**Pass Criteria:**
- Audit programme procedure includes AI value chain role identification as a defined step
- Sample audit plan documents the client's role(s)
- Audit scope and focus demonstrably reflects the identified role(s)
- Audit lead articulates how role identification affects audit planning and focus

**Expected Evidence:**
- Audit programme procedure with AI stakeholder role identification step
- Sample audit plan with AI value chain role documented and scope derived from it

**Common Failures:**
- AI value chain role identification absent from audit planning; all AIMS clients audited
  against the same scope regardless of whether they develop or only deploy AI
- Role identified in the audit plan but audit scope is identical for AI producers and AI
  customers — the role does not actually affect what is examined

---

### TC-42006-009: Scope of Certification — SoA Completeness Challenge

**Control Reference:** ISO/IEC 42006:2025 Clause 9.1.3 — Scope of certification
**Test Type:** Process Review + Interview
**Assessor:** Lead Assessor + Technical Assessor

**Objective:** Verify that the CB ensures the client's certification scope definition includes
all significant processes and risks relevant to the AI system, and that the SoA reflects this
scope — not passive acceptance of the client's scope boundaries.

**Prerequisites:**
- CB scope review procedure
- Sample Stage 1 report showing scope assessment from a comparable AIMS engagement

**Test Steps:**
1. Request the CB's procedure for reviewing the client's certification scope and SoA during
   Stage 1
2. Verify the procedure requires the CB to confirm that the scope includes all significant AI
   system processes and risks — not just that Annex A controls are each either included or
   excluded with a justification
3. Verify the procedure requires the CB to identify interfaces to services or activities not
   entirely within the AIMS scope of applicability (e.g., shared IT infrastructure, outsourced
   AI functions) and confirm they are addressed in the client's risk assessment per Clause 9.2.1.3
4. Request a sample Stage 1 report; verify the CB documented its completeness assessment of
   the scope and SoA — not merely acknowledged receipt
5. Ask the audit lead: "In a recent AIMS audit, did you identify any AI systems or risks the
   client had excluded from the SoA that you believed should be included? If so, what happened?"
6. Verify the procedure specifies what happens when the CB finds the scope materially incomplete:
   does the CB require expansion before proceeding to Stage 2?

**Pass Criteria:**
- Scope review procedure requires active completeness assessment, not passive acceptance
- Scope review addresses interfaces to activities outside the AIMS scope boundary
- Sample Stage 1 report documents the CB's scope completeness finding
- Procedure specifies required action when scope is found to be materially incomplete
- Audit lead can describe the process for challenging scope exclusions

**Expected Evidence:**
- Scope review procedure
- Sample Stage 1 report with scope completeness assessment section

**Common Failures:**
- SoA review limited to confirming Annex A controls are each addressed; no independent
  challenge of whether significant AI risks or systems have been excluded from scope
- CB accepts client's assertion that certain AI systems are "out of scope" without investigating
  whether those systems carry significant AI risks that belong within the AIMS
- Interfaces to outsourced AI services or shared infrastructure not examined

---

### TC-42006-010: Audit Time Calculation — Annex A Methodology

**Control Reference:** ISO/IEC 42006:2025 Clause 9.1.4.2 — Audit time; Annex A (normative)
**Test Type:** Document Review + Calculation Review
**Assessor:** Lead Assessor

**Objective:** Verify that the CB calculates AIMS audit time using the normative Annex A
methodology with AI-specific adjustment factors applied to the defined scope under ISO/IEC
42001, and not a generic management system audit time estimate.

**Prerequisites:**
- CB's audit time calculation methodology
- Specific audit time calculation for the engagement (or a comparable sample calculation)

**Test Steps:**
1. Request the CB's audit time calculation for this engagement (or a sample for a comparable
   organization)
2. Verify the calculation uses the normative Annex A base table: base time is derived from the
   number of persons involved in AI lifecycle activities within the certification scope — not
   total organizational headcount
3. Verify that AI-specific adjustment factors from Annex A are applied where applicable:
   - Additional AI systems in scope (beyond the base number): additional auditor days applied
   - High-risk or sensitive AI systems in scope: additional auditor days applied
   - Regulatory frameworks in scope: additional auditor days applied per framework
   - Third-party AI agreements in scope: additional auditor days applied
   - SoA controls beyond the baseline: additional auditor days applied
4. Verify the calculation methodology uses Annex A as required by Clause 9.1.4.2 — the
   standard explicitly states the CB shall use Clause 9.1.4 and Annex A to determine audit
   time for the defined scope under ISO/IEC 42001
5. Verify the proposed audit time is consistent with the Annex A calculation result — not a
   round number indicating a generic estimate was used
6. Ask: walk through the Annex A calculation for this specific organization

**Pass Criteria:**
- Audit time calculated using Annex A base table with persons in AI lifecycle as the input
- All applicable AI-specific adjustment factors identified and applied
- Proposed audit time is consistent with the Annex A calculation
- CB can walk through the methodology applied to this specific engagement

**Expected Evidence:**
- Audit time calculation worksheet showing Annex A methodology step by step
- Proposed audit time with documented calculation basis

**Common Failures:**
- Audit time quoted as a standard fixed duration regardless of organizational complexity —
  generic estimate, not the Annex A calculation Clause 9.1.4.2 requires
- Calculation uses total headcount instead of persons involved in AI lifecycle activities
  (incorrect base table input per Annex A)
- High-risk AI systems not applied as an adjustment factor despite client having EU AI Act
  Annex III systems in scope

---

### TC-42006-011: Initial Certification — Stage 1 and Stage 2 Requirements

**Control Reference:** ISO/IEC 42006:2025 Clause 9.3.2.1 — Stage 1; Clause 9.3.2.2 — Stage 2
**Test Type:** Process Review + Sample Audit Report Review
**Assessor:** Lead Assessor

**Objective:** Verify that the CB's Stage 1 audit obtains the documentation required by
ISO/IEC 42001 and assesses the client's readiness for Stage 2, and that Stage 2 confirms
effective implementation of the AIMS and the client's adherence to its own policies,
objectives, and procedures.

**Prerequisites:**
- CB's initial certification audit procedure
- Sample Stage 1 audit report from a comparable AIMS engagement
- Sample Stage 2 audit plan from a comparable AIMS engagement

**Test Steps:**
1. Request the CB's initial certification audit procedure
2. Verify the Stage 1 procedure requires the CB to: obtain AIMS documentation covering what
   is required by ISO/IEC 42001, gain sufficient understanding of the AIMS design in the
   context of the client's organization (including risk assessment and management, AI policy
   and objectives, and information security policy per Clause 9.3.2.1), and assess the
   client's readiness for Stage 2
3. Verify Stage 1 results are documented in a written report per Clause 9.3.2.1
4. Verify the procedure requires review of the Stage 1 report before deciding whether to
   proceed to Stage 2, and confirmation that the Stage 2 audit team has the necessary
   competence per Clause 9.3.2.1
5. Request a sample Stage 1 report; verify it documents the AIMS design assessment and
   readiness determination — not just a document receipt list
6. Verify Stage 2 procedure confirms: effective implementation of the AIMS and that the
   client adheres to its own policies, objectives, and procedures per Clause 9.3.2.2
7. Ask: what would cause the CB to delay Stage 2 or require additional preparation by
   the client?

**Pass Criteria:**
- Stage 1 procedure requires substantive AIMS design assessment, not just document receipt
- Stage 1 report documents the readiness determination in writing
- Stage 1 report reviewed before proceeding to Stage 2; Stage 2 team competence confirmed
- Stage 2 procedure addresses effective implementation and adherence to client's own AIMS

**Expected Evidence:**
- Initial certification audit procedure
- Sample Stage 1 audit report with design assessment and readiness determination
- Sample Stage 2 audit plan derived from Stage 1 findings

**Common Failures:**
- Stage 1 described as a remote document checklist exercise lasting a few hours; insufficient
  for the substantive AIMS design assessment and readiness determination Clause 9.3.2.1 requires
- Stage 1 report is a document receipt list only; no design assessment or readiness finding
- Stage 2 team competence not confirmed before proceeding — Clause 9.3.2.1 explicitly
  requires this confirmation

---

### TC-42006-012: Surveillance Programme — Adaptation to AI System Risks and Changes

**Control Reference:** ISO/IEC 42006:2025 Clause 9.6.2.2 — Surveillance audits
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:** Verify that the CB's surveillance programme is adapted to address AI system
issues related to risks and effects on the client, and that surveillance audit reports include
the required elements specific to AIMS surveillance.

**Prerequisites:**
- CB's surveillance programme procedure
- Sample surveillance audit plan and report from a comparable AIMS engagement

**Test Steps:**
1. Request the CB's surveillance programme procedure for AIMS certifications
2. Verify the procedure requires adaptation of the surveillance programme to address AI system
   issues related to risks and effects on the client per Clause 9.6.2.2 — and that this
   adaptation is justified and documented
3. Verify the procedure requires surveillance audits to review records of appeals and complaints
   submitted to the CB per Clause 9.6.2.2
4. Verify the procedure requires verification that the client has investigated nonconformities
   and taken appropriate corrective action per Clause 9.6.2.2
5. Verify that surveillance audit reports include: information on resolution of previously
   discovered nonconformities, the current SoA version, and significant AIMS changes since
   the last audit — all required elements per Clause 9.6.2.2
6. Request a sample surveillance audit report; verify these required elements are present
7. Ask: "If a client deployed a new high-risk AI system after initial certification, how would
   you adapt their surveillance programme? Would the scope change?"

**Pass Criteria:**
- Surveillance procedure requires scope adaptation based on AI system risks and effects on
  the client, with documented justification
- Surveillance audit reports include: nonconformity resolution, current SoA version, and
  significant AIMS changes since last audit
- Appeals and complaints records reviewed as part of surveillance
- Corrective action effectiveness verified during surveillance

**Expected Evidence:**
- Surveillance programme procedure
- Sample surveillance audit report containing all required Clause 9.6.2.2 elements

**Common Failures:**
- Surveillance is a fixed-scope annual checklist regardless of AI system changes or risks
  since initial certification — no adaptation justified or documented
- Surveillance report does not record the current SoA version or significant AIMS changes
  since the last audit — both are explicit Clause 9.6.2.2 requirements
- Appeals and complaints not reviewed as part of surveillance
- Corrective action from previous nonconformities not verified for effectiveness

---
