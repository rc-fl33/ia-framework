# Universal Prompt Structure

**Canonical reference for ALL interaction files across ALL skills.**

Every file that instructs an agent — commands, workflows, phases, technique prompts, shared components — follows this structure. The sections scale based on complexity, but the structure is consistent.

**Version:** 2.0
**Last Updated:** 2026-02-12

---

## Core Principle

Every interaction in the framework is a prompt. Commands, workflows, phases, technique prompts, shared components — ALL follow the same structure. There is no distinction between "orchestration files" and "prompts." They are ALL prompts with IDENTITY, INPUT CONTRACT, OUTPUT CONTRACT, and clear expectations.

The chain is explicit. Every prompt knows:
- **What it receives** (INPUT CONTRACT — from the previous prompt in the chain)
- **What it produces** (OUTPUT CONTRACT — for the next prompt in the chain)
- **Who it is** (IDENTITY — forced, not inherited from external routing)
- **When it's done** (CHECKPOINTS — observable completion markers)

This eliminates ambiguity at every level. No hoping base Claude routes correctly. No undefined handoffs between steps. No missing outputs.

---

## The Universal Structure

```
## METADATA
## IDENTITY
## INPUT CONTRACT
## OBJECTIVE
## METHODOLOGY
## PROGRESS TRACKING
## EXECUTION
## OUTPUT CONTRACT
## NEXT
## CHECKPOINTS
```

Each section is described in detail below with scaling guidance.

---

## Section Reference

### METADATA

Structured frontmatter identifying this prompt within the framework.

```yaml
---
domain: security          # security, career, ghost, compliance, etc.
skill: security           # exact skill name from skills/
agent: security           # security, advisor, writer, engineer, legal
model: haiku              # haiku, sonnet, opus, or OpenRouter model
mode: single-agent        # single-agent, parallel, delegated
complexity: low           # low, medium, high
chain_position: middle    # standalone, first, middle, last
---
```

**Fields:**

| Field | Required | Description |
|-------|----------|-------------|
| `domain` | Yes | Problem domain (security, career, ghost, etc.) |
| `skill` | Yes | Exact skill directory name |
| `agent` | Yes | Which agent executes this prompt |
| `model` | No | Model requirement (defaults to agent default) |
| `mode` | No | Execution mode (defaults to single-agent) |
| `complexity` | No | Helps with model selection (defaults to medium) |
| `chain_position` | No | Where in the chain this prompt sits |

**Scaling:** Always present. Same format for all prompt types.

---

### IDENTITY

WHO you are — role, expertise, constraints, boundaries.

This is the PRIMARY mechanism for forcing correct behavior. Every prompt carries its own identity so there is ZERO reliance on external routing to set context. No guessing. No arguing.

```markdown
## IDENTITY

You are a [role] specializing in [domain expertise].

**Expertise:** [specific knowledge areas]
**Constraints:** [what you must NOT do]
**Boundaries:** [scope limits]
```

**Examples by prompt type:**

**Command (routing):**
```markdown
## IDENTITY
You are the career analysis orchestrator. You route job analysis requests
to the 5-phase career workflow. You do not perform analysis directly.
```

**Phase (execution):**
```markdown
## IDENTITY
You are a career advisor performing company research. You gather intelligence
from web sources and social media to inform interview preparation. You cite
all sources inline. You never fabricate company information.
```

**Technique (domain-specific):**
```markdown
## IDENTITY
You are a security tester specializing in SQL injection vulnerabilities.
You operate within SCOPE.md boundaries and capture all evidence. You test
only in-scope targets using approved tools from REGISTRY.json.
```

**Scaling:**
- **Commands:** 1-2 sentences (routing identity)
- **Workflows:** 2-3 sentences (orchestration identity)
- **Phases:** 3-5 sentences (execution identity with constraints)
- **Technique prompts:** 3-5 sentences (domain-specific with scope/tool constraints)

---

### INPUT CONTRACT

What this prompt receives and what must be true before execution.

```markdown
## INPUT CONTRACT

**Receives:**
- [exact file/data from previous prompt — path or variable]
- [exact file/data from previous prompt]

**Prerequisites:**
- [condition that must be true]
- [condition that must be true]

**Source:** [exact file path of previous prompt that produced these inputs]
```

**Examples:**

**First in chain (command):**
```markdown
## INPUT CONTRACT

**Receives:**
- User's job posting (pasted text or URL)
- Resume auto-detected from `skills/career/input/resume.md`

**Prerequisites:**
- User has provided a job posting or URL
- Resume exists at input path (or user provides when prompted)

**Source:** User invocation (`/career [job posting]`)
```

**Middle of chain (phase):**
```markdown
## INPUT CONTRACT

**Receives:**
- `match-assessment.md` from Phase 1 (GO decision confirmed)
- `company-research.md` from Phase 2 (10+ sources collected)
- Output directory: `skills/career/output/{company}-{role}-{date}/`

**Prerequisites:**
- Phase 1 completed with GO or CONDITIONAL GO decision
- Phase 2 completed with 10+ sources collected
- Both output files exist and pass validation

**Source:** `skills/career/phases/02-research.md` (previous phase)
```

**Standalone (technique prompt):**
```markdown
## INPUT CONTRACT

**Receives:**
- Target URL with injectable parameter (from test plan)
- SCOPE.md validation (target confirmed in-scope)
- Session context from `session.json`

**Prerequisites:**
- SCOPE.md exists and target is in-scope
- kali-pentest container running
- sqlmap available

**Source:** Phase 5 exploitation coordinator or test plan
```

**Scaling:** Always present. Standalone prompts list prerequisites only.

---

### OBJECTIVE

What to accomplish, with measurable success/failure criteria.

```markdown
## OBJECTIVE

**Goal:** [specific, measurable outcome]

**Success criteria:**
- [observable, pass/fail criterion]
- [observable, pass/fail criterion]

**Failure criteria:**
- [when to STOP — not guess, not retry indefinitely]
```

**Examples:**

**Command:**
```markdown
## OBJECTIVE

**Goal:** Route user's job analysis request to the career 5-phase workflow.

**Success criteria:**
- Workflow loaded from `skills/career/phases/00-workflow.md`
- User's job posting passed to Phase 1
- Resume located and available

**Failure criteria:**
- No job posting provided and user declines to provide one → STOP
```

**Phase:**
```markdown
## OBJECTIVE

**Goal:** Gather 10+ cited sources of company intelligence across 6 categories.

**Success criteria:**
- 10+ unique sources collected with URLs
- All 6 research categories covered (basics, leadership, security, culture, tech, social)
- Sources cited inline per section
- Key insights identified for interview prep

**Failure criteria:**
- Company too new/small for 10 sources → proceed with available, note limitation
- WebSearch unavailable → STOP, report to user
```

**Technique prompt:**
```markdown
## OBJECTIVE

**Goal:** Detect and confirm MySQL SQL injection using error-based techniques.

**Success criteria:**
- SQLMap identifies injectable parameter
- MySQL error messages reveal database information
- Database enumeration confirms vulnerability

**Failure criteria:**
- No injectable parameters found after all payloads tested → mark SECURE
- WAF blocks all attempts → document as "WAF Protected", try alternate technique
```

**Scaling:** Always present. Keep tight — 3-7 criteria total.

---

### METHODOLOGY

Strategic reasoning — HOW TO THINK about this problem. Decision framework for when standard approaches fail. This is what makes an agent effective vs. a checklist runner.

```markdown
## METHODOLOGY

[Strategic reasoning about the problem domain]
[Decision framework for adaptation]
[What to look for — not just what commands to run]
```

**Examples:**

**Command (minimal):**
```markdown
## METHODOLOGY

Detect whether user is resuming an in-progress analysis (output directory
exists with partial files) or starting fresh. For resumes, load the phase
corresponding to the first missing deliverable.
```

**Phase (moderate):**
```markdown
## METHODOLOGY

Company research serves two purposes: (1) inform the interview preparation
with specific talking points, and (2) validate Phase 1's GO/NO-GO decision
with real company data.

**Research priority order:**
1. Leadership and team structure — directly affects interview experience
2. Recent news and developments — conversation starters
3. Security/compliance posture — role-specific relevance
4. Culture signals — inform whether this is truly a good fit
5. Tech stack — verify alignment with resume skills

**Adaptation:**
- Small companies (<50 employees): Skip formal org research, focus on
  founder backgrounds, funding, growth signals
- Enterprise companies: Emphasize compliance posture, team size, reporting
  structure
- Stealth/pre-launch: Focus on leadership backgrounds, funding sources,
  industry analysis

**Source quality hierarchy:**
Official company pages > Press releases > News articles > Glassdoor >
Social media chatter > LinkedIn job postings (for team structure)
```

**Technique prompt (extensive):**
```markdown
## METHODOLOGY

Error-based SQL injection exploits verbose error messages to extract data.
The approach depends on the database engine, error verbosity, and WAF presence.

**Detection strategy:**
1. Start with single-quote injection to trigger syntax errors
2. If errors visible → error-based extraction is viable
3. If errors suppressed → fall back to time-based blind
4. If WAF detected → try encoding variations before giving up

**Adaptation by context:**
- MySQL 5.x: EXTRACTVALUE() and UPDATEXML() for XML-based errors
- MySQL 8.x: Same functions plus JSON_EXTRACT errors
- Behind WAF: Double URL-encode, use comments (/*!50000*/), alternate syntax
- Parameterized but injectable: Check for second-order injection paths

**What matters more than commands:**
The specific sqlmap flags matter less than understanding WHY error-based
works and WHEN to switch techniques. A parameter that returns MySQL syntax
errors is fundamentally different from one that returns generic 500 errors.
Adapt your approach based on what the target reveals.
```

**Scaling:**
- **Commands:** 1-3 sentences (routing logic)
- **Workflows:** 3-5 sentences (orchestration strategy)
- **Phases:** 1-2 paragraphs (domain reasoning + adaptation)
- **Technique prompts:** 2-4 paragraphs (deep domain reasoning + decision trees)

---

### PROGRESS TRACKING

Dynamic running checklist displayed to the user during phase execution.

This section instructs the agent to build a progress checklist at runtime from the EXECUTION steps below. It replaces static, hardcoded checklist templates.

```markdown
## PROGRESS TRACKING

**Display a running checklist to the user as you work through this phase.**

**Generation rules:**
1. Read the EXECUTION steps below
2. Filter steps by current mode and effort level (skip inapplicable steps)
3. Build checklist from applicable step titles
4. Display with all items as □ at phase start

**After each step:** Mark ✓, advance ▸ to next, update metrics, display to user.

**Completion display:** All ✓, final metrics, "Ready for Phase {N+1} →"

**Metrics for this phase:**
- [metric 1]: [what to count]
- [metric 2]: [what to count]
```

**Key properties:**
- Symbols: ✓ (done), ▸ (in-progress, only one), □ (pending)
- Display timing: After each EXECUTION step completes (not every tool call)
- Metrics: Phase-specific, defined in section, populated from actual execution
- Progress: Step fractions (`3/6 steps`), not percentages

**Scaling:**
- **Commands/Workflows:** Omit — these route, they don't execute multi-step work
- **Phases:** Always present — this is where step-by-step work happens
- **Technique prompts:** Omit — loaded by phases, not standalone

**Full specification:** `docs/guides/running-checklist-standard.md`

---

### EXECUTION

Steps with EXPLICIT tool and document directives. Every step specifies the exact tool to use, the exact document to reference, and the expected output.

```markdown
## EXECUTION

### Step 1: [Action Name]

**Tool:** [exact tool name — WebSearch, Read, Bash, etc.]
**Reference:** [exact document to read, if applicable]

[Instructions]

**Expected output:** [what this step produces]
**Success indicator:** [how to verify this step worked]
**On failure:** [what to do — exact alternate approach]

### Step 2: [Action Name]
...
```

**Two tool patterns:**

1. **Open-ended:** "Select appropriate tool from `tools/REGISTRY.json` for [purpose]"
2. **Specific:** "Load `prompts/web-api/injection/sqli-mysql-error-based.md`"

**Key principle:** Phases stay concise by pointing to technique prompts for detail. Don't inline detailed commands — delegate to the prompt that owns them.

**Examples:**

**Command (routing — minimal steps):**
```markdown
## EXECUTION

### Step 1: Detect Resume

**Tool:** Glob
**Pattern:** `skills/career/input/resume.*`

Check for resume at auto-detection paths. If not found, prompt user.

**Expected output:** Resume file path confirmed
**On failure:** Ask user to provide resume path or paste content

### Step 2: Load Workflow

**Tool:** Read
**Reference:** `skills/career/phases/00-workflow.md`

Load the career workflow orchestrator with user's job posting and resume path.

**Expected output:** Workflow loaded, Phase 1 begins
```

**Phase (moderate steps):**
```markdown
## EXECUTION

### Step 1: Company Basics

**Tool:** WebSearch
**Query pattern:** "[Company Name] company overview headquarters founded employees"

Search for foundational company information.

**Expected output:** Company profile (founded, HQ, size, industry, funding)
**Success indicator:** At least 2 sources with URLs collected
**On failure:** Try "[Company Name] about us" or "[Company Name] crunchbase"

### Step 2: Leadership Research

**Tool:** WebSearch
**Query pattern:** "[Company Name] CISO CTO CIO leadership team"

Search for security and technology leadership.

**Expected output:** Key leaders identified with backgrounds
**Success indicator:** At least 1 leader identified with role and background
**On failure:** Search LinkedIn company page for leadership section
```

**Technique prompt (detailed steps with commands):**
```markdown
## EXECUTION

### Authorization Check
@include(shared/authorization-check.md)

### Step 1: Initial SQL Injection Detection

**Tool:** sqlmap (via `{{CONTAINER:kali-pentest}}`)
**VPS Execution:** true

```bash
sqlmap -u "[target url]" --batch --banner
```

**Expected output:** MySQL version detected, parameter flagged as injectable
**Success indicator:** "injectable" keyword in output, MySQL version string
**On failure:** Try `--technique=T` for time-based blind detection
**Alternate tool:** nuclei with sql-injection templates
```

**Scaling:**
- **Commands:** 2-3 steps (detect inputs, load target)
- **Workflows:** 3-5 steps (detect state, load phase, verify gate)
- **Phases:** 3-7 steps (domain-specific execution)
- **Technique prompts:** 3-6 steps (tool commands with success/failure per step)

---

### OUTPUT CONTRACT

What this prompt produces — exact files, formats, and locations.

```markdown
## OUTPUT CONTRACT

**Produces:**
- `[filename]` — [description] → written to `[exact path]`
- `[filename]` — [description] → written to `[exact path]`

**Format:** [JSON schema, markdown template reference, or inline format]
```

**Examples:**

**Command:**
```markdown
## OUTPUT CONTRACT

**Produces:**
- Workflow execution initiated — no files created by command itself
- Output directory created: `skills/career/output/{company}-{role}-{date}/`

**Format:** Directory name follows `{company}-{role}-{date}` pattern (lowercase-hyphen)
```

**Phase:**
```markdown
## OUTPUT CONTRACT

**Produces:**
- `company-research.md` — Company intelligence with 10+ cited sources
  → written to `skills/career/output/{company}-{role}-{date}/company-research.md`

**Format:** Follow template structure in EXECUTION Step 6.
Minimum 200 lines, maximum 400 lines.
Must include Source Index section with numbered URLs.
```

**Technique prompt:**
```markdown
## OUTPUT CONTRACT

**Produces:**
- `findings/TC-XXX-sqli-mysql-error-based.json` — Structured finding
- `evidence/TC-XXX/step-1-initial-probe.txt` — Command output capture
- `evidence/TC-XXX/step-2-enumeration.txt` — Enumeration output

**Format:** JSON schema per OUTPUT FORMAT section. See `skills/pentest/docs/finding-template.md`.
```

**Downstream Consumer Awareness (Recommended for multi-phase skills):**

When the output is consumed by a specific downstream phase, document HOW each file/section is used — not just what's produced. This shapes output to be maximally useful for the next stage.

```markdown
**Consumed by:** `phases/03-prepare.md` (advisor agent)

| Output Section | How Consumer Uses It |
|---------------|---------------------|
| Company basics | Interview small-talk preparation |
| Leadership bios | Targeted questions for specific interviewers |
| Security posture | Technical discussion talking points |
| Key insights | Priority areas for interview prep |
```

This prevents generic or unfocused output. When the author knows the planner needs "libraries to use, not alternatives to consider," output shifts from exploratory to prescriptive.

**Scaling:** Always present. Exact paths required. Consumer awareness recommended for phases, optional for commands.

---

### NEXT

EXACTLY what happens after this prompt completes. The exact file path of the next prompt in the chain, the exact data to pass forward, and conditions for each outcome.

```markdown
## NEXT

**On success:** → Load `[exact file path]`
  Pass: [references to OUTPUT CONTRACT items]

**On failure:** → [exact action — STOP, retry, alternate path]
  Reason: [what constitutes failure]

**Conditions:**
- If [condition A] → [path A with exact file]
- If [condition B] → [path B with exact file]
```

**Examples:**

**Command:**
```markdown
## NEXT

**On success:** → Load `skills/career/phases/00-workflow.md`
  Pass: User's job posting text, resume file path, output directory path

**On failure:** → STOP
  Reason: No job posting provided and user declines to provide one
```

**Phase (middle of chain):**
```markdown
## NEXT

**On success:** → Load `skills/career/phases/03-prepare.md`
  Pass: `company-research.md` (this phase's output) + `match-assessment.md` (Phase 1 output)
  Both files in `skills/career/output/{company}-{role}-{date}/`

**On failure:** → Retry research with alternate queries
  If still failing after retry → proceed with available sources, note gaps
```

**Phase (with conditional):**
```markdown
## NEXT

**On GO (score ≥60%):** → Load `skills/career/phases/02-research.md`
  Pass: `match-assessment.md` with GO decision, output directory path

**On NO-GO (score <60%):** → STOP
  Display NO-GO message to user with score, gaps, and recommendations.
  Do NOT proceed to Phase 2.
```

**Technique prompt (standalone):**
```markdown
## NEXT

**On vulnerable:** → Return finding to Phase 5 coordinator
  Finding written to `findings/TC-XXX-sqli-mysql-error-based.json`
  Evidence captured in `evidence/TC-XXX/`

**On secure:** → Return SECURE status to coordinator
  No finding file created. Log result in test execution tracker.

**On blocked:** → Try alternate technique
  Load `prompts/web-api/injection/sqli-mysql-blind-time.md` if error-based blocked by WAF
```

**Scaling:** Always present. Must include exact file paths. No ambiguity.

---

### CHECKPOINTS

Observable completion markers and exit criteria. Everything needed to verify this prompt completed successfully.

```markdown
## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] [observable criterion]
- [ ] [observable criterion]
- [ ] [observable criterion]

**Error recovery:**
- If [problem]: [exact action, not "figure it out"]
- If [problem]: [exact action]
```

**Examples:**

**Command:**
```markdown
## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Job posting text available (pasted or fetched from URL)
- [ ] Resume file path confirmed
- [ ] Workflow prompt loaded from `phases/00-workflow.md`
- [ ] Phase 1 (Assess) initiated

**Error recovery:**
- If resume not found: Prompt user for path, accept paste as fallback
- If job posting URL unreachable: Ask user to paste text directly
```

**Phase:**
```markdown
## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] 10+ sources collected with URLs
- [ ] All 6 research categories covered
- [ ] Sources cited inline per section
- [ ] `company-research.md` written to output directory
- [ ] Key insights section populated

**Error recovery:**
- If <10 sources: Note limitation, proceed if all 6 categories covered
- If WebSearch unavailable: Use WebFetch on known company URLs
- If Grok/OpenRouter unavailable: Use WebSearch for social media instead
```

**Scaling:** Always present. 3-7 exit criteria. Error recovery for known failure modes.

---

## How Sections Scale by Prompt Type

| Section | Command | Workflow | Phase | Technique |
|---------|---------|----------|-------|-----------|
| METADATA | Full | Full | Full | Full |
| IDENTITY | 1-2 sentences | 2-3 sentences | 3-5 sentences | 3-5 sentences |
| INPUT CONTRACT | User input | State detection | Previous phase output | Test plan / scope |
| OBJECTIVE | Route correctly | Orchestrate chain | Domain goal | Technical goal |
| METHODOLOGY | Minimal (routing) | Moderate (state) | Extensive (reasoning) | Extensive (domain) |
| PROGRESS TRACKING | Omit | Omit | Always present | Omit |
| EXECUTION | 2-3 steps | 3-5 steps | 3-7 steps | 3-6 steps |
| OUTPUT CONTRACT | Directory creation | State update | Files produced | Findings + evidence |
| NEXT | Load workflow | Load phase | Load next phase | Return to coordinator |
| CHECKPOINTS | Inputs confirmed | Phase loaded | Files verified | Finding recorded |

---

## Chaining Example

How prompts chain through the career skill:

```
/career-search                    /career
(command prompt)                  (command prompt)
    │                                 │
    ▼                                 ▼
discover-jobs.ts              phases/00-workflow.md
(script — not a prompt)       (workflow prompt)
    │                                 │
    ▼                                 ▼
Ranked job list               phases/01-assess.md
(returned to user)            (phase prompt — GO/NO-GO gate)
    │                                 │
    │    User picks jobs              ├─ NO-GO → STOP
    │    and runs /career             │
    └─────────────────────┐           ├─ GO ──────────────────┐
                          │           │                       ▼
                          └───────────┘               phases/02-research.md
                                                      (phase prompt)
                                                              │
                                                              ▼
                                                      phases/03-prepare.md
                                                      (phase prompt)
                                                              │
                                                              ▼
                                                      phases/04-generate.md
                                                      (phase prompt)
                                                              │
                                                              ▼
                                                      phases/05-deliver.md
                                                      (phase prompt — last)
                                                              │
                                                              ▼
                                                      6 deliverables in
                                                      output/{company}-{role}-{date}/
```

Each arrow is an explicit NEXT → INPUT CONTRACT handoff. Every prompt knows what comes before it and what comes after it by exact file path.

---

## Prompt Engineering Techniques Applied

These Anthropic best practices are embedded in the structure:

| Technique | Where Applied |
|-----------|---------------|
| **Role prompting** | IDENTITY section — domain expertise, constraints |
| **Chain of thought** | METHODOLOGY section — structured reasoning before execution |
| **Few-shot examples** | EXECUTION section — expected outputs per step |
| **XML tags for structure** | Section headers create parseable structure |
| **Explicit tool directives** | EXECUTION — exact tool names, exact purposes |
| **Output format specification** | OUTPUT CONTRACT — JSON schemas, template paths |
| **Prompt chaining** | INPUT/OUTPUT/NEXT contracts — explicit handoffs |
| **Progress transparency** | PROGRESS TRACKING — dynamic checklist from EXECUTION steps |
| **Self-validation** | CHECKPOINTS — verify before proceeding |
| **Constraint specification** | IDENTITY + OBJECTIVE — what to do AND what not to do |
| **Long context management** | Documents at top (IDENTITY, INPUT), instructions at bottom (EXECUTION) |

---

## Shared Components

Shared components use `@include()` syntax for reusable sections:

```markdown
### Authorization Check
@include(shared/authorization-check.md)

### Scope Validation
@include(shared/scope-validation.md)

### Evidence Capture
@include(shared/evidence-capture.md)
```

Shared components live in `skills/{skill}/prompts/shared/` and follow the same universal structure. They are mini-prompts with IDENTITY, EXECUTION, and CHECKPOINTS sections.

---

## Naming Conventions

**Phase files:** `NN-name.md` (e.g., `01-assess.md`, `02-research.md`)

**Workflow files:** `00-workflow.md` (always the orchestrator)

**Technique prompts:** `{category}/{technique-name}.md` (e.g., `injection/sqli-mysql-error-based.md`)
- One level of nesting only — no deeper than `prompts/{category}/{name}.md`

**Command files:** `{command-name}.md` (e.g., `career.md`, `career-search.md`)

**Shared components:** `shared/{component-name}.md` (e.g., `shared/authorization-check.md`)

---

## Anti-Patterns

### Command checklist without reasoning

**Bad:**
```markdown
1. Search for company
2. Check Glassdoor
3. Find CISO on LinkedIn
4. Write report
```

**Good:** METHODOLOGY section explains WHY to prioritize leadership research, WHEN to skip Glassdoor (small startup), and HOW to adapt for different company types. EXECUTION then gives specific steps.

### Hallucinated tools

**Bad:**
```markdown
Use the CompanyResearch tool to gather intel
```

**Good:**
```markdown
**Tool:** WebSearch
**Query pattern:** "[Company Name] company overview headquarters"
```

Only reference tools that exist in the framework (WebSearch, WebFetch, Glob, Grep, Read, Write, Edit, Bash) or in `tools/REGISTRY.json`.

### Missing I/O contracts

**Bad:**
```markdown
After research is done, move to interview prep.
```

**Good:**
```markdown
## OUTPUT CONTRACT
**Produces:** `company-research.md` → `skills/career/output/{dir}/company-research.md`

## NEXT
**On success:** → Load `skills/career/phases/03-prepare.md`
  Pass: `company-research.md` + `match-assessment.md` from output directory
```

### Undefined NEXT steps

**Bad:**
```markdown
## Next Phase
Proceed to the next step.
```

**Good:**
```markdown
## NEXT
**On success:** → Load `skills/career/phases/04-generate.md`
  Pass: All Phase 1-3 output files in `skills/career/output/{company}-{role}-{date}/`
```

### Identity inherited from routing

**Bad:** (no IDENTITY section — relies on agent routing to set context)

**Good:**
```markdown
## IDENTITY
You are a career advisor performing company research. You gather intelligence
from web sources and social media. You cite all sources inline. You never
fabricate company information.
```

### Phases inlining technique details

**Bad:** Phase prompt contains 50 lines of sqlmap flags and expected outputs

**Good:** Phase says "Load `prompts/web-api/injection/sqli-mysql-error-based.md`" — the technique prompt owns the detail. Phases orchestrate, technique prompts execute.

---

## SKILL.md Chain Map

Every SKILL.md includes a chain map showing the complete prompt chain:

```markdown
## Chain Map

```
/career-search → discover-jobs.ts → ranked results → user picks → /career
                                                                     │
/career → phases/00-workflow.md ─┬→ 01-assess.md (GO/NO-GO gate)
                                 ├→ 02-research.md (10+ sources)
                                 ├→ 03-prepare.md (priority areas + Q&A)
                                 ├→ 04-generate.md (6 deliverables)
                                 └→ 05-deliver.md (submission strategy)
                                          │
                                          ▼
                                 output/{company}-{role}-{date}/
                                 ├── job-posting.md
                                 ├── match-assessment.md
                                 ├── company-research.md
                                 ├── interview-prep.md
                                 ├── resume.md
                                 └── cover-letter.md
```
```

This gives any reader an instant understanding of the complete workflow.

---

## Quick Reference

**Creating a new prompt? Follow this checklist:**

- [ ] METADATA frontmatter with domain, skill, agent
- [ ] IDENTITY — who is this prompt? (forced, not inherited)
- [ ] INPUT CONTRACT — what does it receive? (exact paths)
- [ ] OBJECTIVE — what does it accomplish? (pass/fail criteria)
- [ ] METHODOLOGY — how to think about this? (scale to complexity)
- [ ] PROGRESS TRACKING — dynamic checklist with phase metrics (phases only)
- [ ] EXECUTION — what steps? (exact tools, exact documents)
- [ ] OUTPUT CONTRACT — what does it produce? (exact paths)
- [ ] NEXT — what happens after? (exact file path, conditions)
- [ ] CHECKPOINTS — how to verify? (exit criteria, error recovery)

**See also:**
- `skills/create/templates/PROMPT-TEMPLATE.md` — Fill-in-the-blank template
- `skills/create/templates/PHASE-TEMPLATE.md` — Phase-specific template
- `skills/create/templates/COMMAND-TEMPLATE.md` — Command-specific template
- `skills/create/docs/prompt-creation-guide.md` — Step-by-step creation guide

---

**Framework:** Intelligence Adjacent (IA)
