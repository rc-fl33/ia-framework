---
name: [command-name]
description: [One-line description]
domain: [domain]
skill: [skill-name]
agent: base-claude
model: [haiku|sonnet|opus]
complexity: low
chain_position: first
---

# /[command-name] — [Short Description]

## IDENTITY

**Agent:** Base Claude (command routing — no specialized agent needed)

**Role:** Command router for [skill-name]. Validates input, detects fresh vs resume,
loads the correct workflow. Does NOT perform domain work — routes to agents that do.

**Constraint:** You are ONLY a router. Your output is routing data to the next prompt.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/[command-name]` with optional arguments
- Optional: `[context]` — [specific thing user provides: query, URL, file path, etc.]
- Optional: Auto-detected files from `skills/[skill]/input/` or prior runs

**Prerequisites:**
- User has typed `/[command-name]`
- [Any required setup — e.g., credentials configured, files in input/]

**Validation rules:**
- [Required argument check: is it present? is it valid format?]
- [Optional argument check: if provided, is it valid?]
- [Auto-detected files check: if they exist, are they recent/valid?]

**What happens if input is invalid:**
- [Exact action: Prompt for X specifically | Use fallback | STOP with guidance]

---

## OBJECTIVE

**Goal:** Validate input and route to the correct workflow.

**Success is when:**
- Input is validated and context extracted
- Workflow loaded from `skills/[skill]/phases/00-workflow.md` (fresh) OR
- Correct phase loaded (resume)
- All required data passed forward

**Failure is when:**
- Required input missing and user provides no alternative → STOP
- Input format invalid and cannot be corrected → STOP

---

## EXECUTION

Commands are **lightweight routing prompts**. They have minimal METHODOLOGY
because their job is simply: validate → detect → route.

### Step 1: Validate User Input

**Tool:** [Read | Glob | or user interaction via AskUserQuestion]

**Directive:** [Specific validation rule]

**Examples:**
- "Validate that user provided a file path. If not provided, ask via AskUserQuestion"
- "Validate URL format using regex. If invalid, ask user to correct"
- "Validate that resume file exists at `skills/[skill]/input/[filename]`"

**What you're looking for:** Valid, usable input for the workflow

**Expected output:**
- Format: [text | structured data]
- Example: "Resume found at private/input/career/chris_resume.md" or "Query: 'remote software engineer NYC'"

**Success indicator:** [Observable verification — "Is this input usable?"]

**On failure:** [Ask user for clarification | Use fallback | STOP]

---

### Step 2: Detect Fresh vs. Resume

**Tool:** Glob

**Directive:** `Glob pattern: skills/[skill]/output/*`

Check if a previous workflow run exists for this user/context.

**What you're looking for:**
- Existing output directory for THIS user/context
- Timestamp of most recent run
- Which phase's output is most recent (determines resume point)

**Expected output:**
- Format: "FRESH" or "RESUME → Phase N"
- Example: "FRESH — no prior runs for this user" or "RESUME — last completed phase 01-assess"

**Success indicator:** Clear determination of fresh vs. resume

**On failure:** Default to fresh start (no prior runs found)

---

### Step 3: Load Workflow (Fresh) or Phase (Resume)

**Tool:** Read

**Directive (Fresh):** Load `skills/[skill]/phases/00-workflow.md` with user's input context

**Directive (Resume):** Load `skills/[skill]/phases/0[N]-[phase].md` where [N] = first incomplete phase

**What you're looking for:** Successful file load

**Expected output:**
- Format: Workflow/phase prompt loaded and ready
- Example: "Loaded phases/00-workflow.md with resume data: chris_resume.md"

**Success indicator:** File exists and is readable

**On failure:** [User message with recovery instructions]

---

## OUTPUT CONTRACT

**This command produces:**

| Data | Location | Format | Consumed by |
|------|----------|--------|-------------|
| Validated input context | Passed to workflow | [text/path/URL/etc] | Phase 0 or Resume Phase |
| Auto-detected resources | Passed to workflow | [structured format] | Phase 0 or Resume Phase |
| Output directory path | Passed to workflow | Path string | All phases |

**Exact data passed forward:**
- `[input-context]` — User's provided input (query, file path, URL, etc.)
- `[auto-detected-files]` — Any resources found in input/ or prior output/
- `skills/[skill]/output/[directory-name]/` — Path where all outputs will be written

**Output directory naming:** [Specific pattern — e.g., "username-YYYY-MM-DD-HH-MM" or "query-slug-timestamp"]

---

## NEXT

**On success (input valid, workflow ready):**

Load: `skills/[skill]/phases/00-workflow.md` (fresh) **OR** `skills/[skill]/phases/0[N]-[phase].md` (resume)

Pass:
- User input context: `[input-data]`
- Auto-detected files: `[list of files]`
- Output directory: `skills/[skill]/output/[directory-name]/`

**Routing rule:**
```
IF output directory exists for this context
  THEN load phase corresponding to first incomplete deliverable
  ELSE load phases/00-workflow.md
```

**Agent routing note:**

Workflows (Phase 0) route to phases which may execute in different agents:
- Phase 1-3 may run in advisor
- Phase 4 may delegate to writer
- Phase 5 may return to advisor

The NEXT section of each phase determines which agent executes next. Commands don't need to specify this — workflow orchestrators handle the routing.

**On failure (input invalid, cannot proceed):**

STOP. Display guidance message.

Message template:
```
❌ Cannot proceed without [required input].

To use /[command-name], you need to provide [requirement].
Examples:
- /[command-name] [example 1]
- /[command-name] [example 2]

Or place a file at: skills/[skill]/input/[filename]
Then run: /[command-name]
```

---

## CHECKPOINTS

**Validation checklist (ALL must be true):**
- [ ] User input validated (present, format correct)
- [ ] Auto-detected resources confirmed (or user notified they're missing)
- [ ] Fresh vs. Resume determined correctly
- [ ] Correct workflow/phase file identified
- [ ] All data formatted for next prompt

**Observable verification:**
- Input is usable or error message clearly explains what's needed
- Output directory path is defined
- No guessing about which phase to load

**Error recovery:**
- If [specific error]: [exact recovery action]
- If [specific error]: [exact recovery action]

---

## Usage

**Basic:**
```bash
/[command-name]
```

**With context:**
```bash
/[command-name] [context-argument]
```

**Examples:**
```bash
/[command-name] path/to/resume.md
/[command-name] "search query here"
/[command-name] https://example.com
```

---

## When to Use This Command

**Use /[command-name] when:**
- [Trigger scenario 1]
- [Trigger scenario 2]

**Don't use if:**
- [Anti-pattern] → use `/[alternative]` instead
- [Anti-pattern] → [explanation]

---

## Related Commands

- `/[related-command]` — [Brief relationship]
- `/[related-command]` — [Brief relationship]

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0 — Lightweight Routing
**Skill standards:** `skills/create/docs/skill-structure-standards.md`
