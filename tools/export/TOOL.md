---
name: export
type: utility
classification: public
description: Document export utilities - convert markdown/HTML reports to PDF, DOCX, and split PDFs
version: 1.0
last_updated: 2026-02-17
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/quarto
  - tools/pdf
---

> **FOR AI AGENTS:** Document format conversion utilities (PDF, DOCX, PDF splitting).
> Load when: Exporting reports or documents to PDF/DOCX format.

---

# Export Tool

**Document export and format conversion utilities**

Converts markdown/HTML content to delivery formats (PDF, DOCX) and provides PDF manipulation utilities.

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (library utilities)

---

## Purpose

Three export utilities:

1. **export-pdf.ts** - Converts documents to PDF format
2. **export-docx.ts** - Converts documents to DOCX (Word) format
3. **pdf-splitter.ts** - Splits multi-page PDFs into individual files

**Why it exists:** Security reports and deliverables need professional format output. These utilities handle the conversion layer between markdown source and client-ready documents.

---

## Usage

```bash
# Export to PDF
bun tools/export/export-pdf.ts --input report.md --output report.pdf

# Export to DOCX
bun tools/export/export-docx.ts --input report.md --output report.docx

# Split PDF by page
bun tools/export/pdf-splitter.ts --input combined.pdf --output-dir ./pages/
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Skills:**
- `skills/pentest/` — exports penetration test reports to PDF/DOCX for delivery

No direct TypeScript importers currently — invoked via CLI from skill workflows.

---

## File Structure

```
tools/export/
├── export-pdf.ts      # PDF export
├── export-docx.ts     # DOCX export
├── pdf-splitter.ts    # PDF page splitting
└── TOOL.md            # This file
```

---

## Related Tools

- **tools/quarto** - Higher-level report rendering (uses export under the hood)
- **tools/pdf** - PDF reading/extraction utilities (complementary to export)

---

**Framework:** Intelligence Adjacent (IA)
