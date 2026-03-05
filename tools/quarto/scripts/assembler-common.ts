/**
 * Shared utilities for IA report assemblers.
 * Used by: skills/pentest, skills/sec-review, skills/code-review
 */

import { readFileSync, existsSync } from "fs";
import { resolve, relative } from "path";
import { parse } from "yaml";
import { spawnSync } from "child_process";

// ── Types ──────────────────────────────────────────────────────────────────────
export type BaseEng = Record<string, string | string[] | boolean>;

// ── Constants ──────────────────────────────────────────────────────────────────
export const UNSAFE_QMD = /[\n\r`\{\}<>]/g;

// ── Helpers ────────────────────────────────────────────────────────────────────
export function str(e: BaseEng, key: string): string {
  const v = e[key];
  if (typeof v === "boolean") return String(v);
  const raw = (v as string | undefined) ?? `[${key.replace(/_/g, " ").toUpperCase()}]`;
  return raw.replace(UNSAFE_QMD, " ").trim();
}

export function arr(e: BaseEng, key: string): string[] {
  return (e[key] as string[] | undefined) ?? [];
}

export function pipeRow(line: string, cols: number): string {
  const parts = line.split("|").map(s => s.trim());
  while (parts.length < cols) parts.push("—");
  return `| ${parts.slice(0, cols).join(" | ")} |`;
}

export function cap(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Parsing ────────────────────────────────────────────────────────────────────
export function loadEngagement(yamlPath: string): BaseEng {
  return parse(readFileSync(yamlPath, "utf-8")) as BaseEng;
}

/**
 * Extracts and parses the <!-- ia:finding YAML --> block from QMD content.
 * Returns null if no block is found.
 */
export function parseFindingBlock(content: string): Record<string, unknown> | null {
  const match = content.match(/<!--\s*ia:finding\s*([\s\S]*?)-->/);
  if (!match) return null;
  return parse(match[1]) as Record<string, unknown>;
}

// ── Brand ──────────────────────────────────────────────────────────────────────
/**
 * Returns a logo img tag or SVG placeholder.
 * Checks private/brand/assets/ for logo.{webp,png,jpg,jpeg,svg}.
 * engDir: absolute path to engagement directory (determines relative prefix).
 */
export function detectLogoLine(engDir: string): string {
  const exts = ["webp", "png", "jpg", "jpeg", "svg"];
  const prefix = relative(resolve(engDir), process.cwd());
  const ext = exts.find(e => existsSync(resolve(`private/brand/assets/logo.${e}`)));
  return ext
    ? `![Intelligence Adjacent](${prefix}/private/brand/assets/logo.${ext}){width=200}`
    : `{{< placeholder 240 72 format=svg >}}`;
}

// ── QMD generation ─────────────────────────────────────────────────────────────
/**
 * Generates the YAML frontmatter block for HTML + Typst PDF Quarto output.
 * engDir: absolute path to engagement directory (determines relative prefix to root).
 */
export function genQmdFrontmatter(title: string, author: string, engDir: string): string {
  const prefix = relative(resolve(engDir), process.cwd());
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
---`;
}

// ── CLI helpers ────────────────────────────────────────────────────────────────
/**
 * Parses --engagement CLI arg, validates path is within cwd.
 * Exits with error message on invalid input.
 */
export function parseEngagementPath(): { engPath: string; doRender: boolean } {
  const args = process.argv.slice(2);
  const engIdx = args.indexOf("--engagement");
  if (engIdx === -1 || !args[engIdx + 1]) {
    console.error("Usage: assemble-report.ts --engagement <path/to/engagement.yaml> [--render]");
    process.exit(1);
  }
  const engPath = resolve(args[engIdx + 1]!);
  const cwd = process.cwd();
  if (!engPath.startsWith(cwd + "/") && engPath !== cwd) {
    console.error(`Error: Engagement file must be within the working directory: ${cwd}`);
    process.exit(1);
  }
  return { engPath, doRender: args.includes("--render") };
}

/**
 * Runs `bun tools/quarto/scripts/render.ts <qmdPath> --format html`.
 * Exits with render exit code on failure.
 */
export function spawnRender(mainQmdPath: string): void {
  const renderScript = resolve("tools/quarto/scripts/render.ts");
  console.log("Rendering report...");
  const result = spawnSync("bun", [renderScript, mainQmdPath, "--format", "html"], {
    stdio: "inherit",
  });
  if (result.status !== 0) process.exit(result.status ?? 1);
  console.log("Render complete.");
}
