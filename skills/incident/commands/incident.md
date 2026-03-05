---
name: incident
description: Incident response — active IR documentation, tabletop exercise facilitation, or post-incident review. Mode determines agent selection before delegation.
domain: incident
skill: incident
agent: security
model: sonnet
complexity: high
mode: multi-mode
chain_position: first
---

# /incident — Incident Response Command

## IDENTITY

**Agent:** Base Claude (orchestrator — mode determines agent before delegation)

**Role:** Parse mode from user invocation, confirm intent and context, then delegate to the
correct agent (security for active/tabletop, advisor for review) with the full incident
context. The selected agent executes all 5 phases — no mid-workflow agent switching.

**Note:** This command is a pure router. It does not execute phases directly. Mode selection
at this layer is irreversible for the workflow session.

---

## INPUT CONTRACT

**Receives:**
- User invocation: `/incident [mode]` with optional context
- Mode: `active` | `tabletop` | `review` (default: `active` if omitted)
- Optional: incident ID, severity hint, framework, scenario description

**Required:**
- At least one of: mode flag, incident description, or scenario context

**Source:** User invocation (slash command)

---

## OBJECTIVE

**Goal:** Route incident request to the correct agent with full context so the 5-phase
incident workflow executes in the right mode.

**Success criteria:**
- Mode parsed correctly
- Existing work checked
- Intent and context confirmed with user
- Correct agent delegated (security for active/tabletop; advisor for review)

**Failure criteria:**
- Mode unrecognizable and user declines to clarify → Default to `active` with confirmation
- User invocation clearly misdirected (needs /advisory or /harden instead) → Redirect

---

## METHODOLOGY

Mode selection drives everything. The security agent handles live threats and exercises where
adversarial thinking is required. The advisor agent handles retrospective analysis where
objective post-mortem reasoning is required. Never switch agents mid-workflow.

Check for existing work before delegating. If output directory exists for this incident ID,
the user may be resuming. Ask before creating a new session.

---

## EXECUTION

### Step 1: Parse Mode

**Tool:** Direct analysis

Extract mode from user invocation:
- Explicit flag: `active`, `tabletop`, `review`
- Contextual signal: "live incident" or "breach detected" → `active`; "exercise" or "drill" → `tabletop`; "lessons learned" or "post-incident" or "PIR" → `review`
- Default if none detected: `active`

Also extract:
- Incident ID (if provided, e.g. `incident-2026-01-data-breach`)
- Severity hint (P1/P2/P3/P4 if provided)
- Framework hint (HIPAA, PCI DSS, FedRAMP, NIST, ISO, General — if mentioned)
- Scenario description (tabletop mode)

**Expected output:** Mode confirmed, context variables extracted
**On failure:** Ask user: "Which mode — active IR, tabletop exercise, or post-incident review?"

---

### Step 2: Check for Existing Work

**Tool:** Glob
**Pattern:** `private/output/incident/*`

Scan for existing incident directories. If incident ID was provided, check specifically for
`private/output/incident/{incident-id}-*`.

If a matching directory exists:
- Inform user: "Found existing work for {incident-id}. Resume or start fresh?"
- If resuming: load 00-workflow.md with the existing output directory path
- If fresh: use new YYYY-MM suffix

**Expected output:** Fresh start or resume decision
**On failure:** Default to fresh start

---

### Step 3: Confirm Intent and Context

**Tool:** Direct conversation

Brief confirmation with the user:

For `active`:
- "Confirmed: active incident response. What system or service is affected?"
- Collect: affected system, what is known, estimated start time

For `tabletop`:
- "Confirmed: tabletop exercise. What scenario or inject should we open with?"
- Collect: scenario name, participants, objectives

For `review`:
- "Confirmed: post-incident review. What incident are we reviewing?"
- Collect: incident ID or description, approximate date, how it was resolved

**Expected output:** Context sufficient to populate Phase 01 intake
**On failure:** Proceed with minimal context; Phase 01 will gather specifics

---

### Step 4: Delegate to Appropriate Agent

**Tool:** Task delegation

Generate incident ID if not provided: `incident-{YYYY-MM-DD}-{short-descriptor}`
Generate output path: `private/output/incident/{incident-id}-{YYYY-MM}/`

```
[active or tabletop]:
Task(subagent_type="security", prompt="Execute incident skill.\n\nMode: {active|tabletop}\nIncident ID: {id}\nFramework: {framework or 'to be selected in Phase 01'}\nContext: {context gathered in Step 3}\n\nLoad skills/incident/phases/00-workflow.md\n\nOutput: private/output/incident/{incident-id}-{YYYY-MM}/")

[review]:
Task(subagent_type="advisor", prompt="Execute incident skill.\n\nMode: review\nIncident ID: {id}\nFramework: {framework or 'to be selected in Phase 01'}\nContext: {context gathered in Step 3}\n\nLoad skills/incident/phases/00-workflow.md\n\nOutput: private/output/incident/{incident-id}-{YYYY-MM}/")
```

**Expected output:** Correct agent begins 5-phase workflow
**On failure:** Load `skills/incident/phases/00-workflow.md` directly with mode context

---

## OUTPUT CONTRACT

**Produces:**
- Delegation to security or advisor agent (no files created by this command)
- Output directory created at: `private/output/incident/{incident-id}-{YYYY-MM}/`

**Final output (after all 5 phases complete):**
```
private/output/incident/{incident-id}-{YYYY-MM}/
├── intake.md
├── TIMELINE.md           (active/review) | SCENARIO.md (tabletop)
├── RESPONSE-LOG.md
├── COMMUNICATIONS.md
├── LESSONS-LEARNED.md
├── RECOVERY-PLAN.md      (active/review only)
├── INCIDENT-REPORT.md
├── ACTION-ITEMS.md
└── metadata.json
```

---

## NEXT

**On success:** → Delegate to agent. Workflow handles all 5 phases.

**On existing work found:** → Ask user to resume or start fresh. Load 00-workflow.md accordingly.

**On unknown mode:** → Default to `active` with confirmation: "Defaulting to active incident
response mode. Correct?"

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Mode parsed (active, tabletop, or review)
- [ ] Existing work checked
- [ ] Intent and context confirmed
- [ ] Correct agent delegated

**Error recovery:**
- Unknown mode → Default to active with user confirmation
- Misdirected to /advisory → Redirect with explanation
- Delegation fails → Load 00-workflow.md directly in the correct agent context

---

## Usage

```bash
# Active incident (default)
/incident active
/incident active ransomware-detected, severity=P1

# Active with framework context
/incident active "database breach suspected", framework=HIPAA

# Tabletop exercise
/incident tabletop
/incident tabletop "Supply chain attack scenario"

# Tabletop with framework
/incident tabletop "Ransomware exercise", framework=NIST

# Post-incident review
/incident review
/incident review incident-2026-01-data-breach

# Minimal invocation (defaults to active)
/incident
```

## When to Use

**Use /incident active when:**
- Breach or compromise detected or suspected
- Ransomware, malware, or unauthorized access in progress
- Security-relevant service outage
- Data exfiltration detected

**Use /incident tabletop when:**
- Scheduled IR exercise or drill
- Team training on IR procedures
- Pre-audit preparation
- Testing notification and escalation chains

**Use /incident review when:**
- Incident has been resolved and PIR is required
- Lessons learned must be formally documented
- Compliance requires post-incident documentation
- Program improvements need to be identified

## Related Commands

- `/risk-assess` — Proactive risk identification (pre-incident)
- `/harden` — System hardening to reduce attack surface
- `/sec-review` — Architecture security review
- `/advisory` — Quick security guidance

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
