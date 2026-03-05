# Secure Coding Standards Reference

Quick reference for code security reviews.

---

## OWASP Top 10 (2021)

| ID | Name | Description |
|----|------|-------------|
| A01 | Broken Access Control | Missing or improper authorization |
| A02 | Cryptographic Failures | Weak crypto, exposed secrets |
| A03 | Injection | SQL, NoSQL, OS, LDAP injection |
| A04 | Insecure Design | Missing security controls by design |
| A05 | Security Misconfiguration | Default configs, error messages |
| A06 | Vulnerable Components | Outdated dependencies |
| A07 | Auth Failures | Broken authentication/session |
| A08 | Data Integrity Failures | Insecure deserialization, unsigned code |
| A09 | Logging Failures | Missing logs, sensitive data in logs |
| A10 | SSRF | Server-Side Request Forgery |

---

## CWE Top 25 (Key Entries)

| CWE | Name | Category |
|-----|------|----------|
| CWE-79 | Cross-Site Scripting (XSS) | Injection |
| CWE-89 | SQL Injection | Injection |
| CWE-78 | OS Command Injection | Injection |
| CWE-20 | Improper Input Validation | Input |
| CWE-22 | Path Traversal | Input |
| CWE-287 | Improper Authentication | Auth |
| CWE-862 | Missing Authorization | Access |
| CWE-798 | Hardcoded Credentials | Secrets |
| CWE-327 | Broken Crypto Algorithm | Crypto |
| CWE-119 | Buffer Overflow | Memory |
| CWE-200 | Info Exposure | Data |
| CWE-502 | Insecure Deserialization | Data |

---

## Language-Specific Patterns

### JavaScript/TypeScript

| Vulnerability | Pattern | Fix |
|---------------|---------|-----|
| XSS | `innerHTML = userInput` | `textContent` or sanitize |
| Prototype Pollution | `obj[key] = value` | Validate keys |
| Eval Injection | `eval(userInput)` | Never use eval |

### Python

| Vulnerability | Pattern | Fix |
|---------------|---------|-----|
| SQL Injection | `f"SELECT * WHERE {user}"` | Parameterized queries |
| Command Injection | `os.system(user_input)` | subprocess with list |
| Pickle RCE | `pickle.loads(untrusted)` | Use JSON |

### Java

| Vulnerability | Pattern | Fix |
|---------------|---------|-----|
| SQL Injection | `stmt + userInput` | PreparedStatement |
| XXE | `DocumentBuilder.parse()` | Disable external entities |
| Deserialization | `ObjectInputStream.readObject()` | Whitelist classes |

---

## Input Validation Rules

1. **Validate all input** - Never trust user data
2. **Whitelist over blacklist** - Allow known-good, reject rest
3. **Validate on server** - Client-side is bypassable
4. **Encode output** - Context-aware encoding
5. **Use parameterized queries** - Never concatenate SQL

---

## Authentication Best Practices

1. Use established frameworks (don't roll your own)
2. Implement MFA for sensitive operations
3. Use secure password hashing (bcrypt, argon2)
4. Implement account lockout
5. Secure session management
6. Use HTTPS everywhere

---

## Cryptography Rules

| Do | Don't |
|----|-------|
| Use AES-256-GCM | Use DES, 3DES, RC4 |
| Use RSA-2048+ | Use RSA-1024 |
| Use bcrypt/argon2 | Use MD5, SHA1 for passwords |
| Use established libraries | Roll your own crypto |
| Rotate keys regularly | Hardcode keys |

---

## References

- OWASP Top 10: owasp.org/Top10
- CWE Top 25: cwe.mitre.org/top25
- OWASP Cheat Sheets: cheatsheetseries.owasp.org
