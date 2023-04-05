const { app, BrowserWindow } = require('electron')

function createWindow () {
	let mainWindow = new BrowserWindow({
		width: 350,
		height: 450,
		icon:'app/assets/ic_calculator_64.png',
		webPreferences: {
		  nodeIntegration: true,
		  webviewTag: true
		}
	  });
	mainWindow.loadFile('./app/index.html');
	mainWindow.setMenuBarVisibility(true);
	mainWindow.setResizable(true);
}
app.whenReady().then(createWindow);
app.commandLine.appendSwitch('enable-experimental-web-platform-features');
app.commandLine.appendSwitch('allow-file-access-from-files');
app.commandLine.appendSwitch('enable-local-file-accesses');
app.commandLine.appendSwitch('enable-quic');
app.commandLine.appendSwitch('enable-ui-devtools');
app.commandLine.appendSwitch('ignore-gpu-blocklist');
app.commandLine.appendSwitch('enable-gpu-rasterization');
