---
title: Session Tracking Path Inconsistency - Migration Guide
status: critical
severity: critical
type: security_fix
date: 2026-02-04
---

# Session Tracking Fix - Migration Guide

**Status:** Critical Security Update
**Type:** Security Fix
**Action Required:** Update immediately

## What Changed

A critical security vulnerability was fixed in session tracking where different components were reading session files from inconsistent paths. This could cause accidental credential logging to the wrong session file.

### Before (Vulnerable)
- Some hooks read session files from `~/.claude/sessions/`
- Monitor dashboard read from a different location
- Could log credentials to unintended session files

### After (Fixed)
- All components use unified `framework-path-resolver.ts`
- Single source of truth for framework root path
- Priority: `IA_FRAMEWORK_ROOT` env var → CLAUDE.md symlink → ~/.claude fallback

## Why This Matters

Session files may contain sensitive information from tool outputs. Logging to the wrong session file could:
- Expose credentials to unintended locations
- Break session history tracking
- Cause confusion in multi-framework setups

## How to Update

### Quick Update
```bash
claude /framework-update --check
# See the security fix in the CRITICAL section
claude /framework-update
# Accept the update (recommended)
```

### Manual Verification

After updating, verify the fix:

```bash
# Check that framework root detection works
echo $IA_FRAMEWORK_ROOT  # Should be empty or your custom path

# Verify session files are in correct location
ls -la ~/.claude/sessions/
# Should show session YAML and MD files
```

### Multi-Framework Setup

If you run multiple IA Framework instances:

```bash
# Set explicit framework root to avoid conflicts
export IA_FRAMEWORK_ROOT=/path/to/your/ia-framework
claude /framework-update
```

## If Something Goes Wrong

### Session files in wrong location
```bash
# Sessions should always be in ~/.claude/sessions/
# If you find sessions elsewhere, move them:
mv /wrong/path/sessions/*.yaml ~/.claude/sessions/
```

### Rollback to previous version
```bash
# List available backups
bun tools/claude-md-sync/list-backups.ts

# Restore previous version
bun tools/claude-md-sync/rollback.ts 0
```

## Technical Details

### Files Modified
- `tools/framework/utils/path-resolution.ts` - Unified resolver
- `hooks/session-start.ts` - Uses shared resolver
- `hooks/session-end.ts` - Uses shared resolver
- `tools/monitor/server.ts` - Uses shared resolver

### Resolution Priority
1. `IA_FRAMEWORK_ROOT` environment variable (highest priority)
2. CLAUDE.md symlink detection
3. `~/.claude` fallback (lowest priority)

### What It Protects
- Session history accuracy
- Credential security
- Multi-framework compatibility
- Framework portability

## Questions?

If you encounter issues:

1. Check that `~/.claude` exists and contains `CLAUDE.md`
2. Verify session files are in `~/.claude/sessions/`
3. Ensure no `IA_FRAMEWORK_ROOT` conflicts
4. Review logs: `tail logs/validation/session-*.log`

---

**Last Updated:** 2026-02-04
**Security Impact:** High
**User Action Required:** Yes
