//****************************************************************************
// This defines a backend command completion message class. It contains
// string member variables that describe a command completion.
//
// A command completion is sent from the backend to the frontend during
// and after command exection.
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

module.exports = internal.CompletionMsg = class{

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
    this.mCommand = "none";
    this.mCode = "none";
    this.mMessage = "none";
  }

  // Return true if a buffer contains a message of this type.
  static isInBuffer(aBuffer){
    return aBuffer.toString('utf8',0,20).startsWith('Completion,');
  }

  // Convert from a buffer. The buffer has a csv string array format.
  fromBuffer(tBuffer){
    // Set defaults.
    this.reset();

    // Convert the buffer to a string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length < 3){
      return;
    }  

    // Set member variables from the string array.
    this.mValid = true;
    this.mCommand = tArgs[1];
    this.mCode = tArgs[2];
    if (tArgs.length >= 4){
      this.mMessage = tArgs[3];
    } else {
      this.mMessage = "none";
    }

  }

  // Convert to a buffer and return it. The buffer has a csv string
  // array format.
  toBuffer(){
    // Create a single csv string from the member varaibles, create
    // a buffer from the single csv string, and return it.
    return Buffer.from([
      "Completion",
      this.mCommand,
      this.mCode,
      this.mMessage,
    ].join());
  }
}
