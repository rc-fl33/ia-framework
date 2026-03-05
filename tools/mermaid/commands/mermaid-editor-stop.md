---
name: mermaid-editor-stop
description: Stop the Mermaid Live Editor visual editor
tool: mermaid
agent: base
classification: public
---

# /mermaid-editor-stop - Stop Mermaid Live Editor

**Stop the Mermaid Live Editor Docker container**

> **Type:** Infrastructure tool command

## Default Action

**Execute immediately — no confirmation needed:**

```bash
MERMAID_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/mermaid" && "$MERMAID_DIR/scripts/manage.sh" stop
```

## Response

The command will output:
- Confirmation that the container was stopped
- Or notification if no container was running

## Notes

- Stops and removes the Docker container
- Does not remove the Docker image
- Safe to run even if editor is not running

## See Also

- `/mermaid-editor-start` - Start the Mermaid Live Editor

---

**Tool Reference:** `tools/mermaid/TOOL.md`
