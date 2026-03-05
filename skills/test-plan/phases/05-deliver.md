---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: low
chain_position: last
---

# Phase 5: DELIVER (Delivery and Handoff)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Present the completed test plan to the user, highlight critical
test cases, and provide execution guidance. This is the final phase of the workflow.

**Additional constraints:** Focus on clarity and actionability. Ensure the user understands
how to use the test plan.

---

## INPUT CONTRACT

**Receives:**
- Complete test plan from Phase 4
- Output directory: `private/output/test-plan/{project}-{date}/`

**Prerequisites:**
- Phase 4 (DOCUMENT) completed
- All deliverables produced

**Source:** `skills/test-plan/phases/04-document.md`

---

## OBJECTIVE

**Goal:** Present the completed test plan to the user, highlighting key test cases,
critical paths, and execution guidance.

**Success criteria:**
- Test plan presented to user
- Critical test cases highlighted
- Execution guidance provided
- User has everything needed to proceed

**Failure criteria:**
- No test plan available → Return to Phase 4

---

## METHODOLOGY

**Phase 5 is about presentation and handoff.** Make it easy for the user to understand
and use the test plan. Highlight what's important and provide clear next steps.

---

## EXECUTION

### Step 1: Read Test Plan

**Tool:** Read

Read TEST-PLAN.md and metadata.json to understand the complete test plan.

**Expected output:** Test plan content loaded

### Step 2: Present Summary

**Tool:** Direct presentation

Present the test plan summary to the user:

```
================================================================================
TEST PLAN COMPLETE: {Project Name}
================================================================================

Project:        {project}
Date:           {YYYY-MM-DD}
Assessment Type: {type}
Total Test Cases: {count}
Estimated Duration: {X days}

OUTPUT DIRECTORY:
  private/output/test-plan/{project}-{date}/

FILES:
  - TEST-PLAN.md        (Complete test plan document)
  - scope.md            (Scope definition)
  - methodology-selection.md (Framework mapping)
  - metadata.json       (Machine-readable metadata)
  - test-cases/         (Individual test case files)
```

### Step 3: Highlight Critical Test Cases

**Tool:** Direct analysis

Identify and highlight the most critical test cases based on:
- OWASP Top 10 categories (A01, A02, A03 are typically highest priority)
- Access control and authentication tests
- Injection and command execution tests

Present critical test cases:

```
CRITICAL TEST CASES:
==================

1. TC001-WEB-BAC  | Broken Access Control    | OWASP A01 | 4h
   - Tests for IDOR and privilege escalation
   - HIGH PRIORITY

2. TC003-WEB-INJ  | Injection                 | OWASP A03 | 6h
   - SQL, NoSQL, command injection testing
   - HIGH PRIORITY

3. TC011-API-BOLA | BOLA                     | OWASP API1 | 3h
   - Object-level authorization testing
   - HIGH PRIORITY
```

### Step 4: Provide Execution Guidance

**Tool:** Direct presentation

Provide guidance on how to execute the test plan:

```
EXECUTION GUIDANCE:
==================

1. Review TEST-PLAN.md in detail before starting

2. Test Case Execution Order:
   - Start with non-disruptive tests (information gathering)
   - Proceed to authentication/authorization tests
   - Execute injection tests with client approval
   - End with denial of service tests (if scope allows)

3. Prerequisites:
   - Confirm access credentials with client
   - Verify testing window availability
   - Ensure emergency contacts are known

4. Tools to Prepare:
   - Burp Suite Professional
   - nmap, netcat
   - sqlmap
   - custom scripts (per test case)

5. Evidence Collection:
   - Screenshot each test result
   - Log all HTTP requests/responses
   - Document any findings immediately
```

### Step 5: Offer Next Steps

**Tool:** Direct presentation

Offer options for next steps:

```
NEXT STEPS:
==========

Option 1: Execute Test Plan
  → Use /pentest with the generated test plan as input
  → Test cases will guide the assessment

Option 2: Modify Scope
  → Return to Phase 1 to adjust scope
  → Regenerate test cases

Option 3: Add Custom Test Cases
  → Add specific tests to test-cases directory
  → Regenerate TEST-PLAN.md

Option 4: Complete
  → Test plan is ready for execution
  → Save for future use
```

---

## OUTPUT CONTRACT

**Produces:**
- Test plan summary presented to user
- Critical test cases highlighted
- Execution guidance provided

---

## NEXT

**On completion:** → Workflow finished. User has complete test plan.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Test plan summary presented
- [ ] Critical test cases highlighted
- [ ] Execution guidance provided
- [ ] Next steps offered

**Workflow complete.**

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
