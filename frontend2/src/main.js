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
  mainWindow = new BrowserWindow({width: 800, height: 420, x:0, y:0})
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
  // Send a command to the backend.
  backendCmd.sendCommand(['Command1','arg0'])
});

//****************************************************************************
// Respond to a command event received from the renderer ipc.

ipc.on('Command2', (event, args) => {
  // Send a command to the backend.
  backendCmd.sendCommand(['Command2','arg0'])
});

//****************************************************************************
// Handle command completion messages received from the backend udp socket.
// This is called by the backend when these messages are received. It
// unpacks the received message buffer into a completion record. Based on
// the record contents, it forwards the message buffer to the renderer via
// the ipc.

function handleRxCompletionMsg(aBuffer) {

  // Convert the receive message buffer to a completion record.
  let tCompletion = new CompletionRecord(aBuffer);

  // Guard.
  if (!tCompletion.mValid){
    console.log(`ERROR received message ${tCompletion.mCommand}`);
    return;
  }  

  // Process for the specific command that the completion message
  // corresponds to.
  if (tCompletion.mCommand == 'Command1'){
    console.log(`Command1 completion:    ${tCompletion.mCode}`);
    // Forward the message buffer to the renderer via the ipc.
    mainWindow.send('Command1Completion',aBuffer);
    return;
  }  

  // Process for the specific command that the completion message
  // corresponds to.
  if (tCompletion.mCommand == 'Command2'){
    console.log(`Command2 completion:    ${tCompletion.mCode}`);
    // Forward the message buffer to the renderer via the ipc.
    mainWindow.send('Command2Completion',aBuffer);
    return;
  }  
}

//****************************************************************************
// Handle received status messages from the backend. This is
// called by the backend when these messages are received.
// It forwards the messages to the renderer via the ipc.

function handleRxStatusMsg(aBuffer) {
  // Forward the message buffer to the renderer via the ipc.
  mainWindow.send('StatusUpdate',aBuffer);
}

//****************************************************************************
// Initialize the backend.

// Initialize the backend.
function initializeBackEnd() {
  backendStatus.initialize(handleRxStatusMsg);
  backendCmd.initialize(handleRxCompletionMsg);
}

// Finalize the backend.
function finalizeBackEnd() {
  backendStatus.finalize();
  backendCmd.finalize();
}

