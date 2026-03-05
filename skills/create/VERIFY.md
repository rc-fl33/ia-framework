# Definition of Done: Skill & Tool Creation

**This checklist defines completion criteria for /create outputs.**

---

## Pre-Execution Verification

- [ ] User invoked `/create` or requested skill/tool creation
- [ ] Templates exist in `skills/create/templates/`
- [ ] No naming conflict with existing skills or tools

---

## Phase Gate Verification

| Phase | Gate Question | Verified |
|-------|---------------|----------|
| DISCOVER | "Do I have all required information (incl. component type)?" | [ ] |
| DESIGN | "Is the structure plan validated?" | [ ] |
| GENERATE | "Are all files created from templates?" | [ ] |
| VALIDATE | "Do all validation checks pass?" | [ ] |
| HANDOFF | "Can user customize and use?" | [ ] |

---

## Requirements Verification (DISCOVER)

- [ ] Component type selected (skill or tool)
- [ ] Folder name collected (lowercase-with-dashes)
- [ ] One-line description collected
- [ ] Problem statement collected
- [ ] Solution approach collected
- [ ] Workflows/modes list collected (skill only)
- [ ] Agent selection made (skill only)
- [ ] User-facing command decision made
- [ ] Command name collected (if applicable)
- [ ] Public/private visibility decided

---

## Naming Verification (DESIGN)

- [ ] Folder name is lowercase-with-dashes
- [ ] Folder name doesn't exist already (in `skills/` or `tools/`)
- [ ] Command name doesn't conflict with existing commands

---

## File Creation Verification (GENERATE)

### For Skills

#### Directory Structure
- [ ] `skills/[name]/` directory created
- [ ] `skills/[name]/phases/` directory created
- [ ] `skills/[name]/docs/` directory created
- [ ] `skills/[name]/input/.gitkeep` created
- [ ] `skills/[name]/output/.gitkeep` created

#### Required Files
- [ ] `SKILL.md` created with routing gate
- [ ] `SKILL.md` has valid YAML frontmatter
- [ ] `SKILL.md` has effort classification section
- [ ] `SKILL.md` has 5-phase workflow diagram
- [ ] `README.md` created with problem/solution
- [ ] `VERIFY.md` created with skill-specific checks
- [ ] At least one phase file created in `phases/`

### For Tools

#### Directory Structure
- [ ] `tools/[name]/` directory created
- [ ] `tools/[name]/scripts/` directory created
- [ ] `tools/[name]/docs/` directory created
#### Required Files
- [ ] `README.md` created with "Type: Infrastructure tool" designation
- [ ] `README.md` has Quick Start section
- [ ] `README.md` has Directory Structure section
- [ ] `STATUS.md` created
- [ ] `VERIFY.md` created with tool-specific checks

### Command File (if user-facing — both skills and tools)
- [ ] `commands/[command-name].md` created
- [ ] Command references correct component
- [ ] Command has agent routing (if applicable, skills only)

---

## Content Verification (VALIDATE)

### Skill Content Checks
- [ ] Routing gate present (if agent specified)
- [ ] Frontmatter has: name, description, agent, version
- [ ] USE WHEN section populated
- [ ] Workflow phases documented
- [ ] Error recovery section included
- [ ] Phase files have UPS sections (IDENTITY, INPUT CONTRACT, etc.)

### Tool Content Checks
- [ ] README.md has tool type badge
- [ ] README.md has Quick Start section
- [ ] README.md has Commands table (if user-facing)
- [ ] README.md has Scripts table
- [ ] README.md has Directory Structure

---

## Integration Verification

- [ ] Component can be found by Claude (SKILL.md or README.md discoverable)
- [ ] Command invokes component correctly (if user-facing)
- [ ] Agent routing works (if agent specified, skills only)

---

## Handoff Verification (HANDOFF)

- [ ] User informed of created files
- [ ] User given next steps for customization
- [ ] User knows how to invoke the component
- [ ] Post-creation reminders provided:
  - [ ] Update agent's skill list (if applicable, skills only)
  - [ ] Update `.framework-manifest.yaml`
  - [ ] Run `/git-public` to sync (if public)

---

## Completion Certification

**Component creation is COMPLETE when:**

1. All requirements collected from user (incl. component type)
2. Naming validated (no conflicts)
3. All files created from templates
4. All validation checks pass
5. User has clear next steps

**Incomplete if ANY checkbox above is unchecked.**

---

**Template Version:** 2.0
