const electron = require('electron');
const ipc = require('electron').ipcMain;

app = electron.app,
BrowserWindow = electron.BrowserWindow;

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    console.log(`closed`);
    mainWindow = null;
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

ipc.on('EchoRequest', (event, msg) => {
  console.log('Rx EchoRequest');
  mainWindow.send('EchoResponse', 'data');
});
  