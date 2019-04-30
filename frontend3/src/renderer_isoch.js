//****************************************************************************
// This module contains the renderer processing for the isochronous page
// and isochronous messages. 

"use strict"

const ipc = require('electron').ipcRenderer;

const divIsoch1 = document.getElementById('divIsoch1');
const divIsoch2 = document.getElementById('divIsoch2');

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);
   
myconsole.log(`start renderer_isoch`);

//****************************************************************************
// Handle a osoch message received from the main window. The
// backend receives messages via the udp datagram receive socket and 
// forwards them to the main window. The main window forwards the 
// received messages to the renderer via the ipc and they are handled 
// here.
// 
// Unpack the message buffer into a some content items.

 ipc.on('handle-rx-isoch-msg', (event, aBuffer) => {

  //myconsole.log(`handle-rx-isoch-msg       ${aBuffer}`);

  // Convert the buffer to a string array.
  let tArgs = aBuffer.toString('utf8').split(',');
  let tCount = tArgs[1];
  
  // Show the isoch.
  divIsoch1.innerHTML = tCount;
  divIsoch2.innerHTML = tCount;
});

