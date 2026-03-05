#!/bin/bash
#
# Quarto Style Editor Management Script
#
# Usage:
#   ./manage.sh start      - Start editor in background
#   ./manage.sh start-fg   - Start editor in foreground
#   ./manage.sh stop       - Stop background editor
#   ./manage.sh status     - Check editor status
#   ./manage.sh logs       - View editor logs
#

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
EDITOR_SCRIPT="$SCRIPT_DIR/style-editor.ts"
DATA_DIR="${HOME}/.local/share/ia-style-editor"
PID_FILE="$DATA_DIR/.style-editor.pid"
LOG_FILE="$DATA_DIR/style-editor.log"
PORT=3002

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

start() {
  if is_running; then
    echo "Style editor already running (PID: $(cat "$PID_FILE")) — http://localhost:$PORT"
    exit 0
  fi

  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting style editor..."
  nohup bun --watch "$EDITOR_SCRIPT" > "$LOG_FILE" 2>&1 &
  echo $! > "$PID_FILE"

  sleep 1
  if is_running; then
    echo "Style editor started (PID: $(cat "$PID_FILE"))"
    echo "Editor: http://localhost:$PORT"
    echo "Logs: $LOG_FILE"
  else
    echo "Failed to start style editor — check $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
}

start_fg() {
  if is_running; then
    echo "Style editor already running (PID: $(cat "$PID_FILE"))"
    exit 1
  fi

  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting style editor in foreground..."
  bun run "$EDITOR_SCRIPT"
}

stop() {
  if ! is_running; then
    echo "Style editor is not running"
    exit 0
  fi

  local pid=$(cat "$PID_FILE")
  echo "Stopping style editor (PID: $pid)..."
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
  echo "Style editor stopped"
}

status() {
  if is_running; then
    echo "Style editor is running (PID: $(cat "$PID_FILE"))"
    echo "Editor: http://localhost:$PORT"
  else
    if lsof -i :$PORT >/dev/null 2>&1; then
      echo "Style editor not running, but port $PORT is in use"
    else
      echo "Style editor is not running"
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
  start)    start ;;
  start-fg) start_fg ;;
  stop)     stop ;;
  status)   status ;;
  logs)     logs ;;
  restart)  stop; sleep 1; start ;;
  *)
    echo "Usage: $0 {start|start-fg|stop|status|logs|restart}"
    exit 1
    ;;
esac
