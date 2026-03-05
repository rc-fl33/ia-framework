> **FOR AI AGENTS:** This module commits and pushes changes to the repository.
> Load when: user says "commit", "push", "save to git", "git push", "backup code".

---

# git-push Module

**Tier:** Feature
**Status:** Complete
**Version:** 2.1.0

---

## Pre-flight Checklist (MANDATORY)

**STOP! Before executing this module, you MUST complete this checklist:**

- [ ] I have read this MODULE.md completely
- [ ] I understand this is for commits/pushes
- [ ] I will execute ALL 10 steps in order
- [ ] I will NOT skip security scan or cleanup phases
- [ ] I will verify each step completed before proceeding
- [ ] I will use ERROR RECOVERY if any step fails

**⚠️ VIOLATION: Skipping steps can leak credentials or corrupt repository state.**

---

## USE WHEN

**Invoke this module when:**
- User says "commit", "push", "save to git", "backup"
- User says "git-sync", "sync private", "save work"
- User wants to push to **private** repository
- Other modules need git backup (ghost, framework updates)

**DO NOT use when:**
- User just wants to view git status → Use Bash directly
- No changes to commit → Check status first

**KEY TRIGGER:** "commit", "push", "git-sync", "save"

---

## INVOCATION

**Execute ALL steps below in order (10 steps total).**

---

### Step 1: Pre-Flight Safety Checks (MANDATORY)

**Action:** Verify correct repository and branch BEFORE any operations.

**Checklist:**
- [ ] GITHUB_TOKEN is set in environment
- [ ] GIT_PUSH_REPO_PATH exists
- [ ] Remote is your private repository
- [ ] Branch is `main` (or expected branch)

**Commands:**
```bash
git remote -v
git branch --show-current
```

**Expected:**
- Remote: `origin` pointing to `github.com:YOUR_USERNAME/YOUR_PRIVATE_REPO.git`
- Branch: `main` (or your preferred branch)

**If different:** STOP and ask user to confirm correct repository.

**Note:** This pushes to your configured repository (set via GIT_PUSH_REPO_PATH in .env).

**⚠️ THIS STEP IS NOT OPTIONAL - verify correct repo before pushing.**

---

### Step 1.5: Sync Discovery Symlinks (AUTOMATIC)

**Action:** Ensure ~/.claude/commands/ symlinks are in sync with framework commands.

**Checklist:**
- [ ] Discovery symlinks created for new commands
- [ ] Orphaned symlinks removed
- [ ] All .md commands discoverable by Claude Code

**What gets synced:**
- Creates `~/.claude/commands/*.md` → `commands/*.md` symlinks
- Removes orphaned symlinks for deleted commands
- Ensures command discovery without manual setup script

**Script:** `tools/git/scripts/push/sync-symlinks.ts`

**Why:** New commands created with `/create-skill` need discovery symlinks to be accessible.
Without this step, commands exist in framework but aren't discoverable by Claude Code.

**Automatic:** This step runs automatically and cannot fail the push (non-blocking warnings).

---

### Step 2: Pre-Sync Cleanup (MANDATORY)

**Action:** Clean regenerable session data and stale files.

**Checklist:**
- [ ] debug/ directory cleaned
- [ ] file-history/ directory cleaned
- [ ] shell-snapshots/ directory cleaned
- [ ] stats-cache.json removed
- [ ] Old session-env (>7 days) cleaned

**What gets cleaned:**
- `debug/` - Claude Code runtime debug
- `file-history/` - File change tracking
- `shell-snapshots/` - Command output captures
- `stats-cache.json` - Temporary stats
- `session-env/` entries older than 7 days

**Script:** `scripts/push/cleanup.ts`

**Why:** These directories are regenerated automatically. Committing them wastes space.

---

### Step 2.5: Security File Scan (MANDATORY)

**Action:** Scan for sensitive files by name pattern before staging.

**Checklist:**
- [ ] No files with "token", "secret", "credential" in name
- [ ] No .pem, .key, .p12, .pfx files
- [ ] No files containing API key patterns (Anthropic, GitHub, etc.)

**Sensitive Patterns Detected:**
- twingate, token, secret, credential, password, private
- apikey, api_key, api-key, auth
- .pem, .key, .p12, .pfx files

**Script:** `scripts/push/security-scan.ts`

**If sensitive files found:**
1. HIGH severity (credentials detected) → BLOCKS commit
2. MEDIUM severity (suspicious names) → WARNING, review required

**Recovery:**
- Move secrets to `.env` (gitignored)
- Delete sensitive files
- Use `skipSecurityScan: true` only for false positives

**⚠️ VIOLATION: Committing credentials exposes secrets publicly.**

---

### Step 2.5b: Documentation Audit (RECOMMENDED)

**Action:** Verify documentation integrity before commit.

**Checklist:**
- [ ] No hardcoded counts in CLAUDE.md, README.md
- [ ] Version numbers consistent across docs
- [ ] No stale timestamps

**Files Audited:**
- README.md
- CLAUDE.md
- INSTALL.md
- docs/standards/agent-format-standards.md
- docs/standards/file-location-standards.md

**Script:** `scripts/push/audit-documentation.ts`

**This is informational** - violations are warnings, not blocks.

**If issues found:** Review and fix if appropriate before proceeding.

---

### Step 2.5c: Catalog Drift Audit (RECOMMENDED)

**Action:** Verify skills, agents, and tools are synchronized with catalogs.

**Checklist:**
- [ ] Skills on disk match skills catalog
- [ ] Agents on disk match agents catalog
- [ ] Tools on disk match tool catalog

**What gets checked:**
- Compares `skills/` directories against `docs/catalogs/skills.md`
- Compares `agents/` directories against `docs/catalogs/agents.md`
- Compares `tools/` directories against `docs/catalogs/tool-catalog.md`
- Reports missing-from-catalog and missing-from-disk for each category

**Script:** `scripts/push/audit-catalog-drift.ts`

**This is informational** - drift is reported as warnings, not blocks.

**If drift found:** Review and fix before proceeding:
- Add missing entries to catalog docs
- Or remove unused directories from disk

---

### Step 3: Update Session State (MANDATORY)

**Action:** Capture current session work before committing.

**Checklist:**
- [ ] Today's commits captured
- [ ] Modified files summary captured
- [ ] Session file updated in sessions/

**What gets captured:**
- Git commit messages from today
- Files changed by directory
- Uncommitted changes list
- Session entry appended to session file

**Script:** `scripts/push/update-session.ts`

**If no session file exists:** Creates new one with today's date.

---

### Step 4: Review Changes (MANDATORY)

**Action:** Show what has changed.

**Checklist:**
- [ ] git status --short executed
- [ ] git diff --stat reviewed
- [ ] Changes identified

**Commands:**
```bash
git status --short
git diff --stat
```

**If no changes:** Inform user working tree is clean and EXIT.

**If changes exist:** Proceed to staging.

---

### Step 5: Stage Changes (MANDATORY)

**Action:** Stage all changes for commit.

**Checklist:**
- [ ] git add -A executed (or specific files)
- [ ] Staging verified with git status

**Commands:**
```bash
git add -A
git status --short
```

---

### Step 6: Generate Commit Message (MANDATORY)

**Action:** Analyze staged changes and create descriptive commit message.

**Checklist:**
- [ ] Changes categorized (Docs, Module, Hooks, Foundation, Cleanup)
- [ ] Summary generated from file changes
- [ ] Co-Authored-By tag included

**Commit Message Format:**
```
[Category]: Brief summary

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>
```

**Categories:**
- **Docs:** Documentation updates
- **Module:** Module modifications
- **Hooks:** Hook changes
- **Foundation:** Core framework changes
- **Cleanup:** File deletions/reorganization
- **Fix:** Bug fixes
- **Feature:** New functionality

**If user provided message:** Use their message instead.

---

### Step 7: Commit Changes (MANDATORY)

**Action:** Commit with generated message.

**Checklist:**
- [ ] Pre-commit hooks passed (unless --no-verify)
- [ ] Commit succeeded
- [ ] Commit hash captured

**Commands:**
```bash
git commit -m "[message]

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

**If commit fails:**
- Check pre-commit hook errors
- Fix issues and retry
- Use `noVerify: true` only for false positives

**⚠️ DO NOT use --no-verify to bypass legitimate failures.**

---

### Step 8: Push to GitHub (MANDATORY)

**Action:** Push to remote repository.

**Checklist:**
- [ ] git push origin main executed
- [ ] Push succeeded

**Commands:**
```bash
git push origin main
```

**If push fails:**
- If rejected (remote ahead): STOP
- Inform user to manually pull/merge first
- DO NOT auto-pull, auto-rebase, or force push

**⚠️ NEVER force push without explicit user permission.**

---

### Step 10: Confirm Success (MANDATORY)

**Action:** Report final status.

**Checklist:**
- [ ] git status shows clean
- [ ] git log --oneline -1 shows new commit
- [ ] All steps confirmed

**Report to user:**
```
✅ Pre-flight checks completed
✅ Pre-sync cleanup completed
✅ Security scan completed
✅ Documentation audit completed
✅ Session state updated
✅ Changes staged (X files)
✅ Commit created (hash)
✅ Pushed to GitHub
📝 Commit message: [summary]
```

---

## ERROR RECOVERY

| Error | Recovery Action |
|-------|-----------------|
| Missing GITHUB_TOKEN | Add to .env: `GITHUB_TOKEN=[insert key]` |
| Missing GIT_PUSH_REPO_PATH | Add to .env: `GIT_PUSH_REPO_PATH=/home/user/.claude` |
| Wrong repository | Navigate to correct path, verify with `git remote -v` |
| Security scan failed | Remove secrets from files, move to .env |
| Credential detected | Delete file or use `skipSecurityScan: true` (with caution) |
| Pre-commit hook failed | Fix issues, do NOT blindly use --no-verify |
| Push rejected (behind remote) | Run `git pull --rebase origin main` first |
| Auth failure | Verify GITHUB_TOKEN is valid and not expired |

### Error Recovery Protocol

1. **DO NOT guess** - Read the error message carefully
2. **Check prerequisites** - Did you complete the pre-flight checklist?
3. **Verify inputs** - Are environment variables correct?
4. **Retry with corrections** - Follow guidance from error message
5. **Escalate if needed** - Ask user for clarification

**NEVER:**
- Force push without explicit permission
- Skip security scan for convenience
- Commit after credential detection without fixing

---

## Input Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| message | string | No | auto-generated | Custom commit message |
| files | string[] | No | all changed | Specific files to stage |
| dryRun | boolean | No | false | Preview only, don't commit |
| noVerify | boolean | No | false | Skip pre-commit hooks |
| skipCleanup | boolean | No | false | Skip cleanup phase |
| skipAudit | boolean | No | false | Skip documentation audit |
| skipSecurityScan | boolean | No | false | Skip security scan (dangerous) |

---

## Output

```typescript
interface GitPushResult {
  success: boolean;
  error?: string;
  commit?: string;        // Short hash of commit
  filesChanged?: number;  // Number of files committed
  message?: string;       // Commit message used
}
```

---

## Verification Checklist (MANDATORY)

**Before reporting completion, verify ALL items:**

### Implementation Status
- [ ] Step 1: Pre-flight checks - PASSED
- [ ] Step 2: Cleanup - COMPLETED
- [ ] Step 2.5: Security scan - PASSED (no blocking alerts)
- [ ] Step 2.5b: Documentation audit - REVIEWED
- [ ] Step 2.5c: Catalog drift audit - REVIEWED
- [ ] Step 3: Session state - UPDATED
- [ ] Step 4: Changes reviewed - CONFIRMED
- [ ] Step 5: Changes staged - VERIFIED
- [ ] Step 6: Commit message - GENERATED
- [ ] Step 7: Commit - SUCCEEDED
- [ ] Step 8: Push - SUCCEEDED
- [ ] Step 10: Success - CONFIRMED

### Quality Verification
- [ ] No security alerts were bypassed without justification
- [ ] Commit message accurately describes changes
- [ ] Session file updated with commit info

### Completion Confirmation
- [ ] User informed of success with commit hash
- [ ] Any warnings documented
- [ ] All steps executed in order

**⚠️ If ANY checkbox fails, the workflow is NOT complete.**

---

## Configuration

### Required Environment Variables

```bash
# GitHub authentication
GITHUB_TOKEN=[insert key]

# Path to private repository (optional, defaults to ~/.claude)
GIT_PUSH_REPO_PATH=/home/user/.claude
```

### Optional Environment Variables

```bash
# Git remote (defaults to 'origin')
GIT_PUSH_REMOTE=origin

# Git branch (defaults to 'main')
GIT_PUSH_BRANCH=main
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/push/index.ts` | Main orchestrator - runs all phases |
| `scripts/push/cleanup.ts` | Pre-sync cleanup of regenerable data |
| `scripts/push/security-scan.ts` | Sensitive file detection |
| `scripts/push/audit-documentation.ts` | Documentation integrity checks |
| `scripts/push/update-session.ts` | Session state capture |

---

## Usage Examples

### Basic Commit and Push

```
User: "Commit these changes"

Module executes all 10 steps:
→ Pre-flight checks
→ Cleanup
→ Security scan
→ Documentation audit
→ Session update
→ Review changes
→ Stage
→ Generate message
→ Commit
→ Push

Output: "✅ Pushed 5 files to [private-repo] (abc123)"
```

### Custom Message

```
User: "Push with message: Fix session tracking bug"

Module uses provided message instead of auto-generating.
```

### Dry Run

```
User: "Show what would be committed"

Module executes steps 1-6, shows preview, does NOT commit.
```

---

## Safety Features

1. **Pre-flight verification** - Confirms correct repo before any operations
2. **Security scan** - Blocks commits with detected credentials
3. **Pre-commit hooks** - Additional validation layer
4. **No force push** - Never forces, requires manual intervention
5. **Session tracking** - Logs all commits for audit trail

---

## Related Modules

- **sessions** - Automatic session tracking via hooks

---

**Version:** 2.1.0
**Last Updated:** 2026-01-09
**Status:** Active - STANDARDS compliance
