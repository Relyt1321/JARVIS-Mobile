@echo off
setlocal
cd /d "%~dp0"

echo ========================================
echo JARVIS Mobile - Windows setup
echo ========================================

if not exist "package.json" (
  echo ERROR: package.json was not found beside this setup file.
  echo Extract the complete JARVIS-Mobile folder before running setup.
  pause
  exit /b 1
)

where node >nul 2>&1
if errorlevel 1 (
  echo ERROR: Node.js is not installed or is not on PATH.
  echo Install the Node.js LTS release, then reopen this setup file.
  pause
  exit /b 1
)

where npm.cmd >nul 2>&1
if errorlevel 1 (
  echo ERROR: npm.cmd was not found. Repair or reinstall Node.js.
  pause
  exit /b 1
)

echo Project folder: %CD%
echo.
node --version
call npm.cmd --version
if errorlevel 1 goto failed

echo.
echo Configured npm registry:
call npm.cmd config get registry
echo.
echo Checking npm registry connectivity...
call npm.cmd ping --fetch-retries=0 --fetch-timeout=8000
if errorlevel 1 (
  echo.
  echo The configured npm registry could not be reached.
  echo Check your internet connection and DNS, then run:
  echo   npm.cmd config get registry
  echo   nslookup registry.npmjs.org
  echo The registry check does not change your network or security settings.
  goto failed
)

echo.
echo Installing project dependencies...
call npm.cmd install --no-audit --no-fund
if errorlevel 1 (
  echo.
  echo Dependency installation failed.
  echo EAI_AGAIN usually means DNS cannot resolve the configured registry host.
  echo ENOENT for package.json means the project files are incomplete or misplaced.
  goto failed
)

echo.
echo Checking the project foundation...
call npm.cmd run verify:foundation
if errorlevel 1 goto failed

call npm.cmd run typecheck
if errorlevel 1 goto failed

echo.
echo Setup and checks completed successfully.
echo To start JARVIS Mobile later, run: npm.cmd start
pause
exit /b 0

:failed
echo.
echo Setup did not complete. Keep this window open and copy the error above.
pause
exit /b 1
