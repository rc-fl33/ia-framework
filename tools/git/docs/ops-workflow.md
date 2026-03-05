# Git Operations Workflow - Multi-Prompt Chain

**5 phases for safe git operations. Each phase MUST complete before the next.**

**Philosophy:** Simple prompt chaining with explicit checkpoints. Safety-first approach.

---

## Phase Overview

```
PREFLIGHT → CLEANUP → EXECUTE → VERIFY → REPORT
```

| Phase | Gate | Output |
|-------|------|--------|
| 1. PREFLIGHT | Status checked, conflicts identified | Pre-operation state |
| 2. CLEANUP | Working tree clean, ready for operation | Clean state |
| 3. EXECUTE | Git operation completed successfully | Operation result |
| 4. VERIFY | Changes verified, no errors | Verification passed |
| 5. REPORT | User informed of results | Summary provided |

---

## Phase Files

| Phase | File | Gate |
|-------|------|------|
| 1 | `01-preflight.md` | Repository state assessed |
| 2 | `02-cleanup.md` | Working tree clean |
| 3 | `03-execute.md` | Git operation complete |
| 4 | `04-verify.md` | Changes verified |
| 5 | `05-report.md` | Summary provided |

---

## Critical Rules

1. **NEVER skip phases** - Execute in order 1→2→3→4→5
2. **Safety first** - Check state before operations
3. **ALWAYS show checkpoint output** - User must see results
4. **Each phase is self-contained** - Load prompt, execute, verify gate, show checkpoint

---

**Framework:** Intelligence Adjacent v1.0.0
