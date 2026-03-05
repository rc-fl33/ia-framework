# Prompt Creation Guide

**Quick reference for creating prompts. Don't rewrite structure docs. Point to them.**

**Structure Reference:** `docs/guides/universal-prompt-structure.md`

**Templates:**
- Phase prompts: `templates/PHASE-TEMPLATE.md`
- Technique prompts: `templates/PROMPT-TEMPLATE.md`
- Commands: `templates/COMMAND-TEMPLATE.md`

---

## When to Create a Prompt

**Create a PHASE prompt when:**
- Orchestrating work across multiple steps
- Controlling flow (if A succeeds → load B, if A fails → STOP)
- Validating completion before gating to next phase
- Work is inline OR delegated to technique prompts

**Create a TECHNIQUE prompt when:**
- You have a reusable, specific procedure
- Phases delegate to detailed execution
- Multiple skills might use this same procedure
- Work needs exact steps, exact commands, expected outputs

**When to SKIP prompts:**
- Work fits naturally within a phase (no extraction needed)
- Not reusable across skills
- No technique-level decomposition needed

---

## Decomposing Workflows into Prompts

**Principle:** Each decision boundary = separate prompt

**Example: Career Assessment**
```
DECISION 1: Valid job data?
  NO → STOP
  YES → Continue

DECISION 2: Identifiable gaps found?
  NO → Note (no gaps)
  YES → Categorize gaps

DECISION 3: Gaps actionable?
  YES → Create recommendations
  NO → Note limitations

DECISION 4: Assessment complete?
  YES → Gate to phase 2
  NO → Iterate
```

Each decision becomes a prompt boundary. Phases control flow. Technique prompts handle detail.

---

## Phase vs Technique

**PHASE EXECUTION = FLOW CONTROL**
- Each step does work OR delegates to technique prompt
- Step 3: Validate all technical work completed
- Routes to next phase only after validation passes

**TECHNIQUE EXECUTION = DETAIL WORK**
- Exact commands, flags, expected outputs
- Error handling for each step
- Returns completion indicator to calling phase

Both follow same structure. Content density differs by level.

**Keep phases lean:**
- Phase: "For SQL injection, load `prompts/web-api/injection/sqli-mysql-error-based.md`"
- NOT: "Run sqlmap -u [URL] --dbs and capture errors..." (that's in the technique prompt)

---

## Orchestrator Pattern (Phase 0 / Workflow)

**Phase 0 (`00-workflow.md`) is special.** It's a routing orchestrator, not execution.

**Phase 0 job:**
- Detect current state (which phase was last completed?)
- Load the appropriate next phase file
- Route between agents if needed (if phase 4 delegates to writer, don't try to run it as advisor)
- Enforce gates between phases

**Phase 0 EXECUTION should be brief:**
```
### Step 1: Detect State
  Check which files exist in output/
  Determine first incomplete phase

### Step 2: Route
  IF phase 1 incomplete → Load 01-assess.md
  IF phase 1 complete but NO-GO → STOP
  IF phase 2 incomplete → Load 02-research.md
  ...etc

### Step 3: Agent Routing (if applicable)
  IF phase 4 delegates to writer → Task(subagent_type="writer", ...)
  ELSE → Load next phase file normally
```

**Phase 0 doesn't do analysis/research/testing.** It orchestrates. Keep it lean.

---

## Anti-Patterns

❌ **Vague EXECUTION directives** → "Research the target"
✅ **Specific** → "Use WebSearch with queries: [exact q1], [exact q2], [exact q3]"

❌ **Missing NEXT** → Prompt ends without saying what's next
✅ **Explicit** → "On success → Load phases/02-research.md with output from phase 01"

❌ **Hallucinated tools** → "Use tool X to do Y" (tool doesn't exist)
✅ **Verified** → Point to `tools/REGISTRY.json` or reference real tool

❌ **No error recovery** → "If this fails, try again"
✅ **Specific** → "If this fails, [exact alternate approach]"

❌ **Technique prompt without examples** → "Test for injection"
✅ **Concrete** → Show expected input, output, example

❌ **Phase with all the detail** → 100+ lines of bash commands inline
✅ **Delegated** → Phase routes to technique prompts that contain detail

---

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Phase | `NN-name.md` | `01-assess.md` |
| Workflow | `00-workflow.md` | `00-workflow.md` |
| Technique | `category/technique-name.md` | `injection/sqli-mysql-error-based.md` |
| Shared | `shared/component-name.md` | `shared/authorization-check.md` |

All kebab-case. Technique prompts: one level of nesting only.

---

## Agent Boundaries (CRITICAL)

**Each prompt executes with a specific agent.** METADATA specifies `agent: [advisor|engineer|security|writer|legal]`.

**Before creating a phase, ask:**
- Is this work naturally part of one skill, or does it split across agent domains?
- Should this phase do the work OR delegate to a specialized agent?

**Routing table:**
- **Analysis, assessment, decision-making, strategy** → `advisor`
- **Information gathering, source evaluation, synthesis** → `researcher`
- **Content creation, writing, documentation** → `writer`
- **Security testing, vulnerability assessment** → `security`
- **Infrastructure, deployment, setup, hardening** → `engineer`
- **Legal, compliance, regulatory analysis** → `legal`

**Example: Career Skill (multi-agent)**

Phase 1 (Assess job fit) → `advisor` ✓ (decision-making)
Phase 2 (Research company) → `researcher` ✓ (information gathering)
Phase 3 (Interview prep) → `advisor` ✓ (strategy)
Phase 4 (Write resume + cover letter) → `writer` ✓ (content creation)
Phase 5 (Submission strategy) → `advisor` ✓ (guidance)

**In NEXT section of Phase 3:**
```
Task(subagent_type="writer", prompt="Create production-ready resume and cover letter")
  Input: Interview prep data
  Output: resume.md, cover-letter.md
  Then: Load Phase 5 with written files
```

This delegates writing work to the expert while keeping assessment/strategy in advisor.

**When to delegate:**
- ✅ Information gathering (web, social media, regulatory, news) → `researcher`
- ✅ Content creation (blog, docs, resumes, reports) → `writer`
- ✅ Security testing (pentest, vuln scan, code review) → `security`
- ✅ Infrastructure (deployment, hardening, setup) → `engineer`
- ✅ Legal/compliance (regulatory, risk, frameworks) → `legal`
- ❌ Orchestration/routing between work → base Claude (Phase 0 orchestrator)

**When to stay in one agent:**
- Simple skill (all analysis or all testing) — use one agent throughout
- Multi-step skill where agent context matters — keep same agent unless work changes domain

**IDENTITY is NOT duplicated across prompts.**
Agent identity lives in `agents/[agent].md` — single source of truth.
Prompt IDENTITY adds only phase-specific context (1-3 lines).
Change agent behavior once → every prompt using that agent gets the update.

---

## Pre-Creation Checklist

Before you start:

- [ ] Read the methodology (if one exists for this domain)
- [ ] Know your INPUT (what previous prompt produces)
- [ ] Know your OUTPUT (what next prompt expects)
- [ ] Understand chain position (first/middle/last)
- [ ] Choose template (phase/technique/command)
- [ ] Understand your decision boundaries (where does this prompt end?)
- [ ] **IDENTIFY AGENT BOUNDARIES** — Will this phase do work or delegate to specialized agent?

---

## Using the Template

1. Copy `templates/PROMPT-TEMPLATE.md` (or PHASE-TEMPLATE.md)
2. Fill METADATA frontmatter — **choose the right agent for this work**
3. Write IDENTITY — **reference agent file, add only phase-specific role (1-3 lines)**
4. Define INPUT CONTRACT (exact file paths, prerequisites)
5. Define OBJECTIVE (observable success/failure criteria)
6. Write METHODOLOGY (strategic reasoning, not steps)
7. Write EXECUTION (for phases: flow + delegation; for techniques: detailed steps)
8. Define OUTPUT CONTRACT (exact files, exact paths, exact format)
9. Write NEXT (exactly what happens after, with conditions — consider multi-agent delegation)
10. Write CHECKPOINTS (observable exit criteria, error recovery)

**IDENTITY is lightweight.** Agent files (`agents/[agent].md`) define expertise, constraints,
methodology, tool priority. Your prompt's IDENTITY adds ONLY what's unique to THIS phase.
Don't duplicate what's in the agent file.

Don't skip sections. All sections serve a purpose (see universal-prompt-structure.md for details).

---

## Quality Gate

Prompt is done when:

- [ ] METADATA populated (all required fields, correct agent selected)
- [ ] IDENTITY references agent file + adds phase-specific role only (NOT duplicated)
- [ ] INPUT CONTRACT has exact paths and clear prerequisites
- [ ] OBJECTIVE has observable success AND failure criteria
- [ ] EXECUTION steps have Tool, Directive, Expected output, On failure (every step)
- [ ] OUTPUT CONTRACT specifies exact files, exact paths, exact format
- [ ] NEXT tells exactly what happens (file path + conditions)
- [ ] CHECKPOINTS are observable (not subjective)
- [ ] No hallucinated tools (all tools exist or reference REGISTRY.json)
- [ ] All document references have exact paths (no vague "the docs")
- [ ] Grounded in methodology (if domain has one, prompt references it)

---

## References

- **Structure details:** `docs/guides/universal-prompt-structure.md`
- **Skill structure:** `skills/create/docs/skill-structure-standards.md`
- **Real example (phase):** `skills/career/phases/01-assess.md`
- **Real example (technique):** `skills/pentest/prompts/web-api/injection/sqli-mysql-error-based.md`
- **Methodology example:** `methodologies/web-api/framework.md`

---

**Version:** 1.0
**Last Updated:** 2026-02-08
