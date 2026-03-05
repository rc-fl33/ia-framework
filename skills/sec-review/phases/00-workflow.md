---
domain: sec-review
skill: sec-review
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Security Review Workflow Orchestrator

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 5-phase security review pipeline. Detect current state,
load the correct phase, and enforce gates between phases. All phases use the security agent.

**Additional constraints:** This is a single-agent, single-mode workflow. Mode: SECURITY-REVIEW.
There is no ad-hoc or code-review branching — every invocation is a full security review.

---

## INPUT CONTRACT

**Receives:**
- User request (architecture docs or system description) via `/sec-review` command
- Project name and output directory path
- Optional: company name, URL, compliance requirements, domain selection (B/C/E)

**Prerequisites:**
- User request available (architecture documentation or system description)

**Source:** `skills/sec-review/commands/sec-review.md`

---

## OBJECTIVE

**Goal:** Execute the 5-phase security review pipeline in order, enforcing gates between phases,
producing comprehensive security assessment deliverables.

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
**Pattern:** `private/output/sec-review/{project}-{date}/*`

Check which deliverable files exist:

```
IF no output directory exists                        → Load 01-intake.md
ELSE IF scope not documented                         → Load 01-intake.md
ELSE IF analysis files not present                   → Load 02-analyze.md
ELSE IF recommendations not created                  → Load 03-recommend.md
ELSE IF report/deliverables incomplete               → Load 04-document.md
ELSE IF all deliverables exist                       → Load 05-deliver.md
```

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/framework/prompts/render-phase.ts skills/sec-review/phases/0{N}-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps,
and CHECKPOINTS.

**Agent routing:** All phases use the security agent — execute directly, no delegation needed.

- Phase 1 (01-intake.md): `agent: security` — execute directly
- Phase 2 (02-analyze.md): `agent: security` — execute directly
- Phase 3 (03-recommend.md): `agent: security` — execute directly
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
  `private/output/sec-review/{project}-{date}/`

**Final output (after all 5 phases):**

```
private/output/sec-review/{project}-{date}/
├── research-brief.md
├── scope.md
├── EXECUTIVE-SUMMARY.md
├── ARCHITECTURE-ANALYSIS.md
├── THREAT-MODEL.md
├── FINDINGS.md
├── PRACTICES-REVIEW.md          (Domain B, if selected)
├── PATCH-ASSESSMENT.md          (Domain C, if selected)
├── SUPPLY-CHAIN-REVIEW.md       (Domain E, if selected)
├── GAP-ANALYSIS.md
├── RECOMMENDATIONS.md
├── diagrams/
│   ├── arch-overview.mmd/.svg/.png
│   ├── trust-boundaries.mmd/.svg/.png
│   ├── data-flow.mmd/.svg/.png
│   ├── attack-surface.mmd/.svg/.png
│   ├── threat-model.mmd/.svg/.png
│   └── network-topology.mmd/.svg/.png
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
| 1 | `01-intake.md` | security | Scope documented, domains confirmed | scope.md, research-brief.md |
| 2 | `02-analyze.md` | security | Analysis complete for all domains | Domain-specific analysis files (A always; B/C/E if selected) |
| 3 | `03-recommend.md` | security | Recommendations prioritized | RECOMMENDATIONS.md |
| 4 | `04-document.md` | security | Report complete | FULL-REPORT.md, diagrams/, metadata.json |
| 5 | `05-deliver.md` | security | User has deliverables | Summary, critical items |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1→2→3→4→5
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Each phase is self-contained** — Load prompt, execute, verify gate, show checkpoint
5. **Mode is always SECURITY-REVIEW** — No branching

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
