---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: INTAKE (Scope Gathering, Domain Selection)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather project context, determine assessment scope, select domains,
and define engagement parameters. This phase sets the foundation for all subsequent
test case generation.

**Additional constraints:** Do not begin generating test cases in this phase. Focus entirely
on understanding the request, gathering scope, documenting targets, and selecting domains.
If context is insufficient, ask the user — do not assume.

---

## INPUT CONTRACT

**Receives:**
- User request (scope document, system description, or target list)
- Optional: project name, assessment type, compliance requirements
- Output directory path: `private/output/test-plan/{project}-{date}/`

**Prerequisites:**
- User has invoked `/test-plan`
- Request content available (scope or system description)

**Source:** `skills/test-plan/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Gather sufficient context to execute the test plan generation, confirm domain selection,
and prepare for methodology mapping.

**Success criteria:**
- Project context gathered
- Assessment domains confirmed
- Scope documented with in-scope and out-of-scope items
- Target systems enumerated
- Output directory created

**Failure criteria:**
- User provides no context and declines to clarify → STOP

---

## METHODOLOGY

**Phase 1 is about understanding, not generating.** Resist the urge to start test case generation here.
A well-scoped engagement produces better test cases than a poorly-scoped comprehensive one.

**Domain selection drives test case generation.** The available domains map to methodologies
in `/methodologies/`. Select the domains that match the assessment scope.

---

## EXECUTION

### Step 1: Gather Project Context

**Tool:** Read (for existing scope docs), direct conversation (for descriptions)

Gather project context in at least one form:
- Scope document from pentest/sec-review/code-review
- System description with component list
- Target list (URLs, IPs, APIs, mobile apps)
- Architecture diagrams or design documents

If the user provides a scope document, read it and extract:
- In-scope targets
- Assessment type
- Compliance requirements
- Any specific concerns

**Expected output:** Project context sufficient for domain selection
**On failure:** Ask user to provide scope, description, or target list

### Step 2: Gather Assessment Type and Preferences

**Tool:** Direct conversation

Collect:
- Assessment type (pentest, security review, code review, vuln-scan, red team)
- Target systems (web apps, APIs, mobile, network, cloud, etc.)
- **Compliance frameworks** (FedRAMP High/Moderate, PCI DSS, HIPAA, SOC 2, ISO 27001)
- Client-specific concerns or threat intelligence
- Time constraints or priorities

**IMPORTANT - Compliance Frameworks:**
If the user mentions FedRAMP, PCI DSS, HIPAA, SOC 2, or any compliance requirement:
1. Note the specific framework and level (e.g., "FedRAMP High", "PCI DSS 4.0")
2. This will trigger compliance-specific test case generation in Phase 2
3. The agent will check `private/books/standards/` for framework guidance

**Expected output:** Assessment preferences documented
**On failure:** Proceed with defaults (pentest, all applicable domains)

### Step 2b: Available Domains Reference

**Tool:** Read (reference)

Read available methodologies from `/methodologies/` to inform domain selection:

| Domain | Methodology File | Frameworks |
|--------|-----------------|------------|
| Web Application | `methodologies/web-api/framework.md` | OWASP Top 10 2021 |
| API | `methodologies/web-api/framework.md` | OWASP API Security Top 10 2023 |
| Mobile (Android) | `methodologies/mobile/android-framework.md` | MASVS, OWASP MSTG |
| Mobile (iOS) | `methodologies/mobile/ios-framework.md` | MASVS, OWASP MSTG |
| Network/Infrastructure | `methodologies/network/framework.md` | MITRE ATT&CK |
| Cloud (AWS) | `methodologies/cloud/aws-framework.md` | CIS AWS Benchmark |
| Cloud (Azure) | `methodologies/cloud/azure-framework.md` | CIS Azure Benchmark |
| Cloud (GCP) | `methodologies/cloud/gcp-framework.md` | CIS GCP Benchmark |
| AI/LLM | `methodologies/ai-llm/framework.md` | OWASP LLM Top 10 |
| Active Directory | `methodologies/active-directory/framework.md` | AD Security |
| Web3/Smart Contracts | `methodologies/web3/framework.md` | Smart Contract Top 10, Immunefi |
| Thick Client | `methodologies/thick-client/framework.md` | Client-side testing |

### Step 3: Domain Selection

**Tool:** Direct conversation

Present available domains and ask which to include:

```
Available Domains:
- Web Application (OWASP Top 10)
- API (OWASP API Security Top 10)
- Mobile - Android (MASVS)
- Mobile - iOS (MASVS)
- Network/Infrastructure (MITRE ATT&CK)
- Cloud - AWS (CIS)
- Cloud - Azure (CIS)
- Cloud - GCP (CIS)
- AI/LLM (OWASP LLM Top 10)
- Active Directory
- Web3/Smart Contracts
- Thick Client

Which domains are in scope for this assessment?
```

**Auto-selection based on targets:**
- Web URLs in scope → suggest Web Application domain
- API endpoints in scope → suggest API domain
- Mobile apps in scope → suggest Mobile domain
- IP ranges in scope → suggest Network domain
- AWS/Azure/GCP accounts in scope → suggest Cloud domain
- LLM/AI features in scope → suggest AI/LLM domain

**Expected output:** Domain selection confirmed
**On failure:** Default to Web Application + API (most common)

### Step 4: Define Scope and Create Output Directory

**Tool:** Write, Bash
**Reference:** Output directory `private/output/test-plan/{project}-{date}/`

Create output directory and document scope:

```markdown
# Test Plan Scope

**Date:** YYYY-MM-DD
**Project:** {project}
**Assessment Type:** {type}
**Compliance Frameworks:** [FedRAMP High, PCI DSS 4.0, HIPAA, SOC 2, etc.]

### Domains
- [Domain 1] (included)
- [Domain 2] (included)

### Targets
- {target 1}
- {target 2}

### Scope
- In scope: [what will be tested]
- Out of scope: [what will NOT be tested]

### Requirements
- [Requirement 1]

### Compliance Framework Notes
- [Framework]: Level [if applicable], Key requirements to test
- Agent will check: private/books/standards/ for framework guidance
```

**Expected output:** scope.md written to output directory
**On failure:** If scope cannot be defined, ask user for clarification

### Step 5: Verify Readiness

**Tool:** Direct analysis

Confirm all prerequisites for Phase 2 are met:
- Project context gathered
- Domains confirmed
- Scope documented
- Output directory exists

**Expected output:** Readiness confirmed, completion checklist displayed to user
**On failure:** Loop back to the specific step that is incomplete

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → `private/output/test-plan/{project}-{date}/scope.md`
- Output directory created at `private/output/test-plan/{project}-{date}/`

**Format:** Markdown scope document

---

## NEXT

**On success:** → Proceed to Phase 2 (Analyze):

Load `skills/test-plan/phases/02-analyze.md` with:
- Context gathered in this phase
- Domain selection confirmed
- Output directory path

**On failure (missing context):** → Ask user for missing information, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Project context gathered (scope, targets, description)
- [ ] Assessment type confirmed
- [ ] Domain selection confirmed
- [ ] Scope documented
- [ ] Output directory created
- [ ] Ready to proceed to Phase 2 (ANALYZE)

**Error recovery:**
- If context insufficient: Ask user for scope document, system description, or target list
- If output directory creation fails: Check path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
