//****************************************************************************
// This contains the backend processing for command messages that are
// sent to the backend and for completion and progess update message
// that are received from the backend.

const dgram = require('dgram');
const settings = require('./backend_settings.js');
const CompletionRecord = require('./record_completion.js');

//****************************************************************************
// Command input udp datagram socket. Transmit socket.
// This is input by the backend and output by the frontend.

const mCommandInputUdp = dgram.createSocket('udp4');

mCommandInputUdp.on('error', (err) => {
  console.log(`mCommandInputUdp error:\n${err.stack}`);
  mCommandInputUdp.close();
});

//****************************************************************************
// Command output udp datagram socket. Receive socket.
// This is output by the backend and input by the frontend.

// Create and initialize the receive udp socket.
const mCommandOutputUdp = dgram.createSocket('udp4');

mCommandOutputUdp.on('error', (err) => {
  console.log(`mCommandOutputUdp error:\n${err.stack}`);
  mCommandOutputUdp.close();
});

mCommandOutputUdp.on('listening', () => {
  const address = mCommandOutputUdp.address();
  console.log(`mCommandOutputUdp listening ${address.address}:${address.port}`);
});

mCommandOutputUdp.bind({
  address: settings.mFrontEndIpAddress,
  port: settings.mCommandOutputPort,
  exclusive: false
});

//****************************************************************************
// Receive message handler.

// Saved completion callbacks. These are set by the send command 
// functions and called when messages are received.
var mCommand1Completion = null;
var mCommand2Completion = null;

// Handle received messages. Call the saved message handler callbacks. 
mCommandOutputUdp.on('message', (aBuffer, rinfo) => {
  if (!mValid) return;
  console.log(`mCommandOutputUdp:      ${aBuffer}`);

  // Convert the receive message buffer to a completion record.
  let tCompletion = new CompletionRecord(aBuffer);

  // Guard.
  if (!tCompletion.mValid){
    console.log(`ERROR received message ${tCompletion.mCommand}`);
    return;
  }  

  // Process for specific command completion.
  if (tCompletion.mCommand == 'Command1'){
    if (mCommand1Completion){
      mCommand1Completion(tCompletion);
    }
    return;
  }  

  // Process for specific command completion.
  if (tCompletion.mCommand == 'Command2'){
    if (mCommand2Completion){
      mCommand2Completion(tCompletion);
    }
    return;
  }  
});

//****************************************************************************
// Exports. initialize.

// True if the module is initialized.
var mValid = false;

// Initialize the module. Set the valid flag.
exports.initialize = function() {
  mValid = true;
  console.log('backend command initialize');
}

// Finalize the module. Reset the valid flag. Close the sockets. 
exports.finalize = function() {
  mValid = false;
  mCommandInputUdp.close();
  mCommandOutputUdp.close();
  console.log('backend command finalize');
}

//****************************************************************************
// Exports. Send command.

// Send a command to the backend via the transmit socket.
// Save the command completion message handler callback.
exports.sendCommand1 = function(aArg0,aCompletion) {
  // Save the completion callback. This is called when a completion
  // message is received.
  mCommand1Completion = aCompletion;
  // Send command to backend.
  const tCmd = Buffer.from('Command1' + ',' + aArg0);
  mCommandInputUdp.send(tCmd,settings.mCommandInputPort,settings.mBackEndIpAddress);
}

//****************************************************************************
// Exports. Send command.

// Send a command to the backend via the transmit socket.
// Save the command completion message handler callback.
exports.sendCommand2 = function(aArg0,aCompletion,aProgress) {
  // Save the completion callback. This is called when a completion
  // message is received.
  mCommand2Completion = aCompletion;
  // Send command to backend.
  const tCmd = Buffer.from('Command2' + ',' + aArg0);
  mCommandInputUdp.send(tCmd,settings.mCommandInputPort,settings.mBackEndIpAddress);
}

