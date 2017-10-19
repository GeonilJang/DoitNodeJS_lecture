var express = require('express');
var static = require('serve-static');
var path = require('path');
var bodyParser = require('body-parser');

var app = express();

app.listen(3000, function(){
	console.log('connected 3000 port');
});

app.use(bodyParser.urlencoded({extends:false}));
app.use(bodyParser.json());
app.use('/public',static(path.join( __dirname, 'public' ))); // /public/images/pic.jps
app.use(static(path.join( __dirname, 'public' ))); // /images/pic.jps


app.use(function(req, res, next){
    console.log('첫 번째 미들웨어 호출됨');
    
    var userAgent = req.header('User-Agent');
    var paramId = req.query.id || req.body.id;
    res.send('<h3>서버에서 응답 : '+paramId+'</h3>');
    next(); 
})

app.use(function(req, res, next){
    console.log('두 번째 미들웨어 호출됨');
    
    var person1 = {name:'geonil', age:26};
    //res.send(person1);
   // res.send("<h1>서버에서 응답한 결과입니다."+req.user+" "+person1+"</h1>");
})