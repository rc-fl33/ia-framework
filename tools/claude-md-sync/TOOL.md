---
name: claude-md-sync
type: utility
classification: public
description: Intelligent CLAUDE.md merge tool - distinguishes framework vs user sections during updates, automatic backups, preview mode
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/claude-md-sync/merge-claude-sections.ts preview
  - bun tools/claude-md-sync/merge-claude-sections.ts apply
  - bun tools/claude-md-sync/diff-claude-md.ts <upstream> <local>
  - bun tools/claude-md-sync/backup-claude-md.ts
  - bun tools/claude-md-sync/list-backups.ts
  - bun tools/claude-md-sync/rollback.ts <backup>
related_tools:
  - tools/framework-update
  - tools/sessions
---

# CLAUDE.md Sync Tool

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Intelligent CLAUDE.md merge utility for framework updates.

**Why Public:**
- Core framework maintenance functionality
- No proprietary logic - standard section-based merge
- Useful for all framework users during updates
- Transparent ownership detection (framework vs user sections)

---

## Purpose

Intelligently merge upstream CLAUDE.md with local customizations during framework updates. Automatically detects section ownership (framework vs user) and applies appropriate merge strategies: replace framework sections, preserve user sections, merge hybrid content.

**Core Capabilities:**
- **Ownership detection**: Identifies framework-owned, user-customizable, and hybrid sections
- **Preview mode**: Shows changes before applying
- **Automatic backups**: Timestamped backups before any modification
- **Rollback support**: Restore from previous backup
- **Code-fence awareness**: Doesn't parse `##` inside code blocks
- **Diff visualization**: Compare upstream vs local changes

**Use Cases:**
- **Framework updates**: Merge new CLAUDE.md without losing customizations
- **Section management**: Understand which sections are safe to edit
- **Conflict resolution**: Preview merges before applying
- **Backup/restore**: Rollback bad merges or accidental edits

---

## Usage

### Preview Changes

**Show what would change (no modifications):**
```bash
bun tools/claude-md-sync/merge-claude-sections.ts preview

# Output:
# ═══════════════════════════════════════════════════════════════════
# CLAUDE.md MERGE PREVIEW
# ───────────────────────────────────────────────────────────────────
#
# FRAMEWORK SECTIONS (will be replaced):
#   ✓ YOUR ROLE AS ORCHESTRATOR (35 lines)
#   ✓ Routing Decision Tree (42 lines)
#   ✓ Agent Routing Table (28 lines)
#
# USER SECTIONS (will be preserved):
#   ◆ Communication Style (12 lines)
#   ◆ Custom Examples (8 lines)
#
# HYBRID SECTIONS (will be merged):
#   ⊕ Directory Structure (framework + user additions)
#
# TOTAL CHANGES: 105 lines
# ═══════════════════════════════════════════════════════════════════
```

**Preview specific file:**
```bash
bun tools/claude-md-sync/merge-claude-sections.ts preview /path/to/CLAUDE.md
```

### Apply Merge

**Apply changes with automatic backup:**
```bash
bun tools/claude-md-sync/merge-claude-sections.ts apply

# Output:
# ✅ Backup created: .framework-backup/CLAUDE.md-backups/CLAUDE.md.2026-02-14T15-30-00
# ✅ Merged 3 framework sections
# ✅ Preserved 2 user sections
# ✅ Merged 1 hybrid section
# ✅ Total changes: 105 lines
# ✅ CLAUDE.md updated successfully
```

### Backup Management

**Create manual backup:**
```bash
bun tools/claude-md-sync/backup-claude-md.ts

# Output:
# ✅ Backup created: .framework-backup/CLAUDE.md-backups/CLAUDE.md.2026-02-14T15-45-12
```

**List available backups:**
```bash
bun tools/claude-md-sync/list-backups.ts

# Output:
# Available CLAUDE.md backups:
#
# 1. CLAUDE.md.2026-02-14T15-45-12 (532 KB) - 5 minutes ago
# 2. CLAUDE.md.2026-02-14T09-22-03 (528 KB) - 6 hours ago
# 3. CLAUDE.md.2026-02-13T14-10-48 (520 KB) - 1 day ago
#
# To restore: bun tools/claude-md-sync/rollback.ts <filename>
```

**Rollback to previous version:**
```bash
bun tools/claude-md-sync/rollback.ts CLAUDE.md.2026-02-14T15-45-12

# Output:
# ✅ CLAUDE.md restored from backup
# Original backed up as: CLAUDE.md.2026-02-14T16-00-00 (before rollback)
```

### Diff Visualization

**Compare upstream vs local:**
```bash
bun tools/claude-md-sync/diff-claude-md.ts \
  .framework-staging/CLAUDE.md \
  CLAUDE.md

# Output:
# ═══════════════════════════════════════════════════════════════════
# CLAUDE.md DIFF
# ───────────────────────────────────────────────────────────────────
#
# SECTION: YOUR ROLE AS ORCHESTRATOR
# Status: FRAMEWORK-OWNED (will replace)
# Changes: +12 lines, -3 lines
#
# SECTION: Communication Style
# Status: USER-OWNED (will preserve)
# Changes: None (keeping local version)
#
# SECTION: Directory Structure
# Status: HYBRID (will merge)
# Changes: +5 framework entries, 2 user additions preserved
# ═══════════════════════════════════════════════════════════════════
```

---

## Configuration

### Environment Variables

**Optional:**
```bash
IA_FRAMEWORK_ROOT=/path/to/framework  # Override framework root detection
```

Default: Auto-detected from script location

### Backup Location

Backups stored in: `.framework-backup/CLAUDE.md-backups/`

**Retention:** Manual cleanup (no automatic deletion)

**Naming:** `CLAUDE.md.YYYY-MM-DDTHH-MM-SS`

---

## API Reference

### Commands

#### `merge-claude-sections.ts preview [path]`

Preview merge without making changes.

**Parameters:**
- `path` - Optional CLAUDE.md path (defaults to framework root)

**Output:** Merge report with sections grouped by action

**Exit Codes:**
- `0` - Preview successful
- `1` - Error (file not found, parse error)

---

#### `merge-claude-sections.ts apply [path]`

Apply merge with automatic backup.

**Parameters:**
- `path` - Optional CLAUDE.md path (defaults to framework root)

**Safety:**
- Creates timestamped backup before modifications
- Validates parse success before writing
- Atomic file replacement

**Output:** Merge summary with line counts

**Exit Codes:**
- `0` - Merge successful
- `1` - Error (backup failed, write failed)

---

#### `diff-claude-md.ts <upstream> <local>`

Compare two CLAUDE.md files.

**Parameters:**
- `upstream` - Upstream CLAUDE.md path
- `local` - Local CLAUDE.md path

**Output:** Section-by-section diff with ownership annotations

---

#### `backup-claude-md.ts [path]`

Create manual backup.

**Parameters:**
- `path` - Optional CLAUDE.md path (defaults to framework root)

**Output:** Backup file path

---

#### `list-backups.ts`

List available backups sorted by timestamp.

**Output:** Formatted list with sizes and ages

---

#### `rollback.ts <backup>`

Restore from backup.

**Parameters:**
- `backup` - Backup filename (from list-backups output)

**Safety:** Creates backup of current CLAUDE.md before rollback

**Output:** Confirmation message with new backup path

---

### Programmatic API

**Parse CLAUDE.md:**
```typescript
import { parseClaudeMd } from '@/tools/claude-md-sync/parser-claude-md';

const parsed = parseClaudeMd(content);

console.log(`Found ${parsed.sections.length} sections`);

parsed.sections.forEach(section => {
  console.log(`${section.title} - ${section.ownership}`);
  // ownership: 'framework' | 'user' | 'hybrid' | 'unknown'
});
```

**Extract section lines:**
```typescript
import { extractSectionLines } from '@/tools/claude-md-sync/merge-claude-sections';

const lines = extractSectionLines(content, { start: 10, end: 50 });
console.log(`Section has ${lines.length} lines`);
```

**Check ownership:**
```typescript
import { isFrameworkSection } from '@/tools/claude-md-sync/merge-claude-sections';

if (isFrameworkSection('YOUR ROLE AS ORCHESTRATOR')) {
  console.log('Framework-owned - will be replaced');
}
```

---

## Architecture

### Ownership Detection

**Framework-owned sections** (always replace with upstream):
- "YOUR ROLE AS ORCHESTRATOR"
- "Routing Decision Tree"
- "Agent Routing Table"
- "Critical Requirements"
- Any section with "ORCHESTRATOR" or "Routing" in title

**User-owned sections** (always preserve local):
- "Communication Style"
- "Custom Examples"
- "Personal Preferences"
- Any section with "Custom", "My", or "Personal" in title

**Hybrid sections** (intelligent merge):
- "Directory Structure" (framework paths + user additions)
- Lists with both framework and user entries

**Unknown sections** (treat as user-owned):
- New sections not matching patterns
- Safest default: preserve local

### Merge Algorithm

```
For each section in upstream CLAUDE.md:
   ↓
1. Parse section metadata
   ├─ Extract title, level, lines
   ├─ Detect ownership (framework/user/hybrid)
   └─ Determine merge strategy (replace/preserve/intelligent)
   ↓
2. Find matching section in local CLAUDE.md
   ├─ By title match
   ├─ By section ID (slug)
   └─ Or mark as "new"
   ↓
3. Apply merge strategy
   ├─ framework → Replace with upstream
   ├─ user → Keep local version
   ├─ hybrid → Merge framework + user entries
   └─ new → Add from upstream
   ↓
4. Write merged output
   ├─ Create backup first
   ├─ Validate parse success
   └─ Atomic file write
```

### Code Fence Handling

**Problem:** Don't parse `##` inside code blocks as headings

**Solution:**
```typescript
let inCodeFence = false;

for (const line of lines) {
  if (line.startsWith('```')) {
    inCodeFence = !inCodeFence;
    continue;
  }

  if (inCodeFence) {
    // Don't parse ## as heading
    continue;
  }

  if (line.match(/^#{1,6}\s+/)) {
    // Valid heading outside code fence
  }
}
```

### Backup Strategy

**Location:** `.framework-backup/CLAUDE.md-backups/`

**Naming:** `CLAUDE.md.YYYY-MM-DDTHH-MM-SS`

**Created on:**
- Manual backup command
- Before apply merge
- Before rollback (backup current before restoring)

**Retention:** Manual cleanup (recommend keeping 5-10 backups)

---

## Scripts

### Preview and Apply Workflow

```bash
#!/bin/bash
# Safe CLAUDE.md update workflow

# 1. Preview changes
bun tools/claude-md-sync/merge-claude-sections.ts preview

# 2. Review output (check sections)

# 3. Create manual backup (extra safety)
bun tools/claude-md-sync/backup-claude-md.ts

# 4. Apply merge
bun tools/claude-md-sync/merge-claude-sections.ts apply

# 5. Verify merge
git diff CLAUDE.md

# 6. If bad: rollback
# bun tools/claude-md-sync/rollback.ts <latest-backup>
```

### Diff Upstream Changes

```bash
#!/bin/bash
# See what changed in upstream before merging

# Fetch upstream to staging
cd .framework-staging
git pull origin main

# Diff upstream vs local
bun tools/claude-md-sync/diff-claude-md.ts \
  .framework-staging/CLAUDE.md \
  CLAUDE.md

# Review, then merge if desired
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- `fs` - File system operations
- `path` - Path resolution

### Framework Integration

**Used By:**
- `tools/framework-update` - Automatic CLAUDE.md merge during updates

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Tools:**
- `tools/framework-update/` — calls merge-claude-sections.ts automatically during framework version updates

No direct TypeScript importers from hooks or skills — invoked via CLI by the framework-update tool and by users directly.

**File Structure:**
```
tools/claude-md-sync/
├── merge-claude-sections.ts   # Main merge logic
├── parser-claude-md.ts         # Section parser
├── diff-claude-md.ts           # Diff visualization
├── backup-claude-md.ts         # Manual backup
├── list-backups.ts             # List available backups
├── rollback.ts                 # Restore from backup
├── edge-case-handler.ts        # Edge case handling
├── __tests__/
│   └── merge.test.ts           # Unit tests
└── TOOL.md                     # This file
```

---

## Troubleshooting

### "Backup failed"

**Cause:** `.framework-backup` directory not writable

**Fix:**
```bash
# Create backup directory
mkdir -p .framework-backup/CLAUDE.md-backups

# Check permissions
ls -la .framework-backup

# Fix permissions if needed
chmod 755 .framework-backup
```

### "Parse error: unclosed code fence"

**Cause:** CLAUDE.md has unmatched ``` (code fence not closed)

**Fix:**
```bash
# Find unclosed fences
grep -n '```' CLAUDE.md

# Count opening vs closing
echo "Opening: $(grep -c '^```' CLAUDE.md)"
echo "Should be even"

# Fix manually: add closing ``` where needed
```

### "Section not found in local"

**Cause:** Upstream has new section not in local CLAUDE.md

**Behavior:** New sections are added from upstream (treated as framework-owned)

**No action needed** - this is expected during framework updates

### "Merge conflict: user modified framework section"

**Cause:** You edited a framework-owned section (e.g., "YOUR ROLE")

**Fix:**
```bash
# Preview shows conflict
bun tools/claude-md-sync/merge-claude-sections.ts preview

# Options:
# 1. Accept upstream (lose your edits) - default behavior
# 2. Manually merge after update
# 3. Move your edits to user-owned section
```

**Recommendation:** Don't edit framework-owned sections. Add customizations in new sections.

### "Rollback failed: backup not found"

**Cause:** Backup file doesn't exist or wrong filename

**Fix:**
```bash
# List available backups
bun tools/claude-md-sync/list-backups.ts

# Use exact filename from list
bun tools/claude-md-sync/rollback.ts CLAUDE.md.2026-02-14T15-45-12
```

### "Diff shows no changes but preview shows changes"

**Cause:** Whitespace or formatting differences

**Debug:**
```bash
# Check for whitespace differences
diff -w .framework-staging/CLAUDE.md CLAUDE.md

# Check line endings
file CLAUDE.md
file .framework-staging/CLAUDE.md

# Normalize line endings if needed
dos2unix CLAUDE.md  # or mac2unix
```

---

## Related Tools

- **tools/framework-update** - Framework update system (uses claude-md-sync automatically)
- **tools/sessions** - Session management (similar backup/restore pattern)
- **tools/git** - Git workflow automation (commit after merge)

---

## Version History

### 1.0.0 (2026-01-28)
- ✅ Intelligent section-based merge
- ✅ Ownership detection (framework vs user vs hybrid)
- ✅ Preview mode with detailed report
- ✅ Automatic backup before apply
- ✅ Rollback support
- ✅ Code-fence awareness
- ✅ Diff visualization
- ✅ Edge case handling
- ✅ Unit tests

---

## References

- **Framework Update Guide:** `tools/framework-update/README.md`
- **CLAUDE.md Template:** `CLAUDE.md` (framework root)
- **Merge Strategy:** Section ownership documented in CLAUDE.md itself
