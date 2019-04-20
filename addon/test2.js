console.log('test2****************')


function mycallback1(x) {
  console.log(`mycallback1:         `,x);
}

function mycallback2(ref x) {
  x = 'message2';
}

mycallback1("message1");

var x;
mycallback2(x);
