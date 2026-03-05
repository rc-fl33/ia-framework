# Observability Skill - Architecture

## Overview

Real-time monitoring dashboard for the IA Framework with WebSocket streaming and integrated markdown editor.

## Data Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTTP-Based Event Pipeline                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Claude Code invokes tool (Read, Write, Bash, etc.)          │
│                         │                                        │
│  2. PostToolUse hook fires                                       │
│                         │                                        │
│  3. observe-events.ts captures event                             │
│                         │                                        │
│  4. HTTP POST → http://localhost:4747/api/events                │
│                         │                                        │
│  5. Server receives event (no file I/O)                          │
│                         │                                        │
│  6. Event added to in-memory ring buffer (1000 max)              │
│                         │                                        │
│  7. WebSocket broadcasts immediately to clients                  │
│                         │                                        │
│  8. Dashboard updates timeline                                   │
│                                                                  │
│  ✓ If server not running: Silent failure, no errors              │
│  ✓ If timeout (500ms): Event lost but hook proceeds              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## Components

### Hook (observe-events.ts)

- **Trigger:** PostToolUse (fires after every tool execution)
- **Input:** Tool name, parameters, result, duration
- **Output:** HTTP POST to server /api/events endpoint
- **Design:** Fire-and-forget with 500ms timeout, never blocks Claude
- **Behavior:** Silent failure if server not running (no error messages)

### Server (server.ts)

- **Runtime:** Bun (native HTTP + WebSocket)
- **Port:** 4000
- **Endpoints:**
  - `GET /api/health` - Health check
  - `GET /api/session` - Current session state
  - `GET /api/events` - Recent events (with since parameter)
  - `POST /api/events` - Receive events from hook
  - `GET /api/files` - Directory listing
  - `GET /api/file` - Read file content
  - `POST /api/file` - Write file (with conflict detection)
  - `WS /stream` - Real-time event stream
- **Static Files:** Serves client/ directory

### File Watcher (watcher.ts)

- **Watches:**
  - `sessions/` - Session state changes
  - Framework directories (skills/, agents/, etc.)
- **Debounce:** 100ms to prevent flood
- **Events:** Broadcast to WebSocket clients (events now via HTTP POST)

### Client (client/)

- **Tech:** Vanilla JS + ES modules (no build step)
- **Editor:** CodeMirror 6 (loaded from CDN)
- **Themes:** 4 built-in (dark, light, dracula, nord)
- **Features:**
  - Activity timeline
  - Session summary
  - File browser
  - Markdown editor with save

## Event Store

### JSONL Format

```jsonl
{"timestamp":"2026-01-15T16:00:00.000Z","sessionId":"abc123","tool":"Read","file_path":"CLAUDE.md","success":true}
{"timestamp":"2026-01-15T16:00:01.000Z","sessionId":"abc123","tool":"Write","file_path":"test.md","success":true}
```

### Ring Buffer (In-Memory)

- **Size:** 1000 events max in memory
- **Persistence:** None (in-memory only, events lost on server restart)
- **Retention:** No automatic cleanup
- **Note:** Historical JSONL files from previous sessions remain in ~/.local/share/ia-monitor/events/ (outside git repo)

## Security

### Allowed Paths (Read)

- sessions/
- plans/
- skills/
- agents/
- commands/
- docs/
- CLAUDE.md, README.md, CHANGELOG.md

### Allowed Paths (Write)

- sessions/
- plans/
- skills/
- agents/
- commands/
- docs/

### Blocked Paths

- hooks/ (system critical)
- tools/ (system critical)
- servers/ (infrastructure)
- .env (credentials)
- .git (repository)

## Theme System

CSS custom properties for consistent theming:

| Variable | Purpose |
|----------|---------|
| `--bg-primary` | Main background |
| `--bg-secondary` | Panel background |
| `--text-primary` | Main text |
| `--accent-primary` | Links, buttons |
| `--accent-success` | Success states |
| `--accent-error` | Error states |

## Performance

- **Event capture:** < 5ms (HTTP POST)
- **Event processing:** < 2ms (in-memory add + broadcast)
- **WebSocket broadcast:** < 5ms per client
- **File reads:** Streamed from disk
- **Memory:** ~10MB typical (1000 events in buffer)

## Dependencies

- Bun runtime (no npm packages)
- CodeMirror 6 (CDN)
- No database required
