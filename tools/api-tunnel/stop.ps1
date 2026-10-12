$ErrorActionPreference = 'Stop'
$runtimeDir = Join-Path $PSScriptRoot '.runtime'
$pidFile = Join-Path $runtimeDir 'tunnel.pid'
$binary = Join-Path $runtimeDir 'cloudflared.exe'
if (Test-Path -LiteralPath $pidFile) {
    $tunnelProcess = Get-Process -Id ([int](Get-Content -LiteralPath $pidFile -Raw)) -ErrorAction SilentlyContinue
    if ($tunnelProcess -and $tunnelProcess.Path -eq $binary) {
        Stop-Process -Id $tunnelProcess.Id
        Write-Output 'Tunnel stopped.'
    } else {
        Write-Output 'Tunnel is not running.'
    }
    Remove-Item -LiteralPath $pidFile
} else {
    Write-Output 'Tunnel is not running.'
}
$urlFile = Join-Path $runtimeDir 'public-api-url.txt'
if (Test-Path -LiteralPath $urlFile) { Remove-Item -LiteralPath $urlFile }
