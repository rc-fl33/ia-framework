---
domain: code-review
skill: code-review
agent: developer
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: INTAKE (Context and Scope)

## IDENTITY

**Agent:** `agents/developer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather context, classify effort, and define scope for the code-review engagement. This phase sets the foundation for all subsequent analysis.

**Additional constraints:** Do not begin analysis in this phase. Focus entirely on understanding the request, gathering inputs, and documenting scope. If context is insufficient, ask the user — do not assume.

---

## INPUT CONTRACT

**Receives:**
- User request (code path)
- Company name and/or URL (optional — triggers company context research in Step 2b)
- Output directory path: `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Prerequisites:**
- User has invoked `/code-review`
- Code reference available (directory path, file list)

**Source:** `skills/code-review/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Gather sufficient context to execute the code-review engagement and document scope.

**Success criteria:**
- Effort classified (STANDARD, THOROUGH)
- Context gathered (code location, language, framework)
- Scope documented with in-scope and out-of-scope items
- Output directory created

**Failure criteria:**
- User provides no code path and declines to clarify → STOP
- Architecture review requested → Redirect to `/sec-review`

---

## METHODOLOGY

**Phase 1 is about understanding, not analyzing.** Resist the urge to start the analysis here. A well-scoped engagement produces better results than a poorly-scoped comprehensive one.

**Effort classification:**
- STANDARD: Standard code review with OWASP Top 10 coverage
- THOROUGH: Full code review with comprehensive coverage, all vulnerability categories

**Context depth for code-review:** Need code location, language, scope, and focus areas.

---

## EXECUTION

### Step 1: Classify Effort

**Tool:** Direct analysis

| Trigger | Effort |
|---------|--------|
| `/code-review` + small scope (few files) | STANDARD |
| `/code-review` + full project scope | THOROUGH |
| "architecture review", "threat model" | Redirect to `/sec-review` |

**Expected output:** Effort level identified
**On failure:** Ask user for clarification on scope

### Step 2: Gather Context

**Tool:** Read (for code), direct conversation (for questions)

- Code location (directory path, specific files)
- Programming language(s)
- Review depth (standard, deep)
- Focus areas (OWASP Top 10, input validation, auth, crypto, error handling)

**Analysis Anchors** (optional but highly valuable — used to sharpen Pass 3 semantic analysis):

IF code path provided, auto-detect from code:
- **Primary user-controlled inputs** — entry points that accept external data (HTTP parameters,
  form fields, file uploads, webhooks, message queue consumers, CLI arguments, request headers)
- **Sensitive operations** — highest-business-risk actions (auth flows, payment processing, admin
  actions, data deletion, privilege changes, object ownership transfers)

IF code path NOT provided, ask the user one question covering both anchors:
> "What inputs does a user send to this system, and which operations carry the highest business risk (e.g., auth, payments, admin actions)?"

Document answers in `scope.md` under `## Analysis Anchors` (see Step 3).

**Expected output:** Context sufficient for analysis
**On failure:** Ask user for missing information using specific questions

### Step 2b: Automated Research
**Applies:** All engagements | **Effort:** STANDARD+ | **Blocking:** No

**Tool:** WebSearch, Bash (NVD client), Read

This step automatically gathers security intelligence based on detected technologies before proceeding. All research is **non-blocking** — if NVD times out or WebSearch fails, log a note and continue to Step 3.

---

**Company Context (if company name or URL provided):**

If the user provides a company name, website URL, or both — run this before framework-specific research:

1. IF URL provided:
   - WebFetch the URL → extract technology signals from response headers (`X-Powered-By`, `Server`), page source (framework fingerprints, CDN references, meta tags)
2. WebSearch: `"{company name} technology stack"` → StackShare, engineering blogs, job postings
3. WebSearch: `"{company name} security breach OR CVE OR incident"` → relevant history
4. Merge discovered technologies into the technology list for framework-specific research below
5. Note any security incidents in the research brief for analyst context

---

**Code-Review Research:**

1. IF code path provided:
   - Run language detection:
     ```bash
     bun run skills/advisory/scripts/detect-language.ts {path} --json
     ```
   - Load language guide: `skills/advisory/docs/languages/{lang}/patterns.yaml`
   - Load checklist: `skills/advisory/docs/languages/{lang}/checklist.yaml`
2. NVD lookup for detected framework(s):
   ```bash
   bun run tools/nvd/client.ts searchCVEsByKeyword "{framework}" --startDate "2023-01-01" --limit 10
   ```
3. Generate targeted scan checklist from CVE CWE categories
4. Write `research-brief.md` to output directory (format below)
5. Proceed with specific focus areas instead of generic questions

---

**Fallback behavior (CRITICAL):**
- All research is NON-BLOCKING. If NVD times out or WebSearch fails, log a note and continue.
- If no technologies detected, ask user (1 question) instead of generic questions.

**Research brief output format** (written to output directory as `research-brief.md`):

```markdown
# Research Brief
**Generated:** YYYY-MM-DD
**Technologies:** [list]
**CVEs Found:** [count by severity]
**Sources Consulted:** [count]

## Per-Technology Summary

### {Technology}
- **CVEs:**
  | ID | Severity | Description |
  |----|----------|-------------|
  | CVE-XXXX-XXXXX | HIGH | [description] |

- **Best Practices:** [key findings with sources]
- **Targeted Questions:** [questions derived from research]
```

**Expected output:** `research-brief.md` written, research context available for follow-up questions
**On failure:** Log note about unavailable research, continue to Step 3 without research context

### Step 3: Define Scope

**Tool:** Write
**Reference:** Output directory `private/output/code-review/{project}-{YYYY-MM-DD}/`

Create output directory and document scope:

```markdown
## Code Review Scope

**Date:** YYYY-MM-DD
**Effort:** [STANDARD | THOROUGH]

### Context
[Describe the code/project being reviewed]

### Scope
- In scope: [what will be reviewed]
- Out of scope: [what will NOT be reviewed]

### Requirements
- [Requirement 1]
- [Requirement 2]

### Compliance (if applicable)
- [Framework 1]
- [Framework 2]

## Analysis Anchors

**User-Controlled Inputs:**
- [Entry point 1 — e.g., POST /login (username, password)]
- [Entry point 2 — e.g., file upload endpoint]
- [Auto-detected or user-provided]

**Sensitive Operations:**
- [Operation 1 — e.g., password reset flow]
- [Operation 2 — e.g., admin privilege assignment]
- [Auto-detected or user-provided]
```

**Expected output:** scope.md written to output directory
**On failure:** If scope cannot be defined, ask user for clarification

### Step 4: Verify Readiness & Display Final Checklist

**Tool:** Direct analysis

Confirm all prerequisites for Phase 2 are met:
- Context is sufficient
- Scope is documented
- Output directory exists

**Expected output:** Readiness confirmed, completion checklist displayed to user
**On failure:** Loop back to the specific step that is incomplete

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → written to `private/output/code-review/{project}-{YYYY-MM-DD}/scope.md`
  (includes `## Analysis Anchors` section with user-controlled inputs and sensitive operations)
- `research-brief.md` → written to `private/output/code-review/{project}-{YYYY-MM-DD}/research-brief.md` (non-blocking)
- `DATA-FLOW.md` → sourced from anchors gathered here; written by Phase 2 Pass 3a
- Output directory created at `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Format:** Markdown scope document with context, scope boundaries, and requirements; research brief with per-technology CVE data and best practices

---

## NEXT

**On success:** → Proceed to Phase 2 (Analyze):

Load `skills/code-review/phases/02-analyze.md` with:
- Context gathered in this phase
- Output directory path

**On failure (missing context):** → Ask user for missing information, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Effort classified (STANDARD, THOROUGH)
- [ ] Context gathered (code location, language, framework)
- [ ] Automated research completed or skipped (failures are non-blocking)
- [ ] Analysis Anchors documented in scope.md (auto-detected or user-provided; omission noted)
- [ ] Scope documented
- [ ] Output directory created
- [ ] Ready to proceed to Phase 2 (ANALYZE)

**Error recovery:**
- If architecture review requested: Redirect to `/sec-review`
- If context insufficient: Ask for code location and language
- If user provides no context: STOP with guidance on what is needed

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
