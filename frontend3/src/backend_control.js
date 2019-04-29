//****************************************************************************
// This module contains the backend processing for control message traffic
// between the frontend and the backend. The messages are transferred
// via udp datagram sockets.

const dgram = require('dgram');
const settings = require('./backend_settings.js');

//****************************************************************************
// Backend control udp datagram transmit socket. Messages are received by 
// the backend and transmitted by the frontend.

// Create and initialize the transmit udp socket.
const mBackEndControlUdp = dgram.createSocket('udp4');

mBackEndControlUdp.on('error', (err) => {
  console.log(`mBackEndControlUdp error:\n${err.stack}`);
  mBackEndControlUdp.close();
});

//****************************************************************************
// Frontend control udp datagram receive socket. Messages are received by 
// the frontend and transmitted by the backend.

// Create and initialize the receive udp socket.
const mFrontEndControlUdp = dgram.createSocket('udp4');

mFrontEndControlUdp.on('error', (err) => {
  console.log(`mFrontEndControlUdp error:\n${err.stack}`);
  mFrontEndControlUdp.close();
});

mFrontEndControlUdp.on('listening', () => {
  const address = mFrontEndControlUdp.address();
  console.log(`mFrontEndControlUdp listening ${address.address}:${address.port}`);
});

mFrontEndControlUdp.bind({
  address: "0.0.0.0",
  port: settings.mFrontEndControlPort,
  exclusive: false
});

//****************************************************************************
// Receive message handler.

// Handle received messages. Call the saved message handler callback. 
mFrontEndControlUdp.on('message', (aBuffer, rinfo) => {
  if (!mValid) return;
  //console.log(`mFrontEndControlUdp:      ${aBuffer}`);

  // Call the saved callback, pass it the received message buffer.
  mFrontEndControlCallback(aBuffer);
});

//****************************************************************************
// Exports. Initialization.

// Saved message handler callback. This is  set by the initialize 
// function and called when messages are received.
var mFrontEndControlCallback = null;

// True if the module is initialized.
var mValid = false;

// Initialize the module. Save the receive message handler callback and
// set the valid flag.
exports.initialize = function(aFrontEndControlCallback) {
  mFrontEndControlCallback = aFrontEndControlCallback;
  mValid = true;
  console.log('backend control initialize');
}

// Finalize the module. Reset the valid flag. Close the sockets. 
exports.finalize = function() {
  mValid = false;
  mBackEndControlUdp.close();
  mFrontEndControlUdp.close();
  console.log('backend control finalize');
}
//****************************************************************************
// Exports. Send control.

// Send a control message to the backend via the transmit socket. The input 
// control message is a buffer. Transmit it to the backend via the socket.
exports.sendMsg = function(aBuffer) {
  // Transmit the buffer.
  mBackEndControlUdp.send(aBuffer,settings.mBackEndControlPort,settings.mBackEndIpAddress);
}

