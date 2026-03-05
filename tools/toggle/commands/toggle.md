---
name: toggle
description: Toggle Claude Code session settings - enable/disable destructive commands
tool: toggle
agent: base
classification: public
---

# /toggle - Session Settings Toggle

**Enable or disable runtime settings for Claude Code sessions.**

---

## Usage

```bash
# Show current status
bun tools/toggle/toggle.ts

# Enable destructive commands (rm -rf, git reset --hard, etc.)
bun tools/toggle/toggle.ts destructive on

# Disable destructive commands
bun tools/toggle/toggle.ts destructive off
```

## Settings

| Setting | Description | Default |
|---------|-------------|---------|
| `destructive` | Allow rm -rf, git reset --hard, etc. | OFF |
| `verbose` | Show detailed tool execution | OFF |

## Implementation

The tool modifies `.claude/settings.json` to persist across sessions. A pre-command hook then reads this setting to allow or block destructive Bash commands.

**Triggers:** "toggle", "destructive on", "destructive off", "enable destructive", "disable destructive"

---

**Version:** 1.0.0
**Last Updated:** 2026-03-04
