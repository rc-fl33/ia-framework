# Phase: [Domain-Specific Name]

**Maps to Universal Phase:** [UNDERSTAND | PLAN | EXECUTE | VERIFY | LEARN]

**Purpose:** [What this phase achieves for THIS skill - be specific to the domain]

**Success Criteria Mutation:** [CREATE | COMPLETE | ORDER | REFINE | ADVANCE | CONFIRM]

---

## Gate Question

> "[Domain-specific question that must be YES to proceed]"

**Examples by Universal Phase:**
- UNDERSTAND: "Do I have clear, testable requirements?"
- PLAN: "Is each step sequenced and verifiable?"
- EXECUTE: "Is each row DONE or BLOCKED?"
- VERIFY: "Did I verify each completion?"
- LEARN: "Can user rate this output?"

---

## Pass Criteria

**Before proceeding to next phase, ALL must be true:**

- [ ] [Specific checkpoint 1 for this domain]
- [ ] [Specific checkpoint 2 for this domain]
- [ ] [Specific checkpoint 3 for this domain]
- [ ] Gate question answered YES

---

## What Happens

**Step-by-step actions for this phase:**

1. [Domain-specific action 1]
2. [Domain-specific action 2]
3. [Domain-specific action 3]
4. [Update Success Criteria status]

---

## Capabilities Available

**Tools/agents available during this phase (by effort level):**

| Capability | Effort Min | When to Use |
|------------|------------|-------------|
| [capability.name] | QUICK | [description] |
| [capability.name] | STANDARD | [description] |
| [capability.name] | THOROUGH | [description] |

**Reference:** `Data/Capabilities.yaml` for full capability list

---

## Success Criteria Updates

**How this phase mutates Success Criteria rows:**

| Mutation | What Happens |
|----------|--------------|
| CREATE | Add new rows from request/context |
| COMPLETE | Fill in missing details on existing rows |
| ORDER | Sequence rows by dependency |
| REFINE | Make rows specific and verifiable |
| ADVANCE | Move status PENDING → ACTIVE → DONE |
| CONFIRM | Verify DONE status is accurate |

**This phase performs:** [MUTATION TYPE]

---

## Exit Criteria

**Phase is complete when:**

- [ ] All phase actions completed
- [ ] Success Criteria rows updated appropriately
- [ ] Gate question answered YES
- [ ] Ready to proceed to next phase

---

## Error Recovery

| Error | Recovery Action |
|-------|-----------------|
| [Common error 1] | [How to recover] |
| [Common error 2] | [How to recover] |
| Gate question = NO | [What to do to make it YES] |

---

## Phase Mapping Reference

**The 5 Universal Phases (preserving 7-phase logic):**

```
UNDERSTAND (OBSERVE + THINK)
├─ Parse request → identify EXPLICIT requirements
├─ Load context → infer INFERRED requirements
├─ Add standards → IMPLICIT requirements
└─ Mutation: CREATE + COMPLETE rows

PLAN (PLAN + BUILD)
├─ Order rows by dependency
├─ Assign capabilities to each row
├─ Make each row specific and verifiable
└─ Mutation: ORDER + REFINE rows

EXECUTE
├─ Work through each row
├─ Update status: PENDING → ACTIVE → DONE
├─ Handle BLOCKED rows with iteration
└─ Mutation: ADVANCE status

VERIFY
├─ Test each DONE row
├─ Confirm completion meets criteria
├─ Mark ADJUSTED if deviated
└─ Mutation: CONFIRM status

LEARN
├─ Present output to user
├─ Capture feedback (explicit or implicit)
├─ Feed into memory for improvement
└─ Mutation: OUTPUT results
```

---

**Template Version:** 1.0
