---
domain: advisory
skill: advisory
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Advisory Workflow Orchestrator

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase advisory pipeline. Detect current state, determine advisory mode, load the correct phase, and enforce gates between phases. All phases use the advisor agent.

**Additional constraints:** This is a single-agent workflow. The advisor agent handles all phases. Mode must be determined during intake: ad-hoc or code-review.

---

## INPUT CONTRACT

**Receives:**
- User request (question or code reference) via `/advisory` or `/code-review` command
- Mode indicator from command (ad-hoc for `/advisory`, code-review for `/code-review`)
- Company name and/or URL (optional — triggers company context research in Phase 1 Step 2b)
- Output directory path: `private/output/advisory/{type}/{project}-{date}/`

**Prerequisites:**
- User request available (question or code path)
- Mode determined from command or request content

**Source:** `skills/advisory/commands/advisory.md` or `skills/advisory/commands/code-review.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase advisory pipeline in order, enforcing gates between phases, adapting to the selected mode (ad-hoc, code-review).

**Success criteria:**
- All 5 phases execute in order
- Gate criteria verified between each phase
- Mode-appropriate deliverables produced in output directory
- User receives summary and follow-up options at Phase 5

**Failure criteria:**
- Required inputs missing and user declines to provide → STOP
- Mode cannot be determined → Ask user, do not guess

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current phase. This enables resume capability — if a previous run was interrupted, pick up where it left off.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase until all criteria are met. If a gate fails, loop back to the failing step within that phase.

**Mode determines output:** Ad-hoc produces lightweight guidance files. Code-review produces comprehensive professional reports with metadata.json.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/advisory/{type}/{project}-{date}/*`

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
Its absence is NOT a blocker — research is non-blocking (QUICK mode skips it).
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/framework/prompts/render-phase.ts skills/advisory/phases/0{N}-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps, and CHECKPOINTS.

**Agent routing:** All phases use the advisor agent — execute directly, no delegation needed.

- Phase 1 (01-intake.md): `agent: advisor` — execute directly
- Phase 2 (02-analyze.md): `agent: advisor` — execute directly
- Phase 3 (03-recommend.md): `agent: advisor` — execute directly
- Phase 4 (04-document.md): `agent: advisor` — execute directly
- Phase 5 (05-deliver.md): `agent: advisor` — execute directly

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
- All output managed by individual phases in `private/output/advisory/{type}/{project}-{date}/`

**Final output (by mode after all 5 phases):**

**AD-HOC:**
```
private/output/advisory/ad-hoc/{topic}-{date}/
├── research-brief.md           # (optional, from Phase 1 Step 2b)
├── request.md
├── research.md
├── recommendations.md
├── references.md
└── FULL-REPORT.md
```

**CODE-REVIEW:**
```
private/output/advisory/code-reviews/{project}-{date}/
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
- [ ] Mode-appropriate deliverable files exist in output directory
- [ ] User received checkpoint summary after each phase

**Error recovery:**
- If context missing: Prompt user for architecture docs, code location, or question details
- If phase produces incomplete output: Loop back to incomplete step, do not advance
- If mode unclear: Ask user to clarify before proceeding
- If user wants architecture review: Redirect to `/sec-review`

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-intake.md` | advisor | Context and scope documented | scope.md (CODE-REVIEW), research-brief.md (Step 2b, non-blocking) |
| 2 | `02-analyze.md` | advisor | Analysis complete | Mode-specific analysis files |
| 3 | `03-recommend.md` | advisor | Recommendations prioritized | RECOMMENDATIONS.md |
| 4 | `04-document.md` | advisor | Report complete | Full deliverable set + FULL-REPORT.md + metadata.json |
| 5 | `05-deliver.md` | advisor | User has deliverables | Summary + follow-up guidance |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→5
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint
5. **Mode determines deliverables** — Ad-hoc is lightweight, code-review is comprehensive

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
