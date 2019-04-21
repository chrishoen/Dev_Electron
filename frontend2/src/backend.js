const dgram = require('dgram');

//****************************************************************************
// Status udp datagram.

const statusudp = dgram.createSocket('udp4');

statusudp.on('error', (err) => {
  console.log(`statusudp error:\n${err.stack}`);
  statusudp.close();
});

statusudp.on('listening', () => {
  const address = statusudp.address();
  console.log(`statusudp listening ${address.address}:${address.port}`);
});

statusudp.bind({
  address: '127.0.0.1',
  port: 56002,
  exclusive: false
});

statusudp.on('message', (msg, rinfo) => {
  console.log(`statusudp: ${msg} from ${rinfo.address}:${rinfo.port}`);
  if (!valid) return;
  cbstatus(msg);
});

//****************************************************************************
// BackEnd initialization.

var cbstatus = null;
exports.setStatusCallback = function(cb) {
  cbstatus = cb;
}

var valid = false;
exports.initialize = function() {
  valid = true;
  console.log('backend initialize');
}

exports.finalize = function() {
  valid = false;
  statusudp.close();
  console.log('backend finalize');
}
