//****************************************************************************
// This contains the renderer processing.

"use strict"

const ipc = require('electron').ipcRenderer;
const MyRecord = require('./myrecord.js');

const command1Btn = document.querySelector('#command1Btn');
const command2Btn = document.querySelector('#command2Btn');

let statusDiv = document.querySelector('#statusDiv');
let command1Div = document.querySelector('#command1Div');
let command2Div = document.querySelector('#command2Div');
let progress2Div = document.querySelector('#progress2Div');

//****************************************************************************
// status.

ipc.on('StatusUpdate', (event, args) => {
  statusDiv.innerHTML = args;
});
   
//****************************************************************************
// command1.

command1Btn.addEventListener('click', () => {
  command1Div.innerHTML = 'none';
  ipc.send('Command1')
});

ipc.on('Command1Completion', (event, args) => {
  command1Div.innerHTML = args;
});

//****************************************************************************
// command2.

command2Btn.addEventListener('click', () => {
  command2Div.innerHTML = 'none';
  progress2Div.innerHTML = 'none';
  ipc.send('Command2')
});

ipc.on('Command2Completion', (event, args) => {
  command2Div.innerHTML = args;
  progress2Div.innerHTML = "none";
});

ipc.on('Command2Progress', (event, args) => {
  progress2Div.innerHTML = args;
});

//****************************************************************************
// test1.

test1Btn.addEventListener('click', () => {
  test1Div.innerHTML = 'none';
  ipc.send('Test1')
});

ipc.on('Test1Response22', (event, tBuffer) => {

  // Convert received buffer to string array.
  let tArgs = tBuffer.toString('utf8').split(',');

  // Guard.
  if (tArgs.length <2 ){
    console.log(`ERROR received message length ${tArgs.length}`);
    return;
  }  

  // Show the string array.
  test1Div.innerHTML = tArgs[0];
  test2Div.innerHTML = tArgs[1];
});

ipc.on('Test1Response', (event, tBuffer) => {

  // Convert received buffer to a record class instance.
  let tMyRecord = new MyRecord();
  tMyRecord.fromBuffer(tBuffer);

  // Show the string array.
  test1Div.innerHTML = tMyRecord.mItem1;
  test2Div.innerHTML = tMyRecord.mItem2;
});

