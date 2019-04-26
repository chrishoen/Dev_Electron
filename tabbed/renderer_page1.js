const ipc = require('electron').ipcRenderer;


document.addEventListener('DOMContentLoaded', () => {
    setupClickHandler('test1Btn');
});

function setupClickHandler(btnName) {
    var btn = document.getElementById(btnName);
    btn.onclick = () => {
        ipc.send('EchoRequest', btn.innerText);
    }
}