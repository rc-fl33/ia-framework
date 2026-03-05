---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: high
chain_position: fourth
---

# Phase 03: COMMUNICATE

## IDENTITY

**Agent:** `security` (active/tabletop) or `advisor` (review) — set at command layer.

**Phase-specific role:** Draft internal escalation communications, assess regulatory
notification obligations, produce required regulatory notices, and prepare external
statements. All framework notification requirements are defined inline — no external
references are used.

**Additional constraints:** Read mode and framework from metadata.json. Notification
deadlines are not advisory — in active mode they are legal obligations with penalties for
missed timelines. Compute deadlines from the detection timestamp in intake.md.

---

## INPUT CONTRACT

**Receives:**
- Mode from metadata.json (active/tabletop/review)
- Framework from metadata.json
- Incident ID and output directory path
- Severity and detection timestamp from intake.md
- Scope and stakeholders from intake.md
- Response status from RESPONSE-LOG.md

**Prerequisites:**
- RESPONSE-LOG.md exists in output directory
- intake.md exists with detection time and scope
- metadata.json exists with mode and framework

**Source:** `skills/incident/phases/00-workflow.md` (via 02-respond.md completion)

---

## OBJECTIVE

**Goal:** Produce all required communications artifacts — internal escalations, regulatory
notifications (if applicable), and external statements — with accurate deadlines and
appropriate language for the selected framework.

**Success criteria:**
- Internal escalation communications drafted (all modes)
- Regulatory notification obligations assessed for selected framework
- Required notices drafted with accurate deadlines (active/review where applicable)
- External statement drafted if public disclosure is required
- COMMUNICATIONS.md written with all artifacts and regulatory tracker
- metadata.json updated with Phase 03 completion

**Failure criteria:**
- Framework requires notification but detection timestamp is unknown → Flag as urgent;
  use "date unknown" and note that deadline cannot be computed

---

## METHODOLOGY

**Notification Quick Reference** — Surface this at the start of Step 2 based on framework in metadata.json:

| Framework | Notify | Deadline | Trigger |
|-----------|--------|---------|---------|
| GDPR | Supervisory authority | 72 hours from discovery | Personal data breach |
| GDPR | Data subjects | Without undue delay | High risk to individuals |
| HIPAA | HHS Office for Civil Rights | 60 days from discovery | PHI breach confirmed or not ruled out |
| HIPAA | Affected individuals | 60 days from discovery | PHI breach |
| HIPAA | Media (500+ in state) | 60 days from discovery | PHI breach ≥500 in state |
| PCI-DSS | Card brands + acquirer | Immediately | CHD or card infrastructure incident |
| FedRAMP (major) | US-CERT / CISA | 1 hour from discovery | High-impact system or CUI compromise |
| FedRAMP (standard) | US-CERT / CISA | 72 hours from discovery | Standard incident categories |
| ISO 27001 | Internal per A.5.24 plan | Per plan | Any information security incident |
| ISO 27001 | Authorities per A.5.5 | When legally required | Breach with legal notification obligation |
| AIUC-1 | AI Risk Officer | Immediate | AI system failure, poisoning, or harm |
| AIUC-1 | External per applicable law | Varies | EU AI Act high-risk AI incidents |
| General | Leadership | 24 hours | P1/P2 incidents |

**Notification deadlines start at discovery, not at confirmation.** For HIPAA, GDPR, PCI DSS,
and FedRAMP, the clock starts when the incident is discovered — even if the full scope is not
yet known. Draft notifications with best available information and update before sending.

**Legal and Privacy must be looped in early.** Any communication that could be used in a
regulatory proceeding, lawsuit, or insurance claim must be reviewed by Legal before sending.
Flag all external communications as "requires Legal review."

**In tabletop mode:** Decisions are simulated. Identify who approves each communication,
what language they would use, and how long it would take. Surface approval bottlenecks.

---

## EXECUTION

### Step 1: Internal Escalation

**Tool:** Direct conversation + Write

Draft internal escalation communications based on severity from intake.md and mode.

**[active]**

Draft the following internal communications (adapt based on P-level):

P1/P2 — Executive Brief (immediate):
```
SUBJECT: [P1 INCIDENT] {incident type} — {affected system} — {YYYY-MM-DD hh:mm}

This is an active security incident. This brief is for situational awareness only.
Detailed response is in progress.

What happened: {1 sentence}
What is affected: {systems/data in scope}
Current status: {containment status}
What we are doing: {current actions}
Next update: {timeframe}

Incident Commander: {name}
Bridge/Channel: {location}
```

P1 — Board/Regulatory Awareness (within 4 hours for P1):
```
SUBJECT: [URGENT] Security Incident Notification — {YYYY-MM-DD}

[Company] has identified a {type} security incident affecting {scope}.
The incident response team is actively engaged.

Details will be provided in a follow-up communication within {timeframe}.
```

P2/P3 — Department Head Notification:
```
SUBJECT: Security Incident — {affected team/system} — {YYYY-MM-DD}

A security incident has been identified affecting {system/service}.
Your team's systems are [affected / not affected].
[Actions your team needs to take, if any.]

Point of contact: {IR team contact}
```

**[tabletop]**

Simulate the communication decision process:
- "At this point in the scenario, who sends the executive brief? What does it say?"
- "Who approves the language before it goes out?"
- "How long does that approval take? Is there a template?"
- Document decisions and identify gaps in the communication playbook.

**[review]**

Document the communications that were actually sent during the incident:
- What was sent, to whom, when
- Was the language appropriate? Too alarming? Not alarming enough?
- Were any required communications missed or delayed?
- What approval process was used?

---

### Step 2: Assess Regulatory Notification Obligations

**Tool:** Direct analysis

Apply framework-specific rules to determine notification obligations. All rules are defined
inline below.

---

**HIPAA (Health Insurance Portability and Accountability Act):**

Applies when: Incident involves PHI (Protected Health Information) held by a Covered Entity
or Business Associate.

4-Factor Breach Assessment (presumption of breach unless all four factors are low):
1. Nature and extent of PHI involved (types and amount of data)
2. Who used or accessed the PHI (could unauthorized individuals identify individuals?)
3. Whether PHI was actually acquired or viewed (or is risk low based on circumstances?)
4. Extent to which risk has been mitigated

If breach is confirmed or cannot be ruled out:
- **HHS (Office for Civil Rights):** Notify within 60 days of discovery
  - Less than 500 individuals: Annual report to HHS (by March 1 following calendar year)
  - 500 or more individuals: Notify HHS within 60 days AND notify media in the state
- **Affected Individuals:** Notify within 60 days of discovery (written notice by first-class
  mail; email if individual has agreed)
- **Media (if 500+ in a state/jurisdiction):** Prominent media outlet in the state; within 60 days

Notification content requirements:
- Description of what happened
- Types of information involved
- Steps individuals should take to protect themselves
- What the organization is doing to investigate and mitigate
- Contact information for individuals to ask questions

**Business Associate Notification Chain:**

If the incident occurs at a **Business Associate** (not the Covered Entity):
- The BA must notify the Covered Entity per the Business Associate Agreement (BAA)
- BAA typically specifies 24-60 day notification window (check the BAA; default to 60 days if unspecified)
- The CE's 60-day HHS notification clock starts when the **CE discovers** the breach (not when the BA discovers it)
- The BA's notification to the CE is separate from — and must precede — any CE regulatory notification

If the incident occurs at a **Covered Entity**:
- Apply the standard 4-Factor Assessment and 60-day notification timeline above

If you are unsure whether the organization is a CE or BA: ask explicitly. This distinction materially changes the notification chain and deadline computation.

---

**GDPR (General Data Protection Regulation):**

Applies when: Incident involves personal data of EU/EEA individuals.

- **Supervisory Authority:** Notify within 72 hours of becoming aware of the breach
  - Use the supervisory authority for the EU member state where the controller is established
  - If notification cannot be made within 72 hours, include reasons for delay
- **Affected Individuals:** Notify without undue delay if the breach is "likely to result in
  a high risk to the rights and freedoms" of individuals
  - High risk indicators: financial data, health data, location data, special category data,
    data that could lead to identity theft, discrimination, or significant harm

Notification content (to supervisory authority):
- Nature of the breach
- Categories and approximate number of data subjects affected
- Categories and approximate number of records affected
- Name and contact details of Data Protection Officer
- Likely consequences of the breach
- Measures taken or proposed to address the breach

---

**PCI DSS (Payment Card Industry Data Security Standard):**

Applies when: Incident involves cardholder data (CHD) or card-processing infrastructure.

- **Card Brands (Visa, Mastercard, Amex, Discover):** Notify immediately upon discovery
  - Each brand has its own IR reporting portal/process
  - Preserve forensic evidence before any remediation
- **Acquirer (Merchant bank):** Notify immediately upon discovery
- **Forensic Investigator (PFI — PCI Forensic Investigator):** Engage within 24 hours for
  significant incidents (acquirer/brand will direct this)

Forensic preservation requirements:
- Do not power off compromised systems without forensic authorization
- Preserve all logs: POS logs, payment application logs, network logs
- Document chain of custody for all collected evidence
- Do not reinstall or reimage before forensic investigation is complete

---

**FedRAMP / FISMA:**

Applies when: Incident affects a FedRAMP-authorized cloud system, federal information
system, or federal contractor systems with CUI (Controlled Unclassified Information).

Incident categories (NIST SP 800-61r3 / US-CERT taxonomy):
- Category 0 (Practice/Exercise): No notification required
- Category 1 (Unauthorized Access): Major = 1 hour; Standard = 72 hours
- Category 2 (Denial of Service): Major = 1 hour; Standard = 72 hours
- Category 3 (Malicious Code): Major = 1 hour; Standard = 72 hours
- Category 6 (Investigation): 72 hours

**Major incident threshold:** Significant exfiltration, system compromise, or denial of
service affecting a High-impact federal system or CUI.

- **US-CERT (Cybersecurity and Infrastructure Security Agency):**
  - Major incident: Notify within 1 hour of discovery
  - Standard incident: Notify within 72 hours of discovery
  - Report via: https://www.cisa.gov/report (or US-CERT incident portal)
- **Agency CIO/CISO and ISSO:** Notify immediately for major incidents
- **OMB (Office of Management and Budget):** Notify within 7 days for major incidents

---

**ISO 27001:**

Applies when: Organization is ISO 27001 certified or following Annex A controls (2022 edition).

ISO 27001 does not prescribe external notification timelines (those come from applicable
law). ISO 27001:2022 Annex A incident management controls require:
- A.5.24: Planning and preparation for information security incident management
- A.5.25: Assessment and decision on information security events
- A.5.26: Response to information security incidents
- A.5.27: Learning from information security incidents
- A.5.28: Collection of evidence
- A.5.5: Contact with authorities (defines when to contact law enforcement)
- A.5.6: Contact with special interest groups

Internal notification: Per A.5.24 incident management plan (no ISO-mandated external deadline).
Authorities: Per A.5.5 process — contact when legally required or operationally necessary.
Citation: ISO 27001:2022 A.5.24–A.5.28

For external notifications: apply any applicable law (GDPR, national data protection law).

Note: Organizations using ISO 27001:2013 should reference A.16.1.x controls (equivalent
but numbered differently).

**ISO 27035 Incident Classification (ISO 27035-1:2023):**

ISO 27035 is the incident-management-specific standard under the ISO 27001 family.
Organizations certified or aligning to ISO 27001 should use ISO 27035 classification:

| Category | Description | Examples |
|----------|-------------|---------|
| IEC-1 | Malicious code | Ransomware, worms, trojans |
| IEC-2 | Unauthorized access | Account compromise, privilege escalation |
| IEC-3 | Denial of service | DDoS, resource exhaustion |
| IEC-4 | Information loss | Data exfiltration, accidental disclosure |
| IEC-5 | Fraud | Financial fraud, identity theft |
| IEC-6 | Physical | Hardware theft, unauthorized physical access |

ISO 27035 also defines a five-stage incident management process (Plan → Detect → Assess →
Respond → Learn) that maps to this skill's phases. The "Assess" stage — determining if an
event constitutes a reportable breach — is addressed by the 4-Factor Assessment (HIPAA),
72-hour determination (GDPR), and the incident category determination (FedRAMP) in this phase.

---

**AIUC-1 (AI Unified Controls):**

Applies when: Incident affects an AI system, model, training pipeline, or AI-dependent service.

AIUC-1 does not prescribe external regulatory notification timelines. Internal requirements:
- E.6.1: Activate AI incident response plan (pre-defined in E.6.x controls)
- E.6.2: Assess whether the incident constitutes an AI-specific harm (model poisoning,
  adversarial attack, unexpected output causing harm, data exfiltration via inference)
- E.6.3: Escalate AI incidents to the AI Risk Officer and relevant system owners
- E.6.4: Preserve model artifacts and input/output logs before any remediation
- E.6.5: Assess whether the AI failure triggers obligations under applicable law (EU AI Act,
  product liability, GDPR for AI-driven decisions affecting individuals)

Citation: AIUC-1 Function E: Accountability, Controls E.6.x

Additional notification considerations for AI incidents:
- EU AI Act (if applicable): High-risk AI systems have incident reporting obligations to
  national market surveillance authorities; timelines depend on severity
- Product liability: AI-caused harm to individuals may trigger recall or liability obligations
- Insurance: Notify cyber/product liability insurer for significant AI incidents

**General (no specific framework):**

Best-practice notification guidance:
- Notify affected users within a reasonable timeframe (typically 72 hours)
- Notify leadership and board within 24 hours for significant incidents
- Consider voluntary disclosure to industry peers (ISACs) for threat intelligence sharing

---

### Step 3: Draft Required Notifications

**Tool:** Write (if notifications are required)

For each required notification identified in Step 2, draft the notification:

**Template for regulatory notification:**
```
TO: {regulator/authority name}
FROM: {company name and contact}
DATE: {YYYY-MM-DD}
RE: Security Incident Notification — {brief description}

[Company name], a {covered entity/business associate/cloud service provider}, hereby
provides notification of a security incident as required by {HIPAA/GDPR/PCI DSS/FedRAMP}.

Incident Description:
{1-2 paragraph description of the incident, what data was involved, when it was discovered}

Scope:
{approximate number of individuals/records affected}

Actions Taken:
{containment, eradication, remediation steps taken}

Mitigation for Affected Individuals:
{credit monitoring, password resets, access revocation, etc.}

Contact:
{Privacy Officer/DPO/ISSO name, title, email, phone}
```

Flag each draft as: DRAFT — REQUIRES LEGAL REVIEW BEFORE SENDING

**Expected output:** Notification drafts written to COMMUNICATIONS.md
**On failure:** Note which notifications are required but could not be drafted; flag for Legal

---

### Step 4: Draft External Statement (if required)

**Tool:** Direct conversation

Assess whether public statement is required:
- P1 with confirmed data exfiltration affecting customers/users → Yes
- Media inquiry received → Yes
- Breach notification to customers required → Yes
- P3/P4 with no customer impact → No

If required, draft holding statement:
```
[Company name] is aware of a security incident that may have affected [data type/users].
We are actively investigating and have taken immediate steps to contain the incident.
The security and privacy of our customers is our highest priority.

We are working with [law enforcement / regulatory authorities] and will provide updates
as our investigation progresses. Affected individuals will be notified directly.

For questions, contact: {communications contact}
```

Flag as: DRAFT — REQUIRES LEGAL AND EXECUTIVE REVIEW BEFORE RELEASE

---

### Step 5: Write COMMUNICATIONS.md

**Tool:** Write
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/COMMUNICATIONS.md`

```markdown
# Communications Log

**Incident ID:** {incident-id}
**Mode:** {active|tabletop|review}
**Framework:** {framework}
**Last Updated:** {YYYY-MM-DD hh:mm}

## Regulatory Notification Assessment

| Framework | Obligation | Deadline | Status |
|-----------|-----------|---------|--------|
| {HIPAA/GDPR/PCI DSS/FedRAMP} | {what must be done} | {computed deadline} | pending/sent/N-A |

## Regulatory Notification Deadlines

| Regulation | Notify | Deadline | Detection Date | Deadline Date |
|------------|--------|---------|----------------|---------------|
| HIPAA — HHS | Office for Civil Rights | 60 days | {date} | {+60 days} |
| HIPAA — Individuals | Affected individuals | 60 days | {date} | {+60 days} |
| GDPR — SA | Supervisory authority | 72 hours | {date} | {+72 hours} |
| PCI DSS | Card brands + acquirer | Immediate | {date} | NOW |
| FedRAMP (major) | US-CERT | 1 hour | {date} | {+1 hour} |
| FedRAMP (standard) | US-CERT | 72 hours | {date} | {+72 hours} |

(Include only rows applicable to selected framework)

## Notification Drafts

### [Regulator/Audience Name] — DRAFT — REQUIRES LEGAL REVIEW

{draft notification text}

---

## Internal Communications Sent

| Date | Audience | Subject | Sender | Notes |
|------|----------|---------|--------|-------|

## External Statement

{draft statement text, or N/A}

## Open Items

| Item | Owner | Deadline | Status |
|------|-------|---------|--------|
```

**Update metadata.json** with Phase 03 completion timestamp.

---

## OUTPUT CONTRACT

**Produces:**
- `COMMUNICATIONS.md` → `private/output/incident/{incident-id}-{YYYY-MM}/COMMUNICATIONS.md`
- `metadata.json` updated with Phase 03 completion

**Format:** Structured markdown with regulatory tracker tables and notification drafts

---

## NEXT

**On success:** → Proceed to Phase 04 (Recover):

Load `skills/incident/phases/04-recover.md` with:
- Mode from metadata.json
- Framework from metadata.json
- Incident ID and output directory path
- Regulatory notification status from COMMUNICATIONS.md

**On failure:** → Document blocker in COMMUNICATIONS.md and escalate to Legal

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Internal escalation communications drafted (all modes)
- [ ] Regulatory notification obligations assessed for selected framework
- [ ] Required notification drafts written (if applicable)
- [ ] External statement drafted (if required)
- [ ] COMMUNICATIONS.md written with tracker table
- [ ] metadata.json updated with Phase 03 completion
- [ ] Ready to proceed to Phase 04 (RECOVER)

**Error recovery:**
- Detection timestamp unknown → Use "date unknown"; note deadline cannot be computed; escalate to Legal immediately
- Framework unclear → Apply most restrictive applicable framework
- Notification required but Legal unavailable → Document obligation; flag urgency
- Write failure → Check path permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
