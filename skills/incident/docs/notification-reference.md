# Regulatory Notification Quick Reference

**Purpose:** Fast-lookup card for IR Phase 03 (Communicate). Not a workflow — use
`phases/03-communicate.md` for full decision logic.

---

## Section 1: Notification Timeline Summary

| Framework | Notify | Deadline | Discovery Definition | Notes |
|-----------|--------|----------|---------------------|-------|
| HIPAA | HHS Office for Civil Rights | 60 days from discovery | CE/BA "knew or reasonably should have known" | <500: annual report by March 1; ≥500: within 60 days + media |
| HIPAA | Affected individuals | 60 days from discovery | Same as above | Written notice; email if individual agreed |
| HIPAA | Media (≥500 in state) | 60 days from discovery | Same as above | Prominent outlet in affected state/jurisdiction |
| GDPR | Supervisory authority | 72 hours from awareness | Controller "becomes aware" | Include reason for delay if >72h; use lead authority for EU establishment |
| GDPR | Data subjects | Without undue delay | High risk to rights and freedoms | Financial, health, location, special category data triggers high-risk |
| PCI DSS | Card brands + acquirer | Immediately | Incident identified | Do not delay for scope determination; forensic preservation required |
| FedRAMP (major) | US-CERT / CISA | 1 hour from discovery | System owner identifies potential incident | High-impact systems or CUI compromise |
| FedRAMP (standard) | US-CERT / CISA | 72 hours from discovery | Same as above | Standard incident categories |
| FedRAMP (major) | Agency CIO/CISO | Immediately | Same as above | Also notify OMB within 7 days |
| ISO 27001 | Internal (A.5.24 plan) | Per IR plan | Per incident management plan | No ISO-mandated external deadline; apply applicable law |
| General | Leadership / board | 24 hours | Incident identified | P1/P2 incidents; adjust per organizational policy |

---

## Section 2: Discovery Definition

Deadlines run from **discovery**, not from **confirmation**. Draft notifications with available
information and update before sending — do not wait for full scope determination.

**HIPAA:** Clock starts when the Covered Entity or Business Associate "knew or reasonably
should have known" of the breach. Actual knowledge is not required — constructive knowledge
(should have known through reasonable diligence) starts the clock.

**GDPR:** Clock starts when the data controller "becomes aware" of the breach. Processors
must notify controllers "without undue delay" — typically interpreted as immediately or
within 24-72 hours. The controller's 72-hour SA notification clock runs from controller
awareness, not processor awareness.

**PCI DSS:** No explicit clock — "immediately" means as soon as the incident is identified,
before scope is fully determined. Industry practice: within 24 hours. Check acquirer
agreement for any contractual specifics.

**FedRAMP:** Clock starts from the point the system owner identifies a potential incident.
"Potential" — confirmation is not required before the 1-hour major incident clock starts.

---

## Section 3: HIPAA Business Associate vs. Covered Entity

**Notification chain for incidents at a Business Associate:**

```
BA discovers breach
        |
        v
BA notifies CE per BAA terms
(BAA deadline: typically 24-60 days; default to 60 if unspecified)
        |
        v
CE's 60-day HHS clock STARTS at CE discovery
(not at BA discovery)
        |
        v
CE notifies HHS + individuals + media (if ≥500 in state)
```

**Notification chain for incidents at a Covered Entity:**

```
CE discovers breach
        |
        v
CE's 60-day clock STARTS immediately
        |
        v
CE notifies HHS + individuals + media (if ≥500 in state)
```

**Timeline example (BA incident):**

- Day 0: BA discovers breach
- Day 5: BA notifies CE (per BAA terms)
- Day 5: CE's 60-day HHS clock starts (CE discovery date)
- Day 65 from BA discovery (Day 60 from CE discovery): CE HHS notification deadline

**Key rule:** If you are unsure whether the organization is a CE or BA, ask explicitly.
The distinction materially changes who notifies whom and when the deadline clock starts.

---

## Section 4: Ransomware Presumption

**HHS guidance (2016):** Ransomware generally constitutes a breach of PHI under HIPAA
unless the entity can demonstrate a low probability that PHI was accessed.

**Why:** Ransomware encrypts data — by definition the attacker had access to files before
encryption. This makes Factor 3 of the 4-Factor Assessment (whether PHI was actually
acquired or viewed) difficult or impossible to rule out without forensic evidence.

**Default position:** Presume breach. Proceed with HIPAA notification unless forensic
investigation produces evidence ruling out PHI access.

**4-Factor Assessment applied to ransomware:**

| Factor | Ransomware Consideration |
|--------|--------------------------|
| 1. Nature/extent of PHI | Scope of encrypted files — what PHI was in affected directories? |
| 2. Who accessed PHI | Attacker with system access — presumed access to all reachable PHI |
| 3. Whether PHI was acquired | Cannot rule out without forensic evidence; default to presumed |
| 4. Mitigation extent | Backups restored, systems cleaned — mitigates harm but not the breach |

If evidence rules out PHI access (e.g., encryption targeted non-PHI file systems, forensics
shows no exfiltration, PHI was separately encrypted at rest): document the evidence and
rationale before declining to notify.

---

## Section 5: "Immediately" in PCI DSS

**What "immediately" means:** Notify as soon as the incident is identified — before scope
is fully determined, before forensics are complete, before you know the full card count.

**Rationale:** Card brands use early notification to activate fraud monitoring and limit
ongoing card exposure. Delayed notification while investigating increases fraud losses and
can result in contractual penalties.

**Do not delay notification pending:**
- Full forensic scope determination
- Legal review (notify first, loop Legal in in parallel)
- Incident containment completion
- Cardholder count confirmation

**Card brand reporting portals (portal names, not URLs):**
- Visa: CAMS (Compromised Account Management System)
- Mastercard: SAFE (Security and Fraud Exchange)
- American Express: Amex Fraud Reporting Portal
- Discover: Discover Security Incident Reporting

**Acquirer notification:** Notify your acquiring bank at the same time as card brands.
The acquirer coordinates the PFI (PCI Forensic Investigator) engagement — do not engage
a PFI directly without acquirer direction unless the acquirer is unavailable.

**Forensic preservation (before any remediation):**
- Do not power off compromised systems without forensic authorization
- Preserve POS logs, payment application logs, and network logs
- Document chain of custody for all collected evidence
- Do not reinstall or reimage before forensic investigation is complete

---

**Skill:** incident
**Document type:** Reference
**Last Updated:** 2026-02-25
