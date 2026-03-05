---
type: template
name: aiuc-1-assessment-rules-template
category: engagement-rules
classification: public
version: 1.0
last_updated: 2026-02-13
---

# AIUC-1 AI Agent Compliance Assessment Rules

## Assessment Overview

- **Assessment Framework:** AIUC-1 AI Unified Controls v1.0
- **Total Requirements:** 51 (39 mandatory, 12 optional)
- **Principles Assessed:** 6 (Data & Privacy, Security, Safety, Reliability, Accountability, Society)
- **Assessment Period:** [Date Range]
- **Assessment Scope:** [AI systems, agents, models covered]
- **Assessment Type:** [Initial Assessment / Recurring Assessment / Certification Readiness]
- **Certification Target:** [Schellman AIUC-1 Certification / Internal Assessment Only]

### Framework Context

AIUC-1 is an enterprise AI agent standard that operationalizes EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, and CSA AICM into a unified control framework. It is designed for mid-market companies deploying AI agents, covering data privacy, security, safety, reliability, accountability, and societal impact. Schellman is the first accredited auditor for AIUC-1 certification.

### Principle Summary

| Principle | Name | Requirements | Mandatory | Optional |
|-----------|------|-------------|-----------|----------|
| A | Data & Privacy | 7 | 7 | 0 |
| B | Security | 9 | 6 | 3 |
| C | Safety | 12 | 8 | 4 |
| D | Reliability | 4 | 4 | 0 |
| E | Accountability | 17 | 12 | 5 |
| F | Society | 2 | 2 | 0 |
| **Total** | | **51** | **39** | **12** |

---

## Scope Definition

### AI System Inventory

Before beginning the assessment, document all AI systems in scope:

| System Name | Type | Model Provider | Deployment | Agents | Users | Risk Tier |
|-------------|------|----------------|------------|--------|-------|-----------|
| [SYSTEM 1] | [Agent/Chat/Automation] | [Provider] | [Cloud/On-Prem/Hybrid] | [Count] | [Count] | [High/Medium/Low] |
| [SYSTEM 2] | [Agent/Chat/Automation] | [Provider] | [Cloud/On-Prem/Hybrid] | [Count] | [Count] | [High/Medium/Low] |

### Principle Prioritization

Not all principles carry equal weight for every organization. Document which principles have heightened relevance:

| Principle | Relevance | Justification |
|-----------|-----------|---------------|
| A - Data & Privacy | [High/Standard] | [Handles PII, customer data, etc.] |
| B - Security | [High/Standard] | [External-facing agents, API endpoints, etc.] |
| C - Safety | [High/Standard] | [Customer-facing outputs, high-risk domains, etc.] |
| D - Reliability | [High/Standard] | [Tool-calling agents, financial transactions, etc.] |
| E - Accountability | [High/Standard] | [Regulated industry, multi-vendor, etc.] |
| F - Society | [High/Standard] | [General-purpose models, dual-use capabilities, etc.] |

### Assessment Depth

| Depth Level | Description | Use Case |
|-------------|-------------|----------|
| Full 51-Requirement | All requirements assessed including optional | Certification readiness, comprehensive baseline |
| Mandatory Only (39) | Only mandatory requirements assessed | Minimum compliance, initial assessment |
| Targeted Principle | Specific principles assessed in depth | Post-incident review, principle-specific remediation |
| Delta Assessment | Only previously non-compliant items reassessed | Follow-up assessment, remediation validation |

### Mandatory vs. Optional Handling

- **Mandatory requirements (39):** Must be assessed in every engagement. Non-compliance must be documented with remediation plans.
- **Optional requirements (12):** Assessed when included in scope. If excluded, document the exclusion rationale. Optional requirements are: B002, B003, B005, C007, C008, C009, E007, E009, E013, E014, E017.
- **Not Applicable:** Any requirement may be marked N/A with documented justification. N/A determinations require assessor sign-off.

---

## Assessment Methodology

### Assessment by Principle

The AIUC-1 assessment is structured by principle. Each principle maps to a dedicated findings file and assessor.

#### Principles A, E, F: Data Privacy, Accountability, Societal Impact

**Focus:** Governance, accountability, data privacy, societal impact

| Principle | Requirements | Assessment Focus |
|-----------|-------------|------------------|
| A - Data & Privacy | A001-A007 | Input/output data policies, IP protection, cross-customer isolation, PII safeguards |
| E - Accountability | E001-E017 | Failure planning, change management, vendor diligence, AUP, transparency, logging |
| F - Society | F001-F002 | Cyber misuse prevention, CBRN safeguards |

**Evidence Collection:**
- Policy documents (data handling, acceptable use, failure response plans)
- Vendor due diligence records and provider attestations
- RACI charts and governance committee records
- Regulatory compliance documentation
- Processing location inventory

#### Principles B, C, D: Security, Safety, Reliability

**Focus:** Security controls, safety guardrails, reliability mechanisms, and monitoring

| Principle | Requirements | Assessment Focus |
|-----------|-------------|------------------|
| B - Security | B001-B009 | Adversarial testing, endpoint protection, access controls, deployment security |
| C - Safety | C001-C012 | Risk taxonomy, pre-deployment testing, content filtering, high-risk alerting, monitoring |
| D - Reliability | D001-D004 | Hallucination prevention, tool call authorization, third-party assessments |

**Evidence Collection:**
- Adversarial testing results (red team, prompt injection, jailbreak)
- Security configurations (MFA, TLS, API tokens, rate limiting)
- Content filtering and moderation tool configurations
- Third-party assessment reports and quarterly testing records
- Tool call authorization matrices and rate limit configurations
- Monitoring dashboards and alerting configurations
- Quarterly assessment schedules and results

#### Principle E: Operational Readiness (E001-E004)

**Focus:** Incident response readiness for AI-specific failures

| Principle | Requirements | Assessment Focus |
|-----------|-------------|------------------|
| E - Accountability | E001-E004 | Breach response, harmful output response, hallucination response, change management |

**Evidence Collection:**
- Incident response plans and playbooks
- Notification procedure documentation
- Compensation assessment procedures
- Post-incident review records

---

## Scoring Methodology

### Per-Requirement Scoring

Each of the 51 requirements is scored against defined criteria from the AIUC-1 standard:

| Status | Criteria | Score |
|--------|----------|-------|
| **Full Compliance** | Control is documented, implemented, verified, and operating effectively. Evidence demonstrates all scoring criteria met. | 100% |
| **Partial Compliance** | Control exists but has documented gaps in implementation, coverage, or effectiveness. Some but not all scoring criteria met. | 50% |
| **Non-Compliant** | Control is missing, ineffective, or has no supporting evidence. None of the scoring criteria met. | 0% |
| **Not Applicable** | Requirement does not apply to this organization's AI systems. Documented justification required with assessor sign-off. | Excluded |

### Scoring Rules

1. Each requirement has explicit full/partial/none scoring criteria defined in the AIUC-1 questions bank (A001 through F002).
2. Evidence must be current (within the assessment period) and verifiable.
3. Partial compliance requires a documented remediation plan with target dates.
4. N/A exclusions reduce the total requirement count for percentage calculations.
5. Overall compliance percentage = (Full + 0.5 * Partial) / (Total - N/A) * 100

### Risk Weight Integration

Each requirement carries a risk weight (HIGH, MEDIUM, or LOW) that affects remediation prioritization:

| Risk Weight | Requirements | Remediation Timeline | Assessment Frequency |
|-------------|-------------|---------------------|---------------------|
| HIGH | B001, B007, C001, C006, C010, C011, C012, D002, D004 | 0-30 days | Quarterly |
| MEDIUM | A001-A007, B002, B004, B006, B008, B009, C002-C005, D001, D003, E001-E006, E008, E010-E012, E015, E016, F001, F002 | 30-90 days | Semi-annual or Annual |
| LOW | B003, B005, C007, C008, C009, E007, E009, E013, E014, E017 | 90-180 days | Annual |

### Assessment Frequencies

AIUC-1 defines specific assessment frequencies per requirement:

| Frequency | Count | Requirements |
|-----------|-------|-------------|
| Every 3 months (quarterly) | 14 | B001, B002, B007, C001, C006, C009, C010, C011, C012, D002, D004, E012 (semi-annual) |
| Every 6 months (semi-annual) | 1 | E012 |
| Every 12 months (annual) | 36 | All remaining requirements |

---

## Evidence Requirements

### Evidence Categories

| Category | Description | Examples |
|----------|-------------|----------|
| **Policy Documents** | Formal organizational policies governing AI use | Data handling policy, acceptable use policy, failure response plans, vendor management policy |
| **Technical Configurations** | System settings and architecture documentation | Access control matrices, rate limit configurations, encryption settings, API security configs |
| **Test Results** | Outputs from security, safety, and reliability testing | Red team reports, adversarial testing results, hallucination benchmarks, bias assessments |
| **Vendor Attestations** | Third-party and provider documentation | Foundation model provider safety reports, CBRN testing attestations, SOC 2 reports |
| **Audit Logs** | System-generated records of activity | AI interaction logs, access review records, change approval logs, incident response logs |
| **Model Documentation** | Technical documentation of AI systems | Model cards, data sheets, interpretability reports, training data documentation |
| **Third-Party Reports** | External assessor deliverables | Quarterly evaluation reports, certification audit findings, penetration test results |
| **Governance Records** | Committee minutes and decision records | AI governance committee minutes, RACI charts, approval records, review schedules |

### Evidence Collection by Principle

**Principle A (Data & Privacy):**
- Input data usage policies with opt-in/opt-out mechanisms (A001)
- Output ownership and deletion policies (A002)
- Agent permission matrices and data access scoping rules (A003)
- Provider safeguard documentation and supplementary controls (A004)
- Customer data isolation controls and consent mechanisms (A005)
- PII detection/redaction configurations and session isolation (A006)
- Copyright/trademark filtering and incident response procedures (A007)

**Principle B (Security):**
- Quarterly adversarial testing results with risk taxonomy (B001)
- Detection and alerting configurations for prompt injection (B002)
- Technical information disclosure controls (B003)
- Behavioral analytics and rate limiting configurations (B004)
- Automated moderation tool configurations (B005)
- Contextual access controls and privilege limiting evidence (B006)
- Role-based access control and quarterly review records (B007)
- MFA, TLS, API token scoping, and hosting security (B008)
- Output restriction and system detail filtering configs (B009)

**Principle C (Safety):**
- Risk taxonomy with severity grading and quarterly reviews (C001)
- Pre-deployment testing results and approval sign-offs (C002)
- Content filtering configurations for harmful outputs (C003)
- Topic boundary enforcement and scope monitoring (C004)
- Risk-taxonomy-aligned detection and blocking (C005)
- Output sanitization and safety labeling (C006)
- High-risk alerting configurations and review workflows (C007)
- Risk category monitoring and evaluation records (C008)
- User feedback collection and intervention capabilities (C009)
- Quarterly third-party testing for harmful outputs (C010)
- Quarterly third-party testing for scope violations (C011)
- Quarterly third-party testing for risk-taxonomy items (C012)

**Principle D (Reliability):**
- Factual accuracy controls and citation mechanisms (D001)
- Quarterly third-party hallucination assessments (D002)
- Tool call validation, rate limits, and monitoring (D003)
- Quarterly third-party tool call security assessments (D004)

**Principle E (Accountability):**
- Breach response plans with notification procedures (E001)
- Harmful output response plans with mitigation steps (E002)
- Hallucination incident response and compensation procedures (E003)
- Change management documentation and RACI structure (E004)
- Cloud vs. on-premises decision criteria and risk assessments (E005)
- Vendor due diligence records and scoring (E006)
- Material change approval workflows (E007)
- Quarterly governance review records (E008)
- Third-party access monitoring and logging (E009)
- Acceptable use policy with detection systems (E010)
- Data processing location documentation (E011)
- Regulatory compliance repository (E012)
- Quality management system documentation (E013)
- Transparency report policies and delivery records (E014)
- AI system activity logs with retention policies (E015)
- AI interaction disclosure mechanisms (E016)
- Model cards, datasheets, and interpretability reports (E017)

**Principle F (Society):**
- Foundation model cyber capability testing results and attestations (F001)
- CBRN capability testing results and attestations (F002)

---

## Deliverable Specifications

### Required Deliverables

| Deliverable | Description | Template |
|-------------|-------------|----------|
| **AIUC-1 Compliance Matrix** | Per-requirement compliance status with evidence references, mapped by principle and NIST CSF phase | `aiuc1-compliance-matrix-template.md` |
| **Findings Report** | Detailed findings organized by principle with cross-framework mappings, gap analysis, and recommendations | `phase-findings-template.md` (adapted per NIST CSF phase) |
| **Remediation Action Plan** | Prioritized remediation plan organized by risk weight with owners, timelines, and cost estimates | `aiuc1-remediation-plan-template.md` |

### Optional Deliverables

| Deliverable | Description | When to Include |
|-------------|-------------|-----------------|
| **Certification Readiness Assessment** | Gap-to-certification analysis with Schellman audit preparation guidance | When targeting AIUC-1 certification via Schellman |
| **Cross-Framework Mapping Report** | Detailed mapping showing how AIUC-1 controls satisfy parallel framework requirements | When org also maintains ISO 42001, NIST CSF, SOC 2, etc. |
| **Executive Briefing** | Summary presentation for leadership with compliance posture and risk priorities | All engagements with executive stakeholders |

---

## Cross-Framework Integration

### NIST CSF 2.0 Alignment

AIUC-1 principles map directly to NIST CSF functions:

| NIST CSF Function | AIUC-1 Principles | Requirements |
|-------------------|-------------------|-------------|
| GOVERN | A (Data & Privacy), E (Accountability), F (Society) | 26 requirements |
| PROTECT | B (Security), C (Safety partial), D (Reliability partial) | 21 requirements |
| DETECT | C (Safety partial), D (Reliability partial) | 4 requirements |
| RESPOND | E (operational - E001-E004) | Covered under GOVERN |
| RECOVER | E (operational - E001-E004) | Covered under GOVERN |

**Deduplication:** If the organization is also assessed against NIST CSF 2.0, map AIUC-1 findings to NIST CSF controls to avoid duplicate assessment effort. Each AIUC-1 requirement includes explicit NIST AI RMF cross-references.

### ISO 42001 Integration

AIUC-1 operationalizes many ISO 42001 controls. If the organization maintains or is pursuing ISO 42001 certification:

- Map AIUC-1 evidence to ISO 42001 Annex A controls
- Use AIUC-1 assessment results as input to ISO 42001 internal audit
- Identify ISO 42001 controls not covered by AIUC-1 (management system requirements, context of organization, leadership)
- AIUC-1 controls with ISO 42001 mappings: A001, A003, A007, C001, C002, C007, C008, C009, C010, C011, C012, D002, D004, E001, E002, E003, E004, E006, E007, E008, E010, E012, E013, E014, E015, E016, E017

### SOC 2 Integration

If the organization maintains SOC 2 compliance:

- Map AIUC-1 security controls (Principle B) to SOC 2 Trust Service Criteria
- Identify AI-specific trust service criteria not covered by traditional SOC 2
- Use AIUC-1 as the AI-specific overlay to existing SOC 2 controls
- Focus on: Security (B001-B009), Availability (D001-D004), Processing Integrity (C001-C012), Confidentiality (A001-A007), Privacy (A001-A007)

### OWASP LLM Top 10 Integration

AIUC-1 requirements reference OWASP LLM Top 10 (2025 edition). If the organization uses OWASP as a development security reference:

- Map AIUC-1 technical controls to OWASP LLM categories
- Use AIUC-1 evidence to demonstrate OWASP LLM coverage
- Key overlaps: LLM01 (Prompt Injection) -> B001, B002, B005; LLM02 (Sensitive Info) -> B003, B007, B009, A006; LLM05 (Improper Output) -> C003, C004, C005, A004-A006; LLM06 (Excessive Agency) -> A003, B006, D003; LLM08 (Excessive Agency) -> A003, A004, B001, B004, B006, B009

---

## Quality Assurance

### Assessment Quality Checks

| Check | Description | Timing |
|-------|-------------|--------|
| **Scope Validation** | Confirm all in-scope AI systems are covered and exclusions are justified | Before assessment begins |
| **Evidence Completeness** | Verify each assessed requirement has associated evidence or documented gap | After each principle assessment |
| **Scoring Consistency** | Review scoring criteria application across all requirements for consistency | Before deliverable generation |
| **Cross-Reference Validation** | Verify cross-framework mappings are accurate and current | During deliverable review |
| **N/A Justification Review** | Confirm all N/A determinations have adequate documented justification | Before final report |
| **Remediation Feasibility** | Validate proposed remediation actions are actionable and appropriately prioritized | During action plan review |
| **Stakeholder Review** | Client review of findings for factual accuracy before final report | Before report finalization |

### Assessor Requirements

- Familiarity with AIUC-1 framework and all 51 requirements
- Understanding of AI/ML system architecture and deployment patterns
- Knowledge of referenced frameworks (NIST AI RMF, EU AI Act, ISO 42001, OWASP LLM Top 10, MITRE ATLAS)
- Experience with evidence collection and compliance assessment methodology
- For certification readiness assessments: familiarity with Schellman audit process

### Assessment Timeline

| Stage | Duration | Activities |
|-------|----------|-----------|
| Scoping | [1-2 weeks] | AI system inventory, principle prioritization, stakeholder identification |
| Principles A, E, F | [1-2 weeks] | Data privacy, accountability, societal impact evidence collection and interviews |
| Principles B, C, D | [1-2 weeks] | Security, safety, reliability technical evidence and testing review |
| Operational Readiness | [3-5 days] | Incident response plan and operational readiness review (Principle E) |
| Analysis and Reporting | [1-2 weeks] | Scoring, gap analysis, deliverable generation |
| Client Review | [1 week] | Stakeholder review and findings validation |
| Final Deliverables | [3-5 days] | Incorporate feedback, finalize reports |

---

**Generated by:** Compliance Skill v2.0
**Framework Source:** `standards/frameworks/aiuc-1/`
**Questions Bank:** `standards/frameworks/aiuc-1/questions.yaml`
