module.exports = {
	server_port: 3000,
	db_url: 'mongodb://localhost:27017/local',
	db_schemas: [
	    {file:'../database/user_schema', collection:'users001', schemaName:'UserSchema', modelName:'UserModel'}
	],
	route_info: [
	    //===== User =====//
	    {file:'../routes/user', path:'/process/login', method:'login', type:'post'}					// user.login 
	    ,{file:'../routes/user', path:'/process/adduser', method:'adduser', type:'post'}				// user.adduser 
	    ,{file:'../routes/user', path:'/process/listuser', method:'listuser', type:'post'}			// user.listuser 
        
	    //===== Test =====//
	    ,{file:'./test', path:'/process/test1', method:'test1', type:'post'}
	]
}