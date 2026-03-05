---
domain: career-development
skill: mentorship
agent: advisor
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 3: RESOURCE (Platforms + Certification ROI)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Research learning platforms and analyze certification ROI using WebSearch for current pricing. Map resources to the roadmap phases from Phase 2. Prioritize free platforms before paid options. In Job Preparation mode, also create JOB-SEARCH-STRATEGY.md.

**Additional constraints:** ALWAYS use WebSearch for certification pricing — costs change frequently. Never recommend expensive bootcamps ($10K+) without job guarantees. Portfolio projects demonstrate skills better than certifications — weight recommendations accordingly.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Assessment data | Phase 1 | `metadata.json` |
| Learning roadmap | Phase 2 | `LEARNING-ROADMAP.md` |
| Mode | Phase 1 | In metadata.json |

**Prerequisites:**
- [ ] Phase 2 completed — roadmap with phases and milestones defined

**Source:** `skills/mentorship/phases/02-plan.md`

**What happens if input is missing:** STOP — cannot recommend resources without a roadmap.

---

## OBJECTIVE

**Goal:** Identify learning platforms, analyze certification ROI, and map resources to roadmap phases.

**Success criteria:**
- Free platforms identified and prioritized for each roadmap phase
- Paid options listed with current costs (from WebSearch)
- Certification ROI analyzed for relevant certs
- Resources mapped to Month 1/2/3 phases
- Communities identified for networking
- In Job Preparation mode: JOB-SEARCH-STRATEGY.md also created

**Failure criteria:**
- No WebSearch attempted → must search for current pricing
- Resources not mapped to roadmap phases → revise

---

## METHODOLOGY

**Free First** — Always list free platforms before paid. Many high-quality platforms offer free tiers.

**WebSearch Required** — Certification costs, platform pricing, and job market data change frequently. Always verify with current search.

**ROI Calculation:**
```
Expected salary increase > (exam cost + training cost + time value)
within 6-12 months = PURSUE
Otherwise = SKIP or DEFER
```

**De-prioritize:** Expensive bootcamps without guarantees, certs without market demand, theory-heavy courses without labs, outdated materials.

---

## EXECUTION

### Step 1: WebSearch for Current Data

**Tool:** WebSearch

Search for current information on:
- `"{certification} exam cost {current_year}"` — for each target cert
- `"{certification} prerequisites requirements"` — for entry requirements
- `"best free {skill} learning platforms {current_year}"` — for platform options
- `"{target_role} required skills job postings"` — for market demand

### Step 2: Free Platforms (Prioritize)

**Tool:** Direct analysis + WebSearch

Identify free platforms relevant to the user's domain:

**Security:** TryHackMe, HackTheBox, PortSwigger Academy, PentesterLab, OverTheWire, picoCTF, SANS Cyber Aces

**General Tech:** freeCodeCamp, Codecademy (free tier), Coursera (audit), edX (audit), YouTube, GitHub Learning

**Communities:** Discord servers, Reddit, X/Twitter practitioners, local meetups

### Step 3: Certification ROI Analysis

**Tool:** WebSearch + Direct analysis

For each certification considered:

| Factor | Question | Research Method |
|--------|----------|-----------------|
| Job posting frequency | How often required? | WebSearch job boards |
| Salary differential | With cert vs without? | WebSearch salary data |
| Cost | Exam + training + time? | Official vendor site |
| Difficulty | Pass rate, prep time? | Forums, community data |
| Market recognition | Do employers know it? | Job postings |

Verdict: PURSUE / SKIP / DEFER with rationale.

### Step 4: Map Resources to Roadmap

**Tool:** Direct analysis

Assign resources to each roadmap phase:
- **Month 1:** Foundation platforms, community onboarding, tool setup
- **Month 2:** Intermediate platforms, project tutorials, networking
- **Month 3:** Advanced platforms, certification prep, job search resources

### Step 5: Write RESOURCES.md

**Tool:** Write
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/RESOURCES.md`

### Step 6: Update Status Checkpoint

**Tool:** Edit
**File:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/_status.yaml`

Update:
- `phases[3].status` → `"complete"`
- `phases[3].completed_at` → now
- `phases[3].gate_result` → `"passed"`
- `phases[3].gate_details` → `{ platforms_identified: {count}, certs_analyzed: {count} }`
- `phases[3].deliverables` → `["RESOURCES.md"]` (add `"JOB-SEARCH-STRATEGY.md"` if job mode)
- `phases[4].status` → `"in_progress"`
- `current_phase` → `4`
- `next_actions` → `["Create progress tracking system with milestones"]`
- `updated_at` → now

### Step 7: Write JOB-SEARCH-STRATEGY.md (Job Preparation mode only)

**Tool:** Write (conditional)
**Location:** `private/output/mentorship/{Goal}-{YYYY-MM-DD}/JOB-SEARCH-STRATEGY.md`

If mode is Job Preparation, create job search strategy with:
- Target companies (by size, industry, culture)
- Job boards and search strategies
- Networking approach (conferences, meetups, LinkedIn)
- Salary research and negotiation guidance
- Application timeline aligned with roadmap

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| `RESOURCES.md` | Platforms, certs, communities mapped to roadmap | Phase 4, User |
| `JOB-SEARCH-STRATEGY.md` (job mode) | Job search strategy with companies and timeline | User |

---

## NEXT

**On success:** → Load `skills/mentorship/phases/04-track.md`

**On failure:**
- WebSearch unavailable → Use knowledge base, note "verify current pricing" limitation
- Pricing outdated → Note "verify current pricing" on each item
- Unknown certification → Research or skip
- Budget zero → Focus entirely on free resources

---

## CHECKPOINTS

- [ ] WebSearch used for current certification pricing
- [ ] Free platforms identified for each roadmap phase
- [ ] Paid options listed with costs
- [ ] Certification ROI analyzed with PURSUE/SKIP/DEFER verdicts
- [ ] Resources mapped to Month 1/2/3
- [ ] Communities identified
- [ ] RESOURCES.md written
- [ ] JOB-SEARCH-STRATEGY.md written (if job mode)

**Error recovery:**
- WebSearch unavailable → Use knowledge base, note limitation
- Pricing outdated → Note "verify current pricing"
- Unknown certification → Research or skip
- Budget zero → Focus entirely on free resources

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
