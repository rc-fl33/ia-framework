---
type: reference
name: aiuc1-assessor-playbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-16
---

# AIUC-1 Assessor Playbook

**Purpose:** Unified reference for assessors conducting AIUC-1 AI Unified Controls evaluations. This playbook consolidates the handbook, implementation guide, interview guide, and assessment methodology into a single assessor-focused document.

**Audience:** Internal and third-party assessors conducting AIUC-1 compliance assessments, Schellman auditors, and organizations preparing for certification.

**Related Documents:**
- `aiuc1-handbook.md` - Framework overview and control families
- `aiuc1-implementation-guide.md` - Per-control remediation guidance
- `aiuc1-certification-guide.md` - Certification process with Schellman
- `aiuc1-question-bank.md` - Assessment questions and interview procedures
- `assessment-rules.md` - Assessment methodology and scoring

---

## 1. Assessor Quick Reference

### Framework Overview

**AIUC-1 (AI Unified Controls) v1.0**
- **Total Controls:** 51 (39 mandatory, 12 optional)
- **Principles:** 6 (Data & Privacy, Security, Safety, Reliability, Accountability, Society)
- **Assessment Frequencies:** Quarterly (13), Semi-annual (1), Annual (37)
- **Certification Authority:** AIUC (technical evaluation) + Schellman (audit)
- **Certificate Term:** 12 months with quarterly testing cadence

### Control Distribution by Principle

| Principle | Controls | Mandatory | Optional | Assessment Frequency |
|-----------|:--------:|:---------:|:--------:|----------------------|
| A - Data & Privacy | 7 | 7 | 0 | Annual |
| B - Security | 9 | 6 | 3 | Mixed (3 Quarterly, 6 Annual) |
| C - Safety | 12 | 8 | 4 | Mixed (5 Quarterly, 7 Annual) |
| D - Reliability | 4 | 4 | 0 | Mixed (2 Quarterly, 2 Annual) |
| E - Accountability | 17 | 12 | 5 | Mixed (1 Semi-annual, 16 Annual) |
| F - Society | 2 | 2 | 0 | Annual |
| **Total** | **51** | **39** | **12** | |

### Quarterly Testing Requirements

**Critical:** These 13 controls require demonstrated quarterly cadence for certification:

| Control | Requirement | Type | Assessor |
|---------|-------------|------|----------|
| B001 | Third-party adversarial testing | Mandatory | Security |
| B002 | Adversarial input detection | Optional | Security |
| B007 | User access privilege reviews | Mandatory | Security |
| C001 | AI risk taxonomy review | Mandatory | Advisor |
| C006 | Output vulnerability prevention | Mandatory | Security |
| C009 | Real-time feedback/intervention | Optional | Advisor |
| C010 | Third-party harmful output testing | Mandatory | Security |
| C011 | Third-party out-of-scope testing | Mandatory | Security |
| C012 | Third-party customer risk testing | Mandatory | Security |
| D002 | Third-party hallucination testing | Mandatory | Security |
| D004 | Third-party tool call testing | Mandatory | Security |
| **Semi-annual:** | | | |
| E012 | Regulatory compliance documentation | Mandatory | Advisor |

**Certification Requirement:** Minimum 2 consecutive quarterly cycles documented before certification readiness.

---

## 2. Pre-Assessment Preparation

### Document Request List

**Send to client 1 week before assessment begins:**

**Policy Documents:**
- [ ] AI Input Data Policy (A001)
- [ ] AI Output Data Policy (A002)
- [ ] AI Acceptable Use Policy (E010)
- [ ] AI Security Breach Response Plan (E001)
- [ ] AI Harmful Output Response Plan (E002)
- [ ] AI Hallucination Response Plan (E003)
- [ ] Change Management Procedures (E004, E007)
- [ ] Vendor Due Diligence Records (E006)
- [ ] Regulatory Compliance Inventory (E012)

**Architecture and Configuration:**
- [ ] AI System Architecture Diagrams
- [ ] API Gateway and Endpoint Security Configs (B004, B008)
- [ ] Access Control Matrices (B006, B007)
- [ ] Data Isolation Architecture (A005)
- [ ] Logging Infrastructure Documentation (E015)
- [ ] RAG/Hallucination Prevention Architecture (D001)
- [ ] Tool Call Authorization Matrix (D003)

**Testing and Assessment:**
- [ ] Most Recent Quarterly Adversarial Test Report (B001)
- [ ] Most Recent Quarterly Safety Test Reports (C010, C011, C012)
- [ ] Most Recent Quarterly Reliability Test Reports (D002, D004)
- [ ] AI Risk Taxonomy (current version with review dates) (C001)
- [ ] Pre-deployment Test Results (C002)
- [ ] Quarterly Assessment Schedule for next 12 months

**Governance:**
- [ ] RACI Matrix for AI Systems (E004)
- [ ] AI Governance Committee Charter
- [ ] Governance Meeting Minutes (last 4 quarters) (E008)
- [ ] Vendor Due Diligence Scoring Matrices (E006)
- [ ] Cloud vs On-Prem Decision Documentation (E005)
- [ ] Data Processing Location Inventory (E011)

**Provider Attestations:**
- [ ] Foundation Model Provider SOC 2 Reports
- [ ] Cyber Misuse Prevention Attestations (F001)
- [ ] CBRN Safety Attestations (F002)
- [ ] Provider Data Handling Contracts

### Stakeholder Scheduling Matrix

**Plan for 9-12 hours of interviews across these roles:**

| Role | Duration | Controls Covered | Scheduling Priority |
|------|----------|------------------|---------------------|
| CISO / Security Lead | 90 min | B001-B009, F001-F002 | High (schedule first) |
| AI/ML Engineering Lead | 90 min | C001-C006, D001, D003, B006 | High (schedule first) |
| Data Protection Officer | 60 min | A001-A007, E011 | Medium |
| AI Product/Safety Lead | 60 min | C007-C009, C001, E016 | Medium |
| Legal Counsel | 60 min | A007, E003, E005, E006, E012 | Medium |
| DevOps / Platform Eng | 60 min | B004, B008, E015 | Medium |
| GRC / Compliance Lead | 90 min | E004, E007, E008, E010, E013, E014 | Medium |
| QA / Testing Lead | 60 min | C002, C010-C012, D002, D004 | High (if 3rd-party testing) |
| Executive / CTO | 45 min | E001, E002, E004 | Low (schedule last) |

**Scheduling Tips:**
- Block consecutive interviews with related stakeholders (CISO → Security Eng → DevOps)
- Leave 15-30 min buffer between interviews for notes and evidence collection
- Schedule technical demos early in the week for deep-dive follow-ups
- Reserve Friday for evidence gap filling and stakeholder clarifications

### Tool/Access Requirements

**Request from client before assessment:**
- [ ] Read-only access to compliance documentation repository
- [ ] Screen-sharing capabilities for all stakeholder interviews
- [ ] Demo environment access (if testing controls live)
- [ ] VPN/network access if assessing on-premises systems
- [ ] Monitoring dashboard view access (C008, D002)
- [ ] Log query access (E015) - read-only, anonymized if needed
- [ ] Conference room/Zoom rooms for full assessment week

---

## 3. Control Assessment Guide

### How to Use This Section

For each of the 51 controls (A001-F002):
- **Control Description:** What the control requires
- **Assessor Perspective:** What to verify, what questions to ask
- **Organization Perspective:** What they should have prepared
- **Evidence Checklist:** Required artifacts
- **Common Gaps:** What to look for
- **Scoring Rubric:** Full/Partial/None criteria

---

## Principle A: Data & Privacy (7 controls)

### A001 - Establish Input Data Policy

**Control Description:**
Has the organization established and communicated AI input data policies covering customer data usage for model training, inference processing, data retention periods, and customer rights?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Policy document exists, current (≤12 months), and covers all 4 sections:
   - Training data usage provisions
   - Inference processing provisions
   - Retention period definitions
   - Customer rights procedures (access, portability, deletion)
2. Policy uses AI-specific language ("model training," "inference processing") not just generic "data processing"
3. Data inventory exists mapping all AI data sources to retention periods
4. Retention enforcement mechanisms operational (automated deletion jobs)
5. Opt-out mechanisms functional and accessible to customers
6. Policy communicated to customers (ToS link) and staff (training records)

**Questions to Ask (Data Protection Officer):**
- "Walk me through your AI input data policy. How does it differ from your general data policy?"
- "Show me your data inventory. How do you ensure it stays current?"
- "What happens when a customer opts out of having their data used for training?"
- "How are retention periods enforced? Show me deletion job configurations."
- "How often is this policy reviewed and by whom?"

#### Organization Perspective

**What They Should Have Prepared:**
- AI Input Data Policy document (PDF/Word with signatures and effective date)
- Data inventory spreadsheet (data source | retention period | legal basis | deletion process | owner)
- Terms of Service with policy link
- Training completion records for staff on AI data policy
- Examples of customer opt-out requests processed (last 90 days)
- Automated deletion job configurations (cron jobs, S3 lifecycle policies, database TTLs)
- Annual policy review meeting minutes

#### Evidence Checklist

Required:
- [ ] AI Input Data Policy v[X.X] (dated, approved, ≤12 months old)
- [ ] Policy includes: training usage, inference usage, retention periods, customer rights
- [ ] Data inventory listing all AI data sources with retention periods
- [ ] Retention enforcement logs showing automated deletion
- [ ] Terms of Service with policy link (accessible to customers)
- [ ] Opt-out mechanism documentation (account settings or email process)
- [ ] Annual review record (meeting minutes or approval signatures)

Strong:
- [ ] Staff training completion records
- [ ] Examples of opt-out requests processed
- [ ] Retention enforcement audit logs (last 90 days)

#### Common Gaps

1. **Generic data policy without AI-specific language**
   - Indicator: Policy uses "data processing" but doesn't mention "model training" or "inference"
   - Risk: AI-specific risks not addressed (training data provenance, model bias)
   - Look for: Missing terminology like "fine-tuning," "embeddings," "inference logs"

2. **Policy exists but data inventory incomplete**
   - Indicator: Engineering mentions data sources not in official inventory
   - Risk: Shadow AI data sources outside policy coverage
   - Look for: Inventory hasn't been updated in 6+ months, orphaned data sources

3. **No retention enforcement**
   - Indicator: Policy states 30-day deletion but data exists from 2+ years ago
   - Risk: Storage costs, regulatory violations, breach exposure
   - Look for: No automated deletion jobs, no manual audit process

4. **Opt-out process requires manual email**
   - Indicator: No self-service toggle, customers must email support@
   - Risk: Friction reduces opt-out completion, regulatory scrutiny
   - Look for: No account settings toggle, long processing times

5. **Policy not communicated**
   - Indicator: Staff unaware, not in onboarding, no training records
   - Risk: Policy violations due to ignorance, inconsistent enforcement
   - Look for: Interview 5 staff - check awareness

#### Scoring Rubric

**Full Compliance:**
- Documented input data policy with opt-out mechanisms ✓
- Defined retention periods for all data categories ✓
- Customer rights procedures functional ✓
- Policy AI-specific (not generic repurposing) ✓
- Data inventory complete and current ✓
- Retention enforced (automated deletion verified) ✓
- Policy communicated (ToS link + staff training) ✓

**Partial Compliance:**
- Input data policy exists ✓
- But: Lacks opt-out mechanisms OR retention periods undefined OR not AI-specific
- Example: Generic privacy policy with no AI section
- Example: Policy exists but no automated retention enforcement

**Non-Compliant:**
- No formal AI input data policy
- Or: Generic data policy with no AI-specific provisions

---

### A002 - Establish Output Data Policy

**Control Description:**
Has the organization established AI output ownership, usage, opt-out and deletion policies and communicated these to customers?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Output ownership clearly stated ("Customer owns all outputs" not "may own")
2. Policy covers: ownership, usage rights, opt-out, deletion
3. Opt-out mechanism functional (self-service preferred)
4. Policy accessible to customers (ToS, product UI, FAQ)
5. Support team trained on output policy

**Questions to Ask:**
- "Who owns AI-generated outputs? Show me where this is documented."
- "Can customers opt out of having their outputs used for training?"
- "How do customers delete their AI conversation history?"
- "Show me where customers can find this policy in the product."

#### Organization Perspective

**What They Should Have Prepared:**
- AI Output Policy (section in ToS or standalone document)
- Output ownership decision matrix (customer vs company ownership by type)
- Opt-out procedure (account settings screenshot or email template)
- Customer FAQ on output rights
- Examples of opt-out requests processed
- Support team training materials

#### Evidence Checklist

Required:
- [ ] Output ownership policy in ToS or standalone document
- [ ] Policy uses definitive language ("you own" not "you may own")
- [ ] Opt-out mechanism documented and functional
- [ ] Policy link visible in product UI (footer, settings, onboarding)
- [ ] Customer FAQ addressing output ownership

Strong:
- [ ] Examples of opt-out requests processed
- [ ] Self-service opt-out toggle (account settings)
- [ ] Support team training on output policy

#### Common Gaps

1. **Ambiguous license language**
   - Indicator: "You grant us a license" without stating who owns outputs
   - Risk: Customer confusion, legal disputes
   - Look for: Weasel words like "may," "typically," "generally"

2. **Opt-out requires email to support**
   - Indicator: No self-service, customers wait for manual processing
   - Risk: Appears intentionally difficult, regulatory risk
   - Look for: Friction in opt-out process

3. **Policy buried in ToS**
   - Indicator: 50-page ToS, output policy not linked prominently
   - Risk: Customers unaware of rights
   - Look for: No standalone policy page, no UI prominence

#### Scoring Rubric

**Full Compliance:**
- Clear output ownership policy ✓
- Opt-out procedures communicated ✓
- Accessible via ToS/FAQ ✓
- Definitive language (no ambiguity) ✓
- Self-service opt-out available ✓

**Partial Compliance:**
- Policy exists but ownership distinctions unclear OR opt-out procedures ambiguous
- Example: Uses "license" language without clarifying ownership

**Non-Compliant:**
- No formal AI output data policy

---

### A003 - Limit AI Agent Data Collection

**Control Description:**
Are safeguards implemented to restrict AI agent data access to task-relevant information based on user roles and context?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Agent permissions scoped by role, not blanket admin access
2. Row-level security or data filtering enforced
3. Session timeouts configured (1-8 hours typical)
4. IAM integration operational (permissions sync)
5. Monitoring detects anomalous data access

**Questions to Ask:**
- "What data can your AI agents access? Show me the permission matrix."
- "How do you prevent AI from accessing data beyond task requirements?"
- "Do agent permissions inherit user identity or use service accounts?"
- "Show me an example of a low-privilege user being denied AI access."

#### Organization Perspective

**What They Should Have Prepared:**
- Agent permission matrix (role → feature → data access)
- RBAC/ABAC configuration exports
- Session timeout configurations
- IAM integration architecture diagram
- Quarterly access review records (last 3 quarters)
- Data access monitoring dashboard

#### Evidence Checklist

Required:
- [ ] Agent permission matrix showing role-based scoping
- [ ] Database row-level security policies or data filtering rules
- [ ] Session timeout configuration
- [ ] IAM integration architecture
- [ ] Quarterly access review records

Strong:
- [ ] Access review meeting minutes
- [ ] Anomaly detection dashboard operational
- [ ] Test results showing RBAC enforcement

#### Common Gaps

1. **AI uses admin service account**
   - Indicator: All queries execute as 'ai_admin' with broad permissions
   - Risk: Excessive data access, no user context
   - Look for: Service account with SELECT on all tables

2. **Permissions checked at feature level, not data level**
   - Indicator: User authorized for "AI Analytics" can query any table
   - Risk: Horizontal privilege escalation via AI
   - Look for: No row-level security, no data-level checks

3. **No session expiry**
   - Indicator: User authenticates once, AI retains access indefinitely
   - Risk: Stale credentials, unauthorized persistent access
   - Look for: No timeout configuration

#### Scoring Rubric

**Full Compliance:**
- Data collection limits enforced ✓
- Task-specific scoping ✓
- IAM integration functional ✓
- RBAC enforced at data level ✓
- Session timeouts configured ✓

**Partial Compliance:**
- Some restrictions exist but not consistently scoped by role or context
- Example: Feature-level RBAC but no data-level enforcement

**Non-Compliant:**
- No safeguards limiting AI agent data collection

---

### A004 - Protect IP & Trade Secrets

**Control Description:**
Are safeguards or technical controls implemented to prevent AI systems from leaking company intellectual property or confidential information?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Provider IP protections documented (contract, SOC 2, zero-retention clause)
2. IP classification inventory exists
3. Input filtering blocks sensitive content (API keys, codenames)
4. Output monitoring scans for proprietary terminology
5. Incident response plan for IP leakage

**Questions to Ask:**
- "How do you prevent your AI from leaking trade secrets?"
- "Show me your provider's data handling contract."
- "What input filters block proprietary content before AI submission?"
- "How do you detect IP exposure in AI outputs?"

#### Organization Perspective

**What They Should Have Prepared:**
- Provider contract with zero-retention or justified retention clause
- Provider SOC 2 Type 2 report
- IP classification matrix (sensitivity levels)
- Input filter configuration (regex patterns for API keys, codenames)
- Output scanning configuration
- IP leak incident response playbook

#### Evidence Checklist

Required:
- [ ] Provider contract with data handling clauses
- [ ] Provider SOC 2 report or equivalent
- [ ] IP classification inventory
- [ ] Input filter configuration blocking sensitive content
- [ ] Output monitoring configuration

Strong:
- [ ] Filter test results (API key detection rate)
- [ ] IP leak tabletop exercise results
- [ ] Incident response playbook

#### Common Gaps

1. **No contract verification of provider protections**
   - Indicator: Verbal assurance but no written policy
   - Risk: No legal recourse for IP breach
   - Look for: No contractual IP protections

2. **Input filters but no output monitoring**
   - Indicator: Blocks submission of secrets but doesn't scan responses
   - Risk: AI-generated IP disclosure undetected
   - Look for: Asymmetric protection

3. **IP classification not enforced in AI access**
   - Indicator: Data classified "Restricted" but anyone can submit to AI
   - Risk: Classification theater without controls
   - Look for: No approval gates for classified data

#### Scoring Rubric

**Full Compliance:**
- Provider safeguards documented ✓
- Supplementary controls deployed ✓
- Output monitoring operational ✓
- IP classification enforced ✓

**Partial Compliance:**
- Provider safeguards relied upon but supplementary controls incomplete

**Non-Compliant:**
- No safeguards against AI IP leakage

---

### A005 - Prevent Cross-Customer Data Exposure

**Control Description:**
Are safeguards implemented to prevent cross-customer data exposure when combining customer data from multiple sources?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Multi-tenancy architecture with isolation documented
2. Per-customer API keys or namespace identifiers
3. Cross-customer training disabled or consent-based
4. Isolation testing performed quarterly
5. Consent mechanisms for legitimate cross-customer analytics

**Questions to Ask:**
- "How do you isolate customer data in your AI system?"
- "Show me your per-customer API key configuration."
- "Is customer data ever pooled for training? If so, how is consent managed?"
- "When was the last penetration test for tenant isolation?"

#### Organization Perspective

**What They Should Have Prepared:**
- Multi-tenancy architecture diagram
- Per-customer API key configuration
- Provider SOC 2 tenant isolation documentation
- Isolation testing results (quarterly)
- Consent management system (if cross-customer features exist)

#### Evidence Checklist

Required:
- [ ] Multi-tenancy architecture diagram
- [ ] Per-customer API keys or tenant_id enforcement
- [ ] Provider tenant isolation documentation
- [ ] Quarterly isolation test results

Strong:
- [ ] Red team assessment targeting multi-tenancy
- [ ] Consent workflow for cross-customer analytics
- [ ] Differential privacy configuration (if applicable)

#### Common Gaps

1. **Shared API key across all customers**
   - Indicator: Single key, no tenant_id validation
   - Risk: Complete isolation failure
   - Look for: No per-customer keys

2. **Logical isolation never tested**
   - Indicator: Architecture shows separation but no pentest
   - Risk: Theoretical isolation, not verified
   - Look for: No penetration test records

3. **No consent for cross-customer analytics**
   - Indicator: Industry benchmarking uses data without opt-in
   - Risk: Regulatory violation, trust breach
   - Look for: No consent workflow

#### Scoring Rubric

**Full Compliance:**
- Customer data isolation with consent mechanisms ✓
- Logical/physical separation verified ✓
- Isolation testing quarterly ✓

**Partial Compliance:**
- Some isolation controls but not verified across all combination points

**Non-Compliant:**
- No controls preventing cross-customer data exposure

---

### A006 - Prevent PII Leakage

**Control Description:**
Are safeguards established to prevent personal data leakage through AI outputs?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. PII taxonomy defined (comprehensive)
2. Output scanning detects PII (regex + NER + ML)
3. Redaction policy operational (automatic for high-confidence)
4. Session isolation prevents cross-user leakage
5. PII detection logged and monitored

**Questions to Ask:**
- "What types of PII does your AI system detect?"
- "Show me how PII redaction works in practice."
- "How do you prevent User A from seeing User B's PII?"
- "What is your PII detection accuracy?"

#### Organization Perspective

**What They Should Have Prepared:**
- PII taxonomy document
- PII detection configuration (regex, NER, ML)
- Redaction rules and confidence thresholds
- Session isolation architecture
- PII detection logs (last 90 days)
- Synthetic PII test results

#### Evidence Checklist

Required:
- [ ] PII taxonomy (direct, indirect, sensitive)
- [ ] PII detection configuration operational
- [ ] Redaction policy with confidence thresholds
- [ ] Session isolation architecture
- [ ] PII detection logs with metrics

Strong:
- [ ] Synthetic PII test dataset results (95%+ detection)
- [ ] Cross-session isolation test results
- [ ] NER model for unstructured PII

#### Common Gaps

1. **Input filtering only, no output scanning**
   - Indicator: Blocks PII submission but doesn't scan responses
   - Risk: AI-generated PII undetected
   - Look for: Asymmetric protection

2. **Regex-only without NER**
   - Indicator: Catches emails/SSNs but misses names in text
   - Risk: Unstructured PII leakage
   - Look for: No NER deployment

3. **No session isolation**
   - Indicator: Shared conversation history
   - Risk: Cross-user data contamination
   - Look for: User B references User A's info

#### Scoring Rubric

**Full Compliance:**
- Data segregation with PII identification ✓
- Output boundaries enforced ✓
- Automated detection/redaction ✓
- Session isolation verified ✓

**Partial Compliance:**
- Some PII safeguards but detection or redaction incomplete

**Non-Compliant:**
- No safeguards against PII leakage

---

### A007 - Prevent IP Violations

**Control Description:**
Are safeguards and technical controls implemented to prevent AI outputs from violating copyrights, trademarks, or other third-party intellectual property rights?

**Mandatory | Annual**

#### Assessor Perspective

**What to Verify:**
1. Provider IP protections documented
2. Content risk assessment by type (code, images, text)
3. User guidance on IP restrictions (in-app warnings)
4. Output filtering for copyrighted content
5. Incident response for IP claims

**Questions to Ask:**
- "How do you prevent copyright violations in AI outputs?"
- "Show me your provider's copyright safeguards."
- "What happens when a user requests 'generate Nike logo'?"
- "How do you handle customer reports of IP violations?"

#### Organization Perspective

**What They Should Have Prepared:**
- Provider usage policy on copyright protections
- Content risk matrix (code, images, text)
- In-app warning system for high-risk requests
- Output filtering configuration (plagiarism, code licenses)
- IP incident response procedures

#### Evidence Checklist

Required:
- [ ] Provider copyright protection documentation
- [ ] Content risk matrix by output type
- [ ] User guidance on IP restrictions
- [ ] Output filtering for copyrighted content

Strong:
- [ ] Plagiarism detection integration (Copyscape)
- [ ] Code license detection (scancode)
- [ ] IP violation incident logs

#### Common Gaps

1. **No provider verification**
   - Indicator: Assumes provider has safeguards without documentation
   - Risk: No legal recourse
   - Look for: No contract review

2. **No output filtering**
   - Indicator: Relies solely on provider, no supplementary checks
   - Risk: Provider bypasses undetected
   - Look for: No plagiarism/similarity scanning

3. **No user warnings**
   - Indicator: No contextual guidance on prohibited requests
   - Risk: Users unknowingly violate IP
   - Look for: No in-app tooltips

#### Scoring Rubric

**Full Compliance:**
- Provider safeguards documented ✓
- Risk assessment by content type ✓
- Output filtering deployed ✓
- User guidance operational ✓

**Partial Compliance:**
- Some controls but incomplete filtering or guidance

**Non-Compliant:**
- No safeguards against third-party IP violations

---

## Principle B: Security (9 controls)

### B001 - Third-Party Adversarial Testing

**Control Description:**
Has the organization engaged qualified third parties to conduct adversarial robustness testing of AI systems at least quarterly?

**Mandatory | Quarterly**

#### Assessor Perspective

**What to Verify:**
1. Third-party assessor engaged (NCC Group, Trail of Bits, etc.)
2. Testing frequency quarterly (4x per year minimum)
3. Test scope covers: prompt injection, jailbreak, data exfiltration
4. Test results documented with findings severity
5. Remediation tracked with SLAs (Critical: 7 days, High: 30 days)
6. At least 2 consecutive quarterly cycles completed

**Questions to Ask:**
- "Who performs your adversarial testing and how were they selected?"
- "Walk me through the last quarterly test report."
- "How many test cases were executed? How many vulnerabilities found?"
- "Show me remediation tracking for Critical and High findings."
- "What is the next scheduled test date?"

#### Organization Perspective

**What They Should Have Prepared:**
- Third-party assessor engagement letter/contract
- Q1-Q4 2026 test schedule
- Most recent test report (within last 90 days)
- Test methodology documentation
- Adversarial test suite repository (100+ test prompts)
- Remediation tracking (Jira/GitHub with SLA monitoring)
- Trend data across multiple cycles

#### Evidence Checklist

Required:
- [ ] Third-party assessor engagement letter (current)
- [ ] Quarterly test schedule (4x per year)
- [ ] Most recent test report (≤90 days old)
- [ ] Test scope: prompt injection, jailbreak, adversarial examples
- [ ] Findings with severity classification (Critical/High/Medium/Low)
- [ ] Remediation tracking with owners and target dates
- [ ] At least 2 consecutive quarterly test results

Strong:
- [ ] Test suite repository with 100+ test cases
- [ ] Automated adversarial testing in CI/CD
- [ ] Trend data showing improvement
- [ ] OWASP LLM Top 10 coverage mapping

#### Common Gaps

1. **No third-party testing in last 12 months**
   - Indicator: No security testing or only internal testing
   - Risk: Certification blocker
   - Look for: No assessor engagement, no test reports

2. **Testing not quarterly**
   - Indicator: Last test 9 months ago
   - Risk: Cadence requirement unmet
   - Look for: Gaps in quarterly schedule

3. **No remediation accountability**
   - Indicator: Findings documented but no owner/SLA
   - Risk: Vulnerabilities linger indefinitely
   - Look for: No tracking system

4. **Test scope insufficient**
   - Indicator: Only functional testing, no adversarial scenarios
   - Risk: False sense of security
   - Look for: No jailbreak tests, no prompt injection coverage

#### Scoring Rubric

**Full Compliance:**
- Third-party testing quarterly ✓
- At least 2 consecutive cycles ✓
- Comprehensive scope (jailbreak, prompt injection, data exfiltration) ✓
- Findings documented with severity ✓
- Remediation tracked with SLAs ✓
- Trend data available ✓

**Partial Compliance:**
- Testing exists but not quarterly OR incomplete scope OR no remediation tracking
- Example: Annual pentest instead of quarterly

**Non-Compliant:**
- No third-party adversarial testing or no testing in last 12 months

**Note:** This is the #1 certification blocker. Procurement and onboarding of qualified assessors takes months.

---

### B002 - Detect Adversarial Input (Optional)

**Control Description:**
Are real-time detection mechanisms implemented to identify adversarial inputs (prompt injection, jailbreak attempts) as they occur?

**Optional | Quarterly**

#### Assessor Perspective

**What to Verify:**
1. Adversarial input detection deployed (Lakera Guard, Rebuff.ai, custom)
2. Detection triggers alerts to security team
3. Alert response time <15 minutes
4. Detection rules updated quarterly
5. Logging comprehensive with timestamps

**Questions to Ask:**
- "What tools detect prompt injection in real-time?"
- "Show me an alert from the last 90 days."
- "What is your mean time to detect adversarial attempts?"
- "How often are detection rules updated?"

#### Organization Perspective

**What They Should Have Prepared:**
- Adversarial detection tool configuration
- Alert integration (Slack/PagerDuty)
- Detection logs (last 90 days)
- Monitoring dashboard
- Quarterly rule update records

#### Evidence Checklist

Required (if implemented):
- [ ] Detection tool deployed (Lakera/Rebuff/custom)
- [ ] Alerting configured with <15 min response
- [ ] Detection logs showing events
- [ ] Quarterly rule reviews

#### Common Gaps

1. **Logging but no alerting**
   - Indicator: Logs stored but no one monitors
   - Risk: Attacks discovered days later
   - Look for: No real-time alerts

2. **Detection rules static**
   - Indicator: Rules from 18 months ago never updated
   - Risk: New attack patterns undetected
   - Look for: No quarterly reviews

#### Scoring Rubric

**Full Compliance:**
- Real-time detection operational ✓
- Alerting <15 min ✓
- Quarterly rule updates ✓

**Partial Compliance:**
- Detection exists but alerting delayed or rules static

**Non-Compliant:**
- No adversarial input detection

---

[CONTINUING WITH REMAINING CONTROLS IN NEXT SECTION DUE TO LENGTH...]

## 4. Interview Execution

[See `aiuc1-question-bank.md` for complete assessment questions and interview guides. Summary:]

### Interview Schedule Template

| Day | Time | Stakeholder | Controls | Duration |
|-----|------|-------------|----------|----------|
| Monday | 9:00 AM | CISO | B001-B009, F001-F002 | 90 min |
| Monday | 11:00 AM | AI/ML Lead | C001-C006, D001, D003 | 90 min |
| Monday | 2:00 PM | DPO | A001-A007, E011 | 60 min |
| Tuesday | 9:00 AM | DevOps | B004, B008, E015 | 60 min |
| Tuesday | 10:30 AM | Product Lead | C007-C009, E016 | 60 min |
| Tuesday | 2:00 PM | QA Lead | C002, C010-C012, D002, D004 | 60 min |
| Wednesday | 9:00 AM | Legal | A007, E003, E005, E006, E012 | 60 min |
| Wednesday | 10:30 AM | GRC Lead | E004, E007, E008, E010, E013, E014 | 90 min |
| Wednesday | 2:00 PM | CTO | E001, E002, E004 | 45 min |
| Thursday | All day | Evidence gap filling, clarifications | | |
| Friday | All day | Report writing, scoring finalization | | |

---

## 5. Reporting Guidelines

### Finding Classification

| Severity | Criteria | Examples | Remediation Window |
|----------|----------|----------|-------------------|
| **Critical (P0)** | Mandatory control completely missing; immediate certification blocker | No third-party testing, no AI failure plans, no risk taxonomy | Before certification |
| **High (P1)** | Mandatory control partially implemented with significant gaps | Incomplete logging, missing data policies, no vendor due diligence | Before certification |
| **Medium (P2)** | Control exists but documentation gaps or enforcement inconsistent | Informal processes, missing quarterly cadence | 30-90 days |
| **Low (P3)** | Optional requirements not implemented or minor issues | Optional controls not deployed, documentation formatting | 90-180 days |

### Finding Format

Each finding should include:
- **Finding ID:** F-[CONTROL]-[NUMBER] (e.g., F-A002-01)
- **Control:** Which AIUC-1 requirement
- **Severity:** Critical/High/Medium/Low
- **Status:** Open/In Progress/Resolved
- **Compliance Impact:** Full/Partial/None

**Description:** Clear statement of the gap
**Risk:** Business/regulatory risk if unaddressed
**Evidence:** What was reviewed, what was missing
**Recommendation:** Specific remediation steps
**Remediation Effort:** Quick/Standard/Extended
**Management Response:** [To be completed by organization]

### Report Structure

1. **Executive Summary**
   - Overall compliance status (X/51 controls compliant)
   - Certification readiness assessment
   - Key findings summary
   - Compliance score by principle

2. **Scope and Methodology**
   - AI systems assessed
   - Assessment dates
   - Stakeholders interviewed
   - Exclusions and limitations

3. **Compliance Matrix**
   - Per-control status with evidence references
   - Organized by principle and phase

4. **Detailed Findings**
   - All P0/P1/P2/P3 findings
   - Cross-referenced to controls

5. **Remediation Roadmap**
   - Prioritized action plan
   - Owners and target dates
   - Estimated effort

6. **Quarterly Testing Cadence Assessment**
   - Status of 13 quarterly requirements
   - Next scheduled assessments
   - Gaps in quarterly coverage

7. **Certification Readiness**
   - Gap-to-certification analysis
   - Schellman preparation guidance
   - Timeline estimate

---

## Appendices

### Appendix A: Complete Control Reference

[See `aiuc1-question-bank.md` for all 51 controls with detailed questions]

### Appendix B: Evidence Cross-Reference

[See Section 3 for per-control evidence requirements]

### Appendix C: Cross-Framework Mappings

AIUC-1 controls map to:
- NIST AI RMF (all 51 controls)
- ISO 42001 (26 controls)
- EU AI Act (15+ articles)
- OWASP LLM Top 10 (8 categories)
- MITRE ATLAS (12+ techniques)

[See `aiuc1-handbook.md` Section 9 for complete mappings]

### Appendix D: Glossary

[See `aiuc1-handbook.md` Section 9 for complete glossary]

---

**Version:** 1.0
**Last Updated:** 2026-02-16
**Framework:** AIUC-1 AI Unified Controls v1.0
**Maintained by:** Compliance Skill v2.0
