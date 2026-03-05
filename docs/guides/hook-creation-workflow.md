# Hook Creation Workflow

**Complete workflow for creating new framework hooks with automated validation.**

---

## Problem

When new hooks are created in `hooks/`, symlinks in `~/.claude/hooks/` aren't automatically created. This causes "Module not found" errors because Claude Code reads from `~/.claude/hooks/`.

---

## Solution: 3-Layer Protection

### 1. Utility Script (Manual Fix)

```bash
# Check which symlinks are missing (dry run)
bun run tools/utils/sync-hooks.ts --check

# Create missing symlinks and remove orphaned ones
bun run tools/utils/sync-hooks.ts
```

**When to run:**
- After creating a new hook
- After pulling framework updates
- If you see "Module not found hooks/..." errors

### 2. Pre-Commit Validation (Automated Prevention)

`hooks/pre-commit/06-validate-hook-symlinks.ts` runs before every commit and blocks if:
- Hook files exist without symlinks
- Orphaned symlinks exist (source deleted)

**What it does:**
```
✅ Validates all .ts files in hooks/ have symlinks
✅ Detects orphaned symlinks
❌ Blocks commit if validation fails
💡 Shows fix command: bun run tools/utils/sync-hooks.ts
```

### 3. Updated Documentation

`hooks/README.md` now includes:
- **CRITICAL** warning in "Creating New Hooks" section
- Explanation of why symlinks are needed
- Instructions for running sync-hooks.ts

---

## Complete Workflow: Creating a New Hook

1. **Create hook file**
   ```bash
   # Create the TypeScript file
   touch hooks/my-new-hook.ts
   chmod +x hooks/my-new-hook.ts
   ```

2. **Implement hook logic**
   - Read JSON from stdin (tool_name, tool_input)
   - Output JSON response to stdout
   - Return appropriate exit code (0=allow, 1=warn, 2=block)

3. **Add to settings.json**
   ```json
   {
     "hooks": {
       "PreToolUse": [
         {
           "matcher": "Write",
           "hooks": [
             { "type": "command", "command": "bun run hooks/my-new-hook.ts" }
           ]
         }
       ]
     }
   }
   ```

4. **Create symlink**
   ```bash
   bun run tools/utils/sync-hooks.ts
   ```

5. **Commit**
   ```bash
   git add hooks/my-new-hook.ts
   git commit -m "Add my-new-hook validation"
   # Pre-commit hook validates symlink exists ✅
   ```

---

## Architecture

```
Framework Hook Flow:
┌─────────────────────────────────────┐
│ ~/ia-framework-private/hooks/       │ ← Source files (git tracked)
│   ├── anti-rationalization.ts       │
│   ├── bash-command-validator.ts     │
│   └── my-new-hook.ts                │
└─────────────────────────────────────┘
              ↓ symlinks
┌─────────────────────────────────────┐
│ ~/.claude/hooks/                    │ ← Claude Code reads from here
│   ├── anti-rationalization.ts  →   │
│   ├── bash-command-validator.ts →  │
│   └── my-new-hook.ts  →             │
└─────────────────────────────────────┘
              ↓ settings.json
┌─────────────────────────────────────┐
│ Claude Code Hook System              │
│   - Reads from ~/.claude/hooks/     │
│   - Executes: bun run hooks/X.ts    │
│   - Returns: allow/warn/block        │
└─────────────────────────────────────┘
```

---

## Files Created

1. **`tools/utils/sync-hooks.ts`**
   - Syncs all hook files to ~/.claude/hooks/
   - Creates missing symlinks
   - Removes orphaned symlinks
   - Dry-run mode: `--check` flag

2. **`hooks/pre-commit/06-validate-hook-symlinks.ts`**
   - Validates symlinks exist before commit
   - Blocks commit if validation fails
   - Shows fix command

3. **`docs/guides/hook-creation-workflow.md`** (this file)
   - Complete workflow documentation
   - Architecture diagram
   - Troubleshooting guide

---

## Files Modified

1. **`hooks/README.md`**
   - Added **CRITICAL** warning to "Creating New Hooks"
   - Added "Sync Hook Symlinks" section
   - Added "When to run" guidance

---

## Troubleshooting

### Error: Module not found "hooks/X.ts"

**Cause:** Symlink missing in `~/.claude/hooks/`

**Fix:**
```bash
bun run tools/utils/sync-hooks.ts
```

### Pre-commit hook blocks: "Missing symlinks"

**Cause:** Hook file exists without symlink

**Fix:**
```bash
bun run tools/utils/sync-hooks.ts
git add -u  # If symlinks changed
git commit  # Try again
```

### Orphaned symlinks detected

**Cause:** Hook source file deleted but symlink remains

**Fix:**
```bash
# Sync script automatically removes orphaned symlinks
bun run tools/utils/sync-hooks.ts
```

---

## Testing

```bash
# Test sync script dry-run
bun run tools/utils/sync-hooks.ts --check

# Test pre-commit validator
bun run hooks/pre-commit/06-validate-hook-symlinks.ts

# Test end-to-end (create hook, sync, commit)
touch hooks/test-hook.ts
bun run tools/utils/sync-hooks.ts
git add hooks/test-hook.ts
git commit -m "Test hook workflow"
```

---

## Related

- `hooks/README.md` - Hook documentation
- `hooks/HOOKS-INVENTORY.md` - Complete hook inventory
- `tools/setup/install-framework.ts` - Initial symlink creation during install
- `.git/hooks/pre-commit` - Git pre-commit orchestrator

---

**Version:** 1.0.0
**Last Updated:** 2026-02-15
**Author:** Framework Security Hardening (Session a7e940b1)
