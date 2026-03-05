# Risk-Assess Verification

## Structure Checks

- [ ] `skills/risk-assess/SKILL.md` exists
- [ ] `skills/risk-assess/STATUS.md` exists
- [ ] `skills/risk-assess/README.md` exists
- [ ] `skills/risk-assess/VERIFY.md` exists
- [ ] `skills/risk-assess/commands/risk-assess.md` exists
- [ ] `skills/risk-assess/phases/00-workflow.md` exists
- [ ] `skills/risk-assess/phases/01-scope.md` exists
- [ ] `skills/risk-assess/phases/02-identify.md` exists
- [ ] `skills/risk-assess/phases/03-analyze.md` exists
- [ ] `skills/risk-assess/phases/04-prioritize.md` exists
- [ ] `skills/risk-assess/phases/05-deliver.md` exists
- [ ] `skills/risk-assess/docs/.gitkeep` exists
- [ ] `skills/risk-assess/input/.gitkeep` exists
- [ ] `skills/risk-assess/output/.gitkeep` exists

## UPS Compliance Check

Every phase file (01-05) and the command file must contain all 8 sections:
IDENTITY, INPUT CONTRACT, OBJECTIVE, METHODOLOGY, EXECUTION, OUTPUT CONTRACT, NEXT, CHECKPOINTS

```bash
for f in skills/risk-assess/phases/0{1..5}-*.md skills/risk-assess/commands/risk-assess.md; do
  echo "=== $f ===";
  grep -c "## IDENTITY\|## INPUT CONTRACT\|## OBJECTIVE\|## METHODOLOGY\|## EXECUTION\|## OUTPUT CONTRACT\|## NEXT\|## CHECKPOINTS" "$f";
done
```

Expected: Each file reports 8.

## No Compliance References Check

```bash
grep -r "skills/compliance\|output/compliance" skills/risk-assess/
```

Expected: Zero matches.

## Directory Listing

```bash
ls skills/risk-assess/
ls skills/risk-assess/commands/
ls skills/risk-assess/phases/
```

## Cold Start Test

1. Delete `private/output/risk-assess/` (or confirm it does not exist)
2. Invoke `/risk-assess`
3. Confirm 00-workflow.md routes to Phase 01 (scope.md not present)
4. Complete Phase 01 — verify `scope.md` created in output directory
5. Confirm 00-workflow.md routes to Phase 02 on next invocation

## Resume Test

1. Create `private/output/risk-assess/test-org-2026-02/` with only `scope.md` inside
2. Invoke `/risk-assess Org: test-org`
3. Confirm 00-workflow.md detects scope.md exists but ASSET-INVENTORY.md missing
4. Confirm routing goes directly to Phase 02 (not Phase 01)
5. Clean up test directory after verification

## File Inventory

| File | Expected Path | Required |
|------|--------------|----------|
| SKILL.md | skills/risk-assess/SKILL.md | Yes |
| STATUS.md | skills/risk-assess/STATUS.md | Yes |
| README.md | skills/risk-assess/README.md | Yes |
| VERIFY.md | skills/risk-assess/VERIFY.md | Yes |
| risk-assess.md | skills/risk-assess/commands/risk-assess.md | Yes |
| 00-workflow.md | skills/risk-assess/phases/00-workflow.md | Yes |
| 01-scope.md | skills/risk-assess/phases/01-scope.md | Yes |
| 02-identify.md | skills/risk-assess/phases/02-identify.md | Yes |
| 03-analyze.md | skills/risk-assess/phases/03-analyze.md | Yes |
| 04-prioritize.md | skills/risk-assess/phases/04-prioritize.md | Yes |
| 05-deliver.md | skills/risk-assess/phases/05-deliver.md | Yes |
