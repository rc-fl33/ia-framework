# Framework Enrichment Guide

## Purpose

This guide documents the standard process for adding a new compliance framework to the IA compliance skill family. Following this guide produces data files that meet the T3/T4 enrichment tier specification, making frameworks assessable and cross-mapped.

## Enrichment Tier Reference

| Tier | Name | Files Required | Criteria |
|------|------|----------------|----------|
| T0 | Pending | none | No source document |
| T1 | Structural | manifest.yaml + metadata.yaml + controls.yaml | All controls defined |
| T2 | Assessable | T1 + questions.yaml | Domain-tagged, scored, evidence items |
| T3 | Cross-mapped | T2 + crosswalk.yaml | ≥5 external framework mappings per question |
| T4 | Production | T3 + implementation steps | Verified dates, ≥2 sources, impl guidance |

Run `bun run tools/standards/enrich-pipeline.ts status` to check current tiers.

---

## Step 1: Acquisition

Obtain the official standard document before beginning any extraction or normalization work.

**Actions:**
- Obtain the official standard PDF from the issuing body
- Place in: `standards/frameworks/{provider}/{id}/docs/`
- Record acquisition method in `metadata.yaml` (URL, purchase date, version)

**Notes:**
- Some standards require purchase from ISO.org; others are freely available (NIST, CIS, OWASP)
- For ISO standards, the purchase receipt or license URL should be recorded in `verified_by`
- Multi-part standards (e.g., split PDFs) can be merged during extraction — see Step 2

**Directory example:**
```
standards/frameworks/iso/42001/docs/
└── ISO-IEC-42001-2023.pdf
```

---

## Step 2: Extraction

Extract structured control data from the source document.

**Command:**
```bash
python tools/pdf-extract/extract.py --framework {id}
```

**Actions:**
- Run extraction against the acquired PDF
- Verify that the extracted control count matches the official specification
- Output lands in: `standards/frameworks/{provider}/{id}/docs/extracted/controls-draft.yaml`

**For multi-part PDFs:**
```bash
python tools/pdf-extract/extract.py \
  --pdf part1.pdf --pdf part2.pdf \
  --framework {id} \
  --output path/extracted/ --merge
```

**Common issue:** PDF extraction may miss tables. Annex sections with tabular control lists are particularly prone to missed rows. Manually review the `controls-draft.yaml` output against the source document's table of contents and control count.

---

## Step 3: Controls Normalization

Import the extracted draft and normalize controls into the framework's YAML structure.

**Command:**
```bash
bun run tools/standards/enrich-pipeline.ts import-draft {id}
```

**Actions:**
- Review `nist_phase` assignments — verify alignment against the framework's native category structure
- Add implementation guidance where available (Annex B, informative notes, or published guidance documents)
- Verify that the control count in the output matches the `total_controls` field in `manifest.yaml`

**What to check:**
- Control IDs follow the framework's native numbering scheme (e.g., A.5.1, Clause 8.2)
- Phase assignments reflect actual framework domain intent, not generic mappings
- Missing controls from table extraction are manually added

---

## Step 4: Questions Scaffold

Generate assessment questions from the normalized controls.

**Command:**
```bash
bun run tools/standards/enrich-pipeline.ts gen-questions {id}
```

**Actions:**
- Review domain tags assigned to each question
- Verify question groupings (target 2–5 controls per question)
- Enrich manually: add sub-questions, evidence items, and scoring rubrics
- The scaffold auto-populates crosswalk controls from available mapping data; human review upgrades `confidence: auto` entries to `confidence: high` where direct equivalence is confirmed

**Minimums for tier advancement:**
- T2 requires questions with domain tags, scoring criteria, and evidence items
- T3 requires ≥5 external framework mappings per question

---

## Step 5: Crosswalk Build

Generate cross-framework control mappings.

**Command:**
```bash
bun run tools/standards/enrich-pipeline.ts gen-crosswalk {id}
```

**Actions:**
- Auto-generated mappings are assigned `confidence: medium` by default
- Human review: upgrade to `confidence: high` when direct equivalence is confirmed against both standards
- Target crosswalk frameworks depend on the standard's domain (see Crosswalk Targets by Domain below)

**Output file:** `standards/frameworks/{provider}/{id}/crosswalk.yaml`

---

## Step 6: Validation

Validate the framework data against the schema before integration.

**Command:**
```bash
bun run tools/standards/enrich-pipeline.ts validate {id}
```

**Actions:**
- Fix all errors before proceeding to Step 7
- Warnings should be reviewed and addressed for T3+; they block T4 advancement
- Review output report for missing fields, malformed IDs, or incomplete scoring criteria

**Output:** `docs/validation/{id}-validation-report.yaml`

---

## Step 7: Integration

Register the framework with the compliance skill and verify end-to-end operation.

**Actions:**
- Update `standards/frameworks/industry-frameworks.yaml` with framework routing entry
- Update `manifest.yaml enrichment_status.tier` to reflect the achieved tier
- Add the framework to `tools/standards/question-merger.ts` config if it has reached T2 (assessable)
- Test by running `/compliance` and selecting the new framework

**Verification checklist:**
- Framework appears in skill selection menu
- Questions load without errors
- Crosswalk mappings resolve correctly
- `enrich-pipeline.ts status` shows the correct tier

---

## Crosswalk Targets by Domain

When building crosswalks, prioritize mappings against frameworks in the same domain family. Minimum target is ≥5 mappings per question for T3.

### Security (ISMS)
Primary: ISO 27001, NIST CSF, NIST 800-53, CIS Controls v8, SOC 2
Secondary: PCI DSS, FedRAMP, HIPAA

### Quality Management Systems (QMS)
Primary: ISO 9001, ISO 13485, ISO 27001, NIST CSF, SOC 2
Secondary: NIST 800-53, CIS Controls v8

### AI Governance
Primary: ISO 42001, NIST AI RMF, EU AI Act, OWASP LLM Top 10, MITRE ATLAS
Secondary: ISO 42005, ISO 24028, AIUC-1, CSA AICM

### Regulatory / Privacy
Primary: GDPR, HIPAA, NIST Privacy Framework, ISO 27001
Secondary: NIST CSF, SOC 2, FedRAMP

### Audit / Methodology
Primary: ISO 19011, ISO 27001, ISO 9001, ISO 42001
Secondary: NIST CSF (Govern function), SOC 2

---

## Common Issues

### PDF Extraction Gaps

**Symptom:** Extracted control count is lower than the official specification.

**Cause:** Tables in Annex sections are frequently missed by text extraction tools. Multi-column layouts and merged cells are common failure points.

**Resolution:**
1. Compare extracted control count against the standard's official table of contents
2. Manually add missing controls to `controls-draft.yaml` before running `import-draft`
3. For split-PDF standards, ensure all parts are passed with `--merge` during extraction

---

### Missing Control IDs

**Symptom:** Controls appear in the YAML without IDs, or IDs use placeholder values.

**Cause:** Extraction tools generate stubs when clause numbers are not detected. Informative (non-normative) sections may be included without proper clause IDs.

**Resolution:**
1. Cross-reference each stub against the source document
2. Assign the correct clause or annex reference (e.g., `A.7.2`, `Clause 8.3`)
3. Remove purely informative content that does not constitute a control requirement

---

### Crosswalk Confidence Levels

**Symptom:** All mappings remain at `confidence: medium` after generation.

**Cause:** Auto-generated mappings are based on semantic similarity and should not be promoted to `high` without human verification.

**Resolution:**
1. Open both standards side by side (or their extracted YAML)
2. Confirm that the mapped controls address the same requirement intent
3. Upgrade to `confidence: high` only when direct equivalence is confirmed
4. Leave `confidence: medium` for approximate mappings — these are still valid for T3

---

### Question Count Validation Failures

**Symptom:** `validate` command reports insufficient question count for the target tier.

**Cause:** T2 advancement requires a minimum question set with complete scoring rubrics and evidence items. Scaffolded questions that lack sub-questions or evidence lists fail validation.

**Resolution:**
1. Run `enrich-pipeline.ts validate {id}` and review the validation report
2. For each failing question, add: at least one evidence item, scoring criteria for full/partial/none, and at least one sub-question
3. Re-run validation before proceeding to Step 7

---

## Tier Advancement Checklist

### T0 → T1 (Structural)

- [ ] Source document acquired and placed in `docs/`
- [ ] `manifest.yaml` created with correct metadata
- [ ] `controls.yaml` generated and all controls defined
- [ ] Control count verified against official specification
- [ ] `enrichment_status.tier: 1` set in manifest

### T1 → T2 (Assessable)

- [ ] `questions.yaml` generated from `gen-questions`
- [ ] All questions have domain tags assigned
- [ ] All questions have scoring criteria (full/partial/none)
- [ ] All questions have at least one evidence item
- [ ] Sub-questions added for complex topics
- [ ] `enrichment_status.tier: 2` set in manifest

### T2 → T3 (Cross-mapped)

- [ ] `crosswalk.yaml` generated from `gen-crosswalk`
- [ ] Each question has ≥5 external framework mappings
- [ ] High-confidence mappings reviewed and upgraded from `medium`
- [ ] Crosswalk targets cover the appropriate domain family
- [ ] Validation passes with no errors
- [ ] `enrichment_status.tier: 3` set in manifest

### T3 → T4 (Production)

- [ ] Implementation steps added to `controls.yaml` for all controls
- [ ] `verified_by` contains ≥2 authoritative source URLs
- [ ] `last_verified` date reflects current review
- [ ] `next_check` date set (typically 12 months)
- [ ] All validation warnings resolved
- [ ] Framework tested end-to-end via `/compliance`
- [ ] `enrichment_status.tier: 4` set in manifest
