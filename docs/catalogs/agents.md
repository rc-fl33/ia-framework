---
type: reference
title: Agents Catalog
classification: public
version: 1.0
last_updated: 2026-03-04
audience: all
category: reference
related_docs:
  - docs/catalogs/skills.md
  - docs/catalogs/commands.md
  - docs/architecture/agent-routing-architecture.md
---

# Agents Catalog

Comprehensive reference for all available agents in the Intelligence Adjacent Framework. Agents are specialized processors that handle complex, domain-specific tasks with appropriate models and workflows.

**Last Updated:** 2026-03-04
**Total Agents:** 7
**Source of Truth:** `agents/*.md` files

---

## Agent Reference Matrix

| Agent | Skills Count | Classification |
|-------|--------------|-----------------|
| advisor | 6 (6 public) | mixed |
| developer | 1 (1 public) | mixed |
| engineer | 2 (2 public) | mixed |
| legal | — | private |
| researcher | — | private |
| security | 7 (7 public) | mixed |
| writer | 2 (1 public) | mixed |

---

## Skills by Agent

### Advisor Agent

**Skills This Agent Handles (6):**
1. `advisory` - Ad-hoc security guidance — strategic security advice, quick questions, and contextual framework references
2. `career` - Career analysis - job application assessment with GO/NO-GO scoring, company research, interview prep, and production-ready deliverables. Resume ethics mandatory - never fabricate.
3. `clifton` - CliftonStrengths analysis with individual coaching, team comparison, and multi-format output (markdown, HTML, slides)
4. `gap-analysis` - Framework gap analysis — multi-framework assessment with framework-native findings, gap identification, and remediation roadmap. 3-phase pipeline (intake, assess, deliverables) with manifest-based discovery, control-tagged questions, and domain-based deduplication.
5. `mentorship` - Learning roadmaps and career progression tracking - personalized development plans with milestone tracking
6. `risk-assess` - Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring, risk register, and treatment prioritization.

### Developer Agent

**Skills This Agent Handles (1):**
1. `code-review` - Security-focused code review with 4-pass analysis — structural recon, OWASP/CWE/API pattern scanning, semantic data flow tracing, and self-verification with confidence ratings.

### Engineer Agent

**Skills This Agent Handles (2):**
1. `create` - Interactive creation wizard for skills and tools - guides through requirements gathering to create properly structured components
2. `harden` - Infrastructure hardening skill — validate or remediate system configuration against CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General hardening benchmarks.

### Legal Agent

**Skills This Agent Handles:**
- Legal compliance and regulatory analysis (private skills not listed in public catalog)

### Researcher Agent

**Skills This Agent Handles:**
- Information gathering and synthesis (private skills not listed in public catalog)

### Security Agent

**Skills This Agent Handles (7):**
1. `bug-bounty` - Data-driven bug bounty testing with auto-scope from public data source
2. `incident` - Incident response — active IR documentation, tabletop exercise facilitation, and post-incident review across NIST SP 800-61r3, ISO 27001, PCI DSS, HIPAA, FedRAMP, and General frameworks.
3. `pentest` - Penetration testing orchestrator with 7-phase PTES workflow, domain-specific methodologies, VPS-based execution, and close-loop remediation.
4. `sec-review` - Comprehensive security review with STRIDE/PASTA/ZTA threat modeling, security practices (incl. API security when applicable), supply chain assessment, architectural gap analysis, and prioritized remediation roadmap.
5. `seg-test` - Network segmentation validation with Director/Demo modes for testing isolation controls and zone boundaries.
6. `test-plan` - Skill-agnostic test plan generation for security assessments. Generates detailed test plans with test cases from methodologies for pentest, security review, code review, and other assessment types.
7. `vuln-scan` - Automated vulnerability scanning with Director/Demo modes for systematic security assessment and CVE analysis.

### Writer Agent

**Skills This Agent Handles (2):**
1. `ghost` - Blog publishing workflow for Intelligence Adjacent - research, draft, QA, visuals, publish to Ghost CMS
2. `write` - Generic content writing workflow with QA gates, reusable for any documentation

---

## Classification Summary

### Advisor Agent

**Public:** 6 skills - `advisory`, `career`, `clifton`, `gap-analysis`, `mentorship`, `risk-assess`
**Private:** 0 skills - none

### Developer Agent

**Public:** 1 skills - `code-review`
**Private:** 0 skills - none

### Engineer Agent

**Public:** 2 skills - `create`, `harden`
**Private:** 0 skills - none

### Security Agent

**Public:** 7 skills - `bug-bounty`, `incident`, `pentest`, `sec-review`, `seg-test`, `test-plan`, `vuln-scan`
**Private:** 0 skills - none

### Writer Agent

**Public:** 1 skills - `write`
**Private:** 1 skills - `ghost`

