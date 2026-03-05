# App Downloader

Playwright-based infrastructure for downloading mobile apps (APK/IPA) for reverse engineering and security research.

**Purpose:** Phase 0 parallel work for future Grok Imagine reverse engineering (potential fallback if API wrapper approach fails).

## Legal Warnings

**⚠️ CRITICAL: Read Before Using**

- **APK Downloads:** May violate app ToS. Use only for apps you have legal rights to analyze.
- **IPA Downloads:** Requires Apple ID credentials. May violate Apple ToS. Use dedicated account only.
- **CFAA Risk:** Unauthorized access to app binaries may violate Computer Fraud and Abuse Act.
- **For Research Only:** This tool is intended for security research and educational purposes only.

**Recommended:** Use only for apps you developed or have explicit permission to analyze.

## Features

### APK Downloader (`download-apk.ts`)

- **Sources:** APKMirror (default), APKPure
- **Caching:** SHA256-based file cache (30-day TTL)
- **Parallel Downloads:** Download multiple APKs concurrently
- **Verification:** Automatic SHA256 hash calculation

### IPA Downloader (`download-ipa.ts`)

- **Methods:**
  - `ipatool` (recommended): Uses official Apple APIs via [ipatool](https://github.com/majd/ipatool)
  - `web` (fallback): Third-party sources (less reliable)
- **Authentication:** Supports Apple ID credentials from `.env`
- **Caching:** Same SHA256-based caching as APK downloader

### VPS Deployment (`deploy.sh`)

- **Target:** OVH VPS (vps-2809d4b8.vps.ovh.us)
- **Benefits:** Isolated environment, avoid IP bans, clean browser fingerprint
- **Automation:** One-command deployment with dependency installation

## Installation

### Local Setup

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash

# Install dependencies
cd tools/app-downloader
bun install playwright

# Install Playwright browsers
bunx playwright install chromium

# For IPA downloads: Install ipatool
brew install ipatool  # macOS only
```

### VPS Setup

```bash
# Deploy to VPS (automatic dependency installation)
./deploy.sh

# SSH to VPS and configure credentials
ssh -i /home/groves/.ssh/gro_256 -p 2222 debian@vps-2809d4b8.vps.ovh.us
cd /home/debian/app-downloader
nano .env  # Add APPLE_ID and APPLE_PASSWORD
```

## Usage

### Download APK

```bash
# Basic usage (APKMirror)
bun run download-apk.ts com.twitter.android

# Use APKPure source
bun run download-apk.ts com.twitter.android apkpure

# Custom output directory
bun run download-apk.ts com.twitter.android apkmirror /tmp/apks
```

### Download IPA

```bash
# Using ipatool (recommended, requires Apple ID)
bun run download-ipa.ts com.twitter.app

# Using web sources (no credentials needed, less reliable)
bun run download-ipa.ts com.twitter.app web

# Custom output directory
bun run download-ipa.ts com.twitter.app ipatool /tmp/ipas
```

### Parallel Downloads

```typescript
import { downloadAPKsParallel } from './download-apk';
import { downloadIPAsParallel } from './download-ipa';

// Download multiple APKs
const apkResults = await downloadAPKsParallel([
  { appName: 'com.twitter.android' },
  { appName: 'com.instagram.android' },
  { appName: 'com.facebook.katana' }
]);

// Download multiple IPAs
const ipaResults = await downloadIPAsParallel([
  { appName: 'com.twitter.app' },
  { appName: 'com.burbn.instagram' }
], 'ipatool');
```

## Environment Variables

Create a `.env` file in the `tools/app-downloader` directory:

```bash
# Apple credentials (for IPA downloads)
# ⚠️ Warning: Use a dedicated Apple ID, not your primary account
APPLE_ID=your_apple_id@example.com
APPLE_PASSWORD=your_app_specific_password

# Optional: Custom output directories
APK_OUTPUT_DIR=/path/to/apks
IPA_OUTPUT_DIR=/path/to/ipas
```

**Security Notes:**

- Never commit `.env` file to git (already in `.gitignore`)
- Use App-Specific Password for Apple ID (Settings > Password & Security > App-Specific Passwords)
- Consider using a dedicated Apple ID for research/testing

## Output Structure

```
output/
├── apks/
│   ├── com.twitter.android.apk
│   └── com.instagram.android.apk
└── ipas/
    ├── com.twitter.app.ipa
    └── com.burbn.instagram.ipa

.cache/
├── apk-downloads.json  # Cache metadata (SHA256, timestamps)
└── ipa-downloads.json
```

## Cache Management

Downloads are cached based on SHA256 hash with 30-day TTL. Cache format:

```json
{
  "com.twitter.android:apkmirror": {
    "filePath": "/path/to/com.twitter.android.apk",
    "version": "latest",
    "sha256": "abc123...",
    "downloadedAt": 1706054400000
  }
}
```

**Cache Benefits:**

- Avoid redundant downloads
- Faster repeated access
- Bandwidth savings
- SHA256 verification

## VPS Deployment Details

**Target VPS Configuration:**

- Host: `vps-2809d4b8.vps.ovh.us`
- User: `debian`
- Port: `2222`
- SSH Key: `/home/groves/.ssh/gro_256`
- Remote Directory: `/home/debian/app-downloader`

**Deployment Process:**

1. Verifies SSH connection
2. Creates remote directory structure
3. Copies TypeScript files
4. Installs Bun runtime
5. Installs Playwright + browsers
6. Creates `.env` template
7. Runs test to verify deployment

**Remote Execution:**

```bash
# SSH to VPS
ssh -i /home/groves/.ssh/gro_256 -p 2222 debian@vps-2809d4b8.vps.ovh.us

# Navigate to directory
cd /home/debian/app-downloader

# Download APK
bun run download-apk.ts com.twitter.android

# Download IPA (after configuring .env)
bun run download-ipa.ts com.twitter.app
```

## Troubleshooting

### APK Downloads Failing

**Issue:** "No search results found on APKMirror"

- **Cause:** App name doesn't match APKMirror's naming
- **Solution:** Try APKPure as alternative source or search manually to find exact name

**Issue:** "Download button not found"

- **Cause:** APKMirror changed their HTML structure
- **Solution:** Update selectors in `download-apk.ts` or use alternative source

### IPA Downloads Failing

**Issue:** "Apple authentication failed"

- **Cause:** Invalid credentials or 2FA blocking
- **Solution:**
  1. Use App-Specific Password (not main password)
  2. Disable 2FA on dedicated Apple ID
  3. Verify credentials in .env

**Issue:** "ipatool command not found"

- **Cause:** ipatool not installed
- **Solution:** `brew install ipatool` (macOS) or compile from source (Linux)

**Issue:** "IPA download failed (check if app exists...)"

- **Cause:** App not available in your region or requires payment
- **Solution:** Use VPN or try web-based method

### Playwright Issues

**Issue:** "Browser not found"

- **Cause:** Playwright browsers not installed
- **Solution:** `bunx playwright install chromium`

**Issue:** "Timeout waiting for selector"

- **Cause:** Website changed structure or slow loading
- **Solution:** Increase timeout or update selectors

## Architecture

### Design Patterns

Both downloaders follow the same pattern established in OpenRouter client implementations:

- **Interface-first design:** Clear TypeScript interfaces for requests/responses
- **Caching layer:** File-based cache with SHA256 verification
- **Parallel execution:** Promise.all for concurrent downloads
- **CLI support:** Standalone execution with `if (import.meta.main)`
- **Error handling:** Comprehensive try/catch with detailed error messages

### Dependencies

- **Bun:** JavaScript runtime (faster than Node.js)
- **Playwright:** Browser automation
- **ipatool:** Official Apple API client for IPA downloads

### Security Considerations

- **Credential isolation:** All secrets in `.env` (never hardcoded)
- **SSRF protection:** No user-controlled URLs passed directly to fetch
- **File validation:** SHA256 verification for downloaded files
- **VPS isolation:** Separate environment for potentially risky operations

## Future Enhancements

**Planned for Grok Imagine reverse engineering:**

1. **APK/IPA decompilation:** Integrate tools like jadx (APK) and class-dump (IPA)
2. **Traffic interception:** mitmproxy integration for API endpoint discovery
3. **Frida hooking:** Runtime API call analysis
4. **Automated reporting:** Generate analysis reports from decompiled code

**Current Status:** Infrastructure ready, waiting for reverse engineering phase.

## Integration with Grok Imagine Project

This tool is **Phase 0** infrastructure for the Grok Imagine API wrapper project:

- **Primary Approach:** Wrap grok2api Python library (currently implementing)
- **Fallback Approach:** If grok2api fails, use this tool to:
  1. Download X (Twitter) mobile app
  2. Reverse engineer API endpoints
  3. Implement custom TypeScript client

**Decision Point:** Only proceed with reverse engineering if grok2api wrapper proves unreliable.

## Related Documentation

- **Grok Imagine Plan:** `docs/grok-imagine-usage.md` (to be created)
- **API Client Patterns:** OpenRouter client implementations in skills/ghost/scripts/openrouter/
- **Framework Standards:** `docs/standards/file-location-standards.md`

## Version History

- **1.0** (2026-01-23): Initial implementation with APK/IPA downloaders and VPS deployment

---

**Remember:** This tool is for **research and educational purposes only**. Always respect app developers' intellectual property and terms of service.
