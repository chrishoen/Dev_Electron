//****************************************************************************
// This contains the renderer processing.

"use strict"

const ipc = require('electron').ipcRenderer;
const MyRecord = require('./myrecord.js');
const CompletionRecord = require('./record_completion.js');


const command1Btn = document.querySelector('#command1Btn');
const command2Btn = document.querySelector('#command2Btn');

let statusDiv = document.querySelector('#statusDiv');
let command1Div = document.querySelector('#command1Div');
let command2Div = document.querySelector('#command2Div');
let progress2Div = document.querySelector('#progress2Div');

var nodeConsole = require('console');
var myConsole = new nodeConsole.Console(process.stdout, process.stderr);

//****************************************************************************
// status.

ipc.on('StatusUpdate', (event, args) => {
  statusDiv.innerHTML = args;
});
   
//****************************************************************************
// command1.

command1Btn.addEventListener('click', () => {
  command1Div.innerHTML = 'none';
  message1Div.innerHTML = 'none';
  ipc.send('Command1')
});

ipc.on('Command1Completion', (event, aBuffer) => {
  // Convert the receive message buffer to a completion record.
  let tCompletion = new CompletionRecord(aBuffer);

  // Show the completion record.
  if (tCompletion.mCode == 'ack'){
    command1Div.innerHTML = tCompletion.mCode;
    message1Div.innerHTML = tCompletion.mMessage;

  } else if (tCompletion.mCode == 'nak'){
    command1Div.innerHTML = tCompletion.mCode;
    message1Div.innerHTML = tCompletion.mMessage;

  } else if  (tCompletion.mCode == 'done'){
    command1Div.innerHTML = tCompletion.mCode;
    message1Div.innerHTML = tCompletion.mMessage;

  } else {
    command1Div.innerHTML = 'bad completion code';
    message1Div.innerHTML = 'none';
  }

});

//****************************************************************************
// command2.

command2Btn.addEventListener('click', () => {
  command2Div.innerHTML = 'none';
  message2Div.innerHTML = 'none';
  progress2Div.innerHTML = 'none';
  ipc.send('Command2')
});

ipc.on('Command2Completion', (event, aBuffer) => {
  // Convert the receive message buffer to a completion record.
  let tCompletion = new CompletionRecord(aBuffer);

  // Show the completion record.
  if (tCompletion.mCode == 'ack'){
    command2Div.innerHTML = tCompletion.mCode;
    message2Div.innerHTML = tCompletion.mMessage;
    progress2Div.innerHTML = 'none';

  } else if (tCompletion.mCode == 'nak'){
    command2Div.innerHTML = tCompletion.mCode;
    message2Div.innerHTML = tCompletion.mMessage;

  } else if  (tCompletion.mCode == 'done'){
    command2Div.innerHTML = tCompletion.mCode;
    message2Div.innerHTML = tCompletion.mMessage;
    progress2Div.innerHTML = 'none';

  } else if  (tCompletion.mCode == 'progress'){
    progress2Div.innerHTML = tCompletion.mMessage;

  } else {
    command2Div.innerHTML = 'bad completion code';
    message2Div.innerHTML = 'none';
    progress2Div.innerHTML = 'none';
  }

});
