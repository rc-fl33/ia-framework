> **⛔ ROUTING GATE - READ THIS FIRST**
>
> **Check the `agent:` field in frontmatter below.**
> If agent is NOT `none` AND you are NOT that agent → STOP and delegate:
>
> ```
> Task(subagent_type="{agent}", prompt="Execute {skill-name} skill. Request: {user_request}")
> ```
>
> DO NOT: Read files, search web, create todos, or execute workflows.
> STOP HERE. DELEGATE NOW.

---

```yaml
name: skill-name
description: One-line description of what this skill does
agent: advisor|engineer|security|writer|legal|none
version: 1.0
classification: private  # Default: private until approved for public release
last_updated: YYYY-MM-DD
effort_default: STANDARD
env_required: true|false
env_keys: []  # If env_required: true, list key names here: [API_KEY_NAME, AUTH_TOKEN, etc]
```

> **FOR AI AGENTS:** Brief description of capability and when to load.
> Load when: [specific triggers]

---

# Skill Name

**One-line purpose statement**

---

## Effort Classification

```
┌─────────────────────────────────────────────────────────┐
│                    TASK RECEIVED                         │
└───────────────────────┬─────────────────────────────────┘
                        │
                        ▼
        ┌───────────────────────────────┐
        │   Is this a single action?    │
        │   (obvious answer, no deps)   │
        └───────────────┬───────────────┘
                        │
           ┌────────────┴────────────┐
           │                         │
           ▼                         ▼
    ┌─────────────┐           ┌─────────────────────┐
    │    YES      │           │        NO           │
    │   QUICK     │           └──────────┬──────────┘
    │ (direct)    │                      │
    └─────────────┘                      ▼
                              ┌─────────────────────┐
                              │ Complex/critical?   │
                              │ Research needed?    │
                              │ Multiple files?     │
                              └──────────┬──────────┘
                                         │
                              ┌──────────┴──────────┐
                              │                     │
                              ▼                     ▼
                       ┌─────────────┐       ┌─────────────┐
                       │     NO      │       │    YES      │
                       │  STANDARD   │       │  THOROUGH   │
                       │ (TodoWrite) │       │ (PlanMode)  │
                       └─────────────┘       └─────────────┘
```

| Level | When | Native Tool | Capabilities |
|-------|------|-------------|--------------|
| **QUICK** | Single action, obvious answer | Direct response | No gates needed |
| **STANDARD** | Normal complexity | TodoWrite | Full workflow with criteria tracking |
| **THOROUGH** | Complex, research needed | **EnterPlanMode** | User approval required before execution |

**THOROUGH = MUST call EnterPlanMode before ANY execution.**

---

## Pre-flight Checklist (MANDATORY)

**STOP! Before executing this skill:**

- [ ] Verified agent routing (delegated if needed)
- [ ] Classified effort level (QUICK/STANDARD/THOROUGH)
- [ ] If THOROUGH → Called EnterPlanMode
- [ ] Read this SKILL.md completely
- [ ] Created Success Criteria (if STANDARD+)

**VIOLATION:** Skipping routing or effort classification invalidates output.

---

## USE WHEN

**Invoke this skill when:**
- User says "[trigger phrase 1]"
- User says "[trigger phrase 2]"
- User wants [specific outcome]

**DO NOT use when:** (redirect to alternative)
- [Anti-pattern 1] → Use `/alternative-command` instead
- [Anti-pattern 2] → Use `/other-command` instead
- [Anti-pattern 3] → Not this skill's scope

---

## Quick Start

```
/command-name
/command-name with specific context
```

**Output:** `private/output/{skill-name}/{topic}-{YYYY-MM-DD}.md`

---

## Environment Setup

{{#if env_required}}
### Required Credentials

This skill requires the following API keys/credentials to function:

- `[API_KEY_NAME_1]` - Authentication for [Service Name]
- `[API_KEY_NAME_2]` - Optional credential for [Service Name]

### Setup Instructions

See `../../../private/docs/env-setup.md` for complete setup procedures:
1. Obtain API credentials from required services
2. Add credentials to `.env.structure.yaml`
3. Update `.env` with actual values
4. Verify: `source .env && echo $API_KEY_NAME`

**Required before using:** All credentials must be configured in `.env`

{{else}}

This skill uses internal resources only - no external API credentials required.

{{/if}}

---

## Decision Tree

```
What does the user need?
│
├── [Option A]
│   └── Route to: workflows/phases/01-[PHASE].md
│
├── [Option B]
│   └── Route to: workflows/phases/01-[PHASE].md
│
└── [Option C]
    └── Route to: workflows/phases/01-[PHASE].md
```

---

## Workflow Phases (5 Universal)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│UNDERSTAND│────▶│  PLAN   │────▶│ EXECUTE │────▶│ VERIFY  │────▶│  LEARN  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ GATE: "Do I │ GATE: "Is   │ GATE: "Is   │ GATE: "Did  │ GATE: "Can  │
│ have 2+     │ plan        │ each row    │ I verify    │ user rate   │
│ criteria?"  │ approved?"  │ DONE?"      │ each one?"  │ this?"      │
└─────────────────────────────────────────────────────────────────────────┘
```

| Phase | Domain Name | Gate | Output |
|-------|-------------|------|--------|
| 1 | [UNDERSTAND-NAME] | 2+ criteria rows exist | Success Criteria table |
| 2 | [PLAN-NAME] | Plan approved (or effort < THOROUGH) | Sequenced steps |
| 3 | [EXECUTE-NAME] | All rows DONE or ADJUSTED | Deliverables |
| 4 | [VERIFY-NAME] | Each completion verified | Verification evidence |
| 5 | [LEARN-NAME] | User can rate output | Feedback captured |

**Phase Gate Rule:** Each gate MUST pass before advancing. No skipping.

---

## Success Criteria Tracking

**For STANDARD+ effort, use TodoWrite to track criteria:**

```markdown
## Success Criteria: [Request Summary]

**Effort:** [LEVEL] | **Phase:** [PHASE]

| # | What Ideal Looks Like | Source | Status |
|---|------------------------|--------|--------|
| 1 | [Requirement] | EXPLICIT | PENDING |
| 2 | [Inferred req] | INFERRED | PENDING |
| 3 | [Standard] | IMPLICIT | PENDING |
```

**Source:** EXPLICIT (user said), INFERRED (from context), IMPLICIT (standards)
**Status:** PENDING → ACTIVE → DONE | ADJUSTED | BLOCKED

---

## Agent Delegation

| Phase | Agent | Capability Used |
|-------|-------|-----------------|
| 1 | [agent] | [capability skill] |
| 2 | [agent] | [capability skill] |
| 3 | [agent] | [capability skill] |

---

## Commands

| Command | Description | Workflow |
|---------|-------------|----------|
| `/command-1` | [description] | Full workflow |
| `/command-2` | [description] | Partial workflow |

---

## Input/Output Locations

**User Input:**
```
private/input/{skill-name}/
├── [input-file-1]
└── [input-file-2]
```

**Skill Documentation (bundled):**
```
skills/[skill-name]/docs/
├── [domain-knowledge-1].yaml
└── [domain-knowledge-2].md
```

**Output:**
```
private/output/{skill-name}/
├── {topic}-{YYYY-MM-DD}.md
└── metadata.json
```

---

## Content Extraction Rules (CRITICAL)

**Keep SKILL.md well-structured.** Extract detailed content to `docs/` files when sections become unwieldy, but prioritize clarity over brevity.

### When to Extract Content to docs/

**Extract if ANY of these apply:**

1. **Size threshold:** Section exceeds 30 lines
2. **Implementation details:** API usage, CLI syntax, configuration examples
3. **Reference material:** Command references, style guides, templates
4. **Dependencies:** Installation steps, setup procedures, troubleshooting
5. **Approaching limit:** SKILL.md approaching 450 lines (warning zone)

### What Stays in SKILL.md

**Keep these sections in SKILL.md:**

- Frontmatter and routing gate
- Core workflow (phases/decision tree)
- Quick start examples (5-10 lines max)
- Success criteria and gates
- **References** to docs/ files with brief summaries

### How to Reference docs/ Files

**Pattern: Brief summary + reference link**

```markdown
## Dependencies

**Required:** Tool A, Tool B
**Optional:** Tool C (for feature X)

**Complete documentation:** `docs/dependencies.md` (includes installation, usage, error recovery)
```

### Real-World Example

❌ **WRONG** - Bloated SKILL.md (580 lines):
```markdown
## Marp Slide Templates

### Template Files
| Theme | File | Background |
... 50 lines of template details ...

### Usage
1. Read template
2. Copy frontmatter
... 30 lines of instructions ...
```

✅ **CORRECT** - Extracted to docs/ (412 lines):
```markdown
## Marp Slide Templates

**Template files:** `templates/marp-dark-theme.md` | `templates/marp-light-theme.md`

**Complete documentation:** `docs/slides-and-marp.md` (includes slide structure, image placement, class directives)
```

### docs/ File Organization

```
docs/
├── setup-guide.md           # Installation, configuration
├── api-reference.md         # API/CLI usage examples
├── dependencies.md          # External tool documentation
├── troubleshooting.md       # Error recovery
└── [feature]-guide.md       # Feature-specific details
```

**Guidance:** Well-structured documentation of any length is fine. Extract to docs/ when sections become unwieldy.

---

## Documentation Files

| File | Purpose |
|------|---------|
| `docs/[file-1].md` | [purpose] |
| `docs/[file-2].yaml` | [purpose] |
| `workflows/phases/01-[PHASE].md` | [purpose] |

---

## Error Recovery

| Error | Recovery Action |
|-------|-----------------|
| [Error 1] | [Action] |
| [Error 2] | [Action] |
| [Error 3] | [Action] |

---

## Verification Checklist (Definition of Done)

**Before reporting completion, verify ALL items:**

- [ ] Agent routing verified (or delegated)
- [ ] Effort classified and appropriate tools used
- [ ] All Success Criteria rows DONE or ADJUSTED
- [ ] All workflow phases completed
- [ ] All gates passed
- [ ] Output saved to correct location
- [ ] User can verify/rate result

**If ANY checkbox fails, the task is NOT complete.**

---

## Related Skills

- `/related-command-1` - [relationship]
- `/related-command-2` - [relationship]

---

## Directory Structure

```
skills/[skill-name]/
├── SKILL.md              # This file (main entry)
├── README.md             # Overview for users
├── VERIFY.md             # Definition of Done checklist
├── STATUS.md             # Skill status and session tracking
├── phases/               # Problem-specific phase files
│   ├── 01-[PHASE].md
│   ├── 02-[PHASE].md
│   └── ...
├── workflows/            # Alternative to phases (use one or the other)
│   └── [workflow].md
├── docs/                 # Domain knowledge (renamed from reference/)
│   └── [domain-knowledge].md
├── commands/             # Symlinked to /commands/
│   └── [command].md
├── templates/            # Output templates
│   └── [template].md
├── scripts/              # TypeScript automation (optional)
│   └── index.ts
├── assets/               # Skill assets (images, etc.)
│   └── [asset-files]
└── (Data stored in /private/)
```

**Note:** User data and skill output are stored in centralized locations to keep the skills/ directory lightweight. See **Data Locations** section below.

## Data Locations

All skill data is stored outside the `skills/` directory to keep it lightweight and maintainable.

**This skill's data lives in:**

- **Input:** `/private/input/{skill}/` - User-provided data for this skill
- **Output:** `/private/output/{skill}/` - Skill-generated deliverables
- **Reference books:** See `private/docs/book-catalog.md` for discovery (search by tag or domain)

**What belongs in `skills/{skill}/docs/`:**
- How-to guides for using this skill
- API or integration reference documentation
- Command reference and workflow explanations
- Troubleshooting guides
- Setup and configuration guides

**What does NOT belong here:**
- Audit reports or assessment logs → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update `/private/docs/active-tracker.md` instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → `/private/output/{skill}/`
- Engagement input → `/private/input/{skill}/`
- Working notes from development → delete (git history captures work)

**Directory structure:**
```
skills/{skill-name}/
├── SKILL.md                  # Main skill documentation (THIS FILE)
├── docs/                     # How-to guides (in skills/ directory)
│   ├── workflow-guide.md
│   ├── api-reference.md
│   └── troubleshooting.md
│
/private/input/{skill-name}/  # User input data (in private/ directory)
├── target-list.md
└── requirements.md
│
/private/output/{skill-name}/ # Skill output/deliverables (in private/ directory)
├── findings/
│   ├── FINDING-001.md
│   └── FINDING-002.md
└── reports/
    └── final-report.md
│
/private/books/{domain}/      # Reference materials (discover via private/docs/book-catalog.md)
├── {book-name}/
│   ├── page-001.md
│   └── page-002.md
```

---

**Version:** 1.0
**Last Updated:** YYYY-MM-DD
**Status:** [Active|Draft|Deprecated]
