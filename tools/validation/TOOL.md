---
name: validation
type: utility
classification: public
description: Framework validation suite - UPS structure, doc references, pre-commit orchestration, skill structure, file patterns
version: 2.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/validation/validate-ups-structure.ts
  - bun tools/validation/validate-doc-references.ts
  - bun tools/validation/pre-commit-orchestrator.ts
related_tools:
  - tools/generators
  - tools/cleanup
  - hooks/pre-commit
---

# Framework Validation

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Framework validation and quality assurance suite.

**Why Public:**
- Standard validation patterns (structure, references, patterns)
- No proprietary logic - filesystem and syntax checks
- Useful for framework contributors and quality assurance
- Automated pre-commit integration

---

## Purpose

Comprehensive validation suite for framework quality assurance. Validates UPS (Universal Prompt Structure) compliance, document references, skill structure, file patterns, and orchestrates pre-commit checks.

**Core Capabilities:**
- **UPS validation**: Universal Prompt Structure v2.0 compliance
- **Reference checking**: Broken links and missing files in docs
- **Structure validation**: Skill directory structure compliance
- **Pattern validation**: .gitignore completeness, orphaned files
- **Pre-commit orchestration**: Run all validators before commits
- **Fix reports**: Generate actionable fix instructions

**Use Cases:**
- **Quality assurance**: Validate framework before commits
- **Skill development**: Ensure new skills follow standards
- **Documentation**: Check for broken references
- **CI/CD**: Automated validation in pipelines
- **Framework maintenance**: Detect structure drift

---

## Usage

### UPS Structure Validation

**Validate all skills:**
```bash
bun tools/validation/validate-ups-structure.ts

# Output:
# 🔍 Validating UPS v2.0 Structure...
#
# Scanning files:
#   ✓ skills/write/phases/01-research.md
#   ✓ skills/write/phases/02-draft.md
#   ✓ skills/pentest/prompts/web-api/xss-testing.md
#   ✗ skills/custom/phases/01-setup.md
#
# ═══════════════════════════════════════════════════════════════════
# VALIDATION REPORT
# ───────────────────────────────────────────────────────────────────
#
# Files Scanned: 247
# Passed: 245 (99.2%)
# Failed: 2 (0.8%)
# Critical Errors: 1
# Warnings: 3
#
# ═══════════════════════════════════════════════════════════════════
# FAILURES
# ───────────────────────────────────────────────────────────────────
#
# skills/custom/phases/01-setup.md:
#   ❌ CRITICAL: Missing required section "IDENTITY"
#   ❌ CRITICAL: Missing frontmatter field "model"
#   ⚠️  WARNING: OUTPUT CONTRACT missing example
#
# Fix with:
#   1. Add frontmatter: model: sonnet | haiku | opus
#   2. Add section: ## IDENTITY (role, perspective, constraints)
#   3. Add example to OUTPUT CONTRACT
#
# ═══════════════════════════════════════════════════════════════════
```

**Validate single skill:**
```bash
bun tools/validation/validate-ups-structure.ts --skill=write

# Only validates files in skills/write/
```

**JSON output:**
```bash
bun tools/validation/validate-ups-structure.ts --json > validation-report.json

# Structured JSON for CI/CD integration
```

**Generate fix report:**
```bash
bun tools/validation/validate-ups-structure.ts --fix-report

# Output:
# ✅ Fix report generated: .validation/ups-fix-report.md
#
# Contains:
# - File-by-file issues
# - Fix instructions
# - Code snippets to copy
# - Severity levels
```

---

### Document Reference Validation

**Check all markdown files:**
```bash
bun tools/validation/validate-doc-references.ts

# Output:
# 🔗 Validating Document References...
#
# Checking links in:
#   docs/CLAUDE.md
#   skills/*/SKILL.md
#   tools/*/TOOL.md
#   README.md
#
# ═══════════════════════════════════════════════════════════════════
# BROKEN REFERENCES
# ───────────────────────────────────────────────────────────────────
#
# docs/CLAUDE.md:
#   ❌ Line 45: tools/old-tool/ (directory not found)
#   ❌ Line 120: skills/deprecated/SKILL.md (file not found)
#
# skills/write/SKILL.md:
#   ⚠️  Line 30: ../templates/example.md (file exists but not tracked)
#
# ═══════════════════════════════════════════════════════════════════
# SUMMARY
# ───────────────────────────────────────────────────────────────────
#
# Total files checked: 85
# Broken references: 3
# Warnings: 1
#
# Exit code: 1 (errors found)
```

---

### Pre-Commit Orchestration

**Run all validators:**
```bash
bun tools/validation/pre-commit-orchestrator.ts

# Output:
# 🔍 Running Pre-Commit Validators...
#
# [1/5] Orphaned Files.....................✅ PASSED
# [2/5] Skill Structure....................✅ PASSED
# [3/5] Document References................⚠️  WARNINGS
# [4/5] Hidden Directories.................✅ PASSED
# [5/5] .gitignore Patterns................✅ PASSED
#
# ═══════════════════════════════════════════════════════════════════
# RESULTS
# ───────────────────────────────────────────────────────────────────
#
# Total: 5
# Passed: 4
# Warnings: 1
# Errors: 0
#
# Exit code: 2 (warnings only, commit allowed)
```

**Strict mode (warnings = errors):**
```bash
bun tools/validation/pre-commit-orchestrator.ts --strict

# Warnings will block commit in strict mode
```

---

### Skill Structure Validation

**Validate skill directories:**
```bash
bun tools/validation/skill-structure-validator.ts

# Checks:
# - phases/ directory exists
# - input/ and output/ directories
# - SKILL.md present
# - Phase files numbered correctly (01-, 02-, ...)
# - REGISTRY.json valid
```

---

### File Pattern Validation

**Check .gitignore completeness:**
```bash
bun tools/validation/gitignore-patterns-validator.ts

# Verifies:
# - .env files ignored
# - Backup files ignored (.backup, .bak, *~)
# - OS artifacts ignored (.DS_Store, Thumbs.db)
# - Editor temps ignored (.swp, .swo)
```

**Find orphaned files:**
```bash
bun tools/validation/orphaned-files-validator.ts

# Finds:
# - Backup files (.backup, .bak)
# - Temporary files (.tmp, .swp)
# - Untracked build artifacts
```

**Check for hidden directories:**
```bash
bun tools/validation/hidden-directory-validator.ts

# Flags suspicious hidden directories:
# - Not .git/
# - Not standard (.claude/, .framework-backup/)
# - Potentially malicious or accidental
```

---

## Configuration

### UPS v2.0 Requirements

**Required frontmatter fields:**
```yaml
---
domain: security | compliance | content | ...
skill: pentest | write | compliance | ...
agent: security | writer | legal | ...
model: sonnet | haiku | opus
mode: director | mentor | demo
complexity: 1 | 2 | 3
chain_position: initial | intermediate | terminal
---
```

**Required sections (all prompts):**
```markdown
## IDENTITY
## INPUT CONTRACT
## OBJECTIVE
## METHODOLOGY
## EXECUTION
## OUTPUT CONTRACT
## NEXT
## CHECKPOINTS
```

**Additional sections (security prompts):**
```markdown
## FLEXIBILITY GUIDANCE
## PROOF CLASSIFICATION
## TEST PLAN INTEGRATION
## REFERENCES
```

**Additional frontmatter (security prompts):**
```yaml
flexibility_tier: T1 | T2 | T3
```

### Validation Severity Levels

**Critical** (blocks commit):
- Missing required sections
- Missing required frontmatter
- Broken NEXT routing
- Malformed structure

**Warning** (allows commit):
- Missing examples in OUTPUT CONTRACT
- Incomplete CHECKPOINTS
- Advisory INPUT/OUTPUT contract mismatch
- Untracked referenced files

### Excluded Skills

Skills excluded from validation (not yet standardized):
```typescript
const EXCLUDED_SKILLS: string[] = [
  // Add skills here to exclude from validation
];
```

---

## API Reference

### UPS Structure Validator

#### `validate-ups-structure.ts [--skill=NAME] [--json] [--fix-report]`

Validate Universal Prompt Structure compliance.

**Flags:**
- `--skill=NAME` - Validate single skill only
- `--json` - JSON output for CI/CD
- `--fix-report` - Generate fix instructions

**Exit Codes:**
- `0` - All checks passed
- `1` - Critical errors found

---

### Document Reference Validator

#### `validate-doc-references.ts [--fix]`

Check for broken file/directory references in documentation.

**Flags:**
- `--fix` - Attempt automatic fixes (remove broken links)

**Exit Codes:**
- `0` - No broken references
- `1` - Broken references found

---

### Pre-Commit Orchestrator

#### `pre-commit-orchestrator.ts [--strict]`

Run all validators in sequence.

**Flags:**
- `--strict` - Treat warnings as errors

**Exit Codes:**
- `0` - All checks passed
- `1` - Blocking errors found
- `2` - Warnings only (non-blocking)

---

### Programmatic API

**Validate single file:**
```typescript
import { validateUPSFile } from '@/tools/validation/validate-ups-structure';

const result = validateUPSFile('skills/write/phases/01-research.md');

if (!result.passed) {
  console.error(`Validation failed: ${result.failures.length} issues`);
  result.failures.forEach(f => {
    console.error(`  ${f.severity}: ${f.message}`);
    console.error(`  Fix: ${f.fix_instructions}`);
  });
}
```

**Check document references:**
```typescript
import { validateDocReferences } from '@/tools/validation/validate-doc-references';

const brokenRefs = validateDocReferences('docs/CLAUDE.md');

brokenRefs.forEach(ref => {
  console.error(`Line ${ref.line}: ${ref.path} (${ref.error})`);
});
```

---

## Architecture

### UPS Validation Flow

```
Discover files (skills/*/phases/*.md, skills/*/prompts/**/*.md)
   ↓
For each file:
   ↓
1. Parse frontmatter (YAML)
   ├─ Extract: domain, skill, agent, model, mode, complexity, chain_position
   ├─ If security prompt: also check flexibility_tier
   └─ Validate: all required fields present
   ↓
2. Parse markdown sections
   ├─ Extract all ## headings
   ├─ Check: IDENTITY, INPUT CONTRACT, OBJECTIVE, ...
   └─ If security prompt: also check FLEXIBILITY GUIDANCE, PROOF CLASSIFICATION, ...
   ↓
3. Validate NEXT routing
   ├─ Extract file paths from NEXT section
   ├─ Check: files exist
   └─ Warn: if routing chain broken
   ↓
4. Validate OUTPUT → INPUT contracts
   ├─ Extract OUTPUT fields from current file
   ├─ Extract INPUT fields from NEXT file
   ├─ Check: OUTPUT covers all NEXT INPUT requirements
   └─ Advisory: warn if mismatch (not blocking)
   ↓
5. Generate result
   ├─ passed: true/false
   ├─ failures: Array of {check, message, fix_instructions, severity}
   └─ fileType: 'phase' | 'command' | 'prompt'
```

### Reference Validation Flow

```
Find all markdown files (docs/, skills/, tools/, README.md)
   ↓
For each file:
   ↓
1. Parse markdown links
   ├─ Extract [text](path)
   ├─ Extract ![alt](path)
   └─ Extract plain file paths (skills/foo/bar.md)
   ↓
2. Check each reference
   ├─ Resolve path (relative to file location)
   ├─ Check: file/directory exists
   └─ Check: file tracked in git (optional warning)
   ↓
3. Categorize
   ├─ Error: file/directory doesn't exist
   ├─ Warning: file exists but not tracked
   └─ OK: file exists and tracked
   ↓
4. Generate report
   ├─ Group by file
   ├─ Show line numbers
   └─ Provide fix suggestions
```

### Pre-Commit Orchestration Flow

```
Pre-commit hook triggers orchestrator
   ↓
For each validator in sequence:
   ↓
1. Run validator (execFileSync)
   ├─ Capture stdout/stderr
   ├─ Capture exit code
   └─ Measure duration
   ↓
2. Categorize result
   ├─ severity='error' + exit!=0 → blocking error
   ├─ severity='warning' + exit!=0 → warning
   └─ exit==0 → passed
   ↓
3. Aggregate results
   ├─ Count passed/failed/warnings
   ├─ Store output for each validator
   └─ Determine overall exit code
   ↓
4. Print summary
   ├─ [1/5] Validator Name.........STATUS
   ├─ ...
   └─ Exit code: 0 (pass), 1 (error), 2 (warnings)
   ↓
Exit with aggregate code
   ├─ 0: Commit allowed (all passed)
   ├─ 1: Commit blocked (errors)
   └─ 2: Commit allowed with warnings (--strict blocks)
```

---

## Scripts

### CI/CD Integration

**GitHub Actions example:**
```yaml
name: Framework Validation
on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: oven-sh/setup-bun@v1
      - run: bun install
      - run: bun tools/validation/pre-commit-orchestrator.ts --strict
```

### Pre-Commit Hook

**Install in .git/hooks/pre-commit:**
```bash
#!/bin/bash
bun tools/validation/pre-commit-orchestrator.ts

exit_code=$?

if [ $exit_code -eq 1 ]; then
  echo "❌ Commit blocked by validation errors"
  exit 1
elif [ $exit_code -eq 2 ]; then
  echo "⚠️  Warnings found, commit allowed"
  exit 0
fi

exit 0
```

### Validation Report Generator

```bash
#!/bin/bash
# Generate comprehensive validation report

echo "Generating validation report..."

# UPS validation
bun tools/validation/validate-ups-structure.ts --json > .validation/ups-report.json

# Document references
bun tools/validation/validate-doc-references.ts > .validation/doc-refs.txt

# Pre-commit summary
bun tools/validation/pre-commit-orchestrator.ts > .validation/pre-commit.txt

echo "✅ Reports generated in .validation/"
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- `tools/markdown/section-parser` - Markdown parsing utilities

### Framework Integration

**Called By:**
- `.git/hooks/pre-commit` - Automatic validation before commits
- CI/CD pipelines - Quality gates
- `/create` skill - Validate new skills

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Hooks:**
- `hooks/pre-commit/` — pre-commit-orchestrator.ts runs validate-ups-structure.ts and validate-doc-references.ts before every commit

**Skills:**
- `skills/create/` — uses validate-ups-structure.ts to verify new skills follow UPS format before completion

**Tools:**
- `tools/docs/` — catalog generation runs validation checks on skill/tool TOOL.md files

---

**File Structure:**
```
tools/validation/
├── validate-ups-structure.ts          # UPS v2.0 validator
├── validate-doc-references.ts         # Reference checker
├── pre-commit-orchestrator.ts         # Validator orchestration
├── skill-structure-validator.ts       # Skill directory validation
├── orphaned-files-validator.ts        # Find stray files
├── gitignore-patterns-validator.ts    # .gitignore completeness
├── hidden-directory-validator.ts      # Suspicious directories
└── TOOL.md                            # This file
```

---

## Troubleshooting

### "UPS validation failed"

**Cause:** Prompt file doesn't follow UPS v2.0 structure

**Fix:**
```bash
# Generate fix report
bun tools/validation/validate-ups-structure.ts --fix-report

# Review .validation/ups-fix-report.md
cat .validation/ups-fix-report.md

# Apply fixes file-by-file
```

### "Broken reference: file not found"

**Cause:** Documentation references non-existent file

**Fix:**
```bash
# List all broken references
bun tools/validation/validate-doc-references.ts

# Options:
# 1. Create missing file
# 2. Update reference to correct path
# 3. Remove broken reference
```

### "Pre-commit orchestrator blocks commit"

**Cause:** Critical validation errors

**Debug:**
```bash
# Run orchestrator to see which validator failed
bun tools/validation/pre-commit-orchestrator.ts

# Run specific failing validator
bun tools/validation/[failing-validator].ts

# Fix issues, then retry commit
```

### "Skill excluded from validation"

**Cause:** Skill in EXCLUDED_SKILLS list

**Fix:**
```typescript
// In validate-ups-structure.ts
const EXCLUDED_SKILLS: string[] = [
  // 'my-skill',  // Remove from exclusion list
];
```

---

## Related Tools

- **tools/generators** - Generate UPS-compliant prompts
- **tools/cleanup** - Remove orphaned files
- **hooks/pre-commit** - Calls pre-commit-orchestrator
- **tools/markdown** - Section parsing utilities

---

## Version History

### 2.0.0 (2026-01-28)
- ✅ UPS v2.0 validation (8 required sections + security-specific)
- ✅ Flexibility tier validation for security prompts
- ✅ Document reference checker
- ✅ Pre-commit orchestration
- ✅ Fix report generation
- ✅ JSON output for CI/CD
- ✅ Skill structure validation
- ✅ .gitignore pattern validation
- ✅ Orphaned file detection

### 1.0.0 (2026-01-15)
- Initial UPS validation
- Basic structure checks

---

## References

- **UPS v2.0 Specification:** `docs/universal-prompt-structure-v2.md`
- **Security Prompt Standards:** `skills/pentest/docs/prompt-standards.md`
- **Skill Structure Standards:** `docs/templates/SKILL-TEMPLATE.md`
- **CI/CD Integration:** `docs/ci-cd-validation.md`
