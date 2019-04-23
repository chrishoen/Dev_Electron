const ipc = require('electron').ipcRenderer;
const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');

let replyDiv = document.querySelector('#replyDiv');
let timerDiv = document.querySelector('#timerDiv');

syncBtn.addEventListener('click', () => {
  let reply = ipc.sendSync('synMessage','A sync message to main');
  replyDiv.innerHTML = reply;
});

asyncBtn.addEventListener('click', () => {
  console.log('LINE101');
  ipc.send('aSynMessage','A async message to main')
});

ipc.on('asynReply', (event, args) => {
  replyDiv.innerHTML = args;
});

ipc.on('timerUpdate', (event, args) => {
  timerDiv.innerHTML = args;
});
   