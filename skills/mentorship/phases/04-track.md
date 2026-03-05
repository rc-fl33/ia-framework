---
domain: career-development
skill: mentorship
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: last
---

# Phase 4: TRACK (Progress Metrics)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Establish the progress tracking system — milestone checklists, metrics definitions, session log template, and skills progression table. This is the final phase; after completion, present the user with a summary of all deliverables and guidance on how to use the tracking system.

**Additional constraints:** Keep the tracker simple enough that the user will actually use it. Overly detailed tracking systems get abandoned. Focus on 3-5 key metrics.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Assessment data | Phase 1 | `metadata.json` |
| Learning roadmap | Phase 2 | `LEARNING-ROADMAP.md` |
| Resources | Phase 3 | `RESOURCES.md` |

**Prerequisites:**
- [ ] Phase 3 completed — resources mapped to roadmap

**Source:** `skills/mentorship/phases/03-resource.md`

**What happens if input is missing:** STOP — tracker must align with roadmap milestones.

---

## OBJECTIVE

**Goal:** Create a progress tracker with milestones from the roadmap, metrics definitions, and a session log template. Update metadata.json with final tracking data.

**Success criteria:**
- Milestone checklist aligned with roadmap phases
- Quantitative metrics defined (hours, modules, labs, projects, certs)
- Skills progression table initialized
- Session log template included
- metadata.json updated with milestone count and tracking fields

**Failure criteria:**
- Tracker doesn't align with roadmap milestones → revise
- Too many metrics → simplify to 3-5 key ones

---

## METHODOLOGY

Pull milestones directly from the LEARNING-ROADMAP.md created in Phase 2. Add quantitative and qualitative metrics. Include a session log template for ongoing tracking. Keep it simple — weekly summary table + session logs.

---

## EXECUTION

### Step 1: Extract Milestones from Roadmap

**Tool:** Read
**Reference:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/LEARNING-ROADMAP.md`

Pull all milestone checklists from the 3 phases (Foundation, Building, Application).

### Step 2: Define Metrics

**Tool:** Direct composition

**Quantitative:**
- Hours studied per week
- Modules/courses completed
- Labs/challenges solved
- Portfolio projects finished
- Certifications earned

**Qualitative:**
- Skill level progression (Beginner → Intermediate → Expert)
- Confidence in topic areas
- Network connections quality

### Step 3: Create Session Log Template

**Tool:** Direct composition

```markdown
### {YYYY-MM-DD} - Session X

**Duration:** X hours
**Focus:** [Topic/Module]

**Completed:**
- [Task 1]

**Key Learnings:**
- [Insight 1]

**Blockers:**
- [What you're stuck on, if any]

**Next Session:**
- [Goal 1]
```

### Step 4: Write PROGRESS-TRACKER.md

**Tool:** Write
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/PROGRESS-TRACKER.md`

Structure:
1. Milestone Progress (checkboxes by phase)
2. Skills Development table (Skill / Start Level / Current / Target)
3. Projects table (Project / Status / Link)
4. Certifications table (Cert / Status / Target Date)
5. Weekly Summary table (Week / Hours / Focus / Completed)
6. Session Log section (template for entries)

### Step 5: Update metadata.json

**Tool:** Write
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/metadata.json`

Update with final tracking data:
- `phase: "complete"`
- `milestones.total: {count from roadmap}`
- `certifications.target: [{list from resources}]`
- `learning_platforms: [{list from resources}]`
- `portfolio_projects: [{list from roadmap}]`
- `key_gaps: [{list from assessment}]`

### Step 6: Finalize Status Checkpoint

**Tool:** Edit
**File:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/_status.yaml`

Update:
- `phases[4].status` → `"complete"`
- `phases[4].completed_at` → now
- `phases[4].gate_result` → `"passed"`
- `phases[4].gate_details` → `{ milestones_tracked: {count}, metrics_defined: {count} }`
- `phases[4].deliverables` → `["PROGRESS-TRACKER.md"]`
- `workflow_status` → `"completed"`
- `next_actions` → `["Start learning using LEARNING-ROADMAP.md", "Log sessions in PROGRESS-TRACKER.md"]`
- `updated_at` → now

### Step 7: Present Completion Summary

**Tool:** Direct output

```
Mentorship Plan Complete

Goal: {Goal}
Mode: {Mode}
Timeline: {X} days
Output: private/output/mentorship/{Goal}-{YYYY-MM-DD}/

Files Created:
  metadata.json           — Progress tracking data
  LEARNING-ROADMAP.md     — Your 30/60/90-day plan
  RESOURCES.md            — Platforms, certs, communities
  PROGRESS-TRACKER.md     — Milestones and session log
  {ALTERNATIVE-PATHS.md}  — (Job mode only)
  {JOB-SEARCH-STRATEGY.md}— (Job mode only)

Next Steps:
1. Review LEARNING-ROADMAP.md — your week-by-week plan
2. Bookmark platforms in RESOURCES.md — start with free ones
3. Log sessions in PROGRESS-TRACKER.md — weekly
4. Check milestones off as you complete them
5. Run /mentorship again to review progress
```

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| `PROGRESS-TRACKER.md` | Milestone tracking with session log template | User |
| `metadata.json` (updated) | Final tracking data with all fields populated | Future sessions |
| Completion summary | Displayed to user | User |

---

## NEXT

**On success:** → Workflow complete.

```
Plan: private/output/mentorship/{Goal}-{YYYY-MM-DD}/
Status: Complete — all deliverables created
Mode: {mode}
Files: {4 or 6 depending on mode}

Next: Start learning! Use PROGRESS-TRACKER.md to log sessions.
Review: Run /mentorship to check progress later.
```

**On failure:**
- Tracker misaligned with roadmap → Re-read LEARNING-ROADMAP.md and fix
- Too many metrics → Simplify to 3-5 key ones

---

## CHECKPOINTS

- [ ] Milestones extracted from roadmap
- [ ] Quantitative metrics defined
- [ ] Skills progression table created
- [ ] Session log template included
- [ ] Weekly summary table initialized
- [ ] PROGRESS-TRACKER.md written
- [ ] metadata.json updated with final data
- [ ] Completion summary presented to user
- [ ] All deliverables verified (4 files standard, 6 in job mode)

**Error recovery:**
- Unclear milestones → Review roadmap, make SMART
- Too many metrics → Focus on 3-5 key metrics
- User overwhelmed → Simplify tracker to weekly only

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
