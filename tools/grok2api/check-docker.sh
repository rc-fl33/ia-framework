#!/bin/bash
###############################################################################
# Docker Container Health Check for grok2api
#
# Checks if grok2api Docker container is running and accessible
# Used by: image-cli.sh, video-cli.sh, and TypeScript workflows
#
# Environment: WSL2 (local Docker, not VPS)
# Container: grok2api (managed by framework docker-compose)
# Port: 8000
###############################################################################

CONTAINER_PATTERN="grok2api"
API_PORT="8000"
API_URL="http://localhost:${API_PORT}"
HEALTH_ENDPOINT="${API_URL}/v1/models"

# ANSI color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

###############################################################################
# Check if Docker is installed and running
###############################################################################
check_docker_installed() {
  if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Error: Docker is not installed${NC}"
    echo ""
    echo "Install Docker Desktop for WSL2:"
    echo "  https://docs.docker.com/desktop/install/windows-install/"
    return 1
  fi
  return 0
}

check_docker_running() {
  if ! docker ps &> /dev/null; then
    echo -e "${RED}❌ Error: Docker daemon is not running${NC}"
    echo ""
    echo "Start Docker Desktop and try again."
    return 1
  fi
  return 0
}

###############################################################################
# Check if grok2api container is running
###############################################################################
check_container_running() {
  local container_id=$(docker ps --filter "name=${CONTAINER_PATTERN}" --format "{{.ID}}" 2>/dev/null)

  if [ -z "$container_id" ]; then
    echo -e "${RED}❌ Error: grok2api container is not running${NC}"
    echo ""

    # Check if container exists but is stopped
    local stopped_container=$(docker ps -a --filter "name=${CONTAINER_PATTERN}" --filter "status=exited" --format "{{.Names}}" 2>/dev/null | head -1)

    if [ -n "$stopped_container" ]; then
      echo "Container exists but is stopped: ${stopped_container}"
      echo ""
      echo -e "${YELLOW}Start the container:${NC}"
      echo "  docker start ${stopped_container}"
    else
      echo "Container does not exist."
      echo ""
      echo -e "${YELLOW}Setup grok2api:${NC}"
      echo "  1. Clone repo: git clone https://github.com/chenyme/grok2api ~/grok2api"
      echo "  2. Start: docker compose -f tools/grok2api/deploy/docker-compose.yml up -d --build"
      echo "  3. Add tokens via admin: http://localhost:8000 (key: grok2api)"
    fi
    return 1
  fi

  return 0
}

###############################################################################
# Check if API is responding
###############################################################################
check_api_health() {
  local response=$(curl -s -w "%{http_code}" -o /dev/null "${HEALTH_ENDPOINT}" 2>/dev/null)

  if [ "$response" != "200" ]; then
    echo -e "${YELLOW}⚠️  Warning: Container running but API not responding${NC}"
    echo ""
    echo "Health check: ${HEALTH_ENDPOINT}"
    echo "HTTP status: ${response:-connection refused}"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check logs: docker logs -f grok2api"
    echo "  2. Restart: docker restart grok2api"
    echo "  3. Verify tokens: Check ~/grok2api-data/token.json"
    return 1
  fi

  return 0
}

###############################################################################
# Main Check
###############################################################################
main() {
  # Silent mode: only return exit codes (for programmatic use)
  if [ "$1" = "--silent" ]; then
    check_docker_installed &> /dev/null || exit 1
    check_docker_running &> /dev/null || exit 2
    check_container_running &> /dev/null || exit 3
    check_api_health &> /dev/null || exit 4
    exit 0
  fi

  # Verbose mode: show all checks
  echo "Checking grok2api Docker container..."
  echo ""

  check_docker_installed || exit 1
  check_docker_running || exit 2
  check_container_running || exit 3
  check_api_health || exit 4

  echo -e "${GREEN}✓ grok2api is ready${NC}"
  echo ""

  # Show container info
  local container_name=$(docker ps --filter "name=${CONTAINER_PATTERN}" --format "{{.Names}}" | head -1)
  local container_status=$(docker ps --filter "name=${CONTAINER_PATTERN}" --format "{{.Status}}" | head -1)

  echo "Container: ${container_name}"
  echo "Status: ${container_status}"
  echo "API: ${API_URL}"
  echo ""

  exit 0
}

# Run main if executed directly
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
  main "$@"
fi
