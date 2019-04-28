//****************************************************************************
// This is an electron script that manages a frontend main window that
// exchanges udp datagram messages with a c++ backend program.
//
// This frontend script and the backend program are an example message
// architecture.
//
// Each udp message contains a single csv formatted string that encapsulates
// an array of strings. 
//
// The frontend sends command messages to the backend. The backend executes
// the commands and sends command completion messages to the frontend. The
// completion messages can ack or nak a command or can indicate when a 
// command execution is done. Periodic progress messages are also sent
// for some commands. 
//
// The backend periodically sends status messages to the frontend.
// 
// This script consists of a main window and a renderer. The main window
// receives user input events from the renderer and then sends commands
// to the backend. The main window receives messages from the backend
// and forwards them to the renderer. 
//
//****************************************************************************
// This contains the main window processing.

"use strict"

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
const os = require('os');

const backendControl = require('./backend_control.js');
const backendIsoch = require('./backend_isoch.js');

//****************************************************************************
// Create the main window and assign handlers for the window events.

var mainWindow = null;

console.log(`linux ${os.type()=='Linux'}`);

function createWindow () {
  mainWindow = new BrowserWindow({
    width: 800, height: 456, x:0, y:0,
    resizable:false,autoHideMenuBar:true,
    kiosk: os.type()=='Linux'
  })
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

ipc.on('send-control-msg', (event, aBuffer) => {
  // Send a command to the backend.
  backendControl.sendMsg(aBuffer)
});

//****************************************************************************
// Handle received command completion messages from the backend. This is
// called by the backend when these messages are received.
// It forwards the messages to the renderer via the ipc.

function handleRxControlMsg(aBuffer) {
  // Forward the message buffer to the renderer via the ipc.
  mainWindow.send('handle-rx-control-msg',aBuffer);
}

//****************************************************************************
// Handle received status messages from the backend. This is
// called by the backend when these messages are received.
// It forwards the messages to the renderer via the ipc.

function handleRxIsochMsg(aBuffer) {
  // Forward the message buffer to the renderer via the ipc.
  mainWindow.send('handle-rx-isoch-msg',aBuffer);
}

//****************************************************************************
// Initialize the backend.

// Initialize the backend.
function initializeBackEnd() {
  backendControl.initialize(handleRxControlMsg);
  backendIsoch.initialize(handleRxIsochMsg);
}

// Finalize the backend.
function finalizeBackEnd() {
  backendControl.finalize();
  backendIsoch.finalize();
}

