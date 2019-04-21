const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
var backendStatus = require('./backend_status.js');
var backendCmd = require('./backend_command.js');

//****************************************************************************
// Main window.

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

function myCommand1Completion(message) {
  console.log(`myCommand1Completion:    ` + message);
  let temp = 'command1 completion:    ' + message;
  mainWindow.send('Command1Completion',temp);
}

ipc.on('Command1', (event, args) => {
  console.log(`sending backend command1`);
  backendCmd.sendCommand1('arg0');
})

//****************************************************************************
// command2.

function myCommand2Completion(code,message) {
  console.log(`myCommand2Completion:    `,code,message);
  let temp = 'command2 completion:    ' + " " + code + " " + message;
  mainWindow.send('Command2Completion',temp);
}

function myCommand2Progress(message) {
  console.log(`myCommand2Progress:      `,message);
  let temp = 'command2 progress:    ' + " " + message;
  mainWindow.send('Command2Progress',temp);
}

ipc.on('Command2', (event, args) => {
  console.log(`calling backend command2`);
})


//****************************************************************************
// BackEnd interactions.

function myStatusCallback(x) {
  //console.log(`myStatusCallback:         `,x);
  mainWindow.send('StatusUpdate','backend status: ' + x);
}

function myCommandCompletionCallback(x) {
  console.log(`myCommandCompletionCallback:         ` + x);
  //mainWindow.send('StatusUpdate','backend status: ' + x);
}

function initializeBackEnd() {
  console.log(`initializeBackEnd`);

  backendCmd.setCompletionCallback(myCommandCompletionCallback);
  backendCmd.initialize();

  backendStatus.setStatusCallback(myStatusCallback);
  backendStatus.initialize();
}

function finalizeBackEnd() {
  console.log(`finalizeBackEnd`);
  backendStatus.finalize();
}

