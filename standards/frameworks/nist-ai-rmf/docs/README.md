# NIST AI Risk Management Framework 1.0

**Document:** NIST AI 100-1
**Publisher:** National Institute of Standards and Technology (NIST)
**Published:** January 26, 2023
**Official URL:** https://airc.nist.gov/
**Download:** https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf

## Overview

The NIST AI Risk Management Framework (AI RMF 1.0) is a voluntary, technology-neutral
framework designed to help organizations identify, assess, and manage AI risks across
the full AI lifecycle. It is applicable to organizations of any size, sector, or
maturity level working with or considering AI systems.

The AI RMF Core is organized around four functions. GOVERN is a cross-cutting function
intended to be infused throughout MAP, MEASURE, and MANAGE.

## Framework Structure

| Function | Code | Categories | Subcategories | Domain |
|----------|------|------------|---------------|--------|
| GOVERN   | GV   | 6          | 19            | governance |
| MAP      | MP   | 5          | 18            | asset_management |
| MEASURE  | MR   | 4          | 22            | monitoring |
| MANAGE   | MG   | 4          | 13            | governance |
| **Total** |    | **19**     | **72**        | |

## Functions

**GOVERN (GV)** establishes organizational culture, policies, and accountability
structures for AI risk management. It covers legal requirements, trustworthy AI
integration, risk tolerance, accountability, workforce diversity, organizational
culture, stakeholder engagement, and supply chain risk.

**MAP (MP)** establishes context for AI risk framing. Organizations completing MAP
have sufficient contextual knowledge to make initial go/no-go decisions about AI
system design, development, or deployment. It covers context establishment,
categorization, benefits and costs analysis, component risk mapping, and impact
characterization.

**MEASURE (MR)** employs quantitative, qualitative, or mixed-method tools to analyze,
assess, benchmark, and monitor AI risk. It covers measurement methods, trustworthy AI
evaluation (including safety, security, fairness, privacy, transparency, explainability,
and environmental impact), risk tracking, and measurement feedback.

**MANAGE (MG)** allocates risk resources to mapped and measured risks. It covers risk
prioritization and response, strategies to maximize benefits and minimize harms,
third-party AI risk management, and post-deployment monitoring.

## Related Frameworks

| Framework | Relationship |
|-----------|--------------|
| ISO 42001 | Certifiable AI management system — structural complement to AI RMF |
| EU AI Act | EU regulation — NIST has published official crosswalk |
| AIUC-1    | Operationalizes AI RMF into 51 enterprise controls |
| ISO 27001 | Information security — companion standard for AI system security |
| NIST CSF  | Structural sibling — same function-based architecture |
| NIST 800-53 | Security controls catalog — referenced for AI system security |

## Assessment Notes

- **Tier achieved:** T2 (manifest + controls + questions)
- **Questions count:** 72 (one per subcategory)
- **Cross-framework mappings:** T3 upgrade requires official NIST crosswalk documents
- **Crosswalk sources to obtain for T3:**
  - NIST AI RMF to ISO 42001 crosswalk
  - NIST AI RMF to EU AI Act crosswalk: https://airc.nist.gov/docs/20241216-Crosswalk_NIST_AI_RMF_TTA_Guidebook3.pdf
  - NIST AI RMF to NIST CSF crosswalk

## Source Verification

All subcategory text sourced from NIST AI Resource Center Core page:
https://airc.nist.gov/airmf-resources/airmf/5-sec-core/

Last verified: 2026-02-25
Next check: 2027-02-25

## Related NIST AI Publications

- **NIST AI 600-1** — Generative AI Profile (2024): Extends AI RMF with 200+ LLM-specific actions
- **NIST AI RMF Playbook** — Suggested actions per subcategory: https://airc.nist.gov/docs/AI_RMF_Playbook.pdf
- **NIST AI RMF Profiles** — Sector-specific implementations: https://airc.nist.gov/AI_RMF_Knowledge_Base/AI_RMF/Core_And_Profiles/6-sec-profile
