# Monitor Workflow - Multi-Prompt Chain

**5 phases with mandatory gates. Each phase MUST complete before the next.**

**Philosophy:** Simple prompt chaining with explicit checkpoints. Agent handles phase-to-phase flow.

---

## Phase Overview

```
SETUP → START → OPERATE → DIAGNOSE → STOP
```

| Phase | Gate | Output |
|-------|------|--------|
| 1. SETUP | Dependencies verified, port available | Environment ready |
| 2. START | Server running, dashboard accessible | Server PID recorded |
| 3. OPERATE | Dashboard loaded, monitoring active | User interacting |
| 4. DIAGNOSE | Issues identified, logs reviewed | Troubleshooting complete |
| 5. STOP | Server stopped cleanly | Resources released |

---

## Execution Flow

### Multi-Prompt Chain Pattern

1. **Detect current phase** - Check server status and user intent
2. **Load phase prompt** - Read the corresponding phase file from `tools/monitor/phases/0X-{phase}.md`
3. **Execute phase steps** - Follow the instructions in the phase prompt exactly
4. **Verify gate** - Check that phase requirements are met
5. **Show checkpoint** - Display phase completion summary to user
6. **Proceed or stop** - Move to next phase if gate passes

---

## Phase Detection Logic

```
IF user says "start monitor" or "start dashboard":
  IF server NOT running → Load 01-setup.md
  ELSE IF server running → Already operational, show URL

IF user says "stop monitor" or "stop dashboard":
  → Load 05-stop.md

IF user reports issues:
  → Load 04-diagnose.md

IF server running AND user viewing dashboard:
  → Load 03-operate.md (monitoring mode)
```

**Note:** Monitor is operational workflow, not linear generation workflow. Phases can be accessed based on intent, not sequential completion.

---

## Phase Files

| Phase | File | Gate |
|-------|------|------|
| 1 | `01-setup.md` | Dependencies verified, port available |
| 2 | `02-start.md` | Server running on port 4000 |
| 3 | `03-operate.md` | Dashboard accessible, monitoring active |
| 4 | `04-diagnose.md` | Issues identified and resolved |
| 5 | `05-stop.md` | Server stopped, resources cleaned up |

---

## Data Storage

**Server State (stored outside git repo):**
- `~/.local/share/ia-monitor/events/*.jsonl` - Event logs
- Override location: set `IA_MONITOR_DATA_DIR` env var
- PID tracked by `scripts/manage.sh`

**Dashboard URL:** http://localhost:4747

---

## Metadata Tracking

Each phase should update progress via TodoWrite:

```
[ ] Phase 1: Setup - Verify dependencies and environment
[ ] Phase 2: Start - Launch server on port 4000
[ ] Phase 3: Operate - Monitor dashboard activity
[ ] Phase 4: Diagnose - Troubleshoot issues (if needed)
[ ] Phase 5: Stop - Cleanly stop server
```

---

## Critical Rules

1. **Check before start** - Verify dependencies and port availability first
2. **ALWAYS show checkpoint output** - User must see phase completion summary
3. **Track server PID** - Use `scripts/manage.sh` for lifecycle management
4. **Each phase is self-contained** - Load prompt, execute, verify gate, show checkpoint
5. **Localhost-only** - Server binds to 127.0.0.1 (network isolated)
6. **Security first** - Monitor is secure for localhost use only

## Checkpoint Output Format

**After each phase completion, show:**

```
✅ PHASE X COMPLETE: {Phase Name}
Status: {phase-specific status}
{Phase-specific metrics: server running, URL available, port bound, etc.}
Gate: PASSED ✓

→ Ready for Phase X+1: {Next Phase Name}
```

**If gate fails:**

```
⛔ PHASE X BLOCKED: {Phase Name}
Issue: {specific blocker}
Action: {what needs to be fixed}

→ Fix and retry Phase X
```

---

**Framework:** Intelligence Adjacent v1.0.0
