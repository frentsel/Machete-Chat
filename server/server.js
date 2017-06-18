var express = require('express');
var app = express();
var moment = require('moment');
var shortid = require('shortid');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var fs = require('fs');
const jsonfile = require('jsonfile');

var connections = [];

var file = 'data.json';

var messages,
    _localMessages = [],
    newMessages = [];

jsonfile.readFile(file, function(err, obj) {
    messages = obj;
    _localMessages = obj.slice(0);
});


server.listen(8080);

io.sockets.on('connection', function(socket){

    connections.push(socket);

    socket.on('getAll', function (limit) {
        socket.emit('_getAll', messages.slice( -(limit) ));
    });

    socket.on('getPage', function (params) {
        var offset = parseInt(params.offset),
            limit = parseInt(params.limit),
            data = messages.slice(   - offset - limit,   - offset  );
        socket.emit('_getPage', data);
    });

    socket.on('send message', function(data) {
        data.id = shortid.generate();
        data.time = moment().unix();
        data._id = messages.length + 1;
        io.sockets.emit('new message', data);
        messages.push(data);
        newMessages.push(data);
    });


    socket.on('haveNewMessage', function (data){
        console.log('Новый запрос на сообщения от: ', data);
        if(newMessages.length) {
            for(var i = 0; i < newMessages.length; i++) {
                socket.emit('_haveNewMessage', newMessages[i]);
            }
            newMessages = [];
        }
    });

    setInterval(function () {

        if(JSON.stringify(_localMessages) === JSON.stringify(messages)){
            return false;
        }

        _localMessages = messages.slice(0);

        jsonfile.writeFile(file, messages, function (err) {
            if(err) throw new Error(err);
        });

    }, 2000);

    socket.on('typing', function (data) {
       io.sockets.emit('input', data)
    });

    socket.on('disconnect', function(data) {
        connections.splice(connections.indexOf(data));
    });

});
