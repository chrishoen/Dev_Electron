const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
var backendStatus = require('./backend_status.js');
var backendCmd = require('./backend_command.js');

//****************************************************************************
// Create the main window and assign handlers for the window events.

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
// Respond to the Command1 event received from the renderer ipc.

ipc.on('Command1', (event, args) => {
  console.log(`sending backend command1`);
  // Send a command to the backend and handle a completion.
  backendCmd.sendCommand1('arg0', function(msg){
    console.log(`myCommand1Completion:    ` + msg);
    let temp = 'command1 completion:    ' + msg;
    mainWindow.send('Command1Completion',temp);
  });
})

//****************************************************************************
// Initialize the backend.

// Handle received status messages
function myStatusCallback(msg) {
  //console.log(`myStatusCallback:         `,msg);
  mainWindow.send('StatusUpdate','backend status: ' + msg);
}

function initializeBackEnd() {
  console.log(`initializeBackEnd`);

  backendStatus.setStatusCallback(myStatusCallback);
  backendStatus.initialize();
  backendCmd.initialize();
}

function finalizeBackEnd() {
  console.log(`finalizeBackEnd`);
  backendStatus.finalize();
  backendCmd.finalize();
}

