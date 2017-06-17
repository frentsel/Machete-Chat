var express = require('express');
var app = express();
var moment = require('moment');
var shortid = require('shortid');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
var db = require('./utils/DataBaseUtils');

db.connect();

var users = [],
    connections = [],
    messages = [];

server.listen(8080);

io.sockets.on('connection', function(socket){

    connections.push(socket);
    console.log('New has connect. Total count users: ' + connections.length);

    socket.on('getAll', function (limit) {
        var messages = db.getMessages();
        // socket.emit('_getAll', messages.slice(-(limit)));
    });

    socket.on('getPage', function (params) {
        socket.emit('_getPage', messages.slice(params.offset, params.limit));
    });

    socket.on('send message', function(data) {

        /** Data = {
          * _id = number;
          * message: '',
          * user: 'Alex',
          * type: 'message'
          * time: LT format
          * }
          */

        data.id = shortid.generate();
        data.time = moment().format('LT');

        io.sockets.emit('new message', data);

        db.addMessage(data);

    });

    socket.on('typing', function (data) {
       io.sockets.emit('input', data)
    });

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(data));
        console.log('Some user has disconnect. Total count users: ' + connections.length);
    });

});




