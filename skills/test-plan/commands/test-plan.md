---
name: test-plan
description: Generate skill-agnostic test plans with test cases for security assessments
domain: security
skill: test-plan
agent: security
model: sonnet
complexity: medium
mode: single-agent
chain_position: first
---

# /test-plan — Test Plan Generation

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to security agent)

**Role:** Test plan command router. Confirm intent, check for existing work, then delegate to
the security agent for the full 5-phase test-plan workflow.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/test-plan`

**Required:**
- Scope document or assessment context in at least one form:
  - Scope document from pentest/sec-review/code-review
  - System description with target systems
  - List of domains/technologies to test

**Recommended (significantly improves output quality):**
- Project name — used for output directory naming
- Assessment type — pentest, security review, code review, vuln-scan
- Target systems — URLs, IPs, APIs, mobile apps, cloud accounts
- Specific domains — web, API, mobile, network, cloud, etc.

**Optional:**
- Compliance frameworks — OWASP, CIS, NIST, PCI-DSS
- Client-specific concerns or threat intelligence
- Time constraints or priorities

**Prerequisites:**
- User has invoked `/test-plan`
- Scope context available (or user will provide during intake)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's test plan request to the security agent for the full
5-phase test-plan workflow.

**Success criteria:**
- Test plan request confirmed
- Security agent delegated with project context
- Workflow loaded from `skills/test-plan/phases/00-workflow.md`

**Failure criteria:**
- No scope context available and user declines to provide → STOP

---

## METHODOLOGY

Test plans are comprehensive planning documents. Do not attempt to shortcut the process.
The 5-phase workflow ensures thorough coverage: scope gathering, methodology selection,
test case generation, documentation, and delivery.

Check for existing work first. If `private/output/test-plan/` contains a directory matching
this project, the user may be resuming a prior test plan. Ask before overwriting.

---

## EXECUTION

### Step 1: Confirm Intent

**Tool:** Direct analysis

Verify the user wants a test plan (not an actual assessment execution).

**Expected output:** Intent confirmed as test plan generation
**On failure:** Clarify with user

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/test-plan/*`

Check if output directory already exists for this project.

**Expected output:** Fresh start or resume decision
**On failure:** Default to fresh start

### Step 3: Delegate to Security Agent

**Tool:** Task delegation

```typescript
Task(subagent_type="security", prompt="Execute test-plan skill.\n\nProject: {project}\nAssessment Type: {type}\nScope: {scope}\n\nLoad skills/test-plan/phases/00-workflow.md\n\nOutput: private/output/test-plan/{project}-{YYYY-MM-DD}/")
```

**Expected output:** Security agent begins workflow
**On failure:** If delegation fails, load workflow directly

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to security agent (no files created by command itself)
- Output directory created at: `private/output/test-plan/{project}-{date}/`

**Final output (after workflow completes):**
```
private/output/test-plan/{project}-{date}/
├── scope.md
├── methodology-selection.md
├── TEST-PLAN.md
├── test-cases/
│   ├── TC001-{domain}-{test}.md
│   ├── TC002-{domain}-{test}.md
│   └── ...
└── metadata.json
```

---

## NEXT

**On success:** → Delegate to security agent. Workflow handles all phases.

**On existing work found:** → Ask user if resuming or starting fresh. Load
`skills/test-plan/phases/00-workflow.md` accordingly.

**On failure:** → STOP. Guide user on what scope context to provide.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User intent confirmed as test plan generation
- [ ] Existing work check completed
- [ ] Security agent delegated (or workflow loaded directly)

**Error recovery:**
- If no scope context: Ask user to provide scope document, system description, or target list
- If delegation fails: Load `skills/test-plan/phases/00-workflow.md` directly

---

## Usage

```bash
# Minimal — agent gathers scope during intake
/test-plan

# With project context (recommended)
/test-plan Project: customer-portal, Type: pentest, Targets: https://acme.com

# From existing scope document
/test-plan Project: api-audit, Source: pentest/scope-2026-03-01

# With specific domains
/test-plan Project: mobile-app, Type: security-review, Domains: mobile-android, api

# With compliance context
/test-plan Project: fintech-api, Type: pentest, Compliance: OWASP, PCI-DSS
```

**The more context you provide upfront, the fewer questions during intake and the more
targeted the test plan.**

## When to Use

**Use /test-plan when:**
- Generate test cases for penetration testing
- Plan security assessment coverage
- Document testing procedures for security reviews
- Create test plans for code reviews
- Outline vulnerability scanning scope
- Plan red team engagements

**Don't use if:**
- Need actual testing/execution → `/pentest`, `/vuln-scan`
- Need quick security guidance → `/advisory`
- Need code-level review → `/code-review`
- Need architecture review → `/sec-review`

## Related Commands

- `/pentest` — Execute penetration testing
- `/sec-review` — Security architecture review
- `/code-review` — Code-level security review
- `/advisory` — Quick security guidance
- `/vuln-scan` — Automated vulnerability scanning

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
