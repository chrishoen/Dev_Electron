
"use strict"

console.log(`start**************************`);

var tMessage1 = JSON.stringify({
    'msgId' : 'msgType1',
    'var1' : 'value1',
});

console.log(`tMessage1       ${tMessage1}`);
console.log(` `);

var tObj1 = JSON.parse(tMessage1);

console.log(`tObj1.msgId     ${tObj1.msgId}`);
console.log(`tObj1.var1      ${tObj1.var1}`);
console.log(`tObj1.var2      ${tObj1.var2}`);
console.log(` `);


var tMessage2 = JSON.stringify({
    'msgId' : 'msgType2',
    'var1' : 'value1',
    'var2' : 'value2',
});

console.log(`tMessage2       ${tMessage2}`);
console.log(` `);

var tObj2 = JSON.parse(tMessage2);

console.log(`tObj2.msgId     ${tObj2.msgId}`);
console.log(`tObj2.var1      ${tObj2.var1}`);
console.log(`tObj2.var2      ${tObj2.var2}`);
console.log(` `);




