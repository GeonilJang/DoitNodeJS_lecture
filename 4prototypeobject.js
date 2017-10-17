var person1 = {name:"소녀시대" , age:20};
var person2 = {name:"걸스데이" , age:20};

function Person(name, age){
    this.name = name;
    this.age = age;
}

Person.prototype.walk = function(speed){
    console.log(speed + " km 속도");
};

var person3 = new Person('건일', 20);
var person4 = new Person('신애', 20);
person3.walk(10);


console.log(person1);
console.log(person2);
console.log(person3);
console.log(person4);

