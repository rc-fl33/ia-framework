# Framework Validation System

This document explains the complete validation system that ensures framework consistency and prevents common issues.

## Overview

The validation system uses multiple specialized validators that run at different stages:

- **Pre-commit**: Lightweight checks before code enters git history (~2 seconds)
- **Extended**: Full framework structure validation
- **Pre-push**: Comprehensive audits before remote sync

## Core Validators

### 1. Orphaned Files Validator

**Purpose**: Detects backup files, temporary files, and stray cache that shouldn't be tracked.

**Location**: `tools/validation/orphaned-files-validator.ts`

**Detects**:
- Backup files: `*.backup`, `*.backup-*`, `*.bak`, `*.tmp`, `*~`
- OS files: `.DS_Store`, `Thumbs.db`
- Editor temporaries: `*.swp`, `*.swo`
- Stray cache: `.cache/`, `__pycache__/` (unless in .gitignore)

**Severity**: Warning for files in `scripts/` or hidden dirs, Error otherwise

**Running**:
```bash
bun tools/validation/orphaned-files-validator.ts
```

**False Positives**: If you have legitimate backup files, add them to the ALLOW_LIST in the validator.

### 2. Skill Structure Validator

**Purpose**: Verifies that all skills follow the correct directory structure.

**Location**: `tools/validation/skill-structure-validator.ts`

**Checks**:
- `SKILL.md` exists at `/skills/{name}/SKILL.md` (not in `scripts/`)
- `output/` exists at `/skills/{name}/output/` (not in `scripts/`)
- `input/` exists at `/skills/{name}/input/`
- `scripts/` exists at `/skills/{name}/scripts/`

**Severity**: Error

**Running**:
```bash
bun tools/validation/skill-structure-validator.ts
```

**Fixing**: Move misplaced files to skill root:
```bash
# Move SKILL.md from scripts to skill root
mv skills/{name}/scripts/SKILL.md skills/{name}/SKILL.md

# Move output directory from scripts to skill root
mv skills/{name}/scripts/output skills/{name}/output
```

### 3. Hidden Directory Validator

**Purpose**: Scans for hidden directories and detects suspicious ones.

**Location**: `tools/validation/hidden-directory-validator.ts`

**Known Allowed Hidden Directories**:
- `.git`, `.github` (version control)
- `.claude` (framework config)
- `.vscode`, `.idea` (IDE settings)
- `.obsidian` (documentation editor)
- `.browser-state`, `.playwright` (browser automation)
- and others in the ALLOWED_HIDDEN set

**Suspicious Directories** (errors):
- `.framework-staging` (leftover from framework updates)
- `.build-cache` (build artifacts)
- `.work-in-progress` (incomplete work)
- `.backup` (backup directory)

**Severity**: Warning for unexpected dirs, Error for suspicious dirs

**Running**:
```bash
bun tools/validation/hidden-directory-validator.ts
```

**Adding Allowed Directories**: Edit ALLOWED_HIDDEN in the validator to add legitimate hidden dirs.

### 4. .gitignore Patterns Validator

**Purpose**: Verifies that all necessary patterns exist in .gitignore.

**Location**: `tools/validation/gitignore-patterns-validator.ts`

**Validates Patterns By Category**:
- **Backup Files**: `*.backup`, `*.backup-*`, `*.tmp`, `*.bak`, `*~`
- **Browser Artifacts**: `**/.browser-state/`, `**/.playwright/`
- **Dependencies**: `node_modules/`, `package-lock.json`, `yarn.lock`
- **Build**: `dist/`, `*.tsbuildinfo`
- **Credentials**: `.env`, `.env.local`, `.credentials.json`
- **IDE**: `.vscode/`, `.idea/`, `*.swp`, `*.swo`
- **OS**: `.DS_Store`, `Thumbs.db`
- **Logs**: `*.log`, `logs/`
- **Cache**: `.cache/`, `.eslintcache`
- **Skill Output/Input**: `**/output/*`, `**/input/*`

**Severity**: Warning (non-blocking)

**Running**:
```bash
bun tools/validation/gitignore-patterns-validator.ts
```

**Fixing**: The tool outputs suggested additions to .gitignore. Add them manually:
```bash
# Example: Add missing pattern
echo "**/*.tmp" >> .gitignore
```

## Extended Validation Orchestrator

**Purpose**: Runs all framework structure validators in sequence.

**Location**: `tools/validation/pre-commit-orchestrator.ts`

**Running**:
```bash
# Standard mode (errors block, warnings pass)
bun tools/validation/pre-commit-orchestrator.ts

# Strict mode (errors and warnings block)
bun tools/validation/pre-commit-orchestrator.ts --strict
```

**Exit Codes**:
- `0`: All checks passed
- `1`: Blocking errors found

## Automation Tools

### Auto-Cleanup Script

**Purpose**: Automatically removes backup files and temporary artifacts.

**Location**: `tools/cleanup/auto-cleanup.ts`

**Removes**:
- Backup files matching patterns
- Temporary editor files
- Empty cache directories

**Running**:
```bash
# Dry run (shows what would be removed)
bun tools/cleanup/auto-cleanup.ts --dry-run

# Actual cleanup with verbose output
bun tools/cleanup/auto-cleanup.ts --verbose

# Silent cleanup
bun tools/cleanup/auto-cleanup.ts
```

**Protected Files**: Files in the PROTECT_LIST won't be removed:
- `.env.backup` (may be template)
- `.gitkeep` (framework required)

## .gitignore Management

### Current Patterns

The `.gitignore` file includes patterns for:
1. **Backup files**: Comprehensive coverage of backup extensions
2. **Browser artifacts**: Playwright and Chromium profiles
3. **Node dependencies**: npm and yarn artifacts
4. **Build output**: Compiled code and TypeScript build info
5. **Environment/Credentials**: `.env` files and credential files
6. **IDE**: VS Code, JetBrains, Vim swap files
7. **OS**: macOS and Windows system files
8. **Logs**: All log files and log directories
9. **Cache**: Various cache directories
10. **Skill output/input**: Tracked at directory level with exceptions for ghost skill

### Adding New Patterns

When adding new patterns:

1. Add to `.gitignore` with a category comment:
```gitignore
# My New Category
*.mypattern
**/.my-cache/
```

2. Update the REQUIRED_PATTERNS in `gitignore-patterns-validator.ts`

3. Run validator to verify:
```bash
bun tools/validation/gitignore-patterns-validator.ts
```

### Pattern Verification

To verify a pattern actually ignores files:
```bash
# Test a pattern
git check-ignore -v test.backup
# Output: .gitignore:31:*.backup	test.backup

# Test multiple files
touch test.backup test.bak test.tmp
git check-ignore -v test.*
```

## Integration with Git Hooks

### Pre-Commit Hook

The `.git/hooks/pre-commit` script runs fast checks before commits. To add extended validators:

```bash
# Call orchestrator in pre-commit script
bun tools/validation/pre-commit-orchestrator.ts

# Check exit code
if [ $? -ne 0 ]; then
  exit 1  # Block commit if errors
fi
```

### Manual Pre-Commit Validation

Before committing, run:
```bash
# Run all validators
bun tools/validation/pre-commit-orchestrator.ts

# Auto-cleanup
bun tools/cleanup/auto-cleanup.ts

# Git commit
git commit -m "message"
```

## Troubleshooting

### Validator Failing When It Shouldn't

**Problem**: Validator reports false positive

**Solution**:
1. Understand why: Read the validator's output and code
2. Check allow lists: See if file should be added to ALLOW_LIST or ALLOWED_HIDDEN
3. Update validator: Modify allow list or exempt specific files
4. Test: Re-run validator to confirm fix

**Example**: Adding legitimate hidden directory
```typescript
// In hidden-directory-validator.ts
const ALLOWED_HIDDEN = new Set([
  // ... existing entries
  '.my-legitimate-dir',  // Add new entry
]);
```

### .gitignore Pattern Not Working

**Problem**: Files that should be ignored are still tracked

**Reasons**:
1. Pattern syntax incorrect
2. File already tracked in git
3. Pattern too specific or too broad

**Solutions**:
```bash
# Check if pattern is valid
git check-ignore -v <file>

# If already tracked, remove from git but keep locally
git rm --cached <file>
git commit -m "Remove cached file"

# Test new pattern
touch test.backup
git check-ignore -v test.backup
rm test.backup
```

### Fixing File Structure Violations

**Problem**: Skill has misplaced directories

**Example Output**:
```
[example-skill] output/ found in scripts/ - should be at skill root
```

**Fix**:
```bash
cd skills/example-skill
mv scripts/output ./output
git add output/
git commit -m "refactor: Move output directory to skill root"
```

## Best Practices

### 1. Run Validators Before Committing

```bash
# Full validation check
bun tools/validation/pre-commit-orchestrator.ts

# If issues, fix them
git add .
git commit -m "fix: Resolve validation issues"
```

### 2. Clean Up Regularly

```bash
# Remove temporary files
bun tools/cleanup/auto-cleanup.ts --verbose

# Commit cleanup
git add -A
git commit -m "cleanup: Remove temporary files"
```

### 3. Add Patterns Proactively

When adding new tool or technology:
1. Create output directory in skill
2. Add patterns to .gitignore immediately
3. Update gitignore-patterns-validator.ts
4. Test pattern works

### 4. Document File Organization

Keep your skill's directory structure consistent:
```
skills/my-skill/
├── SKILL.md          # Skill documentation
├── README.md         # Quick overview
├── scripts/          # Implementation code
├── input/            # Input templates
├── output/           # Generated outputs
├── docs/             # Additional documentation
└── commands/         # Symlinks to commands
```

### 5. Review Hidden Directories

Periodically check for unexpected hidden directories:
```bash
bun tools/validation/hidden-directory-validator.ts

# List all hidden items
find . -name ".*" -not -path "./.git/*" -type d
```

## Exit Codes Summary

| Code | Meaning | Action |
|------|---------|--------|
| 0 | All validations passed | Safe to commit/push |
| 1 | Blocking errors found | Fix issues before committing |
| 2 | Warnings only | Allowed in normal mode, blocked in --strict |

## Related Documentation

- `docs/standards/file-location-standards.md` - File organization standards
- `CONTRIBUTING.md` - Contribution guidelines
- `.gitignore` - Current ignore patterns
- `tools/validation/README.md` - Validator technical details

## Maintenance

### Adding New Validators

1. Create `tools/validation/new-validator.ts`
2. Follow the pattern of existing validators
3. Add to VALIDATORS array in `pre-commit-orchestrator.ts`
4. Test thoroughly
5. Document in this file

### Updating Patterns

When updating patterns:
1. Test before committing
2. Update both .gitignore and validators
3. Run full validation
4. Document changes

---

**Last Updated**: February 2026
**Framework**: Intelligence Adjacent (IA)
