## Confguración para auto-actualización desde servidor

### Editar el archivo package.json
Agregar al archivo 

```
   "build": {
      "publish": [
         {
            "provider": "generic",
            "url": "http://localhost/autoupdate/" # url del servidor donde se alojará el archivo de actualización
         }
      ]
   }
```

### Instalación de electron updater

```bash

$ npm install electron-updater

```

### main/index.js

Agregar al método principal 
```
   const { autoUpdater } = require('electron-updater');
   app.whenReady().then(() => {
      ...
      autoUpdater.checkForUpdates();
   }); 

   autoUpdater.on('update-available', (info) => {
      log.info('Nueva actualización disponible', info);

      const response = dialog.showMessageBox({
      type: 'question',
      buttons: ['Sí', 'No'],
      title: 'Actualización disponible',
      message: `Hay una nueva versión disponible (v${info.version}). ¿Te gustaría actualizar ahora?`
      });
   
      #Si el usuario acepta, iniciar la descarga en segundo plano
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
```





