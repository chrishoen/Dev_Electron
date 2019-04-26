const ipc = require('electron').ipcRenderer;
const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


const syncBtn  = document.querySelector('#syncBtn');
const asyncBtn = document.querySelector('#asyncBtn');


var myTabs = document.getElementById('myTabs');
var timerDiv = document.getElementById('timerDiv');
var testDiv = document.getElementById('testDiv');

ipc.on('timerUpdate', (event, args) => {
  //myconsole.log(`render timer ${args}`);
  timerDiv.innerHTML = args;
  testDiv.innerHTML = args;
});
   
myTabs.addEventListener('click', () => {
  myconsole.log(`click`);
});

myTabs.addEventListener('shown.bs.tab', function(event){
  myconsole.log(`shown.bs.tab`);
});

