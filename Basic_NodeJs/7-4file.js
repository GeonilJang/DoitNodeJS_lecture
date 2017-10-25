var output = "안녕!@"
var buffer1 = new Buffer(10);
var len = buffer1.write(output, 'utf8');
console.log('버퍼에 쓰인 문자열의 길이 : ' + len);
console.log('첫 번째 버퍼에 쓰인 문자열 : ' + buffer1.toString());

