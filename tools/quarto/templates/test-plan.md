# Test Plan

**Engagement ID:** `[TYPE]-YYYY-XXX`
**Engagement Type:** [Penetration Test | Security Code Review | Security Architecture Review]
**References:** `scoping-document.md`
**Status:** Draft / Pending Approval
**Last Updated:** YYYY-MM-DD

---

## 1. Plan Overview

### Scope Summary
- **Assets in Scope:** [Count from scoping document]
- **Engagement Type:** [External / Internal / Red Team / Code Review / etc.]
- **Methodology:** [OWASP, MITRE ATT&CK, CWE, STRIDE, etc.]

### Objectives
1. [Primary objective - e.g., Identify security vulnerabilities]
2. [Secondary objective - e.g., Validate security controls]
3. [Deliverable objective - e.g., Provide remediation guidance]

---

## 2. Test Approach

### Testing Domains (Select applicable)

| Domain | Approach | Framework |
|--------|----------|-----------|
| [Web Application] | [Manual + Automated] | [OWASP Top 10] |
| [API] | [Manual + Automated] | [OWASP API Top 10] |
| [Source Code] | [Static Analysis + Manual] | [CWE] |
| [Network] | [Manual] | [MITRE ATT&CK] |
| [Cloud] | [Automated + Manual] | [CIS Benchmarks] |
| [Architecture] | [Review + Interview] | [STRIDE/PASTA] |

---

## 3. Test Cases

### 3.1 [Domain: Web Application]

#### [Test Case: Authentication]
- **Objective:** Test authentication mechanisms
- **Framework:** OWASP A07
- **Steps:**
  ```
  [Test command or action]
  ```
- **Expected:** [Secure authentication enforced]
- **Evidence:** [Screenshots, logs, requests]

#### [Test Case: Access Control]
- **Objective:** Test authorization checks
- **Framework:** OWASP A01
- **Steps:**
  ```
  [Test command or action]
  ```
- **Expected:** [Proper authorization]
- **Evidence:** [HTTP responses]

---

### 3.2 [Domain: API]

#### [Test Case: BOLA]
- **Objective:** Test object-level authorization
- **Framework:** OWASP API1
- **Steps:**
  ```
  [Test command or action]
  ```
- **Expected:** [Access denied for unauthorized resources]
- **Evidence:** [Responses showing proper enforcement]

---

### 3.3 [Domain: Source Code]

#### [Test Case: Input Validation]
- **Objective:** Verify input sanitization
- **Framework:** CWE-20, CWE-77
- **Review Commands:**
  ```
  grep -rn "sql" src/
  ```
- **Expected:** [Parameterized queries used]
- **Evidence:** [Code snippets]

---

### 3.4 [Custom / Engagement-Specific]

#### [Test Case: CVE-XXXX-XXXXX]
- **Objective:** Test for specific vulnerability
- **Source:** [CVE/Threat Intel]
- **Steps:**
  ```
  [Command]
  ```
- **Expected:** [Outcome]
- **Evidence:** [To capture]

---

## 4. Tools Required

| Tool | Purpose | Available |
|------|---------|-----------|
| [Burp Suite] | Web testing | [Yes/No] |
| [Nmap] | Network scanning | [Yes/No] |
| [Semgrep] | Static analysis | [Yes/No] |
| | | |

---

## 5. Timeline

| Phase | Duration | Activities |
|-------|----------|------------|
| Setup | [X hours] | Access verification, tools ready |
| Execution | [X hours] | Testing per test cases |
| Documentation | [X hours] | Findings, evidence organization |
| **Total** | **X hours** | |

---

## 6. Approval

| | |
|---|---|
| **Status** | [ ] Approved for Execution |
| **Lead Tester** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---

*Template: templates/test-plan.md*
