---
type: reference
name: mitre-atlas-assessor-playbook
category: compliance
classification: public
version: 1.0
last_updated: 2026-02-25
---

# MITRE ATLAS Assessor Playbook

**Purpose:** Operational guide for assessors conducting MITRE ATLAS-based AI/ML security
evaluations. Covers threat modeling methodology, tactic-by-tactic assessment, red team scope
definition, and findings documentation.

**Audience:** ML security engineers, red teams, AppSec assessors, and security architects
evaluating AI/ML system defenses against adversarial threats.

**Reference:** MITRE ATLAS v5.1.0 — atlas.mitre.org

---

## Key Distinction: ATLAS vs Compliance Assessment

ATLAS assessment is not a compliance exercise. The framing is different at every level:

| Dimension | Compliance Assessment | ATLAS Assessment |
|-----------|----------------------|------------------|
| Core question | Does the org meet documented requirements? | Are the org's ML systems defensible against documented adversarial techniques? |
| Output | Conformance rating, nonconformity list | Threat coverage map, technique exposure inventory |
| Pass/fail | Yes — pass or nonconformity | No — produces a coverage map (Protected / Partial / Exposed) |
| Primary audience | Auditors, regulators, GRC | ML security engineers, red teams, CISOs |
| Evidence basis | Policy documents, records | Architecture diagrams, testing results, live system behavior |
| Remediation target | Close policy gaps | Reduce adversarial technique coverage gaps |

Two primary use modes define how an ATLAS engagement is scoped:

**Threat Modeling Mode** — Map ATLAS tactics and techniques to the ML system architecture to
identify applicable threats and evaluate which controls exist and which are absent. Output is
a threat model: a prioritized inventory of technique exposure across ML system components.

**Red Team Mode** — Use ATLAS techniques as the active test playbook. The red team attempts
to execute applicable techniques against in-scope ML systems under defined rules of engagement.
Output is a red team report: techniques tested, results, and proof-of-concept evidence.

Most engagements combine both: threat modeling defines scope and priority; red team validates
the highest-exposure techniques.

---

## 1. Assessment Overview

### Quick Reference

| Dimension | Value |
|-----------|-------|
| ATLAS version assessed | v5.1.0 |
| Tactics | 15 (AML.TA0000 through AML.TA0015) |
| Techniques | 84 parent techniques, 56 sub-techniques |
| Assessment modes | Threat Modeling, Red Team, Control Validation |
| Output format | Threat coverage map + findings list |
| Pass/fail threshold | None — coverage map replaces pass/fail |

### Assessment Outputs

**Threat Model Output:** A mapping of applicable ATLAS techniques to each ML system component
in scope, with a coverage rating (Protected / Partial / Exposed) per technique and tactic.
Produces a prioritized remediation backlog organized by tactic.

**Red Team Report Output:** For each technique tested — test description, execution result,
evidence (screenshots, logs, API responses), and recommended control. Organized by tactic and
technique ID for direct cross-reference with atlas.mitre.org.

### Scoping: In-Scope ML System Components

Define which components are in scope at engagement start. ATLAS techniques apply differently
depending on which components are accessible to adversaries:

| Component | Applicable Tactic Categories |
|-----------|------------------------------|
| Public inference API | Reconnaissance, ML Model Access, Discovery, Exfiltration, Impact |
| Partner/internal inference API | ML Model Access, Exfiltration, Lateral Movement |
| Training pipeline | Initial Access, Persistence, Execution, Impact |
| Training data stores | Resource Development, Initial Access, Persistence, Collection |
| Model registry / artifact store | Initial Access, Persistence, Collection, Defense Evasion |
| RAG database / vector store | Reconnaissance, Persistence, Defense Evasion, Collection |
| AI agent system | Execution, Persistence, Privilege Escalation, Exfiltration, C2 |
| MLOps / CI/CD pipeline | Initial Access, Execution, Defense Evasion |
| Model serving infrastructure | Reconnaissance, Initial Access, Lateral Movement |

### Prerequisites

Obtain or request these artifacts before assessment begins:

- Architecture diagram (logical, showing ML components and data flows)
- Data flow diagram (inputs, training data paths, inference paths, outputs)
- Model inventory (model IDs, base models, fine-tuning status, deployment environment)
- API documentation (endpoints, authentication mechanisms, rate limits)
- Network diagram (segmentation between ML components and the rest of the environment)

---

## 2. Pre-Assessment Information Gathering

Send this request list to the client at minimum one week before the engagement. Missing
documents at assessment start are themselves an indicator of program maturity.

### ML System Architecture

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| Architecture diagram (ML components) | Threat model foundation | Cannot identify entry points |
| Model serving infrastructure documentation | Assess inference API exposure | Unknown attack surface |
| API gateway configuration | Evaluate authentication and rate limiting | No basis for API access assessment |
| Inference endpoint inventory (public, partner, internal) | Define scope accurately | Unknown model access surfaces |
| Network segmentation diagram | Assess lateral movement risk | Cannot evaluate blast radius |

### Training Pipeline

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| Data ingestion source inventory | Assess supply chain and poisoning risk | Cannot evaluate data integrity |
| Preprocessing pipeline documentation | Evaluate adversarial input filtering | Unknown sanitization posture |
| Training environment access controls | Assess initial access and persistence risk | Unknown training system exposure |
| Model registry and versioning documentation | Evaluate supply chain integrity | Cannot assess model provenance |
| MLOps / CI/CD pipeline configuration | Evaluate execution and defense evasion risk | Unknown automation attack surface |

### Model Access Controls

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| API authentication documentation | Assess valid account and initial access controls | May be unauthenticated |
| Rate limiting configuration | Evaluate model extraction resistance | No extraction defense |
| Model query logging configuration | Assess detection capability | Blind to adversary activity |
| Access control matrix (who can call what) | Evaluate privilege separation | Unknown blast radius per role |

### Supply Chain

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| Third-party model provenance records | Assess AML.T0010 (Supply Chain Compromise) | No basis for supply chain assessment |
| Fine-tuning dataset sources | Evaluate poisoning risk | Unknown data lineage |
| ML library and dependency inventory | Evaluate software supply chain | Potential for AML.T0011 (User Execution) |
| Model integrity verification records (checksums, signing) | Assess artifact integrity | No verification means |
| AI BOM or equivalent | Comprehensive supply chain posture | No supply chain visibility |

### Monitoring and Detection

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| Query anomaly detection configuration | Assess model extraction detection | Blind to AML.T0024 |
| Output monitoring configuration | Evaluate data leakage detection | Blind to AML.T0057 |
| Adversarial input detection implementation | Assess AML.T0043 controls | No adversarial input defense |
| SIEM / alerting rules for ML systems | Evaluate detection coverage | Unknown detection posture |
| AI agent tool invocation logging | Assess AML.T0053 visibility | Blind to agent abuse |

### Incident Records

| Document | Purpose | Red Flag If Missing |
|----------|---------|---------------------|
| Prior ML security incidents | Identify confirmed technique exposure | Historical exposure unknown |
| Adversarial input or jailbreak reports | Validate detection capability | Controls unverified |
| Model drift or performance anomaly events | Assess AML.T0031 sensitivity | No historical baseline |

---

## 3. Threat Modeling Methodology

ATLAS-based threat modeling maps the technique catalog to the target ML architecture to produce
a prioritized threat model before any testing begins. Execute in four steps.

### Step 1: Identify ML Entry Points

For each in-scope ML system, enumerate every surface where an external or internal adversary
can interact with the system. Entry points fall into five categories:

**External inference APIs** — Any endpoint that accepts inference requests from outside the
organization's trust boundary. Includes public APIs, partner APIs, and customer-facing products
backed by an ML model. Every external inference API is a Reconnaissance, Model Access, and
Exfiltration surface.

**Training data ingestion points** — Pipelines that ingest data from external sources
(web crawls, partner feeds, user uploads, open datasets) into training or fine-tuning
workflows. These are Supply Chain and Persistence surfaces.

**Model fine-tuning interfaces** — Any interface that allows external data or parameters to
influence a deployed model. Includes fine-tuning APIs, RLHF feedback channels, and embedding
update pipelines.

**ML pipeline interfaces** — MLOps tooling surfaces: CI/CD pipelines, model registry APIs,
artifact storage, notebook environments. These are Execution, Persistence, and Defense Evasion
surfaces accessible to insiders and compromised accounts.

**Model artifact storage and distribution** — Model files at rest in registries, S3 buckets,
container images. These are Collection and Supply Chain surfaces.

**AI agent interfaces** — Any interface through which a user or external system can provide
input to an AI agent with tool access. These are the highest-risk surfaces for Execution,
Persistence, Privilege Escalation, Exfiltration, and Command and Control.

**RAG data ingestion interfaces** — Any interface that allows content to be indexed into a
RAG vector database. These are Persistence and Defense Evasion surfaces.

### Step 2: Map Applicable Tactics to Each Entry Point

| Entry Point | Applicable Tactics (AML.TA IDs) | Highest-Priority Techniques |
|-------------|----------------------------------|----------------------------|
| Public inference API | TA0000, TA0002, TA0008, TA0010, TA0011 | AML.T0040, AML.T0024, AML.T0057, AML.T0029 |
| Partner/internal inference API | TA0000, TA0010, TA0013, TA0015 | AML.T0044, AML.T0024, AML.T0082, AML.T0091 |
| Training data ingestion | TA0003, TA0004, TA0006, TA0011 | AML.T0019, AML.T0020, AML.T0010, AML.T0059 |
| Model fine-tuning interface | TA0003, TA0004, TA0006 | AML.T0018, AML.T0020, AML.T0010 |
| MLOps / CI/CD pipeline | TA0004, TA0005, TA0007 | AML.T0010, AML.T0011, AML.T0050, AML.T0074 |
| Model artifact storage | TA0009, TA0010, TA0004 | AML.T0035, AML.T0025, AML.T0010 |
| AI agent interfaces | TA0005, TA0006, TA0010, TA0012, TA0014 | AML.T0051, AML.T0053, AML.T0080, AML.T0086 |
| RAG data ingestion | TA0006, TA0007, TA0002 | AML.T0070, AML.T0071, AML.T0066, AML.T0064 |

### Step 3: Assess Existing Controls Per Technique

For each applicable technique identified in Step 2, document:

1. **Control exists?** — Yes / Partial / No
2. **Control description** — What is the specific control mechanism?
3. **Evidence** — What document or observation confirms the control?
4. **Effectiveness** — Does the control actually prevent or detect the technique, or is it
   a nominal control that an adversary could bypass?

Evidence quality tiers (use the highest tier available):

- **Tier 1 (strongest):** Live demonstration — control tested against a simulated technique
  during the assessment
- **Tier 2:** Test results — prior red team report or adversarial testing showing the control
  worked against a specific technique
- **Tier 3:** Configuration review — control is configured correctly; effectiveness is inferred
- **Tier 4 (weakest):** Policy documentation only — policy says the control should exist, but
  configuration and testing have not been reviewed

### Step 4: Calculate Coverage Map

After completing Step 3 across all applicable techniques, assign a tactic-level coverage rating:

| Rating | Criteria |
|--------|----------|
| Protected | Controls exist for most applicable techniques in the tactic with Tier 1 or Tier 2 evidence; no critical exposure gaps |
| Partial | Controls exist for some applicable techniques but significant gaps remain, or controls rely on Tier 3/4 evidence only |
| Exposed | No effective controls exist for the majority of applicable techniques in this tactic, or a single high-impact technique is completely unmitigated |

---

## 4. Tactic Assessment Guide

This section is the operational core of the playbook. For each tactic, work through the
technique list, pull the relevant questions from the assessment question bank, collect evidence,
and assign coverage ratings. Use AML.T IDs throughout — assessees and reviewers cross-reference
with atlas.mitre.org.

---

### Tactic: AI Model Access (AML.TA0000)

**Adversary objective:** Gain access to the target model — via its inference API, through an
AI-enabled product, through physical sensor access, or by obtaining a full white-box copy. Model
access is a prerequisite for most downstream ATLAS techniques; it is the starting point for
extraction, staging, and discovery attacks.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0040 | AI Model Inference API Access | Adversary uses legitimate inference API access to stage or execute attacks |
| AML.T0047 | AI-Enabled Product or Service | Adversary uses a product backed by the target model as indirect model access |
| AML.T0041 | Physical Environment Access | Adversary influences the model by manipulating physical data collection sources |
| AML.T0044 | Full AI Model Access | Adversary gains white-box access (weights, architecture, parameters) to craft offline attacks |

**Assessment Questions (from Q-ATLAS-TA0000-001):**
- "Describe every way an external party or internal user can interact with or query your ML
  models. Has this been formally inventoried?"
- "How is inference API access authenticated? What happens if credentials are compromised?"
- "Are model weights, architecture files, or training artifacts stored anywhere that a
  compromised account could reach?"
- "Do you have physical security controls for any systems where AI models interact with
  sensor data from the physical environment?"
- "Is access to the model restricted differently by role — e.g., does an analyst get
  the same model access surface as an administrator?"

**Evidence to Collect:**
- Inventory of all AI model access surfaces (APIs, products, physical sensors, model files)
- API authentication documentation (type of auth, credential rotation policy)
- Access control matrix per role for each access surface
- Physical security controls documentation for AI sensor infrastructure
- Model file encryption configuration and storage access controls

**Detection Indicators:**
- Absence of authentication on inference endpoints (check with unauthenticated API probe)
- Model files in unencrypted storage with broad access permissions
- No rate limiting configured on inference API (query for rate limit headers)
- Indirect product access exposing model behavior details in API metadata or logs

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | All access surfaces inventoried; authentication enforced on all inference APIs; model files encrypted and access-controlled; each surface monitored |
| Partial | Some access surfaces controlled; inventory incomplete; monitoring inconsistent across surfaces |
| Exposed | Inference API lacks authentication; model weights accessible to any authenticated user; no monitoring of access surface usage |

---

### Tactic: Reconnaissance (AML.TA0002)

**Adversary objective:** Gather information about the target ML system before launching an
attack. Reconnaissance informs technique selection and increases attack success probability.
ATLAS reconnaissance is passive (searching public sources) and active (probing APIs and services).

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0000 | Search Open Technical Databases | Mine academic papers, preprints, blogs for target system details |
| AML.T0001 | Search Open AI Vulnerability Analysis | Identify published attack research for the model family in use |
| AML.T0003 | Search Victim-Owned Websites | Extract AI system technical details from public web presence |
| AML.T0004 | Search Application Repositories | Identify AI components in public app stores |
| AML.T0006 | Active Scanning | Probe APIs and services for AI-specific endpoints and behaviors |
| AML.T0064 | Gather RAG-Indexed Targets | Identify data sources used in RAG systems to target for poisoning |
| AML.T0087 | Gather Victim Identity Information | Collect employee and credential data for deepfake or phishing use |
| AML.T0095 | Search Open Websites/Domains | Gather AI system details from social media, news, victim domains |

**Assessment Questions (from Q-ATLAS-TA0002-001 through TA0002-004):**
- "Does your organization have a policy limiting what technical details about your ML systems
  can be published publicly — including papers, blog posts, and job descriptions?"
- "Have you conducted an OSINT review of your own public presence to identify what an adversary
  could learn about your AI systems before launching an attack?"
- "Are your AI API endpoints monitored for active scanning patterns — unusual enumeration of
  endpoints, parameter fuzzing, or model fingerprinting queries?"
- "Are your RAG data source configurations public or discoverable? Could an adversary identify
  which external data sources you index?"
- "Do you have controls on employee social media posts or technical blog posts that reference
  production AI system details?"

**Evidence to Collect:**
- AI system information disclosure policy (covering publications, blogs, job postings)
- Results of any OSINT self-assessment
- API gateway or WAF logs showing scan detection rules
- RAG data source configuration access controls
- Employee disclosure policy

**Detection Indicators:**
- Active scanning of API endpoints detectable in WAF/gateway logs
- Enumeration of model output space through structured queries (all-class probing)
- Requests probing for model family via fingerprinting prompts
- Unusual traffic patterns on documentation or API discovery endpoints

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Information disclosure policy covers AI specifics; OSINT assessments conducted regularly; API scanning detected and alerted; RAG data sources not publicly disclosed |
| Partial | General security policy exists; no AI-specific disclosure review; API scanning monitored at network layer but no AI-specific enumeration detection |
| Exposed | Model architecture and training data details published without review; no API scanning detection; RAG data sources publicly identifiable |

---

### Tactic: AI Attack Staging (AML.TA0001)

**Adversary objective:** Prepare attack tools, proxy models, and adversarial data offline before
executing against the production target. Staging allows the adversary to refine attacks without
triggering production monitoring. This tactic is used in nearly every ATLAS case study.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0005 | Create Proxy AI Model | Train or replicate a surrogate model for offline attack development |
| AML.T0042 | Verify Attack | Test attack transfers from proxy to production model via API |
| AML.T0043 | Craft Adversarial Data | Create perturbed inputs that cause misclassification or bypass |
| AML.T0018 | Manipulate AI Model | Modify model weights, architecture, or embed malware |
| AML.T0088 | Generate Deepfakes | Create synthetic media for impersonation or biometric bypass |

**Assessment Questions (from Q-ATLAS-TA0001-001 through TA0001-005):**
- "If an adversary queried your inference API with a large number of diverse inputs to build a
  replica model, would you detect it? What would the detection look like?"
- "Do you validate models for backdoor triggers or adversarial manipulation before deploying
  them to production? Show me the validation process."
- "Are adversarial inputs detected at the inference endpoint before they reach the model?
  What technique is used — input filtering, anomaly detection, or model-level defense?"
- "Do you look for attack verification patterns in your API telemetry — sequences of
  queries that look like an adversary confirming their attack transfers?"
- "If your system uses biometric AI authentication, what deepfake countermeasures are
  in place?"

**Evidence to Collect:**
- API rate limiting and anomaly detection configuration
- Model validation / pre-deployment testing procedures (specifically for backdoor testing)
- Adversarial input detection implementation (input filtering pipeline, anomaly detection rules)
- Inference API telemetry logging configuration
- Liveness detection documentation (if biometric authentication is in scope)

**Detection Indicators:**
- High-volume, diverse queries to inference API from a single source within a time window
- Queries designed to elicit full confidence score distributions (model probing)
- Sequences of near-identical inputs with small perturbations (adversarial example iteration)
- Model performance degradation in pre-deployment testing with no training data explanation

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Inference APIs authenticated and rate-limited; anomalous query patterns trigger alerts; model validation tests for backdoors before deployment; adversarial input detection inline |
| Partial | Rate limiting in place but query patterns not monitored; model testing covers accuracy but not adversarial manipulation |
| Exposed | Inference APIs unmonitored; no pre-deployment backdoor testing; no adversarial input detection |

---

### Tactic: Initial Access (AML.TA0004)

**Adversary objective:** Gain an initial foothold in the ML system or its supporting
infrastructure. ATLAS initial access techniques extend traditional initial access to ML-specific
vectors: supply chain compromise of AI artifacts, prompt injection via user input, and evasion
of AI-based authentication.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0010 | AI Supply Chain Compromise | Compromise hardware, data, software, or model components |
| AML.T0012 | Valid Accounts | Abuse legitimate credentials to access ML APIs and services |
| AML.T0015 | Evade AI Model | Craft adversarial inputs to bypass AI-based authentication |
| AML.T0049 | Exploit Public-Facing Application | Exploit vulnerabilities in AI-powered web applications |
| AML.T0051 | LLM Prompt Injection | Craft prompts that cause LLMs to act outside their intended behavior |
| AML.T0052 | Phishing | Use AI-generated synthetic content to conduct targeted phishing at scale |
| AML.T0078 | Drive-by Compromise | Deliver prompt injection via web content retrieved by AI agents |
| AML.T0093 | Prompt Infiltration via Public-Facing Application | Inject prompts into public apps that feed AI pipelines |

**Assessment Questions (from Q-ATLAS-TA0004-001 through TA0004-005):**
- "Describe your AI supply chain controls. Do you verify the integrity of third-party models,
  datasets, and AI libraries before incorporating them into production?"
- "Have you conducted prompt injection testing on all input surfaces of your LLM-based
  systems? When was the last test, and what were the results?"
- "If an adversary submitted text to a public-facing form that your system ingests as context
  for an AI model, would that input be sanitized before reaching the model?"
- "Show me the authentication and credential controls for your AI inference APIs. How are
  API keys managed and rotated?"
- "Do your AI agents retrieve content from external websites? Is that web content sanitized
  before it is used as context?"

**Evidence to Collect:**
- AI BOM or equivalent artifact provenance tracking
- Cryptographic verification records for AI model files and datasets
- Prompt injection test results (scope, methodology, findings)
- Content sanitization controls for data ingested by AI or RAG systems
- API authentication documentation and credential rotation policy
- Browser isolation or content filtering configuration for AI agents that browse the web

**Detection Indicators:**
- Model or dataset hash mismatches against known-good checksums
- Unexpected characters or instruction-style text in inference API inputs
- AI authentication bypass attempts in logs (repeated failed biometric probes, unusual
  similarity scores)
- Anomalous ingestion pipeline activity (unexpected data sources, unusual content formats)

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | All AI artifacts tracked via AI BOM with integrity verification; all input surfaces tested for prompt injection; content sanitized before AI ingestion; API access authenticated and audited |
| Partial | Some verification exists (e.g., checksums) but no comprehensive AI BOM; prompt injection tested on primary interfaces only; content sanitization incomplete |
| Exposed | No supply chain controls for AI artifacts; prompt injection not tested; public-facing inputs feed directly into AI without sanitization |

---

### Tactic: Execution (AML.TA0005)

**Adversary objective:** Execute malicious code or adversarial instructions within the ML system.
Execution in ATLAS context encompasses adversarial commands delivered via prompt injection,
unsafe AI artifact loading, and AI agent tool invocation abuse.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0011 | User Execution | Adversary-supplied unsafe AI artifacts (e.g., malicious pickle files) executed by the victim |
| AML.T0050 | Command and Scripting Interpreter | Abuse of command interpreters via AI agent code execution |
| AML.T0051 | LLM Prompt Injection | Direct, indirect, and triggered prompt injection for instruction execution |
| AML.T0053 | AI Agent Tool Invocation | Prompt injection causes agent to invoke tools with elevated privileges |

**Assessment Questions (from Q-ATLAS-TA0005-001 through TA0005-003):**
- "What serialization formats are permitted for AI model files in your environment? Are pickle
  files permitted without validation? Are model files code-signed?"
- "If an adversary crafted a prompt that instructed your AI agent to run a shell command,
  what would happen? Are there technical controls preventing agent code execution?"
- "What tools can your AI agents invoke? Are tool invocations logged, and do high-consequence
  actions require human approval before execution?"
- "Is there sandboxing on the environment where AI agents operate? What is the blast radius
  of an agent compromise?"

**Evidence to Collect:**
- Permitted AI artifact format documentation and allowlisting configuration
- Code signing policy for AI model files
- AI agent sandboxing or containerization configuration
- AI agent tool permission matrix (which tools, which users, which approval gates)
- Logging of agent tool invocations
- Human-in-the-loop approval workflow documentation

**Detection Indicators:**
- AI artifact loading events with unverified checksums or signatures
- AI agent command execution events outside normal tool invocation patterns
- LLM outputs containing instruction-style text directed at tools or external systems
- Agent tool invocations at unusual times or with unusual parameters

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | AI artifact formats restricted to safe alternatives; code signing enforced; agents sandboxed; tool invocations least-privilege with human approval for high-consequence actions; all invocations logged |
| Partial | Some artifact format restrictions or sandboxing exists; tool invocations logged but not least-privilege; no human approval for high-consequence actions |
| Exposed | Pickle and unsafe formats permitted without validation; AI agents have unrestricted command execution; tool invocations unlogged |

---

### Tactic: Persistence (AML.TA0006)

**Adversary objective:** Maintain access or adversarial influence in the ML system beyond the
initial compromise. ML-specific persistence techniques are particularly damaging because they
can survive model redeployment and affect multiple users simultaneously.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0020 | Poison Training Data | Introduce vulnerable patterns into training data that persist into deployed models |
| AML.T0061 | LLM Prompt Self-Replication | Craft prompts that cause LLMs to replicate the injection in their outputs |
| AML.T0070 | RAG Poisoning | Inject malicious content into RAG-indexed data to persistently influence LLM responses |
| AML.T0080 | AI Agent Context Poisoning | Manipulate agent memory or thread context to change persistent agent behavior |
| AML.T0081 | Modify AI Agent Configuration | Alter agent configuration files (system prompt, tools, knowledge sources) |
| AML.T0093 | Prompt Infiltration via Public-Facing Application | Inject prompts through public apps that persist in the system until triggered |

**Assessment Questions (from Q-ATLAS-TA0006-001 through TA0006-004):**
- "How is training data sanitized before use? Is there provenance tracking that would let you
  identify which training examples came from which source?"
- "Who has write access to your RAG database? Is content validated before it is indexed?
  Would you detect if an unauthorized entry was injected into your RAG index?"
- "How is AI agent memory implemented? Can a user manipulate the agent's long-term memory?
  Are memory contents validated before they are acted upon?"
- "Are AI agent configuration files — system prompts, tool definitions, knowledge source
  references — under change management? What access controls protect them?"

**Evidence to Collect:**
- Training data sanitization procedures and access controls
- Dataset provenance and integrity verification records
- RAG database write access controls and content validation procedures
- RAG index change monitoring configuration
- AI agent memory hardening controls and authentication for memory updates
- AI agent configuration file access controls and change management records

**Detection Indicators:**
- Unexpected entries in RAG index not originating from authorized ingestion pipelines
- AI agent configuration file changes outside change management records
- LLM outputs that include instruction-style text propagating to downstream systems
- Agent memory entries containing prompt-like instructions rather than factual content
- Training data distribution shifts consistent with targeted poisoning

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Training data sanitized and provenance-tracked; RAG write access restricted with content validation; agent memory authenticated and semantically validated; agent configuration under change management |
| Partial | Access controls on training data and RAG but no content validation; agent memory not hardened; configuration files protected but not monitored for unauthorized changes |
| Exposed | Training data not sanitized; RAG database writable by any authenticated user; agent memory and configuration unprotected |

---

### Tactic: Defense Evasion (AML.TA0007)

**Adversary objective:** Avoid detection by ML security controls and continue operating within
the ML system. ATLAS defense evasion techniques include jailbreaking LLM guardrails, obfuscating
prompt injections, injecting false RAG entries that bypass content scanning, and corrupting
model files to evade model scanners.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0054 | LLM Jailbreak | Craft prompts that place an LLM in an unrestricted state, bypassing all guardrails |
| AML.T0015 | Evade AI Model | Craft adversarial inputs that evade security-critical AI models (e.g., malware detection) |
| AML.T0067 | LLM Trusted Output Components Manipulation | Manipulate citations or sources to appear trustworthy |
| AML.T0068 | LLM Prompt Obfuscation | Hide prompt injections using invisible text, color-matching, or HTML elements |
| AML.T0071 | False RAG Entry Injection | Embed prompt injections inside RAG documents to bypass content scanning |
| AML.T0073 | Impersonation | Impersonate trusted entities on model registries and software repositories |
| AML.T0074 | Masquerading | Make malicious AI artifacts appear legitimate through metadata manipulation |
| AML.T0076 | Corrupt AI Model | Corrupt model files to evade model scanners while still executing malicious code |
| AML.T0092 | Manipulate User LLM Chat History | Alter conversation history to conceal adversary activity |
| AML.T0094 | Delay Execution of LLM Instructions | Include time-triggered instructions to evade real-time detection |

**Assessment Questions (from Q-ATLAS-TA0007-001 through TA0007-004):**
- "Do your LLM guardrails specifically detect and refuse jailbreak attempt patterns? How were
  they tested? When was the last adversarial test against guardrail bypass?"
- "If an adversary submitted a document to your RAG system with invisible text containing
  prompt injection instructions, would your content validation detect it? Can you demonstrate?"
- "Are your AI conversation logs immutable? Could an adversary with access to the UI
  modify their conversation history to conceal evidence?"
- "For AI models used in security roles — malware detection, fraud detection, spam filtering —
  what adversarial robustness testing has been conducted?"
- "Do you scan model files from external sources before loading them? Does your scanning
  handle corrupted file evasion techniques?"

**Evidence to Collect:**
- LLM guardrails configuration and jailbreak test results
- Input content security controls (detection of hidden text, Unicode tricks, HTML injection)
- Immutable logging configuration for LLM conversations
- Model integrity scanner configuration and evasion test coverage
- Registry and repository access controls (impersonation prevention)
- Citation and source verification controls for LLM outputs
- Records of any delayed instruction detection capability

**Detection Indicators:**
- LLM outputs instructing users to follow unexpected advice attributed to fabricated sources
- Hidden text or unusual Unicode in inference API inputs
- RAG documents with atypically short text or prompt-like formatting in non-instructional sections
- Model file hash mismatches after registry download
- LLM responses exhibiting jailbreak-consistent behavior despite guardrails
- Chat history modifications not captured in server-side logs

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Guardrails detect jailbreak patterns with Tier 1/2 test evidence; content security controls detect hidden injection; conversation logs are immutable; model scanners tested against evasion; registry access controls prevent impersonation |
| Partial | Guardrails in place but not tested against jailbreak; content scanning misses obfuscated injections; logs exist but not immutable |
| Exposed | No jailbreak detection; no content security controls for hidden injection; mutable conversation logs; no model file integrity scanning |

---

### Tactic: Discovery (AML.TA0008)

**Adversary objective:** After gaining access, enumerate the ML system to understand its model
family, output space, configuration, and deployed infrastructure. Discovery informs subsequent
exploitation.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0013 | Discover AI Model Ontology | Enumerate model output classes via systematic queries |
| AML.T0014 | Discover AI Model Family | Identify the model family via fingerprinting queries |
| AML.T0007 | Discover AI Artifacts | Enumerate internal AI artifacts (model files, datasets, registries) |
| AML.T0062 | Discover LLM Hallucinations | Find hallucinated entities to register adversary-controlled resources |
| AML.T0063 | Discover AI Model Outputs | Access internal class scores or logits not intended for end users |
| AML.T0069 | Discover LLM System Information | Extract system prompt or instructions via direct or indirect means |
| AML.T0075 | Cloud Service Discovery | Enumerate cloud AI services running in the target environment |
| AML.T0084 | Discover AI Agent Configuration | Extract agent tool definitions, knowledge sources, and activation triggers |
| AML.T0089 | Process Discovery | Identify AI software processes running on compromised systems |

**Assessment Questions (from Q-ATLAS-TA0008-001 and TA0008-002):**
- "What information does your inference API return beyond the model prediction — confidence
  scores, class probabilities, logits, model version metadata? Is this minimized?"
- "Have you tested whether your LLM reveals its system prompt when asked directly? Via
  indirect prompting? Via special characters or encoding tricks?"
- "Does your AI agent disclose its available tools to users? Can a user query the agent
  for its configuration?"
- "Is your AI asset inventory (model names, versions, infrastructure) accessible to
  authenticated but unprivileged users?"

**Evidence to Collect:**
- API response structure documentation (what is returned beyond the prediction)
- Output confidence score obfuscation configuration
- System prompt confidentiality test results
- AI agent tool definition access controls
- Cloud IAM configuration for AI services (least-privilege)
- AI asset inventory access controls

**Detection Indicators:**
- Systematic queries probing all possible output classes (ontology enumeration)
- Queries designed to extract system prompt text via unusual framing or encoding
- Requests for agent tool definitions or capability lists
- Cloud service enumeration calls from authenticated sessions

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Confidence scores obfuscated; API responses stripped of model metadata; system prompts not disclosed; agent configs access-controlled; cloud services use least-privilege IAM |
| Partial | Some output restriction exists; system prompt partially protected but extractable via indirect methods; cloud IAM not fully hardened |
| Exposed | Full confidence scores and model metadata returned; system prompts extractable; agent tool definitions disclosed to all users |

---

### Tactic: Exfiltration (AML.TA0010)

**Adversary objective:** Extract valuable ML assets — model weights, training data, system
prompts, or proprietary user data — from the target system. ML exfiltration is often possible
via the inference API itself without requiring system compromise.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0024 | Exfiltration via AI Inference API | Extract training data or model parameters via repeated queries (membership inference, model inversion, model extraction) |
| AML.T0025 | Exfiltration via Cyber Means | Traditional data exfiltration of AI artifacts (model files, datasets) |
| AML.T0056 | Extract LLM System Prompt | Elicit system prompt from LLM via injection or configuration file access |
| AML.T0057 | LLM Data Leakage | Craft prompts inducing LLM to leak training data, user data, or connected data source content |
| AML.T0077 | LLM Response Rendering | Exfiltrate data covertly via rendered images making requests to adversary-controlled servers |
| AML.T0086 | Exfiltration via AI Agent Tool Invocation | Use prompt injection to invoke agent write tools (email, file creation) to exfiltrate data |

**Assessment Questions (from Q-ATLAS-TA0010-001 through TA0010-004):**
- "What is the query budget or rate limit for your inference API? If an adversary issued
  millions of queries over days or weeks, would that trigger an alert?"
- "Have you tested whether your LLM leaks content from its training data, connected data
  sources, or other users' sessions in response to crafted prompts?"
- "Does your output filtering detect and redact PII, credentials, and sensitive data in
  LLM responses before they are returned to the user?"
- "If a user prompted your AI agent to send an email with the contents of an internal document,
  what controls would prevent that exfiltration?"
- "Does your Content Security Policy prevent LLM responses from rendering external images
  or making outbound requests that could exfiltrate data?"

**Evidence to Collect:**
- Query rate limiting configuration and alert thresholds for unusual query volumes
- Output guardrails configuration (PII detection, sensitive data redaction)
- LLM data leakage test results (training data extraction, cross-user contamination)
- System prompt protection configuration and extraction test results
- AI agent write operation permissions and human-in-the-loop approval configuration
- Content Security Policy configuration
- Network DLP configuration for AI artifact transfers

**Detection Indicators:**
- Abnormally high query volume from a single client (model extraction pace)
- Systematic membership inference query patterns (repeated near-identical inputs with minor variations)
- LLM outputs containing email addresses, API keys, or PII not present in the input context
- Agent email or file creation events not initiated by a user action
- Outbound HTTP requests from LLM response rendering

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Query rate limiting enforced with behavioral anomaly detection; output guardrails detect PII and sensitive data; agent write operations least-privilege with human approval; CSP blocks rendering-based exfiltration; system prompts protected from extraction |
| Partial | Rate limiting in place but no behavioral anomaly detection; some output filtering but incomplete coverage; agent write permissions not least-privilege |
| Exposed | No rate limiting or behavioral monitoring; LLM outputs unfiltered; agents can perform unlimited write operations; no CSP |

---

### Tactic: Impact (AML.TA0011)

**Adversary objective:** Degrade, disrupt, or abuse the ML system to cause harm to the victim
organization or third parties. ATLAS impact techniques target the availability, integrity, and
appropriate use of ML systems.

**Key Techniques:**

| Technique ID | Name | Description |
|--------------|------|-------------|
| AML.T0029 | Denial of AI Service | Flood inference system with requests or computationally expensive inputs |
| AML.T0046 | Spamming AI System with Chaff Data | Generate false positives to overwhelm analysts |
| AML.T0031 | Erode AI Model Integrity | Gradually degrade model performance with adversarial inputs |
| AML.T0034 | Cost Harvesting | Submit expensive queries to inflate victim's compute costs |
| AML.T0048 | External Harms | Abuse AI system capabilities to harm users, the public, or the organization |
| AML.T0059 | Erode Dataset Integrity | Poison or corrupt datasets to reduce their usefulness |

**Assessment Questions (from Q-ATLAS-TA0011-001 through TA0011-004):**
- "Is there compute cost monitoring on your AI inference infrastructure? At what threshold
  does an anomalous cost spike trigger an alert?"
- "How do you monitor ongoing model performance in production? At what degradation level do
  you investigate — and would you differentiate adversarial degradation from natural drift?"
- "If an adversary submitted sponge examples — inputs crafted to maximize compute consumption —
  would your infrastructure detect and rate-limit them?"
- "What controls limit the potential for your AI system to cause harm to third parties —
  financial fraud, disinformation, harmful content generation?"

**Evidence to Collect:**
- Query rate limiting and timeout configuration for inference APIs
- Compute cost monitoring and budget alert configuration
- Model performance monitoring dashboards and alerting thresholds
- Chaff data detection or input anomaly detection configuration
- AI use case risk assessment documentation
- Acceptable use policies and harm monitoring procedures

**Detection Indicators:**
- Compute cost spikes without corresponding business volume increase
- Model accuracy or confidence distribution shifts in production
- Inference latency increases consistent with sponge example flooding
- High false positive rates in AI-based detection systems (chaff attack)
- AI system generating outputs outside normal operating parameters

**Control Effectiveness Indicators:**

| Rating | Criteria |
|--------|----------|
| Protected | Rate limiting, query timeouts, and cost alerts configured; model performance continuously monitored with degradation alerts; use case risk-assessed with harm monitoring procedures |
| Partial | General rate limiting exists; model performance monitored but no automated alerting; acceptable use policy without harm monitoring |
| Exposed | No rate limiting or cost monitoring; no ongoing model performance monitoring; no controls on potential external harms |

---

### Tactics: Privilege Escalation, Credential Access, Collection, Command and Control, Lateral Movement (AML.TA0012–TA0015, TA0009)

These tactics share a common pattern: they are downstream consequences of successful Initial
Access or Execution, and they use ML-specific vectors (agent tools, RAG systems, API tokens)
to achieve traditional attacker objectives. Assess them together after completing the
higher-volume tactics above.

**Key Techniques by Tactic:**

| Tactic | Key Techniques | Core Assessment Focus |
|--------|---------------|----------------------|
| Privilege Escalation (TA0012) | AML.T0053 (Tool Invocation), AML.T0054 (Jailbreak) | Can an unprivileged user access privileged tools via prompt injection? |
| Credential Access (TA0013) | AML.T0055 (Unsecured Credentials), AML.T0082 (RAG Credential Harvesting), AML.T0083 (Agent Config Credentials), AML.T0090 (OS Credential Dumping) | Are credentials stored where AI systems can expose them? |
| Collection (TA0009) | AML.T0035 (AI Artifacts), AML.T0036 (Info Repositories), AML.T0037 (Local System), AML.T0085 (AI Services/RAG) | Can an adversary use AI systems to collect data they couldn't access directly? |
| Command and Control (TA0014) | AML.T0072 (Reverse Shell) | If an AI agent is compromised, can the adversary establish outbound C2? |
| Lateral Movement (TA0015) | AML.T0091 (Alternate Authentication) | Can stolen AI API tokens be used to move between AI services? |
| Resource Development (TA0003) | AML.T0019, AML.T0058, AML.T0060 | Does the org detect poisoned artifacts or hallucinated entities before use? |

**Assessment Questions:**
- "Do privilege boundaries hold when tested via prompt injection? Can a standard user prompt
  an agent into using admin-level tools?"
- "Are credentials stored in AI agent configuration files or documents that could be
  ingested into a RAG database? Have you scanned for this?"
- "What egress network controls are on your AI compute infrastructure? Could a compromised
  AI agent initiate an outbound connection to an adversary-controlled server?"
- "Are AI service API tokens short-lived? Do you monitor for token reuse from unexpected
  IP addresses or regions?"
- "Do you validate third-party models and datasets for backdoors before use? Do you check
  LLM-generated code dependencies against real package registries before execution?"

**Evidence to Collect:**
- AI agent tool permission matrix with privilege boundary documentation
- Secrets management tool usage records for AI agent credentials
- RAG-indexed document scanning configuration for credential content
- Egress network filtering configuration for AI compute infrastructure
- AI service token lifecycle policy (expiry, rotation, anomalous use monitoring)
- Third-party AI artifact vetting procedures

**Control Effectiveness Indicators (combined):**

| Rating | Criteria |
|--------|----------|
| Protected | Agent privilege boundaries tested and enforced; credentials in secrets managers with RAG scanning; AI compute egress filtered; tokens short-lived with anomaly monitoring; third-party artifacts vetted |
| Partial | Some controls in each area but tested gaps remain; credential scanning or egress filtering incomplete |
| Exposed | No privilege boundary enforcement; credentials in plaintext configs; unrestricted AI agent network access; long-lived tokens without monitoring |

---

## 5. Red Team Scope Definition

When ATLAS drives an active red team engagement, the scope document must specify exactly which
techniques are authorized, the success criteria for each, and the rules of engagement.

### Scope Document Structure

**In-Scope ML Systems:**
List each ML system component authorized for testing (specific API endpoints, model identifiers,
training pipeline access if authorized, RAG database if authorized). Be explicit — "the
production inference API at api.example.com/v2/predict" is in scope; "all AI systems" is not.

**ATLAS Tactics Authorized:**
List the specific tactic IDs authorized for testing (e.g., AML.TA0002, AML.TA0004,
AML.TA0010). Unlisted tactics are out of scope.

**Specific Technique Exclusions:**
Techniques that are technically in scope by tactic but excluded from testing. Common exclusions:
- AML.T0029 (Denial of AI Service) — excluded from production systems; test in staging only
- AML.T0020 (Poison Training Data) — excluded if no isolated training environment available
- AML.T0018 (Manipulate AI Model) — excluded unless model file access explicitly granted

**Success Criteria Per Tactic:**

| Tactic | Success Criteria |
|--------|-----------------|
| Reconnaissance | Successfully enumerate model family, training data hints, or API surface without triggering detection |
| ML Model Access | Demonstrate unauthenticated inference API access or white-box model file access |
| Initial Access | Demonstrate successful prompt injection or supply chain artifact with anomalous behavior |
| Execution | Demonstrate AI agent tool invocation via prompt injection |
| Exfiltration | Demonstrate model extraction to >10% fidelity, system prompt extraction, or data leakage of test PII |
| Defense Evasion | Demonstrate successful jailbreak of production guardrails |

**ML-Specific Rules of Engagement:**
- Use test data only — no exfiltration or use of production user data
- Rate limits: honor production rate limits unless specifically authorized to test DoS resistance
- Staging environment required for destructive techniques (poisoning, model corruption)
- Query budgets must be agreed in writing before model extraction testing begins
- All prompt injection attempts must be logged by the tester with timestamp and payload
- No social engineering of employees beyond scope of authorized phishing simulation

### Technique Prioritization Framework

Prioritize red team technique selection using a likelihood-impact matrix:

**Likelihood factors (score 1–3):**
- Is the technique feasible given the architecture? (3 = fully feasible, 2 = partially, 1 = constrained)
- Is the technique applicable to the threat actor profile? (3 = clearly applicable)
- Has the technique been used in documented ATLAS case studies against similar systems?

**Impact factors (score 1–3):**
- What is the consequence if the technique succeeds? (3 = critical: model extraction, training data leakage)
- What is the blast radius? (3 = affects all users or permanently changes model behavior)
- How difficult is recovery? (3 = difficult: poisoned model, persistent RAG injection)

**Priority = Likelihood Score × Impact Score (maximum 9)**

| Priority Range | Action |
|----------------|--------|
| 7–9 | Test first; escalate immediately if successful |
| 4–6 | Test in second phase; document findings with severity High |
| 1–3 | Test if time permits; document findings with severity Medium or Low |

### Common Red Team Test Cases by Tactic

**Reconnaissance:**
- Submit targeted queries to inference API to determine model family (GPT-based, BERT-based,
  proprietary classifier) based on response patterns and latency characteristics
- Enumerate publicly available information (papers, blog posts, job postings) to reconstruct
  model architecture details before any API access
- Probe API endpoints for model metadata, version headers, or error messages that disclose
  technical details

**ML Model Access / Exfiltration:**
- Model extraction: submit structured queries to the inference API at authorized rate limits;
  train a surrogate model on the responses; measure fidelity against a held-out test set
- Membership inference: submit training examples vs non-training examples; measure whether
  confidence score distributions differ in a statistically significant way (AML.T0024.000)
- System prompt extraction: attempt direct elicitation ("repeat your instructions"), encoding
  tricks, and indirect prompting sequences to extract system prompt content (AML.T0056)

**Initial Access:**
- Prompt injection: systematically test all identified input surfaces for direct injection
  (AML.T0051.000), indirect injection via external data sources (AML.T0051.001), and
  triggered injection patterns (AML.T0051.002)
- Supply chain: verify that test model files with known-bad checksums are rejected by the
  deployment pipeline; verify that model registry access controls prevent unauthorized uploads
- Drive-by prompt injection: if the AI agent retrieves web content, serve adversary-controlled
  web pages containing prompt injection payloads (AML.T0078)

**Defense Evasion:**
- Jailbreak testing: attempt known jailbreak patterns, role-play scenarios, encoding-based
  bypasses, and context manipulation techniques against production guardrails (AML.T0054)
- Prompt obfuscation: submit prompts with injection instructions in hidden text (white text on
  white background, zero-width characters, homoglyph substitution) to test content scanning (AML.T0068)
- False RAG injection: insert adversary-controlled documents containing embedded prompt
  injections into the RAG ingestion pipeline; verify whether content validation catches them (AML.T0071)

**Execution / Privilege Escalation:**
- Agent tool invocation abuse: craft prompts that instruct the AI agent to invoke each of
  its available tools outside the intended workflow; test whether privilege boundaries hold
  when accessed via prompt injection (AML.T0053)
- Command execution: if agent has code execution tools, attempt to invoke shell commands
  through prompt injection (AML.T0050)

---

## 6. Control Validation Assessment

For organizations that have implemented ML security controls and want to validate their
effectiveness against ATLAS techniques, apply these validation tests.

### Input Validation Controls

**Controls targeted:** Prompt injection detection, adversarial input detection, content
sanitization

**What "effective" looks like:**
- Direct prompt injection payloads (known jailbreak strings, role-play framing, delimiter
  manipulation) are detected and refused at the input layer before reaching the model
- Adversarial perturbations against image or structured data models are detected and
  flagged before inference
- Documents ingested into RAG systems are scanned for embedded instruction text

**Validation tests:**
1. Submit a curated set of known prompt injection payloads (ATLAS case study examples,
   OWASP LLM Top 10 test cases) and measure detection rate
2. Submit adversarial examples crafted using black-box optimization against the same model
   family; measure whether input detection triggers
3. Submit RAG documents containing embedded prompt injections in non-visible text; measure
   whether content validation detects them

**Evidence of effectiveness:** Detection logs showing blocked payloads, alert records,
controlled false negative rate from test set

### Output Monitoring Controls

**Controls targeted:** PII detection, data leakage detection, harmful output filtering,
system prompt protection

**What "effective" looks like:**
- LLM outputs containing PII (names, email addresses, phone numbers, SSNs) are detected
  and redacted before delivery to the user
- LLM responses containing training data memorization (verbatim reproduction of sensitive
  training content) are flagged
- System prompt content is not reproduced in LLM outputs

**Validation tests:**
1. Submit prompts designed to elicit PII from training data or connected data sources;
   verify that output guardrails redact detected PII
2. Attempt to extract the system prompt via direct elicitation and indirect prompting;
   verify that output filtering prevents disclosure
3. Submit prompts that historically induce training data memorization; verify that
   verbatim reproduction is detected

### Access Controls

**Controls targeted:** API authentication, rate limiting, privilege enforcement, model file access

**What "effective" looks like:**
- Unauthenticated requests to inference APIs are rejected
- Rate limits prevent bulk query attacks (model extraction, membership inference)
- Privilege boundaries prevent unprivileged users from accessing privileged agent tools via
  prompt injection
- Model files are not readable by unauthorized accounts

**Validation tests:**
1. Submit unauthenticated requests to all inference API endpoints; verify all return 401/403
2. Submit queries at 2x, 5x, and 10x normal rate; verify rate limiting triggers at
   configured threshold and alerts are generated
3. Craft prompt injection payloads targeting privileged agent tools; verify tool invocation
   is denied for unprivileged sessions
4. Attempt to access model files using a test account with standard user privileges; verify
   access denied

### Supply Chain Controls

**Controls targeted:** Model integrity verification, artifact provenance, dependency validation

**What "effective" looks like:**
- Model files with modified checksums are rejected before loading
- Third-party datasets are scanned and validated before use in training
- LLM-generated code dependencies are validated against real package registries

**Validation tests:**
1. Provide a test model file with a valid format but modified checksum; verify the pipeline
   rejects it at the integrity check stage
2. Provide a test dataset with a known-bad provenance indicator; verify the dataset is
   quarantined before training use
3. Submit LLM-generated code referencing a fabricated package name; verify the dependency
   resolver flags it before installation

### Monitoring and Detection Controls

**Controls targeted:** Query anomaly detection, model performance monitoring, agent activity logging

**What "effective" looks like:**
- Anomalous query patterns (model extraction pace, membership inference patterns) trigger alerts
- Model performance degradation below configured thresholds triggers investigation
- All AI agent tool invocations are logged with user context and parameters

**Validation tests:**
1. Execute a model extraction query sequence at authorized volume; verify behavioral anomaly
   detection generates an alert within the SLA (e.g., 15 minutes)
2. Submit inputs that degrade model accuracy by a measurable amount; verify performance
   monitoring detects the degradation within one monitoring cycle
3. Invoke agent tools under a test session; verify all invocations appear in logs with
   correct user attribution and timestamps

---

## 7. Coverage Scoring Summary

### Tactic Coverage Table

Complete this table at assessment conclusion. Use it as the primary deliverable for
executive-level reporting.

| Tactic | ID | Applicable Techniques (count) | Techniques Assessed | Coverage Rating | Remediation Priority |
|--------|----|-------------------------------|---------------------|-----------------|----------------------|
| AI Model Access | AML.TA0000 | | | | |
| AI Attack Staging | AML.TA0001 | | | | |
| Reconnaissance | AML.TA0002 | | | | |
| Resource Development | AML.TA0003 | | | | |
| Initial Access | AML.TA0004 | | | | |
| Execution | AML.TA0005 | | | | |
| Persistence | AML.TA0006 | | | | |
| Defense Evasion | AML.TA0007 | | | | |
| Discovery | AML.TA0008 | | | | |
| Collection | AML.TA0009 | | | | |
| Exfiltration | AML.TA0010 | | | | |
| Impact | AML.TA0011 | | | | |
| Privilege Escalation | AML.TA0012 | | | | |
| Credential Access | AML.TA0013 | | | | |
| Command and Control | AML.TA0014 | | | | |
| Lateral Movement | AML.TA0015 | | | | |

**Coverage Rating definitions:**
- **Protected:** Effective controls with Tier 1 or Tier 2 evidence for the majority of
  applicable techniques; no critical technique completely unmitigated
- **Partial:** Controls exist for some applicable techniques but gaps remain; or controls
  rely on Tier 3/4 evidence only
- **Exposed:** No effective controls for the majority of applicable techniques; or one
  critical technique (e.g., AML.T0051 Prompt Injection) is completely unmitigated

### Top Gaps Table

Document the highest-priority technique-level exposures for the remediation roadmap:

| Rank | Technique ID | Technique Name | Tactic | Exposure Level | Recommended Control |
|------|--------------|---------------|--------|---------------|---------------------|
| 1 | | | | | |
| 2 | | | | | |
| 3 | | | | | |
| 4 | | | | | |
| 5 | | | | | |

### Risk Heat Map by ML System Component

Rate each in-scope component by its overall ATLAS exposure level after the full assessment:

| ML System Component | Highest-Exposure Tactic | Exposure Level | Top Unmitigated Technique |
|--------------------|------------------------|---------------|--------------------------|
| Public inference API | | | |
| Training pipeline | | | |
| RAG database | | | |
| AI agent system | | | |
| Model registry | | | |
| MLOps / CI/CD | | | |

---

## 8. Common Findings by Tactic

### Reconnaissance — Common Findings

**Model information exposed without business necessity**
Technical details about the organization's ML models — model architecture, training dataset
sources, API endpoint structure — are discoverable via public sources (papers, blogs, job
postings) without providing business value. This enables adversary reconnaissance and
reduces the effort required to target the system.
Recommended control: Implement an AI information disclosure policy; conduct OSINT
self-assessment; review researcher publication approvals (AML.T0000, AML.T0003).

**No active scanning detection on inference APIs**
API gateways or WAFs are not configured with rules to detect enumeration behavior, model
fingerprinting queries, or systematic probing of API parameters. Adversary reconnaissance
activity proceeds undetected.
Recommended control: Configure WAF rules for AI-specific enumeration patterns; implement
API behavioral analytics; alert on unusual endpoint scanning (AML.T0006).

---

### ML Model Access — Common Findings

**Inference API unauthenticated or rate-unlimited**
The inference API accepts requests without authentication, or authentication is in place but
no rate limiting is configured. An adversary with network access can query the model without
restriction, enabling model extraction, membership inference, and denial-of-service attacks.
Recommended control: Enforce authentication on all inference endpoints; implement query
rate limiting with behavioral monitoring (AML.T0040, AML.T0024).

**No anomaly detection for bulk inference queries**
Rate limiting is configured but the system does not detect behavioral anomalies — sustained
high-volume queries, unusual input diversity patterns, or systematic confidence score probing
consistent with model extraction. Rate limits alone are insufficient defense against
patient, low-rate model extraction.
Recommended control: Implement behavioral anomaly detection on inference API telemetry;
add output obfuscation (reduced confidence score precision) (AML.T0024).

---

### Initial Access — Common Findings

**Prompt injection not tested across all input surfaces**
The organization has tested prompt injection on the primary LLM chat interface but has not
tested all surfaces where external input reaches the LLM — support ticket systems, form
processors, document ingestion pipelines, and API input fields. Indirect injection vectors
(AML.T0051.001) and triggered injection (AML.T0051.002) are commonly untested.
Recommended control: Enumerate all data paths from external input to LLM context; test
each for prompt injection; implement content sanitization at each ingestion point.

**AI supply chain integrity checks absent**
Third-party models are downloaded and deployed without cryptographic checksum verification
or provenance tracking. Datasets from public repositories are incorporated without vetting.
No AI BOM exists. Supply chain compromise (AML.T0010) via a poisoned public model or dataset
would not be detected.
Recommended control: Implement AI BOM; enforce cryptographic verification for all model
files and datasets; vet third-party AI artifacts before production use.

---

### Execution — Common Findings

**AI agent tools not least-privilege**
AI agents are configured with broad tool access — the same set of tools available to any
session, regardless of the user's role or the current task. An adversary using prompt
injection to invoke agent tools (AML.T0053) gains access to all tools the agent holds,
not just the subset appropriate for the legitimate task.
Recommended control: Implement task-scoped tool permissions; require human approval for
high-consequence tool invocations; log all tool invocations.

**Unsafe AI artifact formats permitted without validation**
The ML pipeline loads model files in unsafe serialization formats (pickle, joblib) without
validation or sandboxing. A malicious model file embedded in a supply chain artifact could
execute arbitrary code on load (AML.T0011).
Recommended control: Restrict model serialization formats to safe alternatives (safetensors,
ONNX); implement code signing; scan artifacts before loading.

---

### Persistence — Common Findings

**RAG database write access not restricted**
Multiple services and users have write access to the RAG vector database with no content
validation on ingested documents. An adversary with write access can inject malicious content
that persistently influences LLM responses for all users without triggering any alert
(AML.T0070, AML.T0071).
Recommended control: Restrict RAG write access to authorized ingestion pipelines; implement
content validation for all ingested documents; monitor RAG index changes.

**AI agent configuration files not under change management**
System prompts, tool definitions, and knowledge source configurations for AI agents are stored
in files accessible to developers without change management controls. An adversary with
repository access can silently modify agent behavior in a way that persists across restarts
(AML.T0081).
Recommended control: Apply change management to all AI agent configuration files; require
review approval for configuration changes; audit agent configuration changes.

---

### Defense Evasion — Common Findings

**LLM guardrails not tested against jailbreak**
Safety guardrails are deployed (system prompt instructions, keyword filtering, output
classifiers) but have not been tested against adversarial jailbreak attempts. Guardrail
bypasses (AML.T0054) are a well-documented, actively exploited technique; untested guardrails
should be treated as unverified.
Recommended control: Conduct quarterly adversarial testing of guardrails using jailbreak
technique sets; track bypass rate as a security metric.

**No detection for hidden prompt injection in inputs**
Input content scanning does not detect prompt injections delivered via hidden text, Unicode
tricks, or HTML elements (AML.T0068). An adversary submitting a document to a RAG ingestion
pipeline can embed invisible injection instructions that evade content scanning.
Recommended control: Implement content security scanning that normalizes text before validation;
detect and flag zero-width characters, unusual Unicode, and HTML elements in plain-text contexts.

---

### Exfiltration — Common Findings

**Model extraction not monitored**
No behavioral anomaly detection is in place to identify model extraction query patterns.
An adversary can systematically query the inference API to build a high-fidelity surrogate
model without triggering any alert, as long as individual request volume stays under the
rate limit (AML.T0024.002).
Recommended control: Implement behavioral anomaly detection for model extraction patterns
in addition to per-request rate limiting; consider output obfuscation (reduced score precision).

**LLM outputs not monitored for data leakage**
LLM responses are returned to users without output monitoring for PII, training data
memorization, or sensitive system information (AML.T0057). Data leakage events are only
discoverable if a user reports them.
Recommended control: Implement output monitoring with PII detection and sensitive data
classification; log all LLM outputs for post-hoc analysis; alert on high-confidence leakage
detections.

---

### Impact — Common Findings

**Model performance monitoring lacks adversarial sensitivity**
The organization monitors model performance metrics (accuracy, F1, latency) but the monitoring
is not sensitive to adversarial integrity erosion patterns (AML.T0031). Gradual performance
degradation driven by adversarial inputs would be attributed to natural concept drift rather
than triggering a security investigation.
Recommended control: Implement adversarial robustness metrics alongside accuracy metrics;
configure degradation alerts with investigation triggers; distinguish adversarial drift from
natural drift using input distribution analysis.

**No AI-specific compute cost monitoring**
AI inference costs are monitored at the cloud billing level but not in real time per-service.
Cost harvesting attacks (AML.T0034) and sponge example flooding (AML.T0029) would not be
detected until the monthly bill arrives.
Recommended control: Implement per-service real-time cost monitoring with anomaly alerts;
configure per-request compute timeout limits.

---

## 9. Assessment Report Format

### Finding Documentation Format

Use this format for each finding, ordered by exposure level (Critical first):

```
Finding ID: ATLAS-[YEAR]-[SEQUENCE]
Technique ID: AML.T[XXXX] ([Technique Name])
Tactic: AML.TA[XXXX] ([Tactic Name])
Exposure Level: [Critical / High / Medium / Low]
Coverage Rating: [Exposed / Partial]
ML Component: [Affected system component]

Description:
[Factual description of what was observed — what control is missing or ineffective,
what was observed during testing or configuration review.]

Evidence Reviewed:
[Documents reviewed, tests conducted, API responses observed, configuration inspected.]

Adversary Impact:
[What can an adversary accomplish using this technique against this system given the
current control gap?]

Recommended Control:
[Specific, actionable control recommendation with reference to atlas.mitre.org technique
page for additional guidance.]

Evidence of Remediation:
[What the assessor would expect to see as evidence that the gap has been addressed —
for re-validation at follow-up.]
```

**Exposure Level Definitions:**

| Level | Criteria |
|-------|----------|
| Critical | Technique is fully executable against in-scope ML system with no effective control; high impact (model extraction, training data leakage, persistent backdoor) |
| High | Technique is executable with minimal effort; partial control exists but is bypassed or untested; or critical technique has only Tier 4 evidence of control |
| Medium | Technique is executable but requires meaningful adversary effort; control gaps exist in depth-of-defense layers |
| Low | Technique is constrained by architecture or access requirements; minor control improvement recommended |

### Assessment Summary Dashboard

| Section | Content |
|---------|---------|
| ML Systems Assessed | List of in-scope ML components with brief description |
| Assessment Mode | Threat Modeling / Red Team / Control Validation (or combination) |
| Assessment Date Range | Start and end dates |
| ATLAS Version | v5.1.0 |
| Overall ATLAS Coverage | Aggregate rating across all assessed tactics |
| Top 5 Technique Gaps | AML.T IDs with one-line descriptions |

### Report Structure

**Executive Summary**
ML system scope, assessment mode, overall ATLAS coverage rating, top 5 technique gaps with
business impact, recommended prioritization for remediation investment.

**Threat Model**
For each in-scope ML component: applicable techniques per tactic, control assessment per
technique, coverage rating. Reference architecture diagrams reviewed.

**Tactic Coverage Matrix**
Full grid of tactics (rows) by ML system components (columns). Cell values: Protected /
Partial / Exposed. This matrix is the primary artifact for communicating coverage posture
to technical and executive audiences.

**Findings**
All findings in standard format, ordered by exposure level. Each finding includes:
technique ID, tactic, exposure level, description, evidence, adversary impact, recommended
control, evidence of remediation.

**Red Team Results (if applicable)**
For each technique tested: test description, execution approach, result (successful /
partial / unsuccessful), proof-of-concept summary (screenshots, API responses, log excerpts).
No credentials, no production data in report.

**Appendix A — Technique Catalog Reference**
Full list of ATLAS techniques assessed, with AML.T IDs, tactic membership, and coverage
rating. Reference: atlas.mitre.org

**Appendix B — Architecture Diagrams Reviewed**
List of architecture artifacts provided and reviewed, with version dates.

**Appendix C — Evidence Index**
Index of all evidence reviewed during the assessment: document name, version, evidence tier,
findings it supports.

**Appendix D — Assessment Questions Administered**
List of Q-ATLAS question IDs administered, organized by tactic category.

---

*Reference: MITRE ATLAS v5.1.0 — atlas.mitre.org/matrices/ATLAS*
*Framework: Intelligence Adjacent (IA)*
*Version: 1.0 | Last Updated: 2026-02-25*
