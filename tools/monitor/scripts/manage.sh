#!/bin/bash
#
# Monitor Server Management Script
#
# Usage:
#   ./manage.sh start      - Start server in background (default)
#   ./manage.sh start-fg   - Start server in foreground
#   ./manage.sh stop       - Stop background server
#   ./manage.sh status     - Check server status
#   ./manage.sh logs       - View server logs
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SERVER_SCRIPT="$SCRIPT_DIR/server.ts"
MONITOR_DATA_DIR="${IA_MONITOR_DATA_DIR:-$HOME/.local/share/ia-monitor}"
PID_FILE="$MONITOR_DATA_DIR/.server.pid"
LOG_FILE="$MONITOR_DATA_DIR/server.log"
PORT=${MONITOR_PORT:-4747}

# Ensure data directory exists (outside any git repo)
mkdir -p "$(dirname "$PID_FILE")"

start() {
  if is_running; then
    echo "Server is already running (PID: $(cat "$PID_FILE"))"
    exit 1
  fi

  # Check port availability
  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting monitor server in background..."
  cd "$SCRIPT_DIR"
  nohup bun run server.ts > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  sleep 1
  if is_running; then
    echo "Server started (PID: $(cat "$PID_FILE"))"
    echo "Dashboard: http://localhost:$PORT"
    echo "Logs: $LOG_FILE"
  else
    echo "Failed to start server"
    rm -f "$PID_FILE"
    exit 1
  fi
}

start_fg() {
  if is_running; then
    echo "Server is already running (PID: $(cat "$PID_FILE"))"
    exit 1
  fi

  # Check port availability
  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting monitor server in foreground..."
  cd "$SCRIPT_DIR"
  bun run server.ts
}

stop() {
  if ! is_running; then
    echo "Server is not running"
    exit 0
  fi

  local pid=$(cat "$PID_FILE")
  echo "Stopping server (PID: $pid)..."

  kill "$pid" 2>/dev/null

  # Wait for graceful shutdown
  local count=0
  while [ $count -lt 10 ] && is_running; do
    sleep 0.5
    count=$((count + 1))
  done

  if is_running; then
    echo "Force killing..."
    kill -9 "$pid" 2>/dev/null
  fi

  rm -f "$PID_FILE"
  echo "Server stopped"
}

status() {
  if is_running; then
    local pid=$(cat "$PID_FILE")
    echo "Server is running (PID: $pid)"
    echo "Dashboard: http://localhost:$PORT"

    # Check if port is responding
    if curl -s "http://localhost:$PORT/api/health" >/dev/null 2>&1; then
      echo "Health: OK"
    else
      echo "Health: NOT RESPONDING"
    fi
  else
    # Check if something else is using the port
    if lsof -i :$PORT >/dev/null 2>&1; then
      echo "Server is not running, but port $PORT is in use"
    else
      echo "Server is not running"
    fi
  fi
}

logs() {
  if [ -f "$LOG_FILE" ]; then
    tail -f "$LOG_FILE"
  else
    echo "No log file found"
  fi
}

is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid=$(cat "$PID_FILE")
    if ps -p "$pid" >/dev/null 2>&1; then
      return 0
    fi
  fi
  return 1
}

# Main
case "${1:-}" in
  start)
    start
    ;;
  start-fg)
    start_fg
    ;;
  stop)
    stop
    ;;
  status)
    status
    ;;
  logs)
    logs
    ;;
  restart)
    stop
    sleep 1
    start
    ;;
  *)
    echo "Usage: $0 {start|start-fg|stop|status|logs|restart}"
    exit 1
    ;;
esac
