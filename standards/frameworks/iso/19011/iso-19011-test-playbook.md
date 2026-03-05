---
type: reference
name: iso-19011-test-playbook
category: compliance
classification: public
version: 2.0
last_updated: "2026-02-23"
framework: "ISO 19011:2011"
---

# ISO 19011:2011 Test Playbook

Executable test cases for evaluating an organization's audit programme management, individual
audit execution quality, and auditor competence against ISO 19011:2011 guidelines. Use these
test cases when assessing the quality of an internal audit programme, evaluating auditor
competence, or preparing for management system certification where Clause 9.2 internal audit
evidence is required.

**Related:** `iso-19011-assessor-playbook.md` (interview guides and scoring rubric), `iso-19011-handbook.md` (framework overview)

---

## How to Use This Playbook

ISO 19011:2011 is a guidelines standard — it uses "should" language, not certifiable
requirements. These test cases evaluate audit programme maturity and individual audit
execution quality. Apply them to evaluate an internal audit programme (where the organization
is both client and subject), a second-party audit programme, or the audit quality of a
certification body during an AIMS assessment readiness review.

Mark each test case as:
- **PASS:** All pass criteria met, evidence collected
- **PARTIAL:** Some criteria met; specify which criteria failed
- **FAIL:** Pass criteria not met; document gap indicators observed

Total test cases: **12** covering Clause 5 (managing an audit programme), Clause 6
(performing an audit), and Clause 7 (auditor competence and evaluation).

---

## Clause 5: Managing an Audit Programme

---

### TC-19011-001: Audit Programme Objectives Established

**Control Reference:** ISO 19011:2011 Clause 5.2 — Establishing audit programme objectives
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that the audit programme has documented objectives consistent with management system
policy and objectives, and taking into account the size and nature of the auditee and relevant
risks, as required by Clause 5.2.

**Prerequisites:**
- Audit programme documentation
- Management system policy and objectives for the management system being audited

**Test Steps:**
1. Request the audit programme documentation
2. Verify the programme contains explicit documented objectives — Clause 5.2 lists factors
   to consider when establishing objectives: management priorities, management system intent,
   requirements of interested parties, auditee characteristics and performance, and risks to
   the auditee
3. Verify the objectives are consistent with the management system policy and objectives
   (i.e., an AIMS audit programme should reflect AIMS policy commitments, not generic
   quality management objectives)
4. Verify the objectives address at minimum one of the purposes listed in Clause 5.2: to
   fulfil requirements of a management system standard, to verify conformity with contractual
   requirements, to obtain and maintain confidence in a supplier's capability, or to evaluate
   the management system's continued suitability
5. Verify objectives are specific enough to evaluate whether the programme achieved them —
   generic statements like "ensure quality" with no measurable or evaluable outcome do not
   satisfy the intent of Clause 5.2
6. Request evidence that audit resources are allocated in alignment with objectives

**Pass Criteria:**
- Documented programme objectives exist as a distinct element of the audit programme
- Objectives are consistent with the management system policy and objectives
- Objectives reflect the specific management system being audited (not generic objectives
  copied from an unrelated programme)
- Objectives are evaluable, not merely aspirational

**Expected Evidence:**
- Audit programme document with a dedicated objectives section
- Cross-reference to management system policy and objectives
- Resource allocation showing alignment with stated objectives

**Common Failures:**
- Audit programme consists of a schedule calendar only; no objectives section exists
- Objectives copied verbatim from an ISO 9001 audit programme without adaptation for AI
  management system content
- Objectives defined once at programme establishment, never reviewed when the management
  system or organizational context materially changed

---

### TC-19011-002: Audit Programme Risks Identified and Managed

**Control Reference:** ISO 19011:2011 Clause 5.3.1 — General (establishing the audit programme)
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that risks to the audit programme itself have been identified and that appropriate
actions are in place to address those risks, as Clause 5.3.1 requires the audit programme
manager to identify and present risks to the programme.

**Prerequisites:**
- Audit programme documentation
- Audit programme manager available for interview

**Test Steps:**
1. Request the audit programme documentation; look for a risk identification section or
   associated risk record
2. Verify risks to the audit programme itself have been identified — Clause 5.3.1 notes
   examples: failure to achieve programme objectives, failure to provide enough audit time,
   auditor availability, auditor competence gaps, resource constraints
3. Interview the audit programme manager: "What risks have you identified that could prevent
   the audit programme from achieving its objectives? What have you done to address them?"
4. Verify that identified risks have corresponding mitigating actions with owners
5. Verify the audit programme manager has been assigned the appropriate authority and
   competence as required by Clause 5.3.2 — the programme requires a responsible person
   with defined responsibilities to establish, implement, monitor, review, and improve it
6. Verify that audit programme risks are reviewed at defined intervals (not only at
   programme establishment)

**Pass Criteria:**
- Risks to the audit programme identified and documented
- Mitigating actions documented with owners for identified risks
- Audit programme manager role is formally defined with authority commensurate with
  the Clause 5.3.2 responsibility list
- Programme risk review scheduled at defined intervals

**Expected Evidence:**
- Audit programme risk record or risk section within programme documentation
- Audit programme manager role description confirming Clause 5.3.2 responsibilities
- Evidence of periodic programme risk review

**Common Failures:**
- No identification of risks to the audit programme; the only "risk" documented is "we
  might miss a finding" — not programme risks
- Audit programme managed informally by someone with no defined role or authority
- Programme risks identified at programme launch, never reviewed subsequently

---

### TC-19011-003: Risk-Based Audit Programme Scheduling

**Control Reference:** ISO 19011:2011 Clause 5.4 — Implementing the audit programme
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that audit scheduling reflects the significance and complexity of the processes being
audited, previous audit results, and identified risks, as required by Clause 5.4. Audit
frequency and depth should not be distributed equally across all areas irrespective of risk.

**Prerequisites:**
- Audit programme schedule for the current audit cycle
- Risk assessment or significance assessment underlying the schedule
- Prior audit results and nonconformity records

**Test Steps:**
1. Request the audit programme schedule for the current cycle and the prior cycle
2. Verify the schedule differentiates allocation by area: Clause 5.4 requires the programme
   manager to consider the management system standard requirements, complexity and interaction
   of processes, previous audit results, and language and cultural aspects
3. Verify that areas with prior nonconformities or significant risks receive more audit
   attention than stable, low-risk areas
4. Interview the audit programme manager: "How did you decide how much time to allocate
   to each area? What factors influenced that allocation?"
5. Verify the schedule is not identical year-over-year without justification — Clause 5.4
   requires the programme to be updated based on monitoring and review results (Clause 5.5-5.6)
6. Verify coordination with audit team leaders occurred when developing the schedule, per
   Clause 5.4 requirements

**Pass Criteria:**
- Schedule shows differentiated allocation by area (not equal-time distribution)
- Risk-based allocation rationale is documented or articulable by the programme manager
- Areas with prior nonconformities receive demonstrably more attention
- Schedule varies across cycles in response to changes in risk or findings (not static repeat)

**Expected Evidence:**
- Audit programme schedule with time allocation by area
- Documentation or interview record of risk-based rationale for current schedule
- Prior audit nonconformity records showing how they influenced current scheduling

**Common Failures:**
- All management system clauses allocated identical time slots regardless of risk,
  complexity, or prior nonconformity history
- Programme schedule identical for three consecutive cycles with no documented rationale
- "Risk-based" stated in programme documentation but no risk assessment exists to
  support the schedule; allocation appears arbitrary

---

### TC-19011-004: Auditor Competence and Independence Verification

**Control Reference:** ISO 19011:2011 Clause 5.4 — Implementing the audit programme (auditor selection) and Clause 5.3.3 — Competence of the audit programme manager
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that auditors are selected based on verified competence relevant to the audit scope
and that impartiality and independence are confirmed before each audit assignment, as required
by Clause 5.4. Clause 5.3.3 also requires the audit programme manager to have competence
to manage the programme effectively.

**Prerequisites:**
- Auditor qualification records
- Audit team assignment records for recent audits
- Independence confirmation procedure

**Test Steps:**
1. Request auditor qualification records for the audit team assigned to the most recent
   internal audit
2. Verify each auditor's competence was assessed against the specific audit scope — Clause
   5.4 requires auditors to have the knowledge and skills appropriate to the audit objectives
3. Request the independence confirmation procedure and records for the most recent audit
   assignment
4. Verify impartiality was confirmed: Clause 5.4 requires selecting auditors who are
   objective and free from bias and conflict of interest; internal auditors should not
   audit their own team's processes or areas they directly implemented
5. For each assigned auditor, confirm they were not involved in implementing the processes
   they are auditing
6. Verify the audit programme manager has the competence defined in Clause 5.3.3: awareness
   of audit principles, management system standards, and relevant legal and regulatory
   requirements

**Pass Criteria:**
- Auditor competence verified against audit scope before assignment
- Impartiality and independence confirmed for each auditor assignment (documented)
- No auditor assigned to audit their own processes or areas they implemented
- Audit programme manager competence meets Clause 5.3.3 requirements

**Expected Evidence:**
- Auditor qualification records
- Independence or impartiality confirmation records per audit assignment
- Audit team assignment records showing scope match to qualifications
- Audit programme manager competence assessment record

**Common Failures:**
- Internal auditor assigned to audit the AI development process they also designed and
  implemented — direct impartiality violation per Clause 5.4
- Competence verification consists solely of confirming an auditor holds a lead auditor
  certification, without verifying domain-specific knowledge relevant to the audit scope
- Independence check not documented; "we assumed there was no conflict" without a
  structured screening

---

### TC-19011-005: Audit Programme Records Maintained

**Control Reference:** ISO 19011:2011 Clause 5.5 — Monitoring the audit programme and Clause 5.3.5 — Records
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that audit programme records are maintained as required by Clause 5.3.5 (records of
implementation, auditor competence and evaluation, programme review results) and that
programme monitoring is conducted per Clause 5.5.

**Prerequisites:**
- Audit programme records from the past two audit cycles
- Programme performance review records

**Test Steps:**
1. Request audit programme records for the past two audit cycles; verify records exist
   for each planned audit: audit plan, audit report, nonconformity records, corrective
   action tracking, and follow-up verification
2. Verify Clause 5.3.5 record types are maintained: individual audit records (plans,
   reports, NCRs), auditor competence and evaluation records, and programme review results
3. Verify programme performance monitoring records exist per Clause 5.5: has the programme
   been reviewed for effectiveness? What metrics or indicators were used?
4. Verify the programme review assessed: whether audit objectives were achieved, whether
   audit team performance was adequate, whether the schedule was completed, and whether
   the programme should be adjusted
5. Verify audit programme performance was reported to top management — Clause 5.6 requires
   programme review results to include improvement needs and reporting to top management

**Pass Criteria:**
- Complete audit programme records maintained for both audit cycles reviewed
- All three Clause 5.3.5 record types present (individual audit records, auditor
  competence records, programme review records)
- Programme performance review conducted at least once per cycle
- Review used criteria to evaluate effectiveness
- Audit programme results reported to appropriate management level

**Expected Evidence:**
- Audit programme records (plans, reports, NCRs, corrective action tracking)
- Auditor competence and evaluation records
- Programme performance review records
- Management reporting on audit programme results

**Common Failures:**
- Individual audit reports exist but no programme-level records; effectiveness of
  the overall programme cannot be assessed
- Programme "reviewed" informally with no documentation; Clause 5.5 requires monitoring
  with documented results
- Audit programme results not communicated to top management; management receives
  individual audit reports only, not programme-level trend data

---

## Clause 6: Performing an Audit

---

### TC-19011-006: Audit Objectives, Scope, and Criteria Defined

**Control Reference:** ISO 19011:2011 Clause 6.2.2 — Defining audit objectives, scope, and criteria
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that each individual audit has explicitly defined objectives, scope, and criteria
as required by Clause 6.2.2 — these are the foundational inputs to audit planning and
must be established before the audit plan is prepared.

**Prerequisites:**
- Audit initiation documentation for the most recently completed internal audit
- Audit plan for the same audit

**Test Steps:**
1. Request the audit initiation documentation for the most recently completed internal audit
2. Verify the audit objectives are defined per Clause 6.2.2: what the audit is intended to
   accomplish — examples include determining conformity of the management system with audit
   criteria, evaluating capability to ensure compliance, evaluating effectiveness of the
   system in meeting objectives
3. Verify audit scope is defined: Clause 6.2.2 requires scope to describe extent and
   boundaries — physical locations, organizational units, activities and processes, and
   time period covered
4. Verify audit criteria are defined: Clause 6.2.2 requires the reference against which
   conformity is determined — applicable management system standards, policies, procedures,
   regulatory requirements, or contractual requirements
5. Verify the defined objectives, scope, and criteria were used as inputs to the audit
   plan (Clause 6.4.1 requires the plan to be consistent with these inputs)

**Pass Criteria:**
- Audit objectives explicitly defined before audit planning commenced
- Audit scope defines extent and boundaries (locations, units, activities, time period)
- Audit criteria identify the specific requirements against which conformity is assessed
- Audit plan demonstrably derived from the defined objectives, scope, and criteria

**Expected Evidence:**
- Audit initiation record with objectives, scope, and criteria
- Audit plan consistent with the initiation record

**Common Failures:**
- Audit plan prepared without prior definition of objectives, scope, and criteria —
  planning began without the Clause 6.2.2 inputs established
- Scope defined only as "all ISO 42001 clauses" without specifying organizational units,
  locations, or activities covered
- Criteria listed generically as "ISO 42001" without identifying which version or
  whether sector-specific requirements are also criteria

---

### TC-19011-007: Document Review Conducted Before On-Site Activities

**Control Reference:** ISO 19011:2011 Clause 6.3 — Conducting document review
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that relevant management system documentation was reviewed before on-site audit
activities commenced, as required by Clause 6.3 — the document review determines the
audit feasibility and informs the audit plan.

**Prerequisites:**
- Document review records from the most recent internal audit
- Audit plan showing how document review findings influenced planning

**Test Steps:**
1. Request document review records from the most recent internal audit
2. Verify documents reviewed included: management system documentation relevant to the
   audit scope, records of previous audits, and Clause 6.3 notes reviewing applicable
   documents including policies, objectives, procedures, and previous audit reports
3. Verify the document review was conducted before on-site activities — Clause 6.3 states
   this review should take place before on-site audit activities; if documents were only
   reviewed during the audit, this is a process gap
4. Verify the document review result was used to determine audit feasibility per Clause
   6.3 — if documentation is inadequate, the audit team leader should report this to the
   audit client and programme manager before proceeding
5. Ask the audit team leader: "What did you find in your document review that influenced
   how you planned the on-site activities? Were there any gaps in the documentation?"

**Pass Criteria:**
- Document review conducted and recorded before on-site audit activities commenced
- Documents reviewed include: policies, procedures, prior audit reports, and records
  relevant to the audit scope
- Document review findings influenced the audit plan (evidence of the linkage)
- Gaps or inadequacies in documentation were escalated rather than silently accepted

**Expected Evidence:**
- Document review records with list of documents reviewed and review date
- Audit plan showing how document review findings informed risk emphasis or scope adjustments
- Any escalation records if documentation gaps were found

**Common Failures:**
- Document review conducted during the on-site audit rather than before — document
  review did not inform audit planning
- Documents reviewed listed by title only with no record of what was found or concluded
- Documentation gaps found but not escalated; on-site audit proceeded without addressing
  the feasibility question per Clause 6.3

---

### TC-19011-008: Audit Plan Quality

**Control Reference:** ISO 19011:2011 Clause 6.4.1 — Preparing the audit plan
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that individual audit plans are documented before on-site activities commence,
containing all elements required by Clause 6.4.1 and demonstrating risk-based allocation
of audit time.

**Prerequisites:**
- Audit plan for the most recently completed internal audit

**Test Steps:**
1. Request the audit plan for the most recently completed internal audit
2. Verify the plan includes all Clause 6.4.1 required elements: audit objectives; audit
   scope including identification of organizational and functional units and processes to
   be audited; audit criteria and reference documents; locations and dates; expected time
   and duration for each major audit activity; roles and responsibilities of audit team
   members; allocation of appropriate resources to critical areas of the audit; identification
   of the audit team leader; reference to documents needed on-site; any confidentiality
   requirements; and any follow-up audit actions from a previous audit
3. Verify time allocation in the plan reflects risk-based emphasis: areas with prior
   nonconformities or higher assessed risk should receive more time
4. Verify the plan was prepared with meaningful preparation time before the audit commenced
5. Verify the plan was communicated to the auditee with sufficient notice to allow them
   to prepare — Clause 6.4.1 requires the plan to be presented to the auditee before
   on-site activities begin
6. Verify any objections from the auditee to the plan were resolved before activities began

**Pass Criteria:**
- Audit plan exists as a formal document (not a meeting invitation or informal note)
- All Clause 6.4.1 required elements are present
- Time allocation reflects risk-based prioritization
- Plan prepared and communicated to auditee in advance of on-site activities
- Auditee objections, if any, resolved and documented

**Expected Evidence:**
- Audit plan document with creation date
- Evidence the plan was communicated to the auditee before the audit (email or distribution record)
- Record of any plan modifications following auditee review

**Common Failures:**
- Audit plan is a single-line agenda entry with no structure, no time allocation, and no
  scope or criteria reference
- Time allocation divides the available audit time equally across all clauses regardless
  of risk, complexity, or prior nonconformity history
- Plan shared with auditee on the morning of the audit; no opportunity for meaningful
  preparation — violates the Clause 6.4.1 communication requirement

---

### TC-19011-009: On-Site Audit Activities — Evidence Collection Methods

**Control Reference:** ISO 19011:2011 Clause 6.5.5 — Collecting and verifying information
**Test Type:** Audit Record Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that auditors collect and verify information using appropriate sampling and multiple
evidence collection methods as required by Clause 6.5.5, and do not rely exclusively on
document review.

**Prerequisites:**
- Working notes or evidence collection records from the most recently completed audit
- Audit team member available for interview

**Test Steps:**
1. Request the audit working notes or evidence collection records from the most recent audit
2. Verify evidence collection methods used: Clause 6.5.5 lists interviews, observation of
   activities, document and record review, data analysis, and sampling — verify at least
   three methods were applied
3. Verify the audit included interviews with multiple levels of personnel — not only senior
   management and not only technical staff; Clause 6.5.5 emphasizes that information
   obtained through interview should be verified through other sources
4. Verify corroboration occurred: claims made in interviews were cross-checked against
   documents or records, not accepted at face value — this is a Clause 6.5.5 explicit
   requirement (verify information collected during interviews by other independent
   sources such as observation, records, and results)
5. Verify that audit trails were followed when interviews or records revealed unexpected
   issues — Clause 6.5.6 requires auditors to evaluate all collected information and
   evidence against the audit criteria; unexpected findings should be pursued, not ignored
6. Verify opening and closing meetings were conducted — Clause 6.5.1 (opening meeting)
   and Clause 6.5.8 (closing meeting) are required on-site activities

**Pass Criteria:**
- At minimum three evidence collection methods applied (typically interviews, document
  review, and record review)
- Interviews conducted across multiple levels and roles
- Interview claims corroborated with documentary or observational evidence
- Opening meeting and closing meeting both conducted and recorded
- Audit trails followed when unexpected issues emerged during fieldwork

**Expected Evidence:**
- Audit working notes documenting evidence collection methods used
- Interview records with interviewee role and topic documented
- Corroboration records (interview claim cross-referenced with document)
- Opening and closing meeting attendance records or minutes

**Common Failures:**
- Audit conducted entirely by document review; no interviews or observation conducted —
  process execution not verified, only documentation reviewed
- Only senior management interviewed; operational staff views not captured; discrepancy
  between documented procedures and actual practice not detected
- Audit checklist followed mechanically; when interviews reveal an issue outside the
  planned scope, it is noted as "out of scope" and not followed — Clause 6.5.6 requires
  pursuing findings wherever the evidence leads

---

### TC-19011-010: Audit Finding Documentation Quality

**Control Reference:** ISO 19011:2011 Clause 6.5.6 — Generating audit findings
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that audit findings are generated and documented with objective evidence, specific
requirement references, and consistent classification, as required by Clause 6.5.6.

**Prerequisites:**
- Audit findings from the most recently completed audit (5-10 findings of mixed severity)

**Test Steps:**
1. Request the audit findings from the most recently completed audit
2. For each finding, verify three elements are present per Clause 6.5.6:
   - The specific requirement not met: clause and requirement reference (not just the
     clause number — the specific requirement within that clause)
   - The objective evidence observed: specific facts observed, not the auditor's
     interpretation — what was seen, said, or documented
   - The conformity determination: conformity, nonconformity, or opportunity for
     improvement per Clause 6.5.6
3. Verify findings are factual: Clause 6.5.6 states findings result from evaluating
   collected evidence against audit criteria — findings should reflect the evidence, not
   the auditor's opinion
4. Verify major versus minor nonconformity classification is applied consistently across
   findings — major nonconformities should reflect system-level failures or systematic
   absence; minor nonconformities reflect isolated lapses
5. Verify the audit team reviewed findings with the auditee before the closing meeting
   per Clause 6.5.6, to confirm the factual basis and resolve any disagreements
6. Request records of any auditee disagreements with findings and how they were resolved

**Pass Criteria:**
- Each finding includes: specific requirement reference, objective evidence, and
  conformity determination
- Findings are factual (observation-based) rather than opinionated or interpretive
- Major/minor classification applied consistently
- Findings reviewed with auditee before the closing meeting
- Auditee disagreements documented and resolved or recorded as unresolved per Clause 6.5.8

**Expected Evidence:**
- Audit findings report from the most recently completed audit
- Record of pre-closing-meeting finding review with auditee
- Any documented disagreements and resolution or recording of auditee position

**Common Failures:**
- Findings state "process needs improvement" without citing the specific requirement
  that is not met — Clause 6.5.6 requires evaluation against audit criteria
- Evidence section describes the auditor's conclusion rather than the objective evidence
  that led to that conclusion
- All findings classified identically regardless of significance; major nonconformity
  applied to a single isolated documentation gap; minor applied to complete absence
  of a required programme element

---

### TC-19011-011: Audit Report Completeness and Timeliness

**Control Reference:** ISO 19011:2011 Clause 6.6.1 — Preparing the audit report
**Test Type:** Document Review
**Assessor:** Lead Assessor

**Objective:**
Verify that audit reports are prepared with all elements required by Clause 6.6.1 and
distributed within the agreed timeframe, providing a complete and usable record of the audit.

**Prerequisites:**
- Audit reports from the two most recently completed audits

**Test Steps:**
1. Request audit reports from the two most recently completed audits
2. Verify each report contains all Clause 6.6.1 required elements: audit objectives; audit
   scope including organizational and functional units or processes audited; identification of
   the audit client; identification of the audit team leader and team members; dates and
   locations of audit activities; audit criteria; audit findings; audit conclusions; statement
   of extent to which audit criteria were fulfilled; any unresolved diverging opinions between
   the audit team and auditee; conformity of the management system with the audit criteria;
   effectiveness of the system in achieving its objectives
3. Verify the audit conclusions section provides an overall assessment — not just a list of
   individual findings without a conclusion about overall system conformity (Clause 6.6.1
   requires conclusions to cover: the degree of conformity, effective implementation and
   maintenance, review and continual improvement capability)
4. Verify any auditee disagreements with findings are documented in the report per Clause
   6.5.8 (closing meeting requirements) — unresolved diverging opinions must be recorded
5. Verify report timeliness: audit report issued within the agreed timeframe after the
   closing meeting; the agreed timeframe should itself be documented
6. Verify the report was distributed per Clause 6.6.2 to the agreed distribution list
   including the audit client, and verify confidentiality was maintained

**Pass Criteria:**
- Reports contain all Clause 6.6.1 required elements
- Audit conclusions address overall conformity, not just individual findings
- Any unresolved diverging opinions documented
- Report issued within the agreed timeframe after the closing meeting
- Report distributed to agreed recipients per Clause 6.6.2

**Expected Evidence:**
- Audit reports with issue date and closing meeting date (to verify timeliness)
- Distribution records per Clause 6.6.2

**Common Failures:**
- Audit report consists only of a nonconformity list with no audit conclusions — Clause
  6.6.1 explicitly requires conclusions addressing overall conformity
- Report issued 4-6 weeks after the closing meeting with no agreed timeframe documented
- Auditee disagreement with a finding was not documented in the report because it was
  "awkward" — Clause 6.5.8 requires unresolved diverging opinions to be recorded

---

### TC-19011-012: Corrective Action Follow-Up Effectiveness

**Control Reference:** ISO 19011:2011 Clause 6.8 — Conducting audit follow-up activities
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that corrective actions submitted in response to audit findings are evaluated for
root cause adequacy, tracked to implementation, and verified for effectiveness as required
by Clause 6.8 — not closed when the auditee self-reports completion.

**Prerequisites:**
- Nonconformity records from the most recent audit with corrective actions submitted
- Follow-up verification records
- Corrective action tracking register

**Test Steps:**
1. Request nonconformity records from the most recent audit where corrective actions
   were required
2. For each corrective action response received, verify the review assessed: whether the
   root cause analysis is credible (addresses actual cause, not only the symptom), and
   whether the proposed action would prevent recurrence — Clause 6.8 states the audit
   team leader is responsible for verifying effectiveness of corrective actions
3. Verify any inadequate corrective action proposals were returned to the auditee with
   specific feedback rather than accepted despite insufficient root cause analysis
4. Verify corrective action implementation was verified independently — Clause 6.8 states
   that the results of a follow-up audit should be reported to the client; self-report
   alone is not verification
5. Verify timelines were enforced: Clause 6.8 states completion should be within an
   agreed time period; actions not completed by the agreed date should be escalated
6. Verify the follow-up results were reported as required and fed into the programme
   monitoring per Clause 5.5

**Pass Criteria:**
- Root cause analysis evaluated for credibility before accepting the corrective action
- Inadequate responses returned with documented specific feedback
- Implementation verified independently (not self-reported only)
- Timelines enforced; overdue actions escalated and documented
- Follow-up results reported and fed back into programme monitoring

**Expected Evidence:**
- Corrective action records with root cause analysis submissions
- Review notes confirming root cause adequacy assessment
- Independent implementation verification records
- Evidence of effectiveness assessment (subsequent audit results, monitoring data, or
  confirmation of non-recurrence)

**Common Failures:**
- Root cause analysis not reviewed for credibility; symptom-fixing actions accepted as
  complete root cause treatment — same nonconformity recurs in subsequent audit cycle
- Corrective action closed based on auditee email stating "action complete" with no
  independent verification
- Corrective action register shows all items closed but effectiveness never assessed;
  no evidence that problems did not recur — Clause 6.8 requires verifying effectiveness

---

## Clause 7: Competence and Evaluation of Auditors

---

### TC-19011-013: Auditor Competence Framework and Evaluation

**Control Reference:** ISO 19011:2011 Clause 7.2 — Determining auditor competence to fulfill audit programme needs, Clause 7.4 — Selecting the appropriate auditor evaluation method, Clause 7.5 — Conducting auditor evaluation
**Test Type:** Document Review + Interview
**Assessor:** Lead Assessor

**Objective:**
Verify that auditor competence is formally defined against the management system and audit
scope, evaluated using at least two methods from the Clause 7.4 list, and that mechanisms
exist for maintaining and improving competence as required by Clause 7.6.

**Prerequisites:**
- Auditor competence framework documentation
- Auditor evaluation records for active auditors
- CPD records for active auditors

**Test Steps:**
1. Request the auditor competence framework — Clause 7.2 requires competence to be
   determined taking into account: the management system standard and other reference
   documents, the auditee's processes, language and cultural competence, and sector-
   specific knowledge
2. Verify the framework defines domain-specific requirements for the management system
   being audited — for an AIMS audit programme, requirements should include: ISO 42001
   knowledge, AI system concepts, relevant regulatory requirements (e.g., EU AI Act),
   and sector-specific AI knowledge; generic auditor competence is not sufficient
3. Verify auditor evaluation uses at least two methods from the Clause 7.4 list: records
   review, feedback from referees, interviews, observation during auditing, role play,
   written examination, or post-audit review
4. Request evaluation records for active auditors; verify evaluations were conducted
   using the documented multi-method approach
5. Request CPD records for active auditors; verify CPD includes substantive training
   relevant to the management system scope — Clause 7.6 requires auditors to maintain
   and improve competence through continuing professional development
6. Verify audit activity is maintained at a sufficient frequency to preserve practical
   skills; Clause 7.6 notes the need to maintain competence through regular participation
   in audits; evaluate whether auditor activity levels are sufficient to maintain skills

**Pass Criteria:**
- Competence framework defines domain-specific requirements for the management system
  being audited (not generic auditor competence only)
- Auditor evaluation uses at least two Clause 7.4 methods
- Evaluation records exist for all active auditors within the last 12 months
- CPD records demonstrate substantive relevant training on management system content
- Audit activity maintained at a level sufficient to preserve practical skills
- Process exists for updating competence requirements when the standard or regulatory
  requirements change

**Expected Evidence:**
- Auditor competence framework with domain-specific requirements
- Auditor evaluation records documenting the evaluation methods used
- CPD records for active auditors (past 12 months)

**Common Failures:**
- Auditor competence evaluated only at initial qualification; no subsequent evaluation
  conducted — Clause 7.5 requires periodic evaluation, not one-time screening
- CPD records consist only of certificate renewals with no substantive learning on
  management system specifics, AI regulatory requirements, or emerging governance topics
- No domain-specific competence requirements for the management system scope; general
  ISO 9001 auditing competence assumed sufficient for AIMS audits — directly contrary
  to Clause 7.2 requirements to consider the management system standard and sector context
