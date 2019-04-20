const ipc = require('electron').ipcRenderer;
const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');
const command1Btn = document.querySelector('#command1Btn');

let replyDiv = document.querySelector('#replyDiv');
let timerDiv = document.querySelector('#timerDiv');
let command1Div = document.querySelector('#command1Div');

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

ipc.on('timerUpdate', (event, args) => {
  timerDiv.innerHTML = args;
});
   
command1Btn.addEventListener('click', () => {
  command1Div.innerHTML = 'sending command1';
  ipc.send('command1')
});

ipc.on('command1Response', (event, args) => {
  command1Div.innerHTML = args;
});
   
