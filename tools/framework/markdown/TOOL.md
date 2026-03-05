---
name: markdown
type: utility
classification: public
description: Markdown parsing utilities - extract sections by header, parse frontmatter, handle code blocks
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/validation
  - tools/docs
---

> **FOR AI AGENTS:** Markdown parsing library for section extraction and frontmatter handling.
> Load when: A tool needs to parse markdown content, extract sections, or read frontmatter.

---

# Markdown Tool

**Markdown section parsing and frontmatter extraction library**

Provides utilities for parsing markdown files: extracting sections by heading, reading YAML frontmatter, and handling edge cases like code blocks and nested headers.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (library, not standalone)

---

## Purpose

Core markdown parsing primitives used across multiple framework tools:

- **`parseMarkdownSections(content)`** - Splits markdown into named sections by `## Heading`
- **`extractFrontmatter(content)`** - Reads YAML frontmatter between `---` delimiters
- **Code block awareness** - Doesn't misinterpret `##` inside code blocks as headers
- **Nested header support** - Handles `###` and `####` correctly

**Why it exists:** Multiple tools (validation, docs, catalogs) need to parse markdown. Centralizing avoids duplicated, inconsistent parsing logic.

---

## Usage

```typescript
import { parseMarkdownSections, extractFrontmatter } from '@/tools/markdown/section-parser';

// Extract frontmatter and sections
const { frontmatter, sections } = parseMarkdownSections(content);

// Access a specific section
const identitySection = sections['IDENTITY'];
const objectiveSection = sections['OBJECTIVE'];

// Read frontmatter fields
const { domain, skill, model } = frontmatter;
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Tools:**
- `tools/validation/validate-ups-structure.ts` — uses parseMarkdownSections() to validate UPS documents
- `tools/docs/generate-catalogs.ts` — uses extractFrontmatter() to read skill/tool metadata
- `tools/generators/` — uses section-parser for prompt template processing

---

## File Structure

```
tools/markdown/
├── section-parser.ts    # Main parsing utilities
└── TOOL.md              # This file
```

---

## Dependencies

**Runtime:**
- `gray-matter` (frontmatter parsing)
- Bun

**Used By:**
- `tools/validation` - UPS structure validation
- `tools/docs` - Catalog generation
- `tools/generators` - Prompt generation

---

## Related Tools

- **tools/validation** - Primary consumer (UPS validation)
- **tools/docs** - Secondary consumer (catalog generation)

---

**Framework:** Intelligence Adjacent (IA)
