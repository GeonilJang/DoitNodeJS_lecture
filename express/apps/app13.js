var express = require('express');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');
var expressSession = require('express-session');
var multer = require('multer');
var fs = require('fs');
var cors = require('cors');


var app = express();
app.listen(3000, function(req ,res){
    console.log("3000 port connected");
})

/*
app.use(badyParser.urlencoded({ extended: false}));
app.use(express.static('public'));
app.set('view engine', 'jade');
app.set('views','./views');
*/

app.use(bodyParser.urlencoded({extended:false}));
app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());
app.use(expressSession({
        secret: 'my key',
        resave: true,
        saveUninitialized:true
        }));

app.use(cors());

multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, 'uploads');
    },
    file:function(req, file, callback){
        var extent\sion = path.extname(file.originalname);
        var basename = path.basename(file.originalname, extension);
        callback(null, basename + Data.now() + extension);
    }
});

var upload = multer({
    storage:storage,
    limits:{
        file:10,
        fileSize:1024*1024*1024
    }
})

app.post('/process/photo', upload.array('photo',1),function(req, res){

})


app.get('/process/product', function(req,res){
    console.log('/process/product 라우팅');
    if(req.session.user){
        res.redirect('/public/product.html')
    }else{
        res.redirect('public/login2.html')
    }
})

app.post('/process/login', function(req, res){
    console.log('/process/login 라우팅');
    
    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;
    console.log('요청파라미터 : '+paramId+", "+paramPassword);
    
    if(req.session.user){
        console.log('이미 로그인되어 있습니다.');
        res.redirect('/public/product.html');
    }else{
            res.session.user = {
            id:paramId,
            name:'건일',
            authorized:true
        };
        
        res.writeHead(200, {"Content-Type":"text/html;charset=utf8"});
        res.write('<h1>로그인 성공</h1>');
        res.write('<P>아이디 :'+paramId+'</h1>');
        res.write('<br><br><a href="/public/product.html">상품 페이지로 이동하기</a>');
    }
})


app.get('/process/logout', function(req, res){
    console.log('/process/logout 라우팅')
    
    if(req.session.user){
        console.log('로그아웃합니다.')
        
        req.session.destroy(function(err){
            if(err){
                console.log('세션 삭제 시 에러 발생.');
                return;
            }
        })
    }else{
        console.log('세션삭제성공');
        res.redirect('/public/login2.html');
    }
})


//app.get('/process/setUserCookie', function(req, res){
//    console.log('/process/setUserCookie 라우팅');
//    
//    res.cookie('user', {
//        id:'jgi',
//        name:'건일',
//        authorized:true
//    })
//    
//    res.redirect('/process/showCookie');
//})
//
//app.get('/process/showCookie', function(req, res){
//    console.log('/process.showCookie 라우팅');
//    res.send(req.cookies);
//    })
