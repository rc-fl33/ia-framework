# Advisory Skill

**Strategic security guidance and code security analysis.**

---

## Problem

Security teams need expert guidance for design decisions, architecture reviews, and code security analysis. Manual reviews are time-consuming and may miss critical issues without structured methodology.

---

## Solution

A unified advisory skill providing:
- Ad-hoc security guidance with framework references (NIST, OWASP, CIS)
- Code security reviews with OWASP/CWE vulnerability classification
- Structured 5-phase workflow ensuring thorough analysis
- Professional, stakeholder-ready deliverables

**For architecture security reviews:** Use `/sec-review` (STRIDE/PASTA threat modeling,
security practices, patch management — routed to security agent).

---

## Quick Start

```bash
/advisory                    # Quick security guidance
/advisory [question]         # Answer specific security question
/code-review                 # Security-focused code review
/sec-review             # Full architecture security review (standalone skill)
```

---

## Commands

| Command | Description | Effort |
|---------|-------------|--------|
| `/advisory` | Ad-hoc security guidance | QUICK-STANDARD |
| `/code-review` | Code security analysis | THOROUGH |
| `/sec-review` | Architecture review with threat modeling (standalone) | THOROUGH |

---

## Workflow

```
INTAKE → ANALYZE → RECOMMEND → DOCUMENT → DELIVER
   |         |          |           |          |
   v         v          v           v          v
Gather    Threat     Generate    Create     Present
context   model or   prioritized  report    to user
          findings   recommendations
```

---

## Output

| Mode | Deliverables |
|------|--------------|
| Ad-hoc | Direct response with framework references (or documented report) |
| Code-review | Executive summary, review summary, findings with CWE, remediation guide |

**Location:** `private/output/advisory/{type}/{project}-{date}/`

---

## Requirements

- [ ] Clear question or context to analyze
- [ ] For code-review: Code access (directory path or files)
- [ ] For architecture review: Use `/sec-review` instead

---

## Agent

**Executed by:** `advisor` agent (all phases)

---

## Related Skills

**Security (active testing):**
- `/pentest` — Custom client penetration testing
- `/bug-bounty` — Data-driven bug bounty testing
- `/vuln-scan` — Automated vulnerability scanning
- `/seg-test` — Network segmentation validation

**Compliance (assessment and response):**
- `/compliance` — Multi-framework compliance assessment
- `/risk-assess` — Risk assessment using NIST CSF methodology
- `/incident` — Incident response and tabletop exercises
- `/harden` — Infrastructure hardening validation

**Key Distinction:** Advisory = guidance and analysis. Security = active testing. Compliance = assessment. Implementation = handled directly by engineer agent.

---

**Version:** 2.2 | **Last Updated:** 2026-02-11 | **Framework:** Intelligence Adjacent (IA)
