---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: medium
chain_position: second
---

# Phase 01: INTAKE

## IDENTITY

**Agent:** `security` (active/tabletop) or `advisor` (review) — set at command layer.

**Phase-specific role:** Gather incident context, classify severity, define scope, identify
stakeholders, select framework, and record mode and framework in metadata.json. This phase
sets the foundation for all subsequent phases.

**Additional constraints:** Do not begin response actions in this phase. Focus entirely on
understanding the situation, documenting what is known, and preparing the intake record.
If context is insufficient, ask — do not assume scope or severity.

---

## INPUT CONTRACT

**Receives:**
- Mode: `active` | `tabletop` | `review` (from 00-workflow.md)
- Optional: incident ID, severity hint, framework hint, context from command layer
- Output directory path: `private/output/incident/{incident-id}-{YYYY-MM}/`

**Prerequisites:**
- Mode confirmed by 00-workflow.md
- Output directory path known

**Source:** `skills/incident/phases/00-workflow.md`

---

## OBJECTIVE

**Goal:** Document sufficient context to execute the incident workflow, classify severity,
select framework, identify stakeholders, and record mode and framework in metadata.json.

**Success criteria:**
- Incident context gathered (affected systems, what is known, timeline)
- Severity classification assigned (P1–P4)
- Framework selected
- Scope defined (what is in and out of scope for this response)
- Stakeholders identified
- intake.md written to output directory
- metadata.json written with mode, framework, incident ID, and severity

**Failure criteria:**
- User provides no context and declines to clarify → STOP
- Mode cannot be confirmed → Return to 00-workflow.md

---

## METHODOLOGY

**Intake is about capturing state, not acting.** In active mode, resist the urge to recommend
containment steps here — that belongs in Phase 02. Gather what is known, classify the
severity accurately, and set the scope.

**Severity accuracy matters.** Overclassifying (treating P3 as P1) wastes resources and
creates unnecessary regulatory exposure. Underclassifying (treating P1 as P3) delays
appropriate response. Use the PIRA scale below.

**Framework selection drives Phase 03 obligations.** If the affected system handles PHI
(HIPAA), card data (PCI DSS), or federal systems (FedRAMP), select the correct framework
now — notification deadlines begin at discovery time.

---

## EXECUTION

### Step 1: Gather Incident Context

**Tool:** Direct conversation

Collect context based on mode:

**[active]**
Gather what is known RIGHT NOW:
- What system, service, or data is affected?
- How was the incident detected? (alert, user report, third party, automated)
- What is the estimated start time or detection time?
- What has already been done? (anything isolated, credentials changed?)
- Is the threat actor still active, or is the threat contained?
- Any initial indicators of compromise (IOCs)?

**[tabletop]**
Set up the exercise:
- Who is participating? (names and roles)
- What is the exercise scenario? (brief description)
- What are the exercise objectives? (test notification chain, test escalation, etc.)
- What framework or compliance context applies to the scenario?
- What time window is allocated for the exercise?

**[review]**
Gather historical context:
- Which incident is being reviewed? (ID, date range, brief description)
- What systems or data were affected?
- How was the incident detected and by whom?
- When was it contained and when was it declared resolved?
- Were there any regulatory notifications made?
- What documentation exists from the active response? (tickets, logs, emails)

**Expected output:** Context sufficient for severity classification and scope definition
**On failure:** Ask for minimum viable context: system affected, what happened, when

---

### Step 2: Classify Severity

**Tool:** Direct analysis

Apply the PIRA severity scale. Assign the highest applicable severity:

**P1 — Critical**
- Active breach with confirmed data exfiltration (or exfiltration cannot be ruled out)
- Active ransomware encryption in progress
- Complete service outage with security indicators (not routine failure)
- Active threat actor with persistent access to production systems
- Regulatory notification deadline already running (HIPAA, PCI DSS, FedRAMP)

**P2 — High**
- Suspected breach — unauthorized access confirmed but scope unknown
- Active threat actor detected, lateral movement possible
- Significant service degradation with security indicators
- Credential compromise with potential production access
- Ransomware indicators without confirmed execution

**P3 — Medium**
- Anomalous activity flagged — potential compromise, investigation needed
- Isolated policy violation with no confirmed breach
- Limited impact, one system, no confirmed data exposure
- Suspicious but unconfirmed external communication

**P4 — Low**
- Policy violation with no security impact
- Confirmed false positive requiring documentation
- Phishing attempt with no confirmed click or compromise
- Routine security event requiring documentation only

**[active]**: Classify based on current confirmed state. Note "severity may escalate" if investigation is ongoing.
**[tabletop]**: Assign severity to the scenario for the exercise.
**[review]**: Classify the peak severity reached during the incident (what it was at its worst).

**Expected output:** Severity assigned (P1/P2/P3/P4) with justification
**On failure:** Default to P2 (High) and note that classification is pending investigation

---

### Step 3: Select Framework

**Tool:** Direct conversation

Present framework options and confirm selection:

```
1. NIST SP 800-61r3 — Preparation / Detection / Containment / Eradication / Recovery / Post-Incident
   Use when: General IR, federal-adjacent, or when no specific regulatory framework applies.

2. ISO 27001 — Annex A.16 incident management procedures
   Use when: ISO 27001 certified or pursuing certification; requires evidence of controlled handling.

3. PCI DSS — Incident response requirements, forensics preservation, notification timelines
   Use when: Incident involves cardholder data, payment systems, or card-processing infrastructure.

4. HIPAA — Breach Assessment (4-factor test), 60-day notification rule
   Use when: Incident involves PHI (Protected Health Information) or covered entity/BA systems.

5. FedRAMP — US-CERT reporting, FISMA incident handling requirements
   Use when: Incident affects FedRAMP-authorized systems, federal data, or federal contractors.

6. General — Standard IR lifecycle without framework-specific obligations
   Use when: No specific regulatory framework applies; use for internal incidents or tabletop exercises
   without a compliance context.
```

**[active]**: "Which framework governs this system? Incorrect selection delays regulatory notifications."
**[tabletop]**: "Which framework should this exercise simulate?"
**[review]**: "Which framework governed the original incident?"

**Expected output:** Framework selected (1–6)
**On failure:** Default to General (6) and note that framework should be confirmed

---

### Step 4: Define Scope and Stakeholders

**Tool:** Direct conversation

Define incident scope:
- **In scope:** Systems, data, users, timeframes included in this response
- **Out of scope:** Systems or data explicitly excluded (with rationale)
- **Uncertainty areas:** What is not yet known and must be investigated

Identify stakeholders by role:
- **Incident Commander** (decision authority for response)
- **Technical Lead** (owns investigation and containment)
- **Legal/Privacy** (needed if notification obligations exist)
- **Executive Sponsor** (escalation point for P1/P2)
- **Communications Lead** (internal and external messaging)
- **Regulatory Contact** (if applicable)

**[tabletop]**: Use exercise participants as stakeholders.
**[review]**: Document actual stakeholders from the incident — who was involved, who should have been.

**Expected output:** Scope defined, stakeholders identified by role
**On failure:** Document "TBD" and flag for Phase 02 investigation

---

### Step 5: Write intake.md

**Tool:** Write
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/intake.md`

```markdown
# Incident Intake

**Incident ID:** {incident-id}
**Date:** {YYYY-MM-DD}
**Mode:** {active|tabletop|review}
**Severity:** {P1|P2|P3|P4} — {Critical|High|Medium|Low}
**Framework:** {selected framework}
**Status:** {Active Investigation | Exercise | Post-Incident Review}

## Summary

{1-3 sentence description of the incident or scenario}

## Detection

- **Detected By:** {who or what detected it}
- **Detection Method:** {alert type, user report, third party}
- **Detection Time:** {timestamp or "unknown"}
- **Estimated Start Time:** {timestamp or "unknown — under investigation"}

## Affected Systems / Scope

### In Scope
- {system/service 1}
- {data type 1}

### Out of Scope
- {explicitly excluded item}

### Uncertain (Investigation Required)
- {unknown item}

## Stakeholders

| Role | Name | Contact |
|------|------|---------|
| Incident Commander | {name or TBD} | {contact} |
| Technical Lead | {name or TBD} | {contact} |
| Legal/Privacy | {name or TBD} | {contact} |
| Executive Sponsor | {name or TBD} | {contact} |
| Communications Lead | {name or TBD} | {contact} |

## Initial IOCs (active mode)

- {IOC 1 — IP, hash, domain, etc.}

## Exercise Participants (tabletop mode)

| Name | Role | Department |
|------|------|------------|

## Notes

{Additional context, open questions, or flags for Phase 02}
```

**Expected output:** intake.md written to output directory
**On failure:** Write minimal intake.md with available data; flag incomplete fields

---

### Step 6: Write metadata.json

**Tool:** Write
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/metadata.json`

```json
{
  "incident_id": "{incident-id}",
  "mode": "{active|tabletop|review}",
  "framework": "{selected framework}",
  "severity": "{P1|P2|P3|P4}",
  "status": "active",
  "created": "{YYYY-MM-DDThh:mm:ssZ}",
  "output_directory": "private/output/incident/{incident-id}-{YYYY-MM}/",
  "phases": {
    "01_intake": { "status": "complete", "timestamp": "{YYYY-MM-DDThh:mm:ssZ}" },
    "02_respond": { "status": "pending" },
    "03_communicate": { "status": "pending" },
    "04_recover": { "status": "pending" },
    "05_deliver": { "status": "pending" }
  },
  "files": ["intake.md", "metadata.json"]
}
```

**Expected output:** metadata.json written. This is the source of truth for mode and framework
in all subsequent phases.
**On failure:** Note failure — all subsequent phases will need mode passed explicitly

---

## OUTPUT CONTRACT

**Produces:**
- `intake.md` → `private/output/incident/{incident-id}-{YYYY-MM}/intake.md`
- `metadata.json` → `private/output/incident/{incident-id}-{YYYY-MM}/metadata.json`

**Format:** Structured markdown intake document; JSON metadata file

---

## NEXT

**On success:** → Proceed to Phase 02 (Respond):

Load `skills/incident/phases/02-respond.md` with:
- Mode from metadata.json
- Framework from metadata.json
- Incident ID and output directory path
- Context from intake.md

**On failure (insufficient context):** → Ask user for missing information, retry this phase

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Incident context gathered (system, what happened, detection time)
- [ ] Severity classified (P1–P4) with justification
- [ ] Framework selected
- [ ] Scope defined (in/out/uncertain)
- [ ] Stakeholders identified by role
- [ ] intake.md written to output directory
- [ ] metadata.json written with mode and framework
- [ ] Ready to proceed to Phase 02 (RESPOND)

**Error recovery:**
- Insufficient context → Ask for minimum viable context
- Cannot classify severity → Default to P2 and flag for escalation
- Framework unclear → Default to General and flag for confirmation
- Write failure → Check path permissions; create directory if missing

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
