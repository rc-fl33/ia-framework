# Harden Verification

## Structure Checks

- [ ] `skills/harden/SKILL.md` exists
- [ ] `skills/harden/STATUS.md` exists
- [ ] `skills/harden/README.md` exists
- [ ] `skills/harden/VERIFY.md` exists
- [ ] `skills/harden/commands/harden.md` exists
- [ ] `skills/harden/phases/00-workflow.md` exists
- [ ] `skills/harden/phases/01-scope.md` exists
- [ ] `skills/harden/phases/02-baseline.md` exists
- [ ] `skills/harden/phases/03-assess.md` exists
- [ ] `skills/harden/phases/04-remediate.md` exists
- [ ] `skills/harden/phases/05-deliver.md` exists
- [ ] `skills/harden/docs/.gitkeep` exists
- [ ] `skills/harden/input/.gitkeep` exists
- [ ] `skills/harden/output/.gitkeep` exists

## UPS Compliance Check

Each phase file (00–05) and `commands/harden.md` must contain all required sections:

- [ ] Frontmatter with: `domain`, `skill`, `agent`, `model`, `mode`, `complexity`, `chain_position`
- [ ] `## IDENTITY`
- [ ] `## INPUT CONTRACT`
- [ ] `## OBJECTIVE`
- [ ] `## METHODOLOGY` (phase files and command file)
- [ ] `## EXECUTION`
- [ ] `## OUTPUT CONTRACT`
- [ ] `## NEXT`
- [ ] `## CHECKPOINTS` (phase files)
- [ ] Footer: `**Framework:** Intelligence Adjacent (IA)` and `**Structure:** Universal Prompt Structure v2.0`

## No Compliance References Grep

Run from framework root:

```bash
grep -r "skills/compliance\|output/compliance" skills/harden/
```

Expected: Zero matches.

## Mode Test: validate produces no CHANGE-LOG.md

After a validate mode run, verify:

```bash
ls private/output/harden/{target}-{YYYY-MM}/CHANGE-LOG.md
# Expected: No such file or directory
```

## Mode Test: remediate produces CHANGE-LOG.md

After a remediate mode run, verify:

```bash
ls private/output/harden/{target}-{YYYY-MM}/CHANGE-LOG.md
# Expected: File exists with timestamped change records
```

## Symlink Check

```bash
ls -la ~/.claude/commands/harden.md
# Expected: lrwxrwxrwx ... -> ~/ia-framework/skills/harden/commands/harden.md
```

## File Inventory

| File | Expected Path | Required |
|------|--------------|----------|
| SKILL.md | skills/harden/SKILL.md | Yes |
| STATUS.md | skills/harden/STATUS.md | Yes |
| README.md | skills/harden/README.md | Yes |
| VERIFY.md | skills/harden/VERIFY.md | Yes |
| harden.md | skills/harden/commands/harden.md | Yes |
| 00-workflow.md | skills/harden/phases/00-workflow.md | Yes |
| 01-scope.md | skills/harden/phases/01-scope.md | Yes |
| 02-baseline.md | skills/harden/phases/02-baseline.md | Yes |
| 03-assess.md | skills/harden/phases/03-assess.md | Yes |
| 04-remediate.md | skills/harden/phases/04-remediate.md | Yes |
| 05-deliver.md | skills/harden/phases/05-deliver.md | Yes |
| .gitkeep | skills/harden/docs/.gitkeep | Yes |
| .gitkeep | skills/harden/input/.gitkeep | Yes |
| .gitkeep | skills/harden/output/.gitkeep | Yes |

## Directory Inventory

```bash
ls skills/harden/phases/   # Expected: 6 files (00-05)
ls skills/harden/commands/ # Expected: 1 file
ls skills/harden/docs/     # Expected: .gitkeep
ls skills/harden/input/    # Expected: .gitkeep
ls skills/harden/output/   # Expected: .gitkeep
```
