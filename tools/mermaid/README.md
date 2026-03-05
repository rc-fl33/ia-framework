# mermaid - Quick Start

> **Type:** Infrastructure tool (not a skill — operational lifecycle, not deliverable-producing phases)

**Diagram rendering tool using Mermaid core library and CLI for SVG/HTML, PNG/PDF, and raw syntax output**

---

## Quick Start

```typescript
import { renderSVG, renderPNG, renderPDF, validate } from '@/tools/mermaid/scripts/client';

// Render to SVG string (in-process, no CLI needed)
const svg = await renderSVG('graph TD\n  A --> B');

// Render to PNG file (requires @mermaid-js/mermaid-cli)
await renderPNG('graph TD\n  A --> B', 'output/diagram.png');

// Validate syntax
const result = await validate('graph TD\n  A --> B');
if (!result.valid) console.error(result.errors);
```

---

## Overview

Diagram generation capabilities for embedding in content, documentation, and reports.
Provides three output modes based on use case:

**What it does:**
- Renders Mermaid syntax to SVG string using the Mermaid core library (in-process, no CLI)
- Renders Mermaid syntax to PNG/PDF files using mermaid-cli (@mermaid-js/mermaid-cli)
- Validates Mermaid syntax without rendering (fast pre-flight check)

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/types.ts` | TypeScript type definitions shared across scripts |
| `scripts/validate.ts` | Mermaid syntax validation (no rendering) |
| `scripts/render.ts` | SVG, PNG, and PDF rendering functions |
| `scripts/client.ts` | Public API — import this from other skills/tools |

**Running scripts directly:**
```bash
# Validate syntax
bun tools/mermaid/scripts/validate.ts "graph TD\n  A --> B"

# Render SVG to stdout
bun tools/mermaid/scripts/render.ts --format svg "graph TD\n  A --> B"

# Render PNG to file
bun tools/mermaid/scripts/render.ts --format png --out diagram.png "graph TD\n  A --> B"

# Render from file via stdin (syntax passed via pipe)
cat diagrams/arch.mmd | bun tools/mermaid/scripts/render.ts --format svg --out diagrams/arch.svg
```

**Note:** The render script preprocesses `\n` to `<br/>` in node labels automatically.
Use `<br/>` for line breaks in Mermaid node labels — mmdc does not interpret `\n` as a line break.

---

## Configuration

**No environment variables required.**

**Optional mermaid-cli config** (for PNG/PDF rendering):

```typescript
const options: RenderOptions = {
  theme: 'default',       // 'default' | 'dark' | 'forest' | 'neutral'
  width: 1200,
  height: 800,
  backgroundColor: 'white',
};
```

---

## Dependencies

**Runtime:**
- `mermaid` — Core library for SVG rendering
- `@mermaid-js/mermaid-cli` — CLI tool for PNG/PDF batch rendering (requires Chromium)

**Install:**
```bash
bun add mermaid @mermaid-js/mermaid-cli
```

**Note:** PNG/PDF rendering via mermaid-cli requires Chromium/Chrome to be available.
SVG rendering via the core library runs in-process with no additional dependencies.

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

**Intended consumers:**
- `skills/ghost/` — embed diagrams in content output
- `standards/` — architecture and flow diagrams in reports
- Any skill producing documentation that needs diagram rendering

---

## Directory Structure

```
tools/mermaid/
├── README.md             # This file
├── TOOL.md               # Formal tool specification
├── STATUS.md             # Development status
├── VERIFY.md             # Validation checklist
├── scripts/
│   ├── types.ts          # Shared TypeScript types
│   ├── validate.ts       # Syntax validation
│   ├── render.ts         # SVG, PNG, PDF rendering
│   └── client.ts         # Public API exports
├── docs/                 # Documentation (optional)
└── data/                 # Runtime data (optional, gitignored)
```

---

## Troubleshooting

**"Cannot find module 'mermaid'"**
→ Run `bun add mermaid @mermaid-js/mermaid-cli` in the framework root

**PNG/PDF rendering fails**
→ mermaid-cli requires Chromium. Check that `mmdc` is available: `bun x mmdc --version`

**SVG output is empty**
→ Check syntax with `validate()` first. Mermaid silently fails on invalid syntax.

---

**For complete documentation**, see `tools/mermaid/docs/`

**Version:** 1.0
**Last Updated:** 2026-02-18
