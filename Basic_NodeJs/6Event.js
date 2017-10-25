process.on('exit', function(){
    console.log("exit 이벤트 발생함");
});

setTimeout(function(){
    console.log('2초 후에 실행 되었음');
    
    process.exit();
},2000)

console.log('2초 후에 실행 될 것임')