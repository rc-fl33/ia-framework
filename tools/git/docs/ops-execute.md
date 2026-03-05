# Phase: EXECUTE (Git Operations)
**Purpose:** Perform the actual git operations (add, commit, push/pull)
---

## Gate Question

> "Have all git operations completed successfully?"

**Pass Criteria:**
- [ ] Changes staged correctly
- [ ] Commit created with appropriate message
- [ ] Push/pull completed without conflicts

---

## What Happens

### For Push Operations

```bash
# Stage all changes
git add -A

# Generate commit message (or use provided)
# Commit changes
git commit -m "$(cat <<'EOF'
Commit message here.

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
EOF
)"

# Push to remote
git push origin main
```

### For Pull Operations

```bash
# Fetch latest
git fetch origin

# Rebase on remote
git rebase origin/main
```

### For Public Sync

Additional steps:
- Collect only public-safe files
- Triple verification before push
- Clean orphan files from public repo

---

## Exit Criteria

- [ ] Git operations completed
- [ ] No errors during execution
- [ ] Remote updated (for push) or local updated (for pull)
- [ ] Ready for Phase 4: Verify

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Commit rejected | Check pre-commit hooks, fix and retry |
| Push rejected | Pull first, resolve conflicts |
| Merge conflicts | Present conflicts to user |
| Network timeout | Retry with increased timeout |
