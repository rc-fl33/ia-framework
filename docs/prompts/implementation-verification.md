# Three-Level Implementation Verification

**Shared verification standard for all implementation work.**
**Adapted from:** GSD verifier pattern (exists → substantive → wired)

After completing implementation, verify every artifact at three levels.
Do NOT mark work complete until all three levels pass for every artifact.

---

## Level 1: EXISTS

Verify the file is at its expected path.

```bash
[ -f "path/to/file" ] && echo "FOUND" || echo "MISSING"
```

**Pass criteria:** File exists at the documented path.
**On failure:** Implementation incomplete — create the missing file.

---

## Level 2: SUBSTANTIVE

Verify the content is real implementation, not a stub or placeholder.

**Scan for stub indicators:**

| Technology | Stub Signals |
|-----------|-------------|
| TypeScript/JS | `// TODO`, `throw new Error('not implemented')`, empty function bodies `{}`, `any` as the only type |
| React/JSX | Single `<div>` with no children, no state/props usage, no event handlers |
| API routes | Returns hardcoded 200 with no request processing, no input validation |
| Config files | Only default/example values, no environment-specific settings |
| Tests | `test.todo()`, `it.skip()`, assertions that always pass (`expect(true).toBe(true)`) |
| Database | Schema only with no queries, connection setup with no operations |
| CSS/Styles | Empty rulesets, only resets with no component styles |

**Verification command pattern:**
```bash
# Check file has substantive content (not just boilerplate)
wc -l path/to/file          # Suspiciously short?
grep -c "TODO\|FIXME\|not implemented\|placeholder" path/to/file  # Stub markers?
```

**Pass criteria:** File contains real implementation logic. No TODO/FIXME markers. No placeholder content.
**On failure:** Replace stubs with actual implementation before proceeding.

---

## Level 3: WIRED

Verify the artifact is connected to the rest of the system — imported AND used.

**Check pattern:**

| What to Verify | How |
|---------------|-----|
| Module is imported | `grep -r "import.*from.*module-name" src/` |
| Export is consumed | `grep -r "module-name" src/ --include="*.ts" --include="*.tsx"` |
| Route is reachable | Check router config or framework routing (e.g., Next.js file-based routing) |
| Component is rendered | `grep -r "<ComponentName" src/` |
| Config is loaded | `grep -r "config-key\|ENV_VAR" src/` |
| API is called | `grep -r "fetch\|axios\|api/endpoint" src/` |
| Middleware is registered | Check app/server entry point for middleware chain |
| Hook is invoked | Check hook registration config or caller |
| Style is applied | `grep -r "className.*style-name" src/` |

**Pass criteria:** Artifact is both imported/referenced AND actively used by at least one consumer.
**On failure:** Wire the artifact into the system. An unwired file is dead code.

---

## Verification Report Format

After running all three levels, produce a summary:

```
VERIFICATION: [artifact-name]
├─ EXISTS:      PASS | path/to/file
├─ SUBSTANTIVE: PASS | [N] lines, no stubs detected
└─ WIRED:       PASS | imported by [consumer], used in [context]
```

Or on failure:

```
VERIFICATION: [artifact-name]
├─ EXISTS:      PASS | path/to/file
├─ SUBSTANTIVE: FAIL | contains TODO on line 42, empty handler on line 67
└─ WIRED:       SKIP | blocked by SUBSTANTIVE failure
```

**Rules:**
- Run levels in order (1 → 2 → 3). If a level fails, skip subsequent levels.
- Report ALL artifacts, not just failures.
- Fix failures before reporting completion.
- Include the verification report in output or completion message.

---

## When to Apply

- **Always:** Engineer agent post-implementation (remediation, hardening, infrastructure)
- **Recommended:** Any agent creating new files as part of a multi-step workflow
- **Skip:** Documentation-only changes, config edits to existing files, single-line fixes
