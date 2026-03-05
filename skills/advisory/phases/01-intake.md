---
domain: advisory
skill: advisory
agent: advisor
model: sonnet
mode: single-agent
complexity: medium
chain_position: first
---

# Phase 1: INTAKE (Context and Scope)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Gather context, determine advisory mode (ad-hoc or code-review), classify effort, and define scope for the engagement. This phase sets the foundation for all subsequent analysis.

**Additional constraints:** Do not begin analysis in this phase. Focus entirely on understanding the request, gathering inputs, and documenting scope. If context is insufficient, ask the user — do not assume.

---

## INPUT CONTRACT

**Receives:**
- User request (question text or code path)
- Mode indicator from command (`/advisory` = ad-hoc, `/code-review` = code-review)
- Company name and/or URL (optional — triggers company context research in Step 2b)
- Output directory path: `private/output/advisory/{type}/{project}-{date}/`

**Prerequisites:**
- User has invoked an advisory command
- Request content available (question, docs, or code reference)

**Source:** `skills/advisory/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Gather sufficient context to execute the advisory engagement, determine mode and effort, and document scope.

**Success criteria:**
- Mode determined (ad-hoc, code-review)
- Effort classified (QUICK, STANDARD, THOROUGH)
- Context gathered (question details, architecture docs, or code location)
- Scope documented with in-scope and out-of-scope items
- Output directory created

**Failure criteria:**
- User provides no context and declines to clarify → STOP
- Mode cannot be determined from request → Ask user explicitly
- Architecture review requested → Redirect to `/sec-review`

---

## METHODOLOGY

**Phase 1 is about understanding, not analyzing.** Resist the urge to start the analysis here. A well-scoped engagement produces better results than a poorly-scoped comprehensive one.

**Mode detection logic:**
- `/advisory` command or general security question → AD-HOC
- `/code-review` command or "code review", "security analysis of code" → CODE-REVIEW
- "architecture review", "threat model", "design review" → Redirect to `/sec-review`

**Effort classification:**
- QUICK: Single question, direct answer, no documentation needed
- STANDARD: Guidance with research, documented advisory report
- THOROUGH: Full arch/code review, comprehensive report with all deliverables

**Context depth varies by mode.** Ad-hoc needs the question and system context. Code-review needs code location, language, scope, and focus areas. For architecture reviews, redirect to `/sec-review`.

---

## EXECUTION

### Step 1: Determine Mode

**Tool:** Direct analysis

Identify advisory mode from the command used and request content:

| Command/Trigger | Mode | Effort |
|-----------------|------|--------|
| `/advisory` + simple question | AD-HOC | QUICK |
| `/advisory` + complex guidance need | AD-HOC | STANDARD |
| `/code-review` or "code review" | CODE-REVIEW | THOROUGH |
| "architecture review", "threat model" | — | Redirect to `/sec-review` |

**Expected output:** Mode and effort level identified
**On failure:** Ask user: "Are you looking for quick security guidance or a code security review? For architecture reviews, use `/sec-review`."

### Step 2: Gather Context

**Tool:** Read (for docs/code), direct conversation (for questions)

**For AD-HOC:**
- What is the security question or topic?
- What is the system/environment context?
- What frameworks or compliance requirements apply?

**For CODE-REVIEW:**
- Code location (directory path, specific files)
- Programming language(s)
- Review depth (quick scan, standard, deep)
- Focus areas (OWASP Top 10, input validation, auth, crypto, error handling)

**Expected output:** Context sufficient for analysis
**On failure:** Ask user for missing information using specific questions

### Step 2b: Automated Research
**Applies:** All modes | **Effort:** STANDARD+ | **Blocking:** No

**Tool:** WebSearch, Bash (NVD client), Read

**SKIP this step if effort = QUICK.** Proceed directly to Step 3.

This step automatically gathers security intelligence based on detected technologies before asking follow-up questions. All research is **non-blocking** — if NVD times out or WebSearch fails, log a note and continue to Step 3.

---

**Company Context (if company name or URL provided):**

If the user provides a company name, website URL, or both — run this before mode-specific research to seed the technology list:

1. IF URL provided:
   - WebFetch the URL → extract technology signals from response headers (`X-Powered-By`, `Server`), page source (framework fingerprints, CDN references, meta tags)
2. WebSearch: `"{company name} technology stack"` → StackShare, engineering blogs, job postings
3. WebSearch: `"{company name} security breach OR CVE OR incident"` → relevant history
4. Merge discovered technologies into the technology list for mode-specific research below
5. Note any security incidents in the research brief for analyst context

This is a **context enrichment step** — it populates the same technology list that the mode-specific research consumes. If no company info is provided, skip and proceed with mode-specific research as normal.

---

**For AD-HOC:**

1. Parse user question for technology keywords (e.g., "GraphQL", "Redis", "Kubernetes", "JWT")
2. IF technology detected:
   - WebSearch: `"{tech} security best practices 2026"`
   - IF security-related topic: Run NVD lookup:
     ```bash
     bun run tools/nvd/client.ts searchCVEsByKeyword "{tech}" --limit 5 --severity HIGH
     ```
   - Use findings to ask 1-2 **specific** follow-up questions instead of generic ones
     - Example: "I found CVE-XXXX affecting {tech}. What version are you running?"
     - Example: "Recent advisories mention {specific issue}. Is this relevant to your environment?"
3. IF no technology detected: Ask user 1 targeted question: "What technology or system does this apply to?"

---

**For CODE-REVIEW:**

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
- If no technologies detected, ask user (1 question) instead of 5 generic questions.
- QUICK effort mode skips Step 2b entirely.

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

**Expected output:** `research-brief.md` written (STANDARD+ for CODE-REVIEW), research context available for follow-up questions
**On failure:** Log note about unavailable research, continue to Step 3 without research context

### Step 3: Define Scope

**Tool:** Write
**Reference:** Output directory `private/output/advisory/{type}/{project}-{date}/`

Create output directory and document scope:

```markdown
## Advisory Scope

**Mode:** [AD-HOC | ARCH-REVIEW | CODE-REVIEW]
**Date:** YYYY-MM-DD
**Effort:** [QUICK | STANDARD | THOROUGH]

### Context
[Describe the system/code/question]

### Scope
- In scope: [what will be reviewed]
- Out of scope: [what will NOT be reviewed]

### Requirements
- [Requirement 1]
- [Requirement 2]

### Compliance (if applicable)
- [Framework 1]
- [Framework 2]
```

**Expected output:** scope.md written to output directory (CODE-REVIEW only)
**On failure:** If scope cannot be defined, ask user for clarification

### Step 4: Verify Readiness & Display Final Checklist

**Tool:** Direct analysis

Confirm all prerequisites for Phase 2 are met:
- Mode is clear
- Context is sufficient for the selected mode
- Scope is documented (STANDARD+)
- Output directory exists

**Expected output:** Readiness confirmed, completion checklist displayed to user
**On failure:** Loop back to the specific step that is incomplete

---

## OUTPUT CONTRACT

**Produces:**
- `scope.md` → written to `private/output/advisory/{type}/{project}-{date}/scope.md` (CODE-REVIEW only)
- `research-brief.md` → written to `private/output/advisory/{type}/{project}-{date}/research-brief.md` (CODE-REVIEW standard, optional for AD-HOC)
- Output directory created at `private/output/advisory/{type}/{project}-{date}/`

**Format:** Markdown scope document with mode, context, scope boundaries, and requirements; research brief with per-technology CVE data and best practices

---

## NEXT

**On success:** → Proceed to Phase 2 (Analyze):

Load `skills/advisory/phases/02-analyze.md` with:
- Mode (ad-hoc, code-review)
- Context gathered in this phase
- Output directory path

**On failure (missing context):** → Ask user for missing information, retry this phase

**On mode unclear:** → Ask user to specify, do not guess

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Mode determined (ad-hoc, code-review)
- [ ] Effort classified (QUICK, STANDARD, THOROUGH)
- [ ] Context gathered (question, docs, or code reference)
- [ ] Automated research completed or skipped (QUICK skips; failures are non-blocking)
- [ ] Scope documented (STANDARD+ only)
- [ ] Output directory created
- [ ] Ready to proceed to Phase 2 (ANALYZE)

**Error recovery:**
- If mode unclear: Ask user directly — "quick guidance or code review? For architecture reviews, use `/sec-review`."
- If architecture review requested: Redirect to `/sec-review`
- If context insufficient for code-review: Ask for code location and language
- If user provides no context: STOP with guidance on what is needed

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
