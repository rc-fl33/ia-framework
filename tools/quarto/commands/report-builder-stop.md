---
name: report-builder-stop
description: Stop the Report Builder visual editor
tool: quarto
agent: base
classification: public
---

# /report-builder-stop - Stop Report Builder

**Stop the Report Builder visual editor.**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
QUARTO_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/quarto" && "$QUARTO_DIR/scripts/manage.sh" stop
```

## Response

The command will output:
- Server stopped message with previous PID
- Or notification if server not running

## See Also

- `/report-builder-start` - Start the Report Builder

---

**Tool Reference:** `tools/quarto/README.md`
