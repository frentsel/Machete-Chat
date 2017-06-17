var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var db = require('./utils/DataBaseUtils');

var users = [],
    connections = [],
    messages = [];

db.connect();
server.listen(8090);

io.sockets.on('connection', function(socket){

    connections.push(socket);
    console.log('New has connect. Total count users: ' + connections.length);

    io.sockets.emit('new messages', messages);

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(data));
        console.log('Some user has disconnect. Total count users: ' + connections.length);
    });

    socket.on('send message', function(data) {
        db.addMessage(data);
        messages.push(data);
        io.sockets.emit('new message', {msg: data})
    })

});




