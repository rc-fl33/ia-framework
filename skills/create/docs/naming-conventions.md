# Naming Conventions

**Standard naming patterns for all framework components.**

---

## Skill Names

**Format:** `lowercase-with-dashes`

**Rules:**
- All lowercase
- Hyphens separate words (not underscores or camelCase)
- Descriptive, not abbreviated
- Singular form preferred
- 2-4 words maximum

### ✅ Good Examples

```
career
clifton
create-skill
maritime-infrastructure-assess
bug-bounty
```

### ❌ Bad Examples

```
Career                    # Not lowercase
career_analysis           # Underscores not hyphens
ca                        # Too abbreviated
career-analysis-and-job-search-optimization  # Too long
careers                   # Plural (use singular)
```

---

## Command Names

**Format:** `lowercase-with-dashes`

**Rules:**
- All lowercase
- Hyphens separate words
- Action-oriented (verb-noun pattern preferred)
- Should indicate function clearly
- Match skill name if 1:1 relationship

### ✅ Good Examples

```
create-skill              # Verb-noun (action-oriented)
git-push                  # Action on entity
git-pull                  # Consistent with git-push
pentest                   # Short, clear action
career                    # Skill name (1:1 mapping)
```

### ❌ Bad Examples

```
CreateSkill               # CamelCase
create_skill              # Underscores
cs                        # Too abbreviated
do-create-skill         # Verbose
skill                     # Ambiguous
```

---

## Phase File Names

**Format:** `##-domain-name.md`

**Rules:**
- Two-digit prefix (01-05)
- Domain-specific name (not "phase1")
- Lowercase with hyphens
- Maps to universal phase names

### Universal Phase Names

| Number | Universal | Common Domain Names |
|--------|-----------|---------------------|
| 01 | EXPLORE | discover, audit, configure, explore, research |
| 02 | PLAN | design, plan, analyze |
| 03 | CODE | generate, execute, implement, draft, code |
| 04 | QA | validate, verify, review, polish, qa |
| 05 | COMMIT | handoff, deliver, publish, sync, commit, document |

### ✅ Good Examples

```
01-discover.md            # Research workflows
01-explore.md             # Security testing
01-audit.md               # Infrastructure ops
02-design.md              # Planning phase
02-plan.md                # Alternative planning name
03-generate.md            # File creation
03-execute.md             # Test execution
03-draft.md               # Content creation
04-validate.md            # Quality checks
04-review.md              # Editorial review
05-handoff.md             # User education
05-publish.md             # Content deployment
05-deliver.md             # Report delivery
```

### ❌ Bad Examples

```
phase1.md                 # Not domain-specific
1-discover.md             # Missing leading zero
01_discover.md            # Underscore not hyphen
01-DiscoverRequirements.md # CamelCase
step-01-discover.md       # Redundant "step"
```

---

## Documentation File Names

**Format:** `lowercase-with-hyphens.md`

**Rules:**
- All lowercase
- Hyphens separate words
- Descriptive of content
- Consistent suffixes (-guide, -standards, -template, -patterns)

### ✅ Good Examples

```
skill-structure-standards.md
when-to-create-skill.md
phase-workflow-patterns.md
naming-conventions.md
env-management-patterns.md
env-setup.md
cliftonstrengths-themes.md
```

### ❌ Bad Examples

```
SkillStructure.md         # CamelCase
skill_structure.md        # Underscores
standards.md              # Too vague
SSS.md                    # Acronym
skill-structure-standards-v2.md  # Version in filename
```

---

## Script File Names

**Format:** `kebab-case.ts` or `snake_case.py`

**Rules:**
- TypeScript: `kebab-case.ts`
- Python: `snake_case.py` (follows PEP 8)
- Descriptive function name
- Avoid abbreviations

### ✅ Good Examples

**TypeScript:**
```
full-framework-audit.ts
security-scan.ts
collect-public-files.ts
transform-claude-md.ts
update-session.ts
```

**Python:**
```
build_public_repo.py
select_model.py
framework_paths.py
```

### ❌ Bad Examples

```
FHC.ts                    # Acronym
framework_health.ts       # Underscores in TS
security-scan.py          # Hyphens in Python
securityScan.ts           # camelCase
```

---

## Directory Names

**Format:** `lowercase-with-dashes`

**Rules:**
- All lowercase
- Hyphens separate words
- Descriptive purpose
- Plural for collections (skills/, docs/, templates/)
- Singular for specific instances (input/, output/)

### ✅ Good Examples

```
skills/                   # Collection
commands/                 # Collection
docs/                     # Collection (short form acceptable)
templates/                # Collection
input/                    # Singular (skill-specific)
output/                   # Singular (skill-specific)
create-skill/           # Specific skill
bug-bounty/ # Specific skill
```

### ❌ Bad Examples

```
Skill/                    # Capital
skill/                    # Singular for collection
Skills/                   # Capital
docs-and-reference/       # Too verbose
documentation/            # Use "docs" instead
```

---

## Environment Variable Names

**Format:** `UPPERCASE_WITH_UNDERSCORES`

**Rules:**
- All uppercase
- Underscores separate words
- Prefix with service/skill name when specific
- Clear, descriptive purpose

### ✅ Good Examples

```
GITHUB_TOKEN
ANTHROPIC_API_KEY
GHOST_ADMIN_API_KEY
GHOST_API_URL
GIT_PUSH_REPO_PATH
GIT_PUSH_REMOTE
GIT_PUSH_BRANCH
OPENROUTER_API_KEY
```

### ❌ Bad Examples

```
github_token              # Not uppercase
GitHubToken               # CamelCase
GH_TKN                    # Abbreviations
TOKEN                     # Too generic
GITHUB                    # Ambiguous (token? url? what?)
```

---

## YAML Frontmatter Keys

**Format:** `lowercase_with_underscores`

**Rules:**
- All lowercase
- Underscores separate words (YAML convention)
- Consistent across all files
- Required keys defined in templates

### ✅ Good Examples

```yaml
name: create-skill
description: Interactive skill scaffolding wizard
agent: none
version: 1.0
classification: public
last_updated: 2026-01-19
env_required: true
effort_default: STANDARD
```

### ❌ Bad Examples

```yaml
Name: create-skill      # Capital
skillName: create-skill # camelCase
skill-name: create-skill # Hyphens (inconsistent)
ver: 1.0                  # Abbreviated
```

---

## Git Branch Names

**Format:** `type/description` or `description`

**Rules:**
- Lowercase with hyphens
- Optional type prefix (feature/, fix/, docs/)
- Brief description
- No issue numbers (use PR description for context)

### ✅ Good Examples

```
feature/git-skill-public-release
fix/manifest-pattern-bug
docs/skill-structure-standards
main
```

### ❌ Bad Examples

```
Feature/GitSkill          # Capital
feature_git_skill         # Underscores
issue-123                 # Issue numbers
chris/working             # Personal branches (use descriptive names)
```

---

## Git Commit Message Format

**Format:** `type: Brief description`

**Rules:**
- Type prefix: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Lowercase after colon
- Present tense, imperative mood
- <80 characters for first line
- Co-authored-by tag if AI-assisted

### ✅ Good Examples

```
feat: Add git skill to public repo (7th public skill)

fix: Change skill patterns from /**/* to /** to include root files

docs: Add skill structure standards documentation

refactor: Git skill restructuring - standards compliance

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

### ❌ Bad Examples

```
Added git skill           # No type prefix
Fix: Bug                  # Capital after colon
fixed the bug             # Past tense
I added documentation     # Not imperative
```

---

## Symlink Naming

**Format:** Match target file name

**Rules:**
- Symlink name = target file name
- Maintains discoverability
- Consistent with conventions above

### ✅ Good Examples

```
commands/create.md → ../skills/create/commands/create.md
commands/git-push.md → ../tools/git/commands/git-push.md
```

### ❌ Bad Examples

```
commands/create → ../skills/create/commands/create.md
  # Missing .md extension
```

---

## Special Cases

### Acronyms

**General rule:** Avoid acronyms unless universally known

**Acceptable:**
- `API` (in ENV variables: `GHOST_API_KEY`)
- `URL` (in ENV variables: `GHOST_API_URL`)
- `SSH` (in documentation: `ssh-key-setup.md`)
- `HTTP` (in scripts: `http-proxy.ts`)

**Avoid:**
- `FHC` (use `framework-health-check`)
- `SSS` (use `skill-structure-standards`)
- `PWP` (use `private-push-workflow`)

---

### Version Numbers

**Rule:** NEVER include version numbers in file names

**Why:** Creates maintenance debt, requires renaming on updates

**Instead:** Use git history or frontmatter `version` field

❌ **Bad:**
```
skill-structure-standards-v2.md
SKILL-TEMPLATE-2024.md
```

✅ **Good:**
```
skill-structure-standards.md  # Version in frontmatter
SKILL-TEMPLATE.md             # Version in git history
```

---

### Private vs Public Prefixes

**Rule:** Don't use prefixes to indicate private/public

**Why:** Classification is in frontmatter and manifest

❌ **Bad:**
```
skills/public-career/
```

✅ **Good:**
```
skills/pentest/   # classification: private in SKILL.md
skills/career/     # classification: public in SKILL.md
```

---

## Consistency Examples

### Good: Consistent Naming Throughout

```
Skill: skills/create/
├── SKILL.md (name: create-skill)
├── commands/
│   └── create.md
└── docs/
    ├── skill-structure-standards.md
    └── when-to-create-skill.md

Command: /commands/create.md
→ Symlink to: ../skills/create/commands/create.md

User invokes: /create
```

**Note:** Command name (`create`) can differ from skill folder (`create-skill`). Both patterns are valid.

---

### Bad: Inconsistent Naming

```
Skill: skills/SkillCreation/
├── SKILL.md (name: skill_creation)
├── commands/
│   └── createSkill.md
└── docs/
    ├── SSS.md
    └── WhenToCreate.md

Command: /commands/create_skill.md
→ Symlink to: ../skills/SkillCreation/commands/createSkill.md

User invokes: /create_skill
```

**Everything inconsistent:** CamelCase, underscores, hyphens all mixed

---

## Validation

**Pre-commit hooks check:**
- File naming conventions
- No hardcoded version numbers
- YAML frontmatter format
- Symlink consistency

**Manual validation:**
```bash
# Check all skill names follow convention
ls skills/ | grep -E '[A-Z_]' && echo "VIOLATION: Found capitals or underscores"

# Check all command names follow convention
ls commands/ | grep -E '[A-Z_]' && echo "VIOLATION: Found capitals or underscores"
```

---

**Version:** 1.0
**Last Updated:** 2026-01-19
