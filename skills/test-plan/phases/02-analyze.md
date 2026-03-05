---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 2: ANALYZE (Methodology Selection, Framework Mapping)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Map selected domains to available methodologies, select appropriate
framework controls, and document methodology-to-test-case mapping. This phase determines
which test cases will be generated.

**Additional constraints:** Do not generate test cases in this phase — focus entirely on
methodology selection and framework mapping. The output of this phase is a methodology
selection document that drives Phase 3.

---

## INPUT CONTRACT

**Receives:**
- Scope from Phase 1
- Domain selection confirmed
- Output directory: `private/output/test-plan/{project}-{date}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Scope documented
- Domain selection confirmed

**Source:** `skills/test-plan/phases/01-intake.md`

---

## OBJECTIVE

**Goal:** Map selected domains to methodologies and framework controls, producing a
methodology selection document that guides test case generation.

**Success criteria:**
- Each selected domain mapped to a methodology file
- Framework controls identified for each domain
- Test categories prioritized based on scope
- Methodology selection documented

**Failure criteria:**
- No domains selected → Return to Phase 1
- Methodology files unavailable → Document gap and continue with available frameworks

---

## METHODOLOGY

**Phase 2 is about mapping, not generating.** Select the right methodologies and frameworks
to ensure comprehensive test case coverage in Phase 3.

**Framework selection follows scope.** Map the assessment type and targets to the most
appropriate security frameworks. A web app pentest uses OWASP Top 10; an AWS assessment
uses CIS AWS Benchmark.

---

## EXECUTION

### Step 1: Read Scope and Domain Selection

**Tool:** Read

Read `scope.md` from the output directory to understand:
- Selected domains
- Assessment type
- Target systems
- Compliance requirements

**Expected output:** Scope context loaded

### Step 2: Map Domains to Methodologies

**Tool:** Read (methodology files), direct analysis

For each selected domain, identify the appropriate methodology:

| Domain | Primary Framework | Secondary Frameworks |
|--------|-------------------|---------------------|
| Web Application | OWASP Top 10 2021 | WSTG, ASVS |
| API | OWASP API Security Top 10 2023 | OWASP WSTG-API |
| Mobile (Android) | MASVS | OWASP MSTG |
| Mobile (iOS) | MASVS | OWASP MSTG |
| Network/Infrastructure | MITRE ATT&CK | CIS Controls |
| Cloud (AWS) | CIS AWS Benchmark | AWS Well-Architected |
| Cloud (Azure) | CIS Azure Benchmark | Azure Security Benchmark |
| Cloud (GCP) | CIS GCP Benchmark | GCP Security Blueprint |
| AI/LLM | OWASP LLM Top 10 | MITRE ATLAS |
| Active Directory | AD Security | CIS Control 6 |
| Web3/Smart Contracts | Smart Contract Top 10 | Immunefi |
| Thick Client | Client-side testing | OWASP |

### Step 2b: Check Compliance Sources (If Applicable)

**Tool:** Glob, Read

If the scope mentions compliance frameworks, check these sources for framework-specific requirements:

| Compliance | Source Location | What to Extract |
|------------|-----------------|-----------------|
| PCI DSS | `private/books/standards/penetration-testing-guidance-pci-security-standards-council/` | Penetration testing requirements, Appendix A |
| FedRAMP | WebSearch for "FedRAMP Penetration Testing Guide" | Control requirements, scope |
| HIPAA | `methodologies/` + WebSearch | Security rule requirements |
| SOC 2 | WebSearch for "SOC 2 penetration testing requirements" | Trust service criteria |
| ISO 27001 | `methodologies/` + WebSearch | Control testing guidance |

**Process:**
1. If compliance framework detected in scope → Glob relevant source
2. Read key sections for testing requirements
3. Map compliance requirements to test cases
4. Prioritize compliance-specific controls in test generation

**Example for PCI:**
- PCI DSS 11.3 requires penetration testing
- Extract scoping requirements from PCI
- Map to OWASP Top 10 for web applications
- Include cardholder data environment tests

### Step 3: Select Framework Controls

**Tool:** Read (methodology framework files)

For each domain, read the corresponding methodology file to identify controls to test:

```
For Web Application:
- Read methodologies/web-api/framework.md
- Extract OWASP Top 10 2021 categories
- Select categories based on scope

For API:
- Read methodologies/web-api/framework.md
- Extract OWASP API Security Top 10 2023 categories

For Mobile:
- Read methodologies/mobile/framework.md
- Select Android or iOS specific testing

For Network:
- Read methodologies/network/framework.md
- Map to MITRE ATT&CK tactics

For Cloud:
- Read methodologies/cloud/{provider}-framework.md
- Select CIS Benchmark controls
```

**Expected output:** Framework controls identified for each domain

### Step 4: Prioritize Test Categories

**Tool:** Direct analysis

Based on scope and assessment type, prioritize test categories:

**For Penetration Testing (high priority on exploitation):**
1. Access Control (broken auth, IDOR)
2. Injection (SQL, command, XSS)
3. Cryptographic Failures
4. Security Misconfiguration

**For Security Review (high priority on design):**
1. Architecture & Design
2. Authentication & Session Management
3. Authorization
4. Input Validation

**For Vulnerability Scan (high priority on known vulns):**
1. Outdated Components
2. Security Misconfiguration
3. Known CVEs
4. Default Credentials

**Expected output:** Test categories prioritized

### Step 5: Document Methodology Selection

**Tool:** Write

Write `methodology-selection.md` to the output directory:

```markdown
# Methodology Selection

**Date:** YYYY-MM-DD
**Project:** {project}
**Assessment Type:** {type}
**Compliance Frameworks:** {list if applicable}

## Domain-to-Methodology Mapping

| Domain | Methodology File | Primary Framework | Selected Controls |
|--------|-----------------|-------------------|-------------------|
| Web Application | methodologies/web-api/framework.md | OWASP Top 10 2021 | A01-A10 |
| API | methodologies/web-api/framework.md | OWASP API Security Top 10 | API1-API10 |
| Mobile | methodologies/mobile/android-framework.md | MASVS | STORAGE, AUTH, NETWORK |
| Network | methodologies/network/framework.md | MITRE ATT&CK | T1046, T1110, T1190 |
| Cloud AWS | methodologies/cloud/aws-framework.md | CIS AWS | 2.1.x, 2.2.x |

## Compliance Requirements (if applicable)

| Framework | Source | Key Requirements |
|-----------|--------|------------------|
| PCI DSS | private/books/standards/penetration-testing-guidance-pci-security-standards-council/ | 11.3, Appendix A |
| [Framework] | [Source] | [Requirements] |

## Test Category Priorities

| Priority | Category | Domains |
|----------|----------|---------|
| 1 | Access Control | Web, API, Mobile |
| 2 | Injection | Web, API |
| 3 | Authentication | Web, API, Mobile, Network |
| 4 | Cryptography | Web, Mobile, Cloud |
| 5 | Configuration | All |

## Frameworks Reference

### OWASP Top 10 2021
- A01: Broken Access Control
- A02: Cryptographic Failures
- A03: Injection
- A04: Insecure Design
- A05: Security Misconfiguration
- A06: Vulnerable and Outdated Components
- A07: Identification and Authentication Failures
- A08: Software and Data Integrity Failures
- A09: Security Logging and Monitoring Failures
- A10: Server-Side Request Forgery

### OWASP API Security Top 10 2023
- API1: Broken Object Level Authorization
- API2: Broken Authentication
- API3: Broken Object Property Level Authorization
- API4: Unrestricted Resource Consumption
- API5: Broken Function Level Authorization
- API6: Unrestricted Sensitive Business Flows
- API7: Server Side Request Forgery
- API8: Security Misconfiguration
- API9: Improper Inventory Management
- API10: Unsafe Consumption of APIs

[Continue with other frameworks as applicable]
```

**Expected output:** methodology-selection.md written to output directory

---

## OUTPUT CONTRACT

**Produces:**
- `methodology-selection.md` → `private/output/test-plan/{project}-{date}/methodology-selection.md`

**Format:** Markdown methodology mapping document

---

## NEXT

**On success:** → Proceed to Phase 3 (Generate):

Load `skills/test-plan/phases/03-generate.md` with:
- Scope from Phase 1
- Methodology selection from this phase
- Output directory path

**On failure:** → Loop back to domain selection in Phase 1

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All selected domains mapped to methodology files
- [ ] Framework controls identified for each domain
- [ ] Test categories prioritized based on scope
- [ ] Methodology selection documented
- [ ] Ready to proceed to Phase 3 (GENERATE)

**Error recovery:**
- If methodology file not found: Document gap, use known frameworks from knowledge
- If domain unclear: Return to Phase 1 for clarification

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
