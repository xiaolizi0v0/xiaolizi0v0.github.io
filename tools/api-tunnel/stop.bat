@echo off
setlocal
title API Tunnel - Stop
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0stop.ps1"
set "tunnelExitCode=%errorlevel%"
echo.
if not "%tunnelExitCode%"=="0" echo Tunnel failed to stop. See the error above.
pause
exit /b %tunnelExitCode%
