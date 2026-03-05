---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 5: RE-ASSESS (Post-Remediation Verification)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Verify the effectiveness of applied remediation. Re-collect baseline
data for all previously-failed controls, re-run the same control assessment, compare results
to the initial FINDINGS.md, and document the improvement delta. This phase closes the loop
on the remediation pipeline.

**Additional constraints:** This phase is non-destructive — read and observe only. Do not
modify the original FINDINGS.md or BASELINE.md; all re-assessment output goes to RE-BASELINE.md
and RE-FINDINGS.md. In remediate mode, confirm the user has applied scripts before proceeding.

---

## INPUT CONTRACT

**Receives:**
- FINDINGS.md (initial findings from Phase 03 — the baseline to compare against)
- REMEDIATION.md (scripts or guidance from Phase 04)
- CHANGE-LOG.md (if remediate mode — tracks which scripts were applied)
- scope.md (target, framework, mode, OS details)
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- REMEDIATION.md exists in output directory
- In remediate mode: user confirms remediation scripts have been applied
- In validate mode: user confirms manual changes have been made (or confirms re-assessment anyway)

**Source:** `skills/harden/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a post-remediation finding set and improvement comparison that validates
whether applied changes closed the identified gaps.

**Success criteria:**
- User confirmed remediation was applied (or re-assessment explicitly requested)
- RE-BASELINE.md produced with current system state for previously-failed controls
- RE-FINDINGS.md produced with updated Pass/Fail/NA status for all applicable controls
- IMPROVEMENT-SUMMARY.md produced comparing initial vs. post-remediation results
- Remaining failures documented with notes on why remediation did not resolve them

**Failure criteria:**
- User indicates no remediation was applied and declines re-assessment → Proceed to Phase 06 with note
- Target inaccessible for re-collection → Document limitation, proceed with available data

---

## METHODOLOGY

**Confirm before re-assessing.** In remediate mode, verify the user has actually applied
the scripts from REMEDIATION.md before collecting re-baseline data. Ask explicitly.

**Re-collect only failed controls.** The re-baseline focuses on the specific items that
failed in Phase 03. Passing controls from the initial assessment are assumed to remain passing
unless the remediation scripts could have affected them.

**Compare findings objectively.** A control that was FAIL and is now PASS is a confirmed
closure. A control that was FAIL and is still FAIL needs a note: was the script applied?
Did the script not work? Is additional remediation needed?

**Improvement delta is the key output.** The executive audience needs to see: "We went from
X failures to Y failures. Z items were resolved."

---

## EXECUTION

### Step 1: Confirm Remediation Applied

**Tool:** Direct conversation

Ask the user:

```
Before re-assessing, confirm:

[remediate mode]
  Have you applied the scripts from REMEDIATION.md?
  Please update CHANGE-LOG.md with which scripts were applied.
  If not all scripts were applied, note which ones — partial remediation will
  result in some controls remaining as FAIL.

[validate mode]
  Have you made the manual changes described in REMEDIATION.md?
  If not, you can still run re-assessment to confirm baseline state,
  but findings may not change significantly.

Proceed with re-assessment? [Y/n]
```

If user says No: note in output and skip to Phase 06 (Deliver) with original findings only.

**Expected output:** User confirms re-assessment can proceed

### Step 2: Read Initial Findings

**Tool:** Read

Read `private/output/harden/{target}-{YYYY-MM}/FINDINGS.md`.

Extract:
- All FAIL controls (control IDs, descriptions, severity, evidence)
- Total control counts from initial assessment (total, pass, fail, na)

**Expected output:** Initial FAIL list loaded for targeted re-collection

### Step 3: Re-Collect Baseline for Failed Controls

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

For each control that was FAIL in Phase 03, collect the current state of the specific
configuration item that was failing. Use the same commands that were used in Phase 02.

Focus only on the specific settings/files/configurations that were failing:

```
Example: If CIS 5.2 (MFA not enabled for admin accounts) was FAIL:
  Re-check: getent group sudo; pam-auth-update --status; cat /etc/pam.d/sshd | grep mfa
  Expected post-remediation output: MFA module present in PAM config

Example: If A.8.15 (audit logging not enabled) was FAIL:
  Re-check: systemctl is-active auditd; auditctl -l
  Expected post-remediation output: auditd active, audit rules loaded
```

If direct access is not available, provide the user with the specific re-check commands for
each failed control and ask them to run and paste the output.

**Expected output:** Current state collected for all previously-failed controls

### Step 4: Re-Assess Each Failed Control

**Tool:** Direct analysis

For each previously-failed control, assess the current state against the framework
requirement — same methodology as Phase 03.

For each control, determine:
- **Now PASS:** Remediation was successful
- **Still FAIL:** Remediation was not applied, partially applied, or did not resolve the issue
  - Note: Was script in CHANGE-LOG.md marked as Applied?
  - Note: Did verification step in the script pass when it was run?
- **NA:** Control is no longer applicable (unusual — document reason)

**Expected output:** Re-assessment status for every previously-failed control

### Step 5: Write RE-FINDINGS.md

**Tool:** Write
**Path:** `private/output/harden/{target}-{YYYY-MM}/RE-FINDINGS.md`

```markdown
# Re-Assessment Findings: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** {validate|remediate}
**Re-assessment conducted:** {YYYY-MM-DD hh:mm}

---

> **RE-ASSESSMENT:** This document shows post-remediation control status.
> Compare with FINDINGS.md (initial assessment) to see improvement delta.

---

## Re-Assessment Summary

| Metric | Initial Assessment | Post-Remediation |
|--------|-------------------|-----------------|
| Total controls | {n} | {n} |
| PASS | {n} ({%}) | {n} ({%}) |
| FAIL | {n} ({%}) | {n} ({%}) |
| N/A | {n} ({%}) | {n} ({%}) |
| **Net improvement** | — | **{+n} controls resolved** |

---

## Controls Resolved (FAIL → PASS)

| Control ID | Control Name | Severity (was) | Remediation Applied |
|------------|-------------|----------------|---------------------|
| {id} | {name} | Critical/High/Medium/Low | {script/action from CHANGE-LOG} |

---

## Controls Still Failing

| Control ID | Control Name | Severity | Current Evidence | Remediation Note |
|------------|-------------|----------|------------------|-----------------|
| {id} | {name} | {severity} | {current state} | {why still failing} |

---

## Control-by-Control Re-Assessment Detail

### {Control ID}: {Control Name}

**Initial Status:** FAIL
**Post-Remediation Status:** PASS / FAIL
**Severity (initial):** Critical / High / Medium / Low

**Pre-remediation evidence:**
{evidence from FINDINGS.md}

**Post-remediation evidence:**
{current collected state}

**Remediation applied:** {Yes (script ID from CHANGE-LOG) / No / Partial}

**Verification result:** {PASS/FAIL with specific output}

**Notes:** {any relevant context — e.g., "service required restart", "config required reload"}

---

{...repeat for all previously-failed controls...}
```

**Expected output:** RE-FINDINGS.md written

### Step 6: Write IMPROVEMENT-SUMMARY.md

**Tool:** Write
**Path:** `private/output/harden/{target}-{YYYY-MM}/IMPROVEMENT-SUMMARY.md`

```markdown
# Improvement Summary: {target}

**Framework:** {framework}
**Initial Assessment Date:** {date from FINDINGS.md}
**Re-Assessment Date:** {today}

---

## Overall Improvement

| | Initial | Post-Remediation | Change |
|---|---------|-----------------|--------|
| FAIL controls | {n} | {n} | **-{n} resolved** |
| PASS controls | {n} | {n} | **+{n} passing** |
| Risk score* | {initial} | {post} | |

*Risk score = (Critical × 4 + High × 3 + Medium × 2 + Low × 1) — lower is better

---

## Resolved by Severity

| Severity | Initial FAIL | Resolved | Remaining |
|----------|-------------|---------|-----------|
| Critical | {n} | {n} | {n} |
| High | {n} | {n} | {n} |
| Medium | {n} | {n} | {n} |
| Low | {n} | {n} | {n} |

---

## Remaining Risks

{List any controls that are still failing with brief reason}

| Control | Severity | Reason Still Failing | Recommended Next Step |
|---------|----------|---------------------|----------------------|
| {id} | {severity} | {reason} | {action} |

---

## Remediation Effectiveness

- **Scripts applied:** {n}/{total} from CHANGE-LOG.md
- **Scripts verified successful:** {n}
- **Issues encountered during application:** {list if any}

---

## Conclusion

{2-3 sentence summary of the remediation campaign results, what was achieved, and what
remains. Suitable for including in the final report executive section.}
```

**Expected output:** IMPROVEMENT-SUMMARY.md written

---

## OUTPUT CONTRACT

**Produces:**
- `RE-FINDINGS.md` → `private/output/harden/{target}-{YYYY-MM}/RE-FINDINGS.md`
- `IMPROVEMENT-SUMMARY.md` → `private/output/harden/{target}-{YYYY-MM}/IMPROVEMENT-SUMMARY.md`

**Format:** Markdown with before/after comparison tables and control-by-control re-assessment detail

---

## NEXT

**On success:** → Proceed to Phase 6 (Deliver):

Load `skills/harden/phases/06-deliver.md` with:
- All phase outputs (scope.md, BASELINE.md, FINDINGS.md, REMEDIATION.md, RE-FINDINGS.md, IMPROVEMENT-SUMMARY.md)
- Mode (validate or remediate)
- Output directory path

**On re-assessment skipped:** → Proceed directly to Phase 6 with note that re-assessment was not conducted.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User confirmed remediation was applied (or re-assessment explicitly skipped)
- [ ] RE-BASELINE data collected for all previously-failed controls
- [ ] RE-FINDINGS.md written with current Pass/Fail/NA for all controls
- [ ] IMPROVEMENT-SUMMARY.md written with before/after comparison
- [ ] Remaining failures documented with remediation notes
- [ ] Ready to proceed to Phase 6 (DELIVER)

**Error recovery:**
- User declines re-assessment: Skip to Phase 6, note in IMPROVEMENT-SUMMARY.md that re-assessment not performed
- Target inaccessible: Ask user to run re-check commands; wait for output before proceeding
- Some scripts not applied: Re-assess with available data; note partial application in IMPROVEMENT-SUMMARY.md

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
