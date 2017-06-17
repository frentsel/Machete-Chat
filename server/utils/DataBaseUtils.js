var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/myappdatabase');
var Messages = require('../models/Messages');


var db = {
    connect: function (){
        mongoose.Promise = global.Promise;
        mongoose.connect('mongodb://localhost/myappdatabase');

    },
    addMessage: function (data){
        var newMessage = Messages({
            user: data.user,
            message:  data.message,
            id: data.id,
            time: data.time
        });
        newMessage.save(function (err)
        {
            if(err) throw  err;
            console.log('New message')
        })
    },
    getMessages: function () {
        console.log(Messages.find().limit(20));
    }
    
};


module.exports = db;
