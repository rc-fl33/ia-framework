---
type: documentation
title: Skill File Structure Standards
classification: public
version: 1
last_updated: Fri Jan 23 2026 18:00:00 GMT-0600 (Central Standard Time)
audience: intermediate
category: standards
---



# Skill File Structure Standards

**Purpose:** Enforce clean, consistent file organization across all skills to prevent drift.

**Status:** ✅ Active Enforcement (via skill-structure-validator.ts hook)

---

## Allowed Files in Skill Root

**ONLY these files may exist in `skills/{skill-name}/` root:**

```
skills/{skill-name}/
├── SKILL.md              # Main entry point (REQUIRED)
├── STATUS.md             # Status tracking (REQUIRED)
├── README.md             # User documentation (REQUIRED)
├── VERIFY.md             # Verification checklist (REQUIRED)
├── .gitkeep              # Git directory tracking (optional)
├── .gitignore            # Git ignore rules (optional)
└── .env.example          # Environment variable template (optional)
```

**Everything else MUST be in subdirectories.**

---

## Standard Subdirectories

**Required directories:**
- `input/` - User-provided input files
- `output/` - Generated output files
- `phases/` - Workflow phase definitions (min 3 files)
- `docs/` - Documentation and reference materials

**Optional directories:**
- `commands/` - Command definitions (symlinked to `/commands/`)
- `workflows/` - Additional workflow definitions
- `templates/` - Output templates
- `scripts/` - TypeScript automation scripts
- `methodologies/` - Domain-specific methodologies
- `frameworks/` - Framework definitions
- `mappings/` - Data mappings
- `infrastructure/` - Infrastructure configurations
- `client/` - Client-specific configurations

---

## Where Files Belong

| File Type | Correct Location | Example |
|-----------|-----------------|---------|
| Documentation | `docs/` | `docs/hero-images.md` |
| Test results | `docs/` | `docs/GROK-TEST-RESULTS.md` |
| Templates | `templates/` or `docs/` | `docs/HERO-PROMPT-TEMPLATE-V2.md` |
| Workflow analysis | `docs/` | `docs/tweet-generation-analysis.md` |
| Implementation notes | `docs/` | `docs/FLUX-TO-GROK-TRANSITION.md` |
| API references | `docs/` | `docs/ghost-admin-api-endpoints.md` |
| Brand guides | `docs/` | `docs/brand-guide.md` |
| Setup instructions | `docs/` | `private/docs/env-setup.md` |

**Rule:** If it's not SKILL.md, STATUS.md, README.md, or VERIFY.md → it goes in a subdirectory.

---

## Enforcement

**Pre-Write Hook:** `hooks/skill-structure-validator.ts`

**Validation on every Write to `skills/`:**
1. Checks for files in skill root that shouldn't be there
2. Warns about invalid files with suggestion to move to subdirectory
3. Validates required files exist
4. Validates required directories exist
5. Checks for invalid subdirectories

**Error message example:**
```
Skill structure issues detected:

  ghost:
    - File in skill root should be in subdirectory: PROMPT-ANALYSIS.md
    - Move to appropriate subdirectory (docs/, templates/, etc.)
```

---

## How to Fix Violations

**If you create a file in skill root:**

1. Determine correct subdirectory:
   - Documentation → `docs/`
   - Templates → `templates/` or `docs/`
   - Scripts → `scripts/`

2. Move the file:
   ```bash
   # If file is tracked by git
   git mv skills/{skill}/filename.md skills/{skill}/docs/

   # If file is untracked
   mv skills/{skill}/filename.md skills/{skill}/docs/
   ```

3. Verify cleanup:
   ```bash
   ls -1 skills/{skill}/*.md
   # Should only show: SKILL.md, STATUS.md, README.md, VERIFY.md
   ```

---

## Recent Cleanup Example

**Ghost skill (2026-01-24):**

Moved 11 stray files from `skills/ghost/` to `skills/ghost/docs/`:
- BOLD-PROMPTS-RESULTS.md
- BOLD-PROMPTS-TEST.md
- FLUX-TO-GROK-TRANSITION.md
- GROK-INTEGRATION.md
- GROK-TEST-RESULTS.md
- HERO-PROMPT-TEMPLATE-V2.md
- HERO-UPGRADE-PLAN.md
- PROMPT-ANALYSIS.md
- PROMPT-TEST-VARIATIONS.md
- TEST-PROMPTS-BATCH.md
- VIDEO-TEST-RESULTS.md

**After cleanup:**
```bash
$ ls -1 skills/ghost/*.md
skills/ghost/README.md
skills/ghost/SKILL.md
skills/ghost/STATUS.md
skills/ghost/VERIFY.md
```

---

## Related Documentation

- `docs/standards/file-location-standards.md` - Framework-wide file location rules
- `skills/create/templates/SKILL-TEMPLATE.md` - Skill template
- `hooks/skill-structure-validator.ts` - Enforcement hook

---

**This is actively enforced.** The validator runs on every Write to `skills/` and will warn about violations.

**Version:** 1.0
**Status:** ✅ Active Enforcement
**Framework:** Intelligence Adjacent (IA)
