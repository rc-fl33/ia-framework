---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: medium
chain_position: first
---

# Incident Workflow Orchestrator

## IDENTITY

**Agent:** Determined by mode — `security` (active/tabletop) or `advisor` (review). Set at
command layer before this file is loaded. This workflow executes inside the already-selected agent.

**Phase-specific role:** Orchestrate the 5-phase incident response pipeline. Detect current
state from output files, load the correct phase, enforce gates, and propagate mode context
to every phase.

**Critical:** Load mode from `metadata.json` if it exists in the output directory. Mode
drives both agent behavior and phase branching throughout the workflow.

---

## INPUT CONTRACT

**Receives:**
- Mode: `active` | `tabletop` | `review` (from command layer or metadata.json)
- Incident ID and output directory path
- Optional: framework hint, context gathered during command step

**Prerequisites:**
- Mode established (from invocation or metadata.json)
- Output directory path known

**Source:** `skills/incident/commands/incident.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase incident pipeline in order, enforcing gates, propagating mode
context, and producing the complete set of mode-appropriate deliverables.

**Success criteria:**
- Mode loaded from metadata.json or passed from command layer
- All 5 phases execute in order
- Gate criteria verified between each phase
- Mode-appropriate deliverables produced in output directory
- User receives summary at Phase 05

**Failure criteria:**
- Mode cannot be determined and user declines to specify → STOP, ask for clarification
- Output directory unwritable → STOP with path guidance

---

## METHODOLOGY

**State detection:** Check which deliverable files exist in the output directory to determine
current phase. This enables resume capability — if a prior run was interrupted, pick up where
it left off.

**Mode propagation:** Mode must be known before any phase executes. If metadata.json exists,
read mode from it. If not, use mode from command layer. Write mode to metadata.json in Phase 01.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance until all criteria
for the current phase are met. If a gate fails, loop back to the failing step within that phase.

---

## EXECUTION

### Step 1: Load Mode

**Tool:** Read (if metadata.json exists), direct context (if passed from command)

IF `metadata.json` exists in the output directory:
- Read it and extract `mode` field
- Use this mode for all subsequent phase branching

ELSE:
- Use mode passed from command layer (active/tabletop/review)
- Mode will be written to metadata.json in Phase 01

**Expected output:** Mode confirmed (active, tabletop, or review)
**On failure:** Ask user which mode before proceeding

---

### Step 2: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/incident/{incident-id}-{YYYY-MM}/*`

Check which deliverable files exist:

```
IF no output directory exists                         → Load 01-intake.md
ELSE IF intake.md not present                         → Load 01-intake.md
ELSE IF RESPONSE-LOG.md missing                       → Load 02-respond.md
ELSE IF COMMUNICATIONS.md missing                     → Load 03-communicate.md
ELSE IF LESSONS-LEARNED.md missing                    → Load 04-recover.md
ELSE IF INCIDENT-REPORT.md missing                    → Load 05-deliver.md
ELSE                                                  → Load 05-deliver.md (resume/finalize)
```

Note on mode-dependent files: TIMELINE.md (active/review) and SCENARIO.md (tabletop) are
produced by Phase 02. The gate check is RESPONSE-LOG.md, which all modes produce — this
ensures the state detection works regardless of mode.

**Expected output:** Current phase identified
**On failure:** Default to Phase 01 (fresh start)

---

### Step 3: Load Phase Prompt

**Tool:** Read
**File:** `skills/incident/phases/0{N}-{phase}.md`

Load the identified phase file. The phase file contains mode-branched execution blocks
(`[active]`, `[tabletop]`, `[review]`). Execute only the block matching the current mode.

**Expected output:** Phase instructions loaded, execution begins

---

### Step 4: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps,
and CHECKPOINTS. Execute only the mode-appropriate blocks.

**Agent is already scoped — no delegation needed within phases.**

- Phase 01 (01-intake.md): Gather context, classify severity, select framework, write metadata.json
- Phase 02 (02-respond.md): Core response execution, mode-branched
- Phase 03 (03-communicate.md): Internal and regulatory communications
- Phase 04 (04-recover.md): Recovery, RTO/RPO, lessons learned
- Phase 05 (05-deliver.md): Final report, action items

**Expected output:** Phase deliverables produced in output directory

---

### Step 5: Verify Gate

Check that all exit criteria from the completed phase are met before advancing.

**Expected output:** Gate PASSED or gate FAILED with specific blocker

---

### Step 6: Show Checkpoint

Display phase completion to user:

```
PHASE {N} COMPLETE: {Phase Name}
Mode: {active|tabletop|review}
Files: {list of output files created}
Gate: PASSED

→ Ready for Phase {N+1}: {Next Phase Name}
```

If gate fails:
```
PHASE {N} BLOCKED: {Phase Name}
Mode: {active|tabletop|review}
Issue: {specific blocker}
Action: {what needs to be fixed}

→ Fix and retry Phase {N}
```

---

### Step 7: Advance or Stop

If gate passed → return to Step 3 with next phase number.
If final phase (Phase 05) → workflow complete, display final summary.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (no files created by workflow itself)
- All output managed by individual phases in `private/output/incident/{incident-id}-{YYYY-MM}/`

**Final output (after all 5 phases):**

```
private/output/incident/{incident-id}-{YYYY-MM}/
├── intake.md                   (Phase 01 — all modes)
├── TIMELINE.md                 (Phase 02 — active/review)
├── SCENARIO.md                 (Phase 02 — tabletop)
├── RESPONSE-LOG.md             (Phase 02 — all modes)
├── COMMUNICATIONS.md           (Phase 03 — all modes)
├── LESSONS-LEARNED.md          (Phase 04 — all modes)
├── RECOVERY-PLAN.md            (Phase 04 — active/review)
├── INCIDENT-REPORT.md          (Phase 05 — all modes)
├── ACTION-ITEMS.md             (Phase 05 — all modes)
└── metadata.json               (Phase 01 — updated throughout)
```

---

## NEXT

**On all phases complete:** Workflow finished. Display final summary with file list and key findings.

**On gate failure:** Loop back to failing step within current phase.

---

## Phase Reference

| Phase | File | Agent | Gate Condition | Mode-Dependent Output |
|-------|------|-------|---------------|----------------------|
| 01 | `01-intake.md` | security/advisor | intake.md + metadata.json exist | None |
| 02 | `02-respond.md` | security/advisor | RESPONSE-LOG.md exists | TIMELINE.md (active/review) or SCENARIO.md (tabletop) |
| 03 | `03-communicate.md` | security/advisor | COMMUNICATIONS.md exists | None |
| 04 | `04-recover.md` | security/advisor | LESSONS-LEARNED.md exists | RECOVERY-PLAN.md (active/review only) |
| 05 | `05-deliver.md` | security/advisor | INCIDENT-REPORT.md exists | None |

---

## Critical Rules

1. **Mode first** — Load or confirm mode before executing any phase content
2. **Never skip phases** — Execute in order 01 → 02 → 03 → 04 → 05
3. **Always show checkpoint** — User must see phase completion summary after each phase
4. **Files stay in output directory** — Never move or copy between directories
5. **Gate on RESPONSE-LOG.md for Phase 02** — Mode-independent gate avoids branching complexity
6. **metadata.json is the source of truth** — Mode, framework, and timestamps all live there

---

## CHECKPOINTS

**Exit criteria (ALL must be true before workflow is complete):**
- [ ] intake.md exists with incident classification, mode, and severity confirmed
- [ ] metadata.json exists and reflects mode, framework, timestamps
- [ ] RESPONSE-LOG.md exists with containment, eradication, and recovery actions documented
- [ ] Mode-specific output exists: TIMELINE.md (active/review) or SCENARIO.md (tabletop)
- [ ] COMMUNICATIONS.md exists with notifications drafted and review flags applied
- [ ] LESSONS-LEARNED.md exists with root cause and corrective actions
- [ ] RECOVERY-PLAN.md exists (active/review modes only)
- [ ] INCIDENT-REPORT.md exists with full narrative
- [ ] ACTION-ITEMS.md exists with owners, due dates, and priorities

**Error recovery:**
- Mode not confirmed at intake → Prompt user before executing any phase
- Phase gate fails → Re-execute that phase; never skip forward
- Framework-specific notification deadline triggered → Escalate to legal immediately

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
