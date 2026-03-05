---
name: toggle
type: utility
classification: public
description: Toggle Claude Code session settings - enable/disable destructive commands and other runtime options
version: 1.0.0
last_updated: 2026-03-04
env_required: false
env_keys: []
commands:
  - bun tools/toggle/toggle.ts
  - bun tools/toggle/toggle.ts destructive on
  - bun tools/toggle/toggle.ts destructive off
  - bun tools/toggle/toggle.ts status
related_tools:
  - tools/git
  - tools/cleanup
---

# Session Settings Toggle

**Type:** Utility
**Classification:** 🌍 PUBLIC

---

## Purpose

Enable or disable runtime settings for Claude Code sessions.

## Usage

```bash
# Show current status
bun tools/toggle/toggle.ts

# Enable destructive commands (rm -rf, git reset --hard, etc.)
bun tools/toggle/toggle.ts destructive on

# Disable destructive commands
bun tools/toggle/toggle.ts destructive off

# Toggle verbose mode
bun tools/toggle/toggle.ts verbose on
```

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `destructive` | Allow rm -rf, git reset --hard, etc. | OFF |
| `verbose` | Show detailed tool execution | OFF |

## Implementation

The tool modifies `.claude/settings.json` to persist across sessions. A pre-command hook then reads this setting to allow or block destructive Bash commands.
