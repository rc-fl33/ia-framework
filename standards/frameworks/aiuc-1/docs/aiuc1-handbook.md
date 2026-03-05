---
type: reference
name: aiuc1-handbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-15
framework: "AIUC-1 AI Unified Controls"
framework_version: "1.0"
---

# AIUC-1 AI Unified Controls Handbook

**Version:** 1.0 | **Provider:** AIUC (Artificial Intelligence Underwriting Company)
**Controls:** 51 (39 mandatory, 12 optional) | **Families:** 6
**Last Updated:** 2026-02-15

---

## How to Use This Handbook

This handbook is the practitioner's guide to AIUC-1. Read it cover-to-cover to understand what the standard requires, how the IA assessment workflow evaluates it, and what you need to prepare. It bridges the gap between structured assessment data (controls.yaml, questions.yaml) and the narrative understanding needed to manage compliance effectively.

**This handbook IS:** A narrative walkthrough of AIUC-1, its controls, and how to work through compliance.

**This handbook is NOT:**
- The implementation guide (per-control remediation steps for gap closure)
- The certification guide (audit logistics and preparation with Schellman)
- The controls definition (structured machine-readable data in controls.yaml)
- The assessment questions (interview/evaluation questions in questions.yaml)

**Related artifacts:**
- `controls.yaml` -- Structured control definitions for all 51 requirements
- `questions.yaml` -- Assessment questions with scoring criteria
- `aiuc1-implementation-guide.md` -- Per-control gap closure steps
- `aiuc1-certification-guide.md` -- Audit preparation with Schellman
- `AIUC-1-REFERENCE.md` -- Full requirement table and cross-framework mapping

---

## 1. Framework Overview

### What AIUC-1 Is

AIUC-1 (AI Unified Controls) is the enterprise AI agent security standard. It provides 51 auditable requirements across 6 principles for managing AI risk in organizations deploying AI agents. The standard operationalizes requirements from the EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, and CSA AI Controls Matrix into a single, unified control framework.

Unlike general-purpose AI governance frameworks (ISO 42001, NIST AI RMF), AIUC-1 focuses specifically on **agent-level technical controls** -- adversarial robustness testing, hallucination prevention, tool call safety, and AI-specific incident response. It was developed by a consortium including Anthropic, MITRE, Google Cloud, Cisco, Stanford, JPMorgan Chase, and 25+ other organizations.

### Current Version

- **Version:** 1.0 (released December 19, 2025)
- **Published by:** AIUC (Artificial Intelligence Underwriting Company)
- **Official URL:** https://www.aiuc-1.com/
- **Update cadence:** Quarterly (January 1, April 1, July 1, October 1)
- **First accredited auditor:** Schellman (announced February 3, 2026)

### Why It Matters

Three forces drive AIUC-1 adoption:

1. **Regulatory pressure.** The EU AI Act creates binding obligations for AI systems. AIUC-1 was explicitly designed to operationalize EU AI Act articles into testable controls. Organizations subject to the Act can use AIUC-1 compliance as evidence of regulatory alignment.

2. **Enterprise procurement.** Enterprise buyers increasingly require evidence of AI governance during vendor evaluation. AIUC-1 certification signals that an AI product has passed independent adversarial testing and maintains ongoing safety controls -- a differentiator in competitive deals.

3. **Insurance and liability.** As AI-related incidents generate legal exposure, demonstrating adherence to a recognized standard provides a defensible position. AIUC-1's consortium includes insurance industry participants (the "Underwriting Company" in the name reflects this origin).

### Target Audience

AIUC-1 applies to organizations that build or deploy AI agents in enterprise environments. Specifically:

- Companies building AI agent products (SaaS platforms with AI features, AI-native tools)
- Enterprises deploying third-party AI agents connected to internal systems (ERP, CRM, financial)
- Organizations where AI agents autonomously execute transactions, handle sensitive data, or interact with customers
- Companies operating in regulated industries (healthcare, finance, government) that use AI

The standard is designed for mid-market and enterprise organizations, though smaller companies deploying AI agents also benefit from the structure.

---

## 2. Who Needs This Framework

### Industry Applicability

Based on the IA Framework's industry-framework mappings:

| Industry | Priority | Rationale |
|----------|----------|-----------|
| AI & Machine Learning | Recommended | Core standard for AI agent builders |
| Technology & SaaS | Recommended | Expected by enterprise customers deploying AI |
| Healthcare | Optional | Required when deploying AI agents handling PHI |
| Financial Services | Optional | Required when deploying AI agents in financial workflows |
| All industries | Optional | Applicable whenever AI agents are deployed |

### Company Size and Type Guidance

- **Enterprise (1000+ employees):** AIUC-1 addresses the complexity of multi-team AI governance, vendor management, and cross-functional accountability that large organizations face. The quarterly testing cadence and third-party assessment requirements align with existing enterprise audit rhythms.
- **Mid-market (100-1000 employees):** The primary target audience. AIUC-1 provides structure without requiring a dedicated GRC team. Many controls can be satisfied with existing tooling and process documentation.
- **Startups (<100 employees):** Pursue AIUC-1 when enterprise customers request it or when preparing for growth. Start with the 39 mandatory requirements; defer optional controls until resources allow.

### Regulatory vs. Voluntary

AIUC-1 is a **voluntary industry standard**, not a legal requirement. However, it operationalizes requirements from mandatory regulations (EU AI Act) and is increasingly referenced in enterprise procurement requirements. Organizations in regulated industries should treat it as a practical path to demonstrating regulatory compliance.

### Common Compliance Portfolios

Organizations pursuing AIUC-1 typically also maintain:

- **SOC 2 + AIUC-1:** SOC 2 covers general IT controls; AIUC-1 adds AI-specific security testing. SOC 2 does not evaluate adversarial robustness, hallucination prevention, or AI tool call safety.
- **ISO 42001 + AIUC-1:** ISO 42001 provides AI management system governance; AIUC-1 operationalizes it with specific technical controls and quarterly testing requirements.
- **ISO 27001 + AIUC-1:** ISO 27001 covers baseline information security; AIUC-1 layers AI-specific security on top.
- **NIST CSF + AIUC-1:** NIST CSF provides the risk management foundation; AIUC-1 adds AI-specific controls mapped to the same function structure.

---

## 3. Framework Architecture

### Control Organization

AIUC-1 organizes 51 requirements into 6 principles (called "functions" in the standard). Each principle addresses a distinct risk domain. Controls are numbered sequentially within each principle (A001-A007, B001-B009, etc.).

Every control specifies:
- **Status:** Mandatory or Optional
- **Frequency:** How often the control must be assessed (quarterly, semi-annual, or annual)
- **Type:** Preventative (proactive defense) or Detective (monitoring and detection)

### Control Families

| ID | Family | Controls | Description |
|----|--------|:--------:|-------------|
| A | Data & Privacy | 7 | Safeguarding customer information against leakage, IP exposure, and unauthorized training use |
| B | Security | 9 | Defending against adversarial testing, prompt injection, and jailbreak attempts |
| C | Safety | 12 | Mitigating harmful outputs and protecting brand reputation through testing and monitoring |
| D | Reliability | 4 | Preventing hallucinations and unauthorized tool calls that cause customer harm |
| E | Accountability | 17 | Enforcing governance through approval processes and failure planning |
| F | Society | 2 | Preventing AI-enabled societal harms including cyber exploitation and catastrophic risks |

### Mandatory vs. Optional

Of 51 total requirements: **39 are mandatory**, **12 are optional**.

| Principle | Total | Mandatory | Optional |
|-----------|:-----:|:---------:|:--------:|
| A - Data & Privacy | 7 | 7 | 0 |
| B - Security | 9 | 6 | 3 |
| C - Safety | 12 | 8 | 4 |
| D - Reliability | 4 | 4 | 0 |
| E - Accountability | 17 | 12 | 5 |
| F - Society | 2 | 2 | 0 |

All Data & Privacy (A), Reliability (D), and Society (F) controls are mandatory. Security (B), Safety (C), and Accountability (E) each include optional controls that strengthen posture but are not required for certification.

### Assessment Frequency

AIUC-1 defines three assessment frequencies:

- **Quarterly (every 3 months):** 13 requirements -- primarily adversarial testing, third-party assessments, and risk taxonomy reviews
- **Semi-annual (every 6 months):** 1 requirement -- regulatory compliance documentation (E012)
- **Annual (every 12 months):** 37 requirements -- policies, governance, and foundational controls

The quarterly requirements represent the ongoing operational burden. They cannot be satisfied by annual assessments and must demonstrate consecutive execution without gaps.

---

## 4. Assessment by Principle

AIUC-1 is organized around six principles. Each principle maps directly to an assessment file and a designated lead assessor.

| Principle | Controls | Primary Assessor | Review Frequency |
|-----------|----------|------------------|------------------|
| A: Data & Privacy | A001-A007 (7 controls) | Privacy Lead | Annual |
| B: Security | B001-B009 (9 controls) | Security Assessor | Annual / Quarterly |
| C: Safety | C001-C012 (12 controls) | Safety Assessor | Annual / Quarterly |
| D: Reliability | D001-D004 (4 controls) | Reliability Assessor | Annual / Quarterly |
| E: Accountability | E001-E017 (17 controls) | Compliance Lead | Annual / Semi-annual |
| F: Societal Impact | F001-F002 (2 controls) | Ethics Lead | Annual |

### Multi-Agent Routing

| Agent | AIUC-1 Responsibilities |
|-------|------------------------|
| **Advisor** | Principles A, E, F: Data policies (A001-A007), governance (E001-E017), societal controls (F001-F002). Conducts stakeholder interviews, reviews policy documentation, evaluates governance maturity. |
| **Security** | Principles B, C, D: Security controls (B001-B009), technical safety controls (C001-C012), reliability controls (D001-D004). Performs adversarial testing, evaluates technical implementations. |
| **Engineer** | Remediation: Implements technical controls, deploys monitoring, hardens AI deployment environments. Engaged after gaps are identified. |

### Principle Sequencing

1. **Principles A, E, F assessed first** -- data policies and governance structures are prerequisites for evaluating technical controls
2. **Principles B, C, D follow** -- security and safety controls are evaluated against the governance baseline established in A, E, and F
3. **Operational readiness (Principle E)** -- failure plan testing is conducted after findings are documented and gaps are understood

---

## 5. Control Family Walkthroughs

### Family A: Data & Privacy

**Purpose:** Ensure that customer data flowing through AI systems is protected against unauthorized use, leakage, and IP exposure.

**Controls covered:** A001-A007 (all mandatory, all annual)

Data & Privacy is the foundation of trust for any AI system. These 7 controls address the full lifecycle of data interaction with AI: what goes in (input policies, data collection limits), what comes out (output policies, PII leakage prevention), and what stays protected (IP protection, cross-customer isolation, third-party IP rights).

**Key controls explained:**

- **A001/A002 (Input/Output Data Policies):** Establish formal policies covering how customer data is used for training, how outputs are owned, retention periods, and opt-out mechanisms. These are policy documents, not technical controls.
- **A003 (Agent Data Access):** Restrict AI agents to task-relevant data using role-based access controls. Agents should access only what they need for the current task, scoped by user role and session context.
- **A004 (IP Protection):** Prevent the AI system from leaking proprietary information. This includes DLP scanning on inputs, output monitoring for internal terminology, and documented provider safeguards.
- **A005 (Cross-Customer Isolation):** Ensure multi-tenant AI systems cannot expose one customer's data to another. Critical for SaaS platforms serving multiple enterprise customers.
- **A006 (PII Prevention):** Prevent personal data from appearing in AI outputs through filtering, anonymization, or guardrails.
- **A007 (Third-Party IP):** Prevent AI outputs from violating copyrights, trademarks, or other IP rights. Requires both technical controls and legal review of output usage.

**What good looks like:** Published input data policy (e.g., "AI Input Data Policy v2.1.pdf with Board approval signatures and effective date") with opt-out mechanisms implemented via account settings. Data inventory spreadsheet listing all AI data sources with retention periods (30/60/90 days). Automated deletion jobs (cron jobs, S3 lifecycle policies, database TTLs) with audit logs showing enforcement. RBAC configuration enforcing agent data scoping with quarterly access reviews. DLP scanning on both inputs and outputs. Provider policy review documenting IP safeguards. Cross-customer data isolation verified through testing results showing no data leakage between tenants.

**Common gaps:** Generic data policy repurposed for AI without AI-specific language (policy uses terms like "data processing" but doesn't mention "model training" or "inference"). Output policy uses ambiguous "license" language instead of clearly stating customer ownership. AI agent uses shared service account with database admin permissions instead of row-level security. Policy exists but data inventory incomplete or outdated (engineering team mentions data sources not in official inventory). Opt-out process requires email to support@ address instead of self-service toggle. Permissions checked at AI feature level but not data level (user can access "Data Analytics AI" but once inside, can query any table/dataset).

---

### Family B: Security

**Purpose:** Defend AI systems against adversarial attacks, prompt injection, and unauthorized access.

**Controls covered:** B001-B009 (6 mandatory, 3 optional)

Security is where AIUC-1 diverges most sharply from traditional compliance frameworks. These controls address threats that are unique to AI systems: jailbreaks, prompt injection, model endpoint scraping, and agent permission escalation. Traditional SOC 2 or ISO 27001 controls do not cover these attack vectors.

**Key controls explained:**

- **B001 (Adversarial Testing -- Mandatory, Quarterly):** The signature AIUC-1 requirement. Independent third parties must test the AI system's resilience against adversarial inputs at least quarterly. This is not a penetration test of infrastructure -- it's adversarial testing of the AI model's behavior under attack.
- **B002 (Adversarial Input Detection -- Optional, Quarterly):** Real-time monitoring to detect prompt injection and adversarial inputs as they occur.
- **B003 (Information Disclosure -- Optional, Annual):** Prevent over-disclosure of technical details about AI systems that could help attackers craft targeted attacks.
- **B004 (Endpoint Protection -- Mandatory, Annual):** Prevent scraping and probing of AI API endpoints. Rate limiting, authentication, and abuse detection.
- **B005 (Input Filtering -- Optional, Annual):** Deploy automated moderation to filter adversarial or policy-violating inputs before they reach the model.
- **B006 (Agent Access Controls -- Mandatory, Annual):** Limit what AI agents can access and do based on context and declared objectives. Principle of least privilege for agents.
- **B007 (User Access Management -- Mandatory, Quarterly):** Standard access control reviews, but specifically for AI system access. Quarterly review cadence.
- **B008 (Deployment Security -- Mandatory, Annual):** Secure model deployment environments with encryption, access controls, and authorization.
- **B009 (Output Limitation -- Mandatory, Annual):** Prevent AI outputs from leaking sensitive information through obfuscation and output filtering.

**What good looks like:** Risk taxonomy document categorizing prompt injection (direct/indirect), jailbreak attempts, data extraction, model inversion, adversarial examples with NIST AI 100-2e2023 mapping. Q1 2026 adversarial testing report from third-party (NCC Group, Trail of Bits) showing 47 test cases executed, 8 vulnerabilities discovered (2 Critical, 3 High, 3 Medium). Adversarial test suite repository with 100+ test prompts across attack categories. Remediation tracking in Jira with Critical (7-day SLA), High (30-day), Medium (90-day) showing assigned owners. Prompt injection detection triggering alerts within 5 seconds to security team via Slack/PagerDuty. Rate limiting configuration, authentication requirements, and abuse detection on API endpoints. Agent permission matrices showing context-based permission rules. Deployment environment hardening documentation showing encryption at rest and in transit, access controls, authorization mechanisms.

**Common gaps:** No adversarial testing program (no security testing in last 12 months, no adversarial test cases documented). Testing performed but not quarterly (last adversarial test was 9 months ago). No monitoring for adversarial inputs (no security logs for AI inputs, no alerting configured, no detection tools deployed like Lakera Guard or Rebuff.ai). Logging exists but no real-time alerting (logs stored but no one monitors them, attacks discovered days later). No public content review process (engineers publish blog posts without security review). GitHub repos leak system prompts and API keys (public repos contain hardcoded prompts, no secret scanning enabled). Prompt injection attempts blocked but system prompt leakage occurs. Jailbreak detection patterns exist but refusal logging incomplete.

---

### Family C: Safety

**Purpose:** Prevent harmful, out-of-scope, and high-risk outputs while maintaining testing rigor through third-party assessments.

**Controls covered:** C001-C012 (8 mandatory, 4 optional)

Safety is the largest control family. It covers the AI-specific risk of outputs that harm users, violate scope boundaries, or expose the organization to reputational damage. The family splits into three categories: (1) internal controls defining what's harmful and preventing it, (2) detection and monitoring of safety issues, and (3) third-party testing validating that internal controls work.

**Key controls explained:**

- **C001 (Risk Taxonomy -- Mandatory, Quarterly):** Define and maintain a taxonomy of AI risks specific to your application. Categories include harmful outputs, out-of-scope outputs, hallucinations, and tool call risks. This is a living document reviewed quarterly.
- **C002 (Pre-Deployment Testing -- Mandatory, Annual):** Test AI systems before deployment across all risk categories defined in the taxonomy.
- **C003-C005 (Output Prevention -- All Mandatory, Annual):** Technical controls preventing harmful outputs (C003), out-of-scope outputs (C004), and additional high-risk outputs per the risk taxonomy (C005).
- **C006 (Output Vulnerabilities -- Mandatory, Quarterly):** Prevent security vulnerabilities in AI outputs (e.g., XSS in generated code, SQL injection in generated queries).
- **C007 (High-Risk Alerting -- Optional, Annual):** Flag high-risk AI recommendations for human review before execution.
- **C008 (Risk Monitoring -- Optional, Annual):** Monitor across risk categories to detect emerging safety issues.
- **C009 (User Feedback -- Optional, Quarterly):** Enable real-time user feedback and intervention during AI interactions.
- **C010-C012 (Third-Party Testing -- All Mandatory, Quarterly):** Independent third parties evaluate the system's robustness against harmful outputs (C010), out-of-scope outputs (C011), and customer-defined risk categories (C012). These are the quarterly testing requirements that form the backbone of ongoing AIUC-1 compliance.

**What good looks like:** AI Risk Taxonomy v2.3 with categories: harmful outputs (distressed, angry, high-risk advice), out-of-scope (political, medical), hallucinations, tool call risks. Risk category spreadsheet showing category name, definition, severity (Critical/High/Medium/Low), detection method, and examples. Taxonomy mapping document showing "Harmful advice" aligned to NIST MEASURE 2.11, EU AI Act Article 9, ISO 42001 A.5.2. Q1 2026 Risk Taxonomy Review showing additions (e.g., "price quote errors" category), updated hallucination examples, increased medical advice to Critical severity. Test suite with 100+ test cases covering harmful outputs (adversarial prompts, jailbreaks), hallucinations (factual accuracy, citations), out-of-scope (topic boundaries), tool call risks. PromptFoo configuration file showing test cases per risk category. Harmful content detection operational with multi-layer detection (keyword filters plus ML classifiers). Quarterly third-party test reports with trending data across multiple cycles.

**Common gaps:** Generic taxonomy from framework template never customized for specific application. Taxonomy document exists but no detection methods defined for each category. Testing focuses on functional correctness but ignores safety risks (test suite validates feature works, not that it's safe). Manual testing performed but results not archived or accessible for audit. Keyword-only filtering without ML classifiers (simple blocklists easily bypassed). Generic content filters without domain customization (finance app uses generic toxicity filter instead of financial harm categories). Taxonomy exists but not reviewed quarterly (created once, never updated). Risk categories too vague (e.g., "harmful outputs" without specific subcategories like distressed, high-risk advice, angry tone).

---

### Family D: Reliability

**Purpose:** Prevent hallucinations and unauthorized tool calls that cause measurable customer harm.

**Controls covered:** D001-D004 (all mandatory)

Reliability addresses the two most tangible failure modes of AI agents: generating false information (hallucinations) and executing unauthorized actions (tool calls). Every control in this family is mandatory.

**Key controls explained:**

- **D001 (Hallucination Prevention -- Mandatory, Annual):** Implement technical controls to prevent hallucinated outputs. This includes RAG architectures, grounding techniques, confidence scoring, and citation requirements.
- **D002 (Hallucination Testing -- Mandatory, Quarterly):** Independent third parties assess hallucination rates and the effectiveness of prevention controls. Requires quantitative measurement.
- **D003 (Tool Call Controls -- Mandatory, Annual):** Prevent AI agents from executing unauthorized actions, accessing restricted information, or making decisions beyond their intended scope. Critical for agentic systems with function calling.
- **D004 (Tool Call Testing -- Mandatory, Quarterly):** Independent third parties test tool call authorization, safety boundaries, and scope enforcement. Evaluates whether agents can be manipulated into calling tools they shouldn't.

**What good looks like:** RAG architecture diagram showing vector database (Pinecone/Weaviate/Chroma) integration with LLM. Knowledge base inventory listing indexed sources with last update dates (product docs, policies, API specs). System prompts requiring citations in format "[Source: document name, section]" with post-processing validation code rejecting outputs without citations. Confidence threshold configuration (e.g., >80% for factual claims, <60% triggers fallback). Hallucination detection dashboard (RAGAS/TruLens/Patronus AI) with metrics showing hallucination rates over time. Alert configurations for hallucination rate spikes (e.g., >5% hourly rate). Tool call authorization matrix showing which tools each agent role can invoke with permission boundaries. Quarterly third-party test reports demonstrating resilience against tool call manipulation (agent cannot be prompted to execute unauthorized functions).

**Common gaps:** RAG knowledge base exists but not maintained (outdated documentation indexed, no update schedule). Citation format inconsistent or unverified (outputs include citations but sources not validated for accuracy). Testing conducted but ground truth dataset outdated (hallucination testing uses 2-year-old fact base). Findings documented but no remediation accountability (test reports show issues but no owner assigned to fix). Tool-level authorization but no parameter validation (agent can call approved tool but with unauthorized parameters). Rate limits exist but no transaction value caps (agent can make unlimited $0.01 transactions totaling large amounts). Confidence scores displayed but no threshold enforcement (UI shows "Low confidence" but allows action anyway). Hallucination monitoring deployed but alerts not actionable (alerts fire but no runbook for response).

---

### Family E: Accountability

**Purpose:** Establish governance structures, failure plans, and transparency mechanisms for AI systems.

**Controls covered:** E001-E017 (12 mandatory, 5 optional)

Accountability is the largest family by control count (17). It covers the organizational and procedural aspects of AI governance: who is responsible, what happens when things go wrong, how changes are managed, and how the organization demonstrates transparency.

**Key controls explained:**

- **E001-E003 (Failure Plans -- All Mandatory, Annual):** Documented response plans for three specific AI failure modes: security breaches (E001), harmful outputs causing customer harm (E002), and hallucinations causing financial loss (E003). Each plan must assign accountability and define remediation procedures.
- **E004 (Change Management -- Mandatory, Annual):** Formal documentation and review of AI system changes across the development and deployment lifecycle.
- **E005 (Cloud/Deployment Decisions -- Mandatory, Annual):** Documented criteria for cloud provider selection and on-premises processing decisions based on data sensitivity and regulatory requirements.
- **E006 (Vendor Due Diligence -- Mandatory, Annual):** Formal assessment of AI model providers and upstream vendors covering data handling, PII controls, security, and compliance.
- **E008 (Governance Reviews -- Mandatory, Annual):** Regular internal reviews of AI governance processes with documented records.
- **E010 (Acceptable Use Policy -- Mandatory, Annual):** Organization-wide AI acceptable use policy with enforcement mechanisms.
- **E012 (Regulatory Compliance -- Mandatory, Semi-Annual):** Documentation of applicable AI laws and compliance strategies. The only semi-annual requirement.
- **E015 (Activity Logging -- Mandatory, Annual):** AI-specific logging of model activity, actions, and outputs. Distinct from general application logging.
- **E016 (AI Disclosure -- Mandatory, Annual):** Mechanisms informing users they are interacting with AI rather than humans.
- **Optional controls (E007, E009, E013, E014, E017):** Formal change approvals, third-party access monitoring, quality management systems, transparency reports, and system transparency documentation. These strengthen governance but are not required for certification.

**What good looks like:** AI Breach Response Plan Section 2 with leadership designation: Incident Commander: CISO (John Smith, john@example.com, +1-555-0100), Technical Lead: Head of AI (Jane Doe), Communications Lead: VP Legal. RACI matrix for breach response. Notification timeline: Customers notified within 72 hours of breach confirmation. Customer notification template with breach details and remediation steps. System freeze procedure with kill-switch command documented. Evidence preservation checklist capturing system logs, disk/memory snapshots, database audit trails, AI model artifacts with chain of custody. Vendor due diligence records for every AI provider with scoring criteria and annual re-assessment schedule. AI-specific activity logs capturing prompts, responses, tool calls, decision chains (distinct from application logs). Active governance committee with documented meeting minutes showing quarterly reviews.

**Common gaps:** Breach plan exists but not AI-specific (general IR plan doesn't address prompt injection, model extraction). Notification timelines not defined (plan says "notify customers promptly" without specific SLA). Response plan focuses only on content removal, not customer support or communication. Harmful output categories too vague (plan says "harmful outputs" without specific categorization). Response plan exists but hallucination not defined (what threshold constitutes hallucination requiring response). Compensation policy too restrictive (plan refuses all compensation for hallucination-caused losses). AI system changes happen through normal dev processes without AI-specific accountability assignment. Vendor selection is implicit rather than formally assessed (uses AI providers without documented evaluation criteria). Infrastructure logs exist but do not capture AI model activity (logs show API calls but not prompts, responses, tool invocations). Governance reviews happen but meeting minutes not documented or accessible for audit.

---

### Family F: Society

**Purpose:** Prevent AI systems from being exploited for cyber attacks or catastrophic harm.

**Controls covered:** F001-F002 (both mandatory, annual)

Society is the smallest family but addresses the highest-severity risks. These controls ensure that AI systems cannot be weaponized for societal harm.

**Key controls explained:**

- **F001 (Cyber Exploitation Prevention -- Mandatory, Annual):** Guardrails preventing AI systems from being used to assist with cyber attacks, exploitation techniques, or offensive security operations outside authorized contexts.
- **F002 (CBRN Risk Prevention -- Mandatory, Annual):** Guardrails preventing AI systems from providing information or assistance related to chemical, biological, radiological, or nuclear (CBRN) weapons development or mass harm scenarios.

**What good looks like:** OpenAI GPT-4 System Card showing offensive cyber capability testing results with malware generation risk assessment and mitigations. Anthropic Claude RSP (Responsible Scaling Policy) showing ASL-3 cyber capability testing with exploit development assessments. Formal provider attestation letter from Anthropic (dated 2025-11-15) confirming Claude 3.5 Sonnet has cyber safety mitigations intact per ASL-3 testing. Guardrails AI configuration blocking keywords (malware, exploit, shellcode) with cyber-specific validators. Usage monitoring logs showing rejected queries categorized as cyber-related (malware generation, vulnerability exploitation). Model inventory listing AI systems with cyber attestation dates and expiration dates (e.g., "AI System A uses Claude 3.5 Sonnet, cyber attestation dated 2025-11-15, expires 2026-11-15"). Attestation renewal workflow with annual reminder triggering attestation request tracked in procurement system. CBRN provider attestation completeness and currency with CBRN evaluation benchmark assessment results.

**Common gaps:** No provider attestation obtained or documented (assuming model provider has safeguards without verification). Attestation obtained 24 months ago, never renewed despite model updates (using GPT-4 but attestation is for GPT-3.5). No CBRN attestation obtained because team assumes "our AI doesn't do chemistry" (not realizing general-purpose models need guardrails). CBRN attestation exists but was never validated for actual testing methodology (accepted provider claim without reviewing test approach). Guardrail documentation exists but no testing results (documented policy to refuse cyber exploitation but never tested refusal works). Guardrails AI configured but not regularly updated as new exploitation techniques emerge (configuration from 18 months ago never refreshed).

---

## 6. Evidence Requirements

### Evidence Matrix

| Control Family | Evidence Types |
|---------------|----------------|
| A - Data & Privacy | **Policy documents:** "AI Input Data Policy v2.1.pdf with Board approval signatures" showing training vs inference usage, opt-out procedures, customer rights. **Data inventory:** Spreadsheet listing all AI data sources with retention periods (30/60/90 days), database retention policies in data dictionary. **Automated enforcement:** Cron jobs, S3 lifecycle policies, database TTLs with audit logs showing deletion enforcement. **Ownership documentation:** AI Output Policy stating "Customer owns all AI-generated content" in Terms of Service. **RBAC configuration:** Agent permission matrix, access review records (quarterly). **DLP configs:** Provider policy review, IP incident response procedure. **Testing results:** Cross-customer isolation testing, PII filtering validation. |
| B - Security | **Risk taxonomy:** Document categorizing prompt injection (direct/indirect), jailbreak attempts, data extraction, model inversion, adversarial examples with NIST AI 100-2e2023 mapping. **Quarterly testing:** Q1 2026 adversarial testing report from third-party (NCC Group, Trail of Bits) showing 47 test cases executed, 8 vulnerabilities discovered (2 Critical, 3 High, 3 Medium). **Test suite:** Adversarial test repository with 100+ test prompts, test methodology document. **Remediation tracking:** Jira dashboard showing Critical (7-day SLA), High (30-day), Medium (90-day) with assigned owners. **Detection systems:** Adversarial input detection logs, monitoring configurations. **Endpoint protection:** Rate limiting configs, authentication requirements, abuse detection evidence. **Access reviews:** Quarterly access review records, role definitions, revocation logs. **Deployment hardening:** Encryption configuration, access control evidence. |
| C - Safety | **Risk taxonomy:** "AI Risk Taxonomy v2.3" with harmful outputs (distressed, angry, high-risk advice), out-of-scope (political, medical), hallucinations, tool call risks. Risk category spreadsheet with category name, definition, severity (Critical/High/Medium/Low), detection method, examples. **Framework alignment:** Taxonomy mapping document showing "Harmful advice" aligned to NIST MEASURE 2.11, EU AI Act Article 9, ISO 42001 A.5.2. **Review records:** "Q1 2026 Risk Taxonomy Review" showing quarterly updates (added categories, updated examples, severity changes) with meeting calendar invites. **Test suite:** 100+ test cases with PromptFoo configuration per risk category. **Prevention configs:** Harmful output prevention, scope enforcement rules, guardrail testing results. **Quarterly testing:** Third-party safety test reports for harmful, out-of-scope, customer risk categories. **Monitoring:** Dashboards, risk category alert configurations. **Feedback mechanism:** User feedback collection, intervention workflow evidence. |
| D - Reliability | **RAG implementation:** Architecture diagram showing vector database (Pinecone/Weaviate/Chroma) integration, knowledge base inventory with last update dates (product docs, policies, API specs). **Citation enforcement:** System prompts requiring "[Source: document name, section]" format, post-processing validation code rejecting outputs without citations. **Confidence thresholds:** Configuration file (e.g., >80% for factual claims, <60% triggers fallback), UI screenshots showing confidence indicators (High/Medium/Low badges). **Hallucination monitoring:** Dashboard (RAGAS/TruLens/Patronus AI) with metrics, alert configurations for hallucination rate spikes (>5% hourly rate). **Tool call authorization:** Authorization matrix showing which tools each agent role can invoke, permission boundaries documentation. **Quarterly testing:** Third-party hallucination assessment reports, tool call security test reports demonstrating resilience against manipulation. |
| E - Accountability | **AI failure plans (3):** Security breach plan with leadership designation (Incident Commander: CISO with contact info), RACI matrix, notification procedures (customers within 72 hours), notification templates, remediation procedures (system freeze/kill-switch, evidence preservation checklist with chain of custody). Harmful output plan. Hallucination plan with financial loss response procedures. **Vendor due diligence:** Assessment records with scoring criteria, annual re-assessment schedule. **Change management:** RACI documentation, change approval workflow, sign-off records. **Acceptable use policy:** Published policy with enforcement mechanisms, violation tracking. **Regulatory mapping:** Compliance mapping document with jurisdiction analysis (semi-annual updates). **AI activity logs:** Log samples showing prompts, responses, tool calls, decision chains (distinct from application logs), retention configuration. **Governance records:** Meeting minutes from governance committee showing quarterly reviews. **AI disclosure:** UI screenshots, API responses showing AI disclosure mechanisms. |
| F - Society | **Provider attestation:** OpenAI GPT-4 System Card showing offensive cyber capability testing results, Anthropic Claude RSP (ASL-3 cyber capability testing). Formal attestation letters from providers (dated, with expiration). **Model inventory:** Spreadsheet listing AI systems with cyber attestation dates and expiration (e.g., "Claude 3.5 Sonnet, cyber attestation 2025-11-15, expires 2026-11-15"). **Guardrail configs:** Guardrails AI configuration blocking keywords (malware, exploit, shellcode) with cyber-specific validators. **Testing results:** Red team test results showing AI refusal for prohibited scenarios. **Monitoring logs:** Usage monitoring logs showing rejected queries categorized as cyber-related or CBRN-related. **Attestation renewal:** Workflow documentation with annual reminders tracked in procurement system. **CBRN attestation:** Provider CBRN evaluation benchmark assessment results with testing methodology validation. |

### Common Evidence Artifacts

**Policies and Documentation:**
- AI input data policy, AI output data policy
- AI acceptable use policy
- AI failure/incident response plans (security, harmful output, hallucination)
- Risk taxonomy document
- Vendor due diligence records
- Regulatory compliance mapping
- Processing location records

**Technical Evidence:**
- RBAC and agent permission configurations
- DLP scanning configurations
- Deployment environment hardening (encryption, access controls)
- AI activity logs (prompts, responses, tool calls)
- Endpoint protection (rate limiting, authentication)

**Test Results:**
- Quarterly adversarial testing reports
- Quarterly third-party safety testing reports (harmful, out-of-scope, customer risk)
- Quarterly hallucination assessment results
- Quarterly tool call security testing results
- Pre-deployment test results

**Governance Records:**
- Governance committee meeting minutes
- Change management records
- Access review records (quarterly)
- Annual policy review sign-offs

### Evidence Organization

Organize evidence by principle and requirement ID. See the certification guide (Section 5) for the recommended repository structure. Key principles:
- File by requirement ID (e.g., `B001-adversarial-test-report-2026-Q1.pdf`)
- Maintain consecutive quarterly evidence without gaps
- Keep policies version-controlled with review dates
- Store governance records with approval signatures

---

## 7. Common Findings and Pitfalls

### Most Frequently Identified Gaps

1. **Missing third-party assessors (B001, C010-C012, D002, D004).** The most common certification blocker. Organizations perform internal testing but lack independent third-party assessors performing quarterly evaluations. Common indicators: No security testing in last 12 months, no adversarial test cases documented, no assessor engagement letters. Last adversarial test was 9 months ago with no calendar reminders for quarterly testing. Procurement, contracting, and onboarding qualified assessors takes months.

2. **Incomplete risk taxonomy (C001).** Generic taxonomy from framework template never customized for specific application. Risk taxonomies exist but lack severity grading, likelihood assessments, mitigating control mapping, or evidence of quarterly review. Taxonomy document exists but no detection methods defined for each category. Risk categories too vague (e.g., "harmful outputs" without specific subcategories like distressed, high-risk advice, angry tone). The standard requires a living document with quarterly updates.

3. **Informal vendor due diligence (E006).** Organizations use AI providers without documented evaluation criteria, scoring, or annual re-assessment. Vendor selection is implicit rather than formally assessed. Common indicators: No vendor assessment records, no scoring criteria, providers selected based on reputation alone without formal evaluation.

4. **Insufficient AI-specific logging (E015).** Infrastructure logs exist but do not capture AI model activity (prompts, responses, tool invocations, decision chains). AI-specific logging is distinct from application logging. Logs show API calls but not prompts, responses, or tool invocations. No log retention configuration specific to AI activity.

5. **Weak change management (E004, E007).** AI system changes happen through normal dev processes without AI-specific accountability assignment, lifecycle documentation, or formal approval workflows. No RACI documentation for AI changes. Changes deployed without AI-specific review or sign-off.

6. **Quarterly cadence not established.** Testing exists but not on a quarterly schedule. Annual pentests do not satisfy B001. Ad hoc safety reviews do not satisfy C010-C012. Testing conducted but ground truth datasets outdated. Findings documented but no remediation accountability assigned.

7. **Data policy gaps (A001, A002).** General privacy policies exist but lack AI-specific provisions for training data usage, opt-out mechanisms, AI interaction retention, and output ownership. Generic data policy repurposed for AI without AI-specific language (policy uses "data processing" but doesn't mention "model training" or "inference"). Policy exists but data inventory incomplete or outdated. Opt-out process requires email to support@ instead of self-service toggle. Output policy uses ambiguous "license" language instead of clearly stating customer ownership.

8. **Missing AI failure plans (E001, E002, E003).** General incident response plans exist but do not address AI-specific failure modes: prompt injection breaches, harmful output incidents, systematic hallucination failures. Breach plan exists but not AI-specific (doesn't address prompt injection, model extraction). Notification timelines not defined (plan says "notify customers promptly" without specific SLA). Response plan focuses only on content removal, not customer support. Hallucination not defined (what threshold requires response). Compensation policy too restrictive (plan refuses all compensation for hallucination-caused losses).

9. **Detection without alerting (B002, C007, C008, D002).** Monitoring deployed but no real-time alerting configured. Logs stored but no one monitors them, attacks discovered days later during manual log review. Hallucination monitoring deployed but alerts not actionable (alerts fire but no runbook for response).

10. **Provider attestation gaps (F001, F002).** No provider attestation obtained or documented for cyber/CBRN safeguards (assuming model provider has guardrails without verification). Attestation obtained 24 months ago, never renewed despite model updates. CBRN attestation exists but was never validated for actual testing methodology. No model inventory tracking attestation expiration dates.

### Difficulty Areas

- **Third-party testing procurement** has the longest lead time and is frequently underestimated
- **AI-specific logging** requires engineering effort to instrument model interactions beyond standard application logging
- **Risk taxonomy maintenance** requires quarterly discipline that organizations accustomed to annual reviews often struggle to maintain
- **Cross-functional coordination** across legal (policies), engineering (technical controls), security (testing), and GRC (governance) teams

### Maturity Spectrum

| Level | Description |
|:-----:|-------------|
| 0 - None | No AI-specific governance or controls. General IT security policies exist but do not address AI risks. |
| 1 - Initial | Some AI policies drafted but not formalized. Internal testing occurs ad hoc. No third-party assessors engaged. |
| 2 - Developing | Policies published and signed. Internal testing on schedule. Third-party assessor procurement in progress. Some quarterly cycles completed. |
| 3 - Defined | All mandatory controls implemented. Quarterly cadence established with 2+ consecutive cycles. Evidence repository organized. Certification-ready. |
| 4 - Managed | Full compliance sustained across multiple annual cycles. Trend data showing improvement. Optional controls implemented. Proactive risk taxonomy updates. |

---

## 8. Path to Compliance

### High-Level Roadmap

**Stage 1: Foundation (Months 1-2)**
- Conduct internal self-assessment against all 51 requirements
- Draft AI-specific policies (data, acceptable use, failure plans)
- Begin risk taxonomy development
- Start third-party assessor procurement

**Stage 2: Remediation (Months 2-4)**
- Implement mandatory controls for identified gaps
- Deploy AI-specific logging and monitoring
- Formalize governance structure and review cadence
- Execute first quarterly assessment cycle

**Stage 3: Cadence (Months 4-6)**
- Complete second consecutive quarterly cycle
- Build and organize evidence repository
- Conduct internal readiness assessment
- Engage Schellman for pre-assessment (if available)

**Stage 4: Certification (Months 6-8)**
- Formal audit: evidence review, stakeholder interviews, AIUC technical evaluation
- Remediate any P0/P1 findings
- Certificate issuance

### Certification Process Overview

AIUC-1 certification uses a dual structure:
- **AIUC** conducts technical evaluations (adversarial testing across enterprise risk scenarios)
- **Schellman** provides independent audit evidence collection, reporting, and certification guidance

The certificate has a 12-month display term with quarterly testing maintaining validity. Annual recertification is required. Failure to recertify requires removal of all compliance claims.

For complete certification preparation details, see `aiuc1-certification-guide.md`.

---

## 9. Quick Reference Tables

### Control Reference

| Control | Title | Mandatory | Frequency |
|:-------:|-------|:---------:|:---------:|
| A001 | Establish input data policy | Yes | Annual |
| A002 | Establish output data policy | Yes | Annual |
| A003 | Limit AI agent data collection | Yes | Annual |
| A004 | Protect IP & trade secrets | Yes | Annual |
| A005 | Prevent cross-customer data exposure | Yes | Annual |
| A006 | Prevent PII leakage | Yes | Annual |
| A007 | Prevent IP violations | Yes | Annual |
| B001 | Third-party adversarial testing | Yes | Quarterly |
| B002 | Detect adversarial input | No | Quarterly |
| B003 | Manage technical disclosure | No | Annual |
| B004 | Prevent endpoint scraping | Yes | Annual |
| B005 | Real-time input filtering | No | Annual |
| B006 | Limit agent system access | Yes | Annual |
| B007 | Enforce user access privileges | Yes | Quarterly |
| B008 | Protect deployment environment | Yes | Annual |
| B009 | Limit output over-exposure | Yes | Annual |
| C001 | Define AI risk taxonomy | Yes | Quarterly |
| C002 | Pre-deployment testing | Yes | Annual |
| C003 | Prevent harmful outputs | Yes | Annual |
| C004 | Prevent out-of-scope outputs | Yes | Annual |
| C005 | Prevent high-risk outputs | Yes | Annual |
| C006 | Prevent output vulnerabilities | Yes | Quarterly |
| C007 | Flag high-risk recommendations | No | Annual |
| C008 | Monitor risk categories | No | Annual |
| C009 | Real-time feedback/intervention | No | Quarterly |
| C010 | Third-party harmful output testing | Yes | Quarterly |
| C011 | Third-party out-of-scope testing | Yes | Quarterly |
| C012 | Third-party customer risk testing | Yes | Quarterly |
| D001 | Prevent hallucinated outputs | Yes | Annual |
| D002 | Third-party hallucination testing | Yes | Quarterly |
| D003 | Restrict unsafe tool calls | Yes | Annual |
| D004 | Third-party tool call testing | Yes | Quarterly |
| E001 | Failure plan: security breaches | Yes | Annual |
| E002 | Failure plan: harmful outputs | Yes | Annual |
| E003 | Failure plan: hallucinations | Yes | Annual |
| E004 | Assign accountability | Yes | Annual |
| E005 | Cloud vs on-prem assessment | Yes | Annual |
| E006 | Vendor due diligence | Yes | Annual |
| E007 | System change approvals | No | Annual |
| E008 | Internal process reviews | Yes | Annual |
| E009 | Third-party access monitoring | No | Annual |
| E010 | AI acceptable use policy | Yes | Annual |
| E011 | Record processing locations | Yes | Annual |
| E012 | Document regulatory compliance | Yes | Semi-Annual |
| E013 | Quality management system | No | Annual |
| E014 | Transparency reports | No | Annual |
| E015 | Log model activity | Yes | Annual |
| E016 | AI disclosure mechanisms | Yes | Annual |
| E017 | System transparency policy | No | Annual |
| F001 | Prevent AI cyber misuse | Yes | Annual |
| F002 | Prevent catastrophic misuse | Yes | Annual |

### Control-to-Evidence Matrix

| Control | Evidence Required |
|:-------:|-------------------|
| A001 | Published input data policy, data inventory, retention enforcement, annual review records |
| A002 | Output data policy in ToS, ownership decision matrix, opt-out mechanism |
| A003 | Agent permission matrix, RBAC configuration, quarterly access review records |
| A004 | Provider policy review, DLP configuration, IP incident response procedure |
| A005 | Cross-customer isolation architecture, testing results |
| A006 | PII filtering configuration, anonymization evidence, testing results |
| A007 | IP rights review process, output filtering for copyrighted content |
| B001 | Quarterly third-party adversarial test reports, assessor engagement letter |
| B002 | Adversarial input detection system documentation, monitoring logs |
| B003 | Technical disclosure policy, information release review process |
| B004 | Rate limiting configuration, authentication requirements, abuse detection |
| B005 | Input moderation system configuration, filtering rules |
| B006 | Agent access control configuration, context-based permission rules |
| B007 | Quarterly access review records, role definitions, revocation logs |
| B008 | Encryption configuration, access control evidence, deployment hardening |
| B009 | Output filtering rules, obfuscation techniques, information leakage testing |
| C001 | Risk taxonomy document with quarterly review dates and updates |
| C002 | Pre-deployment test plans and results across risk categories |
| C003 | Harmful output prevention configuration, guardrail testing results |
| C004 | Scope enforcement rules, out-of-scope output testing results |
| C005 | Custom risk category controls, taxonomy-aligned testing |
| C006 | Output vulnerability scanning, quarterly review records |
| C007 | Human review alerting system, escalation procedures |
| C008 | Monitoring dashboards, risk category alert configuration |
| C009 | Feedback collection mechanism, intervention workflow |
| C010 | Quarterly third-party harmful output test reports |
| C011 | Quarterly third-party out-of-scope output test reports |
| C012 | Quarterly third-party customer risk test reports |
| D001 | Hallucination prevention architecture, accuracy metrics |
| D002 | Quarterly third-party hallucination assessment reports |
| D003 | Tool call authorization matrix, permission boundaries |
| D004 | Quarterly third-party tool call security test reports |
| E001 | AI failure plan for security breaches, accountability assignment |
| E002 | AI failure plan for harmful outputs, remediation procedures |
| E003 | AI failure plan for hallucinations, financial loss response |
| E004 | Change management records, RACI documentation |
| E005 | Cloud provider evaluation criteria, deployment decision records |
| E006 | Vendor assessment records, scoring criteria, annual re-assessment |
| E007 | Change approval workflow, sign-off records |
| E008 | Internal review meeting minutes, governance audit records |
| E009 | Third-party access monitoring logs, alerting configuration |
| E010 | Acceptable use policy, enforcement mechanisms, violation tracking |
| E011 | Processing location inventory, data flow documentation |
| E012 | Regulatory mapping document, jurisdiction analysis (semi-annual updates) |
| E013 | QMS documentation, quality metrics |
| E014 | Transparency report, stakeholder distribution records |
| E015 | AI activity log samples, log retention configuration |
| E016 | AI disclosure mechanism (UI screenshots, API responses) |
| E017 | System transparency policy, model cards, datasheets |
| F001 | Cyber exploitation guardrail documentation, testing results |
| F002 | CBRN guardrail documentation, testing results |

### Control-to-Policy Mapping

| Control | Applicable Policy Templates |
|:-------:|----------------------------|
| A001-A007 | `ai_data_privacy.md` |
| B001-B009 | `ai_security.md`, `network_security.md` |
| C001-C012 | `ai_safety.md`, `risk_management.md` |
| D001-D004 | `ai_reliability.md` |
| E001-E003 | `incident_response.md`, `ai_accountability.md` |
| E004-E008 | `ai_accountability.md`, `configuration_management.md` |
| E010 | `acceptable_use.md`, `ai_accountability.md` |
| E011-E012 | `ai_accountability.md`, `privacy_management.md` |
| E013-E017 | `ai_accountability.md`, `ai_governance.md` |
| F001-F002 | `ai_societal_safety.md` |

### Glossary

| Term | Definition |
|------|-----------|
| **Adversarial testing** | Testing AI systems with inputs designed to cause failures, including jailbreaks, prompt injection, and data exfiltration attempts |
| **Agent** | An AI system that can take autonomous actions, execute tool calls, and interact with external systems |
| **CBRN** | Chemical, Biological, Radiological, Nuclear -- catastrophic risk category |
| **Control** | A specific, testable requirement within the AIUC-1 standard |
| **DLP** | Data Loss Prevention -- tools that detect and prevent sensitive data from leaving the organization |
| **Function/Principle** | One of AIUC-1's 6 top-level control categories (A through F) |
| **Guardrail** | A technical or procedural control that constrains AI system behavior |
| **Hallucination** | AI-generated output that presents fabricated information as factual |
| **Jailbreak** | An adversarial technique that bypasses AI safety controls to produce prohibited outputs |
| **Prompt injection** | An attack where malicious instructions are embedded in AI inputs to override system behavior |
| **RAG** | Retrieval-Augmented Generation -- grounding AI outputs in retrieved factual sources |
| **Risk taxonomy** | A structured categorization of AI-specific risks for a given application |
| **Tool call** | An AI agent's invocation of an external function, API, or system action |
| **Trust Service Criteria (TSC)** | SOC 2's control framework -- does not cover AI-specific risks |

---

## Sources

- [AIUC-1 Official Standard](https://www.aiuc-1.com/) -- Full requirement set and documentation
- [Schellman AIUC-1 Partnership](https://www.schellman.com/blog/news/schellman-becomes-the-first-accredited-auditor-for-aiuc-1) -- Audit partnership announcement
- [AIUC-1 Navigator](https://adversis.github.io/aiuc1-navigator/) -- Interactive control explorer
- [Intercom AIUC-1 Certification](https://www.intercom.com/blog/intercom-achieves-aiuc-1-certification/) -- First certified organization case study
- [UiPath AIUC-1 Founding Contributor](https://www.uipath.com/newsroom/uipath-becomes-founding-contributor-to-aiuc-1) -- Consortium membership
- AIUC-1 REFERENCE document (internal framework reference, `AIUC-1-REFERENCE.md`)
- AIUC-1 Implementation Guide (internal, `aiuc1-implementation-guide.md`)
- AIUC-1 Certification Guide (internal, `aiuc1-certification-guide.md`)
