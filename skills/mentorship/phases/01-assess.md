---
domain: career-development
skill: mentorship
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 1: ASSESS (Current State)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather the user's current skills, target goal, timeline, constraints, and learning preferences. If input files exist (resume, skills inventory), extract data from them rather than asking redundant questions. Produce a gap analysis and initialize metadata.json.

**Additional constraints:** If the user provided inline context with `/mentorship`, pre-fill known answers. Only ask for what's genuinely missing. Default timeline to 90 days if not specified.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| User query/context | Command or conversation | Text |
| Input files (optional) | `private/input/mentorship/` | resume.md, career-goals.md, current-skills.md, etc. |
| Output directory path | Phase 0 (workflow) | Path string |

**Prerequisites:**
- [ ] Workflow orchestrator has been loaded

**Source:** `skills/mentorship/phases/00-workflow.md`

**What happens if input is missing:** Ask assessment questions interactively.

---

## OBJECTIVE

**Goal:** Document current state, target goal, gap analysis, and constraints so Phase 2 can build a realistic roadmap.

**Success criteria:**
- Current skills documented with levels
- Target goal clearly defined
- Mode identified (Learning Roadmap / Certification Prep / Portfolio Building / Job Preparation / Career Progression)
- Gap analysis completed with priorities
- Timeline established (30/60/90 days)
- Constraints captured (budget, time, prerequisites)

**Failure criteria:**
- Target goal remains unclear after clarification → ask again
- No skills data and user won't provide → cannot proceed

---

## METHODOLOGY

Check for input files first — if a resume or skills inventory exists, extract data automatically. Then ask only for what's missing. The assessment covers 5 areas: current skills, target goal, timeline, constraints, and learning style preference.

**Mode detection from keywords:**

| Keywords | Mode |
|----------|------|
| "learn", "roadmap", "new skill", "break into" | Learning Roadmap |
| "cert", "OSCP", "Security+", "prepare for" | Certification Prep |
| "portfolio", "projects", "demonstrate", "showcase" | Portfolio Building |
| "job", "position", "apply", "get ready for" | Job Preparation |
| "promotion", "next role", "advance", "senior" | Career Progression |

---

## EXECUTION

### Step 1: Check for Input Files

**Tool:** Glob
**Pattern:** `private/input/mentorship/*.{md,pdf}`

If resume found → extract skills inventory automatically.
If career-goals found → extract target goal.
If current-skills found → extract skills levels.

### Step 2: Gather Assessment Data

**Tool:** AskUserQuestion (for missing items only)

Collect (skip what's already known from input files or inline context):

1. **Current Role/Experience** — Role, years, relevant certifications
2. **Target Goal** — Specific skill/domain/role being targeted
3. **Timeline** — 30, 60, or 90 days (default: 90)
4. **Constraints** — Hours/week available, budget, prerequisites
5. **Learning Style** — Video / reading / hands-on / structured courses

### Step 3: Skills Inventory

**Tool:** Direct analysis

Document current skills with levels:

| Skill | Level | Evidence |
|-------|-------|----------|
| {skill} | Beginner/Intermediate/Expert | {where demonstrated} |

Current certifications:

| Certification | Status | Expiry |
|--------------|--------|--------|
| {cert} | Active/Expired | {date} |

### Step 4: Gap Analysis

**Tool:** Direct analysis

Compare current state to target:

| Requirement | Current Level | Gap | Priority |
|-------------|---------------|-----|----------|
| {skill/cert} | {level} | {what's missing} | {1-3} |

### Step 5: Write metadata.json

**Tool:** Write
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/metadata.json`

### Step 6: Initialize Status Checkpoint

**Tool:** Write
**File:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/_status.yaml`

Create `_status.yaml` with:

```yaml
engagement_id: "mentorship-{goal}-{YYYY-MM-DD}"
skill: "mentorship"
created_at: "{ISO-8601 now}"
updated_at: "{ISO-8601 now}"
session_id: "{current session id}"

total_phases: 4
current_phase: 2
workflow_status: "in_progress"

phases:
  - phase: 1
    name: "Assess"
    status: "complete"
    started_at: "{ISO-8601}"
    completed_at: "{ISO-8601 now}"
    gate_result: "passed"
    gate_details:
      mode: "{detected mode}"
      skills_assessed: {count}
      gaps_identified: {count}
    deliverables:
      - "metadata.json"
  - phase: 2
    name: "Plan"
    status: "in_progress"
    started_at: null
    completed_at: null
    gate_result: null
    gate_details: {}
    deliverables: []
  - phase: 3
    name: "Resource"
    status: "pending"
    started_at: null
    completed_at: null
    gate_result: null
    gate_details: {}
    deliverables: []
  - phase: 4
    name: "Track"
    status: "pending"
    started_at: null
    completed_at: null
    gate_result: null
    gate_details: {}
    deliverables: []

user_context:
  goal: "{learning goal}"

decisions:
  - timestamp: "{ISO-8601 now}"
    phase: 1
    decision: "Mode: {mode}, Timeline: {X} days"

blockers: []

next_actions:
  - "Build 30/60/90-day learning roadmap"

skill_metadata:
  goal: "{learning goal}"
  target_role: "{target role/skill}"
  mode: "{detected mode}"
  timeline_days: {timeline}
  hours_per_week: {hours}
  certifications_target: []

session_history:
  - session_id: "{current session id}"
    started_at: "{ISO-8601}"
    phases_completed: [1]
```

Initialize metadata.json with assessment data:

```json
{
  "goal": "{learning goal}",
  "target_role": "{target job/skill}",
  "mode": "{detected mode}",
  "started_at": "{ISO timestamp}",
  "timeline_days": 90,
  "hours_per_week": 0,
  "phase": "assess",
  "current_day": 0,
  "milestones": { "completed": 0, "total": 0 },
  "certifications": { "target": [], "completed": [] },
  "learning_platforms": [],
  "portfolio_projects": [],
  "key_gaps": []
}
```

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| `metadata.json` | JSON with assessment data, mode, goal, constraints | Phase 2, Phase 3, Phase 4 |
| Assessment summary | In-context (planning notes) | Phase 2 |

---

## NEXT

**On success:** → Load `skills/mentorship/phases/02-plan.md`

Pass: metadata.json contents + gap analysis + mode

**On failure:**
- Goal unclear → AskUserQuestion to clarify
- No skills data → Ask for manual list
- No timeline → Default to 90 days

---

## CHECKPOINTS

- [ ] Current skills documented with levels
- [ ] Target goal clearly defined
- [ ] Mode identified
- [ ] Gap analysis completed with priorities
- [ ] Timeline established
- [ ] Constraints captured
- [ ] metadata.json written to output directory

**Error recovery:**
- No resume → Ask for manual skills list
- Unclear goal → Ask clarifying questions
- No timeline → Default to 90 days
- Budget unknown → Prioritize free resources

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
