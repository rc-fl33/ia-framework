---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Risk Assessment Workflow Orchestrator

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase risk assessment pipeline. Detect current state,
load the correct phase, and enforce gates between phases. All phases use the advisor agent.

**Additional constraints:** This is a single-agent, single-mode workflow. Mode: RISK-ASSESS.
There is no shortcut path — every invocation is a structured risk assessment. This workflow
has zero dependency on `skills/gap-analysis/` or `private/output/compliance/`.

---

## INPUT CONTRACT

**Receives:**
- User request and org name via `/risk-assess` command
- Optional: framework preference, asset descriptions, compliance drivers
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- User request available
- Org name known or will be gathered in Phase 01

**Source:** `skills/risk-assess/commands/risk-assess.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase risk assessment pipeline in order, enforcing gates between phases,
producing a complete risk register and treatment plan.

**Success criteria:**
- All 5 phases execute in order
- Gate criteria verified between each phase
- Deliverables produced in output directory
- User receives executive summary and full report at Phase 5

**Failure criteria:**
- Required inputs missing and user declines to provide → STOP
- Output directory unwritable → STOP with path guidance

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current phase.
This enables resume capability — if a prior run was interrupted, pick up where it left off.
Prior phase outputs are loaded as context for subsequent phases but are non-blocking.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase
until all criteria are met. If a gate fails, loop back to the failing step within that phase.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/risk-assess/{org}-{YYYY-MM}/*`

Check which deliverable files exist in the output directory:

```
IF no output directory exists                              → Load 01-scope.md
ELSE IF scope.md not present                               → Load 01-scope.md
ELSE IF ASSET-INVENTORY.md or THREAT-LANDSCAPE.md missing → Load 02-identify.md
ELSE IF RISK-ANALYSIS.md missing                           → Load 03-analyze.md
ELSE IF RISK-REGISTER.md missing                           → Load 04-prioritize.md
ELSE IF FULL-REPORT.md missing                             → Load 05-deliver.md
ELSE                                                       → Load 05-deliver.md (resume/refresh)
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

Read the phase file and load its instructions:

```
Phase 1 → skills/risk-assess/phases/01-scope.md
Phase 2 → skills/risk-assess/phases/02-identify.md
Phase 3 → skills/risk-assess/phases/03-analyze.md
Phase 4 → skills/risk-assess/phases/04-prioritize.md
Phase 5 → skills/risk-assess/phases/05-deliver.md
```

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps,
and CHECKPOINTS.

**Agent routing:** All phases use the advisor agent — execute directly, no re-delegation needed.

- Phase 1 (01-scope.md): `agent: advisor` — execute directly
- Phase 2 (02-identify.md): `agent: advisor` — execute directly
- Phase 3 (03-analyze.md): `agent: advisor` — execute directly
- Phase 4 (04-prioritize.md): `agent: advisor` — execute directly
- Phase 5 (05-deliver.md): `agent: advisor` — execute directly

**Expected output:** Phase deliverables produced in output directory

### Step 4: Verify Gate

Check that all exit criteria from the completed phase are met before advancing.

**Expected output:** Gate PASSED or gate FAILED with specific blocker

### Step 5: Show Checkpoint

Display phase completion to user:

```
PHASE {N} COMPLETE: {Phase Name}
Files: {list of output files created}
{Phase-specific metrics}
Gate: PASSED

→ Ready for Phase {N+1}: {Next Phase Name}
```

If gate fails:

```
PHASE {N} BLOCKED: {Phase Name}
Issue: {specific blocker}
Action: {what needs to be fixed}

→ Fix and retry Phase {N}
```

### Step 6: Advance or Stop

If gate passed → return to Step 2 with next phase.
If final phase (Phase 5) → workflow complete. Display final summary.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (no files created by workflow itself)
- All output managed by individual phases in `private/output/risk-assess/{org}-{YYYY-MM}/`

**Final output (after all 5 phases):**

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

**On all phases complete:** → Workflow finished. Display final summary to user.

**On gate failure:** → Loop back to failing step within current phase.

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-scope.md` | advisor | scope.md exists, framework selected | scope.md |
| 2 | `02-identify.md` | advisor | ASSET-INVENTORY.md + THREAT-LANDSCAPE.md exist | ASSET-INVENTORY.md, THREAT-LANDSCAPE.md |
| 3 | `03-analyze.md` | advisor | RISK-ANALYSIS.md exists with scored pairs | RISK-ANALYSIS.md |
| 4 | `04-prioritize.md` | advisor | RISK-REGISTER.md exists | RISK-REGISTER.md, RISK-TREATMENT-PLAN.md |
| 5 | `05-deliver.md` | advisor | FULL-REPORT.md exists | EXECUTIVE-SUMMARY.md, FULL-REPORT.md, metadata.json |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1 → 2 → 3 → 4 → 5
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint
5. **Mode is always RISK-ASSESS** — No branching to compliance or other skills
6. **Zero compliance dependency** — Do not read or reference `skills/gap-analysis/` at any point

---

## CHECKPOINTS

**Exit criteria (ALL must be true before workflow is complete):**
- [ ] scope.md exists with framework selection and asset scope defined
- [ ] ASSET-INVENTORY.md exists with categorized assets
- [ ] THREAT-LANDSCAPE.md exists with threat actor profiles
- [ ] RISK-ANALYSIS.md exists with likelihood × impact scores for all asset/threat pairs
- [ ] RISK-REGISTER.md exists with prioritized risks
- [ ] RISK-TREATMENT-PLAN.md exists with accept/mitigate/transfer/avoid decisions
- [ ] EXECUTIVE-SUMMARY.md exists (1-page format)
- [ ] FULL-REPORT.md exists with all findings consolidated
- [ ] metadata.json exists and reflects completed status

**Error recovery:**
- Phase gate fails → Re-execute that phase; do not skip forward
- Framework not supported → Proceed with General taxonomy, note in scope.md
- User declines asset categories → Accept partial scope; flag in RISK-REGISTER.md

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
