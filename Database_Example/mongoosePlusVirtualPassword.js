var express = require('express'); //익스프레스 모듈
var http =require('http'); //
var bodyParser = require('body-parser'); // post 방식으로 넘어 오는 파라미터를 받기위해서 사용
var static = require('serve-static'); // pulic 폴더를 지정하기 위해서 사용함
var path = require('path'); // public 폴더의 패스를 정해주기 위해서 사용함
var cookieParser = require('cookie-parser'); // 쿠키를 사용하기 위해서
var expressSession = require('express-session'); //세션을 사용하기 위해서
var multer = require('multer');
var fs = require('fs'); // 파일을 사용하기 위해서
var cors = require('cors');
var errorHandler = require('errorhandler'); //에러를 핸들러 하기 위해서
var expressErrorHandler = require('express-error-handler'); //에러를 핸들러 하기 위해서
//////////////////////////////////
var mongoose = require('mongoose'); // 몽고디비를 관계형 디비 처럼 관리 하기 위해서
var crypto = require('crypto') ; // 비밀번호 암호화

var database;
var UserSchema;
var UserModel;

//=======서버 실행======
var app = express();
app.listen(3000,function(){
	console.log("connected 3000 port");
  connectDB();
})
//=======서버 실행 end======

//============================데이터 베이스 연결============================
function connectDB(){
  var databaseUrl = 'mongodb://localhost:27017/local';//데이터 베이스의 URL
  mongoose.Promise = global.Promise; //몽구스기본 사용법01
  mongoose.connect(databaseUrl);//몽구스기본 사용법02(url 연결)
  database = mongoose.connection;//몽구스기본 사용법03(db 연결)

//====================.on연결될때 함수 실행 및 테이블 설정====================
  database.on('open', function(){
    console.log('데이터 베이스에 연결됨 : '+ databaseUrl);
    //=========테이블 형식 설정 =========
      UserSchema  = mongoose.Schema({
        id:{type:String, required:true, unique:true},
        ////////////////////////////////////////////////////////////////////////
        hashed_password:{type:String, required:'true', 'default':''},
        salt:{type:String, required:true},
        name:{type:String, index:'hashed', index:'hashed','default':''},
        age:{type:Number, 'default':-1},
        created_at:{type:Date, index:{unique:false},'default':Date.now()},
        updated_at:{type:Date, index:{unique:false},'default':Date.now()}
        });
    console.log('UserSchema 정의함.');
  //=========테이블 형식 설정 end =========

  ///////////////////////////////
  UserSchema.virtual('password').set(function(password){
      this.salt = this.makeSalt();
      this.hashed_password = this.encryptPassword(password);
      console.log('virtual password 저장됨 ' + this.hashed_password);
    });

  ////////////////////////
  UserSchema.method('encryptPassword', function(plainText,inSalt){
      if(inSalt){
        return crypto.createHmac('sha1',inSalt).update(plainText).digest('hex');
      }else{
        return crypto.createHmac('sha1',this.salt).update(plainText).digest('hex');
      }
  });

  UserSchema.method('makeSalt', function(){
    return Math.round((new Date().valueOf() * Math.random()))+' ';
  })

  UserSchema.method('authenicate', function(plainText, inSalt, hashed_password){
    if(inSalt){
      console.log('authenicate 호출됨.');
      return this.encryptPassword(plainText, inSalt) === hashed_password;
    }else{
      console.log('authenicate 호출됨.');
      return this.encryptPassword(plainText) === hashed_password;
    }
  })
  ///////////////////////////


//====================테이블의 값을 불러 올 때 참 조할 값 설정====================
    //아이디 값을 통해서 가져옴.
    UserSchema.static('findById', function(id, callback){
        return this.find({id:id},callback);
    });
    /*위 방법이랑 동일 하지만 다른 서정법
    UserSchema.static.findById = function(id , callback){
      return this.find({id:id}, callback);
    }*/
    //모든 값을 가져옴
    UserSchema.static('findAll', function(callback){
        return this.find({},callback);
    })
//================테이블의 값을 불러 올 때 참 조할 값 설정 end====================

//==================================테이블 생성==================================
    UserModel = mongoose.model('users001', UserSchema);//collection을 말함 즉 테이블
    console.log('UserModel 정의함.');
  });
//==============================테이블 생성 end==================================
//====================.on연결될때 함수 실행 및 테이블 설정 end====================

  //==========연결이 끊어 지면 실행 ==========
  database.on('disconnected', function(){
    console.log('데이터베이스 연결 끊어짐.');
  });
  //==========연결이 끊어 지면 실행 end==========

  //==========연결이 에러 나면 실행 ==========
  database.on('error', console.error.bind(console, 'mongoose 연결에러' ));
  }
  //==========연결이 에러 나면 실행 ==========
//============================데이터 베이스 연결 end============================


app.use('/public', static(path.join( __dirname, 'public')));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressSession({
	secret:'my key',
	resave:true,
	saveUninitialized:true
}));


//=============================라우팅===========================================
var rt = express.Router();

//==========================='/process/login'==================================
rt.route('/process/login').post(function(req, res){
  console.log('/process/login 라우팅 시작');
  var id = req.body.id || req.query.id;
  var pw = req.body.password || req.query.password;
  console.log('요청파라미터 : '+id+", "+pw);
  //db에 연결이 되어 있으면,
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
        res.write('<br><br><a href="/public/addUser.html">사용자 추가</a>');
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
//========================='/process/login' end=================================

//==========================='/process/adduser'=================================
rt.route('/process/adduser').post(function(req, res){
  console.log('/process/adduser 라우팅 시작');

  var id = req.body.id || req.query.id;
  var pw1 = req.body.password || req.query.password;
  var name = req.body.name || req.query.name;

  console.log('데이터 넘어옴 -> id : '+id+', pw : '+pw1+', name : '+name);

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
        res.write('<br><br><a href="/public/login.html">로그인</a>');
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
//========================='/process/adduser' end===============================

//==========================='/process/listuser'================================
rt.route('/process/listuser').post(function(req, res){
  console.log('/process/listuser 라우팅 시작');

  if(database){
    UserModel.findAll(function(err, results){
      if(err){
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>에러발생</h1>');
        res.end();
        return;
      }
     if(results){
       console.dir(results);
       res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
       res.write('<h1>사용자리스트</h1>');
       res.write("<div><ul>");
       for (var i = 0; i < results.length; i++) {
         var cid = results[i]._doc.id;
         var cname = results[i]._doc.name;
         res.write("<li>#"+ i +"->"+ cid+", "+cname+"</li>");
       }
      res.write("</ul></div>");
      res.end();
    }else{
      console.log('에러발생');
      res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
      res.write('<h1>사용자 추가안됨</h1>');
      res.end();
    }
  });
}else{
  console.log('에러발생');
  res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
  res.write('<h1>연결안됨</h1>');
  res.end();
}
})
//========================='/process/listuser' end==============================
app.use('/',rt);
//=============================라우팅 end========================================

//================================사용자 지정함수================================

//adduser start
var addUser = function(db, id, password, name, callback){
  console.log('addUser 호출됨 : '+id+', '+password+', '+ name);
  var user = new UserModel({"id":id, "password":password, "name":name});
  user.save(function(err){
    if(err){
      callback(err,null);
      return;
    }
    console.log('사용자 추가');
    callback(null, user)
  })
  var users001 = db.collection('users001');
};
//adduser end

//authUser start
var authUser = function(db, id, password, callback){
  console.log('authUser 호출됨 : '+id+", "+password);
  //////////////////////////////////////////////////////////////////
  UserModel.findById(id, function(err, results){
    if(err){
      callback(err, null);
      return;
    }
    console.log(('아이디 %s로 검색됨.'));
    if(results.length > 0){
      /////////////////
      var user = new UserModel({"id":id});
      var authenicated = user.authenicate(password, results[0]._doc.salt, results[0]._doc.hashed_password);

      if(authenicated){
        console.log('비밀번호 일치함');
        callback(null, results);
      }else{
        console.log('비밀번호 일치하지 않음.');
        callback(null,null);
      }
    }else{
      console.log('아이디 일치하는 사용자 없음.');
      callback(null, null);
    }
  })
}//authUser End
//================================사용자 지정함수================================

var errorHandler = expressErrorHandler({
  static:{
    '404':'./public/404.html'
  }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);
