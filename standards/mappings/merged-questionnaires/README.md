# Merged Questionnaires

Pre-merged multi-framework questionnaires for common compliance combinations.

## Purpose

Reduce assessment burden by creating unified questionnaires that satisfy multiple frameworks simultaneously.

## Benefits

**Without merging:**
- HIPAA assessment: 50 questions
- SOC 2 assessment: 60 questions
- Total: 110 questions (with significant overlap)

**With merging:**
- Merged HIPAA + SOC 2: 75 questions
- Reduction: 32% fewer questions
- Same compliance coverage

## How It Works

The question merger identifies overlapping controls across frameworks and consolidates questions:

1. **Map to NIST CSF:** All frameworks map controls to NIST CSF phases
2. **Find overlaps:** Questions addressing same NIST CSF control domain
3. **Merge questions:** Combine into single question covering both frameworks
4. **Track provenance:** Record which frameworks each question satisfies

## Directory Structure

```
merged-questionnaires/
├── README.md                   # This file
├── healthcare.yaml             # HIPAA + HITECH + state laws (future)
├── financial.yaml              # PCI-DSS + FFIEC + SOX (future)
├── ai-ml.yaml                  # AIUC-1 + ISO 42001 + EU AI Act (future)
└── healthcare-example.yaml     # Example merged questionnaire
```

## File Format

```yaml
generated: "2026-02-14T..."
frameworks:
  - hipaa
  - soc2
total_questions: 75

phases:
  GOVERN:
    - id: M-001
      text: "{Merged question text covering both frameworks}"
      category: {category}
      phase: GOVERN
      source_frameworks:           # Which frameworks this question satisfies
        - hipaa
        - soc2
      source_questions:            # Original questions that were merged
        - Q-HIPAA-001
        - Q-SOC2-012
      controls:                    # Controls from all frameworks
        hipaa: "§164.308(a)(1)"
        soc2: "CC1.2"
      evidence_required:           # Combined evidence list
        - {Evidence 1}
        - {Evidence 2}
      scoring:
        full: "{Combined full compliance}"
        partial: "{Combined partial}"
        none: "{Non-compliance}"
      risk_weight: HIGH
```

## Common Combinations

### Healthcare Compliance Portfolio

**Frameworks:** HIPAA + HITECH + state breach notification laws
**Filename:** `healthcare.yaml`
**Use case:** Healthcare organizations need unified assessment

### Financial Services Portfolio

**Frameworks:** PCI-DSS + FFIEC + SOX (if public)
**Filename:** `financial.yaml`
**Use case:** Financial institutions with payment processing

### AI/ML Portfolio

**Frameworks:** AIUC-1 + ISO 42001 + EU AI Act (partial)
**Filename:** `ai-ml.yaml`
**Use case:** AI companies pursuing comprehensive AI governance

### Enterprise SaaS Portfolio

**Frameworks:** SOC 2 + ISO 27001 + GDPR
**Filename:** `enterprise-saas.yaml`
**Use case:** SaaS companies serving international enterprise customers

## Generating Merged Questionnaires

Use the question merger script:

```bash
# Merge two frameworks
bun run scripts/question-merger.ts --frameworks hipaa,soc2 --output mappings/merged-questionnaires/healthcare.yaml

# Merge three frameworks
bun run scripts/question-merger.ts --frameworks aiuc-1,iso-42001,nist-ai-rmf --output mappings/merged-questionnaires/ai-ml.yaml
```

The script:
1. Loads questions.yaml from each framework
2. Calculates similarity scores (NIST CSF overlap, phase, category)
3. Merges questions above threshold (score >= 40)
4. Combines controls, evidence, and scoring
5. Outputs unified questionnaire

## Using Merged Questionnaires

**Agent workflow:**

1. User requests multi-framework assessment: "I need HIPAA and SOC 2"
2. Agent checks for pre-merged questionnaire: `merged-questionnaires/healthcare.yaml`
3. If exists: Load merged questionnaire
4. If not: Dynamically merge using question-merger.ts
5. Conduct single interview covering both frameworks
6. Generate framework-specific compliance matrices from unified responses

## Maintenance

### When to Update

Update merged questionnaires when:
- Any source framework updates (version change)
- Questions added/modified in source frameworks
- New framework added to common combination

### Update Process

1. Check source framework versions
2. Re-run merger: `bun run scripts/question-merger.ts --frameworks {list}`
3. Review diff against previous version
4. Verify no questions lost
5. Update `generated` timestamp
6. Test assessment workflow

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Maintained By:** Compliance Skill
**See Also:**
- `scripts/question-merger.ts` - Question merging script
- `frameworks/README.md` - Framework directory standards
- `mappings/crosswalks/` - Cross-framework control mappings
