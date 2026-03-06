---
name: env-sync
type: utility
classification: public
description: Safe .env file management - intelligent merging, section-based organization, backup/restore, validation against schema
version: 1.0.0
last_updated: 2026-02-14
env_required: false
env_keys: []
commands:
  - bun tools/env-sync/backup-env.ts <path>
  - bun tools/env-sync/parser-env.ts <path>
  - bun tools/env-sync/validate-env.ts <path>
  - bun tools/env-sync/merge-env-sections.ts <action> <path> <section> <keys>
  - bun tools/env-sync/diff-env.ts <original> <modified>
  - bun tools/env-sync/integration-test.ts
related_tools:
  - tools/utils/env-validator
  - skills/create
  - .env.structure.yaml
---

# Environment Management System

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

---

## Classification

**PUBLIC** - Safe .env file management utilities.

**Why Public:**
- Standard environment file patterns (parsing, validation, merging)
- No proprietary logic - YAML-based configuration schema
- Useful for skill developers managing credentials
- Well-documented safety guarantees and workflow

---

## Purpose

Complete toolkit for safe, intelligent management of `.env` files organized by skill. Provides backup, parsing, validation, merging, diffing, and testing utilities with full safety guarantees to prevent credential loss or corruption.

**Core Capabilities:**
- **Backup/restore**: Timestamped backups with verification
- **Section parsing**: Parse .env into skill-based sections while preserving formatting
- **Validation**: Verify against `.env.structure.yaml` specification
- **Intelligent merging**: Update sections without data loss
- **Diff comparison**: Show what changed between versions
- **Integration testing**: End-to-end workflow verification

**Use Cases:**
- **Skill credential setup**: Add credentials when /setup commands run
- **Environment updates**: Safely add/update keys for new integrations
- **Migration**: Move credentials between environments
- **Auditing**: Verify all required credentials present
- **Rollback**: Restore from backups after errors

---

## Usage

### Backup Before Any Edit

**Create timestamped backup:**
```bash
bun tools/env-sync/backup-env.ts /home/groves/.claude/.env

# Output:
# ✅ Backup created successfully
#    Original: /home/groves/.claude/.env
#    Backup:   /home/groves/.claude/.env.backup.2026-02-14T17-25-33
#    Size:     9448 bytes
#    Status:   ✓ Verified
```

**Backup format:** `{path}.backup.{ISO-8601-timestamp}`

**Automatic .gitignore:** Adds `.env.backup*` pattern automatically

---

### Parse Current Structure

**View sections without modification:**
```bash
bun tools/env-sync/parser-env.ts /home/groves/.claude/.env

# Output:
# SECTIONS:
#   Total: 13
#
#   ghost-skill:
#     Name: Ghost Skill
#     Keys: 5
#       GHOST_ADMIN_API_KEY: (set)
#       GHOST_CONTENT_API_KEY: (set)
#       GHOST_API_URL: (set)
#       GHOST_BLOG_NAME: (set)
#       GHOST_BLOG_DESCRIPTION: (set)
#
#   git-skill:
#     Name: Git Skill
#     Keys: 3
#       GITHUB_TOKEN: (set)
#       GITHUB_USERNAME: (set)
#       GITHUB_EMAIL: (set)
#
# [...]
#
# Total Keys: 47
```

**Line types preserved:**
- `section` - Section headers (# SKILL NAME)
- `key-value` - KEY=VALUE pairs
- `comment` - Comment lines
- `empty` - Empty lines

---

### Validate Against Specification

**Check required keys present:**
```bash
bun tools/env-sync/validate-env.ts /home/groves/.claude/.env

# Output:
# Keys Found: 47
# Status: ✅ VALID
#
# ERRORS (0):
#
# WARNINGS (20):
#   ⚠️  Unknown key: VPS_name (not in specification)
#   ⚠️  Unknown key: VPS_host_old (not in specification)
#   [...]
#
# Required Keys (from .env.structure.yaml):
#   ✓ OPENROUTER_API_KEY (core-framework)
#   ✓ GITHUB_TOKEN (git-skill)
#   ✓ GHOST_ADMIN_API_KEY (ghost-skill)
#   [...]
```

**Checks performed:**
- Required keys exist
- Key names match specification
- Detects unknown/deprecated keys
- Returns detailed validation report

---

### Merge New Keys (Preview)

**Show what would change:**
```bash
bun tools/env-sync/merge-env-sections.ts preview \
  /home/groves/.claude/.env \
  "test-skill" \
  '{"TEST_KEY":"test_value","TEST_URL":"https://example.com"}'

# Output:
# 📊 PREVIEW: What would be added/modified
#
# Section: test-skill
# Action: Add new section
#
# Changes:
#   + TEST_KEY=test_value
#   + TEST_URL=https://example.com
#
# Original line count: 221
# New line count: 226
#
# ℹ️  No changes written (preview mode)
```

---

### Merge New Keys (Apply)

**Apply changes with automatic backup:**
```bash
bun tools/env-sync/merge-env-sections.ts apply \
  /home/groves/.claude/.env \
  "test-skill" \
  '{"TEST_KEY":"[insert_key]","TEST_URL":"[insert_url]"}'

# Output:
# 💾 Creating backup...
#    Backup: /home/groves/.claude/.env.backup.2026-02-14T17-26-15
#
# 🔄 Applying merge...
#    Section: test-skill
#    Action: Add new section
#
# ✅ Successfully applied merge: 2 new + 0 updated
#    Original line count: 221
#    New line count: 226
#    Added keys: TEST_KEY, TEST_URL
#    Modified keys: (none)
```

**Safety features:**
- Automatic backup before write
- Validates JSON input
- Preserves all existing sections
- Maintains formatting and comments

---

### Compare Versions (Diff)

**Show what changed:**
```bash
bun tools/env-sync/diff-env.ts \
  /home/groves/.claude/.env.backup.2026-02-14T17-25-33 \
  /home/groves/.claude/.env

# Output:
# 📊 Summary: +2 added
#
# ✅ ADDED:
#   + [test-skill] TEST_KEY=****
#   + [test-skill] TEST_URL=https://...
#
# 📁 AFFECTED SECTIONS:
#   ✨ test-skill
#
# 🔐 Security: Credential values masked
```

**Features:**
- Shows added, removed, modified keys
- Masks credential values
- Groups by section
- Human-readable format

---

### Integration Testing

**Test complete workflow:**
```bash
bun tools/env-sync/integration-test.ts

# Output:
# 🧪 Environment Management System - Integration Tests
# ═══════════════════════════════════════════════════
#
# Test 1: Backup creation........................ ✅ PASS
# Test 2: Parse structure......................... ✅ PASS
# Test 3: Merge section (in-memory)............... ✅ PASS
# Test 4: Validate structure...................... ✅ PASS
# Test 5: Diff comparison......................... ✅ PASS
#
# ═══════════════════════════════════════════════════
# Results: 5 pass, 0 fail, 0 warn
# ═══════════════════════════════════════════════════
```

---

### Programmatic Usage

**Backup:**
```typescript
import { backupEnv } from '@/tools/env-sync/backup-env';

const result = backupEnv('/home/groves/.claude/.env');
if (result.success) {
  console.log(`Backup created: ${result.backupPath}`);
}
```

**Parse:**
```typescript
import { parseEnvFile } from '@/tools/env-sync/parser-env';

const parsed = parseEnvFile('/home/groves/.claude/.env');
if (parsed) {
  console.log(`Found ${parsed.sections.size} sections`);

  for (const [key, section] of parsed.sections) {
    console.log(`${section.name}: ${section.keys.size} keys`);
  }
}
```

**Validate:**
```typescript
import { validateEnv } from '@/tools/env-sync/validate-env';

const result = validateEnv('/home/groves/.claude/.env');
console.log(`Status: ${result.valid ? 'VALID' : 'INVALID'}`);
console.log(`Errors: ${result.errors.length}`);
console.log(`Warnings: ${result.warnings.length}`);
```

**Merge:**
```typescript
import { mergeSectionKeys, reconstructEnv } from '@/tools/env-sync/merge-env-sections';
import { parseEnvFile } from '@/tools/env-sync/parser-env';

const parsed = parseEnvFile('/home/groves/.claude/.env');
if (!parsed) throw new Error('Parse failed');

const newKeys = new Map([
  ['TEST_KEY', '[insert_key]'],
  ['TEST_URL', 'https://example.com']
]);

const mergeResult = mergeSectionKeys(
  parsed.allLines,
  'test-skill',
  newKeys,
  { preserveComments: true, preserveOrder: true, appendIfNotExists: true }
);

const newContent = reconstructEnv(mergeResult.lines);
// Write newContent to file
```

---

## Configuration

### .env.structure.yaml

**Master specification for all credentials:**
```yaml
sections:
  - id: core-framework
    name: "Core Framework"
    keys:
      - name: OPENROUTER_API_KEY
        type: api_key
        required: true
        description: "OpenRouter API key for multi-model routing"

  - id: ghost-skill
    name: "Ghost Skill"
    keys:
      - name: GHOST_ADMIN_API_KEY
        type: api_key
        required: true
        description: "Ghost Admin API key"
      - name: GHOST_CONTENT_API_KEY
        type: api_key
        required: false
        description: "Ghost Content API key (read-only)"
      - name: GHOST_API_URL
        type: url
        required: true
        description: "Your Ghost blog URL"

  - id: git-skill
    name: "Git Skill"
    keys:
      - name: GITHUB_TOKEN
        type: token
        required: true
        description: "GitHub personal access token"

validation:
  - section: core-framework
    required_keys:
      - OPENROUTER_API_KEY

  - section: ghost-skill
    required_keys:
      - GHOST_ADMIN_API_KEY
      - GHOST_API_URL

  - section: git-skill
    required_keys:
      - GITHUB_TOKEN
```

**Key types:**
- `api_key` - API authentication keys
- `token` - Access tokens (OAuth, PAT)
- `url` - Service URLs/endpoints
- `string` - Generic string values
- `number` - Numeric values
- `boolean` - True/false flags

---

### Section Format

**.env file organization:**
```bash
# 🧠 CORE FRAMEWORK
OPENROUTER_API_KEY=[insert_key]
ANTHROPIC_API_KEY=[insert_key]

# 👻 GHOST SKILL
GHOST_ADMIN_API_KEY=[insert_key]
GHOST_CONTENT_API_KEY=[insert_key]
GHOST_API_URL=[insert_url]
GHOST_BLOG_NAME=[insert_name]
GHOST_BLOG_DESCRIPTION=[insert_description]

# 🔧 GIT SKILL
GITHUB_TOKEN=[insert_token]
GITHUB_USERNAME=[insert_username]
GITHUB_EMAIL=[insert_email]
```

**Section headers:**
- Start with `#` followed by optional emoji
- Uppercase section name
- Parser converts to lowercase-hyphenated key (e.g., "GHOST SKILL" → "ghost-skill")

---

## API Reference

### backupEnv()

#### `backupEnv(envPath: string): BackupResult`

Create timestamped backup with verification.

**Parameters:**
- `envPath` - Absolute path to .env file

**Returns:**
```typescript
interface BackupResult {
  success: boolean;
  backupPath?: string;    // Path to created backup
  originalSize?: number;   // Original file size in bytes
  verified?: boolean;      // Backup content matches original
  error?: string;
}
```

**Backup naming:** `{path}.backup.{YYYY-MM-DDTHH-MM-SS}`

---

### parseEnvFile()

#### `parseEnvFile(envPath: string): ParsedEnv | null`

Parse .env into structured sections.

**Parameters:**
- `envPath` - Absolute path to .env file

**Returns:**
```typescript
interface ParsedEnv {
  sections: Map<string, EnvSection>;  // Sections keyed by ID
  allLines: EnvLine[];                // All lines in order
  rawContent: string;                 // Original file content
}

interface EnvSection {
  name: string;                       // Display name ("Ghost Skill")
  header?: string;                    // Section header line
  lines: EnvLine[];                   // Lines in this section
  keys: Map<string, string>;          // Key-value pairs
}

interface EnvLine {
  type: 'comment' | 'section' | 'key-value' | 'empty';
  raw: string;                        // Original line text
  key?: string;                       // For key-value and section lines
  value?: string;                     // For key-value lines
  comment?: string;                   // For comment lines
}
```

---

### validateEnv()

#### `validateEnv(envPath: string): ValidationResult`

Validate against .env.structure.yaml specification.

**Parameters:**
- `envPath` - Absolute path to .env file

**Returns:**
```typescript
interface ValidationResult {
  valid: boolean;
  keysFound: number;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

interface ValidationError {
  type: 'missing_required_key' | 'invalid_format';
  message: string;
  section?: string;
  key?: string;
}

interface ValidationWarning {
  type: 'unknown_key' | 'deprecated_key';
  message: string;
  key: string;
}
```

---

### mergeSectionKeys()

#### `mergeSectionKeys(lines, sectionKey, newKeys, options): MergeResult`

Merge keys into section without data loss.

**Parameters:**
```typescript
lines: EnvLine[]                    // Parsed lines from parseEnvFile()
sectionKey: string                  // Section ID ("ghost-skill")
newKeys: Map<string, string>        // Keys to add/update
options: MergeOptions = {
  preserveComments: true,           // Keep all comments
  preserveOrder: true,              // Maintain line order
  appendIfNotExists: true           // Add section if not found
}
```

**Returns:**
```typescript
interface MergeResult {
  success: boolean;
  message: string;
  originalLineCount?: number;
  newLineCount?: number;
  addedKeys?: string[];             // Keys added
  modifiedKeys?: string[];          // Keys updated
  sectionFound?: boolean;
  newSectionAdded?: boolean;
  error?: string;
}
```

---

### reconstructEnv()

#### `reconstructEnv(lines: EnvLine[]): string`

Reconstruct .env file from parsed lines.

**Parameters:**
- `lines` - Array of EnvLine objects

**Returns:** Complete .env file content as string

**Preserves:**
- All formatting
- All comments
- Empty lines
- Line order

---

### diffEnv()

#### `diffEnv(originalPath: string, modifiedPath: string): DiffResult`

Compare two .env versions.

**Parameters:**
- `originalPath` - Path to original .env
- `modifiedPath` - Path to modified .env

**Returns:**
```typescript
interface DiffResult {
  added: KeyChange[];
  removed: KeyChange[];
  modified: KeyChange[];
  affectedSections: string[];
}

interface KeyChange {
  section: string;
  key: string;
  oldValue?: string;    // Masked for security
  newValue?: string;    // Masked for security
}
```

---

## Architecture

### Complete Workflow Flow

```
User adds Ghost credentials
   ↓
1. Backup current .env
   backupEnv(/home/groves/.claude/.env)
   → /home/groves/.claude/.env.backup.2026-02-14T17-25-33
   Verify: backup content === original
   ↓
2. Parse current structure
   parseEnvFile(/home/groves/.claude/.env)
   → ParsedEnv {sections, allLines, rawContent}
   Identify sections by header comments
   Extract all key-value pairs
   ↓
3. Preview merge (in-memory)
   newKeys = {
     "GHOST_ADMIN_API_KEY": "[insert_key]",
     "GHOST_CONTENT_API_KEY": "[insert_key]",
     "GHOST_API_URL": "[insert_url]"
   }
   mergeSectionKeys(allLines, "ghost-skill", newKeys)
   Show: what would be added/modified
   ↓
4. Apply merge (write to disk)
   reconstructEnv(mergedLines)
   writeFileSync(/home/groves/.claude/.env, newContent)
   ↓
5. Validate result
   validateEnv(/home/groves/.claude/.env)
   Check: all required keys present
   Check: structure integrity
   ↓
6. Compare versions
   diffEnv(backupPath, /home/groves/.claude/.env)
   Show: added/removed/modified keys
```

---

### Section Detection Algorithm

```
For each line in .env:
   ↓
Is line empty?
   YES → {type: 'empty', raw: line}
   NO → Continue
   ↓
Does line start with '#'?
   YES → Is it section header?
      Match pattern: /#\s+(?:emoji\s)*([A-Z][A-Z0-9\s\-]+)/
      YES → {type: 'section', key: normalized-name, comment: line}
      NO → {type: 'comment', comment: line}
   NO → Continue
   ↓
Does line contain '='?
   YES → Split on first '='
      {type: 'key-value', key: before, value: after, raw: line}
   NO → {type: 'comment', raw: line}
```

---

### Merge Strategy

```
mergeSectionKeys(lines, "ghost-skill", newKeys)
   ↓
1. Find section
   Scan for: line.type === 'section' && line.key === 'ghost-skill'
   Found? → sectionStartIndex = i
   ↓
2. Find section end
   Scan from startIndex+1 until:
      - Next section header, OR
      - End of file
   sectionEndIndex = j
   ↓
3. Map existing keys
   For lines[sectionStartIndex:sectionEndIndex]:
      If type === 'key-value':
         existingKeys.set(key, lineIndex)
   ↓
4. Merge new keys
   For each (key, value) in newKeys:
      If existingKeys.has(key):
         → Update: lines[lineIndex] = {type: 'key-value', key, value}
      Else:
         → Add: Insert new line before sectionEndIndex
   ↓
5. Handle missing section
   If section not found && appendIfNotExists:
      Append: empty line
      Append: section header
      Append: all new keys
   ↓
Return: {lines, addedKeys[], modifiedKeys[], sectionFound}
```

---

## Scripts

### Complete Ghost Credential Setup

```bash
#!/bin/bash
# Add Ghost credentials safely

ENV_PATH="/home/groves/.claude/.env"
SECTION="ghost-skill"

# Step 1: Backup
echo "Creating backup..."
bun tools/env-sync/backup-env.ts "$ENV_PATH"

# Step 2: Parse current state
echo "Current state:"
bun tools/env-sync/parser-env.ts "$ENV_PATH"

# Step 3: Preview changes
echo "Preview:"
bun tools/env-sync/merge-env-sections.ts preview \
  "$ENV_PATH" \
  "$SECTION" \
  '{
    "GHOST_ADMIN_API_KEY":"[insert_key]",
    "GHOST_CONTENT_API_KEY":"[insert_key]",
    "GHOST_API_URL":"[insert_url]",
    "GHOST_BLOG_NAME":"[insert_name]",
    "GHOST_BLOG_DESCRIPTION":"[insert_description]"
  }'

# Step 4: Confirm with user
read -p "Apply changes? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
  # Step 5: Apply
  echo "Applying..."
  bun tools/env-sync/merge-env-sections.ts apply \
    "$ENV_PATH" \
    "$SECTION" \
    '{
      "GHOST_ADMIN_API_KEY":"[insert_key]",
      "GHOST_CONTENT_API_KEY":"[insert_key]",
      "GHOST_API_URL":"[insert_url]",
      "GHOST_BLOG_NAME":"[insert_name]",
      "GHOST_BLOG_DESCRIPTION":"[insert_description]"
    }'

  # Step 6: Validate
  echo "Validating..."
  bun tools/env-sync/validate-env.ts "$ENV_PATH"

  # Step 7: Show diff
  echo "Changes:"
  BACKUP=$(ls -t "$ENV_PATH".backup.* | head -1)
  bun tools/env-sync/diff-env.ts "$BACKUP" "$ENV_PATH"
fi
```

---

### Skill Setup Integration

```typescript
// skills/ghost/scripts/setup.ts
import { mergeSectionKeys, reconstructEnv } from '@/tools/env-sync/merge-env-sections';
import { parseEnvFile } from '@/tools/env-sync/parser-env';
import { backupEnv } from '@/tools/env-sync/backup-env';
import { writeFileSync } from 'fs';

export async function setupGhostCredentials() {
  const ENV_PATH = '/home/groves/.claude/.env';

  // Backup first
  const backup = backupEnv(ENV_PATH);
  if (!backup.success) {
    throw new Error(`Backup failed: ${backup.error}`);
  }

  // Parse current
  const parsed = parseEnvFile(ENV_PATH);
  if (!parsed) {
    throw new Error('Failed to parse .env');
  }

  // Merge new keys
  const newKeys = new Map([
    ['GHOST_ADMIN_API_KEY', '[insert_key]'],
    ['GHOST_CONTENT_API_KEY', '[insert_key]'],
    ['GHOST_API_URL', '[insert_url]'],
    ['GHOST_BLOG_NAME', '[insert_name]'],
    ['GHOST_BLOG_DESCRIPTION', '[insert_description]']
  ]);

  const result = mergeSectionKeys(
    parsed.allLines,
    'ghost-skill',
    newKeys,
    { preserveComments: true, preserveOrder: true, appendIfNotExists: true }
  );

  // Write
  const newContent = reconstructEnv(result.lines);
  writeFileSync(ENV_PATH, newContent, 'utf-8');

  console.log(`✅ Added ${result.addedKeys?.length || 0} keys to ghost-skill section`);
  console.log(`ℹ️  Backup: ${backup.backupPath}`);

  return { success: true, backup: backup.backupPath };
}
```

---

## Dependencies

### Runtime

**External:** None (uses Bun built-ins)

**Internal:**
- Node.js `fs`, `path` modules
- Bun runtime
- YAML parsing (for .env.structure.yaml)

### Framework Integration

**Used By:**
- `skills/create/` - Add credentials during skill creation
- `skills/ghost/scripts/setup.ts` - Ghost credential setup
- `tools/git/scripts/setup.ts` - Git credential setup
- `/setup` commands - Credential configuration

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/create/` — calls merge-env-sections.ts when adding credentials for a new skill
- `skills/ghost/scripts/setup.ts` — uses mergeSectionKeys to add Ghost credentials
- `tools/git/scripts/setup.ts` — uses mergeSectionKeys for Git credential setup

No direct TypeScript importers in hooks — invoked via CLI from setup commands.

**File Structure:**
```
tools/env-sync/
├── backup-env.ts                  # Timestamped backups
├── parser-env.ts                  # Section-based parsing
├── validate-env.ts                # Schema validation
├── merge-env-sections.ts          # Intelligent merging
├── diff-env.ts                    # Version comparison
├── integration-test.ts            # End-to-end testing
├── README.md                      # Original documentation
└── TOOL.md                        # This file
```

---

## Troubleshooting

### "File not found" during backup

**Cause:** Invalid .env path

**Fix:**
```bash
# Check path exists
ls -la /home/groves/.claude/.env

# Use correct path
bun tools/env-sync/backup-env.ts /home/groves/.claude/.env
```

---

### "Failed to parse .env file"

**Cause:** Invalid UTF-8 or corrupted file

**Debug:**
```bash
# Check encoding
file /home/groves/.claude/.env
# Should show: ASCII text or UTF-8 Unicode text

# Check for corruption
cat /home/groves/.claude/.env | head -20
```

**Fix:**
```bash
# Restore from backup if corrupted
cp /home/groves/.claude/.env.backup.2026-02-14T17-25-33 /home/groves/.claude/.env
```

---

### "Validation failed: Missing required key"

**Cause:** .env missing keys required by .env.structure.yaml

**Debug:**
```bash
# Show validation details
bun tools/env-sync/validate-env.ts /home/groves/.claude/.env

# Check specification
cat .env.structure.yaml | grep -A 5 "required: true"
```

**Fix:**
```bash
# Add missing keys
bun tools/env-sync/merge-env-sections.ts apply \
  /home/groves/.claude/.env \
  "skill-name" \
  '{"REQUIRED_KEY":"[insert_value]"}'
```

---

### "Merge failed: Invalid JSON"

**Cause:** Malformed JSON in keys parameter

**Debug:**
```bash
# Test JSON validity
echo '{"KEY":"value"}' | jq .
```

**Fix:**
```bash
# Proper JSON format (no trailing commas, quoted strings)
bun tools/env-sync/merge-env-sections.ts apply \
  /home/groves/.claude/.env \
  "skill" \
  '{"KEY1":"value1","KEY2":"value2"}'  # ✓ Valid

# NOT:
# '{"KEY1":"value1","KEY2":"value2",}'  # ✗ Trailing comma
# '{"KEY1":value1}'                      # ✗ Unquoted value
```

---

### Section not detected during merge

**Cause:** Section header format doesn't match parser pattern

**Debug:**
```bash
# Check section headers in .env
grep "^#" /home/groves/.claude/.env

# Parser expects:
# # SKILL NAME
# # 👻 GHOST SKILL
# # 🔧 GIT SKILL

# NOT:
# #SKILL NAME    (missing space)
# # skill name   (lowercase)
# ## SKILL NAME  (double ##)
```

**Fix:**
```bash
# Correct section header format
# Add emoji (optional) + space + UPPERCASE NAME
echo "# 👻 GHOST SKILL" >> /home/groves/.claude/.env
```

---

### ".env.structure.yaml not found" during validation

**Cause:** Missing or misplaced specification file

**Fix:**
```bash
# Check file exists in framework root
ls -la ~/ia-framework/.env.structure.yaml

# If missing, restore from framework update
# Or create based on template
```

---

### Backup accumulation (too many .backup files)

**Not an error** - backups are intentionally kept for safety

**Cleanup (careful!):**
```bash
# List backups by age
ls -lt /home/groves/.claude/.env.backup.* | head -10

# Remove backups older than 30 days
find /home/groves/.claude -name ".env.backup.*" -mtime +30 -delete

# Or keep only last 10 backups
ls -t /home/groves/.claude/.env.backup.* | tail -n +11 | xargs rm
```

---

## Related Tools

- **tools/utils/env-validator** - Zod schema validation
- **skills/create** - Skill creation wizard (credential setup)
- **.env.structure.yaml** - Credential specification
- **tools/utils/path-resolution** - Framework root resolution

---

## Version History

### 1.0.0 (2026-01-18)
- ✅ 6 core utilities (backup, parse, validate, merge, diff, test)
- ✅ Section-based organization preserving formatting
- ✅ YAML-based validation against .env.structure.yaml
- ✅ Intelligent merging without data loss
- ✅ Timestamped backups with verification
- ✅ Security-conscious diffing (masked values)
- ✅ Comprehensive integration testing
- ✅ Automatic .gitignore management

---

## References

- **.env.structure.yaml**: Credential specification schema
- **ENV-MANAGEMENT-SYSTEM-COMPREHENSIVE-PLAN.md**: Full design document
- **Skill SKILL.md files**: Environment Setup sections
- **12-Factor App**: https://12factor.net/config (environment configuration principles)
