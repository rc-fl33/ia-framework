---
name: monitor-stop
description: Stop the Intelligence Adjacent monitoring dashboard server
tool: monitor
agent: base
classification: public
---

# /monitor-stop - Stop Monitor Dashboard

**Stop the real-time monitoring dashboard server.**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
MONITOR_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/monitor" && "$MONITOR_DIR/scripts/manage.sh" stop
```

## Response

The command will output:
- Server stopped message with previous PID
- Or notification if server not running

## See Also

- `/monitor-start` - Start the monitor server

---

**Tool Reference:** `tools/monitor/README.md`
