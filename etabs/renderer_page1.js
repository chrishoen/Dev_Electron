const ipc = require('electron').ipcRenderer;

const EventEmitter = require('events');
const mEventEmitter = new EventEmitter();

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);

document.addEventListener('DOMContentLoaded', () => {
    myconsole.log('Page1 loaded');
    setupClickHandler('test1Btn');
    mEventEmitter.on('EchoRelay', () => {
        myconsole.log('Rx EchoRelay');
    });
});

function setupClickHandler(btnName) {
    var btn = document.getElementById(btnName);
    btn.onclick = () => {
        myconsole.log('Tx EchoRequest');
        ipc.send('EchoRequest', btn.innerText);
    }
}

  


myconsole.log(`listener count 22 ${mEventEmitter.listenerCount('EchoRelay')}`);


mEventEmitter.emit('EchoRelay');

