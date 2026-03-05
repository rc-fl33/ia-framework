---
domain: test-plan
skill: test-plan
agent: security
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 4: DOCUMENT (Test Plan Assembly)

## IDENTITY

**Agent:** `agents/security.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Assemble the complete test plan document from generated test cases,
add metadata and approval section, and prepare for delivery. This phase produces the
final deliverable document.

**Additional constraints:** Ensure all test cases are included, properly formatted, and
organized. Add necessary metadata and approval sections.

---

## INPUT CONTRACT

**Receives:**
- Scope from Phase 1
- Methodology selection from Phase 2
- Test cases from Phase 3
- Output directory: `private/output/test-plan/{project}-{date}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Phase 2 (ANALYZE) completed
- Phase 3 (GENERATE) completed

**Source:** `skills/test-plan/phases/03-generate.md`

---

## OBJECTIVE

**Goal:** Assemble the complete test plan document, including all test cases,
metadata, domain mapping, and approval section.

**Success criteria:**
- Complete TEST-PLAN.md assembled
- Metadata.json created
- All test cases included and properly organized
- Approval section included

**Failure criteria:**
- No test cases generated → Return to Phase 3
- Assembly incomplete → Continue until document complete

---

## METHODOLOGY

**Phase 4 is about assembly and organization.** Combine all the pieces into a cohesive
test plan document. Structure it for easy reading and execution.

---

## EXECUTION

### Step 1: Read All Input Files

**Tool:** Read

Read all source files:
- scope.md
- methodology-selection.md
- Test cases from test-cases directory

**Expected output:** All source content loaded

### Step 2: Generate TEST-PLAN.md

**Tool:** Write

Write the complete TEST-PLAN.md:

```markdown
# Test Plan - {Project Name}

**Engagement ID:** TP-{YYYY}-{XXX}
**Date:** {YYYY-MM-DD}
**Assessment Type:** {type}
**Status:** Draft / Pending Approval

---

## 1. Plan Metadata

### Scope Summary
- **Project:** {project}
- **Assessment Type:** {pentest/sec-review/code-review/vuln-scan}
- **Domains in Scope:** {list}
- **Total Test Cases:** {count}
- **Estimated Duration:** {X days}

### Targets
{target list}

### Methodology Mapping
| Domain | Framework | Test Cases |
|--------|-----------|------------|
| Web Application | OWASP Top 10 2021 | TC001-TC010 |
| API | OWASP API Security Top 10 | TC011-TC020 |
| Network | MITRE ATT&CK | TC021-TC028 |

---

## 2. Test Case Summary

### By Domain

#### Web Application Testing ({count} test cases)
| ID | Test Case | Framework | Time Est. |
|----|-----------|-----------|-----------|
| TC001 | Broken Access Control | OWASP A01 | 4h |
| TC002 | Cryptographic Failures | OWASP A02 | 2h |
| ... | ... | ... | ... |

#### API Testing ({count} test cases)
| ID | Test Case | Framework | Time Est. |
|----|-----------|-----------|-----------|
| TC011 | Broken Object Level Authorization | OWASP API1 | 3h |
| ... | ... | ... | ... |

[Continue for all domains]

---

## 3. Detailed Test Cases

{Include all test cases from test-cases directory, sorted by ID}

---

## 4. Execution Notes

### Prerequisites
- [ ] Access credentials obtained
- [ ] Scope confirmed with client
- [ ] Testing window scheduled
- [ ] Emergency contacts identified

### Tools Required
- Burp Suite Professional
- nmap
- sqlmap
- nikto
- [Other tools as needed]

### Environment
- [ ] Staging/Development access (if applicable)
- [ ] Production access (if applicable)
- [ ] VPN/Network access configured

---

## 5. Risk and Limitations

### Known Limitations
- [ ] Testing during business hours only
- [ ] No DDoS testing
- [ ] Limited API rate limits

### Risk Mitigation
- Execute non-disruptive tests first
- Coordinate with client for availability
- Stop immediately if issues detected

---

## 6. Approval

### Test Plan Approval

| | |
|---|---|
| **Test Plan Status** | [ ] Approved for Execution |
| **Lead Tester** | _________________________________ |
| **Client Representative** | _________________________________ |
| **Date** | [Date] |

---
```

**Expected output:** TEST-PLAN.md written to output directory

### Step 3: Generate metadata.json

**Tool:** Write

Write metadata.json:

```json
{
  "project": "{project}",
  "date": "{YYYY-MM-DD}",
  "assessmentType": "{type}",
  "engagementId": "TP-{YYYY}-{XXX}",
  "domains": [
    {
      "name": "Web Application",
      "framework": "OWASP Top 10 2021",
      "testCaseCount": 10,
      "testCaseIds": ["TC001", "TC002", "TC003", "TC004", "TC005", "TC006", "TC007", "TC008", "TC009", "TC010"]
    },
    {
      "name": "API",
      "framework": "OWASP API Security Top 10 2023",
      "testCaseCount": 10,
      "testCaseIds": ["TC011", "TC012", "TC013", "TC014", "TC015", "TC016", "TC017", "TC018", "TC019", "TC020"]
    }
  ],
  "totalTestCases": 20,
  "estimatedDuration": "{X days}",
  "status": "draft",
  "generatedBy": "Test Plan Generator",
  "version": "1.0"
}
```

**Expected output:** metadata.json written to output directory

### Step 4: Verify Deliverables

**Tool:** Glob

Verify all required files exist:

```
private/output/test-plan/{project}-{date}/
├── scope.md                    (from Phase 1)
├── methodology-selection.md    (from Phase 2)
├── TEST-PLAN.md                (generated in Phase 4)
├── test-cases/                 (from Phase 3)
│   ├── TC001-{domain}-{test}.md
│   ├── TC002-{domain}-{test}.md
│   └── ...
└── metadata.json                (generated in Phase 4)
```

**Expected output:** All deliverables verified

### Step 5: Generate Branded HTML Report

**Tool:** Bash

Run the bridge script to produce the branded HTML deliverable:

```bash
bun skills/test-plan/scripts/markdown-bridge.ts \
  --output-dir private/output/test-plan/{project}-{YYYY-MM-DD}/
```

Replace `{project}-{YYYY-MM-DD}` with the actual output directory name.

**On success:** `test-plan-report.html` appears in the output directory. Include its path in the deliverables summary presented in Phase 5.
**On failure:** Log the error and continue — markdown deliverables are complete. HTML is additive; do not block Phase 5.

---

## OUTPUT CONTRACT

**Produces:**
- `TEST-PLAN.md` → `private/output/test-plan/{project}-{date}/TEST-PLAN.md`
- `metadata.json` → `private/output/test-plan/{project}-{date}/metadata.json`
- `test-plan-report.html` → `private/output/test-plan/{project}-{date}/test-plan-report.html` (branded HTML, auto-generated)

**Format:** Markdown test plan document, JSON metadata, and branded HTML

---

## NEXT

**On success:** → Proceed to Phase 5 (Deliver):

Load `skills/test-plan/phases/05-deliver.md` with:
- Complete test plan
- Output directory path

**On incomplete assembly:** → Continue until document complete

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] TEST-PLAN.md assembled with all sections
- [ ] All test cases included and properly organized
- [ ] Metadata.json created with accurate counts
- [ ] Approval section included
- [ ] All deliverables verified in output directory
- [ ] Ready to proceed to Phase 5 (DELIVER)

**Error recovery:**
- If test cases missing: Return to Phase 3
- If assembly incomplete: Complete assembly

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
