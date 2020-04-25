var http = require('http');
var https = require('https');
var fs = require('fs');

var server = http.createServer(function(req, res){
	var path = '/'+req.url.split(/\/|\?/)[1];
	console.log('received request of path: '+ req.url + ' parsed to: '+path );
	switch(path){
		case '/':
			var stream = fs.createReadStream(__dirname+'/index.html');
			stream.pipe(res);
			break;
		case '/blog':
			res.end('<link rel="alternate" type="application/rss+xml" title="Hongkiat &raquo; Feed" href="https://www.hongkiat.com/blog/feed/" />');
			break;
		case '/feed':
			rssCall(function(err, result){
				res.end(result);	
			});	
			break;
		default: 
			res.statusCode = 404;
			res.end('404: not found');

	}
}).listen(3000, function(){
	console.log('server running on 3000');
})

function rssCall(cb){
	var options = {
		  host: 'www.hongkiat.com',
		  port: 443,
		  path: '/blog/feed/',
		  method: 'GET'
		};
		var body = '';
		var req = https.request(options, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  console.log('HEADERS: ' + JSON.stringify(res.headers));
		  res.setEncoding('utf8');
		  
		  res.on('data', function (chunk) {
		    body += chunk;
		  });
		  res.on('end', function(){
		  	console.log('body: ', body);
		  	return cb(null, body);
		  })
		});

		req.on('error', function(e) {
		  console.log('problem with request: ' + e.message);
		});

		// write data to request body
		req.write('data\n');
		req.write('data\n');
		req.end();
}