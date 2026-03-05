#!/usr/bin/env bun
/**
 * Quarto render CLI wrapper
 * Usage: bun tools/quarto/scripts/render.ts <path/to/report.qmd> [--format html|pdf|docx|pdf-html|all]
 *
 * - html:      Render to HTML (self-contained)
 * - pdf:       Render to PDF via Quarto + Typst (native)
 * - pdf-html:  Render to HTML first, then convert to PDF via Puppeteer (exact HTML styling)
 * - docx:      Render to Word
 * - all:       Render all formats (html, pdf, docx, pdf-html)
 */

import { spawnSync } from "child_process";
import { resolve, dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

const TYPST_DIR = "/opt/quarto/bin/tools/x86_64";
const QUARTO_BIN = "/opt/quarto/bin/quarto";

function usage(): void {
  console.log("Usage: bun render.ts <path/to/report.qmd> [--format html|pdf|docx|pdf-html|all]");
  console.log("");
  console.log("Formats:");
  console.log("  html      - Render to HTML (self-contained)");
  console.log("  pdf       - Render to PDF via Quarto + Typst (native)");
  console.log("  pdf-html  - Render to HTML, then PDF via Puppeteer (exact HTML styling)");
  console.log("  docx      - Render to Word");
  console.log("  all       - Render all formats");
  process.exit(1);
}

/**
 * Render to a standard Quarto format (html, pdf, docx)
 */
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

/**
 * Inject print-friendly CSS and fix TOC for PDF output
 */
function prepareHtmlForPrint(html: string): string {
  // Add print-specific CSS to handle page breaks and TOC
  const printStyles = `
    <style>
    @media print {
      /* Force page breaks before major sections */
      h1, h2, h3 { page-break-after: avoid; }
      h1 { page-break-before: always; }
      h2, h3 { page-break-inside: avoid; }
      
      /* Keep code blocks together */
      pre, code { page-break-inside: avoid; white-space: pre-wrap; }
      
      /* Tables and figures */
      table, figure { page-break-inside: avoid; }
      
      /* Links - show URL in print */
      a[href^="http"]:after { content: " (" attr(href) ")"; }
      a[href^="#"]:after { content: ""; }
    }
    
    /* TOC improvements for print */
    #TOC { 
      page-break-after: always;
    }
    #TOC li { 
      margin-bottom: 0.5em;
    }
    
    /* Ensure visible page numbers */
    .toc-entry {
      display: flex;
      justify-content: space-between;
    }
    .toc-entry::after {
      content: target-counter(attr(href), page);
    }
    </style>
  `;

  return html.replace("</head>", `${printStyles}</head>`);
}

/**
 * Convert HTML to PDF using Puppeteer
 */
async function htmlToPdf(htmlPath: string): Promise<boolean> {
  console.log("Converting HTML to PDF via Puppeteer...");

  let puppeteer: any;
  try {
    puppeteer = (await import("puppeteer")).default;
  } catch (err) {
    console.error("Failed to load puppeteer:", err);
    console.error("Install with: bun add puppeteer");
    return false;
  }

  let htmlContent = readFileSync(htmlPath, "utf-8");
  
  // Prepare HTML for print
  htmlContent = prepareHtmlForPrint(htmlContent);
  
  const outputPath = htmlPath.replace(/\.html$/, ".pdf");

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    
    // Set viewport for consistent rendering
    await page.setViewport({ width: 1200, height: 800 });
    
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    // Wait for any lazy-loaded content
    await page.waitForTimeout(500);

    // Generate PDF with print settings
    await page.pdf({
      path: outputPath,
      format: "Letter",
      printBackground: true,
      displayHeaderFooter: false,
      margin: {
        top: "0.5in",
        right: "0.5in",
        bottom: "0.5in",
        left: "0.5in",
      },
      preferCSSPageSize: false,
    });

    console.log(`PDF saved: ${outputPath}`);
    return true;
  } catch (err) {
    console.error("Failed to convert HTML to PDF:", err);
    return false;
  } finally {
    if (browser) await browser.close();
  }
}

/**
 * Render to PDF via HTML + Puppeteer (preserves exact HTML styling)
 */
async function renderPdfViaHtml(qmdPath: string): Promise<boolean> {
  const resolved = resolve(qmdPath);
  const dir = dirname(resolved);
  const baseName = qmdPath.replace(/\.qmd$/, "").split("/").pop() || "report";

  // First render to HTML (self-contained)
  console.log("Step 1: Rendering HTML...");
  const htmlResult = runQuarto(resolved, "html");
  if (!htmlResult) {
    console.error("Failed to render HTML");
    return false;
  }

  // Find the generated HTML file
  const htmlPath = join(dir, `${baseName}.html`);
  if (!existsSync(htmlPath)) {
    console.error(`HTML file not found: ${htmlPath}`);
    return false;
  }

  // Convert HTML to PDF via Puppeteer
  return await htmlToPdf(htmlPath);
}

async function main(): Promise<void> {
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

  // Define which formats to render
  const allFormats = ["html", "pdf", "docx", "pdf-html"];
  const formats = formatArg === "all" ? allFormats : [formatArg];

  const results: Record<string, boolean> = {};

  for (const fmt of formats) {
    if (fmt === "pdf-html") {
      results[fmt] = await renderPdfViaHtml(resolved);
    } else if (fmt === "pdf") {
      // Standard PDF via Quarto + Typst
      results[fmt] = runQuarto(resolved, "pdf");
    } else {
      results[fmt] = runQuarto(resolved, fmt);
    }
  }

  console.log("\nRender summary:");
  for (const [fmt, ok] of Object.entries(results)) {
    console.log(`  ${fmt.toUpperCase()}: ${ok ? "OK" : "FAILED"}`);
  }

  const allOk = Object.values(results).every(Boolean);
  process.exit(allOk ? 0 : 1);
}

main();
