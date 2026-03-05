#!/usr/bin/env bun
/**
 * NVD (National Vulnerability Database) API Client
 *
 * Queries NVD API for CVEs based on keywords, products, or CVE IDs
 * API Docs: https://nvd.nist.gov/developers/vulnerabilities
 *
 * Requires: NVD_API_KEY in .env (optional but increases rate limit from 5 to 50 requests per 30 seconds)
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from framework root
config({ path: resolve(import.meta.dir, '../../.env') });

const NVD_API_KEY = process.env.NVD_API_KEY;
const NVD_BASE_URL = 'https://services.nvd.nist.gov/rest/json/cves/2.0';

export interface NVDVulnerability {
  id: string;
  sourceIdentifier?: string;
  published: string;
  lastModified: string;
  vulnStatus: string;
  descriptions: Array<{
    lang: string;
    value: string;
  }>;
  metrics?: {
    cvssMetricV31?: Array<{
      cvssData: {
        baseScore: number;
        baseSeverity: string;
        vectorString: string;
      };
    }>;
    cvssMetricV2?: Array<{
      cvssData: {
        baseScore: number;
        baseSeverity: string;
        vectorString: string;
      };
    }>;
  };
  weaknesses?: Array<{
    description: Array<{
      lang: string;
      value: string; // CWE ID
    }>;
  }>;
  references: Array<{
    url: string;
    source: string;
  }>;
}

export interface NVDResponse {
  vulnerabilities: Array<{
    cve: NVDVulnerability;
  }>;
  totalResults: number;
}

/**
 * Query NVD API for CVEs by keyword
 * @param keyword - Technology/product keyword (e.g., "graphql", "next.js")
 * @param options - Additional filters
 */
export async function searchCVEsByKeyword(
  keyword: string,
  options: {
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD (defaults to today if only startDate provided)
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    limit?: number;
  } = {}
): Promise<NVDResponse> {
  // Use lastModStartDate/lastModEndDate per NVD best practices for recent CVE queries
  // See: https://nvd.nist.gov/developers/api-workflows
  // NVD requires both start and end dates together when using date filters
  const hasDateFilter = options.startDate || options.endDate;
  const endDate = options.endDate || new Date().toISOString().split('T')[0];

  const params = new URLSearchParams({
    keywordSearch: keyword,
    ...(hasDateFilter && {
      lastModStartDate: `${options.startDate || '1970-01-01'}T00:00:00.000`,
      lastModEndDate: `${endDate}T23:59:59.999`,
    }),
    ...(options.severity && { cvssV3Severity: options.severity }),
    resultsPerPage: String(options.limit || 20),
  });

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (NVD_API_KEY) {
    headers['apiKey'] = NVD_API_KEY;
  }

  try {
    const response = await fetch(`${NVD_BASE_URL}?${params}`, { headers });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`NVD API error: ${response.status} ${response.statusText} - ${errorBody}`);
    }

    const data = await response.json() as NVDResponse;
    return data;
  } catch (error) {
    throw new Error(`Failed to query NVD API: ${error}`);
  }
}

/**
 * Get specific CVE by ID
 */
export async function getCVEById(cveId: string): Promise<NVDVulnerability | null> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (NVD_API_KEY) {
    headers['apiKey'] = NVD_API_KEY;
  }

  try {
    const response = await fetch(`${NVD_BASE_URL}?cveId=${cveId}`, { headers });

    if (!response.ok) {
      if (response.status === 404) return null;
      throw new Error(`NVD API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as NVDResponse;
    return data.vulnerabilities[0]?.cve || null;
  } catch (error) {
    throw new Error(`Failed to fetch CVE ${cveId}: ${error}`);
  }
}

/**
 * Format CVE for markdown output
 */
export function formatCVEForMarkdown(cve: NVDVulnerability): string {
  const description = cve.descriptions.find(d => d.lang === 'en')?.value || 'No description';
  const cvssV3 = cve.metrics?.cvssMetricV31?.[0]?.cvssData;
  const cvssV2 = cve.metrics?.cvssMetricV2?.[0]?.cvssData;
  const cvss = cvssV3 || cvssV2;
  const cwes = cve.weaknesses?.map(w => w.description.find(d => d.lang === 'en')?.value).filter(Boolean) || [];

  return `
${cve.id} | ${cvss?.baseSeverity || 'Unknown'} | ${description.split('.')[0]}
- CVSS: ${cvss?.baseScore || 'N/A'} (${cvss?.baseSeverity || 'Unknown'})
- Vector: ${cvss?.vectorString || 'N/A'}
- CWE: ${cwes.join(', ') || 'Not specified'}
- Published: ${new Date(cve.published).toISOString().split('T')[0]}
- Status: ${cve.vulnStatus}
- Source: https://nvd.nist.gov/vuln/detail/${cve.id}
`.trim();
}

// CLI usage
if (import.meta.main) {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('Usage: bun nvd-client.ts <keyword> [--severity CRITICAL|HIGH|MEDIUM|LOW] [--limit N] [--since YYYY-MM-DD]');
    process.exit(1);
  }

  const keyword = args[0];
  const severityArg = args.find(arg => arg.startsWith('--severity='))?.split('=')[1] as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | undefined;
  const limitArg = args.find(arg => arg.startsWith('--limit='))?.split('=')[1];
  const sinceArg = args.find(arg => arg.startsWith('--since='))?.split('=')[1];

  const options: Parameters<typeof searchCVEsByKeyword>[1] = {
    ...(severityArg && { severity: severityArg }),
    ...(limitArg && { limit: parseInt(limitArg) }),
    ...(sinceArg && { startDate: sinceArg }),
  };

  console.log(`Searching NVD for CVEs matching: "${keyword}"`);
  if (severityArg) console.log(`Severity filter: ${severityArg}`);
  if (sinceArg) console.log(`Since: ${sinceArg}`);
  console.log();

  const result = await searchCVEsByKeyword(keyword, options);

  console.log(`Total results: ${result.totalResults}`);
  console.log(`Returned: ${result.vulnerabilities.length}\n`);

  result.vulnerabilities.forEach(({ cve }) => {
    console.log(formatCVEForMarkdown(cve));
    console.log();
  });
}
