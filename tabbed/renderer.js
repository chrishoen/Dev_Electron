const ipc = require('electron').ipcRenderer;
const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');


let replyDiv = document.querySelector('#replyDiv');
let timerDiv = document.querySelector('#timerDiv');

if (timerDiv == undefined){
   myconsole.log('timerDiv undefined');
} else {
  myconsole.log('timerDiv defined');
}

ipc.on('timerUpdate', (event, args) => {
  myconsole.log(`render timer ${args}`);
  timerDiv.innerHTML = args;
});
   