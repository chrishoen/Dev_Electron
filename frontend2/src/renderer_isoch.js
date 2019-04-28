//****************************************************************************
// This contains the renderer processing. 

"use strict"

const ipc = require('electron').ipcRenderer;

const isoch1Div = document.getElementById('isoch1Div');
const isoch2Div = document.getElementById('isoch2Div');

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);
   
myconsole.log(`start renderer_isoch`);

//****************************************************************************
// Handle a control message received from the main window. The
// backend receives messages via the udp datagram receive socket and 
// forwards them to the main window. The main window forwards the 
// received messages to the renderer via the ipc and they are handled 
// here.
// 
// Unpack the message buffer into a completion record. Based on 
// the completion command, call a corresponding message handler.

 ipc.on('handle-rx-isoch-msg', (event, aBuffer) => {

  myconsole.log(`handle-rx-isoch-msg       ${aBuffer}`);

  // Show the isoch.
  isoch1Div.innerHTML = "isoch data";
  isoch2Div.innerHTML = "isoch data";
});

