//****************************************************************************
// This defines a backend command completion record class. It contains
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

module.exports = internal.CompletionRecord = class{

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
    this.mResponse = "none";
    this.mDescriptor = "none";
  }

  // Convert from a buffer. The buffer has a csv string array format.
  fromBuffer(tBuffer){
    // Convert the buffer to a string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length < 2){
      return;
    }  

    // Set member variables from the string array.
    this.mValid = true;
    this.mCommand = tArgs[0];
    this.mResponse = tArgs[1];
    if (tArgs.length == 3){
      this.mDescriptor = tArgs[2];
    }
  }

  // Convert to a buffer and return it. The buffer has a csv string
  // array format.
  toBuffer(){
    // Create a single csv string from the member varaibles, create
    // a buffer from the single csv string, and return it.
    return Buffer.from([
      this.mCommand,
      this.mResponse,
      this.mDescriptor,
    ].join());
  }
}
