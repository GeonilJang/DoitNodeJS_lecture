var calc = require('./clac3');
var calc1 = new calc();
calc1.emit('stop');

console.log('calc에 strop 이벤트 전달함.')