# Content Writing Architecture: Understanding /write vs /ghost

**Classification:** Public
**Framework:** Intelligence Adjacent (IA)
**Last Updated:** 2026-02-04

---

## Critical Clarification

**The `/write` and `/ghost` skills are INDEPENDENT, separate tools.**

They are NOT related as "foundation→extension". They are two completely different skills that happen to use similar 5-phase workflow patterns.

- **`/write` skill** = PUBLIC generic content writing tool (anyone can use and customize)
- **`/ghost` skill** = PRIVATE CMS-specific tool (user's personal Ghost blog)

---

## Quick Comparison

| Aspect | /write (PUBLIC) | /ghost (PRIVATE) |
|--------|-----------------|------------------|
| **Purpose** | Generic content creation for any project | Ghost CMS blog publishing (user's blog) |
| **Classification** | Public - available to everyone | Private - user's personal tool |
| **Input** | Any topic/content brief | Blog post topics + Ghost metadata |
| **Output** | Markdown, HTML, PDF, etc. | Ghost CMS + X/Twitter automation |
| **Brand Voice** | Customizable templates | IA Framework branded (fixed) |
| **Publishing** | Manual export/distribution | Automatic Ghost CMS publishing |
| **Use Case** | Documentation, guides, articles, any writing | Blog publishing only |
| **Customization** | Fully customizable (templates, standards) | Fixed to user's Ghost setup |

---

## The /write Skill (PUBLIC)

**What it is:** A generic, reusable content writing workflow with research validation, brand voice templates, and quality assurance.

**Available to:** Anyone (public repository)

**Commands:**
- `/write` - Full 5-phase content workflow
- `/write-research` - Topic discovery before writing

**Workflow:**
```
RESEARCH (10+ sources) → DRAFT (brand voice) → QA (5.0/5.0) → VISUALS (optional) → OUTPUT (format export)
```

**Key Features:**
- Research validation with 10+ credible sources
- Customizable brand voice templates (you define your own)
- QA gates with 5.0/5.0 rating requirement
- Optional image generation
- Flexible output formats (markdown, HTML, PDF via other tools)

**When to use:**
- Writing documentation (guides, READMEs, technical specs)
- Creating blog posts or articles with research
- Building feature documentation
- Developing instructional content
- Any content that needs research validation and quality assurance

**Output Location:** `skills/write/output/documents/`

---

## The /ghost Skill (PRIVATE)

**What it is:** A CMS-specific tool for publishing content directly to Ghost with automation features.

**Available to:** User only (private repository)

**Commands:**
- `/ghost-write` - Blog writing with Ghost CMS publishing
- `/ghost-research` - Trending topic discovery with Ghost analytics
- `/ghost-newsletter` - Weekly digest with Ghost email scheduling
- `/update-reference` - Update Ghost reference documentation

**Workflow:**
```
RESEARCH (10+ sources) → DRAFT (IA brand voice) → QA (5.0/5.0 + tag validation) → VISUALS (required hero image) → PUBLISH (Ghost CMS + X/Twitter)
```

**Ghost-Specific Features:**
- Ghost Admin API integration for direct CMS publishing
- Automatic X/Twitter article posting
- Hero image generation (required, not optional)
- Ghost tag validation (enforces official tags)
- Email scheduling (Monday 8:00 AM)
- Analytics integration (trending topics)

**When to use:**
- Publishing blog posts to your Ghost CMS
- Automating weekly blog newsletters
- Discovering trending topics from analytics
- Publishing to social media alongside blog

**Output Location:** `skills/ghost/output/posts/`

---

## Why Are They Different?

**`/write` is PUBLIC because:**
- It's a generic content writing framework
- No CMS-specific features or integrations
- Uses customizable templates (not hardcoded to one brand)
- Can be used by anyone for any project
- Educational value for other users

**`/ghost` is PRIVATE because:**
- Requires Ghost Admin API credentials (user's personal blog)
- Hardcoded to user's IA Framework brand voice
- Contains personal Ghost blog configuration
- Integrates with user's X/Twitter account
- Not useful for others (tied to user's blog)

---

## Shared Workflow Pattern

Both skills use the same proven 5-phase workflow architecture:

```
PHASE 1: RESEARCH
├─ Gather 10+ credible sources
├─ Validate source quality
└─ Gate: 10+ sources required

PHASE 2: DRAFT
├─ Write content with brand voice template
├─ Apply formatting and structure
└─ Gate: Brand voice consistency verified

PHASE 3: QA
├─ Multi-phase validation
├─ Achieve 5.0/5.0 quality rating
└─ Gate: 5.0/5.0 rating required (mandatory)

PHASE 4: VISUALS
├─ Generate images (optional in /write, required in /ghost)
└─ Gate: Images present (in /ghost only)

PHASE 5: OUTPUT
├─ Export final content
├─ Save with metadata
└─ Gate: Export successful
```

**Why both use this pattern:** It's proven effective for high-quality content. Research validates accuracy, drafting applies brand voice, QA ensures excellence, visuals enhance engagement, output delivers the final product.

---

## Workflow Comparison

| Phase | /write | /ghost |
|-------|--------|--------|
| RESEARCH | 10+ sources | 10+ sources |
| DRAFT | Customizable brand voice template | IA Framework brand voice (fixed) |
| QA | 5.0/5.0 rating | 5.0/5.0 rating + Ghost tag validation |
| VISUALS | Optional (skip if not needed) | Required (hero image mandatory) |
| OUTPUT | Export: Markdown, HTML, PDF, etc. | Ghost CMS auto-publishing + X/Twitter |

---

## When to Choose

### Choose /write when:

✅ You're writing documentation
✅ You're creating generic content
✅ You want customizable templates
✅ You're working on someone else's project
✅ You want to export to multiple formats
✅ You want research validation and QA

### Choose /ghost-write when:

✅ You're publishing to your personal Ghost blog
✅ You want automatic X/Twitter posting
✅ You need Ghost tag validation
✅ You want email scheduling
✅ You need analytics-based topic discovery

---

## Example: How They Work

### Using /write

```bash
/write "How to Build a REST API"

Workflow:
1. Research 10+ API design sources
2. Draft comprehensive guide (customizable template)
3. QA validation (5.0/5.0 gate)
4. Optional hero image generation
5. Export to markdown/HTML for your docs

Output: Markdown file ready for your project
```

### Using /ghost-write

```bash
/ghost-write "How to Build a REST API"

Workflow:
1. Research 10+ API design sources
2. Draft blog post (IA Framework voice)
3. QA validation (5.0/5.0 + tag check)
4. Required hero image generation
5. Auto-publish to Ghost + tweet link

Output: Published on blog + X/Twitter
```

---

## Architecture Decision

### Why Separate Skills?

1. **Scope Separation** - /write is generic (public), /ghost is CMS-specific (private)
2. **Reusability** - /write can be used by anyone, /ghost is personal
3. **Dependencies** - /ghost depends on Ghost API (not public), /write doesn't
4. **Customization** - /write allows template customization, /ghost is fixed to user's setup
5. **Security** - Ghost credentials never leak to public repo

### Why They Share Workflow Patterns?

1. **Proven Pattern** - 5-phase workflow produces high-quality content
2. **Consistency** - Users recognize the same gates and checkpoints
3. **Educational Value** - Pattern is reusable for future skills
4. **Quality Gates** - Same validation ensures excellence in both

---

## For Implementation

### Working with /write

- Customizable templates let you define your brand voice
- No external API integrations required (except optional image generation)
- Fully portable between projects
- Can be extended by creating new commands (research, newsletter, etc.)

### Working with /ghost

- User-specific configuration and credentials
- Integrates with Ghost Admin API and X/Twitter
- Automated publishing and email scheduling
- Analytics integration for trending topics

---

## Pattern Reuse

The 5-phase workflow pattern used by both /write and /ghost is reusable for other content skills:

- **Research validation** - Ensures facts are accurate (10+ sources)
- **Brand voice templates** - Maintains consistency across projects
- **QA gates** - Achieves quality standards (5.0/5.0 rating)
- **Visual enhancement** - Images improve engagement
- **Flexible output** - Supports multiple formats/destinations

Future content skills can adopt this pattern for consistent, high-quality output.

---

## Summary

| Aspect | /write | /ghost |
|--------|--------|--------|
| **Relationship** | INDEPENDENT | INDEPENDENT |
| **Dependency** | None (self-contained) | Depends on user's Ghost setup |
| **Public/Private** | PUBLIC (anyone) | PRIVATE (user only) |
| **Workflow** | Same 5-phase pattern | Same 5-phase pattern |
| **Customization** | Fully customizable templates | Fixed to IA Framework voice |
| **Publishing** | Manual or export to other systems | Automatic Ghost CMS + X/Twitter |
| **Use Case** | Generic content writing | Ghost blog publishing |

**Both are excellent tools - they just solve different problems.**

Use `/write` for generic content creation.
Use `/ghost` for blog publishing to your personal Ghost CMS.

---

**Framework:** Intelligence Adjacent (IA)
**Status:** Public documentation
