var name = "geonil";
console.log('name : ' + name);

var age = 20;
console.log('age : '+ age);


var person = {};

person['name'] = "Geonil";
person['age'] = 20;
person.add = function(a, b){
    return a+b;
}
console.log('이름 : ' + person.name + ', 나이 : '+person.age+", 더하기 : "+ person.add(10,40));


function add(a, b){
    return a +b;
}
var result = add(10,10);
console.log('더하기 결과' + result);

var add2 = function(a, b){
    return a+b;
}
var result1 = add2(10,10);
console.log('더하기 결과' + result1);
