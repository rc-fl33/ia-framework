#!/bin/bash
#
# Grok Anthropic Proxy Management Script
#
# Runs an Anthropic-to-OpenAI proxy in front of grok2api (localhost:8000)
# so Claude Code can use Grok models via ANTHROPIC_BASE_URL.
#
# Usage:
#   ./proxy-manage.sh start    - Start proxy in background
#   ./proxy-manage.sh stop     - Stop proxy
#   ./proxy-manage.sh status   - Check proxy status
#   ./proxy-manage.sh logs     - Tail proxy logs
#   ./proxy-manage.sh restart  - Restart proxy
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROXY_SCRIPT="$SCRIPT_DIR/anthropic-proxy.ts"
DATA_DIR="$HOME/.local/share/ia-grok-proxy"
PID_FILE="$DATA_DIR/proxy.pid"
LOG_FILE="$DATA_DIR/proxy.log"
PORT=${GROK_PROXY_PORT:-3001}
GROK2API_URL=${GROK2API_URL:-http://localhost:8000}

mkdir -p "$DATA_DIR"

is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" >/dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

check_grok2api() {
  if ! curl -s --max-time 3 "$GROK2API_URL/v1/models" >/dev/null 2>&1; then
    echo "Warning: grok2api not responding at $GROK2API_URL"
    echo "Start it with: docker compose -f tools/grok2api/deploy/docker-compose.yml up -d"
    return 1
  fi
  return 0
}

start() {
  if is_running; then
    echo "Proxy already running (PID: $(cat "$PID_FILE")) on http://localhost:$PORT"
    exit 0
  fi

  if lsof -i ":$PORT" >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  check_grok2api || true

  echo "Starting Grok anthropic proxy..."
  PORT="$PORT" GROK2API_URL="$GROK2API_URL" nohup bun "$PROXY_SCRIPT" > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  sleep 1
  if is_running; then
    echo "Proxy started (PID: $(cat "$PID_FILE"))"
    echo "Endpoint: http://localhost:$PORT"
    echo "Forwarding to: $GROK2API_URL"
    echo "Logs: $LOG_FILE"
  else
    echo "Failed to start proxy — check logs: $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
}

stop() {
  if ! is_running; then
    echo "Proxy is not running"
    exit 0
  fi

  local pid=$(cat "$PID_FILE")
  echo "Stopping proxy (PID: $pid)..."
  kill "$pid" 2>/dev/null

  local count=0
  while [ $count -lt 10 ] && is_running; do
    sleep 0.5
    count=$((count + 1))
  done

  if is_running; then
    kill -9 "$pid" 2>/dev/null
  fi

  rm -f "$PID_FILE"
  echo "Proxy stopped"
}

status() {
  if is_running; then
    local pid=$(cat "$PID_FILE")
    echo "Proxy running (PID: $pid) on http://localhost:$PORT"
    if curl -s --max-time 2 "http://localhost:$PORT/v1/models" >/dev/null 2>&1; then
      echo "Health: OK"
    else
      echo "Health: NOT RESPONDING"
    fi
  else
    if lsof -i ":$PORT" >/dev/null 2>&1; then
      echo "Proxy not running but port $PORT is in use by another process"
    else
      echo "Proxy not running"
    fi
  fi
}

logs() {
  if [ -f "$LOG_FILE" ]; then
    tail -f "$LOG_FILE"
  else
    echo "No log file found at $LOG_FILE"
  fi
}

case "${1:-}" in
  start)   start ;;
  stop)    stop ;;
  status)  status ;;
  logs)    logs ;;
  restart) stop; sleep 1; start ;;
  *)
    echo "Usage: $0 {start|stop|status|logs|restart}"
    exit 1
    ;;
esac
