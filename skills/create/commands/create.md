---
name: create
description: Interactive creation wizard for skills and tools - gathers requirements inline, then delegates generation to engineer agent
domain: framework
skill: create
agent: base-claude
model: haiku
complexity: low
mode: single-agent
chain_position: first
---

# /create — Create New Skill or Tool

## IDENTITY

**Agent:** Base Claude (interactive command — owns user interaction, delegates execution)

**Role:** Run Phase 1 discovery inline using AskUserQuestion to gather all requirements, then delegate Phases 2-5 to `Task(subagent_type="engineer")` with a complete requirements bundle. The sub-agent never needs to ask the user anything.

**Note:** Phase 1 questions are defined in `phases/01-discover.md` (used as reference). Phases 2-5 are executed by the engineer agent via `phases/00-workflow.md`.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/create` with optional name and optional `--tool` flag
- Optional: Existing partial skill/tool directory from a prior run

**Prerequisites:**
- User has invoked `/create`

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Gather complete requirements through inline interaction, then delegate component creation to the engineer agent.

**Success criteria:**
- All requirements gathered via AskUserQuestion (Phase 1 complete)
- Requirements bundle passed to Task(engineer) for Phases 2-5
- Engineer agent returns completed component
- User presented with handoff summary

**Failure criteria:**
- User abandons during discovery → preserve what was collected
- Engineer agent returns conflict → resolve with user, re-delegate

---

## METHODOLOGY

**Architecture:** Base Claude owns all user interaction. The engineer agent runs inside Task() and never needs to ask the user anything.

```
/create → Base Claude runs Phase 1 inline (AskUserQuestion)
        → packages requirements bundle
        → Task(engineer) runs Phases 2-5 with complete context
        → Base Claude presents handoff to user
```

**Discovery uses batched rounds** to minimize back-and-forth while keeping questions contextual. Skip questions already answered by flags/args.

---

## EXECUTION

### Step 1: Extract Name and Flags (if provided)

**Tool:** Direct analysis

If user typed `/create my-skill`, extract "my-skill" as the proposed name.
If user typed `/create --tool my-tool`, extract "my-tool" and set `component_type: tool`.
If user typed just `/create`, discovery rounds will ask for it.

**Expected output:** Proposed name (or "no name provided") + component_type hint (if `--tool` flag present)
**On failure:** Proceed — discovery rounds handle full requirements gathering

### Step 2: Detect Fresh vs. Resume

**Tool:** Glob

If a name was provided, check if `skills/{name}/` or `tools/{name}/` already exists (partially created).

**Expected output:** "FRESH" or "RESUME — partial component exists at [path]"
**On failure:** Default to fresh start

### Step 3: Run Discovery Inline (Phase 1)

**Reference:** Read `skills/create/phases/01-discover.md` for question definitions.

Run Phase 1 discovery inline using AskUserQuestion. Batch questions into 2-4 rounds. Skip questions already answered by flags/args from Step 1.

**Round 1 — Identity** (skip questions already answered):
- Component type: skill or tool (skip if `--tool` flag)
- Name: folder name, lowercase-with-dashes (skip if provided in command)
- Description: one-line summary

**Round 2 — Purpose:**
- Problem: what problem does this solve?
- Solution: how does it solve it?

**Round 3 — Skill-specific** (SKIP entirely for tools):
- Workflows/modes (e.g., "research, draft, qa, publish")
- Agent routing (security, engineer, writer, advisor, legal, none)

**Round 4 — Configuration:**
- User-facing command: yes/no (and command name if yes)
- Visibility: private (default) or public
- ENV/credential requirements: none, yes (list keys), or unsure

**Batching rules:**
- Use AskUserQuestion with multiple questions per round where possible
- Skip rounds that have no unanswered questions
- For tools: skip Round 3 entirely (no workflows/agent routing)
- Derive `needs_setup_command` automatically from ENV answer (not a user question)

**Expected output:** Complete requirements bundle:
```
component_type: skill|tool
name: lowercase-with-dashes
description: one-line
problem: pain statement
solution: approach
workflows: comma-separated (skill only, null for tools)
agent: selected agent or "none" (skill only, null for tools)
has_command: true/false
command_name: name or null
classification: private/public
env_required: true/false
env_keys: list (if applicable)
needs_setup_command: true/false (derived)
```

**On failure:** Re-ask unclear questions. If user abandons, preserve partial answers.

### Step 4: Delegate Execution (Phases 2-5)

**Tool:** Task(subagent_type="engineer")

Package the complete requirements bundle and spawn the engineer agent:

```
Task(subagent_type="engineer", prompt="""
**TASK TYPE: TECHNICAL IMPLEMENTATION**

Create a new {component_type} using the /create workflow (Phases 2-5).

**WHAT YOU'RE DOING:**
- Read skills/create/phases/00-workflow.md for orchestration
- Execute Phases 2-5 (design, generate, validate, handoff)
- Phase 1 is ALREADY COMPLETE — use the requirements bundle below

**WHAT YOU'RE NOT DOING:**
- Do NOT ask the user any questions — all requirements are provided
- Do NOT run Phase 1 discovery — it's already done
- If you encounter a naming conflict, STOP and return the conflict details

**REQUIREMENTS BUNDLE:**
{complete requirements bundle from Step 3}

**INPUT/OUTPUT:**
- Source: skills/create/phases/00-workflow.md (orchestrator)
- Target: {skills|tools}/{name}/ (component directory)

**QUALITY:** All required files created, validation passes, structure matches standards.

This is TECHNICAL IMPLEMENTATION work. Proceed.
""")
```

**Expected output:** Engineer agent returns with completed component or conflict details
**On failure:** If conflict returned, proceed to conflict resolution (see Error Recovery)

### Step 5: Present Results

When the engineer agent returns successfully:

1. Present the handoff summary (what was created, where files live)
2. Show next steps (how to customize, how to invoke)
3. Ask if the user wants any adjustments

If the engineer agent returned a naming conflict:
1. Present the conflict details to the user
2. Use AskUserQuestion to get a new name
3. Update the requirements bundle
4. Re-delegate to Task(engineer) with updated bundle

---

## OUTPUT CONTRACT

| Data | Location | Format | Consumed by |
|------|----------|--------|-------------|
| Requirements bundle | Passed to Task(engineer) | Structured text | Phase 0 (workflow) |
| Completed component | skills/{name}/ or tools/{name}/ | Directory | User |

---

## NEXT

**On success:** Component created. User informed of next steps.

**On failure:** STOP with guidance.

```
To create a new skill or tool:
  /create
  /create my-skill-name
  /create --tool my-tool-name
```

---

## ERROR RECOVERY

**Naming conflict from engineer agent:**
1. Engineer returns conflict details (e.g., "directory already exists for that name")
2. Base Claude presents conflict to user via AskUserQuestion
3. User provides new name
4. Base Claude updates requirements bundle
5. Re-delegate to Task(engineer) with updated bundle

**User abandons mid-discovery:**
- Preserve partial answers collected so far
- Inform user they can resume with `/create {name}` if partial directory exists

---

## CHECKPOINTS

- [ ] Name and flags extracted (Step 1)
- [ ] Fresh vs. Resume determined (Step 2)
- [ ] All requirements gathered inline (Step 3)
- [ ] Requirements bundle delegated to engineer (Step 4)
- [ ] Results presented to user (Step 5)

---

## Usage

```
/create
/create my-skill-name
/create --tool my-tool-name
```

## When to Use

**Use /create when:**
- Adding new specialized capability to the framework (skill)
- Building a workflow-driven skill with phases
- Creating a skill that will be loaded by an agent
- Creating an infrastructure tool (with `--tool` flag)
- Adding a new tool to the `tools/` directory

**Don't use if:**
- Creating just a command → use COMMAND-TEMPLATE.md
- Creating an agent → use `docs/templates/agent-template.md`

---

## Related Commands

- `/setup` — Install and configure the framework

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0 — Interactive Command
