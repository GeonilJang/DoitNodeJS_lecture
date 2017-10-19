var express = require('express');
var http =require('http');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');

var app = express();

app.listen(3000,function(){
	console.log("connected 3000 port");
})



app.use('/public', static(path.join( __dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(function(req, res, next){
	console.log('첫번째 미들웨어 실행됨.');
	next();

})

var rt = express.Router();
		////////////////////////
rt.route('/process/login/:name').post(function(req, res){
	console.log('/process/login/:name 라우팅 함수에서 받음.');
	//////////////////////////
	var name = req.params.name;
	var id = req.body.id || req.query.id;
	var pw = req.body.password || req.query.password;

	var user = {
		ids:id,
		pws:pw
	}

	res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
	res.write("<h1>서버에서 로그인 응답</h1>");
	res.write("<div><p>"+id+"</p></div>");
	res.write("<div><p>"+pw+"</p></div>");
	res.write("<div><p>"+"Welcom, "+name+"</p></div>");
	res.end();
})


//////////////////////////////////////////////////////에러요청
app.all('*', function(req, res){
	res.status(404).send('<h1>요청하신 페이지는 없어요</h1>');
})
app.use('/',rt)


