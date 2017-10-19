var express = require('express');
var http = require('http');

var app = express();
app. set('port', process.env.PORT || 3000);

/*
http.createServer(app).listen(app.get('port')), function(){
    console.log('익스프레스로 웹 서버를 실행합니다. : ' + app.get('port'));
};
*/

app.listen(3000, function(){
	console.log('connected 3000 port');
});
/*
app.get('/log', function(req, res){

    var topic = ['javascript is..11.', 'NodeJs is ..11.', 'Express is ...'];
	var name =['first', 'second', 'third'];
	var na;
	var str = `
			<a href="/topic/0">JavaScript</a><br>
			<a href="/topic/1">Nodejs</a><br>
			<a href="/topic/2">Express</a><br><br>
			${topic[req.params.id]}
			
	`
	res.send(str);
})*/


app.use(function(req, res, next){
    console.log('This is first middleware');
    req.user = 'mike';
    
    next(); 
})

app.use(function(req, res, next){
     console.log('두 번째 미들웨어 호출됨');
    
     res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
    
     res.end('<h1>서버에서 응답한 결과입니다. '+req.user+'</h1>')
})