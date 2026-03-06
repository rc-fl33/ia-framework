# Caido Container Tools

**Image:** caido/caido:latest
**Purpose:** Web security proxy for API and web application testing
**Access Method:** Web UI
**Ports:** 7000 (web UI), 8080 (proxy - internal)

---

## Features

### Core Capabilities
- **HTTP/1.1, HTTP/2, WebSocket Support:** Full protocol coverage for modern web apps
- **Interactive Proxy:** Intercept, modify, and replay requests
- **Site Map:** Automatic endpoint discovery
- **Request History:** Full traffic capture with filtering
- **Modern UI:** Clean, fast interface for traffic analysis
- **GraphQL Support:** Native GraphQL query inspection
- **TLS/SSL:** Built-in certificate generation for HTTPS interception

### Key Advantages Over Reaper
- **WebSocket Inspection:** Full WebSocket frame capture and analysis
- **Interactive Modification:** Modify requests before forwarding
- **GraphQL Awareness:** Structured GraphQL query viewing
- **Modern Protocol Support:** HTTP/2, Server-Sent Events
- **Built-in UI:** No separate query interface needed

---

## Quick Start

```bash
# Start Caido on VPS
cd ~/ia-framework/skills/bug-bounty/containers/caido/deploy
docker-compose up -d

# Access via Twingate (connect to security network first)
# Web UI: http://caido.internal:7000

# Configure browser proxy:
# - Host: caido.internal
# - Port: 8080 (proxy port)

# Install Caido CA certificate in browser (first launch)
# Download from http://caido.internal:7000/settings/certificates
```

---

## Use Cases

### When to Use Caido vs Reaper

**Use Caido for:**
- WebSocket traffic analysis (e.g., Grok Imagine WebSocket listener discovery)
- Interactive request modification and replay
- GraphQL API testing with structured query viewing
- HTTP/2 and modern protocol testing
- Real-time traffic inspection with UI

**Use Reaper for:**
- Bulk traffic capture to SQLite for programmatic analysis
- Automated crawling with SQL queries
- Long-term traffic storage and batch processing
- Integration with custom scripts via SQL

**Use Both:**
- Run simultaneously for comprehensive coverage
- Caido for interactive analysis, Reaper for bulk capture
- Caido proxy → Upstream to Reaper for dual capture

---

## Typical Workflow

### API Reverse Engineering

```bash
# 1. Start Caido
docker-compose up -d

# 2. Configure browser to use caido.internal:8080 as proxy

# 3. Browse target site (e.g., grok.com/imagine)

# 4. In Caido UI:
#    - View all requests in HTTP History
#    - Filter by host (e.g., grok.com)
#    - Inspect WebSocket connections in WS tab
#    - Copy requests as cURL for replication

# 5. For WebSocket debugging:
#    - Go to WebSocket tab
#    - See connection handshakes
#    - View all frames sent/received
#    - Export WebSocket messages

# 6. For GraphQL:
#    - GraphQL queries auto-detected
#    - View operation names and variables
#    - Modify queries in Repeater
```

---

## WebSocket Analysis

**Key Feature:** Unlike most proxies, Caido captures full WebSocket traffic

```
1. Browser connects to wss://site.com/ws
2. Caido shows:
   - Connection handshake (HTTP Upgrade)
   - All frames sent (ping, pong, data)
   - All frames received
   - Frame timestamps
3. Export as JSON or replay manually
```

**Example: Grok Imagine WebSocket Discovery**
```
Scenario: Browser shows % completion, no HTTP polling visible
Solution: Caido WebSocket tab shows wss://grok.com/ws/imagine/listen
Result: Discovered real-time completion mechanism
```

---

## Data Storage

- **Inside container:** `/home/caido/.local/share/caido`
- **Outside container:** `/opt/pentest-data/caido` (persistent)
- **Access:** Web UI at http://caido.internal:7000
- **Export:** JSON, HAR, cURL formats available in UI

---

## See Also

- Official docs: https://docs.caido.io/
- Docker Hub: https://hub.docker.com/r/caido/caido
- Comparison with Burp Suite: Modern UI, faster, no Java dependency
- Comparison with Reaper: Interactive vs programmatic, UI vs SQL

---

## Sources

- [Caido Docker Image](https://hub.docker.com/r/caido/caido)
- [Installation Documentation](https://docs.caido.io/guides/user_guide/docker)
