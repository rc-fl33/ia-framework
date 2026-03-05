# Phase: DIAGNOSE (Troubleshooting)

**Maps to Universal Phase:** DEBUG

**Purpose:** Diagnose issues when monitor is not working correctly

**Success Criteria Mutation:** IDENTIFY issues and RESOLVE problems

---

## Gate Question

> "What is preventing the monitor from working correctly?"

**Pass Criteria:**
- [ ] Issue identified
- [ ] Root cause determined
- [ ] Resolution path clear

---

## What Happens

### Step 1: Check Server Status

```bash
# Is server running?
pgrep -f "bun.*server.ts"

# Check process details
ps aux | grep server.ts
```

### Step 2: Check Logs

```bash
# Server output (if running in foreground)
# Or check system logs

# Check event files
ls -la ~/.local/share/ia-monitor/events/
```

### Step 3: Test Endpoints

```bash
# Health check
curl -v http://localhost:4747/api/health

# Session info
curl http://localhost:4747/api/session

# Events
curl http://localhost:4747/api/events
```

### Step 4: Common Issues

| Symptom | Likely Cause | Solution |
|---------|--------------|----------|
| 404 on all routes | Server not running | Start server |
| WebSocket won't connect | Firewall/proxy | Check network |
| Events not showing | No activity | Generate some events |
| Files not loading | Permission issue | Check allowed paths |
| Editor won't save | Path not writable | Check directory permissions |

---

## Exit Criteria

- [ ] Issue diagnosed
- [ ] Solution identified
- [ ] Return to Phase 2 (Start) or Phase 3 (Operate)

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Cannot diagnose | Provide logs to user |
| Multiple issues | Address in priority order |
| Persistent failure | Reinstall dependencies |
