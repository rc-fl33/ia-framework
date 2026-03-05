---
domain: sec-review
skill: sec-review
agent: security
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 2: ANALYZE (Security Analysis — 5 Domains)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Perform security analysis across selected domains. Domain A is always
executed. Domains B (Security Practices), C (Patch Management), and E (Supply Chain) are executed
if selected during intake. Every finding must have evidence. Every threat must map to a component
and trust boundary.

**Additional constraints:** Do not generate recommendations in this phase — focus entirely on
analysis and findings. For each domain, produce the corresponding analysis file.

---

## INPUT CONTRACT

**Receives:**
- Architecture context and scope from Phase 1
- Domain selection (A always; B, C, and/or E if selected)
- `research-brief.md` (if generated during Phase 1 — optional, non-blocking)
- Completed questionnaires at `private/input/sec-review/{project}/` (Domains B/C/E)
- Output directory: `private/output/sec-review/{project}-{date}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Context and scope documented
- Questionnaires completed (for Domain B, C, and/or E)
- Research brief available (optional — absence is not a blocker)

**Source:** `skills/sec-review/phases/01-intake.md`

---

## OBJECTIVE

**Goal:** Complete security analysis for all selected domains, producing documented findings
with evidence.

**Success criteria:**
- Domain A: Architecture decomposed, threat model complete with STRIDE, PASTA, Attack Trees, or ZTA
- Domain B (if selected): Security practices scored against OWASP SAMM / NIST SSDF baseline, API security assessed if APIs present
- Domain C (if selected): Patch management maturity scored (1-5 per category)
- Domain E (if selected): Supply chain security scored (1-5 maturity per area)

**Failure criteria:**
- Missing context prevents analysis → Return to Phase 1
- Questionnaires not completed for B/C → Wait, do not analyze without data
- Analysis scope too broad → Prioritize critical/high areas first

---

## METHODOLOGY

**Phase 2 is the analytical core.** The quality of recommendations (Phase 3) depends entirely
on the thoroughness of analysis here. Take time to be comprehensive.

**Domain A is structural.** Follow a strict decomposition sequence: components first, then
trust boundaries, then data flows, then attack surface, then threat model.

**Domains B, C, and E are evidence-based.** Read the completed questionnaires and any provided
policy documents before scoring. Never score without evidence.

---

## EXECUTION

### Step 0: Load Research Context

**Tool:** Read

Check if `research-brief.md` exists in the output directory from Phase 1.

```
IF research-brief.md exists:
  → Load it and use CVE data + best practices to prioritize analysis
  → Prioritize components with known CVEs in threat model
  → Reference specific CVEs in STRIDE/PASTA analysis

IF research-brief.md does NOT exist:
  → Proceed without research context — this is non-blocking
```

**Expected output:** Research context loaded (if available)
**On failure:** Continue without research context

---

### Step 1a: Architecture Decomposition (Domain A)

**Tool:** Read (architecture docs), direct analysis

Break down architecture into components:
- Identify all components and their roles
- Identify technology stack for each component
- Map component interactions and dependencies
- Document external dependencies and third-party services

**Expected output:** Component inventory documented
**On failure:** If documentation insufficient, return to Phase 1 for more context

**Container/Kubernetes Sub-Analysis (auto-triggered):**

```
IF containers or Kubernetes detected in component inventory:
  Additionally assess:
  - Pod Security Standards (Restricted/Baseline/Privileged enforcement)
  - RBAC configuration (principle of least privilege for service accounts)
  - Network policies (default-deny, namespace isolation)
  - Image security (base image provenance, vulnerability scanning, no :latest tags)
  - Secrets management (no secrets in env vars, use mounted secrets or external vault)
  - Runtime security (privileged containers, hostNetwork, hostPID usage)
  Document findings in ARCHITECTURE-ANALYSIS.md under a "Container Security" subsection
```

**IaC Security Analysis (auto-triggered):**

```
IF IaC files provided (Terraform, CloudFormation, Kubernetes manifests, ARM templates):
  Check for common misconfigurations:
  Terraform/CloudFormation:
  - Open security groups (0.0.0.0/0 inbound on sensitive ports)
  - Public S3 buckets / storage containers with public access
  - Encryption at rest not enabled (EBS, RDS, S3)
  - Overly permissive IAM roles (*, AdministratorAccess)
  - Logging not enabled (CloudTrail, VPC Flow Logs)
  Kubernetes:
  - Privileged pod specs (privileged: true)
  - No resource limits (CPU/memory)
  - hostNetwork or hostPID enabled
  - automountServiceAccountToken not disabled where unnecessary
  - No network policies defined
  Document findings in ARCHITECTURE-ANALYSIS.md under an "IaC Security" subsection
```

### Step 1b: Trust Boundary Analysis (Domain A)

**Tool:** Direct analysis

Identify where trust levels change:
- Network boundaries (public internet, DMZ, internal network, data tier)
- Authentication gates (unauthenticated vs authenticated zones)
- Privilege boundaries (user vs admin, tenant isolation)
- External integrations (third-party APIs, SaaS services)

For each boundary, document:
- What crosses the boundary
- How crossing is authenticated/authorized
- What validation occurs

**Expected output:** Trust boundary inventory documented

### Step 1c: Data Flow Mapping (Domain A)

**Tool:** Direct analysis

Map how data moves through the system:
- Identify sensitive data types (PII, credentials, financial, health)
- Trace data from ingestion to storage to egress
- Document encryption in transit (TLS versions, cipher suites)
- Document encryption at rest (key management, algorithms)
- Identify data residency and retention boundaries

**Expected output:** Data flow map documented

### Step 1d: Attack Surface Enumeration (Domain A)

**Tool:** Direct analysis

Identify all entry points:
- External-facing APIs and interfaces
- User-facing applications
- Network services (ports, protocols)
- Integration points (webhooks, callbacks, event streams)
- Administrative interfaces
- CI/CD pipeline access

For each entry point, assess:
- Exposure level (public, partner, internal, admin)
- Authentication requirements
- Rate limiting and abuse controls

**Expected output:** Attack surface inventory documented

### Step 1e: Threat Modeling (Domain A)

**Tool:** Direct analysis, WebSearch (for threat intelligence)

Select methodology based on scope or user preference:

| Methodology | Best For | Key Questions |
|-------------|----------|---------------|
| **STRIDE** | General systems | Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation |
| **PASTA** | Risk-centric | What attackers want, how they would get it |
| **Attack Trees** | Specific threats | Visual attack path representation |
| **ZTA** | Modern architectures | Is every request verified? Is least-privilege enforced? Is blast radius minimized? |

For ZTA methodology (NIST SP 800-207): evaluate each component against three ZTA principles:
(1) verify explicitly — all requests authenticated and authorized regardless of network location;
(2) use least privilege — time-limited, just-enough access with adaptive policy;
(3) assume breach — minimize blast radius, segment access, verify end-to-end encryption.

Apply methodology to each component crossing a trust boundary. For each identified threat:

| Field | Value |
|-------|-------|
| Threat Category | STRIDE letter or PASTA stage |
| Affected Component(s) | Component name(s) |
| Attack Vector | How an attacker would execute |
| Likelihood | High / Medium / Low |
| Impact | High / Medium / Low |
| Existing Mitigations | Controls already in place |

Write `ARCHITECTURE-ANALYSIS.md` and `THREAT-MODEL.md` to the output directory.

**Expected output:** ARCHITECTURE-ANALYSIS.md and THREAT-MODEL.md written
**On failure:** If documentation insufficient, return to Phase 1

### Step 1f: Security Practices Analysis (Domain B, if selected)

**Tool:** Read (questionnaire + policy docs), WebSearch (OWASP SAMM, NIST SSDF)

Prerequisites: Read completed `security-practices-questionnaire.md` from
`private/input/sec-review/{project}/`. If not present, STOP and notify user.

**API Security (auto-included when applicable):**

If APIs are present in the architecture (detected in Phase 1 or questionnaire responses),
include OWASP API Security Top 10 (2023) assessment as part of this domain's analysis:
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

Document API findings in PRACTICES-REVIEW.md under an "API Security" subsection.

Analysis areas:
1. **SDLC Security Integration** — Are security gates present in the development lifecycle?
2. **Secure Coding Standards** — Are coding guidelines defined and enforced?
3. **Vulnerability Management** — Is there a triage process with SLAs by severity?
4. **Dependency Management** — Are SCA tools in use with update cadence defined?
5. **Security Testing** — Are SAST, DAST, and pentest programs operational?

Score each area against OWASP SAMM maturity levels (0-3) or NIST SSDF practices:
- Document current state vs expected baseline
- Identify gaps with specific evidence from questionnaire
- Note any missing policies or undefined processes

Write `PRACTICES-REVIEW.md` to the output directory.

**Expected output:** PRACTICES-REVIEW.md written
**On failure:** If questionnaire is incomplete, note gaps and score what is available

### Step 1g: Patch Management Analysis (Domain C, if selected)

**Tool:** Read (questionnaire + policy docs)

Prerequisites: Read completed `patch-assessment-questionnaire.md` from
`private/input/sec-review/{project}/`. If not present, STOP and notify user.

Score each category on a 1-5 maturity scale:
- 1: Ad-hoc / No formal process
- 2: Documented but inconsistently applied
- 3: Defined and consistently applied
- 4: Measured and managed
- 5: Optimizing with continuous improvement

Categories to score:
| Category | What to Assess |
|----------|----------------|
| **Process** | Patch policy exists, testing before deployment, rollback defined |
| **OS/Platform** | Cadence for servers, desktops, containers, cloud services |
| **Application** | Third-party apps, custom app deployments, database patching |
| **Emergency** | Out-of-cycle process, time-to-deploy critical patches, comms plan |
| **Governance** | Executive ownership, reporting, compliance evidence |

Write `PATCH-ASSESSMENT.md` to the output directory.

**Expected output:** PATCH-ASSESSMENT.md written
**On failure:** If questionnaire is incomplete, note gaps and score what is available

### Step 1h: Supply Chain Security Analysis (Domain E, if selected)

**Tool:** Read (questionnaire + policy docs), WebSearch (SLSA, NIST SSDF supply chain)

Prerequisites: Read completed `supply-chain-questionnaire.md` from
`private/input/sec-review/{project}/`.

Assess supply chain security across five areas:

| Area | What to Assess |
|------|----------------|
| **SBOM** | Is an SBOM produced? Format (SPDX/CycloneDX)? Consumed by security tooling? |
| **Dependencies** | SCA tooling in use? Dependency pinning? License policy? Vuln SLAs? |
| **Build Integrity** | CI/CD isolation? Secrets in build? Artifact signing? Reproducible builds? |
| **Vendor Risk** | Third-party assessment process? Vendor SLAs for security incidents? |
| **SLSA Attestation** | Current SLSA level (1-4)? Build provenance attestations? |

Score each area on a 1-5 maturity scale:
- 1: Ad-hoc / No formal process
- 2: Documented but inconsistently applied
- 3: Defined and consistently applied
- 4: Measured and managed
- 5: Optimizing with continuous improvement

Map findings to:
- NIST SSDF (PS.3, PS.4 — Produce Well-Secured Software)
- NIST CSF ID.SC (Supply Chain Risk Management)
- CIS Control 16 (Application Software Security)
- SLSA framework level recommendations

Write `SUPPLY-CHAIN-REVIEW.md` to the output directory.

**Expected output:** SUPPLY-CHAIN-REVIEW.md written
**On failure:** If questionnaire is incomplete, note gaps and score what is available

### Step 2: Write Analysis Output

**Tool:** Write

Verify all required files are written:

| Domain | Files Created |
|--------|---------------|
| A (always) | `ARCHITECTURE-ANALYSIS.md`, `THREAT-MODEL.md` |
| B (if selected) | `PRACTICES-REVIEW.md` |
| C (if selected) | `PATCH-ASSESSMENT.md` |
| E (if selected) | `SUPPLY-CHAIN-REVIEW.md` |

Also write each finding to its own directory under `findings/`:

```
{output-dir}/
  findings/
    F001-missing-mfa/
      finding.md        ← one finding per file using the template format
      screenshots/      ← architecture evidence, screenshots, excerpts
        evidence-1.png
```

**Template:** `skills/sec-review/docs/finding-template.md`

**Naming:** `F{NNN}-{slug}` — zero-padded 3-digit counter + lowercase hyphenated title
(30 char max slug). Examples: `F001-missing-mfa`, `F002-overly-permissive-iam`.

**Minimum required fields per finding:**

```markdown
### Finding 1: [Title]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**Domain:** A | B | C | E
**STRIDE:** S | T | R | I | D | E
**CWE:** CWE-XXX
**OWASP:** [Category if applicable]
**NIST CSF:** [Function.Category]
**Likelihood:** High | Medium | Low
**Impact:** High | Medium | Low

**WHAT:**
[What architectural weakness or control gap exists]

**WHY:**
[Impact and attack scenario — what can an attacker achieve?]

**REMEDIATION:**
[Specific architectural or configuration fix]

**STATUS:** Open
**DISCOVERED:** YYYY-MM-DD
```

After writing all individual finding files, generate `FINDINGS.md` by concatenating them
in order — this is consumed by Phase 3 for recommendations.

**Expected output:** Individual finding files in `findings/F*/finding.md`, consolidated FINDINGS.md
**On failure:** Report error and retry

---

## OUTPUT CONTRACT

**Produces:**
- `ARCHITECTURE-ANALYSIS.md` → `private/output/sec-review/{project}-{date}/`
- `THREAT-MODEL.md` → `private/output/sec-review/{project}-{date}/`
- `findings/F{NNN}-{slug}/finding.md` → per-finding files in `private/output/sec-review/{project}-{date}/findings/`
- `findings/F{NNN}-{slug}/screenshots/` → evidence directory per finding (populated as needed)
- `FINDINGS.md` → consolidated view (concatenation of per-finding files) at `private/output/sec-review/{project}-{date}/`
- `PRACTICES-REVIEW.md` → `private/output/sec-review/{project}-{date}/` (Domain B)
- `PATCH-ASSESSMENT.md` → `private/output/sec-review/{project}-{date}/` (Domain C)
- `SUPPLY-CHAIN-REVIEW.md` → `private/output/sec-review/{project}-{date}/` (Domain E)

**Format:** Analysis documents with evidence, STRIDE/PASTA/ZTA threat tables, maturity scores

---

## NEXT

**On success:** → Proceed to Phase 3 (Recommend):

Load `skills/sec-review/phases/03-recommend.md` with:
- Analysis output files from this phase
- Domain selection
- Scope from Phase 1
- Output directory path

**On incomplete analysis:** → Loop back to the incomplete analysis step within this phase

**On missing context:** → Return to Phase 1 to gather additional information

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Domain A: Architecture decomposition complete (Steps 1a-1e)
- [ ] Domain A: ARCHITECTURE-ANALYSIS.md written
- [ ] Domain A: THREAT-MODEL.md written
- [ ] Domain A: Per-finding files written to `findings/F{NNN}-{slug}/finding.md`
- [ ] Domain A: FINDINGS.md written (concatenation of per-finding files)
- [ ] Domain B: PRACTICES-REVIEW.md written (if Domain B selected)
- [ ] Domain C: PATCH-ASSESSMENT.md written (if Domain C selected)
- [ ] Domain E: SUPPLY-CHAIN-REVIEW.md written (if Domain E selected)
- [ ] Ready to proceed to Phase 3 (RECOMMEND)

**Error recovery:**
- If missing context: Return to Phase 1 for additional information
- If questionnaire not completed: Wait for user to complete before running Domain B/C/E
- If unfamiliar architecture: Research similar systems with WebSearch before modeling

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
