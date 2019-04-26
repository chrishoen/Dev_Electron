const path = require('path')
const url = require('url')
const ipc = require('electron').ipcRenderer;
const TabGroup = require("electron-tabs");
const dragula = require('dragula');

const nodeConsole = require('console');
const myconsole = new nodeConsole.Console(process.stdout, process.stderr);


myconsole.log('renderer start');

//****************************************************************************
// Create tab group.

var mTabGroup = new TabGroup({
    ready: tabGroup => {
        myconsole.log('mTab ready');
    }
});

//****************************************************************************
// Add tab.

var mTab1 = mTabGroup.addTab({
    title: 'Page1',
    src: './page1.html',
    webviewAttributes: {
        'nodeintegration': true
    },    
    closable: false,
    visible: true,
    activate: true,
    ready: tab => {
      myconsole.log('mTab1 ready');
    }
});

//****************************************************************************
// Add tab.

var mTab2 = mTabGroup.addTab({
    title: 'Page2',
    src: './page2.html',
    webviewAttributes: {
        'nodeintegration': true
    },    
    closable: false,
    visible: true,
    activate: false,
    ready: tab => {
      myconsole.log('mTab2 ready');
    }
});

const EventEmitter = require('events');
const myEE = new EventEmitter();
  

ipc.on('EchoResponse', (event, msg) => {
    myconsole.log('Rx EchoResponse');
    mTab1.emit('EchoRelay');
});
    


let test1Div = mTab1.webview.querySelector('#test1Div');

if (test1Div == undefined){
  myconsole.log('test1Div undefined');
} else {
  myconsole.log('test1Div defined');
}
