---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: high
chain_position: third
---

# Phase 02: RESPOND

## IDENTITY

**Agent:** `security` (active/tabletop) or `advisor` (review) — set at command layer.

**Phase-specific role:** Execute core response activities for the current mode. Active mode
focuses on real-time containment, investigation, and eradication. Tabletop mode runs the
exercise scenario through decision points and injects. Review mode reconstructs the incident
timeline and conducts root cause analysis.

**Additional constraints:** Read mode and framework from metadata.json before executing.
Execute only the block matching the current mode. Do not intermix mode blocks.

---

## INPUT CONTRACT

**Receives:**
- Mode from metadata.json (active/tabletop/review)
- Framework from metadata.json
- Incident ID and output directory path
- intake.md content (severity, scope, stakeholders, IOCs)

**Prerequisites:**
- intake.md exists in output directory
- metadata.json exists with mode and framework

**Source:** `skills/incident/phases/00-workflow.md` (via 01-intake.md completion)

---

## OBJECTIVE

**Goal:** Execute the mode-appropriate core response and produce RESPONSE-LOG.md plus the
mode-specific primary output file (TIMELINE.md or SCENARIO.md).

**Success criteria:**
- Mode-appropriate response steps executed
- RESPONSE-LOG.md written (all modes)
- TIMELINE.md written (active/review modes) OR SCENARIO.md written (tabletop mode)
- metadata.json updated with Phase 02 completion

**Failure criteria:**
- Mode cannot be read from metadata.json → Return to 00-workflow.md
- Active incident: containment cannot be defined → Escalate immediately to Incident Commander

---

## METHODOLOGY

**Active:** Speed matters but accuracy matters more. Poorly executed containment can destroy
evidence, alert the threat actor, or cause more damage than the incident itself. Document
every action before taking it. The RESPONSE-LOG.md is the legal record.

**Tabletop:** The goal is to surface gaps, not to run a perfect exercise. Push participants
with difficult injects. Capture every decision and rationale — the gaps are the output.

**Review:** Reconstruction must be evidence-based. Every timeline entry needs a source (log
line, ticket number, email timestamp). Avoid filling gaps with assumptions — mark unknowns
explicitly.

---

## EXECUTION

---

### [active] MODE: Containment, Investigation, Eradication

#### Step 1: Immediate Containment

**Tool:** Direct conversation (actions are performed by responders, not the AI)

Determine and document containment actions. For each action, capture:
- What action is proposed
- What the action will achieve
- What it will NOT preserve (evidence risk)
- Who is authorizing the action (must be Incident Commander or delegate)

**Containment options by incident type (propose appropriate options based on intake.md):**

Network isolation:
- Isolate affected host(s) from production network — preserve local disk, kill active sessions
- Block outbound C2 communication at firewall/proxy layer — list IOC IPs/domains from intake.md
- Disable compromised accounts immediately — list any accounts identified in intake

Ransomware-specific:
- Isolate affected endpoints from network immediately (prevent spread)
- Identify and isolate file shares accessible from affected hosts
- Snapshot affected systems before any remediation (preserve encryption artifacts for decryption)

Data exfiltration-specific:
- Identify and block outbound data paths (SFTP, cloud storage uploads, email forwarding rules)
- Preserve DLP logs, email gateway logs, proxy logs before log rotation

Credential compromise:
- Force password reset for identified compromised accounts
- Revoke active sessions and OAuth tokens
- Disable API keys associated with compromised credentials

Document each action in RESPONSE-LOG.md format as it is approved and executed.

**Expected output:** Containment actions documented and approved
**On failure:** Escalate to Incident Commander if containment cannot be defined

---

#### Step 2: Evidence Preservation

**Tool:** Direct conversation

Before any remediation, identify and preserve evidence:

Critical evidence types:
- Memory dumps of affected systems (before reboot or reimaging)
- Disk images (before remediation)
- Log files: OS logs, application logs, authentication logs, network flow logs
- Email and communication records related to incident
- Timeline of alerts and notifications (raw data, not summary)
- Network captures if available

Forensic chain of custody requirements:
- Document who collected what, when, and how
- Hash all collected artifacts (SHA-256)
- Store in a separate, write-once location

**Expected output:** Evidence preservation plan documented in RESPONSE-LOG.md
**On failure:** Note what could not be preserved and why

---

#### Step 3: Investigation

**Tool:** Direct conversation

Enumerate indicators of compromise (IOCs) and map the attack:

IOC categories to document:
- Network IOCs: C2 IPs, domains, URLs, ports, protocols
- Host IOCs: malware hashes, modified files, registry keys, scheduled tasks, services
- Account IOCs: compromised usernames, accounts created, privilege escalations
- Data IOCs: files accessed, exfiltrated, encrypted, or modified

Attack scope mapping:
- Patient zero: first system compromised
- Lateral movement: what other systems were accessed
- Persistence mechanisms: how did the threat actor maintain access
- Data accessed: what data was touched, modified, or exfiltrated

Timeline construction: Build chronological event log from available evidence.

**Expected output:** IOC list, attack scope map, preliminary TIMELINE.md populated
**On failure:** Document what is unknown and flag for external forensics if needed

---

#### Step 4: Eradication

**Tool:** Direct conversation

Remove the threat from the environment:

Eradication checklist:
- [ ] All malware and attacker tools removed from identified systems
- [ ] All persistence mechanisms removed (scheduled tasks, services, cron jobs, startup items)
- [ ] All compromised credentials rotated (users, service accounts, API keys, certificates)
- [ ] All backdoors and unauthorized accounts removed
- [ ] Patches applied to vulnerabilities exploited in this incident
- [ ] Systems validated clean (AV/EDR scan, integrity check)

**Warning:** Do not eradicate before evidence is preserved. Do not eradicate if forensics
investigation is still in progress.

**Expected output:** Eradication steps documented in RESPONSE-LOG.md
**On failure:** Note what could not be eradicated and escalate to appropriate team

---

### [tabletop] MODE: Scenario Execution and Decision Point Facilitation

#### Step 1: Scenario Setup

**Tool:** Direct conversation

Establish the exercise context with participants:

- Read scenario details from intake.md
- Present the opening inject to participants:
  ```
  OPENING INJECT:
  [Present the scenario as it would appear at detection time — alert details, initial
  indicator, what the on-call responder would see first]
  ```
- Confirm all participants understand their roles
- Note exercise objectives from intake.md

**Expected output:** Exercise running, participants engaged with opening inject

---

#### Step 2: Decision Point Facilitation

**Tool:** Direct conversation

Guide participants through structured decision points. For each decision point:

1. **Present the situation:** "It is T+{time}. You have just received {new information}."
2. **Ask the key questions:**
   - "What do you do first?"
   - "Who makes this decision?"
   - "Who do you notify and when?"
   - "What would you need to take this action?"
   - "What are the risks of this action?"
3. **Capture the answer:** Document the decision and rationale
4. **Note any gaps:** Process gaps, tool gaps, authority gaps, communication gaps

Required decision points (adapt to scenario):
- Initial escalation: when and to whom
- Containment decision: who authorizes, what threshold triggers it
- External notification: when does legal/privacy need to be looped in
- Customer/user communication: when and who approves the message
- Executive briefing: what triggers it, who delivers it
- Recovery authorization: who authorizes returning to production

---

#### Step 3: Inject Escalation

**Tool:** Direct conversation

Add complexity with timed injects. Present injects to surface additional gaps:

**Standard inject sequence (adapt to framework and scenario):**

T+30 min inject: "The CEO calls asking for an update. What do you tell them?"
T+1 hour inject: "A journalist has contacted your PR team asking about reports of an outage."
T+2 hour inject: "Legal counsel confirms this meets the notification threshold under {framework}."
T+4 hour inject: "A second affected system has been identified in a different business unit."
T+8 hour inject: "The threat actor has posted data samples on a dark web forum."

Use only the injects appropriate for the scenario severity and framework.

---

#### Step 4: After-Action Capture

**Tool:** Direct conversation

Before ending the exercise, capture:
- Decisions made at each point (what the team said they would do)
- Gaps identified (what the team did not know or could not do)
- Tool gaps (what tools they lacked or could not access)
- Process gaps (steps that had no defined owner or procedure)
- Communication gaps (who needed to be notified but wasn't in the plan)
- Time gaps (notification deadlines that would have been missed)

**Expected output:** Decision log and gap list captured for SCENARIO.md and RESPONSE-LOG.md

---

### [review] MODE: Incident Reconstruction and Root Cause Analysis

#### Step 1: Incident Reconstruction

**Tool:** Direct conversation + Read (existing documentation if available)

Gather evidence from the original incident:
- Existing incident tickets, SIEM alerts, log exports
- Communications (emails, Slack/Teams messages, incident bridge recordings)
- Change tickets, firewall rule changes, access logs
- Any existing incident reports or status updates

Construct the chronological timeline from evidence:
- Every entry needs a source (log reference, ticket number, communication reference)
- Mark entries as "confirmed" vs "inferred" vs "unknown"
- Identify gaps in the timeline

**Expected output:** Timeline draft with sourced entries

---

#### Step 2: Root Cause Analysis

**Tool:** Direct conversation

Apply 5 Whys analysis to identify root cause:

```
Problem statement: {one sentence description of the incident}

Why 1: Why did the incident occur?
  → {direct cause}

Why 2: Why did {direct cause} occur?
  → {underlying cause}

Why 3: Why did {underlying cause} exist?
  → {systemic cause}

Why 4: Why was {systemic cause} not prevented?
  → {control gap}

Why 5: Why did {control gap} exist?
  → {root cause}

Root Cause: {final root cause statement}
```

If the incident has multiple independent causes, apply 5 Whys to each.

---

#### Step 3: Control Failure Analysis

**Tool:** Direct conversation

For each phase of the incident, assess what controls existed and how they performed:

| Phase | Controls That Worked | Controls That Failed | Controls That Were Absent |
|-------|---------------------|---------------------|--------------------------|
| Prevention | | | |
| Detection | | | |
| Containment | | | |
| Eradication | | | |
| Recovery | | | |
| Communication | | | |

Document specific control failures with evidence. Avoid vague statements like "monitoring
failed" — identify the specific control, why it failed, and whether it was a design or
operational failure.

---

## Step 5 (all modes): Write Output Files

**Tool:** Write

**TIMELINE.md** (active/review modes):
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/TIMELINE.md`

```markdown
# Incident Timeline

**Incident ID:** {incident-id}
**Mode:** {active|review}
**Last Updated:** {YYYY-MM-DD hh:mm}

## Timeline

| Timestamp | Event | Source | Status |
|-----------|-------|--------|--------|
| {ISO 8601} | {event description} | {log/ticket/comm reference} | confirmed/inferred/unknown |
```

**SCENARIO.md** (tabletop mode only):
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/SCENARIO.md`

```markdown
# Exercise Scenario

**Exercise ID:** {incident-id}
**Date:** {YYYY-MM-DD}
**Participants:** {list}
**Objectives:** {list}

## Opening Inject

{scenario text as presented to participants}

## Inject Log

| Time | Inject | Participants' Response | Gaps Identified |
|------|--------|----------------------|-----------------|

## Decision Log

| Decision Point | Decision Made | Owner | Gaps |
|----------------|--------------|-------|------|
```

**RESPONSE-LOG.md** (all modes):
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/RESPONSE-LOG.md`

```markdown
# Response Log

**Incident ID:** {incident-id}
**Mode:** {active|tabletop|review}
**Last Updated:** {YYYY-MM-DD hh:mm}

## Actions Taken

| Timestamp | Action | Authorized By | Outcome | Notes |
|-----------|--------|--------------|---------|-------|

## Open Items

| Item | Owner | Priority | Status |
|------|-------|----------|--------|
```

**Update metadata.json** with Phase 02 completion timestamp and add new files to `files` array.

---

## OUTPUT CONTRACT

**Produces:**
- `TIMELINE.md` → `private/output/incident/{incident-id}-{YYYY-MM}/TIMELINE.md` (active/review)
- `SCENARIO.md` → `private/output/incident/{incident-id}-{YYYY-MM}/SCENARIO.md` (tabletop)
- `RESPONSE-LOG.md` → `private/output/incident/{incident-id}-{YYYY-MM}/RESPONSE-LOG.md` (all modes)
- `metadata.json` updated with Phase 02 completion

**Format:** Structured markdown with timestamped log tables

---

## NEXT

**On success:** → Proceed to Phase 03 (Communicate):

Load `skills/incident/phases/03-communicate.md` with:
- Mode from metadata.json
- Framework from metadata.json
- Incident ID and output directory path
- Severity from intake.md

**On failure:** → Document blocker in RESPONSE-LOG.md and escalate as appropriate

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Mode-appropriate response steps executed
- [ ] TIMELINE.md written (active/review) OR SCENARIO.md written (tabletop)
- [ ] RESPONSE-LOG.md written with actions documented
- [ ] metadata.json updated with Phase 02 completion
- [ ] Ready to proceed to Phase 03 (COMMUNICATE)

**Error recovery:**
- Active: containment cannot be defined → Escalate to Incident Commander immediately
- Tabletop: participants disengaged → Pause exercise, reset with simpler inject
- Review: evidence gaps → Mark timeline entries as inferred, flag for follow-up
- Write failure → Check path permissions; create directory if missing

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
