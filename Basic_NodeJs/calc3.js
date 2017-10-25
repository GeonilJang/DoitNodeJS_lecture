var EventEmitter = require('events').EventEmitter;

var calc = function(){
    this.on('stop',function(){
        console.log('calc stop event');
    })
}

util.inherits(calc, EventEmitter);

calc.prototype.add = function(a ,b){
    return a+b;
}

module.exports = calc;