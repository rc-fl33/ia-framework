---
name: seg-test
description: Network segmentation validation with Director/Demo modes
domain: security
skill: security
agent: security
model: sonnet
complexity: medium
mode: single-agent
chain_position: first
---

# /seg-test -- Network Segmentation Validation

## IDENTITY
**Agent:** Base Claude (orchestrator)
**Role:** Command router for network segmentation validation testing. Tests isolation between security zones (DMZ, internal, management, VLANs). Detects compliance context (PCI DSS, HIPAA, NIST, ISO 27001, SOC 2) and adjusts validation criteria accordingly.

## INPUT CONTRACT
**Receives:** User invokes `/seg-test` with optional client/network info or research question
**Prerequisites:**
- Written authorization for network testing
- Network topology information (diagram, manual description, or auto-discovery capability)
- Network access to target zones (direct, VPN, or Twingate)
**Source:** User invocation

## OBJECTIVE
**Goal:** Route to segmentation testing workflow with zones and methodology configured
**Success criteria:** Zones identified, topology source confirmed, authorization verified, engagement initialized, security agent delegated
**Failure criteria:** No authorization, no network access, topology unavailable, user aborts

## METHODOLOGY

### Request Classification
Classify every invocation before taking action:

1. **Research Query** - Indicators: "explain", "what is", "list", "show", "available", "check tools", "what compliance frameworks"
   - Answer directly from documentation below, then STOP
2. **Actual Test** - Indicators: "test", "validate", "assess", "check segmentation", specific client/network
   - Execute full initialization workflow

### Compliance Context Detection
Auto-detect compliance context from user input:
- **PCI DSS** - Indicators: "PCI", "cardholder", "CDE", "payment"
  - Focus: Requirement 1 (Network Segmentation), CDE isolation
- **HIPAA** - Indicators: "HIPAA", "PHI", "healthcare", "medical"
  - Focus: Security Rule, network controls for PHI protection
- **NIST** - Indicators: "NIST", "800-53", "FedRAMP"
  - Focus: SC-7 (Boundary Protection)
- **ISO 27001** - Indicators: "ISO", "27001", "ISMS"
  - Focus: A.13.1 (Network Security)
- **SOC 2** - Indicators: "SOC", "trust services"
  - Focus: CC6.6 (Logical Access Controls)
- **General** - No specific compliance indicators
  - Focus: Best practice segmentation validation

### Research Query Commands
```bash
# Check tool availability
which nmap && echo "Nmap available" || echo "Not available"
```

## EXECUTION

### Step 1: Classify Request
Parse user input against classification rules in METHODOLOGY. Route to appropriate branch. For research queries, answer using documentation below and STOP.

### Step 2: Collect Parameters (Test Only)
Use AskUserQuestion to gather:
- **Test mode:** Director (default) / Demo
- **Network topology source:** Network Diagram File (default) / Manual Description / Auto-Discovery
- **Test methodology:** Manual Testing / Automated Testing / Hybrid (default, recommended)
- **Security zones to test** (multiple selection allowed):
  - DMZ to Internal
  - Internal to Management
  - VLAN Isolation
  - All Zones (default, recommended)
- **Access credentials:** Authenticated (credentials for switches/routers/firewalls) / Unauthenticated (default, external attacker perspective)
- **Audit logging:** Enabled (default for Director) / Disabled (default for Demo)

### Step 3: Initialize Engagement
```bash
bun run tools/pentest/init-engagement.ts \
  --engagement-dir private/output/seg-test/{client}-{YYYY-MM} \
  --mode {director|demo} \
  --audit-{enabled|disabled} \
  --target-name "{client}"
```

Verify engagement directory created:
```bash
ls -la private/output/seg-test/{client}-{YYYY-MM}/
```

### Step 4: Delegate to Security Agent
ONLY after steps 1-3 complete:
```
Task(subagent_type="security", prompt="Execute {mode} segmentation test for engagement at
private/output/seg-test/{client}-{YYYY-MM}. Client: {client}.
Methodology: {methodology}. Zones: {zones}. Compliance: {framework}.
Proceed with security testing workflows.")
```

## OUTPUT CONTRACT
**Produces:**
- Engagement directory at `private/output/seg-test/{client}-{YYYY-MM}/`
- README.md with test configuration
- SCOPE.md with authorization and network zones
- session.json for phase tracking
- Audit logs directory (if enabled)

**Directory structure (Director):**
```
private/output/seg-test/{client}-{YYYY-MM}/
├── README.md (engagement configuration)
├── SCOPE.md (authorization and network zones)
├── session.json (phase tracking)
├── 01-pre-engagement/
│   └── network-topology/
│       ├── provided-diagram.pdf
│       ├── discovered-topology.png
│       └── zone-matrix.csv
├── 02-intelligence-gathering/
│   └── network-discovery/
├── 03-threat-modelling/
│   └── segmentation-bypass-scenarios.md
├── 04-vulnerability-analysis/
│   ├── connectivity-tests.txt
│   ├── firewall-rule-analysis.md
│   └── bypass-attempts.log
├── 05-exploitation/
├── 06-post-exploitation/
├── 07-reporting/
│   ├── executive-summary.md
│   ├── technical-findings.md
│   └── compliance-report.pdf
├── 05-findings/
│   └── segmentation-gaps.md
└── audit-logs/ (if enabled)
    ├── sessions/
    └── compliance/
```

**Directory structure (Demo):**
```
private/output/seg-test/{client}-{YYYY-MM}/
├── demo-results.txt
└── zone-checks.log
```

## NEXT
**On success:** Load `skills/pentest/workflows/phases/00-WORKFLOW.md` (subset phases: Pre-Engagement, Intelligence Gathering, Vulnerability Analysis, Reporting)
**On failure:** STOP with error context (see Error Handling below)

## CHECKPOINTS
**Exit criteria:**
- [ ] Request classified (research / test)
- [ ] Security zones identified for testing
- [ ] Topology source confirmed (diagram / manual / auto-discovery)
- [ ] Authorization verified (written authorization confirmed)
- [ ] Test methodology selected
- [ ] Engagement directory initialized via init-engagement.ts
- [ ] Security agent delegated with correct parameters

**Error recovery:**
```
Diagram missing:
  -> Display: "Network diagram not found at {path}"
  -> Suggest: "Provide diagram file or use Manual/Auto-Discovery"
  -> Options: [Specify Path] [Switch to Manual] [Abort]

Cannot access test systems:
  -> Display: "No connectivity to test systems in target zones"
  -> Suggest: "Connect via Twingate/VPN and verify network access"
  -> Options: [Retry] [Abort]

No authorization:
  -> Display: "AUTHORIZATION REQUIRED for segmentation testing"
  -> Ask: "Do you have written authorization?" [Yes/No]
  -> If No: ABORT immediately
  -> If Yes: Document source, proceed
```

---

## Reference: Context Prompts

### Test Mode
**Question:** "What type of segmentation test is this?"
**Options:**
- **Director (Production)** - Comprehensive validation, all zones, compliance report
- **Demo (Testing)** - Quick connectivity validation, minimal documentation
**Default:** Director

### Network Topology Source
**Question:** "How will you provide network topology information?"
**Options:**
- **Network Diagram File** - Visio/PDF/PNG showing VLANs, zones, rules
- **Manual Description** - Text description of zones and isolation rules
- **Auto-Discovery** - Scan-based topology discovery (Nmap, traceroute, SNMP)
**Default:** Network Diagram File

### Test Methodology
**Question:** "What testing approach should be used?"
**Options:**
- **Manual Testing** - Human-driven tests, custom scripts, higher accuracy
- **Automated Testing** - Tool-based scanning, faster coverage
- **Hybrid** - Automated discovery + manual validation (recommended)
**Default:** Hybrid

### Security Zones to Test
**Question:** "Which security zones should be tested?"
**Options:**
- **DMZ to Internal** - Test DMZ/internal boundary
- **Internal to Management** - Test user/management boundary
- **VLAN Isolation** - Test VLAN-to-VLAN isolation
- **All Zones** - Comprehensive testing (recommended)
**Multiple selection:** Yes
**Default:** All Zones

### Access Credentials
**Question:** "Do you have network device credentials?"
**Options:**
- **Yes - Authenticated** - Credentials for switches/routers/firewalls, config review
- **No - Unauthenticated** - External testing, attacker perspective
**Default:** No - Unauthenticated

---

## Reference: When to Use

**Use /seg-test when:**
- Validate network segmentation between zones (DMZ, internal, management)
- Test firewall rules and ACLs
- Verify VLAN isolation and trunk security
- Assess zero-trust network architecture
- PCI DSS, HIPAA, or compliance segmentation validation

**Do not use if:** Need full network vulnerability scanning -> use `/vuln-scan`

---

## Reference: Metadata Tracking

Create `metadata.json` at engagement start:
```json
{
  "client": "{client}",
  "started_at": "YYYY-MM-DDTHH:MM:SS",
  "mode": "director|demo",
  "topology_source": "diagram|manual|auto-discovery",
  "methodology": "manual|automated|hybrid",
  "zones_tested": [],
  "phase": "context|validation|testing|reporting|complete",
  "findings": {
    "segmentation_bypasses": 0,
    "rule_violations": 0,
    "compliance_gaps": 0
  }
}
```

---

## Reference: Compliance Frameworks

| Framework  | Requirement                    | Focus Area                         |
|------------|--------------------------------|------------------------------------|
| PCI DSS    | Requirement 1                  | Network Segmentation, CDE isolation |
| HIPAA      | Security Rule                  | Network Controls for PHI           |
| NIST 800-53| SC-7                           | Boundary Protection                |
| ISO 27001  | A.13.1                         | Network Security                   |
| SOC 2      | CC6.6                          | Logical Access Controls            |

---

## Reference: Examples

### PCI DSS Compliance Test (Director)
```
/seg-test
-> Mode: Director | Topology: Diagram | Test: Hybrid | Auth: Yes

Result: Full PCI DSS segmentation test (4-8 hours)
Output: private/output/seg-test/client-pci-2026-02/
```

### Quick VLAN Check (Demo)
```
/seg-test
-> Mode: Demo | Topology: Manual (3 VLANs) | Test: Automated

Result: Quick VLAN isolation check (~10-15 min)
```

---

## Reference: Related Commands

- `/pentest` - Full penetration testing (may include segmentation)
- `/vuln-scan` - Network vulnerability scanning
- `/nist-harden` - Network device configuration hardening (validate mode)
- `/risk-assessment` - Compliance risk assessment

---

## Reference: Security

**Authorization:**
- Written authorization required
- Confirm scope includes all VLANs/subnets
- Document in SCOPE.md

**Production Impact:**
- Schedule during maintenance windows
- Start with passive discovery
- Test non-production zones first
- Monitor for network impact

---

**Version:** 2.0
**Last Updated:** 2026-02-10
**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
