import { app, shell, BrowserWindow, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')

log.transports.file.resolvePathFn = () => path.join('D:/proyectos_depa/calendify', '/logs/main.log');
//import icon from '../../resources/iconUser.ico?asset'
log.log("Version", app.getVersion());

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 430,
		height: 485,
		show: false,
		autoHideMenuBar: false,
		icon: path.join(__dirname, '../../resources/iconUser.ico'),
		autoHideMenuBar: true,
		//...(process.platform === 'linux' ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, '../preload/index.js'),
			sandbox: false
		}
	})

	mainWindow.on('ready-to-show', () => {
		mainWindow.show()
	})

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url)
		return { action: 'deny' }
	})

	if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
		mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
	} else {
		mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
	}
}

app.whenReady().then(() => {
	electronApp.setAppUserModelId('com.calendify')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	createWindow()

	if (is.dev) return;
		
	autoUpdater.checkForUpdatesAndNotify();
	
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

autoUpdater.on("update-available", (info) => {
	log.info('Nueva actualización disponible', info);
})

autoUpdater.on('update-not-available', (info) => {
	log.info('No hay actualizaciones disponibles.', info);
});

autoUpdater.on('error', (err) => {
	log.info('Error al verificar actualizaciones', err);
});

autoUpdater.on('download-progress', (progressTrack) => {
	log.info(progressTrack)
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
	log.info('Descargando actualización');
	dialog.showMessageBox({
		type: 'info',
		title: 'Nueva actualización disponible',
		message: 'La aplicación se reiniciará cuando termine la descarga...',
		textWidth: 250
	}).then(() => {
		autoUpdater.quitAndInstall();
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
