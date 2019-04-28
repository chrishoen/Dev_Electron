//****************************************************************************
// BackEnd settings.

// Udp ip addresses and ports. The back end receives on
// input ports and transmits on output ports.
var mBackEndIpAddress  =  "192.168.1.9";  // backend  socket ip address.

var mBackEndIpAddress  =  "127.0.0.1";    // backend  socket ip address.

var mBackEndControlPort  =  56001;       // The backend receives  on this port.
var mFrontEndControlPort =  56002;       // The backend transmits on this port.
var mFrontEndIsochPort   =  56003;       // The backend transmits on this port.

exports.mBackEndIpAddress    = mBackEndIpAddress;
exports.mBackEndControlPort  = mBackEndControlPort;
exports.mFrontEndControlPort = mFrontEndControlPort;
exports.mFrontEndIsochPort   = mFrontEndIsochPort;

