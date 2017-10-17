console.log('hell');

console.log('this is num : %d', 10);

var person = {
    
    name : '하이',
    age : 20
};

console.log("%j",person);
console.dir(person); //객체 속성확인

console.time('duration_time');
var result = 0;
for(var i = 0 ; i<10000 ; i++){
    result += i;
}

console.timeEnd('duration_time');


console.log("파일 이름 : %s", __filename);
console.log('패스 : %s', __dirname);