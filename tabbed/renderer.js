const path = require('path')
const url = require('url')
const ipc = require('electron').ipcRenderer;
const TabGroup = require("electron-tabs");


let tabGroup = new TabGroup();
let tab = tabGroup.addTab({
    title: "Electron",
    src: "http://electron.atom.io",
    visible: true
});
