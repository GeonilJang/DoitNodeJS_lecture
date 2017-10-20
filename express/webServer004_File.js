var express = require('express');
var http =require('http');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
///////////////////////////////
var multer = require('multer');
///////////////////////////////
var fs = require('fs');
///////////////////////////////
var cors = require('cors');

var app = express();

app.listen(3000,function(){
	console.log("connected 3000 port");
})
app.use('/public', static(path.join( __dirname, 'public')));
app.use('/upload', static(path.join( __dirname, 'upload')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}))
////////////////////////////////////////////////////////////////
app.use(cors());
var storage = multer.diskStorage({
  destination: function(req, file, callback){
  callback(null, 'uploads'); //어떤 폴더로 없도드 되게 할건지
  },
  filename:function(req, file, callback){
    //callback(null, file.original + Data.now());
    var extension = path.extname(file.originalname); //파일이 업로드 될 때 이름을 어떻게 바꿀건지
    var basename = path.basename(file.originalname, extension);
    callback(null, basename + Date.now() + extension);
  }
});

var uploads = multer({
  storage : storage,
  limits:{
    files:10,
    fileSize:1024*1024*1024
  }
})


app.use(function(req, res, next){
	console.log('첫번째 미들웨어 실행됨.');
	next();
})
var rt = express.Router();
////////////////////////////////////////////////포토로 넘어 오는거 배열에 담기
rt.route('/process/photo').post(uploads.array('photo', 1), function(req, res){
  console.log('/process/photo 라우팅 시작');

  var files = req.files;
  console.log('==== 업로드된 파일 ====');
  if(files.length > 0){
      console.log(files[0]);
  }else{
    console.log('THER IS NO FILE');
  }

  var originalname;
  var filename;
  var mimetype;
  var size;
  if(Array.isArray(files)){
    for (var i = 0; i < files.length; i++) {
        originalname = files[i].originalname;
        filename = files[i].filename;
        mimetype = files[i].mimetype;
        size = files[i].size;
    }
  }
  res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
	res.write("<h1>파일업로드성공</h1>");
	res.write("<div><p>원본파일 : "+originalname+"</p></div>");
	res.write("<div><p>저장파일 : "+filename+"</p></div>");
	res.end();

})

/*rt.route('/process/login/:name').post(function(req, res){
	console.log('/process/login/:name 라우팅 함수에서 받음.');
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
})*/

rt.route('/process/setUserCookie').get(function(req, res){
	console.log("/process/setUserCookie 라우팅 시작")
	res.cookie('user',{
		name:"Geonil",
		id:"jgi",
		authorized:true
	});
	res.redirect('/process/showCookie');
});

rt.route('/process/showCookie').get(function(req, res){
	console.log('/process/showCookie 라우팅 시작');
	res.send(req.cookies);
});

rt.route('/process/product').get(function(req, res){
	console.log('/process/product 라우팅 시작');

	if(req.session.user){
		res.redirect('/public/product.html');
	}else{
		res.redirect('/public/login2.html');
	}
});

rt.route('/process/login').post(function(req, res){
	console.log('process/login 라우팅 시작');

	var id = req.body.id || req.query.id;
	var pw = req.body.password || req.query.password;
	console.log('Request pramater: '+id+", "+pw);
	if(req.session.user){
		console.log('This id already has been logined.');

		res.redirect('/public/product.html');
	}else{
		req.session.user = {
			id:id,
			name:'Geonil',
			authorized:true
		};
		res.writeHead(200, {"Content-Type":"text/html; charset=utf8"});
		res.write("<h1>Login Success</h1>");
		res.write("<div><p>"+id+"</p></div>");
		res.write("<div><p><a href='/public/product.html'>Change a page to product</a></p></div>");
		res.end();
		}
});

rt.route('/process/logout').get(function(req, res){
	console.log('/process/logout 라우팅 시작');

	if(req.session.user){
		console.log('Logout');

		req.session.destroy(function(err){
			if(err){
				console.log('error when you try destroy session');
				return;
			}
			console.log('session destroy');
			res.redirect('/public/login2.html');
		})
	}else{
		console.log('no login');
		res.redirect('/public/login2.html');
	}
})







app.use('/',rt);
app.all('*', function(req, res){
	res.status(404).send('<h1>요청하신 페이지는 없어요</h1>');
});
