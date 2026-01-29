#!/usr/bin/env pwsh
# Script to run the JourneyJournal Web Client

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Definition
$webProjectPath = Join-Path $scriptDir "..\src\JourneyJournal.Web"

Write-Host "Starting Web Client..." -ForegroundColor Cyan
Push-Location $webProjectPath

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install dependencies!" -ForegroundColor Red
        exit 1
    }
}

Write-Host "`nLaunching development server..." -ForegroundColor Cyan
Write-Host "Web client will be available at: http://localhost:5173 (or next available port)" -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Yellow

npm run dev
Pop-Location
