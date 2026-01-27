#!/usr/bin/env pwsh
# Script to build and run the JourneyJournal API
# Checks if port 5062 is in use and kills the process if needed

$apiPort = 5062
$apiProjectPath = Join-Path $PSScriptRoot "src/JourneyJournal.Api"

Write-Host "Checking if port $apiPort is in use..." -ForegroundColor Cyan

# Find process using the port
$processOnPort = Get-NetTCPConnection -LocalPort $apiPort -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess -First 1

if ($processOnPort) {
    Write-Host "Port $apiPort is in use by process ID: $processOnPort" -ForegroundColor Yellow
    Write-Host "Stopping process..." -ForegroundColor Yellow
    
    try {
        Stop-Process -Id $processOnPort -Force -ErrorAction Stop
        Write-Host "Process stopped successfully." -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
    catch {
        Write-Host "Failed to stop process: $_" -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "Port $apiPort is available." -ForegroundColor Green
}

Write-Host "`nBuilding API project..." -ForegroundColor Cyan
Set-Location $apiProjectPath

Write-Host "`nStarting API server with hot reload..." -ForegroundColor Cyan
Write-Host "API will be available at: http://localhost:$apiPort" -ForegroundColor Green
Write-Host "Hot reload enabled - API will automatically restart on code changes." -ForegroundColor Green
Write-Host "Press Ctrl+C to stop the server.`n" -ForegroundColor Yellow

dotnet watch run --no-hot-reload
