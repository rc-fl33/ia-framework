---
name: monitor-start
description: Start the Intelligence Adjacent monitoring dashboard server
tool: monitor
agent: base
classification: public
---

# /monitor-start - Start Monitor Dashboard

**Start the real-time monitoring dashboard server on http://localhost:4747**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
MONITOR_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/monitor" && "$MONITOR_DIR/scripts/manage.sh" start
```

## Response

The command will output:
- Server startup message with PID
- Dashboard URL: http://localhost:4747
- Or notification if server already running

## Troubleshooting

If startup fails, see `tools/monitor/docs/ops-diagnose.md` for troubleshooting steps.

## See Also

- `/monitor-stop` - Stop the monitor server

---

**Tool Reference:** `tools/monitor/README.md`
