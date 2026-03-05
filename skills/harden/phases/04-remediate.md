---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 4: REMEDIATE (Guidance or Executable Scripts)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Produce remediation output for each FAIL finding from Phase 03.
This phase is MODE-BRANCHED: validate mode produces detailed human-readable guidance;
remediate mode produces executable scripts with rollback commands and a CHANGE-LOG.md.

**Additional constraints:** This phase produces output but does NOT apply any changes.
Even in remediate mode, the agent generates scripts — it does not execute them. The user
applies the scripts. Rollback commands must be generated alongside every fix command.
Every script must include a prerequisite check and a verification step.

---

## INPUT CONTRACT

**Receives:**
- FINDINGS.md content (all FAIL controls with evidence, severity, priority)
- scope.md content (mode — validate or remediate, target OS, rollback prerequisites)
- Target OS and platform from BASELINE.md
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- FINDINGS.md exists in output directory
- Mode is known (validate or remediate) from scope.md

**Source:** `skills/harden/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce remediation output appropriate to the confirmed mode.

**[validate mode] Success criteria:**
- Each FAIL finding has step-by-step remediation guidance
- Guidance is detailed enough for a human to implement without further research
- No scripts, no CHANGE-LOG.md produced
- REMEDIATION.md written

**[remediate mode] Success criteria:**
- Each FAIL finding has an executable script (bash or PowerShell per target OS)
- Each script includes: prerequisite check, change action, verification step, rollback command
- Scripts are safe to apply in isolation (idempotent where possible)
- CHANGE-LOG.md produced with planned actions
- REMEDIATION.md written with all scripts inline

**Failure criteria:**
- No FAIL findings to remediate → Proceed to Phase 05 with note (REMEDIATION.md = "No findings")

---

## METHODOLOGY

**Mode is immutable in this phase.** Do not switch modes here. The mode was confirmed
in Phase 01 and recorded in scope.md. Produce the correct output type for that mode.

**[validate mode] Guidance principles:**
Guidance must be actionable without additional research. Include the specific commands
to run, the exact configuration values to set, and references to where configuration
lives on the target OS. Assume the reader is a competent engineer, not a framework expert.

**[remediate mode] Script principles:**
- Safety-first: check prerequisites before making changes
- Idempotent: running the script twice should not cause harm
- Verifiable: include a check after the change to confirm it worked
- Reversible: every change command has a paired rollback command
- Scoped: one script per finding — do not bundle unrelated changes
- Documented: each script has a header with the control ID, what it does, and what it expects

**Priority ordering.** Address findings in P0 → P1 → P2 → P3 order within REMEDIATION.md.

---

## EXECUTION

### Step 1: Load Mode from scope.md

**Tool:** Read

Read `private/output/harden/{target}-{YYYY-MM}/scope.md` and extract mode.
Read `private/output/harden/{target}-{YYYY-MM}/FINDINGS.md` and extract all FAIL findings.

Group findings by priority: P0 critical first, then P1, P2, P3.

**Expected output:** Mode confirmed, FAIL findings loaded and sorted by priority

---

### [validate mode] Steps 2V–4V

**Execute steps 2V through 4V when mode = validate. Skip steps 2R–4R.**

### Step 2V: Generate Remediation Guidance Per Finding

**Tool:** Direct analysis

For each FAIL finding (P0 first, then P1, P2, P3), produce detailed guidance:

```markdown
### {Control ID}: {Control Name}
**Severity:** {Critical|High|Medium|Low}
**Priority:** P{0-3}
**Evidence:** {from FINDINGS.md}

#### What to Fix
{1–3 sentence explanation of what is misconfigured and why it matters}

#### How to Fix

**Prerequisites:**
- {any conditions that must be true before applying this fix}
- {e.g., "Take a system snapshot before proceeding"}

**Steps:**
1. {Step 1 with exact command or config value}
   ```bash
   {command}
   ```
2. {Step 2}
   ```bash
   {command}
   ```
3. {Verification step — how to confirm the fix was applied}
   ```bash
   {verification command}
   # Expected output: {what should appear}
   ```

**Configuration file:** {path to config file if applicable}

**Reference:** {CIS Benchmark section | NIST 800-53 control | ISO control reference}
```

**Expected output:** Guidance written for every FAIL finding

### Step 3V: Write REMEDIATION.md (validate mode)

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/REMEDIATION.md`:

```markdown
# Remediation Guidance: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** validate
**Total Findings:** {N}
**Critical:** {N} | **High:** {N} | **Medium:** {N} | **Low:** {N}

---

> **VALIDATE MODE:** This document contains remediation GUIDANCE only.
> No changes have been made to the target system. Review each item and apply
> changes through your normal change management process.

---

## P0 — Critical (Immediate Action Required)

{guidance for each P0 finding}

---

## P1 — High (This Change Cycle)

{guidance for each P1 finding}

---

## P2 — Medium (Within 30 Days)

{guidance for each P2 finding}

---

## P3 — Low (Next Maintenance Cycle)

{guidance for each P3 finding}
```

### Step 4V: Skip CHANGE-LOG.md

**Validate mode does NOT produce CHANGE-LOG.md.** Do not create this file.

---

### [remediate mode] Steps 2R–4R

**Execute steps 2R through 4R when mode = remediate. Skip steps 2V–4V.**

### Step 2R: Generate Executable Script Per Finding

**Tool:** Direct analysis

For each FAIL finding (P0 first, then P1, P2, P3), produce an executable script.
Use bash for Linux targets. Use PowerShell for Windows targets.

**Bash script template (Linux):**

```bash
#!/usr/bin/env bash
# =============================================================================
# Hardening Script: {Control ID} — {Control Name}
# Framework: {framework}
# Target: {target}
# Generated: {YYYY-MM-DD}
# Priority: P{0-3} | Severity: {Critical|High|Medium|Low}
# =============================================================================
# WHAT THIS DOES:
#   {1–2 sentence description of the change}
#
# PREREQUISITES:
#   {list prerequisites}
#
# ROLLBACK:
#   Run the ROLLBACK COMMANDS section below to undo this change.
# =============================================================================

set -euo pipefail

echo "[PREREQ CHECK] {Control ID}: {Control Name}"

# --- Prerequisite Check ---
# Verify the system state before making changes

{prerequisite check commands — fail fast if preconditions not met}

if [ $? -ne 0 ]; then
  echo "[PREREQ FAIL] Prerequisite check failed. Aborting."
  exit 1
fi

echo "[PREREQ OK]"

# --- Backup Current State ---
BACKUP_FILE="/tmp/harden-backup-{control-id}-$(date +%Y%m%d%H%M%S)"
{backup command to capture current state — e.g., cp /etc/ssh/sshd_config $BACKUP_FILE}
echo "[BACKUP] Current state saved to: $BACKUP_FILE"

# --- Apply Change ---
echo "[APPLY] Applying fix for {Control ID}..."

{change commands}

echo "[APPLY] Done."

# --- Verify Change ---
echo "[VERIFY] Verifying fix for {Control ID}..."

{verification commands}

if [ $? -eq 0 ]; then
  echo "[VERIFY OK] {Control ID} fix verified successfully."
else
  echo "[VERIFY FAIL] Verification failed. Review changes and consult rollback commands."
  exit 1
fi

echo "[COMPLETE] {Control ID} remediation complete."
echo "[ROLLBACK] To undo: see ROLLBACK section in REMEDIATION.md"

# =============================================================================
# ROLLBACK COMMANDS
# Run these commands to undo the change made by this script.
# =============================================================================
# {rollback command 1}
# {rollback command 2}
# {service restart if needed}
# =============================================================================
```

**PowerShell script template (Windows):**

```powershell
# =============================================================================
# Hardening Script: {Control ID} — {Control Name}
# Framework: {framework}
# Target: {target}
# Generated: {YYYY-MM-DD}
# Priority: P{0-3} | Severity: {Critical|High|Medium|Low}
# =============================================================================
# WHAT THIS DOES:
#   {1-2 sentence description of the change}
#
# ROLLBACK:
#   Run ROLLBACK section below to undo.
# =============================================================================

$ErrorActionPreference = "Stop"

Write-Host "[PREREQ CHECK] {Control ID}: {Control Name}"

# --- Prerequisite Check ---
{prerequisite check}

# --- Backup Current State ---
$BackupPath = "C:\Temp\harden-backup-{control-id}-$(Get-Date -Format 'yyyyMMddHHmmss')"
{backup command}
Write-Host "[BACKUP] Saved to: $BackupPath"

# --- Apply Change ---
Write-Host "[APPLY] Applying fix for {Control ID}..."
{change commands}
Write-Host "[APPLY] Done."

# --- Verify Change ---
Write-Host "[VERIFY] Verifying..."
{verification}
Write-Host "[VERIFY OK] {Control ID} verified."

# =============================================================================
# ROLLBACK COMMANDS
# {rollback command}
# =============================================================================
```

**Expected output:** Executable script generated for every FAIL finding

### Step 3R: Write REMEDIATION.md (remediate mode)

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/REMEDIATION.md`:

```markdown
# Remediation Scripts: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** remediate
**Total Findings:** {N}
**Critical:** {N} | **High:** {N} | **Medium:** {N} | **Low:** {N}

---

> **REMEDIATE MODE:** This document contains EXECUTABLE SCRIPTS.
> Scripts have NOT been applied. Review each script, confirm rollback prerequisites
> are in place (see scope.md), and apply through your change management process.
> Apply P0 items first. Use CHANGE-LOG.md to track what was applied.

---

## P0 — Critical (Immediate Action Required)

### {Control ID}: {Control Name}

**Severity:** Critical | **Priority:** P0
**Evidence:** {from FINDINGS.md}

**What this fixes:** {1-2 sentence explanation}

**Rollback:** {brief rollback description — full commands in script below}

```bash
{full script}
```

{repeat for each P0 finding}

---

## P1 — High (This Change Cycle)

{scripts for each P1 finding}

---

## P2 — Medium (Within 30 Days)

{scripts for each P2 finding}

---

## P3 — Low (Next Maintenance Cycle)

{scripts for each P3 finding}
```

### Step 4R: Write CHANGE-LOG.md (remediate mode only)

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/CHANGE-LOG.md`:

```markdown
# Change Log: {target}

**Framework:** {framework}
**Mode:** remediate
**Generated:** {YYYY-MM-DD}

> This log tracks the planned and applied remediation actions for this engagement.
> Update the Status column as scripts are applied.

---

## Planned Changes

| Control ID | Control Name | Priority | Severity | Script Status | Applied By | Applied At | Verified |
|------------|-------------|----------|----------|---------------|------------|------------|---------|
| {id} | {name} | P0 | Critical | Pending | — | — | — |
| {id} | {name} | P1 | High | Pending | — | — | — |
| {id} | {name} | P2 | Medium | Pending | — | — | — |
| {id} | {name} | P3 | Low | Pending | — | — | — |

---

## Change Records

### {Control ID}: {Control Name}
- **Status:** Pending | Applied | Verified | Rolled Back
- **Applied by:** {name/system}
- **Applied at:** {timestamp}
- **Verified:** Yes/No
- **Notes:** {any deviations from script or issues encountered}

---

## Rollback Log

{Record here if any changes were rolled back}

| Control ID | Rolled Back By | Rolled Back At | Reason |
|------------|---------------|----------------|--------|
```

**Expected output:** CHANGE-LOG.md written to output directory

---

## OUTPUT CONTRACT

**Produces:**
- `REMEDIATION.md` → `private/output/harden/{target}-{YYYY-MM}/REMEDIATION.md`
- `CHANGE-LOG.md` → `private/output/harden/{target}-{YYYY-MM}/CHANGE-LOG.md` (remediate mode ONLY)

**Format:**
- validate mode: Markdown guidance document with step-by-step instructions per finding
- remediate mode: Markdown document with inline bash/PowerShell scripts per finding
  plus CHANGE-LOG.md tracking table

---

## NEXT

**On success:** → Proceed to Phase 5 (Deliver):

Load `skills/harden/phases/05-deliver.md` with:
- scope.md, BASELINE.md, FINDINGS.md, REMEDIATION.md
- Mode (for CHANGE-LOG.md reference in report)
- Output directory path

**On no FAIL findings:** → Proceed to Phase 5 with REMEDIATION.md noting "No findings
required remediation."

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Mode loaded from scope.md
- [ ] All FAIL findings addressed (guidance or scripts per mode)
- [ ] REMEDIATION.md written with findings addressed in P0→P3 order
- [ ] [validate mode] No CHANGE-LOG.md created
- [ ] [remediate mode] CHANGE-LOG.md created with all planned changes listed
- [ ] [remediate mode] Every script includes prerequisite check, change, verification, rollback
- [ ] Ready to proceed to Phase 5 (DELIVER)

**Error recovery:**
- If no FAIL findings: Write REMEDIATION.md with "No remediation required" note, proceed
- If script generation unclear: Generate guidance format for that finding, note in REMEDIATION.md
- If OS-specific commands unknown: Note uncertainty, provide generic POSIX commands

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
