#!/usr/bin/env bun
/**
 * IPA Downloader
 *
 * iOS IPA downloader with App Store authentication handling.
 * Used for future reverse engineering work (Phase 0 infrastructure).
 *
 * ⚠️ Legal Warning:
 * - Downloading IPAs may violate Apple ToS
 * - Use only for apps you have legal rights to analyze
 * - For research/security testing purposes only
 * - Requires valid Apple ID credentials
 *
 * @version 1.0
 * @created 2026-01-23
 */

import { chromium, Browser, Page } from 'playwright';
import { createHash } from 'crypto';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface IPADownloadRequest {
  appName: string; // e.g., "Twitter" or "com.twitter.app"
  appleId?: string; // Apple ID email (loaded from env if not provided)
  applePassword?: string; // Apple ID password (loaded from env if not provided)
  outputDir?: string; // Default: ./output/ipas
}

interface IPADownloadResult {
  status: 'success' | 'error';
  appName: string;
  version?: string;
  filePath?: string;
  fileSize?: number;
  sha256?: string;
  error?: string;
  downloadTime_ms?: number;
}

interface DownloadCache {
  [key: string]: {
    filePath: string;
    version: string;
    sha256: string;
    downloadedAt: number;
  };
}

const DEFAULT_OUTPUT_DIR = join(process.cwd(), 'output', 'ipas');
const CACHE_FILE = join(process.cwd(), '.cache', 'ipa-downloads.json');
const CACHE_TTL_DAYS = 30;

/**
 * Calculate SHA256 hash of a file
 */
function calculateSHA256(filePath: string): string {
  const fileBuffer = readFileSync(filePath);
  const hashSum = createHash('sha256');
  hashSum.update(fileBuffer);
  return hashSum.digest('hex');
}

/**
 * Load download cache
 */
function loadCache(): DownloadCache {
  if (!existsSync(CACHE_FILE)) {
    return {};
  }

  try {
    const cacheData = readFileSync(CACHE_FILE, 'utf-8');
    return JSON.parse(cacheData);
  } catch {
    return {};
  }
}

/**
 * Save download cache
 */
function saveCache(cache: DownloadCache): void {
  const cacheDir = join(process.cwd(), '.cache');
  if (!existsSync(cacheDir)) {
    mkdirSync(cacheDir, { recursive: true });
  }

  writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
}

/**
 * Check if cached download is still valid
 */
function isCacheValid(cacheEntry: DownloadCache[string]): boolean {
  const ageMs = Date.now() - cacheEntry.downloadedAt;
  const ageDays = ageMs / (1000 * 60 * 60 * 24);

  return ageDays < CACHE_TTL_DAYS && existsSync(cacheEntry.filePath);
}

/**
 * Get Apple credentials from environment
 */
function getAppleCredentials(): { appleId?: string; applePassword?: string } {
  return {
    appleId: process.env.APPLE_ID || Bun.env.APPLE_ID,
    applePassword: process.env.APPLE_PASSWORD || Bun.env.APPLE_PASSWORD
  };
}

/**
 * Download IPA using ipatool (recommended approach)
 *
 * ipatool is a CLI tool for downloading IPAs from the App Store:
 * https://github.com/majd/ipatool
 *
 * Installation: brew install ipatool
 *
 * This is the most reliable method as it uses official Apple APIs.
 */
async function downloadIPAWithIPATool(
  request: IPADownloadRequest
): Promise<IPADownloadResult> {
  const startTime = Date.now();

  try {
    // Get credentials
    const credentials = getAppleCredentials();
    const appleId = request.appleId || credentials.appleId;
    const applePassword = request.applePassword || credentials.applePassword;

    if (!appleId || !applePassword) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Apple ID and password required (set APPLE_ID and APPLE_PASSWORD in .env)'
      };
    }

    const outputDir = request.outputDir || DEFAULT_OUTPUT_DIR;
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    console.log(`  🔍 Searching App Store for ${request.appName}...`);

    // First, authenticate with ipatool
    console.log(`  🔐 Authenticating with App Store...`);
    const authProc = Bun.spawn([
      'ipatool',
      'auth',
      'login',
      '--email', appleId,
      '--password', applePassword
    ]);

    const authExitCode = await authProc.exited;
    if (authExitCode !== 0) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Apple authentication failed'
      };
    }

    console.log(`  ⬇️ Downloading IPA...`);

    // Download the app
    const downloadProc = Bun.spawn([
      'ipatool',
      'download',
      '--bundle-identifier', request.appName,
      '--output', outputDir
    ]);

    const downloadExitCode = await downloadProc.exited;
    if (downloadExitCode !== 0) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'IPA download failed (check if app exists and is available in your region)'
      };
    }

    // Find the downloaded IPA file
    const files = await Array.fromAsync(
      new Bun.Glob(`${request.appName}*.ipa`).scan(outputDir)
    );

    if (files.length === 0) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Downloaded IPA file not found'
      };
    }

    const filePath = join(outputDir, files[0]);
    const downloadTime_ms = Date.now() - startTime;

    // Calculate SHA256
    const sha256 = calculateSHA256(filePath);

    // Get file size
    const fileSize = await Bun.file(filePath).size;

    return {
      status: 'success',
      appName: request.appName,
      filePath,
      fileSize,
      sha256,
      downloadTime_ms
    };

  } catch (error) {
    return {
      status: 'error',
      appName: request.appName,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Download IPA using Web-based approach (fallback, more complex)
 *
 * This approach uses third-party sites like ipaspot.app or iosgods.com
 * Less reliable than ipatool but doesn't require Apple credentials.
 */
async function downloadIPAFromWeb(
  browser: Browser,
  request: IPADownloadRequest
): Promise<IPADownloadResult> {
  const page = await browser.newPage();

  try {
    console.log(`  🔍 Searching web sources for ${request.appName}...`);

    // Navigate to ipaspot.app (example third-party source)
    await page.goto(`https://ipaspot.app/search.html?q=${encodeURIComponent(request.appName)}`);

    // Wait for search results
    await page.waitForSelector('.app-item', { timeout: 10000 });

    // Click first result
    const firstResult = await page.$('.app-item a');
    if (!firstResult) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'No search results found'
      };
    }

    await firstResult.click();
    await page.waitForLoadState('networkidle');

    // Click download button
    console.log(`  ⬇️ Initiating download...`);
    const downloadButton = await page.$('.download-btn');
    if (!downloadButton) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Download button not found'
      };
    }

    await downloadButton.click();

    // Start download
    const startTime = Date.now();
    const download = await page.waitForEvent('download', { timeout: 60000 });
    const outputDir = request.outputDir || DEFAULT_OUTPUT_DIR;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${request.appName}.ipa`;
    const filePath = join(outputDir, fileName);

    await download.saveAs(filePath);
    const downloadTime_ms = Date.now() - startTime;

    // Calculate SHA256
    const sha256 = calculateSHA256(filePath);

    // Get file size
    const fileSize = await Bun.file(filePath).size;

    return {
      status: 'success',
      appName: request.appName,
      filePath,
      fileSize,
      sha256,
      downloadTime_ms
    };

  } catch (error) {
    return {
      status: 'error',
      appName: request.appName,
      error: error instanceof Error ? error.message : String(error)
    };
  } finally {
    await page.close();
  }
}

/**
 * Download IPA with caching
 *
 * @param request - Download request
 * @param method - Download method: 'ipatool' (recommended) or 'web' (fallback)
 * @returns Download result
 */
export async function downloadIPA(
  request: IPADownloadRequest,
  method: 'ipatool' | 'web' = 'ipatool'
): Promise<IPADownloadResult> {
  // Check cache first
  const cache = loadCache();
  const cacheKey = `${request.appName}:${method}`;

  if (cache[cacheKey] && isCacheValid(cache[cacheKey])) {
    console.log(`✨ Using cached IPA for ${request.appName}`);
    return {
      status: 'success',
      appName: request.appName,
      ...cache[cacheKey]
    };
  }

  console.log(`\n📱 Downloading IPA: ${request.appName}`);
  console.log(`   Method: ${method}`);

  let result: IPADownloadResult;

  if (method === 'ipatool') {
    result = await downloadIPAWithIPATool(request);
  } else {
    // Web-based fallback
    const browser = await chromium.launch({ headless: true });
    try {
      result = await downloadIPAFromWeb(browser, request);
    } finally {
      await browser.close();
    }
  }

  // Update cache on success
  if (result.status === 'success' && result.filePath && result.sha256) {
    cache[cacheKey] = {
      filePath: result.filePath,
      version: result.version || 'latest',
      sha256: result.sha256,
      downloadedAt: Date.now()
    };
    saveCache(cache);
  }

  return result;
}

/**
 * Download multiple IPAs in parallel
 *
 * @param requests - Array of download requests
 * @param method - Download method
 * @returns Array of download results
 */
export async function downloadIPAsParallel(
  requests: IPADownloadRequest[],
  method: 'ipatool' | 'web' = 'ipatool'
): Promise<IPADownloadResult[]> {
  console.log(`\n🚀 Downloading ${requests.length} IPAs in parallel...`);

  const promises = requests.map(request => downloadIPA(request, method));
  const results = await Promise.all(promises);

  const successes = results.filter(r => r.status === 'success').length;
  const failures = results.filter(r => r.status === 'error').length;

  console.log(`\n✅ ${successes} succeeded, ❌ ${failures} failed\n`);

  return results;
}

/**
 * CLI entry point
 */
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
IPA Downloader

⚠️ Legal Warning:
  - Downloading IPAs may violate Apple ToS
  - Use only for apps you have legal rights to analyze
  - For research/security testing purposes only
  - Requires valid Apple ID credentials

Prerequisites:
  - Install ipatool: brew install ipatool
  - Set APPLE_ID and APPLE_PASSWORD in .env

Usage:
  bun run download-ipa.ts <bundle-id> [method] [output-dir]

Arguments:
  bundle-id   App bundle identifier (e.g., "com.twitter.app")
  method      Optional: "ipatool" (default, recommended) or "web"
  output-dir  Optional: Output directory (default: ./output/ipas)

Environment Variables:
  APPLE_ID        Apple ID email address
  APPLE_PASSWORD  Apple ID password

Examples:
  bun run download-ipa.ts com.twitter.app
  bun run download-ipa.ts com.twitter.app web
  bun run download-ipa.ts com.twitter.app ipatool /tmp/ipas
`);
    process.exit(0);
  }

  const request: IPADownloadRequest = {
    appName: args[0],
    outputDir: args[2]
  };

  const method = (args[1] as 'ipatool' | 'web') || 'ipatool';

  const result = await downloadIPA(request, method);

  if (result.status === 'success') {
    console.log('\n✅ Download successful!\n');
    console.log(`App:       ${result.appName}`);
    console.log(`File:      ${result.filePath}`);
    console.log(`Size:      ${(result.fileSize! / 1024 / 1024).toFixed(2)} MB`);
    console.log(`SHA256:    ${result.sha256}`);
    console.log(`Time:      ${result.downloadTime_ms}ms`);
    process.exit(0);
  } else {
    console.log('\n❌ Download failed!\n');
    console.log(`Error: ${result.error}`);
    process.exit(1);
  }
}

if (import.meta.main) {
  main();
}
