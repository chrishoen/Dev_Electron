const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

var backend = require('bindings')('backend.node')
console.log('This should be eight:', backend.add(3, 5));
console.log('getCount:            ', backend.getCount());

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    clearInterval(intervalId);
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

const ipc = require('electron').ipcMain;

ipc.on('synMessage', (event, args) => {
  console.log(args);
  event.returnValue = 'Main: sync message received';
})

ipc.on('aSynMessage', (event, args) => {
  console.log(args);
  event.sender.send('asynReply','Main: async message received')
})

ipc.on('myaddonMessage', (event, args) => {
  console.log(args);
  //console.log(addon.hello());
})

var count = 0;
function timerFunc() {
  console.log(`timer %d`,count);
  mainWindow.send('timerUpdate','Main: timer update ' + count);
  count++;
}
  
var intervalId = setInterval(timerFunc, 1000);
