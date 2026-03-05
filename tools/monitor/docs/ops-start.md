# Phase: START (Server Launch)

**Maps to Universal Phase:** EXECUTE

**Purpose:** Start the monitoring server

**Success Criteria Mutation:** LAUNCH server and VERIFY running

---

## Gate Question

> "Is the monitoring server running and accessible?"

**Pass Criteria:**
- [ ] Server process started
- [ ] Listening on port 4747
- [ ] Health endpoint responding

---

## What Happens

### Step 1: Start Server

```bash
# Use management script
./tools/monitor/scripts/manage.sh start
```

Or manually:
```bash
cd tools/monitor/scripts && bun run server.ts &
```

### Step 2: Verify Server Started

```bash
# Wait for startup
sleep 2

# Check health endpoint
curl -s http://localhost:4747/api/health
```

### Step 3: Confirm Accessibility

```markdown
## Monitor Server Started

**URL:** http://localhost:4747
**Status:** Running
**PID:** [process id]

Dashboard is ready for use.
```

---

## Exit Criteria

- [ ] Server process running
- [ ] Health check passing
- [ ] Dashboard accessible at localhost:4747
- [ ] Ready for Phase 3: Operate

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Server won't start | Check logs, verify dependencies |
| Port conflict | Stop conflicting process or change port |
| Health check fails | Restart server, check error logs |
| Process dies immediately | Check for TypeScript errors |
