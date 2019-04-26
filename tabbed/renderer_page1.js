const ipc = require('electron').ipcRenderer;

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);



document.addEventListener('DOMContentLoaded', () => {
    setupClickHandler('test1Btn');
});

function setupClickHandler(btnName) {
    var btn = document.getElementById(btnName);
    btn.onclick = () => {
        myconsole.log('Tx EchoRequest');
        ipc.send('EchoRequest', btn.innerText);
    }
}


let test1Div = document.querySelector('#test1Div');

if (test1Div == undefined){
  myconsole.log('test1DivX undefined');
} else {
  myconsole.log('test1DivX defined');
}

  
ipc.on('EchoRelay', (event, msg) => {
  myconsole.log('Rx EchoRelay');
});

document.addEventListener('EchoRelay', () => {
    myconsole.log('Rx EchoRelay');
});



const EventEmitter = require('events');
const myEE = new EventEmitter();
myEE.on('EchoRelay', () => {
    myconsole.log('Rx EchoRelay');
});
