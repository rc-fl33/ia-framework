---
name: risk-assess
description: Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring,
  and risk register.
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
complexity: high
mode: single-agent
chain_position: first
---

# /risk-assess — Structured Risk Assessment

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to advisor agent)

**Role:** Risk assessment command router. Confirm intent, check for existing work, then delegate to
the advisor agent for the full 5-phase risk-assess workflow.

**Note:** This command always routes to the risk-assess phases. There is no "quick" path —
risk assessments are inherently structured and thorough.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/risk-assess`

**Optional context (improves output quality):**
- Org name — used for output directory naming and report headers
- Framework preference — NIST CSF 2.0, ISO 27001, PCI DSS, HIPAA, FedRAMP, AIUC-1, or General
- System or asset descriptions
- Compliance or regulatory drivers

**Prerequisites:**
- User has invoked `/risk-assess`
- Org name available (or will be gathered during Phase 01)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's risk assessment request to the advisor agent for the full
5-phase risk-assess workflow.

**Success criteria:**
- Risk assessment request confirmed
- Advisor agent delegated with org context
- Workflow loaded from `skills/risk-assess/phases/00-workflow.md`

**Failure criteria:**
- User actually needs compliance gap assessment → Redirect to `/compliance`
- User actually needs system hardening → Redirect to `/harden`
- User actually needs architecture security review → Redirect to `/sec-review`

---

## METHODOLOGY

Risk assessments are structured engagements. The 5-phase workflow ensures thorough coverage:
scope definition, asset/threat identification, likelihood/impact analysis, risk register
assembly, and executive delivery.

Check for existing work first. If `private/output/risk-assess/` contains a directory matching
this org, the user may be resuming a prior assessment. The 00-workflow.md state detection
handles resume logic — no files are overwritten without user confirmation.

Framework selection happens during Phase 01. If the user specifies a framework at invocation,
pass it to the advisor agent as context. If not specified, Phase 01 presents the 7 options.

---

## EXECUTION

### Step 1: Confirm Intent

**Tool:** Direct analysis

Verify the user wants a risk assessment (not compliance gap analysis, code review, or
architecture security review).

**Expected output:** Intent confirmed as risk assessment
**On failure:** Redirect to appropriate command (`/compliance`, `/sec-review`, `/harden`)

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/risk-assess/*`

Check if an output directory already exists for this org.

**Expected output:** Fresh start confirmed, or resume decision presented to user
**On failure:** Default to fresh start

### Step 3: Delegate to Advisor Agent

**Tool:** Task delegation

```
Task(subagent_type="advisor", prompt="Execute risk-assess skill.\n\nOrg: {org}\n\nLoad skills/risk-assess/phases/00-workflow.md\n\nOutput: private/output/risk-assess/{org}-{YYYY-MM}/")
```

**Expected output:** Advisor agent begins workflow from 00-workflow.md
**On failure:** If delegation fails, load `skills/risk-assess/phases/00-workflow.md` directly

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to advisor agent (no files created by command itself)
- Output directory created at: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Final output (after workflow completes):**

```
private/output/risk-assess/{org}-{YYYY-MM}/
├── scope.md                    ← Phase 01
├── ASSET-INVENTORY.md          ← Phase 02
├── THREAT-LANDSCAPE.md         ← Phase 02
├── RISK-ANALYSIS.md            ← Phase 03
├── RISK-REGISTER.md            ← Phase 04
├── RISK-TREATMENT-PLAN.md      ← Phase 04
├── EXECUTIVE-SUMMARY.md        ← Phase 05
├── FULL-REPORT.md              ← Phase 05
└── metadata.json               ← Phase 05
```

---

## NEXT

**On success:** → Delegate to advisor agent. Workflow handles all phases.

**On existing work found:** → Ask user if resuming or starting fresh. Load
`skills/risk-assess/phases/00-workflow.md` — state detection handles routing.

**On failure:** → STOP. Guide user on what org context or framework to provide.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User intent confirmed as risk assessment
- [ ] Existing work check completed
- [ ] Advisor agent delegated (or workflow loaded directly)

**Error recovery:**
- If user needs compliance gap analysis: Redirect to `/compliance`
- If user needs hardening: Redirect to `/harden`
- If delegation fails: Load `skills/risk-assess/phases/00-workflow.md` directly

---

## Usage

```bash
# Minimal — advisor agent gathers context during Phase 01
/risk-assess

# With org and framework specified upfront
/risk-assess Org: Acme Corp, Framework: NIST CSF 2.0

# Regulation-driven
/risk-assess Healthcare org, HIPAA required
```

## When to Use

**Use /risk-assess when:**
- Building a risk register for an organization or system
- Performing formal risk analysis required by regulation (HIPAA, FedRAMP)
- Preparing a board-level risk briefing or audit response
- Identifying and prioritizing risks before a security program investment
- Selecting treatment strategies (mitigate, accept, transfer, avoid) with owners

**Don't use if:**
- Need compliance gap assessment → `/compliance`
- Need system hardening → `/harden`
- Need architecture security review → `/sec-review`
- Need incident response → `/incident`

## Related Commands

- `/compliance` — Framework compliance gap assessment
- `/harden` — System hardening and remediation
- `/sec-review` — Architecture and security practices review
- `/incident` — Incident response workflow

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
