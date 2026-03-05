---
name: write
description: Content writing command router — validates input and loads 5-phase workflow
domain: write
skill: write
agent: writer
model: sonnet
complexity: low
mode: single-agent
chain_position: first
classification: public
---

# /write — Content Writing with QA Workflow

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to writer agent)

**Role:** Command router for content writing. Validate user input, detect topic, and load the 5-phase content workflow orchestrator.

**Note:** This command routes to `phases/00-workflow.md`, which executes the single-agent pipeline (all phases use writer agent).

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/write [topic]` or `/write --brand [name] [topic]`
- Optional: `--brand [name]` flag to select a client brand voice guide
- Optional: content brief from `private/input/write/`

**Prerequisites:**
- User has invoked `/write`
- Topic provided (inline or via follow-up prompt)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's content request to the write 5-phase workflow.

**Success criteria:**
- Topic extracted from user input
- Output directory prepared
- Workflow loaded from `skills/write/phases/00-workflow.md`

**Failure criteria:**
- No topic provided and user declines to provide → STOP with guidance

---

## METHODOLOGY

Detect whether the user provided a topic inline (`/write installation guide`) or needs prompting. For fresh starts, the workflow orchestrator will create the output directory.

If `private/output/write/` contains existing work for this topic, the workflow orchestrator will detect the current phase from existing files.

---

## EXECUTION

### Step 1: Validate Input

**Tool:** Direct analysis

Parse user input for:
- **Topic:** Extract inline topic text (everything after `/write` excluding flags)
- **Brand flag:** Check for `--brand [name]` parameter. If present, set `brand = [name]`.

If no topic: ask user what content they want to create.

**Brand resolution:** If `--brand` provided, verify `private/docs/write/brand-voice-{brand}.md` exists. If not found, warn user and list available brand guides via glob `private/docs/write/brand-voice-*.md`.

**Expected output:** Topic string and optional brand name
**On failure:** Ask user to provide a topic or content brief

### Step 2: Detect Topic

**Tool:** Direct analysis

Normalize the topic into a URL-safe slug for file naming (e.g., "Installation Guide" → "installation-guide").

**Expected output:** Topic string, slug, and brand name (if provided)
**On failure:** Use user's exact text as topic

### Step 3: Load Workflow

**Tool:** Read
**Reference:** `skills/write/phases/00-workflow.md`

Load the workflow orchestrator with:
- Topic text
- Output directory path: `private/output/write/{slug}-{YYYY-MM-DD}/`
- Brand name (if `--brand` was specified, otherwise omit)

**Expected output:** Workflow loaded, Phase 1 begins

---

## OUTPUT CONTRACT

**Produces:**
- Workflow execution initiated (no files created by command itself)

**Final output (after workflow completes):**
```
private/output/write/{slug}-{YYYY-MM-DD}/
├── {slug}-{YYYY-MM-DD}.{ext}    # Final content
├── draft.md
├── qa-review.json
├── metadata.json
├── sources.txt
├── research-notes.md
└── *.png                         # Images (optional)
```

---

## NEXT

**On success:** → Load `skills/write/phases/00-workflow.md`
  Pass: Topic text, output directory path, brand name (if specified)

**On failure:** → STOP
  Guide user: provide a content topic or brief

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Topic text available
- [ ] Output directory path determined
- [ ] Workflow prompt loaded from `phases/00-workflow.md`

**Error recovery:**
- If no topic provided: Ask user to describe what content they need
- If existing output found: Workflow orchestrator handles resume detection

---

## Usage

```bash
/write
/write installation guide
/write technical documentation for API
/write --brand ia one-off blog post on AI security trends
/write --brand fortreum CMMC assessment preparation guide
```

## When to Use

**Use /write when:**
- Creating documentation (installation guides, READMEs, technical docs)
- Writing blog posts or articles with research
- Building feature documentation
- Developing instructional content

**Use /ghost instead when:**
- Publishing directly to Ghost CMS

## Related Commands

- `/write-research` — Discover topics before writing

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
