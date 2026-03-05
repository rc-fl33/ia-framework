### Finding 1: [Threat or Finding Title]

> **Summary:** [Single sentence — what the threat is, the affected component, and its direct impact.]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**Domain:** A | B | C | E
**STRIDE:** S | T | R | I | D | E (Spoofing / Tampering / Repudiation / Info Disclosure / DoS / Elevation)
**CWE:** CWE-XXX ([Name])
**OWASP:** [Category — e.g. A05:2021 – Security Misconfiguration]
**NIST CSF:** [Function.Category — e.g. PR.AC-4]
**Likelihood:** High | Medium | Low
**Impact:** High | Medium | Low

**Description:**
[Description of the threat or vulnerability. What architectural weakness exists, what trust
boundary is violated, what control is missing. Include the affected component and its role in
the system.]

- **Affected Component:** `[component name — e.g. API Gateway, Auth Service, Database Tier]`
- **Trust Boundary Crossed:** [e.g. Unauthenticated → Authenticated, Public → Internal]

**Impact:**
[Impact and attack scenario. How would an attacker exploit this? What can they achieve?
What data or systems are at risk? Include the realistic threat actor profile.]

Attack scenario:
1. [Attacker action 1]
2. [Attacker action 2]
3. [Attacker achieves: ...]

![Architectural diagram or evidence](screenshots/architecture-evidence.png)

**REMEDIATION:**
Immediate mitigation (if applicable):
[What can be done now to reduce risk — e.g., add network policy, rotate credentials, disable
insecure endpoint, add monitoring alert. Include exact configuration steps.]

Recommended fix:
[Architectural or configuration change required. Include:
- Specific control to implement (authentication, authorization, encryption, logging)
- Technology or framework recommendation
- Implementation approach
- Testing criteria to verify the control is effective]

Reference controls:
- NIST CSF: [specific subcategory]
- CIS Controls: [control number and description]

**STATUS:** Open
**ASSIGNED:**
**TRACKING:**
**DISCOVERED:** YYYY-MM-DD

---

## Evidence

Add architecture diagrams, screenshots, questionnaire responses, or policy document excerpts.
File path convention: `screenshots/filename.png` (relative to this finding directory).

![Architecture or system evidence](screenshots/evidence-1.png)

```
[Configuration snippet, policy excerpt, or questionnaire response supporting this finding]
```

---

## References

- **CWE:** https://cwe.mitre.org/data/definitions/XXX.html
- **OWASP:** [Relevant OWASP resource]
- **NIST SP 800-53:** [Control identifier and name]
- **NIST CSF:** https://www.nist.gov/cyberframework

---

## Timeline

- **Discovered:** YYYY-MM-DD
- **Reported:** YYYY-MM-DD
- **Remediation Target:** YYYY-MM-DD
- **Verified Remediated:** —

---

*Intelligence Adjacent | Security Architecture Review*
