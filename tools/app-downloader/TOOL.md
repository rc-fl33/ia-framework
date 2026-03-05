---
name: app-downloader
type: utility
classification: public
description: Mobile app downloader (APK/IPA) via Playwright - APKMirror/APKPure sources, ipatool integration, SHA256 caching, VPS deployment
version: 1.0.0
last_updated: 2026-02-14
env_required: true
env_keys:
  - APPLE_ID
  - APPLE_PASSWORD
commands:
  - bun tools/app-downloader/download-apk.ts <app-name> [source] [output-dir]
  - bun tools/app-downloader/download-ipa.ts <bundle-id> [method] [output-dir]
  - ./tools/app-downloader/deploy.sh
related_tools:
  - playwright
  - ipatool
  - tools/api/grok
---

# App Downloader

**Type:** Utility
**Classification:** 🌍 PUBLIC
**Status:** ✅ Production Ready

**⚠️ LEGAL WARNING:**
- Downloading APKs/IPAs may violate app Terms of Service
- Use only for apps you have legal rights to analyze
- May violate Computer Fraud and Abuse Act (CFAA) if unauthorized
- **For research and educational purposes only**
- **Recommended:** Use only for apps you developed or have explicit permission to analyze

---

## Classification

**PUBLIC** - Mobile app download infrastructure for security research.

**Why Public:**
- Standard web scraping patterns (Playwright automation)
- Educational tool for security researchers
- Well-documented legal warnings and best practices
- Useful for mobile app security testing workflows

---

## Purpose

Playwright-based infrastructure for downloading mobile apps (APK/IPA) for reverse engineering and security research. Supports multiple sources (APKMirror, APKPure, ipatool), SHA256-based caching, parallel downloads, and VPS deployment for isolated environments.

**Core Capabilities:**
- **APK downloads**: APKMirror (default), APKPure sources
- **IPA downloads**: ipatool (recommended), web-based fallback
- **SHA256 caching**: 30-day TTL, avoid redundant downloads
- **Parallel downloads**: Download multiple apps concurrently
- **VPS deployment**: One-command deployment to OVH VPS
- **Verification**: Automatic SHA256 hash calculation

**Use Cases:**
- **Security research**: Reverse engineering for vulnerability analysis
- **App testing**: Download production builds for testing
- **Comparative analysis**: Download multiple versions of same app
- **Mobile pentesting**: Obtain APKs/IPAs for thick-client security testing

**⚠️ Important:** This is Phase 0 infrastructure for potential Grok Imagine reverse engineering (fallback if API wrapper approach fails).

---

## Usage

### Download APK (Android)

**Basic usage (APKMirror):**
```bash
bun run tools/app-downloader/download-apk.ts com.twitter.android

# Output:
# 📱 Downloading APK: com.twitter.android
#    Source: apkmirror
#   🔍 Searching APKMirror for com.twitter.android...
#   📦 Finding version...
#   ⬇️ Initiating download...
#
# ✅ Download successful!
#
# App:       com.twitter.android
# File:      /path/to/output/apks/com.twitter.android.apk
# Size:      45.32 MB
# SHA256:    abc123...def456
# Time:      12345ms
```

**Use APKPure source:**
```bash
bun run tools/app-downloader/download-apk.ts com.twitter.android apkpure
```

**Custom output directory:**
```bash
bun run tools/app-downloader/download-apk.ts com.twitter.android apkmirror /tmp/apks
```

---

### Download IPA (iOS)

**Using ipatool (recommended, requires Apple ID):**
```bash
bun run tools/app-downloader/download-ipa.ts com.twitter.app

# Prerequisites:
# 1. Install ipatool: brew install ipatool
# 2. Set credentials in .env:
#    APPLE_ID=your_apple_id@example.com
#    APPLE_PASSWORD=your_app_specific_password

# Output:
# 📱 Downloading IPA: com.twitter.app
#    Method: ipatool
#   🔍 Searching App Store for com.twitter.app...
#   🔐 Authenticating with App Store...
#   ⬇️ Downloading IPA...
#
# ✅ Download successful!
#
# App:       com.twitter.app
# File:      /path/to/output/ipas/com.twitter.app.ipa
# Size:      62.18 MB
# SHA256:    xyz789...abc123
# Time:      18432ms
```

**Using web sources (no credentials needed, less reliable):**
```bash
bun run tools/app-downloader/download-ipa.ts com.twitter.app web
```

**Custom output directory:**
```bash
bun run tools/app-downloader/download-ipa.ts com.twitter.app ipatool /tmp/ipas
```

---

### Programmatic Usage

**Parallel APK downloads:**
```typescript
import { downloadAPKsParallel } from '@/tools/app-downloader/download-apk';

const results = await downloadAPKsParallel([
  { appName: 'com.twitter.android' },
  { appName: 'com.instagram.android' },
  { appName: 'com.facebook.katana' }
]);

results.forEach(result => {
  if (result.status === 'success') {
    console.log(`✓ ${result.appName}: ${result.filePath}`);
  } else {
    console.log(`✗ ${result.appName}: ${result.error}`);
  }
});
```

**Parallel IPA downloads:**
```typescript
import { downloadIPAsParallel } from '@/tools/app-downloader/download-ipa';

const results = await downloadIPAsParallel([
  { appName: 'com.twitter.app' },
  { appName: 'com.burbn.instagram' }
], 'ipatool');
```

**Single APK with caching:**
```typescript
import { downloadAPK } from '@/tools/app-downloader/download-apk';

const result = await downloadAPK({
  appName: 'com.twitter.android',
  source: 'apkmirror',
  outputDir: '/custom/path/apks'
});

if (result.status === 'success') {
  console.log(`Downloaded to: ${result.filePath}`);
  console.log(`SHA256: ${result.sha256}`);
}
```

---

### VPS Deployment

**Deploy to OVH VPS (one command):**
```bash
./tools/app-downloader/deploy.sh

# Deployment process:
# 1. Verifies SSH connection (vps-2809d4b8.vps.ovh.us)
# 2. Creates remote directory structure (/home/debian/app-downloader)
# 3. Copies TypeScript files (download-apk.ts, download-ipa.ts)
# 4. Installs Bun runtime
# 5. Installs Playwright + browsers
# 6. Creates .env template
# 7. Runs test to verify deployment

# Output:
# 🚀 Deploying app-downloader to VPS...
# ✓ SSH connection verified
# ✓ Remote directory created
# ✓ Files copied
# ✓ Bun installed
# ✓ Playwright installed
# ✓ Test successful
# ✅ Deployment complete!
```

**Configure credentials on VPS:**
```bash
# SSH to VPS
ssh -i /home/groves/.ssh/gro_256 -p 2222 debian@vps-2809d4b8.vps.ovh.us

# Navigate to directory
cd /home/debian/app-downloader

# Configure Apple ID (for IPA downloads)
nano .env
# Add:
# APPLE_ID=your_apple_id@example.com
# APPLE_PASSWORD=your_app_specific_password
```

**Remote execution:**
```bash
# On VPS
cd /home/debian/app-downloader

# Download APK
bun run download-apk.ts com.twitter.android

# Download IPA (after configuring .env)
bun run download-ipa.ts com.twitter.app
```

**VPS benefits:**
- Isolated environment
- Avoid IP bans
- Clean browser fingerprint
- Dedicated resources
- No local Playwright dependencies

---

## Configuration

### Environment Variables

**Create .env file:**
```bash
# tools/app-downloader/.env

# Apple credentials (for IPA downloads)
# ⚠️ Warning: Use a dedicated Apple ID, not your primary account
# Use App-Specific Password (Settings > Password & Security)
APPLE_ID=your_apple_id@example.com
APPLE_PASSWORD=your_app_specific_password

# Optional: Custom output directories
APK_OUTPUT_DIR=/path/to/apks
IPA_OUTPUT_DIR=/path/to/ipas
```

**Security notes:**
- Never commit .env file to git (already in .gitignore)
- Use App-Specific Password for Apple ID (not main password)
- Consider using dedicated Apple ID for research/testing
- Disable 2FA on dedicated account if possible

---

### Cache Configuration

**Cache structure:**
```
.cache/
├── apk-downloads.json  # APK cache metadata
└── ipa-downloads.json  # IPA cache metadata
```

**Cache format:**
```json
{
  "com.twitter.android:apkmirror": {
    "filePath": "/path/to/com.twitter.android.apk",
    "version": "latest",
    "sha256": "abc123...def456",
    "downloadedAt": 1706054400000
  }
}
```

**Cache benefits:**
- Avoid redundant downloads (30-day TTL)
- Faster repeated access
- Bandwidth savings
- SHA256 verification (integrity check)

---

### VPS Configuration

**Target VPS:**
- **Host:** vps-2809d4b8.vps.ovh.us
- **User:** debian
- **Port:** 2222
- **SSH Key:** /home/groves/.ssh/gro_256
- **Remote Directory:** /home/debian/app-downloader

**SSH connection:**
```bash
ssh -i /home/groves/.ssh/gro_256 -p 2222 debian@vps-2809d4b8.vps.ovh.us
```

---

## API Reference

### downloadAPK()

#### `async downloadAPK(request: APKDownloadRequest): Promise<APKDownloadResult>`

Download single APK with caching.

**Parameters:**
```typescript
interface APKDownloadRequest {
  appName: string;                        // Package name (e.g., "com.twitter.android")
  source?: 'apkmirror' | 'apkpure';       // Default: 'apkmirror'
  version?: string;                       // Optional specific version
  outputDir?: string;                     // Default: ./output/apks
}
```

**Returns:**
```typescript
interface APKDownloadResult {
  status: 'success' | 'error';
  appName: string;
  version?: string;
  filePath?: string;
  fileSize?: number;                      // Bytes
  sha256?: string;
  downloadUrl?: string;
  error?: string;
  downloadTime_ms?: number;
}
```

---

### downloadAPKsParallel()

#### `async downloadAPKsParallel(requests: APKDownloadRequest[]): Promise<APKDownloadResult[]>`

Download multiple APKs concurrently.

**Parameters:**
- `requests` - Array of APKDownloadRequest objects

**Returns:** Array of APKDownloadResult objects

**Performance:** Uses Promise.all for parallel execution

---

### downloadIPA()

#### `async downloadIPA(request: IPADownloadRequest, method: 'ipatool' | 'web' = 'ipatool'): Promise<IPADownloadResult>`

Download single IPA with caching.

**Parameters:**
```typescript
interface IPADownloadRequest {
  appName: string;                        // Bundle ID (e.g., "com.twitter.app")
  appleId?: string;                       // Apple ID (loaded from env if not provided)
  applePassword?: string;                 // Password (loaded from env if not provided)
  outputDir?: string;                     // Default: ./output/ipas
}
```

**Returns:**
```typescript
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
```

---

### downloadIPAsParallel()

#### `async downloadIPAsParallel(requests: IPADownloadRequest[], method: 'ipatool' | 'web' = 'ipatool'): Promise<IPADownloadResult[]>`

Download multiple IPAs concurrently.

**Parameters:**
- `requests` - Array of IPADownloadRequest objects
- `method` - Download method ('ipatool' recommended)

**Returns:** Array of IPADownloadResult objects

---

## Architecture

### APK Download Flow (APKMirror)

```
User runs: bun run download-apk.ts com.twitter.android
   ↓
1. Check cache
   Cache key: "com.twitter.android:apkmirror"
   Cache valid? (< 30 days old)
     YES → Return cached result
     NO → Continue
   ↓
2. Launch Playwright browser (headless Chrome)
   ↓
3. Search APKMirror
   Navigate: https://www.apkmirror.com/?s=com.twitter.android
   Wait for: .appRow selector
   ↓
4. Click first result
   Find: .appRow .appRowTitle a
   Click → Navigate to app page
   ↓
5. Select latest version
   Find: .appRowTitle a elements
   Click first (latest version)
   ↓
6. Click download button
   Find: .downloadButton
   Click → Navigate to download page
   ↓
7. Get actual download link
   Find: a.accent_bg
   Extract href attribute
   ↓
8. Download APK
   Wait for download event
   Save to: {outputDir}/{appName}.apk
   ↓
9. Verify download
   Calculate SHA256 hash
   Get file size
   ↓
10. Update cache
    Save: {filePath, version, sha256, downloadedAt}
    ↓
11. Return result
    {status: 'success', appName, filePath, sha256, ...}
```

---

### IPA Download Flow (ipatool)

```
User runs: bun run download-ipa.ts com.twitter.app
   ↓
1. Check cache
   Cache key: "com.twitter.app:ipatool"
   Cache valid? → Return if yes
   ↓
2. Load Apple credentials
   APPLE_ID from .env
   APPLE_PASSWORD from .env
   ↓
3. Authenticate with App Store
   Run: ipatool auth login --email <id> --password <password>
   Check exit code (0 = success)
   ↓
4. Download IPA
   Run: ipatool download --bundle-identifier com.twitter.app --output ./output/ipas
   Check exit code
   ↓
5. Find downloaded file
   Scan outputDir for: com.twitter.app*.ipa
   ↓
6. Verify download
   Calculate SHA256 hash
   Get file size
   ↓
7. Update cache
   Save metadata
   ↓
8. Return result
   {status: 'success', appName, filePath, sha256, ...}
```

---

### Design Patterns

**Follows same patterns as openrouter-client.ts:**
- Interface-first design (clear TypeScript interfaces)
- Caching layer (file-based cache with SHA256)
- Parallel execution (Promise.all for concurrent downloads)
- CLI support (standalone execution with `if (import.meta.main)`)
- Comprehensive error handling (try/catch with detailed messages)

---

## Scripts

### Batch APK Downloads

```bash
#!/bin/bash
# Download multiple APKs for comparison

APPS=(
  "com.twitter.android"
  "com.instagram.android"
  "com.facebook.katana"
  "com.whatsapp"
)

for app in "${APPS[@]}"; do
  echo "Downloading $app..."
  bun run tools/app-downloader/download-apk.ts "$app"
done
```

---

### Security Research Workflow

```bash
#!/bin/bash
# Download app for reverse engineering

APP="com.example.app"
OUTPUT_DIR="/research/apps"

# Step 1: Download APK
bun run tools/app-downloader/download-apk.ts "$APP" apkmirror "$OUTPUT_DIR"

# Step 2: Verify SHA256
cd "$OUTPUT_DIR"
sha256sum "${APP}.apk"

# Step 3: Decompile with jadx
jadx -d "${APP}-decompiled" "${APP}.apk"

# Step 4: Analyze with MobSF
# (Manual: Upload to MobSF instance)
```

---

## Dependencies

### Runtime

**External:**
- **Bun**: JavaScript runtime (faster than Node.js)
- **Playwright**: Browser automation (chromium)
- **ipatool**: Official Apple API client for IPA downloads (macOS: `brew install ipatool`)

**Internal:**
- Node.js `crypto`, `fs`, `path` modules
- Bun built-ins

### Installation

**Local setup:**
```bash
# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install dependencies
cd tools/app-downloader
bun install playwright

# Install Playwright browsers
bunx playwright install chromium

# For IPA downloads: Install ipatool
brew install ipatool  # macOS only
```

**VPS setup:**
```bash
# One-command deployment
./tools/app-downloader/deploy.sh
```

---

## Troubleshooting

### "No search results found on APKMirror"

**Cause:** App name doesn't match APKMirror's naming

**Fix:**
```bash
# Try APKPure as alternative
bun run tools/app-downloader/download-apk.ts com.twitter.android apkpure

# Or search manually to find exact name:
# 1. Visit apkmirror.com
# 2. Search for app
# 3. Copy exact package name from URL
```

---

### "Download button not found"

**Cause:** APKMirror changed their HTML structure

**Fix:**
```bash
# Update selectors in download-apk.ts
# Check current HTML structure:
# 1. Visit APKMirror in browser
# 2. Inspect download button
# 3. Update selector in code (line 156):
#    const downloadButton = await page.$('.new-selector');
```

---

### "Apple authentication failed"

**Cause:** Invalid credentials or 2FA blocking

**Fix:**
```bash
# 1. Use App-Specific Password (not main password)
# Settings > Password & Security > App-Specific Passwords

# 2. Verify credentials in .env
cat tools/app-downloader/.env

# 3. Disable 2FA on dedicated Apple ID (if research account)

# 4. Test authentication manually
ipatool auth login --email your@email.com --password yourpassword
```

---

### "ipatool command not found"

**Cause:** ipatool not installed

**Fix:**
```bash
# macOS
brew install ipatool

# Linux (compile from source)
git clone https://github.com/majd/ipatool.git
cd ipatool
make install
```

---

### "Browser not found"

**Cause:** Playwright browsers not installed

**Fix:**
```bash
# Install Chromium browser
bunx playwright install chromium

# Or all browsers
bunx playwright install
```

---

### "Timeout waiting for selector"

**Cause:** Website changed structure or slow loading

**Fix:**
```bash
# Increase timeout in code
# download-apk.ts line 123:
await page.waitForSelector('.appRow', { timeout: 30000 }); # 30s instead of 10s

# Or update selector to match new HTML structure
```

---

### "IPA download failed (check if app exists...)"

**Cause:** App not available in your region or requires payment

**Fix:**
```bash
# 1. Use VPN to change region
# 2. Try web-based method (less reliable)
bun run tools/app-downloader/download-ipa.ts com.twitter.app web

# 3. Check if app is free (ipatool only works with free apps)
```

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers — invoked via CLI as part of mobile security research workflows. Used as Phase 0 infrastructure for mobile penetration testing.

**Skills:**
- `skills/pentest/` — mobile pentesting workflows use this tool to obtain APK/IPA binaries

---

## Related Tools

- **Playwright**: https://playwright.dev/
- **ipatool**: https://github.com/majd/ipatool
- **APKMirror**: https://www.apkmirror.com/
- **APKPure**: https://apkpure.com/
- **tools/api/grok** - Grok Imagine API wrapper (reverse engineering fallback)

---

## Version History

### 1.0.0 (2026-01-23)
- ✅ APK downloader (APKMirror, APKPure sources)
- ✅ IPA downloader (ipatool, web-based fallback)
- ✅ SHA256-based caching (30-day TTL)
- ✅ Parallel downloads (Promise.all)
- ✅ VPS deployment script (OVH VPS)
- ✅ Comprehensive error handling
- ✅ CLI support with standalone execution
- ✅ Legal warnings and security notes

---

## References

- **Grok Imagine Plan**: `docs/grok-imagine-usage.md` (to be created)
- **API Client Patterns**: `tools/api/openrouter/client.ts`
- **Framework Standards**: `docs/standards/file-location-standards.md`
- **Playwright Documentation**: https://playwright.dev/docs/intro
- **ipatool Documentation**: https://github.com/majd/ipatool/blob/main/README.md
- **Computer Fraud and Abuse Act**: https://www.law.cornell.edu/uscode/text/18/1030

---

**⚠️ Final Reminder:** This tool is for **research and educational purposes only**. Always respect app developers' intellectual property and terms of service. Use only for apps you have legal rights to analyze.
