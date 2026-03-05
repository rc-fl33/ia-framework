---
name: create
description: Interactive creation wizard for skills and tools - guides through requirements gathering to create properly structured components
agent: engineer
version: 1.0
classification: public
last_updated: 2026-01-26
effort_default: STANDARD
---

> **⛔ ROUTING - READ THIS FIRST**
>
> **STOP.** This skill requires the `engineer` agent for skill creation.
>
> **If you are NOT the engineer agent AND the request is complex** → DELEGATE NOW:
> ```typescript
> Task(subagent_type="engineer", prompt="Execute create-skill. Request: {user_request}")
> ```
>
> **DO NOT** proceed with skill creation without engineer delegation.
> **Simple queries** (template questions, structure explanations) can be handled directly.

---

# Skill & Tool Creation Wizard

**Interactive wizard to create properly structured skills and tools with full requirements gathering.**

---

## Chain Map

```
/create (command — base-claude, haiku)
    │
    ▼
phases/00-workflow.md (orchestrator — engineer, sonnet)
    │
    ├→ phases/01-discover.md  → Requirements gathered (incl. component_type)
    ├→ phases/02-design.md    → Structure plan validated
    ├→ phases/03-generate.md  → Files created (skill OR tool)
    ├→ phases/04-validate.md  → All checks passed
    └→ phases/05-handoff.md   → User guided on next steps
                                    │
                                    ▼
                              skills/{name}/  (if skill)
                                    OR
                              tools/{name}/   (if tool)
```

**Agent:** engineer (single-agent — all phases)
**Mode:** Single-agent, 5-phase sequential pipeline

---

## Supporting Documentation

**Read these docs before executing (loaded by the engineer agent):**

1. `docs/skill-structure-standards.md` — Directory structure and file organization
2. `docs/naming-conventions.md` — Skill and command naming standards
3. `docs/requirements-questions.md` — Question templates for Phase 1
4. `docs/phase-workflow-patterns.md` — Multi-phase skill patterns
5. `docs/env-management-patterns.md` — ENV/credential documentation patterns

---

## USE WHEN

**Invoke this skill when:**
- User says "create a skill" or "add new skill"
- User says "create a tool" or "add new tool"
- User invokes `/create`
- User wants to add new capability to the framework
- User describes a workflow that should become a skill
- User needs to add infrastructure tooling to `tools/`
- Creating a skill that uses **external APIs or credentials**
- Need **automatic ENV documentation** generated

**DO NOT use when:**
- Creating just a command → use `docs/templates/command-template.md`
- Creating an agent → use `docs/templates/agent-template.md`

---

## Quick Start

```
/create
/create [name]
/create --tool [name]
```

**Output:** `skills/[name]/` (skill) or `tools/[name]/` (tool) with full structure

---

## 5-Phase Workflow

```
┌──────────┐    ┌─────────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐
│ DISCOVER │───▶│  DESIGN │───▶│ GENERATE │───▶│ VALIDATE│───▶│ HANDOFF │
│(Understand)   │ (Plan)  │    │(Execute) │    │(Verify) │    │ (Learn) │
└─────┬────┘    └────┬────┘    └─────┬────┘    └────┬────┘    └────┬────┘
      │              │               │              │              │
      ▼              ▼               ▼              ▼              ▼
  Requirements   Structure      Files Created   Checks Pass   User Ready
   Gathered      Designed       from Templates   All Valid    to Customize
```

| Phase | Domain Name | Gate Question | Output |
|-------|-------------|---------------|--------|
| 1 | DISCOVER | "Do I have all requirements?" | Requirements captured |
| 2 | DESIGN | "Is the structure validated?" | Structure plan |
| 3 | GENERATE | "Are all files created?" | Skill directory |
| 4 | VALIDATE | "Do all checks pass?" | Validation report |
| 5 | HANDOFF | "Can user customize and use?" | Next steps guide |

---

## Phase 1: DISCOVER (Requirements Gathering)

**Purpose:** Collect all information needed to create the skill

**Gate Question:** "Do I have all required information from the user?"

### Required Information

**BEFORE collecting requirements:**
1. **READ** `docs/requirements-questions.md` for complete question templates
2. Use **AskUserQuestion** to collect the 8 key pieces of information

**Quick Summary:**
1. Skill identity (name + description)
2. Problem & solution
3. Workflows/modes
4. Agent routing (security, engineer, writer, advisor, legal, none)
5. User-facing command (yes/no)
6. Command name (if user-facing, must differ from skill name)
7. Visibility (private default, public after testing)
8. ENV/credential requirements

**All new skills default to `classification: private`** until fully tested and approved.

---

## Phase 2: DESIGN (Structure Planning)

**Purpose:** Validate naming and design the skill structure

**Gate Question:** "Is the structure plan validated?"

### Naming Validation

```
┌─────────────────────────────────────────────────────────────┐
│ NAMING GUIDELINES: Command and skill folder names           │
│                                                             │
│ ✅ MATCHING NAMES (Most common pattern):                   │
│    /write → skills/write/                                   │
│    /ghost → skills/ghost/                                   │
│    /advisory → skills/advisory/                             │
│    /career → skills/career/                                 │
│                                                             │
│ ✅ DIFFERENT NAMES (For multiple commands → one skill):    │
│    /sec-review → skills/sec-review/              │
│    /code-review → skills/code-review/                      │
│    /pentest → skills/pentest/                              │
│                                                             │
│ Both patterns are valid and supported.                      │
└─────────────────────────────────────────────────────────────┘
```

**Validation Check:**
```python
# No naming restriction - both matching and different names work
# Just ensure no conflicts with existing commands
if command_already_exists(command_name):
    WARNING: "Command name already exists"
    ACTION: Choose different name or confirm override
```

### Structure Design

Based on requirements, design:

```
skills/[skill-name]/
├── SKILL.md              # Main skill (from SKILL-TEMPLATE.md)
├── README.md             # User overview (from readme-template.md)
├── VERIFY.md             # Definition of Done (from VERIFY-TEMPLATE.md)
├── phases/               # Domain-specific phases
│   ├── 01-[Phase1].md
│   ├── 02-[Phase2].md
│   └── ...
├── docs/                 # Domain knowledge
└── templates/            # Output templates (if needed)

commands/[command-name].md  # User-facing command (if applicable)
```

### Phase Mapping

Map user's workflows to 5 universal phases:

| User Workflow | Maps To | Phase File |
|---------------|---------|------------|
| [workflow 1] | UNDERSTAND | 01-[name].md |
| [workflow 2] | PLAN | 02-[name].md |
| [workflow 3] | EXECUTE | 03-[name].md |
| [workflow 4] | VERIFY | 04-[name].md |
| [workflow 5] | LEARN | 05-[name].md |

---

## Phase 3: GENERATE (File Creation)

**Purpose:** Create all skill files from templates

**Gate Question:** "Are all files created from templates?"

### Step 3.1: Create Directory Structure

```bash
mkdir -p skills/[skill-name]/{phases,docs,templates}
```

**Creates:**
```
skills/[skill-name]/
├── phases/       # 5-phase workflow files
├── docs/         # Domain knowledge base (renamed from reference/)
└── templates/    # Output templates
```

**Note:** User data and skill output are stored in `/private/input/{skill-name}/` and `/private/output/{skill-name}/` respectively.

### Step 3.2: Generate SKILL.md

Copy from `skills/create/templates/SKILL-TEMPLATE.md` and customize:
- Add routing gate (if agent specified)
- Fill in frontmatter (name, description, agent, etc.)
- Add effort classification
- Add 5-phase workflow diagram
- Add Success Criteria tracking

### Step 3.3: Generate README.md

Copy from `skills/create/templates/README-TEMPLATE.md` and customize:
- Problem statement
- Solution approach
- Quick start examples
- Command documentation

### Step 3.4: Generate VERIFY.md

Copy from `skills/create/templates/VERIFY-TEMPLATE.md` and customize:
- Skill-specific verification checks
- Domain-specific quality criteria

### Step 3.5: Generate Phase Files with Haiku Workers

**Orchestrator-Worker Pattern:** Sonnet orchestrates, Haiku workers generate in parallel.

For each phase file needed:

1. **Spawn Haiku Worker:**
   ```
   Task({
     model: "haiku",
     prompt: "Generate ${phaseName} for ${skillDomain}. Context: [auto-loaded]"
   })
   ```

2. **Auto-load Context:**
   - Tool signatures from tool catalog
   - Phase template format
   - Skill requirements

3. **QA Validation:**
   - Use `prompt-generation` capability on Haiku output
   - Check: gate question, pass criteria, tools, checklists

4. **Fallback Chain:**
   - Try 1-3: Haiku with progressive context
   - Try 4: Sonnet generation
   - Try 5: Static template

5. **Save Validated Output:**
   - Write to `skills/${skillName}/phases/${phaseFilename}`

**Expected:** All phases generated in parallel (~30 seconds total)

### Step 3.6: Generate Command (if user-facing)

Create `commands/[command-name].md` with:
- Agent routing (if applicable)
- Skill reference
- Quick start
- Mode documentation

---

## Phase 4: VALIDATE (Quality Checks)

**Purpose:** Verify all files are correct and complete

**Gate Question:** "Do all validation checks pass?"

### Validation Checklist

#### Structure Validation
- [ ] `skills/[skill-name]/SKILL.md` exists
- [ ] `skills/[skill-name]/README.md` exists
- [ ] `skills/[skill-name]/VERIFY.md` exists
- [ ] `skills/[skill-name]/phases/` has at least one file
- [ ] All paths are valid

#### Naming Validation
- [ ] Skill folder name is lowercase-with-dashes
- [ ] Command name differs from skill folder name
- [ ] No naming conflicts with existing skills

#### Content Validation
- [ ] SKILL.md has routing gate (if agent specified)
- [ ] SKILL.md has valid YAML frontmatter
- [ ] SKILL.md has effort classification
- [ ] SKILL.md has 5-phase workflow
- [ ] README.md has problem/solution
- [ ] Phase files have gate questions

#### Integration Validation
- [ ] Command file references correct skill
- [ ] Agent routing is correct (if applicable)

---

## Phase 5: HANDOFF (User Ready)

**Purpose:** Provide user with next steps to customize and use

**Gate Question:** "Can user customize and use the skill?"

### Present to User

1. **Summary of created files**
2. **Next steps for customization:**
   - Edit SKILL.md - Add domain-specific logic
   - Fill Phase files - Add actual workflow steps
   - Add Reference materials - Import domain knowledge
   - Create templates - Add output templates if needed
3. **How to invoke:**
   - `/[command-name]` (if user-facing)
   - Or ask Claude to use the skill
4. **Testing guidance**

### Post-Creation Reminders

- [ ] Update agent's skill list (if agent-loaded)
- [ ] Update `.framework-manifest.yaml` (if public skill)
- [ ] Run `/git-public` to sync (if public skill)
- [ ] Test the skill works

---

## Error Recovery

| Error | Recovery Action |
|-------|-----------------|
| Skill name already exists | Suggest different name or edit existing |
| Command name same as skill | Ask user for different command name |
| Missing required info | Return to DISCOVER phase |
| Template not found | Check `skills/create/templates/` exists |
| Validation fails | Return to GENERATE phase, fix issues |

---

## Templates Used

| Template | Purpose |
|----------|---------|
| `skills/create/templates/SKILL-TEMPLATE.md` | Main skill file |
| `skills/create/templates/TOOL-README-TEMPLATE.md` | Tool overview (for tools) |
| `skills/create/templates/README-TEMPLATE.md` | User overview (for skills) |
| `skills/create/templates/VERIFY-TEMPLATE.md` | Definition of Done |
| `skills/create/templates/PHASE-TEMPLATE.md` | Phase files |
| `skills/create/templates/env-section-template.md` | env setup documentation |
| `skills/create/templates/Capabilities-TEMPLATE.yaml` | Capability registry |

---

## ENV Management Integration

When generating new skills, `/create` automatically:

✅ **Asks about credentials** - Question 8 of DISCOVER phase
✅ **Generates env documentation** - Creates `../../private/docs/env-setup.md` with complete setup instructions
✅ **Creates `.env.structure.yaml` template** - Ready to integrate with credential system
✅ **Documents in README.md** - Adds Setup & Configuration section (if credentials needed)
✅ **Validates credential setup** - VERIFY phase checks all ENV documentation completeness
✅ **Provides verification steps** - Users can test credentials load properly

**Example workflow:**
1. User selects "Yes, requires credentials" in DISCOVER phase
2. User provides list: "Stripe API Key, OpenAI API Key"
3. `/create` generates:
   - `../../private/docs/env-setup.md` with Stripe + OpenAI setup instructions
   - `.env.structure.yaml` section template in env doc
   - README "Setup & Configuration" section
   - Frontmatter with `env_required: true` + `env_keys: [STRIPE_API_KEY, OPENAI_API_KEY]`
4. VERIFY phase validates all credential documentation is complete
5. HANDOFF phase guides user through credential configuration

---

## File Management

**What belongs in `skills/create/docs/`:**
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
- Engagement output → /private/output/create/
- Engagement input → /private/input/create/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/create/`
- Output data: `/private/output/create/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---
---


**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
