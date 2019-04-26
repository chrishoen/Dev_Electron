const { ipcRenderer } = require('electron');

document.addEventListener('DOMContentLoaded', () => {
    setupClickHandler('test1Btn');
});

function setupClickHandler(btnName) {
    var btn = document.getElementById(btnName);
    btn.onclick = () => {
        ipcRenderer.send('EchoRequest', btn.innerText);
    }
}