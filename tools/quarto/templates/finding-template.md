# Finding: [Vulnerability Title]

**Finding ID:** [ENG-001]
**Severity:** [Critical | High | Medium | Low | Informational]
**Status:** [Open | In Progress | Remediated | Accepted Risk]
**CVSS:** [X.X] ([Vector string])

---

## Executive Summary

> [One sentence: vulnerability description and business impact]

**Classification:** CWE-XXX | OWASP Category
**Confidence:** [HIGH | MEDIUM | LOW]
**Affected Component:** [URL/File/Service]
**Discovered:** YYYY-MM-DD

---

## Description

[Technical description: what the vulnerability is, root cause, and how it manifests]

### Affected Components

| Component | Details |
|-----------|---------|
| Endpoint | [URL or API path] |
| Parameter | [If applicable] |
| Code Location | [File:Line or Function] |
| Environment | [Production/Staging/Development] |

**Vulnerable Code:**
```[language]
// Code showing the vulnerability
```

---

## Impact Assessment

### Technical Impact

| CIA Triad | Impact Level | Details |
|----------|--------------|---------|
| Confidentiality | [None/Low/Medium/High] | [What data can be accessed] |
| Integrity | [None/Low/Medium/High] | [What can be modified] |
| Availability | [None/Low/Medium/High] | [What can be disrupted] |

### Business Impact

- **Affected Users:** [Count or description]
- **Data at Risk:** [PII/Financial/Credentials/etc.]
- **Compliance:** [GDPR/PCI/HIPAA implications]
- **Financial:** [Estimated impact]

### Attack Scenario

1. [Attacker prerequisite]
2. [Attack action]
3. [Achieved outcome]

---

## Proof of Concept

### Reproduction Steps

1. **Step 1:** [Action]
    ```
    [Command or request]
    ```
2. **Step 2:** [Action]
    ```
    [Command or request]
    ```

### Evidence

**Request:**
```http
[HTTP request demonstrating vulnerability]
```

**Response:**
```http
[HTTP response showing impact]
```

![Screenshot](screenshot.png)

---

## Remediation

### Immediate Mitigation

[Quick fix - can be applied in minutes/hours without code change]

### Recommended Fix

```[language]
// Secure implementation
```

### Verification

[How to confirm the fix is effective - re-run PoC should fail]

---

## References

- **CWE:** https://cwe.mitre.org/data/definitions/XXX.html
- **OWASP:** https://owasp.org/www-community/attacks/
- **NIST:** [Relevant control or guideline]
- **Vendor Advisory:** [If applicable]

---

## Timeline

| Event | Date |
|-------|------|
| Discovered | YYYY-MM-DD |
| Reported | YYYY-MM-DD |
| Acknowledged | YYYY-MM-DD |
| Remediation Target | YYYY-MM-DD |
| Verified Fixed | — |

---

*Template: templates/finding-template.md*
