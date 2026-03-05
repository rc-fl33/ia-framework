# Skill Checkpoint/Resume Guide

How to add `_status.yaml` checkpoint/resume capability to a skill.

## Overview

`_status.yaml` is an engagement-level checkpoint file that lives in each engagement's output directory. It tracks workflow progress across sessions so users can resume interrupted multi-phase skills.

**Not the same as `STATUS.md`** — STATUS.md tracks skill readiness at the skill level. `_status.yaml` tracks work-in-progress at the engagement level.

## Architecture

```
skills/{skill}/output/{engagement-dir}/
├── _status.yaml          ← checkpoint file (this guide)
├── phase-1-output.md     ← normal phase deliverables
├── phase-2-output.md
└── ...
```

## Adding _status.yaml to a Skill

### 1. Define skill_metadata schema

Add your skill's metadata fields to `docs/schemas/status-metadata-schemas.yaml`:

```yaml
my_skill:
  key_field: "{description}"
  another_field: null
```

### 2. Update 00-workflow.md — Add Step 0

Insert before existing file-existence detection:

```markdown
### Step 0: Check Engagement Status

**Tool:** Read
**File:** {output-directory}/_status.yaml

IF _status.yaml EXISTS:
  - Parse workflow_status, current_phase, phases, user_context, decisions, next_actions
  - Display resume summary (format below)
  - Load phase prompt for current_phase
  - SKIP file-existence detection (Step 1)

IF _status.yaml NOT EXISTS:
  - Fall through to existing file-existence detection (backward compatible)
```

**Resume UX format:**

```
RESUMING: {engagement_id}
Started: {relative time}  |  Last active: {relative time}

PROGRESS:
✓ Phase 1: {name} — {gate_details summary}
▸ Phase 2: {name} — in progress
  Phase 3: {name} — pending

CONTEXT: {user_context.goal}
DECISION: {last decision}
NEXT: {next_actions[0]}

→ Continuing Phase {current_phase}: {name}
```

### 3. Update Phase 1 — Create _status.yaml

Add a step after the engagement folder is created:

```markdown
### Step N: Initialize Status Checkpoint

**Tool:** Write
**File:** {output-directory}/_status.yaml

Create with:
- engagement_id: {skill}-{identifier}-{YYYY-MM-DD}
- skill, created_at, session_id
- total_phases from skill phase count
- current_phase: 1, workflow_status: "in_progress"
- All phases listed with status "pending", Phase 1 as "in_progress"
- user_context from user's input
- skill_metadata from skill-specific details
```

### 4. Update All Phase Completions — Update checkpoint

Add at the end of each phase:

```markdown
### Step N: Update Status Checkpoint

**Tool:** Edit
**File:** {output-directory}/_status.yaml

Update:
- phases[current].status → "complete"
- phases[current].completed_at → now
- phases[current].gate_result → result
- phases[current].gate_details → {phase-specific}
- phases[current].deliverables → [files created]
- current_phase → next phase number
- phases[next].status → "in_progress" (if not final)
- workflow_status → "completed" (if final phase)
- Record decisions[] made during phase
- Update next_actions[]
- updated_at → now
```

### 5. Final Phase — Mark completed

On the last phase, set `workflow_status: "completed"` instead of advancing `current_phase`.

## Template Reference

Full schema: `docs/templates/status-checkpoint-template.yaml`
Per-skill metadata: `docs/schemas/status-metadata-schemas.yaml`

## Migration Checklist

For each skill:

- [ ] Define skill_metadata schema
- [ ] Update 00-workflow.md with Step 0 status detection
- [ ] Update Phase 1 with _status.yaml creation
- [ ] Update all phase prompts with checkpoint update step
- [ ] Test: fresh run creates _status.yaml
- [ ] Test: mid-workflow resume loads correct phase
- [ ] Test: fallback works without _status.yaml

## Design Decisions

- **YAML over JSON**: Matches session files, human-readable
- **Phase prompts write, not hooks**: Logic stays where context exists
- **Fallback to file-existence**: Zero disruption to existing engagements
- **Warning-only validation**: Don't block execution if _status.yaml is malformed
- **Pentest bridges**: session.json remains primary; _status.yaml wraps it

---

**Framework:** Intelligence Adjacent (IA)
