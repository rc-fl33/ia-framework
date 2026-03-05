---
domain: career-development
skill: mentorship
agent: advisor
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 2: PLAN (30/60/90-Day Structure)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Create a structured 30/60/90-day learning roadmap with weekly objectives, milestone checklists, and deliverables for each phase. The plan must be realistic given the user's constraints (hours/week, budget, prerequisites) and prioritize the highest-impact gaps from the assessment.

**Additional constraints:** Timelines must account for work/life constraints. If the user has 5 hours/week, a 90-day plan covers the same material that 20 hours/week covers in 30 days. In Job Preparation mode, also create ALTERNATIVE-PATHS.md with entry-level alternatives and backup strategies.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Assessment data | Phase 1 | `metadata.json` |
| Gap analysis with priorities | Phase 1 | In-context |
| Mode | Phase 1 | In metadata.json |

**Prerequisites:**
- [ ] Phase 1 completed — assessment data and gap analysis available

**Source:** `skills/mentorship/phases/01-assess.md`

**What happens if input is missing:** STOP — cannot plan without assessment.

---

## OBJECTIVE

**Goal:** Produce a structured 30/60/90-day learning roadmap that maps gap priorities to weekly milestones.

**Success criteria:**
- Foundation phase (Days 1-30) defined with weekly objectives
- Building phase (Days 31-60) defined with weekly objectives
- Application phase (Days 61-90) defined with weekly objectives
- Deliverables identified for each phase
- Timeline realistic given constraints
- In Job Preparation mode: ALTERNATIVE-PATHS.md also created

**Failure criteria:**
- Timeline unrealistic for constraints → adjust scope or extend
- No clear milestones → make SMART (Specific, Measurable)

---

## METHODOLOGY

Map the prioritized gaps from Phase 1 to a 3-phase structure:

**Month 1: Foundation** — Core concepts, tools setup, quick wins, learning routine
**Month 2: Building** — Intermediate concepts, hands-on labs, first portfolio projects, community engagement
**Month 3: Application** — Advanced topics, capstone project, certification (if ROI-positive), job prep

For shorter timelines (30 or 60 days), compress accordingly — fewer milestones but same structure.

---

## EXECUTION

### Step 1: Determine Timeline Structure

**Tool:** Direct analysis

Based on assessment constraints:
- **30 days:** Quick skill acquisition, single focus area, compressed milestones
- **60 days:** Deeper learning, some application, 2 phases
- **90 days:** Full journey from foundation to application, all 3 phases

### Step 2: Foundation Phase (Days 1-30)

**Tool:** Direct composition

Define weekly focus areas and milestone checklist:

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1-2 | Core concepts, tools setup | Environment ready |
| 3-4 | Foundational learning, first labs | Foundation complete |

Milestone checklist:
- [ ] Learning environment configured
- [ ] Core concepts understood
- [ ] First hands-on exercise complete
- [ ] Joined 2+ communities
- [ ] Portfolio/GitHub profile created

### Step 3: Building Phase (Days 31-60)

**Tool:** Direct composition

| Week | Focus | Deliverable |
|------|-------|-------------|
| 5-6 | Specialized learning, advanced labs | Deeper knowledge |
| 7-8 | Practice projects, networking | Portfolio projects |

Milestone checklist:
- [ ] Intermediate concepts mastered
- [ ] 2-3 portfolio projects complete
- [ ] 5+ network connections made
- [ ] Contributing to community

### Step 4: Application Phase (Days 61-90)

**Tool:** Direct composition

| Week | Focus | Deliverable |
|------|-------|-------------|
| 9-10 | Real projects, certification prep | Capstone project |
| 11-12 | Job prep, applications | Updated resume |

Milestone checklist:
- [ ] Capstone project complete
- [ ] Certification earned (if pursuing)
- [ ] Resume updated
- [ ] Job applications started (if applicable)

### Step 5: Write LEARNING-ROADMAP.md

**Tool:** Write
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/LEARNING-ROADMAP.md`

### Step 6: Update Status Checkpoint

**Tool:** Edit
**File:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/_status.yaml`

Update:
- `phases[2].status` → `"complete"`
- `phases[2].completed_at` → now
- `phases[2].gate_result` → `"passed"`
- `phases[2].gate_details` → `{ milestones_defined: {count}, timeline_days: {days} }`
- `phases[2].deliverables` → `["LEARNING-ROADMAP.md"]` (add `"ALTERNATIVE-PATHS.md"` if job mode)
- `phases[3].status` → `"in_progress"`
- `current_phase` → `3`
- `next_actions` → `["Research learning platforms and certification ROI"]`
- `updated_at` → now

### Step 7: Write ALTERNATIVE-PATHS.md (Job Preparation mode only)

**Tool:** Write (conditional)
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/ALTERNATIVE-PATHS.md`

If mode is Job Preparation, create alternative paths document with:
- Entry-level alternatives (realistic first roles)
- Lateral moves (leveraging existing experience)
- Backup strategies (if primary path doesn't work)
- Salary expectations per path
- Growth trajectory for each alternative

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| `LEARNING-ROADMAP.md` | Structured 30/60/90-day plan with weekly objectives | Phase 3, Phase 4, User |
| `ALTERNATIVE-PATHS.md` (job mode) | Alternative career paths with strategies | User |

---

## NEXT

**On success:** → Load `skills/mentorship/phases/03-resource.md`

**On failure:**
- Timeline too aggressive → Extend or reduce scope
- Too many objectives → Prioritize top 3-5 per phase
- Unclear milestones → Make SMART

---

## CHECKPOINTS

- [ ] All timeline phases defined with objectives
- [ ] Weekly focus areas set
- [ ] Milestone checklists created per phase
- [ ] Deliverables identified
- [ ] Timeline realistic given constraints
- [ ] LEARNING-ROADMAP.md written
- [ ] ALTERNATIVE-PATHS.md written (if job mode)

**Error recovery:**
- Timeline too aggressive → Extend or reduce scope
- Too many objectives → Prioritize top 3-5 per phase
- Unclear milestones → Make SMART (Specific, Measurable)

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
