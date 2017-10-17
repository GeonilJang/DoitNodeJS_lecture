var express = require('express');
var app = express();
app.listen(3000, function(){
	console.log('connected 3000 port');
});


app.use(function(req, res, next){
    console.log('첫 번째 미들웨어 호출됨');
    
    res.redirect('https://google.co.kr');
    
    next(); 
})

app.use(function(req, res, next){
    console.log('두 번째 미들웨어 호출됨');
    
    var person1 = {name:'geonil', age:26};
    //res.send(person1);
    res.send("<h1>서버에서 응답한 결과입니다."+req.user+" "+person1+"</h1>");
})