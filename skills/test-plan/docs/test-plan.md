# Test Plan - Template

> **Note:** This is the main template for test plan generation. Skills may have
> their own specialized templates (see skills/pentest/docs/test-plan.md and
> skills/sec-review/docs/test-plan.md).

**Engagement ID:** `TP-YYYY-XXX`
**References:** `scope.md`, `methodology-selection.md`
**Status:** Draft / Pending Approval
**Last Updated:** YYYY-MM-DD

---

## 1. Plan Metadata

### Scope Summary
- **Project:** [Project name]
- **Assessment Type:** [pentest / security review / code review / vuln-scan]
- **Domains in Scope:** [List from scope document]
- **Total Test Cases:** [Count]
- **Estimated Duration:** [X days]

### Methodology Mapping
| Domain | Framework File | Controls to Test |
|--------|---------------|------------------|
| Web Application | `methodologies/web-api/framework.md` | OWASP Top 10 2021 |
| API | `methodologies/web-api/framework.md` | OWASP API Security Top 10 2023 |
| Mobile | `methodologies/mobile/framework.md` | MASVS |
| Network | `methodologies/network/framework.md` | MITRE ATT&CK |
| Cloud (AWS) | `methodologies/cloud/aws-framework.md` | CIS AWS Benchmark |
| Cloud (Azure) | `methodologies/cloud/azure-framework.md` | CIS Azure Benchmark |
| Cloud (GCP) | `methodologies/cloud/gcp-framework.md` | CIS GCP Benchmark |
| AI/LLM | `methodologies/ai-llm/framework.md` | LLM Top 10 |
| Active Directory | `methodologies/active-directory/framework.md` | AD Security |

---

## 2. Test Case Sections

> **Guidance:** Include sections only for domains selected in the scope. Each section references its source methodology framework.

---

### [DOMAIN: Web Application Testing]
**Source:** `methodologies/web-api/framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** OWASP A##:2021, CWE-###
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

### [DOMAIN: API Testing]
**Source:** `methodologies/web-api/framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** OWASP API#:2023, CWE-###
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

### [DOMAIN: Mobile Testing]
**Source:** `methodologies/mobile/framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** MASVS-###
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

### [DOMAIN: Network/Infrastructure Testing]
**Source:** `methodologies/network/framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** MITRE ATT&CK T####
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

### [DOMAIN: Cloud Security Testing]
**Source:** `methodologies/cloud/{provider}-framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** CIS {Provider} #.#.#
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

### [DOMAIN: AI/LLM Testing]
**Source:** `methodologies/ai-llm/framework.md`

#### Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** OWASP LLM Top 10 - ###
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

---

## 3. Custom Test Cases

> **Guidance:** Add test cases derived from specific vulnerabilities, client concerns, or threat intelligence

### Custom Test Case Template
```
#### Test Case: TC{NNN}-{Name}
- **Objective:** Test for [specific vulnerability or concern]
- **Source:** [CVE ID, blog post, client threat intel]
- **Time Estimate:** X hours
- **Steps:**
  ```bash
  # [copy-paste commands from research]
  ```
- **Expected Result:** [Expected outcome]
- **Evidence:** [Evidence to capture]
```

---

## 4. Execution Notes

### Prerequisites
- [ ] Access credentials obtained
- [ ] Scope confirmed with client
- [ ] Testing window scheduled
- [ ] Emergency contacts identified

### Tools Required
- Burp Suite Professional
- nmap
- sqlmap
- nikto
- [Other tools as needed per domain]

### Environment
- [ ] Staging/Development access (if applicable)
- [ ] Production access (if applicable)
- [ ] VPN/Network access configured

---

## 5. Risk and Limitations

### Known Limitations
- Testing during business hours only
- No DDoS testing
- Limited API rate limits

### Risk Mitigation
- Execute non-disruptive tests first
- Coordinate with client for availability
- Stop immediately if issues detected

---

## 6. Approval

### Test Plan Approval

| | |
|---|---|
| **Test Plan Status** | [ ] Approved for Execution |
| **Lead Tester** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---

*Template: skills/test-plan/docs/test-plan.md*
*This document is dynamically assembled based on scope domain selection*
