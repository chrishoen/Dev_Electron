//****************************************************************************
// This contains the backend processing for isochronous messages that are
// received from the backend. The messages are transferred via udp sockets.

const dgram = require('dgram');
const settings = require('./backend_settings.js');

//****************************************************************************
// Isochronous data udp datagram receive socket. Messages are transmitted by
// the backend and received by the frontend.

// Create and initialize the receive udp socket.
const mFrontEndIsochUdp = dgram.createSocket('udp4');

mFrontEndIsochUdp.on('error', (err) => {
  console.log(`mFrontEndIsochUdp error:\n${err.stack}`);
  mFrontEndIsochUdp.close();
});

mFrontEndIsochUdp.on('listening', () => {
  const address = mFrontEndIsochUdp.address();
  console.log(`mFrontEndIsochUdp listening ${address.address}:${address.port}`);
});

mFrontEndIsochUdp.bind({
  address: "0.0.0.0",
  port: settings.mFrontEndIsochPort,
  exclusive: false
});

//****************************************************************************
// Receive message handler.

// Handle received messages. Call the saved message handler callback. 
mFrontEndIsochUdp.on('message', (aBuffer, rinfo) => {
  if (!mValid) return;
  //console.log(`mFrontEndIsochUdp:        ${aBuffer}`);

  // Call the saved completion callback, pass it the received message
  // buffer.
  mFrontEndIsochCallback(aBuffer);
});

//****************************************************************************
// Exports. Initialization.

// Saved message handler callback. This is  set by the initialize 
// function and called when messages are received.
var mFrontEndIsochCallback = null;

// True if the module is initialized.
var mValid = false;

// Initialize the module. Save the receive message handler callback.
// Set the valid flag.
exports.initialize = function(aFrontEndIsochCallback) {
  mFrontEndIsochCallback = aFrontEndIsochCallback;
  mValid = true;
  console.log('backend isoch initialize');
}

// Finalize the module. Reset the valid flag. Close the sockets. 
exports.finalize = function() {
  mValid = false;
  mFrontEndIsochUdp.close();
  console.log('backend isoch finalize');
}
