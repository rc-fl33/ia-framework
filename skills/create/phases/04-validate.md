---
domain: framework
skill: create-skill
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 4: VALIDATE (Quality Checks)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Verify all generated files are correct, complete, and properly integrated. Run structure, naming, content, integration, and ENV validation checks. Produce a validation report. Validation logic branches based on component type (skill vs tool).

**Additional constraints:** Every check must pass before proceeding to handoff. Failed checks return to Phase 3 for fixes.

---

## INPUT CONTRACT

**Receives:**

| Data | Source | Format |
|------|--------|--------|
| Generated file paths | Phase 3 | In-context list |
| Requirements bundle | Phase 1 | In-context |
| Structure plan | Phase 2 | In-context |

**Prerequisites:**
- [ ] Phase 3 completed — all files generated

**Source:** `skills/create/phases/03-generate.md`

**What happens if input is missing:** STOP — nothing to validate.

---

## OBJECTIVE

**Goal:** Confirm all generated files pass quality checks before handing off to user.

**Success criteria:**
- Structure validation passed (all required files exist)
- Naming validation passed (no conflicts, correct format)
- Content validation passed (routing gate, frontmatter, sections)
- Integration validation passed (command routes correctly)
- ENV validation passed (if credentials required)

**Failure criteria:**
- Any check fails → fix and re-validate (don't proceed with broken component)

---

## METHODOLOGY

Validation runs check categories in order. Each produces a pass/fail result. Any failure returns to Phase 3 for repair, then re-runs validation.

**Skill validation:** Full checks (SKILL.md, phases/, routing gate, UPS structure).
**Tool validation:** Lighter checks (README.md, scripts/ exists, no phase file checks, no routing gate checks).

---

## EXECUTION

### Step 1: Structure Validation

**Tool:** Glob + Bash

**If component_type is SKILL:**
- `skills/{name}/SKILL.md` exists
- `skills/{name}/README.md` exists
- `skills/{name}/VERIFY.md` exists
- `skills/{name}/STATUS.md` exists
- `skills/{name}/phases/` has phase files
- `skills/{name}/input/.gitkeep` exists
- `skills/{name}/output/.gitkeep` exists
- `commands/{cmd}.md` exists (if user-facing)

**If component_type is TOOL:**
- `tools/{name}/README.md` exists
- `tools/{name}/VERIFY.md` exists
- `tools/{name}/STATUS.md` exists
- `tools/{name}/scripts/` directory exists
- `commands/{cmd}.md` exists (if user-facing)

**Expected output:** All files confirmed present
**On failure:** Return to Phase 3, create missing files

### Step 2: Naming Validation

**Tool:** Grep + Direct analysis

- Folder name matches `^[a-z0-9-]+$`
- No conflicts with existing components
- No conflicts with existing commands
- **Skill:** Frontmatter `name:` in SKILL.md matches folder name
- **Tool:** README.md title matches folder name

**Expected output:** All naming checks passed
**On failure:** Return to Phase 1 for new names

### Step 3: Content Validation

**Tool:** Read

**If component_type is SKILL:**

Read SKILL.md and check:
- Has YAML frontmatter with required fields
- Has routing gate (if agent specified)
- Has chain map
- Has phase descriptions

Read phase files and check:
- Have METADATA frontmatter
- Have UPS sections (IDENTITY, INPUT CONTRACT, OBJECTIVE, etc.)
- Use real framework tools

Read command file (if exists) and check:
- Has METADATA frontmatter
- References correct skill
- Has NEXT pointing to workflow

**If component_type is TOOL:**

Read README.md and check:
- Has "Type: Infrastructure tool" designation
- Has Quick Start section
- Has Commands table (if user-facing)
- Has Directory Structure section

Read command file (if exists) and check:
- Has METADATA frontmatter
- References correct tool
- Has NEXT pointing to appropriate workflow

**Expected output:** All content checks passed
**On failure:** Edit files to fix issues

### Step 4: Integration Validation

**Tool:** Grep

**If component_type is SKILL:**
- Skill is discoverable (`name:` in SKILL.md frontmatter)
- Command references correct skill (`skill:` in command frontmatter)
- Agent routing matches (`agent:` consistent across files)

**If component_type is TOOL:**
- Tool is discoverable (README.md exists with proper title)
- Command references correct tool (if user-facing)

**Expected output:** Integration checks passed
**On failure:** Fix routing references

### Step 5: ENV Validation (if credentials needed)

**Tool:** Read

If `env_required: true`:
- ENV documentation exists at `private/docs/{name}-env-setup.md`
- Has required sections (credentials table, setup instructions, verification steps)
- Credential names follow UPPERCASE_WITH_UNDERSCORES
- README references ENV setup

If `env_required: false`:
- No ENV documentation created (correct)

**Expected output:** ENV checks passed
**On failure:** Create/fix ENV documentation

### Step 6: Generate Validation Report

**Tool:** Direct output

Display validation report to user:

```
## Validation Report

**Component:** {name}
**Type:** {skill|tool}
**Command:** /{command}
**Agent:** {agent} (skill only)

### Structure ✅
- Core files: Present
- Directories: All required present
{skill: - Phases: {count} files}
{tool: - Scripts directory: Present}

### Naming ✅
- Folder: {name} (valid format)
- Command: {command} (no conflicts)

### Content ✅
{skill: - Routing gate: {Present/N/A}}
{skill: - Chain map: Present}
{skill: - UPS structure: All phases compliant}
{tool: - README: Quick Start present}
{tool: - README: Directory structure present}

### Integration ✅
- Discoverable: Yes
- Command routing: Correct

### Environment {✅/⏭️}
- {status}
```

---

## OUTPUT CONTRACT

**Produces:**

| Data | Format | Consumed by |
|------|--------|-------------|
| Validation report | Displayed to user | Phase 5 |
| Pass/fail status | In-context | Phase 5 |

---

## NEXT

**On success (all checks pass):** → Load `skills/create/phases/05-handoff.md`

**On failure:** → Return to Phase 3 to fix issues, then re-validate

---

## CHECKPOINTS

- [ ] Structure validation passed
- [ ] Naming validation passed
- [ ] Content validation passed
- [ ] Integration validation passed
- [ ] ENV validation passed (if applicable)
- [ ] Validation report generated and shown to user

**Error recovery:**
- Missing file → Return to Phase 3, create it
- Invalid content → Edit file to fix
- Routing wrong → Update core files and command file
- Any check fails → Fix issue, re-run all validation

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
