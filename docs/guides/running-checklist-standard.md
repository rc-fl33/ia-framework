# Running Checklist Standard

**Dynamic progress tracking for all skill phases.**

Every phase that executes multi-step work displays a running checklist to the user. The checklist is generated dynamically from the phase's EXECUTION steps — not hardcoded.

**Version:** 1.0
**Last Updated:** 2026-02-12

---

## Core Principle

The agent reads the EXECUTION section, filters steps by current mode and effort level, and builds a checklist at runtime. This eliminates static templates, mode-specific duplication, and hardcoded example values. One PROGRESS TRACKING section per phase replaces all mode variants.

---

## Symbol Set

```
PROGRESS INDICATORS:
  ✓  = Step completed
  ▸  = Step in-progress (only ONE at a time)
  □  = Step pending (not started)

STRUCTURE:
  ─  (U+2500)  = Section divider (repeated)
  ├─ (U+251C)  = Tree branch (intermediate item)
  └─ (U+2514)  = Tree branch (final item)

BORDERS:
  ═  (U+2550)  = Major section border (workflow-level summaries only)
```

No emoji. Terminal-safe Unicode only.

---

## Display Format

### In-Progress (shown after each EXECUTION step completes)

```
PHASE {N}: {PHASE-NAME}
────────────────────────────────
✓ {Completed step title}
✓ {Completed step title}
▸ {Current step title} — {brief status}
□ {Pending step title}
□ {Pending step title}

{Metrics line}
Progress: {completed}/{total} steps
```

**Rules:**
- Phase header uses the phase name from the `# Phase N:` heading
- Step titles come from EXECUTION step headings (text after `### Step N:`)
- Only ONE ▸ indicator at a time — the step currently executing
- Brief status after ▸ describes what's happening (1 clause, not a sentence)
- Metrics line shows phase-specific counters (defined per phase)
- Progress shows fraction, not percentage — `3/6 steps` not `50%`

### Completion (shown when phase gate passes)

```
PHASE {N}: {PHASE-NAME} — COMPLETE
────────────────────────────────
✓ {Step 1 title}
✓ {Step 2 title}
✓ {Step 3 title}
✓ {Step N title}

Files: {list of files created}
{Metrics line with final values}
Progress: {N}/{N} steps

Ready for Phase {N+1}: {NEXT-PHASE-NAME} →
```

### Grand Summary (final phase only, end of workflow)

```
══════════════════════════════════════════
  {SKILL-NAME} WORKFLOW COMPLETE
══════════════════════════════════════════

Phase 1: {NAME} ..................... COMPLETE
├─ {Key metric or mode indicator}
└─ Files: {file list}

Phase 2: {NAME} ..................... COMPLETE
├─ {Key metric}
└─ Files: {file list}

[... all phases ...]

══════════════════════════════════════════
Output: {output directory path}
Deliverables: {total file count} files
══════════════════════════════════════════
```

**Rules:**
- Double-line borders (`═`) only at workflow level
- Dot leaders for visual alignment
- Two metrics max per phase (keeps it scannable)
- Tree branches (`├─`, `└─`) for sub-items
- No emoji, no fictional numbers, no engagement time

---

## Display Timing

**Show updated checklist after each EXECUTION step completes.** Not after each tool call.

**Exception:** For long steps with multiple sub-steps (e.g., `Step 1a`, `Step 1b`, `Step 1c`), display after each sub-step.

**At phase start:** Display all items as □ (pending).
**At phase end:** Display all items as ✓ with final metrics and gate status.

---

## Dynamic Generation Rules

The PROGRESS TRACKING section in each phase instructs the agent to build the checklist. The agent follows these rules:

### 1. Parse EXECUTION Steps

Read the EXECUTION section headings:
- `### Step N: {Title}` → becomes a checklist item
- `### Step Na: {Title}` → becomes a sub-item (indented under parent)
- Steps inside `**For {MODE} Mode:**` blocks → tagged to that mode

### 2. Filter by Mode and Effort

- Steps marked `**Applies:** {MODE} only` → include only for that mode
- Steps marked `(STANDARD+ only)` or `**SKIP if effort = QUICK**` → exclude for QUICK
- Steps inside mode-specific blocks → include only for matching mode
- Unmarked steps → include for all modes

### 3. Build and Display

- Create checklist from filtered step titles
- All items start as □
- After each step completes: mark ✓, advance ▸ to next
- Populate metrics from actual execution results (counts, findings, files)

---

## Conditional Step Markers

Add visible markers to EXECUTION steps that are conditional:

```markdown
### Step 2b: Automated Research
**Applies:** All modes | **Effort:** STANDARD+ | **Blocking:** No
```

Marker format: `**Applies:** {modes} | **Effort:** {minimum effort} | **Blocking:** {Yes|No}`

- **Applies** — Which modes include this step. Omit if all modes.
- **Effort** — Minimum effort level. Omit if all effort levels.
- **Blocking** — Whether failure blocks the phase. Omit if blocking (default = Yes).

For mode-branching steps (where the step exists for all modes but does different work):

```markdown
### Step 1: Analyze

**For AD-HOC Mode:**
[instructions]

**For ARCH-REVIEW Mode:**
[instructions]

**For CODE-REVIEW Mode:**
[instructions]
```

The checklist shows the step once — the mode determines which instructions execute.

---

## Phase-Specific Metrics

Each phase declares metrics in its PROGRESS TRACKING section. Metrics are populated during execution from actual values.

### Metric Patterns by Phase Type

**Intake phases** (context gathering):
- Technologies detected, sources consulted, files created

**Analysis phases** (deep work):
- Findings by severity, components analyzed, sources referenced

**Recommendation phases** (prioritization):
- Items by priority (P0/P1/P2/P3), frameworks referenced

**Documentation phases** (output generation):
- Files created/total, quality check result, placeholder count

**Delivery phases** (verification):
- Files verified, deliverable count, critical items

### Metric Format

```
Metrics: {key}: {value} | {key}: {value} | {key}: {value}
```

Single line, pipe-separated. Values are actual counts from execution — never hardcoded examples.

---

## PROGRESS TRACKING Section Template

Add this section to each phase file between METHODOLOGY and EXECUTION:

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
- {metric 1}: {what to count}
- {metric 2}: {what to count}
```

The metrics list is the only phase-specific content. Everything else is standard.

---

## Worked Examples

### Example 1: Single-Mode Skill (ghost Phase 2: Draft)

```
PHASE 2: DRAFT
────────────────────────────────
✓ Load outline from Phase 1
✓ Write introduction section
▸ Write body sections — Section 3 of 5
□ Write conclusion
□ Add internal links
□ Final word count check

Metrics: Sections: 3/5 | Word count: 1,247
Progress: 3/6 steps
```

### Example 2: Multi-Mode Skill (advisory Phase 2: Analyze, ARCH-REVIEW)

```
PHASE 2: ANALYZE (Architecture Security Analysis)
────────────────────────────────
✓ Load research context
✓ Architecture decomposition
✓ Trust boundary analysis
▸ Threat identification — Applying STRIDE to auth boundary
□ Risk assessment
□ Write analysis output

Metrics: Components: 8 | Trust boundaries: 5 | Threats: 12
Progress: 4/6 steps
```

### Example 3: Completion Display

```
PHASE 3: RECOMMEND — COMPLETE
────────────────────────────────
✓ Process analysis findings
✓ Prioritize by severity and exploitability
✓ Draft recommendations with rationale
✓ Map to compliance frameworks
✓ Add implementation guidance
✓ Write recommendations output

Files: RECOMMENDATIONS.md
Metrics: P0: 2 | P1: 5 | P2: 8 | P3: 3 | Frameworks: NIST CSF, OWASP
Progress: 6/6 steps

Ready for Phase 4: DOCUMENT →
```

---

## Integration with UPS

PROGRESS TRACKING is section 6 of the Universal Prompt Structure (between METHODOLOGY and EXECUTION):

```
METADATA → IDENTITY → INPUT CONTRACT → OBJECTIVE →
METHODOLOGY → PROGRESS TRACKING → EXECUTION →
OUTPUT CONTRACT → NEXT → CHECKPOINTS
```

See `universal-prompt-structure.md` for the complete UPS reference.

---

## Files That Should NOT Have PROGRESS TRACKING

- **Workflow orchestrators** (`00-workflow.md`) — coordinate phases, don't execute steps
- **Command files** (`commands/*.md`) — route requests, don't execute steps
- **Technique prompts** — loaded by phases, not standalone workflows

Only **phase files** (`01-*.md` through `NN-*.md`) get PROGRESS TRACKING sections.

---

**Framework:** Intelligence Adjacent (IA)
