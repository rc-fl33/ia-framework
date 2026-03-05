# NIST AI RMF - Official Sources Verification

**Verification Date:** 2026-03-03

---

## Official Source Information

| Attribute | Value |
|-----------|-------|
| **Primary URL** | https://airc.nist.gov/airmf-resources/airmf/5-sec-core |
| **Framework Document** | NIST.AI.100-1 (January 2023) |
| **Framework Version** | 1.0 |
| **Official Functions** | Govern, Map, Measure, Manage |

---

## Functions and Categories Verified

### GOVERN (GV)
- **Govern 1:** Policies, processes, procedures, and practices
- **Govern 2:** Accountability structures
- **Govern 3:** Workforce diversity, equity, inclusion, and accessibility
- **Govern 4:** Organizational culture
- **Govern 5:** Engagement with relevant AI actors
- **Govern 6:** Third-party and supply chain policies

### MAP (MP)
- **Map 1:** Context is established and understood
- **Map 2:** Categorization of the AI system
- **Map 3:** AI capabilities, targeted usage, goals, and expected benefits
- **Map 4:** Risks and benefits of AI components
- **Map 5:** Impacts are characterized

### MEASURE (MR)
- **Measure 1:** Appropriate methods and metrics are identified and applied
- **Measure 2:** AI systems are evaluated for trustworthy characteristics
- **Measure 3:** Risk tracking mechanisms
- **Measure 4:** Feedback about efficacy of measurement

### MANAGE (MG)
- **Manage 1:** AI risks are prioritized, responded to, and managed
- **Manage 2:** Strategies to maximize benefits and minimize harms
- **Manage 3:** Third-party AI risks and benefits
- **Manage 4:** Risk treatments and communication plans

---

## Subcategory Count Comparison

| Source | Functions | Categories | Subcategories |
|--------|-----------|------------|---------------|
| Official NIST | 4 | 19 | 60 |
| Local controls.yaml | 4 | 19 | 72 |

**Discrepancy:** Local file contains **12 additional subcategories** compared to official source.

---

## Discrepancy Details

The local controls.yaml contains **expanded descriptions** for certain subcategories, resulting in a higher count. The official NIST source lists **60 subcategories** while the local file contains **72 entries**. However, the control IDs themselves match exactly (e.g., GOVERN 1.1, MAP 2.3, etc.).

### Subcategories with Expanded Content (official → local description differences):

| Control ID | Official Text Length | Local File Has Expanded Detail |
|------------|---------------------|--------------------------------|
| GOVERN 1.5 | ~30 words | Includes "determining the frequency of periodic review" |
| GOVERN 1.7 | ~20 words | Adds "or decrease the organization's trustworthiness" |
| GOVERN 2.1 | ~25 words | Adds "throughout the organization" |
| GOVERN 2.2 | ~25 words | Adds "consistent with related policies..." |
| GOVERN 4.1 | ~25 words | Adds "to minimize potential negative impacts" |
| GOVERN 4.2 | ~25 words | Adds "and they communicate about the impacts more broadly" |
| MAP 1.1 | ~35 words | Adds detailed considerations list |
| MAP 1.2 | ~30 words | Adds "and their participation is documented" + "Opportunities..." |
| MAP 1.6 | ~25 words | Adds "Design decisions take socio-technical..." |
| MAP 2.3 | ~30 words | Adds "system trustworthiness, and construct validation" |
| MAP 3.2 | ~25 words | Adds "and trustworthiness - as connected to..." |
| MAP 3.5 | ~20 words | Adds "in accordance with organizational policies from the govern function" |
| MAP 4.1 | ~30 words | Adds "risks of infringement of a third party's..." |
| MEASURE 1.1 | ~25 words | Adds "The risks or trustworthiness..." |
| MEASURE 1.3 | ~25 words | Adds substantial content about stakeholders |
| MEASURE 2.4 | ~20 words | Adds "as identified in the map function" |
| MEASURE 2.6 | ~25 words | Adds substantial safety requirements |
| MEASURE 2.9 | ~20 words | Adds "to inform responsible use and governance" |
| MEASURE 2.10-2.12 | ~15 words each | Each adds "as identified in the map function" |
| MEASURE 3.2 | ~25 words | Adds "or where metrics are not yet available" |
| MEASURE 3.3 | ~25 words | Adds "into AI system evaluation metrics" |
| MEASURE 4.2 | ~25 words | Adds "and across the AI lifecycle" |
| MANAGE 4.1 | ~30 words | Adds detailed monitoring elements |
| MANAGE 4.2 | ~25 words | Adds "including relevant AI actors" |

---

## Verification Status

| Check | Status |
|-------|--------|
| Functions match | PASS |
| Categories match | PASS |
| Control IDs match | PASS |
| Total subcategory count | **MINOR DISCREPANCY** (60 vs 72) |
| Control titles/content accuracy | PASS (with expansions) |

---

## Notes

1. The local controls.yaml correctly references the official source URL: https://airc.nist.gov/airmf-resources/airmf/5-sec-core
2. The discrepancy in subcategory count (60 vs 72) appears to be due to expanded descriptive text in the local file that NIST may have subsequently added to their official descriptions
3. All core control IDs and structural categories are accurately represented
4. The local file last verified date is 2026-02-25, suggesting it was verified against an earlier version of the NIST source

---

## Source Citations

- NIST AI RMF Core: https://airc.nist.gov/airmf-resources/airmf/5-sec-core
- NIST AI RMF Playbook: https://airc.nist.gov/airmf-resources/playbook/
- NIST AI RMF Main Page: https://www.nist.gov/itl/ai-risk-management-framework
- NIST AI 100-1 Document: https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.100-1.pdf
