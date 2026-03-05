---
domain: [domain]
skill: [skill-name]
agent: [advisor|researcher|writer|security|engineer|legal]
model: [haiku|sonnet|opus]
mode: single-agent
complexity: [low|medium|high]
chain_position: [first|middle|last]
---

# [PROMPT-NAME]

## IDENTITY

**Agent:** `agents/[agent-name].md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** [1-2 sentences: what THIS prompt does with the agent's expertise]

**Additional constraints for this phase:** [Anything unique to THIS prompt — if none, omit]

---

**How IDENTITY works:**

The `agent:` field in METADATA loads the full agent identity from `agents/[agent].md`.
That file defines: expertise, constraints, methodology, tool priority, output standards.

This IDENTITY section adds ONLY what's specific to THIS prompt — don't duplicate what's
already in the agent file. If the agent file says "cite 10+ sources," don't repeat it here.

**Available agents:**
- `advisor` — analysis, assessment, decision-making, strategy, coaching
- `researcher` — information gathering (web, social, regulatory), source evaluation, synthesis, citation
- `writer` — content creation, documentation, copywriting
- `security` — security testing, vulnerability assessment, pentest
- `engineer` — infrastructure, deployment, hardening, remediation
- `legal` — legal/compliance analysis, regulatory frameworks, case law

**Choose agent based on the WORK this prompt does, not the skill it belongs to.**
A career skill may use advisor (assess), researcher (gather), and writer (create documents).

---

## INPUT CONTRACT

**Receives (in this order):**

| Data | Source | Location | Format |
|------|--------|----------|--------|
| [name] | [previous prompt or user] | `skills/[skill]/output/[path]/[filename]` | [JSON/MD/etc] |
| [name] | [previous prompt or user] | `skills/[skill]/output/[path]/[filename]` | [JSON/MD/etc] |

**Prerequisites (ALL must be true before starting):**
- [ ] Previous prompt completed successfully
- [ ] [Specific input file exists at exact path]
- [ ] [Specific condition is true]

**What happens if input is missing:** [Exact action — STOP | Use fallback | SKIP]

---

## OBJECTIVE

**Goal:** [Specific, measurable outcome. Not "Do X" but "Produce X with these properties"]

**Success is when:**
- [Observable criterion that is pass/fail, not subjective]
- [Observable criterion — specific metric or artifact]
- [Observable criterion — what you can verify yourself]

**Failure is when:**
- [Specific condition requiring STOP, not continuing/guessing]
- [Specific condition — be precise]

---

## METHODOLOGY

**Strategic approach:** How you think about this prompt's problem

[Explain the core strategy — what mental model guides this work]

**Decision framework:** What do you prioritize and how do you adapt?

[Explain how to make trade-off decisions when faced with ambiguity]

**When standard approaches don't work:**
- If [specific situation]: [adjust by doing this]
- If [specific situation]: [adjust by doing this]

---

## EXECUTION

### About this section:

**For Phase Prompts:** Execution controls FLOW. Each step either does technical work (inline) or delegates to technique prompts. Phase execution validates that all technical work completes before gating to the next phase.

**For Technique Prompts:** Execution contains detailed steps with exact commands, expected outputs, and error handling. Technique execution is the prescriptive detail that phases delegate to.

---

### Step 1: [Work or Delegation]

**Purpose:** [What this accomplishes in 1 sentence]

**Action:** [Do technical work inline OR delegate to technique prompt]

**If inline (detailed work):**
- **Tool:** [Exact tool name: WebSearch | Read | Write | Bash | Glob | Grep | Task | etc.]
- **Directive:** [EXACT specification — show examples if complex]
- **What you're looking for:** [Specific thing to identify or produce]
- **Expected output:**
  - Format: [JSON | Markdown | CSV | list | etc.]
  - Example: [Show what good output looks like]
- **Success indicator:** [Observable verification — how do you know it worked?]
- **On failure:** [Exact next action — not "try again" but "do X specifically"]

**If delegated (orchestration):**
- **Load:** `prompts/[category]/[technique-name].md`
- **Pass:** [Data from previous steps]
- **Expected:** [What technique prompt will complete and return]
- **Success indicator:** [Technique completed with valid output saved to [path]]
- **On failure:** [Exact recovery action]

---

### Step 2: [Work or Delegation]

[Same structure as Step 1]

---

### Step 3: [For Phase Prompts Only] Validate Completion

**Purpose:** Ensure ALL technical work above is complete before proceeding to OUTPUT CONTRACT

**Action:** Verify all outputs present, correct format, complete

**What to verify:**
- [ ] Step 1 output exists at [exact path]
- [ ] Step 2 output exists at [exact path]
- [ ] All outputs match expected format (no partial data)
- [ ] No hallucinated or placeholder data

**Success indicator:** All technical work done and validated

**On failure:** [STOP reason: specific missing piece]

---

## OUTPUT CONTRACT

**This prompt produces:**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| [filename] | [what it contains] | `skills/[skill]/output/[path]/[filename]` | [MD/JSON/etc] | [Next prompt] |

**Format specification:**

If using template: "Follow `templates/[name].md` exactly"

If structured Markdown:
```
## Section Title
- Point 1
- Point 2

## Another Section
- Point A
```

**Quality bar:**
- All required sections present
- No hallucinated or placeholder data
- Outputs are traceable to inputs (verifiable)

---

## NEXT

**On success — ALL criteria met:**

Load: [Next prompt file path]

Pass forward:
- `[this prompt's output]` (primary input for next prompt)
- `[previous outputs needed by next prompt]`
- All files in `skills/[skill]/output/[directory]/`

**On failure — critical criteria NOT met:**

STOP. Do not proceed to next prompt.

Reason: [What constitutes failure — be specific]

---

## CHECKPOINTS

**All exit criteria must be observable (you can verify them yourself):**

- [ ] [Specific criterion — file exists, structure valid, etc.]
- [ ] [Specific criterion — measurable]
- [ ] [Specific criterion — measurable]
- [ ] All technical work in EXECUTION steps completed
- [ ] Output validation passed
- [ ] No hallucinated data (all outputs traceable to inputs)

**Common error patterns and recovery:**

- If [specific error pattern]: [exact recovery action]
- If [specific error pattern]: [exact recovery action]

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
**Skill standards:** `skills/create/docs/skill-structure-standards.md`
