---
type: reference
title: Skills Catalog
classification: public
version: 1.0
last_updated: 2026-03-05
audience: all
category: reference
related_docs:
  - docs/catalogs/commands.md
  - docs/catalogs/agents.md
  - docs/catalogs/tool-catalog.md
---

# Skills Catalog

Comprehensive reference for all available skills in the Intelligence Adjacent Framework. Each skill is a modular capability self-contained in its own directory with documentation, scripts, and related resources.

**Last Updated:** 2026-03-05
**Total Skills:** 15
**Source of Truth:** `skills/*/SKILL.md` frontmatter

---

## Skills Reference Matrix

| Skill | Description | Agent | Classification | Effort | Version |
|-------|-------------|-------|-----------------|--------|---------|
| advisory | Ad-hoc security guidance — strategic security advice, quick questions, and contextual framework references | advisor | public | STANDARD | 2.2 |
| bug-bounty | Data-driven bug bounty testing with auto-scope from public data source | security | public | STANDARD | 1 |
| code-review | Security-focused code review with 4-pass analysis — structural recon, OWASP/CWE/API pattern scanning, semantic data flow tracing, and self-verification with confidence ratings. | developer | public | STANDARD | 1 |
| create | Interactive creation wizard for skills and tools - guides through requirements gathering to create properly structured components | engineer | public | STANDARD | 1 |
| gap-analysis | Framework gap analysis — multi-framework assessment with framework-native findings, gap identification, and remediation roadmap. 3-phase pipeline (intake, assess, deliverables) with manifest-based discovery, control-tagged questions, and domain-based deduplication. | advisor | public | STANDARD | 1 |
| harden | Infrastructure hardening skill — validate or remediate system configuration against CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General hardening benchmarks. | engineer | public | STANDARD | 1 |
| incident | Incident response — active IR documentation, tabletop exercise facilitation, and post-incident review across NIST SP 800-61r3, ISO 27001, PCI DSS, HIPAA, FedRAMP, and General frameworks. | security | public | STANDARD | 1 |
| mentorship | Learning roadmaps and career progression tracking - personalized development plans with milestone tracking | advisor | public | STANDARD | 2 |
| pentest | Penetration testing orchestrator with 7-phase PTES workflow, domain-specific methodologies, VPS-based execution, and close-loop remediation. | security | public | STANDARD | 1 |
| risk-assess | Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring, risk register, and treatment prioritization. | advisor | public | STANDARD | 1 |
| sec-review | Comprehensive security review with STRIDE/PASTA/ZTA threat modeling, security practices (incl. API security when applicable), supply chain assessment, architectural gap analysis, and prioritized remediation roadmap. | security | public | STANDARD | 1.1 |
| seg-test | Network segmentation validation with Director/Demo modes for testing isolation controls and zone boundaries. | security | public | STANDARD | 1 |
| test-plan | Skill-agnostic test plan generation for security assessments. Generates detailed test plans with test cases from methodologies for pentest, security review, code review, and other assessment types. | security | public | STANDARD | 1 |
| vuln-scan | Automated vulnerability scanning with Director/Demo modes for systematic security assessment and CVE analysis. | security | public | STANDARD | 1 |
| write | Generic content writing workflow with QA gates, reusable for any documentation | writer | public | STANDARD | 2 |

---

## Classification Summary

**Public Skills (15)** - Available in public ia-framework repository:
- `advisory`
- `bug-bounty`
- `code-review`
- `create`
- `gap-analysis`
- `harden`
- `incident`
- `mentorship`
- `pentest`
- `risk-assess`
- `sec-review`
- `seg-test`
- `test-plan`
- `vuln-scan`
- `write`

---

## Skills by Agent

### Advisor Agent (4 skills)
- **advisory** - Ad-hoc security guidance — strategic security advice, quick questions, and contextual framework references
- **gap-analysis** - Framework gap analysis — multi-framework assessment with framework-native findings, gap identification, and remediation roadmap. 3-phase pipeline (intake, assess, deliverables) with manifest-based discovery, control-tagged questions, and domain-based deduplication.
- **mentorship** - Learning roadmaps and career progression tracking - personalized development plans with milestone tracking
- **risk-assess** - Structured risk assessment — asset inventory, threat landscape, likelihood/impact scoring, risk register, and treatment prioritization.

### Developer Agent (1 skill)
- **code-review** - Security-focused code review with 4-pass analysis — structural recon, OWASP/CWE/API pattern scanning, semantic data flow tracing, and self-verification with confidence ratings.

### Engineer Agent (2 skills)
- **create** - Interactive creation wizard for skills and tools - guides through requirements gathering to create properly structured components
- **harden** - Infrastructure hardening skill — validate or remediate system configuration against CIS Controls v8.1, NIST CSF 2.0, FedRAMP, ISO 27001, HIPAA, or General hardening benchmarks.

### Security Agent (7 skills)
- **bug-bounty** - Data-driven bug bounty testing with auto-scope from public data source
- **incident** - Incident response — active IR documentation, tabletop exercise facilitation, and post-incident review across NIST SP 800-61r3, ISO 27001, PCI DSS, HIPAA, FedRAMP, and General frameworks.
- **pentest** - Penetration testing orchestrator with 7-phase PTES workflow, domain-specific methodologies, VPS-based execution, and close-loop remediation.
- **sec-review** - Comprehensive security review with STRIDE/PASTA/ZTA threat modeling, security practices (incl. API security when applicable), supply chain assessment, architectural gap analysis, and prioritized remediation roadmap.
- **seg-test** - Network segmentation validation with Director/Demo modes for testing isolation controls and zone boundaries.
- **test-plan** - Skill-agnostic test plan generation for security assessments. Generates detailed test plans with test cases from methodologies for pentest, security review, code review, and other assessment types.
- **vuln-scan** - Automated vulnerability scanning with Director/Demo modes for systematic security assessment and CVE analysis.

### Writer Agent (1 skill)
- **write** - Generic content writing workflow with QA gates, reusable for any documentation

---

## Skills by Effort Level

### STANDARD Skills
- `advisory`, `bug-bounty`, `code-review`, `create`, `gap-analysis`, `harden`, `incident`, `mentorship`, `pentest`, `risk-assess`, `sec-review`, `seg-test`, `test-plan`, `vuln-scan`, `write`

---

## Skills by Integration Status

### Skills with External Integrations

| Skill | Env Required |
|-------|--------------|
| write | Yes |

### Skills with No External Dependencies
- `advisory`, `bug-bounty`, `code-review`, `create`, `gap-analysis`, `harden`, `incident`, `mentorship`, `pentest`, `risk-assess`, `sec-review`, `seg-test`, `test-plan`, `vuln-scan`, `write`
