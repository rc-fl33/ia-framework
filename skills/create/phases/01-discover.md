---
domain: framework
skill: create-skill
agent: base-claude
model: haiku
mode: single-agent
complexity: low
chain_position: first
---

# Phase 1: DISCOVER (Requirements Gathering) — Reference Document

> **This phase runs inline by Base Claude in the main conversation, NOT inside a Task() agent.**
> Base Claude reads this file as a reference for what questions to ask and how to structure the requirements bundle. The actual execution happens in `skills/create/commands/create.md` Step 3.

## IDENTITY

**Agent:** Base Claude (inline execution — owns user interaction directly)

**Phase-specific role:** Collect all requirements needed to create a new skill or tool through inline AskUserQuestion calls. Gather component type, name, description, purpose, workflows, agent, command, visibility, and credential needs.

**Additional constraints:** Use AskUserQuestion for every decision. Never assume requirements. All new skills default to `classification: private` unless explicitly approved. Batch questions into rounds to minimize back-and-forth.

---

## INPUT CONTRACT

**Receives:**
- Proposed name from command (may be empty)
- Optional `component_type` hint from `--tool` flag

**Prerequisites:**
- `/create` command invoked
- Name and flags extracted (create.md Steps 1-2)

**Source:** `skills/create/commands/create.md`

**What happens if input is missing:** If no name proposed, Round 1 asks for it. If no component_type hint, Round 1 asks for it.

---

## OBJECTIVE

**Goal:** Gather complete requirements to create a properly structured skill or tool.

**Success criteria:**
- Component type selected (skill or tool)
- Folder name collected
- Description collected
- Problem/solution collected
- Workflows/modes defined (SKILL ONLY)
- Agent selection made (SKILL ONLY)
- Command decision made
- Visibility decision made
- ENV/credential requirements assessed

**Failure criteria:**
- User abandons mid-gathering → preserve what was collected

---

## METHODOLOGY

Requirements gathering uses structured questions with sensible defaults. Questions are ordered from identity (what is it?) to practical (how does it integrate?).

**Batched into 2-4 rounds** (skip rounds where all questions are already answered):

### Round 1 — Identity (skip questions already answered by flags/args)

**Questions:**
- **Component type** (skip if `--tool` flag): "What are you creating?"
  - Skill (Recommended) — Multi-phase workflow producing deliverables
  - Tool — Infrastructure utility for framework operations
- **Name** (skip if provided in command): Folder name, lowercase-with-dashes
  - Skill: folder under `skills/`
  - Tool: folder under `tools/`
- **Description**: One-line summary of what this component does

### Round 2 — Purpose

**Questions:**
- **Problem**: "What problem does this solve?"
- **Solution**: "How does it solve it?"

### Round 3 — Skill-specific (SKIP entirely for tools)

**Questions:**
- **Workflows/modes**: "What workflows or modes will this skill have?"
  - Examples: "research, draft, qa, publish" or "assess, report, remediate"
  - Default: generic 5-phase (discover, design, generate, validate, handoff)
- **Agent routing**: "Which agent should run this skill?"
  - security — Pentesting, code review, vulnerability assessment
  - engineer — Infrastructure, remediation, hardening
  - writer — Blog posts, documentation, reports
  - advisor — Research, career, QA review
  - legal — Compliance, legal analysis
  - none — Base Claude executes directly

### Round 4 — Configuration

**Questions:**
- **User-facing command**: "Should this have a slash command?"
  - Yes (Recommended) — Create /command for users to invoke
  - No — Claude-internal only (invoked by other skills)
- **Command name** (if yes): Both matching and different names from folder are valid
- **Visibility**: "What visibility?"
  - Private (Recommended) — Default for all new components
  - Public — Only for approved general-purpose components
- **ENV/credential requirements**: "Does this need external API credentials?"
  - No external APIs — Uses internal resources only
  - Yes, requires credentials — Will document what's needed
  - Unsure — Will determine during implementation

### Automatic Derivation (NOT a user question)

Based on ENV answers, derive:
```
If env_required: true OR has non-trivial external dependencies → needs_setup_command: true
Default: true (safer to generate an unused command than miss a needed one)
```

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| Requirements bundle (all answers) | Structured text | Task(engineer) via create.md Step 4 |

**Requirements bundle structure:**
- `component_type`: skill or tool
- `name`: lowercase-with-dashes
- `description`: one-line
- `problem`: pain statement
- `solution`: approach
- `workflows`: comma-separated list (skill only, null for tools)
- `agent`: selected agent or "none" (skill only, null for tools)
- `has_command`: true/false
- `command_name`: name or null
- `classification`: private/public
- `env_required`: true/false
- `env_keys`: list of credential keys (if applicable)
- `needs_setup_command`: true/false (derived)

---

## NEXT

**On success:** → Base Claude packages bundle and delegates to Task(engineer) for Phases 2-5
  Pass: Complete requirements bundle

**On failure:** → STOP
  Reason: User abandoned requirements gathering

---

## CHECKPOINTS

- [ ] Component type selected (skill or tool)
- [ ] Folder name collected
- [ ] Description collected
- [ ] Problem/solution collected
- [ ] Workflows/modes defined (skill only)
- [ ] Agent selection made (skill only)
- [ ] Command decision made
- [ ] Visibility decided
- [ ] ENV requirements assessed
- [ ] Setup command need derived (needs_setup_command)

**Error recovery:**
- User skips question → Re-ask with explanation of why it's needed
- Invalid name → Explain lowercase-with-dashes format
- Skill already exists → Suggest different name or offer to edit existing
- Tool already exists → Suggest different name or offer to edit existing

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
