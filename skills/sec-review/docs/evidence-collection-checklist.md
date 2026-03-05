# Evidence Collection Checklist

**Project:** _______________________________________________

This checklist identifies the documents and evidence that support each assessment domain.
Providing evidence from multiple categories significantly improves the accuracy and depth
of your security review. Priority indicates how critical the document is to the assessment.

---

## Domain A: Architecture and Environment

**Used in:** Phase 2, Steps 1a-1e (Architecture decomposition and threat modeling)

| Document | Priority | Provided |
|----------|----------|----------|
| System architecture diagram (component-level) | Required | [ ] |
| Network topology diagram | Required | [ ] |
| Data flow diagram | Required (if available) | [ ] |
| Trust boundary diagram | Recommended | [ ] |
| Infrastructure-as-Code files (Terraform, CloudFormation, Kubernetes) | Recommended | [ ] |
| API specification (OpenAPI/Swagger) | Recommended | [ ] |
| Authentication/authorization design document | Recommended | [ ] |
| Deployment architecture diagram | Recommended | [ ] |
| Third-party integration documentation | Optional | [ ] |
| Network segmentation rules / firewall policy | Optional | [ ] |
| CI/CD pipeline diagram | Optional | [ ] |

**Notes on provided documents:**
_______________________________________________

_______________________________________________

---

## Domain B: Security Practices

**Used in:** Phase 2, Step 1f (Security practices gap analysis)
**Also required:** Completed `security-practices-questionnaire.md`

| Document | Priority | Provided |
|----------|----------|----------|
| Secure coding standard / developer security guide | Required | [ ] |
| Vulnerability management policy | Required | [ ] |
| Software development lifecycle (SDLC) documentation | Required | [ ] |
| Security requirements documentation | Recommended | [ ] |
| Most recent SAST scan report | Recommended | [ ] |
| Most recent DAST scan report | Recommended | [ ] |
| SCA/dependency scan report | Recommended | [ ] |
| Most recent penetration test report | Recommended | [ ] |
| Security training curriculum or records | Optional | [ ] |
| Bug bounty program scope / disclosure policy | Optional | [ ] |
| Security incident log or post-mortem reports | Optional | [ ] |

**Notes on provided documents:**
_______________________________________________

_______________________________________________

---

## Domain C: Patch Management

**Used in:** Phase 2, Step 1g (Patch management maturity assessment)
**Also required:** Completed `patch-assessment-questionnaire.md`

| Document | Priority | Provided |
|----------|----------|----------|
| Patch management policy | Required | [ ] |
| Patch compliance report (current patch status) | Required | [ ] |
| Vulnerability scan report (showing unpatched CVEs) | Recommended | [ ] |
| Change management process documentation | Recommended | [ ] |
| Emergency patch procedure | Recommended | [ ] |
| Software / asset inventory | Recommended | [ ] |
| Patch SLA tracking or metrics | Optional | [ ] |
| Most recent audit finding related to patching | Optional | [ ] |

**Notes on provided documents:**
_______________________________________________

_______________________________________________

---

## Document Submission Instructions

1. Place all documents in `private/input/sec-review/{project}/`
2. Use the following naming convention for clarity:
   - `arch-diagram.{ext}` for architecture diagrams
   - `network-diagram.{ext}` for network topology
   - `api-spec.yaml` or `api-spec.json` for API specifications
   - `patch-policy.pdf` for patch management policy
   - Use descriptive names — avoid generic names like `document1.pdf`
3. For documents you cannot share digitally, describe them in the Notes fields above
4. For tools-generated reports, include the most recent version only

**Submit by:** _______________ (agree with reviewer before starting Phase 2)

---

**Note:** The more evidence provided, the more specific and actionable the findings and
recommendations will be. Gaps in evidence will result in assumptions being documented
explicitly in the analysis.
