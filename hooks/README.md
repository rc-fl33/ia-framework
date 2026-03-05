# Framework Hooks

**TypeScript hooks for automated validation and enforcement.**

All hooks run via `bun run hooks/<hook>.ts` and are configured in `settings.json`.

---

## Hook Types

### Claude Code Hooks (settings.json)

These hooks run automatically when Claude Code executes tools.

| Event | Description |
|-------|-------------|
| `SessionStart` | When a new Claude session begins |
| `SessionEnd` | When a Claude session ends |
| `PreToolUse` | Before a tool executes (can block/warn) |
| `PostToolUse` | After a tool executes |

### Git Pre-Commit Hooks

These run before git commits. Located in `hooks/pre-commit/`.

---

## Active Hooks

### Session Lifecycle

| Hook | Event | Purpose |
|------|-------|---------|
| `session-start.ts` | SessionStart | Initialize session tracking |
| `session-end.ts` | SessionEnd | Save session state, cleanup |

### Validation (PreToolUse)

| Hook | Matcher | Purpose |
|------|---------|---------|
| `credential-guardian.ts` | Read | **SECURITY**: Block Read access to credential files (.env, keys, tokens) |
| `validate-frontmatter.ts` | Write | Validate YAML frontmatter in .md files |
| `skill-structure-validator.ts` | Write | Validate skill directory structure |
| `file-guardian.ts` | Write | Protect critical files from modification |
| `enforce-workflow.ts` | * | Enforce workflow compliance |
| `skill-hook-loader.ts` | * | Dispatch to active skill's custom hooks |
| `checklist-enforcer.ts` | Bash | Enforce pre-flight checklists |
| `test-validator.ts` | Bash | Validate test execution |
| `bash-command-validator.ts` | Bash | Validate bash commands |
| `enforce-package-manager.ts` | Bash | Enforce bun as package manager |
| `active-work-limiter.ts` | * | Limit concurrent active work |
| `anti-rationalization.ts` | * | Prevent rationalized shortcuts |
| `ghost-workflow-guard.ts` | * | Guard ghost blog workflow |
| `tool-usage-optimizer.ts` | * | Optimize tool usage patterns |

### Context Loading (PostToolUse)

| Hook | Matcher | Purpose |
|------|---------|---------|
| `agent-loader.ts` | Read | Load agent context when agents referenced |
| `skill-loader.ts` | Read | Load skill context + checklist when SKILL.md read |
| `tool-tracker.ts` | * | Track tool usage for analytics |

---

## Hook Security Classifications

Hooks are classified by security impact.

| Security Level | Hooks | Update Policy |
|----------------|-------|----------------|
| **Security-Critical** | `credential-guardian.ts`, `file-guardian.ts` | **ALWAYS update** (no override) |
| **Recommended** | `validate-frontmatter.ts`, `skill-structure-validator.ts`, `enforce-workflow.ts` | Update recommended |
| **Optional** | `tool-tracker.ts`, `agent-loader.ts`, `skill-hook-loader.ts`, `session-start.ts`, `session-end.ts` | Update at convenience |

---

## Hook Response Format

Hooks output JSON to stdout:

```typescript
interface HookResponse {
  action: 'allow' | 'warn' | 'block';
  message?: string;
  suggestion?: string;
}
```

- `allow` - Tool executes normally
- `warn` - Tool executes, warning shown
- `block` - Tool blocked, message shown

---

## Creating New Hooks

**CRITICAL: New hooks require BOTH source file AND symlink**

1. Create TypeScript file in `hooks/`
2. Read JSON input from stdin (tool_name, tool_input)
3. Output JSON response to stdout
4. Add to `settings.json` hooks configuration
5. **Run `bun run tools/git/scripts/push/sync-symlinks.ts`** to create symlink

### Why Symlinks?

Hooks live in `hooks/` but Claude Code reads from `~/.claude/hooks/`. The sync script creates symlinks so changes to framework hooks are immediately active without requiring path updates.

### Sync Hook Symlinks

```bash
# Check which symlinks are missing/orphaned (dry run)
bun run tools/git/scripts/push/sync-symlinks.ts --check

# Create missing symlinks and remove orphaned ones
bun run tools/git/scripts/push/sync-symlinks.ts
```

**When to run:**
- After creating a new hook file
- After pulling framework updates
- If you see "Module not found hooks/..." errors

---

## Pre-Commit Hooks

See `hooks/pre-commit/README.md` for git pre-commit hook documentation.

---

## Configuration

Hooks are configured in `settings.json`:

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Write",
        "hooks": [
          { "type": "command", "command": "bun run hooks/validate-frontmatter.ts" }
        ]
      }
    ]
  }
}
```

---

**Framework:** Intelligence Adjacent (IA) v2.4.0
