# Multi-Phase Workflow Pattern: Orchestration & State Management

**Classification:** Public (reusable pattern documentation)
**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-04

---

## Overview

The **multi-phase workflow pattern** is an architectural approach for breaking complex tasks into sequential phases with mandatory gates between each phase. This document explains the pattern, how it works, and how to implement it in your own skills.

---

## Core Concepts

### What is a Multi-Phase Workflow?

A multi-phase workflow breaks a complex task into smaller, manageable phases:

```
START → PHASE 1 → GATE → PHASE 2 → GATE → PHASE 3 → GATE → END
```

Each phase:
1. Has a specific responsibility
2. Produces outputs
3. Must pass a gate before proceeding
4. Cannot be skipped
5. Records its status

### Why Use This Pattern?

**Benefits:**
- **Clear Progress** - User can see exactly where they are in the workflow
- **Error Recovery** - Can retry a phase without restarting from beginning
- **Quality Gates** - Prevent bad work from advancing
- **Parallel Work** - Multiple workflows can run simultaneously
- **Resume Support** - Can pause and resume without losing state
- **Documentation** - Each phase is self-contained and testable

---

## Workflow State Management

### State Structure

Each workflow maintains a `metadata.json` file tracking state:

```json
{
  "workflow_id": "2026-02-04-example-topic",
  "created_at": "2026-02-04T12:00:00Z",
  "updated_at": "2026-02-04T14:30:00Z",
  "status": "in_progress",
  "current_phase": 3,
  "phases": {
    "1_research": {
      "name": "RESEARCH",
      "status": "completed",
      "started_at": "2026-02-04T12:00:00Z",
      "completed_at": "2026-02-04T12:45:00Z",
      "gate_passed": true,
      "gate_reason": "10+ sources collected",
      "outputs": ["sources.txt", "research-notes.md"]
    },
    "2_draft": {
      "name": "DRAFT",
      "status": "completed",
      "started_at": "2026-02-04T12:45:00Z",
      "completed_at": "2026-02-04T13:30:00Z",
      "gate_passed": true,
      "gate_reason": "Brand voice applied, 800 words",
      "outputs": ["draft.md"]
    },
    "3_qa": {
      "name": "QA",
      "status": "in_progress",
      "started_at": "2026-02-04T13:30:00Z",
      "completed_at": null,
      "gate_passed": null,
      "gate_reason": null,
      "outputs": []
    },
    "4_visuals": {
      "name": "VISUALS",
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "gate_passed": null,
      "gate_reason": null,
      "outputs": []
    },
    "5_output": {
      "name": "OUTPUT",
      "status": "pending",
      "started_at": null,
      "completed_at": null,
      "gate_passed": null,
      "gate_reason": null,
      "outputs": []
    }
  }
}
```

### Phase Status Values

- **pending** - Not started yet (waiting for previous phase to complete)
- **in_progress** - Currently executing
- **completed** - Phase finished, gate validation passed
- **blocked** - Phase cannot proceed (gate failed)
- **skipped** - Phase optional and user chose to skip

---

## Phase Orchestrator Pattern

### Directory Structure

```
skills/example/
├── phases/
│   ├── 00-workflow.md      # Orchestrator that determines current phase
│   ├── 01-phase.md         # First phase implementation
│   ├── 02-phase.md         # Second phase implementation
│   ├── 03-phase.md         # Third phase implementation
│   └── ...
├── scripts/
│   ├── workflow-orchestrator.ts  # Phase detection + routing logic
│   ├── phase-runner.ts           # Execute specific phase
│   └── gate-validator.ts         # Validate gate requirements
└── output/
    └── workflows/
        └── YYYY-MM-DD-workflow-id/
            ├── metadata.json
            ├── phase-outputs/
            └── ...
```

### Orchestrator Logic

**File: `phases/00-workflow.md`** (or `00-WORKFLOW.md`)

The orchestrator is responsible for:
1. Reading `metadata.json` to determine current state
2. Detecting which phase should run
3. Validating gates from previous phase
4. Routing to correct phase file
5. Updating metadata after phase completes

**Example Orchestrator Logic:**

```typescript
// Load metadata
const metadata = readJSON('output/YYYY-MM-DD-title/metadata.json');

// Determine current phase
const currentPhase = metadata.current_phase;
const currentPhaseStatus = metadata.phases[`${currentPhase}_name`];

// Route based on status
switch (currentPhaseStatus.status) {
  case 'pending':
    // Phase not started - begin it
    executePhase(currentPhase);
    break;

  case 'in_progress':
    // Phase ongoing - resume it
    resumePhase(currentPhase);
    break;

  case 'completed':
    // Phase done - check gate
    if (currentPhaseStatus.gate_passed) {
      // Gate passed - advance to next phase
      advanceToNextPhase(currentPhase + 1);
    } else {
      // Gate failed - retry current phase
      retryPhase(currentPhase);
    }
    break;
}

// Update metadata
saveJSON('metadata.json', metadata);
```

---

## Gate Validation Pattern

### Gate Definition

A gate is a validation step that must pass before advancing:

```
┌──────────────────────────────────────────────────────┐
│ PHASE COMPLETE                                       │
└──────────────────────────────────────────────────────┘
                        ↓
                   [GATE CHECK]
                        ↓
         ┌──────────────┴──────────────┐
         ↓                             ↓
    GATE PASSES                   GATE FAILS
         ↓                             ↓
    ADVANCE                        RETRY PHASE
```

### Gate Implementation

```typescript
interface Gate {
  name: string;
  description: string;
  validate: (context: PhaseContext) => boolean;
  failureMessage: string;
  recoverySteps: string[];
}

// Example: RESEARCH gate
const researchGate: Gate = {
  name: "TEN_SOURCES",
  description: "Minimum 10 credible sources collected",
  validate: (ctx) => {
    const sources = readFile('sources.txt');
    const count = sources.split('\n').filter(s => s.trim()).length;
    return count >= 10;
  },
  failureMessage: "Fewer than 10 sources found",
  recoverySteps: [
    "1. Return to RESEARCH phase",
    "2. Gather additional sources",
    "3. Update sources.txt",
    "4. Re-run gate validation"
  ]
};
```

### Hard vs Soft Gates

**Hard Gate** - MUST pass, no exceptions
- Example: QA rating must be 5.0/5.0 (no 4.9 allowed)
- Blocks phase advancement
- Requires retry or skip

**Soft Gate** - Recommended but optional
- Example: Images preferred but not required
- Generates warning but allows advancement
- User can acknowledge and proceed

---

## Phase Implementation Pattern

### Phase File Structure

Each phase file should include:

```markdown
---
phase: 1
name: RESEARCH
gate: 10+ sources collected
estimated_duration: 45 minutes
---

# Phase 1: RESEARCH

## What Happens in This Phase

[Clear explanation of phase purpose]

## Inputs

- From previous phase: [what comes in]
- From user: [what user provides]

## Process

1. Step 1...
2. Step 2...
3. Step 3...

## Gate Validation

**GATE:** 10+ credible sources documented

Verification:
- Each source has URL and citation
- No low-authority sources
- Diverse perspectives included

## Outputs

- `sources.txt` - List of sources
- `research-notes.md` - Key findings
- `metadata.json` - Phase completion metadata

## Error Recovery

If gate fails:
1. Review feedback in metadata.json
2. Collect additional sources
3. Update outputs
4. Retry phase

## Next Phase

If gate passes:
→ Advance to Phase 2: DRAFT
```

---

## Checkpoint Output Format

After each phase, output a checkpoint showing progress:

```
╔═══════════════════════════════════════════════════════════╗
║                    CHECKPOINT REACHED                     ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║  Workflow: example-workflow-2026-02-04                   ║
║  Phase: 2/5 (DRAFT)                                      ║
║  Status: ✅ COMPLETED                                     ║
║                                                           ║
║  Phase Duration: 1h 15m                                   ║
║  Total Duration: 2h 3m                                    ║
║                                                           ║
║  Gate Validation: ✅ PASSED                               ║
║    Reason: Brand voice applied, 850 words                ║
║                                                           ║
║  Outputs Generated:
║    • draft.md (850 lines)                                 ║
║    • metadata.json (updated)                              ║
║                                                           ║
║  Next Phase: 3/5 - QA (Quality Assurance)                ║
║    Estimated Duration: 1h 30m                             ║
║    Gate: 5.0/5.0 quality rating required                 ║
║                                                           ║
║  Actions:
║    → Resume automatically? (yes/no/review-first)         ║
║    → Show phase details? (/show-phase 3)                 ║
║    → Save checkpoint? (auto-saved)                        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

---

## Resume/Pause Pattern

### Saving State

After each phase:
```json
{
  "workflow_id": "...",
  "status": "paused_at_phase_3",
  "current_phase": 3,
  "checkpoint_timestamp": "2026-02-04T14:30:00Z",
  "can_resume": true,
  "phases": { /* ... */ }
}
```

### Resuming Workflow

```typescript
// Resume from checkpoint
const metadata = loadMetadata('workflow-id');

if (metadata.status === 'paused_at_phase_3') {
  console.log(`Resuming workflow from Phase ${metadata.current_phase}`);
  executePhase(metadata.current_phase);
}
```

---

## Parallel Workflows

Multiple workflows can run independently:

```
Workflow A: RESEARCH → DRAFT → QA → VISUALS → OUTPUT
            ✅         ✅      ⏳

Workflow B: RESEARCH → DRAFT → QA → VISUALS → OUTPUT
            ✅         ⏳

Workflow C: RESEARCH → DRAFT → QA → VISUALS → OUTPUT
            ⏳
```

Each maintains its own `metadata.json` in separate directories.

---

## Validation & Testing

### Testing a Phase

```typescript
// Test Phase 2: DRAFT
test('Phase 2 - DRAFT should pass gate with 500+ words', () => {
  const draft = readFile('draft.md');
  const wordCount = countWords(draft);
  expect(wordCount).toBeGreaterThanOrEqual(500);
  expect(hasBrandVoice(draft)).toBe(true);
});
```

### Testing Gate Logic

```typescript
// Test RESEARCH gate
test('RESEARCH gate should fail with < 10 sources', () => {
  const sources = ['source1', 'source2', ...]; // 8 items
  const result = validateResearchGate(sources);
  expect(result.passed).toBe(false);
  expect(result.reason).toContain('10 sources');
});
```

---

## Real-World Implementation Example

See `/skills/write/` for a working implementation:
- Orchestrator: `phases/00-workflow.md`
- Phases: `phases/01-research.md`, `phases/02-draft.md`, etc.
- State management: `scripts/document-workflow.ts`
- Output structure: `output/documents/YYYY-MM-DD-topic/`

---

## Related Documentation

- `docs/guides/patterns/content-workflow-pattern.md` - The 5-phase content workflow
- `docs/guides/patterns/content-writing-architecture.md` - /write vs /ghost skills
- `skills/write/SKILL.md` - Implementation details

---

## Key Takeaways

1. **Phases are sequential** - Cannot skip or reorder
2. **Gates are mandatory** - Must pass before advancing
3. **State is tracked** - metadata.json holds workflow progress
4. **Resumable** - Can pause and resume without losing state
5. **Parallelizable** - Multiple workflows run independently
6. **Testable** - Each phase can be tested in isolation

---

**Framework:** Intelligence Adjacent (IA)
**Status:** Public pattern documentation
**Reusable:** Yes - other skills can implement this workflow
