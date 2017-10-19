var express = require('express');
var app = express();
app.listen(3000, function(){
	console.log('connected 3000 port');
});


app.use('/log',function(req, res, next){
    console.log('첫 번째 미들웨어 호출됨');
    
    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;
    res.send('<h3>서버에서 응답 : '+userAgent+'</h3><h3>param name :'+paramName+'</h3>');
    next(); 
})

app.use(function(req, res, next){
    console.log('두 번째 미들웨어 호출됨');
    
    var person1 = {name:'geonil', age:26};
    //res.send(person1);
    res.send("<h1>서버에서 응답한 결과입니다."+req.user+" "+person1+"</h1>");
})