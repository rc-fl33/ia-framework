---
name: advisory
description: Ad-hoc security guidance — strategic security advice, quick questions, and contextual framework references
agent: advisor
version: 2.2
classification: public
last_updated: 2026-02-17
effort_default: STANDARD
mode: single-agent
agents: [advisor]
---

> **⛔ SINGLE-AGENT ROUTING - READ THIS FIRST**
>
> **STOP.** This skill uses the `advisor` agent for all phases.
>
> | Phase | Agent | Work Type |
> |-------|-------|-----------|
> | 1 - Intake | `advisor` | Context gathering, mode selection, scope definition |
> | 2 - Analyze | `advisor` | Threat modeling (STRIDE/PASTA), code analysis (OWASP/CWE), research |
> | 3 - Recommend | `advisor` | Prioritized recommendations (P0-P3), framework mapping |
> | 4 - Document | `advisor` | Professional report creation, metadata |
> | 5 - Deliver | `advisor` | Presentation, critical item highlighting, follow-up |
>
> **Identity check:** If you are NOT the advisor agent AND the request is complex
> (architecture review, code review, threat modeling, comprehensive guidance) → DELEGATE NOW.
>
> **DO NOT** proceed without the correct agent → DELEGATE:
>
> ```typescript
> Task(subagent_type="advisor", prompt="Execute advisory skill. Request: {user_request}")
> ```
>
> **Path 1 - Simple (Tier 1/Haiku):** General security questions
> - "What is STRIDE threat modeling?"
> - "How do I secure my API?"
> - Routes directly, no delegation needed
>
> **Path 2 - Complex (Advisor Agent):** Full reviews and assessments
> - "Review my application architecture for security"
> - "Perform a security code review"
> - Requires full 5-phase pipeline

---

# Advisory Skill

**Ad-hoc security guidance with research integration. For architecture reviews use /sec-review; for code reviews use /code-review.**

---

## Chain Map

```
/advisory → (QUICK) → direct response with framework references
          → (STANDARD+) → phases/00-workflow.md → 01→02→03→04→05 → ad-hoc/{topic}-{date}/
```

**Note:** Architecture reviews route to `/sec-review` (skills/sec-review/). Code reviews
route to `/code-review` (skills/code-review/). Code reviews use the shared phases/ pipeline in
this directory.

**All files follow the universal prompt structure:** `docs/guides/universal-prompt-structure.md`

---

## Supporting Documentation

**Read these supporting documents as needed during execution:**

1. **`docs/threat-modeling-guide.md`** - STRIDE, PASTA, Attack Trees reference (if present)
2. **`docs/secure-coding-standards.md`** - OWASP, CWE reference (if present)

---

## Model Tier Routing

This skill uses the three-tier orchestration engine for cost-optimal execution:

**Routing Decision Tree:**
- **Quick security questions and guidance:** Tier 1 (Free) - $0.00
- **Architecture and code reviews with STRIDE/PASTA:** Sonnet (primary)
- **Complex threat modeling and strategic guidance:** Sonnet

**Why Sonnet for advisory?**
- 5-phase workflow (intake, analyze, recommend, document, deliver)
- Deep analysis of architectures and code with framework references (STRIDE, OWASP ASVS, CWE)
- Large context for threat models and security recommendations
- Professional-grade output for stakeholder-facing deliverables

**How it works:**
1. User invokes `/advisory`
2. Base Claude analyzes request complexity
3. Quick questions route to Tier 1 direct response, thorough guidance routes to Sonnet + 5-phase pipeline
4. Phases execute with proper framework references
5. Actionable recommendations delivered in ad-hoc/{topic}-{date}/

---

## Pre-flight Checklist (MANDATORY)

**STOP! Before executing this skill:**

- [ ] Read this SKILL.md completely
- [ ] Verified agent routing (advisor agent active, or delegated)
- [ ] Classified effort level (QUICK/STANDARD/THOROUGH)
- [ ] Confirmed mode is AD-HOC (for security review → /sec-review; for code-review → /code-review)
- [ ] If THOROUGH: Understand the full 5-phase pipeline

---

## USE WHEN

**Use for:** Ad-hoc security questions, quick security guidance, strategic security advice,
framework references (NIST, OWASP, CIS), contextual recommendations without a full review

**Don't use for:**
- Architecture security reviews with threat modeling → `/sec-review`
- Code-level security reviews with CWE classification → `/code-review`
- Active penetration testing → `/pentest`
- Vulnerability scanning → `/vuln-scan`
- Compliance framework assessment → `/compliance`
- Infrastructure hardening → `/harden`

---

## Quick Start

```
/advisory                    # Ad-hoc security guidance
/advisory [question]         # Quick security question
```

**For architecture reviews:** Use `/sec-review` (STRIDE/PASTA threat modeling)
**For code reviews:** Use `/code-review` (OWASP/CWE vulnerability detection)

**Optional inputs:** Provide a company name and/or URL to auto-discover technology stack and
security history during intake.

**Output:** `private/output/advisory/ad-hoc/{topic}-{YYYY-MM-DD}/`

---

## 5-Phase Workflow

```
┌─────────┐     ┌─────────┐     ┌──────────┐     ┌──────────┐     ┌─────────┐
│ INTAKE  │────▶│ ANALYZE │────▶│RECOMMEND │────▶│ DOCUMENT │────▶│ DELIVER │
│         │     │         │     │          │     │          │     │         │
└────┬────┘     └────┬────┘     └────┬─────┘     └────┬─────┘     └────┬────┘
     │               │               │                │               │
     ▼               ▼               ▼                ▼               ▼
  Context &      Threat model    Prioritized      Professional    Present +
  Scope          or findings     recs (P0-P3)     report          follow-up
```

| Phase | Name | Gate Criteria | Output |
|-------|------|---------------|--------|
| 1 | **INTAKE** | Context and scope documented | Mode, scope, requirements, research-brief.md (Step 2b) |
| 2 | **ANALYZE** | Analysis complete | Threat model / findings / research |
| 3 | **RECOMMEND** | Recommendations prioritized and actionable | P0-P3 recommendations with framework refs |
| 4 | **DOCUMENT** | Professional report complete | Full deliverable set + metadata.json |
| 5 | **DELIVER** | User has deliverables and next steps | Summary, critical items, follow-up |

**Phase files:** `phases/01-intake.md` through `phases/05-deliver.md`

---

## Phase 1: INTAKE (Context and Scope)

**Gather context, determine mode, define scope for the advisory engagement.**

### Mode Selection

| Trigger | Mode | Effort | Next Action |
|---------|------|--------|-------------|
| "security question", "advice", "guidance" | AD-HOC | QUICK/STANDARD | Gather question context |
| "architecture review", "threat model" | — | — | Redirect to `/sec-review` |
| "code review", "review this code" | — | — | Redirect to `/code-review` |

### Automated Research (Step 2b)

After gathering initial context, Phase 1 automatically researches detected technologies using NVD and WebSearch before asking follow-up questions. This enables **informed** questions (e.g., "I found CVE-XXXX affecting your stack — what version are you running?") instead of generic ones.

- **Company context:** If company name or URL provided, WebFetch + WebSearch discover the technology stack and security history
- **AD-HOC:** Parses question for technology keywords → WebSearch + NVD (if security-related)
- **QUICK mode:** Skips automated research entirely
- **Non-blocking:** All research failures are logged and skipped — never blocks the workflow

**Phase File:** `phases/01-intake.md`

---

## Phase 2: ANALYZE (Security Analysis)

**Perform security analysis based on mode.**

| Mode | Methodology | Output |
|------|-------------|--------|
| AD-HOC | Research best practices, framework guidance | research.md |
| CODE-REVIEW | OWASP Top 10 and CWE Top 25 vulnerability scanning | FINDINGS.md |

**Phase File:** `phases/02-analyze.md`

---

## Phase 3: RECOMMEND (Prioritized Recommendations)

**Generate prioritized, actionable recommendations.**

| Priority | Criteria | Timeline |
|----------|----------|----------|
| **P0 - Critical** | Immediate risk, exploitable now | Fix immediately |
| **P1 - High** | Significant risk, likely exploitable | Fix within sprint |
| **P2 - Medium** | Moderate risk, harder to exploit | Plan remediation |
| **P3 - Low** | Minor risk, defense-in-depth | Backlog |

**Phase File:** `phases/03-recommend.md`

---

## Phase 4: DOCUMENT (Professional Report)

**Create professional deliverables for stakeholders.**

### Deliverables

**AD-HOC:** request.md, research.md, recommendations.md, references.md, FULL-REPORT.md

**Phase File:** `phases/04-document.md`

---

## Phase 5: DELIVER (Presentation and Follow-up)

**Present deliverables, highlight critical items, offer follow-up commands.**

- Summary of all deliverables with locations
- Critical findings emphasized (P0 items)
- Follow-up suggestions (`/pentest`, `/compliance`, `/harden`)
- User feedback capture

**Phase File:** `phases/05-deliver.md`

---

## Output Structure

```
private/output/advisory/
└── ad-hoc/
    └── {topic}-{YYYY-MM-DD}/
        ├── research-brief.md           # (optional, from Phase 1 Step 2b)
        ├── request.md
        ├── research.md
        ├── recommendations.md
        ├── references.md
        └── FULL-REPORT.md
```

**Note:** `code-reviews/` subdirectory also exists in output/ and is written by skills/code-review/.
Architecture reviews write to `private/output/sec-review/` (managed by skills/sec-review/).
The advisory output/ directory is shared for ad-hoc and code-review modes.

---

## Framework References

**Cite relevant controls from security frameworks:**

| Framework | Use For |
|-----------|---------|
| NIST CSF 2.0 | Overall security guidance |
| OWASP Top 10 | Web application security |
| CWE Top 25 | Code vulnerability classification |
| CIS Controls | Infrastructure hardening |
| STRIDE | Threat modeling (Spoofing, Tampering, Repudiation, Info Disclosure, DoS, Elevation) |
| PASTA | Risk-centric threat modeling |

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Missing context | Ask user for requirements (code path or question) |
| Scope creep | Redirect to appropriate skill (pentest, compliance, sec-review) |
| Insufficient documentation | Request code location or clarifying question |
| Mode unclear | Ask user to clarify: quick guidance or code review? For architecture reviews, use /sec-review |

---

## File Management

**What belongs in `skills/advisory/docs/`:**
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
- Engagement output → /private/output/{skill}/
- Engagement input → /private/input/{skill}/
- Working notes from development → delete (git history captures work)

**Skill data locations:**
- Input data: `/private/input/advisory/`
- Output data: `/private/output/advisory/`
- Reference materials: See `private/docs/book-catalog.md` (search by tag or domain)

---
**Version:** 2.2 | **Last Updated:** 2026-02-17 | **Status:** Active | **Structure:** Universal Prompt Structure v2.0
