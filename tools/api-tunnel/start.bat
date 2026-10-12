@echo off
setlocal
title API Tunnel - Start
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0start.ps1" %*
set "tunnelExitCode=%errorlevel%"
echo.
if not "%tunnelExitCode%"=="0" echo Tunnel failed to start. See the error above.
pause
exit /b %tunnelExitCode%
