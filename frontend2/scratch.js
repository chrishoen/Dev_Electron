
"use strict"

const electron = require('electron');

console.log(`start**************************`);

let tString = 'Command,Command1,arg0';
let tBuffer = Buffer.from(tString);

let tTest = tBuffer.toString('utf8').startsWith('Command3');

console.log(`mBuffer     ${tString}`);
console.log(`mTest       ${tTest}`);
