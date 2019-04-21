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
//if (mainWindow == null) return;
//mainWindow.send('timerUpdate','statusudp: ' + msg);
});

//****************************************************************************
// BackEnd initialization.

exports.init = function() {
  console.log(`backend init`);
}
