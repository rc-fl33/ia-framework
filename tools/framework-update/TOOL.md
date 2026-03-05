---
name: framework-update
type: utility
classification: public
description: Update IA Framework installation while preserving customizations with preview, backup, and rollback
version: 3.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - /framework-update
  - /framework-update-apply
related_tools:
  - tools/git
  - tools/claude-md-sync
  - tools/sessions
---

# Framework Update Tool

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Framework update mechanism for the Intelligence Adjacent (IA) Framework.

**Why Public:**
- Core framework maintenance functionality
- Works with public GitHub repository (github.com/notchrisgroves/ia-framework)
- No proprietary logic - standard file comparison and backup
- Essential for all framework users

---

## Purpose

Update your IA Framework installation while safely preserving your customizations. Provides a preview-first workflow with automatic backups, conflict detection, and rollback capability.

**Core Capabilities:**
- **Preview updates**: See what's new/changed before applying
- **File-based detection**: Works without git, uses timestamps + checksums
- **Protected files**: Never overwrites `.env`, sessions, custom skills
- **Automatic backups**: Full directory preservation before changes
- **Conflict resolution**: Handles cases where both you and upstream modified files
- **Rollback capability**: Restore from timestamped backups

**Use Cases:**
- **Regular maintenance**: Keep framework current with bug fixes
- **New features**: Get latest skills, agents, and commands
- **Security patches**: Apply framework security updates
- **Framework improvements**: Benefit from upstream enhancements

---

## Usage

### Two-Command Workflow

**Step 1: Preview** (safe, no changes)
```bash
/framework-update
```

Shows:
- What's new (new skills, agents, commands)
- What changed upstream (modified framework files)
- What conflicts exist (files you've modified that upstream also changed)
- What's protected (your `.env`, sessions, custom skills)

**Step 2: Apply** (with confirmation)
```bash
/framework-update-apply
```

Does:
1. Shows the report again (for final confirmation)
2. Asks "Proceed? (yes/no)"
3. If yes: Creates backup → Applies updates → Validates
4. If no: Exits cleanly (no changes made)

### Example Session

```bash
# Step 1: Preview what's available
/framework-update

# Output:
# 📋 Checking for framework updates...
#
# Step 1: Fetching latest framework...
# ✓ Latest framework fetched
#
# Step 2: Comparing your files with upstream...
#
# ═══════════════════════════════════════════════════════════════════
# FRAMEWORK UPDATE REPORT
# ───────────────────────────────────────────────────────────────────
# Current: 4f8b923 → Upstream: 33e937e
#
# NEW FILES (12):
#   skills/pentest/prompts/thick-client/crypto-analysis/
#   tools/api/context7/TOOL.md
#   ...
#
# MODIFIED UPSTREAM (5):
#   tools/git/client.ts
#   hooks/file-guardian.ts
#   ...
#
# CONFLICTS (2):
#   settings.json (you modified, upstream also modified)
#   .framework-manifest.yaml (you modified, upstream also modified)
#
# PROTECTED (not touched):
#   .env
#   sessions/
#   private/
#   ...
#
# ═══════════════════════════════════════════════════════════════════
# NEXT STEP:
# To apply these updates, run: /framework-update-apply
# ═══════════════════════════════════════════════════════════════════

# Step 2: Apply the updates
/framework-update-apply

# Output:
# ⚙️ Preparing to apply framework updates...
# [Shows same report again]
#
# Proceed with applying updates? (yes/no): yes
#
# Step 3: Creating backup...
# ✓ Backup created at .framework-backup/2026-02-14-1530
#
# Step 4: Applying updates...
# ✓ Applied 12 new files
# ✓ Updated 5 modified files
# ⚠️  Conflicts handled: 2 files
#
# ✅ Framework updated successfully!
```

---

## Configuration

### Environment Variables

**Optional:**
```bash
IA_FRAMEWORK_ROOT=/path/to/framework  # Override framework directory detection
```

Default: Auto-detected from script location (`../../../` from tools/framework-update)

### Protected Patterns

These are **NEVER** overwritten during updates:

```
.env                    # Credentials
.env.*                  # Environment files
sessions/               # Session history
plans/                  # Planning documents
output/                 # Skill outputs
input/                  # User inputs
.framework-backup/      # Previous backups
private/                # Private documentation
skills/*/input/         # Skill-specific inputs
skills/*/output/        # Skill-specific outputs
```

**Custom skills**: If you add new skills to `skills/`, they remain untouched

**Custom agents**: If you add new agents to `agents/`, they remain untouched

---

## API Reference

### Commands

#### `/framework-update`

**Purpose:** Preview available updates without making changes

**Safety:** 100% safe - no file modifications

**Output:**
- Report showing new/modified/conflicted files
- Instructions for applying updates

**Exit Codes:**
- `0` - Success (report generated)
- `1` - Error (network, file system, etc.)

---

#### `/framework-update-apply`

**Purpose:** Apply updates after previewing

**Safety:** Creates automatic backup before any changes

**Interactive:** Asks for confirmation before applying

**Workflow:**
1. Fetch upstream (fresh copy)
2. Compare with local files
3. Show report (again)
4. Ask: "Proceed? (yes/no)"
5. If yes: Backup → Apply → Validate
6. If no: Exit (no changes)

**Exit Codes:**
- `0` - Success (updates applied)
- `1` - Error or user declined

---

### Programmatic API

**Preview updates:**
```typescript
import { compareFiles, generateComparisonReport } from '@/tools/framework-update/scripts/compare-files';
import { fetchUpstreamRepo } from '@/tools/framework-update/scripts/fetch-upstream';

const frameworkDir = '/home/user/ia-framework';
const stagingDir = `${frameworkDir}/.framework-staging`;

// Fetch upstream
const fetchResult = await fetchUpstreamRepo(frameworkDir, 'https://github.com/notchrisgroves/ia-framework.git');

// Compare files
const comparison = await compareFiles(stagingDir, frameworkDir);

// Generate report
const report = generateComparisonReport(comparison, 'local-sha', 'upstream-sha');
console.log(report);
```

**Apply updates:**
```typescript
import { applyUpdates, createBackup } from '@/tools/framework-update/scripts/apply-updates';

// Create backup first
const backupPath = await createBackup(frameworkDir);
console.log(`Backup created: ${backupPath}`);

// Apply updates
const result = await applyUpdates(stagingDir, frameworkDir, comparison);

if (result.success) {
  console.log(`✅ Updated: ${result.updated.length} files`);
} else {
  console.error(`❌ Error: ${result.error}`);
  // Rollback from backup if needed
}
```

---

## Architecture

### Update Flow

```
/framework-update (preview)
   ↓
1. Fetch upstream repo → .framework-staging/
   ↓
2. Compare staging with local
   ├─ New files (in staging, not in local)
   ├─ Modified (in staging, different from local)
   ├─ Conflicts (both changed since last update)
   └─ Protected (ignored by pattern matching)
   ↓
3. Generate report
   ↓
4. Show report + exit (no changes made)
```

```
/framework-update-apply
   ↓
1. Fetch upstream repo (fresh copy)
   ↓
2. Compare staging with local
   ↓
3. Show report (again for confirmation)
   ↓
4. Ask "Proceed? (yes/no)"
   ├─ NO → Exit (no changes)
   └─ YES → Continue
       ↓
5. Create backup → .framework-backup/[timestamp]/
   ↓
6. Apply updates
   ├─ Copy new files
   ├─ Update modified files
   ├─ Handle conflicts (ask per file)
   └─ Skip protected files
   ↓
7. Validate (check file exists, not corrupted)
   ↓
8. Cleanup staging directory
   ↓
9. Update .framework-manifest.yaml (track version)
   ↓
10. Success ✅
```

### Change Detection

**File-based detection** (not git-dependent):

```typescript
function isFileModified(stagingPath, localPath): boolean {
  // 1. Check if file exists locally
  if (!fileExists(localPath)) return false;

  // 2. Compare checksums (SHA-256)
  const stagingHash = await hashFile(stagingPath);
  const localHash = await hashFile(localPath);

  // 3. Different hash = modified
  return stagingHash !== localHash;
}
```

**Conflict detection:**
```typescript
function hasConflict(file, lastUpdate): boolean {
  // Both changed since last update:
  // - User modified file locally
  // - Upstream also modified file
  return file.modifiedLocally && file.modifiedUpstream;
}
```

### Backup Strategy

```
.framework-backup/
├── 2026-02-14-1530/       # Timestamped backup
│   ├── skills/
│   ├── agents/
│   ├── tools/
│   ├── hooks/
│   ├── docs/
│   ├── CLAUDE.md
│   └── ... (full snapshot)
├── 2026-02-10-0945/       # Previous backup
└── ...
```

**Retention:** Manual cleanup (no automatic deletion)

**Restore:**
```bash
cp -r .framework-backup/2026-02-14-1530/* .
```

---

## Scripts

### Commands (User-Facing)

**Preview updates:**
```bash
/framework-update
```

**Apply updates:**
```bash
/framework-update-apply
```

### Internal Scripts

**Preview implementation:**
```bash
bun tools/framework-update/scripts/framework-update-preview.ts
```

**Apply implementation:**
```bash
bun tools/framework-update/scripts/framework-update-apply.ts
```

**Fetch upstream:**
```bash
bun tools/framework-update/scripts/fetch-upstream.ts
```

**Compare files:**
```bash
bun tools/framework-update/scripts/compare-files.ts
```

**Apply updates:**
```bash
bun tools/framework-update/scripts/apply-updates.ts
```

---

## Dependencies

### Runtime

**External:**
- Bun runtime
- git (for fetching upstream)

**Internal:**
- `tools/framework-update/scripts/utils/file-operations.ts` - File I/O
- `tools/framework-update/scripts/utils/file-detection.ts` - Version info
- `tools/framework-update/scripts/utils/protected-patterns.ts` - Pattern matching
- `tools/framework-update/scripts/utils/git-operations.ts` - Git helpers

### Framework Integration

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers — invoked via `/framework-update` and `/framework-update-apply` slash commands. Users and CI pipelines call this directly.

**Tools this tool depends on (called internally):**
- `tools/claude-md-sync/` — called to merge CLAUDE.md sections during update
- `tools/cleanup/` — optionally called to remove stale files after update
- `tools/sessions/` — may archive sessions before applying updates

**File Structure:**
```
tools/framework-update/
├── scripts/
│   ├── framework-update-preview.ts    # Preview command
│   ├── framework-update-apply.ts      # Apply command
│   ├── fetch-upstream.ts              # Upstream fetching
│   ├── compare-files.ts               # File comparison
│   ├── apply-updates.ts               # Update application
│   └── utils/
│       ├── file-operations.ts         # File I/O utilities
│       ├── file-detection.ts          # Version detection
│       ├── protected-patterns.ts      # Protection rules
│       └── git-operations.ts          # Git helpers
├── commands/
│   ├── framework-update.md            # /framework-update docs
│   └── framework-update-apply.md      # /framework-update-apply docs
├── README.md                          # User documentation
├── STATUS.md                          # Implementation status
├── VERIFY.md                          # Testing checklist
└── TOOL.md                            # This file
```

---

## Troubleshooting

### "Failed to fetch upstream repository"

**Cause:** Network issues, invalid repo URL, or git not installed

**Fix:**
```bash
# Check internet connection
ping github.com

# Verify git is installed
git --version

# Manual fetch to debug
git clone --depth 1 https://github.com/notchrisgroves/ia-framework.git /tmp/test-fetch
```

### "Non-interactive mode: aborting"

**Cause:** Running `/framework-update-apply` in non-TTY environment (CI/CD, scripts)

**Fix:**
```bash
# Option 1: Run interactively (recommended for manual setup)
# Run in a real terminal with TTY

# Option 2: Use FORCE_APPLY for automated environments
FORCE_APPLY=1 bun tools/framework-update/scripts/framework-update-apply.ts
```

### Backup Directory Full

**Cause:** Multiple backups accumulating in `.framework-backup/`

**Fix:**
```bash
# List backups sorted by age
ls -lt .framework-backup/

# Remove old backups (keep recent 3)
cd .framework-backup
ls -t | tail -n +4 | xargs rm -rf
```

### Conflict Resolution Unclear

**Cause:** Both you and upstream modified the same file

**Fix:**
```bash
# View both versions
diff .framework-staging/path/to/file path/to/file

# Manual merge if needed
# 1. Let update overwrite (take upstream)
# 2. Keep your version (skip update for that file)
# 3. Merge manually after update (restore backup, cherry-pick changes)
```

### Protected File Got Updated

**Cause:** Bug in protected patterns or manual override

**Fix:**
```bash
# Restore from backup
cp .framework-backup/[timestamp]/.env .env
cp .framework-backup/[timestamp]/sessions sessions -r

# Verify protected patterns
cat tools/framework-update/scripts/utils/protected-patterns.ts
```

### Update Failed Mid-Way

**Cause:** Disk space, permissions, or unexpected error

**Fix:**
```bash
# Rollback from automatic backup
cp -r .framework-backup/[latest-timestamp]/* .

# Check disk space
df -h

# Check permissions
ls -la . | head -20

# Retry update after fixing underlying issue
```

---

## Related Tools

- **tools/git** - Git workflow automation (commit/push after updates)
- **tools/claude-md-sync** - CLAUDE.md synchronization
- **tools/sessions** - Session management
- **tools/cleanup** - Clean up staging/backup directories

---

## Version History

### 3.0.0 (2026-02-06)
- ✅ Refactored to two-command workflow (preview + apply)
- ✅ Replaced git-based detection with file-based detection
- ✅ Added routing gate to SKILL.md for proper agent delegation
- ✅ Simplified documentation (README, SKILL.md, command files)
- ✅ Eliminated flags in favor of explicit separate commands
- ✅ Natural workflow: preview → confirm → apply

### 2.0.0 (2026-02-05)
- Complex flag-based approach (`--check`, `--apply`, `--force`)
- Git-optional but not ideal workflow

### 1.0.0 (2026-01-26)
- Initial implementation

---

## References

- **Upstream Repository:** https://github.com/notchrisgroves/ia-framework
- **Framework README:** `tools/framework-update/README.md`
- **Implementation Status:** `tools/framework-update/STATUS.md`
- **Testing Checklist:** `tools/framework-update/VERIFY.md`
- **Command Docs:** `tools/framework-update/commands/*.md`
