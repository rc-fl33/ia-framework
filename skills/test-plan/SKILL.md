---
name: test-plan
description: Skill-agnostic test plan generation for security assessments. Generates detailed
  test plans with test cases from methodologies for pentest, security review, code review, and
  other assessment types.
agent: security
classification: public
version: 1.0
last_updated: 2026-03-01
---

> **SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> This skill uses the `security` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Intake | `security` | Scope gathering, domain selection, project context |
> | 2 - Analyze | `security` | Methodology selection, framework mapping |
> | 3 - Generate | `security` | Test case generation from methodologies |
> | 4 - Document | `security` | Test plan assembly, metadata, approval section |
> | 5 - Deliver | `security` | Presentation, critical test cases, execution guidance |
>
> This is a STANDALONE skill. It can be invoked by pentest, sec-review, code-review, or used independently.

---

# Test Plan Skill

**Skill-agnostic test plan generation for security assessments.**

---

## IDENTITY

You are the test plan orchestrator. Route /test-plan requests to the standalone
5-phase test-plan workflow.

---

## INPUT CONTRACT

- User request for test plan generation
- Scope document or equivalent input (from various sources)
- Optional: assessment type (pentest, sec-review, code-review, vuln-scan)
- Optional: project name, target systems, specific domains

---

## OBJECTIVE

Execute TEST-PLAN through its own 5-phase workflow with assessment domains:

- Web Application Testing (OWASP Top 10, API Security)
- Mobile Testing (Android, iOS - MASVS)
- Network/Infrastructure Testing (MITRE ATT&CK)
- Cloud Security (AWS, Azure, GCP - CIS Benchmarks)
- AI/LLM Testing (OWASP LLM Top 10)
- Active Directory Security
- Web3/Smart Contract Testing
- Thick Client Testing

Phases: 1. INTAKE, 2. ANALYZE, 3. GENERATE, 4. DOCUMENT, 5. DELIVER

---

## EXECUTION

Load: `skills/test-plan/phases/00-workflow.md`

Phases live in `skills/test-plan/phases/` — standalone, not shared with advisory.

---

## OUTPUT CONTRACT

Output directory: `private/output/test-plan/{project}-{YYYY-MM-DD}/`

```
{project}-{date}/
├── scope.md
├── methodology-selection.md
├── TEST-PLAN.md
├── test-cases/
│   ├── TC001-{domain}-{test}.md
│   └── ...
└── metadata.json
```

---

## NEXT

On invocation: Load `skills/test-plan/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/test-plan/docs/`:**
- How-to guides for using this skill
- Integration reference documentation
- Command reference and workflow explanations
- Troubleshooting guides
- Setup and configuration guides

**What does NOT belong here:**
- Assessment logs or session notes → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update /private/docs/active-tracker.md instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → /private/output/test-plan/
- Engagement input → /private/input/test-plan/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/test-plan/`
- Output data: `/private/output/test-plan/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---

**Version:** 1.0 | **Last Updated:** 2026-03-01 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
