var express = require('express');
var http =require('http');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');
var errorHandler = require('errorhandler');
var expressErrorHandler = require('express-error-handler');
//////////////////////////////////
var mongoose = require('mongoose');

var database;
var UserSchema;
var UserModel;

var app = express();
app.listen(3000,function(){
	console.log("connected 3000 port");
  connectDB();
})

function connectDB(){
  var databaseUrl = 'mongodb://localhost:27017/local';

  mongoose.Promise = global.Promise;
  mongoose.connect(databaseUrl);
  database = mongoose.connection;

  database.on('open', function(){
    console.log('데이터 베이스에 연결됨 : '+ databaseUrl);
      UserSchema  = mongoose.Schema({
        id: String,
        name: String,
        password: String
        });
    console.log('UserSchema 정의함.');

    UserModel = mongoose.model('users', UserSchema);//collection을 말함 즉 테이블
    console.log('UserModel 정의함.');
  });

  database.on('disconnected', function(){
    console.log('데이터베이스 연결 끊어짐.');
  });

  database.on('error', console.error.bind(console, 'mongoose 연결에러' ));
  }

app.use('/public', static(path.join( __dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));

var rt = express.Router();

///////////////////////////////////////////////////////////////////////////////

rt.route('/process/login').post(function(req, res){
  console.log('/process/login 라우팅 시작');

  var id = req.body.id || req.query.id;
  var pw = req.body.password || req.query.password;
  console.log('요청파라미터 : '+id+", "+pw);

  if(database){
    authUser(database, id, pw, function(err, docs){
      if(err){
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>에러발생</h1>');
        res.end();
        return;
      }

      if(docs){
        console.dir(docs);
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 : ' +docs[0].name+'</p></div>');
        res.write('<br><br><a href="/public/logign.html">되돌아가기</a>');
        res.end();

      }else{
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>사용자 데이터 조회안됨</h1>');
        res.end();

      }
    })
  }else{
    console.log('에러발생');
    res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
    res.write('<h1>연결안됨</h1>');
    res.end();
  }
})

rt.route('/process/adduser').post(function(req, res){
  console.log('/process/adduser 라우팅 시작');

  var id = req.body.id || req.query.id;
  var pw1 = req.body.password || req.query.password;
  var name = req.body.name || req.query.name;

  console.log('데이터 넘어옴 -> id : '+id+', pw : '+pw1+'name : '+name);

  if(database){
    addUser(database, id, pw1, name, function(err, result){
      if(err){
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>에러발생</h1>');
        res.end();
        return;
      }
      if(result){
        console.dir(result);
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>사용자 추가성공</h1>');
        res.write('<div><p>사용자 : ' +name+'</p></div>');
        res.end();

      }else{
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>사용자 추가안됨</h1>');
        res.end();
      }
    })
  }else{
    res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
    res.write('<h1>연결안됨</h1>');
    res.end();
  }

})

app.use('/',rt);

///////////////////////////////////////////////////////////////////////////////


var addUser = function(db, id, password, name, callback){
  console.log('addUser 호출됨 : '+id+", "+password+', '+ name);

  var user = new UserModel({"id":id,"password":password,"name":name});
  user.save(function
		(err){
    if(err){
      callback(err,null);
      return;
    }
    console.log('사용자 추가');
    callback(null, users)
  })
  var users = db.collection('users');
};

var authUser = function(db, id, password, callback){
  console.log('authUser 호출됨 : '+id+", "+password);
  //////////////////////////////////////////////////////////////////
  UserModel.find({"id":id,"password":password}, function(err,docs){
    if(err){
      callback(err, null);
      return;
    }
    if(docs.length > 0){
      console.log('일치하는 사용자를 찾음.');
      callback(null, docs);
    }else{
      console.log('일치하는 사용자를 찾지못함.');
      callback(null,null);
    }
  });
}//authUser End


var errorHandler = expressErrorHandler({
  static:{
    '404':'./public/404.html'
  }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);
