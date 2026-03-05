---
name: write
description: Generic content writing workflow with QA gates, reusable for any documentation
agent: writer
version: 2.0
classification: public
last_updated: 2026-02-08
effort_default: STANDARD
mode: single-agent
env_required: true
env_keys: [OPENROUTER_API_KEY]
---

> **SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> **STOP.** This skill requires the `writer` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Research | `writer` | Source gathering and validation |
> | 2 - Draft | `writer` | Content writing with brand voice |
> | 3 - QA | `writer` | Quality assurance (5.0/5.0 gate) |
> | 4 - Visuals | `writer` | Optional image generation |
> | 5 - Output | `writer` | Format export and delivery |
>
> **Identity check:** If you are NOT the writer agent → DELEGATE NOW:
>
> ```typescript
> Task(subagent_type="writer", prompt="Execute write skill. Request: {user_request}")
> ```
>
> **Path 1 - Simple (Tier 1/Haiku):** Writing templates, style guides, formatting advice
> - Handle directly, no delegation needed
>
> **Path 2 - Complex (Writer Agent):** Full content with research and QA
> - Requires 5-phase pipeline with writer agent

---

# Write Skill

**Generic content writing workflow with research validation, QA gates, and format flexibility.**

---

## Chain Map

```
COMMANDS                        PHASES
========                        ======

/write ──▶ 00-workflow ──▶ 01-research ──▶ 02-draft ──▶ 03-qa ──▶ 04-visuals ──▶ 05-output
                        (10+ sources)   (brand voice) (5.0/5.0)  (optional)     (export)

/write-research ──▶ topic discovery ──▶ redirect to /write
```

---

## Effort Classification

```
TASK RECEIVED
     │
     ▼
Is this a single action?
(obvious answer, no deps)
     │
  ┌──┴──┐
  │     │
  ▼     ▼
 YES    NO
QUICK    │
(direct) ▼
     Complex/critical?
     Research needed?
     Multiple files?
         │
      ┌──┴──┐
      │     │
      ▼     ▼
     NO    YES
  STANDARD  THOROUGH
 (TaskCreate) (PlanMode)
```

| Level | When | Native Tool | Capabilities |
|-------|------|-------------|--------------|
| **QUICK** | Single action, obvious answer | Direct response | No gates needed |
| **STANDARD** | Normal complexity | TaskCreate/TaskUpdate | Full workflow with criteria tracking |
| **THOROUGH** | Complex, research needed | **EnterPlanMode** | User approval required before execution |

**THOROUGH = MUST call EnterPlanMode before ANY execution.**

---

## Pre-flight Checklist (MANDATORY)

- [ ] Verified agent routing (delegated if needed)
- [ ] Classified effort level (QUICK/STANDARD/THOROUGH)
- [ ] If THOROUGH: Called EnterPlanMode
- [ ] Read this SKILL.md completely

**VIOLATION:** Skipping routing or effort classification invalidates output.

---

## USE WHEN

**Invoke this skill when:**
- User wants to write documentation (installation guides, READMEs, technical docs)
- User needs content with brand voice consistency
- User requests content with research and QA validation
- User says "write a document", "create documentation", "/write"

**DO NOT use when:**
- Publishing to Ghost CMS: Use `/ghost` instead (includes CMS-specific workflow)
- Quick edits or minor updates: Use Edit tool directly
- Code documentation: Write inline comments/docstrings directly

---

## Quick Start

```
/write
/write installation guide
/write technical documentation for API
/write --brand fortreum CMMC assessment preparation guide
```

**Output:** `private/output/write/{topic}-{YYYY-MM-DD}.{ext}`

---

## Environment Setup

### Required Credentials

- `OPENROUTER_API_KEY` - For AI image generation capability

### Setup Instructions

See `../../private/docs/infrastructure-inventory.md` for complete setup procedures:
1. Obtain OpenRouter API key from https://openrouter.ai
2. Add credential to `.env`
3. Verify: `source .env && echo $OPENROUTER_API_KEY`

**Note:** Image generation is an optional workflow step - you can skip the VISUALS phase if images are not needed.

---

## Workflow Phases (5 Sequential)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│RESEARCH │────▶│  DRAFT  │────▶│   QA    │────▶│ VISUALS │────▶│ OUTPUT  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
 10+ sources    Brand voice     QA 5.0/5.0      Images         Format
 validated      template        achieved        (optional)     exported
```

| Phase | Domain Name | Gate | Output |
|-------|-------------|------|--------|
| 1 | RESEARCH | 10+ sources validated | research-notes.md, sources.txt |
| 2 | DRAFT | Brand voice template applied | draft.md |
| 3 | QA | Rating 5.0/5.0 achieved | qa-review.json |
| 4 | VISUALS | Images generated (optional) | images/ directory |
| 5 | OUTPUT | Format exported | final output file |

**Phase Gate Rule:** Each gate MUST pass before advancing. No skipping.

---

## Commands

| Command | Description | Workflow | Effort |
|---------|-------------|----------|--------|
| `/write` | Create content with full QA workflow | Full 5-phase workflow | STANDARD |
| `/write-research` | Topic discovery and research preparation | Category selection → topic suggestions → redirect to /write | QUICK |

---

## Input/Output Locations

**User Input:**
```
private/input/write/
├── [content-brief].md
└── [reference-materials]/
```

**Client Brand Guides:**
```
private/docs/write/
└── brand-voice-{client}.md       # Selected via --brand flag
```

**Templates (bundled):**
```
skills/write/templates/
├── brand-voice-template.md       # Default brand guidance
├── brand-voice-custom.md         # IA Framework brand voice
├── content-standards-template.md # Quality standards
├── image-style-template.md       # Visual style config
└── qa-criteria-template.md       # QA requirements
```

**Output:**
```
private/output/write/
├── {topic}-{YYYY-MM-DD}.md
├── {topic}-{YYYY-MM-DD}.html
├── draft.md
├── qa-review.json
├── research/
│   ├── sources.txt
│   └── research-notes.md
└── images/
    └── *.png
```

---

## Documentation Files

| File | Purpose |
|------|---------|
| `../../private/docs/infrastructure-inventory.md` | OpenRouter API setup (for image generation) |
| `docs/template-customization.md` | How to customize brand voice templates |
| `phases/00-workflow.md` | Workflow orchestrator |
| `phases/01-research.md` | Source validation (10+ sources) |
| `phases/02-draft.md` | Writing with brand voice templates |
| `phases/03-qa.md` | QA gate (5.0/5.0 rating) |
| `phases/04-visuals.md` | Optional image generation |
| `phases/05-output.md` | Format export (markdown, HTML, etc.) |

---

## Agent Delegation

| Phase | Agent | Capability Used |
|-------|-------|-----------------|
| 1-5 | writer | Content creation with research and QA |

---

## Error Recovery

| Error | Recovery Action |
|-------|-----------------|
| Fewer than 10 sources | Return to research phase, gather more sources |
| QA rating < 5.0 | Address feedback, revise content, re-run QA |
| Brand voice inconsistent | Apply brand voice template, rewrite sections |
| Image generation fails | Continue without images (optional feature) |
| Export format not supported | Use markdown as fallback |

---

## Verification Checklist (Definition of Done)

- [ ] Agent routing verified (writer agent)
- [ ] Effort classified and appropriate tools used
- [ ] All workflow phases completed
- [ ] All gates passed (10+ sources, brand voice, QA 5.0/5.0)
- [ ] Output saved to correct location
- [ ] User can verify/rate result

**If ANY checkbox fails, the task is NOT complete.**

---

## Directory Structure

```
skills/write/
├── SKILL.md              # This file (main entry)
├── README.md             # Overview for users
├── VERIFY.md             # Definition of Done checklist
├── phases/               # 5-phase workflow files
│   ├── 00-workflow.md    # Orchestrator
│   ├── 01-research.md    # Source validation
│   ├── 02-draft.md       # Writing with templates
│   ├── 03-qa.md          # QA gate
│   ├── 04-visuals.md     # Optional image generation
│   └── 05-output.md      # Format export
├── docs/                 # Documentation
│   ├── env-setup.md      # Credential setup
│   └── template-customization.md  # Template usage guide
├── templates/            # Customizable templates
│   ├── brand-voice-template.md
│   ├── content-standards-template.md
│   ├── image-style-template.md
│   └── qa-criteria-template.md
├── scripts/              # TypeScript automation
│   ├── setup.ts          # Environment setup
│   └── image-generate.ts # Image generation via OpenRouter API
├── commands/             # Symlinked to /commands/
│   ├── write.md
│   └── write-research.md
├── input/                # User-provided resources
└── output/               # Skill-generated deliverables
```

---

## File Management

**What belongs in `skills/write/docs/`:**
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
- Engagement output → /private/output/write/
- Engagement input → /private/input/write/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/write/`
- Output data: `/private/output/write/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---
---

**Version:** 2.0
**Last Updated:** 2026-02-08
**Status:** Active
**Structure:** Universal Prompt Structure v2.0
