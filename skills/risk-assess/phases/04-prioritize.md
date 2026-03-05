---
domain: risk-assess
skill: risk-assess
agent: advisor
model: sonnet
mode: single-agent
complexity: high
chain_position: middle
---

# Phase 4: PRIORITIZE (Risk Register, Treatment Options, Roadmap)

## IDENTITY

**Agent:** `agents/advisor.md` (loaded automatically from METADATA `agent:` field)

**Phase-specific role:** Assemble the prioritized risk register, assign treatment options
to each risk, identify owners and timelines, and produce the risk treatment plan. This phase
transforms scored risk pairs into actionable decisions.

**Additional constraints:** Do not write the executive summary or full report here — that is
Phase 5. Focus on the register structure, treatment assignments, and roadmap. Every risk must
have a treatment decision; "under review" is not a valid treatment option.

---

## INPUT CONTRACT

**Receives:**
- RISK-ANALYSIS.md from Phase 03 (scored risk matrix)
- ASSET-INVENTORY.md from Phase 02 (asset owners, criticality)
- scope.md with framework selection and stakeholder context
- Output directory path: `private/output/risk-assess/{org}-{YYYY-MM}/`

**Prerequisites:**
- RISK-ANALYSIS.md exists with complete risk scores
- Asset owners identified in Phase 02

**Source:** `skills/risk-assess/phases/00-workflow.md` (workflow orchestrator)

---

## OBJECTIVE

**Goal:** Produce a prioritized risk register and treatment plan that gives the organization
clear, actionable decisions for every identified risk.

**Success criteria:**
- All risks from the analysis are listed in the register, sorted by risk level
- Every risk has a treatment decision (Accept, Mitigate, Transfer, or Avoid)
- Each treatment entry has an owner, timeline, and cost estimate
- RISK-REGISTER.md and RISK-TREATMENT-PLAN.md written to output directory

**Failure criteria:**
- No risk scores available from Phase 3 → Return to Phase 3
- User cannot assign any owners → Flag all as "TBD" and note in treatment plan

---

## METHODOLOGY

**Treatment decisions require business context.** A technically optimal mitigation may be
too expensive for a small organization. A risk the security team wants to mitigate may be
one the business has decided to accept. Surface these tradeoffs explicitly — the advisor's
role is to ensure the decision is informed, not to make it for the organization.

**Sort by risk level, then by asset criticality.** Critical risks go first, then High, Medium,
Low. Within the same risk level, sort by asset criticality (Critical assets before High).

**Treatment options are mutually exclusive per risk entry.** One treatment per risk ID.
If the treatment changes later, that is a register update — not a phase issue.

---

## EXECUTION

### Step 1: Load Prior Phase Context

**Tool:** Read

Load from the output directory:
- `private/output/risk-assess/{org}-{YYYY-MM}/RISK-ANALYSIS.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/ASSET-INVENTORY.md`
- `private/output/risk-assess/{org}-{YYYY-MM}/scope.md`

Extract: full risk matrix with scores and levels, asset owners, stakeholder context.

**Expected output:** Prior phase context loaded
**On failure:** Ask user to summarize top risks; proceed with available data

### Step 2: Explain Treatment Options

**Tool:** Direct conversation

Present the four treatment options before assigning them:

**Accept**
The organization acknowledges the risk and consciously decides to accept the current
exposure without additional controls. Appropriate when:
- Risk level is Low and cost to mitigate exceeds expected loss
- Business activity cannot be changed without unacceptable operational impact
- Existing controls reduce residual risk to within tolerance
Requirement: Risk acceptance must be documented with business owner sign-off.

**Mitigate**
Implement controls to reduce likelihood, impact, or both. This is the most common treatment.
Examples: Deploy MFA (reduces likelihood), encrypt data at rest (reduces impact),
implement WAF (reduces likelihood of exploitation), add DLP (reduces exfiltration impact).
Requirement: Specific control(s) identified, owner assigned, timeline set.

**Transfer**
Shift some or all financial consequence to a third party. Does not eliminate the risk —
only changes who bears the cost of realization.
Examples: Cyber insurance (transfers financial loss), contract indemnification (transfers
liability to vendor), SLA with penalties (transfers financial risk to service provider).
Requirement: Transfer mechanism identified; residual risk after transfer acknowledged.

**Avoid**
Eliminate the activity or asset that introduces the risk. The most effective treatment —
if you don't do the risky thing, the risk doesn't exist.
Examples: Discontinue a legacy system (avoids vulnerabilities), stop collecting unnecessary
PII (avoids data breach exposure), exit a high-risk market (avoids regulatory exposure).
Requirement: Feasibility confirmed; business impact of avoidance assessed.

**Expected output:** Treatment options understood
**On failure:** Proceed; explain options inline during Step 3 as needed

### Step 3: Assign Treatment Decisions

**Tool:** Direct conversation

For each risk in the matrix, starting with Critical then High:

1. Present the risk: Asset, threat, risk score, control gaps
2. Recommend a treatment based on risk level and control gaps:
   - Critical + no controls: Mitigate (immediate)
   - Critical + partial controls: Mitigate or Transfer
   - High + no controls: Mitigate
   - High + strong controls: Mitigate or Accept (with rationale)
   - Medium: Mitigate or Accept based on cost/benefit
   - Low: Accept (typically) or Mitigate if cheap and easy
3. Confirm the treatment with the user
4. Assign owner (CISO, IT, business unit owner, legal, etc.)
5. Set timeline:
   - Critical: Immediate (within 7 days) or Short-term (within 30 days)
   - High: Short-term (within 30 days) or Medium-term (within 90 days)
   - Medium: Medium-term (within 90 days) or Long-term (within 6-12 months)
   - Low: Long-term or Accepted (monitored)
6. Estimate cost (rough order of magnitude):
   - Low: < $10K
   - Medium: $10K-$100K
   - High: $100K-$500K
   - Very High: > $500K

**Expected output:** Treatment decisions assigned for all Critical and High risks
**On failure:** Document "Treatment: Pending Decision" for unresolved risks; flag for follow-up

### Step 4: Assign Treatments for Medium and Low Risks

**Tool:** Direct conversation

Process Medium and Low risks. These can be batch-assigned if the user confirms:
- All Medium risks with known control gaps → Mitigate (medium-term)
- All Low risks with adequate controls → Accept (monitor)
- Any Medium or Low risk the user wants to escalate → Update risk level

**Expected output:** All risks have treatment assignments
**On failure:** Document remaining treatments as "Accepted pending review"

### Step 5: Build Treatment Roadmap

**Tool:** Direct conversation

Organize treatments into a phased roadmap:

**Immediate (0-30 days):** Critical risks and High risks with no controls
**Short-term (30-90 days):** High risks with partial controls; highest-priority Medium risks
**Medium-term (90-180 days):** Remaining Medium risks; low-cost Low risk mitigations
**Long-term (180+ days):** Strategic mitigations; structural changes; vendor transitions

Flag any treatments with dependencies (e.g., "MFA deployment requires Identity Provider
upgrade — schedule IP upgrade first").

**Expected output:** Phased roadmap ready to include in treatment plan
**On failure:** Group by risk level without timeline dependencies; note dependency unknowns

### Step 6: Write RISK-REGISTER.md

**Tool:** Write

Write the prioritized risk register to:
`private/output/risk-assess/{org}-{YYYY-MM}/RISK-REGISTER.md`

Format:

```markdown
# Risk Register

**Org:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Total Risks:** {count}

---

## Register Summary

| Risk Level | Count | % Mitigate | % Accept | % Transfer | % Avoid |
|-----------|-------|-----------|---------|-----------|--------|
| Critical | {n} | {%} | {%} | {%} | {%} |
| High | {n} | ... |
| Medium | {n} | ... |
| Low | {n} | ... |

---

## Full Risk Register

| Risk ID | Asset | Threat | L | I | Score | Level | Treatment | Owner | Timeline | Est. Cost |
|---------|-------|--------|---|---|-------|-------|-----------|-------|----------|-----------|
| R-001 | A-001: {name} | Ransomware | 4 | 5 | 20 | Critical | Mitigate | CISO | 30 days | $50K |
| R-002 | A-001: {name} | Insider exfil | 3 | 5 | 15 | High | Transfer | Legal | 60 days | $15K/yr |
...
```

**Expected output:** RISK-REGISTER.md written
**On failure:** Write partial register; complete missing entries with "PENDING"

### Step 7: Write RISK-TREATMENT-PLAN.md

**Tool:** Write

Write the detailed treatment plan to:
`private/output/risk-assess/{org}-{YYYY-MM}/RISK-TREATMENT-PLAN.md`

Format:

```markdown
# Risk Treatment Plan

**Org:** {org}
**Framework:** {framework}
**Date:** {YYYY-MM-DD}
**Plan Period:** {start} to {end}

---

## Treatment Roadmap

### Immediate (0-30 days)

#### R-001: {Asset} — {Threat} [Critical]
- **Treatment:** Mitigate
- **Current State:** {description of gap}
- **Target State:** {description of control after remediation}
- **Specific Controls:** {list of controls to implement}
- **Owner:** {owner}
- **Timeline:** {specific date or "within 30 days"}
- **Estimated Cost:** {estimate}
- **Success Criteria:** {how to verify treatment is effective}
- **Dependencies:** {upstream dependencies, if any}

...

### Short-term (30-90 days)

{Same format}

### Medium-term (90-180 days)

{Same format}

### Long-term (180+ days)

{Same format}

---

## Accepted Risks

| Risk ID | Rationale | Review Date | Approver |
|---------|-----------|-------------|---------|
| R-XXX | {reason for acceptance} | {next review} | {approver} |

---

## Budget Summary

| Timeline | Mitigate Cost | Transfer Cost | Total |
|----------|-------------|--------------|-------|
| Immediate (0-30d) | $X | $X | $X |
| Short-term (30-90d) | $X | $X | $X |
| Medium-term (90-180d) | $X | $X | $X |
| Long-term (180d+) | $X | $X | $X |
| **Total** | **$X** | **$X** | **$X** |
```

**Expected output:** RISK-TREATMENT-PLAN.md written
**On failure:** Write with available data; flag any "PENDING" treatment entries

### Step 8: Verify Register Completeness

**Tool:** Direct analysis

Confirm:
- All risks from RISK-ANALYSIS.md appear in the register
- All Critical and High risks have explicit treatments (not "PENDING")
- All treatments have assigned owners
- Roadmap timelines are realistic and sequenced correctly

**Expected output:** Register verified, phase summary displayed
**On failure:** Return to Step 3 to complete missing treatments

---

## OUTPUT CONTRACT

**Produces:**
- `RISK-REGISTER.md` → `private/output/risk-assess/{org}-{YYYY-MM}/RISK-REGISTER.md`
- `RISK-TREATMENT-PLAN.md` → `private/output/risk-assess/{org}-{YYYY-MM}/RISK-TREATMENT-PLAN.md`

**Format:** Markdown tables with prioritized register and detailed treatment entries per phase.

---

## NEXT

**On success:** → Proceed to Phase 5 (Deliver):

Load `skills/risk-assess/phases/05-deliver.md` with:
- Complete risk register and treatment plan
- Risk distribution summary
- Output directory path

**On failure (incomplete register):** → Resolve pending treatments; retry Steps 3-4

---

## CHECKPOINTS

**Exit criteria (ALL must be true):**
- [ ] All risks from Phase 3 appear in the register
- [ ] All risks have a treatment decision (Accept / Mitigate / Transfer / Avoid)
- [ ] All Critical and High risks have owners and timelines
- [ ] Treatment roadmap is phased and sequenced
- [ ] RISK-REGISTER.md written to output directory
- [ ] RISK-TREATMENT-PLAN.md written to output directory
- [ ] Budget summary included
- [ ] Ready to proceed to Phase 5 (DELIVER)

**Error recovery:**
- If owner unknown: Assign to "TBD — {team}" and flag for resolution
- If cost estimate unavailable: Use "TBD" with a note to obtain quotes
- If treatment is disputed: Document the dispute and the fallback decision
- If write fails: Check output directory path and permissions

---

**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
