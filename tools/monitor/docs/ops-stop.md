# Phase: STOP (Server Shutdown)

**Maps to Universal Phase:** CLEANUP

**Purpose:** Gracefully stop the monitoring server

**Success Criteria Mutation:** SHUTDOWN server and CONFIRM stopped

---

## Gate Question

> "Has the monitoring server been stopped cleanly?"

**Pass Criteria:**
- [ ] Server process terminated
- [ ] Port 4747 freed
- [ ] No orphan processes

---

## What Happens

### Step 1: Stop Server

```bash
# Use management script
./tools/monitor/scripts/manage.sh stop
```

Or manually:
```bash
# Find and kill process
pkill -f "bun.*server.ts"
```

### Step 2: Verify Stopped

```bash
# Check no process running
pgrep -f "bun.*server.ts" || echo "Server stopped"

# Check port is free
lsof -i :4747 || echo "Port 4747 available"
```

### Step 3: Confirm to User

```markdown
## Monitor Server Stopped

**Status:** Stopped
**Port 4747:** Released
**Events:** Preserved in ~/.local/share/ia-monitor/events/

To restart: /monitor-start
```

---

## Exit Criteria

- [ ] Server process stopped
- [ ] Port 4747 released
- [ ] User informed
- [ ] Workflow complete

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| Process won't stop | Force kill with SIGKILL |
| Port still in use | Identify orphan process |
| Zombie process | Manual cleanup required |
