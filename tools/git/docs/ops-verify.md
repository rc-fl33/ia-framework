# Phase: VERIFY (Post-operation Validation)
**Purpose:** Confirm git operations completed successfully
---

## Gate Question

> "Did the git operations complete successfully?"

**Pass Criteria:**
- [ ] Git status shows expected state
- [ ] Remote reflects changes (for push)
- [ ] Local reflects remote (for pull)

---

## What Happens

### Step 1: Check Status

```bash
# Should be clean after push
git status

# Verify last commit
git log -1 --oneline
```

### Step 2: Verify Remote (for Push)

```bash
# Check remote tracking
git log origin/main -1 --oneline

# Confirm push success
# Remote should match local HEAD
```

### Step 3: Verify Local (for Pull)

```bash
# Check for uncommitted changes
git status

# Verify current position
git log -3 --oneline
```

---

## Exit Criteria

- [ ] Repository in expected state
- [ ] No unexpected changes
- [ ] Operation verified successful
- [ ] Ready for Phase 5: Report

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Status not clean | Investigate uncommitted files |
| Remote mismatch | Force push (with confirmation) or pull |
| Missing commits | Check reflog, recover if needed |
