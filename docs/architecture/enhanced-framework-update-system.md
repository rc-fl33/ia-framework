---
title: Enhanced Framework Update System
description: Severity-based updates with intelligent file merging and release notes
status: implementation-in-progress
version: 1.0.0
phases:
  - phase: 1
    status: completed
    features: [severity-tracking, changelog-validation, manifest-tracking]
  - phase: 2
    status: completed
    features: [claude-md-parsing, intelligent-merge, backup-restore, visual-diff]
  - phase: 3
    status: completed
    features: [settings-json-merge, hook-preservation, env-merging]
  - phase: 4
    status: pending
    features: [release-notes-generation, migration-guides]
  - phase: 5
    status: pending
    features: [edge-case-handling, integration-tests, documentation]
---

# Enhanced Framework Update System

**Status:** Phases 1-3 Complete, Phases 4-5 In Progress

## Overview

A comprehensive framework update system that safely propagates improvements to users while preserving their customizations through intelligent file merging, severity-based tracking, and automated release notes.

---

## Phase 1: Severity-Based Update Tracking ✅

### Completed Features

1. **CHANGELOG.md Severity Markers**
   - Added `[CRITICAL]`, `[STANDARD]`, `[OPTIONAL]` to all entries
   - Added `**Type:**` field (security_fix, breaking_change, feature, improvement, bug_fix, enhancement)
   - Added `**Action Required:**` field describing user obligations
   - Example format:
     ```markdown
     - **[CRITICAL]** Security fix for credential exposure
       - **Type:** security_fix
       - **Action Required:** Update immediately
     ```

2. **Pre-Commit Hook: validate-changelog-severity.ts**
   - Enforces severity marker format
   - Validates Type field values
   - Validates Action Required field presence
   - Blocks commits without proper markers
   - Location: `hooks/pre-commit/09-validate-changelog-severity.ts`

3. **.framework-manifest.yaml Update Tracking**
   - Added `updates:` section tracking:
     - `critical_available`: Count of critical updates
     - `standard_available`: Count of standard updates
     - `optional_available`: Count of optional updates
     - `changelog_entries`: Array of update metadata with severity, type, action_required, migration_guide
   - Enables automated release notes generation

4. **Hook Security Classifications** (hooks/README.md)
   - 🔴 **Security-Critical** (credential-guardian, file-guardian): Always update, no override
   - 🟡 **Recommended** (validators, enforcement): Update recommended
   - 🟢 **Optional** (logging, convenience): Update at convenience

5. **framework-update.py Enhancement**
   - Added `load_manifest()` function to parse .framework-manifest.yaml
   - Added `get_severity_summary()` to extract update counts
   - Added `print_severity_report()` to display categorized updates
   - Shows 🔴 CRITICAL / 🟡 STANDARD / 🟢 OPTIONAL with different prompts

### Files Modified
- `CHANGELOG.md` - Added severity markers to all entries
- `.framework-manifest.yaml` - Added updates tracking section
- `hooks/README.md` - Added security classifications table
- `hooks/pre-commit/09-validate-changelog-severity.ts` - New validation hook
- `tools/framework-update/framework-update.py` - Enhanced with severity display

---

## Phase 2: CLAUDE.md Smart Merge ✅

### Completed Features

1. **parser-claude-md.ts** - CLAUDE.md Section Parser
   - Parses CLAUDE.md into sections with ownership detection
   - Respects code fences (doesn't parse ## inside code blocks)
   - Detects ownership via:
     - Ownership markers: `@framework-section: owned|user|hybrid`
     - Heuristics: Recognizes framework patterns (ORCHESTRATOR, routing, etc.)
     - Default: Conservative (preserve user content when unsure)
   - Outputs:
     - Human-readable section tree (with 📘 🔄 👤 ❓ icons)
     - JSON output for programmatic use
     - Ownership statistics

2. **merge-claude-sections.ts** - Intelligent Merge Logic
   - **Framework sections**: Always replace with upstream
   - **User sections**: Always preserve local version
   - **Hybrid sections**: Merge framework entries + user additions
   - Modes:
     - `preview`: Dry-run showing what would change
     - `apply`: Perform merge with timestamped backup
   - Generates merge report with statistics

3. **backup-claude-md.ts** - Backup Management
   - Creates timestamped backups before merge operations
   - Backup location: `.framework-backup/CLAUDE.md-backups/`
   - Metadata includes:
     - ISO timestamp
     - File size
     - Git commit hash (if available)
     - Custom description
   - Exports functions for programmatic use

4. **rollback.ts** - Restore from Backups
   - Commands:
     - `rollback.ts list` - List all available backups
     - `rollback.ts preview <index>` - Preview before restoring
     - `rollback.ts <index>` - Restore from backup
   - Auto-creates pre-rollback backup before restoring
   - Git integration (stages restored file)
   - Index 0 = most recent backup

5. **list-backups.ts** - Backup Inventory Display
   - Table-formatted backup list
   - Shows timestamps, file sizes, git commits
   - Quick access to restore/preview commands

6. **diff-claude-md.ts** - Visual Comparison
   - Compare current CLAUDE.md with any backup
   - Shows added/removed/context lines
   - Line-by-line statistics (removed, added, net change)
   - Location: `tools/claude-md-sync/diff-claude-md.ts`

7. **Unit Tests** - Merge Logic Validation
   - Parser tests: Headings, code fences, nesting, empty files
   - Ownership detection tests
   - Merge strategy tests
   - Settings merge tests (hook detection, preservation)
   - Location: `tools/claude-md-sync/__tests__/merge.test.ts`

### Architecture Decisions

- **Code Fence Tracking**: State machine tracks code fence nesting to avoid false ## detection inside code blocks
- **Conservative Defaults**: When ownership is uncertain, defaults to 'preserve' to protect user content
- **Backup-First Approach**: All merge operations create timestamped backups before applying changes
- **Reversible Operations**: Full rollback capability via backup system

### Files Created
- `tools/claude-md-sync/parser-claude-md.ts`
- `tools/claude-md-sync/merge-claude-sections.ts`
- `tools/claude-md-sync/backup-claude-md.ts`
- `tools/claude-md-sync/rollback.ts`
- `tools/claude-md-sync/list-backups.ts`
- `tools/claude-md-sync/diff-claude-md.ts`
- `tools/claude-md-sync/__tests__/merge.test.ts`

---

## Phase 3: Intelligent settings.json Merge ✅

### Completed Features

1. **merge-settings-json.ts** - JSON Merge Logic
   - **Hook Arrays**: Merge with user hook preservation
     - Detects user hooks: `skills/*/scripts/hooks/*` or non-framework paths
     - Detects framework hooks: `bun run hooks/*` commands
     - Deduplicates by command path
     - Preserves user hooks while adding new framework hooks
   - **Environment Variables**: Object merge
     - Upstream as base
     - Local values override
     - Recursive merge for nested objects
   - **Framework Section**: Always replaced with upstream
   - Modes: preview (dry-run) and apply (execute)

2. **framework-update.py Integration**
   - Added `merge_settings_json()` function
   - Special handling for settings.json during updates:
     - Calls TypeScript merge tool via `bun`
     - Intelligent merge instead of simple file copy
     - Preserves user-added hooks (e.g., monitor skill hook)
   - Applied during `apply_update()` phase

### User Hook Examples

These patterns are detected as user hooks and preserved:
- `bun run skills/ghost/scripts/hooks/custom-hook.ts`
- `bun run /custom/path/to/hook.sh`
- Any path not matching `bun run hooks/*` pattern

Framework hooks (always updated):
- `bun run hooks/credential-guardian.ts`
- `bun run hooks/validate-frontmatter.ts`

### Files Created/Modified
- `tools/framework-update/merge-settings-json.ts` - New merge tool
- `tools/framework-update/framework-update.py` - Integration added

---

## Phase 4: Release Notes Generation (Pending)

### Planned Features

1. **generate-release-notes.ts**
   - Parse CHANGELOG.md severity markers
   - Extract migration guides from manifest
   - Generate user-facing update reports
   - Include breaking change warnings

2. **Migration Guide Templates** (docs/migration-guides/)
   - Template for security fixes
   - Template for breaking changes
   - Template for hook updates
   - Credential security update guide

3. **framework-update.py Enhancement**
   - Display release notes to users
   - Interactive prompts for breaking changes
   - Migration guide links

### Tasks
- [ ] Task #13: Build generate-release-notes.ts
- [ ] Task #14: Create migration guide templates
- [ ] Task #15: Enhance framework-update.py with release notes

---

## Phase 5: Edge Cases & Documentation (Pending)

### Planned Features

1. **Edge Case Handling**
   - User-deleted framework section → Restore with warning
   - Code blocks with ## → Proper fence tracking
   - Malformed markers → Fall back to heuristics
   - Multi-framework installations → Instance ID tracking
   - Major version jumps (v1 → v2) → Conservative mode

2. **Comprehensive Integration Tests**
   - Clean update (no customizations)
   - User customizations preserved
   - Conflict detection and resolution
   - Rollback validation
   - End-to-end update cycle

3. **Documentation**
   - CLAUDE.md section ownership model
   - Merge algorithm details
   - Severity system guide
   - Hook security classifications reference
   - Settings.json merge strategy
   - Release notes generation
   - Backup/rollback procedures
   - Troubleshooting guide

### Tasks
- [ ] Task #16: Integration tests
- [ ] Task #17: Edge case handling
- [ ] Task #18: Comprehensive documentation

---

## Usage Examples

### Check for Updates

```bash
$ claude /framework-update --check

🔴 [CRITICAL] 1 security update available:
  • Session Tracking Path Inconsistency fix
    - ACTION: Update immediately

🟡 [STANDARD] 2 feature updates available:
  • CLAUDE.md smart merge system
  • Enhanced hook security classifications

🟢 [OPTIONAL] 5 enhancements available
```

### Parse CLAUDE.md Sections

```bash
$ bun tools/claude-md-sync/parser-claude-md.ts CLAUDE.md

📘 Critical Requirements (↻ replace)
📘 YOUR ROLE AS ORCHESTRATOR (↻ replace)
👤 Communication Style (⊚ preserve)
🔄 Agent Routing Table (⚡ intelligent)
```

### Backup and Rollback

```bash
$ bun tools/claude-md-sync/list-backups.ts
[0] 02/04/2026, 04:08:33 PM (11.0 KB) [e11d2ad]

$ bun tools/claude-md-sync/rollback.ts preview 0
$ bun tools/claude-md-sync/rollback.ts 0
```

### Merge Settings with User Hooks Preserved

```bash
$ bun tools/framework-update/merge-settings-json.ts preview \
    settings.json upstream-settings.json

✓ Framework hooks added: 3
⊚ User hooks preserved: 5
🗑️  Duplicates removed: 1
```

---

## Architecture Overview

```
Framework Update System
├── Phase 1: Severity Tracking
│   ├── CHANGELOG.md markers
│   ├── validate-changelog-severity.ts hook
│   ├── .framework-manifest.yaml updates section
│   └── framework-update.py severity display
├── Phase 2: CLAUDE.md Smart Merge
│   ├── parser-claude-md.ts
│   ├── merge-claude-sections.ts
│   ├── backup-claude-md.ts
│   ├── rollback.ts
│   ├── list-backups.ts
│   └── diff-claude-md.ts
├── Phase 3: settings.json Merge
│   ├── merge-settings-json.ts
│   └── framework-update.py integration
├── Phase 4: Release Notes (pending)
│   ├── generate-release-notes.ts
│   ├── Migration guide templates
│   └── framework-update.py enhancement
└── Phase 5: Edge Cases & Docs (pending)
    ├── Edge case handling
    ├── Integration tests
    └── Comprehensive documentation
```

---

## Security Considerations

1. **Credential Protection**
   - Backup system respects .gitignore
   - No credentials stored in backups
   - Rollback never exposes sensitive data

2. **Hook Security**
   - Security-critical hooks (credential-guardian) always update
   - No way to skip security hook updates
   - User hooks preserved only if non-security

3. **Merge Safety**
   - All merges create backups before applying
   - Preview mode allows dry-runs
   - Rollback always available

---

## Future Enhancements

1. **Cloud Backup**: Optional S3/cloud backup storage for backups
2. **Update Scheduling**: Schedule updates for off-peak times
3. **Staged Updates**: Update different components on different schedules
4. **Feedback Loop**: Collect user feedback on update experience
5. **A/B Testing**: Test updates with subset of users before rollout

---

## References

- Implementation: `/tools/framework-update/`
- CLAUDE.md sync tools: `/tools/claude-md-sync/`
- Test fixtures: `/tools/claude-md-sync/__tests__/`
- Backup storage: `/.framework-backup/CLAUDE.md-backups/`
- Manifest: `/.framework-manifest.yaml`
- Severity validation hook: `/hooks/pre-commit/09-validate-changelog-severity.ts`

---

**Last Updated:** 2026-02-04
**Status:** Phases 1-3 Complete, Phases 4-5 In Progress
**Contributors:** Claude Haiku 4.5, IA Framework Core Team
