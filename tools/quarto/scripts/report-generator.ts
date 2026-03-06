#!/usr/bin/env bun
/**
 * Centralized Report Generator for IA Security Reports
 *
 * All report types (pentest, sec-review, code-review) use this generator.
 * Brand assets are loaded from: private/brand/assets/
 * Section definitions loaded from: tools/quarto/templates/templates.yaml
 *
 * Usage:
 *   import { generateReport } from "./report-generator";
 *   generateReport(engagement, findings, options);
 */

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync } from "fs";
import { join, dirname, relative, resolve } from "path";
import { parse } from "yaml";
import { spawnSync } from "child_process";

// ── Paths ──────────────────────────────────────────────────────────────────────
const FRAMEWORK_ROOT = resolve(join(import.meta.dir, "../../.."));
const TEMPLATES_CONFIG = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");

// ── Types ──────────────────────────────────────────────────────────────────────
type BaseEng = Record<string, string | string[] | boolean>;

interface Finding {
  id: string;
  severity: string;
  priority: string;
  title: string;
  status: string;
  [key: string]: unknown;
}

interface ReportOptions {
  reportType: ReportType;
  sections?: SectionConfig[];
}

type ReportType = "pentest" | "sec-review" | "code-review" | "advisory" | "test-plan" | "gap-analysis" | "risk-assess" | "incident" | "vuln-scan" | "seg-test";

interface SectionConfig {
  id: string;
  template: string;
  order: number;
}

interface TemplateSection {
  name: string;
  file: string;
  required: boolean;
  description?: string;
  content_template?: string;
  nested?: boolean;
  children_template?: string;
}

interface UniqueSection {
  id: string;
  name: string;
  file: string;
  description: string;
  required: boolean;
  content_template: string;
}

interface SkillConfig {
  name: string;
  report_type: string;
  sections: string[];
  unique_sections: UniqueSection[];
}

interface TemplatesConfig {
  version: string;
  sections: Record<string, TemplateSection>;
  skills: Record<string, SkillConfig>;
}

// ── Load Config ──────────────────────────────────────────────────────────────
function loadTemplatesConfig(): TemplatesConfig {
  const content = readFileSync(TEMPLATES_CONFIG, "utf-8");
  return parse(content) as TemplatesConfig;
}

// ── Constants ─────────────────────────────────────────────────────────────────
export const UNSAFE_QMD = /[\n\r`\{\}<>]/g;

export const SEV_ORDER: Record<string, number> = {
  critical: 1, high: 2, medium: 3, low: 4, info: 5,
};

export const SEV_TO_PRI: Record<string, string> = {
  critical: "P0", high: "P1", medium: "P2", low: "P3", info: "P4",
};

// ── Helpers ─────────────────────────────────────────────────────────────────
export function str(e: BaseEng, key: string): string {
  const v = e[key];
  if (typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return (v as unknown[]).map(String).join(", ");
  const raw = (v as string | undefined) ?? `[${key.replace(/_/g, " ").toUpperCase()}]`;
  return raw.replace(UNSAFE_QMD, " ").trim();
}

export function arr(e: BaseEng, key: string): string[] {
  return (e[key] as string[] | undefined) ?? [];
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function loadEngagement(yamlPath: string): BaseEng {
  return parse(readFileSync(yamlPath, "utf-8")) as BaseEng;
}

// ── Brand ────────────────────────────────────────────────────────────────────
/**
 * Detects logo and returns proper img tag or placeholder.
 * Checks private/brand/assets/ for logo.{webp,png,jpg,jpeg,svg}.
 */
export function detectLogo(engDir: string): string {
  const exts = ["webp", "png", "jpg", "jpeg", "svg"];
  const prefix = relative(resolve(engDir), process.cwd());
  const ext = exts.find(e => existsSync(resolve(`private/brand/assets/logo.${e}`)));
  return ext
    ? `![](${prefix}/private/brand/assets/logo.${ext}){width=200}`
    : `{{< placeholder 240 72 format=svg >}}`;
}

/**
 * Generates YAML frontmatter with brand theme.
 */
export function genFrontmatter(
  title: string,
  author: string,
  engDir: string,
  footerInfo?: { companyName: string; assessmentType: string; clientName: string },
  draft?: boolean
): string {
  const prefix = relative(resolve(engDir), process.cwd());
  const footerInclude = footerInfo
    ? `
includes:
  after-body: _sections/_footer.html`
    : "";

  const draftInclude = draft
    ? `
include-in-header:
  - text: |
      <style>
      body::before {
        content: "DRAFT";
        position: fixed; top: 50%; left: 50%;
        transform: translate(-50%, -50%) rotate(-35deg);
        font-size: 18vw; font-weight: 900;
        color: rgba(180, 0, 0, 0.07);
        pointer-events: none; z-index: 9999;
        white-space: nowrap;
      }
      </style>`
    : "";

  return `---
title: "${title}"
author: "${author}"
date: today
appendix-style: default
format:
  html:
    theme:
      - cosmo
      - ${prefix}/private/brand/assets/theme-light.scss
    css: ${prefix}/private/brand/assets/styles.css
    toc: true
    toc-depth: 3
    toc-location: left
    number-sections: false
    self-contained: true
  pdf:
    documentclass: report
    papersize: letter
    geometry:
      - margin=1in
    fontsize: 11pt
    pdf-engine: typst
    toc: true${footerInclude}${draftInclude}
execute:
  echo: false
  warning: false
---`;
}

// ── Section Generators ───────────────────────────────────────────────────────

/**
 * Generate cover section with logo, title, metadata
 */
export function genCover(
  e: BaseEng,
  engDir: string,
  options: ReportOptions
): string {
  const cls = str(e, "classification").toLowerCase();
  const logo = detectLogo(engDir);
  const typeTitles: Record<string, string> = {
    "pentest": "Penetration Test Report",
    "sec-review": "Security Architecture Review",
    "code-review": "Security Code Review",
    "advisory": "Security Advisory",
    "test-plan": "Test Plan",
    "gap-analysis": "Gap Analysis Report",
    "risk-assess": "Risk Assessment Report",
    "incident": "Incident Response Report",
    "vuln-scan": "Vulnerability Scan Report",
    "seg-test": "Network Segmentation Test",
  };
  const title = typeTitles[options.reportType] || "Security Report";

  const draft = str(e, "draft").toLowerCase() === "true" ? `\n<div class="draft-banner">NOT FOR DISTRIBUTION</div>\n` : "";

return `\
${draft}::: {.report-header}
${logo}

# ${title} {.unnumbered .unlisted}

<span class="report-target">${str(e, "client_name")}</span>

::: {.report-header-meta}
<span><span class="meta-label">Organization</span>${str(e, "client_name")}</span>
<span><span class="meta-label">Report Date</span>${str(e, "report_date")}</span>
<span><span class="meta-label">Engagement ID</span>${str(e, "engagement_id")}</span>
:::
:::

::: {.classification-notice .${cls}}
${str(e, "classification").toUpperCase()} — For Authorized Recipients Only
:::

## Report Information {.unnumbered .unlisted}

::: {.report-meta}
| Field | Value |
|-------|-------|
| Engagement | ${str(e, "engagement_id")} |
| Review Period | ${str(e, "start_date")} — ${str(e, "end_date")} |
| Report Date | ${str(e, "report_date")} |
| Report Version | ${str(e, "report_version")} |
| Prepared By | ${str(e, "reviewer_name")}, ${str(e, "reviewer_org")} |
:::
`;
}

/**
 * Generate executive summary section
 */
export function genExecutiveSummary(
  e: BaseEng,
  findings: Finding[],
  options: ReportOptions
): string {
  const counts: Record<string, number> = { critical: 0, high: 0, medium: 0, low: 0, info: 0 };
  for (const f of findings) if (f.severity in counts) counts[f.severity]++;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  // Group findings by priority
  const byPri: Record<string, Finding[]> = {};
  for (const f of findings) (byPri[f.priority] ??= []).push(f);

  const priMeta: Record<string, [string, string]> = {
    P0: ["Critical", "Remediate immediately"],
    P1: ["High", "Remediate within sprint"],
    P2: ["Medium", "Plan remediation"],
    P3: ["Low", "Backlog"],
    P4: ["Informational", "Consider addressing"],
  };

  const riskRow = (sev: string, label: string, pri: string) =>
    `| ${pri} | [${label}]{.badge-${sev}} | ${counts[sev] ?? 0} |`;

  // Build priority recommendations
  const recSections: string[] = [];
  for (const pri of ["P0", "P1", "P2", "P3"]) {
    const [label, guidance] = priMeta[pri] ?? [pri, ""];
    const group = byPri[pri];
    if (!group?.length) {
      recSections.push(`**${pri} (${label})** — ${guidance}: _none_`);
      continue;
    }
    const items = group.map(f => `${f.id}: ${f.title}`).join("; ");
    recSections.push(`**${pri} (${label})** — ${guidance}: ${items}`);
  }

  const assessmentDesc = options.reportType === "pentest" ? "penetration test" :
    options.reportType === "sec-review" ? "security review" :
    options.reportType === "code-review" ? "code review" :
    options.reportType === "advisory" ? "security advisory engagement" :
    options.reportType === "vuln-scan" ? "vulnerability scan" :
    options.reportType === "seg-test" ? "segmentation test" :
    "assessment";

  return `\
# Executive Summary

${str(e, "reviewer_org")} conducted a ${assessmentDesc} of **${str(e, "project_name")}**
for ${str(e, "client_name")} from ${str(e, "start_date")} through ${str(e, "end_date")}.
The assessment identified **${total} finding(s)**.

## Risk Distribution

| Priority | Risk Level | Count |
|----------|------------|-------|
${riskRow("critical", "Critical", "P0")}
${riskRow("high", "High", "P1")}
${riskRow("medium", "Medium", "P2")}
${riskRow("low", "Low", "P3")}
${riskRow("info", "Informational", "P4")}
| | **Total** | **${total}** |

## Recommendations

${recSections.join("\n\n")}
`;
}

/**
 * Generate scope section
 */
export function genScope(e: BaseEng): string {
  const inRows = arr(e, "scope_in").map(r => {
    const parts = r.split("|").map(s => s.trim());
    while (parts.length < 3) parts.push("—");
    return `| ${parts.slice(0, 3).join(" | ")} |`;
  }).join("\n");

  const outItems = arr(e, "scope_out").map(s => `- ${s}`).join("\n");
  const compItems = arr(e, "compliance").map(s => `- ${s}`).join("\n");

  return `\
# Scope and Methodology

## Codebase Overview

| Attribute | Value |
|-----------|-------|
| Repository | ${str(e, "repo_url")} |
| Version | ${str(e, "project_version")} |
| Primary Language | ${str(e, "primary_language")} |
| Frameworks | ${str(e, "frameworks")} |

## In-Scope Paths

| Path | Type | Description |
|------|------|-------------|
${inRows || "| — | — | — |"}

## Out-of-Scope

${outItems || "_No explicit exclusions documented._"}

## Analysis Methodology

| Phase | Focus |
|-------|-------|
| 1 — Reconnaissance | Information gathering, asset discovery |
| 2 — Vulnerability Analysis | Pattern matching, CVE lookup |
| 3 — Exploitation | Proof of concept development |
| 4 — Reporting | Documentation and remediation guidance |

## Compliance Frameworks

${compItems || "_No frameworks specified._"}
`;
}

/**
 * Generate findings index section
 */
export function genFindingsIndex(findings: Finding[]): string {
  if (findings.length === 0) return "# Findings\n\n_No findings documented._\n";

  const bySev: Record<string, Finding[]> = {};
  for (const f of findings) (bySev[f.severity] ??= []).push(f);

  const order = ["critical", "high", "medium", "low", "info"];
  const lines: string[] = ["# Findings\n"];

  for (const sev of order) {
    const group = bySev[sev];
    if (!group?.length) continue;
    lines.push(`## ${cap(sev)} Findings\n`);
    for (const f of group) {
      lines.push(`{{< include _sections/_findings/_f${f.id.replace(/[^0-9]/g, "")}-${sev}.qmd >}}`);
    }
  }
  return lines.join("\n");
}

/**
 * Generate recommendations section
 */
export function genRecommendations(findings: Finding[]): string {
  if (findings.length === 0) return "# Recommendations\n\n_No findings to remediate._\n";

  const byPri: Record<string, Finding[]> = {};
  for (const f of findings) (byPri[f.priority] ??= []).push(f);

  const priMeta: Record<string, [string, string]> = {
    P0: ["Critical", "Remediate immediately"],
    P1: ["High", "Remediate within sprint"],
    P2: ["Medium", "Plan remediation"],
    P3: ["Low", "Backlog"],
    P4: ["Informational", "Consider addressing"],
  };

  const header = `\
# Recommendations

| Priority | Criteria | Response |
|----------|----------|----------|
| P0 | Exploitable now, high impact | Remediate immediately |
| P1 | Significant risk, likely exploitable | Remediate within sprint |
| P2 | Moderate risk, harder to exploit | Plan remediation |
| P3 | Defense-in-depth, low impact | Backlog |

`;

  const sections: string[] = [];
  for (const pri of ["P0", "P1", "P2", "P3", "P4"]) {
    const [label, criteria] = priMeta[pri] ?? [pri, pri];
    const group = byPri[pri];
    if (!group?.length) {
      sections.push(`## ${pri} — ${label}\n\n_No ${pri} findings identified._\n`);
      continue;
    }
    const rows = group.map(f => {
      const sev = cap(f.severity);
      return `| ${f.id} | ${f.title} | [${sev}]{.badge-${f.severity}} |`;
    }).join("\n");
    sections.push(
      `## ${pri} — ${label}\n\n*${criteria}*\n\n| ID | Finding | Severity |\n|----|---------|----------|\n${rows}\n`
    );
  }

  return header + sections.join("\n");
}

/**
 * Generate appendices section
 */
export function genAppendices(findings: Finding[]): string {
  const rows = findings
    .filter(f => f.cwe || f.owasp)
    .map(f => `| ${f.id} | ${f.cwe || "—"} | ${f.owasp || "—"} |`)
    .join("\n");

  return `\
## Appendix A: CWE Reference Index {.appendix}

| Finding | CWE | OWASP |
|---------|-----|-------|
${rows || "| — | — | — |"}

## Appendix B: Finding Status {.appendix}

| ID | Title | Severity | Status |
|----|-------|----------|--------|
${findings.map(f => `| ${f.id} | ${f.title} | ${cap(f.severity)} | ${cap(f.status)} |`).join("\n")}
`;
}

/**
 * Get section include statements based on skill config
 */
export function getSectionIncludes(reportType: ReportType): string[] {
  const config = loadTemplatesConfig();
  const skillConfig = config.skills[reportType.replace(/-/g, "_")];

  if (!skillConfig) {
    // Fallback to default sections if skill not found
    return [
      "_sections/_cover.qmd",
      "_sections/_executive-summary.qmd",
      "_sections/_scope.qmd",
      "_sections/_findings.qmd",
      "_sections/_appendices.qmd",
    ];
  }

  const includes: string[] = [];

  // Add base sections
  for (const sectionId of skillConfig.sections) {
    const section = config.sections[sectionId];
    if (section) {
      includes.push(`_sections/${section.file}`);
    }
  }

  // Add unique sections
  for (const unique of skillConfig.unique_sections) {
    includes.push(`_sections/${unique.file}`);
  }

  return includes;
}

// ── Main Report Generator ─────────────────────────────────────────────────

export interface GenerateReportOptions {
  engagementPath: string;
  findingsDir: string;
  outputDir: string;
  reportType: ReportType;
  render?: boolean;
  draft?: boolean;
}

/**
 * Main entry point - generates all report sections
 */
export function generateReport(options: GenerateReportOptions): void {
  const { engagementPath, findingsDir, outputDir, reportType, render = false, draft = true } = options;

  const eng = loadEngagement(engagementPath);
  const engDir = dirname(engagementPath);
  const sectDir = join(engDir, "_sections");

  const findings = loadFindings(findingsDir);
  const sectionIncludes = getSectionIncludes(reportType);

  // Narrative overrides — keyed by section filename stem
  const narrative = (eng.narrative as Record<string, string> | undefined) ?? {};
  const SECTION_NARRATIVE_KEYS: Record<string, string> = {
    "_cover.qmd":              "cover",
    "_executive-summary.qmd":  "executive_summary",
    "_scope.qmd":              "scope",
    "_findings.qmd":           "findings",
    "_recommendations.qmd":    "recommendations",
    "_appendices.qmd":         "appendices",
  };

  const sectionGenerators: Record<string, () => string> = {
    "_cover.qmd": () => genCover(eng, engDir, { reportType }),
    "_executive-summary.qmd": () => genExecutiveSummary(eng, findings, { reportType }),
    "_scope.qmd": () => genScope(eng),
    "_findings.qmd": () => genFindingsIndex(findings),
    "_recommendations.qmd": () => genRecommendations(findings),
    "_appendices.qmd": () => genAppendices(findings),
  };

  for (const includePath of sectionIncludes) {
    const filename = includePath.replace("_sections/", "");
    const generator = sectionGenerators[filename];

    if (generator) {
      const raw = generator();
      const narrativeKey = SECTION_NARRATIVE_KEYS[filename];
      const content = narrativeKey ? applyNarrative(raw, narrative, narrativeKey) : raw;
      const fullPath = join(sectDir, filename);
      const parentDir = dirname(fullPath);
      if (!existsSync(parentDir)) {
        const parts = fullPath.split("/");
        let current = sectDir;
        for (let i = 0; i < parts.length - 1; i++) {
          current = join(current, parts[i]);
          if (!existsSync(current)) {
            mkdirSync(current, { recursive: true });
          }
        }
      }
      writeFileSync(fullPath, content, "utf-8");
      console.log(`  Wrote ${includePath}`);
    }
  }

  const typeTitles: Record<string, string> = {
    "pentest": "Penetration Test Report",
    "sec-review": "Security Architecture Review",
    "code-review": "Security Code Review",
    "advisory": "Security Advisory",
    "test-plan": "Test Plan",
    "gap-analysis": "Gap Analysis Report",
    "risk-assess": "Risk Assessment Report",
    "incident": "Incident Response Report",
    "vuln-scan": "Vulnerability Scan Report",
    "seg-test": "Network Segmentation Test",
  };
  const title = `${typeTitles[reportType]}: ${str(eng, "client_name")}`;

  const includesContent = sectionIncludes.map(include => `{{< include ${include} >}}`).join("\n\n");

  const footerInfo = {
    companyName: str(eng, "reviewer_org"),
    assessmentType: typeTitles[reportType] || "Security Assessment",
    clientName: str(eng, "client_name"),
  };

  const footerContent = `<footer class="report-footer">
<span>${footerInfo.companyName}</span> |
<span>${footerInfo.assessmentType}</span> |
<span>${footerInfo.clientName}</span>
</footer>
`;
  const footerPath = join(sectDir, "_footer.html");
  writeFileSync(footerPath, footerContent, "utf-8");
  console.log(`  Wrote _sections/_footer.html`);

  const mainQmd = `${genFrontmatter(title, str(eng, "reviewer_org"), engDir, footerInfo, draft)}

${includesContent}
`;

  const orgSlug = slugify(str(eng, "reviewer_org"));
  const clientSlug = slugify(str(eng, "client_name"));
  const typeSlug = reportType;
  const draftSuffix = draft ? "_DRAFT" : "";
  const mainFilename = `${orgSlug}_${clientSlug}_${typeSlug}-report${draftSuffix}.qmd`;
  const mainPath = join(engDir, mainFilename);
  writeFileSync(mainPath, mainQmd, "utf-8");
  console.log(`  Wrote ${mainFilename}`);

  if (reportType === "sec-review") {
    const classificationNotice = draft
      ? "DRAFT — PRE-DECISIONAL | For Internal Review Only"
      : "RESTRICTED — For Authorized Recipients Only";
    genSecReviewAppendices(eng, engDir, draft, classificationNotice);
  }

  if (render) {
    console.log("Rendering report...");
    const result = spawnSync("bun", [
      "tools/quarto/scripts/render.ts",
      mainPath,
      "--format", "html"
    ], { stdio: "inherit" });
    if (result.status !== 0) {
      console.error(`Render failed with code ${result.status}`);
    }
  }

  console.log("Report generation complete.");
}

// ── Narrative overrides ───────────────────────────────────────────────────────

/**
 * Applies narrative overrides from engagement.yaml to a generated section.
 *
 * Supported keys (where {key} is the section name, e.g. "executive_summary"):
 *   narrative.{key}_prefix   — injected before generated content
 *   narrative.{key}_suffix   — injected after generated content
 *   narrative.{key}_override — replaces generated content entirely
 */
function applyNarrative(
  generated: string,
  narrative: Record<string, string>,
  key: string
): string {
  const override = narrative[`${key}_override`];
  if (override !== undefined) return override;

  const prefix = narrative[`${key}_prefix`];
  const suffix = narrative[`${key}_suffix`];
  let result = generated;
  if (prefix) result = `${prefix.trim()}\n\n${result}`;
  if (suffix) result = `${result.trimEnd()}\n\n${suffix.trim()}\n`;
  return result;
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

const SEC_REVIEW_APPENDICES = [
  { letter: "A", title: "Architecture Analysis",  source: "architecture-analysis" },
  { letter: "B", title: "Threat Model",           source: "threat-model" },
  { letter: "C", title: "Findings Detail",        source: "findings-detail" },
  { letter: "D", title: "Security Practices",     source: "security-practices" },
  { letter: "E", title: "Patch Assessment",       source: "patch-assessment" },
  { letter: "F", title: "Supply Chain Review",    source: "supply-chain-review" },
  { letter: "G", title: "Recommendations",        source: "recommendations" },
  { letter: "H", title: "Gap Analysis",           source: "gap-analysis" },
  { letter: "I", title: "Action Items",           source: "action-items" },
];

function genSecReviewAppendices(
  eng: BaseEng,
  engDir: string,
  draft: boolean,
  classificationNotice: string
): void {
  const appendicesDir = join(engDir, "_appendices");
  mkdirSync(appendicesDir, { recursive: true });

  const orgSlug = slugify(str(eng, "reviewer_org"));
  const clientSlug = slugify(str(eng, "client_name"));
  const draftSuffix = draft ? "_DRAFT" : "";
  const prefix = relative(resolve(engDir), process.cwd());

  for (const app of SEC_REVIEW_APPENDICES) {
    const titleSlug = slugify(app.title);
    const filename =
      `${orgSlug}_${clientSlug}_Appendix-${app.letter}_${titleSlug}${draftSuffix}.qmd`;
    const sourcePath = join(engDir, `${app.source}.md`);
    const includeOrPlaceholder = existsSync(sourcePath)
      ? `{{< include ../${app.source}.md >}}`
      : `_${app.title} content not yet available._`;

    const content = `---
title: "${str(eng, "reviewer_org")} — Appendix ${app.letter}: ${app.title}"
author: "${str(eng, "reviewer_name")}, ${str(eng, "reviewer_org")}"
date: today
format:
  html:
    theme:
      - cosmo
      - ${prefix}/private/brand/assets/theme-light.scss
    css: ${prefix}/private/brand/assets/styles.css
    toc: true
    toc-depth: 3
    toc-location: left
    number-sections: false
    self-contained: true
---

# Appendix ${app.letter} — ${app.title} {.unnumbered .unlisted}

::: {.classification-notice .restricted}
${classificationNotice}
:::

${includeOrPlaceholder}
`;
    writeFileSync(join(appendicesDir, filename), content, "utf-8");
    console.log(`  Wrote _appendices/${filename}`);
  }
}

function loadFindings(dir: string): Finding[] {
  if (!existsSync(dir)) return [];

  const files = readdirSync(dir)
    .filter(f => f.endsWith(".qmd") && f.startsWith("_f"))
    .sort();

  const findings: Finding[] = [];
  for (const f of files) {
    const content = readFileSync(join(dir, f), "utf-8");
    const finding = parseFindingBlock(content);
    if (finding) {
      findings.push({
        id: String(finding.id || ""),
        severity: String(finding.severity || "medium"),
        priority: String(finding.priority || "P3"),
        title: String(finding.title || "Untitled"),
        status: String(finding.status || "open"),
        cwe: String(finding.cwe || ""),
        owasp: String(finding.owasp || ""),
        ...finding,
      } as Finding);
    }
  }
  return findings.sort((a, b) =>
    (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99)
  );
}

function parseFindingBlock(content: string): Record<string, unknown> | null {
  const match = content.match(/<!--\s*ia:finding\s*([\s\S]*?)-->/);
  if (!match) return null;
  return parse(match[1]) as Record<string, unknown>;
}

// CLI for testing
if (import.meta.main) {
  const args = process.argv.slice(2);
  const engPath = args.find(a => a.startsWith("--engagement="))?.split("=")[1];
  const findingsDir = args.find(a => a.startsWith("--findings="))?.split("=")[1];
  const outDir = args.find(a => a.startsWith("--output="))?.split("=")[1];
  const type = args.find(a => a.startsWith("--type="))?.split("=")[1] as ReportType ||
    "code-review";
  const doRender = args.includes("--render");

  const validTypes: ReportType[] = ["pentest", "sec-review", "code-review", "advisory", "test-plan", "gap-analysis", "risk-assess", "incident", "vuln-scan", "seg-test"];
  const reportType = validTypes.includes(type) ? type : "code-review";

  if (!engPath || !findingsDir || !outDir) {
    console.error("Usage: report-generator.ts --engagement=<path> --findings=<dir> --output=<dir> --type=<type> [--render]");
    process.exit(1);
  }

  generateReport({
    engagementPath: engPath,
    findingsDir: findingsDir,
    outputDir: outDir,
    reportType,
    render: doRender,
  });
}
