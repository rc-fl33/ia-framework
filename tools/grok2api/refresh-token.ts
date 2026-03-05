#!/usr/bin/env bun
/**
 * Grok SSO Token Refresh Script
 *
 * Uses Puppeteer to automate SSO token extraction from grok.com
 * Updates ~/grok2api/data/token.json and restarts Docker container
 *
 * Usage:
 *   bun tools/api/grok/refresh-token.ts
 */

import puppeteer from 'puppeteer';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TOKEN_FILE = join(homedir(), 'grok2api-data/token.json');
const GROK_URL = 'https://grok.com';

async function extractSSOToken(): Promise<string | null> {
  console.log('🌐 Launching browser...');

  const browser = await puppeteer.launch({
    headless: false, // Show browser so user can log in
    defaultViewport: { width: 1280, height: 800 }
  });

  const page = await browser.newPage();

  console.log(`📍 Navigating to ${GROK_URL}...`);
  await page.goto(GROK_URL, { waitUntil: 'networkidle2' });

  console.log('');
  console.log('⏳ Waiting for you to log in...');
  console.log('   Please complete login in the browser window.');
  console.log('   The script will automatically continue once logged in.');
  console.log('');

  // Wait for login to complete (check for presence of grok UI elements)
  await page.waitForSelector('[data-testid="grok-input"], .grok-chat, #root', {
    timeout: 120000 // 2 minutes
  });

  console.log('✓ Login detected!');
  console.log('');
  console.log('🔑 Extracting cookies...');

  // Get all cookies
  const cookies = await page.cookies();

  // Find SSO cookie
  const ssoCookie = cookies.find(c => c.name === 'sso' && c.domain.includes('grok.com'));

  if (!ssoCookie) {
    console.error('❌ Error: SSO cookie not found!');
    console.error('   Make sure you are fully logged in to grok.com');
    await browser.close();
    return null;
  }

  console.log('✓ SSO token extracted');
  console.log(`   Domain: ${ssoCookie.domain}`);
  console.log(`   Expires: ${new Date(ssoCookie.expires * 1000).toISOString()}`);

  await browser.close();

  return ssoCookie.value;
}

async function updateTokenFile(ssoToken: string): Promise<void> {
  console.log('');
  console.log('📝 Updating token.json...');

  if (!existsSync(TOKEN_FILE)) {
    console.error(`❌ Error: Token file not found at ${TOKEN_FILE}`);
    process.exit(1);
  }

  // Read existing token file
  const tokenData = JSON.parse(readFileSync(TOKEN_FILE, 'utf-8'));

  // Update SSO token in v2 format
  tokenData.ssoBasic = tokenData.ssoBasic || [];
  tokenData.ssoBasic[0] = { token: ssoToken, status: 'active', quota: 80 };

  // Write back
  writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2), 'utf-8');

  console.log(`✓ Updated: ${TOKEN_FILE}`);
}

async function restartDockerContainer(): Promise<void> {
  console.log('');
  console.log('🐳 Restarting Docker container...');

  try {
    const { stdout } = await execAsync('docker restart grok2api');
    console.log('✓ Docker container restarted');
  } catch (error) {
    console.error('❌ Error restarting Docker container:');
    console.error('   Run manually: docker restart grok2api');
  }
}

async function verifyToken(): Promise<void> {
  console.log('');
  console.log('🔍 Verifying token...');
  console.log('   Waiting 5 seconds for Docker to start...');

  await new Promise(resolve => setTimeout(resolve, 5000));

  try {
    const response = await fetch('http://localhost:8000/v1/models');
    const data = await response.json();

    if (data.object === 'list') {
      console.log('✓ Service is healthy');
      console.log('');
      console.log('🎉 Token refresh complete!');
      console.log('');
      console.log('Next steps:');
      console.log('  - Check admin dashboard: http://localhost:8000/manage');
      console.log('  - Test image generation: bash tools/grok2api/image-cli.sh "test"');
    } else {
      console.log('⚠️  Service returned unexpected status:', data);
    }
  } catch (error) {
    console.error('❌ Error verifying service health');
    console.error('   Check logs: docker logs grok2api');
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Grok SSO Token Refresh                                ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('');

  const ssoToken = await extractSSOToken();

  if (!ssoToken) {
    process.exit(1);
  }

  await updateTokenFile(ssoToken);
  await restartDockerContainer();
  await verifyToken();
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
