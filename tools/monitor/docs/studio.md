# Quarto Studio Panel

Reference guide for the Studio panel inside the Monitor dashboard.

---

## Overview

The Studio panel is a 3-pane report editor built into the monitor dashboard. It provides a point-and-click interface for managing Quarto-based security reports without leaving the browser: browse engagements, edit sections, and trigger report generation.

---

## Accessing Studio

Navigate to http://localhost:4747 and click the **Studio** tab in the tab bar.

---

## Layout

Three resizable panes:

| Pane | Purpose |
|------|---------|
| Left — Engagements | Lists all engagement directories found under `private/output/`. Click to load. |
| Center — Section Editor | Shows section cards for the selected engagement. Click a card to edit. |
| Right — Preview | Renders the last generated HTML report in an iframe. |

---

## Engagement Browser (left pane)

- Scans `private/output/{skill}/{engagement}/` for directories containing `engagement.yaml`
- Shows the skill type (e.g. `sec-review`) as a muted label above the engagement name
- Click any engagement to load its sections in the center pane
- **New Engagement** button — not yet implemented (placeholder)

---

## Section Cards (center pane)

Sections are listed in canonical report order: Cover → Executive Summary → Scope → Findings → Recommendations → Appendices

Each card shows the section name and a brief excerpt of the file content. Drag the handle to reorder (advisory only — does not yet persist order to the report).

Click any card to open the full-pane editor.

---

## Section Editor

Clicking a card replaces the card list with a full-height textarea showing the raw `.qmd` file content. The header shows the section name.

- **Save** — writes the file to disk and returns to the card list
- **← Sections** — discards unsaved changes and returns to the card list

> **Note:** Section files in `_sections/` are regenerated on every Generate run. To make edits that survive regeneration, use the `narrative:` block in `engagement.yaml`. See [Report Generation Guide](../../../docs/guides/report-generation.md) for details.

---

## Generate Button

The **Generate** button (center pane header) runs the full report assembly pipeline:

1. Reads `engagement.yaml` + `_sections/_findings/_F-NNN.qmd` files
2. Regenerates all section `.qmd` files (applying any `narrative:` overrides from `engagement.yaml`)
3. Renders to HTML via Quarto

The **Draft** checkbox controls whether the output includes the DRAFT watermark and `_DRAFT` filename suffix.

On success, the preview pane automatically loads the rendered HTML.

---

## Preview Pane (right pane)

- **Render** button — triggers Generate and loads result in the iframe
- **↗** link — opens the rendered HTML in a new browser tab
- Default state shows a placeholder until the first render

---

## Editing Durable Content

The Studio editor writes directly to `_sections/*.qmd` files, which are overwritten on every Generate run. For changes that must survive regeneration:

| What to change | Where to edit |
|----------------|---------------|
| Metadata (client name, dates, scope) | `engagement.yaml` |
| Finding content | `_sections/_findings/_F-NNN.qmd` body text |
| Section narrative prose | `engagement.yaml` → `narrative:` block |
| One-off section edit (no re-generate) | Edit via Studio or file browser, skip Generate |

Full pipeline documentation: [`docs/guides/report-generation.md`](../../../docs/guides/report-generation.md)

---

## API Endpoints

The Studio panel uses these server endpoints (all under `/api/studio/`):

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/studio/engagements` | GET | List engagements in `private/output/` |
| `/api/studio/sections?eng=path` | GET | List sections for an engagement |
| `/api/studio/sections?eng=path&file=f` | GET | Read a single section file |
| `/api/studio/sections/write` | POST | Write a section file |
| `/api/studio/sections/reorder` | POST | Advisory reorder (no-op currently) |
| `/api/studio/render` | POST | Run assemble-report + quarto render |
| `/api/studio/preview?eng=path` | GET | Serve last rendered HTML |
