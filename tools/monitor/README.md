# Monitor Tool

**Real-time monitoring dashboard for the IA Framework with integrated markdown editor.**

> **Type:** Infrastructure tool (not a skill — server lifecycle management)
> **Agent:** engineer (for troubleshooting), base claude (for start/stop)
> **Commands:** `/monitor-start`, `/monitor-stop` (discovered via `tools/monitor/commands/`)

## Quick Start

```bash
/monitor-start    # Start server
/monitor-stop     # Stop server
```

Dashboard: http://localhost:4747

## Features

### Core Monitoring
- **Activity Timeline** - Real-time tool events with WebSocket streaming
- **Session Summary** - Duration, files, commits tracking
- **File Browser** - Navigate framework files with tree view
- **Recent Files** - Quick access to modified files

### Content Editing
- **Markdown Editor** - Full preview and edit modes
- **Syntax Highlighting** - Code viewer with Prism.js
- **Multi-Format Support** - Markdown, code, text, PDF, images
- **File Operations** - Read, write, delete with conflict detection

### Terminal (New)
- **Integrated Shell** - Full bash terminal in browser
- **Split View** - Resizable horizontal panels
- **Real-time I/O** - xterm.js with WebSocket streaming
- **Secure Execution** - Environment filtering, session limits

### Theming
- **Multiple Themes** - Dark, Light, Dracula, Nord
- **Neon Accents** - Custom green branding (#3bff00)

## Security

**✅ Secure for localhost development use**

The monitor dashboard includes comprehensive security protections:
- Localhost-only binding (127.0.0.1)
- Path traversal prevention
- Environment variable filtering
- Terminal session limits
- Origin validation

**❌ Not safe for network exposure** without additional hardening (authentication, HTTPS, rate limiting)

**See**: `docs/SECURITY-SUMMARY.md` for complete security documentation

## Operational Guides

- `docs/ops-setup.md` - Dependency verification and environment prep
- `docs/ops-start.md` - Server launch procedure
- `docs/ops-operate.md` - Normal operation monitoring
- `docs/ops-diagnose.md` - Troubleshooting guide
- `docs/ops-stop.md` - Graceful shutdown procedure
- `docs/ops-workflow.md` - Lifecycle overview

## Data Storage

Event logs and server state are stored **outside the git repository** to prevent accidental credential exposure:

```
~/.local/share/ia-monitor/
├── events/          # JSONL event logs (tool calls, file changes)
├── .server.pid      # PID file for running server
└── server.log       # Server output log
```

Override location with `IA_MONITOR_DATA_DIR` environment variable.

## Files

- `README.md` - This file (tool documentation)
- `STATUS.md` - Readiness tracking
- `VERIFY.md` - Verification checklist
- `commands/` - Slash command definitions (mon-start, mon-stop)
- `scripts/` - Server implementation (Bun + WebSocket)
- `client/` - Dashboard UI (vanilla JS + xterm.js)
- `docs/` - Architecture, security, and operational documentation
  - `architecture.md` - System design
  - `SECURITY-SUMMARY.md` - Security overview
  - `SECURITY-REVIEW.md` - Detailed vulnerability analysis
  - `SECURITY-FIXES-APPLIED.md` - Remediation documentation
