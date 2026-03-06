---
type: guide
title: Report Generation Pipeline
classification: internal
version: 1
last_updated: 2026-03-05
audience: practitioner
category: guides
---

# Report Generation Pipeline

All IA skill workflows (sec-review, pentest, code-review, gap-analysis, and others) follow the same report generation model: skill outputs are written to an engagement directory, then assembled into a Quarto-rendered HTML report. This guide covers how the pipeline works, what you can safely edit, and how to customize output that persists across re-generation.

---

## Overview

Each skill produces two categories of output:

1. **Source files** — `engagement.yaml` and `_sections/_findings/_F-NNN.qmd` files written by the skill workflow and editable by the practitioner.
2. **Generated files** — sections, the main report wrapper, and HTML, all written by `assemble-report.ts` → `report-generator.ts` → Quarto.

Running Generate overwrites all generated files. Source files are never touched by the generator.

---

## Pipeline Diagram

```
engagement.yaml
_sections/_findings/_f{N}-{severity}.qmd
                                            →  assemble-report.ts
                                            →  report-generator.ts
                                            →  _sections/_cover.qmd
                                               _sections/_executive-summary.qmd
                                               _sections/_scope.qmd
                                               _sections/_findings.qmd
                                               _sections/_recommendations.qmd
                                               _sections/_appendices.qmd
                                            →  {org}_{client}_{type}-report_DRAFT.qmd
                                            →  quarto render
                                            →  {org}_{client}_{type}-report_DRAFT.html
```

`assemble-report.ts` is the skill-specific entry point. It loads findings from the engagement directory and delegates to the centralized `tools/quarto/scripts/report-generator.ts`, which writes all section `.qmd` files, the main report wrapper, and (if `--render` is passed) triggers Quarto.

---

## Output Directory Structure

After generation, the engagement directory contains:

```
private/output/{skill}/{engagement}/
├── engagement.yaml                          # Source of truth — edit freely
├── _sections/
│   ├── _findings/
│   │   ├── _f001-high.qmd                   # Individual finding files — edit freely
│   │   ├── _f002-high.qmd
│   │   └── ...
│   ├── _cover.qmd                           # Generated — overwritten on every Generate
│   ├── _executive-summary.qmd               # Generated — overwritten on every Generate
│   ├── _scope.qmd                           # Generated — overwritten on every Generate
│   ├── _findings.qmd                        # Generated — overwritten on every Generate
│   ├── _recommendations.qmd                 # Generated — overwritten on every Generate
│   └── _appendices.qmd                      # Generated — overwritten on every Generate
├── {org}_{client}_{type}-report_DRAFT.qmd   # Generated main wrapper
└── {org}_{client}_{type}-report_DRAFT.html  # Rendered output
```

**sec-review only** — nine appendix documents are also generated, one per deliverable area:

```
├── {org}_{client}_Appendix-A_architecture-analysis_DRAFT.qmd/.html
├── {org}_{client}_Appendix-B_threat-model_DRAFT.qmd/.html
├── {org}_{client}_Appendix-C_findings-detail_DRAFT.qmd/.html
├── {org}_{client}_Appendix-D_security-practices_DRAFT.qmd/.html
├── {org}_{client}_Appendix-E_patch-assessment_DRAFT.qmd/.html
├── {org}_{client}_Appendix-F_supply-chain-review_DRAFT.qmd/.html
├── {org}_{client}_Appendix-G_recommendations_DRAFT.qmd/.html
├── {org}_{client}_Appendix-H_gap-analysis_DRAFT.qmd/.html
└── {org}_{client}_Appendix-I_action-items_DRAFT.qmd/.html
```

Each appendix wraps a corresponding root-level `.md` file (e.g., `architecture-analysis.md`) via Quarto `{{< include >}}`. If the source `.md` does not exist yet, the appendix renders a placeholder message.

**Filename slugging** — `{org}` and `{client}` are lowercased and non-alphanumeric characters replaced with hyphens. For example, `reviewer_org: "Fortreum"` and `client_name: "Digital Realty Trust"` produces `fortreum_digital-realty-trust_sec-review-report_DRAFT.qmd`.

---

## What Is Safe to Edit vs. What Gets Overwritten

| File | Safe to edit? | Notes |
|------|---------------|-------|
| `engagement.yaml` | Yes | Primary edit target for all metadata, narrative overrides |
| `_sections/_findings/_f{N}-{severity}.qmd` — body below metadata block | Yes | Free-form markdown; edit without restriction |
| `_sections/_findings/_f{N}-{severity}.qmd` — `<!-- ia:finding ... -->` block | With care | Fields feed the risk tables and finding index; see Finding Metadata below |
| `_sections/_cover.qmd` | No | Overwritten on every Generate |
| `_sections/_executive-summary.qmd` | No | Overwritten on every Generate |
| `_sections/_scope.qmd` | No | Overwritten on every Generate |
| `_sections/_findings.qmd` | No | Overwritten on every Generate |
| `_sections/_recommendations.qmd` | No | Overwritten on every Generate |
| `_sections/_appendices.qmd` | No | Overwritten on every Generate |
| `{org}_{client}_{type}-report_DRAFT.qmd` | No | Overwritten on every Generate |
| Root `.md` files (e.g., `FINDINGS.md`, `EXECUTIVE-SUMMARY.md`) | Reference only | Written by the skill workflow; not read back by the generator |
| Appendix source `.md` files (sec-review) | Yes | `architecture-analysis.md`, `threat-model.md`, etc. — included verbatim into appendix `.qmd` wrappers |

---

## engagement.yaml Field Reference

`engagement.yaml` is the single source of truth for all report metadata. All fields are strings unless noted.

| Field | Type | Description |
|-------|------|-------------|
| `project_name` | string | Repository or system name |
| `project_version` | string | Version, tag, or snapshot identifier |
| `repo_url` | string | Repository URL (displayed in scope section) |
| `primary_language` | string | Primary programming language |
| `frameworks` | string or array | Frameworks/platforms in scope |
| `client_name` | string | Client organization name |
| `client_contact` | string | Primary client contact name |
| `client_title` | string | Client contact's title |
| `client_email` | string | Client contact email |
| `engagement_id` | string | Unique engagement identifier (e.g., `SR-2026-001`) |
| `engagement_type` | string | Engagement category |
| `assessment_type` | string | Displayed in cover metadata (e.g., `Security Architecture Review`) |
| `classification` | string | Document classification label (e.g., `Confidential`, `Restricted`) |
| `draft` | boolean | `true` adds DRAFT watermark and `_DRAFT` filename suffix |
| `start_date` | string | Assessment start date (`YYYY-MM-DD`) |
| `end_date` | string | Assessment end date (`YYYY-MM-DD`) |
| `report_date` | string | Report publication date (`YYYY-MM-DD`) |
| `report_version` | string | Report version string (e.g., `1.0`) |
| `reviewer_name` | string | Assessor name |
| `reviewer_org` | string | Assessor organization |
| `reviewer_contact` | string | Assessor email or contact |
| `scope_in` | array | In-scope items, pipe-delimited: `Path \| Type \| Description` |
| `scope_out` | array | Out-of-scope items (plain strings) |
| `compliance` | array | Applicable compliance frameworks |
| `tools` | array | Tools used, pipe-delimited: `Name \| Purpose \| Version` |
| `narrative` | object | Section override blocks — see Narrative Overrides below |

### scope_in format

Each entry is a pipe-delimited string rendered as a table row:

```yaml
scope_in:
  - "api/v1/ | REST API | Authentication and authorization endpoints"
  - "src/auth/ | Source | Authentication module"
  - "infrastructure/ | IaC | Terraform configuration"
```

---

## Narrative Overrides

This is the primary mechanism for adding custom prose to generated sections without losing it when Generate runs again.

### What it solves

Generated sections (executive summary, scope, recommendations, and others) are computed from `engagement.yaml` and findings data on every Generate run. Any prose written directly into `_sections/_executive-summary.qmd` will be overwritten. Narrative overrides survive Generate runs because they live in `engagement.yaml`.

### How it works

After each section is generated, `report-generator.ts` calls `applyNarrative()`, which checks for matching keys in the `narrative:` block and injects content at the appropriate position.

### Three modes

| Key pattern | Effect |
|-------------|--------|
| `{section}_prefix` | Injected before generated content |
| `{section}_suffix` | Injected after generated content (most common use) |
| `{section}_override` | Replaces generated content entirely |

When `{section}_override` is present, prefix and suffix keys for that section are ignored.

### Supported sections

| Section key | Corresponds to |
|-------------|---------------|
| `cover` | `_sections/_cover.qmd` |
| `executive_summary` | `_sections/_executive-summary.qmd` |
| `scope` | `_sections/_scope.qmd` |
| `findings` | `_sections/_findings.qmd` |
| `recommendations` | `_sections/_recommendations.qmd` |
| `appendices` | `_sections/_appendices.qmd` |

### Example

```yaml
narrative:
  executive_summary_suffix: |
    Digital Realty's environment demonstrates strong network segmentation across
    colocation facilities, but gaps in secrets management and supply chain controls
    represent the highest-priority remediation targets for Q2 2026.

  recommendations_prefix: |
    The following roadmap is sequenced by exploitability and business impact.
    P0 and P1 items should be addressed before the next assessment window opens.

  scope_suffix: |
    Assessment was conducted under limited-access conditions. Production database
    credentials were not provided; database-layer findings rely on static analysis.
```

The `engagement.yaml` generated by the skill workflow includes a commented-out `narrative:` block as a template. Uncomment and fill in the keys you need.

### Applies to all report types

All skill report types (sec-review, pentest, code-review, gap-analysis, incident, vuln-scan, seg-test, advisory, risk-assess, test-plan) call `generateReport()`, which applies narrative overrides. The same pattern works across all of them.

---

## Editing Individual Findings

Finding files in `_sections/_findings/` have two distinct parts.

### Part 1 — Metadata block

```
<!-- ia:finding
id: SR-001
domain: B
severity: high
priority: P0
status: open
title: "Code Not Reviewed Before Merging"
component: "[component]"
stride: "T (Tampering)"
likelihood: high
impact: high
cwe: "CWE-1003"
nist_csf: "PR.IP"
owasp: "OWASP"
-->
```

This block is parsed by `assemble-report.ts` to build the risk distribution table, finding index, recommendations section, and appendices. Edit carefully — changing `severity` or `priority` affects where the finding appears in all generated content.

Supported metadata fields:

| Field | Purpose |
|-------|---------|
| `id` | Finding identifier (e.g., `SR-001`) — used in cross-references |
| `severity` | `critical`, `high`, `medium`, `low`, or `info` — drives sort order and badge color |
| `priority` | `P0`–`P4` — drives recommendations grouping |
| `status` | `open`, `closed`, `accepted`, `mitigated` — shown in appendix status table |
| `title` | Short finding title |
| `component` | Affected system component |
| `domain` | Assessment domain (sec-review specific) |
| `stride` | STRIDE category |
| `likelihood` | `critical`, `high`, `medium`, `low` |
| `impact` | `critical`, `high`, `medium`, `low` |
| `cwe` | CWE identifier — included in CWE reference appendix |
| `owasp` | OWASP category reference |
| `nist_csf` | NIST CSF control mapping |

### Part 2 — Body content

Everything below the closing `-->` is free-form Quarto markdown. Edit freely — the generator does not read or modify finding body content. Structure typically includes Description, Impact, and Remediation subsections, but there is no enforced schema.

---

## Rich Content in Findings

Finding body content is free-form Quarto markdown. The following content types all work within `_sections/_findings/_F-NNN.qmd` files and are fully embedded in the `self-contained: true` HTML output.

---

### Images and Screenshots

Store evidence images in `_sections/_findings/screenshots/` relative to the engagement root. Image paths within finding QMDs are resolved relative to **the finding file's own directory** (`_sections/_findings/`), not the engagement root.

```
private/output/sec-review/{engagement}/
└── _sections/
    └── _findings/
        ├── _f001-high.qmd
        └── screenshots/
            ├── f001-evidence.png
            └── f001-architecture.png
```

Embed in the finding body:

```markdown
![Branch protection disabled — no required reviewers](screenshots/f001-evidence.png)
```

Add a caption and optional width constraint:

```markdown
![GitHub repository settings showing branch protection disabled](screenshots/f001-evidence.png){width=80%}
```

Because reports are rendered with `self-contained: true`, all local images are base64-encoded and embedded in the HTML output. The delivered `.html` file is fully portable — no external assets required.

> **Path rule:** Paths in finding QMDs are relative to `_sections/_findings/`, not the engagement root. A path of `screenshots/f001.png` resolves to `_sections/_findings/screenshots/f001.png`.

---

### Code Blocks

Use standard fenced code blocks with a language identifier. Quarto/Pandoc applies syntax highlighting at render time.

````markdown
**Evidence — unprotected merge configuration:**

```yaml
# .github/branch-protection.yml — file does not exist
# No branch protection rules configured
```

**Recommended configuration:**

```yaml
branch_protection:
  main:
    required_pull_request_reviews:
      required_approving_review_count: 1
    required_status_checks:
      strict: true
      contexts: ["snyk/security-scan"]
    enforce_admins: true
```
````

Supported language identifiers include: `bash`, `python`, `javascript`, `typescript`, `yaml`, `json`, `sql`, `hcl`, `dockerfile`, `go`, `rust`, and all other languages supported by Pandoc's syntax highlighter.

For terminal output or generic text with no highlighting:

````markdown
```
$ git push origin main
remote: Bypassed required status checks
To github.com:org/repo.git
   abc1234..def5678  main -> main
```
````

---

### Mermaid Diagrams

Quarto has native Mermaid support. Use a fenced code block with `{mermaid}` (curly braces = Quarto executable block).

````markdown
```{mermaid}
flowchart LR
    Dev[Developer] -->|direct push| Main[main branch]
    Main -->|auto-deploy| Prod[Production]
    style Main fill:#ff4444,color:#fff
    style Prod fill:#ff4444,color:#fff
```
````

For architecture diagrams showing a trust boundary violation:

````markdown
```{mermaid}
graph TD
    Internet -->|unauthenticated| API[API Gateway]
    API -->|no mTLS| Service[Internal Service]
    Service -->|plaintext| DB[(Database)]

    classDef vuln fill:#ff4444,color:#fff,stroke:#cc0000
    class API,Service vuln
```
````

Pre-rendered `.svg` files (e.g. from the Mermaid editor at `/mermaid-editor-start`) can also be embedded as standard images:

```markdown
![Attack path diagram](screenshots/DRT-attack-path.svg){width=100%}
```

---

### Tables

Standard Quarto/Pandoc pipe tables work in finding body content:

```markdown
| Vector | Description | Exploitability |
|--------|-------------|----------------|
| Direct push to main | No branch protection | Trivial |
| PR merge without review | No required reviewers | Trivial |
| Snyk bypass | No hard merge gate | Easy |
```

---

### Callout Blocks

Quarto callout blocks render as styled notices in HTML output:

```markdown
::: {.callout-warning}
**Verified During Assessment**
This finding was confirmed by direct observation of the GitHub repository settings
on 2026-02-28. Screenshots are attached above.
:::

::: {.callout-note}
**Client Response**
Client confirmed during intake that branch protection was intentionally disabled
to reduce developer friction during a migration period.
:::
```

Available callout types: `callout-note`, `callout-warning`, `callout-important`, `callout-tip`, `callout-caution`.

---

## Triggering Generation

### CLI

Run from the framework root:

```bash
bun skills/sec-review/scripts/assemble-report.ts \
  --engagement private/output/sec-review/{engagement}/engagement.yaml \
  --render
```

Omit `--render` to write `.qmd` files only without invoking Quarto. This is useful for previewing generated content or when Quarto is not available.

Each skill has its own assembler at `skills/{skill}/scripts/assemble-report.ts`. The `--engagement` path must be within the current working directory.

### Monitor Studio

Select the engagement from the engagement list and click **Generate**. The `--render` flag is implied — HTML output is always produced.

---

## Draft vs. Final

Controlled by `draft:` in `engagement.yaml` or by passing `--draft` on the CLI.

| State | Effect |
|-------|--------|
| `draft: true` | DRAFT watermark (diagonal, semi-transparent) injected via CSS; filename includes `_DRAFT` suffix; classification notice reads "DRAFT — PRE-DECISIONAL \| For Internal Review Only" |
| `draft: false` | No watermark; filename has no suffix; classification notice reads "RESTRICTED — For Authorized Recipients Only" |

The default behavior when `draft` is not specified is to treat the report as a draft. Set `draft: false` explicitly when producing final deliverables.

---

**Version:** 1.0
**Last Updated:** 2026-03-05
**Framework:** Intelligence Adjacent (IA)
