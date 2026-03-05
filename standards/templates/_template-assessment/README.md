# Assessment Template

This folder serves as the template for all cybersecurity risk advisory assessments.

**DO NOT use this folder for actual assessments.**

When starting a new assessment, the `risk-assessment-advisor` agent will automatically copy this structure to create:

`output/engagements/risk-assessments/[CLIENT-NAME]-[YYYY-MM]/`

---

## Template Structure

```
_template-assessment/
├── 00-engagement/
│   ├── scope.md                    # Q1-Q4 responses
│   ├── respondents.md              # Multi-responder tracking
│   └── assessment-summary.md       # Final engagement summary
│
├── 01-interview/
│   ├── osint-findings.md           # OSINT research results
│   └── interview-transcript-[CLIENT]-[DATE].md will be created
│
├── 02-analysis/
│   ├── gap-analysis.md will be created
│   └── risk-assessment.md will be created
│
└── 03-deliverables/
    ├── security-assessment-report.md will be created (if selected)
    ├── 120day-action-plan.md will be created (if selected)
    └── implementation-checklist.md will be created (if selected)
```

---

## How This Template Is Used

### Automatic Creation
When the `risk-assessment-advisor` agent starts Phase 0, it executes:

```powershell
Copy-Item -Path "skills/security-advisory/templates/_template-assessment" `
          -Destination "output/engagements/risk-assessments/[CLIENT-NAME]-[YYYY-MM]" `
          -Recurse
```

### Files Populated During Assessment

**00-engagement/**
- `scope.md` - Populated during Q1-Q4
- `respondents.md` - Updated as people answer questions
- `assessment-summary.md` - Created at end

**01-interview/**
- `osint-findings.md` - Populated during Phase 2 OSINT
- `interview-transcript-[CLIENT]-[DATE].md` - **MANDATORY** at Phase 4.5

**02-analysis/**
- `gap-analysis.md` - Created during Phase 5 (detailed gap breakdown)
- `risk-assessment.md` - Created during Phase 5 (prioritized risks)

**03-deliverables/**
- Created only for selected deliverables during Phase 7

---

## Preserving the Template

**Important:**
- This template should remain pristine
- Never modify for a specific client
- Always copy to create new assessments
- Agent handles the copying automatically

If template needs updating:
1. Make changes to this `_template-assessment/` folder
2. All future assessments will inherit the changes
3. Existing assessments are unaffected

---

## File Placeholders

Template files contain placeholders like:
- `[CLIENT-NAME]` - Organization name
- `[YYYY-MM-DD]` - Dates
- `[Organization Legal Name]` - From OSINT
- `[Industry]` - From Q5/Q6

Agent replaces these during assessment.

---

**Template Version:** 1.1
**Last Updated:** 2025-10-22
**Maintained By:** Risk Assessment Advisor Agent
