#!/usr/bin/env bun
/**
 * Quarto visual style editor - HTTP server on port 3002
 * Routes: GET / | GET /preview | GET /current-brand
 *         POST /save | POST /render-preview | POST /generate-css
 */

import {
  readFileSync, writeFileSync, mkdirSync, existsSync,
  realpathSync, readdirSync, statSync,
} from "fs";
import { spawnSync } from "child_process";
import { join } from "path";
import { parseBrand, parseCss, writeBrand, type BrandConfig } from "./brand-writer.ts";
import { previewQmd, type PreviewType, type ReportDefaults } from "./preview-template.ts";
import { writeStyleFiles, type StyleState } from "./css-writer.ts";

// Simple YAML parser/stringifier for engagement.yaml
function parseYaml(str: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  const lines = str.split('\n');
  let currentKey = '';
  let currentIndent = 0;
  const stack: { indent: number; obj: Record<string, unknown> }[] = [{ indent: -1, obj: result }];

  for (const rawLine of lines) {
    const line = rawLine.replace(/^\s*#.*/, '').trim();
    if (!line) continue;

    const indent = rawLine.length - rawLine.trimStart().length;
    const isListItem = line.startsWith('- ');
    const listContent = isListItem ? line.slice(2).trim() : '';

    // Key-value pair
    const match = line.match(/^([^:]+):\s*(.*)$/);
    if (match) {
      const [, key, value] = match;
      const trimmedKey = key.trim();

      // Find the right parent object
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].obj;

      if (value && !isListItem) {
        // Simple value
        parent[trimmedKey] = value.replace(/^["']|["']$/g, '');
      } else if (isListItem && listContent.includes(':')) {
        // Nested object in list
        const nestedMatch = listContent.match(/^([^:]+):\s*(.*)$/);
        if (nestedMatch) {
          const [, nestedKey, nestedValue] = nestedMatch;
          if (!Array.isArray(parent[trimmedKey])) {
            parent[trimmedKey] = [];
          }
          const nestedObj: Record<string, string> = {};
          nestedObj[nestedKey.trim()] = nestedValue.replace(/^["']|["']$/g, '') || '';
          (parent[trimmedKey] as unknown[]).push(nestedObj);
        }
      } else if (isListItem) {
        // Simple list item
        if (!Array.isArray(parent[trimmedKey])) {
          parent[trimmedKey] = [];
        }
        (parent[trimmedKey] as unknown[]).push(listContent);
      } else {
        // New nested object
        parent[trimmedKey] = {};
        stack.push({ indent, obj: parent[trimmedKey] as Record<string, unknown> });
      }
    } else if (isListItem && !line.includes(':')) {
      // Simple list item without key
      while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
        stack.pop();
      }
      const parent = stack[stack.length - 1].obj;
      // Find the last array key
      const keys = Object.keys(parent);
      for (let i = keys.length - 1; i >= 0; i--) {
        if (Array.isArray(parent[keys[i]])) {
          (parent[keys[i]] as unknown[]).push(listContent);
          break;
        }
      }
    }
  }
  return result;
}

function stringifyYaml(obj: Record<string, unknown>, indent = 0): string {
  const prefix = '  '.repeat(indent);
  let lines: string[] = [];

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) continue;

    if (Array.isArray(value)) {
      if (value.length > 0 && typeof value[0] === 'object') {
        // Array of objects
        lines.push(`${prefix}${key}:`);
        for (const item of value) {
          if (typeof item === 'object' && item !== null) {
            lines.push(`${prefix}  - ${Object.entries(item).map(([k, v]) => `${k}: ${v}`).join(', ')}`);
          }
        }
      } else {
        // Simple array
        lines.push(`${prefix}${key}:`);
        for (const item of value) {
          lines.push(`${prefix}  - ${item}`);
        }
      }
    } else if (typeof value === 'object') {
      lines.push(`${prefix}${key}:`);
      lines.push(stringifyYaml(value as Record<string, unknown>, indent + 1));
    } else {
      lines.push(`${prefix}${key}: ${value}`);
    }
  }
  return lines.join('\n');
}

const PORT = 3002;
// Resolve _brand.yml relative to this script: tools/quarto/scripts/ -> ../../.. -> framework root
const FRAMEWORK_ROOT = process.env.IA_FRAMEWORK_ROOT ?? join(import.meta.dir, "../../..");
const BRAND_DIR = join(FRAMEWORK_ROOT, "private/brand");
const BRAND_PATH = join(BRAND_DIR, "_brand.yml");
const CSS_PATH = join(BRAND_DIR, "assets/styles.css");
const WEB_DIR = join(import.meta.dir, "../web");
const GALLERY_PATH = join(WEB_DIR, "gallery.html");
const TEMPLATES_CONFIG = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");
const TYPST_PATH = "/opt/quarto/bin/tools/x86_64";
const QUARTO_BIN = "/opt/quarto/bin/quarto";
const TMP_DIR = "/tmp/quarto-preview";
const PREVIEW_TYPES = new Set<string>([
  "code-review", "sec-review", "pentest",
  "scoping", "testplan", "finding"
]);

// Create default brand files if they don't exist
function ensureBrandFiles(): void {
  if (!existsSync(BRAND_DIR)) {
    mkdirSync(join(BRAND_DIR, "assets"), { recursive: true });
  }
  if (!existsSync(BRAND_PATH)) {
    const defaultBrand = `# Brand Configuration - Auto-generated default
brand:
  color:
    primary: "#1F3B5C"
    secondary: "#4A90E2"
    success: "#16A34A"
    warning: "#EA580C"
    danger: "#DC2626"
    info: "#2563EB"
    foreground: "#1A202C"
    background: "#FFFFFF"
    muted: "#6B7280"
    border: "#E5E7EB"
  security:
    color:
      critical: "#7C3AED"
      high: "#DC2626"
      medium: "#EA580C"
      low: "#16A34A"
      informational: "#2563EB"
  compliance:
    color:
      compliant: "#16A34A"
      partial: "#EA580C"
      non-compliant: "#DC2626"
      not-applicable: "#6B7280"
      not-assessed: "#2563EB"
  typography:
    base:
      family: "Inter, system-ui, sans-serif"
    headings:
      family: "Inter, system-ui, sans-serif"
    monospace:
      family: "JetBrains Mono, monospace"
  defaults:
    html:
      theme: "cosmo"
  report:
    reviewer_org: "Your Organization"
    default_classification: "Confidential"

# Classification levels (used in report headers)
classifications:
  - id: "public"
    label: "Public"
  - id: "internal"
    label: "Internal Use"
  - id: "confidential"
    label: "Confidential"
  - id: "secret"
    label: "Secret"
`;
    writeFileSync(BRAND_PATH, defaultBrand);
    console.log("Created default _brand.yml");
  }
  if (!existsSync(CSS_PATH)) {
    const defaultCss = `/* Brand Styles - Auto-generated default */
:root {
  --primary: #1F3B5C;
  --secondary: #4A90E2;
  --success: #16A34A;
  --warning: #EA580C;
  --danger: #DC2626;
  --info: #2563EB;
  --foreground: #1A202C;
  --background: #FFFFFF;
  --muted: #6B7280;
  --border: #E5E7EB;

  /* Severity colors */
  --critical: #7C3AED;
  --high: #DC2626;
  --medium: #EA580C;
  --low: #16A34A;
  --informational: #2563EB;

  /* Table colors */
  --table-header-bg: #1F3B5C;
  --table-header-text: #FFFFFF;
  --table-stripe: #F8FAFC;
  --table-border: #E5E7EB;

  /* Code colors */
  --code-bg: #0F172A;
  --code-text: #E2E8F0;
  --code-inline-bg: #F1F5F9;
  --code-inline-text: #DC2626;

  /* Typography */
  --font-base: Inter, system-ui, sans-serif;
  --font-mono: JetBrains Mono, monospace;
  --font-size: 16px;
  --line-height: 1.6;
  --heading-weight: 600;
}
body { font-family: var(--font-base); background: var(--background); color: var(--foreground); }
pre { background: var(--code-bg); color: var(--code-text); padding: 1rem; border-radius: 6px; overflow-x: auto; }
code:not(pre > code) { background: var(--code-inline-bg); color: var(--code-inline-text); padding: .15em .4em; border-radius: 4px; font-size: .9em; }
thead th { background: var(--table-header-bg); color: var(--table-header-text); padding: .6rem 1rem; text-align: left; }
tbody tr:nth-child(even) { background: var(--table-stripe); }
tbody td { padding: .55rem 1rem; border-bottom: 1px solid var(--table-border); }
`;
    writeFileSync(CSS_PATH, defaultCss);
    console.log("Created default styles.css");
  }
}

// Read pinned CDN versions directly from gallery.html so they stay in sync automatically.
// Matches: cdn.jsdelivr.net/npm/package-name@1.2.3/
function readPinnedVersions(): Record<string, string> {
  if (!existsSync(GALLERY_PATH)) return {};
  const html = readFileSync(GALLERY_PATH, "utf-8");
  const pins: Record<string, string> = {};
  for (const [, name, ver] of html.matchAll(/npm\/([a-z][a-z0-9-]*)@(\d+\.\d+\.\d+)\//g)) {
    if (!pins[name]) pins[name] = ver;
  }
  return pins;
}

const cdnPins: Record<string, string> = readPinnedVersions();
console.log("Pinned CDN libs:", cdnPins);

const VALID_THEMES = new Set([
  "cosmo", "cerulean", "cyborg", "darkly", "flatly", "journal", "litera",
  "lumen", "lux", "materia", "minty", "morph", "pulse", "quartz", "sandstone",
  "simplex", "sketchy", "slate", "solar", "spacelab", "superhero", "united",
  "vapor", "yeti", "zephyr",
]);

function renderPreview(theme: string, type: string, draft = false): { ok: boolean; error?: string } {
  const safeType = PREVIEW_TYPES.has(type) ? type : "code-review";
  const suffix = draft ? `-draft` : "";
  const tmpQmd = join(TMP_DIR, `preview-${safeType}${suffix}.qmd`);
  mkdirSync(TMP_DIR, { recursive: true });
  const defaults: ReportDefaults = {};
  if (existsSync(BRAND_PATH)) {
    const brand = parseBrand(BRAND_PATH);
    if (brand.reportDefaults) Object.assign(defaults, brand.reportDefaults);
    defaults.securityColors = {
      critical: brand.securityColors?.critical,
      high:     brand.securityColors?.high,
      medium:   brand.securityColors?.medium,
      low:      brand.securityColors?.low,
    };
  }
  writeFileSync(tmpQmd, previewQmd(theme, safeType as PreviewType, FRAMEWORK_ROOT, defaults, draft), "utf-8");
  const env = { ...process.env, PATH: `${TYPST_PATH}:${process.env.PATH}` };
  const result = spawnSync(QUARTO_BIN, ["render", tmpQmd, "--to", "html"], {
    env, cwd: TMP_DIR, encoding: "utf-8",
  });
  return result.status === 0 ? { ok: true } : { ok: false, error: result.stderr || "render failed" };
}

function fileResponse(path: string, contentType: string): Response {
  if (!existsSync(path)) return new Response("Not found", { status: 404 });
  return new Response(readFileSync(path), { headers: { "Content-Type": contentType } });
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// Create default brand files if they don't exist (for fresh clones)
ensureBrandFiles();

Bun.serve({
  port: PORT,
  hostname: "127.0.0.1",
  async fetch(req) {
    const url = new URL(req.url);
    const { pathname } = url;

    if (pathname === "/") return fileResponse(join(WEB_DIR, "index.html"), "text/html");

    // Serve gallery.html
    if (pathname === "/gallery") {
      return fileResponse(join(WEB_DIR, "gallery.html"), "text/html");
    }

    // Serve static files from web directory (/css/, /js/)
    if (pathname.startsWith("/css/") || pathname.startsWith("/js/")) {
      const filePath = join(WEB_DIR, pathname);
      const ext = pathname.split(".").pop()?.toLowerCase() ?? "css";
      const contentType = ext === "js" ? "application/javascript" : "text/css";
      return fileResponse(filePath, contentType);
    }

    if (pathname === "/preview") {
      const type = url.searchParams.get("type") ?? "code-review";
      const isDraft = url.searchParams.get("draft") === "1";
      const safeType = PREVIEW_TYPES.has(type) ? type : "code-review";
      const suffix = isDraft ? "-draft" : "";
      const htmlPath = join(TMP_DIR, `preview-${safeType}${suffix}.html`);
      if (!existsSync(htmlPath)) {
        return new Response(
          "<html><body style='font-family:sans-serif;padding:2rem;color:#6b7280'>" +
          "<p>Click <strong>Render Preview</strong> to generate a live report preview " +
          "using the current brand CSS.</p></body></html>",
          { status: 200, headers: { "Content-Type": "text/html" } }
        );
      }
      return fileResponse(htmlPath, "text/html");
    }

    if (pathname === "/current-brand") {
      // Ensure brand files exist (for fresh clones)
      ensureBrandFiles();
      const brand = parseBrand(BRAND_PATH);
      // Table and code colors live in styles.css, not _brand.yml — merge them in
      const cssColors = parseCss(CSS_PATH);
      brand.tableColors = cssColors.tableColors;
      brand.codeColors = cssColors.codeColors;
      // Merge CSS typography (size, line-height, weight) into the brand typography block
      Object.assign(brand.typography, cssColors.typography);
      // Detect existing logo so the UI can show it without requiring a re-upload
      const assetsDir = join(BRAND_DIR, "assets");
      let logoPath: string | null = null;
      for (const ext of ["png", "jpg", "jpeg", "svg", "webp"]) {
        if (existsSync(join(assetsDir, `logo.${ext}`))) { logoPath = `logo.${ext}`; break; }
      }
      return json({ ...brand, logoPath });
    }

    if (pathname === "/save" && req.method === "POST") {
      writeBrand(BRAND_PATH, (await req.json()) as Partial<BrandConfig>);
      return json({ ok: true });
    }

    if (pathname === "/render-preview" && req.method === "POST") {
      const { theme = "cosmo", previewType = "code-review", draft = false } =
        (await req.json()) as { theme?: string; previewType?: string; draft?: boolean };
      if (!VALID_THEMES.has(theme)) return json({ ok: false, error: "Invalid theme name" }, 400);
      const safeType = PREVIEW_TYPES.has(previewType) ? previewType : "code-review";
      const result = renderPreview(theme, safeType, draft);
      if (!result.ok) return json({ ok: false, error: result.error }, 500);
      return json({ ok: true, path: `/preview?type=${safeType}${draft ? "&draft=1" : ""}` });
    }

    // Serve template files from tools/quarto/templates/
    if (pathname.startsWith("/templates/")) {
      const templateName = pathname.slice("/templates/".length);
      const templatePath = join(import.meta.dir, "..", "templates", templateName);
      if (existsSync(templatePath)) {
        return fileResponse(templatePath, "text/markdown");
      }
      return new Response("Template not found", { status: 404 });
    }

    if (pathname === "/generate-css" && req.method === "POST") {
      const styleState = (await req.json()) as StyleState;
      try {
        const paths = writeStyleFiles(styleState, FRAMEWORK_ROOT);
        return json({ ok: true, paths });
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500);
      }
    }

    // Template Builder Routes (removed - unified into main page)
    if (pathname === "/builder-config") {
      const configContent = readFileSync(TEMPLATES_CONFIG, "utf-8");
      return json({ ok: true, config: configContent });
    }

    // Load default colors (preserves logo, resets colors)
    if (pathname === "/builder-load-defaults" && req.method === "POST") {
      const BRAND_YML = join(FRAMEWORK_ROOT, "private/brand/_brand.yml");
      const ASSETS_DIR = join(FRAMEWORK_ROOT, "private/brand/assets");

      // Check if custom logo exists
      let logoPath = null;
      const logoExts = ['png', 'jpg', 'jpeg', 'svg', 'webp'];
      for (const ext of logoExts) {
        const p = join(ASSETS_DIR, `logo.${ext}`);
        if (existsSync(p)) {
          logoPath = `logo.${ext}`;
          break;
        }
      }

      // Build YAML manually (simple format)
      let yaml = `# Brand configuration - Auto-generated defaults
colors:
  primary: "#1F3B5C"
  secondary: "#4A90E2"
  foreground: "#1A202C"
  background: "#FFFFFF"
  muted: "#6B7280"
  border: "#E5E7EB"

security:
  color:
    critical: "#7C3AED"
    high: "#DC2626"
    medium: "#EA580C"
    low: "#16A34A"
    informational: "#2563EB"

compliance:
  color:
    compliant: "#16A34A"
    partial: "#EA580C"
    nonCompliant: "#DC2626"
    na: "#6B7280"
    pending: "#2563EB"
`;

      if (logoPath) {
        yaml = `logo: ${logoPath}\n\n${yaml}`;
      }

      try {
        writeFileSync(BRAND_YML, yaml, "utf-8");
        return json({ ok: true, hasLogo: !!logoPath });
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500);
      }
    }

    if (pathname === "/builder-save" && req.method === "POST") {
      const { config } = (await req.json()) as { config: string };
      try {
        writeFileSync(TEMPLATES_CONFIG, config, "utf-8");
        return json({ ok: true });
      } catch (err) {
        return json({ ok: false, error: String(err) }, 500);
      }
    }

    if (pathname === "/builder-regenerate" && req.method === "POST") {
      const result = spawnSync("bun", [
        "tools/quarto/scripts/create-template.ts",
        "--all"
      ], {
        cwd: FRAMEWORK_ROOT,
        encoding: "utf-8",
      });
      if (result.status !== 0) {
        return json({ ok: false, error: result.stderr || "regeneration failed" }, 500);
      }
      return json({ ok: true, output: result.stdout });
    }

    if (pathname === "/upload-logo" && req.method === "POST") {
      const { dataUrl, filename } = (await req.json()) as { dataUrl: string; filename: string };
      const rawExt = (filename.split(".").pop() ?? "").toLowerCase();
      const ext = ["png", "jpg", "jpeg", "gif", "svg", "webp"].includes(rawExt) ? rawExt : "png";
      const assetsDir = join(FRAMEWORK_ROOT, "private/brand/assets");
      mkdirSync(assetsDir, { recursive: true });
      const logoPath = join(assetsDir, `logo.${ext}`);
      const base64Data = dataUrl.split(",")[1] ?? "";
      writeFileSync(logoPath, Buffer.from(base64Data, "base64"));
      return json({ ok: true, path: `/logo/logo.${ext}` });
    }

    if (pathname.startsWith("/logo/") && req.method === "GET") {
      const file = pathname.slice(6);
      if (!file || file.includes("..") || file.includes("/")) {
        return new Response("Bad request", { status: 400 });
      }
      const assetsDir = join(FRAMEWORK_ROOT, "private/brand/assets");
      let resolvedPath: string;
      try {
        resolvedPath = realpathSync(join(assetsDir, file));
      } catch {
        return new Response("Not found", { status: 404 });
      }
      if (!resolvedPath.startsWith(assetsDir + "/") && resolvedPath !== assetsDir) {
        return new Response("Forbidden", { status: 403 });
      }
      const ext = (file.split(".").pop() ?? "").toLowerCase();
      const ct: Record<string, string> = {
        svg: "image/svg+xml", png: "image/png",
        jpg: "image/jpeg", jpeg: "image/jpeg",
        gif: "image/gif", webp: "image/webp",
      };
      return fileResponse(resolvedPath, ct[ext] ?? "image/png");
    }

    // GET /check-versions — query npm registry for latest versions of pinned CDN libs
    if (pathname === "/check-versions") {
      const results = await Promise.all(
        Object.entries(cdnPins).map(async ([name, pinned]) => {
          try {
            const res = await fetch(`https://registry.npmjs.org/${name}/latest`, {
              headers: { "Accept": "application/vnd.npm.install-v1+json" },
            });
            const { version: latest } = await res.json() as { version: string };
            return { name, pinned, latest, upToDate: pinned === latest };
          } catch {
            return { name, pinned, latest: null as string | null, upToDate: null as boolean | null };
          }
        })
      );
      return json({ libs: results });
    }

    // POST /update-versions — rewrite CDN URL in gallery.html for one package
    if (pathname === "/update-versions" && req.method === "POST") {
      const { name, version } = await req.json() as { name: string; version: string };
      if (!/^[a-z][a-z0-9-]*$/.test(name) || !/^\d+\.\d+\.\d+$/.test(version)) {
        return json({ ok: false, error: "Invalid name or version" }, 400);
      }
      if (!existsSync(GALLERY_PATH)) return json({ ok: false, error: "gallery.html not found" }, 404);
      const html = readFileSync(GALLERY_PATH, "utf-8");
      const re = new RegExp(`(npm/${name.replace(/-/g, "\\-")}@)[^/]+/`, "g");
      const updated = html.replace(re, `$1${version}/`);
      if (updated === html) return json({ ok: false, error: "Package not found in gallery.html" });
      writeFileSync(GALLERY_PATH, updated, "utf-8");
      cdnPins[name] = version;
      return json({ ok: true, name, version });
    }

    // GET /frontmatter - read engagement.yaml for a skill
    if (pathname === "/frontmatter" && req.method === "GET") {
      const skill = url.searchParams.get("skill");
      if (!skill) return json({ ok: false, error: "Missing skill parameter" }, 400);
      const engPath = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill, "engagement.yaml");
      if (!existsSync(engPath)) return json({ ok: false, error: "Engagement file not found" }, 404);
      const content = readFileSync(engPath, "utf-8");
      const fm = parseYaml(content);
      return json({ ok: true, frontmatter: fm });
    }

    // POST /frontmatter - update engagement.yaml for a skill
    if (pathname === "/frontmatter" && req.method === "POST") {
      const { skill, frontmatter } = await req.json() as { skill: string; frontmatter: Record<string, unknown> };
      if (!skill) return json({ ok: false, error: "Missing skill parameter" }, 400);
      const engDir = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill);
      const engPath = join(engDir, "engagement.yaml");
      if (!existsSync(engPath)) return json({ ok: false, error: "Engagement file not found" }, 404);

      // Read existing file to preserve structure
      const existing = readFileSync(engPath, "utf-8");
      const existingFm = parseYaml(existing);

      // Merge new values
      Object.assign(existingFm, frontmatter);

      // Write back
      const newContent = stringifyYaml(existingFm);
      writeFileSync(engPath, newContent, "utf-8");
      return json({ ok: true });
    }

    // GET /section - read a section file
    if (pathname === "/section" && req.method === "GET") {
      const skill = url.searchParams.get("skill");
      const sectionType = url.searchParams.get("sectionType");
      const sectionId = url.searchParams.get("sectionId");

      if (!skill || !sectionType || !sectionId) {
        return json({ ok: false, error: "Missing parameters" }, 400);
      }

      // Load templates config to find file path
      const configPath = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");
      const configContent = readFileSync(configPath, "utf-8");
      const config = parseYaml(configContent);

      let filePath = "";
      if (sectionType === "base") {
        const section = (config.sections as Record<string, { file: string }>)?.[sectionId];
        filePath = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill, "_sections", section?.file || `_${sectionId}.qmd`);
      } else {
        const skillConfig = (config.skills as Record<string, { unique_sections: { id: string; file: string }[] }>)?.[skill];
        const section = skillConfig?.unique_sections?.find(s => s.id === sectionId);
        filePath = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill, "_sections", section?.file || `_${sectionId}.qmd`);
      }

      if (!existsSync(filePath)) return json({ ok: false, error: "Section file not found" }, 404);
      const content = readFileSync(filePath, "utf-8");
      return json({ ok: true, content, path: filePath });
    }

    // POST /section - save a section file
    if (pathname === "/section" && req.method === "POST") {
      const { skill, sectionType, sectionId, content } = await req.json() as {
        skill: string;
        sectionType: string;
        sectionId: string;
        content: string;
      };

      if (!skill || !sectionType || !sectionId) {
        return json({ ok: false, error: "Missing parameters" }, 400);
      }

      // Load templates config to find file path
      const configPath = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");
      const configContent = readFileSync(configPath, "utf-8");
      const config = parseYaml(configContent);

      let filePath = "";
      if (sectionType === "base") {
        const section = (config.sections as Record<string, { file: string }>)?.[sectionId];
        filePath = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill, "_sections", section?.file || `_${sectionId}.qmd`);
      } else {
        const skillConfig = (config.skills as Record<string, { unique_sections: { id: string; file: string }[] }>)?.[skill];
        const section = skillConfig?.unique_sections?.find(s => s.id === sectionId);
        filePath = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skill, "_sections", section?.file || `_${sectionId}.qmd`);
      }

      if (!existsSync(filePath)) return json({ ok: false, error: "Section file not found" }, 404);
      writeFileSync(filePath, content, "utf-8");
      return json({ ok: true });
    }

    // POST /builder-create-skill - create a new template skill
    if (pathname === "/builder-create-skill" && req.method === "POST") {
      const { skillId, skillName } = await req.json() as { skillId: string; skillName: string };

      if (!skillId || !skillName) {
        return json({ ok: false, error: "Missing skillId or skillName" }, 400);
      }

      // Check if skill already exists
      const configPath = join(FRAMEWORK_ROOT, "tools/quarto/templates/templates.yaml");
      const configContent = readFileSync(configPath, "utf-8");
      const config = parseYaml(configContent);

      if ((config.skills as Record<string, unknown>)?.[skillId]) {
        return json({ ok: false, error: "Skill already exists" }, 400);
      }

      // Create skill directory
      const skillDir = join(FRAMEWORK_ROOT, "tools/quarto/templates/reports", skillId);
      const sectionsDir = join(skillDir, "_sections");
      mkdirSync(sectionsDir, { recursive: true });

      // Create engagement.yaml
      const engagementYaml = `# ${skillName} Report Engagement Metadata
# Copy to your engagement directory and customize

project_name: "[Project Name]"
project_version: "1.0.0"
repo_url: "https://github.com/org/repo"
primary_language: "[Language]"
frameworks: "[Frameworks]"

client_name: "[Client Company Name]"
client_contact: "[Client Contact]"
client_email: "[email@domain.com]"

engagement_id: "${skillId.toUpperCase()}-$(date +%Y)-001"
engagement_type: "${skillName} Report"
assessment_type: "Security Assessment"

classification: "Confidential"
start_date: "$(date +%Y-%m-%d)"
end_date: "$(date +%Y-%m-%d)"
report_date: "$(date +%Y-%m-%d)"
report_version: "1.0"

reviewer_name: "[Your Name]"
reviewer_org: "Your Organization"
reviewer_contact: "[email@domain.com]"

scope_in:
  - "[Target] | [Type] | [Description] | [Environment]"
scope_out:
  - "[Out of scope item]""

compliance:
  - "[Framework 1]"

tools:
  - "[Tool Name] | [Purpose] | [Version]"
`;
      writeFileSync(join(skillDir, "engagement.yaml"), engagementYaml, "utf-8");

      // Create base _sections files (cover, executive_summary, scope, findings, recommendations, appendices)
      const baseSections = ["cover", "executive_summary", "scope", "findings", "recommendations", "appendices"];
      for (const sec of baseSections) {
        const content = `# ${sec.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n\n{{> _sections/_${sec}.qmd }}\n`;
        writeFileSync(join(sectionsDir, `_${sec}.qmd`), content, "utf-8");
      }

      // Add skill to templates.yaml
      (config.skills as Record<string, unknown>)[skillId] = {
        name: skillName,
        report_type: skillId,
        sections: baseSections,
        unique_sections: [],
      };
      writeFileSync(configPath, stringifyYaml(config), "utf-8");

      // Run create-template.ts for the new skill
      const result = spawnSync("bun", [
        "tools/quarto/scripts/create-template.ts",
        "--skill", skillId
      ], {
        cwd: FRAMEWORK_ROOT,
        encoding: "utf-8",
      });

      if (result.status !== 0) {
        console.error("Template generation error:", result.stderr);
      }

      return json({ ok: true, skillId, skillName });
    }

    // GET /list-engagements — list engagement directories in private/output/
    if (pathname === "/list-engagements" && req.method === "GET") {
      const outputDir = join(FRAMEWORK_ROOT, "private/output");
      if (!existsSync(outputDir)) return json({ ok: true, engagements: [] });
      const entries: { path: string; name: string; modified: string }[] = [];
      try {
        for (const dir of readdirSync(outputDir)) {
          const engYaml = join(outputDir, dir, "engagement.yaml");
          if (existsSync(engYaml)) {
            const stat = statSync(join(outputDir, dir));
            entries.push({
              path: dir,
              name: dir,
              modified: stat.mtime.toISOString(),
            });
          }
        }
      } catch { /* ignore */ }
      return json({ ok: true, engagements: entries });
    }

    // POST /generate — run report-generator for an engagement
    if (pathname === "/generate" && req.method === "POST") {
      const { engagementPath, formats = ["html"], draft = true } =
        (await req.json()) as {
          engagementPath: string;
          formats?: string[];
          draft?: boolean;
        };
      if (!engagementPath) {
        return json({ ok: false, error: "Missing engagementPath" }, 400);
      }
      const engYaml = join(
        FRAMEWORK_ROOT, "private/output", engagementPath, "engagement.yaml"
      );
      if (!existsSync(engYaml)) {
        return json({ ok: false, error: "engagement.yaml not found" }, 404);
      }
      const assembler = join(
        FRAMEWORK_ROOT, "skills/sec-review/scripts/assemble-report.ts"
      );
      const draftArg = draft ? "--draft" : "--no-draft";
      const result = spawnSync(
        "bun",
        [assembler, "--engagement", engYaml, "--render", draftArg],
        { cwd: FRAMEWORK_ROOT, encoding: "utf-8", timeout: 120000 }
      );
      if (result.status !== 0) {
        return json(
          { ok: false, error: result.stderr || "generation failed" }, 500
        );
      }
      return json({ ok: true, output: result.stdout });
    }

    return new Response("Not found", { status: 404 });
  },
});

console.log(`Style editor running at http://127.0.0.1:${PORT}`);
