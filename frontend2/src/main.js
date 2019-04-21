const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
var backendStatus = require('./backend_status.js');

//****************************************************************************
// Create main window.


var mainWindow = null;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    console.log(`closed`);
    mainWindow = null;
  })
}

app.on('ready', function () {
  console.log(`ready`);
  createWindow();
})

app.on('browser-window-created', function () {
  console.log(`browser-window-created`);
  initializeBackEnd();
  return;
})

app.on('before-quit', function () {
  console.log(`before-quit`);
  finalizeBackEnd();
})

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
// command1.

function myCommand1Completion(code,message) {
  console.log(`myCommand1Completion:    `,code,message);
  let temp = 'command1 completion:    ' + " " + code + " " + message;
  mainWindow.send('command1Completion',temp);
}

ipc.on('command1', (event, args) => {
  console.log(`calling backend command1`);
})

//****************************************************************************
// command2.

function myCommand2Completion(code,message) {
  console.log(`myCommand2Completion:    `,code,message);
  let temp = 'command2 completion:    ' + " " + code + " " + message;
  mainWindow.send('command2Completion',temp);
}

function myCommand2Progress(message) {
  console.log(`myCommand2Progress:      `,message);
  let temp = 'command2 progress:    ' + " " + message;
  mainWindow.send('command2Progress',temp);
}

ipc.on('command2', (event, args) => {
  console.log(`calling backend command2`);
})


//****************************************************************************
// BackEnd communications.

function myStatusCallback(x) {
  //console.log(`myTimerCallback:         `,x);
  mainWindow.send('timerUpdate','backend timer: ' + x);
}

function initializeBackEnd() {
  console.log(`initializeBackEnd`);
  backendStatus.setStatusCallback(myStatusCallback);
  backendStatus.initialize();
}

function finalizeBackEnd() {
  console.log(`finalizeBackEnd`);
  backendStatus.finalize();
}

