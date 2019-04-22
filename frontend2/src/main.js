//****************************************************************************
// This contains the main window processing.

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
// Respond to a command event received from the renderer ipc.

ipc.on('Command1', (event, args) => {
  // Send a command to the backend and handle a completion.
  backendCmd.sendCommand1(
    // Command arguments.
    'arg0', 
    // Handle a completion. Send the received data to the renderer ipc.
    function(msg){
      console.log(`Command1 completion:    ` + msg);
      mainWindow.send('Command1Completion',msg);
  });
})

//****************************************************************************
// Respond to a command event received from the renderer ipc.

ipc.on('Command2', (event, args) => {
  // Send a command to the backend and handle a completion
  // and a progress update. 
  backendCmd.sendCommand2(
    // Command arguments.
    'arg0', 
    // Handle a completion. Send the received data to the renderer ipc.
    function(msg){
      console.log(`Command2 completion:    ` + msg);
      mainWindow.send('Command2Completion',msg);
    },
    // Handle a progress update. Send the received data to the renderer ipc.
    function(msg){
      console.log(`Command2 progress:      ` + msg);
      mainWindow.send('Command2Progress',msg);
    });
})

//****************************************************************************
// Initialize the backend.

// Handle received status messages from the backend. This is called
// periodically by the backend to update status.
function myStatusCallback(msg) {
    // Send the received data to the renderer ipc.
    mainWindow.send('StatusUpdate',msg);
}

// Initialize the backend.
function initializeBackEnd() {
  backendStatus.initialize(myStatusCallback);
  backendCmd.initialize();
}

// Finalize the backend.
function finalizeBackEnd() {
  backendStatus.finalize();
  backendCmd.finalize();
}

//****************************************************************************
// Respond to a test event received from the renderer ipc.

ipc.on('Test1', (event, args) => {
  // Send test response to the renderer ipc.
  let tMsg = 'some test data';
  mainWindow.send('Test1Response',tMsg);
})

