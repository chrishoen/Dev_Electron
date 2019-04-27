
"use strict"

const electron = require('electron');

console.log(`start**************************`);

let tString1 = 'Command,Command1,arg0ccccccccccccccccccccccccccccccccccx';
let tBuffer = Buffer.from(tString1);

let tString2 = tBuffer.toString('utf8',0,20);

let tTest = tBuffer.toString('utf8',0,20).startsWith('Command,');

console.log(`tString1    ${tString1}`);
console.log(`tBuffer     ${tBuffer}`);
console.log(`tString2    ${tString2}`);
console.log(`mTest       ${tTest}`);
console.log(` `);

