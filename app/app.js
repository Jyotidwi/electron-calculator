const { app, BrowserWindow, Menu, nativeTheme } = require('electron');
const electronLog = require('electron-log');
const contextMenu = require('electron-context-menu');
const path = require('path');
const url = require('url');

// Initialize Electron remote module
require('@electron/remote/main').initialize();

// Get app version from package.json
var appVersion = app.getVersion();
// Get Electron versions
var electronVersion = process.versions.electron;
var chromeVersion = process.versions.chrome;
var nodeVersion = process.versions.node;
var v8Version = process.versions.v8;

// Globally export what OS we are on
const isLinux = process.platform === 'linux';
const isWin = process.platform === 'win32';
const isMac = process.platform === 'darwin';

function createWindow () {
  let mainWindow = new BrowserWindow({
    title: 'Electron Calculator',
    resizable: true,
    maximizable: true,
    width: 350,
    height: 450,
    icon: isWin ? path.join(__dirname, 'icon.ico') : path.join(__dirname, 'icon64.png'),
    darkTheme: true,
    webPreferences: {
      nodeIntegration: false,
      nodeIntegrationInWorker: false,
      contextIsolation: false,
      sandbox: false,
      experimentalFeatures: true,
      webviewTag: true,
      devTools: true,
      javascript: true,
      plugins: true,
      enableRemoteModule: true,
      // Preload before renderer processes
      preload: path.join(__dirname, 'preload.js')
    }
  });
  require("@electron/remote/main").enable(mainWindow.webContents);
  Menu.setApplicationMenu(Menu.buildFromTemplate([
  {
    role: 'fileMenu',
    label: 'App',
    submenu: [
      {
        label: 'Relaunch',
        click() {
          app.relaunch();
          app.quit();
        }
      },
      { type: 'separator' },
      {
        label: 'Quit',
        accelerator: 'CmdOrCtrl+Q',
        role: 'quit'
      }
    ]
  },
  {
    role: 'editMenu',
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      { role: 'pasteandmatchstyle' },
      { role: 'delete' },
      { type: 'separator' },
      { role: 'selectall' }
    ]
  },
  {
    role: 'viewMenu'
  },
  {
    role: 'help',
    label: 'About',
    submenu: [
      { label: 'Electron Calculator v' + app.getVersion(), enabled: false },
      { label: 'Created by Alex313031',
        click() {
          new BrowserWindow({width: 1024, height: 768}).loadURL('https://github.com/Alex313031/electron-calculator#readme');
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'View Humans.txt',
        accelerator: 'CmdorCtrl+Alt+Shift+H',
        click() {
          const humansWindow = new BrowserWindow({width: isWin ? 350 : 350, height: isWin ? 420 : 400, title: "humans.txt", darkTheme: true});
          humansWindow.loadFile('./humans.txt');
          electronLog.info('Opened humans.txt :)');
        }
      },
      {
        label: 'View License',
        accelerator: 'CmdorCtrl+Alt+Shift+L',
        click() {
          const humansWindow = new BrowserWindow({width: isWin ? 532 : 532, height: isWin ? 642 : 624, title: "License", darkTheme: true});
          humansWindow.loadFile('./license.md');
          electronLog.info('Opened license.md');
        }
      },
      {
        label: 'About App',
        accelerator: 'CmdorCtrl+Alt+A',
        click() {
          const aboutWindow = new BrowserWindow({
            width: isWin ? 350 : 350,
            height: isWin ? 400 : 380,
            title: "About App",
            icon: isWin ? path.join(__dirname, 'icon.ico') : path.join(__dirname, 'icon64.png'),
            darkTheme: true,
            webPreferences: {
              nodeIntegration: false,
              nodeIntegrationInWorker: false,
              contextIsolation: false,
              sandbox: false,
              experimentalFeatures: true,
              webviewTag: true,
              devTools: true,
              javascript: true,
              plugins: true,
              enableRemoteModule: true,
              preload: path.join(__dirname, 'preload.js'),
            },
          });
          require("@electron/remote/main").enable(aboutWindow.webContents);
          aboutWindow.loadFile('./about.html');
          electronLog.info('Opened about.html');
        }
      }
    ]
  }
  ]));

  nativeTheme.themeSource = 'dark';

  // Load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));
}

contextMenu({
  showSelectAll: false,
  showCopyImage: true,
  showCopyImageAddress: true,
  showSaveImageAs: true,
  showCopyVideoAddress: true,
  showSaveVideoAs: true,
  showCopyLink: true,
  showSaveLinkAs: true,
  showInspectElement: true,
  showLookUpSelection: true,
  showSearchWithGoogle: true,
  prepend: (defaultActions, parameters, browserWindow) => [
  { label: 'Open Link in New Window',
    // Only show it when right-clicking a link
    visible: parameters.linkURL.trim().length > 0,
    click: (linkURL) => {
      const newWin = new BrowserWindow({
        title: 'New Window',
        width: 1024,
        height: 768,
        webPreferences: {
          nodeIntegration: false,
          nodeIntegrationInWorker: false,
          contextIsolation: false,
          sandbox: false,
          experimentalFeatures: true,
          webviewTag: true,
          devTools: true,
          javascript: true,
          plugins: true,
          enableRemoteModule: true,
        }
      });
      const toURL = parameters.linkURL;
      newWin.loadURL(toURL);
    }
  }]
});

app.whenReady().then(createWindow);

electronLog.info('Welcome to Electron Calculator!');
electronLog.info('App Version: ' + [ appVersion ]);
electronLog.info('Electron Version: ' + [ electronVersion ]);
electronLog.info('Chromium Version: ' + [ chromeVersion ]);
electronLog.info('NodeJS Version: ' + [ nodeVersion ]);
electronLog.info('V8 Version: ' + [ v8Version ]);

// app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('enable-local-file-accesses');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('enable-ui-devtools');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
