var users = [{name:"건일", age:26}, {name:"신애", age:26}, {name:"쓰레기", age:100}];
console.dir(users);

users.push({name:"티아라", age:21});
console.dir(users);

users.unshift({name:"티아라", age:21});
console.dir(users);

var elem = users.pop();
console.dir(users);
console.dir(elem);
console.dir(users);

users.splice(1,0,{name:"애프터스쿨", age:24});
console.log(users);

var users2 = users.splice(1,2);
console.dir(users2);