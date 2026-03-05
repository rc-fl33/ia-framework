# AIUC-1 Official Sources Verification

## Official Source Information

| Field | Value |
|-------|-------|
| **Official URL** | https://www.aiuc-1.com/ |
| **Verification Date** | 2026-03-03 |
| **Framework Version** | 1.0 |
| **Framework Name** | AI Unified Controls (AIUC-1) |

## Source Pages Verified

| Category | URL | Controls Verified |
|----------|-----|-------------------|
| Data & Privacy | https://aiuc-1.com/data-and-privacy | A001-A007 |
| Security | https://aiuc-1.com/security | B001-B009 |
| Safety | https://aiuc-1.com/safety | C001-C012 |
| Reliability | https://aiuc-1.com/reliability | D001-D004 |
| Accountability | https://aiuc-1.com/accountability | E001-E017 |
| Society | https://aiuc-1.com/society | F001-F002 |

## Control Count Verification

| Category | Function ID | Official Controls | Local Controls | Status |
|----------|-------------|-------------------|-----------------|--------|
| Data & Privacy | A | 7 | A001-A007 (7) | MATCH |
| Security | B | 9 | B001-B009 (9) | MATCH |
| Safety | C | 12 | C001-C012 (12) | MATCH |
| Reliability | D | 4 | D001-D004 (4) | MATCH |
| Accountability | E | 17 | E001-E017 (17) | MATCH |
| Society | F | 2 | F001-F002 (2) | MATCH |

**Total Controls:** 51 (official) vs 51 (local) - **MATCH**

## Control Mapping Verification

### Section A: Data & Privacy

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| A001 | Establish input data policy | AI input data policies established and communicated | MATCH |
| A002 | Establish output data policy | AI output ownership and usage policies established | MATCH |
| A003 | Limit AI agent data collection | AI agent data access restricted to task-relevant information | MATCH |
| A004 | Protect IP & trade secrets | Safeguards prevent AI intellectual property leakage | MATCH |
| A005 | Prevent cross-customer data exposure | Cross-customer data exposure prevented | MATCH |
| A006 | Prevent PII leakage | Safeguards prevent PII leakage through AI outputs | MATCH |
| A007 | Prevent IP violations | Safeguards prevent IP violations in AI outputs | MATCH |

### Section B: Security

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| B001 | Third-party testing of adversarial robustness | Adversarial testing program validates system resilience | MATCH |
| B002 | Detect adversarial input | Monitoring detects adversarial inputs and prompt injection | MATCH |
| B003 | Manage public release of technical details | Controls prevent over-disclosure of technical information | MATCH |
| B004 | Prevent AI endpoint scraping | Safeguards prevent AI endpoint scraping | MATCH |
| B005 | Implement real-time input filtering | Real-time input filtering implemented | MATCH |
| B006 | Prevent unauthorized AI agent actions | Safeguards prevent unauthorized AI agent actions | MATCH |
| B007 | Enforce user access privileges to AI systems | User access controls enforced for AI systems | MATCH |
| B008 | Protect model deployment environment | Model deployment environment protected | MATCH |
| B009 | Limit output over-exposure | Output over-exposure limited | MATCH |

### Section C: Safety

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| C001 | Define AI risk taxonomy | AI risk taxonomy categorizes harmful output risks | MATCH |
| C002 | Conduct pre-deployment testing | Pre-deployment testing conducted | MATCH |
| C003 | Prevent harmful outputs | Safeguards prevent harmful outputs | MATCH |
| C004 | Prevent out-of-scope outputs | Safeguards prevent out-of-scope outputs | MATCH |
| C005 | Prevent customer-defined high risk outputs | Customer-defined high-risk outputs prevented | MATCH |
| C006 | Prevent output vulnerabilities | Output vulnerabilities prevented | MATCH |
| C007 | Flag high risk outputs | High-risk outputs flagged for human review | MATCH |
| C008 | Monitor AI risk categories | AI risk categories monitored | MATCH |
| C009 | Enable real-time feedback and intervention | Real-time feedback and intervention enabled | MATCH |
| C010 | Third-party testing for harmful outputs | Third-party testing for harmful outputs | MATCH |
| C011 | Third-party testing for out-of-scope outputs | Third-party testing for out-of-scope outputs | MATCH |
| C012 | Third-party testing for customer-defined risk | Third-party testing for customer-defined risks | MATCH |

### Section D: Reliability

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| D001 | Prevent hallucinated outputs | Safeguards prevent hallucinated outputs | MATCH |
| D002 | Third-party testing for hallucinations | Third-party testing for hallucinations | MATCH |
| D003 | Restrict unsafe tool calls | Unsafe tool calls restricted | MATCH |
| D004 | Third-party testing of tool calls | Third-party testing of tool calls | MATCH |

### Section E: Accountability

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| E001 | AI failure plan for security breaches | AI failure plan for security breaches | MATCH |
| E002 | AI failure plan for harmful outputs | AI failure plan for harmful outputs | MATCH |
| E003 | AI failure plan for hallucinations | AI failure plan for hallucinations | MATCH |
| E004 | Assign accountability | Accountability assigned for AI system changes | MATCH |
| E005 | Assess cloud vs on-prem processing | Cloud vs on-premises processing assessed | MATCH |
| E006 | Conduct vendor due diligence | Vendor due diligence conducted | MATCH |
| E007 | Document system change approvals | System change approvals documented | MATCH |
| E008 | Review internal processes | Internal processes reviewed | MATCH |
| E009 | Monitor third-party access | Third-party access monitored | MATCH |
| E010 | Establish AI acceptable use policy | AI acceptable use policy established | MATCH |
| E011 | Record processing locations | Processing locations recorded | MATCH |
| E012 | Document regulatory compliance | Regulatory compliance documented | MATCH |
| E013 | Implement quality management system | Quality management system implemented | MATCH |
| E014 | Share transparency reports | Transparency reports shared | MATCH |
| E015 | Log model activity | Model activity logged | MATCH |
| E016 | Implement AI disclosure mechanisms | AI disclosure mechanisms implemented | MATCH |
| E017 | Document system transparency policy | System transparency policy documented | MATCH |

### Section F: Society

| ID | Official Title | Local Title | Status |
|----|----------------|-------------|--------|
| F001 | Prevent AI cyber misuse | AI cyber misuse prevented | MATCH |
| F002 | Prevent catastrophic misuse | Catastrophic misuse prevented | MATCH |

## Discrepancies Found

**None.** All 51 controls match between the official source and the local `controls.yaml` file.

## Additional Enrichment in Local File

The local `controls.yaml` contains additional metadata beyond the official source requirements:

- **Implementation Steps** - Detailed step-by-step guidance for each control
- **Maturity Levels** - 5-level maturity model (Ad-hoc through Optimizing)
- **Tools and Approaches** - Recommended tools and their costs
- **Common Pitfalls** - Frequent mistakes and how to avoid them
- **Effort Estimates** - Person-hour estimates by organization size
- **Key Evidence** - Required evidence for compliance verification
- **Related Controls** - Cross-references to other controls

These enrichments are supplementary and do not conflict with the official AIUC-1 requirements.

## Verification Summary

| Metric | Result |
|--------|--------|
| Total Controls Verified | 51 |
| Controls Matching | 51 |
| Discrepancies | 0 |
| Verification Status | **VERIFIED** |

**Last Verified:** 2026-03-03
**Next Review Recommended:** 2026-06-03 (quarterly)
