import { app, BrowserWindow, shell, Menu, dialog } from 'electron';
import path from 'path';

const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 960,
    minHeight: 640,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false, // needed for IndexedDB on file:// protocol
    },
    icon: path.join(app.getAppPath(), 'public/icon.png'),
    title: 'Trader OS',
    backgroundColor: '#0f1117',
    show: false,
  });

  // FIX: Use app.getAppPath() which correctly resolves inside app.asar
  // process.resourcesPath + '/app' was WRONG — files are in app.asar, not app/
  const indexPath = isDev
    ? path.join(__dirname, '../dist/public/index.html')
    : path.join(app.getAppPath(), 'dist/public/index.html');

  win.loadFile(indexPath).catch((err) => {
    // Show error dialog if index.html can't be loaded — helps diagnose path issues
    const msg = `Failed to load app:\n${indexPath}\n\nError: ${err.message}`;
    dialog.showErrorBox('Trader OS — Load Error', msg);
  });

  // Open external links in system browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  return win;
}

// Hide menu bar (SPA app)
Menu.setApplicationMenu(null);

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
