---
name: framework-update-apply
description: Apply framework updates after reviewing
tool: framework-update
domain: framework-update
agent: base
model: haiku
complexity: low
chain_position: last
type: infrastructure
classification: public
---

# /framework-update-apply - Apply Updates

## IDENTITY

**Agent:** Base Claude (orchestrator)

**Role:** Command for applying framework updates. Shows the update report, requires explicit user confirmation before making any changes, then applies with automatic backup and validation.

**Constraints:** Requires user confirmation before any modifications. Must create backup before applying. Never touches protected files.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/framework-update-apply`
- No arguments required

**Prerequisites:**
- Should have run `/framework-update` first to preview changes
- Network access (to fetch upstream repository)

**Source:** User invocation (slash command), typically after `/framework-update`

---

## OBJECTIVE

**Goal:** Apply reviewed framework updates with backup, user confirmation, and validation.

**Success criteria:**
- Report shown to user for confirmation
- User explicitly confirmed (yes/no)
- Backup created before any changes
- Updates applied successfully
- Validation passed
- Results displayed

**Failure criteria:**
- User declines -> exit cleanly, no changes
- Backup creation fails -> STOP, do not apply
- Validation fails -> inform user, provide rollback instructions

---

## METHODOLOGY

Confirmation-gated workflow: fetch fresh upstream, show report again for review, ask user yes/no. If yes: create timestamped backup, apply safe updates automatically, handle new files and conflicts per user preference, validate results, and report outcome. If no: exit cleanly with no modifications.

---

## EXECUTION

### Step 1: Run Apply Script

**Tool:** Bash
**Command:** `bun run tools/framework-update/scripts/framework-update-apply.ts`

Execute the apply script to fetch upstream and generate the comparison report.

**Expected output:** Categorized report text (same format as `/framework-update`)
**On failure:** Display error message, suggest checking network connectivity

### Step 2: Display Report

**Tool:** Direct output

Show the report to the user so they can confirm what they're approving. Same categorized format: NEW, UPDATE, CONFLICTS, PROTECTED.

### Step 3: Ask for Confirmation

**Tool:** Direct output

Ask the user: "Proceed with update? (yes/no)"

- If **no**: Exit cleanly, inform user no changes were made
- If **yes**: Continue to Step 4

### Step 4: Create Backup

**Tool:** Bash (handled by apply script)

Backup is created automatically at:
```
.framework-backup/[timestamp]/
```

User can restore from this anytime if something goes wrong.

**On failure:** STOP immediately -- do not apply without backup

### Step 5: Apply Updates

**Tool:** Bash (handled by apply script)

Updates are applied:
- **Safe updates**: Applied automatically (files upstream changed, you haven't modified)
- **New files**: Added if you approve
- **Conflicts**: Handled based on your preferences (use upstream, keep yours, or manual merge)

### Step 6: Validate and Display Results

**Tool:** Bash + Direct output

Files are checked to ensure everything is valid (JSON syntax, file integrity, etc.). Summary of applied changes displayed to user.

### Step 7: Check Dependencies (Post-Update)

**Tool:** Bash
**Command:** `bun tools/framework/utils/check-dependencies.ts`

After applying updates, check if any new tools require dependencies that aren't installed yet. This ensures users are aware of optional features they can enable.

**Output:** Shows installed and missing optional dependencies with installation recommendations.

**Note:** This is informational only. Missing optional dependencies don't block the update.

---

## OUTPUT CONTRACT

**Produces:**
- Updated framework files in the local installation
- Backup at `.framework-backup/[timestamp]/`
- Validation report shown to user

**If user declines:**
- No files modified
- Clean exit

---

## NEXT

**On success:** -> Workflow complete
- Suggest `/git-push` to commit the framework updates

**On user decline:** -> Done
- No changes made, clean exit

**On failure:** -> Rollback
- Provide restore instructions: `cp -r .framework-backup/[timestamp]/* .`

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Report shown to user
- [ ] User confirmed (yes)
- [ ] Backup created at `.framework-backup/[timestamp]/`
- [ ] Updates applied
- [ ] Validation passed
- [ ] Results displayed to user

**Error recovery:**
- Backup fails: STOP, do not proceed
- Apply fails mid-way: Restore from backup
- Validation fails: Inform user, provide rollback command

---

## Usage

```bash
/framework-update-apply
```

## Safety Features

- **No changes until you confirm** - You must say "yes" at the prompt
- **Backup created first** - Before any modifications are made
- **Rollback available** - Files are in `.framework-backup/[timestamp]/`
- **Protected files never touched** - Your .env, sessions, plans stay unchanged
- **Your customizations preserved** - Custom skills and agents won't be overwritten

## If Something Goes Wrong

Restore from backup:

```bash
# List available backups
ls -la .framework-backup/

# Restore from latest backup
cp -r .framework-backup/[latest-timestamp]/* .
```

## Related Command

- `/framework-update` - Preview updates first (always run this before apply)

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
