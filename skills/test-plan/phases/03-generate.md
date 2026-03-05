---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 3: GENERATE (Test Case Generation)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Generate test cases from selected methodologies and frameworks.
Each test case includes objective, framework mapping, steps, expected result, and evidence.
This is the core output of the test plan skill.

**Additional constraints:** Generate comprehensive test cases based on methodology selection.
Do not duplicate — each test case should be unique and actionable.

---

## INPUT CONTRACT

**Receives:**
- Scope from Phase 1
- Methodology selection from Phase 2
- Output directory: `private/output/test-plan/{project}-{date}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Phase 2 (ANALYZE) completed
- Methodology selection documented

**Source:** `skills/test-plan/phases/02-analyze.md`

---

## OBJECTIVE

**Goal:** Generate detailed test cases for each selected domain, producing actionable
test cases that can be executed during assessment.

**Success criteria:**
- Test cases generated for all selected domains
- Each test case includes: ID, Name, Objective, Framework Mapping, Time Estimate, Steps, Expected Result, Evidence
- Test cases written to individual files in test-cases directory
- Test case count meets minimum thresholds per domain

**Failure criteria:**
- No methodology selection → Return to Phase 2
- Test case generation incomplete → Continue until all domains covered

---

## METHODOLOGY

**Phase 3 is the generation core.** Use the methodology mapping from Phase 2 to generate
specific, actionable test cases. Each test case should be executable and have clear
pass/fail criteria.

**Test case structure follows the template.** Use the test-case-template.md structure
to ensure consistency across all domains.

---

## EXECUTION

### Step 1: Read Methodology Selection

**Tool:** Read

Read `methodology-selection.md` from the output directory to understand:
- Selected domains and their methodologies
- Framework controls to test
- Priority order for test categories
- **Compliance frameworks** (if any) - this is critical!

**Expected output:** Methodology context loaded

### Step 1b: Check Compliance Sources (If Applicable)

**Tool:** Read (if compliance frameworks listed)

If `methodology-selection.md` lists compliance frameworks:

1. **PCI DSS:** Read key sections from `private/books/standards/penetration-testing-guidance-pci-security-standards-council/`
   - Extract: Penetration testing scope, cardholder data environment requirements, Appendix A requirements
   - Map to test cases: Network segmentation, access control, encryption

2. **FedRAMP (WebSearch):** Search for current FedRAMP penetration testing requirements
   - Extract: Control requirements for High/Moderate/Low
   - Map to test cases: Configuration management, access control, audit logging

3. **Other frameworks:** Use WebSearch to find testing requirements

**Priority:** Compliance requirements take precedence over general framework coverage

### Step 2: Create Test Cases Directory

**Tool:** Bash

Create the test-cases directory:
```bash
mkdir -p private/output/test-plan/{project}-{date}/test-cases
```

**Expected output:** test-cases directory created

### Step 3: Generate Test Cases by Domain

**Tool:** Write, Read (reference templates)

For each selected domain, generate test cases following the template structure:

```
#### Test Case: {ID}-{Name}
- **Objective:** [What this test validates]
- **Framework Mapping:** [OWASP, CWE, CIS, MITRE ATT&CK, etc.]
- **Time Estimate:** [X hours]
- **Steps:**
  ```bash
  # [commands or manual steps]
  ```
- **Expected Result:** [What success looks like]
- **Evidence:** [What to capture]
```

**Test case ID format:** TC{NNN}-{DomainAbbrev}-{TestName}
- Domain abbreviations: WEB, API, AND, IOS, NET, AWS, AZR, GCP, LLM, AD, WEB3, THC

**Minimum test cases per domain:**
- Web Application: 10 test cases (OWASP Top 10)
- API: 10 test cases (OWASP API Top 10)
- Mobile: 8 test cases (MASVS categories)
- Network: 8 test cases (MITRE ATT&CK tactics)
- Cloud (per provider): 8 test cases (CIS controls)
- AI/LLM: 6 test cases (LLM Top 10)
- Active Directory: 6 test cases
- Web3: 6 test cases

**For Web Application domain (example):**

```
#### Test Case: TC001-WEB-BAC
- **Objective:** Test for IDOR, privilege escalation, missing function-level access
- **Framework Mapping:** OWASP A01:2021, CWE-284
- **Time Estimate:** 4 hours
- **Steps:**
  ```bash
  # Enumerate all endpoints with authenticated user
  curl -s -o /dev/null -w "%{http_code}" -b cookies_user.txt https://example.com/api/user/profile

  # Test horizontal privilege escalation
  curl -X GET -b cookies_user.txt "https://example.com/api/user/2/profile"

  # Test vertical privilege escalation
  curl -X GET -b cookies_user.txt "https://example.com/api/admin/users"
  ```
- **Expected Result:** 403 Forbidden or proper access control enforcement
- **Evidence:** HTTP response codes, request/response bodies
```

**For API domain (example):**

```
#### Test Case: TC011-API-BOLA
- **Objective:** Test access to objects belonging to other users (BOLA)
- **Framework Mapping:** OWASP API1:2023, CWE-639
- **Time Estimate:** 3 hours
- **Steps:**
  ```bash
  # Enumerate object IDs with User A's token
  for id in {1..100}; do
    curl -s -H "Authorization: Bearer $TOKEN_A" \
      "https://api.example.com/v1/users/$id" | jq -r '.id'
  done

  # Access User B's objects with User A's token
  curl -s -H "Authorization: Bearer $TOKEN_A" \
    "https://api.example.com/v1/users/2/profile"
  ```
- **Expected Result:** Proper authorization checks on all endpoints
- **Evidence:** HTTP responses, data returned
```

### Step 4: Write Test Cases to Files

**Tool:** Write

Write each test case to its own file in the test-cases directory:

```
private/output/test-plan/{project}-{date}/test-cases/
├── TC001-WEB-BAC.md
├── TC002-WEB-CRYPTO.md
├── TC003-WEB-INJECTION.md
├── TC011-API-BOLA.md
├── TC012-API-BROKEN-AUTH.md
└── ...
```

**Each test case file should include:**

```markdown
# Test Case: TC001-WEB-BAC
## Broken Access Control

**Domain:** Web Application
**Framework:** OWASP A01:2021
**CWE:** CWE-284
**Time Estimate:** 4 hours

### Objective
Test for IDOR, privilege escalation, missing function-level access

### Steps
```bash
# Step 1: Enumerate endpoints
curl -s -o /dev/null -w "%{http_code}" -b cookies_user.txt https://example.com/api/user/profile

# Step 2: Test horizontal privilege escalation
curl -X GET -b cookies_user.txt "https://example.com/api/user/2/profile"

# Step 3: Test vertical privilege escalation
curl -X GET -b cookies_user.txt "https://example.com/api/admin/users"

# Step 4: Test IDOR on object references
curl -X GET -b cookies_user.txt "https://example.com/api/documents/123"
```

### Expected Result
403 Forbidden or proper access control enforcement

### Evidence to Capture
- HTTP response codes
- Request/response bodies
- Screenshots of successful/denied access
```

**Expected output:** Individual test case files written

### Step 5: Verify Test Case Coverage

**Tool:** Glob, direct analysis

Check that minimum test case counts are met:

```
ls -la private/output/test-plan/{project}-{date}/test-cases/
```

Count test cases by domain and verify against minimums.

**Expected output:** Coverage verified
**On failure:** Generate additional test cases if below minimum

---

## OUTPUT CONTRACT

**Produces:**
- Test case files → `private/output/test-plan/{project}-{date}/test-cases/TC{NNN}-{domain}-{name}.md`

**Format:** Individual markdown files per test case

---

## NEXT

**On success:** → Proceed to Phase 4 (Document):

Load `skills/test-plan/phases/04-document.md` with:
- Scope from Phase 1
- Test cases from this phase
- Output directory path

**On incomplete generation:** → Continue generating test cases until all domains covered

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Test cases generated for all selected domains
- [ ] Each test case includes: ID, Objective, Framework Mapping, Steps, Expected Result, Evidence
- [ ] Test case files written to test-cases directory
- [ ] Minimum test case counts met per domain
- [ ] Ready to proceed to Phase 4 (DOCUMENT)

**Error recovery:**
- If methodology unclear: Return to Phase 2
- If test case incomplete: Regenerate with full structure

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
