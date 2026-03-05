#!/usr/bin/env bun
/**
 * Quarto render CLI wrapper
 * Usage: bun tools/quarto/scripts/render.ts <path/to/report.qmd> [--format html|pdf|docx|all]
 * Adds Typst to PATH automatically for PDF rendering.
 */

import { spawnSync } from "child_process";
import { resolve, dirname } from "path";

const TYPST_DIR = "/opt/quarto/bin/tools/x86_64";
const QUARTO_BIN = "/opt/quarto/bin/quarto";

function usage(): void {
  console.log("Usage: bun render.ts <path/to/report.qmd> [--format html|pdf|docx|all]");
  process.exit(1);
}

function runQuarto(qmdPath: string, format: string): boolean {
  const env = { ...process.env, PATH: `${TYPST_DIR}:${process.env.PATH}` };
  const args = ["render", qmdPath, "--to", format];
  console.log(`Rendering ${format.toUpperCase()}...`);
  const result = spawnSync(QUARTO_BIN, args, {
    env,
    stdio: "inherit",
    cwd: dirname(resolve(qmdPath)),
  });
  if (result.status !== 0) {
    console.error(`Failed to render ${format}: exit code ${result.status}`);
    return false;
  }
  return true;
}

function main(): void {
  const args = process.argv.slice(2);
  if (args.length === 0) usage();

  const qmdPath = args[0];
  const formatIdx = args.indexOf("--format");
  const formatArg = formatIdx !== -1 ? args[formatIdx + 1] : "all";

  if (!qmdPath.endsWith(".qmd")) {
    console.error("Error: input file must be a .qmd file");
    process.exit(1);
  }

  const resolved = resolve(qmdPath);
  const formats = formatArg === "all" ? ["html", "pdf", "docx"] : [formatArg];
  const results: Record<string, boolean> = {};

  for (const fmt of formats) {
    results[fmt] = runQuarto(resolved, fmt);
  }

  console.log("\nRender summary:");
  for (const [fmt, ok] of Object.entries(results)) {
    console.log(`  ${fmt.toUpperCase()}: ${ok ? "OK" : "FAILED"}`);
  }

  const allOk = Object.values(results).every(Boolean);
  process.exit(allOk ? 0 : 1);
}

main();
