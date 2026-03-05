---
title: Hook Updates Migration Template
status: reference
severity: template
type: reference
---

# Hook Updates Migration Template

Use this template when documenting hook updates.

---

## What's Changing

**Description of hook changes in this release.**

### Hooks Affected

| Hook | Change | Impact | Migration |
|------|--------|--------|-----------|
| hook-name | Updated | [Automatic/Manual] | See below |
| hook-name | Added | Framework | Automatic |
| hook-name | Deprecated | User custom | Keep working |

### Hook Security Classification

This update includes:
- 🔴 **Security-Critical:** credential-guardian.ts (ALWAYS update)
- 🟡 **Recommended:** validate-frontmatter.ts (recommended)
- 🟢 **Optional:** tool-tracker.ts (update when convenient)

## Automatic vs Manual

### Automatic (Framework Hooks)
```
These hooks are in: hooks/pre-commit/ or hooks/session-*
Automatically updated via: claude /framework-update
No action needed: Just apply the update
```

### Manual (User Custom Hooks)
```
These hooks are in: skills/*/scripts/hooks/ or custom paths
Not automatically updated: Check if you have custom versions
May need manual migration: See section below
```

## Before & After

### Hook Event Configuration
```yaml
# Before
hooks:
  PreToolUse:
    - matcher: "Write"
      hooks:
        - type: "command"
          command: "bun run hooks/old-validator.ts"

# After
hooks:
  PreToolUse:
    - matcher: "Write"
      hooks:
        - type: "command"
          command: "bun run hooks/new-validator.ts"
```

## Migration Steps

### 1. Check What You Have
```bash
# View current hooks
cat settings.json | jq '.hooks'

# Backup your settings
cp settings.json settings.json.backup
```

### 2. Update Framework
```bash
# This applies new framework hooks automatically
claude /framework-update

# Verify update
cat settings.json | jq '.hooks'
```

### 3. Check For Custom Hooks
```bash
# Search for custom hooks you may have added
grep -r "scripts/hooks" .

# Example paths to check:
# - skills/*/scripts/hooks/custom-hook.ts
# - /custom/path/my-hook.ts
```

### 4. Verify Custom Hooks Still Work
```bash
# If you have custom hooks, test them
bun your-custom-hook.ts --test

# Verify settings references them
cat settings.json | jq '.hooks.PostToolUse'
```

## Preserving Custom Hooks

The merge system preserves your custom hooks:

```typescript
// Your custom hook - PRESERVED during update
{
  "type": "command",
  "command": "bun run skills/ghost/scripts/hooks/monitor-hook.ts"
}

// Framework hook - UPDATED during update
{
  "type": "command",
  "command": "bun run hooks/validate-frontmatter.ts"
}
```

## If Custom Hooks Break

### Issue: Custom hook no longer works
**Cause:** Hook may depend on framework changes
**Solution:**
1. Check hook implementation for deprecated APIs
2. Review framework changes that may affect it
3. Update hook to use new APIs
4. Test thoroughly

```bash
# Example: Updating a custom hook
cd skills/my-skill/scripts/hooks
# Edit custom-hook.ts
# Update any deprecated framework imports
bun --check custom-hook.ts  # Verify syntax
```

### Issue: Duplicate hooks after update
**Cause:** Same hook registered twice
**Solution:** The merge system deduplicates automatically
```bash
# Verify duplication is removed
cat settings.json | jq '.hooks | to_entries | map(select(.value | length > 1))'
```

## Testing Updated Hooks

### Test Framework Hooks
```bash
# Create test input
cat > /tmp/test-input.json <<'EOF'
{
  "tool_name": "Write",
  "tool_input": {"file_path": "test.md", "content": "---\ntest: true\n---"}
}
EOF

# Test hook
cat /tmp/test-input.json | bun hooks/validate-frontmatter.ts
# Should output: {"action": "allow"} or {"action": "warn", "message": "..."}
```

### Test Custom Hooks
```bash
# Replace with your custom hook path
cat /tmp/test-input.json | bun skills/your-skill/scripts/hooks/your-hook.ts
```

## Rollback if Needed

```bash
# If hooks break after update
cp settings.json.backup settings.json

# Or rollback entire framework
bun tools/claude-md-sync/rollback.ts 0

# Then diagnose the issue
```

## Common Hook Issues

### Issue: Hook throws error
```
"action": "block", "message": "Hook error: Cannot find module..."
```
**Solution:** Verify hook file path exists and has correct imports

### Issue: Hook timeout
```
Hook takes longer than timeout (usually 5 seconds)
```
**Solution:** Optimize hook code or increase timeout in settings.json

### Issue: Hook blocking legitimate operations
```
"action": "block", "message": "Validation failed"
```
**Solution:** Check hook's validation rules, may need to whitelist your use case

## Security Hooks (Always Update)

These hooks protect framework integrity:
- `credential-guardian.ts` - Prevents credential exposure
- `file-guardian.ts` - Protects critical framework files

**These CANNOT be disabled or skipped.**

If they block something:
1. Verify it's not a security issue
2. Contact framework team
3. Request exception (rare)

## Monitoring Hook Activity

```bash
# View hook execution logs
tail -f logs/hook-execution.log

# Count hook invocations
grep "hook_name" logs/hook-execution.log | wc -l

# Find errors
grep "ERROR\|error" logs/hook-execution.log
```

## Hook Update Policy

- **Framework hooks:** Updated automatically
- **User custom hooks:** Preserved automatically
- **Framework changes:** May require custom hook updates
- **Breaking changes:** Communicated in release notes

---

## Checklist

- [ ] Backed up settings.json
- [ ] Applied framework update
- [ ] Verified custom hooks still exist
- [ ] Tested critical hooks
- [ ] Checked for errors in logs
- [ ] Confirmed all hooks working

---

**Hook Migration Time:** < 5 minutes
**Difficulty:** Easy (automatic) | Medium (if custom hooks)
**Support:** See hook-specific documentation in hooks/README.md
