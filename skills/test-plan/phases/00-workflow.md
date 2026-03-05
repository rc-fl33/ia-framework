---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Test Plan Workflow Orchestrator

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase test plan pipeline. Detect current state,
load the correct phase, and enforce gates between phases. All phases use the security agent.

**Additional constraints:** This is a single-agent, single-mode workflow. Mode: TEST-PLAN.
There is no ad-hoc branching — every invocation generates a complete test plan.

---

## INPUT CONTRACT

**Receives:**
- User request for test plan generation via `/test-plan` command
- Project name and output directory path
- Optional: assessment type, scope document, target systems, domains

**Prerequisites:**
- User request available (scope context or system description)

**Source:** `skills/test-plan/commands/test-plan.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase test plan pipeline in order, enforcing gates between phases,
producing comprehensive test plan deliverables.

**Success criteria:**
- All 5 phases execute in order
- Gate criteria verified between each phase
- Deliverables produced in output directory
- User receives summary at Phase 5

**Failure criteria:**
- Required inputs missing and user declines to provide → STOP
- Output directory unwritable → STOP with path guidance

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current phase.
This enables resume capability — if a previous run was interrupted, pick up where it left off.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase
until all criteria are met. If a gate fails, loop back to the failing step within that phase.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/test-plan/{project}-{date}/*`

Check which deliverable files exist:

```
IF no output directory exists                        → Load 01-intake.md
ELSE IF scope not documented                         → Load 01-intake.md
ELSE IF methodology-selection not created           → Load 02-analyze.md
ELSE IF test-cases directory empty                   → Load 03-generate.md
ELSE IF TEST-PLAN.md not created                    → Load 04-document.md
ELSE IF deliverables complete                        → Load 05-deliver.md
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/framework/prompts/render-phase.ts skills/test-plan/phases/0{N}-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps,
and CHECKPOINTS.

**Agent routing:** All phases use the security agent — execute directly, no delegation needed.

- Phase 1 (01-intake.md): `agent: security` — execute directly
- Phase 2 (02-analyze.md): `agent: security` — execute directly
- Phase 3 (03-generate.md): `agent: security` — execute directly
- Phase 4 (04-document.md): `agent: security` — execute directly
- Phase 5 (05-deliver.md): `agent: security` — execute directly

**Expected output:** Phase deliverables produced

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

**If gate fails:**
```
PHASE {N} BLOCKED: {Phase Name}
Issue: {specific blocker}
Action: {what needs to be fixed}

→ Fix and retry Phase {N}
```

### Step 6: Advance or Stop

If gate passed → return to Step 2 with next phase.
If final phase → workflow complete.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (no files created by workflow itself)
- All output managed by individual phases in
  `private/output/test-plan/{project}-{date}/`

**Final output (after all 5 phases):**

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

**On all phases complete:** → Workflow finished. Display final summary to user.

**On gate failure:** → Loop back to failing step within current phase.

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-intake.md` | security | Scope documented, domains confirmed | scope.md |
| 2 | `02-analyze.md` | security | Methodology selected | methodology-selection.md |
| 3 | `03-generate.md` | security | Test cases generated | test-cases/*.md |
| 4 | `04-document.md` | security | Test plan complete | TEST-PLAN.md, metadata.json |
| 5 | `05-deliver.md` | security | User has deliverables | Summary, critical items |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→5
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint
5. **Mode is always TEST-PLAN** — No branching

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
