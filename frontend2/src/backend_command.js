const dgram = require('dgram');
const settings = require('./backend_settings.js');

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

// Saved completion callbacks. These are set by the send command 
// functions and called when messages are received
var mCommand1Completion = null;

// Handle received completion messages,
mCommandOutputUdp.on('message', (msg, rinfo) => {
  if (!mValid) return;
  console.log(`mCommandOutputUdp: ${msg}`);

  // Call saved completion callback.
  if (mCommand1Completion){
    mCommand1Completion(msg);
  }
});

//****************************************************************************
// Exports. initialize.

var mValid = false;
exports.initialize = function() {
  mValid = true;
  console.log('backend command initialize');
}

exports.finalize = function() {
  mValid = false;
  mCommandInputUdp.close();
  mCommandOutputUdp.close();
  console.log('backend command finalize');
}

//****************************************************************************
// Exports. Send command.

exports.sendCommand1 = function(aArg0,aCompletion) {
  // Save callback.
  mCommand1Completion = aCompletion;
  // Send command to backend.
  const tCmd = Buffer.from('command1' + ' ' + aArg0);
  mCommandInputUdp.send(tCmd,settings.mCommandInputPort,settings.mBackEndIpAddress);
}

