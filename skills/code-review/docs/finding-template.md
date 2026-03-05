### Finding 1: [Vulnerability Title]

> **Summary:** [Single sentence — what the vulnerability is and its direct impact.]

**Severity:** Critical | High | Medium | Low
**Priority:** P0 | P1 | P2 | P3
**CWE:** CWE-XXX ([Name])
**OWASP:** [Category — e.g. A03:2021 – Injection]
**Confidence:** HIGH | MEDIUM | LOW
**Source:** PATTERN | DATA-FLOW | COMPONENT | LOGIC

---

**Description**
[Clear description of the vulnerability. What is broken, why it's exploitable, and how it
manifests. Be specific — reference the code pattern, the missing validation, or the flawed
assumption that allows exploitation.]

**Location:**
- File: `path/to/vulnerable/file.ts`
- Lines: 42–58
- Code snippet:
```typescript
// Vulnerable code — paste the actual offending lines
```

![Proof of Concept](screenshots/poc.png)

**Impact**
[Impact and exploitability. What can an attacker achieve? What data or systems are at risk?
How realistic is exploitation given the deployment context?]

---

**Remediation:**
Immediate workaround (if applicable):
[What can be done right now to reduce risk without a code change — e.g., WAF rule, config flag,
feature toggle, rate limit. Include exact steps.]

Recommended fix:
```typescript
// BEFORE (vulnerable)
[actual vulnerable code]

// AFTER (fixed)
[correct secure implementation]
```

Verification: Re-run the reproduction steps after the fix — the exploit should be blocked.
Check that legitimate functionality is unaffected.

**STATUS:** Open
**ASSIGNED:**
**TRACKING:**
**DISCOVERED:** YYYY-MM-DD

---

## Evidence

Add screenshots, HTTP requests/responses, logs, and command output below.
File path convention: `screenshots/filename.png` (relative to this finding directory).

![Description of what is shown](screenshots/screenshot-1.png)

```http
[HTTP request/response if applicable]
```

```
[Command output or log excerpt]
```

---

## References

- **CWE:** https://cwe.mitre.org/data/definitions/XXX.html
- **OWASP:** [Relevant OWASP Cheat Sheet or category page]
- **Secure Coding:** [Language/framework-specific security guidance]

---

## Timeline

- **Discovered:** YYYY-MM-DD
- **Reported:** YYYY-MM-DD
- **Remediation Target:** YYYY-MM-DD
- **Verified Remediated:** —

---

*Intelligence Adjacent | Security Code Review*
