---
name: mentorship
description: Learning roadmaps and career progression tracking - personalized development plans with milestone tracking
agent: advisor
version: 2.0
classification: public
last_updated: 2026-02-08
effort_default: STANDARD
---

> **⛔ DUAL-PATH ROUTING - READ THIS FIRST**
>
> **STOP.** This skill requires the `advisor` agent for complex requests.
>
> **Identity check:** If you are NOT the advisor agent AND your request is complex
> (personalized roadmaps, career progression, 30/60/90 planning) → DELEGATE NOW:
>
> ```typescript
> Task(subagent_type="advisor", prompt="Execute mentorship skill. Request: {user_request}")
> ```
>
> **DO NOT** proceed if you lack advisor expertise for:
> - Personalized learning roadmaps
> - Career progression planning
> - 30/60/90-day goal setting
> - Certification path planning
>
> **Path 1 - Simple (Tier 1/Haiku):** General learning path information
> - "What certifications are available in security?"
> - "What's a good learning progression for DevOps?"
> - Routes directly, no delegation needed
>
> **Path 2 - Complex (Advisor):** Personalized roadmaps
> - "Create a 90-day learning plan for me"
> - "Build my career progression strategy"
> - Requires advisor delegation

---

> **FOR AI AGENTS:** Career development and skill building mentorship.
> Load when: user mentions "learning roadmap", "30/60/90 plan", "certification path", "skill building", "career development", "portfolio projects"

---

# Mentorship & Skill Building Skill

**Structured learning roadmaps with certification guidance and progress tracking.**

---

## Chain Map

```
/mentorship (command — base-claude, haiku)
    │
    ▼
phases/00-workflow.md (orchestrator — advisor, sonnet)
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

## Pre-flight Checklist (MANDATORY)

**STOP! Before executing this skill:**

- [ ] Read this SKILL.md completely
- [ ] Detect mode: Learning Roadmap vs Certification Prep vs Portfolio Building vs Job Preparation vs Career Progression
- [ ] Identify target skill/domain
- [ ] Determine timeline (30/60/90 days)

---

## Input Directory Structure

**Place career/background materials in `private/input/mentorship/`:**

```
private/input/mentorship/
├── resume.md                    # Resume (markdown preferred)
├── resume.pdf                   # Resume (PDF format)
├── strengths-report.pdf         # CliftonStrengths or other assessments
├── portfolio-links.md           # Links to projects, GitHub, etc.
├── career-goals.md              # Career aspirations and timeline
└── current-skills.md            # Current technical/professional skills
```

**File format notes:**
- Resume works best as markdown (`.md`) for easy parsing
- PDFs are supported for formal documents
- Use descriptive filenames for multiple people (e.g., `resume-jane.md`, `resume-john.md`)

**What to include:**
- Current role and experience level
- Technical skills and certifications
- Career goals and target roles
- Learning constraints (time, budget)
- Preferred learning style

---

## Core Philosophy

**Free First:** Prioritize free learning platforms before paid options.

**Hands-On:** Theory without practice is worthless. Labs, projects, CTFs.

**ROI-Focused:** Certifications should provide career value, not just credentials.

**Portfolio > Certifications:** Real projects demonstrate skills better than certs.

**Alternative Paths:** Job-focused plans MUST include entry-level alternatives.

**Incremental Progress:** 30/60/90-day structure prevents overwhelm.

---

## Critical Rules

1. **Always research current info** - Certification costs, requirements change frequently
2. **Free platforms first** - TryHackMe, HackTheBox, PortSwigger before paid courses
3. **Portfolio > Certifications** - Real projects demonstrate skills better than certs
4. **Realistic timelines** - Account for work/life constraints
5. **Always include alternative paths** - Every job-focused plan MUST include entry-level alternatives, lateral moves, and backup strategies

---

## Mode Detection

| Mode | Detection Keywords | Focus |
|------|-------------------|-------|
| **Learning Roadmap** | "learn", "roadmap", "new skill", "break into" | Full 30/60/90 plan |
| **Certification Prep** | "cert", "OSCP", "Security+", "prepare for" | Focused cert path |
| **Portfolio Building** | "portfolio", "projects", "demonstrate", "showcase" | Project recommendations |
| **Job Preparation** | "job", "position", "apply", "get ready for" | Training + alternatives + strategy |
| **Career Progression** | "promotion", "next role", "advance", "senior" | Gap analysis + plan |

---

## 4-Phase Workflow

```
+------------+     +------------+     +------------+     +------------+
|   ASSESS   |---->|    PLAN    |---->|  RESOURCE  |---->|   TRACK    |
|            |     |  30/60/90  |     |            |     |            |
+-----+------+     +-----+------+     +-----+------+     +-----+------+
      |                  |                  |                  |
      v                  v                  v                  v
   Current           Milestone         Platform +         Progress
   Skills +          Structure         Cert ROI           Metrics
   Goals                               Analysis
```

| Phase | Name | Gate Criteria | Output |
|-------|------|---------------|--------|
| 1 | **ASSESS** | Goals clear, current skills documented, timeline set | Assessment summary |
| 2 | **PLAN** | 30/60/90 milestones defined, dependencies mapped | Structured timeline |
| 3 | **RESOURCE** | Platforms identified, cert ROI analyzed | Resource recommendations |
| 4 | **TRACK** | Metrics defined, tracking system established | Progress tracker |

---

## Phase 1: ASSESS (Current State)

**Gather from user or infer:**

1. **Current Skills** - What do they know already?
2. **Target Goal** - Where do they want to be?
3. **Timeline** - 30, 60, or 90 days?
4. **Constraints** - Work hours, budget, prerequisites?
5. **Learning Style** - Videos, reading, hands-on, structured courses?

**Assessment Questions:**
- What's your current role/experience level?
- What specific skill/domain are you targeting?
- How many hours per week can you dedicate?
- What's your budget for courses/certs?
- Do you prefer structured courses or self-directed learning?

**Phase File:** `phases/01-assess.md`

---

## Phase 2: PLAN (30/60/90 Structure)

**Create phased learning plan:**

### Days 1-30: Foundation
- Core concepts and fundamentals
- Platform onboarding
- Initial quick wins (beginner certs if applicable)
- Build learning routine

### Days 31-60: Building
- Intermediate concepts
- Hands-on labs and practice
- Community engagement
- First portfolio project

### Days 61-90: Application
- Advanced topics
- Major certification (if applicable)
- Portfolio projects
- Real-world application

**Phase File:** `phases/02-plan.md`

---

## Phase 3: RESOURCE (Platforms + Certs)

**Use WebSearch for current information:**

### Free Platforms (Prioritize)

| Platform | Best For | URL |
|----------|----------|-----|
| TryHackMe | Security fundamentals, guided paths | tryhackme.com |
| HackTheBox | Advanced pentesting | hackthebox.com |
| PortSwigger Academy | Web security | portswigger.net/web-security |
| SANS Cyber Aces | Free security training | cyberaces.org |
| Coursera/edX (audit) | General tech courses | coursera.org |
| PentesterLab | Web pentesting | pentesterlab.com |

### Certification ROI Analysis

**For each certification, research:**
- Current cost (exam + training)
- Prerequisites
- Renewal requirements
- Market value (job postings requiring it)
- Time investment

**Common Security Certs (verify current pricing):**
- CompTIA Security+
- CompTIA Network+
- OSCP (OffSec)
- CEH (EC-Council)
- CISSP (ISC2)

**Phase File:** `phases/03-resource.md`

---

## Phase 4: TRACK (Progress Metrics)

**Establish tracking system:**

### Milestone Tracking
- [ ] Week 1: Platform setup, first module complete
- [ ] Week 2: Core concepts understood
- [ ] Week 4: Foundation phase complete
- [ ] Week 8: Building phase complete
- [ ] Week 12: Application phase complete

### Metrics to Track
- Hours studied per week
- Modules/courses completed
- Labs/challenges solved
- Portfolio projects finished
- Certifications earned

### Session Notes Format
```
Date: YYYY-MM-DD
Hours: X
Topics: [what you studied]
Completed: [modules/labs finished]
Blockers: [what you're stuck on]
Next: [what to focus on next session]
```

**Phase File:** `phases/04-track.md`

---

## Output Structure

**EXACTLY these files. No extras.**

### Standard Learning Roadmap
```
private/output/mentorship/{Goal}-{YYYY-MM-DD}/
├── metadata.json           # Learning progress tracking
├── LEARNING-ROADMAP.md     # Full 30/60/90 plan
├── RESOURCES.md            # Platforms, courses, certifications
└── PROGRESS-TRACKER.md     # Milestones and tracking template
```

### Job Preparation Mode (add these)
```
private/output/mentorship/{Goal}-{YYYY-MM-DD}/
├── (all standard files above)
├── ALTERNATIVE-PATHS.md    # Entry-level alternatives, lateral moves, backup strategies
└── JOB-SEARCH-STRATEGY.md  # Companies, job boards, networking, salary research
```

**DO NOT create:** README.md, summary files, or any files not listed above.

---

## metadata.json Schema

```json
{
  "goal": "{learning goal}",
  "target_role": "{target job/skill}",
  "mode": "{detected mode}",
  "started_at": "YYYY-MM-DDTHH:MM:SS",
  "timeline_days": 30|60|90,
  "hours_per_week": 0,
  "phase": "assess|plan|resource|track|complete",
  "current_day": 0,
  "milestones": {
    "completed": 0,
    "total": 0
  },
  "certifications": {
    "target": [],
    "completed": []
  },
  "learning_platforms": [],
  "portfolio_projects": [],
  "key_gaps": []
}
```

---

## Web Search Requirements

**ALWAYS use WebSearch for:**
- Current certification pricing and requirements
- Latest platform content/paths
- Job market skill demands
- Industry trends

**Search patterns:**
- `"{certification} exam cost {current_year}"`
- `"{certification} prerequisites requirements"`
- `"best free {skill} learning platforms {current_year}"`
- `"{target_role} required skills job postings"`

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Unclear goal | Ask clarifying questions |
| No timeline specified | Default to 90 days |
| Budget unknown | Prioritize free resources |
| WebSearch unavailable | Use knowledge base + note limitation |

---

## File Management

**What belongs in `skills/mentorship/docs/`:**
- How-to guides for using this skill
- API or integration reference documentation
- Command reference and workflow explanations
- Troubleshooting guides
- Setup and configuration guides

**What does NOT belong here:**
- Audit reports or assessment logs → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update /private/docs/active-tracker.md instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → /private/output/mentorship/
- Engagement input → /private/input/mentorship/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/mentorship/`
- Output data: `/private/output/mentorship/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---
---

**Version:** 2.0
**Last Updated:** 2026-02-08
**Status:** Active
**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
