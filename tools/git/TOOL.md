---
name: git
type: infrastructure
classification: public
description: Git workflow automation - commit, push, and public repository sync
version: 2.1
last_updated: 2026-02-14
env_required: true
env_keys:
  - GITHUB_TOKEN
  - GIT_PUSH_REPO_PATH
  - GIT_PUBLIC_REPO_PATH
commands:
  - /git-push
  - /git-public
---

> **FOR AI AGENTS:** Git workflow automation for private and public repository operations.
> Load when: User says "commit", "push", "sync public", or git-related operations

---

# Git Workflow Tool

**Automated git operations with security scanning, verification, and public/private repository management**

Provides two core workflows: commit/push to private repo and sync to public repo with classification-based filtering.

---

## Classification

**Type:** infrastructure
**Visibility:** public
**Commands:** /git-push, /git-public

---

## Purpose

Automates git operations while enforcing security and quality:

1. **Private push** (/git-push): Commit and push with pre-commit hooks, credential scanning, cleanup
2. **Public sync** (/git-public): Sync classified files to public repository with triple verification

**Why it exists:** Manual git operations skip validation, can leak credentials, and require remembering complex workflows. This tool automates the process with safety guarantees.

**Framework integration:** Skills use /git-push for backups, /git-public for releases

---

## Usage

### /git-push - Commit & Push to Private Repo

```bash
/git-push                              # Auto-generated commit message
/git-push --message "Fix bug"          # Custom message
/git-push --files file1.ts file2.ts    # Specific files only
/git-push --dry-run                    # Preview without committing
```

**10-step workflow:**
1. Pre-flight safety checks (verify correct repo)
2. Pre-sync cleanup (remove regenerable files)
3. Security scan (credential detection)
4. Documentation audit (hardcoded counts, stale timestamps)
5. Session state update (capture work)
6. Review changes
7. Stage changes
8. Generate commit message
9. Commit (with pre-commit hooks)
10. Push to GitHub

**Safety features:**
- Credential scanning (blocks on detection)
- Pre-commit hooks (validation, formatting)
- Session tracking (audit trail)
- Cleanup (removes debug/, file-history/, shell-snapshots/)

### /git-public - Sync to Public Repository

```bash
/git-public                           # Full sync with verification
/git-public --message "Release v1.2"  # Custom message
/git-public --dry-run                 # Preview without pushing
/git-public --skip-orphan-clean       # Skip orphan file cleanup
```

**12-step workflow (HIGH FRICTION by design):**
1. Verify environment
2. **Triple verification** (confirm public repo 3x with pauses)
3. Collect public files (classification-based)
4. Clean orphaned files
5. Transform CLAUDE.md (remove private sections)
6. Filter commands.md catalog (remove private commands)
7. Sync files
8. Security scan (NO OVERRIDE - blocks on credentials)
9. Validate GitHub workflows
10. Review changes
11. Stage & commit
12. Push to public

**Classification system:**
- Reads classification from frontmatter (SKILL.md, TOOL.md)
- Only syncs files marked `classification: public`
- Filters commands, skills, tools based on classification

---

## Configuration

### Environment Variables

```bash
# Required for /git-push
GITHUB_TOKEN=[insert key]                                    # GitHub personal access token
GIT_PUSH_REPO_PATH=~/ia-framework-private   # Path to private repo
GIT_PUSH_REMOTE=origin                                  # Remote name (default: origin)
GIT_PUSH_BRANCH=main                                    # Branch (default: main)

# Required for /git-public
GIT_PUBLIC_REPO_PATH=~/ia-framework          # Path to public repo
GIT_PUBLIC_REMOTE=origin                                # Remote name (default: origin)
GIT_PUBLIC_BRANCH=main                                  # Branch (default: main)
```

**Setup:**
1. Generate GitHub token at https://github.com/settings/tokens (scope: repo, workflow)
2. Add to `.env`
3. Set repository paths
4. Verify: `source .env && echo $GITHUB_TOKEN`

---

## API Reference

### Private Push (`tools/git/scripts/push/index.ts`)

**Purpose:** Commit and push to private repository

**Parameters:**
- `message` (string, optional): Custom commit message
- `files` (string[], optional): Specific files to stage
- `dryRun` (boolean, optional): Preview only
- `noVerify` (boolean, optional): Skip pre-commit hooks (not recommended)
- `skipCleanup` (boolean, optional): Skip cleanup phase
- `skipAudit` (boolean, optional): Skip documentation audit

**Returns:**
```typescript
{
  success: boolean,
  error?: string,
  commit?: string,        // Commit hash
  filesChanged?: number,
  message?: string
}
```

### Public Sync (`tools/git/scripts/public/index.ts`)

**Purpose:** Sync classified files to public repository

**Parameters:**
- `message` (string, optional): Custom commit message
- `dryRun` (boolean, optional): Preview only
- `skipOrphanClean` (boolean, optional): Skip orphan cleanup

**Returns:**
```typescript
{
  success: boolean,
  error?: string,
  commit?: string,
  filesChanged?: number,
  orphansRemoved?: number,
  verified?: boolean      // Triple verification completed
}
```

---

## Architecture

### Private Push Flow

```
User Request (/git-push)
    ↓
tools/git/workflows/private-push.md (10-step workflow)
    ↓
tools/git/scripts/push/index.ts
    ├─→ cleanup.ts (remove regenerable files)
    ├─→ security-scan.ts (credential detection)
    ├─→ audit-documentation.ts (doc integrity)
    ├─→ update-session.ts (session tracking)
    └─→ sync-symlinks.ts (command discovery)
    ↓
Pre-commit hooks (validation, formatting)
    ↓
Push to GitHub (private repo)
```

### Public Sync Flow

```
User Request (/git-public)
    ↓
tools/git/workflows/public-push.md (12-step workflow)
    ↓
tools/git/scripts/public/index.ts
    ├─→ collect-public-files.ts (frontmatter-based classification)
    ├─→ clean-orphans.ts (remove unauthorized files)
    ├─→ transform-claude-md.ts (remove private sections)
    ├─→ filter-commands-catalog.ts (remove private commands)
    └─→ security-scan.ts (credential detection - NO OVERRIDE)
    ↓
Push to GitHub (public repo)
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| **Push (Private)** | |
| `scripts/push/index.ts` | Main orchestrator - runs all phases |
| `scripts/push/cleanup.ts` | Pre-sync cleanup of regenerable data |
| `scripts/push/security-scan.ts` | Credential detection |
| `scripts/push/audit-documentation.ts` | Doc integrity checks |
| `scripts/push/update-session.ts` | Session state capture |
| `scripts/push/sync-symlinks.ts` | Command discovery sync |
| **Public Sync** | |
| `scripts/public/index.ts` | Main orchestrator - 12 steps |
| `scripts/public/collect-public-files.ts` | Classification-based file collection |
| `scripts/public/clean-orphans.ts` | Remove unauthorized files |
| `scripts/public/transform-claude-md.ts` | Transform CLAUDE.md for public |
| `scripts/public/security-scan.ts` | Credential detection (blocking) |

---

## Security Features

### Credential Scanning

**What it detects:**
- Anthropic API keys
- GitHub tokens
- OpenRouter API keys
- OpenAI API keys
- Private key files (.pem, .key)
- Files with "token", "secret", "credential" in name

**Behavior:**
- /git-push: Warning (review required)
- /git-public: **BLOCKS** commit (cannot be overridden)

**Bypass (git-push only):**

The security scan can be skipped on git-push via `--skip-security` (CLI) or `skipSecurityScan: true`
(programmatic). This bypass exists for cases where staged files intentionally contain patterns that
trigger false positives (e.g., test fixtures, example credential formats in documentation).

**When to use:** Only when you have confirmed the flagged content is a false positive and understand
the risk. The bypass is logged in the step output so it is visible in the session record.

**Never use on git-public:** The public sync scanner has no bypass — this is intentional and cannot
be overridden in code.

### Pre-Commit Hooks

**Validations:**
- Credential scan
- TypeScript syntax
- Hardcoded counts detection
- File naming conventions
- Frontmatter schema validation
- Cross-reference validation
- Path validation

### Triple Verification (git-public only)

**Process:**
1. First verification: Confirm public repo
2. 2-second pause
3. Second verification: Confirm again
4. 2-second pause
5. Third verification: Final confirmation

**Why:** Wrong repo selection would expose private code publicly. Triple verification prevents accidents.

---

## Cleanup Targets

**What gets cleaned before commit:**
- `debug/` - Claude Code runtime debug
- `file-history/` - File change tracking
- `shell-snapshots/` - Command output captures
- `stats-cache.json` - Temporary stats
- `session-env/` entries older than 7 days

**Why:** These files are regenerated automatically. Committing them wastes space.

---

## Dependencies

**Runtime:**
- Bun (script execution)
- Git (version control)
- GitHub (remote hosting)

**Node packages:**
- None (uses native git commands via Bash)

---

## Troubleshooting

### Missing GITHUB_TOKEN

**Symptom:** `Error: Missing GITHUB_TOKEN`

**Fix:**
```bash
# Generate token at https://github.com/settings/tokens
# Add to .env
GITHUB_TOKEN=[insert key]

# Source
source .env
```

### Wrong Repository

**Symptom:** Pre-flight checks show unexpected repo

**Fix:**
```bash
# Verify paths in .env
echo $GIT_PUSH_REPO_PATH
echo $GIT_PUBLIC_REPO_PATH

# Update if wrong
# Edit .env and source it
```

### Security Scan Failed (git-push)

**Symptom:** Warning about sensitive files

**Fix:**
- Review the detected files
- Move secrets to .env (gitignored)
- Delete sensitive files
- Can proceed with caution

### Credential Detected (git-public)

**Symptom:** `❌ COMMIT BLOCKED due to credentials`

**Fix:**
- **Cannot be overridden** - this is intentional
- Remove the credential from files
- Move to .env or delete
- Run /git-public again

### Push Rejected (Behind Remote)

**Symptom:** `Push rejected - remote ahead`

**Fix:**
```bash
# Pull first manually
git pull --rebase

# Then push
/git-push
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers from skills or hooks — invoked via `/git-push` and `/git-public` slash commands.

**Tools this tool internally uses:**
- `.framework-manifest.yaml` — reads manifest to determine what to include in `/git-public`
- `tools/validation/` — pre-commit validation runs before commit/push
- `tools/utils/` — path-resolution and env-validator used by git scripts

---

## Related Tools

- **framework-update** (tools/framework-update/): Update from upstream
- **sessions** (sessions/): Session tracking
- **validation** (tools/validation/): Pre-commit validation

---

## Version History

- **2.1** (2026-02-14): Classification system integration, frontmatter-based collection
- **2.0** (2026-01-20): Triple verification, credential scanning, cleanup automation
- **1.0** (2025-12-15): Initial implementation

---

## References

- **Workflows:** tools/git/workflows/
- **Commands:** commands/git-push.md, commands/git-public.md
- **Skills:** N/A (git functionality is tool-only, no skill wrapper)

---

**Framework:** Intelligence Adjacent (IA)
**Maintainer:** Framework Team
