const ipc = require('electron').ipcRenderer;
const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');


let myTabs = document.querySelector('#myTabs');
let timerDiv = document.querySelector('#timerDiv');

if (myTabs == undefined){
   myconsole.log('myTabs undefined');
} else {
  myconsole.log('myTabs defined');
}

ipc.on('timerUpdate', (event, args) => {
  myconsole.log(`render timer ${args}`);
  timerDiv.innerHTML = args;
});
   
myTabs.addEventListener('shown.bs.tab', (event) => {
  myconsole.log(`shown.bs.tab`);
//myconsole.log(`shown.bs.tab ${event.text()}`);
});
