---
type: reference
name: "{{FRAMEWORK_ID}}-handbook"
category: compliance
classification: public
version: 1.0
last_updated: "{{LAST_UPDATED}}"
framework: "{{FRAMEWORK_NAME}}"
framework_version: "{{FRAMEWORK_VERSION}}"
---

# {{FRAMEWORK_NAME}} Handbook

**Version:** {{FRAMEWORK_VERSION}} | **Provider:** {{PROVIDER}}
**Controls:** {{CONTROL_COUNT}} | **Families:** {{FAMILY_COUNT}}
**Last Updated:** {{LAST_UPDATED}}

---

## How to Use This Handbook

This handbook is the practitioner's guide to {{FRAMEWORK_NAME}}. Read it cover-to-cover to understand what the framework requires, how the IA assessment workflow evaluates it, and what you need to prepare. It bridges the gap between structured assessment data (controls.yaml, questions.yaml) and the narrative understanding needed to manage compliance effectively.

**This handbook IS:** A narrative walkthrough of the framework, its controls, and how to work through compliance.

**This handbook is NOT:**
- The implementation guide (per-control remediation steps for gap closure)
- The certification guide (audit logistics and preparation)
- The controls definition (structured machine-readable data in controls.yaml)
- The assessment questions (interview/evaluation questions in questions.yaml)

**Related artifacts:**
- `controls.yaml` — Structured control definitions
- `questions.yaml` — Assessment questions with scoring criteria
- `docs/{{FRAMEWORK_ID}}-implementation-guide.md` — Per-control gap closure steps
- `docs/{{FRAMEWORK_ID}}-certification-guide.md` — Audit preparation (if certifiable)

---

## 1. Framework Overview

### What {{FRAMEWORK_NAME}} Is

{{FRAMEWORK_OVERVIEW}}

### Current Version

- **Version:** {{FRAMEWORK_VERSION}}
- **Release date:** {{RELEASE_DATE}}
- **Published by:** {{PROVIDER}}
- **Official URL:** {{OFFICIAL_URL}}

### Why It Matters

{{WHY_IT_MATTERS}}

### Target Audience

{{TARGET_AUDIENCE}}

---

## 2. Who Needs This Framework

### Industry Applicability

<!-- Pull from industry-frameworks.yaml — which industries list this framework -->

{{INDUSTRY_APPLICABILITY}}

### Company Size and Type Guidance

{{SIZE_TYPE_GUIDANCE}}

### Regulatory vs. Voluntary

{{REGULATORY_VOLUNTARY}}

### Common Compliance Portfolios

Organizations pursuing {{FRAMEWORK_NAME}} typically also maintain:

{{COMMON_PORTFOLIOS}}

---

## 3. Framework Architecture

### Control Organization

{{CONTROL_ORGANIZATION}}

### Control Families

<!-- Auto-generate from controls.yaml control families -->

| ID | Family | Controls | Description |
|----|--------|:--------:|-------------|
{{CONTROL_FAMILY_TABLE}}

### Mandatory vs. Optional

{{MANDATORY_OPTIONAL}}

### Assessment Frequency

{{ASSESSMENT_FREQUENCY}}

---

## 4. Assessment Workflow Mapping

### IA 7-Phase Workflow

The IA Framework assesses {{FRAMEWORK_NAME}} using a 7-phase workflow aligned to NIST CSF 2.0 functions. Each phase evaluates a subset of {{FRAMEWORK_NAME}} controls.

<!-- Auto-generate from controls.yaml nist_phase mappings -->

| Phase | {{FRAMEWORK_NAME}} Controls | Focus |
|-------|:---------------------------:|-------|
| GOVERN | {{GOVERN_CONTROLS}} | {{GOVERN_FOCUS}} |
| IDENTIFY | {{IDENTIFY_CONTROLS}} | {{IDENTIFY_FOCUS}} |
| PROTECT | {{PROTECT_CONTROLS}} | {{PROTECT_FOCUS}} |
| DETECT | {{DETECT_CONTROLS}} | {{DETECT_FOCUS}} |
| RESPOND | {{RESPOND_CONTROLS}} | {{RESPOND_FOCUS}} |
| RECOVER | {{RECOVER_CONTROLS}} | {{RECOVER_FOCUS}} |

### Multi-Agent Routing

{{AGENT_ROUTING}}

### Phase Dependencies

{{PHASE_DEPENDENCIES}}

---

## 5. Control Family Walkthroughs

<!-- The bulk of the document. One subsection per control family. -->
<!-- Requires manual narrative writing with research backing. -->

{{CONTROL_FAMILY_WALKTHROUGHS}}

<!--
Template per family:

### Family {{FAMILY_ID}}: {{FAMILY_NAME}}

**Purpose:** {{FAMILY_PURPOSE}}

**Controls covered:** {{FAMILY_CONTROL_IDS}}

{{FAMILY_NARRATIVE}}

**Key controls explained:**

{{PER_CONTROL_EXPLANATIONS}}

**What good looks like:**

{{GOOD_LOOKS_LIKE}}

**Related cross-framework controls:**

{{CROSS_FRAMEWORK_REFS}}
-->

---

## 6. Evidence Requirements

### Evidence Matrix

<!-- Auto-generate from controls.yaml + implementation guide evidence sections -->

| Control Family | Evidence Types |
|---------------|----------------|
{{EVIDENCE_MATRIX}}

### Common Evidence Artifacts

{{COMMON_EVIDENCE_ARTIFACTS}}

### Evidence Organization

{{EVIDENCE_ORGANIZATION}}

---

## 7. Common Findings and Pitfalls

### Most Frequently Identified Gaps

<!-- Draw from implementation guide pitfalls sections -->

{{COMMON_GAPS}}

### Difficulty Areas

{{DIFFICULTY_AREAS}}

### Maturity Spectrum

| Level | Description |
|:-----:|-------------|
| 0 - None | {{MATURITY_L0}} |
| 1 - Initial | {{MATURITY_L1}} |
| 2 - Developing | {{MATURITY_L2}} |
| 3 - Defined | {{MATURITY_L3}} |
| 4 - Managed | {{MATURITY_L4}} |

---

## 8. Cross-Framework Relationships

### NIST CSF 2.0 Mapping

<!-- Auto-generate from crosswalk.yaml -->

{{NIST_CSF_MAPPING}}

### Overlap with Other Frameworks

{{FRAMEWORK_OVERLAP}}

### Evidence Reuse Opportunities

{{EVIDENCE_REUSE}}

### Complementary Certification Strategies

{{CERTIFICATION_STRATEGIES}}

---

## 9. Path to Compliance

### High-Level Roadmap

{{COMPLIANCE_ROADMAP}}

<!-- For certifiable frameworks, include certification process overview -->
{{CERTIFICATION_PROCESS}}

### References

- Implementation guide: `docs/{{FRAMEWORK_ID}}-implementation-guide.md`
- Certification guide: `docs/{{FRAMEWORK_ID}}-certification-guide.md` (if applicable)

---

## 10. Quick Reference Tables

### Control-to-Phase Mapping

<!-- Auto-generate from controls.yaml -->

| Control ID | Control Title | Phase | Mandatory | Frequency |
|:----------:|---------------|:-----:|:---------:|:---------:|
{{CONTROL_PHASE_TABLE}}

### Control-to-Evidence Matrix

<!-- Auto-generate from implementation guide evidence sections -->

| Control ID | Evidence Required |
|:----------:|-------------------|
{{CONTROL_EVIDENCE_TABLE}}

### Control-to-Policy Mapping

<!-- Map to standards/templates/policies/ -->

| Control ID | Applicable Policy Templates |
|:----------:|----------------------------|
{{CONTROL_POLICY_TABLE}}

### Glossary

{{GLOSSARY}}

---

## Sources

{{SOURCES}}

---

<!--
TEMPLATE NOTES (remove when instantiating):

Auto-generatable sections (from controls.yaml + metadata.yaml + crosswalk.yaml):
  - Section 3: Framework Architecture (control families table)
  - Section 4: Assessment Workflow Mapping (phase mapping table)
  - Section 6: Evidence Requirements (evidence matrix structure)
  - Section 8: Cross-Framework Relationships (crosswalk data)
  - Section 10: Quick Reference Tables (all tables)

Manual narrative sections (require research and writing):
  - Section 1: Framework Overview
  - Section 2: Who Needs This Framework
  - Section 5: Control Family Walkthroughs
  - Section 7: Common Findings and Pitfalls
  - Section 9: Path to Compliance

Length target: 400-800 lines per instantiated handbook (depending on framework size)
Tone: Professional, plain language, practitioner-focused
-->
