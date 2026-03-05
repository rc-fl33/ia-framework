# Structured Return Formats

**Standard completion formats for all agents.**
**Adapted from:** GSD structured returns pattern

Every agent must end its work with one of three structured return types.
The orchestrator uses these to determine next actions without parsing freeform text.

---

## Return Type: COMPLETE

Use when the task finished successfully.

```
## COMPLETE

**Agent:** [agent-name]
**Task:** [5-6 word description]
**Status:** All objectives met

**Produced:**
- [file-or-artifact-1] → [path]
- [file-or-artifact-2] → [path]

**Verification:** [PASSED | N/A]
**Summary:** [1-2 sentence description of what was accomplished]
```

**Rules:**
- List ALL files created or modified under Produced
- Verification is PASSED only if three-level verification ran (engineer) or QA passed (writer)
- Verification is N/A for research, advisory, and legal work without file output
- Summary should state outcomes, not process ("Applied 3 hardening fixes" not "Ran the workflow")

---

## Return Type: BLOCKED

Use when the agent cannot proceed and needs intervention.

```
## BLOCKED

**Agent:** [agent-name]
**Task:** [5-6 word description]
**Blocked at:** [step or phase where blocked]

**Reason:** [specific, actionable description of the blocker]
**Attempted:** [what was tried before declaring blocked]
**Needed:** [exactly what must happen to unblock]
```

**Common blockers:**
- Missing authorization (security: no SCOPE.md)
- Missing credentials or access (engineer: SSH unreachable)
- Missing input files (any: prerequisite output doesn't exist)
- Dependency failure (engineer: package won't install, service won't start)
- Scope ambiguity (any: requirements unclear, multiple valid interpretations)

**Rules:**
- Never report BLOCKED without listing what was Attempted
- Needed must be specific and actionable ("provide SCOPE.md" not "fix the issue")
- If partially complete, list completed work under an additional Partial section

---

## Return Type: NEEDS_INPUT

Use when the agent needs a user decision or information to continue.

```
## NEEDS_INPUT

**Agent:** [agent-name]
**Task:** [5-6 word description]
**Question:** [clear, specific question]

**Context:** [why this decision matters — 1-2 sentences]
**Options:**
1. [option A] — [tradeoff or implication]
2. [option B] — [tradeoff or implication]
3. [option C, if applicable] — [tradeoff or implication]

**Default:** [recommended option, if one exists] — [why]
**Completed so far:** [what's done, so user has context]
```

**Rules:**
- Question must be answerable in one response (not open-ended)
- Options must be concrete and distinct (not "A or not A")
- Always include a Default recommendation when possible
- If no recommendation possible, state "No default — depends on [factor]"

---

## Partial Completion Addendum

When returning BLOCKED or NEEDS_INPUT with partial work done, add:

```
**Partial:**
- [completed item 1] → [path or description]
- [completed item 2] → [path or description]
```

This prevents re-work when the agent resumes.

---

## Quick Reference

| Situation | Return | Key Field |
|-----------|--------|-----------|
| Task done, all objectives met | COMPLETE | Produced (files list) |
| Cannot proceed, need intervention | BLOCKED | Needed (unblock action) |
| Need user decision to continue | NEEDS_INPUT | Options (concrete choices) |
| Task done but with limitations | COMPLETE | Summary (note limitations) |
| Partially done, then blocked | BLOCKED | Partial (completed work) |
