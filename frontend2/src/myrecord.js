//****************************************************************************
// This defines some test record classes.
"use strict";

const internal = {};

module.exports = internal.MyRecord = class{

  // Default constructor.
  constructor(){
    this.mItem1 = "none1";
    this.mItem2 = "none2";
  }

  // Buffer constructor.
  fromBuffer(tBuffer){
    // Convert buffer to string array.
    let tArgs = tBuffer.toString('utf8').split(',');

    // Guard.
    if (tArgs.length <2 ){
      console.log(`ERROR received message length ${tArgs.length}`);
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