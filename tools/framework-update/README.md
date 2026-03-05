# Framework Update Tool

**Update your IA Framework installation while preserving your customizations.**

---

## Two Simple Commands

### 1. `/framework-update` - Preview updates

Check what updates are available without making any changes.

```bash
/framework-update
```

Shows:
- What's new (new skills, agents, commands)
- What changed upstream
- What conflicts exist (files you've modified)
- What's protected (your .env, sessions, custom skills)

**Safe to run anytime - no changes made.**

### 2. `/framework-update-apply` - Apply updates

Apply the updates shown by `/framework-update` after reviewing them.

```bash
/framework-update-apply
```

Does:
1. Shows the report again (for confirmation)
2. Asks "Proceed? (yes/no)"
3. If yes: Creates backup → Applies updates → Validates
4. If no: Exits cleanly (no changes made)

---

## Workflow

**Step 1:** Run `/framework-update`
- See what's available
- Review the report
- Exit (no changes)

**Step 2:** Run `/framework-update-apply` (if satisfied)
- See the report again
- Confirm yes/no
- If yes: Automatic backup → Apply → Done
- If no: Exit cleanly

---

## What Gets Protected

These are **NEVER** overwritten:

- ✅ `.env` files (credentials)
- ✅ `sessions/`, `plans/`, `output/`, `input/` (your data)
- ✅ Your custom skills in `skills/`
- ✅ Your custom agents in `agents/`
- ✅ `.framework-backup/` (previous backups)

---

## When to Use

- Regular framework maintenance
- Getting bug fixes and new features
- Security patches
- New agent or skill capabilities

---

## Rollback

If something goes wrong, restore from automatic backup:

```bash
# List available backups
ls -la .framework-backup/

# Restore from backup
cp -r .framework-backup/[timestamp]/* .
```

---

## Technical Details

**Change Detection:**
- File-based (timestamps + checksums)
- Works with or without git
- No git repository required

**Backup Strategy:**
- Created before any changes
- Timestamped for easy identification
- Full directory preservation

**Conflict Handling:**
- Identifies when both you and upstream changed a file
- Asks what to do for each conflict
- Never overwrites without confirmation

---

## Related Tools

- `/git-push` - Commit your framework updates to git (after applying)

---

**Version:** 3.0
**Last Updated:** 2026-02-06
