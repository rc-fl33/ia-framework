# Framework Hooks Inventory

**Purpose:** Categorize all hooks to identify which should remain framework-level vs move to skill-scoped architecture.

**Last Updated:** February 13, 2026
**Status:** Active Assessment

---

## Hook Classification

### ✅ Skill-Scoped (Already Migrated)

| Hook | Skill | Status |
|------|-------|--------|
| `ghost-workflow-guard.ts` | ghost | ❌ Removed (ghost is private) |
| `pre-commit/10-validate-ghost-approvals.ts` | ghost | ✅ Migrated to `skills/ghost/hooks/pre-commit/` |

**Location:** `hooks/` contains symlinks → `skills/{skill}/hooks/`

---

## 🔍 Skill-Specific (Should Migrate)

Hooks that validate/enforce rules for **specific skills** should move to those skills.

### High Priority (Private Skills)

| Hook | Target Skill | Reason | Complexity |
|------|--------------|--------|------------|
| `pre-commit/validate-registry-methodologies.ts` | security | Validates security skill methodologies | Low |
| `pre-commit/validate-hero-prompts.ts` | ghost | Validates Ghost hero image prompts | Low |
| `pre-commit/08-validate-docs-public.ts` | ghost, advisory, compliance | Multi-skill validation (needs refactor) | Medium |

### Medium Priority

| Hook | Target Skill | Reason | Complexity |
|------|--------------|--------|------------|
| `active-work-limiter.ts` | monitor | References monitor skill for tracking | Low |
| `checklist-enforcer.ts` | ghost | Enforces Ghost workflow checklists | Low |

### Low Priority (Framework References)

These reference skills but may be framework-level concerns:

| Hook | Skill Reference | Keep Framework? | Notes |
|------|-----------------|-----------------|-------|
| `skill-loader.ts` | advisory, compliance, ghost | Maybe | Loads all skill definitions - framework utility |
| `skill-hook-loader.ts` | compliance | Maybe | Generic skill hook loader - framework utility |
| `file-guardian.ts` | advisory, compliance, ghost | Maybe | Multi-skill file protection - needs review |

---

## 🏗️ Framework-Level (Keep in hooks/)

These hooks are **framework infrastructure** and should stay in `hooks/`.

### Session Management
- `session-start.ts` - Framework session initialization
- `session-end.ts` - Framework session cleanup
- `tool-tracker.ts` - Framework-wide tool usage tracking

### Agent/Skill Infrastructure
- `agent-loader.ts` - Loads all agent definitions
- `skill-loader.ts` - Loads all skill definitions (generic)
- `skill-hook-loader.ts` - Generic skill hook loader

### Security & Validation (Framework-Wide)
- `security-scan.ts` - Prevents credential patterns in git push
- `bash-command-validator.ts` - Validates bash commands, blocks destructive operations (rm -rf, curl|bash, force push, chmod 777, fork bombs, device writes)
- `enforce-package-manager.ts` - Blocks npm/yarn/pnpm when Bun is project standard, suggests equivalents
- `tool-usage-optimizer.ts` - Optimizes tool usage patterns

### Quality & Completion (Framework-Wide)
- `anti-rationalization.ts` - Stop hook detecting deferral language, forces work completion (cooldown prevents loops)

### File & Structure Validation
- `file-guardian.ts` - File protection (multi-skill)
- `validate-frontmatter.ts` - Generic frontmatter validation
- `skill-structure-validator.ts` - Validates skill structure

### Workflow Enforcement
- `enforce-workflow.ts` - Generic workflow enforcement
- `test-validator.ts` - Framework test validation

### Pre-commit Validation (Framework-Wide)
- `pre-commit/00-validate-framework.ts` - Framework health check
- `pre-commit/01-validate-frontmatter.ts` - All frontmatter
- `pre-commit/02-validate-cross-refs.ts` - All cross-references
- `pre-commit/03-validate-paths.ts` - All path references
- `pre-commit/04-validate-placeholders.ts` - All placeholders
- `pre-commit/05-validate-file-structure.ts` - Framework structure
- `pre-commit/06-validate-command-symlinks.ts` - Command symlinks
- `pre-commit/07-validate-manifest-sync.ts` - Manifest sync
- `pre-commit/09-validate-changelog-severity.ts` - Changelog validation
- `pre-commit/prevent-hardcoded-counts.ts` - Documentation quality
- `pre-commit/validate-routing-gates.ts` - Agent routing

### Pre-push
- `pre-push-audit.sh` - Framework audit before push

### Pre-command
- `pre-command/monitor-path-audit.ts` - Monitor skill path auditing

---

## 🎯 Migration Strategy

### Phase 1: Obvious Skill-Scoped Hooks (Quick Wins)

**High confidence - clear skill ownership:**

1. **Security Skill**
   - Move: `pre-commit/validate-registry-methodologies.ts`
   - Create: `skills/pentest/hooks/pre-commit/`
   - Symlink: `hooks/pre-commit/validate-registry-methodologies.ts`

2. **Ghost Skill** (Additional)
   - Move: `pre-commit/validate-hero-prompts.ts`
   - Already exists: `skills/ghost/hooks/pre-commit/`
   - Symlink: `hooks/pre-commit/validate-hero-prompts.ts`

3. **Ghost Skill** (Workflow)
   - Move: `checklist-enforcer.ts`
   - Location: `skills/ghost/hooks/`
   - Symlink: `hooks/checklist-enforcer.ts`

4. **Monitor Skill**
   - Move: `active-work-limiter.ts`
   - Create: `tools/monitor/hooks/`
   - Symlink: `hooks/active-work-limiter.ts`

### Phase 2: Multi-Skill Hooks (Needs Refactoring)

**Hooks that reference multiple skills - may need splitting:**

1. **`pre-commit/08-validate-docs-public.ts`**
   - Currently: Validates Ghost, advisory, compliance docs
   - Options:
     - A) Split into skill-specific validators
     - B) Keep framework-level (validates public sync patterns)
   - **Recommendation:** Keep framework-level (validates manifest compliance)

2. **`file-guardian.ts`**
   - Currently: Protects files for advisory, compliance, ghost
   - Options:
     - A) Split into skill-specific file guardians
     - B) Keep framework-level (generic file protection)
   - **Recommendation:** Keep framework-level (security concern)

3. **`skill-loader.ts`**
   - Currently: References multiple skills in examples
   - **Recommendation:** Keep framework-level (infrastructure)

### Phase 3: Review Framework References

**Hooks with skill references that may be examples/tests:**

- Review each hook's actual logic vs documentation/examples
- Determine if skill references are:
  - A) Hard-coded validation rules → Move to skill
  - B) Example paths in comments → Keep framework
  - C) Dynamic skill loading → Keep framework

---

## 🔧 Implementation Checklist

For each hook migration:

- [ ] Create `skills/{skill}/hooks/` directory
- [ ] Move hook file to skill directory
- [ ] Create symlink from `hooks/` → `skills/{skill}/hooks/`
- [ ] Update `.framework-manifest.yaml` to exclude symlink
- [ ] Update hook documentation
- [ ] Test hook still executes correctly
- [ ] Verify public sync excludes hook
- [ ] Update this inventory

---

## 📊 Current Status

**Total Hooks:** 42 files
- ✅ **Active (in ~/.claude/settings.json):** 16 hooks configured
- ✅ **Migrated:** 2 (Ghost skill)
- 🎯 **High Priority:** 3 (security, ghost)
- 🔄 **Medium Priority:** 2 (monitor, ghost)
- 🤔 **Needs Review:** 3 (multi-skill hooks)
- 🏗️ **Framework-Level:** 28 (infrastructure, +3 from security hardening 2026-02-13)

**Pre-commit Hooks with Issues:**
| Hook | Issue | Severity | Status |
|------|-------|----------|--------|
| `10-validate-ghost-approvals.ts` | No output - exits early without results | Low | ✅ Working (manual script, not in pipeline) |
| `11-bash-tool-quick-scan.ts` | Missing auditor script | Low | ✅ Working (graceful skip - manual script) |
| `validate-registry-methodologies.ts` | Requires JSON input | Medium | ✅ **FIXED** - now handles empty stdin |
| `validate-file-placement.ts` | Uses npx ts-node, not in pipeline | Low | ⚠️ Not in pre-commit pipeline - unused |

**Note:** The "Additional Validators" section in `hooks/pre-commit/README.md` lists scripts that are NOT automatically run by the git pre-commit hook. They're manual/optional scripts.

**Estimated Migration Effort:**
- Phase 1: Quick (2-3 hours) - 4 hooks
- Phase 2: Medium (4-6 hours) - Refactoring decisions
- Phase 3: Review (2-3 hours) - Documentation/testing

---

## 🎨 Naming Convention

**Skill-scoped hooks should follow:**

```
skills/{skill}/hooks/
├── {hook-name}.ts              # PreToolUse, PostToolUse hooks
├── pre-commit/
│   └── {NN}-validate-{feature}.ts  # Pre-commit hooks (numbered)
├── pre-push/
│   └── {hook-name}.ts          # Pre-push hooks
└── README.md                   # Hook documentation
```

**Framework hooks directory:**

```
hooks/
├── {hook-name}.ts → ../skills/{skill}/hooks/{hook-name}.ts  # Symlinks to skill hooks
├── {framework-hook}.ts         # Actual framework hooks
├── pre-commit/
│   ├── {NN}-{name}.ts → ../../skills/{skill}/...  # Skill symlinks
│   └── {NN}-{framework}.ts     # Framework validators
└── HOOKS-INVENTORY.md          # This file
```

---

## 🚀 Quick Start: Migrate a Hook

```bash
# 1. Create skill hooks directory
mkdir -p skills/{skill}/hooks/pre-commit

# 2. Move hook
mv hooks/pre-commit/{hook}.ts skills/{skill}/hooks/pre-commit/

# 3. Create symlink
cd hooks/pre-commit
ln -s ../../skills/{skill}/hooks/pre-commit/{hook}.ts {hook}.ts
cd ../..

# 4. Update manifest (exclude symlink if private skill)
# Edit .framework-manifest.yaml:
#   hooks:
#     exclude:
#       - hooks/pre-commit/{hook}.ts

# 5. Test
git status  # Verify symlink shows as changed
bun hooks/pre-commit/{hook}.ts  # Verify hook still works

# 6. Commit
git add skills/{skill}/hooks/ hooks/pre-commit/{hook}.ts .framework-manifest.yaml
git commit -m "refactor({skill}): Move {hook} to skill-scoped architecture"
```

---

## 📋 Next Actions

1. **Immediate:** Migrate Phase 1 hooks (high confidence)
2. **Short-term:** Review and decide on Phase 2 multi-skill hooks
3. **Medium-term:** Update `/create` template with hooks/ support
4. **Long-term:** Establish hooks as standard skill component

---

## 🔧 Currently Configured Hooks (from ~/.claude/settings.json)

| Event | Matcher | Hooks |
|-------|---------|-------|
| SessionStart | (all) | `session-start.ts` |
| SessionEnd | (all) | `session-end.ts` |
| PreToolUse | (all) | `skill-hook-loader.ts` |
| PreToolUse | Write | `file-guardian.ts`, `validate-frontmatter.ts`, `skill-structure-validator.ts`, `validate-registry-methodologies.ts`, `validate-hero-prompts.ts` |
| PreToolUse | Read | (none - credentials checked via git scripts) |
| PreToolUse | Bash | `bash-command-validator.ts`, `enforce-package-manager.ts` |
| PostToolUse | (all) | `tool-tracker.ts`, `observe-events.ts` (monitor) |
| PostToolUse | Read | `agent-loader.ts`, `skill-loader.ts` |
| PostToolUse | Write\|Edit | `active-work-limiter.ts` |
| PostToolUse | Bash | `tool-usage-optimizer.ts` |
| Stop | (all) | `anti-rationalization.ts` |

---

**Related Documentation:**
- `skills/ghost/hooks/README.md` - Ghost skill hooks example
- `.framework-structure.yaml` - Valid skill subdirectories
- `.framework-manifest.yaml` - Public sync exclusions
