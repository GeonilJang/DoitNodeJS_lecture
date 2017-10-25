var require = function(path){
  var exports = {}
    exports.getUser = function(){
        return {id:'test01', name:'프리스틴'};
      };

    exports.group = {id:'group01', name:'친구'};

  return exports;
}

var user = require('...');

function showUser(){
  return user.getUser().id+', '+ user.group.name;
}

console.log('사용자 정보: '+showUser());
