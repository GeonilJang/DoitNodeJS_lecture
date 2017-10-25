function User(id, name){
  this.id = id;
  this.name = name;
}
//프로토 타입

User.prototype.getUser = function(){
  return {id:this.id, name:this.name};
}

User.prototype.group = {id:'group01', name:'Friends' };

User.prototype.printUser = function(){
  console.log('user 이름 : ' + this.name+ ', group : '+this.group.name);
}

module.exports = User;
