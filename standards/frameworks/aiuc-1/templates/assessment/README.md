# AIUC-1 Assessment Template

This folder serves as the template for all AIUC-1 AI Agent Compliance assessments.

**DO NOT use this folder for actual assessments.**

When starting a new assessment, the compliance agent will automatically copy this structure to create:

`output/engagements/compliance-assessments/[CLIENT-NAME]-aiuc1-[YYYY-MM]/`

---

## Template Structure

```
frameworks/aiuc-1/templates/assessment/
├── 00-engagement/
│   ├── scope.md                    # AI system inventory + principle scope
│   ├── respondents.md              # Multi-responder tracking
│   └── assessment-summary.md       # Final engagement summary
│
├── principle-a-data-privacy/       # Principle A: Data & Privacy findings
│   └── findings.md                 # A001-A007 assessment
│
├── principle-b-security/           # Principle B: Security findings
│   └── findings.md                 # B001-B009 assessment
│
├── principle-c-safety/             # Principle C: Safety findings
│   └── findings.md                 # C001-C012 assessment
│
├── principle-d-reliability/        # Principle D: Reliability findings
│   └── findings.md                 # D001-D004 assessment
│
├── principle-e-accountability/     # Principle E: Accountability findings
│   ├── findings.md                 # E001-E017 assessment
│   └── operational-readiness.md    # E001-E004 operational readiness review
│
├── principle-f-society/            # Principle F: Societal Impact findings
│   └── findings.md                 # F001-F002 assessment
│
└── deliverables/
    ├── compliance-matrix.md        # Per-requirement compliance status
    ├── findings-report.md          # Findings by principle with recommendations
    ├── remediation-plan.md         # Prioritized action plan
    └── certification-readiness.md  # Schellman audit readiness (if applicable)
```

---

## How This Template Is Used

### Automatic Creation

When the compliance agent starts an AIUC-1 assessment, it executes:

```bash
cp -r "standards/frameworks/aiuc-1/templates/assessment" \
      "output/engagements/compliance-assessments/[CLIENT-NAME]-aiuc1-[YYYY-MM]"
```

### Files Populated During Assessment

**00-engagement/**
- `scope.md` - Populated during scoping: AI system inventory, principle prioritization, assessment depth
- `respondents.md` - Updated as stakeholders provide responses per principle
- `assessment-summary.md` - Created at engagement close with overall compliance posture

**principle-a-data-privacy/**
- `findings.md` - Populated during assessment: A001-A007 responses and evidence

**principle-b-security/**
- `findings.md` - Populated during assessment: B001-B009 technical evidence review

**principle-c-safety/**
- `findings.md` - Populated during assessment: C001-C012 safety controls

**principle-d-reliability/**
- `findings.md` - Populated during assessment: D001-D004 reliability controls

**principle-e-accountability/**
- `findings.md` - Populated during assessment: E001-E017 responses and evidence
- `operational-readiness.md` - Populated during assessment: E001-E004 operational readiness

**principle-f-society/**
- `findings.md` - Populated during assessment: F001-F002 responses and evidence

**deliverables/**
- Created during analysis and reporting using deliverable templates:
  - `compliance-matrix.md` from `aiuc1-compliance-matrix-template.md`
  - `findings-report.md` from `phase-findings-template.md` (adapted for AIUC-1)
  - `remediation-plan.md` from `aiuc1-remediation-plan-template.md`
  - `certification-readiness.md` only if Schellman certification is in scope

---

## AIUC-1 Framework Reference

| Attribute | Value |
|-----------|-------|
| **Framework** | AIUC-1 AI Unified Controls v1.0 |
| **Total Requirements** | 51 (39 mandatory, 12 optional) |
| **Principles** | 6 (A: Data & Privacy, B: Security, C: Safety, D: Reliability, E: Accountability, F: Society) |
| **Certification Auditor** | Schellman |
| **Assessment Frequencies** | Quarterly (14 reqs), Semi-annual (1 req), Annual (36 reqs) |
| **Questions Bank** | `standards/frameworks/aiuc-1/questions.yaml` |
| **Metadata** | `standards/frameworks/aiuc-1/metadata.yaml` |

---

## Preserving the Template

**Important:**
- This template should remain pristine
- Never modify for a specific client
- Always copy to create new assessments
- Agent handles the copying automatically

If template needs updating:
1. Make changes to this `frameworks/aiuc-1/templates/assessment/` folder
2. All future assessments will inherit the changes
3. Existing assessments are unaffected

---

## File Placeholders

Template files contain placeholders like:
- `[CLIENT-NAME]` - Organization name
- `[YYYY-MM-DD]` - Dates
- `[ASSESSOR]` - Assessor name
- `[AI-SYSTEM-NAME]` - Name of AI system under assessment
- `[PRINCIPLE]` - AIUC-1 principle letter (A-F)
- `[REQ-ID]` - AIUC-1 requirement ID (e.g., A001, B003)

Agent replaces these during assessment.

---

**Template Version:** 1.0
**Last Updated:** 2026-02-13
**Maintained By:** Compliance Agent
**Framework Source:** `standards/frameworks/aiuc-1/`
