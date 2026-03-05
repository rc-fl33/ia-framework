# WSL2 Feature Installation Script for IA Framework
# Enables WSL2 features and requires restart
#
# Usage: Run from PowerShell as Administrator
#   .\tools\setup\windows\01-install-wsl.ps1
#
# What this script does:
# - Checks if WSL2 features are already installed
# - Enables required Windows features
# - Forces Windows restart to complete installation
#
# After restart, run 02-install-ubuntu-and-harden.ps1

#Requires -RunAsAdministrator

Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  IA Framework - WSL2 Feature Installation" -ForegroundColor Cyan
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if Windows features are enabled
function Test-WindowsFeature {
    param([string]$FeatureName)

    $feature = Get-WindowsOptionalFeature -Online -FeatureName $FeatureName -ErrorAction SilentlyContinue
    return $feature -and $feature.State -eq "Enabled"
}

# Main execution
Write-Host "Step 1: Check Current WSL2 Feature Status" -ForegroundColor Cyan
Write-Host "-------------------------------------------"
Write-Host ""

$wslEnabled = Test-WindowsFeature -FeatureName "Microsoft-Windows-Subsystem-Linux"
$vmEnabled = Test-WindowsFeature -FeatureName "VirtualMachinePlatform"

if ($wslEnabled -and $vmEnabled) {
    Write-Host "  [OK] WSL2 features are already enabled" -ForegroundColor Green
    Write-Host ""
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host "  WSL2 Features Already Installed" -ForegroundColor Green
    Write-Host "======================================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Next step: Install Ubuntu and configure WSL settings" -ForegroundColor White
    Write-Host ""
    Write-Host "Run this command:" -ForegroundColor Yellow
    Write-Host '  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/02-install-ubuntu-and-harden.ps1" -OutFile "$env:TEMP\02-install-ubuntu-and-harden.ps1"; & "$env:TEMP\02-install-ubuntu-and-harden.ps1"' -ForegroundColor Yellow
    Write-Host ""
    exit 0
}

# Ask for confirmation to proceed
Write-Host "This script will:" -ForegroundColor White
Write-Host "  - Enable Windows Subsystem for Linux feature" -ForegroundColor White
Write-Host "  - Enable Virtual Machine Platform feature" -ForegroundColor White
Write-Host "  - FORCE a Windows restart (required to continue setup)" -ForegroundColor White
Write-Host ""
Write-Host "After restart, you'll run the next script to install Ubuntu." -ForegroundColor Gray
Write-Host ""

$confirm = Read-Host "Proceed with WSL2 feature installation? (Y/n)"

if ($confirm -eq 'n' -or $confirm -eq 'N') {
    Write-Host ""
    Write-Host "  [CANCELLED] Installation cancelled" -ForegroundColor Gray
    Write-Host ""
    exit 0
}

Write-Host ""
Write-Host "Step 2: Enable WSL2 Features" -ForegroundColor Cyan
Write-Host "-----------------------------"
Write-Host ""

$restartRequired = $false

# Check and enable WSL feature
if (-not $wslEnabled) {
    Write-Host "  Enabling Windows Subsystem for Linux..." -ForegroundColor Yellow
    try {
        Enable-WindowsOptionalFeature -Online -FeatureName "Microsoft-Windows-Subsystem-Linux" -NoRestart -ErrorAction Stop | Out-Null
        Write-Host "  [OK] Enabled Windows Subsystem for Linux" -ForegroundColor Green
        $restartRequired = $true
    } catch {
        Write-Host "  [ERROR] Failed to enable WSL feature: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Try running this command manually:" -ForegroundColor Yellow
        Write-Host "    wsl --install --no-distribution" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
} else {
    Write-Host "  [OK] Windows Subsystem for Linux is already enabled" -ForegroundColor Green
}

# Check and enable Virtual Machine Platform feature
if (-not $vmEnabled) {
    Write-Host "  Enabling Virtual Machine Platform..." -ForegroundColor Yellow
    try {
        Enable-WindowsOptionalFeature -Online -FeatureName "VirtualMachinePlatform" -NoRestart -ErrorAction Stop | Out-Null
        Write-Host "  [OK] Enabled Virtual Machine Platform" -ForegroundColor Green
        $restartRequired = $true
    } catch {
        Write-Host "  [ERROR] Failed to enable Virtual Machine Platform: $_" -ForegroundColor Red
        Write-Host ""
        Write-Host "  Try running this command manually:" -ForegroundColor Yellow
        Write-Host "    wsl --install --no-distribution" -ForegroundColor Yellow
        Write-Host ""
        exit 1
    }
} else {
    Write-Host "  [OK] Virtual Machine Platform is already enabled" -ForegroundColor Green
}

# Final instructions
Write-Host ""
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host "  [SUCCESS] WSL2 Features Enabled" -ForegroundColor Green
Write-Host "======================================================" -ForegroundColor Cyan
Write-Host ""

if ($restartRequired) {
    Write-Host "[IMPORTANT] Windows restart is REQUIRED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "After restart:" -ForegroundColor White
    Write-Host "  Open PowerShell as Administrator and run:" -ForegroundColor White
    Write-Host ""
    Write-Host '  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/02-install-ubuntu-and-harden.ps1" -OutFile "$env:TEMP\02-install-ubuntu-and-harden.ps1"; & "$env:TEMP\02-install-ubuntu-and-harden.ps1"' -ForegroundColor Cyan
    Write-Host ""
    Write-Host "This will install Ubuntu 24.04 and optimize WSL settings." -ForegroundColor Gray
    Write-Host ""

    $restart = Read-Host "Restart Windows now? (Y/n)"

    if ($restart -ne 'n' -and $restart -ne 'N') {
        Write-Host ""
        Write-Host "  Restarting Windows in 10 seconds..." -ForegroundColor Yellow
        Write-Host "  (Press Ctrl+C to cancel)" -ForegroundColor Gray
        Start-Sleep -Seconds 10
        Restart-Computer -Force
    } else {
        Write-Host ""
        Write-Host "  [WARN] Remember to restart Windows before continuing setup" -ForegroundColor Yellow
        Write-Host ""
    }
} else {
    Write-Host "No restart required. Features are ready." -ForegroundColor White
    Write-Host ""
    Write-Host "Next step: Install Ubuntu and configure WSL settings" -ForegroundColor White
    Write-Host ""
    Write-Host "Run this command:" -ForegroundColor Yellow
    Write-Host '  Invoke-WebRequest -Uri "https://raw.githubusercontent.com/notchrisgroves/ia-framework/main/setup/windows/02-install-ubuntu-and-harden.ps1" -OutFile "$env:TEMP\02-install-ubuntu-and-harden.ps1"; & "$env:TEMP\02-install-ubuntu-and-harden.ps1"' -ForegroundColor Yellow
    Write-Host ""
}
