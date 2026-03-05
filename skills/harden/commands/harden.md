---
name: harden
description: Infrastructure hardening — validate or remediate system configuration against
  CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General benchmarks.
domain: harden
skill: harden
agent: engineer
model: sonnet
complexity: high
mode: single-agent
chain_position: first
---

# /harden — Infrastructure Hardening

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to engineer agent)

**Role:** Hardening command router. Confirm intent, parse mode, check for existing work, then
delegate to the engineer agent for the full 6-phase harden workflow.

**Note:** This command always routes to the harden phases. Two modes exist: `validate`
(non-destructive audit) and `remediate` (active fix guidance with executable scripts).

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/harden`

**Optional upfront (gathered during Phase 01 if not provided):**
- Target system identifier (hostname, container name, IP, etc.)
- Framework: `CIS Controls v8.1` | `NIST CSF 2.0` | `FedRAMP` | `ISO 27001` | `HIPAA` | `General`
- Mode: `validate` (default) | `remediate`

**Prerequisites:**
- User has invoked `/harden`
- For remediate mode: user acknowledges rollback prerequisites will be required

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's hardening request to the engineer agent for the full 6-phase harden
workflow.

**Success criteria:**
- Hardening request confirmed (not pentest, vuln-scan, or sec-review)
- Mode parsed and defaulted to validate if not specified
- Existing work checked
- Engineer agent delegated with target, mode, framework, and output path

**Failure criteria:**
- User actually needs pentest → Redirect to `/pentest`
- User actually needs vuln-scan → Redirect to `/vuln-scan`
- User actually needs architecture security review → Redirect to `/sec-review`

---

## METHODOLOGY

Hardening engagements are configuration-focused, not exploit-focused. Distinguish clearly:

- `/harden` — configuration audit/remediation against a framework benchmark
- `/pentest` — active exploitation testing of running services
- `/vuln-scan` — automated vulnerability scanning and CVE triage
- `/sec-review` — architecture threat modeling and design review

When mode is not specified, default to `validate`. Never assume `remediate` — it requires
explicit user intent because it generates executable scripts and requires rollback confirmation.

Check for existing work first. If `private/output/harden/` contains a matching directory,
the user may be resuming a prior engagement.

---

## EXECUTION

### Step 1: Confirm Intent

**Tool:** Direct analysis

Verify the user wants infrastructure hardening (configuration audit or remediation), not:
- Runtime exploit testing → `/pentest`
- Automated vulnerability scanning → `/vuln-scan`
- Architecture threat modeling → `/sec-review`
- GRC framework compliance mapping → `/compliance`

**Expected output:** Intent confirmed as infrastructure hardening
**On failure:** Redirect to appropriate command

### Step 2: Parse Mode

**Tool:** Direct analysis

Extract mode from user input:
- If user explicitly says `remediate` → mode = `remediate`
- If user says `validate` OR provides no mode → mode = `validate`
- If mode ambiguous → default to `validate`, inform user

Extract framework if provided. Extract target if provided. Both can be gathered in Phase 01.

**Expected output:** Mode set (validate or remediate), framework and target noted if present

### Step 3: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/harden/*`

Check if an output directory already exists for this target.

**Expected output:** Fresh start confirmed, or user asked whether to resume or start fresh
**On failure:** Default to fresh start

### Step 4: Delegate to Engineer Agent

**Tool:** Task delegation

```
Task(subagent_type="engineer", prompt="Execute harden skill.\n\nTarget: {target or TBD}\nMode: {validate|remediate}\nFramework: {framework or TBD}\n\nLoad skills/harden/phases/00-workflow.md\n\nOutput: private/output/harden/{target}-{YYYY-MM}/")
```

**Expected output:** Engineer agent begins workflow from Phase 00
**On failure:** If delegation fails, load `skills/harden/phases/00-workflow.md` directly

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to engineer agent (no files created by command itself)
- Output directory created by engineer agent at: `private/output/harden/{target}-{YYYY-MM}/`

**Final output (after workflow completes):**

```
private/output/harden/{target}-{YYYY-MM}/
├── scope.md
├── BASELINE.md
├── FINDINGS.md
├── REMEDIATION.md
├── CHANGE-LOG.md               (remediate mode only)
├── EXECUTIVE-SUMMARY.md
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

**On success:** → Delegate to engineer agent. Workflow handles all phases.

**On existing work found:** → Ask user if resuming or starting fresh. Load
`skills/harden/phases/00-workflow.md` accordingly.

**On wrong intent:** → STOP. Redirect to correct command with explanation.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User intent confirmed as infrastructure hardening
- [ ] Mode parsed (validate or remediate, default validate)
- [ ] Existing work check completed
- [ ] Engineer agent delegated (or workflow loaded directly)

**Error recovery:**
- If user needs pentest instead: Redirect to `/pentest`
- If user needs vuln-scan instead: Redirect to `/vuln-scan`
- If delegation fails: Load `skills/harden/phases/00-workflow.md` directly

---

## Usage

```bash
# Minimal — agent gathers framework, mode, and target during Phase 01
/harden

# With mode and target
/harden validate ubuntu-22.04 CIS Controls v8.1

# Active remediation with framework
/harden remediate nginx-server NIST CSF 2.0

# Long-form flags
/harden validate --target=k8s-cluster --framework=FedRAMP

# Remediate with HIPAA
/harden remediate --target=rhel9-host --framework=HIPAA
```

## When to Use

**Use /harden when:**
- Assessing a server or container against a hardening benchmark
- Preparing for FedRAMP, ISO 27001, or HIPAA audit
- Implementing CIS benchmarks on a new host
- Generating remediation scripts for configuration drift
- Validating hardening posture after infrastructure changes

**Don't use if:**
- Need architecture-level security review → `/sec-review`
- Need runtime exploit testing → `/pentest` or `/vuln-scan`
- Need GRC framework compliance mapping → `/compliance`

## Related Commands

- `/risk-assess` — Risk assessment and scoring
- `/incident` — Incident response workflow
- `/sec-review` — Architecture and threat modeling review
- `/pentest` — Active penetration testing
- `/vuln-scan` — Vulnerability scanning and triage

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
