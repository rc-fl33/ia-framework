---
domain: incident
skill: incident
agent: security
model: sonnet
mode: multi-mode
complexity: high
chain_position: fifth
---

# Phase 04: RECOVER

## IDENTITY

**Agent:** `security` (active/tabletop) or `advisor` (review) — set at command layer.

**Phase-specific role:** Execute recovery planning and service restoration (active/review),
or assess recovery decision-making and RTO/RPO gaps (tabletop). Compile lessons learned for
all modes. This phase bridges the operational response and the formal post-incident report.

**Additional constraints:** Read mode and framework from metadata.json. In active mode,
recovery authorization must come from the Incident Commander — document it explicitly.
Do not authorize recovery without eradication confirmation from Phase 02.

---

## INPUT CONTRACT

**Receives:**
- Mode from metadata.json (active/tabletop/review)
- Framework from metadata.json
- Incident ID and output directory path
- Response status from RESPONSE-LOG.md
- Communications status from COMMUNICATIONS.md

**Prerequisites:**
- COMMUNICATIONS.md exists in output directory
- RESPONSE-LOG.md exists with response actions documented
- Active/review modes: eradication confirmed in RESPONSE-LOG.md before recovery begins

**Source:** `skills/incident/phases/00-workflow.md` (via 03-communicate.md completion)

---

## OBJECTIVE

**Goal:** Plan and execute service restoration (active/review), identify recovery decision
gaps (tabletop), and compile lessons learned for all modes.

**Success criteria:**
- LESSONS-LEARNED.md written (all modes)
- RECOVERY-PLAN.md written (active/review modes)
- RTO/RPO performance documented (active/review)
- Systemic lessons identified, not just tactical fixes
- metadata.json updated with Phase 04 completion

**Failure criteria:**
- Active mode: recovery attempted before eradication confirmed → BLOCK and return to Phase 02
- Review mode: recovery timeline unavailable → Document as unknown, continue with available evidence

---

## METHODOLOGY

**Recovery without eradication confirmation creates re-infection risk.** In active mode,
explicitly confirm eradication is documented in RESPONSE-LOG.md before proceeding to recovery.
The Incident Commander must authorize the "all clear" for recovery.

**Lessons learned must be systemic, not tactical.** "Update antivirus signatures" is a
tactical fix. "The vulnerability management program did not prioritize this CVE class" is
a systemic lesson. Systemic lessons drive program improvements in Phase 05.

**Tabletop RTO/RPO gaps are often the most valuable finding.** Organizations frequently
discover they have published RTO/RPO targets that their recovery procedures cannot actually
meet. Surface this clearly.

---

## EXECUTION

---

### [active] MODE: Recovery Planning and Service Restoration

#### Step 1: Pre-Recovery Validation

**Tool:** Direct conversation

Confirm all recovery prerequisites are met:

- [ ] Eradication confirmed: all threat indicators removed (documented in RESPONSE-LOG.md)
- [ ] Evidence preserved: forensic artifacts secured before any reimaging
- [ ] Patch applied: vulnerability exploited in this incident is patched
- [ ] Credentials rotated: all compromised accounts/keys rotated
- [ ] Monitoring enhanced: additional detection in place for re-compromise indicators
- [ ] Incident Commander authorization documented

**Gate:** Do not proceed to recovery until ALL items above are checked.

**Expected output:** Pre-recovery checklist complete, Incident Commander authorization noted
**On failure:** BLOCK recovery, return to Phase 02 for remaining eradication steps

---

#### Step 2: Build Recovery Plan

**Tool:** Direct conversation + Write

Define the recovery sequence based on system dependencies and business priority:

**Service restoration order:**
- Start with the services with the highest business impact and the lowest re-infection risk
- Restore monitoring and logging infrastructure first (before restoring user-facing services)
- Validate each service before restoring the next
- Have rollback criteria defined for each step

**Validation criteria for each restored service:**
- What tests confirm the service is clean?
- What monitoring confirms no re-compromise?
- Who signs off on each service restore?

**Go-live checklist:**
- [ ] All affected services tested and validated
- [ ] Enhanced monitoring in place
- [ ] Incident Commander declares incident contained and services restored
- [ ] Business stakeholders notified of restoration
- [ ] Status page or user communication sent (if applicable)

---

#### Step 3: RTO/RPO Tracking

**Tool:** Direct conversation

Document actual recovery performance against targets:

| Metric | Target | Actual | Delta | Notes |
|--------|--------|--------|-------|-------|
| RTO — {service 1} | {target hours} | {actual hours} | {+/- hours} | {notes} |
| RPO — {service 1} | {target hours} | {actual data loss window} | {+/- hours} | {notes} |
| Time to Detect | {target if defined} | {actual hours from start to detection} | | |
| Time to Contain | {target if defined} | {actual hours from detection to containment} | | |
| Time to Eradicate | {target if defined} | {actual hours} | | |
| Time to Restore | {target if defined} | {actual hours} | | |

Document any RTO/RPO targets that were missed and why.

---

### [tabletop] MODE: Recovery Decision Points and RTO/RPO Gap Assessment

#### Step 1: Recovery Decision Facilitation

**Tool:** Direct conversation

Guide participants through recovery decision points:

- "At what point would you declare the threat eradicated and begin recovery?"
- "Who authorizes recovery? Is that documented in your IR procedures?"
- "What is the recovery sequence for {affected systems}?"
- "What validation would you require before declaring a system clean?"
- "Who communicates to users/customers that services are restored?"

Inject: "The recovery procedure requires reimaging 50 endpoints. Your imaging team says that
takes 4 hours per endpoint. Walk me through how you manage that."

Inject: "During recovery testing, one of the restored systems shows the same IOC that
triggered the original detection. What do you do?"

---

#### Step 2: RTO/RPO Gap Assessment

**Tool:** Direct conversation

Surface gaps between documented targets and actual capabilities:

- "What is your published RTO for {critical service}?"
- "Walk me through the actual steps to restore it. How long do those steps take?"
- "Have you ever actually run a full restore of {system}? How long did it take?"
- "What would happen if your backup server was also compromised?"

Document each RTO/RPO gap as a finding with severity.

---

### [review] MODE: Actual Recovery Timeline and Performance

#### Step 1: Actual Recovery Timeline

**Tool:** Direct conversation

Reconstruct the actual recovery sequence from evidence:
- When was eradication confirmed and by whom?
- What was the recovery sequence?
- Were there any failed recovery attempts?
- Who authorized each recovery step?
- When was each service declared restored?

---

#### Step 2: RTO/RPO Actual Performance

**Tool:** Direct conversation

Compare actual performance to documented targets:
- What were the documented RTO/RPO targets for affected systems?
- What were the actual recovery times?
- Were there gaps? If so, what caused them?
- Were backup/recovery procedures followed as documented, or were there deviations?

---

### Step 3 (all modes): Compile Lessons Learned

**Tool:** Direct conversation

Compile lessons across five categories:

**Detection:**
- What detection controls worked?
- What should have detected this earlier but didn't?
- How can detection be improved?

**Response:**
- What response actions worked well?
- What response actions were delayed or problematic?
- Were runbooks/procedures accurate and accessible?

**Communications:**
- Were notifications timely and appropriate?
- Were any stakeholders missed or notified too late?
- Were regulatory notification procedures clear?

**Recovery:**
- Was recovery faster or slower than expected?
- Were RTO/RPO targets met?
- Were backup/recovery procedures reliable?

**Program:**
- What systemic control gaps does this incident reveal?
- What program investments would prevent this class of incident?
- What training gaps were exposed?

For each lesson, document:
- **Observation:** What happened (fact-based)
- **Impact:** What the consequence was
- **Recommendation:** What should change (systemic, not just tactical)
- **Owner:** Who should drive the change
- **Priority:** High/Medium/Low

---

### Step 4: Write Output Files

**Tool:** Write

**LESSONS-LEARNED.md** (all modes):
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/LESSONS-LEARNED.md`

```markdown
# Lessons Learned

**Incident ID:** {incident-id}
**Mode:** {active|tabletop|review}
**Date:** {YYYY-MM-DD}

## Summary

{2-3 sentences summarizing the most significant lessons}

## Detection

| Observation | Impact | Recommendation | Owner | Priority |
|-------------|--------|----------------|-------|----------|

## Response

| Observation | Impact | Recommendation | Owner | Priority |
|-------------|--------|----------------|-------|----------|

## Communications

| Observation | Impact | Recommendation | Owner | Priority |
|-------------|--------|----------------|-------|----------|

## Recovery

| Observation | Impact | Recommendation | Owner | Priority |
|-------------|--------|----------------|-------|----------|
| RTO target met: {yes/no/partial} | | | | |
| RPO target met: {yes/no/partial} | | | | |

## Program Improvements

| Observation | Impact | Recommendation | Owner | Priority |
|-------------|--------|----------------|-------|----------|
```

**RECOVERY-PLAN.md** (active/review modes only):
**Path:** `private/output/incident/{incident-id}-{YYYY-MM}/RECOVERY-PLAN.md`

```markdown
# Recovery Plan

**Incident ID:** {incident-id}
**Mode:** {active|review}
**Authorized By:** {Incident Commander name} — {timestamp}

## Pre-Recovery Checklist

- [ ] Eradication confirmed
- [ ] Evidence preserved
- [ ] Credentials rotated
- [ ] Patches applied
- [ ] Enhanced monitoring active
- [ ] Incident Commander authorization: {name, timestamp}

## Recovery Sequence

| Step | Service/System | Action | Owner | Validation Criteria | Status |
|------|---------------|--------|-------|--------------------| ------|

## RTO/RPO Performance

| Service | RTO Target | RTO Actual | RPO Target | RPO Actual |
|---------|-----------|-----------|-----------|-----------|

## Restoration Sign-off

{Incident Commander sign-off and timestamp}
```

**Update metadata.json** with Phase 04 completion timestamp.

---

## OUTPUT CONTRACT

**Produces:**
- `LESSONS-LEARNED.md` → `private/output/incident/{incident-id}-{YYYY-MM}/LESSONS-LEARNED.md` (all modes)
- `RECOVERY-PLAN.md` → `private/output/incident/{incident-id}-{YYYY-MM}/RECOVERY-PLAN.md` (active/review)
- `metadata.json` updated with Phase 04 completion

**Format:** Structured markdown with tabular lessons and recovery tracking

---

## NEXT

**On success:** → Proceed to Phase 05 (Deliver):

Load `skills/incident/phases/05-deliver.md` with:
- Mode from metadata.json
- Framework from metadata.json
- Incident ID and output directory path
- All deliverables produced so far

**On failure:** → Document blocker, escalate as appropriate

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] Pre-recovery validation complete (active mode) — eradication confirmed
- [ ] Recovery plan built and Incident Commander authorization documented (active mode)
- [ ] RTO/RPO actual performance documented (active/review)
- [ ] Recovery decision gaps documented (tabletop)
- [ ] Lessons learned compiled across all five categories (all modes)
- [ ] LESSONS-LEARNED.md written
- [ ] RECOVERY-PLAN.md written (active/review modes)
- [ ] metadata.json updated with Phase 04 completion
- [ ] Ready to proceed to Phase 05 (DELIVER)

**Error recovery:**
- Active: recovery before eradication → BLOCK, return to Phase 02
- Active: Incident Commander unavailable → Escalate to executive sponsor
- Review: recovery timeline unavailable → Mark as unknown, flag for follow-up
- Write failure → Check path permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
