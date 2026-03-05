# Phase: CLEANUP (Pre-commit Sanitization)
**Purpose:** Clean up temporary files and run security scans before commit
---

## Gate Question

> "Is the repository clean and safe to commit?"

**Pass Criteria:**
- [ ] Temporary directories removed
- [ ] Security scan passed
- [ ] No credentials detected

---

## What Happens

### Step 1: Remove Temporary Files

Directories to clean:
- `debug/`
- `sessions/` (sensitive session data)
- `.cache/`
- `node_modules/` (in skill subdirs, if applicable)

### Step 2: Security Scan

**Credential Detection:**
```bash
# Scan for potential secrets
bun run tools/git/scripts/push/security-scan.ts
```

**Blocked Patterns:**
- API keys (AWS, GitHub, etc.)
- Tokens (Bearer, JWT)
- Passwords (in config files)
- Private keys

### Step 3: Documentation Audit

Optional audit for documentation completeness:
```bash
bun run tools/git/scripts/push/audit-documentation.ts
```

---

## Exit Criteria

- [ ] Temporary files cleaned
- [ ] Security scan passed (no credentials)
- [ ] Repository ready for staging
- [ ] Ready for Phase 3: Execute

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Credentials detected | Block commit, show file locations |
| Cleanup fails | Manual intervention required |
| Audit warnings | Informational only, proceed |
