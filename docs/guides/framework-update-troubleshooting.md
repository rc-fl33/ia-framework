---
title: Framework Update System - Troubleshooting & API Reference
description: Comprehensive guide for troubleshooting, API reference, and advanced usage
status: complete
last_updated: 2026-02-04
---

# Framework Update System - Troubleshooting & API Reference

Complete reference guide for troubleshooting, advanced usage, and API documentation.

---

## Troubleshooting Guide

### General Issues

#### Q: Update hangs or takes very long
**Symptoms:** `claude /framework-update` appears frozen, no progress for > 1 minute

**Causes:**
- Network issue (fetching from GitHub)
- Large CLAUDE.md file (> 10 MB)
- Disk I/O bottleneck
- Corrupted backup directory

**Solutions:**
```bash
# Check network connectivity
ping github.com

# Monitor disk usage
df -h ~/.claude/

# Check for stuck bun processes
ps aux | grep bun
# Kill if necessary: pkill -f "bun.*framework-update"

# Clean old backups (if > 1 GB total)
du -sh ~/.framework-backup/
# Archive old backups: tar -czf backups.tar.gz ~/.framework-backup/

# Retry update
claude /framework-update
```

#### Q: Update fails with "permission denied"
**Symptoms:** `[ERROR] Permission denied` when copying files

**Causes:**
- ~/.claude directory not writable
- File already open in editor
- SELinux/AppArmor restrictions

**Solutions:**
```bash
# Check permissions
ls -la ~/.claude/
# Should show: drwxr-xr-x or drwxrwxr-x

# Fix permissions
chmod 755 ~/.claude/
chmod 755 ~/.claude/tools
chmod 755 ~/.claude/hooks

# Close open editors/tools using files
lsof ~/.claude/CLAUDE.md
# Close applications shown

# Retry update
claude /framework-update
```

#### Q: "Staging directory already exists"
**Symptoms:** Error mentions `.framework-staging` exists

**Causes:**
- Previous update failed mid-process
- Disk full during last update
- Manual .framework-staging not cleaned

**Solutions:**
```bash
# Clean staging directory
rm -rf ~/.claude/.framework-staging

# Verify it's gone
ls -la ~/.claude/.framework-staging
# Should show: No such file or directory

# Retry update
claude /framework-update
```

### CLAUDE.md Merge Issues

#### Q: CLAUDE.md after update missing my custom sections
**Symptoms:** Custom sections deleted during update

**Causes:**
- Ownership markers not recognized
- File corruption during merge
- Rollback needed

**Solutions:**
```bash
# Check backup exists
bun tools/claude-md-sync/list-backups.ts

# Preview what was changed
bun tools/claude-md-sync/diff-claude-md.ts 0

# Restore from backup
bun tools/claude-md-sync/rollback.ts 0

# If sections not in backup, add them back manually
# Then test update again with ownership markers:
# <!-- @framework-section: user -->
```

#### Q: Merge created duplicate sections
**Symptoms:** Sections appear twice in CLAUDE.md

**Causes:**
- Parser didn't recognize section ownership
- Merge algorithm duplicated sections
- File already partially updated

**Solutions:**
```bash
# Rollback to get clean state
bun tools/claude-md-sync/rollback.ts 0

# Edit CLAUDE.md to add ownership markers to custom sections:
# ## My Custom Section
# <!-- @framework-section: user -->
# Your content

# Retry merge with markers present
bun tools/claude-md-sync/merge-claude-sections.ts preview

# If preview looks good:
bun tools/claude-md-sync/merge-claude-sections.ts apply
```

#### Q: "Code fence tracking error" or malformed output
**Symptoms:** Update corrupts code blocks or content

**Causes:**
- Unbalanced code fence markers (``` count odd)
- Nested code fences
- Non-UTF-8 characters

**Solutions:**
```bash
# Check for unbalanced code fences
grep -c '```' ~/.claude/CLAUDE.md
# Should be even number

# Check for non-UTF-8
file ~/.claude/CLAUDE.md
# Should show: UTF-8

# Restore from backup
bun tools/claude-md-sync/rollback.ts 0

# Fix any issues, then:
bun tools/framework-update --check
```

### Settings.json Merge Issues

#### Q: Custom hooks disappeared after update
**Symptoms:** `settings.json` missing user-added hooks

**Causes:**
- Merge system didn't recognize custom hooks
- Hook path pattern not matched
- Backup not created

**Solutions:**
```bash
# Check if backup settings.json exists
ls -la ~/.framework-backup/

# Restore from backup
cp ~/.framework-backup/settings.json.backup ~/.claire/settings.json

# Or manually re-add hooks:
# Edit settings.json and add custom hooks back

# Verify hooks are recognized as "user hooks"
# Custom hook examples:
# - bun run skills/ghost/scripts/hooks/custom.ts
# - bun run /absolute/path/hook.ts
```

#### Q: Duplicate hooks after merge
**Symptoms:** Same hook appears twice in settings.json

**Causes:**
- Merge didn't deduplicate
- Hook command path slightly different

**Solutions:**
```bash
# View hooks
cat ~/.claude/settings.json | jq '.hooks'

# Check for duplicates manually
grep -o '"command": "[^"]*"' ~/.claude/settings.json | sort | uniq -d

# Remove duplicates:
# 1. Edit settings.json manually
# 2. Find duplicate "command" entries
# 3. Delete one of each pair
# 4. Verify JSON syntax: bun -e "JSON.parse(require('fs').readFileSync('.claude/settings.json'))"
```

### Release Notes Issues

#### Q: Release notes don't show or are empty
**Symptoms:** No release notes displayed during update

**Causes:**
- CHANGELOG.md missing
- CHANGELOG.md malformed
- generate-release-notes.ts error

**Solutions:**
```bash
# Check CHANGELOG exists
ls -la ~/.claude/CHANGELOG.md

# Verify CHANGELOG format
grep "\*\*\[CRITICAL\]\*\*\|\*\*\[STANDARD\]\*\*\|\*\*\[OPTIONAL\]\*\*" CHANGELOG.md

# Run release notes generator directly
bun tools/framework-update/generate-release-notes.ts

# If error, check manifest
cat .framework-manifest.yaml | grep -A 5 "changelog_entries"

# Try JSON output
bun tools/framework-update/generate-release-notes.ts --json
```

---

## API Reference

### Core Tools

#### parser-claude-md.ts
**Purpose:** Parse CLAUDE.md into structured sections

```bash
# Parse and display tree
bun tools/claude-md-sync/parser-claude-md.ts CLAUDE.md

# Output as JSON
bun tools/claude-md-sync/parser-claude-md.ts CLAUDE.md --json

# Parse from stdin
cat CLAUDE.md | bun tools/claude-md-sync/parser-claude-md.ts
```

**Output Example:**
```json
{
  "sections": [
    {
      "id": "critical-requirements",
      "title": "Critical Requirements",
      "level": 2,
      "ownership": "framework",
      "mergeStrategy": "replace",
      "startLine": 10,
      "endLine": 50,
      "subsections": [...]
    }
  ]
}
```

#### merge-claude-sections.ts
**Purpose:** Intelligently merge CLAUDE.md files

```bash
# Preview merge without applying
bun tools/claude-md-sync/merge-claude-sections.ts preview

# Apply merge with backup
bun tools/claude-md-sync/merge-claude-sections.ts apply

# Merge from staging
bun tools/claude-md-sync/merge-claude-sections.ts apply \
  ~/.claude/CLAUDE.md \
  ~/.claude/.framework-staging/CLAUDE.md
```

**Return Codes:**
- 0: Success
- 1: Error
- 2: Merge conflicts detected

#### backup-claude-md.ts
**Purpose:** Create timestamped backups

```bash
# Create backup (called automatically by merge tools)
bun tools/claude-md-sync/backup-claude-md.ts

# Create with custom description
bun tools/claude-md-sync/backup-claude-md.ts "Pre-major-update-backup"

# List backups (convenience function)
bun tools/claude-md-sync/list-backups.ts
```

**Backup Metadata Example:**
```json
{
  "timestamp": "2026-02-04T22-08-33",
  "iso_timestamp": "2026-02-04T22:08:33.619Z",
  "filename": "CLAUDE.md.2026-02-04T22-08-33.bak",
  "original_path": "/home/user/.claude/CLAUDE.md",
  "file_size": 11264,
  "git_commit": "e11d2ad8",
  "description": "Pre-merge backup"
}
```

#### rollback.ts
**Purpose:** Restore from backups

```bash
# List backups
bun tools/claude-md-sync/rollback.ts list

# Preview backup content
bun tools/claude-md-sync/rollback.ts preview 0

# Restore backup
bun tools/claude-md-sync/rollback.ts 0

# Restore second most recent
bun tools/claude-md-sync/rollback.ts 1
```

#### diff-claude-md.ts
**Purpose:** Visual comparison with backup

```bash
# Compare with most recent backup
bun tools/claude-md-sync/diff-claude-md.ts 0

# Compare with specific backup
bun tools/claude-md-sync/diff-claude-md.ts 2
```

**Output Example:**
```
- Removed line
+ Added line
  Context line

📊 Summary:
  Lines removed: 5
  Lines added: 8
  Net change: +3 lines
```

#### merge-settings-json.ts
**Purpose:** Intelligently merge settings.json

```bash
# Preview merge
bun tools/framework-update/merge-settings-json.ts preview \
  ~/.claude/settings.json \
  ~/.claude/.framework-staging/settings.json

# Apply merge
bun tools/framework-update/merge-settings-json.ts apply \
  ~/.claude/settings.json \
  ~/.claude/.framework-staging/settings.json
```

**Merge Statistics:**
```
Framework hooks added: 3
User hooks preserved: 5
Duplicates removed: 1
Environment variables merged: 12
```

#### generate-release-notes.ts
**Purpose:** Generate user-facing release notes

```bash
# Generate formatted release notes
bun tools/framework-update/generate-release-notes.ts

# JSON output
bun tools/framework-update/generate-release-notes.ts --json

# Filter by severity
bun tools/framework-update/generate-release-notes.ts --severity=critical
```

#### edge-case-handler.ts
**Purpose:** Detect and handle edge cases

```bash
# Check for edge cases
bun tools/claude-md-sync/edge-case-handler.ts check ~/.claude/CLAUDE.md

# Check with upstream comparison
bun tools/claude-md-sync/edge-case-handler.ts check \
  ~/.claude/CLAUDE.md \
  ~/.claude/.framework-staging/CLAUDE.md
```

**Edge Cases Detected:**
- deleted_framework_section
- malformed_marker
- missing_ownership
- major_version_jump
- file_corruption
- large_file

---

### Command-Line Interface

#### framework-update.py
**Main update orchestrator**

```bash
# Check for updates
claude /framework-update --check

# Apply updates interactively
claude /framework-update

# Force apply all updates (skip conflicts)
claude /framework-update --force

# Verbose output
claude /framework-update --verbose
```

**Output Sections:**
1. Severity summary (critical/standard/optional counts)
2. Release notes (if available)
3. File comparison report
4. Update progress
5. Summary statistics

---

### Environment Variables

| Variable | Purpose | Example |
|----------|---------|---------|
| `IA_FRAMEWORK_ROOT` | Override framework location | `/opt/ia-framework` |
| `FRAMEWORK_UPDATE_MODE` | strict/normal/lenient | `strict` |
| `BACKUP_RETENTION_DAYS` | Keep backups for N days | `30` |
| `MAX_FILE_SIZE_MB` | Max file for streaming | `50` |

---

### Configuration Files

#### .framework-manifest.yaml

```yaml
version: 1.2
updates:
  critical_available: 1
  standard_available: 2
  optional_available: 5
  last_checked: 2026-02-04T16:30:00Z
  changelog_entries:
    - version: 1.3.0
      severity: critical
      type: security_fix
      summary: "Security fix description"
      action_required: "Update immediately"
      migration_guide: "docs/migration-guides/fix.md"
      applied: false
```

#### settings.json Hooks

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          {
            "type": "command",
            "command": "bun run hooks/validate-frontmatter.ts"
          }
        ]
      }
    ]
  }
}
```

---

### Backup File Structure

```
.framework-backup/
└── CLAUDE.md-backups/
    ├── CLAUDE.md.2026-02-04T22-08-33.bak
    ├── CLAUDE.md.2026-02-04T22-08-33.meta.json
    ├── CLAUDE.md.2026-02-04T20-45-12.bak
    ├── CLAUDE.md.2026-02-04T20-45-12.meta.json
    └── ...
```

**Backup Metadata Format:**
```json
{
  "timestamp": "2026-02-04T22-08-33",
  "iso_timestamp": "2026-02-04T22:08:33.619Z",
  "filename": "CLAUDE.md.2026-02-04T22-08-33.bak",
  "original_path": "/home/user/.claude/CLAUDE.md",
  "file_size": 11264,
  "git_commit": "e11d2ad8",
  "description": "Optional description"
}
```

---

## Advanced Usage

### Multi-Framework Setup

```bash
# Instance 1 (work)
export IA_FRAMEWORK_ROOT=~/work-ia
claude /framework-update

# Instance 2 (personal)
export IA_FRAMEWORK_ROOT=~/personal-ia
claude /framework-update

# Backups stored separately:
# ~/work-ia/.framework-backup/
# ~/personal-ia/.framework-backup/
```

### Custom Merge Strategies

```bash
# Manual merge with full control
bun tools/claude-md-sync/merge-claude-sections.ts preview
# Review output
# Make manual edits if needed
bun tools/claude-md-sync/merge-claude-sections.ts apply
```

### Batch Operations

```bash
# Update multiple instances
for dir in ~/.ia-*; do
  export IA_FRAMEWORK_ROOT=$dir
  claude /framework-update
done

# Backup all instances
for dir in ~/.ia-*; do
  bun tools/claude-md-sync/backup-claude-md.ts $dir/CLAUDE.md
done
```

### Monitoring & Logging

```bash
# Check update history
bun tools/claude-md-sync/list-backups.ts

# View recent updates
ls -lt ~/.framework-backup/CLAUDE.md-backups/ | head

# Archive old backups
find ~/.framework-backup -mtime +30 -exec tar -czf archive-{}.tar.gz {} \;
```

---

## Performance Tuning

### Large CLAUDE.md Files (> 5 MB)

```bash
# Use streaming mode (future enhancement)
# For now, consider:

# 1. Break into multiple files
# 2. Archive old backup sections
# 3. Use --no-backup flag to skip backup (if confident)
```

### Network Issues

```bash
# Increase timeout
export FRAMEWORK_UPDATE_TIMEOUT=300

# Use local upstream (if available)
bun tools/framework-update/framework-update.py \
  --upstream /local/ia-framework
```

### Disk Space

```bash
# Check backup size
du -sh ~/.framework-backup/

# Archive old backups
tar -czf ~/.framework-backup/old-backups.tar.gz \
  ~/.framework-backup/CLAUDE.md-backups/*.{2026-01,2026-02-0[0-1]}*

# Clean up archived
rm ~/.framework-backup/CLAUDE.md-backups/*.{2026-01,2026-02-0[0-1]}*
```

---

## Support & Resources

**Documentation:**
- Main guide: `docs/architecture/enhanced-framework-update-system.md`
- Migration guides: `docs/migration-guides/`
- Security: `docs/security/credential-handling.md`

**Tools:**
- Source: `tools/framework-update/`
- CLAUDE.md sync: `tools/claude-md-sync/`
- Tests: `tools/**/__tests__/`

**Logs:**
- Validation: `logs/validation/`
- Framework health: `logs/framework-health/`

**Getting Help:**
1. Check troubleshooting section above
2. Review relevant migration guide
3. Check logs in `logs/`
4. Run health check: `bun tools/validation/full-framework-audit.ts`

---

**Last Updated:** 2026-02-04
**Version:** 1.0.0
**Status:** Complete
