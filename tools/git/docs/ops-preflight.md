# Phase: PREFLIGHT (Pre-operation Checks)
**Purpose:** Verify repository state and authorization before any git operations
---

## Gate Question

> "Is the repository ready for the requested operation?"

**Pass Criteria:**
- [ ] Repository path exists and is a git repository
- [ ] Remote is configured and accessible
- [ ] Branch is correct for operation
- [ ] No blocking conflicts exist

---

## What Happens

### Step 1: Verify Repository

```bash
# Check repository exists
cd $GIT_PUSH_REPO_PATH && git rev-parse --git-dir

# Verify remote
git remote -v

# Check current branch
git branch --show-current
```

### Step 2: Check Status

```bash
# Check for uncommitted changes
git status --porcelain

# Check for unpushed commits
git log origin/main..HEAD --oneline
```

### Step 3: Validate Configuration

- Verify `GIT_PUSH_REPO_PATH` is set
- Verify `GIT_PUSH_REMOTE` is accessible
- Verify `GIT_PUSH_BRANCH` matches current branch

---

## Exit Criteria

- [ ] Repository verified
- [ ] Remote accessible
- [ ] Branch correct
- [ ] No blocking issues
- [ ] Ready for Phase 2: Execute

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Not a git repository | Inform user, verify path |
| Remote unreachable | Check network, verify token |
| Wrong branch | Warn user, ask to proceed |
| Uncommitted changes | Proceed to commit them |
