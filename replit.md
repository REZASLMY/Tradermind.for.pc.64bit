# Trader OS — Advanced Trading Operating System

ژورنال معاملاتی آفلاین با قابلیت ثبت، آنالیز و بهبود عملکرد معاملاتی. قابل نصب روی ویندوز ۱۱ (۶۴ بیت) و اندروید.

## Run & Operate

- `pnpm --filter @workspace/tradermind run dev` — اجرای برنامه در مرورگر (Vite dev server)
- `pnpm --filter @workspace/api-server run dev` — اجرای API server
- `pnpm run typecheck` — بررسی TypeScript
- `pnpm run build` — بیلد کامل

## Build for Distribution (via GitHub Actions)

بیلد فایل‌های نصبی از طریق GitHub Actions اتفاق می‌افتد:

- **Windows EXE**: push به main یا tag `v*` → اجرای `.github/workflows/build-windows.yml`
- **Android APK**: push به main یا tag `v*` → اجرای `.github/workflows/build-android.yml`

### ساخت ریلیز
```bash
git tag v1.0.0
git push origin v1.0.0
```
سپس GitHub Actions به صورت خودکار `setup.exe` و `APK` می‌سازد و در Releases قرار می‌دهد.

## Stack

- pnpm workspaces, Node.js 20, TypeScript 5.9
- UI: React 19 + Vite + Tailwind CSS v4
- Desktop: Electron (for Windows/Mac installer)
- Mobile: Capacitor (for Android APK)
- DB: Dexie (IndexedDB — fully offline)
- State: Zustand

## Where things live

- `artifacts/tradermind/` — برنامه اصلی Trader OS
- `artifacts/tradermind/electron/` — کد Electron (main process)
- `artifacts/tradermind/src/` — کد React (renderer process)
- `artifacts/tradermind/public/icon.png` — آیکون برنامه (Trader OS logo)
- `artifacts/tradermind/electron-builder.json` — تنظیمات بیلد ویندوز/مک
- `artifacts/tradermind/capacitor.config.ts` — تنظیمات اندروید
- `.github/workflows/build-windows.yml` — CI برای ساخت setup.exe
- `.github/workflows/build-android.yml` — CI برای ساخت APK

## Architecture decisions

- **آفلاین اول**: تمام داده‌ها در IndexedDB (Dexie) ذخیره می‌شوند. نیاز به اینترنت ندارد.
- **Hash routing**: برای Electron (file:// protocol) از hash-based routing استفاده می‌شود.
- **دو vite config**: `vite.config.ts` برای Replit (نیاز به PORT/BASE_PATH) و `vite.electron.config.ts` برای بیلد Electron/Capacitor (base="./" برای file://).
- **GitHub Actions fix**: pnpm-workspace.yaml تنظیمات خاص Linux دارد که win32 packages را حذف می‌کند. در GitHub Actions این تنظیمات قبل از build حذف می‌شوند.

## User preferences

- آیکون: Trader OS logo (تصویر ارسالی)
- مخزن GitHub: https://github.com/REZASLMY/Tradermind.for.pc.64bit
- ویندوز ۱۱ x64، اندروید APK

## Gotchas

- **باگ اصلی**: `pnpm-workspace.yaml` overrides های `win32>*: "-"` باعث می‌شوند rollup روی Windows نتواند native module پیدا کند. GitHub Actions workflow این را با Python script قبل از install حذف می‌کند.
- برای بیلد electron از `vite.electron.config.ts` استفاده کن (نه `vite.config.ts`).
- برای اندروید: Capacitor در GitHub Actions نصب و تنظیم می‌شود (نیاز به commit کردن `android/` folder نیست).

## Pointers

- See the `pnpm-workspace` skill for workspace structure
