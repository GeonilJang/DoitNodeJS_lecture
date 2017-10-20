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
var mysql = require('mysql');
//Mysql데이터 베이스 설정
var pool = mysql.createPool({
  connectionLimit:10,
  host:'localhost',
  user:'root',
  password:'root!@#$',
  database:'test',
  debug:false
});

//express 객체 할당
var app = express();

//port 연결
app.listen(3000,function(){
	console.log("connected 3000 port");
})

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

  authUser(id, pw, function(err, rows){
      if(err){
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>에러발생</h1>');
        res.end();
        return;
      }
      if(rows){
        console.dir(rows);
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>사용자 : ' +rows[0].name+'</p></div>');
        res.write('<br><br><a href="/public/login.html">되돌아가기</a>');
        res.write('<br><br><a href="/process/listuser">목록보기</a>');
        res.end();
      }else{
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>사용자 데이터 조회안됨</h1>');
        res.end();
      }
    })
})

rt.route('/process/adduser').post(function(req, res){
  console.log('/process/adduser 라우팅 시작');

  var id = req.body.id || req.query.id;
  var pw1 = req.body.password || req.query.password;
  var name = req.body.name || req.query.name;
  var age = req.body.age || req.query.age;

  console.log('데이터 넘어옴 -> id : '+id+', pw : '+pw1+'name : '+name+'age : '+age);

  addUser(id , name, age, pw1,function(err, addedUser){
    if(err){
      console.log('에러발생');
      res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
      res.write('<h1>에러발생</h1>');
      res.end();
      return;
    }

    if(addedUser){
      console.dir(addedUser);
      res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
      res.write('<h1>사용자 추가 성공</h1>');
      res.write('<br><br><a href="/public/login.html">되돌아가기</a>');
      res.end();
    }else{
      console.log('에러발생');
      res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
      res.write('<h1>사용자 추가 안됨.</h1>');
      res.end();
      return;
    }
  });
})

rt.route('/process/listuser').get(function(req, res){
  console.log('/process/listuser 라우팅 시작');
  listUser(function(err, rows){
      if(err){
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>에러발생</h1>');
        res.end();
        return;
      }
      if(rows){
        console.dir(rows);
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<table border="1px">');
        res.write('<tr><th>이름</th><th>나이</th><th>아이디</th></tr>');
        for (var i = 0; i < rows.length; i++) {
          var id = rows[i].id;
          var name = rows[i].name;
          var age = rows[i].age;
          res.write('<tr>');
          res.write('<td>'+name+'</td>'+'<td>'+age+'</td>'+'<td>'+id+'</td>');
          res.write('</tr>');
        }
        res.write('</table>');
        res.write('<br><br><a href="/public/addUser2.html">추가</a>');
        res.end();
      }else{
        console.log('에러발생');
        res.writeHead(200, { "Content-Type":"text/html;charset=utf8"});
        res.write('<h1>사용자 데이터 조회안됨</h1>');
        res.end();
      }
    });
})
app.use('/',rt);


///////////////////////////////////////////////////////////////////////////////
var addUser = function(id, name, age, password, callback){
    console.log('addUser 호출됨.');
    pool.getConnection(function(err, conn){
      if(err){
        if(conn){
          conn.release();
        }
        callback(err,null);
        return;
      }
      console.log('데이터베이스 연결의 스레드 아이디 : '+conn.thredId);
      var data = {id:id, name:name, age:age, password:password};
      var exec = conn.query('insert into users set ?',data , function(err, result){
        conn.release();
        console.log('실행된 SQL: ' + exec.sql);
        if(err){
          console.log('sql 실행 시 에러 발생.');
          callback(err, null);
          return;
        }
        callback(null, result);
      });
    })
}

var listUser = function(callback){
    console.log('listUser 호출됨.');
    pool.getConnection(function(err, conn){
      if(err){
        if(conn){
          conn.release();
        }
        callback(err,null);
        return;
      }
      console.log('데이터베이스 연결의 스레드 아이디 : '+conn.thredId);
      var exec = conn.query("select * from users",function(err, rows){
        conn.release();
        console.log('실행된 SQL : '+ exec.sql);
        if(err){
          callback(err, null);
          return;
        }
        if(rows.length > 0){
          console.log('사용자 찾음.');
          callback(null, rows);
        }else{
          console.log('사용자 찾지 못함.');
          callback(null, null);
        }
      });
    })
}

var authUser = function(id, password, callback){
  console.log('authUser 호출됨 : '+id+", "+password);
  pool.getConnection(function(err, conn){
    if(err){
      if(conn){
        conn.release();
      }
      callback(err, null);
      return;
    }
    console.log('데이터베이스 연결 스레드 아이디: ' + conn.thredId);

    var tablename = "users";
    var columns = ['id','name','age'];
    var exec = conn.query("select ?? from ?? where id=? and password = ?",
    [columns, tablename, id, password], function(err, rows){
      conn.release();
      console.log('실행된 SQL : '+ exec.sql);
      if(err){
        callback(err, null);
        return;
      }
      if(rows.length > 0){
        console.log('사용자 찾음.');
        callback(null, rows);
      }else{
        console.log('사용자 찾지 못함.');
        callback(null, null);
      }
    });
  });
}//authUser End


var errorHandler = expressErrorHandler({
  static:{
    '404':'./public/404.html'
  }
})
app.use( expressErrorHandler.httpError(404));
app.use( errorHandler);
