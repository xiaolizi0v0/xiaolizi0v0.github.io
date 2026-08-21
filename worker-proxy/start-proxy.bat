@echo off
chcp 65001 >nul
title 影视剧观影-本地代理
echo ========================================
echo   影视剧观影时间胶囊 - 本地代理
echo ========================================
echo.

cd /d "%~dp0"

rem 检查 Node.js 是否安装
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装：
    echo   https://nodejs.org
    echo.
    echo 安装完成后重新双击本文件。
    pause
    exit /b 1
)

rem 清理占用 25100 端口的残留代理进程，避免 EADDRINUSE
for /f "tokens=5" %%p in ('netstat -ano ^| findstr "127.0.0.1:25100" ^| findstr "LISTENING"') do (
    echo [清理] 关闭残留的代理进程 (PID %%p) ...
    taskkill /F /PID %%p >nul 2>nul
)
timeout /t 1 /nobreak >nul

echo 正在启动本地代理 (127.0.0.1:25100) ...
echo 请保持本窗口开着，关闭即停止代理。
echo 代理地址：http://127.0.0.1:25100
echo.
node local-proxy.js

pause
