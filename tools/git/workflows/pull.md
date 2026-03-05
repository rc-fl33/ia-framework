# /git-pull Workflow - Detailed Steps

**Goal:** Pull latest changes from private repository with safety checks

---

## STEP 1: Pre-Flight Safety Checks

**Purpose:** Verify we're working with the correct repository and branch

**Checks:**
- GITHUB_TOKEN is set
- Repository path exists and is a git repository
- Remote URL is valid
- Current branch is available

**Output:**
```
   ✓ GITHUB_TOKEN set
   ✓ Repository path exists
   ✓ Remote verified: origin
   ✓ Current branch: main
   ✅ Pre-flight checks passed
```

**If fails:**
- Error message specifies the problem
- User must fix configuration before continuing

---

## STEP 2: Fetch Latest Changes

**Purpose:** Download latest commits from remote without modifying working directory

**Command:**
```bash
git fetch <remote> <branch>
```

**Output:**
```
   Fetching from origin/main...
   ✅ Fetch completed

   Remote is N commits ahead
```

**If fails:**
- Network error or authentication issue
- Check GITHUB_TOKEN is valid
- Verify remote URL is correct

---

## STEP 3: Rebase on Origin

**Purpose:** Apply local changes on top of remote changes (non-destructive)

**Command:**
```bash
git pull --rebase <remote> <branch>
```

**Strategy:**
- Avoids unnecessary merge commits
- Keeps commit history clean
- Preserves all commits

**Output:**
```
   Rebasing 3 local commits on origin/main...

   [main] Commit message 1
   [main] Commit message 2
   [main] Commit message 3

   ✅ Rebase completed successfully
```

**If merge conflicts occur:**
```
   ⚠️  Merge conflict detected in file(s):
   - src/components/App.tsx
   - package.json

   1. Edit files to resolve conflicts
   2. Run: git add <file>
   3. Run: git rebase --continue
```

---

## STEP 4: Verify Merge Result

**Purpose:** Show status of pull operation and any changes

**Output:**
```
   ✅ Pull completed successfully

   Status:
   - 3 commits pulled
   - 5 files changed
   - 12 insertions(+), 3 deletions(-)

   Latest commit: abc1234 "Update configuration"
```

**If conflicts exist:**
```
   ⚠️  Pull completed with conflicts

   Conflicting files:
   - src/components/App.tsx
   - package.json

   Next steps:
   1. Review and resolve conflicts
   2. Stage resolved files: git add <file>
   3. Continue rebase: git rebase --continue
```

---

## STEP 5: Update Session State

**Purpose:** Record pull operation for session tracking

**Updates:**
- Last pull time
- Remote branch status
- Any merge results
- Conflicting files (if any)

**Output:**
```
   Session state updated:
   - Last pull: 2026-01-18 10:30:45
   - Branch: main
   - Status: success
```

---

## STEP 6: Confirm Success

**Purpose:** Show final status and next steps

**Output:**
```
   ════════════════════════════════════════════════════════════════
   ✅ PULL COMPLETE
   ════════════════════════════════════════════════════════════════

   Repository: /path/to/repo
   Remote: origin/main
   Commits pulled: 3
   Files changed: 5

   Latest: abc1234 Update configuration

   ════════════════════════════════════════════════════════════════
```

---

## Merge Conflict Resolution

If conflicts occur during rebase:

1. **Identify conflicting files:**
   ```bash
   git status
   ```

2. **Edit each conflicting file** - Look for `<<<<<<<`, `=======`, `>>>>>>>`

3. **Resolve conflicts** - Keep needed changes, remove markers

4. **Stage resolved files:**
   ```bash
   git add <file>
   git add <file>
   ```

5. **Continue rebase:**
   ```bash
   git rebase --continue
   ```

6. **If you want to abort:**
   ```bash
   git rebase --abort
   ```

---

## Troubleshooting

### "No changes to pull"
- Your local branch is already up to date with remote
- Safe to proceed with other operations

### "Permission denied"
- GITHUB_TOKEN is invalid or expired
- Update token in `.env`

### "Diverged from remote"
- Your local commits are incompatible with remote
- May need to manually rebase or force push (dangerous)
- Contact team lead if this occurs frequently

### "Stale reference"
- Remote branch was deleted or moved
- Update your local tracking: `git fetch --prune`

---

**Version:** 1.0
**Last Updated:** 2026-01-18
**Safety Level:** High (non-destructive operations only)
