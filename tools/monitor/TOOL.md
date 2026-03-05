---
name: monitor
type: infrastructure
classification: public
description: Intelligence Adjacent monitoring dashboard - real-time framework health and activity tracking
version: 1.0
last_updated: 2026-02-14
env_required: false
commands:
  - /monitor-start
  - /monitor-stop
---

> **FOR AI AGENTS:** Real-time monitoring dashboard for framework activity, sessions, and health metrics.
> Load when: User wants to monitor framework activity, view session history, or troubleshoot issues

---

# Intelligence Adjacent Monitor

**Real-time monitoring dashboard for framework health, sessions, and activity tracking**

Provides web-based dashboard showing active sessions, recent activity, framework health, and diagnostic information.

---

## Classification

**Type:** infrastructure
**Visibility:** public
**Commands:** /monitor-start, /monitor-stop

---

## Purpose

Visualizes framework operations in real-time:

1. **Session tracking:** View active and historical sessions
2. **Activity feed:** Real-time updates on framework operations
3. **Health metrics:** Framework status, disk usage, memory
4. **Diagnostics:** Logs, errors, performance data

**Why it exists:** Understanding what the framework is doing requires checking multiple log files and sessions. The monitor provides a unified dashboard.

**Framework integration:** Runs as background service, accessed via web browser

---

## Usage

### Commands

```bash
# Start dashboard server
/monitor-start

# Stop dashboard server
/monitor-stop
```

### Access Dashboard

**Default URL:** http://localhost:3000

**Pages:**
- `/` - Overview dashboard
- `/sessions` - Session history
- `/activity` - Real-time activity feed
- `/health` - System health metrics
- `/logs` - Recent logs and errors

---

## Configuration

### Environment Variables

**Optional (has sensible defaults):**
```bash
MON_PORT=3000                    # Dashboard port (default: 3000)
MON_HOST=localhost               # Bind host (default: localhost)
MON_REFRESH_INTERVAL=5000        # Auto-refresh ms (default: 5000)
```

**Setup:**
```bash
# Usually not needed - defaults work for most users
# If customizing:
echo "MON_PORT=8080" >> .env
source .env
```

---

## Dashboard Features

### Session View

**Shows:**
- Active sessions (currently running)
- Recent sessions (last 24 hours)
- Session duration
- Skills used
- Commands executed
- Session status (running, completed, failed)

**Actions:**
- View session transcript
- Resume session
- Export session data

### Activity Feed

**Real-time updates:**
- Tool calls
- Skill invocations
- File operations
- Git operations
- API calls
- Errors and warnings

**Filters:**
- By type (tool, skill, file, git, api)
- By severity (info, warning, error)
- By time range (last hour, day, week)

### Health Metrics

**System:**
- CPU usage
- Memory usage
- Disk usage
- Framework uptime

**Framework:**
- Active sessions count
- Total sessions today
- Error rate
- API quota usage

**Services:**
- Docker containers status (if using grok, notmint, etc.)
- Hook status
- Validation status

### Logs

**Log types:**
- Framework logs
- Session logs
- Hook logs
- Validation logs
- Error logs

**Search:**
- Full-text search
- Filter by level
- Filter by component
- Time range

---

## Architecture

```
User Browser (localhost:3000)
    ↓
Monitor Server (Bun)
    ├─→ Session tracker (reads sessions/)
    ├─→ Activity watcher (watches file-history/)
    ├─→ Health checker (system metrics)
    └─→ Log aggregator (reads logs/)
    ↓
Real-time Dashboard (WebSocket updates)
```

**Components:**
- **Server:** Bun HTTP server with WebSocket
- **Frontend:** HTML + CSS + vanilla JS
- **Data sources:** sessions/, file-history/, logs/
- **Updates:** WebSocket push every 5 seconds

---

## API Reference

### Start Server

```typescript
import { startMonitor } from '@/tools/monitor/server';

const server = await startMonitor({
  port: 3000,
  host: 'localhost',
  refreshInterval: 5000
});

console.log(`Monitor running at http://localhost:3000`);
```

### Stop Server

```typescript
import { stopMonitor } from '@/tools/monitor/server';

await stopMonitor();
```

### Get Metrics

```typescript
import { getHealthMetrics } from '@/tools/monitor/client';

const metrics = await getHealthMetrics();
// {
//   cpu: { usage: 45.2, cores: 8 },
//   memory: { used: 4096, total: 16384 },
//   disk: { used: 102400, total: 512000 },
//   framework: {
//     uptime: 86400,
//     activeSessions: 2,
//     totalToday: 15,
//     errorRate: 0.02
//   }
// }
```

---

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/start.ts` | Start monitor server |
| `scripts/stop.ts` | Stop monitor server |
| `scripts/setup.ts` | First-time setup |
| `server/index.ts` | HTTP server |
| `server/session-tracker.ts` | Track sessions |
| `server/activity-watcher.ts` | Watch activity |
| `server/health-checker.ts` | System metrics |
| `server/log-aggregator.ts` | Aggregate logs |
| `client/index.ts` | Frontend entry point |

---

## Dependencies

**Runtime:**
- Bun (HTTP server + WebSocket)
- Node.js fs/path (file system access)

**Frontend:**
- No build step required
- Vanilla JavaScript
- WebSocket API

---

## Troubleshooting

### Port Already in Use

**Symptom:** `Error: Port 3000 already in use`

**Fix:**
```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
export MON_PORT=8080
/monitor-start
```

### Dashboard Not Loading

**Symptom:** Browser shows connection refused

**Check:**
```bash
# Is server running?
ps aux | grep monitor

# Check logs
cat logs/monitor.log

# Restart
/monitor-stop
/monitor-start
```

### No Data Showing

**Symptom:** Dashboard loads but shows no sessions/activity

**Causes:**
- No sessions recorded yet (create a session)
- Permissions issue (check file permissions on sessions/)
- Server not watching correct directories

**Fix:**
```bash
# Verify server config
cat tools/monitor/workflows/config.yaml

# Check sessions directory
ls -la sessions/

# Restart server
/monitor-stop
/monitor-start
```

### WebSocket Connection Failed

**Symptom:** Dashboard shows but doesn't update

**Fix:**
```bash
# Check browser console for WebSocket errors
# Usually firewall or localhost restriction

# Test WebSocket directly
curl http://localhost:3000/health

# Restart server
/monitor-stop
/monitor-start
```

---

## Security

**Access control:**
- Binds to localhost by default (not exposed to network)
- No authentication (assumes trusted local environment)
- Read-only dashboard (cannot modify sessions or files)

**For remote access:**
- Use SSH tunnel: `ssh -L 3000:localhost:3000 user@host`
- Or configure reverse proxy with authentication

**Data exposure:**
- Dashboard shows session transcripts (may contain sensitive info)
- Only accessible from local machine by default

---

## Consumers

> Which skills, hooks, tools, and workflows USE this tool.

No direct TypeScript importers — invoked via `/monitor-start`, `/monitor-stop` slash commands. Runs as a standalone web server accessible at localhost:3000.

**Tools monitored by this dashboard:**
- `tools/framework/sessions/` — session data displayed in activity feed
- `tools/n8n/` — n8n instance health shown in dashboard
- `tools/grok2api/deploy/` — grok2api container status shown in dashboard

---

## Related Tools

- **sessions** (tools/framework/sessions/): Session management
- **validation** (tools/validation/): Framework health checks
- **git** (tools/git/): Session tracking integration

---

## Version History

- **1.0** (2026-01-15): Initial release with session tracking, activity feed, health metrics

---

## References

- **Setup Guide:** tools/monitor/docs/ops-setup.md
- **Workflow:** tools/monitor/docs/ops-workflow.md
- **Architecture:** tools/monitor/docs/architecture.md
- **Security:** tools/monitor/docs/security-summary.md

---

**Framework:** Intelligence Adjacent (IA)
**Maintainer:** Framework Team
