# Security-Review Verification

## Checks

- [ ] /sec-review command resolves to skills/sec-review/commands/sec-review.md
- [ ] SKILL.md references skills/sec-review/phases/ for workflow
- [ ] Output goes to private/output/sec-review/
- [ ] All 6 phase files exist (00-05)
- [ ] All 6 template files exist
- [ ] No arch-review references remain in framework (see grep check below)
- [ ] Advisory phases no longer contain ARCH-REVIEW mode branches
- [ ] Symlink at ~/.claude/commands/sec-review.md is valid

## Grep Verification

Run from framework root:

```bash
grep -r "arch-review" skills/ docs/ agents/ .framework-manifest.yaml tools/git/ \
  --exclude-dir=sessions --exclude-dir=private
```

Expected: Zero matches.

## Symlink Check

```bash
ls -la ~/.claude/commands/sec-review.md
# Expected: lrwxrwxrwx ... -> ~/ia-framework/skills/sec-review/commands/sec-review.md
```

## File Inventory

| File | Expected Path | Required |
|------|--------------|----------|
| SKILL.md | skills/sec-review/SKILL.md | Yes |
| STATUS.md | skills/sec-review/STATUS.md | Yes |
| README.md | skills/sec-review/README.md | Yes |
| VERIFY.md | skills/sec-review/VERIFY.md | Yes |
| sec-review.md | skills/sec-review/commands/sec-review.md | Yes |
| 00-workflow.md | skills/sec-review/phases/00-workflow.md | Yes |
| 01-intake.md | skills/sec-review/phases/01-intake.md | Yes |
| 02-analyze.md | skills/sec-review/phases/02-analyze.md | Yes |
| 03-recommend.md | skills/sec-review/phases/03-recommend.md | Yes |
| 04-document.md | skills/sec-review/phases/04-document.md | Yes |
| 05-deliver.md | skills/sec-review/phases/05-deliver.md | Yes |
| sec_review-report.qmd | tools/quarto/templates/reports/sec_review/sec_review-report.qmd | Yes |
| sec-review-intake-checklist.md | skills/sec-review/docs/sec-review-intake-checklist.md | Yes |
| security-practices-questionnaire.md | skills/sec-review/docs/security-practices-questionnaire.md | Yes |
| patch-assessment-questionnaire.md | skills/sec-review/docs/patch-assessment-questionnaire.md | Yes |
| supply-chain-questionnaire.md | skills/sec-review/docs/supply-chain-questionnaire.md | Yes |
| evidence-collection-checklist.md | skills/sec-review/docs/evidence-collection-checklist.md | Yes |

## Directory Inventory

```bash
ls skills/sec-review/phases/   # Expected: 6 files (00-05)
ls skills/sec-review/docs/ # Expected: 6+ files
ls skills/sec-review/commands/ # Expected: 1 file
```
