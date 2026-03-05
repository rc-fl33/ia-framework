# AIUC-1 AI Unified Controls v1.0 -- Reference Document

## Executive Summary

AIUC-1 (AI Unified Controls) is the defacto enterprise AI agent standard, providing 51 auditable requirements across 6 principles for AI risk management. Of the 51 requirements, **39 are mandatory** and **12 are optional**.

**Principles:**

| ID | Principle | Focus |
|----|-----------|-------|
| A | Data & Privacy | Safeguarding customer information against leakage, IP exposure, and unauthorized training use |
| B | Security | Defending against adversarial testing, prompt injection, and jailbreak attempts |
| C | Safety | Mitigating harmful outputs and protecting brand reputation through testing and monitoring |
| D | Reliability | Preventing hallucinations and unauthorized tool calls that cause customer harm |
| E | Accountability | Enforcing governance through approval processes and failure planning |
| F | Society | Preventing AI-enabled societal harms including cyber exploitation and catastrophic risks |

**Developed by:** Anthropic, MITRE, Google Cloud, Cisco, Stanford, JPMorgan Chase, and 25+ organizations.

**First accredited auditor:** Schellman.

**Operationalizes:** EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, CSA AICM.

**Source:** https://www.aiuc-1.com/
**Navigator:** https://adversis.github.io/aiuc1-navigator/
**Machine-readable data:** `aiuc-1-standards.json` (same directory)

---

## Full Requirement Table

All 51 requirements with status, frequency, type, and principle mapping.

| ID | Title | Status | Frequency | Type | Principle |
|----|-------|--------|-----------|------|-----------|
| A001 | Establish input data policy | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A002 | Establish output data policy | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A003 | Limit AI agent data collection | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A004 | Protect IP & trade secrets | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A005 | Prevent cross-customer data exposure | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A006 | Prevent PII leakage | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| A007 | Prevent IP violations | Mandatory | Every 12 months | Preventative | A - Data & Privacy |
| B001 | Third-party testing of adversarial robustness | Mandatory | Every 3 months | Preventative | B - Security |
| B002 | Detect adversarial input | Optional | Every 3 months | Detective | B - Security |
| B003 | Manage public release of technical details | Optional | Every 12 months | Preventative | B - Security |
| B004 | Prevent AI endpoint scraping | Mandatory | Every 12 months | Preventative | B - Security |
| B005 | Implement real-time input filtering | Optional | Every 12 months | Detective | B - Security |
| B006 | Limit AI agent system access | Mandatory | Every 12 months | Preventative | B - Security |
| B007 | Enforce user access privileges to AI systems | Mandatory | Every 3 months | Preventative | B - Security |
| B008 | Protect model deployment environment | Mandatory | Every 12 months | Preventative | B - Security |
| B009 | Limit output over-exposure | Mandatory | Every 12 months | Preventative | B - Security |
| C001 | Define AI risk taxonomy | Mandatory | Every 3 months | Preventative | C - Safety |
| C002 | Conduct pre-deployment testing | Mandatory | Every 12 months | Preventative | C - Safety |
| C003 | Prevent harmful outputs | Mandatory | Every 12 months | Preventative | C - Safety |
| C004 | Prevent out-of-scope outputs | Mandatory | Every 12 months | Preventative | C - Safety |
| C005 | Prevent customer-defined high risk outputs | Mandatory | Every 12 months | Preventative | C - Safety |
| C006 | Prevent output vulnerabilities | Mandatory | Every 3 months | Preventative | C - Safety |
| C007 | Flag high risk recommendations | Optional | Every 12 months | Preventative | C - Safety |
| C008 | Monitor AI risk categories | Optional | Every 12 months | Detective | C - Safety |
| C009 | Enable real-time feedback and intervention | Optional | Every 3 months | Preventative | C - Safety |
| C010 | Third-party testing for harmful outputs | Mandatory | Every 3 months | Preventative | C - Safety |
| C011 | Third-party testing for out-of-scope outputs | Mandatory | Every 3 months | Preventative | C - Safety |
| C012 | Third-party testing for customer-defined risk | Mandatory | Every 3 months | Preventative | C - Safety |
| D001 | Prevent hallucinated outputs | Mandatory | Every 12 months | Preventative | D - Reliability |
| D002 | Third-party testing for hallucinations | Mandatory | Every 3 months | Preventative | D - Reliability |
| D003 | Restrict unsafe tool calls | Mandatory | Every 12 months | Preventative | D - Reliability |
| D004 | Third-party testing of tool calls | Mandatory | Every 3 months | Preventative | D - Reliability |
| E001 | AI failure plan for security breaches | Mandatory | Every 12 months | Preventative | E - Accountability |
| E002 | AI failure plan for harmful outputs | Mandatory | Every 12 months | Preventative | E - Accountability |
| E003 | AI failure plan for hallucinations | Mandatory | Every 12 months | Preventative | E - Accountability |
| E004 | Assign accountability | Mandatory | Every 12 months | Preventative | E - Accountability |
| E005 | Assess cloud vs on-prem processing | Mandatory | Every 12 months | Preventative | E - Accountability |
| E006 | Conduct vendor due diligence | Mandatory | Every 12 months | Preventative | E - Accountability |
| E007 | Document system change approvals | Optional | Every 12 months | Detective | E - Accountability |
| E008 | Review internal processes | Mandatory | Every 12 months | Preventative | E - Accountability |
| E009 | Monitor third-party access | Optional | Every 12 months | Preventative | E - Accountability |
| E010 | Establish AI acceptable use policy | Mandatory | Every 12 months | Preventative | E - Accountability |
| E011 | Record processing locations | Mandatory | Every 12 months | Preventative | E - Accountability |
| E012 | Document regulatory compliance | Mandatory | Every 6 months | Preventative | E - Accountability |
| E013 | Implement quality management system | Optional | Every 12 months | Preventative | E - Accountability |
| E014 | Share transparency reports | Optional | Every 12 months | Preventative | E - Accountability |
| E015 | Log model activity | Mandatory | Every 12 months | Detective | E - Accountability |
| E016 | Implement AI disclosure mechanisms | Mandatory | Every 12 months | Preventative | E - Accountability |
| E017 | Document system transparency policy | Optional | Every 12 months | Preventative | E - Accountability |
| F001 | Prevent AI cyber misuse | Mandatory | Every 12 months | Preventative | F - Society |
| F002 | Prevent catastrophic misuse | Mandatory | Every 12 months | Detective | F - Society |

---

## Cross-Framework Mappings

All 51 AIUC-1 requirements are mapped to external frameworks including EU AI Act, ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, and CSA AICM.

**For complete control-to-control mappings**, see:
- `../../mappings/crosswalks/aiuc-1.yaml` - Structured cross-framework control mappings

The crosswalk file contains mappings for all 51 controls organized by AIUC-1 control ID with confidence levels and evidence citations.

---

## Principle-by-Principle Breakdown

### Principle A: Data & Privacy

**Focus:** Safeguarding customer information against leakage, IP exposure, and unauthorized training use.

**Requirements:** 7 (all mandatory)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| A001 | Establish input data policy | Mandatory | Every 12 months | Preventative |
| A002 | Establish output data policy | Mandatory | Every 12 months | Preventative |
| A003 | Limit AI agent data collection | Mandatory | Every 12 months | Preventative |
| A004 | Protect IP & trade secrets | Mandatory | Every 12 months | Preventative |
| A005 | Prevent cross-customer data exposure | Mandatory | Every 12 months | Preventative |
| A006 | Prevent PII leakage | Mandatory | Every 12 months | Preventative |
| A007 | Prevent IP violations | Mandatory | Every 12 months | Preventative |

**Key themes:** Data retention policies, opt-out mechanisms, IP protection, cross-customer isolation, PII safeguards. All requirements are preventative controls reviewed annually.

---

### Principle B: Security

**Focus:** Defending against adversarial testing, prompt injection, and jailbreak attempts.

**Requirements:** 9 (6 mandatory, 3 optional)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| B001 | Third-party testing of adversarial robustness | Mandatory | Every 3 months | Preventative |
| B002 | Detect adversarial input | Optional | Every 3 months | Detective |
| B003 | Manage public release of technical details | Optional | Every 12 months | Preventative |
| B004 | Prevent AI endpoint scraping | Mandatory | Every 12 months | Preventative |
| B005 | Implement real-time input filtering | Optional | Every 12 months | Detective |
| B006 | Limit AI agent system access | Mandatory | Every 12 months | Preventative |
| B007 | Enforce user access privileges to AI systems | Mandatory | Every 3 months | Preventative |
| B008 | Protect model deployment environment | Mandatory | Every 12 months | Preventative |
| B009 | Limit output over-exposure | Mandatory | Every 12 months | Preventative |

**Key themes:** Adversarial robustness (quarterly third-party testing), prompt injection defense, endpoint scraping prevention, agent access control, model environment hardening, output exposure limits.

---

### Principle C: Safety

**Focus:** Mitigating harmful outputs and protecting brand reputation through testing and monitoring.

**Requirements:** 12 (8 mandatory, 4 optional)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| C001 | Define AI risk taxonomy | Mandatory | Every 3 months | Preventative |
| C002 | Conduct pre-deployment testing | Mandatory | Every 12 months | Preventative |
| C003 | Prevent harmful outputs | Mandatory | Every 12 months | Preventative |
| C004 | Prevent out-of-scope outputs | Mandatory | Every 12 months | Preventative |
| C005 | Prevent customer-defined high risk outputs | Mandatory | Every 12 months | Preventative |
| C006 | Prevent output vulnerabilities | Mandatory | Every 3 months | Preventative |
| C007 | Flag high risk recommendations | Optional | Every 12 months | Preventative |
| C008 | Monitor AI risk categories | Optional | Every 12 months | Detective |
| C009 | Enable real-time feedback and intervention | Optional | Every 3 months | Preventative |
| C010 | Third-party testing for harmful outputs | Mandatory | Every 3 months | Preventative |
| C011 | Third-party testing for out-of-scope outputs | Mandatory | Every 3 months | Preventative |
| C012 | Third-party testing for customer-defined risk | Mandatory | Every 3 months | Preventative |

**Key themes:** Risk taxonomy (quarterly), pre-deployment safety testing, harmful/out-of-scope output prevention, brand safety, anomaly detection, third-party testing for harmful outputs, out-of-scope outputs, and customer-defined risk categories (all quarterly).

---

### Principle D: Reliability

**Focus:** Preventing hallucinations and unauthorized tool calls that cause customer harm.

**Requirements:** 4 (all mandatory)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| D001 | Prevent hallucinated outputs | Mandatory | Every 12 months | Preventative |
| D002 | Third-party testing for hallucinations | Mandatory | Every 3 months | Preventative |
| D003 | Restrict unsafe tool calls | Mandatory | Every 12 months | Preventative |
| D004 | Third-party testing of tool calls | Mandatory | Every 3 months | Preventative |

**Key themes:** Hallucination measurement and monitoring, tool call authorization and oversight. Third-party testing for both hallucinations and tool calls required quarterly.

---

### Principle E: Accountability

**Focus:** Enforcing governance through approval processes and failure planning.

**Requirements:** 17 (12 mandatory, 5 optional)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| E001 | AI failure plan for security breaches | Mandatory | Every 12 months | Preventative |
| E002 | AI failure plan for harmful outputs | Mandatory | Every 12 months | Preventative |
| E003 | AI failure plan for hallucinations | Mandatory | Every 12 months | Preventative |
| E004 | Assign accountability | Mandatory | Every 12 months | Preventative |
| E005 | Assess cloud vs on-prem processing | Mandatory | Every 12 months | Preventative |
| E006 | Conduct vendor due diligence | Mandatory | Every 12 months | Preventative |
| E007 | Document system change approvals | Optional | Every 12 months | Detective |
| E008 | Review internal processes | Mandatory | Every 12 months | Preventative |
| E009 | Monitor third-party access | Optional | Every 12 months | Preventative |
| E010 | Establish AI acceptable use policy | Mandatory | Every 12 months | Preventative |
| E011 | Record processing locations | Mandatory | Every 12 months | Preventative |
| E012 | Document regulatory compliance | Mandatory | Every 6 months | Preventative |
| E013 | Implement quality management system | Optional | Every 12 months | Preventative |
| E014 | Share transparency reports | Optional | Every 12 months | Preventative |
| E015 | Log model activity | Mandatory | Every 12 months | Detective |
| E016 | Implement AI disclosure mechanisms | Mandatory | Every 12 months | Preventative |
| E017 | Document system transparency policy | Optional | Every 12 months | Preventative |

**Key themes:** Failure planning (security breaches, harmful outputs, hallucinations), accountability assignment, vendor due diligence, acceptable use policies, regulatory compliance documentation (semi-annual), activity logging, AI disclosure mechanisms, transparency.

---

### Principle F: Society

**Focus:** Preventing AI-enabled societal harms including cyber exploitation and catastrophic risks.

**Requirements:** 2 (all mandatory)

| ID | Title | Status | Frequency | Type |
|----|-------|--------|-----------|------|
| F001 | Prevent AI cyber misuse | Mandatory | Every 12 months | Preventative |
| F002 | Prevent catastrophic misuse | Mandatory | Every 12 months | Detective |

**Key themes:** Preventing AI systems from being used for cyberattacks or causing catastrophic societal harm. F001 is preventative (proactive controls), F002 is detective (monitoring for misuse indicators).

---

## Statistics

- **Total requirements:** 51
- **Mandatory:** 39
- **Optional:** 12
- **Preventative controls:** 45
- **Detective controls:** 6
- **Quarterly frequency:** 13 requirements
- **Semi-annual frequency:** 1 requirement (E012)
- **Annual frequency:** 37 requirements
