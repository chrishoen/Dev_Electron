//****************************************************************************
// BackEnd settings.

// Udp ip addresses and ports. The back end receives on
// input ports and transmits on output ports.
var mBackEndIpAddress  =  "127.0.0.1";    // backend  socket ip address.
var mFrontEndIpAddress =  "127.0.0.1";    // frontend socket ip address.

var mBackEndIpAddress  =  "192.168.1.9";  // backend  socket ip address.
var mFrontEndIpAddress =  "192.168.1.3";  // frontend socket ip address.

var mCommandInputPort  =  56001;       // The backend receives  on this port.
var mCommandOutputPort =  56002;       // The backend transmits on this port.
var mStatusOutputPort  =  56003;       // The backend transmits on this port.

exports.mBackEndIpAddress  = mBackEndIpAddress;
exports.mFrontEndIpAddress = mFrontEndIpAddress;
exports.mCommandInputPort  = mCommandInputPort;
exports.mCommandOutputPort = mCommandOutputPort;
exports.mStatusOutputPort  = mStatusOutputPort;

