var http = require('http');
var express = require('express');
require('custom-env').env('dev')

var app = express();

app.set('port', process.env.PORT || 3099); 

require('./app/routes')(app); 

http.createServer(app).listen(app.get('port'), function(){
	console.log('Waiting for call');
});
