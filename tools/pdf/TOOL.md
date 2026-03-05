---
name: pdf
type: utility
classification: public
description: PDF processing utilities - extract text/metadata and core PDF manipulation
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/export
  - tools/quarto
  - tools/pdf-extract
---

> **FOR AI AGENTS:** PDF reading and extraction utilities.
> Load when: Extracting text or metadata from PDF files, or processing PDF content programmatically.
>
> **NOTE:** For compliance framework extraction (generating controls.yaml from PDFs), use
> `tools/pdf-extract/` instead. This tool is for general-purpose PDF processing.

---

# PDF Tool

**PDF processing and extraction utilities**

Provides programmatic PDF handling: text extraction, metadata reading, and core PDF manipulation primitives.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (library)

---

## Purpose

Two PDF processing modules:

1. **core.ts** - Core PDF manipulation (page access, document structure)
2. **extract.ts** - Text and metadata extraction from PDF files

**For compliance framework extraction:** Use `tools/pdf-extract/extract.py` instead. It generates
controls.yaml directly from PDFs.

---

## Usage

```typescript
import { extractText, extractMetadata } from '@/tools/pdf/extract';
import { openPDF } from '@/tools/pdf/core';

// Extract all text from a PDF
const text = await extractText('report.pdf');

// Extract document metadata
const meta = await extractMetadata('report.pdf');
console.log(meta.title, meta.author, meta.pages);

// Open and process page by page
const doc = await openPDF('report.pdf');
const page1 = await doc.getPage(1);
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `standards/` — reads compliance standard PDFs for analysis
- `skills/advisory/` — extracts content from technical specification PDFs

No direct TypeScript importers confirmed — invoked programmatically from skill workflows that process PDF documents.

---

## File Structure

```
tools/pdf/
├── core.ts       # Core PDF document handling
├── extract.ts    # Text and metadata extraction
└── TOOL.md       # This file
```

---

## Related Tools

- **tools/pdf-extract** - Compliance framework PDF extraction (generates controls.yaml)
- **tools/export** - PDF generation/output (complementary - this tool is for reading)
- **tools/quarto** - Report rendering that produces PDFs
- **tools/ingestion** - Ingests content from various sources including PDFs

---

**Framework:** Intelligence Adjacent (IA)
