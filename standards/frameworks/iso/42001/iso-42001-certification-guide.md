---
type: reference
name: iso-42001-certification-guide
category: compliance
classification: public
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42001:2023"
---

# ISO/IEC 42001:2023 Certification Guide

Practical preparation guide for organizations pursuing ISO/IEC 42001:2023 certification through an IAF-accredited Certification Body. Covers CB selection, the two-stage audit process, pre-certification requirements, the three-year surveillance cycle, and cost and timeline estimates.

**Related:** `iso-42001-handbook.md` (framework overview), `iso-42001-assessor-playbook.md` (pre-audit preparation)

---

## 1. What ISO 42001 Certification Means

### The Certification Model

ISO/IEC 42001:2023 follows the standard certification model used by all ISO management system standards (ISO 27001, ISO 9001, ISO 14001). An organization's AI Management System (AIMS) is assessed by an independent third-party Certification Body (CB) accredited by an IAF (International Accreditation Forum) member body. If the AIMS is found to conform with the standard, the CB issues a certificate valid for three years, subject to annual surveillance audits.

Unlike AIUC-1 (which requires quarterly adversarial testing to maintain certification), ISO 42001 certification is maintained through:
- Annual surveillance audits (Year 1 and Year 2)
- Full recertification audit in Year 3

The certificate demonstrates that the organization has established, implemented, maintained, and is continually improving an AIMS that meets ISO/IEC 42001:2023 requirements. It is an independent, accredited assessment — not a self-declaration.

### What the Certificate Does and Does Not Claim

**The certificate confirms:**
- The AIMS meets ISO/IEC 42001:2023 requirements as of the audit date and throughout the certificate term (subject to surveillance)
- Documented processes and controls are in place for responsible AI governance
- An independent audit found the AIMS to be conforming

**The certificate does not confirm:**
- That all AI systems produce safe or unbiased outputs at all times
- That the organization is compliant with EU AI Act or any specific regulation (certification provides evidence of conformance with a recognized standard, which may support regulatory compliance)
- That AI systems were specifically tested for adversarial robustness (that is AIUC-1's domain)

### IAF and the Accreditation Chain

Certificates are only valid when issued by CBs accredited by an IAF member body. The accreditation chain:

1. **IAF (International Accreditation Forum)** — international body that coordinates national accreditation bodies
2. **National Accreditation Body (NAB)** — IAF member that accredits CBs in each country (e.g., UKAS in the UK, DAkkS in Germany, ANAB/A2LA in the USA, JAB in Japan)
3. **Certification Body (CB)** — accredited by the NAB to assess and certify organizations against ISO 42001

Certificates from non-accredited CBs (i.e., bodies not accredited by an IAF member) do not carry the same validity or market recognition. Verify CB accreditation before engaging.

---

## 2. IAF-Accredited Certification Bodies

The following CBs offer ISO 42001 certification. All are globally recognized and IAF-accredited for management system certification. Note that Schellman was the first ANAB-accredited CB for ISO 42001 certification (announced 2023), distinguishing it as an early mover with AI-specific expertise.

| Certification Body | Headquarters | AI/Tech Specialization | Notes |
|-------------------|--------------|----------------------|-------|
| **Schellman** | USA | High — AI-focused, first ANAB-accredited ISO 42001 CB | Strong US tech market presence; combined AIUC-1 offering |
| **BSI Group** | UK | High — significant AI and digital trust practice | Largest CB by market presence; global footprint |
| **Bureau Veritas** | France | Moderate — broad industry coverage | Strong in regulated industries |
| **DNV** | Norway | Moderate — strong in energy, maritime, and technology | Combined audit efficiency with existing ISO portfolios |
| **TÜV Rheinland** | Germany | High — significant digital transformation practice | Strong in EU-regulated industries and automotive |
| **TÜV SÜD** | Germany | High — AI safety specialization, automotive background | Strong in AI safety-critical applications |
| **SGS** | Switzerland | Moderate — broad global coverage | Largest volume CB globally |
| **LRQA** (formerly Lloyd's Register) | UK | Moderate — technology and maritime sectors | Strong UK and European presence |
| **NQA** | UK | Moderate — SME-focused | Competitive pricing for mid-market organizations |
| **Intertek** | UK | Moderate — product testing and management systems | Broad industry coverage |

### CB Selection Criteria

When selecting a CB, evaluate:

**1. ISO 42001 Accreditation Status**
Confirm the CB's accreditation for ISO 42001 specifically (not just general management system certification). ISO 42001 is a relatively new standard; not all CBs have built the AI-competent auditor roster required for quality assessment. Request the CB's accreditation certificate from their NAB.

**2. Auditor AI Competency**
ISO 42001 requires auditors with genuine AI management competence — not just generic ISO auditor qualifications. Ask CBs:
- What specific AI competency requirements do you apply to ISO 42001 auditors?
- Can you provide CVs or profiles of the audit team you would assign?
- Have your auditors assessed other organizations' AI systems in industries similar to ours?

**3. Combined Audit Capability**
If the organization holds ISO 27001 or ISO 9001, a CB capable of conducting combined audits reduces cost and organizational disruption. Not all CBs have this capability for the ISO 42001 + ISO 27001 combination — confirm explicitly.

**4. Industry Expertise**
For regulated industries (healthcare, financial services, automotive), select a CB with demonstrated experience in that industry's regulatory context. An ISO 42001 auditor who understands GDPR, the EU AI Act, and the EU Medical Device Regulation is better positioned to assess a healthcare AI AIMS than a generic management systems auditor.

**5. Geographic Coverage**
For organizations with AI operations in multiple jurisdictions, select a CB with offices or partner relationships in relevant countries to enable on-site assessment without excessive travel cost.

---

## 3. Pre-Certification Requirements

Before engaging a CB for formal Stage 1 assessment, ensure all of the following readiness criteria are met.

### 3.1 AIMS Documentation Completeness

All required documented information per ISO/IEC 42001:2023 must exist, be current, and be version-controlled:

- [ ] AIMS scope statement (Clause 4.3)
- [ ] AI policy with top management approval (Clause 5.2, A.2.2)
- [ ] AI governance roles and responsibilities (Clause 5.3, A.3.2)
- [ ] AI risk assessment methodology and results (Clause 6.1)
- [ ] AI objectives with measurement plans (Clause 6.2)
- [ ] Competency requirements and training records for AI roles (Clause 7.2)
- [ ] Documented information control procedure (Clause 7.5)
- [ ] Operational planning and control procedures for AI (Clause 8.1)
- [ ] AI impact assessment process and completed assessment records (A.5.2-A.5.4)
- [ ] AI development lifecycle documentation (A.6.1.3)
- [ ] Data governance procedures and records (A.7.x)
- [ ] User information and disclosure documentation (A.8.x)
- [ ] Responsible use policy (A.9.2)
- [ ] AI supplier assessment records (A.10.2)
- [ ] Internal audit program and results (Clause 9.2)
- [ ] Management review records (Clause 9.3)
- [ ] Nonconformity and corrective action records (Clause 10.1)

### 3.2 Full Implementation Across All 38 Annex A Controls

All 38 Annex A controls must be implemented (score 3 or above on the assessor playbook rubric). Controls scored at Level 1 or Level 2 at the time of Stage 1 assessment will generate findings that must be closed before certificate issuance. Controls scored at Level 0 constitute major nonconformities and will prevent certification.

Use the `iso-42001-assessor-playbook.md` to verify current implementation scores before engaging a CB.

### 3.3 Internal Audit Completion

ISO 42001 Clause 9.2 requires that internal audits be conducted at planned intervals. At minimum, one complete internal audit cycle covering all AIMS clauses and Annex A controls must be completed before Stage 1 assessment. The internal audit must be:
- Conducted by a competent auditor (not auditing their own work)
- Documented with findings and conclusions
- Followed by corrective action plans for any nonconformities identified

A pre-certification internal audit using the `iso-42001-assessor-playbook.md` as the assessment instrument is the most effective preparation approach.

### 3.4 Management Review Completion

Clause 9.3 requires that top management review the AIMS at planned intervals. At least one complete management review covering all required inputs must be completed before Stage 1 assessment. Management review records must be retained as documented information.

Required management review inputs (Clause 9.3):
- Status of actions from previous management reviews
- Changes in external and internal issues relevant to the AIMS
- Information on AI management system performance including trends in: nonconformities and corrective actions, monitoring and measurement results, audit results, and AI objectives achievement
- Adequacy of resources
- Effectiveness of actions taken to address risks and opportunities
- Opportunities for continual improvement

### 3.5 Corrective Action Completion

All nonconformities identified in the internal audit must have documented corrective actions. Any major nonconformities must be fully remediated before Stage 1. Minor nonconformities should be remediated, or at minimum have documented, time-bound corrective action plans before Stage 2.

---

## 4. The Two-Stage Audit Process

### Stage 1: Documentation Review

**Purpose:** Confirm that the AIMS is sufficiently documented and developed to proceed to Stage 2 on-site assessment. Identify any significant gaps that would prevent certification.

**Format:** Typically conducted off-site (document review and video conference). Some CBs conduct Stage 1 on-site if preferred or if the scope is complex.

**Duration:** 1-2 days for a mid-market organization (100-1000 employees). Larger organizations or complex AI portfolios may require longer.

**What the auditor reviews:**
- AIMS scope statement and justification for any exclusions
- AI policy and supporting governance documentation
- Risk assessment methodology and results
- AI impact assessment process and sample records
- Development lifecycle documentation
- Internal audit and management review records
- Corrective action records

**Stage 1 outputs:**
- Stage 1 audit report documenting areas of conformance and any concerns
- Identification of significant gaps requiring closure before Stage 2
- Confirmation of Stage 2 readiness (or recommendations to defer Stage 2)
- Agreed Stage 2 audit plan (scope, dates, audit team, locations)

**Stage 1 to Stage 2 window:** Typically 3-6 months. Stage 1 is not re-audited if Stage 2 occurs within this window. If significant gaps are found, Stage 2 may be deferred until they are resolved.

### Stage 2: Effectiveness Assessment

**Purpose:** Verify that the AIMS is effectively implemented and operating as designed, through on-site (or remote) assessment combining documentation review, interviews, and process observation.

**Format:** On-site at the organization's premises (or remote video conference with screen sharing for documentation and process observation). For organizations with multiple sites, sampling approach is used with risk-based site selection.

**Duration:** 2-4 days for a mid-market organization. Duration scales with:
- Number of in-scope AI systems
- Number of organizational sites
- Complexity of AI lifecycle processes
- Whether combined with ISO 27001 audit (adds efficiency)

**What the auditor assesses:**
- Conformance with all HLS Clauses 4-10 through interviews and documentation review
- Conformance with all 38 Annex A controls through interviews, process observation, and record review
- Effectiveness: are controls achieving their intended purpose, or merely documented?
- Consistency: are processes applied consistently, or only for some AI systems?

**Stage 2 audit agenda (example for 3-day assessment):**

| Day | Time | Activity |
|-----|------|---------|
| Day 1 | AM | Opening meeting; Clause 4-6 assessment (Context, Leadership, Planning) |
| Day 1 | PM | Annex A.2-A.3 assessment (AI Policies, Internal Organization) |
| Day 2 | AM | Annex A.4-A.5 assessment (Resources, Impact Assessment) |
| Day 2 | PM | Annex A.6-A.7 assessment (AI Lifecycle, Data) |
| Day 3 | AM | Annex A.8-A.10 assessment (Information, Use, Third Party); Clauses 7-10 |
| Day 3 | PM | Auditor review and report preparation; closing meeting |

**Stage 2 closing meeting:** The auditor presents preliminary findings, classifies any nonconformities (major or minor), and indicates the certification recommendation. The organization can respond to any factual errors at this stage.

### Certification Decision

Following Stage 2, the audit team prepares a final audit report and submits a certification recommendation to the CB's certification committee. The certification committee makes the independent certification decision.

**Possible outcomes:**

| Outcome | Definition | Next Steps |
|---------|-----------|-----------|
| **Certified** | No major nonconformities; any minor NCs have accepted corrective action plans | Certificate issued; begin surveillance cycle |
| **Certified with conditions** | Minor nonconformities require closure within defined timeframe (typically 3 months) | Provide corrective action evidence; certificate issued on evidence acceptance |
| **Not certified** | Major nonconformity prevents certification | Remediate and request re-assessment (may require partial Stage 2 re-audit) |

**Certificate details:**
- Certificate issued by the CB, not ISO (ISO does not certify organizations)
- Certificate includes: organization name, AIMS scope, standard reference (ISO/IEC 42001:2023), certificate number, issue date, expiry date, and accreditation body reference
- Certificate validity: 3 years from issue date
- Certificate must be displayed with scope — claiming ISO 42001 certification without scope statement is misleading

---

## 5. The Three-Year Surveillance Cycle

ISO 42001 certification is maintained through a structured surveillance program:

### Year 1: First Surveillance Audit

**Timing:** Within 12 months of certificate issuance
**Duration:** Typically 1-2 days (shorter than initial certification)
**Focus:** Verify that the AIMS continues to be implemented and maintained; assess progress on corrective actions from Stage 2; audit a subset of Annex A control families (rotated across the 3-year cycle)

**Mandatory inputs for surveillance:**
- Evidence that internal audits have been conducted since certification
- Management review records since certification
- Corrective action records for any Stage 2 findings
- Evidence of continual improvement activities

**Risk of certificate suspension:** If a surveillance audit reveals major nonconformities, the CB may suspend the certificate pending remediation. Suspension is disclosed to the organization and may require public notification depending on CB policy.

### Year 2: Second Surveillance Audit

**Timing:** Within 24 months of certificate issuance (approximately 12 months after Year 1 surveillance)
**Duration:** Typically 1-2 days
**Focus:** Different Annex A control families from Year 1 surveillance; verify continued AIMS effectiveness; audit any areas of concern from previous audits; assess changes since last audit (new AI systems, organizational changes, regulatory developments)

**Change notification requirement:** Organizations must notify their CB of significant changes to the AIMS scope, organizational structure, or AI systems during the certificate term. Failure to notify the CB of material changes can result in certificate suspension.

### Year 3: Recertification Audit

**Timing:** Before certificate expiry (within 36 months of certificate issuance)
**Duration:** Comparable to initial Stage 1 + Stage 2 (combined review may be somewhat shorter if the organization has a strong surveillance history)
**Focus:** Full reassessment of the AIMS against ISO/IEC 42001:2023, including all HLS clauses and all 38 Annex A controls

**Recertification recommendation:** The recertification decision follows the same process as initial certification. Strong surveillance history with no major nonconformities typically supports a smooth recertification.

### Maintaining Certification: Ongoing Obligations

Between audits, the organization must:

1. **Conduct internal audits** per Clause 9.2 (minimum annual, full AIMS coverage over the surveillance cycle)
2. **Conduct management reviews** per Clause 9.3 (minimum annual)
3. **Maintain documented information** per Clause 7.5 (keep records current and version-controlled)
4. **Notify the CB** of: significant scope changes, major organizational changes, material changes to in-scope AI systems, significant nonconformities or incidents
5. **Apply corrective actions** to all identified nonconformities with verified effectiveness
6. **Maintain AI system inventory** — new AI systems must be captured and assessed before deployment

---

## 6. Combined Audit Opportunities

### ISO 42001 + ISO 27001 Combined Audit

The most common and valuable combined audit opportunity. Both standards use the HLS structure, enabling significant audit efficiency:

**Shared audit activities (conduct once, not twice):**
- Clause 4 context and scope assessment
- Clause 5 leadership and policy review
- Clause 6 planning and risk assessment methodology review
- Clause 7 resources, competence, and documented information
- Clause 9 monitoring, internal audit, and management review
- Clause 10 improvement and corrective action

**Separate audit activities (AI-specific):**
- All 38 Annex A controls (AI-specific — no ISO 27001 equivalent)
- AI impact assessment (A.5 family — not required by ISO 27001)
- AI lifecycle controls (A.6 family)
- Data governance for AI (A.7 family)
- AI transparency (A.8 family)

Combined audit time savings: approximately 30-40% compared to separate sequential audits.

Not all CBs have auditors qualified for both standards. Confirm auditor dual-competency before committing to combined audit scope.

### ISO 42001 + ISO 9001 Combined Audit

Less common but relevant for organizations with established quality management systems. ISO 9001 addresses quality management broadly; ISO 42001 adds AI-specific quality and governance requirements. Combined audit reduces HLS clause duplication.

---

## 7. Timeline and Cost Estimates

### Timeline: Gap Assessment to Certificate

| Phase | Duration | Notes |
|-------|---------|-------|
| Gap assessment | 2-4 weeks | Use `iso-42001-assessor-playbook.md` |
| Foundation implementation (AI policy, roles, scope) | 4-8 weeks | Blocking for all subsequent work |
| Operational controls implementation | 12-20 weeks | AI impact assessments, lifecycle docs, data governance |
| AIMS infrastructure (monitoring, audit program) | 4-8 weeks | Can overlap with operational controls |
| Internal audit | 2-4 weeks | Must be complete before CB engagement |
| Management review | 1-2 weeks | Must follow internal audit |
| Corrective action closure | 2-8 weeks | Depends on findings volume |
| CB engagement and Stage 1 | 4-8 weeks | CB scheduling lead time varies |
| Stage 1 to Stage 2 gap closure | 4-12 weeks | Depends on Stage 1 findings |
| Stage 2 audit | 1-2 weeks | Scheduling |
| Certification decision | 2-4 weeks | CB review and committee decision |
| **Total: Initial implementation from zero** | **6-18 months** | Varies by starting maturity |
| **Total: Mature ISO 27001 organization adding ISO 42001** | **4-9 months** | HLS infrastructure already in place |

### Cost Estimates

Costs vary significantly by CB, organization size, geographic scope, and audit complexity. These are indicative ranges:

**Gap Assessment (pre-CB work):**
- Internal resource time: 2-4 weeks of senior staff time
- External consultant (optional): $15,000-$40,000 for structured gap assessment with remediation roadmap

**Implementation:**
- Internal resource time: 3-12 months of dedicated staff time depending on maturity
- External consultant support: $30,000-$150,000 depending on scope and consulting engagement model
- Tooling (policy management, monitoring, data governance): $0-$50,000/year depending on existing tools

**Stage 1 + Stage 2 Audit (CB fees — mid-market organization, 100-1000 employees):**
- Small organization (<100 employees, simple AI portfolio): $12,000-$20,000
- Mid-market (100-1000 employees, moderate AI portfolio): $18,000-$40,000
- Enterprise (1000+ employees, multiple AI systems and sites): $35,000-$80,000+
- Combined ISO 42001 + ISO 27001 audit: typically 20-35% premium over ISO 27001 alone, but significantly less than two separate audits

**Annual Surveillance Audit:**
- Typically 40-60% of initial Stage 2 audit cost
- Combined surveillance audits follow similar savings pattern

**Recertification Audit:**
- Typically 70-90% of initial Stage 1 + Stage 2 cost (slightly shorter with known system history)

### Cost Reduction Strategies

1. **Combined audit with ISO 27001:** Most significant cost reduction for organizations already certified to ISO 27001. Negotiate combined scope with CB at initial engagement.

2. **Strong internal preparation:** Organizations that complete a thorough internal audit before CB engagement typically have shorter Stage 2 durations and fewer corrective action cycles — reducing total certification cost.

3. **CB comparison:** Request quotes from at least two CBs. Price variation can be 20-40% for equivalent scope. Evaluate audit team competency alongside price.

4. **Phased scope:** Begin with a limited AIMS scope (specific AI systems or business units) and expand at recertification. A narrow initial scope reduces audit duration and cost.

5. **Multi-year contract:** Some CBs offer reduced surveillance rates for multi-year agreements. Negotiate the full 3-year surveillance cycle at initial engagement.

---

## 8. Audit Preparation Checklist

Use this checklist in the weeks before Stage 1 to verify readiness.

### 8 Weeks Before Stage 1

- [ ] Confirm CB engagement and audit team
- [ ] Verify CB auditor AI competency credentials
- [ ] Confirm audit dates and logistics (on-site or remote)
- [ ] Confirm audit scope alignment with CB

### 4 Weeks Before Stage 1

- [ ] Complete internal audit and management review
- [ ] Close all internal audit major nonconformities
- [ ] Document corrective action plans for all minor nonconformities
- [ ] Compile Stage 1 document pack (see pre-assessment document request list in `iso-42001-assessor-playbook.md`)
- [ ] Verify all documents are version-controlled and current
- [ ] Brief all personnel likely to be interviewed on their roles and the AIMS

### 2 Weeks Before Stage 1

- [ ] Verify AI system inventory is current
- [ ] Verify all impact assessment records are complete and filed
- [ ] Verify all supplier assessment records are available
- [ ] Assign an internal point of contact for the CB audit team
- [ ] Prepare access and meeting room logistics

### During Stage 1

- [ ] Provide requested documents promptly
- [ ] Take notes on any concerns raised by the auditor
- [ ] Clarify any factual inaccuracies in the auditor's conclusions before Stage 1 closes
- [ ] Agree on timeline for any Stage 1 finding closures before Stage 2

### Stage 1 to Stage 2 Gap Closure

- [ ] Close all Stage 1 findings
- [ ] Provide closure evidence to CB as required
- [ ] Prepare Stage 2 logistics (interview scheduling, personnel availability, system access for auditor)
- [ ] Conduct additional internal checks on any areas flagged in Stage 1

### During Stage 2

- [ ] Opening meeting: confirm audit scope and schedule
- [ ] Designate guides for each Annex A family interview area
- [ ] Maintain a findings log throughout the audit
- [ ] At closing meeting: clarify any factual errors before preliminary conclusions are finalized

---

## 9. Post-Certification Obligations

### Displaying the Certificate

- Certificate may be displayed on website, in marketing materials, and in customer communications
- Always display with scope — general "ISO 42001 certified" claims without scope are misleading
- Do not display the CB's or NAB's logo without separate permission
- Do not imply the certificate covers activities outside its defined scope

### Surveillance Scheduling

- Schedule surveillance audits proactively — do not wait for the CB to contact you
- Mark Year 1 (12 months) and Year 2 (24 months) surveillance dates in the organizational calendar at certificate issuance
- Begin recertification preparation at Month 30 (6 months before certificate expiry)

### Change Notification

Notify the CB promptly (typically within 30 days) of:
- Material changes to AIMS scope (adding or removing AI systems)
- Significant organizational changes (mergers, acquisitions, major restructuring)
- Changes in AI regulatory requirements applicable to the organization
- Major AI incidents that may constitute significant AIMS nonconformities

### Continual Improvement Documentation

Maintain records demonstrating AIMS improvement over the certificate term. The recertification audit will assess whether the AIMS has improved since initial certification — not just maintained. Document:
- Improvement projects initiated and completed
- AIMS performance trend data
- Lessons learned from incidents, audits, and operational experience
- Enhancements to Annex A control effectiveness
