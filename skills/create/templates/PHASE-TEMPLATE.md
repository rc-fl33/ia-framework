---
domain: [domain]
skill: [skill-name]
agent: [advisor|researcher|writer|security|engineer|legal]
model: [haiku|sonnet|opus]
mode: single-agent
complexity: [low|medium|high]
chain_position: [first|middle|last]
---

# Phase N: [PHASE-NAME]

## IDENTITY

**Agent:** `agents/[agent-name].md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** [1-2 sentences: what THIS phase does with the agent's expertise]

**Additional constraints for this phase:** [Anything unique to THIS phase — if none, omit]

**Example:**
```
Agent: agents/advisor.md
Phase-specific role: Evaluate career readiness by scoring candidate against job
requirements using weighted methodology. Make GO/NO-GO decision.
Additional constraints: Score <60% = mandatory NO-GO. Never inflate scores.
```

```
Agent: agents/researcher.md
Phase-specific role: Gather company intelligence across 6 categories for
career interview preparation.
Additional constraints: Focus on role-relevant research. Adapt depth by company size.
```

```
Agent: agents/writer.md
Phase-specific role: Create production-ready resume and cover letter from
assessment and research data.
Additional constraints: Follow professional-tone-requirements.md. Never fabricate experience.
```

---

## INPUT CONTRACT

**Receives (in this order):**

| Data | Source | Location | Format |
|------|--------|----------|--------|
| [name] | [previous phase or user] | `skills/[skill]/output/[path]/[filename]` | [JSON/MD/etc] |
| [name] | [previous phase or user] | `skills/[skill]/output/[path]/[filename]` | [JSON/MD/etc] |

**Prerequisites (ALL must be true before starting):**
- [ ] Previous phase completed successfully
- [ ] [Specific input file exists at exact path]
- [ ] [Specific condition is true]
- [ ] [No blockers are present]

**Source files:**
- Output from `skills/[skill]/phases/0[N-1]-[previous-phase].md`
- [Any user-provided inputs]

**What happens if input is missing:** [Exact action — STOP | Use fallback | SKIP this phase]

---

## OBJECTIVE

**Goal:** [Specific, measurable outcome. Not "Do X" but "Produce X with these properties"]

**Success is when:**
- [Observable criterion that is pass/fail, not subjective]
- [Observable criterion — specific metric or artifact]
- [Observable criterion — what the agent can verify themselves]

**Failure is when:**
- [Specific condition requiring STOP, not continuing/guessing]
- [Specific condition — be precise]

**Example:**
```
Goal: Assess candidate's career readiness against discovered job opportunities.

Success is when:
- Assessment document identifies 3+ specific gaps (technical, market, positioning)
- Each gap references specific job requirement and current state
- Recommendations are traceable to market data

Failure is when:
- Data for >20% of jobs is missing/unusable
- Assessment is generic ("improve skills") rather than specific
```

---

## METHODOLOGY

**Strategic approach:** How you think about this phase's problem

[Explain the core strategy — what mental model guides this phase's work. Not commands, but reasoning about the problem]

**Decision framework:** What do you prioritize and how do you adapt?

[Explain how to make trade-off decisions when faced with ambiguity. What takes priority? What do you look for?]

**Specific to this context:** Why this approach for THIS phase?

[Explain what makes this phase different from related work. Why these steps in this order?]

**When standard approaches don't work:**
- If [specific situation]: [adjust by doing this]
- If [specific situation]: [adjust by doing this]

**Example (career assess phase):**
```
Strategic approach: Assess readiness by comparing current state against three job market
dimensions: technical requirements, location/compensation expectations, and role demand.
This reveals gaps that are most expensive to fix (highest ROI for skill development).

Decision framework: Prioritize gaps that are (1) most common across jobs (highest impact)
and (2) most feasible to close (realistic effort). A candidate with 2 technical gaps
across 100 jobs (low impact) ranks below a candidate with 1 gap across 95 jobs (high impact).

Specific to this context: Career assessment happens AFTER job discovery. We have real market
data (the jobs themselves) to reference, not assumptions. This makes assessment concrete and
market-validated, not theoretical.

When data is sparse: If <5 jobs discovered, STOP — insufficient market signal. If 5-10 jobs,
assess carefully but note limited sample. If >10 jobs, assess with confidence.
```

---

## EXECUTION

Each step is **atomic** — it produces observable output and can succeed or fail independently.

### Step 1: [Action Name]

**Purpose:** [What this step accomplishes in 1 sentence]

**Tool:** [Exact tool name: WebSearch | Read | Write | Bash | Glob | Grep | Task | etc.]

**Directive:** [EXACT specification — not vague instruction]

**Examples of exact directives:**
- "Use WebSearch with queries: `[q1]`, `[q2]`, `[q3]` and extract salary data"
- "Read `templates/resume-template.md` and reformat input to match exactly"
- "Use Bash: `sqlmap -u [URL] --dbs` and capture all error messages"
- "Load `prompts/web-api/injection/sqli-mysql-error-based.md` and execute steps 1-5"

**For technique prompts:** Point to them instead of inlining all details
- "For SQL injection testing, load `prompts/web-api/injection/sqli-mysql-error-based.md`"
- This keeps the phase concise. The technique prompt contains everything: commands, expected outputs, error handling

**What you're looking for:**
[Specific thing to identify or produce — not vague "look for patterns"]

**Expected output:**
- Format: [JSON | Markdown | CSV | list | structured text]
- Location: [Where to save, if applicable]
- Example: [Show what good output looks like]

**Success indicator:** [Observable verification — how do you know it worked?]

**On failure:** [Exact next action — not "try again" but "do X specifically"]

---

### Step 2: [Action Name]

**Purpose:** [What this accomplishes]

**Tool:** [Exact tool]

**Directive:** [Exact specification with examples if complex]

**What you're looking for:** [Specific thing]

**Expected output:**
- Format: [format]
- Location: [location]
- Example: [show example]

**Success indicator:** [How to verify]

**On failure:** [Exact next action]

---

### Step 3: [Action Name]

[Same structure as Step 2]

---

## OUTPUT CONTRACT

**This phase produces:**

| File | Description | Location | Format | Consumed by |
|------|-------------|----------|--------|-------------|
| [filename] | [what it contains] | `skills/[skill]/output/[path]/[filename]` | [MD/JSON/etc] | Phase [N+1] |
| [filename] | [what it contains] | `skills/[skill]/output/[path]/[filename]` | [MD/JSON/etc] | Phase [N+1] |

**Format specification:**

If using a template: "Follow `templates/[name].md` exactly"

If JSON:
```json
{
  "field": "description",
  "count": "number",
  "items": ["item1", "item2"]
}
```

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

**Multi-agent routing consideration:**

Before writing NEXT, ask: Should the next work delegate to a specialized agent?

**Single-agent (same agent continues):**
- Phase continues to next phase file
- Same agent executes all phases
- Use when workflow is cohesive and one agent handles all work

**Multi-agent delegation (delegate to specialized agent):**
- Delegate writing tasks to `writer` agent
- Delegate security testing to `security` agent
- Delegate infrastructure work to `engineer` agent
- Use when specific work benefits from specialized agent expertise

**Example (Career Phase 3 → Phase 4 delegation):**
```
On success → DELEGATE to writer agent for content creation:

Task(subagent_type="writer", prompt="Create production-ready resume and cover letter...")
  Input: Interview prep data from phases 1-3
  Output: resume.md, cover-letter.md
  Then: Load phases/05-deliver.md (back to advisor) with written files
```

---

**On success — ALL criteria met:**

**Single-agent path:**
Load: `skills/[skill]/phases/0[N+1]-[next-phase].md`

Pass forward:
- `[this phase's output file]` (primary input for next phase)
- `[previous phase outputs needed by next phase]`
- All files saved in `skills/[skill]/output/[directory]/`

**OR Multi-agent delegation:**
Task(subagent_type="[writer|security|engineer|legal|advisor]", prompt="[specific work]...")

Pass: [files from this phase]

Then: Load next phase with completed outputs

Example (single-agent): "Pass career assessment output to phase 02-research. Career assessment will be the foundation for research queries."

Example (multi-agent): "Delegate resume writing to writer agent. Route completed resume.md back to phase 05."

**On partial success — some criteria met:**

[Decision: Proceed with warnings | Retry specific step | Load alternate phase | STOP]

Condition: [Specific criterion that triggers this path]

**On failure — critical criteria NOT met:**

STOP. Do not proceed to next phase.

Reason: [What constitutes failure — be specific]

Example: "STOP if >20% of job data is missing or unusable. This invalidates the assessment."

---

## CHECKPOINTS

**All exit criteria must be observable (you can verify them yourself):**

- [ ] [Specific criterion — file exists, word count, structured output valid, etc.]
- [ ] [Specific criterion — measurable]
- [ ] [Specific criterion — measurable]
- [ ] Output files saved to correct locations
- [ ] No hallucinated data (all outputs traceable to inputs)

**Common error patterns and recovery:**

- If [specific error pattern]: [exact recovery action — be specific]
- If [specific error pattern]: [exact recovery action]
- If [specific error pattern]: [exact recovery action]

**Example:**
```
Checkpoint: Career assessment identifies 3+ specific gaps with job references
  ✓ = Document contains gaps section with 3+ items
  ✓ = Each gap references 2+ specific jobs
  ✗ = Generic gaps like "improve skills" → REDO assessment with market data

Error recovery:
  If assessment is too generic: Review specific 3-5 job descriptions and map requirements
    to candidate profile again. Make assessment concrete.
  If insufficient job data: STOP — go back to job discovery phase, need 10+ jobs minimum.
  If candidate perfectly matches all jobs: Note this explicitly. No gaps found. Continue
    to next phase with this outcome.
```

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
**Skill standards:** `skills/create/docs/skill-structure-standards.md`
