"use strict";

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var cp = require("child_process");

app.use(express.static(__dirname));

app.get('/', function(request, response) {
	response.sendFile("index.html", {root: __dirname});
});

function computeInChild(data) {  
  var child = cp.fork(__dirname + "/js/child.js");
  child.on("message", function(msg) {    
    io.emit("chat message", msg);
    child.disconnect();
  });
  child.send(data);
}

io.on('connection', function(socket) {
	console.log('a user connected');	
	socket.on('disconnect', function() {
    	console.log('user disconnected');
  	});
	socket.on('chat message', function(msg) {
		if (msg.length > 0) {
  		computeInChild(msg);
  	}
	});  
});

http.listen(3000, function() {
	console.log('listening on *:3000');
});