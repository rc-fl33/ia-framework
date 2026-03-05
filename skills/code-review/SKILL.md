---
name: code-review
description: Security-focused code review with 4-pass analysis — structural recon, OWASP/CWE/API pattern scanning, semantic data flow tracing, and self-verification with confidence ratings.
agent: developer
classification: public
version: 1.0
last_updated: 2026-02-17
---

# Code Review Skill

**Security-focused code review with 4-pass analysis: structural recon, OWASP/CWE/API pattern scanning, semantic data flow tracing, and self-verification with confidence ratings.**

---

## IDENTITY

You are the code review orchestrator. Route /code-review requests to the developer agent
for the 5-phase advisory workflow with CODE-REVIEW mode.

---

## INPUT CONTRACT

- User request for security-focused code review
- Optional: code path, language, framework, company/URL, compliance requirements

---

## OBJECTIVE

Execute CODE-REVIEW mode through the 5-phase code-review workflow:

1. INTAKE — Code path, language detection, automated CVE research via NVD, analysis anchors
2. ANALYZE — 4-pass analysis: structural recon → OWASP/CWE/API Top 10 patterns → semantic data
   flow tracing + component interactions + open-ended logic → self-verification with confidence
3. RECOMMEND — P0-P3 prioritized remediation with code examples
4. DOCUMENT — Professional findings report with REMEDIATION-GUIDE
5. DELIVER — Present findings, suggest /vuln-scan or /pentest follow-up

---

## EXECUTION

Load: `skills/code-review/phases/00-workflow.md`

The phases directory lives in `skills/code-review/phases/` (standalone). Architecture reviews
use `skills/sec-review/phases/` (also standalone).

**Code-review-specific tools (tools/code-review/):**
- `poc-generator.ts` — Generate PoC from vulnerability findings
- `coverage-analyzer.ts` — Analyze finding coverage against OWASP/CWE frameworks
- `standard-selector.ts` — Select applicable security standards for project context

---

## OUTPUT CONTRACT

Output directory: `private/output/code-review/{project}-{YYYY-MM-DD}/`

```
{project}-{YYYY-MM-DD}/
├── research-brief.md
├── EXECUTIVE-SUMMARY.md
├── REVIEW-SUMMARY.md
├── FINDINGS.md
├── DATA-FLOW.md
├── REMEDIATION-GUIDE.md
├── FULL-REPORT.md
└── metadata.json
```

---

## NEXT

On invocation: Load `skills/code-review/phases/00-workflow.md`

---

## File Management

**What belongs in `skills/code-review/docs/`:**
- How-to guides for using this skill
- API or integration reference documentation
- Command reference and workflow explanations
- Troubleshooting guides
- Setup and configuration guides

**What does NOT belong here:**
- Audit reports or assessment logs → delete (commit messages capture purpose)
- Bug fix notes → delete (git blame shows what changed and why)
- Progress tracking files → update /private/docs/active-tracker.md instead
- Books/PDFs → See `private/docs/book-catalog.md` for discovery
- Engagement output → /private/output/code-review/
- Engagement input → /private/input/code-review/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/code-review/`
- Output data: `/private/output/code-review/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---
---

**Version:** 1.0 | **Last Updated:** 2026-02-17 | **Status:** Active
**Framework:** Intelligence Adjacent (IA)
