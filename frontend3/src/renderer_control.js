//****************************************************************************
// This module contains the renderer processing for the control, status,
// and data pages and the control messages. 

"use strict"

//****************************************************************************
// Imports. 

const ipc = require('electron').ipcRenderer;
const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


//****************************************************************************
// Page elements. 

const command1Btn = document.getElementById('command1Btn');
const command2Btn = document.getElementById('command2Btn');

const status1Div = document.getElementById('status1Div');
const status2Div = document.getElementById('status2Div');

const command1Div = document.getElementById('command1Div');
const info1Div = document.getElementById('info1Div');

const command2Div = document.getElementById('command2Div');
const info2Div = document.getElementById('info2Div');
const progress2Div = document.getElementById('progress2Div');

const dataBtn = document.getElementById('dataBtn');
const dataItem0Div = document.getElementById('dataItem0Div');
const dataItem1Div = document.getElementById('dataItem1Div');
const dataItem2Div = document.getElementById('dataItem2Div');
const dataItem3Div = document.getElementById('dataItem3Div');

myconsole.log(`start renderer_control`);

//****************************************************************************
// Handle a button user input event. Update relevant page fields and
// send a command to the main window via the ipc. The command will then be
// forwarded to the backend via the udp transmit socket. The command that
// is sent to the main window is a buffer that contains a jason message
// that is to be sent to the backend.

command1Btn.addEventListener('click', () => {
  // Update the page.
  command1Div.innerHTML = 'none';
  info1Div.innerHTML = 'none';

  // Send a command to the backend via the main window ipc.
  myconsole.log('command1 clicked');
  var tMessage = JSON.stringify({
    'MsgId' : 'Command1',
    'Arg0' : 'some_arg0',
  });
  ipc.send('send-control-msg',tMessage);
});

//****************************************************************************
// Handle another button user input event.

command2Btn.addEventListener('click', () => {
  // Update the page.
  command2Div.innerHTML = 'none';
  info2Div.innerHTML = 'none';
  progress2Div.innerHTML = 'none';

  // Send a command to the backend via the main window ipc.
  myconsole.log('command2 clicked');
  var tMessage = JSON.stringify({
    'MsgId' : 'Command2',
    'Arg0' : 'some_arg0',
  });
  ipc.send('send-control-msg',tMessage);
});

//****************************************************************************
// Handle another button user input event.

dataBtn.addEventListener('click', () => {
  // Update the page.
  dataItem0Div.innerHTML = 'none';
  dataItem1Div.innerHTML = 'none';
  dataItem2Div.innerHTML = 'none';
  dataItem3Div.innerHTML = 'none';

  // Send a command to the backend via the main window ipc.
  var tMessage = JSON.stringify({
    'MsgId' : 'DataRequest',
    'DataType' : 'DataAmber',
  });
  ipc.send('send-control-msg',tMessage);
});

//****************************************************************************
// Handle a specific command completion message received from the main
// window via the ipc. The message is a buffer that contains a json
// formatted message that was received on a udp datagram receive socket.

function handleCommand1CompletionMsg(aMsg) {

  // Show the completion record in the relevant page fields.
  if (aMsg.Code == 'Ack'){
    command1Div.innerHTML = aMsg.Code;
    info1Div.innerHTML = aMsg.Info;

  } else if (aMsg.Code == 'Nak'){
    command1Div.innerHTML = aMsg.Code;
    info1Div.innerHTML = aMsg.Info;

  } else if  (aMsg.Code == 'Done'){
    command1Div.innerHTML = aMsg.Code;
    info1Div.innerHTML = aMsg.Info;

  } else {
    command1Div.innerHTML = 'bad completion code';
    info1Div.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle another specific command completion message.

function handleCommand2CompletionMsg(aMsg) {

  // Show the completion record in the relevant page fields.
  if (aMsg.Code == 'Ack'){
    command2Div.innerHTML = aMsg.Code;
    info2Div.innerHTML = aMsg.Info;
    progress2Div.innerHTML = 'none';

  } else if (aMsg.Code == 'Nak'){
    command2Div.innerHTML = aMsg.Code;
    info2Div.innerHTML = aMsg.Info;

  } else if  (aMsg.Code == 'Done'){
    command2Div.innerHTML = aMsg.Code;
    info2Div.innerHTML = aMsg.Info;
    progress2Div.innerHTML = 'none';

  } else if  (aMsg.Code == 'Progress'){
    progress2Div.innerHTML = aMsg.Info;

  } else {
    command2Div.innerHTML = 'bad completion code';
    info2Div.innerHTML = 'none';
    progress2Div.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle a specific status message.

function handleStatusMsg(aMsg) {

  // Show the status.
  status1Div.innerHTML = aMsg.Count;
  status2Div.innerHTML = aMsg.Count;
}
   
//****************************************************************************
// Handle a data response message received from the main window.

function handleDataResponseMsg(aMsg) {

  // Show the data.
  dataItem0Div.innerHTML = aMsg.Item0;
  dataItem1Div.innerHTML = aMsg.Item1;
  dataItem2Div.innerHTML = aMsg.Item2;
  dataItem3Div.innerHTML = aMsg.Item3;
}
   
//****************************************************************************
// Handle a control message received from the main window. The
// backend receives messages via the udp datagram receive socket and 
// forwards them to the main window. The main window forwards the 
// received messages to the renderer via the ipc and they are handled 
// here. The messages are buffers that contain json formatted messages
// that werer sent by the backend.
// 
// Parse the received buffer into a json formatted message and based
// on the message identifier, call a corresponding message handler.

 ipc.on('handle-rx-control-msg', (event, aBuffer) => {

  // Parse the buffer into a received message.
  var tMessage = JSON.parse(aBuffer);

  // Test if the received message is a command completion message.
  if (tMessage.MsgId == 'Completion'){

    myconsole.log(`handle-rx-control-msg     ${aBuffer}`);

    // Call the specific message handler for the command that the
    // completion message corresponds to.
    if (tMessage.Command == 'Command1'){
      myconsole.log(`Command1 completion:      ${tMessage.Code}`);
      // Call the specific message handler.
      handleCommand1CompletionMsg(tMessage);
    }  

    // Call the specific message handler for the command that the
    // completion message corresponds to.
    else if (tMessage.Command == 'Command2'){
      myconsole.log(`Command2 completion:      ${tMessage.Code}`);
      // Call the specific message handler.
      handleCommand2CompletionMsg(tMessage);
    }  
  }  

  // Test if the received message is a status message.
  else if (tMessage.MsgId == 'Status'){
  
    // Call the specific message handler.
    handleStatusMsg(tMessage);
  }

  // Test if the received message is a data response message.
  else if (tMessage.MsgId == 'DataResponse'){

    // Call the specific message handler.
    handleDataResponseMsg(tMessage);
  }

  // Handle an unknown message.
  else{
    myconsole.log(`ERROR received unknown message`);
  }  
});

