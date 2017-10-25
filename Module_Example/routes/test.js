var test1 = function(req ,res){
	console.log('module in test1 starts');

	var context = {};
	req.app.render('tesT1_success', context, function(err, html){
		console.log('HTML -> '+ html);

		res.writeHead(200, {'Content-Type':'text/html;charset=utf8'});
		res.end(html);

	})

	
}

module.exports.test1 = test1;