---
name: git-push
description: Commit and push to your private repository
tool: git
agent: base
classification: public
---

# /git-push - Private Repository Commit & Push

**Commit and push changes to your private GitHub repository.**

Configured via environment variables - works with any repository you own.

---

## Prerequisites

Before using this command:

1. ✅ Run setup wizard: `bun tools/git/scripts/setup.ts`
2. ✅ Verify `.env` has `GITHUB_TOKEN` and `GIT_PUSH_REPO_PATH`
3. ✅ Repository must be a valid git repository

See `tools/git/workflows/private-push.md` for complete setup instructions.

---

## Invocation

When you invoke `/git-push`:

1. **Load workflow:** Read `tools/git/workflows/private-push.md`
2. **Execute all 10 steps** in workflow order
3. **Verify completion** using workflow checklist

---

## Quick Reference

**Purpose:** Commit and push local changes to your configured private repository

**Configuration (from `.env`):**
- `GITHUB_TOKEN` - Your GitHub personal access token
- `GIT_PUSH_REPO_PATH` - Path to your private repository
- `GIT_PUSH_REMOTE` - Remote name (default: origin)
- `GIT_PUSH_BRANCH` - Branch name (default: main)

**Safety:**
- Pre-flight repo verification (validates correct repository)
- Security scan for credentials (blocks on detection)
- Pre-sync cleanup (removes temp files)
- Documentation audit (informational)
- Never force push (requires manual intervention)

**Triggers:** "commit", "push", "git push", "save to git", "backup"

---

## Workflow Location

**Full workflow:** `tools/git/workflows/private-push.md`

The workflow contains:
- 10-step execution checklist
- Security scan patterns
- Cleanup procedures
- Error recovery protocols

**Configuration:** `tools/git/workflows/private-push.yaml`

**Scripts:** `tools/git/scripts/push/`
- `index.ts` - Main orchestrator
- `sync-symlinks.ts` - Discovery symlink sync (NEW)
- `cleanup.ts` - Pre-sync cleanup
- `security-scan.ts` - Credential detection
- `audit-documentation.ts` - Doc integrity
- `update-session.ts` - Session tracking

---

---

**Version:** 2.0
**Last Updated:** 2026-01-13
