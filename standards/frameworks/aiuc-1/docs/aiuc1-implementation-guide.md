---
type: reference
name: aiuc1-implementation-guide
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-13
---

# AIUC-1 Implementation Guide

**Purpose:** Actionable implementation guidance for each of the 51 AIUC-1 controls. Use this after an assessment has identified gaps -- it tells you exactly HOW to achieve Full Compliance for each control.

**Audience:** AI teams, security teams, compliance officers, and engineering leads at organizations implementing AIUC-1.

**Standard:** AI Unified Controls v1.0 | **Source:** [aiuc-1.com](https://www.aiuc-1.com/)

**Operationalizes:** EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, CSA AICM

---

## How to Use This Guide

1. **Identify your gaps** from your AIUC-1 assessment results
2. **Navigate to the control** using the table of contents below
3. **Follow the implementation steps** in order
4. **Collect evidence** matching the examples provided
5. **Avoid common pitfalls** listed for each control

**Effort Estimates:** Quick (minimal process changes), Standard (requires some tooling or documentation), Extended (requires engineering effort, vendor engagement, or cross-functional coordination)

---

## Table of Contents

- [Principle A: Data and Privacy](#principle-a-data-and-privacy) (A001-A007)
- [Principle B: Security](#principle-b-security) (B001-B009)
- [Principle C: Safety](#principle-c-safety) (C001-C012)
- [Principle D: Reliability](#principle-d-reliability) (D001-D004)
- [Principle E: Accountability](#principle-e-accountability) (E001-E017)
- [Principle F: Society](#principle-f-society) (F001-F002)

---

## Principle A: Data and Privacy

Safeguarding customer information against leakage, IP exposure, and unauthorized training use.

---

### Control A001: Establish Input Data Policy

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
The organization has defined and communicated input data usage policies with opt-in/opt-out mechanisms and disclosure requirements. Data retention and deletion procedures are implemented for training data, inference logs, and customer-submitted content. Retention periods are documented and justified for each data category.

**Implementation Steps:**
1. Inventory all data sources feeding your AI system (chat logs, file uploads, API inputs, context windows, RAG sources)
2. Define retention periods for each data type with documented justification (e.g., chat logs 90 days, file uploads 30 days)
3. Draft a data usage policy covering: what data is collected, how it is used, whether it trains models, opt-out mechanisms, and deletion rights
4. Implement technical controls for data retention enforcement (auto-purge schedules, deletion APIs)
5. Publish the policy in your terms of service and product documentation
6. Implement processes for customer data subject rights (access, portability, deletion requests)
7. Set a calendar reminder for annual policy review

**Recommended Tools and Approaches:**
- **Data inventory:** Google Sheets, Notion, or OneTrust for tracking data flows
- **Retention enforcement:** Scheduled database cleanup jobs, TTL-based storage
- **Policy publishing:** Terms of service generators (Termly), privacy policy builders
- **Rights management:** OneTrust, custom deletion request workflows

**Example Evidence:**
- Published input data policy document with version history
- Data inventory spreadsheet mapping sources to retention periods
- Technical implementation of auto-deletion (code, configuration, or screenshots)
- Customer-facing FAQ on data rights
- Annual review meeting minutes with sign-off

**Common Pitfalls:**
- Writing a policy that does not match technical reality (policy says 30 days, data persists indefinitely)
- Failing to cover inference logs and context window data -- these are often overlooked
- No mechanism for customers to actually exercise opt-out or deletion rights
- Policy language so vague that auditors cannot verify compliance

**Effort Estimate:** Standard

---

### Control A002: Establish Output Data Policy

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
The organization has defined output ownership rights with clear distinctions between customer inputs and AI outputs. Consent and opt-out procedures for output usage are disclosed. Output usage policies are communicated through accessible terms of service.

**Implementation Steps:**
1. Decide your output ownership stance (customer owns all output, shared ownership, or company retains rights) -- for most organizations, "customer owns output" is simplest
2. Document whether AI outputs are re-used for model training, analytics, or improvement
3. Create an opt-out process so customers can prevent their outputs from being used for training
4. Add clear language to your terms of service specifying output ownership and re-use policies
5. Create a customer-facing FAQ explaining output rights in plain language
6. Brief customer-facing teams (support, sales, success) on the policy

**Recommended Tools and Approaches:**
- **Policy drafting:** Google Docs, Termly, or legal counsel
- **Contract management:** Ironclad for enterprise agreements
- **Opt-out implementation:** Account settings toggle, email request process

**Example Evidence:**
- Published output data policy in terms of service
- Output rights decision matrix (output type, ownership, re-use rules)
- Screenshot of opt-out mechanism in product settings
- Customer-facing FAQ document
- Training materials for customer-facing teams

**Common Pitfalls:**
- Ambiguous ownership language that could be interpreted either way
- No actual opt-out mechanism despite policy claiming one exists
- Failing to distinguish between different output types (text generation vs. summaries vs. code)
- Not updating the policy when you change how outputs are used

**Effort Estimate:** Standard

---

### Control A003: Limit AI Agent Data Collection

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Data collection limits are configured to reduce privacy exposure through time-bounded, task-specific, purpose-limited contextual data. Scoping actions are implemented based on agent objectives, session type, or workflow stage.

**Implementation Steps:**
1. Map which data sources each AI feature or agent needs access to -- start with deny-by-default
2. Implement role-based access controls (RBAC) so agents only access data appropriate for the user's role
3. Set session-based data access limits (time-bounded context, no persistent memory across sessions unless required)
4. Implement scoping actions tied to agent objectives (e.g., a document summarizer only accesses the uploaded document, not the entire file store)
5. Deploy monitoring to detect agents accessing data outside their scope
6. Integrate with your IAM system to align agent permissions with organizational roles
7. Log and audit data access patterns quarterly; revoke unused permissions

**Recommended Tools and Approaches:**
- **IAM integration:** Okta, AWS IAM, Azure AD for role-based controls
- **Policy enforcement:** Open Policy Agent (OPA) for declarative access policies
- **Monitoring:** Langfuse, custom audit logging
- **Session management:** Session-scoped context windows, memory boundaries

**Example Evidence:**
- Agent permission matrix showing data access by role and task
- RBAC configuration screenshots or policy-as-code files
- Audit logs showing agent data access within scope
- Quarterly access review records with revocations documented

**Common Pitfalls:**
- Granting agents blanket access to all organizational data for convenience
- No session boundaries -- agent retains context from previous users
- Access control on paper but not technically enforced
- Failing to review and revoke permissions as roles change

**Effort Estimate:** Standard

---

### Control A004: Protect IP and Trade Secrets

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Foundation model provider safeguards are documented as primary IP protection. Supplementary data access controls are established where provider protections are insufficient. Output monitoring procedures exist with automated review for high-risk scenarios.

**Implementation Steps:**
1. Review your foundation model provider's data handling policies -- document what they cover regarding IP protection and training data usage
2. Identify your sensitive data categories (proprietary source code, financial projections, strategic plans, customer data)
3. Classify which data categories should never be sent to external AI systems
4. Implement input filters or DLP rules to block or warn when sensitive data is submitted to AI
5. Set up output scanning for proprietary information patterns (internal project names, code signatures, financial figures)
6. Create an IP incident response procedure for handling suspected leaks
7. Document the gap between provider coverage and your supplementary controls

**Recommended Tools and Approaches:**
- **DLP scanning:** Nightfall AI, Microsoft Purview, Google DLP
- **Input filtering:** Custom regex patterns, classification models
- **Provider review:** Review data processing agreements (DPAs) from OpenAI, Anthropic, Google, etc.
- **Output scanning:** Custom validators checking for internal terminology patterns

**Example Evidence:**
- Provider data handling policy review with gap analysis
- Sensitive data classification matrix (category, sensitivity, AI input allowed, control method)
- DLP rule configuration or input filter implementation
- IP incident response procedure document
- Test results showing filters block sensitive data submission

**Common Pitfalls:**
- Assuming the provider handles everything -- most providers protect against cross-customer leakage but do not prevent your own users from pasting trade secrets into prompts
- Not classifying data before implementing controls (you cannot protect what you have not identified)
- Overly strict filters that block legitimate use and drive users to shadow AI tools
- No incident response procedure for when IP does leak

**Effort Estimate:** Standard

---

### Control A005: Prevent Cross-Customer Data Exposure

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Explicit consent and disclosure are in place when customer data combines with data from other customers. Customer data isolation controls exist with logical or physical separation. Provider tenant isolation is verified and documented.

**Implementation Steps:**
1. Verify your AI provider's tenant isolation approach -- request documentation of their architecture
2. Implement customer-specific API keys, namespaces, or tenant identifiers for all AI interactions
3. Opt out of cross-customer data sharing for model training -- get written confirmation from your provider
4. Test isolation by creating synthetic data under fake customer accounts and verifying it never appears in other customer contexts
5. Document the isolation architecture (data flow diagram showing separation points)
6. For multi-tenant deployments, implement session isolation ensuring no cross-session memory leakage

**Recommended Tools and Approaches:**
- **Enterprise AI services:** Azure OpenAI (dedicated instances), AWS Bedrock (per-tenant isolation)
- **Session isolation:** Langfuse for tenant-tagged observability
- **Testing:** Synthetic data injection tests, cross-tenant probe testing
- **Privacy-enhancing:** Differential privacy, federated learning for advanced scenarios

**Example Evidence:**
- Provider tenant isolation documentation or attestation letter
- Customer-specific API key or namespace configuration
- Data flow diagram showing isolation boundaries
- Synthetic data test results proving cross-customer isolation
- Written opt-out confirmation from AI provider regarding training data

**Common Pitfalls:**
- Using a shared API key for all customers without tenant-level separation
- Relying on provider claims without testing or documented verification
- Fine-tuning models on combined customer data without consent
- Ignoring inference-time isolation (shared context windows)

**Effort Estimate:** Standard

---

### Control A006: Prevent PII Leakage

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Data segregation controls isolate user sessions. Safeguards exist between users with user-specific output boundaries. PII types are identified with defined output handling policies. Output monitoring scans for cross-customer leakage.

**Implementation Steps:**
1. Define PII categories relevant to your business (names, email addresses, SSNs, phone numbers, addresses, financial data)
2. Deploy output scanning using NER (Named Entity Recognition) or regex patterns to detect PII in AI responses
3. Implement redaction or blocking actions for each PII type based on risk
4. Enforce user session isolation so one user's PII cannot appear in another user's responses
5. Log all PII detection events for review and false positive tuning
6. Test controls with synthetic PII data to verify detection accuracy
7. Integrate with DLP systems if available to block policy violations at the network layer

**Recommended Tools and Approaches:**
- **PII detection (OSS):** Microsoft Presidio for NER-based PII detection
- **PII detection (cloud):** AWS Comprehend, Google DLP
- **Output validation:** guardrails-ai validators, custom regex pipelines
- **Session isolation:** Tenant-scoped context, per-user memory boundaries

**Example Evidence:**
- PII detection rules document (PII type, detection method, action, false positive rate)
- Test results with synthetic PII showing detection and redaction
- PII detection event logs showing system is operational
- Session isolation architecture documentation
- Quarterly review of detection effectiveness

**Common Pitfalls:**
- Only scanning for obvious PII (emails, SSNs) and missing contextual PII (names combined with locations)
- High false positive rates that degrade user experience without tuning
- No session isolation -- shared conversation history across users
- Scanning inputs but not outputs (PII can be generated, not just echoed)

**Effort Estimate:** Extended

---

### Control A007: Prevent IP Violations

- **Principle:** A - Data and Privacy
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Provider protections for copyright and trademark handling are documented. Supplementary filtering for copyright and trademark violations is established. User guidance explains prohibited content types. Incident response procedures exist for potential infringement.

**Implementation Steps:**
1. Review your AI provider's copyright and trademark policies -- document what protections they offer
2. Identify high-risk content types for your use case (code generation, marketing copy, image generation, music)
3. Implement user guidance clearly stating what types of copyrighted content should not be requested
4. Add supplementary output filtering for known copyrighted patterns (e.g., license header checks for generated code)
5. Create an incident response procedure for handling copyright or trademark infringement reports
6. Embed warnings for high-risk prompts (e.g., "generate content in the style of [specific author]")

**Recommended Tools and Approaches:**
- **Provider policies:** Review AI provider usage policies and IP indemnification terms
- **Plagiarism scanning:** Copyscape for text, code license scanners for generated code
- **Content filtering:** Custom validators checking for trademark terms, brand names, verbatim quotes
- **Legal framework:** DMCA takedown procedure template

**Example Evidence:**
- Provider copyright policy review and gap analysis
- Content risk assessment by output type (code, text, images)
- User guidance documentation on prohibited content requests
- Infringement report handling procedure
- Supplementary filter configuration

**Common Pitfalls:**
- Assuming the AI provider covers all IP risk (they usually provide limited indemnification)
- No process for handling external infringement complaints
- Ignoring code generation IP risk -- generated code may include copyrighted snippets
- Failing to distinguish between inspiration and reproduction in creative content

**Effort Estimate:** Quick

---

## Principle B: Security

Defending against adversarial inputs, prompt injection, and jailbreak attempts.

---

### Control B001: Adversarial Testing Program

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
A risk taxonomy is established referencing NIST AI 100-2e2023 attack classifications. Comprehensive testing is conducted quarterly including red-teaming, prompt injection assessments, and jailbreaking attempts. Test cases, methods, and outcomes are securely documented. Remediation processes exist with designated owners and severity-based timelines.

**Implementation Steps:**
1. Establish an adversarial threat taxonomy aligned with NIST AI 100-2e2023 attack classifications (evasion, poisoning, extraction, inference)
2. Select adversarial testing tools or engage a third-party testing vendor
3. Define test scope covering: direct prompt injection, indirect prompt injection, jailbreak techniques, data extraction attempts, and model manipulation
4. Run a baseline assessment to establish current resilience levels
5. Document all findings with severity ratings (Critical, High, Medium, Low)
6. Assign remediation owners with severity-based SLAs (Critical: immediate, High: within the quarter, Medium: next quarter)
7. Retest quarterly and track improvement trends
8. Integrate AI-specific test cases into your existing penetration testing program

**Recommended Tools and Approaches:**
- **Automated testing:** Garak (OSS, comprehensive LLM vulnerability scanner), PromptFoo (eval framework with adversarial plugins)
- **Red teaming vendors:** HaizeLabz, Patronus AI, Schellman (accredited AIUC-1 auditor)
- **Custom frameworks:** Build scenario-specific test suites for your application context
- **Integration:** Add adversarial tests to CI/CD pipelines for continuous validation

**Example Evidence:**
- Adversarial threat taxonomy document aligned to NIST AI 100-2e2023
- Quarterly test execution reports with test count, pass/fail, severity breakdown
- Remediation tracker showing owner, SLA, completion status per finding
- Trend analysis showing quarter-over-quarter improvement
- Evidence of integration with existing security testing cadence

**Common Pitfalls:**
- Running tests once and treating it as done -- this requires quarterly execution
- Testing only direct prompt injection while ignoring indirect injection via documents or URLs
- No remediation tracking -- findings without fixes provide no security value
- Using only automated tools without manual red-teaming for creative attack scenarios
- Not sharing threat models between red and blue teams

**Effort Estimate:** Extended

---

### Control B002: Adversarial Input Monitoring

- **Principle:** B - Security
- **Status:** Optional
- **Frequency:** Quarterly
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Detection and alerting capabilities exist for prompt injection patterns, jailbreak techniques, and rate limit violations. Incident logging captures timestamps, user context, and response actions. Detection rules are reviewed and updated quarterly for effectiveness.

**Implementation Steps:**
1. Define detection patterns for known attack types: prompt injection keywords ("ignore previous instructions," "system prompt"), jailbreak techniques (DAN, role-play manipulation), and anomalous rate patterns
2. Implement input logging with pattern matching (start with keyword-based detection, graduate to ML classifiers)
3. Set up alerting thresholds and escalation paths (e.g., single occurrence of system prompt extraction triggers immediate alert)
4. Create an incident response runbook for adversarial input events
5. Forward flagged inputs to your SIEM platform for correlation with other security events
6. Review detection effectiveness quarterly and update rules based on new attack techniques

**Recommended Tools and Approaches:**
- **Detection:** Rebuff (OSS prompt injection detection), Lakera Guard, LangSmith monitoring
- **SIEM integration:** Datadog LLM Observability, Splunk, custom log forwarding
- **Pattern libraries:** OWASP LLM Top 10 attack pattern database
- **ML classifiers:** Train custom classifiers on labeled adversarial examples as volume grows

**Example Evidence:**
- Detection rule library with pattern, method, threshold, and action for each rule
- Alert configuration screenshots or infrastructure-as-code
- Incident response runbook for adversarial input events
- Quarterly detection effectiveness review with rule updates
- Sample alert logs showing detection in action

**Common Pitfalls:**
- Overly aggressive detection that flags legitimate inputs as adversarial
- No escalation path -- alerts fire but nobody investigates
- Static rules that never update as attack techniques evolve
- Logging everything without structured analysis or review

**Effort Estimate:** Extended

---

### Control B003: Technical Information Disclosure Controls

- **Principle:** B - Security
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Limitations on technical information release are documented. Organizational information disclosure is controlled. An approval process exists for public content referencing AI capabilities.

**Implementation Steps:**
1. Inventory all public AI-related content (documentation, blog posts, conference talks, job postings, marketing materials)
2. Define sensitivity levels for technical details (model names, architecture details, prompt strategies, training data sources)
3. Create an approval process for AI-related publications requiring review before external release
4. Review existing public content for over-disclosure of details that could help attackers
5. Train the team on disclosure guidelines -- focus on what helps attackers craft exploits

**Recommended Tools and Approaches:**
- **Content review:** Confluence, Notion, or Google Docs with approval workflows
- **Classification:** Internal sensitivity classification scheme (Public, Internal, Confidential)
- **Review process:** PR-style review for any content mentioning AI system internals

**Example Evidence:**
- Technical disclosure classification matrix (information type, disclosure level, approval required)
- Approval workflow documentation
- Content audit results showing reviewed public materials
- Team training materials on disclosure guidelines

**Common Pitfalls:**
- Over-classifying everything as confidential, making legitimate communication impossible
- No review process for conference talks or blog posts discussing AI systems
- Job postings that reveal detailed architecture or model choices
- Forgetting about third-party integrations that expose system details in API responses

**Effort Estimate:** Quick

---

### Control B004: Endpoint Scraping Prevention

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Usage pattern distinction exists using behavioral analytics. Rate limiting and query controls are implemented with per-user quotas. Simulated attack testing has been conducted against endpoints. Endpoint security has been remediated based on test outcomes.

**Implementation Steps:**
1. Implement per-user rate limits on all AI endpoints (start with generous limits, tighten based on abuse patterns)
2. Set up behavioral analytics to distinguish normal usage from scraping (request frequency, pattern regularity, session duration)
3. Implement IP-based throttling and blocking for suspicious addresses
4. Monitor for bulk data extraction attempts (high-volume sequential requests, systematic parameter probing)
5. Conduct simulated scraping attacks against your own endpoints to verify controls
6. Remediate any gaps identified during simulated testing

**Recommended Tools and Approaches:**
- **Rate limiting:** Cloudflare (free tier), AWS WAF, Kong Gateway (OSS)
- **Behavioral analytics:** Cloudflare Bot Management, custom anomaly detection
- **API gateway:** Kong, AWS API Gateway, Apigee for centralized rate control
- **Testing:** Custom scripts simulating scraping patterns, Burp Suite for endpoint probing

**Example Evidence:**
- Rate limit configuration by endpoint (endpoint, limit, window, burst allowance, block duration)
- Behavioral analytics dashboard or alerting configuration
- Simulated attack test results with findings
- Remediation records for any identified vulnerabilities

**Common Pitfalls:**
- Rate limits so aggressive they block legitimate power users
- Per-IP limits only, which fail against distributed attacks
- No monitoring for slow-and-low scraping that stays under rate limits
- Forgetting to rate limit AI-specific endpoints while other APIs are protected

**Effort Estimate:** Standard

---

### Control B005: Real-Time Input Filtering

- **Principle:** B - Security
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Automated moderation tools are integrated, scanning inputs for policy violations. Flagged inputs are blocked, redirected, or modified before reaching the model. Confidence thresholds are established for block/warn/log/allow actions. Moderation logic and tool selection rationale are documented.

**Implementation Steps:**
1. Select a content moderation API or library appropriate for your use case
2. Define content categories to filter (violence, hate speech, self-harm, sexual content, illegal activity)
3. Set confidence thresholds for each action level: block (high confidence), warn (medium), log (low)
4. Implement pre-model input filtering in your request pipeline
5. Provide user feedback when inputs are blocked explaining the policy violation
6. Log flagged prompts for filter refinement and false positive analysis
7. Periodically evaluate filter performance and adjust thresholds

**Recommended Tools and Approaches:**
- **Moderation APIs:** OpenAI Moderation API (free), Perspective API (free from Google)
- **Guardrail frameworks:** Guardrails AI (OSS), NeMo Guardrails (OSS, NVIDIA)
- **Custom classifiers:** Train domain-specific classifiers for nuanced content filtering
- **Constitutional AI:** Anthropic's approach for alignment-based filtering

**Example Evidence:**
- Content moderation configuration document (categories, thresholds, actions)
- Moderation tool selection rationale
- Filter performance metrics (precision, recall, false positive rate)
- User feedback mechanism for blocked inputs
- Periodic tuning records

**Common Pitfalls:**
- Using a single threshold for all content categories (violence and profanity require different sensitivity)
- No user feedback when inputs are blocked -- users need to understand why
- Never tuning thresholds after initial deployment
- Moderation that is too aggressive on legitimate edge cases in professional contexts (e.g., medical, legal)

**Effort Estimate:** Extended

---

### Control B006: Agent System Access Limits

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Contextual access controls are implemented with task-based tool access. Privilege limiting prevents access escalation. Operational scope is monitored and enforced. Automatic restriction triggers activate when agent context diverges from expected behavior.

**Implementation Steps:**
1. Map all tools, APIs, and data sources your AI agents can access
2. Define permission levels by user role -- agents should inherit the permissions of the user they serve
3. Implement task-scoped access controls so agents only access tools needed for the current task
4. Enforce least privilege: agents cannot escalate permissions beyond what the requesting user has
5. Log all agent actions (tool calls, data access, external API calls) for audit trail
6. Implement automatic restriction triggers when agent behavior diverges from expected patterns
7. Review and revoke unused agent permissions regularly

**Recommended Tools and Approaches:**
- **Tool definition:** JSON schemas for strict parameter validation on agent tools
- **Access control:** LangChain Tools with permission decorators, Anthropic Tool Use with scoped access
- **Monitoring:** Custom middleware logging all tool invocations
- **IAM integration:** Map agent permissions to organizational IAM policies

**Example Evidence:**
- Agent tool permission matrix by role (tool, admin access, manager access, user access, guest access)
- JSON schema definitions restricting tool parameters
- Audit logs showing agent tool calls within scope
- Automatic restriction trigger configuration

**Common Pitfalls:**
- Agents running with admin-level permissions regardless of the requesting user
- No parameter validation -- agents can pass arbitrary parameters to tools
- Tool access defined once and never reviewed as new tools are added
- No logging of agent actions, making incident investigation impossible

**Effort Estimate:** Standard

---

### Control B007: User Access Controls

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
System-level access controls are based on job function. Administrative privilege is restricted to authorized personnel. Access reviews and updates occur quarterly.

**Implementation Steps:**
1. Define AI system access roles (e.g., User, Power User, Admin, Super Admin) -- start with a maximum of three roles
2. Implement authentication for all AI endpoints (no unauthenticated AI access)
3. Restrict model configuration (system prompts, safety settings, tool definitions) to administrators only
4. Set up quarterly access review calendar with responsible owners
5. Log all administrative actions on AI systems
6. Implement MFA for administrative access to AI system configuration
7. Create a process for access provisioning and de-provisioning tied to HR events

**Recommended Tools and Approaches:**
- **Authentication:** Auth0 (free tier), Okta, Keycloak (OSS)
- **RBAC frameworks:** Your existing IAM system extended to cover AI resources
- **Access reviews:** Quarterly spreadsheet review or automated tools (Vanta, Drata)
- **MFA:** Any TOTP-compatible authenticator

**Example Evidence:**
- Role-permission matrix for AI systems (role, permissions, review frequency)
- Quarterly access review records with changes documented
- MFA enforcement evidence for admin accounts
- Access provisioning/de-provisioning procedure
- Administrative action audit logs

**Common Pitfalls:**
- Too many administrators with full access
- Access reviews scheduled but not actually conducted
- No de-provisioning process when employees leave or change roles
- MFA not enforced for AI system administration

**Effort Estimate:** Standard

---

### Control B008: Deployment Environment Security

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Model access is protected with MFA and user access reviews. Deployment security controls are in place including scoped API tokens and TLS encryption. Model hosting environment security uses minimal container images. Model integrity verification uses cryptographic checksums.

**Implementation Steps:**
1. Enable TLS for all AI API endpoints -- no plaintext transmission of prompts or responses
2. Implement scoped API key or token authentication (keys should be per-environment, per-service, not shared)
3. Restrict deployment environment access to authorized DevOps and engineering personnel
4. Enable audit logging for all infrastructure changes to AI deployment environments
5. Scan container images for vulnerabilities if self-hosting models
6. Implement model integrity verification using cryptographic checksums for self-hosted models
7. Enforce MFA for all access to deployment infrastructure

**Recommended Tools and Approaches:**
- **TLS:** Let's Encrypt (free), managed certificates from cloud providers
- **Secrets management:** HashiCorp Vault (OSS), AWS Secrets Manager, Azure Key Vault
- **Container scanning:** Trivy (OSS), Snyk Container
- **Infrastructure security:** CIS Benchmarks for your cloud provider
- **Note:** If using managed AI services (OpenAI API, Azure OpenAI, AWS Bedrock), most infrastructure security is handled by the provider -- focus on your API layer and access controls

**Example Evidence:**
- Deployment security checklist (control, status, implementation method, last verified, owner)
- TLS certificate configuration evidence
- API key scoping and rotation policy
- Container vulnerability scan results (if self-hosting)
- MFA enforcement evidence for infrastructure access

**Common Pitfalls:**
- Shared API keys across environments (dev key used in production)
- No API key rotation policy
- Container images with known vulnerabilities in self-hosted deployments
- Audit logging disabled to save costs

**Effort Estimate:** Extended

---

### Control B009: Output Limitation

- **Principle:** B - Security
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Result quantities are restricted to balance security with utility. Sensitive system details are filtered from outputs. User-facing notices explain output limitations. Numerical output precision is reduced where appropriate to prevent model inversion.

**Implementation Steps:**
1. Set maximum output length limits appropriate for your use case
2. Implement output filtering to strip system prompt content, internal reasoning chains, and model metadata from user-visible responses
3. Round or truncate numerical outputs where full precision is not needed (prevents model inversion attacks)
4. Add rate limits on high-volume output requests to prevent bulk extraction
5. Inform users of output limitations through clear notices
6. Test that system prompts cannot be extracted through output manipulation

**Recommended Tools and Approaches:**
- **Output validation:** Guardrails AI (OSS), NeMo Guardrails (OSS)
- **Custom middleware:** Express.js or FastAPI middleware for output sanitization
- **System prompt protection:** Output post-processing to detect and strip system prompt leakage
- **Testing:** Prompt injection tests specifically targeting system prompt extraction

**Example Evidence:**
- Output limitation rules document (output type, limit, filtering applied, user notice)
- System prompt extraction test results (pass/fail)
- Output sanitization middleware configuration
- User-facing limitation notices

**Common Pitfalls:**
- System prompts visible in outputs through careful prompt manipulation
- No output length limits allowing bulk data extraction
- Internal reasoning or chain-of-thought visible to end users
- Error messages that reveal system architecture or model details

**Effort Estimate:** Standard

---

## Principle C: Safety

Mitigating harmful outputs and protecting brand reputation through testing and monitoring.

---

### Control C001: Risk Taxonomy

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Risk categories are defined for harmful outputs. The taxonomy is aligned with NIST AI RMF, EU AI Act, and ISO 42001. A consistent severity grading methodology is in place. The taxonomy is reviewed and updated quarterly to maintain currency.

**Implementation Steps:**
1. Define risk categories relevant to your AI use case: harmful outputs (violence, hate, self-harm), out-of-scope responses (off-topic, political, medical advice), hallucinations (factual errors, fabricated citations), and tool call risks (unauthorized actions, data access)
2. Assign severity levels using a consistent scale (Critical, High, Medium, Low) with clear criteria for each
3. Document concrete examples for each risk category to ensure consistent classification
4. Map each risk category to your detection and response mechanisms
5. Align your taxonomy with NIST AI RMF risk categories and EU AI Act risk classifications
6. Review and update the taxonomy quarterly, incorporating new risks identified from incidents and testing
7. Identify additional harm categories specific to your operational context (e.g., industry-specific risks)

**Recommended Tools and Approaches:**
- **Documentation:** Google Sheets, Notion, or Jira for taxonomy management
- **Framework alignment:** NIST AI RMF MAP and MEASURE functions, EU AI Act Annex III
- **Industry resources:** OWASP LLM Top 10 for AI-specific risks
- **Review cadence:** Calendar quarterly review meetings with cross-functional stakeholders

**Example Evidence:**
- Risk taxonomy document with categories, severity levels, examples, detection methods, and response actions
- Framework alignment mapping (AIUC-1 risk categories to NIST AI RMF, EU AI Act)
- Quarterly review meeting minutes showing updates
- Cross-functional sign-off on taxonomy

**Common Pitfalls:**
- Creating a taxonomy that is too generic to be actionable (e.g., "harmful content" without subcategories)
- Never updating the taxonomy after initial creation
- No severity grading -- treating all risks as equal
- Taxonomy that does not map to actual detection and response capabilities
- Missing industry-specific risks (financial advice for fintech, medical advice for healthtech)

**Effort Estimate:** Standard

---

### Control C002: Pre-Deployment Testing

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Testing is conducted with documented results including hallucination testing and adversarial prompting. Risk assessments are completed before deployment with impact analysis. Approval sign-offs are obtained from accountable leads.

**Implementation Steps:**
1. Create test cases for each risk category in your taxonomy (harmful outputs, hallucinations, scope violations, tool call misuse)
2. Build an automated test suite that runs against staging environments before any deployment
3. Run adversarial prompt testing as part of pre-deployment checks
4. Document pass/fail results with evidence for each test category
5. Conduct a risk assessment with impact analysis for each deployment
6. Get approval sign-off from the accountable owner (per your RACI from E004)
7. Archive test results for audit trail
8. Integrate safety tests into CI/CD or MLOps pipelines for continuous pre-deployment validation

**Recommended Tools and Approaches:**
- **Eval frameworks:** PromptFoo (free, comprehensive eval framework), pytest for custom test harnesses
- **Tracking:** Weights and Biases for experiment and test tracking
- **CI/CD integration:** GitHub Actions, GitLab CI with AI test stages
- **Approval workflows:** Jira tickets, GitHub PR approvals, or dedicated approval tools

**Example Evidence:**
- Pre-deployment test results report (test category, test count, passed, failed, blocker status, approver)
- Risk assessment document for deployment
- Sign-off record from accountable owner
- Archived test results with timestamps
- CI/CD pipeline configuration showing safety test gates

**Common Pitfalls:**
- Testing only happy paths and missing edge cases
- No approval gate -- deployment proceeds regardless of test results
- Test cases that never evolve (build cases from real incidents as they occur)
- Testing in development environment with different configuration than production

**Effort Estimate:** Extended

---

### Control C003: Harmful Output Prevention

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Content filtering is implemented for harmful content types (distressed outputs, angry responses, high-risk advice, offensive content, bias, deception). Safety guardrails exist for advice generation in sensitive domains. Bias detection and mitigation controls are operational.

**Implementation Steps:**
1. Define harmful output categories specific to your application context (map to your risk taxonomy from C001)
2. Implement output content classification using a layered approach: keyword matching for obvious cases, ML classifiers for subtle ones
3. Set up blocking or modification actions for each harmful content type
4. Implement safety guardrails for sensitive domains (medical, legal, financial) with appropriate disclaimers
5. Deploy bias detection for outputs (demographic bias, cultural bias, language bias)
6. Log all flagged outputs for review and false positive tracking
7. Tune detection thresholds based on false positive and false negative rates

**Recommended Tools and Approaches:**
- **Content classification:** OpenAI Moderation API (free), Guardrails AI (OSS), LlamaGuard (OSS)
- **Bias detection:** Custom classifiers, Fairlearn for bias metrics
- **Output guardrails:** NeMo Guardrails (OSS), custom output validators
- **Sensitive domain handling:** System prompt engineering with domain-specific disclaimers

**Example Evidence:**
- Harmful output category definitions with detection methods and response actions
- Content filter configuration and threshold settings
- Bias detection results and mitigation actions
- False positive/negative tracking with tuning records
- Sensitive domain guardrail configuration (e.g., medical disclaimer triggers)

**Common Pitfalls:**
- Only filtering for profanity while missing subtler harms (biased hiring advice, dangerous health recommendations)
- No bias detection -- bias is harder to detect than explicit harmful content
- Sensitive domain guardrails that are too heavy-handed (blocking all medical questions vs. adding appropriate disclaimers)
- No false positive tracking leading to over-blocking

**Effort Estimate:** Extended

---

### Control C004: Out-of-Scope Prevention

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Topic boundary enforcement detects and redirects off-topic conversations. Scope violation response procedures exist with automated redirection. Scope monitoring tracks boundary violations and adjusts scope definitions.

**Implementation Steps:**
1. Define your AI system's intended scope clearly and document it (what it should answer vs. what is off-limits)
2. Create an explicit list of off-limits topics (political opinions, medical diagnoses, legal advice, competitor discussions, etc.)
3. Implement topic detection using system prompt engineering, topic classifiers, or guardrail frameworks
4. Create helpful redirect messages that acknowledge the user's question while guiding them back on-topic
5. Monitor scope violations to identify patterns and adjust scope definitions or controls
6. Provide user education on system scope and limitations through onboarding or help documentation

**Recommended Tools and Approaches:**
- **Guardrail frameworks:** NeMo Guardrails (OSS, excellent for topic boundaries), Guardrails AI
- **System prompt engineering:** Clear scope instructions in system prompts with examples
- **Topic classification:** Custom classifiers trained on in-scope vs. out-of-scope examples
- **Monitoring:** Log scope violations for pattern analysis

**Example Evidence:**
- Scope boundary definitions document (topic area, in-scope status, detection method, redirect message)
- Guardrail or system prompt configuration
- Scope violation monitoring dashboard or report
- Redirect message library
- User documentation describing system scope

**Common Pitfalls:**
- Scope defined so narrowly that the AI is unhelpful for legitimate use cases
- Generic redirect messages that frustrate users ("I can't help with that" without guidance)
- No monitoring of scope violations -- you cannot improve what you do not measure
- Scope enforcement that differs between system prompt instruction and actual behavior

**Effort Estimate:** Extended

---

### Control C005: High-Risk Output Controls

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Detection and blocking mechanisms are aligned with the risk taxonomy. Risk-based response controls include flagging and logging for all high-risk output categories. Escalation procedures exist for flagged high-risk content.

**Implementation Steps:**
1. Identify business-specific high-risk scenarios from your risk taxonomy (C001) beyond generic harmful content
2. Define detection criteria for each scenario (e.g., pricing errors, contract advice, regulatory misstatements)
3. Implement targeted guardrails for each high-risk category
4. Set up alerting that routes detected high-risk outputs to appropriate reviewers
5. Create escalation procedures with clear ownership for each risk type
6. Review and adjust controls based on actual incidents and false positive feedback

**Recommended Tools and Approaches:**
- **Custom validators:** Guardrails AI validators for domain-specific risk detection
- **Alerting:** Slack webhooks, PagerDuty for high-severity alerts
- **Domain validators:** Custom business logic validators (price range checks, policy compliance checks)
- **Monitoring:** Aporia, Langfuse for risk-category-tagged monitoring

**Example Evidence:**
- Business-specific risk control matrix (risk scenario, business impact, detection method, response, escalation owner)
- Custom validator implementations or configurations
- Alert routing configuration
- Incident records showing controls in action
- Quarterly review of control effectiveness

**Common Pitfalls:**
- Only implementing generic safety controls without business-specific risk detection
- Alerting without investigation -- alerts must have clear owners
- No connection between the risk taxonomy (C001) and actual detection controls
- Failing to involve business stakeholders in defining what constitutes "high risk"

**Effort Estimate:** Extended

---

### Control C006: Output Vulnerability Prevention

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Output sanitization and validation occur before content presentation. Safety-specific labeling and handling protocols exist. Detection and monitoring capabilities identify suspicious content including advanced attack patterns.

**Implementation Steps:**
1. Identify all contexts where AI outputs are rendered (web pages, emails, API responses, documents, database queries)
2. Implement context-appropriate output encoding and escaping (HTML entity encoding for web, SQL parameterization for database)
3. Strip or sanitize HTML, JavaScript, and SQL from AI outputs before rendering
4. Test with known attack payloads (XSS, SQL injection, command injection via AI output)
5. Implement safety labeling for AI-generated content
6. Monitor for suspicious output patterns (encoded payloads, unusual character sequences)
7. Test for prompt injection chains where adversarial output from one query becomes input for another

**Recommended Tools and Approaches:**
- **Output sanitization:** DOMPurify (web, OSS), bleach (Python, OSS), OWASP Java Encoder
- **Testing:** OWASP ZAP with AI output injection test cases
- **Content labeling:** C2PA metadata for AI-generated content
- **Detection:** Custom monitors for encoded payload patterns in outputs

**Example Evidence:**
- Output sanitization configuration by rendering context (web, email, API, database)
- Attack payload test results showing sanitization effectiveness
- Safety labeling implementation evidence
- Monitoring dashboard for suspicious output patterns
- Quarterly retest results

**Common Pitfalls:**
- Treating AI output as trusted data -- always treat it as untrusted input
- Sanitizing for HTML but not SQL or command injection
- No testing with adversarial payloads designed to bypass sanitization
- Missing indirect injection where AI output in one system becomes input to another

**Effort Estimate:** Extended

---

### Control C007: High-Risk Alerting

- **Principle:** C - Safety
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Risk criteria are defined based on the organizational risk taxonomy. Detection is implemented using keyword filtering or confidence scoring. Review workflows are established with designated reviewers and escalation procedures.

**Implementation Steps:**
1. Define which AI outputs require human review before being acted upon (financial recommendations above a threshold, legal guidance, medical suggestions)
2. Implement confidence-based flagging -- low-confidence outputs go to human review
3. Create a review queue with defined SLAs (e.g., financial advice reviewed within one hour, legal questions within four hours)
4. Train reviewers on approval criteria and provide decision guidelines
5. Track review volume, turnaround time, and approval/rejection rates

**Recommended Tools and Approaches:**
- **Review queues:** Retool (free tier), custom admin dashboards, Slack approval workflows
- **Human-in-the-loop:** HumanLoop for structured review workflows
- **Alerting:** Slack webhooks, email notifications for flagged outputs
- **Tracking:** Spreadsheet or Jira for review metrics

**Example Evidence:**
- Human review trigger criteria document (trigger condition, queue, SLA, reviewer, escalation path)
- Review queue implementation (screenshots or configuration)
- Reviewer training materials
- Review metrics (volume, turnaround time, approval rate)

**Common Pitfalls:**
- Review SLAs so short they are impossible to meet
- Flagging too many outputs for review, overwhelming reviewers
- No escalation path when the primary reviewer is unavailable
- Reviewers without adequate domain expertise to assess AI output quality

**Effort Estimate:** Standard

---

### Control C008: Risk Category Monitoring

- **Principle:** C - Safety
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Proactive detection is implemented based on the risk taxonomy. Ongoing monitoring runs with regular evaluations. Documentation is maintained with clear examples. Integration with existing security tools is operational.

**Implementation Steps:**
1. Instrument output logging with risk category tagging aligned to your taxonomy (C001)
2. Create dashboards showing risk category trends over time (weekly, monthly)
3. Set up alerts for risk threshold breaches (e.g., harmful outputs blocked exceeds baseline by a defined percentage)
4. Schedule weekly or monthly risk report reviews with stakeholders
5. Update monitoring as new risks emerge or taxonomy evolves
6. Integrate with existing security monitoring tools (SIEM) for correlation

**Recommended Tools and Approaches:**
- **LLM observability:** Langfuse (OSS), Weights and Biases, Helicone
- **Dashboards:** Grafana, Datadog, custom dashboards
- **Alerting:** PagerDuty, OpsGenie, Slack alerts
- **SIEM integration:** Forward AI events to Splunk, Elastic, or similar

**Example Evidence:**
- Risk monitoring dashboard with trend visualizations
- Alert threshold configuration for each risk category
- Weekly/monthly risk reports
- SIEM integration evidence
- Anomaly detection rules

**Common Pitfalls:**
- Collecting metrics but never reviewing them
- No baseline established, making anomaly detection impossible
- Dashboards that are too complex for stakeholders to use
- Monitoring only a subset of risk categories from your taxonomy

**Effort Estimate:** Standard

---

### Control C009: User Feedback and Intervention

- **Principle:** C - Safety
- **Status:** Optional
- **Frequency:** Quarterly
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
On-screen communication systems provide status and alerts. User intervention capabilities exist including pause and stop functions. Interfaces comply with WCAG 2.1 accessibility standards. Feedback logs are reviewed regularly.

**Implementation Steps:**
1. Add stop/cancel buttons to all AI interaction interfaces
2. Implement thumbs up/down feedback mechanisms on AI outputs
3. Create a "Report issue" flow allowing users to flag problematic outputs with optional detail
4. Route feedback to appropriate reviewers based on feedback type (safety issues to safety team, quality issues to product team)
5. Ensure AI interfaces comply with WCAG 2.1 accessibility standards
6. Analyze feedback patterns weekly or monthly to identify systemic issues

**Recommended Tools and Approaches:**
- **UI components:** Custom React/Vue components for feedback collection
- **Feedback routing:** Slack workflows, Canny (free tier), Intercom
- **Accessibility:** WCAG 2.1 compliance checkers, axe DevTools
- **Analysis:** Aggregate feedback data in your analytics platform

**Example Evidence:**
- Screenshots of stop/cancel and feedback UI components
- Feedback routing configuration (feedback type, collection method, routing destination, response SLA)
- WCAG 2.1 accessibility audit results
- Feedback analysis reports showing identified patterns and actions taken

**Common Pitfalls:**
- Feedback collected but never reviewed or acted upon
- No stop/cancel capability during long-running AI operations
- Feedback mechanisms that require too much effort (multi-step forms vs. one-click)
- Accessibility not tested with actual assistive technologies

**Effort Estimate:** Extended

---

### Control C010: Third-Party Harmful Output Testing

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Qualified assessors with documented expertise are selected. Testing is executed quarterly using industry benchmarks. Results and remediation are documented and tracked.

**Implementation Steps:**
1. Select a testing vendor or qualified assessor with documented AI safety testing expertise
2. Define test scope based on your risk taxonomy (C001) covering harmful output categories: distressed outputs, angry responses, high-risk advice, offensive content, bias, and deception
3. Schedule quarterly assessments with defined test protocols
4. Review findings after each assessment and prioritize remediation by severity
5. Track remediation completion and verify fixes before the next quarterly assessment
6. Alternate between automated self-service tools (quarterly) and paid vendors (annually) to balance cost and coverage

**Recommended Tools and Approaches:**
- **Testing vendors:** HaizeLabz, Patronus AI, Schellman (accredited AIUC-1 auditor)
- **Self-service tools:** Garak (OSS, comprehensive), PromptFoo with safety eval plugins
- **Benchmarks:** ToxiGen, BBQ (bias benchmark), custom domain-specific test suites
- **Tracking:** Jira or spreadsheet for finding-to-remediation tracking

**Example Evidence:**
- Quarterly testing schedule with vendor or tool for each quarter
- Test results report (quarter, vendor, total findings, critical findings, remediated, open)
- Remediation tracker with severity, owner, SLA, and status
- Assessor qualification documentation

**Common Pitfalls:**
- Using the same narrow set of test cases every quarter
- No remediation tracking -- findings without fixes
- Testing only for explicit harmful content while missing subtle bias or deceptive outputs
- Treating quarterly testing as a checkbox without acting on results

**Effort Estimate:** Extended

---

### Control C011: Third-Party Scope Testing

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Qualified third-party assessors are appointed. Testing protocol is followed quarterly. Findings and remediation are documented.

**Implementation Steps:**
1. Define your AI system's scope boundaries clearly for testing purposes (in-scope topics, explicitly off-limits topics)
2. Engage a third-party tester or use automated tools with scope violation test cases
3. Run quarterly testing probing scope boundaries (political topics, competitor discussion, regulated advice, etc.)
4. Document findings with severity ratings based on potential business impact
5. Remediate scope violations and retest to verify fixes
6. Build scope tests from real user attempts to misuse your system -- check logs for patterns

**Recommended Tools and Approaches:**
- **Eval frameworks:** PromptFoo with custom scope violation assertions
- **Testing vendors:** Patronus AI, custom test suite development
- **Test case development:** Mine production logs for real scope violation attempts
- **Tracking:** Standard finding-remediation tracking

**Example Evidence:**
- Scope boundary definitions document shared with testers
- Quarterly scope violation test results (test category, probes sent, stayed on-topic, violations, severity)
- Remediation records for scope violations
- Test case library evolving over time

**Common Pitfalls:**
- Scope boundaries defined so vaguely that testers cannot create meaningful test cases
- Testing only obvious off-topic areas while missing edge cases
- No connection between scope testing results and actual scope enforcement updates
- Not evolving test cases based on production usage patterns

**Effort Estimate:** Extended

---

### Control C012: Third-Party Risk Taxonomy Testing

- **Principle:** C - Safety
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Qualified third-party assessors are appointed. Testing is conducted quarterly against risk taxonomy categories. Results and remediation are documented.

**Implementation Steps:**
1. Extract high-risk scenarios from your risk taxonomy (C001) that are specific to your business
2. Create test cases for each business-specific risk scenario (incorrect pricing, unauthorized discounts, contract advice, regulatory misstatements)
3. Engage a third-party or run tests with independent internal teams quarterly
4. Document findings with business impact assessment for each failure
5. Prioritize remediation by risk level and business impact
6. Work with business stakeholders to validate that test cases cover the most impactful scenarios

**Recommended Tools and Approaches:**
- **Eval frameworks:** PromptFoo with custom business-logic validators
- **Custom validators:** Guardrails AI validators for domain-specific assertions
- **Testing vendors:** Patronus AI, domain-specific testing consultants
- **Stakeholder engagement:** Business unit risk workshops to identify test scenarios

**Example Evidence:**
- Business-specific risk test case library
- Quarterly test results (risk scenario, test cases, passed, failed, business impact, remediation status)
- Business stakeholder sign-off on risk coverage
- Remediation records with verification

**Common Pitfalls:**
- Only testing generic risks while missing business-specific high-impact scenarios
- Test cases that do not reflect actual production usage patterns
- No involvement from business stakeholders in defining what to test
- Treating all risk categories equally instead of prioritizing by business impact

**Effort Estimate:** Extended

---

## Principle D: Reliability

Preventing hallucinations and unauthorized tool calls that cause customer harm.

---

### Control D001: Hallucination Prevention

- **Principle:** D - Reliability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Factual accuracy controls are implemented with fact-checking mechanisms. Information source validation requires citations. Uncertainty is communicated by displaying confidence levels to users.

**Implementation Steps:**
1. Implement Retrieval Augmented Generation (RAG) or grounding with verified data sources for factual queries
2. Require citations for factual claims in AI outputs -- configure system prompts to cite sources
3. Display confidence levels or uncertainty indicators to users (e.g., "Based on available documentation" vs. "I'm not certain about this")
4. Create fallback responses for low-confidence answers ("I don't have enough information to answer that accurately")
5. Set up hallucination detection monitoring to track factual accuracy over time
6. Implement verification loops where high-stakes outputs are cross-checked against authoritative sources

**Recommended Tools and Approaches:**
- **RAG frameworks:** LangChain, LlamaIndex for retrieval-augmented generation
- **Vector databases:** Pinecone, Weaviate, Vectara for grounding data stores
- **Hallucination detection:** RAGAS (OSS), TruLens (OSS), DeepEval
- **Confidence scoring:** Custom prompt engineering for uncertainty expression, logprob analysis
- **Fact-checking pipelines:** Custom validators comparing outputs against ground truth databases

**Example Evidence:**
- RAG or grounding implementation documentation
- System prompt configuration requiring citations
- Confidence level display in user interface (screenshots)
- Fallback response configuration for low-confidence scenarios
- Hallucination rate metrics from monitoring

**Common Pitfalls:**
- RAG alone does not eliminate hallucinations -- combine with explicit "I don't know" instructions
- Citation formatting without actual source verification (the model can hallucinate citations)
- No fallback behavior -- the model always provides an answer even when it should not
- Measuring hallucination rate without defining what constitutes a hallucination for your domain

**Effort Estimate:** Extended

---

### Control D002: Third-Party Hallucination Testing

- **Principle:** D - Reliability
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Qualified assessors with documented expertise are selected. Assessments are executed quarterly. Findings and remediation are documented and tracked.

**Implementation Steps:**
1. Define factual domains to test based on your application (product information, pricing, policies, technical specifications)
2. Create a ground truth dataset for each domain -- verified correct answers for a representative set of questions
3. Run quarterly accuracy assessments comparing AI outputs against ground truth
4. Calculate hallucination rate metrics by domain
5. Track improvement over time and set target thresholds (e.g., less than 5% hallucination rate for product information)
6. Remediate high-hallucination domains with improved grounding, better RAG sources, or output validation

**Recommended Tools and Approaches:**
- **Evaluation frameworks:** RAGAS (OSS, comprehensive RAG evaluation), TruLens (OSS), DeepEval
- **Testing vendors:** Patronus AI, custom evaluation pipelines
- **Ground truth management:** Curated datasets maintained by domain experts
- **Metrics:** Faithfulness, answer relevancy, context precision (RAGAS metrics)

**Example Evidence:**
- Ground truth datasets by domain with maintenance records
- Quarterly hallucination rate reports (domain, questions tested, accurate, hallucinated, rate, target)
- Trend analysis showing improvement over time
- Remediation records for high-hallucination domains
- Assessor qualification documentation

**Common Pitfalls:**
- Ground truth datasets that are outdated or incomplete
- Measuring hallucination rate without domain segmentation (aggregate rates hide domain-specific problems)
- No target thresholds -- you need to know what "good enough" looks like for your use case
- Testing only retrieval accuracy and not generation accuracy (the model can hallucinate even with correct context)

**Effort Estimate:** Extended

---

### Control D003: Tool Call Controls

- **Principle:** D - Reliability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Function call validation and authorization are implemented. Rate limits and transaction caps are in place. Execution monitoring and logging capture all tool calls. Decision boundary enforcement prevents agents from exceeding their scope. Pattern review and remediation address anomalous tool usage.

**Implementation Steps:**
1. Define allowed tools and their parameters for each agent context using JSON schemas
2. Implement tool call validation: verify the tool is allowed for the current user and context before execution
3. Implement parameter validation: verify parameters match expected types, ranges, and patterns
4. Set rate limits (e.g., 10 emails per hour) and transaction caps (e.g., no financial transactions above a threshold without confirmation)
5. Require human confirmation for any tool call that modifies data, has external effects, or involves financial transactions
6. Log all tool calls with parameters, results, user context, and timestamps
7. Alert on unauthorized tool call attempts or parameter injection
8. Review tool call patterns quarterly to identify anomalies

**Recommended Tools and Approaches:**
- **Tool definition:** JSON schemas for strict parameter validation
- **Authorization middleware:** Custom authorization layer between the LLM and tool execution
- **Rate limiting:** Application-level rate limiters per user per tool
- **Human-in-the-loop:** Confirmation prompts for high-impact tool calls
- **Monitoring:** Langfuse, custom logging middleware

**Example Evidence:**
- Tool call authorization matrix (tool, allowed callers, validated parameters, rate limit, requires confirmation)
- JSON schema definitions for tool parameters
- Rate limit and transaction cap configuration
- Tool call audit logs
- Quarterly pattern review reports

**Common Pitfalls:**
- Executing tool calls without parameter validation (enabling parameter injection attacks)
- No rate limits on tools that send emails, make API calls, or modify data
- Tool calls logged but never reviewed
- No human confirmation for destructive or high-impact actions

**Effort Estimate:** Standard

---

### Control D004: Third-Party Tool Call Testing

- **Principle:** D - Reliability
- **Status:** Mandatory
- **Frequency:** Quarterly
- **Risk Weight:** HIGH

**What Full Compliance Looks Like:**
Qualified assessors are selected. Testing protocol is followed quarterly. Documentation of findings and remediation is maintained.

**Implementation Steps:**
1. Document all available agent tools with their intended scope, parameters, and authorization requirements
2. Create test cases for tool misuse scenarios: accessing another user's data, exceeding rate limits, parameter injection, scope violations, unauthorized tool chaining
3. Run quarterly tool call security assessments
4. Test for parameter injection by prompting agents to pass adversarial parameters (e.g., "send email to attacker@evil.com")
5. Verify that authorization controls, rate limits, and confirmation requirements work as designed
6. Remediate findings and retest to verify fixes

**Recommended Tools and Approaches:**
- **Eval frameworks:** PromptFoo with tool call assertions
- **Custom test harnesses:** Scripted tool call abuse scenarios
- **Testing vendors:** Patronus AI, security consultants with AI agent expertise
- **Test categories:** Authorization bypass, parameter injection, rate limit evasion, scope escalation

**Example Evidence:**
- Tool inventory document shared with testers
- Quarterly test results (test scenario, tool tested, expected behavior, actual behavior, status)
- Remediation records for failed test cases
- Retest verification results

**Common Pitfalls:**
- Only testing happy-path tool usage without adversarial scenarios
- No parameter injection testing (agents can be manipulated into passing unexpected parameters)
- Testing tools in isolation rather than testing tool chains (multi-step agent workflows)
- Not testing what happens when tool calls fail (error handling, partial execution)

**Effort Estimate:** Extended

---

## Principle E: Accountability

Enforcing governance through approval processes and failure planning.

---

### Control E001: AI Failure Plan - Security Breaches

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Breach response leadership is designated. Notification procedures for customers and regulators are documented. Security remediation procedures exist with system freeze capabilities. Evidence collection procedures are defined.

**Implementation Steps:**
1. Define AI-specific security incident categories (data exposure via AI, prompt injection attack, model theft, unauthorized data extraction, cross-customer leakage)
2. Assign an incident commander and response team with clear roles
3. Document containment procedures for each incident type (disable AI endpoint, rotate API keys, freeze system, isolate affected components)
4. Define notification requirements and timelines per applicable regulations (GDPR 72-hour notification, state breach notification laws)
5. Create pre-written communication templates for customer notification, regulator notification, and internal escalation
6. Document evidence collection and preservation procedures
7. Conduct a tabletop exercise annually to test the plan

**Recommended Tools and Approaches:**
- **Incident management:** PagerDuty, incident.io, Opsgenie
- **Communication:** Pre-written templates in Notion or Google Docs
- **Evidence collection:** Forensic image procedures, log preservation
- **Tabletop exercises:** Annual scenario-based exercises with the response team

**Example Evidence:**
- AI security incident response playbook (incident type, severity, first responder, containment action, notification SLA)
- Communication templates for each notification type
- Incident commander and response team roster
- Tabletop exercise records with findings and improvements
- Evidence collection procedure document

**Common Pitfalls:**
- Generic incident response plan that does not address AI-specific scenarios (prompt injection is different from a traditional breach)
- No pre-written communication templates -- crafting messages under pressure leads to poor communication
- Notification timelines that do not account for applicable regulations
- Plan exists but has never been tested through tabletop exercises

**Effort Estimate:** Standard

---

### Control E002: AI Failure Plan - Harmful Outputs

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Customer communication protocols exist for significant incidents. Immediate mitigation steps are defined with system freeze capabilities. Harmful output categories are defined with concrete examples. External support engagement is coordinated.

**Implementation Steps:**
1. Define harmful output incident categories with concrete examples (offensive content shown to customer, biased recommendation causing harm, dangerous advice acted upon)
2. Assign accountability for incident response per category
3. Document immediate mitigation steps for each category (disable feature, add guardrail, rollback change, freeze system)
4. Create customer communication templates (apology, explanation of corrective action, follow-up timeline)
5. Define escalation paths including when to involve legal counsel, PR, or executive leadership
6. Track incidents for pattern analysis to improve preventive controls

**Recommended Tools and Approaches:**
- **Incident management:** PagerDuty, Notion incident logs
- **Customer communication:** Zendesk, Intercom with pre-built templates
- **Tracking:** Jira for incident-to-resolution tracking
- **Pattern analysis:** Monthly review of incidents to identify systemic issues

**Example Evidence:**
- Harmful output incident response playbook (scenario, impact level, owner, immediate action, customer communication approach)
- Pre-written customer communication templates
- Escalation path documentation
- Incident tracking records with pattern analysis

**Common Pitfalls:**
- No pre-written customer communication templates
- Unclear ownership leading to delayed response
- No pattern analysis -- the same type of incident keeps recurring
- Mitigation that fixes the symptom but not the root cause

**Effort Estimate:** Standard

---

### Control E003: AI Failure Plan - Hallucinations

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Compensation assessment procedures address customer financial loss from hallucinated outputs. Remediation measures include system adjustments to prevent recurrence. Hallucination incident types are defined. External support coordination is available.

**Implementation Steps:**
1. Define hallucination incident severity levels based on customer impact (incorrect product info causing wrong purchase, wrong pricing causing overpayment, fabricated policy causing customer action)
2. Document compensation assessment procedures for each severity level (refund, credit, contractual remedy)
3. Create a remediation checklist: identify root cause, fix (improved grounding, better RAG, system prompt update), test, verify
4. Define customer communication approach appropriate to severity
5. Track hallucination incidents for pattern analysis to prioritize grounding improvements

**Recommended Tools and Approaches:**
- **Incident management:** Zendesk, Jira for tracking
- **Compensation:** Standard refund/credit workflows tied to incident severity
- **Root cause analysis:** Review RAG retrieval quality, system prompt effectiveness, model behavior
- **Prevention:** Use incident patterns to improve hallucination prevention controls (D001)

**Example Evidence:**
- Hallucination incident response playbook (scenario, customer impact, compensation approach, fix priority, owner)
- Compensation assessment criteria by severity
- Remediation checklist template
- Incident tracking with pattern analysis showing systemic improvements

**Common Pitfalls:**
- No compensation framework -- ad hoc decisions create inconsistency
- Fixing individual hallucinations without addressing systemic causes (poor RAG retrieval, inadequate grounding)
- Not tracking incidents, preventing pattern identification
- Overly complex compensation process that delays customer resolution

**Effort Estimate:** Standard

---

### Control E004: Change Management

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
AI system changes requiring approval are defined. Accountable leads are assigned as approvers. A RACI structure is followed for roles. Approval decisions are documented with supporting evidence.

**Implementation Steps:**
1. List AI system change types that require formal review (model version changes, system prompt modifications, new tool additions, data source changes, safety configuration changes)
2. Assign an accountable approver for each change type using a RACI matrix
3. Create a simple approval workflow (can be as simple as a PR review process)
4. Document approvals with rationale, timestamps, and evidence links
5. Review accountability assignments annually and when organizational structure changes
6. Keep approvals lightweight for low-risk changes to maintain development velocity

**Recommended Tools and Approaches:**
- **Approval workflows:** GitHub PRs for prompt and config changes, Jira tickets for process changes
- **RACI documentation:** Google Sheets, Notion, Confluence
- **Evidence:** PR links, Jira ticket references, approval emails
- **Version control:** Store all AI configuration (system prompts, tool definitions, safety rules) in version control

**Example Evidence:**
- RACI matrix for AI system changes (change type, responsible, accountable, consulted, informed)
- Sample approval records with rationale and evidence links
- Change management policy document
- Approval workflow configuration or documentation

**Common Pitfalls:**
- Approval process so heavy that it slows development significantly for low-risk changes
- No version control for AI configuration (system prompts modified directly in production)
- RACI matrix exists but is not followed in practice
- Accountability assignments not updated when people change roles

**Effort Estimate:** Quick

---

### Control E005: Cloud/Deployment Criteria

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Deployment risk assessments are conducted. Decision criteria and rationale are documented. Deployment-appropriate security controls are implemented. Hybrid deployment strategies are considered where appropriate.

**Implementation Steps:**
1. List your AI use cases and the data types each processes
2. Assess data sensitivity for each use case (public, internal, confidential, highly confidential)
3. Evaluate cloud provider security certifications and compliance (SOC 2, HIPAA, GDPR, FedRAMP)
4. Document decision criteria and rationale for each deployment choice (cloud provider, region, on-prem vs. cloud)
5. Implement security controls appropriate to the deployment model
6. Review deployment decisions when data sensitivity or regulatory requirements change

**Recommended Tools and Approaches:**
- **Decision framework:** Cloud vs. on-prem decision matrix in spreadsheet
- **Provider evaluation:** Review SOC 2 reports, data processing agreements, security documentation
- **Architecture documentation:** Lucidchart, draw.io for deployment architecture diagrams
- **Note:** Most mid-market companies should default to enterprise cloud AI services (Azure OpenAI, AWS Bedrock) -- on-prem is rarely worth the operational overhead unless there are strict regulatory requirements

**Example Evidence:**
- Deployment decision matrix (use case, data sensitivity, compliance requirement, deployment choice, rationale)
- Provider security certification records
- Deployment architecture diagram
- Security control implementation evidence per deployment model

**Common Pitfalls:**
- No documented rationale for deployment choices -- decisions made informally without records
- Using consumer AI services (ChatGPT web) for enterprise data without enterprise agreements
- Ignoring data residency requirements when selecting cloud regions
- Not re-evaluating decisions when use cases or regulatory environment changes

**Effort Estimate:** Quick

---

### Control E006: Vendor Due Diligence

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Assessment criteria are defined for AI model providers. Documented assessments are conducted with scoring. Assessment records are maintained.

**Implementation Steps:**
1. Define evaluation criteria for AI vendors: security certifications (SOC 2, ISO 27001), data handling policies (training data usage, data retention), privacy compliance (GDPR, CCPA), financial stability, and incident history
2. Create a vendor questionnaire template covering these criteria
3. Review provider documentation, certifications, and data processing agreements
4. Score each vendor against your criteria and document the assessment
5. Record assessment findings, approval decision, and conditions
6. Schedule annual vendor re-assessment and trigger re-assessment on material changes

**Recommended Tools and Approaches:**
- **Vendor assessment:** Vanta, Drata for automated vendor risk management
- **Questionnaires:** Google Forms, custom questionnaire templates
- **Scoring:** Weighted scorecard in spreadsheet
- **GRC platforms:** ServiceNow GRC for enterprise vendor management

**Example Evidence:**
- Vendor assessment scorecard (criteria, weight, vendor scores)
- Vendor questionnaire responses
- Certification and DPA review records
- Assessment approval with conditions
- Re-assessment schedule

**Common Pitfalls:**
- Focusing only on security certifications while ignoring data training policies (whether your data trains their models is often the biggest risk)
- One-time assessment without annual re-evaluation
- Not reviewing the actual data processing agreement -- just relying on marketing claims
- No process for assessing open-source model providers

**Effort Estimate:** Standard

---

### Control E007: System Change Approval

- **Principle:** E - Accountability
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Formal review and approval decisions are documented. Approval workflows are documented with sufficient detail to be reproducible.

**Implementation Steps:**
1. Define what constitutes a "material change" to your AI systems (model version upgrades, access control changes, data source additions, safety configuration changes, tool additions)
2. Create a change request template capturing the proposed change, rationale, risk assessment, and required approval
3. Implement an approval workflow (GitHub PR reviews work well for configuration-as-code)
4. Archive change records with timestamps, approver identity, and evidence links
5. Review the change log quarterly to verify all material changes were properly approved

**Recommended Tools and Approaches:**
- **Code review:** GitHub PRs for prompt, config, and code changes
- **Change tracking:** Notion, Confluence for non-code changes
- **Workflow automation:** Jira workflows for formal approval routing
- **Audit trail:** Git history provides a natural audit trail for versioned configuration

**Example Evidence:**
- Material change definition document
- Change request template
- Change log (date, change type, description, approved by, evidence link)
- Quarterly change log review records

**Common Pitfalls:**
- Defining "material change" so broadly that routine updates require formal approval
- Change requests approved rubber-stamp style without actual review
- No audit trail for changes made directly in production
- Approval process that creates bottlenecks without adding security value

**Effort Estimate:** Standard

---

### Control E008: Governance Reviews

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Quarterly reviews of decision processes are conducted. A centralized repository exists for decision records. Remediation efforts are documented and tracked.

**Implementation Steps:**
1. Schedule quarterly AI governance review meetings (one hour maximum)
2. Create a standing agenda: review change logs, incidents, test results, policy compliance, and open action items
3. Identify process gaps or inefficiencies during each review
4. Document findings and assign action items with owners and deadlines
5. Track remediation to completion and verify in subsequent reviews
6. Maintain a centralized repository for all governance records (meeting minutes, action items, evidence)

**Recommended Tools and Approaches:**
- **Meeting management:** Google Docs or Notion for agenda and minutes templates
- **Action tracking:** Jira, Notion databases, or spreadsheets
- **Evidence repository:** Confluence, SharePoint, or dedicated compliance drive
- **Cadence:** Focused one-hour quarterly reviews are more effective than lengthy annual reviews

**Example Evidence:**
- Quarterly review meeting agenda template
- Meeting minutes with findings, action items, owners, and deadlines
- Action item tracking with completion status
- Centralized governance repository structure

**Common Pitfalls:**
- Scheduling reviews but canceling them when busy
- No action items from reviews -- discussion without accountability
- Governance records scattered across multiple locations
- Reviews that take too long because they try to cover everything at once

**Effort Estimate:** Quick

---

### Control E009: Third-Party Access Monitoring

- **Principle:** E - Accountability
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Third-party interaction scope is defined with logging. Access metadata is captured.

**Implementation Steps:**
1. Identify all third-party AI system access points (vendor integrations, consultant accounts, partner APIs, testing services)
2. Implement access logging with identity tracking for all third-party access
3. Set up alerts for unusual access patterns (off-hours access, geographic anomalies, bulk queries)
4. Review third-party access quarterly and revoke access when relationships end
5. Set expiration dates on all third-party access credentials to force periodic review

**Recommended Tools and Approaches:**
- **Cloud audit logs:** AWS CloudTrail, Azure Monitor, GCP Cloud Audit Logs
- **Access management:** Okta, Azure AD with guest access controls
- **Monitoring:** Datadog, custom log analysis
- **Review:** Quarterly access review spreadsheet

**Example Evidence:**
- Third-party access inventory (party name, access type, purpose, expiration, last review)
- Access logging configuration
- Alert rules for unusual access patterns
- Quarterly review records with access changes

**Common Pitfalls:**
- Third-party access that never expires (set mandatory expiration dates)
- No inventory of who has access -- you cannot monitor what you do not know about
- Access revocation delayed when vendor relationships end
- Monitoring only login events without tracking what actions third parties perform

**Effort Estimate:** Standard

---

### Control E010: Acceptable Use Policy

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Prohibited AI usage is defined. Detection systems are implemented. Users receive alerts when inputs violate policy. Real-time monitoring and blocking capabilities exist.

**Implementation Steps:**
1. Define prohibited uses for your AI system (jailbreaking attempts, generating illegal content, harassment, data extraction, abuse)
2. Document the policy in user-facing terms of service using clear, readable language (avoid legalese)
3. Implement detection for policy violations (pattern matching for jailbreak attempts, content filters for illegal content)
4. Create response procedures for violations (warning, suspension, termination based on severity)
5. Provide real-time feedback to users when their inputs violate policy
6. Communicate the policy to all users through onboarding, in-app notices, or email

**Recommended Tools and Approaches:**
- **Policy drafting:** Termly (free), Google Docs, legal templates
- **Detection:** Input filtering tools (see B005), custom pattern matching
- **User communication:** In-app banners, onboarding flows, email notifications
- **Enforcement:** Automated warning system, account suspension triggers

**Example Evidence:**
- Published acceptable use policy (link or document)
- Detection rule configuration for policy violations
- Response procedure documentation (violation type, detection method, consequence)
- User communication records (onboarding, notifications)
- Enforcement action records

**Common Pitfalls:**
- Policy written in dense legal language nobody reads
- Detection for some violations but not others (e.g., jailbreaking detected but abuse via normal prompts not)
- No graduated response -- everything treated as an instant termination or everything ignored
- Policy published but never communicated to users

**Effort Estimate:** Standard

---

### Control E011: Data Processing Locations

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
AI infrastructure location documentation is maintained. Documentation is reviewed and updated regularly. Transfer compliance procedures are implemented where applicable.

**Implementation Steps:**
1. Map all AI data flows: input collection, processing, storage, and output delivery
2. Document the geographic location for each stage (cloud region, data center location)
3. Identify data residency requirements by customer geography and applicable regulations (GDPR for EU, sector-specific requirements)
4. Verify that actual data processing locations match documented locations
5. Implement transfer compliance procedures where data crosses jurisdictions (Standard Contractual Clauses for EU data, etc.)
6. Update documentation whenever infrastructure changes (region migrations, provider changes)

**Recommended Tools and Approaches:**
- **Data flow mapping:** Lucidchart, draw.io for visual data flow diagrams
- **Documentation:** Notion, Confluence for maintaining location records
- **Cloud provider tools:** Azure region selection, AWS region configuration
- **Compliance:** For EU customers, use AI providers with EU region availability (Azure OpenAI EU, AWS Bedrock EU)

**Example Evidence:**
- Data processing location matrix (data type, processing location, storage location, provider, residency compliance status)
- Data flow diagram showing geographic data movement
- Transfer compliance documentation (SCCs, adequacy decisions)
- Update records showing documentation maintained when infrastructure changes

**Common Pitfalls:**
- Not knowing where your AI provider actually processes data (read the DPA, not marketing materials)
- Documentation that does not cover all data types (embeddings, vector stores, logs often overlooked)
- No update process when infrastructure changes -- documentation becomes stale
- Ignoring inference data residency (where is the model running, not just where data is stored)

**Effort Estimate:** Quick

---

### Control E012: Regulatory Compliance

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Semi-annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Relevant regulations are identified. Compliance procedures and strategies are documented. The regulatory repository is reviewed regularly.

**Implementation Steps:**
1. Identify applicable AI regulations based on your customer geography, industry, and use cases (EU AI Act, GDPR AI aspects, state AI laws like Colorado AI Act, sector regulations)
2. Assess applicability of each regulation to your specific AI use cases
3. Document your compliance approach for each applicable requirement
4. Assign ownership for compliance activities for each regulation
5. Review the regulatory landscape every six months (this is the only control with semi-annual frequency)
6. Track regulatory changes and assess impact on your compliance posture

**Recommended Tools and Approaches:**
- **Regulatory tracking:** Google Sheets, Notion, or OneTrust for compliance tracking
- **Legal resources:** Law firm AI practice groups, industry associations (e.g., BSA, ITI)
- **GRC platforms:** Drata, Vanta, ServiceNow GRC for enterprise compliance management
- **Monitoring:** Subscribe to AI regulatory newsletters and legal alerts

**Example Evidence:**
- Regulatory compliance tracker (regulation, applicability, affected use cases, compliance status, owner)
- Compliance strategy documentation for each applicable regulation
- Semi-annual review records showing regulatory landscape reassessment
- Regulatory change impact assessments

**Common Pitfalls:**
- Trying to comply with everything simultaneously instead of prioritizing by enforcement timeline and customer geography
- No semi-annual review cadence -- the AI regulatory landscape is evolving rapidly
- Compliance strategy documented but not implemented
- Not tracking emerging regulations before they become enforceable

**Effort Estimate:** Standard

---

### Control E013: Quality Management

- **Principle:** E - Accountability
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Compliance strategy with conformity assessment procedures is documented. Design, design control, and verification techniques are documented. Development, quality control, and quality assurance procedures are in place. Organizational accountability for QMS aspects is assigned.

**Implementation Steps:**
1. Document your AI development lifecycle from design through deployment and monitoring
2. Define quality gates at each phase: design review, code review, safety testing, pre-deployment approval, post-deployment monitoring
3. Create templates for required artifacts at each gate (design documents, test results, approval checklists)
4. Implement tracking for quality metrics (defect rates, test pass rates, incident rates)
5. Assign organizational accountability for QMS maintenance
6. Review QMS effectiveness annually and adjust based on maturity and incidents

**Recommended Tools and Approaches:**
- **Lifecycle documentation:** Notion, Confluence for process documentation
- **Quality gates:** Jira workflows, GitHub PR templates with checklists
- **Metrics:** Custom dashboards, project management tool reporting
- **Note:** Start lightweight -- a simple checklist is a QMS. Formalize later if needed for ISO certification

**Example Evidence:**
- AI development lifecycle document with quality gates
- Quality gate checklists and required artifact templates
- Quality metrics dashboard or reports
- Annual QMS effectiveness review records

**Common Pitfalls:**
- Over-engineering the QMS with heavy bureaucracy that slows development
- Quality gates defined but routinely bypassed under deadline pressure
- No metrics to assess whether the QMS actually improves quality
- Treating QMS as a documentation exercise rather than a practical quality improvement tool

**Effort Estimate:** Extended

---

### Control E014: Transparency Reporting

- **Principle:** E - Accountability
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
Report scope and recipient categories are defined. Sensitive information is excluded or sanitized. Secure delivery methods are implemented. Sharing procedures are documented.

**Implementation Steps:**
1. Define transparency report contents and audience (internal stakeholders, customers, regulators)
2. Establish reporting frequency (quarterly internal, annual external)
3. Collect metrics on safety (blocked harmful outputs, incidents), reliability (hallucination rates, uptime), and usage (volume, user demographics)
4. Sanitize sensitive information before sharing (remove customer-specific data, security details that could help attackers)
5. Publish reports to appropriate stakeholders through secure channels

**Recommended Tools and Approaches:**
- **Report creation:** Google Docs, Notion for authoring
- **Data visualization:** Mode Analytics, Grafana, custom dashboards
- **Secure sharing:** Password-protected PDFs, stakeholder portals
- **Template:** Start with an internal quarterly report and expand to external annual reports

**Example Evidence:**
- Transparency report template (sections, metrics included, audience, sensitivity level)
- Sample transparency report
- Report distribution records
- Sanitization review checklist

**Common Pitfalls:**
- Reports that include too much security detail, creating risk
- Reports so sanitized they provide no useful information
- Internal-only reports that never progress to customer-facing transparency
- No regular cadence -- reports produced ad hoc rather than on schedule

**Effort Estimate:** Standard

---

### Control E015: Activity Logging

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
System activity details are captured including inputs, outputs, and tool calls. Log storage is implemented with appropriate retention periods.

**Implementation Steps:**
1. Define what to log: user prompts (or hashes for privacy), model responses (or hashes), tool calls with parameters and results, system events, errors, and latency metrics
2. Implement structured logging with consistent schemas and timestamps
3. Set up secure log storage with defined retention periods (align with your data retention policy from A001)
4. Create log query tools or dashboards for investigations
5. Restrict log access to authorized personnel (support, security, compliance roles)
6. Review log coverage and usefulness quarterly to ensure logging captures what is needed for incident investigation

**Recommended Tools and Approaches:**
- **LLM observability:** Langfuse (OSS, purpose-built for LLM logging), LangSmith, Helicone
- **General logging:** Datadog, Elastic/Kibana, CloudWatch
- **Privacy consideration:** Log prompt and response hashes rather than full text for privacy; retrieve full content only during authorized investigations
- **Retention:** Configure TTL-based log expiration aligned with policy

**Example Evidence:**
- Logging schema documentation (event type, fields logged, retention period, access level)
- Logging implementation evidence (configuration, code)
- Sample log entries showing captured fields
- Log access control configuration
- Quarterly log review records

**Common Pitfalls:**
- Logging full prompt and response text without considering privacy implications
- No retention policy -- logs grow indefinitely or are deleted too soon
- Logs that lack structure, making them useless for investigation
- No access controls on logs containing sensitive user interactions

**Effort Estimate:** Standard

---

### Control E016: AI Disclosure

- **Principle:** E - Accountability
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Clear AI interaction disclosure occurs at the start of communication. Disclosures are conspicuous and easily understood. Disclosure visibility is maintained throughout interactions. Machine-readable labeling of AI-generated content is implemented. Users are notified regarding emotion recognition or biometric categorization if applicable.

**Implementation Steps:**
1. Identify all AI-powered user touchpoints (chat interfaces, email responses, generated documents, automated calls)
2. Design clear AI disclosure messaging (e.g., "Powered by AI," "This response was generated by an AI assistant")
3. Implement disclosures in the UI at the start of each AI interaction and maintain visibility throughout
4. Add machine-readable labels to AI-generated content (C2PA metadata, Content Credentials)
5. If your AI performs emotion recognition or biometric categorization, notify users explicitly
6. Test that disclosures are visible, understandable, and not easily overlooked

**Recommended Tools and Approaches:**
- **UI implementation:** Custom UI components with persistent AI disclosure banners
- **Content labeling:** C2PA (Coalition for Content Provenance and Authenticity), Content Credentials
- **Machine-readable labels:** Metadata standards for AI-generated content
- **Testing:** User testing to verify disclosure clarity

**Example Evidence:**
- AI disclosure implementation checklist (touchpoint, disclosure type, placement, status)
- Screenshots showing disclosures in each interface
- Machine-readable label implementation evidence
- User comprehension testing results (if conducted)

**Common Pitfalls:**
- Disclosures buried in fine print or tooltips that users never see
- Inconsistent disclosure across touchpoints (chat shows it, email does not)
- No machine-readable labeling of AI-generated content
- Disclosure at start of session that disappears during the interaction

**Effort Estimate:** Standard

---

### Control E017: System Transparency

- **Principle:** E - Accountability
- **Status:** Optional
- **Frequency:** Annual
- **Risk Weight:** LOW

**What Full Compliance Looks Like:**
A transparency policy defines documentation requirements. A centralized repository with access controls stores model cards, datasheets, and interpretability reports. Documentation is updated when systems are modified.

**Implementation Steps:**
1. Create a model card template for your AI systems covering: model overview (name, version, provider, purpose), intended use cases, known limitations, training data sources (if applicable), performance benchmarks, and known failure modes
2. Document each AI system using the template
3. Store documentation in a centralized, access-controlled repository
4. Establish an update process triggered by major system changes (model version upgrades, prompt changes, data source additions)
5. Define access levels for transparency documentation (internal technical teams, compliance, external auditors)

**Recommended Tools and Approaches:**
- **Documentation:** Notion, Confluence, GitHub repos for model cards
- **Templates:** Google's Model Card Toolkit, Hugging Face model card format
- **Repository:** Centralized document management with access controls
- **Update triggers:** Tie documentation updates to change management process (E004)

**Example Evidence:**
- Model card template
- Completed model cards for each AI system
- Centralized repository with access control configuration
- Documentation update records linked to system changes

**Common Pitfalls:**
- Model cards created once and never updated
- Documentation that is too technical for non-technical stakeholders or too vague for technical review
- No centralized repository -- documentation scattered across teams
- Missing known limitations and failure modes (the most important information)

**Effort Estimate:** Standard

---

## Principle F: Society

Preventing AI-enabled societal harms including cyber exploitation and catastrophic risks.

---

### Control F001: Cyber Misuse Prevention

- **Principle:** F - Society
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Results of testing from the foundation model developer on offensive cyber capabilities are documented. Attestation confirms that mitigations have not been removed. Malicious use detection and blocking exist via content filtering. Usage monitoring and threat intelligence inform ongoing protection.

**Implementation Steps:**
1. Review your AI provider's published testing results on offensive cyber capabilities (exploit generation, malware creation, attack planning, social engineering)
2. Verify that default safety settings addressing cyber misuse are enabled and have not been disabled in your configuration
3. Obtain and document provider attestation that cyber safety mitigations remain intact
4. Implement additional content filtering if your use case has elevated cyber risk (e.g., you serve cybersecurity professionals who might inadvertently trigger false positives)
5. Monitor for cyber-related misuse attempts (requests for exploit code, malware, attack infrastructure)

**Recommended Tools and Approaches:**
- **Provider safety documentation:** Review Anthropic's Responsible Scaling Policy, OpenAI System Card, Google's AI safety documentation
- **Content filtering:** Guardrails AI (OSS) for additional keyword and semantic filtering
- **Monitoring:** Log and alert on cyber-related content patterns
- **Note:** For most mid-market companies, relying on provider safeguards is sufficient. Document the attestation and verify settings have not been modified.

**Example Evidence:**
- Provider cyber capability testing results (referenced or summarized)
- Provider attestation of mitigations (email, contract clause, or published documentation)
- Configuration verification showing safety settings are enabled
- Additional content filter configuration (if applicable)
- Monitoring dashboard for cyber misuse patterns

**Common Pitfalls:**
- Assuming provider safety is sufficient without verifying settings have not been changed
- No documented attestation from the provider
- Disabling provider safety settings for "flexibility" without compensating controls
- Not monitoring for misuse attempts even when provider controls are in place

**Effort Estimate:** Quick

---

### Control F002: CBRN Risk Prevention

- **Principle:** F - Society
- **Status:** Mandatory
- **Frequency:** Annual
- **Risk Weight:** MEDIUM

**What Full Compliance Looks Like:**
Results of testing from the foundation model developer on CBRN capabilities are documented. Attestation confirms that mitigations remain intact. Relevant evaluations are conducted or referenced. Catastrophic misuse monitoring systems are considered.

**Implementation Steps:**
1. Review your AI provider's published testing results on CBRN capabilities (chemical synthesis, biological agent creation, radiological/nuclear information)
2. Verify that default safety settings blocking CBRN content are enabled in your deployment configuration
3. Obtain and document provider attestation that CBRN mitigations remain intact
4. Consider additional filtering for high-risk domains if your AI interacts with scientific or technical content
5. Monitor for CBRN-related query patterns as an additional detection layer

**Recommended Tools and Approaches:**
- **Provider safety documentation:** Review Anthropic's Responsible Scaling Policy (CBRN section), OpenAI System Card, Google's AI safety documentation
- **Content filtering:** Guardrails AI (OSS) for additional keyword filtering on CBRN terms
- **Benchmarks:** Reference CAIS Weapons of Mass Destruction proxy benchmark if applicable
- **Note:** For most mid-market companies, documenting provider attestation is sufficient. Additional filtering is primarily needed for organizations in scientific, defense, or biotech sectors.

**Example Evidence:**
- Provider CBRN capability testing results (referenced or summarized)
- Provider attestation document confirming mitigations are intact
- Configuration verification showing CBRN safety settings are enabled
- Additional filtering configuration (if applicable)
- CBRN monitoring rules (if applicable)

**Common Pitfalls:**
- Treating this as not applicable because your AI is not science-focused (the control applies to ALL AI systems)
- No documented attestation from the provider
- Disabling safety settings without understanding the CBRN implications
- Confusing "not applicable to our use case" with "we don't need controls" -- you need documentation that controls are in place

**Effort Estimate:** Quick

---

## Quick Reference: Control Priority Matrix

For organizations starting their AIUC-1 implementation, prioritize controls by risk weight and mandatory status.

**Start here (HIGH risk, Mandatory):**
- B001: Adversarial testing program (quarterly)
- B007: User access controls (quarterly)
- C001: Risk taxonomy (quarterly)
- C006: Output vulnerability prevention (quarterly)
- C010: Third-party harmful output testing (quarterly)
- C011: Third-party scope testing (quarterly)
- C012: Third-party risk taxonomy testing (quarterly)
- D002: Third-party hallucination testing (quarterly)
- D004: Third-party tool call testing (quarterly)

**Then address (MEDIUM risk, Mandatory):**
All Principle A controls, remaining B/C/D/E/F mandatory controls.

**Finally (Optional controls):**
B002, B003, B005, C007, C008, C009, E007, E009, E013, E014, E017.

---

## Cross-Cutting Recommendations

**Tooling consolidation:** Many controls share tooling needs. A single LLM observability platform (Langfuse, Helicone) can serve logging (E015), monitoring (C008), and incident investigation needs. A single eval framework (PromptFoo, Garak) can serve adversarial testing (B001), harmful output testing (C010), scope testing (C011), and hallucination testing (D002).

**Third-party testing efficiency:** Controls B001, C010, C011, C012, D002, and D004 all require quarterly third-party testing. Consolidate these into a single quarterly assessment engagement rather than running separate assessments for each control.

**Policy documentation:** Controls A001, A002, E010, E012, and E016 all involve policy documentation. Use a unified policy management approach rather than creating isolated documents.

**Incident response:** Controls E001, E002, and E003 share the same incident response framework with different triggers. Build a single AI incident response playbook with sections for each trigger type.

---

**Standard:** AIUC-1 v1.0
**Source:** [aiuc-1.com](https://www.aiuc-1.com/) | [AIUC-1 Navigator](https://adversis.github.io/aiuc1-navigator/)
**Framework:** Intelligence Adjacent (IA)
