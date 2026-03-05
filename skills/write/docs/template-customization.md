# Template Customization Guide

**How to customize the write skill templates for your brand and content needs**

---

## Overview

The write skill uses four customizable templates that define how content is created and evaluated. Customize these templates to match your brand voice, quality standards, visual style, and QA criteria.

**Templates:**
1. **Brand Voice** - Tone, style, perspective
2. **Content Standards** - Quality and structure requirements
3. **Image Style** - Visual aesthetic and technical specs
4. **QA Criteria** - Quality assurance evaluation

---

## Why Customize Templates?

**Default templates are generic placeholders.** Customizing them ensures:

- ✅ **Consistent brand voice** across all content
- ✅ **Quality standards** that match your requirements
- ✅ **Visual identity** that reflects your brand
- ✅ **QA criteria** aligned with your goals

**Without customization:** Content will be generic and won't reflect your unique brand identity.

**With customization:** Content consistently matches your brand and quality expectations.

---

## Template Locations

All templates are in `skills/write/templates/`:

```
skills/write/templates/
├── brand-voice-template.md       # Voice, tone, style
├── content-standards-template.md # Quality and structure
├── image-style-template.md       # Visual aesthetic
└── qa-criteria-template.md       # QA evaluation
```

---

## Template 1: Brand Voice

**File:** `templates/brand-voice-template.md`

**Purpose:** Define how your content should sound and feel

**Used during:** DRAFT phase (Phase 2)

### Customization Steps

1. **Define voice attributes:**
   - Select 3-5 characteristics (professional, conversational, technical, etc.)
   - Document what each means for your brand

2. **Set tone guidance:**
   - Define tone for different content types (technical docs, blog posts, etc.)
   - Specify what to emphasize and what to avoid

3. **Choose perspective:**
   - When to use first person ("I", "we")
   - When to use second person ("you")
   - When to use third person (objective)

4. **Document style guidelines:**
   - Sentence structure preferences
   - Vocabulary level (accessible vs. technical)
   - Formatting preferences

5. **Add examples:**
   - Paste real examples of good voice (from your content)
   - Paste examples of bad voice (what NOT to do)

### Example Customization

**Before (generic):**
```markdown
**Your brand is:** [Select 3-5 from above or define your own]
```

**After (customized):**
```markdown
**Your brand is:** Professional, Conversational, Educational

We maintain authority while being approachable. We explain complex
concepts clearly without talking down to readers. We use "you" to
engage directly and "we" when sharing our perspective.
```

---

## Template 2: Content Standards

**File:** `templates/content-standards-template.md`

**Purpose:** Define what "good content" means for your brand

**Used during:** DRAFT phase (Phase 2) and QA phase (Phase 3)

### Customization Steps

1. **Select content types:**
   - Focus on types you create most (blog posts, technical docs, guides, etc.)
   - Remove sections for unused content types

2. **Define structure requirements:**
   - Required sections for each content type
   - Preferred organization patterns

3. **Set quality criteria:**
   - Accuracy standards
   - Completeness requirements
   - Clarity expectations

4. **Specify formatting rules:**
   - Code block length limits
   - Table width constraints
   - List formatting preferences

5. **Document common issues:**
   - What to avoid
   - Frequent mistakes
   - Quality red flags

### Example Customization

**Before (generic):**
```markdown
**Length:** [1200-2000 words | 800-1500 words | Target: 1500 words]
```

**After (customized):**
```markdown
**Length:** Target 1500-2000 words

Shorter if topic is narrow (minimum 800 words). Longer for comprehensive
guides (up to 3000 words). Focus on value delivered, not arbitrary word count.
```

---

## Template 3: Image Style

**File:** `templates/image-style-template.md`

**Purpose:** Define visual aesthetic for AI-generated images

**Used during:** VISUALS phase (Phase 4)

### Customization Steps

1. **Select aesthetic style:**
   - Minimalist, technical, illustrative, photorealistic, etc.
   - Document what this looks like

2. **Define color palette:**
   - Primary colors with hex codes
   - Secondary/accent colors
   - Background preferences

3. **Set composition guidelines:**
   - Orientation (landscape, portrait, square)
   - Focal point preferences
   - Spacing and layout

4. **Specify technical requirements:**
   - Resolution (1920x1080, etc.)
   - Aspect ratio (16:9, etc.)
   - File format (PNG, JPG)

5. **Create example prompts:**
   - Show good prompts that produce desired results
   - Show bad prompts to avoid

### Example Customization

**Before (generic):**
```markdown
**Your style:** [Select 1-2 from above or define custom]
```

**After (customized):**
```markdown
**Your style:** Technical/Diagrammatic + Minimalist

Clean, precise diagrams with clear labels and flow indicators. Use
minimal color (blue and gray palette). White backgrounds. Isometric
perspective for architecture diagrams. Flat 2D for flowcharts.
```

---

## Template 4: QA Criteria

**File:** `templates/qa-criteria-template.md`

**Purpose:** Define how content quality is evaluated

**Used during:** QA phase (Phase 3)

### Customization Steps

1. **Select core criteria:**
   - Choose 5-8 most important criteria for your content
   - Remove or add criteria as needed

2. **Define rating standards:**
   - What does a "5" mean for each criterion?
   - What causes a "3" (block) rating?

3. **Set critical blockers:**
   - What auto-fails content?
   - What requires immediate revision?

4. **Document specialized criteria:**
   - SEO requirements (if applicable)
   - Legal compliance (if needed)
   - Domain-specific standards

5. **Create verification checklists:**
   - Step-by-step review process
   - Claim verification standards

### Example Customization

**Before (generic):**
```markdown
### 1. Brand Voice & Tone Consistency
**Evaluation questions:**
- [ ] Does the content match the brand voice template?
```

**After (customized):**
```markdown
### 1. Brand Voice & Tone Consistency
**Evaluation questions:**
- [ ] Professional yet conversational tone throughout?
- [ ] "You" used for direct instruction, "we" for shared perspective?
- [ ] No academic jargon without clear explanation?
- [ ] Technical precision without condescension?
```

---

## Customization Workflow

### First-Time Setup

**Step 1: Review default templates**
- Read all four templates
- Understand structure and purpose

**Step 2: Gather examples**
- Collect examples of your best content
- Note what makes them good
- Identify voice, style, quality patterns

**Step 3: Customize each template**
- Work through one template at a time
- Fill in all [placeholder] sections
- Add your examples

**Step 4: Test on real content**
- Use `/write` skill with customized templates
- Evaluate if content matches expectations
- Refine templates based on results

**Step 5: Iterate**
- Templates are living documents
- Update as brand evolves
- Refine based on team feedback

### Ongoing Maintenance

**When to update templates:**
- Brand voice evolves
- New content types added
- Quality standards change
- Team provides feedback
- Common issues identified

**How often to review:**
- Quarterly review recommended
- After major brand changes
- When quality issues emerge

---

## Template Versioning

**Track template changes:**

At bottom of each template:
```markdown
**Version:** 2.1
**Last Updated:** 2026-01-20
**Owner:** Content Team
**Changelog:**
- 2.1 (2026-01-20): Added SEO criteria to QA template
- 2.0 (2026-01-15): Major voice update for brand refresh
- 1.0 (2026-01-01): Initial customization
```

**Benefits:**
- Track evolution over time
- Identify who's responsible
- Document major changes
- Roll back if needed

---

## Collaboration Tips

### Team Customization

**If multiple people use the write skill:**

1. **Designate template owner:**
   - One person/team maintains templates
   - Others provide feedback

2. **Document decisions:**
   - Why specific choices were made
   - Rationale for standards

3. **Create shared examples:**
   - Build library of good/bad examples
   - Reference real content

4. **Regular reviews:**
   - Team reviews templates quarterly
   - Update based on collective experience

### Getting Buy-In

**How to get team adoption:**

1. **Show before/after:**
   - Run `/write` with generic templates
   - Run `/write` with customized templates
   - Compare quality and brand alignment

2. **Start small:**
   - Customize brand voice first
   - Add other templates incrementally
   - Build confidence gradually

3. **Gather feedback:**
   - Ask team what's working
   - Adjust based on real usage
   - Iterate collaboratively

---

## Common Customization Patterns

### For Technical Documentation

**Brand Voice:**
- Professional, precise, educational
- Second person ("you") for instructions
- Active voice preferred

**Content Standards:**
- Code examples mandatory
- Step-by-step structure required
- Verification steps essential

**QA Criteria:**
- Technical accuracy highest priority
- All code tested and working
- Clear prerequisites stated

### For Blog Posts/Articles

**Brand Voice:**
- Conversational, engaging, authoritative
- Mix of first and second person
- Storytelling elements

**Content Standards:**
- Hook opening required
- Original insights mandatory
- 1500-2000 word target

**QA Criteria:**
- Originality over accuracy
- Engagement metrics important
- SEO optimization considered

### For Instructional Content

**Brand Voice:**
- Patient, clear, encouraging
- Second person throughout
- Simple vocabulary

**Content Standards:**
- Numbered steps required
- Examples for each concept
- Troubleshooting section mandatory

**QA Criteria:**
- Clarity and accessibility top priority
- No assumed knowledge gaps
- Tested with beginner users

---

## Troubleshooting

### Content Doesn't Match Brand

**Problem:** Generated content doesn't sound like your brand

**Solutions:**
1. Review brand voice template - is it specific enough?
2. Add more examples of good/bad voice
3. Document voice characteristics more explicitly
4. Test with short content first, refine template

### QA Always Fails

**Problem:** Content never achieves 5.0/5.0 rating

**Solutions:**
1. Check if QA criteria are too strict
2. Ensure criteria align with content standards
3. Review claim verification process
4. Adjust rating scale if needed

### Images Don't Match Style

**Problem:** Generated images don't match visual identity

**Solutions:**
1. Make image style template more specific
2. Include exact hex codes for colors
3. Provide more detailed prompt examples
4. Adjust aesthetic description

---

## Advanced Customization

### Multiple Template Sets

**Use case:** Different brands or product lines

**Approach:**
- Create template subdirectories: `templates/brand-a/`, `templates/brand-b/`
- Specify which set to use when invoking `/write`
- Maintain separate QA standards per brand

### Context-Specific Templates

**Use case:** Different standards for different audiences

**Approach:**
- Create audience-specific sections in templates
- "For beginners:", "For experts:", etc.
- Specify target audience when using `/write`

### Integration with Style Guides

**Use case:** Existing brand style guides

**Approach:**
- Reference style guide in templates
- Extract key principles into templates
- Link to full style guide for details
- Keep templates as executable summaries

---

## Resources

### Example Customizations

**See these skills for customization examples:**
- `skills/ghost/` - Blog-specific customization
- `skills/advisory/` - Professional services voice
- `skills/pentest/` - Technical security content

### Further Reading

- Framework `docs/brand-voice-standards.md` (if exists)
- Framework `docs/content-quality-guidelines.md` (if exists)
- External resources on brand voice development

---

**Version:** 1.0
**Last Updated:** 2026-01-20
**Framework:** IA Write Skill
