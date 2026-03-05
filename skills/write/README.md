# Write Skill

**Generic content writing workflow with research validation, QA gates, and format flexibility**

---

## Problem

**What problem does this skill solve?**

Creating high-quality content requires research validation, consistent brand voice, and quality assurance. Most writing workflows lack structured validation gates, leading to inconsistent quality and missed requirements. Documentation often lacks proper sourcing and fails to meet brand standards.

---

## Solution

**How does this skill solve it?**

The write skill provides a systematic 5-phase workflow: Research (10+ sources), Draft (templated brand voice), QA (5.0/5.0 rating requirement), Visuals (optional image generation), and Output (format-flexible export). Templated guidance ensures consistency while allowing customization for different content types and brand voices.

---

## Quick Start

```bash
# Primary command
/write

# With topic context
/write installation guide for the framework

# Example
/write technical documentation for API endpoints
```

---

## Commands

| Command | Description | Effort |
|---------|-------------|--------|
| `/write` | Full content workflow with research, QA, and output | STANDARD |

---

## Workflow Overview

```
RESEARCH → DRAFT → QA → VISUALS → OUTPUT
   │        │      │       │         │
   ▼        ▼      ▼       ▼         ▼
10+ sources  Content  5.0/5.0  Images  Final file
validated   w/brand  rating   (opt)   (MD/HTML)
            voice
```

**Phases:**
1. **RESEARCH** - Gather and validate 10+ credible sources
2. **DRAFT** - Write content using customizable brand voice templates
3. **QA** - Achieve 5.0/5.0 quality rating with criteria validation
4. **VISUALS** - Generate images (optional step)
5. **OUTPUT** - Export to desired format (markdown, HTML, etc.)

---

## Output

**What you get:**

Each post gets its own directory: `private/output/write/{slug}-{YYYY-MM-DD}/`

All artifacts flat inside — no subfolders:
- `{slug}-{YYYY-MM-DD}.{ext}` - Final content (markdown, HTML, etc.)
- `draft.md` - Working draft
- `qa-review.json` - QA validation results
- `metadata.json` - Workflow metadata
- `sources.txt` - Validated sources (10+ entries)
- `research-notes.md` - Complete research notes
- `*.png` - Generated images (if VISUALS phase used)

---

## Requirements

**Before using this skill:**

- [ ] OpenRouter API key configured in `.env` (for image generation capability)
- [ ] Writer agent available (routing handled automatically)
- [ ] Content topic or brief provided

**Input location:** `private/input/write/`

---

## Setup & Configuration

### Required Credentials

This skill requires the following API credentials:

| Credential | Service | Instructions |
|-----------|---------|--------------|
| `OPENROUTER_API_KEY` | OpenRouter AI | Required for AI generation |

### Environment Setup

1. **Get credentials** - Obtain OpenRouter API key from https://openrouter.ai
2. **Update `.env`** - Add credential:
   ```bash
   OPENROUTER_API_KEY=[insert key]
   ```
3. **Verify** - Test that credential loads:
   ```bash
   source .env
   echo $OPENROUTER_API_KEY  # Should show your key value
   ```

**Security:** Never commit credentials to git. Keep `.env` file secure.

Add credentials to `.env` file in framework root.

---

## Agent

**Executed by:** `writer` agent

This skill requires the specialized context and capabilities of the writer agent. Base Claude will automatically delegate when this skill is invoked.

---

## Examples

### Example 1: Installation Documentation

```bash
/write installation guide with symlink setup
```

**Result:** Complete installation guide with research sources, QA validation, and format export

### Example 2: Technical API Documentation

```bash
/write API documentation for authentication endpoints
```

**Result:** Technical documentation with code examples, proper sourcing, and brand voice consistency

### Example 3: Feature Documentation

```bash
/write documentation for the new credential management system
```

**Result:** Feature documentation with research, validation, and optional visual diagrams

---

## Template Customization

**The write skill uses customizable templates for flexibility:**

- `templates/brand-voice-template.md` - Default tone, style, voice guidelines
- `templates/brand-voice-custom.md` - IA Framework brand voice (default when no `--brand` flag)
- `templates/content-standards-template.md` - Adjust quality criteria
- `templates/image-style-template.md` - Configure visual style/aesthetic
- `templates/qa-criteria-template.md` - Modify QA requirements

**Client brand guides** live in `private/docs/write/brand-voice-{name}.md` and are selected with the `--brand` flag:
```bash
/write --brand fortreum CMMC assessment preparation guide
```

See template files in `templates/` directory for customization examples.

---

## Difference from /ghost

**Important:** `/write` and `/ghost` are INDEPENDENT, separate skills.

| Aspect | /write (PUBLIC) | /ghost (PRIVATE) |
|--------|-----------------|------------------|
| Purpose | Generic content writing | Ghost CMS blog publishing |
| Classification | Public (anyone) | Private (user's blog) |
| Brand Voice | Customizable templates | IA Framework branded |
| Publishing | Manual export | Automatic Ghost CMS |
| Output | Markdown, HTML, PDF, etc. | Ghost CMS + X/Twitter |

See `../../docs/guides/patterns/content-writing-architecture.md` for complete comparison.

## Related Skills

- `/ghost` - Ghost CMS blog publishing (INDEPENDENT skill, not an extension)
- `/advisory` - Advisory content creation
- `/create` - Creating skill documentation

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| QA rating below 5.0 | Review feedback in qa-review.json, address issues, re-run QA |
| Fewer than 10 sources | Return to research phase, gather additional credible sources |
| Brand voice inconsistent | Review brand voice guide (check `--brand` flag if using client voice), apply guidance to draft |
| Image generation fails | Check OPENROUTER_API_KEY is set, or skip VISUALS phase |
| Export format unsupported | Use markdown as default format |

---

**Version:** 1.0
**Last Updated:** 2026-01-20
