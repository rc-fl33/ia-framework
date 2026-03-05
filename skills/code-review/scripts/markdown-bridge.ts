#!/usr/bin/env bun
/**
 * Code Review markdown bridge.
 * Converts Phase 4 markdown output → QMD structure → HTML report.
 *
 * Usage:
 *   bun skills/code-review/scripts/markdown-bridge.ts --output-dir <path>
 *   bun skills/code-review/scripts/markdown-bridge.ts --finding <finding-dir>
 *
 * --output-dir: Full engagement report from findings/F*\/finding.md (or FINDINGS.md fallback)
 * --finding:    One-off branded HTML for a single finding directory
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from "fs";
import { join, resolve, basename } from "path";
import { spawnSync } from "child_process";

interface Finding {
  title: string; severity: string; priority: string; status: string;
  cwe: string; owasp: string; confidence: string; source: string;
  file_path: string; line: string; language: string;
  what: string; where: string; why: string; remediation: string;
}

const SEV_ORDER: Record<string, number> = { critical: 1, high: 2, medium: 3, low: 4 };
const SEV_TO_PRI: Record<string, string> = { critical: "P0", high: "P1", medium: "P2", low: "P3" };
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const fld = (c: string, k: string) => c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*(.+)`))?.[1]?.trim() ?? "";
const sec = (c: string, k: string) =>
  c.match(new RegExp(`\\*\\*${k}:\\*\\*\\s*([\\s\\S]*?)(?=\\n\\*\\*[A-Z]+:\\*\\*|$)`))?.[1]?.trim() ?? "";

const MIME: Record<string, string> = {
  png: "image/png", jpg: "image/jpeg", jpeg: "image/jpeg",
  gif: "image/gif", svg: "image/svg+xml", webp: "image/webp", bmp: "image/bmp",
};

function embedImages(content: string, baseDir: string): string {
  return content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (/^https?:\/\/|^data:/.test(src)) return match;
    const abs = resolve(baseDir, src);
    if (!existsSync(abs)) return match;
    try {
      const ext = abs.split(".").pop()?.toLowerCase() ?? "";
      const b64 = readFileSync(abs).toString("base64");
      return `![${alt}](data:${MIME[ext] ?? "image/png"};base64,${b64})`;
    } catch { return match; }
  });
}

function parseFindings(content: string): Finding[] {
  return content.split(/\n(?=### Finding \d+:)/)
    .filter(c => c.match(/^### Finding \d+:/))
    .map(chunk => {
      const title = chunk.match(/^### Finding \d+:\s*(.+)/)?.[1]?.trim() ?? "Untitled Finding";
      const sevRaw = fld(chunk, "Severity").toLowerCase();
      const severity = ["critical", "high", "medium", "low"].includes(sevRaw) ? sevRaw : "medium";
      const statusRaw = fld(chunk, "STATUS") || fld(chunk, "Status");
      const where = sec(chunk, "WHERE");
      return {
        title, severity, priority: fld(chunk, "Priority") || SEV_TO_PRI[severity] || "P3",
        status: statusRaw.toLowerCase() || "open",
        cwe: fld(chunk, "CWE").match(/(CWE-\d+)/)?.[1] ?? fld(chunk, "CWE").split(" ")[0] ?? "",
        owasp: fld(chunk, "OWASP").match(/([A-Z]\d+:\d+)/)?.[1] ?? fld(chunk, "OWASP").split(" ")[0] ?? "",
        confidence: fld(chunk, "Confidence").toUpperCase() || "MEDIUM",
        source: fld(chunk, "Source").toUpperCase().replace(/-/g, "_") || "MANUAL",
        file_path: where.match(/File:\s*`([^`]+)`/)?.[1] ?? "",
        line: where.match(/Lines?:\s*(\d+)/)?.[1] ?? "",
        language: chunk.match(/```(\w+)/)?.[1]?.toLowerCase() ?? "typescript",
        what: sec(chunk, "Description"),
        where: sec(chunk, "Location"),
        why: sec(chunk, "Impact"),
        remediation: sec(chunk, "REMEDIATION"),
      };
    })
    .sort((a, b) => (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99));
}

function findingToQmd(f: Finding, id: string): string {
  const remediated = f.status === "remediated" || f.status === "closed" || f.status === "resolved";
  const divClass = remediated ? "finding-remediated" : `finding-${f.severity}`;
  const badgeClass = remediated ? "badge-remediated" : `badge-${f.severity}`;
  const statusLabel = remediated ? "Remediated" : cap(f.status === "open" ? "Open" : f.status);
  return `<!-- ia:finding
id: ${id}
severity: ${f.severity}
priority: ${f.priority}
status: ${f.status}
title: ${JSON.stringify(f.title)}
file: ${JSON.stringify(f.file_path)}
line: ${JSON.stringify(f.line)}
cwe: ${JSON.stringify(f.cwe)}
owasp: ${JSON.stringify(f.owasp)}
confidence: ${f.confidence}
source: ${f.source}
language: ${f.language}
-->

::: {.${divClass}}
#### ${id}: ${f.title}

**Severity:** [${cap(f.severity)}]{.${badgeClass}} | **Priority:** ${f.priority} | **Confidence:** ${f.confidence}

**CWE:** ${f.cwe} | **OWASP:** ${f.owasp}

${f.file_path ? `**Location:** \`${f.file_path}${f.line ? `:${f.line}` : ""}\`` : ""}

**Status:** ${statusLabel}

---

**Description**

${f.what || f.where || "_No description provided._"}

**Impact**

${f.why || "_No impact description provided._"}

${f.remediation ? `**Remediation**\n\n${f.remediation}` : ""}

:::
`;
}

function findFindingDirs(outDir: string): string[] {
  const findingsDir = join(outDir, "findings");
  if (!existsSync(findingsDir)) return [];
  return readdirSync(findingsDir)
    .filter(d => /^F\d{3}-/.test(d) && statSync(join(findingsDir, d)).isDirectory())
    .sort()
    .map(d => join(findingsDir, d));
}

function loadFindingsFromDirs(dirs: string[]): Finding[] {
  const all: Finding[] = [];
  for (const dir of dirs) {
    const p = join(dir, "finding.md");
    if (!existsSync(p)) continue;
    const content = embedImages(readFileSync(p, "utf-8"), dir);
    all.push(...parseFindings(content));
  }
  return all.sort((a, b) => (SEV_ORDER[a.severity] ?? 99) - (SEV_ORDER[b.severity] ?? 99));
}

function buildEngagementYaml(meta: { project?: string; date?: string }, scope: string): string {
  const project = meta.project ?? "Unknown Project";
  const date = meta.date ?? new Date().toISOString().slice(0, 10);
  const lines = (pat: RegExp) => (scope.match(pat)?.[1] ?? "")
    .split("\n").filter(l => l.trim().startsWith("-"))
    .map(l => l.trim().replace(/^-\s*/, "").replace(/`/g, "").trim()).filter(Boolean);
  const rawIn = lines(/\*\*In scope:\*\*([\s\S]*?)(?=\*\*Out of scope:|$)/);
  const scopeIn = rawIn.length
    ? rawIn.map(c => { const f = c.match(/^(\S+\.ts)/)?.[1] ?? c.split(" ")[0] ?? c; return `"${f} | Source | Application code"`; })
    : ['"src/ | Application source | Core business logic"'];
  const rawOut = lines(/\*\*Out of scope:\*\*([\s\S]*?)(?=###|$)/);
  const scopeOut = rawOut.length ? rawOut.map(c => `"${c}"`) : ['"vendor/ — third-party dependencies"'];
  return `# Generated by markdown-bridge.ts — ${new Date().toISOString()}
project_name: "${project}"
project_version: "${date}"
repo_url: "[REPO URL]"
primary_language: "[Primary Language]"
frameworks: "[Framework]"
client_name: "[Client Company Name]"
client_contact: "[Client Contact Name]"
client_email: "[client@email.com]"
engagement_id: "CR-${date.slice(0, 4)}-001"
assessment_type: "Security Code Review"
classification: "[Confidential | Restricted | Internal | Public]"
start_date: "${date}"
end_date: "${date}"
report_date: "${date}"
report_version: "1.0"
reviewer_name: "[Reviewer Name]"
reviewer_contact: "[reviewer@email.com]"
reviewer_org: "[Organization Name]"
scope_in:
${scopeIn.map(s => `  - ${s}`).join("\n")}
scope_out:
${scopeOut.map(s => `  - ${s}`).join("\n")}
compliance:
  - "OWASP Top 10 (2021)"
  - "CWE/SANS Top 25"
  - "NIST SSDF 1.1"
cve_research: ""
`;
}

function singleFindingMode(findingDir: string) {
  const findingPath = join(findingDir, "finding.md");
  if (!existsSync(findingPath)) {
    console.error(`Error: no finding.md in ${findingDir}`);
    process.exit(1);
  }
  const dirName = basename(findingDir);
  const numMatch = dirName.match(/^F(\d{3})/);
  const num = numMatch?.[1] ?? "001";
  const id = `CR-${num}`;

  const content = embedImages(readFileSync(findingPath, "utf-8"), findingDir);
  const findings = parseFindings(content);
  if (!findings.length) { console.error("Error: no finding parsed from finding.md"); process.exit(1); }
  const f = findings[0]!;
  console.log(`One-off finding: ${id} — ${f.title} [${f.severity}]`);

  // Compute relative CSS path from findingDir
  const cwd = process.cwd();
  const cssPath = join(cwd, "private/brand/assets/styles.css");
  const themePath = join(cwd, "private/brand/assets/theme-light.scss");
  const hasCss = existsSync(cssPath);
  const hasTheme = existsSync(themePath);

  const frontmatter = `---
title: "${id}: ${f.title.replace(/"/g, '\\"')}"
format:
  html:
    self-contained: true
    toc: false
${hasCss ? `    css: "${cssPath}"\n` : ""}${hasTheme ? `    theme: "${themePath}"\n` : ""}---

`;
  const qmdContent = frontmatter + findingToQmd(f, id);
  const qmdPath = join(findingDir, "finding-report.qmd");
  writeFileSync(qmdPath, qmdContent, "utf-8");
  console.log(`  Wrote ${qmdPath}`);

  const result = spawnSync("quarto", ["render", qmdPath], { stdio: "inherit", cwd: findingDir });
  if (result.status !== 0) { console.error("Quarto render failed"); process.exit(result.status ?? 1); }

  const htmlPath = join(findingDir, "finding-report.html");
  console.log(`\nFinding report: ${htmlPath}`);
}

function main() {
  const args = process.argv.slice(2);

  // One-off finding mode
  const findingIdx = args.indexOf("--finding");
  if (findingIdx !== -1) {
    const findingDir = resolve(args[findingIdx + 1] ?? "");
    singleFindingMode(findingDir);
    return;
  }

  // Full engagement mode
  const outDirIdx = args.indexOf("--output-dir");
  if (outDirIdx === -1 || !args[outDirIdx + 1]) {
    console.error("Usage: markdown-bridge.ts --output-dir <path> | --finding <finding-dir>");
    process.exit(1);
  }
  const outDir = resolve(args[outDirIdx + 1]!);
  if (!outDir.startsWith(process.cwd())) {
    console.error(`Error: output-dir must be within ${process.cwd()}`);
    process.exit(1);
  }

  console.log(`Bridge: ${outDir}`);
  const read = (name: string) => { const p = join(outDir, name); return existsSync(p) ? readFileSync(p, "utf-8") : ""; };
  const meta = (() => { const r = read("metadata.json"); return r ? JSON.parse(r) : {}; })();

  // Prefer per-finding directories; fall back to consolidated FINDINGS.md
  const findingDirs = findFindingDirs(outDir);
  let findings: Finding[];
  if (findingDirs.length) {
    console.log(`  Reading ${findingDirs.length} finding dir(s)`);
    findings = loadFindingsFromDirs(findingDirs);
    // Refresh consolidated FINDINGS.md from individual files
    const consolidated = findingDirs
      .filter(d => existsSync(join(d, "finding.md")))
      .map(d => readFileSync(join(d, "finding.md"), "utf-8"))
      .join("\n\n");
    writeFileSync(join(outDir, "FINDINGS.md"), consolidated, "utf-8");
    console.log("  Refreshed FINDINGS.md from individual finding files");
  } else {
    const findingsRaw = read("FINDINGS.md");
    if (!findingsRaw) console.warn("Warning: no findings found — report will have no findings");
    const findingsContent = findingsRaw ? embedImages(findingsRaw, outDir) : "";
    findings = findingsContent ? parseFindings(findingsContent) : [];
  }
  console.log(`  Parsed ${findings.length} finding(s)`);

  const sectDir = join(outDir, "_sections");
  const qmdFindingsDir = join(sectDir, "_findings");
  mkdirSync(qmdFindingsDir, { recursive: true });
  findings.forEach((f, i) => {
    const id = `CR-${String(i + 1).padStart(3, "0")}`;
    const filename = `_f${String(i + 1).padStart(3, "0")}-${f.severity}.qmd`;
    writeFileSync(join(qmdFindingsDir, filename), findingToQmd(f, id), "utf-8");
    console.log(`  Wrote ${filename} [${f.severity}] ${f.title.slice(0, 50)}`);
  });

  // Write data-flow section (DATA-FLOW.md already has the header)
  const dataFlowRaw = read("DATA-FLOW.md");
  const dataFlowContent = dataFlowRaw ? embedImages(dataFlowRaw, outDir) : "";
  const dataFlowQmd = dataFlowContent
    ? `${dataFlowContent}`
    : "_No data flow analysis available._\n";
  writeFileSync(join(sectDir, "_data-flow.qmd"), dataFlowQmd, "utf-8");
  console.log("  Wrote _sections/_data-flow.qmd");

  const engPath = join(outDir, "engagement.yaml");
  writeFileSync(engPath, buildEngagementYaml(meta, read("scope.md")), "utf-8");
  console.log(`  Wrote engagement.yaml`);

  const assembler = resolve("skills/code-review/scripts/assemble-report.ts");
  console.log("Running assembler...");
  const result = spawnSync("bun", [assembler, "--engagement", engPath, "--render"], { stdio: "inherit", cwd: process.cwd() });
  if (result.status !== 0) { console.error(`Assembler exited with code ${result.status}`); process.exit(result.status ?? 1); }
  console.log(`\nHTML report: ${join(outDir, "code-review-report.html")}`);
}

main();
