# Thick Client Application Security Testing Methodology

**Platform Router:** Windows | macOS | Linux | Cross-Platform
**Updated:** 2026-02-08 | **Framework Version:** 1.0

---

## Overview

Thick client application security testing identifies vulnerabilities in desktop applications through static binary analysis, dynamic runtime analysis, memory inspection, and network traffic interception. Testing covers native executables, .NET/Java applications, and hybrid architectures (Electron, Flutter, Tauri).

This framework covers:
- **Windows Testing** — PE binary analysis, DLL hijacking, UAC bypass, .NET decompilation
- **macOS Testing** — Mach-O analysis, dylib hijacking, SIP/TCC bypass, entitlement abuse
- **Linux Testing** — ELF analysis, LD_PRELOAD injection, SUID exploitation, shared library attacks
- **Cross-Platform** — Electron (asar extraction, Node.js RCE), Flutter, Java/JVM applications

**Authoritative Standards:**
- [OWASP TASVS](https://owasp.org/www-project-thick-client-application-security-verification-standard/) — Thick Application Security Verification Standard
- [PTES](https://www.pentest-standard.org/) — Penetration Testing Execution Standard
- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) — Technical Guide to Information Security Testing
- [MITRE ATT&CK Enterprise](https://attack.mitre.org/) — Technique mapping per platform

---

## Platform Detection & Routing

```
┌─────────────────────────────────────────────────────┐
│       THICK CLIENT TESTING PLATFORM DETECTION       │
└──────────────────────┬──────────────────────────────┘
                       │
                       ▼
          What platform is the app?
                       │
     ┌─────────────────┼─────────────────┐
     │                 │                 │
     ▼                 ▼                 ▼
  ┌───────┐       ┌───────┐       ┌───────┐
  │Windows│       │ macOS │       │ Linux │
  └───┬───┘       └───┬───┘       └───┬───┘
      │               │               │
      ▼               ▼               ▼
  windows-         macos-          linux-
  applications.md  applications.md applications.md
      │               │               │
      ▼               ▼               ▼
  PE/DLL/COM      Mach-O/.app     ELF/SO
  .NET/COM+       dylib/framework shared libs
  Registry        plist/Keychain  config files


CROSS-PLATFORM DETECTION:
─────────────────────────────────────────────────────
If the application is Electron, Flutter, Java/JVM,
or other cross-platform framework → test on the
deployment platform using the platform-specific
methodology, PLUS Electron/framework-specific checks.


KEYWORDS DETECTION:
─────────────────────────────────────────────────────
Windows Keywords:
  • "Windows", "EXE", "DLL", "PE", ".NET"
  • "C#", "WPF", "WinForms", "COM"
  • "Registry", "MSI", "installer"
  • "UAC", "service", "SYSTEM"

macOS Keywords:
  • "macOS", "Mac", ".app", "DMG"
  • "Swift", "Objective-C", "Mach-O"
  • "Keychain", "SIP", "TCC"
  • "dylib", "framework", "entitlements"

Linux Keywords:
  • "Linux", "ELF", ".so", "daemon"
  • "GTK", "Qt", "X11", "Wayland"
  • "SUID", "capabilities", "systemd"
  • "LD_PRELOAD", "AppImage", "Flatpak", "Snap"

Cross-Platform Keywords:
  • "Electron", "Node.js", "asar"
  • "Flutter", "Dart"
  • "Java", "JAR", "JVM", "Kotlin"
  • "Tauri", "CEF", "Qt"
```

---

## Windows Testing Decision Tree

```
Windows Thick Client Testing
         │
         ▼
   What binary type?
         │
    ┌────┴─────────────┐
    │                  │
  Native             .NET
  (C/C++)            (C#/VB.NET)
    │                  │
    ▼                  ▼
  PE analysis       Decompile
  x64dbg            dnSpy/ILSpy
  Ghidra            dotPeek
    │                  │
    └────┬─────────────┘
         │
         ▼
  Is it an Electron app?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
  Extract   Continue with
  app.asar  platform
  Node.js   methodology
  analysis
```

**When to use:** Keywords: "Windows", "EXE", ".NET", "C#", "installer", "MSI"

See `windows-applications.md` — 8-phase methodology with PE analysis, DLL hijacking, UAC bypass, memory corruption testing.

---

## macOS Testing Decision Tree

```
macOS Thick Client Testing
         │
         ▼
   Application type?
         │
    ┌────┴─────────────┐
    │                  │
  Native             Framework-based
  (Swift/ObjC)       (Electron/Flutter)
    │                  │
    ▼                  ▼
  Mach-O analysis   Extract bundle
  Hopper/Ghidra     framework assets
  LLDB              (asar, flutter_assets)
    │                  │
    └────┬─────────────┘
         │
         ▼
  Code signed? Hardened runtime?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
  Check      Easier to
  entitlements  inject/hook
  for abuse     (Frida, DYLD)
```

**When to use:** Keywords: "macOS", "Mac app", ".app", "DMG", "Swift", "Objective-C"

See `macos-applications.md` — 8-phase methodology with Mach-O analysis, dylib hijacking, SIP/TCC bypass, entitlement exploitation.

---

## Linux Testing Decision Tree

```
Linux Thick Client Testing
         │
         ▼
   Binary type?
         │
    ┌────┴─────────────┐
    │                  │
  Native ELF         Packaged
  (C/C++/Rust/Go)    (AppImage/Flatpak/Snap)
    │                  │
    ▼                  ▼
  ldd/readelf       Extract from
  Ghidra/radare2    container/sandbox
  GDB/LLDB          then analyze ELF
    │                  │
    └────┬─────────────┘
         │
         ▼
  SUID/SGID set? Capabilities?
         │
    ┌────┴────┐
   YES       NO
    │         │
    ▼         ▼
  Privilege  Standard
  escalation user-level
  testing    testing
```

**When to use:** Keywords: "Linux", "ELF", "daemon", "GTK", "Qt", "SUID"

See `linux-applications.md` — 8-phase methodology with ELF analysis, LD_PRELOAD injection, SUID exploitation, race condition testing.

---

## OWASP TASVS Integration

**Reference:** [OWASP Thick Application Security Verification Standard](https://owasp.org/www-project-thick-client-application-security-verification-standard/)

The TASVS provides verification requirements specific to thick client applications, complementing ASVS for web and MASVS for mobile.

### Key TASVS Categories

1. **TASVS-STORAGE** — Local Data Storage Security
   - Hardcoded credentials in binaries
   - Sensitive data in config files, registry, plist
   - Insecure local database storage (SQLite, LevelDB)
   - Cleartext secrets in memory

2. **TASVS-CRYPTO** — Cryptographic Implementation
   - Weak/deprecated algorithms (DES, RC4, MD5)
   - Hardcoded encryption keys in binary
   - Insecure key derivation
   - Custom cryptographic implementations

3. **TASVS-AUTH** — Authentication & Session Management
   - Client-side authentication bypass
   - Token/session storage in insecure locations
   - Credential caching without protection
   - Insufficient session expiration

4. **TASVS-NETWORK** — Network Communication Security
   - Cleartext API communication
   - Certificate validation disabled
   - Man-in-the-middle susceptibility
   - Insecure WebSocket connections

5. **TASVS-BINARY** — Binary Protection
   - Missing compiler security flags (ASLR, DEP/NX, stack canaries, PIE)
   - Debug symbols in production builds
   - Lack of code signing
   - Missing anti-tamper protections

6. **TASVS-PLATFORM** — Platform Interaction Security
   - Insecure IPC mechanisms (named pipes, D-Bus, XPC)
   - DLL/dylib/SO hijacking vulnerabilities
   - Unsafe file operations (symlink attacks, TOCTOU)
   - Privilege escalation via platform features

7. **TASVS-CONFIG** — Configuration Security
   - Insecure default configurations
   - Writable config files with elevated privileges
   - Registry/plist permission issues
   - Environment variable injection

---

## Common Vulnerability Categories (Cross-Platform)

### Binary Security

| Vulnerability | Windows | macOS | Linux | TASVS |
|--------------|---------|-------|-------|-------|
| Missing ASLR | PE header check | Mach-O PIE flag | ELF PIE check | BINARY |
| Missing DEP/NX | PE characteristics | Stack execution | NX bit | BINARY |
| No stack canaries | /GS flag | -fstack-protector | -fstack-protector | BINARY |
| Debug symbols | PDB present | DWARF symbols | DWARF/STABS | BINARY |
| No code signing | Authenticode | codesign | N/A (AppImage) | BINARY |

### Library Hijacking

| Attack | Windows | macOS | Linux |
|--------|---------|-------|-------|
| Search order | DLL hijacking | dylib hijacking | LD_PRELOAD |
| Technique | Place DLL in app dir | DYLD env injection | LD_PRELOAD=malicious.so |
| ATT&CK | T1574.001 | T1574.004 | T1574.006 |
| Detection | Process Monitor | fs_usage / dtrace | strace / ltrace |

### Credential Exposure

| Location | Windows | macOS | Linux |
|----------|---------|-------|-------|
| Config files | %APPDATA%, registry | ~/Library/Preferences/*.plist | ~/.config/, /etc/ |
| Memory | Mimikatz, x64dbg | lldb, Frida | gdb, /proc/pid/maps |
| Binary | dnSpy (.NET), strings | otool, strings | strings, Ghidra |

---

## Five-Phase Testing Workflow

All platforms follow the standard testing workflow. The 8-phase technical methodology in each platform file maps into these workflow phases.

### Phase 1: EXPLORE (No Active Testing)

**Common Activities (All Platforms):**
- Parse SCOPE.md and validate authorization
- Obtain application binary (installer, bundle, or package)
- Identify binary format (PE, Mach-O, ELF) and framework (native, .NET, Electron, Flutter)
- Enumerate dependencies and linked libraries
- Check compiler security flags (ASLR, DEP, canaries, PIE)
- Map attack surface: IPC, network, file I/O, registry/plist, privilege level

**Platform-Specific:**
- **Windows:** See `windows-applications.md` Phase 1 — PE header analysis, .NET detection (dnSpy/ILSpy), Electron detection, import table enumeration
- **macOS:** See `macos-applications.md` Phase 1 — Bundle analysis, Info.plist inspection, code signing verification, entitlements review, framework detection
- **Linux:** See `linux-applications.md` Phase 1 — ELF identification, shared library dependencies (ldd), SUID/SGID check, capabilities enumeration

**Gate:** Application architecture understood, attack surface mapped → Proceed to PLAN

---

### Phase 2: PLAN (Requires Approval)

**Test Plan Structure:**

```markdown
# Thick Client Test Plan: [App Name] ([Platform])

## Scope
- Application: [Name and version]
- Platform: Windows / macOS / Linux
- Binary type: [Native, .NET, Electron, Flutter, Java]
- Architecture: [x86, x64, ARM64]
- Privilege level: [Standard user / Admin / Service / SUID]

## TASVS Test Coverage

### TASVS-STORAGE — Local Data Storage
| ID | Test Case | Method | Priority |
|----|-----------|--------|----------|
| TC-ST-01 | Hardcoded credentials in binary | Static (strings, decompiler) | Critical |

### TASVS-CRYPTO — Cryptographic Implementation
### TASVS-AUTH — Authentication
### TASVS-NETWORK — Network Communication
### TASVS-BINARY — Binary Protection
### TASVS-PLATFORM — Platform Interaction
### TASVS-CONFIG — Configuration Security

## Tools Required
- [Platform-specific tools from methodology file]

## APPROVAL REQUIRED
[ ] Scope confirmed
[ ] Binary obtained legally
[ ] Testing environment isolated
[ ] Approved to proceed
```

**Platform-Specific Plans:**
- **Windows:** See `windows-applications.md` — Tool selection (x64dbg vs WinDbg, dnSpy vs ILSpy), DLL hijacking test targets, UAC bypass candidates
- **macOS:** See `macos-applications.md` — Hardened runtime bypass strategy, SIP/TCC test scope, dylib injection approach
- **Linux:** See `linux-applications.md` — SUID binary inventory, LD_PRELOAD test plan, capability abuse targets, container escape scope (if packaged)

**Gate:** ⛔ **TEST PLAN APPROVAL REQUIRED** → Proceed to CODE

---

### Phase 3: CODE (Execute + Document)

Execute the 8-phase technical methodology from the platform-specific file:

| Phase | Windows | macOS | Linux |
|-------|---------|-------|-------|
| 1. Fingerprinting | PE headers, .NET metadata | Bundle analysis, Mach-O | ELF headers, ldd |
| 2. Binary Analysis | PE security flags, imports | Mach-O flags, entitlements | ELF protections, symbols |
| 3. Runtime Analysis | Process Monitor, API Monitor | fs_usage, dtrace, Instruments | strace, ltrace, /proc |
| 4. Library Hijacking | DLL search order | DYLD env injection | LD_PRELOAD, RPATH |
| 5. Configuration | Registry, AppData, config | plist, Keychain, preferences | /etc/, ~/.config/, env vars |
| 6. Privilege Escalation | UAC bypass, token manipulation | SIP bypass, TCC abuse | SUID, capabilities, sudo |
| 7. Memory Corruption | Buffer overflow, heap spray | Stack/heap exploitation | Buffer overflow, format string |
| 8. Network Security | Proxy interception, TLS | ATS bypass, proxy setup | TLS validation, cleartext |

**Platform-Specific Execution:**
- **Windows:** See `windows-applications.md` Phases 1-8 — includes DLL hijacking PoC walkthrough, .NET decompilation workflow, UAC bypass chains
- **macOS:** See `macos-applications.md` Phases 1-8 — includes dylib hijacking chains, SIP bypass techniques, TCC permission abuse, Frida/LLDB instrumentation
- **Linux:** See `linux-applications.md` Phases 1-8 — includes LD_PRELOAD injection, SUID exploitation, race condition testing, GDB debugging

**Gate:** All test cases executed → Proceed to QA

---

### Phase 4: QA (Findings Validation)

**Platform-Agnostic Validation:**
- [ ] Finding reproducible on target platform and OS version
- [ ] Evidence includes exact OS version, application version, architecture
- [ ] Steps work with production builds (not debug/development builds)
- [ ] CVSS score calculated with platform-specific environmental factors
- [ ] TASVS category correctly mapped
- [ ] MITRE ATT&CK technique ID assigned
- [ ] CWE identifier assigned
- [ ] Remediation guidance is platform-appropriate

**Platform-Specific QA:**
- **Windows:** Verify findings on target Windows version, test with and without UAC, confirm .NET framework version compatibility
- **macOS:** Verify findings on target macOS version, test with SIP enabled (production reality), confirm hardened runtime impact
- **Linux:** Verify findings on target distribution and kernel version, test with and without SELinux/AppArmor, confirm findings across package formats (native, Snap, Flatpak)

**Gate:** All findings validated → Proceed to COMMIT

---

### Phase 5: COMMIT (Reporting)

**Path A: Internal / Enterprise Application**
- Handoff to engineering with platform-specific remediation
- Provide binary locations, function offsets, and exact reproduction steps
- Include compiler flag recommendations per platform

**Path B: Bug Bounty / External Application**
- Format for HackerOne/Bugcrowd
- Platform-specific reproduction steps with exact OS/app version
- Video PoC for complex exploitation chains (DLL hijacking, privilege escalation)

**Path C: Client Consulting**
- Professional pentest report with TASVS mapping
- Platform-specific remediation roadmap
- Compliance mapping (CIS benchmarks, NIST 800-53 controls)

---

## Tool Ecosystem

### Windows
| Tool | Purpose | Phase |
|------|---------|-------|
| Detect-It-Easy (DIE) | Binary identification | 1 |
| dnSpy / ILSpy / dotPeek | .NET decompilation | 2 |
| x64dbg / WinDbg | Native debugging | 3, 7 |
| Process Monitor | Runtime file/registry monitoring | 3 |
| API Monitor | Win32 API call tracing | 3 |
| Process Hacker | Process/memory inspection | 3, 4 |
| Ghidra | Static analysis / reverse engineering | 2 |
| Wireshark | Network traffic capture | 8 |

### macOS
| Tool | Purpose | Phase |
|------|---------|-------|
| otool / vtool | Mach-O header analysis | 1, 2 |
| Hopper Disassembler | Static analysis | 2 |
| Ghidra | Static analysis / reverse engineering | 2 |
| LLDB | Native debugging | 3, 7 |
| Frida | Runtime instrumentation | 3, 4 |
| fs_usage / dtrace | System call tracing | 3 |
| codesign / csreq | Code signing inspection | 1 |
| Wireshark / mitmproxy | Network traffic capture | 8 |

### Linux
| Tool | Purpose | Phase |
|------|---------|-------|
| file / readelf | Binary identification | 1 |
| ldd | Shared library enumeration | 1 |
| Ghidra / radare2 | Static analysis / reverse engineering | 2 |
| GDB / LLDB | Native debugging | 3, 7 |
| strace / ltrace | System/library call tracing | 3 |
| Frida | Runtime instrumentation | 3, 4 |
| pspy | Process monitoring (unprivileged) | 3 |
| Wireshark / tcpdump | Network traffic capture | 8 |

### Cross-Platform
| Tool | Purpose | Platforms |
|------|---------|-----------|
| Frida | Runtime hooking and instrumentation | All |
| Ghidra | Binary reverse engineering | All |
| Wireshark | Network protocol analysis | All |
| mitmproxy | HTTP/HTTPS interception | All |
| strings | Quick credential/secret scanning | All |
| Reaper | HTTP proxy with SQLite storage | All (via VPS) |

---

## Reference Resources

### OWASP
- [OWASP TASVS](https://owasp.org/www-project-thick-client-application-security-verification-standard/) — Thick Application Security Verification Standard
- [OWASP ASVS](https://owasp.org/www-project-application-security-verification-standard/) — Application Security Verification Standard

### Standards
- [PTES](https://www.pentest-standard.org/) — Penetration Testing Execution Standard
- [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) — Technical Guide to Information Security Testing
- [MITRE ATT&CK Enterprise](https://attack.mitre.org/) — Technique mapping

### Platform-Specific
- **Windows:** `windows-applications.md` — PE analysis, DLL hijacking, .NET decompilation, UAC bypass
- **macOS:** `macos-applications.md` — Mach-O analysis, dylib hijacking, SIP/TCC bypass, entitlements
- **Linux:** `linux-applications.md` — ELF analysis, LD_PRELOAD injection, SUID exploitation, race conditions

### Books
- `private/docs/book-catalog.md` — Complete book catalog

---

**Created:** 2026-02-08
**Framework:** Intelligence Adjacent (IA) — Security Testing
**Version:** 1.0
