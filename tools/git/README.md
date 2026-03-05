# Git Tool - Quick Start

> **Type:** Infrastructure tool (not a skill — operational lifecycle, not deliverable-producing phases)

**Generic git operations for your repositories.**

---

## ⚡ Setup (One-Time, Automated)

**Start here:** Run the interactive setup wizard that will configure everything automatically.

```bash
bun tools/git/scripts/setup.ts
```

This will:
- ✅ Verify git is installed
- ✅ Install/verify GitHub CLI (gh)
- ✅ Authenticate with GitHub
- ✅ Generate GitHub personal access token
- ✅ Configure `.env` automatically
- ✅ Validate your repositories
- ✅ Test connectivity

**Prerequisites:**
- Git installed (`git --version`)
- GitHub account
- Push access to your repository

---

## Manual Setup (If Preferred)

If you want to configure manually:

1. **Copy `.env.example` to `.env`:**
   ```bash
   cp ~/.claude/.env.example ~/.claude/.env
   ```

2. **Add your GitHub token and repo paths:**
   ```bash
   # Generate token at: https://github.com/settings/tokens/new
   GITHUB_TOKEN=[insert_key]

   # Path to your private repository
   GIT_PUSH_REPO_PATH=/path/to/your/repo
   GIT_PUSH_REMOTE=origin
   GIT_PUSH_BRANCH=main

   # For /git-public (optional):
   GIT_PUBLIC_REPO_PATH=/path/to/public/repo
   ```

3. **Verify setup:**
   ```bash
   bun tools/git/scripts/setup.ts validate
   ```

---

## Usage

**Commit and push to your private repo:**
```bash
/git-push
```

**Sync to your public repo** (requires triple verification):
```bash
/git-public
```

**Update your IA Framework** (if you cloned it locally):
```bash
/framework-update
```

---

## Command Overview

| Command | Purpose | Friction | Pre-requisite |
|---------|---------|----------|-----------|
| `/git-push` | Commit + push to private | Normal | `GIT_PUSH_REPO_PATH` |
| `/git-public` | Sync to public repo | High | `GIT_PUBLIC_REPO_PATH` |
| `/framework-update` | Update IA Framework | Normal | Framework clone only |

---

## What Gets Committed with /git-push?

**All changes** (`git add -A`), except:
- `debug/` - Cleaned before push
- `sessions/` - Cleaned before push
- `.env` - Never committed (gitignored)
- Files with detected credentials - Blocked by security scan

---

## What Gets Synced with /git-public?

If `.framework-manifest.yaml` exists (framework users):
- Only approved framework files

If no manifest (generic users):
- Default safe patterns: `commands/`, `agents/`, `skills/`, `tools/`, `docs/`
- Excludes: `sessions/`, `.env*`, `debug/`, cache files

---

## Safety Features

- ✅ Pre-flight verification (correct repo/branch)
- ✅ Security scan (blocks credentials)
- ✅ Pre-commit hooks (validation layer)
- ✅ Triple verification for public sync
- ✅ No force push (manual intervention only)
- ✅ Pre-sync cleanup (removes temp files)

---

## Troubleshooting

**"Missing GIT_PUSH_REPO_PATH"**
→ Add to `.env` file and source it

**"Wrong repository!"**
→ Verify `GIT_PUSH_REMOTE` points to correct remote

**"Security scan blocked push"**
→ Credentials detected. Remove them before pushing

**"Pre-commit hook failed"**
→ Fix issues shown or add `--skip-hooks` to override (not recommended)

---

**For complete documentation**, see `tools/git/docs/`

## Operational Guides

| Guide | Description |
|-------|-------------|
| `docs/ops-workflow.md` | Multi-phase workflow overview |
| `docs/ops-preflight.md` | Pre-operation safety checks |
| `docs/ops-cleanup.md` | Pre-commit sanitization |
| `docs/ops-execute.md` | Git operation execution |
| `docs/ops-verify.md` | Post-operation validation |
| `docs/ops-report.md` | Operation summary reporting |

**Version:** 2.1
**Last Updated:** 2026-01-18
