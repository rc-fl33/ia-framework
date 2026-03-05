---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: SCOPE (Framework, Mode, Target, Rollback Prerequisites)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Establish the engagement scope. Select framework, confirm mode
(validate or remediate), identify target system(s), and — for remediate mode — confirm
rollback prerequisites before proceeding. This phase produces the engagement contract
that all subsequent phases depend on.

**Additional constraints:** Do not begin configuration collection in this phase. Focus
entirely on understanding the target, selecting the framework, confirming mode, and
documenting rollback prerequisites if remediate mode. If mode is remediate and rollback
prerequisites cannot be confirmed, STOP — do not proceed.

---

## INPUT CONTRACT

**Receives:**
- Mode from workflow: `validate` | `remediate`
- Optional: target system identifier from command invocation
- Optional: framework name from command invocation
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- Engineer agent is loaded
- Mode is known (default validate)

**Source:** `skills/harden/phases/00-workflow.md`

---

## OBJECTIVE

**Goal:** Define the hardening engagement. Confirm target, select framework, record mode,
and for remediate mode, confirm rollback prerequisites before any collection begins.

**Success criteria:**
- Target system identified and described
- Framework selected from supported list
- Mode confirmed (validate or remediate)
- For remediate mode: rollback prerequisites confirmed
- scope.md written to output directory
- metadata.json initial entry written

**Failure criteria:**
- No target identified and user declines to provide → STOP
- Remediate mode selected but rollback prerequisites cannot be confirmed → STOP

---

## METHODOLOGY

**Scope before collection.** Rushing to collect configuration data without a clear
framework and target leads to unfocused findings. A well-scoped engagement with the
right framework produces actionable results.

**Mode determines risk.** Validate mode is risk-free — clarify this with the user.
Remediate mode generates scripts that will modify system configuration — confirm rollback
prerequisites before proceeding, without exception.

**Framework selection is binding.** The framework selected in this phase drives the
control list in Phase 02 and the assessment table in Phase 03. Pick the one that best
matches the target's regulatory environment or organizational policy.

---

## EXECUTION

### Step 1: Identify Target System

**Tool:** Direct conversation

Gather target system details:
- Hostname or IP address
- Operating system and version (e.g., Ubuntu 22.04, RHEL 9, Windows Server 2022)
- Platform type: bare metal | VM | container | cloud instance | Kubernetes node
- Role: web server | database | CI/CD runner | bastion host | general-purpose | other
- Access method: SSH | local | WinRM | API
- Environment: production | staging | development

If the target was provided in the command invocation, confirm and expand the details.

**Expected output:** Target system identified with OS, platform, role, and access method
**On failure:** Ask user for the above details; do not proceed without a target

### Step 2: Select Framework

**Tool:** Direct conversation

Present the supported frameworks and ask the user to select one. If a framework was
provided in the command invocation, confirm it.

```
Supported hardening frameworks:

1. CIS Controls v8.1
   18 control groups, Implementation Groups (IG1/IG2/IG3)
   OS-specific benchmarks available for Linux, Windows, macOS, containers
   Best for: organizations needing prescriptive, OS-level hardening benchmarks

2. CIS Benchmarks (Platform-Specific)
   Platform hardening baselines: Docker, Ubuntu 22.04/24.04, AWS, Azure, GKE, Kubernetes
   Technical configuration checklists specific to each platform
   Loaded from: standards/frameworks/cis-benchmarks/{platform}/
   Best for: platform-specific hardening against CIS benchmark requirements
   Note: Choose this when you need OS/platform-level configuration hardening,
   not the high-level CIS Controls v8.1 framework

3. NIST CSF 2.0
   6 functions as hardening lens: Govern, Identify, Protect, Detect, Respond, Recover
   Risk-based approach, maps to NIST SP 800-53
   Best for: organizations using NIST as their primary risk framework

4. FedRAMP
   NIST SP 800-53 Rev 5 controls, Low/Moderate/High impact baselines
   US federal cloud authorization requirements
   Best for: federal contractors, cloud service providers seeking FedRAMP authorization

5. ISO 27001
   Annex A controls mapped to hardening tasks
   International standard, 93 controls across 4 themes
   Best for: organizations pursuing ISO 27001 certification

6. HIPAA
   Technical safeguards (45 CFR §164.312) and physical safeguards
   Healthcare-specific requirements for ePHI protection
   Best for: healthcare organizations, covered entities, business associates

7. General
   CIS-inspired hardening checklist, OS-agnostic
   Covers authentication, patching, logging, network hardening, service minimization
   Best for: quick posture check without a specific regulatory driver
```

**Expected output:** Framework selected from the list above
**On failure:** Default to General if user cannot decide; document the default choice

### Step 3: Confirm Mode

**Tool:** Direct conversation

If mode was provided in the command invocation, confirm it with the user. Explain the
difference clearly:

```
Modes:

validate (default)
  Non-destructive. Runs read and observe operations only.
  Enumerates current configuration, assesses against framework controls.
  Produces FINDINGS.md with Pass/Fail/NA and detailed remediation guidance per finding.
  No scripts generated. Nothing changes on the target.
  No rollback plan required.

remediate
  Active. Generates executable remediation scripts for each failed control.
  Each script includes: prerequisite check, change action, verification step, rollback command.
  Produces REMEDIATION.md with inline scripts and CHANGE-LOG.md as audit trail.
  Requires rollback prerequisites confirmation before proceeding (see Step 4).
```

**Expected output:** Mode confirmed (validate or remediate)

### Step 4: Rollback Prerequisites (remediate mode only)

**Applies:** remediate mode ONLY. Skip this step for validate mode.

**Tool:** Direct conversation

Before proceeding in remediate mode, confirm the following prerequisites with the user.
Do not proceed without confirmation.

```
REMEDIATE MODE PREREQUISITES

Before generating remediation scripts, confirm:

Backup Strategy:
  [ ] System snapshot or backup exists and is verified restorable
  [ ] Backup location documented: ___________
  [ ] Last backup timestamp: ___________

Change Window:
  [ ] Change window approved: ___________
  [ ] Maintenance window start: ___________
  [ ] Rollback deadline (if issues arise): ___________

Approval:
  [ ] Change approved by: ___________
  [ ] Approval reference/ticket: ___________

Rollback Plan:
  [ ] Rollback procedure documented: ___________
  [ ] Person responsible for rollback: ___________
  [ ] Escalation contact: ___________
```

Ask the user to confirm each item. Record responses in scope.md.

**Gate:** ALL prerequisites confirmed OR user explicitly accepts risk in writing
**On failure:** STOP. Do not proceed to Phase 02 in remediate mode without this confirmation.

**Expected output:** Rollback prerequisites documented and confirmed

### Step 5: Create Output Directory and Write scope.md

**Tool:** Bash (mkdir), Write

Create the output directory and write scope.md:

```bash
mkdir -p private/output/harden/{target}-{YYYY-MM}
```

Write `private/output/harden/{target}-{YYYY-MM}/scope.md`:

```markdown
# Harden Scope

**Date:** {YYYY-MM-DD}
**Target:** {hostname/IP}
**OS:** {OS and version}
**Platform:** {bare metal|VM|container|cloud instance|Kubernetes node}
**Role:** {role}
**Access Method:** {SSH|local|WinRM|API}
**Environment:** {production|staging|development}
**Framework:** {selected framework}
**Mode:** {validate|remediate}

## Framework Rationale

{Why this framework was selected}

## In Scope

- {system description}
- {services/components to be assessed}

## Out of Scope

- {what will NOT be assessed}

## Rollback Prerequisites (remediate mode only)

{Rollback prerequisites from Step 4, or N/A for validate mode}

### Backup
- Strategy: {backup strategy}
- Location: {backup location}
- Last verified: {timestamp}

### Change Window
- Approved window: {window}
- Rollback deadline: {deadline}

### Approval
- Approved by: {approver}
- Reference: {ticket/reference}

### Rollback Plan
- Procedure: {procedure}
- Responsible party: {person}
- Escalation: {contact}
```

**Expected output:** scope.md written to output directory

### Step 6: Write metadata.json Initial Entry

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/metadata.json`:

```json
{
  "target": "{hostname/IP}",
  "os": "{OS and version}",
  "platform": "{platform type}",
  "framework": "{selected framework}",
  "mode": "{validate|remediate}",
  "environment": "{production|staging|development}",
  "engagement_start": "{YYYY-MM-DD}",
  "phases_completed": ["scope"],
  "phase_timestamps": {
    "scope": "{YYYY-MM-DDTHH:MM:SSZ}"
  },
  "findings_summary": {
    "total": 0,
    "pass": 0,
    "fail": 0,
    "na": 0,
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  }
}
```

**Expected output:** metadata.json written to output directory

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → `private/output/harden/{target}-{YYYY-MM}/scope.md`
- `metadata.json` → `private/output/harden/{target}-{YYYY-MM}/metadata.json` (initial entry)
- Output directory created at `private/output/harden/{target}-{YYYY-MM}/`

**Format:** Markdown scope document; JSON metadata file

---

## NEXT

**On success:** → Proceed to Phase 2 (Baseline):

Load `skills/harden/phases/02-baseline.md` with:
- Target details from scope.md
- Framework selected
- Mode confirmed
- Output directory path

**On failure (remediate prerequisites not confirmed):** → STOP. Explain to user that
remediate mode requires rollback prerequisites before proceeding. Offer to switch to
validate mode instead.

**On failure (no target):** → Ask user for target details, retry Step 1.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Target system identified (OS, platform, role, access method)
- [ ] Framework selected from supported list
- [ ] Mode confirmed (validate or remediate)
- [ ] For remediate mode: all rollback prerequisites confirmed
- [ ] scope.md written to output directory
- [ ] metadata.json initial entry written
- [ ] Ready to proceed to Phase 2 (BASELINE)

**Error recovery:**
- If target not available: Ask user for system details, do not proceed
- If remediate mode selected but no rollback plan: STOP, offer to switch to validate
- If output directory creation fails: Check path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
