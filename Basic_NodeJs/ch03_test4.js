var users = [{name:"건일", age:26}, {name:"신애", age:26}, {name:"쓰레기", age:100}];

for(var i = 0 ; i < users.length ; i++){
    console.log("배열 원소 : "+ i + " : " + users[i].name);
}

users.forEach(function(elem, index){
    console.log("배열 원소 : "+ index + " : "+ elem.age);
})