# QA Integration Pattern: Claims-Based Review & Rating Gates

**Classification:** Public (reusable pattern documentation)
**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-04

---

## Overview

The **QA integration pattern** is an approach to quality assurance that uses structured criteria, claims-based review, and mandatory rating gates. This ensures consistent high-quality output across different content types and projects.

---

## Core Concept

Instead of subjective review, QA uses a **claims-based approach**:

1. **Identify claims** made in the content
2. **Verify each claim** against quality criteria
3. **Rate each criterion** independently (1-5 stars)
4. **Aggregate ratings** to overall score
5. **Gate advancement** on achieving minimum rating (typically 5.0/5.0)

---

## QA Criteria Framework

### Standard QA Dimensions

```
┌─────────────────────────────────────────┐
│          QA REVIEW CHECKLIST             │
├─────────────────────────────────────────┤
│                                         │
│ 1. Content Accuracy        ★ ★ ★ ★ ☆   │
│    Claim sources documented?            │
│    Facts verified against research?     │
│                                         │
│ 2. Writing Quality         ★ ★ ★ ★ ★   │
│    Clear and accessible?                │
│    Grammar and spelling correct?        │
│                                         │
│ 3. Brand Alignment         ★ ★ ★ ★ ☆   │
│    Tone consistent with guidelines?     │
│    Perspective matches voice?           │
│                                         │
│ 4. Structure & Format      ★ ★ ★ ★ ★   │
│    Logical progression?                 │
│    Scannable headers and formatting?    │
│                                         │
│ 5. Completeness            ★ ★ ★ ★ ☆   │
│    All important topics covered?        │
│    Examples and edge cases included?    │
│                                         │
├─────────────────────────────────────────┤
│ Overall Rating:        4.6/5.0  NEEDS   │
│                                 REVISION │
└─────────────────────────────────────────┘
```

### QA Dimension Definitions

#### 1. Content Accuracy (1-5 stars)

**Question:** Are all claims accurate and well-supported?

**Checklist:**
- [ ] All factual claims have credible sources
- [ ] Statistics are properly cited with URLs
- [ ] Technical details are accurate
- [ ] Dates and timelines are correct
- [ ] References to other works are accurate

**Perfect (5 stars):**
- Every claim is traceable to a source
- No contradictions with cited sources
- Technical accuracy verified

**Poor (1 star):**
- Multiple unsourced claims
- Contradictions with sources
- Technical errors

#### 2. Writing Quality (1-5 stars)

**Question:** Is the writing clear, accessible, and well-crafted?

**Checklist:**
- [ ] Sentences are clear and concise
- [ ] Paragraph structure supports meaning
- [ ] Vocabulary is appropriate for audience
- [ ] Grammar and spelling are correct
- [ ] Flow and transitions are smooth

**Perfect (5 stars):**
- Engaging, clear, mistake-free
- Excellent sentence variety
- Professional presentation

**Poor (1 star):**
- Confusing or unclear
- Grammar/spelling errors throughout
- Choppy, difficult flow

#### 3. Brand Alignment (1-5 stars)

**Question:** Does the content match the brand voice and perspective guidelines?

**Checklist:**
- [ ] Tone is consistent with brand guidelines
- [ ] Perspective (first/second/third person) is appropriate
- [ ] Voice characteristics match (professional, accessible, etc.)
- [ ] No AI clichés or marketing buzzwords
- [ ] Personality and authenticity shine through

**Perfect (5 stars):**
- Unmistakable brand voice throughout
- Authentic and engaging
- Perfect tone match

**Poor (1 star):**
- Generic or corporate tone
- Inconsistent voice
- Doesn't feel like the brand

#### 4. Structure & Format (1-5 stars)

**Question:** Is content well-organized and properly formatted?

**Checklist:**
- [ ] Outline is logical and scannable
- [ ] Headers are descriptive and action-oriented
- [ ] Sections flow in natural progression
- [ ] Lists and formatting are consistent
- [ ] Code examples include context

**Perfect (5 stars):**
- Excellent organization
- Perfect formatting
- Highly scannable

**Poor (1 star):**
- Confusing organization
- Inconsistent formatting
- Hard to scan or navigate

#### 5. Completeness (1-5 stars)

**Question:** Are all important topics covered with sufficient depth?

**Checklist:**
- [ ] All key concepts explained
- [ ] Examples provided where helpful
- [ ] Edge cases and limitations acknowledged
- [ ] No obvious gaps or missing sections
- [ ] Sufficient depth for target audience

**Perfect (5 stars):**
- Comprehensive coverage
- Helpful examples throughout
- All important aspects covered

**Poor (1 star):**
- Major gaps or omissions
- Lacks depth
- Incomplete treatment

---

## Rating Scale

Each dimension is rated **1-5 stars**:

```
5 ⭐⭐⭐⭐⭐ Excellent - Meets all criteria perfectly
4 ⭐⭐⭐⭐☆ Good - Meets criteria, minor issues
3 ⭐⭐⭐☆☆ Acceptable - Meets basic criteria
2 ⭐⭐☆☆☆ Poor - Fails some criteria
1 ⭐☆☆☆☆ Unacceptable - Fails most criteria
```

---

## Gate Validation

### Hard Gate: 5.0/5.0 Requirement

**Definition:** Final QA rating must be exactly 5.0 stars (all dimensions perfect).

**Calculation:**
```
Final Rating = (Accuracy + Writing + Brand + Structure + Completeness) / 5
             = (5 + 5 + 4 + 5 + 5) / 5
             = 24 / 5
             = 4.8 ← DOES NOT PASS (need 5.0)
```

**Gate Rules:**
- Average of 4.9 is NOT sufficient
- Every dimension must rate 5 stars
- No exceptions or waivers
- Requires revision and re-submission

### Why 5.0/5.0?

This strict requirement ensures:
1. **Consistency** - All content meets high standards
2. **Quality** - No low-quality work advances
3. **Trust** - Users know content is excellent
4. **Accountability** - Clear pass/fail criteria

---

## QA Review Process

### Step 1: Initial Review

```
Reviewer reads content and evaluates against criteria:
- Takes notes on issues and strengths
- Identifies specific problems with locations
- Drafts feedback for each dimension
```

### Step 2: Rate Each Dimension

```
Content Accuracy:      ⭐⭐⭐⭐☆ (4 stars)
  Issue: One statistic lacks source citation

Writing Quality:       ⭐⭐⭐⭐⭐ (5 stars)
  Perfect - clear and engaging

Brand Alignment:       ⭐⭐⭐⭐⭐ (5 stars)
  Perfect - voice is consistent

Structure & Format:    ⭐⭐⭐⭐⭐ (5 stars)
  Perfect - well organized

Completeness:         ⭐⭐⭐⭐⭐ (5 stars)
  Perfect - comprehensive
```

### Step 3: Calculate Overall Rating

```
Average = (4 + 5 + 5 + 5 + 5) / 5 = 4.8 stars
Status: NEEDS REVISION (4.8 < 5.0)
```

### Step 4: Document Feedback

```json
{
  "qa_review": {
    "submission_date": "2026-02-04T14:00:00Z",
    "reviewer": "Quality Assurance Agent",
    "overall_rating": 4.8,
    "gate_passed": false,
    "dimensions": {
      "content_accuracy": {
        "rating": 4,
        "feedback": "One statistic (cloud spending growth) lacks source. Add URL to source or cite research.",
        "location": "Section: Infrastructure Trends, Paragraph 3"
      },
      "writing_quality": {
        "rating": 5,
        "feedback": "Excellent writing. Clear, accessible, engaging throughout."
      },
      "brand_alignment": {
        "rating": 5,
        "feedback": "Perfect voice match. Personal yet professional. No marketing clichés."
      },
      "structure_format": {
        "rating": 5,
        "feedback": "Perfect organization. Headers are scannable, flow is logical."
      },
      "completeness": {
        "rating": 5,
        "feedback": "Comprehensive coverage. Good examples and edge cases discussed."
      }
    },
    "required_actions": [
      "Add source citation for cloud spending growth statistic",
      "Re-submit for QA review",
      "Confirm all 5 dimensions rate 5 stars before advancing"
    ]
  }
}
```

### Step 5: Revision & Re-submission

```
Author receives feedback:
1. Reviews specific issues (location provided)
2. Makes targeted revisions
3. Re-submits for QA review
4. Process repeats until all dimensions are 5 stars
```

---

## Common Feedback Patterns

### Content Accuracy Issues

```
Issue: Unsourced statistic
Feedback: "Cloud spending grew 23% in 2024 (add URL to source)"
Fix: Add [source](https://example.com/report)
```

### Writing Quality Issues

```
Issue: Unclear sentence
Feedback: "This sentence is confusing. Rephrase for clarity."
Fix: Break into two shorter sentences or add clarifying phrase
```

### Brand Alignment Issues

```
Issue: Marketing cliché
Feedback: "Avoid 'leverage' and 'harness the power of' - not our voice"
Fix: Use simpler language: "use" instead of "leverage"
```

### Structure Issues

```
Issue: Missing transitions
Feedback: "Add transition between Section 2 and 3. Reader gets lost."
Fix: Add summary sentence at end of Section 2 and intro to Section 3
```

### Completeness Issues

```
Issue: Missing edge case
Feedback: "What about [scenario]? Acknowledge or explain why it's not relevant"
Fix: Add paragraph addressing the scenario or explaining why it's out of scope
```

---

## Multiple QA Iterations

Example workflow with revisions:

```
ITERATION 1:
  Submission Rating: 4.6/5.0 ❌
  Issues: 2 content accuracy, 1 brand alignment

ITERATION 2 (after revision):
  Submission Rating: 4.8/5.0 ❌
  Issues: 1 content accuracy

ITERATION 3 (after final fix):
  Submission Rating: 5.0/5.0 ✅
  Status: GATE PASSED - Ready to advance
```

---

## QA Checklist Template

Use this template for consistent QA review:

```markdown
# QA Review: [Title]
**Date:** YYYY-MM-DD
**Reviewer:** [Name/Agent]

## Content Accuracy: ⭐⭐⭐⭐☆ (4 stars)

**Issues Found:**
- [ ] Specific issue 1 (location: Section X)
- [ ] Specific issue 2 (location: Section Y)

**Feedback:**
[Specific, actionable feedback]

## Writing Quality: ⭐⭐⭐⭐⭐ (5 stars)

**Strengths:**
- Clear and engaging throughout
- Excellent sentence variety

## Brand Alignment: ⭐⭐⭐⭐☆ (4 stars)

**Issues Found:**
- [ ] Marketing cliché: "leverage the power of..." (location: Intro)

**Feedback:**
Use simpler language matching our authentic voice.

## Structure & Format: ⭐⭐⭐⭐⭐ (5 stars)

**Strengths:**
- Excellent organization and scannable headers

## Completeness: ⭐⭐⭐⭐⭐ (5 stars)

**Strengths:**
- Comprehensive coverage with good examples

---

## OVERALL RATING: 4.6/5.0 ❌ NEEDS REVISION

**Required Actions:**
1. Add source for statistic in Section 2
2. Remove marketing clichés from intro
3. Re-submit for QA review

**Next Step:**
Please make the above revisions and re-submit. We'll validate each dimension reaches 5 stars before advancing.
```

---

## Advantages of This Pattern

1. **Objective** - Criteria-based, not subjective opinion
2. **Specific** - Feedback includes exact locations and issues
3. **Scalable** - Works for any content type
4. **Consistent** - Same standards applied every time
5. **Learnable** - Authors understand exactly what's needed
6. **Improvable** - Track patterns across submissions

---

## Implementation in Your Skills

To implement this pattern:

1. **Define your QA criteria** - What matters for your content?
2. **Create rating scale** - How do you measure each criterion?
3. **Set gate requirement** - What score is required to pass?
4. **Document feedback format** - How do you communicate issues?
5. **Track iterations** - How many revisions before approval?

---

## Related Documentation

- `docs/guides/patterns/content-workflow-pattern.md` - The 5-phase workflow including QA phase
- `skills/write/phases/03-qa.md` - Implementation example (Phase 3: QA)
- `skills/write/templates/qa-criteria-template.md` - Customizable QA template

---

**Framework:** Intelligence Adjacent (IA)
**Status:** Public pattern documentation
**Reusable:** Yes - adapt criteria for your own QA needs
