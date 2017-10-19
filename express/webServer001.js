var express = require('express');
var http =require('http');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');

var app = express();

app.use('/public', static(path.join(__dirname, 'public')));

app.set('port', process.env.PORT || 3000)
var server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Connected 3000 post. Welcome, Web Wolrd');
})

// app.listen(3000, function(){
// 	console.log('Connected 3000 post. Welcome, Web Wolrd');
// })

app.use(function(rea, res, next){
	console.log('첫번째 미들웨어');

	var userAgent = req.header('User-Agent');
	var paramId = req.body.id || req.query.id;

	res.send('<h3>서버에서 응답. User-Agent -> <br>'+userAgent+
		'</h3><br><br><h3> paramId -> '+paramId+'</h3>');
})