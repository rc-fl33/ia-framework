---
domain: framework
skill: create-skill
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Create Workflow — Phases 2-5 Execution

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Execute Phases 2-5 (design, generate, validate, handoff) of the skill/tool creation workflow. You receive a complete requirements bundle from Base Claude — Phase 1 discovery is already done.

**Additional constraints:** Read `docs/skill-structure-standards.md` before Phase 2. Follow templates exactly in Phase 3. You are running inside Task(). You should NOT need to interact with the user. If you encounter a naming conflict, STOP and return the conflict details to Base Claude for resolution.

---

## INPUT CONTRACT

**Receives:**
- Complete requirements bundle from Base Claude (Phase 1 output):
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
  - `needs_setup_command`: true/false

**Prerequisites:**
- Phase 1 discovery is COMPLETE — all requirements gathered by Base Claude inline
- `/create` command has been invoked

**Source:** `skills/create/commands/create.md` (via Task delegation)

**Note:** Phase 1 is handled by Base Claude inline in the main conversation. You receive the complete requirements bundle and execute Phases 2-5 only.

---

## OBJECTIVE

**Goal:** Create a complete, valid skill or tool directory from the provided requirements bundle.

**Success criteria:**
- All 4 remaining phases complete (2-5)
- Target directory contains all required files
  - **Skill:** SKILL.md, README.md, VERIFY.md, STATUS.md, phases/, commands/
  - **Tool:** README.md, VERIFY.md, STATUS.md, scripts/, commands/ (if user-facing)
- Validation passes

**Failure criteria:**
- Naming conflict → STOP and return conflict details to Base Claude
- User abandons creation mid-workflow → preserve partial work

---

## EXECUTION MODEL

**You are running inside Task().** You should NOT need to interact with the user. All requirements have been gathered by Base Claude before delegation.

- If you encounter a naming conflict in Phase 2, STOP and return the conflict details. Do not attempt to resolve it yourself — Base Claude will ask the user and re-delegate.
- If you encounter missing requirements, use sensible defaults rather than blocking.

---

## METHODOLOGY

**Phase detection:** Check which artifacts exist for the target skill/tool to determine current state. Check both `skills/{name}/` and `tools/{name}/` directories.

**Gate enforcement:** Each phase has exit criteria. Verify before proceeding.

**Supporting docs:** Before executing, the agent should be aware of:
- `docs/skill-structure-standards.md` — Directory structure and file requirements
- `docs/naming-conventions.md` — Naming rules
- `docs/phase-workflow-patterns.md` — Multi-phase patterns
- `docs/env-management-patterns.md` — Credential handling

---

## EXECUTION

### Step 1: Detect Current Phase

```
IF naming not validated             → Load 02-design.md (start here for fresh)
ELSE IF files not generated         → Load 03-generate.md
ELSE IF validation not complete     → Load 04-validate.md
ELSE IF handoff not complete        → Load 05-handoff.md
ELSE → Workflow complete
```

**Note:** Phase 1 (01-discover.md) is never loaded here — it runs inline by Base Claude.

### Step 2: Load Phase Prompt

**Tool:** Bash
**Command:** `bun run tools/prompts/render-phase.ts skills/create/phases/0X-{phase}.md`

Render the phase file with dynamic progress tracking. The renderer extracts EXECUTION steps and generates a running checklist.

### Step 3: Execute Phase

Follow the loaded phase prompt. Verify gate criteria before proceeding.

### Step 4: Show Checkpoint

```
PHASE X COMPLETE: {Phase Name}
Summary: {what was accomplished}
Gate: PASSED

→ Ready for Phase X+1: {Next Phase Name}
```

### Step 5: Proceed to Next Phase

Repeat until all phases complete (2→3→4→5).

---

## OUTPUT CONTRACT

**This workflow produces (via its phases):**

| Artifact | Phase | Description |
|----------|-------|-------------|
| Structure plan | Phase 2 | Validated naming, directory layout, phase mapping (skill) or script layout (tool) |
| Component directory | Phase 3 | All files created from templates |
| Validation report | Phase 4 | All checks passed |
| User guidance | Phase 5 | Next steps, how to customize, how to invoke |

**Target directory:** `skills/{name}/` (skill) or `tools/{name}/` (tool)

---

## NEXT

**On workflow complete:** → All files created and validated. Return summary to Base Claude for user presentation.

**On naming conflict:** → STOP. Return conflict details to Base Claude. Do not attempt resolution.

**On phase failure:** → Retry failed phase. If unrecoverable → preserve partial work, return error details.

---

## CHECKPOINTS

- [ ] Phase 2 (Design) executed — naming validated, structure planned
- [ ] Phase 3 (Generate) executed — all files created
- [ ] Phase 4 (Validate) executed — validation passed
- [ ] Phase 5 (Handoff) executed — summary prepared
- [ ] Target directory has all required files

**Critical rules:**
1. NEVER run Phase 1 — it's already complete
2. Execute phases in order 2→3→4→5
3. Follow templates exactly — use files from `skills/create/templates/`
4. ALWAYS show checkpoint output after each phase
5. If naming conflict → STOP and return to Base Claude

---

## Chain Map

```
/create (command — base-claude, haiku)
    │
    ├→ Phase 1: INLINE by Base Claude (AskUserQuestion)
    │   └→ Requirements bundle gathered
    │
    ▼
phases/00-workflow.md (this file — engineer, sonnet, inside Task)
    │
    ├→ phases/02-design.md    → Structure plan validated
    ├→ phases/03-generate.md  → Files created (skill OR tool)
    ├→ phases/04-validate.md  → All checks passed
    └→ phases/05-handoff.md   → Summary prepared for Base Claude
                                    │
                                    ▼
                              skills/{name}/  (if skill)
                              ├── SKILL.md
                              ├── README.md
                              ├── VERIFY.md
                              ├── STATUS.md
                              ├── phases/01-05
                              ├── commands/{cmd}.md
                              ├── docs/
                              ├── input/
                              └── output/
                                    OR
                              tools/{name}/   (if tool)
                              ├── README.md
                              ├── STATUS.md
                              ├── VERIFY.md
                              ├── commands/{cmd}.md
                              ├── scripts/
                              ├── docs/
                              └── data/
```

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
