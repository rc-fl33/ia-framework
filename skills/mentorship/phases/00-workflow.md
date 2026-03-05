---
domain: career-development
skill: mentorship
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Mentorship Workflow — Multi-Prompt Chain Orchestration

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Orchestrate the 4-phase mentorship workflow. Detect current state, load correct phase, enforce gates between phases. All phases execute under the advisor agent.

**Additional constraints:** Phases execute in strict order (1→2→3→4). Never skip phases. The skill-building workflow (`workflows/skill-building.md`) provides supplemental methodology reference.

---

## INPUT CONTRACT

**Receives:**
- User context from `/mentorship` command (goal, skill area, timeline, mode — may be partial)
- Input file paths from `private/input/mentorship/` (resume, skills, goals — may be empty)
- Output directory: `private/output/mentorship/{Goal}-{YYYY-MM-DD}/`

**Prerequisites:**
- `/mentorship` command has been invoked
- Output directory path defined

**Source:** `skills/mentorship/commands/mentorship.md`

**What happens if input is missing:** If no user context, Phase 1 will gather everything interactively.

---

## OBJECTIVE

**Goal:** Orchestrate the 4-phase mentorship workflow to produce a personalized learning roadmap with resources and progress tracking.

**Success criteria:**
- All 4 phases complete with output files
- Roadmap follows 30/60/90-day structure
- Resources researched with current pricing (WebSearch)
- Progress tracking system established

**Failure criteria:**
- Phase gate fails and cannot be recovered → STOP at that phase

---

## METHODOLOGY

**Phase detection:** Check which files exist in the output directory to determine current state. Load the first incomplete phase.

**Gate enforcement:** Each phase has exit criteria. Verify before proceeding. If a gate fails, retry — do not skip.

**Mode detection:** 5 modes determine scope (see Phase 1). Job Preparation mode adds 2 extra output files.

**Core principles:**
- **Free First** — Prioritize free learning platforms before paid options
- **Hands-On** — Labs, projects, CTFs over theory
- **ROI-Focused** — Only recommend certs with market value
- **Portfolio > Certifications** — Real projects demonstrate skills better
- **Alternative Paths** — Job-focused plans MUST include entry-level alternatives

---

## EXECUTION

### Step 0: Check Engagement Status

**Tool:** Read
**File:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/_status.yaml`

IF `_status.yaml` EXISTS:
  - Parse `workflow_status`, `current_phase`, `phases`, `user_context`, `decisions`, `next_actions`
  - Display resume summary to user:

```
RESUMING: {engagement_id}
Started: {relative time}  |  Last active: {relative time}

PROGRESS:
✓ Phase 1: Assess — {gate_details summary}
▸ Phase 2: Plan — in progress
  Phase 3: Resource — pending
  Phase 4: Track — pending

CONTEXT: {user_context.goal}
DECISION: {last decision}
NEXT: {next_actions[0]}

→ Continuing Phase {current_phase}: {phase name}
```

  - Load phase prompt for `current_phase`
  - SKIP Step 1 (file-existence detection)

IF `_status.yaml` NOT EXISTS:
  - Fall through to Step 1 (backward compatible)

---

### Step 1: Detect Current Phase (Fallback)

**Tool:** Glob
**Pattern:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/*`

```
IF metadata.json NOT exists          → Load 01-assess.md
ELSE IF LEARNING-ROADMAP.md NOT exists → Load 02-plan.md
ELSE IF RESOURCES.md NOT exists        → Load 03-resource.md
ELSE IF PROGRESS-TRACKER.md NOT exists → Load 04-track.md
ELSE → Workflow complete — all deliverables exist
```

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/prompts/render-phase.ts skills/mentorship/phases/0X-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

### Step 3: Execute Phase

Follow the loaded phase prompt exactly. Verify gate criteria before proceeding.

### Step 4: Show Checkpoint

After each phase completion, display:

```
PHASE X COMPLETE: {Phase Name}
Files: {list of output files created}
{Phase-specific metrics}
Gate: PASSED

→ Ready for Phase X+1: {Next Phase Name}
```

### Step 5: Proceed to Next Phase

Repeat Steps 1-4 until all phases complete.

---

## OUTPUT CONTRACT

**This workflow produces (via its phases):**

| File | Description | Phase |
|------|-------------|-------|
| `metadata.json` | Progress tracking data (JSON) | Phase 1 |
| `LEARNING-ROADMAP.md` | Full 30/60/90-day plan | Phase 2 |
| `RESOURCES.md` | Platforms, certs, communities | Phase 3 |
| `PROGRESS-TRACKER.md` | Milestones and session log | Phase 4 |

**Job Preparation mode adds:**

| File | Description | Phase |
|------|-------------|-------|
| `ALTERNATIVE-PATHS.md` | Entry-level alternatives, lateral moves, backup strategies | Phase 2 |
| `JOB-SEARCH-STRATEGY.md` | Companies, job boards, networking, salary research | Phase 3 |

---

## NEXT

**On workflow complete:** → All deliverables written. Present summary to user with directory path and next steps for using the tracker.

**On phase failure:** → Retry failed phase. If unrecoverable → STOP with explanation.

---

## CHECKPOINTS

- [ ] All 4 phases executed in order
- [ ] All output files exist in directory
- [ ] Each phase gate passed before proceeding to next
- [ ] metadata.json has valid schema
- [ ] WebSearch used in Phase 3 for current pricing
- [ ] Checkpoint output shown after each phase

**Error recovery:**
- Phase file missing → Check `skills/mentorship/phases/` directory
- Gate fails → Fix issue and retry phase
- WebSearch unavailable → Use knowledge base, note limitation

---

## Chain Map

```
/mentorship (command — base-claude, haiku)
    │
    ▼
phases/00-workflow.md (this file — advisor, sonnet)
    │
    │  Reference: workflows/skill-building.md (supplemental methodology)
    │
    ├→ phases/01-assess.md  → metadata.json             [advisor]
    │
    ├→ phases/02-plan.md    → LEARNING-ROADMAP.md       [advisor]
    │                       (+ ALTERNATIVE-PATHS.md in job mode)
    │
    ├→ phases/03-resource.md → RESOURCES.md             [advisor]
    │                        (+ JOB-SEARCH-STRATEGY.md in job mode)
    │
    └→ phases/04-track.md   → PROGRESS-TRACKER.md       [advisor]
                                  │
                                  ▼
                            private/output/mentorship/{Goal}-{YYYY-MM-DD}/
                            ├── metadata.json
                            ├── LEARNING-ROADMAP.md
                            ├── RESOURCES.md
                            ├── PROGRESS-TRACKER.md
                            ├── ALTERNATIVE-PATHS.md    (job mode only)
                            └── JOB-SEARCH-STRATEGY.md  (job mode only)
```

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
