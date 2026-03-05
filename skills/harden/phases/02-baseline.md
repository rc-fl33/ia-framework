---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: medium
chain_position: middle
---

# Phase 2: BASELINE (Current-State Collection and Control Applicability)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Enumerate the current configuration of the target system and
identify which framework controls apply to this specific target. This phase is non-destructive
in both validate and remediate modes — it only reads and observes.

**Additional constraints:** Do not assess or judge configuration in this phase. Focus
entirely on collecting current state and mapping applicable controls. Assessment happens
in Phase 03. If the engineer cannot access the target directly, ask the user to run
specific commands and provide the output.

---

## INPUT CONTRACT

**Receives:**
- scope.md content (target, framework, mode, OS details) from Phase 01
- Target system access method (SSH / local / WinRM / API)
- Framework selection
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- scope.md exists in output directory
- Target system accessible or user can run commands

**Source:** `skills/harden/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a comprehensive current-state inventory of the target system and
enumerate the applicable controls for the selected framework against this specific target.

**Success criteria:**
- OS and platform details documented
- Installed services and open ports enumerated
- Key configuration settings collected (auth, network, logging, services, permissions)
- Applicable controls list produced for the selected framework
- BASELINE.md written to output directory

**Failure criteria:**
- Target inaccessible and user declines to provide config data → STOP at Phase 02

---

## METHODOLOGY

**Collect before assessing.** The baseline establishes what IS, not what SHOULD BE.
Resist the urge to flag issues here — that is Phase 03's job. Document objectively.

**Ask the user to run commands when needed.** If direct access is not available, provide
the user with specific commands to run and spaces to paste output. This is normal and
expected.

**Control applicability reduces noise.** Not every control applies to every target. A
web server does not need database encryption controls assessed. Filtering to applicable
controls before Phase 03 produces a focused, credible finding set.

**This phase is always non-destructive.** Regardless of mode, Phase 02 never writes to
or modifies the target system.

---

## EXECUTION

### Step 1: OS and Platform Inventory

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

Collect OS and platform details. Provide the user with commands to run if direct
access is not available:

```bash
# Linux
uname -a
cat /etc/os-release
hostname
uptime
whoami

# Windows (PowerShell)
Get-ComputerInfo | Select-Object OsName, OsVersion, CsName
Get-Date
```

Document:
- OS name and version
- Kernel version (Linux) or build number (Windows)
- Hostname
- System uptime
- Current user context

**Expected output:** OS and platform inventory recorded

### Step 2: Installed Services and Open Ports

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

Enumerate running services and listening ports:

```bash
# Linux — running services
systemctl list-units --type=service --state=running 2>/dev/null || \
  service --status-all 2>/dev/null

# Linux — listening ports
ss -tlnp 2>/dev/null || netstat -tlnp 2>/dev/null

# Linux — installed packages (summarized)
dpkg -l 2>/dev/null | wc -l || rpm -qa 2>/dev/null | wc -l

# Windows (PowerShell)
Get-Service | Where-Object {$_.Status -eq "Running"} | Select-Object Name, DisplayName
Get-NetTCPConnection -State Listen | Select-Object LocalPort, OwningProcess
```

**Expected output:** Running services list, listening ports, package count

### Step 3: Authentication and Access Configuration

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

Collect authentication settings:

```bash
# Linux — SSH configuration
cat /etc/ssh/sshd_config 2>/dev/null | grep -v "^#" | grep -v "^$"

# Linux — password policy
cat /etc/login.defs 2>/dev/null | grep -E "PASS_|LOGIN_|ENCRYPT"
cat /etc/pam.d/common-password 2>/dev/null || cat /etc/pam.d/password-auth 2>/dev/null

# Linux — sudo configuration
cat /etc/sudoers 2>/dev/null
ls /etc/sudoers.d/ 2>/dev/null

# Linux — users with login shells
grep -v "nologin\|false" /etc/passwd 2>/dev/null | cut -d: -f1,3,6,7

# Windows (PowerShell)
Get-LocalUser | Select-Object Name, Enabled, LastLogon, PasswordRequired
net accounts
```

**Expected output:** Authentication configuration documented

### Step 4: Network and Firewall Configuration

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

```bash
# Linux — firewall rules
ufw status verbose 2>/dev/null || \
  iptables -L -n -v 2>/dev/null || \
  firewall-cmd --list-all 2>/dev/null

# Linux — network interfaces
ip addr show 2>/dev/null || ifconfig 2>/dev/null

# Linux — hosts file and DNS
cat /etc/hosts 2>/dev/null
cat /etc/resolv.conf 2>/dev/null

# Windows (PowerShell)
Get-NetFirewallProfile | Select-Object Name, Enabled, DefaultInboundAction, DefaultOutboundAction
Get-NetIPAddress | Select-Object InterfaceAlias, IPAddress, PrefixLength
```

**Expected output:** Network and firewall configuration documented

### Step 5: Logging and Audit Configuration

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

```bash
# Linux — audit daemon
systemctl is-active auditd 2>/dev/null
cat /etc/audit/auditd.conf 2>/dev/null | grep -v "^#" | grep -v "^$"
auditctl -l 2>/dev/null

# Linux — syslog/rsyslog
systemctl is-active rsyslog 2>/dev/null || systemctl is-active syslog 2>/dev/null
cat /etc/rsyslog.conf 2>/dev/null | grep -v "^#" | grep -v "^$"

# Linux — log rotation
cat /etc/logrotate.conf 2>/dev/null | grep -v "^#" | grep -v "^$"

# Windows (PowerShell)
Get-WinEvent -ListLog * | Where-Object {$_.IsEnabled -eq $true} | \
  Select-Object LogName, MaximumSizeInBytes, LogMode
```

**Expected output:** Logging and audit configuration documented

### Step 6: File Permissions and Sensitive Paths

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

```bash
# Linux — world-writable directories (top-level only to avoid verbosity)
find / -maxdepth 3 -type d -perm -002 2>/dev/null | grep -v proc | grep -v sys

# Linux — SUID/SGID binaries
find / -type f \( -perm -4000 -o -perm -2000 \) 2>/dev/null | sort

# Linux — cron jobs
crontab -l 2>/dev/null
ls -la /etc/cron.* 2>/dev/null

# Linux — /tmp and /var/tmp permissions
ls -la /tmp /var/tmp 2>/dev/null

# Windows (PowerShell)
Get-ChildItem "C:\Windows\System32" -File | \
  Where-Object {$_.Attributes -match "ReparsePoint"} | \
  Select-Object FullName
```

**Expected output:** File permission anomalies and SUID/SGID binaries documented

### Step 7: Patch and Update Status

**Tool:** Bash (if direct access) | Direct conversation (if user-provided)

```bash
# Linux (Debian/Ubuntu)
apt list --upgradable 2>/dev/null | wc -l
apt list --upgradable 2>/dev/null | grep -i security | head -20

# Linux (RHEL/CentOS)
yum check-update 2>/dev/null | wc -l
yum --security check-update 2>/dev/null | head -20

# Linux — last update timestamp
stat /var/lib/apt/lists 2>/dev/null || stat /var/cache/yum 2>/dev/null

# Windows (PowerShell)
Get-HotFix | Sort-Object InstalledOn -Descending | Select-Object -First 10
```

**Expected output:** Patch status documented (pending count, last update)

### Step 8: Enumerate Applicable Controls

**Tool:** Direct analysis

Based on the target OS, platform type, and role, determine which controls from the
selected framework are applicable. Use the following guidance:

**CIS Controls v8.1 — Applicability by IG and asset type:**

| Control Group | Always Applicable | Conditional |
|---------------|-------------------|-------------|
| CIS 1: Inventory | Yes | — |
| CIS 2: Software Inventory | Yes | — |
| CIS 3: Data Protection | Yes | IG2+ |
| CIS 4: Secure Configuration | Yes | — |
| CIS 5: Account Management | Yes | — |
| CIS 6: Access Control | Yes | — |
| CIS 7: Continuous Vulnerability | Yes | IG2+ |
| CIS 8: Audit Log Management | Yes | — |
| CIS 9: Email/Web Browser | If applicable | Workstations |
| CIS 10: Malware Defenses | Yes | — |
| CIS 11: Data Recovery | If applicable | IG2+ |
| CIS 12: Network Infrastructure | If network device | Servers |
| CIS 13: Network Monitoring | Yes | IG2+ |
| CIS 14: Security Awareness | If applicable | People controls |
| CIS 15: Service Provider | If applicable | Cloud/SaaS |
| CIS 16: App Software Security | If applicable | App servers |
| CIS 17: Incident Response | If applicable | IG2+ |
| CIS 18: Penetration Testing | If applicable | IG3 |

**NIST CSF 2.0 — Applicable hardening categories:**
Map Govern, Identify, Protect, Detect, Respond, Recover subcategories to configuration
controls. Focus on Protect (PR) and Detect (DE) for configuration hardening.

**FedRAMP — Impact baseline applicability:**
Confirm Low, Moderate, or High impact baseline with user. Apply corresponding NIST
SP 800-53 Rev 5 controls. Configuration-testable controls only in Phase 03.

**ISO 27001 — Annex A control selection:**
Map Annex A controls to configuration-testable items. Focus on A.8 (Technology Controls)
for infrastructure hardening. Load `standards/frameworks/iso/27001/controls.yaml`
for the full control catalog. Key A.8 controls for infrastructure:

| Annex A Control | Description | CIS Controls v8 Equivalent | IG Level |
|-----------------|-------------|---------------------------|----------|
| A.8.1 | User endpoint devices | CIS 1.1, 2.1 (Asset inventory, SW inventory) | IG1 |
| A.8.2 | Privileged access rights | CIS 5.4, 6.1 (Account/access management) | IG1 |
| A.8.5 | Secure authentication | CIS 5.2 (MFA for admin), 6.3 (MFA for remote) | IG1 |
| A.8.7 | Protection against malware | CIS 10.1, 10.2 (Malware defenses) | IG1 |
| A.8.8 | Technical vulnerability management | CIS 7.1, 7.2 (Vulnerability management) | IG2 |
| A.8.9 | Configuration management | CIS 4.1, 4.2 (Secure configuration baselines) | IG1 |
| A.8.15 | Logging | CIS 8.2, 8.3 (Audit log management) | IG1 |
| A.8.16 | Monitoring activities | CIS 13.1, 13.4 (Network monitoring) | IG2 |
| A.8.20 | Networks security | CIS 12.1, 12.2 (Network infrastructure) | IG2 |
| A.8.22 | Segregation of networks | CIS 12.8 (Network segmentation) | IG3 |

Add `control_id:` column to FINDINGS.md for compliance traceability (ISO 27001 or CIS).
Format: `control_id: A.8.8` or `control_id: CIS-7.1`

**CIS Benchmarks — Platform benchmark loading:**
When CIS Benchmarks (platform-specific) was selected in Phase 01, load the appropriate
benchmark from `standards/frameworks/cis-benchmarks/{platform}/`. Available platforms:

| Platform | Path |
|----------|------|
| Docker | `standards/frameworks/cis-benchmarks/docker/cis-docker-benchmark-v1.8.000/` |
| Ubuntu 22.04 | `standards/frameworks/cis-benchmarks/ubuntu/cis-ubuntu-linux-022.04-lts-benchmark-v3.0.000/` |
| Ubuntu 24.04 | `standards/frameworks/cis-benchmarks/ubuntu/cis-ubuntu-linux-024.04-lts-benchmark-v1.0.000/` |
| AWS Database | `standards/frameworks/cis-benchmarks/aws/cis-aws-database-services-benchmark-v1.0.0/` |
| AWS Storage | `standards/frameworks/cis-benchmarks/aws/cis-aws-storage-services-benchmark-v1.0.0/` |
| Azure Foundations | `standards/frameworks/cis-benchmarks/azure/cis-microsoft-azure-foundations-benchmark-v5.0.0/` |
| GKE | `standards/frameworks/cis-benchmarks/gcp/cis-google-kubernetes-engine-gke-benchmark-v1.8.000-pdf/` |
| Kubernetes | `standards/frameworks/cis-benchmarks/kubernetes/cis-kubernetes-benchmark-v1.12.000-pdf/` |

Each benchmark directory contains `manifest.yaml`, `metadata.json`, and `controls.yaml`.
Load `controls.yaml` directly to get the full control catalog with IDs, titles, and descriptions.
Use `manifest.yaml` to understand coverage and control count.

**HIPAA — Technical safeguards applicability:**
Apply §164.312(a) Access Control, §164.312(b) Audit Controls, §164.312(c) Integrity,
§164.312(d) Person Authentication, §164.312(e) Transmission Security.

**General — Core hardening areas:**
Authentication hardening, service minimization, patch management, logging and auditing,
network hardening, file permissions, encryption at rest and in transit.

Produce an applicable controls list tailored to the target. Filter out controls that
are clearly not applicable (e.g., web browser controls on a headless server).

**Expected output:** Applicable controls list for the selected framework and target

### Step 9: Write BASELINE.md

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/BASELINE.md`:

```markdown
# Baseline: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** {validate|remediate}
**Assessed By:** engineer agent

---

## System Inventory

### OS and Platform
- **OS:** {OS name and version}
- **Kernel/Build:** {kernel version or build number}
- **Hostname:** {hostname}
- **Platform:** {bare metal|VM|container|cloud instance}
- **Role:** {role}
- **Uptime:** {uptime}

### Services (Running)
| Service | Status | Port | Notes |
|---------|--------|------|-------|
| {service} | Running | {port} | {notes} |

### Open Ports
| Port | Protocol | Service | Process |
|------|----------|---------|---------|
| {port} | {TCP|UDP} | {service} | {process} |

---

## Configuration Inventory

### Authentication
{SSH config, password policy, sudo config summary}

### Network and Firewall
{Firewall status, rules summary, interfaces}

### Logging and Audit
{Audit daemon status, syslog config, log rotation}

### File Permissions
{World-writable dirs, SUID/SGID binaries, notable permissions}

### Patch Status
- **Pending updates:** {count}
- **Security updates pending:** {count}
- **Last update:** {date}

---

## Applicable Controls

Framework: {framework}
Total applicable controls: {N}

| Control ID | Control Name | Applicable | CIS Equivalent | Rationale |
|------------|-------------|-----------|---------------|-----------|
| {id} | {name} | Yes/Conditional/No | {cis-id} | {reason} |

---

## Data Collection Notes

{Any commands that failed, partial data, access limitations, or user-provided data}
```

**Expected output:** BASELINE.md written to output directory

---

## OUTPUT CONTRACT

**Produces:**
- `BASELINE.md` → `private/output/harden/{target}-{YYYY-MM}/BASELINE.md`

**Format:** Markdown baseline document with system inventory, config summary, and
applicable controls list

---

## NEXT

**On success:** → Proceed to Phase 3 (Assess):

Load `skills/harden/phases/03-assess.md` with:
- BASELINE.md content (applicable controls list)
- Target and framework from scope.md
- Mode
- Output directory path

**On failure (target inaccessible):** → Ask user to provide config data using the
commands listed in Steps 1–7. Wait for user to provide output before proceeding.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] OS and platform details documented
- [ ] Running services and open ports enumerated
- [ ] Authentication configuration collected
- [ ] Network and firewall configuration collected
- [ ] Logging and audit configuration collected
- [ ] File permissions and SUID/SGID binaries documented
- [ ] Patch status documented
- [ ] Applicable controls list produced for selected framework
- [ ] BASELINE.md written to output directory
- [ ] Ready to proceed to Phase 3 (ASSESS)

**Error recovery:**
- If direct access not available: Provide commands to user, wait for output
- If command fails on target: Note the failure, mark data as unavailable, continue
- If applicable controls list is empty: Verify framework selection and target type

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
