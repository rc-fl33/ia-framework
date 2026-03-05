# Lightweight MCP Server - Reads from Reaper's database via shared volume
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

# Install system dependencies
RUN apt-get update && apt-get install -y \
    sqlite3 \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Create app user
RUN useradd -m -d /app -s /bin/bash app

WORKDIR /app

# Copy MCP server files
COPY requirements.txt .
COPY reaper_server.py .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Set ownership
RUN chown -R app:app /app

USER app

# MCP server runs on stdio (no ports needed)
# Reaper's database will be mounted at /data/reaper.db

CMD ["python3", "reaper_server.py"]
