#!/usr/bin/env pwsh
# Script to update the database with EF Core migrations
# Handles connection string issues by using absolute path

$apiProjectPath = Join-Path $PSScriptRoot "src/JourneyJournal.Api"
$dataProjectPath = Join-Path $PSScriptRoot "src/JourneyJournal.Data"
$dbDirectory = Join-Path $dataProjectPath "db"
$dbPath = Join-Path $dbDirectory "journeydb.sqlite"

# Convert to absolute path with forward slashes for SQLite
$absoluteDbPath = (Resolve-Path $dbPath -ErrorAction SilentlyContinue).Path
if (-not $absoluteDbPath) {
    # If db doesn't exist yet, build the path manually
    $absoluteDbPath = [System.IO.Path]::GetFullPath($dbPath)
}
$absoluteDbPath = $absoluteDbPath -replace '\\', '/'

$connectionString = "Data Source=$absoluteDbPath"

Write-Host "Updating database with migrations..." -ForegroundColor Cyan
Write-Host "Database path: $absoluteDbPath" -ForegroundColor Gray
Write-Host ""

Set-Location $apiProjectPath

# Run database update with explicit connection string
dotnet ef database update --project ../JourneyJournal.Data --connection $connectionString

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDatabase updated successfully!" -ForegroundColor Green
} else {
    Write-Host "`nDatabase update failed!" -ForegroundColor Red
    exit 1
}
