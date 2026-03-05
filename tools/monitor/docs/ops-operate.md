# Phase: OPERATE (Active Monitoring)

**Maps to Universal Phase:** MAINTAIN

**Purpose:** Normal operation state - server running and accepting connections

**Success Criteria Mutation:** MONITOR activity and SERVE dashboard

---

## Gate Question

> "Is the dashboard functioning correctly during normal operation?"

**Pass Criteria:**
- [ ] WebSocket connections active
- [ ] Events flowing to dashboard
- [ ] File browser responsive
- [ ] Editor saves working

---

## What Happens

### Normal Operation

During this phase, the server:
1. Accepts HTTP requests for dashboard
2. Maintains WebSocket connections for real-time updates
3. Watches file system for changes
4. Processes JSONL event logs
5. Serves API endpoints

### Monitoring Points

| Component | Check | Frequency |
|-----------|-------|-----------|
| HTTP Server | Health endpoint | On demand |
| WebSocket | Connection count | Real-time |
| File Watcher | Events detected | Real-time |
| Event Store | JSONL processing | On activity |

### User Actions Available

- View activity timeline
- Browse files in allowed directories
- Edit markdown files
- View PDFs and images
- Change themes

---

## Exit Criteria

- [ ] Server remains responsive
- [ ] No errors in operation
- [ ] User can access dashboard
- [ ] Phase 4: Diagnose (if issues) or Phase 5: Stop (when done)

---

## Error Recovery

| Error | Recovery |
|-------|----------|
| WebSocket disconnect | Auto-reconnect in client |
| File watcher stops | Restart server |
| API errors | Check server logs |
| High memory usage | Restart server, clear old events |
