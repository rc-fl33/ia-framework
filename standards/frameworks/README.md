# Compliance Frameworks Directory

This directory contains framework-specific content for all compliance frameworks supported by the IA compliance skill. Each framework is isolated in its own subdirectory with a standardized structure.

## Directory Structure

```
frameworks/
├── README.md                    # This file
├── STATUS.md                    # Framework completion tracking
├── schema.yaml                  # Question schema definition
├── aiuc-1/                      # AIUC-1 AI Unified Controls
├── nist-csf/                    # NIST Cybersecurity Framework
├── iso-27001/                   # ISO 27001 Information Security
├── dsa/                         # EU Digital Services Act
└── ...                          # Additional frameworks
```

## Framework Discovery

**Canonical index:** See `INDEX.md` for the complete list of all frameworks with paths, tiers, and skill usage.

For quick lookup: `standards/frameworks/INDEX.md`

## Framework Maturity Tiers

Frameworks are classified by maturity level (Tier 1-3) based on available content:

### Tier 1: Full Assessment Ready
- **Controls:** Structured `controls.yaml` with all requirements
- **Questions:** Complete `questions.yaml` with scoring criteria
- **Documentation:** Handbook, implementation guide, certification guide (if applicable)
- **Templates:** Framework-specific templates (assessment, deliverables, policies)
- **Status:** Ready for full compliance assessments

**Current Tier 1 frameworks:** AIUC-1

### Tier 2: Partial Support
- **Controls:** Structured `controls.yaml`
- **Questions:** Basic `questions.yaml`
- **Documentation:** Minimal (basic reference or metadata only)
- **Templates:** May share generic templates
- **Status:** Suitable for gap analysis, not full assessment

**Current Tier 2 frameworks:** NIST CSF, ISO 27001, PCI-DSS, HIPAA, SOC 2, FedRAMP, CIS Controls v8, DSA

### Tier 3: Metadata Only
- **Controls:** May have basic `metadata.yaml`
- **Questions:** Not available
- **Documentation:** None
- **Templates:** None
- **Status:** Reference only, used in crosswalks

**Current Tier 3 frameworks:** ISO 42001, NIST AI RMF, OWASP LLM Top 10, MITRE ATLAS, CSA AICM, EU AI Act, GDPR

## Required Directory Structure (Tier 1)

Every Tier 1 framework MUST have this structure:

```
frameworks/{framework-id}/
├── manifest.yaml               # Discovery metadata (REQUIRED)
├── metadata.yaml               # Version, dates, source (REQUIRED)
├── controls.yaml               # Control definitions (REQUIRED)
├── questions.yaml              # Assessment questions (REQUIRED)
├── docs/                       # Framework documentation
│   ├── handbook.md             # Practitioner guide (Tier 1-2)
│   ├── implementation-guide.md # Gap closure steps (Tier 1)
│   ├── certification-guide.md  # Audit prep (if certifiable)
│   └── reference.md            # Quick reference (optional)
└── templates/                  # Framework-specific templates
    ├── assessment/             # Assessment folder structure
    ├── deliverables/           # Framework-specific deliverables
    ├── engagement-rules/       # Framework-specific engagement rules
    ├── interview-guide.md      # Stakeholder interview guide
    └── policies/               # Framework-specific policies (if any)
```

## Framework Isolation Principle

**Each framework directory contains ONLY content specific to that framework.** This ensures:

1. **No cross-framework pollution:** AIUC-1 handbook doesn't reference ISO 42001 control IDs
2. **Framework portability:** Can extract a single framework directory for external use
3. **Clear ownership:** Framework maintainer owns everything in frameworks/{id}/
4. **Mapping separation:** All cross-framework mappings live in `mappings/crosswalks/`

### What Goes Where

**In frameworks/{id}/ (framework-specific):**
- Control definitions for THIS framework
- Questions mapped to THIS framework's controls only
- Handbook explaining THIS framework in isolation
- Templates specific to THIS framework's requirements

**In mappings/crosswalks/ (cross-framework):**
- Control-to-control mappings between frameworks
- Confidence levels and evidence for mappings
- Gap analysis support data

**In templates/ (generic):**
- Templates applicable to ANY framework
- Base assessment structure
- Generic deliverables
- Generic policies (27 core security policies)

## File Format: questions.yaml

Assessment questions must be **framework-agnostic**. Control mappings include ONLY this framework's IDs:

```yaml
questions:
  - id: Q-AIUC1-A001
    text: "Has the organization established AI input data policies?"
    controls:
      aiuc-1: "A001"           # ONLY this framework - no external refs
    evidence_required:
      - "Input data usage policy"
    scoring:
      full: "Documented policy with opt-out mechanisms"
      partial: "Policy exists but lacks opt-out"
      none: "No formal policy"
```

**Cross-framework mappings belong in `mappings/crosswalks/{framework-id}.yaml`, NOT here.**

## Adding New Frameworks

See `STATUS.md` for framework completion tracking. Quick checklist:

1. Create `frameworks/{framework-id}/` directory
2. Add required files: manifest.yaml, metadata.yaml, controls.yaml, questions.yaml
3. Create docs/handbook.md (framework overview + control reference)
4. Extract crosswalks: `bun run scripts/extract-crosswalks.ts`
5. Test assessment workflow
6. Update STATUS.md with framework tier

## Maintenance

### Updating Frameworks

When a framework releases a new version:

1. Update metadata.yaml (version, dates)
2. Update controls.yaml (add/modify/remove controls)
3. Update questions.yaml (align with new structure)
4. Regenerate crosswalks: `bun run scripts/extract-crosswalks.ts`
5. Update handbook and implementation guide
6. Test assessment workflow

### Quarterly Review

For Tier 1 frameworks:
- Review framework release notes
- Check `next_review` date in metadata.yaml
- Verify crosswalk mappings still accurate
- Update documentation if needed

## Common Issues

**Cross-Framework Pollution:** Handbook contains inline references to other frameworks
→ Move to `mappings/crosswalks/`, keep handbook agnostic

**Outdated Mappings:** Framework updated but crosswalks not refreshed
→ Set `next_review` date, run quarterly review

**Template Duplication:** Same template in multiple framework directories
→ Move to generic `templates/`, keep only framework-specific overrides

---

**Version:** 1.0
**Last Updated:** 2026-02-14
**Maintained By:** Compliance Skill
**See Also:**
- `STATUS.md` - Framework completion matrix
- `INDEX.md` - Complete framework list with paths, tiers, and skill usage
- `../mappings/README.md` - Cross-framework mappings
