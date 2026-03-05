# Prerequisites Installation Script for IA Framework (Windows/WSL)
# Downloads and runs the Linux prerequisite script inside WSL
#
# Usage: Run from PowerShell (does NOT require Administrator)
#   .\tools\setup\windows\03-install-prerequisites.ps1
#
# Or download and run directly:
#   Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/03-install-prerequisites.ps1" -OutFile "$env:TEMP\03-install-prerequisites.ps1"
#   & "$env:TEMP\03-install-prerequisites.ps1"
#
# What this script does:
# - Verifies WSL2 is installed and running
# - Downloads Linux prerequisite script into WSL
# - Installs git, curl, unzip, ca-certificates
# - Installs Bun (JavaScript runtime)
# - Installs GitHub CLI (gh)
# - Installs git-lfs (large file support)
# - Configures PATH for local binaries
# - Verifies all tools are accessible

# Color helper functions
function Write-Header {
    param([string]$Message)
    Write-Host $Message -ForegroundColor Cyan
}

function Write-Success {
    param([string]$Message)
    Write-Host "  ✓ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "  ❌ $Message" -ForegroundColor Red
}

function Write-Warning {
    param([string]$Message)
    Write-Host "  ⚠️  $Message" -ForegroundColor Yellow
}

function Write-Info {
    param([string]$Message)
    Write-Host "  ℹ️  $Message" -ForegroundColor Cyan
}

Write-Host ""
Write-Header "======================================================"
Write-Header "  IA Framework - Prerequisites (Windows/WSL)"
Write-Header "======================================================"
Write-Host ""

# Step 1: Verify WSL is installed
Write-Header "Step 1: Verify WSL Installation"
Write-Header "--------------------------------"
Write-Host ""

try {
    $wslVersion = wsl --version 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Error "WSL is not installed or not working properly"
        Write-Host ""
        Write-Warning "You must install WSL2 first. Run:"
        Write-Info ".\tools\setup\windows\01-install-wsl.ps1"
        Write-Host ""
        Write-Info "Or download and run:"
        Write-Host '  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/01-install-wsl.ps1" -OutFile "$env:TEMP\01-install-wsl.ps1"' -ForegroundColor Gray
        Write-Host '  & "$env:TEMP\01-install-wsl.ps1"' -ForegroundColor Gray
        Write-Host ""
        exit 1
    }
    Write-Success "WSL is installed"
} catch {
    Write-Error "Could not check WSL installation"
    Write-Host ""
    exit 1
}

# Step 2: Verify WSL distro is running
Write-Host ""
Write-Header "Step 2: Check WSL Distribution"
Write-Header "-------------------------------"
Write-Host ""

try {
    $distros = wsl --list --quiet
    if ($distros.Count -eq 0) {
        Write-Error "No WSL distributions found"
        Write-Host ""
        Write-Warning "Install Ubuntu with:"
        Write-Host '  wsl --install -d Ubuntu-24.04' -ForegroundColor Gray
        Write-Host ""
        exit 1
    }

    # Get default distro
    $defaultDistro = (wsl --list --verbose | Select-String '\*' | Out-String).Trim() -replace '\s+', ' '
    Write-Success "Default WSL distribution: $defaultDistro"
} catch {
    Write-Error "Could not check WSL distributions"
    exit 1
}

# Step 3: Download prerequisite script inside WSL
Write-Host ""
Write-Header "Step 3: Download Prerequisites Script"
Write-Header "--------------------------------------"
Write-Host ""

Write-Info "Downloading Linux prerequisite script into WSL..."

try {
    # Create temp directory in WSL
    wsl bash -c "mkdir -p /tmp/ia-setup"

    # Download the script
    wsl bash -c "curl -fsSL https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/linux/01-install-prerequisites.sh -o /tmp/ia-setup/01-install-prerequisites.sh"

    # Make it executable
    wsl bash -c "chmod +x /tmp/ia-setup/01-install-prerequisites.sh"

    Write-Success "Prerequisites script downloaded"
} catch {
    Write-Error "Failed to download prerequisites script"
    Write-Host ""
    Write-Warning "Check your internet connection and try again"
    exit 1
}

# Step 4: Run prerequisite script inside WSL
Write-Host ""
Write-Header "Step 4: Install Prerequisites Inside WSL"
Write-Header "-----------------------------------------"
Write-Host ""

Write-Info "Running prerequisite installation inside WSL..."
Write-Info "This will install: git, curl, unzip, bun, gh, git-lfs"
Write-Host ""

try {
    # Run the script and display output
    wsl bash -c "/tmp/ia-setup/01-install-prerequisites.sh"

    if ($LASTEXITCODE -ne 0) {
        Write-Error "Prerequisites installation failed"
        Write-Host ""
        exit 1
    }

    Write-Host ""
    Write-Success "Prerequisites installed successfully"
} catch {
    Write-Error "Failed to run prerequisites script"
    exit 1
}

# Step 5: Verify installations
Write-Host ""
Write-Header "Step 5: Verify Installations"
Write-Header "-----------------------------"
Write-Host ""

# Check git
try {
    $gitVersion = wsl bash -c "git --version" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "git: $gitVersion"
    } else {
        Write-Warning "git not found in PATH"
    }
} catch {
    Write-Warning "Could not verify git installation"
}

# Check bun (with PATH fix)
try {
    # Try with explicit PATH
    $bunVersion = wsl bash -c 'export PATH="$HOME/.bun/bin:$PATH" && bun --version' 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "bun: v$bunVersion"
    } else {
        Write-Warning "bun not found - may need to reload shell"
    }
} catch {
    Write-Warning "Could not verify bun installation"
}

# Check gh
try {
    $ghVersion = wsl bash -c "gh --version | head -1" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "GitHub CLI: $ghVersion"
    } else {
        Write-Warning "gh not found in PATH"
    }
} catch {
    Write-Warning "Could not verify GitHub CLI installation"
}

# Check git-lfs
try {
    $lfsVersion = wsl bash -c "git lfs version" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Success "git-lfs: $lfsVersion"
    } else {
        Write-Warning "git-lfs not found in PATH"
    }
} catch {
    Write-Warning "Could not verify git-lfs installation"
}

# Step 6: Final instructions
Write-Host ""
Write-Header "======================================================"
Write-Header "  Prerequisites Installation Complete"
Write-Header "======================================================"
Write-Host ""

Write-Success "All prerequisite tools are installed inside WSL"
Write-Host ""

Write-Info "Next steps:"
Write-Host "  1. Open WSL terminal:" -ForegroundColor Gray
Write-Host "     wsl" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Download the IA Framework:" -ForegroundColor Gray
Write-Host '     curl -fsSL https://github.com/notchrisgroves/ia-framework/archive/refs/heads/main.zip -o ~/ia-framework.zip' -ForegroundColor Gray
Write-Host "     unzip ~/ia-framework.zip -d ~/" -ForegroundColor Gray
Write-Host "     mv ~/ia-framework-main ~/ia-framework" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Navigate to framework:" -ForegroundColor Gray
Write-Host "     cd ~/ia-framework" -ForegroundColor Gray
Write-Host ""
Write-Host "  4. Launch Claude Code:" -ForegroundColor Gray
Write-Host "     claude" -ForegroundColor Gray
Write-Host ""
Write-Host "  5. Run setup:" -ForegroundColor Gray
Write-Host '     run the setup command from commands/setup.md' -ForegroundColor Gray
Write-Host ""

Write-Host "Optional: Install Docker Desktop (recommended for containerized tools)" -ForegroundColor Yellow
Write-Host '  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/04-install-docker.ps1" -OutFile "$env:TEMP\04-install-docker.ps1"' -ForegroundColor Gray
Write-Host '  & "$env:TEMP\04-install-docker.ps1"' -ForegroundColor Gray
Write-Host ""
