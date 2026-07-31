// Electron main process — CommonJS (.cjs) to avoid ESM conflict with "type":"module" in package.json
const { app, BrowserWindow, Menu, shell, dialog } = require("electron");
const path = require("path");

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    title: "Trader OS",
    icon: path.join(app.getAppPath(), "public/icon.png"),
    backgroundColor: "#0f1117",
    show: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.cjs"),
      webSecurity: false, // needed for IndexedDB on file:// protocol
    },
  });

  const isDev = !app.isPackaged;

  // In dev: load from Vite dev server; in production: load bundled index.html
  const indexPath = isDev
    ? path.join(__dirname, "../dist/public/index.html")
    : path.join(app.getAppPath(), "dist/public/index.html");

  win.loadFile(indexPath).catch((err) => {
    dialog.showErrorBox(
      "Trader OS — Load Error",
      `Failed to load app:\n${indexPath}\n\nError: ${err.message}`
    );
  });

  // Show window only after content is ready (no white flash)
  win.once("ready-to-show", () => {
    win.show();
    if (isDev) win.webContents.openDevTools();
  });

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http")) shell.openExternal(url);
    return { action: "deny" };
  });

  return win;
}

// Hide menu bar (SPA — no native menu needed)
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
