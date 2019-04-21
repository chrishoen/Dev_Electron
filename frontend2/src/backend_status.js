const dgram = require('dgram');
const settings = require('./backend_settings.js');

//****************************************************************************
// Status udp datagram.

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
  address: settings.mStatusIpAddress,
  port: settings.mStatusPort,
  exclusive: false
});

mStatusUdp.on('message', (msg, rinfo) => {
//console.log(`mStatusUdp: ${msg} from ${rinfo.address}:${rinfo.port}`);
  console.log(`mStatusUdp: ${msg}`);
  if (!mValid) return;
  mStatusCallback(msg);
});

//****************************************************************************
// BackEnd initialization.

var mStatusCallback = null;
exports.setStatusCallback = function(cb) {
  mStatusCallback = cb;
}

var mValid = false;
exports.initialize = function() {
  mValid = true;
  console.log('backend status initialize');
}

exports.finalize = function() {
  mValid = false;
  mStatusUdp.close();
  console.log('backend status finalize');
}
