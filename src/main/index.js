import { app, shell, BrowserWindow, ipcMain } from 'electron'
import path, { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
const { autoUpdater } = require('electron-updater');
//import icon from '../../resources/iconUser.ico?asset'

const server = 'https://github.com/karenHuff/calendify';


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
	electronApp.setAppUserModelId('com.electron')

	app.on('browser-window-created', (_, window) => {
		optimizer.watchWindowShortcuts(window)
	})

	ipcMain.on('ping', () => console.log('pong'))

	createWindow()

	// Configuración de autoactualización
	autoUpdater.setFeedURL(server); // Configura la URL de feed
	autoUpdater.checkForUpdatesAndNotify(); // Verifica actualizaciones automáticamente

	autoUpdater.on('checking-for-update', () => {
		console.log('Verificando actualizaciones...');
	});

	autoUpdater.on('update-available', (info) => {
		console.log('Actualización disponible.');
		dialog.showMessageBox({
			type: 'info',
			title: 'Actualización disponible',
			message: 'Hay una nueva versión disponible. Se actualizará ahora.',
		});
	});

	autoUpdater.on('update-not-available', (info) => {
		console.log('No hay actualizaciones disponibles.');
	});

	autoUpdater.on('error', (err) => {
		console.error('Error al verificar actualizaciones', err);
	});

	autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
		console.log('Actualización descargada', releaseName);
		dialog.showMessageBox({
			type: 'info',
			title: 'Actualización descargada',
			message: 'La actualización se descargó correctamente. La aplicación se cerrará y actualizará.',
		}).then(() => {
			autoUpdater.quitAndInstall(); //... Cierra la app e instala la nueva versión
		});
	});

	app.on('activate', function () {
		if (BrowserWindow.getAllWindows().length === 0) createWindow()
	})
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})