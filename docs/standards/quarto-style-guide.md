# IA Quarto Style Guide

Quick reference for the Intelligence Adjacent Framework Quarto style system.

---

## Overview

The IA style system provides a consistent visual language for security reports rendered with Quarto. It
consists of two asset files:

| File | Purpose |
|------|---------|
| `private/brand/assets/styles.css` | All custom CSS classes (badges, finding blocks, report structure) |
| `private/brand/assets/theme-light.scss` | SCSS theme variables and typography overrides for the light theme |

These files are consumed by `.qmd` documents via the `format.html` YAML block. Templates live in
`skills/{skill}/templates/`.

---

## YAML Frontmatter

Reference both assets in every `.qmd` document. Adjust the relative path to `private/brand/assets/` based on
the template's location in the directory tree.

```yaml
format:
  html:
    theme:
      - cosmo
      - ../../../private/brand/assets/theme-light.scss
    css: ../../../private/brand/assets/styles.css
    toc: true
    toc-depth: 3
    toc-location: left
    number-sections: true
    self-contained: true
  pdf:
    documentclass: report
    papersize: letter
    geometry:
      - margin=1in
    fontsize: 11pt
    pdf-engine: typst
    toc: true
execute:
  echo: false
  warning: false
```

Path depth reference:

| Template location | Path prefix |
|-------------------|-------------|
| `skills/{skill}/templates/` | `../../../private/brand/assets/` |
| `skills/{skill}/docs/` | `../../../private/brand/assets/` |
| Project root | `private/brand/assets/` |

---

## CSS Class Index

### Severity Badges

Inline pill spans used in tables, headings, and prose.

| Class | Color | Hex | Usage |
|-------|-------|-----|-------|
| `.badge-critical` | Purple | `#7C3AED` | `[Critical]{.badge-critical}` |
| `.badge-high` | Red | `#DC2626` | `[High]{.badge-high}` |
| `.badge-medium` | Orange | `#EA580C` | `[Medium]{.badge-medium}` |
| `.badge-low` | Green | `#16A34A` | `[Low]{.badge-low}` |
| `.badge-info` | Blue | `#2563EB` | `[Info]{.badge-info}` |

### Finding Blocks

Card-style div containers for structured finding detail sections.

| Class | Border accent | Usage |
|-------|--------------|-------|
| `.finding-critical` | Purple | `::: {.finding-critical}` |
| `.finding-high` | Red | `::: {.finding-high}` |
| `.finding-medium` | Orange | `::: {.finding-medium}` |
| `.finding-low` | Green | `::: {.finding-low}` |
| `.finding-info` | Blue | `::: {.finding-info}` |

### Compliance Status Badges

| Class | Meaning | Usage |
|-------|---------|-------|
| `.status-compliant` | Passing | `[Compliant]{.status-compliant}` |
| `.status-partial` | Partially passing | `[Partial]{.status-partial}` |
| `.status-non-compliant` | Failing | `[Non-Compliant]{.status-non-compliant}` |
| `.status-na` | Not applicable | `[N/A]{.status-na}` |
| `.status-pending` | Awaiting review | `[Pending]{.status-pending}` |

### Risk Badges

| Class | Usage |
|-------|-------|
| `.risk-critical` | `[Critical]{.risk-critical}` |
| `.risk-high` | `[High]{.risk-high}` |
| `.risk-medium` | `[Medium]{.risk-medium}` |
| `.risk-low` | `[Low]{.risk-low}` |
| `.risk-accepted` | `[Accepted]{.risk-accepted}` |

### Priority Badges

Used in remediation roadmap tables.

| Class | Timeframe | Usage |
|-------|-----------|-------|
| `.priority-immediate` | 24–48 hours | `[Immediate]{.priority-immediate}` |
| `.priority-short-term` | 1–2 weeks | `[Short-Term]{.priority-short-term}` |
| `.priority-medium-term` | 1–3 months | `[Medium-Term]{.priority-medium-term}` |
| `.priority-long-term` | 3–6 months | `[Long-Term]{.priority-long-term}` |
| `.priority-accepted` | Risk accepted | `[Accepted]{.priority-accepted}` |

### Report Structure Classes

| Class | Element | Purpose |
|-------|---------|---------|
| `.report-header` | `div` | Full-width cover block at top of document |
| `.report-header-meta` | `div` (inside `.report-header`) | Grid of metadata key/value pairs |
| `.classification-notice` | `div` | Colored banner for classification marking |
| `.report-meta` | `table` | Formatted metadata table in report info section |

---

## Finding Block Syntax

Each finding gets its own fenced div. The severity class controls the left border color and background
tint. Use `####` (H4) for the finding title inside the block so it does not appear in the document TOC.

```markdown
::: {.finding-critical}
#### F-001: SQL Injection in Login Endpoint

**Severity:** [Critical]{.badge-critical} | **CVSS Score:** 9.8 | **CVSS Vector:** AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H

**Affected Asset(s):** `https://app.example.com/api/login`

**Status:** Open

**Description**

The login endpoint at `/api/login` concatenates user-supplied input directly into a SQL query
without parameterization, enabling authentication bypass and data exfiltration.

**Evidence**

```http
POST /api/login HTTP/1.1
Host: app.example.com
Content-Type: application/json

{"username": "admin'--", "password": "irrelevant"}
```

**Impact**

An unauthenticated attacker can bypass authentication and retrieve all records from the users table.

**Remediation**

Replace string concatenation with parameterized queries or a prepared statement library.

**References**

- [CWE-89](https://cwe.mitre.org/data/definitions/89.html)
- [OWASP A03:2021](https://owasp.org/Top10/A03_2021-Injection/)
:::
```

Standard fields for every finding block:

| Field | Required | Notes |
|-------|----------|-------|
| Title (H4) | Yes | Format: `F-NNN: [TITLE]` |
| Severity badge + CVSS | Yes | Use inline badge span |
| Affected asset | Yes | Use inline code for hostnames/URLs |
| Status | Yes | Open / Remediated / Accepted |
| Description | Yes | Technical description |
| Evidence | Yes | Request/response, screenshot reference, or PoC |
| Impact | Yes | Business and technical impact |
| Remediation | Yes | Actionable steps |
| References | Recommended | CVE, CWE, OWASP links |

---

## Badge Syntax in Tables

Quarto renders inline spans inside table cells in HTML output. Use the bracket-dot syntax:

```markdown
| Finding | Severity | Priority |
|---------|----------|----------|
| F-001 | [Critical]{.badge-critical} | [Immediate]{.priority-immediate} |
| F-002 | [High]{.badge-high} | [Short-Term]{.priority-short-term} |
| F-003 | [Medium]{.badge-medium} | [Medium-Term]{.priority-medium-term} |
```

Note: Badge spans render correctly in HTML output. In PDF output via Typst, they degrade gracefully to
plain text with no styling loss of content.

---

## Code Block Conventions

Use language identifiers on all fenced code blocks for syntax highlighting.

| Language ID | Use for |
|-------------|---------|
| `http` | Raw HTTP requests and responses |
| `bash` | Shell commands, one-liners |
| `python` | Python exploit code or scripts |
| `javascript` | XSS payloads, JS code |
| `sql` | SQL injection payloads, queries |
| `xml` | XXE payloads, SAML, XML config |
| `json` | API requests/responses, configs |
| `text` | Raw output with no highlighting |
| `nmap` | Nmap scan output (falls back to text) |

For collapsible code blocks in HTML output, set `code-fold: show` in the YAML frontmatter. Individual
blocks can override with the `#| code-fold: true` cell option.

---

## Report Header and Classification Notice

The `.report-header` block renders as a full-width panel at the top of the document. Place it
immediately after the YAML frontmatter, before the first section heading.

```markdown
::: {.report-header}
# [CLIENT NAME] Penetration Test Report

::: {.report-header-meta}
<span><span class="meta-label">Client</span>[CLIENT NAME]</span>
<span><span class="meta-label">Engagement</span>[ENGAGEMENT TYPE]</span>
<span><span class="meta-label">Report Date</span>[YYYY-MM-DD]</span>
<span><span class="meta-label">Report ID</span>[PT-YYYY-XXX]</span>
:::
:::
```

The `.classification-notice` banner follows immediately after:

```markdown
::: {.classification-notice .confidential}
CONFIDENTIAL — For Authorized Recipients Only
:::
```

Classification modifier classes (apply alongside `.classification-notice`):

| Modifier | Color | When to use |
|----------|-------|-------------|
| `.confidential` | Red/orange | Client-facing reports with sensitive data |
| `.internal` | Blue | Internal team documents |
| `.public` | Green | Published or sanitized reports |

---

## Callout Type Mapping

Use Quarto native callouts for non-finding annotations. Map callout types to their semantic meaning
in security reports:

| Callout type | Security use |
|--------------|-------------|
| `:::{.callout-warning}` | Scope boundary reminder, testing constraint |
| `:::{.callout-important}` | Critical remediation note, prerequisite action |
| `:::{.callout-note}` | Tester observation, context without severity |
| `:::{.callout-tip}` | Remediation best practice, positive finding |
| `:::{.callout-caution}` | Partial fix warning, residual risk notice |

Example:

```markdown
::: {.callout-important}
## Remediation Dependency

F-003 cannot be fully remediated until F-001 is resolved. Patching the injection endpoint first
eliminates the attack path that makes F-003 exploitable remotely.
:::
```

Do not use callout blocks as substitutes for `.finding-*` blocks. Finding blocks carry structured
metadata (CVSS, status, affected assets) that callouts do not.

---

## Section Includes — Modular Report Structure

Reports use Quarto's `{{< include >}}` shortcode to split content into separate files. The main
`.qmd` file contains only frontmatter and include directives. Section files are prefixed with `_`
so Quarto does not render them standalone.

**Template structure:**

```
tools/quarto/templates/reports/pentest/
├── pentest-report.qmd          # Frontmatter + include calls only
└── _sections/
    ├── _cover.qmd              # Report header, classification notice, metadata table
    ├── _executive-summary.qmd  # Risk summary, top findings, priority actions
    ├── _scope.qmd              # In-scope assets, methodology, tools
    ├── _findings.qmd           # Section headers + include calls for individual findings
    ├── _remediation.qmd        # Remediation roadmap table
    ├── _appendices.qmd         # Appendix sections with {.appendix} class
    └── _findings/
        ├── _f001-critical.qmd  # One file per finding
        ├── _f002-high.qmd
        └── ...
```

**Include syntax (paths relative to the including file):**

```markdown
{{< include _sections/_executive-summary.qmd >}}
```

**Path resolution:** Quarto resolves all `{{< include >}}` paths relative to the **top-level
document**, not the file doing the including. Nested includes must use the full path from
the project root. Example — in `_sections/_findings.qmd`:

```markdown
{{< include _sections/_findings/_f001-critical.qmd >}}
```

**Adding a new finding:** create `_sections/_findings/_fNNN-severity.qmd`, then add the
corresponding include line to `_sections/_findings.qmd` using the full path from `templates/`.

---

## Placeholder Images

Use `{{< placeholder >}}` to hold space for screenshots and evidence images during authoring.
Replace with actual captures before delivery.

```markdown
{{< placeholder 800 350 format=svg >}}
```

| Use case | Recommended size |
|----------|-----------------|
| Finding evidence / screenshot | `800 350` |
| Full-page tool output | `900 420` |
| Logo in report header | `240 72` |
| Low-detail / low-severity evidence | `800 200` |

**Replacing a placeholder:**

```markdown
<!-- Before: -->
{{< placeholder 800 350 format=svg >}}

<!-- After: -->
![SQL injection authentication bypass — admin session cookie returned](evidence/f001-sqli.png){width=800}
```

---

## Appendices

Mark appendix sections with the `{.appendix}` class on their H2 heading. Quarto collects and
formats them automatically with `appendix-style: default` set in frontmatter.

```yaml
---
appendix-style: default
---
```

```markdown
## Appendix A: Vulnerability References {.appendix}

| Finding | CVE | CVSS | CWE | OWASP |
|---------|-----|------|-----|-------|
...

## Appendix B: Raw Tool Output {.appendix}

{{< placeholder 900 420 format=svg >}}
```

Appendix sections placed in `_sections/_appendices.qmd` and included via `{{< include >}}`
are collected and formatted correctly — the `{.appendix}` class works across included files.

---

*Intelligence Adjacent Framework — Quarto Style Guide*
*See `tools/quarto/templates/reports/pentest/pentest-report.qmd` for a complete working template.*
