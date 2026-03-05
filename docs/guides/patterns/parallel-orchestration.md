---
audience: advanced
category: architecture
related_docs:
  - docs/architecture/agent-routing-architecture.md
---


# Parallel Task Orchestration

**How the IA Framework handles concurrent task execution across multiple agents.**

---

## When to Parallelize

Use parallel orchestration when **3+ independent tasks** are detected with no dependencies between them.

**Detection Criteria:**
- Tasks map to different agents/skills
- No sequential dependencies ("then", "after", "once done")
- Each task produces independent output

---

## Orchestration Protocol

### 1. Create Manifest

Create orchestration manifest: `sessions/parallel-{timestamp}.json`

### 2. Spawn Subagents

```
Task(subagent_type="agent", run_in_background=true,
     prompt="[Task]. Write results to sessions/parallel-{id}-task-N.md using PARALLEL-TASK-OUTPUT-TEMPLATE format")
```

### 3. Monitor Progress

- Continue with foreground work or monitor via TaskOutput
- Collect results from `sessions/parallel-{id}-task-*.md`

### 4. QA Validation


### 5. Merge Results

Present unified summary to user

---

## Subagent Requirements

| Requirement | Description |
|-------------|-------------|
| Output Path | MUST write to specified `sessions/` path |
| Template | MUST use `docs/templates/parallel-task-output-template.md` format |
| Completion Marker | MUST include `[TASK:complete]` marker when done |
| No Nesting | CANNOT spawn additional subagents |

---

## Quality Standards

**Parallel does not mean lower standards.** Each subagent follows the full workflow for its task type:

- Research tasks: Full source verification
- Implementation tasks: Full testing and validation
- Content tasks: Full QA review

---

## Related Documentation

- `docs/templates/parallel-task-output-template.md` - Output format
- `docs/architecture/agent-routing-architecture.md` - Agent selection

---

**Last Updated:** 2026-01-20
