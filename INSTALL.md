# IA Framework Installation Guide

**Single source of truth for installing the Intelligence Adjacent Framework.**

**Visual Guide:** For a complete step-by-step walkthrough with screenshots, see the [Setup Guide](https://notchrisgroves.com/setup-guide/).

---

## Installation Steps

Installation is straightforward. The process varies by platform:

- **Windows:** Recommended to use WSL2 for best performance (Phase 0), or install directly on Windows with git
- **Linux:** Direct installation, optional automated setup scripts
- **macOS:** Direct installation via Homebrew, optional automated setup scripts

### Phase 0: Platform Setup

#### Windows: WSL2 Setup

**Windows Installation: Two Approaches**

**Approach 1: WSL2 (Recommended for best performance and compatibility)**
- Best performance and native Linux experience
- No git needed on base Windows
- Git installed automatically inside WSL Ubuntu
- Follow Phase 0 steps below

**Approach 2: Direct Windows Installation (Works fine)**
- Works well for basic usage
- Git required on base Windows
- Skip Phase 0 WSL setup
- Install Git for Windows from https://git-scm.com/download/win
- Proceed directly to Phase 1

If you're on Windows using WSL2, Claude Code runs in a Linux environment. WSL2 provides that.

**Complete Windows Setup (Run in Order):**

**Steps 1-2: Run in Windows Terminal (PowerShell as Administrator)**

**Step 1: Enable WSL2 Features**

```powershell
# PowerShell (as Administrator)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/01-install-wsl.ps1" -OutFile "$env:TEMP\01-install-wsl.ps1"; & "$env:TEMP\01-install-wsl.ps1"
```

This enables WSL2 features and forces a restart. After restart, continue to Step 2.

**Step 2: Install Ubuntu and Optimize WSL**

After restart, install Ubuntu and configure optimal WSL settings:

```powershell
# PowerShell (as Administrator)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/02-install-ubuntu-and-harden.ps1" -OutFile "$env:TEMP\02-install-ubuntu-and-harden.ps1"; & "$env:TEMP\02-install-ubuntu-and-harden.ps1"
```

**Step 3+: Switch to WSL Terminal (Ubuntu/Linux)**

After completing Steps 1-2, open WSL terminal and run the following commands inside Linux (not PowerShell).

**Step 3: Install Prerequisites Inside WSL**

Install git, bun, gh, Claude Code, and other tools inside WSL:

```bash
# WSL Terminal (Linux) - Run this inside Ubuntu, not PowerShell
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh && chmod +x /tmp/01-install-prerequisites.sh && /tmp/01-install-prerequisites.sh
```

The script will install:
- git, curl, unzip, ca-certificates
- Bun (JavaScript runtime)
- GitHub CLI (gh)
- git-lfs (large file support)
- Claude Code CLI

**Step 4 (Optional): Install Docker**

```powershell
# PowerShell (as Administrator)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/04-install-docker.ps1" -OutFile "$env:TEMP\04-install-docker.ps1"; & "$env:TEMP\04-install-docker.ps1"
```

After Docker installs, restart Windows and configure WSL Integration in Docker Desktop settings.

[Full WSL2 configuration guide](#wsl2-configuration-reference).

#### Linux: Prerequisites Setup

**Automated installation (recommended):**

```bash
# Download and run prerequisites script
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh
chmod +x /tmp/01-install-prerequisites.sh
/tmp/01-install-prerequisites.sh
```

The script installs:
- git, curl, unzip, ca-certificates
- Bun (JavaScript runtime)
- GitHub CLI (gh)
- git-lfs (large file support)
- Claude Code CLI

**After running**, close and reopen your terminal (or run `source ~/.bashrc`) to update PATH.

**Manual installation:**

```bash
# Ubuntu/Debian
sudo apt update && sudo apt install -y git curl unzip ca-certificates fonts-noto-color-emoji

# RHEL/CentOS
sudo yum install -y git curl unzip ca-certificates

# Fedora
sudo dnf install -y git curl unzip ca-certificates

# Arch Linux
sudo pacman -Sy git curl unzip ca-certificates

# Install Bun
curl -fsSL https://bun.sh/install | bash

# Install GitHub CLI (see: https://cli.github.com/manual/installation)
# Install git-lfs (see: https://git-lfs.com/)

# Reload shell to update PATH
source ~/.bashrc  # or source ~/.zshrc
```


#### macOS: Prerequisites Setup

**Automated installation (recommended):**

```bash
# Download and run prerequisites script
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/macos/01-install-prerequisites.sh -o /tmp/01-install-prerequisites.sh
chmod +x /tmp/01-install-prerequisites.sh
/tmp/01-install-prerequisites.sh
```

The script installs:
- Homebrew (if not present)
- git, bun, GitHub CLI, git-lfs via Homebrew
- Claude Code CLI
- Configures PATH for Apple Silicon

**After running**, close and reopen your terminal to ensure PATH is updated.

**Manual installation:**

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install packages
brew install git bun gh git-lfs

# Reload shell
source ~/.zshrc  # or source ~/.bashrc
```


### Phase 1: Download the Framework

**Windows (WSL) Users:** Run these commands inside WSL terminal after completing Phase 0.

**Option A: Download as ZIP (Simpler initial setup)**

```bash
# Download framework as ZIP
curl -fsSL https://github.com/notchrisgroves/ia-framework/archive/refs/heads/main.zip -o ~/ia-framework.zip

# Extract
unzip ~/ia-framework.zip -d ~/

# Rename to standard directory name
mv ~/ia-framework-main ~/ia-framework

# Clean up
rm ~/ia-framework.zip
```

Note: Git is needed for framework operations (skills that push/pull code). The installer will check and install it if missing.

**Option B: Git Clone (Recommended - Full version control)**

```bash
# Recommended location
git clone https://github.com/notchrisgroves/ia-framework.git ~/ia-framework
```

This keeps the framework as a git repository, enabling all git-based features.

### Phase 2: Launch Claude Code

```bash
cd ~/ia-framework
claude
```

### Phase 3: Run Setup

Once Claude Code is running in the framework directory, run:

```bash
# Option 1: Using npm script (recommended)
bun run setup

# Option 2: Direct path
bun tools/setup/install-framework.ts
```

Note: The `/setup` slash command won't work yet because symlinks haven't been created. After setup completes, `/setup` and other commands will work.

**Permissions:** Claude will need sudo access to install dependencies (unzip, bun). Allow these when prompted.

The installer handles everything:
- Detects platform and checks prerequisites (Git, Bun)
- Validates framework structure
- Creates symlinks in ~/.claude/ (CLAUDE.md, settings.json, agents/, commands/, hooks/)
- Configures .env from template
- Sets privacy defaults
- Installs dependencies (root + skills)
- Runs health check

The installer creates four symlinks from `~/.claude/` to your framework:
- `CLAUDE.md` → your framework's navigation
- `settings.json` → your framework's config
- `commands/` → your skill commands
- `agents/` → your specialized agents

If you already have files in those locations, they're backed up with `.bak` extensions.

**That's it.** The framework is ready.

---

## Installation Requirements: What's Required vs Optional

### Required Components

These components are **required** for the framework to work:

| Component | Windows (WSL) | Windows (Direct) | Linux | macOS | Notes |
|-----------|---------------|------------------|-------|-------|-------|
| Git | Installed automatically in WSL | Required on Windows | Installed automatically | Installed automatically | Needed for framework operations |
| Bun | Installed automatically | Installed automatically | Installed automatically | Installed automatically | JavaScript runtime (required) |
| curl | Installed automatically | Installed automatically | Installed automatically | Installed automatically | Needed for downloads |
| unzip | Installed automatically | Installed automatically | Installed automatically | Installed automatically | Needed to extract framework |

The installer handles all required components. You only need to run the prerequisites script for your platform.

### Optional Components

These components are **optional** and only needed for specific features:

| Component | Purpose | When You Need It |
|-----------|---------|------------------|
| GitHub CLI (gh) | Authenticate with GitHub | Only for `/git-push`, `/git-pull`, `/git-public` skills |
| git-lfs | Large file support | Only if using git skills with large binary files |
| Docker | Containerized tools | Only for containerized development workflows |
| OpenRouter API | Free model access (Tier 3) | Only for free model tier—API key in `.env.openrouter-api-key` |
| Service-specific APIs | API access (Ghost, X, etc.) | Only for specific skills that use those services |

**Important:** The installer will **detect and warn** if you need optional components for skills you plan to use. Don't worry about installing them upfront.

### What the Setup Process Does

The setup process (Phase 3) automatically:
1. Detects your platform (Windows/WSL, macOS, Linux)
2. Checks prerequisites (git, bun) and installs if missing
3. Validates framework structure
4. Creates symlinks from `~/.claude/` to your framework
5. Configures `.env` from template (for optional features)
6. Sets privacy preferences
7. Runs health checks
8. Reports what's configured and what's optional

---

## How It Works: Architecture

The framework uses a symlink architecture that keeps your setup clean. Here's the idea: the framework lives in its own directory (wherever you want), and symlinks point Claude Code to the files it needs.

```
~/ia-framework/               # Framework installation (your choice of location)
├── CLAUDE.md
├── settings.json
├── commands/
├── agents/
├── skills/
├── ...

~/.claude/                    # Claude Code's directory
├── CLAUDE.md → ~/ia-framework/CLAUDE.md        (symlink)
├── settings.json → ~/ia-framework/settings.json (symlink)
├── commands → ~/ia-framework/commands           (symlink)
├── agents → ~/ia-framework/agents               (symlink)
├── projects/                 # Claude Code's own files (untouched)
├── todos/                    # Claude Code's own files (untouched)
└── ...
```

**Why symlinks?**

I spent way too long dealing with framework updates that broke my Claude Code setup. The symlink architecture solves this:

- **Separation:** Your framework lives in its own directory with git history
- **Safety:** Claude Code's files stay completely untouched
- **Updates:** Pull framework changes without touching Claude's state
- **Clean removal:** Delete the framework directory, remove symlinks - done

The framework and Claude Code are completely independent. No risk.

---

## WSL2 Configuration Reference

**Linux and macOS users can skip this section.**

This section documents the complete WSL2 configuration. Most users only need the basic `wsl --install` command. These details are for troubleshooting or custom setups.

### Install WSL2

```powershell
# PowerShell (as Administrator)
wsl --install -d Ubuntu-24.04
```

Restart your computer when prompted.

### Initial Ubuntu Configuration

After restart, Ubuntu will prompt for username/password. Then update packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### PATH Configuration

Many tools (including Claude Code) install to `~/.local/bin`. Ensure this is in your PATH:

```bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc && source ~/.bashrc
```

### Configure WSL Settings

Create `/etc/wsl.conf` with comprehensive settings:

```bash
sudo nano /etc/wsl.conf
```

Add the following (replace `<username>` with your WSL username):

```ini
[boot]
systemd=true

[user]
default=<username>

[network]
generateResolvConf = false

[automount]
options = "metadata,umask=22,fmask=11"
```

**Why each setting matters:**
- `systemd=true` - Enables modern service management (needed for some services)
- `default=<username>` - Prevents root login issues
- `generateResolvConf = false` - Prevents DNS reset on every restart (annoying when you're mid-workflow)
- `metadata,umask=22,fmask=11` - **Prevents Zone.Identifier files** - Without this, Windows tags every file with `:Zone.Identifier` metadata. This breaks git, confuses tools, and clutters your filesystem.

### Configure Global WSL Settings (Windows Host)

**Option A: Automated (Recommended)**

Run the Windows hardening script to automatically configure optimal settings:

```powershell
# PowerShell (as Administrator)
cd ~\ia-framework
.\tools\setup\windows\02-install-ubuntu-and-harden.ps1
```

The script will:
- Calculate optimal memory (50% of system RAM)
- Set appropriate CPU allocation
- Configure swap and performance settings
- Optionally add Windows Defender exclusions
- Backup existing configuration


**Option B: Manual Configuration**

Create `C:\Users\<WindowsUsername>\.wslconfig`:

```ini
[wsl2]
memory=8GB
processors=4
swap=2GB
```

Adjust memory/processors based on your system.

### DNS Configuration (Optional but Recommended)

WSL's default DNS config resets on every restart. Annoying when you're mid-workflow. Setting static DNS (8.8.8.8) fixes this:

```bash
sudo rm /etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
sudo chattr +i /etc/resolv.conf  # Make it immutable so WSL can't overwrite it
```

### Update WSL Kernel

```powershell
# PowerShell (as Administrator)
wsl --update
wsl --shutdown
```

### Set Windows Terminal Default Directory

In Windows Terminal settings (Ctrl+,), select your Ubuntu profile and set the starting directory:

```
~/ia-framework
```

This opens directly to your framework directory. Run `claude` from here.

### GitHub CLI and Git LFS

Install GitHub CLI for authentication and git-lfs for large file support:

```bash
# Install GitHub CLI
(type -p wget >/dev/null || sudo apt install wget -y) \
&& sudo mkdir -p -m 755 /etc/apt/keyrings \
&& out=$(mktemp) && wget -nv -O$out https://cli.github.com/packages/githubcli-archive-keyring.gpg \
&& cat $out | sudo tee /etc/apt/keyrings/githubcli-archive-keyring.gpg > /dev/null \
&& sudo chmod go+r /etc/apt/keyrings/githubcli-archive-keyring.gpg \
&& echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
&& sudo apt update \
&& sudo apt install gh -y

# Install git-lfs
sudo apt install git-lfs -y
git lfs install

# Authenticate with GitHub
gh auth login
```

Follow the prompts to authenticate. This stores credentials securely inside WSL—no Windows credential manager needed.

### Verify WSL Setup

```bash
# Check systemd is running
systemctl --version

# Verify no Zone.Identifier files are created
touch /tmp/test-file
ls -la /tmp/test-file*  # Should show only test-file, no :Zone.Identifier

# Check WSL version
wsl.exe --version
```

---

## Docker Installation (Optional)

Docker is optional but recommended for containerized tools and development. Installation method varies by platform.

### Docker on Windows (WSL2)

**Automated installation (recommended):**

```powershell
# PowerShell (as Administrator)
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/04-install-docker.ps1" -OutFile "$env:TEMP\04-install-docker.ps1"; & "$env:TEMP\04-install-docker.ps1"
```

**Manual installation:**

1. Visit https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Windows
3. Run installer with WSL2 backend enabled
4. Restart Windows
5. Configure WSL Integration: Settings → Resources → WSL Integration → Enable Ubuntu


### Docker on Linux

**Automated installation (recommended):**

```bash
# Download and run Docker installation script
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/02-install-docker.sh -o /tmp/02-install-docker.sh
chmod +x /tmp/02-install-docker.sh
/tmp/02-install-docker.sh
```

The script installs Docker Engine (native daemon, no Desktop GUI):
- Auto-detects Linux distribution (Ubuntu/Debian/RHEL/Fedora/Arch)
- Installs Docker Engine and Docker Compose plugin
- Configures Docker to start on boot
- Adds current user to docker group

**After installation:**
- Log out and back in for docker group changes to take effect
- Or run `newgrp docker` for current session

**Manual installation:**

Follow official Docker Engine installation guide for your distribution:
- https://docs.docker.com/engine/install/


### Docker on macOS

**Automated installation (recommended):**

```bash
# Download and run Docker installation script
curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/macos/02-install-docker.sh -o /tmp/02-install-docker.sh
chmod +x /tmp/02-install-docker.sh
/tmp/02-install-docker.sh
```

The script offers two options:

**Option 1: Docker Desktop (GUI)**
- Full application with dashboard
- Easy to use and configure
- Requires license for enterprise use
- More resource-intensive

**Option 2: Colima (CLI)**
- Command-line only
- Open-source, no license restrictions
- Lighter on system resources
- Good for CLI-focused developers

**Manual installation:**

Docker Desktop:
1. Visit https://www.docker.com/products/docker-desktop/
2. Download Docker Desktop for Mac
3. Install and run

Colima:
```bash
brew install docker colima
colima start --cpu 2 --memory 4 --disk 60
```


---

## What `/setup` Does Under the Hood

This section documents what happens when you run `/setup`. Useful for troubleshooting or understanding the framework architecture.

### Prerequisites Check

The installer verifies you have the required tools:

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Claude Code CLI | Latest | https://claude.com/claude-code |
| Claude Pro/Team | Required | https://claude.com/pricing |
| Git | 2.x+ | `sudo apt install git` |
| Unzip | Any | `sudo apt install unzip` (required for Bun) |
| Bun | Latest | `curl -fsSL https://bun.sh/install \| bash` |
| Noto Color Emoji | Any | `sudo apt install fonts-noto-color-emoji` (required for PDF emoji rendering) |
| Docker Desktop | Latest | https://www.docker.com/products/docker-desktop/ (optional, required for containerized tools) |

**Verify prerequisites manually:**

```bash
claude --version
git --version
bun --version
```

### Platform Detection

The installer detects your platform:
- Windows/WSL: Uses WSL-specific paths
- macOS: Uses standard Unix paths
- Linux: Uses standard Unix paths

### Framework Validation

Checks framework structure:
- `CLAUDE.md` exists
- `settings.json` exists
- `commands/` directory exists
- `agents/` directory exists
- Required skills are present

### Symlink Creation

Creates four symlinks from `~/.claude/` to your framework:

```bash
ln -s ~/ia-framework/CLAUDE.md ~/.claude/CLAUDE.md
ln -s ~/ia-framework/settings.json ~/.claude/settings.json
ln -s ~/ia-framework/commands ~/.claude/commands
ln -s ~/ia-framework/agents ~/.claude/agents
```

If files exist, they're backed up with `.bak` extensions.

### Environment Configuration

Creates `.env` from `.env.example`:

```bash
cp .env.example .env
```

You'll need to add API keys manually:

```bash
# Core framework (enables multi-model QA, git automation, documentation lookup)
OPENROUTER_API_KEY=sk-or-...     # https://openrouter.ai/keys
GITHUB_TOKEN=ghp_...              # `gh auth token` after `gh auth login`
CONTEXT7_API_KEY=...              # https://context7.com (library docs)
```

**Note:** Claude Code handles its own authentication (Claude Pro/Team subscription). The `.env` file is for framework integrations only.

**Security:** Never commit `.env` files. The framework's pre-commit hooks block credential commits.

### Using OpenRouter as Your Default Claude Code Model

Instead of using Anthropic API or a Claude Pro/Max subscription, you can configure Claude Code to route all requests through OpenRouter. This approach supports multiple models and costs less for occasional use.

**Why OpenRouter?**
- Access to multiple AI models from one platform
- Pay-per-use pricing (no monthly subscription)
- Better for testing or intermittent use
- Full compatibility with Claude Code

**Configuration Method 1: Shell Profile (Global)**

Add to your shell profile (`~/.bashrc`, `~/.zshrc`, or `~/.config/fish/config.fish`):

```bash
# Use OpenRouter for Claude Code
export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"
export ANTHROPIC_API_KEY=""  # Important: explicitly empty to prevent conflicts

# Your OpenRouter API key
export OPENROUTER_API_KEY=[insert key]
```

Then reload: `source ~/.bashrc` (or your shell config file)

**Configuration Method 2: Project Settings File (Per-Project)**

Create `.claude/settings.local.json` in your project root:

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "https://openrouter.ai/api",
    "ANTHROPIC_AUTH_TOKEN": "[insert key]",
    "ANTHROPIC_API_KEY": ""
  }
}
```

**Getting Your OpenRouter API Key:**

1. Go to https://openrouter.ai/keys
2. Create an account or sign in
3. Add credits (minimum $5)
4. Create an API key and copy it

**Why Empty ANTHROPIC_API_KEY?**

Claude Code prioritizes credentials in this order:
1. `ANTHROPIC_API_KEY` (if set)
2. `ANTHROPIC_AUTH_TOKEN` (if set)
3. Browser/cached authentication

Setting `ANTHROPIC_API_KEY=""` prevents Claude Code from bypassing OpenRouter and attempting direct Anthropic authentication.

**Verify Configuration:**

```bash
echo $ANTHROPIC_BASE_URL  # Should print: https://openrouter.ai/api
echo $ANTHROPIC_API_KEY   # Should be empty
claude                    # Launch Claude Code
```

Inside Claude Code, ask: "What model are you using?" It should respond with OpenRouter model information.

### Reverting to Claude Pro/Max

Switching back to Claude Pro/Max is simple and non-destructive. Choose the method that matches your configuration:

**If You Configured Shell Profile:**

Edit your shell configuration file and remove or comment out these lines:

```bash
# Delete or comment out these lines from ~/.bashrc, ~/.zshrc, or ~/.config/fish/config.fish:
# export ANTHROPIC_BASE_URL="https://openrouter.ai/api"
# export ANTHROPIC_AUTH_TOKEN="$OPENROUTER_API_KEY"
# export ANTHROPIC_API_KEY=""
# export OPENROUTER_API_KEY=[insert key]
```

Then reload your shell:

```bash
source ~/.bashrc  # or ~/.zshrc
```

**If You Configured Project Settings File:**

Simply delete the file:

```bash
rm .claude/settings.local.json
```

**That's it.** Claude Code will automatically fall back to browser authentication and use your Claude Pro/Max subscription.

**Verify You're Back on Claude Pro/Max:**

```bash
# Open Claude Code
cd ~/ia-framework
claude
```

Inside Claude Code, ask: "What subscription am I using?" It should respond with information about Claude Pro or Claude Max.

### Dependency Installation

Runs `bun install` to install framework dependencies.

### Health Check

**Required capability:** `framework-accuracy-audit`

Verifies framework installation by checking structure, dependencies, and configuration.

Expected output: All checks passing.

---

## Manual Setup (Advanced)

For those who prefer manual control over automation:

### Custom Installation Location

The framework can live anywhere on your system:

```bash
# Custom location
git clone https://github.com/notchrisgroves/ia-framework.git /path/to/your/framework
export IA_FRAMEWORK_ROOT=/path/to/your/framework  # Add to ~/.bashrc
```

### Manual Symlink Creation

```bash
# Ensure ~/.claude exists (Claude Code creates this)
mkdir -p ~/.claude

# Create symlinks (remove existing files if they exist)
rm -f ~/.claude/CLAUDE.md 2>/dev/null
rm -f ~/.claude/settings.json 2>/dev/null
rm -rf ~/.claude/commands 2>/dev/null
rm -rf ~/.claude/agents 2>/dev/null

ln -s ~/ia-framework/CLAUDE.md ~/.claude/CLAUDE.md
ln -s ~/ia-framework/settings.json ~/.claude/settings.json
ln -s ~/ia-framework/commands ~/.claude/commands
ln -s ~/ia-framework/agents ~/.claude/agents
```

**Verify symlinks:**
```bash
ls -la ~/.claude/ | grep "^l"
# Should show arrows pointing to ~/ia-framework/
```

### Manual Dependency Installation

```bash
cd ~/ia-framework
bun install
```

### Manual Credential Configuration

```bash
cp .env.example .env
nano .env  # Edit and add API keys
```

### Manual Health Check

**Required capability:** `framework-accuracy-audit`

**Agent instructions:**
1. Read `docs/catalogs/tool-catalog.md`
2. Search for capability: `[framework-accuracy-audit]`
3. Execute tool at discovered path

### Manual Framework Verification

```bash
claude
```

Claude should recognize the framework and show CLAUDE.md context.

### Test a Command

```
/create
```

Should launch the interactive skill/tool creation wizard.

---

## Advanced Topics

### Migration from ~/.claude Directory

If you have an existing framework installation inside `~/.claude`:

```bash
# 1. Create new framework directory
mkdir -p ~/ia-framework

# 2. Move framework files (preserve git history)
cd ~/.claude
mv .git ~/ia-framework/
mv CLAUDE.md settings.json commands skills agents tools hooks library docs ~/ia-framework/
mv .env .env.example package.json bun.lock node_modules ~/ia-framework/ 2>/dev/null

# 3. Create symlinks back
ln -s ~/ia-framework/CLAUDE.md ~/.claude/CLAUDE.md
ln -s ~/ia-framework/settings.json ~/.claude/settings.json
ln -s ~/ia-framework/commands ~/.claude/commands
ln -s ~/ia-framework/agents ~/.claude/agents

# 4. Verify git works from new location
cd ~/ia-framework && git status
```

### Custom Installation Location

For non-standard installation locations, set `IA_FRAMEWORK_ROOT`:

```bash
# Add to ~/.bashrc or ~/.zshrc
export IA_FRAMEWORK_ROOT=/path/to/your/framework
```

Framework scripts automatically use this if set.

### Updating the Framework

**Standard update:**

```bash
cd ~/ia-framework
git pull origin main
bun install
```

**Update with conflict resolution:**

```
/framework-update
```

This preserves your customizations while updating framework files.

---

## Troubleshooting

### Framework Not Loading

Claude doesn't see your CLAUDE.md? Nine times out of ten, it's a broken symlink. Here's how to check:

```bash
ls -la ~/.claude/CLAUDE.md  # Must be symlink or file
readlink ~/.claude/CLAUDE.md  # If symlink, must point to valid file
cat ~/.claude/CLAUDE.md | head -5  # Must be readable
```

I've seen this happen when:
- The framework path changed but symlinks didn't update
- Permissions got messed up (run `chmod +r ~/ia-framework/CLAUDE.md`)
- The symlink broke (delete and recreate it)

### Commands Not Found

`/create` or other commands don't work? Check the commands symlink:

```bash
ls -la ~/.claude/commands/  # Must be symlink or directory
ls ~/.claude/commands/  # Should show .md files
```

If the commands directory is empty or doesn't exist, the symlink is broken. Recreate it following the [manual setup](#manual-setup-advanced) instructions.

### Broken Symlinks

"No such file or directory" errors usually mean the symlink target moved or was deleted:

```bash
# Check symlink targets
readlink ~/.claude/CLAUDE.md
readlink ~/.claude/settings.json
readlink ~/.claude/commands
readlink ~/.claude/agents

# Recreate if broken
rm ~/.claude/CLAUDE.md
ln -s ~/ia-framework/CLAUDE.md ~/.claude/CLAUDE.md
```

### Credential Errors

**Symptom:** Scripts fail with "API key not found"

**Solution:**
```bash
# Check .env in framework directory (not ~/.claude)
cat ~/ia-framework/.env | grep -v "^#"
```

### WSL Zone.Identifier Files

**Symptom:** Files have `:Zone.Identifier` suffix

**Solution:** Add to `/etc/wsl.conf`:
```ini
[automount]
options = "metadata,umask=22,fmask=11"
```
Then restart WSL: `wsl --shutdown`

### DNS Not Resolving in WSL

**Symptom:** `ping google.com` fails

**Solution:**
```bash
sudo rm /etc/resolv.conf
echo "nameserver 8.8.8.8" | sudo tee /etc/resolv.conf
sudo chattr +i /etc/resolv.conf
```

### Uninstallation

**Clean uninstall:**

The installer backs up any existing files with `.bak` extensions. During uninstall, restore those backups so you don't lose your original configuration.

```bash
# Restore backed-up files (if they exist)
[ -f ~/.claude/CLAUDE.md.bak ] && mv ~/.claude/CLAUDE.md.bak ~/.claude/CLAUDE.md || rm -f ~/.claude/CLAUDE.md
[ -f ~/.claude/settings.json.bak ] && mv ~/.claude/settings.json.bak ~/.claude/settings.json || rm -f ~/.claude/settings.json
[ -d ~/.claude/commands.bak ] && mv ~/.claude/commands.bak ~/.claude/commands || rm -f ~/.claude/commands
[ -d ~/.claude/agents.bak ] && mv ~/.claude/agents.bak ~/.claude/agents || rm -f ~/.claude/agents

# Remove framework directory
rm -rf ~/ia-framework
```

**What happens:**
- If you had existing files before installing, they're restored from `.bak` backups
- If it was a clean install, the symlinks are just removed
- Claude Code's files (projects, todos, history) are always preserved

**Note:** A minimal `~/.claude/CLAUDE.md` with project-specific instructions and `~/.claude/settings.json` with your preferred configuration is good practice. The framework isn't required for Claude Code to work - it provides a structured approach to agent workflows.

**Complete removal:**

To also remove Claude Code entirely:
```bash
rm -rf ~/.claude
```

---

## Need Help?

If something goes wrong, ask Claude:

```
Help me troubleshoot my IA framework setup
```

Claude will check your installation, verify symlinks, and diagnose issues.

**Other resources:**
- **GitHub Issues:** https://github.com/notchrisgroves/ia-framework/issues
- **Documentation:** See `docs/` directory for architecture details

---

**Version:** 2.3.0
**Last Updated:** 2026-02-27
