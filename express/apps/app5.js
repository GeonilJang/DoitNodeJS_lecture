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
    res.send('<h3>서버에서 응답 : '+paramId+'</h3><br>'+'<h4>'+userAgent+'</h4>');
    next(); 
})


//app.post('/hello', function(req, res, next){
    console.log('두 번째 미들웨어 호출됨');
    
    var person1 = {name:'geonil', age:26};
    res.send(person1);
    res.send("<h1>서버에서 응답한 결과입니다."+req.user+" "+person1+"</h1>");
    next();
});

app.get('/test', function(req, res){
    
    var output = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
    <html>
    <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>처음으로 시작하는 jsp</title>
    </head>
    <body>
        this is web.js
        <form action="app5.js" method="post">
            이름 : <input type="text" name="name"><br>
            별명 : <input type="text" name="nick"><br>
            <input type="submit" value="보내기">
        </form>
    </body>
    </html>
    `
    res.send(output);
});


app.get('/dynamic', function(req, res){
	var lis='';
	var time = Date();
	for(var i =0 ; i<5 ; i++){
		lis = lis +  '<li>coding</li>';
	}
	var output = `
	<!DOCTYPE html>
	<html>
	<head>
		<title></title>
	</head>
	<body>
		this is hello world 123123123123!<br>
		<img src="/Lighthouse.jpg"> 
		<ul>
		
		</ul>
		
	</body>
	</html>
	`
	res.send(output);
})