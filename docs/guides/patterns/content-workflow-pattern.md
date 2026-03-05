# Content Workflow Pattern: 5-Phase Orchestration

**Classification:** Public (reusable pattern documentation)
**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-04

---

## Overview

The **5-phase content workflow** is a proven pattern for producing high-quality, well-researched, consistently branded content. It's used by multiple skills in the IA Framework and is available for customization and reuse.

---

## The Pattern

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│RESEARCH │────▶│  DRAFT  │────▶│   QA    │────▶│ VISUALS │────▶│ OUTPUT  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     ▼               ▼               ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ GATE: "10+  │ GATE: "Brand│ GATE: "QA   │ GATE: "Images│ GATE: "Format│
│ sources?"   │ voice used?"│ rating 5.0?"│ optional?"   │ exported?"   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: RESEARCH

**Goal:** Gather and validate credible sources to ensure content accuracy

**Inputs:**
- Topic or research brief
- Category or subject domain

**Process:**
1. Identify research directions and keyword strategies
2. Search for credible sources (10+ minimum)
3. Evaluate source quality and relevance
4. Collect citations and key findings
5. Create research notes summarizing findings

**Gate Requirement:** Minimum 10 credible sources documented
- Each source has title, URL, and relevance justification
- Sources span multiple perspectives where applicable
- Quality assessed (no low-authority sources)

**Outputs:**
- `sources.txt` - Full list of sources with citations
- `research-notes.md` - Summary of key findings
- `metadata.json` - Research metadata (dates, keywords, etc.)

**Duration:** 30-60 minutes depending on topic complexity

---

## Phase 2: DRAFT

**Goal:** Write content using customizable brand voice templates

**Inputs:**
- Research notes from Phase 1
- Brand voice template (customizable per project)
- Content standards guide
- Topic or brief

**Process:**
1. Create document structure and outline
2. Write sections using brand voice template
3. Include proper frontmatter (title, date, category, author, etc.)
4. Format headings, lists, and code blocks
5. Add links to research sources
6. Review for logical flow and completeness

**Gate Requirement:** Brand voice consistency verified
- Template applied to tone and perspective
- Sentence variety and paragraph flow acceptable
- Minimum word count (typically 500+ words)
- Formatting complete and scannable

**Brand Voice Template Elements:**
- Perspective (first/second/third person guidelines)
- Tone (conversational, academic, technical, etc.)
- Voice characteristics (professional, accessible, etc.)
- Style guide (terminology, formatting, etc.)
- Examples of good/bad writing

**Outputs:**
- `draft.md` - Complete drafted content
- `metadata.json` - Update with phase completion
- Formatting files (TOC, section markers, etc.)

**Duration:** 1-2 hours depending on content length and complexity

---

## Phase 3: QA (Quality Assurance)

**Goal:** Achieve 5.0/5.0 quality rating through comprehensive validation

**Inputs:**
- Draft from Phase 2
- QA criteria template
- Content standards guide
- Review checklist

**Process:**
1. **Spelling & Grammar** - Check for errors and clarity
2. **Fact Verification** - Cross-check against research sources
3. **Brand Voice** - Verify consistent tone and style throughout
4. **Structure & Flow** - Ensure logical progression and readability
5. **Completeness** - Verify all necessary sections present
6. **Accessibility** - Check for inclusive language and explanations
7. **Links & Citations** - Verify all references work and are cited
8. **Formatting** - Check markdown/HTML rendering correctly

**QA Criteria Template Example:**
```
Content Quality: 1-5 stars
- Is content accurate and well-sourced?
- Are claims supported by research?
- Is tone consistent throughout?

Writing Quality: 1-5 stars
- Is writing clear and accessible?
- Are sentences well-structured?
- Is vocabulary appropriate?

Brand Alignment: 1-5 stars
- Does voice match brand guidelines?
- Is perspective consistent?
- Is tone appropriate for audience?

Structure & Format: 1-5 stars
- Is outline logical and scannable?
- Are headings clear and descriptive?
- Is formatting consistent?

Completeness: 1-5 stars
- Are all important topics covered?
- Are examples provided?
- Are edge cases addressed?

Final Rating: Average of above (must be 5.0/5.0)
```

**Gate Requirement:** 5.0/5.0 rating achieved
- All criteria rated 5 stars (perfect score)
- No exceptions - must retry if gate fails
- Document all feedback and revisions

**Iteration Process:**
1. Run QA and receive feedback
2. Review issues and suggested revisions
3. Update draft to address feedback
4. Re-run QA
5. Repeat until 5.0/5.0 achieved

**Outputs:**
- `qa-review.json` - Detailed QA results and scoring
- `draft.md` (updated) - Revised content
- `metadata.json` - Update with QA completion

**Duration:** 1-2 hours for first QA + iteration time

---

## Phase 4: VISUALS (Optional)

**Goal:** Generate or collect visual assets to enhance content

**Inputs:**
- Content from Phase 3 (QA approved)
- Image style template (optional configuration)
- API credentials (for AI image generation, if used)

**Process:**
1. Identify content that benefits from visuals
2. Determine image types needed (hero image, diagrams, screenshots, etc.)
3. Generate or collect images
4. Verify images enhance understanding
5. Organize images in proper directory

**Image Style Template Elements:**
- Visual aesthetic (minimalist, detailed, colorful, etc.)
- Image types (conceptual diagrams, real photos, charts, etc.)
- Composition guidelines (subject positioning, framing, etc.)
- Color palette (if applicable)
- Quality standards (resolution, file format, etc.)

**Options:**
- **AI Image Generation** - Use API to generate images from prompts
- **Manual Collection** - Use existing images, diagrams, screenshots
- **Skip** - Proceed without images if not beneficial

**Gate Requirement:** Optional
- If images used: properly formatted and relevant
- If skipped: documented in metadata

**Outputs:**
- `images/` directory with generated/collected images
- Image manifest with descriptions
- `metadata.json` - Update with visuals status

**Duration:** 30-60 minutes for AI generation or collection (optional)

---

## Phase 5: OUTPUT

**Goal:** Export final content in requested format(s)

**Inputs:**
- QA-approved content from Phase 3
- Visual assets from Phase 4 (if used)
- Output format specifications
- Metadata from previous phases

**Process:**
1. Determine output format(s) needed
2. Convert content to target format(s)
3. Embed images and formatting
4. Validate output rendering correctly
5. Add metadata to output file
6. Save to output directory

**Supported Formats:**
- **Markdown** (`.md`) - Default, version-control friendly
- **HTML** (`.html`) - Styled web-ready output
- **Plain Text** (`.txt`) - Simple text-only version
- **PDF** (`.pdf`) - Via external tools like /monitor
- **DOCX** (`.docx`) - Via external tools like /monitor
- **Others** - Via integration with other skills

**Gate Requirement:** File exported successfully
- Format renders correctly
- Images embedded properly
- Metadata included
- File saved to correct location

**Outputs:**
- `{topic}.{format}` - Final exported file
- `metadata.json` - Complete workflow metadata
- `distribution.txt` - Instructions for use/sharing

**Duration:** 15-30 minutes

---

## Complete Workflow Timeline

**Total Duration:** 4-6 hours (roughly)

| Phase | Duration | Effort | Skill Level |
|-------|----------|--------|-------------|
| RESEARCH | 30-60 min | Medium | Any |
| DRAFT | 1-2 hours | High | Writer |
| QA | 1-2 hours + iterations | Medium | Reviewer |
| VISUALS | 30-60 min (optional) | Low-Medium | Designer/AI |
| OUTPUT | 15-30 min | Low | Technical |
| **Total** | **4-6 hours** | **Medium-High** | **Writer + Reviewer** |

---

## Error Recovery

| Issue | Recovery |
|-------|----------|
| Fewer than 10 sources | Return to RESEARCH, gather more sources |
| QA rating < 5.0 | Address feedback, revise DRAFT, re-run QA |
| Brand voice inconsistent | Apply brand voice template more carefully, re-run QA |
| Image generation fails | Use pre-made images or skip VISUALS phase |
| Export format unsupported | Use markdown as fallback format |

---

## Implementation Checklist

**Before Starting:**
- [ ] Topic or content brief defined
- [ ] Brand voice template available
- [ ] QA criteria established
- [ ] Output format(s) decided
- [ ] Resources/team assigned

**Phase Gates:**
- [ ] RESEARCH: 10+ sources collected and documented
- [ ] DRAFT: Brand voice applied, 500+ words
- [ ] QA: 5.0/5.0 rating achieved
- [ ] VISUALS: Images present or explicitly skipped
- [ ] OUTPUT: File exported successfully

**Deliverables:**
- [ ] `draft.md` - Final approved content
- [ ] `sources.txt` - Research sources
- [ ] `qa-review.json` - QA validation results
- [ ] `{format}` file - Final export
- [ ] `metadata.json` - Complete workflow metadata

---

## Customization Points

This workflow is designed to be customizable:

1. **Brand Voice Template** - Define your own tone and perspective
2. **QA Criteria** - Set quality standards appropriate for your needs
3. **Content Standards** - Adjust length, structure, and requirements
4. **Image Style** - Configure visual aesthetic if images used
5. **Output Formats** - Choose which formats to generate

---

## Skills Using This Pattern

- **`/write`** (public) - Generic content writing with customizable templates
- **`/ghost`** (private) - Blog publishing with IA Framework voice

Other skills can adopt this pattern for their own content workflows.

---

## Related Documentation

- `docs/guides/patterns/content-writing-architecture.md` - Overview of /write vs /ghost
- `docs/guides/patterns/multi-phase-workflow-pattern.md` - Technical workflow orchestration
- `skills/write/SKILL.md` - Write skill implementation
- `skills/write/templates/` - Customizable templates

---

**Framework:** Intelligence Adjacent (IA)
**Status:** Public pattern documentation
**Reusable:** Yes - other skills can implement this workflow
