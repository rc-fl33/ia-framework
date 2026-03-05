---
name: quarto
type: utility
classification: public
description: Quarto report rendering - multi-format output (HTML/PDF/DOCX) with universal IA style system and visual style editor
version: 2.0
last_updated: 2026-02-27
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/export
  - tools/pdf
---

> **FOR AI AGENTS:** Quarto report rendering and visual style editing for professional deliverables.
> Load when: Rendering .qmd reports to HTML/PDF/DOCX, editing report visual styles, or generating CSS assets.

---

# Quarto Tool

**Multi-format report rendering + universal IA style system + visual style editor**

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:** none (run directly)

---

## Purpose

Three core capabilities:

1. **Render CLI** (`render.ts`) — Converts `.qmd` reports to HTML, PDF (Typst), and DOCX
2. **Style System** (`private/brand/assets/`) — Universal CSS + SCSS applied to all IA report types
3. **Style Editor** (`style-editor.ts`) — Browser UI on port 3001 for live visual customization

**Why it exists:** All IA skills (pentest, sec-review, code-review, advisory, risk-assess, gap-analysis) produce reports. Quarto provides consistent multi-format rendering; the style system provides visual identity; the editor makes customization accessible without touching code.

---

## Style System

### Asset Files

| File | Purpose |
|------|---------|
| `private/brand/assets/styles.css` | Universal stylesheet — design tokens, severity/compliance/risk/priority badges, finding blocks, table styles, callout overrides, print styles |
| `private/brand/assets/theme-light.scss` | Quarto SCSS theme — Bootstrap variable overrides (fonts, colors, spacing), navbar, TOC sidebar, anchor styles |

### CSS Class Reference

**Severity badges** (inline pills):
`.badge-critical` `.badge-high` `.badge-medium` `.badge-low` `.badge-info`

**Finding blocks** (card divs with colored left border):
`.finding-critical` `.finding-high` `.finding-medium` `.finding-low` `.finding-info`

**Compliance status badges:**
`.status-compliant` `.status-partial` `.status-non-compliant` `.status-na` `.status-pending`

**Risk badges:**
`.risk-critical` `.risk-high` `.risk-medium` `.risk-low` `.risk-accepted`

**Priority badges** (remediation roadmap):
`.priority-immediate` `.priority-short-term` `.priority-medium-term` `.priority-long-term` `.priority-accepted`

**Report structure:**
`.report-header` `.classification-notice` `.report-meta`

### Severity Color Spec

| Level | Color | Hex |
|-------|-------|-----|
| Critical | Purple | `#7C3AED` |
| High | Red | `#DC2626` |
| Medium | Orange | `#EA580C` |
| Low | Green | `#16A34A` |
| Info | Blue | `#2563EB` |

### Using in QMD Documents

```yaml
format:
  html:
    theme:
      - cosmo
      - private/brand/assets/theme-light.scss
    css: private/brand/assets/styles.css
```

Badge in a table cell: `[Critical]{.badge-critical}`

Finding block:
```
::: {.finding-critical}
#### F-001: Finding Title
Description here.
:::
```

See `docs/standards/quarto-style-guide.md` for full class reference.

---

## Usage

### Render Reports

```bash
# Render all formats (HTML + PDF + DOCX)
bun tools/quarto/scripts/render.ts path/to/report.qmd

# Single format
bun tools/quarto/scripts/render.ts path/to/report.qmd --format html
bun tools/quarto/scripts/render.ts path/to/report.qmd --format pdf
bun tools/quarto/scripts/render.ts path/to/report.qmd --format docx
```

Typst is added to PATH automatically for PDF rendering.

### Style Editor

```bash
bun tools/quarto/scripts/style-editor.ts
# Opens: http://localhost:3001
```

**Editor features:**

Left panel (tabbed):
- **Colors tab** — 5 sections: Brand, Security Severity, Compliance Status, Table Styles, Code Blocks. Reset to Defaults button restores IA defaults.
- **Typography tab** — Base/heading/mono font selectors, base size, line height, heading weight radio controls
- **Quarto tab** — HTML theme selector, logo upload, Re-render button

Right panel (tabbed):
- **Live Preview** — Bootstrap-based component gallery iframe (`/gallery`). Updates instantly on color change via CSS variable injection — no re-render needed. Shows all badge types, finding blocks, compliance matrix, Quarto callout HTML structure, dark code block, remediation roadmap table.
- **Quarto Preview** — Actual Quarto-rendered HTML (stale until Re-render is clicked, ~10s)
- **Swatches** — Color swatch grid for all 5 color groups

Bottom action bar:
- **Save _brand.yml** — Persists color + typography changes to `private/brand/_brand.yml`
- **Generate CSS** — Writes `private/brand/assets/styles.css` and `theme-light.scss` from current editor state

### Server Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/` | GET | Style editor UI |
| `/gallery` | GET | Component gallery (Bootstrap + authentic Quarto callout HTML) |
| `/preview` | GET | Last Quarto-rendered preview HTML |
| `/current-brand` | GET | Parsed `_brand.yml` as JSON |
| `/save` | POST | Write color/typography changes to `_brand.yml` |
| `/render-preview` | POST | Trigger Quarto re-render of preview template |
| `/generate-css` | POST | Write `styles.css` + `theme-light.scss` from style state |

---

## Report Templates

| Template | Location | Description |
|----------|----------|-------------|
| `pentest-report.qmd` | `tools/quarto/templates/reports/pentest/` | Full pentest report using all IA CSS classes |
| `code-review-report.qmd` | `tools/quarto/templates/reports/code-review/` | Full code review report |
| `sec-review-report.qmd` | `tools/quarto/templates/reports/sec-review/` | Full security review report |
| All skill templates | `tools/quarto/templates/reports/{skill}/` | Generated from templates.yaml |

---

## File Structure

```
tools/quarto/
├── scripts/
│   ├── render.ts               # CLI render wrapper
│   ├── style-editor.ts         # HTTP server (port 3001)
│   ├── brand-writer.ts         # _brand.yml read/write (extended: compliance, table, code colors)
│   ├── css-writer.ts           # generateStyles() / generateScss() / writeStyleFiles()
│   ├── assembler-common.ts     # Shared utilities for skill report assemblers
│   └── preview-template.ts     # Rich Quarto preview QMD string
├── web/
│   ├── index.html          # Style editor frontend (tabbed controls + live gallery)
│   └── gallery.html        # Component gallery (Bootstrap 5 + Bootstrap Icons + Quarto HTML)
├── README.md
└── TOOL.md                 # This file

private/brand/              # Private brand assets (not synced to public repo)
├── _brand.yml              # Brand configuration (colors, fonts, logo)
└── assets/
    ├── logo.{ext}          # Logo used in report covers (webp/png/jpg/svg)
    ├── styles.css          # Universal report stylesheet (generated by style editor)
    └── theme-light.scss    # Quarto SCSS theme (generated by style editor)

docs/standards/
└── quarto-style-guide.md   # CSS class quick reference
```

---

## Consumers

**Skills using the style system + assembler-common:**
- `skills/pentest/` — `.qmd` template + assembler → rendered HTML/PDF deliverables
- `skills/sec-review/` — assembler generates main QMD + section files
- `skills/code-review/` — assembler generates main QMD + section files

**Assembler common exports:** `BaseEng`, `str`, `arr`, `pipeRow`, `cap`, `loadEngagement`,
`parseFindingBlock`, `detectLogoLine`, `genQmdFrontmatter`, `parseEngagementPath`, `spawnRender`

**Planned (same pattern, follow-up sessions):**
- `skills/advisory/`, `skills/risk-assess/`, `skills/gap-analysis/`

---

## SaaS Reuse Note

The style editor UI (`web/index.html` + `web/gallery.html`) is a working prototype of a tenant branding/theme settings page. The CSS variable injection pattern, color picker → live preview flow, and component gallery are directly applicable to the IA Platform SaaS settings UI. Swap `_brand.yml` persistence for a per-tenant DB record. See active tracker for the corresponding platform action item.

---

## Dependencies

**Runtime:**
- Bun
- Quarto CLI (must be installed separately)
- Typst (for PDF via Quarto, added to PATH automatically)

**Install Quarto:** `private/docs/infrastructure/quarto-installation-instructions.md`

---

## Related Tools

- **tools/export** — Lower-level export utilities (PDF/DOCX conversion)
- **tools/pdf** — PDF reading (complementary)

---

**Framework:** Intelligence Adjacent (IA)
