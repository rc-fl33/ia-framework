# Phase: REPORT (Operation Summary)
**Purpose:** Report operation results to user
---

## Gate Question

> "Has the user been informed of the operation results?"

**Pass Criteria:**
- [ ] Success/failure communicated
- [ ] Commit details provided
- [ ] Next steps clear

---

## What Happens

### Step 1: Summarize Results

**For Successful Push:**
```markdown
## Git Push Complete

**Repository:** [repo name]
**Branch:** main
**Commit:** [short hash] - [message]
**Files changed:** [count]

Changes have been pushed to origin/main.
```

**For Successful Pull:**
```markdown
## Git Pull Complete

**Repository:** [repo name]
**Branch:** main
**New commits:** [count]
**Updated to:** [short hash]

Local repository is up to date with origin/main.
```

### Step 2: Report Issues

**If issues occurred:**
```markdown
## Git Operation: Issues Detected

**Status:** Completed with warnings

### Warnings:
- [Warning 1]
- [Warning 2]

### Action Required:
- [Action item]
```

---

## Exit Criteria

- [ ] User informed of results
- [ ] Commit hash/details provided
- [ ] Any warnings communicated
- [ ] Workflow complete

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Operation failed | Provide detailed error message and recovery steps |
| Partial success | Report what succeeded and what needs attention |
