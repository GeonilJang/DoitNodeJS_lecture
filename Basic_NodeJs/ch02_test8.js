var path = require('path');

var directories = ['Users', 'geonil', 'docs'];
var dirStr = directories.join();
console.log('dir : '+dirStr);

var dirStr2 = directories.join(path.sep);
console.log('dir2 : ' + dirStr2);

