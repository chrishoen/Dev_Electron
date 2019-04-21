const dgram = require('dgram');

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
  address: '127.0.0.1',
  port: 56002,
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
