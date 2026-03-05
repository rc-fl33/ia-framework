# Pre-Commit Hooks

**Automated validation suite that runs before every `git commit`.**

All hooks are TypeScript/Bun. Executed by `.git/hooks/pre-commit` (bash orchestrator).

---

## How It Works

The git pre-commit hook (`.git/hooks/pre-commit`) runs 15 checks in sequence. If any check fails, the commit is blocked. Bypass with `git commit --no-verify` (use sparingly).

---

## Active Hooks

### Checks 1-7: Inline Bash Checks

These run directly in the `.git/hooks/pre-commit` bash script:

| Check | What It Does |
|-------|-------------|
| 1. Credential Scan | Detect hardcoded API keys/secrets in staged files |
| 2. Forbidden Files | Block `.env`, credentials, keys from being committed |
| 3. TypeScript Syntax | Parse-check staged `.ts` files |
| 4. Hardcoded Counts | Calls `prevent-hardcoded-counts.ts` |
| 5. File Naming | Calls `tools/validation/validate-file-naming.ts` on staged docs |
| 6. Glob Patterns | Calls `tools/validation/validate-glob-patterns.ts` |
| 7. Path Resolution | Detect hardcoded absolute paths in staged code |

### Checks 8-15: TypeScript Validator Scripts

| Check | Script | Purpose |
|-------|--------|---------|
| 8. Placeholders | `04-validate-placeholders.ts` | Validate `[insert ...]` placeholder format |
| 9. Routing Gates | `validate-routing-gates.ts` | Ensure agent/skill routing gates present |
| 10. Frontmatter | `01-validate-frontmatter.ts` | YAML frontmatter schema validation |
| 11. Cross-References | `02-validate-cross-refs.ts` | CLAUDE.md ↔ skills/ synchronization |
| 12. Path Validation | `03-validate-paths.ts` | File references and symlink integrity (staged files) |
| 13. File Structure | `05-validate-file-structure.ts` | Framework directory structure compliance |
| 13.5. Manifest Sync | `07-validate-manifest-sync.ts` | Auto-fix manifest drift |
| 14. Catalog Sync | `12-validate-catalog-sync.ts` | Auto-fix catalog drift |
| 15. Doc References | `tools/validation/validate-doc-references.ts` | Broken references across all critical docs (full scan) |

### Additional Validators (Not in Pre-Commit Pipeline)

| Script | Purpose |
|--------|---------|
| `00-validate-framework.ts` | Standalone orchestrator for validators 01-03 |
| `08-validate-docs-public.ts` | Validate public doc sync eligibility |
| `09-validate-changelog-severity.ts` | Changelog entry severity validation |
| `10-validate-ghost-approvals.ts` | Ghost blog post approval gates |
| `11-bash-tool-quick-scan.ts` | Quick scan of bash tool usage |
| `validate-hero-prompts.ts` | Hero image prompt validation |
| `validate-registry-methodologies.ts` | Registry methodology compliance |

---

## Key Design Decisions

**Staged vs Full Scan:** Check 12 (`03-validate-paths.ts`) validates references in staged files only. Check 15 (`validate-doc-references.ts`) scans all critical docs regardless of staging. They're complementary — one catches breakage you're introducing, the other catches existing drift.

**Exit Codes:**
- `0` = Passed (allow commit)
- `1` or `2` = Failed (block commit)

---

## Running Manually

```bash
# Run entire pre-commit suite
.git/hooks/pre-commit

# Run individual validators
bun run hooks/pre-commit/01-validate-frontmatter.ts
bun run hooks/pre-commit/03-validate-paths.ts
bun run tools/validation/validate-doc-references.ts
```

---

## Related

- `.git/hooks/pre-commit` - Bash orchestrator that calls all checks
- `tools/validation/` - Standalone validation tools
- `hooks/README.md` - Claude Code hooks (PreToolUse/PostToolUse)
