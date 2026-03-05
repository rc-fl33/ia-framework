# Framework Selection Guide

**Practical reference for selecting frameworks, handling overlaps, and understanding domain deduplication in gap analysis engagements.**

---

## Industry Auto-Routing Table

When the advisor agent collects org details during Phase 01, it uses this table to recommend frameworks based on industry:

| Industry | Required | Recommended |
|----------|----------|-------------|
| Healthcare | HIPAA | NIST CSF, SOC2, ISO 27001 |
| Financial | PCI-DSS, FFIEC | NIST CSF, SOC2 |
| Retail | PCI-DSS | NIST CSF, CIS Controls |
| Government | NIST CSF, FedRAMP | NIST 800-53, CIS Controls |
| Technology | SOC2 | NIST CSF, ISO 27001 |
| EU Operations | GDPR | DSA, ISO 27001 |
| Manufacturing | ISO 9001 | NIST CSF, CIS Controls |

Required frameworks are always included. Recommended frameworks are surfaced to the user for confirmation. The user may add frameworks not in the table (e.g., a healthcare org adding PCI-DSS because they process payments).

---

## How Domain Deduplication Works

When multiple frameworks are selected, many controls overlap. A question about access control satisfies both HIPAA's Technical Safeguards and NIST CSF's Protect function. Asking it twice wastes interview time and produces redundant findings.

The `tools/standards/question-merger.ts` tool merges questions by **shared control domain**, not by framework. Each deduplicated question carries control tags for every framework it satisfies.

Example — a single question covers both frameworks:

```yaml
question: "How is access to ePHI systems provisioned, reviewed, and revoked?"
domain: access_control
controls:
  hipaa: ["§164.312(a)(1)", "§164.312(d)"]
  nist-csf: ["PR.AC-1", "PR.AC-4"]
score_applies_to: [hipaa, nist-csf]
```

A single answer populates findings in both `hipaa-findings.md` and `nist-csf-findings.md`.

**Result:** A 3-framework engagement does not triple the interview length. Overlapping domains are asked once; unique domains add incremental questions only.

---

## Single Framework vs. Multiple Frameworks

### Use a single framework when:
- The engagement has a specific audit deadline for one framework (e.g., SOC2 Type II in 60 days)
- The org is in early compliance maturity and a multi-framework report would overwhelm stakeholders
- The scope is narrow (e.g., only the payment environment for PCI-DSS)

### Use multiple frameworks when:
- A regulator or customer requires attestation against more than one standard
- The org wants a unified roadmap that satisfies several compliance obligations in one effort
- A framework pair has high overlap (e.g., ISO 27001 + SOC2) making the combined effort only marginally larger than either alone

---

## Handling Overlapping Frameworks

When two frameworks both cover a control domain, Phase 02 produces findings in both output files but asks the question once. The key rule: **output is framework-native, input is deduplicated.**

| Domain | HIPAA Coverage | NIST CSF Coverage | ISO 27001 Coverage |
|--------|---------------|-------------------|-------------------|
| Access Control | §164.312(a)(1) | PR.AC-1 through PR.AC-7 | A.9 |
| Audit Logging | §164.312(b) | DE.CM-1, DE.CM-7 | A.12.4 |
| Incident Response | §164.308(a)(6) | RS.RP-1 | A.16 |
| Risk Assessment | §164.308(a)(1) | ID.RA | A.6.1.2 |
| Encryption | §164.312(e)(2) | PR.DS-1, PR.DS-2 | A.10 |

When scoring, each framework gets its own compliance score based on the evidence collected. A "Partial" score under NIST CSF does not force a "Partial" score under HIPAA for the same domain — scoring is framework-specific.

---

## Worked Example: Healthcare Org — HIPAA + NIST CSF

**Org:** Acme Health, 200-bed hospital, processes ePHI in EHR and billing systems.

**Step 1 — Industry routing:** Healthcare → HIPAA required, NIST CSF recommended.

**Step 2 — User confirms:** Both HIPAA and NIST CSF selected.

**Step 3 — Merged questionnaire:** `question-merger.ts` loads both manifests. Shared domains (access_control, audit_logging, incident_response, risk_assessment, encryption) produce one question each. HIPAA-unique domains (workforce training, business associates) add HIPAA-only questions. NIST CSF-unique domains (supply chain, recovery planning detail) add NIST-only questions.

**Step 4 — Phase 02 output:**
```
assessment/
├── hipaa-findings.md       # Organized by HIPAA safeguard categories
└── nist-csf-findings.md    # Organized by NIST CSF functions
```

**Step 5 — Deliverables:** `compliance-matrix.md` shows both frameworks side by side. `gap-analysis.md` lists gaps with tags indicating which framework(s) each gap affects. `remediation-roadmap.md` prioritizes items that close gaps in both frameworks simultaneously.

---

## Common Framework Combinations by Use Case

| Use Case | Framework Combination | Rationale |
|----------|-----------------------|-----------|
| Healthcare SaaS vendor | HIPAA + SOC2 | Customer requirement + HIPAA mandate |
| Payment processor | PCI-DSS + SOC2 | Dual customer/regulator requirement |
| Federal contractor | FedRAMP + NIST 800-53 | FedRAMP is built on 800-53 — high overlap |
| EU SaaS startup | GDPR + ISO 27001 | ISO 27001 certification supports GDPR defensibility |
| Hospital system | HIPAA + NIST CSF | HIPAA mandate + NIST CSF for cybersecurity program maturity |
| Financial services | PCI-DSS + FFIEC + SOC2 | Regulatory stack typical for mid-size banks |

---

## How framework_category and manifest.yaml Control Discovery

Each framework in `standards/frameworks/` has a `manifest.yaml`. The skill discovers available frameworks by scanning for these manifests at runtime.

```bash
# List all discoverable frameworks
ls standards/frameworks/*/manifest.yaml
```

Key manifest fields that affect gap analysis behavior:

| Field | Purpose |
|-------|---------|
| `framework_id` | Unique identifier used in output filenames (e.g., `hipaa`) |
| `framework_category` | Groups frameworks for filtering (e.g., `regulatory`, `control-framework`) |
| `domains` | Control domains used for question deduplication |
| `questions_file` | Path to control-tagged questions for Phase 02 |

To add a new framework to the skill, create a `manifest.yaml` in `standards/frameworks/{framework-id}/` following the schema at `standards/frameworks/schema.yaml`. The skill will discover it automatically on next invocation.

---

**Skill:** gap-analysis
**Version:** 1.0 | **Last Updated:** 2026-02-25
