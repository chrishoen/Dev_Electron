const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const ipc = require('electron').ipcMain;
const dgram = require('dgram');

//****************************************************************************
// Create main window.

let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 800, height: 440, x:0, y:0})
  mainWindow.loadURL('file://'+__dirname+'/index.html')
  mainWindow.on('closed', function () {
    console.log(`closed`);
    mainWindow = null;
  })
}

app.on('ready', function () {
  console.log(`ready`);
  createWindow();
})

app.on('before-quit', function () {
  statusudp.close();
  console.log(`before-quit`);
})

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
// command1.

function myCommand1Completion(code,message) {
  console.log(`myCommand1Completion:    `,code,message);
  let temp = 'command1 completion:    ' + " " + code + " " + message;
  mainWindow.send('command1Completion',temp);
}

ipc.on('command1', (event, args) => {
  console.log(`calling backend command1`);
})

//****************************************************************************
// command2.

function myCommand2Completion(code,message) {
  console.log(`myCommand2Completion:    `,code,message);
  let temp = 'command2 completion:    ' + " " + code + " " + message;
  mainWindow.send('command2Completion',temp);
}

function myCommand2Progress(message) {
  console.log(`myCommand2Progress:      `,message);
  let temp = 'command2 progress:    ' + " " + message;
  mainWindow.send('command2Progress',temp);
}

ipc.on('command2', (event, args) => {
  console.log(`calling backend command2`);
})

//****************************************************************************
// Post window creation initialization.

app.on('browser-window-created', function () {
  console.log(`browser-window-created`);
  startBackEnd();
  return;
})

//****************************************************************************
// BackEnd dll tests.

function myTimerCallback(x) {
  //console.log(`myTimerCallback:         `,x);
  mainWindow.send('timerUpdate','backend timer: ' + x);
}

function startBackEnd() {
  console.log(`startBackEnd`);
}


//****************************************************************************
// Status udp datagram.

const statusudp = dgram.createSocket('udp4');

statusudp.on('error', (err) => {
  console.log(`statusudp error:\n${err.stack}`);
  statusudp.close();
});

statusudp.on('listening', () => {
  const address = statusudp.address();
  console.log(`statusudp listening ${address.address}:${address.port}`);
});

statusudp.bind({
  address: '127.0.0.1',
  port: 56002,
  exclusive: false
});

statusudp.on('message', (msg, rinfo) => {
  console.log(`statusudp: ${msg} from ${rinfo.address}:${rinfo.port}`);
  mainWindow.send('timerUpdate','statusudp: ' + msg);
});

