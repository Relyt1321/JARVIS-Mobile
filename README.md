# JARVIS Mobile

A standalone mobile JARVIS project. It is separate from the Windows JARVIS codebase, AI system, memory, and interface. The initial target is iPhone; the project is also configured to keep Android support possible.

## Current progress

- Section 1 — Mobile application foundation and navigation: scaffold and structural verification are implemented. Home is explicitly configured as the initial tab. A Windows setup helper now locates its own project folder before running npm, avoiding the earlier `ENOENT` mistake. Device/runtime verification remains incomplete until dependencies install and the app launches.
- Section 2 and later: not started.

The Home, Assistant, Memory, and Settings routes are navigation placeholders only. They do not claim to provide AI, memory, voice, camera, or phone-control functionality yet.

## Requirements

- Node.js 22.13 or newer.
- npm.
- Xcode on a Mac for local iOS simulator/native builds, or an Expo development build workflow for a physical iPhone.

## Install and start

### Windows (easiest method)

Double-click `install-windows.cmd` inside the extracted `JARVIS-Mobile` folder. It automatically changes to the folder containing its own `package.json`, displays the configured npm registry, checks registry connectivity, installs dependencies with `npm.cmd`, then runs the foundation check and TypeScript check. It does not change PowerShell security settings or registry configuration. Before downloading packages, it runs a short `npm ping` against the registry configured for npm and stops early if that registry cannot be reached. If the check fails, leave the window open and copy the error. An `EAI_AGAIN` message means DNS could not resolve the registry host; the setup script cannot repair a network outage.

### Windows PowerShell (manual method)

1. Download and extract the project ZIP.
2. Open PowerShell in the extracted `JARVIS-Mobile` folder (the folder containing `package.json`).
3. Confirm that PowerShell is in the right folder:

```powershell
Test-Path .\package.json
```

It must print `True`. If it prints `False`, use `cd "FULL\PATH\TO\JARVIS-Mobile"` and check again. Do not run the install command from `C:\Users\M` unless that is actually where this project's `package.json` is located.

4. Install and verify:

```powershell
npm.cmd ping --fetch-retries=0 --fetch-timeout=8000
npm.cmd install --no-audit --no-fund
npm.cmd run typecheck
npm.cmd run verify:foundation
npm.cmd start
```

Use `npm.cmd` in PowerShell to avoid its script-execution-policy block on `npm.ps1`. An `ENOENT` error naming `package.json` means the command was run outside the project folder. An `EAI_AGAIN` error means the configured registry hostname could not be resolved. Check the registry with `npm.cmd config get registry`, test the default npm host with `nslookup registry.npmjs.org`, then retry after DNS/network access is restored.

### macOS / Linux

Run these commands from the extracted `JARVIS-Mobile` folder:

```bash
npm install --no-audit --no-fund
npm run typecheck
npm run verify:foundation
npm start
```

Open the project on an iPhone using a compatible Expo Go version or a development build. SDK 58 may require a development build until the matching Expo Go release is available on the App Store.

## Project structure

```text
src/
  app/
    _layout.tsx
    +not-found.tsx
    (tabs)/
      _layout.tsx
      index.tsx
      assistant.tsx
      memory.tsx
      settings.tsx
  components/
    ScreenPlaceholder.tsx
scripts/
  verify-foundation.mjs
app.json
install-windows.cmd
package.json
tsconfig.json
```

## Architecture boundary

This project must remain independent of the Windows JARVIS project. Do not import or reuse its source code, runtime, AI configuration, or memory files. A separate mobile backend can be added in the appropriate later roadmap section.
