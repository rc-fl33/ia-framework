---
name: mermaid-editor-start
description: Start the Mermaid Live Editor visual editor on http://localhost:8080
tool: mermaid
agent: base
classification: public
---

# /mermaid-editor-start - Start Mermaid Live Editor

**Start the Mermaid Live Editor visual editor on http://localhost:8080**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
MERMAID_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/mermaid" && "$MERMAID_DIR/scripts/manage.sh" start
```

## Response

The command will output:
- Docker container startup message
- Editor URL: http://localhost:8080
- Or notification if server already running

## Features

The Mermaid Live Editor provides:
- Real-time mermaid diagram preview as you type
- Export to SVG, PNG
- Multiple diagram types (flowchart, sequence, class, state, ER, etc.)
- Shareable URLs for diagrams
- Theme customization

## Diagram Types Supported

- Flowchart
- Sequence diagram
- Class diagram
- State diagram
- Entity Relationship diagram
- Gantt chart
- Pie chart
- User journey
- Git graph
- And more...

## Notes

- Requires Docker to be installed and running
- Uses the official `ghcr.io/mermaid-js/mermaid-live-editor` image
- Runs on port 8080 by default (internal Docker port maps to 8080)

## See Also

- `/mermaid-editor-stop` - Stop the Mermaid Live Editor

---

**Tool Reference:** `tools/mermaid/TOOL.md`
