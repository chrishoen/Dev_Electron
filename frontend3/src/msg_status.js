//****************************************************************************
// This defines a backend status message class. It contains
// string member variables that describe status.
//
// Status messages are periodically sent from the backend to the frontend.
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

module.exports = internal.StatusMsg = class{

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
    this.mCount = "none";
    this.mMessage = "none";
  }

  // Return true if a buffer contains a message of this type.
  static isInBuffer(aBuffer){
    return aBuffer.toString('utf8',0,20).startsWith('Status,');
  }

  // Convert from a buffer. The buffer has a csv string array format.
  fromBuffer(tBuffer){
    // Set defaults.
    this.reset();

    // Convert the buffer to a string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length < 1){
      return;
    }  

    // Set member variables from the string array.
    this.mValid = true;
    this.mCount = tArgs[1];
    if (tArgs.length >= 2){
      this.mMessage = tArgs[2];
    }
  }

  // Convert to a buffer and return it. The buffer has a csv string
  // array format.
  toBuffer(){
    // Create a single csv string from the member varaibles, create
    // a buffer from the single csv string, and return it.
    return Buffer.from([
      "Status",
      this.mCount,
      this.mMessage,
    ].join());
  }
}
