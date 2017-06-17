var express = require('express');
var app = express();
var moment = require('moment');
var shortid = require('shortid');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

var users = [],
    connections = [],
    messages = [];

server.listen(8080);

io.sockets.on('connection', function(socket){

    connections.push(socket);
    console.log('New has connect. Total count users: ' + connections.length);

    // io.sockets.emit('get messages', messages);

    socket.emit('get messages', messages);

    socket.on('send message', function(data) {

        /** Data = {
          * _id = number;
          * message: '',
          * user: 'Alex',
          * type: 'message'
          * time: LT format
          * }
          */
        data._id = shortid.generate();
        data.time = moment().format('LT');
        messages.push(data);
        io.sockets.emit('new message', data)
    });

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(data));
        console.log('Some user has disconnect. Total count users: ' + connections.length);
    });

});




