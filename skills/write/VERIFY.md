# Definition of Done: Write Skill

**This checklist defines completion criteria for write skill outputs.**

---

## Pre-Execution Verification

**Before starting, verify:**

- [ ] Correct agent is executing (writer agent via routing gate)
- [ ] Effort level classified (QUICK / STANDARD / THOROUGH)
- [ ] If THOROUGH: EnterPlanMode called and plan approved
- [ ] Content topic or brief provided
- [ ] Success Criteria created (for STANDARD+ effort)

---

## Phase Gate Verification

**Each phase gate must pass:**

| Phase | Gate Question | Verified |
|-------|---------------|----------|
| RESEARCH | "Do I have 10+ validated sources?" | [ ] |
| DRAFT | "Does content follow brand voice template?" | [ ] |
| QA | "Did I achieve 5.0/5.0 rating?" | [ ] |
| VISUALS | "Are images generated (if requested)?" | [ ] |
| OUTPUT | "Is content exported in requested format?" | [ ] |

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
- [ ] Per-post directory exists (`private/output/write/{slug}-{YYYY-MM-DD}/`)
- [ ] Primary content file exists (`{output_dir}/{slug}-{YYYY-MM-DD}.{ext}`)
- [ ] Research sources file exists (`{output_dir}/sources.txt`)
- [ ] Research notes file exists (`{output_dir}/research-notes.md`)
- [ ] Files saved to correct location
- [ ] File formats are correct
- [ ] No placeholder content remaining

### Content Quality
- [ ] Content is complete (no TODO markers)
- [ ] Content is accurate (verified against sources)
- [ ] Brand voice consistent throughout
- [ ] No hardcoded counts or time estimates
- [ ] All claims properly sourced

### Technical Quality
- [ ] Code examples valid (if applicable)
- [ ] No credentials or secrets exposed
- [ ] Paths are correct and files accessible
- [ ] Links are valid and accessible

---

## Skill-Specific Verification

### Research Quality
- [ ] 10+ credible sources validated
- [ ] All sources have accessible URLs
- [ ] Sources are relevant to topic
- [ ] Key insights extracted from sources
- [ ] No internal framework files cited as sources

### Brand Voice Compliance
- [ ] Tone matches brand voice template
- [ ] Writing style consistent throughout
- [ ] No tonal shifts or voice breaks
- [ ] Professional but accessible language
- [ ] Mission language present (if applicable)

### QA Review Validation
- [ ] QA review completed
- [ ] Initial rating documented
- [ ] Feedback addressed
- [ ] Final rating: 5.0/5.0
- [ ] QA review JSON file saved

### Visual Assets (if applicable)
- [ ] Images generated successfully
- [ ] Images match style template
- [ ] Images saved to output directory
- [ ] Image file paths correct

### Format Export
- [ ] Content exported to requested format
- [ ] Formatting preserved correctly
- [ ] Output file readable and valid
- [ ] Fallback to markdown if format unsupported

---

## QA Review (STANDARD+ Effort)

**For STANDARD and THOROUGH effort levels:**

- [ ] QA review completed (writer agent self-review)
- [ ] Initial QA rating: ___/5.0
- [ ] If < 5.0: Issues addressed and re-reviewed
- [ ] Final QA rating: 5.0/5.0
- [ ] QA feedback documented in `private/output/write/qa-review.json`

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
- [ ] Learnings documented (OUTPUT phase)
- [ ] Template customizations documented (if made)
- [ ] Output location communicated to user

---

## Completion Certification

**This skill execution is COMPLETE when:**

1. All pre-execution checks passed
2. All phase gates verified (10+ sources, brand voice, 5.0 QA, export)
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
| Fewer than 10 sources | Return to RESEARCH phase, gather more sources |
| Brand voice inconsistent | Return to DRAFT phase, apply template |
| QA rating < 5.0 | Address feedback, revise content, re-run QA |
| Image generation fails | Skip VISUALS phase or troubleshoot API key |
| Export format fails | Use markdown fallback format |
| User cannot access files | Fix permissions/paths in output directory |

---

**Template Version:** 1.0
**Based on:** Atlassian Definition of Done best practices
