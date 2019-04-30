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

const btnCommand1 = document.getElementById('btnCommand1');
const btnCommand2 = document.getElementById('btnCommand2');

const divStatus1 = document.getElementById('divStatus1');
const divStatus2 = document.getElementById('divStatus2');

const divCommand1 = document.getElementById('divCommand1');
const divInfo1 = document.getElementById('divInfo1');

const divCommand2 = document.getElementById('divCommand2');
const divInfo2 = document.getElementById('divInfo2');
const divProgress2 = document.getElementById('divProgress2');

const btnData = document.getElementById('btnData');
const divDataItem0 = document.getElementById('divDataItem0');
const divDataItem1 = document.getElementById('divDataItem1');
const divDataItem2 = document.getElementById('divDataItem2');
const divDataItem3 = document.getElementById('divDataItem3');

myconsole.log(`start renderer_control`);

//****************************************************************************
// Handle a button user input event. Update relevant page fields and
// send a command to the main window via the ipc. The command will then be
// forwarded to the backend via the udp transmit socket. The command that
// is sent to the main window is a buffer that contains a jason message
// that is to be sent to the backend.

btnCommand1.addEventListener('click', () => {
  // Update the page.
  divCommand1.innerHTML = 'none';
  divInfo1.innerHTML = 'none';

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

btnCommand2.addEventListener('click', () => {
  // Update the page.
  divCommand2.innerHTML = 'none';
  divInfo2.innerHTML = 'none';
  divProgress2.innerHTML = 'none';

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

btnData.addEventListener('click', () => {
  // Update the page.
  divDataItem0.innerHTML = 'none';
  divDataItem1.innerHTML = 'none';
  divDataItem2.innerHTML = 'none';
  divDataItem3.innerHTML = 'none';

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
    divCommand1.innerHTML = aMsg.Code;
    divInfo1.innerHTML = aMsg.Info;

  } else if (aMsg.Code == 'Nak'){
    divCommand1.innerHTML = aMsg.Code;
    divInfo1.innerHTML = aMsg.Info;

  } else if  (aMsg.Code == 'Done'){
    divCommand1.innerHTML = aMsg.Code;
    divInfo1.innerHTML = aMsg.Info;

  } else {
    divCommand1.innerHTML = 'bad completion code';
    divInfo1.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle another specific command completion message.

function handleCommand2CompletionMsg(aMsg) {

  // Show the completion record in the relevant page fields.
  if (aMsg.Code == 'Ack'){
    divCommand2.innerHTML = aMsg.Code;
    divInfo2.innerHTML = aMsg.Info;
    divProgress2.innerHTML = 'none';

  } else if (aMsg.Code == 'Nak'){
    divCommand2.innerHTML = aMsg.Code;
    divInfo2.innerHTML = aMsg.Info;

  } else if  (aMsg.Code == 'Done'){
    divCommand2.innerHTML = aMsg.Code;
    divInfo2.innerHTML = aMsg.Info;
    divProgress2.innerHTML = 'none';

  } else if  (aMsg.Code == 'Progress'){
    divProgress2.innerHTML = aMsg.Info;

  } else {
    divCommand2.innerHTML = 'bad completion code';
    divInfo2.innerHTML = 'none';
    divProgress2.innerHTML = 'none';
  }
}

//****************************************************************************
// Handle a specific status message.

function handleStatusMsg(aMsg) {

  // Show the status.
  divStatus1.innerHTML = aMsg.Count;
  divStatus2.innerHTML = aMsg.Count;
}
   
//****************************************************************************
// Handle a data response message received from the main window.

function handleDataResponseMsg(aMsg) {

  // Show the data.
  divDataItem0.innerHTML = aMsg.Item0;
  divDataItem1.innerHTML = aMsg.Item1;
  divDataItem2.innerHTML = aMsg.Item2;
  divDataItem3.innerHTML = aMsg.Item3;
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

