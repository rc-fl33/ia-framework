---
domain: sec-review
skill: sec-review
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: INTAKE (Context, Scope, Questionnaires)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather context, determine assessment scope, select domains, generate
questionnaires, and define engagement parameters. This phase sets the foundation for all
subsequent analysis.

**Additional constraints:** Do not begin analysis in this phase. Focus entirely on understanding
the request, gathering inputs, documenting scope, and preparing questionnaires. If context is
insufficient, ask the user — do not assume.

---

## INPUT CONTRACT

**Receives:**
- User request (architecture documentation, system description, or URL)
- Optional: company name, URL, compliance requirements
- Output directory path: `private/output/sec-review/{project}-{date}/`

**Prerequisites:**
- User has invoked `/sec-review`
- Request content available (architecture description or docs)

**Source:** `skills/sec-review/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Gather sufficient context to execute the security review, confirm domain selection, and
prepare questionnaires for optional domains.

**Success criteria:**
- Architecture context gathered
- Assessment domains confirmed (A always; B, C, and/or E optional)
- Questionnaires generated and provided for selected optional domains
- Scope documented with in-scope and out-of-scope items
- Output directory created

**Failure criteria:**
- User provides no context and declines to clarify → STOP
- No architecture documentation available and user declines to provide → STOP

---

## METHODOLOGY

**Phase 1 is about understanding, not analyzing.** Resist the urge to start the analysis here.
A well-scoped engagement produces better results than a poorly-scoped comprehensive one.

**Domain selection drives questionnaire generation.** Domain A is always included. Domains B,
C, and E require questionnaires that the user fills out before Phase 2. Do not skip this
step.

---

## EXECUTION

### Step 1: Gather Architecture Context

**Tool:** Read (for docs/IaC), direct conversation (for descriptions)

Gather architecture documentation in at least one form:
- Architecture diagrams or design documents
- Infrastructure-as-code files (Terraform, CloudFormation, Kubernetes manifests)
- Written system description with component list
- README or wiki with architecture overview
- API specifications

If the user provides a URL, collect it for automated research in Step 2b.

**Expected output:** Architecture context sufficient for decomposition
**On failure:** Ask user to provide documentation, diagrams, or system description

### Step 2: Gather Compliance and Context

**Tool:** Direct conversation

Collect:
- Company name and/or URL (optional — triggers company research in Step 2b)
- Applicable compliance frameworks (HIPAA, SOC2, PCI-DSS, FedRAMP, ISO 27001)
- Threat modeling preference (STRIDE default, PASTA, Attack Trees, Zero Trust Architecture / ZTA)
- System type (web app, cloud infrastructure, microservices, mobile backend, IoT)

**Note:** ZTA methodology follows NIST SP 800-207 validation principles — evaluating
microsegmentation, identity-centric access, and least-privilege enforcement across the
architecture.

**Expected output:** Compliance context and preferences documented
**On failure:** Proceed with defaults (STRIDE, no compliance framework)

### Step 2b: Automated Research

**Applies:** All invocations | **Blocking:** No

**Tool:** WebSearch, Bash (NVD client), WebFetch, Read

This step automatically gathers security intelligence based on detected technologies before
asking follow-up questions. All research is non-blocking — if NVD times out or WebSearch
fails, log a note and continue.

---

**Company Context (if company name or URL provided):**

If the user provides a company name, website URL, or both:

1. IF URL provided:
   - WebFetch the URL → extract technology signals from response headers, page source
2. WebSearch: `"{company name} technology stack"` → StackShare, engineering blogs, job postings
3. WebSearch: `"{company name} security breach OR CVE OR incident"` → relevant history
4. Merge discovered technologies into the technology list for mode-specific research below
5. Note any security incidents in the research brief for analyst context

---

**Technology Research:**

1. Parse architecture description for technologies (cloud providers, frameworks, databases,
   message queues, auth systems)
2. For each detected technology (max 5):
   - NVD lookup:
     ```bash
     bun run tools/nvd/client.ts "{tech}" --since=2023-01-01 --limit=5
     ```
   - WebSearch: `"{tech} security architecture best practices 2026"`
3. If compliance framework mentioned (HIPAA, SOC2, PCI-DSS, FedRAMP):
   - WebSearch: `"{tech} {compliance} requirements 2026"`
4. Write `research-brief.md` to output directory

**Research brief format:**

```markdown
# Research Brief
**Generated:** YYYY-MM-DD
**Technologies:** [list]
**CVEs Found:** [count by severity]
**Sources Consulted:** [count]

## Per-Technology Summary

### {Technology}
- **CVEs:**
  | ID | Severity | Description |
  |----|----------|-------------|
  | CVE-XXXX-XXXXX | HIGH | [description] |
- **Best Practices:** [key findings with sources]
- **Targeted Questions:** [questions derived from research]
```

**Expected output:** `research-brief.md` written to output directory
**On failure:** Log note and continue without research context

### Step 2c: Domain Selection

**Tool:** Direct conversation

Explain the five assessment domains and ask which to include:

- **Domain A: Architecture & Environment** (ALWAYS INCLUDED)
  - Architecture decomposition
  - Trust boundary analysis
  - Data flow mapping
  - Attack surface enumeration
  - STRIDE/PASTA threat modeling

- **Domain B: Security Practices** (optional)
  - SDLC security integration assessment
  - Secure coding standards evaluation
  - Vulnerability management process review
  - Security testing program assessment
  - Scored against OWASP SAMM / NIST SSDF baseline

- **Domain C: Patch Management** (optional)
  - Patch management process maturity
  - OS/Platform patching cadence
  - Application patching practices
  - Emergency patch procedures
  - Maturity scoring (1-5 per category)

- **Domain E: Supply Chain Security** (optional)
  - Software bill of materials (SBOM) management
  - Third-party dependency scanning and policy
  - Build system and CI/CD security
  - Code signing and artifact integrity
  - Vendor assessment process
  - SLSA attestation level (1–4)

Ask: "Domain A is included by default. Which additional domains would you like to include?
(Select any: Domain B - Security Practices, Domain C - Patch Management, Domain E - Supply
Chain Security)"

**Expected output:** Domain selection confirmed
**On failure:** Default to Domain A only

### Step 2d: Generate Questionnaires

**Applies:** Only if Domain B, C, or E selected

**Tool:** Read (templates), Write

For each selected optional domain, generate a questionnaire from the template and write it
to `private/input/sec-review/{project}/`.

**For Domain B:** Read `skills/sec-review/docs/security-practices-questionnaire.md`
and write to `private/input/sec-review/{project}/security-practices-questionnaire.md`

**For Domain C:** Read `skills/sec-review/docs/patch-assessment-questionnaire.md`
and write to `private/input/sec-review/{project}/patch-assessment-questionnaire.md`

**For Domain E:** Read `skills/sec-review/docs/supply-chain-questionnaire.md`
and write to `private/input/sec-review/{project}/supply-chain-questionnaire.md`

Instruct the user:
```
Please complete the questionnaire(s) at:
  private/input/sec-review/{project}/

Return here when complete to continue with Phase 2 (Analyze).
```

**Gate:** User confirms questionnaire completion OR no optional domains selected (no questionnaires needed)

**Expected output:** Questionnaires written and user instructed to complete them
**On failure:** If write fails, provide questionnaire inline for user to copy

### Step 3: Define Scope and Create Output Directory

**Tool:** Write
**Reference:** Output directory `private/output/sec-review/{project}-{date}/`

Create output directory and document scope:

```markdown
## Security Review Scope

**Date:** YYYY-MM-DD
**Effort:** THOROUGH

**Domains:**
- Domain A: Architecture & Environment (included)
- Domain B: Security Practices (included/excluded)
- Domain C: Patch Management (included/excluded)
- Domain E: Supply Chain Security (included/excluded)

### Context
[Describe the system]

### Scope
- In scope: [what will be reviewed]
- Out of scope: [what will NOT be reviewed]

### Requirements
- [Requirement 1]

### Compliance (if applicable)
- [Framework 1]
```

**Expected output:** scope.md written to output directory
**On failure:** If scope cannot be defined, ask user for clarification

### Step 4: Verify Readiness

**Tool:** Direct analysis

Confirm all prerequisites for Phase 2 are met:
- Architecture context gathered
- Domains confirmed
- Questionnaires provided to user (if B/C/E selected) and user confirmed completion
- Scope documented
- Output directory exists

**Expected output:** Readiness confirmed, completion checklist displayed to user
**On failure:** Loop back to the specific step that is incomplete

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → `private/output/sec-review/{project}-{date}/scope.md`
- `research-brief.md` → `private/output/sec-review/{project}-{date}/research-brief.md`
- `security-practices-questionnaire.md` → `private/input/sec-review/{project}/` (Domain B)
- `patch-assessment-questionnaire.md` → `private/input/sec-review/{project}/` (Domain C)
- `supply-chain-questionnaire.md` → `private/input/sec-review/{project}/` (Domain E)
- Output directory created at `private/output/sec-review/{project}-{date}/`

**Format:** Markdown scope document; research brief with per-technology CVE data

---

## NEXT

**On success:** → Proceed to Phase 2 (Analyze):

Load `skills/sec-review/phases/02-analyze.md` with:
- Context gathered in this phase
- Domain selection confirmed
- Output directory path
- research-brief.md content (if generated)

**On failure (missing context):** → Ask user for missing information, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Architecture context gathered (docs, IaC, or description)
- [ ] Automated research completed or non-blocking failures logged
- [ ] Domain selection confirmed (A always; B/C/E if chosen)
- [ ] Questionnaires generated and user instructed (if B/C/E selected)
- [ ] User confirmed questionnaire completion OR no optional domains selected
- [ ] Scope documented
- [ ] Output directory created
- [ ] Ready to proceed to Phase 2 (ANALYZE)

**Error recovery:**
- If context insufficient: Ask user for architecture documentation or diagrams
- If user has not completed questionnaires: Wait — do not advance to Phase 2
- If output directory creation fails: Check path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
