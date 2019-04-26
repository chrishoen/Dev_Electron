//****************************************************************************
// This contains the renderer processing. 

"use strict"

const ipc = require('electron').ipcRenderer;
const CompletionRecord = require('./record_completion.js');

const command1Btn = document.getElementById('command1Btn');
const command2Btn = document.getElementById('command2Btn');

const status1Div = document.getElementById('status1Div');
const status2Div = document.getElementById('status2Div');

const command1Div = document.getElementById('command1Div');
const message1Div = document.getElementById('message1Div');

const command2Div = document.getElementById('command2Div');
const message2Div = document.getElementById('message2Div');
const progress2Div = document.getElementById('progress2Div');

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);

//****************************************************************************
// Handle a status update message received from the main window.

ipc.on('StatusUpdate', (event, args) => {
  // Show the status.
  status1Div.innerHTML = args;
  status2Div.innerHTML = args;
});
   
//****************************************************************************
// Handle a button user input event. Update relevant page fields and
// send a command to the main window via the ipc. The command will then be
// forwarded to the backend via the udp transmit socket. The command that
// is sent to the main window is a buffer that contains a string array.

if (progress2Div == undefined){
  myconsole.log('command1 undefined');
} else {
  myconsole.log('command1 defined');
}

command1Btn.addEventListener('click', () => {
  // Update the page.
  command1Div.innerHTML = 'none';
  message1Div.innerHTML = 'none';
  // Send a command to the main window via the ipc.
  myconsole.log('command1 clicked');
  ipc.send('SendCommand',['Command1','arg0'])
});

//****************************************************************************
// Handle another button user input event.

command2Btn.addEventListener('click', () => {
  // Update the page.
  command2Div.innerHTML = 'none';
  message2Div.innerHTML = 'none';
  progress2Div.innerHTML = 'none';
  // Send a command to the main window via the ipc.
  ipc.send('SendCommand',['Command2','arg0'])
});

//****************************************************************************
// Handle a specific command completion record received from the main window.

function handleCommand1Completion(aCompletion) {

  // Show the completion record in the relevant page fields.
  if (aCompletion.mCode == 'ack'){
    command1Div.innerHTML = aCompletion.mCode;
    message1Div.innerHTML = aCompletion.mMessage;

  } else if (aCompletion.mCode == 'nak'){
    command1Div.innerHTML = aCompletion.mCode;
    message1Div.innerHTML = aCompletion.mMessage;

  } else if  (aCompletion.mCode == 'done'){
    command1Div.innerHTML = aCompletion.mCode;
    message1Div.innerHTML = aCompletion.mMessage;

  } else {
    command1Div.innerHTML = 'bad completion code';
    message1Div.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle a specific command completion record received from the main window.

function handleCommand2Completion(aCompletion) {

  // Show the completion record in the relevant page fields.
  if (aCompletion.mCode == 'ack'){
    command2Div.innerHTML = aCompletion.mCode;
    message2Div.innerHTML = aCompletion.mMessage;
    progress2Div.innerHTML = 'none';

  } else if (aCompletion.mCode == 'nak'){
    command2Div.innerHTML = aCompletion.mCode;
    message2Div.innerHTML = aCompletion.mMessage;

  } else if  (aCompletion.mCode == 'done'){
    command2Div.innerHTML = aCompletion.mCode;
    message2Div.innerHTML = aCompletion.mMessage;
    progress2Div.innerHTML = 'none';

  } else if  (aCompletion.mCode == 'progress'){
    progress2Div.innerHTML = aCompletion.mMessage;

  } else {
    command2Div.innerHTML = 'bad completion code';
    message2Div.innerHTML = 'none';
    progress2Div.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle a command completion message received from the main window. The
// backend receives messages via the udp datagram receive socket and 
// forwards them to the main window. The main window forwards the 
// received messages to the renderer via the ipc and they are handled 
// here.
// 
// Unpack the message buffer into a completion record. Based on 
// the completion command, call a corresponding message handler.

ipc.on('CommandCompletion', (event, aBuffer) => {

  // Convert the receive message buffer to a completion record.
  let tCompletion = new CompletionRecord(aBuffer);

  // Guard.
  if (!tCompletion.mValid){
    myconsole.log(`ERROR received message ${tCompletion.mCommand}`);
    return;
  }  

  // Call the specific message handler for the command indicated by the
  // completion record.
  if (tCompletion.mCommand == 'Command1'){
    myconsole.log(`Command1 completion:    ${tCompletion.mCode}`);
    // Call the specific message handler.
    handleCommand1Completion(tCompletion);
  }  

  // Call the specific message handler for the command indicated by the
  // completion record.
  else if (tCompletion.mCommand == 'Command2'){
    myconsole.log(`Command2 completion:    ${tCompletion.mCode}`);
    // Call the specific message handler.
    handleCommand2Completion(tCompletion);
  }  

  // Handle an unknown command completion message.
  else{
    myconsole.log(`unknown completion message:    ${tCompletion.mCode}`);
  }  
});

