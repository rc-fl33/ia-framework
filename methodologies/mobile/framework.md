# Mobile Application Security Testing Methodology

**Platform Router:** iOS | Android | Cross-Platform
**Updated:** 2026-02-01 | **Framework Version:** 2.0

---

## Overview

Mobile application security testing identifies vulnerabilities in iOS and Android applications through static analysis, dynamic analysis, and runtime manipulation using the OWASP Mobile Application Security Testing Guide (MASTG).

This framework covers:
- **iOS Testing** - Non-jailbroken first approach (modern methodology)
- **Android Testing** - Rooted and non-rooted techniques
- **Cross-Platform** - React Native, Flutter, Xamarin

---

## Platform Detection & Routing

```
┌─────────────────────────────────────────────────────┐
│          MOBILE TESTING PLATFORM DETECTION          │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
          What type of mobile app?
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
  ┌─────┐          ┌─────┐          ┌─────┐
  │ iOS │          │ APK │          │BOTH │
  └──┬──┘          └──┬──┘          └──┬──┘
     │                │                 │
     ▼                ▼                 ▼
   iOS              Android        Multi-Platform
 Framework          Framework        (Test both)
     │                │                 │
     ▼                ▼                 ▼
methodologies/     methodologies/    Test iOS first,
mobile/            mobile/           then Android


KEYWORDS DETECTION:
─────────────────────────────────────────────────────
iOS Keywords:
  • "iOS", "iPhone", "iPad", "IPA"
  • "Swift", "Objective-C"
  • "App Store", "TestFlight"
  • ".ipa file", "Xcode"


Android Keywords:
  • "Android", "APK"
  • "Java", "Kotlin"
  • "Play Store", "Google Play"
  • ".apk file", "Android Studio"


Cross-Platform Keywords:
  • "React Native", "Flutter", "Xamarin"
  • "Cordova", "Ionic", "Capacitor"

```

---

## iOS Testing Decision Tree


**Quick Routing:**

```
iOS App Testing Request
         │
         ▼
   Have IPA file?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
Can       App Store
jailbreak?  only?
    │         │
    ▼         ▼
  See:      LIMITED
Section:
"Testing Environment
Decision Tree"
```

**iOS Testing Paths:**
1. **Non-Jailbroken Physical Device** (PRIMARY) - 85-90% coverage
2. **Corellium Virtual Device** (Professional) - 100% coverage, $99-299/month
3. **Apple Silicon Mac** (Optional) - Initial analysis, automation
4. **Jailbroken Device** (Legacy) - Apps won't run (deprecated)


---

## Android Testing Decision Tree


**Quick Routing:**

```
Android App Testing Request
         │
         ▼
   Have APK file?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
Physical    Download
Device?     from Play
    │         │
    ▼         ▼
Can root?   Extract
    │       with
┌───┴───┐   tools
│       │      │
YES    NO      ▼
│       │    See:
ROOTED  NON-ROOTED  Section:
TESTING TESTING     "APK Extraction"
   │       │
   └───┬───┘
       ▼
```

**Android Testing Paths:**
1. **Rooted Physical Device** (OPTIMAL) - 100% coverage
2. **Non-Rooted Physical Device** (COMMON) - 80-85% coverage
3. **Emulator (Android Studio)** (ACCEPTABLE) - Good for static analysis


---

## OWASP MASTG Integration

**Reference:** https://mas.owasp.org/MASTG/ (use WebFetch if needed)
**Size:** 1,168 files, 8.2 MB, 951k tokens
**Coverage:** Comprehensive mobile security testing for Android and iOS

### OWASP Mobile Application Security Verification Standard (MASVS)

**Security Categories (8 domains):**

1. **MASVS-STORAGE** - Secure Data Storage
   - Sensitive data in local storage
   - Logs containing sensitive information
   - Shared storage vulnerabilities
   - Keyboard cache leakage

2. **MASVS-CRYPTO** - Cryptography
   - Weak cryptographic algorithms
   - Insecure key storage
   - Hardcoded encryption keys
   - Inadequate random number generation

3. **MASVS-AUTH** - Authentication and Session Management
   - Insecure authentication mechanisms
   - Weak session management
   - Biometric bypass
   - OAuth/SSO issues

4. **MASVS-NETWORK** - Network Communication
   - Unencrypted data transmission
   - Certificate validation bypass
   - Certificate pinning issues
   - Cleartext traffic

5. **MASVS-PLATFORM** - Platform Interaction
   - Insecure IPC (Inter-Process Communication)
   - WebView vulnerabilities
   - Custom URL scheme abuse
   - Exported components (Android)

6. **MASVS-CODE** - Code Quality
   - Reverse engineering protections
   - Debugging enabled in production
   - Memory corruption vulnerabilities
   - Injection vulnerabilities

7. **MASVS-RESILIENCE** - Anti-Tampering and Anti-Reversing
   - Root/jailbreak detection
   - Debugger detection
   - Emulator detection
   - Code obfuscation
   - Anti-hooking mechanisms

8. **MASVS-PRIVACY** - Privacy Controls
   - Unnecessary permissions
   - Privacy policy compliance
   - Data minimization
   - User consent mechanisms

---

## Mobile Testing Workflow Decision Tree

This decision tree routes the entire mobile testing workflow based on engagement type, constraints, and available resources.

```
┌─────────────────────────────────────────────────────────────────┐
│              MOBILE PENTEST WORKFLOW ROUTING                    │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
         ┌───────────────────────────────┐
         │  STEP 1: ENGAGEMENT TYPE      │
         └───────────┬───────────────────┘
                     │
     ┌───────────────┼───────────────┐
     │               │               │
     ▼               ▼               ▼
┌─────────┐    ┌──────────┐    ┌──────────┐
│Bug Bounty│   │ Internal │    │Consulting│
└────┬────┘    └────┬─────┘    └────┬─────┘
     │              │               │
     │              │               │
     ▼              ▼               ▼
┌─────────────────────────────────────────┐
│  STEP 2: PLATFORM DETECTION             │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
  iOS    Android   Both
    │        │        │
    └────────┼────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  STEP 3: BINARY AVAILABILITY CHECK      │
└────────────┬────────────────────────────┘
             │
        ┌────┴────┐
        │         │
       YES       NO
        │         │
        ▼         ▼
    Have     App Store
   IPA/APK    only?
        │         │
        │         └──→ LIMITED TESTING
        │              • Network analysis
        │              • UI/auth testing
        │              • Public API testing
        │              → Go to STEP 5
        │
        ▼
┌─────────────────────────────────────────┐
│  STEP 4: DEVICE ACCESS & CONSTRAINTS    │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
Physical  Virtual  Emulator
Device    (Cloud)   Only
    │        │        │
    │        │        │
    ▼        ▼        ▼
┌──────┐ ┌──────┐ ┌──────┐
│ 4A   │ │ 4B   │ │ 4C   │
└──────┘ └──────┘ └──────┘


STEP 4 PATHS:
─────────────────────────────────────────────────────
4A: Physical Device Path
    │
    ├─ iOS: Can jailbreak? ┌─YES→ Deprecated (apps won't run)
    │                      └─NO → Non-jailbroken workflow
    │                            (85-90% coverage)
    │
    └─ Android: Can root? ┌─YES→ Rooted workflow (100% coverage)
                          └─NO → Non-rooted workflow (80-85%)

4B: Virtual Device Path (Professional)
    │
    ├─ iOS: Corellium ($99-299/mo)
    │       • Jailbreak-level access without actual jailbreak
    │       • 100% coverage
    │       • Best for: Professional engagements, budget available
    │
    └─ Android: Genymotion/AWS Device Farm
           • Root access available
           • Good for: Automation, CI/CD

4C: Emulator Path (Budget/Development)
    │
    ├─ iOS: Apple Silicon Mac
    │       • Native ARM execution
    │       • Good for: Initial analysis, automation
    │       • Limitations: Missing hardware features
    │
    └─ Android: Android Studio Emulator
           • Root access available
           • Good for: Static analysis, basic testing
           • Limitations: Not production-realistic

─────────────────────────────────────────────────────

             ▼
┌─────────────────────────────────────────┐
│  STEP 5: TESTING MODE SELECTION         │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼
┌────────┐ ┌──────┐ ┌──────┐
│Director│ │Mentor│ │ Demo │
└───┬────┘ └───┬──┘ └───┬──┘
    │          │        │
    ▼          ▼        ▼

DIRECTOR MODE (Production Testing)
• Full 5-phase workflow (EXPLORE → PLAN → CODE → QA → COMMIT)
• Comprehensive test plan with approval gate
• Complete documentation and evidence collection
• Audit logging enabled
• Professional deliverables

Use when:
✓ Real engagement (bug bounty, internal, consulting)
✓ Need complete coverage
✓ Formal reporting required
✓ Quality/compliance matters

MENTOR MODE (Learning/Training)
• Same 5 phases + teaching checkpoints
• "I'm stuck" help patterns
• Progression tracking
• Checkpoint frequency adapts to skill level

Use when:
✓ Learning mobile pentesting
✓ Junior team member training
✓ Want to understand methodology
✓ Not time-critical

DEMO MODE (Tool Validation)
• Minimal ceremony workflow
• Safe targets only (DVWA, DIVA, etc.)
• No audit logging (avoids pollution)
• Quick validation (< 1 hour)

Use when:
✓ Testing new tool installation
✓ Validating VPS connectivity
✓ Checking container availability
✓ Proof-of-concept before engagement

─────────────────────────────────────────────────────

             ▼
┌─────────────────────────────────────────┐
│  STEP 6: TOOL & CONTAINER CHECK         │
└────────────┬────────────────────────────┘
             │
             ▼
Check VPS container availability:
• mobile-security (MobSF, Frida, tools)
• reaper (proxy + SQLite)

Missing tools? → Deploy containers first
             │
             ▼
┌─────────────────────────────────────────┐
│  STEP 7: ROUTE TO WORKFLOW              │
└────────────┬────────────────────────────┘
             │
    ┌────────┼────────┐
    │        │        │
    ▼        ▼        ▼

iOS Testing     Android Testing    Both
    │                │              │
    ▼                ▼              ├─→ iOS first
                                    └─→ Then Android

Execute 5-Phase Workflow:
├─ Phase 1: EXPLORE (reconnaissance, scope validation)
├─ Phase 2: PLAN (test plan generation, approval gate)
├─ Phase 3: CODE (execute tests, document findings)
├─ Phase 4: QA (validate findings, verify CVSS)
└─ Phase 5: COMMIT (report OR remediate)


COMMIT PHASE ROUTING:
─────────────────────────────────────────────────────

Engagement Type → Output

Bug Bounty → HackerOne/Bugcrowd Submission
  • Platform-specific submission format
  • Video PoC (screen recording)
  • Non-jailbroken/non-rooted reproduction steps
  • CVSS with mobile-specific factors

Internal → Remediation Handoff + Re-test
  • Findings report to engineering
  • Platform-specific code guidance
  • Verification test cases
  • Re-test via TestFlight/internal distribution

Consulting → Professional Report
  • Executive summary
  • Technical findings (MASVS mapped)
  • Platform-specific remediation roadmap
  • Compliance assessment (if applicable)
```

---

## Workflow Routing Examples

### Example 1: iOS Bug Bounty (No Budget)

```
User Request: "Test iOS banking app on HackerOne"

ROUTING DECISIONS:
├─ Step 1: Bug Bounty engagement
├─ Step 2: iOS platform
├─ Step 3: Download IPA from HackerOne program
├─ Step 4: Physical iPhone 15 Pro, non-jailbroken
│          (Jailbreak not available for iOS 17.4)
├─ Step 5: Director mode (production engagement)
├─ Step 6: Deploy mobile-security + reaper containers

WORKFLOW PATH:
  • Frida gadget injection for dynamic analysis
  • MobSF for static analysis
  • Reaper proxy for network traffic
  • 85-90% coverage (sufficient for app vulnerabilities)

OUTCOME:
→ HackerOne submission with video PoC
```

### Example 2: Android Internal App (Rooted Device)

```
User Request: "Security test our Android enterprise app"

ROUTING DECISIONS:
├─ Step 1: Internal engagement
├─ Step 2: Android platform
├─ Step 3: APK provided by client
├─ Step 4: Physical Pixel 8, rooted with Magisk
├─ Step 5: Director mode (full assessment)
├─ Step 6: Deploy mobile-security container

WORKFLOW PATH:
  • 100% coverage with root access
  • Frida server on device
  • Full filesystem analysis
  • System-level hooking possible

OUTCOME:
→ Remediation handoff to engineering
→ Re-test after fixes deployed
```

### Example 3: iOS Consulting (Professional Budget)

```
User Request: "Professional pentest for fintech iOS app"

ROUTING DECISIONS:
├─ Step 1: Consulting engagement
├─ Step 2: iOS platform
├─ Step 3: Client provides IPA + TestFlight access
├─ Step 4: Corellium virtual device ($299/mo budget approved)
├─ Step 5: Director mode (comprehensive testing)
├─ Step 6: Deploy mobile-security + reaper

WORKFLOW PATH:
  • Virtual iOS device with jailbreak-level access
  • 100% coverage including system-level tests
  • Snapshot/restore for destructive testing
  • Final validation on physical device

OUTCOME:
→ Professional pentest report (PTES-compliant)
→ Executive summary with risk rating
→ MASVS compliance assessment
```

### Example 4: Cross-Platform React Native (Both iOS + Android)

```
User Request: "Test our React Native app on both platforms"

ROUTING DECISIONS:
├─ Step 1: Internal engagement
├─ Step 2: BOTH platforms (cross-platform framework)
├─ Step 3: Build both IPA and APK from source
├─ Step 4: Physical iPhone + Android device
├─ Step 5: Director mode
├─ Step 6: Deploy mobile-security + reaper
└─ Step 7: Test iOS first, then Android

WORKFLOW PATH:
→ Cross-Platform Analysis:
  • JavaScript bundle inspection (both platforms)
  • React Native bridge vulnerabilities
  • Shared API testing
  • Platform-specific native modules

OUTCOME:
→ Combined report covering both platforms
→ React Native-specific findings
→ Remediation for shared codebase
```

### Example 5: Demo Mode (Tool Validation)

```
User Request: "Verify mobile testing setup before engagement"

ROUTING DECISIONS:
├─ Step 1: Demo mode (not real engagement)
├─ Step 2: iOS (testing setup)
├─ Step 3: Use DVIA app (intentionally vulnerable)
├─ Step 4: iOS Simulator (quick validation)
├─ Step 5: Demo mode (< 1 hour)
├─ Step 6: Verify all containers running
└─ Step 7: Quick validation workflow

WORKFLOW PATH:
→ Validate Tools:
  ✓ MobSF accessible (http://VPS:8000)
  ✓ Reaper proxy working (certificate installed)
  ✓ Frida gadget injection successful
  ✓ Network traffic captured to reaper.db

OUTCOME:
→ All tools validated
→ Ready for production engagement
→ Transition to Director mode for real testing
```

---

## Five-Phase Mobile Testing Workflow

Both iOS and Android testing follow the standard 5-phase workflow:

### Phase 1: EXPLORE (No Active Testing)

**Common Activities (Both Platforms):**
- Parse SCOPE.md and validate authorization
- Obtain application binary (IPA or APK)
- Static metadata analysis (Info.plist or AndroidManifest.xml)
- Technology stack identification
- MASVS mapping based on app features
- Select testing environment (device, emulator, virtual)

**Platform-Specific:**
- **iOS:** See `ios-framework.md` — IPA acquisition, Info.plist analysis, entitlements review, Frida gadget injection setup
- **Android:** See `android-framework.md` — APK decompilation (JADX/APKTool), AndroidManifest.xml analysis, component enumeration, root detection assessment

**App Binary Acquisition:**
- **Automated download:** `tools/app-downloader/` — Playwright headless browser automation for app store downloads
  - `download-ipa.ts` — iOS App Store via ipatool + Playwright (Apple ID auth, SHA256 caching, 30-day TTL)
  - `download-apk.ts` — Android via APKMirror/APKPure scraping (JavaScript-rendered page navigation)
  - VPS deployment available (`deploy.sh`) for isolated execution and clean browser fingerprint
- **Manual methods:** TestFlight (iOS beta), enterprise distribution, or direct APK/IPA download from vendor

**Gate:** Attack surface understood → Proceed to PLAN

---

### Phase 2: PLAN (Requires Approval)

**Test Plan Structure (Platform-Agnostic):**

```markdown
# Mobile Test Plan: [App Name] ([Platform])

## Scope
- App: [Bundle ID / Package Name]
- Platform: iOS / Android / Both
- Version: [Version number]
- Environment: [Device type, rooted/jailbroken status]

## MASVS Test Coverage

### MASVS-STORAGE (16 test cases)
| ID | Test Case | Platform | Method | Priority | Root/JB Required |
|----|-----------|----------|--------|----------|------------------|
| TC-ST-01 | Sensitive data in preferences | iOS/Android | Static + Dynamic | High | No |

### MASVS-NETWORK (12 test cases)
### MASVS-CRYPTO (10 test cases)
### MASVS-AUTH (8 test cases)
### MASVS-PLATFORM (9 test cases)
### MASVS-CODE (7 test cases)
### MASVS-RESILIENCE (5 test cases)

## Tools Required
- [Platform-specific tools]

## ⚠️ APPROVAL REQUIRED
[ ] Scope confirmed
[ ] Binary obtained legally
[ ] Environment limitations acknowledged
[ ] Approved to proceed
```

**Platform-Specific Plans:**
- **iOS:** See `ios-framework.md` — Non-jailbroken testing plan, Frida gadget injection workflow, Corellium setup (if available), certificate pinning bypass strategy
- **Android:** See `android-framework.md` — Rooted vs non-rooted test plan, emulator vs physical device selection, APK Components Inspector setup, MobSF automated scan plan

**Gate:** ⛔ **TEST PLAN APPROVAL REQUIRED** → Proceed to CODE

---

### Phase 3: CODE (Execute + Document)

**Common Testing Categories:**

1. **Static Analysis**
   - Binary decompilation and analysis
   - Hardcoded secrets detection
   - Cryptographic implementation review
   - Manifest/plist security configuration

2. **Dynamic Analysis**
   - Runtime instrumentation (Frida/Objection)
   - Network traffic interception
   - Data storage inspection
   - API endpoint testing

3. **Security Feature Testing**
   - Certificate pinning bypass
   - Root/jailbreak detection bypass
   - Biometric authentication testing
   - Anti-debugging bypass

**Platform-Specific Execution:**
- **iOS:** See `ios-framework.md` — Frida/Objection runtime hooking, Keychain dumping, NSUserDefaults inspection, IPC testing, URL scheme fuzzing
- **Android:** See `android-framework.md` — ADB component testing, content provider querying, broadcast receiver testing, Frida server instrumentation, SQLite database extraction
- **Tools:** See `android-component-testing-tools-2026.md` for current Android component testing tooling (replaces deprecated Drozer)

**Gate:** All test cases executed → Proceed to QA

---

### Phase 4: QA (Findings Validation)

**Platform-Agnostic Validation:**
- [ ] Finding reproducible on target platform
- [ ] Evidence includes OS version and device model
- [ ] Steps work with production builds (not debug)
- [ ] CVSS score accounts for platform-specific factors
- [ ] MASVS category correctly mapped
- [ ] Remediation guidance platform-appropriate

**Platform-Specific QA:**
- **iOS:** Verify findings on target iOS version, test on non-jailbroken device for reproducibility, confirm Frida gadget doesn't affect behavior
- **Android:** Verify findings on target API level, test on non-rooted device where applicable, confirm emulator findings reproduce on physical device

**Gate:** All findings validated → Proceed to COMMIT

---

### Phase 5: COMMIT (Close-Loop Toggle)

**Path A: Self-Hosted / Internal App**
- Handoff to engineering with platform-specific guidance
- Provide code locations (Swift/Objective-C OR Java/Kotlin)
- Include platform-appropriate verification tests

**Path B: Bug Bounty / External App**
- Format for HackerOne/Bugcrowd
- Platform-specific reproduction steps
- Video PoC (screen recording)

**Path C: Client Consulting**
- Professional pentest report
- Platform-specific remediation roadmap
- MASVS compliance assessment

---

## Cross-Platform Framework Testing

### React Native

**Testing Approach:**
3. **Additional React Native Specific:**
   - JavaScript bridge vulnerabilities
   - Bundle analysis (`index.android.bundle`, `main.jsbundle`)
   - Redux state inspection
   - Hardcoded secrets in JS bundle

**Tools:**
- `react-native-decompiler` - Decompile JS bundles
- Standard iOS/Android tools

### Flutter

**Testing Approach:**
3. **Additional Flutter Specific:**
   - Dart code analysis
   - Snapshot analysis (`isolate_snapshot_data`, `vm_snapshot_data`)
   - Platform channel vulnerabilities

**Tools:**
- `reFlutter` - Flutter reverse engineering
- Standard iOS/Android tools

### Xamarin / .NET MAUI

**Testing Approach:**
3. **Additional Xamarin Specific:**
   - .NET assembly analysis
   - Mono runtime inspection

**Tools:**
- `dnSpy` - .NET assembly decompiler
- Standard iOS/Android tools

---

## Tool Ecosystem (Cross-Platform)

### Static Analysis
- **MobSF** - Automated analysis (iOS + Android)
- **APKTool** - Android decompilation
- **JADX** - Android Java decompiler
- **Hopper/Ghidra** - Binary analysis (iOS + Android native)

### Dynamic Analysis
- **Frida** - Runtime instrumentation (iOS + Android)
- **Objection** - Frida-based framework (iOS + Android)
- **mitmproxy** - Open-source HTTP proxy and inspection (both platforms)
- **OWASP ZAP** - HTTP proxy with automated scanner (both platforms)
- **Reaper** - HTTP proxy with SQLite storage (both platforms)

### Platform-Specific
- **iOS:** libimobiledevice, ios-deploy, iproxy
- **Android:** ADB, Drozer, APKLeaks

### Container Deployment

```bash
# mobile-security container includes:
# - Frida (Android server)
# - Objection
# - MobSF
# - APKTool, JADX
# - Drozer
# - Various mobile security tools

# Start container
ssh -p 2222 root@${VPS_IP} "docker compose up -d mobile-security"
```

---

## Traffic Interception (Both Platforms)

**Primary Method: Reaper Proxy**

```bash
# 1. Start Reaper container
ssh -p 2222 root@${VPS_IP} "docker compose up -d reaper"

# 2. Export certificate
./tools/pentest/export-proxy-cert.sh reaper

# 3. Install certificate on device
# iOS: Settings → Profile → Trust
# Android: Settings → Security → Install from storage

# 4. Configure device proxy
# Proxy: reaper-api.internal:8080 (via Twingate) OR VPS IP:8080

# 5. Capture traffic
# Use app normally - traffic stored in reaper.db

# 6. Query captured traffic
ssh -p 2222 root@${VPS_IP} \
  "sqlite3 /opt/pentest-data/reaper.db \
  'SELECT DISTINCT host FROM requests'"
```

**Complete Workflow:** `skills/pentest/docs/MOBILE-REAPER-WORKFLOW.md`

---

## Common Mobile Vulnerabilities (Platform-Agnostic)

### Data Storage Issues
- Sensitive data in preferences (NSUserDefaults / SharedPreferences)
- Unencrypted databases (SQLite, Realm)
- Keychain/Keystore misuse
- Sensitive data in logs
- External storage vulnerabilities (Android)

### Cryptography Issues
- Hardcoded encryption keys
- Weak algorithms (DES, MD5, SHA1)
- Insecure random number generation
- No salt in password hashing

### Network Communication Issues
- Cleartext HTTP traffic
- Certificate pinning bypassable
- Weak TLS configuration
- Man-in-the-middle susceptibility

### Authentication Issues
- Biometric bypass
- Weak session management
- Client-side validation only
- OAuth implementation flaws

### Platform Integration Issues
- Insecure IPC/deep links
- WebView vulnerabilities (XSS, file access)
- Pasteboard/clipboard leakage
- Exported components (Android)

### Code Quality Issues
- Reverse engineering easy (no obfuscation)
- Debug mode enabled in production
- Root/jailbreak detection bypassable
- Outdated third-party libraries

---

## Platform-Specific Methodologies

### iOS Testing

**Highlights:**
- Non-jailbroken first approach (modern reality)
- Frida gadget injection workflow
- Apple Silicon Mac testing
- Corellium virtual devices (professional option)
- 85-90% coverage without jailbreak

**When to use:**
- Keywords: "iOS", "iPhone", "IPA", "Swift", "Objective-C"
- Have .ipa file OR can test via device
- Need production-realistic testing

---

### Android Testing

**Highlights:**
- Rooted and non-rooted techniques
- APK decompilation with JADX/APKTool
- Frida server deployment
- Drozer for IPC testing
- Emulator testing acceptable

**When to use:**
- Keywords: "Android", "APK", "Java", "Kotlin"
- Have .apk file OR can extract from device
- Root access optional (80-85% coverage without root)

---

## Templates

| Template | Purpose | Location |
|----------|---------|----------|
| `test-plan-mobile.md` | Generic mobile test plan | `skills/pentest/templates/` |
| `test-plan-ios.md` | iOS-specific test plan | `skills/pentest/templates/` |
| `test-plan-android.md` | Android-specific test plan | `skills/pentest/templates/` |
| `finding-ios.md` | iOS vulnerability finding | `skills/pentest/templates/` |
| `finding-android.md` | Android vulnerability finding | `skills/pentest/templates/` |
| `report-mobile.md` | Mobile pentest report | `skills/pentest/templates/` |

---

## Reference Resources

### OWASP Mobile
- [OWASP MASTG](https://mas.owasp.org/MASTG/) - Mobile Application Security Testing Guide
- [OWASP MASVS](https://mas.owasp.org/MASVS/) - Mobile Application Security Verification Standard
- [OWASP Mobile Top 10](https://owasp.org/www-project-mobile-top-10/)

### Platform-Specific
- **iOS:** `ios-framework.md` — Complete non-jailbroken testing methodology
- **Android:** `android-framework.md` — Rooted and non-rooted testing methodology
- **Android Tooling:** `android-component-testing-tools-2026.md` — Current component testing tools (Drozer replacement)

### Books
- `private/docs/book-catalog.md` - Complete book catalog

---

**Created:** 2025-12-01
**Updated:** 2026-02-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 2.0
