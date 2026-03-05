---
name: vuln-scan
description: Automated vulnerability scanning with Director/Demo modes
domain: security
skill: security
agent: security
model: sonnet
complexity: medium
mode: single-agent
chain_position: first
---

# /vuln-scan -- Automated Vulnerability Scanning

## IDENTITY
**Agent:** Base Claude (orchestrator)
**Role:** Command router for automated vulnerability scanning. Detection-only, no exploitation. Auto-detects target type from format (URL = web, IP = network, CIDR = range). Supports Director and Demo modes with configurable scan depth.

## INPUT CONTRACT
**Receives:** User invokes `/vuln-scan` with optional target or research question
**Prerequisites:**
- Written authorization for custom targets
- Scanning tools available (Nuclei, Nmap, etc.) -- typically via VPS
**Source:** User invocation

## OBJECTIVE
**Goal:** Route to scanning workflow with target type and depth configured
**Success criteria:** Target identified, authorization verified, engagement initialized, security agent delegated with scan parameters
**Failure criteria:** No authorization, target unreachable, required tools unavailable, user aborts

## METHODOLOGY

### Request Classification
Classify every invocation before taking action:

1. **Research Query** - Indicators: "list tools", "show templates", "what is", "explain", "check", "available"
   - Answer directly from documentation below, then STOP
2. **Actual Scan** - Indicators: "scan", "test", "assess", "check vulnerabilities", specific target
   - Execute full initialization workflow

### Target Type Auto-Detection
Infer target type from input format:
- URL (https://example.com) -> Web Application
- IP address (192.168.1.1) -> Network Infrastructure
- CIDR range (10.0.0.0/24) -> Network Range
- API endpoint (/api/v1/...) -> API Endpoints
- Cloud resource (arn:aws:...) -> Cloud Infrastructure

### Research Query Commands
```bash
# List available scanning tools
ls -1 tools/pentest/

# Check tool availability
which nuclei && echo "Nuclei available" || echo "Not available"
which nmap && echo "Nmap available" || echo "Not available"
```

## EXECUTION

### Step 1: Classify Request
Parse user input against classification rules in METHODOLOGY. Route to appropriate branch. For research queries, answer using documentation below and STOP.

### Step 2: Collect Parameters (Scan Only)
Use AskUserQuestion to gather:
- **Scan mode:** Director (default) / Demo
- **Target type:** Web Application (default) / Network Infrastructure / API Endpoints / Cloud Infrastructure
- **Target identifier:** URL, IP, CIDR, or resource identifier (required)
- **Scan depth:** Quick (10-30 min) / Standard (1-2 hours, default) / Thorough (3-6 hours)
- **Authentication:** Unauthenticated (default) / Authenticated
  - If authenticated: Credentials source (file path or manual input)
- **Audit logging:** Enabled (default for Director) / Disabled (default for Demo)

### Step 3: Initialize Engagement
```bash
bun run tools/pentest/init-engagement.ts \
  --engagement-dir private/output/vuln-scan/{target}-{YYYY-MM} \
  --mode {director|demo} \
  --audit-{enabled|disabled} \
  --target-name "{target}"
```

Verify engagement directory created:
```bash
ls -la private/output/vuln-scan/{target}-{YYYY-MM}/
```

### Step 4: Delegate to Security Agent
ONLY after steps 1-3 complete:
```
Task(subagent_type="security", prompt="Execute {mode} vulnerability scan for engagement at
private/output/vuln-scan/{target}-{YYYY-MM}. Target type: {type}. Scan depth: {depth}.
Authentication: {auth}. Proceed with security testing workflows.")
```

## OUTPUT CONTRACT
**Produces:**
- Engagement directory at `private/output/vuln-scan/{target}-{YYYY-MM}/`
- README.md with scan configuration
- SCOPE.md with authorization details
- session.json for phase tracking
- Audit logs directory (if enabled)

**Directory structure (Director):**
```
private/output/vuln-scan/{target}-{YYYY-MM}/
├── README.md (engagement configuration)
├── SCOPE.md (authorization and scope documentation)
├── session.json (phase tracking)
├── 01-pre-engagement/
├── 02-intelligence-gathering/
├── 03-threat-modelling/
├── 04-vulnerability-analysis/
│   ├── nuclei-output.json
│   ├── nmap-scan.xml
│   └── vulnerability-report.pdf
├── 05-exploitation/ (if applicable)
├── 06-post-exploitation/
├── 07-reporting/
│   ├── executive-summary.md
│   ├── technical-findings.md
│   └── final-report.pdf
├── 05-findings/
│   └── validated-findings.md
└── audit-logs/ (if enabled)
    ├── sessions/
    └── compliance/
```

**Directory structure (Demo):**
```
private/output/vuln-scan/{target}-{YYYY-MM}/
├── demo-results.txt
└── tool-validation.log
```

## NEXT
**On success:** Load `skills/pentest/workflows/phases/00-WORKFLOW.md` (subset phases: Pre-Engagement, Intelligence Gathering, Vulnerability Analysis, Reporting)
**On failure:** STOP with error context (see Error Handling below)

## CHECKPOINTS
**Exit criteria:**
- [ ] Request classified (research / scan)
- [ ] Target identified and type detected
- [ ] Authorization verified (written authorization confirmed)
- [ ] Scan mode and depth configured
- [ ] Engagement directory initialized via init-engagement.ts
- [ ] Security agent delegated with correct parameters

**Error recovery:**
```
Target not reachable:
  -> Display: "Cannot reach target at {target}"
  -> Suggest: "Check DNS resolution and network connectivity"
  -> Options: [Retry] [Abort]

Tools missing:
  -> Display: "Required scanning tools not available"
  -> Suggest: "Connect to VPS via Twingate for tool access"
  -> Options: [Connect and Retry] [Abort]

No authorization:
  -> Display: "AUTHORIZATION REQUIRED for vulnerability scanning"
  -> Ask: "Do you have written authorization to scan?" [Yes/No]
  -> If No: ABORT immediately
  -> If Yes: Document source, proceed
```

---

## Reference: Context Prompts

### Scan Mode
**Question:** "What type of scan engagement is this?"
**Options:**
- **Director (Production)** - Full automated scan, complete deliverables
- **Demo (Testing)** - Quick validation without full coverage
**Default:** Director

### Target Type
**Question:** "What type of target are you scanning?"
**Options:**
- **Web Application** - OWASP Top 10, web vulnerabilities (Nuclei, ZAP, Nikto)
- **Network Infrastructure** - Ports, services, network vulns (Nmap, OpenVAS)
- **API Endpoints** - REST/GraphQL/SOAP security (auth, injection, access control)
- **Cloud Infrastructure** - AWS/Azure/GCP misconfigurations
**Default:** Web Application

### Scan Depth
**Question:** "How thorough should the scan be?"
**Options:**
- **Quick** - Essential checks (10-30 min), minimal false positives
- **Standard** - Common vulns (1-2 hours), critical/high severity focus
- **Thorough** - All signatures (3-6 hours), maximum coverage
**Default:** Standard

### Authentication
**Question:** "Will you provide authenticated access?"
**Options:**
- **Unauthenticated** - External perspective, no credentials
- **Authenticated** - Valid credentials for deeper coverage
**Default:** Unauthenticated

### Credentials Source (Conditional - show if Authenticated)
**Question:** "How will you provide credentials?"
**Options:**
- **File Path** - JSON/YAML with credentials (secure format)
- **Manual Input** - Paste credentials directly
**Default:** File Path

---

## Reference: When to Use

**Use /vuln-scan when:**
- Automated vulnerability detection needed
- Quick security assessment required
- Compliance scanning for audit evidence
- Testing web apps, networks, APIs, or cloud infrastructure
- Unauthenticated or authenticated scanning

**Do not use if:** Need manual exploitation -> use `/pentest`

---

## Reference: Metadata Tracking

Create `metadata.json` at engagement start:
```json
{
  "target": "{target}",
  "started_at": "YYYY-MM-DDTHH:MM:SS",
  "mode": "director|demo",
  "target_type": "web|network|api|cloud",
  "scan_depth": "quick|standard|thorough",
  "phase": "context|validation|scanning|reporting|complete",
  "findings": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0
  }
}
```

---

## Reference: Examples

### Web Application (Director)
```
/vuln-scan
-> Mode: Director | Target: Web Application | Depth: Standard

Result: Full vulnerability scan (1-2 hours)
Output: private/output/vuln-scan/example-com-2026-02/
```

### Quick Network Check (Demo)
```
/vuln-scan
-> Mode: Demo | Target: Network Infrastructure | Depth: Quick

Result: Quick port scan (~5-10 min), confirms tool connectivity
```

---

## Reference: Related Commands

- `/pentest` - Full penetration testing with manual exploitation
- `/seg-test` - Network segmentation validation
- `/code-review` - Source code security review
- `/risk-assessment` - Formal cybersecurity risk assessment

---

## Reference: Security

**Authorization:**
- Custom targets require explicit written authorization
- SCOPE.md validated
- Targets must be: own infrastructure, authorized bug bounty, or safe test environments
- Never scan without authorization

**Credentials Security:**
- Store outside git (.gitignore)
- Encrypt at rest if possible
- Delete after scan completion

**Legal Compliance:**
- Written authorization required
- CFAA compliance enforced
- Safe targets inherently authorized

---

**Version:** 2.0
**Last Updated:** 2026-02-10
**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
