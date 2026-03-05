---
domain: code-review
skill: code-review
agent: developer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Code-Review Workflow Orchestrator

## IDENTITY

**Agent:** `agents/developer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase code-review pipeline. Detect current state, load the correct phase, and enforce gates between phases. All phases use the developer agent.

**Additional constraints:** This is a single-agent workflow. The developer agent handles all phases. Code-review only operates in CODE-REVIEW mode (no ad-hoc).

---

## INPUT CONTRACT

**Receives:**
- User request (code reference) via `/code-review` command
- Company name and/or URL (optional — triggers company context research in Phase 1 Step 2b)
- Output directory path: `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Prerequisites:**
- User request available (code path)
- Mode is always CODE-REVIEW

**Source:** `skills/code-review/commands/code-review.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase code-review pipeline in order, enforcing gates between phases.

**Success criteria:**
- All 5 phases execute in order
- Gate criteria verified between each phase
- Professional code-review deliverables produced in output directory
- User receives summary and follow-up options at Phase 5

**Failure criteria:**
- Required inputs missing and user declines to provide → STOP
- Code not accessible → Ask user for correct path

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current phase. This enables resume capability — if a previous run was interrupted, pick up where it left off.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase until all criteria are met. If a gate fails, loop back to the failing step within that phase.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/code-review/{project}-{YYYY-MM-DD}/*`

Check which deliverable files exist:

```
IF no output directory exists                        → Load 01-intake.md
ELSE IF scope not documented                         → Load 01-intake.md
ELSE IF analysis files not present                   → Load 02-analyze.md
ELSE IF recommendations not created                  → Load 03-recommend.md
ELSE IF report/deliverables incomplete               → Load 04-document.md
ELSE IF all deliverables exist                       → Load 05-deliver.md
ELSE                                                 → Workflow complete

Note: research-brief.md presence indicates Phase 1 automated research completed.
Its absence is NOT a blocker — research is non-blocking.
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/framework/prompts/render-phase.ts skills/code-review/phases/0{N}-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps, and CHECKPOINTS.

**Agent routing:** All phases use the developer agent — execute directly, no delegation needed.

- Phase 1 (01-intake.md): `agent: developer` — execute directly
- Phase 2 (02-analyze.md): `agent: developer` — execute directly
- Phase 3 (03-recommend.md): `agent: developer` — execute directly
- Phase 4 (04-document.md): `agent: developer` — execute directly
- Phase 5 (05-deliver.md): `agent: developer` — execute directly

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
- All output managed by individual phases in `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Final output:**
```
private/output/code-review/{project}-{YYYY-MM-DD}/
├── research-brief.md           # (from Phase 1 Step 2b)
├── EXECUTIVE-SUMMARY.md
├── REVIEW-SUMMARY.md
├── FINDINGS.md
├── REMEDIATION-GUIDE.md
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

**On all phases complete:** → Workflow finished. Display final summary to user.

**On gate failure:** → Loop back to failing step within current phase.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All phases executed in order (1→2→3→4→5)
- [ ] Gate criteria verified between each phase transition
- [ ] Code-review deliverable files exist in output directory
- [ ] User received checkpoint summary after each phase

**Error recovery:**
- If context missing: Prompt user for code location or architecture docs
- If phase produces incomplete output: Loop back to incomplete step, do not advance
- If user wants architecture review: Redirect to `/sec-review`

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-intake.md` | developer | Context and scope documented | scope.md, research-brief.md (Step 2b, non-blocking) |
| 2 | `02-analyze.md` | developer | Analysis complete | FINDINGS.md |
| 3 | `03-recommend.md` | developer | Recommendations prioritized | RECOMMENDATIONS.md |
| 4 | `04-document.md` | developer | Report complete | Full deliverable set + FULL-REPORT.md + metadata.json |
| 5 | `05-deliver.md` | developer | User has deliverables | Summary + follow-up guidance |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→5
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
