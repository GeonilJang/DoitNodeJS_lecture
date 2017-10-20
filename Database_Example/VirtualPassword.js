var mongoose =require('mongoose');

var database;
var UserSchema;
var UserModel;

//============================데이터 베이스 연결============================
function connectDB(){
  var databaseUrl = 'mongodb://localhost:27017/local';//데이터 베이스의 URL
  mongoose.Promise = global.Promise; //몽구스기본 사용법01
  mongoose.connect(databaseUrl);//몽구스기본 사용법02(url 연결)
  database = mongoose.connection;//몽구스기본 사용법03(db 연결)

//====================.on(opne)연결될때 함수 실행 및 테이블 설정====================
  database.on('open', function(){
    console.log('데이터 베이스에 연결됨 : '+ databaseUrl);
      createUserSchema();
      doTest();
  });
  database.on('disconnected', function(){
    console.log('데이터베이스 연결 끊어짐.');
  });
  database.on('error', console.error.bind(console, 'mongoose 연결에러' ));
  }
//============================데이터 베이스 연결 end============================


//== 사용자 지정 함수 ===
function createUserSchema(){
  UserSchema  = mongoose.Schema({
    id: {type:String, required:true, unique:true},
    name: {type:String, index:'hashed'},
    password: {type:String, required:'true'},
    age: {type:Number, 'default':-1},
    created_at:{type:Date, index:{unique:false},
    'default':Date.now()},
    updated_at:{type:Date, index:{unique:false},
    'default':Date.now()}
  });
console.log('UserSchema 정의함.');

UserSchema.virtual('info')
  .set(function(info){
    var splitted = info.split(' ');
    this.id = splitted[0];
    this.name = splitted[1];
    console.log('virtual info 속성 설정됨 : '+ this.id +", "+this.name);
  })
  .get(function() { return this.id+", "+this.name});

UserModel = mongoose.model("user4", UserSchema);
console.log('UserModel 정의함');
}


function doTest(){
  var user = new UserModel({"info":"test01 소녀시대"});
  user.save(function(err){
    if(err){
      console.log('error 발생');
      return;
    }
    console.log('데이터 추가함');
  });
}

connectDB();
//== 사용자 지정 함수 end===
