---
type: template
name: framework-findings-template
category: compliance-assessment
classification: public
version: 2.0
last_updated: 2026-02-24
---

# [ORGANIZATION NAME] — [FRAMEWORK NAME AND VERSION] Findings

**Framework:** [SOC 2 / ISO 27001 / HIPAA / PCI-DSS / NIST CSF / etc.]
**Assessment Date:** [DATE]
**Assessor:** [ASSESSOR NAME]
**Client Contact:** [INTERVIEWEE NAME/ROLE]

---

## Assessment Summary

| Metric | Value |
|--------|-------|
| **Framework** | [SOC 2 / ISO 27001 / HIPAA / etc.] |
| **Controls Assessed** | [N] |
| **Compliant** | [N] |
| **Partial** | [N] |
| **Non-Compliant** | [N] |
| **Requires Evidence** | [N] |
| **Score** | [XX]% |

---

## Findings by [Framework Native Category]

<!-- Replace section headers below with the framework's own category names.
     Examples:
       SOC 2:      CC1: Control Environment, CC2: Communication and Information, etc.
       ISO 27001:  A.5: Organizational controls, A.6: People controls, etc.
       HIPAA:      164.308: Administrative Safeguards, 164.310: Physical Safeguards, etc.
       NIST CSF:   GV: Govern, ID: Identify, PR: Protect, DE: Detect, RS: Respond, RC: Recover
       PCI-DSS:    Req-1: Network Security Controls, Req-2: Secure Configurations, etc.
-->

### [CC1 / A.5 / 164.308 / GV / Req-1]: [Category Full Title]

#### [Control ID]: [Control Title]

**Status:** Full / Partial / Gap / Requires Evidence
**Question asked:** [question text as asked during interview]
**Response summary:** [summary of client's response]
**Evidence found:** [list of evidence items confirmed present]
**Evidence required:** [list of evidence items still needed or not provided]
**Observations:** [assessor observations, context, or nuances]
**Recommendations:** [specific recommendations if status is Gap or Partial]

---

#### [Control ID]: [Control Title]

**Status:** Full / Partial / Gap / Requires Evidence
**Question asked:** [question text]
**Response summary:** [response summary]
**Evidence found:** [evidence confirmed]
**Evidence required:** [evidence still needed]
**Observations:** [observations]
**Recommendations:** [recommendations if applicable]

---

### [CC2 / A.6 / 164.310 / ID / Req-2]: [Category Full Title]

<!-- Repeat the control block structure for each control in this category -->

---

<!-- Continue for each native category in the selected framework -->

---

## Evidence Checklist

| Control | Evidence Item | Status | Notes |
|---------|--------------|--------|-------|
| [Control ID] | [Evidence item description] | Provided / Missing / Partial | [note] |
| [Control ID] | [Evidence item description] | Provided / Missing / Partial | [note] |

---

## Gaps Summary

| Severity | Control | Finding | Recommendation |
|----------|---------|---------|----------------|
| Critical | [ID] | [description of gap] | [recommended action] |
| High | [ID] | [description of gap] | [recommended action] |
| Medium | [ID] | [description of gap] | [recommended action] |
| Low | [ID] | [description of gap] | [recommended action] |

---

## Framework Control Reference Table

| Native Category | Control ID | Control Title | Status | Domain |
|----------------|-----------|---------------|--------|--------|
| [CC1 / A.5 / 164.308] | [CC1.1 / A.5.1 / 164.308(a)] | [title] | Full / Partial / Gap | [governance / access_control / etc.] |

---

**Generated:** [TIMESTAMP]
**Assessment Workflow:** `phases/02-assess.md`
