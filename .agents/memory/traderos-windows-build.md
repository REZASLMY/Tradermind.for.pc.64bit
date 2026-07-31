---
name: Trader OS Windows Build Fix
description: Root cause and fix for rollup win32 module error in GitHub Actions Windows build
---

# Trader OS — Windows Build Fix

## The Rule
When building `@workspace/tradermind` on Windows (GitHub Actions `windows-latest`), the `pnpm-workspace.yaml` overrides must be stripped before `pnpm install`. Failing to do this causes a fatal build error.

## Why
`pnpm-workspace.yaml` contains overrides like `"rollup>@rollup/rollup-win32-x64-msvc": "-"` designed to exclude Windows binary packages on Replit's Linux environment. On a Windows CI runner, these overrides prevent rollup from finding its own native Win32 module even though `@rollup/rollup-win32-x64-msvc` is listed as a direct devDependency in the tradermind package. The result:
```
Error: Cannot find module @rollup/rollup-win32-x64-msvc
```

## How to Apply
In `.github/workflows/build-windows.yml`, run a Python script BEFORE `pnpm install` that removes lines containing `win32` or `msvc` from `pnpm-workspace.yaml`. The script is already in the workflow at the "Fix pnpm-workspace.yaml for Windows build" step.

Never remove the overrides from `pnpm-workspace.yaml` itself — they are needed for Replit (Linux x64 environment).

## Key Files
- `.github/workflows/build-windows.yml` — Windows CI with the fix
- `.github/workflows/build-android.yml` — Android APK via Capacitor
- `artifacts/tradermind/vite.electron.config.ts` — Electron/Capacitor build (base="./", no PORT/BASE_PATH needed)
- `artifacts/tradermind/vite.config.ts` — Replit dev server (requires PORT + BASE_PATH env vars)
- `artifacts/tradermind/capacitor.config.ts` — Capacitor config for Android
- `artifacts/tradermind/electron-builder.json` — Windows NSIS installer config
