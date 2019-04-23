//****************************************************************************
// This defines some test record classes.
"use strict";

const internal = {};

module.exports = internal.MyRecord = class{

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
    // Convert buffer to string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length < 2){
      return;
    }  

    // Set member variables from string array.
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
    return Buffer.from([
      this.mCommand,
      this.mResponse,
      this.mDescriptor,
    ].join());
  }
}
