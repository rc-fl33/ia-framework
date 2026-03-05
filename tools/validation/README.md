# Framework Validation Tools

Validation and auditing tools for the Intelligence Adjacent framework.

## Available Tools

### Full Framework Audit

**File:** `full-framework-audit.ts`

Comprehensive validation of entire framework (not just staged files). Unlike pre-commit hooks which are fast and only check staged files, this performs deep validation of the entire codebase.

**Usage:**
```bash
# Run audit and display results
bun run tools/validation/full-framework-audit.ts

# Output JSON report
bun run tools/validation/full-framework-audit.ts --json

# Output markdown report
bun run tools/validation/full-framework-audit.ts --markdown

# Output both formats
bun run tools/validation/full-framework-audit.ts --json --markdown
```

**What it validates:**
- Catalog completeness (skills in filesystem vs catalog)
- Classification consistency (SKILL.md vs catalog)
- Broken documentation references
- README hardcoded counts
- Catalog count mismatches
- SKILL.md frontmatter completeness

**Output locations:**
- JSON: `logs/validation/framework-audit-YYYY-MM-DD.json`
- Markdown: `docs/audits/framework-audit-YYYY-MM-DD.md`

**Performance:**
- ~0.5 seconds for full framework scan
- Excludes sessions/ and audits/ directories (historical content)
- Exit code 1 if issues found, 0 if clean

**Use cases:**
- Weekly manual audits
- CI/CD pipeline validation
- Baseline for learning loop integration
- Drift detection over time

---

### Document Reference Validator

**File:** `validate-doc-references.ts`

Scans all critical documentation files for broken file/directory references and version inconsistencies.

**Usage:**
```bash
# Console output
bun tools/validation/validate-doc-references.ts

# JSON output for programmatic use
bun tools/validation/validate-doc-references.ts --json
```

**What it checks:**
- File references in backtick-quoted paths
- Directory references (paths ending in `/`)
- Version string consistency across files

**Exit Codes:**
- 0 = All references valid
- 1 = Broken references found

**Integration:** Runs as check 15/15 in the git pre-commit hook (`.git/hooks/pre-commit`). Blocks commits if broken references exist.

---

### Pre-Commit Orchestrator

**File:** `pre-commit-orchestrator.ts`

Runs all validation scripts in sequence with consistent output formatting.

**Usage:**
```bash
bun tools/validation/pre-commit-orchestrator.ts [--strict]
```

**Exit Codes:**
- 0 = All checks passed
- 1 = Blocking errors found

---

### UPS Structure Validator

**File:** `validate-ups-structure.ts`

Validates skill directories follow the Unified Phase Structure (UPS v2.0).

---

## Integration

### Pre-commit

The pre-commit orchestrator coordinates validators during `git commit`.

### Standalone

All validators can run independently:
```bash
bun tools/validation/<validator>.ts
```

## Related

- `hooks/pre-commit/` - Git pre-commit hooks
- `docs/standards/readme-maintenance-rules.md` - Documentation standards
- `docs/standards/agent-format-standards.md` - Agent format requirements
