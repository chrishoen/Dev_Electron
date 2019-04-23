//****************************************************************************
// This contains the backend processing for periodic status messages that are
// received from the backend via a udp socket.

const dgram = require('dgram');
const settings = require('./backend_settings.js');

//****************************************************************************
// Status udp datagram.

// Create and initialize the receive udp socket.
const mStatusUdp = dgram.createSocket('udp4');

mStatusUdp.on('error', (err) => {
  console.log(`mStatusUdp error:\n${err.stack}`);
  mStatusUdp.close();
});

mStatusUdp.on('listening', () => {
  const address = mStatusUdp.address();
  console.log(`mStatusUdp listening ${address.address}:${address.port}`);
});

mStatusUdp.bind({
  address: "0.0.0.0",
  port: settings.mStatusOutputPort,
  exclusive: false
});

// Handle received messages. Call the saved message handler callback. 
mStatusUdp.on('message', (msg, rinfo) => {
//console.log(`mStatusUdp: ${msg} from ${rinfo.address}:${rinfo.port}`);
//console.log(`mStatusUdp: ${msg}`);
  if (!mValid) return;
  mStatusCallback(msg);
});

//****************************************************************************
// Exports. Initialization.

// Saved message handler callback. This is  set by the initialize 
// function and called when messages are received.
var mStatusCallback = null;

// True if the module is initialized.
var mValid = false;

// Initialize the module. Save the receive message handler callback.
// Set the valid flag.
exports.initialize = function(aStatusCallback) {
  mStatusCallback = aStatusCallback;
  mValid = true;
  console.log('backend status initialize');
}

// Finalize the module. Reset the valid flag. Close the socket. 
exports.finalize = function() {
  mValid = false;
  mStatusUdp.close();
  console.log('backend status finalize');
}
