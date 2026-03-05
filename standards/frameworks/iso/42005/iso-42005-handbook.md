---
type: reference
name: iso-42005-handbook
category: compliance
classification: private
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42005:2025 — AI System Impact Assessment"
framework_version: "2025"
---

# ISO/IEC 42005:2025 — AI System Impact Assessment Handbook

**Version:** 2025 | **Provider:** ISO/IEC JTC 1/SC 42
**Type:** Guidance standard (all guidance elements are informative — "should" not "shall")
**Last Updated:** 2026-02-22

---

## How to Use This Handbook

This handbook is the practitioner's guide to ISO/IEC 42005:2025. It is a narrative walkthrough
of the standard — what it requires, why it exists, and how organizations implement it alongside
ISO 42001 and other AI governance frameworks.

**This handbook IS:** A narrative walkthrough of ISO 42005, its structure, and practical implementation.

**This handbook is NOT:**
- The controls definition (structured machine-readable data in controls.yaml)
- The assessment questions (interview/evaluation questions in questions.yaml)
- The crosswalk (framework mappings in mappings/crosswalks/iso-42005.yaml)

**Related artifacts:**
- `controls.yaml` — Structured guidance element definitions
- `questions.yaml` — Assessment questions for evaluating impact assessment maturity
- `docs/iso-42005-implementation-guide.md` — How to conduct an AI system impact assessment
- `mappings/crosswalks/iso-42005.yaml` — Mappings to ISO 42001, NIST AI RMF, EU AI Act

---

## 1. Framework Overview

### What ISO/IEC 42005:2025 Is

ISO/IEC 42005:2025 is the guidance standard for conducting AI system impact assessments. It was
published in 2025 as part of the ISO/IEC JTC 1/SC 42 family of AI standards, designed to work
alongside ISO 42001 (the AI management system requirements standard).

The standard answers the practical question: *When ISO 42001 says an organization must conduct
an AI system impact assessment, what does that actually mean and how is it done?*

ISO 42005 provides a structured methodology covering two areas:

1. **Process guidance (Clause 5):** How to establish and run an impact assessment program — timing,
   scoping, responsibilities, thresholds, execution, analysis, approval, and monitoring.

2. **Documentation guidance (Clause 6):** What a completed impact assessment document should contain —
   system information, data information, deployment environment, interested parties, impacts (benefits
   and harms), and treatment measures.

The standard uses "should" language throughout — it is guidance, not requirements. However,
organizations seeking ISO 42001 certification should treat ISO 42005 as the implementation
playbook for ISO 42001 control A.5.2 (AI system impact assessment process) and clause 6.1.4
(planning for AI impact).

### Current Version

- **Version:** 2025 (first edition)
- **Published:** January 2025
- **Published by:** ISO/IEC JTC 1/SC 42 (Artificial Intelligence)
- **Official URL:** https://www.iso.org/standard/44545.html
- **Standard type:** International Standard (IS) — guidance
- **Preceding documents:** Builds on work from ISO/IEC 23894 (AI risk management)

### Why It Matters

Three forces make AI impact assessment increasingly important:

**Regulatory mandates.** The EU AI Act requires conformity assessments and fundamental rights impact
assessments for high-risk AI systems. ISO 42005's methodology provides a structured approach to
meeting these requirements. Organizations subject to the EU AI Act can use ISO 42005 as their
assessment methodology and reference ISO 42001 A.5 compliance as evidence of systematic assessment.

**Accountability requirements.** Stakeholders — regulators, customers, civil society — increasingly
require that AI deployers demonstrate they understood and addressed system impacts before deployment.
Documented impact assessments provide evidence that the organization considered harms systematically.

**Risk management quality.** Organizations that conduct thorough impact assessments before deployment
systematically identify design flaws, bias risks, privacy risks, and safety gaps earlier — when they
are cheaper to fix. ISO 42005 provides a structured framework that prevents ad hoc, inconsistent
assessment approaches.

### Target Audience

ISO 42005 is used by:

- **AI developers** building AI systems — conducting impact assessments during design and
  pre-deployment stages
- **AI deployers** implementing third-party AI systems — assessing impacts in their specific
  deployment context
- **AI system operators** running deployed AI systems — monitoring impacts and triggering
  reassessment when significant changes occur
- **Governance and compliance teams** establishing impact assessment processes and oversight
- **Auditors** evaluating whether an organization's ISO 42001 A.5 implementation is adequate

---

## 2. Who Needs This Standard

### Industry Applicability

ISO 42005 is relevant to any organization that develops, provides, or uses AI systems — particularly:

| Context | Relevance | Notes |
|---------|-----------|-------|
| Organizations seeking ISO 42001 certification | Required | ISO 42005 is the implementation guide for ISO 42001 A.5.2 |
| Organizations subject to EU AI Act | Highly relevant | ISO 42005 methodology supports fundamental rights impact assessment |
| AI developers (all industries) | Recommended | Provides consistent assessment methodology for AI design decisions |
| AI deployers in regulated industries | Recommended | Demonstrates due diligence on AI impacts |
| Public sector AI deployments | Recommended | Supports accountability to citizens |

### Regulatory vs. Voluntary

ISO 42005 is a voluntary international standard. However, organizations subject to:
- **EU AI Act** (high-risk AI systems) — ISO 42005 is a useful implementation methodology for
  Article 9 risk management and Article 27 fundamental rights impact assessment
- **ISO 42001 certification requirements** — ISO 42005 is the practical guide to A.5 compliance

---

## 3. Framework Architecture

### Standard Structure

ISO 42005:2025 has 6 main clauses:

| Clause | Title | Nature |
|--------|-------|--------|
| 1 | Scope | Informative |
| 2 | Normative references | Normative |
| 3 | Terms and definitions | Normative |
| 4 | Abbreviated terms | Informative |
| 5 | Developing and implementing an AI system impact assessment process | Guidance |
| 6 | Documenting the AI system impact assessment | Guidance |

Five informative annexes support the main guidance:

| Annex | Title | Purpose |
|-------|-------|---------|
| Annex A | Guidance for use with ISO/IEC 42001 | Maps ISO 42005 to ISO 42001 controls |
| Annex B | Guidance for use with ISO/IEC 23894 | Maps ISO 42005 to AI risk management |
| Annex C | Harms and benefits taxonomy | Reference taxonomy for impact analysis |
| Annex D | Aligning with other assessments | Coordination with PIA, SIA, HRIA, BIA |
| Annex E | Example impact assessment template | Practical template for documentation |

### Clause 5: Process Elements

Clause 5 covers 12 process elements that together constitute a complete impact assessment process:

| ID | Process Element |
|----|-----------------|
| 5.1 | General — structured approach and internal/external factors |
| 5.2 | Documenting the process |
| 5.3 | Integration with other organizational management processes |
| 5.4 | Timing of AI system impact assessment |
| 5.5 | Scope of the AI system impact assessment |
| 5.6 | Allocating responsibilities |
| 5.7 | Establishing thresholds (sensitive uses, restricted uses, impact scales) |
| 5.8 | Performing the AI system impact assessment |
| 5.9 | Analysing the results |
| 5.10 | Recording and reporting |
| 5.11 | Approval process |
| 5.12 | Monitoring and review |

### Clause 6: Documentation Content

Clause 6 specifies what a complete impact assessment document should contain:

| ID | Documentation Element |
|----|----------------------|
| 6.2 | Scope of the assessment |
| 6.3 | AI system information (description, purpose, intended/unintended uses) |
| 6.4 | Data information and quality |
| 6.5 | Algorithm and model information |
| 6.6 | Deployment environment (geographic and technical) |
| 6.7 | Relevant interested parties |
| 6.8 | Actual and reasonably foreseeable impacts (benefits and harms) |
| 6.9 | Measures to address harms and benefits |

---

## 4. Key Concepts Explained

### Impact Assessment vs. Risk Assessment

A common confusion: AI system impact assessment and AI risk assessment are different, complementary
activities. ISO 42005 Annex B explains the distinction explicitly:

| Dimension | Risk Assessment | Impact Assessment |
|-----------|----------------|-------------------|
| **Focus** | Organizational risks from AI systems | Impacts on individuals, groups, societies |
| **Perspective** | Inside-out (what could go wrong for us?) | Outside-in (what could happen to others?) |
| **Beneficiaries** | The organization managing risk | Affected individuals and communities |
| **Standard** | ISO 23894 (AI risk management) | ISO 42005 (AI impact assessment) |
| **ISO 42001 linkage** | 6.1.2 and 6.1.3 | 6.1.4 and A.5 |

The two processes are complementary. Impact assessment findings inform risk assessment (an impact
that harms users creates reputational, legal, and operational risk for the organization). Organizations
should integrate both processes to avoid duplication while capturing their distinct perspectives.

### Sensitive Use vs. Restricted Use

Clause 5.7 establishes a critical framework:

**Sensitive use:** An AI application that requires heightened scrutiny, additional safeguards, or
enhanced governance due to elevated risk to individuals. Examples: AI systems making decisions about
employment, credit, housing, healthcare, education, or criminal justice matters.

**Restricted use:** An AI application that is prohibited (by law, ethics policy, or organizational
policy) or subject to strict limitations. Examples: AI systems for mass surveillance of public spaces
(restricted under EU AI Act), AI for social scoring by governments (prohibited under EU AI Act).

Organizations should document their thresholds — what makes a use "sensitive" and what makes it
"restricted" — with reference to applicable law, ethics frameworks, and organizational risk appetite.
The threshold documentation is an important governance artifact.

### Impact Dimensions

When analyzing impacts (Clause 6.8), ISO 42005 provides a structured taxonomy across eight dimensions:

| Dimension | What to Assess |
|-----------|----------------|
| Accountability | Can decisions be attributed and reviewed? |
| Transparency | Is information about the AI system communicated appropriately? |
| Fairness/Discrimination | Are outcomes equitable across groups? |
| Privacy | Is personal information handled appropriately? |
| Reliability | Does the system perform consistently? |
| Safety | Could the system cause harm to health or safety? |
| Explainability | Can the basis of AI decisions be understood? |
| Environmental impact | What is the environmental footprint? |

For each dimension, both **benefits** AND **harms** should be analyzed for each identified
interested party. This dual-direction analysis is important — ISO 42005 is not purely a risk
identification exercise but a balanced assessment of beneficial and harmful outcomes.

### Assessment Timing — Life Cycle Integration

ISO 42005 clause 5.4 establishes that impact assessments should occur at key points in the AI
system life cycle:

1. **Design stage** — early assessment when AI system purpose and approach are being defined.
   Allows impact-informed design decisions before costs are locked in.

2. **Pre-deployment** — thorough assessment before the AI system enters production.
   Validates that design decisions adequately addressed identified impacts.

3. **Significant change** — assessment triggered by: new intended uses, new deployment geographies,
   significant technical changes, regulatory changes, discovery of new harms.

4. **Periodic review** — scheduled reassessment to verify the assessment remains current and
   treatment measures are effective.

---

## 5. Relationship to ISO 42001 and Other Frameworks

### ISO 42001 Relationship

ISO 42005 was designed as the implementation companion to ISO 42001. The relationship is explicit:

| ISO 42001 Clause/Control | ISO 42005 Guidance |
|--------------------------|-------------------|
| 6.1.4 — Planning impact assessment process | Clause 5 entire — process guidance |
| A.5.2 — AI system impact assessment process | Clause 5 entire — process guidance |
| A.5.3 — Documentation of impact assessments | Clause 6 entire — documentation guidance |
| A.5.4 — Impact on individuals and groups | Clause 6.7 (interested parties) + 6.8 |
| A.5.5 — Societal impacts | Clause 6.7.3 + 6.8 societal dimensions |
| 8.4 — Operational impact assessment | Clauses 5.4, 5.8, 5.12 (timing and monitoring) |

Annex A of ISO 42005 provides an explicit cross-reference table showing how each ISO 42001 control
relates to specific ISO 42005 clauses.

### EU AI Act Relationship

| EU AI Act | ISO 42005 Support |
|-----------|------------------|
| Article 9 — Risk management system | Clause 5 (process) + Clause 6 (documentation) |
| Article 10 — Data governance | Clause 6.4 (data information and quality) |
| Article 11 — Technical documentation | Clause 6 (structured documentation content) |
| Article 27 — Fundamental rights impact assessment | Clause 6.8 (impacts including human rights) |
| Annex D — Coordination guidance | Aligning ISO 42005 assessments with FRIA requirements |

### NIST AI RMF Relationship

| NIST AI RMF | ISO 42005 |
|-------------|-----------|
| MAP 5.1 — Impact likelihood assessed | Clause 5.8 (performing assessment) |
| MAP 5.2 — Practices for risk treatment | Clause 5.9 and 6.9 (treatment measures) |
| MEASURE 2.5 — Performance evaluation | Clause 5.12 (monitoring and review) |
| GOVERN 1.3 — Risk tolerance established | Clause 5.7 (thresholds) |

### Assessment Integration (Annex D)

Annex D of ISO 42005 provides guidance on coordinating AI system impact assessments with other
assessments organizations routinely conduct. The goal is integration without duplication:

| Existing Assessment | Integration Opportunity |
|--------------------|------------------------|
| Privacy Impact Assessment (PIA) | Share interested party identification; coordinate privacy findings |
| Human Rights Impact Assessment (HRIA) | Align stakeholder consultation; share rights impact analysis |
| Security Impact Assessment (SIA) | Coordinate on security threat scenarios; share technical findings |
| Business Impact Assessment (BIA) | Align organizational risk treatment with impact findings |
| Risk Assessment (ISO 23894) | Feed impact findings into risk register |

---

## 6. Common Findings and Pitfalls

### Most Frequently Identified Gaps

**1. Assessments conducted without a defined process.**
Organizations conduct ad hoc impact assessments for individual AI systems without a documented,
repeatable methodology. Each assessment looks different; no consistent thresholds; no integration
with other organizational processes.

**2. Thresholds not defined.**
The organization has an impact assessment process but has not defined what constitutes a "sensitive"
or "restricted" use. As a result, all AI systems receive the same assessment depth regardless of
risk profile, or there is no consistent basis for escalation.

**3. Interested party identification is superficial.**
Assessments identify "users" as the only interested party and miss: vulnerable populations, data
subjects, workers, societies, and indirectly affected parties. The impact analysis then only
addresses user-facing impacts.

**4. One-sided impact analysis (harms only, no benefits).**
Organizations document potential harms but do not analyze benefits for interested parties. This
produces a distorted picture and misses the proportionality analysis that weighs harms against
benefits in context.

**5. No integration with technical decisions.**
Assessment findings exist in reports but do not demonstrably influence AI system design decisions.
Engineers make technical choices without reference to identified impacts.

**6. No monitoring after deployment.**
Assessments are conducted pre-deployment and then filed. No mechanism exists to revisit the
assessment when circumstances change or when production monitoring reveals unexpected impacts.

### Maturity Spectrum

| Level | Description |
|:-----:|-------------|
| 0 - None | No AI system impact assessments conducted |
| 1 - Initial | Ad hoc assessments for some AI systems; no consistent methodology; no thresholds defined |
| 2 - Developing | Documented process exists; applied inconsistently; limited integration with technical decisions |
| 3 - Defined | Consistent methodology applied across AI systems; thresholds defined; responsible parties assigned |
| 4 - Managed | Assessments integrated with design decisions and governance; monitored post-deployment; integrated with other assessments |

---

## 7. Quick Reference

### Assessment Process Checklist

**Process setup (Clause 5):**
- [ ] Documented impact assessment process aligned to ISO 42005 Clause 5
- [ ] Assessment timing triggers defined (life cycle stages + change triggers + periodic review)
- [ ] Scope definition methodology documented
- [ ] Responsible parties assigned (assessor, reviewer, approver)
- [ ] Sensitive use and restricted use thresholds documented
- [ ] Impact severity scale defined
- [ ] Approval process and escalation matrix documented
- [ ] Integration with other organizational processes documented
- [ ] Monitoring and review schedule established

**Documentation content (Clause 6) for each assessment:**
- [ ] Assessment scope statement
- [ ] AI system description and capabilities
- [ ] AI system purpose and intended uses
- [ ] Reasonably foreseeable misuses
- [ ] Data information (datasets, quality, governance)
- [ ] Algorithm/model information (where available)
- [ ] Deployment environment (geographic + technical)
- [ ] Interested parties identified (direct + indirect)
- [ ] Benefits and harms analyzed per interested party across all eight dimensions
- [ ] Failure impacts analyzed
- [ ] Misuse impacts analyzed
- [ ] Treatment measures proposed
- [ ] Assessment approved by defined approver

### Key Terms

**AI system impact assessment:** Formal, documented process by which the impacts to individuals,
groups of individuals, and societies are considered by an organization developing, providing, or
using AI systems.

**Sensitive use:** An AI use requiring heightened scrutiny or additional safeguards due to elevated
impact risk.

**Restricted use:** An AI use that is prohibited or subject to strict limitations per law, ethics,
or organizational policy.

**Reasonably foreseeable misuse:** Uses of an AI system that are not intended but can reasonably
be anticipated, including deliberate misuse by malicious actors.

**Interested parties:** Individuals, groups, or societies that can be affected by or have an interest
in the AI system — including those who do not directly interact with the system.

---

## Sources

- ISO/IEC 42005:2025 — AI System Impact Assessment (full text, ISO)
- ISO/IEC 42001:2023 — Artificial Intelligence Management Systems
- ISO/IEC 23894:2023 — Information technology — Artificial intelligence — Guidance on risk management
- NIST AI Risk Management Framework (NIST AI RMF 1.0)
- EU AI Act (Regulation (EU) 2024/1689) — Articles 9, 10, 11, 27
- Official URL: https://www.iso.org/standard/44545.html
