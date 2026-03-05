# Incident Skill — Verification Checklist

Run these checks to verify the incident skill is correctly structured and wired.

---

## 1. Structure Checks

```bash
# Verify all required files exist
ls skills/incident/SKILL.md
ls skills/incident/README.md
ls skills/incident/STATUS.md
ls skills/incident/VERIFY.md
ls skills/incident/commands/incident.md
ls skills/incident/docs/.gitkeep
ls skills/incident/input/.gitkeep
ls skills/incident/output/.gitkeep
ls skills/incident/phases/00-workflow.md
ls skills/incident/phases/01-intake.md
ls skills/incident/phases/02-respond.md
ls skills/incident/phases/03-communicate.md
ls skills/incident/phases/04-recover.md
ls skills/incident/phases/05-deliver.md
```

Expected: All 14 paths resolve without error.

---

## 2. UPS Compliance Check

Each phase file must contain all required UPS v2.0 sections.

```bash
# Check each phase file for required sections
for f in skills/incident/phases/*.md; do
  echo "=== $f ===";
  grep -l "## IDENTITY\|## INPUT CONTRACT\|## OBJECTIVE\|## METHODOLOGY\|## EXECUTION\|## OUTPUT CONTRACT\|## NEXT\|## CHECKPOINTS" "$f" || echo "MISSING SECTIONS in $f";
done
```

Expected: Each phase file contains all 8 UPS sections.

---

## 3. No Compliance References

```bash
grep -r "skills/compliance\|output/compliance\|compliance/frameworks\|compliance-matrix\|gap-analysis" skills/incident/
```

Expected: Zero matches. Any output here is a violation.

---

## 4. Frontmatter Check

All phase files and the command file must have frontmatter with required fields.

Required fields: `domain`, `skill`, `agent`, `model`, `mode`, `complexity`, `chain_position`

```bash
for f in skills/incident/phases/*.md skills/incident/commands/incident.md; do
  echo "=== $f ===";
  grep -E "^(domain|skill|agent|model|mode|complexity|chain_position):" "$f" | head -10;
done
```

Expected: All 7 fields present in every file checked.

---

## 5. Mode Routing Test

### active and tabletop → security agent

In `skills/incident/commands/incident.md`, verify:

```bash
grep -A 5 "\[active or tabletop\]" skills/incident/commands/incident.md
```

Expected: `Task(subagent_type="security", ...)` present.

### review → advisor agent

```bash
grep -A 5 "\[review\]" skills/incident/commands/incident.md
```

Expected: `Task(subagent_type="advisor", ...)` present.

---

## 6. Mode Branching in Phases

All phase files must contain mode branching blocks.

```bash
for f in skills/incident/phases/01-intake.md skills/incident/phases/02-respond.md \
         skills/incident/phases/03-communicate.md skills/incident/phases/04-recover.md \
         skills/incident/phases/05-deliver.md; do
  echo "=== $f ===";
  grep -c "\[active\]\|\[tabletop\]\|\[review\]" "$f";
done
```

Expected: Each file returns count > 0.

---

## 7. Output Contract Verification

### Mode-dependent output files

| File | Modes That Produce It |
|------|-----------------------|
| TIMELINE.md | active, review |
| SCENARIO.md | tabletop |
| RECOVERY-PLAN.md | active, review |

```bash
# Verify TIMELINE.md noted as active/review in workflow
grep "TIMELINE" skills/incident/phases/00-workflow.md

# Verify SCENARIO.md noted as tabletop
grep "SCENARIO" skills/incident/phases/00-workflow.md

# Verify RECOVERY-PLAN.md noted as active/review in phase 04
grep "RECOVERY-PLAN" skills/incident/phases/04-recover.md
```

Expected: Each grep returns at least one match.

---

## 8. metadata.json — Mode + Framework Recording

```bash
grep "metadata.json" skills/incident/phases/01-intake.md
```

Expected: At least one reference confirming metadata.json is written in Phase 01.

---

## 9. Regulatory Notification Timelines Inline

Timelines must be present in Phase 03, not referenced externally.

```bash
grep -E "60.day|72.hour|72h|US-CERT" skills/incident/phases/03-communicate.md
```

Expected: All four notification timelines present inline.

---

## 10. File Inventory

| File | Path | Purpose |
|------|------|---------|
| SKILL.md | `skills/incident/SKILL.md` | Skill entry point, dual-agent routing note |
| README.md | `skills/incident/README.md` | User-facing docs, mode explanations |
| STATUS.md | `skills/incident/STATUS.md` | Release history |
| VERIFY.md | `skills/incident/VERIFY.md` | This file |
| incident.md | `skills/incident/commands/incident.md` | Command file, mode routing |
| 00-workflow.md | `skills/incident/phases/00-workflow.md` | State detection, phase routing |
| 01-intake.md | `skills/incident/phases/01-intake.md` | Intake, severity, framework selection |
| 02-respond.md | `skills/incident/phases/02-respond.md` | Core response, mode-branched |
| 03-communicate.md | `skills/incident/phases/03-communicate.md` | Comms + regulatory notifications |
| 04-recover.md | `skills/incident/phases/04-recover.md` | Recovery, RTO/RPO, lessons learned |
| 05-deliver.md | `skills/incident/phases/05-deliver.md` | Final report + action items |
| docs/.gitkeep | `skills/incident/docs/.gitkeep` | Placeholder |
| input/.gitkeep | `skills/incident/input/.gitkeep` | Placeholder |
| output/.gitkeep | `skills/incident/output/.gitkeep` | Placeholder |

---

**Framework:** Intelligence Adjacent (IA)
**Version:** 1.0 | **Last Updated:** 2026-02-24
