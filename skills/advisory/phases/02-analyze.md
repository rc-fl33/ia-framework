---
domain: advisory
skill: advisory
agent: advisor
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 2: ANALYZE (Security Analysis)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Perform security analysis appropriate to the advisory mode. For ad-hoc: research best practices and framework guidance. For code-review: scan for vulnerabilities using OWASP Top 10 and CWE Top 25.

**Additional constraints:** Do not generate recommendations in this phase — focus entirely on analysis and findings. All findings must have evidence. For code-review, every finding must include file, line, and code snippet.

---

## INPUT CONTRACT

**Receives:**
- Mode (ad-hoc, code-review) from Phase 1
- Context and scope from Phase 1 output
- Architecture documentation or code location (from Phase 1)
- `research-brief.md` (if generated during Phase 1 Step 2b — optional, non-blocking)
- Output directory: `private/output/advisory/{type}/{project}-{date}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Context and scope documented
- Mode determined
- Research brief available (optional — absence is not a blocker)

**Source:** `skills/advisory/phases/01-intake.md`

---

## OBJECTIVE

**Goal:** Complete security analysis appropriate to the advisory mode, producing documented findings with evidence.

**Success criteria:**
- AD-HOC: Research documented with sources and framework references
- CODE-REVIEW: All in-scope code reviewed, findings documented with CWE classification and severity

**Failure criteria:**
- Missing context prevents analysis → Return to Phase 1
- No findings discovered (unlikely for arch/code review) → Document clean assessment
- Analysis scope too broad → Prioritize critical/high areas first

---

## METHODOLOGY

**Phase 2 is the analytical core.** The quality of recommendations (Phase 3) depends entirely on the thoroughness of analysis here. Take time to be comprehensive.

**For AD-HOC analysis:**
Research the topic using WebSearch for current guidance. Cross-reference with established frameworks (NIST, OWASP, CIS). Compile sources and key findings. Depth depends on effort level — QUICK gets a direct answer with framework refs, STANDARD gets documented research.

**For ARCH-REVIEW requests:** Redirect to `/sec-review` — this is not handled by the advisory skill.

**For CODE-REVIEW analysis:**
Scan systematically. Start with the OWASP Top 10 categories, then CWE Top 25. Focus on input validation, authentication/authorization, cryptography, error handling, and information disclosure. For each finding, capture the exact code location and a code snippet demonstrating the vulnerability.

---

## EXECUTION

### Step 0: Load Research Context

**Tool:** Read

Check if `research-brief.md` exists in the output directory from Phase 1.

```
IF research-brief.md exists in output directory:
  → Load it and use CVE data + best practices to prioritize analysis
  → For CODE-REVIEW: Use language guide patterns + CVE CWE mappings to create
    targeted scan order (most critical patterns first)
  → For AD-HOC: Reference research findings in best-practice recommendations

IF research-brief.md does NOT exist:
  → Proceed with current behavior (no regression)
  → This is normal for QUICK mode or when Phase 1 research was skipped/failed
```

**Expected output:** Research context loaded (if available) to inform analysis priorities
**On failure:** Continue without research context — this step is non-blocking

---

### Step 1: Mode-Specific Analysis

**For AD-HOC Mode:**

**Tool:** WebSearch, WebFetch, Read

1. Research the topic with current best practices
2. Review relevant framework guidance (NIST CSF 2.0, OWASP, CIS Controls)
3. Check for recent advisories, changes, or emerging threats
4. Compile relevant sources with URLs

**Expected output:** Research compiled with framework references
**On failure:** If WebSearch unavailable, use built-in knowledge with framework citations

---

**For CODE-REVIEW Mode:**

**Tool:** Read, Grep, Glob

**Step 1a: Code Reconnaissance**
- Identify all files in scope
- Determine programming languages and frameworks
- Map application structure and entry points

**Step 1b: Vulnerability Scanning**

Systematically check for:

| Category | What to Look For |
|----------|-----------------|
| Injection (CWE-89, CWE-79, CWE-78) | SQL injection, XSS, command injection, unsanitized inputs |
| Authentication (CWE-287, CWE-306) | Weak auth, missing auth, hardcoded credentials |
| Authorization (CWE-862, CWE-863) | Missing access controls, privilege escalation paths |
| Cryptography (CWE-327, CWE-328) | Weak algorithms, improper key management, plaintext storage |
| Error Handling (CWE-209, CWE-200) | Stack traces exposed, information disclosure |
| Input Validation (CWE-20) | Missing validation, improper encoding |
| Configuration (CWE-16) | Debug modes, default credentials, insecure defaults |

**Step 1c: Finding Documentation**

For each vulnerability discovered, document:

```markdown
### Finding [N]: [Title]

**Severity:** Critical | High | Medium | Low
**CWE:** CWE-XXX ([Name])
**OWASP:** [Category if applicable]

**WHAT:** [What is the vulnerability]

**WHERE:**
- File: `path/to/file.ext`
- Line: [line number]
- Code snippet:
```[language]
[vulnerable code]
```

**WHY:** [Why this is vulnerable — explain the risk]
```

**Expected output:** FINDINGS.md with all vulnerabilities documented
**On failure:** If code is inaccessible, return to Phase 1 for correct path

### Step 2: Write Analysis Output & Display Checklist

**Tool:** Write
**Reference:** Output directory from Phase 1

Write mode-appropriate output files:

| Mode | Files Created |
|------|---------------|
| AD-HOC | `research.md` |
| CODE-REVIEW | `FINDINGS.md` |

**Expected output:** Analysis files written to output directory
**On failure:** If write fails, report error and retry

---

## OUTPUT CONTRACT

**Produces (by mode):**

**AD-HOC:**
- `research.md` → written to `private/output/advisory/ad-hoc/{topic}-{date}/research.md`

**CODE-REVIEW:**
- `FINDINGS.md` → written to `private/output/advisory/code-reviews/{project}-{date}/FINDINGS.md`

**Format:** Mode-specific analysis documents with evidence and framework references

---

## NEXT

**On success:** → Proceed to Phase 3 (Recommend):

Load `skills/advisory/phases/03-recommend.md` with:
- Analysis output files from this phase
- Mode and scope from Phase 1
- Output directory path

**On incomplete analysis:** → Loop back to the incomplete analysis step within this phase

**On missing context:** → Return to Phase 1 to gather additional information

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Analysis complete for all in-scope items
- [ ] AD-HOC: Research documented with sources and framework references
- [ ] CODE-REVIEW: All findings documented with CWE classification, severity, and WHAT/WHERE/WHY
- [ ] Analysis files written to output directory
- [ ] Ready to proceed to Phase 3 (RECOMMEND)

**Error recovery:**
- If missing context: Return to Phase 1 for additional information
- If too many findings: Prioritize Critical and High severity first, document Medium/Low in summary
- If unfamiliar architecture: Research similar systems with WebSearch before modeling
- If code is inaccessible: Ask user for correct path or access method

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
