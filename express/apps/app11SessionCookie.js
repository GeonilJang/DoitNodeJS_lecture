var express = require('express');
var bodyParser = require('body-parser');
var static = require('serve-static');
var path = require('path');
var cookieParser = require('cookie-parser');

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
app.use(cookieParser());

app.get('/process/setUserCookie', function(req, res){
    console.log('/process/setUserCookie 라우팅');
    
    res.cookie('user', {
        id:'jgi',
        name:'건일',
        authorized:true
    })
    
    res.redirect('/process/showCookie');
})

app.get('/process/showCookie', function(req, res){
    console.log('/process.showCookie 라우팅');
    res.send(req.cookies);
    

})
