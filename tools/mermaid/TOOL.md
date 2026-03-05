---
name: mermaid
type: utility
classification: public
description: Diagram rendering tool using Mermaid core library and CLI for SVG/HTML, PNG/PDF, and raw syntax output
version: 1.0
last_updated: 2026-02-18
env_required: false
env_keys: []
commands: []
related_tools:
  - tools/quarto
  - tools/export
  - tools/pdf
---

> **FOR AI AGENTS:** Mermaid diagram rendering utilities.
> Load when: Generating diagrams from Mermaid syntax for documentation, reports, or content embedding.

---

# Mermaid Tool

**Diagram rendering from Mermaid syntax to SVG, PNG, PDF, and HTML**

Converts Mermaid diagram syntax into rendered output. Supports in-process SVG generation
(via `mermaid` core library) and file-based PNG/PDF export (via `@mermaid-js/mermaid-cli`).

---

## Classification

**Type:** utility
**Visibility:** public
**Commands:**
- `/mermaid-editor-start` — Start the Mermaid Live Editor visual editor
- `/mermaid-editor-stop` — Stop the Mermaid Live Editor

---

## Purpose

Four capabilities exposed through a unified public API:

1. **render-svg** (`render.ts`) — Convert Mermaid syntax to SVG string, in-process, no CLI
2. **render-png** (`render.ts`) — Convert Mermaid syntax to PNG file via mermaid-cli
3. **render-pdf** (`render.ts`) — Convert Mermaid syntax to PDF file via mermaid-cli
4. **validate** (`validate.ts`) — Validate Mermaid syntax without rendering

**Why it exists:** Framework lacks diagram generation capabilities for embedding in content,
documentation, and reports. Ghost-write, compliance, and pentest skills need to include
architecture diagrams, flow charts, and sequence diagrams in their deliverables.

---

## Usage

```typescript
import { renderSVG, renderPNG, renderPDF, validate } from '@/tools/mermaid/scripts/client';

const diagram = `
graph TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]
`;

// Fast in-process SVG (no CLI dependency)
const svg = await renderSVG(diagram);

// File export (requires mermaid-cli + Chromium)
await renderPNG(diagram, '/output/diagram.png');
await renderPDF(diagram, '/output/diagram.pdf');

// Pre-flight validation
const check = await validate(diagram);
console.log(check.valid, check.errors);
```

**Line breaks in labels:** The tool automatically converts `\n` to `<br/>` in node labels.
This means both of these will render with line breaks:

```typescript
// These both produce the same result:
A["Line 1\nLine 2"]     // \n is converted to <br/>
A["Line 1<br/>Line 2"] // <br/> works directly
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Intended consumers:**
- `skills/ghost/` — diagrams embedded in content
- `standards/` — architecture and process diagrams in reports
- Any workflow producing technical documentation

---

## File Structure

```
tools/mermaid/
├── scripts/
│   ├── types.ts      # Shared TypeScript type definitions
│   ├── validate.ts   # Syntax validation (no render)
│   ├── render.ts     # SVG/PNG/PDF rendering
│   └── client.ts     # Public API — import from consumers
├── docs/             # Optional additional documentation
├── data/             # Runtime data (gitignored)
├── README.md         # Quick start guide
├── TOOL.md           # This file
├── STATUS.md         # Development status
└── VERIFY.md         # Validation checklist
```

---

## Dependencies

**npm packages:**
- `mermaid` — Core library (SVG rendering, in-process)
- `@mermaid-js/mermaid-cli` — CLI wrapper for PNG/PDF via headless Chromium

**System:**
- Chromium/Chrome (only for PNG/PDF output via mermaid-cli)

---

## Visual Editor

The framework includes a Docker-based Mermaid Live Editor for visually creating and testing diagrams.

**Requirements:**
- Docker installed and running (installed via `/setup`)
- First run pulls the Docker image automatically

### Starting the Editor

```bash
/tools/mermaid/scripts/manage.sh start
```

Access at: **http://localhost:8080**

### Features

- Real-time diagram preview as you type
- Export to SVG and PNG
- Support for all Mermaid diagram types
- Theme customization
- Shareable URLs

### Diagram Types Supported

- Flowchart
- Sequence diagram
- Class diagram
- State diagram
- Entity Relationship diagram
- Gantt chart
- Pie chart
- User journey
- Git graph

### Stopping the Editor

```bash
/tools/mermaid/scripts/manage.sh stop
```

### Management Commands

```bash
./manage.sh start      # Start in background (Docker)
./manage.sh start-fg  # Start in foreground
./manage.sh stop      # Stop the container
./manage.sh status    # Check if running
./manage.sh logs      # View container logs
```

---

## Related Tools

- **tools/quarto** — Report rendering (can embed SVG diagrams in .qmd reports)
- **tools/export** — PDF/DOCX export (complementary for deliverable packaging)
- **tools/pdf** — PDF reading utilities (complementary)

---

**Framework:** Intelligence Adjacent (IA)
