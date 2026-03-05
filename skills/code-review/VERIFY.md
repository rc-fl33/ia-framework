# Code-Review Verification

## Checks

- [ ] /code-review command resolves to skills/code-review/commands/code-review.md
- [ ] SKILL.md references skills/code-review/phases/ for workflow
- [ ] SKILL.md references tools/code-review/ for utility scripts
- [ ] Output goes to private/output/code-review/
- [ ] tools/code-review/ contains poc-generator.ts, coverage-analyzer.ts, standard-selector.ts
- [ ] skills/advisory/commands/ no longer contains code-review.md

## File Inventory

| File | Expected Path | Required |
|------|--------------|----------|
| SKILL.md | skills/code-review/SKILL.md | Yes |
| STATUS.md | skills/code-review/STATUS.md | Yes |
| README.md | skills/code-review/README.md | Yes |
| VERIFY.md | skills/code-review/VERIFY.md | Yes |
| code-review.md | skills/code-review/commands/code-review.md | Yes |

## Tool Checks

| Script | Expected Path | Required |
|--------|--------------|----------|
| poc-generator.ts | tools/code-review/poc-generator.ts | Yes |
| coverage-analyzer.ts | tools/code-review/coverage-analyzer.ts | Yes |
| standard-selector.ts | tools/code-review/standard-selector.ts | Yes |
