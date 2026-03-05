# Skill Completion Checklist

**Purpose:** Definition of Done for skills marked as "complete" and "public"

**Use this checklist BEFORE marking a skill as public-ready.**

---

## 1. Core Skill Files

- [ ] **SKILL.md**
  - [ ] `name:` matches folder name
  - [ ] `classification: public` set correctly
  - [ ] `version:` accurate and incremented
  - [ ] `description:` matches actual capability
  - [ ] `agent:` routing correct
  - [ ] `last_updated:` is current date
  - [ ] Routing gate present and accurate
  - [ ] Effort classification documented
  - [ ] Mode/workflow overview accurate

- [ ] **README.md**
  - [ ] Exists and is comprehensive
  - [ ] Matches current skill structure
  - [ ] Examples are accurate and tested
  - [ ] Commands documented correctly
  - [ ] No references to deleted/moved files

- [ ] **STATUS.md**
  - [ ] Exists and follows template
  - [ ] Recent session changes documented
  - [ ] Readiness assessment accurate
  - [ ] Known issues documented
  - [ ] No outdated "pending" items

- [ ] **VERIFY.md**
  - [ ] Exists with Definition of Done
  - [ ] Checklist reflects actual deliverables
  - [ ] Success criteria are testable

---

## 2. Directory Structure

- [ ] **Required directories exist:**
  - [ ] `workflows/` (if multi-phase skill)
  - [ ] `phases/` (if multi-phase skill)
  - [ ] `templates/` (if skill generates output)
  - [ ] `scripts/` (if automation exists)
  - [ ] `docs/` or `reference/` (if reference materials needed)
  - [ ] `input/` and `output/` (gitignored, documented in README)

- [ ] **No obsolete directories**
  - [ ] No `_old/`, `_archive/`, `backup/` folders
  - [ ] No duplicate nested skills (check for `skills/parent/child/SKILL.md`)

---

## 3. Commands & Routing

- [ ] **Command files exist in `commands/`**
  - [ ] All commands referenced in SKILL.md exist
  - [ ] Command files are symlinked to `skills/{skill}/commands/`
  - [ ] Commands route to correct agent
  - [ ] No broken command references

- [ ] **CLAUDE.md references accurate**
  - [ ] Skill listed in directory structure
  - [ ] Skill description matches SKILL.md
  - [ ] Agent routing documented
  - [ ] Command examples accurate

---

## 4. Workflows & Phases

- [ ] **Workflow files accurate**
  - [ ] All workflows referenced in SKILL.md exist
  - [ ] Workflow steps are actionable by agents
  - [ ] No references to deleted tools/scripts
  - [ ] Phase dependencies documented
  - [ ] Gate criteria (BLOCKER/WARNING) clear

- [ ] **Phase files consistent**
  - [ ] All phases numbered correctly (01, 02, etc.)
  - [ ] Phase transitions documented
  - [ ] Input/output for each phase clear
  - [ ] No missing phase files

---

## 5. Templates & Output

- [ ] **Templates exist and are complete**
  - [ ] All templates referenced in workflows exist
  - [ ] Template placeholders documented
  - [ ] Output structure documented in README
  - [ ] Example outputs provided or referenced

- [ ] **Output paths documented**
  - [ ] README shows expected output structure
  - [ ] Gitignore configured for output directories
  - [ ] No hardcoded paths to user-specific locations

---

## 6. Scripts & Automation

- [ ] **Scripts are functional**
  - [ ] All scripts referenced in workflows exist
  - [ ] Credential templates exist (`.env.example` or credentials-setup.md)
  - [ ] Scripts have clear usage documentation
  - [ ] No broken imports or dependencies
  - [ ] Scripts follow framework credential standards (.env only)

- [ ] **Testing coverage**
  - [ ] Test files exist for complex scripts
  - [ ] Manual testing documented in STATUS.md
  - [ ] Known issues/limitations documented

---

## 7. Reference Materials

- [ ] **Reference docs complete**
  - [ ] All frameworks/books/materials referenced exist
  - [ ] Books referenced in `private/docs/book-catalog.md`
  - [ ] No broken links to external resources
  - [ ] Attribution/licensing documented

- [ ] **Self-contained**
  - [ ] Skill doesn't depend on external shared resources
  - [ ] Reference materials copied locally (not symlinked)
  - [ ] No dependencies on private-only materials

---

## 8. Cross-File Consistency

- [ ] **Version consistency**
  - [ ] SKILL.md version matches STATUS.md
  - [ ] Changelog/session history accurate
  - [ ] No conflicting version numbers

- [ ] **Naming consistency**
  - [ ] Folder name = SKILL.md `name:` = command name
  - [ ] No references to old skill names
  - [ ] Cross-references to other skills use current names

- [ ] **Description consistency**
  - [ ] SKILL.md description = README.md description = CLAUDE.md description
  - [ ] Command descriptions match skill capability
  - [ ] No outdated capability claims

---

## 9. Agent Workflow Validation

- [ ] **Agent can execute workflows**
  - [ ] Routing gate instructions clear
  - [ ] Agent name in SKILL.md matches agents/*.md
  - [ ] Agent has necessary tools for workflow
  - [ ] No circular dependencies between skills

- [ ] **Prompts are actionable**
  - [ ] Workflow steps don't require human judgment
  - [ ] Tool calls are specific (not "use appropriate tool")
  - [ ] Quality gates have clear pass/fail criteria

---

## 10. Public Release Readiness

- [ ] **No sensitive content**
  - [ ] No client names, projects, or identifiable data
  - [ ] No API keys, tokens, or credentials
  - [ ] No internal infrastructure details
  - [ ] No private organizational context

- [ ] **Documentation tone appropriate**
  - [ ] Professional and helpful (not internal shorthand)
  - [ ] No "TODO" or "FIXME" comments in public docs
  - [ ] Examples are generic and educational
  - [ ] No references to private framework components

- [ ] **Usability for external users**
  - [ ] Installation/setup documented
  - [ ] Prerequisites clear
  - [ ] First-time user can understand workflow
  - [ ] Troubleshooting guidance provided

---

## Completion Signature

**Skill Name:** _______________________
**Version:** _______________________
**Audited By:** _______________________
**Date:** _______________________

**Checklist Status:** ____ / 40 items passing

**Ready for Public Release:** ☐ YES  ☐ NO (see notes below)

**Notes:**
```
[Document any exceptions, known issues, or deferred items]
```

---

## Usage

1. Copy this checklist for each skill being audited
2. Work through systematically (don't skip items)
3. Fix issues before marking skill as public
4. Document exceptions in Notes section
5. Only mark "Ready for Public Release" if 95%+ passing (max 2 minor exceptions)

**Critical items (cannot skip):**
- Core files exist (SKILL.md, README.md, STATUS.md)
- Commands route correctly
- No sensitive content
- CLAUDE.md references accurate
- Workflows are executable by agents
