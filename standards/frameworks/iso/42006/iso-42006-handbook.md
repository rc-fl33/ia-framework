---
type: reference
name: iso-42006-handbook
category: compliance
classification: private
version: 1.0
last_updated: "2026-02-22"
framework: "ISO/IEC 42006:2025 — Requirements for Bodies Providing Audit and Certification of AIMS"
framework_version: "2025"
---

# ISO/IEC 42006:2025 — AIMS Certification Body Requirements Handbook

**Version:** 2025 | **Provider:** ISO/IEC JTC 1/SC 42
**Type:** Requirements standard for certification bodies (CBs), not for organizations seeking certification
**Last Updated:** 2026-02-22

---

## How to Use This Handbook

This handbook is a practitioner's guide to ISO/IEC 42006:2025. It has two distinct audiences
and serves different purposes for each:

**Certification body audience:** Use this handbook to understand what ISO 42006 requires of you,
how it extends ISO 17021-1 with AI-specific requirements, and how to build conformance.

**Organization seeking ISO 42001 certification audience:** Use this handbook to understand what to
look for when selecting a certification body, what questions to ask, and what a competent audit
looks like.

**Related artifacts:**
- `controls.yaml` — Structured requirement definitions
- `questions.yaml` — Assessment questions (for both CB self-assessment and CB evaluation)
- `mappings/crosswalks/iso-42006.yaml` — Mappings to ISO 17021-1 and ISO 42001

---

## 1. Framework Overview

### What ISO/IEC 42006:2025 Is

ISO/IEC 42006:2025 establishes requirements for conformity assessment bodies that provide auditing
and certification of AI Management Systems (AIMS) against ISO/IEC 42001:2023.

In simpler terms: when a company wants to become "ISO 42001 certified," they hire a certification
body to audit them. ISO 42006 specifies what that certification body must be capable of — its
competence, impartiality, processes, and infrastructure — to do that job credibly.

ISO 42006 is the AI-specific extension of ISO/IEC 17021-1 (the general standard for bodies
certifying management systems). It inherits all ISO 17021-1 requirements and adds AI-specific
requirements, primarily around:
- Auditor competence for AI management systems
- Conflict of interest provisions specific to AI consulting
- Audit scope requirements for AI value chain roles
- AI-specific audit time calculation factors

### Current Version

- **Version:** 2025 (first edition)
- **Published:** 2025 (Iso Store order OP-930532 downloaded 2025-07-08)
- **Published by:** ISO/IEC JTC 1/SC 42
- **Official URL:** https://www.iso.org/standard/44546.html
- **Parent standard:** ISO/IEC 17021-1 (management system certification body requirements)

### Why It Matters

**For organizations seeking ISO 42001 certification:**

ISO 42006 is the quality standard for your auditor. Without ISO 42006 conformance (ideally
demonstrated through accreditation), a certification body cannot credibly assess AI management
systems. Key risks from an under-qualified CB:

- Auditors who lack AI technical competence may not recognize when an AIMS is substantive vs.
  cosmetic — producing certification that gives false assurance
- CBs with conflicts of interest (selling both AIMS consulting and AIMS certification) may certify
  organizations without rigorous scrutiny
- Insufficient audit time may result in sampling gaps that miss significant nonconformities

**For certification bodies:**

ISO 42006 is the standard your accreditation body uses to evaluate whether your AIMS certification
program meets the bar for ISO 42001 certification activities. Without conformance to ISO 42006,
you cannot obtain ISO 42001-specific accreditation from a national accreditation body.

### Who Must Conform

ISO 42006 requirements apply to **third-party conformity assessment bodies** — independent
organizations that audit and certify other organizations' AIMS against ISO 42001. This includes:

- Traditional management system certification bodies expanding into AI management (e.g., BSI,
  Bureau Veritas, DNV, SGS, TÜV)
- Technology-specific certification bodies adding AIMS to their portfolio
- New entrants building AIMS-specific certification programs

ISO 42006 does NOT apply to:
- Organizations seeking ISO 42001 certification (they are subject to ISO 42001, not 42006)
- First-party or second-party auditors (internal auditors or customer audits)
- Accreditation bodies (they evaluate CBs against ISO 42006, but are not themselves subject to it)

---

## 2. Standard Architecture

### Structure Overview

ISO 42006 follows the same structure as ISO 17021-1, with AI-specific additions:

| Clause | Content | Extends 17021-1? |
|--------|---------|-----------------|
| 4 | Principles | Base principles inherited |
| 5 | General requirements (impartiality, liability) | AI-specific conflict of interest additions |
| 6 | Structural requirements | Inherited from 17021-1 |
| 7 | Resource requirements (competence) | MAJOR AI additions — six competence domains |
| 8 | Information requirements | AI-specific certification document requirements |
| 9 | Process requirements | AI-specific scope, audit time, stage requirements |
| 10 | Management system requirements for CBs | Options A and B inherited |
| Annex A | Audit time (normative) | NEW — AI-specific calculation factors |
| Annex B | Audit time calculation examples (informative) | NEW examples |
| Annex C | Certificate document template (informative) | AIMS-specific template |

### Key AI-Specific Additions Over ISO 17021-1

**Clause 5.2.2 — Conflicts of interest (expanded):**
Specific prohibitions on AI-adjacent consulting services that create conflict of interest.
CBs certifying AIMS cannot: provide company-specific AI management consulting, implement AIMS
for clients, recommend specific AI system solutions, or provide data protection officer services
to certification clients.

**Clause 7.1.3 — Specific technical competence (new):**
Six AI-specific competence domains required — this is the most substantial addition. See Section 4.

**Clause 9.1.2 — AI stakeholder role identification (new):**
Audit programme must identify client's position in AI value chain (producer/provider/customer).

**Clause 9.1.3 — SoA completeness verification (enhanced):**
CB must verify that the SoA covers all significant AI system processes and risks — not just
accept the client's scope definition.

**Annex A — Audit time (normative replacement):**
AI-specific audit time calculation methodology replacing 17021-1 guidance for AIMS audits.

---

## 3. Impartiality Requirements

### The Impartiality Imperative

Impartiality is the foundation of credible certification. An AIMS certification is only meaningful
if the certifying body has no financial or other interest in whether the client is certified.

ISO 42006 clause 5.2 extends ISO 17021-1 impartiality requirements with AI-specific conflict of
interest provisions. The key principle: if a CB profits from helping an organization implement
AIMS, it cannot credibly audit that same AIMS.

### What CBs Cannot Do for Certification Clients

ISO 42006 clause 5.2.2.3 prohibits CBs from:
- Providing company-specific advice as consultancy
- Conducting activities that themselves constitute audit services or lead to recommendations
  that could substitute for certification scrutiny
- Recommending specific AI system solutions, AIMS implementation approaches, or AI tools
- Providing AI management consulting, information security consulting, data protection officer
  services, or risk management consulting

### What CBs CAN Do Without Conflict

ISO 42006 clause 5.2.2.2 permits:
- Public training courses open to all (not company-specific)
- Generic publicly available information in training contexts
- Publication of guidance documents
- Participation in standards development

### Practical Implication for Organizations

When selecting a CB, ask:
1. Does the CB provide AIMS implementation consulting services?
2. If yes — how does the CB ensure separation between consulting and certification clients?
3. Are there documented firewalls between the business units?
4. Has the proposed audit team provided consulting to our organization?

A CB that is purely a certification body (no consulting services) has the lowest impartiality risk.

---

## 4. Auditor Competence Requirements

### Six Competence Domains

ISO 42006 clause 7.1.3 establishes six domains of AI-specific competence required for AIMS
auditors. This is the most significant practical difference between AIMS audits and general
management system audits:

| Domain | Clause | Content |
|--------|--------|---------|
| 1. General AIMS requirements | 7.1.3.1 | AI concepts, technical aspects, management system principles, auditing, AIMS monitoring |
| 2. AI management system standards | 7.1.3.2 | ISO 42001 structure, other normative documents, certification schemes |
| 3. AI and AIMS legal obligations | 7.1.3.3 | Applicable AI laws — EU AI Act, national AI regulations |
| 4. AI terminology, methods, and techniques | 7.1.3.4 | AI governance structures, risk management, data science, ML processes |
| 5. Client business sector | 7.1.3.5 | Sector terminology, AI use in the sector, regulatory environment |
| 6. Client products, processes, organization | 7.1.3.6 | Client's specific AI systems, technologies, organizational structure |

**Important nuance:** Some domains require individual auditor competence; others allow collective
team competence. Audit TEAMS collectively must meet all requirements — not every individual auditor
must know everything.

### Auditor Experience Requirements

Beyond competence, ISO 42006 clause 7.2.2.2 sets minimum experience criteria for individual auditors:

- University-equivalent professional education
- At least **4 years** of full-time practical workplace experience in IT or data protection
- At least **1 year** of that experience specifically related to AI systems
- Completion of AIMS-specific auditor training

**Audit team leaders** additionally must have:
- Active participation as auditor in all stages of at least **3 management system audits**
- Experience covering initial scoping, document review, risk assessment review, and formal reporting

### Implications for Organizations

When evaluating a proposed audit team, request:
- CVs demonstrating the 4-year IT + 1-year AI experience requirement
- Evidence of AIMS-specific auditor training completion
- References from comparable AIMS certifications in your industry sector
- Evidence that the team collectively covers all six competence domains

For audit teams that are missing AI-specific experience, ask how the CB compensates — e.g., through
external technical experts. Verify that such experts meet the same competence requirements.

---

## 5. Audit Process Requirements

### Pre-Certification: Scope and Audit Time

**AI stakeholder role identification (9.1.2):**
Before planning the audit, the CB must identify the client's role(s) in the AI value chain:
- **AI producer:** Develops and builds AI systems
- **AI provider:** Makes AI systems available to others (may develop or resell)
- **AI customer:** Deploys and uses AI systems built by others

Clients may occupy multiple roles simultaneously. The role(s) determine which ISO 42001 requirements
are most relevant and how the audit scope should be constructed.

**Statement of Applicability (SoA) review (9.1.3):**
The CB must verify that the SoA includes all significant processes and risks relevant to the AI
systems in scope. This is not a rubber stamp — the CB must challenge scope exclusions when significant
risks appear unaddressed.

**Audit time calculation (9.1.4 + Annex A):**
Audit time is calculated using normative Annex A methodology. Base time is determined by the number
of persons in the organization involved in the AI life cycle, adjusted for:

| Adjustment Factor | Time Impact |
|-------------------|-------------|
| Number of AI systems in scope (beyond 5) | 1.0-2.0 auditor days each |
| Number of high-risk/sensitive AI systems | 0.5-2.0 auditor days each |
| Number of regulatory frameworks in scope | 1.0 auditor day each |
| Number of third-party agreements (beyond 5) | 0.1-2.0 auditor days |
| Number of additional SoA controls | 0.1 auditor days each (max 2.0) |

**Practical implication:** Organizations with multiple high-risk AI systems or operating under
multiple regulatory frameworks should expect significantly longer audits than ISO 27001 equivalents.

### Two-Stage Initial Certification

**Stage 1 audit:**
Purpose: Review AIMS documentation and assess organizational readiness for Stage 2.
The CB must obtain sufficient understanding of:
- AIMS design and context
- Risk assessment and management approach
- AI policy and objectives
- SoA completeness
- Readiness indicators (maturity of implementation)

Stage 1 typically involves document review and may include site visit. Output: Stage 1 audit report
informing the Stage 2 audit plan.

**Stage 2 audit:**
Purpose: Verify that the AIMS is effectively implemented.
Based on Stage 1 findings, the CB executes the audit plan verifying that the client:
- Adheres to its own policies and procedures
- Has implemented controls documented in the SoA
- Has achieved its AI management objectives

**Nonconformities:** All nonconformities must be resolved before a positive certification decision.
The CB must provide additional time (beyond standard audit time) for each nonconformity found to
evaluate corrective actions.

### Certification Decision

The certification decision must be made by personnel who did NOT conduct the audit. This independence
is a core principle — auditors cannot approve their own work.

### Surveillance and Re-certification

**Annual surveillance (9.6.2):**
Approximately one-third of initial audit time. The programme must be adapted to AI system-specific
risks — not a generic checklist. Events such as significant AI system changes, incidents, or new
regulatory requirements may trigger expanded or special surveillance.

**Re-certification (every 3 years, 9.6.3):**
At least two-thirds of the initial certification audit time. The CB reviews changes over the
certification cycle and verifies continued conformance.

**Remote auditing (9.2.4):**
CBs may use remote audit activities for appropriate portions of AIMS audits. The audit plan must
clearly indicate remote activities. Risk analysis must consider client infrastructure, data
sensitivity, and jurisdictional constraints.

---

## 6. Certification Documents

### AIMS Certificate Requirements (8.2.2)

AIMS certification documents must include:
- Name and address of certified organization
- Scope of certification (what is covered)
- **SoA version on which certification is based** — this is unique to AIMS certification
- Statement that the certificate does NOT authorize labelling of products, processes, or services
- CB name, address, and accreditation body reference
- Initial certification date and certificate validity dates

The SoA version requirement is important: it links the certificate to a specific statement of
which controls are included in the AIMS, allowing meaningful comparison between certified organizations.

### Certificate Template

ISO 42006 Annex C provides an example certificate template. CBs may adapt the format while retaining
all required elements.

---

## 7. Selecting a Certification Body

### Evaluation Criteria

For organizations seeking ISO 42001 certification, use these criteria when selecting a CB:

**Accreditation status (non-negotiable):**
- Holds current accreditation from an IAF-member national accreditation body (ANAB, UKAS, DAkkS, etc.)
- Accreditation scope explicitly includes AIMS certification per ISO 42001/42006
- Accreditation is current (not expired, not suspended)

**Impartiality (high importance):**
- No or firewalled consulting services for AIMS implementation
- Documented conflict of interest screening for proposed audit team
- Impartiality committee with independent members

**Technical competence (high importance):**
- Auditors demonstrating all six ISO 42006 domain competencies
- Sector experience relevant to your AI systems and industry
- Technology-specific experience matching your AI system types (ML, LLM, computer vision, etc.)
- References from comparable certifications in your sector

**Process quality (medium importance):**
- Two-stage audit process with meaningful Stage 1 documentation review
- Audit time allocation consistent with Annex A factors (not suspiciously short)
- Remote vs. on-site audit capabilities matched to your needs

**Practical considerations:**
- Geographic reach (multi-site organizations)
- Language capabilities
- Pricing and commercial terms
- CB's track record and market reputation

### Questions to Ask Prospective CBs

1. Are you accredited for AIMS certification per ISO 42006? By which accreditation body?
2. Who will be on our audit team? Can we see their CVs and verify AI experience?
3. Do you provide AIMS implementation consulting? How is separation maintained?
4. How do you calculate audit time for our organization? Walk me through the Annex A factors.
5. Do you have experience certifying organizations with high-risk AI systems in our industry?
6. What is your process for Stage 1 vs. Stage 2? How much of Stage 1 is document review vs. site visit?
7. How do you adapt surveillance to AI-specific risks?
8. What happens if you identify nonconformities during the audit?

---

## 8. Common Findings in CB Assessments

When accreditation bodies evaluate CBs against ISO 42006, common gaps include:

| Finding | Clause |
|---------|--------|
| Auditors lack documented AI-specific experience (< 1 year AI work) | 7.2.2.2 |
| Competence framework doesn't cover all six 7.1.3 domains | 7.1.3 |
| Audit time calculated without applying Annex A AI-specific factors | 9.1.4, Annex A |
| SoA reviewed superficially without challenging scope exclusions | 9.1.3 |
| Certification decisions not demonstrably independent from audit team | 9.5 |
| Surveillance programme doesn't adapt to AI system-specific risks | 9.6.2 |
| Conflict of interest screening doesn't address AI consulting explicitly | 5.2.2 |

---

## 9. Quick Reference

### ISO 42006 at a Glance

| Topic | Key Number |
|-------|-----------|
| Minimum AI experience for auditors | 1 year AI-specific work |
| Total minimum experience | 4 years IT/data protection |
| Management system audits required for team leaders | 3 audits (all stages) |
| Surveillance audit time (relative to initial) | ~1/3 of initial |
| Re-certification audit time (relative to initial) | ≥ 2/3 of initial |
| Certification cycle | 3 years |
| SoA required on certificate | Yes (version reference) |

### Key Documents to Request from a CB

- Accreditation certificate (current)
- Accreditation scope listing ISO 42001 certification
- Proposed audit team CVs with AI experience documentation
- Conflict of interest policy
- Audit time calculation for your organization
- Sample Stage 1 and Stage 2 audit reports from comparable clients

---

## Sources

- ISO/IEC 42006:2025 — Requirements for Bodies Providing Audit and Certification of AIMS
- ISO/IEC 17021-1:2015 — Conformity assessment — Requirements for bodies providing audit and certification of management systems
- ISO/IEC 42001:2023 — AI Management Systems
- IAF MD 26 — AIMS accreditation requirements (where applicable)
- Official URL: https://www.iso.org/standard/44546.html
