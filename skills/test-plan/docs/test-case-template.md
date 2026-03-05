# Test Case Template

> **Note:** This template is used for individual test case files in the test-cases directory.

---

## Test Case: TC{NNN}-{Domain}-{Name}

**Domain:** [Web Application / API / Mobile / Network / Cloud / AI/LLM / AD / Web3 / Thick Client]
**Framework:** [OWASP Top 10 / API Security Top 10 / MASVS / MITRE ATT&CK / CIS / etc.]
**Compliance Mapping:** [PCI DSS 11.3 / FedRAMP AC-2 / HIPAA 164.312 / SOC 2 CC6.1] (optional)
**CWE:** CWE-###
**Time Estimate:** X hours

---

### Objective

[What this test validates. Describe the security control or vulnerability being tested.]

Example: Test for IDOR, privilege escalation, missing function-level access

---

### Framework Mapping

| Framework | Category/Control |
|----------|------------------|
| [Primary Framework] | [Category, e.g., OWASP A01:2021] |
| CWE | CWE-### |
| [Secondary Framework] | [Control ID if applicable] |

---

### Prerequisites

- [ ] Access to [target system]
- [ ] Test accounts: [list accounts needed]
- [ ] Tools: [list required tools]
- [ ] Documentation: [list relevant docs]

---

### Steps

```bash
# Step 1: [Description]
# Example: Enumerate all endpoints with authenticated user
curl -s -o /dev/null -w "%{http_code}" -b cookies_user.txt https://example.com/api/user/profile

# Step 2: [Description]
# Example: Test horizontal privilege escalation
curl -X GET -b cookies_user.txt "https://example.com/api/user/2/profile"

# Step 3: [Description]
# Example: Test vertical privilege escalation
curl -X GET -b cookies_user.txt "https://example.com/api/admin/users"

# Step 4: [Description]
# Example: Test IDOR on object references
curl -X GET -b cookies_user.txt "https://example.com/api/documents/123"
```

---

### Expected Result

[What success looks like. What the tester should see when the control is working properly.]

Example: 403 Forbidden or proper access control enforcement

---

### Evidence to Capture

- [ ] HTTP response codes for each request
- [ ] Request/response bodies
- [ ] Screenshots of access denied/success
- [ ] Test commands log
- [ ] Any data returned that should not have been

---

### Success Criteria

| Criterion | Pass | Fail |
|-----------|------|------|
| Access to other user's data blocked | 403/401 returned | 200 + data |
| Admin functions blocked for regular user | 403 returned | 200 + access |
| IDOR on object references | 403/404 returned | 200 + data |

---

### Notes

[Any additional notes, edge cases, or considerations for this test case.]

---

*Template: skills/test-plan/docs/test-case-template.md*
