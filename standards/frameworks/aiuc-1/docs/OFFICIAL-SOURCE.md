# AIUC-1 Official Source

**Source:** https://www.aiuc-1.com/
**Accessed:** 2026-03-03

## Categories and Controls

### A: Data & Privacy (7 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| A001 | Establish and communicate AI input data policies covering how customer data is used for model training, inference processing, data retention periods, and customer data rights | Yes |
| A002 | Establish AI output ownership, usage, opt-out and deletion policies to customers and communicate these policies | Yes |
| A003 | Implement safeguards to limit AI agent data access to task-relevant information based on user roles and context | Yes |
| A004 | Implement safeguards or technical controls to prevent AI systems from leaking company intellectual property or confidential information | Yes |
| A005 | Implement safeguards to prevent cross-customer data exposure when combining customer data from multiple sources | Yes |
| A006 | Establish safeguards to prevent personal data leakage through AI outputs and logs | Yes |
| A007 | Implement safeguards and technical controls to prevent AI outputs from violating copyrights, trademarks, or other third-party intellectual property rights | Yes |

### B: Security (9 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| B001 | Third-party testing of adversarial robustness - Implement adversarial testing program to validate system resilience against adversarial inputs and prompt injection attempts in line with adversarial threat taxonomy | Yes |
| B002 | Detect adversarial input - Implement monitoring capabilities to detect and respond to adversarial inputs and prompt injection attempts | No |
| B003 | Manage public release of technical details - Implement controls to prevent over-disclosure of technical information about AI systems and organizational details that could enable adversarial targeting | No |
| B004 | Prevent AI endpoint scraping - Implement safeguards to prevent probing or scraping of external AI endpoints | Yes |
| B005 | Implement real-time input filtering - Implement real-time input filtering using automated moderation tools | No |
| B006 | Prevent unauthorized AI agent actions - Implement safeguards to prevent AI agents from performing actions beyond intended scope and authorized privileges | Yes |
| B007 | Enforce user access privileges to AI systems - Establish and maintain user access controls and admin privileges for AI systems in line with policy | Yes |
| B008 | Protect model deployment environment - Implement security measures for AI model deployment environments including encryption, access controls and authorization | Yes |
| B009 | Limit output over-exposure - Implement output limitations and obfuscation techniques to safeguard against information leakage | Yes |

### C: Safety (12 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| C001 | Define AI risk taxonomy - Establish a risk taxonomy that categorizes risks within harmful, out-of-scope, and hallucinated outputs, tool calls, and other risks based on application-specific usage | Yes |
| C002 | Conduct pre-deployment testing - Conduct internal testing of AI systems prior to deployment across risk categories for system changes requiring formal review or approval | Yes |
| C003 | Prevent harmful outputs - Implement safeguards or technical controls to prevent harmful outputs including distressed outputs, angry responses, high-risk advice, offensive content, bias, and deception | Yes |
| C004 | Prevent out-of-scope outputs - Implement safeguards or technical controls to prevent out-of-scope outputs (e.g. political discussion, healthcare advice) | Yes |
| C005 | Prevent customer-defined high risk outputs - Implement safeguards or technical controls to prevent additional high risk outputs as defined in risk taxonomy | Yes |
| C006 | Prevent output vulnerabilities - Implement safeguards to prevent security vulnerabilities in outputs from impacting users | Yes |
| C007 | Flag high risk outputs - Implement an alerting system that flags high-risk outputs for human review | No |
| C008 | Monitor AI risk categories - Implement monitoring of AI systems across risk categories | No |
| C009 | Enable real-time feedback and intervention - Implement mechanisms to enable real-time user feedback collection and intervention mechanisms | No |
| C010 | Third-party testing for harmful outputs - Appoint expert third parties to evaluate system robustness to harmful outputs including distressed outputs, angry responses, high-risk advice, offensive content, bias, and deception at least every 3 months | Yes |
| C011 | Third-party testing for out-of-scope outputs - Appoint expert third parties to evaluate system robustness to out-of-scope outputs at least every 3 months (e.g. political discussion, healthcare advice) | Yes |
| C012 | Third-party testing for customer-defined risk - Appoint expert third-parties to evaluate system robustness to additional high-risk outputs as defined in risk taxonomy at least every 3 months | Yes |

### D: Reliability (4 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| D001 | Prevent hallucinated outputs - Implement safeguards or technical controls to prevent hallucinated outputs | Yes |
| D002 | Third-party testing for hallucinations - Appoint expert third-parties to evaluate hallucinated outputs at least every 3 months | Yes |
| D003 | Restrict unsafe tool calls - Implement safeguards or technical controls to prevent tool calls in AI systems from executing unauthorized actions, accessing restricted information, or making decisions beyond their intended scope | Yes |
| D004 | Third-party testing of tool calls - Appoint expert third-parties to evaluate tool calls in AI systems, including executing unauthorized actions, accessing restricted information, or making decisions beyond their intended scope at least every 3 months | Yes |

### E: Accountability (17 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| E001 | Document AI failure plan for AI privacy and security breaches assigning accountable owners and establishing notification and remediation with third-party support as needed (e.g. legal, PR, insurers) | Yes |
| E002 | Document AI failure plan for harmful AI outputs that cause significant customer harm assigning accountable owners and establishing remediation with third-party support as needed | Yes |
| E003 | Document AI failure plan for hallucinated AI outputs that cause substantial customer financial loss assigning accountable owners and establishing remediation | Yes |
| E004 | Document which AI system changes across the development & deployment lifecycle require formal review or approval, assign a lead accountable for each, and document their approval with supporting evidence | Yes |
| E005 | Establish criteria for selecting cloud provider, and circumstances for on-premises processing considering data sensitivity, regulatory requirements, security controls, and operational needs | Yes |
| E006 | Establish AI vendor due diligence processes for foundation and upstream model providers covering data handling, PII controls, security and compliance | Yes |
| E007 | Document system change approvals | No |
| E008 | Establish regular internal reviews of key processes and document review records and approvals | Yes |
| E009 | Implement systems to monitor third party access | No |
| E010 | Establish and implement an AI acceptable use policy | Yes |
| E011 | Document AI data processing locations | Yes |
| E012 | Document applicable AI laws and standards, required data protections, and strategies for compliance | Yes |
| E013 | Establish a quality management system for AI systems proportionate to the size of the organization | No |
| E014 | Share transparency reports | No |
| E015 | Maintain logs of AI system processes, actions, and model outputs where permitted to support incident investigation, auditing, and explanation of AI system behavior | Yes |
| E016 | Implement clear disclosure mechanisms to inform users when they are interacting with AI systems rather than humans | Yes |
| E017 | Establish a system transparency policy and maintain a repository of model cards, datasheets, and interpretability reports for major systems | No |

### F: Society (2 controls)
| ID | Control | Mandatory |
|----|---------|-----------|
| F001 | Prevent AI cyber misuse - Implement or document guardrails to prevent AI-enabled misuse for cyber attacks and exploitation | Yes |
| F002 | Prevent catastrophic misuse - Implement or document guardrails to prevent AI-enabled catastrophic system misuse (chemical / bio / radio / nuclear) | Yes |

## Summary
- **Total Controls:** 51
- **Mandatory:** 44
- **Optional:** 7
