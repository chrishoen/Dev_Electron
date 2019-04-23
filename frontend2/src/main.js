//****************************************************************************
// This contains the main window processing.

"use strict"

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
const backendStatus = require('./backend_status.js');
const backendCmd = require('./backend_command.js');
const MyRecord = require('./myrecord.js');
const CompletionRecord = require('./record_completion.js');

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
    function(aCompletion){
      console.log(`Command1 completion:    ${aCompletion.mCommand}`);
      mainWindow.send('Command1Completion',aCompletion.toBuffer());
  });
});

//****************************************************************************
// Respond to a command event received from the renderer ipc.

ipc.on('Command2', (event, args) => {
  // Send a command to the backend and handle a completion.
  backendCmd.sendCommand2(
    // Command arguments.
    'arg0', 
    // Handle a completion. Send the received data to the renderer ipc.
    function(aCompletion){
      console.log(`Command2 completion:    ${aCompletion.mCommand}`);
      mainWindow.send('Command2Completion',aCompletion.toBuffer());
  });
});

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
  // Record class instance. 
  const tMyRecord = new MyRecord();
  tMyRecord.mItem1 = 'some_item1';
  tMyRecord.mItem2 = 'some_item2';

  showMyRecord(tMyRecord);

  // Send test response to the renderer ipc.
  mainWindow.send('Test1Response',tMyRecord.toBuffer());
})

function showMyRecord(aMyRecord){
  console.log(`show MyRecord ${aMyRecord.mItem1},${aMyRecord.mItem2}`);
}