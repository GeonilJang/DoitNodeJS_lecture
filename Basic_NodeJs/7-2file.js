var fs = require('fs');
fs.writeFile('./output.txt', 'Hello world', function(err){
    if(err){
        console.log('에러발생');
        console.dir(err);
        return
    }else{
        console.log('output.txt 파일에 데이터 쓰기 완료함');
    }
})