
"use strict"

const electron = require('electron');

console.log(`start**************************`);

let tString = 'Command,Command1,arg0';
let tBuffer = Buffer.from(tString);

let tTest = tBuffer.toString().startsWith('Command');

console.log(`tString     ${tString}`);
console.log(`tBuffer     ${tBuffer}`);
console.log(`mTest       ${tTest}`);
