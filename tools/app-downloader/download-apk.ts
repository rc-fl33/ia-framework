#!/usr/bin/env bun
/**
 * APK Downloader
 *
 * Playwright-based APK downloader targeting APKMirror/APKPure.
 * Used for future reverse engineering work (Phase 0 infrastructure).
 *
 * ⚠️ Legal Warning:
 * - Downloading APKs may violate app ToS
 * - Use only for apps you have legal rights to analyze
 * - For research/security testing purposes only
 *
 * @version 1.0
 * @created 2026-01-23
 */

import { chromium, Browser, Page } from 'playwright';
import { createHash } from 'crypto';
import { writeFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { join } from 'path';

interface APKDownloadRequest {
  appName: string; // e.g., "com.twitter.android"
  source?: 'apkmirror' | 'apkpure'; // Default: apkmirror
  version?: string; // Optional specific version
  outputDir?: string; // Default: ./output/apks
}

interface APKDownloadResult {
  status: 'success' | 'error';
  appName: string;
  version?: string;
  filePath?: string;
  fileSize?: number;
  sha256?: string;
  downloadUrl?: string;
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

const DEFAULT_OUTPUT_DIR = join(process.cwd(), 'output', 'apks');
const CACHE_FILE = join(process.cwd(), '.cache', 'apk-downloads.json');
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
 * Download APK from APKMirror
 *
 * APKMirror requires navigation through multiple pages:
 * 1. Search for app
 * 2. Select version
 * 3. Click download button
 * 4. Navigate to actual download link
 */
async function downloadFromAPKMirror(
  browser: Browser,
  request: APKDownloadRequest
): Promise<APKDownloadResult> {
  const page = await browser.newPage();

  try {
    // Navigate to APKMirror
    console.log(`  🔍 Searching APKMirror for ${request.appName}...`);
    await page.goto(`https://www.apkmirror.com/?s=${encodeURIComponent(request.appName)}`);

    // Wait for search results
    await page.waitForSelector('.appRow', { timeout: 10000 });

    // Click first result
    const firstResult = await page.$('.appRow .appRowTitle a');
    if (!firstResult) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'No search results found on APKMirror'
      };
    }

    await firstResult.click();
    await page.waitForLoadState('networkidle');

    // Find latest version or specific version
    console.log(`  📦 Finding version...`);
    const versionLinks = await page.$$('.appRowTitle a');

    if (versionLinks.length === 0) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'No versions found'
      };
    }

    // Click first version (latest)
    await versionLinks[0].click();
    await page.waitForLoadState('networkidle');

    // Click download button
    console.log(`  ⬇️ Initiating download...`);
    const downloadButton = await page.$('.downloadButton');
    if (!downloadButton) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Download button not found'
      };
    }

    await downloadButton.click();
    await page.waitForLoadState('networkidle');

    // Get actual download link
    const downloadLink = await page.$('a.accent_bg');
    if (!downloadLink) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Download link not found'
      };
    }

    const downloadUrl = await downloadLink.getAttribute('href');
    if (!downloadUrl) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Could not extract download URL'
      };
    }

    // Start download
    const startTime = Date.now();
    const download = await page.waitForEvent('download');
    const outputDir = request.outputDir || DEFAULT_OUTPUT_DIR;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${request.appName}.apk`;
    const filePath = join(outputDir, fileName);

    await download.saveAs(filePath);
    const downloadTime_ms = Date.now() - startTime;

    // Calculate SHA256
    const sha256 = calculateSHA256(filePath);

    // Get file size
    const stats = await Bun.file(filePath).size;

    return {
      status: 'success',
      appName: request.appName,
      filePath,
      fileSize: stats,
      sha256,
      downloadUrl: `https://www.apkmirror.com${downloadUrl}`,
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
 * Download APK from APKPure
 *
 * APKPure has a simpler download flow than APKMirror
 */
async function downloadFromAPKPure(
  browser: Browser,
  request: APKDownloadRequest
): Promise<APKDownloadResult> {
  const page = await browser.newPage();

  try {
    // Navigate to APKPure
    console.log(`  🔍 Searching APKPure for ${request.appName}...`);
    await page.goto(`https://apkpure.com/search?q=${encodeURIComponent(request.appName)}`);

    // Wait for search results
    await page.waitForSelector('.first', { timeout: 10000 });

    // Click first result
    const firstResult = await page.$('.first a');
    if (!firstResult) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'No search results found on APKPure'
      };
    }

    await firstResult.click();
    await page.waitForLoadState('networkidle');

    // Click download button
    console.log(`  ⬇️ Initiating download...`);
    const downloadButton = await page.$('.download_apk_news a');
    if (!downloadButton) {
      return {
        status: 'error',
        appName: request.appName,
        error: 'Download button not found'
      };
    }

    const downloadUrl = await downloadButton.getAttribute('href');
    await downloadButton.click();
    await page.waitForLoadState('networkidle');

    // Start download
    const startTime = Date.now();
    const download = await page.waitForEvent('download', { timeout: 30000 });
    const outputDir = request.outputDir || DEFAULT_OUTPUT_DIR;

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    const fileName = `${request.appName}.apk`;
    const filePath = join(outputDir, fileName);

    await download.saveAs(filePath);
    const downloadTime_ms = Date.now() - startTime;

    // Calculate SHA256
    const sha256 = calculateSHA256(filePath);

    // Get file size
    const stats = await Bun.file(filePath).size;

    return {
      status: 'success',
      appName: request.appName,
      filePath,
      fileSize: stats,
      sha256,
      downloadUrl: downloadUrl || undefined,
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
 * Download APK with caching
 *
 * @param request - Download request
 * @returns Download result
 */
export async function downloadAPK(
  request: APKDownloadRequest
): Promise<APKDownloadResult> {
  // Check cache first
  const cache = loadCache();
  const cacheKey = `${request.appName}:${request.source || 'apkmirror'}`;

  if (cache[cacheKey] && isCacheValid(cache[cacheKey])) {
    console.log(`✨ Using cached APK for ${request.appName}`);
    return {
      status: 'success',
      appName: request.appName,
      ...cache[cacheKey]
    };
  }

  console.log(`\n📱 Downloading APK: ${request.appName}`);
  console.log(`   Source: ${request.source || 'apkmirror'}`);

  // Launch browser
  const browser = await chromium.launch({
    headless: true
  });

  try {
    let result: APKDownloadResult;

    if (request.source === 'apkpure') {
      result = await downloadFromAPKPure(browser, request);
    } else {
      result = await downloadFromAPKMirror(browser, request);
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

  } finally {
    await browser.close();
  }
}

/**
 * Download multiple APKs in parallel
 *
 * @param requests - Array of download requests
 * @returns Array of download results
 */
export async function downloadAPKsParallel(
  requests: APKDownloadRequest[]
): Promise<APKDownloadResult[]> {
  console.log(`\n🚀 Downloading ${requests.length} APKs in parallel...`);

  const promises = requests.map(request => downloadAPK(request));
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
APK Downloader

⚠️ Legal Warning:
  - Downloading APKs may violate app ToS
  - Use only for apps you have legal rights to analyze
  - For research/security testing purposes only

Usage:
  bun run download-apk.ts <app-name> [source] [output-dir]

Arguments:
  app-name    App package name (e.g., "com.twitter.android")
  source      Optional: "apkmirror" (default) or "apkpure"
  output-dir  Optional: Output directory (default: ./output/apks)

Examples:
  bun run download-apk.ts com.twitter.android
  bun run download-apk.ts com.twitter.android apkpure
  bun run download-apk.ts com.twitter.android apkmirror /tmp/apks
`);
    process.exit(0);
  }

  const request: APKDownloadRequest = {
    appName: args[0],
    source: (args[1] as 'apkmirror' | 'apkpure') || 'apkmirror',
    outputDir: args[2]
  };

  const result = await downloadAPK(request);

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
