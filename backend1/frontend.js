console.log('************************Begin')

var ffi = require('ffi');
var backendPath = "C:\\MyTools\\MyLib\\node\\BackEndDLL.dll";
var backend = ffi.Library(backendPath, {
    'setCount': [ 'void', ['int'] ],
    'getCount': [ 'int', [] ]
});

backend.setCount(201);
console.log('getCount ' + backend.getCount());


console.log('************************End')
