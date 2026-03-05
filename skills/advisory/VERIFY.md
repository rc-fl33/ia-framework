# Definition of Done: Advisory Skill

**Verification checklist aligned with UPS v2.0 phase structure.**

---

## Pre-Execution Verification

- [ ] Correct agent is executing (advisor)
- [ ] Effort level classified (QUICK/STANDARD/THOROUGH)
- [ ] Mode determined (ad-hoc, code-review)
- [ ] Input requirements met (question, architecture docs, or code)
- [ ] SKILL.md read completely

---

## UPS Section Verification (Per Phase)

Each phase file must contain all 8 UPS sections:

| Section | Present | Valid |
|---------|---------|-------|
| IDENTITY | [ ] | [ ] Agent reference correct, phase role defined |
| INPUT CONTRACT | [ ] | [ ] Receives, Prerequisites, Source documented |
| OBJECTIVE | [ ] | [ ] Goal, Success criteria, Failure criteria defined |
| METHODOLOGY | [ ] | [ ] Strategic reasoning documented |
| EXECUTION | [ ] | [ ] Steps with Tool, Expected output, On failure |
| OUTPUT CONTRACT | [ ] | [ ] Produces with exact paths, Format specified |
| NEXT | [ ] | [ ] On success path, On failure action |
| CHECKPOINTS | [ ] | [ ] Exit criteria checklist, Error recovery |

---

## Phase Gate Verification

| Phase | Gate Question | Verified |
|-------|---------------|----------|
| INTAKE | "Do I have context and scope?" | [ ] |
| ANALYZE | "Is analysis complete?" | [ ] |
| RECOMMEND | "Are recommendations actionable and prioritized?" | [ ] |
| DOCUMENT | "Is the report complete and professional?" | [ ] |
| DELIVER | "Can the user access and understand deliverables?" | [ ] |

---

## Output Verification

### AD-HOC Mode

- [ ] request.md created (STANDARD+)
- [ ] research.md created with sources
- [ ] recommendations.md created with framework references
- [ ] references.md created with all sources cited
- [ ] FULL-REPORT.md created (consolidated report)

### ARCH-REVIEW Mode

- [ ] EXECUTIVE-SUMMARY.md created
- [ ] ARCHITECTURE-ANALYSIS.md created with decomposition and trust boundaries
- [ ] THREAT-MODEL.md created with STRIDE/PASTA methodology
- [ ] FINDINGS.md created with severity ratings
- [ ] RECOMMENDATIONS.md created with P0-P3 priorities
- [ ] FULL-REPORT.md created (consolidated report)
- [ ] metadata.json created with accurate finding counts and includes FULL-REPORT.md

### CODE-REVIEW Mode

- [ ] EXECUTIVE-SUMMARY.md created
- [ ] REVIEW-SUMMARY.md created with scope and methodology
- [ ] FINDINGS.md created with WHAT/WHERE/WHY and CWE classification
- [ ] REMEDIATION-GUIDE.md created with prioritized fixes
- [ ] FULL-REPORT.md created (consolidated report)
- [ ] metadata.json created with accurate finding counts and includes FULL-REPORT.md

---

## Content Quality

- [ ] No placeholder content (TODO, TBD markers)
- [ ] All findings have severity ratings
- [ ] All findings have CWE classification (code-review)
- [ ] All recommendations have P0-P3 priority
- [ ] All recommendations have implementation steps
- [ ] Framework references accurate (NIST, OWASP, CIS, CWE)
- [ ] No hardcoded counts or time estimates
- [ ] Professional formatting throughout

---

## Mode-Specific Verification

### AD-HOC Mode

- [ ] Question answered clearly with framework references
- [ ] Sources cited (if research performed)
- [ ] Follow-up suggested if deeper analysis needed

### ARCH-REVIEW Mode

- [ ] Architecture decomposed into components
- [ ] Trust boundaries identified
- [ ] Threat model complete with selected methodology
- [ ] All threats have likelihood and impact ratings
- [ ] Defense-in-depth gaps identified
- [ ] Recommendations prioritized with framework references

### CODE-REVIEW Mode

- [ ] All in-scope code reviewed
- [ ] All findings have WHAT/WHERE/WHY format
- [ ] All findings have CWE classification
- [ ] Severity ratings accurate
- [ ] Remediation guidance actionable with code examples

---

## Delivery Verification

- [ ] Deliverables summary presented to user
- [ ] FULL-REPORT.md highlighted as primary deliverable
- [ ] Critical findings (P0) highlighted
- [ ] Key statistics provided
- [ ] Follow-up commands suggested
- [ ] User can access all output files
- [ ] Completion message displayed

---

## Completion Certification

This skill execution is COMPLETE when:

1. All pre-execution checks passed
2. All UPS sections present in executed phase files
3. All phase gates verified
4. All mode-specific output verification passed
5. Content quality checks passed
6. Delivery verification passed
7. User can access and verify deliverables

---

**Skill:** advisory | **Version:** 2.1 | **Structure:** Universal Prompt Structure v2.0
