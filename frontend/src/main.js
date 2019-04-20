const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

//****************************************************************************
// Load BackEnd dll.

var backend = require('bindings')('backend.node')
backend.setCount(800);
console.log('getCount:            ', backend.getCount());

//****************************************************************************
// Create main window.

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    backend.finalize();
    if (intervalId != 0) clearInterval(intervalId);
    console.log(`closed`);
    mainWindow = null;
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

//****************************************************************************
// ipc communication from renderer.

const ipc = require('electron').ipcMain;

ipc.on('synMessage', (event, args) => {
  console.log(args);
  event.returnValue = 'Main: sync message received';
})

ipc.on('aSynMessage', (event, args) => {
  console.log(args);
  event.sender.send('asynReply','Main: async message received')
})

function myCommand1Callback(code,message) {
  console.log(`myCommand1Callback:  `,code,message);
  let temp = 'command1 response:' + " " + code + " " + message;
  mainWindow.send('command1Response',temp);
}

ipc.on('command1', (event, args) => {
  console.log(`calling backend command1`);
  backend.command1("myarg0",myCommand1Callback);
})

//****************************************************************************
// Timer function.

var count = 0;
function timerFunc() {
  console.log(`timer %d`,count);
  mainWindow.send('timerUpdate','Main: timer update ' + count);
  count++;
}
  
//****************************************************************************
// Post window creation initialization.

var intervalId = 0;
app.on('browser-window-created', function () {
  console.log(`browser-window-created`);
  initializeBackEnd();
  return;
  intervalId = setInterval(timerFunc, 1000);
})


//****************************************************************************
// BackEnd dll tests.

function myTimerCallback(x) {
  console.log(`myTimerCallback:         `,x);
  mainWindow.send('timerUpdate','BackEnd: ' + x);
}

function initializeBackEnd() {
  console.log(`initializeBackEnd`);
  backend.setTimerCallback(myTimerCallback);
}

