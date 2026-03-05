# Content Standards Template

**Customize this template to define quality and structure standards for your content.**

---

## Overview

This template defines what "good content" means for your brand. Customize standards for different content types.

**Purpose:** Ensure consistent quality across all content
**Usage:** Reference during DRAFT and QA phases

---

## Universal Content Standards

**These standards apply to ALL content types:**

### Accuracy
- [ ] All factual claims verified against sources
- [ ] No outdated information
- [ ] Technical details correct and tested
- [ ] Data and statistics properly cited

### Completeness
- [ ] All required sections present
- [ ] No placeholder content (TODO, TBD)
- [ ] Questions answered thoroughly
- [ ] Clear conclusion or takeaway

### Clarity
- [ ] Accessible to target audience (90%+ comprehension)
- [ ] Concepts explained without jargon (or jargon defined)
- [ ] Logical flow from intro to conclusion
- [ ] Transitions between sections smooth

### Formatting
- [ ] Headers hierarchical and descriptive
- [ ] Lists and tables well-formatted
- [ ] Code blocks under 25 lines (split if longer)
- [ ] No horizontal scroll (line length limits)
- [ ] Consistent styling throughout

### Source Attribution
- [ ] 10+ credible sources validated
- [ ] All sources cited properly
- [ ] URLs accessible and accurate
- [ ] No unsupported assertions

---

## Content Type Specific Standards

### Technical Documentation

**Structure:**
- Introduction with purpose and audience
- Prerequisites section (if applicable)
- Step-by-step instructions (numbered)
- Code examples with context
- Troubleshooting section
- Related resources

**Quality criteria:**
- [ ] All code examples tested and working
- [ ] Commands include expected output
- [ ] Error messages explained
- [ ] Alternative approaches mentioned
- [ ] Version compatibility noted

**Length:** [1000-3000 words | As needed | Target: 1500 words]

---

### Blog Posts/Articles

**Structure:**
- Hook (question, bold statement, problem framing)
- Context (why it matters)
- Main content (2-5 key points)
- Examples or case studies
- Conclusion with takeaway
- Call to action or next steps

**Quality criteria:**
- [ ] Opening grabs attention
- [ ] Original insights (not just rehashing sources)
- [ ] Practical applications provided
- [ ] Real-world examples included
- [ ] Scannable (headers, lists, emphasis)

**Length:** [1200-2000 words | 800-1500 words | Target: 1500 words]

---

### Installation/Setup Guides

**Structure:**
- Overview (what's being installed)
- Prerequisites checklist
- Step-by-step installation
- Verification steps
- Troubleshooting common issues
- Next steps

**Quality criteria:**
- [ ] Every step numbered and clear
- [ ] Expected output shown for verification
- [ ] Multiple platforms covered (if applicable)
- [ ] Common errors documented
- [ ] Success criteria defined

**Length:** [As needed for completeness | Target: 1000-1500 words]

---

### API Documentation

**Structure:**
- Endpoint overview
- Authentication requirements
- Request format (parameters, headers, body)
- Response format (success, errors)
- Code examples (multiple languages if possible)
- Rate limits and constraints

**Quality criteria:**
- [ ] All parameters documented (required vs optional)
- [ ] Example requests include all common use cases
- [ ] Error responses documented with codes
- [ ] Authentication clearly explained
- [ ] Rate limits and quotas specified

**Length:** [As needed per endpoint | Target: 500-1000 words per endpoint]

---

### Feature Documentation

**Structure:**
- Feature overview (what it does)
- Use cases (why use it)
- How to use (step-by-step)
- Configuration options
- Examples
- Limitations or known issues

**Quality criteria:**
- [ ] Clear benefit statement (why feature exists)
- [ ] Multiple use cases demonstrated
- [ ] All configuration options explained
- [ ] Examples show real-world usage
- [ ] Limitations transparent

**Length:** [800-1500 words | As needed | Target: 1000 words]

---

## Structural Elements

### Opening/Hook Requirements

**Technical documentation:**
- State purpose clearly
- Identify audience
- Set expectations

**Blog posts/articles:**
- Grab attention (question, bold claim, problem)
- NO narrative openings ("In 2024, I...")
- NO passive announcements ("This post will cover...")

### Body Content Requirements

**All content:**
- Clear section headers
- One main idea per section
- Supporting evidence or examples
- Transitions between sections

**Technical content:**
- Code examples with context (WHY, not just WHAT)
- Expected output shown
- Alternatives mentioned

**Conceptual content:**
- Real-world analogies
- Visual aids (diagrams, tables)
- Multiple perspectives considered

### Conclusion Requirements

**Must include:**
- Summary of key points
- Actionable takeaway
- Next steps or call to action (if applicable)

**Should avoid:**
- Simply repeating intro
- Introducing new concepts
- Ending abruptly without resolution

---

## Quality Metrics

### Readability
- **Target:** 90%+ audience comprehension
- **Sentence length:** Average 15-20 words
- **Paragraph length:** 3-5 sentences maximum
- **Reading level:** [Grade 8-10 | Grade 10-12 | Professional]

### Scannability
- **Headers:** Every 200-300 words
- **Lists:** Use for 3+ related items
- **Emphasis:** Bold for key terms, italic sparingly
- **White space:** Break up dense text

### Technical Accuracy
- **Code:** All examples tested and working
- **Commands:** Include expected output
- **Data:** Verify statistics and claims
- **Links:** Check all URLs are accessible

---

## Formatting Standards

### Headers
- **Format:** [Sentence case | Title Case]
- **Structure:** H1 (title), H2 (major sections), H3 (subsections)
- **Frequency:** Every 200-300 words for scannability

### Code Blocks
- **Maximum length:** 25 lines (split longer code)
- **Line width:** 80 characters maximum (no horizontal scroll)
- **Context:** Always explain WHY, not just WHAT
- **Language tag:** Always specify for syntax highlighting

**Example:**
````markdown
```typescript
// Context: This validates user input before processing
function validateInput(data: string): boolean {
  return data.length > 0 && data.length < 100;
}
```
````

### Tables
- **Maximum columns:** 3 (more causes horizontal scroll)
- **Cell content:** Concise (no long file paths)
- **Alternative:** Consider definition lists for wide tables

**Definition list format:**
```markdown
- **Term** — Description (additional info)
```

### Lists
- **Bulleted:** Unordered items, features, benefits
- **Numbered:** Sequential steps, rankings, processes
- **Nesting:** Maximum 2 levels deep

---

## Content Quality Checklist

**Before submitting to QA, verify:**

### Substance
- [ ] Original insights (not just summary of sources)
- [ ] Practical value (actionable information)
- [ ] Complete coverage of topic
- [ ] No critical gaps or omissions

### Style
- [ ] Consistent voice throughout
- [ ] Appropriate tone for content type
- [ ] Active voice preferred
- [ ] Concrete examples provided

### Structure
- [ ] Logical flow from intro to conclusion
- [ ] Headers descriptive and hierarchical
- [ ] Transitions smooth
- [ ] Length appropriate for content type

### Technical
- [ ] All code tested and working
- [ ] No hardcoded counts (use "10+" not "10")
- [ ] No time estimates ("may take time" not "takes 5 minutes")
- [ ] Links valid and accessible

---

## Common Issues to Avoid

### Content Issues
- ❌ **Rehashing sources** - Add original analysis
- ❌ **Assumed knowledge** - Define terms, explain concepts
- ❌ **Missing context** - Explain WHY, not just WHAT
- ❌ **Incomplete examples** - Show full working code
- ❌ **Outdated information** - Verify currency of facts

### Formatting Issues
- ❌ **Horizontal scroll** - Keep code and tables within width limits
- ❌ **Wall of text** - Break up with headers, lists, white space
- ❌ **Inconsistent styling** - Use one format throughout
- ❌ **Broken links** - Verify all URLs work
- ❌ **Missing code language tags** - Always specify language

### Style Issues
- ❌ **Passive voice overuse** - Prefer active construction
- ❌ **Jargon without explanation** - Define or avoid technical terms
- ❌ **Tonal shifts** - Maintain consistent voice
- ❌ **Empty phrases** - Cut filler words and vague statements
- ❌ **Narrative openings** - Start with hook, not "Once upon a time..."

---

## Template Customization

**How to adapt this template:**

1. **Select content types** - Focus on types you create most
2. **Define your standards** - Fill in target lengths, reading levels
3. **Set quality thresholds** - Define what "good enough" means
4. **Add examples** - Include samples of good/bad formatting
5. **Create checklists** - Customize quality checklist for your needs
6. **Test and iterate** - Apply to real content, refine standards

**Version:** [Your version]
**Last Updated:** [Date]
**Owner:** [Team/Person responsible for content standards]

---

**Template Version:** 1.0
**Framework:** IA Write Skill
