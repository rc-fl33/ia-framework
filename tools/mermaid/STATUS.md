# Mermaid Tool Status

**Last Updated:** 2026-02-18
**Session:** initial-creation
**Readiness:** 🔍 Development

---

## Session Changes (Reverse Chronological)

### 2026-03-04 - Fix stdin support and line break preprocessing

**Changes:**
- Added stdin support to render.ts — now correctly reads piped input (`cat diagram.mmd | bun render.ts --format svg`)
- render.ts now applies `\n` → `<br/>` preprocessing to piped input (was already working for CLI arguments)
- Added critical guidance in sec-review docs about using `<br/>` for line breaks in node labels

**Issue:** mmdc does not interpret `\n` as a line break in node labels — must use `<br/>` explicitly.
The render.ts tool handles this conversion automatically, but was bypassed when using stdin.

**Usage:**
```bash
# Now works correctly with preprocessing
cat diagrams/arch.mmd | bun tools/mermaid/scripts/render.ts --format svg --out diagrams/arch.svg

# CLI argument (already worked)
bun tools/mermaid/scripts/render.ts --format svg "graph TD\n  A[Node<br/>Label] --> B"
```

---

### 2026-02-18 - Initial Creation

**Changes:**
- Created tool directory structure
- Generated TOOL.md, README.md, VERIFY.md, STATUS.md
- Implemented scripts/types.ts — shared TypeScript type definitions
- Implemented scripts/validate.ts — Mermaid syntax validation
- Implemented scripts/render.ts — SVG, PNG, PDF rendering
- Implemented scripts/client.ts — public API exports

**Decisions:**
- SVG rendering uses mermaid core library in-process (no CLI dependency) for speed
- PNG/PDF rendering delegates to @mermaid-js/mermaid-cli for full fidelity
- Public API consolidated in client.ts for clean consumer import surface

**Next Actions:**
- [ ] Install dependencies: `bun add mermaid @mermaid-js/mermaid-cli`
- [ ] Test SVG rendering with sample diagrams
- [ ] Test PNG rendering once mermaid-cli is installed
- [ ] Add to .framework-manifest.yaml under framework.tools.include
- [ ] Add to docs/catalogs/tool-catalog.md

---

## Readiness Assessment

| Component | Status | Notes |
|-----------|--------|-------|
| README.md | Ready | Quick start, troubleshooting, consumers documented |
| TOOL.md | Ready | Formal spec with classification and usage |
| scripts/types.ts | Ready | Type definitions complete |
| scripts/validate.ts | Ready | Syntax validation implementation |
| scripts/render.ts | Ready | SVG/PNG/PDF rendering implementation |
| scripts/client.ts | Ready | Public API exports complete |
| Docs | Optional | docs/ directory available for expansion |

---

## Capabilities

| Capability | Status | Last Tested |
|------------|--------|-------------|
| render-svg | Untested | — |
| render-png | Untested | — |
| render-pdf | Untested | — |
| validate | Untested | — |

---

## Known Issues

| Issue | Impact | Workaround |
|-------|--------|------------|
| SVG rendering requires browser globals | High | Needs JSDOM or similar in Node/Bun context |
| PNG/PDF requires Chromium installation | Medium | mermaid-cli auto-installs Chromium on first run |

---

## Usage Notes

**Prerequisites:**
- `bun add mermaid @mermaid-js/mermaid-cli` in framework root
- Chromium available for PNG/PDF rendering (mermaid-cli manages this)

**Common Patterns:**
- Embed SVG inline in HTML reports
- Export PNG for markdown documents (GitHub-compatible)
- Export PDF for standalone diagram deliverables

---

**Tool:** mermaid
**Classification:** public
**Agent:** none (library)
