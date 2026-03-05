# Environment Management System Utilities

Complete toolkit for safe, intelligent management of `.env` files organized by skill.

## Overview

The environment management system provides six core utilities for managing `.env` files with full safety guarantees:

1. **backup-env.ts** - Create timestamped backups before edits
2. **parser-env.ts** - Parse .env into sections while preserving formatting
3. **validate-env.ts** - Validate .env against specification
4. **merge-env-sections.ts** - Intelligently merge new sections
5. **diff-env.ts** - Show what changed between versions
6. **integration-test.ts** - Test complete workflow

## Quick Start

### 1. Backup Before Any Edit

```bash
bun tools/env-sync/backup-env.ts /home/groves/.claude/.env
```

Creates: `/home/groves/.claude/.env.backup.2026-01-18T15-59-20`

### 2. Parse Current Structure

```bash
bun tools/env-sync/parser-env.ts /home/groves/.claude/.env
```

Shows sections, keys, and structure without modifying file.

### 3. Validate Against Specification

```bash
bun tools/env-sync/validate-env.ts /home/groves/.claude/.env
```

Checks against `.env.structure.yaml` for:
- Required keys present
- Valid key names
- Structure integrity

### 4. Merge New Keys (In-Memory Preview)

```bash
bun tools/env-sync/merge-env-sections.ts preview \
  /home/groves/.claude/.env \
  "ghost-skill" \
  '{"GHOST_ADMIN_API_KEY":"[insert_key]"}'
```

Shows what would be added without modifying file.

### 5. Apply Merge (With Backup)

```bash
bun tools/env-sync/merge-env-sections.ts apply \
  /home/groves/.claude/.env \
  "ghost-skill" \
  '{"GHOST_ADMIN_API_KEY":"[insert_key]"}'
```

Automatically creates backup before writing changes.

### 6. Compare Versions (Diff)

```bash
bun tools/env-sync/diff-env.ts \
  /home/groves/.claude/.env.backup.2026-01-18T15-59-20 \
  /home/groves/.claude/.env
```

Shows exactly what changed with values masked for security.

## Utilities Reference

### backup-env.ts

**Purpose:** Create timestamped backups before modifications

**Usage:**
```bash
bun tools/env-sync/backup-env.ts [envPath]
```

**Features:**
- Generates timestamped filename: `{path}.backup.{ISO-8601}`
- Validates backup matches original
- Adds `.env.backup*` pattern to .gitignore
- Supports restore from backup

**Example:**
```bash
bun tools/env-sync/backup-env.ts ~/.claude/.env
# Output:
# ✅ Backup created successfully
#    Original: /home/groves/.claude/.env
#    Backup:   /home/groves/.claude/.env.backup.2026-01-18T15-59-33
#    Size:     9448 bytes
#    Status:   ✓ Verified
```

### parser-env.ts

**Purpose:** Parse .env into structured sections while preserving all formatting

**Usage:**
```bash
bun tools/env-sync/parser-env.ts [envPath]
```

**Features:**
- Parses by skill sections (header comments)
- Preserves comments, empty lines, formatting
- Returns sections map + all lines + raw content
- Supports reconstruction without data loss

**Line Types:**
- `comment` - Comment lines (# ...)
- `section` - Section headers (# SKILL NAME)
- `key-value` - KEY=VALUE pairs
- `empty` - Empty lines

**Example Output:**
```
SECTIONS:
  Total: 13

  ghost-skill:
    Name: Ghost Skill
    Keys: 5
      GHOST_ADMIN_API_KEY: (set)
      GHOST_CONTENT_API_KEY: (set)
      GHOST_API_URL: (set)
```

### validate-env.ts

**Purpose:** Validate .env file against `.env.structure.yaml` specification

**Usage:**
```bash
bun tools/env-sync/validate-env.ts [envPath]
```

**Features:**
- Checks required keys are present
- Validates key names against specification
- Detects unknown keys (warnings)
- Returns detailed validation report

**Output Example:**
```
Keys Found: 47
Status: ✅ VALID

ERRORS (0):
WARNINGS (20):
  ⚠️  Unknown key: VPS_name (not in specification)
  ...
```

**Required Keys (from .env.structure.yaml):**
- `OPENROUTER_API_KEY` (core-framework)
- `GITHUB_TOKEN` (git-skill)
- `GHOST_ADMIN_API_KEY` (ghost-skill)
- (See .env.structure.yaml for complete list)

### merge-env-sections.ts

**Purpose:** Intelligently merge new credential sections into existing .env

**Usage:**
```bash
bun tools/env-sync/merge-env-sections.ts [action] [envPath] [section] [keysJson]
```

**Actions:**
- `preview` - Show what would change (no file modification)
- `apply` - Apply changes with automatic backup

**Features:**
- Preserves all existing sections exactly
- Adds new section if not exists
- Updates only specified keys in existing section
- Maintains formatting and comments
- Automatic backup before apply

**Example:**
```bash
# Preview
bun tools/env-sync/merge-env-sections.ts preview \
  ~/.claude/.env \
  "test-skill" \
  '{"TEST_KEY":"test_value","TEST_URL":"https://example.com"}'

# Apply
bun tools/env-sync/merge-env-sections.ts apply \
  ~/.claude/.env \
  "test-skill" \
  '{"TEST_KEY":"[insert_key]","TEST_URL":"[insert_url]"}'
```

**Return Value:**
```json
{
  "success": true,
  "message": "Successfully applied merge: 3 new + 0 updated",
  "originalLineCount": 221,
  "newLineCount": 226,
  "addedKeys": ["TEST_KEY", "TEST_URL"],
  "modifiedKeys": [],
  "sectionFound": false,
  "newSectionAdded": true
}
```

### diff-env.ts

**Purpose:** Compare two .env file versions and display changes

**Usage:**
```bash
bun tools/env-sync/diff-env.ts [originalPath] [modifiedPath]
```

**Features:**
- Shows added, removed, and modified keys
- Masks credential values for security
- Displays by section
- Human-readable format

**Example Output:**
```
📊 Summary: +3 added

✅ ADDED:
  + [test-skill] TEST_KEY=****
  + [test-skill] TEST_URL=https://...

📁 AFFECTED SECTIONS:
  ✨ test-skill
```

### integration-test.ts

**Purpose:** Test complete workflow end-to-end

**Usage:**
```bash
bun tools/env-sync/integration-test.ts
```

**Tests:**
1. Backup creation
2. Parse structure
3. Merge section (in-memory)
4. Validate structure
5. Diff comparison

**Output:**
```
Results: 5 pass, 0 fail, 0 warn
```

## Complete Workflow Example

### Adding Ghost Skill Credentials

```bash
# Step 1: Backup
bun tools/env-sync/backup-env.ts ~/.claude/.env

# Step 2: Parse to see current state
bun tools/env-sync/parser-env.ts ~/.claude/.env

# Step 3: Preview what will be added
bun tools/env-sync/merge-env-sections.ts preview \
  ~/.claude/.env \
  "ghost-skill" \
  '{
    "GHOST_ADMIN_API_KEY":"[insert_key]",
    "GHOST_CONTENT_API_KEY":"[insert_key]",
    "GHOST_API_URL":"[insert_url]"
  }'

# Step 4: Apply if preview looks correct
bun tools/env-sync/merge-env-sections.ts apply \
  ~/.claude/.env \
  "ghost-skill" \
  '{
    "GHOST_ADMIN_API_KEY":"[insert_key]",
    "GHOST_CONTENT_API_KEY":"[insert_key]",
    "GHOST_API_URL":"[insert_url]"
  }'

# Step 5: Validate the result
bun tools/env-sync/validate-env.ts ~/.claude/.env

# Step 6: Show what changed
bun tools/env-sync/diff-env.ts \
  ~/.claude/.env.backup.2026-01-18T15-59-20 \
  ~/.claude/.env
```

## Configuration Files

### .env.structure.yaml

Master specification defining all valid credentials:

```yaml
sections:
  - id: ghost-skill
    name: "Ghost Skill"
    keys:
      - name: GHOST_ADMIN_API_KEY
        type: api_key
        required: true
        description: "Ghost Admin API key"
      - name: GHOST_API_URL
        type: url
        required: true
        description: "Your Ghost blog URL"

validation:
  - section: ghost-skill
    required_keys:
      - GHOST_ADMIN_API_KEY
      - GHOST_CONTENT_API_KEY
      - GHOST_API_URL
```

## Safety Guarantees

### Non-Destructive Edits

1. **Backup First** - Always creates timestamped backup
2. **Validate Before** - Checks original file integrity
3. **Preview Changes** - Show what will be modified
4. **Apply Carefully** - Only write after user approval
5. **Validate After** - Verify structure integrity
6. **Compare Results** - Show original vs new side-by-side

### Data Integrity

- ✅ All lines preserved exactly (including comments)
- ✅ Section headers maintained
- ✅ Formatting preserved
- ✅ Blank lines kept
- ✅ Can reconstruct original from parsed data
- ✅ Automatic .gitignore management for backups

## Error Handling

### Backup Failures

```
❌ Backup failed: File not found
→ Check envPath exists
```

### Parse Failures

```
❌ Failed to parse .env file
→ Check file is valid UTF-8
→ Check file is not corrupted
```

### Validation Failures

```
❌ Failed to load .env.structure.yaml
→ Check .env.structure.yaml exists
→ Check YAML syntax is valid
```

### Merge Failures

```
❌ Apply merge failed: Invalid JSON
→ Check keysJson parameter is valid JSON
→ Check key names don't have spaces
```

## Integration with Skills

Each skill that requires credentials should:

1. **Document Requirements** in `SKILL.md` Environment Setup section
2. **Validate Setup** in `setup.ts` script:
   ```typescript
   export async function validateSetup(): Promise<SetupStatus> {
     const requiredKeys = ['GHOST_ADMIN_API_KEY', 'GHOST_API_URL'];
     const missing = requiredKeys.filter(key => !process.env[key]);
     return { success: missing.length === 0, missing };
   }
   ```
3. **Offer Setup** when credentials missing:
   ```
   → Ghost Skill credentials missing
   → Add them with: /ghost --setup
   ```

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-18 | Initial implementation: 6 core utilities, YAML validation support, comprehensive testing |

## Next Steps

- [ ] Phase 3: Apply to Ghost and Git skills
- [ ] Phase 4: Enhance /create workflow
- [ ] Phase 5: Comprehensive testing
- [ ] Phase 6: Public release

## See Also

- `.env.structure.yaml` - Specification file
- `plans/ENV-MANAGEMENT-SYSTEM-COMPREHENSIVE-PLAN.md` - Full design document
- Each skill's `SKILL.md` Environment Setup section
