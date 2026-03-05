---
type: template
name: compliance-matrix-template
category: compliance-assessment
classification: public
version: 1.0
last_updated: 2026-01-14
---

# [ORGANIZATION NAME] Compliance Matrix

**Prepared for:** [CLIENT NAME]
**Prepared by:** [ASSESSOR]
**Assessment Date:** [DATE]
**Frameworks Assessed:** [FRAMEWORK LIST]

---

## Document Control

| Version | Date | Author | Changes | Approved By | Next Review |
|---------|------|--------|---------|-------------|-------------|
| [VERSION] | [DATE] | [AUTHOR] | [CHANGE SUMMARY] | [APPROVER] | [NEXT REVIEW] |

---

## Executive Summary

| Metric | Value | Status |
|--------|-------|--------|
| **Overall Compliance** | [XX]% | [STATUS INDICATOR] |
| **Controls Assessed** | [N] | - |
| **Fully Compliant** | [N] | - |
| **Partially Compliant** | [N] | - |
| **Non-Compliant** | [N] | - |
| **Not Applicable** | [N] | - |

---

## Compliance by Framework

### [FRAMEWORK 1 NAME]

| Category | Controls | Compliant | Partial | Non-Compliant | Score |
|----------|----------|-----------|---------|---------------|-------|
| [CATEGORY 1] | [N] | [N] | [N] | [N] | [XX]% |
| [CATEGORY 2] | [N] | [N] | [N] | [N] | [XX]% |
| **Total** | **[N]** | **[N]** | **[N]** | **[N]** | **[XX]%** |

### [FRAMEWORK 2 NAME]

| Category | Controls | Compliant | Partial | Non-Compliant | Score |
|----------|----------|-----------|---------|---------------|-------|
| [CATEGORY 1] | [N] | [N] | [N] | [N] | [XX]% |
| [CATEGORY 2] | [N] | [N] | [N] | [N] | [XX]% |
| **Total** | **[N]** | **[N]** | **[N]** | **[N]** | **[XX]%** |

---

## Compliance by NIST CSF Phase

| Phase | Function | Controls | Compliant | Partial | Non-Compliant | Score |
|-------|----------|----------|-----------|---------|---------------|-------|
| GV | GOVERN | [N] | [N] | [N] | [N] | [XX]% |
| ID | IDENTIFY | [N] | [N] | [N] | [N] | [XX]% |
| PR | PROTECT | [N] | [N] | [N] | [N] | [XX]% |
| DE | DETECT | [N] | [N] | [N] | [N] | [XX]% |
| RS | RESPOND | [N] | [N] | [N] | [N] | [XX]% |
| RC | RECOVER | [N] | [N] | [N] | [N] | [XX]% |

---

## Control Cross-Reference Matrix

**Format:** For each assessed control, shows compliance status across all frameworks.

| Control ID | Description | NIST CSF | HIPAA | PCI-DSS | ISO 27001 | Status |
|------------|-------------|----------|-------|---------|-----------|--------|
| [CTRL-001] | [Description] | PR.AA-01 | §164.312(d) | 8.3.1 | A.8.5 | [STATUS] |
| [CTRL-002] | [Description] | PR.DS-01 | §164.312(a)(2)(iv) | 3.4 | A.8.10 | [STATUS] |
| [CTRL-003] | [Description] | DE.CM-01 | §164.312(b) | 10.1 | A.8.15 | [STATUS] |

**Status Legend:**
- ✅ Fully Compliant - Control implemented and verified
- ⚠️ Partially Compliant - Control exists but gaps identified
- ❌ Non-Compliant - Control missing or ineffective
- N/A - Not Applicable to this organization

---

## Gap Summary by Priority

### Critical Gaps (Immediate Action Required)

| ID | Control | Frameworks Affected | Finding | Risk |
|----|---------|---------------------|---------|------|
| [GAP-C1] | [Control] | [Frameworks] | [Description] | [Risk Level] |

### High Priority Gaps (Address Within 30 Days)

| ID | Control | Frameworks Affected | Finding | Risk |
|----|---------|---------------------|---------|------|
| [GAP-H1] | [Control] | [Frameworks] | [Description] | [Risk Level] |

### Medium Priority Gaps (Address Within 90 Days)

| ID | Control | Frameworks Affected | Finding | Risk |
|----|---------|---------------------|---------|------|
| [GAP-M1] | [Control] | [Frameworks] | [Description] | [Risk Level] |

---

## Framework-Specific Certification Readiness

### [FRAMEWORK NAME] Certification Assessment

**Certification Target:** [Certification Level/Type]
**Current Readiness:** [XX]%
**Estimated Gap Closure:** [Timeframe]

**Critical Blockers:**
1. [Blocker 1]
2. [Blocker 2]

**Required Actions Before Certification:**
1. [Action 1]
2. [Action 2]

---

## Evidence Index

| Control ID | Evidence Type | Document/Screenshot | Location | Verified |
|------------|---------------|---------------------|----------|----------|
| [CTRL-001] | Policy | [Document Name] | [Path] | [Date] |
| [CTRL-002] | Configuration | [Screenshot Name] | [Path] | [Date] |
| [CTRL-003] | Interview | [Transcript Ref] | [Path] | [Date] |

---

## Appendix: Control Deduplication Analysis

**Purpose:** Shows which single implementations satisfy multiple framework requirements.

### Access Control - MFA Implementation

**Single Implementation Satisfies:**
- NIST CSF 2.0: PR.AA-01 (Identity management)
- PCI-DSS v4.0.1: 8.3.1 (MFA for administrative access)
- HIPAA: §164.312(d) (Person/entity authentication)
- ISO 27001: A.8.5 (Secure authentication)
- CIS v8: 6.3 (Require MFA)

**Implementation Evidence:**
- [Evidence Reference]

### Encryption at Rest

**Single Implementation Satisfies:**
- NIST CSF 2.0: PR.DS-01 (Data at rest protection)
- PCI-DSS v4.0.1: 3.4 (Render PAN unreadable)
- HIPAA: §164.312(a)(2)(iv) (Encryption)
- ISO 27001: A.8.10 (Information deletion)

**Implementation Evidence:**
- [Evidence Reference]

---

**Generated by:** Compliance Skill v2.0
**Frameworks Source:** `standards/frameworks/*/manifest.yaml`
