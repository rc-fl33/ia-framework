---
name: report-builder-start
description: Start the Report Builder visual editor on http://localhost:3002
tool: quarto
agent: base
classification: public
---

# /report-builder-start - Start Report Builder

**Start the Report Builder visual editor on http://localhost:3002**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
QUARTO_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/quarto" && "$QUARTO_DIR/scripts/manage.sh" start
```

## Response

The command will output:
- Server startup message with PID
- Editor URL: http://localhost:3002
- Or notification if server already running

## Features

The Report Builder provides:
- Brand editor with color pickers (primary, secondary, severity colors)
- Typography controls (font family, size, line height)
- Live preview of styled reports
- Template section editor for all skill report types

## Pages

- `/` - Brand editor (colors, fonts) + Live Preview
- `/builder` - Template section editor
- `/preview` - Full rendered report preview

## See Also

- `/report-builder-stop` - Stop the Report Builder

---

**Tool Reference:** `tools/quarto/README.md`
