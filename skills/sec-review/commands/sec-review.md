---
name: sec-review
description: Comprehensive security review with STRIDE/PASTA threat modeling, security practices, and patch management
domain: security
skill: sec-review
agent: security
model: sonnet
complexity: high
mode: single-agent
chain_position: first
---

# /sec-review — Comprehensive Security Review

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to security agent)

**Role:** Security review command router. Confirm intent, check for existing work, then delegate to
the security agent for the full 5-phase sec-review workflow.

**Note:** This command always routes to the sec-review phases. There is no "quick" path —
security reviews are inherently THOROUGH.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/sec-review`

**Required:**
- Architecture documentation in at least one form:
  - Architecture diagrams or design documents
  - Infrastructure-as-code files (Terraform, CloudFormation, Kubernetes manifests)
  - Written system description with component list
  - README or wiki with architecture overview

**Recommended (significantly improves output quality):**
- Company name — triggers automated company context research
- Company URL — enables technology fingerprinting
- Project name — used for output directory naming and report headers
- System type — web app, cloud infrastructure, microservices, mobile backend, IoT, enterprise

**Optional:**
- Compliance requirements — HIPAA, SOC2, PCI-DSS, FedRAMP, ISO 27001
- Threat modeling preference — STRIDE (default), PASTA, Attack Trees
- Domain selection — which assessment domains to include (B, C, E, or any combination)

**Prerequisites:**
- User has invoked `/sec-review`
- Architecture documentation available (or user will provide during intake)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's security review request to the security agent for the full
5-phase sec-review workflow.

**Success criteria:**
- Security review request confirmed
- Security agent delegated with project context
- Workflow loaded from `skills/sec-review/phases/00-workflow.md`

**Failure criteria:**
- User actually needs code-review → Redirect to `/code-review`
- User actually needs quick guidance → Redirect to `/advisory`
- No architecture documentation available and user declines to provide → STOP

---

## METHODOLOGY

Security reviews are comprehensive engagements. Do not attempt to shortcut the process. The
5-phase workflow ensures thorough coverage: context gathering, decomposition, threat modeling,
recommendations, and professional documentation.

Check for existing work first. If `private/output/sec-review/` contains a directory matching
this project, the user may be resuming a prior review. Ask before overwriting.

---

## EXECUTION

### Step 1: Confirm Intent

**Tool:** Direct analysis

Verify the user wants a security review (not code review or quick guidance).

**Expected output:** Intent confirmed as security review
**On failure:** Redirect to appropriate command (`/code-review`, `/advisory`)

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/sec-review/*`

Check if output directory already exists for this project.

**Expected output:** Fresh start or resume decision
**On failure:** Default to fresh start

### Step 3: Delegate to Security Agent

**Tool:** Task delegation

```typescript
Task(subagent_type="security", prompt="Execute sec-review skill.\n\nProject: {project}\n\nLoad skills/sec-review/phases/00-workflow.md\n\nOutput: private/output/sec-review/{project}-{YYYY-MM-DD}/")
```

**Expected output:** Security agent begins workflow
**On failure:** If delegation fails, load workflow directly

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to security agent (no files created by command itself)
- Output directory created at: `private/output/sec-review/{project}-{date}/`

**Final output (after workflow completes):**
```
private/output/sec-review/{project}-{date}/
├── research-brief.md
├── scope.md
├── EXECUTIVE-SUMMARY.md
├── ARCHITECTURE-ANALYSIS.md
├── THREAT-MODEL.md
├── FINDINGS.md
├── PRACTICES-REVIEW.md          (Domain B, if selected)
├── PATCH-ASSESSMENT.md          (Domain C, if selected)
├── SUPPLY-CHAIN-REVIEW.md       (Domain E, if selected)
├── GAP-ANALYSIS.md
├── RECOMMENDATIONS.md
├── diagrams/
│   ├── arch-overview.mmd/.svg/.png
│   ├── trust-boundaries.mmd/.svg/.png
│   ├── data-flow.mmd/.svg/.png
│   ├── attack-surface.mmd/.svg/.png
│   ├── threat-model.mmd/.svg/.png
│   └── network-topology.mmd/.svg/.png
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

**On success:** → Delegate to security agent. Workflow handles all phases.

**On existing work found:** → Ask user if resuming or starting fresh. Load
`skills/sec-review/phases/00-workflow.md` accordingly.

**On failure:** → STOP. Guide user on what architecture documentation to provide.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User intent confirmed as security review
- [ ] Existing work check completed
- [ ] Security agent delegated (or workflow loaded directly)

**Error recovery:**
- If user needs code review instead: Redirect to `/code-review`
- If no architecture docs: Ask user to provide documentation, diagrams, or system description
- If delegation fails: Load `skills/sec-review/phases/00-workflow.md` directly

---

## Usage

```bash
# Minimal — agent gathers everything during intake
/sec-review

# With project context (recommended)
/sec-review Project: customer-portal, Company: Acme Corp, URL: https://acme.com

# With architecture description
/sec-review React frontend, Django REST backend, PostgreSQL, Redis cache, AWS ECS with ALB

# With compliance context
/sec-review Fintech payment platform, PCI-DSS required, AWS multi-region
```

**The more context you provide upfront, the fewer questions during intake and the more
targeted the threat model.**

## When to Use

**Use /sec-review when:**
- Review system architecture for security vulnerabilities
- Perform threat modeling (STRIDE, PASTA, Attack Trees)
- Assess security practices against OWASP SAMM / NIST SSDF
- Evaluate patch management maturity
- Validate defense-in-depth controls
- Review cloud architecture security (AWS, Azure, GCP)
- Design review before implementation

**Don't use if:**
- Need code-level review → `/code-review`
- Need configuration hardening → `/harden`
- Need runtime testing → `/pentest` or `/vuln-scan`
- Need quick security guidance → `/advisory`

## Related Commands

- `/code-review` — Code-level security review
- `/advisory` — Quick security guidance
- `/pentest` — Runtime security testing
- `/compliance` — Framework compliance assessment

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
