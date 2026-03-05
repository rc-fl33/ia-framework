---
domain: harden
skill: harden
agent: engineer
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 3: ASSESS (Control-by-Control Gap Analysis)

## IDENTITY

**Agent:** `agents/engineer.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Perform control-by-control assessment against the applicable
controls list from Phase 02. Assign Pass/Fail/NA status, severity rating, and evidence
reference for each control. This phase transforms raw baseline data into a structured
finding set.

**Additional constraints:** This phase is still non-destructive — read and observe only.
Assessment is purely analytical: compare what was collected in Phase 02 against what the
selected framework requires. Do not begin remediation guidance here; that is Phase 04.

---

## INPUT CONTRACT

**Receives:**
- BASELINE.md content (system inventory + applicable controls list)
- scope.md (framework, mode, target, OS details)
- Output directory path: `private/output/harden/{target}-{YYYY-MM}/`

**Prerequisites:**
- BASELINE.md exists in output directory
- Applicable controls list is populated

**Source:** `skills/harden/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a complete control assessment table with Pass/Fail/NA status, severity
rating, evidence reference, and remediation priority for each applicable control.

**Success criteria:**
- Every applicable control from Phase 02 has a status (Pass/Fail/NA)
- Every FAIL has a severity rating (Critical/High/Medium/Low)
- Every FAIL has an evidence reference citing the baseline data
- Every FAIL has a remediation priority (P0/P1/P2/P3)
- Summary counts produced (total, pass, fail, na, by severity)
- FINDINGS.md written to output directory

**Failure criteria:**
- No applicable controls to assess → Loop back to Phase 02

---

## METHODOLOGY

**Evidence-driven assessment.** Every FAIL must cite specific evidence from the baseline
data. "Password complexity not configured" is a finding only if the evidence shows it is
actually not configured. Do not assume failures without evidence.

**Framework fidelity.** Follow the selected framework's requirements precisely. Do not
invent requirements not in the framework, and do not ignore requirements that are
difficult to assess.

**Conservative NA usage.** Mark NA only when a control is genuinely not applicable to
the target (e.g., web browser controls on a headless server, database encryption on a
system with no database). When uncertain, attempt assessment.

**Severity calibration.** Use the tier definitions below consistently. Critical means
direct exploitation path exists given current configuration — not just theoretical risk.

---

## EXECUTION

### Step 1: Define Severity Tiers

Apply these definitions consistently throughout assessment:

```
CRITICAL
  Direct exploitation path exists given current configuration.
  Examples: SSH root login enabled with password auth on public IP,
  world-writable /etc/sudoers, empty root password, RDP exposed with default credentials.
  Action: Immediate remediation regardless of mode.

HIGH
  Significant risk, exploitable with moderate effort or when combined with other weaknesses.
  Examples: Password complexity not enforced, audit logging disabled, SUID on unusual binaries,
  firewall default ACCEPT policy, unencrypted sensitive service.
  Action: Remediation within current change cycle.

MEDIUM
  Risk exists but mitigating factors reduce exploitation likelihood.
  Examples: Old TLS version alongside modern version, log rotation misconfigured,
  non-critical service running as root, weak but non-default SSH ciphers.
  Action: Remediation within next 30 days.

LOW
  Best practice gap with low exploitation risk in isolation.
  Examples: MOTD/banner missing, idle session timeout not configured, minor permission
  deviation from benchmark, informational logging not enabled.
  Action: Remediation in next scheduled maintenance cycle.
```

### Step 2: Define Remediation Priority

Map severity to priority using this scale:

| Priority | Severity | Timeline |
|----------|----------|----------|
| P0 | Critical | Immediate — block deployment or apply emergency change |
| P1 | High | This change cycle — within sprint or current window |
| P2 | Medium | Next 30 days — scheduled remediation |
| P3 | Low | Next maintenance cycle — backlog item |

### Step 3: Perform Control-by-Control Assessment

**Tool:** Direct analysis (compare BASELINE.md data against framework requirements)

For each control in the applicable controls list from BASELINE.md:

1. Read the control requirement from the framework
2. Find the relevant data in BASELINE.md
3. Compare actual vs required
4. Assign status: Pass / Fail / NA
5. If Fail: assign severity, record evidence, assign priority

**Assessment logic by framework:**

**CIS Controls v8.1:**
- CIS 1 (Inventory): Pass if hardware/software inventory exists and is maintained
- CIS 2 (Software): Pass if unauthorized software blocked or monitored
- CIS 3 (Data Protection): Pass if data classification and encryption controls present
- CIS 4 (Secure Config): Pass if hardened baseline applied and deviation tracking exists
- CIS 4.1 (Default passwords): Fail if any default credentials found
- CIS 4.2 (Unnecessary services): Fail if services running with no documented purpose
- CIS 5 (Account Mgmt): Pass if least privilege enforced, shared accounts absent
- CIS 5.3 (Disable dormant accounts): Fail if accounts inactive >45 days still enabled
- CIS 6 (Access Control): Pass if MFA enabled, admin access restricted
- CIS 6.2 (Admin access): Fail if admin access not documented and approved
- CIS 7 (Vuln Mgmt): Pass if patching cadence documented, security patches applied
- CIS 8 (Audit Logs): Pass if audit logging enabled, logs protected, retention configured
- CIS 8.2 (Log collection): Fail if critical events not captured
- CIS 8.3 (Log protection): Fail if logs are writable by non-admin users
- CIS 10 (Malware): Pass if endpoint protection present and updated

**NIST CSF 2.0 — Protect (PR) hardening controls:**
- PR.AA (Access Control): Evaluate authentication strength, account management, privilege
- PR.DS (Data Security): Evaluate encryption at rest, in transit, data handling
- PR.PS (Platform Security): Evaluate secure configuration, software integrity, patching
- PR.IR (Technology Infrastructure Resilience): Evaluate backup, redundancy, recovery

**FedRAMP:**
- Apply NIST SP 800-53 Rev 5 controls at the confirmed impact level
- AC controls: Access control policies, account management, least privilege
- AU controls: Audit and accountability, log management, review
- CM controls: Configuration management, baseline configs, change control
- IA controls: Identification and authentication, MFA, password management
- SC controls: System and communications protection, encryption, network security
- SI controls: System integrity, malware protection, software updates

**ISO 27001 Annex A:**
- A.8.1 (User Endpoint Devices): Secure configuration policy applied
- A.8.2 (Privileged Access Rights): Least privilege, admin account review
- A.8.3 (Information Access Restriction): Access based on need-to-know
- A.8.4 (Access to Source Code): Source access controlled
- A.8.5 (Secure Authentication): MFA, strong credentials
- A.8.6 (Capacity Management): Resource monitoring
- A.8.7 (Protection Against Malware): Endpoint protection
- A.8.8 (Management of Technical Vulnerabilities): Patching process
- A.8.9 (Configuration Management): Hardened baseline, change tracking
- A.8.15 (Logging): Audit logging enabled, protected, reviewed
- A.8.20 (Networks Security): Firewall, network segmentation
- A.8.22 (Segregation of Networks): Network zones separated

**HIPAA Technical Safeguards:**
- §164.312(a)(1) Access Control: Unique user IDs, emergency access, auto logoff, encryption
- §164.312(a)(2)(i) Unique User ID: No shared accounts for ePHI access
- §164.312(a)(2)(ii) Emergency Access: Emergency access procedure exists
- §164.312(a)(2)(iii) Automatic Logoff: Session timeout configured
- §164.312(a)(2)(iv) Encryption/Decryption: ePHI encrypted at rest
- §164.312(b) Audit Controls: Activity in systems containing ePHI logged
- §164.312(c)(1) Integrity: ePHI not improperly altered or destroyed
- §164.312(d) Person Authentication: User identity verified before ePHI access
- §164.312(e)(1) Transmission Security: ePHI encrypted in transmission

**General hardening:**
- Authentication: Password complexity, age, lockout, no default creds, SSH key auth
- Services: Only necessary services running, documented purpose for each
- Patching: Security patches applied within 30 days, last update recent
- Logging: Syslog/auditd running, log rotation configured, logs protected
- Network: Firewall enabled, default deny, only necessary ports open
- Permissions: No world-writable system dirs, SUID limited to expected binaries
- Encryption: SSH using strong ciphers/MACs, services using TLS 1.2+

**Expected output:** Assessment complete for all applicable controls

### Step 4: Compile Summary Counts

Count findings by status and severity:

```
Total controls assessed: {N}
Pass: {N}
Fail: {N}
N/A: {N}

Failures by severity:
  Critical: {N}
  High: {N}
  Medium: {N}
  Low: {N}

Failures by priority:
  P0 (Immediate): {N}
  P1 (This cycle): {N}
  P2 (30 days): {N}
  P3 (Backlog): {N}
```

### Step 5: Write FINDINGS.md

**Tool:** Write

Write `private/output/harden/{target}-{YYYY-MM}/FINDINGS.md`:

```markdown
# Findings: {target}

**Date:** {YYYY-MM-DD}
**Framework:** {framework}
**Mode:** {validate|remediate}

---

## Summary

| Status | Count |
|--------|-------|
| PASS | {N} |
| FAIL | {N} |
| N/A | {N} |
| **Total** | **{N}** |

| Severity | Count |
|----------|-------|
| Critical | {N} |
| High | {N} |
| Medium | {N} |
| Low | {N} |

---

## Control Assessment Table

| Control ID | Control Name | Status | Severity | Evidence | Priority |
|------------|-------------|--------|----------|---------|----------|
| {id} | {name} | PASS | — | {evidence ref} | — |
| {id} | {name} | FAIL | Critical | {evidence ref} | P0 |
| {id} | {name} | FAIL | High | {evidence ref} | P1 |
| {id} | {name} | FAIL | Medium | {evidence ref} | P2 |
| {id} | {name} | FAIL | Low | {evidence ref} | P3 |
| {id} | {name} | N/A | — | {rationale} | — |

---

## Critical and High Findings (P0/P1)

### {Control ID}: {Control Name}
**Status:** FAIL
**Severity:** Critical|High
**Priority:** P0|P1
**Evidence:** {specific baseline data that demonstrates the failure}
**Risk:** {what an attacker can do with this misconfiguration}

{repeat for each P0/P1 finding}

---

## Medium and Low Findings (P2/P3)

### {Control ID}: {Control Name}
**Status:** FAIL
**Severity:** Medium|Low
**Priority:** P2|P3
**Evidence:** {specific baseline data that demonstrates the failure}

{repeat for each P2/P3 finding}
```

**Expected output:** FINDINGS.md written to output directory

### Step 6: Update metadata.json

**Tool:** Read, Write

Read existing metadata.json and update with findings summary:

```json
{
  "findings_summary": {
    "total": {N},
    "pass": {N},
    "fail": {N},
    "na": {N},
    "critical": {N},
    "high": {N},
    "medium": {N},
    "low": {N}
  },
  "phases_completed": ["scope", "baseline", "assess"],
  "phase_timestamps": {
    "scope": "{timestamp}",
    "baseline": "{timestamp}",
    "assess": "{YYYY-MM-DDTHH:MM:SSZ}"
  }
}
```

**Expected output:** metadata.json updated with findings counts

---

## OUTPUT CONTRACT

**Produces:**
- `FINDINGS.md` → `private/output/harden/{target}-{YYYY-MM}/FINDINGS.md`
- `metadata.json` → updated with findings summary counts

**Format:** Markdown findings document with full control assessment table and severity
breakdown; JSON metadata updated

---

## NEXT

**On success:** → Proceed to Phase 4 (Remediate):

Load `skills/harden/phases/04-remediate.md` with:
- FINDINGS.md content (all FAIL controls with evidence and priority)
- scope.md (mode — this determines what Phase 04 produces)
- Target OS and platform details
- Output directory path

**On failure (no applicable controls):** → Loop back to Phase 02, re-examine control
applicability selection.

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Every applicable control assessed (Pass/Fail/NA)
- [ ] Every FAIL has severity rating
- [ ] Every FAIL has evidence reference from BASELINE.md
- [ ] Every FAIL has remediation priority (P0–P3)
- [ ] Summary counts accurate (total = pass + fail + na)
- [ ] FINDINGS.md written to output directory
- [ ] metadata.json updated with findings counts
- [ ] Ready to proceed to Phase 4 (REMEDIATE)

**Error recovery:**
- If control requirement unclear: Apply conservative interpretation, note uncertainty in evidence
- If baseline data missing for a control: Mark as FAIL with note "data unavailable — cannot verify"
- If no failures found: Verify assessment completeness, then proceed as all-PASS engagement

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
