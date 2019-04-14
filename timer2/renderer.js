const ipc = require('electron').ipcRenderer;
const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');
const myaddonBtn = document.querySelector('#myaddonBtn');

let replyDiv = document.querySelector('#replyDiv');
let timerDiv = document.querySelector('#timerDiv');
let myaddonDiv = document.querySelector('#myaddonDiv');

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
   
myaddonBtn.addEventListener('click', () => {
  myaddonDiv.innerHTML = 'my addon click';
  ipc.send('myaddonMessage','my addon message to main')
});

