---
type: reference
name: iso-42006-assessor-playbook
category: compliance
classification: private
version: 2.0
last_updated: "2026-02-23"
framework: "ISO/IEC 42006:2025"
---

# ISO/IEC 42006:2025 Assessor Playbook

Interview guides, scoring rubrics, and document request lists for evaluating a certification
body's (CB) conformance with ISO/IEC 42006:2025 requirements. Use this playbook during CB
selection due diligence, accreditation audits of CBs, or peer review of AIMS audit quality.

**Related:** `iso-42006-handbook.md` (framework overview), `iso-42006-test-playbook.md` (executable test cases)

---

## 1. Assessment Overview

### Assessment Context

ISO/IEC 42006:2025 is a requirements standard for certification bodies — not for organizations
seeking ISO/IEC 42001 certification. Assessors use this playbook in two roles:

1. **Accreditation body auditing a CB:** Evaluating whether the CB meets all ISO 42006
   requirements as part of granting or maintaining accreditation to conduct AIMS certification.
2. **Organization evaluating a proposed CB:** Conducting due diligence before hiring a CB to
   conduct an ISO/IEC 42001 certification audit. While organizations cannot formally accredit
   a CB, this playbook structures the questions and evidence to collect.

### What ISO 42006 Actually Tests

ISO/IEC 42006 creates no new AI governance controls for organizations — it sets the quality
bar for the people evaluating those controls. An under-qualified CB produces certification
that gives false assurance. The assessment focuses on four core questions:

1. **Are the auditors actually qualified?** Six competence domains (Clause 7.1.3), 4-year IT
   plus 1-year AI-specific experience requirements (Clause 7.2.2.2), and AIMS-specific training.
2. **Is the CB actually independent?** AI-specific conflict of interest provisions (Clause 5.2.2.3),
   separation from consulting, and per-engagement screening.
3. **Is the audit programme actually rigorous?** AI value chain role identification (Clause 9.1.2),
   SoA completeness challenge (Clause 9.1.3), audit time by Annex A methodology (Clause 9.1.4.2).
4. **Do the certification outputs meet requirements?** Certificate with SoA version reference
   and no-labelling statement (Clause 8.2.2), and surveillance adapted to AI-specific changes
   (Clause 9.6.2.2).

### Assessment Sequencing

1. Document review: accreditation certificate, service catalogue, competence framework,
   certification agreement, certificate template
2. Interview: CB management — impartiality governance, certification decision independence,
   programme design
3. Interview: Proposed audit team lead — competence domains, AI regulatory knowledge,
   audit methodology, Annex A calculation
4. Interview: Proposed technical auditor — AI technical competence, threat knowledge,
   bias and fairness assessment capability
5. Interview: Audit methodology — Stage 1 and Stage 2 design, SoA challenge, surveillance
   adaptation
6. Sample review: two to three completed AIMS audit reports if available

---

## 2. Pre-Assessment Document Request List

Request the following documents before conducting interviews. Non-receipt is an initial gap
indicator for the specific requirement it evidences.

| Document | Required By | Red Flag If Missing |
|----------|-------------|---------------------|
| Current accreditation certificate with AIMS scope | ISO/IEC 17021-1 / Clause 4 | CB not accredited for AIMS; certification not credible |
| Impartiality policy with AI-specific provisions | Clause 5.2.2 | Generic 17021-1 policy; AI consulting conflicts not addressed |
| Service catalogue (all CB services offered) | Clause 5.2.2 | Cannot verify conflict of interest scope |
| Conflict of interest screening procedure | Clause 5.2.2 | Per-engagement screening not established |
| Auditor competence framework for AIMS | Clause 7.1.3 | No defined standard for AI auditor competence |
| CVs for proposed audit team members | Clause 7.2.2.2 | Cannot verify 4+1 year experience requirement |
| AIMS-specific auditor training records | Clause 7.2.2.2 | Auditors not trained for AIMS auditing |
| AIMS certificate template | Clause 8.2.2 | Cannot verify SoA version reference and no-labelling statement |
| Certification agreement template | Clause 8.4.2 | Cannot verify documentation access provisions |
| Audit programme procedure for AIMS | Clause 9.1.2, 9.1.3, 9.1.4 | Cannot verify scope and time methodology |
| Sample audit time calculation (comparable client) | Clause 9.1.4.2, Annex A | Cannot verify Annex A methodology applied |
| Surveillance programme procedure | Clause 9.6.2.2 | Cannot verify AI-specific surveillance adaptation |
| Sample AIMS Stage 1 and Stage 2 audit reports | Clause 9.3.2 | Cannot verify audit quality |
| Certification decision procedure | Clause 9.5 (via 17021-1) | Cannot verify decision independence |

---

## 3. Interview Guide: CB Management — Impartiality and Programme Governance

**Target interviewees:** CB Programme Director, Impartiality Committee Chair, Quality Manager

**Opening question:** "Walk me through how your CB ensures impartiality when certifying AIMS
against ISO/IEC 42001. What makes your AIMS certification programme credible to clients and
their stakeholders?"

**Follow-up questions:**
- "What AIMS-related services does your CB offer beyond certification? How do you ensure those
  services don't create conflicts of interest with your certification clients?"
- "Show me your conflict of interest policy. Walk me through the specific AI-related activities
  that are prohibited for certification clients under Clause 5.2.2.3."
- "How do you screen proposed audit teams for conflicts of interest before an engagement? What
  triggers a conflict of interest finding? What happens if a conflict is identified after the
  audit has started?"
- "Who makes the certification decision? How is that person independent of the audit team?
  What do they actually review before making the decision?"
- "How does your impartiality committee function? How often does it meet? Does it include
  external members with no financial interest in the CB?"
- "What would happen if your largest AIMS certification client's certificate was in jeopardy?
  Walk me through the governance steps that would protect the certification outcome from
  commercial pressure."

**Documentation to request:**
- Impartiality policy with AI-specific prohibited activities listed per Clause 5.2.2.3
- Impartiality committee composition and most recent meeting records
- Conflict of interest screening procedure and sample completed screening declarations
- Sample certification decision records with decision-maker identity documented

**Red flags:**
- CB offers "AIMS pre-audit consulting" or "AIMS readiness consulting" to the same clients
  it certifies without a documented firewall — direct Clause 5.2.2.3 conflict
- Impartiality committee is composed entirely of CB employees with no external members
- Certification decision-maker is the audit team leader who conducted the audit — no
  independence from Clause 9.5 (as applied via ISO/IEC 17021-1)
- CB management cannot articulate which specific AI services are prohibited for certification
  clients under Clause 5.2.2.3
- "We never have conflicts of interest" without a formal per-engagement screening process

**Scoring guidance:**
- **Score 0:** No AI-specific conflict of interest provisions; impartiality policy is generic
  ISO/IEC 17021-1 text with no AI additions
- **Score 1:** AI conflicts acknowledged verbally but not documented in the impartiality policy
- **Score 2:** Clause 5.2.2.3 prohibitions documented but per-engagement screening informal;
  certification decision independence not procedurally enforced
- **Score 3:** Clause 5.2.2.3 prohibitions documented; formal per-engagement screening
  with declaration records; independent certification decision-maker; impartiality committee
  with external members
- **Score 4:** Level 3 plus impartiality committee reviews AI-specific conflict risk annually;
  external member participation in CB governance; proactive conflict monitoring between
  engagements

---

## 4. Interview Guide: Audit Team Lead — AI Competence and Audit Methodology

**Target interviewees:** Proposed audit team leader, lead AIMS auditor

**Opening question:** "Walk me through your background in AI management systems. What AI-specific
expertise do you bring to an AIMS audit that a general management system auditor would not have?"

**Follow-up questions:**
- "Show me how your competence maps to the six ISO 42006 Clause 7.1.3 domains. Which domains
  do you personally cover? Which are covered by other team members?"
- "What is your 1-year AI-specific experience under Clause 7.2.2.2? What were you doing in
  that role, and how does it prepare you for AIMS audits?"
- "Walk me through how you identify the client's AI value chain role — AI producer, AI
  provider, AI customer — and how that affects your audit planning under Clause 9.1.2."
- "How do you evaluate whether an organization's Statement of Applicability is complete under
  Clause 9.1.3? What would cause you to challenge a scope exclusion?"
- "Walk me through the Annex A audit time calculation for an organization with 15 AI systems,
  3 of which are high-risk under the EU AI Act. What is your base time input and which
  adjustment factors apply?"
- "What AI regulations are currently in force that affect AIMS audits? How does the EU AI
  Act change what you look for when auditing a high-risk AI deployer?"

**Documentation to request:**
- CV with AI experience documented in sufficient detail to verify the 4+1 year requirement
- AIMS-specific training certificates
- Domain competence mapping for the proposed team against all six Clause 7.1.3 domains

**Red flags:**
- "AI experience" consists of auditing ISO/IEC 27001 for organizations that happened to use
  AI tools — this is not the 1-year AI-specific experience required by Clause 7.2.2.2
- Auditor cannot distinguish AI producer, AI provider, and AI customer under ISO/IEC 42001 —
  fundamental knowledge gap for Clause 9.1.2 AI value chain role identification
- Audit time quoted as a fixed standard duration without any Annex A calculation — Clause
  9.1.4.2 explicitly requires using Annex A; a round number estimate signals non-compliance
- Cannot describe EU AI Act high-risk AI system categories from Annex III — legal knowledge
  gap in Domain 3 (Clause 7.1.3.3)
- SoA review described as "we check that all Annex A controls are addressed" without any
  active challenge of scope exclusions — insufficient for Clause 9.1.3

**Scoring guidance:**
- **Score 0:** Proposed team has no documented AI experience; cannot demonstrate AIMS-specific
  methodology
- **Score 1:** General IT auditing experience; minimal AI-specific knowledge; Clause 9.1.2
  role identification and Annex A methodology not applied
- **Score 2:** Some AI experience; ISO/IEC 42001 knowledge; gaps in Domain 3 (legal) or
  Domain 4 (AI technical methods); Annex A not consistently applied
- **Score 3:** All six Clause 7.1.3 domains covered by team; 4+1 year requirements evidenced;
  AIMS training completed; Clause 9.1.2 role identification and Annex A methodology correctly
  described and applied
- **Score 4:** Level 3 plus current AI regulatory knowledge (EU AI Act enforcement status);
  sector-specific AI expertise matching the client; prior AIMS certification experience in
  a comparable sector

---

## 5. Interview Guide: Technical Auditor — AI Technical Competence

**Target interviewees:** Technical member of the proposed audit team

**Opening question:** "When auditing an organization's AI management system, how do you assess
whether their AI systems are appropriately governed? What technical aspects are you specifically
looking for?"

**Follow-up questions:**
- "How do you evaluate the quality of an organization's AI training data governance? What
  evidence would you request, and what constitutes a credible data quality programme?"
- "What is data poisoning? Model extraction? Adversarial examples? How would you assess
  whether an organization has adequate controls against AI-specific threats?"
- "How do you evaluate an organization's bias testing methodology? What does a credible bias
  test look like for a production AI system, and what are the most common gaps?"
- "If an organization claims their AI system is 'not high-risk' under the EU AI Act, how do
  you evaluate that determination? What questions do you ask and what documentation do you
  request?"
- "How do you assess AI operational monitoring? What metrics beyond uptime and latency should
  production AI systems be monitoring to demonstrate adequate AIMS operation?"
- "For a generative AI system — a large language model — what additional governance
  considerations would you examine beyond what you would evaluate for a traditional ML model?"

**Documentation to request:**
- Technical assessment section of a sample AIMS audit report (to verify depth of technical
  review)
- Technical competence evidence for the proposed auditor (relevant qualifications, AI systems
  experience demonstrating Domain 4 competence per Clause 7.1.3.4)

**Red flags:**
- Cannot define data poisoning, adversarial examples, or model extraction — missing knowledge
  of AI threat landscape essential for evaluating AIMS security controls
- "Bias testing" described only in terms of statistical validation, not fairness across
  demographic groups — incomplete understanding of AI fairness assessment
- Cannot evaluate an EU AI Act high-risk determination — basic familiarity required even
  for technical auditors (intersects Domain 3)
- Operational monitoring described as "availability and response time" only — no awareness
  of model performance monitoring, drift detection, or fairness metric monitoring
- Generative AI audit approach identical to traditional ML — no awareness of prompt injection,
  hallucination, or AI-specific content safety governance

**Scoring guidance:**
- **Score 0:** No AI technical knowledge; cannot evaluate AI governance controls beyond
  documentation review
- **Score 1:** General IT technical background; can evaluate documentation but cannot evaluate
  AI technical controls substantively
- **Score 2:** Basic ML knowledge; can evaluate data and model documentation; gaps in AI
  security threat knowledge and fairness assessment
- **Score 3:** Can evaluate AI data governance, bias and fairness testing, operational
  monitoring, and AI threat controls; understands the governance differences between
  traditional ML and generative AI
- **Score 4:** Level 3 plus practical AI system development or deployment experience; can
  evaluate adversarial robustness testing and AI-specific security controls with depth

---

## 6. Interview Guide: Audit Methodology — Stage 1, Stage 2, and Surveillance Quality

**Target interviewees:** Proposed audit team lead, CB quality manager

**Opening question:** "Walk me through what your Stage 1 audit looks like for an AIMS
engagement. What do you actually examine, and what written output does it produce?"

**Follow-up questions:**
- "Clause 9.3.2.1 requires Stage 1 to assess the AIMS design in the context of the
  organization. What does that mean in practice — what specifically do you examine about
  the AIMS design?"
- "What documents do you request in advance of Stage 1? How do you assess whether the
  organization is ready for Stage 2, and what would cause you to delay Stage 2?"
- "Before proceeding to Stage 2, Clause 9.3.2.1 requires confirmation that the Stage 2
  team has the necessary competence. How do you make and document that determination?"
- "How do you design the Stage 2 audit plan? How do you allocate time across the AIMS
  requirements and which areas receive the most scrutiny?"
- "How does Clause 9.6.2.2 change your surveillance programme compared to a generic
  management system surveillance? What makes surveillance AI-specific?"
- "When a surveillance audit is due, what documentation do your reports include per
  Clause 9.6.2.2 — specifically what must be in the surveillance report that would not
  be in a generic management system surveillance report?"

**Documentation to request:**
- Sample Stage 1 audit report from a comparable AIMS engagement (to verify design assessment
  and readiness determination per Clause 9.3.2.1)
- Sample Stage 2 audit plan
- Sample surveillance audit report (to verify Clause 9.6.2.2 required elements: nonconformity
  resolution, current SoA version, significant AIMS changes since last audit)

**Red flags:**
- Stage 1 described as a remote document review taking a few hours — insufficient for the
  substantive AIMS design assessment Clause 9.3.2.1 requires
- Stage 1 report is a document receipt checklist with no design assessment and no readiness
  determination — Clause 9.3.2.1 requires a written report covering both
- Stage 2 team competence not confirmed before proceeding — Clause 9.3.2.1 explicitly requires
  this step; its absence is a direct nonconformity
- Surveillance report does not include the current SoA version or significant AIMS changes
  since the last audit — both are explicit Clause 9.6.2.2 requirements
- Surveillance scope is fixed regardless of AI system changes since initial certification —
  Clause 9.6.2.2 requires adaptation to AI system issues related to risks and effects

**Scoring guidance:**
- **Score 0:** No structured audit methodology; audits are informal assessments
- **Score 1:** Generic management system audit methodology applied to AIMS; no AI-specific
  adaptations in Stage 1, Stage 2, or surveillance design
- **Score 2:** Stage 1/Stage 2 structure present; some AI-specific focus; Stage 1 report lacks
  design assessment; audit time not Annex A-calculated; surveillance scope not adapted
- **Score 3:** Meaningful Stage 1 design assessment documented in writing; Stage 2 team
  competence confirmed per Clause 9.3.2.1; Annex A audit time; surveillance adapted to AI
  risks per Clause 9.6.2.2 with all required report elements present
- **Score 4:** Level 3 plus risk-based audit planning with documented rationale derived from
  AI value chain role identification; sector-specific interview techniques; proactive
  identification of emerging AI governance issues relevant to the client

---

## 7. Control Scoring Rubric

Score each assessed area using the five-level scale. For accreditation purposes, all areas
must reach Level 3 at minimum. For organization CB selection, Level 3 is the minimum
threshold for a CB capable of conducting credible AIMS certification.

| Level | Score | Name | Definition |
|-------|-------|------|-----------|
| 0 | None | Not implemented | No evidence the ISO 42006 requirement is met |
| 1 | Initial | Ad hoc | Some activity occurs but without documentation or consistent application |
| 2 | Developing | Partial | Requirements partially met; significant gaps remain in AI-specific areas |
| 3 | Defined | Meets requirements | All ISO 42006 requirements met with documentary evidence |
| 4 | Managed | Exceeds requirements | Requirements met and exceeded; demonstrable quality assurance |
| 5 | Optimizing | Continuous improvement | Proactively improving; tracking programme effectiveness |

**For accreditation purposes:** A Score 0 or Score 1 finding on any of the four core question
areas (impartiality, competence, audit programme, certification outputs) is a significant
nonconformity. A Score 2 finding is typically a minor nonconformity unless it constitutes
failure to meet a mandatory requirement, in which case it is significant.

---

## 8. Common Findings in CB Assessments

### Impartiality Findings (Clause 5)

**Significant nonconformities:**
- AI-specific conflict of interest prohibitions absent from impartiality policy (Clause 5.2.2.3)
- CB offers AIMS consulting and AIMS certification to the same clients without documented
  firewall (Clause 5.2.2.3)
- Certification decision not demonstrably independent of the audit team (via ISO/IEC 17021-1
  Clause 9.5 as applied by ISO 42006)

**Minor nonconformities:**
- Impartiality committee lacks external members with no financial interest in the CB
- Conflict of interest screening documented but declaration records not maintained per engagement

### Competence Findings (Clause 7)

**Significant nonconformities:**
- Auditors lack 1-year AI-specific experience (Clause 7.2.2.2) — general IT experience
  without dedicated AI work counted as qualifying
- Competence framework covers only Domains 1-2; Domains 3-6 not defined or evidenced
  (Clause 7.1.3.3 through 7.1.3.6)
- AIMS-specific auditor training not completed or not documented (Clause 7.2.2.2)

**Minor nonconformities:**
- CPD records show no AI-relevant training in the past 12 months
- Domain 5 (client business sector, Clause 7.1.3.5) competence not verified before
  engagement commences

### Certification Document Findings (Clause 8)

**Significant nonconformities:**
- Certificate template does not include the SoA version reference (Clause 8.2.2 a) — unique
  to AIMS certification and absent from ISO/IEC 17021-1 generic templates
- Certificate template does not include the no-labelling statement (Clause 8.2.2 b)

**Minor nonconformities:**
- Certification agreement lacks provision for client to notify CB of documentation restrictions
  in advance (Clause 8.4.2)
- Safeguard provisions for trade secrets and intellectual property absent from certification
  agreement (Clause 8.4.2)

### Process Findings (Clause 9)

**Significant nonconformities:**
- Audit time calculated without applying Annex A AI-specific adjustment factors (Clause
  9.1.4.2); fixed estimates used regardless of organizational complexity
- SoA reviewed without challenge — scope exclusions accepted without independent assessment
  of completeness (Clause 9.1.3)
- AI value chain role not identified or does not affect audit scope (Clause 9.1.2)
- Stage 1 report does not document AIMS design assessment or readiness determination
  (Clause 9.3.2.1)
- Stage 2 team competence not confirmed before proceeding to Stage 2 (Clause 9.3.2.1)
- Surveillance programme does not adapt to AI system risks and effects (Clause 9.6.2.2)

**Minor nonconformities:**
- Surveillance report does not include current SoA version (Clause 9.6.2.2)
- Appeals and complaints not reviewed as part of surveillance (Clause 9.6.2.2)
- Significant AIMS changes since last audit not documented in surveillance report
  (Clause 9.6.2.2)

---

## 9. CB Selection Recommendation Framework

Use this framework when advising an organization on CB selection for ISO/IEC 42001
certification.

### Non-Negotiable Requirements

Before selecting a CB, verify all of the following:
- [ ] Current accreditation from an IAF-member national accreditation body with explicit AIMS
      certification scope
- [ ] Impartiality policy addresses ISO 42006 Clause 5.2.2.3 AI-specific prohibitions by name
- [ ] Proposed audit team collectively meets all six Clause 7.1.3 competence domains with
      documented evidence
- [ ] All proposed auditors meet Clause 7.2.2.2 experience requirements (4 years IT/data
      protection, 1 year AI-specific)
- [ ] AIMS certificate template includes SoA version reference and no-labelling statement
      per Clause 8.2.2
- [ ] Audit time calculated using Annex A methodology — not a generic fixed estimate
- [ ] Surveillance programme is adapted to AI system risks, not a fixed annual checklist

### Quality Differentiators

When comparing CBs that meet all non-negotiable requirements:
- Sector-specific AI expertise (Domain 5, Clause 7.1.3.5) matching the organization's
  industry and AI use cases
- Prior AIMS certification experience in a comparable sector
- External member participation in impartiality committee
- Substantive Stage 1 documentation review — not a remote checklist exercise
- References from comparable AIMS certifications in a similar sector

### Questions to Submit in Writing Before Engagement

1. Provide your current accreditation certificate and confirm it explicitly covers AIMS
   certification per ISO/IEC 42006.
2. Confirm which activities from the prohibited list in ISO/IEC 42006 Clause 5.2.2.3 your
   CB does not offer to certification clients.
3. Provide CVs for all proposed audit team members documenting AI experience per Clause
   7.2.2.2, with employer names, roles, and dates sufficient for verification.
4. Provide the Annex A audit time calculation for our organization based on the AI systems
   portfolio information we have provided.
5. Confirm that the certification decision for our engagement will be made by a person who
   is not a member of the audit team.
6. Provide your AIMS certificate template and confirm it includes the SoA version reference
   and the no-labelling statement required by Clause 8.2.2.
