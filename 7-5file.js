var fs = require('fs');

var infile = fs.createReadStream('./output.txt', {flags:'r'});

infile.on('data', function(data){
    console.log('읽어들인 데이터 : ' + data);
})

infile.on('end', function(){
    console.log('읽기 종료.');
})


var buffer2 = Buffer.from('hello world', 'utf8');
console.log('두번째 버퍼의 길이 : '+Buffer.byteLength(buffer2));
console.log('str')