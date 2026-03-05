---
domain: code-review
skill: code-review
agent: developer
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 2: ANALYZE (Security Analysis)

## IDENTITY

**Agent:** `agents/developer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Perform security code analysis using a 4-pass methodology: structural
recon, OWASP/CWE/API pattern scanning, semantic data flow and logic analysis, and self-
verification with confidence ratings. Every finding must include file, line, and code snippet.

**Additional constraints:** Do not generate recommendations in this phase — focus entirely on analysis and findings. All findings must have evidence.

---

## INPUT CONTRACT

**Receives:**
- Context and scope from Phase 1 output
- Code location (from Phase 1)
- `research-brief.md` (if generated during Phase 1 Step 2b — optional, non-blocking)
- Output directory: `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Prerequisites:**
- Phase 1 (INTAKE) completed
- Context and scope documented
- Research brief available (optional — absence is not a blocker)

**Source:** `skills/code-review/phases/01-intake.md`

---

## OBJECTIVE

**Goal:** Complete security code analysis producing verified findings with confidence ratings
and a data flow artifact that documents reasoning.

**Success criteria:**
- All in-scope code reviewed through all 4 passes
- All findings documented with CWE classification, severity, confidence rating, and source tag
- DATA-FLOW.md produced from Pass 3a with at least one entry per detected entry point

**Failure criteria:**
- Missing context prevents analysis → Return to Phase 1
- No findings discovered (unlikely for code review) → Document clean assessment
- Analysis scope too broad → Prioritize critical/high areas first

---

## METHODOLOGY

**Phase 2 is the analytical core.** The quality of recommendations (Phase 3) depends entirely
on the thoroughness of analysis here.

Analysis proceeds in four sequential passes. Each pass builds on the previous:

```
Pass 1: Structural Recon    → component map, entry points, trust boundaries
Pass 2: Pattern Analysis    → OWASP / CWE / API Top 10 (targeted at Pass 1 results)
Pass 3: Semantic Analysis   → data flow tracing, component interactions, open-ended logic
Pass 4: Self-Verification   → prove or disprove each finding, assign confidence, discard FPs
```

**Read code like a security researcher, not a linter.** Pattern matching catches textbook
vulnerabilities. The methodology that catches business logic flaws and novel vulnerabilities
requires understanding what the code is supposed to do and what an attacker could make it do.

---

## EXECUTION

### Step 0: Load Research Context

**Tool:** Read

Check if `research-brief.md` exists in the output directory from Phase 1.

```
IF research-brief.md exists in output directory:
  → Load it and use CVE data + best practices to prioritize analysis
  → Use language guide patterns + CVE CWE mappings to create
    targeted scan order (most critical patterns first)

IF research-brief.md does NOT exist:
  → Proceed without research context (no regression)
```

**Expected output:** Research context loaded (if available) to inform analysis priorities
**On failure:** Continue without research context — this step is non-blocking

---

### Step 1: Code Analysis — 4-Pass Methodology

**Tool:** Read, Grep, Glob

---

#### Pass 1: Structural Recon

Build the component map that guides all subsequent passes. Do not flag vulnerabilities yet —
only map structure.

- Enumerate all files and modules in scope (directory scan)
- Identify programming languages and frameworks
- **Map components and layers:** services, modules, middleware, utilities — what calls what
- **Identify all entry points:** HTTP routes, CLI arguments, event handlers, message queue
  consumers, webhook receivers, scheduled jobs — anywhere externally-controlled data enters
- **Identify all sinks:** database queries, shell execution, file writes, HTML output/templates,
  external API calls, deserialization points — anywhere data can cause harm if untrusted
- **Identify trust boundary crossings:** where data moves from unauthenticated to authenticated
  zones, between internal services, or from external to internal systems

**Output:** Internal component map (not written to disk) — entry points, sinks, trust boundaries.
Used to target Passes 2, 3, and 4.

---

#### Pass 2: Pattern Analysis

Run targeted pattern scanning against the entry points and sinks from Pass 1. This is the
existing OWASP/CWE scan, now anchored to known-risky locations rather than a generic file sweep.

Systematically check for:

| Category | What to Look For |
|----------|-----------------|
| Injection (CWE-89, CWE-79, CWE-78) | SQL injection, XSS, command injection, unsanitized inputs at sinks |
| Authentication (CWE-287, CWE-306) | Weak auth, missing auth, hardcoded credentials |
| Authorization (CWE-862, CWE-863) | Missing access controls, privilege escalation paths |
| Cryptography (CWE-327, CWE-328) | Weak algorithms, improper key management, plaintext storage |
| Error Handling (CWE-209, CWE-200) | Stack traces exposed, information disclosure |
| Input Validation (CWE-20) | Missing validation, improper encoding |
| Configuration (CWE-16) | Debug modes, default credentials, insecure defaults |

**OWASP API Top 10** — apply when API indicators detected (route files, OpenAPI/Swagger specs,
REST handlers, GraphQL schemas):

| API Category | What to Look For |
|--------------|-----------------|
| API1 — Broken Object Level Auth | Object IDs in URLs/params without ownership check |
| API2 — Broken Auth | Missing or weak token validation at API endpoints |
| API3 — Broken Object Property Level Auth | Mass assignment, over-exposed response fields |
| API4 — Unrestricted Resource Consumption | No rate limits, unbounded pagination, file size limits |
| API5 — Broken Function Level Auth | Admin routes accessible without role check |
| API6 — Unrestricted Access to Sensitive Business Flows | Abuse of multi-step flows (cart, signup, password reset) |
| API7 — Server Side Request Forgery | User-controlled URLs passed to server-side fetch |
| API8 — Security Misconfiguration | Verbose error responses, missing CORS policy, default creds |
| API9 — Improper Inventory Management | Undocumented or shadow endpoints, deprecated versions |
| API10 — Unsafe Consumption of APIs | Third-party API responses used without validation |

Document Pass 2 findings using the finding template below. No confidence rating yet — that is
applied in Pass 4.

---

#### Pass 3: Semantic Analysis

Three sub-analyses, each reasoning from the Pass 1 component map. This pass finds vulnerabilities
that don't match known patterns.

**3a — Data Flow Tracing:**

For each entry point identified in Pass 1:
- Trace the complete data path: entry → transformations → intermediate state → sinks
- At each step: Is the data validated? Is the validation correct for the sink type?
  Does it cross a trust boundary without re-validation?
- **Flag:** unsanitized data reaching a sink; validation on the wrong side of a trust boundary;
  transformations that strip or mutate sanitization (double-decode, type coercion, string
  normalization)

Write `DATA-FLOW.md` as this sub-analysis progresses:

```markdown
# Data Flow Analysis

## Entry Point Inventory

| Entry Point | Method | Trust Level | Sinks Reachable |
|-------------|--------|-------------|-----------------|
| [route/handler] | [GET/POST/etc] | [unauth/auth/admin] | [list] |

## Transformation Chains

### [Entry Point Name]
- **Input:** [what arrives]
- **Transformations:** [validation steps, sanitization, encoding/decoding, type coercion]
- **Trust Boundary Crossings:** [where data moves between trust zones]
- **Reaches Sink:** [sink type and location]
- **Finding:** [CLEAN | FLAG: reason]

## Trust Assumption Failures

[Where the code implicitly trusts data it should not, or validates in the wrong place]
```

**3b — Component Interaction Analysis:**

For each component boundary (service-to-service, module import, internal API call, message queue):
- What data is passed across the boundary?
- Does the receiver validate or authenticate the caller, or does it implicitly trust it?
- Are privilege levels implied by the call path? Are they enforced?
- **Flag:** missing re-auth at internal API boundaries; privilege escalation via trust chain;
  components that accept data from lower-trust callers without sanitization

**3c — Open-Ended Logic Analysis:**

Unconstrained reasoning — no pattern list, no checklist. Ask these questions:
- What assumptions does this code make that an attacker could violate?
- Can operation ordering be manipulated (state machine violations, TOCTOU)?
- Can authorization checks be bypassed by taking an unexpected code path?
- Are there implicit invariants (e.g., "this value is always positive") that code relies on
  but never enforces?
- Look specifically at: multi-step flows, conditional branches around auth/payment/deletion,
  object references passed between trust contexts, anything that "reads like it could go wrong"

Document all Pass 3 findings using the same finding template, tagged with the sub-analysis.

---

#### Pass 4: Self-Verification

For every finding from Passes 2 and 3:

1. **Re-examine exploitability:** Can this actually be exploited given the deployment context?
   Are there framework-level or middleware-level defenses that neutralize it?
2. **Search for mitigations:** Is there a global middleware, WAF rule, type system constraint,
   or framework feature that already handles this? (e.g., ORM preventing SQLi, template engine
   auto-escaping XSS)
3. **Assign confidence:**
   - **HIGH** — exploitability confirmed independently; no mitigations found
   - **MEDIUM** — likely exploitable but depends on deployment config, framework defaults,
     or assumptions not visible in code
   - **LOW** — possible vulnerability but meaningful countervailing evidence exists; requires
     further investigation
4. **Discard false positives:** If disproved, exclude from FINDINGS.md. Log all discards to a
   `## Verification Notes` section at the bottom of FINDINGS.md for transparency.

---

#### Finding Format (used for all passes)

**Template:** `skills/code-review/docs/finding-template.md`

Each finding is written to its own directory under `findings/`:

```
{output-dir}/
  findings/
    F001-sql-injection/
      finding.md        ← one finding per file, using the template format
      screenshots/      ← evidence for this finding (referenced in finding.md)
        poc.png
```

**Naming:** `F{NNN}-{slug}` — zero-padded 3-digit counter + lowercase hyphenated title
(30 char max slug). Examples: `F001-sql-injection`, `F003-missing-rate-limit`.

**Minimum required fields per finding:**

```markdown
### Finding 1: [Title]

**Severity:** Critical | High | Medium | Low
**CWE:** CWE-XXX ([Name])
**OWASP:** [Category if applicable]
**Confidence:** HIGH | MEDIUM | LOW
**Source:** PATTERN | DATA-FLOW | COMPONENT | LOGIC

**WHAT:**
[What is the vulnerability]

**WHERE:**
- File: `path/to/file.ext`
- Lines: [line numbers]
- Code snippet:
```[language]
[vulnerable code]
```

**WHY:**
[Why this is vulnerable and what an attacker can achieve]

**REMEDIATION:**
[Specific fix — include before/after code where possible]

**STATUS:** Open
**DISCOVERED:** YYYY-MM-DD
```

Add screenshots to `screenshots/` and reference them in the finding with
`![Description](screenshots/filename.png)`.

**Expected output:** Individual finding files in `findings/F*/finding.md`, DATA-FLOW.md from Pass 3a
**On failure:** If code is inaccessible, return to Phase 1 for correct path

### Step 2: Write Analysis Output & Display Checklist

**Tool:** Write
**Reference:** Output directory from Phase 1

Write output files:

| Files Created | Contents |
|---------------|----------|
| `findings/F{NNN}-{slug}/finding.md` | One file per verified finding; complete template with all fields |
| `FINDINGS.md` | Consolidated view — concatenate all finding files in order (for Phase 3 and human readability) |
| `DATA-FLOW.md` | Data flow analysis from Pass 3a; entry point inventory, transformation chains, trust failures |

**FINDINGS.md assembly:** After all individual finding files are written, concatenate them
in order with a `## Verification Notes` section at the end documenting any discarded FPs.

**Expected output:** Analysis files written to output directory
**On failure:** If write fails, report error and retry

---

## OUTPUT CONTRACT

**Produces:**
- `findings/F{NNN}-{slug}/finding.md` → per-finding files in `private/output/code-review/{project}-{YYYY-MM-DD}/findings/`
- `findings/F{NNN}-{slug}/screenshots/` → evidence directory per finding (populated as needed)
- `FINDINGS.md` → consolidated view at `private/output/code-review/{project}-{YYYY-MM-DD}/FINDINGS.md`
  (concatenation of all finding files + `## Verification Notes` section)
- `DATA-FLOW.md` → written to `private/output/code-review/{project}-{YYYY-MM-DD}/DATA-FLOW.md`

**Format:** Code-review analysis documents with evidence, confidence ratings, and data flow reasoning

---

## NEXT

**On success:** → Proceed to Phase 3 (Recommend):

Load `skills/code-review/phases/03-recommend.md` with:
- Analysis output files from this phase
- Scope from Phase 1
- Output directory path

**On incomplete analysis:** → Loop back to the incomplete analysis step within this phase

**On missing context:** → Return to Phase 1 to gather additional information

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All 4 passes completed (structural, pattern, semantic, verification)
- [ ] All findings written to `findings/F{NNN}-{slug}/finding.md` with complete fields
- [ ] Each finding has CWE, severity, WHAT/WHERE/WHY, Confidence, Source
- [ ] DATA-FLOW.md produced with at least one entry per detected entry point
- [ ] FINDINGS.md written as concatenation of all finding files
- [ ] FINDINGS.md includes `## Verification Notes` documenting any discarded false positives
- [ ] Analysis files written to output directory
- [ ] Ready to proceed to Phase 3 (RECOMMEND)

**Error recovery:**
- If missing context: Return to Phase 1 for additional information
- If too many findings: Prioritize Critical and High severity first, document Medium/Low in summary
- If code is inaccessible: Ask user for correct path or access method
- If Pass 1 yields no entry points: Document that finding and proceed — absence of clear entry
  points is itself a structural observation worth noting

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
