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
    this.mItem1 = "none1";
    this.mItem2 = "none2";
  }

  // Convert from buffer.
  fromBuffer(tBuffer){
    // Convert buffer to string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length <2 ){
      return;
    }  

    // Set member variables from string array.
    this.mItem1 = tArgs[0];
    this.mItem2 = tArgs[1];
  }

  // Convert to buffer.
  toBuffer(){
    // Convert member variables to csv string buffer.
    return Buffer.from([this.mItem1,this.mItem2].join());
  }
}