# Docker Desktop Installation Script for IA Framework
# Automates Docker Desktop installation with WSL2 backend
#
# Usage: Run from PowerShell as Administrator
#   .\tools\setup\windows\02-install-docker.ps1
#
# What this script does:
# - Checks if Docker Desktop is already installed
# - Verifies WSL2 is installed and ready
# - Downloads Docker Desktop installer
# - Runs installation with WSL2 backend enabled
# - Provides post-install configuration instructions

#Requires -RunAsAdministrator

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  IA Framework - Docker Desktop Installation" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if Docker Desktop is installed
function Test-DockerInstalled {
    $dockerPath = "$env:ProgramFiles\Docker\Docker\Docker Desktop.exe"
    return Test-Path $dockerPath
}

# Function to check if WSL2 is installed
function Test-WSL2Installed {
    try {
        # Method 1: Try wsl --version (modern WSL2)
        $wslVersion = wsl --version 2>&1
        if ($wslVersion -match "WSL version") {
            return $true
        }

        # Method 2: Check for WSL2 distributions
        $wslList = wsl --list --verbose 2>&1
        if ($wslList -match "VERSION\s+2" -or $wslList -match "Version\s+2") {
            return $true
        }

        # Method 3: Check if wsl.exe exists
        $wslPath = Get-Command wsl.exe -ErrorAction SilentlyContinue
        if ($wslPath) {
            return $true
        }

        return $false
    } catch {
        return $false
    }
}

# Function to check if a WSL distribution is installed
function Test-WSLDistroInstalled {
    param([string]$DistroName)

    try {
        $distros = wsl --list --quiet 2>&1
        # Convert to string and check for match (handles Ubuntu, Ubuntu-24.04, Ubuntu-22.04, etc.)
        $distrosString = $distros -join "`n"
        return $distrosString -match $DistroName
    } catch {
        return $false
    }
}

# Function to download Docker Desktop installer
function Get-DockerInstaller {
    param([string]$OutputPath)

    $dockerUrl = "https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe"

    Write-Host "  Downloading Docker Desktop installer..." -ForegroundColor Yellow
    Write-Host "  (This may take several minutes - ~500MB download)" -ForegroundColor Gray
    Write-Host ""

    try {
        # Show progress bar during download
        Invoke-WebRequest -Uri $dockerUrl -OutFile $OutputPath -UseBasicParsing

        if (Test-Path $OutputPath) {
            Write-Host ""
            Write-Host "  [OK] Download complete" -ForegroundColor Green
            return $true
        } else {
            throw "Download failed - installer not found"
        }
    } catch {
        Write-Host "  [ERROR] Download failed: $_" -ForegroundColor Red
        return $false
    }
}

# Main execution
Write-Host "Step 1: Check Prerequisites" -ForegroundColor Cyan
Write-Host "----------------------------"
Write-Host ""

# Check if Docker is already installed
if (Test-DockerInstalled) {
    Write-Host "  [OK] Docker Desktop is already installed" -ForegroundColor Green
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  [SUCCESS] Docker Desktop Already Installed" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Configuration checklist:" -ForegroundColor White
    Write-Host "  1. Open Docker Desktop" -ForegroundColor White
    Write-Host "  2. Go to Settings → Resources → WSL Integration" -ForegroundColor White
    Write-Host "  3. Enable integration for your Ubuntu distribution" -ForegroundColor White
    Write-Host "  4. Click 'Apply & Restart'" -ForegroundColor White
    Write-Host ""
    Write-Host "Verify in WSL:" -ForegroundColor White
    Write-Host "  docker --version" -ForegroundColor White
    Write-Host "  docker ps" -ForegroundColor White
    Write-Host ""
    exit 0
}

# Check if WSL2 is installed
if (-not (Test-WSL2Installed)) {
    Write-Host "  [ERROR] WSL2 is not installed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Docker Desktop requires WSL2. Please install it first:" -ForegroundColor Yellow
    Write-Host "  Run: .\tools\setup\windows\01-install-wsl.ps1" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Or install manually:" -ForegroundColor Yellow
    Write-Host "  wsl --install -d Ubuntu-24.04" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host "  [OK] WSL2 is installed" -ForegroundColor Green

# Check for Ubuntu installation (any version)
if (-not (Test-WSLDistroInstalled -DistroName "Ubuntu")) {
    Write-Host "  [WARN] No Ubuntu distribution found" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Docker will work, but you should install Ubuntu for the framework:" -ForegroundColor Yellow
    Write-Host "  Run: .\tools\setup\windows\01-install-wsl.ps1" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "  [OK] Ubuntu distribution is installed" -ForegroundColor Green
}

Write-Host ""

# Display what will be installed
Write-Host "This script will:" -ForegroundColor White
Write-Host "  - Download Docker Desktop installer (~500MB)" -ForegroundColor White
Write-Host "  - Install Docker Desktop with WSL2 backend" -ForegroundColor White
Write-Host "  - Enable WSL integration automatically" -ForegroundColor White
Write-Host "  - Require a Windows restart to complete installation" -ForegroundColor White
Write-Host ""
Write-Host "Note: Docker Desktop is free for personal use and small businesses." -ForegroundColor Gray
Write-Host "      Enterprise users may require a paid subscription." -ForegroundColor Gray
Write-Host "      See: https://www.docker.com/pricing/" -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Proceed with Docker Desktop installation? (Y/n)"

if ($confirm -eq 'n' -or $confirm -eq 'N') {
    Write-Host ""
    Write-Host "  [CANCELLED] Installation cancelled" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Manual installation:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "  2. Download Docker Desktop for Windows" -ForegroundColor Yellow
    Write-Host "  3. Run the installer and select WSL2 backend" -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "Step 2: Download Docker Desktop" -ForegroundColor Cyan
Write-Host "--------------------------------"
Write-Host ""

# Create temp directory for installer
$installerPath = "$env:TEMP\DockerDesktopInstaller.exe"

# Remove old installer if it exists
if (Test-Path $installerPath) {
    Remove-Item $installerPath -Force
}

# Download the installer
if (-not (Get-DockerInstaller -OutputPath $installerPath)) {
    Write-Host ""
    Write-Host "Failed to download installer automatically." -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual download:" -ForegroundColor Yellow
    Write-Host "  1. Visit: https://www.docker.com/products/docker-desktop/" -ForegroundColor Yellow
    Write-Host "  2. Download Docker Desktop for Windows" -ForegroundColor Yellow
    Write-Host "  3. Run the installer with these options:" -ForegroundColor Yellow
    Write-Host "     - Enable 'Use WSL 2 instead of Hyper-V'" -ForegroundColor Yellow
    Write-Host "     - Disable 'Add shortcut to desktop' (optional)" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

Write-Host ""
Write-Host "Step 3: Install Docker Desktop" -ForegroundColor Cyan
Write-Host "-------------------------------"
Write-Host ""

Write-Host "  Starting installation..." -ForegroundColor Yellow
Write-Host "  (This may take 5-10 minutes)" -ForegroundColor Gray
Write-Host ""

try {
    # Run installer with WSL2 backend enabled
    # --quiet: Silent installation
    # --accept-license: Accept license agreement
    # --backend=wsl-2: Use WSL2 backend instead of Hyper-V
    $installArgs = "install --quiet --accept-license --backend=wsl-2"

    $process = Start-Process -FilePath $installerPath -ArgumentList $installArgs -Wait -PassThru -NoNewWindow

    if ($process.ExitCode -eq 0) {
        Write-Host "  [OK] Docker Desktop installed successfully" -ForegroundColor Green
    } else {
        throw "Installation failed with exit code: $($process.ExitCode)"
    }
} catch {
    Write-Host "  [ERROR] Installation failed: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try running the installer manually:" -ForegroundColor Yellow
    Write-Host "  1. Double-click: $installerPath" -ForegroundColor Yellow
    Write-Host "  2. Ensure 'Use WSL 2 instead of Hyper-V' is checked" -ForegroundColor Yellow
    Write-Host "  3. Complete the installation wizard" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Clean up installer
Remove-Item $installerPath -Force -ErrorAction SilentlyContinue

# Final instructions
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] Docker Desktop Installation Complete" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "[WARN] IMPORTANT: Windows restart is required" -ForegroundColor Yellow
Write-Host ""
Write-Host "After restart:" -ForegroundColor White
Write-Host "  1. Docker Desktop will start automatically" -ForegroundColor White
Write-Host "  2. Accept the service agreement if prompted" -ForegroundColor White
Write-Host "  3. Sign in or skip (Docker Hub account optional)" -ForegroundColor White
Write-Host ""
Write-Host "Configure WSL Integration:" -ForegroundColor White
Write-Host "  1. Open Docker Desktop" -ForegroundColor White
Write-Host "  2. Click the gear icon (Settings)" -ForegroundColor White
Write-Host "  3. Go to: Resources → WSL Integration" -ForegroundColor White
Write-Host "  4. Enable the toggle for 'Ubuntu'" -ForegroundColor White
Write-Host "  5. Click 'Apply & Restart'" -ForegroundColor White
Write-Host ""
Write-Host "Verify Docker works in WSL:" -ForegroundColor White
Write-Host "  # Open Ubuntu terminal and run:" -ForegroundColor Gray
Write-Host "  docker --version" -ForegroundColor White
Write-Host "  docker ps" -ForegroundColor White
Write-Host "  docker run hello-world" -ForegroundColor White
Write-Host ""

$restart = Read-Host "Restart Windows now? (y/N)"

if ($restart -eq 'y' -or $restart -eq 'Y') {
    Write-Host ""
    Write-Host "  Restarting Windows in 10 seconds..." -ForegroundColor Yellow
    Write-Host "  (Press Ctrl+C to cancel)" -ForegroundColor Gray
    Start-Sleep -Seconds 10
    Restart-Computer -Force
} else {
    Write-Host ""
    Write-Host "  [WARN] Remember to restart Windows to complete Docker Desktop installation" -ForegroundColor Yellow
    Write-Host ""
}
