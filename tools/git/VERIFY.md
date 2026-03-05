# Git Tool Verification Checklist

**Use this checklist to verify git operations completed correctly.**

---

## Pre-Execution Checklist (All Commands)

### Environment Setup
- [ ] `.env` file is configured (see `.env.example`)
- [ ] `GITHUB_TOKEN` is set and valid
- [ ] Repository paths are correct and accessible

### Repository Verification
- [ ] Correct working directory (from `GIT_PUSH_REPO_PATH` or `GIT_PUBLIC_REPO_PATH`)
- [ ] Remote verified (`git remote -v`)
- [ ] Branch verified (`git branch --show-current`)
- [ ] Working tree is clean or has changes to commit

---

## /git-push Verification

### Step Completion
- [ ] Pre-flight checks passed (repo path exists, remote is valid)
- [ ] Pre-sync cleanup completed (debug/, file-history/, sessions/, etc.)
- [ ] Security scan passed (no credentials detected)
- [ ] Documentation audit reviewed (informational only)
- [ ] Session state updated
- [ ] Changes staged
- [ ] Commit message generated
- [ ] Commit succeeded (hash captured)
- [ ] Push succeeded

### Post-Push Verification
```bash
# Working tree should be clean
git status

# Last commit should be yours
git log --oneline -1

# Branch should be up to date with remote
git status -sb

# Verify push reached remote
git fetch origin && git rev-parse origin/main
```

---

## /git-public Verification

### Pre-Push Checks
- [ ] Private repo path configured and correct
- [ ] Public repo path configured and correct
- [ ] Triple verification completed manually

### File Collection
- [ ] Manifest used (if `.framework-manifest.yaml` exists)
- [ ] OR default patterns used (if no manifest)
- [ ] Only approved files collected

### Additional Checks
- [ ] No private content synced (sessions/, .env, credentials)
- [ ] Orphans cleaned (if applicable)
- [ ] Security scan passed (no credentials detected)
- [ ] Public remote updated

### Post-Push Verification
```bash
# Switch to public repo and verify
cd $GIT_PUBLIC_REPO_PATH

# Check latest commits
git log --oneline -3

# Verify no sensitive files
git ls-tree -r origin/main --name-only | grep -E "(\.env|sessions/|credentials)"
# Should return nothing

# Compare file counts
git ls-tree -r origin/main --name-only | wc -l
```

---

## Security Verification

### Credential Patterns Blocked
All commands check for and block these patterns:
- `*token*`, `*secret*`, `*credential*`, `*password*`
- `*.pem`, `*.key`, `*.p12`, `*.pfx`
- `.env*` files (except `.env.example`)
- `*.jks`, `*.keystore`, `*.p8`

### Pre-Commit Checks
- [ ] No API keys in staged files
- [ ] No tokens in staged files
- [ ] No passwords in staged files
- [ ] No private keys in staged files
- [ ] `.env` files not in index

---

## Common Issues & Resolution

| Issue | Command | Resolution |
|-------|---------|------------|
| `.env` not found | All | Create `.env` from `.env.example`, add your values |
| `GIT_PUSH_REPO_PATH` missing | `/git-push` | Add to `.env` and source it |
| `GIT_PUBLIC_REPO_PATH` missing | `/git-public` | Add to `.env` and source it |
| Wrong remote | All | Run `git remote -v`, verify repo path |
| Network error | All | Check GITHUB_TOKEN, verify remotes |
| Security scan failed | All | Remove/move credentials, re-run |
| Push rejected | `/git-push` | Pull first: `git pull --rebase origin main` |
| Merge conflicts | Manual git | Resolve conflicts, `git add`, `git rebase --continue` |
| Hook failed | All | Fix reported issues, rerun (don't skip validation) |
| Triple verification failed | `/git-public` | Confirm remote is correct, rerun |

---

## Quality Checks

- [ ] Commit message is descriptive
- [ ] Co-Authored-By tag included
- [ ] No unnecessary files committed
- [ ] Session state updated (if applicable)
- [ ] All configuration variables set in `.env`

---

## Framework Users (Optional)

If using `/framework-update`:
- [ ] Local IA Framework clone exists
- [ ] `GIT_FRAMEWORK_REPO_PATH` configured in `.env`
- [ ] Framework upstream remote can be fetched
- [ ] Backups created before updating

---

**Version:** 2.1
**Last Updated:** 2026-01-18
**Applies to:** All git commands (push, public, pull)
**Generic Status:** ✅ Fully generic for any repositories
