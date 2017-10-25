var users = [{name:"건일", age:26},{name:"신애", age:26}];

var oper = function(a, b){
    return a +b;
}

users.push(oper);
console.log(users);
console.log('세번째 배열 요소를 함수로 실행 :' + users[2](10,10));