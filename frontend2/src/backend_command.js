const dgram = require('dgram');
const settings = require('./backend_settings.js');

//****************************************************************************
// Command input udp datagram socket. Transmit socket.
// This is input by the backend and output by the frontend.

const mCommandInput = dgram.createSocket('udp4');

mCommandInput.on('error', (err) => {
  console.log(`mCommandInput error:\n${err.stack}`);
  mCommandInput.close();
});

//****************************************************************************
// Command output udp datagram socket. Receive socket.
// This is output by the backend and input by the frontend.

const mCommandOutput = dgram.createSocket('udp4');

mCommandOutput.on('error', (err) => {
  console.log(`mCommandOutput error:\n${err.stack}`);
  mCommandOutput.close();
});

mCommandOutput.on('listening', () => {
  const address = mCommandOutput.address();
  console.log(`mCommandOutput listening ${address.address}:${address.port}`);
});

mCommandOutput.bind({
  address: settings.mFrontEndIpAddress,
  port: settings.mCommandOutputPort,
  exclusive: false
});

mCommandOutput.on('message', (msg, rinfo) => {
//console.log(`mCommandOutput: ${msg} from ${rinfo.address}:${rinfo.port}`);
  console.log(`mCommandOutput: ${msg}`);
  if (!mValid) return;
  mCompletionCallback(msg);
});

//****************************************************************************
// Exports. initialize.

var mCompletionCallback = null;
exports.setCompletionCallback = function(aCallback) {
  mCompletionCallback = aCallback;
}

var mValid = false;
exports.initialize = function() {
  mValid = true;
  console.log('backend status initialize');
}

exports.finalize = function() {
  mValid = false;
  mCommandOutput.close();
  console.log('backend status finalize');
}

//****************************************************************************
// Exports. initialize.

exports.sendCommand1 = function() {
  const tCmd = Buffer.from('command1\0');

  mCommandInput.send(tCmd,56001,'localhost');
  return;
  mCommandInput.send(tCmd,settings.mCommandInputPort,settings.mBackEndIpAddress);
}

