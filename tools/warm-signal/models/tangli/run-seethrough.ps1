param(
    [Parameter(Mandatory = $true)][string]$SourceImage,
    [Parameter(Mandatory = $true)][string]$OutputDirectory,
    [string]$RuntimeDirectory = 'C:/Users/xiaolizi0v0/.codex/warm-signal-model-runtime',
    [int]$Seed = 42,
    [int]$Resolution = 1280,
    [ValidateSet('auto', 'http')][string]$DownloadTransport = 'auto'
)
$ErrorActionPreference = 'Stop'
$sourcePath = (Resolve-Path -LiteralPath $SourceImage).Path
$runtimePath = (Resolve-Path -LiteralPath $RuntimeDirectory).Path
$pythonPath = Join-Path $runtimePath 'seethrough-venv/Scripts/python.exe'
$repoPath = Join-Path $runtimePath 'see-through'
$outputPath = [System.IO.Path]::GetFullPath($OutputDirectory)
if (Test-Path -LiteralPath $outputPath) { throw '请选择新的版本目录，保留上次试验和失败记录。' }
if (!(Test-Path -LiteralPath $pythonPath)) { throw '缺少独立 See-through 运行环境。' }
New-Item -ItemType Directory -Path $outputPath | Out-Null
$sourceHash = (Get-FileHash -LiteralPath $sourcePath -Algorithm SHA256).Hash.ToLowerInvariant()
Push-Location $repoPath
try {
    $revision = (& git rev-parse HEAD).Trim()
    $localChanges = & git diff -- common/utils/inference_utils.py
    [System.IO.File]::WriteAllText((Join-Path $outputPath 'source-changes.patch'), ($localChanges -join "`n") + "`n", [System.Text.UTF8Encoding]::new($false))
    $provenance = [ordered]@{
        engine = 'See-through'; upstream = 'https://github.com/shitagaki-lab/see-through'
        sourceCommit = $revision; sourceImage = $sourcePath; sourceSha256 = $sourceHash
        seed = $Seed; resolution = $Resolution; depthResolution = 768; inferenceSteps = 30
        precision = 'bfloat16'; groupOffload = $true; splitLeftRight = $true
        downloadTransport = $DownloadTransport
        status = 'running'; startedAt = [datetime]::UtcNow.ToString('o')
    }
    $tracePath = Join-Path $outputPath 'run.json'
    [System.IO.File]::WriteAllText($tracePath, ($provenance | ConvertTo-Json -Depth 8), [System.Text.UTF8Encoding]::new($false))
    $oldPythonPath = $env:PYTHONPATH
    $oldTokenPolicy = $env:HF_HUB_DISABLE_IMPLICIT_TOKEN
    $oldCachePath = $env:HF_HUB_CACHE
    $oldUnbuffered = $env:PYTHONUNBUFFERED
    $oldXetPolicy = $env:HF_HUB_DISABLE_XET
    $oldDownloadTimeout = $env:HF_HUB_DOWNLOAD_TIMEOUT
    try {
        $env:PYTHONPATH = Join-Path $repoPath 'common'
        $env:HF_HUB_DISABLE_IMPLICIT_TOKEN = '1'
        $env:HF_HUB_CACHE = Join-Path $runtimePath 'model-cache'
        $env:PYTHONUNBUFFERED = '1'
        if ($DownloadTransport -eq 'http') {
            $env:HF_HUB_DISABLE_XET = '1'
            $env:HF_HUB_DOWNLOAD_TIMEOUT = '60'
        }
        & $pythonPath inference/scripts/inference_psd.py --srcp $sourcePath --save_dir $outputPath --seed $Seed --resolution $Resolution --resolution_depth 768 --inference_steps 30 --save_to_psd --tblr_split --group_offload 2>&1 | Tee-Object -FilePath (Join-Path $outputPath 'inference.log')
        $inferenceExit = $LASTEXITCODE
        $provenance.status = if ($inferenceExit -eq 0) { 'inference-finished-awaiting-art-review' } else { 'inference-failed' }
        $provenance['exitCode'] = $inferenceExit
        $provenance['finishedAt'] = [datetime]::UtcNow.ToString('o')
        [System.IO.File]::WriteAllText($tracePath, ($provenance | ConvertTo-Json -Depth 8), [System.Text.UTF8Encoding]::new($false))
        if ($inferenceExit -ne 0) { throw '推理失败，保留日志；没有通过美术检查或绑定验收。' }
    } finally {
        $env:PYTHONPATH = $oldPythonPath
        $env:HF_HUB_DISABLE_IMPLICIT_TOKEN = $oldTokenPolicy
        $env:HF_HUB_CACHE = $oldCachePath
        $env:PYTHONUNBUFFERED = $oldUnbuffered
        $env:HF_HUB_DISABLE_XET = $oldXetPolicy
        $env:HF_HUB_DOWNLOAD_TIMEOUT = $oldDownloadTimeout
    }
} finally { Pop-Location }
