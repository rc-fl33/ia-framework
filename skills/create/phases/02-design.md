---
domain: framework
skill: create-skill
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 2: DESIGN (Structure Planning)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Validate naming, plan directory structure, map user workflows to phase files (skills) or plan script layout (tools), and confirm all required templates exist before generation.

**Additional constraints:** Read `docs/skill-structure-standards.md` and `docs/naming-conventions.md` before executing. Naming conflicts are hard gates — do not proceed with conflicts.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Requirements bundle | Phase 1 | In-context (component_type, name, description, agent, workflows, etc.) |

**Prerequisites:**
- [ ] Phase 1 completed — all requirements gathered

**Source:** `skills/create/phases/01-discover.md`

**What happens if input is missing:** STOP — cannot design without requirements.

---

## OBJECTIVE

**Goal:** Produce a validated structure plan ready for file generation.

**Success criteria:**
- Naming validated (no conflicts with existing skills, tools, or commands)
- Directory structure planned (skill or tool layout)
- User workflows mapped to phase files (skill only)
- All required templates confirmed available

**Failure criteria:**
- Naming conflict that user refuses to resolve → STOP

---

## METHODOLOGY

Design validates before generating. This prevents creating files that need to be renamed or deleted.

**Naming rules:**
- Folder name: lowercase-with-dashes only
- Command: Both matching and different names from folder are valid
- No conflicts with existing `skills/*/` directories, `tools/*/` directories, or `commands/*.md` files

**Workflow-to-phase mapping (skill only):** Map user's named workflows to the 5-phase structure. If user provided fewer than 5, use generic names for remaining phases.

---

## EXECUTION

### Step 1: Validate Naming

**Tool:** Glob + Bash

Check for conflicts:
- **If skill:** `skills/{name}/` must not exist
- **If tool:** `tools/{name}/` must not exist
- **Both:** `commands/{command-name}.md` must not exist (if creating command)

Validate format:
- Name matches `^[a-z0-9-]+$`

**Expected output:** "VALID — no conflicts" or specific conflict description
**On failure:** STOP and return conflict details to Base Claude for user resolution

### Step 2: Check Existing Components

**Tool:** Glob

- **If skill:** Pattern `skills/*/SKILL.md` — confirm no name collision
- **If tool:** Pattern `tools/*/README.md` — confirm no name collision

**Expected output:** Confirmation that name is unique
**On failure:** STOP and return conflict details to Base Claude for user resolution

### Step 3: Plan Directory Structure

**Tool:** Direct analysis

**If component_type is SKILL:**

```
skills/{name}/
├── SKILL.md              ← From SKILL-TEMPLATE.md
├── README.md             ← From README-TEMPLATE.md
├── VERIFY.md             ← From VERIFY-TEMPLATE.md
├── STATUS.md             ← From STATUS-TEMPLATE.md
├── phases/
│   ├── 00-workflow.md    ← Orchestrator
│   ├── 01-{phase1}.md    ← From PHASE-TEMPLATE.md
│   ├── 02-{phase2}.md
│   ├── 03-{phase3}.md
│   ├── 04-{phase4}.md
│   └── 05-{phase5}.md
├── commands/{cmd}.md     ← If user-facing (from COMMAND-TEMPLATE.md)
├── docs/                 ← Domain knowledge
├── input/                ← User-provided data
└── output/               ← Skill-generated output
```

**If component_type is TOOL:**

```
tools/{name}/
├── README.md             ← From TOOL-README-TEMPLATE.md
├── STATUS.md             ← From STATUS-TEMPLATE.md
├── VERIFY.md             ← From VERIFY-TEMPLATE.md
├── commands/{cmd}.md     ← If user-facing (from COMMAND-TEMPLATE.md)
├── scripts/              ← Implementation scripts
├── docs/                 ← Documentation (optional)
└── data/                 ← Runtime data (optional, gitignored)
```

**Expected output:** Complete directory plan with file-to-template mapping
**On failure:** Simplify to minimal required structure

### Step 4: Map Workflows to Phases (SKILL ONLY — skip for tools)

**Tool:** Direct analysis

Map user's workflows to phase files:

| User Workflow | Phase File | Phase Name |
|---------------|------------|------------|
| {workflow 1} | 01-{name}.md | {Name} |
| {workflow 2} | 02-{name}.md | {Name} |
| {workflow 3} | 03-{name}.md | {Name} |
| {workflow 4} | 04-{name}.md | {Name} |
| {workflow 5} | 05-{name}.md | {Name} |

**Expected output:** Complete phase mapping
**On failure:** Use generic names (discover, plan, execute, verify, deliver)

### Step 5: Confirm Templates Available

**Tool:** Glob
**Pattern:** `skills/create/templates/*.md`

Verify all required templates exist:

**For skills:**
- SKILL-TEMPLATE.md
- README-TEMPLATE.md
- VERIFY-TEMPLATE.md
- STATUS-TEMPLATE.md
- PHASE-TEMPLATE.md (or phases/phase-template.md)
- COMMAND-TEMPLATE.md (if creating command)

**For tools:**
- TOOL-README-TEMPLATE.md
- VERIFY-TEMPLATE.md
- STATUS-TEMPLATE.md
- COMMAND-TEMPLATE.md (if creating command)

**Expected output:** All templates found
**On failure:** STOP — templates missing, check `skills/create/templates/`

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| Validated structure plan | In-context | Phase 3 |

**Structure plan includes:**
- Confirmed component type (skill or tool)
- Confirmed folder name (no conflicts)
- Confirmed command name (no conflicts)
- Directory structure with file-to-template mapping
- Phase name mapping (skill only)
- Agent and visibility settings

---

## NEXT

**On success:** → Load `skills/create/phases/03-generate.md`
  Pass: Validated structure plan + requirements bundle

**On failure:** → STOP and return conflict details to Base Claude
  Reason: Naming conflict requires user resolution — Base Claude will ask the user and re-delegate

---

## CHECKPOINTS

- [ ] Naming validated — no conflicts
- [ ] Directory structure planned (skill or tool layout)
- [ ] Phase mapping completed (skill only)
- [ ] All required templates confirmed available
- [ ] Structure plan ready for generation

**Error recovery:**
- Naming conflict → STOP and return conflict details to Base Claude for user resolution
- Component exists → STOP and return conflict details to Base Claude for user resolution
- Command exists → STOP and return conflict details to Base Claude for user resolution
- Template missing → Check `skills/create/templates/` structure

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
