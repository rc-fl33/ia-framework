---
name: cleanup
type: utility
classification: public
description: Automated cleanup of backup files, OS artifacts, editor temporaries, and empty cache directories with dry-run and protection
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/cleanup/auto-cleanup.ts
  - bun tools/cleanup/auto-cleanup.ts --dry-run
  - bun tools/cleanup/auto-cleanup.ts --verbose
related_tools:
  - tools/sessions
  - tools/framework-update
---

# Framework Cleanup Tool

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Automated cleanup utility for framework maintenance.

**Why Public:**
- Standard file cleanup patterns (backups, OS files, editor temps)
- No proprietary logic - common cleanup operations
- Useful for all framework users
- Safe defaults with protection list

---

## Purpose

Automated cleanup of backup files, OS artifacts, editor temporaries, and empty cache directories. Provides dry-run mode, verbose reporting, and protection for intentional files.

**Core Capabilities:**
- **Backup cleanup**: Remove .backup, .bak, .tmp, *~ files
- **OS artifacts**: Clean .DS_Store (macOS), Thumbs.db (Windows)
- **Editor temporaries**: Remove .swp, .swo (Vim), other editor files
- **Cache directories**: Clean empty cache/tmp directories
- **Dry-run mode**: Preview without deleting
- **Protection list**: Never delete important files (.env.backup, .gitkeep)

**Use Cases:**
- **Pre-commit cleanup**: Remove stray files before commits
- **Maintenance**: Regular cleanup of accumulated artifacts
- **Repository hygiene**: Keep framework directory clean
- **Debugging**: Find and remove temporary files

---

## Usage

### Basic Cleanup

**Remove backup and temporary files:**
```bash
bun tools/cleanup/auto-cleanup.ts

# Output:
# 🧹 Auto-cleanup started...
#
# 📊 Cleanup Report:
#   Files removed: 12
#   Directories removed: 2
#   Failed: 0
#   Protected/Skipped: 3
#
# ✅ Cleaned 14 item(s)
```

### Dry-Run Mode

**Preview what would be deleted (no changes):**
```bash
bun tools/cleanup/auto-cleanup.ts --dry-run

# Output:
# [DRY RUN MODE] No files will be deleted
#
#   → [DRY RUN] Would remove: hooks/file-guardian.ts.backup
#   → [DRY RUN] Would remove: .DS_Store
#   → [DRY RUN] Would remove: sessions/.cache/
#
# 📊 Cleanup Report:
#   Files removed: 12 (would be removed)
#   Directories removed: 2 (would be removed)
#   Protected/Skipped: 3
```

### Verbose Mode

**See detailed file-by-file output:**
```bash
bun tools/cleanup/auto-cleanup.ts --verbose

# Output:
#   ✓ Removed: hooks/file-guardian.ts.backup
#   ✓ Removed: .DS_Store
#   ✓ Removed: tools/notmint/scripts/.swp
#   ⊘ .env.backup (protected)
#   ⊘ docs/.gitkeep (protected)
#   ✓ Removed: sessions/.cache/
#
# 📊 Cleanup Report:
#   Files removed: 8
#   Directories removed: 1
#   Protected/Skipped: 2
#
#   Removed files:
#     - hooks/file-guardian.ts.backup
#     - .DS_Store
#     - tools/notmint/scripts/.swp
#     ...
#
#   Protected/skipped:
#     - .env.backup
#     - docs/.gitkeep
```

### Combined Flags

```bash
bun tools/cleanup/auto-cleanup.ts --dry-run --verbose
# Preview with detailed output
```

---

## Configuration

### Cleanup Patterns

**Backup files:**
```
**/*.backup
**/*.backup-*
**/*~
**/*.bak
**/*.tmp
```

**OS artifacts:**
```
**/.DS_Store      # macOS Finder metadata
**/Thumbs.db      # Windows thumbnail cache
```

**Editor temporaries:**
```
**/*.swp          # Vim swap files
**/*.swo          # Vim swap files (overflow)
```

**Cache directories (empty only):**
```
**/.cache
**/cache
**/tmp
**/.tmp
**/__pycache__
**/.eslintcache
```

### Protection List

**Files never deleted (even if matching patterns):**
```
.env.backup       # May be intentionally tracked as template
.gitkeep          # Framework-required empty directory marker
```

**Directories never traversed:**
```
.git/             # Git internals (always protected)
```

---

## API Reference

### Command Line

#### `auto-cleanup.ts [--dry-run] [--verbose]`

Run cleanup with optional flags.

**Flags:**
- `--dry-run` - Preview mode (no deletions)
- `--verbose` - Detailed file-by-file output

**Exit Codes:**
- `0` - Success (or no cleanup needed)
- `1` - Failures occurred during cleanup

---

### Programmatic API

**Run cleanup from code:**
```typescript
import { cleanupFiles } from '@/tools/cleanup/auto-cleanup';

const stats = await cleanupFiles({
  dryRun: false,
  verbose: true
});

console.log(`Cleaned ${stats.filesRemoved.length} files`);
console.log(`Failed ${stats.failed.length} operations`);
```

**Find matching files:**
```typescript
import { findMatchingFiles } from '@/tools/cleanup/auto-cleanup';

const backups = await findMatchingFiles('**/*.backup');
console.log(`Found ${backups.length} backup files`);
```

**Check if file is protected:**
```typescript
import { isProtected } from '@/tools/cleanup/auto-cleanup';

if (isProtected('.env.backup')) {
  console.log('File is protected from cleanup');
}
```

---

## Architecture

### Cleanup Flow

```
Parse command line arguments (--dry-run, --verbose)
   ↓
For each cleanup pattern:
   ↓
   Find matching files (Glob scan)
      ├─ Skip .git/ directory
      ├─ Skip protected files (.env.backup, .gitkeep)
      └─ Collect matches
   ↓
   For each match:
      ├─ If dry-run → Log "would remove"
      ├─ If real mode → fs.unlinkSync()
      └─ Track stats (removed, failed, skipped)
   ↓
For each cache directory pattern:
   ↓
   Find matching directories (Glob scan)
      ├─ Check if empty (fs.readdirSync)
      ├─ Only remove if length === 0
      └─ Skip .git/ and protected dirs
   ↓
Print cleanup report
   ├─ Files removed
   ├─ Directories removed
   ├─ Failed operations
   └─ Protected/skipped items
```

### Protection Logic

```typescript
function isProtected(filePath: string): boolean {
  return PROTECT_LIST.some(pattern => filePath.includes(pattern));
}

// Examples:
isProtected('.env.backup')         // true (in PROTECT_LIST)
isProtected('hooks/.env.backup')   // true (includes protected pattern)
isProtected('docs/.gitkeep')       // true (in PROTECT_LIST)
isProtected('random.backup')       // false (not protected)
```

### Empty Directory Check

**Only removes if truly empty:**
```typescript
const contents = fs.readdirSync(dirPath);
if (contents.length === 0) {
  fs.rmdirSync(dirPath);
} else {
  // Skip - directory has contents
}
```

---

## Scripts

### Pre-Commit Hook Integration

**Run cleanup before commits (non-blocking):**
```bash
#!/bin/bash
# In .git/hooks/pre-commit

# Cleanup with warning (non-blocking)
bun tools/cleanup/auto-cleanup.ts || true

# If cleanup found issues, warn but allow commit
if [ $? -ne 0 ]; then
  echo "⚠️ Warning: Cleanup had errors (continuing anyway)"
fi
```

### Scheduled Cleanup

**Cron job for daily cleanup:**
```bash
# In crontab -e
0 2 * * * cd /path/to/framework && bun tools/cleanup/auto-cleanup.ts >> /var/log/framework-cleanup.log 2>&1
```

### Safe Cleanup Workflow

```bash
#!/bin/bash
# Safe cleanup with verification

# 1. Dry-run first
echo "=== DRY RUN ==="
bun tools/cleanup/auto-cleanup.ts --dry-run --verbose

# 2. Review output

# 3. Ask for confirmation
read -p "Proceed with actual cleanup? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # 4. Run actual cleanup
  bun tools/cleanup/auto-cleanup.ts --verbose
fi
```

---

## Dependencies

### Runtime

**External:**
- Bun built-ins (`fs`, `path`, `Glob`)

**Internal:** None

### Framework Integration

**Called By:**
- Pre-commit hook (warning mode, non-blocking)
- `/framework-update` (optional cleanup after update)

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Hooks:**
- `hooks/pre-commit/` — invokes auto-cleanup.ts in non-blocking warning mode before commits

**Tools:**
- `tools/framework-update/` — optionally runs cleanup after update to remove stale files

No direct TypeScript importers — invoked via CLI only.

**File Structure:**
```
tools/cleanup/
├── auto-cleanup.ts    # Main cleanup script
└── TOOL.md            # This file
```

---

## Troubleshooting

### "Failed to remove: [file]"

**Cause:** File is open, locked, or permission denied

**Fix:**
```bash
# Check if file is open
lsof | grep [filename]

# Close application using the file

# Check permissions
ls -la [file]

# Fix permissions if needed
chmod 644 [file]

# Retry cleanup
bun tools/cleanup/auto-cleanup.ts
```

### Protected file was deleted

**Cause:** File not in protection list

**Fix:**
```bash
# Add to PROTECT_LIST in auto-cleanup.ts
const PROTECT_LIST = [
  '.env.backup',
  '.gitkeep',
  'your-file-pattern',  // Add here
];

# Restore from git if tracked
git checkout -- [file]

# Or restore from backup if available
```

### Cleanup removes too many files

**Cause:** Overly broad cleanup patterns

**Prevention:**
```bash
# Always use dry-run first
bun tools/cleanup/auto-cleanup.ts --dry-run --verbose

# Review what would be deleted

# Only proceed if safe
```

### Empty directories not removed

**Cause:** Directory contains hidden files (.gitignore, etc.)

**Debug:**
```bash
# Check directory contents including hidden
ls -la sessions/.cache/

# If has .gitignore or .gitkeep, directory won't be removed
# This is expected behavior (empty = truly 0 files)
```

### Cleanup doesn't find files

**Cause:** Glob pattern mismatch or files in .git directory

**Debug:**
```bash
# Test pattern manually
find . -name "*.backup" -not -path "./.git/*"

# Check if files are in .git/ (intentionally skipped)
find .git -name "*.backup"
```

### "Fatal error" on run

**Cause:** Filesystem permission issues or corrupted files

**Fix:**
```bash
# Check filesystem health
df -h
du -sh .

# Check for permission issues
find . -type f ! -readable

# Run with verbose to see where it fails
bun tools/cleanup/auto-cleanup.ts --verbose
```

---

## Related Tools

- **tools/sessions** - Session cleanup (removes old sessions)
- **tools/framework-update** - Framework updates (may call cleanup after update)
- **tools/git** - Git operations (cleanup before commits)

---

## Version History

### 1.0.0 (2026-01-28)
- ✅ Automated cleanup of backup files
- ✅ OS artifact removal (.DS_Store, Thumbs.db)
- ✅ Editor temporary file cleanup (.swp, .swo)
- ✅ Empty cache directory removal
- ✅ Dry-run mode
- ✅ Verbose mode
- ✅ Protection list for important files
- ✅ Detailed cleanup report
- ✅ Safe defaults (no .git/, protected files)

---

## References

- **Glob Patterns:** https://www.gnu.org/software/bash/manual/html_node/Pattern-Matching.html
- **Framework Cleanup Strategy:** `hooks/pre-commit` integration
- **Safe Defaults:** Protection patterns in source code
