//****************************************************************************
// This contains the renderer processing. 

"use strict"

const ipc = require('electron').ipcRenderer;
const CompletionMsg = require('./msg_completion.js');
const StatusMsg = require('./msg_status.js');
const DataAMsg = require('./msg_data_a.js');
const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


const command1Btn = document.getElementById('command1Btn');
const command2Btn = document.getElementById('command2Btn');

const status1Div = document.getElementById('status1Div');
const status2Div = document.getElementById('status2Div');

const command1Div = document.getElementById('command1Div');
const message1Div = document.getElementById('message1Div');

const command2Div = document.getElementById('command2Div');
const message2Div = document.getElementById('message2Div');
const progress2Div = document.getElementById('progress2Div');


const dataItem0Div = document.getElementById('dataItem0Div');
const dataItem1Div = document.getElementById('dataItem1Div');
const dataItem2Div = document.getElementById('dataItem2Div');
const dataItem3Div = document.getElementById('dataItem3Div');

myconsole.log(`start renderer_control`);

//****************************************************************************
// Handle a button user input event. Update relevant page fields and
// send a command to the main window via the ipc. The command will then be
// forwarded to the backend via the udp transmit socket. The command that
// is sent to the main window is a buffer that contains a string array.

command1Btn.addEventListener('click', () => {
  // Update the page.
  command1Div.innerHTML = 'none';
  message1Div.innerHTML = 'none';
  // Send a command to the main window via the ipc.
  myconsole.log('command1 clicked');
  ipc.send('send-control-msg',['Command','Command1','arg0'])
});

//****************************************************************************
// Handle another button user input event.

command2Btn.addEventListener('click', () => {
  // Update the page.
  command2Div.innerHTML = 'none';
  message2Div.innerHTML = 'none';
  progress2Div.innerHTML = 'none';
  // Send a command to the main window via the ipc.
  ipc.send('send-control-msg',['Command','Command2','arg0'])
});

//****************************************************************************
// Handle a specific command completion record received from the main window.

function handleCommand1CompletionMsg(aCompletion) {

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

function handleCommand2CompletionMsg(aCompletion) {

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
// Handle a status update message received from the main window.

function handleStatusMsg(aStatusMsg) {

  // Show the status.
  status1Div.innerHTML = aStatusMsg.mCount;
  status2Div.innerHTML = aStatusMsg.mCount;
}
   
//****************************************************************************
// Handle a data response message received from the main window.

function handleDataAMsg(aDataAMsg) {

  // Show the data.
  dataItem0Div.innerHTML = aDataAMsg.mItem0;
  dataItem1Div.innerHTML = aDataAMsg.mItem1;
  dataItem2Div.innerHTML = aDataAMsg.mItem2;
  dataItem3Div.innerHTML = aDataAMsg.mItem3;
}
   
//****************************************************************************
// Handle a control message received from the main window. The
// backend receives messages via the udp datagram receive socket and 
// forwards them to the main window. The main window forwards the 
// received messages to the renderer via the ipc and they are handled 
// here.
// 
// Unpack the message buffer into a completion record. Based on 
// the completion command, call a corresponding message handler.

 ipc.on('handle-rx-control-msg', (event, aBuffer) => {

  // Test if the buffer contains a completion message.
  if (CompletionMsg.isInBuffer(aBuffer)){

    myconsole.log(`handle-rx-control-msg     ${aBuffer}`);

    // Convert the receive message buffer to a completion record.
    let tCompletionMsg = new CompletionMsg(aBuffer);

    //myconsole.log(`mCommand                  ${tCompletionMsg.mCommand}`);
    //myconsole.log(`mCode                     ${tCompletionMsg.mCode}`);
    //myconsole.log(`mMessage                  ${tCompletionMsg.mMessage}`);

    // Guard.
    if (!tCompletionMsg.mValid){
      myconsole.log(`ERROR received bad completion message`);
      return;
    }  

    // Call the specific message handler for the command indicated by the
    // completion record.
    if (tCompletionMsg.mCommand == 'Command1'){
      myconsole.log(`Command1 completion:      ${tCompletionMsg.mCode}`);
      // Call the specific message handler.
      handleCommand1CompletionMsg(tCompletionMsg);
    }  

    // Call the specific message handler for the command indicated by the
    // completion record.
    else if (tCompletionMsg.mCommand == 'Command2'){
      myconsole.log(`Command2 completion:      ${tCompletionMsg.mCode}`);
      // Call the specific message handler.
      handleCommand2CompletionMsg(tCompletionMsg);
    }
  }  

  // Test if the buffer contains a status message.
  else if (StatusMsg.isInBuffer(aBuffer)){
  
    // Convert the receive message buffer to a status message.
    let tStatusMsg = new StatusMsg(aBuffer);

    // Guard.
    if (!tStatusMsg.mValid){
      myconsole.log(`ERROR received bad status message`);
      return;
    }  

    // Call the specific message handler.
    handleStatusMsg(tStatusMsg);
  }

  // Test if the buffer contains a data response message.
  else if (DataAMsg.isInBuffer(aBuffer)){
  
    // Convert the receive message buffer to a status message.
    let tDataAMsg = new DataAMsg(aBuffer);

    // Guard.
    if (!tDataAMsg.mValid){
      myconsole.log(`ERROR received bad status message`);
      return;
    }  

    // Call the specific message handler.
    handleDataAMsg(tDataAMsgMsg);
  }

  // Handle an unknown message.
  else{
    myconsole.log(`ERROR received unknown message`);
  }  
});

