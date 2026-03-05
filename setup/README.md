# Framework Setup - Dependencies

This directory contains external dependency installation scripts for the Intelligence Adjacent Framework.

## Quarto CLI

Required for document rendering (PDF, HTML, DOCX) - used by report generation skills.

**Install via npm script:**
```bash
bun run setup:deps
```

**Or directly:**
```bash
bun setup/install-dependencies.ts
```

This will:
1. Check if Quarto is already installed
2. Download and install Quarto to `/opt/quarto` if needed

**Manual install:**
```bash
curl -L -o /tmp/quarto.tar.gz https://github.com/quarto-dev/quarto-cli/releases/download/v1.8.27/quarto-1.8.27-linux-amd64.tar.gz
sudo tar -xzf /tmp/quarto.tar.gz -C /opt
sudo mv /opt/quarto-1.8.27 /opt/quarto
sudo chmod +x /opt/quarto/bin/quarto
```

**Verify:**
```bash
/opt/quarto/bin/quarto --version
```

## Full Framework Setup

For complete framework installation (prerequisites, symlinks, .env config), run:

```bash
bun run setup
```

Or directly:
```bash
bun tools/setup/install-framework.ts
```
