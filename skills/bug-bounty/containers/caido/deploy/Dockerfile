# Caido Web Security Proxy
# https://caido.io/
#
# Purpose: Advanced web proxy for security testing with HTTP/2, WebSocket support
# Use Case: API testing, web app security analysis, traffic inspection
#
# Build: docker build -t caido:latest .
# Run: See docker-compose.yml

FROM caido/caido:latest

# Labels for container registry
LABEL maintainer="Intelligence Adjacent Framework"
LABEL description="Caido web security proxy with WebSocket and HTTP/2 support"
LABEL version="latest"

# Caido runs on port 8080 internally
# Data stored in /home/caido/.local/share/caido
EXPOSE 8080

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Default command (inherited from base image)
# Override with --ui-domain if needed
CMD ["caido"]
