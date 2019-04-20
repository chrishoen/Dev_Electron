const ipc = require('electron').ipcRenderer;
const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');
const command1Btn = document.querySelector('#command1Btn');
const command2Btn = document.querySelector('#command2Btn');

let replyDiv = document.querySelector('#replyDiv');
let timerDiv = document.querySelector('#timerDiv');
let command1Div = document.querySelector('#command1Div');
let command2Div = document.querySelector('#command2Div');
let progress2Div = document.querySelector('#progress2Div');

//****************************************************************************
// ipc buttons.

syncBtn.addEventListener('click', () => {
  let reply = ipc.sendSync('synMessage','A sync message to main');
  replyDiv.innerHTML = reply;
});

asyncBtn.addEventListener('click', () => {
  ipc.send('aSynMessage','A async message to main')
});

ipc.on('asynReply', (event, args) => {
  replyDiv.innerHTML = args;
});

//****************************************************************************
// timer.

ipc.on('timerUpdate', (event, args) => {
  timerDiv.innerHTML = args;
});
   
//****************************************************************************
// command1.

command1Btn.addEventListener('click', () => {
  command1Div.innerHTML = 'sending command1';
  ipc.send('command1')
});

ipc.on('command1Response', (event, args) => {
  command1Div.innerHTML = args;
});

//****************************************************************************
// command2.

command2Btn.addEventListener('click', () => {
  command2Div.innerHTML = 'sending command2';
  progress2Div.innerHTML = 'none';
  ipc.send('command2')
});

ipc.on('command2Response', (event, args) => {
  command2Div.innerHTML = args;
});

ipc.on('command2Progress', (event, args) => {
  progress2Div.innerHTML = args;
});
