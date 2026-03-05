# Framework Utilities

**Portable utilities for framework maintenance and setup.**

---

## sync-hooks.ts

**Synchronizes hook symlinks from project `hooks/` to `~/.claude/hooks/`**

### Purpose

Claude Code reads hooks from `~/.claude/hooks/` but hook source files live in the project `hooks/` directory. This utility creates and maintains symlinks so:

1. Hook changes are immediately active
2. Framework works portably across all installations
3. No hardcoded paths needed

### Usage

```bash
# Create/update symlinks
bun run tools/utils/sync-hooks.ts

# Dry run (show what would happen)
bun run tools/utils/sync-hooks.ts --check
```

### What It Does

✅ Creates symlinks for all `.ts` hook files in `hooks/`
✅ Removes orphaned symlinks (where source deleted)
✅ Ensures `~/.claude/hooks/` directory exists
✅ Works portably across all installations

### Output

```
📋 Syncing 19 hooks...
✅ Symlink: anti-rationalization.ts → ~/.claude/hooks/anti-rationalization.ts
...
📊 Summary:
  ✅ Created: 5
  🗑️  Removed: 0
```

### When to Run

- **After cloning the framework** (required for hooks to work)
- **After pulling framework updates** (new/modified hooks)
- **If you see "Module not found hooks/..." errors** (missing symlinks)
- **Before committing hook changes** (pre-commit validation)

### Implementation Details

```typescript
// Reads all .ts files from hooks/
// Creates symlinks: hooks/file.ts → ~/.claude/hooks/file.ts
// Cleans up orphaned symlinks automatically
```

---

## Related

- `/setup` - Framework setup command (calls sync-hooks.ts)
- `hooks/README.md` - Hook documentation
- `hooks/pre-commit/` - Git pre-commit hooks

---

**Framework:** Intelligence Adjacent (IA)
