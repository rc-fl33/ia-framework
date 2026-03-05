---
name: bug-bounty
description: Data-driven bug bounty testing with auto-scope from platform data
domain: security
skill: security
agent: security
model: sonnet
complexity: high
mode: single-agent
chain_position: first
---

# /bug-bounty -- Data-Driven Bug Bounty Engagement

## IDENTITY
**Agent:** Base Claude (orchestrator)
**Role:** Command router for data-driven bug bounty testing. Auto-loads scope from platform-scraped data (HackerOne, Bugcrowd, Intigriti, YesWeHack, Federacy) and generates SCOPE.md automatically before delegating to the security agent.

## INPUT CONTRACT
**Receives:** User invokes `/bug-bounty` with optional platform/program context or research query
**Prerequisites:**
- Network access to GitHub (fetches from arkadiyt/bounty-targets-data in real-time)
- bounty-scope-parser-public.ts at `tools/bug-bounty/bounty-scope-parser-public.ts`
**Source:** User invocation

## OBJECTIVE
**Goal:** Route to 7-phase PTES workflow with auto-generated SCOPE.md from bug bounty platform data
**Success criteria:** Program found, SCOPE.md auto-generated from platform data, engagement initialized, security agent delegated
**Failure criteria:** Program not found, no in-scope targets, data directory missing and clone fails, user aborts

## METHODOLOGY

### Request Classification
Classify every invocation before taking action:

1. **Research Query** - Indicators: "list programs", "show", "find", "search", "what programs", "compare platforms"
   - Query local JSON data directly, then STOP
2. **Actual Engagement** - Indicators: "test", "pentest", "scan", "start engagement", specific program + platform
   - Execute full initialization workflow

### Research Query Commands
```bash
# Search by platform (fetches from public arkadiyt repo)
bun run tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform {platform} --program "{query}"

# HackerOne - direct API queries
curl -s https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/hackerone_data.json | \
  jq '.[] | select(.name | test("{query}"; "i")) | {handle, name, state, offers_bounties}' | head -40

# Active programs with bounties (HackerOne)
curl -s https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/hackerone_data.json | \
  jq '[.[] | select(.state == "public_mode" and .offers_bounties == true)] | length'

# Programs by scope type
curl -s https://raw.githubusercontent.com/arkadiyt/bounty-targets-data/main/data/hackerone_data.json | \
  jq '.[] | select(.targets.in_scope[]?.type == "URL") | .handle' | head -20
```

### Supported Platforms

| Platform   | Data File                | Search By       |
|------------|--------------------------|-----------------|
| HackerOne  | `hackerone_data.json`    | handle or name  |
| Bugcrowd   | `bugcrowd_data.json`     | name or URL slug |
| Intigriti  | `intigriti_data.json`    | handle or name  |
| YesWeHack  | `yeswehack_data.json`    | name or slug    |
| Federacy   | `federacy_data.json`     | name or slug    |

Data fetched from: https://github.com/arkadiyt/bounty-targets-data

## EXECUTION

### Step 1: Classify Request
Parse user input against classification rules in METHODOLOGY. Route to appropriate branch. For research queries, answer using the research query commands above and STOP.

### Step 2: Collect Parameters (Engagement Only)
Use AskUserQuestion to gather:
- **Platform:** HackerOne (default), Bugcrowd, Intigriti, YesWeHack, Federacy
- **Program:** Handle or name (required)
- **Engagement mode:** Director (default) / Mentor / Demo
- **Audit logging:** Keep Default (Enabled for Director/Mentor, Disabled for Demo) / Override Enable / Override Disable

### Step 3: Parse Program Scope

Data is fetched directly from the public repository (no refresh step needed):

```bash
bun run tools/bug-bounty/bounty-scope-parser-public.ts \
  --platform {platform} \
  --program "{program}"
```

Validate program state:
- Program is active (state = public_mode or equivalent)
- Submissions are open
- At least one bounty-eligible in-scope target exists
- Display safe harbor status to user

### Step 5: Auto-Generate SCOPE.md
Build complete scope from parsed data:
- Program information, authorization, in-scope/out-of-scope assets
- Reward tiers, focus areas, platform-specific rules
- Data freshness footer with generation timestamp

### Step 6: Initialize Engagement
```bash
bun run skills/bug-bounty/workflows/init-engagement.ts \
  --engagement-dir private/output/bug-bounty/{handle}-bounty-{YYYY-MM} \
  --mode {mode} \
  --audit-{enabled|disabled} \
  --target-name "{name}" \
  --target-type bounty \
  --source-type bounty
```

Copy auto-generated SCOPE.md to engagement directory (overwrites placeholder). Copy raw platform JSON to `01-pre-engagement/api/`.

### Step 7: Delegate to Security Agent
ONLY after steps 1-6 complete:
```
Task(subagent_type="security", prompt="Execute {mode} pentest for bug bounty
engagement at private/output/bug-bounty/{handle}-bounty-{YYYY-MM}. Program: {name} on
{platform}. SCOPE.md auto-generated and validated. Proceed with Phase 1 (EXPLORE).")
```

## OUTPUT CONTRACT
**Produces:**
- Engagement directory at `private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/`
- Auto-generated SCOPE.md from platform data
- Raw platform JSON copied to `01-pre-engagement/api/`
- Initialized session.json for phase tracking
- Audit logs directory (if enabled)

**Directory structure:**
```
private/output/bug-bounty/{handle}-bounty-{YYYY-MM}/
├── README.md
├── SCOPE.md (auto-generated from platform data)
├── session.json
├── 01-pre-engagement/
│   ├── api/ (platform JSON data)
│   └── authorization-docs/
├── 02-intelligence-gathering/
├── 03-threat-modelling/
├── 04-vulnerability-analysis/
├── 05-exploitation/
├── 06-post-exploitation/
├── 07-reporting/
├── 05-findings/
└── audit-logs/ (if enabled)
```

## NEXT
**On success:** Load `skills/bug-bounty/workflows/phases/00-WORKFLOW.md`
**On failure:** STOP with error context (see Error Handling below)

## CHECKPOINTS
**Exit criteria:**
- [ ] Request classified (research / engagement)
- [ ] Program found in platform data
- [ ] Program active and accepting submissions
- [ ] At least one bounty-eligible in-scope target exists
- [ ] SCOPE.md auto-generated from platform data
- [ ] Engagement directory initialized via init-engagement.ts
- [ ] Security agent delegated with correct parameters

**Error recovery:**
```
Network error (cannot reach GitHub API):
  -> Display: "Cannot reach public data source. Check your internet connection."
  -> Action: ABORT

Program not found:
  -> Run fuzzy search across fetched platform data
  -> Present up to 10 matches for user selection
  -> If no matches: Suggest checking platform website, ABORT

Program inactive (state not public_mode, submissions closed):
  -> Display current state values with warning
  -> Ask: "This program appears inactive. Proceed anyway?"
  -> If No: ABORT

No in-scope targets (zero bounty-eligible assets):
  -> Display: "Program has no bounty-eligible in-scope targets."
  -> Action: ABORT -- cannot proceed without targets

Init-engagement.ts failure:
  -> Display error output from script
  -> Action: ABORT -- engagement directory not created
```

---

## Reference: Context Prompts

### Platform Selection
**Question:** "Which bug bounty platform?"
**Options:**
- **HackerOne** - Largest platform, most programs
- **Bugcrowd** - Strong enterprise focus
- **Intigriti** - European platform, growing catalog
- **YesWeHack** - European, government programs
- **Federacy** - Smaller platform, niche programs
**Default:** HackerOne

### Program Identifier
**Question:** "What is the program name or handle?"
**Input:** Free text (e.g., "security", "crypto", "NETGEAR")
**Default:** None (required)

### Engagement Mode
**Question:** "What type of engagement is this?"
**Options:**
- **Director (Production)** - Full professional pentest, complete deliverables
- **Mentor (Learning)** - Interactive with teaching checkpoints
- **Demo (Testing)** - Quick tool/infrastructure validation
**Default:** Director

### Audit Logging
**Question:** "Audit logging provides compliance and legal defense. Configure?"
**Options:**
- **Keep Default** - Enabled (Director/Mentor), Disabled (Demo)
- **Override: Enable** - Force audit logging on
- **Override: Disable** - Force audit logging off
**Default:** Enabled (Director/Mentor), Disabled (Demo)
**Location:** `{engagement-dir}/audit-logs/`

---

## Reference: Examples

### HackerOne Engagement (Director Mode)
```
/bug-bounty
-> Platform: HackerOne
-> Program: security
-> Mode: Director
-> Audit: Keep Default (Enabled)

Result: Full engagement initialized at private/output/bug-bounty/security-bounty-2026-02/
        SCOPE.md auto-generated with all in-scope assets
        Delegated to security agent for Phase 1 (EXPLORE)
```

### Research Query (List Programs)
```
/bug-bounty list HackerOne programs with IoT scope

Result: Queries local JSON data, displays matching programs
        No engagement created, no security agent invoked
```

### Bugcrowd Quick Test (Demo Mode)
```
/bug-bounty test the NETGEAR program on Bugcrowd
-> Mode: Demo
-> Audit: Keep Default (Disabled)

Result: Engagement at private/output/bug-bounty/netgear-bounty-2026-02/
        SCOPE.md auto-generated, Demo mode validation only
```

---

## Reference: Related Commands

- `/pentest` - Custom client engagements (non-bounty)
- `/bounty-targets` - Manage VPS scrapers and check data freshness
- `/vuln-scan` - Automated scanning without full pentest

---

## Reference: Security

**Data Privacy:**
- Data fetched directly from public GitHub repository
- No private API keys required
- Outputs stored locally in engagement directory
- Raw platform data copied to engagement for audit trail

**Authorization:**
- Public bug bounty programs provide inherent authorization
- Safe harbor status displayed during initialization
- SCOPE.md documents authorization source and program URL
- Out-of-scope assets explicitly excluded

**Execution Safety:**
- Demo mode validates tooling only, no active exploitation
- Exploitation logged for audit (if audit enabled)
- Rate limits respected per platform rules
- No destructive actions without confirmation

**Legal Compliance:**
- Bug bounty programs constitute written authorization
- CFAA compliance enforced via scope validation
- Responsible disclosure followed per platform policy
- Platform-specific engagement rules documented in SCOPE.md

---

**Version:** 2.1
**Last Updated:** 2026-02-17
**Framework:** Intelligence Adjacent (IA)
**Structure:** Universal Prompt Structure v2.0
