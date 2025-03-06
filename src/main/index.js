import { app, shell, BrowserWindow, dialog } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { autoUpdater } = require('electron-updater');
const log = require('electron-log')

// Mostrar información de log 
log.transports.file.resolvePathFn = () => path.join('D:/calendify', '/logs/main.log');

log.log("Version", app.getVersion());

function createWindow() {
	const mainWindow = new BrowserWindow({
		width: 430,
		height: 530,
		show: false,
		autoHideMenuBar: false,
		icon: path.join(__dirname, '../../resources/iconUser.ico'),
		autoHideMenuBar: true,
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
	electronApp.setAppUserModelId('calendify')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	createWindow()

	if (is.dev) return;
	autoUpdater.checkForUpdates();
	
	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

autoUpdater.on('update-available', (info) => {
	log.info('Nueva actualización disponible', info);

	const response = dialog.showMessageBox({
	  type: 'question',
	  buttons: ['Sí', 'No'],
	  title: 'Actualización disponible',
	  message: `Hay una nueva versión disponible (v${info.version}). ¿Te gustaría actualizar ahora?`
	});
 
	// Si el usuario acepta, iniciar la descarga en segundo plano
	if (response === 0) {
	  downloadUpdate();
	}
});

autoUpdater.on('update-not-available', (info) => {
	log.info('No hay actualizaciones disponibles.', info);
});

autoUpdater.on('error', (err) => {
	log.info('Error al verificar actualizaciones', err);
});

const downloadUpdate = () => {
	autoUpdater.downloadUpdate();

	autoUpdater.on('download-progress', (progressTrack) => {
		log.info(progressTrack);
	});
	 
	autoUpdater.on('update-downloaded', (info) => {
		log.info('Actualización descargada');
		dialog.showMessageBox({
			type: 'info',
			title: 'Actualización descargada',
			message: `La aplicación se reiniciará para instalar la versión v${info.version}.`,
			textWidth: 300
		}).then(() => {
			autoUpdater.quitAndInstall();
		});
	});
}

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})
