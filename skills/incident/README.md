# /incident — Incident Response Skill

Incident response documentation, tabletop exercise facilitation, and post-incident review
across six compliance frameworks with inline regulatory notification timelines.

---

## Purpose

The `/incident` skill supports the full incident response lifecycle in three distinct modes.
It is a standalone GRC skill — it carries all framework knowledge inline and requires no
connection to the compliance skill.

---

## Three Modes

### active — Live Incident Response

Use when you have a real incident in progress. The workflow guides you through:
- Severity classification (P1–P4 using PIRA scale)
- Framework selection (NIST SP 800-61r3, HIPAA, PCI DSS, FedRAMP, ISO 27001, or General)
- Real-time containment and investigation documentation
- Regulatory notification tracking (deadlines computed inline)
- Recovery planning with RTO/RPO tracking
- Final IR report suitable for leadership and regulatory submission

**When to use:** Ransomware detected. Data breach suspected. System compromise in progress.
Unauthorized access discovered. Service outage with security indicators.

### tabletop — Exercise Facilitation

Use to run a structured tabletop exercise with your team. The workflow guides you through:
- Scenario setup — who is playing, what scenario, what objectives
- Structured inject delivery with escalation points
- Decision point facilitation — who decides, what timeline, what communications
- After-action capture — gaps identified, decisions made, improvements needed
- Exercise debrief report

**When to use:** Annual IR exercises. New team onboarding. Pre-audit preparation. Testing
notification procedures. Training leadership on IR roles.

### review — Post-Incident Review

Use after an incident has been resolved. The workflow guides you through:
- Historical context gathering and incident reconstruction
- Timeline reconstruction from logs, tickets, and communications
- Root cause analysis (5 Whys or fishbone)
- Control failure analysis — what failed, what worked
- Lessons learned compilation
- Post-incident review report with program improvement recommendations

**When to use:** Incident closed, lessons need documentation. PIR required by compliance.
Program improvement initiative. After a tabletop, to formalize findings.

---

## Quick Start

```bash
# Active incident (default mode)
/incident active

# Active incident with context
/incident active ransomware-detected, severity=P1, framework=HIPAA

# Tabletop exercise
/incident tabletop

# Tabletop with scenario
/incident tabletop "Supply chain attack — third-party vendor compromise"

# Post-incident review
/incident review

# Review for a specific past incident
/incident review incident-2026-01-data-breach
```

---

## Supported Frameworks

| Framework | Key IR Obligations |
|-----------|-------------------|
| NIST SP 800-61r3 | Preparation, Detection, Containment, Eradication, Recovery, Post-Incident |
| ISO 27001 | Annex A.16 incident management procedures and evidence |
| PCI DSS | Immediate card brand notification, forensics preservation, acquirer notification |
| HIPAA | 60-day breach notification to HHS + affected individuals; media if 500+ in state |
| FedRAMP | US-CERT within 1 hour (major), 72 hours (standard); FISMA incident handling |
| General | Standard IR lifecycle without framework-specific obligations |

---

## Regulatory Notification Timelines (Quick Reference)

| Regulation | Who to Notify | Deadline |
|------------|---------------|---------|
| HIPAA | HHS + affected individuals | 60 days from discovery |
| HIPAA (500+ individuals in a state) | Media in that state | 60 days from discovery |
| GDPR | Supervisory authority | 72 hours from discovery |
| GDPR (high risk to individuals) | Affected individuals | Without undue delay |
| PCI DSS | Card brands + acquirer | Immediately upon discovery |
| FedRAMP/FISMA (major incident) | US-CERT | 1 hour |
| FedRAMP/FISMA (standard incident) | US-CERT | 72 hours |

These timelines are built directly into Phase 03 — no external references required.

---

## Output Structure

```
private/output/incident/{incident-id}-{YYYY-MM}/
├── intake.md                   ← Severity, scope, stakeholders, framework (all modes)
├── TIMELINE.md                 ← Chronological event log (active/review only)
├── SCENARIO.md                 ← Scenario + inject log (tabletop only)
├── RESPONSE-LOG.md             ← Actions taken (all modes)
├── COMMUNICATIONS.md           ← Comms artifacts + regulatory notification tracker
├── LESSONS-LEARNED.md          ← Lessons compiled (all modes)
├── RECOVERY-PLAN.md            ← Service restoration plan (active/review only)
├── INCIDENT-REPORT.md          ← Final report (all modes, format varies by mode)
├── ACTION-ITEMS.md             ← Prioritized improvements (all modes)
└── metadata.json               ← Mode, framework, timestamps, phase status
```

---

## Related Commands

- `/risk-assess` — Proactive risk assessment (pre-incident)
- `/harden` — System hardening to reduce attack surface
- `/sec-review` — Architecture security review
- `/advisory` — Quick security guidance

---

**Framework:** Intelligence Adjacent (IA)
**Version:** 1.0 | **Last Updated:** 2026-02-24
