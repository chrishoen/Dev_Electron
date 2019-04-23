//****************************************************************************
// This contains the backend processing for command messages that are
// sent to the backend and for completion and progess update message
// that are received from the backend. The messages are transferred
// via udp sockets.

const dgram = require('dgram');
const settings = require('./backend_settings.js');
const CompletionRecord = require('./record_completion.js');

//****************************************************************************
// Command input udp datagram transmit socket. Messages are transmitted
// the frontend and received by the backend.

const mCommandInputUdp = dgram.createSocket('udp4');

mCommandInputUdp.on('error', (err) => {
  console.log(`mCommandInputUdp error:\n${err.stack}`);
  mCommandInputUdp.close();
});

//****************************************************************************
// Command output udp datagram receive socket. Messages are transmitted
// the backend and received by the frontend.

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
  address: "0.0.0.0",
  port: settings.mCommandOutputPort,
  exclusive: false
});

//****************************************************************************
// Receive message handler.

// Handle received messages. Call the saved message handler callback. 
mCommandOutputUdp.on('message', (aBuffer, rinfo) => {
  if (!mValid) return;
  console.log(`mCommandOutputUdp:      ${aBuffer}`);

  // Call the saved completion callback, pass it the received message
  // buffer.
  mCompletionCallback(aBuffer);
});

//****************************************************************************
// Exports. Initialization.

// Saved message handler callback. This is  set by the initialize 
// function and called when messages are received.
var mCompletionCallback = null;

// True if the module is initialized.
var mValid = false;

// Initialize the module. Save the receive message handler callback.
// Set the valid flag.
exports.initialize = function(aCompletionCallback) {
  mCompletionCallback = aCompletionCallback;
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

// Send a command to the backend via the transmit socket. The input command
// is a string array. Create a single csv string from the input string array, create
// a buffer from the single csv string, and transmit it to the backend 
// via the socket.
exports.sendCommand = function(aStringArray) {
  // Construct the csv buffer from the string array.
  const tBuffer = Buffer.from(aStringArray.join());
  // Transmit the buffer.
  mCommandInputUdp.send(tBuffer,settings.mCommandInputPort,settings.mBackEndIpAddress);
}

