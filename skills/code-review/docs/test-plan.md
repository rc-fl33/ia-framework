# Test Plan - Security Code Review

> **Note:** For a simpler, reusable template, see `templates/test-plan.md`

**Engagement ID:** `CR-YYYY-XXX`
**References:** `scoping-document.md`
**Status:** Draft / Pending Approval
**Last Updated:** YYYY-MM-DD

---

## 1. Plan Metadata

### Scope Summary
- **Repository:** [Repository URL]
- **Branch/Commit:** [Branch name or commit SHA]
- **Languages:** [List of languages]
- **Review Type:** [Full / Incremental / Focused / Delta]
- **KLOC (Estimated):** [Approximate lines of code]

### Focus Areas (from Scoping Document)
| Priority | Focus Area | Files/Paths |
|----------|------------|-------------|
| High | Authentication & Authorization | `src/auth/*`, `src/api/*` |
| High | Input Validation | `src/validation/*`, `src/models/*` |
| Medium | Data Protection | `src/crypto/*`, `src/storage/*` |
| Medium | API Security | `src/routes/*`, `src/controllers/*` |

---

## 2. Analysis Approach

### Static Analysis Tools
```bash
# Bandit - Python security issues
bandit -r ./src -f json -o bandit-report.json

# Semgrep - Multi-language scanning
semgrep --config=auto --json ./src > semgrep-report.json

# npm audit - JavaScript dependencies
npm audit --json > npm-audit.json

# safety - Python dependencies
safety check --json > safety-report.json

# Gosec - Go security issues
gosec -fmt=json ./... > gosec-report.json
```

### Manual Review Checklist
- [ ] Authentication flows
- [ ] Authorization checks
- [ ] Input validation
- [ ] Output encoding
- [ ] Cryptographic implementations
- [ ] Error handling
- [ ] Logging practices
- [ ] Configuration management

---

## 3. Test Case Sections

> **Guidance:** Include sections relevant to the codebase. Use CWE categories to organize findings by vulnerability class.

---

### [CWE Category: Input Validation (CWE-20, CWE-77, CWE-89, CWE-91)]

**Source:** OWASP Proactive Controls, CWE-20

#### Review Item: SQL Injection Prevention
- **Objective:** Verify all database queries use parameterized queries or ORM
- **CWE Mapping:** CWE-89 (SQL Injection)
- **Files to Review:** `src/database/*`, `src/models/*`, `src/repositories/*`
- **Review Commands:**
  ```bash
  # Search for string concatenation in queries
  grep -rn "SELECT.*\+.*request" --include="*.py" src/
  grep -rn "SELECT.*f\"" --include="*.js" src/

  # Verify ORM usage
  grep -rn "query()" --include="*.go" src/
  grep -rn "db.execute" --include="*.py" src/
  ```
- **Expected Result:** No string concatenation in SQL queries, all queries parameterized
- **Evidence:** Code snippets showing vulnerable patterns

#### Review Item: Command Injection Prevention
- **Objective:** Verify user input is not passed to system commands
- **CWE Mapping:** CWE-78 (OS Command Injection)
- **Files to Review:** `src/handlers/*`, `src/services/*`
- **Review Commands:**
  ```bash
  # Search for system calls with user input
  grep -rn "exec(" --include="*.py" src/
  grep -rn "system(" --include="*.c" src/
  grep -rn "child_process" --include="*.js" src/
  grep -rn "os/exec" --include="*.go" src/
  ```
- **Expected Result:** No untrusted input in system commands
- **Evidence:** Code showing dangerous patterns

---

### [CWE Category: Authentication (CWE-287, CWE-259, CWE-307)]

**Source:** CWE-287 Category

#### Review Item: Authentication Implementation
- **Objective:** Verify secure authentication mechanisms
- **CWE Mapping:** CWE-287 (Improper Authentication)
- **Files to Review:** `src/auth/*`, `src/login/*`, `src/middleware/auth*`
- **Review Commands:**
  ```bash
  # Check password handling
  grep -rn "password" --include="*.py" src/ | grep -v "hash"

  # Check for weak hashing
  grep -rn "md5\|sha1" --include="*.py" src/

  # Check session management
  grep -rn "session" --include="*.js" src/
  ```
- **Expected Result:** Strong password hashing (bcrypt, Argon2), proper session handling
- **Evidence:** Code showing secure/implementations

#### Review Item: Credential Storage
- **Objective:** Verify credentials are not hardcoded
- **CWE Mapping:** CWE-259 (Hard-coded Password)
- **Files to Review:** All source files
- **Review Commands:**
  ```bash
  # Search for hardcoded credentials
  grep -rnE "password\s*=\s*['\"]" --include="*.py" src/
  grep -rnE "api[_-]?key\s*=\s*['\"]" --include="*.js" src/
  grep -rnE "secret\s*=\s*['\"]" --include="*.go" src/
  grep -rnE "AWS_ACCESS_KEY_ID\|AWS_SECRET_ACCESS_KEY" src/
  ```
- **Expected Result:** No hardcoded credentials, use environment variables
- **Evidence:** Any found hardcoded values (sanitize in report)

---

### [CWE Category: Data Protection (CWE-311, CWE-316, CWE-359)]

**Source:** CWE-311 Category

#### Review Item: Sensitive Data Exposure
- **Objective:** Verify sensitive data is encrypted in transit and at rest
- **CWE Mapping:** CWE-311 (Missing Encryption of Sensitive Data)
- **Files to Review:** `src/crypto/*`, `src/encryption/*`, `src/models/*`
- **Review Commands:**
  ```bash
  # Check for encryption implementations
  grep -rn "encrypt\|decrypt" --include="*.py" src/

  # Check for proper TLS/SSL
  grep -rn "ssl\|tls" --include="*.py" src/

  # Check for sensitive data in logs
  grep -rnE "password|token|secret|key" --include="*.py" src/logs/
  ```
- **Expected Result:** Sensitive data encrypted, TLS enforced, no secrets in logs
- **Evidence:** Encryption implementation analysis

#### Review Item: Encryption Implementation
- **Objective:** Verify proper cryptographic algorithms and key management
- **CWE Mapping:** CWE-327 (Use of Weak Cryptographic Algorithm)
- **Files to Review:** `src/crypto/*`, `src/auth/jwt*`
- **Review Commands:**
  ```bash
  # Check cryptographic libraries
  grep -rn "from cryptography" --include="*.py" src/

  # Check for weak algorithms
  grep -rnE "DES|MD5|SHA1" --include="*.py" src/ | grep -v "test"
  ```
- **Expected Result:** Strong algorithms (AES-256, RSA-2048+), proper key management
- **Evidence:** Algorithm analysis

---

### [CWE Category: Access Control (CWE-284, CWE-639, CWE-862)]

**Source:** CWE-284 Category

#### Review Item: Broken Access Control
- **Objective:** Verify proper authorization checks on all endpoints
- **CWE Mapping:** CWE-284 (Improper Access Control), CWE-639 (Authorization Bypass)
- **Files to Review:** `src/middleware/*`, `src/routes/*`, `src/controllers/*`
- **Review Commands:**
  ```bash
  # Check for missing authorization
  grep -rn "def " --include="*.py" src/views/ | grep -v "@login_required"
  grep -rn "router\." --include="*.go" src/ | grep -v "Auth"

  # Check for IDOR patterns
  grep -rn "user_id\|object_id" --include="*.py" src/
  ```
- **Expected Result:** Authorization middleware on all protected endpoints
- **Evidence:** Code showing authorization patterns or missing checks

---

### [CWE Category: Error Handling (CWE-388, CWE-755, CWE-756)]

**Source:** CWE-755 Category

#### Review Item: Improper Error Handling
- **Objective:** Verify errors don't leak sensitive information
- **CWE Mapping:** CWE-755 (Improper Handling of Exceptional Conditions)
- **Files to Review:** `src/error/*`, `src/handlers/error*`, main entry points
- **Review Commands:**
  ```bash
  # Check for stack trace exposure
  grep -rn "traceback\|stack.*trace" --include="*.py" src/

  # Check exception handling
  grep -rn "except:" --include="*.py" src/
  ```
- **Expected Result:** Generic error messages to users, detailed logs server-side
- **Evidence:** Error message analysis

---

### [CWE Category: Cryptographic Issues (CWE-327, CWE-329, CWE-331)]

**Source:** CWE-327 Category

#### Review Item: Random Number Generation
- **Objective:** Verify cryptographically secure random number generation
- **CWE Mapping:** CWE-331 (Insufficient Entropy)
- **Files to Review:** `src/auth/*`, `src/sessions/*`, any token generation
- **Review Commands:**
  ```bash
  # Check for weak random
  grep -rn "random\." --include="*.py" src/
  grep -rn "Math.random" --include="*.js" src/

  # Verify secure alternatives
  grep -rn "secrets\|os.urandom" --include="*.py" src/
  grep -rn "crypto.random" --include="*.js" src/
  ```
- **Expected Result:** Cryptographically secure RNG (secrets, crypto.getRandomValues)
- **Evidence:** Random number generation analysis

---

### [CWE Category: File Operations (CWE-22, CWE-73, CWE-378)]

**Source:** CWE-22 Category

#### Review Item: Path Traversal Prevention
- **Objective:** Verify file access is validated and restricted
- **CWE Mapping:** CWE-22 (Improper Limitation of a Pathname)
- **Files to Review:** `src/upload/*`, `src/files/*`, `src/api/download*`
- **Review Commands:**
  ```bash
  # Check file operations
  grep -rn "open(" --include="*.py" src/
  grep -rn "readFile" --include="*.js" src/

  # Check for path traversal
  grep -rnE "\.\./\|\%2e\%2e" --include="*.py" src/
  ```
- **Expected Result:** Path validation, no user input in file paths
- **Evidence:** File operation analysis

---

## 4. Custom Rules (Engagement-Specific)

> **Guidance:** Add custom rules based on application-specific logic, known vulnerability patterns, or client threat intelligence

### Custom Rule: [Rule Name]
- **Objective:** [Description]
- **Pattern:**
  ```bash
  grep -rn "[pattern]" --include="*.[ext]" src/
  ```
- **Expected Result:** [What secure code should look like]
- **Evidence:** Findings from custom rules

---

## 5. Automated Tool Results Summary

### Tool: [Tool Name]
| Issue | Severity | File | Line |
|-------|----------|------|------|
| [Issue 1] | High | src/auth.py | 42 |
| [Issue 2] | Medium | src/utils.py | 15 |

---

## 6. Approval

### Test Plan Approval

| | |
|---|---|
| **Test Plan Status** | [ ] Approved for Execution |
| **Lead Reviewer** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---

*Template: skills/code-review/docs/test-plan.md*
*This document is dynamically assembled based on scoping document review focus areas*
