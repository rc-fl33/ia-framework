# Monitor Skill Verification

## Quick Verification

```bash
# 1. Locate skill (uses framework root or resolves from symlink)
MONITOR_DIR="${IA_FRAMEWORK_ROOT:-$(pwd)}/tools/monitor"

# 2. Start server
"$MONITOR_DIR/scripts/manage.sh" start

# 3. Check health
curl http://localhost:4747/api/health

# 4. Open dashboard
open http://localhost:4747

# 5. Stop server
"$MONITOR_DIR/scripts/manage.sh" stop
```

---

## Full Verification Checklist

### Server

- [ ] `./manage.sh start` starts server without errors
- [ ] `./manage.sh status` shows running
- [ ] `./manage.sh stop` stops server cleanly
- [ ] Server runs on port 4747

### API Endpoints

- [ ] `GET /api/health` returns `{"status":"ok"}`
- [ ] `GET /api/session` returns current session
- [ ] `GET /api/events` returns event array
- [ ] `POST /api/events` accepts events from hook (200 with `{"success":true}`)
- [ ] `GET /api/files?path=sessions` lists files
- [ ] `GET /api/file?path=CLAUDE.md` returns content
- [ ] `POST /api/file` saves file correctly

### WebSocket

- [ ] `/stream` accepts connections
- [ ] Events broadcast when tool used
- [ ] File changes broadcast

### Dashboard

- [ ] Loads without JavaScript errors
- [ ] Activity timeline shows events
- [ ] Session summary displays correctly
- [ ] File browser shows directories
- [ ] Click file opens in editor
- [ ] Editor syntax highlighting works
- [ ] Ctrl+S saves file
- [ ] Theme picker changes theme
- [ ] Theme persists on reload

### Themes

- [ ] Dark theme (default)
- [ ] Light theme
- [ ] Dracula theme
- [ ] Nord theme
- [ ] All themes have WCAG AA contrast

---

## Integration Test

1. Start monitor server
2. Open dashboard in browser
3. In Claude Code, read a file
4. Verify event appears in timeline
5. Click file in browser
6. Edit content in editor
7. Save with Ctrl+S
8. In Claude Code, read same file
9. Verify changes are visible

---

## Troubleshooting

### Server won't start
- Check port 4747 not in use: `lsof -i :4747`
- Check Bun installed: `bun --version`

### No events appearing
- Verify hook registered in settings.json
- Check observe-events.ts in hooks
- Verify HTTP POST is reaching server (check server logs)
- If server not running, events are silently dropped (expected behavior)

### Files not saving
- Check path is in allowed list
- Check file permissions
