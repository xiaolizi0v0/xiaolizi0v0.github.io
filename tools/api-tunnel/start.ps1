[CmdletBinding()]
param(
    [uri]$ApiUrl = 'http://10.21.1.45:26199/v1',
    [ValidateSet('http2', 'quic', 'auto')][string]$Protocol = 'http2'
)

$ErrorActionPreference = 'Stop'
$runtimeDir = Join-Path $PSScriptRoot '.runtime'
$null = New-Item -ItemType Directory -Path $runtimeDir -Force
$binary = Join-Path $runtimeDir 'cloudflared.exe'
$pidFile = Join-Path $runtimeDir 'tunnel.pid'
$urlFile = Join-Path $runtimeDir 'public-api-url.txt'
$logFile = Join-Path $runtimeDir 'tunnel.log'
$stdoutFile = Join-Path $runtimeDir 'stdout.log'

if ($ApiUrl.Scheme -notin @('http', 'https') -or $ApiUrl.UserInfo -or $ApiUrl.Query -or $ApiUrl.Fragment) {
    throw 'ApiUrl must be an HTTP(S) URL without credentials, query, or fragment.'
}

if (Test-Path -LiteralPath $pidFile) {
    $existing = Get-Process -Id ([int](Get-Content -LiteralPath $pidFile -Raw)) -ErrorAction SilentlyContinue
    if ($existing -and $existing.Path -eq $binary) {
        Write-Output "Tunnel already running (PID $($existing.Id))."
        if (Test-Path -LiteralPath $urlFile) { Get-Content -LiteralPath $urlFile }
        exit 0
    }
}

$tcp = New-Object System.Net.Sockets.TcpClient
try {
    $connect = $tcp.ConnectAsync($ApiUrl.DnsSafeHost, $ApiUrl.Port)
    if (-not $connect.Wait(5000)) { throw 'Origin connection timed out.' }
    $null = $connect.GetAwaiter().GetResult()
} catch {
    throw "Cannot reach $($ApiUrl.Authority). Run this script on a computer connected to that LAN. $($_.Exception.Message)"
} finally {
    $tcp.Dispose()
}

if (-not (Test-Path -LiteralPath $binary)) {
    $architecture = if ([Environment]::Is64BitOperatingSystem) { 'amd64' } else { '386' }
    $download = "https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-$architecture.exe"
    $partial = "$binary.download"
    Write-Output 'Downloading cloudflared from the official Cloudflare GitHub release...'
    & curl.exe --fail --location --continue-at - --connect-timeout 20 --max-time 900 --silent --show-error --output $partial $download
    if ($LASTEXITCODE -ne 0) { throw 'Download failed. Download cloudflared.exe manually into .runtime and retry.' }
    Move-Item -LiteralPath $partial -Destination $binary -Force
}

# An explicit empty configuration avoids inheriting another tunnel's default configuration.
$configFile = Join-Path $runtimeDir 'quick.yml'
Set-Content -LiteralPath $configFile -Value '{}' -Encoding ASCII
if (Test-Path -LiteralPath $urlFile) { Remove-Item -LiteralPath $urlFile }
$origin = $ApiUrl.GetLeftPart([System.UriPartial]::Authority)
$arguments = @('tunnel', '--config', ('"' + $configFile + '"'), '--no-autoupdate', '--protocol', $Protocol, '--url', $origin)
$tunnelProcess = Start-Process -FilePath $binary -ArgumentList $arguments -WindowStyle Hidden -RedirectStandardError $logFile -RedirectStandardOutput $stdoutFile -PassThru
Set-Content -LiteralPath $pidFile -Value $tunnelProcess.Id -Encoding ASCII

Write-Output "Starting tunnel to $origin (PID $($tunnelProcess.Id))..."
$deadline = [DateTime]::UtcNow.AddSeconds(45)
$publicUrl = $null
while ([DateTime]::UtcNow -lt $deadline) {
    if ($tunnelProcess.HasExited) {
        Get-Content -LiteralPath $logFile -Tail 20 -ErrorAction SilentlyContinue
        throw 'cloudflared exited before connecting. See .runtime/tunnel.log.'
    }
    $log = Get-Content -LiteralPath $logFile -Raw -ErrorAction SilentlyContinue
    if ($log -match 'https://[a-z0-9-]+\.trycloudflare\.com') { $publicUrl = $Matches[0] }
    if ($publicUrl -and $log -match 'Registered tunnel connection') {
        $apiPath = $ApiUrl.AbsolutePath.TrimEnd('/')
        $publicApi = "$publicUrl$apiPath"
        Set-Content -LiteralPath $urlFile -Value $publicApi -Encoding ASCII
        Write-Output "Public API base URL: $publicApi"
        Write-Output 'Temporary hostname; SSE streaming is not supported. Use stream=false.'
        Write-Output 'The tunnel runs in the background. Run stop.ps1 to stop it.'
        exit 0
    }
    Start-Sleep -Milliseconds 500
}

Stop-Process -Id $tunnelProcess.Id -ErrorAction SilentlyContinue
Remove-Item -LiteralPath $pidFile -ErrorAction SilentlyContinue
Get-Content -LiteralPath $logFile -Tail 20 -ErrorAction SilentlyContinue
throw 'Tunnel could not connect in 45 seconds. Check outbound access to Cloudflare on TCP port 7844.'
