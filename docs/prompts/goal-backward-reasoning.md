# Goal-Backward Reasoning

**Planning methodology for implementation work.**
**Adapted from:** GSD must_haves derivation pattern

Plan backward from goals, not forward from tasks.
This creates a closed loop: goals define the plan, and verification checks the same goals.

---

## The Three Derivations

Before writing any implementation plan, derive three things from the stated goal:

### 1. TRUTHS — What must be true when done?

Observable, testable statements about the end state.

**Format:** Plain assertions that can be verified with yes/no.

```
TRUTHS:
- User can log in with email and password
- Failed login attempts return clear error messages
- Session persists across page refreshes
- Unauthorized routes redirect to login
```

**Rules:**
- State outcomes, not actions ("User can X" not "Implement X")
- Every truth must be independently testable
- If you can't test it, it's not specific enough
- Aim for 3-7 truths per goal (fewer = too vague, more = scope creep)

### 2. ARTIFACTS — What must exist for truths to hold?

Concrete files, components, or configurations required.

**Format:** File paths or component names with brief purpose.

```
ARTIFACTS:
- src/app/api/auth/login/route.ts — Login endpoint
- src/app/api/auth/session/route.ts — Session validation endpoint
- src/components/LoginForm.tsx — Login form with validation
- src/middleware.ts — Route protection middleware
- src/lib/auth.ts — Auth utilities (hash, verify, token)
```

**Rules:**
- Every truth must be supported by at least one artifact
- Every artifact must support at least one truth (no orphans)
- Include path, not just name
- If an artifact supports multiple truths, note which ones

### 3. KEY LINKS — What must be wired for artifacts to function?

Connections between artifacts that make the system work as a whole.

**Format:** Source → target with the nature of the connection.

```
KEY LINKS:
- LoginForm submits to /api/auth/login (fetch POST)
- /api/auth/login calls auth.ts verifyPassword()
- /api/auth/login sets httpOnly cookie on success
- middleware.ts checks cookie on every protected route
- middleware.ts redirects to /login when cookie invalid
```

**Rules:**
- Key links are the wiring — imports, API calls, event handlers, config references
- Focus on cross-artifact connections, not internal logic
- Every artifact must have at least one inbound or outbound link
- An unlinked artifact is dead code (review whether it's actually needed)

---

## Applying to Planning

When entering plan mode or creating an implementation plan:

```
1. State the goal clearly (1-2 sentences)
2. Derive TRUTHS (what must be true when done)
3. Derive ARTIFACTS (what must exist)
4. Derive KEY LINKS (what must be wired)
5. THEN write implementation steps that produce the artifacts and links
```

The implementation steps should directly map to artifacts. Every step produces or modifies at least one artifact. Every artifact appears in at least one step.

---

## Applying to Verification

After implementation, verify the same three derivations:

| Derivation | Verification Method |
|-----------|-------------------|
| TRUTHS | Test each assertion (manual check, curl, browser, test suite) |
| ARTIFACTS | Three-level verification: exists → substantive → wired (see `implementation-verification.md`) |
| KEY LINKS | Trace each connection: does source actually call/import/reference target? |

**Closed loop:** If a truth fails verification, trace backward:
- Which artifact supports this truth?
- Is the artifact substantive (not a stub)?
- Are its key links wired correctly?

This traces failures to their root cause instead of guessing.

---

## When to Apply

- **Always:** Engineer agent plan mode (EnterPlanMode)
- **Recommended:** Any multi-step implementation with 3+ new files
- **Recommended:** Complex skill workflows where multiple phases produce artifacts
- **Skip:** Single-file edits, config changes, documentation-only work

---

## Quick Reference

```
GOAL: [1-2 sentence goal statement]

TRUTHS (must be true when done):
1. [testable assertion]
2. [testable assertion]
3. [testable assertion]

ARTIFACTS (must exist):
1. [path] — [purpose] — supports truth [N]
2. [path] — [purpose] — supports truth [N]
3. [path] — [purpose] — supports truth [N]

KEY LINKS (must be wired):
1. [source] → [target] — [connection type]
2. [source] → [target] — [connection type]
3. [source] → [target] — [connection type]
```
