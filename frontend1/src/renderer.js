const ipc = require('electron').ipcRenderer;
const command1Btn = document.querySelector('#command1Btn');
const command2Btn = document.querySelector('#command2Btn');

let timerDiv = document.querySelector('#timerDiv');
let command1Div = document.querySelector('#command1Div');
let command2Div = document.querySelector('#command2Div');
let progress2Div = document.querySelector('#progress2Div');

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

ipc.on('command1Completion', (event, args) => {
  command1Div.innerHTML = args;
});

//****************************************************************************
// command2.

command2Btn.addEventListener('click', () => {
  command2Div.innerHTML = 'sending command2';
  progress2Div.innerHTML = 'command2 progress:';
  ipc.send('command2')
});

ipc.on('command2Completion', (event, args) => {
  command2Div.innerHTML = args;
  progress2Div.innerHTML = "command2 progress:";
});

ipc.on('command2Progress', (event, args) => {
  progress2Div.innerHTML = args;
});
