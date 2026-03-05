#!/bin/bash
#
# Mermaid Live Editor Management Script
#
# Usage:
#   ./manage.sh start      - Start editor in background (Docker)
#   ./manage.sh start-fg  - Start editor in foreground
#   ./manage.sh stop      - Stop background editor
#   ./manage.sh status    - Check editor status
#   ./manage.sh logs      - View editor logs
#
# Requires: Docker installed and running

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATA_DIR="${HOME}/.local/share/ia-mermaid-editor"
PID_FILE="$DATA_DIR/.mermaid-editor.pid"
LOG_FILE="$DATA_DIR/mermaid-editor.log"
CONTAINER_NAME="ia-mermaid-live-editor"
PORT=8080

# Check Docker availability
check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Docker is not installed."
    echo "Install Docker: https://docs.docker.com/get-docker/"
    echo "Then run: /setup"
    return 1
  fi
  if ! docker info &> /dev/null; then
    echo "Docker is not running."
    echo "Start Docker Desktop or Docker daemon, then run: /mermaid-editor-start"
    return 1
  fi
  return 0
}

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

docker_is_running() {
  docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"
}

start() {
  if ! check_docker; then
    exit 1
  fi

  if is_running; then
    echo "Mermaid editor already running (PID: $(cat "$PID_FILE")) — http://localhost:$PORT"
    exit 0
  fi

  if docker_is_running; then
    echo "Mermaid editor container already running — http://localhost:$PORT"
    exit 0
  fi

  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting Mermaid Live Editor (Docker)..."
  docker run --platform linux/amd64 --name "$CONTAINER_NAME" -d -p 8080:8080 ghcr.io/mermaid-js/mermaid-live-editor > "$LOG_FILE" 2>&1

  local docker_pid=$!
  echo $! > "$PID_FILE"

  sleep 3
  if docker_is_running; then
    echo "Mermaid Live Editor started"
    echo "Editor: http://localhost:$PORT"
    echo "Logs: $LOG_FILE"
  else
    echo "Failed to start Mermaid Live Editor — check $LOG_FILE"
    rm -f "$PID_FILE"
    exit 1
  fi
}

start_fg() {
  if ! check_docker; then
    exit 1
  fi

  if is_running || docker_is_running; then
    echo "Mermaid editor already running — http://localhost:$PORT"
    exit 1
  fi

  if lsof -i :$PORT >/dev/null 2>&1; then
    echo "Port $PORT is already in use"
    exit 1
  fi

  echo "Starting Mermaid Live Editor in foreground..."
  docker run --platform linux/amd64 --name "$CONTAINER_NAME" -p 8080:8080 ghcr.io/mermaid-js/mermaid-live-editor
}

stop() {
  if docker_is_running; then
    echo "Stopping Mermaid Live Editor..."
    docker stop "$CONTAINER_NAME" > /dev/null 2>&1
    docker rm "$CONTAINER_NAME" > /dev/null 2>&1
    rm -f "$PID_FILE"
    echo "Mermaid Live Editor stopped"
  elif is_running; then
    local pid=$(cat "$PID_FILE")
    kill "$pid" 2>/dev/null
    rm -f "$PID_FILE"
    echo "Mermaid Live Editor stopped"
  else
    echo "Mermaid Live Editor is not running"
  fi
}

status() {
  # Check Docker first
  if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Run /setup first."
    return
  fi
  if ! docker info &> /dev/null; then
    echo "Docker is not running. Start Docker, then run /mermaid-editor-start."
    return
  fi

  if docker_is_running; then
    echo "Mermaid Live Editor is running"
    echo "Editor: http://localhost:$PORT"
  elif is_running; then
    echo "Mermaid Live Editor is running (PID: $(cat "$PID_FILE"))"
    echo "Editor: http://localhost:$PORT"
  else
    if lsof -i :$PORT >/dev/null 2>&1; then
      echo "Mermaid Live Editor not running, but port $PORT is in use"
    else
      echo "Mermaid Live Editor is not running"
      echo "Run /mermaid-editor-start to launch the editor"
    fi
  fi
}

logs() {
  if docker_is_running; then
    docker logs "$CONTAINER_NAME" --tail 50 -f
  else
    if [ -f "$LOG_FILE" ]; then
      tail -f "$LOG_FILE"
    else
      echo "No log file found at $LOG_FILE"
    fi
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
