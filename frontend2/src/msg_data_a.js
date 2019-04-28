//****************************************************************************
// This defines a backend data message class. It contains
// string member variables that contain a data request response.
//
// DataA are sent by the backend as a response to a data request
// from the frontend.
//
// It contains a method to pack the string member variables into a
// buffer that contains a single csv string.
// It contains a method to unpack the string member variables from a
// buffer that contains a single csv string.
//
// The buffers are received via udp sockets from the backend program.
// They are also sent from the main window to the renderer.

"use strict"

const internal = {};

module.exports = internal.DataAMsg = class{

  // Constructor.
  constructor(aBuffer){
    // Default constructor.
    if (aBuffer == undefined){
      this.reset();
    // Buffer constructor.
    } else {
      this.fromBuffer(aBuffer);
    }
  }

  // Reset member variables to defaults.
  reset(){
    this.mValid = false;
    this.mItem0 = "none";
    this.mItem1 = "none";
    this.mItem2 = "none";
    this.mItem3 = "none";
  }

  // Return true if a buffer contains a message of this type.
  static isInBuffer(aBuffer){
    return aBuffer.toString('utf8',0,30).startsWith('DataResponse,DataA');
  }

  // Convert from a buffer. The buffer has a csv string array format.
  fromBuffer(tBuffer){
    // Set defaults.
    this.reset();

    // Convert the buffer to a string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length < 6){
      return;
    }  

    // Set member variables from the string array.
    this.mValid = true;
    this.mItem0 = tArg[2];
    this.mItem1 = tArg[3];
    this.mItem2 = tArg[4];
    this.mItem3 = tArg[5];
  }

  // Convert to a buffer and return it. The buffer has a csv string
  // array format.
  toBuffer(){
    // Create a single csv string from the member varaibles, create
    // a buffer from the single csv string, and return it.
    return Buffer.from([
      "DataResponse",
      "DataA",
      this.mItem0,
      this.mItem1,
      this.mItem2,
      this.mItem3,
    ].join());
  }
}
