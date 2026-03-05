---
name: mentorship
description: Skill building with learning roadmaps, 30/60/90-day plans, certifications, and career progression guidance
domain: career-development
skill: mentorship
agent: base-claude
model: haiku
complexity: low
mode: single-agent
chain_position: first
---

# /mentorship — Skill Building & Career Development

## IDENTITY

**Agent:** Base Claude (command routing — lightweight, no specialized agent needed)

**Role:** Mentorship workflow router. Parse user request for mode (learning roadmap, cert prep, portfolio, job prep, career progression), check for existing work, and load the workflow orchestrator.

**Note:** This command routes to `phases/00-workflow.md`, which orchestrates the 4-phase pipeline via the `advisor` agent.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/mentorship` with optional context (goal, skill area, timeline)
- Optional: Files in `private/input/mentorship/` (resume, skills inventory, career goals)
- Optional: Pre-existing output in `private/output/mentorship/`

**Prerequisites:**
- User has invoked `/mentorship`

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's skill building request to the mentorship 4-phase workflow.

**Success criteria:**
- Mode detected (Learning Roadmap / Certification Prep / Portfolio Building / Job Preparation / Career Progression)
- Workflow loaded from `skills/mentorship/phases/00-workflow.md`

**Failure criteria:**
- Workflow file not found → STOP with error

---

## METHODOLOGY

Check for existing work in `private/output/mentorship/`. If a directory matching the goal exists, user may be resuming. Ask before starting fresh.

For fresh starts: create output directory as `{Goal}-{YYYY-MM-DD}` (e.g., `Cloud-Security-2026-02-08`).

If user provides enough context inline (e.g., "90-day OSCP prep plan"), pass it forward so Phase 1 can skip redundant questions.

---

## EXECUTION

### Step 1: Extract User Context

**Tool:** Direct analysis

Parse for: target skill/domain, timeline, mode keywords, constraints.

### Step 2: Check for Input Files

**Tool:** Glob
**Pattern:** `private/input/mentorship/*`

Check if resume, skills inventory, or career goals are available.

### Step 3: Detect Fresh vs. Resume

**Tool:** Glob
**Pattern:** `private/output/mentorship/*`

If previous mentorship output exists, ask user to resume or start fresh.

### Step 4: Load Workflow

**Tool:** Read
**Reference:** `skills/mentorship/phases/00-workflow.md`

Load the workflow orchestrator with all context.

---

## OUTPUT CONTRACT

| Data | Location | Format | Consumed by |
|------|----------|--------|-------------|
| User context | Passed to workflow | Text | Phase 0 |
| Input file paths | Passed to workflow | Path list | Phase 1 |
| Output directory path | Passed to workflow | Path string | All phases |

**Output directory naming:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/`

---

## NEXT

**On success:** Load `skills/mentorship/phases/00-workflow.md`

**On failure:** STOP. Display usage guidance.

---

## CHECKPOINTS

- [ ] Mode keywords detected or default (Learning Roadmap)
- [ ] Input files checked
- [ ] Fresh vs. Resume determined
- [ ] Workflow file loaded

---

## Usage

```
/mentorship
/mentorship create a cybersecurity learning roadmap for cloud security
/mentorship 90-day plan for OSCP preparation
/mentorship portfolio projects for security engineering role
/mentorship help me prepare for a DevSecOps position
```

## When to Use

**Use /mentorship when:**
- Need structured learning roadmap for new skills
- Want 30/60/90-day development plans
- Researching certification paths and ROI
- Building portfolio with practical projects
- Career progression guidance

**Don't use if:**
- Need job application help → `/career`
- Want CliftonStrengths coaching → `/clifton`
- Need fitness programming → `/training`

## Related Commands

- `/career` — Job application workflow
- `/clifton` — CliftonStrengths coaching

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0 — Lightweight Routing
