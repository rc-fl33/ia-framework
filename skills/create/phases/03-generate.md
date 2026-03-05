---
domain: framework
skill: create-skill
agent: engineer
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 3: GENERATE (File Creation)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Create all files from templates for either a skill or tool. Generate directory structure, core files, phase files (skill) or script stubs (tool), command file, and ENV documentation. Use Haiku workers for parallel phase generation when possible.

**Additional constraints:** Follow templates exactly. Every generated file must use the UPS v2.0 structure (for skills). Include METADATA frontmatter in all phase and command files. Skills use self-contained input/ and output/ directories with .gitkeep files. Tools do NOT have input/ or output/ directories (they are operational utilities, not deliverable-producing workflows).

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Requirements bundle | Phase 1 | In-context |
| Validated structure plan | Phase 2 | In-context |

**Prerequisites:**
- [ ] Phase 2 completed — naming validated, structure planned

**Source:** `skills/create/phases/02-design.md`

**What happens if input is missing:** STOP — cannot generate without structure plan.

---

## OBJECTIVE

**Goal:** Create all files for the new skill or tool from templates, customized with collected requirements.

**Success criteria:**
- Directory structure created
- **If skill:** SKILL.md, README.md, VERIFY.md, STATUS.md, phase files, command file generated
- **If tool:** README.md, VERIFY.md, STATUS.md, command file generated
- ENV documentation generated (if credentials needed)

**Failure criteria:**
- Template not found → STOP
- Write operation fails → retry

---

## METHODOLOGY

File generation follows a specific order: directories first, then core files, then phase files (skill) or script stubs (tool), then integration files (command, ENV).

**Skill branch:** Full skill generation with SKILL.md, phase files using orchestrator-worker pattern.

**Tool branch:** Lighter generation — README.md from TOOL-README-TEMPLATE.md, no phase files, no SKILL.md.

---

## EXECUTION

### Step 1: Create Directory Structure

**Tool:** Bash

**If component_type is SKILL:**
```bash
mkdir -p skills/{name}/{phases,docs,templates,input,output,scripts,commands}
touch skills/{name}/input/.gitkeep
touch skills/{name}/output/.gitkeep
```

**If component_type is TOOL:**
```bash
mkdir -p tools/{name}/{commands,docs,scripts,data}
```

**Expected output:** Directory tree created
**On failure:** Check permissions

### Step 2: Generate Core Documentation

**Tool:** Read + Write

**If component_type is SKILL:**

1. Read template: `skills/create/templates/SKILL-TEMPLATE.md`
2. Customize with requirements:
   - YAML frontmatter (name, description, agent, version, classification)
   - Routing gate (if agent specified)
   - Chain map showing command → workflow → phases
   - USE WHEN triggers
   - Phase descriptions
3. Write to `skills/{name}/SKILL.md`

4. Read template: `skills/create/templates/README-TEMPLATE.md`
5. Customize: name, problem, solution, quick start, output description
6. Write to `skills/{name}/README.md`

**If component_type is TOOL:**

1. Read template: `skills/create/templates/TOOL-README-TEMPLATE.md`
2. Customize with requirements:
   - Replace `{tool-name}` with name
   - Replace `{description}` with description
   - Replace `{command-name}` with command name
   - Fill in Quick Start, Commands table, Scripts table
3. Write to `tools/{name}/README.md`

**Expected output:** Core documentation created
**On failure:** Retry write

### Step 3: Generate VERIFY.md + STATUS.md

**Tool:** Read + Write

1. Read templates: VERIFY-TEMPLATE.md, STATUS-TEMPLATE.md
2. Customize with component-specific checks and initial status
3. Write to target directory:
   - **Skill:** `skills/{name}/VERIFY.md`, `skills/{name}/STATUS.md`
   - **Tool:** `tools/{name}/VERIFY.md`, `tools/{name}/STATUS.md`

**Expected output:** Both files created

### Step 4: Generate Phase Files (SKILL ONLY — skip for tools)

**Tool:** Task (Haiku workers) or direct Write

For each phase (01 through 05):

**Option A — Haiku workers (preferred for speed):**
```typescript
Task({
  subagent_type: "general-purpose",
  model: "haiku",
  prompt: `Generate phase file for ${phaseName}. Skill: ${skillName}.
           Follow PHASE-TEMPLATE.md structure (UPS v2.0).
           Include: METADATA, IDENTITY, INPUT CONTRACT, OBJECTIVE,
           METHODOLOGY, EXECUTION, OUTPUT CONTRACT, NEXT, CHECKPOINTS.
           Use real framework tools only. Return markdown text only.`
})
```

**Option B — Direct write (fallback):**
Read PHASE-TEMPLATE.md, customize for each phase, write directly.

**QA after each:** Verify UPS sections present, no pseudo-commands, has METADATA frontmatter.

**Expected output:** 5 phase files + 00-workflow.md created
**On failure:** Fallback to direct Sonnet generation, then static template

### Step 5: Generate Command File (if user-facing)

**Tool:** Read + Write

1. Read template: `skills/create/templates/COMMAND-TEMPLATE.md`
2. Customize with command name, component reference, agent routing
3. Write to:
   - **Skill:** `skills/{name}/commands/{command-name}.md`
   - **Tool:** `tools/{name}/commands/{command-name}.md`
4. Create symlink: `ln -s ../{skills|tools}/{name}/commands/{command-name}.md commands/{command-name}.md`

**Expected output:** Command file created + symlink
**On failure:** Create file without symlink, note in handoff

### Step 5b: Generate Setup Command (if needs_setup_command: true)

**Tool:** Read + Write

Only if `needs_setup_command: true` from Phase 1:

1. Read template: `skills/create/templates/SETUP-COMMAND-TEMPLATE.md`
2. Customize with component name, display name, keys, dependencies, agent, classification
3. Replace placeholder tokens: `{name}`, `{display-name}`, `{tool|skill}`, `{agent}`, `{classification}`, `{PREREQUISITE_SECTION}`, `{REQUIRED_KEYS_TABLE}`
4. Write to:
   - **Skill:** `skills/{name}/commands/{name}-setup.md`
   - **Tool:** `tools/{name}/commands/{name}-setup.md`
5. Create symlink: `ln -s ../{skills|tools}/{name}/commands/{name}-setup.md commands/{name}-setup.md`

**Expected output:** Setup command file created + symlinked
**On failure:** Skip — not critical for MVP, note in handoff

### Step 6: Generate ENV Documentation (if credentials needed)

**Tool:** Read + Write

Only if `env_required: true`:
1. Read template: `skills/create/templates/env-section-template.md`
2. Customize with credential names, service URLs, setup instructions
3. Write to `private/docs/{name}-env-setup.md`
4. Add ENV section to README.md

**Expected output:** ENV documentation created
**On failure:** Note as TODO in handoff

### Step 7: Generate setup.ts (if applicable)

**Tool:** Read + Write

1. Read template: `skills/create/templates/setup-template.ts` (if exists)
2. Customize with component name, required keys
3. Write to:
   - **Skill:** `skills/{name}/scripts/setup.ts`
   - **Tool:** `tools/{name}/scripts/setup.ts`

**Expected output:** Setup script created
**On failure:** Skip — not critical for MVP

---

## OUTPUT CONTRACT

**Produces (for SKILL):**

| File | Location | Template Source |
|------|----------|---------------|
| SKILL.md | `skills/{name}/SKILL.md` | SKILL-TEMPLATE.md |
| README.md | `skills/{name}/README.md` | README-TEMPLATE.md |
| VERIFY.md | `skills/{name}/VERIFY.md` | VERIFY-TEMPLATE.md |
| STATUS.md | `skills/{name}/STATUS.md` | STATUS-TEMPLATE.md |
| 00-workflow.md | `skills/{name}/phases/00-workflow.md` | Generated |
| 01-05 phases | `skills/{name}/phases/0X-{name}.md` | PHASE-TEMPLATE.md |
| Command | `skills/{name}/commands/{cmd}.md` | COMMAND-TEMPLATE.md |
| ENV docs | `private/docs/{name}-env-setup.md` | env-section-template.md |
| setup.ts | `skills/{name}/scripts/setup.ts` | setup-template.ts |
| Setup command | `skills/{name}/commands/{name}-setup.md` | SETUP-COMMAND-TEMPLATE.md |

**Produces (for TOOL):**

| File | Location | Template Source |
|------|----------|---------------|
| README.md | `tools/{name}/README.md` | TOOL-README-TEMPLATE.md |
| VERIFY.md | `tools/{name}/VERIFY.md` | VERIFY-TEMPLATE.md |
| STATUS.md | `tools/{name}/STATUS.md` | STATUS-TEMPLATE.md |
| Command | `tools/{name}/commands/{cmd}.md` | COMMAND-TEMPLATE.md |
| ENV docs | `private/docs/{name}-env-setup.md` | env-section-template.md |
| setup.ts | `tools/{name}/scripts/setup.ts` | setup-template.ts |
| Setup command | `tools/{name}/commands/{name}-setup.md` | SETUP-COMMAND-TEMPLATE.md |

---

## NEXT

**On success:** → Load `skills/create/phases/04-validate.md`
  Pass: All generated file paths

**On failure:** → STOP
  Reason: Template missing or write failures

---

## CHECKPOINTS

- [ ] Directory structure created
- [ ] Core documentation generated (SKILL.md + README.md for skill, README.md for tool)
- [ ] VERIFY.md and STATUS.md generated
- [ ] Phase files generated (skill only — 01-05 + 00-workflow)
- [ ] Command file generated and symlinked (if user-facing)
- [ ] ENV documentation generated (if credentials needed)
- [ ] Setup command generated (if needs_setup_command)
- [ ] All files follow UPS v2.0 structure (skill phase files)

**Error recovery:**
- Template not found → Check `skills/create/templates/`
- Write fails → Check permissions, retry
- Directory exists → Ask user: overwrite or choose new name
- Haiku QA fails → Escalate to Sonnet, then static template

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
