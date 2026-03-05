---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Harden Workflow Orchestrator

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 6-phase harden pipeline. Detect current state,
load the correct phase, propagate mode throughout, and enforce gates between phases.
All phases use the engineer agent.

**Additional constraints:** This workflow is MODE-AWARE. The mode (validate or remediate)
recorded in scope.md/metadata.json must be loaded at startup and passed to every phase.
Mode cannot change mid-engagement without starting a new engagement.

---

## INPUT CONTRACT

**Receives:**
- Target system identifier (from command invocation or to be gathered in Phase 01)
- Mode: `validate` | `remediate` (default: validate)
- Framework: one of CIS Controls v8.1 | NIST CSF 2.0 | FedRAMP | ISO 27001 | HIPAA | General
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- Engineer agent is loaded
- Target, mode, and framework may be gathered in Phase 01 if not provided upfront

**Source:** `skills/harden/commands/harden.md`

---

## OBJECTIVE

**Goal:** Execute the 6-phase harden pipeline in order, enforcing gates between phases,
producing hardening assessment deliverables appropriate to the selected mode.

**Success criteria:**
- All 6 phases execute in order with correct mode propagation
- Gate criteria verified between each phase
- Deliverables produced in output directory
- User receives summary at Phase 6

**Failure criteria:**
- Required inputs missing and user declines to provide → STOP
- Output directory unwritable → STOP with path guidance
- Rollback prerequisites not confirmed in remediate mode → STOP at Phase 01

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current
phase. This enables resume capability — if a previous run was interrupted, pick up where
it left off.

**Mode propagation:** Load mode from scope.md or metadata.json at startup. Every phase
receives the mode. Do not re-prompt for mode unless no scope.md exists.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next
phase until all criteria are met. If a gate fails, loop back to the failing step within
that phase.

---

## EXECUTION

### Step 1: Load Mode

**Tool:** Read (if scope.md exists), Direct analysis (if fresh start)

At startup, determine mode:
1. If `private/output/harden/{target}-{YYYY-MM}/scope.md` exists → Read mode from scope.md
2. If `private/output/harden/{target}-{YYYY-MM}/metadata.json` exists → Read mode from metadata.json
3. If neither exists → mode came from command invocation (validate default)

Record mode in memory. Pass to every subsequent phase load.

**Expected output:** Mode loaded (validate or remediate)
**On failure:** Default to validate mode, log note

### Step 2: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/harden/{target}-{YYYY-MM}/*`

Check which deliverable files exist:

```
IF no output directory exists                        → Load 01-scope.md
ELSE IF scope.md not present                         → Load 01-scope.md
ELSE IF BASELINE.md missing                          → Load 02-baseline.md
ELSE IF FINDINGS.md missing                          → Load 03-assess.md
ELSE IF REMEDIATION.md missing                       → Load 04-remediate.md
ELSE IF RE-FINDINGS.md missing AND mode=remediate    → Load 05-re-assess.md
ELSE IF FULL-REPORT.md missing                       → Load 06-deliver.md
ELSE                                                 → Load 06-deliver.md (resume/finalize)
```

**Note on re-assess:** Phase 5 (re-assess) is only auto-triggered in remediate mode.
In validate mode, re-assess is optional — proceed to Phase 6 unless user explicitly
requests re-assessment. If user requests re-assessment in validate mode, load 05-re-assess.md.

**Expected output:** Current phase identified
**On failure:** Default to Phase 01 (fresh start)

### Step 3: Load Phase Prompt

**Tool:** Read
**Path:** `skills/harden/phases/0{N}-{phase}.md`

Load the correct phase file. Pass the following context to the phase:
- Mode: `validate` or `remediate`
- Target: system identifier
- Framework: selected hardening framework
- Output directory path

**Expected output:** Phase instructions loaded, execution begins

### Step 4: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps,
and CHECKPOINTS.

**Agent routing:** All phases use the engineer agent — execute directly, no delegation needed.

- Phase 1 (01-scope.md): `agent: engineer` — execute directly
- Phase 2 (02-baseline.md): `agent: engineer` — execute directly
- Phase 3 (03-assess.md): `agent: engineer` — execute directly
- Phase 4 (04-remediate.md): `agent: engineer` — execute directly, mode-branched
- Phase 5 (05-re-assess.md): `agent: engineer` — execute directly (remediate mode or user request)
- Phase 6 (06-deliver.md): `agent: engineer` — execute directly

**Expected output:** Phase deliverables produced

### Step 5: Verify Gate

Check that all exit criteria from the completed phase are met before advancing.

**Expected output:** Gate PASSED or gate FAILED with specific blocker

### Step 6: Show Checkpoint

Display phase completion to user:

```
PHASE {N} COMPLETE: {Phase Name}
Mode: {validate|remediate}
Framework: {framework}
Files: {list of output files created}
Gate: PASSED

→ Ready for Phase {N+1}: {Next Phase Name}
```

**If gate fails:**
```
PHASE {N} BLOCKED: {Phase Name}
Mode: {validate|remediate}
Issue: {specific blocker}
Action: {what needs to be fixed}

→ Fix and retry Phase {N}
```

### Step 7: Advance or Stop

If gate passed → return to Step 3 with next phase.
If final phase → workflow complete.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (no files created by workflow itself)
- All output managed by individual phases in
  `private/output/harden/{target}-{YYYY-MM}/`

**Final output (after all phases):**

```
private/output/harden/{target}-{YYYY-MM}/
├── scope.md
├── BASELINE.md
├── FINDINGS.md
├── REMEDIATION.md
├── CHANGE-LOG.md               (remediate mode only)
├── RE-FINDINGS.md              (remediate mode or user-requested re-assess)
├── IMPROVEMENT-SUMMARY.md      (remediate mode or user-requested re-assess)
├── EXECUTIVE-SUMMARY.md
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

**On all phases complete:** → Workflow finished. Display final summary to user.

**On gate failure:** → Loop back to failing step within current phase.

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-scope.md` | engineer | scope.md exists, mode confirmed | scope.md, metadata.json (initial) |
| 2 | `02-baseline.md` | engineer | BASELINE.md exists | BASELINE.md |
| 3 | `03-assess.md` | engineer | FINDINGS.md exists | FINDINGS.md |
| 4 | `04-remediate.md` | engineer | REMEDIATION.md exists | REMEDIATION.md, CHANGE-LOG.md (remediate only) |
| 5 | `05-re-assess.md` | engineer | RE-FINDINGS.md exists (remediate) or user-requested | RE-FINDINGS.md, IMPROVEMENT-SUMMARY.md |
| 6 | `06-deliver.md` | engineer | FULL-REPORT.md exists | EXECUTIVE-SUMMARY.md, FULL-REPORT.md, metadata.json (final) |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→(5)→6 (Phase 5 conditional)
2. **ALWAYS propagate mode** — validate or remediate must be known at every phase
3. **ALWAYS show checkpoint** — User must see phase completion summary
4. **Files stay in output directory** — Never move between folders
5. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint
6. **CHANGE-LOG.md is remediate-only** — Never create it in validate mode

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
