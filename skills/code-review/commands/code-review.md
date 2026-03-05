---
name: code-review
description: Security-focused code review with OWASP/CWE vulnerability detection
domain: code-review
skill: code-review
agent: developer
model: sonnet
complexity: high
mode: single-agent
chain_position: first
---

# /code-review — Security Code Review

## IDENTITY

**Agent:** Base Claude (orchestrator — delegates to developer agent)

**Role:** Code review command router. Validate that the user wants a security-focused code review, then delegate to the developer agent for the full 5-phase advisory workflow in code-review mode.

**Note:** This command routes to `skills/code-review/phases/00-workflow.md`. Code reviews use the full THOROUGH workflow for comprehensive coverage.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/code-review`

**Required:**
- Code path — directory, specific files, or repository location
  - Example: `/path/to/project/src/`
  - Example: `/path/to/file.py`
  - Agent will ask for this if not provided

**Recommended (improves scan accuracy):**
- Programming language — if known (auto-detected via `detect-language.ts` if not provided)
- Framework — Django, Express, Spring Boot, etc. (auto-detected when possible)
- Company name — triggers automated company context research (tech stack, known vulnerabilities)
- Company URL — enables technology fingerprinting

**Optional:**
- Review depth — quick (high-severity only), standard (OWASP Top 10), deep (all patterns)
- Focus areas — specific vulnerability classes (injection, auth, crypto, etc.)
- Compliance requirements — if code must meet specific standards (PCI-DSS, HIPAA)

**Prerequisites:**
- User has invoked `/code-review`
- Code accessible at the provided path (agent verifies during intake)

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route user's code security review request to the developer agent for the full advisory workflow in code-review mode.

**Success criteria:**
- Code review request confirmed
- Developer agent delegated with code-review mode
- Workflow loaded from `skills/code-review/phases/00-workflow.md`

**Failure criteria:**
- User actually needs architecture review → Redirect to `/sec-review`
- User actually needs quick guidance → Redirect to `/advisory`
- Code not accessible and user declines to provide path → STOP

---

## METHODOLOGY

Code security reviews require systematic analysis. The 5-phase workflow ensures no category is missed: OWASP Top 10, CWE Top 25, input validation, authentication, cryptography, error handling, and configuration.

The finding format is critical — every vulnerability must have WHAT (the issue), WHERE (file and line), and WHY (the risk). This enables developers to find and fix issues efficiently.

---

## EXECUTION

### Step 1: Confirm Intent

**Tool:** Direct analysis

Verify the user wants a security-focused code review (not architecture review or quick guidance).

**Expected output:** Intent confirmed as code security review
**On failure:** Redirect to appropriate command (`/sec-review`, `/advisory`)

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/code-review/*`

Check if output directory already exists for this project.

**Expected output:** Fresh start or resume decision
**On failure:** Default to fresh start

### Step 3: Delegate to Developer Agent

**Tool:** Task delegation

```typescript
Task(subagent_type="developer", prompt="Execute code-review skill.\n\nProject: {project}\n\nLoad skills/code-review/phases/00-workflow.md\n\nOutput: private/output/code-review/{project}-{YYYY-MM-DD}/")
```

**Expected output:** Developer agent begins workflow
**On failure:** If delegation fails, load workflow directly

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to developer agent (no files created by command itself)
- Output directory will be created at: `private/output/code-review/{project}-{YYYY-MM-DD}/`

**Final output (after workflow completes):**
```
private/output/code-review/{project}-{YYYY-MM-DD}/
├── research-brief.md           # Automated research (Phase 1 Step 2b)
├── EXECUTIVE-SUMMARY.md
├── REVIEW-SUMMARY.md
├── FINDINGS.md
├── REMEDIATION-GUIDE.md
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

**On success:** → Delegate to developer agent with code-review mode. Workflow handles all phases.

**On existing work found:** → Ask user if resuming or starting fresh. Load `skills/code-review/phases/00-workflow.md` accordingly.

**On failure:** → STOP. Guide user on what code to provide (directory path, files, or repository).

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] User intent confirmed as code security review
- [ ] Existing work check completed
- [ ] Developer agent delegated (or workflow loaded directly)
- [ ] Mode set to code-review

**Error recovery:**
- If user needs architecture review instead: Redirect to `/sec-review`
- If code not accessible: Ask user to provide directory path, file list, or repository
- If delegation fails: Load `skills/code-review/phases/00-workflow.md` directly

---

## Usage

```bash
# Minimal — agent asks for code path during intake
/code-review

# With code path (recommended)
/code-review /path/to/project/src/

# With specific files
/code-review /path/to/auth.py /path/to/api/views.py

# With company context (triggers automated research)
/code-review /path/to/project/, Company: Acme Corp, URL: https://acme.com

# With focus areas
/code-review /path/to/api/ Focus: injection, authentication, HIPAA compliance

# With language hint (usually auto-detected)
/code-review /path/to/project/ Language: Python, Framework: Django
```

**Providing the code path upfront skips the first intake question. Adding company context triggers automated CVE research for your specific stack.**

Detects language → Loads security patterns → Fetches relevant CVEs → Scans for vulnerabilities → Categorizes by severity/CWE → Generates remediation guidance

## When to Use

**Use /code-review when:**
- Identify security vulnerabilities in source code
- Validate secure coding practices (OWASP, CWE)
- Review code before production deployment
- Assess third-party or open-source code security
- Train developers on secure coding patterns
- Pre-audit code for compliance requirements

**Don't use if:**
- Need runtime vulnerability scanning → `/vuln-scan`
- Need architecture-level review → `/sec-review`
- Need dependency vulnerability analysis → `/dependency-audit`
- Need quick security guidance → `/advisory`

## Common Vulnerability Patterns

| Pattern | CWE | OWASP |
|---------|-----|-------|
| SQL Injection | CWE-89 | A03 |
| Cross-Site Scripting (XSS) | CWE-79 | A03 |
| Broken Authentication | CWE-287 | A07 |
| Sensitive Data Exposure | CWE-200 | A02 |
| Insecure Deserialization | CWE-502 | A08 |
| Missing Input Validation | CWE-20 | A03 |

## Related Commands

- `/sec-review` — Architecture-level security review with threat modeling
- `/advisory` — Quick security guidance
- `/vuln-scan` — Runtime vulnerability scanning
- `/pentest` — Active penetration testing

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
