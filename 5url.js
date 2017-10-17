var url = require("url");

var urlStr = "https://www.google.co.kr/search?q=popcorn&oq=popcorn&aqs=chrome..69i57j0l5.3819j0j8&sourceid=chrome&ie=UTF-8";

var curUrl = url.parse(urlStr);
console.dir(curUrl);

console.log('query ->' + curUrl.query);
var curStr = url.format(curUrl);
console.log('url ->' + curStr);

var queryString = require('querystring');
var params = queryString.parse(curUrl.query);
console.log('검색어 = '+ params.query);