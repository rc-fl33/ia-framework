# Quarto Tools

Visual style editor and render wrapper for the IA Framework's Quarto reports.

## Style Editor

Launch the browser-based style editor:

```bash
bun tools/quarto/scripts/style-editor.ts
# Opens: http://localhost:3000
```

Features:
- **Real-time color editing** - Color pickers inject CSS vars into the preview iframe instantly (no re-render)
- **Full re-render** - Click "Re-render Preview" to rebuild with a new Quarto HTML theme
- **Save** - Writes changes back to `_brand.yml`, preserving all comments and formatting
- **Color swatches** - Tab shows all current colors at a glance

## Render CLI

Render a `.qmd` report to HTML, PDF, and/or DOCX:

```bash
# Render all formats (default)
bun tools/quarto/scripts/render.ts path/to/report.qmd

# Render specific format
bun tools/quarto/scripts/render.ts path/to/report.qmd --format html
bun tools/quarto/scripts/render.ts path/to/report.qmd --format pdf
bun tools/quarto/scripts/render.ts path/to/report.qmd --format docx
```

Typst is added to PATH automatically for PDF rendering.

## Files

```
tools/quarto/
├── scripts/
│   ├── render.ts          CLI render wrapper
│   ├── style-editor.ts    HTTP server (port 3000)
│   └── brand-writer.ts    _brand.yml read/write utility
└── web/
    └── index.html         Style editor frontend
```
