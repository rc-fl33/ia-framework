# Framework Update - Verification Checklist

**Definition of Done for framework update operations**

---

## Pre-Update Verification

- [ ] Run `/framework-update` to see what's available
- [ ] Review the report (what's new, what changed, what conflicts)
- [ ] No uncommitted changes (if using git): run `git status`
- [ ] Stable working state (no half-finished work)

---

## Step 1: Preview (safe, no changes)

**Command:** `/framework-update`

Verification checklist:
- [ ] Command completes without errors
- [ ] Report shows what's new, what changed, what conflicts
- [ ] No changes made to any files (safe to run anytime)
- [ ] Output tells you to run `/framework-update-apply` if satisfied

---

## Step 2: Apply (with confirmation)

**Command:** `/framework-update-apply`

**Pre-apply verification:**
- [ ] You've reviewed the report from `/framework-update`
- [ ] You understand what conflicts exist
- [ ] You're ready to apply

**During apply verification:**
- [ ] Report shown again (for confirmation)
- [ ] You're asked "Proceed? (yes/no)"
- [ ] You understand what will happen

**After apply verification:**
- [ ] Backup created successfully at `.framework-backup/[timestamp]/`
- [ ] Updates applied without errors
- [ ] Validation passed (JSON syntax, etc.)
- [ ] Summary shows results (applied, added, protected)

---

## Post-Update Verification

- [ ] Framework core files updated to latest
- [ ] Custom skills still present and intact
- [ ] `.env` file unchanged
- [ ] `sessions/`, `plans/`, `output/` directories unchanged
- [ ] `settings.json` valid JSON (validation done automatically)
- [ ] Agents load correctly

---

## Rollback Instructions

If something goes wrong after applying updates:

**Option 1: From automatic backup**
```bash
# List available backups
ls -la .framework-backup/

# Restore from most recent backup
cp -r .framework-backup/[latest-timestamp]/* .
```

**Option 2: Git rollback (if using git)**
```bash
# Revert to previous commit
git reset --hard HEAD~1
```

---

## Testing Verification

After successful update, test:

- [ ] `/framework-update` runs again and shows "up to date"
- [ ] Custom skills work
- [ ] Agents respond correctly
- [ ] Settings persist

---

## Success Criteria

✅ Update considered successful if:
- No errors during apply
- Backup created and verified
- All protected files unchanged (.env, sessions, custom skills)
- Post-update verification all pass

❌ Rollback needed if:
- Errors during apply
- Protected files were modified
- Custom skills broken
- Framework structure corrupted

---

**Skill:** framework-update
**Version:** 3.0
**Last Updated:** 2026-02-06
