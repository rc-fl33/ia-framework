---
audience: intermediate
category: workflows
---


# Framework Validation System

**Status:** ✅ Complete (Week 2 Day 1-4)

---

## Overview

The validation system is a comprehensive suite of automated checks that ensure framework integrity at commit time. It prevents common mistakes, enforces standards, and maintains cross-reference consistency across all framework components.

**Purpose:**
- Catch errors before they enter git history
- Enforce framework standards automatically
- Maintain cross-reference consistency
- Prevent credential leaks and security issues
- Ensure documentation accuracy

**Benefits:**
- Fast feedback loop (<2 seconds for most checks)
- Blocks commits with errors (exit code 1-2)
- Detailed logs for debugging
- Zero manual validation overhead
- Framework health guarantees

---

## Architecture

### System Flow

```
┌─────────────────────────────────────────────┐
│ Developer: git commit                       │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│ Git Pre-Commit Hook                         │
│ (.git/hooks/pre-commit)                     │
│                                             │
│ Runs 11 validation checks sequentially:    │
│   1. Credential scan                        │
│   2. Forbidden files                        │
│   3. TypeScript syntax                      │
│   4. Hardcoded counts                       │
│   5. File naming                            │
│   6. Glob patterns                          │
│   7. Path resolution                        │
│   8. Routing gates                          │
│   9. Frontmatter schemas (orchestrated)     │
│  10. Cross-references (orchestrated)        │
│  11. Path validation (orchestrated)         │
└─────────────────────────────────────────────┘
                    ↓
          ┌─────────┴─────────┐
          │                   │
    ALL PASSED          ANY FAILED
          │                   │
          ↓                   ↓
┌─────────────────┐   ┌─────────────────┐
│ ✅ COMMIT        │   │ ❌ BLOCK         │
│ ALLOWED          │   │ COMMIT           │
│                  │   │                  │
│ exit 0           │   │ exit 1 or 2      │
└─────────────────┘   └─────────────────┘
                              ↓
                    ┌─────────────────────┐
                    │ Display:            │
                    │ - Error messages    │
                    │ - Log file paths    │
                    │ - Fix instructions  │
                    └─────────────────────┘
```

### Validator Architecture (Checks 9-11)

```
┌─────────────────────────────────────────────┐
│ 00-validate-framework.ts (Orchestrator)     │
│                                             │
│ Coordinates specialized validators:         │
│ - Spawns validator processes               │
│ - Collects results                         │
│ - Aggregates errors/warnings               │
│ - Provides unified reporting               │
└─────────────────────────────────────────────┘
                    ↓
        ┌───────────┼───────────┐
        ↓           ↓           ↓
┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│ Frontmatter  │ │ Cross-Refs   │ │ Paths        │
│ Validator    │ │ Validator    │ │ Validator    │
│              │ │              │ │              │
│ - SKILL.md   │ │ - CLAUDE.md  │ │ - File refs  │
│   schema     │ │   ↔ skills/  │ │ - Symlinks   │
│ - Blog post  │ │ - Agent refs │ │ - Catalog    │
│   schema     │ │ - Routing    │ │ - Scripts    │
│              │ │   gates      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
        ↓           ↓           ↓
┌────────────────────────────────────────────┐
│ Log Files (logs/validation/)               │
│ - frontmatter-validation.log               │
│ - cross-refs-validation.log                │
│ - paths-validation.log                     │
└────────────────────────────────────────────┘
```

---

## Validation Pipeline

The pre-commit hook runs 11 checks sequentially. Each check focuses on a specific aspect of framework health.

### 1. Credential Scan

**Purpose:** Detect hardcoded API keys, secrets, passwords, and tokens

**Triggers:** TypeScript, JavaScript, JSON, YAML files (non-test)

**Detection:**
- Pattern: `(API_KEY|SECRET|PASSWORD|TOKEN) = "actual_value"`
- Excludes: `process.env.*`, `.env.example`, templates

**Blocking:** Yes (exit 1)

**Example violation:**
```typescript
const API_KEY = "sk-abc123...";  // ❌ BLOCKED
```

**Fix:**
```typescript
const API_KEY = process.env.API_KEY;  // ✅ ALLOWED
```

---

### 2. Forbidden Files

**Purpose:** Prevent committing sensitive files that should never be in git

**Triggers:** Any staged file matching forbidden patterns

**Blocked files:**
- `.env`, `.env.local`, `.env.production`
- `credentials.json`
- `.aws/credentials`
- `id_rsa`, `*.pem`

**Blocking:** Yes (exit 1)

**Fix:** Add to `.gitignore` and unstage

---

### 3. TypeScript Syntax

**Purpose:** Catch syntax errors before they enter git history

**Triggers:** Staged `.ts` files

**Validation:** Parser-only check (no type checking for speed)

**Blocking:** Yes (exit 1)

**Example violation:**
```typescript
const x = {  // ❌ Missing closing brace
```

---

### 4. Hardcoded Counts

**Purpose:** Prevent hardcoded component counts that create maintenance debt

**Triggers:** Documentation files (`.md`, `.yml`, `.yaml`)

**Script:** `hooks/pre-commit/prevent-hardcoded-counts.ts`

**Violations:**
- "5 skills" → Use "multiple skills" or dynamic generation
- "12 validators" → Use qualitative descriptions

**Blocking:** Yes (exit 1)

**Why:** See Content Guardian mandate (`docs/prompts/content-guardian.md`)

---

### 5. File Naming

**Purpose:** Enforce lowercase-hyphenated naming in documentation

**Triggers:** Files in `skills/*/docs/`

**Script:** `tools/validation/validate-file-naming.ts`

**Rules:**
- Lowercase only
- Hyphens for word separation (not underscores/spaces)
- No special characters

**Blocking:** Yes (exit 1)

**Examples:**
- ❌ `MyDocument.md`
- ❌ `my_document.md`
- ✅ `my-document.md`

---

### 6. Glob Patterns

**Purpose:** Validate Glob patterns used in documentation for resource discovery

**Triggers:** All commits (broken patterns break agent workflows)

**Script:** `tools/validation/validate-glob-patterns.ts`

**Validation:**
- Tests patterns against actual filesystem
- Ensures patterns return expected results
- Checks for syntax errors

**Blocking:** Yes (exit 1)

**Why:** Broken patterns break agent resource discovery

---

### 7. Path Resolution

**Purpose:** Prevent hardcoded absolute paths that break framework portability

**Triggers:** TypeScript, JavaScript, Bash files

**Violations:**
- Hardcoded `/home/username/...`
- ANY `HOME.*/.claude` reference (use `import.meta.dir` or `SCRIPT_DIR` self-discovery instead)

**Blocking:** Yes (exit 1)

**Fix:**
```typescript
// ❌ Hardcoded
const path = "/home/groves/.claude";

// ❌ Old fallback pattern (no longer allowed)
const path = process.env.IA_FRAMEWORK_ROOT || join(HOME, '.claude');

// ✅ Portable (self-discovery via import.meta.dir)
const path = process.env.IA_FRAMEWORK_ROOT || join(import.meta.dir, <levels_to_root>);

// ✅ Or use canonical utility
import { resolveFrameworkRoot } from '@/tools/framework/utils/path-resolution';
```

---

### 8. Routing Gates

**Purpose:** Validate routing gate presence and correctness in skills

**Triggers:** SKILL.md files

**Script:** `hooks/pre-commit/validate-routing-gates.ts`

**Validation:**
- Routing gate section present
- Contains delegation instructions
- Follows template format

**Blocking:** Yes (exit 1)

**See:** `docs/templates/routing-gate-template.md`

---

### 9. Frontmatter Schemas (Orchestrated)

**Purpose:** Validate YAML frontmatter against JSON schemas

**Script:** `hooks/pre-commit/01-validate-frontmatter.ts`

**Triggers:**
- `SKILL.md` files → `tools/framework/security/schemas/skill-frontmatter.schema.json`
- Blog posts → `tools/framework/security/schemas/blog-post-frontmatter.schema.json`

**Validation:**
- Required fields present
- Field types match schema
- Enum values valid
- Pattern validation (slugs, dates)

**Severity:** Errors only (no warnings)

**Blocking:** Yes (exit code 2)

**Log:** `logs/validation/frontmatter-validation.log`

**Example violation:**
```yaml
---
name: my-skill
classification: invalid  # Must be: public, private, or experimental
---
```

**Fix:**
```yaml
---
name: my-skill
classification: private
version: 1.0.0
status: active
---
```

---

### 10. Cross-References (Orchestrated)

**Purpose:** Ensure cross-references between CLAUDE.md and skills/ stay synchronized

**Script:** `hooks/pre-commit/02-validate-cross-refs.ts`

**Triggers:** CLAUDE.md, SKILL.md, agent files

**Validation:**

**Errors (blocking):**
- Skills listed in CLAUDE.md must exist in `skills/`
- Skills in `skills/` must be listed in CLAUDE.md directory structure
- Agent references in routing table must exist in `agents/`

**Warnings (non-blocking):**
- Missing routing gates in skills

**Severity Levels:**
- Error: Missing skills, broken agent references (BLOCKS commit)
- Warning: Missing routing gates (allows commit)

**Blocking:** Errors only (exit code 2)

**Log:** `logs/validation/cross-refs-validation.log`

**Example violations:**

```
CLAUDE.md references skill that doesn't exist:
├── skills/
│   ├── fake-skill/            # ERROR: skills/fake-skill/ not found

Skill exists but not in CLAUDE.md:
skills/
  └── {orphaned-skill}/SKILL.md  # ERROR: Not listed in CLAUDE.md
```

---

### 11. Path Validation (Orchestrated)

**Purpose:** Validate file path references and symlink integrity

**Script:** `hooks/pre-commit/03-validate-paths.ts`

**Triggers:** Markdown, TypeScript, JavaScript files

**Validation:**

**Errors (blocking):**
- File references in markdown must exist
- Symlinks in `commands/` must have valid targets
- Tool catalog script references must exist

**Warnings (non-blocking):**
- Missing skill scripts referenced in SKILL.md

**Detection patterns:**
- Markdown links: `[text](path/to/file.md)`
- See references: ``See `path/to/file.md` ``
- Direct references: `skills/name/SKILL.md`

**Blocking:** Errors only (exit code 2)

**Log:** `logs/validation/paths-validation.log`

**Example violations:**

```
Example 1: Broken file reference

Example 2: Broken symlink
  commands/tool -> ../skills/fake/scripts/tool.ts

Example 3: Tool catalog broken path
  Location: skills/fake/scripts/tool.ts

Example 4: Missing skill script (warning)
  Run scripts/report.ts
```

These would trigger ERROR if the referenced files don't exist.

---

## Orchestrator Usage

### Running the Orchestrator

The orchestrator (`00-validate-framework.ts`) coordinates all three specialized validators and provides unified reporting.

**Standalone usage:**
```bash
bun run hooks/pre-commit/00-validate-framework.ts
```

**Automatic usage:**
- Called from `.git/hooks/pre-commit` (checks 9-11)
- Future: Week 3 orchestration engine will use this

**Output example (all pass):**
```
🔍 Running Framework Validation Suite...

[1/3] Frontmatter Schemas.......... ✅ PASS
[2/3] Cross-References............. ✅ PASS
[3/3] Path Validation.............. ✅ PASS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary: 0 failed, 3 passed

✅ FRAMEWORK VALIDATION PASSED!
```

**Output example (with failures):**
```
🔍 Running Framework Validation Suite...

[1/3] Frontmatter Schemas.......... ✅ PASS
[2/3] Cross-References............. ❌ FAIL (22 errors, 17 warnings)
[3/3] Path Validation.............. ✅ PASS

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Summary: 1 failed, 2 passed
Total issues: 22 errors, 17 warnings

❌ FRAMEWORK VALIDATION FAILED!

   Cross-References:
      22 error(s)
      17 warning(s)
      Log: logs/validation/cross-refs-validation.log

Review logs:
   - logs/validation/frontmatter-validation.log
   - logs/validation/cross-refs-validation.log
   - logs/validation/paths-validation.log
```

---

## Exit Codes & Blocking

The validation system uses specific exit codes to communicate results:

### Exit Code 0 - Success

**Meaning:** All validations passed, commit allowed

**Action:** Git proceeds with commit

**Applies to:** All validators

---

### Exit Code 1 - Legacy Block

**Meaning:** Validation failed (legacy validators)

**Action:** Git blocks commit

**Applies to:**
- Credential scan
- Forbidden files
- TypeScript syntax
- Hardcoded counts
- File naming
- Glob patterns
- Path resolution
- Routing gates

**Behavior:** Immediate failure, detailed error output

---

### Exit Code 2 - Orchestrated Block

**Meaning:** Validation failed with detailed reporting

**Action:** Git blocks commit

**Applies to:**
- Frontmatter validation
- Cross-reference validation
- Path validation
- Orchestrator (if any validator fails)

**Behavior:**
- Continues running all validators (collects all issues)
- Aggregates errors and warnings
- Provides detailed logs
- Unified reporting at end

**Why exit 2:** Distinguishes orchestrated validators from legacy ones

---

### Bypass Mechanism

**Emergency bypass:** `git commit --no-verify`

**When to use:**
- Urgent hotfixes
- False positives (report these!)
- Framework development/testing

**Warning:** Only use when absolutely necessary. Bypassing validation can introduce errors into git history.

---

## Log Files

All orchestrated validators write detailed logs to `logs/validation/`.

### Log Directory Structure

```
logs/validation/
├── frontmatter-validation.log    # YAML schema validation details
├── cross-refs-validation.log     # Cross-reference sync issues
└── paths-validation.log          # Path reference and symlink issues
```

### Log Format

Each log file follows this structure:

```
<Validator Name> Validation Log - <ISO timestamp>
============================================================

Total issues: <N> (<M> errors, <P> warnings)

ERRORS:
  ❌ [category] message
  ❌ [category] message

WARNINGS:
  ⚠️  [category] message

Resolution:
  1. Fix instruction
  2. Fix instruction
```

### Example Log (Cross-References)

```
Cross-Reference Validation Log - 2026-01-22T10:30:45.123Z
============================================================

Total issues: 39 (22 errors, 17 warnings)

ERRORS:
  ❌ [missing-skill] CLAUDE.md references skill 'old-skill' but skills/old-skill/ doesn't exist
  ❌ [undocumented-skill] Skill 'new-skill' exists but is not listed in CLAUDE.md directory structure
  ❌ [missing-agent] CLAUDE.md references agent 'removed-agent' but agents/removed-agent.md doesn't exist

WARNINGS:
  ⚠️  [missing-routing-gate] Skill 'banking' is missing a routing gate in SKILL.md
  ⚠️  [missing-routing-gate] Skill 'training' is missing a routing gate in SKILL.md

Resolution:
  1. Ensure CLAUDE.md directory structure matches skills/
  2. Verify all agent references are valid
  3. Add routing gates to skills without them
```

### Log Retention

**Policy:** Logs are overwritten on each validation run

**Why:** Logs are diagnostic tools, not audit trails. Git history is the audit trail.

**Persistence:** Logs are `.gitignore`d (not committed)

---

## Troubleshooting

### Common Issues

#### Issue: Frontmatter validation fails with "Missing required field"

**Cause:** SKILL.md or blog post missing required frontmatter fields

**Fix:**
1. Check schema: `tools/framework/security/schemas/skill-frontmatter.schema.json` or `blog-post-frontmatter.schema.json`
2. Review template: `docs/templates/SKILL-TEMPLATE.md`
3. Add missing fields to frontmatter

**Example:**
```yaml
---
name: my-skill
classification: private
version: 1.0.0        # ← Add this if missing
status: active        # ← Add this if missing
---
```

---

#### Issue: Cross-reference validation fails with "Skill exists but not listed in CLAUDE.md"

**Cause:** Created new skill but didn't update CLAUDE.md directory structure

**Fix:**
1. Open CLAUDE.md
2. Find the directory structure section
3. Add skill to the tree under `skills/`:

```markdown
├── skills/                   # Modular capabilities
│   ├── existing-skill/       # Existing skill
│   ├── your-new-skill/      # ← Add this line
```

---

#### Issue: Path validation fails with "References non-existent file"

**Cause:** Documentation references a file that was moved/renamed/deleted

**Fix:**
1. Check log: `logs/validation/paths-validation.log`
2. Find referenced path
3. Either:
   - Create the missing file
   - Update reference to correct path
   - Remove the reference if obsolete

---

#### Issue: "BLOCKED due to hardcoded counts"

**Cause:** Documentation contains specific numbers with component names

**Fix:** Replace hardcoded counts with qualitative descriptions

**Examples:**
- ❌ "5 skills available"
- ✅ "Multiple skills available"
- ✅ Use dynamic generation if count needed

**See:** `docs/prompts/content-guardian.md`

---

#### Issue: Symlink validation fails

**Cause:** Symlink in `commands/` points to non-existent file

**Fix:**
```bash
# Find broken symlink
ls -la commands/

# Remove broken symlink
rm commands/broken-command

# Create correct symlink
ln -s ../skills/my-skill/scripts/command.ts commands/my-command
```

---

#### Issue: False positive (validator is wrong)

**Action:**
1. **Immediate:** Bypass with `git commit --no-verify`
2. **Report:** Document the false positive
3. **Fix:** Update validator logic to handle edge case

**Example report:**
```markdown
False positive in path validator:

Pattern: `See scripts/*.ts` (wildcard path)
Validator: Tries to resolve literally, fails
Fix needed: Skip validation for wildcard paths
```

---

### Debug Mode

**Enable verbose output:**
```bash
# Run individual validator with debug info
bun run hooks/pre-commit/01-validate-frontmatter.ts

# Check what files are staged
git diff --cached --name-only

# Test validator without committing
bun run hooks/pre-commit/00-validate-framework.ts && echo "Would pass"
```

---

### Performance Issues

**Symptom:** Validation takes >5 seconds

**Causes:**
1. Large number of staged files
2. Complex cross-reference graph
3. Many path references to check

**Solutions:**
- Commit in smaller batches
- Use `--no-verify` for bulk operations (then validate separately)
- Report performance regression (should be <2 seconds normally)

---

## Integration Points

### Pre-Commit Hook Integration

**File:** `.git/hooks/pre-commit`

**Integration points:**
```bash
# Checks 1-8: Individual validators (legacy)
bun run hooks/pre-commit/prevent-hardcoded-counts.ts
bun run hooks/pre-commit/validate-routing-gates.ts
# etc...

# Checks 9-11: Orchestrated validators (new)
bun run hooks/pre-commit/00-validate-framework.ts
```

**Execution:** Sequential (check 1 → 2 → ... → 11)

**Failure handling:**
- Any check fails → Accumulate failure count
- All checks run (continue on failure)
- Final exit: 0 if all passed, 1 if any failed

---

### Week 3 Orchestration Engine

**Status:** Planned integration

**Purpose:** Use validation orchestrator for workflow quality gates

**Usage:**
```typescript
// Week 3 orchestration manifest
{
  "phases": [
    {
      "name": "validate",
      "script": "hooks/pre-commit/00-validate-framework.ts",
      "blocking": true,
      "on_failure": "abort_workflow"
    }
  ]
}
```

**Benefits:**
- Reuse validation logic in automated workflows
- Consistent quality gates across git and automation
- Single source of truth for validation rules

---

### CI/CD Integration (Future)

**Planned:** Run validation suite in CI/CD pipelines

**Usage:**
```yaml
# GitHub Actions example
- name: Framework Validation
  run: bun run hooks/pre-commit/00-validate-framework.ts
```

**Benefits:**
- Catch issues in pull requests
- Enforce validation on all contributors
- Automated quality reporting

---

## Validator Details

### Frontmatter Validator

**Technology:**
- Ajv (JSON schema validation)
- gray-matter (YAML frontmatter parsing)

**Schemas:**
- `tools/framework/security/schemas/skill-frontmatter.schema.json`
- `tools/framework/security/schemas/blog-post-frontmatter.schema.json`

**Error reporting:**
```
❌ Missing required field: version
❌ /classification: must be one of: public, private, experimental
❌ /slug: must match pattern ^[a-z0-9-]+$
```

**Performance:** <100ms for typical skill file

---

### Cross-Reference Validator

**Technology:**
- Filesystem scanning
- Regex pattern matching
- Set-based diff analysis

**Detection:**
- Skills: Directory tree parsing in CLAUDE.md
- Agents: Routing table extraction
- Routing gates: Section header search

**Error categories:**
- `missing-skill`: Referenced but doesn't exist
- `undocumented-skill`: Exists but not referenced
- `missing-agent`: Agent reference broken
- `missing-routing-gate`: Skill lacks routing gate (warning)

**Performance:** <200ms for typical framework

---

### Path Validator

**Technology:**
- Path extraction via regex
- Filesystem existence checks
- Symlink resolution

**Detection patterns:**
- Markdown links: `[text](path)`
- Inline references: `` `path/to/file` ``
- Direct paths: `skills/name/file.md`

**Exclusions:**
- HTTP/HTTPS URLs
- Placeholder paths (`path/to/`, `/name/`)
- Checklist items
- Code files (for performance)

**Error categories:**
- `broken-reference`: File reference doesn't exist
- `broken-symlink`: Symlink target missing
- `catalog-broken-path`: Tool catalog path invalid
- `skill-broken-script`: Script reference invalid (warning)

**Performance:** <300ms for typical framework

---

## Version History

**v1.0.0** (Week 2 Day 1-4, Jan 2026)
- Initial release
- Three specialized validators
- Orchestrator with unified reporting
- Pre-commit integration
- Log file system

**Planned v1.1.0** (Week 3)
- Orchestration engine integration
- Parallel validator execution
- Enhanced error messages
- Performance optimizations

---

## See Also

- **Pre-commit hooks:** `hooks/pre-commit/README.md`
- **Orchestration plan:** `plans/framework-orchestration-validation-complete.md`
- **Routing gates:** `docs/templates/routing-gate-template.md`
- **Schemas:** `tools/framework/security/schemas/`
- **Content Guardian:** `docs/prompts/content-guardian.md`

---

**Version:** 1.0.0
**Last Updated:** 2026-01-22
**Status:** Complete
