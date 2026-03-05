# Gap Analysis — Definition of Done

**Verification checklist to ensure a gap analysis engagement meets quality standards.**

---

## 1. Structure Checks

All of the following files must exist before the skill is considered release-ready:

- [ ] `skills/gap-analysis/SKILL.md`
- [ ] `skills/gap-analysis/README.md`
- [ ] `skills/gap-analysis/STATUS.md`
- [ ] `skills/gap-analysis/VERIFY.md`
- [ ] `skills/gap-analysis/phases/00-workflow.md`
- [ ] `skills/gap-analysis/phases/01-intake.md`
- [ ] `skills/gap-analysis/phases/02-assess.md`
- [ ] `skills/gap-analysis/phases/03-deliverables.md`
- [ ] `skills/gap-analysis/commands/gap-analysis.md`
- [ ] `skills/gap-analysis/docs/framework-selection-guide.md`

---

## 2. UPS Compliance Check

Each phase file and the command file must contain all 8 Universal Prompt Structure section headers.

Run this one-liner from the repository root to count section headers per file:

```bash
for f in skills/gap-analysis/phases/0{1,2,3}-*.md skills/gap-analysis/commands/gap-analysis.md; do
  count=$(grep -cE "^## (METADATA|IDENTITY|INPUT|OUTPUT|METHODOLOGY|EXECUTION|NEXT|CHECKPOINTS)" "$f" 2>/dev/null || echo 0)
  echo "$count/8  $f"
done
```

Expected output: `8/8` for every file. Any file showing fewer than 8 requires remediation before release.

---

## 3. Framework-Native Check

Phase 02 produces one findings file per selected framework. Files must be named after the framework ID, not generic names.

Correct:
```
assessment/hipaa-findings.md
assessment/nist-csf-findings.md
```

Incorrect:
```
assessment/findings.md
assessment/framework-findings.md
```

Verify that `02-assess.md` instructs output naming as `{framework-id}-findings.md`. Generic filenames indicate the phase is not framework-native and must be corrected.

---

## 4. No NIST-Only Output Check

When frameworks other than NIST CSF are selected, output must preserve those frameworks' own control structures — not route everything through NIST CSF's Identify/Protect/Detect/Respond/Recover taxonomy.

Check that phase files do not hardcode NIST CSF structure as the universal organizer:

```bash
grep -n "Identify\|Protect\|Detect\|Respond\|Recover" \
  skills/gap-analysis/phases/02-assess.md \
  skills/gap-analysis/phases/03-deliverables.md
```

Any match that appears as a universal output organizer (rather than NIST-CSF-specific output) indicates a structural violation. NIST CSF phases should only appear when NIST CSF is among the selected frameworks.

---

## 5. Cold Start Test

Verify Phase 01 runs correctly from a clean state.

1. Start a new session with no existing engagement folder.
2. Invoke `/gap-analysis` with no arguments.
3. Confirm the advisor agent:
   - [ ] Asks for org name, industry, scope, and frameworks
   - [ ] Runs OSINT on the organization
   - [ ] Creates `private/output/gap-analysis/{client}-{YYYY-MM}/intake/` directory
   - [ ] Writes `engagement-details.yaml` and `merged-questionnaire.yaml`
   - [ ] Confirms gate criteria met before advancing to Phase 02

---

## 6. Resume Test

Verify that an in-progress engagement routes correctly to Phase 02 without re-running Phase 01.

1. Ensure `private/output/gap-analysis/{client}-{YYYY-MM}/intake/` exists with a valid `engagement-details.yaml`.
2. Ensure `assessment/` directory is empty or absent.
3. Invoke `/gap-analysis` with the same client/scope.
4. Confirm the advisor agent:
   - [ ] Detects the existing intake folder
   - [ ] Skips Phase 01 and proceeds directly to Phase 02
   - [ ] Begins framework-native questioning for the first selected framework
   - [ ] Writes `{framework-id}-findings.md` under `assessment/`

---

## 7. File Inventory

| File | Expected Path | Required |
|------|--------------|----------|
| Skill manifest | `skills/gap-analysis/SKILL.md` | Yes |
| User README | `skills/gap-analysis/README.md` | Yes |
| Status log | `skills/gap-analysis/STATUS.md` | Yes |
| Verification checklist | `skills/gap-analysis/VERIFY.md` | Yes |
| Workflow router | `skills/gap-analysis/phases/00-workflow.md` | Yes |
| Phase 01 — Intake | `skills/gap-analysis/phases/01-intake.md` | Yes |
| Phase 02 — Assess | `skills/gap-analysis/phases/02-assess.md` | Yes |
| Phase 03 — Deliverables | `skills/gap-analysis/phases/03-deliverables.md` | Yes |
| Command entry point | `skills/gap-analysis/commands/gap-analysis.md` | Yes |
| Framework selection guide | `skills/gap-analysis/docs/framework-selection-guide.md` | Yes |

---

**Version:** 1.0
**Last Updated:** 2026-02-25
**Structure:** Universal Prompt Structure v2.0
