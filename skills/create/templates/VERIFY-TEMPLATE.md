# Definition of Done: [Skill Name]

**This checklist defines completion criteria for [skill-name] skill outputs.**

---

## Pre-Execution Verification

**Before starting, verify:**

- [ ] Correct agent is executing (check routing gate)
- [ ] Effort level classified (QUICK / STANDARD / THOROUGH)
- [ ] If THOROUGH: EnterPlanMode called and plan approved
- [ ] Input requirements met (files exist, APIs accessible)
- [ ] Success Criteria created (for STANDARD+ effort)

---

## Phase Gate Verification

**Each phase gate must pass:**

| Phase | Gate Question | Verified |
|-------|---------------|----------|
| UNDERSTAND | "Do I have clear, testable requirements?" | [ ] |
| PLAN | "Is each step sequenced and verifiable?" | [ ] |
| EXECUTE | "Is each row DONE or BLOCKED?" | [ ] |
| VERIFY | "Did I verify each completion?" | [ ] |
| LEARN | "Can user rate this output?" | [ ] |

---

## Success Criteria Verification

**All Success Criteria rows must have final status:**

- [ ] No rows remain in PENDING status
- [ ] No rows remain in ACTIVE status
- [ ] All rows are DONE, ADJUSTED, or BLOCKED (with documented reason)
- [ ] ADJUSTED rows have deviation documented
- [ ] BLOCKED rows have blockers documented

---

## Output Verification

**Deliverables must meet quality standards:**

### File Outputs
- [ ] All expected output files exist
- [ ] Files saved to correct location (`private/output/{skill-name}/`)
- [ ] File formats are correct (markdown, yaml, etc.)
- [ ] No placeholder content remaining

### Content Quality
- [ ] Content is complete (no TODO markers)
- [ ] Content is accurate (verified against sources)
- [ ] Content follows skill-specific standards
- [ ] No hardcoded counts or time estimates

### Technical Quality
- [ ] Code syntax is valid (if applicable)
- [ ] No credentials or secrets exposed
- [ ] Paths are correct and files accessible

---

## Skill-Specific Verification

**[Customize this section for your skill's domain]**

### [Domain Area 1]
- [ ] [Specific check 1]
- [ ] [Specific check 2]

### [Domain Area 2]
- [ ] [Specific check 1]
- [ ] [Specific check 2]

---

## QA Review (STANDARD+ Effort)

**For STANDARD and THOROUGH effort levels:**

- [ ] QA review completed (advisor agent)
- [ ] QA rating achieved: ___/5.0
- [ ] If < 5.0: Issues addressed and re-reviewed
- [ ] Final QA rating: 5.0/5.0

---

## User Acceptance

**Final verification with user:**

- [ ] Output presented to user
- [ ] User can access all deliverables
- [ ] User feedback captured (if provided)
- [ ] Any follow-up items documented

---

## Post-Completion

**After marking complete:**

- [ ] Success Criteria table finalized
- [ ] Learnings documented (LEARN phase)
- [ ] Related documentation updated (if applicable)
- [ ] Output location communicated to user

---

## Completion Certification

**This skill execution is COMPLETE when:**

1. All pre-execution checks passed
2. All phase gates verified
3. All Success Criteria rows have final status
4. All output verification checks passed
5. QA review achieved 5.0/5.0 (for STANDARD+ effort)
6. User can access and verify deliverables

**Incomplete if ANY checkbox above is unchecked.**

---

## Failure Recovery

**If verification fails:**

| Failure Type | Recovery Action |
|--------------|-----------------|
| Phase gate failed | Return to phase, address gap |
| Success Criteria BLOCKED | Document blocker, notify user |
| Output missing | Re-execute relevant phase |
| QA rating < 5.0 | Address feedback, re-review |
| User cannot access | Fix permissions/paths |

---

**Template Version:** 1.0
**Based on:** Atlassian Definition of Done best practices
