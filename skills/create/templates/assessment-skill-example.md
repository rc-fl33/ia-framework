# Assessment Skill Example

**Template output for assessment/testing-oriented skills.**

---

## Example: Security Testing Skill

### Skill Type
Security Testing & Assessment

### Phase Pattern
EXPLORE → PLAN → CODE → QA → COMMIT

---

## Directory Structure

```
skills/pentest/
├── SKILL.md                      # Skill definition
├── README.md                     # User documentation
├── STATUS.md                     # Implementation status
├── VERIFY.md                     # Validation checklist
├── commands/
│   ├── pentest.md                # /pentest command
│   ├── vuln-scan.md              # /vuln-scan command
│   └── seg-test.md      # /seg-test command
├── workflows/
│   ├── pentest-init.md           # Pentest workflow
│   ├── vuln-scan.md              # Scanning workflow
│   └── seg-test.md      # Segmentation workflow
├── methodologies/
│   ├── network/                  # Network security
│   ├── web-api/                  # Web/API security
│   ├── mobile/                   # Mobile security
│   ├── web3/                     # Smart contract security
│   ├── ai-llm/                   # AI/LLM security
│   ├── cloud/                    # Cloud security
│   └── ad/                       # Active Directory
├── docs/
│   ├── scope-compliance-guide.md
│   ├── domain-detection-guide.md
│   └── ethical-boundaries.md
├── templates/
│   ├── finding-template.md       # Vulnerability documentation
│   ├── test-plan-template.md    # Phase 2 PLAN output
│   ├── pentest-report-template.md
│   └── remediation-tracker-template.md
├── scripts/
│   ├── hackerone/                # HackerOne API
│   └── pentest/                  # Testing utilities
├── infrastructure/               # OVHcloud VPS management
│   ├── README.md
│   └── hardening/
├── input/
│   ├── .gitkeep
│   └── SCOPE.md                  # Engagement scope (user provides)
└── output/
    └── .gitkeep
```

---

## Characteristics

**Assessment skills typically:**
- Require explicit scope/authorization
- Have approval gates (PLAN phase)
- Use specialized methodologies/ directory
- Produce structured findings
- Need infrastructure/ for tooling
- Heavy emphasis on documentation (docs/)
- Multiple deliverable formats (templates/)

---

## Phase Breakdown

### Phase 1: EXPLORE (Reconnaissance)
- Parse SCOPE.md for authorization
- Attack surface mapping
- Methodology selection
- Passive OSINT
- **Gate:** "Do I understand the attack surface?"

### Phase 2: PLAN (Test Plan - REQUIRES APPROVAL)
- Generate scope-driven test plan
- Map test cases to methodology
- Tool assignment
- Risk assessment
- **Gate:** "Is test plan approved by user?"

### Phase 3: CODE (Test Execution)
- Execute approved test cases
- Document findings immediately
- Collect evidence (screenshots, logs)
- Scope verification per test
- **Gate:** "Are all test cases executed?"

### Phase 4: QA (Findings Validation)
- Validate findings completeness
- Verify CVSS scores and CWE mapping
- Check evidence sufficiency
- Eliminate false positives
- **Gate:** "Are all findings validated?"

### Phase 5: COMMIT (Deliverable)
- **Close-Loop Toggle:**
  - A) Own infrastructure → Remediation tracker + fixes
  - B) External program → Bug bounty submission
- **Gate:** "Is deliverable complete?"

---

## Example Input File

**File:** `private/input/pentest/SCOPE.md`

```markdown
# Penetration Test Scope - Example Corp Web App

## Authorization

**Client:** Example Corp
**Authorized By:** John Doe, CISO
**Date:** 2026-01-15
**Duration:** 2026-01-19 to 2026-01-26
**Authorized Tester:** [Your Name]

## In-Scope

**Web Application:**
- https://app.example.com/*
- https://api.example.com/v1/*
- https://staging.example.com/* (staging only)

**Testing Types:**
- Web application security testing
- API security assessment
- Authentication/authorization testing

## Out-of-Scope

- Production database servers
- Internal network
- Third-party services (Stripe, Auth0)
- Social engineering
- Physical security
- Denial of service

## Constraints

- Testing hours: Business hours only (9am-5pm EST)
- Rate limiting: Max 10 req/sec
- No destructive testing on production
- Report all findings within 24 hours

## Success Criteria

- Comprehensive security assessment
- Documented findings with evidence
- Remediation recommendations
- Executive summary
```

---

## Example Template (Finding)

**File:** `skills/pentest/docs/finding-template.md`

```markdown
# Finding: [Vulnerability Name]

**Finding ID:** VULN-001
**Date:** 2026-01-19
**Severity:** High
**CVSS:** 7.5 (CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N)
**CWE:** CWE-89 (SQL Injection)

---

## Summary

[Brief description of the vulnerability]

---

## Impact

**Confidentiality:** HIGH - Database records exposed
**Integrity:** LOW - No write access achieved
**Availability:** NONE - No DoS capability

**Business Impact:**
- Customer PII exposure
- Potential data breach notification required
- Regulatory compliance risk (GDPR/CCPA)

---

## Affected Components

**URL:** https://app.example.com/api/search
**Parameter:** `query`
**Method:** GET
**Authentication:** None required

---

## Proof of Concept

### Request
```http
GET /api/search?query=test' UNION SELECT username,password,email FROM users-- HTTP/1.1
Host: app.example.com
```

### Response
```json
{
  "results": [
    {"username": "admin", "password": "$2b$12$...", "email": "admin@example.com"},
    ...
  ]
}
```

### Evidence
- Screenshot: `evidence/sqli-poc-001.png`
- Request log: `evidence/sqli-request-001.txt`

---

## Remediation

### Immediate (Priority 1)
1. Implement parameterized queries
2. Remove direct SQL string concatenation
3. Deploy hotfix to production

### Short-term (Within 7 days)
1. Add input validation
2. Implement WAF rules
3. Conduct code review of similar endpoints

### Long-term
1. Security training for developers
2. Static analysis in CI/CD
3. Regular penetration testing

### Code Example
```python
# VULNERABLE
query = f"SELECT * FROM users WHERE name = '{user_input}'"

# SECURE
query = "SELECT * FROM users WHERE name = ?"
cursor.execute(query, (user_input,))
```

---

## References

- OWASP Top 10 2021: A03 Injection
- CWE-89: SQL Injection
- CVSS Calculator: https://...

---

**Reported By:** [Your Name]
**Date Reported:** 2026-01-19
**Status:** Open
```

---

## Example Output (Report)

**File:** `private/output/pentest/pentest-report-example-corp-2026-01-19.md`

```markdown
# Penetration Test Report
## Example Corp Web Application

**Client:** Example Corp
**Date:** 2026-01-19 to 2026-01-26
**Tester:** [Your Name]
**Engagement Type:** Web Application Penetration Test

---

## Executive Summary

A comprehensive security assessment was conducted on Example Corp's web application from January 19-26, 2026. The assessment identified [X] vulnerabilities:

- **Critical:** 1
- **High:** 3
- **Medium:** 5
- **Low:** 8

Key findings include SQL injection vulnerabilities allowing unauthorized data access, authentication bypass issues, and sensitive data exposure.

**Recommendation:** Immediate remediation of critical and high-severity findings is required.

---

## Scope

[Details from SCOPE.md]

---

## Methodology

Testing followed the OWASP Web Security Testing Guide v4.2 with focus on:
- Authentication & Session Management
- Authorization
- Input Validation
- Business Logic

---

## Findings Summary

### VULN-001: SQL Injection in Search API (CRITICAL)
- **CVSS:** 9.1
- **Impact:** Full database access
- **Status:** Open
- [Full details...]

### VULN-002: Authentication Bypass (HIGH)
- **CVSS:** 8.1
- **Impact:** Unauthorized access
- **Status:** Open
- [Full details...]

[... all findings]

---

## Remediation Roadmap

### Immediate (0-7 days)
- VULN-001: SQL injection fix
- VULN-002: Auth bypass patch

### Short-term (7-30 days)
- VULN-003-005: Medium severity fixes

### Long-term (30-90 days)
- Security training program
- SDLC security integration

---

## Conclusion

The assessment revealed several critical security issues requiring immediate attention. With proper remediation, the application's security posture can be significantly improved.

---

**Next Steps:**
1. Review this report with security team
2. Prioritize remediation based on CVSS scores
3. Schedule re-test after fixes deployed

---

**Report Generated:** 2026-01-26
**Tool:** Intelligence Adjacent Framework - Security Skill
```

---

## When to Use This Pattern

✅ Use for:
- Penetration testing
- Vulnerability assessments
- Compliance audits
- Code reviews (security)
- Architecture reviews
- Red team operations

❌ Don't use for:
- Infrastructure automation (use automation pattern)
- Research only (use research pattern)
- Simple scanning (use tools/)

---

**Key Differences from Other Patterns:**

1. **Approval Gate:** PLAN phase MUST be approved before CODE
2. **Scope File:** User provides SCOPE.md in input/
3. **Methodologies:** Domain-specific testing guides
4. **Infrastructure:** Dedicated testing environment
5. **Templates:** Multiple deliverable formats
6. **Ethics:** Strong emphasis on authorization and boundaries

---

**Version:** 1.0
**Last Updated:** 2026-01-19
