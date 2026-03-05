---
title: Enhanced Framework Update System - Migration Guide
status: standard
severity: standard
type: feature
date: 2026-02-04
---

# Enhanced Framework Update System - Migration Guide

**Status:** Feature Update
**Type:** Feature
**Action Required:** None - automatic

## What's New

The framework now intelligently manages updates while preserving your customizations. No action needed on your part!

### New Capabilities

1. **Smart CLAUDE.md Updates**
   - Framework sections auto-update
   - Your custom sections stay exactly as you made them
   - Automatic backups before changes

2. **Intelligent settings.json Merging**
   - New framework hooks added automatically
   - Your custom hooks (e.g., monitor skill) are preserved
   - No configuration loss

3. **Severity-Based Update Tracking**
   - 🔴 Critical security fixes
   - 🟡 Standard features & improvements
   - 🟢 Optional enhancements

4. **Complete Rollback Capability**
   - Every update creates timestamped backups
   - Recover from any update instantly
   - Full history available

## What You Notice

### When Updating
```bash
$ claude /framework-update --check

🔴 [CRITICAL] 1 security update available:
   • Session Tracking Path Inconsistency

🟡 [STANDARD] 2 feature updates available:
   • CLAUDE.md smart merge
   • Hook security classifications

🟢 [OPTIONAL] 5 enhancements available
```

### After Updating
- CLAUDE.md updates reflect framework improvements
- Your custom configuration stays untouched
- settings.json has new hooks + your custom ones
- Backup created automatically in `.framework-backup/`

## New Commands

### See Backups
```bash
bun tools/claude-md-sync/list-backups.ts
```

### Preview Changes Before Updating
```bash
bun tools/claude-md-sync/merge-claude-sections.ts preview
```

### Rollback if Needed
```bash
bun tools/claude-md-sync/rollback.ts 0  # Restore most recent backup
```

### View What Changed
```bash
bun tools/claude-md-sync/diff-claude-md.ts 0  # Compare with backup
```

## Backward Compatibility

This update is **100% backward compatible**:
- Existing settings.json files work unchanged
- CLAUDE.md customizations preserved
- No migration steps required
- Safe to apply immediately

## Advanced: Custom Section Ownership

If you add custom CLAUDE.md sections, mark them for preservation:

```markdown
## My Custom Section
<!-- @framework-section: user -->

Your content here stays protected during updates.
```

Available markers:
- `@framework-section: user` - Always preserve this section
- `@framework-section: framework` - Always replace from upstream (rarely needed)
- `@framework-section: hybrid` - Merge framework entries + your additions

Without markers, the system uses smart heuristics to detect ownership.

## FAQ

### Q: Will my settings.json changes be lost?
**A:** No. User hooks and environment variables are preserved and merged intelligently.

### Q: Can I go back to the old version?
**A:** Yes, use `rollback.ts`:
```bash
bun tools/claude-md-sync/rollback.ts list
bun tools/claude-md-sync/rollback.ts 1
```

### Q: What if something breaks?
**A:** Every change creates a backup. Instant recovery available.

### Q: Do I need to do anything?
**A:** No action required. Just update normally with `claude /framework-update`.

## Technical Details

### What This Release Includes

**New Tools:**
- `parser-claude-md.ts` - Parse CLAUDE.md sections
- `merge-claude-sections.ts` - Intelligent merging
- `backup-claude-md.ts` - Backup management
- `rollback.ts` - Restore from backups
- `list-backups.ts` - View backup history
- `diff-claude-md.ts` - Visual comparison
- `merge-settings-json.ts` - Smart JSON merge
- `generate-release-notes.ts` - Release notes generation

**New Manifest Fields:**
- `.framework-manifest.yaml` - Update severity tracking
- Migration guide references
- Update metadata

**New Hook:**
- `09-validate-changelog-severity.ts` - Enforce update markers

### Backup Storage
```
.framework-backup/
└── CLAUDE.md-backups/
    ├── CLAUDE.md.2026-02-04T22-08-33.bak
    ├── CLAUDE.md.2026-02-04T22-08-33.meta.json
    ├── CLAUDE.md.2026-02-04T20-45-12.bak
    └── CLAUDE.md.2026-02-04T20-45-12.meta.json
```

## More Information

- Full documentation: `docs/architecture/enhanced-framework-update-system.md`
- CLAUDE.md parsing: `tools/claude-md-sync/parser-claude-md.ts`
- Merge logic: `tools/claude-md-sync/merge-claude-sections.ts`

---

**Last Updated:** 2026-02-04
**User Action Required:** None
**Backward Compatible:** Yes
