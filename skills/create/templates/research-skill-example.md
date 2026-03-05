# Research Skill Example

**Template output for research-oriented skills.**

---

## Example: Career Analysis Skill

### Skill Type
Research & Analysis

### Phase Pattern
DISCOVER → RESEARCH → ANALYZE → VALIDATE → DELIVER

---

## Directory Structure

```
skills/career/
├── SKILL.md                      # Skill definition
├── README.md                     # User documentation
├── STATUS.md                     # Implementation status
├── VERIFY.md                     # Validation checklist
├── commands/
│   └── career.md                 # /career command
├── phases/
│   ├── 01-discover.md            # Requirements gathering
│   ├── 02-research.md            # Data collection (OSINT)
│   ├── 03-analyze.md             # Analysis and synthesis
│   ├── 04-validate.md            # Quality verification
│   └── 05-deliver.md             # Report delivery
├── docs/
│   ├── osint/                    # OSINT resources
│   │   ├── job-boards.md
│   │   ├── company-research.md
│   │   └── industry-analysis.md
│   └── strengths-frameworks.md   # CliftonStrengths, etc.
├── templates/
│   ├── job-analysis-report.md    # Job posting analysis
│   ├── career-report.md          # Full career analysis
│   └── strengths-report.md       # Strengths assessment
├── scripts/
│   └── osint/
│       └── scrape-job-posting.ts # Web scraping utilities
├── input/
│   └── .gitkeep
└── output/
    └── .gitkeep
```

---

## Characteristics

**Research skills typically:**
- Gather data from multiple sources (OSINT, APIs, documents)
- Synthesize findings into insights
- Produce analytical reports
- Require domain expertise (docs/)
- May need web scraping or API integration (scripts/)

---

## Phase Breakdown

### Phase 1: DISCOVER (Requirements)
- What needs to be researched?
- What are the success criteria?
- What data sources are available?

### Phase 2: RESEARCH (Data Collection)
- OSINT techniques
- API queries
- Document analysis
- Web scraping

### Phase 3: ANALYZE (Synthesis)
- Pattern identification
- Gap analysis
- Trend analysis
- Recommendation generation

### Phase 4: VALIDATE (Quality Check)
- Source verification
- Accuracy checks
- Completeness review
- Bias assessment

### Phase 5: DELIVER (Report)
- Format findings
- Generate visualizations
- Create executive summary
- Deliver to output/

---

## Example Output

**File:** `private/output/career/job-analysis-2026-01-19.md`

```markdown
# Job Analysis: Senior Security Engineer at TechCorp

**Date:** 2026-01-19
**Candidate:** [Name]
**GO/NO-GO:** GO (85% match)

## Summary

High-potential role with strong alignment to candidate strengths...

## Requirements Analysis

### Technical Requirements
- Cloud security (AWS/Azure): ✅ MATCH
- Penetration testing: ✅ MATCH
- Compliance frameworks: ⚠️ PARTIAL

### Strength Alignment
- Strategic: ✅ MATCH (Top 5 strength)
- Learner: ✅ MATCH (Top 5 strength)

## Recommendation

PROCEED with application. Address compliance gap in cover letter...
```

---

## When to Use This Pattern

✅ Use for:
- Career analysis
- Threat intelligence
- Market research
- Competitive analysis
- OSINT investigations
- Academic research

❌ Don't use for:
- Simple data retrieval (use tool)
- Real-time monitoring (use automation skill)
- Security testing (use testing pattern)

---

**Version:** 1.0
**Last Updated:** 2026-01-19
