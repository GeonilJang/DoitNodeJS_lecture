function add(a , b, callback){
    var result =  a + b;
    callback(result);    
    var count = 0 ;
    var history = function(){
        count +=1;
        return a + " + " + b + ' = ' + result +" count : "+count;
    }
    
    return history;
}

var add_history = add(20, 20, function(result){
    console.log("더하기 결과 : "+ result); // 변수값-> 콜백함수로 
});

console.log('add_history의 자료형 : ' + typeof(add_history));

console.log('결과값으로 받은 함수 실행 : ' + add_history());
console.log('결과값으로 받은 함수 실행 : ' + add_history());
console.log('결과값으로 받은 함수 실행 : ' + add_history());
console.log('결과값으로 받은 함수 실행 : ' + add_history());


