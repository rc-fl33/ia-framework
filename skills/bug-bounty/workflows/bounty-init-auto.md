# Bug Bounty Auto-Initialization Workflow

**Version:** 1.0
**Created:** 2026-02-06
**Used by:** `/bug-bounty` command (engagement initialization path)
**Agent:** Base Claude (orchestrator) -- delegates to security agent at completion

---

## Overview

Auto-initializes a bug bounty engagement by fetching program data directly
from the public arkadiyt/bounty-targets-data repository. Generates a complete
SCOPE.md from real platform data, initializes the engagement directory, and
delegates to the security agent.

**When to use:** User invokes `/bug-bounty` for an actual engagement (not
research queries or program lookups).

**Supported platforms:** HackerOne, Bugcrowd, Intigriti, YesWeHack, Federacy

**Prerequisites:** Network access to GitHub, `bun` installed,
`skills/pentest/workflows/init-engagement.ts` accessible (shared infrastructure).

---

## Step 1: Collect Parameters

Use AskUserQuestion to gather all engagement parameters before touching data.

**1a. Platform:** Ask user to select one of: HackerOne, Bugcrowd, Intigriti,
YesWeHack, Federacy. Store as `platform` (lowercase).

**1b. Program identifier:** Free text input for the program handle or name
(e.g., "security", "crypto", "NETGEAR"). Store as `program_identifier`.

**1c. Engagement mode:** Director (production, audit on), Mentor (learning,
audit on), or Demo (testing/POC, audit off). Store as `engagement_mode`
(lowercase).

**1d. Audit logging:** Offer three options -- Keep Default (Director/Mentor =
enabled, Demo = disabled), Override: Enable, Override: Disable. Store as
`audit_enabled` (boolean).

---

## Step 2: Fetch Program Data

Data is fetched directly from the public repository (no local refresh needed).

---

## Step 3: Parse Program Scope

Locate program in the appropriate platform data file.

### Data File Locations

Data is fetched from the public repository in real-time:

| Platform   | Data File              | Source URL |
|------------|------------------------|-----------|
| HackerOne  | `hackerone_data.json`  | https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/ |
| Bugcrowd   | `bugcrowd_data.json`   | https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/ |
| Intigriti  | `intigriti_data.json`  | https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/ |
| YesWeHack  | `yeswehack_data.json`  | https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/ |
| Federacy   | `federacy_data.json`   | https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/ |

### Parse Command

```bash
bun run tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform {platform} \
  --program "{program_identifier}"
```

The parser searches platform JSON for a matching program by `handle` or `name`
(case-insensitive) and outputs structured JSON with normalized fields.

### Failure Modes

**Program not found:**
1. Run fuzzy search: `grep -i "{program_identifier}"` across platform data
2. Present up to 10 matches, let user select or provide corrected identifier
3. If no matches: suggest checking platform website, ABORT if unresolvable

**Program inactive** (`state` not `public_mode` or `submission_state` not `open`):
1. Warn user with current state values
2. Ask: "This program appears inactive. Proceed anyway?" -- If No: ABORT

**No in-scope targets** (zero assets with `eligible_for_bounty: true`):
- Display: "Program has no bounty-eligible in-scope targets."
- **ABORT** -- cannot proceed without targets

---

## Step 4: Validate Program State

Validate parsed output before generating scope.

### Required Checks

1. **State:** `state` is `public_mode` (HackerOne) or equivalent -- warn if not
2. **Bounty-eligible assets:** At least one with `eligible_for_bounty: true` -- ABORT if none
3. **Submission state:** `submission_state` is `open` (if available) -- warn if not
4. **Safe harbor:** Display status to user
   - `full`: Platform provides full safe harbor
   - `partial`: Partial safe harbor
   - `none`/missing: No safe harbor (strong warning)

### Validation Summary Display

```
Program Validation:
  State:            {state} {OK/WARNING}
  Submission:       {submission_state} {OK/WARNING}
  Safe Harbor:      {safe_harbor}
  Bounty Targets:   {count} eligible
  Total In-Scope:   {total_in_scope}
  Out-of-Scope:     {total_out_of_scope}
```

If any WARNING, require explicit user confirmation to continue.

---

## Step 5: Auto-Generate SCOPE.md

Create a complete SCOPE.md from parsed data. This replaces the placeholder
that init-engagement.ts creates.

### Required Sections

The generated SCOPE.md must include all of the following:

1. **Program Information:** name, platform, handle, URL, state, submission
   state, safe harbor
2. **Authorization:** Source (public bug bounty), status (active), testing
   period ({YYYY-MM} - Ongoing), authorization type, program URL
3. **In-Scope Assets table:** type, target, max severity, bounty eligible,
   instructions (one row per asset)
4. **Out-of-Scope Assets table:** type, target, notes
5. **Out-of-Scope Vulnerability Types:** from `scope_descriptions.out_of_scope_vulns`
   plus platform defaults (theoretical vulns, unlikely user interaction, etc.)
6. **Platform-Specific Rules:** credentials, testing notes, engagement rules
   (use platform defaults if fields are null)
7. **Reward Tiers table:** severity, min, max (Critical/High/Medium/Low)
8. **Focus Areas:** from `focus_areas` array, or "No specific focus areas"
9. **Data footer:** source file path, data freshness timestamp, generation date,
   "AUTO-GENERATED from bounty-targets data" status

### Field Mapping by Platform

**HackerOne:** `name`, `handle`, `url`, `state`, `safe_harbor`,
`submission_state`, `targets.in_scope[]` (type, target, uri, max_severity,
eligible_for_bounty, instruction), `reward_tiers[]`, `credentials`,
`focus_areas`, `testing_notes`, `engagement_rules`,
`scope_descriptions.out_of_scope_vulns`

**Bugcrowd:** `name`, `url`, `safe_harbor`, `max_payout`,
`allows_disclosure`, `targets.in_scope[]` (type, target, uri, tags,
known_issues). No explicit `eligible_for_bounty` -- infer from `max_payout`.

**Intigriti:** Same structure as HackerOne (normalized by scraper).

**YesWeHack/Federacy:** Stored in `data/` with platform-specific schemas.
Parse and normalize to common output format.

---

## Step 6: Initialize Engagement

Run init-engagement.ts to create the standard directory structure.

**Naming convention:** `{handle}-bounty-{YYYY-MM}`
(e.g., `security-bounty-2026-02`, `crypto-bounty-2026-02`)

```bash
bun run skills/pentest/workflows/init-engagement.ts \
  --engagement-dir private/output/bug-bounty/{handle}-bounty-{YYYY-MM} \
  --mode {engagement_mode} \
  --audit-{enabled|disabled} \
  --target-name "{program_name}" \
  --target-type bounty \
  --source-type bounty
```

This creates the standard phase directories (01-pre-engagement through
07-reporting, plus 05-findings), README.md, a placeholder SCOPE.md,
session.json, and audit-logs/ (if audit enabled).

Confirm exit code 0 and all directories exist. If initialization fails,
display error and ABORT.

---

## Step 7: Copy Scope to Engagement

### Overwrite Placeholder SCOPE.md

Use the Write tool to write the auto-generated SCOPE.md from Step 5 to:
`private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/SCOPE.md`

This overwrites the generic placeholder created by init-engagement.ts.

### Copy Raw Platform Data

```bash
mkdir -p private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/01-pre-engagement/api/

cp ~/ia-framework-targets-data/{platform}/programs-latest.json \
   private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/01-pre-engagement/api/{platform}-programs.json
```

For HackerOne, also copy supplementary files if they exist:

```bash
cp ~/ia-framework-targets-data/hackerone/targets-latest.json \
   private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/01-pre-engagement/api/hackerone-targets.json 2>/dev/null
cp ~/ia-framework-targets-data/hackerone/domains.txt \
   private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/01-pre-engagement/api/hackerone-domains.txt 2>/dev/null
```

Verify all files exist in the engagement directory before proceeding.

---

## Step 8: Present Summary and Delegate

### Display Summary

```
================================================================================
BUG BOUNTY ENGAGEMENT INITIALIZED
================================================================================

Program:          {program_name}
Platform:         {platform}
Handle:           {handle}
Safe Harbor:      {safe_harbor}

In-Scope Assets:
  Websites:       {count}
  APIs:           {count}
  Mobile Apps:    {count}
  IoT/Hardware:   {count}
  Other:          {count}
  Total:          {total}

Bounty Eligible:  {bounty_eligible_count} of {total}
Reward Range:     {min_reward} - {max_reward} (if available)

Engagement:
  Mode:           {engagement_mode}
  Audit Logging:  {enabled|disabled}
  Directory:      private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/

Data Freshness:   {last_commit_timestamp}
SCOPE.md:         Auto-generated from bounty-targets data
================================================================================
```

### Delegate to Security Agent

```
Task(subagent_type="security", prompt="Execute {engagement_mode} pentest for
bug bounty engagement at private/output/bug-bounty/{handle}-bounty-{YYYY-MM}.

Program: {program_name} on {platform}
Handle: {handle}
Safe Harbor: {safe_harbor}
Bounty-Eligible Targets: {bounty_eligible_count}

Scope auto-generated from bounty-targets data. SCOPE.md is complete and
validated -- no manual completion required.

Proceed with Phase 1 (EXPLORE):
1. Read and validate SCOPE.md
2. Parse scope boundaries (in-scope vs out-of-scope)
3. Map attack surface (domains, IPs, APIs, applications)
4. Execute passive reconnaissance
5. Generate scope-analysis.md and attack-surface.md

Engagement Directory: private/output/bug-bounty/{handle}-bounty-{YYYY-MM}
Raw Platform Data: private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/01-pre-engagement/api/
Workflow: skills/pentest/workflows/phases/prompts/01-EXPLORE.md")
```

---

## Error Handling

| Condition | Action |
|-----------|--------|
| Network error | Cannot reach public data source. Display error and ABORT. |
| Program not found (offline data) | If offline, show cached data. Otherwise, fuzzy search GitHub data. ABORT if unresolvable. |
| Program not found | Fuzzy search, show up to 10 matches, let user select or correct. ABORT if unresolvable. |
| Program inactive | Display state values, warn, confirm proceed. ABORT if declined. |
| No in-scope targets | Display message. **ABORT** -- cannot proceed. |
| Stale data (> 24h) | Calculate age, warn user, recommend manual verification. Proceed but note staleness in SCOPE.md. |

---

## Validation Checklist

Before delegating to the security agent, all items must be confirmed:

- [ ] Platform selected (hackerone, bugcrowd, intigriti, yeswehack, federacy)
- [ ] Program found and parsed
- [ ] Program state validated (active, submissions open)
- [ ] In-scope bounty-eligible assets exist (count > 0)
- [ ] SCOPE.md auto-generated with complete program data
- [ ] Engagement directory initialized via init-engagement.ts
- [ ] Placeholder SCOPE.md overwritten with auto-generated version
- [ ] Raw platform data (JSON) copied to 01-pre-engagement/api/
- [ ] Audit logging configured per user preference
- [ ] Summary presented to user with asset counts and safe harbor status

---

## Related Documentation

- **Pentest init (general):** `skills/pentest/workflows/pentest-init-v2.md`
- **Init engagement script:** `skills/pentest/workflows/init-engagement.ts`
- **Init instructions:** `skills/pentest/workflows/INIT-ENGAGEMENT-INSTRUCTIONS.md`
- **Phase 1 EXPLORE:** `skills/bug-bounty/prompts/techniques/` (symlinked from pentest)
- **Public data source:** `https://github.com/arkadiyt/bounty-targets-data`
- **Parser (public):** `tools/bug-bounty/bounty-scope-parser-public.ts`

---

**Version:** 2.0
**Last Updated:** 2026-02-17
**Status:** Active
**Framework:** Intelligence Adjacent (IA)
