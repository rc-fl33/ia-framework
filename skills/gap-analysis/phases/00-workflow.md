---
domain: gap-analysis
skill: gap-analysis
agent: advisor
model: sonnet
mode: multi-agent
agents: [advisor, engineer, security, legal]
complexity: medium
chain_position: first
---

# Gap Analysis Workflow Orchestrator

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 3-phase gap analysis pipeline with final legal QA gate. Detect current state, load the correct phase, enforce gates between phases, and route to the correct agent for each phase.

**Additional constraints:** This is a multi-agent workflow. The assessment phase (02-assess.md) routes internally to different agents by control domain: advisor (governance, asset_management, monitoring, business_continuity), engineer (access_control, data_protection), and security (incident_response). Legal handles final deliverable QA.

---

## INPUT CONTRACT

**Receives:**
- Gap analysis request (from user via `/gap-analysis` command)
- Optional: specific framework(s) requested
- Optional: client name and assessor details
- Output directory path: `private/output/gap-analysis/{client}-{YYYY-MM}/`

**Prerequisites:**
- User has invoked `/gap-analysis` or a phase shortcut command
- Framework resources accessible via `standards/frameworks/`

**Source:** `skills/gap-analysis/commands/gap-analysis.md` (command prompt)

---

## OBJECTIVE

**Goal:** Execute the 3-phase gap analysis pipeline in order, enforcing gates between phases and routing to the correct agent per domain.

**Success criteria:**
- All 3 phases execute in order (or subset if scope is limited)
- Gate criteria verified between each phase
- Assessment findings documented per selected framework in output directory
- Final deliverables generated at Phase 3 (compliance matrix, gap analysis, remediation roadmap)

**Failure criteria:**
- Required framework not available and user declines acquisition
- User cancels assessment during intake

---

## METHODOLOGY

**State detection:** Check which files exist in the output directory to determine current phase. This enables resume capability — if a previous run was interrupted, pick up where it left off.

**Gate enforcement:** Each phase has explicit exit criteria. Do not advance to the next phase until all criteria are met. If a gate fails, loop back to the failing step within that phase.

**Phase ordering:** Intake establishes engagement context and generates the merged questionnaire. Assess conducts the structured interview and produces per-framework findings files. Deliverables compiles findings into the compliance matrix, gap analysis, and remediation roadmap.

**Assessment organization:** Output is organized by each selected framework's native category structure — never by NIST CSF phase names unless NIST CSF was actually selected.

**Multi-framework handling:** When multiple frameworks are selected, questions are deduplicated by shared control domain. A single interview covers all frameworks simultaneously.

---

## EXECUTION

### Step 1: Detect Current State

**Tool:** Glob
**Pattern:** `private/output/gap-analysis/{client}-{YYYY-MM}/*`

Check which files exist in the output directory:

```
IF engagement folder NOT created                          → Load phases/01-intake.md
ELSE IF intake/metadata.yaml NOT EXISTS                   → Load phases/01-intake.md
ELSE IF no {framework-id}-findings.md in assessment/      → Load phases/02-assess.md
ELSE IF deliverables/ NOT complete                        → Load phases/03-deliverables.md
ELSE                                                      → Workflow complete
```

To check for findings: for each framework listed in `intake/metadata.yaml`, check whether
`assessment/{framework-id}-findings.md` exists.

**Expected output:** Current phase identified
**On failure:** Default to Phase 1 (fresh start)

### Step 2: Load Phase Prompt

**Tool:** Read
**Path:** `skills/gap-analysis/phases/0{N}-{phase}.md`

Load the correct phase file. Pass engagement context to the phase.

**Expected output:** Phase instructions loaded, execution begins

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Each phase has its own IDENTITY, EXECUTION steps, and CHECKPOINTS.

**Agent routing per phase:**
- Phase 1 (01-intake.md): `agent: advisor` — execute directly
- Phase 2 (02-assess.md): `agent: advisor` — routing by domain handled internally within phase
- Phase 3 (03-deliverables.md): `agent: advisor` — execute directly
- Legal QA Gate (after Phase 3): `agent: legal` — delegate via `Task(subagent_type="legal")`

**Expected output:** Phase deliverables produced

### Step 4: Verify Gate

Check that all exit criteria from the completed phase are met before advancing.

**Expected output:** Gate PASSED or gate FAILED with specific blocker

### Step 5: Show Checkpoint

Display phase completion to user:

```
PHASE {N} COMPLETE: {Phase Name}
Files: {list of output files created}
{Phase-specific metrics: controls assessed, gaps identified, etc.}
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

If gate passed, return to Step 2 with next phase.
If final phase complete or user cancels, stop.

---

## OUTPUT CONTRACT

**Produces:**
- Phase orchestration (no files created by workflow itself)
- All output managed by individual phases in `private/output/gap-analysis/{client}-{YYYY-MM}/`

**Final output (after all 3 phases):**
```
private/output/gap-analysis/{client}-{YYYY-MM}/
├── metadata.yaml
├── intake/
│   ├── engagement-details.yaml
│   ├── merged-questionnaire.yaml
│   └── osint-summary.md
├── assessment/
│   ├── {framework-id}-findings.md   (one per selected framework)
│   └── ...
├── deliverables/
│   ├── compliance-matrix.md
│   ├── gap-analysis.md
│   ├── remediation-roadmap.md
│   └── qa-report.md
└── evidence/
```

---

## NEXT

**On all phases complete:** Workflow finished. Display final summary to user with deliverable locations.

**On gate failure:** Loop back to failing step within current phase.

**On user cancel:** Stop. Display progress summary showing completed phases.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All phases executed in order (1 through 3) or user-selected subset completed
- [ ] Gate criteria verified between each phase transition
- [ ] Per-framework findings files exist for each selected framework
- [ ] Deliverables generated after final phase (compliance matrix, gap analysis, roadmap)
- [ ] User received checkpoint summary after each phase

---

## Phase Reference

| Phase | File | Agent | Gate | Output |
|-------|------|-------|------|--------|
| 1 | `01-intake.md` | advisor | Framework acquired, engagement created | Engagement folder |
| 2 | `02-assess.md` | advisor (+ engineer, security via Task) | All selected frameworks have findings files | `{framework-id}-findings.md` per framework |
| 3 | `03-deliverables.md` | advisor | Deliverables generated, legal QA complete | compliance-matrix.md, gap-analysis.md, remediation-roadmap.md, qa-report.md |

---

## Critical Rules

1. **NEVER skip phases** — Execute in order 1 through 3 (unless user selected subset)
2. **ALWAYS show checkpoint** — User must see phase completion summary
3. **Files stay in output directory** — Never move between folders
4. **Framework-native** — Output organized by selected framework's own structure
5. **Framework data path** — Framework resources live at `standards/frameworks/`

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
