#!/usr/bin/env bun
/**
 * NVD (National Vulnerability Database) API Client
 *
 * Queries NVD API for CVEs based on keywords, products, or CVE IDs
 * API Docs: https://nvd.nist.gov/developers/vulnerabilities
 *
 * Requires: NVD_API_KEY in .env (optional but increases rate limit from 5 to 50 requests per 30 seconds)
 *
 * Features:
 * - Retry with exponential backoff for transient errors
 * - Fallback to websearch when NVD API fails
 * - Comprehensive error handling per api-error-catalog.md
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
 * Error types for NVD API failures
 */
export enum NVDFailureType {
  RATE_LIMIT = 'RATE_LIMIT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR',
  INVALID_QUERY = 'INVALID_QUERY',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Result object for NVD search with fallback indication
 */
export interface NVDSearchResult {
  success: boolean;
  data?: NVDResponse;
  failureType?: NVDFailureType;
  errorMessage?: string;
  fallbackRecommended: boolean;
}

/**
 * Sleep utility for retries
 */
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Parse NVD error from response
 */
function parseNVDError(status: number, errorBody: string): NVDFailureType {
  if (status === 429) return NVDFailureType.RATE_LIMIT;
  if (status === 503) return NVDFailureType.SERVICE_UNAVAILABLE;
  if (status === 400) return NVDFailureType.INVALID_QUERY;
  // Check error body for specific messages
  if (errorBody.toLowerCase().includes('unavailable')) return NVDFailureType.SERVICE_UNAVAILABLE;
  if (errorBody.toLowerCase().includes('rate limit')) return NVDFailureType.RATE_LIMIT;
  return NVDFailureType.UNKNOWN;
}

/**
 * Query NVD API for CVEs by keyword with retry logic
 * @param keyword - Technology/product keyword (e.g., "graphql", "next.js")
 * @param options - Additional filters
 * @param retryOptions - Retry configuration
 */
export async function searchCVEsByKeyword(
  keyword: string,
  options: {
    startDate?: string; // YYYY-MM-DD
    endDate?: string;   // YYYY-MM-DD (defaults to today if only startDate provided)
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    limit?: number;
  } = {},
  retryOptions: {
    maxRetries?: number;
    initialBackoffMs?: number;
    useFallback?: boolean; // If true, returns fallback result instead of throwing
  } = {}
): Promise<NVDResponse> {
  const {
    maxRetries = 3,
    initialBackoffMs = 1000,
    useFallback = false
  } = retryOptions;

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

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${NVD_BASE_URL}?${params}`, { headers });

      if (!response.ok) {
        const errorBody = await response.text();
        const failureType = parseNVDError(response.status, errorBody);

        // Retry on transient errors
        if (failureType === NVDFailureType.RATE_LIMIT || failureType === NVDFailureType.SERVICE_UNAVAILABLE) {
          if (attempt < maxRetries) {
            const backoffMs = initialBackoffMs * Math.pow(2, attempt);
            console.error(`NVD ${failureType} error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
            await sleep(backoffMs);
            continue;
          }
        }

        const error = new Error(`NVD API error: ${response.status} ${response.statusText} - ${errorBody}`);
        lastError = error;

        if (useFallback) {
          return {
            success: false,
            failureType,
            errorMessage: error.message,
            fallbackRecommended: true,
          } as unknown as NVDResponse;
        }
        throw error;
      }

      const data = await response.json() as NVDResponse;
      return data;
    } catch (error) {
      lastError = error as Error;

      // Check if it's a network error or timeout
      if (error instanceof TypeError && error.message.includes('fetch')) {
        if (attempt < maxRetries) {
          const backoffMs = initialBackoffMs * Math.pow(2, attempt);
          console.error(`NVD network error, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
          await sleep(backoffMs);
          continue;
        }

        if (useFallback) {
          return {
            success: false,
            failureType: NVDFailureType.NETWORK_ERROR,
            errorMessage: error.message,
            fallbackRecommended: true,
          } as unknown as NVDResponse;
        }
      }

      // If this is the last attempt, throw
      if (attempt >= maxRetries) break;

      // Exponential backoff for other errors
      const backoffMs = initialBackoffMs * Math.pow(2, attempt);
      console.error(`NVD error: ${error}, retrying in ${backoffMs}ms (attempt ${attempt + 1}/${maxRetries + 1})`);
      await sleep(backoffMs);
    }
  }

  // All retries exhausted
  if (useFallback) {
    return {
      success: false,
      failureType: NVDFailureType.UNKNOWN,
      errorMessage: lastError?.message || 'Unknown error after retries',
      fallbackRecommended: true,
    } as unknown as NVDResponse;
  }

  throw new Error(`Failed to query NVD API after ${maxRetries + 1} attempts: ${lastError}`);
}

/**
 * Search CVEs with automatic fallback to websearch on failure
 * Returns either NVD data or a fallback result indicating websearch should be used
 *
 * @param keyword - Technology/product keyword
 * @param options - Search options
 * @returns NVDSearchResult with success flag and either data or fallback recommendation
 */
export async function searchCVEsWithFallback(
  keyword: string,
  options: {
    startDate?: string;
    endDate?: string;
    severity?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    limit?: number;
  } = {}
): Promise<NVDSearchResult> {
  try {
    const data = await searchCVEsByKeyword(keyword, options, {
      maxRetries: 3,
      initialBackoffMs: 1000,
      useFallback: false // First try without fallback to get retry behavior
    });

    return {
      success: true,
      data,
      fallbackRecommended: false
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Determine failure type (case-insensitive)
    const lowerErrorMessage = errorMessage.toLowerCase();
    let failureType = NVDFailureType.UNKNOWN;
    if (errorMessage.includes('429') || lowerErrorMessage.includes('rate limit')) {
      failureType = NVDFailureType.RATE_LIMIT;
    } else if (errorMessage.includes('503') || lowerErrorMessage.includes('unavailable')) {
      failureType = NVDFailureType.SERVICE_UNAVAILABLE;
    } else if (lowerErrorMessage.includes('timeout')) {
      failureType = NVDFailureType.TIMEOUT;
    } else if (lowerErrorMessage.includes('network') || lowerErrorMessage.includes('fetch')) {
      failureType = NVDFailureType.NETWORK_ERROR;
    }

    console.error(`NVD API failed (${failureType}): ${errorMessage}`);
    console.error('Recommend using websearch as fallback for CVE information');

    return {
      success: false,
      failureType,
      errorMessage,
      fallbackRecommended: true
    };
  }
}

/**
 * Get specific CVE by ID with retry logic
 */
export async function getCVEById(
  cveId: string,
  retryOptions: {
    maxRetries?: number;
    initialBackoffMs?: number;
  } = {}
): Promise<NVDVulnerability | null> {
  const {
    maxRetries = 3,
    initialBackoffMs = 1000
  } = retryOptions;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (NVD_API_KEY) {
    headers['apiKey'] = NVD_API_KEY;
  }

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(`${NVD_BASE_URL}?cveId=${cveId}`, { headers });

      if (!response.ok) {
        if (response.status === 404) return null;
        if (response.status === 429 || response.status === 503) {
          if (attempt < maxRetries) {
            const backoffMs = initialBackoffMs * Math.pow(2, attempt);
            await sleep(backoffMs);
            continue;
          }
        }
        throw new Error(`NVD API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json() as NVDResponse;
      return data.vulnerabilities[0]?.cve || null;
    } catch (error) {
      if (attempt >= maxRetries) break;
      const backoffMs = initialBackoffMs * Math.pow(2, attempt);
      await sleep(backoffMs);
    }
  }

  // Return null on failure (caller should use websearch fallback)
  console.error(`Failed to fetch CVE ${cveId} after ${maxRetries + 1} attempts`);
  return null;
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
