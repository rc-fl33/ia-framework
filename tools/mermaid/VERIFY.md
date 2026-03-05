# Definition of Done: Mermaid Tool

**This checklist defines completion criteria for the mermaid tool.**

---

## Structure Verification

- [ ] `tools/mermaid/README.md` exists with Quick Start section
- [ ] `tools/mermaid/TOOL.md` exists with classification frontmatter
- [ ] `tools/mermaid/STATUS.md` exists with readiness assessment
- [ ] `tools/mermaid/VERIFY.md` exists (this file)
- [ ] `tools/mermaid/scripts/` directory exists
- [ ] `tools/mermaid/scripts/types.ts` exists
- [ ] `tools/mermaid/scripts/validate.ts` exists
- [ ] `tools/mermaid/scripts/render.ts` exists
- [ ] `tools/mermaid/scripts/client.ts` exists

---

## Dependency Verification

- [ ] `mermaid` package installed (`bun add mermaid`)
- [ ] `@mermaid-js/mermaid-cli` package installed (`bun add @mermaid-js/mermaid-cli`)
- [ ] No missing imports in TypeScript files
- [ ] TypeScript compiles without errors

---

## Functional Verification

### validate()
- [ ] Returns `{ valid: true, errors: [] }` for correct Mermaid syntax
- [ ] Returns `{ valid: false, errors: [...] }` for invalid syntax
- [ ] Does not throw on empty string input

### renderSVG()
- [ ] Returns non-empty string containing `<svg` tag
- [ ] Works with flowchart (`graph TD`) syntax
- [ ] Works with sequence diagram syntax
- [ ] Works with Gantt chart syntax
- [ ] Accepts optional `RenderOptions` (theme, width, height)

### renderPNG()
- [ ] Creates PNG file at specified output path
- [ ] File is valid PNG (readable by image viewers)
- [ ] Accepts optional `RenderOptions`
- [ ] Returns resolved output path

### renderPDF()
- [ ] Creates PDF file at specified output path
- [ ] File is valid PDF (readable by PDF viewers)
- [ ] Returns resolved output path

---

## Integration Verification

- [ ] `client.ts` exports `renderSVG`, `renderPNG`, `renderPDF`, `validate`
- [ ] Import works: `import { renderSVG } from '@/tools/mermaid/scripts/client'`
- [ ] Tool discoverable via `docs/catalogs/tool-catalog.md`

---

## Content Quality

- [ ] README.md has no TODO markers or placeholder content
- [ ] TOOL.md has no placeholder content
- [ ] All scripts have JSDoc comments on exported functions
- [ ] No credentials or secrets in any file

---

## Post-Creation Checklist

- [ ] Added to `.framework-manifest.yaml` under `framework.tools.include`
- [ ] Added to `docs/catalogs/tool-catalog.md` with capability tags
- [ ] STATUS.md updated to "Ready" after functional verification passes
- [ ] Tested from at least one consumer skill

---

**Tool:** mermaid
**Classification:** public
**Version:** 1.0
