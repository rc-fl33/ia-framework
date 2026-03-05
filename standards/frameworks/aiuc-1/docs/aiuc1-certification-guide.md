---
type: reference
name: aiuc1-certification-guide
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-13
---

# AIUC-1 Certification Preparation Guide

A practical guide for organizations preparing to achieve AIUC-1 certification, including the audit process with Schellman, evidence requirements, and ongoing compliance maintenance.

---

## 1. AIUC-1 Certification Overview

### What AIUC-1 Certification Demonstrates

AIUC-1 certification demonstrates that an organization's AI agent systems meet rigorous, independently verified standards for security, safety, reliability, accountability, data privacy, and societal impact. Achieving certification signals to customers, regulators, and insurers that the organization has implemented and maintains technical, operational, and legal safeguards specifically designed for AI agent deployments.

The certification is grounded in technical evaluations and adversarial testing -- not just policy documentation. Organizations must show that their AI agents can withstand adversarial attacks (jailbreaks, prompt injections, data exfiltration attempts) and that operational controls are functioning effectively across all six AIUC-1 principles.

### Who Should Pursue AIUC-1

AIUC-1 certification is designed for organizations deploying AI agents in enterprise environments, particularly those where agents:

- Connect to mission-critical enterprise processes (ERP, CRM, financial systems)
- Autonomously execute transactions or handle sensitive data
- Interact directly with customers or end users
- Operate in regulated industries (healthcare, finance, government)
- Need to demonstrate AI governance to enterprise buyers during procurement

Mid-market and enterprise companies building or deploying agentic AI systems are the primary audience. The standard's consortium includes security leaders from Fortune 500 companies, and founding certified organizations include major enterprise software vendors.

### Schellman's Role as First Accredited Auditor

On February 3, 2026, Schellman became the first authorized auditor of AIUC-1. Schellman is a top 50 CPA firm focused on IT compliance and cybersecurity, and was previously the first ANAB-accredited certification body for ISO 42001.

Under the AIUC-1 partnership structure:

- **AIUC (Artificial Intelligence Underwriting Company)** conducts the technical evaluations and issues the certification
- **Schellman** provides independent audit evidence collection, detailed reporting, and certification guidance

This dual structure combines the technical rigor of AI-specific adversarial testing (AIUC) with the audit expertise and independence of a major compliance firm (Schellman). As Schellman's AI Practice Leader Danny Manimbo stated: "For companies building agentic systems, AIUC-1 complements existing risk management-focused frameworks like ISO 42001 by providing the technical rigor of agent-specific security controls."

### Relationship to Other Certifications

AIUC-1 was designed to complement, not replace, existing certifications:

| Certification | Relationship to AIUC-1 |
|---|---|
| **SOC 2** | AIUC-1 covers AI-specific risks (jailbreaks, hallucinations, tool call safety) that SOC 2 Trust Service Criteria do not address. AIUC-1 does not duplicate SOC 2's general IT controls. |
| **ISO 42001** | AIUC-1 operationalizes many ISO 42001 Annex A controls with agent-specific technical testing. ISO 42001 focuses on AI management systems; AIUC-1 focuses on agent-level technical controls. |
| **ISO 27001** | Complementary. AIUC-1 assumes baseline information security practices and adds AI-specific security layers. |
| **NIST AI RMF** | AIUC-1 maps directly to NIST AI RMF functions (GOVERN, MAP, MEASURE, MANAGE). The standard operationalizes NIST guidance into auditable requirements. |
| **EU AI Act** | AIUC-1 was explicitly designed to operationalize EU AI Act requirements. Multiple requirements map to specific EU AI Act articles. |

Organizations pursuing AIUC-1 should maintain their existing certifications and treat AIUC-1 as the AI-agent-specific layer in their compliance portfolio.

---

## 2. Certification Types

### How AIUC-1 Certification Works

Based on publicly available information, the AIUC-1 certification model differs from the traditional SOC 2 Type 1/Type 2 distinction. AIUC-1 uses a single certification structure that combines:

1. **Upfront assessment:** Technical testing and operational controls review (conducted annually at initial certification and renewal)
2. **Ongoing testing:** Quarterly adversarial testing to maintain the certificate's validity throughout the 12-month display term

This means AIUC-1 is inherently forward-looking, unlike SOC 2 Type II which reports on a historical review period. The quarterly testing cadence ensures ongoing compliance rather than point-in-time validation.

### Certificate Validity

- **Display term:** 12 months from issuance
- **Testing cadence:** Quarterly minimum (compared to annual for SOC 2)
- **Renewal:** Annual recertification required; failure to renew requires removal of the certificate and all compliance claims
- **Output:** Certificate plus detailed technical testing results (compared to SOC 2's attestation report)

### Material Findings and Remediation

- **P0/P1 vulnerabilities** (critical findings) discovered during testing require complete remediation before a full certificate is issued
- Re-testing must be completed after remediation to verify the findings are resolved
- Organizations with material operational control gaps must remediate before receiving certification

### Important Note

Schellman and AIUC may offer pre-assessment or readiness engagements. Contact Schellman directly to confirm current engagement types, as the certification program was newly announced in February 2026 and specific engagement structures may evolve.

---

## 3. Pre-Certification Requirements

Before engaging Schellman for a formal audit, organizations should ensure the following readiness criteria are met:

### 3.1 Full Compliance Across Mandatory Requirements

All 39 mandatory requirements across the six AIUC-1 principles must achieve Full Compliance status. The 12 optional requirements are not required for certification but strengthen the overall posture and may be assessed if the organization has implemented them. The full requirement set:

| Principle | Total | Mandatory | Optional |
|---|---|---|---|
| A - Data & Privacy | 7 | 7 | 0 |
| B - Security | 9 | 6 | 3 |
| C - Safety | 12 | 8 | 4 |
| D - Reliability | 4 | 4 | 0 |
| E - Accountability | 17 | 12 | 5 |
| F - Society | 2 | 2 | 0 |
| **Total** | **51** | **39** | **12** |

### 3.2 Quarterly Assessment Cadence Demonstrated

Of the 51 requirements, 13 require quarterly (every 3 months) evaluation, and 1 requires semi-annual (every 6 months) evaluation. For certification readiness, organizations should demonstrate at least 2 consecutive quarterly cycles with documented results for each quarterly requirement. This establishes a credible pattern of ongoing compliance.

### 3.3 Third-Party Assessors Appointed

Several requirements mandate third-party (independent) testing:

- **B001:** Third-party adversarial robustness testing (quarterly)
- **C010:** Third-party testing for harmful outputs (quarterly)
- **C011:** Third-party testing for out-of-scope outputs (quarterly)
- **C012:** Third-party testing for customer-defined risk (quarterly)
- **D002:** Third-party hallucination testing (quarterly)
- **D004:** Third-party tool call testing (quarterly)

Organizations must have qualified third-party assessors engaged and performing these tests on a quarterly basis before the certification audit. This is frequently the most common blocker for certification readiness.

### 3.4 Evidence Repository Organized and Audit-Ready

All evidence supporting compliance must be organized, current, and accessible for auditor review. See Section 5 for detailed evidence repository requirements.

### 3.5 Governance Committee Active

An active AI governance structure with documented records of decisions, risk reviews, and accountability assignments (per E004, E008, E010) must be in place and functioning.

---

## 4. Readiness Assessment Process

### Step-by-Step Certification Preparation

**Step 1: Conduct Internal Self-Assessment (Week 1-2)**

Run a comprehensive self-assessment against all 51 AIUC-1 requirements. For each requirement, document:
- Current compliance status (Compliant, Partial, Gap, N/A)
- Evidence supporting the status
- Specific gaps identified
- Responsible owner

Use the AIUC-1 reference document and compliance tracker tools to structure this assessment. The self-assessment produces a compliance matrix that becomes the roadmap for remediation.

**Step 2: Remediate HIGH Risk Gaps (Days 1-30)**

Address mandatory requirements with Gap status first. Priority order:
1. Requirements with no controls in place (full gaps)
2. Requirements blocking other requirements (dependencies)
3. Third-party testing requirements (B001, C010-C012, D002, D004) -- these have the longest lead time due to vendor procurement

Typical high-priority remediation items:
- AI risk taxonomy creation (C001)
- AI failure/incident response plans (E001, E002, E003)
- AI acceptable use policy (E010)
- Vendor due diligence documentation (E006)

**Step 3: Remediate MEDIUM Risk Gaps (Days 30-90)**

Address Partial compliance items:
- Formalize informal policies into documented procedures
- Extend existing controls to fully satisfy requirement scope
- Create missing documentation (data policies, processing assessments, regulatory mapping)
- Implement monitoring and logging improvements

**Step 4: Establish Quarterly Cadence (Month 2-3, then ongoing)**

Set up the recurring quarterly testing program for all 14 requirements with sub-annual frequency:

| ID | Requirement | Frequency |
|---|---|---|
| B001 | Third-party adversarial robustness testing | Quarterly |
| B002 | Adversarial input detection (optional) | Quarterly |
| B007 | User access privilege reviews | Quarterly |
| C001 | AI risk taxonomy review | Quarterly |
| C006 | Output vulnerability prevention review | Quarterly |
| C009 | Real-time feedback and intervention (optional) | Quarterly |
| C010 | Third-party harmful output testing | Quarterly |
| C011 | Third-party out-of-scope output testing | Quarterly |
| C012 | Third-party customer-defined risk testing | Quarterly |
| D002 | Third-party hallucination testing | Quarterly |
| D004 | Third-party tool call testing | Quarterly |
| E012 | Regulatory compliance documentation | Semi-annual |

Begin executing these assessments immediately. Two complete cycles before the certification audit is the target.

**Step 5: Build Evidence Repository (Ongoing, formalize Month 3-4)**

Organize all compliance evidence into a structured repository. See Section 5 for the recommended structure.

**Step 6: Conduct Readiness Assessment (Month 4-5)**

Perform a delta assessment focusing exclusively on items that were previously non-compliant:
- Verify all remediated gaps now meet Full Compliance
- Confirm quarterly cadence has produced documented results
- Validate evidence repository completeness and currency
- Test auditor access and evidence retrieval processes

**Step 7: Engage Schellman for Pre-Assessment (Month 5-6, if available)**

Contact Schellman to discuss:
- Pre-assessment or readiness review engagement (if offered)
- Scope confirmation for the formal audit
- Evidence format preferences and submission requirements
- Scheduling and timeline expectations

**Step 8: Schedule and Complete Formal Audit (Month 6+)**

Proceed with the formal certification engagement. The audit involves:
- AIUC conducts technical evaluations (adversarial testing across enterprise risk scenarios)
- Schellman collects audit evidence, conducts interviews, and prepares reporting
- Remediation of any material findings discovered during fieldwork
- Certificate issuance upon successful completion

---

## 5. Evidence Repository Requirements

### Organization Structure

Organize evidence by principle and requirement ID:

```
evidence-repository/
  A-data-privacy/
    A001-input-data-policy/
      input-data-policy-v1.2.pdf
      policy-approval-record.pdf
      annual-review-2026-01.pdf
    A002-output-data-policy/
      ...
    A003-data-collection-limits/
      ...
  B-security/
    B001-adversarial-testing/
      Q1-2026-test-report.pdf
      Q2-2026-test-report.pdf
      assessor-engagement-letter.pdf
    ...
  C-safety/
    ...
  D-reliability/
    ...
  E-accountability/
    ...
  F-society/
    ...
  cross-cutting/
    governance-committee-charter.pdf
    governance-meeting-minutes/
    organizational-chart-ai-roles.pdf
```

### Evidence Types

| Type | Examples | Typical Requirements |
|---|---|---|
| **Policies** | Input/output data policies, acceptable use, transparency | A001, A002, E010, E016, E017 |
| **Configurations** | Access controls, model deployment configs, endpoint protections | B006, B008, B009, D003 |
| **Test Results** | Adversarial test reports, hallucination metrics, tool call audits | B001, C010-C012, D002, D004 |
| **Vendor Attestations** | Third-party assessor reports, vendor security questionnaires | B001, C010-C012, D002, D004, E006 |
| **Audit Logs** | Model activity logs, access logs, change management records | E015, B007, E007 |
| **Governance Records** | Meeting minutes, decision records, accountability matrices, risk reviews | E004, E008, C001 |
| **Incident Records** | IR plan documents, tabletop exercise results, post-incident reviews | E001, E002, E003 |
| **Regulatory Mapping** | Compliance mapping documents, jurisdiction analysis | E012 |

### Currency Requirements

- Evidence must fall within the current assessment period (12 months for annual requirements, current quarter for quarterly requirements)
- Quarterly test results must demonstrate consecutive execution without gaps
- Policies must show review dates within the required frequency window
- Stale evidence (beyond the assessment window) will not satisfy auditor requirements

### Naming Conventions

Recommended naming pattern:
```
[REQUIREMENT-ID]-[DOCUMENT-TYPE]-[DATE].[EXT]
```

Examples:
- `B001-adversarial-test-report-2026-Q1.pdf`
- `C001-risk-taxonomy-review-2026-04.pdf`
- `E006-vendor-due-diligence-anthropic-2026.pdf`

### Document Control

- Maintain version history for all policies and procedures
- Record approval dates and approvers for governance documents
- Use access controls to restrict auditor access to relevant evidence only
- Maintain an evidence index that maps each requirement to its supporting documents

---

## 6. Quarterly Cadence Requirements

### Requirements Requiring Sub-Annual Assessment

The standard specifies 13 requirements at quarterly frequency and 1 at semi-annual frequency:

**Quarterly (every 3 months):**

| ID | Title | Mandatory | Key Activity |
|---|---|---|---|
| B001 | Third-party adversarial robustness testing | Yes | External red team tests against jailbreaks, prompt injection, adversarial perturbations |
| B002 | Detect adversarial input | No | Review and update adversarial input detection mechanisms |
| B007 | Enforce user access privileges | Yes | Access review of all users/roles with AI system access |
| C001 | Define AI risk taxonomy | Yes | Review and update risk taxonomy; assess new threat categories |
| C006 | Prevent output vulnerabilities | Yes | Review output vulnerability prevention controls |
| C009 | Enable real-time feedback and intervention | No | Review feedback mechanisms and intervention capabilities |
| C010 | Third-party testing for harmful outputs | Yes | External testing of agent outputs against harm categories |
| C011 | Third-party testing for out-of-scope outputs | Yes | External testing of agent scope enforcement |
| C012 | Third-party testing for customer-defined risk | Yes | External testing against customer-specific risk policies |
| D002 | Third-party hallucination testing | Yes | External assessment of hallucination rates and controls |
| D004 | Third-party tool call testing | Yes | External testing of tool call authorization and safety |

**Semi-annual (every 6 months):**

| ID | Title | Mandatory | Key Activity |
|---|---|---|---|
| E012 | Document regulatory compliance | Yes | Review applicable AI regulations; update compliance mapping |

**Annual (every 12 months):**

The remaining 37 requirements are assessed annually during the certification audit and renewal process.

### What "Demonstrated Cadence" Means

For certification readiness, "demonstrated cadence" requires:

1. **At least 2 consecutive quarterly cycles** with documented results before the certification audit
2. **Complete documentation** for each cycle: test scope, methodology, findings, remediation actions, and sign-off
3. **No gaps** in the quarterly schedule (a missed quarter breaks the cadence and delays certification readiness)
4. **Trend data** showing improvement or sustained compliance across cycles
5. **Third-party independence** for requirements that mandate external assessors (B001, C010-C012, D002, D004)

### Quarterly Execution Calendar

A sample quarterly execution calendar:

| Month | Activity |
|---|---|
| **Q Start (Month 1)** | Kick off quarterly assessments; schedule third-party testing windows |
| **Q Mid (Month 2)** | Execute third-party adversarial testing; conduct access reviews; update risk taxonomy |
| **Q End (Month 3)** | Complete all quarterly assessments; remediate findings; compile quarterly evidence package |
| **Q Close** | File quarterly evidence; update compliance tracker; brief governance committee on results |

---

## 7. Common Audit Findings

Based on the AIUC-1 control structure and typical enterprise AI governance maturity, the following findings are commonly encountered during certification preparation and audits:

### Frequently Identified Gaps

**Missing Third-Party Assessors (B001, C010-C012, D002, D004)**
The most common certification blocker. Organizations often have internal testing capabilities but lack independent third-party assessors performing the quarterly tests that the standard mandates. Procuring, contracting, and onboarding qualified assessors takes time.

**Incomplete Risk Taxonomy (C001)**
Risk taxonomies exist but are missing severity grading, likelihood assessments, mitigating control mapping, or evidence of quarterly review cadence. The standard requires a living document, not a one-time artifact.

**Informal Vendor Due Diligence (E006)**
Organizations use AI model providers and tooling but lack documented evaluation criteria, scoring, or annual re-assessment processes. Vendor selection is implicit ("we chose Anthropic") without a formal assessment record.

**Insufficient Activity Logging (E015)**
Logs exist for infrastructure (CloudTrail, application logs) but do not specifically capture AI model activity -- prompts, responses, tool invocations, and decision chains. AI-specific logging is distinct from general application logging.

**Weak Change Management (E004, E007)**
Changes to AI systems happen through normal development processes but without AI-specific RACI documentation, lifecycle accountability assignment, or documented approval workflows for model updates.

**Quarterly Requirements Not on Cadence**
Testing exists but is not performed quarterly. Annual penetration tests are not sufficient for B001. Ad hoc safety reviews do not satisfy C010-C012's quarterly mandate.

**Data Policy Gaps (A001, A002)**
Organizations have general privacy policies but lack AI-specific input and output data policies addressing training data usage, opt-out mechanisms, data retention for AI interactions, and output ownership.

**Missing Failure Plans (E001, E002, E003)**
General incident response plans exist but do not address AI-specific failure modes: security breaches through prompt injection, harmful output incidents, or systematic hallucination failures.

### Remediation Priority Framework

| Finding Severity | Examples | Remediation Window |
|---|---|---|
| **P0 - Critical** | Missing third-party testing, no AI failure plans, no risk taxonomy | Must remediate before certificate issuance |
| **P1 - High** | Incomplete logging, missing data policies, no vendor due diligence | Must remediate before certificate issuance |
| **P2 - Medium** | Documentation gaps, informal processes, missing quarterly cadence | Remediate within defined timeline |
| **P3 - Low** | Optional requirements not implemented, minor documentation issues | Noted for improvement |

---

## 8. Audit Timeline Planning

### Typical Certification Timeline

The following timeline is a general guide based on the standard's requirements. Actual timelines depend on organizational maturity, number of AI systems in scope, and Schellman's current scheduling availability.

**Stage 1: Internal Readiness (Months 1-4)**

| Activity | Duration | Key Outputs |
|---|---|---|
| Internal self-assessment | 1-2 weeks | Compliance matrix, gap inventory |
| High-priority remediation | 1-4 weeks | Policies created, controls implemented |
| Medium-priority remediation | 4-8 weeks | Documentation gaps closed, processes formalized |
| Quarterly cadence initiation | Begins immediately | First quarterly cycle completed |

**Stage 2: Readiness Validation (Months 4-6)**

| Activity | Duration | Key Outputs |
|---|---|---|
| Second quarterly cycle completion | 3 months from first | Two consecutive quarterly results documented |
| Evidence repository build-out | 2-4 weeks | Organized evidence with index |
| Internal readiness assessment | 1-2 weeks | Delta assessment confirming gaps closed |
| Schellman pre-engagement | 2-4 weeks | Scope confirmation, scheduling |

**Stage 3: Formal Audit (Months 6-8)**

| Activity | Duration | Key Outputs |
|---|---|---|
| Audit planning | 1-2 weeks | Scope confirmed, evidence request list issued |
| Fieldwork: evidence review | 2-4 weeks | Auditor reviews all evidence, identifies gaps |
| Fieldwork: stakeholder interviews | 1-2 weeks | Auditor interviews process owners |
| Fieldwork: technical testing (AIUC) | 2-4 weeks | Adversarial testing across risk scenarios |
| Draft report | 1-2 weeks | Preliminary findings issued |
| Management response | 1-2 weeks | Organization responds to findings |
| Remediation (if needed) | Variable | P0/P1 findings remediated and re-tested |
| Final report and certification | 1-2 weeks | Certificate issued |

**Total estimated timeline: 6-8 months** from initiation to certification for a moderately mature organization. Organizations with significant gaps or no existing AI governance may require longer.

### Key Dependencies

- Third-party assessor procurement (can take weeks to months)
- Quarterly cadence requires calendar time that cannot be compressed (minimum 6 months for 2 cycles)
- AIUC technical evaluation scheduling
- Schellman auditor availability

---

## 9. Cost Considerations

**Note:** AIUC-1 certification pricing is not publicly available. The following categories represent the types of costs organizations should budget for. Contact Schellman and AIUC directly for current pricing.

### Internal Effort

| Category | Stakeholders | Activities |
|---|---|---|
| **GRC / Compliance** | Compliance officers, risk managers | Self-assessment, evidence collection, policy creation, audit coordination |
| **Engineering** | AI/ML engineers, platform teams | Control implementation, logging, access controls, deployment hardening |
| **Legal** | General counsel, privacy officers | Data policies, regulatory mapping, acceptable use policies, vendor contracts |
| **Product** | Product managers, AI product owners | Risk taxonomy input, scope definition, customer-facing disclosure mechanisms |
| **Security** | Security engineers, red team | Adversarial testing coordination, vulnerability remediation |

### External Costs

| Category | Description |
|---|---|
| **Schellman audit fees** | Evidence collection, reporting, certification guidance |
| **AIUC technical evaluation** | Adversarial testing across enterprise risk scenarios |
| **Third-party assessors** | Quarterly testing for B001, C010-C012, D002, D004 (recurring cost) |
| **Tooling** | GRC platforms, evidence management, AI monitoring tools |
| **Consultants** | Readiness assessment, gap remediation support (optional) |

### Ongoing Annual Costs

| Category | Frequency |
|---|---|
| **Quarterly third-party testing** | 4x per year |
| **Annual recertification audit** | 1x per year |
| **Evidence repository maintenance** | Continuous |
| **Internal quarterly assessment execution** | 4x per year |
| **Risk taxonomy and policy updates** | Per standard update cadence (quarterly standard releases) |

### Cost Factors

Actual costs vary significantly based on:
- Number of AI systems in scope
- Organizational size and complexity
- Current compliance maturity (existing SOC 2, ISO 42001 reduces effort)
- Geographic distribution
- Number of third-party testing engagements required
- Whether readiness consulting is needed

---

## 10. Post-Certification Maintenance

### Continuous Compliance Program

After achieving certification, organizations must maintain an active compliance program to retain the certificate and prepare for annual recertification.

**Quarterly Activities:**
- Execute all quarterly assessments (B001, B007, C001, C006, C010-C012, D002, D004, and optional B002, C009)
- Update risk taxonomy with new threats and mitigations
- File quarterly evidence packages in the repository
- Brief governance committee on quarterly results and trends
- Remediate any findings from quarterly testing within defined SLAs

**Semi-Annual Activities:**
- Update regulatory compliance documentation (E012)
- Review jurisdictional changes affecting AI regulations

**Annual Activities:**
- Complete annual recertification audit with Schellman/AIUC
- Review and update all annual policies (A001-A007, B004-B006, B008-B009, C002-C005, etc.)
- Conduct annual vendor due diligence review (E006)
- Review and update AI failure plans (E001, E002, E003)
- Update processing location records (E011)

**Ongoing Activities:**
- Monitor AIUC-1 standard updates (released quarterly: January 1, April 1, July 1, October 1)
- Maintain evidence repository with current documentation
- Track AI system changes through change management processes
- Log model activity and maintain audit trails (E015)
- Respond to AI incidents per documented failure plans

### Standard Evolution

AIUC-1 updates on a predictable quarterly cadence, incorporating new research, threat patterns, and global best practices. Organizations must:
- Review each quarterly update for new or modified requirements
- Assess impact on current compliance posture
- Implement changes within the standard's transition period
- Document the update review and any resulting changes

### Recertification Failure

If the certificate lapses (failure to recertify within the 12-month term):
- The organization must remove the AIUC-1 certificate from all materials
- All compliance claims referencing AIUC-1 must be withdrawn
- Re-certification requires a new full engagement, not just renewal

---

## 11. AIUC-1 + Other Certifications

### Complementary Certification Strategy

AIUC-1 is designed to layer on top of existing compliance certifications, not replace them. Organizations benefit from pursuing AIUC-1 alongside other certifications to create comprehensive governance coverage.

**SOC 2 + AIUC-1:**
SOC 2 covers general IT controls through Trust Service Criteria (security, availability, processing integrity, confidentiality, privacy). AIUC-1 adds the AI-specific layer that SOC 2 was never designed to address: adversarial robustness testing, hallucination prevention, AI-specific failure planning, and agent tool call safety. SOC 2 does not test whether your AI can be jailbroken; AIUC-1 does.

**ISO 42001 + AIUC-1:**
ISO 42001 provides an AI management system framework (governance, risk, lifecycle management). AIUC-1 operationalizes many ISO 42001 Annex A controls with specific, testable requirements. Where ISO 42001 says "establish a process for AI risk management," AIUC-1 specifies exactly what that process must test, how often, and what constitutes a passing result. Organizations certified to ISO 42001 will find significant overlap that reduces AIUC-1 preparation effort.

**NIST CSF + AIUC-1:**
AIUC-1 maps directly to NIST AI RMF functions (GOVERN, MAP, MEASURE, MANAGE). Organizations aligned to NIST CSF already have the governance foundation; AIUC-1 adds AI-specific technical controls and testing requirements.

**EU AI Act + AIUC-1:**
AIUC-1 was explicitly designed to operationalize EU AI Act requirements. Multiple AIUC-1 requirements map to specific EU AI Act articles. For organizations subject to the EU AI Act, AIUC-1 certification provides a structured path to demonstrating compliance with many of the Act's technical and governance requirements.

### Evidence Reuse Opportunities

| Existing Certification | Reusable Evidence for AIUC-1 |
|---|---|
| **SOC 2** | Access control evidence (B007), change management (E004), logging (E015), vendor management (E006) |
| **ISO 42001** | Risk management (C001), governance structure (E004, E008), AI policies (E010), accountability (E004) |
| **ISO 27001** | Information security policies, access controls, incident response, logging, vendor assessment |
| **HITRUST** | Data privacy controls (A-series), security controls (B-series), risk management |
| **FedRAMP** | Continuous monitoring, vulnerability management, access controls, incident response |

Organizations with existing SOC 2 and ISO 42001 certifications will find that a substantial portion of AIUC-1's Accountability (Principle E) requirements can be satisfied with evidence already collected for those programs. The primary net-new effort concentrates in:
- AI-specific adversarial testing (B001, C010-C012, D002, D004)
- AI failure plans (E001, E002, E003)
- AI risk taxonomy (C001)
- Agent-specific safety controls (C003-C006, D001, D003)

---

## 12. Schellman Contact Information

### Engaging Schellman for AIUC-1

- **Website:** [schellman.com](https://www.schellman.com)
- **Contact:** [schellman.com/contact-us](https://www.schellman.com/contact-us)
- **Schellman AI Services:** ISO 42001 certification, AI red teaming, AIUC-1 audit services

### AIUC-1 Official Resources

- **AIUC-1 Standard:** [aiuc-1.com](https://www.aiuc-1.com/)
- **AIUC Research:** [aiuc.com/research](https://aiuc.com/research)
- **Certificate Information:** [aiuc-1.com/learn/certificate](https://aiuc-1.com/learn/certificate)
- **Framework Crosswalks:** [aiuc-1.com/crosswalks](https://aiuc-1.com/crosswalks)

### What to Discuss in Initial Engagement

When contacting Schellman, be prepared to discuss:

1. **Scope:** Which AI systems and agents are in scope for certification
2. **Current maturity:** Existing certifications (SOC 2, ISO 42001, etc.) and AI governance posture
3. **Timeline:** Desired certification date and readiness status
4. **Engagement type:** Pre-assessment, readiness review, or formal certification audit
5. **Third-party testing:** Whether you have existing assessors or need recommendations

### Publicly Known vs. Needs Confirmation

The following information is based on publicly available sources as of February 2026:

**Publicly confirmed:**
- Schellman is the first authorized AIUC-1 auditor (announced February 3, 2026)
- AIUC conducts technical evaluations; Schellman provides audit evidence collection and reporting
- Certificate has a 12-month display term with quarterly testing requirement
- P0/P1 findings must be remediated before certification
- The standard updates quarterly

**Needs confirmation with Schellman:**
- Specific engagement types and structures (pre-assessment availability)
- Pricing and fee schedules
- Detailed audit methodology and evidence request lists
- Auditor scheduling lead times
- Whether readiness reviews are available as a separate engagement
- Specific technical testing scope and methodology details

---

## Sources

This guide was compiled from the following publicly available sources:

- [Schellman Becomes the First Accredited Auditor for AIUC-1](https://www.schellman.com/blog/news/schellman-becomes-the-first-accredited-auditor-for-aiuc-1) -- Schellman blog, February 3, 2026
- [Schellman AIUC-1 Announcement](https://www.globenewswire.com/news-release/2026/02/03/3231179/0/en/Schellman-Becomes-the-First-Accredited-Auditor-for-AIUC-1-the-Security-Standard-for-AI-Agents.html) -- GlobeNewsWire press release, February 3, 2026
- [AIUC-1 Official Site](https://www.aiuc-1.com/) -- Standard documentation and requirements
- [About the AIUC-1 Certificate](https://aiuc-1.com/learn/certificate) -- Certificate structure and comparison
- [Intercom Achieves AIUC-1 Certification](https://www.intercom.com/blog/intercom-achieves-aiuc-1-certification/) -- Intercom blog, December 8, 2025
- [What Is AIUC-1?](https://www.startupdefense.io/blog/what-is-aiuc-1-the-security-safety-and-reliability-standard-for-ai-agents) -- StartupDefense analysis
- [UiPath Becomes Founding Contributor to AIUC-1](https://www.uipath.com/newsroom/uipath-becomes-founding-contributor-to-aiuc-1) -- UiPath newsroom, November 2025
- [AI Governance and ISO 42001 FAQs](https://www.schellman.com/blog/ai-services/ai-governance-and-iso-42001-faqs) -- Schellman AI governance guide
- AIUC-1 REFERENCE document (internal framework reference)
