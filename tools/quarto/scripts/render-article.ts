#!/usr/bin/env bun
/**
 * Render a markdown file to a branded HTML article using the IA brand system.
 *
 * Usage:
 *   bun tools/quarto/scripts/render-article.ts \
 *     --input  <path/to/draft.md> \
 *     --title  "Article Title" \
 *    [--author "Author Name"] \
 *    [--date   "YYYY-MM-DD"]  \
 *    [--no-toc]               \
 *    [--output <path/to/out.html>]
 *
 * Output: self-contained branded HTML article alongside the input file
 * (or at --output path). Uses private/brand/assets/styles.css + theme-light.scss
 * if present, falls back to cosmo theme only.
 */

import { readFileSync, writeFileSync, existsSync, unlinkSync } from "fs";
import { resolve, dirname, basename, join } from "path";
import { spawnSync } from "child_process";

function parseArgs(): {
  input: string; title: string; author: string; date: string;
  toc: boolean; output: string;
} {
  const args = process.argv.slice(2);
  const get = (flag: string) => {
    const i = args.indexOf(flag);
    return i !== -1 && args[i + 1] ? args[i + 1]! : "";
  };

  const input = resolve(get("--input") || (() => { console.error("--input required"); process.exit(1); return ""; })());
  if (!existsSync(input)) { console.error(`Input not found: ${input}`); process.exit(1); }

  const title = get("--title") || basename(input, ".md").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  const author = get("--author") || "Intelligence Adjacent";
  const date = get("--date") || new Date().toISOString().slice(0, 10);
  const toc = !args.includes("--no-toc");
  const outputArg = get("--output");
  const slug = basename(input, ".md");
  const output = outputArg ? resolve(outputArg) : join(dirname(input), `${slug}.html`);

  return { input, title, author, date, toc, output };
}

function buildFrontmatter(title: string, author: string, date: string, toc: boolean): string {
  const cwd = process.cwd();
  const cssPath  = join(cwd, "private/brand/assets/styles.css");
  const themePath = join(cwd, "private/brand/assets/theme-light.scss");
  const hasCss   = existsSync(cssPath);
  const hasTheme = existsSync(themePath);

  const themeBlock = hasTheme
    ? `    theme:\n      - cosmo\n      - "${themePath}"`
    : `    theme: cosmo`;

  const cssLine = hasCss ? `    css: "${cssPath}"\n` : "";

  return `---
title: "${title.replace(/"/g, '\\"')}"
author: "${author.replace(/"/g, '\\"')}"
date: "${date}"
format:
  html:
    self-contained: true
${themeBlock}
${cssLine}    toc: ${toc}
    toc-depth: 3
    smooth-scroll: true
execute:
  echo: false
  warning: false
---

`;
}

function main() {
  const { input, title, author, date, toc, output } = parseArgs();

  const content = readFileSync(input, "utf-8");
  const frontmatter = buildFrontmatter(title, author, date, toc);

  // Write temp QMD alongside the input file
  const qmdPath = join(dirname(input), `_article-render.qmd`);
  writeFileSync(qmdPath, frontmatter + content, "utf-8");

  console.log(`Rendering: ${title}`);
  console.log(`  Input:  ${input}`);
  console.log(`  Output: ${output}`);

  const result = spawnSync(
    "quarto",
    ["render", qmdPath, "--output", basename(output)],
    { stdio: "inherit", cwd: dirname(input) }
  );

  // Clean up temp QMD
  try { unlinkSync(qmdPath); } catch { /* non-fatal */ }

  if (result.status !== 0) {
    console.error("Quarto render failed");
    process.exit(result.status ?? 1);
  }

  console.log(`\nArticle: ${output}`);
}

main();
