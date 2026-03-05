###############################################################################
# grok2api VPS Deployment Dockerfile
#
# Clones the grok2api repo and builds from source. Used by
# deploy-grok2api-vps.sh for remote deployment where the repo
# isn't pre-cloned.
#
# For local development, use docker-compose.yml instead (builds
# from the local ~/grok2api clone).
###############################################################################

FROM python:3.13-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    UV_PROJECT_ENVIRONMENT=/opt/venv

ENV PATH="$UV_PROJECT_ENVIRONMENT/bin:$PATH"

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
       git curl tzdata ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install uv package manager
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Clone repo and install dependencies
RUN git clone --depth 1 https://github.com/chenyme/grok2api.git . \
    && uv sync --frozen --no-dev --no-install-project

# Create runtime directories
RUN mkdir -p /app/data /app/data/tmp /app/logs \
    && chmod +x /app/scripts/entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/app/scripts/entrypoint.sh"]

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
