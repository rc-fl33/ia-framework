# Compliance Framework Mappings

This directory contains cross-framework control mappings for compliance analysis, gap assessment, and evidence reuse.

## Directory Structure

```
mappings/
├── README.md                           # This file
├── crosswalk.yaml                      # Domain-based aggregate mappings
├── industry-frameworks.yaml            # Industry compliance requirements
└── crosswalks/                         # Per-framework control mappings
    ├── aiuc-1.yaml                     # AIUC-1 → external frameworks
    ├── nist-csf.yaml                   # (future) NIST CSF → external frameworks
    ├── iso-27001.yaml                  # (future) ISO 27001 → external frameworks
    └── ...
```

## Mapping Types

### 1. Per-Framework Crosswalks (`crosswalks/`)

**Purpose:** Granular control-to-control mappings from a source framework to all related external frameworks.

**Structure:** One file per source framework, containing mappings for each control in that framework.

**Example:** `crosswalks/aiuc-1.yaml`
```yaml
framework: aiuc-1
version: "1.0"
mappings:
  - control: A001
    title: "Establish input data policy"
    external_mappings:
      iso-42001: ["A.7.2", "A.7.3"]
      nist-ai-rmf: ["MEASURE 2.10"]
      eu-ai-act: ["Article 11"]
    confidence: high
    evidence: ["AIUC-1 official questions.yaml v1.0"]
```

**Use cases:**
- Multi-framework gap analysis: "We have ISO 27001 A.8.5; does this satisfy AIUC-1 A001?"
- Evidence reuse: "This test report satisfies NIST CSF PR.AA-01; what AIUC-1 controls does it cover?"
- Certification planning: "We need AIUC-1 certification; which existing controls can we leverage?"

### 2. Domain-Based Aggregate Mappings (`crosswalk.yaml`)

**Purpose:** High-level conceptual mappings between control domains across frameworks.

**Structure:** Organized by security/compliance domains (access control, data protection, AI safety, etc.)

**Example:**
```yaml
ai_security_safety:
  - id: AI-DATA-PRIVACY
    description: "AI data privacy and IP protection"
    mappings:
      aiuc-1: "A001, A002, A003, A004, A005, A006, A007"
      nist-ai-rmf: "MEASURE 2.10, MAP 1.5"
      iso-42001: "A.7.2, A.7.3, A.7.5"
```

**Use cases:**
- Control grouping: "Which AIUC-1 controls address data privacy?"
- Domain coverage: "Do we have complete coverage of AI adversarial robustness?"
- Policy mapping: "Which policy template covers these domains?"

### 3. Industry Requirements (`industry-frameworks.yaml`)

**Purpose:** Maps industries to required/recommended compliance frameworks.

**Structure:** Industry → frameworks with priority levels

**Use cases:**
- Framework selection: "We're a healthcare SaaS company; which frameworks apply?"
- Scope determination: "Financial services in EU requires which frameworks?"

## Agent Workflow Patterns

### Pattern 1: Multi-Framework Assessment

**Scenario:** Organization needs HIPAA + SOC 2 compliance

**Agent workflow:**
1. Load `frameworks/hipaa/questions.yaml` and `frameworks/soc2/questions.yaml`
2. Load `crosswalks/hipaa.yaml` and `crosswalks/soc2.yaml` (when available)
3. Identify overlapping controls for de-duplication
4. Generate merged questionnaire

### Pattern 2: Gap Analysis with Control Credit

**Scenario:** Organization has ISO 27001, wants to add AIUC-1

**Agent workflow:**
1. Load organization's ISO 27001 control status
2. Load `crosswalks/aiuc-1.yaml`
3. For each AIUC-1 control, check if mapped ISO 27001 controls are implemented
4. Calculate gap: AIUC-1 controls with no ISO 27001 coverage = net-new work

**Example:**
- AIUC-1 A001 maps to ISO 27001 A.7.2, A.7.3
- If org already implements A.7.2 and A.7.3 → partial credit for A001
- Reduces assessment scope from 51 to ~30 net-new controls

### Pattern 3: Evidence Reuse

**Scenario:** Evidence collected for one framework applies to another

**Agent workflow:**
1. Organization uploads penetration test report for SOC 2
2. Agent loads `crosswalks/soc2.yaml` and `crosswalks/aiuc-1.yaml`
3. Identifies SOC 2 controls the evidence satisfies
4. Maps those to AIUC-1 controls via crosswalks
5. Marks AIUC-1 controls as "evidence available" in compliance matrix

## Maintenance

### Adding New Framework Crosswalks

When adding a new framework to Tier 1 quality:

1. **Create framework directory:** `frameworks/{framework-id}/`
2. **Create questions.yaml:** Include only `{framework-id}:` in controls blocks
3. **Extract crosswalks:** Run extraction script to generate `crosswalks/{framework-id}.yaml`
4. **Update industry mappings:** Add framework to `industry-frameworks.yaml` if applicable
5. **Optional - Add aggregate mappings:** Update `crosswalk.yaml` domain mappings

### Updating Existing Crosswalks

When framework versions change:

1. Update `frameworks/{id}/questions.yaml` with new control IDs
2. Re-run extraction: `bun run scripts/extract-crosswalks.ts`
3. Review diff: Verify no mappings lost
4. Update `version:` field in crosswalk file
5. Update `last_updated:` date

## File Format Standards

### Crosswalk YAML Structure

```yaml
framework: {framework-id}        # Source framework
version: "{version}"             # Framework version
description: "{description}"     # Brief description
last_updated: YYYY-MM-DD         # Last update date

mappings:
  - control: {control-id}        # Source framework control ID
    title: "{brief title}"       # Concise control title
    external_mappings:           # Maps to other frameworks
      {framework}: ["{id}", ...]
    confidence: high|medium|low  # Mapping confidence
    evidence: ["{source}"]       # Evidence for mapping
    notes: "{context}"           # Additional context
```

### Confidence Levels

- **high:** Direct equivalence - controls have same intent and scope
- **medium:** Similar intent, minor scope differences
- **low:** Related but different scope or approach

## Common Pitfalls

1. **Bidirectional consistency:** Mappings should be symmetric
   - If `aiuc-1.yaml` says A001 → ISO 27001 A.7.2
   - Then `iso-27001.yaml` should say A.7.2 → AIUC-1 A001
   - Validation script checks this

2. **Version drift:** Framework versions change, mappings become stale
   - Always include version fields
   - Document last_updated date
   - Re-validate on major version changes

3. **Overstating confidence:** Marking mappings as "high" when scope differs
   - Be conservative: use "medium" when uncertain
   - Document scope differences in notes

4. **Missing reciprocal mappings:** Control A maps to B, but B doesn't map back to A
   - All mappings should be bidirectional
   - Document one-way relationships in notes if intentional

## Tools

- **Extract crosswalks:** `bun run scripts/extract-crosswalks.ts`
- **Clean questions:** `bun run scripts/clean-questions.ts`
- **Merge questions:** `bun run scripts/question-merger.ts --frameworks {list}`
- **Validate mappings:** (TODO) `bun run scripts/validate-crosswalks.ts`

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Maintained By:** Compliance Skill
