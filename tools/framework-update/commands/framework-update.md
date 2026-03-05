---
name: framework-update
description: Check for and preview framework updates
tool: framework-update
domain: framework-update
agent: base
model: haiku
complexity: low
chain_position: first
type: infrastructure
classification: public
---

# /framework-update - Check for Updates

## IDENTITY

**Agent:** Base Claude (orchestrator)

**Role:** Command router for framework update preview. Fetches upstream, compares with local installation, and displays a categorized report.

**Constraints:** Read-only -- makes no changes to any files. Safe to run anytime.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/framework-update`
- No arguments required

**Prerequisites:**
- Network access (to fetch upstream repository)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Fetch upstream framework, compare with local installation, and show a categorized report of NEW, UPDATE, CONFLICT, and PROTECTED files.

**Success criteria:**
- Upstream fetched successfully
- File comparison completed
- Categorized report displayed to user
- User informed about `/framework-update-apply` for next steps

**Failure criteria:**
- Upstream fetch fails (network issue) -> inform user and stop
- Comparison script error -> display error details

---

## METHODOLOGY

Safe preview workflow: fetch upstream clone, compare files against local installation, detect local modifications using file-based detection (timestamps + checksums), categorize all changes, and display an organized report. No modifications to any files at any point.

---

## EXECUTION

### Step 1: Run Preview Script

**Tool:** Bash
**Command:** `bun run tools/framework-update/scripts/framework-update-preview.ts`

Execute the preview script to fetch upstream and generate the comparison report.

**Expected output:** Categorized report text
**On failure:** Display error message, suggest checking network connectivity

### Step 2: Display Report

**Tool:** Direct output

Show the generated report to the user. The report categorizes files as:

```
NEW (X files)
   New skills, agents, commands available

UPDATE (Y files)
   Files changed upstream that you haven't modified

CONFLICTS (Z files)
   Files both you AND upstream changed

PROTECTED (N files)
   Your customizations (never touched)
```

### Step 3: Inform Next Steps

**Tool:** Direct output

Tell the user:
- If they want to apply these updates, run `/framework-update-apply`
- If they just wanted to check, they're done -- no changes were made

---

## OUTPUT CONTRACT

**Produces:**
- Report displayed to user showing: NEW files, UPDATE files, CONFLICT files, PROTECTED files
- No files written or modified

---

## NEXT

**On success:** -> User decides next action
- If user wants to apply: -> `/framework-update-apply`
- If user is just checking: -> done

**On failure:** -> STOP
- Display error details and suggest troubleshooting steps

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Upstream fetched successfully
- [ ] File comparison completed
- [ ] Categorized report displayed to user
- [ ] User informed about `/framework-update-apply`

**Error recovery:**
- Network failure: Check connectivity, retry
- Script error: Display full error output for debugging

---

## Usage

```bash
/framework-update
```

**No changes are made. Safe to run anytime.**

## What Happens Next

If you want to apply these updates:

1. Run `/framework-update-apply`
2. It shows the same report again (for confirmation)
3. You confirm yes/no
4. If yes: backup -> apply -> validate
5. Done!

## Related Command

- `/framework-update-apply` - Actually apply the updates

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
