import { readFileSync, writeFileSync, existsSync } from "fs";
import { parse } from "yaml";

export type ColorMap = Record<string, string | undefined>;
export interface ReportDefaults {
  reviewerOrg?:     string;
  reviewerContact?: string;
  reviewerEmail?:   string;
  classification?:  string;
}

export interface BrandConfig {
  colors: ColorMap;
  securityColors: ColorMap;
  complianceColors: ColorMap;
  tableColors: ColorMap;
  codeColors: ColorMap;
  typography: { baseFamily?: string; headingsFamily?: string; monospaceFamily?: string };
  htmlTheme?: string;
  reportDefaults?: ReportDefaults;
}

type YamlDoc = Record<string, unknown>;

function obj(v: unknown): YamlDoc {
  return (v && typeof v === "object" ? v : {}) as YamlDoc;
}

function pickColors(src: YamlDoc, keys: string[]): ColorMap {
  return Object.fromEntries(keys.map(k => [k, src[k] as string | undefined]));
}

export function parseBrand(yamlPath: string): BrandConfig {
  const doc = parse(readFileSync(yamlPath, "utf-8")) as YamlDoc;
  const brand = obj(doc.brand);
  const color = obj(brand.color);
  const secColor = obj(obj(brand.security).color);
  const compColor = obj(obj(brand.compliance).color);
  const typo = obj(brand.typography);
  const base = obj(typo.base);
  const headings = obj(typo.headings);
  const mono = obj(typo.monospace);
  const themeObj = obj(obj(obj(brand.defaults).html).theme);
  const report   = obj(brand.report);

  return {
    colors: pickColors(color, ["primary","secondary","success","warning","danger","info","foreground","background","muted","border"]),
    securityColors: pickColors(secColor, ["critical","high","medium","low","informational"]),
    // Map _brand.yml kebab-case compliance keys to camelCase used by the UI
    complianceColors: {
      compliant:    compColor.compliant as string | undefined,
      partial:      compColor.partial as string | undefined,
      nonCompliant: compColor["non-compliant"] as string | undefined,
      na:           compColor["not-applicable"] as string | undefined,
      pending:      compColor["not-assessed"] as string | undefined,
    },
    tableColors: {},
    codeColors: {},
    typography: {
      baseFamily: base.family as string,
      headingsFamily: headings.family as string,
      monospaceFamily: mono.family as string,
    },
    htmlTheme: typeof themeObj === "string" ? themeObj : (themeObj.light as string),
    reportDefaults: {
      reviewerOrg:     report.reviewer_org as string | undefined,
      reviewerContact: report.reviewer_contact as string | undefined,
      reviewerEmail:   report.reviewer_email as string | undefined,
      classification:  report.default_classification as string | undefined,
    },
  };
}

/**
 * Reads table and code colors from a generated styles.css file.
 * These values are not stored in _brand.yml — styles.css is the source of truth for them.
 */
export function parseCss(cssPath: string): {
  tableColors: ColorMap;
  codeColors: ColorMap;
  typography: { baseSize?: string; lineHeight?: string; headingWeight?: string };
} {
  if (!existsSync(cssPath)) return { tableColors: {}, codeColors: {}, typography: {} };
  const css = readFileSync(cssPath, "utf-8");
  const get = (varName: string): string | undefined => {
    const m = css.match(new RegExp(`${varName}:\\s*([^;\\n]+)`));
    return m?.[1]?.trim();
  };
  return {
    tableColors: {
      headerBg:   get("--table-header-bg"),
      headerText: get("--table-header-text"),
      stripe:     get("--table-stripe"),
      border:     get("--table-border"),
    },
    codeColors: {
      bg:        get("--code-bg"),
      text:      get("--code-text"),
      inlineBg:  get("--code-inline-bg"),
      inlineText: get("--code-inline-text"),
    },
    typography: {
      baseSize:      get("--font-size"),
      lineHeight:    get("--line-height"),
      headingWeight: get("--heading-weight"),
    },
  };
}

/**
 * Updates _brand.yml via targeted string replacement - preserves comments/formatting.
 */
export function writeBrand(yamlPath: string, updates: Partial<BrandConfig>): void {
  let content = readFileSync(yamlPath, "utf-8");

  const replaceColor = (key: string, val: string): void => {
    const pat = new RegExp(`(\\b${key}:\\s*)("?#[0-9A-Fa-f]{3,6}"?)`, "g");
    content = content.replace(pat, `$1"${val}"`);
  };

  // Compliance color keys are camelCase in the editor, kebab-case in _brand.yml
  const complianceYamlKeys: Record<string, string> = {
    nonCompliant: "non-compliant",
    na:           "not-applicable",
    pending:      "not-assessed",
  };

  for (const [k, v] of Object.entries(updates.colors ?? {})) if (v) replaceColor(k, v);
  for (const [k, v] of Object.entries(updates.securityColors ?? {})) if (v) replaceColor(k, v);
  for (const [k, v] of Object.entries(updates.complianceColors ?? {})) if (v) replaceColor(complianceYamlKeys[k] ?? k, v);
  // tableColors and codeColors are not stored in _brand.yml — they live in styles.css

  const typo = updates.typography;
  if (typo?.baseFamily) {
    content = content.replace(/(base:\n\s+family:\s*)"[^"]*"/, `$1"${typo.baseFamily}"`);
  }
  if (typo?.headingsFamily) {
    content = content.replace(/(headings:\n\s+family:\s*)"[^"]*"/, `$1"${typo.headingsFamily}"`);
  }
  if (typo?.monospaceFamily) {
    content = content.replace(/(monospace:\n\s+family:\s*)"[^"]*"/, `$1"${typo.monospaceFamily}"`);
  }

  const rd = updates.reportDefaults;
  if (rd?.reviewerOrg)     content = content.replace(/(reviewer_org:\s*)"[^"]*"/, `$1"${rd.reviewerOrg}"`);
  if (rd?.reviewerContact) content = content.replace(/(reviewer_contact:\s*)"[^"]*"/, `$1"${rd.reviewerContact}"`);
  if (rd?.reviewerEmail)   content = content.replace(/(reviewer_email:\s*)"[^"]*"/, `$1"${rd.reviewerEmail}"`);
  if (rd?.classification)  content = content.replace(/(default_classification:\s*)"[^"]*"/, `$1"${rd.classification}"`);

  writeFileSync(yamlPath, content, "utf-8");
}
