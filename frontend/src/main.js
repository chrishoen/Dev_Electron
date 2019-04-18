const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

//****************************************************************************
// BackEnd dll tests.

var backend = require('bindings')('backend.node')
console.log('setCount:            ', backend.setCount(800));
console.log('getCount:            ', backend.getCount());

function mycallback1(x) {
  console.log(`mycallback1:         `,x);
}

function mycallback2(result,x) {
  console.log(`mycallback2:         `,result);
  console.log(`mycallback2:         `,x);
}

backend.callCallback1(mycallback1);
backend.callCallback3(mycallback1);

backend.saveCallback(mycallback1);
//backend.callSavedCallback();

//****************************************************************************
// Main window.

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    backend.finalize();
    if (intervalId != 0) clearInterval(intervalId);
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

//****************************************************************************
// ipc communication from buttons.

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
  backend.callCallback1(mycallback1);
})

//****************************************************************************
// Timer function.

var count = 0;
function timerFunc() {
  console.log(`timer %d`,count);
  mainWindow.send('timerUpdate','Main: timer update ' + count);
  count++;
}
  
var intervalId = 0;
app.on('browser-window-created', function () {
  return;
  console.log(`setInterval`);
  intervalId = setInterval(timerFunc, 1000);
})

