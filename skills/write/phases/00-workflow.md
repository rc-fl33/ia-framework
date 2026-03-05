---
domain: write
skill: write
agent: writer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Write Workflow Orchestrator

## IDENTITY

**Agent:** `agents/writer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase content writing pipeline. Detect current state, load the correct phase, enforce gates between phases. All phases use the writer agent (single-agent workflow).

**Additional constraints:** Never skip phases. Never proceed without gate verification. QA 5.0/5.0 is a hard gate — no exceptions.

---

## INPUT CONTRACT

**Receives:**
- Topic text (from user via `/write` command)
- Optional: `--brand [name]` — client brand voice guide to use instead of default
- Optional: content brief from `private/input/write/`
- Output base: `private/output/write/`
- Output directory (per-post): `private/output/write/{slug}-{YYYY-MM-DD}/`

**Prerequisites:**
- Topic available (text provided by user)

**Source:** `skills/write/commands/write.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase content writing pipeline in order, enforcing gates between phases.

**Success criteria:**
- All 5 phases execute in order
- Gate criteria verified between each phase transition
- Final content exported to user's requested format
- All artifacts produced (sources.txt, research-notes.md, draft.md, qa-review.json, final output)

**Failure criteria:**
- Research phase cannot reach 10+ sources after exhaustive search → STOP with partial results
- QA cannot reach 5.0/5.0 after 3 revision cycles → present best version to user

---

## METHODOLOGY

**Output directory convention:** Each post gets its own directory: `private/output/write/{slug}-{YYYY-MM-DD}/`. All artifacts live flat inside — no subfolders. The slug is derived from the topic (lowercase, hyphenated). The date is the creation date.

**State detection:** Check which files exist in the post's output directory to determine current phase. This enables resume capability — if a previous run was interrupted, pick up where it left off.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase until all criteria are met. If a gate fails, loop back to the failing step within that phase.

**Single-agent execution:** All 5 phases use the writer agent. No agent delegation between phases.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/write/*`

Derive the output directory: `private/output/write/{slug}-{YYYY-MM-DD}/`

Check which deliverable files exist in the post directory:

```
IF {output_dir}/sources.txt NOT EXISTS           → Load 01-research.md
ELSE IF {output_dir}/draft.md NOT EXISTS         → Load 02-draft.md
ELSE IF {output_dir}/qa-review.json NOT EXISTS   → Load 03-qa.md
ELSE IF qa-review.json shows approved: false     → Load 03-qa.md (re-run)
ELSE IF visuals phase not completed              → Load 04-visuals.md
ELSE IF final output file NOT EXISTS             → Load 05-output.md
ELSE                                             → Workflow complete
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/framework/prompts/render-phase.ts skills/write/phases/0{N}-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps, and CHECKPOINTS.

**Expected output:** Phase deliverables produced

### Step 4: Verify Gate

Check that all exit criteria from the completed phase are met before advancing.

| Phase | Gate Question | Verification |
|-------|---------------|--------------|
| RESEARCH | "10+ sources validated?" | Count entries in sources.txt |
| DRAFT | "Brand voice template applied?" | Review against template (client brand if `--brand` specified) |
| QA | "QA rating 5.0/5.0?" | Check qa-review.json |
| VISUALS | "Images generated or skipped?" | Check images/ directory OR user confirmed skip |
| OUTPUT | "Format exported?" | Verify output file exists and is valid |

**Expected output:** Gate PASSED or gate FAILED with specific blocker

### Step 5: Show Checkpoint

Display phase completion to user:

```
PHASE {N} COMPLETE: {Phase Name}
Files: {list of output files created}
Gate: PASSED

→ Ready for Phase {N+1}: {Next Phase Name}
```

### Step 6: Advance or Complete

If gate passed → return to Step 2 with next phase.
If final phase complete → display completion summary.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (creates per-post output directory)
- All output managed by individual phases in `private/output/write/{slug}-{YYYY-MM-DD}/`

**Final output (after all 5 phases):**
```
private/output/write/{slug}-{YYYY-MM-DD}/
├── {slug}-{YYYY-MM-DD}.{ext}    # Final content
├── draft.md                      # Working draft
├── qa-review.json                # QA validation results
├── metadata.json                 # Workflow metadata
├── sources.txt                   # 10+ validated sources
├── research-notes.md             # Research compilation
└── *.png                         # Generated images (optional)
```

**Consumed by:** User (final deliverable)

---

## NEXT

**On all phases complete:** → Workflow finished. Display final summary to user.

**On gate failure:** → Loop back to failing step within current phase.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All phases executed in order (1→2→3→4→5)
- [ ] Gate criteria verified between each phase transition
- [ ] Final output file exists in output directory
- [ ] User received checkpoint summary after each phase

**Error recovery:**
- If research stalls: Broaden search terms, try alternative sources
- If QA loops more than 3 times: Present best version to user with remaining issues documented
- If image generation fails: Skip VISUALS phase (optional)
- If export fails: Use markdown as fallback format

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-research.md` | writer | 10+ sources validated | sources.txt, research-notes.md |
| 2 | `02-draft.md` | writer | Brand voice template applied | draft.md |
| 3 | `03-qa.md` | writer | QA rating 5.0/5.0 | qa-review.json, revised draft.md |
| 4 | `04-visuals.md` | writer | Images generated OR user skipped | *.png (optional) |
| 5 | `05-output.md` | writer | Format exported | {slug}-{date}.{ext}, metadata.json |

All output files live flat in `private/output/write/{slug}-{YYYY-MM-DD}/` — no subfolders.

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→5
2. **ALWAYS verify gates** — No advancing without gate pass
3. **QA is a hard gate** — 5.0/5.0 required, no exceptions
4. **ALWAYS show checkpoint** — User must see phase completion summary
5. **Files stay in output directory** — Never move between folders

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
